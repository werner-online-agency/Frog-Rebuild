(function () {
    const header = document.getElementById('siteHeader');
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

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
            const isOpen = mobileMenu.classList.toggle('active');
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

    /* ===== Tabs + Accordions ===== */
    (function initTabsAccordions() {
        var tabBtns = document.querySelectorAll('.assist-tab-btn');
        var tabPanels = document.querySelectorAll('.assist-tab-panel');
        if (!tabBtns.length) return;

        // Tab switching
        tabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var tabId = btn.getAttribute('data-tab');

                // Deactivate all tabs
                tabBtns.forEach(function (b) {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                tabPanels.forEach(function (p) { p.classList.remove('active'); });

                // Activate clicked tab
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                var panel = document.getElementById('tab-' + tabId);
                if (panel) panel.classList.add('active');
            });
        });

        // Accordion toggle
        document.querySelectorAll('.assist-accordion-header').forEach(function (header) {
            header.addEventListener('click', function () {
                var item = header.closest('.assist-accordion-item');
                var body = item.querySelector('.assist-accordion-body');
                var isOpen = item.classList.contains('open');

                // Close all in same panel
                var panel = item.closest('.assist-tab-panel');
                if (panel) {
                    panel.querySelectorAll('.assist-accordion-item.open').forEach(function (openItem) {
                        openItem.classList.remove('open');
                        openItem.querySelector('.assist-accordion-header').setAttribute('aria-expanded', 'false');
                        openItem.querySelector('.assist-accordion-body').style.maxHeight = '0';
                    });
                }

                // Toggle clicked
                if (!isOpen) {
                    item.classList.add('open');
                    header.setAttribute('aria-expanded', 'true');
                    body.style.maxHeight = body.scrollHeight + 'px';
                }
            });
        });

        // Set initial max-height for pre-opened items
        document.querySelectorAll('.assist-accordion-item.open .assist-accordion-body').forEach(function (body) {
            body.style.maxHeight = body.scrollHeight + 'px';
        });
    })();

    /* ===== Animated Counters ===== */
    (function initCounters() {
        var counters = document.querySelectorAll('.stat-counter');
        if (!counters.length) return;

        function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

        function formatNumber(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            if (isNaN(target)) return;
            var duration = 2000;
            var start = null;

            function step(timestamp) {
                if (!start) start = timestamp;
                var progress = Math.min((timestamp - start) / duration, 1);
                var value = Math.round(easeOutCubic(progress) * target);
                el.textContent = formatNumber(value) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(function (el) { observer.observe(el); });
    })();

    /* ===== Scroll Reveal ===== */
    (function initScrollReveal() {
        var sections = document.querySelectorAll(
            '.benefits-section, .assist-section, .process-section, .beyond-section, .testimonials-section, .contact-section, .about-cta-banner'
        );
        if (!sections.length) return;

        sections.forEach(function (el) { el.classList.add('reveal-up'); });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        sections.forEach(function (el) { observer.observe(el); });
    })();
})();
