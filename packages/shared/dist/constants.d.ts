export declare const REST_TIMER_ADJUST_SECONDS = 15;
export declare const DEFAULT_REST_SECONDS = 90;
export declare const PROGRESSION_THRESHOLD = 0.01;
export declare const MUSCLE_GROUPS: readonly ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms", "Core", "Quadriceps", "Hamstrings", "Glutes", "Calves", "Full Body"];
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];
export declare const EQUIPMENT_TYPES: readonly ["Barbell", "Dumbbell", "Kettlebell", "Cable", "Machine", "Bodyweight", "Resistance Band", "Smith Machine", "EZ Bar"];
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];
