// SmartLearn interactivity: theme, filter, practice sets, quizzes, progress
// Lightweight vanilla JS, no dependencies. Progress saved in localStorage.

var practiceData = {
  Mathematics: [
    "Solve for x: 2x + 5 = 15",
    "Find the area of a triangle with base 8cm and height 5cm.",
    "Simplify: 3/4 + 1/2"
  ],
  Science: [
    "Name the three states of matter with one example each.",
    "What is the function of mitochondria in a cell?",
    "State Newton's First Law of Motion."
  ],
  English: [
    "Identify the verb in: 'She quickly finished her homework.'",
    "Write a 5-sentence paragraph about your best friend.",
    "What is the past tense of 'go', 'eat', and 'write'?"
  ],
  History: [
    "Name two causes of colonialism in Africa.",
    "What year did your country gain independence? Who was the first leader?",
    "Put in order: Stone Age, Iron Age, Colonial Era, Independence."
  ]
};

var quizData = {
  Mathematics: [
    { q: "Solve for x: 2x + 5 = 15", options: ["x = 3", "x = 5", "x = 10"], answer: 1, explain: "2x = 10, so x = 5." },
    { q: "Area of triangle, base 8cm, height 5cm?", options: ["13 cm²", "20 cm²", "40 cm²"], answer: 1, explain: "Area = (base × height) / 2 = 20 cm²." },
    { q: "Simplify 3/4 + 1/2", options: ["4/6", "5/4", "3/6"], answer: 1, explain: "3/4 + 2/4 = 5/4." }
  ],
  Science: [
    { q: "Which is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome"], answer: 1, explain: "Mitochondria release energy." },
    { q: "How many states of matter are commonly taught?", options: ["2", "3", "5"], answer: 1, explain: "Solid, liquid, gas." },
    { q: "Newton's First Law is about:", options: ["Force = ma", "Inertia", "Gravity"], answer: 1, explain: "Objects keep moving unless a force acts." }
  ],
  English: [
    { q: "Verb in: 'She quickly finished her homework.'", options: ["She", "quickly", "finished"], answer: 2, explain: "'Finished' is the action." },
    { q: "Past tense of 'go'?", options: ["goed", "went", "gone (as simple past)"], answer: 1, explain: "Go → went." },
    { q: "Which is a complete sentence?", options: ["Running fast.", "She runs fast.", "Fast run."], answer: 1, explain: "Needs subject + verb." }
  ],
  History: [
    { q: "Correct order (earliest first)?", options: ["Iron Age, Stone Age, Independence", "Stone Age, Iron Age, Colonial Era, Independence", "Colonial Era, Stone Age, Independence"], answer: 1, explain: "Stone → Iron → Colonial → Independence." },
    { q: "A cause of colonialism was:", options: ["Search for raw materials", "Invention of the internet", "Space travel"], answer: 0, explain: "Economic motives drove colonialism." },
    { q: "Timelines mainly show:", options: ["Recipes", "Order of events over time", "Weather"], answer: 1, explain: "Timelines order events." }
  ]
};

function loadJSON(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) { /* private mode: ignore */ }
}

// ---- Theme (all pages) ----
(function initTheme() {
  var saved = null;
  try { saved = localStorage.getItem("smartlearn-theme"); } catch (e) {}
  if (saved === "dark") document.body.classList.add("dark");
  var btn = document.getElementById("themeToggle");
  if (!btn) return;
  var paint = function () {
    btn.textContent = document.body.classList.contains("dark") ? "Light mode" : "Dark mode";
  };
  paint();
  btn.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    try {
      localStorage.setItem("smartlearn-theme", document.body.classList.contains("dark") ? "dark" : "light");
    } catch (e) {}
    paint();
  });
})();

// ---- Phase 2 store: mock users + per-user progress (local only) ----
// Local SQLite mirror: db/schema.sql tables users/progress/scores.
// Browser adapter below uses the same shape in localStorage so the single
// local page still opens by double-click. Swap SmartLearnStore internals
// for sqlite3 (local file smartlearn.db, never committed) in Phase 2 full.
var USER_KEY = "smartlearn-user";
var MOCK_USERS = ["guest", "test-student", "demo-teacher"];
var USER_NAMES = { guest: "Guest", "test-student": "Test Student", "demo-teacher": "Demo Teacher" };

function getUser() {
  try {
    var u = localStorage.getItem(USER_KEY);
    return MOCK_USERS.indexOf(u) !== -1 ? u : "guest";
  } catch (e) { return "guest"; }
}

function completeKey() { return "smartlearn-" + getUser() + "-complete"; }
function scoreKey() { return "smartlearn-" + getUser() + "-scores"; }

function getCompleted() {
  var v = loadJSON(completeKey(), null);
  if (v !== null) return v;
  return loadJSON("smartlearn-complete", []); // migrate Phase 1 global key
}
function getScores() {
  var v = loadJSON(scoreKey(), null);
  if (v !== null) return v;
  return loadJSON("smartlearn-scores", {}); // migrate Phase 1 global key
}
function saveCompleted(v) { saveJSON(completeKey(), v); }
function saveScores(v) { saveJSON(scoreKey(), v); }

// ---- Phase 3: custom teacher questions (local only, per mock user) ----
function customKey() { return "smartlearn-" + getUser() + "-custom-quiz"; }
function getCustomQuiz() {
  var v = loadJSON(customKey(), null);
  return v && typeof v === "object" ? v : {};
}
function saveCustomQuiz(v) { saveJSON(customKey(), v); }
function getQuizQuestions(subject) {
  var base = quizData[subject] || [];
  var custom = getCustomQuiz()[subject] || [];
  return base.concat(custom);
}
function isValidQuizItem(item) {
  return item && typeof item.q === "string" && item.q.trim().length > 0 &&
    Array.isArray(item.options) && item.options.length === 3 &&
    item.options.every(function (o) { return typeof o === "string" && o.trim().length > 0; }) &&
    (item.answer === 0 || item.answer === 1 || item.answer === 2);
}

function refreshProgressUI() {
  var cards = document.querySelectorAll(".subject-card");
  var completed = getCompleted();
  var scores = getScores();

  cards.forEach(function (card) {
    var subject = card.getAttribute("data-subject");
    var done = completed.indexOf(subject) !== -1;
    var badge = card.querySelector("[data-complete-badge]");
    var btn = card.querySelector(".complete-btn");
    var scoreEl = card.querySelector("[data-best-score]");
    if (badge) badge.hidden = !done;
    if (btn) {
      btn.textContent = done ? "Completed ✓" : "Mark Complete";
      if (done) btn.classList.add("completed");
      else btn.classList.remove("completed");
    }
    if (scoreEl) {
      var best = scores[subject];
      scoreEl.textContent = (best !== undefined) ? ("Best quiz score: " + best + " / " + getQuizQuestions(subject).length) : "";
    }
  });

  var fill = document.getElementById("progressFill");
  var text = document.getElementById("progressText");
  if (fill && text && cards.length) {
    var n = 0;
    cards.forEach(function (c) {
      if (completed.indexOf(c.getAttribute("data-subject")) !== -1) n++;
    });
    fill.style.width = Math.round((n / cards.length) * 100) + "%";
    text.textContent = n === 0 ? "No subjects completed yet — start with one quiz."
      : n === cards.length ? "All " + cards.length + " subjects completed. Well done!"
      : n + " of " + cards.length + " subjects completed.";
  }

  var home = document.getElementById("homeProgress");
  if (home) {
    var c2 = getCompleted();
    var who = USER_NAMES[getUser()] || getUser();
    home.textContent = c2.length ? (who + " progress: " + c2.length + " / 4 subjects completed.") : (who + " progress: 0 / 4 — start on the Subjects page.");
  }
}

document.querySelectorAll(".complete-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var subject = btn.getAttribute("data-subject");
    var completed = getCompleted();
    var i = completed.indexOf(subject);
    if (i === -1) completed.push(subject);
    else completed.splice(i, 1);
    saveCompleted(completed);
    refreshProgressUI();
  });
});

var resetBtn = document.getElementById("resetProgressBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", function () {
    saveCompleted([]);
    saveScores({});
    refreshProgressUI();
  });
}

// ---- Mock auth wiring (test users only, no passwords) ----
var userSelect = document.getElementById("userSelect");
if (userSelect) {
  userSelect.value = getUser();
  userSelect.addEventListener("change", function () {
    var v = userSelect.value;
    if (MOCK_USERS.indexOf(v) === -1) v = "guest";
    try { localStorage.setItem(USER_KEY, v); } catch (e) {}
    refreshProgressUI();
  });
}

// ---- Filter (subjects page) ----
var searchInput = document.getElementById("searchInput");
var subjectCards = document.querySelectorAll(".subject-card");
var resultCount = document.getElementById("resultCount");
var noResults = document.getElementById("noResults");

function updateResultCount(visibleCount) {
  if (!resultCount) return;
  resultCount.textContent =
    visibleCount === subjectCards.length
      ? "Showing all " + visibleCount + " subjects"
      : "Showing " + visibleCount + " of " + subjectCards.length + " subjects";
}

if (searchInput) {
  var filterSubjects = function () {
    var query = searchInput.value.toLowerCase().trim();
    var visible = 0;
    subjectCards.forEach(function (card) {
      var hay = (card.getAttribute("data-name") || "" + " " + card.textContent).toLowerCase();
      var match = hay.indexOf(query) !== -1;
      card.hidden = !match;
      if (match) visible++;
    });
    updateResultCount(visible);
    if (noResults) noResults.hidden = visible !== 0;
  };
  searchInput.addEventListener("input", filterSubjects);
  updateResultCount(subjectCards.length);
}

// ---- Practice sets ----
document.querySelectorAll(".practice-btn").forEach(function (button) {
  button.addEventListener("click", function () {
    var subject = button.getAttribute("data-subject");
    var box = button.parentElement.querySelector(".practice-set");
    if (!box) return;
    if (box.hidden) {
      var questions = practiceData[subject] || [];
      var html = "<strong>" + subject + " Practice Set:</strong><ul>";
      questions.forEach(function (q) { html += "<li>" + q + "</li>"; });
      html += "</ul>";
      box.innerHTML = html;
      box.hidden = false;
      button.textContent = "Hide Practice Set";
    } else {
      box.hidden = true;
      box.innerHTML = "";
      button.textContent = "Show Practice Set";
    }
  });
});

// ---- Quizzes ----
function renderQuiz(subject, box, button) {
  var questions = getQuizQuestions(subject);
  var state = { index: 0, score: 0 };
  box.hidden = false;
  if (button) button.textContent = "Hide Quiz";

  function showQuestion() {
    if (state.index >= questions.length) {
      var scores = getScores();
      var prev = scores[subject] || 0;
      if (state.score > prev) {
        scores[subject] = state.score;
        saveScores(scores);
      }
      box.innerHTML =
        "<strong>" + subject + " Quiz complete!</strong>" +
        "<p>Score: " + state.score + " / " + questions.length + "</p>" +
        "<p class='muted'>" + (state.score === questions.length ? "Perfect! Mark this subject complete."
          : state.score >= 2 ? "Good job! Review once more to get 3/3."
          : "Keep practising — try the Practice Set above, then retry.") + "</p>" +
        "<button type='button' class='btn btn-small quiz-retry'>Retry Quiz</button>";
      refreshProgressUI();
      box.querySelector(".quiz-retry").addEventListener("click", function () {
        state.index = 0; state.score = 0; showQuestion();
      });
      return;
    }
    var item = questions[state.index];
    var html = "<strong>" + subject + " Quiz (" + (state.index + 1) + "/" + questions.length + ")</strong>";
    html += "<p class='quiz-q'>" + item.q + "</p><div class='quiz-options'>";
    item.options.forEach(function (opt, i) {
      html += "<button type='button' class='quiz-option' data-i='" + i + "'>" + opt + "</button>";
    });
    html += "</div><p class='quiz-feedback' aria-live='polite'></p>";
    box.innerHTML = html;

    box.querySelectorAll(".quiz-option").forEach(function (optBtn) {
      optBtn.addEventListener("click", function () {
        var picked = parseInt(optBtn.getAttribute("data-i"), 10);
        var ok = picked === item.answer;
        var all = box.querySelectorAll(".quiz-option");
        all.forEach(function (b) {
          b.disabled = true;
          var bi = parseInt(b.getAttribute("data-i"), 10);
          if (bi === item.answer) b.classList.add("correct");
        });
        var fb = box.querySelector(".quiz-feedback");
        if (ok) {
          state.score++;
          fb.textContent = "Correct! " + item.explain;
          fb.className = "quiz-feedback good";
        } else {
          optBtn.classList.add("wrong");
          fb.textContent = "Not quite. " + item.explain;
          fb.className = "quiz-feedback bad";
        }
        var next = document.createElement("button");
        next.type = "button";
        next.className = "btn btn-small";
        next.textContent = state.index + 1 === questions.length ? "See Score" : "Next Question";
        next.addEventListener("click", function () { state.index++; showQuestion(); });
        fb.appendChild(document.createElement("br"));
        fb.appendChild(next);
      });
    });
  }
  showQuestion();
}

document.querySelectorAll(".quiz-btn").forEach(function (button) {
  button.addEventListener("click", function () {
    var subject = button.getAttribute("data-subject");
    var card = button.closest(".subject-card");
    var box = card ? card.querySelector(".quiz-box") : null;
    if (!box) return;
    if (box.hidden) renderQuiz(subject, box, button);
    else {
      box.hidden = true;
      box.innerHTML = "";
      button.textContent = "Start Quiz";
    }
  });
});

// ---- Random pickers ----
var randomSubjectBtn = document.getElementById("randomSubjectBtn");
if (randomSubjectBtn) {
  randomSubjectBtn.addEventListener("click", function () {
    var visible = [];
    subjectCards.forEach(function (c) { if (!c.hidden) visible.push(c); });
    if (!visible.length) return;
    var pick = visible[Math.floor(Math.random() * visible.length)];
    pick.scrollIntoView({ behavior: "smooth", block: "center" });
    pick.classList.add("flash");
    setTimeout(function () { pick.classList.remove("flash"); }, 1200);
  });
}

var randomBtn = document.getElementById("randomBtn");
var randomPick = document.getElementById("randomPick");
if (randomBtn && randomPick) {
  var names = ["Mathematics", "Science", "English", "History"];
  randomBtn.addEventListener("click", function () {
    var pick = names[Math.floor(Math.random() * names.length)];
    randomPick.textContent = "Try this: " + pick + " — open Subjects and start its quiz!";
  });
}

// ---- Phase 3 admin page (local only) ----
(function initAdmin() {
  var form = document.getElementById("addQuestionForm");
  if (!form) return; // only on admin.html
  var subjectEl = document.getElementById("qSubject");
  var textEl = document.getElementById("qText");
  var optEls = [document.getElementById("qOpt0"), document.getElementById("qOpt1"), document.getElementById("qOpt2")];
  var answerEl = document.getElementById("qAnswer");
  var explainEl = document.getElementById("qExplain");
  var msgEl = document.getElementById("addQuestionMsg");
  var listEl = document.getElementById("customList");
  var filterEl = document.getElementById("adminFilter");
  var noteEl = document.getElementById("adminUserNote");
  var exportEl = document.getElementById("exportText");
  var importEl = document.getElementById("importText");
  var importMsg = document.getElementById("importMsg");

  function paintNote() {
    if (noteEl) noteEl.textContent = "Editing as " + (USER_NAMES[getUser()] || getUser()) + " — custom questions are stored in this browser only.";
  }

  function paintExport() {
    if (exportEl) exportEl.value = JSON.stringify(getCustomQuiz(), null, 2);
  }

  function paintList() {
    paintNote();
    paintExport();
    var data = getCustomQuiz();
    var filter = filterEl ? filterEl.value : "";
    var subjects = Object.keys(data).filter(function (s) { return !filter || s === filter; });
    var total = 0;
    subjects.forEach(function (s) { total += (data[s] || []).length; });
    if (!total) {
      listEl.innerHTML = "<p class='muted'>No custom questions yet for this mock user. Add one above.</p>";
      return;
    }
    var html = "";
    subjects.forEach(function (s) {
      (data[s] || []).forEach(function (item, i) {
        html += "<div class='custom-item'><strong>" + s + " #" + (i + 1) + ":</strong> " + item.q +
          "<br /><span class='muted'>A) " + item.options[0] + " · B) " + item.options[1] + " · C) " + item.options[2] +
          " — correct: " + ["A", "B", "C"][item.answer] + "</span>" +
          "<br /><button type='button' class='btn btn-small btn-outline' data-del-subject='" + s + "' data-del-index='" + i + "'>Delete</button></div>";
      });
    });
    listEl.innerHTML = html;
    listEl.querySelectorAll("[data-del-subject]").forEach(function (b) {
      b.addEventListener("click", function () {
        var d = getCustomQuiz();
        var s = b.getAttribute("data-del-subject");
        var idx = parseInt(b.getAttribute("data-del-index"), 10);
        if (d[s]) d[s].splice(idx, 1);
        if (d[s] && !d[s].length) delete d[s];
        saveCustomQuiz(d);
        paintList();
        refreshProgressUI();
      });
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var item = {
      q: textEl.value.trim(),
      options: [optEls[0].value.trim(), optEls[1].value.trim(), optEls[2].value.trim()],
      answer: parseInt(answerEl.value, 10),
      explain: explainEl.value.trim()
    };
    if (!isValidQuizItem(item)) {
      msgEl.textContent = "Fill the question and all 3 options.";
      return;
    }
    var d = getCustomQuiz();
    var s = subjectEl.value;
    if (!d[s]) d[s] = [];
    d[s].push(item);
    saveCustomQuiz(d);
    form.reset();
    msgEl.textContent = "Added to " + s + " for " + (USER_NAMES[getUser()] || getUser()) + ". It now appears in that subject's quiz.";
    paintList();
    refreshProgressUI();
  });

  if (filterEl) filterEl.addEventListener("change", paintList);

  var clearBtn = document.getElementById("clearCustomBtn");
  if (clearBtn) clearBtn.addEventListener("click", function () {
    saveCustomQuiz({});
    paintList();
    refreshProgressUI();
  });

  var exportBtn = document.getElementById("exportBtn");
  if (exportBtn) exportBtn.addEventListener("click", paintExport);

  var copyBtn = document.getElementById("copyExportBtn");
  if (copyBtn) copyBtn.addEventListener("click", function () {
    paintExport();
    try {
      exportEl.select();
      document.execCommand("copy");
    } catch (e) {}
  });

  var dlBtn = document.getElementById("downloadExportBtn");
  if (dlBtn) dlBtn.addEventListener("click", function () {
    paintExport();
    var blob = new Blob([exportEl.value || "{}"], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "smartlearn-custom-quiz.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { document.body.removeChild(a); }, 100);
  });

  var fileInput = document.getElementById("importFile");
  if (fileInput) fileInput.addEventListener("change", function () {
    var f = fileInput.files && fileInput.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function () { importEl.value = String(r.result || ""); };
    r.readAsText(f);
  });

  var importBtn = document.getElementById("importBtn");
  if (importBtn) importBtn.addEventListener("click", function () {
    try {
      var parsed = JSON.parse(importEl.value || "{}");
      var clean = {};
      Object.keys(parsed).forEach(function (s) {
        if (!quizData[s]) return;
        var arr = Array.isArray(parsed[s]) ? parsed[s] : [];
        arr.forEach(function (item) {
          if (isValidQuizItem(item)) {
            if (!clean[s]) clean[s] = [];
            clean[s].push({ q: item.q.trim(), options: item.options.map(function (o) { return o.trim(); }), answer: item.answer, explain: String(item.explain || "") });
          }
        });
      });
      var current = getCustomQuiz();
      Object.keys(clean).forEach(function (s) {
        if (!current[s]) current[s] = [];
        current[s] = current[s].concat(clean[s]);
      });
      saveCustomQuiz(current);
      importMsg.textContent = "Imported custom questions for " + (USER_NAMES[getUser()] || getUser()) + ".";
      importEl.value = "";
      paintList();
      refreshProgressUI();
    } catch (e) {
      importMsg.textContent = "Invalid JSON — nothing imported.";
    }
  });

  if (userSelect) userSelect.addEventListener("change", paintList);

  paintList();
})();

refreshProgressUI();
