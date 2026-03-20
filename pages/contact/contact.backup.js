/* Contact page — header scroll-state + mobile menu */
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
})();
