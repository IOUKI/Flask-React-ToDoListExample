from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

aList = ['吃早餐', '洗衣服', '倒垃圾']

@app.route('/', methods=['GET', 'POST', 'PATCH', 'DELETE'])
def index():

    def getAList():
        aDict = {}
        for index, item in enumerate(aList):
            aDict[index] = item
        
        return aDict

    # 取得A list 資料
    if request.method == 'GET':
        
        data = getAList()

        return jsonify(data), 200
    
    # 新增A list 資料
    elif request.method == 'POST':
        try:
            a = request.get_json()['a']
            aList.append(a)

            data = getAList()

            return jsonify(data), 201

        except Exception as e:
            print(e)
            return '', 404

    # 修改A list 資料
    elif request.method == 'PATCH':
        try:
            aIndex = int(request.get_json()['aIndex'])
            aNewValue = request.get_json()['aNewValue']

            aList.pop(aIndex)
            aList.insert(aIndex, aNewValue)

            return '', 204

        except Exception as e:
            print(e)
            return '', 404

    # 移除A list 資料
    elif request.method == 'DELETE':
        
        try:
            aIndex = int(request.get_json()['aIndex'])
            aList.pop(aIndex)
            return '', 204

        except Exception as e:
            print(e)
            return '', 404

    else:
        return jsonify({'Alert': 'Not found'}), 404


if __name__ == '__main__':
    app.run(debug=True)