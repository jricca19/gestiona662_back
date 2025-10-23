export function toOnlyDate (d) {
    return new Date(d).toISOString().split('T')[0];
}

export function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}