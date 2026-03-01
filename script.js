// ============================================
// VARIABLES GLOBALES
// ============================================

// Elementos del DOM frecuentemente usados
const menuToggle = document.querySelector('.menu-toggle'); // Botón menú hamburguesa
const navMenu = document.querySelector('.nav-menu'); // Menú de navegación
const backToTop = document.getElementById('backToTop'); // Botón volver arriba
const contactForm = document.getElementById('contactForm'); // Formulario contacto
const filterButtons = document.querySelectorAll('.filter-btn'); // Botones filtro galería
const artCards = document.querySelectorAll('.art-card'); // Cards de arte
const favoriteButtons = document.querySelectorAll('.favorite-btn'); // Botones favorito
const categoryLinks = document.querySelectorAll('.category-link'); // Enlaces categorías
const imageModal = document.getElementById('imageModal'); // Modal imagen
const modalClose = document.getElementById('modalClose'); // Botón cerrar modal

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
function setupImageModal() {
    // Añadir event listener a cada card para abrir modal
    artCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Evitar abrir modal si se hizo clic en botones internos
            if (e.target.closest('.favorite-btn') || e.target.closest('.category-link')) {
                return;
            }
            
            // Obtener elementos dentro de la card
            const image = this.querySelector('img');
            const video = this.querySelector('video');
            const title = this.querySelector('.card-footer h4')?.textContent || 'Sin título';
            const description = this.querySelector('.card-footer p')?.textContent || 'Sin descripción';
            const category = this.getAttribute('data-category');
            const date = this.querySelector('.art-meta span:first-child')?.textContent || 'Fecha no disponible';
            
            // Determinar si es video o imagen
            if (video) {
                // Es un video
                const videoSrc = video.querySelector('source')?.src || video.src;
                openVideoModal(videoSrc, title, description, category, date);
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
// FORMULARIO DE CONTACTO
// ============================================

/**
 * Configura el formulario de contacto
 */
function setupContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Previene envío tradicional
        
        // Validar formulario
        if (validateContactForm()) {
            // Simular envío exitoso
            simulateFormSubmission();
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
 * @returns {boolean} True si el formulario es válido
 */
function validateContactForm() {
    let isValid = true;
    
    // Validar cada campo
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    
    if (!validateField(nameField)) isValid = false;
    if (!validateField(emailField)) isValid = false;
    if (!validateField(messageField)) isValid = false;
    
    return isValid;
}

/**
 * Valida un campo individual del formulario
 * @param {HTMLElement} field - Campo a validar
 * @returns {boolean} True si el campo es válido
 */
function validateField(field) {
    const value = field.value.trim();
    const errorElement = field.parentElement.querySelector('.error-message') || createErrorElement(field);
    
    // Limpiar error previo
    errorElement.textContent = '';
    field.classList.remove('error');
    
    // Validaciones específicas por tipo de campo
    if (field.required && !value) {
        showFieldError(field, errorElement, 'Este campo es requerido');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, errorElement, 'Por favor ingresa un email válido');
            return false;
        }
    }
    
    return true;
}

/**
 * Crea un elemento para mostrar errores de campo
 * @param {HTMLElement} field - Campo que necesita elemento de error
 * @returns {HTMLElement} Elemento de error creado
 */
function createErrorElement(field) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = '#ff4757';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '5px';
    field.parentElement.appendChild(errorElement);
    return errorElement;
}

/**
 * Muestra un error en un campo del formulario
 * @param {HTMLElement} field - Campo con error
 * @param {HTMLElement} errorElement - Elemento donde mostrar el error
 * @param {string} message - Mensaje de error
 */
function showFieldError(field, errorElement, message) {
    field.classList.add('error');
    field.style.borderColor = '#ff4757';
    errorElement.textContent = message;
}

/**
 * Limpia el error de un campo cuando el usuario comienza a escribir
 * @param {Event} e - Evento de input
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
 * Simula el envío exitoso del formulario
 */
function simulateFormSubmission() {
    // Mostrar estado de carga
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    // Simular delay de red
    setTimeout(() => {
        // Restaurar botón
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Mostrar mensaje de éxito
        showNotification('¡Mensaje enviado con éxito! 🎉 Te contactaré pronto.');
        
        // Resetear formulario
        contactForm.reset();
        
        // Enviar a Google Analytics (simulado)
        console.log('Formulario enviado - Datos:', {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            category: document.getElementById('category').value,
            message: document.getElementById('message').value
        });
    }, 2000);
}

// ============================================
// UTILIDADES GENERALES
// ============================================

/**
 * Muestra una notificación temporal al usuario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, info)
 */
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Estilos de la notificación
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.background = type === 'success' ? '#2ed573' : '#ff4757';
    notification.style.color = 'white';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '15px';
    notification.style.animation = 'slideIn 0.3s ease';
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Configurar botón de cierre
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Añadir animaciones CSS si no existen
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
}

/**
 * Pre-carga imágenes para mejor experiencia de usuario
 */
function preloadImages() {
    const imagePaths = [
        'assets/full body.jpg',
        'assets/SIRENOP.jpg',
        'assets/waifo_1.jpg',
        'assets/SOLO DIBUJO.jpg',
        'assets/FONDO_PRO_300000.jpg',
        'assets/imagen.jpg',
        'assets/FONDO_ANIMACIUON.jpg',
        'assets/RENDER.png'
    ];
    
    imagePaths.forEach(path => {
        const img = new Image();
        img.src = path;
    });
}

// ============================================
// INICIALIZACIÓN AL CARGAR EL DOM
// ============================================

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', init);

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