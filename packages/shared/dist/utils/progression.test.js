import { describe, it, expect } from 'vitest';
import { calcSetVolume, calcExerciseVolume, calcSessionVolume, calcDelta, getExerciseStatus, getTrend, getCoachingTip, } from './progression';
describe('calcSetVolume', () => {
    it('multiplies reps by weight', () => {
        expect(calcSetVolume(10, 100)).toBe(1000);
        expect(calcSetVolume(5, 142.5)).toBe(712.5);
        expect(calcSetVolume(0, 100)).toBe(0);
    });
});
describe('calcExerciseVolume', () => {
    it('sums only completed sets', () => {
        const sets = [
            { reps: 10, weight: 100, isCompleted: true },
            { reps: 10, weight: 100, isCompleted: true },
            { reps: 10, weight: 100, isCompleted: false },
        ];
        expect(calcExerciseVolume(sets)).toBe(2000);
    });
    it('returns 0 when no sets completed', () => {
        const sets = [{ reps: 10, weight: 100, isCompleted: false }];
        expect(calcExerciseVolume(sets)).toBe(0);
    });
});
describe('calcSessionVolume', () => {
    it('sums volume across all exercises', () => {
        const exercises = [
            { sets: [{ reps: 10, weight: 100, isCompleted: true }] },
            { sets: [{ reps: 8, weight: 80, isCompleted: true }] },
        ];
        expect(calcSessionVolume(exercises)).toBe(1640);
    });
});
describe('calcDelta', () => {
    it('calculates percentage change correctly', () => {
        expect(calcDelta(110, 100)).toBeCloseTo(0.1);
        expect(calcDelta(90, 100)).toBeCloseTo(-0.1);
        expect(calcDelta(100, 100)).toBe(0);
    });
    it('returns 0 when previous is 0', () => {
        expect(calcDelta(100, 0)).toBe(0);
    });
});
describe('getExerciseStatus', () => {
    it('returns improved when delta > 0.01', () => {
        expect(getExerciseStatus(0.05)).toBe('improved');
        expect(getExerciseStatus(0.011)).toBe('improved');
    });
    it('returns declined when delta < -0.01', () => {
        expect(getExerciseStatus(-0.05)).toBe('declined');
        expect(getExerciseStatus(-0.011)).toBe('declined');
    });
    it('returns stable when delta is within ±0.01', () => {
        expect(getExerciseStatus(0)).toBe('stable');
        expect(getExerciseStatus(0.009)).toBe('stable');
        expect(getExerciseStatus(-0.009)).toBe('stable');
    });
});
describe('getTrend', () => {
    it('returns improving when last 3 sessions all increase', () => {
        expect(getTrend([100, 110, 120, 130])).toBe('improving');
    });
    it('returns declining when last 3 sessions all decrease', () => {
        expect(getTrend([130, 120, 110, 100])).toBe('declining');
    });
    it('returns plateauing when mixed', () => {
        expect(getTrend([100, 110, 105, 110])).toBe('plateauing');
    });
    it('returns plateauing when fewer than 3 sessions', () => {
        expect(getTrend([100])).toBe('plateauing');
        expect(getTrend([])).toBe('plateauing');
    });
});
describe('getCoachingTip', () => {
    it('suggests weight increase when improving', () => {
        const tip = getCoachingTip('Bench Press', 'improving', 80);
        expect(tip).toContain('2.5kg');
        expect(tip).toContain('Bench Press');
    });
    it('suggests 5kg increase for heavy lifts when improving', () => {
        const tip = getCoachingTip('Deadlift', 'improving', 150);
        expect(tip).toContain('5kg');
    });
    it('suggests deload when plateauing', () => {
        const tip = getCoachingTip('Squat', 'plateauing', 100);
        expect(tip.toLowerCase()).toMatch(/deload|variation/);
    });
    it('flags recovery when declining', () => {
        const tip = getCoachingTip('Squat', 'declining', 100);
        expect(tip.toLowerCase()).toContain('recovery');
    });
});
