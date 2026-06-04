/* ============================================================================
 * Interactions — command palette (⌘K), deep-link to drawer, live mode store
 * Depends on: MEEGLE_DATA, openDrawer (drawer.js), window.__GO (shell)
 * ========================================================================== */
(function(){
  var D = window.MEEGLE_DATA || {};

  /* ---------- searchable index ---------- */
  function buildIndex(){
    var items = [];
    (window.__TABS||[]).forEach(function(t){
      items.push({kind:'Tab', label:t.label, sub:t.sub||'', act:function(){ window.__GO(t.id); }});
    });
    Object.keys(D.wit||{}).forEach(function(id){
      var w=D.wit[id];
      items.push({kind:'WIT', label:w.name, sub:w.code, act:function(){ openSel('wit',id); }});
    });
    Object.keys(D.auto||{}).forEach(function(id){
      var a=D.auto[id];
      items.push({kind:'Automation', label:id, sub:a.action, act:function(){ openSel('auto',id); }});
    });
    Object.keys(D.role||{}).forEach(function(id){
      var r=D.role[id];
      items.push({kind:'Role', label:r.name, sub:(r.person||r.dept), act:function(){ openSel('role',id); }});
    });
    Object.keys(D.master||{}).forEach(function(id){
      var m=D.master[id];
      items.push({kind:'Master', label:m.name, sub:id, act:function(){ openSel('master',id); }});
    });
    return items;
  }

  function openSel(type,id){
    closePalette();
    if(window.openDrawer) window.openDrawer(type,id);
    if(window.__SETSEL) window.__SETSEL(type+':'+id);
  }

  /* ---------- palette DOM ---------- */
  var scrim, box, input, list, idx=[], filtered=[], cursor=0, openFlag=false;
  function ensure(){
    if(scrim) return;
    scrim=document.createElement('div'); scrim.className='cmdk-scrim';
    box=document.createElement('div'); box.className='cmdk';
    box.innerHTML=
      '<div class="cmdk-top"><span class="cmdk-ic">⌕</span>'+
      '<input class="cmdk-input" placeholder="Tìm WIT, automation, vai trò, tab…" />'+
      '<span class="cmdk-esc">ESC</span></div>'+
      '<div class="cmdk-list"></div>'+
      '<div class="cmdk-foot">↑↓ chọn · ↵ mở · Esc đóng</div>';
    scrim.appendChild(box);
    document.body.appendChild(scrim);
    input=box.querySelector('.cmdk-input');
    list=box.querySelector('.cmdk-list');
    scrim.addEventListener('click', function(e){ if(e.target===scrim) closePalette(); });
    input.addEventListener('input', function(){ filter(input.value); });
    input.addEventListener('keydown', function(e){
      if(e.key==='ArrowDown'){ e.preventDefault(); cursor=Math.min(cursor+1,filtered.length-1); paint(); }
      else if(e.key==='ArrowUp'){ e.preventDefault(); cursor=Math.max(cursor-1,0); paint(); }
      else if(e.key==='Enter'){ e.preventDefault(); if(filtered[cursor]) filtered[cursor].act(); }
    });
  }
  function filter(q){
    q=(q||'').trim().toLowerCase();
    if(!q){ filtered=idx.slice(0,40); }
    else filtered=idx.filter(function(it){
      return (it.label+' '+it.sub+' '+it.kind).toLowerCase().indexOf(q)>=0;
    }).slice(0,40);
    cursor=0; paint();
  }
  var KINDCOL={Tab:'var(--p-color-text-secondary)',WIT:'var(--p-color-text-magic)',Automation:'var(--p-color-text-link)',Role:'var(--st4)',Master:'var(--p-color-gray-12)'};
  function paint(){
    if(!filtered.length){ list.innerHTML='<div class="cmdk-empty">Không có kết quả</div>'; return; }
    list.innerHTML=filtered.map(function(it,i){
      var c=KINDCOL[it.kind]||'var(--p-color-text-secondary)';
      return '<button class="cmdk-item'+(i===cursor?' on':'')+'" data-i="'+i+'">'+
        '<span class="cmdk-kind" style="color:'+c+';border-color:'+c+'">'+it.kind+'</span>'+
        '<span class="cmdk-label">'+esc(it.label)+'</span>'+
        '<span class="cmdk-hint">'+esc(it.sub||'')+'</span></button>';
    }).join('');
    Array.prototype.forEach.call(list.querySelectorAll('.cmdk-item'),function(b){
      b.addEventListener('click', function(){ var i=+b.getAttribute('data-i'); if(filtered[i]) filtered[i].act(); });
      b.addEventListener('mousemove', function(){ cursor=+b.getAttribute('data-i'); highlight(); });
    });
  }
  function highlight(){ Array.prototype.forEach.call(list.children,function(c,i){ if(c.classList) c.classList.toggle('on',i===cursor); }); }
  function esc(s){ return (s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function openPalette(){ ensure(); idx=buildIndex(); filter(''); openFlag=true; scrim.classList.add('open'); input.value=''; setTimeout(function(){ input.focus(); },30); }
  function closePalette(){ if(scrim){ scrim.classList.remove('open'); } openFlag=false; }
  window.__openPalette = openPalette;

  document.addEventListener('keydown', function(e){
    if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); openFlag?closePalette():openPalette(); }
    else if(e.key==='Escape' && openFlag){ closePalette(); }
  });
})();
