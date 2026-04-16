document.addEventListener('DOMContentLoaded', () => {
    const aboutToggle    = document.getElementById('aboutToggle');
    const aboutModal     = document.getElementById('aboutModal');
    const aboutClose     = document.querySelector('.about-close');

    const scaleBeam          = document.getElementById('scaleBeam');
    const leftPanValues      = document.getElementById('leftPanValues');
    const rightPanValues     = document.getElementById('rightPanValues');
    const valuesPalette      = document.getElementById('valuesPalette');
    const resultContainer    = document.getElementById('resultContainer');
    const resultText         = document.getElementById('resultText');
    const resultImageContainer = document.getElementById('resultImageContainer');
    const nextScenarioBtn    = document.getElementById('nextScenarioBtn');
    const prevScenarioBtn    = document.getElementById('prevScenarioBtn');
    const scenarioTitle      = document.getElementById('scenarioTitle');
    const scenarioDescription = document.getElementById('scenarioDescription');

    // Drag state
    let isDragging      = false;
    let draggedElement  = null;

    // Old scale-section weights
    let leftPanWeight  = 0;
    let rightPanWeight = 0;
    let currentScenarioIndex = 0;

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
            },
            images: {
                worth:    "assets/scenario1.a1.png",
                notWorth: "assets/scenario1,a2.png",
                balanced: "assets/scenario1,a3.png"
            }
        },
        {
            title: "Relationship Leap",
            description: "You've met someone special, but pursuing the relationship means moving to a new city, leaving your established community behind. What values tip your scale?",
            result: {
                worth:    "You followed your heart, believing deep connection is worth the leap.",
                notWorth: "You stayed grounded in your current life, protecting meaningful relationships you've built.",
                balanced: "You weighed passion with logic, knowing timing matters in love too."
            },
            images: {
                worth:    "assets/scenario2,a1.png",
                notWorth: "assets/scenario2,a2.png",
                balanced: "assets/scenario2,a3.png"
            }
        },
        {
            title: "Career Crossroads",
            description: "You have an opportunity to switch to a more meaningful career that aligns with your values, but it comes with a 40% pay cut. What matters most on your scale?",
            result: {
                worth:    "You chose meaning over money, ready to live aligned with your deeper purpose.",
                notWorth: "You prioritized financial security, ensuring stability for yourself and others.",
                balanced: "You sought a hybrid path—purpose with sustainability in mind."
            },
            images: {
                worth:    "assets/scenario3,a1.png",
                notWorth: "assets/scenario3,a2.png",
                balanced: "assets/scenario3,a3.png"
            }
        },
        {
            title: "Creative Risk",
            description: "You have a creative idea that could be revolutionary, but sharing it means risking public criticism and rejection. What goes on each side of your scale?",
            result: {
                worth:    "You took the leap to share your vision, despite fear of rejection.",
                notWorth: "You protected your emotional wellbeing, understanding vulnerability has its seasons.",
                balanced: "You found a way to share selectively, protecting both expression and peace."
            },
            images: {
                worth:    "assets/scenario4,a1.png",
                notWorth: "assets/scenario4,a2.png",
                balanced: "assets/scenario4,a3.png"
            }
        },
        {
            title: "Moving Abroad",
            description: "You've been offered a chance to live abroad for a year, but it means leaving behind routines and people you know. What would you trade?",
            result: {
                worth:    "You embraced the unknown, craving discovery beyond your comfort zone.",
                notWorth: "You chose consistency, knowing roots nourish your growth too.",
                balanced: "You saw both paths clearly and left the door open for future journeys."
            },
            images: {
                worth:    "assets/scenario5,a1.png",
                notWorth: "assets/scenario5,a2.png",
                balanced: "assets/scenario5,a3.png"
            }
        },
        {
            title: "Starting a Business",
            description: "You want to start your own business but you'd be leaving a secure job behind and facing financial instability. Is the risk worth it?",
            result: {
                worth:    "You risked it all for autonomy, driven by a dream to build something real.",
                notWorth: "You stayed secure, preserving resources for the right opportunity.",
                balanced: "You mapped a slower entry—testing the waters before the plunge."
            },
            images: {
                worth:    "assets/scenario6,a1.png",
                notWorth: "assets/scenario6,a2.png",
                balanced: "assets/scenario6,a3.png"
            }
        },
        {
            title: "Taking a Break",
            description: "You're burned out and want to take a sabbatical to reconnect with yourself, but it might slow your career momentum. What do you weigh?",
            result: {
                worth:    "You chose healing and clarity over pressure and productivity.",
                notWorth: "You stayed the course, trusting growth within your current rhythm.",
                balanced: "You carved a pocket of rest into your journey—without leaving it behind."
            },
            images: {
                worth:    "assets/scenario7,a1.png",
                notWorth: "assets/scenario7,a2.png",
                balanced: "assets/scenario7,a3.png"
            }
        },
        {
            title: "Speaking Out",
            description: "You see injustice at work but speaking up might cost you relationships or promotions. What's worth more in the moment?",
            result: {
                worth:    "You spoke your truth, prioritizing justice over personal comfort.",
                notWorth: "You chose diplomacy and strategy, protecting your influence for later change.",
                balanced: "You waited, seeking allies to amplify your voice wisely."
            },
            images: {
                worth:    "assets/scenario8,a1.png",
                notWorth: "assets/scenario8,a2.png",
                balanced: "assets/scenario8,a3.png"
            }
        },
        {
            title: "Helping a Stranger",
            description: "You come across someone in need. Helping would cost you time and money, but it might change their life. What goes on your scale?",
            result: {
                worth:    "You gave selflessly, knowing one act of kindness can shift a life.",
                notWorth: "You conserved your resources, honoring your own limits.",
                balanced: "You helped in a way that balanced generosity with sustainability."
            },
            images: {
                worth:    "assets/scenario9,a1.png",
                notWorth: "assets/scenario9,a2.png",
                balanced: "assets/scenario9,a3.png"
            }
        },
        {
            title: "Returning to School",
            description: "You're considering going back to school to pursue a long-held dream, but it means time, debt, and starting over. What do you prioritize?",
            result: {
                worth:    "You pursued your dream, believing it's never too late to begin again.",
                notWorth: "You honored your current responsibilities, recognizing timing is key.",
                balanced: "You planned thoughtfully—keeping your dream alive while staying grounded."
            },
            images: {
                worth:    "assets/scenario10,a1.png",
                notWorth: "assets/scenario10,a2.png",
                balanced: "assets/scenario10,a3.png"
            }
        }
    ];


    // ─── About modal ────────────────────────────────────────────────────────────

    function toggleAbout() {
        aboutModal.classList.toggle('visible');
    }


    // ─── Old scale-section logic (unchanged) ────────────────────────────────────

    function loadScenario(index) {
        if (index >= scenarios.length) {
            currentScenarioIndex = 0;
            index = 0;
        }
        const scenario = scenarios[index];
        document.getElementById('scenarioCounter').textContent = `Scenario ${index + 1} of ${scenarios.length}`;
        scenarioTitle.textContent       = scenario.title;
        scenarioDescription.textContent = scenario.description;

        leftPanWeight  = 0;
        rightPanWeight = 0;
        leftPanValues.innerHTML  = '';
        rightPanValues.innerHTML = '';
        updateScaleBalance();

        resultContainer.classList.remove('visible');
        prevScenarioBtn.disabled = index === 0;
        createValuePalette();
    }

    function createValuePalette() {
        valuesPalette.innerHTML = '';
        const values = [
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
        values.forEach(value => {
            const el = document.createElement('div');
            el.classList.add('value-draggable');
            el.textContent = value.name;
            el.setAttribute('data-weight', value.weight);
            el.setAttribute('data-value',  value.name);
            el.addEventListener('mousedown', startDrag);
            el.addEventListener('touchstart', startDrag, { passive: false });
            valuesPalette.appendChild(el);
        });
    }

    function placeOnPan(panElement, side) {
        const valueOnPan = document.createElement('div');
        valueOnPan.classList.add('value-draggable', 'value-on-pan');
        valueOnPan.textContent = draggedElement.textContent;
        valueOnPan.setAttribute('data-weight', draggedElement.getAttribute('data-weight'));
        valueOnPan.setAttribute('data-value',  draggedElement.getAttribute('data-value'));
        panElement.appendChild(valueOnPan);

        const weight = parseInt(draggedElement.getAttribute('data-weight'));
        if (side === 'left') leftPanWeight  += weight;
        else                 rightPanWeight += weight;

        draggedElement.remove();
        updateScaleBalance();
        checkForResult();
    }

    function returnToPalette() {
        const newValue = document.createElement('div');
        newValue.classList.add('value-draggable');
        newValue.textContent = draggedElement.textContent;
        newValue.setAttribute('data-weight', draggedElement.getAttribute('data-weight'));
        newValue.setAttribute('data-value',  draggedElement.getAttribute('data-value'));
        newValue.addEventListener('mousedown', startDrag);
        newValue.addEventListener('touchstart', startDrag, { passive: false });
        valuesPalette.appendChild(newValue);
        draggedElement.remove();
    }

    function updateScaleBalance() {
        const totalWeight = leftPanWeight + rightPanWeight;
        if (totalWeight === 0) {
            scaleBeam.style.transform = 'translateX(-50%) rotate(0deg)';
            return;
        }
        const angle = ((rightPanWeight - leftPanWeight) / totalWeight) * 15;
        scaleBeam.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }

    function checkForResult() {
        if (leftPanValues.children.length + rightPanValues.children.length >= 3) {
            setTimeout(showResult, 1000);
        }
    }

    function showResult() {
        const scenario = scenarios[currentScenarioIndex];
        let resultKey = 'balanced';
        if (leftPanWeight  > rightPanWeight + 2) resultKey = 'notWorth';
        else if (rightPanWeight > leftPanWeight + 2) resultKey = 'worth';

        resultText.textContent = scenario.result[resultKey];

        resultImageContainer.innerHTML = '';
        const img = document.createElement('img');
        img.classList.add('result-image');
        img.src = scenario.images[resultKey];
        img.alt = `Result: ${resultKey}`;
        resultImageContainer.appendChild(img);

        resultContainer.classList.add('visible');
    }


    // ─── Unified drag ────────────────────────────────────────────────────────────
    // Handles both old .value-draggable chips (old scale section)
    // and new .sg-chip chips (scenario sections).

    function startDrag(e) {
        if (e.type === 'touchstart') e.preventDefault();

        // Don't drag chips that have already been placed in a pan
        if (this.closest('.sg-pan') || this.closest('.pan-values')) return;

        document.body.style.overflow = 'hidden';

        isDragging     = true;
        draggedElement = this;
        draggedElement.classList.add('dragging');

        const parentSection = this.closest('.scenario-section');
        const rect    = draggedElement.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        draggedElement.setAttribute('data-offset-x', clientX - rect.left);
        draggedElement.setAttribute('data-offset-y', clientY - rect.top);

        if (parentSection) {
            // Scenario chip — use fixed positioning so it escapes the section's
            // overflow:hidden and absolute coordinate space
            activeSectionEl = parentSection;
            const pans      = parentSection.querySelectorAll('.sg-pan');
            activeSacrifPan = pans[0];
            activeGainPan   = pans[1];

            draggedElement.dataset.origTop   = draggedElement.style.top   || '';
            draggedElement.dataset.origLeft  = draggedElement.style.left  || '';
            draggedElement.dataset.origRight = draggedElement.style.right || '';
            draggedElement.style.position    = 'fixed';
        } else {
            // Old palette chip
            draggedElement.style.position = 'absolute';
        }

        draggedElement.style.zIndex = '1000';
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
        if (activeSectionEl) {
            // Scenario mode — highlight active section's pans
            if (!activeSacrifPan || !activeGainPan) return;
            activeSacrifPan.style.borderColor = 'rgba(245,240,232,0.15)';
            activeGainPan.style.borderColor   = 'rgba(245,240,232,0.15)';
            const sr = activeSacrifPan.getBoundingClientRect();
            const gr = activeGainPan.getBoundingClientRect();
            if (x >= sr.left && x <= sr.right && y >= sr.top && y <= sr.bottom)
                activeSacrifPan.style.borderColor = 'rgba(245,240,232,0.5)';
            else if (x >= gr.left && x <= gr.right && y >= gr.top && y <= gr.bottom)
                activeGainPan.style.borderColor   = 'rgba(245,240,232,0.5)';
        } else {
            // Old scale mode
            const lp = document.getElementById('scaleLeftPan');
            const rp = document.getElementById('scaleRightPan');
            lp.style.backgroundColor = 'transparent';
            rp.style.backgroundColor = 'transparent';
            const lr = lp.getBoundingClientRect();
            const rr = rp.getBoundingClientRect();
            if (x >= lr.left && x <= lr.right && y >= lr.top && y <= lr.bottom)
                lp.style.backgroundColor = 'rgba(255,255,255,0.12)';
            else if (x >= rr.left && x <= rr.right && y >= rr.top && y <= rr.bottom)
                rp.style.backgroundColor = 'rgba(255,255,255,0.12)';
        }
    }

    function stopDrag(e) {
        if (!isDragging) return;

        document.body.style.overflow = '';

        const x = e.clientX ?? (e.changedTouches && e.changedTouches[0].clientX);
        const y = e.clientY ?? (e.changedTouches && e.changedTouches[0].clientY);

        draggedElement.classList.remove('dragging');

        if (activeSectionEl) {
            // Reset pan highlights
            if (activeSacrifPan) activeSacrifPan.style.borderColor = '';
            if (activeGainPan)   activeGainPan.style.borderColor   = '';

            const sr       = activeSacrifPan.getBoundingClientRect();
            const gr       = activeGainPan.getBoundingClientRect();
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
        } else {
            // Old scale section
            const lp = document.getElementById('scaleLeftPan');
            const rp = document.getElementById('scaleRightPan');
            lp.style.backgroundColor = 'transparent';
            rp.style.backgroundColor = 'transparent';
            const lr = lp.getBoundingClientRect();
            const rr = rp.getBoundingClientRect();

            if (x >= lr.left && x <= lr.right && y >= lr.top && y <= lr.bottom)
                placeOnPan(leftPanValues, 'left');
            else if (x >= rr.left && x <= rr.right && y >= rr.top && y <= rr.bottom)
                placeOnPan(rightPanValues, 'right');
            else
                returnToPalette();
        }

        isDragging     = false;
        draggedElement = null;
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

    function showSectionResult(sectionEl) {
        if (sectionEl.querySelector('.sg-result')) return;

        const idx      = parseInt(sectionEl.id.split('-')[1]) - 1;
        const n        = idx + 1;
        const scenario = scenarios[idx];
        const w        = sectionWeights[sectionEl.id] || { left: 0, right: 0 };

        let resultKey = 'balanced';
        if (w.left  > w.right + 2)  resultKey = 'notWorth';
        else if (w.right > w.left + 2) resultKey = 'worth';

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
        bgImg.src             = `assets/s${n}_${resultKey}.png`;
        bgImg.alt             = '';
        bgImg.style.cssText   =
            'width:100%;height:100%;object-fit:cover;object-position:center;display:block;';
        bgImg.onerror = () => { resultBg.style.background = '#0d0d0d'; };
        resultBg.appendChild(bgImg);

        // 3. Dark overlay inside the result bg
        const overlay = document.createElement('div');
        overlay.style.cssText =
            'position:absolute;inset:0;z-index:7;background:rgba(13,13,13,0.6);';
        resultBg.appendChild(overlay);

        sectionEl.appendChild(resultBg);

        // Trigger transition after browser registers initial opacity: 0
        requestAnimationFrame(() => requestAnimationFrame(() => {
            resultBg.style.opacity = '1';
        }));

        // 5. Result text in center block (z-index 10, above everything)
        const resultEl = document.createElement('div');
        resultEl.className   = 'sg-result';
        resultEl.textContent = scenario.result[resultKey];
        sectionEl.querySelector('.sg-center').appendChild(resultEl);
        requestAnimationFrame(() => resultEl.classList.add('visible'));

        // 6. Reset when section scrolls out of view
        const resetObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    // Fade fragments back in
                    sectionEl.querySelectorAll('.img-fragment').forEach(frag => {
                        frag.style.opacity = '1';
                    });
                    // Remove result background and result text
                    resultBg.remove();
                    const sgResult = sectionEl.querySelector('.sg-result');
                    if (sgResult) sgResult.remove();

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

        const anchor = document.querySelector('.scale-section');

        scenarios.forEach((scenario, i) => {
            const n = i + 1;
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
                line.className  = cls;
                line.style[prop] = val;
                section.appendChild(line);
            });

            // 3. Image fragments
            [
                { suffix: 'tl', w: '20%', aspect: '1/1', top:    '5%', left:  '2%',  rot: '-2.5deg' },
                { suffix: 'tr', w: '16%', aspect: '1/1', top:    '3%', right: '4%',  rot:  '2deg'   },
                { suffix: 'bl', w: '18%', aspect: '1/1', bottom: '7%', left:  '5%',  rot:  '1deg'   },
                { suffix: 'br', w: '14%', aspect: '1/1', bottom: '4%', right: '3%',  rot: '-1.5deg' }
            ].forEach(({ suffix, w, aspect, top, bottom, left, right, rot }) => {
                const frag = document.createElement('div');
                frag.className      = 'img-fragment';
                frag.style.width    = w;
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
                    frag.style.background = '#161616';
                    frag.style.border     = '0.5px solid rgba(245,240,232,0.08)';
                    img.style.display     = 'none';
                };
                frag.appendChild(img);
                section.appendChild(frag);
            });

            // 6. Scattered italic quotes
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

            // 7. Center block
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

            // 8. Value chips with drag listeners
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

            // 9. Bottom labels
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

    nextScenarioBtn.addEventListener('click', () => {
        currentScenarioIndex++;
        loadScenario(currentScenarioIndex);
    });

    prevScenarioBtn.addEventListener('click', () => {
        if (currentScenarioIndex > 0) {
            currentScenarioIndex--;
            loadScenario(currentScenarioIndex);
        }
    });

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
    loadScenario(0);

    // Logo scroll animation — full screen on load, shrinks to corner
    const heroLogo = document.getElementById('hero-logo');

    console.log('hero-logo src:', heroLogo.src);

    // Fade in on load — hero state: oversized bleed, multiply blend
    requestAnimationFrame(() => {
        heroLogo.style.transition = 'opacity 1.2s ease';
        heroLogo.style.opacity    = '1';
    });

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const progress = Math.min(window.scrollY / window.innerHeight, 1);

                // Toggle blend mode class at midpoint
                if (progress > 0.5) {
                    heroLogo.classList.add('logo-dark-mode');
                } else {
                    heroLogo.classList.remove('logo-dark-mode');
                }

                if (progress < 1) {
                    // Interpolate from oversized bleed to corner size
                    const bleedW   = window.innerWidth  * 1.1;
                    const bleedH   = window.innerHeight * 1.1;
                    const cornerW  = 160;
                    const currentW = bleedW  - (progress * (bleedW  - cornerW));
                    const currentH = bleedH  - (progress * (bleedH  - 0));   // height auto handled by contain

                    const startTop  = window.innerHeight * -0.05;
                    const startLeft = window.innerWidth  * -0.05;
                    const currentTop  = startTop  + (progress * (16 - startTop));
                    const currentLeft = startLeft + (progress * (18 - startLeft));

                    const currentOpacity = 1 - (progress * 0.15);

                    heroLogo.style.transition   = 'none';
                    heroLogo.style.width        = currentW + 'px';
                    heroLogo.style.height       = progress < 0.05 ? '110vh' : 'auto';
                    heroLogo.style.objectFit    = progress < 0.05 ? 'cover' : 'contain';
                    heroLogo.style.top          = currentTop + 'px';
                    heroLogo.style.left         = currentLeft + 'px';
                    heroLogo.style.opacity      = currentOpacity;
                } else {
                    heroLogo.style.transition   = 'none';
                    heroLogo.style.width        = '160px';
                    heroLogo.style.height       = 'auto';
                    heroLogo.style.objectFit    = 'contain';
                    heroLogo.style.top          = '16px';
                    heroLogo.style.left         = '18px';
                    heroLogo.style.opacity      = '0.85';
                }

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    const revealLines = document.querySelectorAll('.reveal-line');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(revealLines).indexOf(entry.target);
                setTimeout(() => entry.target.classList.add('visible'), index * 200);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    revealLines.forEach(line => revealObserver.observe(line));
});
