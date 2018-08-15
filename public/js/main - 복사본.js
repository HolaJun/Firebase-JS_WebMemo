// Javascript Onload
$(document).ready(function(){

	var index, auth, database, userInfo, selectedKey;
	var items = getFromLocal('memos');
	// 파이어베이스 초기화
	var config = {
	  apiKey: "AIzaSyB9Uuks71XG9Cv2j5oQ0xuWn03ptD22Y3Y",
	  authDomain: "webmemo-b9b71.firebaseapp.com",
	  databaseURL: "https://webmemo-b9b71.firebaseio.com",
	  projectId: "webmemo-b9b71",
	  storageBucket: "webmemo-b9b71.appspot.com",
	  messagingSenderId: "657504313482"
	};

	loadList(items);

	firebase.initializeApp(config);

	// 구글 인증창 띄우는 함수
	function googleLoginPopup() {
			auth = firebase.auth();
			database = firebase.database();
			var authProvider = new firebase.auth.GoogleAuthProvider();

			// 구글 인증 팝업창
			auth.onAuthStateChanged(function(user) {
				if( user ) {
					// 인증 성공시
					console.log("firebase connect sussess");
					console.log(user);
					//메모리스트 출력
					// userInfo = 연결 DB명
					userInfo = "memoWebTest";
					get_memo_list();
				} else {
					// 인증 실패시
					auth.signInWithPopup(authProvider); // 팝업 창 띄우기
				}
			});
	};

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

	// main-input에 내용이 입력된 경우
	$('#main-input').keypress(function(e){
		if(e.which === 13) { // 아무 키나 입력된 경우
			if ($('#main-input').val().length !== 0)
				$('#main-button').click();
		}
	});

	// 추가 버튼을 눌렀을 경우
	$('#main-button').click(function(){
		var value = $('#main-input').val();
		items.push(value);
		//console.log(items[0]);
		$('#main-input').val('');
		loadList(items);
		storeToLocal('memos', items);
		// set button to
		$('button').prop('disabled', true);
	});

	// 메모 삭제 버튼을 눌렀을 경우
	$('ul').delegate("span", "click", function(event){
		event.stopPropagation();
		index = $('span').index(this);
		$('li').eq(index).remove();
		items.splice(index, 1);
		storeToLocal('memos', items);

	});

	// 메모를 클릭 후 수정할 내용을 입력하는 경우
	$('ul').delegate('li', 'click', function(){
		index = $('li').index(this);
		var content = items[index];
		console.log(content);
		$('#edit-input').val(content);
	});

	// 메모 '수정' 버튼을 클릭했을 경우
	$('#edit-button').click(function(){
		items[index] = $('#edit-input').val();
		loadList(items);
		storeToLocal("memos", items);
	});

	// 메모리스트 Load
	function loadList(items){
		$('li').remove();
		if(items.length > 0) {
			for(var i = 0; i < items.length; i++) {
				// 클릭시 moadl 동작(data-toggle). id가 editModal인 태그 실행(data-target)
				$('ul').append(	'<li class= "list-group-item" data-toggle="modal" data-target="#editModal">'
												+ items[i] +
												'<span class="glyphicon glyphicon-remove"></span></li>'
										  );
			}
		}
	};

	function storeToLocal(key, items){
		localStorage[key] = JSON.stringify(items);
	}

	function getFromLocal(key){
		if(localStorage[key])
			return JSON.parse(localStorage[key]);
		else
			return [];
	}

  $("#googleLogin").click(function() {
      googleLoginPopup();
  });

});
