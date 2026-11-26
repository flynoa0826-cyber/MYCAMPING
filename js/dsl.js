/* Interaction layer for Figma-rendered (DSL) page bodies */
(function () {
  var roots = document.querySelectorAll('.dsl');
  if (!roots.length) return;
  function fit() { var w = Math.min(window.innerWidth, 767) / 375; document.querySelectorAll('.mdsl .mz').forEach(function (z) { z.style.zoom = w; }); }
  fit(); window.addEventListener('resize', fit);
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove('on'); }, 1800);
  }
  var CODE = { 'MY-01': 'orders.html', 'MY-02': 'order-detail.html', 'MY-03': 'claim.html', 'MY-04': 'coupon.html', 'MY-05': 'point.html', 'MY-06': 'wishlist.html', 'MY-07': 'recent.html', 'MY-08': 'myreview.html', 'MY-09': 'myqna.html', 'MY-10': 'profile.html', 'MY-11': 'address.html', 'MY-12': 'withdraw.html', 'MYC-02': 'mycar.html', 'CS-01': 'notice.html', 'CS-02': 'faq.html', 'CS-03': 'qna.html' };
  var TEXT = {
    '주문 · 배송 조회': 'orders.html', '취소 · 교환 · 반품': 'claim.html', '교환 · 반품 신청': 'claim.html', '취소 신청': 'claim.html', '반품 신청': 'claim.html', '교환 신청': 'claim.html',
    '주문 상세': 'order-detail.html', '주문상세': 'order-detail.html', '주문 목록': 'orders.html', '주문 내역 보기': 'orders.html', '주문 조회': 'orders.html',
    '찜': 'wishlist.html', '최근 본 상품': 'recent.html', '상품 문의': 'myqna.html', '내 차 · 사이트 관리': 'mycar.html', '내 차 · 사이트': 'mycar.html', '관리하기': 'mycar.html',
    '회원 정보 수정': 'profile.html', '배송지 관리': 'address.html', '회원 탈퇴': 'withdraw.html', '적립금 내역': 'point.html', '쿠폰함': 'coupon.html',
    '공지사항': 'notice.html', '자주 묻는 질문': 'faq.html', '1:1 문의': 'qna.html', '문의하기': 'qna-write.html', '1:1 문의하기': 'qna-write.html', '문의 작성': 'qna-write.html',
    '로그인': 'login.html', '회원 로그인': 'login.html', '로그인하기': 'login.html', '로그인 하기': 'login.html', '회원가입': 'join.html', '회원 가입': 'join.html', '아이디 찾기': 'find.html', '비밀번호 찾기': 'pw-find.html', '비밀번호 재설정': 'pw-reset.html',
    '비회원 주문 조회': 'guest-order.html', '주문 조회하기': 'guest-result.html', '다음': null, '쇼핑 계속하기': 'list.html', '쇼핑하러 가기': 'list.html', '상품 보러 가기': 'list.html', '메인으로': 'index.html', '홈으로': 'index.html', '메인으로 가기': 'index.html', '홈으로 가기': 'index.html',
    '장바구니': 'cart.html', '장바구니로': 'cart.html', '리뷰 쓰기': 'review-write.html', '리뷰 작성': 'review-write.html', '목록': null, '목록으로': null, '이전 페이지': null,
    '기획전': 'event.html', '캠핑 저널': 'journal.html', '크기 비교': 'compare.html', '다시 결제하기': 'order.html', '결제 다시 시도': 'order.html', '내 차 등록하기': 'join-car.html', '나중에 등록': 'join-done.html', '건너뛰기': 'join-done.html', '시작하기': 'index.html'
  };
  var MSG = { '저장': '저장되었습니다.', '삭제': '삭제되었습니다.', '선택 삭제': '선택한 상품을 삭제했습니다.', '전체 삭제': '모두 삭제했습니다.', '등록': '등록되었습니다.', '쿠폰 등록': '쿠폰이 등록되었습니다.', '취소': null, '수정': '수정 화면은 준비 중입니다.', '신청하기': '신청이 접수되었습니다.', '인증번호 받기': '인증번호를 보냈습니다.', '인증번호 전송': '인증번호를 보냈습니다.', '확인': '확인되었습니다.', '중복 확인': '사용할 수 있습니다.', '복사': '복사되었습니다.', '쿠폰 받기': '쿠폰을 받았습니다.', '다운로드': '쿠폰을 받았습니다.' };
  var BTN = /^(Button|버튼|link:|링크|Tab|Chip|항목|메뉴|LNB|Pagination|[0-9]+|‹|›|«|»)/;
  function go(u) { if (u === 'login.html' && /login\.html$/.test(location.pathname)) { try { localStorage.setItem('mc_login', '1'); } catch (e) {} u = 'index.html'; } if (u === null) { history.length > 1 ? history.back() : location.href = 'index.html'; } else location.href = u; }
  function clickable(el, fn) { el.style.cursor = 'pointer'; el.setAttribute('role', el.getAttribute('role') || 'button'); el.tabIndex = 0; el.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn(e); }); el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); } }); }
  function swap(a, b) { if (a === b) return; var A = [a].concat([].slice.call(a.querySelectorAll('*'))), B = [b].concat([].slice.call(b.querySelectorAll('*'))); if (A.length !== B.length) { var sa = a.getAttribute('style'); a.setAttribute('style', b.getAttribute('style')); b.setAttribute('style', sa); return; } for (var i = 0; i < A.length; i++) { var s = A[i].getAttribute('style'); var t = B[i].getAttribute('style'); if (s !== null && t !== null) { A[i].setAttribute('style', t); B[i].setAttribute('style', s); } } }
  function sig(el) { return [el].concat([].slice.call(el.querySelectorAll('*'))).map(function (x) { return (x.getAttribute('style') || '').replace(/width:[^;]*;|flex:[^;]*;/g, ''); }).join('|'); }
  function activeOf(group) { var c = {}; group.forEach(function (g) { var s = sig(g); c[s] = (c[s] || 0) + 1; }); var odd = group.filter(function (g) { return c[sig(g)] === 1; }); return odd.length === 1 ? odd[0] : null; }
  function groupSwap(group) { if (group.length < 2) return; var act = activeOf(group); if (!act) return; group.forEach(function (g) { clickable(g, function () { var a = activeOf(group) || act; if (a !== g) { swap(a, g); } }); }); }
  document.addEventListener('click', function (e) {
    var f = e.target.closest('.js-filter'), so = e.target.closest('.js-sort'), r = e.target.closest('#sh-sort [data-sort]');
    if (f) { var s1 = document.getElementById('sh-filter'); if (s1) s1.classList.add('on'); }
    if (so) { var s2 = document.getElementById('sh-sort'); if (s2) s2.classList.add('on'); }
    if (r) { document.querySelectorAll('.js-sortlabel').forEach(function (l) { l.textContent = r.dataset.sort; }); document.querySelectorAll('#sh-sort [data-sort]').forEach(function (x) { x.classList.toggle('on', x === r); }); r.closest('.sheet').classList.remove('on'); }
  });
  roots.forEach(function (root) {
    // linked screens
    root.querySelectorAll('[data-n^="link:"]').forEach(function (el) { var u = CODE[el.getAttribute('data-n').slice(5)]; if (u) clickable(el, function () { go(u); }); });
    // fields
    root.querySelectorAll('[data-n="Field"],[data-n="Textarea"]').forEach(function (f) {
      var p = f.querySelector('p'); if (!p) return; var ta = f.getAttribute('data-n') === 'Textarea';
      var txt = p.textContent; var col = getComputedStyle(p).color.match(/\d+/g).map(Number); var ph = (col[0] + col[1] + col[2]) / 3 > 140;
      var inp = document.createElement(ta ? 'textarea' : 'input');
      if (!ta) inp.type = /비밀번호/.test(txt + (f.parentNode.textContent || '')) && /•|비밀번호/.test(txt) ? 'password' : 'text';
      if (ph) inp.placeholder = txt; else inp.value = txt;
      inp.setAttribute('style', p.getAttribute('style') + ';border:0;outline:0;background:transparent;flex:1 1 0;min-width:0;width:100%;white-space:normal;resize:none;' + (ta ? 'height:100%;' : ''));
      inp.setAttribute('aria-label', (f.closest('[data-n="Input"]') || f).textContent.trim().slice(0, 30) || txt);
      p.replaceWith(inp); f.style.cursor = 'text'; f.addEventListener('click', function () { inp.focus(); });
      inp.addEventListener('focus', function () { f.style.borderColor = '#4a3aa8'; }); inp.addEventListener('blur', function () { f.style.borderColor = ''; });
    });
    // checkboxes
    root.querySelectorAll('[data-n="Checkbox"]').forEach(function (cb) {
      var c = cb.querySelector('[data-n="Control"]') || cb.firstElementChild; if (!c) return; var on0 = c.getAttribute('style');
      var on = /background:#4a3aa8|background:#14123a/.test(on0);
      var off = on0.replace(/background:[^;]*;/, 'background:#ffffff;') + 'border:1px solid #b9b6d6;';
      clickable(cb, function () { on = !on; c.setAttribute('style', on ? on0.replace('border:1px solid #b9b6d6;', '') + (on0.indexOf('background:#ffffff') > -1 ? 'background:#4a3aa8;border:0;' : '') : off); [].forEach.call(c.children, function (k) { k.style.visibility = on ? '' : 'hidden'; }); cb.setAttribute('aria-checked', on); });
      cb.setAttribute('role', 'checkbox'); cb.setAttribute('aria-checked', on);
      if (!on) [].forEach.call(c.children, function (k) { k.style.visibility = 'hidden'; });
    });
    // toggles
    root.querySelectorAll('[data-n="Toggle"]').forEach(function (t) {
      var c = t.querySelector('[data-n="Control"]'); if (!c) return; var s0 = c.getAttribute('style'); var on = /flex-end/.test(s0);
      var sOn = on ? s0 : s0.replace(/justify-content:[^;]*;/, '') + 'justify-content:flex-end;background:#b8ff3b;';
      var sOff = on ? s0.replace(/justify-content:[^;]*;/, 'justify-content:flex-start;').replace(/background:[^;]*;/, 'background:#d9d7e6;').replace(/box-shadow:[^;]*;/, '') : s0;
      t.setAttribute('role', 'switch'); t.setAttribute('aria-checked', on);
      clickable(t, function () { on = !on; c.setAttribute('style', on ? sOn : sOff); t.setAttribute('aria-checked', on); });
    });
    // radios: group rows by common parent of parent
    var radios = [].slice.call(root.querySelectorAll('[data-n="라디오"]'));
    var groups = new Map();
    radios.forEach(function (r) { var g = r.parentNode.parentNode; if (g && g.parentNode && g.parentNode.querySelectorAll('[data-n="라디오"]').length > g.querySelectorAll('[data-n="라디오"]').length && g.querySelectorAll('[data-n="라디오"]').length < 4) g = g.parentNode; if (!groups.has(g)) groups.set(g, []); groups.get(g).push(r.parentNode); });
    groups.forEach(function (rows) { groupSwap(rows); });
    // tab / chip / pagination groups (siblings with same data-n)
    var seen = new Set();
    root.querySelectorAll('[data-n="Tab"],[data-n="Chip"],[data-n="Pagination"] > *,[data-n="페이지네이션"] > *').forEach(function (el) {
      var par = el.parentNode; var key = par; if (seen.has(key + el.getAttribute('data-n'))) return;
      var sibs = [].slice.call(par.children).filter(function (s) { return s.getAttribute('data-n') === el.getAttribute('data-n') && !/[‹›«»]/.test(s.textContent); });
      seen.add(key + el.getAttribute('data-n')); var nav = sibs.filter(function (x) { return Object.prototype.hasOwnProperty.call(TEXT, x.textContent.trim()) && TEXT[x.textContent.trim()]; });
      if (nav.length === sibs.length) { sibs.forEach(function (x) { var u = TEXT[x.textContent.trim()]; if (location.pathname.split('/').pop() !== u) clickable(x, function () { go(u); }); else x.setAttribute('role', 'tab'); }); return; }
      if (sibs.length > 1) groupSwap(sibs);
    });
    // stars
    root.querySelectorAll('[data-n="별점"]').forEach(function (g) {
      var st = [].slice.call(g.children); st.forEach(function (s, i) { clickable(s, function () { st.forEach(function (x, j) { x.style.opacity = j <= i ? '1' : '.25'; }); }); });
    });
    // text-mapped buttons
    root.querySelectorAll('p,a').forEach(function (p) {
      if (p.closest('[role]')) return; var t = p.textContent.trim(); if (!t) return;
      var host = p, k = 0; while (host.parentNode && k < 3 && !BTN.test(host.getAttribute('data-n') || '')) { host = host.parentNode; k++; }
      if (!BTN.test(host.getAttribute('data-n') || '')) host = null;
      if (Object.prototype.hasOwnProperty.call(TEXT, t)) { var el = host || p; if (!el.getAttribute('role')) clickable(el, function () { go(TEXT[t]); }); return; }
      if (host && !host.getAttribute('role') && /^(Button|버튼)/.test(host.getAttribute('data-n'))) {
        clickable(host, function () { if (Object.prototype.hasOwnProperty.call(MSG, t)) { if (MSG[t] === null) go(null); else toast(MSG[t]); } else toast(t + ' 요청이 완료되었습니다.'); });
      }
    });
  });
})();

/* _07 search query reflect */
(function () {
  if (!/search\.html$/.test(location.pathname)) return;
  var q = new URLSearchParams(location.search).get('q'); if (!q) return;
  setTimeout(function () {
    document.querySelectorAll('.dsl input').forEach(function (i) { if (i.value === '텐트') i.value = q; });
    document.querySelectorAll('.dsl p').forEach(function (p) { if (p.textContent.trim() === '‘텐트’ 검색 결과') p.textContent = '‘' + q + '’ 검색 결과'; });
  }, 0);
})();
