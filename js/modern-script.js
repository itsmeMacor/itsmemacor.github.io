// ===== Smooth Scroll Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                updateActiveNav();
            }
        }
    });
});

// ===== Active Navigation Link =====
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== Mobile Menu Toggle =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');

function setMenuState(isOpen) {
    menuToggle.classList.toggle('active', isOpen);
    navMenu.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
}

menuToggle.addEventListener('click', () => {
    setMenuState(!navMenu.classList.contains('active'));
});

// Close menu when link clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        setMenuState(false);
    });
});

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.project-card, .skill-category, .stat-card').forEach(el => {
    observer.observe(el);
});

// ===== Contact Form Handling =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const emailInput = contactForm.querySelector('input[name="from_email"]');
    const emailError = document.getElementById('emailError');
    const formStatus = document.getElementById('formStatus');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setFormStatus(message, type = '') {
        formStatus.textContent = message;
        formStatus.className = 'form-status';

        if (type) {
            formStatus.classList.add(`is-${type}`);
        }
    }

    function validateEmailField() {
        const emailValue = emailInput.value.trim();

        if (!emailValue) {
            emailInput.classList.remove('invalid');
            emailError.textContent = '';
            setFormStatus('');
            return false;
        }

        const isValidEmail = emailPattern.test(emailValue);
        emailInput.classList.toggle('invalid', !isValidEmail);
        emailError.textContent = isValidEmail ? '' : 'Please enter a valid email address.';
        if (isValidEmail) {
            setFormStatus('');
        }
        return isValidEmail;
    }

    emailInput.addEventListener('input', validateEmailField);
    emailInput.addEventListener('blur', validateEmailField);

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateEmailField()) {
            emailInput.focus();
            return;
        }
        
        // Show loading state
        const submitButton = this.querySelector('button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        setFormStatus('');

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Unable to send your message right now.');
            }

            submitButton.textContent = 'Message Sent! ✓';
            submitButton.style.backgroundColor = '#50c878';
            setFormStatus('Thanks! Your message has been sent.', 'success');
            contactForm.reset();
            emailInput.classList.remove('invalid');
            emailError.textContent = '';
        } catch (error) {
            console.error('Formspree Error:', error);
            submitButton.textContent = 'Error Sending Message';
            submitButton.style.backgroundColor = '#ff6b6b';
            setFormStatus('Something went wrong. Please try again in a moment.', 'error');
        } finally {
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.backgroundColor = '';
                submitButton.disabled = false;
            }, 3000);
        }
    });
}

// ===== Parallax Effect (subtle) =====
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const stars = document.querySelector('.stars');
            if (stars) {
                stars.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// ===== Navbar Background on Scroll =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (navMenu.classList.contains('active')) {
            setMenuState(false);
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        setMenuState(false);
    }
});

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.querySelectorAll('.hero-text h1, .hero-description').forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('fade-in-up');
        }, index * 100);
    });
});

// ===== Ripple Effect on Buttons =====
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        // Remove previous ripples
        const existingRipple = this.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        this.appendChild(ripple);
    });
});

// ===== Ripple Animation CSS (added dynamically) =====
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Dynamic Footer Year =====
const currentYear = document.getElementById('currentYear');
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// ===== Initialize =====
console.log('Modern portfolio initialized ✓');
