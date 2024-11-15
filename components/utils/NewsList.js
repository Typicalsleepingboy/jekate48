fetch('https://intensprotectionexenew.vercel.app/api/news')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('news-container');
            const loadingSkeleton = document.querySelectorAll('#loading-skeleton-news');

            loadingSkeleton.forEach(skeleton => {
                skeleton.remove();
            });

            data.berita.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.classList.add('bg-gray-800', 'p-6', 'rounded-lg');

                articleElement.innerHTML = `
                    <div class="flex items-center mb-4">
                        <img src="https://res.cloudinary.com/haymzm4wp/image/upload/assets/jkt48${article.badge_url}" alt="News Badge" class="w-20 h-5 mr-2 rounded-full"/>
                        <span class="text-sm text-gray-400">${article.waktu}</span>
                    </div>
                    <h3 class="text-xl font-bold mb-2">${article.judul}</h3>
                    <a href="#" class="text-pink-500 hover:underline">Read More</a>
                `;

                newsContainer.appendChild(articleElement);
            });
        })
        .catch(error => {
            console.error('Error fetching news:', error);

        });