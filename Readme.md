# Attendance Management API

This project is an API for managing attendance records stored in a SQL Server database. It provides functionality to retrieve attendance data for a specified date range and format the response as XML.

## Features

- Retrieve attendance records for a specified date range
- Format the response data as XML
- Handle multiple check-ins and check-outs for each employee on the same date

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- SQL Server
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/iamsj7/attendance-management-api.git
```

2. Navigate to the project directory:

```bash
cd attendance-management-api
```

3. Install dependencies:

```bash
npm install
```

## Configuration

1. Create a `.env` file in the root directory of the project.

2. Define the following environment variables in the `.env` file:

```
PORT=3000
DB_HOST=your_database_host
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_DATABASE=your_database_name
```

Replace `your_database_host`, `your_database_username`, `your_database_password`, and `your_database_name` with your SQL Server credentials.

## Usage

1. Start the server:

```bash
npm start
```

2. Access the API using the following endpoints:

- Retrieve attendance records: `GET /api/attendance`
  - Parameters:
    - action: 'get'
    - date_range: Date range in the format 'DDMMYYYY-DDMMYYYY'
    - range: 'all'
    - format: 'xml'

Example request:

```bash
curl -X GET "http://localhost:3000/api/attendance?action=get&date_range=12052024-12052024&range=all&format=xml"
```

## Database Schema

The database schema consists of a single table named `Attendance` with the following columns:

- Employeeid (nvarchar)
- Accessdate (date)
- Accesstime (time)
- AttendanceStatus (nvarchar)
- FirstName (nvarchar)
- LastName (nvarchar)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
