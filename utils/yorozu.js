// 処理順
// 1. KUROKO(形態素解析)
// 2. SATORI(候補検索)
// 3. YOMI(OD検索)
// 4. GARASU(言語生成)

const kuroko = require('./kuroko')
const kona = require('./kona')
const satori = require('./satori')
const kotonushi = require('./kotonushi')
const yomi = require('./yomi')
const garasu = require('./garasu')

module.exports.getResponse = (data) => {
    return new Promise((resolve, reject) => {
        // KUROKO 形態素解析
        kuroko.analyse(data.message).then((result) => {
            // KONA ユーザー入力情報を登録
            kona.input(result)
            // SATORI 入力情報に地域とカテゴリが入っているか確認
            satori.checkAnalyzedWords(result).then(satoriResult => {
                console.log(satoriResult)
                // SATORIの判定結果がNGの場合、SATORIの結果を返却
                if (satoriResult.resultdiv == '0') {
                    // KOTONUSHI エラーメッセージを返却
                    const ngMessage = kotonushi.createMessage(satoriResult)
                    resolve(ngMessage)
                    return
                }
                // YOMI オープンデータを検索する
                yomi.search(result, satoriResult).then(yomiResult => {
                    console.log(yomiResult)
                    if (yomiResult == null || yomiResult.length == 0) {
                        yomiResult = [{}]
                    }
                    // GARASU 検索結果を言葉に変換する
                    const response = garasu.createMessages(yomiResult[0])
                    resolve(response)
                }).catch(err => {
                    console.log(err)
                    // GARASU 検索結果を言葉に変換する
                    const response = garasu.createMessages(null)
                    resolve(response)
                })
            }).catch(err => {
                console.log(err)
                // GARASU 検索結果を言葉に変換する
                const response = garasu.createMessages(null)
                resolve(response)
            })
        }).catch(() => {
            console.log(err)
            // GARASU 検索結果を言葉に変換する
            const response = garasu.createMessages(null)
            resolve(response)
        })
    })
}
