document.addEventListener("DOMContentLoaded", () => {
  // --- Hamburger Menu Toggle ---
  const hamburger = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector("nav");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("open");
    });
  }

  // --- Slider Logic ---
  const sliders = document.querySelectorAll(".slider-container");
  sliders.forEach(container => {
    const slider = container.querySelector(".slider");
    const prevBtn = container.querySelector(".prev");
    const nextBtn = container.querySelector(".next");
    const itemWidth = 270;

    if (!slider || !prevBtn || !nextBtn) return;

    function updateArrows() {
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      prevBtn.style.display = slider.scrollLeft <= 0 ? "none" : "flex";
      nextBtn.style.display = slider.scrollLeft >= maxScrollLeft - 1 ? "none" : "flex";
    }

    function slideBy(offset) {
      slider.scrollBy({ left: offset, behavior: "smooth" });
    }

    prevBtn.addEventListener("click", () => slideBy(-itemWidth));
    nextBtn.addEventListener("click", () => slideBy(itemWidth));
    slider.addEventListener("scroll", updateArrows);
    updateArrows();

    // Touch swipe support
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
      updateArrows();
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target instanceof HTMLElement) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 60,
          behavior: "smooth"
        });
      }
    });
  });

  // --- Back to top button ---
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

  // --- Modal Elements ---
  const modal = document.getElementById("itemModal");
  const modalName = document.getElementById("modalItemName");
  const modalDescription = document.getElementById("modalItemDescription");
  const modalPrice = document.getElementById("modalItemPrice");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const closeBtn = modal.querySelector(".close-btn");

  let currentItem = null;

  // Open modal when clicking add buttons
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // avoid double event if nested
      const menuItem = e.target.closest(".menu-item");
      if (!menuItem) return;

      const name = menuItem.dataset.name || menuItem.querySelector(".menu-info").innerText.split("\n")[0];
      const description = menuItem.dataset.description || "No description available.";
      const price = menuItem.dataset.price || menuItem.querySelector(".menu-info").innerText.split("\n")[1];

      modalName.textContent = name;
      modalDescription.textContent = description;
      modalPrice.textContent = price;

      currentItem = { name, description, price: parseFloat(price.replace(/[^0-9.]/g, "")) };

      modal.classList.remove("hidden");
    });
  });

  // Close modal handlers
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // --- Cart Logic ---
  const cart = [];
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const openCartBtn = document.getElementById("openCartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartEl = document.getElementById("cart");

  function updateCartUI() {
    cartItemsEl.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      const li = document.createElement("li");
      li.textContent = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;

      // Remove button
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "×";
      removeBtn.setAttribute("aria-label", `Remove ${item.name} from cart`);
      removeBtn.addEventListener("click", () => {
        cart.splice(index, 1);
        updateCartUI();
      });

      // Quantity controls
      const qtyControls = document.createElement("span");

      const minusBtn = document.createElement("button");
      minusBtn.textContent = "–";
      minusBtn.setAttribute("aria-label", `Decrease quantity of ${item.name}`);
      minusBtn.style.marginRight = "5px";
      minusBtn.addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          cart.splice(index, 1);
        }
        updateCartUI();
      });

      const plusBtn = document.createElement("button");
      plusBtn.textContent = "+";
      plusBtn.setAttribute("aria-label", `Increase quantity of ${item.name}`);
      plusBtn.addEventListener("click", () => {
        item.quantity++;
        updateCartUI();
      });

      qtyControls.appendChild(minusBtn);
      qtyControls.appendChild(plusBtn);

      li.appendChild(qtyControls);
      li.appendChild(removeBtn);

      cartItemsEl.appendChild(li);
    });

    cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
    openCartBtn.textContent = `View Cart (${cart.reduce((acc, i) => acc + i.quantity, 0)})`;

    if (cart.length === 0) {
      cartEl.classList.add("hidden");
    }
  }

  function addToCart(item) {
    const existingItem = cart.find(i => i.name === item.name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    updateCartUI();
    cartEl.classList.remove("hidden");
  }

  // Add to cart from modal button
  addToCartBtn.addEventListener("click", () => {
    if (!currentItem) return;
    addToCart(currentItem);
    modal.classList.add("hidden");
  });

  // Cart open/close
  openCartBtn.addEventListener("click", () => cartEl.classList.toggle("hidden"));
  closeCartBtn.addEventListener("click", () => cartEl.classList.add("hidden"));

  // Checkout button
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
    } else {
      alert("Checkout is not implemented yet.");
    }
  });

  // Initialize cart UI
  updateCartUI();
});













