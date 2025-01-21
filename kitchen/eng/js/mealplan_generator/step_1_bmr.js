function calculateBMR(event) {
    event.preventDefault(); // Prevent form submission

    const age = parseFloat(document.getElementById('cage').value);
    const gender = document.querySelector('input[name="csex"]:checked').value;
    const formula = document.querySelector('input[name="cformula"]:checked').value;
    const unitType = document.querySelector('#topmenu ul #menuon a').getAttribute('onclick').match(/'([^']+)'/)[1];
    const activityFactor = parseFloat(document.getElementById('cactivity').value);

    let weight, height, bodyFat;
    if (unitType === 'standard') {
        const weightPounds = parseFloat(document.getElementById('cpound').value);
        const heightFeet = parseFloat(document.getElementById('cheightfeet').value);
        const heightInches = parseFloat(document.getElementById('cheightinch').value);

        // Validation checks for standard units
        if (isNaN(weightPounds) || isNaN(heightFeet) || isNaN(heightInches)) {
            alert('Please enter valid values for weight, height (feet and inches).');
            return;
        }

        weight = weightPounds * 0.453592; // Convert pounds to kg
        height = (heightFeet * 12 + heightInches) * 2.54; // Convert feet and inches to cm
    } else {
        weight = parseFloat(document.getElementById('ckg').value);
        height = parseFloat(document.getElementById('cheightmeter').value);

        // Validation checks for metric units
        if (isNaN(weight) || isNaN(height)) {
            alert('Please enter valid values for weight and height.');
            return;
        }
    }

    // Validation check for age
    if (isNaN(age)) {
        alert('Please enter a valid age.');
        return;
    }

    if (formula === 'k') {
        bodyFat = parseFloat(document.querySelector('input[name="cfatpct"]').value) / 100;

        // Validation check for body fat percentage
        if (isNaN(bodyFat)) {
            alert('Please enter a valid body fat percentage.');
            return;
        }
    }

    let bmr;
    if (formula === 'm') {
        // Mifflin-St Jeor Equation
        if (gender === 'm') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
    } else if (formula === 'h') {
        // Revised Harris-Benedict Equation
        if (gender === 'm') {
            bmr = 13.397 * weight + 4.799 * height - 5.677 * age + 88.362;
        } else {
            bmr = 9.247 * weight + 3.098 * height - 4.330 * age + 447.593;
        }
    } else if (formula === 'k') {
        // Katch-McArdle Formula
        bmr = 370 + 21.6 * (1 - bodyFat) * weight;
    }

    // Multiply BMR by activity factor to get maintenance calories
    const maintenanceCalories = bmr * activityFactor;

    // Display the results
    document.getElementById('bmr-result').innerHTML = `
        Your BMR is ${bmr.toFixed(2)} calories/day.<br>
        Your maintenance is ${maintenanceCalories.toFixed(2)} calories/day.<br>
    `;
}

function clearForm(form) {
    form.reset();
    document.getElementById('bmr-result').textContent = '';

    // Clear specific input fields
    document.getElementById('cage').value = '';
    document.getElementById('cpound').value = '';
    document.getElementById('cheightfeet').value = '';
    document.getElementById('cheightinch').value = '';
    document.getElementById('ckg').value = '';
    document.getElementById('cheightmeter').value = '';
}

document.addEventListener("DOMContentLoaded", function() {
    var menuItems = document.querySelectorAll("#topmenu ul li a");

    menuItems.forEach(function(item) {
        item.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default link behavior

            // Remove the 'menuon' id from the currently active item
            var activeItem = document.querySelector("#topmenu ul #menuon");
            if (activeItem) {
                activeItem.removeAttribute("id");
            }

            // Set the 'menuon' id to the clicked item
            this.parentElement.setAttribute("id", "menuon");

            // Call the popMenu function with the appropriate parameters
            var unitType = this.getAttribute("onclick").match(/'([^']+)'/)[1];
            var unitValue = this.getAttribute("onclick").match(/,(\d+)\)/)[1];
            popMenu(unitType, unitValue);
        });
    });

    // Set the initial state
    popMenu('standard', 1);
});

function popMenu(unitType, unitValue) {
    var standardTable = document.getElementById('standardheightweight');
    var metricTable = document.getElementById('metricheightweight');

    if (unitType === 'standard') {
        standardTable.style.display = 'block';
        metricTable.style.display = 'none';
    } else if (unitType === 'metric') {
        standardTable.style.display = 'none';
        metricTable.style.display = 'block';
    }

    return false; // Prevent default link behavior
}

// settings toggle
function cshmoreoption(toggle) {
    var content = document.getElementById('ccsettingcontent');
    var moreOption = document.getElementById('cmoreoption');
    var settingsToggle = document.getElementById('settingsToggle');

    if (toggle) {
        if (content.style.display === 'none') {
            content.style.display = 'block';
            moreOption.value = '1';
            settingsToggle.textContent = '- Settings';
        } else {
            content.style.display = 'none';
            moreOption.value = '0';
            settingsToggle.textContent = '+ Settings';
        }
    }
    return false; // Prevent default link behavior
}