import serial
#Set PORT Number
try:
    ARD = serial.Serial('/dev/cu.usbmodem14301', 9600, timeout=1)
except:
    print("Can't find PORT!!")
    exit()

path='/Users/mac/Desktop/testDATA.txt'

def ArduinoDATA():
    if ARD.readable():
        LINE=ARD.readline()
        code=str(LINE.decode())
        print(code)
        trans=open(path, mode='a')
        #Adapt bigger DATA or meaningful DATA
        trans.write(code)
    else:
        return 0
while(True):
    ArduinoDATA()