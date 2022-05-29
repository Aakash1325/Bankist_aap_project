'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Tony stark',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Captain America',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Wanda vision',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Aakash Bairwa',
  movements: [
    5000, 3400, -150, -790, -3210, -1000, 8500, -30, 2000, 340, -1200,
  ],
  interestRate: 1.8,
  pin: 7000,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

// Functions

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${Math.abs(mov)}₹</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}₹`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}₹`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}₹`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}₹`;
};

// createUsername  Tony stark  =  ts

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// start log out timer 
let time;

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

   // Set time to 5 minutes
   let time = 5*60;

   // Call the timer every second
   tick();
   const timer = setInterval(tick, 1000);
 
   return timer;
 };

// Event handlers
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    // updateUI(currentAccount);

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// All Accounts
console.log(accounts);

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
  for(const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i+1} : You deposited ${movement}`);
  } else {
    console.log(`Movement ${i+1} : your withdrew ${Math.abs(movement)}`);
  }
}


/*

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function (mov) {
  return mov > 0;
});

const depositsFor = [];

for (const mov of movements) if (mov > 0) depositsFor.push(mov);

console.log(movements);
console.log(deposits);
console.log(depositsFor);

const withdrawals = movements.filter(mov => {
  return mov < 0;
});

console.log(withdrawals);

*/

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const balancefor = function (mov) {
//   let sum = 0;
//   for (let i = 0; i < mov.length; i++) {
//     sum = sum + mov[i];
//   }
//   return sum;
// };

// console.log(balancefor(movements));

// // accumulator -> snowball
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i} : ${acc}`);
//   return acc + cur;
// }, 0);

// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) {
//   balance2 += mov;
// }

// console.log(balance2);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const balance = movements.reduce((acc, cur, i, arr) => {
//   console.log(`Iteration ${i} : ${acc}`);
//   return acc + cur;
// }, 0);

// console.log(balance);

// maximan value
/*
const maxMov = function (mov) {
  let curmax = mov[0];

  for (let i = 0; i < mov.length; i++) {
    if (mov[i] > curmax) {
      curmax = mov[i];
    }
  }
  return curmax;
};

console.log(maxMov(movements));

console.log(max);

// */
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const displayMovements = function (movements, sort = false) {
//   containerMovements.innerHTML = '';

//   const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

//   movs.forEach((mov, i) => {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';

//     const html = `
//     <div class="movements__row">
//       <div class="movements__type movements__type--${type}">${
//       i + 1
//     } ${type}</div>
//       <div class="movements__date">3 days ago</div>
//       <div class="movements__value">${mov}₹</div>
//     </div>

//   `;
//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };

// // displayMovements(account1.movements);

// const calcDisplayBalance = function (acc) {
//   acc.balance = acc.movements.reduce((acc, mov) => {
//     return acc + mov;
//   }, 0);
//   // acc.balance = balance;
//   console.log(acc.balance);
//   labelBalance.textContent = `${acc.balance} ₹`;
// };

// // calcDisplayBalance(account1.movements);

// const calcDisplaySummary = function (acc) {
//   const incomes = acc.movements
//     .filter(mov => {
//       return mov > 0;
//     })
//     .reduce((acc, mov) => {
//       return acc + mov;
//     });

//   labelSumIn.textContent = `${incomes}₹`;

//   const outs = acc.movements
//     .filter(mov => {
//       return mov < 0;
//     })
//     .reduce((acc, mov) => {
//       return acc + mov;
//     });

//   labelSumOut.textContent = `${Math.abs(outs)}₹`;

//   const interest = acc.movements
//     .filter(mov => {
//       return mov > 0;
//     })
//     .map(deposit => {
//       return (deposit * acc.interestRate) / 100;
//     })
//     .filter((intr, i, arr) => {
//       // console.log(arr);
//       return intr >= 1;
//     })
//     .reduce((acc, intr) => {
//       return acc + intr;
//     });
//   labelSumInterest.textContent = `${interest}₹`;
// };

// // calcDisplaySummary(movements);
// // Maximum value

// console.log(max);

// */
// const createUserNames = function (accs) {
//   accs.forEach(acc => {
//     acc.username = acc.owner
//       .toLowerCase()
//       .split(' ')
//       .map(name => {
//         return name[0];
//       })
//       .join('');
//   });
// };

// createUserNames(accounts);

// /* ?_____find method______

// const firstWithdrawal = movements.find(mov => {
//   return mov < 0;
// })

// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => {
//   return acc.owner === 'Jessica Davis';
// });

// console.log(account);
// */

// const updateUI = function (acc) {
//   //display movments
//   displayMovements(acc.movements);

//   //display balance
//   calcDisplayBalance(acc);

//   //display summary
//   calcDisplaySummary(acc);
// };

// // Even handler

// let currentAccount;

// btnLogin.addEventListener('click', function (e) {
//   //prevent form from submiting
//   e.preventDefault();

//   currentAccount = accounts.find(acc => {
//     return acc.username === inputLoginUsername.value;
//   });
//   console.log(currentAccount);

//   inputTransferAmount.value = inputTransferTo.value = '';

//   if (currentAccount?.pin === Number(inputLoginPin.value)) {
//     //display UI and massage

//     labelWelcome.textContent = `Welcome back, ${
//       currentAccount.owner.split(' ')[0]
//     }`;

//     containerApp.style.opacity = 100;

//     //clear input fields
//     inputLoginUsername.value = inputLoginPin.value = '';
//     inputLoginPin.blur();

//     //updata UI

//     updateUI(currentAccount);

//     // console.log('LOGIN');
//   }
// });

// // console.log(accounts);

// // const inputTransferTo = document.querySelector('.form__input--to');
// // const inputTransferAmount = document.querySelector('.form__input--amount');

// btnTransfer.addEventListener('click', function (e) {
//   e.preventDefault();

//   const amount = Number(inputTransferAmount.value);
//   const receiverAcc = accounts.find(
//     acc => acc.username === inputTransferTo.value
//   );
//   console.log(amount, receiverAcc);

//   if (
//     amount > 0 &&
//     currentAccount.balance >= amount &&
//     receiverAcc &&
//     receiverAcc?.username !== currentAccount.username
//   ) {
//     // console.log('Transfer valid');
//     currentAccount.movements.push(-amount);
//     receiverAcc.movements.push(amount);

//     //updata UI

//     updateUI(currentAccount);
//   }
// });

// btnLoan.addEventListener('click', function (e) {
//   e.preventDefault();

//   const amount = Number(inputLoanAmount.value);

//   if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
//     // Add movement
//     currentAccount.movements.push(amount);

//     // Update UI
//     updateUI(currentAccount);
//   }
//   inputLoanAmount.value = '';
// });

// // const inputCloseUsername = document.querySelector('.form__input--user');
// // const inputClosePin = document.querySelector('.form__input--pin');

// btnClose.addEventListener('click', function (e) {
//   e.preventDefault();

//   // console.log('Delete');
//   if (
//     inputCloseUsername.value === currentAccount.username &&
//     Number(inputClosePin.value) === currentAccount.pin
//   ) {
//     console.log('correct account!');

//     const index = accounts.findIndex(
//       acc => acc.username === currentAccount.username
//     );
//     console.log(index);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('₹', ''))
//   );

//   console.log(movementsUI);

//   // const movementUI2 = [...document.querySelectorAll('.movements__value')]
// });
