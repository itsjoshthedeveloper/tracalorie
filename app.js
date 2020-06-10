// Item Controller
const ItemCtrl = (function () {
  // Item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data structure / state
  const data = {
    items: [],
    currentItem: null,
    totalCalories: 0,
  };

  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      // Create ID
      let ID = 0;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Create new Item
      const newItem = new Item(ID, name, calories);
      // Add to data structure
      data.items.push(newItem);
      return newItem;
    },
    getTotalCalories: function () {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },
    setCurrentItem: function (itemID) {
      if (itemID === null) {
        data.currentItem = null;
      } else {
        data.items.forEach((item) => {
          if (item.id === itemID) {
            data.currentItem = item;
          }
        });
      }
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    updateItem: function (name, calories) {
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          data.currentItem = item;
        }
      });
    },
    deleteItem: function (itemID) {
      const ids = data.items.map((item) => {
        return item.id;
      });
      const i = ids.indexOf(itemID);
      data.items.splice(i, 1);
    },
    clearItems: function () {
      data.items = [];
    },
    logData: function () {
      console.log(data);
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: document.querySelector('#item-list'),
    addBtn: document.querySelector('.add-btn'),
    updateBtn: document.querySelector('.update-btn'),
    deleteBtn: document.querySelector('.delete-btn'),
    backBtn: document.querySelector('.back-btn'),
    clearBtn: document.querySelector('.clear-btn'),
    itemName: document.querySelector('#item-name'),
    itemCalories: document.querySelector('#item-calories'),
    totalCalories: document.querySelector('.total-calories'),
  };

  return {
    populateItemsList: function (items) {
      let html = '';
      items.forEach((item) => {
        html += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
        `;
      });
      UISelectors.itemList.innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: UISelectors.itemName.value,
        calories: parseInt(UISelectors.itemCalories.value),
      };
    },
    addItem: function (item) {
      UISelectors.itemList.style.display = 'block';
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      UISelectors.itemList.insertAdjacentElement('beforeend', li);
    },
    clearInputs: function () {
      UISelectors.itemName.value = '';
      UISelectors.itemCalories.value = '';
    },
    updateTotalCalories: function (totalCalories) {
      UISelectors.totalCalories.textContent = String(totalCalories);
    },
    clearEditState: function () {
      UICtrl.clearInputs();
      UISelectors.addBtn.style.display = 'inline';
      UISelectors.updateBtn.style.display = 'none';
      UISelectors.deleteBtn.style.display = 'none';
      UISelectors.backBtn.style.display = 'none';
    },
    showEditState: function (item) {
      // Set inputs to current item
      UISelectors.itemName.value = item.name;
      UISelectors.itemCalories.value = item.calories;
      // Change buttons
      UISelectors.addBtn.style.display = 'none';
      UISelectors.updateBtn.style.display = 'inline';
      UISelectors.deleteBtn.style.display = 'inline';
      UISelectors.backBtn.style.display = 'inline';
    },
    updateItem: function (item) {
      document.querySelector(`#item-${item.id}`).innerHTML = `
        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
    },
    deleteItem: function (itemID) {
      document.querySelector(`#item-${itemID}`).remove();
    },
    clearItems: function () {
      UISelectors.itemList.innerHTML = '';
    },
    getUISelectors: function () {
      return UISelectors;
    },
    hideList: function () {
      UISelectors.itemList.style.display = 'none';
    },
  };
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function () {
    // Get UI selectors
    const UISelectors = UICtrl.getUISelectors();
    // Event listeners
    UISelectors.addBtn.addEventListener('click', addItem);
    UISelectors.updateBtn.addEventListener('click', updateItem);
    UISelectors.deleteBtn.addEventListener('click', deleteItem);
    UISelectors.backBtn.addEventListener('click', UICtrl.clearEditState);
    UISelectors.clearBtn.addEventListener('click', clearItems);
    UISelectors.itemList.addEventListener('click', editItem);
    // Disable submit on enter
    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
  };

  // Add item to data structure
  const addItem = function (e) {
    // Get item input
    const input = UICtrl.getItemInput();
    if (input.name !== '' && !isNaN(input.calories)) {
      // Add item to data
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI
      UICtrl.addItem(newItem);
      // Update total calories
      UICtrl.updateTotalCalories(ItemCtrl.getTotalCalories());
      // Clear inputs
      UICtrl.clearInputs();
    }
    e.preventDefault();
  };

  // Edit item
  const editItem = function (e) {
    if (e.target.classList.contains('edit-item')) {
      const itemID = parseInt(
        e.target.parentElement.parentElement.id.slice(-1)
      );
      ItemCtrl.setCurrentItem(itemID);
      UICtrl.showEditState(ItemCtrl.getCurrentItem());
    }
  };

  // Update item
  const updateItem = function (e) {
    const input = UICtrl.getItemInput();
    ItemCtrl.updateItem(input.name, input.calories);
    UICtrl.updateItem(ItemCtrl.getCurrentItem());
    exitEditState();
    e.preventDefault();
  };

  // Delete item
  const deleteItem = function (e) {
    const itemID = ItemCtrl.getCurrentItem().id;
    ItemCtrl.deleteItem(itemID);
    UICtrl.deleteItem(itemID);
    exitEditState();
    if (checkList()) {
      // Hide item list
      UICtrl.hideList();
    }
    e.preventDefault();
  };

  // Clear items
  const clearItems = function (e) {
    ItemCtrl.clearItems();
    UICtrl.clearItems();
    exitEditState();
    UICtrl.hideList();
    e.preventDefault();
  };

  // Check if list is empty
  const checkList = function () {
    // Get items from data structure
    const items = ItemCtrl.getItems();
    return items.length === 0;
  };

  // Exit edit state
  const exitEditState = function () {
    UICtrl.updateTotalCalories(ItemCtrl.getTotalCalories());
    ItemCtrl.setCurrentItem(null);
    UICtrl.clearEditState();
  };

  return {
    init: function () {
      // Clear edit state
      UICtrl.clearEditState();
      if (checkList()) {
        // Hide item list
        UICtrl.hideList();
      } else {
        // Populate item list with items
        UICtrl.populateItemsList(items);
      }
      // Update total calories
      UICtrl.updateTotalCalories(ItemCtrl.getTotalCalories());
      // Load listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

// Initialize app
App.init();
