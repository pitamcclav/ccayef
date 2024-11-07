// Configuration object for pages
const pages = {
    'home': {
        id: 'home',
        path: 'Home/Index.html',
        title: 'Home'
    },
    'about': {
        id: 'about',
        path: 'Home/About.html',
        title: 'About Us'
    },
    'services': {
        id: 'services',
        path: 'Home/Services.html',
        title: 'Services'
    },
    'projects': {
        id: 'projects',
        path: 'Home/Projects.html',
        title: 'Projects'
    },
    'media': {
        id: 'media',
        path: 'Home/Media.html',
        title: 'Media'
    },
    'resources': {
        id: 'resources',
        path: 'Home/Publications.html',
        title: 'Resources'
    },
    'contact': {
        id: 'contact',
        path: 'Home/Contact.html',
        title: 'Contact'
    },
    'earlyChildhoodDev': {
        id: 'earlyChildhood',
        path: 'Services/EarlyChildhoodDev.html',
        title: 'Early Childhood'
    },
    'healthServices': {
        id: 'healthServices',
        path: 'Services/HealthServices.html',
        title: 'Health Services'
    },
    'teenageMotherRehab': {
        id: 'teenageMotherRehab',
        path: 'Services/TeenageMotherRehab.html',
        title: 'Teenage Mother Rehabilitation'
    },
    'vocationalTraining': {
        id: 'vocationalTraining',
        path: 'Services/VocationalTraining.html',
        title: 'Vocational Training'
    },
    'youthEmpowerment': {
        id: 'youthEmpowerment',
        path: 'Services/YouthEmpowerment.html',
        title: 'Youth Empowerment'
    },
    'WASHandClimaChange': {
        id: 'WASHandClimaChange',
        path: 'Services/WASHandClimaChange.html',
        title: 'WASH and Climate Change'
    },
};

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
        }, 200);

        // Update active navigation and page title
        updateActiveNav(pageId);
        document.title = `CCAYEF - ${page.title}`;
        history.pushState({ page: pageId }, '', `#${pageId}`);
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

// Function to load services page content
async function loadServicesPage(pageId) {
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
        }, 200);

        // Update active navigation and page title
        // updateActiveNav(pageId);
        document.title = `CCAYEF - ${page.title}`;
        history.pushState({ page: pageId }, '', `#${pageId}`);
    }
    catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('content').innerHTML = `
            <div class="container mt-5">
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Error Loading Page</h4>
                    <p>Sorry, we couldn't load the requested page. Please try again later.</p>
                    <hr>
                    <p class="mb-0">Error details: ${error.message}</p>
                </div>
            </div>`;
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
    
    // Initialize Swiper if present
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.swiper', {
            direction: 'horizontal',
            loop: true,
            slidesPerView: 3,
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
                1024: { slidesPerView: 3 },
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
    
    // Set up navigation click handlers
    document.querySelectorAll('.more').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            
            // Optional: Console log to confirm which element was clicked
            console.log(`Clicked link with pageId: ${pageId}`);
            
            if (pageId) {
                loadServicesPage(pageId);
            }
        });
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            
            // Optional: Console log to confirm which element was clicked
            console.log(`Clicked link with pageId: ${pageId}`);
            
            if (pageId) {
                loadPage(pageId);
            }
        });
    });

    

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        const pageId = e.state?.page || 'home';
        loadPage(pageId);
    });
    
    // Load initial page
    const initialPage = window.location.hash.slice(1) || 'home';
    loadPage(initialPage);
});