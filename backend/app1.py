from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import requests
import logging
import re
import os
import kaggle

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Function to download the dataset from Kaggle if it doesn't exist locally
def download_recipe_dataset():
    dataset_path = './RecipeNLG_dataset.csv'
    
    if not os.path.exists(dataset_path):
        logging.info("Downloading dataset from Kaggle...")
        try:
            kaggle.api.dataset_download_files('paultimothymooney/recipenlg', path='./', unzip=True)
            logging.info("Dataset downloaded successfully!")
        except Exception as e:
            logging.error(f"Error downloading dataset: {e}")
    else:
        logging.info(f"Dataset {dataset_path} already exists!")

# Download the dataset if necessary
download_recipe_dataset()

# Load the RecipeNLG dataset
file_path = 'RecipeNLG_dataset.csv'
logging.info(f"Loading RecipeNLG dataset from {file_path}...")

try:
    df = pd.read_csv(file_path, usecols=['title', 'NER'], nrows=1000)  # Use a subset for faster testing
    df.rename(columns={'title': 'recipe_name', 'NER': 'ingredients'}, inplace=True)
    logging.info(f"Data loaded successfully! Number of recipes loaded: {len(df)}")
except Exception as e:
    logging.error(f"Error loading dataset: {e}")
    df = pd.DataFrame()

# Preprocess the ingredients to clean up and standardize formatting
def preprocess_ingredients(ingredient_list):
    # Remove quantities and special characters, convert to lowercase
    cleaned_ingredients = [re.sub(r'[^a-zA-Z\s]', '', ing).lower().strip() for ing in eval(ingredient_list)]
    return ' '.join(cleaned_ingredients)

# Apply preprocessing to the ingredients column
logging.info("Preprocessing ingredients...")
df['ingredients'] = df['ingredients'].apply(preprocess_ingredients)
logging.info(f"Sample preprocessed ingredients: {df['ingredients'].head(5)}")

# Initialize CountVectorizer
logging.info("Initializing CountVectorizer and computing similarity matrix...")
count = CountVectorizer()
count_matrix = count.fit_transform(df['ingredients'])

logging.info("CountVectorizer initialized and similarity matrix computed successfully.")

# Function to generate recommendations
def get_recommendations(pantry_items, count, count_matrix, df):
    # Preprocess the pantry items to match the ingredient format
    pantry_string = ' '.join([re.sub(r'[^a-zA-Z\s]', '', item).lower().strip() for item in pantry_items])
    logging.info(f"Generating recommendations for pantry items: {pantry_string}")

    # Vectorize the pantry items
    pantry_vec = count.transform([pantry_string])
    logging.debug(f"Vectorized pantry items: {pantry_vec}")

    # Calculate similarity with each recipe
    pantry_sim = cosine_similarity(pantry_vec, count_matrix)
    logging.debug(f"Similarity scores: {pantry_sim}")

    # Sort recipes based on similarity scores
    similar_indices = pantry_sim[0].argsort()[-5:][::-1]
    logging.info(f"Top similar recipe indices: {similar_indices}")

    # Get top 5 recipes and their similarity scores
    similar_recipes = df.iloc[similar_indices].copy()
    similar_recipes['similarity_score'] = pantry_sim[0][similar_indices]

    # Print the recipes and similarity scores for debugging
    logging.info(f"Matching recipes:\n{similar_recipes[['recipe_name', 'ingredients', 'similarity_score']]}")

    # Filter recipes with a similarity score above a certain threshold
    filtered_recipes = similar_recipes[similar_recipes['similarity_score'] > 0.0]
    logging.info(f"Number of recommended recipes: {len(filtered_recipes)}")

    # Return the filtered recommended recipes
    return filtered_recipes[['recipe_name', 'ingredients']].to_dict(orient='records')

@app.route('/recommend', methods=['POST'])
def recommend():
    # Get pantry items from the request body
    pantry_items = request.json.get('pantry', [])
    logging.info(f"Pantry Items from Request: {pantry_items}")

    # Ensure that the DataFrame is not empty
    if df.empty:
        logging.error("Recipe dataset is empty. Cannot generate recommendations.")
        return jsonify([])

    # Get recommendations based on the pantry items
    recommendations = get_recommendations(pantry_items, count, count_matrix, df)
    logging.info(f"Recommendations generated successfully: {recommendations}")
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(port=5001, debug=True)
