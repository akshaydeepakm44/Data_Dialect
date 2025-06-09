from datetime import datetime
import spacy
import pandas as pd
from fuzzywuzzy import fuzz, process
from app import db
import os

nlp = spacy.load('en_core_web_sm')

# Get the absolute path to the CSV file in the 'backend' folder
csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'Regional-dataset.csv'))

# Load data from CSV
dataframe = pd.read_csv(csv_path)

# Strip whitespace from column names
dataframe.columns = dataframe.columns.str.strip()

# Populate dictionary from CSV
data = {}
for index, row in dataframe.iterrows():
    district = row['Districts']
    cities = [city.strip().lower() for city in row['Cities/Towns/'].split(',')]
    data[district] = cities

# Function to detect city/town using NER and fuzzy matching
def detect_entity(input_text):
    input_text = input_text.lower()
    input_doc = nlp(input_text)
    for ent in input_doc.ents:
        if ent.label_ in ["GPE", "LOC"]:
            return ent.text
    return None

def detect_city(input_text):
    input_text = input_text.lower()
    city_town = detect_entity(input_text)

    if not city_town:
        all_towns = [town.lower() for towns in data.values() for town in towns]
        match = process.extractOne(input_text, all_towns, scorer=fuzz.token_set_ratio)
        if match:
            city_town, score = match
            if score < 80:
                city_town = None
    return city_town

def find_district(city_town):
    if city_town:
        city_town = city_town.lower()
        for district, towns in data.items():
            if city_town in towns:
                return district
    return None
