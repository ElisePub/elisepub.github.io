document.addEventListener('DOMContentLoaded', () => {
    // Cache des sélecteurs DOM fréquemment utilisés
    const mainElement = document.getElementById('main');
    const lightElement = document.getElementById('mouse-light');
    const body = document.body;
    
    // ===== HALO DE LUMIÈRE =====
    const setupMouseLight = () => {
        let currentX = 0;
        let currentY = 0;
        const lerpFactor = 0.1;
        let animationFrameId = null;
        
        // Facteur d'échelle basé sur la résolution
        const scaleFactor = Math.min(1, 1920 / window.innerWidth);
        
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

            if (!isInside) {
                lightElement.classList.add('hidden');
                currentX = 0;
                currentY = 0;
                return;
            }
            
            const targetX = e.clientX - rect.left;
            const targetY = e.clientY - rect.top;

            function animate() {
                const dx = targetX - currentX;
                const dy = targetY - currentY;
                
                // Optimisation: arrêter si très proche
                if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                    currentX = targetX;
                    currentY = targetY;
                    return;
                }
                
                currentX += dx * lerpFactor * scaleFactor; // Appliquer le facteur d'échelle
                currentY += dy * lerpFactor * scaleFactor;
                
                lightElement.classList.remove('hidden');
                lightElement.style.left = `${currentX}px`;
                lightElement.style.top = `${currentY}px`;

                // Continuer l'animation si nécessaire
                if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
                    animationFrameId = requestAnimationFrame(animate);
                }
            }
            
            animate();
        }
        
        // Utilisation de requestIdleCallback pour les calculs non critiques
        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
                document.addEventListener('mousemove', updateLight);
            });
        } else {
            setTimeout(() => {
                document.addEventListener('mousemove', updateLight);
            }, 50);
        }
    };
    
    // ===== AUTO-SCROLL =====
    const setupArrowScroll = () => {
        const arrow = document.getElementById('arrowd');
        const box = document.getElementById('box');
        
        arrow.addEventListener("click", function() {
            const startPosition = window.scrollY;
            const targetPosition = box.offsetTop;
            const distance = targetPosition - startPosition;
            const duration = 3000;
            
            // Utilisation de requestAnimationFrame pour une animation fluide
            const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
            let startTime;
            
            function animation(currentTime) {
                startTime ??= currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                window.scrollTo(0, startPosition + distance * easeOutQuart(progress));
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
        });
    };
    
    // ===== EFFET DE FONDU =====
    const setupScrollFade = () => {
        const frame = document.getElementById('expanding-frame');
        
        // Utilisation de throttle pour optimiser les événements de scroll
        let lastScrollTime = 0;
        const throttleTime = 10; // ms
        
        function updateFrame() {
            const now = Date.now();
            if (now - lastScrollTime < throttleTime) return;
            lastScrollTime = now;
            
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Calcul de l'opacité basé sur la position de défilement
            const opacity = Math.min(1, (scrollPosition / (documentHeight - windowHeight)) * 1.5);
            frame.style.opacity = opacity;
        }
        
        window.addEventListener('scroll', updateFrame);
    };
    
    // ===== FOND ÉTOILÉ =====
    const createStarryBackground = () => {
        // Création d'un fragment pour améliorer les performances
        const fragment = document.createDocumentFragment();
        const starsContainer = document.createElement('div');
        starsContainer.id = 'starry-background';
        
        Object.assign(starsContainer.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: '20',
            overflow: 'hidden'
        });
        
        // Ajustement dynamique de la densité d'étoiles en fonction de la taille d'écran
        const starDensity = Math.max(12000, 17000 + (1920 - window.innerWidth) * 2);
        const starCount = Math.floor(window.innerWidth * window.innerHeight / starDensity);
        const starPositions = [];
        
        // Facteur d'échelle pour réduire la complexité visuelle sur grands écrans
        const scaleFactor = Math.min(1, 1920 / window.innerWidth);
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            const left = Math.random() * 100;
            const top = Math.random() * 100;
        
            const size = Math.random() * 2 * scaleFactor;
            
            Object.assign(star.style, {
                position: 'absolute',
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
                boxShadow: `0 0 ${3 * scaleFactor}px rgba(255, 255, 255, 0.5)`
            });
            
            fragment.appendChild(star);
            
            starPositions.push({
                el: star,
                currentX: 0,
                currentY: 0,
                targetX: 0,
                targetY: 0,
                baseLeft: left,
                baseTop: top
            });
        }
        
        starsContainer.appendChild(fragment);
        
        // Utiliser requestIdleCallback pour l'ajout au DOM
        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
                body.appendChild(starsContainer);
                setupStarEffects(starsContainer, starPositions, scaleFactor);
            });
        } else {
            setTimeout(() => {
                body.appendChild(starsContainer);
                setupStarEffects(starsContainer, starPositions, scaleFactor);
            }, 50);
        }
    };
    
    const setupStarEffects = (starsContainer, starPositions, scaleFactor) => {
        // Fonction throttle pour le scroll
        let lastScrollTime = 0;
        const throttleTime = 20;
        
        function updateStarOpacity() {
            const now = Date.now();
            if (now - lastScrollTime < throttleTime) return;
            lastScrollTime = now;
            
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const opacity = Math.max(0, 1 - (scrollPosition / (documentHeight - windowHeight)) * 1.5);
            
            starsContainer.style.opacity = opacity;
        }
        
        // Gestion du parallaxe
        function updateStarPositions() {
            starPositions.forEach(star => {
                // Interpolation fluide (effet ressort)
                star.currentX += (star.targetX - star.currentX) * 0.05 * scaleFactor;
                star.currentY += (star.targetY - star.currentY) * 0.05 * scaleFactor;
                
                star.el.style.transform = `translate(${star.currentX}px, ${star.currentY}px)`;
            });
            
            requestAnimationFrame(updateStarPositions);
        }
        
        // Debounce pour l'événement mousemove
        let mouseMoveTimeout;
        function handleMouseMove(event) {
            if (mouseMoveTimeout) return;
            
            mouseMoveTimeout = setTimeout(() => {
                mouseMoveTimeout = null;
                
                const { clientX, clientY } = event;
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                
                // Réduire l'intensité de l'effet sur grands écrans
                const intensityFactor = 0.3 * scaleFactor;
                
                starPositions.forEach(star => {
                    star.targetX = star.baseLeft * intensityFactor * ((clientX - centerX) / centerX);
                    star.targetY = star.baseTop * intensityFactor * ((clientY - centerY) / centerY);
                });
            }, 10);
        }
        
        window.addEventListener('scroll', updateStarOpacity);
        document.addEventListener('mousemove', handleMouseMove);
        updateStarPositions();
    };
    
    // Initialisation de toutes les fonctionnalités
    setupMouseLight();
    setupArrowScroll();
    setupScrollFade();
    createStarryBackground();
});