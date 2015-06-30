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
    this.set({amount: value});
  }
});