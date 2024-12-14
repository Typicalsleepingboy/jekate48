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
    const showDateTime = new Date(`${datePart}T${timePart}:00+07:00`); 

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
                        const noDataImage = document.createElement("img");
                        noDataImage.src = "https://res.cloudinary.com/dlx2zm7ha/image/upload/v1733508715/allactkiuu9tmtrqfumi.png";
                        noDataImage.alt = "No Data Found";
                        noDataImage.className = "mx-auto mt-6";

                        const noDataText = document.createElement("p");
                        noDataText.textContent = "Tidak ada data theater.";
                        noDataText.className = "text-center text-gray-500 mt-4";

                        theaterList.appendChild(noDataImage);
                        theaterList.appendChild(noDataText);
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
