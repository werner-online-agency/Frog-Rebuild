/* Resources page — header, mobile menu, scroll reveal, counters, library interactions */
(function () {
    var header = document.getElementById('siteHeader');
    var toggle = document.getElementById('mobileToggle');
    var mobileMenu = document.getElementById('mobileMenu');

    /* Scroll state */
    function onScroll() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 30);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile menu */
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

    /* ===== Scroll reveal — new sections ===== */
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

    /* ===== Library: Scroll-reveal animations ===== */
    var revealEls = document.querySelectorAll('[data-reveal]');
    if (revealEls.length) {
        var libRevealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var delay = el.dataset.revealDelay || 0;
                    setTimeout(function () {
                        el.classList.add('revealed');
                    }, delay);
                    libRevealObserver.unobserve(el);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el, i) {
            if (el.classList.contains('dark-article-card')) {
                el.dataset.revealDelay = i * 80;
            }
            libRevealObserver.observe(el);
        });
    }

    /* ===== Thumbnail tilt effect ===== */
    document.querySelectorAll('.feat-thumb').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = 'translateY(-4px) perspective(600px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 5) + 'deg)';
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });

    /* ===== Featured Carousel ===== */
    var featArticles = [
        {
            img: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&w=900&q=85',
            alt: 'Professional interview meeting',
            num: '01',
            catIcon: 'fas fa-briefcase',
            catLabel: 'Hiring',
            time: '6 min read',
            title: 'How to improve your hiring process in 8 easy steps',
            desc: 'Successful hiring of employees can help you find top-quality candidates for a role and fill your open positions efficiently.',
            link: '../../pages/hiring-process/hiring-process.html'
        },
        {
            img: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=800&q=85',
            alt: 'Team collaborating in modern office',
            num: '02',
            catIcon: 'fas fa-users',
            catLabel: 'Team',
            time: '5 min read',
            title: "Increasing your team's performance over the Summer",
            desc: 'Better productivity results in the short and long term for your entire organisation.',
            link: '../../pages/team-performance/team-performance.html'
        },
        {
            img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=85',
            alt: 'Corporate team strategy meeting',
            num: '03',
            catIcon: 'fas fa-building',
            catLabel: 'Branding',
            time: '5 min read',
            title: 'Improving Employer Branding',
            desc: 'Your employer brand is your company\'s perceived reputation in the marketplace.',
            link: '../../pages/employer-branding/employer-branding.html'
        },
        {
            img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=85',
            alt: 'Professional developing emotional intelligence',
            num: '04',
            catIcon: 'fas fa-brain',
            catLabel: 'Growth',
            time: '6 min read',
            title: 'The 4 Keys to Building Emotional Intelligence',
            desc: 'Master the skills that set great leaders apart in the modern workplace.',
            link: '../../pages/emotional-intelligence/emotional-intelligence.html'
        },
        {
            img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=85',
            alt: 'Happy employees in workplace',
            num: '05',
            catIcon: 'fas fa-heart',
            catLabel: 'Careers',
            time: '5 min read',
            title: 'Factors That Drive Job Satisfaction',
            desc: 'Understanding what truly keeps employees engaged, motivated and fulfilled at work.',
            link: '../../pages/job-satisfaction/job-satisfaction.html'
        }
    ];

    var featCurrent = 0;
    var featHero = document.getElementById('featHero');
    var featThumbs = document.querySelectorAll('.feat-thumb');

    function updateFeatHero(index) {
        var a = featArticles[index];
        featHero.classList.add('feat-hero-exit');

        setTimeout(function () {
            document.getElementById('featHeroImg').src = a.img;
            document.getElementById('featHeroImg').alt = a.alt;
            document.getElementById('featHeroNum').textContent = a.num;
            document.getElementById('featHeroCat').innerHTML = '<i class="' + a.catIcon + '"></i> ' + a.catLabel;
            document.getElementById('featHeroTime').innerHTML = '<i class="far fa-clock"></i> ' + a.time;
            document.getElementById('featHeroTitle').textContent = a.title;
            document.getElementById('featHeroDesc').textContent = a.desc;
            document.getElementById('featHeroLink').href = a.link;
            document.getElementById('featCurrentNum').textContent = index + 1;

            featHero.classList.remove('feat-hero-exit');
            featHero.classList.add('feat-hero-enter');
            setTimeout(function () { featHero.classList.remove('feat-hero-enter'); }, 500);
        }, 300);

        // Update thumbnails — show all except the active one
        var thumbIdx = 0;
        for (var i = 0; i < featArticles.length; i++) {
            if (i === index) continue;
            if (thumbIdx < featThumbs.length) {
                var thumb = featThumbs[thumbIdx];
                thumb.querySelector('img').src = featArticles[i].img;
                thumb.querySelector('img').alt = featArticles[i].alt;
                thumb.querySelector('.feat-thumb-num').textContent = featArticles[i].num;
                thumb.setAttribute('data-index', i);
                thumb.setAttribute('aria-label', 'View article ' + (i + 1));
                thumbIdx++;
            }
        }
    }

    var prevBtn = document.getElementById('featPrev');
    var nextBtn = document.getElementById('featNext');

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            featCurrent = (featCurrent + 1) % featArticles.length;
            updateFeatHero(featCurrent);
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            featCurrent = (featCurrent - 1 + featArticles.length) % featArticles.length;
            updateFeatHero(featCurrent);
        });
    }

    // Click a thumbnail to make it the hero
    featThumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            var idx = parseInt(thumb.getAttribute('data-index'), 10);
            featCurrent = idx;
            updateFeatHero(featCurrent);
        });
        thumb.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                thumb.click();
            }
        });
    });

    /* ===== Library: Filter tabs ===== */
    var filterBtns = document.querySelectorAll('.library-filter-btn');
    var articleCards = document.querySelectorAll('.dark-article-card');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = btn.dataset.filter;

            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

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
