// 処理順
// 1. KUROKO(形態素解析)
// 2. SATORI(候補検索)
// 3. YOMI(OD検索)
// 4. GARASU(言語生成)

const SAMPLE_OUTPUT = {
    messages: [
        {
            words: ''
        }        
    ]    
}

const SAMPLE_GARASU_INPUT = {
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
}

const kuroko = require('./kuroko')
const garasu = require('./garasu')

module.exports.getResponse = (data) => {
    return new Promise((resolve, reject) => {
        
        kuroko.analyse(data.message).then((result) => {

            // TODO SATORI呼ぶ
            // TODO YOMI呼ぶ

            const response = garasu.createMessages(SAMPLE_GARASU_INPUT)
            resolve(response)
        }).catch(() => {
            reject({
                status: 'E999',
                messages: [
                    { text: '正常に応答を構築できませんでした。' }
                ]
            })
        })
    })
}