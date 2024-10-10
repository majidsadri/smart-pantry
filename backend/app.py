from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Function to fetch recipes dynamically from json-server
def fetch_recipes():
    response = requests.get("http://localhost:5000/recipes")
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching recipes: {response.status_code}")
        return []

def get_recommendations(pantry_items, count, count_matrix, df):
    # Convert pantry items to a single string
    pantry_string = ', '.join(pantry_items)
    print(f"Pantry Items Received: {pantry_string}")  # Debugging print statement

    # Vectorize the pantry items
    pantry_vec = count.transform([pantry_string])

    # Calculate similarity with each recipe
    pantry_sim = cosine_similarity(pantry_vec, count_matrix)

    # Sort recipes based on similarity scores
    similar_indices = pantry_sim[0].argsort()[-5:][::-1]
    
    # Get top 5 recipes and their similarity scores
    similar_recipes = df.iloc[similar_indices]
    similar_recipes['similarity_score'] = pantry_sim[0][similar_indices]
    
    # Filter recipes with a similarity score above a certain threshold
    filtered_recipes = similar_recipes[similar_recipes['similarity_score'] > 0.1]
    
    # Return the filtered recommended recipes
    return filtered_recipes[['recipe_name', 'ingredients']].to_dict(orient='records')

@app.route('/recommend', methods=['POST'])
def recommend():
    # Get pantry items from the request body
    pantry_items = request.json.get('pantry', [])
    print(f"Pantry Items from Request: {pantry_items}")  # Debugging print statement

    # Fetch recipes from the json-server
    recipes = fetch_recipes()

    # Create a DataFrame from the fetched recipes
    df = pd.DataFrame(recipes)

    # Ensure that the DataFrame is not empty
    if df.empty:
        return jsonify([])

    # Vectorize the ingredients of the recipes
    count = CountVectorizer()
    count_matrix = count.fit_transform(df['ingredients'])

    # Get recommendations based on the pantry items
    recommendations = get_recommendations(pantry_items, count, count_matrix, df)
    print(f"Recommendations: {recommendations}")  # Debugging print statement
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(port=5001, debug=True)
