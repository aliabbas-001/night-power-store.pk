/*
  Checkout page specific logic for Night Power (Firebase & EmailJS Version)
*/

document.addEventListener('DOMContentLoaded', () => {
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    renderCheckoutSummary();
    handleCheckoutSubmit();
});

function renderCheckoutSummary() {
    const itemsEl = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');

    if (!itemsEl) return;

    let subtotal = 0;

    itemsEl.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        return `
            <div class="flex align-center justify-between" style="padding: 10px 0; border-bottom: 1px dotted var(--border-color);">
                <div style="flex-grow: 1; padding-right: 15px;">
                    <p style="font-weight: 500; font-size: 0.9rem;">${item.name} <span style="color: var(--text-muted);">x ${item.quantity}</span></p>
                </div>
                <p style="font-weight: 700; font-size: 0.9rem;">Rs. ${(item.price * item.quantity).toLocaleString()}</p>
            </div>
        `;
    }).join('');

    subtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
    totalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
}

function handleCheckoutSubmit() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = firebase.auth().currentUser;

        // Show loading state
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
        btn.disabled = true;

        const firstName = document.getElementById('chk-first-name').value;
        const lastName = document.getElementById('chk-last-name').value;
        const address = document.getElementById('chk-address').value;
        const city = document.getElementById('chk-city').value;
        const phone = document.getElementById('chk-phone').value;
        const total = document.getElementById('checkout-total').textContent.replace('Rs. ', '').replace(/,/g, '');

        const orderData = {
            userId: user ? user.uid : 'guest',
            customerName: `${firstName} ${lastName}`,
            email: user ? user.email : 'guest@example.com',
            phone: phone,
            address: `${address}, ${city}`,
            items: cart,
            total: parseFloat(total),
            paymentMethod: 'COD',
            status: 'Processing',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            // 1. Save to Firestore
            const docRef = await firebase.firestore().collection('orders').add(orderData);

            // 2. Clear Cart
            localStorage.removeItem('nightpower_cart');

            // 3. Send Email Notification via EmailJS
            if (typeof emailjs !== 'undefined') {
                try {
                    // IMPORTANT: Client-side EmailJS requires the PUBLIC Key (JZCmia7fWg0RJUP62).
                    // NEVER expose your Private Key (FaYqoIpJ7nLaC0jYK5tpf) in frontend JavaScript code!
                    // Note: You must replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID with your actual EmailJS IDs for emails to send.
                    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
                        order_id: docRef.id,
                        customer_name: orderData.customerName,
                        customer_phone: orderData.phone,
                        order_total: orderData.total,
                        shipping_address: orderData.address
                    }, "JZCmia7fWg0RJUP62").catch(err => console.error("EmailJS sending error (handled):", err));
                } catch (emailErr) {
                    console.error("EmailJS configuration error:", emailErr);
                }
            }

            // 4. Show Thank You Toast
            if (typeof showToast === 'function') {
                showToast("Thank you! Your order has been placed successfully.", "success");
            }

            // Save order ID for confirmation page
            localStorage.setItem('nightpower_last_order', JSON.stringify({
                id: docRef.id,
                total: orderData.total,
                items: cart.length
            }));

            // Redirect
            window.location.href = 'confirmation.html';

        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order: " + error.message);
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}
