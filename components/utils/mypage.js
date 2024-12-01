const userName = localStorage.getItem("userName");
const oshimen = localStorage.getItem("userOshimen");

if (!userName || !oshimen) {
    window.location.href = "/login";
} else {
    document.getElementById("welcome-message").textContent = `Welcome, ${userName}!`;
    document.getElementById("user-name").textContent = `Your Name: ${userName}`;
    document.getElementById("user-oshimen").textContent = `Your Oshimen: ${oshimen}`;
    document.getElementById("membership-anggota").textContent = `Anggota Platinum`;
    let membershipNumber = localStorage.getItem("membershipNumber");
    if (!membershipNumber) {
        membershipNumber = `JEKATE48-${Math.floor(100000 + Math.random() * 900000).toString()}`;
        localStorage.setItem("membershipNumber", membershipNumber);
    }

    document.getElementById("membership-number").textContent = membershipNumber;
    JsBarcode("#barcode", membershipNumber.replace("JEKATE48-", ""), {
        format: "CODE39",
        lineColor: "#000",
        width: 2,
        height: 50,
        displayValue: true,
    });
    let theaterCount = localStorage.getItem("theaterCount");
    if (!theaterCount) {
        theaterCount = Math.floor(Math.random() * 50) + 1;
        localStorage.setItem("theaterCount", theaterCount);
    }

    document.getElementById("theater-count").textContent = `${theaterCount}`;
    async function fetchMemberData() {
        try {
            const response = await fetch("/data/member.json");
            if (!response.ok) throw new Error("Network response was not ok");
            const members = await response.json();
            const oshimenData = members.find((member) => member.name === oshimen);
            if (oshimenData) {
                document.getElementById("oshimen-photo").src = oshimenData.img_alt || "https://jkt48.com/images/logo.svg";
                document.getElementById("oshimen-photo").alt = oshimenData.name;
            } else {
                document.getElementById("oshimen-photo").src = "https://jkt48.com/images/logo.svg";
            }
        } catch (error) {
            console.error("Error fetching member data:", error);
            document.getElementById("oshimen-photo").src = "https://jkt48.com/images/logo.svg";
        }
    }

    fetchMemberData();
}
