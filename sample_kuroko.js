const kuroko = require('./utils/kuroko')

kuroko.analyse('川崎の人口は何人ですか？').then(function(result) {
    console.log(result)
})
