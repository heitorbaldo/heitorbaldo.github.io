/*
  Blog engine. You don't need to edit this file.
  Write posts in the posts/ folder and list them in site.js (see README.md).

  It reads the Markdown inside <script type="text/markdown"> blocks, turns it into HTML,
  typesets $math$ with KaTeX, and builds the sidebar from site.js.
*/
(function () {
  "use strict";

  var ROOT = new URL("../", document.currentScript.src).href; // the blog's top folder
  var SITE = window.SITE || {};
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  var MACROS = Object.assign({}, SITE.macros || {});

  var blocks = readBlocks();
  var page = document.documentElement.getAttribute("data-page") ||
    document.body.getAttribute("data-page") ||
    (blocks.updates != null ? "home" : "post");

  addHeadLinks();
  var col = buildShell();

  var needsMath = /\$|\\\(|\\\[/.test(blocks.all);
  var libs = [ROOT + "assets/vendor/marked.js"];
  if (needsMath) libs.push(ROOT + "assets/vendor/katex/katex.min.js");
  loadScripts(libs, render);

  /* ---------- Reading the page ---------- */

  function readBlocks() {
    var out = { body: [], intro: null, updates: null, all: "" };
    var nodes = document.querySelectorAll('script[type="text/markdown"]');
    for (var i = 0; i < nodes.length; i++) {
      var part = nodes[i].getAttribute("data-part") || "body";
      var text = dedent(nodes[i].textContent);
      out.all += text + "\n";
      if (part === "body") out.body.push(text);
      else out[part] = text;
    }
    out.body = out.body.join("\n\n");
    return out;
  }

  // Remove the indentation shared by every line, so Markdown can be indented in the HTML file.
  function dedent(text) {
    var lines = text.replace(/\r\n?/g, "\n").replace(/\t/g, "    ").split("\n");
    var min = Infinity;
    lines.forEach(function (l) {
      if (l.trim()) min = Math.min(min, l.match(/^ */)[0].length);
    });
    if (!isFinite(min)) return "";
    return lines.map(function (l) { return l.slice(min); }).join("\n").trim();
  }

  /* ---------- Page frame ---------- */

  function addHeadLinks() {
    var head = document.head;
    head.appendChild(h("link", { rel: "stylesheet", href: ROOT + "assets/vendor/katex/katex.min.css" }));
  }

  function buildShell() {
    var posts = sortedPosts();
    var current = currentFile();

    var brand = h("a", { class: "brand", href: ROOT + "index.html" });
    var text = h("span", { class: "brand-text" }, [h("span", { class: "brand-name" }, SITE.name || "Your Name")]);
    if (SITE.role) text.appendChild(h("span", { class: "brand-role" }, SITE.role));
    brand.appendChild(text);

    var menu = h("nav", { class: "menu", "aria-label": "Main" });
    menu.appendChild(menuLink("Updates", ROOT + "index.html", page === "home"));
    menu.appendChild(menuLink("Posts", ROOT + "posts.html", page === "archive"));

    var count = SITE.sidebarPosts == null ? 6 : SITE.sidebarPosts;
    if (posts.length && count > 0) {
      var recent = h("ul", { class: "recent", "aria-label": "Recent posts" });
      posts.slice(0, count).forEach(function (p) {
        var a = h("a", { href: postUrl(p) }, p.title);
        if (page === "post" && sameFile(p.file, current)) a.setAttribute("aria-current", "page");
        recent.appendChild(h("li", null, [a]));
      });
      menu.appendChild(recent);
    }

    var sideNav = h("div", { class: "side-nav" }, [menu]);
    if (SITE.links && SITE.links.length) {
      var links = h("ul", { class: "side-links" });
      SITE.links.forEach(function (l) {
        links.appendChild(h("li", null, [h("a", { href: l.url }, l.label)]));
      });
      sideNav.appendChild(links);
    }

    var side = h("header", { class: "side" }, [h("div", { class: "side-inner" }, [brand, sideNav])]);

    var column = h("div", { class: "col" });
    var footText = SITE.footer || ("© " + new Date().getFullYear() + " " + (SITE.name || ""));
    var main = h("main", { class: "main", id: "content", tabindex: "-1" }, [
      column,
      h("footer", { class: "foot" }, footText)
    ]);

    var shell = h("div", { class: "shell" }, [side, main]);
    document.body.insertBefore(shell, document.body.firstChild);
    document.body.insertBefore(h("a", { class: "skip", href: "#content" }, "Skip to content"), shell);
    return column;
  }

  function menuLink(label, href, current) {
    var a = h("a", { class: "menu-link", href: href }, label);
    if (current) a.setAttribute("aria-current", "page");
    return a;
  }

  /* ---------- Rendering ---------- */

  function render() {
    if (!window.marked) {
      col.appendChild(h("p", { class: "notice" },
        "The page could not load assets/vendor/marked.js. Keep the assets folder next to index.html."));
      return;
    }
    if (page === "home") renderHome();
    else if (page === "archive") renderArchive();
    else renderPost();
    polish(col);
  }

  function renderHome() {
    document.title = SITE.name || "Updates";
    if (blocks.intro) col.appendChild(prose(blocks.intro, "intro prose"));

    if (blocks.updates == null) return;
    var section = h("section", { "aria-labelledby": "updates-title" }, [
      h("h1", { class: "section-title", id: "updates-title" }, "Updates")
    ]);
    var items = splitUpdates(blocks.updates);
    if (!items.length) {
      section.appendChild(prose(blocks.updates, "prose"));
    } else {
      var list = h("ol", { class: "timeline" });
      var used = {};
      items.forEach(function (u) {
        var id = uniqueId(slug(u.label) || "update", used);
        list.appendChild(h("li", { class: "entry", id: id }, [
          h("h2", { class: "entry-date" }, [h("a", { href: "#" + id }, u.label)]),
          prose(u.body, "entry-body prose")
        ]));
      });
      section.appendChild(list);
    }
    col.appendChild(section);
  }

  // Each update starts with a line "## <date>".
  function splitUpdates(src) {
    var items = [], cur = null, fence = false;
    src.split("\n").forEach(function (line) {
      if (/^\s*(```|~~~)/.test(line)) fence = !fence;
      var m = !fence && /^##\s+(.+?)\s*#*\s*$/.exec(line);
      if (m) { cur = { label: m[1], body: [] }; items.push(cur); }
      else if (cur) cur.body.push(line);
    });
    return items.map(function (it) { return { label: it.label, body: it.body.join("\n").trim() }; });
  }

  function renderArchive() {
    document.title = "Posts – " + (SITE.name || "");
    col.appendChild(h("h1", { class: "page-title" }, "Posts"));
    var posts = sortedPosts();
    if (!posts.length) {
      col.appendChild(h("p", { class: "empty" }, "No posts yet. Add your first one to the posts list in site.js."));
      return;
    }
    var archive = h("div", { class: "archive" });
    var byYear = {};
    var years = [];
    posts.forEach(function (p) {
      var y = String(p.date || "").slice(0, 4) || "Undated";
      if (!byYear[y]) { byYear[y] = []; years.push(y); }
      byYear[y].push(p);
    });
    years.forEach(function (y) {
      var ul = h("ul");
      byYear[y].forEach(function (p) {
        ul.appendChild(h("li", null, [
          h("time", { datetime: p.date || "" }, shortDate(p.date)),
          h("a", { href: postUrl(p) }, p.title)
        ]));
      });
      archive.appendChild(h("section", { class: "year" }, [h("h2", null, y), ul]));
    });
    col.appendChild(archive);
  }

  function renderPost() {
    var posts = sortedPosts();
    var file = currentFile();
    var index = -1;
    for (var i = 0; i < posts.length; i++) if (sameFile(posts[i].file, file)) { index = i; break; }
    var info = index >= 0 ? posts[index] : null;

    var src = blocks.body;
    var first = /^#\s+(.+?)\s*#*\s*$/m.exec(src);
    var title = info && info.title;
    if (first && src.indexOf(first[0]) === 0) {          // a "# Title" line opening the post
      if (!title) title = first[1];
      src = src.slice(first[0].length).trim();
    }
    title = title || "Untitled";
    document.title = title + " – " + (SITE.name || "");

    var article = h("article");
    var head = h("header", { class: "post-head" });
    if (info && info.date) head.appendChild(h("p", { class: "post-date" }, [
      h("time", { datetime: info.date }, longDate(info.date))
    ]));
    head.appendChild(h("h1", { class: "page-title" }, title));
    article.appendChild(head);

    if (!info) {
      article.appendChild(h("p", { class: "notice" },
        "This post isn’t listed in site.js yet, so it has no date and doesn’t appear in the menu. Add it to the posts list there."));
    }

    article.appendChild(prose(src, "prose"));

    if (info && posts.length > 1) {
      var nav = h("nav", { class: "post-nav", "aria-label": "More posts" });
      var earlier = posts[index + 1], later = posts[index - 1];
      if (earlier) nav.appendChild(navLink(earlier, "Earlier post", "earlier"));
      if (later) nav.appendChild(navLink(later, "Later post", "later"));
      article.appendChild(nav);
    }
    col.appendChild(article);
  }

  function navLink(p, label, cls) {
    return h("a", { class: cls, href: postUrl(p) }, [
      h("span", { class: "post-nav-label" }, label),
      h("span", { class: "post-nav-title" }, p.title)
    ]);
  }

  /* ---------- Markdown and math ---------- */

  function prose(src, cls) {
    var div = h("div", { class: cls });
    div.innerHTML = markdown(src);
    return div;
  }

  var CODE = /```[\s\S]*?(?:```|$)|~~~[\s\S]*?(?:~~~|$)|``[^\n]*?``|`[^`\n]*`/g;

  function markdown(src) {
    var math = [];
    var html = window.marked.parse(protectMath(src, math), { gfm: true });
    html = html
      .replace(/<p>(\d+)<\/p>/g, function (_, i) { return typeset(math[+i]); })
      .replace(/(\d+)/g, function (_, i) { return typeset(math[+i]); })
      .replace(//g, "$");
    return html;
  }

  // Take math out before Markdown runs, so underscores and asterisks inside formulas survive.
  function protectMath(src, store) {
    var out = "", last = 0, m;
    CODE.lastIndex = 0;
    while ((m = CODE.exec(src))) {
      out += mathOut(src.slice(last, m.index), store) + m[0];
      last = m.index + m[0].length;
      if (!m[0].length) CODE.lastIndex++;
    }
    return out + mathOut(src.slice(last), store);
  }

  function mathOut(text, store) {
    function keep(tex, display, open, close) {
      store.push({ tex: tex, display: display, raw: open + tex + close });
      return "" + (store.length - 1) + "";
    }
    return text
      .replace(/\\\$/g, "")
      .replace(/\$\$([\s\S]+?)\$\$/g, function (_, t) { return keep(t, true, "$$", "$$"); })
      .replace(/\\\[([\s\S]+?)\\\]/g, function (_, t) { return keep(t, true, "\\[", "\\]"); })
      .replace(/\\\(([\s\S]+?)\\\)/g, function (_, t) { return keep(t, false, "\\(", "\\)"); })
      .replace(/\$([^\s$](?:(?:[^$\n]|\n(?![ \t]*\n))*?[^\s$])?)\$(?!\d)/g,
        function (_, t) { return keep(t, false, "$", "$"); });
  }

  function typeset(item) {
    if (!item) return "";
    if (window.katex) {
      try {
        return window.katex.renderToString(item.tex, {
          displayMode: item.display, throwOnError: false, macros: MACROS, strict: "ignore"
        });
      } catch (e) { /* fall through to the source text */ }
    }
    return '<code class="tex">' + escapeHtml(item.raw) + "</code>";
  }

  /* ---------- Typography ---------- */

  // Curly quotes, dashes and ellipses in running text (code and math are left alone).
  function polish(root) {
    var skip = "code, pre, kbd, samp, script, style, .katex, .tex";
    var blocksel = "p, li, h1, h2, h3, h4, h5, h6, blockquote, td, th, dt, dd, figcaption";
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        return n.parentElement && n.parentElement.closest(skip) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    var prev = " ", block = null, node;
    while ((node = walker.nextNode())) {
      var b = node.parentElement.closest(blocksel);
      if (b !== block) { block = b; prev = " "; }
      var t = node.nodeValue.replace(/---/g, "—").replace(/--/g, "–").replace(/\.\.\./g, "…");
      var out = "";
      for (var i = 0; i < t.length; i++) {
        var ch = t.charAt(i);
        if (ch === '"') ch = /[\s(\[{—–\/‘“-]/.test(prev) ? "“" : "”";
        else if (ch === "'") ch = /[\s(\[{—–\/“-]/.test(prev) ? "‘" : "’";
        out += ch;
        prev = ch;
      }
      if (out !== node.nodeValue) node.nodeValue = out;
    }
    var tables = root.querySelectorAll(".prose table");
    for (var j = 0; j < tables.length; j++) {
      var wrap = h("div", { class: "table-wrap" });
      tables[j].parentNode.insertBefore(wrap, tables[j]);
      wrap.appendChild(tables[j]);
    }
  }

  /* ---------- Posts and dates ---------- */

  function sortedPosts() {
    return (SITE.posts || []).filter(function (p) { return p && p.file; }).map(function (p) {
      return { title: p.title || p.file, date: p.date || "", file: p.file };
    }).sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  }

  function postUrl(p) { return ROOT + "posts/" + encodeURI(p.file); }

  function currentFile() {
    var last = location.pathname.split("/").pop() || "";
    try { return decodeURIComponent(last); } catch (e) { return last; }
  }

  function sameFile(a, b) {
    function base(s) { return String(s || "").replace(/\.html?$/i, "").toLowerCase(); }
    return !!a && !!b && base(a) === base(b);
  }

  function parseDate(s) {
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(s || "").trim());
    return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
  }
  function longDate(s) {
    var d = parseDate(s);
    return d ? d.d + " " + MONTHS[d.m - 1] + " " + d.y : String(s || "");
  }
  function shortDate(s) {
    var d = parseDate(s);
    return d ? d.d + " " + MONTHS[d.m - 1].slice(0, 3) : String(s || "");
  }

  /* ---------- Helpers ---------- */

  function slug(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function uniqueId(base, used) {
    var id = base, n = 2;
    while (used[id] || document.getElementById(id)) id = base + "-" + n++;
    used[id] = true;
    return id;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    if (children != null) {
      if (!Array.isArray(children)) children = [children];
      children.forEach(function (c) {
        el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      });
    }
    return el;
  }

  function loadScripts(urls, done) {
    var i = 0;
    (function next() {
      if (i >= urls.length) return done();
      var s = document.createElement("script");
      s.src = urls[i++];
      s.onload = next;
      s.onerror = next;
      document.head.appendChild(s);
    })();
  }
})();
