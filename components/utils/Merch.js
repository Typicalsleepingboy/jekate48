fetch('https://intensprotectionexenew.vercel.app/api/merch')
    .then(response => response.json())
    .then(data => {
        const processedData = data.map(item => {
            const matchLink = item.link.match(/\/id\/(\d+)/);
            const matchImageUrl = item.imageUrl.match(/u=(https?:\/\/.+)$/);

            return {
                ...item,
                link: matchLink ? matchLink[1] : null,
                imageUrl: matchImageUrl ? decodeURIComponent(matchImageUrl[1]) : item.imageUrl
            };
        });

        const merchGrid = document.getElementById('merch-grid');
        processedData.forEach(item => {
            const merchItem = document.createElement('div');
            merchItem.classList.add('bg-gray-800', 'rounded-lg', 'overflow-hidden');

            const image = document.createElement('img');
            image.src = item.imageUrl; 
            image.alt = item.title;
            image.classList.add('w-full', 'h-48', 'object-cover');

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
                    window.location.href = `/components/detail/news.html?id=${item.link}`;
                };
            } else {
                button.disabled = false; 
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
