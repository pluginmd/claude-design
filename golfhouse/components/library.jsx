/* ============================================================
   TAB THƯ VIỆN — hệ thống tài nguyên (SSOT)
   ============================================================ */
function LibraryView({ open }) {
  const L = window.GOLF.library;
  const [active, setActive] = React.useState("all");
  const [q, setQ] = React.useState("");
  const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");

  // flatten directory items into a uniform shape for search/count
  const allItems = React.useMemo(() => {
    const out = [];
    L.collections.forEach(c => {
      if (c.id === "directory") {
        c.groups.forEach(grp => grp.items.forEach((it, i) => out.push({ col: c.id, kind: "contact", group: grp.g, ...it, _id: c.id + grp.g + i })));
      } else {
        c.items.forEach((it, i) => out.push({ col: c.id, kind: "doc", ...it, _id: c.id + i }));
      }
    });
    return out;
  }, []);

  const nq = norm(q);
  const match = (it) => !nq || norm([it.t, it.org, it.own, it.note, it.group, it.team].join(" ")).includes(nq);
  const visibleCols = active === "all" ? L.collections : L.collections.filter(c => c.id === active);

  const colCount = (cid) => allItems.filter(it => it.col === cid).length;
  const totalItems = allItems.length;
  const accessCount = (a) => allItems.filter(it => it.access === a).length;

  const AccessTag = ({ a }) => { const m = L.ACCESS[a]; return m ? React.createElement("span", { className: "lib-acc", style: { color: m.c, borderColor: m.c } }, m.l) : null; };
  const StTag = ({ s }) => { const m = L.DOCST[s]; return m ? React.createElement("span", { className: "lib-st", style: { background: m.c } }, m.l) : null; };

  return React.createElement("div", { className: "libview" },
    React.createElement("div", { className: "lib-intro" },
      React.createElement("h2", null, "Thư viện Tài nguyên — Single Source of Truth"),
      React.createElement("p", null, "Mỗi loại thông tin có đúng một nguồn chuẩn; mọi file khác là copy. Đây là kho trung tâm: danh bạ, hợp đồng, template tái dùng, tri thức, media-brand và báo cáo — kiểm soát phiên bản & phân quyền.")),

    // governance + stats bar
    React.createElement("div", { className: "lib-top" },
      React.createElement("div", { className: "lib-gov" },
        L.governance.map((g, i) => React.createElement("div", { key: i, className: "gov-card" },
          React.createElement("b", null, g.t), React.createElement("p", null, g.d)))),
      React.createElement("div", { className: "lib-stats" },
        React.createElement("div", { className: "lib-stat" }, React.createElement("b", null, totalItems), React.createElement("span", null, "tài nguyên")),
        React.createElement("div", { className: "lib-stat" }, React.createElement("b", null, L.collections.length), React.createElement("span", null, "bộ sưu tập")),
        React.createElement("div", { className: "lib-acclegend" },
          Object.keys(L.ACCESS).map(a => React.createElement("div", { key: a, className: "lib-acclg" },
            React.createElement("i", { style: { background: L.ACCESS[a].c } }),
            React.createElement("span", null, L.ACCESS[a].l), React.createElement("b", null, accessCount(a))))))
    ),

    // controls: collection filter + search
    React.createElement("div", { className: "lib-controls" },
      React.createElement("div", { className: "lib-tabs" },
        React.createElement("button", { className: "lib-tab" + (active === "all" ? " on" : ""), onClick: () => setActive("all") },
          React.createElement("span", { className: "lib-tab-ic" }, "▦"), "Tất cả ", React.createElement("em", null, totalItems)),
        L.collections.map(c => React.createElement("button", { key: c.id, className: "lib-tab" + (active === c.id ? " on" : ""), onClick: () => setActive(c.id), style: { "--lc": `oklch(0.78 0.13 ${c.hue})` } },
          React.createElement("span", { className: "lib-tab-ic" }, c.icon), c.name, " ", React.createElement("em", null, colCount(c.id))))),
      React.createElement("div", { className: "lib-search" },
        React.createElement("span", null, "⌕"),
        React.createElement("input", { placeholder: "Tìm trong thư viện…", value: q, onChange: e => setQ(e.target.value) }),
        q && React.createElement("button", { className: "lib-clear", onClick: () => setQ("") }, "✕"))),

    // collections
    visibleCols.map(c => {
      const hue = `oklch(0.78 0.13 ${c.hue})`;
      if (c.id === "directory") {
        const groups = c.groups.map(grp => ({ g: grp.g, items: grp.items.filter(it => match({ ...it, group: grp.g })) })).filter(grp => grp.items.length);
        if (!groups.length) return null;
        return React.createElement("section", { key: c.id, className: "lib-col" },
          React.createElement("div", { className: "lib-col-h", style: { "--lc": hue } },
            React.createElement("span", { className: "lib-col-ic" }, c.icon),
            React.createElement("div", null, React.createElement("h3", null, c.name), React.createElement("p", null, c.desc))),
          groups.map((grp, gi) => React.createElement("div", { key: gi, className: "dir-group" },
            React.createElement("div", { className: "dir-gh" }, grp.g),
            React.createElement("div", { className: "dir-grid" },
              grp.items.map((it, i) => React.createElement("button", { key: i, className: "dir-card", style: { "--lc": hue }, onClick: () => open({ type: "res", item: { ...it, col: c.id, kind: "contact", group: grp.g } }) },
                React.createElement("div", { className: "dir-top" },
                  React.createElement("b", null, it.t),
                  React.createElement(AccessTag, { a: it.access })),
                React.createElement("div", { className: "dir-org" }, it.org),
                React.createElement("div", { className: "dir-meta" },
                  React.createElement("span", { className: "dir-ch" }, "☏ " + it.ch),
                  React.createElement("span", { className: "dir-sla" }, "⏱ " + it.sla)),
                it.team !== "—" && React.createElement("span", { className: "dir-team" }, it.team)))))));
      }
      const items = c.items.filter(it => match(it));
      if (!items.length) return null;
      return React.createElement("section", { key: c.id, className: "lib-col" },
        React.createElement("div", { className: "lib-col-h", style: { "--lc": hue } },
          React.createElement("span", { className: "lib-col-ic" }, c.icon),
          React.createElement("div", null, React.createElement("h3", null, c.name), React.createElement("p", null, c.desc))),
        React.createElement("div", { className: "res-grid" },
          items.map((it, i) => React.createElement("button", { key: i, className: "res-card", style: { "--lc": hue }, onClick: () => open({ type: "res", item: { ...it, col: c.id, kind: "doc" } }) },
            React.createElement("div", { className: "res-top" },
              React.createElement(StTag, { s: it.st }),
              React.createElement(AccessTag, { a: it.access })),
            React.createElement("div", { className: "res-t" }, it.t),
            it.count && React.createElement("span", { className: "res-count" }, it.count),
            React.createElement("p", { className: "res-note" }, it.note),
            React.createElement("div", { className: "res-foot" },
              React.createElement("span", { className: "res-own" }, it.own),
              React.createElement("span", { className: "res-v" }, it.v))))));
    })
  );
}

window.LibraryView = LibraryView;
