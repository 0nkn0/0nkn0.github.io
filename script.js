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

document.querySelectorAll(".project-description").forEach((description, index) => {
  let toggle;
  let expanded = false;

  function updateDescription() {
    description.classList.remove("is-collapsed");
    const lineHeight = Number.parseFloat(getComputedStyle(description).lineHeight);
    const isLong = description.getBoundingClientRect().height > lineHeight * 4 + 1;

    if (!isLong) {
      description.classList.remove("is-collapsed");
      toggle?.remove();
      toggle = undefined;
      expanded = false;
      return;
    }

    if (!toggle) {
      description.id = description.id || `project-description-${index + 1}`;
      toggle = document.createElement("button");
      toggle.className = "project-description-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-controls", description.id);
      toggle.addEventListener("click", () => {
        expanded = !expanded;
        updateDescription();
      });
      description.after(toggle);
    }

    description.classList.toggle("is-collapsed", !expanded);
    toggle.textContent = expanded ? "Voir moins" : "Voir plus";
    toggle.setAttribute("aria-expanded", String(expanded));
  }

  updateDescription();
  window.addEventListener("resize", updateDescription);
});

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
