const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");

function setMenuOpen(isOpen) {
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  navigation.classList.toggle("is-open", isOpen);
}

menuButton.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

document.querySelectorAll(".project-gallery").forEach((gallery) => {
  const track = gallery.querySelector(".project-gallery-track");
  const slides = [...track.querySelectorAll(".gallery-slide")];
  const previous = gallery.querySelector(".gallery-prev");
  const next = gallery.querySelector(".gallery-next");
  const counter = gallery.querySelector(".gallery-count");

  if (slides.length < 2) return;

  let activeIndex = 0;

  function updateGallery() {
    activeIndex = Math.max(
      0,
      Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)),
    );
    counter.textContent = `${activeIndex + 1} / ${slides.length}`;
    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === slides.length - 1;

    slides.forEach((slide, index) => {
      if (index !== activeIndex) slide.querySelector("video")?.pause();
    });
  }

  function scrollToSlide(index) {
    track.scrollTo({
      left: index * track.clientWidth,
      behavior: "smooth",
    });
  }

  previous.addEventListener("click", () => scrollToSlide(activeIndex - 1));
  next.addEventListener("click", () => scrollToSlide(activeIndex + 1));
  track.addEventListener("scroll", updateGallery, { passive: true });
  window.addEventListener("resize", updateGallery);
  updateGallery();
});
