document.addEventListener('DOMContentLoaded', () => {
    const scriptText = document.getElementById('scriptText');
    const bottomTagline = document.getElementById('bottomTagline');
    const topTagline = document.getElementById('topTagline');
    const introScreen = document.getElementById('introScreen');
    const introTextCenter = document.getElementById('introTextCenter');
    const introTextTop = document.getElementById('introTextTop');
    const introTextBottom = document.getElementById('introTextBottom');
    const mainContainer = document.getElementById('mainContainer');
    const themeToggle = document.getElementById('themeToggle');
    const aboutToggle = document.getElementById('aboutToggle');
    const aboutModal = document.getElementById('aboutModal');
    const aboutClose = document.querySelector('.about-close');
    document.getElementById('skipIntro').addEventListener('click', skipIntro);
    

    const weighingScaleContainer = document.getElementById('weighingScaleContainer');
    const scaleBeam = document.getElementById('scaleBeam');
    const leftPanValues = document.getElementById('leftPanValues');
    const rightPanValues = document.getElementById('rightPanValues');
    const valuesPalette = document.getElementById('valuesPalette');
    const resultContainer = document.getElementById('resultContainer');
    const resultText = document.getElementById('resultText');
    const resultImageContainer = document.getElementById('resultImageContainer');
    const nextScenarioBtn = document.getElementById('nextScenarioBtn');
    const scenarioTitle = document.getElementById('scenarioTitle');
    const scenarioDescription = document.getElementById('scenarioDescription');
    

    let isDragging = false;
    let draggedElement = null;
    let leftPanWeight = 0;
    let rightPanWeight = 0;
    let currentScenarioIndex = 0;
    

    const scenarios = [
        {
            title: "Time Investment",
            description: "You have a passion project that could change your life, but it will require one year of full-time commitment with no income. What's worth placing on the scale?",
            result: {
                worth: "You embraced the challenge, valuing long-term impact over immediate comfort.",
                notWorth: "You respected your limits and chose a stable path that supports your present life.",
                balanced: "You acknowledged the potential and the risks, choosing a mindful compromise."
            },
            images: {
                worth: "assets/scenario1.a1.png",
                notWorth: "assets/scenario1,a2.png",
                balanced: "assets/scenario1,a3.png"
            }
        },
        {
            title: "Relationship Leap",
            description: "You've met someone special, but pursuing the relationship means moving to a new city, leaving your established community behind. What values tip your scale?",
            result: {
                worth: "You followed your heart, believing deep connection is worth the leap.",
                notWorth: "You stayed grounded in your current life, protecting meaningful relationships you’ve built.",
                balanced: "You weighed passion with logic, knowing timing matters in love too."
            },
            images: {
                worth: "assets/scenario2,a1.png",
                notWorth: "assets/scenario2,a2.png",
                balanced: "assets/scenario2,a3.png"
            }
        },
        {
            title: "Career Crossroads",
            description: "You have an opportunity to switch to a more meaningful career that aligns with your values, but it comes with a 40% pay cut. What matters most on your scale?",
            result: {
                worth: "You chose meaning over money, ready to live aligned with your deeper purpose.",
                notWorth: "You prioritized financial security, ensuring stability for yourself and others.",
                balanced: "You sought a hybrid path—purpose with sustainability in mind."
            },
            images: {
                worth: "assets/scenario3,a1.png",
                notWorth: "assets/scenario3,a2.png",
                balanced: "assets/scenario3,a3.png"
            }
        },
        {
            title: "Creative Risk",
            description: "You have a creative idea that could be revolutionary, but sharing it means risking public criticism and rejection. What goes on each side of your scale?",
            result: {
                worth: "You took the leap to share your vision, despite fear of rejection.",
                notWorth: "You protected your emotional wellbeing, understanding vulnerability has its seasons.",
                balanced: "You found a way to share selectively, protecting both expression and peace."
            },
            images: {
                worth: "assets/scenario4,a1.png",
                notWorth: "assets/scenario4,a2.png",
                balanced: "assets/scenario4,a3.png"
            }
        },
        {
            title: "Moving Abroad",
            description: "You've been offered a chance to live abroad for a year, but it means leaving behind routines and people you know. What would you trade?",
            result: {
                worth: "You embraced the unknown, craving discovery beyond your comfort zone.",
                notWorth: "You chose consistency, knowing roots nourish your growth too.",
                balanced: "You saw both paths clearly and left the door open for future journeys."
            },
            images: {
                worth: "assets/scenario5,a1.png",
                notWorth: "assets/scenario5,a2.png",
                balanced: "assets/scenario5,a3.png"
            }
        },
        {
            title: "Starting a Business",
            description: "You want to start your own business but you'd be leaving a secure job behind and facing financial instability. Is the risk worth it?",
            result: {
                worth: "You risked it all for autonomy, driven by a dream to build something real.",
                notWorth: "You stayed secure, preserving resources for the right opportunity.",
                balanced: "You mapped a slower entry—testing the waters before the plunge."
            },
            images: {
                worth: "assets/scenario6,a1.png",
                notWorth: "assets/scenario6,a2.png",
                balanced: "assets/scenario6,a3.png"
            }
        },
        {
            title: "Taking a Break",
            description: "You're burned out and want to take a sabbatical to reconnect with yourself, but it might slow your career momentum. What do you weigh?",
            result: {
                worth: "You chose healing and clarity over pressure and productivity.",
                notWorth: "You stayed the course, trusting growth within your current rhythm.",
                balanced: "You carved a pocket of rest into your journey—without leaving it behind."
            },
            images: {
                worth: "assets/scenario7,a1.png",
                notWorth: "assets/scenario7,a2.png",
                balanced: "assets/scenario7,a3.png"
            }
        },
        {
            title: "Speaking Out",
            description: "You see injustice at work but speaking up might cost you relationships or promotions. What's worth more in the moment?",
            result: {
                worth: "You spoke your truth, prioritizing justice over personal comfort.",
                notWorth: "You chose diplomacy and strategy, protecting your influence for later change.",
                balanced: "You waited, seeking allies to amplify your voice wisely."
            },
            images: {
                worth: "assets/scenario8,a1.png",
                notWorth: "assets/scenario8,a2.png",
                balanced: "assets/scenario8,a3.png"
            }
        },
        {
            title: "Helping a Stranger",
            description: "You come across someone in need. Helping would cost you time and money, but it might change their life. What goes on your scale?",
            result: {
                worth: "You gave selflessly, knowing one act of kindness can shift a life.",
                notWorth: "You conserved your resources, honoring your own limits.",
                balanced: "You helped in a way that balanced generosity with sustainability."
            },
            images: {
                worth: "assets/scenario9,a1.png",
                notWorth: "assets/scenario9,a2.png",
                balanced: "assets/scenario9,a3.png"
            }
        },
        {
            title: "Returning to School",
            description: "You're considering going back to school to pursue a long-held dream, but it means time, debt, and starting over. What do you prioritize?",
            result: {
                worth: "You pursued your dream, believing it’s never too late to begin again.",
                notWorth: "You honored your current responsibilities, recognizing timing is key.",
                balanced: "You planned thoughtfully—keeping your dream alive while staying grounded."
            },
            images: {
                worth: "assets/scenario10,a1.png",
                notWorth: "assets/scenario10,a2.png",
                balanced: "assets/scenario10,a3.png"
            }
        }
    ];
    
    
    function toggleAbout() {
        aboutModal.classList.toggle('visible');
    }
    
    function skipIntro() {
        clearTimeouts();
        introScreen.style.display = 'none';
        mainContainer.style.opacity = 1;
        themeToggle.style.opacity = 1;
        aboutToggle.style.opacity = 1;
    }
    
    function clearTimeouts() {
        let id = window.setTimeout(() => {}, 0);
        while (id--) {
            window.clearTimeout(id);
        }
    }
    
    function playIntroSequence() {
        setTimeout(() => {
            introTextCenter.style.opacity = 1;
        }, 500);
        

    }
    
    function playIntroSequence() {

        
        setTimeout(() => {
            introTextCenter.style.opacity = 1;
        }, 500);
        
        setTimeout(() => {
            introTextCenter.style.opacity = 0;
        }, 3000);
        
        setTimeout(() => {
            introTextTop.textContent = "MAKE THE CHOICE TO DEFY CERTAINTY";
            introTextTop.style.opacity = 1;
        }, 4000);
        
        setTimeout(() => {
            introTextTop.style.opacity = 0;
        }, 6500);
        
        setTimeout(() => {
            introTextBottom.textContent = "KNOWING THE OUTCOME ISN'T GUARANTEED";
            introTextBottom.style.opacity = 1;
        }, 7500);
        
        setTimeout(() => {
            introTextBottom.style.opacity = 0;
        }, 10000);
        
        setTimeout(() => {
            introScreen.style.opacity = 0;
            mainContainer.style.opacity = 1;
            themeToggle.style.opacity = 1;
            aboutToggle.style.opacity = 1;
            
            setTimeout(() => {
                introScreen.style.display = 'none';
            }, 1500);
        }, 11000);
    }
    
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isDarkMode = !document.body.classList.contains('light-mode');
        themeToggle.textContent = isDarkMode ? 'LIGHT MODE' : 'DARK MODE';
    }
    

    function launchWeighingScale() {
        scriptText.style.opacity = 0;
        bottomTagline.style.opacity = 0;
        topTagline.style.opacity = 0;
        
       
        setTimeout(() => {
            weighingScaleContainer.classList.add('visible');
            loadScenario(currentScenarioIndex);
            
            
            topTagline.textContent = "WEIGH WHAT'S WORTH IT TO YOU";
            topTagline.style.opacity = 0;
        }, 500);
    }
    
   
    function loadScenario(index) {
        if (index >= scenarios.length) {
            
            currentScenarioIndex = 0;
            index = 0;
        }
        
        const scenario = scenarios[index];
        document.getElementById('scenarioCounter').textContent = `Scenario ${index + 1} of ${scenarios.length}`;

       
        scenarioTitle.textContent = scenario.title;
        scenarioDescription.textContent = scenario.description;
        
       
        leftPanWeight = 0;
        rightPanWeight = 0;
        leftPanValues.innerHTML = '';
        rightPanValues.innerHTML = '';
        updateScaleBalance();
        
       
        resultContainer.classList.remove('visible');
        
        
        createValuePalette();
    }
    
   
    function createValuePalette() {
       
        valuesPalette.innerHTML = '';
        
     
        const values = [
            { name: 'Love', weight: 3 },
            { name: 'Growth', weight: 3 },
            { name: 'Security', weight: 2 },
            { name: 'Freedom', weight: 2 },
            { name: 'Experience', weight: 1 },
            { name: 'Money', weight: 3 },
            { name: 'Connection', weight: 2 },
            { name: 'Self-Worth', weight: 2 },
            { name: 'Comfort', weight: 1 },
            { name: 'Purpose', weight: 3 }
        ];
        
        values.forEach(value => {
            const valueElement = document.createElement('div');
            valueElement.classList.add('value-draggable');
            valueElement.textContent = value.name;
            valueElement.setAttribute('data-weight', value.weight);
            valueElement.setAttribute('data-value', value.name);
            
            
            valueElement.addEventListener('mousedown', startDrag);
            valueElement.addEventListener('touchstart', startDrag, { passive: false });
            
            valuesPalette.appendChild(valueElement);
        });
    }
    
    
    function startDrag(e) {
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
        
       
        if (!this.parentElement.classList.contains('pan-values')) {
            isDragging = true;
            draggedElement = this;
            draggedElement.classList.add('dragging');
            
           
            const rect = draggedElement.getBoundingClientRect();
            const offsetX = (e.clientX || e.touches[0].clientX) - rect.left;
            const offsetY = (e.clientY || e.touches[0].clientY) - rect.top;
            
            draggedElement.setAttribute('data-offset-x', offsetX);
            draggedElement.setAttribute('data-offset-y', offsetY);
            
           
            draggedElement.style.position = 'absolute';
            moveAt(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
            
           
            document.body.appendChild(draggedElement);
        }
    }
    
    function moveAt(clientX, clientY) {
        if (!draggedElement) return;
        
        const offsetX = parseInt(draggedElement.getAttribute('data-offset-x'));
        const offsetY = parseInt(draggedElement.getAttribute('data-offset-y'));
        
        draggedElement.style.left = (clientX - offsetX) + 'px';
        draggedElement.style.top = (clientY - offsetY) + 'px';
    }
    
    function onMouseMove(e) {
        if (!isDragging) return;
        
        moveAt(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
        
       
        checkDropTarget(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
    }
    
    function checkDropTarget(x, y) {
        const leftPanRect = document.getElementById('scaleLeftPan').getBoundingClientRect();
        const rightPanRect = document.getElementById('scaleRightPan').getBoundingClientRect();
        
        document.getElementById('scaleLeftPan').style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        document.getElementById('scaleRightPan').style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        
        if (x >= leftPanRect.left && x <= leftPanRect.right && 
            y >= leftPanRect.top && y <= leftPanRect.bottom) {
           
            document.getElementById('scaleLeftPan').style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        } else if (x >= rightPanRect.left && x <= rightPanRect.right && 
                  y >= rightPanRect.top && y <= rightPanRect.bottom) {
            
            document.getElementById('scaleRightPan').style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }
    }
    
    function stopDrag(e) {
        if (!isDragging) return;
        
        
        const leftPanRect = document.getElementById('scaleLeftPan').getBoundingClientRect();
        const rightPanRect = document.getElementById('scaleRightPan').getBoundingClientRect();
        
        const x = e.clientX || e.changedTouches[0].clientX;
        const y = e.clientY || e.changedTouches[0].clientY;
        
       
        draggedElement.classList.remove('dragging');
        
        if (x >= leftPanRect.left && x <= leftPanRect.right && 
            y >= leftPanRect.top && y <= leftPanRect.bottom) {
            
            placeOnPan(leftPanValues, 'left');
        } else if (x >= rightPanRect.left && x <= rightPanRect.right && 
                  y >= rightPanRect.top && y <= rightPanRect.bottom) {
           
            placeOnPan(rightPanValues, 'right');
        } else {
           
            returnToPalette();
        }
        
       
        document.getElementById('scaleLeftPan').style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        document.getElementById('scaleRightPan').style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        
        isDragging = false;
        draggedElement = null;
    }
    
    function placeOnPan(panElement, side) {
        
        const valueOnPan = document.createElement('div');
        valueOnPan.classList.add('value-draggable', 'value-on-pan');
        valueOnPan.textContent = draggedElement.textContent;
        valueOnPan.setAttribute('data-weight', draggedElement.getAttribute('data-weight'));
        valueOnPan.setAttribute('data-value', draggedElement.getAttribute('data-value'));
        
       
        panElement.appendChild(valueOnPan);
        
       
        const weight = parseInt(draggedElement.getAttribute('data-weight'));
        if (side === 'left') {
            leftPanWeight += weight;
        } else {
            rightPanWeight += weight;
        }
        
        
        draggedElement.remove();
        
        
        updateScaleBalance();
        
        
        checkForResult();
    }
    
    function returnToPalette() {
       
        const newValue = document.createElement('div');
        newValue.classList.add('value-draggable');
        newValue.textContent = draggedElement.textContent;
        newValue.setAttribute('data-weight', draggedElement.getAttribute('data-weight'));
        newValue.setAttribute('data-value', draggedElement.getAttribute('data-value'));
        
        
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
        
        const balanceRatio = (rightPanWeight - leftPanWeight) / (totalWeight);
        const maxAngle = 15; 
        const angle = balanceRatio * maxAngle;
        
        
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
        
        if (leftPanWeight > rightPanWeight + 2) {
            resultKey = 'notWorth';
        } else if (rightPanWeight > leftPanWeight + 2) {
            resultKey = 'worth';
        }
        
       
        resultText.textContent = scenario.result[resultKey];
        
        
        resultImageContainer.innerHTML = '';
        const img = document.createElement('img');
        img.classList.add('result-image');
        img.src = scenario.images[resultKey];
        img.alt = `Result: ${resultKey}`;
        resultImageContainer.appendChild(img);
        
       
        resultContainer.classList.add('visible');
    }
    
    
    nextScenarioBtn.addEventListener('click', () => {
        currentScenarioIndex++;
        loadScenario(currentScenarioIndex);
    });
    
    
    function returnToMainScreen() {
        
        weighingScaleContainer.classList.remove('visible');
        
        
        setTimeout(() => {
            scriptText.style.opacity = 1;
            bottomTagline.style.opacity = 1;
            topTagline.style.opacity = 1;
            topTagline.textContent = "MAKE THE CHOICE TO DEFY CERTAINTY";
        }, 500);
    }
    
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('touchend', stopDrag);
    
    
    function addReturnButton() {
        const returnButton = document.createElement('button');
        returnButton.classList.add('return-button');
        returnButton.textContent = 'RETURN TO HOME';
        returnButton.style.position = 'fixed';
        returnButton.style.top = '30px';
        returnButton.style.left = '30px';
        returnButton.style.backgroundColor = 'transparent';
        returnButton.style.border = '2px solid var(--text-color)';
        returnButton.style.color = 'var(--text-color)';
        returnButton.style.padding = '8px 15px';
        returnButton.style.borderRadius = '30px';
        returnButton.style.cursor = 'pointer';
        returnButton.style.fontFamily = 'Moderniz, sans-serif';
        returnButton.style.textTransform = 'uppercase';
        returnButton.style.fontSize = '0.8rem';
        returnButton.style.letterSpacing = '0.1em';
        returnButton.style.fontWeight = 'bold';
        returnButton.style.zIndex = '50';
        returnButton.style.display = 'none';
        returnButton.style.opacity = '0';
        returnButton.style.transition = 'opacity 0.5s ease';
        
        document.body.appendChild(returnButton);
        

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('visible')) {
            
            returnButton.style.display = 'block';
            setTimeout(() => {
                returnButton.style.opacity = '1';
            }, 100);
            
            
            if (window.innerWidth <= 768) {
                const scaleContainer = document.getElementById('weighingScaleContainer');
                let scrollTimeout;
                
                
                const buttonsToToggle = [
                    document.getElementById('themeToggle'),
                    document.getElementById('aboutToggle'),
                    returnButton
                ];
                
                
                const handleScroll = () => {
                    
                    buttonsToToggle.forEach(btn => {
                        if (btn) btn.classList.add('hide-on-scroll');
                    });
                    
                    
                    clearTimeout(scrollTimeout);
                    
                    
                    scrollTimeout = setTimeout(() => {
                        buttonsToToggle.forEach(btn => {
                            if (btn) btn.classList.remove('hide-on-scroll');
                        });
                    }, 800);
                };
                
                
                scaleContainer.addEventListener('scroll', handleScroll);
            }
        } else {
            
            returnButton.style.opacity = '0';
            setTimeout(() => {
                returnButton.style.display = 'none';
            }, 500);
        }
    });
});

observer.observe(weighingScaleContainer, { attributes: true, attributeFilter: ['class'] });

        returnButton.addEventListener('click', returnToMainScreen);
    }
    
    
    bottomTagline.addEventListener('click', launchWeighingScale);
    themeToggle.addEventListener('click', toggleTheme);
    aboutToggle.addEventListener('click', toggleAbout);
    aboutClose.addEventListener('click', toggleAbout);
    
   
    aboutModal.addEventListener('click', function(event) {
        if (event.target === aboutModal) {
            toggleAbout();
        }
    });

    
    window.addEventListener('load', () => {
        playIntroSequence();
        addReturnButton();
    });
    
    document.querySelector('.bottom-tagline')?.addEventListener('click', () => {
        document.querySelector('.bottom-tagline').style.animation = 'none';
    });
    
});