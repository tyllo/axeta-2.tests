Тестовое задание!
===================

Страница сверстана на основе css фрейморка [concise](http://concisecss.com) и библиотек [jQuery](http://jquery.com), [underscore](http://underscorejs.org) и [backbone)](http://backbonejs.org).
 Можно добавлять и удалять товары из корзины. Автоматически считается сумма чека и количество добавленных в корзину товаров. Можно добавить любое количество одного товара или скорректировать количество в поле ввода(в поле можно вводить только числа). Данные корзины хранятся между сессиями браузера в [sessionStorage](https://developer.mozilla.org/ru/docs/Web/API/Window/sessionStorage).
 При удалении/добавлении товара в корзину запрос дублируется на сервере CRUD методами.
 

----------
###Установка

- Установите [Nodejs](https://nodejs.org) и пакетный менеджер [npm](https://www.npmjs.com)
- Установите пакеты
```
$ npm install -g bower gulp
```
- Клонируйте репозиторий или скопируйте на диск и [разархивируйте](https://github.com/tyllo/axeta-2.tests/archive/master.zip):
```
$ git clone git@github.com:tyllo/axeta-2.tests.git axeta#2
```
-  Зайдите в папку проекта
```
$ cd axeta#2
```
- Установите все зависимости проекта,
автоматом создаться папка [build](https://github.com/tyllo/axeta-2.tests/tree/gh-pages) с собранным проектом
```
$ npm install
```

----------
###Разработка

- Пересобрать проект:
```
$ gulp build
```
- Запустить вотчеры и локальный вебсервер localhost:3000:
```
$ gulp
```
----------
###Особенности
В проекте используются **препроцессоры** [jade](http://jade-lang.com) и [sass](http://sass-lang.com), **менеджер пакетов** [bower](http://bower.io) и **сборщик проектов** [Gulp](http://gulpjs.com). 
