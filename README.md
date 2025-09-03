# Personal Finance Tracker

A simple, responsive web application for tracking personal income and expenses with data persistence using localStorage.

## Features

### Core Functionality
- **Add Transactions**: Record income (positive amounts) and expenses (negative amounts)
- **View Transactions**: Display all transactions in a sortable table with search and filter capabilities
- **Delete Transactions**: Remove individual transactions with confirmation
- **Summary Dashboard**: View total income, expenses, and balance with visual charts
- **Data Persistence**: All data saved to browser's localStorage

### User Experience
- **Single Page Application (SPA)**: Smooth navigation without page reloads
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Form Validation**: Prevents invalid data entry
- **Success/Error Messages**: Clear user feedback for all actions
- **Search & Filter**: Find transactions by description or category
- **Currency Formatting**: Professional display in KES (Kenyan Shillings)

### Bonus Features
- **CSV Export**: Download transaction data as spreadsheet
- **Visual Charts**: Canvas-based expense breakdown by category
- **Date Validation**: Prevents future-dated transactions
- **Color Coding**: Green for income, red for expenses

## Technologies Used

- **HTML5**: Semantic structure and form elements
- **CSS3**: Flexbox/Grid layouts, animations, responsive design
- **JavaScript (ES6+)**: DOM manipulation, localStorage, event handling
- **Canvas API**: Chart visualization
- **localStorage**: Client-side data persistence

## File Structure

```
finance-tracker/
├── index.html          # Main SPA file with all sections
├── css/
│   └── style.css      # Complete styling and responsive design
├── script.js          # All JavaScript functionality
└── README.md          # Project documentation
```

## Installation & Usage

1. **Clone or download** the project files
2. **Open `index.html`** in a modern web browser
3. **Start tracking** your finances immediately

No server setup or external dependencies required.

## How to Use

### Adding Transactions
1. Click "Add Transaction" in navigation
2. Fill out the form:
   - **Description**: What the transaction was for
   - **Amount**: Positive for income, negative for expenses
   - **Date**: When the transaction occurred
   - **Category**: Select from predefined categories
3. Click "Add Transaction" to save

### Viewing Transactions
1. Click "View Transactions" to see all records
2. Use the search bar to find specific transactions
3. Filter by category using the dropdown
4. Click "Delete" to remove unwanted transactions

### Summary Dashboard
1. Click "Summary" to view financial overview
2. See total income, expenses, and current balance
3. View expense breakdown chart (when data available)

### Data Export
- Call `exportToCSV()` function in browser console
- Downloads transactions as CSV file for Excel/Sheets

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Edge**: Full support

Requires modern browser with localStorage and Canvas support.

## Local Development

No build process required. Simply:

1. Edit files directly
2. Refresh browser to see changes
3. Use browser developer tools for debugging

## Data Storage

- All transaction data stored in browser's localStorage
- Data persists between browser sessions
- Data is unique per browser/device
- No backend or database required

## Customization

### Changing Currency
Edit `formatCurrency()` function in `script.js`:
```javascript
currency: 'KES'  // Change from 'KES' to desired currency
```

### Adding Categories  
Update the category options in both HTML and JavaScript files.

### Styling
Modify `css/style.css` to change colors, fonts, or layout.

## Known Limitations

- Data stored locally only (not synced across devices)
- No user authentication or multi-user support
- Limited to localStorage capacity (~10MB)
- No data backup functionality

## Future Enhancements

- Dark mode toggle
- Data export/import functionality
- Multiple account support
- Category customization
- Recurring transaction templates
- Advanced reporting and analytics

## Contributing

This is a personal portfolio project. Feel free to fork and modify for your own use.

## License

Open source - use freely for personal or educational purposes.

---

**Live Demo**: [ hosted URL here when deployed]
