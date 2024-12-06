document.addEventListener("DOMContentLoaded", () => {
    const loadingSkeleton = document.getElementById("loading-skeleton-birthdays");
    const birthdayList = document.getElementById("birthday-list");

    function parseDate(indonesianDate) {
        const months = {
            Januari: "01", Februari: "02", Maret: "03", April: "04", Mei: "05", Juni: "06",
            Juli: "07", Agustus: "08", September: "09", Oktober: "10", November: "11", Desember: "12"
        };

        const [day, month, year] = indonesianDate.split(" ");
        const monthNumber = months[month];

        if (!monthNumber) {
            console.error("Invalid month in date:", indonesianDate);
            return null;
        }

        return `${year}-${monthNumber}-${day.padStart(2, "0")}`;
    }

    function getBirthdayStatus(birthdate) {
        const parsedDate = parseDate(birthdate);
        if (!parsedDate) return null;

        const today = new Date();
        const nextBirthday = new Date(parsedDate);
        nextBirthday.setFullYear(today.getFullYear());

        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        const diffTime = Math.abs(nextBirthday - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return { text: "Hari Ini", color: "bg-green-500" };
        } else if (diffDays === 1) {
            return { text: "Besok", color: "bg-yellow-500" };
        } else if (diffDays === 2) {
            return { text: "2 Hari Lagi", color: "bg-blue-500" };
        }

        return null;
    }

    fetch("https://intensprotectionexenew.vercel.app/api/birthdays")
        .then(response => response.json())
        .then(data => {
            loadingSkeleton.classList.add("hidden");
            birthdayList.classList.remove("hidden");

            if (!data || data.length === 0) {
                const noDataImage = document.createElement("img");
                noDataImage.src = "https://res.cloudinary.com/dlx2zm7ha/image/upload/v1733508715/allactkiuu9tmtrqfumi.png";
                noDataImage.alt = "No Data Found";
                noDataImage.className = "mx-auto mt-6";

                const noDataText = document.createElement("p");
                noDataText.textContent = "Tidak ada data ulang tahun.";
                noDataText.className = "text-center text-gray-500 mt-4";

                birthdayList.appendChild(noDataImage);
                birthdayList.appendChild(noDataText);
                return;
            }

            data.forEach(person => {
                const birthdayItem = document.createElement("div");
                birthdayItem.className = "flex justify-between items-center border-b border-gray-700 pb-4";

                const leftContent = document.createElement("div");
                leftContent.className = "flex space-x-4 items-center";

                const img = document.createElement("img");
                img.src = person.imgSrc;
                img.alt = person.name;
                img.className = "w-16 h-16 rounded-full object-cover";

                const textContainer = document.createElement("div");

                const nameElement = document.createElement("h3");
                nameElement.className = "font-semibold";

                const profileId = person.profileLink.split("/")[4].split("?")[0];
                const link = document.createElement("a");
                link.href = `/member/${profileId}`;
                link.target = "_self";
                link.rel = "noopener noreferrer";
                link.textContent = person.name;
                nameElement.appendChild(link);

                const birthdayElement = document.createElement("p");
                birthdayElement.className = "text-gray-400";
                birthdayElement.textContent = person.birthday;

                textContainer.appendChild(nameElement);
                textContainer.appendChild(birthdayElement);
                leftContent.appendChild(img);
                leftContent.appendChild(textContainer);

                const status = getBirthdayStatus(person.birthday);
                if (status) {
                    const badge = document.createElement("span");
                    badge.className = `${status.color} text-white px-3 py-1 rounded-full text-sm`;
                    badge.textContent = status.text;
                    birthdayItem.appendChild(leftContent);
                    birthdayItem.appendChild(badge);
                } else {
                    birthdayItem.appendChild(leftContent);
                }

                birthdayList.appendChild(birthdayItem);
            });
        })
        .catch(error => {
            console.error("Error fetching birthdays:", error);
            loadingSkeleton.textContent = "Gagal mendapatkan data birthday 😭.";
        });
});
