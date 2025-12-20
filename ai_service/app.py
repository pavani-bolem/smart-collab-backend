from flask import Flask, request, jsonify
from textblob import TextBlob

app = Flask(__name__)

def predict_priority(text):
    # Simple NLP Logic:
    # 1. Check for urgent keywords
    urgent_keywords = ['crash', 'critical', 'urgent', 'immediately', 'broken', 'error']
    text_lower = text.lower()
    
    for word in urgent_keywords:
        if word in text_lower:
            return 'high'
            
    # 2. Check sentiment (Negative sentiment often implies a bug/problem)
    blob = TextBlob(text)
    if blob.sentiment.polarity < -0.3: # Highly negative
        return 'medium'
        
    return 'low'

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    description = data.get('description', '')
    
    if not description:
        return jsonify({'priority': 'low'})
        
    priority = predict_priority(description)
    return jsonify({'priority': priority})

if __name__ == '__main__':
    # Run on port 5000 (Different from Node's 3000)
    app.run(port=5000, debug=True)