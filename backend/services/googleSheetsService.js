import { google } from 'googleapis';

// Fetch students data
const fetchStudentsFromSheet = async () => {
    const sheets = google.sheets({ version: 'v4', auth: YOUR_API_KEY });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: YOUR_SHEET_ID,
        range: 'Sheet1!A1:D100', // Adjust range based on your sheet
    });
    const rows = response.data.values;
    if (rows.length) {
        return rows.map((row) => ({
            id: row[0],
            name: row[1],
            status: row[2] || "Absent",
        }));
    }
    return [];
};

// Update attendance in the sheet
const updateAttendanceInSheet = async (id, status) => {
    const sheets = google.sheets({ version: 'v4', auth: YOUR_API_KEY });
    await sheets.spreadsheets.values.update({
        spreadsheetId: YOUR_SHEET_ID,
        range: `Sheet1!C${id + 1}`, // Adjust range dynamically
        valueInputOption: 'RAW',
        resource: { values: [[status]] },
    });
};
