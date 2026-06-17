import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  calculateAge,
  loadRecentCalculation,
  resetCalculator,
  setBirthDate,
  setCompareDate,
} from './store/ageSlice.js';
import { useThemeSettings } from './context/ThemeContext.jsx';
import { formatDateInput } from './utils/ageCalculator.js';

const statLabels = [
  { key: 'years', label: 'Years' },
  { key: 'months', label: 'Months' },
  { key: 'days', label: 'Days' },
  { key: 'totalWeeks', label: 'Total weeks' },
];

function App() {
  const dispatch = useDispatch();
  const { birthDate, compareDate, result, error, recentCalculations } = useSelector((state) => state.age);
  const { theme, useToday, setUseToday, toggleTheme } = useThemeSettings();

  const today = useMemo(() => formatDateInput(new Date()), []);

  useEffect(() => {
    if (useToday && compareDate !== today) {
      dispatch(setCompareDate(today));
    }
  }, [compareDate, dispatch, today, useToday]);

  const handleBirthDateChange = useCallback(
    (event) => {
      dispatch(setBirthDate(event.target.value));
    },
    [dispatch],
  );

  const handleCompareDateChange = useCallback(
    (event) => {
      setUseToday(false);
      dispatch(setCompareDate(event.target.value));
    },
    [dispatch, setUseToday],
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      dispatch(calculateAge());
    },
    [dispatch],
  );

  const handleTodayToggle = useCallback(
    (event) => {
      const checked = event.target.checked;
      setUseToday(checked);
      if (checked) {
        dispatch(setCompareDate(today));
      }
    },
    [dispatch, setUseToday, today],
  );

  const quickDates = useMemo(
    () => [
      { label: '18 years ago', value: `${Number(today.slice(0, 4)) - 18}${today.slice(4)}` },
      { label: '25 years ago', value: `${Number(today.slice(0, 4)) - 25}${today.slice(4)}` },
      { label: '40 years ago', value: `${Number(today.slice(0, 4)) - 40}${today.slice(4)}` },
    ],
    [today],
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [],
  );

  return (
    <main className={`app-shell ${theme}`}>
      <section className="calculator-layout" aria-label="Age calculator">
        <div className="intro-panel">
          <div className="topbar">
            <span className="brand-mark">AC</span>
            <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? '◐' : '☼'}
            </button>
          </div>

          <div className="headline">
            <p className="eyebrow">Age calculator</p>
            <h1>Find exact age from birth date to any date.</h1>
            <p>
              Enter a birth date and compare it with today or a custom date. Results update instantly and can be saved
              into recent calculations.
            </p>
          </div>

          <form className="input-panel" onSubmit={handleSubmit}>
            <label>
              Birth date
              <input type="date" value={birthDate} max={compareDate} onChange={handleBirthDateChange} />
            </label>

            <label>
              Current date
              <input type="date" value={compareDate} min={birthDate || undefined} onChange={handleCompareDateChange} disabled={useToday} />
            </label>

            <label className="toggle-row">
              <input type="checkbox" checked={useToday} onChange={handleTodayToggle} />
              Use today
            </label>

            <div className="quick-dates" aria-label="Quick birth date choices">
              {quickDates.map((date) => (
                <button key={date.label} type="button" onClick={() => dispatch(setBirthDate(date.value))}>
                  {date.label}
                </button>
              ))}
            </div>

            {error ? <p className="error-message">{error}</p> : null}

            <div className="actions">
              <button className="primary-button" type="submit">
                Calculate age
              </button>
              <button className="ghost-button" type="button" onClick={() => dispatch(resetCalculator())}>
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="result-panel">
          <div className="result-summary">
            <p className="eyebrow">Exact age</p>
            <h2>{result ? result.ageLabel : 'Select dates'}</h2>
            <p>
              {result
                ? `${result.totalDays.toLocaleString()} total days from birth date to selected date.`
                : 'Your detailed result, totals, and next birthday countdown will appear here.'}
            </p>
          </div>

          <div className="stat-grid">
            {statLabels.map((stat) => (
              <article className="stat-card" key={stat.key}>
                <span>{stat.label}</span>
                <strong>{result ? result[stat.key].toLocaleString() : '0'}</strong>
              </article>
            ))}
          </div>

          <section className="birthday-card" aria-label="Next birthday">
            <div>
              <span>Next birthday</span>
              <strong>{result ? dateFormatter.format(new Date(result.nextBirthday)) : 'Waiting for dates'}</strong>
            </div>
            <p>{result ? `${result.daysUntilBirthday} day${result.daysUntilBirthday === 1 ? '' : 's'} to go` : '0 days to go'}</p>
            <div className="progress-track">
              <span style={{ width: `${result ? result.birthdayProgress : 0}%` }} />
            </div>
          </section>

          <section className="recent-panel" aria-label="Recent calculations">
            <div className="section-heading">
              <h3>Recent</h3>
              <span>{recentCalculations.length}/4</span>
            </div>
            {recentCalculations.length ? (
              <div className="recent-list">
                {recentCalculations.map((item) => (
                  <button key={item.id} type="button" onClick={() => dispatch(loadRecentCalculation(item))}>
                    <span>{item.birthDate}</span>
                    <strong>{item.ageLabel}</strong>
                  </button>
                ))}
              </div>
            ) : (
              <p className="empty-state">Run a calculation to keep it handy here.</p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

export default App;
