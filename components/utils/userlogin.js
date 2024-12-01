const loggedInUser = localStorage.getItem("userName");
const loggedInOshimen = localStorage.getItem("userOshimen");

// Jika sudah login, langsung arahkan ke /mypage
if (loggedInUser && loggedInOshimen) {
    window.location.href = "/mypage";
}

const oshimenSelect = document.getElementById('oshimen');
async function loadOshimen() {
    const memberEndpoint = '/data/member.json';
    try {
        const response = await fetch(memberEndpoint);
        const members = await response.json();
        members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.name;
            option.textContent = member.name;
            oshimenSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading members:', error);
    }
}
loadOshimen();

document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const oshimen = document.getElementById("oshimen").value;
    if (!name || !oshimen) {
        alert("Please fill in your name and select an oshimen.");
        return;
    }
    localStorage.setItem("userName", name);
    localStorage.setItem("userOshimen", oshimen);
    window.location.href = "/mypage";
});
