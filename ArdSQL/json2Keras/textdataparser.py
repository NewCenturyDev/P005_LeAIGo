def textDataParser(filename, kind_of_practice_dataset):

    f = open(filename, "r")
    filedata = f.read().split('\n')


    parsed_dataset = ''
    parsed_layerdata = []

    # filedata[0] : Dataset 의 종류일지도 모르는 데이터. 예를 들어, mnist
    if filedata[0].lower() in kind_of_practice_dataset :
        parsed_dataset = filedata[0].lower()
        for stringedit in filedata[1:] :
            splitdata = stringedit.split(' ')
            print(splitdata)
            if len(splitdata) == 1 :
                parsed_layerdata.append(tuple([splitdata[0].lower(), 0]))
            else :
                parsed_layerdata.append(tuple([splitdata[0].lower(), int(splitdata[1])]))
    else :
        for stringedit in filedata :
            splitdata = stringedit.split(' ')
            if len(splitdata) == 1 :
                parsed_layerdata.append(tuple([splitdata[0].lower(), 0]))
            else :
                parsed_layerdata.append(tuple([splitdata[0].lower(), int(splitdata[1])]))

    print(parsed_dataset, parsed_layerdata)

    f.close()

    return parsed_dataset, parsed_layerdata