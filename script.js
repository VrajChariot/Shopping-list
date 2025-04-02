function addItem() {
    const input = document.getElementById('grocery-input');
    const quantityInput = document.getElementById('quantity-input');
    const list = document.getElementById('grocery-list');

    if (input.value.trim() === '') {
        alert('Please enter an item!');
        return;
    }

    const li = document.createElement('li');
    const quantity = quantityInput.value || 1;

    li.innerHTML = `
        <div class="item-content">
            <span class="item-name">${input.value}</span>
            <span class="quantity">(${quantity})</span>
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
        updateLocalStorage(); // Update local storage on delete
    });

    list.appendChild(li);
    input.value = '';
    quantityInput.value = '1';

    // Activate share button when adding an item
    activateShareButton();
    updateLocalStorage(); // Update local storage on add
}

// Check if all items are bought
function checkAllBought() {
    const groceryList = document.getElementById('grocery-list');
    const endBtn = document.getElementById('end-btn');

    if (groceryList.children.length === 0) {
        endBtn.classList.add('active');
        endBtn.onclick = () => {
            alert('Shopping completed! Thank you for shopping with us!');
            window.location.href = 'index.html';
        };
    } else {
        endBtn.classList.remove('active');
    }
}

function moveItem(item) {
    const groceryList = document.getElementById('grocery-list');
    const boughtList = document.getElementById('bought-list');

    if (item.parentElement === groceryList) {
        boughtList.appendChild(item);
    } else {
        groceryList.appendChild(item);
    }
    checkAllBought();
    updateLocalStorage(); // Update local storage on move
}

// Add observer to watch for list changes
const groceryList = document.getElementById('grocery-list');
new MutationObserver(checkAllBought).observe(groceryList, { childList: true });

// Allow adding items with Enter key
document.getElementById('grocery-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addItem();
    }
});

function shareList() {
    const groceryList = document.getElementById('grocery-list');
    const boughtList = document.getElementById('bought-list');

    // Function to encode list items
    function encodeListItems(list) {
        let items = [];
        for (let i = 0; i < list.children.length; i++) {
            const item = list.children[i];
            const itemName = item.querySelector('.item-name').textContent;
            const quantity = item.querySelector('.quantity').textContent;
            items.push(`${itemName} ${quantity}`);
        }
        return items.join(';'); // Using semicolon as a separator
    }

    const toBuy = encodeListItems(groceryList);
    const bought = encodeListItems(boughtList);

    // Construct the URL
    let baseUrl = window.location.origin + window.location.pathname;
    // Remove trailing 'shopping.html' if present
    baseUrl = baseUrl.replace(/shopping\.html$/, '');
    const shareableUrl = `${baseUrl}?toBuy=${encodeURIComponent(toBuy)}&bought=${encodeURIComponent(bought)}`;

    // Share the URL
    if (navigator.share) {
        navigator.share({
            title: 'Shopping List',
            url: shareableUrl,
        })
            .then(() => console.log('Shared successfully'))
            .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareableUrl)
            .then(() => alert('Link copied to clipboard!'))
            .catch(err => console.error('Error copying text: ', err));
    }
}

// Add event listener to the share button
document.getElementById('share-btn').addEventListener('click', shareList);

function activateShareButton() {
    const shareBtn = document.getElementById('share-btn');
    shareBtn.classList.add('active');
}

function checkShareButtonActivation() {
    const groceryList = document.getElementById('grocery-list');
    const boughtList = document.getElementById('bought-list');
    const shareBtn = document.getElementById('share-btn');

    if (groceryList.children.length > 0 || boughtList.children.length > 0) {
        shareBtn.classList.add('active');
    } else {
        shareBtn.classList.remove('active');
    }
}

// Call checkShareButtonActivation on page load
window.onload = checkShareButtonActivation;

// Also call checkShareButtonActivation after moving an item
moveItem = (function () {
    var cached_function = moveItem;
    return function () {
        var result = cached_function.apply(this, arguments); // use .apply() to call it
        checkShareButtonActivation();
        return result;
    };
})();

function updateLocalStorage() {
    const groceryList = document.getElementById('grocery-list');
    const boughtList = document.getElementById('bought-list');

    const groceryItems = Array.from(groceryList.children).map(item => {
        const itemName = item.querySelector('.item-name').textContent;
        const quantity = item.querySelector('.quantity').textContent;
        return { name: itemName, quantity: quantity };
    });

    const boughtItems = Array.from(boughtList.children).map(item => {
        const itemName = item.querySelector('.item-name').textContent;
        const quantity = item.querySelector('.quantity').textContent;
        return { name: itemName, quantity: quantity };
    });

    localStorage.setItem('groceryList', JSON.stringify(groceryItems));
    localStorage.setItem('boughtList', JSON.stringify(boughtItems));
}