// expressモジュールを読み込む
const express = require('express')
const router = express.Router()

/**
 * コウメAWBAPI.<br />
 * 各種処理呼び出しWEBAPI.<br />
 */
router.post('/', (req, res) => {

  // 会話ID
  let talkId = req.body.talkId;
  // 会話連番
  let talkSeqNo = req.body.talkSeqNo;
  // 会話内容
  let talkContent = req.body.talkContent;

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
  let talkObject = {
    talkId: 'dogId',
    talkSeqNo: 1,
    talkResponse: [
      {
        content: talkContent,
        url: 'http://komachi.yomiuri.co.jp/t/2009/0618/246414.htm'
      }
    ]
  }

  // JSONを送信する
  res.json(talkObject)
});

module.exports = router