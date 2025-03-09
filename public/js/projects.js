document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('#carousel-container');
    const carouselItems = document.querySelectorAll('#carousel-item');
    const prevButton = document.querySelector('#carousel-button.prev');
    const nextButton = document.querySelector('#carousel-button.next');
    
    // Configuration du carrousel
    const totalItems = carouselItems.length;
    let currentIndex = 1; // On commence par l'élément du milieu (index 1)
    
    // Largeur du conteneur
    carouselContainer.style.width = `${totalItems * 100}%`;
    
    // Largeur de chaque élément
    carouselItems.forEach(item => {
        item.style.width = `${100 / totalItems}%`;
    });
    
    updateCarousel(false);
    
    function updateCarousel(animate = true) {
        if(prevButton.disabled && currentIndex != 0){
            prevButton.disabled = false;
        } else if (nextButton.disabled && currentIndex != 2){
            nextButton.disabled = false;
        }

        const containerWidth = carouselContainer.offsetWidth;
        const itemWidthPx = containerWidth / totalItems;
        const offset = -(currentIndex * itemWidthPx) + (containerWidth / 2 - itemWidthPx / 2);
        
        if (animate) {
            carouselContainer.style.transition = 'transform 0.3s ease-in-out';
        } else {
            carouselContainer.style.transition = 'none';
        }
        
        carouselContainer.style.transform = `translateX(${offset}px)`;
        
        carouselItems.forEach((item, index) => {
            item.classList.remove('active');
            if (index === currentIndex) {
                item.classList.add('active');
            }
        });

        if(currentIndex == 0 ) {
            prevButton.disabled = true;
        } else if (currentIndex == 2){
            nextButton.disabled = true;
        }
    }
    
    function goToPrev() {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = totalItems - 1;
            // Repositionner sans animation
            updateCarousel(true);
        } else {
            updateCarousel(true);
        }
    }
    
    function goToNext() {
        currentIndex++;
        if (currentIndex >= totalItems) {
            currentIndex = 0;
            // Repositionner sans animation
            updateCarousel(true);
        } else {
            updateCarousel(true);
        }
    }

    prevButton.addEventListener('click', goToPrev);
    nextButton.addEventListener('click', goToNext);
});