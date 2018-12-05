"use strict"

const kuromoji = require('kuromoji')

module.exports.analyse = (sentence) => {

    // 辞書のディレクトリを指定
    const KUROMOJI_DICT = 'node_modules/kuromoji/dict'

    // プロパティ名：種別
    const FIELD_PROP_KIND = 'pos'
    // プロパティ名：単語
    const FIELD_PROP_WORD = 'surface_form'
    // プロパティ名：詳細1,2,3
    const FIELD_PROP_DETAIL_1 = 'pos_detail_1'
    const FIELD_PROP_DETAIL_2 = 'pos_detail_2'
    const FIELD_PROP_DETAIL_3 = 'pos_detail_3'
    // プロパティ名：読み
    const FIELD_PROP_READING = 'reading'
    // 単語種別：名詞
    const WORD_TYPE_NOUN = '名詞'

    const builder = kuromoji.builder({
        dicPath: KUROMOJI_DICT
    })

    return new Promise((resolve, reject) => {
        builder.build(function (err, tokenizer) {
            if (err) {
                reject(err)
            }

            var tokens = tokenizer.tokenize(sentence);
            if (tokens === null || tokens.length === 0) {
                resolve(new Array())
            }

            // 名詞
            let nouns = []

            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i][FIELD_PROP_KIND] !== WORD_TYPE_NOUN) {
                    continue
                }
                const word = {
                    word: tokens[i][FIELD_PROP_WORD],
                    type: tokens[i][FIELD_PROP_KIND],
                    typeDetail1: (tokens[i][FIELD_PROP_DETAIL_1] !== '*') ? tokens[i][FIELD_PROP_DETAIL_1] : null,
                    typeDetail2: (tokens[i][FIELD_PROP_DETAIL_2] !== '*') ? tokens[i][FIELD_PROP_DETAIL_2] : null,
                    typeDetail3: (tokens[i][FIELD_PROP_DETAIL_3] !== '*') ? tokens[i][FIELD_PROP_DETAIL_3] : null,
                    reading: tokens[i][FIELD_PROP_READING]
                }
                nouns.push(word)
            }

            resolve(nouns)
        })
    })
}
