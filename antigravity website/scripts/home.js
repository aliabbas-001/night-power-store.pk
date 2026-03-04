/*
  Homepage logic for Night Power
  Renders trending products and other home-specific UI elements
*/

document.addEventListener('DOMContentLoaded', () => {
    renderTrendingProducts();
    renderBestDeals();
    initHeroAnimation();
    initNewsletter();
});

function renderTrendingProducts() {
    const grid = document.getElementById('featured-products-grid');
    if (!grid) return;

    const trending = products.filter(p => p.isTrending).slice(0, 12);

    if (trending.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-shopping-basket"></i>
                <p>New products are arriving soon! Check back later.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = trending.map(product => renderProductCard(product)).join('');
}

function renderBestDeals() {
    const grid = document.getElementById('best-deals-grid');
    if (!grid) return;

    const deals = products.filter(p => p.originalPrice > p.price).slice(0, 8);

    if (deals.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-tags"></i>
                <p>No active deals right now. Stay tuned!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = deals.map(product => renderProductCard(product)).join('');
}

function renderProductCard(product) {
    return `
        <div class="card product-card" style="padding: 0; overflow: hidden; position: relative; border: 1px solid var(--border-color); display: flex; flex-direction: column; background: var(--white);">
            <div class="product-image-container" style="position: relative; overflow: hidden; background: #f9f9f9;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 280px; object-fit: cover; transition: transform 0.5s ease;">
                <div class="product-badges" style="position: absolute; top: 15px; left: 15px; display: flex; flex-direction: column; gap: 5px;">
                    ${product.isNew ? '<span class="badge" style="background: var(--success); color: white;">New</span>' : ''}
                    ${product.discount ? `<span class="badge badge-sale">${product.discount}</span>` : (product.originalPrice > product.price ? '<span class="badge badge-sale">Sale</span>' : '')}
                </div>
                <button onclick="toggleWishlist(${product.id}, event)" class="wishlist-btn" style="position: absolute; top: 15px; right: 15px; background: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); transition: 0.3s; z-index: 10;">
                    <i class="far fa-heart" style="font-size: 1.1rem;"></i>
                </button>
                <div class="product-action-overlay" style="position: absolute; bottom: -60px; left: 0; width: 100%; padding: 10px; transition: 0.3s; display: flex; justify-content: center; z-index: 5;">
                    <button onclick="addToCart(${product.id})" class="btn btn-primary" style="width: 90%; border-radius: 50px; font-size: 0.85rem; padding: 10px 15px;">
                        <i class="fas fa-shopping-cart" style="margin-right: 8px;"></i> Quick Add
                    </button>
                </div>
            </div>
            <div class="product-info" style="padding: 20px; flex-grow: 1; display: flex; flex-direction: column;">
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">${product.category}</p>
                <h3 style="font-size: 1.1rem; margin-bottom: 15px; line-height: 1.4; height: 3rem; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                   <a href="product.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="flex align-center justify-between" style="margin-top: auto;">
                    <div class="price-container">
                        <span style="font-size: 1.25rem; font-weight: 800; color: var(--accent);">Rs. ${product.price.toLocaleString()}</span>
                        ${product.originalPrice > product.price ? `<span style="font-size: 0.9rem; color: #aaa; text-decoration: line-through; margin-left: 8px;">Rs. ${product.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                </div>
                <div class="rating" style="margin-top: 10px; font-size: 0.8rem; color: var(--warning);">
                    ${renderStars(product.rating)}
                    <span style="color: #666; margin-left: 5px;">(${product.reviews})</span>
                </div>
            </div>
        </div>
    `;
}

// Add CSS for product card hover
if (!document.getElementById('product-card-hover-style')) {
    const style = document.createElement('style');
    style.id = 'product-card-hover-style';
    style.textContent = `
            .product-card:hover .product-image-container img {
                transform: scale(1.1);
            }
            .product-card:hover .product-action-overlay {
                bottom: 15px;
            }
            .wishlist-btn:hover {
                background: var(--accent) !important;
                color: white !important;
            }
        `;
    document.head.appendChild(style);
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function initHeroAnimation() {
    // Simple entry animations for hero elements
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateX(-30px)';
        setTimeout(() => {
            hero.style.transition = 'all 1s ease';
            hero.style.opacity = '1';
            hero.style.transform = 'translateX(0)';
        }, 200);
    }
}

function toggleWishlist(id, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Find product
    const product = products.find(p => p.id === id);
    if (!product) return;

    let wishlist = JSON.parse(localStorage.getItem('nightpower_wishlist') || '[]');
    const isWished = wishlist.some(p => p.id === id);

    if (isWished) {
        wishlist = wishlist.filter(p => p.id !== id);
        showToast('Removed from wishlist!', 'success');
    } else {
        wishlist.push(product);
        showToast('Added to wishlist!', 'success');
    }

    localStorage.setItem('nightpower_wishlist', JSON.stringify(wishlist));

    // Toggle icon visually
    if (event && event.currentTarget) {
        const icon = event.currentTarget.querySelector('i');
        if (icon) {
            if (isWished) {
                icon.classList.add('far');
                icon.classList.remove('fas');
            } else {
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        }
    }
}

function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    const emailInput = document.getElementById('newsletter-email');
    const messageDiv = document.getElementById('newsletter-message');
    const errorDiv = document.getElementById('newsletter-error');

    form.addEventListener('submit', (e) => {
        // 1. Prevent page reload
        e.preventDefault();

        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Reset messages
        messageDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        emailInput.style.borderColor = 'transparent';

        // 3. Check if empty
        if (!email) {
            showError("Email address cannot be empty.");
            return;
        }

        // 2 & 4. Validate email format
        if (!emailRegex.test(email)) {
            showError("Please enter a valid email address.");
            return;
        }

        // Simulate API call and success
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Subscribing...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;

            // 4. Save email to localStorage
            let subscribers = JSON.parse(localStorage.getItem('nightpower_subscribers') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('nightpower_subscribers', JSON.stringify(subscribers));
            }

            // 5 & 6. Show success message
            messageDiv.textContent = 'Awesome! You have successfully subscribed to our newsletter.';
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';
            messageDiv.style.border = '1px solid #c3e6cb';

            // 9. Smooth success animation
            messageDiv.style.opacity = '0';
            messageDiv.style.display = 'block';

            // Force reflow
            void messageDiv.offsetWidth;

            messageDiv.style.opacity = '1';

            // Clear input
            emailInput.value = '';

            // Hide success message after 5 seconds
            setTimeout(() => {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 300);
            }, 5000);
        }, 1200);
    });

    function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
        emailInput.style.border = '2px solid #ff6b6b';
        emailInput.focus();
    }
}
