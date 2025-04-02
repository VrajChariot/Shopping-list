// url-handler.js
function populateListFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const toBuy = urlParams.get('toBuy');
    const bought = urlParams.get('bought');

    function addItemsToList(list, itemsString, bought) {
        if (itemsString) {
            const items = itemsString.split(';');
            items.forEach(itemString => {
                const [itemName, quantity] = itemString.split('(');
                const quantityValue = quantity ? quantity.slice(0, -1) : 1; // Remove the closing parenthesis

                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="item-content">
                        <span class="item-name">${itemName.trim()}</span>
                        <span class="quantity">(${quantityValue})</span>
                    </div>
                    <button class="delete-btn">×</button>
                `;

                // Add click handler for bought status
                li.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('delete-btn')) {
                        moveItem(li);
                    }
                });

                // Add delete handler
                li.querySelector('.delete-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    li.remove();
                });

                if (bought) {
                    li.classList.add('bought');
                }

                list.appendChild(li);
            });
        }
    }

    // Check if we are on the shopping page before trying to get the lists
    if (document.getElementById('grocery-list') && document.getElementById('bought-list')) {
        const groceryList = document.getElementById('grocery-list');
        const boughtList = document.getElementById('bought-list');

        addItemsToList(groceryList, toBuy, false);
        addItemsToList(boughtList, bought, true);

        // Activate share button after populating list
        if (typeof activateShareButton === 'function') {
            activateShareButton();
        }
        if (typeof checkShareButtonActivation === 'function') {
            checkShareButtonActivation();
        }
    } else {
        // If not on the shopping page, redirect
        if (toBuy || bought) {
            window.location.href = 'shopping.html' + window.location.search;
        }
    }
}

// Call populateListFromUrl on page load
window.addEventListener('load', () => {
    populateListFromUrl();
});