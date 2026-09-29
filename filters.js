// ─────────────────────────────────────────────
// 필터 기능 (홈 화면과 지도 화면이 함께 씁니다)
//
// 버튼을 누르면 "지금 어떤 걸 골랐는지"를 filter에 기억해 두고,
// 그 조건에 맞는 대회만 골라서 돌려줘요.
// ─────────────────────────────────────────────

// 지금 선택된 필터 (처음에는 모두 "전체")
const filter = {
  region: "전체",   // 전체 / 국내 / 해외
  type: "전체",     // 전체 / 하이브리드 레이스 / 크로스핏 / ...
  search: ""        // [6강] 검색어
};

// 필터 조건에 맞는 대회만 골라서 돌려주는 도구
function filteredEvents() {
  const word = filter.search.trim().toLowerCase();

  return EVENTS.filter(function (ev) {
    if (filter.region === "국내" && !ev.domestic) return false;
    if (filter.region === "해외" && ev.domestic) return false;
    if (filter.type !== "전체" && ev.type !== filter.type) return false;

    // 검색어가 대회명, 도시, 국가, 경기장 중 어디에도 없으면 빼기
    if (word) {
      const text = [ev.name, ev.city, ev.country, ev.venue].join(" ").toLowerCase();
      if (!text.includes(word)) return false;
    }
    return true;
  });
}

// 필터 버튼들을 화면에 그리고, 바뀔 때마다 onChange를 실행해요
function setupFilters(onChange) {
  const regions = ["전체", "국내", "해외"];

  // 종목 목록은 실제 대회들에서 모아요 (시트에 새 종목을 적으면 버튼도 자동으로 생겨요)
  const types = ["전체"];
  EVENTS.forEach(function (ev) {
    if (!types.includes(ev.type)) types.push(ev.type);
  });

  // 버튼 여러 개를 만드는 작은 도구
  function makeButtons(group, labels) {
    return labels.map(function (label) {
      const active = filter[group] === label ? "active" : "";
      const dot = label !== "전체" && group === "type"
        ? `<i class="dot" style="background:${colorOf(label)}"></i>`
        : "";
      return `<button class="chip ${active}" data-group="${group}" data-value="${label}">${dot}${label}</button>`;
    }).join("");
  }

  const box = document.getElementById("filters");
  box.innerHTML = `
    <input class="search" type="search" placeholder="🔍 대회명, 도시, 나라로 검색 (예: 부산, 일본)">
    <div class="chips">${makeButtons("region", regions)}</div>
    <div class="chips">${makeButtons("type", types)}</div>
  `;

  // 검색창에 글자를 칠 때마다 다시 그리기
  box.querySelector(".search").addEventListener("input", function (e) {
    filter.search = e.target.value;
    onChange();
  });

  box.querySelectorAll(".chip").forEach(function (button) {
    button.addEventListener("click", function () {
      const group = button.dataset.group;

      // 1) 선택한 값을 기억하고
      filter[group] = button.dataset.value;

      // 2) 같은 줄의 버튼 중 누른 버튼만 강조하고
      box.querySelectorAll(`.chip[data-group="${group}"]`).forEach(function (b) {
        b.classList.toggle("active", b === button);
      });

      // 3) 화면을 다시 그려요
      onChange();
    });
  });
}
