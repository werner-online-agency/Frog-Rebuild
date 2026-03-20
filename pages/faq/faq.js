(function () {
    /* ================================================
       HEADER & MOBILE MENU
       ================================================ */
    var header = document.getElementById('siteHeader');
    var mobileToggle = document.getElementById('mobileToggle');
    var mobileMenu = document.getElementById('mobileMenu');

    function updateHeaderState() {
        if (!header) return;
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    function closeMobileMenu() {
        if (!mobileMenu || !mobileToggle) return;
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    }

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function () {
            var isOpen = mobileMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active', isOpen);
            mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.classList.toggle('no-scroll', isOpen);
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeMobileMenu();
        });
    }

    window.addEventListener('scroll', updateHeaderState, { passive: true });
    window.addEventListener('load', updateHeaderState);
    updateHeaderState();

    /* ================================================
       SCROLL REVEAL  (IntersectionObserver)
       ================================================ */
    var revealSections = document.querySelectorAll('.reveal-section');
    if (revealSections.length && 'IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealSections.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealSections.forEach(function (el) { el.classList.add('revealed'); });
    }

    /* ================================================
       FAQ ACCORDION  (improved smooth animation)
       ================================================ */
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        var btn = item.querySelector('.faq-question');
        if (!btn) return;

        btn.addEventListener('click', function () {
            var isOpen = item.classList.contains('active');

            // Close all items in the same category
            var category = item.closest('.faq-category');
            if (category) {
                category.querySelectorAll('.faq-item.active').forEach(function (open) {
                    if (open !== item) {
                        open.classList.remove('active');
                        open.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    }
                });
            }

            // Toggle clicked item
            if (isOpen) {
                item.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ================================================
       CATEGORY FILTER TABS
       ================================================ */
    var tabs = document.querySelectorAll('.faq-tab');
    var categories = document.querySelectorAll('.faq-category[data-category]');

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var cat = tab.getAttribute('data-category');

            // Update active tab
            tabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');

            // Show/hide categories
            categories.forEach(function (el) {
                if (cat === 'all' || el.getAttribute('data-category') === cat) {
                    el.style.display = '';
                } else {
                    el.style.display = 'none';
                }
            });

            // Clear search when switching tabs
            if (searchInput) {
                searchInput.value = '';
            }
            if (noResults) {
                noResults.style.display = 'none';
            }
            // Reset any hidden items within visible categories
            faqItems.forEach(function (item) { item.style.display = ''; });
        });
    });

    /* ================================================
       SEARCH FUNCTIONALITY
       ================================================ */
    var searchInput = document.getElementById('faqSearch');
    var noResults = document.getElementById('faqNoResults');
    var clearBtn = document.getElementById('clearSearch');
    var debounceTimer = null;

    function showAllItems() {
        faqItems.forEach(function (item) { item.style.display = ''; });
        categories.forEach(function (cat) { cat.style.display = ''; });
    }

    function filterFAQ(query) {
        if (!query || query.trim().length < 2) {
            showAllItems();
            noResults.style.display = 'none';
            return;
        }

        var q = query.toLowerCase().trim();
        var visibleCount = 0;

        // Reset category tab to "All" while searching
        tabs.forEach(function (t) {
            t.classList.toggle('active', t.getAttribute('data-category') === 'all');
        });
        categories.forEach(function (cat) { cat.style.display = ''; });

        faqItems.forEach(function (item) {
            var questionText = (item.querySelector('.faq-q-text') || {}).textContent || '';
            var answerText = (item.querySelector('.faq-answer-inner') || {}).textContent || '';
            var combined = (questionText + ' ' + answerText).toLowerCase();

            if (combined.indexOf(q) !== -1) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Hide categories where all items are hidden
        categories.forEach(function (cat) {
            var visibleItems = cat.querySelectorAll('.faq-item');
            var allHidden = true;
            visibleItems.forEach(function (it) {
                if (it.style.display !== 'none') allHidden = false;
            });
            cat.style.display = allHidden ? 'none' : '';
        });

        noResults.style.display = visibleCount === 0 ? '' : 'none';
    }

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function () {
                filterFAQ(searchInput.value);
            }, 200);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            if (searchInput) searchInput.value = '';
            showAllItems();
            noResults.style.display = 'none';
            if (searchInput) searchInput.focus();
        });
    }

    // Keyboard shortcut: Ctrl+K to focus search
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) searchInput.focus();
        }
    });
})();
