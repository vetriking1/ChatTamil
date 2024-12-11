from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import json
import nltk
import pickle
import random
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image

app = Flask(__name__)

model_img1 = tf.keras.models.load_model('./models/modelV2.h5')
model_img2 = tf.keras.models.load_model('./models/disese_model.h5')

@app.route('/', methods=['GET'])
def home():
    if request.method == 'GET':
        return "<h1>Welcome to the Flask API</h1>"


@app.route('/predict', methods=['POST'])
def predict():
    classes = ["சணல்", "சேளாம்", "நெல்", "கரும்பு","கோதுமை"]
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 408

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 408

    try:
        print("API called")
        image = Image.open(file.stream)
        
        predicted_value = predict_image(image,model_img1)
        predicted_value = classes[predicted_value]
        
        return jsonify({"response": predicted_value})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    

@app.route('/check', methods=['POST'])
def check():
    classes = ["ஆரோக்கிய பயிர்","பாதிக்கப்பட்ட பயிர்"]
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 408

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 408

    try:
        print("API called")
        image = Image.open(file.stream)
        
        predicted_value = predict_image(image,model_img2)
        predicted_value = classes[predicted_value]
        
        return jsonify({"response": predicted_value})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



def predict_image(image,model):
    
    img = image.resize((224, 224))
    img_array = img_to_array(img)
    img_array = img_array.astype('float32') / 255.0
    img_array = np.expand_dims(img_array, axis=0) # for batch dimension
    class_no = np.argmax(model.predict(img_array), axis=1)
    return class_no[0]

# Custom normalization function for Tamil text
def tamil_normalize(word):
    suffixes = ['ம்', 'கள்', 'கள்', 'யை', 'களில்', 'களுக்கு', 'களால்', 'களிடம்', 'களை']
    for suffix in suffixes:
        if word.endswith(suffix):
            return word[:-len(suffix)]
    return word

def preprocess_sentence(sentence):
    words = nltk.word_tokenize(sentence)
    normalized_words = [tamil_normalize(word) for word in words]
    return normalized_words

def bow(sentence, words):
    sentence_words = preprocess_sentence(sentence)
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence, model, words, classes):
    p = bow(sentence, words)
    res = model.predict(np.array([p]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    return return_list

def get_response(intents_list, intents_json):
    tag = intents_list[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            result = random.choice(i['responses'])
            break
    return result

# Load trained model
model = tf.keras.models.load_model('./models/chatbot_model_tamil.h5')

# Load words and classes from pickle files
with open('./data/words.pkl', 'rb') as f:
    words = pickle.load(f)

with open('./data/classes.pkl', 'rb') as f:
    classes = pickle.load(f)

# Load intents data
with open('./data/intens_tamil.json', 'r', encoding='utf-8') as file:
    data = json.load(file)


@app.route('/chat', methods=['POST'])
def chat():
    print("Received request")
    message = request.json.get('message')
    ints = predict_class(message, model, words, classes)
    res = get_response(ints, data)
    return jsonify({"response": res})



if __name__ == '__main__':
    app.run(debug=True,port=5000)
