from flask import Flask, request, jsonify
import os
import whisper
from flask_cors import CORS
import pandas as pd
import requests
import json
import torch

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50 MB
CORS(app)

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Tải mô hình Whisper lớn "small", "medium" hoặc "large" "base"
model = whisper.load_model("medium", device=device)

def load_banned_words():
    try:
        badwords_path = r'C:\Ampps\www\frontend1\Podcasts\listbadword.json'
        with open(badwords_path, 'r', encoding='utf-8') as f:
            bad_words = json.load(f)  # Giả sử badwords.json là danh sách các từ cấm
        return bad_words
    except Exception as e:
        print(f"Không thể tải danh sách từ cấm: {str(e)}")
        return {"en": [], "vi": []}  # Trả về danh sách trống nếu không tải được

def transcribe_audio(file_path, language='vi'):
    result = model.transcribe(file_path, language=language)  
    return result["text"]

@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'Chưa có file âm thanh được cung cấp'}), 400

    audio_file = request.files['audio']
    print(f'Nhận file: {audio_file.filename}, kích thước: {audio_file.content_length} bytes')
    wav_file_path = 'temp_audio.wav'  

    try:
        audio_file.save(wav_file_path)
        transcription = transcribe_audio(wav_file_path, language='vi')
        print("Transcription:", transcription)
        banned_words = load_banned_words()
        banned_count = sum(1 for word in banned_words['vi'] if word in transcription.lower())
        banned_count_en = sum(1 for word in banned_words['en'] if word in transcription.lower())
        if banned_count + banned_count_en > 1:
            return jsonify({'error': 'Số lượng từ cấm vượt quá 1'}), 400

        return jsonify({'transcription': transcription})

    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:

        if os.path.exists(wav_file_path):
            os.remove(wav_file_path)

def fetch_and_save_data():
    url = 'http://localhost:8080/api/get_All'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()['data']
        df = pd.DataFrame(data)

        # Filter posts with action == 1
        df = df[df['action'] == 1]

        def calculate_score(row, comment_weight=0.5, share_weight=0.3, rating_weight=0.2):
            return (row['total_comments'] * comment_weight +
                    row['total_shares'] * share_weight +
                    row['average_comment_rating'] * rating_weight)

        df['score'] = df.apply(calculate_score, axis=1)
        df_sorted = df.sort_values(by='score', ascending=False)

        top_10_trend_posts = df_sorted[['id', 'title', 'images', 'audio', 'description', 
                                        'categories_id', 'customers_id', 'view', 
                                        'create_date', 'update_date', 'images_customers', 
                                        'username', 'isticket', 'total_comments', 
                                        'total_shares', 'total_likes', 'average_comment_rating', 
                                        'score']]

        output_data = {'data': top_10_trend_posts.to_dict(orient='records')}
        
        with open('top_podcast.json', 'w', encoding='utf-8') as json_file:
            json.dump(output_data, json_file, ensure_ascii=False, indent=4)
    
    else:
        print(f"Lỗi khi lấy dữ liệu: {response.status_code}")

@app.route('/api/top_podcasts', methods=['GET'])
def get_top_podcasts():
    fetch_and_save_data()
    df = pd.read_json('top_podcast.json')
    top_podcasts = df.to_dict(orient='records')
    return jsonify({'data': top_podcasts})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
