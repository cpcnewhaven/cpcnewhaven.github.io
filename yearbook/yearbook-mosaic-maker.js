const mosaicElement = document.getElementById("mosaic");

fetch("./yearbook-images")
  .then(response => response.text())
  .then(data => {
    const imageUrls = data.split("\n");
    imageUrls.forEach(url => {
      const imageElement = document.createElement("img");
      imageElement.src = url;
      imageElement.addEventListener("click", openLightbox);
      mosaicElement.appendChild(imageElement);
    });
  })
  .catch(error => {
    console.error("Error fetching image URLs:", error);
  });

function openLightbox(event) {
  const clickedImage = event.target;

  const lightboxElement = document.createElement("div");
  lightboxElement.classList.add("lightbox");
  lightboxElement.addEventListener("click", closeLightbox);

  const imageElement = document.createElement("img");
  imageElement.src = clickedImage.src;
  lightboxElement.appendChild(imageElement);

  document.body.appendChild(lightboxElement);
}

function closeLightbox(event) {
  const lightboxElement = event.target;
  lightboxElement.remove();
}