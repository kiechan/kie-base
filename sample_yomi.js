const yomi = require('./utils/yomi')

// 呼び出しサンプル
yomi.search([
    { word: '横山',
    type: '名詞',
    typeDetail1: '固有名詞',
    typeDetail2: '地域',
    typeDetail3: '一般',
    reading: 'ヨコヤマ' },
  { word: '町',
    type: '名詞',
    typeDetail1: '接尾',
    typeDetail2: '地域',
    typeDetail3: null,
    reading: 'マチ' },
  { word: '人口',
    type: '名詞',
    typeDetail1: '一般',
    typeDetail2: null,
    typeDetail3: null,
    reading: 'ジンコウ' },
  { word: '何',
    type: '名詞',
    typeDetail1: '数',
    typeDetail2: null,
    typeDetail3: null,
    reading: 'ナン' },
  { word: '人',
    type: '名詞',
    typeDetail1: '接尾',
    typeDetail2: '助数詞',
    typeDetail3: null,
    reading: 'ニン' }
]).then(function(result) {
    console.log(result)
    if (result.length > 0) {
        for (let i=0; result.length > i; i++) {
            console.log(result[i].data)
        }
    }
})
