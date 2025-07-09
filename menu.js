document.addEventListener("DOMContentLoaded", () => {
  const sliderContainer = document.querySelector('.slider-container');
  const tacoSlider = document.querySelector('.slider');
  const prevButton = document.createElement('button');
  const nextButton = document.createElement('button');

  prevButton.classList.add('prev');
  nextButton.classList.add('next');
  prevButton.textContent = '←';
  nextButton.textContent = '→';
  sliderContainer.appendChild(prevButton);
  sliderContainer.appendChild(nextButton);

  let currentIndex = 0;
  const itemWidth = 260; 

  function slideTo(index) {
    currentIndex = index;
    tacoSlider.style.transition = 'transform 0.5s ease-in-out';
    tacoSlider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }

  function slideLeft() {
    if (currentIndex > 0) slideTo(currentIndex - 1);
  }

  function slideRight() {
    if (currentIndex < tacoSlider.children.length - 1) {
      slideTo(currentIndex + 1);
    } else {
      slideTo(0);
    }
  }

  prevButton.addEventListener('click', slideLeft);
  nextButton.addEventListener('click', slideRight);

  setInterval(slideRight, 3000);

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

  // Swipe support
  let startX = 0;
  let isDragging = false;

  tacoSlider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  tacoSlider.addEventListener('touchmove', (e) => {
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

  tacoSlider.addEventListener('touchend', () => {
    isDragging = false;
  });
});


