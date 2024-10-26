<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Page</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="page-container">
        <h2>Welcome to the Admin Page</h2>
        <h1>Pending Requests</h1>
    </div>
    <table id="dataTable">
        <thead>
            <tr>
                <th>ROLLNO</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Date of Leave</th>
                <th>Date of Return</th>
                <th>Creation Date</th> <!-- New column for Creation Date -->
                <th>Actions</th> <!-- Column for approve/decline actions -->
            </tr>
        </thead>
        <tbody id="dataTableBody">
            <!-- Data will be populated here -->
        </tbody>
    </table>
    

    <script>
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:3000/api/leaveRequests'); // Fetch data from the server
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data); 
                displayData(data); // Call function to display data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        function displayData(data) {
            const tableBody = document.getElementById('dataTableBody');
            tableBody.innerHTML = ''; // Clear previous entries
        
            const pendingRequests = data.filter(item => item.status === 'Pending');
        
            if (pendingRequests.length === 0) {
                const messageRow = document.createElement('tr');
                messageRow.innerHTML = `
                    <td colspan="5" style="text-align: center;">No requests pending.</td>
                `;
                tableBody.appendChild(messageRow);
            } else {
                pendingRequests.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.rollNumber}</td>
                        <td>${item.name}</td>
                        <td>${item.branch}</td>
                         <td>${item.dateOfLeave}</td>
                        <td>${item.dateOfReturn}</td>
                        <td>${new Date(item.createdAt).toLocaleString()}</td> <!-- Format the date -->
                        <td>
                            <button onclick="updateStatus('${item.rollNumber}', 'Approved')">Approve</button>
                            <button onclick="updateStatus('${item.rollNumber}', 'Declined')">Decline</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        }
        
        async function updateStatus(rollNumber, newStatus) {
            try {
                const response = await fetch('http://localhost:3000/api/update-status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rollNumber, status: newStatus }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                alert(result.message); // Display a success message
                fetchData(); // Refresh the table after the update
            } catch (error) {
                console.error('Error updating status:', error);
                alert('Error updating status: ' + error.message);
            }
        }
    fetchData(); // Call fetchData on page load
    </script>
        <a href="/">Logout</a>
   
</body>
</html>
