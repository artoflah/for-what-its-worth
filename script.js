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

    // ─── Logo: cinematic fade-in, then fade out on scroll ────────────────────────

    const heroLogo = document.getElementById('hero-logo');

    setTimeout(() => {
        heroLogo.style.transition = 'opacity 2.5s ease';
        heroLogo.style.opacity    = '1';
    }, 200);
    setTimeout(() => {
        heroLogo.style.transition = '';
    }, 2800);

    setTimeout(() => {
        window.addEventListener('scroll', () => {
            const opacity = Math.max(0, 1 - (window.scrollY / (window.innerHeight * 0.4)));
            heroLogo.style.opacity = opacity;
        }, { passive: true });
    }, 2800);

    // ─── Definition reveal — scroll-triggered, one line at a time ────────────────

    const revealLines = document.querySelectorAll('.reveal-line');

    window.addEventListener('scroll', () => {
        revealLines.forEach((line, i) => {
            const triggerPoint = line.offsetTop - (window.innerHeight * 0.75);
            if (window.scrollY >= triggerPoint && !line.classList.contains('visible')) {
                setTimeout(() => {
                    line.classList.add('visible');
                }, i * 180);
            }
        });
    }, { passive: true });
});
