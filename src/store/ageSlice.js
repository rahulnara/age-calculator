import { createSlice } from '@reduxjs/toolkit';
import { calculateAgeDetails, formatDateInput } from '../utils/ageCalculator.js';

const today = formatDateInput(new Date());

const initialState = {
  birthDate: '',
  compareDate: today,
  result: null,
  error: '',
  recentCalculations: [],
};

const buildResult = (birthDate, compareDate) => {
  if (!birthDate) {
    return { result: null, error: 'Choose a birth date to calculate age.' };
  }

  const details = calculateAgeDetails(birthDate, compareDate);

  if (!details.isValid) {
    return { result: null, error: details.error };
  }

  return { result: details, error: '' };
};

const ageSlice = createSlice({
  name: 'age',
  initialState,
  reducers: {
    setBirthDate(state, action) {
      state.birthDate = action.payload;
      const next = buildResult(state.birthDate, state.compareDate);
      state.result = next.result;
      state.error = next.error;
    },
    setCompareDate(state, action) {
      state.compareDate = action.payload;
      const next = buildResult(state.birthDate, state.compareDate);
      state.result = next.result;
      state.error = next.error;
    },
    calculateAge(state) {
      const next = buildResult(state.birthDate, state.compareDate);
      state.result = next.result;
      state.error = next.error;

      if (next.result) {
        const entry = {
          id: `${state.birthDate}-${state.compareDate}`,
          birthDate: state.birthDate,
          compareDate: state.compareDate,
          ageLabel: next.result.ageLabel,
        };

        state.recentCalculations = [
          entry,
          ...state.recentCalculations.filter((item) => item.id !== entry.id),
        ].slice(0, 4);
      }
    },
    resetCalculator(state) {
      state.birthDate = '';
      state.compareDate = today;
      state.result = null;
      state.error = '';
    },
    loadRecentCalculation(state, action) {
      state.birthDate = action.payload.birthDate;
      state.compareDate = action.payload.compareDate;
      const next = buildResult(state.birthDate, state.compareDate);
      state.result = next.result;
      state.error = next.error;
    },
  },
});

export const {
  setBirthDate,
  setCompareDate,
  calculateAge,
  resetCalculator,
  loadRecentCalculation,
} = ageSlice.actions;

export default ageSlice.reducer;
