fetch('/data/ssk.json')
    .then(response => response.json())
    .then(data => {
        const container = document.querySelector('.grid');
        const videoModal = document.getElementById('videoModal');
        const videoContainer = document.getElementById('videoContainer');
        const closeModal = document.getElementById('closeModal');

        data.forEach(candidate => {
            const card = document.createElement('div');
            card.className = 'bg-gray-800 p-4 rounded-lg transform transition hover:scale-105 max-w-sm'; 
            card.innerHTML = `
                <img src="https://ssk.jkt48.com/2024/${candidate.data.img}" alt="${candidate.name}" class="w-full h-48 object-cover rounded-lg mb-4">
                <h3 class="text-xl font-semibold">${candidate.name}</h3>
                </br>
                <a href="#" class="watch-video-link mt-4 px-5 py-1 bg-pink-500 rounded-full hover:bg-pink-600" data-video-id="${candidate.data.url_video}">Watch Video</a>
            `;
            container.appendChild(card);
        });

        container.addEventListener('click', function (event) {
            if (event.target.classList.contains('watch-video-link')) {
                event.preventDefault();
                const videoId = event.target.getAttribute('data-video-id');
                videoContainer.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                videoModal.classList.remove('hidden');
            }
        });

        closeModal.addEventListener('click', () => {
            videoModal.classList.add('hidden');
            videoContainer.innerHTML = '';
        });

        videoModal.addEventListener('click', (event) => {
            if (event.target === videoModal) {
                videoModal.classList.add('hidden');
                videoContainer.innerHTML = '';
            }
        });
    })
    .catch(error => console.error('Error fetching JSON data:', error));
