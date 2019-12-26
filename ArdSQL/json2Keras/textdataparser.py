def textDataParser(filename, kind_of_practice_dataset):

    f = open(filename, "r")
    filedata = f.read().split('\n')

    # debug
    # for i in linedata :
    #    print(i, end = '')
    # print(type(linedata))

    parsed_dataset = ''
    parsed_layerdata = {}

    # dictionary 형태 버리기.
    if filedata[0] in kind_of_practice_dataset :
        parsed_dataset = filedata[0].lower()
        for stringedit in filedata[1:] :
            splitdata = stringedit.split(' ')
            print(splitdata)
            if len(splitdata) == 1 :
                parsed_layerdata[splitdata[0].lower()] = 0
            else :
                parsed_layerdata[splitdata[0].lower()] = int(splitdata[1])
    else :
        for stringedit in filedata :
            splitdata = stringedit.split(' ')
            if len(splitdata) == 1 :
                parsed_layerdata[splitdata[0].lower()] = 0
            else :
                parsed_layerdata[splitdata[0].lower()] = int(splitdata[1])

    print(parsed_dataset, parsed_layerdata)

    f.close()

    return parsed_dataset, parsed_layerdata