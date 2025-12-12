document.addEventListener('DOMContentLoaded', function() {
    const feedContainer = document.getElementById('instagram-feed-content');
    
    if (!feedContainer) return;

    fetch('./data/instagram-feed.json')
        .then(response => response.json())
        .then(data => {
            if (data.posts && data.posts.length > 0) {
                renderInstagramFeed(data.posts, feedContainer);
            }
        })
        .catch(error => {
            console.error('Error fetching Instagram feed:', error);
            feedContainer.innerHTML = '<p class="text-center">Follow us on Instagram <a href="https://www.instagram.com/cpcnewhaven/" target="_blank">@cpcnewhaven</a></p>';
        });
});

function renderInstagramFeed(posts, container) {
    // Take only the first 6 posts
    const displayPosts = posts.slice(0, 6);
    
    let html = '<div class="instagram-grid">';
    
    displayPosts.forEach(post => {
        html += `
            <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="instagram-item">
                <img src="${post.imageUrl}" alt="${post.caption || 'Instagram Post'}" loading="lazy">
                <div class="instagram-overlay">
                    <i class="fab fa-instagram"></i>
                </div>
            </a>
        `;
    });
    
    html += '</div>';
    html += `
        <div class="instagram-cta">
            <a href="https://www.instagram.com/cpcnewhaven/" target="_blank" class="primary-cta">
                <i class="fab fa-instagram"></i> Follow us on Instagram
            </a>
        </div>
    `;
    
    container.innerHTML = html;
}
