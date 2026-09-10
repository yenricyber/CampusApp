import fs from 'fs';

async function run() {
  try {
    // 1. Login
    console.log("Logging in...");
    const loginRes = await fetch('https://campus-app-alpha.vercel.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sofia.martinez@universidadlatino.edu.mx', password: 'password123' })
    });
    const loginData = await loginRes.json();
    
    if (!loginData.token) {
      console.log("Login failed", loginData);
      return;
    }
    const token = loginData.token;
    console.log("Token received.");

    // 2. Import
    const icsContent = fs.readFileSync('icalexport.ics', 'utf8');
    console.log("Uploading ICS...");
    const importRes = await fetch('https://campus-app-alpha.vercel.app/api/calendar/import', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ icsContent })
    });
    
    const importData = await importRes.json();
    console.log("Import response:", importRes.status, importData);
    
    // 3. Get Events
    const getRes = await fetch('https://campus-app-alpha.vercel.app/api/calendar/events', {
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    const getData = await getRes.json();
    console.log("Get events response:", getRes.status, getData);
  } catch(e) {
    console.error(e);
  }
}
run();
