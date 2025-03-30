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
    });

    list.appendChild(li);
    input.value = '';
    quantityInput.value = '1';
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

// Modify the moveItem function to check after moving
function moveItem(item) {
    const groceryList = document.getElementById('grocery-list');
    const boughtList = document.getElementById('bought-list');
    
    if (item.parentElement === groceryList) {
        boughtList.appendChild(item);
    } else {
        groceryList.appendChild(item);
    }
    checkAllBought();
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