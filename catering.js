const sliderTrack = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slide');
const slideWidth = slides[0].offsetWidth + 20;
let animationPaused = false;

const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');

let currentTranslateX = 0;
const maxTranslateX = -slideWidth * 3;

// Pause animation and manual control
function pauseAnimation() {
  sliderTrack.style.animationPlayState = 'paused';
  animationPaused = true;
}

// Resume animation
function resumeAnimation() {
  sliderTrack.style.animationPlayState = 'running';
  animationPaused = false;
}

// Move slider by one slide left or right
function moveSlider(direction) {
  pauseAnimation();

  if (direction === 'left') {
    currentTranslateX += slideWidth;
    if (currentTranslateX > 0) {
      currentTranslateX = maxTranslateX;
    }
  } else {
    currentTranslateX -= slideWidth;
    if (currentTranslateX < maxTranslateX) {
      currentTranslateX = 0;
    }
  }

  sliderTrack.style.transform = `translateX(${currentTranslateX}px)`;
}

// Arrow button events
arrowLeft.addEventListener('click', () => {
  moveSlider('left');
  setTimeout(resumeAnimation, 3000); 
});

arrowRight.addEventListener('click', () => {
  moveSlider('right');
  setTimeout(resumeAnimation, 3000);
});

let startX = 0;
let isDragging = false;

sliderTrack.addEventListener('touchstart', (e) => {
  pauseAnimation();
  startX = e.touches[0].clientX;
  isDragging = true;
});

sliderTrack.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const diffX = e.touches[0].clientX - startX;
});

sliderTrack.addEventListener('touchend', (e) => {
  if (!isDragging) return;
  const endX = e.changedTouches[0].clientX;
  const diffX = endX - startX;
  if (diffX > 30) {
    moveSlider('left');
  } else if (diffX < -30) {
    moveSlider('right');
  }
  isDragging = false;
  setTimeout(resumeAnimation, 3000);
});
