"use strict"

module.exports.checkAnalyzedWords = (analyzedWords) => {

    return new Promise((resolve, reject) => {

        if (analyzedWords == null) {
            // 検索条件が無効な場合
            console.log('検索条件が無効です。');
            reject;
        }

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

        // 検索ワードをもとに検索可能かどうか判定する
        for (let i = 0; i < analyzedWords.length; i++) {
            fncAry.push(new Promise((resolve, reject) => {
                let analyzedWord = analyzedWords[i];            // 検索ワードオブジェクト
                let result = new Object();                      // 結果格納用オブジェクト
                let isArea = false;                             // 地域フラグ
                let isKeyword = false;                          // キーワードフラグ
                let overKeywordNum = false;                     // キーワード数超過フラグ
                let area = null;                                // 地域名
                let keyword = null;                             // キーワード
                let word = analyzedWord.word;                   // 単語
                let type = analyzedWord.type;                   // タイプ
                let typeDetail1 = analyzedWord.typeDetail1;     // 詳細タイプ1
                let typeDetail3 = analyzedWord.typeDetail3;     // 詳細タイプ2
                let typeDetail2 = analyzedWord.typeDetail2;     // 詳細タイプ3

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
                    if (res.rows.length > 0) {
                        if (res.rows[0].cnt != null && res.rows[0].cnt > 0) {
                            // 地域データが存在する場合
                            isArea = true;
                        }
                    }

                    // キーワード判定
                    const QUERY_2 =
                        "SELECT "
                        + "COUNT(mst.*) AS cnt "
                        + "FROM m_category mst "
                        + "WHERE mst.category_name LIKE $1 "
                    client.query(QUERY_2, ["%" + word + "%"]).then(res => {
                        if (res.rows.length == 1) {
                          // キーワードが1件の場合
                            if (res.rows[0].cnt != null && res.rows[0].cnt > 0) {
                                // カテゴリデータが存在する場合
                                isKeyword = true;
                            }
                        } else if (res.rows.length > 1) {
                            // キーワードが2件の場合
                            isKeyword = true;
                            overKeywordNum = false;
                        }

                        if (isArea) {
                            // 単語が地域の場合
                            area = word
                        }

                        if (isKeyword) {
                            // キーワードが地域の場合
                            keyword = word
                        }
                        // 各種結果を設定
                        result.isArea = isArea
                        result.isKeyword = isKeyword
                        result.area = area
                        result.keyword = keyword
                        result.overKeywordNum = overKeywordNum;
                        resolve(result);
                    }).catch(e => {
                        console.log(e)
                        reject(e)
                    })
                }).catch(e => {
                    console.log(e)
                    reject(e)
                })
            })
            )
        }

        resolve(Promise.all(fncAry).then(results => {
            let resultdiv = '1';                  // 結果区分（0(NG),1(OK)）
            let ngDiv = null;                     // NG区分（0(キーワード地域なし),1(キーワードなし),2(地域なし),3(キーワード複数件)）
            results.forEach(function(val){
              resultdiv = '1';
              ngDiv = null;
              if (!val.isArea && !val.isKeyword) {
                  // キーワード地域なし
                  resultdiv = '0';
                  ngDiv = '0';
              } else if (val.isArea && !val.isKeyword) {
                // キーワードなし
                resultdiv = '0';
                ngDiv = '1';
              } else if (!val.isArea && val.isKeyword) {
                // 地域なし
                resultdiv = '0';
                ngDiv = '2';
              } else if (val.overKeywordNum) {
                // キーワード複数件
                resultdiv = '0';
                ngDiv = '3';
              }
              if (val.area != null) {
                // 地域名が有効な場合
                areaArray.push(val.area);
              }
              if (val.keyword != null) {
                // キーワードが有効な場合
                keywordArray.push(val.keyword);
              }
            });
            // 返却用オブジェクトの生成
            let result = new Object();
            result.resultdiv = resultdiv;
            result.ngDiv = ngDiv;
            result.areaArray = areaArray;
            result.keywordArray = keywordArray;
            client.end();
            return result;
        }).catch(err => {
            console.log(err)
            client.end()
        }));
    })
}
