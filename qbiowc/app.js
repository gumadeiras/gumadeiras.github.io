const rounds = [
  {
    name: "round of 32",
    date: "jun 28 - jul 3",
    matches: [
      [73, "2A", "2B"], [74, "1E", "3A/B/C/D/F"], [75, "1F", "2C"], [76, "1C", "2F"],
      [77, "1I", "3C/D/F/G/H"], [78, "2E", "2I"], [79, "1A", "3C/E/F/H/I"], [80, "1L", "3E/H/I/J/K"],
      [81, "1D", "3B/E/F/I/J"], [82, "1G", "3A/E/H/I/J"], [83, "2K", "2L"], [84, "1H", "2J"],
      [85, "1B", "3E/F/G/I/J"], [86, "1J", "2H"], [87, "1K", "3D/E/I/J/L"], [88, "2D", "2G"]
    ]
  },
  { name: "round of 16", date: "jul 4 - 7", matches: [[89, "W74", "W77"], [90, "W73", "W75"], [91, "W76", "W78"], [92, "W79", "W80"], [93, "W83", "W84"], [94, "W81", "W82"], [95, "W86", "W88"], [96, "W85", "W87"]] },
  { name: "quarterfinals", date: "jul 9 - 11", matches: [[97, "W89", "W90"], [98, "W93", "W94"], [99, "W91", "W92"], [100, "W95", "W96"]] },
  { name: "semifinals", date: "jul 14 - 15", matches: [[101, "W97", "W98"], [102, "W99", "W100"]] },
  { name: "third place", date: "jul 18", matches: [[103, "L101", "L102"]] },
  { name: "final", date: "jul 19", matches: [[104, "W101", "W102"]] }
];

const kickoffs = {
  73: "Sun Jun 28 · 3:00 PM",
  74: "Mon Jun 29 · 4:30 PM",
  75: "Mon Jun 29 · 9:00 PM",
  76: "Mon Jun 29 · 1:00 PM",
  77: "Tue Jun 30 · 5:00 PM",
  78: "Tue Jun 30 · 1:00 PM",
  79: "Tue Jun 30 · 9:00 PM",
  80: "Wed Jul 1 · 12:00 PM",
  81: "Wed Jul 1 · 8:00 PM",
  82: "Wed Jul 1 · 4:00 PM",
  83: "Thu Jul 2 · 7:00 PM",
  84: "Thu Jul 2 · 3:00 PM",
  85: "Thu Jul 2 · 11:00 PM",
  86: "Fri Jul 3 · 6:00 PM",
  87: "Fri Jul 3 · 9:30 PM",
  88: "Fri Jul 3 · 2:00 PM",
  89: "Sat Jul 4 · 5:00 PM",
  90: "Sat Jul 4 · 1:00 PM",
  91: "Sun Jul 5 · 4:00 PM",
  92: "Sun Jul 5 · 8:00 PM",
  93: "Mon Jul 6 · 3:00 PM",
  94: "Mon Jul 6 · 8:00 PM",
  95: "Tue Jul 7 · 12:00 PM",
  96: "Tue Jul 7 · 4:00 PM",
  97: "Thu Jul 9 · 4:00 PM",
  98: "Fri Jul 10 · 3:00 PM",
  99: "Sat Jul 11 · 5:00 PM",
  100: "Sat Jul 11 · 9:00 PM",
  101: "Tue Jul 14 · 3:00 PM",
  102: "Wed Jul 15 · 3:00 PM",
  103: "Sat Jul 18 · 5:00 PM",
  104: "Sun Jul 19 · 3:00 PM"
};

const thirdPlaceSlotMatches = [79, 85, 81, 74, 82, 77, 87, 80];
const thirdPlaceOptions = "EJIFHGLK HGIDJFLK EJIDHGLK EJIDHFLK EGIDJFLK EGJDHFLK EGIDHFLK EGJDHFLI EGJDHFIK HGICJFLK EJICHGLK EJICHFLK EGICJFLK EGJCHFLK EGICHFLK EGJCHFLI EGJCHFIK HGICJDLK CJIDHFLK CGIDJFLK CGJDHFLK CGIDHFLK CGJDHFLI CGJDHFIK EJICHDLK EGICJDLK EGJCHDLK EGICHDLK EGJCHDLI EGJCHDIK CJEDIFLK CJEDHFLK CEIDHFLK CJEDHFLI CJEDHFIK CGEDJFLK CGEDIFLK CGEDJFLI CGEDJFIK CGEDHFLK CGJDHFLE CGJDHFEK CGEDHFLI CGEDHFIK CGJDHFEI HJBFIGLK EJIBHGLK EJBFIHLK EJBFIGLK EJBFHGLK EGBFIHLK EJBFHGLI EJBFHGIK HJBDIGLK HJBDIFLK IGBDJFLK HGBDJFLK HGBDIFLK HGBDJFLI HGBDJFIK EJBDIHLK EJBDIGLK EJBDHGLK EGBDIHLK EJBDHGLI EJBDHGIK EJBDIFLK EJBDHFLK EIBDHFLK EJBDHFLI EJBDHFIK EGBDJFLK EGBDIFLK EGBDJFLI EGBDJFIK EGBDHFLK HGBDJFLE HGBDJFEK EGBDHFLI EGBDHFIK HGBDJFEI HJBCIGLK HJBCIFLK IGBCJFLK HGBCJFLK HGBCIFLK HGBCJFLI HGBCJFIK EJBCIHLK EJBCIGLK EJBCHGLK EGBCIHLK EJBCHGLI EJBCHGIK EJBCIFLK EJBCHFLK EIBCHFLK EJBCHFLI EJBCHFIK EGBCJFLK EGBCIFLK EGBCJFLI EGBCJFIK EGBCHFLK HGBCJFLE HGBCJFEK EGBCHFLI EGBCHFIK HGBCJFEI HJBCIDLK IGBCJDLK HGBCJDLK HGBCIDLK HGBCJDLI HGBCJDIK CJBDIFLK CJBDHFLK CIBDHFLK CJBDHFLI CJBDHFIK CGBDJFLK CGBDIFLK CGBDJFLI CGBDJFIK CGBDHFLK CGBDHFLJ HGBCJFDK CGBDHFLI CGBDHFIK HGBCJFDI EJBCIDLK EJBCHDLK EIBCHDLK EJBCHDLI EJBCHDIK EGBCJDLK EGBCIDLK EGBCJDLI EGBCJDIK EGBCHDLK HGBCJDLE HGBCJDEK EGBCHDLI EGBCHDIK HGBCJDEI CJBDEFLK CEBDIFLK CJBDEFLI CJBDEFIK CEBDHFLK CJBDHFLE CJBDHFEK CEBDHFLI CEBDHFIK CJBDHFEI CGBDEFLK CGBDJFLE CGBDJFEK CGBDEFLI CGBDEFIK CGBDJFEI CGBDHFLE CGBDHFEK HGBCJFDE CGBDHFEI HJIFAGLK EJIAHGLK EJIFAHLK EJIFAGLK EGJFAHLK EGIFAHLK EGJFAHLI EGJFAHIK HJIDAGLK HJIDAFLK IGJDAFLK HGJDAFLK HGIDAFLK HGJDAFLI HGJDAFIK EJIDAHLK EJIDAGLK EGJDAHLK EGIDAHLK EGJDAHLI EGJDAHIK EJIDAFLK HJEDAFLK HEIDAFLK HJEDAFLI HJEDAFIK EGJDAFLK EGIDAFLK EGJDAFLI EGJDAFIK HGEDAFLK HGJDAFLE HGJDAFEK HGEDAFLI HGEDAFIK HGJDAFEI HJICAGLK HJICAFLK IGJCAFLK HGJCAFLK HGICAFLK HGJCAFLI HGJCAFIK EJICAHLK EJICAGLK EGJCAHLK EGICAHLK EGJCAHLI EGJCAHIK EJICAFLK HJECAFLK HEICAFLK HJECAFLI HJECAFIK EGJCAFLK EGICAFLK EGJCAFLI EGJCAFIK HGECAFLK HGJCAFLE HGJCAFEK HGECAFLI HGECAFIK HGJCAFEI HJICADLK IGJCADLK HGJCADLK HGICADLK HGJCADLI HGJCADIK CJIDAFLK HJFCADLK HFICADLK HJFCADLI HJFCADIK CGJDAFLK CGIDAFLK CGJDAFLI CGJDAFIK HGFCADLK CGJDAFLH HGJCAFDK HGFCADLI HGFCADIK HGJCAFDI EJICADLK HJECADLK HEICADLK HJECADLI HJECADIK EGJCADLK EGICADLK EGJCADLI EGJCADIK HGECADLK HGJCADLE HGJCADEK HGECADLI HGECADIK HGJCADEI CJEDAFLK CEIDAFLK CJEDAFLI CJEDAFIK HEFCADLK HJFCADLE HJECAFDK HEFCADLI HEFCADIK HJECAFDI CGEDAFLK CGJDAFLE CGJDAFEK CGEDAFLI CGEDAFIK CGJDAFEI HGFCADLE HGECAFDK HGJCAFDE HGECAFDI HJBAIGLK HJBAIFLK IJBFAGLK HJBFAGLK HGBAIFLK HJBFAGLI HJBFAGIK EJBAIHLK EJBAIGLK EJBAHGLK EGBAIHLK EJBAHGLI EJBAHGIK EJBAIFLK EJBFAHLK EIBFAHLK EJBFAHLI EJBFAHIK EJBFAGLK EGBAIFLK EJBFAGLI EJBFAGIK EGBFAHLK HJBFAGLE HJBFAGEK EGBFAHLI EGBFAHIK HJBFAGEI IJBDAHLK IJBDAGLK HJBDAGLK IGBDAHLK HJBDAGLI HJBDAGIK IJBDAFLK HJBDAFLK HIBDAFLK HJBDAFLI HJBDAFIK FJBDAGLK IGBDAFLK FJBDAGLI FJBDAGIK HGBDAFLK HGBDAFLJ HGBDAFJK HGBDAFLI HGBDAFIK HGBDAFIJ EJBAIDLK EJBDAHLK EIBDAHLK EJBDAHLI EJBDAHIK EJBDAGLK EGBAIDLK EJBDAGLI EJBDAGIK EGBDAHLK HJBDAGLE HJBDAGEK EGBDAHLI EGBDAHIK HJBDAGEI EJBDAFLK EIBDAFLK EJBDAFLI EJBDAFIK HEBDAFLK HJBDAFLE HJBDAFEK HEBDAFLI HEBDAFIK HJBDAFEI EGBDAFLK EGBDAFLJ EGBDAFJK EGBDAFLI EGBDAFIK EGBDAFIJ HGBDAFLE HGBDAFEK HGBDAFEJ HGBDAFEI IJBCAHLK IJBCAGLK HJBCAGLK IGBCAHLK HJBCAGLI HJBCAGIK IJBCAFLK HJBCAFLK HIBCAFLK HJBCAFLI HJBCAFIK CJBFAGLK IGBCAFLK CJBFAGLI CJBFAGIK HGBCAFLK HGBCAFLJ HGBCAFJK HGBCAFLI HGBCAFIK HGBCAFIJ EJBAICLK EJBCAHLK EIBCAHLK EJBCAHLI EJBCAHIK EJBCAGLK EGBAICLK EJBCAGLI EJBCAGIK EGBCAHLK HJBCAGLE HJBCAGEK EGBCAHLI EGBCAHIK HJBCAGEI EJBCAFLK EIBCAFLK EJBCAFLI EJBCAFIK HEBCAFLK HJBCAFLE HJBCAFEK HEBCAFLI HEBCAFIK HJBCAFEI EGBCAFLK EGBCAFLJ EGBCAFJK EGBCAFLI EGBCAFIK EGBCAFIJ HGBCAFLE HGBCAFEK HGBCAFEJ HGBCAFEI IJBCADLK HJBCADLK HIBCADLK HJBCADLI HJBCADIK CJBDAGLK IGBCADLK CJBDAGLI CJBDAGIK HGBCADLK HGBCADLJ HGBCADJK HGBCADLI HGBCADIK HGBCADIJ CJBDAFLK CIBDAFLK CJBDAFLI CJBDAFIK HFBCADLK CJBDAFLH HJBCAFDK HFBCADLI HFBCADIK HJBCAFDI CGBDAFLK CGBDAFLJ CGBDAFJK CGBDAFLI CGBDAFIK CGBDAFIJ CGBDAFLH HGBCAFDK HGBCAFDJ HGBCAFDI EJBCADLK EIBCADLK EJBCADLI EJBCADIK HEBCADLK HJBCADLE HJBCADEK HEBCADLI HEBCADIK HJBCADEI EGBCADLK EGBCADLJ EGBCADJK EGBCADLI EGBCADIK EGBCADIJ HGBCADLE HGBCADEK HGBCADEJ HGBCADEI CEBDAFLK CJBDAFLE CJBDAFEK CEBDAFLI CEBDAFIK CJBDAFEI HFBCADLE HEBCAFDK HJBCAFDE HEBCAFDI CGBDAFLE CGBDAFEK CGBDAFEJ CGBDAFEI HGBCAFDE".split(" ").reduce((options, row) => {
  const slots = [...row];
  options[[...slots].sort().join("")] = Object.fromEntries(thirdPlaceSlotMatches.map((matchId, index) => [matchId, "3" + slots[index]]));
  return options;
}, {});

if (Object.keys(thirdPlaceOptions).length !== 495) throw new Error("Missing FIFA Annex C rows");

const stateKey = "qbiowc-picks-v1";
const state = JSON.parse(localStorage.getItem(stateKey) || '{"matches":{}}');
const data = window.QBIOWC_DATA || { standings: [], players: {} };
const googleFormConfig = {
  action: "https://docs.google.com/forms/d/e/1FAIpQLSf9jfkZ6zktmFjB9bWFOQNOldxuLlhWd9emTUtTLZKgnCxYbw/formResponse",
  fields: {
    name: "entry.2145935792",
    bracketName: "entry.1805054406",
    email: "entry.1037084140",
    boostCountry: "entry.601888031",
    picks: "entry.1841195636"
  }
};
const standings = data.standings || [];
const allPlayers = [...new Set(Object.values(data.players || {}).flat())].sort();
const standingsEl = document.querySelector("[data-standings]");
const board = document.querySelector("[data-board]");
const toast = document.querySelector("[data-toast]");

function thirdPlaceKey(team) {
  return [team.pts, Number(team.gd), team.gf, -team.ga, team.n].join(":");
}

function bestThirdTeams() {
  return standings
    .map((group) => ({ ...group.teams[2], group: group.g }))
    .filter((team) => team.n)
    .sort((a, b) => b.pts - a.pts || Number(b.gd) - Number(a.gd) || b.gf - a.gf || a.ga - b.ga || a.n.localeCompare(b.n))
    .slice(0, 8);
}

function currentThirds() {
  return new Set(bestThirdTeams().map(thirdPlaceKey));
}

function renderStandings() {
  const liveThirds = currentThirds();
  standingsEl.innerHTML = standings.map((group) => `
    <article class="group">
      <b><span></span><span>Group ${group.g}</span><span>pts</span><span>gd</span><span>gf</span></b>
      ${group.teams.map((team, index) => `
        <div class="group-row ${index === 2 && liveThirds.has(thirdPlaceKey(team)) ? "third-live" : ""}">
          <img class="flag" src="${team.l}" alt="">
          <span>${team.n}${index === 2 && liveThirds.has(thirdPlaceKey(team)) ? ` <em class="third-badge">+3rd</em>` : ""}</span><span>${team.pts}</span><span>${team.gd}</span><span>${team.gf}</span>
        </div>`).join("")}
    </article>`).join("");
}

function save() {
  state.name = document.querySelector("[data-player-name]").value.trim();
  state.bracketName = document.querySelector("[data-bracket-name]").value.trim();
  state.email = document.querySelector("[data-player-email]").value.trim();
  state.boostCountry = document.querySelector("[data-boost-country]").value;
  delete state.country;
  localStorage.setItem(stateKey, JSON.stringify(state));
}

function label(raw) {
  const match = /^([WL])(\d+)$/.exec(raw);
  if (!match) return raw;
  const picked = match[1] === "W" ? winner(match[2]) : loser(match[2]);
  return picked || raw;
}

function pick(id) {
  return state.matches[id] || {};
}

function thirdPlaceSlots() {
  const key = bestThirdTeams().map((team) => team.group).sort().join("");
  return thirdPlaceOptions[key] || {};
}

function resolveThirdSlot(value, id) {
  return /^3[A-L](\/[A-L])+$/.test(value) ? thirdPlaceSlots()[id] || value : value;
}

function teams(id) {
  const meta = matchMeta(id);
  return meta ? [label(resolveThirdSlot(meta.match[1], meta.match[0])), label(resolveThirdSlot(meta.match[2], meta.match[0]))] : ["", ""];
}

function matchMeta(id) {
  for (const round of rounds) {
    const index = round.matches.findIndex((candidate) => String(candidate[0]) === String(id));
    if (index >= 0) return { round, match: round.matches[index], index };
  }
  return null;
}

function affectedMatchIds(id) {
  const affected = new Set([String(id)]);
  let changed = true;
  while (changed) {
    changed = false;
    rounds.flatMap((round) => round.matches).forEach((match) => {
      if (affected.has(String(match[0]))) return;
      if (match.slice(1).some((slot) => affected.has(slot.slice(1)))) {
        affected.add(String(match[0]));
        changed = true;
      }
    });
  }
  return rounds.flatMap((round) => round.matches.map((match) => String(match[0]))).filter((matchId) => affected.has(matchId));
}

function winner(id) {
  const data = pick(id);
  const [home, away] = teams(id);
  if (data.home === "" || data.away === "" || data.home == null || data.away == null) return "";
  if (+data.home > +data.away) return home;
  if (+data.away > +data.home) return away;
  return data.advance === "home" ? home : data.advance === "away" ? away : "";
}

function loser(id) {
  const data = pick(id);
  const [home, away] = teams(id);
  const win = winner(id);
  if (!win) return "";
  return win === home ? away : home;
}

function updateScore(id, side, value) {
  state.matches[id] ||= {};
  state.matches[id][side] = value === "" ? "" : Math.max(0, Math.min(99, Number(value)));
  if (state.matches[id].home !== "" && state.matches[id].away !== "" && state.matches[id].home != null && state.matches[id].away != null && Number(state.matches[id].home) !== Number(state.matches[id].away)) {
    delete state.matches[id].advance;
  }
  save();
}

function setScore(id, side, value) {
  updateScore(id, side, value);
  renderAffected(id);
}

function setAdvance(id, side) {
  state.matches[id] ||= {};
  state.matches[id].advance = side;
  save();
  renderAffected(id);
}

function setScorer(id, side, index, value) {
  state.matches[id] ||= {};
  const scorers = Array.isArray(state.matches[id][side + "Scorers"]) ? state.matches[id][side + "Scorers"] : [];
  scorers[index] = value;
  state.matches[id][side + "Scorers"] = scorers;
  save();
}

function escapeAttribute(value) {
  return String(value ?? "").replace(/[&"]/g, (char) => char === "&" ? "&amp;" : "&quot;");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function currentTeam(value) {
  const match = /^([123])([A-L])$/.exec(value);
  if (!match) return standings.flatMap((group) => group.teams).find((team) => team.n === value) || null;
  return standings.find((group) => group.g === match[2])?.teams[Number(match[1]) - 1] || null;
}

function slotInfo(value) {
  const team = currentTeam(value);
  if (team) return { main: team.n, sub: `${value} current`, team };
  if (/^3/.test(value)) return { main: value, sub: "best third-place pool" };
  if (/^W\d+/.test(value)) return { main: value, sub: "winner" };
  if (/^L\d+/.test(value)) return { main: value, sub: "semifinal loser" };
  return { main: value, sub: "predicted" };
}

function renderSlot(info) {
  return `<span class="slot">${info.team ? `<img class="flag" src="${info.team.l}" alt="">` : ""}<strong>${escapeHtml(info.main)}</strong><small>${escapeHtml(info.sub)}</small></span>`;
}

function renderChampion() {
  const champ = winner(104);
  const info = slotInfo(champ || "...");
  return `<div class="champion"><span>champion</span><b>${info.team ? `<img class="flag" src="${info.team.l}" alt="">` : ""}${escapeHtml(info.main)}</b></div>`;
}

function renderScorers(matchData, id, side, info) {
  const count = Math.max(0, Math.min(8, Number(matchData[side]) || 0));
  const saved = Array.isArray(matchData[side + "Scorers"]) ? matchData[side + "Scorers"] : [];
  const players = data.players?.[info.team?.n] || allPlayers;
  if (!count) return `<div class="scorers"></div>`;
  return `<div class="scorers">${Array.from({ length: count }, (_, index) => `
    <select class="scorer" data-scorer="${id}:${side}:${index}" aria-label="match ${id} ${info.main} goal ${index + 1} scorer">
      <option value="">goal ${index + 1}</option>
      <option value="own goal" ${saved[index] === "own goal" ? "selected" : ""}>own goal</option>
      ${players.map((player) => `<option value="${escapeAttribute(player)}" ${saved[index] === player ? "selected" : ""}>${escapeHtml(player)}</option>`).join("")}
    </select>`).join("")}</div>`;
}

function renderMatch(match, index, stage) {
  const [id, homeRaw, awayRaw] = match;
  const data = pick(id);
  const home = label(resolveThirdSlot(homeRaw, id));
  const away = label(resolveThirdSlot(awayRaw, id));
  const win = winner(id);
  const tied = data.home !== "" && data.away !== "" && data.home != null && data.away != null && Number(data.home) === Number(data.away);
  const homeInfo = slotInfo(home);
      const awayInfo = slotInfo(away);
      return `
        <article class="match ${stage === "final" ? "final" : ""} ${tied ? "tied" : ""}" data-match-id="${id}" style="animation-delay:${index * 24}ms">
          <span class="match-id">W${id}</span>
          <time class="kickoff">${kickoffs[id]}</time>
          <div class="team ${win === home ? "winner" : ""}">
        ${renderSlot(homeInfo)}
        <input class="score" data-score="${id}:home" type="number" min="0" max="99" inputmode="numeric" value="${data.home ?? ""}" aria-label="match ${id} ${home} score">
        ${renderScorers(data, id, "home", homeInfo)}
      </div>
      <div class="team ${win === away ? "winner" : ""}">
        ${renderSlot(awayInfo)}
        <input class="score" data-score="${id}:away" type="number" min="0" max="99" inputmode="numeric" value="${data.away ?? ""}" aria-label="match ${id} ${away} score">
        ${renderScorers(data, id, "away", awayInfo)}
      </div>
      <div class="advance" aria-label="match ${id} penalty winner">
        <button type="button" data-advance="${id}:home" aria-pressed="${data.advance === "home"}">${escapeHtml(homeInfo.main)}</button>
        <button type="button" data-advance="${id}:away" aria-pressed="${data.advance === "away"}">${escapeHtml(awayInfo.main)}</button>
      </div>
    </article>`;
}

function bindMatchControls(root) {
  root.querySelectorAll("[data-score]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const [id, side] = event.target.dataset.score.split(":");
      updateScore(id, side, event.target.value);
    });
    input.addEventListener("change", (event) => {
      const [id, side] = event.target.dataset.score.split(":");
      setScore(id, side, event.target.value);
    });
  });

  board.querySelectorAll("[data-advance]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const [id, side] = event.currentTarget.dataset.advance.split(":");
      setAdvance(id, side);
    });
  });

  board.querySelectorAll("[data-scorer]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const [id, side, index] = event.target.dataset.scorer.split(":");
      setScorer(id, side, Number(index), event.target.value);
    });
  });
}

function renderAffected(id) {
  affectedMatchIds(id).forEach((matchId) => {
    const meta = matchMeta(matchId);
    const card = board.querySelector(`[data-match-id="${matchId}"]`);
    if (!meta || !card) return;
    card.outerHTML = renderMatch(meta.match, meta.index, meta.round.name);
    bindMatchControls(board.querySelector(`[data-match-id="${matchId}"]`));
  });
  board.querySelector(".champion")?.replaceWith(htmlToElement(renderChampion()));
}

function htmlToElement(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function render() {
  board.innerHTML = rounds.map((round) => `
    <section class="round">
      <h2>${round.name}<span class="date">${round.date}</span></h2>
      ${round.name === "final" ? renderChampion() : ""}
      ${round.matches.map((match, index) => renderMatch(match, index, round.name)).join("")}
    </section>
  `).join("");

  bindMatchControls(board);
}

function show(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(show.timer);
  show.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function submissionPayload() {
  save();
  return {
    name: state.name || "",
    bracketName: state.bracketName || "",
    email: state.email || "",
    boostCountry: state.boostCountry || "",
    picks: JSON.stringify(state)
  };
}

function googleFormReady() {
  return googleFormConfig.action && Object.values(googleFormConfig.fields).every(Boolean);
}

async function copyPicks() {
  await navigator.clipboard.writeText(JSON.stringify(state, null, 2));
}

async function submitPicks() {
  const required = document.querySelectorAll("[required]");
  if ([...required].some((input) => !input.reportValidity())) return;
  const payload = submissionPayload();
  if (!googleFormReady()) {
    await copyPicks();
    show("google form not configured; picks copied");
    return;
  }
  const body = new FormData();
  Object.entries(googleFormConfig.fields).forEach(([key, entry]) => body.append(entry, payload[key]));
  await fetch(googleFormConfig.action, { method: "POST", mode: "no-cors", body });
  show("picks submitted");
}

function restorePicks() {
  const raw = document.querySelector("[data-restore-json]").value.trim();
  try {
    const restored = JSON.parse(raw);
    if (!restored || typeof restored !== "object" || !restored.matches || typeof restored.matches !== "object") throw new Error("bad shape");
    localStorage.setItem(stateKey, JSON.stringify(restored));
    location.reload();
  } catch {
    show("could not restore picks");
  }
}

function renderBoostCountries() {
  const boost = document.querySelector("[data-boost-country]");
  const knockoutTeams = rounds[0].matches
    .flatMap((match) => teams(match[0]))
    .map(currentTeam)
    .filter(Boolean)
    .map((team) => team.n);
  boost.innerHTML = `<option value="">pick one</option>${standings
    .flatMap((group) => group.teams.map((team) => team.n))
    .filter((team) => knockoutTeams.includes(team))
    .sort()
    .map((country) => `<option value="${escapeAttribute(country)}">${escapeHtml(country)}</option>`)
    .join("")}`;
}

renderBoostCountries();
document.querySelector("[data-player-name]").value = state.name || "";
document.querySelector("[data-bracket-name]").value = state.bracketName || "";
document.querySelector("[data-player-email]").value = state.email || "";
document.querySelector("[data-boost-country]").value = state.boostCountry || state.country || "";
document.querySelectorAll("[data-player-name], [data-bracket-name], [data-player-email], [data-boost-country]").forEach((input) => {
  input.addEventListener("input", save);
  input.addEventListener("change", save);
});
document.querySelector("[data-copy]").addEventListener("click", async () => {
  save();
  await copyPicks();
  show("picks copied");
});
document.querySelector("[data-submit]").addEventListener("click", submitPicks);
document.querySelector("[data-restore-open]").addEventListener("click", () => document.querySelector("[data-restore-dialog]").showModal());
document.querySelector("[data-restore-cancel]").addEventListener("click", () => document.querySelector("[data-restore-dialog]").close());
document.querySelector("[data-restore-apply]").addEventListener("click", restorePicks);
document.querySelector("[data-reset]").addEventListener("click", () => {
  localStorage.removeItem(stateKey);
  location.reload();
});

renderStandings();
render();
