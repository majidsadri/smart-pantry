from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Set your OpenAI API key (make sure to export this as an environment variable)
openai.api_key = os.getenv("OPENAI_API_KEY")

# Function to get GPT suggestions based on pantry items and diet preferences
# Function to get GPT suggestions based on pantry items and diet preferences
# Function to get GPT suggestions based on pantry items and diet preferences
# Function to get GPT suggestions based on pantry items and diet preferences
def get_gpt_suggestions(pantry_items, diet, restrictions):
    # Create a flexible and structured prompt for GPT
    prompt = f"Based on the following pantry items: {', '.join(pantry_items)}, suggest 10 simple and unique recipes."

    if diet and diet.lower() != "none":
        # Modify this part to allow GPT more flexibility
        prompt += f" The recipes should be suitable for a {diet} diet, but you can be flexible with the ingredients."

    if restrictions:
        prompt += f" Also, consider the following dietary restrictions: {restrictions}."

    # Specify the format again
    prompt += """
    Provide each recipe in the following format:
    Title: Recipe Name
    Instructions: Step-by-step instructions.
    """

    logging.info(f"GPT Prompt: {prompt}")

    try:
        # Call the OpenAI API using the 'gpt-3.5-turbo' model
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "You are a helpful assistant that suggests recipes."},
                      {"role": "user", "content": prompt}]
        )

        suggestions = response['choices'][0]['message']['content'].strip()

        # Split suggestions into individual recipes
        recipe_list = suggestions.split("\n")
        final_recipes = []
        current_recipe = {"title": "", "instructions": ""}

        for line in recipe_list:
            if line.startswith("Title:"):
                if current_recipe["title"]:  # If a recipe already exists, add it to final_recipes
                    final_recipes.append(current_recipe)
                current_recipe = {"title": line.replace("Title:", "").strip(), "instructions": ""}
            elif line.startswith("Instructions:"):
                current_recipe["instructions"] = line.replace("Instructions:", "").strip()
            else:
                current_recipe["instructions"] += " " + line.strip()  # Append additional instruction lines

        # Add the last recipe
        if current_recipe["title"]:
            final_recipes.append(current_recipe)

        if len(final_recipes) > 0:
            return final_recipes
        else:
            return [{"title": "No recipes available", "instructions": "Sorry, we couldn't generate recipes based on the current inputs."}]
    except Exception as e:
        logging.error(f"Error getting GPT suggestions: {e}")
        return [{"title": "Error", "instructions": "Error generating suggestions."}]



@app.route('/recommend', methods=['POST'])
def recommend():
    # Get pantry items, diet, and restrictions from the request
    pantry_items = request.json.get('pantry', [])
    diet = request.json.get('diet', "None")
    restrictions = request.json.get('restrictions', "")

    logging.info(f"Pantry Items: {pantry_items}")
    logging.info(f"Diet: {diet}")
    logging.info(f"Restrictions: {restrictions}")

    if not pantry_items:
        logging.error("No pantry items provided. Cannot generate recommendations.")
        return jsonify({"error": "No pantry items provided."}), 400

    # Get GPT-based recipe suggestions
    gpt_suggestions = get_gpt_suggestions(pantry_items, diet, restrictions)
    
    # If GPT fails to provide valid suggestions, fallback to error
    if len(gpt_suggestions) == 0 or "Error" in gpt_suggestions[0]["title"]:
        return jsonify({"suggestions": [{"title": "No recipes available", "instructions": "Sorry, we couldn't generate recipes based on the current inputs."}]}), 200

    logging.info(f"GPT suggestions: {gpt_suggestions}")

    # Return the suggestions in a JSON response
    return jsonify({"suggestions": gpt_suggestions})


if __name__ == '__main__':
    app.run(port=5001, debug=True)
