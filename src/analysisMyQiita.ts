function myFunction() {
  // 変数設定
  let sum_likes = 0
  let sum_page_views = 0
  let sum_stocks = 0

  // 取得日付設定
  const now = new Date()
  const record_title = ['日付']
  const record_page_views = [now]
  const record_likes = [now]
  const record_stocks: any = [now]

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
  list = list.reverse()  // 降順から昇順に変更

  // 取得したアイテムをループして、view, like, stockを取得
  for (let i = 0; i < list.length; i++) {

    const item = list[i]

    // likes数を取得
    const item_id = item['id']
    const title = item['title']
    const likes_count = item['likes_count']
    sum_likes += likes_count

    // page viewを取得
    url = 'https://qiita.com/api/v2/items/' + item_id
    res = UrlFetchApp.fetch(url, option)
    const json = JSON.parse(res.getContentText())
    const page_views_count = json['page_views_count']
    sum_page_views += page_views_count

    // stock数を取得
    let cnt = 1
    let stock_count = 0
    while (cnt < 10) {
      const url_stock = url + '/stockers?page=' + cnt + '&per_page=100'
      const res_stock = UrlFetchApp.fetch(url_stock, option)
      const json_stock = JSON.parse(res_stock.getContentText())
      const stock_num = json_stock.length

      if (stock_num != 100) {
        stock_count = (cnt * 100) - 100 + stock_num
        sum_stocks += stock_count
        break
      } else {
        cnt += 1
      }
    }

    // シート書き出しのためにデータをセット
    record_title.push(title)
    record_page_views.push(page_views_count)
    record_likes.push(likes_count)
    record_stocks.push(stock_count)
  }

  // 率を計算  
  const par_likes = sum_likes / sum_page_views
  const par_stocks = sum_stocks / sum_page_views
  // スプレッドシートのセット
  const spreadsheet = SpreadsheetApp.openById('1F9DdhhvVwD4Ly04BJH8VYSjO1cizqfaIwhAXwauZWcg')
  // シート：sum
  let sheet = spreadsheet.getSheetByName('sum')
  sheet.appendRow([new Date(), list.length, sum_page_views, sum_likes, sum_stocks, par_likes, par_stocks])
  // シート：view
  sheet = spreadsheet.getSheetByName('view')
  sheet.getRange('1:1').clear()
  sheet.getRange(1, 1, 1, record_title.length).setValues([record_title])
  sheet.appendRow(record_page_views)
  // シート：like
  sheet = spreadsheet.getSheetByName('like')
  sheet.getRange('1:1').clear()
  sheet.getRange(1, 1, 1, record_title.length).setValues([record_title])
  sheet.appendRow(record_likes)
  // シート：stock
  sheet = spreadsheet.getSheetByName('stock')
  sheet.getRange('1:1').clear()
  sheet.getRange(1, 1, 1, record_title.length).setValues([record_title])
  sheet.appendRow(record_stocks)
}
