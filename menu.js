document.addEventListener("DOMContentLoaded", () => {
  const sliderContainers = document.querySelectorAll('.slider-container');

  sliderContainers.forEach(container => {
    const slider = container.querySelector('.slider');

    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');
    prevButton.classList.add('prev');
    nextButton.classList.add('next');
    prevButton.textContent = '←';
    nextButton.textContent = '→';

    container.appendChild(prevButton);
    container.appendChild(nextButton);

    const itemWidth = 270;

    function updateArrows() {
      const scrollLeft = slider.scrollLeft;
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

      prevButton.style.display = scrollLeft <= 0 ? 'none' : 'block';
      nextButton.style.display = scrollLeft >= maxScrollLeft - 1 ? 'none' : 'block';
    }

    function slideLeft() {
      slider.scrollBy({ left: -itemWidth, behavior: 'smooth' });
      setTimeout(updateArrows, 500);
    }

    function slideRight() {
      slider.scrollBy({ left: itemWidth, behavior: 'smooth' });
      setTimeout(updateArrows, 500);
    }

    slider.addEventListener('scroll', updateArrows);
    prevButton.addEventListener('click', slideLeft);
    nextButton.addEventListener('click', slideRight);

    // Initialize arrows
    updateArrows();

    // Touch swipe support
    let startX = 0;
    let isDragging = false;

    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    slider.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const diff = startX - e.touches[0].clientX;
      if (diff > 50) {
        slideRight();
        isDragging = false;
      } else if (diff < -50) {
        slideLeft();
        isDragging = false;
      }
    });

    slider.addEventListener('touchend', () => {
      isDragging = false;
    });
  });

  // Smooth scroll for menu links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 60,
          behavior: 'smooth'
        });
      }
    });
  });

  // Back to top button
  const backToTop = document.createElement('button');
  backToTop.textContent = '↑';
  backToTop.classList.add('back-to-top');
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 500 ? 'block' : 'none';
  });
});





