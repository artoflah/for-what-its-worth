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
            '--bg':           'rgb(255,196,255)',
            '--text':         'rgb(255,0,20)',
            '--text-sub':     'rgba(255,0,20,0.5)',
            '--accent':       'rgb(255,0,20)',
            '--cursor-color': '#0047FF',
            '--tint-opacity': '0.5'
        },
        {
            '--bg':           'rgb(230,174,211)',
            '--text':         'rgb(107,58,56)',
            '--text-sub':     'rgba(107,58,56,0.5)',
            '--accent':       'rgb(107,58,56)',
            '--cursor-color': '#FFE500',
            '--tint-opacity': '0.5'
        },
        {
            '--bg':           'rgb(167,184,194)',
            '--text':         'rgb(255,246,98)',
            '--text-sub':     'rgba(255,246,98,0.5)',
            '--accent':       'rgb(255,246,98)',
            '--cursor-color': '#FF3CAC',
            '--tint-opacity': '0.5'
        },
        {
            '--bg':           'rgb(247,247,247)',
            '--text':         'rgb(78,93,97)',
            '--text-sub':     'rgba(78,93,97,0.5)',
            '--accent':       'rgb(78,93,97)',
            '--cursor-color': '#FF3CAC',
            '--tint-opacity': '0.5'
        },
        {
            '--bg':           'rgb(254,81,54)',
            '--text':         'rgb(255,246,98)',
            '--text-sub':     'rgba(255,246,98,0.5)',
            '--accent':       'rgb(255,246,98)',
            '--cursor-color': '#ffffff',
            '--tint-opacity': '0.5'
        },
        {
            '--bg':           '#ffffff',
            '--text':         '#000000',
            '--text-sub':     'rgba(0,0,0,0.5)',
            '--accent':       '#000000',
            '--cursor-color': '#0047FF',
            '--tint-opacity': '0.3'
        },
        {
            '--bg':           '#000000',
            '--text':         '#ffffff',
            '--text-sub':     'rgba(255,255,255,0.5)',
            '--accent':       '#ffffff',
            '--cursor-color': '#FFE500',
            '--tint-opacity': '0.5'
        }
    ];

    let schemeIndex = 0;
    const root   = document.documentElement;
    const cursor = document.getElementById('custom-cursor');

    function getCursorColor() {
        return getComputedStyle(root).getPropertyValue('--cursor-color').trim();
    }

    function getTextColor() {
        return getComputedStyle(root).getPropertyValue('--text').trim();
    }

    function applyScheme(idx) {
        const s = schemes[idx];
        for (const [prop, val] of Object.entries(s)) {
            root.style.setProperty(prop, val);
        }
        // Cursor defaults to --text on scheme change
        cursor.style.color = getTextColor();
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
        { type: 'text', content: "for what it\u2019s worth, luck is just "           },
        { type: 'swap', key: 'certainty'                                               },
        { type: 'text', content: " you stopped waiting for. it\u2019s what happens when you bet on " },
        { type: 'swap', key: 'yourself'                                                },
        { type: 'text', content: " and hold onto something "                          },
        { type: 'swap', key: 'precious'                                                },
        { type: 'text', content: " \u2014 your "                                      },
        { type: 'swap', key: 'dreams'                                                  },
        { type: 'text', content: ", your "                                             },
        { type: 'swap', key: 'time'                                                    },
        { type: 'text', content: ", your "                                             },
        { type: 'swap', key: 'heart'                                                   },
        { type: 'text', content: ". no one knows how it "                             },
        { type: 'swap', key: 'lands'                                                   },
        { type: 'text', content: ". that\u2019s the "                                 },
        { type: 'swap', key: 'risk'                                                    },
        { type: 'text', content: ". that\u2019s also the "                            },
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
                cursor.style.color = getTextColor();
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

        cursor.textContent = next;
        cursor.style.color = getCursorColor();
        setTimeout(() => {
            cursor.textContent = 'try your luck';
        }, 600);

        addImage();
    }


    // ─── Image system — one image at a time ───────────────────────────────────────

    const allPaths = [];
    for (let i = 1; i <= 10; i++) {
        allPaths.push(`assets/s${i}_worth.png`);
        allPaths.push(`assets/s${i}_notWorth.png`);
        allPaths.push(`assets/s${i}_balanced.png`);
    }

    let queue    = shuffle([...allPaths]);
    let queueIdx = 0;

    const imageLayer = document.getElementById('image-layer');

    // Safe to call now — imageLayer is declared above
    applyScheme(0);

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function addImage() {
        // Remove existing image
        clearImageLayer();

        if (queueIdx >= queue.length) {
            queue    = shuffle([...allPaths]);
            queueIdx = 0;
        }

        const path = queue[queueIdx++];
        const size = (28 + Math.random() * 14).toFixed(1) + 'vh'; // 28–42vh
        const left = (5  + Math.random() * 50).toFixed(1) + 'vw'; // 5–55vw
        const top  = (5  + Math.random() * 45).toFixed(1) + 'vh'; // 5–50vh
        const rot  = (Math.random() * 12 - 6).toFixed(2)  + 'deg';

        // Wrapper
        const wrapper = document.createElement('div');
        wrapper.style.cssText =
            `position:absolute;` +
            `width:${size};` +
            `left:${left};top:${top};` +
            `transform:rotate(${rot});` +
            `overflow:hidden;` +
            `opacity:0;` +
            `transition:opacity 0.6s ease;` +
            `pointer-events:none;`;

        // Image
        const img = document.createElement('img');
        img.src           = path;
        img.style.cssText = `width:100%;height:auto;display:block;`;
        img.onerror       = () => { wrapper.remove(); };

        // Tint layer — background:var(--bg) updates automatically with scheme
        const tint = document.createElement('div');
        tint.style.cssText =
            `position:absolute;inset:0;` +
            `background:var(--bg);` +
            `mix-blend-mode:darken;` +
            `opacity:var(--tint-opacity);` +
            `pointer-events:none;`;

        wrapper.appendChild(img);
        wrapper.appendChild(tint);
        imageLayer.appendChild(wrapper);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            wrapper.style.opacity = '1';
        }));
    }

    function clearImageLayer() {
        imageLayer.innerHTML = '';
    }


    // ─── Color cycling ────────────────────────────────────────────────────────────

    const colorBtn = document.getElementById('color-btn');

    colorBtn.addEventListener('click', () => {
        schemeIndex = (schemeIndex + 1) % schemes.length;
        applyScheme(schemeIndex);

        // Reset all swap words to index 0
        document.querySelectorAll('.swap-word').forEach(word => {
            const key = word.dataset.key;
            wordSets[key].index  = 0;
            word.textContent     = wordSets[key].words[0];
        });

        // Cursor back to --text of new scheme
        cursor.style.color = getTextColor();

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
