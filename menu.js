document.addEventListener('DOMContentLoaded', () => {
  // ----- Modal Elements -----
  const modal = document.getElementById('itemModal');
  const modalName = document.getElementById('modalItemName');
  const modalPrice = document.getElementById('modalItemPrice');
  const modalDesc = document.getElementById('modalItemDescription');
  const modalImg = document.getElementById('modalItemImage');
  const closeBtn = modal.querySelector('.close-btn');
  const qtyDisplay = document.getElementById('itemQty');
  const decreaseQtyBtn = document.getElementById('decreaseQty');
  const increaseQtyBtn = document.getElementById('increaseQty');
  const specialInstructions = modal.querySelector('.special-instructions');
  const addToCartBtn = document.getElementById('addToCartBtn');

  // ----- Cart Elements -----
  const cart = document.getElementById('cart');
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsList = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  // ----- Nav Toggle -----
  const toggleButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');

  toggleButton?.addEventListener('click', () => {
    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
    toggleButton.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('open');
  });

  // ----- State -----
  let cartItems = [];
  let currentQty = 1;
  let currentItem = null;

  function parsePrice(priceStr) {
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  }

  function updateQtyDisplay() {
    qtyDisplay.textContent = currentQty;
  }

  function openModal(menuItem) {
    currentQty = 1;
    updateQtyDisplay();

    const name = menuItem.dataset.name || 'Unknown Item';
    const description = menuItem.dataset.description || '';
    const price = menuItem.dataset.price || '$0.00';
    const imgSrc = menuItem.querySelector('img')?.src || 'images/backmodal.jpg';

    currentItem = {
      name,
      price: parsePrice(price),
      description,
      image: imgSrc,
      qty: currentQty,
      instructions: ''
    };

    modalName.textContent = name;
    modalPrice.textContent = price;
    modalDesc.textContent = description;
    modalImg.src = imgSrc;
    specialInstructions.value = '';
    modal.classList.remove('hidden');
  }

  function addItemToCart(item) {
    const existingIndex = cartItems.findIndex(ci =>
      ci.name === item.name && ci.instructions === item.instructions
    );

    if (existingIndex > -1) {
      cartItems[existingIndex].qty += item.qty;
    } else {
      cartItems.push({ ...item });
    }

    updateCartUI();
  }

  function updateCartUI() {
    cartItemsList.innerHTML = '';

    if (cartItems.length === 0) {
      cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
      cartTotal.textContent = 'Total: $0.00';
      openCartBtn.textContent = 'View Cart (0)';
      openCartBtn.setAttribute('aria-label', 'View Cart (0 items)');
      return;
    }

    let total = 0;
    cartItems.forEach(item => {
      const li = document.createElement('li');
      const notes = item.instructions ? ` (Notes: ${item.instructions})` : '';
      li.textContent = `${item.name} x${item.qty} — $${(item.price * item.qty).toFixed(2)}${notes}`;
      cartItemsList.appendChild(li);
      total += item.price * item.qty;
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    const totalQty = cartItems.reduce((sum, i) => sum + i.qty, 0);
    openCartBtn.textContent = `View Cart (${totalQty})`;
    openCartBtn.setAttribute('aria-label', `View Cart (${totalQty} items)`);
  }

  // ----- Event Listeners -----
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const menuItem = btn.closest('.menu-item');
      if (!menuItem) return;
      openModal(menuItem);
    });
  });

  decreaseQtyBtn.addEventListener('click', () => {
    if (currentQty > 1) {
      currentQty--;
      updateQtyDisplay();
    }
  });

  increaseQtyBtn.addEventListener('click', () => {
    currentQty++;
    updateQtyDisplay();
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  addToCartBtn.addEventListener('click', () => {
    if (!currentItem) return;
    currentItem.qty = currentQty;
    currentItem.instructions = specialInstructions.value.trim();
    addItemToCart(currentItem);
    modal.classList.add('hidden');
  });

  openCartBtn.addEventListener('click', () => {
    updateCartUI();
    cart.classList.remove('hidden');
    openCartBtn.style.display = 'none';
  });

  closeCartBtn.addEventListener('click', () => {
    cart.classList.add('hidden');
    openCartBtn.style.display = 'inline-block';
  });

  // ===== Horizontal Sliders with Touch Support =====
 document.querySelectorAll(".slider").forEach((slider) => {
  const itemWidth = slider.querySelector(".menu-item")?.offsetWidth || 300;
  const arrowLeft = slider.parentElement.querySelector(".prev");
  const arrowRight = slider.parentElement.querySelector(".next");

  const slideBy = (distance) => {
    slider.scrollBy({ left: distance, behavior: "smooth" });
  };

  arrowLeft?.addEventListener("click", () => slideBy(-itemWidth));
  arrowRight?.addEventListener("click", () => slideBy(itemWidth));
  
  // Touch support
  let startX = 0, startY = 0, isDragging = false;

  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  });

  slider.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const dx = startX - e.touches[0].clientX;
    const dy = Math.abs(startY - e.touches[0].clientY);
    if (dy > 30) return;
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


  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      target?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // ===== Back to Top Button =====
  const topBtn = document.getElementById("backToTop");
  let scrollTimeout;

  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      topBtn.style.display = window.scrollY > 400 ? "block" : "none";
    }, 100);
  });

  topBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Initialize cart
  updateCartUI();
});
