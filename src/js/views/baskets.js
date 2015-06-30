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
    $basketCost.text(basketCost + ' руб.');
    $basketCost.parent().removeClass('hide');
  },

  // если есть товары в корзине, посчитаем колличество позиций
  changeBasketAmount: function () {
    console.log('changeBasketAmount');
    var amount = this.collection.getBasketAmount();
    var $badge = $('#badge').text('').text(amount);
  }
});
