document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================================================
       TYPING ANIMATION (HERO SECTION)
       ========================================================================== */
    const typingText = document.getElementById('typing-text');
    const words = [
        'B.Tech CSE Student',
        'Problem Solver',
        'C Programmer',
        'Web Developer'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Removing characters
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deleting
        } else {
            // Adding characters
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // normal typing
        }

        // State changes
        if (!isDeleting && charIndex === currentWord.length) {
            // Word complete, wait before deleting
            isDeleting = true;
            typingSpeed = 1500; // pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Initialize typing effect
    if (typingText) {
        typeEffect();
    }


    /* ==========================================================================
       STICKY NAVBAR & SCROLL HEIGHT CHANGES
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    
    function handleScrollNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScrollNavbar);
    handleScrollNavbar(); // Check initial scroll state


    /* ==========================================================================
       MOBILE NAVIGATION HAMBURGER MENU
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinksList = document.querySelectorAll('.nav-item');

    function toggleMobileMenu() {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : 'auto';
    }

    function closeMobileMenu() {
        if (navMenu.classList.contains('open')) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    }

    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when nav link is clicked
    navLinksList.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && 
            !navMenu.contains(e.target) && 
            !hamburgerBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });


    /* ==========================================================================
       SCROLLSPY (ACTIVE NAV STATE ON SCROLL)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    function scrollSpy() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.getElementById(`link-${sectionId}`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksList.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // Run initially to highlight current section


    /* ==========================================================================
       CONTACT FORM SUBMISSION SIMULATOR & TOAST NOTIFICATION SYSTEM
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
        
        // Custom Inline SVGs for Toast Icons
        const successIcon = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f5ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        const errorIcon = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        
        toast.innerHTML = `
            ${type === 'error' ? errorIcon : successIcon}
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove Toast after delay
        setTimeout(() => {
            toast.classList.add('toast-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 4000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');
            const submitBtn = document.getElementById('submit-btn');
            
            // Simple validation double-check
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                showToast('Please fill out all required fields.', 'error');
                return;
            }

            // Simulate sending message (network latency styling)
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending Message...';
            
            setTimeout(() => {
                showToast(`Thank you, ${nameInput.value.trim()}! Your message has been sent successfully.`);
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }, 1200);
        });
    }


    /* ==========================================================================
       SCROLL-REVEAL (IntersectionObserver API)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target); // Reveal once
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: show all elements immediately for older browsers
        revealElements.forEach(el => el.classList.add('revealed'));
    }
});
