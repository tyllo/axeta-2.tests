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
