// Vietnamese number and currency formatting utilities
// Provides consistent formatting for prices, numbers, and percentages

/**
 * Format number with Vietnamese thousand separator (dot)
 * @param num - Number to format
 * @returns Formatted string with dot separator (e.g., "108.851")
 */
export function formatNumber(num: number | null | undefined): string {
  const value = num ?? 0;
  return value.toLocaleString('vi-VN');
}

/**
 * Format amount as Vietnamese currency (VND)
 * @param amount - Amount to format
 * @returns Formatted currency string (e.g., "3.000đ")
 */
export function formatVND(amount: number | null | undefined): string {
  const value = amount ?? 0;
  return `${formatNumber(value)}đ`;
}

/**
 * Format price range in Vietnamese currency
 * If min equals max, returns single price
 * @param min - Minimum price
 * @param max - Maximum price
 * @returns Formatted price range (e.g., "3.000 - 17.000đ" or "5.000đ")
 */
export function formatPriceRange(
  min: number | null | undefined,
  max: number | null | undefined
): string {
  const minValue = min ?? 0;
  const maxValue = max ?? 0;

  if (minValue === maxValue) {
    return formatVND(minValue);
  }

  return `${formatNumber(minValue)} - ${formatNumber(maxValue)}đ`;
}

/**
 * Format number as percentage with one decimal place
 * @param num - Number to format as percentage
 * @returns Formatted percentage string (e.g., "0.0%" or "1.5%")
 */
export function formatPercent(num: number | null | undefined): string {
  const value = num ?? 0;
  return `${value.toFixed(1)}%`;
}
