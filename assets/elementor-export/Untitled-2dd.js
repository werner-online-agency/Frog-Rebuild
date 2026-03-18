<script>
document.addEventListener('DOMContentLoaded', function() {
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
