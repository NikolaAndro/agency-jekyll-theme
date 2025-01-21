function generateGroceryList() {
    const days = parseFloat(document.getElementById('days').value);
    if (isNaN(days) || days <= 0) {
        alert('Please enter a valid number of days.');
        return;
    }

    const groceryList = {};
    document.querySelectorAll('.food-option.selected').forEach(foodDiv => {
        const quantity = parseFloat(foodDiv.dataset.quantity) || 0;
        const totalQuantity = quantity * days;

        const ingredients = foodDiv.dataset.ingredients ? JSON.parse(foodDiv.dataset.ingredients) : [];
        ingredients.forEach(ingredient => {
            const ingredientName = ingredient.name;
            const ingredientQuantity = ingredient.amount * totalQuantity;
            const ingredientUnit = ingredient.unit;

            if (groceryList[ingredientName]) {
                groceryList[ingredientName].quantity += ingredientQuantity;
            } else {
                groceryList[ingredientName] = { quantity: ingredientQuantity, unit: ingredientUnit };
            }
        });
    });

    const groceryListDiv = document.getElementById('grocery-list');
    groceryListDiv.innerHTML = '<h3 style="margin-bottom:20px">Grocery List:</h3>';
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.minWidth = '100%'; // Ensure table is full width on phone size
    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Ingredient</th><th>Quantity</th><th>Unit</th></tr>';
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    for (const [ingredient, { quantity, unit }] of Object.entries(groceryList)) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${ingredient}</td><td>${quantity.toFixed(2)}</td><td>${unit}</td>`;
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    groceryListDiv.appendChild(table);
}

function printGroceryList() {
    const groceryListDiv = document.getElementById('grocery-list');
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Grocery List</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(groceryListDiv.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function exportGroceryList() {
    const groceryListDiv = document.getElementById('grocery-list');

    // Extract and format text from the grocery list table
    const rows = groceryListDiv.querySelectorAll('table tbody tr');
    const formattedList = Array.from(rows)
        .map(row => {
            const cells = row.querySelectorAll('td');
            return `${cells[0].innerText}: ${cells[1].innerText} ${cells[2].innerText}`;
        })
        .join('\n'); // Newline-separated list

    const exportButton = document.getElementById('export-grocery-list'); // Get the button element

    if (navigator.share) {
        // Use the Web Share API for mobile devices
        navigator.share({
            title: 'Grocery List',
            text: formattedList,
        })
        .then(() => console.log('Grocery list shared successfully!'))
        .catch(error => console.error('Error sharing the grocery list:', error));
    } else {
        // Fallback for unsupported browsers or desktops
        const existingOptions = document.getElementById('share-options');
        if (existingOptions) existingOptions.remove(); // Remove existing options if present

        const encodedText = encodeURIComponent(formattedList);

        // Get the position of the button
        const rect = exportButton.getBoundingClientRect();
        const top = rect.bottom + window.scrollY; // Bottom of the button
        const left = rect.left + window.scrollX; // Left of the button

        const options = `
            <div id="share-options" style="position: absolute; top: ${top}px; left: ${left}px; background: white; border: 1px solid #ccc; padding: 10px; z-index: 1000; box-shadow: 0px 4px 6px rgba(0,0,0,0.1);">
                <button onclick="shareViaApp('signal', '${encodeURIComponent(formattedList)}')">Share via Signal</button><br>
                <button onclick="shareViaApp('whatsapp', '${encodeURIComponent(formattedList)}')">Share via WhatsApp</button><br>
                <button onclick="shareViaApp('email', '${encodeURIComponent(formattedList)}')">Share via Email</button><br>
                <button onclick="document.getElementById('share-options').remove()">Cancel</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', options);
    }
}

function shareViaApp(app, encodedText) {
    let url;
    switch (app) {
        case 'signal':
            url = `sgnl://send?text=${encodedText}`;
            break;
        case 'whatsapp':
            url = `https://web.whatsapp.com/send?text=${encodedText}`;
            break;
        case 'email':
            url = `mailto:?subject=Grocery%20List&body=${encodedText}`;
            break;
        default:
            console.error('Unsupported app');
            return;
    }
    window.open(url, '_blank');
    const shareOptions = document.getElementById('share-options');
    if (shareOptions) shareOptions.remove(); // Clean up options menu
}

function openGroceryList() {
    const groceryListDiv = document.getElementById('grocery-list');
    const rows = groceryListDiv.querySelectorAll('table tbody tr');
    const tableContent = Array.from(rows)
        .map(row => {
            const cells = row.querySelectorAll('td');
            return `<tr>
                        <td>${cells[1].innerText}</td>
                        <td>${cells[2].innerText}</td>
                        <td>${cells[0].innerText}</td>
                        <td><input type="checkbox" style="transform: scale(2);"></td>
                    </tr>`;
        })
        .join('');

    const newTab = window.open('', '_blank');
    newTab.document.write(`
        <html>
        <head>
            <title style="margin-bottom: 20px">Grocery List</title>
            <style>
                table {
                    min-width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: center;
                    font-size: 1.6em;
                }
                th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                    font-size: 1.8em;
                }
                /* Media query for smaller screens */
                @media (max-width: 768px) {
                    table {
                        min-width: 100%; /* Ensure table is full width */
                    }
                    th, td {
                        font-size: 1.5em; /* Increase font size for table cells */
                        padding: 10px; /* Increase padding for better touch experience */
                    }
                }
            </style>
        </head>
        <body>
            <h3 style="margin-bottom:20px; tex-align: center; font-size: 3.5em">Grocery List</h3>
            <table>
                <thead>
                    <tr>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Food Name</th>
                        <th>Check</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableContent}
                </tbody>
            </table>
        </body>
        </html>
    `);
    newTab.document.close();
}
