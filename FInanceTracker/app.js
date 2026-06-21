const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const clearBtn = document.getElementById('clear-btn');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
    e.preventDefault();

    // Verification check: Prevent adding 0 as a transaction
    if (parseFloat(amount.value) === 0) {
        alert('Please enter an income value greater than 0, or an expense value less than 0.');
        return;
    }

    const transaction = {
        id: generateID(),
        text: text.value.trim(),
        amount: parseFloat(amount.value)
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        ${transaction.text} <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
    `;

    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `+$${income}`;
    money_minus.innerText = `-$${expense}`;
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// Global purge function to empty storage state safely
function clearAllTransactions() {
    if (transactions.length === 0) return;
    
    if (confirm('Are you sure you want to delete all transaction records?')) {
        transactions = [];
        updateLocalStorage();
        init();
    }
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

form.addEventListener('submit', addTransaction);
clearBtn.addEventListener('click', clearAllTransactions);

init();