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
     const date = new Date(dateString);
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
    messageDiv.className = `message ${type}`;
    messageDiv.textContent =  message;

    // Insert message at the top of main content
const main = document.querySelector("main") || document.body;
main.insertBefore(messageDiv, main.firstChild);


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
    return transaction;

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

function getTransactionStats(){
    const income =  transactions
         .filter(t=> t.amount > 0)
         .reduce((sum, t)=> sum + t.amount, 0);
          const expenses = Math.abs(transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0));
    
    const balance = income - expenses;

    return { income, expenses, balance };
}
// Form Validation
function validateTransactionForm(description, amount, date, category) {
    const errors = [];

    if (!description || description.trim().length === 0) {
        errors.push('Description is required');
    }

    if (!amount || amount === '0' || amount === 0) {
        errors.push('Amount must be non-zero');
    }

    if (!date) {
        errors.push('Date is required');
    }

    if (!category) {
        errors.push('Category is required');
    }

    // Check if date is not in the future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    if (selectedDate > today) {
        errors.push('Date cannot be in the future');
    }

    return errors;
}
// Page-specific Functions

// Add Transaction Page
function initializeAddPage() {
    const form = document.getElementById('transactionForm');
    if (!form) return;

    // Set today's date as default
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const date = document.getElementById('date').value;
        const category = document.getElementById('category').value;

        // Validate form
        const errors = validateTransactionForm(description, amount, date, category);
        
        if (errors.length > 0) {
            showMessage(errors.join('. '), 'error');
            return;
        }

        try {
            // Add transaction
            const transaction = addTransaction(description, parseFloat(amount), date, category);
            
            // Show success message
            const type = transaction.amount > 0 ? 'income' : 'expense';
            showMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} of ${formatCurrency(transaction.amount)} added successfully!`, 'success');
            
            // Reset form
            form.reset();
            dateInput.valueAsDate = new Date();
            
        } catch (error) {
            showMessage('Error adding transaction. Please try again.', 'error');
            console.error('Error adding transaction:', error);
        }
    });
}

// View Transactions Page
function initializeViewPage() {
    const transactionsList = document.getElementById('transactionsList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    if (!transactionsList) return;

    loadTransactions();

    function renderTransactions(transactionsToRender = transactions) {
        if (transactionsToRender.length === 0) {
            transactionsList.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: #7f8c8d;">
                        No transactions found. <a href="#add" style="color: #3498db;">Add your first transaction</a>
                    </td>
                </tr>
            `;
            return;
        }

        transactionsList.innerHTML = transactionsToRender.map(transaction => `
            <tr>
                <td>${transaction.description}</td>
                <td class="${transaction.amount > 0 ? 'amount-positive' : 'amount-negative'}">
                    ${transaction.amount > 0 ? '+' : ''}${formatCurrency(transaction.amount)}
                </td>
                <td>${formatDate(transaction.date)}</td>
                <td>${transaction.category}</td>
                <td>
                    <button class="btn-delete" onclick="handleDeleteTransaction('${transaction.id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function filterTransactions() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const categoryFilterValue = categoryFilter ? categoryFilter.value : '';

        const filtered = transactions.filter(transaction => {
            const matchesSearch = transaction.description.toLowerCase().includes(searchTerm) ||
                                transaction.category.toLowerCase().includes(searchTerm);
            
            const matchesCategory = !categoryFilterValue || transaction.category === categoryFilterValue;

            return matchesSearch && matchesCategory;
        });

        renderTransactions(filtered);
    }

    // Event listeners for search and filter
    if (searchInput) {
        searchInput.addEventListener('input', filterTransactions);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterTransactions);
    }

    // Initial render
    renderTransactions();

    // Make delete function globally available
    window.handleDeleteTransaction = function(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            if (deleteTransaction(id)) {
                showMessage('Transaction deleted successfully!', 'success');
                filterTransactions(); // Re-render with current filters
            } else {
                showMessage('Error deleting transaction.', 'error');
            }
        }
    };
}

// Summary Page
function initializeSummaryPage() {
    const totalIncomeEl = document.getElementById('totalIncome');
    const totalExpensesEl = document.getElementById('totalExpenses');
    const balanceEl = document.getElementById('balance');
    const noDataMessage = document.getElementById('noDataMessage');
    const expenseChart = document.getElementById('expenseChart');

    if (!totalIncomeEl) return;

    loadTransactions();
    const stats = getTransactionStats();

    // Update summary cards
    totalIncomeEl.textContent = formatCurrency(stats.income);
    totalExpensesEl.textContent = formatCurrency(stats.expenses);
    balanceEl.textContent = formatCurrency(stats.balance);

    // Update balance color based on positive/negative
    const balanceCard = balanceEl.closest('.summary-card');
    if (stats.balance > 0) {
        balanceCard.classList.add('income');
        balanceCard.classList.remove('expense');
    } else if (stats.balance < 0) {
        balanceCard.classList.add('expense');
        balanceCard.classList.remove('income');
    }

    // Simple chart or category breakdown
    if (transactions.length > 0) {
        noDataMessage.style.display = 'none';
        createExpenseBreakdown();
    } else {
        noDataMessage.style.display = 'block';
        if (expenseChart) {
            expenseChart.style.display = 'none';
        }
    }
}

function createExpenseBreakdown() {
    const expenseChart = document.getElementById('expenseChart');
    if (!expenseChart) return;

    // Get expense transactions only
    const expenses = transactions.filter(t => t.amount < 0);
    
    if (expenses.length === 0) {
        expenseChart.style.display = 'none';
        return;
    }

    // Group by category
    const categoryTotals = {};
    expenses.forEach(expense => {
        const category = expense.category;
        const amount = Math.abs(expense.amount);
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });

    // Create simple text-based breakdown
    const ctx = expenseChart.getContext('2d');
    const canvas = expenseChart;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Simple bar chart
    const categories = Object.keys(categoryTotals);
    const maxAmount = Math.max(...Object.values(categoryTotals));
    const barHeight = 30;
    const barSpacing = 10;
    const chartHeight = categories.length * (barHeight + barSpacing);
    
    canvas.height = Math.max(chartHeight, 200);
    
    ctx.font = '14px Arial';
    ctx.fillStyle = '#2c3e50';
    
    categories.forEach((category, index) => {
        const amount = categoryTotals[category];
        const barWidth = (amount / maxAmount) * (canvas.width * 0.6);
        const y = index * (barHeight + barSpacing) + 20;
        
        // Draw bar
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(10, y, barWidth, barHeight);
        
        // Draw category label
        ctx.fillStyle = '#2c3e50';
        ctx.fillText(category, barWidth + 20, y + 20);
        
        // Draw amount
        ctx.fillText(formatCurrency(amount), barWidth + 20, y + 35);
    });
}

// Home Page
function initializeHomePage() {
    // Add any home page specific functionality here
    loadTransactions();
    
    // Maybe show quick stats or recent transactions
    const stats = getTransactionStats();
    
    // You could add a quick summary to the home page
    console.log('Finance Tracker loaded with', transactions.length, 'transactions');
}
// SPA Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Handle navigation clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.nav-links a')) {
        e.preventDefault();
        const hash = e.target.getAttribute('href');
        showSection(hash);
        window.location.hash = hash;
        initializePage();
    }
});

// Handle hash changes
window.addEventListener('hashchange', function() {
    const hash = window.location.hash || '#home';
    showSection(hash);
    initializePage();
});

// Initialize based on current page
function initializePage() {
    const currentPage = window.location.hash || '#home';
    // Load transactions on every page
    loadTransactions();
    
    // Initialize page-specific functionality
    switch (currentPage) {
        case '#add':
            initializeAddPage();
            break;
        case '#view':
            initializeViewPage();
            break;
        case '#summary':
            initializeSummaryPage();
            break;
        case '#home':
        case '':
            initializeHomePage();
            break;
        default:
            console.log('Unknown page:', currentPage);
    }

    // Add active class to current nav link
    updateActiveNavLink(currentPage);
}

function updateActiveNavLink(currentPage) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
     if (href === currentPage || (currentPage === '#home' && href === '#home')) {
            link.classList.add('active');
        }
    });
}

// Export functionality (bonus feature)
function exportToCSV() {
    if (transactions.length === 0) {
        showMessage('No transactions to export', 'error');
        return;
    }

    const headers = ['Description', 'Amount', 'Date', 'Category', 'Type'];
    const csvData = transactions.map(t => [
        t.description,
        t.amount,
        t.date,
        t.category,
        t.amount > 0 ? 'Income' : 'Expense'
    ]);

    const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    showMessage('Transactions exported successfully!', 'success');
}

// Make export function available globally
window.exportToCSV = exportToCSV;

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showMessage('An unexpected error occurred. Please refresh the page.', 'error');
});
//Show initial section on page load
const initialHash = window.location.hash || "#home";
showSection(initialHash);

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}
