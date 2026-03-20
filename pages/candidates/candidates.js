/* ========================================
   Candidates JS — Frogg Recruitment
   About-page pattern: header scroll, counters, mobile menu
   ======================================== */

/* ----- Header Scroll Effect ----- */
(function () {
    var header = document.getElementById('siteHeader');
    if (!header) return;
    function onScroll() {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile menu toggle */
    var toggle = document.getElementById('mobileToggle');
    var menu = document.getElementById('mobileMenu');
    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            var isOpen = menu.classList.toggle('active');
            toggle.classList.toggle('active', isOpen);
            toggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            }
        });
    }
})();

/* ----- Animated Counters ----- */
(function () {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            observer.unobserve(el);
            animateCounter(el);
        });
    }, { threshold: 0.3 });

    counters.forEach(function (c) { observer.observe(c); });

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var format = el.getAttribute('data-format');
        var duration = 2000;
        var start = performance.now();

        function ease(t) { return 1 - Math.pow(1 - t, 3); }

        function formatNum(n) {
            if (format === 'comma') return n.toLocaleString();
            return n.toString();
        }

        function step(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var value = Math.round(ease(progress) * target);
            el.textContent = formatNum(value) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
})();
