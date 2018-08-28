
// 간단 가계부 함수
// 추상화가 전혀 안되있어서 좋은 코드가 아님.
/*
var amounts = []; // 금액 기록
var names = []; // 월급, 용돈... 명목 기록
var total = 0;

function deposit(amount, name) {
  if(amount + total < 0) {
    throw new Error('Not enough balance');
  }
  amounts.push(amount);
  names.push(name);
  total += amount;
}

function print() {
  for(var i=0; i<amounts.length; i++) {
    var amount = amounts[i];
    var name = names[i];
    var isDeposit = amount > 0;
    console.log(`${isDeposit ? '입금' : '출금'}\t${name}\t${amount}\n`);
  }
  console.log(`잔액:\t${total}`);
}

try {
  deposit(100, "월급");
  deposit(200, "용돈");
  deposit(-150, "월세");
  deposit(-300, "보험료");
} catch (e) {
  console.log(e);
}

print();
*/

var logs = []; // 장부의 내역을 담음

var total = 0;

function deposit(amount, name) {
  if(amount + total < 0 ) {
    throw new Error(`Not enough balance for ${name}`);
  }
  logs.push({
    amount: amount,
    name: name
  });
  total += amount;
}

function print() {
    var result = '';
    for(var i=0; i<logs.length; i++) {
      var log = logs[i];
      console.log(`${log.amount > 0 ? '입금' : '출금'} \t ${log.name} \t ${log.amount} \n`);
    }
    console.log(`잔액: \t ${total}`);
}

try {
  deposit(100, "월급");
  deposit(200, "보험");
  print();
} catch(e) {
  console.log(e);
}
