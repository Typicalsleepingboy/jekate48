function formatShowDate(dateString) {
    const date = new Date(dateString);

    const dateOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta'
    };
    const formattedDate = new Intl.DateTimeFormat('id-ID', dateOptions).format(date);

    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta' 
    };

    const formattedTime = `${new Intl.DateTimeFormat('id-ID', timeOptions).format(date).replace(":", ".")} WIB`;

    return { formattedDate, formattedTime };
}

function getShowStatus(showDate) {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const showDateTime = new Date(showDate);
    const showDateOnly = new Date(showDateTime);
    showDateOnly.setHours(0, 0, 0, 0);

    if (showDateOnly.getTime() === today.getTime()) {
        if (showDateTime <= now) {
            return {
                text: "Sedang Berlangsung",
                color: "bg-green-500"
            };
        }
        return {
            text: "Hari ini",
            color: "bg-blue-500"
        };
    }

    if (showDateOnly.getTime() === tomorrow.getTime()) {
        return {
            text: "Besok",
            color: "bg-yellow-500"
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

                    apiData.forEach(show => {
                        const theaterItem = document.createElement("div");
                        theaterItem.className = "flex flex-col md:flex-row justify-between items-start border-b border-gray-700 pb-4";
                    
                        const leftContent = document.createElement("div");
                        leftContent.className = "flex space-x-4 md:space-x-6"; // Adjust space for larger screens
                    
                        const matchingTheater = theaterData.find(theater => theater.setlist === show.setlist);
                        const img = document.createElement("img");
                        img.src = matchingTheater ? matchingTheater.image : "https://jkt48.com/images/logo.svg";
                        img.alt = show.setlist;
                        img.className = "w-16 h-16 rounded-lg";
                    
                        const textContainer = document.createElement("div");
                    
                        const theaterName = document.createElement("p");
                        theaterName.className = "font-bold text-lg";
                        theaterName.innerHTML = `${show.setlist}`;
                    

                        const { formattedDate, formattedTime } = formatShowDate(show.date);
                    
                        const showDate = document.createElement("p");
                        showDate.className = "text-gray-400 text-lg";
                        showDate.innerHTML = formattedDate;
                    
                        const showTime = document.createElement("p");
                        showTime.className = "text-gray-400 text-lg";
                        showTime.innerHTML = formattedTime;
                    
                        textContainer.appendChild(theaterName);
                        textContainer.appendChild(showDate);
                        textContainer.appendChild(showTime);
                    
                        leftContent.appendChild(img);
                        leftContent.appendChild(textContainer);
                    
                        const status = getShowStatus(show.date);
                        if (status) {
                            const badge = document.createElement("span");
                            badge.className = `${status.color} text-white px-7 py-1 rounded-full text-sm mt-2 md:mt-0`; // Add margin-top for mobile
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
