document.addEventListener('DOMContentLoaded', function() {
  fetch('./data/banner-content.json')
    .then(response => response.json())
    .then(data => {
      if (shouldShowBanner(data)) {
        const bannerElement = document.getElementById('warningBanner');
        bannerElement.innerHTML = `${data.bannerText} <a href="${data.linkUrl}">${data.linkText}</a>`;
        bannerElement.style.display = 'block';
      }
    })
    .catch(error => console.error('Error loading banner content:', error));
});

function shouldShowBanner(data) {
  if (!data.showBanner) return false;

  const enteredDate = new Date(data.enteredDate);
  const currentDate = new Date();
  const weeksDiff = Math.floor((currentDate - enteredDate) / (7 * 24 * 60 * 60 * 1000));

  return weeksDiff < data.displayWeeks;
}