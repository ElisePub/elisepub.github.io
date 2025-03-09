document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('#step');

    steps.forEach(step => {
        const logoImgs = step.querySelector('#logo-img');
        const divInfo = step.querySelector('#info');
        const divInfoContent = step.querySelector('#info-content');

        logoImgs.addEventListener('mouseover', function() {
            divInfo.style.width = '40rem';
            divInfo.style.opacity = '1';
            
            setTimeout(() => {
                divInfoContent.style.opacity = '1';
            }, 400);
        });

        logoImgs.addEventListener('mouseout', function() {
            setTimeout(() => {
                divInfoContent.style.opacity = '0';
                
                setTimeout(() => {
                    divInfo.style.width = '0';
                    divInfo.style.opacity = '0';
                }, 300);
            }, 1100);
        });
    });
});