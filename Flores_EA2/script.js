// --- Wait for the DOM to be fully loaded before running scripts ---
document.addEventListener('DOMContentLoaded', () => {
    // Setup theme switcher logic
    setupThemeSwitcher();

    // Check which page we are on and run the appropriate functions
    if (document.getElementById('book-select')) {
        populateBookDropdown();
        setupAddToCartForm();
    }
    if (document.getElementById('cart-items-container')) {
        displayCartItems();
        setupBuyButton();
    }
});

// --- Data: List of available books ---
const books = [
    { id: 1, title: "The Midnight Library", author: "Matt Haig", price: 15.99 },
    { id: 2, title: "Project Hail Mary", author: "Andy Weir", price: 18.50 },
    { id: 3, title: "Klara and the Sun", author: "Kazuo Ishiguro", price: 16.75 },
    { id: 4, title: "Dune", author: "Frank Herbert", price: 12.25 },
    { id: 5, title: "The Four Winds", author: "Kristin Hannah", price: 14.00 }
];


// --- Theme Switcher Logic ---
function setupThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Apply the saved theme on page load
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    }

    // Add event listener for the toggle switch
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark'); // Save preference
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light'); // Save preference
        }
    });
}


// --- Functions for books.html ---

/**
 * Populates the dropdown menu on the book ordering page.
 */
function populateBookDropdown() {
    const select = document.getElementById('book-select');
    books.forEach(book => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = `${book.title} - $${book.price.toFixed(2)}`;
        select.appendChild(option);
    });
}

/**
 * Sets up the event listener for the 'Add to Cart' form.
 */
function setupAddToCartForm() {
    const form = document.getElementById('add-to-cart-form');
    form.addEventListener('submit', event => {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const bookId = document.getElementById('book-select').value;
        const quantity = parseInt(document.getElementById('quantity').value, 10);
        const feedbackMessage = document.getElementById('feedback-message');

        if (!bookId || quantity < 1) {
            feedbackMessage.textContent = 'Please select a book and a valid quantity.';
            return;
        }

        addToCart(parseInt(bookId, 10), quantity);
        
        feedbackMessage.textContent = `Added ${quantity} item(s) to your cart!`;
        setTimeout(() => { feedbackMessage.textContent = ''; }, 3000);
        
        form.reset();
    });
}

/**
 * Adds an item to the cart in sessionStorage.
 * @param {number} bookId - The ID of the book to add.
 * @param {number} quantity - The number of copies to add.
 */
function addToCart(bookId, quantity) {
    let cart = JSON.parse(sessionStorage.getItem('shoppingCart')) || [];
    const bookToAdd = books.find(book => book.id === bookId);
    const existingItemIndex = cart.findIndex(item => item.id === bookId);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ ...bookToAdd, quantity: quantity });
    }

    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
}


// --- Functions for cart.html ---

/**
 * Displays the items from sessionStorage on the cart page.
 */
function displayCartItems() {
    const cart = JSON.parse(sessionStorage.getItem('shoppingCart')) || [];
    const container = document.getElementById('cart-items-container');
    const totalPriceEl = document.getElementById('total-price');
    let totalPrice = 0;

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        totalPriceEl.textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <span><strong>${item.title}</strong> (x${item.quantity})</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        container.appendChild(cartItemDiv);
    });

    totalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;
}

/**
 * Sets up the event listener for the 'Buy Now' button.
 */
function setupBuyButton() {
    const buyButton = document.getElementById('buy-button');
    buyButton.addEventListener('click', () => {
        const cart = JSON.parse(sessionStorage.getItem('shoppingCart')) || [];
        const orderSummaryContainer = document.getElementById('order-summary');
        
        if (cart.length === 0) {
            alert('Your cart is empty. Add some books first!');
            return;
        }

        let summaryHTML = '<h3>Thank you for your order!</h3><p>You have purchased:</p><ul>';
        let totalPrice = 0;

        cart.forEach(item => {
            summaryHTML += `<li>${item.quantity} x ${item.title}</li>`;
            totalPrice += item.price * item.quantity;
        });

        summaryHTML += `</ul><p><strong>Total Price: $${totalPrice.toFixed(2)}</strong></p>`;
        
        document.getElementById('cart-items-container').classList.add('hidden');
        document.getElementById('cart-summary').classList.add('hidden');
        
        orderSummaryContainer.innerHTML = summaryHTML;
        orderSummaryContainer.classList.remove('hidden');

        sessionStorage.removeItem('shoppingCart');
    });
}