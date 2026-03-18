/* ============================================
   FROGG RECRUITMENT - PRELOADER SCRIPT
   ============================================ */
(function () {
    'use strict';

    var preloader = document.getElementById('frogg-preloader');
    if (!preloader) return;

    var statusEl = preloader.querySelector('.preloader-status');
    var phrases = [
        'Finding top talent\u2026',
        'Matching candidates\u2026',
        'Building great teams\u2026',
        'Connecting people\u2026',
        'Almost ready\u2026'
    ];

    // Cycle status text
    var phraseIndex = 0;
    var phraseInterval = setInterval(function () {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        if (statusEl) statusEl.textContent = phrases[phraseIndex];
    }, 800);

    function hidePreloader() {
        clearInterval(phraseInterval);
        preloader.classList.add('hidden');
        document.body.classList.remove('preloader-active');
    }

    // Hide on full page load (min 1s so animation is visible)
    var start = Date.now();
    window.addEventListener('load', function () {
        var elapsed = Date.now() - start;
        var remaining = Math.max(0, 1000 - elapsed);
        setTimeout(hidePreloader, remaining);
    });

    // Safety net – always hide after 4s
    setTimeout(hidePreloader, 4000);
})();
