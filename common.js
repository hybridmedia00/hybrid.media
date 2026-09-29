// ─────────────────────────────────────────────
// 모든 페이지가 함께 쓰는 도구 모음
// ─────────────────────────────────────────────

// ── 날짜 도구 ──

// 오늘 날짜를 "2026-09-29" 모양으로
function todayText() {
  return new Date().toLocaleDateString("sv-SE");
}

// 날짜 글자에 하루 더하기 (달력은 "끝나는 날의 다음 날"을 적어야 해요)
function nextDay(dateText) {
  const d = new Date(dateText);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

// 두 날짜 사이가 며칠인지
function daysBetween(fromText, toText) {
  return Math.round((new Date(toText) - new Date(fromText)) / 86400000);
}

// "10월 10–11일" 같은 모양으로
function formatDates(start, end) {
  const sm = Number(start.slice(5, 7)), sd = Number(start.slice(8, 10));
  const em = Number(end.slice(5, 7)), ed = Number(end.slice(8, 10));
  if (start === end) return `${sm}월 ${sd}일`;
  if (sm === em) return `${sm}월 ${sd}–${ed}일`;
  return `${sm}월 ${sd}일 – ${em}월 ${ed}일`;
}

// [6강] 대회까지 남은 날: "D-11", "D-DAY", "진행 중", "종료"
function dDay(ev) {
  const today = todayText();
  if (today > ev.end) return "종료";
  if (today >= ev.start) return ev.start === ev.end ? "D-DAY" : "진행 중";
  return "D-" + daysBetween(today, ev.start);
}

// [6강] 신청 상태: 마감 7일 전부터 "마감 임박"
function deadlineStatus(ev) {
  const left = daysBetween(todayText(), ev.deadline);
  if (left < 0) return { text: "신청 마감", cls: "closed" };
  if (left <= 7) return { text: `마감 임박 · ${left === 0 ? "오늘" : left + "일 남음"}`, cls: "soon" };
  return { text: "신청 가능", cls: "open" };
}

// 종목 색깔 (목록에 없는 종목은 회색)
function colorOf(type) {
  return TYPE_COLORS[type] || "#9a9aa0";
}

// ─────────────────────────────────────────────
// [5강] 구글 스프레드시트에서 대회 불러오기
// ─────────────────────────────────────────────

// 시트 맨 윗줄(제목)과 대회 정보 이름을 짝지어요
const SHEET_COLUMNS = {
  "아이디": "id",
  "대회명": "name",
  "종목": "type",
  "시작일": "start",
  "종료일": "end",
  "국가": "country",
  "도시": "city",
  "국내해외": "domestic",
  "경기장": "venue",
  "주소": "address",
  "가는방법": "transport",
  "위도": "lat",
  "경도": "lng",
  "참가비": "fee",
  "신청마감": "deadline",
  "신청링크": "link",
  "부문": "divisions"
};

// CSV 글자를 표(줄 × 칸) 모양으로 나누기
// 칸 안에 쉼표가 있으면 "따옴표"로 감싸져 오기 때문에 그 경우도 처리해요
function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }  // "" 는 따옴표 한 개
      else if (c === '"') inQuotes = false;                        // 따옴표 끝
      else cell += c;
    } else if (c === '"') inQuotes = true;                         // 따옴표 시작
    else if (c === ",") { row.push(cell); cell = ""; }             // 다음 칸
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; } // 다음 줄
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

// 시트 한 줄을 대회 하나로 바꾸기
function rowToEvent(headers, row) {
  const ev = {};
  headers.forEach(function (header, i) {
    const key = SHEET_COLUMNS[header.trim()];
    if (key) ev[key] = (row[i] || "").trim();
  });

  // 글자를 알맞은 모양으로 바꿔요
  ev.domestic = ev.domestic !== "해외";                 // "국내" → true, "해외" → false
  ev.lat = Number(ev.lat);
  ev.lng = Number(ev.lng);
  ev.end = ev.end || ev.start;                          // 종료일이 비어 있으면 하루짜리 대회
  ev.deadline = ev.deadline || ev.start;
  ev.link = ev.link || "#";

  // "엘리트 남자:15 / 프로 남자:320" → [{name, count}, ...]
  ev.divisions = (ev.divisions || "").split("/").filter(Boolean).map(function (part) {
    const [name, count] = part.split(":");
    return { name: name.trim(), count: Number(count) || 0 };
  });

  return ev;
}

// 대회 목록 불러오기: 시트 주소가 있으면 시트에서, 없으면 events.js에서
function loadEvents() {
  if (!CONFIG.SHEET_CSV_URL) return Promise.resolve(EVENTS);

  return fetch(CONFIG.SHEET_CSV_URL)
    .then(function (res) { return res.text(); })
    .then(function (text) {
      const rows = parseCsv(text);
      const headers = rows[0];
      EVENTS = rows.slice(1)
        .map(function (row) { return rowToEvent(headers, row); })
        .filter(function (ev) { return ev.id && ev.name && ev.start; }); // 빈 줄은 건너뛰기
      return EVENTS;
    })
    .catch(function (err) {
      // 시트를 못 불러오면 예시 데이터라도 보여줘요
      console.warn("구글 시트를 불러오지 못했어요:", err);
      return EVENTS;
    });
}

// ─────────────────────────────────────────────
// [6강] 메뉴에 "대회 제보" 링크 보여주기
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  const link = document.getElementById("report-link");
  if (link && CONFIG.REPORT_FORM_URL) {
    link.href = CONFIG.REPORT_FORM_URL;
    link.hidden = false;
  }
});
