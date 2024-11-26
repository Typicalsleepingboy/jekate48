function formatShowDate(dateString, showInfo) {
    const date = new Date(dateString);

    const dateOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta'
    };
    const formattedDate = new Intl.DateTimeFormat('id-ID', dateOptions).format(date);
    const time = showInfo.split(" ")[2];
    const formattedTime = `${time.replace(":", ".")} WIB`;
    return { formattedDate, formattedTime };
}


function getShowStatus(showInfo) {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [_, datePart, timePart] = showInfo.split(" ");
    const showDateTime = new Date(`${datePart}T${timePart}:00`);

    const showDateOnly = new Date(showDateTime);
    showDateOnly.setHours(0, 0, 0, 0);

    if (showDateOnly.getTime() === today.getTime()) {
        if (showDateTime <= now) {
            return {
                text: "Sedang Berlangsung",
                color: "bg-green-500",
            };
        }
        return {
            text: "Hari ini",
            color: "bg-blue-500",
        };
    }

    if (showDateOnly.getTime() === tomorrow.getTime()) {
        return {
            text: "Besok",
            color: "bg-yellow-500",
        };
    }

    return null;
}



document.addEventListener("DOMContentLoaded", () => {
    const loadingSkeletonTheater = document.getElementById("loading-skeleton-theater");
    const theaterList = document.getElementById("theater-list");

    fetch("/data/theater.json")
        .then(response => response.json())
        .then(theaterData => {
            fetch("https://intensprotectionexenew.vercel.app/api/theater")
                .then(response => response.json())
                .then(apiData => {
                    loadingSkeletonTheater.classList.add("hidden");
                    theaterList.classList.remove("hidden");

                    if (!apiData || apiData.length === 0) {
                        const noTheaterMessage = document.createElement("div");
                        noTheaterMessage.className = "col-span-3 text-center text-gray-400";
                        noTheaterMessage.innerHTML = `
                            <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
                            <p>Tidak ada theater 😭.</p>
                        `;
                        theaterList.appendChild(noTheaterMessage);
                        return;
                    }

                    apiData.forEach(show => {
                        const theaterItem = document.createElement("div");
                        theaterItem.className = "flex flex-col md:flex-row justify-between items-start border-b border-gray-700 pb-4";

                        const leftContent = document.createElement("div");
                        leftContent.className = "flex space-x-4 md:space-x-6";

                        const matchingTheater = theaterData.find(theater => theater.setlist === show.setlist);
                        const img = document.createElement("img");
                        img.src = matchingTheater ? matchingTheater.image : "https://jkt48.com/images/logo.svg";
                        img.alt = show.setlist;
                        img.className = "w-16 h-16 rounded-lg";

                        const textContainer = document.createElement("div");

                        const theaterName = document.createElement("a");
                        theaterName.href = `/theater/${encodeURIComponent(show.setlist)}`;
                        theaterName.className = "font-bold text-lg text-white-400";
                        theaterName.innerHTML = `${show.setlist}`;

                        const { formattedDate, formattedTime } = formatShowDate(show.date, show.showInfo);

                        const showDate = document.createElement("p");
                        showDate.className = "text-gray-400 text-lg";
                        showDate.innerHTML = `Waktu: ${formattedDate}`;

                        const showTime = document.createElement("p");
                        showTime.className = "text-gray-400 text-lg";
                        showTime.innerHTML = `Waktu: ${formattedTime}`;

                        const totalMembers = document.createElement("p");
                        totalMembers.className = "text-gray-400 text-lg";
                        totalMembers.innerHTML = `Total Members: ${show.members.length} yang tampil`;

                        textContainer.appendChild(theaterName);
                        textContainer.appendChild(showDate);
                        textContainer.appendChild(showTime);
                        textContainer.appendChild(totalMembers);

                        if (show.birthdayMembers && show.birthdayMembers.length > 0) {
                            const birthdayInfo = document.createElement("p");
                            birthdayInfo.className = "text-gray-400 text-lg";
                            birthdayInfo.innerHTML = `Seintansai: ${show.birthdayMembers.join(", ")}`;
                            textContainer.appendChild(birthdayInfo);
                        }

                        leftContent.appendChild(img);
                        leftContent.appendChild(textContainer);

                        const status = getShowStatus(show.showInfo);
                        if (status) {
                            const badge = document.createElement("span");
                            badge.className = `${status.color} text-white px-7 py-1 rounded-full text-sm mt-2 md:mt-0`;
                            badge.textContent = status.text;
                            theaterItem.appendChild(leftContent);
                            theaterItem.appendChild(badge);
                        } else {
                            theaterItem.appendChild(leftContent);
                        }
                        theaterList.appendChild(theaterItem);
                    });
                })
                .catch(error => {
                    console.error("Error fetching theater data:", error);
                    loadingSkeletonTheater.textContent = "Gagal mendapatkan data theater 😭.";
                });
        })
        .catch(error => {
            console.error("Error loading theater.json:", error);
            loadingSkeletonTheater.textContent = "Gagal mendapatkan data theater 😭.";
        });
});

// theater detail
function getSetlist() {
    const pathSegments = window.location.pathname.split('/');
    const setlist = pathSegments[pathSegments.length - 1];
    const decodedSetlist = decodeURIComponent(setlist);
    return decodedSetlist;
}
const fetchData = async () => {
    const setlist = getSetlist();
    
    const loadingSkeleton = document.getElementById('loadingSkeleton');
    const theaterDetails = document.getElementById('theaterDetails');
    const theaterDetails2 = document.getElementById('theaterDetails2');

    if (!setlist) {
        loadingSkeleton.textContent = 'Setlist tidak ditemukan.';
        return;
    }

    try {
        const theaterResponse = await fetch('https://intensprotectionexenew.vercel.app/api/theater');
        const theaters = await theaterResponse.json();
        const theater = theaters.find(t => decodeURIComponent(t.setlist) === setlist);

        if (!theater) {
            loadingSkeleton.textContent = 'Teater tidak ditemukan.';
            return;
        }

        const memberResponse = await fetch('/data/member.json');
        const members = await memberResponse.json();

        const setlistResponse = await fetch('/data/theater.json');
        const setlists = await setlistResponse.json();
        const setlistData = setlists.find(s => s.setlist === theater.setlist);

        loadingSkeleton.classList.add('hidden');
        theaterDetails.classList.remove('hidden');
        theaterDetails2.classList.remove('hidden');
        document.getElementById('setlistBanner').src = setlistData ? setlistData.image : '';
        document.getElementById('setlistName').textContent = theater.setlist;

        const setlistDescription = setlistData?.description || 'Deskripsi belum tersedia.';
        document.getElementById('setlistDescription').textContent = setlistDescription;

        const { formattedDate, formattedTime } = formatShowDate(theater.date, theater.showInfo);
        document.getElementById('showDate').textContent = `${formattedDate}, ${formattedTime}`;

        document.getElementById('memberCount').textContent = theater.members.length;

        const createMemberCard = (memberName, memberData) => {
            return `
                <div class="flex flex-col items-center bg-gray-700 rounded-lg p-2 hover:bg-gray-600 transition-colors">
                    <div class="w-full aspect-square mb-2 rounded-lg overflow-hidden">
                        ${memberData && memberData.img_alt ? 
                    `<img src="${memberData.img_alt}" alt="${memberName}" class="w-full h-full object-cover">` :
                    `<div class="w-full h-full bg-red-600 flex items-center justify-center">
                                <span class="text-white text-xl font-bold">JKT48</span>
                        </div>`
                }
                    </div>
                    <p class="text-sm text-center text-white font-medium">${memberName || "Tidak Diketahui"}</p>
                </div>
            `;
        };

        const membersList = document.getElementById('membersList');

        if (!theater.members || theater.members.length === 0) {
            membersList.innerHTML = `
            <div class="flex flex-col items-center bg-gray-700 rounded-lg p-2 hover:bg-gray-600 transition-colors">
                    <div class="w-full aspect-square mb-2 rounded-lg overflow-hidden">
                <div class="w-full h-full bg-red-600 flex items-center justify-center">
                    <span class="text-white text-xl font-bold">JKT48</span>
                </div>
            </div>
            `;
        } else {
            membersList.innerHTML = theater.members.map(memberName => {
                const memberData = members.find(m => m.name === memberName);
                return createMemberCard(memberName, memberData);
            }).join('');
        }

        if (theater.birthdayMembers && theater.birthdayMembers.length > 0) {
            const birthdaySection = document.getElementById('birthdaySection');
            birthdaySection.classList.remove('hidden');

            const birthdayMembers = document.getElementById('birthdayMembers');
            birthdayMembers.innerHTML = theater.birthdayMembers
                .map(memberName => `<span class="font-medium">${memberName}</span>`)
                .join(', ');

            const birthdayMemberImage = document.getElementById('birthdayMemberImage');
            const firstBirthdayMember = members.find(m => m.name === theater.birthdayMembers[0]);
            birthdayMemberImage.src = firstBirthdayMember?.img_alt || 'https://jkt48.com/images/logo.svg';
        }

        // const ticketButtonOffline = document.getElementById('ticketButtonOffline');
        // const ticketButtonOnline = document.getElementById('ticketButtonOnline');

        // ticketButtonOffline.addEventListener('click', () => {
        //     window.location.href = 'https://jkt48.com/images/logo.svg';
        // });

        // ticketButtonOnline.addEventListener('click', () => {
        //     window.location.href = '/path/to/online/ticket';
        // });
    } catch (error) {
        loadingSkeleton.textContent = 'Gagal mendapatkan data theater 😭';
        console.error(error);
    }
};

document.addEventListener('DOMContentLoaded', fetchData);