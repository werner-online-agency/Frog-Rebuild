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

    /* ========================================
       JOB LISTINGS — FILTERS & SEARCH
       ======================================== */
    const filtersSidebar = document.getElementById('filtersSidebar');
    const mobileFilterToggle = document.getElementById('mobileFilterToggle');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const heroSearchForm = document.getElementById('heroSearch');
    const sortSelect = document.getElementById('sortBy');
    const jobCountEl = document.getElementById('jobCount');
    const listingsGrid = document.getElementById('listingsGrid');

    // Mobile filter toggle
    if (mobileFilterToggle && filtersSidebar) {
        mobileFilterToggle.addEventListener('click', function () {
            filtersSidebar.classList.toggle('active');
            document.body.classList.toggle('no-scroll', filtersSidebar.classList.contains('active'));
        });
    }

    // Clear all filters
    if (clearFiltersBtn && filtersSidebar) {
        clearFiltersBtn.addEventListener('click', function () {
            filtersSidebar.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(function (input) {
                if (input.type === 'radio' && input.value === '') {
                    input.checked = true;
                } else {
                    input.checked = false;
                }
            });
        });
    }

    // Hero search — prevent default (placeholder, dashboard plugin handles real search)
    if (heroSearchForm) {
        heroSearchForm.addEventListener('submit', function (e) {
            e.preventDefault();
        });
    }
})();
