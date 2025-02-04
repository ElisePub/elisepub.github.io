document.addEventListener('DOMContentLoaded', () => {
    /*function createTimeline() {
        parent = document.querySelector('#expanding-frame');
        for (let i = 0; i < 5; i++) {
            const point = document.createElement('div');
            point.style.width = '12px';
            point.style.height = '12px';
            point.style.border = '2px solid #efefef';
            point.style.borderRadius = 'calc(infinity * 1px)';

            const line = document.createElement('div');
            line.style.width = '1px';
            line.style.height = '6rem';
            line.style.background = '#efefef';

            parent.appendChild(point);
            parent.appendChild(line);
        }
    }

    createTimeline();*/


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