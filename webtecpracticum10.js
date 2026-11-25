/* =====================================================
   Logistics Gallery - Dynamic DOM + AI Animations
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

    function hideToast() {
        if (toast.classList.contains('hide')) return;
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 500);
    }

    closeBtn.addEventListener('click', hideToast);
    setTimeout(hideToast, 3500);
}

/* ---------- 2. AI animation: floating neural-network nodes ---------- */
const aiBg = document.getElementById('ai-bg');

function createAiNodes(count) {
    for (let i = 0; i < count; i++) {
        const node = document.createElement('span');
        const size = 3 + Math.random() * 5;

        node.classList.add('node');
        node.style.width = size + 'px';
        node.style.height = size + 'px';
        node.style.left = Math.random() * 100 + '%';
        node.style.top = Math.random() * 100 + '%';
        node.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
        node.style.setProperty('--dy', (Math.random() * 60 - 30) + 'px');
        node.style.animationDuration = (3 + Math.random() * 4) + 's';
        node.style.animationDelay = (Math.random() * 3) + 's';

        aiBg.appendChild(node);
    }
}
createAiNodes(35);

/* ---------- 3. AI animation: typing tagline ---------- */
const typedEl = document.getElementById('typed');
const phrases = [
    'AI-Powered Route Optimization',
    'Smart Warehouse Automation',
    'Predictive Delivery Tracking'
];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
    const word = phrases[phraseIndex];
    typedEl.textContent = word.substring(0, charIndex);

    if (!deleting && charIndex < word.length) {
        charIndex++;
        setTimeout(typeLoop, 70);
    } else if (!deleting) {
        deleting = true;
        setTimeout(typeLoop, 1500);
    } else if (charIndex > 0) {
        charIndex--;
        setTimeout(typeLoop, 35);
    } else {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeLoop, 300);
    }
}
typeLoop();

/* ---------- 4. Data (the information we add / modify / remove) ---------- */
let items = [
    { id: 1, title: 'Cargo Shipping',       desc: 'International goods transportation through cargo ships.',
      details: 'Delivery time: 15–30 days. Best for bulk and heavy cargo.',  tag: 'Sea Freight',  icon: '🚢', hue: 210 },
    { id: 2, title: 'Warehouse Management', desc: 'Organized storage and management of products.',
      details: '24/7 monitoring, inventory tracking and climate-controlled zones.', tag: 'Storage', icon: '🏭', hue: 160 },
    { id: 3, title: 'Road Transportation',  desc: 'Safe and reliable transportation of goods by road.',
      details: 'Delivery time: 1–5 days. Best for door-to-door regional delivery.', tag: 'Road Freight', icon: '🚚', hue: 25 },
    { id: 4, title: 'Package Delivery',     desc: 'Fast and secure delivery of customer packages.',
      details: 'Same-day and next-day options with live tracking and OTP delivery.', tag: 'Express', icon: '📦', hue: 280 },
    { id: 5, title: 'Container Shipping',   desc: 'Efficient movement of goods using shipping containers.',
      details: '20ft and 40ft containers, sealed and tracked from port to port.', tag: 'FCL / LCL', icon: '🛳️', hue: 190 },
    { id: 6, title: 'Distribution Center',  desc: 'Managing and distributing products to different locations.',
      details: 'Sorting, packing and dispatching to multiple cities every day.', tag: 'Hub', icon: '🏢', hue: 340 }
];
let nextId = 7;
let editingId = null;

const icons = ['✈️', '🚁', '🤖', '🚛', '📡', '🧭', '🏗️', '📊'];

/* ---------- 5. DOM references ---------- */
const gallery      = document.getElementById('gallery-grid');
const manager      = document.getElementById('manager');
const titleInput   = document.getElementById('item-title');
const descInput    = document.getElementById('item-desc');
const detailsInput = document.getElementById('item-details');
const addBtn       = document.getElementById('add-btn');
const cancelBtn    = document.getElementById('cancel-btn');
const aiBtn        = document.getElementById('ai-btn');
const formMsg      = document.getElementById('form-msg');
const searchInput  = document.getElementById('search-input');
const itemCount    = document.getElementById('item-count');
const emptyMsg     = document.getElementById('empty-msg');

/* ---------- 6. DISPLAY: build a card with the DOM ---------- */
function createCard(item) {
    const card = document.createElement('div');
    card.classList.add('gallery-item');
    card.setAttribute('data-id', item.id);

    // fixed structure with innerHTML ...
    card.innerHTML = `
        <div class="ai-visual">
            <div class="scan"></div>
            <div class="ring ring-1"><span class="orbit-dot"></span></div>
            <div class="ring ring-2"><span class="orbit-dot"></span></div>
            <div class="ai-core"><span class="ai-icon"></span></div>
            <span class="ai-chip">AI</span>
        </div>
        <h3 class="card-title"></h3>
        <p class="card-desc"></p>
        <div class="card-actions">
            <button class="btn details-btn">View Details</button>
            <button class="btn btn-secondary edit-btn">Edit</button>
            <button class="btn btn-danger delete-btn">Delete</button>
        </div>
        <div class="card-details">
            <div class="card-details-inner">
                <span class="badge"></span>
                <p class="card-more"></p>
            </div>
        </div>`;

    // ... and user text through textContent (safe from HTML injection)
    card.querySelector('.card-title').textContent = item.title;
    card.querySelector('.card-desc').textContent  = item.desc;
    card.querySelector('.card-more').textContent  = item.details;
    card.querySelector('.badge').textContent      = item.tag;
    card.querySelector('.ai-icon').textContent    = item.icon;
    card.querySelector('.ai-visual').style.setProperty('--hue', item.hue);

    return card;
}

function findItem(id) {
    return items.find(item => item.id === id);
}

/* ---------- 7. Counter, search filter, empty message ---------- */
function applyFilter() {
    const term = searchInput.value.trim().toLowerCase();
    let visible = 0;

    gallery.querySelectorAll('.gallery-item').forEach(card => {
        const item = findItem(Number(card.getAttribute('data-id')));
        if (!item) return;                       // card is being removed

        const text = (item.title + ' ' + item.desc + ' ' + item.tag).toLowerCase();
        const match = text.includes(term);

        card.classList.toggle('hidden', !match);
        if (match) visible++;
    });

    itemCount.textContent = visible + ' of ' + items.length + ' items';
    emptyMsg.classList.toggle('hidden', visible > 0);
}

searchInput.addEventListener('input', applyFilter);

/* ---------- 8. ADD ---------- */
function addItem(title, desc, details) {
    const item = {
        id: nextId++,
        title: title,
        desc: desc,
        details: details || 'No extra details added.',
        tag: 'Custom',
        icon: icons[Math.floor(Math.random() * icons.length)],
        hue: Math.floor(Math.random() * 360)
    };

    items.push(item);

    const card = createCard(item);
    gallery.appendChild(card);
    applyFilter();

    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Added: ' + item.title, 'success');
}

/* ---------- 9. MODIFY ---------- */
function startEdit(id) {
    const item = findItem(id);
    if (!item) return;

    editingId = id;
    titleInput.value   = item.title;
    descInput.value    = item.desc;
    detailsInput.value = item.details;

    addBtn.textContent = 'Update Item';
    cancelBtn.classList.remove('hidden');

    gallery.querySelectorAll('.gallery-item').forEach(card => card.classList.remove('editing'));
    gallery.querySelector('[data-id="' + id + '"]').classList.add('editing');

    manager.scrollIntoView({ behavior: 'smooth', block: 'center' });
    titleInput.focus();
}

function updateItem(title, desc, details) {
    const item = findItem(editingId);
    const card = gallery.querySelector('[data-id="' + editingId + '"]');

    item.title   = title;
    item.desc    = desc;
    item.details = details || 'No extra details added.';

    card.querySelector('.card-title').textContent = item.title;
    card.querySelector('.card-desc').textContent  = item.desc;
    card.querySelector('.card-more').textContent  = item.details;

    card.classList.add('updated');
    setTimeout(() => card.classList.remove('updated'), 1200);

    applyFilter();
    showToast('Updated: ' + item.title, 'info');
    resetForm();
}

/* ---------- 10. REMOVE ---------- */
function deleteItem(id) {
    const item = findItem(id);
    const card = gallery.querySelector('[data-id="' + id + '"]');
    if (!item || !card) return;

    items = items.filter(entry => entry.id !== id);   // remove from data
    card.classList.add('removing');                    // play exit animation
    setTimeout(() => {
        card.remove();                                 // remove from the page
        applyFilter();
    }, 400);

    if (editingId === id) resetForm();
    applyFilter();
    showToast('Deleted: ' + item.title, 'warning');
}

/* ---------- 11. Form handling ---------- */
function resetForm() {
    editingId = null;
    titleInput.value = '';
    descInput.value = '';
    detailsInput.value = '';
    addBtn.textContent = 'Add Item';
    cancelBtn.classList.add('hidden');
    gallery.querySelectorAll('.gallery-item').forEach(card => card.classList.remove('editing'));
}

function showFormMessage(message) {
    formMsg.textContent = message;
    manager.classList.add('shake');
    setTimeout(() => manager.classList.remove('shake'), 400);
    setTimeout(() => { formMsg.textContent = ''; }, 3000);
}

function handleSubmit() {
    const title   = titleInput.value.trim();
    const desc    = descInput.value.trim();
    const details = detailsInput.value.trim();

    if (!title || !desc) {
        showFormMessage('Please enter a title and a short description.');
        return;
    }

    if (editingId !== null) {
        updateItem(title, desc, details);
    } else {
        addItem(title, desc, details);
        resetForm();
    }
}

addBtn.addEventListener('click', handleSubmit);
cancelBtn.addEventListener('click', () => {
    resetForm();
    showToast('Edit cancelled', 'info');
});

[titleInput, descInput, detailsInput].forEach(input => {
    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') handleSubmit();
    });
});

/* ---------- 12. Card buttons (one listener for all cards) ---------- */
gallery.addEventListener('click', event => {
    const card = event.target.closest('.gallery-item');
    if (!card) return;
    const id = Number(card.getAttribute('data-id'));

    if (event.target.closest('.details-btn')) {
        const button = event.target.closest('.details-btn');
        card.classList.toggle('open');
        button.textContent = card.classList.contains('open') ? 'Hide Details' : 'View Details';
    } else if (event.target.closest('.edit-btn')) {
        startEdit(id);
    } else if (event.target.closest('.delete-btn')) {
        deleteItem(id);
    }
});

/* ---------- 13. AI Suggest: typewriter fills the form ---------- */
const suggestions = [
    { title: 'AI Route Optimization', desc: 'Machine learning picks the fastest, cheapest delivery routes.',
      details: 'Cuts fuel use and delivery time using live traffic data.' },
    { title: 'Drone Delivery', desc: 'Autonomous drones for urgent last-mile deliveries.',
      details: 'Best for small parcels in hard-to-reach areas.' },
    { title: 'Demand Forecasting', desc: 'AI predicts stock needs before orders arrive.',
      details: 'Reduces overstocking and prevents stock-outs.' },
    { title: 'Smart Cold Chain', desc: 'Sensors and AI monitor temperature-sensitive cargo.',
      details: 'Real-time alerts protect food and medicines in transit.' },
    { title: 'Robotic Warehouse', desc: 'Autonomous robots pick, pack and move goods.',
      details: 'Faster order fulfilment with fewer errors.' }
];
let suggestionIndex = 0;

function typeInto(input, text, done) {
    input.value = '';
    let i = 0;
    (function step() {
        i++;
        input.value = text.slice(0, i);
        if (i < text.length) {
            setTimeout(step, 22);
        } else if (done) {
            done();
        }
    })();
}

aiBtn.addEventListener('click', () => {
    const idea = suggestions[suggestionIndex];
    suggestionIndex = (suggestionIndex + 1) % suggestions.length;

    aiBtn.disabled = true;
    aiBtn.innerHTML = 'AI is thinking<span class="ai-dots"></span>';

    setTimeout(() => {
        aiBtn.textContent = '✨ Generating...';
        typeInto(titleInput, idea.title, () =>
            typeInto(descInput, idea.desc, () =>
                typeInto(detailsInput, idea.details, () => {
                    aiBtn.disabled = false;
                    aiBtn.textContent = '✨ AI Suggest';
                    showToast('AI suggestion ready – click "' + addBtn.textContent + '"', 'success');
                })));
    }, 1200);
});

/* ---------- 14. Services: collapsible sections ---------- */
document.querySelectorAll('.service-header').forEach(header => {
    header.addEventListener('click', () => {
        const service = header.parentElement;
        const isOpen = service.classList.contains('open');

        document.querySelectorAll('.service.open').forEach(item => item.classList.remove('open'));
        if (!isOpen) service.classList.add('open');
    });
});

/* ---------- 15. Shipment tracker: animated sequence ---------- */
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
    steps.forEach(step => step.classList.remove('active'));
    trackBtn.disabled = true;
    trackBtn.textContent = 'Tracking...';

    steps.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('active');
            showToast(messages[index], index === steps.length - 1 ? 'success' : 'info');

            if (index === steps.length - 1) {
                trackBtn.disabled = false;
                trackBtn.textContent = 'Track Again';
            }
        }, index * 1200);
    });
});

/* ---------- 16. Contact: enquiry button ---------- */
const enquiryBtn = document.getElementById('enquiry-btn');

enquiryBtn.addEventListener('click', () => {
    enquiryBtn.classList.remove('pulse');
    enquiryBtn.textContent = 'Sending...';
    enquiryBtn.disabled = true;

    setTimeout(() => {
        enquiryBtn.textContent = 'Enquiry Sent ✔';
        showToast('Thanks! Our team will contact you soon.', 'success');
    }, 1200);

    setTimeout(() => {
        enquiryBtn.textContent = 'Send Enquiry';
        enquiryBtn.disabled = false;
        enquiryBtn.classList.add('pulse');
    }, 4500);
});

/* ---------- 17. Start-up ---------- */
items.forEach(item => gallery.appendChild(createCard(item)));
applyFilter();

setTimeout(() => {
    showToast('Welcome! Try "✨ AI Suggest", then add, edit or delete items.', 'info');
}, 1800);