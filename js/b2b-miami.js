/**
 * Phone Store Maracaibo — B2B Miami Page
 * Handles the B2B inquiry form: validation → WA message assembly → redirect.
 * No external form libraries. No server calls. Pure client-side UX.
 *
 * Why WhatsApp as the submission channel: PSM's closing channel is WhatsApp.
 * Pre-formatting the message from form data removes friction for the sales team
 * and ensures they receive structured, complete lead information every time.
 */

'use strict';

/* --- Constants --- */

const WHATSAPP_NUMBER   = '584146395496';
const WHATSAPP_BASE     = 'https://wa.me/';
const FORM_ID           = 'b2b-inquiry-form';
const SUBMIT_BTN_ID     = 'form-submit-btn';

/** Required field IDs and their human-readable labels for error messages */
const REQUIRED_FIELDS = [
    { id: 'field-name',     label: 'nombre completo',   errorId: 'error-name'     },
    { id: 'field-business', label: 'negocio o empresa', errorId: 'error-business' },
    { id: 'field-products', label: 'productos',         errorId: 'error-products' }
];

/* --- Data Layer: Form value extraction --- */

/**
 * Reads all form field values into a plain object.
 * Single point of extraction — DOM reading happens here only.
 * @returns {{ name: string, business: string, products: string, volume: string, payment: string, message: string }}
 */
const extractFormData = () => ({
    name:     getFieldValue('field-name'),
    business: getFieldValue('field-business'),
    products: getFieldValue('field-products'),
    volume:   getFieldValue('field-volume'),
    payment:  getFieldValue('field-payment'),
    message:  getFieldValue('field-message')
});

/**
 * Reads and trims a field value by ID.
 * @param {string} fieldId
 * @returns {string}
 */
const getFieldValue = (fieldId) => {
    const el = document.getElementById(fieldId);
    return el ? el.value.trim() : '';
};

/* --- Data Layer: Validation --- */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean}  isValid  - True when all required fields pass
 * @property {Object[]} errors   - Array of { fieldId, errorId, message } for failed fields
 */

/**
 * Validates all required fields.
 * Pure function — reads DOM values but does not mutate the DOM.
 * @param {{ name: string, business: string, products: string }} data
 * @returns {ValidationResult}
 */
const validateForm = (data) => {
    const errors = REQUIRED_FIELDS
        .filter(field => !getFieldValue(field.id))
        .map(field => ({
            fieldId:  field.id,
            errorId:  field.errorId,
            message:  `El campo "${field.label}" es requerido.`
        }));

    return {
        isValid: errors.length === 0,
        errors
    };
};

/* --- Data Layer: WhatsApp message builder --- */

/**
 * Builds a structured, human-readable WhatsApp message from form data.
 * Formatted for the sales team's fast reading — not for the customer.
 *
 * The line-by-line format ensures the sales team can scan the lead in 5 seconds
 * and respond with all necessary information without asking follow-up questions.
 *
 * @param {{ name: string, business: string, products: string, volume: string, payment: string, message: string }} data
 * @returns {string} URL-encoded WhatsApp link
 */
const buildWhatsAppMessage = (data) => {
    const lines = [
        `🏢 *SOLICITUD B2B — Phone Store Miami*`,
        ``,
        `👤 *Nombre:* ${data.name}`,
        `🏬 *Negocio:* ${data.business}`,
        ``,
        `📦 *Productos solicitados:*`,
        `${data.products}`,
        ``,
        data.volume   ? `📊 *Volumen estimado:* ${data.volume}`     : null,
        data.payment  ? `💳 *Método de pago:* ${data.payment}`      : null,
        data.message  ? `💬 *Comentarios:*\n${data.message}`        : null,
        ``,
        `_Solicitud enviada desde phonestoreca.com/b2b-miami_`
    ];

    const message = lines
        .filter(line => line !== null)
        .join('\n');

    return `${WHATSAPP_BASE}${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

/* --- DOM Layer: UI state management --- */

/**
 * Renders validation errors into the DOM.
 * Also adds visual error state class to each invalid field.
 * @param {Object[]} errors
 */
const showErrors = (errors) => {
    errors.forEach(({ fieldId, errorId, message }) => {
        const input = document.getElementById(fieldId);
        const errorEl = document.getElementById(errorId);

        input?.classList.add('b2b-form__input--error');
        if (errorEl) errorEl.textContent = message;
    });
};

/**
 * Clears all error states from the form.
 * Called on each submit attempt before re-validating.
 */
const clearErrors = () => {
    REQUIRED_FIELDS.forEach(({ id, errorId }) => {
        document.getElementById(id)?.classList.remove('b2b-form__input--error');
        const errorEl = document.getElementById(errorId);
        if (errorEl) errorEl.textContent = '';
    });
};

/**
 * Puts the submit button in a loading state to prevent double-submission.
 * Restores after a delay to handle cases where the WA redirect fails.
 * @param {HTMLButtonElement} btn
 */
const setSubmitLoading = (btn) => {
    const RESTORE_MS = 3000;

    btn.disabled = true;
    btn.querySelector('span').textContent = 'Abriendo WhatsApp...';

    /* Restore after timeout in case redirect doesn't fire (e.g. WA not installed) */
    setTimeout(() => {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Enviar solicitud por WhatsApp';
    }, RESTORE_MS);
};

/**
 * Scrolls to the first field with an error.
 * @param {Object[]} errors
 */
const scrollToFirstError = (errors) => {
    if (!errors.length) return;
    const firstField = document.getElementById(errors[0].fieldId);
    firstField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstField?.focus();
};

/* --- Event Layer --- */

/**
 * Handles form submission.
 * Pipeline: extract → validate → show errors OR build WA URL → redirect.
 * @param {SubmitEvent} e
 */
const handleSubmit = (e) => {
    e.preventDefault();

    clearErrors();

    const data = extractFormData();
    const { isValid, errors } = validateForm(data);

    if (!isValid) {
        showErrors(errors);
        scrollToFirstError(errors);
        return;
    }

    const submitBtn = document.getElementById(SUBMIT_BTN_ID);
    setSubmitLoading(submitBtn);

    const waUrl = buildWhatsAppMessage(data);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Clears individual field error on input — real-time feedback.
 * Avoids waiting for next submission to show correction.
 * @param {InputEvent} e
 */
const handleFieldInput = (e) => {
    const field = e.target;
    if (!field.classList.contains('b2b-form__input--error')) return;

    field.classList.remove('b2b-form__input--error');

    /* Find and clear the matching error message */
    const match = REQUIRED_FIELDS.find(f => f.id === field.id);
    if (!match) return;
    const errorEl = document.getElementById(match.errorId);
    if (errorEl) errorEl.textContent = '';
};

/**
 * Smooth scroll for anchor links within the page.
 * @param {MouseEvent} e
 */
const handleAnchorClick = (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').replace('#', '');
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/**
 * Handles pending page links (cart, login) with toast.
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

/**
 * Wires all event listeners.
 */
const bindEvents = () => {
    const form = document.getElementById(FORM_ID);
    if (!form) return;

    form.addEventListener('submit', handleSubmit);

    /* Real-time error clearing — delegated to form container */
    form.addEventListener('input', handleFieldInput);

    /* Smooth scroll for in-page anchor links */
    document.addEventListener('click', handleAnchorClick);

    bindPendingPages();
};

/* --- Utility --- */

/**
 * Toast notification — light theme for B2B page.
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
        background: #0a0a0a; color: #fff; padding: 0.75rem 1.5rem;
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

document.addEventListener('DOMContentLoaded', bindEvents);
