// Storage controller

// Item controller
const ItemCtrl = (function () {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  const data = {
    items: [
      //   { id: 0, name: 'Steak Dinner', calories: 1200 },
      //   { id: 1, name: 'Cookie', calories: 400 },
      //   { id: 2, name: 'Eggs', calories: 300 },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      calories = parseInt(calories);

      newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;
    },

    setCurrentItem: function(item) {
        data.currentItem = item
    },

    getTotalCalories: function () {
      let total = 0;

      data.items.forEach((item) => {
        total += item.calories;
      });
      data.totalCalories = total;

      return data.totalCalories;
    },

    getItemById: function (id) {
        let found = null

        data.items.forEach(item => {
            if(item.id == id){
                found = item
            }
        })
        return found
    },

    getCurrentItem:function () {
        return data.currentItem
    },

    logData: function () {
      return data;
    },
  };
})();

// UI controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
  };

  return {
    populateItemList: function (items) {
      let html = '';
      items.forEach((item) => {
        html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`;
      });

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    addListItem: function (item) {
      document.querySelector(UISelectors.itemList).style.display = 'block';

      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;

      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;

      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },

    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: function () {
        document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
        document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
        UICtrl.showEditState()
    },

    getInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },

    clearEditState : function () {
        UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';

    },
    showEditState : function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';

    },

    getSelectors: function () {
      return UISelectors;
    },
  };
})();

// App controller

const App = (function (ItemCtrl, UICtrl) {
  const loadEvent = function () {
    const UISelectors = UICtrl.getSelectors();

    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);

      document.querySelector(UISelectors.itemList).addEventListener('click' , itemUpdateSubmit)
  };

  const itemAddSubmit = function (e) {
    e.preventDefault();

    const input = UICtrl.getInput();

    if (input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      UICtrl.addListItem(newItem);

      const totalCalories = ItemCtrl.getTotalCalories();

      UICtrl.showTotalCalories(totalCalories);

      UICtrl.clearInput();
    }
  };

  const itemUpdateSubmit = function(e) {
      
      if(e.target.classList.contains('edit-item')){
        const listId = e.target.parentNode.parentNode.id

        let [string ,id] = listId.split('-')

        id = Number(id)

        const itemToEdit = ItemCtrl.getItemById(id)

        ItemCtrl.setCurrentItem(itemToEdit)

        UICtrl.addItemToForm()
    }
        e.preventDefault()
  }

  return {
    init: function () {
      UICtrl.clearEditState()

      const item = ItemCtrl.getItems();

      if (item.length === 0) {
        UICtrl.hideList;
      } else {
        UICtrl.populateItemList(item);
      }

      const totalCalories = ItemCtrl.getTotalCalories();

      UICtrl.showTotalCalories(totalCalories);

      loadEvent();
    },
  };
})(ItemCtrl, UICtrl);

App.init();
