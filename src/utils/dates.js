// Debug flags
const DEBUG_DATES = process.env.DEBUG_DATES === 'true';
const dbg = (...args) => { if (DEBUG_DATES) console.log(...args); };

export function dateToString(d) {
    // Mantener strings "YYYY-MM-DD" tal cual
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
        dbg('[dates.dateToString] input:string=', d, 'output=', d);
        return d;
    }
    const date = new Date(d);
    // Usar componentes UTC para evitar desplazamientos por zona horaria
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const out = `${year}-${month}-${day}`;
    dbg('[dates.dateToString] input:date=', date.toISOString?.(), 'output=', out);
    return out;
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
    const dt = new Date(Date.UTC(year, month - 1, day));
    dbg('[dates.toLocalDate] input=', dateStr, 'output=', dt.toISOString());
    return dt;
}

// Helper para "hoy" en UTC (medianoche)
export function todayUtcDate() {
    const now = new Date();
    const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    dbg('[dates.todayUtcDate] now=', now.toISOString(), 'todayUtc=', todayUtc.toISOString(), 'serverTZOffset(min)=', now.getTimezoneOffset());
    return todayUtc;
}