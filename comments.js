const API_KEY = 'AIzaSyAQbFEY-tVIBA40QUCPLjlatQOtHdKZpY0';  // Remplace par ta clé API
const CHANNEL_ID = 'UCTptd_keVutnS2bXPRb9vOQ';  // Remplace par ton ID de chaîne

// Fonction pour récupérer toutes les vidéos de la chaîne
async function fetchVideos() {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&key=${API_KEY}`);
    const data = await response.json();
    displayVideos(data.items);
}

// Fonction pour récupérer les commentaires d'une vidéo, avec gestion de la pagination
async function fetchComments(videoId) {
    let comments = [];
    let nextPageToken = '';
    while (nextPageToken !== undefined) {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}&pageToken=${nextPageToken}`);
        const data = await response.json();
        data.items.forEach(item => {
            const author = item.snippet.topLevelComment.snippet.authorDisplayName;
            const text = item.snippet.topLevelComment.snippet.textDisplay;
            comments.push({ author, text });
        });
        nextPageToken = data.nextPageToken;
    }
    return comments;
}

// Fonction pour afficher les vidéos et leurs commentaires
function displayVideos(videos) {
    const container = document.getElementById('videosContainer');
    container.innerHTML = '';  // Clear previous content
    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const videoElement = document.createElement('div');
        videoElement.classList.add('video');
        videoElement.innerHTML = `<h3>${title}</h3>`;
        
        // Afficher un message de chargement pour les commentaires
        const loader = document.createElement('div');
        loader.classList.add('loader');
        loader.innerText = 'Chargement des commentaires...';
        videoElement.appendChild(loader);
        
        container.appendChild(videoElement);

        // Récupérer et afficher les commentaires de la vidéo
        fetchComments(videoId).then(comments => {
            loader.remove();  // Retirer le message de chargement
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `<strong>${comment.author}</strong><p>${comment.text}</p>`;
                videoElement.appendChild(commentElement);
            });
        });
    });
}

// Appel de la fonction pour récupérer et afficher les vidéos et les commentaires
fetchVideos();