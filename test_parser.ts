import fs from 'fs';

const icsContent = fs.readFileSync('icalexport (2).ics', 'utf8');

const events = [];
const lines = icsContent.split(/\r?\n/);
let currentEvent: any = null;

for (let line of lines) {
  if (line.startsWith('BEGIN:VEVENT')) {
    currentEvent = {};
  } else if (line.startsWith('END:VEVENT') && currentEvent) {
    if (currentEvent.title) events.push(currentEvent);
    currentEvent = null;
  } else if (currentEvent) {
    if (line.startsWith('SUMMARY:')) currentEvent.title = line.substring(8).trim();
    if (line.startsWith('DESCRIPTION:')) currentEvent.description = line.substring(12).trim();
    if (line.startsWith('LOCATION:')) currentEvent.location = line.substring(9).trim();
    if (line.startsWith('DTSTART')) {
       const parts = line.split(':');
       if (parts.length > 1) {
         const rawDate = parts[1].trim();
         // basic extraction YYYYMMDD
         if (rawDate.length >= 8) {
           currentEvent.event_date = `${rawDate.substring(0,4)}-${rawDate.substring(4,6)}-${rawDate.substring(6,8)}`;
           if (rawDate.length > 8 && rawDate.includes('T')) {
             const time = rawDate.split('T')[1];
             if (time.length >= 4) {
               currentEvent.due_time = `${time.substring(0,2)}:${time.substring(2,4)}`;
             }
           }
         }
       }
    }
  }
}

console.log(`Found ${events.length} events:`);
console.log(events);
