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
      data.items.push(newItem);
      return newItem;
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
    itemName: document.querySelector('#item-name'),
    itemCalories: document.querySelector('#item-calories'),
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
    UISelectors.addBtn.addEventListener('click', addItem);
  };

  // Add item to data structure
  const addItem = function (e) {
    // Get item input
    const input = UICtrl.getItemInput();
    if (input.name !== '' && input.calories !== '') {
      // Add item to data
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI
      UICtrl.addItem(newItem);
      // Clear inputs
      UICtrl.clearInputs();
    }
    e.preventDefault();
  };

  return {
    init: function () {
      // Get items from data structure
      const items = ItemCtrl.getItems();

      if (items.length === 0) {
        // Hide item list
        UICtrl.hideList();
      } else {
        // Populate item list with items
        UICtrl.populateItemsList(items);
      }

      // Load listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

// Initialize app
App.init();
