fetch('/data/ssk.json')
    .then(response => response.json())
    .then(data => {
        const candidateGrid = document.getElementById('candidate-grid');
        const loadingSkeleton = document.getElementById('loadingSkeleton');
        if (loadingSkeleton) {
            loadingSkeleton.innerHTML = '';
        }

        data.forEach(candidate => {
            const card = document.createElement('div');
            card.className = 'bg-gray-800 rounded-lg overflow-hidden transform transition-all hover:scale-105 card-container';
            card.innerHTML = `
                <div class="relative aspect-[3/4]">
                    <img src="https://ssk.jkt48.com/2024/${candidate.data.img}" alt="${candidate.name}" class="w-full h-full object-cover" loading="lazy">
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-1/2 rounded-b-lg"></div>
                </div>
                <div class="p-2 sm:p-3 md:p-4">
                <a href="/ssk/${candidate.id}" class="block">
                        <h3 class="text-sm sm:text-base md:text-lg font-semibold mb-2 md:mb-3 truncate">${candidate.name}</h3>
                    </a>
                </div>
            `;
            candidateGrid.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error);
        const loadingSkeleton = document.getElementById('loadingSkeleton');
        if (loadingSkeleton) {
            loadingSkeleton.innerHTML = `
                <div class="col-span-3 text-center text-gray-400">
                    <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
                    <p>Failed to load Sousenkyo data 😭</p>
                </div>
            `;
        }
    });


document.addEventListener('DOMContentLoaded', () => {
    const loadingSkeleton = document.getElementById('loadingSkeleton');
    for (let i = 0; i < 10; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.className = 'bg-gray-800 p-4 rounded-lg animate-pulse-slow';
        skeletonCard.innerHTML = `
            <div class="relative aspect-[3/4] bg-gray-600 rounded mb-4"></div>
            <div class="h-4 bg-gray-600 rounded mb-2"></div>
            <div class="h-3 bg-gray-600 rounded w-2/3"></div>
        `;
        loadingSkeleton.appendChild(skeletonCard);
    }
});
