from flask import Flask, jsonify
import pandas as pd
import requests
import json
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)  


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

# Tải dữ liệu vào DataFrame từ tệp JSON
fetch_and_save_data()
df = pd.read_json('top_podcast.json')

@app.route('/api/top_podcasts', methods=['GET'])
def get_top_podcasts():
    # Lấy và lưu dữ liệu mới nhất trước khi phục vụ yêu cầu
    fetch_and_save_data()
    
    # Tải lại DataFrame từ tệp JSON đã cập nhật
    df = pd.read_json('top_podcast.json')
    
    # Chuyển DataFrame thành danh sách đối tượng và trả về
    top_podcasts = df.to_dict(orient='records')
    return jsonify({'data': top_podcasts})  
if __name__ == '__main__':
    app.run(debug=True, port=5000)




# from flask import Flask, jsonify, request
# import pandas as pd
# import requests
# import json
# import time
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

# @app.route('/api/top_podcasts', methods=['GET'])
# def get_top_podcasts():
#     fetch_and_save_data()  # Gọi ngay để lấy dữ liệu mới nhất
#     df = pd.read_json('top_podcast.json')

#     # Phân trang
#     page = request.args.get('page', default=1, type=int)
#     items_per_page = 6  # Số lượng mục mỗi trang

#     # Tính toán số lượng mục cần lấy
#     total_items_to_fetch = items_per_page * page

#     # Lấy dữ liệu theo số lượng yêu cầu
#     paginated_data = df[:total_items_to_fetch].to_dict(orient='records')
    
#     # Thông tin meta cho phân trang
#     total_items = len(df)
#     total_pages = (total_items + items_per_page - 1) // items_per_page  # Tính số trang tổng

#     meta = {
#         'page': page,
#         'per_page': items_per_page,
#         'total_items': total_items,
#         'total_pages': total_pages
#     }

#     return jsonify({'data': paginated_data, 'meta': meta})

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)
