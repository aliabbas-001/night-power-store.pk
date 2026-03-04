/*
  Shop page logic for Night Power
  Handles filtering, sorting, and product grid rendering
*/

let currentCategory = 'all';
let currentSort = 'none';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    // Check for category in URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        currentCategory = categoryParam;
        // Highlight active category in sidebar
        document.querySelectorAll('.category-item').forEach(el => {
            if (el.dataset.category === currentCategory) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    renderShopGrid();

    // Event Listeners
    document.querySelectorAll('.category-item').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = el.dataset.category;

            document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
            el.classList.add('active');

            renderShopGrid();
        });
    });

    document.getElementById('price-sort').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderShopGrid();
    });

    const searchInput = document.getElementById('shop-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderShopGrid();
        });
    }
});

function renderShopGrid() {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;

    let filtered = products;

    // 1. Filter by category
    if (currentCategory !== 'all') {
        if (currentCategory === 'Trending Now') {
            filtered = filtered.filter(p => p.isTrending);
        } else {
            filtered = filtered.filter(p => p.category === currentCategory);
        }
    }

    // 2. Filter by search
    if (searchQuery) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchQuery) ||
            p.category.toLowerCase().includes(searchQuery)
        );
    }

    // 3. Sort
    if (currentSort === 'low-high') {
        filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (currentSort === 'high-low') {
        filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    // Update title
    const title = document.getElementById('shop-title');
    if (title) {
        title.textContent = currentCategory === 'all' ? 'Explore Our Collection' : currentCategory;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-search-minus"></i>
                <h3 style="margin-bottom: 15px;">No Products Found</h3>
                <p style="color: var(--text-muted);">We are currently updating our inventory. Please check back soon for our latest collection!</p>
                <a href="index.html" class="btn btn-outline" style="margin-top: 30px;">Return Home</a>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(product => `
        <div class="card product-card" style="padding: 0; overflow: hidden; position: relative; border: 1px solid var(--border-color); display: flex; flex-direction: column;">
            <div class="product-image-container" style="position: relative; overflow: hidden; background: #f9f9f9;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 260px; object-fit: cover; transition: transform 0.5s ease;">
                <div class="product-badges" style="position: absolute; top: 15px; left: 15px; display: flex; flex-direction: column; gap: 5px;">
                    ${product.isNew ? '<span class="badge" style="background: var(--success); color: white;">New</span>' : ''}
                    ${product.originalPrice > product.price ? '<span class="badge badge-sale">Sale</span>' : ''}
                </div>
                <button onclick="toggleWishlist(${product.id})" class="wishlist-btn" style="position: absolute; top: 15px; right: 15px; background: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); transition: 0.3s; z-index: 10;">
                    <i class="far fa-heart" style="font-size: 1rem;"></i>
                </button>
                <div class="product-action-overlay" style="position: absolute; bottom: -60px; left: 0; width: 100%; padding: 10px; transition: 0.3s; display: flex; justify-content: center; z-index: 10;">
                    <button onclick="addToCart(${product.id})" class="btn btn-primary" style="width: 90%; border-radius: 50px; font-size: 0.8rem; padding: 8px 15px;">
                        <i class="fas fa-shopping-cart" style="margin-right: 8px;"></i> Quick Add
                    </button>
                </div>
            </div>
            <div class="product-info" style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column;">
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 5px; text-transform: uppercase;">${product.category}</p>
                <h3 style="font-size: 1rem; margin-bottom: 12px; line-height: 1.4; height: 2.8rem; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                   <a href="product.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="flex align-center justify-between" style="margin-top: auto;">
                    <div class="price-container">
                        <span style="font-size: 1.1rem; font-weight: 800; color: var(--accent);">Rs. ${product.price.toLocaleString()}</span>
                        ${product.originalPrice > product.price ? `<span style="font-size: 0.8rem; color: #aaa; text-decoration: line-through; margin-left: 5px;">Rs. ${product.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Re-ensure styles for hover
    if (!document.getElementById('product-card-hover-style')) {
        const style = document.createElement('style');
        style.id = 'product-card-hover-style';
        style.textContent = `
            .product-card:hover .product-image-container img {
                transform: scale(1.05);
            }
            .product-card:hover .product-action-overlay {
                bottom: 10px;
            }
            .wishlist-btn:hover {
                background: var(--accent) !important;
                color: white !important;
            }
        `;
        document.head.appendChild(style);
    }
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
