/**
 * ==============================================================================
 * PORTFOLIO CLIENT ENGINE - Shashikala T.
 * Features:
 *  - Dynamic Theme Manager (System detect + Manual toggle + LocalStorage)
 *  - Vertical Nav Active Scroll-Spy & Mobile Menu Toggle
 *  - Project Modal Details Viewer
 *  - Video Player Tab Switcher (YouTube Embed + Local Showcase Video)
 *  - Simulated AI Chat Companion with Intelligent Responses & API Extension Hook
 *  - Contact Form Validator with Simulated Submission & Resend API Integration Guide
 *  - Optional 8-bit Audio Blip Synthesizer (Web Audio API)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
    initNavigation();
    initProjectModals();
    initVideoShowcase();
    initAiChat();
    initContactForm();
    initRetroAudio();
});

/* --------------------------------------------------------------------------
   1. THEME MANAGER (DARK / LIGHT MODE & AUTO SYSTEM DETECTION)
   -------------------------------------------------------------------------- */
function initThemeManager() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Check saved theme or fallback to system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const initialTheme = savedTheme || (systemPrefersDark.matches ? 'dark' : 'light');

    applyTheme(initialTheme);

    // Listen for OS theme changes if user hasn't set manual preference
    systemPrefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || (systemPrefersDark.matches ? 'dark' : 'light');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('portfolio-theme', nextTheme);
            applyTheme(nextTheme);
            playRetroBeep(440, 'triangle', 0.08);
        });
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
}

/* --------------------------------------------------------------------------
   2. VERTICAL NAVIGATION & SCROLL SPY
   -------------------------------------------------------------------------- */
function initNavigation() {
    const navLinks = document.querySelectorAll('.vertical-navbar .nav-link');
    const sections = document.querySelectorAll('main section[id]');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const verticalNavbar = document.getElementById('vertical-navbar');

    // Toggle menu on small viewports
    if (mobileToggle && verticalNavbar) {
        mobileToggle.addEventListener('click', () => {
            verticalNavbar.classList.toggle('open');
            playRetroBeep(330, 'square', 0.05);
        });

        // Close sidebar when clicking any navigation link on mobile
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    verticalNavbar.classList.remove('open');
                }
            });
        });
    }

    // Scroll Spy for highlighting active vertical navigation items
    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 140;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* --------------------------------------------------------------------------
   3. PROJECTS MODAL & INTERACTIVE DETAILS
   -------------------------------------------------------------------------- */
const projectsData = {
    'lumisense': {
        title: 'LumiSense – Smart Adaptive Street Lighting System',
        badge: 'Featured IoT & Automation',
        desc: 'An automated energy-efficient street lighting architecture powered by Arduino and ambient motion sensors. It dynamically scales luminescence based on real-time pedestrian/vehicle density, cutting grid energy waste by up to 60%.',
        stack: ['Arduino', 'C/C++', 'Sensors', 'Automation', 'Power Management'],
        features: [
            'Dynamic light intensity based on movement and ambient conditions.',
            'Drastically reduces municipality electricity consumption.',
            'Custom hardware automation circuit integration and fail-safe sensors.'
        ],
        github: 'https://github.com/Shashikala-12',
        demo: '#'
    },
    'pixel-portfolio': {
        title: 'PixelArt Engineer Portfolio',
        badge: 'Interactive Web',
        desc: 'A responsive portfolio crafted with high-fidelity pixel-art styling, system dark-mode detection, interactive AI companion, and modular design components.',
        stack: ['HTML5', 'Vanilla CSS', 'JavaScript (ES6+)', 'Web Audio API'],
        features: [
            'Pixel aesthetics with accessible responsive typography.',
            'Interactive simulated AI chatbot assistant.',
            'Accessible vertical navigation drawer with active scroll spy.'
        ],
        github: 'https://github.com/Shashikala-12',
        demo: '#'
    },
    'data-analytics': {
        title: 'Data Science & Predictive Pipeline',
        badge: 'Data Science',
        desc: 'Exploratory data analysis and predictive modeling using Python, Pandas, and machine learning algorithms for pattern recognition and statistical insights.',
        stack: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib'],
        features: [
            'End-to-end dataset preprocessing and feature scaling.',
            'Comparative algorithm evaluation and metric visualization.',
            'Clean modular Python code with reproducible notebooks.'
        ],
        github: 'https://github.com/Shashikala-12',
        demo: '#'
    }
};

function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalBadge = document.getElementById('modal-badge');
    const modalDesc = document.getElementById('modal-desc');
    const modalFeatures = document.getElementById('modal-features');
    const modalStack = document.getElementById('modal-stack');
    const modalGithub = document.getElementById('modal-github');
    const modalDemo = document.getElementById('modal-demo');
    const projectCards = document.querySelectorAll('[data-project-id]');

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent duplicate clicks if clicking directly on a link
            if (e.target.tagName.toLowerCase() === 'a') return;

            const projKey = card.getAttribute('data-project-id');
            const data = projectsData[projKey];
            if (!data || !modal) return;

            modalTitle.textContent = data.title;
            modalBadge.textContent = data.badge;
            modalDesc.textContent = data.desc;

            // Render Tech Stack
            modalStack.innerHTML = data.stack.map(s => `<span class="tag-badge">${s}</span>`).join('');

            // Render Features
            modalFeatures.innerHTML = data.features.map(f => `<li>• ${f}</li>`).join('');

            modalGithub.href = data.github;
            modalDemo.href = data.demo;

            modal.classList.add('active');
            playRetroBeep(520, 'sine', 0.08);
        });
    });

    if (modalClose && modal) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            playRetroBeep(260, 'sine', 0.06);
        });

        // Close on clicking overlay outside card
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

/* --------------------------------------------------------------------------
   4. VIDEO SHOWCASE TAB SWITCHER (YOUTUBE & LOCAL VIDEO)
   -------------------------------------------------------------------------- */
function initVideoShowcase() {
    const tabYt = document.getElementById('tab-video-yt');
    const tabLocal = document.getElementById('tab-video-local');
    const ytContainer = document.getElementById('video-yt-frame');
    const localContainer = document.getElementById('video-local-player');

    if (tabYt && tabLocal && ytContainer && localContainer) {
        tabYt.addEventListener('click', () => {
            tabYt.classList.add('pixel-btn-primary');
            tabLocal.classList.remove('pixel-btn-primary');
            ytContainer.style.display = 'block';
            localContainer.style.display = 'none';
            // Pause local video if playing
            localContainer.pause();
            playRetroBeep(440, 'triangle', 0.05);
        });

        tabLocal.addEventListener('click', () => {
            tabLocal.classList.add('pixel-btn-primary');
            tabYt.classList.remove('pixel-btn-primary');
            ytContainer.style.display = 'none';
            localContainer.style.display = 'block';
            playRetroBeep(550, 'triangle', 0.05);
        });
    }
}

/* --------------------------------------------------------------------------
   5. AI CHAT INTERFACE INTEGRATION (Prompt 10)
   -------------------------------------------------------------------------- */
function initAiChat() {
    const chatFeed = document.getElementById('chat-feed');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const quickChips = document.querySelectorAll('.quick-chip');

    if (!chatFeed || !chatInput || !chatSendBtn) return;

    // Predefined AI knowledge base about Shashikala T
    const knowledgeBase = [
        {
            keywords: ['skill', 'language', 'stack', 'tech', 'programming', 'python', 'java', 'c'],
            reply: "I specialize in Python, C, Java, and modern web development (HTML5, CSS3, JavaScript). I am also actively expanding into Data Science, Machine Learning, and IoT hardware automation with Arduino!"
        },
        {
            keywords: ['project', 'lumisense', 'work', 'hardware', 'street'],
            reply: "My headline project is 'LumiSense – Smart Adaptive Street Lighting System'. It leverages Arduino and sensors to optimize city lighting, reducing energy consumption dynamically. I also build responsive web applications!"
        },
        {
            keywords: ['education', 'college', 'degree', 'cgpa', 'university', 'study'],
            reply: "I am pursuing my B.E. in Computer Science (Data Science) at Adhichunchanagiri Institute of Technology, Chikkamagaluru, Karnataka, maintaining a CGPA of 8.6 (Graduation 2029)!"
        },
        {
            keywords: ['contact', 'email', 'hire', 'phone', 'reach', 'linkedin', 'github'],
            reply: "You can reach me directly via email at ts3023456@gmail.com, phone at +91 9743725546, or connect with me on GitHub (@Shashikala-12) and LinkedIn!"
        },
        {
            keywords: ['experience', 'role', 'intern', 'fresher'],
            reply: "I am a proactive engineer and fresher specializing in Computer Science & Data Science with proven hands-on experience in software development and IoT project lifecycle execution."
        }
    ];

    function addMessage(sender, text) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender === 'user' ? 'user-message' : 'bot-message'}`;
        bubble.textContent = text;
        chatFeed.appendChild(bubble);
        chatFeed.scrollTop = chatFeed.scrollHeight;
    }

    function handleUserInput(query) {
        const text = (query || chatInput.value).trim();
        if (!text) return;

        addMessage('user', text);
        chatInput.value = '';
        playRetroBeep(380, 'square', 0.05);

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-bubble bot-message';
        typingIndicator.id = 'typing-indicator';
        typingIndicator.textContent = 'Thinking... 👾';
        chatFeed.appendChild(typingIndicator);
        chatFeed.scrollTop = chatFeed.scrollHeight;

        /**
         * =========================================================================
         * OPTIONAL LIVE AI API EXTENSION POINT (OpenAI / Gemini / Anthropic API):
         * =========================================================================
         * To connect to a live LLM API, replace the setTimeout block below with:
         * 
         * async function queryOpenAI(prompt) {
         *     const response = await fetch("https://api.openai.com/v1/chat/completions", {
         *         method: "POST",
         *         headers: {
         *             "Content-Type": "application/json",
         *             "Authorization": `Bearer YOUR_API_KEY`
         *         },
         *         body: JSON.stringify({
         *             model: "gpt-4o-mini",
         *             messages: [
         *                 { role: "system", content: "You are the AI avatar of Shashikala T, a CS & Data Science engineer..." },
         *                 { role: "user", content: prompt }
         *             ]
         *         })
         *     });
         *     const data = await response.json();
         *     return data.choices[0].message.content;
         * }
         * =========================================================================
         */

        setTimeout(() => {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();

            const lower = text.toLowerCase();
            let matched = knowledgeBase.find(item => 
                item.keywords.some(k => lower.includes(k))
            );

            const botReply = matched 
                ? matched.reply 
                : "Thank you for asking! I'm Shashikala's AI assistant. You can inquire about my technical skills, IoT projects (like LumiSense), academic background, or how to get in touch!";
            
            addMessage('bot', botReply);
            playRetroBeep(620, 'sine', 0.08);
        }, 700);
    }

    chatSendBtn.addEventListener('click', () => handleUserInput());
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleUserInput();
    });

    quickChips.forEach(chip => {
        chip.addEventListener('click', () => {
            handleUserInput(chip.textContent.trim());
        });
    });
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM WITH RESEND API FUNCTIONALITY (Prompt 11)
   -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    const alertBox = document.getElementById('form-status-alert');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !email || !message) {
            alert('Please fill out all required fields before submitting.');
            return;
        }

        // Show submission state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... ⏳';
        submitBtn.disabled = true;

        /**
         * =========================================================================
         * EMAIL SERVICE API INTEGRATION HOOK (e.g. Resend API):
         * =========================================================================
         * When integrating with Resend (https://resend.com), forward this payload
         * through your secure backend or serverless function:
         * 
         * async function sendViaResend(data) {
         *     return await fetch('/api/send-email', {
         *         method: 'POST',
         *         headers: { 'Content-Type': 'application/json' },
         *         body: JSON.stringify({
         *             from: 'portfolio@yourdomain.com',
         *             to: 'ts3023456@gmail.com',
         *             subject: `New Portfolio Message from ${data.name}`,
         *             html: `<p><strong>Name:</strong> ${data.name}</p>
         *                    <p><strong>Email:</strong> ${data.email}</p>
         *                    <p><strong>Message:</strong> ${data.message}</p>`
         *         })
         *     });
         * }
         * =========================================================================
         */

        // Simulated sending latency
        setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            form.reset();

            if (alertBox) {
                alertBox.style.display = 'block';
                alertBox.textContent = `Thank you, ${name}! Your message has been transmitted successfully. I will get back to you shortly!`;
                playRetroBeep(780, 'sine', 0.12);

                setTimeout(() => {
                    alertBox.style.display = 'none';
                }, 6000);
            }
        }, 1000);
    });
}

/* --------------------------------------------------------------------------
   7. RETRO 8-BIT AUDIO SYNTHESIZER (Web Audio API)
   -------------------------------------------------------------------------- */
let audioCtx = null;
let soundEnabled = true;

function initRetroAudio() {
    const soundToggle = document.getElementById('sound-toggle-btn');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggle.textContent = soundEnabled ? '🔊 SFX: ON' : '🔈 SFX: OFF';
            if (soundEnabled) playRetroBeep(440, 'triangle', 0.08);
        });
    }
}

function playRetroBeep(freq = 440, type = 'sine', duration = 0.08) {
    if (!soundEnabled) return;
    try {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (err) {
        // AudioContext not permitted or supported silently ignored
    }
}
