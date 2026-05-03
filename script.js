
document.addEventListener("DOMContentLoaded", function () {
  if (typeof SITE_DATA !== "undefined") {
    renderNav(SITE_DATA.nav);
    renderMobileMenu(SITE_DATA.nav);
    if (document.getElementById("layerList")) renderLayerCards(SITE_DATA.layers);
  }
  initScrollProgress();
  initHeaderScroll();
  initMobileMenu();
  initBackToTop();
  initScrollDown();
  initCopyButtons();
  initCatalog();
  initHoverEffects();
  if (typeof PETALS_ENABLED === "undefined" || PETALS_ENABLED) initPetals();
  if (typeof MUSIC_ENABLED !== "undefined" && MUSIC_ENABLED) initMusic();
});

/* ── Render desktop nav ── */
function renderNav(nav) {
  var n = document.getElementById("navList"); if (!n) return;
  var h = "";
  nav.forEach(function (item, i) {
    if (i === nav.length - 1) {
      h += '<li><a href="'+item.url+'"><i class="fa '+item.icon+'"></i> '+item.title+'</a><i></i><ul class="sub-menu"><li><a href="https://github.com/avavyes3-cmd/oyz-blog"><i class="fa fa-github"></i> GitHub</a></li><li><a href="https://oyz-blog.vercel.app"><i class="fa fa-globe"></i> Vercel</a></li></ul></li>';
    } else {
      h += '<li><a href="'+item.url+'"><i class="fa '+item.icon+'"></i> '+item.title+'</a><i></i></li>';
    }
  });
  n.innerHTML = h;
}

/* ── Render mobile menu ── */
function renderMobileMenu(nav) {
  var p = document.querySelector(".mobile-menu-panel"); if (!p) return;
  var h = "";
  nav.forEach(function (item) {
    h += '<a href="'+item.url+'"><i class="fa '+item.icon+'"></i> '+item.title+'</a>';
  });
  h += '<a href="https://github.com/avavyes3-cmd/oyz-blog"><i class="fa fa-github"></i> GitHub</a>';
  p.innerHTML = h;
}

/* ── Render homepage layer cards from SITE_DATA.layers ── */
function renderLayerCards(layers) {
  var c = document.getElementById("layerList"); if (!c) return;
  var h = "";
  layers.forEach(function (ly, i) {
    var left = (i % 2 === 1) ? " post-list-thumb-left" : "";
    h += '<article class="post-list-thumb'+left+'"><div class="post-thumb"><a href="'+ly.url+'"><img class="lazyload" src="'+ly.thumb+'" alt="" onerror="this.remove();this.closest(\'.post-thumb\').classList.add(\'img-fallback\')"></a></div><div class="post-content-wrap"><div class="post-date"><i class="fa fa-calendar"></i> '+ly.date+'</div><h2 class="post-title"><a href="'+ly.url+'">'+ly.title+'</a></h2><div class="post-meta"><span><i class="fa fa-file-code-o"></i> '+ly.fileCount+' 文件</span><span><i class="fa fa-tag"></i> '+ly.tag+'</span></div><div class="float-content"><p>'+ly.excerpt+'</p></div></div></article>';
  });
  c.innerHTML = h;
}

/* ── Init functions ── */
function initScrollProgress() {
  var bar = document.getElementById("scrollInfo");
  if (!bar) return;
  window.addEventListener("scroll", function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (window.scrollY / h * 100) + "%" : "0%";
  });
}

function initHeaderScroll() {
  var hdr = document.getElementById("header");
  if (!hdr) return;
  var update = function () { hdr.classList.toggle("is-scrolled", window.scrollY > 50); };
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
  var top = document.querySelector(".cd-top"); if (!top) return;
  window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 300); });
  top.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
}

function initScrollDown() {
  var sd = document.querySelector(".scroll-down"); if (!sd) return;
  sd.addEventListener("click", function () { var m = document.getElementById("main"); if (m) window.scrollTo({ top: m.offsetTop - 20, behavior: "smooth" }); });
}

function initCopyButtons() {
  document.querySelectorAll(".esa-clipboard-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pre = this.parentElement.querySelector("pre") || this.parentElement.querySelector(".code-table");
      var t = pre ? pre.textContent : ""; if (!navigator.clipboard) return;
      navigator.clipboard.writeText(t).then(function () { btn.textContent = "Copied!"; setTimeout(function () { btn.textContent = "Copy"; }, 2000); });
    });
  });
}

function initCatalog() {
  var cat = document.querySelector(".esa-catalog"); if (!cat) return;
  var t = cat.querySelector(".esa-catalog-title"), ct = cat.querySelector(".esa-catalog-contents");
  if (t) t.addEventListener("click", function () { ct.classList.toggle("show"); });
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

/* ── Sakura petal falling ── */
function initPetals() {
  var petals = ["🌸","💮","🌺","🩷","✿","❀","❁"];
  var container = document.createElement("div");
  container.className = "petal-container";
  document.body.appendChild(container);

  function drop() {
    var p = document.createElement("span");
    p.className = "petal";
    p.textContent = petals[Math.floor(Math.random() * petals.length)];
    p.style.left = Math.random() * 96 + "%";
    p.style.fontSize = (16 + Math.random() * 22) + "px";
    p.style.animationDuration = (8 + Math.random() * 12) + "s";
    p.style.animationDelay = Math.random() * 3 + "s";
    container.appendChild(p);
    setTimeout(function () { p.remove(); }, 22000);
  }

  drop(); drop(); drop();
  setInterval(drop, 2200);
}

/* ── Music player ── */
function initMusic() {
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/npm/aplayer@1.10.0/dist/APlayer.min.css";
  document.head.appendChild(link);

  var div = document.createElement("div");
  div.id = "aplayer-container";
  document.body.appendChild(div);

  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/aplayer@1.10.0/dist/APlayer.min.js";
  script.onload = function () {
    new APlayer({
      container: document.getElementById("aplayer-container"),
      fixed: true,
      mini: true,
      autoplay: false,
      theme: "#FE9600",
      loop: "all",
      order: "random",
      preload: "none",
      audio: [
        { name: "Sakura", artist: "Sakura Theme", url: "", cover: "" }
      ]
    });
  };
  document.body.appendChild(script);
}
