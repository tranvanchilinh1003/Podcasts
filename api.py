# from flask import Flask, jsonify
# import pandas as pd
# import requests
# import json
# from flask_cors import CORS  

# app = Flask(__name__)
# CORS(app)  


# def fetch_and_save_data():
#     url = 'http://localhost:8080/api/get_All'
#     response = requests.get(url)

#     if response.status_code == 200:
#         data = response.json()['data']
#         df = pd.DataFrame(data)

#         def calculate_score(row, comment_weight=0.5, share_weight=0.3, rating_weight=0.2):
#             return (row['total_comments'] * comment_weight +
#                     row['total_shares'] * share_weight +
#                     row['average_comment_rating'] * rating_weight)

#         df['score'] = df.apply(calculate_score, axis=1)
        
    
#         df_sorted = df.sort_values(by='score', ascending=False)
#         top_10_trend_posts = df_sorted[['id', 'title', 'images', 'audio', 'description', 
#                                          'categories_id', 'customers_id', 'view', 
#                                          'create_date', 'update_date', 'images_customers', 
#                                          'username', 'isticket', 'total_comments', 
#                                          'total_shares', 'total_likes', 'average_comment_rating', 
#                                          'score']]

        
#         output_data = {'data': top_10_trend_posts.to_dict(orient='records')}
        
#         with open('top_podcast.json', 'w', encoding='utf-8') as json_file:
#             json.dump(output_data, json_file, ensure_ascii=False, indent=4)

#         print(top_10_trend_posts)
#     else:
#         print(f"Lỗi khi lấy dữ liệu: {response.status_code}")

# # Tải dữ liệu vào DataFrame từ tệp JSON
# fetch_and_save_data()
# df = pd.read_json('top_podcast.json')

# @app.route('/api/top_podcasts', methods=['GET'])
# def get_top_podcasts():
#     # Lấy và lưu dữ liệu mới nhất trước khi phục vụ yêu cầu
#     fetch_and_save_data()
    
#     # Tải lại DataFrame từ tệp JSON đã cập nhật
#     df = pd.read_json('top_podcast.json')
    
#     # Chuyển DataFrame thành danh sách đối tượng và trả về
#     top_podcasts = df.to_dict(orient='records')
#     return jsonify({'data': top_podcasts})  
# if __name__ == '__main__':
#     app.run(debug=True, port=5000)
from flask import Flask, request, jsonify
import pandas as pd
import requests
import json
import speech_recognition as sr
from pydub import AudioSegment
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Hàm lấy và lưu dữ liệu từ API bên ngoài
def fetch_and_save_data():
    url = 'http://localhost:8080/api/get_All'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()['data']
        df = pd.DataFrame(data)

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

        print(top_10_trend_posts)
    else:
        print(f"Lỗi khi lấy dữ liệu: {response.status_code}")

# Hàm chuyển đổi âm thanh thành văn bản
def transcribe_audio(audio_file_path):
    try:
        # Tải file âm thanh
        audio = AudioSegment.from_file(audio_file_path)

        # Nếu file là mp3, chuyển đổi sang wav
        if audio_file_path.endswith('.mp3'):
            wav_file_path = audio_file_path.replace('.mp3', '.wav')
            audio.export(wav_file_path, format='wav')
            audio_file_path = wav_file_path

        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_file_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            return text
    except Exception as e:
        return f"Lỗi khi xử lý file âm thanh: {e}"

# Hàm kiểm tra số lượng từ cấm trong văn bản
def count_banned_words(text, banned_words):
    words = text.lower().split()
    count = sum(words.count(word.lower()) for word in banned_words)
    return count

# Endpoint để lấy top podcasts
@app.route('/api/top_podcasts', methods=['GET'])
def get_top_podcasts():
    fetch_and_save_data()
    df = pd.read_json('top_podcast.json')
    top_podcasts = df.to_dict(orient='records')
    return jsonify({'data': top_podcasts})

# Endpoint để chuyển đổi âm thanh
@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    if 'audio' not in request.files:
        return jsonify({'error': 'Chưa có file âm thanh được cung cấp'}), 400

    audio_file = request.files['audio']
    audio_file_path = os.path.join('uploads', audio_file.filename)
    audio_file.save(audio_file_path)

    transcription = transcribe_audio(audio_file_path)

    # Kiểm tra từ cấm
    banned_words = ['ổ quỷ', 'đường', 'vào']  # Danh sách từ cấm
    banned_count = count_banned_words(transcription, banned_words)

    # Xóa file tạm thời sau khi xử lý
    os.remove(audio_file_path)

    if banned_count > 10:
        return jsonify({'error': 'Số lượng từ cấm vượt quá 10'}), 400

    return jsonify({'transcription': transcription})

if __name__ == '__main__':
    fetch_and_save_data()  # Tải dữ liệu ban đầu khi khởi động ứng dụng
    app.run(debug=True, port=5000)
