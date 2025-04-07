
/**
 * Format a number as Indian Rupees
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "₹1,499")
 */
export function formatIndianRupees(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number with commas according to Indian numbering system
 * @param number - The number to format
 * @returns Formatted number string (e.g., "1,00,000")
 */
export function formatIndianNumber(number: number): string {
  return new Intl.NumberFormat('en-IN').format(number);
}
