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

    const heroLogo       = document.getElementById('hero-logo');
    let logoFadeDone     = false;
    let logoRafPending   = false;
    let logoLocked       = false;

    function lerp(a, b, t) { return a + (b - a) * t; }

    // Cinematic fade-in
    setTimeout(() => {
        heroLogo.style.transition = 'opacity 2.5s ease';
        heroLogo.style.opacity    = '1';
    }, 200);
    setTimeout(() => {
        heroLogo.style.transition = '';
        logoFadeDone = true;
    }, 2800);

    function applyLogoScroll() {
        logoRafPending = false;
        if (!logoFadeDone || logoLocked) return;

        const progress = Math.min(
            window.scrollY / (window.innerHeight * 0.7),
            1
        );

        if (progress >= 1) {
            logoLocked               = true;
            heroLogo.style.top       = '14px';
            heroLogo.style.left      = '16px';
            heroLogo.style.width     = '130px';
            heroLogo.style.height    = 'auto';
            heroLogo.style.objectFit = 'contain';
            heroLogo.style.opacity   = '0.75';
            return;
        }

        const vw = window.innerWidth  / 100;
        const vh = window.innerHeight / 100;

        const top     = lerp(-8 * vh,           14,   progress);
        const left    = lerp(-8 * vw,           16,   progress);
        const width   = lerp(116 * vw,          130,  progress);
        const opacity = lerp(1,                 0.75, progress);

        heroLogo.style.top       = top    + 'px';
        heroLogo.style.left      = left   + 'px';
        heroLogo.style.width     = width  + 'px';
        heroLogo.style.opacity   = String(opacity);

        // Switch from cover to contain once it starts shrinking noticeably
        if (progress < 0.08) {
            heroLogo.style.height    = '116vh';
            heroLogo.style.objectFit = 'cover';
        } else {
            heroLogo.style.height    = 'auto';
            heroLogo.style.objectFit = 'contain';
        }
    }

    window.addEventListener('scroll', () => {
        if (logoLocked) return;
        // Reset lock if user scrolls back to top
        if (window.scrollY === 0) logoLocked = false;
        if (!logoRafPending) {
            logoRafPending = true;
            requestAnimationFrame(applyLogoScroll);
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
