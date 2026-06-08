// ============================================
// VARIABLES GLOBALES
// ============================================

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const filterButtons = document.querySelectorAll('.filter-btn');
const artCards = document.querySelectorAll('.art-card');
const favoriteButtons = document.querySelectorAll('.favorite-btn');
const categoryLinks = document.querySelectorAll('.category-link');
const imageModal = document.getElementById('imageModal');
const modalClose = document.getElementById('modalClose');

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Portafolio Artístico inicializado 🎨');
    
    setupEventListeners();
    setupGalleryFilters();
    setupFavorites();
    setupCategoryLinks();
    setupImageModal();
    setupScrollEffects();
    setupContactForm();
});

// ============================================
// FUNCIONES DE INICIALIZACIÓN
// ============================================

/**
 * Inicializa todas las funcionalidades cuando el DOM está cargado
 */
function init() {
    console.log('Portafolio Artístico inicializado 🎨');
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar filtros de galería
    setupGalleryFilters();
    
    // Configurar funcionalidad de favoritos
    setupFavorites();
    
    // Configurar enlaces de categorías
    setupCategoryLinks();
    
    // Configurar modal de imágenes y videos
    setupImageModal();
    
    // Configurar scroll y header
    setupScrollEffects();
    
    // Configurar formulario de contacto
    setupContactForm();
}

/**
 * Configura todos los event listeners del sitio
 */
function setupEventListeners() {
    // Menú móvil toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Cerrar menú al hacer clic en enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Botón volver arriba
    if (backToTop) {
        window.addEventListener('scroll', toggleBackToTop);
        backToTop.addEventListener('click', scrollToTop);
    }
    
    // Cerrar modal al hacer clic fuera
    if (imageModal) {
        imageModal.addEventListener('click', closeModalOnOutsideClick);
    }
    
    // Cerrar modal con Escape key
    document.addEventListener('keydown', closeModalOnEscape);
}

// ============================================
// MENÚ MÓVIL
// ============================================

/**
 * Alterna la visibilidad del menú móvil
 */
function toggleMobileMenu() {
    navMenu.classList.toggle('active'); // Agrega/remueve clase 'active'
    menuToggle.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' // Icono X cuando está abierto
        : '<i class="fas fa-bars"></i>'; // Icono hamburguesa cuando está cerrado
}

/**
 * Cierra el menú móvil
 */
function closeMobileMenu() {
    navMenu.classList.remove('active'); // Remueve clase 'active'
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Restaura icono hamburguesa
}

// ============================================
// FILTROS DE GALERÍA
// ============================================

/**
 * Configura la funcionalidad de filtrado de la galería
 */
function setupGalleryFilters() {
    if (!filterButtons.length || !artCards.length) return;
    
    // Añadir event listener a cada botón de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase 'active' de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Añadir clase 'active' al botón clickeado
            this.classList.add('active');
            
            // Obtener valor del filtro desde data-filter
            const filterValue = this.getAttribute('data-filter');
            
            // Actualizar texto del filtro activo
            updateActiveFilterText(filterValue);
            
            // Filtrar las cards de arte
            filterArtCards(filterValue);
        });
    });
}

/**
 * Actualiza el texto que muestra el filtro activo
 * @param {string} filterValue - Valor del filtro seleccionado
 */
function updateActiveFilterText(filterValue) {
    const filterInfo = document.querySelector('.filter-info span');
    if (!filterInfo) return;
    
    const filterTexts = {
        'all': 'Todos los dibujos',
        'personajes': 'Personajes',
        'escenarios': 'Escenarios',
        '3d': 'Modelado 3D',
        'animaciones': 'Animaciones'
    };
    
    filterInfo.textContent = `Mostrando: ${filterTexts[filterValue] || 'Todos los dibujos'}`;
}

/**
 * Filtra las cards de arte según la categoría seleccionada
 * @param {string} filterValue - Valor del filtro a aplicar
 */
function filterArtCards(filterValue) {
    artCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Determinar si la card debe mostrarse
        const shouldShow = filterValue === 'all' || cardCategory === filterValue;
        
        // Aplicar animación de transición
        if (shouldShow) {
            // Mostrar card con animación
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            // Ocultar card con animación
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// ============================================
// FUNCIONALIDAD DE FAVORITOS
// ============================================

/**
 * Configura la funcionalidad de botones de favorito
 */
function setupFavorites() {
    if (!favoriteButtons.length) return;
    
    // Cargar favoritos desde localStorage
    const favorites = JSON.parse(localStorage.getItem('artFavorites')) || [];
    
    // Actualizar estado inicial de los botones
    favoriteButtons.forEach(button => {
        const card = button.closest('.art-card');
        const cardId = card.getAttribute('data-id');
        
        if (favorites.includes(cardId)) {
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-heart"></i>';
        }
        
        // Añadir event listener
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita que se active el clic en la card
            toggleFavorite(this, cardId);
        });
    });
}

/**
 * Alterna el estado de favorito de una card
 * @param {HTMLElement} button - Botón de favorito clickeado
 * @param {string} cardId - ID único de la card
 */
function toggleFavorite(button, cardId) {
    // Obtener lista actual de favoritos
    let favorites = JSON.parse(localStorage.getItem('artFavorites')) || [];
    
    // Determinar si ya es favorito
    const isFavorite = button.classList.contains('active');
    
    if (isFavorite) {
        // Remover de favoritos
        favorites = favorites.filter(id => id !== cardId);
        button.classList.remove('active');
        button.innerHTML = '<i class="far fa-heart"></i>';
        showNotification('Removido de favoritos ❤️‍🩹');
    } else {
        // Agregar a favoritos
        favorites.push(cardId);
        button.classList.add('active');
        button.innerHTML = '<i class="fas fa-heart"></i>';
        showNotification('¡Agregado a favoritos! 💖');
    }
    
    // Guardar en localStorage
    localStorage.setItem('artFavorites', JSON.stringify(favorites));
}

// ============================================
// ENLACES DE CATEGORÍAS
// ============================================

/**
 * Configura los enlaces de categorías para activar filtros
 */
function setupCategoryLinks() {
    if (!categoryLinks.length) return;
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Previene navegación por defecto
            
            const filterValue = this.getAttribute('data-filter');
            const gallerySection = document.getElementById('galeria');
            
            // Desplazar suavemente a la galería
            if (gallerySection) {
                gallerySection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Activar el filtro correspondiente después de un breve delay
            setTimeout(() => {
                const correspondingButton = document.querySelector(`.filter-btn[data-filter="${filterValue}"]`);
                if (correspondingButton) {
                    correspondingButton.click();
                }
            }, 500);
        });
    });
}

// ============================================
// MODAL DE IMÁGENES Y VIDEOS (VERSIÓN CORREGIDA)
// ============================================

/**
 * Configura la funcionalidad del modal para imágenes y videos
 */
// ============================================
// MODAL DE IMÁGENES Y VIDEOS - VERSIÓN CORREGIDA
// ============================================

function setupImageModal() {
    // Añadir event listener a cada card para abrir modal
    artCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Evitar abrir modal si se hizo clic en botones internos
            if (e.target.closest('.favorite-btn') || 
                e.target.closest('.category-link') ||
                e.target.closest('.filter-btn')) {
                return;
            }
            
            // Detener propagación para evitar conflictos
            e.stopPropagation();
            
            // Obtener elementos dentro de la card
            const image = this.querySelector('img');
            const video = this.querySelector('video');
            const title = this.querySelector('.card-footer h4')?.textContent || 'Sin título';
            const description = this.querySelector('.card-footer p')?.textContent || 'Sin descripción';
            const category = this.getAttribute('data-category');
            
            // Obtener fecha del meta
            const dateElement = this.querySelector('.art-meta span:first-child');
            const date = dateElement ? dateElement.textContent : 'Fecha no disponible';
            
            console.log('Clic en card:', { tieneVideo: !!video, titulo: title }); // Debug
            
            // Determinar si es video o imagen
            if (video) {
                // Es un video - obtener source
                const videoSrc = video.querySelector('source')?.src || video.src;
                if (videoSrc) {
                    openVideoModal(videoSrc, title, description, category, date);
                } else {
                    console.error('No se encontró source de video');
                }
            } else if (image) {
                // Es una imagen
                openImageModal(image.src, title, description, category, date);
            }
        });
    });
    
    // Cerrar modal con botón
    if (modalClose) {
        modalClose.addEventListener('click', closeImageModal);
    }
}

/**
 * Abre el modal con video
 * @param {string} videoSrc - URL del video
 * @param {string} title - Título de la obra
 * @param {string} description - Descripción de la obra
 * @param {string} category - Categoría de la obra
 * @param {string} date - Fecha de creación
 */
function openVideoModal(videoSrc, title, description, category, date) {
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalCategory = document.getElementById('modalCategory');
    const modalDate = document.getElementById('modalDate');
    const modalImageContainer = document.querySelector('.modal-image-container');
    
    // Ocultar la imagen estática
    if (modalImage) {
        modalImage.style.display = 'none';
    }
    
    // Eliminar cualquier video existente
    const existingVideo = modalImageContainer.querySelector('video');
    if (existingVideo) {
        existingVideo.remove();
    }
    
    // Crear nuevo elemento de video
    const modalVideo = document.createElement('video');
    modalVideo.setAttribute('controls', 'controls');
    modalVideo.setAttribute('autoplay', 'autoplay');
    modalVideo.style.width = '100%';
    modalVideo.style.height = 'auto';
    modalVideo.style.borderRadius = 'var(--radio-borde-pequeno)';
    
    // Crear source
    const source = document.createElement('source');
    source.src = videoSrc;
    source.type = 'video/mp4';
    
    // Añadir source al video
    modalVideo.appendChild(source);
    
    // Mensaje de fallback
    modalVideo.appendChild(document.createTextNode('Tu navegador no soporta la reproducción de videos.'));
    
    // Añadir video al contenedor
    modalImageContainer.appendChild(modalVideo);
    
    // Configurar información
    if (modalTitle) modalTitle.textContent = title;
    if (modalDescription) modalDescription.textContent = description;
    if (modalCategory) modalCategory.textContent = getCategoryName(category);
    if (modalDate) modalDate.textContent = date;
    
    // Mostrar modal
    imageModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
}

/**
 * Abre el modal con la imagen ampliada (VERSIÓN MEJORADA)
 * @param {string} imageSrc - URL de la imagen
 * @param {string} title - Título de la obra
 * @param {string} description - Descripción de la obra
 * @param {string} category - Categoría de la obra
 * @param {string} date - Fecha de creación
 */
function openImageModal(imageSrc, title, description, category, date) {
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalCategory = document.getElementById('modalCategory');
    const modalDate = document.getElementById('modalDate');
    const modalImageContainer = document.querySelector('.modal-image-container');
    
    // Eliminar cualquier video existente
    const existingVideo = modalImageContainer.querySelector('video');
    if (existingVideo) {
        existingVideo.remove();
    }
    
    // Mostrar la imagen
    if (modalImage) {
        modalImage.style.display = 'block';
        modalImage.src = imageSrc;
        modalImage.alt = title;
    }
    
    // Configurar información
    if (modalTitle) modalTitle.textContent = title;
    if (modalDescription) modalDescription.textContent = description;
    if (modalCategory) modalCategory.textContent = getCategoryName(category);
    if (modalDate) modalDate.textContent = date;
    
    // Mostrar modal
    imageModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
}

/**
 * Cierra el modal de imagen/video
 */
function closeImageModal() {
    const modalImageContainer = document.querySelector('.modal-image-container');
    const modalVideo = modalImageContainer.querySelector('video');
    
    // Pausar video si existe
    if (modalVideo) {
        modalVideo.pause();
    }
    
    imageModal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restaurar scroll
}

/**
 * Cierra el modal al hacer clic fuera del contenido
 * @param {Event} e - Evento de clic
 */
function closeModalOnOutsideClick(e) {
    if (e.target === imageModal) {
        closeImageModal();
    }
}

/**
 * Cierra el modal al presionar la tecla Escape
 * @param {KeyboardEvent} e - Evento de teclado
 */
function closeModalOnEscape(e) {
    if (e.key === 'Escape' && imageModal.classList.contains('show')) {
        closeImageModal();
    }
}

/**
 * Obtiene el nombre legible de una categoría
 * @param {string} category - Valor de la categoría
 * @returns {string} Nombre legible de la categoría
 */
function getCategoryName(category) {
    const categoryNames = {
        'personajes': 'Personaje',
        'escenarios': 'Escenario',
        '3d': 'Modelado 3D',
        'animaciones': 'Animación'
    };
    
    return categoryNames[category] || 'Arte';
}

// ============================================
// EFECTOS DE SCROLL
// ============================================

/**
 * Configura los efectos relacionados con el scroll
 */
function setupScrollEffects() {
    // Header con efecto al hacer scroll
    window.addEventListener('scroll', toggleHeaderShadow);
    
    // Animaciones al hacer scroll
    setupScrollAnimations();
}

/**
 * Alterna la sombra del header al hacer scroll
 */
function toggleHeaderShadow() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

/**
 * Muestra/oculta el botón volver arriba según scroll position
 */
function toggleBackToTop() {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}

/**
 * Desplaza suavemente al inicio de la página
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Configura animaciones que se activan al hacer scroll
 */
function setupScrollAnimations() {
    // Intersection Observer para animar elementos al entrar en viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que deben animarse
    document.querySelectorAll('.art-card, .category-card, .skill-item').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// FORMULARIO DE CONTACTO - VERSIÓN FORMSpree
// ============================================

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar formulario
        if (!validateContactForm()) return;
        
        // Deshabilitar botón
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;
        
        // Crear FormData
        const formData = new FormData(contactForm);
        
        try {
            // Enviar a Formspree
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Éxito
                showNotification('¡Mensaje enviado con éxito! Te contactaré pronto 💖');
                contactForm.reset();
            } else {
                // Error del servidor
                const data = await response.json();
                throw new Error(data.error || 'Error al enviar el mensaje');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error: ' + error.message, 'error');
        } finally {
            // Restaurar botón
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
    
    // Validación en tiempo real
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

/**
 * Valida el formulario de contacto completo
 */
function validateContactForm() {
    let isValid = true;
    
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    
    if (!validateField(nameField)) isValid = false;
    if (!validateField(emailField)) isValid = false;
    if (!validateField(messageField)) isValid = false;
    
    return isValid;
}

/**
 * Valida un campo individual
 */
function validateField(field) {
    if (!field) return true;
    
    const value = field.value.trim();
    const errorElement = field.parentElement.querySelector('.error-message') || createErrorElement(field);
    
    errorElement.textContent = '';
    field.classList.remove('error');
    field.style.borderColor = '';
    
    if (field.required && !value) {
        showFieldError(field, errorElement, 'Este campo es requerido');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, errorElement, 'Ingresa un email válido');
            return false;
        }
    }
    
    return true;
}

/**
 * Crea elemento para mensajes de error
 */
function createErrorElement(field) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.cssText = `
        color: #ff4757;
        font-size: 0.85rem;
        margin-top: 5px;
        font-weight: 400;
    `;
    field.parentElement.appendChild(errorElement);
    return errorElement;
}

/**
 * Muestra error en campo
 */
function showFieldError(field, errorElement, message) {
    field.classList.add('error');
    field.style.borderColor = '#ff4757';
    errorElement.textContent = message;
}

/**
 * Limpia error del campo
 */
function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

/**
 * Muestra notificación flotante
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #ff7ba3, #ff9eb5)' : '#ff4757'};
        color: white;
        border-radius: 50px;
        box-shadow: 0 5px 20px rgba(255, 123, 163, 0.4);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 15px;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        border: 2px solid white;
    `;
    
    document.body.appendChild(notification);
    
    // Botón cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-cerrar
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// ============================================
// ANIMACIONES PARA NOTIFICACIONES
// ============================================
if (!document.querySelector('#notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%) scale(0.8); opacity: 0; }
            to { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0) scale(1); opacity: 1; }
            to { transform: translateX(100%) scale(0.8); opacity: 0; }
        }
    `;
    document.head.appendChild(styles);
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
    // El resto de tus funciones de inicialización (menú, filtros, etc.) aquí
});








// Pre-cargar imágenes cuando la ventana se carga completamente
window.addEventListener('load', preloadImages);

// ============================================
// POLYFILLS Y COMPATIBILIDAD
// ============================================

// Polyfill para forEach en NodeList (para navegadores muy antiguos)
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// Polyfill para closest (para IE)
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Polyfill para matches (para IE)
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}

// ==================== MODO OSCURO ====================
const darkModeBtn = document.createElement('button');
darkModeBtn.innerHTML = '🌙 Modo Oscuro';
darkModeBtn.className = 'dark-mode-toggle';
document.body.appendChild(darkModeBtn);

// Verificar preferencia guardada
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeBtn.innerHTML = '☀️ Modo Claro';
}

darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        darkModeBtn.innerHTML = '☀️ Modo Claro';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        darkModeBtn.innerHTML = '🌙 Modo Oscuro';
    }
});

// ==================== TRADUCTOR ESPAÑOL - INGLÉS ====================
const translateBtn = document.createElement('button');
translateBtn.innerHTML = '🌐 Español';
translateBtn.className = 'translate-btn';
document.body.appendChild(translateBtn);

// Estado del idioma (false = español, true = inglés)
let isEnglish = localStorage.getItem('language') === 'en';

// Diccionario de traducciones
const translations = {
    // Textos principales del sitio
    "Inicio": "Home",
    "Galería": "Gallery",
    "Categorías": "Categories",
    "Sobre Mí": "About Me",
    "Contacto": "Contact",
    "Ver Galería": "View Gallery",
    "Contáctame": "Contact Me",
    "Proyectos": "Projects",
    "Categorías": "Categories",
    "Dedicación": "Dedication",
    "Todos": "All",
    "Personajes": "Characters",
    "Escenarios": "Scenarios",
    "3D": "3D",
    "Animaciones": "Animations",
    "Mostrando: Todos los dibujos": "Showing: All drawings",
    "Personaje": "Character",
    "Escenario": "Scenario",
    "Animación": "Animation",
    "Ver proyectos": "View projects",
    "Trabajemos Juntos": "Let's Work Together",
    "Ver Portafolio Completo": "View Full Portfolio",
    "Enviar Mensaje": "Send Message",
    "Email": "Email",
    "Teléfono": "Phone",
    "Respuesta en 24h": "Response within 24h",
    "Lunes a Viernes 9:00-18:00": "Monday to Friday 9:00-18:00",
    "Dibujos y procesos": "Drawings and processes",
    "Portafolio profesional": "Professional Portfolio",
    "Sígueme": "Follow Me",
    "Navegación": "Navigation",
    "Legal": "Legal",
    // Textos largos del Sobre Mí
    "¡Hola! Soy Xochil Soto, estudiante de séptimo semestre de Animación.": "Hello! I'm Xochil Soto, a 7th semester Animation student.",
    "Me encanta participar en todo tipo de proyectos, desde grandes producciones hasta comisiones personales. He tenido la oportunidad de liderar equipos como directora de proyectos, coordinando campos creativos y dando vida a las ideas.": "I love participating in all kinds of projects, from large productions to personal commissions. I have had the opportunity to lead teams as a project director, coordinating creative fields and bringing ideas to life.",
    "Lo que me hace diferente: no solo animo, también entiendo cómo funciona un proyecto de principio a fin. Disfruto tanto organizar el equipo como meterme en los detalles más pequeños.": "What makes me different: I not only animate, I also understand how a project works from start to finish. I enjoy both organizing the team and diving into the smallest details.",
    "¿Tienes un proyecto? ¡Hablemos y creemos algo increíble juntos! ✨": "Do you have a project? Let's talk and create something amazing together! ✨",
    // Habilidades
    "Ilustración Digital": "Digital Illustration",
    "Modelado 3D": "3D Modeling",
    "Animación 2D/3D": "2D/3D Animation",
    "Diseño de Personajes": "Character Design",
    // Categorías descripciones
    "Creación de personajes únicos con personalidad y emociones": "Creation of unique characters with personality and emotions",
    "Diseño de mundos fantásticos y ambientes inmersivos": "Design of fantastic worlds and immersive environments",
    "Creación de objetos y personajes en tres dimensiones": "Creation of objects and characters in three dimensions",
    "Dando vida a mis creaciones con movimiento y fluidez": "Bringing my creations to life with movement and fluidity",
    // Footer
    "Creando magia con cada píxel ✨": "Creating magic with every pixel ✨",
    "Política de Privacidad": "Privacy Policy",
    "Términos y Condiciones": "Terms and Conditions",
    "Aviso Legal": "Legal Notice",
    "Cookies": "Cookies",
    "Pagina creada por:": "Page created by:",
    // Contacto
    "¿Tienes un proyecto en mente? ¡Contáctame!": "Do you have a project in mind? Contact me!",
    "Tu Nombre": "Your Name",
    "Tu Email": "Your Email",
    "Categoría de Proyecto": "Project Category",
    "Selecciona una categoría": "Select a category",
    "Otro": "Other",
    "Tu Mensaje": "Your Message",
    "Cuéntame sobre tu proyecto, ideas, presupuesto...": "Tell me about your project, ideas, budget...",
    "¿Cómo te llamas?": "What's your name?",
    "tucorreo@ejemplo.com": "your@email.com"
};

function translateToEnglish() {
    // Recorrer todos los elementos que contienen texto
    const allElements = document.querySelectorAll('h1, h2, h3, h4, p, span, a, button, li, label, option, .stat-text, .card-footer p, .about-description, .skill-header span, .category-card p, .category-stats span, .info-card span, .footer-tagline, .copyright, .made-with, .filter-info span');
    
    allElements.forEach(element => {
        // Solo traducir si no está vacío y no es un input
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
            const originalText = element.textContent.trim();
            if (translations[originalText]) {
                element.textContent = translations[originalText];
            }
        }
    });
    
    // Traducir placeholders de inputs
    const nameInput = document.getElementById('name');
    if (nameInput && nameInput.placeholder) {
        if (translations[nameInput.placeholder]) {
            nameInput.placeholder = translations[nameInput.placeholder];
        }
    }
    
    const emailInput = document.getElementById('email');
    if (emailInput && emailInput.placeholder) {
        if (translations[emailInput.placeholder]) {
            emailInput.placeholder = translations[emailInput.placeholder];
        }
    }
    
    const messageInput = document.getElementById('message');
    if (messageInput && messageInput.placeholder) {
        if (translations[messageInput.placeholder]) {
            messageInput.placeholder = translations[messageInput.placeholder];
        }
    }
    
    // Traducir opciones del select
    const selectOptions = document.querySelectorAll('#category option');
    selectOptions.forEach(option => {
        if (translations[option.textContent]) {
            option.textContent = translations[option.textContent];
        }
    });
}

function translateToSpanish() {
    location.reload(); // Recargar la página para volver al español original
}

// Configurar el botón según el idioma guardado
if (isEnglish) {
    translateBtn.innerHTML = '🇬🇧 English';
    translateToEnglish();
} else {
    translateBtn.innerHTML = '🇪🇸 Español';
}

translateBtn.addEventListener('click', () => {
    if (isEnglish) {
        // Cambiar a español
        translateToSpanish();
        localStorage.setItem('language', 'es');
        isEnglish = false;
        translateBtn.innerHTML = '🇪🇸 Español';
    } else {
        // Cambiar a inglés
        translateToEnglish();
        localStorage.setItem('language', 'en');
        isEnglish = true;
        translateBtn.innerHTML = '🇬🇧 English';
    }
});