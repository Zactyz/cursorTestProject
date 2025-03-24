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
    
    for (const element of componentElements) {
        const componentName = element.getAttribute('data-component');
        const filePath = `_${componentName}.html`;
        
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentName}`);
            }
            
            const html = await response.text();
            
            // Add the component HTML 
            element.innerHTML = html;
            
            // If it's a header, check for current page to add active class
            if (componentName === 'header') {
                highlightCurrentPage();
            }
            
            // Initialize any scripts the component might need
            initComponentScripts(componentName);
        } catch (error) {
            console.error(error);
        }
    }
}

/**
 * Highlights the current page in the navigation
 */
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // For both desktop and mobile navigation
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Only highlight non-fragment links or exact page matches
        if (href === currentPage || 
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
        
        // Don't highlight links with fragments (#) for the current page
        // This prevents "Features" and "Always Free" from being highlighted on the home page
        if (href.includes('#') && href.split('#')[0] === currentPage) {
            link.classList.remove('active');
        }
    });
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