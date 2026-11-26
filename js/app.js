/* 들살이 MYCAMPING — interactions */
(function () {
  'use strict';
  var IMG = window.IMG || {};
  var src = function (h) { return 'img/' + (IMG[h] || h + '.jpg'); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* PC layout zoom between 768px and 1240px */
  function fitPc() {
    var w = window.innerWidth;
    document.documentElement.style.setProperty('--pcz', w >= 768 && w < 1240 ? (w / 1240).toFixed(4) : 1);
  }
  fitPc(); window.addEventListener('resize', fitPc);

  /* Billboard: background slides, fixed copy, 4s autoplay, loop */
  $$('[data-js=billboard]').forEach(function (bb) {
    var track = $('.bb-track', bb), slides = $$('.bb-slide', bb), cur = $('.bb-cur', bb);
    if (!track || slides.length < 2) return;
    var i = 0, n = slides.length, timer;
    function go(k) {
      i = (k + n) % n;
      track.style.transform = 'translate3d(' + (-Math.round(bb.clientWidth) * i) + 'px,0,0)';
      if (cur) cur.textContent = ('0' + (i + 1)).slice(-2);
    }
    window.addEventListener('resize', function () { track.style.transition = 'none'; go(i); void track.offsetWidth; track.style.transition = ''; });
    function play() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 4000); }
    var sx = null;
    bb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    bb.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); play(); } });
    bb.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b) return;
      if (b.dataset.act === 'bb-prev') { go(i - 1); play(); }
      if (b.dataset.act === 'bb-next') { go(i + 1); play(); }
    });
    play();
  });

  /* Promo strip close */
  $$('[data-n=close_promo]').forEach(function (b) {
    b.style.cursor = 'pointer';
    b.addEventListener('click', function () { var s = b.closest('[data-n="프로모션_띠"]'); if (s) s.remove(); });
  });

  /* Toggle switch */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.toggle');
    if (t) t.classList.toggle('on');
  });

  /* Chip bars & rank tabs (single select) */
  document.addEventListener('click', function (e) {
    var c = e.target.closest('.chip');
    if (c) {
      var bar = c.parentElement;
      $$('.chip', bar).forEach(function (x) {
        var on = x === c;
        x.classList.toggle('on', on);
        x.style.background = on ? '#14123a' : '#fff';
        x.style.border = on ? '0' : '1px solid #dcdaec';
        var p = $('p', x); if (p) p.style.color = on ? '#fff' : '#4a4868';
      });
    }
    var r = e.target.closest('[data-act=rank]');
    if (r) {
      $$('[data-act=rank]', r.parentElement).forEach(function (x) {
        var on = x === r;
        x.style.borderBottom = on ? '2px solid #14123a' : '0';
        var p = $('p', x); if (p) p.style.color = on ? '#14123a' : '#9d9bb8';
      });
    }
  });

  /* Sort dropdown */
  $$('.sort').forEach(function (s) {
    var opts = ['판매량 순', '신상품 순', '낮은 가격 순', '높은 가격 순', '후기 많은 순'];
    var m = document.createElement('div');
    m.className = 'sort-menu';
    var val = $('.sort-val', s);
    opts.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = o;
      if (val && val.textContent.trim() === o) b.className = 'on';
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        if (val) val.textContent = o;
        $$('button', m).forEach(function (x) { x.classList.toggle('on', x === b); });
        s.classList.remove('open');
      });
      m.appendChild(b);
    });
    s.appendChild(m);
    s.addEventListener('click', function () { s.classList.toggle('open'); });
  });
  document.addEventListener('click', function (e) {
    $$('.sort.open').forEach(function (s) { if (!s.contains(e.target)) s.classList.remove('open'); });
  });

  /* Season switcher */
  var SEASONS = window.SEASONS || null;
  $$('[data-js=season]').forEach(function (sec) {
    if (!SEASONS) return;
    var tabs = $$('.stab', sec), cards = $('.season-cards', sec), bg = $('.season-bg', sec);
    var title = $('.season-title', sec), desc = $('.season-desc', sec);
    var tpl = cards ? cards.children[0].outerHTML : '';
    function money(s) { return s; }
    function show(name) {
      var d = SEASONS[name]; if (!d) return;
      tabs.forEach(function (t) {
        var on = t.textContent.trim() === name;
        t.classList.toggle('on', on);
        t.style.borderBottom = on ? '2px solid #fff' : '1px solid rgba(255,255,255,.25)';
        var p = $('p', t); if (p) { p.style.color = on ? '#fff' : 'rgba(255,255,255,.6)'; p.style.fontWeight = on ? 700 : 500; }
      });
      if (bg) bg.style.backgroundImage = 'url(' + src(d.bg) + ')';
      if (title) title.innerHTML = d.title.replace(/\n/g, '<br>');
      if (desc) desc.innerHTML = d.desc.replace(/\n/g, '<br>');
      if (!cards) return;
      cards.classList.add('fade');
      setTimeout(function () {
        cards.innerHTML = d.items.map(function (it) {
          var wrap = document.createElement('div'); wrap.innerHTML = tpl;
          var el = wrap.firstElementChild;
          var ps = $$('p', el);
          var ph = $('.photo', el); if (ph) ph.style.backgroundImage = 'url(' + src(it.img) + ')';
          ps[0].textContent = it.brand; ps[1].textContent = it.name; ps[2].textContent = it.spec;
          var priceRow = ps[3].parentElement;
          priceRow.innerHTML = (it.disc ? '<p style="font:700 18px/1.3 \'Noto Sans KR\';letter-spacing:-.005em;color:#a94c1b;white-space:nowrap">' + it.disc + '</p>' : '') +
            '<p style="font:700 18px/1.3 \'Noto Sans KR\';letter-spacing:-.005em;color:#14123a;white-space:nowrap">' + money(it.price) + '</p>';
          return el.outerHTML;
        }).join('');
        cards.classList.remove('fade');
      }, 200);
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.textContent.trim()); }); });
  });


  /* Mobile season switcher */
  $$('[data-js=season-m]').forEach(function (sec) {
    if (!SEASONS) return;
    var EN = { '봄': 'SPRING SEASON', '여름': 'SUMMER SEASON', '가을': 'AUTUMN SEASON', '겨울': 'WINTER SEASON' };
    var MDESC = { '봄': '타프와 테이블, 첫 피크닉 캠핑에 필요한 장비', '여름': '통풍 좋은 텐트와 그늘막, 더위를 피하는 장비', '가을': '화목난로와 면 텐트, 쌀쌀한 밤을 위한 장비', '겨울': '난로 · 침낭 · 방한 텐트까지, 이번 계절에 필요한 장비' };
    var FIT = [['#eceaf8', '#4a3aa8', '트렁크 적합'], ['#fbf1dc', '#b97a08', '실측 확인'], ['#f7eae3', '#a94c1b', '트렁크 초과'], ['#eceaf8', '#4a3aa8', '트렁크 적합']];
    var tabs = $$('.stab', sec), list = $('.season-cards', sec), bg = $('.season-bg', sec);
    var f = "font-family:'Noto Sans KR',sans-serif;";
    function orig(p, d) { var n = +p.replace(/[^0-9]/g, ''), r = +d.replace('%', '') / 100; return (Math.round(n / (1 - r) / 1000) * 1000).toLocaleString('ko-KR') + '원'; }
    var mtpl = list && list.children[0] ? list.children[0].outerHTML : '';
    function card(it, i) {
      var nm = it.name.indexOf(it.brand + ' ') === 0 ? it.name.slice(it.brand.length + 1) : it.name, fit = FIT[i % 4];
      var w = document.createElement('div'); w.innerHTML = mtpl; var el = w.firstElementChild;
      var ph = $('.photo', el) || el.children[0];
      $$('*', el).forEach(function (n) { if (/url\(/.test(n.style.backgroundImage) && !n.querySelector('[style*="url("]')) n.style.backgroundImage = n.style.backgroundImage.replace(/url\([^)]*\)/, 'url(' + src(it.img) + ')'); });
      $$('p', el).forEach(function (p) {
        var t = p.textContent.trim();
        if (t === '토요토미') p.textContent = it.brand;
        else if (t === '옴니 230 난로 세트') p.textContent = nm;
        else if (t === '410,000원') { if (it.disc) p.textContent = orig(it.price, it.disc); else p.style.display = 'none'; }
        else if (t === '12%') { if (it.disc) p.textContent = it.disc; else p.style.display = 'none'; }
        else if (t === '361,000원') p.textContent = it.price;
        else if (t === '트렁크 적합') { p.textContent = fit[2]; p.style.color = fit[1]; if (p.parentElement) p.parentElement.style.background = fit[0]; }
      });
      return el.outerHTML;
    }
    function show(name) {
      var d = SEASONS[name]; if (!d) return;
      tabs.forEach(function (t) {
        var on = t.textContent.trim() === name;
        t.style.background = on ? '#14123a' : '#fff'; t.style.border = on ? '0' : '1px solid #dcdaec';
        var p = $('p', t); if (p) p.style.color = on ? '#fff' : '#14123a';
      });
      if (bg) bg.style.backgroundImage = 'url(' + src(d.mbg || d.bg) + ')';
      var en = $('.season-en', sec), ti = $('.season-title', sec), de = $('.season-desc', sec);
      if (en) en.textContent = EN[name];
      if (ti) ti.innerHTML = d.title.replace(/\n/g, '<br>');
      if (de) de.textContent = MDESC[name];
      if (list) { list.innerHTML = d.items.map(card).join(''); list.scrollLeft = 0; }
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.textContent.trim()); }); });
  });


  /* Category menus (PC dropdown + mobile full screen) — Figma CAT / M-CAT */
  (function () {
    var PCC = [['텐트', ['돔 텐트', '리빙쉘', '터널 텐트', '티피 텐트', '백패킹 텐트', '원터치 텐트']],
      ['쉘터 · 타프', ['쉘터', '렉타 타프', '헥사 타프', '윙 타프', '타프 폴']],
      ['체어 · 테이블', ['릴렉스 체어', '로우 체어', '롤 테이블', 'IGT 테이블', '사이드 테이블']],
      ['침낭 · 매트', ['동계 침낭', '3계절 침낭', '에어 매트', '자충 매트', '야전 침대']],
      ['냉난방', ['난로', '전기장판', '히터', '서큘레이터', '일산화탄소 경보기']],
      ['차박', ['차박 매트', '도킹 텐트', '차량용 타프', '트렁크 정리함']]];
    var MC = [['텐트', ['텐트 전체', '돔 텐트', '리빙쉘', '터널 텐트', '티피 텐트', '백패킹 텐트', '원터치 텐트', '텐트 액세서리']],
      ['쉘터', ['쉘터 전체', '거실형 쉘터', '스크린 쉘터', '쉘터 액세서리']],
      ['타프', ['타프 전체', '렉타 타프', '헥사 타프', '윙 타프', '타프 폴']],
      ['체어 · 테이블', ['체어 · 테이블 전체', '릴렉스 체어', '로우 체어', '롤 테이블', 'IGT 테이블', '사이드 테이블']],
      ['침낭 · 매트', ['침낭 · 매트 전체', '동계 침낭', '3계절 침낭', '에어 매트', '자충 매트', '야전 침대']],
      ['키친 · 쿨러', ['키친 · 쿨러 전체', '버너 · 스토브', '코펠 · 식기', '쿨러', '키친 테이블']],
      ['화로대 · 랜턴', ['화로대 · 랜턴 전체', '화로대', '화목난로', '랜턴', '장작 · 연료']],
      ['냉난방', ['냉난방 전체', '난로', '전기장판', '히터', '서큘레이터', '일산화탄소 경보기']],
      ['수납 · 가방', ['수납 · 가방 전체', '수납 박스', '캐리 백', '폴 · 팩 케이스']],
      ['백패킹', ['백패킹 전체', '경량 텐트', '배낭', '경량 체어']],
      ['차박', ['차박 전체', '차박 매트', '도킹 텐트', '차량용 타프', '트렁크 정리함']]];
    /* PC dropdown */
    var btn = document.querySelector('.pc [data-act=allcat]');
    if (btn) {
      var hdr = btn.closest('[data-n="헤더"]') || btn.parentNode.parentNode;
      hdr.style.position = 'relative'; hdr.style.zIndex = 60;
      var dd = document.createElement('div'); dd.className = 'catdd'; dd.hidden = true; dd.setAttribute('role', 'menu');
      dd.innerHTML = '<div class="catdd-in">' + PCC.map(function (c) { return '<div class="col"><a class="h" href="list.html">' + c[0] + '</a>' + c[1].map(function (s) { return '<a href="list.html">' + s + '</a>'; }).join('') + '</div>'; }).join('') + '</div>';
      hdr.appendChild(dd);
      btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-haspopup', 'true');
      function set(o) { dd.hidden = !o; btn.setAttribute('aria-expanded', o); btn.classList.toggle('on', o); }
      btn.addEventListener('click', function (e) { e.stopPropagation(); set(dd.hidden); });
      document.addEventListener('click', function (e) { if (!dd.hidden && !dd.contains(e.target)) set(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    }
    /* Mobile full screen */
    var mb = document.querySelectorAll('.mo [data-act=menu]');
    if (!mb.length) return;
    var m = document.createElement('div'); m.className = 'mcat'; m.hidden = true; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', '전체 카테고리');
    var BR = ['스노우피크', '헬리녹스', '콜맨', '그라운드커버', '코베아', '제이크라', '스노우라인', 'HXO', '하임플래닛', '도쿄크래프트', '위너웰', '폴러스터프', '디얼스', '텐트마크디자인'];
    function logged() { try { return localStorage.getItem('mc_login') === '1'; } catch (e) { return false; } }
    function cartN() { try { var c = JSON.parse(localStorage.getItem('mc_cart') || 'null'); return c ? c.length : 3; } catch (e) { return 3; } }
    function memberHTML() {
      if (!logged()) return '<div class="mcat-mem"><p>로그인하고 회원 혜택을 받아 보세요.</p><div class="bt"><a class="b1" href="login.html">로그인</a><a class="b2" href="join.html">회원가입</a></div></div>';
      return '<div class="mcat-mem in"><div class="who"><b>박경환 님</b><span class="gr">베테랑</span><button type="button" class="lo js-logout">로그아웃</button></div>' +
        '<div class="sc"><a href="cart.html"><span class="ic"><span class="ms">shopping_bag</span>' + (cartN() ? '<i class="bdg">' + (cartN() > 99 ? '99+' : cartN()) + '</i>' : '') + '</span>장바구니</a><a href="recent.html"><span class="ic"><span class="ms">history</span></span>최근 본 상품</a><a href="mypage.html"><span class="ic"><span class="ms">person</span></span>마이페이지</a></div></div>';
    }
    m.innerHTML = '<header><button type="button" class="ms mcat-x" aria-label="닫기">chevron_left</button><h2>전체 메뉴</h2></header><div class="mcat-memw"></div>' +
      '<div class="mcat-tabs" role="tablist"><button type="button" class="on" data-v="cat" role="tab" aria-selected="true">카테고리</button><button type="button" data-v="brand" role="tab" aria-selected="false">브랜드</button></div>' +
      '<div class="mcat-brand" hidden>' + BR.map(function (b) { return '<a href="list.html?brand=' + encodeURIComponent(b) + '">' + b + '</a>'; }).join('') + '</div>' +
      '<div class="mcat-b"><nav class="l">' +
      MC.map(function (c, i) { return '<button type="button" class="' + (i ? '' : 'on') + '" data-i="' + i + '">' + c[0] + '</button>'; }).join('') + '</nav><div class="r"></div></div>' +
      '<a class="mcat-bn" href="join.html"><div><span>신규 회원 혜택</span><b>첫 주문 무료 배송<br>+ 10,000원 쿠폰</b></div><img src="img/c010c054feb51f98be3073edc481332d970f0b07.png" alt=""></a>';
    document.body.appendChild(m);
    function mem() { m.querySelector('.mcat-memw').innerHTML = memberHTML(); }
    mem();
    m.addEventListener('click', function (e) {
      if (e.target.closest('.js-logout')) { try { localStorage.removeItem('mc_login'); } catch (x) {} mem(); if (window.MC_hdr) window.MC_hdr(); return; }
      var t = e.target.closest('.mcat-tabs button'); if (!t) return;
      [].forEach.call(m.querySelectorAll('.mcat-tabs button'), function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t); });
      var br = t.dataset.v === 'brand'; m.querySelector('.mcat-brand').hidden = !br; m.querySelector('.mcat-b').hidden = br;
    });
    var r = m.querySelector('.r');
    function show(i) { r.innerHTML = MC[i][1].map(function (s) { return '<a href="list.html">' + s + '<span class="ms">chevron_right</span></a>'; }).join(''); [].forEach.call(m.querySelectorAll('.l button'), function (b) { b.classList.toggle('on', +b.dataset.i === i); }); }
    show(0);
    m.querySelector('.l').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) show(+b.dataset.i); });
    function set2(o) { m.hidden = !o; document.documentElement.style.overflow = o ? 'hidden' : ''; }
    [].forEach.call(mb, function (b) { b.addEventListener('click', function () { mem(); set2(true); }); });
    m.querySelector('.mcat-x').addEventListener('click', function () { set2(false); });
  })();

  /* Back to top */
  $$('[data-act=top]').forEach(function (b) { b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }); });

  /* Fit-finder pickers (car / site / people) */
  var PICK = {
    'pick-car': { t: '차종 선택', cls: 'fit-car', o: ['현대 투싼 NX4 · 2024년식 · 트렁크 100 × 90 × 75 cm', '기아 쏘렌토 MQ4 · 2023년식 · 트렁크 110 × 105 × 80 cm', '현대 싼타페 MX5 · 2024년식 · 트렁크 115 × 110 × 82 cm', '기아 카니발 KA4 · 2023년식 · 트렁크 120 × 130 × 95 cm', '제네시스 GV70 · 2024년식 · 트렁크 105 × 95 × 72 cm'] },
    'pick-site': { t: '사이트 크기', cls: 'fit-site', o: ['데크 3 × 3 m', '데크 3 × 4 m', '데크 4 × 4 m', '데크 4 × 6 m', '파쇄석 5 × 5 m', '파쇄석 5 × 8 m', '잔디 6 × 8 m'] },
    'pick-people': { t: '인원', cls: 'fit-people', o: ['1인', '2인', '3인', '4인', '5인', '6인 이상'] }
  };
  var bgEl = document.createElement('div');
  bgEl.className = 'modal-bg';
  bgEl.innerHTML = '<div class="modal" role="dialog" aria-modal="true"><h3></h3><div class="opts"></div><div class="row"><button type="button" class="b2">취소</button><button type="button" class="b1">선택 완료</button></div></div>';
  document.body.appendChild(bgEl);
  var curPick = null, curVal = null;
  function closeM() { bgEl.classList.remove('open'); }
  bgEl.addEventListener('click', function (e) { if (e.target === bgEl || e.target.classList.contains('b2')) closeM(); });
  $('.b1', bgEl).addEventListener('click', function () {
    if (curPick && curVal) $$('.' + PICK[curPick].cls).forEach(function (el) { el.textContent = curVal; });
    closeM();
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act^=pick-]');
    if (!b) return;
    var k = b.dataset.act, d = PICK[k]; if (!d) return;
    curPick = k;
    var now = $('.' + d.cls, b); curVal = now ? now.textContent : null;
    $('h3', bgEl).textContent = d.t;
    var box = $('.opts', bgEl); box.innerHTML = '';
    d.o.forEach(function (o) {
      var x = document.createElement('button'); x.type = 'button'; x.className = 'opt' + (o === curVal ? ' on' : ''); x.textContent = o;
      x.addEventListener('click', function () { curVal = o; $$('.opt', box).forEach(function (y) { y.classList.toggle('on', y === x); }); });
      box.appendChild(x);
    });
    bgEl.classList.add('open');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeM(); });
})();

/* _10 horizontal list indicators (mobile) — dots + active bar (Figma 844:35553) */
(function () {
  function setup() {
    if (window.innerWidth > 767) return;
    var cands = [].slice.call(document.querySelectorAll('.mo .snap-x, .related .pgrid, .snap-list, [data-hscroll]'));
    cands.forEach(function (el) {
      if (el._hind || el.closest('.mcat,.catdd')) return;
      var cs = getComputedStyle(el); if (cs.overflowX !== 'auto' && cs.overflowX !== 'scroll') return;
      function its() { return [].slice.call(el.children).filter(function (c) { return c.offsetWidth > 40; }); }
      var items = its(); if (items.length < 2) return;
      var ind = document.createElement('div'); ind.className = 'hind'; ind.setAttribute('role', 'tablist');
      el.parentNode.insertBefore(ind, el.nextSibling); el._hind = ind;
      function build() { items = its(); ind.innerHTML = items.map(function (_, i) { return '<button type="button" role="tab" aria-label="' + (i + 1) + '번째 보기"></button>'; }).join(''); }
      function idx() { var x = el.scrollLeft, best = 0, d = 1e9, o = items[0].offsetLeft; items.forEach(function (it, i) { var dd = Math.abs(it.offsetLeft - o - x); if (dd < d) { d = dd; best = i; } }); if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) best = items.length - 1; return best; }
      function upd() { if (its().length !== ind.children.length) build(); var i = idx(); [].forEach.call(ind.children, function (b, k) { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i); }); ind.hidden = el.scrollWidth <= el.clientWidth + 4; }
      ind.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var i = [].indexOf.call(ind.children, b); items = its(); el.scrollTo({ left: items[i].offsetLeft - items[0].offsetLeft, behavior: 'smooth' }); });
      el.addEventListener('scroll', function () { clearTimeout(el._ht); el._ht = setTimeout(upd, 50); }, { passive: true });
      build(); upd();
      new MutationObserver(function () { setTimeout(upd, 60); }).observe(el, { childList: true });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(setup, 50); }); else setTimeout(setup, 50);
  window.addEventListener('resize', function () { clearTimeout(window._hr); window._hr = setTimeout(setup, 200); });
})();

/* _03 scroll lock while a sheet / full menu is open */
(function () {
  function chk() { var open = document.querySelector('.sheet.on, .mcat:not([hidden])'); document.documentElement.classList.toggle('lock', !!open); }
  var mo = new MutationObserver(chk);
  function bind() { document.querySelectorAll('.sheet, .mcat').forEach(function (s) { if (!s._lk) { s._lk = 1; mo.observe(s, { attributes: true, attributeFilter: ['class', 'aria-hidden', 'hidden', 'style'] }); } }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
  new MutationObserver(function () { bind(); chk(); }).observe(document.body || document.documentElement, { childList: true });
})();

/* _05 bottom GNB wish badge */
(function () {
  var b = document.querySelector('.js-wishcnt'); if (!b) return;
  var n = 0; try { var w = JSON.parse(localStorage.getItem('mc_wish') || 'null'); if (w) n = w.length; else if (window.PRODUCTS) n = window.PRODUCTS.filter(function (p) { return p.wish; }).length; else n = +b.dataset.def || 0; } catch (e) {}
  if (n) { b.textContent = n > 99 ? '99+' : n; b.hidden = false; }
})();

/* _06 login state on PC header */
(function () {
  function on() { try { return localStorage.getItem('mc_login') === '1'; } catch (e) { return false; } }
  window.MC_hdr = function () {
    var a = document.querySelector('.pc a[href="login.html"]'), j = document.querySelector('.pc a[href="join.html"]');
    if (!a || !j) return;
    var pa = a.querySelector('p') || a, pj = j.querySelector('p') || j;
    if (!a.dataset.t0) { a.dataset.t0 = pa.textContent; j.dataset.t0 = pj.textContent; }
    if (on()) { pa.textContent = '박경환 님'; a.setAttribute('href', 'mypage.html'); pj.textContent = '로그아웃'; j.setAttribute('href', '#'); j.dataset.lo = '1'; }
  };
  document.addEventListener('click', function (e) { var j = e.target.closest('.pc a[data-lo="1"]'); if (j) { e.preventDefault(); try { localStorage.removeItem('mc_login'); } catch (x) {} location.reload(); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', window.MC_hdr); else window.MC_hdr();
})();
