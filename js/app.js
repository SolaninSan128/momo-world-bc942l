/* momo 的小天地 · 前端（纯静态，无依赖）。数据在 data/episodes.json */
(function () {
  var APP = document.getElementById('app');
  var CFG = window.MOMO_CONFIG, ART = window.MomoArt;
  var DATA = null, heroTimer = null, heroIdx = 0;
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function show(id) { return DATA.shows.filter(function (s) { return s.id === id; })[0]; }
  function group(s, gid) { return s.groups.filter(function (g) { return String(g.id) === String(gid); })[0]; }
  function firstReady(s) { return s.groups.filter(function (g) { return g.status === 'ready'; })[0]; }
  function cnt(g) { return g.count == null ? '连载中' : '共' + g.count + '集'; }
  function unit(s) { return s.unitName === '季' ? '季' : '系列'; }

  /* ---------- 通用片段 ---------- */
  function topbar(home) {
    return '<header class="topbar">' +
      (home ? '' : '<a class="btn btn-home" href="#/" aria-label="回到首页">🏠 回家</a>') +
      '<div class="brand"><span class="logo">🐷</span><span>momo 的小天地</span></div></header>';
  }
  function miniArt(sid) { return ART.forShow(sid, 70, 'mini').replace('class="mascot mini"', 'class="mini"'); }

  function epChip(s, g, e) {
    return '<a class="card ep-chip" href="#/watch/' + s.id + '/' + g.id + '/' + e.n + '">' +
      '<div class="thumb ' + s.id + '"><span class="no">' + e.n + '</span>' + miniArt(s.id) + '</div>' +
      '<div class="nm">' + esc(e.title) + '</div></a>';
  }
  function numGrid(s, g, cur) {
    var h = '<div class="grid" role="list">';
    g.episodes.forEach(function (e) {
      h += '<a class="num' + (e.n === cur ? ' on' : '') + '" role="listitem" aria-label="第' + e.n + '集 ' + esc(e.title) + '" href="#/watch/' + s.id + '/' + g.id + '/' + e.n + '">' + e.n + '</a>';
    });
    return h + '</div>';
  }
  function tabs(s, curGid, mode) {
    var h = '<div class="tabs" role="tablist">';
    s.groups.forEach(function (g) {
      var href = mode === 'watch' && g.status === 'ready' ? '#/watch/' + s.id + '/' + g.id + '/1' : '#/show/' + s.id + '/' + g.id;
      h += '<a class="tab' + (String(g.id) === String(curGid) ? ' on' : '') + (g.status !== 'ready' ? ' later' : '') + '" role="tab" href="' + href + '">' + esc(g.label) +
        (g.status !== 'ready' ? '<span class="badge">快来啦</span>' : '') + '</a>';
    });
    return h + '</div>';
  }
  function laterPanel(s, g) {
    return '<div class="later-panel">' + ART.truck(120) + '<h3>' + esc(g.label) + ' 快来啦～</h3><p>' +
      (g.count != null ? cnt(g) + '，' : '') + '故事们正在路上，等一等哦。</p></div>';
  }
  function playBtn(s, g, e) {
    return '<button class="btn btn-sun" type="button" data-play="' + s.id + '|' + g.id + '|' + e.n + '" aria-label="播放第' + e.n + '集">▶ <span class="t">播放</span></button>';
  }
  function epCards(s, g) {
    var h = '<div class="eps">';
    g.episodes.forEach(function (e) {
      h += '<div class="card ep-card"><a class="no" href="#/watch/' + s.id + '/' + g.id + '/' + e.n + '" aria-label="打开第' + e.n + '集">' + e.n + '</a>' +
        '<a class="mid" href="#/watch/' + s.id + '/' + g.id + '/' + e.n + '"><h3>' + esc(e.title) + '</h3><p>' + (e.plot ? esc(e.plot) : '小故事马上补上～') + '</p></a>' +
        playBtn(s, g, e) + '</div>';
    });
    return h + '</div>';
  }

  /* ---------- 首页 ---------- */
  var SLIDES = [
    { id: 'peppa', tag: '❤️ momo 最爱', title: '小猪佩奇', sub: '一起去跳泥坑吧！', cls: 'peppa' },
    { id: 'ultraman', tag: '⭐ momo 最爱', title: '奥特曼', sub: '光之英雄，出发！', cls: 'ultraman' }
  ];
  function homeView() {
    var h = topbar(true);
    h += '<div class="hello">' + ART.sun(64) + '<h1><em>momo</em>，今天想看什么？</h1></div>';
    h += '<section class="hero" aria-roledescription="轮播" aria-label="今日推荐"><div class="slides" id="slides">';
    SLIDES.forEach(function (sl) {
      h += '<div class="slide ' + sl.cls + '"><div class="txt"><span class="tag">' + sl.tag + '</span><h2>' + sl.title + '</h2><p>' + sl.sub + '</p>' +
        '<a class="btn btn-big ' + (sl.id === 'peppa' ? 'btn-pink' : 'btn-sky') + '" href="#/show/' + sl.id + '">进去看看 ▶</a></div>' +
        '<div class="c1">' + ART.cloud(90) + '</div><div class="c2">' + ART.cloud(70) + '</div>' +
        '<div class="st" style="left:46%;top:70%">' + ART.star(26) + '</div><div class="st" style="left:88%;top:10%;animation-delay:1.5s">' + ART.star(20, '#FFF0A0') + '</div>' +
        '<div class="art">' + ART.forShow(sl.id, 300) + '</div></div>';
    });
    h += '</div><button class="hero-arrow prev" type="button" data-hero="-1" aria-label="上一个">‹</button><button class="hero-arrow next" type="button" data-hero="1" aria-label="下一个">›</button>' +
      '<div class="dots">' + SLIDES.map(function (_, i) { return '<button class="dot" type="button" data-dot="' + i + '" aria-label="第' + (i + 1) + '张"></button>'; }).join('') + '</div></section>';

    h += '<section class="shelf"><div class="shelf-h"><h2>🏠 选一个看看</h2></div><div class="big-cards">' +
      DATA.shows.map(function (s) {
        return '<a class="card big-card ' + s.id + '" href="#/show/' + s.id + '">' + ART.forShow(s.id, 190) + '<h3>' + esc(s.title) + '</h3><span>' + esc(s.kidIntro) + '</span></a>';
      }).join('') + '</div></section>';

    DATA.shows.forEach(function (s) {
      s.groups.filter(function (g) { return g.status === 'ready'; }).slice(0, s.id === 'peppa' ? 1 : 2).forEach(function (g) {
        h += '<section class="shelf"><div class="shelf-h"><h2>' + (s.id === 'peppa' ? '🐷 ' : '⭐ ') + esc(s.title) + ' · ' + esc(g.label) + '</h2>' +
          '<a class="more" href="#/show/' + s.id + '/' + g.id + '">全部 ›</a></div><div class="row">' +
          g.episodes.slice(0, 12).map(function (e) { return epChip(s, g, e); }).join('') + '</div></section>';
      });
    });

    h += '<section class="shelf"><div class="shelf-h"><h2>🎈 马上就有</h2></div><div class="soon-row">' +
      [['🎧', '听故事'], ['📖', '读绘本'], ['🎮', '玩游戏']].map(function (x) {
        return '<div class="soon" aria-disabled="true"><div class="ico">' + x[0] + '</div><b>' + x[1] + '</b><i>快来啦</i></div>';
      }).join('') + '</div></section>';
    h += '<div class="footer">给爸爸妈妈：<a href="#/parent">资料来源与说明</a></div>';
    APP.innerHTML = h;
    startHero();
  }
  function startHero() {
    heroIdx = 0; setHero(0);
    stopHero();
    if (!reduceMotion) heroTimer = setInterval(function () { setHero(heroIdx + 1); }, 7000);
    var el = document.querySelector('.hero'), sx = null;
    el.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; stopHero(); }, { passive: true });
    el.addEventListener('touchend', function (e) { if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) setHero(heroIdx + (dx < 0 ? 1 : -1)); sx = null; }, { passive: true });
  }
  function stopHero() { if (heroTimer) { clearInterval(heroTimer); heroTimer = null; } }
  function setHero(i) {
    var n = SLIDES.length; heroIdx = (i + n) % n;
    var sl = document.getElementById('slides'); if (!sl) return;
    sl.style.transform = 'translateX(-' + (heroIdx * 100) + '%)';
    [].forEach.call(document.querySelectorAll('.dot'), function (d, k) { d.classList.toggle('on', k === heroIdx); });
  }

  /* ---------- 详情页 ---------- */
  function detailView(sid, gid) {
    var s = show(sid); if (!s) return notFound();
    var g = gid ? group(s, gid) : firstReady(s); if (!g) g = firstReady(s);
    var fr = firstReady(s);
    var h = topbar(false) + '<div class="show-' + s.id + '">';
    h += '<section class="detail-top"><div class="cover ' + s.id + '">' +
      '<span class="cloud" style="left:6%;top:10%">' + ART.cloud(90) + '</span><span class="cloud" style="right:6%;top:30%">' + ART.cloud(70) + '</span>' +
      ART.forShow(s.id, 260) + '</div><div class="info"><h1>' + esc(s.title) + '</h1><div class="sub">' + esc(s.subtitle) + '</div>' +
      '<p class="intro">' + esc(s.kidIntro) + '</p><div class="pills"><span class="pill">共 ' + s.groups.length + ' ' + unit(s) + '</span>' +
      '<span class="pill">' + s.groups.filter(function (x) { return x.status === 'ready'; }).length + ' ' + unit(s) + '已摆好</span></div>' +
      '<a class="btn btn-big ' + (s.id === 'peppa' ? 'btn-pink' : 'btn-sky') + '" href="#/watch/' + s.id + '/' + fr.id + '/1">▶ 立即播放</a></div></section>';

    h += '<div class="section-t"><h2>📺 选' + (s.unitName === '季' ? '季' : '系列') + '、选集</h2><small>' + esc(g.label) + (g.year ? ' · ' + esc(g.year) : '') + ' · ' + cnt(g) + '</small></div>';
    h += tabs(s, g.id, 'detail');
    if (g.status === 'ready') {
      if (g.intro) h += '<p style="font-weight:800;margin:0 0 10px">' + esc(g.intro) + '</p>';
      h += numGrid(s, g, 1) + '<div class="section-t"><h2>🎬 一集一集看</h2></div>' + epCards(s, g);
    } else h += laterPanel(s, g);
    h += '</div><div class="footer"><a href="#/parent">给爸爸妈妈：资料来源与说明</a></div>';
    APP.innerHTML = h;
  }

  /* ---------- 播放页 ---------- */
  function watchView(sid, gid, n) {
    var s = show(sid), g = s && group(s, gid); if (!g) return notFound();
    if (g.status !== 'ready') { location.replace('#/show/' + sid + '/' + gid); return; }
    var e = g.episodes.filter(function (x) { return x.n === +n; })[0] || g.episodes[0];
    var url = CFG.buildPlayUrl(s, g, e);
    var prev = g.episodes[e.n - 2], next = g.episodes[e.n];
    var h = topbar(false) + '<div class="show-' + s.id + '"><div class="watch"><div class="main">';
    h += '<div class="player" id="player">' + (url ? '<video controls playsinline src="' + esc(url) + '"></video>' :
      '<span class="cloud" style="left:8%;top:10%">' + ART.cloud(100) + '</span><span class="cloud" style="right:6%;top:24%;animation-delay:-12s">' + ART.cloud(80) + '</span><div class="hill"></div>' +
      ART.forShow(s.id, 160) + '<button class="play-btn" type="button" data-play="' + s.id + '|' + g.id + '|' + e.n + '" aria-label="播放">▶</button>' +
      '<div class="cap">第 ' + e.n + ' 集 · ' + esc(e.title) + '</div>') + '</div>';
    h += '<div class="now"><h1>第 ' + e.n + ' 集 · ' + esc(e.title) + '</h1><div class="where">' + esc(s.title) + ' · ' + esc(g.label) + '</div><p>' + (e.plot ? esc(e.plot) : '小故事马上补上～') + '</p>' +
      '<div class="pn">' +
      (prev ? '<a class="btn btn-big" href="#/watch/' + s.id + '/' + g.id + '/' + prev.n + '">‹ 上一集</a>' : '') +
      (next ? '<a class="btn btn-big btn-sun" href="#/watch/' + s.id + '/' + g.id + '/' + next.n + '">下一集 ›</a>' : '') +
      '<a class="btn btn-big" href="#/show/' + s.id + '/' + g.id + '">📺 全部集</a></div></div></div>';

    h += '<aside class="side"><div class="panel"><h2>📺 选集</h2>' + tabs(s, g.id, 'watch') + numGrid(s, g, e.n) + '</div>';
    h += '<div class="panel"><h2>💛 相关推荐</h2><div class="rec">';
    s.groups.filter(function (x) { return x.status === 'ready' && x !== g; }).slice(0, 2).forEach(function (x) {
      h += '<a class="card rec-card" href="#/watch/' + s.id + '/' + x.id + '/1"><div class="th ' + s.id + '">' + ART.forShow(s.id, 60).replace('class="mascot ', 'class="') + '</div><div><b>' + esc(s.title) + ' · ' + esc(x.label) + '</b><small>' + cnt(x) + '</small></div></a>';
    });
    DATA.shows.filter(function (o) { return o.id !== s.id; }).forEach(function (o) {
      var og = firstReady(o);
      h += '<a class="card rec-card" href="#/show/' + o.id + '"><div class="th ' + o.id + '">' + ART.forShow(o.id, 60).replace('class="mascot ', 'class="') + '</div><div><b>' + esc(o.title) + '</b><small>' + esc(og.label) + ' · ' + cnt(og) + '</small></div></a>';
    });
    h += '</div></div></aside></div></div>';
    APP.innerHTML = h;
  }

  /* ---------- 家长页 ---------- */
  function parentView() {
    var h = topbar(false) + '<div class="parent"><h1>给爸爸妈妈 · 资料来源与说明</h1><p>' + esc(DATA.app.notice) + ' 这个页面孩子看不懂，所以放得比较隐蔽。</p>';
    DATA.shows.forEach(function (s) {
      h += '<h2>' + esc(s.title) + '</h2><ul>';
      s.groups.forEach(function (g) {
        var withPlot = g.episodes.filter(function (e) { return e.plot; }).length;
        h += '<li>' + esc(g.label) + (g.year ? '（' + esc(g.year) + '）' : '') + '：' + cnt(g) + (g.status === 'ready' ? '；已收录 ' + g.episodes.length + ' 集片名，其中 ' + withPlot + ' 集有一句话剧情' + (withPlot < g.episodes.length ? '，其余待核实' : '') : '；集列表后续添加') + '</li>';
      });
      h += '</ul><h2>来源</h2><ul>' + s.sources.map(function (x) { return '<li><a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(x.label) + '</a></li>'; }).join('') + '</ul>';
      h += '<h2>备注</h2><ul>' + s.notes.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    });
    h += '<h2>以后怎么接视频</h2><p>在 <code>js/config.js</code> 里把 <code>PLAY_BASE</code> 改成播放入口前缀，并在 <code>data/episodes.json</code> 的每一集填上 <code>path</code>。令牌、密码、服务器地址只放服务器端，不写进网页。</p></div>';
    APP.innerHTML = h;
  }
  function notFound() { APP.innerHTML = topbar(false) + '<div class="later-panel">' + ART.truck(120) + '<h3>这里还没有哦～</h3><p>点“回家”看看别的吧。</p></div>'; }

  /* ---------- 弹窗与事件 ---------- */
  var modal = document.getElementById('modal');
  function openModal() {
    document.getElementById('modal-title').textContent = CFG.COMING_TEXT;
    document.getElementById('modal-art').innerHTML = ART.truck(130);
    modal.hidden = false; document.getElementById('modal-ok').focus();
  }
  function closeModal() { modal.hidden = true; }
  document.getElementById('modal-ok').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-play],[data-hero],[data-dot]'); if (!t) return;
    if (t.hasAttribute('data-play')) {
      var p = t.getAttribute('data-play').split('|'), s = show(p[0]), g = group(s, p[1]), ep = g.episodes.filter(function (x) { return x.n === +p[2]; })[0];
      var url = CFG.buildPlayUrl(s, g, ep);
      if (url) { location.hash = '#/watch/' + s.id + '/' + g.id + '/' + ep.n; } else openModal();
    } else if (t.hasAttribute('data-hero')) { stopHero(); setHero(heroIdx + +t.getAttribute('data-hero')); }
    else { stopHero(); setHero(+t.getAttribute('data-dot')); }
  });

  /* ---------- 路由 ---------- */
  function route() {
    stopHero(); closeModal();
    var parts = (location.hash.replace(/^#\/?/, '') || '').split('/').filter(Boolean).map(decodeURIComponent);
    if (!DATA) return;
    if (!parts.length) homeView();
    else if (parts[0] === 'show') detailView(parts[1], parts[2]);
    else if (parts[0] === 'watch') watchView(parts[1], parts[2], parts[3]);
    else if (parts[0] === 'parent') parentView();
    else notFound();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);

  function boot(d) { DATA = d; document.title = d.app.name; route(); }
  fetch('data/episodes.json').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(boot)
    .catch(function () { boot(window.MOMO_DATA_FALLBACK); });  // 直接双击打开(file://)时用备用数据
})();
