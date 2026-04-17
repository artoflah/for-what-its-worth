document.addEventListener('DOMContentLoaded', () => {
    const aboutToggle = document.getElementById('aboutToggle');
    const aboutModal  = document.getElementById('aboutModal');
    const aboutClose  = document.querySelector('.about-close');

    function toggleAbout() {
        aboutModal.classList.toggle('visible');
    }

    aboutToggle.addEventListener('click', toggleAbout);
    aboutClose.addEventListener('click', toggleAbout);
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) toggleAbout();
    });

    // Begin button navigates to scenarios page
    document.getElementById('jump-to-scenarios').addEventListener('click', () => {
        window.location.href = 'scenarios.html';
    });

    // ─── Logo fade-in and scroll shrink ──────────────────────────────────────────

    const heroLogo = document.getElementById('hero-logo');

    setTimeout(() => {
        heroLogo.style.transition = 'opacity 2s ease';
        heroLogo.style.opacity    = '1';
    }, 300);
    setTimeout(() => {
        heroLogo.style.transition = '';
    }, 2400);

    window.addEventListener('scroll', () => {
        const progress = Math.min(window.scrollY / window.innerHeight, 1);

        if (progress < 1) {
            const bleedW  = window.innerWidth  * 1.1;
            const cornerW = 160;
            const currentW = bleedW - (progress * (bleedW - cornerW));

            const startTop  = window.innerHeight * -0.05;
            const startLeft = window.innerWidth  * -0.05;
            const currentTop  = startTop  + (progress * (16 - startTop));
            const currentLeft = startLeft + (progress * (18 - startLeft));

            heroLogo.style.transition = 'none';
            heroLogo.style.width      = currentW + 'px';
            heroLogo.style.height     = progress < 0.05 ? '110vh' : 'auto';
            heroLogo.style.objectFit  = progress < 0.05 ? 'cover' : 'contain';
            heroLogo.style.top        = currentTop  + 'px';
            heroLogo.style.left       = currentLeft + 'px';
            heroLogo.style.opacity    = String(1 - progress * 0.15);
        } else {
            heroLogo.style.transition = 'none';
            heroLogo.style.width      = '160px';
            heroLogo.style.height     = 'auto';
            heroLogo.style.objectFit  = 'contain';
            heroLogo.style.top        = '16px';
            heroLogo.style.left       = '18px';
            heroLogo.style.opacity    = '0.85';
        }
    }, { passive: true });

    // ─── Definition reveal ────────────────────────────────────────────────────────

    document.querySelectorAll('.reveal-line').forEach((line) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity   = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(line);
    });
});
