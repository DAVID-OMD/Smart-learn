# SmartLearn

A simple, lightweight learning website for secondary school students.

No frameworks, no build tools, no dependencies — just HTML, CSS, and JavaScript.

## Project Structure

```
Smart-learn/
├── index.html      # Home page
├── about.html      # About the website
├── subjects.html   # Subjects with filter + practice sets + quizzes
├── styles.css      # Styling + dark mode
├── script.js       # Theme, filtering, practice, quizzes, progress
└── README.md
```

## How to Run / Open

1. Download or copy this project folder.
2. Double-click `index.html` to open it in any web browser (Chrome, Edge, Firefox).
3. Use the navigation bar to visit:
   - `index.html` — Home page + random subject picker
   - `about.html` — About + FAQ
   - `subjects.html` — Filter, practice sets, quizzes, progress tracking

No server or installation needed. It also works offline.

## Interactive Features

- **Dark mode** (`Dark mode` button in navbar, saved in localStorage)
- **Live filter** (`subjects.html`) — searches titles, topics, and descriptions
- **Practice sets** — “Show Practice Set” revision lists
- **Quizzes** — “Start Quiz”: 3 multiple-choice questions per subject, instant feedback, explanations, score, retry, best score saved
- **Progress tracking** — “Mark Complete” per subject, progress bar, home-page summary, all saved in browser
- **Random picker** — “Random” highlights a subject; home page “Pick Random Subject” suggests one
- **FAQ accordion** (`about.html`) using native `<details>`

## Customize

- Edit `quizData` / `practiceData` in `script.js` to add questions.
- Edit `subjects.html` to add more subjects (copy an `<article>` block, set `data-subject` + `data-name`).
- Edit `styles.css` (`:root` variables) to change colors, including `body.dark`.
