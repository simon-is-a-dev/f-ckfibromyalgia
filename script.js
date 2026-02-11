document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------
    // Ambient Mesh Background (Swiss Edition)
    // ---------------------------------------------
    const canvas = document.createElement('canvas');
    canvas.id = 'ambient-mesh';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;

    // Configuration for the mesh
    // "Popping but not the star"
    // Mostly subtle greys/whites with occasional Red accent
    const blobs = [
        { x: 0, y: 0, vx: 0.1, vy: 0.1, r: 0, color: 'rgba(187, 44, 44, 0.34)' }, // Grey
        { x: 0, y: 0, vx: -0.1, vy: 0.2, r: 0, color: 'rgba(240, 240, 240, 0.5)' }, // White
        { x: 0, y: 0, vx: 0.1, vy: -0.1, r: 0, color: 'rgba(185, 27, 59, 0.08)' }, // Red Tint (Very subtle)
        { x: 0, y: 0, vx: -0.2, vy: -0.2, r: 0, color: 'rgba(220, 220, 220, 0.2)' } // Silver
    ];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        blobs.forEach(b => {
            if (b.r === 0) {
                b.x = Math.random() * width;
                b.y = Math.random() * height;
            }
            b.r = Math.max(width, height) * 0.7; // Large wash
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Pure White Base
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        blobs.forEach(b => {
            b.x += b.vx;
            b.y += b.vy;

            if (b.x < -b.r / 2 || b.x > width + b.r / 2) b.vx *= -1;
            if (b.y < -b.r / 2 || b.y > height + b.r / 2) b.vy *= -1;

            const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
            g.addColorStop(0, b.color);
            g.addColorStop(1, 'rgba(255,255,255,0)');

            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();

    // ---------------------------------------------
    // Scroll Interactions & Parallax effect
    // ---------------------------------------------
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        // Safety check
        if (!heroSection) return;

        const scrollP = window.scrollY;
        const heroHeight = heroSection.offsetHeight;

        // Show navbar only after leaving hero
        const triggerPoint = heroHeight - 100;

        if (navbar) {
            if (scrollP > triggerPoint) {
                navbar.classList.add('scrolled-visible');
            } else {
                navbar.classList.remove('scrolled-visible');
            }
        }

        // Parallax Scale-Down Effect
        // Only apply while hero is visible (optimization)
        if (heroContent && scrollP < heroHeight) {
            const scale = 1 - (scrollP / heroHeight) * 0.25; // Scale down 25%
            const opacity = 1 - (scrollP / heroHeight) * 1.5; // Fade out faster

            heroContent.style.transform = `scale(${scale})`;
            heroContent.style.opacity = Math.max(0, opacity);
        }
    });

    // ---------------------------------------------
    // Smooth Scroll & Reveal
    // ---------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Also make the Explore button scroll
    document.querySelector('.scroll-indicator').addEventListener('click', () => {
        document.querySelector('#condition').scrollIntoView({ behavior: 'smooth' });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .card, .content-block').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Dynamic Year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
