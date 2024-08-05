const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMlA1c2lQbDFHZUJlTkx0QlF1cHJaOFI2NU9GVHdEUFk5eWg5UzJRaGlsaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiM0h3c1E0ektmSWYyYS9mZE9iNmVvWE9YUHBFZlVpc3JNc2hHV2h5SGRHdz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJJRW5YYWhtOTBQc2NUaU42U0x0ZFROaHNoREZVdjF4a1diQXBOckpLVmtnPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJpNVBiQ3hOb0R3eWl4WnNBOTdLTkVURzltdUVGYU1BUkRBbXdlVU13b2pZPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InFMNUFVR0IzSnQ0R1c1NUlWNk1NK0kxTDVLQytZRjhIdklnZHRsNHBqSHM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IldpbFhPSlROYytMQW1MaEFpUldxV3labjBDeXJBZldWUEUwVUFKY3p0UnM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicUJvQ25zZFFWdmRZUXdUNy9JOVI1VmtlUGZ1dkR4dk80bU03YzJHMVUxbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSVdKL1BYang3WWZBUXdMcUg2ak5sQjlpcmRqNitlcVpyYUNUbUlPcW1pYz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkhFZ0l0aDFYbUJlMm9ENXlhWEhNSDJaZ0VVUTMwTXgxQ3J0RzlZRm10elNMMElYTTVPRngvb3FTcW5nTFBoWFMwaFU1bXpoYlR5UTZBNUlFNm9XUWhRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTQ3LCJhZHZTZWNyZXRLZXkiOiIwQlhIM1BkcHNYT0VlaGxIZjhxMHJpRU5aM2hXT3VmU003VjBlRFl5MmFvPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJFQUkxZGtPWFJlLVBHWDM3MFdqOFZBIiwicGhvbmVJZCI6IjBjYTVjMjNmLWRlNzItNGJkMi1iZDg1LWU2MmIyNjc1ZmVjYyIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJlWHowMG1uazJ0M1B0VEdERXE2WmY2YWJ4NTA9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUW9UZUxGdGQ0SVc0THRIbnFLQTREWGNmL3hVPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6Ilg5VEtZM0w0IiwibWUiOnsiaWQiOiIyNTg4Njc1MzI0MDA6MjNAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoi2KfZhtiqINin2YTYrduM2KfYqiJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSmV4My9VRUVQYnB3clVHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiN3ZEWEtvRmVLZ2NFSEozNW40UTAyTVd0dWJPWWJ5dlVHZERrTmM3RTFYND0iLCJhY2NvdW50U2lnbmF0dXJlIjoibnNYWW5ZNnJab1k5aHA3V0VzUjJnc1dqZVJEVWhsVjFBNUpiZUF5a0xQS0dFU1czZVZLVERTdGpkSnFLU0labklySVNjem1RT3dMTFZqNmE4NkxCQWc9PSIsImRldmljZVNpZ25hdHVyZSI6IjJmdWlWZHlPUjhYTE5mWW95ajN4NEJOdE80aFZkN1dhMkdJbEhxSXBGWElsK3pEYk9KTW1QUXB5TitScklUMm12ZGxDV0t5Q2dwZVU5bG9ncHhuc2hRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU4ODY3NTMyNDAwOjIzQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmU3dzF5cUJYaW9IQkJ5ZCtaK0VOTmpGcmJtem1HOHIxQm5RNURYT3hOVisifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjI4NTY3MDd9',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Muzammil",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "258867532400",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'Muzammil_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/cfd8efafde971d55eaafe.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

