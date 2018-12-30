module.exports.createMessage = (satoriResult) => {

    // 結果区分：NG
    const RESULT_DIV_NG = '0'
    // 結果区分：OK
    const RESULT_DIV_OK = '1'

    // NG区分：キーワード＆地域なし
    const NG_DIV_NO_KEYWORD_AREA = '0'
    // NG区分：キーワードなし
    const NG_DIV_NO_KEYWORD = '1'
    // NG区分：地域なし
    const NG_DIV_NO_AREA = '2'
    // NG区分：キーワード複数
    const NG_DIV_MULTI_KEYWORD = '3'

    // メッセージ：正常
    const MESSAGE_TEMPLATE_CORRECT_ROUTE = '何の情報が知りたいッピ？'
    // メッセージ：キーワード＆地域なし
    const MESSAGE_TEMPLATE_NO_KEYWORD_AREA = 'どこの地域の情報が知りたいッピ？'
    // メッセージ：キーワードなし
    const MESSAGE_TEMPLATE_NO_KEYWORD = '${area}の何が知りたいッピ？'
    // メッセージ：地域なし
    const MESSAGE_TEMPLATE_NO_AREA = 'どこの${category}が知りたいッピ？'
    // メッセージ：キーワード複数
    const MESSAGE_TEMPLATE_MULTI_KEYWORD_1 = `難しい言葉は分からないッピorz`
    const MESSAGE_TEMPLATE_MULTI_KEYWORD_2 = `知りたい情報を１つに絞ってくれっぴ！`

    // 返却メッセージオブジェクト
    const returnMessage = {
        status: 0,
        messages: [],
        areaArray: satoriResult.areaArray,
        keywordArray: satoriResult.keywordArray
    }

    // SATORIの結果がNULL又は正常系
    if (satoriResult == null || satoriResult.resultdiv === RESULT_DIV_OK) {
        returnMessage.status = 1
        returnMessage.messages.push(MESSAGE_TEMPLATE_CORRECT_ROUTE)
        return returnMessage
    }

    // 地域(文字列)
    let area = ''
    // キーワード(文字列)
    let cateogry = ''

    // キーワード＆地域なしの場合
    if (satoriResult.ngDiv === NG_DIV_NO_KEYWORD_AREA) {
        returnMessage.messages.push({
            words: MESSAGE_TEMPLATE_NO_KEYWORD_AREA,
            url: null
        })
    }
    // キーワードなし又はキーワード複数件の場合
    else if (satoriResult.ngDiv === NG_DIV_NO_KEYWORD || satoriResult.ngDiv === NG_DIV_MULTI_KEYWORD) {
        satoriResult.areaArray.map(a => {
            area = area + a
        })
        // 複数件の場合には１件にする必要がある旨のメッセージを加える
        if (satoriResult.ngDiv === NG_DIV_MULTI_KEYWORD) {
            returnMessage.messages.push(
                {
                    words: MESSAGE_TEMPLATE_MULTI_KEYWORD_1,
                    url: null
                })
            returnMessage.messages.push({
                words: MESSAGE_TEMPLATE_MULTI_KEYWORD_2,
                url: null
            })
        }
        returnMessage.messages.push({
            words: MESSAGE_TEMPLATE_NO_KEYWORD.replace('${area}', area),
            url: null
        })
    }
    // 地域なしの場合
    else {
        category = satoriResult.keywordArray[0]
        returnMessage.messages.push({
            words: MESSAGE_TEMPLATE_NO_AREA.replace('${category}', category),
            url: null
        })
    }

    return returnMessage
}
