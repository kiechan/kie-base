"use strict"

const kuromoji = require('kuromoji')

module.exports.search = (sentence) => {

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
    client.query("SELECT COALESCE(ma.district, ma.municipality, ma.prefectures) area,* FROM t_opendata tod LEFT JOIN m_category mc ON tod.category_code = mc.category_code LEFT JOIN m_area ma ON tod.area_code = ma.area_code WHERE tod.word LIKE '総人口'", (err,res) => {
        if (err) {
            console.log("データ取得に失敗しました")
            client.end()
            return 
        }
        console.log(res.rows)
        if (res.rows.length <= 0) {
            console.log("データが0件でした")
            client.end()
            return 
        }
        // データ作成
        let data = []
        for (let i = 0, row = res.rows[i]; i < res.rows.length; i++) {
            const innerData = {
                url : row.url,
                row : {
                    column : row.word,
                    value : row.value,
                    unit : row.unit
                }
            }
            data.push(innerData)    
        }

        // 返却用データ作成
        // 地名,カテゴリー,[URL,{項目,結果,単位}]
        const outData = {
            area : res.rows[0].area,
            category : res.rows[0].category_name,
            data : data
        }
        result.push(outData)
        client.end()
    })    

    return new Promise((resolve, reject) => {
        builder.build(function (err, tokenizer) {            
            // 地名,カテゴリー,[URL,{項目,結果,単位}]
            resolve(result)
        })
        
    })
}
