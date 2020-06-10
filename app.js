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
    items: [{ id: 0, name: 'Boba', calories: 300 }],
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
      data.items.push(new Item(ID, name, calories));
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
    getUISelectors: function () {
      return UISelectors;
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
      ItemCtrl.addItem(input.name, input.calories);
      ItemCtrl.logData();
    }
    e.preventDefault();
  };

  return {
    init: function () {
      // Get items from data structure
      const items = ItemCtrl.getItems();

      // Populate item list with items
      UICtrl.populateItemsList(items);

      // Load listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

// Initialize app
App.init();
