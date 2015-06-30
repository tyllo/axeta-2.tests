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
