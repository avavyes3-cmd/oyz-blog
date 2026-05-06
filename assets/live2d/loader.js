(function(){
  var canvas=document.getElementById("l2d-canvas");
  if(!canvas)return;
  if(typeof PIXI==="undefined"||typeof PIXI.live2d==="undefined"){canvas.style.pointerEvents="none";canvas.style.display="none";return;}
  var modelPath="assets/live2d/dafeng/dafeng_7.model3.json";
  var W=window.innerWidth,H=window.innerHeight;
  canvas.width=W;canvas.height=H;
  var app=new PIXI.Application({view:canvas,width:W,height:H,transparent:true,backgroundAlpha:0,antialias:true,resolution:1,autoDensity:true});
  PIXI.live2d.Live2DModel.from(modelPath).then(function(model){
    model.anchor.set(0.5,0.5);

    function relayout(){
      var nW=window.innerWidth,nH=window.innerHeight;
      var isInner=document.body.classList.contains("inner-page");
      var isPortrait=nH>nW;
      app.renderer.resize(nW,nH);canvas.width=nW;canvas.height=nH;

      if(isInner){
        var innerScale=isPortrait?Math.min(nW/model.width,nH/model.height)*0.5:Math.min(nW/model.width,nH/model.height)*0.62;
        model.scale.set(innerScale);
        model.rotation=isPortrait?-0.08:0;
        model.x=isPortrait?nW*0.84:nW*0.86;
        model.y=isPortrait?nH*0.86:nH*0.8;
      }else{
        if(isPortrait){
          var homePortraitScale=Math.min((nW * 0.88) / model.width, (nH * 0.86) / model.height);
          model.scale.set(homePortraitScale);
          model.rotation=0;
          model.x=nW*0.5;
          model.y=nH*0.64;
        }else{
          var homeScale=Math.min(nW/model.width,nH/model.height)*0.7;
          model.scale.set(homeScale);
          model.rotation=0;
          model.x=nW*0.75;
          model.y=nH*0.65;
        }
      }
    }

    app.stage.addChild(model);
    relayout();
    window.__oyzLive2DRelayout=relayout;
    window.addEventListener("resize",relayout);
    window.addEventListener("orientationchange",relayout);
    window.addEventListener("hashchange",function(){setTimeout(relayout,0)});
  }).catch(function(){canvas.style.display="none";});
})();
