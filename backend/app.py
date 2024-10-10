# backend/app.py
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

app = Flask(__name__)

# Sample Recipe Dataset
data = {
    'recipe_id': [1, 2, 3, 4, 5],
    'recipe_name': ['Tomato Soup', 'Chicken Salad', 'Veggie Pasta', 'Pancakes', 'Grilled Cheese'],
    'ingredients': ['Tomato, Onion, Garlic', 'Chicken, Lettuce, Cucumber', 'Pasta, Tomato, Basil',
                    'Flour, Milk, Egg', 'Bread, Cheese, Butter']
}

# Create a DataFrame
df = pd.DataFrame(data)

# Vectorize the ingredients
count = CountVectorizer()
count_matrix = count.fit_transform(df['ingredients'])

# Calculate the cosine similarity matrix
cosine_sim = cosine_similarity(count_matrix, count_matrix)

def get_recommendations(pantry_items, df, cosine_sim):
    # Convert pantry items to a single string
    pantry_string = ', '.join(pantry_items)
    
    # Vectorize the pantry items
    pantry_vec = count.transform([pantry_string])

    # Calculate similarity with each recipe
    pantry_sim = cosine_similarity(pantry_vec, count_matrix)
    
    # Get top 5 recipe indices
    similar_indices = pantry_sim[0].argsort()[-5:][::-1]

    # Return the recommended recipes
    return df.iloc[similar_indices][['recipe_name', 'ingredients']].to_dict(orient='records')

# Define an endpoint for recipe recommendations
@app.route('/recommend', methods=['POST'])
def recommend():
    # Get pantry items from the request body
    pantry_items = request.json.get('pantry', [])
    recommendations = get_recommendations(pantry_items, df, cosine_sim)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(port=5001, debug=True)
