/* ============================================================================
 * views.js — per-tab interactive engines (init hooks called by shell on swap)
 *   __initRipple  — What-if ripple on Relationship tab
 *   __initPanzoom — drag/zoom canvas on Map tab
 *   __initLive    — live status editing on Dashboard pipeline
 * ========================================================================== */
(function(){
  var G = function(){ return window.MEEGLE_GRAPH; };
  var D = function(){ return window.MEEGLE_DATA||{}; };
  var STAGEC = { s1:'var(--st1)', s2:'var(--st2)', s3:'var(--st3)', s4:'var(--st4)' };

  /* ========================== WHAT-IF RIPPLE ============================= */
  window.__initRipple = function(root){
    var wrap = root.querySelector('#ripple');
    if(!wrap || !G()) return;
    var svg = wrap.querySelector('.rip-svg');
    var nodes = Array.prototype.slice.call(wrap.querySelectorAll('.rip-node'));
    var dirBtns = root.querySelectorAll('[data-rip-dir]');
    var summary = root.querySelector('#ripSummary');
    var resetBtn = root.querySelector('#ripReset');
    var dir = 'down';
    var selected = null;

    function center(el){
      var pr = wrap.getBoundingClientRect();
      var r = el.getBoundingClientRect();
      return { x: r.left - pr.left + r.width/2, y: r.top - pr.top + r.height/2, w:r.width, h:r.height };
    }
    function nodeById(id){ return wrap.querySelector('.rip-node[data-wit="'+id+'"]'); }

    function drawEdges(highlightSet, srcId){
      var pr = wrap.getBoundingClientRect();
      svg.setAttribute('width', pr.width); svg.setAttribute('height', pr.height);
      svg.setAttribute('viewBox','0 0 '+pr.width+' '+pr.height);
      var paths = '';
      G().rels.forEach(function(r){
        var a=nodeById(r[0]), b=nodeById(r[1]); if(!a||!b) return;
        var ca=center(a), cb=center(b);
        var x1=ca.x+ca.w/2-2, y1=ca.y, x2=cb.x-cb.w/2+2, y2=cb.y;
        var mx=(x1+x2)/2;
        var on = highlightSet && highlightSet[r[0]] && highlightSet[r[1]];
        var cls = 'rip-edge'+(r[2]==='normal'?' dashed':'')+(on?' on':'');
        paths += '<path class="'+cls+'" d="M'+x1+','+y1+' C'+mx+','+y1+' '+mx+','+y2+' '+x2+','+y2+'"/>';
      });
      svg.innerHTML = paths;
    }

    function clear(){
      selected=null;
      nodes.forEach(function(n){ n.classList.remove('sel','hit','dim'); n.removeAttribute('data-depth'); });
      drawEdges(null);
      summary.innerHTML = '<div class="rip-empty">Bấm một Work Item để mô phỏng tác động lan truyền theo chiều '+(dir==='down'?'xuôi (downstream)':'ngược (upstream)')+'.</div>';
    }

    function run(id){
      selected=id;
      var layers = G().ripple(id, dir);
      var hit = {}; hit[id]=true;
      layers.forEach(function(L){ L.forEach(function(x){ hit[x]=true; }); });
      nodes.forEach(function(n){
        var wid=n.getAttribute('data-wit');
        n.classList.remove('sel','hit','dim'); n.removeAttribute('data-depth');
        if(wid===id) n.classList.add('sel');
        else if(hit[wid]) n.classList.add('hit');
        else n.classList.add('dim');
      });
      // depth labels
      layers.forEach(function(L,di){ L.forEach(function(x){ var n=nodeById(x); if(n) n.setAttribute('data-depth', di+1); }); });
      drawEdges(hit, id);

      var total = Object.keys(hit).length-1;
      var w = D().wit[id];
      var html = '<div class="rip-head"><span class="rip-dot" style="background:'+(STAGEC[G().stage(id)]||'var(--p-color-gray-13)')+'"></span>'+
        '<div><div class="rip-h-t">'+(w?w.name:id)+'</div><div class="rip-h-s">'+(dir==='down'?'tác động xuôi dòng':'phụ thuộc ngược dòng')+'</div></div>'+
        '<button class="rip-open" data-drawer="wit:'+id+'">Chi tiết ›</button></div>';
      if(!total){ html += '<div class="rip-empty">Không có '+(dir==='down'?'hạ nguồn':'thượng nguồn')+' — đây là điểm '+(dir==='down'?'cuối':'gốc')+' của chuỗi.</div>'; }
      else {
        html += '<div class="rip-metric"><b>'+total+'</b> work item bị ảnh hưởng · <b>'+layers.length+'</b> đời lan truyền</div>';
        html += '<div class="rip-layers">';
        layers.forEach(function(L,di){
          html += '<div class="rip-layer"><div class="rip-layer-n">Đời '+(di+1)+'</div><div class="rip-layer-items">'+
            L.map(function(x){ var ww=D().wit[x]; return '<span class="rip-chip" data-drawer="wit:'+x+'" style="border-color:'+(STAGEC[G().stage(x)]||'var(--p-color-border)')+'">'+(ww?ww.name:x)+'</span>'; }).join('')+
          '</div></div>';
        });
        html += '</div>';
      }
      // kill scenario hint
      if(dir==='down' && total){
        html += '<div class="rip-kill"><b>Kịch bản:</b> nếu <b>'+(w?w.name:id)+'</b> bị hủy / trễ / sai, '+total+' work item hạ nguồn phải dừng hoặc làm lại theo dây chuyền trên.</div>';
      }
      summary.innerHTML = html;
    }

    nodes.forEach(function(n){
      n.addEventListener('click', function(e){
        if(e.target.closest('[data-drawer]') && e.target!==n) return;
        var id=n.getAttribute('data-wit');
        if(selected===id){ clear(); } else { run(id); }
      });
    });
    dirBtns.forEach(function(b){
      b.addEventListener('click', function(){
        dirBtns.forEach(function(x){ x.classList.remove('on'); }); b.classList.add('on');
        dir=b.getAttribute('data-rip-dir');
        if(selected) run(selected); else clear();
      });
    });
    if(resetBtn) resetBtn.addEventListener('click', clear);

    // initial draw (after layout settles)
    var tries=0;
    (function settle(){
      drawEdges(null);
      if(++tries<4) setTimeout(settle, 120);
    })();
    clear();
    window.addEventListener('resize', function(){ if(selected) run(selected); else drawEdges(null); });
  };

  /* ============================== PAN / ZOOM ============================= */
  window.__initPanzoom = function(root){
    var wrap = root.querySelector('#pz'); if(!wrap) return;
    var plane = wrap.querySelector('.pz-plane'); if(!plane) return;
    var scale=1, tx=24, ty=24, dragging=false, sx=0, sy=0, ox=0, oy=0;
    function apply(){ plane.style.transform='translate('+tx+'px,'+ty+'px) scale('+scale+')'; var p=wrap.querySelector('.pz-pct'); if(p) p.textContent=Math.round(scale*100)+'%'; }
    function zoom(f, cx, cy){
      var ns=Math.min(2.2, Math.max(0.3, scale*f));
      var rect=wrap.getBoundingClientRect();
      cx=(cx==null?rect.width/2:cx); cy=(cy==null?rect.height/2:cy);
      tx = cx - (cx-tx)*(ns/scale); ty = cy - (cy-ty)*(ns/scale);
      scale=ns; apply();
    }
    function fit(){
      var rect=wrap.getBoundingClientRect();
      var pw=plane.scrollWidth, ph=plane.scrollHeight;
      var s=Math.min((rect.width-40)/pw, (rect.height-40)/ph, 1);
      scale=Math.max(0.3,s); tx=(rect.width-pw*scale)/2; ty=20; apply();
    }
    wrap.addEventListener('mousedown', function(e){ if(e.target.closest('[data-drawer]'))return; dragging=true; sx=e.clientX; sy=e.clientY; ox=tx; oy=ty; wrap.classList.add('grab'); });
    window.addEventListener('mousemove', function(e){ if(!dragging)return; tx=ox+(e.clientX-sx); ty=oy+(e.clientY-sy); apply(); });
    window.addEventListener('mouseup', function(){ dragging=false; wrap.classList.remove('grab'); });
    wrap.addEventListener('wheel', function(e){ if(!e.ctrlKey && !e.metaKey){ return; } e.preventDefault(); var r=wrap.getBoundingClientRect(); zoom(e.deltaY<0?1.12:0.89, e.clientX-r.left, e.clientY-r.top); }, {passive:false});
    var ctl = root.querySelector('.pz-ctrl');
    if(ctl){
      ctl.querySelector('[data-pz=in]').addEventListener('click', function(){ zoom(1.18); });
      ctl.querySelector('[data-pz=out]').addEventListener('click', function(){ zoom(0.85); });
      ctl.querySelector('[data-pz=fit]').addEventListener('click', fit);
    }
    apply();
    setTimeout(fit, 60);
  };

  /* ============================== LIVE MODE ============================= */
  var LIVE_KEY='af_live_status_v1';
  var CYCLE=[
    {k:'todo', label:'Chưa làm', c:'var(--p-color-gray-9)'},
    {k:'doing',label:'Đang làm', c:'var(--st2)'},
    {k:'review',label:'Chờ duyệt',c:'var(--p-color-yellow-14)'},
    {k:'done', label:'Hoàn tất', c:'var(--st4)'},
    {k:'risk', label:'Rủi ro',   c:'var(--p-color-bg-fill-critical)'}
  ];
  function loadLive(){ try{ return JSON.parse(localStorage.getItem(LIVE_KEY)||'{}'); }catch(e){ return {}; } }
  function saveLive(o){ try{ localStorage.setItem(LIVE_KEY, JSON.stringify(o)); }catch(e){} }

  window.__initLive = function(root){
    var toggle = root.querySelector('#liveToggle'); if(!toggle) return;
    var cards = Array.prototype.slice.call(root.querySelectorAll('.kcard[data-live]'));
    var store = loadLive();
    var on = false;

    function paint(){
      cards.forEach(function(c){
        var id=c.getAttribute('data-live');
        var st=store[id]; var dot=c.querySelector('.kstatus');
        if(!dot){ dot=document.createElement('span'); dot.className='kstatus'; c.appendChild(dot); }
        var def = CYCLE.find(function(x){return x.k===(st||'todo');})||CYCLE[0];
        dot.style.background=def.c; dot.title=def.label;
        c.classList.toggle('live-on', on);
      });
    }
    toggle.addEventListener('click', function(){
      on=!on; toggle.classList.toggle('on',on);
      window.__LIVE_ON = on;
      toggle.textContent = on?'● LIVE — bấm thẻ để đổi trạng thái':'○ Live mode';
      paint();
    });
    cards.forEach(function(c){
      c.addEventListener('click', function(e){
        if(!on) return;                    // live off → let drawer delegation handle it
        e.preventDefault(); e.stopPropagation();
        var id=c.getAttribute('data-live');
        var cur=store[id]||'todo';
        var i=CYCLE.findIndex(function(x){return x.k===cur;});
        var nx=CYCLE[(i+1)%CYCLE.length].k;
        store[id]=nx; saveLive(store); paint();
        c.animate([{transform:'scale(0.96)'},{transform:'scale(1)'}],{duration:160});
      });
    });
    paint();
  };

  /* global delegated nav for guide cards / cross-tab buttons */
  document.addEventListener('click', function(e){
    var g = e.target.closest('[data-goto]');
    if(g && window.__GO){ e.preventDefault(); window.__GO(g.getAttribute('data-goto')); }
  });
})();
