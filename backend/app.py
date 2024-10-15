from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import logging
import openai

app = Flask(__name__)
CORS(app)

# Load OpenAI API key from environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")

# Path to the JSON file where profile data will be stored
PROFILE_FILE_PATH = 'profile_data.json'

# Enable logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Function to save profile data to the JSON file
def save_profile_data(profile_data):
    try:
        with open(PROFILE_FILE_PATH, 'w') as file:
            json.dump(profile_data, file)
        return True
    except Exception as e:
        logging.error(f"Error saving profile data: {e}")
        return False

# Function to load profile data from the JSON file
def load_profile_data():
    if os.path.exists(PROFILE_FILE_PATH):
        with open(PROFILE_FILE_PATH, 'r') as file:
            return json.load(file)
    else:
        return {"diet": "None", "restrictions": "", "usualMeals": ""}  # Default values

# Endpoint to save the profile information
@app.route('/save_profile', methods=['POST'])
def save_profile():
    profile_data = request.json
    if save_profile_data(profile_data):
        return jsonify({"status": "Profile saved successfully."}), 200
    else:
        return jsonify({"status": "Error saving profile."}), 500

# Endpoint to get profile information
@app.route('/get_profile', methods=['GET'])
def get_profile():
    profile_data = load_profile_data()
    return jsonify(profile_data), 200

# Function to translate the instructions to Persian using GPT
def translate_to_persian(text):
    translation_prompt = f"Please translate the following text into Persian:\n{text}"
    logging.info(f"Translation Prompt: {translation_prompt}")
    
    try:
        translation_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a translator."},
                {"role": "user", "content": translation_prompt}
            ]
        )
        persian_translation = translation_response.choices[0].message['content'].strip()
        logging.info(f"Persian Translation: {persian_translation}")
        return persian_translation
    except Exception as e:
        logging.error(f"Error translating to Persian: {e}")
        return "Error in translation."

# Endpoint to generate recipe suggestions based on the user's pantry and preferences
# Endpoint to generate recipe suggestions based on the user's pantry and preferences
@app.route('/recommend', methods=['POST'])
def recommend():
    pantry_items = request.json.get('pantry', [])
    profile_data = load_profile_data()

    # Extract the names of the pantry items
    pantry_item_names = [item['name'] if isinstance(item, dict) else item for item in pantry_items]

    # Handle case where no pantry items are provided
    if not pantry_item_names:
        return jsonify({"suggestions": [{"title": "No pantry items provided", "instructions": "Please provide pantry items to generate recipes."}]})

    diet = profile_data.get('diet', 'None')
    restrictions = profile_data.get('restrictions', '')
    usual_meals = profile_data.get('usualMeals', '')

    # Construct the prompt for OpenAI GPT-3.5
    prompt = f"Based on the following pantry items: {', '.join(pantry_item_names)}, suggest 10 simple and unique recipes."
    if diet and diet.lower() != "none":
        prompt += f" The recipes should be suitable for a {diet} diet."
    if restrictions:
        prompt += f" Also, consider these dietary restrictions: {restrictions}."
    if usual_meals and usual_meals.lower() != "none":
        prompt += f" The recipes should focus on {usual_meals} meals."

    prompt += """
    Provide each recipe in the following format:
    Title: Recipe Name
    Instructions: Step-by-step instructions.
    Cooking Time: Estimated cooking time in minutes.
    Calories: Estimated calories per serving.
    """

    # Log the constructed prompt for debugging
    logging.info(f"GPT Prompt: {prompt}")

    try:
        # Call OpenAI's GPT-3.5 to get recipe suggestions
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that suggests recipes."},
                {"role": "user", "content": prompt}
            ]
        )

        # Extract the suggestions from the API response
        suggestions = response.choices[0].message['content']

        # Log the full response for debugging
        logging.info(f"GPT Response: {suggestions}")

        # Process the response into a list of recipes
        recipe_list = suggestions.split("\n")
        final_recipes = []
        current_recipe = {"title": "", "instructions": "", "cooking_time": "", "calories": ""}

        for line in recipe_list:
            if line.startswith("Title:"):
                if current_recipe["title"]:  # If a recipe is already populated, append it to final_recipes
                    final_recipes.append(current_recipe)
                current_recipe = {"title": line.replace("Title:", "").strip(), "instructions": "", "cooking_time": "", "calories": ""}
            elif line.startswith("Instructions:"):
                current_recipe["instructions"] = line.replace("Instructions:", "").strip()
            elif line.startswith("Cooking Time:"):
                current_recipe["cooking_time"] = line.replace("Cooking Time:", "").strip()
            elif line.startswith("Calories:"):
                current_recipe["calories"] = line.replace("Calories:", "").strip()
            else:
                current_recipe["instructions"] += " " + line.strip()  # Append additional lines to the instructions

        # Add the last recipe
        if current_recipe["title"]:
            final_recipes.append(current_recipe)

        if len(final_recipes) > 0:
            return jsonify({"suggestions": final_recipes})
        else:
            return jsonify({"suggestions": [{"title": "No recipes available", "instructions": "Sorry, we couldn't generate recipes based on the current inputs."}]})

    except openai.error.OpenAIError as e:
        logging.error(f"OpenAI API error: {e}")
        return jsonify({"suggestions": [{"title": "Error", "instructions": "There was an error generating the suggestions."}]})

    except Exception as e:
        logging.error(f"General error: {e}")
        return jsonify({"suggestions": [{"title": "Error", "instructions": "Error generating suggestions."}]})




if __name__ == '__main__':
    app.run(port=5001, debug=True)

