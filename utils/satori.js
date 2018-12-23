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

        let result = []
        const {Client} = require('pg');
        const client = new Client({
            user: 'root',
            host: 'udc2019-aws-db.ctdjivyul3eu.ap-northeast-1.rds.amazonaws.com',
            database: 'udc2019_aws_db',
            password: 'rootroot',
            port: 5432,
        });
        // 接続チェック
        client.connect(function(err, res) {
            if (err) {
                console.log("DB接続に失敗しました")
                console.log(err)
                reject()
            }
        })
            let queryStr1 =             "SELECT ";
            queryStr1     = queryStr1 +     "COUNT(mst.*) AS cnt ";
            queryStr1     = queryStr1 +   "FROM m_area mst ";
            queryStr1     = queryStr1 +  "WHERE mst.prefectures LIKE $1 ";
            // queryStr1     = queryStr1 +     "OR mst.municipality LIKE $1 ";
            // queryStr1     = queryStr1 +     "OR mst.district LIKE $1 ";
            console.log(queryStr1);
            client.query(queryStr1, ["%" + "word" + "%"]).then(res => {
              // console.log(res.rows[0].cnt);
              //   if (res.rows.length > 0) {
              //       if (res.rows[0].cnt != null && res.rows[0].cnt > 0) {
              //           // 地域データが存在する場合
              //           isArea = true;
              //       }
              //   }
              client.end();
            }).catch(e => {
                // console.log("データ取得に失敗しました");
                console.error(e);
                client.end();
                reject();
            })
        // analyzedWords.forEach(analyzedWord => {
        //     let isArea = false;
        //     let isKeyword = false;
        //     let word = analyzedWord.word;
        //     let type = analyzedWord.type;
        //     let typeDetail1 = analyzedWord.typeDetail1;
        //     let typeDetail2 = analyzedWord.typeDetail2;
        //     let typeDetail3 = analyzedWord.typeDetail3;
        //     let reading = analyzedWord.reading;
        //
        //     // 地域判定
        //     if (type == '地域'
        //         || typeDetail1 == '地域'
        //         || typeDetail1 == '地域'
        //         || typeDetail1 == '地域'
        //         || typeDetail1 == '地域') {
        //
        //         isArea = true;
        //     }
        //
        //     let queryStr1 =             "SELECT ";
        //     queryStr1     = queryStr1 +     "COUNT(mst.*) AS cnt ";
        //     queryStr1     = queryStr1 +   "FROM m_area mst ";
        //     queryStr1     = queryStr1 +  "WHERE mst.prefectures LIKE $1 ";
        //     queryStr1     = queryStr1 +     "OR mst.municipality LIKE $1 ";
        //     queryStr1     = queryStr1 +     "OR mst.district LIKE $1 ";
        //     console.log(queryStr1);
        //     client.query(queryStr1, ["%" + word + "%"]).then(res => {
        //       console.log(res.rows[0].cnt);
        //         if (res.rows.length > 0) {
        //             if (res.rows[0].cnt != null && res.rows[0].cnt > 0) {
        //                 // 地域データが存在する場合
        //                 isArea = true;
        //             }
        //         }
        //
        //     }).catch(e => {
        //         console.log("データ取得に失敗しました");
        //         console.error(e);
        //         client.end();
        //         reject();
        //     })
        //
        //     // キーワード判定
        //     let queryStr2 =             "SELECT ";
        //     queryStr2     = queryStr2 +     "COUNT(mst.*) AS cnt ";
        //     queryStr2     = queryStr2 +   "FROM m_category mst ";
        //     queryStr2     = queryStr2 +  "WHERE mst.category_name LIKE $1 ";
        //     client.query(queryStr2, ["%" + word + "%"]).then(res => {
        //         if (res.cnt > 0) {
        //             if (res.rows[0].cnt != null && res.rows[0].cnt > 0) {
        //                 // カテゴリデータが存在する場合
        //                 isKeyword = true;
        //             }
        //         }
        //     }).catch(e => {
        //         console.log("データ取得に失敗しました");
        //         console.error(e);
        //         client.end();
        //         reject();
        //     })
        //
        //     if (isArea) {
        //         // 単語が地域の場合
        //         areaArray.push(word);
        //     }
        //
        //     if (isKeyword) {
        //         // キーワードが地域の場合
        //         keywordArray.push(word);
        //     }
        // });

        client.end();

    });

    // 返却はオブジェクトに配列を2つ（地域配列、キーワード配列）
}
