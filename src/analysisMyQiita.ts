function myFunction() {
  // 取得日付設定
  const now = new Date()
  const record_title = ['日付']
  const record_page_views = [now]

  // Qiita API による自身の投稿を取得
  let url = 'https://qiita.com/api/v2/authenticated_user/items'
  const option: any = {
    headers: {
      'Authorization': 'Bearer eb8c6508b1a026934b6063a87f84eacf361ee004'
    },
    method: 'get'
  }

  let res = UrlFetchApp.fetch(url, option)
  let list = JSON.parse(res.getContentText())
  
  // 取得したアイテムをループして、viewを取得
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    const item_id = item['id']
    const title = item['title']

    // page viewを取得
    url = 'https://qiita.com/api/v2/items/' + item_id
    res = UrlFetchApp.fetch(url, option)
    const json = JSON.parse(res.getContentText())
    const page_views_count = json['page_views_count']

    // シート書き出しのためにデータをセット
    record_title.push(title)
    record_page_views.push(page_views_count)
  }
  // スプレッドシートのセット
  const spreadsheet = SpreadsheetApp.openById('1F9DdhhvVwD4Ly04BJH8VYSjO1cizqfaIwhAXwauZWcg')

  // シート：view
  let sheet = spreadsheet.getSheetByName('view')
  sheet.getRange('1:1').clear()
  sheet.getRange(1, 1, 1, record_title.length).setValues([record_title])
  sheet.appendRow(record_page_views)
}
