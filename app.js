// ─────────────────────────────────────────────
// 홈 화면(index.html)의 동작
// 대회 데이터는 events.js(또는 구글 시트), 공통 도구는 common.js,
// 필터 기능은 filters.js에 있어요.
// ─────────────────────────────────────────────

// 대회 하나를 달력이 알아듣는 모양으로 바꾸는 도구
function toCalendarEvent(ev) {
  return {
    title: (ev.domestic ? "🇰🇷 " : "🌏 ") + ev.name,
    start: ev.start,
    end: nextDay(ev.end),
    color: colorOf(ev.type),
    url: "event.html?id=" + ev.id      // 클릭하면 상세 페이지로 이동
  };
}

// ── 1. 달력 만들기 (처음에는 비어 있어요) ──
const calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
  locale: "ko",
  initialView: "dayGridMonth",
  height: "auto",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,listMonth"
  }
});

calendar.render();

// ── 2. 화면 전체를 다시 그리는 함수 ──
// 필터 버튼을 누를 때마다 이 함수가 실행돼요.
function render() {
  const list = filteredEvents();   // 필터에 맞는 대회만 가져오기

  // (1) 달력: 기존 대회를 지우고 새로 넣기
  calendar.removeAllEvents();
  list.forEach(function (ev) {
    calendar.addEvent(toCalendarEvent(ev));
  });

  // (2) 다가오는 대회 목록
  const today = todayText();

  const upcoming = list
    .filter(function (ev) { return ev.end >= today; })            // 아직 안 끝난 대회만
    .sort(function (a, b) { return a.start < b.start ? -1 : 1; }); // 날짜 순서대로

  let html = "";
  upcoming.forEach(function (ev) {
    const month = Number(ev.start.slice(5, 7));
    const day = Number(ev.start.slice(8, 10));
    const status = deadlineStatus(ev);

    html += `
      <a class="event-item" href="event.html?id=${ev.id}">
        <div class="date-box">
          <div class="m">${month}월</div>
          <div class="d">${day}</div>
        </div>
        <div>
          <div><strong>${ev.name}</strong></div>
          <div class="where">${ev.domestic ? "🇰🇷" : "🌏"} ${ev.city}, ${ev.country} · ${ev.type}</div>
          <div class="tags">
            <span class="tag dday">${dDay(ev)}</span>
            <span class="tag ${status.cls}">${status.text}</span>
          </div>
        </div>
        <span class="btn-ghost">자세히</span>
      </a>
    `;
  });

  document.getElementById("upcoming").innerHTML =
    html || '<p class="not-found">조건에 맞는 대회가 없어요</p>';
  document.getElementById("result-count").textContent = upcoming.length + "개";
}

// ── 3. 대회를 불러온 다음, 필터 버튼 만들고 화면 그리기 ──
loadEvents().then(function () {
  setupFilters(render);
  render();
});
