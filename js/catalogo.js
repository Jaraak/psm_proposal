/**
 * Phone Store Maracaibo — Catalog Page
 * Architecture: Data → Filter → Render pipeline.
 * All product data lives in PRODUCTS. DOM is 100% JS-rendered.
 * Filters are pure functions: they don't mutate state, they return new arrays.
 */

'use strict';

/* --- Constants --- */

const WHATSAPP_NUMBER = '584146395496';
const WHATSAPP_BASE = 'https://wa.me/';
const ANIMATION_STAGGER_MS = 60;

/**
 * Reference to shared product data.
 * Source of truth lives in products.data.js (loaded first in HTML).
 */
const PRODUCTS = window.PSM.PRODUCTS;



/* --- Filter State --- */

/**
 * Centralized filter state.
 * Single source of truth for active filters.
 */
const filterState = {
    category: 'all',
    series: 'all',
    condition: 'all',
    search: ''
};

/* --- Data Layer: Pure filter functions --- */

/**
 * Filters products by category.
 * @param {Product[]} products
 * @param {string} category
 * @returns {Product[]}
 */
const filterByCategory = (products, category) => {
    if (category === 'all') return products;
    return products.filter(p => p.category === category);
};

/**
 * Filters products by iPhone series.
 * @param {Product[]} products
 * @param {string} series - Series number as string or 'all'
 * @returns {Product[]}
 */
const filterBySeries = (products, series) => {
    if (series === 'all') return products;
    return products.filter(p => p.series === Number(series));
};

/**
 * Filters products by condition.
 * @param {Product[]} products
 * @param {string} condition
 * @returns {Product[]}
 */
const filterByCondition = (products, condition) => {
    if (condition === 'all') return products;
    return products.filter(p => p.condition === condition);
};

/**
 * Filters products by search query against name and specs.
 * @param {Product[]} products
 * @param {string} query
 * @returns {Product[]}
 */
const filterBySearch = (products, query) => {
    if (!query.trim()) return products;
    const normalized = query.toLowerCase();
    return products.filter(p =>
        p.name.toLowerCase().includes(normalized) ||
        p.specs.some(s => s.toLowerCase().includes(normalized))
    );
};

/**
 * Applies all active filters to the full product list.
 * Composed pipeline: each filter receives the output of the previous.
 * @returns {Product[]} Filtered product array
 */
const getFilteredProducts = () => {
    return [
        p => filterByCategory(p, filterState.category),
        p => filterBySeries(p, filterState.series),
        p => filterByCondition(p, filterState.condition),
        p => filterBySearch(p, filterState.search)
    ].reduce((products, fn) => fn(products), PRODUCTS);
};

/* --- DOM Layer: Render functions --- */

/**
 * Builds the badge class and label for a product card.
 * @param {Product} product
 * @returns {{ cssClass: string, label: string }}
 */
const resolveBadge = (product) => {
    const MAP = {
        nuevo: { cssClass: 'catalog-card__badge--new', label: 'Nuevo' },
        certificado: { cssClass: 'catalog-card__badge--certified', label: 'Certificado' },
        accesorio: { cssClass: 'catalog-card__badge--accessory', label: 'Accesorio' },
        repuesto: { cssClass: 'catalog-card__badge--accessory', label: 'Repuesto' }
    };

    if (product.category !== 'iphone') return MAP[product.category];
    return MAP[product.condition];
};

/**
 * Renders a single product card HTML string.
 * Uses template literals — no innerHTML concatenation in loops.
 * @param {Product} product
 * @param {number} index - Used for staggered animation delay
 * @returns {string} HTML string
 */
const renderProductCard = (product, index) => {
    const badge = resolveBadge(product);
    const waUrl = `${WHATSAPP_BASE}${WHATSAPP_NUMBER}?text=${encodeURIComponent(product.waMessage)}`;
    const delay = index * ANIMATION_STAGGER_MS;
    const specTags = product.specs
        .map(s => `<span class="catalog-card__spec-tag">${s}</span>`)
        .join('');

    return `
        <a href="producto.html?id=${product.id}" class="catalog-card" style="animation-delay: ${delay}ms" data-product-id="${product.id}">
            <div class="catalog-card__image-wrap">
                <span class="catalog-card__badge ${badge.cssClass}">${badge.label}</span>
                <img
                    class="catalog-card__image"
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </div>
            <div class="catalog-card__body">
                <h3 class="catalog-card__name">${product.name}</h3>
                <div class="catalog-card__specs">${specTags}</div>
                <div class="catalog-card__cta">
                    <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn--primary btn--small">
                        Consultar
                    </a>
                </div>
            </div>
        </a>
    `;
};

/**
 * Renders the full product grid or empty state based on filtered results.
 * @param {Product[]} products - Filtered products to render
 */
const renderGrid = (products) => {
    const grid = document.getElementById('catalog-grid');
    const emptyState = document.getElementById('catalog-empty');
    const resultsCount = document.getElementById('results-count');
    const totalCount = document.getElementById('total-count');

    if (!grid) return;

    totalCount.textContent = PRODUCTS.length;
    resultsCount.textContent = `${products.length} resultado${products.length !== 1 ? 's' : ''}`;

    if (products.length === 0) {
        grid.innerHTML = '';
        emptyState.hidden = false;
        return;
    }

    emptyState.hidden = true;
    grid.innerHTML = products.map(renderProductCard).join('');
};

/* --- Event Layer --- */

/**
 * Handles filter pill click — updates state and re-renders.
 * @param {HTMLElement} clickedPill - The pill that was clicked
 * @param {string} filterGroup      - Which filter group was toggled
 */
const handleFilterClick = (clickedPill, filterGroup) => {
    const pillContainer = clickedPill.closest('.filter-pills');
    if (!pillContainer) return;

    pillContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('filter-pill--active'));
    clickedPill.classList.add('filter-pill--active');

    filterState[filterGroup] = clickedPill.dataset.filter;

    /* Hide series filter when viewing non-iPhone categories — it's irrelevant */
    const seriesGroup = document.getElementById('series-filter-group');
    if (seriesGroup) {
        const isIphoneContext = filterState.category === 'all' || filterState.category === 'iphone';
        seriesGroup.classList.toggle('filter-group--hidden', !isIphoneContext);
    }

    /* Reset series filter when switching away from iPhone */
    if (filterGroup === 'category' && filterState.category !== 'iphone') {
        filterState.series = 'all';
        const seriesPills = document.querySelectorAll('[data-filter-group="series"] .filter-pill');
        seriesPills.forEach(p => p.classList.toggle('filter-pill--active', p.dataset.filter === 'all'));
    }

    renderGrid(getFilteredProducts());
};

/**
 * Handles live search input with debounce to avoid re-renders on every keystroke.
 * @param {string} query - Current search input value
 */
const handleSearch = debounce((query) => {
    filterState.search = query;
    renderGrid(getFilteredProducts());
}, 250);

/**
 * Wires all event listeners.
 * Delegated to parent containers to avoid per-card listeners.
 */
const bindEvents = () => {
    /* Filter pills — event delegation on each pill container */
    document.querySelectorAll('.filter-pills').forEach(container => {
        const filterGroup = container.dataset.filterGroup;
        container.addEventListener('click', (e) => {
            const pill = e.target.closest('.filter-pill');
            if (!pill) return;
            handleFilterClick(pill, filterGroup);
        });
    });

    /* Search input */
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    }

    /* Reset button in empty state */
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            Object.assign(filterState, { category: 'all', series: 'all', condition: 'all', search: '' });
            document.querySelectorAll('.filter-pill').forEach(p => {
                p.classList.toggle('filter-pill--active', p.dataset.filter === 'all');
            });
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.value = '';
            renderGrid(PRODUCTS);
        });
    }

    /* Pending pages toast — reuse shared PendingPages pattern */
    document.querySelectorAll('[data-page-pending]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.dataset.pagePending;
            const label = pageName === 'cart' ? 'Carrito' : 'Mi cuenta';
            showToast(`${label} — Próximamente`);
        });
    });
};

/* --- Utility --- */

/**
 * Generic toast notification.
 * Duplicated here because catalogo.js loads independently of script.js scope.
 * @param {string} message - Message to display
 */
const showToast = (message) => {
    const existing = document.getElementById('psm-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'psm-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
        background: #ffffff; color: #000; padding: 0.75rem 1.5rem;
        border-radius: 9999px; font-size: 0.875rem; font-weight: 500;
        z-index: 9999; opacity: 0; transition: opacity 300ms ease;
        pointer-events: none; font-family: var(--font-family);
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
};

/**
 * Debounce utility — same pattern as script.js.
 * Re-declared here because module scope is isolated.
 * @param {Function} fn
 * @param {number} wait
 * @returns {Function}
 */
function debounce(fn, wait = 200) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), wait);
    };
}

/* --- URL param: pre-filter from external links --- */

/**
 * Reads `?filter=` query param on load to pre-activate a filter.
 * Allows footer links like catalogo.html?filter=certificado to work.
 */
const applyUrlFilter = () => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    if (!filter) return;

    /* Map URL param to the correct filter group */
    const CATEGORY_FILTERS = ['iphone', 'accesorio', 'repuesto'];
    const CONDITION_FILTERS = ['nuevo', 'certificado'];

    if (CATEGORY_FILTERS.includes(filter)) {
        filterState.category = filter;
        const pill = document.querySelector(`[data-filter-group="category"] [data-filter="${filter}"]`);
        if (pill) {
            document.querySelectorAll('[data-filter-group="category"] .filter-pill')
                .forEach(p => p.classList.remove('filter-pill--active'));
            pill.classList.add('filter-pill--active');
        }
    }

    if (CONDITION_FILTERS.includes(filter)) {
        filterState.condition = filter;
        const pill = document.querySelector(`[data-filter-group="condition"] [data-filter="${filter}"]`);
        if (pill) {
            document.querySelectorAll('[data-filter-group="condition"] .filter-pill')
                .forEach(p => p.classList.remove('filter-pill--active'));
            pill.classList.add('filter-pill--active');
        }
    }
};

/* --- Init --- */

document.addEventListener('DOMContentLoaded', () => {
    applyUrlFilter();
    bindEvents();
    renderGrid(getFilteredProducts());
});
