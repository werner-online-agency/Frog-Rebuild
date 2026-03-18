/* ===== EMOTIONAL INTELLIGENCE ARTICLE — emotional-intelligence.js ===== */
document.addEventListener('DOMContentLoaded', () => {

    /* --- Scroll-reveal -------------------------------------------------- */
    const revealEls = document.querySelectorAll('[data-reveal]');
    const revealIO  = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const d = entry.target.dataset.reveal || 0;
                setTimeout(() => entry.target.classList.add('revealed'), +d);
                revealIO.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealIO.observe(el));

    /* --- Progress bar --------------------------------------------------- */
    const fill  = document.querySelector('.steps-progress-fill');
    const steps = document.querySelectorAll('.step-card');
    if (fill && steps.length) {
        const progressIO = new IntersectionObserver(() => {
            let maxVisible = 0;
            steps.forEach((s, i) => {
                if (s.classList.contains('revealed')) maxVisible = i + 1;
            });
            const pct = Math.round((maxVisible / steps.length) * 100);
            fill.style.width = pct + '%';
        }, { threshold: 0.15 });
        steps.forEach(s => progressIO.observe(s));
    }

    /* --- TOC active state ----------------------------------------------- */
    const tocItems    = document.querySelectorAll('.toc-item');
    const stepAnchors = Array.from(tocItems).map(a => {
        const id = a.getAttribute('href')?.replace('#', '');
        return id ? document.getElementById(id) : null;
    }).filter(Boolean);

    if (stepAnchors.length) {
        const tocIO = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const link = document.querySelector(`.toc-item[href="#${id}"]`);
                if (link) link.classList.toggle('active', entry.isIntersecting);
            });
        }, { rootMargin: '-20% 0px -60% 0px' });
        stepAnchors.forEach(el => tocIO.observe(el));
    }

    /* --- Smooth scroll for TOC links ------------------------------------ */
    tocItems.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const id = link.getAttribute('href')?.replace('#', '');
            const target = id ? document.getElementById(id) : null;
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
});
