// Transaction object
class Transaction {
  constructor(type, description, amount) {
    this.type = type;
    this.description = description;
    this.amount = amount;
  }
}

// UI class
class UI {
  static displayTransactions() {
    const transactions = Store.getTransactions();

    transactions.forEach((transaction) => UI.addTransactionToList(transaction));
    UI.updateSummary(transactions);
  }

  static addTransactionToList(transaction) {
    const transactionList = document.querySelector('#transaction-list');

    const transactionElement = document.createElement('div');
    transactionElement.classList.add('transaction');
    transactionElement.innerHTML = `
      <span class="description">${transaction.description}</span>
      <span class="amount">${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount}</span>
      <button class="delete">Delete</button>
    `;

    transactionList.appendChild(transactionElement);
  }

  static deleteTransaction(element) {
    if (element.classList.contains('delete')) {
      element.parentElement.remove();
    }
  }

  static updateSummary(transactions) {
    let totalExpenses = 0;
    let totalIncome = 0;
    let balance = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'expense') {
        balance -= parseFloat(transaction.amount);
        totalExpenses += parseFloat(transaction.amount);
      } else if (transaction.type === 'income') {
        balance += parseFloat(transaction.amount);
        totalIncome += parseFloat(transaction.amount);
      }
    });

    document.querySelector('#total-expenses').textContent = totalExpenses.toFixed(2);
    document.querySelector('#total-income').textContent = totalIncome.toFixed(2);
    document.querySelector('#balance').textContent = balance.toFixed(2);
  }

  static showAlert(message, className) {
    const alertElement = document.createElement('div');
    alertElement.className = `alert ${className}`;
    alertElement.appendChild(document.createTextNode(message));

    const container = document.querySelector('body');
    const form = document.querySelector('#transaction-form');
    container.insertBefore(alertElement, form);

    // Remove the alert after 3 seconds
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  static clearFields() {
    document.querySelector('#type').value = 'income';
    document.querySelector('#description').value = '';
    document.querySelector('#amount').value = '';
  }
}

// Store class
class Store {
  static getTransactions() {
    let transactions;
    if (localStorage.getItem('transactions') === null) {
      transactions = [];
    } else {
      transactions = JSON.parse(localStorage.getItem('transactions'));
    }
    return transactions;
  }

  static addTransaction(transaction) {
    const transactions = Store.getTransactions();
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  static removeTransaction(description) {
    const transactions = Store.getTransactions();
    transactions.forEach((transaction, index) => {
      if (transaction.description === description) {
        transactions.splice(index, 1);
      }
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }
}

// Event: Display transactions
document.addEventListener('DOMContentLoaded', () => {
  UI.displayTransactions();
});

// Event: Add a transaction
document.querySelector('#transaction-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const type = document.querySelector('#type').value;
  const description = document.querySelector('#description').value;
  const amount = document.querySelector('#amount').value;


  // Validate form fields
  if (description === '' || amount === '') {
    UI.showAlert('Please fill in all fields', 'error');
  } else {
    const transaction = new Transaction(type, description, amount);

    UI.addTransactionToList(transaction);
    Store.addTransaction(transaction);
    UI.updateSummary(Store.getTransactions());
    UI.showAlert('Transaction added', 'success');
    UI.clearFields();
  }
});

// Event: Remove a transaction
document.querySelector('#transaction-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    UI.deleteTransaction(e.target);
    const description = e.target.parentElement.querySelector('.description').textContent;
    Store.removeTransaction(description);
    UI.updateSummary(Store.getTransactions());
    UI.showAlert('Transaction removed', 'success');
  }
});

// Initial display of transactions
UI.displayTransactions();