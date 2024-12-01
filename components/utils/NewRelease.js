async function fetchAndDisplayMV() {
    const defaultTitle = '[MV] Laptime Masa Remaja - JKT48 2024 Version';
    
    try {
        const response = await fetch('https://intensprotectionexenew.vercel.app/api/video');
        const data = await response.json();
        const mvVideo = data.find(video => video.title.includes('[MV]') && !video.title.includes('BEHIND'));
        
        const titleElement = document.getElementById('mvTitle');
        
        if (mvVideo) {
            const cleanTitle = mvVideo.title.replace('[MV]', '').trim();
            titleElement.textContent = cleanTitle;
        } else {
            titleElement.textContent = defaultTitle;
        }
    } catch (error) {
        console.error('Error fetching MV data:', error);
        document.getElementById('mvTitle').textContent = defaultTitle;
    }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayMV);
