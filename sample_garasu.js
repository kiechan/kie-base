const garasu = require('./utils/garasu')

const message = garasu.createMessages({
    area: '東京都',
    // category: '保育所',
    category: null,
    data: [
        {
            url: 'https://google.co.jp',
            row: {
                column: '保育所', // 項目
                value: '北側保育園', // 値
                unit: '保育所' // 単位
            }
        },
        {
            url: 'https://google.co.jp',
            row: {
                column: '保育所', // 項目
                value: '西側保育園', // 値
                unit: '' // 単位
            }
        },
        {
            url: '',
            row: {
                column: '保育所', // 項目
                value: '南側保育園', // 値
                unit: '' // 単位
            }
        },
        {
            url: 'https://google.co.jp',
            row: {
                column: '保育所', // 項目
                value: '東側保育園', // 値
                unit: '' // 単位
            }
        }
    ]
})

console.log(message)