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
