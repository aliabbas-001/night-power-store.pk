/*
  Global scripts for Night Power
  Handles Cart, Wishlist, and common UI elements
*/

// Initialize state
let cart = JSON.parse(localStorage.getItem('nightpower_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('nightpower_wishlist')) || [];

// --- Cart Logic ---

function updateCartUI() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCounts.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });

    // Save to local storage
    localStorage.setItem('nightpower_cart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += parseInt(quantity);
    } else {
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push({
                ...product,
                quantity: parseInt(quantity)
            });
        }
    }

    updateCartUI();
    showToast('Product added successfully!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    // Trigger update if on cart page
    if (window.location.pathname.includes('cart.html')) {
        if (typeof renderCart === 'function') renderCart();
    }
}

function updateQuantity(productId, newQty) {
    if (newQty < 1) {
        removeFromCart(productId);
        return;
    }
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(newQty);
        updateCartUI();
        if (window.location.pathname.includes('cart.html')) {
            if (typeof renderCart === 'function') renderCart();
        }
    }
}

// --- Toast Notification ---

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} entering`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}" 
           style="color: ${type === 'success' ? 'var(--success)' : 'var(--error)'}"></i> 
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('entering');
        toast.classList.add('leaving');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// --- Theme Toggle logic ---

function initTheme() {
    const theme = localStorage.getItem('nightpower_theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nightpower_theme', newTheme);
    updateThemeIcon(newTheme);

    showToast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode enabled`, 'success');
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (!icon) return;

    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateCartUI();
    initCookieBanner();
    initBackButton();

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
});

// --- Smart Back Button ---
function initBackButton() {
    const path = window.location.pathname;
    const isHomePage = path.endsWith('index.html') || path === '/' || path.endsWith('/');
    if (isHomePage) return;

    // Find the primary container within the main element
    let mainContainer = document.querySelector('main .container') || document.querySelector('main');
    if (!mainContainer) return;

    const backBtn = document.createElement('button');
    backBtn.className = 'smart-back-btn';
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back';

    backBtn.addEventListener('click', () => {
        if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    });

    // We want the back button at the very top of the content container
    mainContainer.insertBefore(backBtn, mainContainer.firstChild);

    // Smooth fade-in animation
    setTimeout(() => {
        backBtn.classList.add('show');
    }, 100);
}

// --- Cookie Consent ---
function initCookieBanner() {
    if (localStorage.getItem('nightpower_cookie_consent')) return;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            We use cookies to improve your browsing experience, analyze traffic, and personalize content. By clicking Accept, you agree to our use of cookies.<a href="privacy.html">Privacy Policy</a>
        </div>
        <div class="cookie-buttons">
            <button class="btn-cookie btn-cookie-reject" id="btn-cookie-reject">Reject</button>
            <button class="btn-cookie btn-cookie-accept" id="btn-cookie-accept">Accept</button>
        </div>
    `;

    document.body.appendChild(banner);

    // Trigger animation
    setTimeout(() => {
        banner.classList.add('show');
    }, 300);

    const acceptBtn = document.getElementById('btn-cookie-accept');
    const rejectBtn = document.getElementById('btn-cookie-reject');

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('nightpower_cookie_consent', 'accepted');
            hideCookieBanner(banner);
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            localStorage.setItem('nightpower_cookie_consent', 'rejected');
            hideCookieBanner(banner);
        });
    }
}

function hideCookieBanner(banner) {
    banner.classList.remove('show');
    setTimeout(() => {
        if (banner.parentNode) {
            banner.parentNode.removeChild(banner);
        }
    }, 600);
}

