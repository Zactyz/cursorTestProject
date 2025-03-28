# Ciple Website

## Website Structure

The Ciple website is built with HTML, CSS, and JavaScript to create a modern, responsive web experience for users interested in AI-powered Bible discipleship.

### Page Templates

The website previously used PHP templates, but has been converted to static HTML for broader compatibility:

1. The header and footer code has been directly integrated into each page
2. Each page includes the complete navigation structure and footer elements
3. To set the active navigation link for the current page, this JavaScript is used:
   ```html
   <script>
       document.addEventListener('DOMContentLoaded', function() {
           const navLinks = document.querySelectorAll('.nav-links a');
           navLinks.forEach(link => {
               if (link.getAttribute('href') === 'your-page.html') {
                   link.classList.add('active');
               }
           });
       });
   </script>
   ```

### Viewing the Website

Since the website now uses static HTML:
- You can open the HTML files directly in any browser
- No PHP server is required
- All assets are loaded locally from the file system

## Contact Form Setup

The contact form needs to be configured to process submissions. Options include:

1. **For Netlify Hosting:**
   - Configure the form with `data-netlify="true"` and `name="form-name"` attributes
   - Netlify will automatically detect and process the form submissions

2. **Alternative Methods:**
   - For FormSpree: Update the form action to `https://formspree.io/your-email@example.com`
   - For custom backend: Set up an endpoint to receive and process form data

3. **Local Testing:**
   - When testing locally, the form is configured to show a success message after 1.5 seconds
   - This simulates a successful submission without actually sending data

## Setting Up Stripe for Donations

To enable donations on your website with Stripe:

### 1. Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and sign up for an account
2. Complete the registration with your email, name, and password
3. Verify your email address
4. Provide business details including:
   - Business type (non-profit, individual, company)
   - Address and phone number
   - Tax ID (if applicable)
   - Bank account information for receiving funds

> **Note:** Non-profit organizations may be eligible for discounted rates. Contact Stripe support with proof of your 501(c)(3) status.

### 2. Set Up Payment Links

The easiest way to accept donations is with Stripe Payment Links:

1. Log in to your Stripe Dashboard
2. Navigate to Products → Payment links
3. Click "Create payment link"
4. Set up your donation product:
   - Name: "Donation" or "Support Ciple"
   - Pricing: Fixed amounts or allow custom amounts
   - For multiple donation tiers, add different prices (e.g., $25, $50, $100)
5. Customize the checkout page with your branding
6. Create the link to get your payment URL
7. Update your website's "Donate" button with the payment link URL:
   ```html
   <a href="https://buy.stripe.com/YOUR_PAYMENT_LINK" class="primary-button">Donate</a>
   ```

### 3. Setting Up Recurring Donations

To allow recurring donations:

1. In the Stripe Dashboard, go to Products → Payment links
2. When setting up pricing, select "Recurring" instead of "One-time"
3. Choose the billing interval (monthly, yearly)
4. Complete the payment link setup

### 4. Testing Your Donation System

Before going live:

1. Ensure you're in Stripe's test mode (toggle in Dashboard)
2. Use test card numbers to simulate transactions:
   - Success: 4242 4242 4242 4242
   - Requires authentication: 4000 0025 0000 3155
   - Declined: 4000 0000 0000 0002
3. Test the full donation flow
4. Verify confirmation emails
5. Check that donation data is recorded in your Stripe Dashboard
6. Switch to live mode when testing is complete

## Navigation Structure

The navigation includes sections for:
- Home
- Features (dropdown with Bible Studies, Prayer Wall, Daily Encouragement, For Churches, Community)
- Support
- About
- For Churches
- Contact

## File Structure

- `index.html` - Main homepage
- `about.html` - About page
- `church.html` - Church community features
- `contact.html` - Contact form
- `support.html` - Donation and partnership information
- `styles.css` - Main stylesheet
- `js/main.js` - JavaScript functionality
- `images/` - Image directory

## Support Page

The Support page combines donation and partnership information. It includes:
- Donation options
- Impact statistics
- Partnership opportunities
- Testimonials from supporters
- FAQ section

## Making Future Updates

When making future updates:
1. To modify the navigation or footer, you'll need to update each HTML file individually
2. Keep styling consistent by using the existing CSS classes and variables
3. When adding new pages, copy the header and footer structure from existing pages
4. Update all navigation links across pages when adding new sections

## Hosting on GitHub Pages

### 1. Create a GitHub Account

1. Go to [github.com](https://github.com) and sign up
2. Follow the registration process
3. Verify your email address

> **Note:** GitHub offers free accounts that include GitHub Pages hosting. No paid account is needed for basic website hosting.

### 2. Create a Repository

1. Once logged in, click the "+" icon in the top-right corner and select "New repository"
2. Name your repository using this format: `username.github.io` (replace "username" with your GitHub username)
3. Make the repository public
4. Initialize with a README file if starting from scratch
5. Click "Create repository"

> **Tip:** For other repository names, the URL will be `username.github.io/repository-name`.

### 3. Upload Your Website Files

#### Option 1: Upload via GitHub Web Interface
1. Navigate to your repository on GitHub
2. Click "Add file" → "Upload files"
3. Drag and drop your website files or use the file selector
4. Add a commit message
5. Click "Commit changes"

#### Option 2: Clone and Push Using Git (Advanced)
1. Clone the repository to your local machine:
   ```
   git clone https://github.com/username/username.github.io.git
   ```
2. Copy your website files into the cloned directory
3. Add, commit, and push your changes:
   ```
   git add .
   git commit -m "Add website files"
   git push origin main
   ```

Make sure your main HTML file is named `index.html` and is in the root directory.

### 4. Configure GitHub Pages

1. Navigate to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select the branch you want to publish (usually "main")
5. Click "Save"

Your site will be published at `https://username.github.io` or `https://username.github.io/repository-name`.

### 5. Set Up a Custom Domain (Optional)

#### Step 1: Purchase a Domain
First, purchase a domain from a registrar like Namecheap ($8.88/year) or Google Domains ($12/year).

#### Step 2: Configure GitHub Pages
1. In your repository, go to "Settings" → "Pages"
2. Enter your domain name in the "Custom domain" section
3. Click "Save"
4. A CNAME file will be added to your repository

#### Step 3: Configure DNS Records
Log in to your domain registrar and update the DNS records:

For an apex domain (example.com):
```
A  @  185.199.108.153
A  @  185.199.109.153
A  @  185.199.110.153
A  @  185.199.111.153
```

For a www subdomain:
```
CNAME  www  username.github.io
```

> **Important:** DNS changes can take up to 48 hours to propagate.

#### Step 4: Enable HTTPS
1. After DNS propagation, go to repository "Settings" → "Pages"
2. Check the "Enforce HTTPS" option for free SSL/TLS certificates

### 6. Updating Your Website

#### Option 1: Update via GitHub Web Interface
1. Navigate to the file you want to edit
2. Click the pencil icon
3. Make changes
4. Add a commit message
5. Click "Commit changes"

#### Option 2: Update Locally and Push
1. Make changes to local files
2. Commit and push:
   ```
   git add .
   git commit -m "Update website content"
   git push origin main
   ```

GitHub Pages will automatically rebuild your site, with changes appearing in a few minutes.

## Component System for Header & Footer

To reduce repetitive code and make maintenance easier, this project uses a simple component system. This means that elements like the header (navigation) and footer are defined once and reused across multiple pages.

### How it works:

1. **Component Files**: 
   - `_header.html` contains the navigation bar markup
   - `_footer.html` contains the footer markup

2. **Including Components in Pages**:
   Add these elements to any HTML page:
   ```html
   <!-- For the header -->
   <div data-component="header"></div>
   
   <!-- For the footer -->
   <div data-component="footer"></div>
   ```

3. **Component Loading**:
   - Make sure to include `<script src="js/components.js"></script>` before the end of the body tag
   - The components.js script automatically loads the components when the page loads

4. **Benefits**:
   - Make changes to the header or footer in just one place
   - Consistent UI across all pages
   - Reduced file size and easier maintenance

### How to update your pages:

1. Replace the navigation and footer sections with the component placeholders
2. Make sure components.js is included in your script tags
3. Any page-specific highlighting will be handled automatically

### Adding new components:

To create new reusable components:
1. Create a file named `_componentname.html` (starting with underscore)
2. Add your HTML code to this file
3. Include it in your pages with `<div data-component="componentname"></div>`

## CSS Structure

To manage styles efficiently and reduce duplication, this project uses a structured CSS approach:

1. **styles-common.css**: 
   - Contains global styles, variables, common components, and utilities
   - Includes base elements, animations, common layouts, and responsive utilities
   - Should be included in all pages

2. **styles.css**:
   - Contains page-specific styles and components
   - Uses variables defined in styles-common.css

### How to use:

Include both files in your HTML pages:
```html
<link rel="stylesheet" href="styles-common.css">
<link rel="stylesheet" href="styles.css">
```

When adding new styles:
- If the style applies across multiple pages → add to styles-common.css
- If the style is page-specific → add to styles.css

### Benefits:
- Reduced CSS duplication
- Easier maintenance
- Consistent styling across pages
- Faster page load times (browser caching common styles)

## Recent Updates

### Single Page Application (SPA) Functionality
- Added SPA-like navigation to prevent full page reloads when navigating between pages
- The header and footer now stay in place while only the main content changes
- Implemented loading indicator for smoother transitions between pages

### Clean URLs
- Removed .html extensions from URLs for cleaner, more professional appearance
- URLs now follow the pattern example.com/about instead of example.com/about.html
- The home page is now accessible via example.com/ instead of example.com/index.html
- Implemented GitHub Pages compatibility with these clean URLs

### How It Works
The SPA functionality is implemented using:
- Client-side JavaScript to intercept link clicks
- Fetch API to load content without full page reloads
- History API to maintain proper browser history and URL display
- Custom 404.html page to handle URL rewrites on GitHub Pages

When working with the codebase:
1. All internal links should use the clean URL format (e.g., `/about` instead of `about.html`)
2. Wrap page content (between header and footer) in `<main>` tags
3. Include the SPA script: `<script src="js/spa.js"></script>`
