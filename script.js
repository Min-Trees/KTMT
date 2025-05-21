document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const presentationContainer = document.querySelector('.presentation-container');
    const slideIndicator = document.getElementById('slideIndicator');

    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        currentSlide = index;
        updateNavButtons();
        updateSlideIndicator();
    }

    function updateNavButtons() {
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === slides.length - 1;
    }

    function updateSlideIndicator() {
        if (slides.length > 0) {
            slideIndicator.textContent = `${currentSlide + 1} / ${slides.length}`;
        } else {
            slideIndicator.textContent = "0 / 0";
        }
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    }

    // Event Listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        switch (event.key) {
            case 'ArrowRight': case 'PageDown': case ' ':
                event.preventDefault(); nextSlide(); break;
            case 'ArrowLeft': case 'PageUp':
                event.preventDefault(); prevSlide(); break;
            case 'f': case 'F11':
                event.preventDefault(); toggleFullScreen(); break;
            case 'Home':
                event.preventDefault(); showSlide(0); break;
            case 'End':
                event.preventDefault(); showSlide(slides.length - 1); break;
        }
    });

    // Fullscreen functionality
    fullscreenBtn.addEventListener('click', toggleFullScreen);
    let fullscreenIcon = fullscreenBtn.querySelector('i');

    function toggleFullScreen() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (presentationContainer.requestFullscreen) {
                presentationContainer.requestFullscreen();
            } else if (presentationContainer.webkitRequestFullscreen) { /* Safari */
                presentationContainer.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            }
        }
    }

    document.addEventListener('fullscreenchange', updateFullscreenIcon);
    document.addEventListener('webkitfullscreenchange', updateFullscreenIcon); // For Safari

    function updateFullscreenIcon(){
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            fullscreenIcon.classList.remove('fa-expand');
            fullscreenIcon.classList.add('fa-compress');
        } else {
            fullscreenIcon.classList.remove('fa-compress');
            fullscreenIcon.classList.add('fa-expand');
        }
    }

    // Initial setup
    if (slides.length > 0) {
        showSlide(0);
        updateFullscreenIcon(); // Set initial icon state
    } else {
        prevBtn.disabled = true; nextBtn.disabled = true; fullscreenBtn.disabled = true;
        updateSlideIndicator();
    }
});