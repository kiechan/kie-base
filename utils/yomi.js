"use strict"

const kuromoji = require('kuromoji')

/**
 * yomi データ検索
 * @return {area:地名,category:カテゴリー,data:[{url:URL,row:{column:項目,value:情報,unit:単位}}]}
 */
module.exports.search = (inputData) => {

    // console.log(inputData.length)
    if (inputData.length  <= 0) {
        console.log("inputデータがありません")
        return
    }
    let area = ""
    let word = ""
    for (let i = 0; i < inputData.length; i++) {
        // 検索地域を取得
        if (inputData[i].typeDetail2 == '地域') {
            area = area + inputData[i].word
        }
        // 検索ワードを取得
        if (inputData[i].typeDetail1 == '一般') {
            word = inputData[i].word
        }
    }

    const KUROMOJI_DICT = 'node_modules/kuromoji/dict'
    const builder = kuromoji.builder({
        dicPath: KUROMOJI_DICT
    })

    let result = []
    const {Client} = require('pg')
    const client = new Client({
        user: 'root',
        host: 'udc2019-aws-db.ctdjivyul3eu.ap-northeast-1.rds.amazonaws.com',
        database: 'udc2019_aws_db',
        password: 'rootroot',
        port: 5432,
    })
    // 接続チェック
    client.connect(function(err, res) {
        if (err) {
            console.log("DB接続に失敗しました")
            return
        }
    })
    let queryStr =           "SELECT COALESCE(ma.district, ma.municipality, ma.prefectures) area "
    queryStr = queryStr +         ", * "
    queryStr = queryStr +      "FROM t_opendata tod "
    queryStr = queryStr + "LEFT JOIN m_category mc "
    queryStr = queryStr +        "ON tod.category_code = mc.category_code "
    queryStr = queryStr + "LEFT JOIN m_area ma "
    queryStr = queryStr +        "ON tod.area_code = ma.area_code "
    queryStr = queryStr +     "WHERE ma.prefectures LIKE $1 "
    queryStr = queryStr +        "OR ma.municipality LIKE $1 "
    queryStr = queryStr +        "OR ma.district LIKE $1 "
    queryStr = queryStr +       "AND tod.word LIKE $2 "
    queryStr = queryStr +        "OR mc.category_name LIKE $2 "
    client.query(queryStr, [area, "%" + word + "%"]).then(res => {
        if (res.rows.length <= 0) {
            console.log("データが0件でした")
            client.end()
            return 
        }
        // データ作成
        let data = []
        for (let i = 0; i < res.rows.length; i++) {
            const innerData = {
                url : res.rows[i].url,
                row : {
                    column : res.rows[i].word,
                    value : res.rows[i].value,
                    unit : res.rows[i].unit
                }
            }
            data.push(innerData)
        }

        // 返却用データ作成
        const outData = {
            area : area,
            category : res.rows[0].category_name,
            data : data
        }
        result.push(outData)
        client.end()
    }).catch(e => {
        console.log("データ取得に失敗しました")
        console.error(e)
        client.end()
        return
    })

    // 検索結果返却
    return new Promise((resolve, reject) => {
        builder.build(function (err, tokenizer) {            
            resolve(result)
        })
    })
}
