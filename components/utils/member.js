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
                <div class="flex flex-col items-center text-center">
                    <div class="relative w-40 h-40 mb-2">
                        <img src="https://jkt48.com${member.ava_member}" 
                            alt="${member.nama_member}" 
                            onerror="this.src='/assets/img/default-avatar.jpg'"
                            class="w-full h-full object-cover rounded-lg shadow-lg">
                        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-1/2 rounded-b-lg"></div>
                    </div>
                    <div class="text-center w-full">
                        <a href="/member?id=${member.id_member}" 
                            class="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 inline-block hover:bg-white/20 transition-all duration-200">
                            <h3 class="text-sm text-white">${member.nama_member}</h3>
                        </a>
                    </div>
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
                <p>Failed to load data 😭</p>
            </div>
        `;

        document.getElementById('core-members').innerHTML = errorMessage;
        document.getElementById('trainee-members').innerHTML = errorMessage;
    }
}

const loadingSkeleton = `
    <div class="animate-pulse flex flex-col items-center">
        <div class="w-24 h-24 md:w-40 md:h-40 bg-gray-700 rounded-lg mb-2"></div>
        <div class="h-6 bg-gray-700/30 rounded-lg w-20 md:w-32"></div>
    </div>
`.repeat(4);


document.getElementById('core-members').innerHTML = loadingSkeleton;
document.getElementById('trainee-members').innerHTML = loadingSkeleton;

fetchMembers();