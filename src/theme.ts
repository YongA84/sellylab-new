// src/theme.ts — 셀리랩 디자인 토큰

export const C = {
  bg:      '#08090d',
  surface: '#0f1117',
  card:    '#13161f',
  border:  '#1c2030',
  accent:  '#6c63ff',
  accentB: '#ff6584',
  green:   '#00d68f',
  blue:    '#3d9bff',
  orange:  '#ff9f43',
  red:     '#ff5c5c',
  text:    '#e8eaf2',
  sub:     '#8890aa',
  muted:   '#3d4460',
} as const;

export const F = {
  xs:  11,
  sm:  13,
  md:  15,
  lg:  18,
  xl:  22,
  xxl: 28,
} as const;

export const R = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 6,
};
