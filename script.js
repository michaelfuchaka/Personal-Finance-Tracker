// Global variables and constants
const STORAGE_KEY = 'financeTrackerTransactions';
let transactions = [];

// Utility Function
function formatCurrency(amount){
    return new Intl.NumberFormat('en-US', {
        style:'currency',
        currency:'KES'
    }).format(Math.abs(amount));
}

function formatDate(dateString) {
     const date = new Date(datestring);
     return date.toLocaleDateString('en-US',{
        year: 'numeric',
        month:'short',
        day:'numeric'
     })  
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function showMessage(message, type='success') {
    // Remove any existing messages
    const existingMessage =  document.querySelector('.message');
    if(existingMessage){
        existingMessage.remove();
    }

    // create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ${type}';
    messageDiv.textContent =  message;

    // Insert message at the top of main content
const main = document.querySelector("main") || document.body;
main.insertBefore(messageDiv, main.firstchild);

// Auto remove message after 3 seconds
setTimeout(() => {
    messageDiv.remove();
}
, 3000);

}

// Data management Functions
function loadTransactions() {
    const stored = localStorage.getItem(STORAGE_KEY);
    transactions = stored ? JSON.parse(stored): [];
    return transactions
}

function saveTransactions(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function addTransaction(description, amount, date, category){
    const transaction = {
        id: generateId(),
        description:description.trim(),
        amount:  parseFloat(amount),
        date: date,
        category: category,
        timestamp:new Date().toISOString()
    };
    transactions.unshift(transaction);// Add to beginning for newest first
    saveTransactions();
    return transactions;

}

function deleteTransaction(id){
    const index =  transactions.findIndex(t =>t.id === id);
    if (index> -1){
        transactions.splice(index, 1);
        saveTransactions();
        return true;
    }
    return false;
    }

function detTransactionStats(){
    const income =  transactions
         .filter(t=> t.amount > 0)
         .reduce((sum, t)=> sum + t.amount, 0);
}
