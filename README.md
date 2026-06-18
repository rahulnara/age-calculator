# Age Calculator

A responsive React age calculator that calculates exact age from a birth date to today or a selected comparison date.

## Local URL

Run the development server and open:

https://age-calculator-vert-three.vercel.app/

## Commands

```bash
npm install
npm run dev
npm run build
```

## Code Structure

```text
.
├── index.html
├── package.json
├── src
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── context
│   │   └── ThemeContext.jsx
│   ├── store
│   │   ├── ageSlice.js
│   │   └── store.js
│   └── utils
│       └── ageCalculator.js
└── README.md
```

## Main Files

- `src/main.jsx`: App entry point. Connects React, Redux Provider, and ThemeProvider.
- `src/App.jsx`: Main interactive UI for date inputs, quick selections, results, recent calculations, and theme toggle.
- `src/store/store.js`: Redux store configuration.
- `src/store/ageSlice.js`: Redux slice for birth date, comparison date, age result, errors, and recent calculations.
- `src/context/ThemeContext.jsx`: React Context for theme and "use today" UI preference.
- `src/utils/ageCalculator.js`: Optimized date calculation helpers for exact age, totals, and next birthday progress.
- `src/styles.css`: Responsive styling for the interactive calculator layout.

## Features

- Exact age in years, months, and days.
- Total days, weeks, and months.
- Today/custom comparison date toggle.
- Quick birth-date presets.
- Next birthday countdown and progress bar.
- Recent calculation history.
- Light/dark theme toggle.
- Redux and Context usage.
