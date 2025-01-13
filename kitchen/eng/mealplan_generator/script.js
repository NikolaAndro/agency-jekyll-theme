document.getElementById('macro-form').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('macro-form').style.display = 'none';
    document.getElementById('meal-form').style.display = 'block';
});

document.getElementById('meal-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const meals = parseInt(document.getElementById('meals').value);
    generateMealSections(meals);
    document.getElementById('meal-form').style.display = 'none';
    document.getElementById('meal-sections').style.display = 'block';
});

function generateMealSections(meals) {
    const mealSections = document.getElementById('meal-sections');
    mealSections.innerHTML = '';
    const mealNames = ['Breakfast', 'Lunch', 'Dinner'];
    for (let i = 0; i < meals; i++) {
        const mealName = mealNames[i] || `Snack ${i - mealNames.length + 1}`;
        const section = document.createElement('div');
        section.className = 'meal-section';
        section.innerHTML = `<h3>${mealName}</h3><div class="food-options" id="meal-${i}"></div>`;
        mealSections.appendChild(section);
        loadFoodOptions(`meal-${i}`);
    }
}

function loadFoodOptions(mealId) {
    fetch('foods.yaml')
        .then(response => response.text())
        .then(data => {
            const foods = jsyaml.load(data).foods;
            const foodOptions = document.getElementById(mealId);
            foods.forEach(food => {
                const foodDiv = document.createElement('div');
                foodDiv.className = 'food-option';
                foodDiv.innerHTML = `
                    <img src="${food.image}" alt="${food.name}">
                    <p>${food.name}</p>
                `;
                foodDiv.addEventListener('click', () => selectFood(food, mealId));
                foodOptions.appendChild(foodDiv);
            });
        });
}

function selectFood(food, mealId) {
    // Implement food selection logic
}