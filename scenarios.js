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

    // Drag state
    let isDragging      = false;
    let draggedElement  = null; // clone — the visual ghost
    let dragOrigin      = null; // original chip in stage
    let activeSacrifPan = null;
    let activeGainPan   = null;

    function getStage() {
        return document.getElementById('scenario-stage');
    }


    // ─── Build scenario ───────────────────────────────────────────────────────────

    function buildScenario(index) {
        currentScenarioIndex = index;
        currentWeights       = { left: 0, right: 0 };

        const stage = getStage();
        stage.innerHTML = '';
        // Reset only layout properties — preserve opacity/transition set by advanceScenario
        stage.style.display        = '';
        stage.style.flexDirection  = '';
        stage.style.justifyContent = '';
        stage.style.alignItems     = '';
        stage.style.textAlign      = '';
        stage.style.padding        = '';

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
                frag.style.background = 'rgba(28,21,16,0.06)';
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

        // Commit button — hidden until both pans have at least 1 chip
        const commitBtn = document.createElement('button');
        commitBtn.id          = 'commit-btn';
        commitBtn.textContent = 'is this worth it to you?';
        commitBtn.style.cssText =
            'position:absolute;bottom:80px;left:50%;transform:translateX(-50%);z-index:20;' +
            'font-family:"Cormorant Garamond",serif;font-style:italic;' +
            'font-size:clamp(13px,1.4vw,17px);color:var(--text-primary);' +
            'background:transparent;border:0.5px solid var(--border-mid);' +
            'padding:10px 28px;border-radius:0;cursor:pointer;' +
            'opacity:0;transition:opacity 0.5s ease;pointer-events:none;' +
            'white-space:nowrap;';
        commitBtn.addEventListener('click', () => {
            commitBtn.style.opacity      = '0';
            commitBtn.style.pointerEvents = 'none';
            showResult(index);
        });
        stage.appendChild(commitBtn);

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


    // ─── Commit button visibility ─────────────────────────────────────────────────

    function checkCommitBtn() {
        const stage = getStage();
        const pans  = stage.querySelectorAll('.sg-pan');
        if (pans.length < 2) return;
        const leftHas  = pans[0].querySelectorAll('.sg-chip-dropped').length > 0;
        const rightHas = pans[1].querySelectorAll('.sg-chip-dropped').length > 0;
        const btn = document.getElementById('commit-btn');
        if (!btn) return;
        if (leftHas && rightHas) {
            btn.style.opacity      = '1';
            btn.style.pointerEvents = 'all';
        } else {
            btn.style.opacity      = '0';
            btn.style.pointerEvents = 'none';
        }
    }


    // ─── Result drawer ────────────────────────────────────────────────────────────

    function showResult(index) {
        const existing = document.getElementById('result-drawer');
        if (existing) existing.remove();

        const stage    = getStage();
        const scenario = scenarios[index];
        const n        = index + 1;
        const w        = currentWeights;

        let resultKey = 'balanced';
        if (w.left  > w.right + 2)  resultKey = 'notWorth';
        else if (w.right > w.left + 2) resultKey = 'worth';

        const verdictMap = {
            worth:    'WORTH IT.',
            notWorth: 'NOT WORTH IT.',
            balanced: 'BALANCED.'
        };

        // Dim stage behind drawer
        stage.style.transition = 'opacity 0.5s ease';
        stage.style.opacity    = '0.4';

        // Build drawer
        const drawer = document.createElement('div');
        drawer.id = 'result-drawer';
        drawer.style.cssText =
            'position:fixed;bottom:0;left:0;right:0;height:55vh;' +
            'background:#1c1510;z-index:50;' +
            'transform:translateY(100%);' +
            'transition:transform 0.7s cubic-bezier(0.16,1,0.3,1);' +
            'padding:40px 10vw;display:flex;flex-direction:column;' +
            'align-items:center;justify-content:center;gap:16px;' +
            'box-sizing:border-box;';

        // Verdict
        const verdictEl = document.createElement('div');
        verdictEl.style.cssText =
            'font-family:"Bebas Neue",sans-serif;font-size:clamp(36px,5vw,56px);' +
            'color:#e8e3d8;letter-spacing:0.05em;line-height:1;';
        verdictEl.textContent = verdictMap[resultKey];

        // Description
        const descEl = document.createElement('div');
        descEl.style.cssText =
            'font-family:"Cormorant Garamond",serif;font-style:italic;' +
            'font-size:clamp(13px,1.5vw,17px);color:rgba(232,227,216,0.65);' +
            'max-width:480px;text-align:center;line-height:1.6;';
        descEl.textContent = scenario.result[resultKey];

        // Result image
        const resultImg = document.createElement('img');
        resultImg.src           = `assets/s${n}_${resultKey}.png`;
        resultImg.alt           = '';
        resultImg.style.cssText = 'max-width:180px;height:auto;object-fit:cover;display:block;margin:0 auto;';
        resultImg.onerror = () => { resultImg.style.display = 'none'; };

        // Next button
        const isLast  = index >= scenarios.length - 1;
        const nextBtn = document.createElement('button');
        nextBtn.style.cssText =
            'font-family:"Inter Tight",sans-serif;font-size:10px;letter-spacing:0.22em;' +
            'text-transform:uppercase;color:rgba(232,227,216,0.5);background:transparent;' +
            'border:0.5px solid rgba(232,227,216,0.2);padding:8px 20px;border-radius:0;' +
            'cursor:pointer;margin-top:8px;transition:color 0.2s ease,border-color 0.2s ease;';
        nextBtn.textContent = isLast ? 'that\'s a wrap.' : 'next scenario →';
        nextBtn.addEventListener('mouseenter', () => {
            nextBtn.style.color       = 'rgba(232,227,216,0.9)';
            nextBtn.style.borderColor = 'rgba(232,227,216,0.5)';
        });
        nextBtn.addEventListener('mouseleave', () => {
            nextBtn.style.color       = 'rgba(232,227,216,0.5)';
            nextBtn.style.borderColor = 'rgba(232,227,216,0.2)';
        });
        nextBtn.addEventListener('click', () => {
            drawer.style.transform  = 'translateY(100%)';
            stage.style.opacity     = '1';
            setTimeout(() => {
                drawer.remove();
                advanceScenario(index);
            }, 400);
        });

        drawer.appendChild(verdictEl);
        drawer.appendChild(descEl);
        drawer.appendChild(resultImg);
        drawer.appendChild(nextBtn);
        document.body.appendChild(drawer);

        // Slide up
        requestAnimationFrame(() => requestAnimationFrame(() => {
            drawer.style.transform = 'translateY(0)';
        }));
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
                stage.style.transition = 'opacity 0.5s ease';
                stage.style.opacity    = '1';
            });
        }, 500);
    }


    // ─── Final state ──────────────────────────────────────────────────────────────

    function showFinalState() {
        const stage = getStage();
        stage.innerHTML       = '';
        stage.style.display        = 'flex';
        stage.style.flexDirection  = 'column';
        stage.style.justifyContent = 'center';
        stage.style.alignItems     = 'center';
        stage.style.textAlign      = 'center';
        stage.style.padding        = '0 10vw';

        const mainText = document.createElement('div');
        mainText.style.cssText =
            'font-family:"Cormorant Garamond",serif;font-style:italic;' +
            'font-size:clamp(36px,5vw,56px);color:var(--text-primary);line-height:1.1;';
        mainText.textContent = 'for what it\u2019s worth,';

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

        isDragging = true;
        dragOrigin = this;

        const rect    = this.getBoundingClientRect();
        const clientX = e.clientX ?? e.touches[0].clientX;
        const clientY = e.clientY ?? e.touches[0].clientY;

        // Create a fixed-position clone as the drag ghost
        draggedElement = this.cloneNode(true);
        draggedElement.classList.add('dragging');
        draggedElement.style.position      = 'fixed';
        draggedElement.style.zIndex        = '999';
        draggedElement.style.pointerEvents = 'none';
        draggedElement.style.width         = rect.width + 'px';
        draggedElement.style.margin        = '0';
        draggedElement.setAttribute('data-offset-x', clientX - rect.left);
        draggedElement.setAttribute('data-offset-y', clientY - rect.top);
        document.body.appendChild(draggedElement);

        // Hide original in place
        this.style.opacity       = '0';
        this.style.pointerEvents = 'none';

        const stage = getStage();
        const pans  = stage.querySelectorAll('.sg-pan');
        activeSacrifPan = pans[0];
        activeGainPan   = pans[1];

        moveAt(clientX, clientY);
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

        if (activeSacrifPan) activeSacrifPan.style.borderColor = '';
        if (activeGainPan)   activeGainPan.style.borderColor   = '';

        // Remove the clone ghost
        draggedElement.remove();
        draggedElement = null;

        const sr = activeSacrifPan ? activeSacrifPan.getBoundingClientRect() : null;
        const gr = activeGainPan   ? activeGainPan.getBoundingClientRect()   : null;

        if (sr && x >= sr.left && x <= sr.right && y >= sr.top && y <= sr.bottom) {
            placeOnPan(activeSacrifPan, 'left');
        } else if (gr && x >= gr.left && x <= gr.right && y >= gr.top && y <= gr.bottom) {
            placeOnPan(activeGainPan, 'right');
        } else {
            returnChip();
        }

        activeSacrifPan = null;
        activeGainPan   = null;
        isDragging      = false;
        dragOrigin      = null;
    }

    function placeOnPan(panEl, side) {
        const chip = document.createElement('div');
        chip.className   = 'sg-chip sg-chip-dropped';
        chip.textContent = dragOrigin.textContent;
        chip.setAttribute('data-weight', dragOrigin.getAttribute('data-weight'));
        panEl.appendChild(chip);

        const weight = parseInt(dragOrigin.getAttribute('data-weight'));
        if (side === 'left') currentWeights.left  += weight;
        else                 currentWeights.right += weight;

        // Remove the original from the stage palette
        dragOrigin.remove();
        updateTilt();
        checkCommitBtn();
    }

    function returnChip() {
        // Original never moved — just restore its visibility
        dragOrigin.style.opacity       = '1';
        dragOrigin.style.pointerEvents = 'auto';
    }


    // ─── Global event listeners ───────────────────────────────────────────────────

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   stopDrag);
    document.addEventListener('touchmove', onMouseMove,  { passive: false });
    document.addEventListener('touchend',  stopDrag);


    // ─── Init ─────────────────────────────────────────────────────────────────────

    buildScenario(0);
});
