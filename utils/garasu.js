const SAMPLE_INPUT = {
    area: '川崎市',
    category: '人口',
    data: [
        {
            url: 'https://google.co.jp',
            rows: [
                {
                    column: '', // 項目
                    value: '', // 値
                    unit: '' // 単位
                }
            ]
        }
    ]
}

const SMAPLE_OUTPUT = {
    messages: [
        {
            words: '川崎市の人口は10万人ッピ！',
            url: 'https://google.co.jp'
        },
        {
            words: '川崎市の保育園はこちらの3件ッピ！',
            url: ''
        },
        {
            words: '',
            url: 'https://google.co.jp'
        },
        {
            words: '',
            url: 'https://yahoo.co.jp'
        },
        {
            words: '',
            url: 'https://salesforce.com'
        }
    ]
}

module.exports.createMessages = (data) => {
    return SMAPLE_OUTPUT
}