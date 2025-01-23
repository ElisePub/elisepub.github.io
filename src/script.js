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

            // Continuer l'animation si pas encore arrivé
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


    // Défilé du contenu de la page
    const frame = document.getElementById('expanding-frame');
    let isVisible = false;

    function updateFrame() {
        const scrollPosition = window.scrollY;
        const triggerPoint = 300; // Point de déclenchage de l'animation

        if (scrollPosition > triggerPoint && !isVisible) {
        frame.style.transform = 'scale(1)';
        frame.style.opacity = '1';
        isVisible = true;
        } else if (scrollPosition <= triggerPoint && isVisible) {
        frame.style.opacity = '0';
        isVisible = false;
        }
    }
    window.addEventListener('scroll', updateFrame);
    // Appel initial pour définir l'état correct au chargement
    updateFrame();


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
});