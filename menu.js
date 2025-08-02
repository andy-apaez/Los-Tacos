document.addEventListener("DOMContentLoaded", () => {
  // ===== Modal Logic =====
  const modal = document.getElementById("item-modal");
  const modalClose = document.getElementById("modal-close");

  const closeModal = () => {
    modal?.classList.add("hidden");
    document.body.classList.remove("modal-open");
  };

  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", () => {
      const title = item.querySelector(".item-title")?.textContent;
      const desc = item.querySelector(".item-description")?.textContent;
      const price = item.querySelector(".item-price")?.textContent;
      const imageSrc = item.querySelector("img")?.src;

      if (modal) {
        modal.querySelector(".modal-title").textContent = title;
        modal.querySelector(".modal-description").textContent = desc;
        modal.querySelector(".modal-price").textContent = price;
        modal.querySelector("img").src = imageSrc;
        modal.classList.remove("hidden");
        document.body.classList.add("modal-open");
      }
    });
  });

  modalClose?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // ===== Horizontal Sliders with Touch Support =====
  document.querySelectorAll(".slider").forEach((slider) => {
    const itemWidth = slider.querySelector(".menu-item")?.offsetWidth || 300;
    const arrowLeft = slider.previousElementSibling?.querySelector(".arrow-left");
    const arrowRight = slider.previousElementSibling?.querySelector(".arrow-right");

    const slideBy = (distance) => {
      slider.scrollBy({ left: distance, behavior: "smooth" });
    };

    arrowLeft?.addEventListener("click", () => slideBy(-itemWidth));
    arrowRight?.addEventListener("click", () => slideBy(itemWidth));

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

  // ===== Cart Logic =====
  const cart = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");
  const cartBtn = document.getElementById("cart-button");
  const closeCartBtn = document.getElementById("close-cart");
  const cartSidebar = document.getElementById("cart-sidebar");

  let cartItems = [];

  const updateCart = () => {
    if (!cart || !total) return;
    cart.innerHTML = "";
    let totalPrice = 0;

    cartItems.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
        <span class="quantity-controls">
          <button aria-label="Decrease quantity" data-index="${index}" class="decrease">–</button>
          <button aria-label="Increase quantity" data-index="${index}" class="increase">+</button>
        </span>
        <button class="remove-item" aria-label="Remove ${item.name}" data-index="${index}">×</button>
      `;
      cart.appendChild(li);
      totalPrice += item.price * item.quantity;
    });

    total.textContent = `$${totalPrice.toFixed(2)}`;
  };

  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const item = btn.closest(".menu-item");
      const name = item.querySelector(".item-title")?.textContent;
      const price = parseFloat(item.querySelector(".item-price")?.textContent.replace("$", "") || "0");

      const existingItem = cartItems.find((i) => i.name === name);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cartItems.push({ name, price, quantity: 1 });
      }

      updateCart();
    });
  });

  cart?.addEventListener("click", (e) => {
    const target = e.target;
    const index = parseInt(target.dataset.index);
    if (target.classList.contains("increase")) {
      cartItems[index].quantity++;
    } else if (target.classList.contains("decrease")) {
      cartItems[index].quantity = Math.max(1, cartItems[index].quantity - 1);
    } else if (target.classList.contains("remove-item")) {
      cartItems.splice(index, 1);
    }
    updateCart();
  });

  cartBtn?.addEventListener("click", () => {
    cartSidebar?.classList.toggle("hidden");
  });

  closeCartBtn?.addEventListener("click", () => {
    cartSidebar?.classList.add("hidden");
  });

  // ===== Back to Top Button =====
  const topBtn = document.getElementById("back-to-top");
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

});
