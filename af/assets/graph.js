/* ============================================================================
 * MEEGLE_GRAPH — dependency graph derived from automations + structural relations
 * Powers: What-if ripple, navigable drawer, relationship map
 * ========================================================================== */
(function(){
  var D = window.MEEGLE_DATA || {};

  // Structural relationships (R1–R26) — parent→child / reference edges between WITs.
  // kind: 'parental' | 'normal' ; label shown on hover.
  var RELS = [
    ['collection','product-brief','parental','R1 · 1:N'],
    ['product-brief','style','parental','R2 · 1:N'],
    ['style','npl-check','parental','R3 · 1:1'],
    ['npl-check','npl-development','parental','R4 · 1:N'],
    ['npl-check','material-po','normal','R5 · N:N'],
    ['style','pattern-making','parental','R6 · 1:N'],
    ['style','sample-order','parental','R7 · 1:N'],
    ['sample-order','sample-review','parental','R8 · 1:N'],
    ['style','tech-doc','parental','R9 · 1:1'],
    ['style','product-registration','parental','R10 · 1:1'],
    ['product-registration','sku-master','parental','R11 · 1:N ★ explode'],
    ['style','production-request','parental','R12 · 1:1'],
    ['production-request','factory-quotation','parental','R13 · 1:N'],
    ['factory-quotation','production-order','normal','R14 · 1:1'],
    ['production-order','production-lot','parental','R15 · 1:N'],
    ['production-lot','npl-issue','parental','R16 · 1:N'],
    ['production-lot','qc-inspection','normal','R17 · 1:N'],
    ['production-lot','inbound-lot','parental','R18 · 1:1'],
    ['style','marketing-campaign','normal','R19 · N:N'],
    ['style','sku-master','normal','R20 · 1:N'],
    ['sku-master','sales-order','normal','R23 · N:N']
  ];

  // Build adjacency from structural rels + automation src→dst
  var fwd = {};  // id -> [{to, via, label}]
  var rev = {};  // id -> [{from, via, label}]
  function addEdge(a,b,via,label){
    if(!a||!b) return;
    (fwd[a]=fwd[a]||[]).push({to:b,via:via,label:label});
    (rev[b]=rev[b]||[]).push({from:a,via:via,label:label});
  }
  RELS.forEach(function(r){ addEdge(r[0],r[1],'rel',r[3]+' · '+(r[2]==='parental'?'cha–con':'tham chiếu')); });
  Object.keys(D.auto||{}).forEach(function(aid){
    var a = D.auto[aid];
    if(a.src && a.dst && a.src!==a.dst) addEdge(a.src,a.dst,'auto',aid+' · '+a.action);
  });

  function dedupeIds(arr){ var seen={},out=[]; arr.forEach(function(x){ if(!seen[x]){seen[x]=1;out.push(x);} }); return out; }

  // BFS downstream (impact) — returns ordered layers of WIT ids affected if `id` changes/breaks
  function ripple(id, dir){
    var adj = dir==='up'?rev:fwd;
    var keyTo = dir==='up'?'from':'to';
    var layers=[], seen={}; seen[id]=true;
    var frontier=[id];
    while(frontier.length){
      var next=[];
      frontier.forEach(function(n){
        (adj[n]||[]).forEach(function(e){
          var t=e[keyTo];
          if(!seen[t]){ seen[t]=true; next.push(t); }
        });
      });
      next = dedupeIds(next);
      if(next.length) layers.push(next);
      frontier=next;
      if(layers.length>12) break;
    }
    return layers;
  }

  function edgesOf(id){
    return { out: fwd[id]||[], in: rev[id]||[] };
  }

  // flat impact set (all downstream ids)
  function impactSet(id){
    var all=[]; ripple(id,'down').forEach(function(L){ all=all.concat(L); }); return dedupeIds(all);
  }
  function upstreamSet(id){
    var all=[]; ripple(id,'up').forEach(function(L){ all=all.concat(L); }); return dedupeIds(all);
  }

  window.MEEGLE_GRAPH = {
    rels: RELS, fwd: fwd, rev: rev,
    ripple: ripple, edgesOf: edgesOf, impactSet: impactSet, upstreamSet: upstreamSet,
    label: function(id){ return (D.wit[id]&&D.wit[id].name)||id; },
    stage: function(id){ return D.wit[id]&&D.wit[id].stage; }
  };
})();
