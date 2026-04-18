// ─── Custom cursor — runs immediately, outside DOMContentLoaded ──────────────

(function () {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    document.addEventListener('mousemove', (e) => {
        cursor.style.left    = e.clientX + 'px';
        cursor.style.top     = e.clientY + 'px';
        cursor.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
}());


document.addEventListener('DOMContentLoaded', () => {

    // ─── Color schemes ────────────────────────────────────────────────────────────

    const schemes = [
        {
            '--bg':           '#FF69B4',
            '--text':         '#ffffff',
            '--text-sub':     'rgba(255,255,255,0.5)',
            '--accent':       '#ffffff',
            '--cursor-color': '#FFE500'
        },
        {
            '--bg':           '#0047FF',
            '--text':         '#ffffff',
            '--text-sub':     'rgba(255,255,255,0.5)',
            '--accent':       '#ffffff',
            '--cursor-color': '#FF3CAC'
        },
        {
            '--bg':           '#39FF14',
            '--text':         '#0a0a0a',
            '--text-sub':     'rgba(10,10,10,0.5)',
            '--accent':       '#0a0a0a',
            '--cursor-color': '#FF0066'
        },
        {
            '--bg':           '#C8A4D4',
            '--text':         '#ffffff',
            '--text-sub':     'rgba(255,255,255,0.5)',
            '--accent':       '#ffffff',
            '--cursor-color': '#FFE500'
        },
        {
            '--bg':           '#7D9B76',
            '--text':         '#ffffff',
            '--text-sub':     'rgba(255,255,255,0.5)',
            '--accent':       '#ffffff',
            '--cursor-color': '#FFE500'
        },
        {
            '--bg':           '#FFE156',
            '--text':         '#1a1a1a',
            '--text-sub':     'rgba(26,26,26,0.5)',
            '--accent':       '#1a1a1a',
            '--cursor-color': '#FF3CAC'
        }
    ];

    let schemeIndex = 0;
    const root   = document.documentElement;
    const cursor = document.getElementById('custom-cursor');

    function getCursorColor() {
        return getComputedStyle(root).getPropertyValue('--cursor-color').trim();
    }

    function applyScheme(idx) {
        const s = schemes[idx];
        for (const [prop, val] of Object.entries(s)) {
            root.style.setProperty(prop, val);
        }
        // Update cursor color to match new scheme
        cursor.style.color = getCursorColor();
        clearImageLayer();
    }


    // ─── Landing → Main transition ───────────────────────────────────────────────

    const landing = document.getElementById('landing');
    const main    = document.getElementById('main');
    let landingExited = false;

    document.addEventListener('click', () => {
        if (!landingExited) {
            landingExited                = true;
            landing.style.opacity        = '0';
            landing.style.pointerEvents  = 'none';
            setTimeout(() => {
                landing.style.display    = 'none';
                main.style.opacity       = '1';
                main.style.pointerEvents = 'all';
            }, 800);
        }
    });


    // ─── Word sets ────────────────────────────────────────────────────────────────

    const wordSets = {
        certainty: { words: ['certainty',  'guarantees', 'permission',      'safety',       'proof'     ], index: 0 },
        yourself:  { words: ['yourself',   'the unknown','what scares you', 'the feeling',  'chance'    ], index: 0 },
        precious:  { words: ['precious',   'fragile',    'irreplaceable',   'uncertain',    'raw'       ], index: 0 },
        dreams:    { words: ['dreams',     'ideas',      'hopes',           'fears',        'secrets'   ], index: 0 },
        time:      { words: ['time',       'money',      'energy',          'youth',        'attention' ], index: 0 },
        heart:     { words: ['heart',      'voice',      'self',            'trust',        'pride'     ], index: 0 },
        lands:     { words: ['lands',      'falls',      'ends',            'plays out',    'unfolds'   ], index: 0 },
        risk:      { words: ['risk',       'leap',       'loss',            'bet',          'sacrifice' ], index: 0 },
        reach:     { words: ['reach',      'try',        'begin',           'choose',       'go'        ], index: 0 }
    };


    // ─── Build text block ─────────────────────────────────────────────────────────

    const segments = [
        { type: 'text', content: "luck is what happens when you stop waiting for "    },
        { type: 'swap', key: 'certainty'                                               },
        { type: 'text', content: " and start betting on "                              },
        { type: 'swap', key: 'yourself'                                                },
        { type: 'text', content: ". it\u2019s tossing everything "                    },
        { type: 'swap', key: 'precious'                                                },
        { type: 'text', content: " into the air \u2014 your "                         },
        { type: 'swap', key: 'dreams'                                                  },
        { type: 'text', content: ", your "                                             },
        { type: 'swap', key: 'time'                                                    },
        { type: 'text', content: ", your "                                             },
        { type: 'swap', key: 'heart'                                                   },
        { type: 'text', content: " \u2014 not knowing how it "                        },
        { type: 'swap', key: 'lands'                                                   },
        { type: 'text', content: ". for what it\u2019s worth, the "                   },
        { type: 'swap', key: 'risk'                                                    },
        { type: 'text', content: " is always worth the "                               },
        { type: 'swap', key: 'reach'                                                   },
        { type: 'text', content: "."                                                   }
    ];

    const textBlock = document.getElementById('text-block');

    segments.forEach(seg => {
        if (seg.type === 'text') {
            textBlock.appendChild(document.createTextNode(seg.content));
        } else {
            const span = document.createElement('span');
            span.className   = 'swap-word';
            span.textContent = wordSets[seg.key].words[0];
            span.dataset.key = seg.key;
            span.addEventListener('mouseenter', () => {
                cursor.textContent = 'click';
                cursor.style.color = getCursorColor();
            });
            span.addEventListener('mouseleave', () => {
                cursor.textContent = 'try your luck';
                cursor.style.color = getCursorColor();
            });
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                cycleWord(span, seg.key);
            });
            textBlock.appendChild(span);
        }
    });


    // ─── Word cycling ─────────────────────────────────────────────────────────────

    function cycleWord(span, key) {
        const set  = wordSets[key];
        set.index  = (set.index + 1) % set.words.length;
        const next = set.words[set.index];

        span.style.opacity   = '0';
        span.style.transform = 'scale(1.08)';

        setTimeout(() => {
            span.textContent     = next;
            span.style.opacity   = '1';
            span.style.transform = 'scale(1)';
        }, 120);

        // Cursor echoes the new word, then reverts
        cursor.textContent = next;
        cursor.style.color = getCursorColor();
        setTimeout(() => {
            cursor.textContent = 'try your luck';
        }, 600);

        addImage();
    }


    // ─── Image accumulation ───────────────────────────────────────────────────────

    const allPaths = [];
    for (let i = 1; i <= 10; i++) {
        allPaths.push(`assets/s${i}_worth.png`);
        allPaths.push(`assets/s${i}_notWorth.png`);
        allPaths.push(`assets/s${i}_balanced.png`);
    }

    let queue        = shuffle([...allPaths]);
    let queueIdx     = 0;
    let visible      = [];
    const MAX_IMAGES = 8;

    // Safe to call now — visible is declared above
    applyScheme(0);

    const imageLayer = document.getElementById('image-layer');

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function addImage() {
        if (queueIdx >= queue.length) {
            queue    = shuffle([...allPaths]);
            queueIdx = 0;
        }

        const path  = queue[queueIdx++];
        const sizes = [160, 220, 280, 360, 440, 520];
        const size  = sizes[Math.floor(Math.random() * sizes.length)];
        const top   = (2  + Math.random() * 73).toFixed(1) + '%';   // 2–75%
        const left  = (2  + Math.random() * 66).toFixed(1) + '%';   // 2–68%
        const rot   = (Math.random() * 12 - 6).toFixed(2)  + 'deg'; // -6–6 deg

        const img         = document.createElement('img');
        img.src           = path;
        img.style.cssText =
            `position:absolute;` +
            `width:${size}px;height:auto;` +
            `top:${top};left:${left};` +
            `transform:rotate(${rot});` +
            `opacity:0;` +
            `transition:opacity 0.6s ease;` +
            `mix-blend-mode:multiply;` +
            `pointer-events:none;` +
            `box-shadow:2px 4px 20px rgba(0,0,0,0.12);`;

        imageLayer.appendChild(img);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            img.style.opacity = '0.85';
        }));

        visible.push(img);

        if (visible.length > MAX_IMAGES) {
            const oldest         = visible.shift();
            oldest.style.opacity = '0';
            setTimeout(() => oldest.remove(), 600);
        }
    }

    function clearImageLayer() {
        visible.forEach(img => {
            img.style.opacity = '0';
            setTimeout(() => img.remove(), 600);
        });
        visible = [];
    }


    // ─── Color cycling ────────────────────────────────────────────────────────────

    const colorBtn = document.getElementById('color-btn');

    colorBtn.addEventListener('click', () => {
        schemeIndex = (schemeIndex + 1) % schemes.length;
        applyScheme(schemeIndex);
        colorBtn.textContent = '( changing\u2026 )';
        setTimeout(() => { colorBtn.textContent = '( color )'; }, 400);
    });


    // ─── About modal ──────────────────────────────────────────────────────────────

    const aboutBtn   = document.getElementById('about-btn');
    const aboutModal = document.getElementById('about-modal');
    const aboutClose = document.getElementById('about-close');

    function toggleAbout() {
        const opening = !aboutModal.classList.contains('visible');
        aboutModal.classList.toggle('visible');
        main.classList.toggle('blurred', opening);
        landing.classList.toggle('blurred', opening);
    }

    aboutBtn.addEventListener('click',   toggleAbout);
    aboutClose.addEventListener('click', toggleAbout);
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) toggleAbout();
    });

});
