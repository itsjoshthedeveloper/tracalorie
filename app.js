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
})();

// UI Controller
const UICtrl = (function () {
  //
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
  return {
    init: function () {
      console.log('Initializing app...');
    },
  };
})(ItemCtrl, UICtrl);

// Initialize app
App.init();
