import pymysql
from json2Keras.textdataparser import textDataParser
from json2Keras.model import ModelData
from json2Keras.datafromarduino import Arduino
import time

# 일반 설정
filename = 'json2Keras/sampledata'
kind_of_practice_dataset = ['mnist']
arduino_portname = 'COM7'

# 데이터셋별 설정
img_rows = 28
img_cols = 28

# 고급 설정
batch_size = 128
epochs = 1

# MySQL Connection 연결
conn = pymysql.connect(host='52.79.169.66', user='hackerAI', password='hackerAI', db='hacker', charset='utf8')

# Connection 으로부터 Cursor 생성
curs = conn.cursor()


while True :
    # get arduino before start web mode (default)
    arduino = Arduino(arduino_portname)
    if arduino.ARD is None:
        print('arduino was not found!')
        print('Starting web mode')
        arduino_or_web = 'web'
    else :
        print('arduino, port', arduino_portname, 'connected!')
        print('Starting Arduino mode')
        arduino_or_web = 'arduino'


    if arduino_or_web is 'web' :
        while True :
            # 대기 상태 : 1초다마 DB 조회
            time.sleep(1)
            sql = "SELECT * FROM ai WHERE `ai_status` = \'wait\'"
            curs.execute(sql)

            # 데이터 Fetch
            rows = curs.fetchall()
            if len(rows) != 0 :
                break

        id = rows[0][0]
        task = rows[0][5]
        istest = rows[0][3]
        sql = "UPDATE ai SET ai_status = \'proc\' WHERE ai_num = "+str(id)
        curs.execute(sql)
        conn.commit()


        fw = open(filename, "w")
        fw.write(task)
        fw.close()

        parsed_dataset, parsed_layerdata = textDataParser(filename, kind_of_practice_dataset)
        mymodel = ModelData(parsed_layerdata, parsed_dataset)
        mymodel.setTrainoption(batch_size, epochs)
        mymodel.dataLoader()
        model = mymodel.modelMaker()
        print(model.summary())

        sourcecode = '\n'.join(mymodel.baked_layersourcecode)
        print(sourcecode)

        # sql 요청 시 sourcecode 의 ' 문자가 error 을 발령하여 우선 주석 처리
        # sql = "UPDATE ai SET ai_code = %s WHERE ai_num = "+str(id)
        # curs.execute(sql,(sourcecode))
        # conn.commit()

        if str(istest) is '0' :
            # 만약 model 이 학습을 필요로 하면 call
            mymodel.fitModel()
        elif str(istest) is '1' :
            # model 이 학습을 필요로 하는 것이 아니고, test 를 필요로 하면 call
            trialresult = mymodel.trial(None)
        else :
            pass

        # model 의 성능을 요청하면 call
        evaluatedata = mymodel.evaluateModel()

        result = str(evaluatedata[0]) + str(evaluatedata[1])
        sql = "UPDATE ai SET ai_result = \'"+result+"\' WHERE ai_num = "+str(id)
        curs.execute(sql)
        conn.commit()

        sql = "UPDATE ai SET ai_status = \'done\' WHERE ai_num = "+str(id)
        curs.execute(sql)
        conn.commit()

    else :
        arduino_serialdata = True
        while arduino_serialdata :
            print(arduino_serialdata)
            time.sleep(1)
            arduino_serialdata = arduino.requestArduinoData()

            fw = open(filename, "w")

            task = ""

            # arduino Layer 1 : iynput laer, conv2d 32 + relu + conv2d 16 + relu
            task = "Mnist\nConv2d 32\nRelu\nConv2d 32\nRelu"

            # arduino Layer 2 : pooling layer, maxpooling2d, flatten
            if  arduino_serialdata.split(' ')[0].split(':')[1] == str(1):
                print(arduino_serialdata.split(' ')[0].split(':')[1])
                task = "\n".join([task, "Maxpooling2d\nFlatten"])
            else :
                task = task

            # arduino Layer 3 : output layer, Dense 50 + relu + Dense 10 + softmax
            if  arduino_serialdata.split(' ')[1].split(':')[1] == str(1):
                print('split data -------', arduino_serialdata.split(' ')[1].split(':')[1])
                task = "\n".join([task, "Dense 128\nRelu\nDense 10\nSoftmax"])
            else :
                task = task


            fw.write(task)
            fw.close()

            parsed_dataset, parsed_layerdata = textDataParser(filename, kind_of_practice_dataset)
            mymodel = ModelData(parsed_layerdata, parsed_dataset)
            mymodel.setTrainoption(batch_size, epochs)
            mymodel.dataLoader()
            model = mymodel.modelMaker()
            print(model.summary())

        print('system : check arduino port repeatly')

# Connection 닫기
conn.close()

'''
Conv2d 32
Relu
Conv2d 64
Relu
Maxpooling2d
Flatten
Dense 128
Relu
Dense 10
Softmax
'''