import pandas as pd
import json
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# Load the training dataset
train_dataset_path = 'train.json'
with open(train_dataset_path) as file:
    train_data = json.load(file)

# Convert JSON training data to a DataFrame
train_df = pd.DataFrame(train_data)

# Create a new column where ingredients are represented as a single string
train_df['ingredients_text'] = train_df['ingredients'].apply(lambda x: ' '.join(x))

# Prepare the features and labels for training
X_train = train_df['ingredients_text']
y_train = train_df['cuisine']

# Convert the text data into feature vectors
vectorizer = CountVectorizer()
X_train_vect = vectorizer.fit_transform(X_train)

# Load the test dataset
test_dataset_path = 'test.json'
with open(test_dataset_path) as file:
    test_data = json.load(file)

# Convert JSON test data to a DataFrame
test_df = pd.DataFrame(test_data)

# Create a new column where ingredients are represented as a single string for the test data
test_df['ingredients_text'] = test_df['ingredients'].apply(lambda x: ' '.join(x))

# Prepare the features for testing
X_test = test_df['ingredients_text']
X_test_vect = vectorizer.transform(X_test)

# Train a Logistic Regression model with Standard Scaler
model = make_pipeline(StandardScaler(with_mean=False), LogisticRegression(max_iter=500, solver='saga'))
model.fit(X_train_vect, y_train)

# Predict the cuisine for the test data
y_pred = model.predict(X_test_vect)

# Create a new column in the test DataFrame for the predicted cuisines
test_df['predicted_cuisine'] = y_pred

# Display the first few rows with predictions
print(test_df[['id', 'ingredients_text', 'predicted_cuisine']])

# Example usage
example_ingredients = ["chicken breast, olive oil, garlic, salt, pepper"]
example_vect = vectorizer.transform(example_ingredients)
example_pred = model.predict(example_vect)
print(f'Predicted Cuisine: {example_pred[0]}')
