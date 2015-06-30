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
        alert("Ошибка связи с сервером, попробуйте перегрузить страницу");
      },
    });
  },

  // При добавлении модели сортируем
  // продукты в алфавитном порядке
  comparator: function (contact) {
    return contact.get('title')||'';
  },
});
