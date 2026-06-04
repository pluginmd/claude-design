/* ============================================================================
 * Detail Drawer — renderer + cross-link navigation
 * Universal trigger attribute: data-drawer="type:id"  (type: wit|auto|role|master)
 * ========================================================================== */
(function(){
  var D = window.MEEGLE_DATA || {};
  var STAGE = {
    s1:{c:'var(--st1)',label:'Ý tưởng'},
    s2:{c:'var(--st2)',label:'Phát triển sản phẩm'},
    s3:{c:'var(--st3)',label:'Sản xuất'},
    s4:{c:'var(--st4)',label:'Bán hàng'}
  };
  var stack = [];

  // build DOM
  var overlay = document.createElement('div');
  overlay.className = 'dz-overlay';
  var panel = document.createElement('aside');
  panel.className = 'dz';
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-modal','true');
  panel.innerHTML =
    '<div class="dz-head">' +
      '<div class="dz-nav">' +
        '<span class="dz-back" id="dzBack">‹ Quay lại</span>' +
        '<span class="dz-eyebrow" id="dzEyebrow"></span>' +
        '<span class="dz-spacer"></span>' +
        '<span class="dz-close" id="dzClose">✕</span>' +
      '</div>' +
      '<div class="dz-title" id="dzTitle"></div>' +
      '<div class="dz-code" id="dzCode"></div>' +
    '</div>' +
    '<div class="dz-body" id="dzBody"></div>';
  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  var elBack = panel.querySelector('#dzBack');
  var elEye = panel.querySelector('#dzEyebrow');
  var elTitle = panel.querySelector('#dzTitle');
  var elCode = panel.querySelector('#dzCode');
  var elBody = panel.querySelector('#dzBody');

  function esc(s){ return (s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function open(){ overlay.classList.add('open'); panel.classList.add('open'); document.body.style.overflow='hidden'; }
  function close(){ overlay.classList.remove('open'); panel.classList.remove('open'); document.body.style.overflow=''; stack=[]; updateBack(); }
  function updateBack(){ elBack.classList.toggle('show', stack.length>1); }

  overlay.addEventListener('click', close);
  panel.querySelector('#dzClose').addEventListener('click', close);
  elBack.addEventListener('click', function(){ stack.pop(); var prev = stack.pop(); if(prev) show(prev.type, prev.id); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && panel.classList.contains('open')) close(); });

  // ---- field table ----
  function fieldsTable(fields){
    if(!fields || !fields.length) return '';
    var rows = fields.map(function(f){
      var r = f[2]==='y'?'<span class="req-y">●</span>':(f[2]==='c'?'<span class="req-c">◐</span>':'<span class="req-n">○</span>');
      return '<tr><td class="fname">'+esc(f[0])+'</td><td class="ftype">'+esc(f[1])+'</td><td class="freq">'+r+'</td><td class="fnote">'+esc(f[3]||'')+'</td></tr>';
    }).join('');
    return '<table class="fields"><thead><tr><th>Field</th><th>Kiểu</th><th>BB</th><th>Ghi chú</th></tr></thead><tbody>'+rows+'</tbody></table>';
  }

  // ---- node list ----
  function nodeList(nodes){
    if(!nodes || !nodes.length) return '';
    return '<div class="dz-nodes">'+nodes.map(function(nd, i){
      var cls = nd.gate?' gate':(nd.expl?' expl':'');
      var last = i===nodes.length-1;
      var tasks = (nd.tasks&&nd.tasks.length)?'<ul class="ntasks">'+nd.tasks.map(function(t){return '<li>'+esc(t)+'</li>';}).join('')+'</ul>':'';
      var auto = nd.auto?'<div class="nauto">⚡ '+esc(nd.auto)+'</div>':'';
      var btns = (nd.btns&&nd.btns.length)?'<div class="nbtns">'+nd.btns.map(function(b){return '<span class="nbtn '+b.k+'">'+esc(b.t)+'</span>';}).join('')+'</div>':'';
      return '<div class="dz-node'+cls+'">'+
        '<div class="nrail"><div class="nnum">'+esc(nd.n)+'</div>'+(last?'':'<div class="nline"></div>')+'</div>'+
        '<div class="nbody"><div class="nt">'+esc(nd.title)+(nd.owner?' <span class="nowner">'+esc(nd.owner)+'</span>':'')+'</div>'+tasks+auto+btns+'</div>'+
      '</div>';
    }).join('')+'</div>';
  }

  // ---- related chips ----
  function relList(related){
    if(!related || !related.length) return '';
    return '<div class="dz-rels">'+related.map(function(r){
      var disp = resolveName(r.t, r.id);
      var col = disp.color || 'var(--p-color-gray-13)';
      var ic = disp.ic || '◦';
      var clickable = (r.t==='wit'||r.t==='auto'||r.t==='role'||r.t==='master');
      var attr = clickable?(' data-drawer="'+r.t+':'+r.id+'"'):'';
      return '<div class="dz-rel"'+attr+'>'+
        '<span class="ric" style="background:'+col+'">'+ic+'</span>'+
        '<span class="rmeta"><span class="rname">'+esc(disp.name)+'</span><span class="rkind">'+esc(r.kind||'')+'</span></span>'+
        (r.tag?'<span class="rtag">'+esc(r.tag)+'</span>':'')+
        '<span class="rarrow">›</span>'+
      '</div>';
    }).join('')+'</div>';
  }

  function pills(ids, type){
    if(!ids || !ids.length) return '<span class="muted" style="font-size:12px;">—</span>';
    return '<div class="dz-pills">'+ids.map(function(id){
      var disp = resolveName(type, id);
      var col = disp.color || 'var(--p-color-text-magic)';
      var crit = (type==='auto' && D.auto[id] && D.auto[id].crit);
      return '<span class="dz-pill" data-drawer="'+type+':'+id+'">'+
        '<span class="pd" style="background:'+(crit?'var(--p-color-bg-fill-critical)':col)+'"></span>'+
        (type==='auto'?'<code>'+esc(id)+'</code>':esc(disp.name))+
      '</span>';
    }).join('')+'</div>';
  }

  function resolveName(type, id){
    if(type==='wit' && D.wit[id]) return {name:D.wit[id].name, color:STAGE[D.wit[id].stage]?STAGE[D.wit[id].stage].c:null, ic:D.wit[id].seq};
    if(type==='auto' && D.auto[id]) return {name:id, color:'var(--p-color-text-magic)', ic:'⚡'};
    if(type==='role' && D.role[id]) return {name:D.role[id].name, color:D.role[id].color, ic:D.role[id].ava};
    if(type==='master' && D.master[id]) return {name:D.master[id].name, color:'var(--p-color-gray-12)', ic:'▤'};
    return {name:id, color:null, ic:'◦'};
  }

  function sec(title, body, cnt){
    if(!body) return '';
    return '<div class="dz-sec"><div class="dz-sec-h">'+esc(title)+(cnt!=null?' <span class="cnt">'+cnt+'</span>':'')+'</div>'+body+'</div>';
  }

  // ---- renderers ----
  function renderWit(id){
    var w = D.wit[id]; if(!w) return false;
    var st = STAGE[w.stage] || {c:'var(--p-color-gray-12)',label:''};
    elEye.innerHTML = '<span class="dot" style="background:'+st.c+'"></span> Work Item · '+esc(st.label);
    var badge = w.badge?' <span class="badge '+w.badge.t+'">'+esc(w.badge.label)+'</span>':'';
    elTitle.innerHTML = esc(w.name)+badge;
    elCode.innerHTML = '<span>'+esc(w.code)+'</span>'+(w.wf?'<span class="wfbadge">◇ '+esc(w.wf)+'</span>':'');
    elBody.innerHTML =
      sec('Mục đích', '<p class="dz-purpose">'+esc(w.purpose)+'</p>') +
      sec('Data dictionary', fieldsTable(w.fields), w.fields?w.fields.length:0) +
      sec('Workflow', nodeList(w.nodes), w.nodes&&w.nodes.length?w.nodes.length:null) +
      sec('Quan hệ liên quan', relList(w.related), w.related?w.related.length:0) +
      sec('Automation chạm vào', pills(w.autos,'auto'), w.autos?w.autos.length:0) +
      sec('Vai trò tham gia', pills(w.roles,'role'), w.roles?w.roles.length:0);
    return true;
  }

  function renderAuto(id){
    var a = D.auto[id]; if(!a) return false;
    elEye.innerHTML = '<span class="dot" style="background:'+(a.crit?'var(--p-color-bg-fill-critical)':'var(--p-color-bg-fill-magic)')+'"></span> Automation rule';
    elTitle.innerHTML = '<code style="font-family:var(--p-font-family-mono);font-size:20px;">'+esc(id)+'</code>';
    elCode.innerHTML = '<span>No-code · Trigger → Condition → Action</span>';
    var rel = [];
    if(a.src) rel.push({t:'wit',id:a.src,tag:'nguồn',kind:'WIT phát sinh trigger'});
    if(a.dst) rel.push({t:'wit',id:a.dst,tag:'đích',kind:'WIT được tạo / cập nhật'});
    elBody.innerHTML =
      '<div class="dz-sec"><div class="dz-tca">'+
        '<div class="row trig"><div class="lbl">Trigger</div><div class="val">'+esc(a.trigger)+'</div></div>'+
        '<div class="row cond"><div class="lbl">Condition</div><div class="val">'+esc(a.cond)+'</div></div>'+
        '<div class="row act"><div class="lbl">Action</div><div class="val">'+esc(a.action)+'</div></div>'+
      '</div></div>' +
      sec('Liên kết WIT', relList(rel), rel.length);
    return true;
  }

  function renderRole(id){
    var r = D.role[id]; if(!r) return false;
    elEye.innerHTML = '<span class="dot" style="background:'+r.color+'"></span> Vai trò · '+esc(r.dept);
    elTitle.innerHTML = esc(r.name)+(r.lead?' <span class="badge new">lead</span>':'');
    elCode.innerHTML = '<span>'+esc(id)+(r.person?' · '+esc(r.person):'')+'</span>';
    var owns = (r.owns||[]).map(function(wid){ return {t:'wit',id:wid,tag:'sở hữu',kind:(D.wit[wid]?'WIT '+D.wit[wid].code:wid)}; });
    elBody.innerHTML =
      sec('Trách nhiệm chính', '<p class="dz-purpose">'+esc(r.resp)+'</p>') +
      sec('Work Item sở hữu / phụ trách', relList(owns), owns.length);
    return true;
  }

  function renderMaster(id){
    var m = D.master[id]; if(!m) return false;
    elEye.innerHTML = '<span class="dot" style="background:var(--p-color-gray-12)"></span> Master Data';
    elTitle.innerHTML = esc(m.name);
    elCode.innerHTML = '<span>'+esc(id)+'</span>';
    elBody.innerHTML = sec('Mô tả', '<p class="dz-purpose">'+esc(m.desc)+'</p>');
    return true;
  }

  function show(type, id){
    var ok = false;
    if(type==='wit') ok = renderWit(id);
    else if(type==='auto') ok = renderAuto(id);
    else if(type==='role') ok = renderRole(id);
    else if(type==='master') ok = renderMaster(id);
    if(!ok) return;
    stack.push({type:type,id:id});
    updateBack();
    elBody.scrollTop = 0;
    open();
  }

  // public
  window.openDrawer = function(type, id){ stack=[]; show(type,id); };

  // event delegation
  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-drawer]');
    if(!el) return;
    e.preventDefault();
    var parts = el.getAttribute('data-drawer').split(':');
    var type = parts[0], id = parts.slice(1).join(':');
    var insideDrawer = !!e.target.closest('.dz');
    if(insideDrawer){ show(type, id); }   // push onto stack (cross-link)
    else { window.openDrawer(type, id); } // fresh open
  });
})();
