var auth, database, userInfo, selectedKey;
// Initialize Firebase
var config = {
  apiKey: "AIzaSyB9Uuks71XG9Cv2j5oQ0xuWn03ptD22Y3Y",
  authDomain: "webmemo-b9b71.firebaseapp.com",
  databaseURL: "https://webmemo-b9b71.firebaseio.com",
  projectId: "webmemo-b9b71",
  storageBucket: "webmemo-b9b71.appspot.com",
  messagingSenderId: "657504313482"
};
firebase.initializeApp(config);
auth = firebase.auth();
database = firebase.database();
var authProvider = new firebase.auth.GoogleAuthProvider();
auth.onAuthStateChanged(function(user) {
  if( user ) {
    // 인증 성공시
    console.log("sussess");
    console.log(user);
    //메모리스트 출력
    // userInfo = "W3YdIVvpoXMpDZBRMFDGMJSWmSq2";
    userInfo = "memoWebTest";
    get_memo_list();
  } else {
    // 인증 실패시
    auth.signInWithPopup(authProvider); // 팝업 창 띄우기
  }
});

function get_memo_list() {
  console.log("[★]userInfo.uid: " + userInfo);
  var memoRef = database.ref('memos/' + userInfo);
  memoRef.on('child_added', on_child_added);
  memoRef.on('child_changed', function(data) {
    console.log('data.key: ' + data.key);
    console.log(data.val());

    var key = data.key;
    var txt = data.val().txt;
    var title = txt.substr(0, txt.indexOf('\n'));

    $("#" + key + ">.title").text(title);
    $("#" + key + ">.txt").text(txt);
  });
}

function on_child_added(data) {
  /*  데이터 구조
    {
      txt : "메모 내용",
      title: "메모 제목",
      updateDate : "메모 수정일",
      createDate : "메모생성날짜"
    }
  */
  var key = data.key;
  var memoData = data.val();
  var txt = memoData.txt;
  var title = txt.substr(0, txt.indexOf('\n'));
  var firstTxt = txt.substr(0, 1);

  console.log(data.val());
  var html =
     "<li id='"+key+"' class=\"collection-item avatar\" onclick=\"fn_get_data_one(this.id);\" >" + // 메모 리스트 클릭시 onClick 실행
     "<i class=\"material-icons circle red\">" + firstTxt + "</i>" + // 글자의 아이콘
     "<span class=\"title\">" + title + "</span>" + // 메모리스트 제목
     "<p class='txt'>" + txt + "<br>" + // 메모리스트 내용
     "</p>" +
     "<a href=\"#!\" onClick=\"fn_delete_data('"+key+"')\" class=\"secondary-content\"><i class=\"material-icons\">grade</i></a>" +
     "</li>";

   $(".collection").append(html);

}

function fn_get_data_one(key) {
      selectedKey = key;
      var memoRef = database.ref('memos/' + userInfo + '/' + key)
      .once('value').then(function(snapshot) {
          $(".textarea").val(snapshot.val().txt);
      });
}

function fn_delete_data(key) {
  if(!confirm('삭제하시겠습니까?')) {
    return;
  }
  var memoRef = database.ref('memos/' + userInfo + '/' + key);
  memoRef.remove(); // firebase remove
  $("#"+key).remove(); // jsQuery remove
  initMemo();
}

function save_data() {
  var memoRef = database.ref('memos/' + userInfo);
  var txt = $(".textarea").val();
  // txt에 아무런 내용이 없으면 메모에 저장되지 않음.
  if (txt == '') {
    return;
  }
  if(selectedKey) {
    memoRef = database.ref('memos/' + userInfo + '/' + selectedKey);
    memoRef.update({
        txt: txt,
        createDate: new Date().getTime(),
        updateDate: new Date().getTime()
    });
  } else {
    //PUSH
    memoRef.push({
      txt: txt,
      createDate: new Date().getTime()
    })
  }
}

function initMemo() {
    $('.textarea').val('');
    selectedKey = null;
}

// textarea 이벤트가 취소되었을 때 수행될 함수
$(function() {
  $(".textarea").blur(function() {
    save_data();
  });
});
