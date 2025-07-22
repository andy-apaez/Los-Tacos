document.addEventListener("DOMContentLoaded", () => {
  let currentItem = null;
  const cart = [];

  // --- Hamburger Menu Toggle ---
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("open");
    });
  }

  // --- Smooth scroll for nav links (and close mobile menu on click) ---
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }

      // Close mobile menu if open
      if (navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  });

  // --- Slider Logic ---
  const sliders = document.querySelectorAll(".slider-container");
  sliders.forEach(container => {
    const slider = container.querySelector(".slider");
    const prevBtn = container.querySelector(".prev");
    const nextBtn = container.querySelector(".next");
    const itemWidth = 270;

    if (!slider || !prevBtn || !nextBtn) return;

    const updateArrows = () => {
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      prevBtn.style.display = slider.scrollLeft <= 0 ? "none" : "flex";
      nextBtn.style.display = slider.scrollLeft >= maxScrollLeft - 1 ? "none" : "flex";
    };

    const slideBy = offset => {
      slider.scrollBy({ left: offset, behavior: "smooth" });
    };

    prevBtn.addEventListener("click", () => slideBy(-itemWidth));
    nextBtn.addEventListener("click", () => slideBy(itemWidth));
    slider.addEventListener("scroll", updateArrows);
    updateArrows();

    let startX = 0, startY = 0, isDragging = false;

    slider.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
    });

    slider.addEventListener("touchmove", e => {
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

  // --- Smooth Scroll Anchors (general) ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target instanceof HTMLElement) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.pageYOffset - 60;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    });
  });

  // --- Back to Top Button ---
  const topBtn = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    if (topBtn) {
      topBtn.style.display = window.scrollY > 400 ? "block" : "none";
    }
  });
  topBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // --- Modal ---
  const modal = document.getElementById("itemModal");
  const modalName = document.getElementById("modalItemName");
  const modalDescription = document.getElementById("modalItemDescription");
  const modalPrice = document.getElementById("modalItemPrice");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const closeBtn = document.querySelector("#itemModal .close-btn");

  if (modal && modalName && modalDescription && modalPrice) {
    document.querySelectorAll(".add-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const menuItem = e.target.closest(".menu-item");
        if (!menuItem) return;

        const info = menuItem.querySelector(".menu-info")?.innerText.split("\n") || [];
        const name = menuItem.dataset.name || info[0] || "Unnamed item";
        const description = menuItem.dataset.description || "No description available.";
        const priceRaw = menuItem.dataset.price || info[1] || "$0.00";
        const price = parseFloat(priceRaw.replace(/[^0-9.]/g, ""));

        if (isNaN(price)) {
          alert("Invalid price format for this item.");
          return;
        }

        modalName.textContent = name;
        modalDescription.textContent = description;
        modalPrice.textContent = `$${price.toFixed(2)}`;

        currentItem = { name, description, price };
        modal.classList.remove("hidden");
      });
    });

    closeBtn?.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        modal.classList.add("hidden");
      }
    });
  }

  // --- Cart ---
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const openCartBtn = document.getElementById("openCartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartEl = document.getElementById("cart");

  function saveCart() {
    localStorage.setItem("losTacosCart", JSON.stringify(cart));
  }

  function loadCart() {
    const saved = localStorage.getItem("losTacosCart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.forEach(i => cart.push(i));
        updateCartUI();
      } catch (e) {
        console.warn("Failed to load saved cart.");
      }
    }
  }

  function updateCartUI() {
    if (!cartItemsEl || !cartTotalEl || !openCartBtn || !cartEl) return;

    cartItemsEl.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      const li = document.createElement("li");
      li.textContent = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "×";
      removeBtn.setAttribute("aria-label", `Remove ${item.name}`);
      removeBtn.addEventListener("click", () => {
        cart.splice(index, 1);
        updateCartUI();
        saveCart();
      });

      const qtyControls = document.createElement("span");
      qtyControls.style.margin = "0 10px";

      const minusBtn = document.createElement("button");
      minusBtn.textContent = "–";
      minusBtn.setAttribute("aria-label", `Decrease quantity of ${item.name}`);
      minusBtn.addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          cart.splice(index, 1);
        }
        updateCartUI();
        saveCart();
      });

      const plusBtn = document.createElement("button");
      plusBtn.textContent = "+";
      plusBtn.setAttribute("aria-label", `Increase quantity of ${item.name}`);
      plusBtn.addEventListener("click", () => {
        item.quantity++;
        updateCartUI();
        saveCart();
      });

      qtyControls.append(minusBtn, plusBtn);
      li.append(qtyControls, removeBtn);
      cartItemsEl.appendChild(li);
    });

    cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
    openCartBtn.textContent = `View Cart (${cart.reduce((sum, i) => sum + i.quantity, 0)})`;

    cartEl.classList.toggle("hidden", cart.length === 0);
  }

  function addToCart(item) {
    const existing = cart.find(i => i.name === item.name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    updateCartUI();
    saveCart();
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      if (!currentItem) return;
      addToCart(currentItem);
      modal.classList.add("hidden");
    });
  }

  openCartBtn?.addEventListener("click", () => {
    cartEl?.classList.toggle("hidden");
  });

  closeCartBtn?.addEventListener("click", () => {
    cartEl?.classList.add("hidden");
  });

  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    alert(cart.length === 0 ? "Your cart is empty!" : "Checkout is not implemented yet.");
  });

  // Load saved cart on start
  loadCart();
});

















