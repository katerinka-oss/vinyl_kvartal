const turntable = document.querySelector(".turntable");
const recordButton = document.querySelector(".record-button");
const recordBuyButtons = document.querySelectorAll(".record-buy");
const navCart = document.querySelector(".nav-cart");
const cartCount = document.querySelector(".cart-count");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteFooter = document.querySelector(".site-footer");
const pageLoader = document.querySelector(".page-loader");

if (pageLoader) {
  const loaderStartedAt = performance.now();

  const hideLoader = () => {
    const elapsed = performance.now() - loaderStartedAt;
    const delay = Math.max(0, 900 - elapsed);

    window.setTimeout(() => {
      pageLoader.classList.add("is-hidden");
    }, delay);
  };

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
  }
}

const canUseCursorTrail =
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canUseCursorTrail) {
  const target = { x: -80, y: -80 };
  let lastSparkAt = 0;

  const createSpark = (x, y, angle) => {
    const spark = document.createElement("span");
    const driftX = Math.cos(angle) * -22 + (Math.random() - 0.5) * 18;
    const driftY = Math.sin(angle) * -22 + (Math.random() - 0.5) * 18;
    const rotation = angle * (180 / Math.PI) + (Math.random() - 0.5) * 36;

    spark.className = "cursor-spark";
    spark.setAttribute("aria-hidden", "true");
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty("--angle", `${rotation}deg`);
    spark.style.setProperty("--end-angle", `${rotation + 28}deg`);
    spark.style.setProperty("--scale", String(0.78 + Math.random() * 0.55));
    spark.style.setProperty("--tx", `${driftX}px`);
    spark.style.setProperty("--ty", `${driftY}px`);
    document.body.append(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
  };

  window.addEventListener("pointermove", (event) => {
    const now = performance.now();
    const dx = event.clientX - target.x;
    const dy = event.clientY - target.y;

    target.x = event.clientX;
    target.y = event.clientY;

    if (now - lastSparkAt > 46 && Math.hypot(dx, dy) > 7) {
      createSpark(event.clientX, event.clientY, Math.atan2(dy, dx));
      lastSparkAt = now;
    }
  });
}

recordButton?.addEventListener("click", () => {
  const isPlaying = turntable?.classList.toggle("is-playing") ?? false;

  recordButton.setAttribute("aria-pressed", String(isPlaying));
  recordButton.setAttribute(
    "aria-label",
    isPlaying ? "Остановить пластинку" : "Опустить иглу и запустить пластинку"
  );
});

const updateCartCount = () => {
  const count = document.querySelectorAll(".record-buy.is-added").length;

  if (cartCount) {
    cartCount.textContent = String(count);
  }

  navCart?.classList.toggle("has-items", count > 0);
  navCart?.setAttribute("aria-label", `Корзина, ${count} ${count === 1 ? "товар" : "товаров"}`);
};

recordBuyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isAdded = button.classList.toggle("is-added");

    button.textContent = isAdded ? "В корзине" : "В корзину";
    button.setAttribute("aria-pressed", String(isAdded));
    updateCartCount();
  });
});

menuToggle?.addEventListener("click", () => {
  const isOpen = siteHeader?.classList.toggle("menu-open") ?? false;

  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

if (siteFooter) {
  siteFooter.classList.add("footer-ready");

  if ("IntersectionObserver" in window) {
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        siteFooter.classList.add("footer-in");
        footerObserver.disconnect();
      },
      { threshold: 0.18 }
    );

    footerObserver.observe(siteFooter);
  } else {
    siteFooter.classList.add("footer-in");
  }
}
