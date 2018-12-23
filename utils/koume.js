// expressモジュールを読み込む
const express = require('express');

// expressアプリを生成する
const app = express();

// CORSを許可する
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * コウメAWBAPI.<br />
 * 各種処理呼び出しWEBAPI.<br />
 */
app.post('/koume', (req, res) => {

    // 会話ID
    let talkId = req.talkId;
    // 会話連番
    let talkSeqNo = req.talkSeqNo;
    // 会話内容
    let talkContent = req.talkContent;

    // エラーメッセージリスト生成
    let errorMessageList = new Array();

    // 各種エラーチェック
    // 【必須】会話ID
    // if (talkId == null || talkId == '') {
    //   errorMessageList.push('talkIdは必須です。')
    // }
    // // 【必須】会話連番
    // if (talkSeqNo == null) {
    //   errorMessageList.push('talkSeqNoは必須です。')
    // }

    if (errorMessageList.length > 0) {
      // エラーありの場合
      res.json(errorMessageList);
    }

    // TODO 処理呼び出し


    // 会話オブジェクト生成
    let talkObject = new Object();
    // 会話内容を設定
    talkObject.talkId = 'dogId';
    // 会話連番を設定
    talkObject.talkSeqNo = 1;
    // 返信オブジェクト生成
    let talkResponse = new Object();
    // 返信内容
    talkResponse.content = '犬うるさい';
    // 返信URL
    talkResponse.url = 'http://komachi.yomiuri.co.jp/t/2009/0618/246414.htm';
    // 会話内容を設定
    talkObject.talkResponse = talkResponse;

    // JSONを送信する
    res.json(talkObject);
});

// ポート3000でサーバを立てる
app.listen(3000, () => console.log('Listening on port 3000'));
