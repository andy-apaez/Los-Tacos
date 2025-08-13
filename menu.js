document.addEventListener('DOMContentLoaded', () => {
  // --- Firebase config ---
  const firebaseConfig = {
    apiKey: "AIzaSyDulbBti8Nw-3rn7TVnTy_-LXAnv0qiZ_4",
    authDomain: "lostacosbk-f6beb.firebaseapp.com",
    projectId: "lostacosbk-f6beb",
    storageBucket: "lostacosbk-f6beb.firebasestorage.app",
    messagingSenderId: "195303768634",
    appId: "1:195303768634:web:6ad7735db3dc4d48406b03",
    measurementId: "G-4XSGKESEY7"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Initialize Firestore
  const db = firebase.firestore();

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

  // ----- Meat Selection Element inside modal -----
  const meatSelection = document.getElementById('meatSelection');

  // ----- Cart Elements -----
  const cart = document.getElementById('cart');
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsList = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  // ----- Place Order Button -----
  const placeOrderBtn = document.getElementById('placeOrderBtn');

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

    if (name === "Los Tacos Combo" || name === "Los Tacos Super Combo") {
      meatSelection.style.display = 'block';
    } else {
      meatSelection.style.display = 'none';
      meatSelection.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    }

    modal.classList.remove('hidden');
  }

  meatSelection.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const checkedBoxes = meatSelection.querySelectorAll('input[type="checkbox"]:checked');
      if (checkedBoxes.length > 3) {
        e.target.checked = false;
        alert('You can select up to 3 options only.');
      }
    }
  });

  function addItemToCart(item) {
    if (meatSelection.style.display === 'block') {
      const selectedMeats = [...meatSelection.querySelectorAll('input[type="checkbox"]:checked')]
        .map(cb => cb.value);
      if (selectedMeats.length > 0) {
        item.instructions = (item.instructions ? item.instructions + ' | ' : '') +
          'Meats: ' + selectedMeats.join(', ');
      }
    }

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
      const notes = item.instructions ? ` (Notes: ${item.instructions})` : '';
      const li = document.createElement('li');
      li.textContent = `${item.name} x${item.qty} — $${(item.price * item.qty).toFixed(2)}${notes}`;
      cartItemsList.appendChild(li);
      total += item.price * item.qty;
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    const totalQty = cartItems.reduce((sum, i) => sum + i.qty, 0);
    openCartBtn.textContent = `View Cart (${totalQty})`;
    openCartBtn.setAttribute('aria-label', `View Cart (${totalQty} items)`);
  }

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

  // ===== Horizontal Sliders =====
  document.querySelectorAll(".slider").forEach((slider) => {
    const menuItems = [...slider.querySelectorAll(".menu-item")];
    if (menuItems.length === 0) return;

    const sliderContainer = slider.parentElement;
    const arrowLeft = sliderContainer.querySelector(".prev");
    const arrowRight = sliderContainer.querySelector(".next");

    const snapPositions = menuItems.map(item => item.offsetLeft);

    function findClosestSnapPosition(scrollLeft) {
      let closest = snapPositions[0];
      let minDiff = Math.abs(scrollLeft - closest);
      for (let pos of snapPositions) {
        const diff = Math.abs(scrollLeft - pos);
        if (diff < minDiff) {
          minDiff = diff;
          closest = pos;
        }
      }
      return closest;
    }

    arrowRight?.addEventListener("click", () => {
      const currentScroll = slider.scrollLeft;
      const currentSnap = findClosestSnapPosition(currentScroll);
      const nextIndex = snapPositions.findIndex(pos => pos > currentSnap);
      if (nextIndex !== -1) {
        slider.scrollTo({ left: snapPositions[nextIndex], behavior: "smooth" });
      } else {
        slider.scrollTo({ left: slider.scrollWidth, behavior: "smooth" });
      }
    });

    arrowLeft?.addEventListener("click", () => {
      const currentScroll = slider.scrollLeft;
      const currentSnap = findClosestSnapPosition(currentScroll);
      const prevPositions = snapPositions.filter(pos => pos < currentSnap);
      if (prevPositions.length) {
        const prevSnap = prevPositions[prevPositions.length - 1];
        slider.scrollTo({ left: prevSnap, behavior: "smooth" });
      } else {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      }
    });

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
        arrowRight?.click();
        isDragging = false;
      } else if (dx < -50) {
        arrowLeft?.click();
        isDragging = false;
      }
    });
    slider.addEventListener("touchend", () => {
      isDragging = false;
    });
  });

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      target?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // ===== Back to Top =====
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

  updateCartUI();

  // ===== FIREBASE ORDER SAVE =====
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", () => {
      if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

      db.collection("orders").add({
        items: cartItems,
        total: total,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then((docRef) => {
        console.log("Order saved with ID:", docRef.id);
        alert("Order placed successfully!");
        cartItems = [];
        updateCartUI();
        cart.classList.add('hidden');
        openCartBtn.style.display = 'inline-block';
      })
      .catch((error) => {
        console.error("Error saving order:", error);
        alert("Failed to save order.");
      });
    });
  }
});
