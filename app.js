require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const sql = require('mssql');
const { connect, config } = require('./db'); // Importing connect function and config from db.js

// Connect to SQL Server
connect();

app.use(express.json());

// Function to format date (assuming date is in format YYYY-MM-DD)
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

// Function to format time (assuming time is in format HH:MM:SS)
function formatTime(timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    return `${hours}:${minutes}`;
}

// Function to get punch times based on conditions
function getPunchTimes(records, userID) {
    const punches = {};

    // Group records by date
    records.forEach(record => {
        const date = record.Accessdate;
        if (!punches[date]) {
            punches[date] = [];
        }
        punches[date].push(record);
    });

    // Sort dates
    const dates = Object.keys(punches).sort();

    // Initialize punch times
    const punchTimes = {
        Punch1_Time: '',
        Punch2_Time: '',
        Punch3_Time: '',
        Punch4_Time: '',
        Punch5_Time: '',
        Punch6_Time: '',
        Punch7_Time: '',
        Punch8_Time: '',
        Punch9_Time: '',
        Punch10_Time: '',
        Punch11_Time: '',
        Punch12_Time: ''
    };

    // Assign punch times
    let punchIndex = 1;
    dates.forEach(date => {
        const records = punches[date];
        records.forEach(record => {
            punchTimes[`Punch${punchIndex}_Time`] = formatTime(record.Accesstime);
            punchIndex++;
        });
    });

    return punchTimes;
}

// Define GET endpoint to retrieve all attendance records
app.get('/api/attendance', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM [HIKCENTRAL].[dbo].[Attendance]');

        // Group records by employee ID and access date
        const groupedRecords = {};
        result.recordset.forEach(record => {
            const key = `${record.Employeeid}_${record.Accessdate}`;
            if (!groupedRecords[key]) {
                groupedRecords[key] = [];
            }
            groupedRecords[key].push(record);
        });

        // Format the response data
        const formattedData = Object.values(groupedRecords).map(records => {
            const firstRecord = records[0];
            const punchTimes = {
                Punch1_Time: formatTime(firstRecord.Accesstime),
                Punch2_Time: '',
                Punch3_Time: '',
                Punch4_Time: '',
                Punch5_Time: '',
                Punch6_Time: '',
                Punch7_Time: '',
                Punch8_Time: '',
                Punch9_Time: '',
                Punch10_Time: '',
                Punch11_Time: '',
                Punch12_Time: '',
                OutPunch_Time: ''
            };

            // Assign punch times
            let punchIndex = 2;
            for (let i = 1; i < records.length; i++) {
                const record = records[i];
                if (record.AttendanceStatus === 'Check Out') {
                    punchTimes.OutPunch_Time = formatTime(record.Accesstime);
                } else {
                    punchTimes[`Punch${punchIndex}_Time`] = formatTime(record.Accesstime);
                    punchIndex++;
                }
            }

            return {
                UserID: firstRecord.Employeeid,
                UserName: `${firstRecord.FirstName} ${firstRecord.LastName}`,
                ProcessDate: formatDate(firstRecord.Accessdate),
                ...punchTimes
            };
        });

        res.json(formattedData);
    } catch (err) {
        console.error('Error fetching attendance data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
