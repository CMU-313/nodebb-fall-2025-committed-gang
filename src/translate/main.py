from flask import Flask, request, jsonify
from translator import translate_content

app = Flask(__name__)

@app.route("/translate", methods=["POST", "GET"])
def translate():
    # Handle both GET and POST
    if request.method == 'GET':
        text = request.args.get('content', '')
    else:  # POST
        data = request.get_json()
        text = data.get("text", "")
    
    is_english, translated = translate_content(text)
    return jsonify({
        "is_english": is_english,
        "translated_content": translated
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)