
var dmx_controller_skip_init=true; // to avoid conflict with the ilumnichromedemo

var COLOR_UPDATE_INTERVAL=60;
var TIME_FOR_COLOR_CHANGE=2000;

var addVisibilityChangeListener=function(slides, callback) {

  var observer=new WebKitMutationObserver(function(changes) {
    for (var i=0; i<changes.length; i++) {
      var target=changes[i].target;
      callback(target);
    }
  });

  for (var i=0; i<slides.length; i++) {
    observer.observe(slides[i], 
      {attributes: true, attributeFilter: ['class']});
  }

}

var desiredColor=[255,255,255];
var currentColor=[0,0,0];

var msUntilChange=TIME_FOR_COLOR_CHANGE;

var requestColorChange=function(colorHex, transitionMs) {
  geral.acende();
  var color=convertColor(colorHex);
  if (color[0]===desiredColor[0] &&
      color[1]===desiredColor[1] &&
      color[2]===desiredColor[2]
    ) {
    return;
  }
  desiredColor=color;
  msUntilChange=transitionMs;
}

var convertColor=function(str) {
  var n=window.parseInt(str, 16);
  return [
    n>>16 & 0xff,
    n>>8 & 0xff,
    n & 0xff
  ];
};

(function() {

  var moveDelta=function(c, percent) {
    var delta=desiredColor[c]-currentColor[c];
    var newColor=Math.round(currentColor[c]+delta*percent);
    if (delta>0 && newColor<currentColor[c] ||
        delta<0 && newColor>currentColor[c]) { // should move up but some calculation went wrong
      newColor=desiredColor[c];
    }
    currentColor[c]=Math.min(Math.max(newColor, 0), 255);
  }

  var lastTime=Date.now();

  window.setInterval(function() {
    var now=Date.now();
    var deltaTime=now-lastTime;
    lastTime=now;
    if (desiredColor[0]===currentColor[0] && 
        desiredColor[1]===currentColor[1] &&
        desiredColor[2]===currentColor[2]) {
      msUntilChange=0;
      return;
    }
    msUntilChange-=deltaTime;
    if (msUntilChange<=0) {
      msUntilChange=0;
      currentColor[0]=desiredColor[0];
      currentColor[1]=desiredColor[1];
      currentColor[2]=desiredColor[2];
    } else {
      var percent=(deltaTime/msUntilChange);
      moveDelta(0, percent);
      moveDelta(1, percent);
      moveDelta(2, percent);
    }
    changeColor(currentColor[0], currentColor[1], currentColor[2]);

  }, COLOR_UPDATE_INTERVAL);
})();

var changeColor=function(r, g, b) {
  geral.setColor(r, g, b);
  var el=document.getElementById("colortester");
  if (!el) {
    el=document.createElement('div');
    el.id='colortester';
    el.style.position='absolute';
    el.style.bottom='60px';
    el.style.right='60px';
    el.style.width='10px';
    el.style.height='10px';
    el.style.borderRadius='5px';
    document.body.appendChild(el);
  }
  var color='#'+
  (r<16?'0':'')+r.toString(16)+
  (g<16?'0':'')+g.toString(16)+
  (b<16?'0':'')+b.toString(16);
  el.style.backgroundColor=color;
}

var colorMap={
  greenlights: "00FF00",
  yellowlights: "FFFF00",
  bluelights: "0000FF",
  redlights: "FF0000",
  nolights: "000000"
};

var spotControl={
  spot_on: true,
  spot_off: false
};

addVisibilityChangeListener(document.querySelectorAll("slide"), 
  function(element) {
      var visible=element.className.indexOf("current")>=0;
      if (visible) {
        var classes=element.className.split(' ');
        for (var i=0; i<classes.length; i++) {
          var cl=classes[i];
          if (colorMap[cl]) {
            requestColorChange(colorMap[cl], TIME_FOR_COLOR_CHANGE);
          } else if (typeof(spotControl[cl])==='boolean') {
            if (spotControl[cl]) {
              pulpito.setBrightness(150);
              pernas.acende();
              logo.setBrightness(80);
            } else {
              pulpito.apaga();
              logo.acende();
              pernas.apaga();
            }
          }
        }
      }
  });

addVisibilityChangeListener([document.getElementById('move_icons')], 
  function(element) {
      var current=element.className.indexOf("build-current")>=0;
      var p=element.parentElement;
      var i1=p.querySelector("#icon1");
      if (current && i1.style.position!='absolute') {
        document.getElementById('offline_title').innerText="Chrome Apps: offline first"
        p.style.position='relative';
        var i3=p.querySelector("#icon3");
        var i2=p.querySelector("#icon2");
        var i_appcache=p.querySelector("#icon_appcache");
        i1.style.position=i2.style.position=i3.style.position=i_appcache.style.position='absolute';
        i1.style.left='142px';
        i_appcache.style.left='349px';
        i2.style.left='524px';
        i3.style.left='699px';
        i_appcache.style.top='100px';
        i1.style.webkitTransition=
        i2.style.webkitTransition=
        i3.style.webkitTransition=
        i_appcache.style.webkitTransition=
        '1s';
        setTimeout(function() {
          i1.style.left='630px';
          i2.style.left='420px';
          i3.style.left='160px';
          i_appcache.style.top='2000px';
          i1.offsetWidth=i1.offsetWidth;  
        }, 5);
      }
  });


dmx_open(function() {
  tudo.apaga();
  geral.setColor(0,0,0);
  geral.acende();
  logo.acende();
});
