/**
 * Phone Store Maracaibo — Shared Product Data
 * Single source of truth for all product data.
 * Loaded before catalogo.js and producto.js.
 *
 * Why a shared file: both the catalog grid and the product detail page
 * need this data. Duplicating it would create divergence risk.
 *
 * @namespace PSM
 */

'use strict';

window.PSM = window.PSM || {};

/**
 * @typedef {Object} Product
 * @property {string}      id          - Unique identifier (used as URL param)
 * @property {string}      name        - Display name
 * @property {string}      category    - 'iphone' | 'accesorio' | 'repuesto'
 * @property {number|null} series      - iPhone series number, null for non-iPhones
 * @property {string}      condition   - 'nuevo' | 'certificado'
 * @property {string[]}    specs       - Feature tags shown on cards
 * @property {string[]}    gallery     - Ordered image paths (first = hero)
 * @property {string}      description - Long description for product detail page
 * @property {string}      waMessage   - WhatsApp pre-filled inquiry message
 */
window.PSM.PRODUCTS = [

    /* --- Serie 17 --- */
    {
        id: 'iph-17-pro-max',
        name: 'iPhone 17 Pro Max',
        category: 'iphone',
        series: 17,
        condition: 'nuevo',
        specs: ['A19 Pro', 'Titanio', '256GB'],
        gallery: [
            'img/phone/product/iphone_17/17_pro_max_png/17promax.png',
            'img/phone/product/iphone_17/iphone-17-series.webp'
        ],
        description: 'El iPhone más avanzado de la historia. El chip A19 Pro establece nuevos estándares de rendimiento, con una cámara Pro de 48 MP con zoom óptico 5x y pantalla Super Retina XDR ProMotion 120Hz en titanio grado aeroespacial.',
        waMessage: 'Hola, me interesa el iPhone 17 Pro Max'
    },
    {
        id: 'iph-17',
        name: 'iPhone 17',
        category: 'iphone',
        series: 17,
        condition: 'nuevo',
        specs: ['A19', '6.1"', '128GB'],
        gallery: [
            'img/phone/product/iphone_17/17_plus/iphone-17.png',
            'img/phone/product/iphone_17/iphone-17-series.webp'
        ],
        description: 'Toda la potencia del A19 en el formato estándar. Dynamic Island, carga rápida y la misma durabilidad de siempre en un diseño renovado.',
        waMessage: 'Hola, me interesa el iPhone 17'
    },

    /* --- Serie 16 --- */
    {
        id: 'iph-16-pro-max',
        name: 'iPhone 16 Pro Max',
        category: 'iphone',
        series: 16,
        condition: 'nuevo',
        specs: ['A18 Pro', 'Titanio', '256GB'],
        gallery: [
            'img/phone/product/iphone_16/16_pro_max/16_pro_max.png',
            'img/phone/product/iphone_16/0021697_iphone-16-16-plus-series.jpeg'
        ],
        description: 'Pantalla de 6.9" ProMotion 120Hz, chip A18 Pro y sistema de cámara Pro más avanzado de Apple hasta la fecha. Con Action Button y botón de Control de Cámara. Cuerpo de titanio grado aeroespacial.',
        waMessage: 'Hola, me interesa el iPhone 16 Pro Max'
    },
    {
        id: 'iph-16',
        name: 'iPhone 16 Negro',
        category: 'iphone',
        series: 16,
        condition: 'nuevo',
        specs: ['A18', '6.1"', '128GB', 'Negro Titanio'],
        gallery: [
            'img/phone/product/iphone_16/png/iphone_16_black_titanium.png',
            'img/phone/product/iphone_16/iphone-16-finish-select-202409-6-1inch-black.jfif'
        ],
        description: 'El iPhone 16 en Negro Titanio. Chip A18 con Apple Intelligence, cámara Fusion de 48 MP y Dynamic Island. USB-C con transferencia a 10 Gb/s.',
        waMessage: 'Hola, me interesa el iPhone 16 en Negro Titanio'
    },
    {
        id: 'iph-16-pink',
        name: 'iPhone 16 Rosa',
        category: 'iphone',
        series: 16,
        condition: 'nuevo',
        specs: ['A18', '6.1"', '128GB', 'Rosa'],
        gallery: [
            'img/phone/product/iphone_16/png/iphone_16_pink.png',
            'img/phone/product/iphone_16/iPhone-16-Teal-1.png'
        ],
        description: 'El iPhone 16 en acabado Rosa. Todo el rendimiento del A18 con Apple Intelligence en el color más solicitado de la temporada.',
        waMessage: 'Hola, me interesa el iPhone 16 en color Rosa'
    },
    {
        id: 'iph-16-white',
        name: 'iPhone 16 Blanco',
        category: 'iphone',
        series: 16,
        condition: 'nuevo',
        specs: ['A18', '6.1"', '128GB', 'Blanco'],
        gallery: [
            'img/phone/product/iphone_16/png/iphone_16_white.png',
            'img/phone/product/iphone_16/0021697_iphone-16-16-plus-series.jpeg'
        ],
        description: 'El iPhone 16 en Blanco. Diseño atemporal con chip A18 y el sistema de cámara más inteligente de la línea estándar.',
        waMessage: 'Hola, me interesa el iPhone 16 en color Blanco'
    },

    /* --- Serie 15 --- */
    {
        id: 'iph-15-pro-max',
        name: 'iPhone 15 Pro Max',
        category: 'iphone',
        series: 15,
        condition: 'nuevo',
        specs: ['A17 Pro', 'Titanio', '256GB'],
        gallery: [
            'img/phone/product/iphone_15/15_pro_max/15_pro_max.png',
            'img/phone/iphone-15-pro-max-blue-titanium-256gb-back_4.jpg'
        ],
        description: 'El primer iPhone con cuerpo de titanio grado aeroespacial. Chip A17 Pro con GPU de 6 núcleos, zoom óptico 5x y Action Button personalizable. USB-C con Thunderbolt 3.',
        waMessage: 'Hola, me interesa el iPhone 15 Pro Max'
    },
    {
        id: 'iph-15-black',
        name: 'iPhone 15 Negro',
        category: 'iphone',
        series: 15,
        condition: 'certificado',
        specs: ['A16 Bionic', '6.1"', '128GB'],
        gallery: [
            'img/phone/product/iphone_15/iphone_15/iphone_15_black.png',
            'img/phone/product/iphone_15/iphone_15/iphone_15_cream_1.png'
        ],
        description: 'Certificado PSM. El iPhone 15 Negro en condición revisada y garantizada. Pantalla Super Retina XDR con Dynamic Island, chip A16 Bionic y cámara principal de 48 MP.',
        waMessage: 'Hola, me interesa el iPhone 15 Negro certificado'
    },
    {
        id: 'iph-15-cream',
        name: 'iPhone 15 Crema',
        category: 'iphone',
        series: 15,
        condition: 'certificado',
        specs: ['A16 Bionic', '6.1"', '128GB', 'Crema'],
        gallery: [
            'img/phone/product/iphone_15/iphone_15/iphone_15_cream_1.png',
            'img/phone/product/iphone_15/iphone_15/iphone_15_white.png'
        ],
        description: 'Certificado PSM. iPhone 15 en Crema — el tono más elegante de la Serie 15. Revisado, garantizado y listo para estrenar.',
        waMessage: 'Hola, me interesa el iPhone 15 en color Crema'
    },
    {
        id: 'iph-15-white',
        name: 'iPhone 15 Blanco',
        category: 'iphone',
        series: 15,
        condition: 'certificado',
        specs: ['A16 Bionic', '6.1"', '128GB', 'Blanco'],
        gallery: [
            'img/phone/product/iphone_15/iphone_15/iphone_15_white.png',
            'img/phone/product/iphone_15/iphone_15/iphone_15_cream_1.png'
        ],
        description: 'Certificado PSM. iPhone 15 Blanco con revisión técnica completa. 60 días de garantía PSM incluida.',
        waMessage: 'Hola, me interesa el iPhone 15 en color Blanco'
    },

    /* --- Accesorios --- */
    {
        id: 'acc-cargador-40w',
        name: 'Cargador Apple 40W',
        category: 'accesorio',
        series: null,
        condition: 'nuevo',
        specs: ['Original Apple', '40W', 'USB-C'],
        gallery: [
            'img/accesorys/cargador40w/PNG/40w.png'
        ],
        description: 'Cargador original Apple de 40W con conector USB-C. Compatible con iPhone 15 y 16. Carga hasta un 50% en 30 minutos. Incluye cable USB-C.',
        waMessage: 'Hola, me interesa el Cargador Apple 40W'
    },
    {
        id: 'acc-cable-typec',
        name: 'Cable Anker USB-C',
        category: 'accesorio',
        series: null,
        condition: 'nuevo',
        specs: ['Nylon trenzado', '1 metro', 'USB-C a USB-C'],
        gallery: [
            'img/accesorys/cableTypeC/PNG/cabletypec.png'
        ],
        description: 'Cable Anker USB-C a USB-C de nylon trenzado. 1 metro de longitud, soporta carga rápida y transferencia de datos. Compatible con todos los iPhone con puerto USB-C.',
        waMessage: 'Hola, me interesa el Cable Anker USB-C'
    },
    {
        id: 'acc-airpods-4',
        name: 'AirPods Serie 4',
        category: 'accesorio',
        series: null,
        condition: 'nuevo',
        specs: ['Original Apple', 'ANC activo', 'USB-C', 'H2 chip'],
        gallery: [
            'img/accesorys/airpods/serie4/PNG/airpods-serie4.png'
        ],
        description: 'AirPods Serie 4 con cancelación activa de ruido. Diseño abierto rediseñado, chip H2, hasta 30 horas de batería total con estuche. Puerto USB-C.',
        waMessage: 'Hola, me interesa los AirPods Serie 4'
    },

    /* --- Repuestos --- */
    {
        id: 'rep-camara-frontal-15',
        name: 'Cámara Frontal 15 Pro Max',
        category: 'repuesto',
        series: null,
        condition: 'nuevo',
        specs: ['Original Apple', 'Serie 13 al 15', 'Incluye instalación'],
        gallery: [
            'img/accesorys/camara_iphone_pro_max/iphone_15_pro_max/PNG/camara-accesory-iphone-15-pro-max.png'
        ],
        description: 'Módulo de cámara frontal TrueDepth original para iPhone 13, 14 y 15 Pro Max. Incluye instalación por técnico certificado PSM y garantía de 30 días sobre el trabajo.',
        waMessage: 'Hola, me interesa la Cámara Frontal para mi iPhone'
    },
    {
        id: 'rep-camara-trasera-14',
        name: 'Cámara Trasera Serie 14',
        category: 'repuesto',
        series: null,
        condition: 'nuevo',
        specs: ['Original Apple', 'Serie 14 al 16', 'Incluye instalación'],
        gallery: [
            'img/accesorys/camara_iphone_pro_max/trasera-iphone_14/PNG/camara-trasera_iphone14.png'
        ],
        description: 'Módulo de cámara trasera original para iPhone 14, 15 y 16. Reemplaza el módulo completo. Instalación por técnico certificado PSM incluida con garantía de 30 días.',
        waMessage: 'Hola, me interesa la Cámara Trasera para mi iPhone'
    },
    {
        id: 'rep-bateria-15',
        name: 'Batería iPhone 15 Pro Max',
        category: 'repuesto',
        series: null,
        condition: 'nuevo',
        specs: ['Original Apple', 'Serie 14 al 16', 'Incluye instalación', '100% salud'],
        gallery: [
            'img/accesorys/bateries/PNG/bateries-iphone-15-pro-max.png'
        ],
        description: 'Batería original Apple al 100% de salud para iPhone 14, 15 y 16. El reemplazo devuelve la autonomía original de tu iPhone. Instalación en el día con garantía de 30 días.',
        waMessage: 'Hola, me interesa el reemplazo de Batería para mi iPhone'
    }
];

/**
 * Finds a product by its unique ID.
 * @param {string} id
 * @returns {Product|undefined}
 */
window.PSM.findProductById = (id) =>
    window.PSM.PRODUCTS.find(p => p.id === id);

/**
 * Returns related products: same series or same category, excluding self.
 * Capped at 4 to keep the related strip clean.
 * @param {Product} product
 * @returns {Product[]}
 */
window.PSM.getRelatedProducts = (product) => {
    const MAX_RELATED = 4;
    return window.PSM.PRODUCTS
        .filter(p => p.id !== product.id && (
            (p.series && p.series === product.series) ||
            p.category === product.category
        ))
        .slice(0, MAX_RELATED);
};
