
	var index, auth, database, userInfo, selectedKey;
	// 파이어베이스 초기화
	var config = {
	  apiKey: "AIzaSyB9Uuks71XG9Cv2j5oQ0xuWn03ptD22Y3Y",
	  authDomain: "webmemo-b9b71.firebaseapp.com",
	  databaseURL: "https://webmemo-b9b71.firebaseio.com",
	  projectId: "webmemo-b9b71",
	  storageBucket: "webmemo-b9b71.appspot.com",
	  messagingSenderId: "657504313482"
	};

	firebase.initializeApp(config);

	// // 로그인 버튼 클릭시 구글인증팝업 열림
	// $("#googleLogin").click(function() {
	// 		googleLoginPopup();
	// });

	// 구글 인증창 띄우는 함수
			auth = firebase.auth();
			database = firebase.database();
			var authProvider = new firebase.auth.GoogleAuthProvider();

			// 구글 인증 팝업창
			auth.onAuthStateChanged(function(user) {
				if( user ) {
					// 인증 성공시
					console.log("[★] firebase connect sussess");
					console.log("[★] user infomation ↓");
					console.log(user);
					//메모리스트 출력
					// userUid = 연결할 UID명
					userInfo = "memoWebTest";
					get_memo_list();
				} else {
					// 인증 실패시
					auth.signInWithPopup(authProvider); // 팝업 창 띄우기
				}
			});

	// 메모리스트 불러오기
	function get_memo_list() {
		console.log("[★]userInfo.uid: " + userInfo);
		// 데이터베이스의 경로를 가져옴
		// 비동기방식으로 데이터를 가져옴
		var memoRef = database.ref('memos/' + userInfo);

		memoRef.on('child_added', on_child_added);
		memoRef.on('child_changed', function(data) {
			console.log('data.key: ' + data.key);
			console.log('[★]data.val(): ' + data.val());

			var key = data.key;
			var txt = data.val().txt;

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

		console.log("[★] key: " + key);
		console.log("[★] memoData: ↓");
		console.log(memoData)
		console.log("[★] txt: " + txt);

		$('ul').append(	'<li id="' + key + '" class="list-group-item">'
										+ txt +
										'<span onclick="delete_data(\'' + key + '\')" class="glyphicon glyphicon-remove"></span>' +
										'<span class="glyphicon glyphicon-edit"></span>' +
										'</li>'
									);
									console.log("데이터추가됨");

		// $('ul').append(	'<li class="list-group-item" data-toggle="modal" data-target="#editModal">'
		// 								+ txt +
		// 								'<span class="glyphicon glyphicon-remove"></span></li>'
		// 							);
	}

	// 'button' 태그를 비활성화
	$('button').prop('disabled', true);

	// 수정 모달의 취소버튼 활성화
	$('#cancel-button, #x-button').prop('disabled', false);

	// input 태그에 키보드 키를 눌렀다 떼는 경우
	$('input').keyup(function(){
		if($(this).val().length !== 0) { // this=input
			$('button').prop('disabled', false); // button 활성화
		} else {
			$('button').prop('disabled', true); // button 비활성화
		}
	});

	// main-input에 키를 입력하는 경우
	$('#main-input').keypress(function(e){
		if(e.which === 13) { // 아무 키나 입력된 경우
			console.log('main-input에 키가 입력되었음');
			if ($('#main-input').val().length !== 0)
					$('#main-button').click();
		}
	});

	// 추가 버튼을 눌렀을 경우
	$('#main-button').click(function(){
		// 데이터를 저장할 UID 주소 초기화
		var memoRef = database.ref('memos/' + userInfo);
		// main-input 입력한 데이터 값
		var value = $('#main-input').val();
		memoRef.push({
			txt: value,
			createDate: new Date().getTime()
		});
		// value에 아무것도 입력이 되어있지 않으면 추가되지 않음.
		if (value == '') {
	    return;
	  }
		$('#main-input').val('');
		$('button').prop('disabled', true);
	});

	// 메모 삭제 버튼을 누른 경우
	function delete_data(key) {
		console.log("[★] delete_data() key: " + key);
		if(!confirm('삭제할껴?')) {
			return;
		}
			var memoRef = database.ref('memos/' + userInfo + '/' + key);
			$("#" + key).remove();
			memoRef.remove();
	}

	// 메모를 클릭 후 수정할 내용을 입력하는 경우
	$('ul').on('li', 'click', function(){
		index = $('li').index(this);
		var content = items[index];
		console.log(content);
		$('#edit-input').val(content);
	});

	// 메모 '수정' 버튼을 클릭했을 경우
	$('#edit-button').click(function(){
	});



// Javascript Onload. html소스를 먼저 읽고 가장 마지막에 JS소스를 읽는다.
// $(function(){ } 이렇게 표현해도 된다.
$(document).ready(function(){

// end js onload
});
