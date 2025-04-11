/**
 * Formats a number as a currency string
 * @param amount - The monetary amount to format
 * @param currencyCode - The ISO currency code (default: 'USD')
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns A formatted currency string
 */
export const formatCurrency = (
    amount: number,
    currencyCode: string = 'USD',
    locale: string = 'en-US'
): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};