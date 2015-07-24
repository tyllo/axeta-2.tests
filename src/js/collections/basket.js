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
