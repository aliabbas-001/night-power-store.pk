/*
  Cart page specific logic for Night Power
*/

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const itemsList = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const cartContainer = document.getElementById('cart-container');
    const emptyState = document.getElementById('empty-cart');

    if (!itemsList) return;

    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    cartContainer.style.display = 'grid';
    emptyState.style.display = 'none';

    let subtotal = 0;

    itemsList.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        return `
            <div class="card flex align-center" style="gap: 20px; padding: 15px; margin-bottom: 15px; border: 1px solid var(--border-color); animation: fadeIn 0.3s ease forwards;">
                <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 12px; border: 1px solid var(--border-color);">
                <div style="flex-grow: 1;">
                    <h4 style="margin-bottom: 5px; font-size: 1.1rem;"><a href="product.html?id=${item.id}" class="hover-accent">${item.name}</a></h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 10px;">Category: ${item.category}</p>
                    <p style="color: var(--accent); font-weight: 800; font-size: 1.1rem;">Rs. ${item.price.toLocaleString()}</p>
                </div>
                <div class="flex flex-direction-column align-end" style="gap: 15px;">
                    <div class="quantity-controls flex align-center" style="background: var(--bg-alt); border-radius: 50px; padding: 5px 15px; border: 1px solid var(--border-color);">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="icon-btn-sm" style="padding: 5px; color: var(--text-main);"><i class="fas fa-minus" style="font-size: 0.7rem;"></i></button>
                        <span style="margin: 0 15px; font-weight: 700; width: 20px; text-align: center;">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="icon-btn-sm" style="padding: 5px; color: var(--text-main);"><i class="fas fa-plus" style="font-size: 0.7rem;"></i></button>
                    </div>
                    <button onclick="removeFromCart(${item.id})" style="color: #bbb; display: flex; align-items: center; gap: 5px; font-size: 0.85rem; font-weight: 500;" class="hover-accent">
                        <i class="fas fa-trash-alt" style="font-size: 0.9rem;"></i> Remove
                    </button>
                </div>
            </div>
        `;
    }).join('');

    subtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
    totalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
}

// Add simple hover effect as CSS
if (!document.getElementById('cart-extra-styles')) {
    const style = document.createElement('style');
    style.id = 'cart-extra-styles';
    style.textContent = `
        .hover-accent:hover { color: var(--accent) !important; transition: 0.3s; }
        .icon-btn-sm:hover { color: var(--accent) !important; transform: scale(1.1); transition: 0.2s; }
    `;
    document.head.appendChild(style);
}
