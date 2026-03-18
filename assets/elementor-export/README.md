# FROGG Sections - Elementor Export

This folder contains website sections exported for use in WordPress with Elementor Pro.

## Files Included

### Header Section
- **frogg-header-section.json** - Sticky header template with nav menu, logo, and CTA buttons
- **frogg-header-styles.css** - Required CSS for scroll effects and responsive behavior

### Hero Section
- **frogg-hero-section.json** - Hero section template (native widgets)
- **frogg-hero-styles.css** - Optional CSS for hero animations

### About Section
- **frogg-about-section.json** - About section template (native widgets)
- **frogg-about-styles.css** - Optional CSS for about enhancements

### Services Section
- **frogg-services-section.json** - Services/recruitment solutions section with tabs and service cards
- **frogg-services-styles.css** - CSS for tabs styling, card effects, and animations

---

## Import Instructions

### Step 1: Import a JSON Template

1. Open your WordPress page with Elementor
2. Click the **folder icon** (Template Library) in the editor
3. Click the **arrow/upload icon** to Import Templates
4. Select the desired JSON file (e.g., `frogg-hero-section.json`)
5. Click **Insert** to add it to your page
6. Repeat for other sections as needed

### Step 2: Optional CSS Enhancements

For additional visual effects, combine all CSS files:

1. Go to **Appearance > Customize > Additional CSS**
2. Paste the contents of each CSS file
3. Click **Publish**

---

## Widget Types Used

These templates use only native Elementor widgets:

- **Container** - Flexbox layout containers
- **Heading** - Titles, subtitles, labels
- **Text Editor** - Paragraph content
- **Button** - CTA buttons with icons
- **Icon** - Font Awesome icons
- **Counter** - Animated number counters
- **Divider** - Visual separators
- **Image** - Photos and graphics
- **Toggle** - Expandable accordion content
- **Tabs** - Tabbed content panels (Services template)
- **Icon List** - Feature lists with icons (Services template)
- **Nav Menu** - Navigation menu widget (Header template)
- **Site Logo** - Theme logo widget (Header template)

No HTML widgets are used - everything is fully editable in Elementor.

---

## Header Template Setup

The header template requires additional setup:

### 1. Create a Navigation Menu

1. Go to **Appearance > Menus**
2. Create a new menu named `main-menu`
3. Add the following menu items:
   - Home → #home
   - About → #about
   - Services → #services
   - Employers → #employers
   - Candidates → #candidates
   - Testimonials → #testimonials
   - Contact → #contact

### 2. Import as Header Template

1. Go to **Templates > Theme Builder**
2. Click **Add New** and select **Header**
3. Import the `frogg-header-section.json` file
4. Set display conditions to "Entire Site"

### 3. Add Required CSS

Add the contents of `frogg-header-styles.css` to:
- **Appearance > Customize > Additional CSS**, or
- **Elementor > Custom CSS** (if available)

### 4. Add Scroll Behavior JavaScript

Add this code to your theme's JS file or use a plugin like "Insert Headers and Footers":

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.frogg-header');
    const mobileToggle = document.querySelector('.frogg-mobile-toggle');
    const mobileMenu = document.querySelector('.frogg-mobile-menu');
    
    // Scroll behavior
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }
});
```

---

## Services Template Setup

The services section includes interactive tabs and a grid of service cards.

### 1. Import as Section

1. Open your page in Elementor
2. Import `frogg-services-section.json` via the Template Library
3. Insert it below the About section

### 2. Add Required CSS

Add the contents of `frogg-services-styles.css` to:
- **Appearance > Customize > Additional CSS**, or
- **Elementor > Custom CSS**

### 3. Customize Tab Content

The tabs widget includes 4 panels with HTML content. To edit:

1. Click on the Tabs widget
2. Under Content, click on each tab item
3. Modify the tab_content HTML as needed
4. The HTML structure uses `.tab-panel-inner`, `.tab-icon`, and `.tab-text` classes

### 4. Customize Service Cards

Each service card is a container with:
- Icon box with Font Awesome icon
- Title heading
- Description text
- Feature list (Icon List widget)
- Learn More button

Card variants:
- **Default** (white background)
- **Featured** (dark gradient with "Most Popular" badge)
- **Gradient** (blue gradient background)

---

## Requirements

- **Elementor Pro** (for advanced features)
- **Font Awesome** icons (most themes include this, or install the Font Awesome plugin)
- **Google Fonts: Inter** (add via Elementor > Site Settings > Typography or use a Google Fonts plugin)

---

## Customization

### Changing Colors:
Edit the CSS variables at the top of `frogg-hero-styles.css`:
```css
:root {
    --primary-500: #1662ed;  /* Main blue color */
    --primary-700: #1e3a8a;  /* Darker blue for gradient */
}
```

### Changing Text:
Edit the text directly in the HTML widget or JSON file.

### Changing Stats Numbers:
Find and update these values in the HTML:
```html
<span class="stat-number">50</span>
```

---

## Troubleshooting

**Icons not showing?**
- Install Font Awesome plugin or ensure your theme loads Font Awesome
- Use this plugin: https://wordpress.org/plugins/font-awesome/

**Animations not working?**
- Ensure the CSS is properly loaded
- Check browser console for errors

**Layout issues?**
- Make sure the parent section/container is set to Full Width
- Check that there are no conflicting theme styles

---

## Support

For any issues or customizations, refer to the original source files in the main project folder.
