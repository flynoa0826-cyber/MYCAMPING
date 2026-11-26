/* 계절 추천 데이터 (Figma SeasonSection 기준) */
window.SEASONS = {
  '겨울': { bg: '866bd71702f81ed7e2d28dc7eceebbfc6a843bdf', mbg: 'dddd7f0aceb67879441ae84a23839c01d7d72fd6', title: '겨울 캠핑,\n온기부터 준비하세요', desc: '난로와 침낭, 바람을 막아 줄 리빙쉘까지.\n이번 계절에 필요한 장비를 모았습니다.', items: [
    { brand: '토요토미', name: '토요토미 옴니 230 난로 세트', spec: '대류형 · 심지식', disc: '12%', price: '361,000원', img: '5edcd31e9ec39eb98e62d8e21da1a2910a70300d' },
    { brand: '몽벨', name: '몽벨 스텔라릿지 3 스노우플라이', spec: '3인 · 4계절 플라이', price: '268,000원', img: '16b908387f502f8699abbcf9bf89ff6ea8ff9655' },
    { brand: '데오스', name: '데오스 에코다운 사각침낭 올리브', spec: '사각형 · 1,500 g', disc: '14%', price: '111,000원', img: '25d5e7a1dac1b35d2004fdf99d3e032af3f78b20' },
    { brand: '콜맨', name: '콜맨 인스턴트 업돔 240', spec: '3인 · 원터치 · 3계절', price: '698,000원', img: 'b11cac485d22e6b4b8d3590fd451bb7940243b22' } ] },
  '봄': { bg: '734149e1d42df1afed28eb5f82865c6e256d256d', mbg: '734149e1d42df1afed28eb5f82865c6e256d256d', title: '봄 캠핑,\n가볍게 시작하세요', desc: '타프와 테이블, 첫 피크닉 캠핑에 필요한 장비.\n가볍게 떠나기 좋은 장비를 모았습니다.', items: [
    { brand: '하임플래닛', name: '하임플래닛 HPT 더스크 타프 카모', spec: '4인 · 에어 프레임', price: '578,000원', img: 'cb00a3d266536a5f508525b70b3c27faad1627c8' },
    { brand: 'HXO', name: 'HXO 미니 라운드 테이블 블랙', spec: '원형 · 알루미늄', price: '258,000원', img: 'e4a01c040897542e724d6559c189e12e4d4fe307' },
    { brand: '폴러스터프', name: '폴러스터프 원맨 텐트 구머 브라운', spec: '1인 · 경량 · 백패킹', price: '958,000원', img: 'f7b852acb993efa3676c9734a90a8273f2dafd14' },
    { brand: '콜맨', name: '콜맨 투어링 돔 LX+', spec: '2인 · 전실형 · 3계절', price: '490,000원', img: '486a4f30512190bc040f44f538a33eba2bc36558' } ] },
  '여름': { bg: 'd5dd68a2b56715f1c70641bd9361c302c1aaab14', mbg: 'd5dd68a2b56715f1c70641bd9361c302c1aaab14', title: '여름 캠핑,\n그늘부터 챙기세요', desc: '통풍 좋은 텐트와 그늘막, 더위를 피하는 장비.\n시원하게 머물 수 있는 장비를 모았습니다.', items: [
    { brand: '헬리녹스', name: '헬리녹스 알파인돔 2P 블랙아웃', spec: '2인 · 경량 · 3계절', disc: '11%', price: '689,000원', img: '4d9e288891d7d80206740eccb70bbb3d68a1bb93' },
    { brand: '스노우라인', name: '스노우라인 팝업 패밀리 4', spec: '4인 · 팝업 · 3계절', price: '979,000원', img: '51277b9e815b0917da65d96983c5bc00f506a3b6' },
    { brand: '디얼스', name: '디얼스 지오 에어 4 블랙', spec: '4인 · 에어 프레임 · 3계절', price: '1,290,000원', img: 'a631530ea601f01bc55e6378de7c2143e835b622' },
    { brand: '제이크라', name: '제이크라 제이 터널 샌드', spec: '4인 · 터널형 · 3계절', price: '871,000원', img: 'd51ccce971cc3988435ade0a09887c6c4a2afaf5' } ] },
  '가을': { bg: '97a4d4db7d59b51f2f09387f6e1865d09d85db46', mbg: '97a4d4db7d59b51f2f09387f6e1865d09d85db46', title: '가을 캠핑,\n불멍의 계절입니다', desc: '화목난로와 면 텐트, 쌀쌀한 밤을 위한 장비.\n불멍과 함께할 장비를 모았습니다.', items: [
    { brand: '텐트마크디자인', name: '텐트마크디자인 서커스 코튼', spec: '4인 · 면 · 원폴', disc: '15%', price: '179,000원', img: '2632c4d5b7830cf85c0f2039812a5075283daf6e' },
    { brand: '그라운드커버', name: '그라운드커버 아콘하우스 3.45 탄', spec: '4인 · TC · 연통구', price: '320,000원', img: '7affe60e3687b5ad35bca9eb7eeee2b36084314e' },
    { brand: '위너웰', name: '위너웰 노매드 뷰 우드스토브', spec: '화목난로 · 유리창', disc: '11%', price: '319,000원', img: '0c44b3f943d148d8dc761162ee7c8b2453be4215' },
    { brand: '콜맨', name: '콜맨 터널 2룸 하우스 LDX', spec: '5인 · 2룸 · 3계절', disc: '15%', price: '958,000원', img: '4fabd6ef98bdee38bab9ccbd4fa073546e671c3b' } ] }
};
