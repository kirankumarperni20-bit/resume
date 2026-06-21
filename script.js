// ============================================
// Perni Kiran Kumar - Portfolio Website
// Premium Interactive JavaScript
// ============================================
//
// Features included:
//   • Preloader with fade-out transition
//   • Smart Navbar (scroll class, hide/show on direction, mobile toggle)
//   • Active nav link highlighting via Intersection Observer
//   • Smooth scrolling with navbar offset
//   • Typewriter cycling effect for hero roles
//   • Scroll-triggered animations (fade-in elements)
//   • Animated stat counters
//   • Skills category tab filtering
//   • Contact form with validation & mailto fallback
//   • Toast notification system
//   • Resume download tracking
//   • Back-to-top button
//   • Parallax effects (scroll + mouse) on hero orbs
//   • 3D tilt effect on project cards
//   • Achievements timeline reveal animation
//   • Certifications carousel (optional auto-scroll)
//   • Dynamic footer year
//   • Lightweight particle background generator
//   • Skill bar width animation on scroll
//   • Magnetic hover effect on buttons
//   • Konami Code easter egg 🎮
// ============================================

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // PRELOADER
    // ========================================
    // Fades out the loading overlay once all assets are ready.
    // Uses opacity transition for a smooth disappearance,
    // then removes from layout after the transition completes.
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // ========================================
    // NAVBAR — Core Elements
    // ========================================
    // Gather all navbar-related DOM references once
    // to avoid repeated queries throughout the script.
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Track scroll position for direction-based show/hide
    let lastScrollY = 0;
    let ticking = false;

    // ----------------------------------------
    // Navbar — Scroll Handler
    // ----------------------------------------
    // 1. Adds 'scrolled' class when past 80px (triggers background change in CSS)
    // 2. Hides navbar on scroll-down, reveals on scroll-up (only after 500px)
    // Uses requestAnimationFrame for optimal performance.
    function handleNavScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Direction-based hide/show — only kicks in after scrolling 500px
        if (window.scrollY > lastScrollY && window.scrollY > 500) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
        ticking = false;
    }

    // Throttle scroll events via requestAnimationFrame
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleNavScroll);
            ticking = true;
        }
    });

    // ----------------------------------------
    // Navbar — Mobile Hamburger Toggle
    // ----------------------------------------
    // Toggles 'active' class on both the menu and the toggle button
    // to trigger CSS slide-in / hamburger-to-X animations.
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // ----------------------------------------
    // Navbar — Close Mobile Menu on Link Click
    // ----------------------------------------
    // Ensures the mobile menu closes after the user taps a link,
    // providing a clean UX without requiring a second tap.
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // ========================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ========================================
    // Uses Intersection Observer to detect which section is
    // currently in view and highlights the corresponding nav link.
    // rootMargin is tuned so the "active zone" is the top 20-80% of the viewport.
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove 'active' from all links, then add to the matching one
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // ========================================
    // SMOOTH SCROLLING
    // ========================================
    // Intercepts all anchor links (#...) and scrolls smoothly
    // to the target element, accounting for the fixed navbar height
    // plus a small 20px breathing room offset.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignore bare '#' links

            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // TYPEWRITER EFFECT
    // ========================================
    // Creates a classic typewriter animation that cycles through
    // an array of professional roles/titles in the hero section.
    // Typing speed, deletion speed, and pause durations are all tuned
    // for a natural, readable feel.
    const typewriterElement = document.getElementById('typewriter');
    const roles = [
        'B.Tech CS Engineering Student',
        'AI & ML Enthusiast',
        'Software Developer',
        'Generative AI Explorer',
        'Problem Solver',
        'Open Source Contributor'
    ];
    let roleIndex = 0;   // Which role we're currently displaying
    let charIndex = 0;    // Current character position
    let isDeleting = false;
    let typeSpeed = 100;  // Milliseconds between each character action

    function typeWriter() {
        if (!typewriterElement) return;
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            // Remove one character at a time
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Deleting is faster than typing
        } else {
            // Add one character at a time
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Normal typing speed
        }

        // Finished typing the full role — pause, then start deleting
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // 2-second pause to let the user read
            isDeleting = true;
        }
        // Finished deleting — move to next role
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length; // Loop through roles
            typeSpeed = 500; // Brief pause before typing next word
        }

        setTimeout(typeWriter, typeSpeed);
    }

    // Kick off the typewriter loop
    typeWriter();

    // ========================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ========================================
    // Elements with class 'animate-on-scroll' will receive
    // a 'visible' class when they enter the viewport,
    // triggering CSS transition/animation rules.
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after first animation
                // animateObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => animateObserver.observe(el));

    // ========================================
    // COUNTER ANIMATION
    // ========================================
    // Animates numeric stat elements from 0 up to their target value.
    // Uses requestAnimationFrame for smooth 60fps counting.
    // Reads the target from data-target attribute and optional suffix from data-suffix.
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16); // ~60fps frame budget
        const suffix = element.dataset.suffix || '';

        function updateCounter() {
            start += increment;
            if (start >= target) {
                element.textContent = target + suffix;
                return; // Stop when we've reached the target
            }
            element.textContent = Math.floor(start) + suffix;
            requestAnimationFrame(updateCounter);
        }
        updateCounter();
    }

    // Observe stat counters — each counter animates once when 50% visible
    const statNumbers = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));

    // ========================================
    // SKILLS TABS / FILTER
    // ========================================
    // Handles skill category filtering via clickable tabs.
    // Clicking a tab shows only the matching skill-category elements;
    // clicking 'all' reveals everything.
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillCategories = document.querySelectorAll('.skill-category');

    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab styling
            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.category;

            // Show/hide categories based on selection
            skillCategories.forEach(cat => {
                if (category === 'all' || cat.dataset.category === category) {
                    cat.style.display = 'grid';
                    cat.classList.add('visible');
                } else {
                    cat.style.display = 'none';
                    cat.classList.remove('visible');
                }
            });
        });
    });

    // ========================================
    // CONTACT FORM
    // ========================================
    // Client-side form handler with validation.
    // Since there's no backend, it constructs a mailto: link
    // to open the user's default email client pre-filled with form data.
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Extract form values
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // ---- Validation ----
            // Check required fields
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Validate email format with a standard regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // ---- Construct mailto link ----
            const mailtoLink = `mailto:Kirankumarperni20@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Contact')}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
            window.open(mailtoLink, '_blank');

            // Provide user feedback and reset the form
            showNotification('Opening your email client...', 'success');
            this.reset();
        });
    }

    // ========================================
    // NOTIFICATION SYSTEM
    // ========================================
    // Lightweight toast notification that slides in from the top-right.
    // Supports 'success' and 'error' types with distinct icons.
    // Auto-dismisses after 4 seconds with a smooth fade-out.
    function showNotification(message, type = 'success') {
        // Remove any existing notification to prevent stacking
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        // Create notification DOM element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : '✕'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        document.body.appendChild(notification);

        // Trigger slide-in animation on next frame
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300); // Wait for fade-out transition
        }, 4000);
    }

    // ========================================
    // RESUME DOWNLOAD
    // ========================================
    // Provides visual feedback when the user clicks a resume download button.
    const downloadBtns = document.querySelectorAll('.download-resume');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Resume download started!', 'success');
        });
    });

    // ========================================
    // BACK TO TOP BUTTON
    // ========================================
    // Shows a floating button after scrolling 500px down.
    // Clicking it smoothly scrolls back to the top of the page.
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========================================
    // PARALLAX EFFECT ON HERO (Scroll-based)
    // ========================================
    // Moves decorative orbs at different speeds as the user scrolls,
    // creating a layered depth effect in the hero section.
    const heroOrbs = document.querySelectorAll('.hero-orb');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        heroOrbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.15; // Each orb moves at a different rate
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ========================================
    // MOUSE PARALLAX ON HERO
    // ========================================
    // Tracks mouse movement over the hero section and shifts orbs
    // relative to the cursor position for an interactive depth feel.
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
            heroOrbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.5;
                orb.style.transform = `translate(${xPos * speed}px, ${yPos * speed}px)`;
            });
        });
    }

    // ========================================
    // TILT EFFECT ON PROJECT CARDS
    // ========================================
    // Applies a 3D perspective tilt to project cards based on
    // mouse position within the card. Resets smoothly on mouse leave.
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation angles based on distance from center
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ========================================
    // ACHIEVEMENTS TIMELINE ANIMATION
    // ========================================
    // Reveals timeline items sequentially as the user scrolls
    // through the achievements section.
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => timelineObserver.observe(item));

    // ========================================
    // CERTIFICATIONS CAROUSEL AUTO-SCROLL
    // ========================================
    // Optional: smoothly auto-scrolls the certifications track
    // horizontally using requestAnimationFrame for butter-smooth motion.
    const certTrack = document.querySelector('.cert-track');
    if (certTrack) {
        let scrollAmount = 0;
        const certScroll = () => {
            scrollAmount += 0.5;
            if (scrollAmount >= certTrack.scrollWidth / 2) {
                scrollAmount = 0; // Reset for infinite loop effect
            }
            certTrack.style.transform = `translateX(-${scrollAmount}px)`;
            requestAnimationFrame(certScroll);
        };
        // certScroll(); // Uncomment for auto-scroll
    }

    // ========================================
    // DYNAMIC YEAR IN FOOTER
    // ========================================
    // Automatically updates the copyright year so it never goes stale.
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ========================================
    // PRINT / PDF RESUME
    // ========================================
    // Triggers the browser's native print dialog for saving as PDF.
    const printResumeBtns = document.querySelectorAll('.print-resume');
    printResumeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.print();
        });
    });

    // ========================================
    // PARTICLES BACKGROUND (Lightweight)
    // ========================================
    // Dynamically generates 50 tiny floating particle elements
    // inside the hero section's .particles container.
    // Each particle has randomized size, position, delay, and duration
    // for an organic, non-repetitive floating effect.
    const particleContainer = document.querySelector('.particles');
    if (particleContainer) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                animation-delay: ${Math.random() * 5}s;
                animation-duration: ${Math.random() * 10 + 5}s;
            `;
            particleContainer.appendChild(particle);
        }
    }

    // ========================================
    // SKILL BAR ANIMATION
    // ========================================
    // Animates skill progress bars from 0% to their target width
    // when they scroll into view. Each bar reads its target from
    // a data-width attribute.
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.dataset.width;
                bar.style.width = width + '%';
                skillBarObserver.unobserve(bar); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillBarObserver.observe(bar));

    // ========================================
    // MAGNETIC BUTTON EFFECT
    // ========================================
    // Creates a subtle "magnetic" pull effect on primary/secondary buttons.
    // The button slightly follows the cursor while hovered,
    // snapping back to center on mouse leave.
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ========================================
    // EASTER EGG: Konami Code 🎮
    // ========================================
    // ↑ ↑ ↓ ↓ ← → ← → B A
    // Entering this classic cheat code triggers a fun notification
    // and a brief rainbow animation on the page body.
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                showNotification('🎮 Konami Code Activated! You found the easter egg!', 'success');
                document.body.style.animation = 'rainbow 2s ease';
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0; // Reset on wrong key
        }
    });

    // ========================================
    // CONSOLE BRANDING
    // ========================================
    // Leaves a styled signature in the browser console for
    // anyone curious enough to open DevTools.
    console.log('%c🚀 Portfolio by Perni Kiran Kumar', 'color: #0A66C2; font-size: 20px; font-weight: bold;');
    console.log('%cBuilt with passion and modern web technologies', 'color: #00B4D8; font-size: 14px;');

});
