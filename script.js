
document.addEventListener("DOMContentLoaded", function () {
  initScrollProgress();
  initHeaderScroll();
  initMobileMenu();
  initBackToTop();
  initScrollDown();
  initCopyButtons();
  initCatalog();
  initHoverEffects();
});

function initScrollProgress() {
  var bar = document.getElementById("scrollInfo");
  if (!bar) return;
  window.addEventListener("scroll", function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (window.scrollY / h * 100) + "%" : "0%";
  });
}

function initHeaderScroll() {
  var header = document.getElementById("header");
  if (!header) return;
  var update = function () { header.classList.toggle("is-scrolled", window.scrollY > 50); };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initMobileMenu() {
  var btn = document.querySelector(".esa-mobile-menu");
  var mask = document.querySelector(".mobile-menu-mask");
  var panel = document.querySelector(".mobile-menu-panel");
  if (!btn || !mask || !panel) return;

  var open = function () { btn.classList.add("is-open"); mask.classList.add("is-open"); panel.classList.add("is-open"); document.body.classList.add("menu-open"); };
  var close = function () { btn.classList.remove("is-open"); mask.classList.remove("is-open"); panel.classList.remove("is-open"); document.body.classList.remove("menu-open"); };

  btn.addEventListener("click", function () { panel.classList.contains("is-open") ? close() : open(); });
  mask.addEventListener("click", close);
  panel.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
}

function initBackToTop() {
  var top = document.querySelector(".cd-top");
  if (!top) return;
  window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 300); });
  top.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
}

function initScrollDown() {
  var sd = document.querySelector(".scroll-down");
  if (!sd) return;
  sd.addEventListener("click", function () { var m = document.getElementById("main"); if (m) window.scrollTo({ top: m.offsetTop - 20, behavior: "smooth" }); });
}

function initCopyButtons() {
  document.querySelectorAll(".esa-clipboard-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pre = this.parentElement.querySelector("pre") || this.parentElement.querySelector(".code-table");
      var text = pre ? pre.textContent : "";
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(function () { btn.textContent = "Copied!"; setTimeout(function () { btn.textContent = "Copy"; }, 2000); });
    });
  });
}

function initCatalog() {
  var cat = document.querySelector(".esa-catalog"); if (!cat) return;
  var title = cat.querySelector(".esa-catalog-title"), contents = cat.querySelector(".esa-catalog-contents");
  if (title) title.addEventListener("click", function () { contents.classList.toggle("show"); });
}

function initHoverEffects() {
  var sb = document.querySelector(".site-branding"); if (!sb) return;
  sb.addEventListener("mouseenter", function () {
    var s = this.querySelector(".sakuraso"), c = this.querySelector(".chinese-font");
    if (s) { s.style.background = "#FE9600"; s.style.color = "#fff"; }
    if (c) c.style.display = "block";
  });
  sb.addEventListener("mouseleave", function () {
    var s = this.querySelector(".sakuraso"), c = this.querySelector(".chinese-font");
    if (s) { s.style.background = "rgba(255,255,255,.5)"; s.style.color = "#464646"; }
    if (c) c.style.display = "none";
  });
}
