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
      { id: 0, name: 'Steak Dinner', calories: 1200 },
      { id: 1, name: 'Cookie', calories: 400 },
      { id: 2, name: 'Eggs', calories: 300 },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  return {
      getItems: function () {
        return data.items
      },
      addItem : function (name , calories) {
        let ID
        if (data.items.length > 0) {
            ID = data.items[data.items.length - 1].id + 1 
        }else {
            ID = 0
        }

         calories = parseInt(calories)

         newItem = new Item (ID , name , calories)

         data.items.push(newItem)

         return newItem
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
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
    }

    return {
        populateItemList: function (items) {
            let html = '' ;
            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>Steak Dinner: ${item.name} </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="fa fa-pencil"></i>
                </a>
              </li>`
            });

            document.querySelector(UISelectors.itemList).innerHTML = html
        },

        getInput : function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },

        getSelectors: function () {
            return UISelectors
        }
    }
})();

// App controller

const App = (function (ItemCtrl, UICtrl) {
    const loadEvent = function(){
        const UISelectors = UICtrl.getSelectors()

        document.querySelector(UISelectors.addBtn).addEventListener('click' , itemAddSubmit)
    }

    const itemAddSubmit = function (e) {
        e.preventDefault()

        const input = UICtrl.getInput()
        
        if(input.name !== '' && input.calories !== '') {
          const newItem =  ItemCtrl.addItem(input.name , input.calories)
        }
    }


    return {
        init: function() {
            const item = ItemCtrl.getItems()

            UICtrl.populateItemList(item)

            loadEvent()
        }
    }

})(ItemCtrl, UICtrl);

App.init()
