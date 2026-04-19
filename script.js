// ─── Custom cursor — runs immediately, outside DOMContentLoaded ──────────────

(function () {
    const cursor = document.getElementById('custom-cursor');
    const label  = document.getElementById('cursor-label');
    if (!cursor) return;
    document.addEventListener('mousemove', (e) => {
        cursor.style.left    = e.clientX + 'px';
        cursor.style.top     = e.clientY + 'px';
        cursor.style.opacity = '1';
        if (label) {
            label.style.left = e.clientX + 'px';
            label.style.top  = e.clientY + 'px';
        }
    });
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        if (label) label.style.opacity = '0';
    });
}());


document.addEventListener('DOMContentLoaded', () => {

    // ─── Color pairs [background, text/accent] ───────────────────────────────────

    const COLORS = [
        ['#EDC700', '#6B3A38'],
        ['#F7F7F7', '#4E5D61'],
        ['#6B3A39', '#8DB8E4'],
        ['#4E86DD', '#2E4555'],
        ['#46A85F', '#FF97B3'],
        ['#f0cfe1', '#E4939A'],
        ['#A7B8C2', '#FFF662'],
        ['#FE5136', '#FFF662'],
        ['#FE5136', '#E8FBFD'],
        ['#FEA2FD', '#E8FBFD'],
        ['#FFC4FF', '#FF0014'],
        ['#F1348A', '#F0E3CD'],
        ['#C9C9CB', '#F73390'],
        ['#E6AED3', '#6B3A38'],
        ['#ffffff', '#000000'],
        ['#000000', '#ffffff']
    ];

    let currentColorIndex = 14;
    const root        = document.documentElement;
    const cursor      = document.getElementById('custom-cursor');
    const cursorLabel = document.getElementById('cursor-label');
    const disc        = document.getElementById('disc');
    const discImg     = document.getElementById('disc-img');
    const container   = document.getElementById('container');

    function getTextColor() {
        return getComputedStyle(root).getPropertyValue('--text').trim();
    }

    function applyColor(index) {
        const pair = COLORS[index];
        document.body.style.background  = pair[0];
        document.body.style.color       = pair[1];
        container.style.background      = pair[0];
        if (disc) disc.style.background = pair[1];
        root.style.setProperty('--bg',       pair[0]);
        root.style.setProperty('--text',     pair[1]);
        root.style.setProperty('--opposite', pair[0]);
        cursor.style.background   = pair[1];
        cursorLabel.style.color   = pair[0];
    }

    // Start on white/black (index 14)
    applyColor(currentColorIndex);


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
                cursor.style.opacity      = '0';
                cursorLabel.textContent   = 'click!';
                cursorLabel.style.opacity = '1';
            });
            span.addEventListener('mouseleave', () => {
                cursor.style.opacity      = '1';
                cursorLabel.style.opacity = '0';
                cursorLabel.textContent   = '';
            });
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                cycleWord(span, seg.key);
            });
            textBlock.appendChild(span);
        }
    });


    // ─── Word → image map ─────────────────────────────────────────────────────────

    const imageMap = {
        // certainty set
        'certainty':       'assets/certainity.png',
        'guarantees':      'assets/guarantees.png',
        'permission':      'assets/permission.png',
        'safety':          'assets/safety.png',
        'proof':           'assets/proof.png',
        // yourself set
        'yourself':        'assets/yourself.png',
        'the unknown':     'assets/theunknown.png',
        'what scares you': 'assets/whatscaresyou.png',
        'the feeling':     'assets/thefeeling.png',
        'chance':          'assets/chance.png',
        // precious set
        'precious':        'assets/precious.png',
        'fragile':         'assets/fragile.png',
        'irreplaceable':   'assets/irreplacable.png',
        'uncertain':       'assets/uncertain.png',
        'raw':             'assets/raw.png',
        // dreams set
        'dreams':          'assets/dreams.png',
        'ideas':           'assets/ideas.png',
        'hopes':           'assets/hopes.png',
        'fears':           'assets/fears.png',
        'secrets':         'assets/secrets.png',
        // time set
        'time':            'assets/time.png',
        'money':           'assets/money.png',
        'energy':          'assets/energy.png',
        'youth':           'assets/youth.png',
        'attention':       'assets/attention.png',
        // heart set
        'heart':           'assets/heart.png',
        'voice':           'assets/voice.png',
        'self':            'assets/self.png',
        'trust':           'assets/trust.png',
        'pride':           'assets/pride.png',
        // lands set
        'lands':           'assets/lands.png',
        'falls':           'assets/falls.png',
        'ends':            'assets/ends.png',
        'plays out':       'assets/playsout.png',
        'unfolds':         'assets/unfolds.png',
        // risk set
        'risk':            'assets/risk.png',
        'leap':            'assets/leap.png',
        'loss':            'assets/loss.png',
        'bet':             'assets/bet.png',
        'sacrifice':       'assets/sacrifice.png',
        // reach set
        'reach':           'assets/reach.png',
        'try':             'assets/try.png',
        'begin':           'assets/begin.png',
        'choose':          'assets/choose.png',
        'go':              'assets/go.png'
    };


    // ─── Word cycling ─────────────────────────────────────────────────────────────

    function cycleWord(span, key) {
        const set         = wordSets[key];
        const currentWord = set.words[set.index]; // word currently displayed when clicked
        set.index         = (set.index + 1) % set.words.length;
        const next        = set.words[set.index];

        span.style.opacity   = '0';
        span.style.transform = 'scale(1.08)';

        setTimeout(() => {
            span.textContent     = next;
            span.style.opacity   = '1';
            span.style.transform = 'scale(1)';
        }, 120);

        cursorLabel.textContent = next;
        cursorLabel.style.opacity = '1';
        setTimeout(() => {
            cursorLabel.style.opacity = '0';
        }, 600);

        addImage(currentWord);
    }


    // ─── Image system ─────────────────────────────────────────────────────────────

    function addImage(word) {
        const path = imageMap[word];
        if (!path) return;

        const pair    = COLORS[currentColorIndex];
        const leftVal = Math.floor(Math.random() * 55) + 'vw';
        const topVal  = Math.floor(Math.random() * 50) + 'vh';

        discImg.src            = path;
        disc.style.background  = pair[1];
        disc.style.width       = '360px';
        disc.style.height      = '360px';
        disc.style.left        = leftVal;
        disc.style.top         = topVal;
    }

    // ─── Color cycling ────────────────────────────────────────────────────────────

    const colorBtn = document.getElementById('color-btn');

    colorBtn.addEventListener('click', () => {
        currentColorIndex = (currentColorIndex + 1) % COLORS.length;
        applyColor(currentColorIndex);

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
