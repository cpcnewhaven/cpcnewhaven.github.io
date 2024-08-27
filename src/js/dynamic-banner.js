document.addEventListener('DOMContentLoaded', function() {
  fetch('./data/banner-content.json')
    .then(response => response.json())
    .then(data => {
      if (shouldShowBanner(data)) {
        const bannerElement = document.getElementById('warningBanner');
        bannerElement.innerHTML = `
          ${data.bannerText}
          <button onclick="window.open('${data.buttonUrl}', '_blank')">${data.buttonText}</button>
        `;
        bannerElement.style.display = 'flex';
        bannerElement.style.alignItems = 'center';
        bannerElement.style.justifyContent = 'center';
        bannerElement.style.flexWrap = 'wrap';
        bannerElement.style.gap = '10px';
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