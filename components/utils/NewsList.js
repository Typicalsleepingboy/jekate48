// news list

async function fetchLatestNews() {
    try {
        const response = await fetch('https://intensprotectionexenew.vercel.app/api/news');
        const data = await response.json();

        const latestNews = data.berita.slice(0, 15);

        const newsContainer = document.getElementById('newsContainer');
        const loadingSkeleton = document.querySelectorAll('#loading-skeleton-news');
        loadingSkeleton.forEach(skeleton => {
            skeleton.remove();
        });
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
                <p>Gagal mendapatkan data news 😭</p>
            </div>
        `;
    }
}
document.addEventListener('DOMContentLoaded', fetchLatestNews);



// news detail
const urlParams = new URLSearchParams(window.location.search);
const newsId = urlParams.get('id');
let apiUrl = `https://intensprotectionexenew.vercel.app/api/news/detail/${newsId}`;

async function fetchNewsDetails() {
    try {
        if (!newsId) {
            const newsDetailContainer = document.getElementById('news-detail-container');
            const loadingSkeleton = document.querySelectorAll('#loading-skeleton-newsdetail');
            loadingSkeleton.forEach(skeleton => {
                skeleton.remove();
            });
            newsDetailContainer.innerHTML = `
                <div class="col-span-3 text-center text-gray-400">
                    <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
                    <p>Gagal mendapatkan data id theater 😭</p>
                </div>
            `;
            return;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        const newsDetailContainer = document.getElementById('news-detail-container');
        const loadingSkeleton = document.querySelectorAll('#loading-skeleton-newsdetail');
        loadingSkeleton.forEach(skeleton => {
            skeleton.remove();
        });

        const articleElement = document.createElement('div');
        articleElement.classList.add('bg-gray-800', 'p-6', 'rounded-lg');

        articleElement.innerHTML = `
            <div class="flex items-center mb-4">
                <span class="text-sm text-gray-400">${data.tanggal}</span>
            </div>
            <h3 class="text-xl font-bold mb-4">${data.judul}</h3>
            <p class="text-gray-400 whitespace-pre-line mb-6">${data.konten}</p>
        `;

        if (Array.isArray(data.gambar) && data.gambar.length > 0) {
            const imageGallery = document.createElement('div');
            imageGallery.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'gap-4', 'mb-6');

            data.gambar.forEach((imageUrl) => {
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = data.judul;
                imgElement.classList.add('rounded-lg');
                imageGallery.appendChild(imgElement);
            });

            articleElement.appendChild(imageGallery);
        }

        articleElement.innerHTML += `
            <a href="https://jkt48.com/news/detail/id/${newsId}" class="w-full mt-4 px-4 py-2 bg-pink-500 rounded-full hover:bg-pink-600">Lihat di web JEKATE48</a>
        `;

        newsDetailContainer.appendChild(articleElement);
    } catch (error) {
        console.error('Error fetching news details:', error);
        const newsDetailContainer = document.getElementById('news-detail-container');

        const loadingSkeleton = document.querySelectorAll('#loading-skeleton-newsdetail');
        loadingSkeleton.forEach(skeleton => {
            skeleton.remove();
        });

        newsDetailContainer.innerHTML = `
            <div class="col-span-3 text-center text-gray-400">
                <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
                <p>Gagal mendapatkan data news 😭</p>
            </div>
        `;
    }
}


document.addEventListener('DOMContentLoaded', fetchNewsDetails);
