async function fetchAndDisplayMV() {
    try {
        const response = await fetch('https://intensprotectionexenew.vercel.app/api/video');
        const data = await response.json();
        const mvVideo = data.find(video => video.title.includes('[MV]') && !video.title.includes('BEHIND'));
        
        if (mvVideo) {
            const titleElement = document.getElementById('mvTitle');
            const cleanTitle = mvVideo.title.replace('[MV]', '').trim();
            
            titleElement.textContent = cleanTitle;
            
        }
    } catch (error) {
        console.error('Error fetching MV data:', error);
        document.getElementById('mvTitle').textContent = 'Error loading content';
        document.getElementById('mvDate').textContent = '';
    }
}
document.addEventListener('DOMContentLoaded', fetchAndDisplayMV);