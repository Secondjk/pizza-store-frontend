export const c = (...classes: (false | null | undefined | string)[]): string => classes.filter(Boolean).join(' ');