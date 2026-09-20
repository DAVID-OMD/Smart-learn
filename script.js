// SmartLearn - simple interactivity: filter subjects + toggle practice sets

const practiceData = {
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

// 1. Filter subjects on subjects.html
const searchInput = document.getElementById("searchInput");
const subjectCards = document.querySelectorAll(".subject-card");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");

function updateResultCount(visibleCount) {
  if (!resultCount) return;
  resultCount.textContent =
    visibleCount === subjectCards.length
      ? `Showing all ${visibleCount} subjects`
      : `Showing ${visibleCount} of ${subjectCards.length} subjects`;
}

if (searchInput) {
  const filterSubjects = () => {
    const query = searchInput.value.toLowerCase().trim();
    let visible = 0;

    subjectCards.forEach((card) => {
      const name = card.getAttribute("data-name") || "";
      const heading = card.querySelector("h3");
      const title = heading ? heading.textContent.toLowerCase() : "";
      const match = name.includes(query) || title.includes(query);
      card.hidden = !match;
      if (match) visible++;
    });

    updateResultCount(visible);
    if (noResults) noResults.hidden = visible !== 0;
  };

  searchInput.addEventListener("input", filterSubjects);
  updateResultCount(subjectCards.length);
}

// 2. Show / hide practice sets
document.querySelectorAll(".practice-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const subject = button.getAttribute("data-subject");
    const box = button.parentElement.querySelector(".practice-set");
    if (!box) return;

    const isHidden = box.hidden;

    if (isHidden) {
      const questions = practiceData[subject] || [];
      box.innerHTML =
        `<strong>${subject} Practice Set:</strong><ul>` +
        questions.map((q) => `<li>${q}</li>`).join("") +
        "</ul>";
      box.hidden = false;
      button.textContent = "Hide Practice Set";
    } else {
      box.hidden = true;
      box.innerHTML = "";
      button.textContent = "Show Practice Set";
    }
  });
});
