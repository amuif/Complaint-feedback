declare module 'ethiopian-date' {
  export interface GregorianDate {
    year: number;
    month: number;
    day: number;
  }

  export interface EthiopianDate {
    year: number;
    month: number;
    day: number;
  }

  export function toGregorian(
    ethiopianYear: number,
    ethiopianMonth: number,
    ethiopianDay: number
  ): GregorianDate;
  export function toEthiopian(
    gregorianYear: number,
    gregorianMonth: number,
    gregorianDay: number
  ): EthiopianDate;
}
