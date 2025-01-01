
// Configuration object for pages
const pages = {
    'home': {
        id: 'home',
        path: 'Home/Index.html',
        title: 'Home'
    },
    'about': {
        id: 'about',
        path: ' Home/About.html',
        title: 'About Us'
    },
    'services': {
        id: 'services',
        path: ' Home/Services.html',
        title: 'Services'
    },
    'projects': {
        id: 'projects',
        path: ' Home/Projects.html',
        title: 'Projects'
    },
    'media': {
        id: 'media',
        path: ' Home/Media.html',
        title: 'Media'
    },
    'resources': {
        id: 'resources',
        path: ' Home/Publications.html',
        title: 'Resources'
    },
    'contact': {
        id: 'contact',
        path: ' Home/Contact.html',
        title: 'Contact'
    },
    'earlyChildhoodDev': {
        id: 'earlyChildhood',
        path: ' Services/EarlyChildhoodDev.html',
        title: 'Early Childhood'
    },
    'healthServices': {
        id: 'healthServices',
        path: ' Services/HealthServices.html',
        title: 'Health Services'
    },
    'teenageMotherRehab': {
        id: 'teenageMotherRehab',
        path: ' Services/TeenageMotherRehab.html',
        title: 'Teenage Mother Rehabilitation'
    },
    'vocationalTraining': {
        id: 'vocationalTraining',
        path: ' Services/VocationalTraining.html',
        title: 'Vocational Training'
    },
    'youthEmpowerment': {
        id: 'youthEmpowerment',
        path: ' Services/YouthEmpowerment.html',
        title: 'Youth Empowerment'
    },
    'WASHandClimateChange': {
        id: 'WASHandClimateChange',
        path: ' Services/WASHandClimateChange.html',
        title: 'WASH and Climate Change'
    },
};

function observeGalleryContainer() {
    const observer = new MutationObserver((mutationsList, observer) => {
        const galleryContainer = document.getElementById('gallery-container');
        if (galleryContainer) {
            loadImages();
            observer.disconnect(); // Stop observing once the container is found and images are loaded
        }
    });

    observer.observe(document.getElementById('content'), {
        childList: true, // Observe direct children
        subtree: true,   // Observe entire subtree
    });
}

function observeDocumentContainer(type) {
    const observer = new MutationObserver((mutationsList, observer) => {
        const container = document.querySelector(`.${type} .row`);
        if (container) {
            loadDocuments(type); // Load the documents for the specified type
            observer.disconnect(); // Stop observing once the container is found
        }
    });

    // Observe changes in the #content area, assuming this is where dynamic content is loaded
    observer.observe(document.getElementById('content'), {
        childList: true,
        subtree: true,
    });
}

function observeAccordionContainer() {
    const observer = new MutationObserver((mutationsList, observer) => {
        const accordionContainer = document.querySelector('.accordion');
        if (accordionContainer) {
            toggleAccordionItems(); // Adjust accordion items based on screen size
            observer.disconnect(); // Stop observing once adjustments are made
        }
    });

    // Observe the #content container for any new children (such as dynamically loaded accordion)
    observer.observe(document.getElementById('content'), {
        childList: true,
        subtree: true,
    });
}

// Function to load page content
async function loadPage(pageId) {
    console.log('Loading page:', pageId);

    const page = pages[pageId];
    console.log(page);

    // If page is not found in the configuration, show an error
    if (!page) {
        console.error('Page not found:', pageId);
        document.getElementById('content').innerHTML = '<div class="container mt-5"><h1>Page Not Found</h1></div>';
        return;
    }

    try {
        // Fetch the correct path based on configuration
        const response = await fetch(page.path);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const content = await response.text();

        // Fade out content before updating
        setTimeout(() => {
            document.getElementById('content').innerHTML = content;
            document.getElementById('content').style.opacity = '1';

            // Reinitialize plugins
            initializePlugins();

            // Specifically initialize carousel for home page
            if (pageId === 'home') {
                initializeHomeCarousel();
            }

            // if (pageId === 'services') {
            //     observeAccordionContainer(); // Start observing accordion items on the services page
            // }
        }, 200);

        // Update active navigation and page title
        updateActiveNav(pageId);
        document.title = `CCAYEF - ${page.title}`;
        history.pushState({ page: pageId }, '', `#${pageId}`);
        if (pageId === 'media') {
            observeGalleryContainer();
        }
        if (pageId === 'resources') {
            observeDocumentContainer('publications');
            observeDocumentContainer('reports');
        }
        if (pageId === 'services') {
            observeAccordionContainer(); // Start observing accordion items on the services page
        }
    } catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('content').innerHTML = `
            <div class="container mt-5">
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Error Loading Page</h4>
                    <p>Sorry, we couldn't load the requested page. Please try again later.</p>
                    <hr>
                    <p class="mb-0">Error details: ${error.message}</p>
                </div>
            </div>
        `;
    }
}


// Update active navigation state
function updateActiveNav(pageId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}

// Initialize all plugins
function initializePlugins() {
    // Reinitialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
        AOS.init({
            duration: 800,
            easing: 'slide',
            once: true,
            mirror: false
        });
    }
     // Initialize Bootstrap carousel with autoplay
     const heroCarousel = document.getElementById('heroCarousel');
     if (heroCarousel) {
         const carousel = new bootstrap.Carousel(heroCarousel, {
             interval: 5000, // Set autoplay interval (5 seconds)
             ride: 'carousel',
             wrap: true
         });

         // Force start the carousel
         carousel.cycle();

         // Add zoom effect handling
        heroCarousel.addEventListener('slid.bs.carousel', function() {
            // Remove zoom from all images
            const allImages = this.querySelectorAll('.carousel-item img');
            allImages.forEach(img => {
                img.style.transform = 'scale(1)';
                img.style.transition = 'transform 3s ease-in-out';
            });

            // Add zoom to active image
            const activeImage = this.querySelector('.carousel-item.active img');
            if (activeImage) {
                // Small delay to ensure smooth transition
                setTimeout(() => {
                    activeImage.style.transform = 'scale(1.1)';
                }, 50);
            }
        });

        // Initialize zoom for the first active image
        const firstActiveImage = heroCarousel.querySelector('.carousel-item.active img');
        if (firstActiveImage) {
            setTimeout(() => {
                firstActiveImage.style.transform = 'scale(1.1)';
            }, 50);
        }

    }

    // Initialize Swiper if present
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.swiper', {
            direction: 'horizontal',
            loop: true,
            slidesPerView: 2,
            spaceBetween: 30,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            breakpoints: {
                1024: { slidesPerView: 2 },
                768: { slidesPerView: 2 },
                576: { slidesPerView: 1 },
                344: { slidesPerView: 1 },
            },
            lazy: {
                loadOnTransitionStart: true,
                loadPrevNext: true,
            },
            scrollbar: {
                el: '.swiper-scrollbar',
            },
        });
    }
}

// Add this function to explicitly initialize the carousel when the home page loads
function initializeHomeCarousel() {
    const heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel) {
        const carousel = new bootstrap.Carousel(heroCarousel, {
            interval: 5000,
            ride: 'carousel',
            wrap: true
        });

        // Initialize zoom for the first active image
        const firstActiveImage = heroCarousel.querySelector('.carousel-item.active img');
        if (firstActiveImage) {
            setTimeout(() => {
                firstActiveImage.style.transform = 'scale(1.1)';
            }, 50);
        }
        carousel.cycle();
    }
}

function getApiUrl(endpoint) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `http://localhost:3000/${endpoint}`;
    } else {
        return `/api/${endpoint}`;
    }
}



function loadImages() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) {
        console.error('Gallery container not found');
        return;
    }
    if (galleryContainer.children.length > 0) return; // Prevent re-adding images

    fetch(getApiUrl('images')) // Use the utility function here
        .then(response => response.json())
        .then(images => {
            images.forEach(image => {
                const swiperSlide = document.createElement('div');
                swiperSlide.classList.add('swiper-slide');
                swiperSlide.innerHTML = `
                <div class="gallery-item">
                    <img src="images/gallery/${image}" class="img-fluid rounded" alt="Gallery Image">
                </div>`;
                galleryContainer.appendChild(swiperSlide);
            });

            initializePlugins(); // Reinitialize Swiper after adding images
        })
        .catch(error => console.error('Error loading images:', error));
}

async function loadDocuments(type) {
    try {
        const response = await fetch(getApiUrl(`documents/${type}`)); // Use the utility function here
        const documents = await response.json();

        const container = document.querySelector(`.${type} .row`);
        if (!container) {
            console.error(`Container for ${type} not found`);
            return;
        }
        container.innerHTML = ''; // Clear any previous content

        documents.forEach(doc => {
            const docIcon = getFileIcon(doc.type); // Function to select icon

            const cardHTML = `
                <div class="col-lg-4 my-3">
                    <div class="card" style="align-items:center;">
                        <img src="${docIcon}" alt="${doc.name}" class="card-img-top" 
                        style="width:40%; box-shadow:none; object-fit:cover; padding:20px;">
                        <div class="card-body">
                            <h6>${doc.name}</h6>
                            <a href="${doc.url}" class="btn btn-primary" download>Download</a>
                        </div>
                    </div>
                </div>
            `;

            container.insertAdjacentHTML('beforeend', cardHTML);
        });
    } catch (error) {
        console.error('Error loading documents:', error);
    }
}

function getFileIcon(extension) {
    switch (extension) {
        case '.pdf': return 'images/icons/pdf.png';
        case '.doc': case '.docx': return 'images/icons/word.png';
        case '.xls': case '.xlsx': return 'images/icons/excel.png';
        default: return 'icons/file-icon.png';
    }
}

function toggleAccordionItems() {
    const accordionItems = document.querySelectorAll('.accordion-collapse');
    if (window.innerWidth >= 992) {
        accordionItems.forEach(item => item.classList.add('show'));
    } else {
        accordionItems.forEach(item => item.classList.remove('show'));
    }
}

function toggleNavbar() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarToggle = document.querySelector('.navbar-toggler');

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            // Check if the navbar toggler is visible and the menu is expanded
            if (window.getComputedStyle(navbarToggle).display !== 'none' && navbarToggle.classList.contains('collapsed') === false) {
                navbarToggle.click();
            }
        });
    });
}

function sendEmail(){
    const form = document.getElementById('volunteerForm');
    form.addEventListener('submit', function (event){
        event.preventDefault();
        emailjs.send('service_enz5mri','template_nqxqm57',{
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        }).then(function (response){
            document.getElementById('status').innerText = 'Message sent successfully!';
        },function (error){
            document.getElementById('status').innerText = 'Failed to send message'
            console.error('Error', error)
        })
    })
}



// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');

    // Add smooth transition styling
    const style = document.createElement('style');
    style.textContent = `
        #content {
            transition: opacity 0.2s ease-in-out;
        }
    `;
    document.head.appendChild(style);

    // Initialize navbar toggler
    toggleNavbar();



    // Page navigation
    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-page]');
        if (link) {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            if (pageId) {
                loadPage(pageId);
            }
        }
    });
    window.addEventListener('resize', toggleAccordionItems);

    /* Add scroll transition JavaScript */
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });



    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        const pageId = e.state?.page || 'home';
        loadPage(pageId);
    });

    // Load initial page
    const initialPage = window.location.hash.slice(1) || 'home';
    loadPage(initialPage);
    if (document.getElementById('volunteerForm')) {
        sendEmail();
    }

});