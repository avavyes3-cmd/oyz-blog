var APP = { heroIdx: 0, typingState: null };

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
  syncPageMode(h);
  var m = h.match(/^#layer\/(\d+)$/);
  if (m) return renderLayerPage(parseInt(m[1]));
  var cm = h.match(/^#code\/(\d+)\/(\d+)/);
  if (cm) return renderCodePage(parseInt(cm[1]), parseInt(cm[2]));
  if (h === "#ti") return renderTIColumn();
  if (h === "#upload") return renderUpload();
  if (h === "#about") return renderAbout();
  if (h === "#deepseek") return renderDeepSeek();
  if (h === "#music") return renderMusic();
  var cust = h.match(/^#custom\/(.+)$/);
  if (cust) return renderCustomColumn(cust[1]);
  renderHome();
}

function syncPageMode(hash) {
  var isHome = !hash || hash === "#";
  document.body.classList.toggle("inner-page", !isHome);
  document.body.classList.toggle("home", isHome);
  if (window.__oyzLive2DRelayout) window.__oyzLive2DRelayout();
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
  var notice = '<div class="notice"><i class="fa fa-volume-up"></i> 海上月是天上月，眼前人是心上人。这里是 TI 竞赛（暂时）代码注释站。</div>';
  // Add custom column cards
  var allCols=mergedCols();
  if (allCols.length > 0) {
    allCols.forEach(function (col) {
      var thumb = (SITE_DATA.thumbImages || [])[0];
      cards += '<article class="post-list-thumb"><div class="post-thumb" style="background:linear-gradient(135deg,#f0e6ff,#e6f0ff)"><a href="#custom/' + col.id + '"></a></div><div class="post-content-wrap"><div class="post-date"><i class="fa fa-pencil"></i> 自定义栏目</div><h2 class="post-title"><a href="#custom/' + col.id + '">📝 ' + col.title + '</a></h2><div class="post-meta"><span><i class="fa fa-file-text-o"></i> ' + col.articles.length + ' 篇文章</span></div><div class="float-content"><p>点击查看 ' + col.title + ' 下的所有 Markdown 文章。</p></div></div></article>';
    });
  }
  el.innerHTML = '<div class="forFlow">' + notice + '<section class="post">' + cards + '</section><div id="footer"><div>🌸 oyz blog · Sakura Theme</div></div></div>';
  document.getElementById("main").className = "";
  document.getElementById("mainHeader").style.display = "";
  // hero — random image each time
  if (SITE_DATA.heroImages && SITE_DATA.heroImages.length) {
    APP.heroIdx = Math.floor(Math.random() * SITE_DATA.heroImages.length);
    var hero = document.querySelector(".main-header-bg");
    if (hero) hero.style.backgroundImage = "url(" + SITE_DATA.heroImages[APP.heroIdx] + ")";
    // BG switcher prev
    var pre = document.getElementById("bg-pre");
    if (pre) pre.onclick = function () { APP.heroIdx = (APP.heroIdx - 1 + SITE_DATA.heroImages.length) % SITE_DATA.heroImages.length; hero.style.backgroundImage = "url(" + SITE_DATA.heroImages[APP.heroIdx] + ")"; };
    // BG switcher next
    var nxt = document.getElementById("bg-next");
    if (nxt) nxt.onclick = function () { APP.heroIdx = (APP.heroIdx + 1) % SITE_DATA.heroImages.length; hero.style.backgroundImage = "url(" + SITE_DATA.heroImages[APP.heroIdx] + ")"; };
  }
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
  var q = (location.hash.split("?q=")[1] || "").split("&")[0];
  q = decodeURIComponent(q);

  var el = document.getElementById("mainContent");
  var img = (SITE_DATA.pageImages || [])[(li * 7 + ci) % (SITE_DATA.pageImages||[1]).length];
  el.innerHTML = '<div class="forFlow"><a href="#layer/' + li + '" class="back-link">返回层级</a><a href="#" class="back-link" onclick="location.hash=\'\';return false">返回首页</a>' + (q ? '<span style="float:right;color:#FE9600;font-size:13px">🔍 "' + q + '" 共 <span id="hlCount">0</span> 处匹配</span>' : '') + '<div class="pattern-center"><div class="pattern-attachment-img" style="background-image:url(' + img + ')"></div><header class="pattern-header"><h1 class="entry-title">' + cf.name + '</h1><p class="entry-census">' + ly.title + '</p></header></div><article class="post"><div class="postBody"><section id="typingPracticeMount"></section><div class="file-block"><div class="file-block-title">📄 ' + cf.name + '</div><div class="cnblogs_code" id="codeblock"><div class="esa-clipboard-button">Copy</div><div style="text-align:center;padding:30px;color:#999">⏳ 加载中...</div></div></div></div></article><div id="footer"><div>🌸 oyz blog</div></div></div>';
  document.getElementById("main").className = "nomargin";
  document.getElementById("mainHeader").style.display = "none";
  document.title = "🌸 " + cf.name + " - oyz blog";

  fetch("src-files/" + cf.slug + cf.ext)
    .then(function (r) { if (!r.ok) throw Error("404"); return r.text(); })
    .then(function (text) {
      var lines = text.split("\n"); var tbl = document.createElement("table");
      tbl.className = "code-table"; var firstMatch = null; var matchCount = 0;
      lines.forEach(function (line, ln) {
        var s = line.replace(/\r$/, "");
        var esc = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") || " ";
        if (q && s.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          matchCount++; esc = esc.replace(new RegExp("("+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+")","gi"),'<mark class="search-hl">$1</mark>');
        }
        var anno = annotateLine(s.trim());
        var tr = document.createElement("tr");
        if (q && s.toLowerCase().indexOf(q.toLowerCase()) > -1) { tr.className = "match-line"; if (!firstMatch) firstMatch = tr; }
        tr.innerHTML = '<td class="ln">' + (ln + 1) + '</td><td class="code"><pre>' + esc + '</pre></td><td class="anno-cell"><span class="anno">' + (anno || "") + '</span></td>';
        tbl.appendChild(tr);
      });
      var block = document.getElementById("codeblock");
      if (block) { block.innerHTML = '<div class="esa-clipboard-button">Copy</div>'; block.appendChild(tbl); }
      if (firstMatch) setTimeout(function(){firstMatch.scrollIntoView({behavior:"smooth",block:"center"})},200);
      var cnt = document.getElementById("hlCount"); if (cnt) cnt.textContent = matchCount;
      initCopyBtns();
      renderTypingPractice(li, cf, lines);
    })
    .catch(function () {
      var block = document.getElementById("codeblock");
      if (block) block.innerHTML = '<div style="text-align:center;padding:40px;color:#999"><i class="fa fa-exclamation-triangle"></i> 文件加载失败</div>';
    });
}

function renderTypingPractice(layerIndex, cf, lines) {
  var mount = document.getElementById("typingPracticeMount");
  if (!mount) return;
  var practiceLines = [];
  lines.forEach(function (line, index) {
    var clean = line.replace(/\r$/, "");
    if (!clean.trim()) return;
    practiceLines.push({ no: index + 1, text: clean });
  });
  if (!practiceLines.length) return;
  APP.typingState = {
    fileName: cf.name,
    layerIndex: layerIndex,
    lines: practiceLines,
    index: 0,
    completed: 0
  };
  var label = layerIndex === 13 ? "2024H 手机打字跟练" : "手机打字跟练";
  mount.innerHTML =
    '<section class="typing-practice">' +
      '<div class="typing-practice-header">' +
        '<div>' +
          '<h3 class="typing-practice-title">⌨️ ' + label + '</h3>' +
          '<p class="typing-practice-subtitle">按行跟打当前文件，适合手机和平板。默认忽略行首行尾空格，完成后可继续下一行。</p>' +
        '</div>' +
        '<div class="typing-practice-stats">' +
          '<span class="typing-stat" id="typingProgress">1 / ' + practiceLines.length + '</span>' +
          '<span class="typing-stat" id="typingLineNo">第 ' + practiceLines[0].no + ' 行</span>' +
          '<span class="typing-stat" id="typingAccuracy">待开始</span>' +
        '</div>' +
      '</div>' +
      '<div style="margin:0 0 14px;padding:10px 12px;border-radius:10px;background:rgba(254,150,0,.08);color:#a96b17;font-size:12px;line-height:1.7">如果你现在看到这个卡片，说明新版“手机打字跟练”已经加载成功。</div>' +
      '<div class="typing-target">' +
        '<div class="typing-target-label">目标代码</div>' +
        '<pre id="typingTarget"></pre>' +
      '</div>' +
      '<textarea id="typingInput" class="typing-input" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="在这里跟打这一行代码..."></textarea>' +
      '<div id="typingFeedback" class="typing-feedback"></div>' +
      '<div class="typing-actions">' +
        '<button type="button" class="typing-btn typing-btn-primary" id="typingCheckBtn">检查这一行</button>' +
        '<button type="button" class="typing-btn typing-btn-secondary" id="typingNextBtn">下一行</button>' +
        '<button type="button" class="typing-btn typing-btn-secondary" id="typingResetBtn">清空重打</button>' +
      '</div>' +
      '<div class="typing-hint">小提示：手机上可以横屏练代码；注释、宏和函数声明也都支持逐行跟练。</div>' +
    '</section>';
  updateTypingPracticeView();
  bindTypingPractice();
}

function bindTypingPractice() {
  var input = document.getElementById("typingInput");
  var checkBtn = document.getElementById("typingCheckBtn");
  var nextBtn = document.getElementById("typingNextBtn");
  var resetBtn = document.getElementById("typingResetBtn");
  if (!input || !checkBtn || !nextBtn || !resetBtn) return;
  input.addEventListener("input", updateTypingLiveStats);
  input.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      checkTypingLine();
    }
  });
  checkBtn.addEventListener("click", checkTypingLine);
  nextBtn.addEventListener("click", nextTypingLine);
  resetBtn.addEventListener("click", function () {
    input.value = "";
    setTypingFeedback("已清空，可以重新输入这一行。", "");
    updateTypingLiveStats();
    input.focus();
  });
}

function updateTypingPracticeView() {
  var state = APP.typingState;
  if (!state || !state.lines.length) return;
  if (state.index >= state.lines.length) state.index = state.lines.length - 1;
  var current = state.lines[state.index];
  var target = document.getElementById("typingTarget");
  var progress = document.getElementById("typingProgress");
  var lineNo = document.getElementById("typingLineNo");
  var accuracy = document.getElementById("typingAccuracy");
  var input = document.getElementById("typingInput");
  if (target) target.textContent = current.text;
  if (progress) progress.textContent = (state.index + 1) + " / " + state.lines.length;
  if (lineNo) lineNo.textContent = "第 " + current.no + " 行";
  if (accuracy) accuracy.textContent = "待开始";
  if (input) {
    input.value = "";
    input.placeholder = "在这里跟打第 " + current.no + " 行代码...";
    setTimeout(function () { input.focus(); }, 0);
  }
  setTypingFeedback("", "");
}

function updateTypingLiveStats() {
  var state = APP.typingState;
  var input = document.getElementById("typingInput");
  var accuracy = document.getElementById("typingAccuracy");
  if (!state || !input || !accuracy) return;
  var current = state.lines[state.index];
  var typed = input.value;
  if (!typed) {
    accuracy.textContent = "待开始";
    return;
  }
  accuracy.textContent = "匹配 " + calcTypingAccuracy(typed, current.text) + "%";
}

function checkTypingLine() {
  var state = APP.typingState;
  var input = document.getElementById("typingInput");
  if (!state || !input) return;
  var current = state.lines[state.index];
  var typed = input.value;
  var normalizedTyped = normalizePracticeLine(typed);
  var normalizedTarget = normalizePracticeLine(current.text);
  if (!normalizedTyped) {
    setTypingFeedback("这一行还没开始输入。", "is-error");
    updateTypingLiveStats();
    return;
  }
  if (normalizedTyped === normalizedTarget) {
    state.completed = Math.max(state.completed, state.index + 1);
    setTypingFeedback("这一行通过，可以继续下一行。", "is-success");
  } else {
    setTypingFeedback("还差一点点，继续对照上面的目标代码。当前匹配 " + calcTypingAccuracy(typed, current.text) + "%。", "is-error");
  }
  updateTypingLiveStats();
}

function nextTypingLine() {
  var state = APP.typingState;
  if (!state) return;
  if (state.index >= state.lines.length - 1) {
    setTypingFeedback("已经练到最后一行了，当前文件跟练完成。", "is-success");
    return;
  }
  state.index += 1;
  updateTypingPracticeView();
}

function setTypingFeedback(message, className) {
  var feedback = document.getElementById("typingFeedback");
  if (!feedback) return;
  feedback.className = "typing-feedback" + (className ? " " + className : "");
  feedback.textContent = message || "";
}

function normalizePracticeLine(text) {
  return String(text || "").replace(/\r/g, "").trim();
}

function calcTypingAccuracy(typed, target) {
  var a = normalizePracticeLine(typed);
  var b = normalizePracticeLine(target);
  if (!a && !b) return 100;
  var maxLen = Math.max(a.length, b.length) || 1;
  var same = 0;
  for (var i = 0; i < Math.min(a.length, b.length); i++) {
    if (a.charAt(i) === b.charAt(i)) same++;
  }
  return Math.max(0, Math.round(same / maxLen * 100));
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

/* ── localStorage helpers ── */
function getLocalCols(){try{return JSON.parse(localStorage.getItem("oyz_columns")||"[]")}catch(e){return[]}}
function saveLocalCols(cols){localStorage.setItem("oyz_columns",JSON.stringify(cols))}
function mergedCols(){var s=(SITE_DATA.customColumns||[]).map(function(c){return JSON.parse(JSON.stringify(c))});var l=getLocalCols();l.forEach(function(lc){var ex=s.find(function(sc){return sc.id===lc.id});if(ex){lc.articles.forEach(function(a){ex.articles.push(a)})}else{s.push(lc)}});return s}

function renderUpload(){
  var el=document.getElementById("mainContent");
  var cols=mergedCols();
  var opts=cols.map(function(c){return'<option value="'+c.id+'">'+c.title+'</option>'}).join("");
  el.innerHTML='<div class="forFlow"><a href="#" class="back-link" onclick="location.hash=\'\';return false">返回首页</a><div class="pattern-center"><div class="pattern-attachment-img"></div><header class="pattern-header"><h1 class="entry-title">📝 上传 Markdown 文章</h1></header></div><div style="background:rgba(255,255,255,.86);border-radius:12px;padding:24px;max-width:700px;margin:0 auto"><div style="margin-bottom:12px"><label style="font-size:14px;color:#61687C">栏目标题（可新建或选择已有）:</label><input id="colTitle" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;margin-top:4px;font-size:14px" placeholder="输入栏目标题"></div><div style="margin-bottom:12px"><label style="font-size:14px;color:#61687C">文章标题:</label><input id="artTitle" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;margin-top:4px;font-size:14px" placeholder="文章标题"></div><div style="margin-bottom:12px"><label style="font-size:14px;color:#61687C">Markdown 内容:</label><textarea id="artContent" style="width:100%;height:300px;padding:8px;border:1px solid #ddd;border-radius:6px;margin-top:4px;font-size:13px;font-family:monospace" placeholder="# 标题\n\n正文..."></textarea></div><button onclick="doUpload()" style="background:#FE9600;color:#fff;border:none;padding:10px 24px;border-radius:6px;font-size:15px;cursor:pointer">上传文章</button><span id="uploadMsg" style="margin-left:12px;color:#63a35c;font-size:14px"></span></div><div id="footer"><div>🌸 oyz blog</div></div></div>';
  document.getElementById("main").className="nomargin";
  document.getElementById("mainHeader").style.display="none";
  document.title="📝 上传文章 - oyz blog";
}
function doUpload(){
  var ct=document.getElementById("colTitle").value.trim();
  var at=document.getElementById("artTitle").value.trim();
  var ac=document.getElementById("artContent").value.trim();
  if(!ct||!at||!ac){document.getElementById("uploadMsg").textContent="请填写所有字段";return}
  var cols=getLocalCols();
  var col=cols.find(function(c){return c.id===ct});
  if(!col){col={id:ct,title:ct,articles:[]};cols.push(col)}
  col.articles.push({title:at,slug:at.replace(/\s+/g,"-"),content:ac});
  saveLocalCols(cols);
  document.getElementById("uploadMsg").textContent="✅ 上传成功！刷新页面后在导航栏查看";
  setTimeout(function(){location.hash="#custom/"+encodeURIComponent(ct)},1500);
}

function renderCustomColumn(colId) {
  var cols = mergedCols(); var col = cols.find(function (c) { return c.id === colId; });
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
  el.innerHTML = '<div class="forFlow"><a href="#" class="back-link" onclick="location.hash=\'\';return false">返回首页</a><div style="background:rgba(255,255,255,.86);border-radius:12px;padding:36px;line-height:2"><h2 style="color:#314659;margin-bottom:16px">💡 关于 oyz blog</h2><p style="color:#61687C">基于 <strong style="color:#FE9600">TI MSPM0G3507</strong> 微控制器开发的统一智能车竞赛平台。</p><p style="color:#61687C">采用七层分层架构, 涵盖 2024 年全国大学生电子设计竞赛 H 题完整解决方案。</p><p style="color:#61687C;margin-top:16px">平台: MSPM0G3507 (ARM Cortex-M0+) · Sakura Theme</p><p style="color:#999;font-size:12px;margin-top:12px">Live2D models from <a href="https://github.com/Eikanya/Live2d-model" target="_blank">Eikanya/Live2d-model</a></p><p style="margin-top:12px"><a href="#deepseek" style="color:#FE9600">🔑 DeepSeek Usage</a> · <a href="#music" style="color:#FE9600">🎵 自定义音乐</a></p></div><div id="footer"><div>🌸 oyz blog</div></div></div>';document.getElementById("main").className="nomargin";document.getElementById("mainHeader").style.display="none";document.title="💡 关于 - oyz blog";}

function renderDeepSeek(){
  var el=document.getElementById("mainContent");
  var savedKey=localStorage.getItem("ds_key")||"";
  var savedBalance=localStorage.getItem("ds_balance")||"";
  el.innerHTML='<div class="forFlow"><a href="#" class="back-link" onclick="location.hash=\'\';return false">返回首页</a><div style="background:rgba(255,255,255,.86);border-radius:12px;padding:36px;max-width:700px;margin:0 auto;line-height:2"><h2 style="color:#314659;margin-bottom:16px">🔑 DeepSeek API Usage</h2><div style="margin-bottom:12px"><label style="font-size:14px;color:#61687C">API Key:</label><input id="dsKey" type="password" value="'+savedKey+'" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;margin-top:4px;font-size:13px;font-family:monospace" placeholder="sk-..."></div><button onclick="fetchDSUsage()" style="background:#FE9600;color:#fff;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;font-size:14px">查询余额</button><div id="dsResult" style="margin-top:16px;padding:16px;border-radius:8px;background:#f8f9fa;font-size:14px;color:#61687C">'+(savedBalance||'输入 API Key 后点击查询')+'</div><p style="color:#999;font-size:11px;margin-top:12px">Key 仅保存在本地浏览器，不会上传到服务器</p></div><div id="footer"><div>🌸 oyz blog</div></div></div>';
  document.getElementById("main").className="nomargin";
  document.getElementById("mainHeader").style.display="none";
  document.title="🔑 DeepSeek - oyz blog";
}

function fetchDSUsage(){
  var key=document.getElementById("dsKey").value.trim();
  if(!key)return;
  localStorage.setItem("ds_key",key);
  document.getElementById("dsResult").innerHTML='⏳ 查询中...';
  fetch("https://api.deepseek.com/user/balance",{headers:{"Authorization":"Bearer "+key}})
    .then(function(r){return r.json()})
    .then(function(d){
      var html='';
      if(d.is_available){
        var bal=d.balance_infos||[];
        bal.forEach(function(b){
          html+='<p><strong>'+b.currency+'</strong>: '+Number(b.total_balance).toFixed(2)+' (已用 '+Number(b.topped_up_balance-b.total_balance).toFixed(2)+')</p>';
        });
      }else{
        html='<pre style="white-space:pre-wrap">'+JSON.stringify(d,null,2)+'</pre>';
      }
      document.getElementById("dsResult").innerHTML=html||'暂无余额数据';
      localStorage.setItem("ds_balance",html||'暂无余额数据');
    })
    .catch(function(e){
      document.getElementById("dsResult").innerHTML='❌ 查询失败: '+e.message;
    });
}

function renderMusic(){
  var el=document.getElementById("mainContent");
  var saved=JSON.parse(localStorage.getItem("oyz_music")||"[]");
  var list=saved.map(function(s,i){return'<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f0f0f0"><span style="flex:1;font-size:14px;color:#61687C">'+s.name+' - '+s.artist+'</span><button onclick="delMusic('+i+')" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:12px">删除</button></div>'}).join("");
  el.innerHTML='<div class="forFlow"><a href="#" class="back-link" onclick="location.hash=\'\';return false">返回首页</a><div style="background:rgba(255,255,255,.86);border-radius:12px;padding:24px;max-width:700px;margin:0 auto"><h2 style="color:#314659;margin-bottom:16px">🎵 自定义音乐</h2><div style="margin-bottom:10px"><input id="mName" placeholder="歌曲名" style="padding:8px;border:1px solid #ddd;border-radius:6px;width:45%;margin-right:2%"><input id="mArtist" placeholder="艺术家" style="padding:8px;border:1px solid #ddd;border-radius:6px;width:45%"></div><div style="margin-bottom:10px"><input id="mUrl" placeholder="MP3直链URL 或 本地文件路径(assets/audio/xxx.mp3)" style="padding:8px;border:1px solid #ddd;border-radius:6px;width:100%"></div><button onclick="addMusic()" style="background:#FE9600;color:#fff;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;font-size:14px">添加</button><span id="mMsg" style="margin-left:10px;color:#63a35c;font-size:13px"></span><div style="margin-top:20px"><h3 style="font-size:14px;color:#61687C;margin-bottom:8px">已添加 (共'+saved.length+'首):</h3>'+list+'</div><p style="color:#999;font-size:11px;margin-top:16px">刷新页面后新歌出现在左下角播放器</p></div><div id="footer"><div>🌸 oyz blog</div></div></div>';
  document.getElementById("main").className="nomargin";
  document.getElementById("mainHeader").style.display="none";
  document.title="🎵 音乐 - oyz blog";
}
function addMusic(){
  var n=document.getElementById("mName").value.trim();
  var a=document.getElementById("mArtist").value.trim();
  var u=document.getElementById("mUrl").value.trim();
  if(!n||!u){document.getElementById("mMsg").textContent="请填写歌曲名和URL";return}
  var saved=JSON.parse(localStorage.getItem("oyz_music")||"[]");
  saved.push({name:n,artist:a||"Unknown",url:u,cover:"https://picsum.photos/seed/"+Date.now()+"/100/100"});
  localStorage.setItem("oyz_music",JSON.stringify(saved));
  renderMusic();
}
function delMusic(i){
  if(!confirm("删除这首歌？"))return;
  var saved=JSON.parse(localStorage.getItem("oyz_music")||"[]");
  saved.splice(i,1);
  localStorage.setItem("oyz_music",JSON.stringify(saved));
  renderMusic();
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
function renderNav(nav) { var n = document.getElementById("navList"); if (!n) return; var h = ""; nav.forEach(function (item) { h += '<li><a href="' + item.url + '"><i class="fa ' + item.icon + '"></i> ' + item.title + '</a><i></i></li>'; }); var cols=mergedCols();cols.forEach(function(col){h+='<li><a href="#custom/'+col.id+'"><i class="fa fa-file-text-o"></i> '+col.title+'</a><i></i></li>'}); h += '<li><a href="#"><i class="fa fa-link"></i> 链接</a><i></i><ul class="sub-menu"><li><a href="https://github.com/avavyes3-cmd/oyz-blog"><i class="fa fa-github"></i> GitHub</a></li><li><a href="https://oyz-blog.vercel.app"><i class="fa fa-globe"></i> Vercel</a></li></ul></li>'; n.innerHTML = h; }
function renderMobileMenu(nav) { var p = document.querySelector(".mobile-menu-panel"); if (!p) return; var h = ""; nav.forEach(function (item) { h += '<a href="' + item.url + '"><i class="fa '+item.icon+'"></i> ' + item.title + '</a>'; }); var cols=mergedCols();cols.forEach(function(col){h+='<a href="#custom/'+col.id+'"><i class="fa fa-file-text-o"></i> '+col.title+'</a>'}); h += '<a href="#upload"><i class="fa fa-pencil"></i> 📝 上传文章</a>'; h += '<a href="#music"><i class="fa fa-music"></i> 🎵 音乐</a>'; h += '<a href="#about"><i class="fa fa-leaf"></i> 关于</a>';p.innerHTML = h; }

/* ── Init ── */
function initScrollProgress(){var b=document.getElementById("scrollInfo");if(!b)return;window.addEventListener("scroll",function(){var h=document.documentElement.scrollHeight-window.innerHeight;b.style.width=h>0?(window.scrollY/h*100)+"%":"0%"})}
function initHeaderScroll(){var h=document.getElementById("header");if(!h)return;var u=function(){h.classList.toggle("is-scrolled",window.scrollY>50)};u();window.addEventListener("scroll",u,{passive:true})}
function initMobileMenu(){var btn=document.querySelector(".esa-mobile-menu"),mask=document.querySelector(".mobile-menu-mask"),panel=document.querySelector(".mobile-menu-panel");if(!btn||!mask||!panel)return;var o=function(){btn.classList.add("is-open");mask.classList.add("is-open");panel.classList.add("is-open");document.body.classList.add("menu-open")},c=function(){btn.classList.remove("is-open");mask.classList.remove("is-open");panel.classList.remove("is-open");document.body.classList.remove("menu-open")};btn.addEventListener("click",function(){panel.classList.contains("is-open")?c():o()});mask.addEventListener("click",c);panel.addEventListener("click",function(e){if(e.target&&e.target.closest("a"))c()});document.addEventListener("keydown",function(e){if(e.key==="Escape")c()})}
function initBackToTop(){var t=document.querySelector(".cd-top");if(!t)return;window.addEventListener("scroll",function(){t.classList.toggle("show",window.scrollY>300)});t.addEventListener("click",function(e){e.preventDefault();window.scrollTo({top:0,behavior:"smooth"})})}
function initScrollDown(){var s=document.querySelector(".scroll-down");if(!s)return;s.addEventListener("click",function(){window.scrollBy({top:window.innerHeight,behavior:"smooth"})})}
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
  if (typeof lunr === "undefined") { console.warn("lunr not loaded"); return; }
  if (typeof SEARCH_DATA === "undefined" || !SEARCH_DATA.length) { console.warn("SEARCH_DATA empty"); return; }
  try {
    searchIdx = lunr(function () {
      this.ref("id"); this.field("title", { boost: 10 }); this.field("type"); this.field("content");
      SEARCH_DATA.forEach(function (doc) { this.add(doc); }, this);
    });
  } catch(e) { console.warn("lunr index error:", e.message); }
}
function doSearch(query) {
  if (!query || query.length < 2) return [];
  // Try lunr first, fallback to simple string match
  var results = [];
  if (searchIdx) {
    try {
      results = searchIdx.search(query).slice(0, 15).map(function (r) {
        var doc = SEARCH_DATA.find(function (d) { return d.id === r.ref; });
        return doc || { id: r.ref, title: r.ref, type: "?" };
      });
    } catch (e) { results = []; }
  }
  // Fallback: simple string match
  if (results.length === 0 && SEARCH_DATA) {
    var q = query.toLowerCase();
    SEARCH_DATA.forEach(function (d) {
      if (results.length >= 15) return;
      if (d.title.toLowerCase().indexOf(q) > -1 || d.content.toLowerCase().indexOf(q) > -1) {
        if (!results.find(function (r) { return r.id === d.id; })) results.push(d);
      }
    });
  }
  return results;
}

/* ── Search UI ── */
function initSearchUI() {
  var hdr = document.getElementById("header");
  if (!hdr) return;
  var inner = hdr.querySelector(".site-header-inner");
  if (!inner) return;
  if (document.getElementById("searchInput")) return;
  var wrap = document.createElement("div");
  wrap.className = "site-search";
  var input = document.createElement("input");
  input.type = "text"; input.placeholder = "🔍 搜索..."; input.id = "searchInput";
  input.className = "site-search-input";
  input.addEventListener("focus", function () {
    input.style.borderColor = "#FE9600";
    input.style.background = "#fff";
    if (window.innerWidth > 768) input.style.width = "200px";
  });
  input.addEventListener("blur", function () {
    input.style.borderColor = "#ddd";
    input.style.background = "#f8f9fa";
    if (window.innerWidth > 768) input.style.width = "130px";
  });
  var dd = document.createElement("div");
  dd.id = "searchResults";
  dd.className = "site-search-results";
  input.addEventListener("input", function () {
    var results = doSearch(input.value);
    if (results.length === 0) { dd.style.display = "none"; return; }
    dd.style.display = "block";
    dd.innerHTML = results.map(function (r) {
      var parts = r.id.split("-");
      var href = parts[0] === "layer" ? "#layer/" + parts[1] : "#code/" + parts[1] + "/" + parts[2] + "?q=" + encodeURIComponent(input.value);
      return '<a href="' + href + '"><span style="color:#999;font-size:11px">[' + r.type + ']</span> ' + r.title + '</a>';
    }).join("");
  });
  document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) dd.style.display = "none"; });
  wrap.appendChild(input); wrap.appendChild(dd);
  inner.appendChild(wrap);
}
