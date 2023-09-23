from flask import Flask, render_template, jsonify
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index_3.html')

@app.route('/webcam-list', methods=['GET'])
def webcam_list():
    base_path = '/dev/'
    devices = [device for device in os.listdir(base_path) if device.startswith('video')]
    return jsonify(devices)

if __name__ == '__main__':
    app.run(debug=True)


