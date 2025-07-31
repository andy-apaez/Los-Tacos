document.addEventListener("DOMContentLoaded", () => {
  let currentItem = null;

/*-- Hamburger --*/
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      if (isOpen) {
        mobileMenu.setAttribute("hidden", "");
      } else {
        mobileMenu.removeAttribute("hidden");
      }
    });
  }
});




  // --- Slider Logic (horizontal sliders for menu sections) ---
  const sliders = document.querySelectorAll(".slider-container");
  sliders.forEach(container => {
    const slider = container.querySelector(".slider");
    const prevBtn = container.querySelector(".prev");
    const nextBtn = container.querySelector(".next");
    const itemWidth = 270;
    if (!slider || !prevBtn || !nextBtn) return;

    const slideBy = offset => slider.scrollBy({ left: offset, behavior: "smooth" });

    prevBtn.addEventListener("click", () => slideBy(-itemWidth));
    nextBtn.addEventListener("click", () => slideBy(itemWidth));

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
      if (dx > 50) slideBy(itemWidth), isDragging = false;
      else if (dx < -50) slideBy(-itemWidth), isDragging = false;
    });
    slider.addEventListener("touchend", () => isDragging = false);
  });

  // --- Smooth Scroll Anchors ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target instanceof HTMLElement) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 60, behavior: "smooth" });
      }
    });
  });

  // --- Back to Top Button ---
  const topBtn = document.getElementById("backToTop");
  if (topBtn) {
    window.addEventListener("scroll", () => {
      topBtn.style.display = window.scrollY > 400 ? "block" : "none";
    });
    topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // --- Modal & Cart Logic ---
  const modal = document.getElementById("itemModal");
  const modalName = document.getElementById("modalItemName");
  const modalDescription = document.getElementById("modalItemDescription");
  const modalPrice = document.getElementById("modalItemPrice");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const closeBtn = modal?.querySelector(".close-btn");

  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const menuItem = e.target.closest(".menu-item");
      if (!menuItem || !modal || !modalName || !modalDescription || !modalPrice) return;
      const info = menuItem.querySelector(".menu-info")?.innerText.split("\n") || [];
      const name = menuItem.dataset.name || info[0] || "Unnamed item";
      const description = menuItem.dataset.description || "No description available.";
      const priceRaw = menuItem.dataset.price || info[1] || "$0.00";
      modalName.textContent = name;
      modalDescription.textContent = description;
      modalPrice.textContent = priceRaw;
      currentItem = {
        name,
        description,
        price: parseFloat(priceRaw.replace(/[^0-9.]/g, "")) || 0
      };
      modal.classList.remove("hidden");
      document.body.classList.add("modal-open");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  closeBtn?.addEventListener("click", () => {
    modal?.classList.add("hidden");
    document.body.classList.remove("modal-open");
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      document.body.classList.remove("modal-open");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
      document.body.classList.remove("modal-open");
    }
  });

  const cart = [];
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const openCartBtn = document.getElementById("openCartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartEl = document.getElementById("cart");

  const updateCartUI = () => {
    if (!cartItemsEl || !cartTotalEl || !openCartBtn || !cartEl) return;
    cartItemsEl.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const li = document.createElement("li");
      li.textContent = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "×";
      removeBtn.classList.add("remove-item");
      removeBtn.setAttribute("aria-label", `Remove ${item.name}`);
      removeBtn.addEventListener("click", () => {
        cart.splice(index, 1);
        updateCartUI();
      });

      const minusBtn = document.createElement("button");
      minusBtn.textContent = "–";
      minusBtn.setAttribute("aria-label", `Decrease quantity of ${item.name}`);
      minusBtn.addEventListener("click", () => {
        if (item.quantity > 1) item.quantity--;
        else cart.splice(index, 1);
        updateCartUI();
      });

      const plusBtn = document.createElement("button");
      plusBtn.textContent = "+";
      plusBtn.setAttribute("aria-label", `Increase quantity of ${item.name}`);
      plusBtn.addEventListener("click", () => {
        item.quantity++;
        updateCartUI();
      });

      const qtyControls = document.createElement("span");
      qtyControls.classList.add("quantity-controls");
      qtyControls.append(minusBtn, plusBtn);

      li.append(qtyControls, removeBtn);
      cartItemsEl.appendChild(li);
    });
    cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
    openCartBtn.textContent = `View Cart (${cart.reduce((sum, i) => sum + i.quantity, 0)})`;
    cartEl.classList.toggle("hidden", cart.length === 0);
  };

  const addToCart = (item) => {
    const existing = cart.find(i => i.name === item.name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    updateCartUI();
  };

  addToCartBtn?.addEventListener("click", () => {
    if (currentItem) {
      addToCart(currentItem);
      modal?.classList.add("hidden");
      document.body.classList.remove("modal-open");
    }
  });

  openCartBtn?.addEventListener("click", () => cartEl?.classList.toggle("hidden"));
  closeCartBtn?.addEventListener("click", () => cartEl?.classList.add("hidden"));

  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    alert(cart.length === 0 ? "Your cart is empty!" : "Checkout is not implemented yet.");
  });

  updateCartUI();

  // --- Fullscreen Fading Image Slider ---
  const slides = document.querySelectorAll(".fullscreen-slider .slide");
  const prevSlideBtn = document.querySelector(".fullscreen-slider .prev-slide");
  const nextSlideBtn = document.querySelector(".fullscreen-slider .next-slide");
  let currentSlide = 0;

  if (slides.length > 0) {
    const showSlide = index => {
      slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
    };

    const next = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };

    const prev = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    };

    nextSlideBtn?.addEventListener("click", next);
    prevSlideBtn?.addEventListener("click", prev);

    showSlide(currentSlide);
    setInterval(next, 6000);
  }
});
