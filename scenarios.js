document.addEventListener('DOMContentLoaded', () => {

    // ─── About modal ─────────────────────────────────────────────────────────────

    const aboutToggle = document.getElementById('aboutToggle');
    const aboutModal  = document.getElementById('aboutModal');
    const aboutClose  = aboutModal.querySelector('.about-close');

    function toggleAbout() {
        aboutModal.classList.toggle('visible');
    }

    aboutToggle.addEventListener('click', toggleAbout);
    aboutClose.addEventListener('click', toggleAbout);
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) toggleAbout();
    });


    // ─── Scenario data ────────────────────────────────────────────────────────────

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


    // ─── State ────────────────────────────────────────────────────────────────────

    let currentScenarioIndex = 0;
    let currentWeights       = { left: 0, right: 0 };
    let resultShown          = false;

    // Drag state
    let isDragging      = false;
    let draggedElement  = null;
    let activeSacrifPan = null;
    let activeGainPan   = null;

    function getStage() {
        return document.getElementById('scenario-stage');
    }


    // ─── Build scenario ───────────────────────────────────────────────────────────

    function buildScenario(index) {
        currentScenarioIndex = index;
        currentWeights       = { left: 0, right: 0 };
        resultShown          = false;

        const stage    = getStage();
        stage.innerHTML = '';

        // Clear any flex layout from final state
        stage.style.cssText = '';

        const scenario = scenarios[index];
        const n        = index + 1;

        // Grid overlay
        const grid = document.createElement('div');
        grid.className = 'sg-grid';
        stage.appendChild(grid);

        // Hairlines
        [['sg-hairline-h', 'top',  '33%'],
         ['sg-hairline-h', 'top',  '66%'],
         ['sg-hairline-v', 'left', '33%'],
         ['sg-hairline-v', 'left', '66%']].forEach(([cls, prop, val]) => {
            const line = document.createElement('div');
            line.className   = cls;
            line.style[prop] = val;
            stage.appendChild(line);
        });

        // Image fragments (4 corners)
        [
            { suffix: 'tl', w: '20%', top:    '5%', left:  '2%',  rot: '-2.5deg' },
            { suffix: 'tr', w: '16%', top:    '3%', right: '4%',  rot:  '2deg'   },
            { suffix: 'bl', w: '18%', bottom: '7%', left:  '5%',  rot:  '1deg'   },
            { suffix: 'br', w: '14%', bottom: '4%', right: '3%',  rot: '-1.5deg' }
        ].forEach(({ suffix, w, top, bottom, left, right, rot }) => {
            const frag = document.createElement('div');
            frag.className         = 'img-fragment';
            frag.style.width       = w;
            frag.style.aspectRatio = '1/1';
            frag.style.transform   = `rotate(${rot})`;
            if (top)    frag.style.top    = top;
            if (bottom) frag.style.bottom = bottom;
            if (left)   frag.style.left   = left;
            if (right)  frag.style.right  = right;

            const img = document.createElement('img');
            img.src           = `assets/s${n}_${suffix}.png`;
            img.alt           = '';
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
            img.onerror = () => {
                frag.style.background = '#d4cfc4';
                frag.style.border     = '0.5px solid rgba(28,21,16,0.1)';
                img.style.display     = 'none';
            };
            frag.appendChild(img);
            stage.appendChild(frag);
        });

        // Scattered italic quotes
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
            stage.appendChild(q);
        });

        // Center block
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
        stage.appendChild(center);

        // Value chips
        chipValues.forEach((val, vi) => {
            const chip = document.createElement('div');
            chip.className   = 'sg-chip';
            chip.textContent = val.name;
            chip.setAttribute('data-weight', val.weight);
            const pos = chipPositions[vi];
            if (pos.top)   chip.style.top   = pos.top;
            if (pos.left)  chip.style.left  = pos.left;
            if (pos.right) chip.style.right = pos.right;
            chip.addEventListener('mousedown',  startDrag);
            chip.addEventListener('touchstart', startDrag, { passive: false });
            stage.appendChild(chip);
        });

        // Bottom labels
        const lblLeft = document.createElement('div');
        lblLeft.className   = 'sg-bottom-label sg-bottom-left';
        lblLeft.textContent = 'drag values to weigh';
        stage.appendChild(lblLeft);

        const lblRight = document.createElement('div');
        lblRight.className   = 'sg-bottom-label sg-bottom-right';
        lblRight.textContent = `${n} / ${scenarios.length}`;
        stage.appendChild(lblRight);
    }


    // ─── Tilt ─────────────────────────────────────────────────────────────────────

    function updateTilt() {
        const pansEl = getStage().querySelector('.sg-pans');
        if (!pansEl) return;
        const diff  = currentWeights.right - currentWeights.left;
        const angle = Math.max(-8, Math.min(8, diff * 1.5));
        pansEl.style.transition = 'transform 0.4s ease';
        pansEl.style.transform  = `rotate(${angle}deg)`;
    }


    // ─── Result reveal ────────────────────────────────────────────────────────────

    function checkForResult() {
        if (resultShown) return;
        const stage = getStage();
        let total = 0;
        stage.querySelectorAll('.sg-pan').forEach(p => {
            total += p.querySelectorAll('.sg-chip-dropped').length;
        });
        if (total >= 3) {
            resultShown = true;
            setTimeout(() => showResult(currentScenarioIndex), 800);
        }
    }

    function showResult(index) {
        const stage    = getStage();
        const scenario = scenarios[index];
        const n        = index + 1;
        const w        = currentWeights;

        let resultKey = 'balanced';
        if (w.left  > w.right + 2) resultKey = 'notWorth';
        else if (w.right > w.left + 2) resultKey = 'worth';

        const verdictMap = {
            worth:    'worth it.',
            notWorth: 'not worth it.',
            balanced: 'balanced.'
        };

        // 1. Fade out image fragments
        stage.querySelectorAll('.img-fragment').forEach(frag => {
            frag.style.transition = 'opacity 0.6s ease';
            frag.style.opacity    = '0';
        });

        // 2. Full-bleed result background
        const resultBg = document.createElement('div');
        resultBg.className    = 'sg-result-bg';
        resultBg.style.cssText =
            'position:absolute;inset:0;z-index:6;opacity:0;transition:opacity 0.8s ease;';

        const bgImg = document.createElement('img');
        bgImg.src           = `assets/s${n}_${resultKey}.png`;
        bgImg.alt           = '';
        bgImg.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:center;display:block;';
        bgImg.onerror = () => { resultBg.style.background = '#1c1510'; };
        resultBg.appendChild(bgImg);

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:absolute;inset:0;z-index:7;background:rgba(13,13,13,0.55);';
        resultBg.appendChild(overlay);

        stage.appendChild(resultBg);
        requestAnimationFrame(() => requestAnimationFrame(() => {
            resultBg.style.opacity = '1';
        }));

        // 3. Result bar with verdict, description, next button
        const resultBar = document.createElement('div');
        resultBar.className    = 'sg-result-bar';
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

        const isLast  = index >= scenarios.length - 1;
        const nextBtn = document.createElement('button');
        nextBtn.textContent = isLast ? 'finish →' : 'next →';
        nextBtn.style.cssText =
            'font-family:"Inter Tight",sans-serif;font-size:10px;letter-spacing:0.2em;' +
            'text-transform:uppercase;background:transparent;' +
            'border:0.5px solid rgba(232,227,216,0.4);color:rgba(232,227,216,0.7);' +
            'padding:8px 20px;cursor:pointer;margin-top:1.5rem;' +
            'display:block;margin-left:auto;margin-right:auto;' +
            'transition:color 0.2s ease,border-color 0.2s ease;';
        nextBtn.addEventListener('mouseenter', () => {
            nextBtn.style.color       = 'rgba(232,227,216,1)';
            nextBtn.style.borderColor = 'rgba(232,227,216,0.8)';
        });
        nextBtn.addEventListener('mouseleave', () => {
            nextBtn.style.color       = 'rgba(232,227,216,0.7)';
            nextBtn.style.borderColor = 'rgba(232,227,216,0.4)';
        });

        resultBar.appendChild(verdictEl);
        resultBar.appendChild(descEl);
        resultBar.appendChild(nextBtn);
        stage.appendChild(resultBar);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            resultBar.style.opacity = '1';
        }));

        // 4. Advance on click or after 2s
        let advanced = false;
        const doAdvance = () => {
            if (advanced) return;
            advanced = true;
            advanceScenario(index);
        };
        nextBtn.addEventListener('click', doAdvance);
        setTimeout(doAdvance, 2000);
    }


    // ─── Scenario transition ──────────────────────────────────────────────────────

    function advanceScenario(index) {
        const stage = getStage();
        stage.style.transition = 'opacity 0.5s ease';
        stage.style.opacity    = '0';

        setTimeout(() => {
            if (index + 1 < scenarios.length) {
                buildScenario(index + 1);
            } else {
                showFinalState();
            }
            requestAnimationFrame(() => {
                stage.style.opacity = '1';
            });
        }, 500);
    }


    // ─── Final state ──────────────────────────────────────────────────────────────

    function showFinalState() {
        const stage = getStage();
        stage.innerHTML   = '';
        stage.style.cssText =
            'position:fixed;inset:0;width:100vw;height:100vh;background:#e8e3d8;' +
            'overflow:hidden;z-index:10;display:flex;flex-direction:column;' +
            'justify-content:center;align-items:center;text-align:center;padding:0 10vw;' +
            'opacity:1;transition:opacity 0.5s ease;';

        const mainText = document.createElement('div');
        mainText.style.cssText =
            'font-family:"Cormorant Garamond",serif;font-style:italic;' +
            'font-size:clamp(36px,5vw,56px);color:var(--text-primary);line-height:1.1;';
        mainText.textContent = 'for what it\'s worth,';

        const subText = document.createElement('div');
        subText.style.cssText =
            'font-family:"Cormorant Garamond",serif;font-style:italic;' +
            'font-size:clamp(36px,5vw,56px);color:var(--text-primary);opacity:0.4;' +
            'line-height:1.1;margin-top:0.5rem;';
        subText.textContent = 'you made the choice.';

        const byline = document.createElement('div');
        byline.style.cssText =
            'font-family:"Inter Tight",sans-serif;font-size:10px;letter-spacing:0.25em;' +
            'text-transform:uppercase;color:var(--text-primary);opacity:0.25;margin-top:3rem;';
        byline.textContent = 'Mi\u2019Lah Clark \u2014 2025';

        const startOver = document.createElement('a');
        startOver.href         = 'index.html';
        startOver.style.cssText =
            'font-family:"Inter Tight",sans-serif;font-size:10px;letter-spacing:0.2em;' +
            'text-transform:uppercase;color:var(--text-primary);opacity:0.3;' +
            'margin-top:2rem;display:block;text-decoration:none;transition:opacity 0.2s ease;';
        startOver.textContent = '\u2190 start over';
        startOver.addEventListener('mouseenter', () => { startOver.style.opacity = '0.7'; });
        startOver.addEventListener('mouseleave', () => { startOver.style.opacity = '0.3'; });

        stage.appendChild(mainText);
        stage.appendChild(subText);
        stage.appendChild(byline);
        stage.appendChild(startOver);
    }


    // ─── Drag ─────────────────────────────────────────────────────────────────────

    function startDrag(e) {
        e.preventDefault();
        if (this.closest('.sg-pan')) return;

        document.body.style.userSelect       = 'none';
        document.body.style.webkitUserSelect = 'none';

        isDragging     = true;
        draggedElement = this;
        draggedElement.classList.add('dragging');

        const stage = getStage();
        const pans  = stage.querySelectorAll('.sg-pan');
        activeSacrifPan = pans[0];
        activeGainPan   = pans[1];

        const rect    = draggedElement.getBoundingClientRect();
        const clientX = e.clientX ?? e.touches[0].clientX;
        const clientY = e.clientY ?? e.touches[0].clientY;

        draggedElement.setAttribute('data-offset-x', clientX - rect.left);
        draggedElement.setAttribute('data-offset-y', clientY - rect.top);

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
        const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
        const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
        if (clientX == null) return;
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

        document.body.style.userSelect       = '';
        document.body.style.webkitUserSelect = '';

        const x = e.clientX ?? (e.changedTouches && e.changedTouches[0].clientX);
        const y = e.clientY ?? (e.changedTouches && e.changedTouches[0].clientY);

        draggedElement.classList.remove('dragging');
        if (activeSacrifPan) activeSacrifPan.style.borderColor = '';
        if (activeGainPan)   activeGainPan.style.borderColor   = '';

        const sr    = activeSacrifPan ? activeSacrifPan.getBoundingClientRect() : null;
        const gr    = activeGainPan   ? activeGainPan.getBoundingClientRect()   : null;
        const stage = getStage();

        if (sr && x >= sr.left && x <= sr.right && y >= sr.top && y <= sr.bottom) {
            placeOnPan(activeSacrifPan, 'left');
        } else if (gr && x >= gr.left && x <= gr.right && y >= gr.top && y <= gr.bottom) {
            placeOnPan(activeGainPan, 'right');
        } else {
            returnChip(stage);
        }

        activeSacrifPan = null;
        activeGainPan   = null;
        isDragging      = false;
        draggedElement  = null;
    }

    function placeOnPan(panEl, side) {
        const chip = document.createElement('div');
        chip.className = 'sg-chip sg-chip-dropped';
        chip.textContent = draggedElement.textContent;
        chip.setAttribute('data-weight', draggedElement.getAttribute('data-weight'));
        panEl.appendChild(chip);

        const weight = parseInt(draggedElement.getAttribute('data-weight'));
        if (side === 'left') currentWeights.left  += weight;
        else                 currentWeights.right += weight;

        draggedElement.remove();
        updateTilt();
        checkForResult();
    }

    function returnChip(stage) {
        draggedElement.style.position = 'absolute';
        draggedElement.style.top      = draggedElement.dataset.origTop   || '';
        draggedElement.style.left     = draggedElement.dataset.origLeft  || '';
        draggedElement.style.right    = draggedElement.dataset.origRight || '';
        draggedElement.style.zIndex   = '5';
        stage.appendChild(draggedElement);
    }


    // ─── Global event listeners ───────────────────────────────────────────────────

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   stopDrag);
    document.addEventListener('touchmove', onMouseMove,  { passive: false });
    document.addEventListener('touchend',  stopDrag);


    // ─── Init ─────────────────────────────────────────────────────────────────────

    buildScenario(0);
});
