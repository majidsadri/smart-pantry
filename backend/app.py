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
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def save_all_profiles(profiles):
    try:
        with open(PROFILE_FILE_PATH, 'w') as file:
            json.dump({"profiles": profiles}, file, indent=4)
        logging.debug(f"Profiles saved: {profiles}")
        return True
    except Exception as e:
        logging.error(f"Error saving profile data: {e}")
        return False

def load_all_profiles():
    try:
        if os.path.exists(PROFILE_FILE_PATH):
            with open(PROFILE_FILE_PATH, 'r') as file:
                data = json.load(file)
                logging.debug(f"Loaded profile data: {data}")
                return data.get("profiles", [])
        else:
            logging.warning("Profile data file does not exist. Returning empty list.")
            return []
    except Exception as e:
        logging.error(f"Error reading profile data: {e}")
        return []

@app.route('/save_profile', methods=['POST'])
def save_profile():
    profile_data = request.json
    profile_name = profile_data.get("name")

    if not profile_name:
        return jsonify({"status": "Profile name is required."}), 400

    logging.debug(f"Received profile data for saving: {profile_data}")

    profiles = load_all_profiles()
    existing_profile = next((p for p in profiles if p["name"] == profile_name), None)
    if existing_profile:
        profiles = [p for p in profiles if p["name"] != profile_name]
        profiles.append(profile_data)
        logging.info(f"Updated profile for '{profile_name}'.")
    else:
        profiles.append(profile_data)
        logging.info(f"Added new profile for '{profile_name}'.")

    if save_all_profiles(profiles):
        return jsonify({"status": "Profile saved successfully."}), 200
    else:
        return jsonify({"status": "Error saving profile."}), 500

@app.route('/get_profiles', methods=['GET'])
def get_profiles():
    profiles = load_all_profiles()
    if profiles:
        logging.info(f"Profile data retrieved: {profiles}")
        return jsonify(profiles), 200
    else:
        logging.warning("No profiles found. Returning empty list.")
        return jsonify([]), 200

@app.route('/get_profile', methods=['GET'])
def get_profile():
    profile_name = request.args.get('name')
    profiles = load_all_profiles()

    if profile_name:
        profile = next((p for p in profiles if p["name"] == profile_name), None)
        if profile:
            logging.info(f"Profile data retrieved for '{profile_name}': {profile}")
            return jsonify(profile), 200
        else:
            logging.warning(f"No profile found for '{profile_name}'. Returning default values.")
            return jsonify({"diet": "None", "restrictions": "", "usualMeals": "Regular"}), 200
    else:
        logging.warning("Profile name not provided in request. Returning first profile or default.")
        return jsonify(profiles[0] if profiles else {"diet": "None", "restrictions": "", "usualMeals": "Regular"}), 200

@app.route('/activate_profile', methods=['POST'])
def activate_profile():
    profile_name = request.json.get("name")

    if not profile_name:
        return jsonify({"status": "Profile name is required."}), 400

    profiles = load_all_profiles()
    for profile in profiles:
        profile["activated"] = profile["name"] == profile_name

    if save_all_profiles(profiles):
        return jsonify({"status": f"Profile '{profile_name}' activated successfully."}), 200
    else:
        return jsonify({"status": "Error activating profile."}), 500

@app.route('/get_tip', methods=['GET'])
def get_tip():
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a fun and humorous assistant that provides cooking tips."},
                {"role": "user", "content": "Please provide a short and practical cooking tip that is funny and light-hearted."}
            ]
        )
        tip = response.choices[0].message['content'].strip() + " 😂👩‍🍳"
        logging.info(f"Generated cooking tip: {tip}")
        return jsonify({"tip": tip}), 200
    except openai.error.OpenAIError as e:
        logging.error(f"OpenAI API error: {e}")
        return jsonify({"tip": "Couldn't fetch a tip at this time, please try again later. 😅"}), 500
    except Exception as e:
        logging.error(f"General error: {e}")
        return jsonify({"tip": "Error generating a cooking tip."}), 500

@app.route('/recommend', methods=['POST'])
def recommend():
    pantry_items = request.json.get('pantry', [])
    profile_name = request.json.get('profileName')
    logging.info(f"Received pantry items: {pantry_items}")
    logging.info(f"Received profile name: {profile_name}")

    profiles = load_all_profiles()
    pantry_item_names = [item['name'] if isinstance(item, dict) else item for item in pantry_items]

    # Check if pantry items are provided
    if not pantry_item_names:
        return jsonify({
            "suggestions": [{
                "title": "No pantry items provided",
                "instructions": "Please provide pantry items to generate recipes."
            }]
        }), 400

    # Look for an activated profile with the given profile name if profile_name is not None
    if profile_name and profile_name.lower() != 'none':
        profile_data = next(
            (p for p in profiles if p["name"].lower() == profile_name.lower() and p.get("activated")),
            None
        )
    else:
        profile_data = None

    # Default to basic values if no activated profile is found
    if not profile_data:
        logging.warning(f"No activated profile found for '{profile_name}'. Using default values.")
        profile_data = {
            "diet": "None",
            "restrictions": "",
            "usualMeals": "Regular"
        }

    # Extract profile details for constructing the query
    diet = profile_data.get('diet', 'None')
    restrictions = profile_data.get('restrictions', '')
    usual_meals = profile_data.get('usualMeals', 'Regular')
    logging.info(f"Diet: {diet}, Restrictions: {restrictions}, Usual Meals: {usual_meals}")

    # Build the prompt for OpenAI
    prompt = f"Based on the following pantry items: {', '.join(pantry_item_names)}, suggest 7 simple and unique recipes."
    if diet.lower() != "none":
        prompt += f" The recipes should be suitable for a {diet} diet."
    if restrictions:
        prompt += f" Also, consider these dietary restrictions: {restrictions}."
    if usual_meals.lower() != "none":
        if usual_meals.lower() == "persian":
            prompt += " The recipes should focus on Irooni traditional food."
        else:
            prompt += f" The recipes should focus on {usual_meals} meals."

    prompt += """
    Provide each recipe in the following format:
    Title: Recipe Name
    Instructions: Step-by-step instructions.
    Cooking Time: Estimated cooking time in minutes.
    Calories: Estimated calories per serving.
    """
    logging.info(f"GPT Prompt: {prompt}")

    # Send the prompt to OpenAI and process the response
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that suggests recipes."},
                {"role": "user", "content": prompt}
            ]
        )
        suggestions = response.choices[0].message['content']
        logging.info(f"GPT Response: {suggestions}")

        # Parse the response into structured recipe objects
        recipe_list = suggestions.split("\n")
        final_recipes = []
        current_recipe = {"title": "", "instructions": "", "cooking_time": "", "calories": ""}

        for line in recipe_list:
            if line.startswith("Title:"):
                if current_recipe["title"]:
                    final_recipes.append(current_recipe)
                current_recipe = {"title": line.replace("Title:", "").strip(), "instructions": "", "cooking_time": "", "calories": ""}
            elif line.startswith("Instructions:"):
                current_recipe["instructions"] = line.replace("Instructions:", "").strip()
            elif line.startswith("Cooking Time:"):
                current_recipe["cooking_time"] = line.replace("Cooking Time:", "").strip()
            elif line.startswith("Calories:"):
                current_recipe["calories"] = line.replace("Calories:", "").strip()
            else:
                current_recipe["instructions"] += " " + line.strip()

        if current_recipe["title"]:
            final_recipes.append(current_recipe)

        return jsonify({"suggestions": final_recipes}), 200
    except openai.error.OpenAIError as e:
        logging.error(f"OpenAI API error: {e}")
        return jsonify({
            "suggestions": [{"title": "Error", "instructions": "There was an error generating the suggestions."}]
        }), 500
    except Exception as e:
        logging.error(f"General error: {e}")
        return jsonify({
            "suggestions": [{"title": "Error", "instructions": "Error generating suggestions."}]
        }), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
