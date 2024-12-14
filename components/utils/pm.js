async function fetchTopIdols() {
    const skeleton = document.getElementById('loading-skeleton-top-idol');
    const list = document.getElementById('top-idol-list');

    try {
        const topIdolsResponse = await fetch('https://production.jkt48pm.my.id/api/top-idol');
        const topIdolsData = await topIdolsResponse.json();
        const membersResponse = await fetch('/data/member.json');
        const membersData = await membersResponse.json();

        if (topIdolsData.success && topIdolsData.data.length > 0) {
            skeleton.classList.add('hidden');
            list.classList.remove('hidden');
            
            const top3Idols = topIdolsData.data.slice(0, 3); 

            top3Idols.forEach((idol, index) => {
                const idolName = idol.nickname.replace(/ JKT48$/, '').trim();
                const matchedMember = membersData.find(member =>
                    member.nicknames.some(nickname => nickname.toLowerCase() === idolName.toLowerCase())
                );
                const profileImage = matchedMember ? matchedMember.img_alt : `https://production.jkt48pm.my.id${idol.profile_image}`;
                const idolElement = document.createElement('div');
                idolElement.classList.add('flex', 'space-x-4', 'items-center', 'border-b', 'border-gray-700', 'pb-4', 'rounded-lg');

                let medal = '';
                if (index === 0) {
                    medal = `
                        <span class="absolute top-0 right-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            🥇
                        </span>
                    `;
                }

                idolElement.innerHTML = `
                    <div class="relative">
                        ${medal}
                        <img src="${profileImage}" alt="${idol.nickname}" class="w-16 h-16 rounded-full object-cover">
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-lg">${idol.nickname}</h3>
                    </div>
                `;

                list.appendChild(idolElement);
            });
        } else {
            list.innerHTML = '<p class="text-center text-gray-400">No top idols available this week.</p>';
        }
    } catch (error) {
        console.error('Failed to fetch top idols or member data:', error);
        list.innerHTML = '<p class="text-center text-red-500">Error loading data.</p>';
    }
}

fetchTopIdols();
