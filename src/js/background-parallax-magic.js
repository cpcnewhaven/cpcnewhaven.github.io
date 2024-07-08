document.addEventListener('scroll', function() {
    const splashImage = document.querySelector('.splash-image::before');
    const scrollPosition = window.scrollY;
    splashImage.style.transform = `translateY(${scrollPosition * 0.5}px)`;
});