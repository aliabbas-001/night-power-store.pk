/*
  Product Detail logic for Night Power
*/

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId || isNaN(productId)) {
        renderProductNotFound();
        return;
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
        renderProductNotFound();
        return;
    }

    renderProductDetail(product);
    renderRelatedProducts(product);

    // Initialize Review Section
    initReviews(productId);
});

function renderProductNotFound() {
    const container = document.getElementById('product-detail-content');
    if (!container) return;

    container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 100px 0; width: 100%;">
            <i class="fas fa-search" style="font-size: 4rem; color: var(--accent); margin-bottom: 30px; opacity: 0.2;"></i>
            <h2 style="font-size: 2.5rem; margin-bottom: 20px;">Product Not Found</h2>
            <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 40px; max-width: 500px; margin-left: auto; margin-right: auto;">
                The product you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <a href="shop.html" class="btn btn-primary">Browse All Products</a>
                <a href="index.html" class="btn btn-outline">Back to Home</a>
            </div>
        </div>
    `;

    // Hide sections that don't make sense
    const relatedSection = document.querySelector('section[style*="background: var(--bg-alt)"]');
    if (relatedSection) relatedSection.style.display = 'none';

    const reviewsSection = document.getElementById('reviews-list')?.closest('section');
    if (reviewsSection) reviewsSection.style.display = 'none';
}

function renderProductPlaceholder() {
    const container = document.getElementById('product-detail-content');
    if (!container) return;

    container.innerHTML = `
        <div class="product-gallery">
            <div class="main-image card shimmer placeholder-bg" style="width: 100%; aspect-ratio: 1/1; border-radius: 20px;"></div>
            <div class="thumbnail-grid" style="display: flex; gap: 15px; margin-top: 20px;">
                <div class="thumb card placeholder-bg" style="width: 80px; height: 80px;"></div>
                <div class="thumb card placeholder-bg" style="width: 80px; height: 80px;"></div>
            </div>
        </div>

        <div class="product-info-sidebar">
            <div class="placeholder-bg" style="width: 100px; height: 20px; margin-bottom: 10px;"></div>
            <div class="placeholder-bg" style="width: 80%; height: 40px; margin-bottom: 15px;"></div>
            <div class="placeholder-bg" style="width: 150px; height: 30px; margin-bottom: 25px;"></div>
            <div class="placeholder-bg" style="width: 100%; height: 100px; margin-bottom: 40px;"></div>
            <div class="placeholder-bg" style="width: 100%; height: 60px; border-radius: 50px; margin-bottom: 40px;"></div>
            <div class="placeholder-bg" style="width: 100%; height: 150px; border-radius: 12px;"></div>
        </div>
    `;
}

function renderProductDetail(product) {
    const container = document.getElementById('product-detail-content');
    if (!container) return;

    // Dynamic SEO Updates for Professional Experience
    document.title = `${product.name} | Night Power`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute("content", product.shortDescription || product.description.substring(0, 150) + '...');
    }

    container.innerHTML = `
        <div class="product-gallery">
            <div class="main-image card" style="padding: 10px; overflow: hidden; border-radius: 20px;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto; border-radius: 12px; transition: 0.3s;" id="main-product-img">
            </div>
            <div class="thumbnail-grid" style="display: flex; gap: 15px; margin-top: 20px;">
                <div class="thumb card active" style="width: 80px; height: 80px; padding: 5px; cursor: pointer; border: 2px solid var(--accent);">
                    <img src="${product.image}" alt="${product.name} Thumbnail" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;">
                </div>
                <!-- Additional thumbnails would go here -->
            </div>
        </div>

        <div class="product-info-sidebar">
            <p style="color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">${product.category}</p>
            <h1 style="font-size: 2.5rem; margin-bottom: 15px;">${product.name}</h1>
            
            <div class="flex align-center" style="gap: 15px; margin-bottom: 25px;">
                <div style="color: var(--warning);">
                    ${renderStars(product.rating)}
                </div>
                <span style="color: var(--text-muted); font-size: 0.9rem;">(${product.reviews} customer reviews)</span>
            </div>

            <div class="price-box" style="margin-bottom: 30px;">
                <span style="font-size: 2.5rem; font-weight: 800; color: var(--accent);">Rs. ${product.price.toLocaleString()}</span>
                ${product.originalPrice > product.price ? `
                    <span style="font-size: 1.25rem; color: #aaa; text-decoration: line-through; margin-left: 15px;">Rs. ${product.originalPrice.toLocaleString()}</span>
                    <span class="badge badge-sale" style="margin-left: 15px; padding: 5px 15px; font-size: 0.9rem;">${product.discount}</span>
                ` : ''}
            </div>

            <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 40px; line-height: 1.8;">
                ${product.description}
            </p>

            <div class="purchase-actions" style="display: flex; gap: 20px; align-items: center; margin-bottom: 40px; padding-bottom: 40px; border-bottom: 1px solid var(--border-color);">
                <div class="quantity-selector flex align-center" style="border: 2px solid var(--border-color); border-radius: 50px; padding: 10px 20px;">
                    <button onclick="changeQty(-1)" style="font-size: 1.2rem; padding: 0 10px;"><i class="fas fa-minus"></i></button>
                    <span id="product-qty" style="font-weight: 700; font-size: 1.2rem; margin: 0 20px;">1</span>
                    <button onclick="changeQty(1)" style="font-size: 1.2rem; padding: 0 10px;"><i class="fas fa-plus"></i></button>
                </div>
                <button onclick="addToCart(${product.id}, getSelectedQty())" class="btn btn-primary" style="flex-grow: 1; padding: 18px; border-radius: 50px;">
                    <i class="fas fa-shopping-bag" style="margin-right: 12px;"></i> Add to Cart
                </button>
                <button class="icon-btn" style="width: 55px; height: 55px; border: 2px solid var(--border-color); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="far fa-heart"></i>
                </button>
            </div>

            <div class="delivery-info card" style="background: var(--bg-alt); padding: 25px;">
                <div class="flex align-center" style="gap: 15px; margin-bottom: 15px;">
                    <i class="fas fa-truck" style="color: var(--accent); font-size: 1.2rem;"></i>
                    <p>Free Delivery Across Pakistan</p>
                </div>
                <div class="flex align-center" style="gap: 15px; margin-bottom: 15px;">
                    <i class="fas fa-hand-holding-dollar" style="color: var(--accent); font-size: 1.2rem;"></i>
                    <p>Cash on Delivery Available</p>
                </div>
                <div class="flex align-center" style="gap: 15px;">
                    <i class="fas fa-rotate-left" style="color: var(--accent); font-size: 1.2rem;"></i>
                    <p>7 Days Easy Return Policy</p>
                </div>
            </div>
        </div>
    `;
}

function renderRelatedProducts(currentProduct) {
    const grid = document.getElementById('related-products-grid');
    if (!grid) return;

    const related = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);

    grid.innerHTML = related.map(p => `
        <div class="card product-card" style="padding: 0; overflow: hidden; background: white;">
            <div style="position: relative; height: 200px;">
                <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; top: 10px; left: 10px;">
                   ${p.discount ? `<span class="badge badge-sale">${p.discount}</span>` : ''}
                </div>
            </div>
            <div style="padding: 15px;">
                <h4 style="margin-bottom: 10px; font-size: 0.9rem;"><a href="product.html?id=${p.id}">${p.name}</a></h4>
                <p style="color: var(--accent); font-weight: 700;">Rs. ${p.price.toLocaleString()}</p>
            </div>
        </div>
    `).join('');
}

// Helper functions for UI
let selectedQty = 1;

window.changeQty = function (val) {
    selectedQty += val;
    if (selectedQty < 1) selectedQty = 1;
    const el = document.getElementById('product-qty');
    if (el) el.textContent = selectedQty;
};

window.getSelectedQty = function () {
    return selectedQty;
};

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

// --- Customer Reviews Logic ---

let currentRating = 0;

function initReviews(productId) {
    const starInput = document.getElementById('star-rating-input');
    const ratingInput = document.getElementById('review-rating');
    const form = document.getElementById('review-form');
    const authMsg = document.getElementById('review-auth-msg');

    // 1. Handle Star Selection UI
    if (starInput) {
        const stars = starInput.querySelectorAll('i');
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                currentRating = parseInt(e.target.getAttribute('data-value'));
                ratingInput.value = currentRating;

                // Update UI visually
                stars.forEach((s, idx) => {
                    if (idx < currentRating) {
                        s.classList.remove('far', 'fa-star');
                        s.classList.add('fas', 'fa-star');
                        s.style.color = 'var(--warning)';
                    } else {
                        s.classList.remove('fas', 'fa-star');
                        s.classList.add('fas', 'fa-star'); // keeping solid but grey for modern look
                        s.style.color = '#ddd';
                    }
                });
            });
        });
    }

    // 2. Check Auth State for Form Visibility
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            form.style.display = 'block';
            authMsg.style.display = 'none';
        } else {
            form.style.display = 'none';
            authMsg.style.display = 'block';
        }
    });

    // 3. Handle Form Submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const user = firebase.auth().currentUser;
            if (!user) {
                if (typeof showToast === 'function') showToast("Please login to submit a review", "error");
                return;
            }

            if (currentRating === 0) {
                if (typeof showToast === 'function') showToast("Please select a star rating", "error");
                return;
            }

            const comment = document.getElementById('review-comment').value.trim();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = "Submitting...";
            btn.disabled = true;

            const reviewData = {
                productId: productId,
                userId: user.uid,
                userName: user.displayName || user.email.split('@')[0],
                rating: currentRating,
                comment: comment,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            try {
                await firebase.firestore().collection('reviews').add(reviewData);
                if (typeof showToast === 'function') showToast("Review submitted successfully!", "success");

                // Reset form
                form.reset();
                currentRating = 0;
                ratingInput.value = 0;
                if (starInput) {
                    starInput.querySelectorAll('i').forEach(s => s.style.color = '#ddd');
                }

                // Reload reviews
                loadReviews(productId);
            } catch (error) {
                console.error("Error adding review:", error);
                if (typeof showToast === 'function') showToast("Failed to submit review", "error");
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    // 4. Load Existing Reviews
    loadReviews(productId);
}

function loadReviews(productId) {
    const reviewsList = document.getElementById('reviews-list');
    const countDisplay = document.getElementById('review-count-display');
    if (!reviewsList) return;

    firebase.firestore().collection('reviews')
        .where('productId', '==', productId)
        .orderBy('createdAt', 'desc')
        .get()
        .then((snapshot) => {
            if (countDisplay) {
                countDisplay.textContent = snapshot.size;
            }

            if (snapshot.empty) {
                reviewsList.innerHTML = `
                    <div class="card" style="padding: 40px; text-align: center; background: var(--bg-alt); border-radius: 12px;">
                        <i class="far fa-comment-dots" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                        <p style="color: var(--text-muted); font-size: 1.1rem; margin: 0;">No reviews yet. Be the first to review!</p>
                    </div>
                `;
                return;
            }

            reviewsList.innerHTML = snapshot.docs.map(doc => {
                const review = doc.data();
                const dateStr = review.createdAt ? review.createdAt.toDate().toLocaleDateString() : 'Just now';

                return `
                    <div class="card" style="padding: 25px; border-radius: 12px; background: white; border-bottom: 1px solid var(--bg-alt);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <div style="width: 45px; height: 45px; background: var(--bg-alt); color: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem;">
                                    ${review.userName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 style="margin: 0; font-size: 1.1rem;">${review.userName}</h4>
                                    <span style="font-size: 0.85rem; color: var(--text-muted);">${dateStr}</span>
                                </div>
                            </div>
                            <div style="color: var(--warning); font-size: 0.9rem;">
                                ${renderStars(review.rating)}
                            </div>
                        </div>
                        <p style="color: #444; line-height: 1.6; margin: 0; font-size: 1rem;">
                            "${review.comment}"
                        </p>
                    </div>
                `;
            }).join('');
        })
        .catch(err => {
            console.error("Error fetching reviews:", err);
            reviewsList.innerHTML = `
                <div class="card" style="padding: 20px; text-align: center; background: #fff0f0; border: 1px solid #ffcccc; color: var(--error);">
                    <p style="margin: 0;">Failed to load reviews. Please try again later.</p>
                </div>
            `;
        });
}
