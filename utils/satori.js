"use strict"

module.exports.checkAnalyzedWords = (analyzedWords) => {

    return new Promise((resolve, reject) => {


        // if (analyzedWords == null) {
        //     // 検索条件が無効な場合
        //     console.log('検索条件が無効です。');
        //     reject;
        // }

        // 地域ワード配列を生成

        let areaArray = new Array();
        // キーワード配列を生成
        let keywordArray = new Array();

        // 検索条件をもとに以下のチェックを行う。
        // ①文法チェック
        //  地域のみ→キーワードなしのためNG
        //  キーワードのみ→地域なしのためNG
        // ②キーワードチェック
        //  キーワード検索結果：0、1件→検索できるためOK
        //  キーワード検索結果：2件以上→キーワードが多いためNG
        //  地域検索結果が二か所以上あってもOK


        const { Client } = require('pg');
        const client = new Client({
            user: 'root',
            host: 'udc2019-aws-db.ctdjivyul3eu.ap-northeast-1.rds.amazonaws.com',
            database: 'udc2019_aws_db',
            password: 'rootroot',
            port: 5432
        });
        // 接続チェック
        client.connect((err, res) => {
            if (err) {
                console.log("DB接続に失敗しました")
                console.log(err)
                reject()
            }
        })

        let fncAry = []

        for (let i = 0; i < analyzedWords.length; i++) {
            fncAry.push(new Promise((resolve, reject) => {
                let analyzedWord = analyzedWords[i]

                let result = new Object()
                let isArea = false
                let isKeyword = false
                let area = null
                let keyword = null
                let word = analyzedWord.word
                let type = analyzedWord.type
                let typeDetail1 = analyzedWord.typeDetail1
                let typeDetail2 = analyzedWord.typeDetail2
                let typeDetail3 = analyzedWord.typeDetail3

                // 地域判定
                if (type == '地域'
                    || typeDetail1 == '地域'
                    || typeDetail2 == '地域'
                    || typeDetail3 == '地域') {

                    isArea = true;
                }

                // 地域判定
                const QUERY_1 =
                    "SELECT "
                    + "COUNT(mst.*) AS cnt "
                    + "FROM m_area mst "
                    + "WHERE mst.prefectures LIKE $1 "
                    + "OR mst.municipality LIKE $1 "
                    + "OR mst.district LIKE $1 "
                client.query(QUERY_1, ["%" + word + "%"]).then(res => {
                    console.log('1ok')
                    if (res.rows.length > 0) {
                        if (res.rows[0].cnt != null && res.rows[0].cnt > 0) {
                            // 地域データが存在する場合
                            isArea = true
                        }
                    }

                    // キーワード判定
                    const QUERY_2 =
                        "SELECT "
                        + "COUNT(mst.*) AS cnt "
                        + "FROM m_category mst "
                        + "WHERE mst.category_name LIKE $1 "
                    client.query(QUERY_2, ["%" + word + "%"]).then(res => {
                        console.log('2ok')
                        if (res.cnt > 0) {
                            if (res.rows[0].cnt != null && res.rows[0].cnt > 0) {
                                // カテゴリデータが存在する場合
                                isKeyword = true
                            }
                        }
                        if (isArea) {
                            // 単語が地域の場合
                            area = word
                        }

                        if (isKeyword) {
                            // キーワードが地域の場合
                            keyword = word
                        }

                        result.isArea = isArea
                        result.isKeyword = isKeyword
                        result.area = area
                        result.keyword = keyword

                        resolve(result)
                    }).catch(e => {
                        console.log('2err')
                        reject(e)
                    })
                }).catch(e => {
                    console.log('1err')
                    reject(e)
                })
            })
            )
        }

        Promise.all(fncAry).then(results => {
            console.log('-----')
            console.log(results)
            console.log('-----')
            client.end()
        }).catch(err => {
            console.log(err)
            client.end()
        });
    })
}
