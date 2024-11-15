document.addEventListener("DOMContentLoaded", () => {
    const loadingSkeleton = document.getElementById("loading-skeleton-birthdays");
    const birthdayList = document.getElementById("birthday-list");

    function getBirthdayStatus(birthdate) {
        const today = new Date();
        const nextBirthday = new Date(birthdate);
        nextBirthday.setFullYear(today.getFullYear());

        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        const diffTime = Math.abs(nextBirthday - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return {
                text: "Hari Ini",
                color: "bg-green-500"
            };
        } else if (diffDays === 1) {
            return {
                text: "Besok",
                color: "bg-yellow-500"
            };
        } else if (diffDays === 2) {
            return {
                text: "2 Hari Lagi",
                color: "bg-blue-500"
            };
        }

        return null;
    }

    fetch("https://intensprotectionexenew.vercel.app/api/birthdays")
        .then(response => response.json())
        .then(data => {
            loadingSkeleton.classList.add("hidden");
            birthdayList.classList.remove("hidden");

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
                const link = document.createElement("a");
                link.href = person.profileLink;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = person.name;
                nameElement.appendChild(link);

                const birthdayElement = document.createElement("p");
                birthdayElement.className = "text-gray-400";
                birthdayElement.textContent = new Date(person.birthday).toLocaleDateString('id', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

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
            loadingSkeleton.textContent = "Failed to load birthdays.";
        });
});