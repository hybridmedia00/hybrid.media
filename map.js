// ─────────────────────────────────────────────
// 대회 지도 페이지(map.html)의 동작
// 모든 대회를 세계 지도 한 장에 핀으로 표시해요.
// ─────────────────────────────────────────────

// ── 1. 세계 지도 만들기 ──
const map = L.map("worldmap", { worldCopyJump: true }).setView([30, 120], 3);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(map);

// 핀들을 한 묶음(레이어)으로 관리해요. 필터가 바뀌면 묶음을 통째로 비우고 다시 꽂아요.
const pins = L.layerGroup().addTo(map);

// ── 2. 핀 다시 꽂기 ──
function render() {
  const list = filteredEvents();
  pins.clearLayers();

  list.forEach(function (ev) {
    // 종목 색깔로 칠한 동그라미 핀
    const pin = L.circleMarker([ev.lat, ev.lng], {
      radius: 9,
      color: "#111",
      weight: 2,
      fillColor: colorOf(ev.type),
      fillOpacity: 1
    });

    // 핀을 누르면 나오는 말풍선
    pin.bindPopup(`
      <strong>${ev.name}</strong>
      <div class="where">${formatDates(ev.start, ev.end)} · ${ev.city}, ${ev.country} · ${dDay(ev)}</div>
      <a class="btn" href="event.html?id=${ev.id}">자세히 보기</a>
    `);

    pins.addLayer(pin);
  });

  document.getElementById("result-count").textContent = "(" + list.length + "개)";

  // 보이는 핀이 모두 화면에 들어오도록 지도를 맞춰요
  if (list.length > 0) {
    const bounds = L.latLngBounds(list.map(function (ev) { return [ev.lat, ev.lng]; }));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
  }
}

// ── 3. 대회를 불러온 다음, 필터 버튼 만들고 핀 꽂기 ──
loadEvents().then(function () {
  setupFilters(render);
  render();
});
