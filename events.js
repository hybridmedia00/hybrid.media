// ─────────────────────────────────────────────
// 대회 목록 (사이트 전체가 이 파일 하나를 함께 씁니다)
//
// 달력 페이지(index.html)와 상세 페이지(event.html)가 모두
// 이 파일을 불러오기 때문에, 대회를 추가/수정할 때는 여기만 고치면 돼요.
//
// ⚠️ 지금은 연습용 예시 데이터입니다. 실제 대회로 바꿔서 쓰세요.
// [5강] config.js에 구글 시트 주소를 넣으면, 이 목록 대신 시트의 대회를 보여줘요.
// ─────────────────────────────────────────────
let EVENTS = [
  {
    id: "seoul-2026",                        // 주소에 쓰이는 고유 이름 (영어, 띄어쓰기 없이)
    name: "하이록스 서울 2026 (예시)",
    type: "하이록스",                 // 종목
    start: "2026-10-10",                      // 시작일
    end: "2026-10-11",                        // 종료일 (하루짜리 대회면 start와 똑같이)
    country: "대한민국",
    city: "고양",
    domestic: true,                           // 국내 대회면 true, 해외면 false
    venue: "킨텍스 제2전시장 9홀",
    address: "경기도 고양시 일산서구 킨텍스로 217-59",
    transport: "지하철 3호선 대화역에서 셔틀버스 약 10분 / 경의중앙선 킨텍스역 도보 약 10분",
    lat: 37.6686,                             // 위도 (지도에 핀을 꽂을 위치)
    lng: 126.7454,                            // 경도
    fee: "159,000원부터",
    deadline: "2026-09-30",                   // 신청 마감일
    link: "#",                                // 공식 신청 페이지 주소
    divisions: [                              // 참가 부문과 참가자 수
      { name: "엘리트 남자", count: 15 },
      { name: "엘리트 여자", count: 15 },
      { name: "프로 남자", count: 320 },
      { name: "프로 여자", count: 210 },
      { name: "오픈 남자", count: 640 },
      { name: "오픈 여자", count: 480 },
      { name: "더블 혼성", count: 520 },
      { name: "릴레이", count: 96 }
    ]
  },
  {
    id: "busan-2026",
    name: "어반웨이브 부산 (예시)",
    type: "어반웨이브",
    start: "2026-10-18",
    end: "2026-10-18",
    country: "대한민국",
    city: "부산",
    domestic: true,
    venue: "벡스코 제1전시장",
    address: "부산광역시 해운대구 APEC로 55",
    transport: "부산 지하철 2호선 센텀시티역 도보 약 5분",
    lat: 35.1690,
    lng: 129.1360,
    fee: "89,000원",
    deadline: "2026-10-05",
    link: "#",
    divisions: [
      { name: "개인 남자", count: 270 },
      { name: "개인 여자", count: 210 },
      { name: "팀 (2인)", count: 48 }
    ]
  },
  {
    id: "tokyo-2026",
    name: "하이록스 도쿄 (예시)",
    type: "하이록스",
    start: "2026-10-24",
    end: "2026-10-25",
    country: "일본",
    city: "도쿄",
    domestic: false,
    venue: "도쿄 빅사이트 남전시동",
    address: "3-11-1 Ariake, Koto City, Tokyo",
    transport: "나리타/하네다 공항에서 리무진 버스 약 40~70분 · 린카이선 고쿠사이텐지조역 도보 약 7분",
    lat: 35.6298,
    lng: 139.7942,
    fee: "¥18,000부터 (약 17만 원)",
    deadline: "2026-10-01",
    link: "#",
    divisions: [
      { name: "엘리트 남자", count: 14 },
      { name: "엘리트 여자", count: 14 },
      { name: "프로 남자", count: 410 },
      { name: "프로 여자", count: 290 },
      { name: "오픈 남자", count: 880 },
      { name: "오픈 여자", count: 700 },
      { name: "더블 남자", count: 360 },
      { name: "더블 여자", count: 240 },
      { name: "더블 혼성", count: 610 }
    ]
  },
  {
    id: "jeju-2026",
    name: "로어그릿 제주 (예시)",
    type: "로어그릿",
    start: "2026-11-08",
    end: "2026-11-08",
    country: "대한민국",
    city: "제주",
    domestic: true,
    venue: "중문색달해수욕장 일대",
    address: "제주특별자치도 서귀포시 중문관광로 일대",
    transport: "제주국제공항에서 리무진 버스 약 50분",
    lat: 33.2440,
    lng: 126.4120,
    fee: "120,000원",
    deadline: "2026-10-20",
    link: "#",
    divisions: [
      { name: "개인 남자", count: 350 },
      { name: "개인 여자", count: 260 },
      { name: "팀 (3인)", count: 45 }
    ]
  },
  {
    id: "singapore-2026",
    name: "하이록스 싱가포르 (예시)",
    type: "하이록스",
    start: "2026-11-21",
    end: "2026-11-22",
    country: "싱가포르",
    city: "싱가포르",
    domestic: false,
    venue: "마리나 베이 샌즈 엑스포",
    address: "10 Bayfront Ave, Singapore",
    transport: "창이 공항에서 택시 약 20분 · MRT 베이프런트역 도보 약 5분",
    lat: 1.2834,
    lng: 103.8607,
    fee: "S$180부터 (약 19만 원)",
    deadline: "2026-11-01",
    link: "#",
    divisions: [
      { name: "프로 남자", count: 280 },
      { name: "프로 여자", count: 190 },
      { name: "오픈 남자", count: 520 },
      { name: "오픈 여자", count: 430 },
      { name: "더블 혼성", count: 380 }
    ]
  },
  {
    id: "sydney-2026",
    name: "파워게임즈 시드니 (예시)",
    type: "파워게임즈",
    start: "2026-12-05",
    end: "2026-12-06",
    country: "호주",
    city: "시드니",
    domestic: false,
    venue: "ICC 시드니",
    address: "14 Darling Dr, Sydney NSW",
    transport: "시드니 공항에서 기차 약 20분 · 타운홀역 도보 약 12분",
    lat: -33.8740,
    lng: 151.1990,
    fee: "A$150 (약 13만 원)",
    deadline: "2026-11-15",
    link: "#",
    divisions: [
      { name: "개인 남자", count: 160 },
      { name: "개인 여자", count: 110 },
      { name: "팀 (4인)", count: 36 }
    ]
  }
];

// 종목마다 색깔을 정해 둡니다 (달력, 배지, 필터 버튼에 쓰여요)
// 여기에 적힌 순서대로 첫 화면에 필터 버튼이 나와요
const TYPE_COLORS = {
  "하이록스": "#ffd400",     // 노랑
  "어반웨이브": "#4da3ff",   // 파랑
  "로어그릿": "#ff6b3d",     // 주황
  "파워게임즈": "#3ddc97"    // 초록
};
