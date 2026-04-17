document.addEventListener('DOMContentLoaded', () => {
    const aboutToggle = document.getElementById('aboutToggle');
    const aboutModal  = document.getElementById('aboutModal');
    const aboutClose  = document.querySelector('.about-close');

    // Drag state
    let isDragging     = false;
    let draggedElement = null;

    // Scenario-section drag state
    let activeSectionEl = null;
    let activeSacrifPan = null;
    let activeGainPan   = null;
    const sectionWeights = {};   // { 'scenario-1': { left: 0, right: 0 }, ... }


    const scenarios = [
        {
            title: "Time Investment",
            description: "You have a passion project that could change your life, but it will require one year of full-time commitment with no income. What's worth placing on the scale?",
            result: {
                worth:    "You embraced the challenge, valuing long-term impact over immediate comfort.",
                notWorth: "You respected your limits and chose a stable path that supports your present life.",
                balanced: "You acknowledged the potential and the risks, choosing a mindful compromise."
            }
        },
        {
            title: "Relationship Leap",
            description: "You've met someone special, but pursuing the relationship means moving to a new city, leaving your established community behind. What values tip your scale?",
            result: {
                worth:    "You followed your heart, believing deep connection is worth the leap.",
                notWorth: "You stayed grounded in your current life, protecting meaningful relationships you've built.",
                balanced: "You weighed passion with logic, knowing timing matters in love too."
            }
        },
        {
            title: "Career Crossroads",
            description: "You have an opportunity to switch to a more meaningful career that aligns with your values, but it comes with a 40% pay cut. What matters most on your scale?",
            result: {
                worth:    "You chose meaning over money, ready to live aligned with your deeper purpose.",
                notWorth: "You prioritized financial security, ensuring stability for yourself and others.",
                balanced: "You sought a hybrid path—purpose with sustainability in mind."
            }
        },
        {
            title: "Creative Risk",
            description: "You have a creative idea that could be revolutionary, but sharing it means risking public criticism and rejection. What goes on each side of your scale?",
            result: {
                worth:    "You took the leap to share your vision, despite fear of rejection.",
                notWorth: "You protected your emotional wellbeing, understanding vulnerability has its seasons.",
                balanced: "You found a way to share selectively, protecting both expression and peace."
            }
        },
        {
            title: "Moving Abroad",
            description: "You've been offered a chance to live abroad for a year, but it means leaving behind routines and people you know. What would you trade?",
            result: {
                worth:    "You embraced the unknown, craving discovery beyond your comfort zone.",
                notWorth: "You chose consistency, knowing roots nourish your growth too.",
                balanced: "You saw both paths clearly and left the door open for future journeys."
            }
        },
        {
            title: "Starting a Business",
            description: "You want to start your own business but you'd be leaving a secure job behind and facing financial instability. Is the risk worth it?",
            result: {
                worth:    "You risked it all for autonomy, driven by a dream to build something real.",
                notWorth: "You stayed secure, preserving resources for the right opportunity.",
                balanced: "You mapped a slower entry—testing the waters before the plunge."
            }
        },
        {
            title: "Taking a Break",
            description: "You're burned out and want to take a sabbatical to reconnect with yourself, but it might slow your career momentum. What do you weigh?",
            result: {
                worth:    "You chose healing and clarity over pressure and productivity.",
                notWorth: "You stayed the course, trusting growth within your current rhythm.",
                balanced: "You carved a pocket of rest into your journey—without leaving it behind."
            }
        },
        {
            title: "Speaking Out",
            description: "You see injustice at work but speaking up might cost you relationships or promotions. What's worth more in the moment?",
            result: {
                worth:    "You spoke your truth, prioritizing justice over personal comfort.",
                notWorth: "You chose diplomacy and strategy, protecting your influence for later change.",
                balanced: "You waited, seeking allies to amplify your voice wisely."
            }
        },
        {
            title: "Helping a Stranger",
            description: "You come across someone in need. Helping would cost you time and money, but it might change their life. What goes on your scale?",
            result: {
                worth:    "You gave selflessly, knowing one act of kindness can shift a life.",
                notWorth: "You conserved your resources, honoring your own limits.",
                balanced: "You helped in a way that balanced generosity with sustainability."
            }
        },
        {
            title: "Returning to School",
            description: "You're considering going back to school to pursue a long-held dream, but it means time, debt, and starting over. What do you prioritize?",
            result: {
                worth:    "You pursued your dream, believing it's never too late to begin again.",
                notWorth: "You honored your current responsibilities, recognizing timing is key.",
                balanced: "You planned thoughtfully—keeping your dream alive while staying grounded."
            }
        }
    ];


    // ─── About modal ────────────────────────────────────────────────────────────

    function toggleAbout() {
        aboutModal.classList.toggle('visible');
    }


    // ─── Drag ────────────────────────────────────────────────────────────────────

    function startDrag(e) {
        e.preventDefault();

        // Don't drag chips that have already been placed in a pan
        if (this.closest('.sg-pan')) return;

        document.body.style.overflow         = 'hidden';
        document.body.style.userSelect       = 'none';
        document.body.style.webkitUserSelect = 'none';

        isDragging     = true;
        draggedElement = this;
        draggedElement.classList.add('dragging');

        const parentSection = this.closest('.scenario-section');
        const rect    = draggedElement.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        draggedElement.setAttribute('data-offset-x', clientX - rect.left);
        draggedElement.setAttribute('data-offset-y', clientY - rect.top);

        activeSectionEl = parentSection;
        const pans      = parentSection.querySelectorAll('.sg-pan');
        activeSacrifPan = pans[0];
        activeGainPan   = pans[1];

        draggedElement.dataset.origTop   = draggedElement.style.top   || '';
        draggedElement.dataset.origLeft  = draggedElement.style.left  || '';
        draggedElement.dataset.origRight = draggedElement.style.right || '';
        draggedElement.style.position    = 'fixed';
        draggedElement.style.zIndex      = '1000';

        moveAt(clientX, clientY);
        document.body.appendChild(draggedElement);
    }

    function moveAt(clientX, clientY) {
        if (!draggedElement) return;
        const offsetX = parseInt(draggedElement.getAttribute('data-offset-x'));
        const offsetY = parseInt(draggedElement.getAttribute('data-offset-y'));
        draggedElement.style.left = (clientX - offsetX) + 'px';
        draggedElement.style.top  = (clientY - offsetY) + 'px';
    }

    function onMouseMove(e) {
        if (!isDragging) return;
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        moveAt(clientX, clientY);
        checkDropTarget(clientX, clientY);
    }

    function checkDropTarget(x, y) {
        if (!activeSacrifPan || !activeGainPan) return;
        activeSacrifPan.style.borderColor = '';
        activeGainPan.style.borderColor   = '';
        const sr = activeSacrifPan.getBoundingClientRect();
        const gr = activeGainPan.getBoundingClientRect();
        if (x >= sr.left && x <= sr.right && y >= sr.top && y <= sr.bottom)
            activeSacrifPan.style.borderColor = 'rgba(28,21,16,0.45)';
        else if (x >= gr.left && x <= gr.right && y >= gr.top && y <= gr.bottom)
            activeGainPan.style.borderColor   = 'rgba(28,21,16,0.45)';
    }

    function stopDrag(e) {
        if (!isDragging) return;

        document.body.style.overflow         = '';
        document.body.style.userSelect       = '';
        document.body.style.webkitUserSelect = '';

        const x = e.clientX ?? (e.changedTouches && e.changedTouches[0].clientX);
        const y = e.clientY ?? (e.changedTouches && e.changedTouches[0].clientY);

        draggedElement.classList.remove('dragging');

        if (activeSacrifPan) activeSacrifPan.style.borderColor = '';
        if (activeGainPan)   activeGainPan.style.borderColor   = '';

        const sr         = activeSacrifPan.getBoundingClientRect();
        const gr         = activeGainPan.getBoundingClientRect();
        const sectionRef = activeSectionEl;

        if (x >= sr.left && x <= sr.right && y >= sr.top && y <= sr.bottom) {
            placeOnSectionPan(activeSacrifPan, 'left', sectionRef);
        } else if (x >= gr.left && x <= gr.right && y >= gr.top && y <= gr.bottom) {
            placeOnSectionPan(activeGainPan, 'right', sectionRef);
        } else {
            returnToSection();
        }

        activeSectionEl = null;
        activeSacrifPan = null;
        activeGainPan   = null;
        isDragging      = false;
        draggedElement  = null;
    }


    // ─── Scenario-section drop handlers ─────────────────────────────────────────

    function placeOnSectionPan(panEl, side, sectionEl) {
        const chip = document.createElement('div');
        chip.className = 'sg-chip sg-chip-dropped';
        chip.textContent = draggedElement.textContent;
        chip.setAttribute('data-weight', draggedElement.getAttribute('data-weight'));
        panEl.appendChild(chip);

        const weight = parseInt(draggedElement.getAttribute('data-weight'));
        const sid    = sectionEl.id;
        if (!sectionWeights[sid]) sectionWeights[sid] = { left: 0, right: 0 };
        if (side === 'left') sectionWeights[sid].left  += weight;
        else                 sectionWeights[sid].right += weight;

        draggedElement.remove();
        checkForSectionResult(sectionEl);
    }

    function returnToSection() {
        draggedElement.style.position = 'absolute';
        draggedElement.style.top      = draggedElement.dataset.origTop   || '';
        draggedElement.style.left     = draggedElement.dataset.origLeft  || '';
        draggedElement.style.right    = draggedElement.dataset.origRight || '';
        draggedElement.style.zIndex   = '5';
        activeSectionEl.appendChild(draggedElement);
    }

    function checkForSectionResult(sectionEl) {
        let total = 0;
        sectionEl.querySelectorAll('.sg-pan').forEach(p => {
            total += p.querySelectorAll('.sg-chip-dropped').length;
        });
        if (total >= 3) setTimeout(() => showSectionResult(sectionEl), 800);
    }

    function unlockNext(n, currentSectionEl) {
        const next = document.getElementById(`scenario-${n + 1}`);
        if (next) {
            setTimeout(() => {
                next.style.opacity       = '1';
                next.style.pointerEvents = 'all';
                const bar = currentSectionEl.querySelector('.sg-result-bar');
                if (bar) bar.style.opacity = '0';
                setTimeout(() => {
                    next.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }, 1500);
        }
    }

    function showSectionResult(sectionEl) {
        if (sectionEl.querySelector('.sg-result-bar')) return;

        const idx      = parseInt(sectionEl.id.split('-')[1]) - 1;
        const n        = idx + 1;
        const scenario = scenarios[idx];
        const w        = sectionWeights[sectionEl.id] || { left: 0, right: 0 };

        let resultKey = 'balanced';
        if (w.left  > w.right + 2)  resultKey = 'notWorth';
        else if (w.right > w.left + 2) resultKey = 'worth';

        const verdictMap = { worth: 'worth it.', notWorth: 'not worth it.', balanced: 'balanced.' };

        // 1. Fade out image fragments
        sectionEl.querySelectorAll('.img-fragment').forEach(frag => {
            frag.style.transition = 'opacity 0.6s ease';
            frag.style.opacity    = '0';
        });

        // 2. Full-bleed result background image
        const resultBg = document.createElement('div');
        resultBg.className = 'sg-result-bg';
        resultBg.style.cssText =
            'position:absolute;inset:0;z-index:6;opacity:0;transition:opacity 0.8s ease;';

        const bgImg = document.createElement('img');
        bgImg.src           = `assets/s${n}_${resultKey}.png`;
        bgImg.alt           = '';
        bgImg.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:center;display:block;';
        bgImg.onerror = () => { resultBg.style.background = '#1c1510'; };
        resultBg.appendChild(bgImg);

        // 3. Dark overlay so result text stays readable
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:absolute;inset:0;z-index:7;background:rgba(13,13,13,0.55);';
        resultBg.appendChild(overlay);

        sectionEl.appendChild(resultBg);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            resultBg.style.opacity = '1';
        }));

        // 4. Result bar — bottom center, above everything
        const resultBar = document.createElement('div');
        resultBar.className = 'sg-result-bar';
        resultBar.style.cssText =
            'position:absolute;bottom:60px;left:50%;transform:translateX(-50%);' +
            'width:auto;max-width:600px;text-align:center;z-index:20;' +
            'opacity:0;transition:opacity 0.8s ease;';

        const verdictEl = document.createElement('div');
        verdictEl.className   = 'sg-result-verdict';
        verdictEl.textContent = verdictMap[resultKey];

        const descEl = document.createElement('div');
        descEl.className   = 'sg-result-desc';
        descEl.textContent = scenario.result[resultKey];

        resultBar.appendChild(verdictEl);
        resultBar.appendChild(descEl);
        sectionEl.appendChild(resultBar);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            resultBar.style.opacity = '1';
        }));

        // 5. Unlock next scenario after delay
        unlockNext(n, sectionEl);

        // 6. Reset when section scrolls out of view
        const resetObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    sectionEl.querySelectorAll('.img-fragment').forEach(frag => {
                        frag.style.opacity = '1';
                    });
                    resultBg.remove();
                    resultBar.remove();
                    resetObserver.disconnect();
                }
            });
        }, { threshold: 0 });

        resetObserver.observe(sectionEl);
    }


    // ─── Build scenario sections ─────────────────────────────────────────────────

    function buildScenarioSections() {
        const chipValues = [
            { name: 'Love',       weight: 3 },
            { name: 'Growth',     weight: 3 },
            { name: 'Security',   weight: 2 },
            { name: 'Freedom',    weight: 2 },
            { name: 'Experience', weight: 1 },
            { name: 'Money',      weight: 3 },
            { name: 'Connection', weight: 2 },
            { name: 'Self-Worth', weight: 2 },
            { name: 'Comfort',    weight: 1 },
            { name: 'Purpose',    weight: 3 }
        ];

        const chipPositions = [
            { top: '18%', left:  '28%' },
            { top: '12%', left:  '42%' },
            { top: '22%', right: '28%' },
            { top: '35%', right: '16%' },
            { top: '65%', right: '18%' },
            { top: '72%', left:  '32%' },
            { top: '78%', left:  '18%' },
            { top: '60%', left:  '22%' },
            { top: '42%', left:  '28%' },
            { top: '48%', right: '24%' }
        ];

        const anchor = document.getElementById('closing');

        scenarios.forEach((scenario, i) => {
            const n       = i + 1;
            const section = document.createElement('section');
            section.className = 'scenario-section';
            section.id        = `scenario-${n}`;

            // 1. Grid overlay
            const grid = document.createElement('div');
            grid.className = 'sg-grid';
            section.appendChild(grid);

            // 2. Hairlines
            [['sg-hairline-h', 'top',  '33%'],
             ['sg-hairline-h', 'top',  '66%'],
             ['sg-hairline-v', 'left', '33%'],
             ['sg-hairline-v', 'left', '66%']].forEach(([cls, prop, val]) => {
                const line = document.createElement('div');
                line.className   = cls;
                line.style[prop] = val;
                section.appendChild(line);
            });

            // 3. Image fragments (4 corners)
            [
                { suffix: 'tl', w: '20%', aspect: '1/1', top:    '5%', left:  '2%',  rot: '-2.5deg' },
                { suffix: 'tr', w: '16%', aspect: '1/1', top:    '3%', right: '4%',  rot:  '2deg'   },
                { suffix: 'bl', w: '18%', aspect: '1/1', bottom: '7%', left:  '5%',  rot:  '1deg'   },
                { suffix: 'br', w: '14%', aspect: '1/1', bottom: '4%', right: '3%',  rot: '-1.5deg' }
            ].forEach(({ suffix, w, aspect, top, bottom, left, right, rot }) => {
                const frag = document.createElement('div');
                frag.className         = 'img-fragment';
                frag.style.width       = w;
                frag.style.aspectRatio = aspect;
                frag.style.transform   = `rotate(${rot})`;
                if (top)    frag.style.top    = top;
                if (bottom) frag.style.bottom = bottom;
                if (left)   frag.style.left   = left;
                if (right)  frag.style.right  = right;

                const img = document.createElement('img');
                img.src   = `assets/s${n}_${suffix}.png`;
                img.alt   = '';
                img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
                img.onerror = () => {
                    frag.style.background = '#d4cfc4';
                    frag.style.border     = '0.5px solid rgba(28,21,16,0.1)';
                    img.style.display     = 'none';
                };
                frag.appendChild(img);
                section.appendChild(frag);
            });

            // 4. Scattered italic quotes
            const words = scenario.description.split(' ');
            [
                { text: words.slice(0, 8).join(' '),  top: '52%', left:  '2%'  },
                { text: words.slice(8, 16).join(' '), top: '15%', right: '23%' }
            ].forEach(({ text, top, left, right }) => {
                if (!text.trim()) return;
                const q = document.createElement('div');
                q.className   = 'sg-quote';
                q.textContent = text;
                q.style.top   = top;
                if (left)  q.style.left  = left;
                if (right) q.style.right = right;
                section.appendChild(q);
            });

            // 5. Center block
            const center = document.createElement('div');
            center.className = 'sg-center';

            const numEl = document.createElement('div');
            numEl.className   = 'sg-number';
            numEl.textContent = String(n).padStart(2, '0');

            const titleEl = document.createElement('div');
            titleEl.className   = 'sg-title';
            titleEl.textContent = scenario.title;

            const questionEl = document.createElement('div');
            questionEl.className   = 'sg-question';
            questionEl.textContent = scenario.description;

            const divider = document.createElement('div');
            divider.className = 'sg-divider';

            const pans = document.createElement('div');
            pans.className = 'sg-pans';

            const sacrificePan = document.createElement('div');
            sacrificePan.className = 'sg-pan';
            const sacrificeLabel = document.createElement('div');
            sacrificeLabel.className   = 'sg-pan-label';
            sacrificeLabel.textContent = 'SACRIFICE';
            sacrificePan.appendChild(sacrificeLabel);

            const vs = document.createElement('div');
            vs.className   = 'sg-vs';
            vs.textContent = 'vs';

            const gainPan = document.createElement('div');
            gainPan.className = 'sg-pan';
            const gainLabel = document.createElement('div');
            gainLabel.className   = 'sg-pan-label';
            gainLabel.textContent = 'GAIN';
            gainPan.appendChild(gainLabel);

            pans.appendChild(sacrificePan);
            pans.appendChild(vs);
            pans.appendChild(gainPan);

            center.appendChild(numEl);
            center.appendChild(titleEl);
            center.appendChild(questionEl);
            center.appendChild(divider);
            center.appendChild(pans);
            section.appendChild(center);

            // 6. Value chips
            chipValues.forEach((val, vi) => {
                const chip = document.createElement('div');
                chip.className = 'sg-chip';
                chip.textContent = val.name;
                chip.setAttribute('data-weight', val.weight);
                const pos = chipPositions[vi];
                if (pos.top)   chip.style.top   = pos.top;
                if (pos.left)  chip.style.left  = pos.left;
                if (pos.right) chip.style.right = pos.right;
                chip.addEventListener('mousedown', startDrag);
                chip.addEventListener('touchstart', startDrag, { passive: false });
                section.appendChild(chip);
            });

            // 7. Bottom labels
            const lblLeft = document.createElement('div');
            lblLeft.className   = 'sg-bottom-label sg-bottom-left';
            lblLeft.textContent = 'drag values to weigh';
            section.appendChild(lblLeft);

            const lblRight = document.createElement('div');
            lblRight.className   = 'sg-bottom-label sg-bottom-right';
            lblRight.textContent = 'scroll to continue ↓';
            section.appendChild(lblRight);

            document.body.insertBefore(section, anchor);
        });
    }


    // ─── Event listeners ─────────────────────────────────────────────────────────

    aboutToggle.addEventListener('click', toggleAbout);
    aboutClose.addEventListener('click', toggleAbout);

    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) toggleAbout();
    });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   stopDrag);
    document.addEventListener('touchmove', onMouseMove, { passive: false });
    document.addEventListener('touchend',  stopDrag);


    // ─── Init ────────────────────────────────────────────────────────────────────

    buildScenarioSections();

    // Unlock only scenario-1 on load; 2-10 remain hidden
    const firstSection = document.getElementById('scenario-1');
    if (firstSection) {
        firstSection.style.opacity       = '1';
        firstSection.style.pointerEvents = 'all';
    }

    // Jump to scenarios button
    document.getElementById('jump-to-scenarios').addEventListener('click', () => {
        document.getElementById('scenario-1').scrollIntoView({ behavior: 'smooth' });
    });

    // Logo scroll animation — full screen on load, shrinks to corner
    const heroLogo = document.getElementById('hero-logo');

    // Fade in on load with 300ms delay, then clear transition so scroll takes over
    setTimeout(() => {
        heroLogo.style.transition = 'opacity 2s ease';
        heroLogo.style.opacity    = '1';
    }, 300);
    setTimeout(() => {
        heroLogo.style.transition = '';
    }, 2400);

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const progress = Math.min(window.scrollY / window.innerHeight, 1);

                if (progress < 1) {
                    const bleedW   = window.innerWidth  * 1.1;
                    const bleedH   = window.innerHeight * 1.1;
                    const cornerW  = 160;
                    const currentW = bleedW - (progress * (bleedW - cornerW));

                    const startTop  = window.innerHeight * -0.05;
                    const startLeft = window.innerWidth  * -0.05;
                    const currentTop  = startTop  + (progress * (16 - startTop));
                    const currentLeft = startLeft + (progress * (18 - startLeft));

                    const currentOpacity = 1 - (progress * 0.15);

                    heroLogo.style.transition = 'none';
                    heroLogo.style.width      = currentW + 'px';
                    heroLogo.style.height     = progress < 0.05 ? '110vh' : 'auto';
                    heroLogo.style.objectFit  = progress < 0.05 ? 'cover' : 'contain';
                    heroLogo.style.top        = currentTop + 'px';
                    heroLogo.style.left       = currentLeft + 'px';
                    heroLogo.style.opacity    = currentOpacity;
                } else {
                    heroLogo.style.transition = 'none';
                    heroLogo.style.width      = '160px';
                    heroLogo.style.height     = 'auto';
                    heroLogo.style.objectFit  = 'contain';
                    heroLogo.style.top        = '16px';
                    heroLogo.style.left       = '18px';
                    heroLogo.style.opacity    = '0.85';
                }

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

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
