import { EvaluationItem } from '../types';

/**
 * Formats a Date object into iCalendar UTC or local format (YYYYMMDDTHHMMSSZ).
 */
function formatToIcsDate(date: Date, isUtc = true): string {
  if (isUtc) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Escapes characters according to RFC 5545 specifications.
 */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Parses an EvaluationItem's start/end dates into safe Date objects.
 */
export function getEventDates(item: EvaluationItem): { start: Date; end: Date } {
  if (item.startDate && item.endDate) {
    return {
      start: new Date(item.startDate),
      end: new Date(item.endDate),
    };
  }

  // Fallback heuristic based on item.dueTime or current year 2026
  const now = new Date('2026-10-14T12:00:00');
  let start = new Date(now.getTime() + 2 * 3600000);
  let end = new Date(start.getTime() + 3600000);

  if (item.dueTime.includes('23:59')) {
    start = new Date('2026-10-14T23:00:00');
    end = new Date('2026-10-14T23:59:00');
  } else if (item.dueTime.includes('17 Oct')) {
    start = new Date('2026-10-17T16:00:00');
    end = new Date('2026-10-17T18:00:00');
  } else if (item.dueTime.includes('22 Oct')) {
    start = new Date('2026-10-22T13:00:00');
    end = new Date('2026-10-22T14:30:00');
  }

  return { start, end };
}

/**
 * Generates valid iCalendar (.ics) string containing one or multiple evaluation items.
 */
export function generateIcsContent(evaluations: EvaluationItem[], calendarTitle = 'Evaluaciones - Universidad Latino'): string {
  const now = new Date();
  const dtstamp = formatToIcsDate(now, true);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Universidad Latino//Portal Estudiantil Calendario//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(calendarTitle)}`,
    'X-WR-TIMEZONE:America/Mexico_City',
    `X-WR-CALDESC:${escapeIcsText('Calendario de exámenes, entregas y actividades académicas de Universidad Latino.')}`,
  ];

  evaluations.forEach((item) => {
    const { start, end } = getEventDates(item);
    const dtstart = formatToIcsDate(start, true);
    const dtend = formatToIcsDate(end, true);
    const summary = `[${item.subject}] ${item.title}`;
    const description = `${item.title}\\n\\nMateria: ${item.subject}\\nTipo: ${item.badge} (${item.type || 'Evaluación'})\\nUbicación / Entrega: ${item.location}\\nVencimiento: ${item.dueTime}\\n${item.description || ''}\\n\\nPortal Estudiantil • Universidad Latino`;
    const location = item.location || 'Universidad Latino';
    const uid = `${item.id}-202610@universidadlatino.edu.mx`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:${escapeIcsText(summary)}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${escapeIcsText(location)}`,
      'STATUS:CONFIRMED',
      'CATEGORIES:ACADÉMICO,EVALUACIÓN',
      // Recordatorio preventivo 24h antes
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeIcsText(`Recordatorio 24h: Entrega de ${item.title}`)}`,
      'END:VALARM',
      // Recordatorio preventivo 2h antes
      'BEGIN:VALARM',
      'TRIGGER:-PT2H',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeIcsText(`¡Atención! Vence en 2 horas: ${item.title}`)}`,
      'END:VALARM',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Triggers an immediate browser download of an .ics file.
 */
export function downloadIcsFile(filename: string, icsContent: string): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates direct Google Calendar Web add-event link.
 */
export function getGoogleCalendarUrl(item: EvaluationItem): string {
  const { start, end } = getEventDates(item);
  const startStr = formatToIcsDate(start, true);
  const endStr = formatToIcsDate(end, true);
  const title = `[${item.subject}] ${item.title}`;
  const details = `${item.title}\nMateria: ${item.subject}\nTipo: ${item.badge}\nVence: ${item.dueTime}\nLugar: ${item.location}\n\nUniversidad Latino`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startStr}/${endStr}`,
    details,
    location: item.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates direct Microsoft Outlook Web add-event link.
 */
export function getOutlookWebUrl(item: EvaluationItem): string {
  const { start, end } = getEventDates(item);
  const startIso = start.toISOString();
  const endIso = end.toISOString();
  const subject = `[${item.subject}] ${item.title}`;
  const body = `${item.title}\nMateria: ${item.subject}\nTipo: ${item.badge}\nVence: ${item.dueTime}\nLugar: ${item.location}\n\nUniversidad Latino`;

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject,
    startdt: startIso,
    enddt: endIso,
    body,
    location: item.location,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
