/* 들살이 — 서브 페이지 공통 스크립트 */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var IMG = window.IMG || {};
  function src(h) { return 'img/' + (IMG[h] || h + '.jpg'); }
  function won(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function stars(r, n) {
    return '<div class="stars"><span class="st" aria-hidden="true">★★★★★<span style="width:' + (r / 5 * 100) + '%">★★★★★</span></span><b>' + r.toFixed(1) + '</b><em>후기 ' + n + '</em></div>';
  }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  var P = window.PRODUCTS || [];
  function byId(id) { for (var i = 0; i < P.length; i++) if (P[i].id == id) return P[i]; return P[0]; }

  function card(p, o) {
    o = o || {};
    var wish = (store('mc_wish') || P.filter(function (x) { return x.wish; }).map(function (x) { return x.id; })).indexOf(p.id) > -1;
    var tags = '<p class="tag">무료배송</p>' + (p.out ? '<p class="tag out">품절</p>' : p.disc ? '' : '');
    return '<article class="pc2" data-id="' + p.id + '">' +
      '<div class="th' + (p.fit ? ' fit' : '') + '"><img src="' + src(p.img) + '" alt="' + esc(p.name) + '" loading="lazy"><div class="tags">' + tags + '</div></div>' +
      '<div class="info"><div class="top"><p class="brand">' + esc(p.brand) + '</p><div class="acts' + (wish ? ' has-wish' : '') + '">' +
      '<button type="button" class="ms wish' + (wish ? ' on' : '') + '" data-act="wish" aria-label="찜하기" aria-pressed="' + wish + '">favorite</button>' +
      '<button type="button" class="ms" data-act="cart" aria-label="장바구니 담기">shopping_bag</button></div></div>' +
      '<div><p class="nm"><a href="detail.html?id=' + p.id + '">' + esc(p.name) + '</a></p><p class="spec">' + esc(p.spec) + '</p></div>' +
      (o.compact ? '' : '<div><div class="dim"><b>' + p.kg.toFixed(1) + ' kg</b><i></i><span>수납 ' + p.pack + ' cm</span></div>' +
      '<div class="fits"><span class="fit' + (p.trunk ? '' : ' over') + '">' + (p.trunk ? '트렁크 적합' : '트렁크 초과') + '</span><span class="fit' + (p.deck ? '' : ' no') + '">' + (p.deck ? '내 데크 가능' : '내 데크 초과') + '</span></div></div>') +
      '<div><div class="pr">' + (p.disc ? '<span class="d">' + p.disc + '%</span>' : '') + '<span class="p">' + won(p.price) + '</span>' + (p.orig && p.disc ? '<s>' + won(p.orig) + '</s>' : '') + '</div>' + stars(p.rate, p.rev) + '</div>' +
      '</div></article>';
  }

  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove('on'); }, 1800);
  }
  function cartAdd(id, qty) {
    var c = store('mc_cart') || [];
    var f = c.filter(function (x) { return x.id == id; })[0];
    if (f) f.qty += qty || 1; else c.push({ id: +id, qty: qty || 1, on: true });
    store('mc_cart', c); toast('장바구니에 담았습니다.');
  }
  window.MC = { $: $, $$: $$, src: src, won: won, esc: esc, card: card, stars: stars, store: store, byId: byId, toast: toast, cartAdd: cartAdd, P: P };

  /* card actions */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.pc2 [data-act]'); if (!b) return;
    e.preventDefault();
    var id = +b.closest('.pc2').getAttribute('data-id');
    if (b.dataset.act === 'wish') {
      var w = store('mc_wish') || P.filter(function (x) { return x.wish; }).map(function (x) { return x.id; });
      var i = w.indexOf(id); if (i > -1) w.splice(i, 1); else w.push(id);
      store('mc_wish', w); b.classList.toggle('on', i < 0); b.setAttribute('aria-pressed', i < 0); b.parentNode.classList.toggle('has-wish', i < 0);
      toast(i < 0 ? '찜 목록에 추가했습니다.' : '찜 목록에서 삭제했습니다.');
    } else if (b.dataset.act === 'cart') cartAdd(id, 1);
  });

  /* generic sheets: [data-sheet=id] opens #id */
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-sheet]');
    if (o) { var s = document.getElementById(o.dataset.sheet); if (s) { s.classList.add('on'); e.preventDefault(); } return; }
    if (e.target.closest('.sheet .x') || e.target.classList.contains('dim')) { var sh = e.target.closest('.sheet'); if (sh) sh.classList.remove('on'); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $$('.sheet.on').forEach(function (s) { s.classList.remove('on'); }); });

  document.addEventListener('click', function (e) { var c = e.target.closest('.sheet .chip2'); if (c) c.classList.toggle('on'); });

  /* LNB active */
  var here = (location.pathname.split('/').pop() || 'index.html');
  $$('.lnb a').forEach(function (a) { if (a.getAttribute('href') === here || (here === 'mypage.html' && a.getAttribute('href') === 'orders.html')) a.classList.add('on'); });
  $$('.cstabs a').forEach(function (a) { var h = a.getAttribute('href'); if (h === here || (here === 'notice-view.html' && h === 'notice.html') || (here === 'qna-write.html' && h === 'qna.html')) a.classList.add('on'); });
  /* chip select groups */
  document.addEventListener('click', function (e) { var b = e.target.closest('.chipsel button'); if (!b) return; var g = b.parentNode; if (g.dataset.multi) { b.classList.toggle('on'); return; } $$('button', g).forEach(function (x) { x.classList.toggle('on', x === b); }); });
  /* tabs2 with panels: [data-tab=id] */
  document.addEventListener('click', function (e) { var t = e.target.closest('.tabs2 [data-tab]'); if (!t) return; e.preventDefault(); $$('[data-tab]', t.parentNode).forEach(function (x) { x.classList.toggle('on', x === t); var pn = document.getElementById(x.dataset.tab); if (pn) pn.hidden = x !== t; }); });
  /* simple forms: data-go=url → validate required then go */
  $$('form[data-go]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = $$('[required]', f).filter(function (i) { return i.type === 'checkbox' ? !i.checked : !i.value.trim(); });
      $$('.err', f).forEach(function (i) { i.classList.remove('err'); });
      $$('.js-errmsg', f).forEach(function (m) { m.hidden = true; });
      if (bad.length) { bad.forEach(function (i) { i.classList.add('err'); var m = i.parentNode.querySelector('.js-errmsg') || (i.closest('.fl') && i.closest('.fl').querySelector('.js-errmsg')); if (m) m.hidden = false; }); bad[0].focus(); toast(f.dataset.msg || '필수 항목을 입력해 주세요.'); return; }
      if (f.dataset.go === 'toast') { toast(f.dataset.ok || '저장했습니다.'); return; }
      location.href = f.dataset.go;
    });
  });
  /* password visibility */
  document.addEventListener('click', function (e) { var b = e.target.closest('.js-eye'); if (!b) return; var i = b.closest('.pwbox').querySelector('input'); var s = i.type === 'password'; i.type = s ? 'text' : 'password'; b.textContent = s ? 'visibility' : 'visibility_off'; });
  document.addEventListener('click', function (e) { var b = e.target.closest('.js-clear'); if (!b) return; var i = b.closest('.pwbox').querySelector('input'); i.value = ''; i.focus(); });
  /* toast buttons */
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-toast]'); if (b) { e.preventDefault(); toast(b.dataset.toast); var sh = b.closest('.sheet'); if (sh) sh.classList.remove('on'); } });

  /* product grids */
  $$('[data-grid]').forEach(function (g) {
    var n = +g.dataset.grid || 16, list = P.slice(0, n);
    g.innerHTML = list.map(function (p) { return card(p); }).join('');
  });

  /* list page */
  var lp = $('[data-page=list]');
  if (lp) {
    var qs = new URLSearchParams(location.search), grid = $('.pgrid', lp), state = { sub: '전체', sort: qs.get('sort') === 'new' ? '신상품순' : '추천순', myfit: !qs.get('brand'), brand: qs.get('brand') };
    function draw() {
      var l = P.filter(function (p) { return (state.brand ? p.brand === state.brand : p.id <= 16) && (state.sub === '전체' || p.sub === state.sub) && (!state.myfit || p.trunk); });
      var s = state.sort;
      if (s === '낮은 가격순') l.sort(function (a, b) { return a.price - b.price; });
      else if (s === '높은 가격순') l.sort(function (a, b) { return b.price - a.price; });
      else if (s === '가벼운 순') l.sort(function (a, b) { return a.kg - b.kg; });
      else if (s === '신상품순') l.sort(function (a, b) { return b.id - a.id; });
      grid.innerHTML = l.length ? l.map(function (p) { return card(p); }).join('') : '<p style="grid-column:1/-1;padding:80px 0;text-align:center;color:#6b6988">조건에 맞는 상품이 없습니다. 다른 카테고리를 선택해 주세요.</p>';
      $$('.js-count', lp).forEach(function (c) { c.textContent = (state.sub === '전체' && !state.brand ? 248 : l.length) + '개'; });
      $$('.js-sortlabel', lp).forEach(function (c) { c.textContent = s; });
    }
    $$('.cats .chip2', lp).forEach(function (c) {
      c.addEventListener('click', function () {
        $$('.cats .chip2', lp).forEach(function (x) { x.classList.toggle('on', x === c); x.setAttribute('aria-pressed', x === c); });
        state.sub = c.textContent.trim(); draw();
      });
    });
    $$('[data-sort]', lp).forEach(function (b) {
      b.addEventListener('click', function () {
        state.sort = b.dataset.sort;
        $$('[data-sort]').forEach(function (x) { x.classList.toggle('on', x.dataset.sort === state.sort); });
        var sh = b.closest('.sheet'); if (sh) sh.classList.remove('on');
        draw();
      });
    });
    $$('.js-myfit', lp).forEach(function (c) { c.addEventListener('change', function () { state.myfit = c.checked; $$('.js-myfit').forEach(function (x) { x.checked = c.checked; }); draw(); }); });
    $$('.fsel', lp).forEach(function (f) {
      f.addEventListener('click', function () {
        var pnl = $('#fp-' + f.dataset.f), on = !f.classList.contains('on');
        $$('.fsel', lp).forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-expanded', 'false'); });
        $$('.fpanel', lp).forEach(function (x) { x.classList.remove('on'); });
        if (on && pnl) { f.classList.add('on'); f.setAttribute('aria-expanded', 'true'); pnl.classList.add('on'); }
      });
    });
    $$('.fpanel .chip2', lp).forEach(function (c) { c.addEventListener('click', function () { c.classList.toggle('on'); }); });
    $$('.pager [data-pg]', lp).forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        $$('.pager [data-pg]', lp).forEach(function (x) { x.classList.toggle('on', x === a); });
        window.scrollTo({ top: lp.offsetTop, behavior: 'smooth' });
      });
    });
    draw();
  }
})();
