document.addEventListener("DOMContentLoaded", function() {
    fetch('../foods.yaml')
        .then(response => response.text())
        .then(data => {
            const foods = jsyaml.load(data).foods;
            displayFoods(foods);
        });

    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalCalories = 0;
    let totalCaloriesGoal = 0;

    const proteinInput = document.getElementById('protein');
    const carbsInput = document.getElementById('carbs');
    const fatInput = document.getElementById('fat');
    const totalCaloriesLabel = document.getElementById('total-calories');

    function updateTotalCaloriesGoal() {
        console.log('Updating total calories goal');
        const protein = parseFloat(proteinInput.value) || 0;
        const carbs = parseFloat(carbsInput.value) || 0;
        const fat = parseFloat(fatInput.value) || 0;

        totalCaloriesGoal = (protein * 4) + (carbs * 4) + (fat * 9);
        totalCaloriesLabel.textContent = totalCaloriesGoal.toFixed(2);
        updateFoodOptions();
    }

    proteinInput.addEventListener('input', updateTotalCaloriesGoal);
    carbsInput.addEventListener('input', updateTotalCaloriesGoal);
    fatInput.addEventListener('input', updateTotalCaloriesGoal);
    
    /**
     * MutationObserver to handle changes in the input fields and total calories label
    */
    function handleMutation(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                updateTotalCaloriesGoal();
            } else if (mutation.type === 'childList' || mutation.type === 'characterData') {
                updateTotalCaloriesGoal();
            }
        }
    }

    // Create a MutationObserver instance
    const observer = new MutationObserver(handleMutation);

    // Configuration for the observer
    const config = { attributes: true, childList: true, characterData: true, subtree: true };

    // Observe the input elements
    observer.observe(proteinInput, config);
    observer.observe(carbsInput, config);
    observer.observe(fatInput, config);

    // Observe the total calories label
    observer.observe(totalCaloriesLabel, config);

    /*
    * Done with the MutationObserver
    */


    function displayFoods(foods) {
        for (const [meal, items] of Object.entries(foods)) {
            const mealOptions = document.getElementById(`${meal}-options`);
            if (!mealOptions) {
                console.error(`Element with ID ${meal}-options not found.`);
                continue;
            }
            items.forEach(item => {
                const foodDiv = document.createElement('div');
                foodDiv.className = 'food-option';
                foodDiv.dataset.ingredients = JSON.stringify(item.ingredients); // Set data-ingredients attribute
                foodDiv.innerHTML = `
                    <div style="display: flex; justify-content: center; align-items: center;">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <button class="description-button" data-name="${item.name}" data-description="${item.description}" data-description-image="${item.description_image || ''}">View Description</button>
                    <p>${item.name}</p>
                    <div class="macros">
                        <p>Protein: ${item.protein} g</p>
                        <p>Carbs: ${item.carbs} g</p>
                        <p>Fat: ${item.fat} g</p>
                        <p class="calories">Calories: ${item.calories} kcal</p>
                    </div>
                `;
                mealOptions.appendChild(foodDiv);

                // Add click event listener to the button
                foodDiv.querySelector('.description-button').addEventListener('click', function() {
                    showModal(this.dataset.name, this.dataset.description, this.dataset.descriptionImage);
                });

                // Add click event listener to the image
                foodDiv.querySelector('img').addEventListener('click', function() {
                    if (foodDiv.querySelector('.exceeds-goal-banner')) {
                        return; // Prevent selection if the banner is present
                    }
                    showQuantityModal(foodDiv, item);
                });
            });
        }
        updateFoodOptions();
    }

    function updateFoodOptions() {
        document.querySelectorAll('.food-option').forEach(foodDiv => {
            const itemCalories = parseFloat(foodDiv.querySelector('.calories').textContent.split(' ')[1]);
            const banner = foodDiv.querySelector('.exceeds-goal-banner');
            if (totalCalories + itemCalories > totalCaloriesGoal) {
                if (!banner) {
                    const newBanner = document.createElement('div');
                    newBanner.className = 'exceeds-goal-banner';
                    newBanner.textContent = 'Exceeds Your Goal';
                    foodDiv.appendChild(newBanner);
                }
            } else {
                if (banner) {
                    banner.remove();
                }
            }
        });
        updateSelectedFoods();
    }

    function updateSelectedFoods() {
        const selectedBreakfast = document.getElementById('selected-breakfast');
        const selectedLunch = document.getElementById('selected-lunch');
        const selectedDinner = document.getElementById('selected-dinner');
        const selectedSnacks = document.getElementById('selected-snacks');

        selectedBreakfast.innerHTML = '<tr><th>Quantity</th><th>Food</th></tr>';
        selectedLunch.innerHTML = '<tr><th>Quantity</th><th>Food</th></tr>';
        selectedDinner.innerHTML = '<tr><th>Quantity</th><th>Food</th></tr>';
        selectedSnacks.innerHTML = '<tr><th>Quantity</th><th>Food</th></tr>';

        document.querySelectorAll('.food-option.selected').forEach(foodDiv => {
            const mealType = foodDiv.closest('.meal-category').querySelector('h3').textContent.toLowerCase();
            const foodName = foodDiv.querySelector('p').textContent;
            const quantity = foodDiv.querySelector('.quantity-label').textContent.split(': ')[1];

            const foodItem = document.createElement('tr');
            foodItem.innerHTML = `<td>${quantity}</td><td>${foodName}</td>`;

            if (mealType === 'breakfast') {
                selectedBreakfast.appendChild(foodItem);
            } else if (mealType === 'lunch') {
                selectedLunch.appendChild(foodItem);
            } else if (mealType === 'dinner') {
                selectedDinner.appendChild(foodItem);
            } else if (mealType === 'snacks') {
                selectedSnacks.appendChild(foodItem);
            }
        });
    }
    function showModal(name, description, descriptionImage) {
        const modal = document.getElementById('mealModal');
        document.getElementById('mealName').textContent = name;
        document.getElementById('mealDescription').textContent = description;

        const descriptionImageElement = document.getElementById('mealDescriptionImage');
        if (descriptionImage) {
            descriptionImageElement.src = descriptionImage;
            descriptionImageElement.style.display = 'block';
        } else {
            descriptionImageElement.style.display = 'none';
        }

        modal.style.display = 'block';
    }

    function showQuantityModal(foodDiv, item) {
        const modal = document.getElementById('quantityModal');
        modal.style.display = 'block';

        const quantityInput = document.getElementById('quantityInput');
        quantityInput.value = '';
        quantityInput.focus(); // Set focus to the input field

        function addFood() {
            const newQuantity = parseFloat(quantityInput.value);
            const oldQuantity = parseFloat(foodDiv.dataset.quantity) || 0;

            if (isNaN(newQuantity) || newQuantity <= 0.1) {
                alert('Please enter a valid quantity.');
                return;
            }

            if (newQuantity === oldQuantity) {
                modal.style.display = 'none';
                return; // No change in quantity, no need to update
            }

            if (totalCalories + (item.calories * newQuantity) - (item.calories * oldQuantity) > totalCaloriesGoal) {
                alert('Adding this item exceeds your total calories goal.');
                return;
            }

            console.log(`Item: ${item.name}, Old Quantity: ${oldQuantity}, New Quantity: ${newQuantity}`);

            foodDiv.classList.add('selected');
            foodDiv.querySelector('img').classList.add('selected');
            let quantityLabel = foodDiv.querySelector('.quantity-label');
            if (!quantityLabel) {
                quantityLabel = document.createElement('div');
                quantityLabel.className = 'quantity-label';
                foodDiv.insertBefore(quantityLabel, foodDiv.firstChild);
            }
            quantityLabel.textContent = `Quantity: ${newQuantity}`;

            // Create and insert the deselect button
            let deselectButton = foodDiv.querySelector('.deselect-button');
            if (!deselectButton) {
                deselectButton = document.createElement('button');
                deselectButton.className = 'deselect-button';
                deselectButton.textContent = 'Deselect';
                foodDiv.insertBefore(deselectButton, quantityLabel.nextSibling);
            } else {
                // Remove existing event listener to avoid multiple triggers
                deselectButton.replaceWith(deselectButton.cloneNode(true));
                deselectButton = foodDiv.querySelector('.deselect-button');
            }

            // Add click event listener to the deselect button
            deselectButton.addEventListener('click', function() {
                foodDiv.classList.remove('selected');
                foodDiv.querySelector('img').classList.remove('selected');
                if (quantityLabel) {
                    quantityLabel.remove();
                }
                if (deselectButton) {
                    deselectButton.remove();
                }
                console.log(`Deselecting - Item: ${item.name}, Old Quantity: ${foodDiv.dataset.quantity}, New Quantity: 0`);
                updateAggregatedValues(-item.protein * foodDiv.dataset.quantity, -item.carbs * foodDiv.dataset.quantity, -item.fat * foodDiv.dataset.quantity, -item.calories * foodDiv.dataset.quantity);
                foodDiv.dataset.quantity = 0; // Reset the quantity to zero
            });

            updateAggregatedValues(
                item.protein * newQuantity - item.protein * oldQuantity,
                item.carbs * newQuantity - item.carbs * oldQuantity,
                item.fat * newQuantity - item.fat * oldQuantity,
                item.calories * newQuantity - item.calories * oldQuantity
            );

            // Update the stored quantity
            foodDiv.dataset.quantity = newQuantity;

            modal.style.display = 'none';
        }

        // Handle quantity submission
        document.getElementById('quantitySubmit').onclick = addFood;

        // Add listener for "Return/Enter" key
        quantityInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                addFood();
            }
        });
    }

    function updateAggregatedValues(protein, carbs, fat, calories) {
        totalProtein += protein;
        totalCarbs += carbs;
        totalFat += fat;
        totalCalories += calories;

        document.getElementById('total-protein').textContent = totalProtein.toFixed(2);
        document.getElementById('total-carbs').textContent = totalCarbs.toFixed(2);
        document.getElementById('total-fat').textContent = totalFat.toFixed(2);
        document.getElementById('total-aggregated-calories').textContent = totalCalories.toFixed(2);

        updateFoodOptions();
    }

    // Close the modal
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', function(event) {
        const quantityModal = document.getElementById('quantityModal');
        const mealModal = document.getElementById('mealModal');
        if (event.target === quantityModal || event.target === mealModal) {
            event.target.style.display = 'none';
        }
    });

    // Close the modal when pressing the Escape key
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const quantityModal = document.getElementById('quantityModal');
            const mealModal = document.getElementById('mealModal');
            quantityModal.style.display = 'none';
            mealModal.style.display = 'none';
        }
    });
});