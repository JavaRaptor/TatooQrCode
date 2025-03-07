const API_KEY = 'AIzaSyAQbFEY-tVIBA40QUCPLjlatQOtHdKZpY0';  // Remplace par ta clé API
const CHANNEL_ID = 'UCTptd_keVutnS2bXPRb9vOQ';  // Remplace par ton ID de chaîne

async function fetchVideos() {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&key=${API_KEY}`);
    const data = await response.json();
    displayVideos(data.items);
}

async function fetchComments(videoId) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}`);
    const data = await response.json();
    return data.items;
}

function displayVideos(videos) {
    const container = document.getElementById('videosContainer');
    container.innerHTML = '';  // Clear previous videos
    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const videoElement = document.createElement('div');
        videoElement.classList.add('video');
        videoElement.innerHTML = `<h3>${title}</h3>`;
        
        fetchComments(videoId).then(comments => {
            comments.forEach(comment => {
                const author = comment.snippet.topLevelComment.snippet.authorDisplayName;
                const text = comment.snippet.topLevelComment.snippet.textDisplay;
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `<strong>${author}</strong>: ${text}`;
                videoElement.appendChild(commentElement);
            });
        });
        
        container.appendChild(videoElement);
    });
}

// Appel à la fonction pour récupérer et afficher les vidéos et leurs commentaires
fetchVideos();
