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

  /* Billboard: per-slide copy, seamless infinite loop both ways (1→2→3→1 / 3→2→1→3), 4s autoplay */
  var BB = [
    { eye: 'DOME TENT · 4P', t: '불을 밝히면,<br>숲이 거실이 됩니다', d: '4인이 머물기 넉넉한 실내 공간을 갖췄습니다.<br>4계절 립스탑 원단이 바람과 추위를 막아 줍니다.', v: ['랜드네스트 돔 M', '4인', '립스탑', '4계절'], href: 'detail.html?id=7' },
    { eye: 'TIPI TENT · 3P', t: '별이 지는 밤에도,<br>불빛이 머뭅니다', d: '면혼방 원단이 결로를 줄여 줍니다.<br>난로와 함께 쓰기 좋은 겨울 텐트입니다.', v: ['몰티하우스 미니 탄', '3인', 'TC 면혼방', '4계절'], href: 'detail.html?id=4' },
    { eye: 'DOME TENT · 2P', t: '나무 그늘 아래,<br>오후가 천천히 흐릅니다', d: '전실이 넓어 짐을 두고도 여유롭습니다.<br>주말에 가볍게 떠나기 좋은 2인용 돔입니다.', v: ['투어링 돔 LX+', '2인', '폴리에스터', '3계절'], href: 'detail.html?id=6' }
  ];
  $$('[data-js=billboard]').forEach(function (bb) {
    var track = $('.bb-track', bb), slides = $$('.bb-slide', bb), cur = $('.bb-cur', bb);
    if (!track || slides.length < 2) return;
    var i = 0, n = slides.length, timer, busy = false, W = function () { return Math.round(bb.clientWidth); };
    var copyEls = [$('.bb-eye', bb), $('.bb-title', bb), $('.bb-desc', bb), $('.bb-sub', bb)].concat($$('.bb-v', bb)).filter(Boolean);
    copyEls.forEach(function (e) { e.style.transition = 'opacity .35s ease'; });
    function copy(k) {
      var d = BB[k % BB.length]; if (!d) return;
      copyEls.forEach(function (e) { e.style.opacity = '0'; });
      setTimeout(function () {
        var e;
        if ((e = $('.bb-eye', bb))) e.textContent = d.eye;
        if ((e = $('.bb-title', bb))) e.innerHTML = d.t;
        if ((e = $('.bb-desc', bb))) e.innerHTML = d.d;
        if ((e = $('.bb-sub', bb))) e.textContent = d.v[0] + ' · ' + d.v[1] + ' · ' + d.v[3];
        $$('.bb-v', bb).forEach(function (x, j) { x.textContent = d.v[j]; });
        $$('a[href^="detail.html"]', bb).forEach(function (a) { a.setAttribute('href', d.href); });
        copyEls.forEach(function (x) { x.style.opacity = '1'; });
      }, 250);
    }
    function setX(x, anim) { track.style.transition = anim ? '' : 'none'; track.style.transform = 'translate3d(' + x + 'px,0,0)'; if (!anim) void track.offsetWidth; }
    function go(dir) {
      if (busy) return; busy = true;
      var from = i, to = (i + dir + n) % n, w = W();
      var wrapF = dir > 0 && from === n - 1, wrapB = dir < 0 && from === 0;
      if (wrapF) slides[0].style.transform = 'translateX(' + (n * w) + 'px)';
      if (wrapB) { slides[n - 1].style.transform = 'translateX(' + (-n * w) + 'px)'; }
      var x = wrapF ? -n * w : wrapB ? w : -to * w;
      setX(x, true);
      i = to; if (cur) cur.textContent = ('0' + (i + 1)).slice(-2); copy(i);
      var done = function () {
        track.removeEventListener('transitionend', done); clearTimeout(t);
        if (wrapF || wrapB) { slides[0].style.transform = ''; slides[n - 1].style.transform = ''; setX(-i * w, false); track.style.transition = ''; }
        busy = false;
      };
      var t = setTimeout(done, 1000); track.addEventListener('transitionend', done);
    }
    window.addEventListener('resize', function () { setX(-i * W(), false); track.style.transition = ''; });
    function play() { clearInterval(timer); timer = setInterval(function () { go(1); }, 4000); }
    var mx = null, moved = false;
    bb.addEventListener('mousedown', function (e) { if (e.button !== 0 || e.target.closest('a,button,[data-act]')) return; mx = e.clientX; moved = false; bb.classList.add('drag'); e.preventDefault(); });
    window.addEventListener('mouseup', function (e) { if (mx === null) return; var dx = e.clientX - mx; mx = null; bb.classList.remove('drag'); if (Math.abs(dx) > 50) { moved = true; go(dx < 0 ? 1 : -1); play(); } });
    bb.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    bb.addEventListener('dragstart', function (e) { e.preventDefault(); });
    var sx = null;
    bb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    bb.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 40) { go(dx < 0 ? 1 : -1); play(); } });
    bb.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b) return;
      if (b.dataset.act === 'bb-prev') { go(-1); play(); }
      if (b.dataset.act === 'bb-next') { go(1); play(); }
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
    var BLG = { '스노우피크': 'snowpeak', '헬리녹스': 'helinox', '콜맨': 'coleman', '그라운드커버': 'groundcover', '코베아': 'kovea', '제이크라': 'jakelah', '스노우라인': 'snowline', 'HXO': 'hxo', '하임플래닛': 'heimplanet', '도쿄크래프트': 'tokyocrafts', '위너웰': 'winnerwell', '디얼스': 'dears', '텐트마크디자인': 'tentmark' };
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
      '<div class="mcat-brand" hidden>' + BR.map(function (b) { var lg = BLG[b]; return '<a href="list.html?brand=' + encodeURIComponent(b) + '"><span class="blg' + (lg ? ' blg-' + lg : ' blg-none') + '">' + (lg ? '<img src="img/brand/' + lg + '.webp" alt="" loading="lazy">' : '<i>' + b.charAt(0) + '</i>') + '</span><span class="bnm">' + b + '</span></a>'; }).join('') + '</div>' +
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

/* _13 PC quick menu: footer-aware position + banner / recent carousels */
(function () {
  var q = document.querySelector('.pc .quickmenu'); if (!q) return;
  var src = function (h) { return 'img/' + ((window.IMG && IMG[h]) || h + '.jpg'); };
  function place() {
    var f = document.querySelector('.pc .site-footer'); if (!f) return;
    var gap = 24, base = 50, ft = f.getBoundingClientRect().top, vh = window.innerHeight;
    var over = (vh - base) - (ft - gap);
    q.style.transform = over > 0 ? 'translateY(' + (-over) + 'px)' : '';
  }
  window.addEventListener('scroll', place, { passive: true }); window.addEventListener('resize', place); window.addEventListener('load', place); place();
  if (window.ResizeObserver) new ResizeObserver(place).observe(document.body);
  function car(box, data, render) {
    if (!box) return; var i = 0, cur = box.querySelector('.qcur'), tot = cur && cur.nextElementSibling;
    if (tot) tot.textContent = '/ ' + data.length;
    function show() { render(data[i]); if (cur) cur.textContent = i + 1; }
    [['.qprev', -1], ['.qnext', 1]].forEach(function (a) {
      var b = box.querySelector(a[0]); if (!b) return;
      b.style.cursor = 'pointer'; b.setAttribute('role', 'button'); b.setAttribute('aria-label', a[1] < 0 ? '이전' : '다음'); b.tabIndex = 0;
      var go = function (e) { e.preventDefault(); e.stopPropagation(); i = (i + a[1] + data.length) % data.length; show(); };
      b.addEventListener('click', go); b.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(e); });
      var pad = b.parentElement; pad.style.cursor = 'default';
    });
    show();
  }
  var bn = q.querySelector('.qbn');
  car(bn, [
    { t: '동계 캠핑\n준비전', img: 'a29c6ad364f24b6d266c9f5b509398b0d367fcdf', href: 'event-detail.html' },
    { t: '차박 입문\n기획전', img: '51277b9e815b0917da65d96983c5bc00f506a3b6', href: 'event.html' },
    { t: '쉘터 브랜드\n위크', img: '0523b071f3149486d40f11a5ae0474f0932ff271', href: 'event.html' }
  ], function (d) { var im = bn.querySelector('.qimg'), t = bn.querySelector('.qtit'); if (im) im.style.backgroundImage = 'url(' + src(d.img) + ')'; if (t) t.innerHTML = d.t.replace('\n', '<br>'); bn.setAttribute('href', d.href); });
  var rc = q.querySelector('.qrc');
  car(rc, [
    { img: 'ace784aa62a7fec2fa29e4f2f8d54e13c83da4e1', href: 'detail.html' },
    { img: '0523b071f3149486d40f11a5ae0474f0932ff271', href: 'detail.html?id=1' },
    { img: 'd0f2061dd0735da101fc52bb0ec48f87d7d45562', href: 'detail.html?id=2' }
  ], function (d) { var im = rc.querySelector('.qimg'); if (im) im.style.backgroundImage = 'url(' + src(d.img) + ')'; rc.setAttribute('href', d.href); });
})();

/* _16 mobile floating quick menu (all pages) */
(function () {
  if (!document.querySelector('.mo')) return;
  var src = function (h) { return 'img/' + ((window.IMG && IMG[h]) || h + '.jpg'); };
  var DEF = [{ id: 21, img: 'ace784aa62a7fec2fa29e4f2f8d54e13c83da4e1' }, { id: 1, img: '0523b071f3149486d40f11a5ae0474f0932ff271' }, { id: 2, img: 'd0f2061dd0735da101fc52bb0ec48f87d7d45562' }];
  var rec; try { rec = JSON.parse(localStorage.getItem('mc_recent') || 'null'); } catch (e) {}
  if (!rec || !rec.length) rec = DEF; rec = rec.slice(0, 3);
  var wn = 0; try { var w = JSON.parse(localStorage.getItem('mc_wish') || 'null'); if (w) wn = w.length; else if (window.PRODUCTS) wn = PRODUCTS.filter(function (p) { return p.wish; }).length; } catch (e) {}
  var it = function (cls, x, y, inner, attr) { inner = inner.replace(/(<span class="ms">[^<]*<\/span><b class="mq-l">.*?<\/b>)/, '<span class="mq-f">$1</span>'); return '<a class="mq-i ' + cls + '" style="--x:' + x + ';--y:' + y + '" ' + attr + '>' + inner + '</a>'; };
  var h = '<div class="mq-dim"></div><div class="mq" aria-label="퀵메뉴">';
  rec.forEach(function (r, i) { h += it('mq-rc', 0, i + 1, '<img src="' + src(r.img) + '" alt="">', 'href="detail.html?id=' + r.id + '" aria-label="최근 본 상품 ' + (i + 1) + '"'); });
  h += it('', 1, 1, '<span class="ms">support_agent</span><b class="mq-l">고객<br>센터</b>', 'href="faq.html" aria-label="고객센터"');
  h += it('', 2, 1, '<span class="ms">favorite</span><b class="mq-l">찜<br>목록</b>', 'href="wishlist.html" aria-label="찜목록"');
  h += it('', 1, 0, '<span class="ms">menu</span><b class="mq-l">전체<br>메뉴</b>', 'href="#" role="button" data-mq="menu" aria-label="전체메뉴"');
  h += it('', 2, 0, '<span class="ms">home</span><b class="mq-l">홈</b>', 'href="index.html" aria-label="홈"');
  h += '<button type="button" class="mq-btn" aria-expanded="false" aria-label="퀵메뉴 열기"><span class="ms">apps</span></button></div>';
  var box = document.createElement('div'); box.className = 'mqw'; box.innerHTML = h; document.body.appendChild(box);
  var btn = box.querySelector('.mq-btn'), ic = btn.querySelector('.ms');
  /* staggered order: recent(near→far) → 찜 → 고객센터 → 홈 → 전체메뉴; close = reverse */
  var seq = [].slice.call(box.querySelectorAll('.mq-rc')).map(function (e, i) { return [e, i * 40]; }), b0 = rec.length * 40;
  [['[aria-label="찜목록"]', 0], ['[aria-label="고객센터"]', 20], ['[aria-label="홈"]', 40], ['[aria-label="전체메뉴"]', 60]].forEach(function (x) { seq.push([box.querySelector('.mq-i' + x[0]), b0 + x[1]]); });
  var mx = Math.max.apply(null, seq.map(function (x) { return x[1]; }));
  seq.forEach(function (x) { x[0].style.setProperty('--d', x[1] + 'ms'); x[0].style.setProperty('--dc', (mx - x[1]) + 'ms'); });
  function set(on) { box.classList.toggle('open', on); flipReset(on); btn.setAttribute('aria-expanded', on); btn.setAttribute('aria-label', on ? '퀵메뉴 닫기' : '퀵메뉴 열기'); ic.textContent = on ? 'close' : 'apps'; }
  btn.addEventListener('click', function () { set(!box.classList.contains('open')); });
  /* idle flip: 1.5s no touch -> rotateY icon<->label every 1.5s, wave order 찜→고객센터→홈→전체메뉴 */
  var fl = ['찜목록', '고객센터', '홈', '전체메뉴'].map(function (l, i) { var e = box.querySelector('.mq-i[aria-label="' + l + '"]'); e.style.setProperty('--fd', (i * 80) + 'ms'); return e; });
  var ft = null, fi = null, fs = false;
  function flipAll(v) { fs = v; fl.forEach(function (e) { e.classList.toggle('flip', v); }); }
  function flipReset(on) {
    clearTimeout(ft); clearInterval(fi); if (fs) flipAll(false);
    if (on) ft = setTimeout(function () { flipAll(true); fi = setInterval(function () { flipAll(!fs); }, 3100); }, 500 + 1500);
  }
  var idle = function () { if (box.classList.contains('open')) flipReset(true); };
  ['touchstart', 'pointerdown', 'wheel', 'scroll', 'keydown'].forEach(function (t) { window.addEventListener(t, idle, { passive: true, capture: true }); });
  fl.forEach(function (el) { el.addEventListener('mouseenter', function (e) { if (e.pointerType === 'touch') return; el.classList.add('hv'); }); el.addEventListener('mouseleave', function () { el.classList.remove('hv'); }); });
  box.querySelector('.mq-dim').addEventListener('click', function () { set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  box.querySelector('[data-mq=menu]').addEventListener('click', function (e) { e.preventDefault(); set(false); var m = document.querySelector('.mo [data-act=menu]'); if (m) m.click(); });
  function place() {
    var top = window.innerHeight;
    ['.m-tabbar', '.m-buybar', '.m-orderbar'].forEach(function (s) { document.querySelectorAll(s).forEach(function (el) { if (getComputedStyle(el).position === 'fixed' && el.offsetHeight) top = Math.min(top, el.getBoundingClientRect().top); }); });
    box.style.setProperty('--mqb', (window.innerHeight - top + 16) + 'px');
    box.style.setProperty('--mqk', Math.min(1.2, Math.max(0.96, window.innerWidth / 375)).toFixed(3));
  }
  window.addEventListener('resize', place); window.addEventListener('load', place); place(); setTimeout(place, 300);
})();
