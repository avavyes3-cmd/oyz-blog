document.addEventListener("DOMContentLoaded",function(){
  initScrollProgress();initMobileMenu();initBackToTop();initScrollDown();
  initCopyButtons();initCatalog();initHoverEffects();
});
function initScrollProgress(){
  var b=document.getElementById("scrollInfo");if(!b)return;
  window.addEventListener("scroll",function(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    b.style.width=h>0?(window.scrollY/h*100)+"%":"0%";
  });
}
function initMobileMenu(){
  var btn=document.querySelector(".esa-mobile-menu");
  var nav=document.getElementById("mo-nav");if(!btn||!nav)return;
  btn.addEventListener("click",function(){
    var o=nav.classList.contains("open");
    nav.classList.toggle("open",!o);btn.classList.toggle("open",!o);
  });
  nav.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){
    nav.classList.remove("open");btn.classList.remove("open");
  });});
}
function initBackToTop(){
  var t=document.querySelector(".cd-top");if(!t)return;
  window.addEventListener("scroll",function(){t.classList.toggle("show",window.scrollY>300);});
  t.addEventListener("click",function(e){e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});});
}
function initScrollDown(){
  var s=document.querySelector(".scroll-down");if(!s)return;
  s.addEventListener("click",function(){var m=document.getElementById("main");
    if(m)window.scrollTo({top:m.offsetTop-20,behavior:"smooth"});});
}
function initCopyButtons(){
  document.querySelectorAll(".esa-clipboard-button").forEach(function(b){
    b.addEventListener("click",function(){
      var pre=this.parentElement.querySelector("pre")||this.parentElement.querySelector(".code-table");
      var t=pre?pre.textContent:"";if(!navigator.clipboard)return;
      navigator.clipboard.writeText(t).then(function(){b.textContent="Copied!";
        setTimeout(function(){b.textContent="Copy";},2000);});
    });
  });
}
function initCatalog(){
  var c=document.querySelector(".esa-catalog");if(!c)return;
  var t=c.querySelector(".esa-catalog-title"),ct=c.querySelector(".esa-catalog-contents");
  if(t)t.addEventListener("click",function(){ct.classList.toggle("show");});
}
function initHoverEffects(){
  var s=document.querySelector(".site-branding");if(!s)return;
  s.addEventListener("mouseenter",function(){
    var sk=this.querySelector(".sakuraso"),cf=this.querySelector(".chinese-font");
    if(sk){sk.style.background="#FE9600";sk.style.color="#fff";}
    if(cf)cf.style.display="block";
  });
  s.addEventListener("mouseleave",function(){
    var sk=this.querySelector(".sakuraso"),cf=this.querySelector(".chinese-font");
    if(sk){sk.style.background="rgba(255,255,255,.5)";sk.style.color="#464646";}
    if(cf)cf.style.display="none";
  });
}
