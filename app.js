/* Wobble app: onboarding quiz, daily plan, activity library, on-screen games, progress. */
(function () {
  var KEY = "wobble-app-v1";
  var $ = function (id) { return document.getElementById(id); };
  var stage = $("stage");
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var rnd = function (n) { return Math.floor(Math.random() * n); };
  var shuffle = function (a) { for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };

  /* ---------- state ---------- */
  var S = { on: false, qi: -1, a: {}, order: null, start: null, log: [], best: {}, swaps: {} };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || "null"); if (saved && typeof saved === "object" && saved.a) S = Object.assign(S, saved); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  var sub = null, lastY = 0, inApp = false;            // {t:'act'|'game', id}
  var filt = { skill: "all", age: true };

  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function dayNum() { return Math.max(1, Math.round((new Date(today() + "T00:00") - new Date(S.start + "T00:00")) / 864e5) + 1); }
  function doneToday(id) { var t = today(); return S.log.some(function (l) { return l.d === t && l.id === id; }); }
  function logIt(type, id, skill, mins) { S.log.push({ d: today(), t: type, id: id, k: skill, m: mins }); save(); }
  function kidName() { return S.a.name || "Your child"; }

  /* ---------- timers for games ---------- */
  var timers = [], gen = 0;
  function later(fn, ms) { var g = gen; var id = setTimeout(function () { if (g === gen) fn(); }, ms); timers.push(id); return id; }
  function kill() { gen++; timers.forEach(clearTimeout); timers = []; }

  /* ---------- quiz ---------- */
  var SECTIONS = ["About your child", "Everyday patterns", "Quiet signals", "Your family"];
  var AGREE = ["Strongly disagree", "Somewhat disagree", "Somewhat agree", "Strongly agree"];
  var OFTEN = [["😊", "Almost never"], ["🙂", "Now and then"], ["😕", "Quite often"], ["😩", "Most days"]];
  var ME = { boy: { s: "he", p: "his" }, girl: { s: "she", p: "her" }, kid: { s: "they", p: "their" } };
  var CHALLENGE = { meltdowns: "big meltdowns", focus: "a short attention span", screens: "screen-time battles", routines: "bedtime and morning routines", siblings: "sibling fights" };
  var STEPS = [
    { id: "age", sec: 0, type: "single", q: "How old is your child?", opts: [["3-4", "3 – 4"], ["5-6", "5 – 6"], ["7-9", "7 – 9"], ["10+", "10 or older"]] },
    { id: "challenge", sec: 0, type: "single", q: "What feels hardest right now?", opts: [["meltdowns", "Big meltdowns", "🌋"], ["focus", "Short attention span", "🦋"], ["screens", "Screen-time battles", "📱"], ["routines", "Bedtime and morning routines", "🌙"], ["siblings", "Sibling fights", "🥊"]] },
    { id: "i1", sec: 0, type: "info", pic: "hug", title: "Plenty of parents are right here with you",
      body: function (a) { return ["At " + (a.age === "10+" ? "10 and up" : a.age.replace("-", " – ")) + ", plenty of homes are dealing with " + CHALLENGE[a.challenge] + ". It says very little about how well you parent.", "The next questions look at the everyday moments around it, so the plan fits your child and not an average one."]; } },
    { id: "l_focus", sec: 1, type: "likert", area: "focus", q: function () { return "My child drifts away from an activity after a few minutes"; } },
    { id: "l_wait", sec: 1, type: "likert", area: "patience", q: function (a) { return "Waiting for " + a.me.p + " turn is hard for my child"; } },
    { id: "l_impulse", sec: 1, type: "likert", area: "impulse", q: function () { return "My child often acts first and thinks about it afterwards"; } },
    { id: "l_frus", sec: 1, type: "likert", area: "frustration", q: function (a) { return "My child gets upset when " + a.me.s + " can't get something right the first time"; } },
    { id: "l_switch", sec: 1, type: "likert", area: "switching", q: function () { return "Stopping one thing to start another often ends in tears"; } },
    { id: "i2", sec: 1, type: "info", pic: "brain", title: "This is a skill gap, and skills can be practised",
      body: function () { return ["Focus, waiting, and calming down all rely on the part of the brain that develops slowest. It keeps growing well into the teenage years.", "Children build it the way they build everything else: through short, repeated play. That is what Wobble's games are for."]; } },
    { id: "f_fidget", sec: 2, type: "freq", area: "impulse", q: function () { return "How often does your child chew or fidget with sleeves, pencils, or toys?"; } },
    { id: "f_withdraw", sec: 2, type: "freq", area: "frustration", q: function () { return "How often does your child go quiet or hide away when upset?"; } },
    { id: "f_yell", sec: 2, type: "freq", area: "switching", q: function () { return "How often does a small frustration turn into shouting?"; } },
    { id: "time", sec: 3, type: "single", q: "How much time can you play together each day?", opts: [["5", "About 5 minutes", "⏱️"], ["10", "About 10 minutes", "⏱️"], ["15", "15 minutes or more", "⏱️"]] },
    { id: "name", sec: 3, type: "name", q: "What's your child's first name?" },
    { id: "loading", type: "load" },
    { id: "ready", type: "ready" }
  ];
  var PICS = {
    hug: '<svg class="pic" viewBox="0 0 150 110" aria-hidden="true"><circle cx="58" cy="44" r="26" fill="var(--sun)"/><circle cx="98" cy="58" r="18" fill="var(--accent)"/><path d="M48 42h.1M66 42h.1M92 56h.1M104 56h.1" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><path d="M50 52c5 5 11 5 16 0M93 64c3 3 7 3 10 0" fill="none" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round"/><path d="M34 58c10 26 60 30 82 12" fill="none" stroke="var(--teal)" stroke-width="7" stroke-linecap="round"/></svg>',
    brain: '<svg class="pic" viewBox="0 0 150 110" aria-hidden="true"><path d="M75 22c-22-12-46 4-40 26-12 12-2 34 18 32 8 12 24 12 22 0z" fill="var(--sun)"/><path d="M75 22c22-12 46 4 40 26 12 12 2 34-18 32-8 12-24 12-22 0z" fill="var(--accent)"/><path d="M75 24v56M52 44c8-2 12 4 10 10M98 44c-8-2-12 4-10 10M50 66c6-4 12-2 14 4M100 66c-6-4-12-2-14 4" fill="none" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round"/></svg>',
    kite: '<svg class="pic" viewBox="0 0 150 110" aria-hidden="true"><path d="M92 10l30 28-30 34-26-34z" fill="var(--accent)"/><path d="M92 10v62M66 38h56" stroke="var(--ink)" stroke-width="2.4"/><path d="M92 72c-8 10 6 14-4 22s-30 4-44 10" fill="none" stroke="var(--teal)" stroke-width="3.5" stroke-linecap="round"/><circle cx="34" cy="30" r="12" fill="var(--sun)"/></svg>'
  };
  function kid(skin, hair, shirt, style) {
    var back = style === "long" ? '<path d="M22 54c-4-30 10-40 24-40s28 10 24 40c-2 8-6 10-8 2V36H30v20c-2 8-6 6-8-2z" fill="' + hair + '"/>' : "";
    var front = style === "long" ? '<path d="M27 36c0-14 9-21 19-21s19 7 19 21c-6-2-10-6-12-10-5 5-16 9-26 10z" fill="' + hair + '"/>'
      : style === "curl" ? '<path d="M26 34c-4-14 8-22 20-22s24 8 20 22c-3-6-8-9-20-9s-17 3-20 9z" fill="' + hair + '"/><circle cx="28" cy="26" r="6" fill="' + hair + '"/><circle cx="64" cy="26" r="6" fill="' + hair + '"/><circle cx="46" cy="16" r="7" fill="' + hair + '"/>'
      : '<path d="M26 36c-5-16 8-24 20-24s25 8 20 24c-2-7-6-10-10-11-6 4-18 4-24 1-3 2-5 5-6 10z" fill="' + hair + '"/>';
    return '<svg viewBox="0 0 92 92" aria-hidden="true">' + back + '<path d="M14 92c0-18 14-26 32-26s32 8 32 26z" fill="' + shirt + '"/><rect x="40" y="56" width="12" height="14" rx="5" fill="' + skin + '"/><circle cx="46" cy="40" r="20" fill="' + skin + '"/>' + front + '<circle cx="39" cy="42" r="2.3" fill="#14224A"/><circle cx="53" cy="42" r="2.3" fill="#14224A"/><path d="M39 49c4 4 10 4 14 0" fill="none" stroke="#14224A" stroke-width="2.2" stroke-linecap="round"/></svg>';
  }
  function qctx() { return Object.assign({}, S.a, { me: ME[S.a.who] || ME.kid }); }
  function qgo(i) { S.qi = i; save(); render(true); }
  function qnext() { qgo(S.qi + 1); }
  function scores() {
    var sum = {}, n = {};
    STEPS.forEach(function (s) { if (s.area && typeof S.a[s.id] === "number") { sum[s.area] = (sum[s.area] || 0) + S.a[s.id]; n[s.area] = (n[s.area] || 0) + 1; } });
    return QUIZ_AREAS.map(function (k) { return { k: k, v: n[k] ? sum[k] / (n[k] * 3) : 0 }; }).sort(function (x, y) { return y.v - x.v; });
  }

  function quizChrome(step) {
    var quiz = step && step.sec !== undefined;
    $("top").hidden = !quiz; $("bars").hidden = !quiz;
    if (!quiz) return;
    $("section").textContent = SECTIONS[step.sec];
    var fills = document.querySelectorAll("#bars i");
    SECTIONS.forEach(function (_, s) {
      var ids = []; STEPS.forEach(function (x, k) { if (x.sec === s) ids.push(k); });
      var done = ids.filter(function (k) { return k < S.qi; }).length + (ids.indexOf(S.qi) >= 0 ? 0.5 : 0);
      fills[s].style.width = Math.min(100, done / ids.length * 100) + "%";
    });
  }

  function renderQuiz() {
    var step = STEPS[S.qi];
    quizChrome(step);
    if (!step) return landing();
    var a = qctx(), q = typeof step.q === "function" ? step.q(a) : step.q;
    if (step.type === "single") {
      stage.innerHTML = '<h2 class="center">' + esc(q) + '</h2><div class="opts">' + step.opts.map(function (o) { return '<button type="button" class="opt" data-v="' + o[0] + '" aria-pressed="' + (S.a[step.id] === o[0]) + '">' + (o[2] ? '<span class="em">' + o[2] + "</span>" : "") + "<span>" + esc(o[1]) + "</span></button>"; }).join("") + "</div>";
      pick(step, false);
    } else if (step.type === "likert" || step.type === "freq") {
      var list = step.type === "likert" ? AGREE.map(function (t) { return [null, t]; }) : OFTEN;
      stage.innerHTML = (step.type === "likert" ? '<p class="hint center">How much do you agree?</p><div class="statement">' + esc(q) + "</div>" : '<h2 class="center">' + esc(q) + "</h2>")
        + '<div class="opts">' + list.map(function (o, k) { return '<button type="button" class="opt" data-v="' + k + '" aria-pressed="' + (S.a[step.id] === k) + '">' + (o[0] ? '<span class="em">' + o[0] + "</span>" : "") + "<span>" + o[1] + "</span></button>"; }).join("") + "</div>";
      pick(step, true);
    } else if (step.type === "info") {
      stage.innerHTML = PICS[step.pic] + '<div class="panel"><h2>' + esc(step.title) + "</h2>" + step.body(a).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + '</div><button type="button" class="cta" id="go">Continue</button>';
      $("go").onclick = qnext;
    } else if (step.type === "name") {
      stage.innerHTML = '<h2 class="center">' + esc(q) + '</h2><p class="hint center">We use it to label the plan. It stays in this browser.</p><form id="nf" class="opts"><label class="lab" for="kidname">First name</label><input class="field" id="kidname" maxlength="24" autocomplete="off" placeholder="e.g. Sam" value="' + esc(S.a.name || "") + '"><button class="cta" type="submit">Build the plan</button></form><button type="button" class="ghost" id="skip">Skip this</button>';
      $("nf").onsubmit = function (e) { e.preventDefault(); S.a.name = $("kidname").value.trim(); qnext(); };
      $("skip").onclick = function () { S.a.name = ""; qnext(); };
    } else if (step.type === "load") {
      var items = ["Reading your answers", "Choosing games for age " + esc(S.a.age || ""), "Fitting the plan into " + esc(S.a.time || "10") + " minutes a day"];
      stage.innerHTML = '<h2 class="center">Putting the plan together</h2><div class="meter"><i id="mi"></i></div><ul class="checks">' + items.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul>";
      var lis = stage.querySelectorAll(".checks li"), t0 = Date.now(), D = 2600;
      (function tick() {
        var p = Math.min(1, (Date.now() - t0) / D); var mi = $("mi"); if (!mi) return;
        mi.style.width = (p * 100) + "%";
        lis.forEach(function (li, k) { li.classList.toggle("done", p >= (k + 1) / lis.length - 0.02); });
        if (p < 1) later(tick, 60); else later(qnext, 300);
      })();
    } else {
      var sc = scores(), lvl = function (v) { return v >= 0.67 ? "Main focus" : v >= 0.34 ? "Some practice" : "Going well"; };
      stage.innerHTML = PICS.kite + '<div class="center"><h1>' + esc(kidName()) + "’s four-week play plan is ready</h1></div>"
        + '<div class="panel"><h3>Where play can help most</h3><div class="areas">' + sc.map(function (s) { return '<div class="area"><b>' + esc(SKILLS[s.k]) + "</b><small>" + lvl(s.v) + '</small><div class="track"><i style="width:' + Math.max(8, Math.round(s.v * 100)) + '%"></i></div></div>'; }).join("") + '</div><p class="fine">Drawn from your answers today. It is a starting point for choosing games, not an assessment.</p></div>'
        + '<button type="button" class="cta" id="go">Start day 1</button>';
      $("go").onclick = function () {
        S.order = sc.map(function (s) { return s.k; }); if (!S.start) S.start = today();
        S.on = true; S.qi = -1; save(); location.hash = "today"; render(true);
      };
    }
  }
  function pick(step, numeric) {
    stage.querySelectorAll(".opt").forEach(function (b) {
      b.onclick = function () {
        S.a[step.id] = numeric ? +b.dataset.v : b.dataset.v;
        stage.querySelectorAll(".opt").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        save(); later(qnext, 160);
      };
    });
  }
  function landing() {
    stage.innerHTML = '<div class="center" style="display:flex;flex-direction:column;gap:12px"><h1>Play that builds focus, patience, and calm</h1><p class="lede">Answer a few questions about your child. You get a four-week plan of short games, a library of ' + ACTS.length + " activities, and " + GAME_LIST.length + ' on-screen games.</p></div><p class="eyebrow center">Who are you raising?</p><div class="who">'
      + '<button type="button" class="card" data-w="boy">' + kid("#F2C9A0", "#7A4A22", "#1E9E8A", "short") + "<span>A boy</span></button>"
      + '<button type="button" class="card" data-w="girl">' + kid("#C68B5E", "#2B1B12", "#F2552C", "long") + "<span>A girl</span></button>"
      + '<button type="button" class="card" data-w="kid">' + kid("#E7B48A", "#D08A2E", "#FFC53D", "curl") + "<span>Skip</span></button></div>"
      + '<p class="fine center">For ages 3 to 12. Wobble is play, not therapy or a diagnosis. If you are worried about your child\'s development, talk to your paediatrician.</p>';
    stage.querySelectorAll(".card").forEach(function (b) { b.onclick = function () { S.a = { who: b.dataset.w }; qgo(0); }; });
  }

  /* ---------- app views ---------- */
  function parseHash() {
    var p = location.hash.replace("#", "").split("/"), r = ["today", "activities", "games", "progress"].indexOf(p[0]) >= 0 ? p[0] : "today";
    return { r: r, sub: (p[1] === "act" || p[1] === "game") && p[2] ? { t: p[1], id: p[2] } : null };
  }
  function route() { return parseHash().r; }
  /* Detail pages live in the hash so the browser Back button returns to the list. */
  function openSub(t, id) { lastY = window.scrollY; inApp = true; location.hash = route() + "/" + t + "/" + id; }
  function closeSub() { kill(); if (inApp) { inApp = false; history.back(); } else location.replace("#" + route()); }
  function actCard(a, extra) {
    var done = doneToday(a.id);
    return '<div class="item' + (done ? " done" : "") + '"><span class="tag">' + esc(SKILLS[a.skill]) + "</span><h3>" + (done ? '<span class="tick" aria-label="Done"></span>' : "") + esc(a.name) + '</h3><p class="meta">' + a.mins + " min · " + esc(a.need) + "</p>" + (a.prep ? '<p class="prep">Plan ahead: ' + esc(a.prep) + "</p>" : "") + '<div class="row"><button type="button" class="btn go" data-open="' + a.id + '">' + (done ? "Play again" : "Open") + "</button>" + (extra || "") + "</div></div>";
  }
  function gameCard(g) {
    var done = doneToday(g.id), b = S.best[g.id];
    return '<div class="item' + (done ? " done" : "") + '"><span class="tag">' + esc(SKILLS[g.skill]) + "</span><h3>" + (done ? '<span class="tick" aria-label="Done"></span>' : "") + esc(g.name) + "</h3><p>" + esc(g.blurb) + '</p><p class="meta">' + g.mins + " min on screen" + (b != null ? " · Best: " + b + " " + g.unit : "") + '</p><div class="row"><button type="button" class="btn go" data-game="' + g.id + '">Play</button></div></div>';
  }
  function wire() {
    stage.querySelectorAll("[data-open]").forEach(function (b) { b.onclick = function () { openSub("act", b.dataset.open); }; });
    stage.querySelectorAll("[data-game]").forEach(function (b) { b.onclick = function () { openSub("game", b.dataset.game); }; });
  }

  function viewToday() {
    var d = dayNum(), p = planFor(S.a, S.order, d, S.swaps);
    var total = p.acts.length + 1, done = p.acts.filter(function (a) { return doneToday(a.id); }).length + (doneToday(p.game.id) ? 1 : 0);
    var mins = p.acts.reduce(function (t, a) { return t + a.mins; }, 0);
    var head = d <= 28 ? "Day " + d + " of 28" : "Day " + d + " · free play";
    stage.innerHTML = '<div><p class="eyebrow">' + head + " · Week " + p.week + "</p><h1>" + esc(p.theme) + '</h1></div><div class="panel"><div class="row" style="justify-content:space-between"><b>' + done + " of " + total + ' done today</b><span class="meta">' + mins + " min together + " + p.game.mins + ' min game</span></div><div class="meter"><i style="width:' + (done / total * 100) + '%"></i></div></div>'
      + "<h2>Play together</h2>" + p.acts.map(function (a, j) { return actCard(a, doneToday(a.id) ? "" : '<button type="button" class="btn" data-swap="' + j + '">Swap</button>'); }).join("")
      + "<h2>On-screen game</h2>" + gameCard(p.game)
      + (done === total ? '<div class="panel"><h3>That is today done</h3><p>' + esc(kidName()) + " can pick anything from Activities or Games for extra play. A new plan appears tomorrow.</p></div>" : "");
    stage.querySelectorAll("[data-swap]").forEach(function (b) { b.onclick = function () { var k = d + "-" + b.dataset.swap; S.swaps[k] = (S.swaps[k] || 0) + 1; save(); render(false); }; });
    wire();
  }

  function viewActivities() {
    var chips = [["all", "All"]].concat(Object.keys(SKILLS).map(function (k) { return [k, SKILLS[k]]; })).concat([["go", "On the go"]]);
    var list = ACTS.filter(function (a) { return (filt.skill === "all" || (filt.skill === "go" ? a.go : a.skill === filt.skill)) && (!filt.age || fits(a, S.a.age)); });
    stage.innerHTML = "<h1>Activities</h1>"
      + '<div class="chips">' + chips.map(function (c) { return '<button type="button" class="chip" data-f="' + c[0] + '" aria-pressed="' + (filt.skill === c[0]) + '">' + esc(c[1]) + "</button>"; }).join("") + "</div>"
      + '<div class="row"><button type="button" class="chip" id="agef" aria-pressed="' + filt.age + '">Only for age ' + esc(S.a.age) + '</button><span class="meta">' + list.length + " of " + ACTS.length + " activities</span></div>"
      + list.map(function (a) { return actCard(a); }).join("");
    stage.querySelectorAll("[data-f]").forEach(function (b) { b.onclick = function () { filt.skill = b.dataset.f; render(false); }; });
    $("agef").onclick = function () { filt.age = !filt.age; render(false); };
    wire();
  }

  function viewAct(id) {
    var a = ACTS.filter(function (x) { return x.id === id; })[0]; if (!a) { sub = null; location.replace("#" + route()); return render(false); }
    var n = S.log.filter(function (l) { return l.id === id; }).length;
    stage.innerHTML = '<button type="button" class="btn" id="bk" style="align-self:flex-start">Back</button><div><span class="tag">' + esc(SKILLS[a.skill]) + "</span><h1>" + esc(a.name) + '</h1><p class="meta">' + a.mins + " min · Ages " + a.min + " to " + a.max + (a.go ? " · Works on the go" : "") + (n ? " · Played " + n + (n === 1 ? " time" : " times") : "") + "</p></div>"
      + '<div class="panel"><p class="lab">You need</p><p>' + esc(a.need) + "</p>" + (a.prep ? '<p class="prep">Plan ahead: ' + esc(a.prep) + "</p>" : "") + '<p class="lab">How to play</p><ol class="steps">' + a.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + '</ol><div class="vary"><p><b>Make it easier:</b> ' + esc(a.easier) + "</p><p><b>Make it harder:</b> " + esc(a.harder) + "</p></div></div>"
      + '<div class="panel"><div class="clock" id="clock">' + a.mins + ':00</div><div class="row" style="justify-content:center"><button type="button" class="btn" id="tstart">Start timer</button></div></div>'
      + '<button type="button" class="cta" id="played">We played it</button>';
    $("bk").onclick = closeSub;
    var left = a.mins * 60, running = false;
    function show() { var c = $("clock"); if (c) c.textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0"); }
    var tg = 0;
    function tick(my) { if (!running || my !== tg) return; left--; show(); if (left <= 0) { running = false; $("tstart").textContent = "Time is up"; $("tstart").disabled = true; return; } later(function () { tick(my); }, 1000); }
    $("tstart").onclick = function () { running = !running; this.textContent = running ? "Pause" : "Resume"; if (running) { var my = ++tg; later(function () { tick(my); }, 1000); } };
    $("played").onclick = function () { kill(); logIt("act", a.id, a.skill, a.mins); closeSub(); };
  }

  function viewGames() {
    stage.innerHTML = '<h1>Games</h1><p class="lede">Short games for your child to play on this screen. Sit alongside for the first round.</p>' + GAME_LIST.map(gameCard).join("");
    wire();
  }

  function viewGame(id) {
    var g = GAME_LIST.filter(function (x) { return x.id === id; })[0]; if (!g) { sub = null; location.replace("#" + route()); return render(false); }
    var age = AGE_N[S.a.age] || 6;
    stage.innerHTML = '<button type="button" class="btn" id="bk" style="align-self:flex-start">Back</button><div><span class="tag">' + esc(SKILLS[g.skill]) + "</span><h1>" + esc(g.name) + '</h1><p class="lede">' + esc(g.blurb) + '</p></div><div class="panel"><div class="gbox" id="gbox"><button type="button" class="cta" id="gstart">Start</button></div></div>';
    $("bk").onclick = closeSub;
    var box = $("gbox");
    function finish(score) {
      kill(); logIt("game", g.id, g.skill, g.mins);
      var msg = "Nicely done.";
      if (score != null) {
        var b = S.best[g.id], isBest = b == null || (g.better === "low" ? score < b : score > b);
        if (isBest) { S.best[g.id] = score; save(); }
        msg = score + " " + g.unit + (isBest ? ". A new best!" : ". Best so far: " + b + ".");
      }
      box.innerHTML = '<h2 class="center">' + esc(msg) + '</h2><div class="row"><button type="button" class="btn go" id="again">Play again</button><button type="button" class="btn" id="fin">Done</button></div>';
      $("again").onclick = function () { box.innerHTML = ""; PLAY[g.id](box, age, finish); };
      $("fin").onclick = closeSub;
    }
    $("gstart").onclick = function () { box.innerHTML = ""; PLAY[g.id](box, age, finish); };
  }

  /* ---------- on-screen games ---------- */
  var PLAY = {
    match: function (box, age, finish) {
      var n = age <= 4 ? 3 : age <= 6 ? 6 : 8, pool = shuffle(["🐸", "🦆", "🐟", "🐢", "🦋", "🐞", "🌼", "🍄", "🐌", "🦀"]).slice(0, n);
      var cards = shuffle(pool.concat(pool)), first = null, lock = false, moves = 0, found = 0;
      box.innerHTML = '<p class="gmsg" id="gm">Find the pairs</p><div class="grid" style="grid-template-columns:repeat(' + (n === 3 ? 3 : 4) + ',1fr)">' + cards.map(function (c, i) { return '<button type="button" class="cardb" data-i="' + i + '" aria-label="Card">?</button>'; }).join("") + "</div>";
      box.querySelectorAll(".cardb").forEach(function (b) {
        b.onclick = function () {
          if (lock || b.classList.contains("up")) return;
          b.classList.add("up"); b.textContent = cards[+b.dataset.i];
          if (!first) { first = b; return; }
          moves++; $("gm").textContent = "Turns: " + moves;
          var a = first; first = null;
          if (cards[+a.dataset.i] === cards[+b.dataset.i]) { a.classList.add("ok"); b.classList.add("ok"); found++; if (found === n) later(function () { finish(moves); }, 600); }
          else { lock = true; later(function () { [a, b].forEach(function (x) { x.classList.remove("up"); x.textContent = "?"; }); lock = false; }, 800); }
        };
      });
    },
    gofrog: function (box, age, finish) {
      var total = 16, i = 0, score = 0, dur = age <= 4 ? 1500 : age <= 6 ? 1200 : 900, active = false, tapped = false, isGo = true;
      box.innerHTML = '<p class="gmsg" id="gm">Tap the frogs, not the crocodile</p><button type="button" class="big" id="tgt" aria-label="Tap target"></button><p class="meta" id="gc"></p>';
      var tgt = $("tgt");
      function next() {
        if (i === total) return finish(score);
        tgt.textContent = ""; $("gc").textContent = (i + 1) + " of " + total;
        later(function () {
          isGo = Math.random() < 0.7; tapped = false; active = true; tgt.textContent = isGo ? "🐸" : "🐊";
          later(function () { active = false; if (!tapped) { if (!isGo) { score++; $("gm").textContent = "Good waiting!"; } else $("gm").textContent = "That frog got away"; } i++; next(); }, dur);
        }, 500);
      }
      tgt.onclick = function () { if (!active || tapped) return; tapped = true; if (isGo) { score++; $("gm").textContent = "Got it!"; } else $("gm").textContent = "Oops, that was the crocodile"; tgt.textContent = isGo ? "✨" : "💦"; };
      next();
    },
    path: function (box, age, finish) {
      var seq = [rnd(9), rnd(9)], pos = 0, lock = true, best = 0;
      box.innerHTML = '<p class="gmsg" id="gm">Watch</p><div class="grid" style="grid-template-columns:repeat(3,1fr);max-width:300px">' + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (k) { return '<button type="button" class="pad" data-k="' + k + '" aria-label="Light ' + (k + 1) + '"></button>'; }).join("") + "</div>";
      var pads = box.querySelectorAll(".pad");
      function flash(k, ms) { pads[k].classList.add("lit"); later(function () { pads[k].classList.remove("lit"); }, ms); }
      function show() {
        lock = true; pos = 0; $("gm").textContent = "Watch";
        seq.forEach(function (k, n) { later(function () { flash(k, 420); }, 600 + n * 650); });
        later(function () { lock = false; $("gm").textContent = "Your turn: " + seq.length + " lights"; }, 600 + seq.length * 650);
      }
      pads.forEach(function (p) {
        p.onclick = function () {
          if (lock) return; var k = +p.dataset.k; flash(k, 200);
          if (k !== seq[pos]) { lock = true; $("gm").textContent = "Not that one"; return later(function () { finish(best); }, 700); }
          pos++;
          if (pos === seq.length) { best = seq.length; lock = true; $("gm").textContent = "Yes!"; seq.push(rnd(9)); later(show, 700); }
        };
      });
      show();
    },
    odd: function (box, age, finish) {
      var pairs = [["🐶", "🐱"], ["🍎", "🍅"], ["🌝", "🌞"], ["🐸", "🐢"], ["⭐", "🌟"], ["🐟", "🐠"], ["🍋", "🍌"], ["🚗", "🚕"], ["🌲", "🌳"], ["🐝", "🐞"]];
      var score = 0, end = Date.now() + 40000;
      box.innerHTML = '<p class="gmsg" id="gm"></p><div class="grid" id="og"></div>';
      function round() {
        var side = Math.min(5, 2 + Math.floor(score / 2)), p = pairs[rnd(pairs.length)], flip = rnd(2), odd = rnd(side * side), html = "";
        for (var i = 0; i < side * side; i++) html += '<button type="button" class="cardb up" data-o="' + (i === odd ? 1 : 0) + '">' + (i === odd ? p[1 - flip] : p[flip]) + "</button>";
        var og = $("og"); og.style.gridTemplateColumns = "repeat(" + side + ",1fr)"; og.innerHTML = html;
        og.querySelectorAll("button").forEach(function (b) { b.onclick = function () { if (b.dataset.o === "1") { score++; round(); } else b.style.opacity = ".35"; }; });
      }
      (function clock() { var left = Math.ceil((end - Date.now()) / 1000); if (left <= 0) return finish(score); $("gm").textContent = left + " seconds · found " + score; later(clock, 250); })();
      round();
    },
    star: function (box, age, finish) {
      var rounds = 6, r = 0, score = 0, state = "idle", token = 0;
      box.innerHTML = '<p class="gmsg" id="gm">Wait for gold…</p><button type="button" class="big" id="tgt" aria-label="Star"><span class="star" id="st">⭐</span></button><p class="meta" id="gc"></p>';
      function start() {
        if (r === rounds) return finish(score);
        var my = ++token; state = "wait"; $("st").classList.remove("gold"); $("gc").textContent = "Star " + (r + 1) + " of " + rounds;
        later(function () {
          if (my !== token) return; state = "gold"; $("st").classList.add("gold"); $("gm").textContent = "Now!";
          later(function () { if (my !== token || state !== "gold") return; state = "idle"; $("gm").textContent = "It faded. Next star."; r++; later(start, 900); }, 1600);
        }, (age <= 4 ? 1500 : 2000) + rnd(age <= 4 ? 2500 : 4500));
      }
      $("tgt").onclick = function () {
        if (state === "wait") { token++; state = "idle"; $("gm").textContent = "Too soon. Wait for gold…"; later(start, 900); }
        else if (state === "gold") { token++; state = "idle"; score++; r++; $("gm").textContent = "Caught it!"; later(start, 900); }
      };
      start();
    },
    breathe: function (box, age, finish) {
      var total = 6, n = 0, secs = age <= 6 ? 3 : 4;
      box.innerHTML = '<p class="gmsg" id="gm">Get comfy</p><div class="lungwrap"><div class="lung" id="lung"></div></div><p class="meta" id="gc"></p>';
      var lung = $("lung"); lung.style.transitionDuration = secs + "s";
      function cycle() {
        if (n === total) return finish(null);
        $("gc").textContent = "Breath " + (n + 1) + " of " + total; $("gm").textContent = "Breathe in…"; lung.style.transform = "scale(2)";
        later(function () { $("gm").textContent = "Breathe out…"; lung.style.transform = "scale(1)"; later(function () { n++; cycle(); }, secs * 1000); }, secs * 1000);
      }
      later(cycle, 800);
    },
    freeze: function (box, age, finish) {
      var rounds = 6, r = 0;
      box.innerHTML = '<p class="gmsg">Put on your own music and stand back from the screen</p><div class="flash" id="fl">Ready…</div><p class="meta" id="gc"></p>';
      function dance() {
        if (r === rounds) return finish(null);
        var fl = $("fl"); fl.classList.remove("stop"); fl.textContent = "Dance!"; $("gc").textContent = "Round " + (r + 1) + " of " + rounds;
        later(function () { fl.classList.add("stop"); fl.textContent = "Freeze!"; later(function () { r++; dance(); }, 3500 + rnd(3000)); }, 4500 + rnd(6000));
      }
      later(dance, 1500);
    }
  };

  /* ---------- progress ---------- */
  var confirmErase = false;
  function viewProgress() {
    var dates = {}; S.log.forEach(function (l) { dates[l.d] = 1; });
    var streak = 0, d = new Date(today() + "T00:00"), key = function (x) { return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
    if (!dates[key(d)]) d.setDate(d.getDate() - 1);
    while (dates[key(d)]) { streak++; d.setDate(d.getDate() - 1); }
    var mins = S.log.reduce(function (s, l) { return s + (l.m || 0); }, 0), by = {};
    S.log.forEach(function (l) { by[l.k] = (by[l.k] || 0) + 1; });
    var max = Math.max.apply(null, [1].concat(Object.keys(by).map(function (k) { return by[k]; })));
    var now = dayNum(), cells = "";
    for (var i = 1; i <= 28; i++) { var x = new Date(S.start + "T00:00"); x.setDate(x.getDate() + i - 1); cells += '<div class="day' + (dates[key(x)] ? " hit" : "") + (i === now ? " now" : "") + '">' + i + "</div>"; }
    var bests = GAME_LIST.filter(function (g) { return S.best[g.id] != null; });
    stage.innerHTML = "<h1>" + esc(kidName()) + '’s progress</h1><div class="stats"><div class="stat"><b>' + streak + '</b><span>day streak</span></div><div class="stat"><b>' + S.log.length + '</b><span>games played</span></div><div class="stat"><b>' + mins + "</b><span>minutes</span></div></div>"
      + '<div class="panel"><h3>The four weeks</h3><div class="days">' + cells + '</div><p class="fine">Filled days are days with at least one game played.</p></div>'
      + '<div class="panel"><h3>Practice by skill</h3><div class="areas">' + Object.keys(SKILLS).map(function (k) { var v = by[k] || 0; return '<div class="area"><b>' + esc(SKILLS[k]) + "</b><small>" + v + (v === 1 ? " game" : " games") + '</small><div class="track"><i style="width:' + (v / max * 100) + '%"></i></div></div>'; }).join("") + "</div></div>"
      + (bests.length ? '<div class="panel"><h3>Best scores</h3>' + bests.map(function (g) { return '<div class="row" style="justify-content:space-between"><b>' + esc(g.name) + '</b><span class="meta">' + S.best[g.id] + " " + g.unit + "</span></div>"; }).join("") + "</div>" : "")
      + '<div class="panel"><h3>Settings</h3><p class="fine">Progress is saved in this browser only. There are no accounts yet, so it does not follow you to another device.</p><div class="row"><button type="button" class="btn" id="retake">Retake the quiz</button><button type="button" class="btn" id="erase">Erase everything</button></div>'
      + (confirmErase ? '<div class="warn"><b>Erase the plan and all progress? This cannot be undone.</b><div class="row"><button type="button" class="btn go" id="yes">Yes, erase</button><button type="button" class="btn" id="no">Keep it</button></div></div>' : "") + "</div>";
    $("retake").onclick = function () { S.on = false; S.qi = -1; save(); render(true); };
    $("erase").onclick = function () { confirmErase = true; render(false); };
    if (confirmErase) {
      $("yes").onclick = function () { confirmErase = false; S = { on: false, qi: -1, a: {}, order: null, start: null, log: [], best: {}, swaps: {} }; save(); render(true); };
      $("no").onclick = function () { confirmErase = false; render(false); };
    }
  }

  /* ---------- shell ---------- */
  function render(anim) {
    kill();
    stage.classList.remove("enter");
    if (anim) { void stage.offsetWidth; stage.classList.add("enter"); }
    $("tabs").hidden = !S.on;
    $("head").classList.toggle("mid", !S.on);
    $("whochip").hidden = !S.on;
    if (!S.on) return renderQuiz();
    $("top").hidden = true; $("bars").hidden = true;
    $("whochip").textContent = kidName() + " · age " + S.a.age;
    var r = route();
    document.querySelectorAll("#tabs a").forEach(function (a) { if (a.getAttribute("href") === "#" + r) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    if (sub && sub.t === "act") return viewAct(sub.id);
    if (sub && sub.t === "game") return viewGame(sub.id);
    ({ today: viewToday, activities: viewActivities, games: viewGames, progress: viewProgress })[r]();
  }
  $("back").onclick = function () { qgo(S.qi - 1); };
  var curR = route();
  window.addEventListener("hashchange", function () {
    var h = parseHash(), back = sub && !h.sub && h.r === curR;
    sub = h.sub; curR = h.r; confirmErase = false; if (!sub) inApp = false;
    render(true); window.scrollTo(0, back ? lastY : 0);
  });
  sub = parseHash().sub;
  if (!S.on && STEPS[S.qi] && STEPS[S.qi].type === "load") S.qi++;
  render(false);
})();
