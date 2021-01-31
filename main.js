// LINE Message API アクセストークン
var ACCESS_TOKEN = "XXX";
// 通知URL
var PUSH = "https://api.line.me/v2/bot/message/push";
// ブロードキャスト時URL
var BROADCAST = "https://api.line.me/v2/bot/message/broadcast";

/** 
 * doPost
 * POSTリクエストのハンドリング
 */
function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  reply(json);
}

/** 
 * doGet
 * GETリクエストのハンドリング
 */
function doGet(e) {
  return ContentService.createTextOutput("SUCCESS");
}

/** 
 * broadcast
 * botから全ての友だちにメッセージを送る
 */
function broadcast(msg) {
  // リクエストヘッダ
  var headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    "Authorization" : "Bearer " + ACCESS_TOKEN
  };
  // メッセージ
  var postData = {
    "messages" : [
      {
        "type" : "text",
        "text" : msg
      }
    ]
  };
  // POSTオプション作成
  var options = {
    "method" : "POST",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
  };
  return UrlFetchApp.fetch(BROADCAST, options);
}

/** 
 * push
 * botからメッセージを送る
 */
function push() {
  // リクエストヘッダ
  var headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    "Authorization" : "Bearer " + ACCESS_TOKEN
  };
  // メッセージ
  var postData = {
    "messages" : [
      {
        "type" : "text",
        "text" : "Hello from GoogleAppsScript"
      }
    ]
  };
  // POSTオプション作成
  var options = {
    "method" : "POST",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
  };
  return UrlFetchApp.fetch(PUSH, options);
}

function lineAssignedStaffs() {
  var ss = SpreadsheetApp.openById("YYY");
  var date = Moment.moment().parseZone('Asia/Tokyo');

  //本日の日付を月と日だけでフォーマット
  var thisMonth = date.format("YYYY/MM");
  var todayStr = date.format("D");
  var sh = ss.getSheetByName(thisMonth);

  //最終行の番号を取得する
  var lastRow = sh.getLastRow();

  //担当者名を格納する空の配列を作成
  var toban;
  var kotai;
  //日付と担当者の一覧表を二次元配列で取得する
  var table = sh.getRange(1,1,lastRow,9).getValues();
  //二次元配列table内の日付を一つ一つループで調べる
  var row = table[Number(todayStr)];
  var huroToban = row[2];
  var huroKotai = row[3];
  var showerToban = row[7];
  var showerKotai = row[8];

  var msg = '本日，' + thisMonth + '/' + todayStr + 'の風呂掃除当番は「';
  if (huroKotai !== '') {
    msg += huroKotai + "」です！\n（「" + huroToban + "」の交代者です！）";
  } else {
    msg += huroToban + "」です！";
  }

  if (showerToban !== '') {
    msg += '\nシャワー室掃除当番は「';
    if (showerKotai !== '') {
      msg += (showerKotai + '」です！' + '（「' + showerToban + 'の交代者です！）');
    } else {
      msg += showerToban + '」です！';
    }
  }

  //関数sendHttpPost_lineAssignedStaffsに変数contentを渡して起動する
  if (huroToban) {
    broadcast(msg);
  }
}

function cron_lineAssignedStaffs() {
  var now = new Date();

  lineAssignedStaffs(now);
}
