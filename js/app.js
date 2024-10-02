
let nextRowId = 1;
    let confirmedRowsCount = 0;
    let confirmedJobs = [];
   
    document.getElementById('rosterTableBody').addEventListener('change', function(event) {
    if (event.target.matches('select')) {
        const rowElement = event.target.closest('tr');
        const rowId = rowElement.getAttribute('data-row-id'); // Get the rowId from data attribute
        updateDriverList(rowId); // Call function to update driver list
    }
})

    // Event listener for MSIC, White Card, and On Leave checkboxes in Drivers Table
    document.getElementById('driversTable').addEventListener('change', function(event) {
        if (event.target.matches('.onLeave, .hasMSIC, .hasWhiteCard')) {
            refreshDriverDropdowns(); // Call function to refresh driver lists across all rows
        }
    });
    function refreshJobListState() {
    const jobsTable = document.getElementById('jobsTable').querySelectorAll('tr');

    jobsTable.forEach((row) => {
        const clientName = row.cells[0].textContent;
        const confirmedRows = Array.from(document.querySelectorAll('#rosterTableBody tr'))
            .filter(rosterRow => rosterRow.querySelector(`#service${rosterRow.rowIndex}`).value === clientName);

        // If no rows are left in the roster for this job, re-enable the Confirm button
        if (confirmedRows.length === 0) {
            const confirmButton = row.querySelector('.confirm-btn');
            confirmButton.disabled = false; // Re-enable the button
            confirmButton.style.backgroundColor = '#007bff'; // Restore original button color
            confirmButton.style.cursor = 'pointer'; // Restore pointer cursor
        }
    });
}
// Function to set default date inputs to current date
function setDefaultJobDates() {
    const dateInputs = document.querySelectorAll('#jobsTable .jobDate');
    console.log('Found date inputs:', dateInputs.length);
    const today = new Date().toISOString().split('T')[0]; // Current date in 'YYYY-MM-DD' format
    dateInputs.forEach(input => {
        console.log('Setting date input:', input);
        input.value = today;
    });
}

function getMelbourneDate() {
    const now = new Date();  // Get the current date and time
    const currentDateElement = document.getElementById("currentDate");
    
    try {
        // Attempt to get the time in Melbourne
        const melbourneTime = new Intl.DateTimeFormat('en-AU', {
            timeZone: 'Australia/Melbourne',
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(now);

        console.log("Melbourne time:", melbourneTime);  // Log the Melbourne time
        
        if (currentDateElement) {
            currentDateElement.innerText = melbourneTime;  // Display the Melbourne time
        } else {
            console.error("Element with ID 'currentDate' not found");
        }
    } catch (error) {
        console.error("Error in Melbourne time:", error);
        // Fallback to local time
        const localTime = now.toLocaleString('en-AU', {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        if (currentDateElement) {
            currentDateElement.innerText = localTime;
        }
    }
}


   
    //function deleteRow(rowId) {
   // const currentRowElement = document.querySelector(`#rosterTableBody tr:nth-child(${rowId})`);
    
    // Remove the selected row from the table
  //  currentRowElement.remove(); 

    // Reassign row IDs and element IDs after deletion (optional but recommended for consistency)
   // reassignRowIds();

    // Optionally, re-enable the jobs list confirm button if rows corresponding to a job were deleted
   // refreshJobListState(); // Refresh jobs list state after deletion
//}

function reassignRowIds() {
    const rows = document.querySelectorAll('#rosterTableBody tr');
    rows.forEach((row, index) => {
        const newId = index + 1; // Create new rowId based on index
        row.id = `row-${newId}`; // Update the row's ID
        row.setAttribute('data-row-id', newId); // Update the data-row-id attribute

        // Update the IDs of all elements within the row
        row.querySelector(`input[type="date"]`).id = `date${newId}`;
        row.querySelector(`#rego${rowId}`).id = `rego${newId}`;
        row.querySelector(`#trailerRego${newId}`).id = `trailerRego${newId}`;
        row.querySelector(`#trailer2${newId}`).id = `trailer2${newId}`; // Update for Trailer 2
        row.querySelector(`#trailer3${newId}`).id = `trailer3${newId}`; 
        row.querySelector(`#type${rowId}`).id = `type${newId}`;
        row.querySelector(`#startTime${rowId}`).id = `startTime${newId}`;
        row.querySelector(`#finishTime${rowId}`).id = `finishTime${newId}`;
        row.querySelector(`#service${rowId}`).id = `service${newId}`;
        row.querySelector(`#wharfLocation${rowId}`).id = `wharfLocation${newId}`;
        row.querySelector(`#constructionSite${rowId}`).id = `constructionSite${newId}`;
        row.querySelector(`#driver${rowId}`).id = `driver${newId}`;
        row.querySelector('.confirm-btn').setAttribute('onclick', `confirmRow(${newId})`);
        
    });
}


function addRow(selectedDate = '') {
    if (!selectedDate) {
        selectedDate = new Date().toISOString().split('T')[0]; // Set to current date if not provided
    }

    const tableBody = document.getElementById('rosterTableBody');
    const rowId = nextRowId++; // Use the current rowId for unique IDs

    const row = document.createElement('tr');
    row.setAttribute('data-row-id', rowId); // Store the rowId as a data attribute

    const service = "Sunrice"; // Replace with actual value

    // Apply service class dynamically
    let serviceClass = '';
    switch (service.toLowerCase()) {
        case 'sunrice':
            serviceClass = 'service-sunrice';
            break;
        case 'xagripak':
            serviceClass = 'service-xagripak';
            break;
        case 'bb':
            serviceClass = 'service-bb';
            break;
        case 'northeast link':
            serviceClass = 'service-northeast';
            break;
        default:
            serviceClass = '';
    }

    row.innerHTML = `
        <td><input type="date" id="date${rowId}" value="${selectedDate}"></td> <!-- Date Input -->
        <td><select id="rego${rowId}"></select></td>

        <td>
            <select id="trailerRego${rowId}"></select> <!-- Trailer Rego dropdown -->
        </td>
        <td><select id="trailer2${rowId}"></select></td> <!-- Trailer 2 dropdown -->
        <td><select id="trailer3${rowId}"></select></td> <!-- Trailer 3 dropdown -->

        
        <td>
            <select id="type${rowId}"></select> <!-- Trailer Type dropdown -->
        </td>
        <td><input type="time" id="startTime${rowId}"></td>
        <td><input type="time" id="finishTime${rowId}"></td>
        <td><select id="service${rowId}"></select></td>
        <td>
            <select id="wharfLocation${rowId}" onchange="updateDriverList(${rowId})">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
            </select>
        </td>
        <td>
            <select id="constructionSite${rowId}" onchange="updateDriverList(${rowId})">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
            </select>
        </td>
        <td><select id="driver${rowId}"></select></td>
        <td>
            <button class="confirm-btn" onclick="confirmRow(${rowId})">Confirm</button>
            
        </td>
    `;
    tableBody.appendChild(row);

    // Populate the Trailer Rego dropdown
    populateTrailerRegoDropdown(rowId);
    populateTruckDropdown(rowId);
    
    // Populate other dropdowns
    populateDropDowns(rowId);

    return row; // Return the created row
}
function toggleVehiclesList() {
    const vehiclesList = document.getElementById('vehiclesTable');
    const newRegoInput = document.getElementById('newRego');
    const addRegoButton = document.querySelector('button[onclick="addRego()"]');
    
    // Toggle the display property of vehicles list and inputs
    if (vehiclesList.style.display === 'none') {
        vehiclesList.style.display = 'table';
        newRegoInput.style.display = 'inline';
        addRegoButton.style.display = 'inline';
    } else {
        vehiclesList.style.display = 'none';
        newRegoInput.style.display = 'none';
        addRegoButton.style.display = 'none';
    }
}

function updateDriverList(rowId) {
    const wharfStatus = document.getElementById(`wharfLocation${rowId}`).value;
    const constructionSiteStatus = document.getElementById(`constructionSite${rowId}`).value;

    const wharfStatusIsYes = (wharfStatus === "Yes");
    const constructionSiteIsYes = (constructionSiteStatus === "Yes");

    // Update the driver dropdown based on the criteria
    populateDriverDropdown(rowId, wharfStatusIsYes, constructionSiteIsYes);
}


function confirmJob(button) {
    const row = button.closest('tr');
    const selectedDate = row.cells[0].querySelector('.jobDate').value; // Get the selected date
    const clientName = row.cells[1].textContent;
    const selectedTrailerType = row.cells[2].querySelector('select').value;
    const numberOfRows = parseInt(row.cells[3].querySelector('.rowCount').value);

    // Validate the selected date
    if (!selectedDate) {
        alert("Please select a date for the job.");
        return;
    }

    // Validate the number of rows
    if (isNaN(numberOfRows) || numberOfRows <= 0) {
        alert("Please enter a valid number of rows.");
        return;
    }

    for (let i = 0; i < numberOfRows; i++) {
        const newRow = addRow(selectedDate); // Pass the selected date to addRow
        const rowId = newRow.getAttribute('data-row-id'); // Get the unique row ID

        // Update the Client Name (Service) and Trailer Type in the new row
        const clientCell = document.getElementById(`service${rowId}`);
        const trailerTypeSelect = document.getElementById(`type${rowId}`);
        const dateCell = document.getElementById(`date${rowId}`); // Date cell in the Roster Table

        clientCell.innerHTML = `<option>${clientName}</option>`;
        trailerTypeSelect.innerHTML = '';
        const trailerTypeOption = document.createElement('option');
        trailerTypeOption.value = selectedTrailerType;
        trailerTypeOption.textContent = selectedTrailerType;
        trailerTypeSelect.appendChild(trailerTypeOption);

        // Set the date in the Roster Table row
        dateCell.value = selectedDate;
    }

    // Disable the confirm button and inputs in the jobs list
    button.disabled = true;
    row.cells[0].querySelector('.jobDate').disabled = true; // Disable the date input
    row.cells[2].querySelector('select').disabled = true;
    row.cells[3].querySelector('.rowCount').disabled = true;

    // Change the button style
    button.style.backgroundColor = 'grey';
    button.style.cursor = 'not-allowed';
    
}


function populateDriverDropdown(rowId, wharfStatusIsYes, constructionSiteIsYes) {
    const drivers = document.querySelectorAll('#driversTable tbody tr');
    const driverSelect = document.getElementById(`driver${rowId}`);
    const currentValue = driverSelect.value; // Store current selected value
    driverSelect.innerHTML = ''; // Clear existing options

    let driverAdded = false; // Track if any driver is added
    let hasCurrentValue = false; // Track if current value is still valid

    // Loop through drivers and apply filters based on conditions
    drivers.forEach(function (row) {
        const cells = row.querySelectorAll('td'); // Use querySelectorAll to get cells
        if (cells.length < 4) return; // Skip if not enough cells

        const driverName = cells[0].textContent.trim();
        const onLeaveCheckbox = cells[1].querySelector('.onLeave');
        const hasMSICCheckbox = cells[2].querySelector('.hasMSIC');
        const hasWhiteCardCheckbox = cells[3].querySelector('.hasWhiteCard');

        const onLeave = onLeaveCheckbox ? onLeaveCheckbox.checked : false;
        const hasMSIC = hasMSICCheckbox ? hasMSICCheckbox.checked : false;
        const hasWhiteCard = hasWhiteCardCheckbox ? hasWhiteCardCheckbox.checked : false;

        // Debugging statements (you can remove these if not needed)
        // console.log(`Driver: ${driverName}, OnLeave: ${onLeave}, HasMSIC: ${hasMSIC}, HasWhiteCard: ${hasWhiteCard}`);

        // Check if the driver meets the criteria and is not on leave
        if (!onLeave) {
            let addDriver = false;

            if (wharfStatusIsYes && constructionSiteIsYes) {
                if (hasMSIC && hasWhiteCard) addDriver = true;
            } else if (wharfStatusIsYes) {
                if (hasMSIC) addDriver = true;
            } else if (constructionSiteIsYes) {
                if (hasWhiteCard) addDriver = true;
            } else {
                addDriver = true; // No restrictions, allow all drivers not on leave
            }

            // Debugging statement
            // console.log(`AddDriver for ${driverName}: ${addDriver}`);

            // If the driver meets the conditions, add them to the dropdown
            if (addDriver) {
                const option = document.createElement('option');
                option.value = driverName;
                option.textContent = driverName;
                if (driverName === currentValue) {
                    hasCurrentValue = true;
                    option.selected = true; // Keep current selection if still valid
                }
                driverSelect.appendChild(option);
                driverAdded = true;
            }
        }
    });

    // If no drivers are added, show a message in the dropdown
    if (!driverAdded) {
        const noDriverOption = document.createElement('option');
        noDriverOption.value = '';
        noDriverOption.textContent = 'No drivers available';
        driverSelect.appendChild(noDriverOption);
    }

    // If current value is no longer valid, reset the select value
    if (!hasCurrentValue) {
        driverSelect.value = ''; // Reset to default
    }

    // Re-initialize Select2 for the driver dropdown
    $(`#driver${rowId}`).select2('destroy'); // Destroy existing Select2 instance
    $(`#driver${rowId}`).select2(); // Re-initialize Select2

    // Trigger change event to update the UI
    $(`#driver${rowId}`).trigger('change');
}

function populateTruckDropdown(rowId) {
    const truckDropdown = document.getElementById(`rego${rowId}`);
    truckDropdown.innerHTML = ''; // Clear the existing options

    // Retrieve vehicles from local storage
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];

    // Populate dropdown with vehicles
    vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle;
        option.textContent = vehicle;
        truckDropdown.appendChild(option);
    });

    // Reinitialize the Select2 plugin (if using Select2)
    $(`#rego${rowId}`).select2();
}
    
function populateDropDowns(rowId) {
    const drivers = document.querySelectorAll('#driversTable tbody tr');
    const vehicles = document.querySelectorAll('#vehiclesTable tbody tr');
    const driverSelect = document.getElementById(`driver${rowId}`);
    const regoSelect = document.getElementById(`rego${rowId}`);
    const wharfLocationSelect = document.getElementById(`wharfLocation${rowId}`); // Wharf Location (Restricted)
    const wharfRestricted = wharfLocationSelect.value === "Yes"; // Check if wharf location is restricted

    regoSelect.innerHTML = ''; // Clear vehicle options
    driverSelect.innerHTML = ''; // Clear driver options

    // Populate vehicles dropdown
    vehicles.forEach(function (row) {
        const option = document.createElement('option');
        option.value = row.cells[0].textContent;
        option.textContent = row.cells[0].textContent;
        regoSelect.appendChild(option);
    });
        $(document).ready(function() {
        $('select').select2();
    });

    // Populate drivers dropdown
    drivers.forEach(function (row) {
        const driverName = row.cells[0].textContent;
        const onLeave = row.cells[1].querySelector('.onLeave').checked;
        const hasMSIC = row.cells[2].querySelector('.hasMSIC').checked;

        if (!onLeave) {
            if (wharfRestricted) {
                // Show only drivers with MSIC for restricted wharf jobs
                if (hasMSIC) {
                    const option = document.createElement('option');
                    option.value = driverName;
                    option.textContent = driverName;
                    driverSelect.appendChild(option);
                }
            } else {
                // For non-wharf jobs, add all drivers who are not on leave
                const option = document.createElement('option');
                option.value = driverName;
                option.textContent = driverName;
                driverSelect.appendChild(option);
            }
        }
    });
    $(`#rego${rowId}, #driver${rowId}`).select2();
}

function refreshDriverDropdowns() {
    const rows = document.querySelectorAll('#rosterTableBody tr');
    rows.forEach((row) => {
        const rowId = row.getAttribute('data-row-id'); // Get the rowId from the data attribute
        updateDriverList(rowId); // Update the driver list for each row dynamically
       // $(`#driver${rowId}`).select2();  
    });
}

// Ensure this is triggered when driver statuses change
document.querySelectorAll('.onLeave, .hasMSIC, .hasWhiteCard').forEach(checkbox => {
    checkbox.addEventListener('change', refreshDriverDropdowns);
});

function confirmRow(rowId) {
    const currentRowElement = document.querySelector(`#rosterTableBody tr[data-row-id="${rowId}"]`);
    const confirmButton = currentRowElement.querySelector('.confirm-btn');
    const driverSelect = document.getElementById(`driver${rowId}`).value;

    // Ensure a driver is selected before confirming
    if (!driverSelect) {
        alert('Please select a driver before confirming.');
        return;
    }

    // Toggle between Confirm and Edit
    if (confirmButton.textContent === "Confirm") {
        // Disable all inputs and dropdowns
        currentRowElement.querySelectorAll('input, select').forEach(function(element) {
            element.disabled = true;
        });

        // Change button to Edit
        confirmButton.textContent = "Edit";
        confirmButton.classList.add('edit-btn');
    } else {
        // Enable all inputs and dropdowns to make row editable again
        currentRowElement.querySelectorAll('input, select').forEach(function(element) {
            element.disabled = false;
        });

        // Change button back to Confirm
        confirmButton.textContent = "Confirm";
        confirmButton.classList.remove('edit-btn');
    }
}


   function addDriver() {
    const newDriverName = document.getElementById('newDriverName').value.trim();
    const newDriverPhone = document.getElementById('newDriverPhone').value.trim();
    if (newDriverName !== "") {
        const driversTable = document.getElementById('driversTable').querySelector('tbody');
        const newRow = driversTable.insertRow();

        newRow.innerHTML = `
            <td>${newDriverName}</td>
            <td><input type="checkbox" class="onLeave" onchange="refreshDriverDropdowns()"></td>
            <td><input type="checkbox" class="hasMSIC" checked onchange="refreshDriverDropdowns()"></td>
            <td><input type="checkbox" class="hasWhiteCard" checked onchange="refreshDriverDropdowns()"></td>
            <td><input type="text" value="${newDriverPhone}" class="driverPhone"></td>
        `;

        // Clear input fields and refresh dropdowns
        document.getElementById('newDriverName').value = '';
        document.getElementById('newDriverPhone').value = '';
        refreshDriverDropdowns();  // Refresh dropdowns across all rows
    } else {
        alert("Please enter a driver name.");
    }
}

//function updateLocalStorage() {
  //  const vehicles = [];
    //const vehicleRows = document.querySelectorAll('#vehiclesTable tbody tr');

   // vehicleRows.forEach(row => {
     //   const rego = row.cells[0].textContent.trim();
       // vehicles.push(rego);
   // });

    // Store the vehicles array in local storage
   // localStorage.setItem('vehicles', JSON.stringify(vehicles));
//}

  function addRego() {
    const newRego = document.getElementById('newRego').value.trim();
    if (newRego !== "") {
        const vehiclesTable = document.getElementById('vehiclesTable').querySelector('tbody');
        const newRow = vehiclesTable.insertRow();
        newRow.innerHTML = `<td>${newRego}</td>`;

        // Clear input field
        document.getElementById('newRego').value = '';

        // Refresh dropdowns in all rows
       // const rows = document.querySelectorAll('#rosterTableBody tr');
      //  rows.forEach((row) => {
      //      const rowId = row.getAttribute('data-row-id');
      //      populateDropDowns(rowId);

        //    });

           // updateLocalStorage();
    }
}

  // Function to add a new job dynamically
  function addJob() {
    const newJob = document.getElementById('newJob').value.trim();
    const newJobCount = parseInt(document.getElementById('newJobCount').value.trim());
    const newJobDate = document.getElementById('newJobDate').value; // New date input

    if (!newJobDate) {
        newJobDate = new Date().toISOString().split('T')[0];
    }

    // Validate job name, job count, and date
    if (newJob === "") {
        alert("Please enter a job name.");
        return;
    }

    if (isNaN(newJobCount) || newJobCount <= 0) {
        alert("Please enter a valid number of jobs.");
        return;
    }

    const jobsTable = document.getElementById('jobsTable').querySelector('tbody');
    const newRow = jobsTable.insertRow();

    newRow.innerHTML = `
        <td><input type="date" class="jobDate" value="${newJobDate}"></td>
        <td>${newJob}</td>
        <td>
            <select>
                <option value="S">S</option>
                <option value="SDL">SDL</option>
                <option value="RT">RT</option>
                <option value="BDBL">BDBL</option>
            </select>
        </td>
        <td><input type="number" class="rowCount" value="${newJobCount}" min="1"></td>
        <td><button class="confirm-btn" onclick="confirmJob(this)">Confirm</button></td>
    `;

    // Clear input fields after adding the job
    document.getElementById('newJob').value = '';
    document.getElementById('newJobCount').value = '';
    document.getElementById('newJobDate').value = '';
}



function saveRoster(data) {
    fetch('https://tasmandriverroster-a8hqh7hcd2gfbkc0.australiasoutheast-01.azurewebsites.net/save-roster', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Roster saved successfully:', data);
    })
    .catch((error) => {
        console.error('Error saving roster:', error);
    });
}


function saveDriver(data) {
    fetch('https://tasmandriverroster-a8hqh7hcd2gfbkc0.australiasoutheast-01.azurewebsites.net/save-driver', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Driver saved successfully:', data);
    })
    .catch((error) => {
        console.error('Error saving driver:', error);
    });
}
function submitDriverForm() {
    const driverData = {
        name: document.getElementById('driverName').value,
        onLeave: document.getElementById('onLeave').checked,
        hasMSIC: document.getElementById('hasMSIC').checked,
        hasWhiteCard: document.getElementById('hasWhiteCard').checked
    };

    saveDriver(driverData);
}

function collectRosterData() {
    const rosterData = [];

    const rows = document.querySelectorAll('#rosterTableBody tr');
    rows.forEach(row => {
        const rowId = row.getAttribute('data-row-id');
        const data = {
            date: document.getElementById(`date${rowId}`).value,
            rego: document.getElementById(`rego${rowId}`).value,
            trailerRego: document.getElementById(`trailerRego${rowId}`).value,
            trailer2: document.getElementById(`trailer2${rowId}`).value,
            trailer3: document.getElementById(`trailer2${rowId}`).value,
            trailerType: document.getElementById(`type${rowId}`).value,
            startTime: document.getElementById(`startTime${rowId}`).value,
            finishTime: document.getElementById(`finishTime${rowId}`).value,
            service: document.getElementById(`service${rowId}`).value,
            wharfStatus: document.getElementById(`wharfLocation${rowId}`).value,
            constructionSite: document.getElementById(`constructionSite${rowId}`).value,
            driver: document.getElementById(`driver${rowId}`).value
        };
        rosterData.push(data);
    });

    // Now you can save the roster data or process it as needed
    saveRoster(rosterData);
}


    // Function to download the entire roster to an Excel file
    function downloadExcel() {
        const workbook = XLSX.utils.book_new();

        // Collect data from the roster table, drivers table, vehicles table, and jobs table
        const rosterData = tableToArray(document.getElementById('rosterTable'));
        const driversData = tableToArray(document.getElementById('driversTable'));
        const vehiclesData = tableToArray(document.getElementById('vehiclesTable'));
        const jobsData = tableToArray(document.getElementById('jobsTable'));

        // Create worksheets for each section
        const rosterSheet = XLSX.utils.aoa_to_sheet(rosterData);
        const driversSheet = XLSX.utils.aoa_to_sheet(driversData);
        const vehiclesSheet = XLSX.utils.aoa_to_sheet(vehiclesData);
        const jobsSheet = XLSX.utils.aoa_to_sheet(jobsData);

        rosterSheet['!cols'] = rosterData[0].map(() => ({ wch: 20 })); // Auto-width for columns

        // Add worksheets to the workbook
        XLSX.utils.book_append_sheet(workbook, rosterSheet, 'Roster');
        XLSX.utils.book_append_sheet(workbook, driversSheet, 'Drivers');
        XLSX.utils.book_append_sheet(workbook, vehiclesSheet, 'Vehicles');
        XLSX.utils.book_append_sheet(workbook, jobsSheet, 'Jobs');

        // Generate file name based on the date
        const dateString = new Date().toLocaleDateString('en-AU').replace(/\//g, '_');
        const fileName = `Driver_Roster_${dateString}.xlsx`;

        // Download the Excel file
        XLSX.writeFile(workbook, fileName);
    }

    // Utility function to convert table to a 2D array for Excel export
    // Utility function to convert table to a 2D array for Excel export
    function tableToArray(table) {
        const data = [];
        table.querySelectorAll('tr').forEach((row, index) => {
            // Skip row 2 (which is index 1 since indexing starts at 0)
            if (index === 1) return;
    
            const rowData = [];
            row.querySelectorAll('th, td').forEach(cell => {
                const input = cell.querySelector('input, select');
                if (input) {
                    if (input.type === 'checkbox') {
                        rowData.push(input.checked);
                    } else {
                        rowData.push(input.value);
                    }
                } else {
                    rowData.push(cell.textContent.trim());
                }
            });
            data.push(rowData);
        });
        return data;
    }
    

function tableToArrayWithStyles(table) {
    const data = [];
    const colors = {
        'Sunrice': 'FFFF00', // Yellow
        'Xagripak': 'ADD8E6', // Light Blue
        'BB': 'FFC0CB', // Light Pink
        'Northeast Link': 'FFA500' // Orange
    };

    table.querySelectorAll('tr').forEach(row => {
        const rowData = [];
        row.querySelectorAll('th, td').forEach(cell => {
            const input = cell.querySelector('input, select');
            const service = cell.textContent.trim();
            const cellValue = input ? (input.value || cell.textContent) : cell.textContent;

            // Apply color based on the service
            const style = (colors[service]) ? { fill: { fgColor: { rgb: colors[service] } } } : {};

            rowData.push({ v: cellValue, s: style });
        });
        data.push(rowData);
    });
    return data;
}
function addTrailerRego() {
    const newTrailerRego = document.getElementById('newTrailerRego').value.trim();
    if (newTrailerRego !== "") {
        const trailersTable = document.getElementById('trailersTable').querySelector('tbody');
        const newRow = trailersTable.insertRow();
        newRow.innerHTML = `<td>${newTrailerRego}</td>`;

        // Clear input field
        document.getElementById('newTrailerRego').value = '';

        // Update trailer rego dropdowns in the roster table
        refreshTrailerRegoDropdowns();
    } else {
        alert("Please enter a trailer rego.");
    }
}

function refreshTrailerRegoDropdowns() {
    const rows = document.querySelectorAll('#rosterTableBody tr');
    rows.forEach((row) => {
        const rowId = row.getAttribute('data-row-id'); // Get the rowId from the data attribute
        populateTrailerRegoDropdown(rowId); // Update the trailer rego dropdown for each row
    });
}
function populateTrailerRegoDropdown(rowId) {
    const trailers = document.querySelectorAll('#trailersTable tbody tr');
    const trailerRegoSelect = document.getElementById(`trailerRego${rowId}`);
    const trailer2Select = document.getElementById(`trailer2${rowId}`);
    const trailer3Select = document.getElementById(`trailer3${rowId}`);
    
    [trailerRegoSelect, trailer2Select, trailer3Select].forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '';

        trailers.forEach(function (row) {
            const trailerRego = row.cells[0].textContent.trim();
            const option = document.createElement('option');
            option.value = trailerRego;
            option.textContent = trailerRego;
            select.appendChild(option);
        });

        if (!select.value) {
            select.value = currentValue;
        }
    });

    // Initialize or refresh Select2
    [`#trailerRego${rowId}`, `#trailer2${rowId}`, `#trailer3${rowId}`].forEach(selectId => {
        const $select = $(selectId);
        if ($select.hasClass('select2-hidden-accessible')) {
            $select.select2('destroy');
        }
        $select.select2();
    });
}

    // Initial setup: add the first row, populate dropdowns, and set the current date
    window.onload = function() {
        getMelbourneDate(); // Set the current date
        addRow();
        setDefaultJobDates();
        document.getElementById('newJobDate').value = new Date().toISOString().split('T')[0];
    };
    document.addEventListener('DOMContentLoaded', () => {
        const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
        const vehiclesTable = document.getElementById('vehiclesTable').querySelector('tbody');
    
        // Populate the vehicles table with stored vehicles
        vehicles.forEach(vehicle => {
            const newRow = vehiclesTable.insertRow();
            newRow.innerHTML = `<td>${vehicle}</td>`;
        });
    });

