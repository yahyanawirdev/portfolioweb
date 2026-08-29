# Portfolio Project System & Detail Page Workflow Guide

This document is the standard reference and copy-paste template for adding new 3D Architectural Visualization and Applied AI Engineering projects to the website.

---

## 1. System Architecture & Workflow Overview

The portfolio system is designed to be **modular, lightweight, and zero-maintenance**:

1. **Single Source of Truth for Navigation & Socials**:
   - All navbar items, social media buttons (YouTube, LinkedIn, GitHub), and site layout originate from [`index.html`](file:///c:/Users/Yahya/Desktop/Applied%20AI%20Engineer%20website/index.html).
   - When you edit social links on the home page, **every page and project detail page automatically inherits them**.
2. **Decoupled Project Detail Pages**:
   - Project detail pages in the `portfolio/` folder do **not** contain any navbar code, duplicate social buttons, or viewer JavaScript.
   - [`main.js`](file:///c:/Users/Yahya/Desktop/Applied%20AI%20Engineer%20website/main.js) and [`style.css`](file:///c:/Users/Yahya/Desktop/Applied%20AI%20Engineer%20website/style.css) automatically handle:
     - Left floating navbar injection with active button highlight.
     - Dark grey site background and central white card alignment.
     - Smooth internal card scrolling with custom hidden scrollbars.
     - **Interactive Fullscreen Zoom & Pan** (middle mouse button/wheel zoom up to 500%).
     - In-app SPA page transitions without hard page refreshes.

---

## 2. Industry Standard URL & Asset Path Conventions

To ensure zero broken links, perfect SEO, and seamless deployment across any Linux server, Vercel, Netlify, Cloudflare, or GitHub Pages, all files and links **must strictly follow these rules**:

| Rule | ❌ Never Use (Bad / Fragile) | ✅ Always Use (Professional Standard) | Reason |
| :--- | :--- | :--- | :--- |
| **URL Slugs & Filenames** | `Sobha sanctuary (1).html`<br>`siniya marina.html` | `/portfolio/sobha-sanctuary-1.html`<br>`/portfolio/siniya-marina-1.html` | Prevents ugly `%20`, `%28`, `%29` URL encodings and case-sensitivity breakage on Linux servers. |
| **Internal Link Paths** | `data-link="portfolio.html"`<br>`href="../portfolio.html"` | `data-link="/portfolio.html"`<br>`href="/portfolio.html"` | Root-relative paths (`/`) resolve accurately from any nested folder level without relative path bugs. |
| **Image Asset Paths** | `src="public/images/..."`<br>`data-src="../public/images/..."` | `src="/images/..."`<br>`data-src="/images/..."` | In Vite and modern bundlers, `public/` is served directly at the root (`/`). Never include `public/` in HTML paths. |
| **Asset Filenames** | `home background_1.jpg`<br>`project view (1).jpg` | `home-background-1.jpg`<br>`project-view-1.jpg` | Spaces in asset names break image rendering across CDNs and cause build warnings. |

> [!NOTE]
> **Display Titles vs. URLs**:
> You can still use full uppercase, parentheses, and spaces for the visual header on the page (e.g. `<h1>Sobha sanctuary (1)</h1>`). Only the file name and URL link must be kebab-case (`/portfolio/sobha-sanctuary-1.html`).

---

## 3. Step 1: Add a Project Card in `portfolio.html`

In [`portfolio.html`](file:///c:/Users/Yahya/Desktop/Applied%20AI%20Engineer%20website/portfolio.html), locate the project section:
- For 3D Visualization: `#section-3d` (`.portfolio-grid-3d`)
- For AI Engineering: `#section-ai` (`.portfolio-grid-ai`)

Copy and paste the template below:

### Copy-Paste Card Template

```html
<!-- 3D Project Card -->
<div class="project-card" data-link="/portfolio/your-project-name.html">
  <div class="project-img-wrapper">
    <img src="/images/your_thumbnail_image.png" alt="Your Project Title" />
  </div>
  <div class="project-info">
    <h5>Your Project Title</h5>
    <div class="project-footer">
      <p class="project-meta">City, Country | 2026</p>
      <span class="project-link-btn" title="View Details"><i class="fas fa-external-link-alt"></i></span>
    </div>
  </div>
</div>
```

### Key Properties:
- `data-link="/portfolio/your-project-name.html"`: **Must start with `/`** and use clean lowercase kebab-case (e.g. `/portfolio/sobha-central.html`).
- `src="/images/..."`: Path to the thumbnail image served from `public/images/` via root `/images/`.
- `<h5>`: Project title displayed to the user.
- `<p class="project-meta">`: Location / Client / Year.

---

## 4. Step 2: Create the Project Detail Page in `portfolio/`

1. Create a new file in the `portfolio/` directory using clean lowercase hyphens (e.g. `portfolio/luxury-living-room.html`).
2. Copy and paste the boilerplate below into your new file.
3. Edit only the **Header**, **Images**, and **Description**.

### Ready-to-Use Boilerplate Template

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Project Title | Architectural 3D Visualization</title>
  <meta name="description" content="Your Project Title architectural 3D visualization by Muhammad Yahya Nawir." />

  <!-- Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- FontAwesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- Global Stylesheet -->
  <link rel="stylesheet" href="/style.css" />
</head>

<body>

  <!-- Main Content Card (Center Project Detail View) -->
  <main class="portfolio-card scrollable-content resume-card project-detail-card" id="main-content">

    <!-- Top Header Bar -->
    <header class="project-detail-header">
      <div class="header-left">
        <h1 class="project-detail-title">Your Project Title</h1>
      </div>
      <div class="header-right">
        <div class="project-detail-meta">
          <span>Company / Studio</span>
          <span class="meta-separator">|</span>
          <span>Your Role</span>
          <span class="meta-separator">|</span>
          <span>2026</span>
        </div>
        <!-- Close Button returning back to Portfolio Grid -->
        <a href="/portfolio.html" data-link="/portfolio.html" class="project-close-btn" title="Back to Portfolio" aria-label="Back to Portfolio">
          <i class="fas fa-times"></i>
        </a>
      </div>
    </header>

    <!-- Stacked Images Showcase Option A: Standard 2-Image Stacked Layout -->
    <div class="project-images-showcase">
      <!-- 1st Image View -->
      <div class="project-img-slot" data-src="/images/project_image_view1.png" data-alt="Your Project Title - View 1">
        <img src="/images/project_image_view1.png" alt="Your Project Title - View 1" />
        <div class="zoom-hint-badge">
          <i class="fas fa-search-plus"></i> Click to zoom
        </div>
      </div>

      <!-- 2nd Image View -->
      <div class="project-img-slot" data-src="/images/project_image_view2.jpg" data-alt="Your Project Title - View 2">
        <img src="/images/project_image_view2.jpg" alt="Your Project Title - View 2" />
        <div class="zoom-hint-badge">
          <i class="fas fa-search-plus"></i> Click to zoom
        </div>
      </div>
    </div>

    <!-- OR Option B: 3-Image Layout (Equal 50/50 Bottom Split) -->
    <!--
    <div class="project-images-showcase">
      <div class="project-img-slot" data-src="/images/project_view1.jpg" data-alt="Hero View">
        <img src="/images/project_view1.jpg" alt="Hero View" />
        <div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div>
      </div>
      <div class="project-images-grid-2col">
        <div class="project-img-slot" data-src="/images/project_view2.jpg" data-alt="Sub View Left">
          <img src="/images/project_view2.jpg" alt="Sub View Left" />
          <div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div>
        </div>
        <div class="project-img-slot" data-src="/images/project_view3.jpg" data-alt="Sub View Right">
          <img src="/images/project_view3.jpg" alt="Sub View Right" />
          <div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div>
        </div>
      </div>
    </div>
    -->

    <!-- OR Option C: 3-Image Asymmetric Layout (Wider Left ~64% + Right ~36% via .project-images-grid-wide-left) -->
    <!--
    <div class="project-images-showcase">
      <div class="project-img-slot" data-src="/images/project_view1.jpg" data-alt="Hero View">
        <img src="/images/project_view1.jpg" alt="Hero View" />
        <div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div>
      </div>
      <div class="project-images-grid-wide-left">
        <div class="project-img-slot" data-src="/images/project_view2.jpg" data-alt="Wide Arrival View">
          <img src="/images/project_view2.jpg" alt="Wide Arrival View" />
          <div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div>
        </div>
        <div class="project-img-slot" data-src="/images/project_view3.jpg" data-alt="Vertical Tower View">
          <img src="/images/project_view3.jpg" alt="Vertical Tower View" />
          <div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div>
        </div>
      </div>
    </div>
    -->

    <!-- OR Option D: 7-Image Layout (3 Rows: Row 1 = 2 images, Row 2 = 2 images, Row 3 = 3 images) -->
    <!--
    <div class="project-images-showcase">
      <div class="project-images-grid-2col">
        <div class="project-img-slot" data-src="/images/view1.jpg" data-alt="View 1"><img src="/images/view1.jpg" alt="View 1" /><div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div></div>
        <div class="project-img-slot" data-src="/images/view2.jpg" data-alt="View 2"><img src="/images/view2.jpg" alt="View 2" /><div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div></div>
      </div>
      <div class="project-images-grid-2col">
        <div class="project-img-slot" data-src="/images/view3.jpg" data-alt="View 3"><img src="/images/view3.jpg" alt="View 3" /><div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div></div>
        <div class="project-img-slot" data-src="/images/view4.jpg" data-alt="View 4"><img src="/images/view4.jpg" alt="View 4" /><div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div></div>
      </div>
      <div class="project-images-grid-3col">
        <div class="project-img-slot" data-src="/images/view5.jpg" data-alt="View 5"><img src="/images/view5.jpg" alt="View 5" /><div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div></div>
        <div class="project-img-slot" data-src="/images/view6.jpg" data-alt="View 6"><img src="/images/view6.jpg" alt="View 6" /><div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div></div>
        <div class="project-img-slot" data-src="/images/view7.jpg" data-alt="View 7"><img src="/images/view7.jpg" alt="View 7" /><div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div></div>
      </div>
    </div>
    -->

    <!-- OR Option E: 4-Image 2x2 Quad Layout (2 Rows of 2 Images via .project-images-grid-2x2) -->
    <!--
    <div class="project-images-showcase">
      <div class="project-images-grid-2x2">
        <div class="project-img-slot" data-src="/images/view1.png" data-alt="View 1"><img src="/images/view1.png" alt="View 1" /><div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div></div>
        <div class="project-img-slot" data-src="/images/view2.png" data-alt="View 2"><img src="/images/view2.png" alt="View 2" /><div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div></div>
        <div class="project-img-slot" data-src="/images/view3.jpg" data-alt="View 3"><img src="/images/view3.jpg" alt="View 3" /><div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div></div>
        <div class="project-img-slot" data-src="/images/view4.jpg" data-alt="View 4"><img src="/images/view4.jpg" alt="View 4" /><div class="zoom-hint-badge"><i class="fas fa-search-plus"></i> Click to zoom</div></div>
      </div>
    </div>
    -->

    <!-- Bottom Project Description -->
    <footer class="project-detail-footer">
      <p class="project-detail-desc">
        Write your architectural design rationale, lighting composition, material highlights, and visualization workflow description here. This section is centered at the bottom of the presentation sheet and is accessible via smooth scrolling.
      </p>
    </footer>

  </main>

  <!-- Global Application Logic & Auto-Shell Controller -->
  <script type="module" src="/main.js"></script>

</body>

</html>
```

---

## 5. How the Auto-Features Work

| Feature | How It Works | Developer Action Required |
| :--- | :--- | :--- |
| **Left Floating Navbar** | Automatically injected by `main.js` from `index.html` if missing. | **None** (Do not add `<nav>` to project files). |
| **Social Media Sync** | Dynamically pulled from `index.html`. Edits to YouTube, LinkedIn, or GitHub automatically sync. | **None** (Edit once in `index.html`). |
| **Fullscreen Image Viewer** | Delegated click handler on `.project-img-slot` opens high-res modal over frozen dark blur backdrop. | **None** (Just add class `.project-img-slot`). |
| **500% Middle Cursor Zoom** | Middle mouse cursor or wheel scroll zooms into the exact pointer position up to 500%. Drag to pan. Double-click to reset. | **None** (Built into `main.js`). |
| **Router Navigation** | Clicking `[data-link]` smoothly swaps `<main>` content without reloading the page shell. | **None** (Add `data-link` to links/cards). |
| **Direct Reload Support** | If a user opens `http://localhost:5173/portfolio/your-project.html` directly, the shell and styles load cleanly. | **None** (Handled automatically). |

---

## 6. Quick 2-Minute Checklist for Next Project

- [ ] **1. Save image assets**: Place your high-resolution render views inside [`public/images/`](file:///c:/Users/Yahya/Desktop/Applied%20AI%20Engineer%20website/public/images).
- [ ] **2. Create detail page**: Create `portfolio/[project-name].html` using the boilerplate in Section 4 above.
- [ ] **3. Update text & image paths**:
  - Set project title, company, role, and year in the header.
  - Point `data-src` and `img src` to `/images/[your_images]`.
  - Add your description paragraph in `<p class="project-detail-desc">`.
- [ ] **4. Add preview card**: Add the `.project-card` with `data-link="/portfolio/[project-name].html"` in [`portfolio.html`](file:///c:/Users/Yahya/Desktop/Applied%20AI%20Engineer%20website/portfolio.html).
- [ ] **5. Test**: Click the card in browser. Test image click zoom and the `✕` close button. Done!
