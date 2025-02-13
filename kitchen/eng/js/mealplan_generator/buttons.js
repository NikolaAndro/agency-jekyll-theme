function printMealPlan() {
    const selectedBreakfast = formatTable(document.getElementById('selected-breakfast').rows);
    const selectedLunch = formatTable(document.getElementById('selected-lunch').rows);
    const selectedDinner = formatTable(document.getElementById('selected-dinner').rows);
    const selectedSnacks = formatTable(document.getElementById('selected-snacks').rows);

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }');
    printWindow.document.write('th, td { border: 2px solid #000; padding: 8px; }'); // Changed border color to solid black
    printWindow.document.write('th { background-color: #f0c117; color: #ffffff; text-align: left; }');
    printWindow.document.write('tr:nth-child(even) { background-color: #f9f9f9; }');
    printWindow.document.write('td { text-align: left; }'); // Default alignment for all td elements
    printWindow.document.write('td.quantity, td.unit { width: 100px; text-align: center; }'); // Fixed width and center alignment for quantity and unit
    printWindow.document.write('h2 { text-align: center; }'); // Center alignment for subtitles
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h2>Breakfast</h2>');
    printWindow.document.write('<table>' + selectedBreakfast + '</table>');
    printWindow.document.write('<h2>Lunch</h2>');
    printWindow.document.write('<table>' + selectedLunch + '</table>');
    printWindow.document.write('<h2>Dinner</h2>');
    printWindow.document.write('<table>' + selectedDinner + '</table>');
    printWindow.document.write('<h2>Snacks</h2>');
    printWindow.document.write('<table>' + selectedSnacks + '</table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function formatTable(rows) {
    // let tableContent = '<tr><th>Food</th><th>Quantity</th><th>Unit</th></tr>';
    let tableContent = '<tr><th>Food</th><th>Quantity</th></tr>';
    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        const cells = rows[i].cells;
        const foodName = cells[1].textContent;
        const quantity = cells[0].textContent;
        // const unit = cells[2] ? cells[2].textContent : ''; // Check if unit cell exists
        // tableContent += `<tr><td>${foodName}</td><td class="quantity">${quantity}</td><td class="unit">${unit}</td></tr>`;
        tableContent += `<tr><td>${foodName}</td><td class="quantity">${quantity}</td></tr>`;
    }
    return tableContent;
}