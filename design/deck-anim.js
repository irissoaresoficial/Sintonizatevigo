(function () {
  var E = 'cubic-bezier(0.16,1,0.3,1)', IO = 'cubic-bezier(.65,0,.35,1)', BACK = 'cubic-bezier(.34,1.56,.64,1)';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fmt = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  var last = null;
  function splitWords(el) {
    if (el.dataset.split) return [].slice.call(el.querySelectorAll('[data-w]'));
    var out = [];
    (function walk(node) {
      [].slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var parts = c.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var s = document.createElement('span'); s.setAttribute('data-w', ''); s.style.display = 'inline-block'; s.textContent = p; frag.appendChild(s); out.push(s);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
    })(el);
    el.dataset.split = '1';
    return out;
  }
  function run(slide) {
    if (!slide || reduce) return;
    last = slide;
    slide.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
    var els = [].slice.call(slide.querySelectorAll('[data-a]'));
    if (!els.length) {
      [].slice.call(slide.children).filter(function (c) { return !c.hasAttribute('data-particles'); }).forEach(function (el, i) {
        el.animate([{ opacity: 0, transform: 'translateY(32px)' }, { opacity: 1, transform: 'none' }], { duration: 1200, delay: 80 + i * 170, easing: E, fill: 'backwards' });
      });
      return;
    }
    els.forEach(function (el) {
      var d = parseFloat(el.dataset.d || 0) * 1000, t = el.dataset.a, dur = parseFloat(el.dataset.t || 0) * 1000;
      var A = function (kf, du, extra) { el.animate(kf, Object.assign({ delay: d, easing: E, fill: 'backwards', duration: dur || du }, extra || {})); };
      if (t === 'up') A([{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none' }], 1100);
      else if (t === 'fade') A([{ opacity: 0 }, { opacity: 1 }], 1200);
      else if (t === 'pop') A([{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)' }], 800, { easing: BACK });
      else if (t === 'grow') A([{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], 1600);
      else if (t === 'draw') A([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], 1800, { easing: IO });
      else if (t === 'growx') A([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 1600, { easing: IO });
      else if (t === 'growy') A([{ transform: 'scaleY(0)', opacity: .2 }, { transform: 'scaleY(1)', opacity: 1 }], 1000);
      else if (t === 'slidex') A([{ transform: 'translateX(' + (-(+el.dataset.x || 0)) + 'px)' }, { transform: 'none' }], 1600, { easing: IO });
      else if (t === 'travel') A([{ offsetDistance: '0%', opacity: 0 }, { offsetDistance: '8%', opacity: 1, offset: .08 }, { offsetDistance: '100%', opacity: 1 }], 2200, { easing: IO });
      else if (t === 'sweep') A([{ transform: 'translateX(-120%)', opacity: 0 }, { opacity: 1, offset: .3 }, { transform: 'translateX(120%)', opacity: 0 }], 1600, { easing: 'ease-in-out' });
      else if (t === 'sway') A([{ transform: 'translateX(-700px)' }, { transform: 'translateX(620px)', offset: .35 }, { transform: 'translateX(-320px)', offset: .7 }, { transform: 'translateX(0)' }], 3600, { easing: 'ease-in-out' });
      else if (t === 'pulse') el.animate([{ transform: 'scale(1)', opacity: .7 }, { transform: 'scale(3)', opacity: 0 }], { duration: dur || 2200, delay: d, iterations: Infinity, easing: 'cubic-bezier(.2,.6,.3,1)' });
      else if (t === 'words') splitWords(el).forEach(function (w, i) {
        w.animate([{ opacity: 0, transform: 'translateY(.4em)' }, { opacity: 1, transform: 'none' }], { duration: 1000, delay: d + i * 50, easing: E, fill: 'backwards' });
      });
      else if (t === 'count') {
        var to = +el.dataset.to, du = dur || 2200, st = performance.now() + d;
        el.textContent = fmt(0);
        var tick = function (now) {
          if (last !== slide) { el.textContent = fmt(to); return; }
          var p = Math.min(1, Math.max(0, (now - st) / du));
          el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
  }
  var cv = document.createElement('canvas'); cv.width = 1920; cv.height = 1080;
  cv.setAttribute('data-particles', '');
  cv.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:-1';
  var st = document.createElement('style'); st.textContent = '@media print{[data-particles]{display:none!important}}'; document.head.appendChild(st);
  var ctx = cv.getContext('2d'), P = [], dark = true;
  for (var i = 0; i < 34; i++) P.push({ x: Math.random() * 1920, y: Math.random() * 1080, r: 1.2 + Math.random() * 2.2, vx: (Math.random() - .5) * .12, vy: -(.05 + Math.random() * .18), a: .16 + Math.random() * .34, ph: Math.random() * 6.28, red: i % 15 === 0 });
  function lum(el) { var m = getComputedStyle(el).backgroundColor.match(/\d+(\.\d+)?/g); if (!m) return 0; return (+m[0] * .3 + +m[1] * .59 + +m[2] * .11) / 255; }
  function attach(slide) {
    if (!slide) return;
    slide.style.isolation = 'isolate';
    if (getComputedStyle(slide).position === 'static') slide.style.position = 'relative';
    slide.insertBefore(cv, slide.firstChild);
    dark = lum(slide) < .5;
  }
  function loop(t) {
    ctx.clearRect(0, 0, 1920, 1080);
    if (!reduce) for (var k = 0; k < P.length; k++) {
      var p = P[k]; p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { p.y = 1090; p.x = Math.random() * 1920; }
      if (p.x < -10) p.x = 1930; if (p.x > 1930) p.x = -10;
      var al = p.a * (.6 + .4 * Math.sin(t * .0008 + p.ph));
      ctx.fillStyle = p.red ? 'rgba(255,59,48,' + (al + .15) + ')' : (dark ? 'rgba(245,245,247,' + al + ')' : 'rgba(29,29,31,' + al * .7 + ')');
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  setInterval(function () { var s = document.querySelector('[data-deck-active]'); if (s && cv.parentNode !== s) attach(s); }, 400);
  document.addEventListener('slidechange', function () {
    requestAnimationFrame(function () { var s = document.querySelector('[data-deck-active]'); attach(s); run(s); });
  });
})();
