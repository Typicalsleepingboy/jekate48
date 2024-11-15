async function fetchLatestNews() {
            try {
                const response = await fetch('https://intensprotectionexenew.vercel.app/api/news');
                const data = await response.json();
                
                const latestNews = data.berita.slice(0, 3);
            
                const newsContainer = document.getElementById('newsContainer');
                newsContainer.innerHTML = ''; 
                
                latestNews.forEach(news => {
                    const newsCard = document.createElement('div');
                    newsCard.className = 'bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-300';
                    
                    newsCard.innerHTML = `
                        <div class="flex items-center mb-4">
                            <img src="https://res.cloudinary.com/haymzm4wp/image/upload/assets/jkt48${news.badge_url}" alt="News Badge" class="w-20 h-5 mr-2 rounded-full"/>
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">${news.judul}</h3>
                        <p class="text-gray-400">${news.waktu}</p>
                    `;
                    newsCard.style.cursor = 'pointer';
                    newsCard.addEventListener('click', () => {
                        window.location.href = `/components/detail/news.html?id=${news.berita_id}`;
                    });
                    
                    newsContainer.appendChild(newsCard);
                });
                
            } catch (error) {
                console.error('Error fetching news:', error);
                const newsContainer = document.getElementById('newsContainer');
                newsContainer.innerHTML = `
                    <div class="col-span-3 text-center text-gray-400">
                        <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
                        <p>Failed to load news. Please try again later.</p>
                    </div>
                `;
            }
        }
        document.addEventListener('DOMContentLoaded', fetchLatestNews);