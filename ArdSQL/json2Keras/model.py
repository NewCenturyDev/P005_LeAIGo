import keras
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers.convolutional import Conv2D, MaxPooling2D

class ModelData :

    def __init__(self, parsed_layerdata, parsed_dataset = None,
                 num_classes = None, inputimgsize_row = None, inputimgsize_col = None):

        # model data init
        self.model = Sequential()
        # 레이어들의 정보가 들어 있는 변수
        self.parsed_layerdata = parsed_layerdata
        # 어떤 공개데이터셋을 로딩하여 사용할 것인지 결정해주는 변수
        self.parsed_dataset = parsed_dataset
        # 최종적으로 만들어진 Keras source code 가 담기는 변수
        self.baked_layersourcecode = []
        # 개인 데이터셋을 사용하는 경우, image 의 size 를 지정해주는 변수
        self.inputimgsize_row = inputimgsize_row
        self.inputimgsize_col = inputimgsize_col

        self.trainsetting_batchsize = None
        self.trainsetting_epochs = None

        self.input2Ddata_shape = (inputimgsize_row, inputimgsize_col, 1)
        self.num_classes = num_classes

    def setTrainoption(self, batchsize, epochs) :

        self.trainsetting_batchsize = batchsize
        self.trainsetting_epochs = epochs


    def dataLoader(self) :

        if (self.parsed_dataset == 'mnist') :
            self.inputimgsize_row = 28
            self.inputimgsize_col = 28
            (self.x_train, self.y_train), (self.x_test, self.y_test) = keras.datasets.mnist.load_data()
            input_shape = (self.inputimgsize_row, self.inputimgsize_col, 1)
            self.x_train = self.x_train.reshape(self.x_train.shape[0], self.inputimgsize_row, self.inputimgsize_col, 1)
            self.x_test = self.x_test.reshape(self.x_test.shape[0], self.inputimgsize_row, self.inputimgsize_col, 1)

            self.x_train = self.x_train.astype('float32') / 255.
            self.x_test = self.x_test.astype('float32') / 255.

            print('x_train shape:', self.x_train.shape)
            print(self.x_train.shape[0], 'train samples')
            print(self.x_test.shape[0], 'test samples')

            if self.trainsetting_batchsize is None :
                self.trainsetting_batchsize = 128
            if self.trainsetting_epochs is None :
                self.trainsetting_epochs = 12
            self.num_classes = 10
            self.input2Ddata_shape = (self.inputimgsize_row, self.inputimgsize_col, 1)

            # one-hot 인코딩
            self.y_train = keras.utils.to_categorical(self.y_train, self.num_classes)
            self.y_test = keras.utils.to_categorical(self.y_test, self.num_classes)


    def modelMaker(self) :

        # init model
        self.model = Sequential()
        self.baked_layersourcecode = []

        print(self.parsed_layerdata)
        for index, layer in enumerate(self.parsed_layerdata) :
            print(index, layer)
            if (layer[0] == 'conv2d') :
                if (index == 0) :
                    self.model.add(Conv2D(layer[1],
                                          activation=self.parsed_layerdata[index + 1][0],
                                          kernel_size=(3, 3), strides=(1, 1), padding='same',
                                          input_shape=self.input2Ddata_shape))
                    self.baked_layersourcecode.append("model.add(Conv2D("+str(layer[1])+
                                                      ", activation="+str(self.parsed_layerdata[index + 1][0])+
                                                      ",kernel_size=(3, 3), strides=(1, 1), padding=\'same\', input_shape="
                                                      +str(self.input2Ddata_shape)+"))")

                else :
                    self.model.add(Conv2D(layer[1],
                                          activation=self.parsed_layerdata[index + 1][0],
                                          kernel_size=(3, 3), strides=(1, 1), padding='same'))
                    self.baked_layersourcecode.append("model.add(Conv2D("+str(layer[1])+
                                                      ", activation="+str(self.parsed_layerdata[index + 1][0])+
                                                      ",kernel_size=(3, 3), strides=(1, 1), padding=\'same\'))")

            elif (layer[0] == 'maxpooling2d') :
                self.model.add(MaxPooling2D(pool_size=(2, 2), strides=(1, 1)))
                self.baked_layersourcecode.append("model.add(MaxPooling2D(pool_size=(2, 2), strides=(1, 1))")


            elif (layer[0] == 'flatten') :
                self.model.add(Flatten())
                self.baked_layersourcecode.append("model.add(Flatten())")

            elif (layer[0] == 'dense') :
                self.model.add(Dense(layer[1],
                                     activation=self.parsed_layerdata[index+1][0]))
                self.baked_layersourcecode.append("model.add(Dense("+str(layer[1])+", activation="+str(self.parsed_layerdata[index+1][0])+")")

            elif (layer[0] == 'dropout') :
                self.model.add(Dropout(0.5))
                self.baked_layersourcecode.append("model.add(Dropout(0.5))")

            else :
                pass

        return self.model



    def fitModel(self):

        self.model.compile(loss='categorical_crossentropy',
                           optimizer='adam',
                           metrics=['accuracy'])
        hist = self.model.fit(self.x_train, self.y_train,
                         batch_size=self.trainsetting_batchsize,
                         epochs=self.trainsetting_epochs,
                         verbose=1,
                         validation_data=(self.x_test, self.y_test))
        return hist


    def evaluateModel(self):

        self.score = self.model.evaluate(self.x_test, self.y_test, verbose=0)
        print('Test loss:', self.score[0])
        print('Test accuracy:', self.score[1])

        return self.score


    def trial(self, image):
        answer = self.model.predict_classes(image.reshape((1, self.inputimgsize_row, self.inputimgsize_col, 1)))
        print('The Answer is ', answer)
        return answer
