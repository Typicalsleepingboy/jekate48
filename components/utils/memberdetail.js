async function getMemberId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function fetchMemberDetail() {
    try {
        const memberId = await getMemberId();

        if (!memberId) {
            throw new Error('Member ID not found 😭');
        }

        const response = await fetch(`https://intensprotectionexenew.vercel.app/api/member/${memberId}`);

        if (!response.ok) {
            throw new Error;
        }

        const data = await response.json();
        document.getElementById('loading-skeleton').classList.add('hidden');
        const contentContainer = document.getElementById('member-content');
        contentContainer.classList.remove('hidden');

        // Extract TikTok username from URL
        const getTikTokUsername = (url) => {
            const match = url.match(/@([^/]+)/);
            return match ? match[1] : '';
        };

        contentContainer.innerHTML =
            `<div class="p-4 md:p-8">
                <div class="flex flex-col md:flex-row gap-8">
                    <!-- Profile Image Section -->
                    <div class="w-full md:w-1/3 lg:w-1/4">
                        <div class="aspect-square rounded-lg overflow-hidden shadow-lg">
                            <img src="${data.profileImage || ''}" 
                                alt="${data.name || 'Member'}" 
                                class="w-full h-full object-cover"
                                onerror="this.src='/assets/img/default-avatar.jpg'">
                        </div>
                    </div>

                    <div class="flex-1 space-y-6">
                        <div class="space-y-2">
                            <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold">${data.name || 'Unknown Member'}</h1>
                            <p class="text-pink-500 text-lg">${data.nickname || '-'}</p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div class="bg-gray-700 p-4 rounded-lg">
                                <p class="text-gray-400 text-sm">Birthday</p>
                                <p class="font-medium">${data.birthdate || '-'}</p>
                            </div>
                            <div class="bg-gray-700 p-4 rounded-lg">
                                <p class="text-gray-400 text-sm">Blood Type</p>
                                <p class="font-medium">${data.bloodType || '-'}</p>
                            </div>
                            <div class="bg-gray-700 p-4 rounded-lg">
                                <p class="text-gray-400 text-sm">Height</p>
                                <p class="font-medium">${data.height || '-'}</p>
                            </div>
                            <div class="bg-gray-700 p-4 rounded-lg">
                                <p class="text-gray-400 text-sm">Zodiac</p>
                                <p class="font-medium">${data.zodiac || '-'}</p>
                            </div>
                        </div>

                        ${data.socialMedia ?
                `<div class="pt-6">
                                <h2 class="text-xl font-semibold mb-4">Social Media</h2>
                                <div class="flex flex-wrap gap-4">
                                    ${data.socialMedia.twitter ?
                    `<a href="${data.socialMedia.twitter}" 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            class="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                                                <i class="fab fa-twitter"></i>
                                                <span class="hidden sm:inline">Twitter</span>
                                        </a>`
                    : ''}
                                    ${data.socialMedia.instagram ?
                    `<a href="${data.socialMedia.instagram}" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            class="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                                                <i class="fab fa-instagram"></i>
                                                <span class="hidden sm:inline">Instagram</span>
                                        </a>`
                    : ''}
                                    ${data.socialMedia.tiktok ?
                    `<a href="${data.socialMedia.tiktok}" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            class="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                                                <i class="fab fa-tiktok"></i>
                                                <span class="hidden sm:inline">TikTok</span>
                                        </a>`
                    : ''}
                                </div>
                            </div>`
                : ''}

                        ${data.socialMedia && data.socialMedia.tiktok ?
                `<div class="pt-6">
                                <h2 class="text-xl font-semibold mb-4">TikTok Feed</h2>
                                <div class="flex justify-start">
                                    <div class="bg-gray-700 p-4 rounded-lg shadow-lg inline-block">
                                        <div class="overflow-hidden rounded-lg">
                                            <iframe
                                                id="tiktok-feed-iframe"
                                                src="https://www.tiktok.com/embed/@${getTikTokUsername(data.socialMedia.tiktok)}"
                                                style="width: 440px; height: 450px; border: none;"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowfullscreen
                                                scrolling="no"
                                            ></iframe>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                : ''}
                    </div>
                </div>
            </div>`;

    } catch (error) {
        console.error('Error fetching member details:', error);
        document.getElementById('loading-skeleton').classList.add('hidden');

        const contentContainer = document.getElementById('member-content');
        contentContainer.classList.remove('hidden');
        contentContainer.innerHTML =
            `<div class="flex flex-col items-center justify-center p-8 text-center">
                <div class="rounded-lg p-8 max-w-md w-full">
                    <i class="fas fa-exclamation-circle text-4xl text-pink-500 mb-4"></i>
                    <h2 class="text-xl font-bold mb-2">Oops!</h2>
                    <p class="text-gray-400 mb-4">Gagal mendapatkan data member 😭</p>
                    <p class="text-sm text-gray-500 mb-6">${error.message}</p>
                    <a href="/components/page/members" 
                        class="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors">
                        <i class="fas fa-arrow-left"></i>
                        Kembali ke daftar member
                    </a>
                </div>
            </div>`;
    }
}

fetchMemberDetail();