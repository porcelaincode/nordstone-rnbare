export const Screen = {
  Notification: 'NOTIFICATION',
  Gallery: 'GALLERY',
  LiveText: 'LIVE_TEXT',
  Calculator: 'CALCULATOR',
  Auth: 'AUTH',
} as const;

export type ScreenValue = (typeof Screen)[keyof typeof Screen];
