document.addEventListener("DOMContentLoaded",function(){
  initScrollProgress();
  initHeaderScroll();
  initMobileMenu();
  initBackToTop();
  initScrollDown();
  initHeroBgSwitcher();
  initCopyButtons();
  initCatalog();
  initRandomHeroBg();
  initHoverEffects();
});

function initScrollProgress(){
  var bar=document.getElementById("scrollInfo");
  if(!bar)return;
  window.addEventListener("scroll",function(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    var y=window.scrollY||document.documentElement.scrollTop;
    bar.style.width=h>0?(y/h*100)+"%":"0%";
  });
}

function initHeaderScroll(){
  var hdr=document.getElementById("header");
  if(!hdr)return;
  window.addEventListener("scroll",function(){
    hdr.classList.toggle("visible",(window.scrollY||document.documentElement.scrollTop)>60);
  });
}

function initMobileMenu(){
  var btn=document.querySelector(".esa-mobile-menu");
  var nav=document.getElementById("mo-nav");
  if(!btn||!nav)return;
  btn.addEventListener("click",function(){
    var isOpen=nav.classList.contains("open");
    nav.classList.toggle("open",!isOpen);
    btn.textContent=isOpen?"☰":"✕";
  });
  nav.querySelectorAll("a").forEach(function(a){
    a.addEventListener("click",function(){nav.classList.remove("open");btn.textContent="☰";});
  });
}

function initBackToTop(){
  var top=document.querySelector(".cd-top");
  if(!top)return;
  window.addEventListener("scroll",function(){
    top.classList.toggle("show",(window.scrollY||document.documentElement.scrollTop)>200);
  });
  top.addEventListener("click",function(e){e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});});
}

function initScrollDown(){
  var sd=document.querySelector(".scroll-down");
  if(!sd)return;
  sd.addEventListener("click",function(){
    var m=document.getElementById("main");
    if(m)window.scrollTo({top:m.offsetTop-20,behavior:"smooth"});
  });
}

function initHeroBgSwitcher(){
  var imgs=window._homeTopImgs||[];
  if(!imgs.length)return;
  var idx=Math.floor(Math.random()*imgs.length);
  var hero=document.querySelector(".main-header");
  function setBg(){hero.style.backgroundImage="url("+imgs[idx]+")";}
  setBg();
  var pre=document.getElementById("bg-pre");
  var next=document.getElementById("bg-next");
  if(pre)pre.addEventListener("click",function(){idx=(idx-1+imgs.length)%imgs.length;setBg();});
  if(next)next.addEventListener("click",function(){idx=(idx+1)%imgs.length;setBg();});
}

function initRandomHeroBg(){
  var imgs=window._homeTopImgs||[];
  if(!imgs.length)return;
  var hero=document.querySelector(".main-header");
  if(!hero)return;
  var idx=Math.floor(Math.random()*imgs.length);
  hero.style.backgroundImage="url("+imgs[idx]+")";
}

function initHoverEffects(){
  var logo=document.querySelector(".site-branding");
  if(!logo)return;
  logo.addEventListener("mouseenter",function(){
    var s=this.querySelector(".sakuraso");
    var c=this.querySelector(".chinese-font");
    if(s){s.style.backgroundColor="#FE9600";s.style.color="#fff";}
    if(c)c.style.display="block";
  });
  logo.addEventListener("mouseleave",function(){
    var s=this.querySelector(".sakuraso");
    var c=this.querySelector(".chinese-font");
    if(s){s.style.backgroundColor="rgba(255,255,255,.5)";s.style.color="#464646";}
    if(c)c.style.display="none";
  });
}

function initCopyButtons(){
  document.querySelectorAll(".esa-clipboard-button").forEach(function(btn){
    btn.addEventListener("click",function(){
      var code=this.parentElement.querySelector("pre")||this.parentElement.querySelector(".code-table");
      var text=code?code.textContent:"";
      if(navigator.clipboard){
        navigator.clipboard.writeText(text).then(function(){
          btn.textContent="Copied!";setTimeout(function(){btn.textContent="Copy";},2000);
        });
      }
    });
  });
}

function initCatalog(){
  var cat=document.querySelector(".esa-catalog");
  if(!cat)return;
  var title=cat.querySelector(".esa-catalog-title");
  var contents=cat.querySelector(".esa-catalog-contents");
  if(title)title.addEventListener("click",function(){contents.classList.toggle("show");});
}

function initLightbox(){
  document.querySelectorAll(".postBody img").forEach(function(img){
    img.style.cursor="zoom-in";
    img.addEventListener("click",function(){
      var ov=document.createElement("div");
      ov.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99999;display:flex;align-items:center;justify-content:center;cursor:zoom-out";
      var im=document.createElement("img");
      im.src=this.src;im.style.cssText="max-width:95vw;max-height:95vh;border-radius:8px";
      ov.appendChild(im);
      ov.addEventListener("click",function(){ov.remove();});
      document.body.appendChild(ov);
    });
  });
}
