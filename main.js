let slideshowIntervalId = null;
const pageCache = {};

function initSlideshow() {
  const bgLayers = document.querySelectorAll('.bg-layer');
  let currentIndex = 0;
  
  // Clear any existing interval to prevent duplicates
  if (slideshowIntervalId) {
    clearInterval(slideshowIntervalId);
  }
  
  if (bgLayers.length > 1) {
    slideshowIntervalId = setInterval(() => {
      // Remove active class from current
      bgLayers[currentIndex].classList.remove('active');
      
      // Calculate next index
      currentIndex = (currentIndex + 1) % bgLayers.length;
      
      // Add active class to next
      bgLayers[currentIndex].classList.add('active');
    }, 5000);
  }
}

function initAnimations() {
  const revealElements = document.querySelectorAll('.reveal-anim');
  revealElements.forEach((el) => {
    // Force reflow
    void el.offsetWidth;
    el.style.animationPlayState = 'running';
  });
}

function initTypewriter() {
  const typewriters = Array.from(document.querySelectorAll('.typewriter-text'));
  if (typewriters.length === 0) return;
  
  if (window.typewriterGlobalTimeout) clearTimeout(window.typewriterGlobalTimeout);

  typewriters.forEach(el => {
    if (!el.getAttribute('data-text')) {
      el.setAttribute('data-text', el.getAttribute('data-text') || el.innerText);
    }
    el.innerText = '';
    
    let cursor = el.nextElementSibling;
    if (!cursor || !cursor.classList.contains('typewriter-cursor')) {
      cursor = document.createElement('span');
      cursor.classList.add('typewriter-cursor');
      cursor.style.display = 'none';
      el.parentNode.insertBefore(cursor, el.nextSibling);
    } else {
      cursor.style.display = 'none';
    }
  });

  let currentLineIndex = 0;
  let isDeleting = false;
  let charIndex = 0;

  function getHighlightedCode(originalText, charIndex) {
    const fullText = `print("${originalText}")`;
    const currentStr = fullText.substring(0, charIndex);
    
    let html = '';
    if (charIndex > 0) {
      html += `<span class="py-func py-font">${currentStr.substring(0, 5)}</span>`;
    }
    if (charIndex > 5) {
      html += `<span class="py-paren py-font">(</span>`;
    }
    if (charIndex > 6) {
      const endStrIdx = Math.min(charIndex, fullText.length - 1);
      const strPart = currentStr.substring(6, endStrIdx);
      if (strPart) {
        html += `<span class="py-string py-font">${strPart}</span>`;
      }
    }
    if (charIndex === fullText.length) {
      html += `<span class="py-paren py-font">)</span>`;
    }
    return html;
  }

  function typeSequence() {
    if (currentLineIndex >= typewriters.length && !isDeleting) {
      isDeleting = true;
      currentLineIndex = typewriters.length - 1;
      charIndex = typewriters[currentLineIndex].getAttribute('data-text').length;
      window.typewriterGlobalTimeout = setTimeout(typeSequence, 3000);
      return;
    }

    if (currentLineIndex < 0 && isDeleting) {
      isDeleting = false;
      currentLineIndex = 0;
      charIndex = 0;
      window.typewriterGlobalTimeout = setTimeout(typeSequence, 500);
      return;
    }

    const el = typewriters[currentLineIndex];
    const originalText = el.getAttribute('data-text');
    const fullCodeText = `print("${originalText}")`;

    typewriters.forEach((otherEl, idx) => {
      const c = otherEl.nextElementSibling;
      if (c) c.style.display = (idx === currentLineIndex) ? 'inline-block' : 'none';
    });

    if (!isDeleting) {
      if (charIndex <= fullCodeText.length) {
        el.innerHTML = getHighlightedCode(originalText, charIndex);
        charIndex++;
        const delay = (charIndex > fullCodeText.length) ? 1000 : (30 + Math.random() * 40);
        window.typewriterGlobalTimeout = setTimeout(typeSequence, delay);
      } else if (charIndex === fullCodeText.length + 1) {
        // Execute python code!
        el.innerText = originalText;
        charIndex++;
        window.typewriterGlobalTimeout = setTimeout(typeSequence, 300);
      } else {
        currentLineIndex++;
        charIndex = 0;
        window.typewriterGlobalTimeout = setTimeout(typeSequence, 150);
      }
    } else {
      if (charIndex >= 0) {
        el.innerText = originalText.substring(0, charIndex);
        charIndex--;
        window.typewriterGlobalTimeout = setTimeout(typeSequence, 20);
      } else {
        currentLineIndex--;
        if (currentLineIndex >= 0) {
          charIndex = typewriters[currentLineIndex].getAttribute('data-text').length;
        }
        window.typewriterGlobalTimeout = setTimeout(typeSequence, 100);
      }
    }
  }

  typeSequence();
}

function resolvePageUrl(rawUrl) {
  if (!rawUrl) return '/index.html';
  try {
    const parsed = new URL(rawUrl, window.location.origin);
    let p = parsed.pathname;
    if (p === '/' || p === '') p = '/index.html';
    return p;
  } catch (e) {
    return rawUrl;
  }
}

function updateNavActiveState(url) {
  const targetPath = resolvePageUrl(url);
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    const raw = btn.getAttribute('data-link');
    if (!raw) return;
    const btnPath = resolvePageUrl(raw);
    if (btnPath === targetPath || 
        (targetPath.includes('portfolio') && btnPath.includes('portfolio')) ||
        (targetPath.includes('blog') && btnPath.includes('blog'))) {
      btn.classList.add('active-nav');
    } else {
      btn.classList.remove('active-nav');
    }
  });
}

// --- Global Social Links Sync (using index.html as single source of truth) ---
function extractSocialButtons(doc) {
  const btns = doc.querySelectorAll('#sidebar-nav .social-btn');
  if (!btns || btns.length === 0) return null;
  const list = [];
  btns.forEach(btn => {
    const typeClass = Array.from(btn.classList).find(c => c !== 'nav-btn' && c !== 'social-btn') || '';
    list.push({
      type: typeClass,
      className: btn.className,
      ariaLabel: btn.getAttribute('aria-label') || '',
      tooltip: btn.getAttribute('data-tooltip') || '',
      onclick: btn.getAttribute('onclick') || '',
      html: btn.innerHTML
    });
  });
  return list;
}

function applySocialButtons(socialList) {
  if (!socialList || !Array.isArray(socialList) || socialList.length === 0) return;
  const nav = document.querySelector('#sidebar-nav');
  if (!nav) return;

  socialList.forEach(item => {
    let target = item.type ? nav.querySelector(`.social-btn.${item.type}`) : null;
    if (target) {
      if (item.onclick) {
        target.setAttribute('onclick', item.onclick);
        try {
          target.onclick = new Function('event', item.onclick);
        } catch (e) {
          console.error('Error binding social button onclick:', e);
        }
      }
      if (item.ariaLabel) target.setAttribute('aria-label', item.ariaLabel);
      if (item.tooltip) target.setAttribute('data-tooltip', item.tooltip);
      if (item.className) target.className = item.className;
      if (item.html) target.innerHTML = item.html;
    }
  });
}

async function syncSocialLinksFromIndex() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const isIndex = (currentPath === '' || currentPath === 'index.html');

  if (isIndex) {
    const data = extractSocialButtons(document);
    if (data) {
      try {
        localStorage.setItem('site_social_buttons_data', JSON.stringify(data));
      } catch (e) {}
    }
  } else {
    // 1. Immediately apply from cache if available
    try {
      const cached = localStorage.getItem('site_social_buttons_data');
      if (cached) {
        applySocialButtons(JSON.parse(cached));
      }
    } catch (e) {}

    // 2. Fetch latest index.html to ensure live updates even if edited externally
    if (window.location.protocol !== 'file:') {
      try {
        const rootPrefix = window.location.pathname.includes('/portfolio/') ? '../' : '';
        const res = await fetch(rootPrefix + 'index.html?t=' + Date.now());
        if (res.ok) {
          const text = await res.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'text/html');
          const freshData = extractSocialButtons(doc);
          if (freshData) {
            applySocialButtons(freshData);
            try {
              localStorage.setItem('site_social_buttons_data', JSON.stringify(freshData));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.debug('Failed to sync social links from index.html:', err);
      }
    }
  }
}

// --- Global Shell & Navbar Auto-Injection for Project Detail Pages ---
async function ensureGlobalNavbar() {
  let nav = document.getElementById('sidebar-nav');
  const isSubfolder = window.location.pathname.includes('/portfolio/') || window.location.pathname.includes('/blog/');
  const rootPrefix = isSubfolder ? '../' : '';

  if (!nav) {
    try {
      let html = pageCache['index.html'];
      if (!html) {
        const res = await fetch(rootPrefix + 'index.html?t=' + Date.now());
        html = await res.text();
      }
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const srcNav = doc.getElementById('sidebar-nav');
      if (srcNav) {
        nav = srcNav.cloneNode(true);
        if (isSubfolder) {
          // Adjust links for subfolder pages
          nav.querySelectorAll('[data-link]').forEach(btn => {
            const link = btn.getAttribute('data-link');
            if (link && !link.startsWith('http') && !link.startsWith('../')) {
              btn.setAttribute('data-link', '../' + link);
            }
          });
        }
        document.body.prepend(nav);
      }
    } catch (err) {
      console.warn('Could not inject global navbar:', err);
    }
  }

  // Ensure correct active button highlighting
  const currentPath = window.location.pathname;
  if (nav) {
    nav.querySelectorAll('.nav-btn').forEach(btn => {
      const link = btn.getAttribute('data-link') || '';
      if (currentPath.includes('portfolio') && link.includes('portfolio.html')) {
        btn.classList.add('active-nav');
      } else if (currentPath.includes('blog') && link.includes('blog.html')) {
        btn.classList.add('active-nav');
      } else if (!currentPath.includes('portfolio') && !currentPath.includes('blog') && link.includes(currentPath.split('/').pop() || 'index.html')) {
        btn.classList.add('active-nav');
      } else {
        btn.classList.remove('active-nav');
      }
    });
  }
}

// --- Universal Interactive Image Viewer (500% Middle Cursor Zoom & Pan) ---
let globalViewerController = null;

function ensureInteractiveModal() {
  if (globalViewerController) return globalViewerController;

  let modal = document.getElementById('fullscreen-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'fullscreen-modal';
    modal.className = 'fullscreen-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Interactive image viewer');
    modal.innerHTML = `
      <button id="modal-close-btn" class="modal-close-btn" title="Close Fullscreen (Esc)" aria-label="Close Fullscreen">
        <i class="fas fa-times"></i>
      </button>
      <div id="modal-viewport" class="modal-viewport">
        <img id="modal-img" class="modal-img" src="" alt="Fullscreen visualization" draggable="false" />
      </div>
      <div class="zoom-toolbar">
        <button id="btn-zoom-out" class="zoom-btn" title="Zoom out (Middle wheel down)"><i class="fas fa-minus"></i></button>
        <div id="zoom-readout" class="zoom-readout" title="Click to reset (100%)">100%</div>
        <button id="btn-zoom-in" class="zoom-btn" title="Zoom in (Middle wheel up)"><i class="fas fa-plus"></i></button>
        <span class="zoom-help-text">Scroll middle cursor to zoom up to 500% &bull; Drag to pan</span>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modalImg = document.getElementById('modal-img');
  const modalViewport = document.getElementById('modal-viewport');
  const closeBtn = document.getElementById('modal-close-btn');
  const zoomReadout = document.getElementById('zoom-readout');
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');

  let scale = 1.0;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let initialPanX = 0;
  let initialPanY = 0;

  const MIN_SCALE = 1.0;
  const MAX_SCALE = 5.0; // 500% maximum

  function applyTransform() {
    modalImg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    zoomReadout.textContent = `${Math.round(scale * 100)}%`;
    if (scale > 1.0) {
      modalViewport.style.cursor = isDragging ? 'grabbing' : 'grab';
    } else {
      modalViewport.style.cursor = 'default';
    }
  }

  function resetTransform() {
    scale = 1.0;
    panX = 0;
    panY = 0;
    applyTransform();
  }

  function openModal(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt || 'Visualization view';
    resetTransform();
    modal.classList.add('active');
  }

  function closeModal() {
    modal.classList.remove('active');
    resetTransform();
  }

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  modalViewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = modalViewport.getBoundingClientRect();
    const mouseX = e.clientX - (rect.left + rect.width / 2);
    const mouseY = e.clientY - (rect.top + rect.height / 2);

    const oldScale = scale;
    let newScale;
    if (e.deltaY < 0) {
      newScale = Math.min(MAX_SCALE, oldScale * 1.25);
    } else {
      newScale = Math.max(MIN_SCALE, oldScale / 1.25);
    }

    if (newScale !== oldScale) {
      panX = mouseX - (mouseX - panX) * (newScale / oldScale);
      panY = mouseY - (mouseY - panY) * (newScale / oldScale);
      scale = newScale;
      if (scale <= 1.0) { panX = 0; panY = 0; }
      applyTransform();
    }
  }, { passive: false });

  modalViewport.addEventListener('mousedown', (e) => {
    if (scale > 1.0 && (e.button === 0 || e.button === 1)) {
      e.preventDefault();
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      initialPanX = panX;
      initialPanY = panY;
      modalViewport.classList.add('dragging');
    } else if (e.target === modalViewport && e.button === 0) {
      closeModal();
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    panX = initialPanX + (e.clientX - dragStartX);
    panY = initialPanY + (e.clientY - dragStartY);
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      modalViewport.classList.remove('dragging');
      applyTransform();
    }
  });

  btnZoomIn.addEventListener('click', (e) => {
    e.stopPropagation();
    scale = Math.min(MAX_SCALE, scale * 1.3);
    applyTransform();
  });

  btnZoomOut.addEventListener('click', (e) => {
    e.stopPropagation();
    scale = Math.max(MIN_SCALE, scale / 1.3);
    if (scale <= 1.0) { panX = 0; panY = 0; }
    applyTransform();
  });

  zoomReadout.addEventListener('click', (e) => {
    e.stopPropagation();
    resetTransform();
  });

  modalViewport.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    if (scale > 1.1) {
      resetTransform();
    } else {
      const rect = modalViewport.getBoundingClientRect();
      const mouseX = e.clientX - (rect.left + rect.width / 2);
      const mouseY = e.clientY - (rect.top + rect.height / 2);
      scale = 2.5;
      panX = -mouseX * 1.5;
      panY = -mouseY * 1.5;
      applyTransform();
    }
  });

  globalViewerController = { openModal, closeModal };
  return globalViewerController;
}

// Global Delegated Click Listener for All Project Showcase Images
document.addEventListener('click', (e) => {
  const slot = e.target.closest('.project-img-slot, .showcase-image-slot');
  if (slot) {
    e.preventDefault();
    e.stopPropagation();
    const img = slot.querySelector('img');
    const src = slot.getAttribute('data-src') || (img ? img.src : '');
    const alt = slot.getAttribute('data-alt') || (img ? img.alt : '');
    if (src) {
      const viewer = ensureInteractiveModal();
      viewer.openModal(src, alt);
    }
  }
});

function initInteractiveViewer() {
  ensureInteractiveModal();
}

async function loadPage(url) {
  try {
    let text;
    if (pageCache[url]) {
      text = pageCache[url];
    } else {
      const response = await fetch(url);
      text = await response.text();
      pageCache[url] = text;
    }
    
    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    
    // If navigating to home, refresh social data cache from doc
    if (url.includes('index.html') || url === './' || url === '/') {
      const freshData = extractSocialButtons(doc);
      if (freshData) {
        applySocialButtons(freshData);
        try {
          localStorage.setItem('site_social_buttons_data', JSON.stringify(freshData));
        } catch (e) {}
      }
    }

    // Get the new main content
    const newMain = doc.querySelector('main');
    const currentMain = document.querySelector('main');
    
    if (newMain && currentMain) {
      // Replace the content
      currentMain.replaceWith(newMain);
      
      // Update Title
      document.title = doc.title;
      
      // Update nav active state
      updateNavActiveState(url);
      
      // Re-initialize scripts
      initSlideshow();
      initAnimations();
      initTypewriter();
      initInteractiveViewer();
      
      // Trigger enter animation
      newMain.classList.add('page-transition-enter');
      setTimeout(() => {
        newMain.classList.remove('page-transition-enter');
      }, 250);
    }
  } catch (error) {
    console.error('Error loading page:', error);
    // Fallback to normal navigation
    window.location.href = url;
  }
}

if (document.readyState !== 'loading') {
  ensureGlobalNavbar();
  syncSocialLinksFromIndex();
  initInteractiveViewer();
}

document.addEventListener('DOMContentLoaded', () => {
  ensureGlobalNavbar();
  syncSocialLinksFromIndex();
  initSlideshow();
  initAnimations();
  initTypewriter();
  initInteractiveViewer();
  
  // Initialize nav state based on current URL
  const initialPath = window.location.pathname.split('/').pop() || 'index.html';
  updateNavActiveState(initialPath);
  
  // Trigger initial enter animation
  const mainEl = document.querySelector('main');
  if (mainEl) {
    mainEl.classList.add('page-transition-enter');
    setTimeout(() => {
      mainEl.classList.remove('page-transition-enter');
    }, 250);
  }
  
  // Pre-fetch all pages for instant loading (skips local file:// to avoid CORS errors)
  if (window.location.protocol !== 'file:') {
    document.querySelectorAll('.nav-btn[data-link]').forEach(btn => {
      const url = btn.getAttribute('data-link');
      if (url && url !== initialPath) {
        fetch(url)
          .then(res => res.text())
          .then(text => { pageCache[url] = text; })
          .catch(() => {});
      }
    });
  }
  
  // Set up router links for instant response
  function handleNavClick(e) {
    const linkBtn = e.target.closest('[data-link]');
    if (linkBtn) {
      e.preventDefault();
      const rawUrl = linkBtn.getAttribute('data-link');
      const targetPath = resolvePageUrl(rawUrl);
      const currentPath = resolvePageUrl(window.location.pathname);
      
      // Only load if it's different from current
      if (targetPath !== currentPath) {
        const mainEl = document.querySelector('main');
        if (mainEl) {
          mainEl.classList.add('page-transition-exit');
          setTimeout(() => {
            if (window.location.protocol === 'file:') {
              window.location.href = rawUrl;
            } else {
              window.history.pushState({path: targetPath}, '', targetPath);
              loadPage(targetPath);
            }
          }, 250);
        } else {
          window.history.pushState({path: targetPath}, '', targetPath);
          loadPage(targetPath);
        }
      }
    }
  }

  document.body.addEventListener('click', handleNavClick);
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    const url = e.state?.path || 'index.html';
    loadPage(url);
  });
});

// Portfolio Filter Logic using Event Delegation
document.addEventListener('click', (e) => {
  const filterBtn = e.target.closest('.filter-btn');
  if (filterBtn) {
    const filterValue = filterBtn.getAttribute('data-filter');
    
    // Update active class on buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active-filter');
    });
    filterBtn.classList.add('active-filter');
    
    // Show/Hide sections
    const aiSection = document.getElementById('section-ai');
    const tdSection = document.getElementById('section-3d');
    
    if (aiSection && tdSection) {
      if (filterValue === 'all') {
        aiSection.classList.remove('hidden');
        tdSection.classList.remove('hidden');
      } else if (filterValue === 'ai') {
        aiSection.classList.remove('hidden');
        tdSection.classList.add('hidden');
      } else if (filterValue === '3d') {
        aiSection.classList.add('hidden');
        tdSection.classList.remove('hidden');
      }
    }
  }
});

// 3D Portfolio "Show More" Row-by-Row Reveal Logic
document.addEventListener('click', (e) => {
  const showMore3dBtn = e.target.closest('#show-more-3d-btn, .show-more-3d-btn');
  if (showMore3dBtn) {
    e.preventDefault();
    const grid = document.querySelector('.portfolio-grid-3d');
    if (!grid) return;

    // In .portfolio-grid-3d (3 columns), 1 row = 3 cards
    const CARDS_PER_ROW = 3;
    const hiddenCards = Array.from(grid.querySelectorAll('.project-card.project-card-hidden'));
    const toReveal = hiddenCards.slice(0, CARDS_PER_ROW);

    toReveal.forEach(card => {
      card.classList.remove('project-card-hidden');
      card.classList.add('card-revealed');
    });

    // Check if any hidden cards remain
    const remainingHidden = grid.querySelectorAll('.project-card.project-card-hidden');
    if (remainingHidden.length === 0) {
      const wrapper = showMore3dBtn.closest('.show-more-wrapper');
      if (wrapper) {
        wrapper.style.display = 'none';
      } else {
        showMore3dBtn.style.display = 'none';
      }
    }
  }
});

