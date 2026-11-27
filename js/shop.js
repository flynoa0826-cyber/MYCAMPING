/* 들살이 — 상세 · 장바구니 · 주문 · 주문 완료 */
(function () {
  'use strict';
  var M = window.MC, $ = M.$, $$ = M.$$, won = M.won, P = M.P;
  var DEFAULT_CART = [{ id: 21, qty: 1, on: true, opt: '아이보리 / 본체 단품' }, { id: 18, qty: 1, on: true }, { id: 17, qty: 1, on: true }];
  function cart() { var c = M.store('mc_cart'); if (!c) { c = DEFAULT_CART.slice(); M.store('mc_cart', c); } return c; }
  function q(name) { var m = location.search.match(new RegExp('[?&]' + name + '=([^&]+)')); return m ? decodeURIComponent(m[1]) : null; }

  /* ---------- detail ---------- */
  var dp = $('[data-page=detail]');
  if (dp) {
    var p = M.byId(q('id') || 21), base = p.price, add = 0;
    document.body.classList.add('has-bar');
    $$('.js-name', dp).forEach(function (e) { e.textContent = p.name; });
    $('.js-brand', dp).textContent = p.brand;
    $('.js-rate', dp).textContent = p.rate.toFixed(1); $('.js-rev', dp).textContent = p.rev;
    $('.js-disc', dp).textContent = p.disc ? p.disc + '%' : '';
    $('.js-price', dp).textContent = won(p.price);
    $('.js-pt', dp).textContent = won(Math.round(p.price / 100));
    document.title = p.name + ' · 들살이';
    try { var rc = JSON.parse(localStorage.getItem('mc_recent') || '[]').filter(function (x) { return x.id !== p.id; }); rc.unshift({ id: p.id, img: p.img }); localStorage.setItem('mc_recent', JSON.stringify(rc.slice(0, 3))); } catch (e) {}
    var gal = p.gal || [p.img], main = $('.js-main', dp);
    main.src = M.src(gal[0]); main.alt = p.name;
    $('.js-thumbs', dp).innerHTML = gal.map(function (h, i) { return '<button type="button" class="' + (i ? '' : 'on') + '" data-src="' + M.src(h) + '" aria-label="이미지 ' + (i + 1) + '"><img src="' + M.src(h) + '" alt=""></button>'; }).join('');
    $$('.js-thumbs button', dp).forEach(function (b) { b.addEventListener('click', function () { $$('.js-thumbs button', dp).forEach(function (x) { x.classList.toggle('on', x === b); }); main.src = b.dataset.src; }); });
    var color = '아이보리', set = '본체 단품';
    var lines = [{ color: color, set: set, add: add, qty: 1 }];
    var box = $('.js-lines', dp);
    function upd() {
      var tq = 0, tp = 0;
      box.innerHTML = lines.map(function (l, i) {
        var unit = base + l.add; tq += l.qty; tp += unit * l.qty;
        return '<div class="picked" data-i="' + i + '"><div class="t"><span>' + M.esc(l.color + ' / ' + l.set) + '</span><button type="button" class="ms js-lx" aria-label="옵션 삭제" style="font-size:18px">close</button></div>' +
          '<div class="b"><div class="qty"><button type="button" class="ms js-lq" data-q="-1" aria-label="수량 빼기">remove</button><input class="js-lqty" value="' + l.qty + '" inputmode="numeric" aria-label="수량"><button type="button" class="ms js-lq" data-q="1" aria-label="수량 더하기">add</button></div><span>' + won(unit * l.qty) + '</span></div></div>';
      }).join('');
      box.hidden = !lines.length;
      $$('.js-cnt').forEach(function (e) { e.textContent = tq; });
      $$('.js-total').forEach(function (e) { e.textContent = won(tp); });
    }
    function pick() {
      var f = lines.filter(function (l) { return l.color === color && l.set === set; })[0];
      if (f) { f.qty = Math.min(99, f.qty + 1); M.toast('이미 선택한 옵션입니다. 수량을 1개 늘렸습니다.'); }
      else lines.push({ color: color, set: set, add: add, qty: 1 });
      upd();
    }
    function radio(sel, cb) {
      $$(sel, dp).forEach(function (b) {
        b.addEventListener('click', function () { $$(sel, dp).forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); }); cb(b); pick(); });
      });
    }
    radio('.colors button', function (b) { color = b.dataset.color; });
    radio('.sets button', function (b) { set = b.dataset.set; add = +b.dataset.add; });
    box.addEventListener('click', function (e) {
      var row = e.target.closest('.picked'); if (!row) return; var i = +row.dataset.i;
      if (e.target.closest('.js-lx')) { lines.splice(i, 1); upd(); return; }
      var q = e.target.closest('.js-lq'); if (q) { lines[i].qty = Math.max(1, Math.min(99, lines[i].qty + +q.dataset.q)); upd(); }
    });
    box.addEventListener('change', function (e) {
      var row = e.target.closest('.picked'); if (!row || !e.target.classList.contains('js-lqty')) return;
      lines[+row.dataset.i].qty = Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1)); upd();
    });
    function items() { return lines.map(function (l) { return { id: p.id, qty: l.qty, on: true, opt: l.color + ' / ' + l.set, add: l.add }; }); }
    function need() { if (!lines.length) { M.toast('옵션을 선택해 주세요.'); return false; } return true; }
    function addCart() {
      var c = cart();
      items().forEach(function (it) { var f = c.filter(function (x) { return x.id === it.id && x.opt === it.opt; })[0]; if (f) f.qty += it.qty; else c.unshift(it); });
      M.store('mc_cart', c);
    }
    $$('.js-addcart').forEach(function (b) { b.addEventListener('click', function () { if (!need()) return; addCart(); M.toast('장바구니에 담았습니다.'); }); });
    $$('.js-buy').forEach(function (b) { b.addEventListener('click', function () { if (!need()) return; M.store('mc_buynow', items()); location.href = 'order.html?now=1'; }); });
    upd();
    var wl = M.store('mc_wish') || P.filter(function (x) { return x.wish; }).map(function (x) { return x.id; }), won2 = wl.indexOf(p.id) > -1;
    function wishUI() { $$('.js-wish').forEach(function (b) { b.classList.toggle('on', won2); b.setAttribute('aria-pressed', won2); }); }
    $$('.js-wish,.js-wish2').forEach(function (b) {
      b.addEventListener('click', function () {
        var w = M.store('mc_wish') || wl, i = w.indexOf(p.id);
        if (i > -1) w.splice(i, 1); else w.push(p.id);
        M.store('mc_wish', w); won2 = i < 0; wishUI(); M.toast(won2 ? '찜 목록에 추가했습니다.' : '찜 목록에서 삭제했습니다.');
      });
    });
    wishUI();
    $('.js-cpn', dp).addEventListener('click', function () { this.innerHTML = '받기 완료<span class="ms" style="font-size:16px">check</span>'; this.disabled = true; M.toast('쿠폰을 받았습니다. 주문서에서 적용할 수 있습니다.'); });
    var unf = $('.js-unfold', dp);
    unf.addEventListener('click', function () { var f = $('.js-fold', dp), o = f.classList.toggle('open'); unf.textContent = o ? '상세 정보 접기' : '상세 정보 펼치기'; unf.setAttribute('aria-expanded', o); });
    $$('.help2', dp).forEach(function (b) { b.addEventListener('click', function () { var s = $('span', b), on = b.classList.toggle('on'); s.textContent = +s.textContent + (on ? 1 : -1); }); });
    var qf = $('.js-qnaform'); if (qf) qf.addEventListener('submit', function (e) { e.preventDefault(); qf.closest('.sheet').classList.remove('on'); qf.reset(); M.toast('문의를 등록했습니다. 답변은 마이페이지에서 확인할 수 있습니다.'); });
    // tabs scroll-spy
    var tabs = $$('.dtabs a', dp), secs = tabs.map(function (a) { return $(a.getAttribute('href')); });
    window.addEventListener('scroll', function () {
      var y = window.scrollY + 140, cur = 0;
      secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
      tabs.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
    }, { passive: true });
    var rel = $('.js-related', dp); if (rel) rel.innerHTML = [17, 18, 19, 20].map(function (i) { return M.card(M.byId(i), { compact: true }); }).join('');
    upd();
  }

  /* ---------- cart ---------- */
  var cp = $('[data-page=cart]');
  if (cp) {
    document.body.classList.add('has-bar');
    var list = $('.js-cartlist', cp);
    function draw() {
      var c = cart();
      $('.js-cnt', cp).textContent = c.length;
      if (!c.length) {
        list.innerHTML = '<div class="card cart-empty"><span class="ms">shopping_bag</span><p>장바구니에 담긴 상품이 없습니다</p><span>내 차와 사이트에 맞는 장비를 둘러보세요.</span><a class="btn btn-pri" href="list.html" style="margin-top:24px">장비 보러 가기</a></div>';
      } else {
        var g = { own: [], maker: [] };
        c.forEach(function (it, i) { var p = M.byId(it.id); (p.ship === 'maker' ? g.maker : g.own).push(row(it, p, i)); });
        list.innerHTML = '<div class="selbar"><label class="ck"><input type="checkbox" class="js-all"' + (c.every(function (x) { return x.on; }) ? ' checked' : '') + '><i></i>전체 선택 (' + c.filter(function (x) { return x.on; }).length + '/' + c.length + ')</label><div class="r"><button type="button" class="btn-pl js-delsel">선택 삭제</button><button type="button" class="btn-pl js-delout">품절 상품 삭제</button></div></div>' +
          (g.own.length ? '<section class="grp"><header>들살이 직배송<span>오늘 출고 · 무료 배송</span></header>' + g.own.join('') + '</section>' : '') +
          (g.maker.length ? '<section class="grp"><header>제조사 직배송<span>2–3일 내 출고 · 무료 배송</span></header>' + g.maker.join('') + '</section>' : '');
      }
      totals(c);
    }
    function row(it, p, i) {
      var unit = p.price + (it.add || 0);
      return '<div class="crow" data-i="' + i + '"><label class="ck"><input type="checkbox" class="js-on"' + (it.on ? ' checked' : '') + ' aria-label="' + M.esc(p.name) + ' 선택"><i></i></label>' +
        '<a class="im" href="detail.html?id=' + p.id + '"><img src="' + M.src(p.img) + '" alt=""></a>' +
        '<div><p class="br">' + M.esc(p.brand) + '</p><a class="nm" href="detail.html?id=' + p.id + '">' + M.esc(p.short || p.name) + '</a><p class="op">' + M.esc(it.opt || p.opt || '기본') + ' · ' + p.kg + ' kg</p>' +
        '<div class="qty"><button type="button" class="ms js-q" data-d="-1" aria-label="수량 빼기">remove</button><input value="' + it.qty + '" readonly aria-label="수량"><button type="button" class="ms js-q" data-d="1" aria-label="수량 더하기">add</button></div></div>' +
        '<div class="pr">' + (p.orig ? '<s>' + won(p.orig * it.qty) + '</s>' : '') + '<b>' + won(unit * it.qty) + '</b><span>적립 ' + won(Math.round(unit * it.qty / 100)) + '</span></div>' +
        '<div class="bt"><button type="button" class="btn-pl" data-sheet="sh-opt">옵션 변경</button><button type="button" class="btn-pl js-towish">찜으로 이동</button><button type="button" class="btn-pl" data-sheet="sh-cpn">쿠폰 적용</button></div>' +
        '<button type="button" class="del ms js-del" aria-label="삭제">close</button></div>';
    }
    function totals(c) {
      var sel = c.filter(function (x) { return x.on; }), sum = 0, dis = 0, kg = 0, vol = 0;
      sel.forEach(function (it) { var p = M.byId(it.id); sum += ((p.orig || p.price) + (it.add || 0)) * it.qty; dis += ((p.orig || p.price) - p.price) * it.qty; kg += p.kg * it.qty; vol += (p.vol || Math.round(p.pack * 0.9)) * it.qty; });
      var cpn = sel.length ? 10000 : 0, tot = sum - dis - cpn;
      $('.js-sum', cp).textContent = won(sum); $('.js-dis', cp).textContent = dis ? '−' + won(dis) : '0원';
      $('.js-cpnv', cp).textContent = cpn ? '−' + won(cpn) : '0원';
      $$('.js-tot').forEach(function (e) { e.textContent = won(tot); });
      $('.js-pt', cp).textContent = won(Math.round((sum - dis) / 100));
      $$('.js-ordcnt').forEach(function (e) { e.textContent = sel.length; });
      var pct = Math.min(100, Math.round(vol / 675 * 100));
      $('.js-meter', cp).style.width = pct + '%';
      $('.js-load', cp).textContent = '트렁크 ' + pct + '% 사용 · ' + vol + ' L / 675 L';
      $('.js-kg', cp).textContent = '총 무게 ' + kg.toFixed(1) + ' kg · ' + (pct <= 100 ? '모두 트렁크 적합' : '트렁크 초과');
      $$('.js-order').forEach(function (b) { b.disabled = !sel.length; });
    }
    cp.addEventListener('click', function (e) {
      var c = cart(), r = e.target.closest('.crow'), i = r ? +r.dataset.i : -1;
      if (e.target.closest('.js-q')) { c[i].qty = Math.max(1, Math.min(99, c[i].qty + +e.target.closest('.js-q').dataset.d)); }
      else if (e.target.closest('.js-del')) { c.splice(i, 1); M.toast('장바구니에서 삭제했습니다.'); }
      else if (e.target.closest('.js-towish')) { var w = M.store('mc_wish') || []; if (w.indexOf(c[i].id) < 0) w.push(c[i].id); M.store('mc_wish', w); c.splice(i, 1); M.toast('찜 목록으로 옮겼습니다.'); }
      else if (e.target.closest('.js-delsel')) { var n = c.length; c = c.filter(function (x) { return !x.on; }); M.toast(n - c.length ? '선택한 상품을 삭제했습니다.' : '삭제할 상품을 선택해 주세요.'); }
      else if (e.target.closest('.js-delout')) { M.toast('품절된 상품이 없습니다.'); return; }
      else return;
      M.store('mc_cart', c); draw();
    });
    cp.addEventListener('change', function (e) {
      var c = cart();
      if (e.target.classList.contains('js-all')) c.forEach(function (x) { x.on = e.target.checked; });
      else if (e.target.classList.contains('js-on')) c[+e.target.closest('.crow').dataset.i].on = e.target.checked;
      else return;
      M.store('mc_cart', c); draw();
    });
    $$('.js-order').forEach(function (b) { b.addEventListener('click', function () { M.store('mc_buynow', null); location.href = 'order.html'; }); });
    $$('.js-applycpn').forEach(function (b) { b.addEventListener('click', function () { b.closest('.sheet').classList.remove('on'); M.toast('쿠폰을 적용했습니다.'); }); });
    var rel2 = $('.js-related', cp); if (rel2) rel2.innerHTML = [17, 18, 19, 20].map(function (i) { return M.card(M.byId(i), { compact: true }); }).join('');
    draw();
  }

  /* ---------- order ---------- */
  var op = $('[data-page=order]');
  if (op) {
    document.body.classList.add('has-bar');
    var items = (q('now') && M.store('mc_buynow')) || cart().filter(function (x) { return x.on; });
    if (!items.length) items = DEFAULT_CART;
    var sum = 0, dis = 0;
    $('.js-items', op).innerHTML = items.map(function (it) {
      var p = M.byId(it.id), unit = p.price + (it.add || 0); sum += ((p.orig || p.price) + (it.add || 0)) * it.qty; dis += ((p.orig || p.price) - p.price) * it.qty;
      return '<div class="orow"><img src="' + M.src(p.img) + '" alt=""><div><p class="nm">' + M.esc(p.short || p.name) + '</p><p class="op">' + (it.opt ? '옵션: ' + M.esc(it.opt) : '색상: ' + M.esc(p.opt || '기본')) + '</p>' + (p.gift ? '<p class="gift"><b>사은품</b>' + M.esc(p.gift) + '</p>' : '') + '</div>' +
        '<div class="pr">' + (p.orig ? '<s>' + won(p.orig * it.qty) + '</s><em>할인 −' + won((p.orig - p.price) * it.qty) + '</em>' : '') + '<b>' + won(unit * it.qty) + '</b><span>수량 ' + it.qty + '개</span></div>' +
        '<button type="button" class="btn btn-sub" data-sheet="sh-cpn">상품 쿠폰 적용</button></div>';
    }).join('');
    $('.js-icnt', op).textContent = items.length;
    var cpn = 10000, used = 0;
    function tot() {
      var t = sum - dis - cpn - used;
      $('.js-sum', op).textContent = won(sum); $('.js-dis', op).textContent = dis ? '−' + won(dis) : '0원';
      $('.js-cpnv', op).textContent = cpn ? '−' + won(cpn) : '0원'; $('.js-used', op).textContent = used ? '−' + won(used) : '0원';
      $$('.js-tot').forEach(function (e) { e.textContent = won(t); });
      $('.js-pt', op).textContent = won(Math.round((sum - dis) / 100));
      M.store('mc_order_tot', { sum: sum, dis: dis, cpn: cpn, used: used, tot: t, items: items });
    }
    $$('.osec>header', op).forEach(function (h) { h.setAttribute('role', 'button'); h.setAttribute('tabindex', '0'); h.addEventListener('click', function () { var s = h.parentNode; s.classList.toggle('closed'); h.setAttribute('aria-expanded', !s.classList.contains('closed')); }); });
    $('.js-allpt', op).addEventListener('click', function () { used = 12000; $('.js-ptin', op).value = '12,000'; tot(); });
    $('.js-ptin', op).addEventListener('change', function () { var v = parseInt(this.value.replace(/\D/g, ''), 10) || 0; used = Math.min(12480, Math.floor(v / 1000) * 1000); this.value = used.toLocaleString ? String(used).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : used; tot(); });
    $$('.pays button', op).forEach(function (b) { b.addEventListener('click', function () { $$('.pays button', op).forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); $('.js-cardopts', op).style.display = b.dataset.pay === 'card' ? '' : 'none'; }); });
    var all = $('.js-agreeall', op), subs = $$('.js-agree', op);
    all.addEventListener('change', function () { subs.forEach(function (s) { s.checked = all.checked; }); });
    subs.forEach(function (s) { s.addEventListener('change', function () { all.checked = subs.every(function (x) { return x.checked; }); }); });
    $$('.js-pay').forEach(function (b) {
      b.addEventListener('click', function () {
        var bad = $$('[required]', op).filter(function (i) { return !i.value.trim(); });
        $$('.inp.err', op).forEach(function (i) { i.classList.remove('err'); });
        if (bad.length) { bad.forEach(function (i) { i.classList.add('err'); }); var s = bad[0].closest('.osec'); if (s) s.classList.remove('closed'); bad[0].focus(); M.toast('필수 정보를 입력해 주세요.'); return; }
        if (!subs.every(function (x) { return x.checked; })) { M.toast('필수 약관에 동의해 주세요.'); return; }
        if (!q('now')) M.store('mc_cart', cart().filter(function (x) { return !x.on; }));
        location.href = 'order-complete.html';
      });
    });
    $$('.js-applycpn').forEach(function (b) { b.addEventListener('click', function () { b.closest('.sheet').classList.remove('on'); M.toast('쿠폰을 적용했습니다.'); }); });
    tot();
  }

  /* ---------- order complete ---------- */
  var dn = $('[data-page=order-complete]');
  if (dn) {
    var o = M.store('mc_order_tot') || { items: DEFAULT_CART, sum: 1439000, dis: 114000, cpn: 10000, used: 0, tot: 1315000 };
    $('.js-items', dn).innerHTML = o.items.map(function (it) { var p = M.byId(it.id); return '<div class="drow"><img src="' + M.src(p.img) + '" alt=""><div>' + M.esc(p.short || p.name) + '<span>' + M.esc(it.opt || p.opt || '기본') + ' · ' + it.qty + '개</span></div><b>' + won((p.price + (it.add || 0)) * it.qty) + '</b></div>'; }).join('');
    $('.js-icnt', dn).textContent = o.items.length;
    $('.js-sum', dn).textContent = won(o.sum); $('.js-dis', dn).textContent = '−' + won(o.dis); $('.js-cpnv', dn).textContent = '−' + won(o.cpn);
    $('.js-tot', dn).textContent = won(o.tot); $('.js-pt', dn).textContent = won(Math.round((o.sum - o.dis) / 100));
  }
})();
