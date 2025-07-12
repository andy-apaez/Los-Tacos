document.addEventListener("DOMContentLoaded", () => {
  // Toggle hamburger navigation
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("open");
    });
  }

  // Toggle nav via menu-toggle
  const toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
  }

  // Slider setup for each slider container
  const sliders = document.querySelectorAll(".slider-container");

  sliders.forEach(container => {
    const slider = container.querySelector(".slider");
    const prevBtn = container.querySelector(".prev");
    const nextBtn = container.querySelector(".next");
    const itemWidth = 270; // Adjust this to match .menu-item width + margin

    if (!slider || !prevBtn || !nextBtn) return;

    function updateArrows() {
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      prevBtn.style.display = slider.scrollLeft <= 0 ? "none" : "flex";
      nextBtn.style.display = slider.scrollLeft >= maxScrollLeft - 1 ? "none" : "flex";
    }

    function slideBy(offset) {
      slider.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(updateArrows, 400);
    }

    prevBtn.addEventListener("click", () => slideBy(-itemWidth));
    nextBtn.addEventListener("click", () => slideBy(itemWidth));
    slider.addEventListener("scroll", updateArrows);
    updateArrows();

    // Touch swipe support
    let startX = 0;
    let isDragging = false;

    slider.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    slider.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const dx = startX - e.touches[0].clientX;
      if (dx > 50) {
        slideBy(itemWidth);
        isDragging = false;
      } else if (dx < -50) {
        slideBy(-itemWidth);
        isDragging = false;
      }
    });

    slider.addEventListener("touchend", () => {
      isDragging = false;
    });
  });

  // Smooth scroll for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 60,
          behavior: "smooth"
        });
      }
    });
  });

  // Back to top button
  const topBtn = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    if (topBtn) {
      topBtn.style.display = window.scrollY > 400 ? "block" : "none";
    }
  });

  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});










