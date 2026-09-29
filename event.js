// ─────────────────────────────────────────────
// 대회 상세 페이지(event.html)의 동작
//
// 주소가 event.html?id=seoul-2026 이라면
// 대회 목록에서 id가 "seoul-2026"인 대회를 찾아 화면에 보여줍니다.
// ─────────────────────────────────────────────

// [6강] 구글 캘린더에 추가하는 주소 만들기
function googleCalendarLink(ev) {
  const dates = ev.start.replaceAll("-", "") + "/" + nextDay(ev.end).replaceAll("-", "");
  return "https://calendar.google.com/calendar/render?action=TEMPLATE"
    + "&text=" + encodeURIComponent(ev.name)
    + "&dates=" + dates
    + "&location=" + encodeURIComponent(ev.venue + ", " + ev.address)
    + "&details=" + encodeURIComponent(location.href);
}

// [6강] 아이폰/아웃룩 캘린더용 .ics 파일을 만들어서 내려받게 하기
function downloadIcs(ev) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HYBRID KR//KO",
    "BEGIN:VEVENT",
    "UID:" + ev.id + "@hybrid-kr",
    "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
    "DTSTART;VALUE=DATE:" + ev.start.replaceAll("-", ""),
    "DTEND;VALUE=DATE:" + nextDay(ev.end).replaceAll("-", ""),
    "SUMMARY:" + ev.name,
    "LOCATION:" + ev.venue + "\\, " + ev.address.replaceAll(",", "\\,"),
    "URL:" + location.href,
    "END:VEVENT",
    "END:VCALENDAR"
  ];
  const file = new Blob([lines.join("\r\n")], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = ev.id + ".ics";
  a.click();
}

// [6강] 공유하기: 폰에서는 카톡 등 공유 창을 열고, 컴퓨터에서는 주소를 복사해요
function share(ev, button) {
  if (navigator.share) {
    navigator.share({ title: ev.name, url: location.href });
  } else {
    navigator.clipboard.writeText(location.href);
    button.textContent = "✅ 주소 복사됨";
  }
}

function showEvent() {
  // ── 1. 주소에서 id 꺼내서 대회 찾기 ──
  const id = new URLSearchParams(location.search).get("id");
  const ev = EVENTS.find(function (item) { return item.id === id; });
  const box = document.getElementById("event");

  if (!ev) {
    // 대회를 못 찾았을 때
    box.innerHTML = '<p class="not-found">대회를 찾을 수 없어요. <a href="index.html"><u>일정으로 돌아가기</u></a></p>';
    return;
  }

  document.title = ev.name + " | 하이브리드 캘린더";

  // 전체 참가자 수 = 부문별 참가자 수를 모두 더한 값
  const total = ev.divisions.reduce(function (sum, d) { return sum + d.count; }, 0);
  const status = deadlineStatus(ev);

  // 부문 목록 한 줄씩 만들기
  let rows = "";
  ev.divisions.forEach(function (d) {
    rows += `
      <div class="row">
        <div class="name">${d.name}</div>
        <div class="num">${d.count.toLocaleString()}명</div>
        <span class="btn-ghost">순위</span>
      </div>
    `;
  });

  // 국내 대회는 네이버 지도, 해외 대회는 구글 지도를 먼저 보여줘요
  const naverLink = "https://map.naver.com/p/search/" + encodeURIComponent(ev.address);
  const googleLink = `https://www.google.com/maps/search/?api=1&query=${ev.lat},${ev.lng}`;
  const mapButtons = ev.domestic
    ? `<a class="btn" href="${naverLink}" target="_blank">네이버 지도에서 보기</a>
       <a class="btn btn-ghost" href="${googleLink}" target="_blank">구글 지도</a>`
    : `<a class="btn" href="${googleLink}" target="_blank">구글 지도에서 보기</a>`;

  // 신청이 마감됐으면 신청 버튼을 흐리게
  const applyButton = status.cls === "closed"
    ? `<span class="btn disabled">신청 마감</span>`
    : `<a class="btn" href="${ev.link}" target="_blank">참가 신청하기</a>`;

  // ── 2. 카드 안에 내용 채우기 ──
  box.innerHTML = `
    <span class="badge" style="background:${colorOf(ev.type)}">${ev.type}</span>
    <span class="tag dday">${dDay(ev)}</span>
    <h1>${ev.name} <span class="count">(${total.toLocaleString()}명)</span></h1>
    <p class="meta"><b>${formatDates(ev.start, ev.end)}</b>${ev.domestic ? "🇰🇷" : "🌏"} ${ev.city}, ${ev.country}</p>

    <div class="info-row">
      <div class="info-box"><small>참가비</small><strong>${ev.fee}</strong></div>
      <div class="info-box">
        <small>신청 마감 · <span class="status-${status.cls}">${status.text}</span></small>
        <strong>${formatDates(ev.deadline, ev.deadline)}</strong>
      </div>
      ${applyButton}
    </div>

    <div class="action-row">
      <a class="chip" href="${googleCalendarLink(ev)}" target="_blank">📅 구글 캘린더에 추가</a>
      <button class="chip" id="ics-btn">🍎 아이폰 캘린더에 추가</button>
      <button class="chip" id="share-btn">🔗 공유하기</button>
    </div>

    <div class="tabs">
      <button class="active" data-tab="divisions">☰ 부문</button>
      <button data-tab="venue">🏟 경기장</button>
      <button data-tab="location">📍 위치</button>
    </div>

    <div class="panel active" id="divisions">${rows || '<p class="not-found">부문 정보가 아직 없어요</p>'}</div>

    <div class="panel venue" id="venue">
      <dl>
        <dt>경기장</dt><dd>${ev.venue}</dd>
        <dt>주소</dt><dd>${ev.address}</dd>
        <dt>가는 방법</dt><dd>${ev.transport || "-"}</dd>
      </dl>
    </div>

    <div class="panel" id="location">
      <div id="map"></div>
      <div class="map-links">${mapButtons}</div>
    </div>
  `;

  document.getElementById("ics-btn").addEventListener("click", function () { downloadIcs(ev); });
  document.getElementById("share-btn").addEventListener("click", function () { share(ev, this); });

  // ── 3. 탭 누르면 화면 바꾸기 ──
  let map = null;

  document.querySelectorAll(".tabs button").forEach(function (button) {
    button.addEventListener("click", function () {
      // 모든 탭과 화면을 끄고
      document.querySelectorAll(".tabs button, .panel").forEach(function (el) {
        el.classList.remove("active");
      });
      // 누른 탭과 그 화면만 켜요
      button.classList.add("active");
      document.getElementById(button.dataset.tab).classList.add("active");

      // 위치 탭을 처음 열 때 지도를 만들어요
      if (button.dataset.tab === "location" && !map) {
        map = L.map("map").setView([ev.lat, ev.lng], 14);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        L.marker([ev.lat, ev.lng]).addTo(map).bindPopup(`<b>${ev.venue}</b>`).openPopup();
      }
    });
  });
}

// 대회를 불러온 다음 화면에 보여주기
loadEvents().then(showEvent);
