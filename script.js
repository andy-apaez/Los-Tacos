document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeButton = document.querySelector('.menu-close');

  // Open mobile menu
  toggleButton.addEventListener('click', () => {
    const expanded = toggleButton.getAttribute('aria-expanded') === 'true';
    toggleButton.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.hidden = expanded;
  });

  // Close mobile menu with X button
  closeButton.addEventListener('click', () => {
    toggleButton.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
  });

  // Optional: Close mobile menu when clicking a link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleButton.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    });
  });
});


// ===== Fullscreen Slider Logic =====
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll(".slide");
  const nextSlideBtn = document.querySelector(".next-slide");
  const prevSlideBtn = document.querySelector(".prev-slide");

  let currentSlide = 0;

  const showSlide = (index) => {
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[index].classList.add("active");
  };

  const next = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  };

  const prev = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  };

  let slideInterval = setInterval(next, 3000);

  const resetSlideInterval = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(next, 3000);
  };

  nextSlideBtn?.addEventListener("click", () => {
    next();
    resetSlideInterval();
  });

  prevSlideBtn?.addEventListener("click", () => {
    prev();
    resetSlideInterval();
  });

  // ✅ Arrow key controls with debug
  window.addEventListener("keydown", (e) => {
    console.log("Key pressed:", e.key); // debug log
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
      resetSlideInterval();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
      resetSlideInterval();
    }
  });
});



