/* Resources page — header scroll-state + mobile menu + library interactions */
(function () {
    const header = document.getElementById('siteHeader');
    const toggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    /* Scroll state */
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 30);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile menu */
    toggle.addEventListener('click', function () {
        const open = mobileMenu.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });

    /* ===== Library: Scroll-reveal animations ===== */
    var revealEls = document.querySelectorAll('[data-reveal]');
    if (revealEls.length && 'IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var delay = el.dataset.revealDelay || 0;
                    setTimeout(function () {
                        el.classList.add('revealed');
                    }, delay);
                    revealObserver.unobserve(el);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el, i) {
            /* Stagger cards */
            if (el.classList.contains('dark-article-card')) {
                el.dataset.revealDelay = i * 80;
            }
            revealObserver.observe(el);
        });
    }

    /* ===== Library: Filter tabs ===== */
    var filterBtns = document.querySelectorAll('.library-filter-btn');
    var articleCards = document.querySelectorAll('.dark-article-card');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = btn.dataset.filter;

            /* Update active state */
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            /* Animate out, then filter, then animate in */
            articleCards.forEach(function (card) {
                card.classList.add('filtering-out');
                card.classList.remove('filtering-in');
            });

            setTimeout(function () {
                articleCards.forEach(function (card) {
                    var category = card.dataset.category;
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden-card');
                    } else {
                        card.classList.add('hidden-card');
                    }
                });

                /* Stagger animate in visible cards */
                var visible = document.querySelectorAll('.dark-article-card:not(.hidden-card)');
                visible.forEach(function (card, idx) {
                    setTimeout(function () {
                        card.classList.remove('filtering-out');
                        card.classList.add('filtering-in');
                    }, idx * 60);
                });
            }, 300);
        });
    });
})();
