from flask import Flask, request, jsonify, send_from_directory
import os
from google.cloud import vision
from google.auth import credentials
from google.oauth2 import service_account
import google.generativeai as genai
import json
from PyPDF2 import PdfReader
import logging
from flask_cors import CORS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)
TRIAL_PASSWORD = "H2MathTrial2025"
H2_TOPICS = ["Differentiation", "Integration", "Vectors"]

gemini_key = os.environ.get("GEMINI_API_KEY")
if not gemini_key:
    raise ValueError("GEMINI_API_KEY not set")
genai.configure(api_key=gemini_key)

creds_json = os.environ.get("GOOGLE_CREDENTIALS")
if not creds_json:
    raise ValueError("GOOGLE_CREDENTIALS not set")
creds_dict = json.loads(creds_json)
creds = service_account.Credentials.from_service_account_info(creds_dict)

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    password = data.get("password", "")
    if password == TRIAL_PASSWORD:
        return jsonify({"success": True})
    return jsonify({"error": "Invalid password"}), 401

@app.route("/api/solve", methods=["POST"])
def solve():
    password = request.form.get("password", "")
    if password != TRIAL_PASSWORD:
        return jsonify({"error": "Invalid password"}), 401

    problem = request.form.get("text", "").strip()
    if not problem and "file" in request.files:
        file = request.files["file"]
        if file and file.filename:
            filename = file.filename
            file.save(filename)
            logger.info(f"Processing file: {filename}")
            if filename.lower().endswith('.pdf'):
                pdf_reader = PdfReader(filename)
                problem = ""
                for page in pdf_reader.pages:
                    problem += page.extract_text() or "PDF text extraction failed"
                os.remove(filename)
            elif filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                client = vision.ImageAnnotatorClient(credentials=creds)
                with open(filename, "rb") as image_file:
                    content = image_file.read()
                if not content:
                    problem = "Image file is empty"
                    logger.error("Empty image content")
                else:
                    image = vision.Image(content=content)
                    features = [{"type_": vision.Feature.Type.TEXT_DETECTION}]
                    logger.info("Sending to Vision API")
                    response = client.annotate_image({"image": image, "features": features})
                    problem = response.text_annotations[0].description if response.text_annotations else "OCR failed"
                os.remove(filename)
            else:
                problem = "Unsupported file type. Use PDF, JPG, or PNG."
                os.remove(filename)
        else:
            problem = "No file uploaded or invalid file"
            logger.warning("No valid file in request")

    if not problem:
        problem = "No problem provided"

    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"Solve this H2 math problem step-by-step, Cambridge style:\n{problem}"
    response = model.generate_content(prompt)
    solution = response.text
    return jsonify({"problem": problem, "solution": solution})

@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json()
    password = data.get("password", "")
    if password != TRIAL_PASSWORD:
        return jsonify({"error": "Invalid password"}), 401

    topic = data.get("topic")
    difficulty = data.get("difficulty", "medium")
    if topic not in H2_TOPICS:
        return jsonify({"error": "Invalid topic"}), 400

    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"Generate a Cambridge H2 Math problem on {topic}, {difficulty} difficulty, with a step-by-step solution, formatted like a past paper question."
    response = model.generate_content(prompt)
    generated_content = response.text.split("\nSolution:\n", 1)
    problem = generated_content[0].strip()
    solution = generated_content[1].strip() if len(generated_content) > 1 else "Solution not provided"
    return jsonify({"problem": problem, "solution": solution})

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)