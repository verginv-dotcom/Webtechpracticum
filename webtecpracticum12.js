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


/* =====================================================
   BOOKING FORM - validation
   ===================================================== */

const bookingForm  = document.getElementById('booking-form');
const formFields   = bookingForm.querySelectorAll('input, select, textarea');
const formSummary  = document.getElementById('form-summary');
const formSuccess  = document.getElementById('form-success');
const submitBtn    = document.getElementById('submit-btn');
const bookAgainBtn = document.getElementById('book-again');
const serviceType  = document.getElementById('service-type');
const weightInput  = document.getElementById('weight');
const pickupDate   = document.getElementById('pickup-date');
const instructions = document.getElementById('instructions');
const charCount    = document.getElementById('char-count');

// Weight limits for specific services (industry rule)
const weightLimits = { 'Air Freight': 500, 'Express Parcel': 30 };

/* ---------- Pickup date: today up to 90 days ahead ---------- */
function toISODate(date) {
    return date.getFullYear() + '-' +
           String(date.getMonth() + 1).padStart(2, '0') + '-' +
           String(date.getDate()).padStart(2, '0');
}

const todayDate = new Date();
const lastDate  = new Date();
lastDate.setDate(todayDate.getDate() + 90);
pickupDate.setAttribute('min', toISODate(todayDate));
pickupDate.setAttribute('max', toISODate(lastDate));

/* ---------- Custom rules (checked with setCustomValidity) ---------- */
function getCustomError(field) {
    const label = field.getAttribute('data-label') || 'This field';

    if (field.value && field.minLength > 0 && field.value.length < field.minLength) {
        return label + ' must be at least ' + field.minLength + ' characters.';
    }

    if (field === weightInput && weightInput.value && serviceType.value) {
        const limit = weightLimits[serviceType.value];
        if (limit && Number(weightInput.value) > limit) {
            return serviceType.value + ' allows a maximum of ' + limit + ' kg.';
        }
    }

    return '';
}

/* ---------- Messages for built-in constraints ---------- */
function getBuiltInError(field) {
    const v = field.validity;
    const label = field.getAttribute('data-label') || 'This field';

    if (v.valueMissing) {
        if (field.type === 'checkbox') return 'Please accept the declaration to continue.';
        if (field.tagName === 'SELECT') return 'Please select a ' + label.toLowerCase() + '.';
        return label + ' is required.';
    }
    if (v.typeMismatch)    return 'Enter a valid email address (e.g. name@example.com).';
    if (v.patternMismatch) return field.getAttribute('data-pattern-msg') || 'Invalid format.';
    if (v.tooShort)        return label + ' must be at least ' + field.minLength + ' characters.';
    if (v.tooLong)         return label + ' must be at most ' + field.maxLength + ' characters.';
    if (v.badInput)        return 'Enter a valid value.';
    if (v.rangeUnderflow) {
        return field.type === 'date'
            ? 'Pickup date cannot be in the past.'
            : label + ' must be at least ' + field.min + '.';
    }
    if (v.rangeOverflow) {
        return field.type === 'date'
            ? 'Pickup must be within the next 90 days.'
            : label + ' cannot be more than ' + field.max + '.';
    }
    if (v.stepMismatch) return 'Enter a valid number (steps of ' + field.step + ').';

    return 'Please check this field.';
}

/* ---------- Show / clear the message under a field ---------- */
function showFieldError(field, message) {
    const wrapper = field.closest('.field');
    const errorEl = wrapper.querySelector('.error-msg');

    errorEl.textContent = message;
    wrapper.classList.toggle('has-error', message !== '');
    field.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
}

/* ---------- Validate one field; returns true when valid ---------- */
function validateField(field) {
    field.setCustomValidity('');                    // clear the old message

    const customError = getCustomError(field);
    if (customError) field.setCustomValidity(customError);

    let message = '';
    if (!field.checkValidity()) {
        message = field.validity.customError
            ? field.validationMessage
            : getBuiltInError(field);
        field.setCustomValidity(message);           // browser bubble uses our text
    }

    showFieldError(field, message);
    return message === '';
}

/* ---------- Live validation while the user types ---------- */
formFields.forEach(field => {
    field.addEventListener('blur', () => {
        field.classList.add('touched');
        validateField(field);
    });

    field.addEventListener('input', () => {
        if (field.classList.contains('touched')) validateField(field);
    });

    field.addEventListener('change', () => {
        field.classList.add('touched');
        validateField(field);
    });
});

// Weight depends on the chosen service
serviceType.addEventListener('change', () => {
    if (weightInput.classList.contains('touched')) validateField(weightInput);
});

// Character counter for the textarea
instructions.addEventListener('input', () => {
    charCount.textContent = instructions.value.length;
});

/* ---------- Submit ---------- */
bookingForm.addEventListener('submit', event => {
    event.preventDefault();                         // stay on the page

    let invalidCount = 0;
    let firstInvalid = null;

    formFields.forEach(field => {
        field.classList.add('touched');
        if (!validateField(field)) {
            invalidCount++;
            if (!firstInvalid) firstInvalid = field;
        }
    });

    if (!bookingForm.checkValidity()) {
        formSummary.textContent = 'Please fix ' + invalidCount +
            (invalidCount === 1 ? ' field' : ' fields') + ' before submitting.';
        formSummary.classList.remove('hidden');
        formSummary.classList.add('shake');
        setTimeout(() => formSummary.classList.remove('shake'), 400);

        firstInvalid.focus();
        firstInvalid.reportValidity();              // native bubble on first error
        showToast('Form has errors – please check the highlighted fields.', 'warning');
        return;
    }

    // Everything is valid
    formSummary.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    setTimeout(() => {
        showSuccess();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Booking';
    }, 1200);
});

/* ---------- Success message ---------- */
function showSuccess() {
    const bookingId = 'LG-' + Math.floor(100000 + Math.random() * 900000);
    const name = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();

    document.getElementById('success-text').textContent =
        'Thank you, ' + name + '! Your booking ID is ' + bookingId +
        '. A confirmation has been sent to ' + email + '.';

    const rows = [
        ['Service',     serviceType.value],
        ['Weight',      weightInput.value + ' kg'],
        ['Packages',    document.getElementById('packages').value],
        ['Pickup date', pickupDate.value],
        ['PIN code',    document.getElementById('pickup-pin').value],
        ['Destination', document.getElementById('destination').value.trim()]
    ];

    const list = document.getElementById('success-summary');
    list.innerHTML = '';
    rows.forEach(row => {
        const li = document.createElement('li');
        const key = document.createElement('span');
        const value = document.createElement('span');
        key.textContent = row[0];
        value.textContent = row[1];
        li.append(key, value);
        list.appendChild(li);
    });

    bookingForm.classList.add('hidden');
    formSuccess.classList.remove('hidden');
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Booking ' + bookingId + ' confirmed!', 'success');
}

/* ---------- Reset / book another ---------- */
function clearValidationState() {
    formFields.forEach(field => {
        field.setCustomValidity('');
        field.classList.remove('touched');
        showFieldError(field, '');
        field.removeAttribute('aria-invalid');
    });
    formSummary.classList.add('hidden');
    charCount.textContent = instructions.value.length;
}

// 'reset' fires before values are cleared, so wait one tick
bookingForm.addEventListener('reset', () => {
    setTimeout(clearValidationState, 0);
});

bookAgainBtn.addEventListener('click', () => {
    bookingForm.reset();
    formSuccess.classList.add('hidden');
    bookingForm.classList.remove('hidden');
    bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
});


/* =====================================================
   LIVE LOGISTICS DATA - fetch() from public APIs
   ===================================================== */

const loadingBox   = document.getElementById('api-loading');
const loadingText  = document.getElementById('loading-text');
const errorBox     = document.getElementById('api-error');
const errorMsg     = document.getElementById('api-error-msg');
const resultBox    = document.getElementById('api-result');
const statsBox     = document.getElementById('api-stats');
const apiTable     = document.getElementById('api-table');
const apiSource    = document.getElementById('api-source');
const apiUpdated   = document.getElementById('api-updated');
const apiButtons   = document.querySelectorAll('.api-controls button');

/* ---------- Data about the ports we monitor ---------- */
const ports = [
    { name: 'Mumbai (JNPT)',     country: 'India',       lat: 18.95, lon: 72.95 },
    { name: 'Chennai',           country: 'India',       lat: 13.08, lon: 80.29 },
    { name: 'Tuticorin',         country: 'India',       lat: 8.76,  lon: 78.13 },
    { name: 'Kochi',             country: 'India',       lat: 9.97,  lon: 76.27 },
    { name: 'Dubai (Jebel Ali)', country: 'UAE',         lat: 25.01, lon: 55.06 },
    { name: 'Singapore',         country: 'Singapore',   lat: 1.26,  lon: 103.82 },
    { name: 'Shanghai',          country: 'China',       lat: 31.23, lon: 121.47 },
    { name: 'Rotterdam',         country: 'Netherlands', lat: 51.95, lon: 4.14 }
];

const currencyNames = {
    INR: 'Indian Rupee', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen',
    CNY: 'Chinese Yuan', AED: 'UAE Dirham', SGD: 'Singapore Dollar', AUD: 'Australian Dollar'
};

/* ---------- Helpers that turn raw API values into readable text ---------- */
function describeWeather(code) {
    if (code === 0)                 return '☀️ Clear sky';
    if (code >= 1 && code <= 3)     return '⛅ Partly cloudy';
    if (code === 45 || code === 48) return '🌫️ Fog';
    if (code >= 51 && code <= 57)   return '🌦️ Drizzle';
    if (code >= 61 && code <= 67)   return '🌧️ Rain';
    if (code >= 71 && code <= 77)   return '❄️ Snow';
    if (code >= 80 && code <= 82)   return '🌧️ Rain showers';
    if (code >= 85 && code <= 86)   return '❄️ Snow showers';
    if (code >= 95)                 return '⛈️ Thunderstorm';
    return '☁️ Cloudy';
}

function getShipStatus(wind, code) {
    if (code >= 95 || wind >= 40) return { label: 'Delay Risk', level: 'bad' };
    if (wind >= 25 || code >= 61) return { label: 'Caution',    level: 'warn' };
    return { label: 'Clear', level: 'ok' };
}

/* ---------- Parsers: validate the JSON and shape it for the table ---------- */
function parseWeather(data) {
    const list = Array.isArray(data) ? data : [data];

    if (!list.length || !list[0] || !list[0].current) {
        throw new Error('The weather service returned unexpected data.');
    }

    const rows = list.slice(0, ports.length).map((entry, index) => {
        const current = entry.current;
        return {
            port:      ports[index].name,
            country:   ports[index].country,
            temp:      current.temperature_2m,
            humidity:  current.relative_humidity_2m,
            wind:      current.wind_speed_10m,
            condition: describeWeather(current.weather_code),
            status:    getShipStatus(current.wind_speed_10m, current.weather_code)
        };
    });

    const avgTemp = rows.reduce((sum, row) => sum + row.temp, 0) / rows.length;
    const windiest = rows.reduce((max, row) => (row.wind > max.wind ? row : max), rows[0]);
    const atRisk = rows.filter(row => row.status.level !== 'ok').length;

    return {
        stats: [
            { label: 'Ports monitored',  value: String(rows.length) },
            { label: 'Average temp',     value: avgTemp.toFixed(1) + ' °C' },
            { label: 'Windiest port',    value: windiest.port + ' (' + windiest.wind + ' km/h)' },
            { label: 'Ports needing care', value: String(atRisk) }
        ],
        columns: [
            { label: 'Port',          value: row => row.port },
            { label: 'Country',       value: row => row.country },
            { label: 'Temp (°C)',     value: row => row.temp.toFixed(1) },
            { label: 'Humidity',      value: row => row.humidity + '%' },
            { label: 'Wind (km/h)',   value: row => String(row.wind) },
            { label: 'Conditions',    value: row => row.condition },
            { label: 'Shipping',      value: row => row.status.label, badge: row => row.status.level }
        ],
        rows: rows
    };
}

function parseRates(data) {
    if (!data || typeof data.rates !== 'object' || data.rates === null) {
        throw new Error('The exchange-rate service returned unexpected data.');
    }

    const rows = Object.entries(data.rates).map(([code, rate]) => ({
        code: code,
        name: currencyNames[code] || code,
        rate: rate,
        inverse: 1 / rate
    }));

    if (!rows.length) throw new Error('No exchange rates were returned.');

    return {
        stats: [
            { label: 'Base currency', value: data.base },
            { label: 'Rate date',     value: data.date },
            { label: 'Currencies',    value: String(rows.length) },
            { label: 'USD → INR',     value: data.rates.INR ? data.rates.INR.toFixed(2) : '—' }
        ],
        columns: [
            { label: 'Code',                 value: row => row.code },
            { label: 'Currency',             value: row => row.name },
            { label: '1 ' + data.base + ' =', value: row => row.rate.toFixed(4) },
            { label: 'Value of 1 unit in ' + data.base, value: row => row.inverse.toFixed(4) }
        ],
        rows: rows
    };
}

/* ---------- The endpoints ---------- */
const lats = ports.map(port => port.lat).join(',');
const lons = ports.map(port => port.lon).join(',');

const API_CONFIG = {
    weather: {
        url: 'https://api.open-meteo.com/v1/forecast?latitude=' + lats + '&longitude=' + lons +
             '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
        source: 'Source: Open-Meteo API – live weather at major cargo ports',
        loading: 'Fetching live weather for major ports...',
        parse: parseWeather
    },
    rates: {
        url: 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR,EUR,GBP,JPY,CNY,AED,SGD,AUD',
        source: 'Source: Frankfurter API – exchange rates used in international trade',
        loading: 'Fetching latest currency rates...',
        parse: parseRates
    },
    // deliberately invalid request, used to demonstrate the error handling
    error: {
        url: 'https://api.open-meteo.com/v1/forecast?latitude=999&longitude=999&current=temperature_2m',
        source: 'Source: deliberately invalid request (error demo)',
        loading: 'Sending an invalid request...',
        parse: parseWeather
    }
};

let lastRealType = 'weather';

/* ---------- Show only one of: loading / error / result ---------- */
function showState(state) {
    loadingBox.classList.toggle('hidden', state !== 'loading');
    errorBox.classList.toggle('hidden', state !== 'error');
    resultBox.classList.toggle('hidden', state !== 'result');
}

function setButtonsDisabled(disabled) {
    apiButtons.forEach(button => { button.disabled = disabled; });
}

function highlightButton(type) {
    document.getElementById('load-weather').classList.toggle('active', type === 'weather');
    document.getElementById('load-rates').classList.toggle('active', type === 'rates');
}

function getFriendlyError(error) {
    if (error.name === 'AbortError') {
        return 'The request took too long (over 10 seconds). Please check your connection and try again.';
    }
    if (error instanceof TypeError) {
        return 'Network error – unable to reach the server. Please check your internet connection.';
    }
    if (error instanceof SyntaxError) {
        return 'The server sent data that could not be read.';
    }
    return error.message;
}

/* ---------- Build the cards and the table from the JSON ---------- */
function renderResult(result) {
    // summary cards
    statsBox.innerHTML = '';
    result.stats.forEach((stat, index) => {
        const card  = document.createElement('div');
        const label = document.createElement('span');
        const value = document.createElement('strong');

        card.classList.add('stat-card');
        card.style.animationDelay = (index * 80) + 'ms';
        label.classList.add('stat-label');
        value.classList.add('stat-value');
        label.textContent = stat.label;
        value.textContent = stat.value;

        card.appendChild(label);
        card.appendChild(value);
        statsBox.appendChild(card);
    });

    // table head
    const thead = apiTable.querySelector('thead');
    const tbody = apiTable.querySelector('tbody');
    thead.innerHTML = '';
    tbody.innerHTML = '';

    const headRow = document.createElement('tr');
    result.columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column.label;
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);

    // table body
    result.rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.style.animationDelay = (index * 70) + 'ms';

        result.columns.forEach(column => {
            const td = document.createElement('td');
            const text = column.value(row);

            if (column.badge) {
                const badge = document.createElement('span');
                badge.classList.add('status', column.badge(row));
                badge.textContent = text;
                td.appendChild(badge);
            } else {
                td.textContent = text;
            }
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    apiUpdated.textContent = 'Last updated: ' + new Date().toLocaleTimeString();
}

/* ---------- Main function: fetch -> parse -> render ---------- */
async function loadData(type) {
    const config = API_CONFIG[type];

    if (type !== 'error') {
        lastRealType = type;
        highlightButton(type);
    }

    apiSource.textContent = config.source;
    loadingText.textContent = config.loading;
    showState('loading');
    setButtonsDisabled(true);

    // give up after 10 seconds
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(config.url, { signal: controller.signal });

        if (!response.ok) {
            let detail = '';
            try {
                const body = await response.json();
                detail = body.reason || body.message || '';
            } catch (ignored) {
                // the error response had no JSON body
            }
            throw new Error('Server responded with status ' + response.status +
                            (detail ? ' – ' + detail : '.'));
        }

        const data = await response.json();
        renderResult(config.parse(data));
        showState('result');
    } catch (error) {
        console.error('API error:', error);
        errorMsg.textContent = getFriendlyError(error);
        showState('error');
    } finally {
        clearTimeout(timer);
        setButtonsDisabled(false);
    }
}

/* ---------- Buttons ---------- */
document.getElementById('load-weather').addEventListener('click', () => loadData('weather'));
document.getElementById('load-rates').addEventListener('click',   () => loadData('rates'));
document.getElementById('refresh-btn').addEventListener('click',  () => loadData(lastRealType));
document.getElementById('error-btn').addEventListener('click',    () => loadData('error'));
document.getElementById('retry-btn').addEventListener('click',    () => loadData(lastRealType));

// load the port weather as soon as the page opens
loadData('weather');