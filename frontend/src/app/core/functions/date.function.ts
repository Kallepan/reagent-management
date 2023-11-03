export const isoDateFormat = (date: Date| null): string | null => {
    // Returns date in format YYYY-MM-DD ISO 8601 or null if date is null
    if (!date) return null;

    return date.toISOString().split('T')[0];
} 