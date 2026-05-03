var APP = { heroIdx: 0 };

document.addEventListener("DOMContentLoaded", function () {
  if (typeof SITE_DATA !== "undefined") {
    renderNav(SITE_DATA.nav);
    renderMobileMenu(SITE_DATA.nav);
    route();
    window.addEventListener("hashchange", route);
  }
  initCommon();
  if (typeof PETALS_ENABLED === "undefined" || PETALS_ENABLED) initPetals();
  buildSearchIndex();
  initSearchUI();
});

function initCommon() {
  initScrollProgress();
  initHeaderScroll();
  initMobileMenu();
  initBackToTop();
  initScrollDown();
  initCopyBtns();
  initHoverEffects();
}

/* ── SPA Router ── */
function route() {
  var h = location.hash || "#";
  var m = h.match(/^#layer\/(\d+)$/);
  if (m) return renderLayerPage(parseInt(m[1]));
  var cm = h.match(/^#code\/(\d+)\/(\d+)$/);
  if (cm) return renderCodePage(parseInt(cm[1]), parseInt(cm[2]));
  if (h === "#ti") return renderTIColumn();
  if (h === "#about") return renderAbout();
  var cust = h.match(/^#custom\/(.+)$/);
  if (cust) return renderCustomColumn(cust[1]);
  renderHome();
}

function renderHome() {
  var el = document.getElementById("mainContent");
  if (!el) return;
  var layers = SITE_DATA.layers || [];
  var cards = "";
  layers.forEach(function (ly, i) {
    var left = (i % 2 === 1) ? " post-list-thumb-left" : "";
    cards += '<article class="post-list-thumb' + left + '"><div class="post-thumb"><a href="#layer/' + i + '"><img class="lazyload" src="' + ly.thumb + '" alt="" onerror="this.remove();this.closest(\'.post-thumb\').classList.add(\'img-fallback\')"></a></div><div class="post-content-wrap"><div class="post-date"><i class="fa fa-calendar"></i> ' + ly.date + '</div><h2 class="post-title"><a href="#layer/' + i + '">' + ly.title + '</a></h2><div class="post-meta"><span><i class="fa fa-file-code-o"></i> ' + ly.fileCount + ' 文件</span><span><i class="fa fa-tag"></i> ' + ly.tag + '</span></div><div class="float-content"><p>' + ly.excerpt + '</p></div></div></article>';
  });
  var notice = '<div class="notice"><i class="fa fa-volume-up"></i> 海上月是天上月，眼前人是心上人。这里是 TI 竞赛智能车 2024-H 代码注释站。</div>';
  // Add custom column cards
  if (SITE_DATA.customColumns && SITE_DATA.customColumns.length > 0) {
    SITE_DATA.customColumns.forEach(function (col) {
      var thumb = (SITE_DATA.thumbImages || [])[0];
      cards += '<article class="post-list-thumb"><div class="post-thumb" style="background:linear-gradient(135deg,#f0e6ff,#e6f0ff)"><a href="#custom/' + col.id + '"></a></div><div class="post-content-wrap"><div class="post-date"><i class="fa fa-pencil"></i> 自定义栏目</div><h2 class="post-title"><a href="#custom/' + col.id + '">📝 ' + col.title + '</a></h2><div class="post-meta"><span><i class="fa fa-file-text-o"></i> ' + col.articles.length + ' 篇文章</span></div><div class="float-content"><p>点击查看 ' + col.title + ' 下的所有 Markdown 文章。</p></div></div></article>';
    });
  }
  el.innerHTML = '<div class="forFlow">' + notice + '<section class="post">' + cards + '</section><div id="footer"><div>🌸 oyz blog · Sakura Theme</div></div></div>';
  document.getElementById("main").className = "";
  document.getElementById("mainHeader").style.display = "";
  // hero
  var hero = document.querySelector(".main-header-bg");
  if (hero && SITE_DATA.heroImages) hero.style.backgroundImage = "url(" + SITE_DATA.heroImages[APP.heroIdx % SITE_DATA.heroImages.length] + ")";
  document.title = "🌸 oyz blog";
}

function renderLayerPage(idx) {
  var layers = SITE_DATA.layers || [];
  var ly = layers[idx]; if (!ly) return renderHome();
  var codeFiles = SITE_DATA.codeFiles && SITE_DATA.codeFiles[idx] ? SITE_DATA.codeFiles[idx] : [];
  var cards = "";
  codeFiles.forEach(function (cf, j) {
    var left = (j % 2 === 1) ? " post-list-thumb-left" : "";
    var thumb = (SITE_DATA.pageImages || [])[j % (SITE_DATA.pageImages||[1]).length] || "assets/img/thumb-1.jpg";
    cards += '<article class="post-list-thumb' + left + '"><div class="post-thumb"><a href="#code/' + idx + '/' + j + '"><img src="' + thumb + '" alt="" onerror="this.remove();this.closest(\'.post-thumb\').classList.add(\'img-fallback\')"></a></div><div class="post-content-wrap"><div class="post-date"><i class="fa fa-file-code-o"></i> ' + cf.name + '</div><h2 class="post-title"><a href="#code/' + idx + '/' + j + '">' + cf.name + '</a></h2><div class="post-meta"><span><i class="fa fa-folder-o"></i> ' + ly.title + '</span></div><div class="float-content"><p>点击查看完整代码与逐行中文注释。</p></div></div></article>';
  });
  var el = document.getElementById("mainContent");
  var img = (SITE_DATA.pageImages || [])[idx % (SITE_DATA.pageImages||[1]).length];
  el.innerHTML = '<div class="forFlow"><a href="#" class="back-link" onclick="location.hash=\'\';return false">返回首页</a><div class="pattern-center"><div class="pattern-attachment-img" style="background-image:url(' + img + ')"></div><header class="pattern-header"><h1 class="entry-title">' + ly.title + '</h1><p class="entry-census">共 ' + codeFiles.length + ' 个文件</p></header></div><section class="post">' + cards + '</section><div id="footer"><div>🌸 oyz blog · Sakura Theme</div></div></div>';
  document.getElementById("main").className = "nomargin";
  document.getElementById("mainHeader").style.display = "none";
  document.title = "🌸 " + ly.title + " - oyz blog";
}

function renderCodePage(li, ci) {
  var layers = SITE_DATA.layers || [];
  var ly = layers[li]; if (!ly) return renderHome();
  var codeFiles = SITE_DATA.codeFiles && SITE_DATA.codeFiles[li] ? SITE_DATA.codeFiles[li] : [];
  var cf = codeFiles[ci]; if (!cf) return renderLayerPage(li);

  var el = document.getElementById("mainContent");
  var img = (SITE_DATA.pageImages || [])[(li * 7 + ci) % (SITE_DATA.pageImages||[1]).length];
  el.innerHTML = '<div class="forFlow"><a href="#layer/' + li + '" class="back-link">返回层级</a><a href="#" class="back-link" onclick="location.hash=\'\';return false">返回首页</a><div class="pattern-center"><div class="pattern-attachment-img" style="background-image:url(' + img + ')"></div><header class="pattern-header"><h1 class="entry-title">' + cf.name + '</h1><p class="entry-census">' + ly.title + '</p></header></div><article class="post"><div class="postBody"><div class="file-block"><div class="file-block-title">📄 ' + cf.name + '</div><div class="cnblogs_code" id="codeblock"><div class="esa-clipboard-button">Copy</div><div style="text-align:center;padding:30px;color:#999">⏳ 加载中...</div></div></div></div></article><div id="footer"><div>🌸 oyz blog</div></div></div>';
  document.getElementById("main").className = "nomargin";
  document.getElementById("mainHeader").style.display = "none";
  document.title = "🌸 " + cf.name + " - oyz blog";

  // Fetch source and annotate
  fetch("src-files/" + slug + cf.ext)
    .then(function (r) { if (!r.ok) throw Error("404"); return r.text(); })
    .then(function (text) {
      var lines = text.split("\n");
      var tbl = document.createElement("table");
      tbl.className = "code-table";
      lines.forEach(function (line, ln) {
        var s = line.replace(/\r$/, "");
        var esc = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") || " ";
        var anno = annotateLine(s.trim());
        var tr = document.createElement("tr");
        tr.innerHTML = '<td class="ln">' + (ln + 1) + '</td><td class="code"><pre>' + esc + '</pre></td><td class="anno-cell"><span class="anno">' + (anno || "") + '</span></td>';
        tbl.appendChild(tr);
      });
      var block = document.getElementById("codeblock");
      if (block) { block.innerHTML = '<div class="esa-clipboard-button">Copy</div>'; block.appendChild(tbl); }
      initCopyBtns();
    })
    .catch(function () {
      var block = document.getElementById("codeblock");
      if (block) block.innerHTML = '<div style="text-align:center;padding:40px;color:#999"><i class="fa fa-exclamation-triangle"></i> 文件加载失败</div>';
    });
}

function renderTIColumn() {
  var layers = SITE_DATA.layers || [];
  var el = document.getElementById("mainContent");
  var cards = layers.map(function (ly, i) {
    var left = (i % 2 === 1) ? " post-list-thumb-left" : "";
    return '<article class="post-list-thumb' + left + '"><div class="post-thumb"><a href="#layer/' + i + '"><img class="lazyload" src="' + ly.thumb + '" alt="" onerror="this.remove();this.closest(\'.post-thumb\').classList.add(\'img-fallback\')"></a></div><div class="post-content-wrap"><div class="post-date"><i class="fa fa-calendar"></i> ' + ly.date + '</div><h2 class="post-title"><a href="#layer/' + i + '">' + ly.title + '</a></h2><div class="post-meta"><span><i class="fa fa-file-code-o"></i> ' + ly.fileCount + ' 文件</span><span><i class="fa fa-tag"></i> ' + ly.tag + '</span></div><div class="float-content"><p>' + ly.excerpt + '</p></div></div></article>';
  }).join("");
  el.innerHTML = '<div class="forFlow"><a href="#" class="back-link" onclick="location.hash=\'\';return false">返回首页</a><div class="pattern-center"><div class="pattern-attachment-img"></div><header class="pattern-header"><h1 class="entry-title">TI 2024-H 竞赛智能车</h1><p class="entry-census">MSPM0G3507 · 103 源文件 · 七层架构 · 逐行中文注释</p></header></div><section class="post">' + cards + '</section><div id="footer"><div>🌸 oyz blog</div></div></div>';
  document.getElementById("main").className = "nomargin";
  document.getElementById("mainHeader").style.display = "none";
  document.title = "🌸 TI 2024-H - oyz blog";
}

function renderCustomColumn(colId) {
  var cols = SITE_DATA.customColumns || []; var col = cols.find(function (c) { return c.id === colId; });
  if (!col) return renderHome();
  var el = document.getElementById("mainContent");
  var cards = col.articles.map(function (a) {
    var md = typeof marked !== "undefined" ? marked.parse(a.content) : a.content.replace(/\\n/g, "<br>");
    return '<article class="post-list-thumb" style="flex-direction:column"><div class="post-content-wrap" style="padding:30px"><h2 class="post-title" style="font-size:22px">' + a.title + '</h2><div class="postBody" style="margin-top:12px">' + md + '</div></div></article>';
  }).join("");
  var el2 = document.getElementById("mainContent");
  var editBtn = '<span style="float:right;cursor:pointer;color:#FE9600;font-size:13px" onclick="editColumnTitle(\'' + colId + '\')">✏️ 编辑标题</span>';
  el.innerHTML = '<div class="forFlow"><a href="#" class="back-link" onclick="location.hash=\'\';return false">返回首页</a><div class="pattern-center"><div class="pattern-attachment-img"></div><header class="pattern-header"><h1 class="entry-title">' + col.title + editBtn + '</h1><p class="entry-census">共 ' + col.articles.length + ' 篇文章</p></header></div><section class="post">' + cards + '</section><div id="footer"><div>🌸 oyz blog</div></div></div>';
  document.getElementById("main").className = "nomargin";
  document.getElementById("mainHeader").style.display = "none";
  document.title = "🌸 " + col.title + " - oyz blog";
}
function editColumnTitle(id) {
  var col = (SITE_DATA.customColumns || []).find(function (c) { return c.id === id; });
  if (!col) return; var t = prompt("输入栏目标题:", col.title);
  if (!t) return; col.title = t;
  renderNav(SITE_DATA.nav); renderMobileMenu(SITE_DATA.nav);
  renderCustomColumn(id);
}

function renderAbout() {
  var el = document.getElementById("mainContent");
  el.innerHTML = '<div class="forFlow"><a href="#" class="back-link" onclick="location.hash=\'\';return false">返回首页</a><div style="background:rgba(255,255,255,.86);border-radius:12px;padding:36px;line-height:2"><h2 style="color:#314659;margin-bottom:16px">💡 关于 oyz blog</h2><p style="color:#61687C">基于 <strong style="color:#FE9600">TI MSPM0G3507</strong> 微控制器开发的统一智能车竞赛平台。</p><p style="color:#61687C">采用七层分层架构, 涵盖 2024 年全国大学生电子设计竞赛 H 题完整解决方案。</p><p style="color:#61687C;margin-top:16px">平台: MSPM0G3507 (ARM Cortex-M0+) · Sakura Theme</p></div><div id="footer"><div>🌸 oyz blog</div></div></div>';
  document.getElementById("main").className = "nomargin";
  document.getElementById("mainHeader").style.display = "none";
  document.title = "💡 关于 - oyz blog";
}

/* ── Annotation engine (runs in browser) ── */
function annotateLine(s) {
  if (!s || s.startsWith("//") || s.startsWith("/*") || s.startsWith("*")) return "";
  if (s.startsWith("#include")) { var h = s.split('"')[1] || s.split("<")[1].split(">")[0]; return "引入 " + h; }
  if (s.startsWith("#define ") && s.indexOf("_H__") === -1) { var p = s.split(/\\s+/); return p.length >= 3 ? "宏: " + p[1] : ""; }
  if (s.startsWith("#ifndef")) return "头文件保护";
  if (s.startsWith("#if")) return "条件编译";
  if (s.startsWith("#elif")) return "条件分支";
  if (s === "#else" || s === "#endif") return "";
  if (s.startsWith("typedef struct")) return "结构体定义";
  if (s.startsWith("typedef enum")) return "枚举定义";
  if (s.startsWith("typedef union")) return "联合体定义";
  if (s.startsWith("typedef ")) return "类型: " + s.substring(8).replace(/;.*$/, "").substring(0, 40);
  if (s === "};") return "";
  if (/^[A-Z][A-Z0-9_]+(\\s*=\\s*\\d+)?\\s*,?\\s*$/.test(s)) return "枚举: " + s.replace(/,.*/, "").split("=")[0].trim();
  if (s.startsWith("static inline ") && s.indexOf("(") > -1) return "内联: " + s.substring(14).split("(")[0].split(/\\s+/).pop().replace(/^\\*/, "") + "()";
  if (s.startsWith("static ") && s.indexOf("(") > -1) return "静态: " + s.substring(7).split("(")[0].split(/\\s+/).pop().replace(/^\\*/, "") + "()";
  if (s.startsWith("extern ")) return "外部声明";
  if (/^(void|uint|int\\s|float|bool)\\s/.test(s) && s.indexOf("(") > -1) return "函数: " + s.split("(")[0].split(/\\s+/).pop().replace(/^\\*/, "") + "()";
  if (s.startsWith("if (")) return "条件判断";
  if (s.startsWith("for (")) return "for循环";
  if (s.startsWith("while (")) return "while";
  if (s.startsWith("switch (")) return "switch";
  if (s.startsWith("case ")) return "case " + s.split(/\\s+/)[1].replace(":", "");
  if (s === "break;") return "跳出";
  if (s === "continue;") return "继续";
  if (s.startsWith("return ")) return "返回 " + s.substring(7).replace(/;.*$/, "").substring(0, 40);
  if (s.endsWith(";") && s.indexOf("=") > -1) return "赋值";
  return "";
}

/* ── Render ── */
function renderNav(nav) { var n = document.getElementById("navList"); if (!n) return; var h = ""; nav.forEach(function (item, i) { h += '<li><a href="' + item.url + '"><i class="fa ' + item.icon + '"></i> ' + item.title + '</a><i></i></li>'; }); if (SITE_DATA.customColumns && SITE_DATA.customColumns.length > 0) { SITE_DATA.customColumns.forEach(function (col) { h += '<li><a href="#custom/' + col.id + '"><i class="fa fa-pencil"></i> ' + col.title + '</a><i></i></li>'; }); } h += '<li><a href="#"><i class="fa fa-leaf"></i> 关于</a><i></i><ul class="sub-menu"><li><a href="https://github.com/avavyes3-cmd/oyz-blog"><i class="fa fa-github"></i> GitHub</a></li><li><a href="https://oyz-blog.vercel.app"><i class="fa fa-globe"></i> Vercel</a></li></ul></li>'; n.innerHTML = h; }
function renderMobileMenu(nav) { var p = document.querySelector(".mobile-menu-panel"); if (!p) return; var h = ""; nav.forEach(function (item) { h += '<a href="' + item.url + '">' + item.title + '</a>'; }); if (SITE_DATA.customColumns) { SITE_DATA.customColumns.forEach(function (col) { h += '<a href="#custom/' + col.id + '"><i class="fa fa-pencil"></i> ' + col.title + '</a>'; }); } h += '<a href="#about">💡 关于</a>'; h += '<a href="https://github.com/avavyes3-cmd/oyz-blog"><i class="fa fa-github"></i> GitHub</a>'; p.innerHTML = h; }

/* ── Init ── */
function initScrollProgress(){var b=document.getElementById("scrollInfo");if(!b)return;window.addEventListener("scroll",function(){var h=document.documentElement.scrollHeight-window.innerHeight;b.style.width=h>0?(window.scrollY/h*100)+"%":"0%"})}
function initHeaderScroll(){var h=document.getElementById("header");if(!h)return;var u=function(){h.classList.toggle("is-scrolled",window.scrollY>50)};u();window.addEventListener("scroll",u,{passive:true})}
function initMobileMenu(){var btn=document.querySelector(".esa-mobile-menu"),mask=document.querySelector(".mobile-menu-mask"),panel=document.querySelector(".mobile-menu-panel");if(!btn||!mask||!panel)return;var o=function(){btn.classList.add("is-open");mask.classList.add("is-open");panel.classList.add("is-open");document.body.classList.add("menu-open")},c=function(){btn.classList.remove("is-open");mask.classList.remove("is-open");panel.classList.remove("is-open");document.body.classList.remove("menu-open")};btn.addEventListener("click",function(){panel.classList.contains("is-open")?c():o()});mask.addEventListener("click",c);panel.querySelectorAll("a").forEach(function(a){a.addEventListener("click",c)});document.addEventListener("keydown",function(e){if(e.key==="Escape")c()})}
function initBackToTop(){var t=document.querySelector(".cd-top");if(!t)return;window.addEventListener("scroll",function(){t.classList.toggle("show",window.scrollY>300)});t.addEventListener("click",function(e){e.preventDefault();window.scrollTo({top:0,behavior:"smooth"})})}
function initScrollDown(){var s=document.querySelector(".scroll-down");if(!s)return;s.addEventListener("click",function(){var m=document.getElementById("main");if(m)window.scrollTo({top:m.offsetTop-20,behavior:"smooth"})})}
function initCopyBtns(){document.querySelectorAll(".esa-clipboard-button").forEach(function(b){b.addEventListener("click",function(){var p=this.parentElement.querySelector("pre")||this.parentElement.querySelector(".code-table");var t=p?p.textContent:"";if(!navigator.clipboard)return;navigator.clipboard.writeText(t).then(function(){b.textContent="Copied!";setTimeout(function(){b.textContent="Copy"},2000)})})})}
function initHoverEffects(){var s=document.querySelector(".site-branding");if(!s)return;s.addEventListener("mouseenter",function(){var sk=this.querySelector(".sakuraso"),cf=this.querySelector(".chinese-font");if(sk){sk.style.background="#FE9600";sk.style.color="#fff"}if(cf)cf.style.display="block"});s.addEventListener("mouseleave",function(){var sk=this.querySelector(".sakuraso"),cf=this.querySelector(".chinese-font");if(sk){sk.style.background="rgba(255,255,255,.5)";sk.style.color="#464646"}if(cf)cf.style.display="none"})}
function initPetals(){var p=["🌸","💮","🌺","🩷","✿","❀","❁"];var c=document.createElement("div");c.className="petal-container";document.body.appendChild(c);function d(){var e=document.createElement("span");e.className="petal";e.textContent=p[Math.floor(Math.random()*p.length)];e.style.left=Math.random()*96+"%";e.style.fontSize=(16+Math.random()*22)+"px";e.style.animationDuration=(8+Math.random()*12)+"s";c.appendChild(e);setTimeout(function(){e.remove()},22000)}d();d();d();setInterval(d,2200)}

/* ── Prism.js highlight ── */
function highlightCode(el) {
  if (typeof Prism === "undefined") return;
  el.querySelectorAll("pre").forEach(function (pre) { Prism.highlightElement(pre); });
}

/* ── lunr.js search ── */
var searchIdx = null;
function buildSearchIndex() {
  if (typeof lunr === "undefined" || typeof SEARCH_DATA === "undefined") return;
  searchIdx = lunr(function () {
    this.ref("id"); this.field("title", { boost: 10 }); this.field("type"); this.field("content");
    SEARCH_DATA.forEach(function (doc) { this.add(doc); }, this);
  });
}
function doSearch(query) {
  if (!searchIdx) return [];
  if (!query || query.length < 2) return [];
  try {
    return searchIdx.search(query).slice(0, 15).map(function (r) {
      var doc = SEARCH_DATA.find(function (d) { return d.id === r.ref; });
      return doc || { id: r.ref, title: r.ref, type: "?" };
    });
  } catch (e) { return []; }
}

/* ── Search UI ── */
function initSearchUI() {
  var nav = document.getElementById("navigator");
  if (!nav) return;
  var wrap = document.createElement("span");
  wrap.style.cssText = "position:relative;margin-left:8px";
  var input = document.createElement("input");
  input.type = "text"; input.placeholder = "搜索..."; input.id = "searchInput";
  input.style.cssText = "padding:6px 12px;border:1px solid #ddd;border-radius:16px;font-size:13px;width:140px;outline:none;transition:border .2s;font-family:inherit";
  input.addEventListener("focus", function () { input.style.borderColor = "#FE9600"; input.style.width = "200px"; });
  input.addEventListener("blur", function () { input.style.borderColor = "#ddd"; input.style.width = "140px"; });
  var dd = document.createElement("div");
  dd.id = "searchResults";
  dd.style.cssText = "display:none;position:absolute;top:38px;left:0;background:#fff;border-radius:8px;box-shadow:0 6px 28px rgba(0,0,0,.14);min-width:300px;max-height:400px;overflow-y:auto;z-index:9999;padding:6px 0";
  input.addEventListener("input", function () {
    var results = doSearch(input.value);
    if (results.length === 0) { dd.style.display = "none"; return; }
    dd.style.display = "block";
    dd.innerHTML = results.map(function (r) {
      var href = r.id.startsWith("layer-") ? "#layer/" + r.id.split("-")[1] : "#code/" + r.id.split("-")[1] + "/" + r.id.split("-")[2];
      return '<a href="' + href + '" style="display:block;padding:8px 16px;color:#61687C;font-size:13px;border-bottom:1px solid #f5f5f5"><span style="color:#999;font-size:11px">[' + r.type + ']</span> ' + r.title + '</a>';
    }).join("");
  });
  document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) dd.style.display = "none"; });
  wrap.appendChild(input); wrap.appendChild(dd); nav.appendChild(wrap);
}