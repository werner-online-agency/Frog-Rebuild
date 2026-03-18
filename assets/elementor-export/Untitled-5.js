<script>
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // HEADER SCROLL BEHAVIOR
    // ============================================
    const header = document.querySelector('.frogg-header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
        
        // Check initial scroll position
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
    }
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.frogg-mobile-toggle');
    const mobileMenu = document.querySelector('.frogg-mobile-menu');
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }
    
    // ============================================
    // SERVICES TAB SWITCHING
    // ============================================
    const tabBtns = document.querySelectorAll('.new-tab-btn');
    const tabPanels = document.querySelectorAll('.new-tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all tabs and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active to clicked tab
            this.classList.add('active');
            
            // Get corresponding panel
            const panelId = 'new-panel-' + this.id.replace('new-tab-', '');
            const panel = document.getElementById(panelId);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });
    
});
</script>