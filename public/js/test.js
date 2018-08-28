
var amounts = []; // 금액 기록
var names = []; // 월급, 용돈... 명목 기록
var total = 0;

function deposit(amount, name) {
  amounts[] = amount;

}

function print() {

}

// 가계부
try {
  deposit(100, "월급");
  deposit(200, "용돈");
  deposit(-150, "월세");
  deposit(-300, "보험료");
} catch (e) {
  console.log(e);
}

print();
