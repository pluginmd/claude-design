/* ============================================================
   COMMAND PALETTE (Ctrl/Cmd-K) — tìm & nhảy nhanh
   ============================================================ */
function CommandPalette({ onClose, setView, open }) {
  const G = window.GOLF;
  const [q, setQ] = React.useState("");
  const [idx, setIdx] = React.useState(0);
  const inputRef = React.useRef(null);

  // build index once
  const items = React.useMemo(() => {
    const list = [];
    const tabs = [
      ["plain", "Dễ hiểu", "Tab"], ["ceo", "CEO Cockpit", "Tab"], ["mission", "Mission Control", "Tab"], ["org", "Tổ chức", "Tab"],
      ["big", "Bản đồ tổng", "Tab"], ["board", "Program Board", "Tab"], ["timeline", "Timeline PI", "Tab"], ["playbook", "Playbook vận hành", "Tab"], ["finance", "Tài chính", "Tab"], ["library", "Thư viện", "Tab"]
    ];
    tabs.forEach(([id, label, k]) => list.push({ kind: k, label, hint: "Mở tab", color: "var(--cyan)", run: () => { setView(id); onClose(); } }));
    G.teams.forEach(t => list.push({ kind: "Team", label: t.id + " · " + t.name, hint: t.po, color: vsColor(t.vs), run: () => { open({ type: "team", id: t.id }); onClose(); } }));
    (G.org ? G.org.roles : []).forEach(r => list.push({ kind: "Vai trò", label: r.title, hint: r.person, color: `oklch(0.78 0.13 ${r.hue})`, run: () => { setView("org"); open({ type: "role", id: r.id }); onClose(); } }));
    (G.business || []).forEach(b => list.push({ kind: "Khung giá trị", label: b.name, hint: b.short, color: `oklch(0.78 0.13 ${b.hue})`, run: () => { setView("playbook"); open({ type: "biz", id: b.id }); onClose(); } }));
    G.epics.forEach(e => list.push({ kind: "Epic", label: e.id + " · " + e.name, hint: e.owner, color: vsColor(e.vs), run: () => { setView("big"); open({ type: "epic", id: e.id }); onClose(); } }));
    G.teams.forEach(t => Object.keys(G.boardCells[t.id] || {}).forEach(s => {
      const name = G.boardCells[t.id][s];
      list.push({ kind: "Ô việc", label: name, hint: t.id + " · " + s, color: vsColor(t.vs), run: () => { setView("board"); open({ type: "feat", team: t.id, sprint: s }); onClose(); } });
    }));
    G.sprints.forEach(s => list.push({ kind: "Sprint", label: s.label + " · " + s.title, hint: s.tminus, color: "var(--ink-dim)", run: () => { setView("timeline"); open({ type: "sprint", id: s.id }); onClose(); } }));
    // library resources
    (G.library ? G.library.collections : []).forEach(c => {
      const hue = `oklch(0.78 0.13 ${c.hue})`;
      if (c.id === "directory") {
        c.groups.forEach(grp => grp.items.forEach(it => list.push({ kind: "Danh bạ", label: it.t, hint: it.org, color: hue, run: () => { setView("library"); open({ type: "res", item: { ...it, col: c.id, kind: "contact", group: grp.g } }); onClose(); } })));
      } else {
        c.items.forEach(it => list.push({ kind: "Tài nguyên", label: it.t, hint: it.own, color: hue, run: () => { setView("library"); open({ type: "res", item: { ...it, col: c.id, kind: "doc" } }); onClose(); } }));
      }
    });
    return list;
  }, []);

  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
  const filtered = React.useMemo(() => {
    if (!q.trim()) return items.slice(0, 40);
    const nq = norm(q);
    return items.filter(it => norm(it.label + " " + it.hint + " " + it.kind).includes(nq)).slice(0, 50);
  }, [q, items]);

  React.useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);
  React.useEffect(() => { setIdx(0); }, [q]);

  const onKey = (e) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter") { e.preventDefault(); if (filtered[idx]) filtered[idx].run(); }
  };

  return React.createElement("div", { className: "cmdk-scrim", onClick: onClose },
    React.createElement("div", { className: "cmdk", onClick: (e) => e.stopPropagation() },
      React.createElement("div", { className: "cmdk-top" },
        React.createElement("span", { className: "cmdk-ic" }, "⌕"),
        React.createElement("input", { ref: inputRef, className: "cmdk-input", placeholder: "Tìm team, vai trò, ô việc, khung giá trị, tab…", value: q, onChange: e => setQ(e.target.value), onKeyDown: onKey }),
        React.createElement("span", { className: "cmdk-esc" }, "ESC")),
      React.createElement("div", { className: "cmdk-list" },
        filtered.length === 0 && React.createElement("div", { className: "cmdk-empty" }, "Không tìm thấy — thử từ khoá khác"),
        filtered.map((it, i) => React.createElement("button", {
          key: i, className: "cmdk-item" + (i === idx ? " on" : ""),
          onMouseEnter: () => setIdx(i), onClick: it.run
        },
          React.createElement("span", { className: "cmdk-kind", style: { color: it.color, borderColor: it.color } }, it.kind),
          React.createElement("span", { className: "cmdk-label" }, it.label),
          React.createElement("span", { className: "cmdk-hint" }, it.hint)))),
      React.createElement("div", { className: "cmdk-foot" }, "↑↓ di chuyển · ↵ chọn · Esc đóng")
    )
  );
}

window.CommandPalette = CommandPalette;
