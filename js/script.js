
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

/***********************************************
               модель товара
==============================================*/

// Модель товара
var ModelProduct = Backbone.Model.extend({
  defaults: {
    title:'',
    text: '',
    price: 0
  },
});
/***********************************************
               Коллекция товаров
==============================================*/

var CollectionProduct = Backbone.Collection.extend({

  url: 'api/product/',

  initialize: function (models, options) {
    this.vent = options.vent;
    // запросим модели с сервера
    this.fetch({
      remove: false,
      // TODO: здесь нужно обработать запрос с сервера
      success: function (collection, response, options) {
        console.log('success fetch')
      },
      error: function (collection, response, options) {
        alert("Error server");
      },
    });
  },

  // При добавлении модели сортируем
  // продукты в алфавитном порядке
  comparator: function (contact) {
    return contact.get('title')||'';
  },
});
/***********************************************
            Представление товара
==============================================*/

var ViewProduct = Backbone.View.extend({

  tagName: 'div',

  // передадим в шаблонизатор шаблон с товаром
  template: _.template( $('#product-template').html() ),

  events: {
    // добавим товар в корзину
    'click button[name="basket"]': 'addBasket',
  },

  initialize: function(options) {
    this.vent = options.vent;
  },

  // рендерим товар и возвращаем его
  render: function () {
    var model = this.model.toJSON();
    var template = this.template( model );
    this.$el.html( template );
    return this;
  },

  // передадим модель в корзину
  // TODO: нужно передать модель в диспетчер
  addBasket: function(e) {
    console.log('addBasket');
    // триггер на общем диспетчере
    // через него передаем модель
    this.vent.trigger('add:product', this.model);
  },
});
/***********************************************
        Представление коллекции товаров
==============================================*/

// Представление коллекции товаров
var ViewCollectionProduct = Backbone.View.extend({

  // привяжем вью коллекции к существующему элементу
  el: '#products-container',

  // Инициализация
  initialize: function (options) {
    this.vent = options.vent;
    // как только коллекция обновится, запускаем рендер
    this.listenTo(this.collection, 'add', this.renderProduct);
  },

  // Выводим все товары, перебрав коллекцию
  // при fetch с сервера не понадобиться!!!
  render: function () {
    this.collection.each(function (item) {
      this.renderProduct(item);
    }, this);

    return this;
  },
  // по одному создадим представление товара
  // и добавим к привязанному Элементу
  renderProduct: function (item) {
    console.log('renderProduct: ' + item.get('title'));
    var viewProduct = new ViewProduct({
      model: item,
      // добавим диспетчер во вью
      vent: this.vent
    });

    this.$el.append( viewProduct.render().el );
    return this;
  }
});

/***********************************************
   модель, коллекция и преставления корзины
      в один файл собирает gulp-rigger
    а нужно сибирать commonJS или RequireJS
==============================================*/

/***********************************************
               Модель заказа
==============================================*/

var ModelBasketItem = Backbone.Model.extend({
  defaults: {
    title:'',
    amount: 1,
    price: 0,
    text: ''
  },

  // изменим количество заказанных товаров
  changeAmountOne: function () {
    this.set({amount: this.get('amount') + 1});
  },

  // изменим количество заказанных товаров
  changeAmount: function (value) {
    this.set({amount: parseInt(value)});
  }
});
/***********************************************
            Коллекция корзины
==============================================*/

var CollectionBasket = Backbone.Collection.extend({

  // какой-то url для бекенда для удалениия
  // или сохраения товаров в заказе
  url: 'api/idUser/basket/',

  initialize: function (models, options) {
    // попытаемся достать сессию с данными
    this.collectionGet();
    this.vent = options.vent;
    // через общий диспетчер слушаем событие
    // добавления в корзину нового продукта
    this.listenTo(this.vent, 'add:product', this.addProduct);
    // слушаем изменение коллекции и сохраняем/меняем + sessionStorage
    this.listenTo(this, 'add remove change', this.collectionSave);
  },

  // При добавлении модели сортируем
  // заказ в алфавитном порядке
  comparator: function (contact) {
    return contact.get('title')||'';
  },
  // обрабатывает продукт, что бы добавить его в корзину
  addProduct: function (product) {
    console.log('addProduct');
    // если модель существует в коллекции, то amount++
    var id = product.get('id');
    var model = this.get(id);
    if ( model !== undefined ) {
      model.changeAmountOne();
    } else {
      this.add(product.toJSON());
    }
  },

  // переберем все модели и посчитаем стоимость всей корзины
  getBasketCost: function () {
    return this.reduce(function(price, model){
      return (price + model.get('amount')*model.get('price'));
    }, 0).toFixed(2);
  },

  getBasketAmount: function () {
    var amount = this.reduce(function(amount, model){
      return amount + model.get('amount');
    }, 0);
    // что бы не отображался ноль, вернем пустую строку
    // TODO: эту логику нужно перенести в темплейт??
    if (amount == 0 ) return;
    return amount;
  },

  // при изменении или добавлении товара в корзину
  // сохраним на сервере и sessionStorage
  // https://developer.mozilla.org/ru/docs/Web/API/Window/sessionStorage
  collectionSave: function (model) {
    console.log('collectionSave');
    // сохраняем на сервер
    model.save();
    // сохраняем в sessionStorage
    var string = JSON.stringify(this.toJSON());
    sessionStorage.setItem('BasketCollection', string);
  },
  collectionGet: function () {
    console.log('collectionGet');
    // если есть сессия, то достанем ее
    if ( sessionStorage.getItem('BasketCollection') ) {
      var data = sessionStorage.getItem('BasketCollection');
      // console.log( JSON.parse(data) );
      this.add( JSON.parse(data) );
    };
  },
});
/***********************************************
          Представление заказа
==============================================*/

var ViewBasketItem = Backbone.View.extend({

  tagName: 'div',

  // передадим в шаблонизатор шаблон с заказом
  template: _.template( $('#basket-template').html() ),

  events: {
    // удалим заказ из корзину
    'click button[name="delete"]': 'deleteBasketItem',
    // слушаем изменение количества заказаного товара
    'focusout input[name="amount"]': 'changeAmountBasketItem',
  },

  // Инициализация
  initialize: function () {
    // при изменении модели перерисуем вью
    this.listenTo(this.model, 'change', this.render);
    // при удалении модели, удалим вью
    this.listenTo(this.model, 'destroy', this.remove);
  },

  // рендерим заказ и возвращаем его
  render: function () {
    console.log('render');
    var model = this.model.toJSON();
    var template = this.template( model );
    this.$el.html( template );
    // навесим обработчик на input
    this.amountHandler();
    return this;
  },

  // позволим вводить в поле только цифры
  amountHandler: function () {
    var $input = this.$el.find('input[name="amount"]');
    // возвращаем только цифры
    $input.keyup(function () {
      if (this.value != this.value.replace(/[^0-9\.]/g, '')) {
         this.value = this.value.replace(/[^0-9\.]/g, '');
      }
    });
  },

  // удалим заказ из корзины
  deleteBasketItem: function(e) {
    console.log('deleteBasketItem');
    this.model.destroy();
  },

  // слушаем изменение количества заказа
  // в поле ввода <input>
  changeAmountBasketItem: function(e) {
    console.log('changeAmountBasketItem');
    var value = $(e.target).val();
    this.model.changeAmount(value);
  },
});
/***********************************************
           Представление корзины
==============================================*/

var ViewCollectionBasket = Backbone.View.extend({

  // привяжем вью коллекции к существующему элементу
  el: '#basket-container',

  // Инициализация
  initialize: function () {
    // как только коллекция обновится, запускаем рендер
    this.listenTo(this.collection, 'add', this.renderBasketItem);
    // при изменении коллекции меняем общую стимость корзины
    this.listenTo(this.collection, 'change add remove', this.changeBasketCost);
    // при изменении коллекции меняем колисчество товаров
    this.listenTo(this.collection, 'change add remove', this.changeBasketAmount);
    this.render();
    // если есть товары, посчитаем общую сумму
    this.changeBasketCost();
    // если есть товары, посчитаем количество позиций
    this.changeBasketAmount();
  },

  // Выводим все заказы, перебрав коллекцию
  render: function () {
    this.collection.each(function (item) {
      this.renderBasketItem(item);
    }, this);

    return this;
  },

  // по одному создадим педставление заказа
  // и добавим к привязанному элементу
  renderBasketItem: function (item) {
    console.log('renderBasketItem');
    var viewBasketItem = new ViewBasketItem({model: item});
    // добавим диспетчер во вью
    viewBasketItem.vent = this.vent;
    this.$el.append( viewBasketItem.render().el );
    return this;
  },

  // если есть товары в корзине, посчитаем стоимось заказа
  changeBasketCost: function () {
    console.log('changeBasketCost');
    var $basketCost = $('#basket-cost');
    // если в коллекции пусто, спрячем графу Всего
    if (this.collection.length == 0) {
      console.log('В корзине пусто');
      $basketCost.parent().addClass('hide');
      return this;
    };
    var basketCost = this.collection.getBasketCost();
    $basketCost.text('$ ' + basketCost);
    $basketCost.parent().removeClass('hide');
  },

  // если есть товары в корзине, посчитаем колличество позиций
  changeBasketAmount: function () {
    console.log('changeBasketAmount');
    var amount = this.collection.getBasketAmount();
    var $badge = $('#badge').text('').text(amount);
  }
});

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