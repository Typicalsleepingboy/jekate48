fetch('/data/ssk.json')
            .then(response => response.json())
            .then(data => {
                const pathSegments = window.location.pathname.split('/');
                const id =pathSegments[pathSegments.length - 1]; 
                const candidate = data.find(item => item.id === id);

                if (candidate) {
                    document.getElementById('candidate-image').src = `https://ssk.jkt48.com/2024/${candidate.data.bg}`;
                    document.getElementById('candidate-tag').src = `https://ssk.jkt48.com/2024/${candidate.data.tag}`;
                    const watchButton = document.getElementById('watch-video');
                    watchButton.addEventListener('click', () => {
                        showModal(candidate.data.url_video);
                    });
                } else {
                    document.body.innerHTML = `
                        <div class="text-center text-gray-400 mt-16">
                            <i class="fas fa-exclamation-circle text-6xl mb-4"></i>
                            <p>Candidate not found 😭</p>
                        </div>`;
                }
            })
            .catch(error => {
                console.error('Error fetching JSON data:', error);
            });

        function showModal(videoId) {
            const modal = document.getElementById('videoModal');
            const videoContainer = document.getElementById('videoContainer');

            videoContainer.innerHTML = `
                <iframe class="w-full h-full" src="https://www.youtube.com/embed/${videoId}" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                </iframe>
            `;

            modal.classList.remove('hidden');
        }

        document.getElementById('closeModal').addEventListener('click', () => {
            const modal = document.getElementById('videoModal');
            const videoContainer = document.getElementById('videoContainer');
            videoContainer.innerHTML = '';
            modal.classList.add('hidden');
        });