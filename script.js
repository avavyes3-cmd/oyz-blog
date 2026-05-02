
document.addEventListener("DOMContentLoaded", function () {
  initScrollProgress();
  initHeaderScroll();
  initMobileMenu();
  initBackToTop();
  initScrollDown();
  initCopyButtons();
  initCatalog();
  initHoverEffects();
  initHeroBgSwitch();
});

/* Scroll progress bar */
function initScrollProgress() {
  var bar = document.getElementById("scrollInfo");
  if (!bar) return;
  window.addEventListener("scroll", function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (window.scrollY / h * 100) + "%" : "0%";
  });
}

/* Header: transparent at top, solid on scroll */
function initHeaderScroll() {
  var header = document.getElementById("header");
  if (!header) return;
  var update = function () {
    header.classList.toggle("is-scrolled", window.scrollY > 50);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* Mobile hamburger menu */
function initMobileMenu() {
  var btn = document.querySelector(".esa-mobile-menu");
  var nav = document.getElementById("mo-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", function () {
    var isOpen = nav.classList.contains("open");
    nav.classList.toggle("open", !isOpen);
    btn.classList.toggle("open", !isOpen);
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("open");
      btn.classList.remove("open");
    });
  });
}

/* Back to top button */
function initBackToTop() {
  var top = document.querySelector(".cd-top");
  if (!top) return;
  window.addEventListener("scroll", function () {
    top.classList.toggle("show", window.scrollY > 300);
  });
  top.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* Scroll down arrow */
function initScrollDown() {
  var sd = document.querySelector(".scroll-down");
  if (!sd) return;
  sd.addEventListener("click", function () {
    var m = document.getElementById("main");
    if (m) window.scrollTo({ top: m.offsetTop - 20, behavior: "smooth" });
  });
}

/* Copy code buttons */
function initCopyButtons() {
  document.querySelectorAll(".esa-clipboard-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pre = this.parentElement.querySelector("pre") ||
                this.parentElement.querySelector(".code-table");
      var text = pre ? pre.textContent : "";
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = "Copied!";
        setTimeout(function () { btn.textContent = "Copy"; }, 2000);
      });
    });
  });
}

/* Floating catalog toggle */
function initCatalog() {
  var cat = document.querySelector(".esa-catalog");
  if (!cat) return;
  var title = cat.querySelector(".esa-catalog-title");
  var contents = cat.querySelector(".esa-catalog-contents");
  if (title) {
    title.addEventListener("click", function () {
      contents.classList.toggle("show");
    });
  }
}

/* Logo hover effects */
function initHoverEffects() {
  var sb = document.querySelector(".site-branding");
  if (!sb) return;
  sb.addEventListener("mouseenter", function () {
    var s = this.querySelector(".sakuraso");
    var c = this.querySelector(".chinese-font");
    if (s) { s.style.background = "#FE9600"; s.style.color = "#fff"; }
    if (c) c.style.display = "block";
  });
  sb.addEventListener("mouseleave", function () {
    var s = this.querySelector(".sakuraso");
    var c = this.querySelector(".chinese-font");
    if (s) { s.style.background = "rgba(255,255,255,.5)"; s.style.color = "#464646"; }
    if (c) c.style.display = "none";
  });
}

/* Hero background switcher */
function initHeroBgSwitch() {
  var hero = document.querySelector(".main-header-bg");
  if (!hero) return;
  var pre = document.getElementById("bg-pre");
  var next = document.getElementById("bg-next");
  if (pre) {
    pre.addEventListener("click", function () {
      hero.style.transform = hero.style.transform === "rotate(2deg)" ? "" : "rotate(2deg)";
    });
  }
  if (next) {
    next.addEventListener("click", function () {
      hero.style.filter = hero.style.filter === "hue-rotate(15deg)" ? "" : "hue-rotate(15deg)";
    });
  }
}
