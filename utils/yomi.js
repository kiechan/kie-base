"use strict"

/**
 * yomi データ検索
 * @return {area:地名,category:カテゴリー,data:[{url:URL,row:{column:項目,value:情報,unit:単位}}]}
 */
module.exports.search = (inputData, satoriResult) => {
    return new Promise((resolve, reject) => {
        if (inputData.length  <= 0 || satoriResult.length <= 0) {
            console.log("inputデータがありません")
            reject()
        }
        let area = ""
        let word = ""
        // 検索地域を取得
        for (let i = 0; i < satoriResult.areaArray.length; i++) {
            area = area + satoriResult.areaArray[i]
        }
        // 検索ワードを取得
        for (let i = 0; i < satoriResult.keywordArray.length; i++) {
            word = word + satoriResult.keywordArray[i]
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
        let queryStr = "SELECT area.code, area.name, od.value, od.unit, od.url, od.word, cat.category_name "
        queryStr = queryStr + "FROM (SELECT area_code AS code, COALESCE(district, municipality, prefectures) AS name FROM m_area "
        queryStr = queryStr + "WHERE prefectures LIKE $1 "
        queryStr = queryStr + "OR municipality LIKE $1 "
        queryStr = queryStr + "OR district LIKE $1 ) area "
        queryStr = queryStr + "LEFT JOIN t_opendata od "
        queryStr = queryStr + "ON area.code = od.area_code "
        queryStr = queryStr + "INNER JOIN m_category cat "
        queryStr = queryStr + "ON od.category_code = cat.category_code "
        queryStr = queryStr + "WHERE od.value LIKE $2 "
        queryStr = queryStr + "OR cat.category_name LIKE $2 "

        client.query(queryStr, [area, "%" + word + "%"]).then(res => {
            if (res.rows.length <= 0) {
                console.log("データが0件でした")
                client.end()
                reject()
            }
            // データ作成
            let data = []
            for (let i = 0; i < res.rows.length; i++) {
                const innerData = {
                    url : res.rows[i].url,
                    row : {
                        area : res.rows[i].name,
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
            resolve(result)
        }).catch(e => {
            console.log("データ取得に失敗しました")
            console.error(e)
            client.end()
            reject()
        })
    })
}
