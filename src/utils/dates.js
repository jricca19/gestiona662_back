export function dateToString(d) {
    // Mantener strings "YYYY-MM-DD" tal cual
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const date = new Date(d);
    // Usar componentes UTC para evitar desplazamientos por zona horaria
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function isSameDay(date1, date2) {
    // Comparar en UTC
    return date1.getUTCFullYear() === date2.getUTCFullYear() &&
           date1.getUTCMonth() === date2.getUTCMonth() &&
           date1.getUTCDate() === date2.getUTCDate();
}

export function toLocalDate(dateStr) {
    // Interpretar "YYYY-MM-DD" como medianoche UTC (fecha sin zona)
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
}

// Helper para "hoy" en UTC (medianoche)
export function todayUtcDate() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}