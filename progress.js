
const progressBar = document.getElementById("progressBar");
const progressContainer = document.getElementById("progressContainer");
let progress = 0;
const interval = setInterval(() => {
    progress += 25;
    progressBar.style.width = `${progress}%`;
    if (progress >= 90) {
        clearInterval(interval);
    }
}, 100);
window.addEventListener("load", () => {
    progressBar.style.width = "100%";
    setTimeout(() => {
        progressContainer.style.display = "none";
    }, 500); 
});