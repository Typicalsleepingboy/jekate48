const cloudinaryCloudName = 'dlx2zm7ha';

function isCloudinaryUrl(url) {
    return url.includes('res.cloudinary.com');
}

function getOptimizedImageUrl(originalUrl) {
    if (isCloudinaryUrl(originalUrl)) {
        return originalUrl;
    }
    if (originalUrl.includes('jkt48.com')) {
        return originalUrl;
    }
    return `https://res.cloudinary.com/${cloudinaryCloudName}/image/fetch/f_auto,q_auto,w_500,h_500,c_fill/${encodeURIComponent(originalUrl)}`;
}

fetch('https://intensprotectionexenew.vercel.app/api/merch')
    .then(response => response.json())
    .then(data => {
        const processedData = data.map(item => {
            const matchLink = item.link.match(/\/id\/(\d+)/);
            const matchImageUrl = item.imageUrl.match(/u=(https?:\/\/.+)$/);
            const originalImageUrl = matchImageUrl ? decodeURIComponent(matchImageUrl[1]) : item.imageUrl;

            return {
                ...item,
                link: matchLink ? matchLink[1] : null,
                imageUrl: getOptimizedImageUrl(originalImageUrl),
            };
        });

        const merchGrid = document.getElementById('merch-grid');
        merchGrid.innerHTML = '';

        processedData.forEach(item => {
            const merchItem = document.createElement('div');
            merchItem.classList.add('bg-gray-800', 'rounded-lg', 'overflow-hidden');

            const image = document.createElement('img');
            image.src = item.imageUrl;
            image.alt = item.title;
            image.classList.add('w-full', 'h-48', 'object-cover');
            
            image.onerror = function() {
                if (isCloudinaryUrl(this.src)) {
                    const originalUrl = decodeURIComponent(this.src.split('/fill/')[1]);
                    this.src = originalUrl;
                }

                this.onerror = () => {
                    this.src = 'https://jkt48.com/images/logo.svg';
                    this.alt = 'Image not available';
                };
            };

            const content = document.createElement('div');
            content.classList.add('p-4');

            const title = document.createElement('h3');
            title.classList.add('font-semibold', 'mb-2');
            title.textContent = item.title;

            const button = document.createElement('button');
            button.classList.add('w-full', 'mt-4', 'px-4', 'py-2', 'bg-pink-500', 'rounded-full', 'hover:bg-pink-600');
            button.textContent = 'Order Now';

            if (item.link) {
                button.onclick = () => {
                    window.location.href = `/components/detail/news?id=${item.link}`;
                };
            } else {
                button.disabled = true;
                button.classList.add('bg-gray-500', 'cursor-not-allowed');
                button.textContent = 'Invalid Link';
            }

            content.appendChild(title);
            content.appendChild(button);
            merchItem.appendChild(image);
            merchItem.appendChild(content);

            merchGrid.appendChild(merchItem);
        });
    })
    .catch(error => console.error('Error fetching data:', error));