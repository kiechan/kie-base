const yorozu = require('./utils/yorozu')

yorozu.getResponse({
    talkId: 10000,
    message: '東京都の住みたい街ランキングを教えて！'
}).then(function(res) {
    console.log(res)
})
