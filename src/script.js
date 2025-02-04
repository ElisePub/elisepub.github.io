// Shared code for the whole site
document.addEventListener('DOMContentLoaded', () => {

    // Halo de lumière qui suit le mouvement de la souris
    const mainElement = document.getElementById('main');
    const lightElement = document.getElementById('mouse-light');
    let currentX = 0;
    let currentY = 0;
    const lerpFactor = 0.1; // réactivité
    let animationFrameId = null;

    function updateLight(e) {
        const rect = mainElement.getBoundingClientRect();
        const isInside = 
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        if (isInside) {
            const targetX = e.clientX - rect.left;
            const targetY = e.clientY - rect.top;

            function animate() {
            const dx = targetX - currentX;
            const dy = targetY - currentY;

            // Arrêter si très proche (moins de 0.5px)
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                currentX = targetX;
                currentY = targetY;
            } else {
                currentX += dx * lerpFactor;
                currentY += dy * lerpFactor;
            }

            lightElement.classList.remove('hidden');
            lightElement.style.left = `${currentX}px`;
            lightElement.style.top = `${currentY}px`;

            // Continuer l'animation si pas encore arrivée
            if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                currentX = targetX;
                currentY = targetY;
            }
            }

            animate();
        } else {
            lightElement.classList.add('hidden');
            currentX = 0;
            currentY = 0;
        }
    }
    document.addEventListener('mousemove', updateLight);


    // Auto-scroll au clic sur la flèche
    const arrow = document.getElementById('arrowd');

    arrow.addEventListener("click", function() {
        const box = document.getElementById('box');
        const startPosition = window.scrollY;
        const targetPosition = box.offsetTop;
        const distance = targetPosition - startPosition;
        const duration = 3000; 
        let startTime = null;
    
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            
            window.scrollTo(0, startPosition + distance * easeProgress);
    
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }    
        requestAnimationFrame(animation);
    });

    // Défilé fondu du contenu de la page
    function updateFrame() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
    
        const frame = document.getElementById('expanding-frame');
        // Calculate opacity based on scroll position
        const opacity = Math.min(1, (scrollPosition / (documentHeight - windowHeight)) * 1.5);
        frame.style.opacity = opacity;
    }
    window.addEventListener('scroll', updateFrame);


    // Fond étoilé
    function createStarryBackground() {
        const starsContainer = document.createElement('div');
        starsContainer.id = 'starry-background';
        starsContainer.style.position = 'fixed';
        starsContainer.style.top = '0';
        starsContainer.style.left = '0';
        starsContainer.style.width = '100%';
        starsContainer.style.height = '100%';
        starsContainer.style.pointerEvents = 'none';
        starsContainer.style.zIndex = '20';
        starsContainer.style.overflow = 'hidden';
    
        const starCount = Math.floor(window.innerWidth * window.innerHeight / 5000);
    
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Random positioning
            star.style.position = 'absolute';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            // Random size and opacity
            const size = Math.random() * 2;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            star.style.borderRadius = '50%';
            star.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.5)';
    
            starsContainer.appendChild(star);
        }
    
        // Diminution de l'opacité des étoiles au scroll
        function updateStarOpacity() {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
    
            const stars = starsContainer.querySelectorAll('.star');
            stars.forEach((star, index) => {
                // Calculate opacity based on scroll position
                const opacity = Math.max(0, 1 - (scrollPosition / (documentHeight - windowHeight)) * 1.5);
                star.style.opacity = opacity;
            });
        }
        window.addEventListener('scroll', updateStarOpacity);

        // Mouvement des étoiles
        function addStarParallax() {
            const starsContainer = document.getElementById('starry-background');
            const stars = starsContainer.querySelectorAll('.star');

            // positions des étoiles
            const starPositions = Array.from(stars).map(star => ({
                el: star,
                currentX: 0,
                currentY: 0,
                targetX: 0,
                targetY: 0
            }));
        
            function updateStarPositions() {
                starPositions.forEach(star => {
                    // Interpolation douce (effet ressort)
                    star.currentX += (star.targetX - star.currentX) * 0.05;
                    star.currentY += (star.targetY - star.currentY) * 0.05;
                    
                    star.el.style.transform = `translate(${star.currentX}px, ${star.currentY}px)`;
                });
                // Continue animation
                requestAnimationFrame(updateStarPositions);
            }
        
            document.addEventListener('mousemove', (event) => {
                const { clientX, clientY } = event;
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
        
                starPositions.forEach(star => {
                    const starX = parseFloat(star.el.style.left);
                    const starY = parseFloat(star.el.style.top);
                    
                    star.targetX = (starX + 100) * 0.1 * ((clientX - centerX) / centerX);
                    star.targetY = (starY + 100) * 0.1 * ((clientY - centerY) / centerY);
                });
            });

            updateStarPositions();
        }
    
        document.body.appendChild(starsContainer);
        addStarParallax();
    }

    createStarryBackground()
});