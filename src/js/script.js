
/***********************************************
    Переопределим шаблонизатор underscore
==============================================*/

_.templateSettings = {
  evaluate:    /\{=(.+?)\}\}/g,
  interpolate: /\{\{(.+?)\}\}/g,
  escape:      /\{\{-(.+?)\}\}/g
};

/***********************************************
  модель, коллекция и преставления продуктов
      в один файл собирает gulp-rigger
    а нужно сибирать commonJS или RequireJS
==============================================*/

//= models/product.js
//= collections/product.js
//= views/product.js
//= views/products.js

/***********************************************
   модель, коллекция и преставления корзины
      в один файл собирает gulp-rigger
    а нужно сибирать commonJS или RequireJS
==============================================*/

//= models/basket.js
//= collections/basket.js
//= views/basket.js
//= views/baskets.js

/***********************************************
                 приложение!!!
==============================================*/

var App = {
  Model: {},
  Collection: {},
  View: {},

  // инициализируем приложение
  init: function () {
    // создадим диспетчер, через него
    // будут ходить сообщения между вьюшками
    this.vent = _.extend({}, Backbone.Events);
    // инициализируем витрину
    this.initProducts();
    // инициализируем корзину
    this.initBasket();
  },

  // инициализируем витрину с товарами
  initProducts: function () {
    // коллекция продуктов,
    this.Collection.Product = new CollectionProduct(null, {
      model: ModelProduct,
      // добавим диспетчер в коллекцию
      vent: this.vent
    });
    // когда коллекция товаров сфетчиться с сервера,
    // сработает рендер товаров
    this.View.Products = new ViewCollectionProduct ({
      collection: this.Collection.Product,
      // добавим диспетчер во вью
      vent: this.vent
    });
  },

  // инициализируем корзину
  initBasket: function () {
    // коллекция корзины
    this.Collection.Basket = new CollectionBasket(null, {
      model: ModelBasketItem,
      // добавим диспетчер в коллекцию
      vent: this.vent
    });
    // вью корзины
    this.View.Busket = new ViewCollectionBasket ({
      collection: this.Collection.Basket,
    }, {
      // добавим диспетчер в коллекцию
      vent: this.vent
    });
  },
};

/***********************************************
             Запускаем работу
==============================================*/
// запускаем приложение
App.init();
