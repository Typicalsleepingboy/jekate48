async function fetchBanners() {
    try {
        const response = await fetch('https://intensprotectionexenew.vercel.app/api/banners');
        const data = await response.json();
        if (data.success) {
            setupCarousel(data.data);
        }
    } catch (error) {
        console.error('Error fetching banners:', error);
    }
}

function setupCarousel(banners) {
    const carouselElement = document.getElementById('carousel');
    let currentSlide = 0;

    banners.forEach((banner, index) => {
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
        slide.style.backgroundImage = `url(${banner.img_url})`;
        slide.style.backgroundSize = 'cover';
        slide.style.backgroundPosition = 'center';
        carouselElement.appendChild(slide);
    });

    const slides = document.querySelectorAll('.carousel-slide');

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    setInterval(nextSlide, 8000);
}
fetchBanners();