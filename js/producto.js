/**
 * Phone Store Maracaibo — Product Detail Page
 * Flow: read URL param → find product → render detail + related.
 * If product not found → redirect to catalog (guard clause at init).
 *
 * Data dependency: products.data.js must load before this file.
 */

'use strict';

/* --- Constants --- */

const WHATSAPP_NUMBER = '584146395496';
const WHATSAPP_BASE   = 'https://wa.me/';
const CATALOG_URL     = 'catalogo.html';
const RELATED_STAGGER_MS = 80;

/* --- Data Layer --- */

/**
 * Reads the `id` query param from the current URL.
 * @returns {string|null}
 */
const getProductIdFromUrl = () =>
    new URLSearchParams(window.location.search).get('id');

/**
 * Resolves badge config from a product's category and condition.
 * @param {import('./products.data').Product} product
 * @returns {{ cssClass: string, label: string }}
 */
const resolveBadge = (product) => {
    const MAP = {
        nuevo:       { cssClass: 'product-detail__badge--nuevo',      label: 'Nuevo' },
        certificado: { cssClass: 'product-detail__badge--certificado', label: 'Certificado PSM' },
        accesorio:   { cssClass: 'product-detail__badge--accesorio',   label: 'Accesorio' },
        repuesto:    { cssClass: 'product-detail__badge--repuesto',    label: 'Repuesto' }
    };

    if (product.category !== 'iphone') return MAP[product.category];
    return MAP[product.condition];
};

/**
 * Builds the warranty text based on product type.
 * iPhones: 60 days. Accessories/parts: 30 days.
 * @param {import('./products.data').Product} product
 * @returns {{ title: string, subtitle: string }}
 */
const resolveWarranty = (product) => {
    if (product.category === 'iphone') {
        return {
            title: '60 días de garantía PSM',
            subtitle: 'Cubre defectos de fábrica y funcionamiento'
        };
    }
    return {
        title: '30 días de garantía PSM',
        subtitle: 'Garantía sobre el producto y la instalación'
    };
};

/* --- DOM Layer --- */

/**
 * Updates all dynamic <meta> tags for social sharing.
 * Called after the product is found — before rendering — so crawlers
 * get correct data even if they execute JS.
 * @param {import('./products.data').Product} product
 */
const updateMetaTags = (product) => {
    const heroImage = product.gallery[0] ?? 'img/logo-img-white.png';

    document.getElementById('page-title').textContent        = `${product.name} | Phone Store Maracaibo`;
    document.getElementById('meta-description').content      = product.description;
    document.getElementById('og-title').content              = `${product.name} | Phone Store Maracaibo`;
    document.getElementById('og-description').content        = product.description;
    document.getElementById('og-image').content              = heroImage;
    document.getElementById('breadcrumb-name').textContent   = product.name;
};

/**
 * Renders the full product detail section and injects it into the DOM.
 * Hides the skeleton, reveals the content container.
 * @param {import('./products.data').Product} product
 */
const renderProduct = (product) => {
    const badge    = resolveBadge(product);
    const warranty = resolveWarranty(product);
    const waUrl    = `${WHATSAPP_BASE}${WHATSAPP_NUMBER}?text=${encodeURIComponent(product.waMessage)}`;

    const specTags = product.specs
        .map(s => `<span class="product-detail__spec">${s}</span>`)
        .join('');

    const galleryThumbs = product.gallery.length > 1
        ? product.gallery.map((src, i) => `
            <button
                class="product-gallery__thumb ${i === 0 ? 'product-gallery__thumb--active' : ''}"
                data-thumb-index="${i}"
                aria-label="Ver imagen ${i + 1}"
            >
                <img src="${src}" alt="${product.name} vista ${i + 1}" loading="lazy">
            </button>
        `).join('')
        : '';

    const html = `
        <div class="container">
            <div class="product-layout">

                <!-- Gallery column -->
                <div class="product-gallery">
                    <div class="product-gallery__hero" id="gallery-hero">
                        <img
                            class="product-gallery__hero-img"
                            id="gallery-hero-img"
                            src="${product.gallery[0]}"
                            alt="${product.name}"
                        >
                    </div>
                    ${galleryThumbs ? `<div class="product-gallery__thumbs" id="gallery-thumbs">${galleryThumbs}</div>` : ''}
                </div>

                <!-- Detail column -->
                <div class="product-detail">
                    <span class="product-detail__badge ${badge.cssClass}">${badge.label}</span>

                    <h1 class="product-detail__name">${product.name}</h1>

                    <div class="product-detail__specs">${specTags}</div>

                    <p class="product-detail__description">${product.description}</p>

                    <div class="product-detail__warranty">
                        <div class="product-detail__warranty-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                <path d="M9 12l2 2 4-4"/>
                            </svg>
                        </div>
                        <div class="product-detail__warranty-text">
                            <strong>${warranty.title}</strong>
                            <span>${warranty.subtitle}</span>
                        </div>
                    </div>

                    <div class="product-detail__actions">
                        <a
                            href="${waUrl}"
                            target="_blank"
                            rel="noopener"
                            class="btn btn--primary"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            <span>Consultar por WhatsApp</span>
                        </a>
                        <a href="catalogo.html" class="btn btn--secondary">
                            Ver catálogo
                        </a>
                    </div>

                    <button class="btn--share" id="share-btn" aria-label="Compartir producto">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                        <span>Compartir</span>
                    </button>
                </div>

            </div>
        </div>
    `;

    const skeleton = document.getElementById('product-skeleton');
    const content  = document.getElementById('product-content');

    if (!skeleton || !content) return;

    skeleton.style.opacity = '0';
    skeleton.style.transition = 'opacity 300ms ease';

    setTimeout(() => {
        skeleton.hidden = true;
        content.innerHTML = html;
        content.hidden = false;
        content.style.opacity = '0';
        content.style.transition = 'opacity 400ms ease';
        requestAnimationFrame(() => { content.style.opacity = '1'; });
    }, 300);
};

/**
 * Renders the related products strip.
 * @param {import('./products.data').Product[]} relatedProducts
 */
const renderRelated = (relatedProducts) => {
    if (!relatedProducts.length) return;

    const section = document.getElementById('related-section');
    const grid    = document.getElementById('related-grid');

    if (!section || !grid) return;

    grid.innerHTML = relatedProducts.map((product, index) => {
        const delay = index * RELATED_STAGGER_MS;
        const conditionLabel = product.condition === 'certificado' ? 'Certificado' : 'Nuevo';
        return `
            <a href="producto.html?id=${product.id}" class="related-card" style="animation-delay: ${delay}ms">
                <div class="related-card__image-wrap">
                    <img src="${product.gallery[0]}" alt="${product.name}" loading="lazy">
                </div>
                <div class="related-card__body">
                    <p class="related-card__name">${product.name}</p>
                    <span class="related-card__condition">${conditionLabel}</span>
                </div>
            </a>
        `;
    }).join('');

    section.hidden = false;
};

/* --- Event Layer --- */

/**
 * Binds thumbnail click events for gallery switching.
 * Uses event delegation on the thumbs container.
 * @param {import('./products.data').Product} product
 */
const bindGalleryEvents = (product) => {
    const thumbsContainer = document.getElementById('gallery-thumbs');
    if (!thumbsContainer) return;

    thumbsContainer.addEventListener('click', (e) => {
        const thumb = e.target.closest('.product-gallery__thumb');
        if (!thumb) return;

        const index = parseInt(thumb.dataset.thumbIndex, 10);
        if (isNaN(index) || !product.gallery[index]) return;

        const heroImg = document.getElementById('gallery-hero-img');
        if (!heroImg) return;

        /* Fade transition between gallery images */
        heroImg.style.opacity = '0';
        heroImg.style.transition = 'opacity 200ms ease';
        setTimeout(() => {
            heroImg.src = product.gallery[index];
            heroImg.style.opacity = '1';
        }, 200);

        thumbsContainer.querySelectorAll('.product-gallery__thumb')
            .forEach(t => t.classList.remove('product-gallery__thumb--active'));
        thumb.classList.add('product-gallery__thumb--active');
    });
};

/**
 * Binds the native Web Share API if available, falls back to clipboard copy.
 */
const bindShareButton = () => {
    const shareBtn = document.getElementById('share-btn');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: document.title,
            text:  'Mira este producto en Phone Store Maracaibo',
            url:   window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }
            /* Fallback: copy URL to clipboard */
            await navigator.clipboard.writeText(window.location.href);
            shareBtn.querySelector('span').textContent = '¡Enlace copiado!';
            setTimeout(() => {
                shareBtn.querySelector('span').textContent = 'Compartir';
            }, 2000);
        } catch {
            /* User cancelled share — no action needed */
        }
    });
};

/**
 * Handles pending page links (cart, login) with toast notification.
 */
const bindPendingPages = () => {
    document.querySelectorAll('[data-page-pending]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const label = link.dataset.pagePending === 'cart' ? 'Carrito' : 'Mi cuenta';
            showToast(`${label} — Próximamente`);
        });
    });
};

/* --- Utility --- */

/**
 * Toast notification — white on dark for product page context.
 * @param {string} message
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
        pointer-events: none; font-family: inherit;
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
};

/* --- Init --- */

document.addEventListener('DOMContentLoaded', () => {
    const productId = getProductIdFromUrl();

    /* Guard: no ID or invalid ID → redirect to catalog */
    if (!productId) {
        window.location.href = CATALOG_URL;
        return;
    }

    const product = window.PSM.findProductById(productId);

    /* Guard: product not found → redirect to catalog */
    if (!product) {
        window.location.href = CATALOG_URL;
        return;
    }

    updateMetaTags(product);
    renderProduct(product);

    /* Bind events after render (content injected by renderProduct with delay) */
    const RENDER_DELAY_MS = 350;
    setTimeout(() => {
        bindGalleryEvents(product);
        bindShareButton();
    }, RENDER_DELAY_MS);

    const related = window.PSM.getRelatedProducts(product);
    renderRelated(related);

    bindPendingPages();
});
