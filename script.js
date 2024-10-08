"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2024-08-15T17:01:17.194Z",
    "2024-08-17T23:36:17.929Z",
    "2024-08-19T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EGP",
  locale: "ar-EG", // de-DE
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "SYP",
  locale: "ar-SA", // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

///////////////////////////////////////////

// initial names
const createUserName = (accs) => {
  accs.forEach((acc) => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((user) => user[0])
      .join("");
  });
};

createUserName(accounts);

// format currency
const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// Display Movements in our App
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const displayDate = nowDate(date, acc.locale);
    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formatCur(
        mov,
        acc.locale,
        acc.currency
      )}</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplaySummery = function (acc) {
  const incomes = acc.movements
    .filter((el) => el > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((el) => el < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interests = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((mov) => mov > 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCur(interests, acc.locale, acc.currency);
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const updateUI = (acc) => {
  displayMovements(acc);

  calcDisplayBalance(acc);

  calcDisplaySummery(acc);
};

// start Log Out Timer
const startLogOutTimer = () => {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === -1) {
      clearInterval(countOut);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    time--;
  };

  let time = 60 * 10;
  tick();
  const countOut = setInterval(tick, 1000);
  return countOut;
};

// handler
let currentAccount, timer;

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentAccount = accounts.find(
    (mov) => mov.userName === inputLoginUsername.value
  );

  if (
    currentAccount?.pin === Number(inputLoginPin.value) &&
    currentAccount?.userName === inputLoginUsername.value
  ) {
    labelWelcome.textContent = `welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 1;
    updateUI(currentAccount);
    labelDate.textContent = nowDateAndTime();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }

  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();
});

// Transfer money
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  let amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date());
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date());
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();
  updateUI(currentAccount);
});

/* Close account */
btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  const accountDelete = accounts.find(
    (acc) => acc.userName === inputCloseUsername.value
  );
  let accountDeleteUsername = inputCloseUsername.value;
  let accountDeletePin = Number(inputClosePin.value);

  if (
    accountDelete?.userName === accountDeleteUsername &&
    accountDelete.pin === accountDeletePin
  ) {
    accounts.splice(accounts.indexOf(accountDelete), 1);
  }

  if (
    accountDelete.userName === currentAccount.userName &&
    accountDelete.pin === currentAccount.pin
  ) {
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
  inputClosePin.blur();
});

// Request loan
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov > amount * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// function for date and time

function nowDateAndTime(Data = new Date()) {
  const options = {
    hour: "numeric" /*2-digit, long*/,
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };

  return new Intl.DateTimeFormat(currentAccount.locale, options).format(Data);
}

function nowDate(Data, locale) {
  const nowDate = new Date();
  const calcDay = Math.trunc((+nowDate - +Data) / (1000 * 60 * 60 * 24));

  if (calcDay === 0) return `TODAY`;
  if (calcDay === 1) return `YESTERDAY`;
  if (calcDay <= 7) return `${calcDay} DAYS AGO`;
  else {
    return new Intl.DateTimeFormat(locale).format(Data);
  }
}

///////////////////////////////////////////
/////// some challenge
///////////////////////////////////////////
