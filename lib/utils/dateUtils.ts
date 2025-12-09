/**
 * Format date string to a readable format with proper error handling
 * @param dateString - Date string or null/undefined
 * @param formatOptions - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string or 'Flexible' if invalid
 */
export function formatDate(
  dateString: string | null | undefined,
  formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }
): string {
  if (!dateString) return 'Flexible';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Flexible';
    
    return date.toLocaleDateString('en-AU', formatOptions);
  } catch {
    return 'Flexible';
  }
}

/**
 * Calculate the number of nights between two dates
 * @param departureDate - Departure date string
 * @param returnDate - Return date string
 * @returns Number of nights or null if invalid
 */
export function calculateTripDuration(
  departureDate: string | null | undefined,
  returnDate: string | null | undefined
): number | null {
  if (!departureDate || !returnDate) return null;
  
  try {
    const departure = new Date(departureDate);
    const returnD = new Date(returnDate);
    
    if (isNaN(departure.getTime()) || isNaN(returnD.getTime())) return null;
    
    const diffTime = returnD.getTime() - departure.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : null;
  } catch {
    return null;
  }
}

/**
 * Format short date for compact display (e.g., "Jan 15")
 * @param dateString - Date string or null/undefined
 * @returns Short formatted date or 'Flexible'
 */
export function formatShortDate(dateString: string | null | undefined): string {
  return formatDate(dateString, { month: 'short', day: 'numeric' });
}

/**
 * Check if a date falls within a specific range
 * @param dateString - Date string to check
 * @param startDate - Start of range
 * @param endDate - End of range
 * @returns true if date is within range
 */
export function isDateInRange(
  dateString: string | null | undefined,
  startDate: Date,
  endDate: Date
): boolean {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    
    return date >= startDate && date <= endDate;
  } catch {
    return false;
  }
}
