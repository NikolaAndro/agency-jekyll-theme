function getSuggestions() { 
    const calorieGoal = parseFloat(document.getElementById('calorie-goal').value);
    const weightPounds = parseFloat(document.getElementById('cpound').value) || parseFloat(document.getElementById('ckg').value) * 2.20462;

    if (isNaN(calorieGoal) || isNaN(weightPounds)) {
        alert('Please enter valid values for calorie goal and weight.');
        return;
    }

    const proteinGoal = weightPounds; // 1 g of protein per lb of body mass
    const fatGoal = weightPounds * 0.3; // 0.3 g of fat per lb of body weight
    const proteinCalories = proteinGoal * 4;
    const fatCalories = fatGoal * 9;
    const carbsCalories = calorieGoal - (proteinCalories + fatCalories);
    const carbsGoal = carbsCalories / 4;

    // Display macro goals
    document.getElementById('protein').value = proteinGoal.toFixed(2);
    document.getElementById('fat').value = fatGoal.toFixed(2);
    document.getElementById('carbs').value = carbsGoal.toFixed(2);
    document.getElementById('total-calories').textContent = calorieGoal.toFixed(2);

    updatePercentages(calorieGoal);
}

function updatePercentages(calorieGoal) {
    console.log('Updating percentages');
    const protein = parseFloat(document.getElementById('protein').value) || 0;
    const carbs = parseFloat(document.getElementById('carbs').value) || 0;
    const fat = parseFloat(document.getElementById('fat').value) || 0;

    const proteinPercentage = ((protein * 4) / calorieGoal) * 100;
    const carbsPercentage = ((carbs * 4) / calorieGoal) * 100;
    const fatPercentage = ((fat * 9) / calorieGoal) * 100;

    document.getElementById('protein-percentage').textContent = proteinPercentage.toFixed(2) + '%';
    document.getElementById('carbs-percentage').textContent = carbsPercentage.toFixed(2) + '%';
    document.getElementById('fat-percentage').textContent = fatPercentage.toFixed(2) + '%';
}

document.getElementById('protein').addEventListener('input', function() {
    updatePercentages(parseFloat(document.getElementById('calorie-goal').value));
});
document.getElementById('carbs').addEventListener('input', function() {
    updatePercentages(parseFloat(document.getElementById('calorie-goal').value));
});
document.getElementById('fat').addEventListener('input', function() {
    updatePercentages(parseFloat(document.getElementById('calorie-goal').value));
});    