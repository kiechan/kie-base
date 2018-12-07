const NO_AREA_MESSAGE = 'どこの地域の情報が知りたいッピ？'
const NO_CATEGORY_MESSAGE = 'なにが知りたいッピ？'
const NO_DATA_MESSAGE = '回答が見つからなかったッピ！'
const NEW_TALK_MESSAGE = '他になんの情報が知りたいッピ？'

/**
 * @return status 0:回答なし 1:回答あり（１件） 2:回答あり（複数件） 3:地域不明 4:カテゴリ不明 
 */
module.exports.createMessages = (rowData) => {

    const area = rowData.area
    const category = rowData.category
    const answers = rowData.data

    // チェック：回答なし
    if (answers === null || answers.length <= 0) {
        return { status: 0, messages: [{ words: NO_DATA_MESSAGE, url: null }, { words: NEW_TALK_MESSAGE, url: null }]}
    }
    // チェック：地域不明
    else if (area === null || area === '') {
        return { status: 3, messages: [{ words: NO_AREA_MESSAGE, url: null }]}
    }
    // チェック：カテゴリ不明
    else if (category === null || category === '') {
        return { status: 4, messages: [{ words: area + 'の' + NO_CATEGORY_MESSAGE, url: null }]}
    }

    // 回答あり（１件）
    if (answers.length === 1) {
        return {
            status: 1,
            messages: [
                {
                    words: area + 'の' + category + 'は' + answers[0].row.value + answers[0].row.unit + 'ッピ！',
                    url: (answers[0].url !== '') ? answers[0].url : null
                },
                {
                    words: NEW_TALK_MESSAGE,
                    url: null
                }
            ]
        }
    }

    // 回答あり（複数件）
    let messages = [
        {
            words: area + 'の' + category + 'は' + 'こちらッピ！',
            url: null
        }
    ]
    // メッセージの組み立て
    for (let i = 0; i < answers.length; i++) {

        const answer = answers[i]
        let words = ''
        
        if (answer.row !== null) {
            if (answer.row.column !== null && answer.row.column !== '') {
                words = words + answer.row.column + '：'
            }
            if (answer.row.value !== null && answer.row.value !== '') {
                words += answer.row.value
                if (answer.row.unit !== null && answer.row.unit !== '') {
                    words += answer.row.unit
                }
            }
        }

        const message = {
            words: (words !== '') ? words : null,
            url: (answer.url !== null && answer.url !== '') ? answer.url : null
        }
        messages.push(message)
    }

    // 新しい会話を始めるメッセージを追加
    messages.push({
        words: NEW_TALK_MESSAGE,
        url: null
    })
    
    return {
        status: 1,
        messages: messages
    }
}