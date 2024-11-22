async function fetchMembers() {
    try {
        const response = await fetch('https://intensprotectionexenew.vercel.app/api/member');
        const responseData = await response.json();
        const data = responseData.members?.member;

        if (!Array.isArray(data)) {
            throw new Error('Data is not in the expected format');
        }
        document.getElementById('core-members').innerHTML = '';
        document.getElementById('trainee-members').innerHTML = '';

        data.forEach(member => {
            const memberCard = `
                <div class="flex flex-col items-center text-center bg-gray-700 p-4 rounded-lg">
                    <div class="w-24 h-24 mb-3">
                        <img src="https://jkt48.com${member.ava_member}" 
                            alt="${member.nama_member}" 
                            onerror="this.src='/assets/img/default-avatar.jpg'"
                            class="w-full h-full object-cover rounded-full">
                    </div>
                    <h3 class="font-semibold text-base mb-1">${member.nama_member}</h3>
                    <p class="text-green-500 text-sm">Active</p>
                    <a href="/components/detail/member?id=${member.id_member}" 
                        class="mt-2 px-4 py-2 bg-pink-500 text-white text-sm rounded-full hover:bg-pink-600 transition-colors">
                        Lihat Profil
                    </a>
                </div>
            `;

            if (member.kategori === "Anggota JKT48") {
                document.getElementById('core-members').innerHTML += memberCard;
            } else if (member.kategori === "Trainee JKT48") {
                document.getElementById('trainee-members').innerHTML += memberCard;
            }
        });
    } catch (error) {
        console.error('Error fetching members:', error);

        const errorMessage = `
            <div class="col-span-full text-center text-gray-400">
                <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
                <p>Gagal mendapatkan data 😭</p>
            </div>
        `;

        document.getElementById('core-members').innerHTML = errorMessage;
        document.getElementById('trainee-members').innerHTML = errorMessage;
    }
}

const loadingSkeleton = `
    <div class="animate-pulse flex flex-col items-center">
        <div class="w-24 h-24 bg-gray-600 rounded-full mb-4"></div>
        <div class="h-4 bg-gray-600 rounded w-20 mb-2"></div>
        <div class="h-3 bg-gray-600 rounded w-16"></div>
    </div>
`.repeat(4);

document.getElementById('core-members').innerHTML = loadingSkeleton;
document.getElementById('trainee-members').innerHTML = loadingSkeleton;

// Fetch members
fetchMembers();


