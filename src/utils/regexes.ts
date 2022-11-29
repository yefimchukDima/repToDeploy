export const normalizePhoneNumber = (str: string) =>
  str.replace(/[^\w\+]/gi, '');
