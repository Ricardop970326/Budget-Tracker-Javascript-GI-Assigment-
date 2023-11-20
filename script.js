// Using a class to apply the methods for the tracker
class TransactionManager {
  ////Creating the constructor
  constructor() {
    //Call the elements fron the HTML throught the getElementById
    this.list = document.getElementById("transactionList");
    this.form = document.getElementById("transactionForm");
    this.status = document.getElementById("status");
    this.balance = document.getElementById("balance");
    this.income = document.getElementById("income");
    this.expense = document.getElementById("expense");

    ///Linking the deleteTransaction method.
    this.deleteTransaction = this.deleteTransaction.bind(this);

    //start it with an empty array
    this.transactions = [];
    // parse a  JSON string and turn it into a javascript object   ////note: parse  is a process that analize strings // Using it in javascript means parsing(coverting) a JSON(javascript object notation) into javascript object
    //retive the data from local storage  to an empty array
    // this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    //event listener to the submit buttom
    this.form.addEventListener("submit", this.addTransaction.bind(this));

    //this  is creating the style or format for submited transaction
    this.formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      signDisplay: "always",
    });
  }

  /// method for updating the total balance
  updateTotal() {
    const incomeTotal = this.transactions
      .filter((trx) => trx.type === "income")
      .reduce((total, trx) => total + trx.amount, 0);
  
    const expenseTotal = this.transactions
      .filter((trx) => trx.type === "expense")
      .reduce((total, trx) => total + trx.amount, 0);

    // alter the html value display in the screen with the submited data
   const balanceTotal = incomeTotal - expenseTotal;

   // format toptal balance
   const formattedBalance = this.formatter.format(balanceTotal);

   this.balance.textContent = balanceTotal < 0 ? `-${formattedBalance.substring(1)}` : formattedBalance.substring(1);
   this.expense.textContent = this.formatter.format(expenseTotal * -1);
   this.income.textContent = this.formatter.format(incomeTotal);
 }

  //method for creating the list of transaction from the javascript to the HTML
  renderList() {
    // reset the HTML display values for the list and statues elements
    this.list.innerHTML = "";
    this.status.textContent = "";

    // display 0 is there is no values
    if (this.transactions.length === 0) {
      this.status.textContent = "No transactions.";
      return;
    }

    //Pass throught the elements of the array
    this.transactions.forEach(({ id, name, amount, date, type }) => {
      const sign = "income" === type ? 1 : -1;

      const li = document.createElement("li");

      // Creating the transaction list from the javascript
      li.innerHTML = `
        <div class="name">
          <h4>${name}</h4>
          <p>${new Date(date).toLocaleDateString()}</p>
        </div>

        <div class="amount ${type}">
          <span>${this.formatter.format(amount * sign)}</span>
        </div>
      
        <div class="action">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onclick="transactionManager.deleteTransaction(${id})">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
        </div>
      `;

      // Append the submited values to the list
      this.list.appendChild(li);
    });
  }

///Delete the transactions called base on the emlement with the ID
  deleteTransaction(id) {
    const index = this.transactions.findIndex((trx) => trx.id === id);
    this.transactions.splice(index, 1);

  
    this.updateTotal();//Update total value
    this.saveTransactions();//save transaction into local storage
    this.renderList();// render the list
  }

  //method for adding new transactions
  addTransaction(e) {
    e.preventDefault();

    //retive the data from the form
    const formData = new FormData(this.form);

      //Created a new object(li) and added to the list
    this.transactions.push({
      id: this.transactions.length + 1,
      name: formData.get("name"),
      amount: parseFloat(formData.get("amount")),
      date: new Date(formData.get("date")),
      type: "on" === formData.get("type") ? "income" : "expense",
    });

    this.form.reset();// Reset form

    this.updateTotal();
    this.saveTransactions();//Save transactions
    this.renderList();
  }

  //Save transactions in local storage for the JSON
  saveTransactions() {
    // Order elements by date 
    this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem("transactions", JSON.stringify(this.transactions));//Save the sorted array
  }

  // start the UI with the current transaction
  initialize() {
    this.renderList();
    this.updateTotal();
  }
}

// Instantiate the class and initialize
const transactionManager = new TransactionManager();
transactionManager.initialize();