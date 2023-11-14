export const isoDateFormat = (date: Date | null): string | null => {
    // Returns date in format YYYY-MM-DD ISO 8601 or null if date is null
    if (!date) return null;

    date.setDate(date.getDate() + 1)

    return date.toISOString().split('T')[0];
}

export const filterNotBeforeToday = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!d) return false;
    return d >= today;
}