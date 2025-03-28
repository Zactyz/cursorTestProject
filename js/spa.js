// SPA functionality for Ciple website
document.addEventListener('DOMContentLoaded', function() {
    console.log('SPA script loaded');
    initSPA();
    
    // Add a slight delay to ensure header is loaded before highlighting
    setTimeout(() => {
        console.log('Initial navigation highlighting');
        const currentPath = window.location.pathname;
        const cleanUrl = currentPath === '/' || currentPath === '' ? 'index' : currentPath.split('/').pop().replace('.html', '');
        highlightCurrentPage(cleanUrl);
    }, 100);
});

/**
 * Detect if the site is running on GitHub Pages
 * @returns {boolean} - True if running on GitHub Pages
 */
function isGitHubPages() {
    return window.location.hostname.includes('github.io');
}

/**
 * Get the base path for the site (e.g., '/repo-name' on GitHub Pages)
 * @returns {string} - Base path with leading slash, or empty string if at root
 */
function getBasePath() {
    if (isGitHubPages()) {
        const pathSegments = window.location.pathname.split('/');
        // For GitHub Pages, the first segment after the domain is the repo name
        if (pathSegments.length > 1 && pathSegments[1]) {
            return '/' + pathSegments[1];
        }
    }
    return '';
}

/**
 * Initialize Single Page Application functionality
 */
function initSPA() {
    console.log('Initializing SPA functionality');
    console.log(`Environment: GitHub Pages = ${isGitHubPages()}, Base path = ${getBasePath()}`);
    
    // Get the main content container
    const contentContainer = document.querySelector('main') || document.createElement('main');
    
    // If there's no main element, wrap all content between header and footer in main
    if (!document.querySelector('main')) {
        console.log('No main element found, creating one');
        const tempContent = document.createElement('div');
        let currentElement = document.querySelector('[data-component="header"]').nextElementSibling;
        const footer = document.querySelector('[data-component="footer"]');
        
        while (currentElement && currentElement !== footer) {
            const nextElement = currentElement.nextElementSibling;
            tempContent.appendChild(currentElement);
            currentElement = nextElement;
        }
        
        // Create main element and insert it after header
        contentContainer.innerHTML = tempContent.innerHTML;
        document.querySelector('[data-component="header"]').after(contentContainer);
        console.log('Main element created and inserted');
    }
    
    // Intercept all internal link clicks
    document.addEventListener('click', function(e) {
        // Find closest anchor tag
        const link = e.target.closest('a');
        
        if (!link) return; // Not a link
        
        const url = link.getAttribute('href');
        console.log(`Link clicked: ${url}`);
        
        // Skip if it's an external link
        if (
            !url || 
            url.startsWith('http') || 
            url.startsWith('https') || 
            url.includes('glide.page')
        ) {
            return;
        }
        
        // Handle home page specially
        if (url === '/' || (url.startsWith('/') && url.length === 1)) {
            e.preventDefault();
            console.log('Home page link clicked, navigating to index.html');
            
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            const menuBtn = document.getElementById('mobile-menu-btn');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                if (menuBtn) menuBtn.classList.remove('active');
            }
            
            navigateTo('index.html', true, `${getBasePath()}/`);
            return;
        }
        
        // Handle anchor links to sections on the home page (like /#studies)
        if (url.startsWith('/#')) {
            e.preventDefault();
            console.log(`Home page section link clicked: ${url}`);
            const hash = url.substring(2); // Remove /# to get the anchor name
            
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            const menuBtn = document.getElementById('mobile-menu-btn');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                if (menuBtn) menuBtn.classList.remove('active');
            }
            
            navigateTo('index.html', true, `${getBasePath()}/`, hash);
            return;
        }

        // Handle pure anchor links on current page
        if (url.startsWith('#')) {
            // Let browser handle same-page anchors
            return;
        }
        
        // Prevent default navigation for internal links
        e.preventDefault();
        
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        const menuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (menuBtn) menuBtn.classList.remove('active');
        }
        
        // Handle clean URLs
        let fetchUrl = url;
        let hash = '';
        
        // Check if URL contains hash for section navigation
        if (url.includes('#')) {
            const parts = url.split('#');
            fetchUrl = parts[0] || '/';
            hash = parts[1];
            console.log(`URL contains hash: section=${hash}, base=${fetchUrl}`);
        }
        
        if (fetchUrl.startsWith('/') && !fetchUrl.includes('.')) {
            // Handle /index specially to keep as / in the URL
            if (fetchUrl === '/index') {
                fetchUrl = 'index.html';
                console.log('Index page requested, navigating with clean URL');
                navigateTo(fetchUrl, true, `${getBasePath()}/`, hash);
                return;
            }
            // Strip leading slash for the fetch
            fetchUrl = fetchUrl.substring(1) + '.html';
        }
        
        // Prepare display URL with correct base path for GitHub Pages
        let displayUrl = url;
        if (isGitHubPages() && !url.startsWith(getBasePath()) && url.startsWith('/')) {
            displayUrl = getBasePath() + url;
        }
        
        console.log(`Navigating to ${fetchUrl} with display URL ${displayUrl}`);
        // Load the new content
        navigateTo(fetchUrl, true, displayUrl, hash);
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        console.log('Popstate event', e.state);
        if (e.state) {
            // Restore the hash from the state if it exists
            const hash = e.state.hash || '';
            navigateTo(e.state.fetchUrl, false, e.state.cleanUrl, hash);
        }
    });
    
    // Initialize first load
    const currentPath = window.location.pathname;
    console.log(`Current path: ${currentPath}`);
    let fetchUrl = 'index.html';
    let cleanUrl = '/';
    
    // Specifically handle /index to redirect to /
    if (currentPath === '/index') {
        console.log('Redirecting /index to /');
        history.replaceState({}, '', '/');
    } else if (currentPath !== '/' && currentPath !== '') {
        const pathParts = currentPath.split('/').filter(Boolean);
        if (pathParts.length > 0) {
            const lastPart = pathParts[pathParts.length - 1];
            console.log(`Last path part: ${lastPart}`);
            if (lastPart === 'index') {
                // Keep index.html as the root path
                fetchUrl = 'index.html';
                cleanUrl = '/';
                console.log('Index page detected, using root URL');
                if (history.replaceState) {
                    history.replaceState({ fetchUrl, cleanUrl }, '', cleanUrl);
                }
            } else if (lastPart.includes('.html')) {
                fetchUrl = lastPart;
                cleanUrl = '/' + lastPart.replace('.html', '');
                console.log(`HTML page detected, using clean URL: ${cleanUrl}`);
            } else {
                fetchUrl = lastPart + '.html';
                cleanUrl = '/' + lastPart;
                console.log(`Clean URL detected, will fetch: ${fetchUrl}`);
            }
        }
    }
    
    // Update history with initial state
    console.log(`Initial state: ${fetchUrl} with display ${cleanUrl}`);
    window.history.replaceState({ fetchUrl, cleanUrl }, '', cleanUrl);
}

/**
 * Navigate to a page without full reload
 * @param {string} fetchUrl - URL to fetch content from (with .html)
 * @param {boolean} pushState - Whether to push new state to history
 * @param {string} displayUrl - URL to display in browser (clean URL)
 * @param {string} hash - Optional hash fragment to scroll to after loading
 */
async function navigateTo(fetchUrl, pushState = true, displayUrl = null, hash = '') {
    console.log(`Navigation started to ${fetchUrl} (display: ${displayUrl}, hash: ${hash})`);
    try {
        // Start loading indicator
        showLoadingIndicator();
        
        // Handle displaying URL
        if (!displayUrl) {
            displayUrl = getBasePath() + '/' + fetchUrl.replace('.html', '');
            // Special case to prevent /index
            if (displayUrl.endsWith('/index')) {
                displayUrl = displayUrl.replace('/index', '/');
            }
            console.log(`No display URL provided, using: ${displayUrl}`);
        }
        
        // Handle index special case
        if (fetchUrl === 'index.html') {
            displayUrl = getBasePath() + '/';
        }
        
        // Add hash to display URL if provided
        if (hash && !displayUrl.includes('#')) {
            displayUrl = `${displayUrl}#${hash}`;
            console.log(`Added hash to display URL: ${displayUrl}`);
        }
        
        // Fetch the new page content
        console.log(`Fetching content from: ${fetchUrl}`);
        
        // List of paths to try
        const pathsToTry = [];
        
        // Standard relative path
        pathsToTry.push(fetchUrl);
        
        // Absolute path
        pathsToTry.push(`/${fetchUrl}`);
        
        // GitHub Pages specific paths
        if (isGitHubPages()) {
            const basePath = getBasePath();
            pathsToTry.push(`${basePath}/${fetchUrl}`);
            
            // GitHub Pages sometimes requires the .html extension explicitly
            if (!fetchUrl.endsWith('.html')) {
                pathsToTry.push(`${basePath}/${fetchUrl}.html`);
            }
        }
        
        // Try with both relative and absolute paths
        let response = null;
        let successPath = '';
        
        for (const path of pathsToTry) {
            try {
                console.log(`Trying path: ${path}`);
                const pathResponse = await fetch(path);
                if (pathResponse.ok) {
                    response = pathResponse;
                    successPath = path;
                    console.log(`Successful fetch with path: ${path}`);
                    break;
                }
            } catch (error) {
                console.warn(`Fetch failed for path ${path}: ${error.message}`);
            }
        }
        
        if (!response) {
            throw new Error(`Failed to fetch page: ${fetchUrl} - Tried paths: ${pathsToTry.join(', ')}`);
        }
        
        console.log(`Fetch successful with path: ${successPath}, parsing content`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract the content between header and footer
        console.log('Extracting content');
        const content = extractContent(doc);
        
        // Replace the current content
        const contentContainer = document.querySelector('main');
        console.log('Updating page content');
        contentContainer.innerHTML = content;
        
        // Apply any specific classes from the body to main container
        const bodyClasses = doc.body.className;
        if (bodyClasses) {
            // Clear existing page-specific classes
            const currentClasses = contentContainer.className.split(' ');
            currentClasses.forEach(cls => {
                if (cls.includes('page-')) {
                    contentContainer.classList.remove(cls);
                }
            });
            
            // Add new page-specific classes
            bodyClasses.split(' ').forEach(cls => {
                if (cls.trim()) {
                    contentContainer.classList.add(cls);
                }
            });
        }
        
        // Update document title
        document.title = doc.title;
        
        // Update history state
        if (pushState) {
            console.log(`Pushing state: ${displayUrl}`);
            window.history.pushState({ fetchUrl, cleanUrl: displayUrl, hash }, '', displayUrl);
        }
        
        // Run scripts from new content
        console.log('Executing scripts');
        executeScripts(contentContainer);
        
        // Highlight the current page in navigation
        const pageUrl = displayUrl.split('#')[0];
        highlightCurrentPage(pageUrl || '/');
        
        // Handle anchor links if present
        if (hash && hash !== '') {
            console.log(`Scrolling to anchor: #${hash}`);
            setTimeout(() => {
                const element = document.getElementById(hash);
                if (element) {
                    console.log(`Found element: #${hash}, scrolling to it`);
                    element.scrollIntoView({ behavior: 'smooth' });
                } else {
                    console.warn(`Element not found: #${hash}`);
                }
            }, 300);
        } else {
            // Only scroll to top if no hash is present
            console.log('No hash present, scrolling to top');
            window.scrollTo(0, 0);
        }
        
        // Initialize AOS animations if used
        if (window.AOS) {
            console.log('Refreshing AOS animations');
            
            // Get AOS configuration from original page if present
            const aosConfig = { 
                duration: 800, 
                once: true,
                offset: 100,
                delay: 0,
                easing: 'ease'
            };
            
            // First destroy existing AOS
            window.AOS.refreshHard();
            
            // Re-initialize with proper configuration
            setTimeout(() => {
                window.AOS.init(aosConfig);
            }, 50);
        }
        
        // Force browser to recalculate styles
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
        
        console.log('Navigation complete');
    } catch (error) {
        console.error('Navigation error:', error);
        console.error('Stack trace:', error.stack);
        // Fallback to traditional navigation on error
        window.location.href = displayUrl || fetchUrl;
    } finally {
        // Hide loading indicator
        hideLoadingIndicator();
    }
}

/**
 * Extract content between header and footer from a document
 * @param {Document} doc - Document to extract content from
 * @returns {string} - HTML content
 */
function extractContent(doc) {
    const tempDiv = document.createElement('div');
    
    // Extract and apply any page-specific styles
    const styles = doc.querySelectorAll('style, link[rel="stylesheet"]');
    styles.forEach(style => {
        // Skip styles that already exist
        const styleId = style.id || '';
        if (styleId && document.getElementById(styleId)) {
            return;
        }
        
        // Skip common styles that are already in the main page
        if (style.href && (
            style.href.includes('styles.css') || 
            style.href.includes('styles-common.css') ||
            style.href.includes('font-awesome') ||
            style.href.includes('fonts.googleapis.com')
        )) {
            return;
        }
        
        // Add the style to the head
        document.head.appendChild(style.cloneNode(true));
    });
    
    // If the document has a main tag, use that
    const mainContent = doc.querySelector('main');
    if (mainContent) {
        tempDiv.innerHTML = mainContent.innerHTML;
        return tempDiv.innerHTML;
    }
    
    // Otherwise extract content between header and footer
    const header = doc.querySelector('[data-component="header"]');
    const footer = doc.querySelector('[data-component="footer"]');
    
    let content = '';
    if (header && footer) {
        let currentElement = header.nextElementSibling;
        
        while (currentElement && currentElement !== footer) {
            tempDiv.appendChild(currentElement.cloneNode(true));
            currentElement = currentElement.nextElementSibling;
        }
        
        content = tempDiv.innerHTML;
    } else {
        // Fallback to body content
        const body = doc.querySelector('body');
        tempDiv.innerHTML = body.innerHTML;
        
        // Remove header and footer if they exist
        const tempHeader = tempDiv.querySelector('[data-component="header"]');
        const tempFooter = tempDiv.querySelector('[data-component="footer"]');
        
        if (tempHeader) tempHeader.remove();
        if (tempFooter) tempFooter.remove();
        
        content = tempDiv.innerHTML;
    }
    
    return content;
}

/**
 * Execute scripts in the loaded content
 * @param {Element} container - Container with new content
 */
function executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        
        // Copy all attributes from the old script to the new one
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy the content/src
        if (oldScript.src) {
            newScript.src = oldScript.src;
        } else {
            newScript.textContent = oldScript.textContent;
        }
        
        // Replace the old script with the new one
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

/**
 * Highlight current page in navigation
 * @param {string} url - Current URL
 */
function highlightCurrentPage(url) {
    // Convert traditional URLs to clean URLs for matching
    const cleanUrl = url.endsWith('.html') ? url.replace('.html', '') : url;
    const isHome = url === 'index.html' || url === 'index' || url === '' || url === '/';
    
    // For both desktop and mobile navigation
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Remove all active classes first
        link.classList.remove('active');
        
        // Check if this is a match (handling both clean and traditional URLs)
        let isMatch = false;
        
        // Home page special case
        if (isHome && (href === '/' || href === '/index' || href === 'index.html')) {
            isMatch = true;
        } 
        // Clean URL comparison (e.g., /about matches when loading about.html)
        else if (href.startsWith('/') && !href.includes('#') && 
                (('/' + cleanUrl) === href || cleanUrl === href.substring(1))) {
            isMatch = true;
        } 
        // Handle any legacy .html links
        else if (href.endsWith('.html') && url === href) {
            isMatch = true;
        }
        
        // Add active class if matched
        if (isMatch) {
            link.classList.add('active');
        }
        
        // Don't highlight links with fragments (#) for the current page
        if (href.includes('#') && !href.startsWith('#')) {
            // Remove active class from section links within the current page
            const linkPage = href.split('#')[0];
            if ((isHome && (linkPage === '/' || linkPage === '')) || 
                ('/' + cleanUrl === linkPage) || 
                (cleanUrl === linkPage.substring(1))) {
                link.classList.remove('active');
            }
        }
    });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    let loadingIndicator = document.getElementById('spa-loading-indicator');
    
    // Add loading class to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('loading');
    }
    
    if (!loadingIndicator) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'spa-loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="spinner"></div>
        `;
        document.body.appendChild(loadingIndicator);
    }
    
    // Show the indicator
    setTimeout(() => {
        loadingIndicator.style.opacity = '1';
    }, 10);
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('spa-loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.opacity = '0';
    }
    
    // Remove loading class from main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.remove('loading');
    }
} 