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
                    + "mst.* "
                    + "FROM m_area mst "
                    + "WHERE mst.prefectures LIKE $1 "
                    + "OR mst.municipality LIKE $1 "
                    + "OR mst.district LIKE $1 "
                client.query(QUERY_1, ["%" + word + "%"]).then(res => {
                    if (res.rows.length > 0) {
                        // 地域データが存在する場合
                        isArea = true;
                    } else {
                        // 地域データが存在しない場合
                        isArea = false;
                    }

                    // キーワード判定
                    const QUERY_2 =
                        "SELECT "
                        + "mst.* "
                        + "FROM m_category mst "
                        + "WHERE mst.category_name LIKE $1 ";
                    client.query(QUERY_2, ["%" + word + "%"]).then(res => {
                        if (res.rows.length == 1) {
                            // キーワードが1件の場合
                            // カテゴリデータが存在する場合
                            isKeyword = true;

                        } else if (res.rows.length > 1) {
                            // キーワードが2件の場合
                            isKeyword = true;
                            overKeywordNum = true;
                        } else {
                            // キーワードが存在しない場合
                            isKeyword = false;
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
            let resultdiv = '1';                   // 結果区分（0(NG),1(OK)）
            let isAreaResult = false;               // 地域存在フラグ（最終結果）
            let isKeywordResult = false;            // キーワード存在フラグ（最終結果）
            let isOverKeywordNumResult = false;    // キーワード複数存在フラグ（最終結果）
            let ngDiv = null;                      // NG区分（0(キーワード地域なし),1(キーワードなし),2(地域なし),3(キーワード複数件)）
            results.forEach(function(val){
              resultdiv = '1';
              ngDiv = null;
              if (val.isArea) {
                // 地域が存在しない場合
                isAreaResult = true;
              }
              if (val.isKeyword) {
                // キーワードが存在しない場合
                isKeywordResult = true;
              }
              if (val.overKeywordNum) {
                // キーワードが複数件の場合
                isOverKeywordNumResult = true;
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
            result.areaArray = areaArray;
            result.keywordArray = keywordArray;
            if (!isAreaResult && !isKeywordResult) {
                // キーワード地域なし
                result.resultdiv = '0';
                result.ngDiv = '0';
            } else if (isAreaResult && !isKeywordResult) {
              // キーワードなし
              result.resultdiv = '0';
              result.ngDiv = '1';
            } else if (!isAreaResult && isKeywordResult) {
              // 地域なし
              result.resultdiv = '0';
              result.ngDiv = '2';
            } else if (isOverKeywordNumResult) {
              // キーワード複数件
              result.resultdiv = '0';
              result.ngDiv = '3';
            } else {
              // 正常
              result.resultdiv = '1';
              result.ngDiv = '';
            }
            client.end();
            return result;
        }).catch(err => {
            console.log(err)
            client.end()
        }));
    })
}
