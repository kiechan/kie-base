"use strict"

/**
 * insert データ登録
 * @return {area:地名,category:カテゴリー,data:[{url:URL,row:{column:項目,value:情報,unit:単位}}]}
 */
module.exports.input = (inputData) => {
    return new Promise((resolve, reject) => {
        if (inputData.length  <= 0) {
            console.log("inputデータがありません")
            reject()
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
                reject()
            }
        })

        let queryStr =           "INSERT INTO t_userinput "
        queryStr = queryStr +           "(userinput_code, area, word, create_datetime) "
        queryStr = queryStr +    "VALUES (nextval('userinput_code_seq'), $1, $2, now())"
        client.query(queryStr, [area, word]).then(res => {
            client.end()
            resolve()
        }).catch(e => {
            console.log("データ登録に失敗しました")
            console.error(e)
            client.end()
            reject()
        })
    })
}
