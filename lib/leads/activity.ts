export const MANUAL_ACTIVITY_TYPES = ["note", "email", "call", "meeting"] as const;

export type ManualActivityType = (typeof MANUAL_ACTIVITY_TYPES)[number];
