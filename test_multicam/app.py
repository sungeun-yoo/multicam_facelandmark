from flask import Flask, render_template, jsonify
import os
import mimetypes

app = Flask(__name__)

# JavaScript에 대한 MIME 타입 강제 설정
mimetypes.add_type('application/javascript', '.js')
print("mimetypes")

@app.route('/')
def index():
    #return render_template('index_3.html')
    return render_template('index_start.html')

@app.route('/index_3')
def index_3():
    return render_template('index_3.html')

@app.route('/webcam-list', methods=['GET'])
def webcam_list():
    base_path = '/dev/'
    devices = [device for device in os.listdir(base_path) if device.startswith('video')]
    return jsonify(devices)

if __name__ == '__main__':
    app.run(debug=True)
