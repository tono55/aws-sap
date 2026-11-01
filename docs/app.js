(function () {
  "use strict";
  var KEY = "sapc02-quiz.v1";
  var app = document.getElementById("app");
  var info = document.getElementById("topbar-info");
  var KEYS = "ABCDEFGH";

  // ---------- storage ----------
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { q: {}, prefs: {} }; }
    catch (e) { return { q: {}, prefs: {} }; }
  }
  var store = load();
  if (!store.q) store.q = {};
  if (!store.prefs) store.prefs = {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }
  function rec(id) { return store.q[id] || (store.q[id] = { n: 0, ok: 0, last: null, flag: false }); }

  // ---------- data ----------
  var allTasks = [];
  var byId = {};
  SAP.domains.forEach(function (d) {
    d.tasks.forEach(function (t) {
      t.domain = d;
      t.questions = SAP.questions[t.id] || [];
      t.questions.forEach(function (q) { q.task = t; byId[q.id] = q; });
      allTasks.push(t);
    });
  });
  var total = allTasks.reduce(function (s, t) { return s + t.questions.length; }, 0);

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var x = a[i]; a[i] = a[j]; a[j] = x;
    }
    return a;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function taskStats(t) {
    var seen = 0, ok = 0;
    t.questions.forEach(function (q) {
      var r = store.q[q.id];
      if (r && r.n) { seen++; if (r.last) ok++; }
    });
    return { seen: seen, ok: ok, total: t.questions.length };
  }
  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }

  // ---------- home ----------
  var prefs = Object.assign({ tasks: allTasks.map(function (t) { return t.id; }), count: 20, filter: "all", mode: "practice" }, store.prefs);

  function renderHome() {
    session = null;
    info.textContent = "全 " + total + " 問";
    var seen = 0, ok = 0, wrong = 0, flagged = 0;
    Object.keys(store.q).forEach(function (id) {
      var r = store.q[id];
      if (!byId[id]) return;
      if (r.n) { seen++; if (r.last) ok++; else wrong++; }
      if (r.flag) flagged++;
    });

    var h = "";
    h += '<section class="card"><h1>SAP-C02 練習問題集</h1>';
    h += '<p class="muted small">AWS Certified Solutions Architect – Professional の 4 ドメイン・19 タスクステートメントから均等に作成したオリジナル問題です。シナリオから要件キーワード(RTO/RPO・最小コスト・最小運用負荷など)を読み取り、「最適」な選択肢を選んでください。</p>';
    h += '<div class="stats-row">';
    h += '<div class="stat"><b>' + total + '</b><span>収録問題数</span></div>';
    h += '<div class="stat"><b>' + seen + '</b><span>解答済み (' + pct(seen, total) + '%)</span></div>';
    h += '<div class="stat"><b>' + pct(ok, seen) + '%</b><span>直近正答率</span></div>';
    h += '<div class="stat"><b>' + wrong + '</b><span>要復習(直近不正解)</span></div>';
    h += '</div></section>';

    h += '<section class="card"><h2>出題範囲</h2>';
    h += '<div class="actions" style="margin:0 0 8px"><button class="btn small secondary" data-act="all">すべて選択</button><button class="btn small secondary" data-act="none">すべて解除</button></div>';
    SAP.domains.forEach(function (d) {
      var dsel = d.tasks.every(function (t) { return prefs.tasks.indexOf(t.id) >= 0; });
      h += '<div class="domain"><div class="domain-head"><input type="checkbox" id="d' + d.id + '" data-domain="' + d.id + '"' + (dsel ? " checked" : "") + '><label for="d' + d.id + '">Domain ' + d.id + ': ' + esc(d.name) + ' <span class="muted small">(配点 ' + d.weight + '%)</span></label></div>';
      d.tasks.forEach(function (t) {
        var s = taskStats(t);
        var on = prefs.tasks.indexOf(t.id) >= 0;
        h += '<div class="task"><input type="checkbox" id="t' + t.id + '" data-task="' + t.id + '"' + (on ? " checked" : "") + '>';
        h += '<label for="t' + t.id + '">' + t.id + ' ' + esc(t.name) + '<div class="bar"><i style="width:' + pct(s.ok, s.total) + '%"></i></div></label>';
        h += '<span class="meta">' + s.ok + '/' + s.total + ' 正解 · <a href="' + SAP.repo + t.note + '" target="_blank" rel="noopener">ノート</a></span></div>';
      });
      h += '</div>';
    });
    h += '</section>';

    h += '<section class="card"><h2>出題設定</h2><div class="options">';
    h += chipGroup("モード", "mode", [["practice", "練習(1問ずつ解説)"], ["exam", "模試(最後に採点・2.4分/問)"]]);
    h += chipGroup("問題数", "count", [[10, "10"], [20, "20"], [40, "40"], [75, "75"], [0, "全部"]]);
    h += chipGroup("対象", "filter", [["all", "すべて"], ["new", "未解答"], ["wrong", "要復習 (" + wrong + ")"], ["flag", "★付き (" + flagged + ")"]]);
    h += '</div>';
    var pool = buildPool();
    var n = prefs.count ? Math.min(prefs.count, pool.length) : pool.length;
    h += '<p class="muted small" id="pool-info">対象 ' + pool.length + ' 問から ' + n + ' 問を、選択したタスクに均等に配分して出題します。</p>';
    h += '<div class="actions"><button class="btn" data-act="start"' + (n ? "" : " disabled") + '>開始</button>';
    h += '<button class="btn secondary" data-act="reset">解答履歴をリセット</button></div></section>';

    app.innerHTML = h;
    window.scrollTo(0, 0);
  }

  function chipGroup(label, key, opts) {
    var h = '<div class="opt-group"><span>' + label + '</span>';
    opts.forEach(function (o) {
      h += '<button class="chip' + (prefs[key] === o[0] ? " on" : "") + '" data-pref="' + key + '" data-val=\'' + JSON.stringify(o[0]) + '\'>' + esc(o[1]) + '</button>';
    });
    return h + "</div>";
  }

  function buildPool() {
    var out = [];
    allTasks.forEach(function (t) {
      if (prefs.tasks.indexOf(t.id) < 0) return;
      t.questions.forEach(function (q) {
        var r = store.q[q.id];
        if (prefs.filter === "new" && r && r.n) return;
        if (prefs.filter === "wrong" && !(r && r.n && !r.last)) return;
        if (prefs.filter === "flag" && !(r && r.flag)) return;
        out.push(q);
      });
    });
    return out;
  }

  // 選択タスクに均等配分(ラウンドロビン)。各タスク内では未解答・不正解を優先
  function pick(pool, n) {
    var groups = {};
    pool.forEach(function (q) { (groups[q.task.id] = groups[q.task.id] || []).push(q); });
    var keys = shuffle(Object.keys(groups));
    keys.forEach(function (k) {
      groups[k] = shuffle(groups[k]).sort(function (a, b) { return priority(a) - priority(b); });
    });
    var out = [];
    while (out.length < n) {
      var added = false;
      for (var i = 0; i < keys.length && out.length < n; i++) {
        var g = groups[keys[i]];
        if (g.length) { out.push(g.shift()); added = true; }
      }
      if (!added) break;
    }
    return shuffle(out);
  }
  function priority(q) {
    var r = store.q[q.id];
    if (!r || !r.n) return 0;
    if (!r.last) return 1;
    return 2;
  }

  // ---------- quiz ----------
  var session = null;
  var timer = null;

  function start() {
    var pool = buildPool();
    var n = prefs.count ? Math.min(prefs.count, pool.length) : pool.length;
    var qs = pick(pool, n);
    session = {
      mode: prefs.mode,
      items: qs.map(function (q) {
        var order = q.c.map(function (_, i) { return i; });
        order = shuffle(order);
        return { q: q, order: order, sel: [], done: false, ok: null };
      }),
      i: 0,
      started: Date.now(),
      limit: prefs.mode === "exam" ? Math.round(qs.length * 2.4 * 60) : 0
    };
    clearInterval(timer);
    timer = setInterval(tick, 1000);
    renderQ();
  }

  function tick() {
    if (!session) { clearInterval(timer); return; }
    var sec = Math.floor((Date.now() - session.started) / 1000);
    var t = session.limit ? session.limit - sec : sec;
    var neg = t < 0; t = Math.abs(t);
    var s = (neg ? "-" : "") + Math.floor(t / 60) + ":" + ("0" + (t % 60)).slice(-2);
    info.textContent = (session.limit ? "残り " : "経過 ") + s;
  }

  function isCorrect(q, sel) {
    if (sel.length !== q.a.length) return false;
    return q.a.every(function (a) { return sel.indexOf(a) >= 0; });
  }

  function renderQ() {
    var it = session.items[session.i];
    var q = it.q;
    var n = session.items.length;
    var r = store.q[q.id] || {};
    var reveal = it.done && session.mode === "practice";
    var need = q.a.length;
    var h = '<section class="card">';
    h += '<div class="progress"><i style="width:' + pct(session.i, n) + '%"></i></div>';
    h += '<div class="qhead"><span>問題 ' + (session.i + 1) + ' / ' + n + ' <span class="tag">' + q.task.id + ' ' + esc(q.task.name) + '</span></span>';
    h += '<button class="flag' + (r.flag ? " on" : "") + '" data-act="flag">' + (r.flag ? "★ 付箋あり" : "☆ 付箋") + '</button></div>';
    h += '<p class="qtext">' + esc(q.q) + '</p>';
    if (need > 1) h += '<p class="multi-note">' + need + ' つ選択してください。</p>';
    it.order.forEach(function (ci, k) {
      var cls = "choice";
      if (reveal) {
        if (q.a.indexOf(ci) >= 0) cls += " correct";
        else if (it.sel.indexOf(ci) >= 0) cls += " wrong";
      } else if (it.sel.indexOf(ci) >= 0) cls += " sel";
      h += '<button class="' + cls + '" data-choice="' + ci + '"' + (reveal ? " disabled" : "") + '><span class="key">' + KEYS[k] + '.</span><span>' + esc(q.c[ci]) + '</span></button>';
    });
    if (reveal) {
      h += '<div class="verdict ' + (it.ok ? "ok" : "ng") + '">' + (it.ok ? "正解" : "不正解") + ' — 正答: ' + answerKeys(it) + '</div>';
      h += '<div class="explain">' + esc(explain(it)) + '</div>';
      h += '<p class="small"><a href="' + SAP.repo + q.task.note + '" target="_blank" rel="noopener">関連ノート: ' + q.task.id + ' ' + esc(q.task.name) + '</a> <span class="muted">(' + q.id + ')</span></p>';
    }
    h += '<div class="actions">';
    if (session.mode === "practice") {
      if (!it.done) h += '<button class="btn" data-act="answer"' + (it.sel.length === need ? "" : " disabled") + '>解答する</button>';
      else h += '<button class="btn" data-act="next">' + (session.i + 1 < n ? "次の問題" : "結果を見る") + '</button>';
    } else {
      if (session.i > 0) h += '<button class="btn secondary" data-act="prev">前へ</button>';
      h += '<button class="btn" data-act="next">' + (session.i + 1 < n ? "次へ" : "採点する") + '</button>';
    }
    h += '<button class="btn secondary" data-act="quit">中断して結果へ</button>';
    h += '</div></section>';
    app.innerHTML = h;
    window.scrollTo(0, 0);
  }

  // 解説中の「・A:」「・B/C:」は元の選択肢順で書かれているため、表示順の記号に置き換える
  function explain(it) {
    var lines = it.q.e.split("\n").map(function (line) {
      return line.replace(/^・([A-H](?:\/[A-H])*):/, function (_, keys) {
        var mapped = keys.split("/").map(function (k) { return KEYS[it.order.indexOf(KEYS.indexOf(k))]; }).sort();
        return "・" + mapped.join("/") + ":";
      });
    });
    var head = lines.filter(function (l) { return !/^・[A-H]/.test(l); });
    var bullets = lines.filter(function (l) { return /^・[A-H]/.test(l); }).sort();
    return head.concat(bullets).join("\n");
  }

  function answerKeys(it) {
    return it.q.a.map(function (a) { return KEYS[it.order.indexOf(a)]; }).sort().join(", ");
  }

  function grade(it) {
    if (it.done && session.mode === "practice") return;
    if (!it.sel.length) return;
    it.done = true;
    it.ok = isCorrect(it.q, it.sel);
    var r = rec(it.q.id);
    r.n++; if (it.ok) r.ok++; r.last = it.ok;
    save();
  }

  function finish() {
    if (session.mode === "exam") session.items.forEach(grade);
    clearInterval(timer);
    var res = session;
    var answered = res.items.filter(function (it) { return it.done; });
    var ok = answered.filter(function (it) { return it.ok; }).length;
    var sec = Math.floor((Date.now() - res.started) / 1000);
    info.textContent = "全 " + total + " 問";
    var h = '<section class="card"><h1>結果</h1>';
    h += '<div class="score">' + pct(ok, res.items.length) + '%</div>';
    h += '<p class="muted">' + ok + ' / ' + res.items.length + ' 問正解(未解答 ' + (res.items.length - answered.length) + ')・所要 ' + Math.floor(sec / 60) + ' 分 ' + (sec % 60) + ' 秒。本番の合格ラインは概ね正答率 72〜75% が目安です。</p>';
    var per = {};
    res.items.forEach(function (it) {
      var p = per[it.q.task.id] = per[it.q.task.id] || { t: it.q.task, n: 0, ok: 0 };
      p.n++; if (it.ok) p.ok++;
    });
    h += '<table><tr><th>タスク</th><th class="num">正解</th><th class="num">率</th></tr>';
    Object.keys(per).sort().forEach(function (k) {
      var p = per[k];
      h += '<tr><td>' + k + ' ' + esc(p.t.name) + '</td><td class="num">' + p.ok + '/' + p.n + '</td><td class="num">' + pct(p.ok, p.n) + '%</td></tr>';
    });
    h += '</table><div class="actions"><button class="btn" data-act="home">トップへ</button><button class="btn secondary" data-act="retry-wrong">この回の間違いを解き直す</button></div></section>';

    var wrongs = res.items.filter(function (it) { return !it.ok; });
    if (wrongs.length) {
      h += '<section class="card"><h2>間違えた問題の解説</h2>';
      wrongs.forEach(function (it) {
        var q = it.q;
        h += '<div class="review-item"><div class="qhead"><span class="tag">' + q.task.id + '</span><span class="muted">' + q.id + '</span></div>';
        h += '<details><summary>' + esc(q.q.length > 90 ? q.q.slice(0, 90) + "…" : q.q) + '</summary><p class="qtext">' + esc(q.q) + '</p>';
        it.order.forEach(function (ci, k) {
          var cls = "choice";
          if (q.a.indexOf(ci) >= 0) cls += " correct"; else if (it.sel.indexOf(ci) >= 0) cls += " wrong";
          h += '<div class="' + cls + '"><span class="key">' + KEYS[k] + '.</span><span>' + esc(q.c[ci]) + '</span></div>';
        });
        h += '<div class="explain">' + esc(explain(it)) + '</div></details>';
        h += '<p class="small">あなたの解答: ' + (it.sel.length ? it.sel.map(function (s) { return KEYS[it.order.indexOf(s)]; }).sort().join(", ") : "未解答") + ' / 正答: ' + answerKeys(it) + '</p></div>';
      });
      h += '</section>';
    }
    app.innerHTML = h;
    window.scrollTo(0, 0);
    lastWrong = wrongs.map(function (it) { return it.q; });
    session = null;
  }
  var lastWrong = [];

  // ---------- events ----------
  app.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-act],[data-pref],[data-choice]");
    if (!el) return;
    if (el.hasAttribute("data-pref")) {
      prefs[el.getAttribute("data-pref")] = JSON.parse(el.getAttribute("data-val"));
      store.prefs = prefs; save(); renderHome(); return;
    }
    if (el.hasAttribute("data-choice")) {
      var it = session.items[session.i];
      var ci = +el.getAttribute("data-choice");
      var need = it.q.a.length;
      if (need === 1) it.sel = [ci];
      else {
        var at = it.sel.indexOf(ci);
        if (at >= 0) it.sel.splice(at, 1);
        else if (it.sel.length < need) it.sel.push(ci);
      }
      if (session.mode === "exam") it.done = false;
      renderQ(); return;
    }
    var act = el.getAttribute("data-act");
    if (act === "all" || act === "none") {
      prefs.tasks = act === "all" ? allTasks.map(function (t) { return t.id; }) : [];
      store.prefs = prefs; save(); renderHome();
    } else if (act === "start") start();
    else if (act === "reset") {
      if (confirm("解答履歴と付箋をすべて消去します。よろしいですか?")) { store.q = {}; save(); renderHome(); }
    } else if (act === "answer") { grade(session.items[session.i]); renderQ(); }
    else if (act === "next") {
      if (session.i + 1 < session.items.length) { session.i++; renderQ(); } else finish();
    } else if (act === "prev") { session.i--; renderQ(); }
    else if (act === "quit") finish();
    else if (act === "home") renderHome();
    else if (act === "flag") {
      var r = rec(session.items[session.i].q.id); r.flag = !r.flag; save(); renderQ();
    } else if (act === "retry-wrong") {
      if (!lastWrong.length) { renderHome(); return; }
      session = {
        mode: "practice",
        items: shuffle(lastWrong).map(function (q) {
          var order = q.c.map(function (_, i) { return i; });
          return { q: q, order: shuffle(order), sel: [], done: false, ok: null };
        }),
        i: 0, started: Date.now(), limit: 0
      };
      clearInterval(timer); timer = setInterval(tick, 1000); renderQ();
    }
  });
  app.addEventListener("change", function (ev) {
    var el = ev.target;
    if (el.hasAttribute("data-task")) {
      var id = el.getAttribute("data-task");
      prefs.tasks = prefs.tasks.filter(function (x) { return x !== id; });
      if (el.checked) prefs.tasks.push(id);
    } else if (el.hasAttribute("data-domain")) {
      var d = SAP.domains.filter(function (x) { return x.id === el.getAttribute("data-domain"); })[0];
      var ids = d.tasks.map(function (t) { return t.id; });
      prefs.tasks = prefs.tasks.filter(function (x) { return ids.indexOf(x) < 0; });
      if (el.checked) prefs.tasks = prefs.tasks.concat(ids);
    } else return;
    store.prefs = prefs; save(); renderHome();
  });
  document.getElementById("home-link").addEventListener("click", function (ev) {
    ev.preventDefault();
    if (session && !confirm("演習を中断してトップに戻りますか?")) return;
    clearInterval(timer); renderHome();
  });
  document.addEventListener("keydown", function (ev) {
    if (!session || ev.target.tagName === "INPUT") return;
    var k = ev.key.toUpperCase();
    var idx = KEYS.indexOf(k);
    if (idx >= 0 && idx < session.items[session.i].order.length) {
      var btn = app.querySelector('[data-choice="' + session.items[session.i].order[idx] + '"]');
      if (btn && !btn.disabled) btn.click();
    } else if (ev.key === "Enter") {
      var b = app.querySelector('[data-act="answer"]:not([disabled]),[data-act="next"]');
      if (b) b.click();
    }
  });

  renderHome();
})();
