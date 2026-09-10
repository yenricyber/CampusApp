import { apiService } from './src/services/api.js';
import fs from 'fs';

async function run() {
  const text = fs.readFileSync('icalexport.ics', 'utf8');
  // I can't call apiService because localStorage doesn't exist in Node.
}
