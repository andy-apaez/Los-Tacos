document.addEventListener("DOMContentLoaded", () => {
  // Declare currentItem to avoid implicit globals
  let currentItem = null;

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

  // --- Modal Logic ---
  const modal = document.getElementById("itemModal");
  const modalName = document.getElementById("modalItemName");
  const modalDescription = document.getElementById("modalItemDescription");
  const modalPrice = document.getElementById("modalItemPrice");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const closeBtn = document.querySelector("#itemModal .close-btn");

  // Open modal on add-btn click
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const menuItem = e.target.closest(".menu-item");
      if (!menuItem) return;

      const name = menuItem.dataset.name || menuItem.querySelector(".menu-info")?.innerText.split("\n")[0];
      const description = menuItem.dataset.description || "No description available.";
      const price = menuItem.dataset.price || menuItem.querySelector(".menu-info")?.innerText.split("\n")[1];

      modalName.textContent = name;
      modalDescription.textContent = description;
      modalPrice.textContent = price;
      currentItem = { name, description, price: parseFloat(price.replace(/[^0-9.]/g, "")) };

      modal.classList.remove("hidden");
    });
  });

  // Close modal on close button
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }
  // Close modal when clicking outside modal content
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }

  // Optional: close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
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
    if (!cartItemsEl || !cartTotalEl || !openCartBtn || !cartEl) return;

    cartItemsEl.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      const li = document.createElement("li");
      li.textContent = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "×";
      removeBtn.setAttribute("aria-label", `Remove ${item.name} from cart`);
      removeBtn.addEventListener("click", () => {
        cart.splice(index, 1);
        updateCartUI();
      });

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
    } else {
      cartEl.classList.remove("hidden");
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
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      if (!currentItem) return;
      addToCart(currentItem);
      modal.classList.add("hidden");
    });
  }

  if (openCartBtn && cartEl) {
    openCartBtn.addEventListener("click", () => {
      cartEl.classList.toggle("hidden");
    });
  }

  if (closeCartBtn && cartEl) {
    closeCartBtn.addEventListener("click", () => {
      console.log("Close cart clicked");  // Debug log
      cartEl.classList.add("hidden");
    });
  } else {
    console.warn("closeCartBtn or cartEl not found");
  }

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
      } else {
        alert("Checkout is not implemented yet.");
      }
    });
  }

  updateCartUI();
});















