import serial

class Arduino :

    def __init__(self, portname):
        self.ARD = None
        try:
            self.ARD = serial.Serial(portname, 9600, timeout=1)
        except:
            print("Can't find PORT!!")

    # path='./testDATA.txt'
    def requestArduinoData(self):
        if self.ARD.readable():
            LINE = self.ARD.readline()
            code = str(LINE.decode())
            # print(code)
            # trans=open(path, mode='a')
            # Adapt bigger DATA or meaningful DATA
            # t rans.write(code)
        else:
            # trans.close()
            return 'end'
        return code



