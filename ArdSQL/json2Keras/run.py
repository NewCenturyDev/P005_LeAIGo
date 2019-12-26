from textdataparser import textDataParser
from model import ModelData

filename = 'sampledata'
kind_of_practice_dataset = ['Mnist']



img_rows = 28
img_cols = 28

# 고급 설정
batch_size = 128
epochs = 3


parsed_dataset, parsed_layerdata = textDataParser(filename, kind_of_practice_dataset)
mymodel = ModelData(parsed_layerdata, parsed_dataset)
mymodel.setTrainoption(batch_size, epochs)
mymodel.dataLoader()
model = mymodel.modelMaker()
print(model.summary())
mymodel.fitModel()
