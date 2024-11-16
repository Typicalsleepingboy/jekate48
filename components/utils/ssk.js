fetch('/data/ssk.json')
    .then(response => response.json())
    .then(data => {
        const container = document.querySelector('.grid');
        const videoModal = document.getElementById('videoModal');
        const videoContainer = document.getElementById('videoContainer');
        const closeModal = document.getElementById('closeModal');
        const loadingSkeleton = document.getElementById('loadingSkeleton'); 

        if (loadingSkeleton) {
            loadingSkeleton.innerHTML = '';
        }

        data.forEach(candidate => {
            const card = document.createElement('div');
            card.className = 'bg-gray-800 rounded-lg overflow-hidden transform transition-all hover:scale-105 card-container';
            card.innerHTML = `
            <div class="relative aspect-[3/4]">
                <img 
                    src="https://ssk.jkt48.com/2024/${candidate.data.img}" 
                    alt="${candidate.name}" 
                    class="w-full h-full object-cover"
                    loading="lazy"
                >
            </div>
            <div class="p-2 sm:p-3 md:p-4">
                <h3 class="text-sm sm:text-base md:text-lg font-semibold mb-2 md:mb-3 truncate">${candidate.name}</h3>
                <button 
                    class="watch-video-link w-full bg-red-500 hover:bg-red-600 text-white rounded-full py-1.5 sm:py-2 px-3 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 transition-colors text-xs sm:text-sm" 
                    data-video-id="${candidate.data.url_video}"
                >
                    <i class="fa-solid fa-play text-xs sm:text-sm"></i>
                    <span class="hidden sm:inline">Tonton Sekarang</span>
                    <span class="sm:hidden">Tonton</span>
                </button>
            </div>
        `;
            container.appendChild(card);
        });

        const handleModalOpen = (videoId) => {
            videoContainer.innerHTML = `<iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/${videoId}" 
            frameborder="0" 
            allow="autoplay; encrypted-media" 
            allowfullscreen
            class="rounded-lg"
        ></iframe>`;
            videoModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        };

        const handleModalClose = () => {
            videoModal.classList.add('hidden');
            videoContainer.innerHTML = '';
            document.body.style.overflow = '';
        };

        container.addEventListener('click', function (event) {
            const videoLink = event.target.closest('.watch-video-link');
            if (videoLink) {
                event.preventDefault();
                const videoId = videoLink.getAttribute('data-video-id');
                handleModalOpen(videoId);
            }
        });

        closeModal.addEventListener('click', handleModalClose);

        videoModal.addEventListener('click', (event) => {
            if (event.target === videoModal) {
                handleModalClose();
            }
        });

        window.addEventListener('popstate', handleModalClose);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                handleModalClose();
            }
        });

        let touchStartY;
        videoModal.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });

        videoModal.addEventListener('touchmove', (e) => {
            const touchEndY = e.touches[0].clientY;
            const diff = touchStartY - touchEndY;
            if (Math.abs(diff) > 50) {
                handleModalClose();
            }
        });
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error);
        const loadingSkeleton = document.getElementById('loadingSkeleton');
        if (loadingSkeleton) {
            loadingSkeleton.innerHTML = `
                <div class="col-span-3 text-center text-gray-400">
                    <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
                    <p>Gagal mendapatkan data SSK 😭</p>
                </div>
            `;
        }
    });
