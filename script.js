document.addEventListener('DOMContentLoaded', function () {
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true
    });

    // Navbar scroll behavior
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = '#ffffff';
                navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            } else {
                navbar.style.backgroundColor = 'transparent';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active class to current nav item
    const currentLocation = location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });

    // Initialize Swiper
    const swiperContainer = document.querySelector('.swiper');
    if (swiperContainer) {
        new Swiper('.swiper', {
            loop: true,
            effect: 'fade',
            speed: 1000,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }

    // Initialize mobile navigation
    initMobileNav();

    // Initialize product filters
    initProductFilters();
});

// Mobile Navigation Toggle
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
    }
}

// Products Filter System
function initProductFilters() {
    const brandFilter = document.getElementById('brandFilter');
    const capacityFilter = document.getElementById('capacityFilter');
    const sortFilter = document.getElementById('sortFilter');
    const filterButton = document.getElementById('filter-button');
    const productsGrid = document.querySelector('.row.g-4');

    if (!brandFilter || !capacityFilter || !sortFilter || !productsGrid) return;

    function filterProducts() {
        const selectedBrand = brandFilter.value;
        const selectedCapacity = capacityFilter.value;
        const selectedSort = sortFilter.value;
        const productColumns = Array.from(productsGrid.querySelectorAll('.col-md-4'));
        let visibleProducts = productColumns;

        if (selectedBrand !== 'all') {
            visibleProducts = visibleProducts.filter(column => {
                const card = column.querySelector('.product-card');
                return card && card.dataset.brand === selectedBrand;
            });
        }

        if (selectedCapacity !== 'all') {
            visibleProducts = visibleProducts.filter(column => {
                const card = column.querySelector('.product-card');
                return card && card.dataset.capacity === selectedCapacity;
            });
        }

        visibleProducts.sort((a, b) => {
            const cardA = a.querySelector('.product-card');
            const cardB = b.querySelector('.product-card');
            const priceA = parseInt(cardA.dataset.price);
            const priceB = parseInt(cardB.dataset.price);
            return selectedSort === 'price-low' ? priceA - priceB : selectedSort === 'price-high' ? priceB - priceA : 0;
        });

        productColumns.forEach(column => column.style.display = 'none');
        visibleProducts.forEach(column => {
            column.style.display = 'block';
            productsGrid.appendChild(column);
        });

        let noProductsMessage = document.querySelector('.no-products');
        if (!noProductsMessage && visibleProducts.length === 0) {
            noProductsMessage = document.createElement('div');
            noProductsMessage.className = 'col-12 no-products text-center py-5';
            noProductsMessage.innerHTML = '<p>Geen producten gevonden met de geselecteerde filters.</p>';
            productsGrid.appendChild(noProductsMessage);
        } else if (noProductsMessage) {
            noProductsMessage.style.display = visibleProducts.length === 0 ? 'block' : 'none';
        }
    }

    brandFilter.addEventListener('change', filterProducts);
    capacityFilter.addEventListener('change', filterProducts);
    sortFilter.addEventListener('change', filterProducts);
    if (filterButton) {
        filterButton.addEventListener('click', (e) => {
            e.preventDefault();
            filterProducts();
        });
    }

    filterProducts();
}
