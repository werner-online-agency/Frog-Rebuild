/* Contact page — header, mobile menu, scroll reveal, counters, form, smooth scroll */
(function () {
    var header = document.getElementById('siteHeader');
    var toggle = document.getElementById('mobileToggle');
    var mobileMenu = document.getElementById('mobileMenu');

    /* ===== Scroll state ===== */
    function onScroll() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 30);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ===== Mobile menu ===== */
    if (toggle && mobileMenu) {
        toggle.addEventListener('click', function () {
            var open = mobileMenu.classList.toggle('active');
            toggle.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            document.body.classList.toggle('no-scroll', open);
        });
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    /* ===== Scroll reveal ===== */
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-section, .reveal-item').forEach(function (el) {
        var delay = el.getAttribute('data-delay');
        if (delay !== null) el.style.setProperty('--delay', delay);
        revealObserver.observe(el);
    });

    /* ===== Animated counters ===== */
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

    /* ===== Smooth scroll for anchor links ===== */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = link.getAttribute('href');
            if (id.length <= 1) return;
            var target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                var offset = header ? header.offsetHeight + 20 : 100;
                var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    /* ===== Contact form ===== */
    var form = document.getElementById('contactFormEl');
    var submitBtn = document.getElementById('submitBtn');
    var successEl = document.getElementById('formSuccess');
    var resetBtn = document.getElementById('resetFormBtn');
    var charCount = document.getElementById('charCount');
    var messageField = document.getElementById('message');

    if (messageField && charCount) {
        messageField.addEventListener('input', function () {
            var len = messageField.value.length;
            charCount.textContent = len;
            if (len > 1000) {
                messageField.value = messageField.value.substring(0, 1000);
                charCount.textContent = '1000';
            }
        });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            /* Clear previous errors */
            form.querySelectorAll('.error').forEach(function (el) {
                el.classList.remove('error');
            });

            /* Validate */
            var fields = form.querySelectorAll('[required]');
            var valid = true;
            fields.forEach(function (field) {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    valid = false;
                }
                if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                    field.classList.add('error');
                    valid = false;
                }
            });

            if (!valid) return;

            /* Simulate submission */
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            setTimeout(function () {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                form.hidden = true;
                successEl.hidden = false;
            }, 1500);
        });
    }

    if (resetBtn && form && successEl) {
        resetBtn.addEventListener('click', function () {
            form.reset();
            if (charCount) charCount.textContent = '0';
            successEl.hidden = true;
            form.hidden = false;
        });
    }
})();
