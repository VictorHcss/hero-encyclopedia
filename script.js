const slides = document.querySelector(".slides");
const images = document.querySelectorAll(".slides img");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let index = 0;

function showSlide() {
  slides.style.transform = "translateX(" + -index * 100 + "%)";
}

nextBtn.addEventListener("click", () => {
  index++;
  if (index >= images.length) {
    index = 0;
  }
  showSlide();
});

prevBtn.addEventListener("click", () => {
  index--;
  if (index < 0) {
    index = images.length - 1;
  }
  showSlide();
});

setInterval(() => {
  index++;

  if (index >= images.length) {
    index = 0;
  }
  showSlide();
}, 5000);

function startAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(nextSlide, 4000);
}

nextBtn.addEventListener("click", () => {
  nextSlide();
  startAutoSlide();
});

prevBtn.addEventListener("click", () => {
  nextSlide();
  startAutoSlide();
});

startAutoSlide();
