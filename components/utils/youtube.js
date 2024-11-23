async function fetchAndDisplayVideos() {
    try {
        const response = await fetch('https://intensprotectionexenew.vercel.app/api/youtube_jkt48');
        const data = await response.json();
        
        if (data.success) {
            const container = document.getElementById('youtube-container');
            container.innerHTML = ''; 
            
            data.data.forEach(video => {
                const videoCard = `
                    <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <div class="relative pb-[56.25%]">
                            <iframe
                                class="absolute top-0 left-0 w-full h-full"
                                src="https://www.youtube.com/embed/${video.id}"
                                title="${video.title}"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div class="p-4">
                            <h3 class="font-bold text-lg mb-2 line-clamp-2">${video.title}</h3>

                            <div class="mt-4 flex justify-between items-center">
                                <span class="text-sm text-gray-400">${video.channelTitle}</span>
                                <a 
                                    href="${video.url}" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    class="text-sm text-pink-500 hover:text-pink-400"
                                >
                                    Watch on YouTube
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += videoCard;
            });
        }
    } catch (error) {
        console.error('Error fetching videos:', error);
        const container = document.getElementById('youtube-container');
        container.innerHTML = `
            <div class="col-span-3 text-center text-gray-400">
                <p>Failed to load videos. Please try again later.</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayVideos);