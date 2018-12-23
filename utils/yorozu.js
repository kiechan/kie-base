// 処理順
// 1. KUROKO(形態素解析)
// 2. SATORI(候補検索)
// 3. YOMI(OD検索)
// 4. GARASU(言語生成)

const kuroko = require('./kuroko')
const satori = require('./satori')
const yomi = require('./yomi')
const garasu = require('./garasu')

module.exports.getResponse = (data) => {
    return new Promise((resolve, reject) => {
        kuroko.analyse(data.message).then((result) => {
            satori.checkAnalyzedWords(result).then(satoriResult => {
                yomi.search(satoriResult).then(yomiResult => {
                    if (yomiResult == null || yomiResult.length == 0) {
                        yomiResult = [{}]
                    }
                    const response = garasu.createMessages(yomiResult[0])
                    resolve(response)
                }).catch(err => {
                    console.log(err)
                    reject(err)
                })
            }).catch(err => {
                console.log(err)
                reject(err)
            })
        }).catch(() => {
            console.log(err)
            reject(err)
        })
    })
}