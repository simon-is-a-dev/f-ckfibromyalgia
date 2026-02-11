document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------
    // Ambient Mesh Background (The "Premium" Feel)
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
    // Retro/Neobrutalism Palette Blobs
    const blobs = [
        { x: 0, y: 0, vx: 0.3, vy: 0.2, r: 0, color: 'rgba(117, 202, 195, 0.5)' }, // Aqua (#75CAC3)
        { x: 0, y: 0, vx: -0.2, vy: 0.3, r: 0, color: 'rgba(243, 69, 115, 0.4)' }, // Pink (#F34573)
        { x: 0, y: 0, vx: 0.2, vy: -0.2, r: 0, color: 'rgba(42, 97, 113, 0.2)' }, // Dark Teal (#2A6171)
        { x: 0, y: 0, vx: -0.1, vy: -0.1, r: 0, color: 'rgba(255, 255, 255, 0.6)' } // White Pop
    ];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Initialize blob positions and massive sizes
        blobs.forEach(b => {
            if (b.r === 0) { // Only set random pos on first init
                b.x = Math.random() * width;
                b.y = Math.random() * height;
            }
            // Size relative to screen (mesh effect)
            b.r = Math.max(width, height) * 0.6;
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Create base background match
        ctx.fillStyle = '#D7F7F5';
        ctx.fillRect(0, 0, width, height);

        blobs.forEach(b => {
            // Update position
            b.x += b.vx;
            b.y += b.vy;

            // Soft bounce
            if (b.x < -b.r / 2 || b.x > width + b.r / 2) b.vx *= -1;
            if (b.y < -b.r / 2 || b.y > height + b.r / 2) b.vy *= -1;

            // Draw gradient blob
            const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
            g.addColorStop(0, b.color);
            g.addColorStop(1, 'rgba(215, 247, 245, 0)'); // Fade to bg

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
    // Scroll Interactions (Logo & Header)
    // ---------------------------------------------
    const logo = document.querySelector('.logo');
    const heroSection = document.querySelector('.hero-section');

    window.addEventListener('scroll', () => {
        const triggerPoint = heroSection.offsetHeight * 0.5;

        if (window.scrollY > triggerPoint) {
            logo.classList.add('scrolled-visible');
        } else {
            logo.classList.remove('scrolled-visible');
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

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('section, .card, .content-block, .hero-content').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
});
