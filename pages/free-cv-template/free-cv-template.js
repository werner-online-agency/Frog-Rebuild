(function () {
    /* ── Header & mobile menu ── */
    const header = document.getElementById('siteHeader');
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    function updateHeaderState() {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 30);
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
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMobileMenu();
        });
    }

    window.addEventListener('scroll', updateHeaderState, { passive: true });
    updateHeaderState();

    /* ── Scroll reveal ── */
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-section, .reveal-item').forEach(function (el) {
        revealObserver.observe(el);
    });

    /* ── Animated counters ── */
    var countersDone = false;
    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !countersDone) {
                countersDone = true;
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    var statsEl = document.querySelector('.hero-stats');
    if (statsEl) counterObserver.observe(statsEl);

    function animateCounters() {
        document.querySelectorAll('.hero-stat-num[data-count]').forEach(function (el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            var duration = 1800;
            var start = performance.now();
            function tick(now) {
                var progress = Math.min((now - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased).toLocaleString();
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }

    /* ── Smooth scroll for anchor links ── */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = this.getAttribute('href').slice(1);
            var target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();
