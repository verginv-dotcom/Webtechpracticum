/* =====================================================
   Logistics Gallery - Interactive Animations
   ===================================================== */

const toastContainer = document.getElementById('toast-container');

/* ---------- 1. Notification (toast) ---------- */
function showToast(message, type = 'info') {
    const icons = { success: '✔', info: 'ℹ', warning: '⚠' };

    const toast = document.createElement('div');
    toast.classList.add('toast', type);

    const icon = document.createElement('span');
    icon.classList.add('icon');
    icon.textContent = icons[type] || icons.info;

    const text = document.createElement('span');
    text.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close');
    closeBtn.textContent = '×';
    closeBtn.setAttribute('aria-label', 'Close notification');

    toast.append(icon, text, closeBtn);
    toastContainer.appendChild(toast);

    // Slide out, then remove from the page
    function hideToast() {
        if (toast.classList.contains('hide')) return;
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 500);
    }

    closeBtn.addEventListener('click', hideToast);
    setTimeout(hideToast, 3500);   // auto close after 3.5 seconds
}

/* ---------- 2. Gallery cards: open / close details ---------- */
const detailButtons = document.querySelectorAll('.details-btn');

detailButtons.forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.gallery-item');
        const title = card.querySelector('h3').textContent;

        card.classList.toggle('open');

        if (card.classList.contains('open')) {
            button.textContent = 'Hide Details';
            showToast(title + ' details opened', 'info');
        } else {
            button.textContent = 'View Details';
        }
    });
});

/* ---------- 3. Services: collapsible sections ---------- */
const serviceHeaders = document.querySelectorAll('.service-header');

serviceHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const service = header.parentElement;
        const isOpen = service.classList.contains('open');

        // Close all other sections (accordion behaviour)
        document.querySelectorAll('.service.open').forEach(item => {
            item.classList.remove('open');
        });

        // Open the clicked one (unless it was already open)
        if (!isOpen) {
            service.classList.add('open');
        }
    });
});

/* ---------- 4. Shipment tracker: animated sequence ---------- */
const trackBtn = document.getElementById('track-btn');
const steps = document.querySelectorAll('.step');
const messages = [
    'Order placed successfully',
    'Your package has been packed',
    'Shipment has left the warehouse',
    'Out for delivery – arriving today',
    'Delivered! Thank you for choosing us'
];

trackBtn.addEventListener('click', () => {
    // Reset the tracker
    steps.forEach(step => step.classList.remove('active'));

    trackBtn.disabled = true;
    trackBtn.textContent = 'Tracking...';

    steps.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('active');
            const type = index === steps.length - 1 ? 'success' : 'info';
            showToast(messages[index], type);

            // Last step: re-enable the button
            if (index === steps.length - 1) {
                trackBtn.disabled = false;
                trackBtn.textContent = 'Track Again';
            }
        }, index * 1200);
    });
});

/* ---------- 5. Contact: enquiry button ---------- */
const enquiryBtn = document.getElementById('enquiry-btn');

enquiryBtn.addEventListener('click', () => {
    enquiryBtn.classList.remove('pulse');       // stop pulsing once clicked
    enquiryBtn.textContent = 'Sending...';
    enquiryBtn.disabled = true;

    setTimeout(() => {
        enquiryBtn.textContent = 'Enquiry Sent ✔';
        showToast('Thanks! Our team will contact you soon.', 'success');
    }, 1200);

    // Reset the button after a few seconds
    setTimeout(() => {
        enquiryBtn.textContent = 'Send Enquiry';
        enquiryBtn.disabled = false;
        enquiryBtn.classList.add('pulse');
    }, 4500);
});

/* ---------- 6. Welcome notification ---------- */
setTimeout(() => {
    showToast('Welcome! Click "View Details" on any card.', 'info');
}, 1800);