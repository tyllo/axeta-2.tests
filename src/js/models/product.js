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