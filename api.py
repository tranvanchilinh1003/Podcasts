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
import os
import whisper
from flask_cors import CORS
import pandas as pd
import requests
import json

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # Giới hạn tối đa là 50MB
CORS(app)

# Tải mô hình Whisper lớn "small", "medium" hoặc "large" "base"
model = whisper.load_model("medium")

def transcribe_audio(file_path):
    # Chuyển đổi âm thanh thành văn bản bằng tiếng Việt
    result = model.transcribe(file_path, language='vi')  # Chỉ định ngôn ngữ là tiếng Việt
    return result["text"]

@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'Chưa có file âm thanh được cung cấp'}), 400

    audio_file = request.files['audio']
    print(f'Đã nhận tệp: {audio_file.filename}, kích thước: {audio_file.content_length} bytes')
    wav_file_path = 'temp_audio.wav'  # Đường dẫn tạm thời để lưu tệp

    try:
        # Lưu tệp âm thanh tạm thời 
        audio_file.save(wav_file_path)

        # Chuyển đổi âm thanh thành văn bản 
        transcription = transcribe_audio(wav_file_path)

        print("Transcription:", transcription)

        banned_words = [
                  'sex', 'kill', 'hate', 'drugs', 'fuck', 'fuckyou',
                  'chết', 'sát thủ', 'khủng bố',  
                ]
        banned_count = sum(1 for word in banned_words if word in transcription)

        if banned_count > 10:
            return jsonify({'error': 'Số lượng từ cấm vượt quá 10 '}), 400

        return jsonify({'transcription': transcription})

    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        # Xóa tệp tạm thời sau khi xử lý
        if os.path.exists(wav_file_path):
            os.remove(wav_file_path)

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

@app.route('/api/top_podcasts', methods=['GET'])
def get_top_podcasts():
    fetch_and_save_data()
    df = pd.read_json('top_podcast.json')
    top_podcasts = df.to_dict(orient='records')
    return jsonify({'data': top_podcasts})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
