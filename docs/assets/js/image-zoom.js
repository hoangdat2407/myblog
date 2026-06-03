document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".md-typeset img").forEach((img) => {
    img.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.className = "image-zoom-overlay";

      const zoomedImg = document.createElement("img");
      zoomedImg.src = img.src;
      zoomedImg.alt = img.alt || "";

      overlay.appendChild(zoomedImg);
      document.body.appendChild(overlay);

      overlay.addEventListener("click", () => {
        overlay.remove();
      });
    });
  });
});