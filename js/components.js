// Components handler for static site
document.addEventListener('DOMContentLoaded', function() {
    // Load all components marked with data-component attribute
    loadComponents();
});

/**
 * Loads HTML components into elements with data-component attributes
 */
async function loadComponents() {
    const componentElements = document.querySelectorAll('[data-component]');
    const isGitHubPages = window.location.hostname.includes('github.io');
    console.log(`Environment detection: GitHub Pages = ${isGitHubPages}`);
    
    for (const element of componentElements) {
        const componentName = element.getAttribute('data-component');
        console.log(`Loading component: ${componentName}`);
        
        // Determine if we're on GitHub Pages to adjust paths accordingly
        let pathsToTry = [];
        
        // Always start with the standard relative path
        pathsToTry.push(`${componentName}.html`);
        
        // On GitHub Pages, we may need the full path with .html
        if (isGitHubPages) {
            // Get repository name for GitHub Pages
            const pathSegments = window.location.pathname.split('/');
            const repoBase = pathSegments.length > 1 ? `/${pathSegments[1]}` : '';
            
            pathsToTry.push(`${repoBase}/${componentName}.html`);
            pathsToTry.push(`${window.location.pathname}/${componentName}.html`);
            pathsToTry.push(`${window.location.origin}${repoBase}/${componentName}.html`);
        }
        
        // Add other path variations
        pathsToTry.push(`/${componentName}.html`);
        
        const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
        pathsToTry.push(`${basePath}/${componentName}.html`);
        
        // Try all paths until one works
        let response = null;
        for (const path of pathsToTry) {
            console.log(`Trying path: ${path}`);
            response = await tryFetch(path);
            if (response) {
                console.log(`Success with path: ${path}`);
                break;
            }
        }
        
        if (response) {
            try {
                console.log(`Component ${componentName} found, processing content...`);
                const html = await response.text();
                console.log(`Content length: ${html.length} characters`);
                
                // Add the component HTML 
                element.innerHTML = html;
                console.log(`Component ${componentName} HTML injected`);
                
                // If it's a header, check for current page to add active class
                if (componentName === 'header') {
                    console.log('Component navigation ready');
                    // Don't call highlightCurrentPage here - SPA.js will handle this
                }
                
                // Initialize any scripts the component might need
                console.log(`Initializing scripts for ${componentName}`);
                initComponentScripts(componentName);
                console.log(`${componentName} component loaded successfully`);
            } catch (error) {
                console.error(`Error processing ${componentName} component:`, error);
                console.error('Stack trace:', error.stack);
                element.innerHTML = `<div class="component-error">Failed to process ${componentName} component: ${error.message}</div>`;
            }
        } else {
            console.error(`Failed to load component: ${componentName} - File not found in any location after trying: ${pathsToTry.join(', ')}`);
            element.innerHTML = `<div class="component-error">Failed to load ${componentName} component</div>`;
        }
    }
}

/**
 * Try to fetch a resource and return the response if successful
 * @param {string} url - URL to fetch
 * @returns {Response|null} - Response object or null if failed
 */
async function tryFetch(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            return response;
        }
        return null;
    } catch (error) {
        console.error(`Fetch error for ${url}:`, error);
        return null;
    }
}

/**
 * Initialize any scripts needed by specific components
 */
function initComponentScripts(componentName) {
    if (componentName === 'header') {
        // Mobile menu toggle
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
                menuBtn.classList.toggle('active');
            });
        }
        
        // Sticky Navbar
        const navbar = document.getElementById('navbar');
        let lastScrollTop = 0;
        
        if (navbar) {
            // Apply navbar-scrolled on page load if already scrolled down
            if (window.scrollY > 100) {
                navbar.classList.add('navbar-scrolled');
            }
            
            window.addEventListener('scroll', function() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Add/remove scrolled class based on scroll position
                if (scrollTop > 100) {
                    navbar.classList.add('navbar-scrolled');
                } else {
                    navbar.classList.remove('navbar-scrolled');
                }
                
                // Show/hide navbar based on scroll direction
                if (scrollTop > lastScrollTop && scrollTop > 500) {
                    // Scrolling down
                    navbar.style.top = '-100px';
                } else {
                    // Scrolling up
                    navbar.style.top = '0';
                }
                
                lastScrollTop = scrollTop;
            });
        }
    }
    
    if (componentName === 'footer') {
        // Newsletter form validation
        const subscribeForm = document.querySelector('.subscribe-form form');
        
        if (subscribeForm) {
            subscribeForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailInput = this.querySelector('input[type="email"]');
                const email = emailInput.value.trim();
                
                if (validateEmail(email)) {
                    // Success - would normally submit to server
                    emailInput.value = '';
                    showToast('Thank you for subscribing!', 'success');
                } else {
                    showToast('Please enter a valid email address.', 'error');
                }
            });
        }
    }
}

// Re-use existing validation function
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Re-use existing toast function (simplified)
function showToast(message, type) {
    // Check if toast container exists, create if not
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
} 