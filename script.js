/**
 * ═══════════════════════════════════════════════════
 *  NEXUS STUDIO — Interactive Scripts
 *  Apple-Inspired Modern Interactions & Animations
 * ═══════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
    initCounterStats();
    initSmoothScroll();
    initHeroParallax();
    initPortfolioCards();
});

/* --------------------------------------------------
   1. NAVBAR & MOBILE MENU
   -------------------------------------------------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('nav-burger');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-links a');

    // Sticky Navbar on Scroll
    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile Hamburger Menu Toggle
    if (burger && navLinks) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = burger.classList.toggle('active');
            navLinks.classList.toggle('open');
            burger.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu on link click
        links.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('open') && !navbar.contains(e.target)) {
                burger.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }
}

/* --------------------------------------------------
   2. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   -------------------------------------------------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.reveal-card, .reveal-text, .reveal-fade'
    );

    if (!('IntersectionObserver' in window)) {
        // Fallback if browser doesn't support IntersectionObserver
        revealElements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        }
    );

    revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------
   3. ANIMATED NUMBER COUNTERS (Hero Stats)
   -------------------------------------------------- */
function initCounterStats() {
    const statNumbers = document.querySelectorAll('.stat-num[data-target]');
    if (!statNumbers.length) return;

    let hasAnimated = false;

    const animateCounters = () => {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
            const duration = 2000; // ms
            const frameRate = 1000 / 60;
            const totalFrames = Math.round(duration / frameRate);
            let frame = 0;

            const updateCounter = () => {
                frame++;
                // easeOutExpo function
                const progress = 1 - Math.pow(2, -10 * (frame / totalFrames));
                const current = Math.round(progress * target);

                if (frame <= totalFrames) {
                    counter.textContent = current;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    if ('IntersectionObserver' in window) {
        const statsSection = document.getElementById('hero-stats');
        if (statsSection) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated) {
                        hasAnimated = true;
                        animateCounters();
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(statsSection);
        } else {
            animateCounters();
        }
    } else {
        animateCounters();
    }
}

/* --------------------------------------------------
   4. SMOOTH SCROLL FOR ANCHOR LINKS
   -------------------------------------------------- */
function initSmoothScroll() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* --------------------------------------------------
   5. HERO 3D ORB PARALLAX EFFECT ON MOUSE MOVE
   -------------------------------------------------- */
function initHeroParallax() {
    const hero = document.getElementById('home');
    const heroVisual = document.getElementById('hero-visual');
    if (!hero || !heroVisual) return;

    // Subtle 3D tilt interaction for desktop devices
    if (window.matchMedia('(pointer: fine)').matches) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            heroVisual.style.transform = `perspective(1000px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateY(${y * 10}px)`;
        });

        hero.addEventListener('mouseleave', () => {
            heroVisual.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
            heroVisual.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
        });

        hero.addEventListener('mouseenter', () => {
            heroVisual.style.transition = 'transform 0.15s ease-out';
        });
    }
}

/* --------------------------------------------------
   6. PORTFOLIO CARDS SUBTLE HOVER EFFECT
   -------------------------------------------------- */
function initPortfolioCards() {
    const cards = document.querySelectorAll('.portfolio-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* --------------------------------------------------
   7. CONTACT FORM SUBMISSION & TOAST NOTIFICATION
   -------------------------------------------------- */
function handleSubmit() {
    const nameInput = document.getElementById('cta-name');
    const emailInput = document.getElementById('cta-email');
    const msgInput = document.getElementById('cta-msg');
    const submitBtn = document.getElementById('submit-btn');
    const toast = document.getElementById('toast');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const msg = msgInput ? msgInput.value.trim() : '';

    // Simple validation
    if (!name) {
        showToast('Please enter your name.', true);
        if (nameInput) nameInput.focus();
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showToast('Please enter a valid email address.', true);
        if (emailInput) emailInput.focus();
        return;
    }

    if (!msg) {
        showToast('Please tell us a little bit about your project.', true);
        if (msgInput) msgInput.focus();
        return;
    }

    // Button loading state
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.innerHTML = `
        <span>Sending...</span>
        <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle>
        </svg>
    `;

    // Kirim pesan ke fahmiwa13@gmail.com menggunakan FormSubmit AJAX
    fetch('https://formsubmit.co/ajax/fahmiwa13@gmail.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            Nama: name,
            Email: email,
            Pesan: msg,
            _subject: `Pesan Proyek Baru dari ${name} (Website Portfolio)`
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success === "true" || data.success === true) {
            // Reset form
            if (nameInput) nameInput.value = '';
            if (emailInput) emailInput.value = '';
            if (msgInput) msgInput.value = '';

            showToast('Pesan berhasil dikirim! Kami akan merespons dalam 24 jam.', false);
        } else if (data.message && data.message.includes('Activation')) {
            showToast('Cek Gmail Anda (fahmiwa13@gmail.com) dan klik "Activate Form" dari FormSubmit.', false);
        } else if (data.message && data.message.includes('HTML files')) {
            showToast('Perlu dijalankan lewat Web Server / Live Server agar email terkirim.', true);
        } else {
            showToast(data.message || 'Gagal mengirim pesan.', true);
        }
    })
    .catch(error => {
        console.error('Error sending message:', error);
        showToast('Terjadi kesalahan jaringan saat mengirim pesan.', true);
    })
    .finally(() => {
        // Reset tombol
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.innerHTML = originalBtnHTML;
    });
}

// Show Toast Helper
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    // Toast icon & content
    const iconSvg = isError
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF453A" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#30D158" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`;

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    toast.classList.add('show');

    // Auto hide after 4 seconds
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Expose handleSubmit globally for inline onclick
window.handleSubmit = handleSubmit;
