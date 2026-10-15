/**
 * ==========================================================
 * SMART FOOD MARKET - JAVASCRIPT APPLICATION LOGIC
 * Single Page Application (SPA), Inventory Management,
 * Mascot Identity (Detective Apple) & Linguistic Integration
 * ==========================================================
 */

// ----------------------------------------------------------
// 1. LOCAL INVENTORY DATABASE (Exact Requested Quantities)
// ----------------------------------------------------------
const INVENTORY_DATA = [
    {
        id: 'apples',
        name: 'Apples',
        nounType: 'countable',
        isCountable: true,
        stock: 12,
        maxStock: 12,
        unit: 'units',
        step: 1,
        min: 1,
        price: 0.75, // $0.75 per apple
        icon: '🍎',
        category: 'Fruits',
        description: 'Crisp, sweet red apples harvested from local organic orchards.'
    },
    {
        id: 'eggs',
        name: 'Eggs',
        nounType: 'countable',
        isCountable: true,
        stock: 24,
        maxStock: 24,
        unit: 'units',
        step: 1,
        min: 1,
        price: 0.35, // $0.35 per egg
        icon: '🥚',
        category: 'Dairy & Poultry',
        description: 'Free-range grade A fresh farm eggs rich in protein.'
    },
    {
        id: 'bananas',
        name: 'Bananas',
        nounType: 'countable',
        isCountable: true,
        stock: 3,
        maxStock: 3,
        unit: 'units',
        step: 1,
        min: 1,
        price: 0.60, // $0.60 per banana
        icon: '🍌',
        category: 'Fruits',
        description: 'Ripe Cavendish bananas, sweet and potassium-rich.'
    },
    {
        id: 'milk',
        name: 'Milk',
        nounType: 'uncountable',
        isCountable: false,
        stock: 2,
        maxStock: 2,
        unit: 'liters',
        step: 1,
        min: 1,
        price: 1.80, // $1.80 per liter
        icon: '🥛',
        category: 'Dairy',
        description: 'Whole pasteurized dairy milk in eco-friendly glass bottles.'
    },
    {
        id: 'rice',
        name: 'Rice',
        nounType: 'uncountable',
        isCountable: false,
        stock: 5,
        maxStock: 5,
        unit: 'kilograms',
        step: 1,
        min: 1,
        price: 2.20, // $2.20 per kg
        icon: '🍚',
        category: 'Grains',
        description: 'Premium aromatic jasmine white rice for wholesome meals.'
    },
    {
        id: 'bread',
        name: 'Bread',
        nounType: 'uncountable',
        isCountable: false,
        stock: 0, // OUT OF STOCK
        maxStock: 0,
        unit: 'loaves',
        step: 1,
        min: 0,
        price: 2.50,
        icon: '🍞',
        category: 'Bakery',
        description: 'Artisanal sourdough bread made with natural wild yeast.'
    },
    {
        id: 'cookies',
        name: 'Cookies',
        nounType: 'countable',
        isCountable: true,
        stock: 18,
        maxStock: 18,
        unit: 'units',
        step: 1,
        min: 1,
        price: 0.50, // $0.50 per cookie
        icon: '🍪',
        category: 'Bakery & Sweets',
        description: 'Oven-baked chocolate chip cookies with golden crisp edges.'
    },
    {
        id: 'orange_juice',
        name: 'Orange juice',
        nounType: 'uncountable',
        isCountable: false,
        stock: 1,
        maxStock: 1,
        unit: 'liter',
        step: 1,
        min: 1,
        price: 3.20, // $3.20 per liter
        icon: '🍊',
        category: 'Beverages',
        description: '100% freshly squeezed Valencia oranges with no added sugar.'
    },
    {
        id: 'cheese',
        name: 'Cheese',
        nounType: 'uncountable',
        isCountable: false,
        stock: 200,
        maxStock: 200,
        unit: 'grams',
        step: 50,
        min: 50,
        price: 0.02, // $0.02 per gram ($2.00 per 100g)
        icon: '🧀',
        category: 'Dairy',
        description: 'Aged sharp cheddar cheese cut fresh from the wheel.'
    },
    {
        id: 'tomatoes',
        name: 'Tomatoes',
        nounType: 'countable',
        isCountable: true,
        stock: 4,
        maxStock: 4,
        unit: 'units',
        step: 1,
        min: 1,
        price: 0.85, // $0.85 per tomato
        icon: '🍅',
        category: 'Vegetables',
        description: 'Plump vine-ripened red tomatoes bursting with natural flavor.'
    }
];

// ----------------------------------------------------------
// 2. STATE MANAGEMENT (Cart, Current View, Active Filter, User)
// ----------------------------------------------------------
const state = {
    inventory: JSON.parse(JSON.stringify(INVENTORY_DATA)),
    cart: [], // Array of { id, quantity, selectedUnit, subtotal }
    currentSection: 'welcome',
    activeFilter: 'all',
    selectedQuantityProductId: 'apples',
    currentPickerQty: 1,
    currentUser: null // Logged-in user information
};

// Number to Word Dictionary for Natural English Chat Responses
const NUMBER_WORDS = {
    0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
    6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
    11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen',
    15: 'fifteen', 16: 'sixteen', 17: 'seventeen', 18: 'eighteen',
    19: 'nineteen', 20: 'twenty', 24: 'twenty-four', 50: 'fifty',
    100: 'one hundred', 200: 'two hundred'
};

function formatNumberToWords(num) {
    if (NUMBER_WORDS[num]) return NUMBER_WORDS[num];
    return num.toString();
}

// ----------------------------------------------------------
// 3. SPA ROUTING & NAVIGATION
// ----------------------------------------------------------
function navigateTo(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.spa-section');
    sections.forEach(sec => sec.classList.remove('active'));

    // Highlight active section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        state.currentSection = sectionId;
    }

    // Update active nav button
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        if (btn.dataset.section === sectionId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Re-render relevant view logic
    if (sectionId === 'catalog') {
        renderCatalog();
    } else if (sectionId === 'availability') {
        renderAvailability();
    } else if (sectionId === 'quantity') {
        renderQuantitySection();
    } else if (sectionId === 'summary') {
        renderCart();
    } else if (sectionId === 'welcome') {
        renderWelcomeSnapshot();
    }

    // Scroll smoothly to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------
// 4. AUTHENTICATION HANDLERS (Login & Register)
// ----------------------------------------------------------
function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const remember = document.getElementById('rememberMe').checked;

    const username = email.split('@')[0] || 'Foodie';
    state.currentUser = { email, username };

    showToast(`Welcome back, ${username}! Detective Apple has synced your pantry.`, 'success');

    // Switch to Welcome or Catalog
    setTimeout(() => {
        navigateTo('welcome');
    }, 400);
}

function handleRegisterSubmit(event) {
    event.preventDefault();
    const fullName = document.getElementById('regFullName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        showToast('Passwords do not match. Please verify.', 'danger');
        return;
    }

    state.currentUser = { email, username: fullName };
    showToast(`Account created for ${fullName}! Detective Apple welcomes you to Smart Food Market.`, 'success');

    setTimeout(() => {
        navigateTo('catalog');
    }, 450);
}

// ----------------------------------------------------------
// 5. RENDERING SECTION 1: WELCOME SCREEN SNAPSHOT
// ----------------------------------------------------------
function renderWelcomeSnapshot() {
    const grid = document.getElementById('quickSnapshotGrid');
    if (!grid) return;

    grid.innerHTML = state.inventory.map(item => {
        let statusBadge = '';
        if (item.stock === 0) {
            statusBadge = '<span class="stock-pill out-of-stock">Sold Out</span>';
        } else if (item.stock <= 4 && item.isCountable) {
            statusBadge = '<span class="stock-pill low-stock">Low Stock</span>';
        } else if (item.stock <= 2 && !item.isCountable) {
            statusBadge = '<span class="stock-pill low-stock">Low Stock</span>';
        } else {
            statusBadge = '<span class="stock-pill in-stock">In Stock</span>';
        }

        return `
            <div class="snapshot-item" onclick="openQuantityForProduct('${item.id}')" style="cursor: pointer;" title="Configure ${item.name}">
                <div class="snapshot-icon">${item.icon}</div>
                <div class="snapshot-info">
                    <h5>${item.name}</h5>
                    <div class="snapshot-stock">${item.stock} ${item.unit} • ${statusBadge}</div>
                </div>
            </div>
        `;
    }).join('');
}

// ----------------------------------------------------------
// 6. RENDERING SECTION 2: CATALOG
// ----------------------------------------------------------
function filterCatalog(filterType, buttonEl) {
    state.activeFilter = filterType;

    // Update button styles
    if (buttonEl) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        buttonEl.classList.add('active');
    }

    renderCatalog();
}

function renderCatalog() {
    const catalogGrid = document.getElementById('catalogGrid');
    if (!catalogGrid) return;

    let filtered = state.inventory;
    if (state.activeFilter === 'countable') {
        filtered = state.inventory.filter(item => item.isCountable);
    } else if (state.activeFilter === 'uncountable') {
        filtered = state.inventory.filter(item => !item.isCountable);
    } else if (state.activeFilter === 'in-stock') {
        filtered = state.inventory.filter(item => item.stock > 0);
    }

    if (filtered.length === 0) {
        catalogGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--slate-500);">
                <p>No products found under this filter.</p>
            </div>
        `;
        return;
    }

    catalogGrid.innerHTML = filtered.map(item => {
        const isSoldOut = item.stock === 0;
        const nounClass = item.isCountable ? 'countable' : 'uncountable';
        const nounLabel = item.isCountable ? 'Countable Noun' : 'Uncountable Noun';
        
        // Grammar prompt hint
        const grammarHint = item.isCountable 
            ? `How many ${item.name.toLowerCase()} do you need?`
            : `How much ${item.name.toLowerCase()} do you need?`;

        let stockStatusPill = '';
        if (isSoldOut) {
            stockStatusPill = `<span class="stock-pill out-of-stock">Out of Stock (0 ${item.unit})</span>`;
        } else if ((item.isCountable && item.stock <= 4) || (!item.isCountable && item.stock <= 2)) {
            stockStatusPill = `<span class="stock-pill low-stock">Low Stock (${item.stock} ${item.unit} left)</span>`;
        } else {
            stockStatusPill = `<span class="stock-pill in-stock">In Stock (${item.stock} ${item.unit})</span>`;
        }

        return `
            <div class="product-card ${isSoldOut ? 'sold-out' : ''}">
                <div>
                    <div class="product-badge-top">
                        <span class="noun-type-badge ${nounClass}">${nounLabel}</span>
                        ${stockStatusPill}
                    </div>

                    <div class="product-visual">
                        <span class="product-emoji">${item.icon}</span>
                    </div>

                    <h3 class="product-title">${item.name}</h3>
                    <p class="product-grammar-hint">💡 "${grammarHint}"</p>
                    <p style="font-size: 0.85rem; color: var(--slate-600); margin-bottom: 0.75rem;">${item.description}</p>
                </div>

                <div>
                    <div class="product-stock-line">
                        <span class="product-price">$${item.price.toFixed(2)} <span class="product-unit-text">/ ${item.isCountable ? 'item' : item.unit}</span></span>
                        <span style="font-size: 0.8rem; color: var(--slate-500);">${item.category}</span>
                    </div>

                    <div class="card-actions">
                        ${isSoldOut ? `
                            <button class="btn btn-secondary btn-block" disabled>
                                🚫 Sold Out (Check Soon)
                            </button>
                        ` : `
                            <button class="btn btn-primary btn-block" onclick="openQuantityForProduct('${item.id}')">
                                ⚖️ Select Quantity
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ----------------------------------------------------------
// 7. RENDERING SECTION 3: AVAILABILITY & STOCK MONITOR
// ----------------------------------------------------------
function renderAvailability() {
    const tableBody = document.getElementById('availabilityTableBody');
    const chipsContainer = document.getElementById('statusSummaryChips');
    if (!tableBody) return;

    let totalInStock = 0;
    let totalLowStock = 0;
    let totalSoldOut = 0;

    tableBody.innerHTML = state.inventory.map(item => {
        let statusPill = '';
        let meterFillClass = 'high';
        let stockPercentage = 0;

        if (item.stock === 0) {
            totalSoldOut++;
            statusPill = '<span class="stock-pill out-of-stock">Depleted / 0</span>';
            meterFillClass = 'zero';
            stockPercentage = 0;
        } else if ((item.isCountable && item.stock <= 4) || (!item.isCountable && item.stock <= 2)) {
            totalLowStock++;
            statusPill = '<span class="stock-pill low-stock">Running Low</span>';
            meterFillClass = 'low';
            stockPercentage = Math.round((item.stock / (item.maxStock || 10)) * 100);
        } else {
            totalInStock++;
            statusPill = '<span class="stock-pill in-stock">Available</span>';
            meterFillClass = 'high';
            stockPercentage = Math.round((item.stock / (item.maxStock || 10)) * 100);
        }

        const isSoldOut = item.stock === 0;

        return `
            <tr>
                <td>
                    <div class="prod-cell">
                        <span class="prod-cell-icon">${item.icon}</span>
                        <div>
                            <div>${item.name}</div>
                            <small style="color: var(--slate-500); font-weight: normal;">${item.category}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="noun-type-badge ${item.isCountable ? 'countable' : 'uncountable'}">
                        ${item.isCountable ? 'Countable' : 'Uncountable'}
                    </span>
                </td>
                <td>
                    <strong style="color: var(--slate-700);">${item.unit}</strong>
                </td>
                <td>
                    <div class="stock-meter-wrap">
                        <strong>${item.stock}</strong>
                        <div class="stock-meter-bar" title="${stockPercentage}% remaining">
                            <div class="stock-meter-fill ${meterFillClass}" style="width: ${Math.min(stockPercentage, 100)}%;"></div>
                        </div>
                    </div>
                </td>
                <td>
                    ${statusPill}
                </td>
                <td>
                    ${isSoldOut ? `
                        <button class="btn btn-secondary btn-sm" disabled>Out of Stock</button>
                    ` : `
                        <button class="btn btn-outline btn-sm" onclick="openQuantityForProduct('${item.id}')">
                            Order Now
                        </button>
                    `}
                </td>
            </tr>
        `;
    }).join('');

    // Update top statistics chips
    if (chipsContainer) {
        chipsContainer.innerHTML = `
            <div class="summary-chip" style="color: var(--primary-800); border-color: var(--primary-300);">
                <span>🟢</span> <strong>${totalInStock} Items Available</strong>
            </div>
            <div class="summary-chip" style="color: var(--warning-600); border-color: var(--warning-200);">
                <span>🟡</span> <strong>${totalLowStock} Low in Stock</strong>
            </div>
            <div class="summary-chip" style="color: var(--danger-600); border-color: var(--danger-200);">
                <span>🔴</span> <strong>${totalSoldOut} Depleted</strong>
            </div>
        `;
    }
}

// ----------------------------------------------------------
// 8. RENDERING SECTION 4: QUANTITY SELECTION CONTROLS
// ----------------------------------------------------------
function openQuantityForProduct(productId) {
    state.selectedQuantityProductId = productId;
    navigateTo('quantity');
    loadProductIntoQuantityView(productId);
}

function loadProductIntoQuantityView(productId) {
    state.selectedQuantityProductId = productId;
    const item = state.inventory.find(i => i.id === productId);
    if (!item) return;

    if (item.stock > 0) {
        state.currentPickerQty = item.min || item.step || 1;
    } else {
        state.currentPickerQty = 0;
    }

    renderQuantitySection();
}

function adjustPickerQuantity(delta) {
    const item = state.inventory.find(i => i.id === state.selectedQuantityProductId);
    if (!item || item.stock === 0) return;

    const step = item.step || 1;
    let newQty = state.currentPickerQty + (delta * step);

    if (newQty < (item.min || step)) {
        newQty = item.min || step;
    }
    if (newQty > item.stock) {
        newQty = item.stock;
        showToast(`Maximum available stock reached (${item.stock} ${item.unit}).`, 'warning');
    }

    state.currentPickerQty = newQty;
    renderQuantitySection();
}

function renderQuantitySection() {
    const pickerSelect = document.getElementById('quantityProductSelect');
    const quantityCard = document.getElementById('quantityCard');
    if (!quantityCard) return;

    if (pickerSelect) {
        pickerSelect.innerHTML = state.inventory.map(i => `
            <option value="${i.id}" ${i.id === state.selectedQuantityProductId ? 'selected' : ''}>
                ${i.icon} ${i.name} (${i.isCountable ? 'Countable' : 'Uncountable'} - ${i.stock} ${i.unit} in stock)
            </option>
        `).join('');
    }

    const item = state.inventory.find(i => i.id === state.selectedQuantityProductId);
    if (!item) return;

    const isSoldOut = item.stock === 0;

    // GRAMMAR INTEGRATION: Dynamically choose between "How many...?" and "How much...?"
    const grammaticalQuestion = item.isCountable
        ? `How many ${item.name.toLowerCase()} would you like to buy?`
        : `How much ${item.name.toLowerCase()} do you need for your recipe?`;

    const grammarExplanation = item.isCountable
        ? `"${item.name}" is a <strong>countable noun</strong>. In English, we ask <em>"How many...?"</em> and count individual separate units (e.g., 1 apple, 2 eggs, 3 cookies).`
        : `"${item.name}" is an <strong>uncountable noun</strong>. In English, we ask <em>"How much...?"</em> and specify volume, mass, or portions using units like <em>liters, grams, or kilograms</em>.`;

    const subtotal = (state.currentPickerQty * item.price).toFixed(2);

    quantityCard.innerHTML = `
        <div class="qty-header">
            <div class="qty-icon-big">${item.icon}</div>
            <div>
                <!-- MANDATORY GRAMMAR STRUCTURE -->
                <h3 class="qty-grammar-heading">${grammaticalQuestion}</h3>
                <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.35rem;">
                    <span class="noun-type-badge ${item.isCountable ? 'countable' : 'uncountable'}">
                        ${item.isCountable ? 'Countable Noun' : 'Uncountable Noun'}
                    </span>
                    <span style="font-size: 0.85rem; color: var(--slate-600);">
                        Current Stock: <strong>${item.stock} ${item.unit}</strong>
                    </span>
                </div>
            </div>
        </div>

        ${isSoldOut ? `
            <div class="alert-box alert-danger" style="margin-bottom: 1.5rem;">
                <span class="alert-icon">🚫</span>
                <div>
                    <strong>Product Unavailable:</strong> Sorry, we don't have any ${item.name.toLowerCase()} left in our store today! 
                    Please explore other fresh foods in our catalog.
                </div>
            </div>
        ` : `
            <div class="qty-controls-box">
                <p style="font-size: 0.95rem; color: var(--slate-700); font-weight: 600;">
                    Adjust Amount (${item.unit.toUpperCase()}):
                </p>

                <div class="stepper-wrap">
                    <button class="btn-step" onclick="adjustPickerQuantity(-1)" ${state.currentPickerQty <= (item.min || item.step) ? 'disabled' : ''}>
                        −
                    </button>
                    
                    <div class="qty-display-box">
                        <span class="qty-display-number">${state.currentPickerQty}</span>
                        <span class="qty-display-unit">${item.unit}</span>
                    </div>

                    <button class="btn-step" onclick="adjustPickerQuantity(1)" ${state.currentPickerQty >= item.stock ? 'disabled' : ''}>
                        +
                    </button>
                </div>

                <p class="qty-explanation">${grammarExplanation}</p>
            </div>

            <div class="qty-footer-summary">
                <div>
                    <span style="color: var(--slate-500); font-size: 0.85rem; display: block;">Calculated Subtotal:</span>
                    <span class="qty-subtotal-price">$${subtotal}</span>
                    <small style="color: var(--slate-500);"> ($${item.price.toFixed(2)} per ${item.isCountable ? 'unit' : item.unit})</small>
                </div>

                <div style="display: flex; gap: 0.75rem;">
                    <button class="btn btn-outline" onclick="navigateTo('catalog')">
                        Back to Catalog
                    </button>
                    <button class="btn btn-primary btn-lg" onclick="addPickerItemToCart('${item.id}')">
                        🛒 Add to Order Summary
                    </button>
                </div>
            </div>
        `}
    `;
}

function addPickerItemToCart(productId) {
    const item = state.inventory.find(i => i.id === productId);
    if (!item) return;

    if (item.stock === 0) {
        showToast(`Sorry, we don't have any ${item.name.toLowerCase()} in stock!`, 'danger');
        return;
    }

    const qtyToAdd = state.currentPickerQty;
    const existingIndex = state.cart.findIndex(c => c.id === productId);

    if (existingIndex > -1) {
        const totalDesired = state.cart[existingIndex].quantity + qtyToAdd;
        if (totalDesired > item.stock) {
            state.cart[existingIndex].quantity = item.stock;
            showToast(`Adjusted to maximum available stock: ${item.stock} ${item.unit}.`, 'warning');
        } else {
            state.cart[existingIndex].quantity = totalDesired;
            showToast(`Updated ${item.name} quantity to ${state.cart[existingIndex].quantity} ${item.unit}!`, 'success');
        }
    } else {
        state.cart.push({
            id: item.id,
            name: item.name,
            icon: item.icon,
            nounType: item.nounType,
            isCountable: item.isCountable,
            unit: item.unit,
            price: item.price,
            step: item.step || 1,
            quantity: qtyToAdd
        });
        showToast(`Added ${qtyToAdd} ${item.unit} of ${item.name} to your basket!`, 'success');
    }

    updateCartBadge();
    navigateTo('summary');
}

// ----------------------------------------------------------
// 9. RENDERING SECTION 5: ORDER SUMMARY & CART
// ----------------------------------------------------------
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const totalCount = state.cart.reduce((sum, item) => sum + (item.isCountable ? item.quantity : 1), 0);
    badge.textContent = totalCount;
}

function modifyCartItemQuantity(productId, delta) {
    const cartItem = state.cart.find(c => c.id === productId);
    const invItem = state.inventory.find(i => i.id === productId);
    if (!cartItem || !invItem) return;

    const step = cartItem.step || 1;
    const newQty = cartItem.quantity + (delta * step);

    if (newQty <= 0) {
        removeCartItem(productId);
        return;
    }

    if (newQty > invItem.stock) {
        showToast(`Cannot add more. Warehouse only has ${invItem.stock} ${invItem.unit}.`, 'warning');
        return;
    }

    cartItem.quantity = newQty;
    renderCart();
    updateCartBadge();
}

function removeCartItem(productId) {
    const item = state.cart.find(c => c.id === productId);
    state.cart = state.cart.filter(c => c.id !== productId);
    if (item) {
        showToast(`Removed ${item.name} from basket.`, 'info');
    }
    renderCart();
    updateCartBadge();
}

function clearCart() {
    if (state.cart.length === 0) return;
    state.cart = [];
    showToast('Your cart has been emptied.', 'info');
    renderCart();
    updateCartBadge();
}

function renderCart() {
    const listContainer = document.getElementById('cartItemsList');
    const subtotalEl = document.getElementById('summarySubtotal');
    const totalEl = document.getElementById('summaryTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!listContainer) return;

    if (state.cart.length === 0) {
        listContainer.innerHTML = `
            <div class="cart-empty-placeholder">
                <div class="cart-empty-icon">🧺</div>
                <h4>Your shopping basket is currently empty</h4>
                <p style="margin: 0.5rem 0 1.25rem;">You have not selected any grocery items yet.</p>
                <button class="btn btn-primary" onclick="navigateTo('catalog')">
                    Browse Fresh Catalog
                </button>
            </div>
        `;
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        if (totalEl) totalEl.textContent = '$0.00';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    let subtotal = 0;

    listContainer.innerHTML = state.cart.map(item => {
        const itemTotal = item.quantity * item.price;
        subtotal += itemTotal;

        return `
            <div class="cart-item-row">
                <div class="cart-item-left">
                    <span class="cart-item-icon">${item.icon}</span>
                    <div>
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-sub">
                            ${item.isCountable ? 'Countable unit' : 'Uncountable staple'} • $${item.price.toFixed(2)} / ${item.isCountable ? 'unit' : item.unit}
                        </div>
                    </div>
                </div>

                <div class="cart-item-right">
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                        <button class="btn-step" style="width: 30px; height: 30px; font-size: 1rem;" onclick="modifyCartItemQuantity('${item.id}', -1)">−</button>
                        <span style="font-weight: 700; min-width: 55px; text-align: center;">${item.quantity} ${item.unit}</span>
                        <button class="btn-step" style="width: 30px; height: 30px; font-size: 1rem;" onclick="modifyCartItemQuantity('${item.id}', 1)">+</button>
                    </div>

                    <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>

                    <button class="btn-remove-item" onclick="removeCartItem('${item.id}')" title="Remove item">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }).join('');

    const ecoPackingFee = 1.50;
    const finalTotal = subtotal + ecoPackingFee;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${finalTotal.toFixed(2)}`;
}

function processOrderCheckout() {
    if (state.cart.length === 0) {
        showToast('Your basket is empty. Please add groceries first!', 'warning');
        return;
    }

    // Deduct stock in real-time from inventory
    state.cart.forEach(cartItem => {
        const inv = state.inventory.find(i => i.id === cartItem.id);
        if (inv) {
            inv.stock = Math.max(0, inv.stock - cartItem.quantity);
        }
    });

    const modal = document.getElementById('orderModal');
    const modalBody = document.getElementById('orderModalBody');
    const bagSelect = document.getElementById('bagCountSelect');
    const selectedBags = bagSelect ? bagSelect.value : 2;

    const subtotal = state.cart.reduce((sum, i) => sum + (i.quantity * i.price), 0);
    const total = subtotal + 1.50;
    const orderId = 'SFM-' + Math.floor(100000 + Math.random() * 900000);

    modalBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <p style="font-size: 1.1rem; color: var(--primary-800); font-weight: 700;">
                Thank you for choosing Smart Food Market!
            </p>
            <p style="font-size: 0.9rem; color: var(--slate-600);">
                Order Reference: <strong>${orderId}</strong> • Estimated Delivery: <strong>35 minutes</strong>
            </p>
        </div>

        <div style="background-color: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem;">
            <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--slate-800);">Summary of Dispatched Goods:</h4>
            <ul style="list-style: none; font-size: 0.85rem; color: var(--slate-700);">
                ${state.cart.map(c => `
                    <li style="display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px dashed var(--slate-200);">
                        <span>${c.icon} ${c.quantity} ${c.unit} of ${c.name}</span>
                        <strong>$${(c.quantity * c.price).toFixed(2)}</strong>
                    </li>
                `).join('')}
            </ul>
            <div style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--slate-600);">
                Packed in: <strong>${selectedBags} compostable bags</strong> • Total Paid: <strong>$${total.toFixed(2)}</strong>
            </div>
        </div>

        <div class="alert-box alert-info" style="font-size: 0.85rem;">
            <img src="image.png" alt="Detective" style="width: 24px; height: 24px; border-radius: 50%;">
            <span>Detective Apple has updated the stock in real-time. Zero food waste guaranteed!</span>
        </div>
    `;

    // Empty cart and update badge
    state.cart = [];
    updateCartBadge();

    // Open modal
    if (modal) modal.classList.add('open');
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) modal.classList.remove('open');
    navigateTo('welcome');
}

// ----------------------------------------------------------
// 10. REQUERIMIENTO 2: SIMULATED CUSTOMER CHAT MODULE (CON MASCOTA)
// ----------------------------------------------------------
function toggleChatWidget() {
    const chat = document.getElementById('chatWidget');
    if (!chat) return;
    chat.classList.toggle('open');
    if (chat.classList.contains('open')) {
        renderChatQuickButtons();
        scrollChatToBottom();
    }
}

function openChatAndGreet() {
    const chat = document.getElementById('chatWidget');
    if (!chat) return;
    if (!chat.classList.contains('open')) {
        chat.classList.add('open');
    }
    renderChatQuickButtons();
    scrollChatToBottom();
}

function renderChatQuickButtons() {
    const container = document.getElementById('chatQuickButtons');
    if (!container) return;

    const queries = [
        { label: '🍎 Apples', query: 'apples' },
        { label: '🍞 Bread', query: 'bread' },
        { label: '🥛 Milk', query: 'milk' },
        { label: '🍌 Bananas', query: 'bananas' },
        { label: '🥚 Eggs', query: 'eggs' },
        { label: '🍚 Rice', query: 'rice' },
        { label: '🧀 Cheese', query: 'cheese' },
        { label: '🍪 Cookies', query: 'cookies' },
        { label: '🍊 Orange Juice', query: 'orange juice' },
        { label: '🍅 Tomatoes', query: 'tomatoes' }
    ];

    container.innerHTML = queries.map(q => `
        <button class="btn-quick-inquiry" onclick="handlePredefinedChatInquiry('${q.query}')">
            ${q.label}
        </button>
    `).join('');
}

function handlePredefinedChatInquiry(productKey) {
    const item = state.inventory.find(i => i.id === productKey || i.name.toLowerCase() === productKey.toLowerCase());
    if (!item) return;

    const customerQuestion = item.isCountable
        ? `How many ${item.name.toLowerCase()} do you have in stock?`
        : `How much ${item.name.toLowerCase()} do you have right now?`;

    appendChatMessage('user', customerQuestion);

    // Simulate detective thinking delay
    setTimeout(() => {
        const botResponse = generateDynamicBotAnswer(item);
        appendChatMessage('bot', botResponse);
    }, 450);
}

function generateDynamicBotAnswer(item) {
    // 1. Stock is 0 (Bread)
    // EXACT PATTERN: "Sorry, we don't have any bread today"
    if (item.stock === 0) {
        return `Sorry, we don't have any ${item.name.toLowerCase()} today. Our next fresh delivery arrives tomorrow morning!`;
    }

    // 2. Countable items (Apples: 12, Eggs: 24, Bananas: 3, Cookies: 18, Tomatoes: 4)
    if (item.isCountable) {
        if (item.stock <= 4) {
            return `We only have a few ${item.name.toLowerCase()} left in stock (${item.stock} ${item.unit}). Grab yours before they run out!`;
        }
        // Plentiful countable: Number in words, e.g. "We have twelve apples"
        const numberInWords = formatNumberToWords(item.stock);
        return `We have ${numberInWords} ${item.name.toLowerCase()} ready in our inventory! How many would you like to order?`;
    }

    // 3. Uncountable items (Milk: 2L, Rice: 5kg, Cheese: 200g, Orange juice: 1L)
    if (!item.isCountable) {
        // EXACT PATTERN: "We have a little milk"
        if (item.stock <= 2 && (item.unit === 'liters' || item.unit === 'liter')) {
            return `We have a little ${item.name.toLowerCase()} (${item.stock} ${item.unit} available in the fridge).`;
        }
        if (item.id === 'cheese') {
            return `We have a little cheese remaining (${item.stock} grams cut fresh from our cheddar block).`;
        }
        if (item.id === 'rice') {
            return `We have a lot of rice in our pantry (${item.stock} kilograms available)! How much do you need for your cooking?`;
        }
        return `We currently have ${item.stock} ${item.unit} of fresh ${item.name.toLowerCase()} in storage.`;
    }
}

function sendCustomChatMessage() {
    const input = document.getElementById('chatCustomInput');
    if (!input || !input.value.trim()) return;

    const query = input.value.trim();
    appendChatMessage('user', query);
    input.value = '';

    setTimeout(() => {
        const lower = query.toLowerCase();
        const matchedItem = state.inventory.find(i => 
            lower.includes(i.id) || 
            lower.includes(i.name.toLowerCase()) ||
            (i.id === 'orange_juice' && (lower.includes('orange') || lower.includes('juice')))
        );

        if (matchedItem) {
            const answer = generateDynamicBotAnswer(matchedItem);
            appendChatMessage('bot', answer);
        } else if (lower.includes('how many') || lower.includes('how much')) {
            appendChatMessage('bot', `That's a great question! For countable goods (like apples or eggs), ask <em>"How many...?"</em>. For uncountable foods (like milk, rice, or cheese), ask <em>"How much...?"</em>. Click any food button above to inspect stock!`);
        } else {
            appendChatMessage('bot', `Detective Apple can check live stock for any grocery item! Try asking about apples, bread, milk, bananas, cheese, or rice.`);
        }
    }, 450);
}

function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendCustomChatMessage();
    }
}

/**
 * REQUERIMIENTO 2: Cada vez que el bot responde, su mensaje
 * está acompañado por image.png funcionando como avatar/foto de perfil.
 */
function appendChatMessage(sender, text) {
    const body = document.getElementById('chatBody');
    if (!body) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (sender === 'bot') {
        msgDiv.innerHTML = `
            <img src="image.png" alt="Detective Apple Avatar" class="bot-msg-avatar">
            <div class="msg-bubble-wrap">
                <span class="msg-sender-tag">Detective Apple</span>
                <div class="msg-bubble">${text}</div>
                <span class="msg-time">${timeStr}</span>
            </div>
        `;
    } else {
        msgDiv.innerHTML = `
            <div class="msg-bubble-wrap">
                <div class="msg-bubble">${text}</div>
                <span class="msg-time">${timeStr}</span>
            </div>
        `;
    }

    body.appendChild(msgDiv);
    scrollChatToBottom();
}

function scrollChatToBottom() {
    const body = document.getElementById('chatBody');
    if (body) {
        body.scrollTop = body.scrollHeight;
    }
}

// ----------------------------------------------------------
// 11. MODALS & UTILITIES
// ----------------------------------------------------------
function toggleGrammarModal() {
    const modal = document.getElementById('grammarModal');
    if (modal) modal.classList.toggle('open');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'danger') icon = '🚫';

    toast.innerHTML = `
        <span>${icon}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ----------------------------------------------------------
// 12. INITIALIZATION ON DOM READY
// ----------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Initial renders
    renderWelcomeSnapshot();
    renderCatalog();
    renderAvailability();
    renderQuantitySection();
    renderCart();
    renderChatQuickButtons();
    updateCartBadge();
});
