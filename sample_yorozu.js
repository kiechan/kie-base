const yorozu = require('./utils/yorozu')

yorozu.getResponse({
    talkId: 10000,
    message: '東京都のWi-Fiの位置を教えて！'
}).then(function(res) {
    console.log(res)
})
