/*
  Authentication and Session Management for Night Power (Firebase Version)
*/

// --- Session Handling ---

function getCurrentUser() {
    return firebase.auth().currentUser;
}

function isLoggedIn() {
    return firebase.auth().currentUser !== null;
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

// --- Header UI Update ---

function updateAuthHeader(user) {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Check if we already have an auth-specific section in nav
    let authNavSection = document.getElementById('auth-nav-section');
    if (authNavSection) authNavSection.remove();

    if (user) {
        // Logged in state
        const userSection = document.createElement('li');
        userSection.id = 'auth-nav-section';

        // Try to get name from displayName or email
        const displayName = user.displayName || user.email.split('@')[0];

        userSection.innerHTML = `
            <div class="user-dropdown" style="position: relative; display: inline-block;">
                <a href="dashboard.html" class="flex align-center gap: 8px" style="font-weight: 600; color: var(--accent);">
                    <i class="fas fa-user-circle"></i> Hi, ${displayName.split(' ')[0]}
                </a>
                <button onclick="logout()" style="margin-left: 15px; font-size: 0.8rem; color: var(--text-muted); cursor: pointer; background: none; border: none; font-family: inherit;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        `;
        navLinks.appendChild(userSection);
    } else {
        // Logged out state
        const guestSection = document.createElement('li');
        guestSection.id = 'auth-nav-section';
        guestSection.innerHTML = `
            <a href="login.html" class="btn btn-outline" style="padding: 6px 16px; font-size: 0.85rem;">Login / Signup</a>
        `;
        navLinks.appendChild(guestSection);
    }
}

// Initialize header and listen for changes
firebase.auth().onAuthStateChanged((user) => {
    updateAuthHeader(user);
});

// --- Validation Helpers ---

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showAuthError(form, message) {
    let errorDiv = form.querySelector('.auth-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.style.color = 'var(--error)';
        errorDiv.style.background = '#fff0f0';
        errorDiv.style.padding = '12px';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.marginBottom = '20px';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.border = '1px solid #ffcccc';
        errorDiv.style.wordWrap = 'break-word';
        errorDiv.style.overflowWrap = 'break-word';
        form.prepend(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
