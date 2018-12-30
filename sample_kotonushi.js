const SAMPLE_RESULT_NO_KEYWORD_AREA = {
    resultdiv: '0',
    ngDiv: '0',
    areaArray: [],
    keywordArray: ['']
}

const SAMPLE_RESULT_NO_KEYWORD = {
    resultdiv: '0',
    ngDiv: '1',
    areaArray: ['東京', '都', '港', '区'],
    keywordArray: []
}

const SAMPLE_RESULT_NO_AREA = {
    resultdiv: '0',
    ngDiv: '2',
    areaArray: [],
    keywordArray: ['人口']
}

const SAMPLE_RESULT_MULTI_KEYWORD = {
    resultdiv: '0',
    ngDiv: '3',
    areaArray: ['東京', '都'],
    keywordArray: ['人口', 'フリーWi-Fi']
}

const SAMPLE_RESULT_OK = {
    resultdiv: '1',
    ngDiv: '',
    areaArray: ['東京', '都'],
    keywordArray: ['人口']
}

const kotonushi = require('./utils/kotonushi')

console.log(kotonushi.createMessage(SAMPLE_RESULT_NO_KEYWORD_AREA))
console.log(kotonushi.createMessage(SAMPLE_RESULT_NO_KEYWORD))
console.log(kotonushi.createMessage(SAMPLE_RESULT_NO_AREA))
console.log(kotonushi.createMessage(SAMPLE_RESULT_MULTI_KEYWORD))
console.log(kotonushi.createMessage(SAMPLE_RESULT_OK))