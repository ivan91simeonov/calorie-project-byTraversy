// Storage controller

const StorageCtrl = (function () {
    return {
        storeItem: function (item) {
            let items ;

            if(localStorage.getItem('items') === null){
                items = [];
                items.push(item)
                localStorage.setItem('items' , JSON.stringify(items))
            }else{
                items = JSON.parse(localStorage.getItem('items'))
                items.push(item)
                localStorage.setItem('items' , JSON.stringify(items))
            }
        },

        getItemsFromStorage : function () {
            let items ;
            if(localStorage.getItem('items') === null) {
                items = []
            }else{
                items = JSON.parse(localStorage.getItem('items'))

            }
            return items;
        }
    }
})()

// Item controller
const ItemCtrl = (function () {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  const data = {
    // items: [
    //   //   { id: 0, name: 'Steak Dinner', calories: 1200 },
    //   //   { id: 1, name: 'Cookie', calories: 400 },
    //   //   { id: 2, name: 'Eggs', calories: 300 },
    // ],
    items: StorageCtrl.getItemsFromStorage(),
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

    setCurrentItem: function (item) {
      data.currentItem = item;
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
      let found = null;

      data.items.forEach((item) => {
        if (item.id == id) {
          found = item;
        }
      });
      return found;
    },

    updateItem: function (name, calories) {
      calories = parseInt(calories);

      let found = null;

      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function(id) {
      const  ids = data.items.map(item => {
          return item.id
      })

      const index = ids.indexOf(id)

      data.items.splice(index ,  1)
    },

    clearAllItems: function(){
        data.items = []
    },

    getCurrentItem: function () {
      return data.currentItem;
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
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    clearBtn: '.clear-btn'
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

    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems = Array.from(listItems);

      listItems.forEach((listItem) => {
        const itemId = listItem.getAttribute('id');

        if (itemId === `item-${item.id}`) {
          document.querySelector(
            `#${itemId}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>`;
        }
      });
    },

    deleteListItem : function (id) {
        const itemId = `#item-${id}`

        const item = document.querySelector(itemId)
        item.remove()
    },

    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    removeItems: function () {
        let listItems = document.querySelectorAll(UISelectors.listItems)

        listItems = Array.from(listItems)

        listItems.forEach(item => {
            item.remove()
        })
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

    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function () {
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

const App = (function (ItemCtrl, StorageCtrl ,  UICtrl) {
  const loadEvent = function () {
    const UISelectors = UICtrl.getSelectors();

    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);

    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick);

    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', itemUpdateSubmit);

    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', UICtrl.clearEditState);

      document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', itemDeleteSubmit);

      document
      .querySelector(UISelectors.clearBtn)
      .addEventListener('click', clearAllItemsClick);
  };

  const itemAddSubmit = function (e) {
    e.preventDefault();

    const input = UICtrl.getInput();

    if (input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      UICtrl.addListItem(newItem);

      const totalCalories = ItemCtrl.getTotalCalories();

      UICtrl.showTotalCalories(totalCalories);

      StorageCtrl.storeItem(newItem)

      UICtrl.clearInput();
    }
  };

  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      const listId = e.target.parentNode.parentNode.id;

      let [string, id] = listId.split('-');

      id = Number(id);

      const itemToEdit = ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  const itemUpdateSubmit = function (e) {
    e.preventDefault();

    const input = UICtrl.getInput();

    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    UICtrl.updateListItem(updatedItem);

    const totalCalories = ItemCtrl.getTotalCalories();

    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
  };

  const itemDeleteSubmit = function (e) {
    e.preventDefault()

    const currentItem = ItemCtrl.getCurrentItem()

    ItemCtrl.deleteItem(currentItem.id)

    UICtrl.deleteListItem(currentItem.id)

    const totalCalories = ItemCtrl.getTotalCalories();

    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
  };

  const clearAllItemsClick = function (){

    ItemCtrl.clearAllItems()

    const totalCalories = ItemCtrl.getTotalCalories();

    UICtrl.showTotalCalories(totalCalories);

    UICtrl.removeItems()

  };


  return {
    init: function () {
      UICtrl.clearEditState();

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
})(ItemCtrl,StorageCtrl, UICtrl);

App.init();
