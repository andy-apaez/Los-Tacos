
const tacoSlider = document.querySelector('.slider');
const prevButton = document.createElement('button');
const nextButton = document.createElement('button');

prevButton.classList.add('prev');
nextButton.classList.add('next');
prevButton.textContent = '←';
nextButton.textContent = '→';
document.querySelector('.slider-container').appendChild(prevButton);
document.querySelector('.slider-container').appendChild(nextButton);

let currentIndex = 0; 

function slideLeft() {
  if (currentIndex > 0) {
    currentIndex--;
    tacoSlider.style.transform = `translateX(-${currentIndex * 260}px)`; 
  }
}

function slideRight() {
  if (currentIndex < tacoSlider.children.length - 1) {
    currentIndex++;
    tacoSlider.style.transform = `translateX(-${currentIndex * 260}px)`;  
  }
}

prevButton.addEventListener('click', slideLeft);
nextButton.addEventListener('click', slideRight);

setInterval(() => {
  slideRight();
}, 3000); 
