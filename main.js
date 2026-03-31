/* ═══════════════════════════════════════
   AdEarn — Main JavaScript
   Loader, Toasts, Scroll Reveal, Utils
   ═══════════════════════════════════════ */

// ── Wait for everything to load ──
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initScrollReveal();
});

/* ══════════════════════════════════════
   LOADER — Cinematic Entry
   Shows logo pulsing + progress bar
   Then fades out after 2.8 seconds
   ══════════════════════════════════════ */

function initLoader() {
  const loader = document.querySelector('.loader-screen');

  // If no loader on this page, skip
  if (!loader) return;

  // Prevent scrolling while loader is showing
  document.body.style.overflow = 'hidden';

  // After 2.8 seconds, hide loader and show page
  setTimeout(() => {
    loader.classList.add('hide');
    document.body.style.overflow = '';

    // After fade animation completes, remove from DOM
    setTimeout(() => {
      loader.remove();
    }, 600);
  }, 2800);
}

/* ══════════════════════════════════════
   SCROLL REVEAL
   Elements with class "reveal" will
   fade in + slide up when scrolled
   into view. Looks professional.
   ══════════════════════════════════════ */

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stop watching after revealed
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  reveals.forEach((el) => observer.observe(el));
}/* ══════════════════════════════════════
   TOAST NOTIFICATIONS
   Usage anywhere in code:
     showToast('You earned ₦2!', 'success')
     showToast('Error occurred', 'error')
     showToast('Check your input', 'warning')
   ══════════════════════════════════════ */

function showToast(message, type = 'success') {
  // Create container if it doesn't exist
  let container = document.querySelector(
    '.toast-container'
  );

  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Pick icon based on type
  const icons = {
    success: `<svg width="20" height="20" 
      viewBox="0 0 24 24" fill="none" 
      stroke="#00E676" stroke-width="2.5" 
      stroke-linecap="round" 
      stroke-linejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>`,
    error: `<svg width="20" height="20" 
      viewBox="0 0 24 24" fill="none" 
      stroke="#FF1744" stroke-width="2.5" 
      stroke-linecap="round" 
      stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>`,
    warning: `<svg width="20" height="20" 
      viewBox="0 0 24 24" fill="none" 
      stroke="#FFB300" stroke-width="2.5" 
      stroke-linecap="round" 
      stroke-linejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 
        001.71 3h16.94a2 2 0 001.71-3L13.71 
        3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" 
        y2="17"/>
    </svg>`
  };

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    ${icons[type] || icons.success}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Slide in after a tiny delay (allows CSS transition)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
  });

  // Auto remove after 3.5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}/* ══════════════════════════════════════
   UTILITY FUNCTIONS
   Reused across all pages
   ══════════════════════════════════════ */

// ── Format money with Naira sign ──
function formatMoney(amount) {
  return '₦' + Number(amount).toLocaleString(
    'en-NG',
    { minimumFractionDigits: 2 }
  );
}

// ── Count up animation for numbers ──
function countUp(element, target, duration) {
  if (!element) return;

  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(
      elapsed / duration, 1
    );

    // Ease out cubic for smooth deceleration
    const eased = 1 - Math.pow(
      1 - progress, 3
    );

    const current = Math.floor(
      start + (target - start) * eased
    );

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

// ── Copy text to clipboard ──
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  } else {
    // Fallback for older browsers
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('Copied to clipboard!', 'success');
  }
}

// ── Simple form validation helper ──
function validateField(input, rules) {
  const value = input.value.trim();
  let isValid = true;
  let errorMsg = '';

  if (rules.required && value === '') {
    isValid = false;
    errorMsg = 'This field is required';
  } else if (rules.minLength && 
    value.length < rules.minLength) {
    isValid = false;
    errorMsg = `Minimum ${rules.minLength} characters`;
  } else if (rules.email && 
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    isValid = false;
    errorMsg = 'Enter a valid email address';
  } else if (rules.phone && 
    !/^(\+234|0)[789]\d{9}$/.test(value)) {
    isValid = false;
    errorMsg = 'Enter a valid Nigerian phone number';
  }

  // Apply visual states
  if (!isValid) {
    input.classList.add('error');
    input.classList.remove('success');
    const errEl = input.parentElement
      .querySelector('.error-text');
    if (errEl) {
      errEl.textContent = errorMsg;
      errEl.style.display = 'block';
    }
  } else {
    input.classList.remove('error');
    input.classList.add('success');
    const errEl = input.parentElement
      .querySelector('.error-text');
    if (errEl) errEl.style.display = 'none';
  }

  return isValid;
}

// ── Debounce function ──
// Prevents a function from firing too often
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ── Check if user is logged in ──
function isLoggedIn() {
  return localStorage.getItem('adearn_user') !== null;
}

// ── Get current user data ──
function getCurrentUser() {
  const data = localStorage.getItem('adearn_user');
  return data ? JSON.parse(data) : null;
}

// ── Save user data ──
function saveUser(userData) {
  localStorage.setItem(
    'adearn_user',
    JSON.stringify(userData)
  );
}

// ── Logout ──
function logout() {
  localStorage.removeItem('adearn_user');
  localStorage.removeItem('adearn_pin');
  window.location.href = 'login.html';
}

// ── Redirect if not logged in ──
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

console.log(
  '%c AdEarn ',
  'background: #00C853; color: white; ' +
  'font-size: 20px; font-weight: bold; ' +
  'border-radius: 8px; padding: 8px 16px;'
);
console.log(
  '%cWatch Ads. Earn Real Cash. 💰',
  'color: #00C853; font-size: 14px;'
);
