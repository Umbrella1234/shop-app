Что сделано: всё сделано

Нужно было сделать:

Необходимо реализовать:
- Фронт приложения для страниц каталога со списком товаров и корзины с помощью vue.js, либо нативного js
- REST API для получения данных и действий на страницах (структура ниже) 

## Стек технологий
- Бэкенд фреймворк: koa или express
- База данных: lowdb
- Фронтенд фреймворк: vue.js, либо нативный js (es6 + babel приветствуются)
- HTTP client: axios приветствуется, XMLHttpRequest допускается

## Общие требования
- Результатом должна быть ссылка на публичный репозиторий с исходным кодом и файлами:
    - README.md в котором описана инструкция как запускать проект.
    - TODO.md список того, что нужно было сделать и то что реально было сделано.
- Механизмы Cookies и Local Storage для хранения и обработки данных не используются.
- Для интерактивных элементов добавить эффекты по своему усмотрению (transition/hover/focus ит.д.).
- Для форматирования кода используется https://prettier.io/ + пресет standardjs.
- Все артефакты текстового типа (.html, .js, .css, .json и т.п.) реализуются в кодировке UTF-8.
- Глобальные переменные и функции (в контексте window) не определяются и не используются .
- Все сообщения на сервере и на клиенте должны хранится в отдельных файлах .
- Предусмотреть прелоадер для всех асинхронных действий.
- Проект строится с использованием GIT, все коммиты должны быть строго на английском языке и отражать суть того, что было сделано.
- Форматирование цен: 
    - Если число меньше 10 000, то пробел не нужен (1, 10, 100, 1000) 
    - Если число больше 10 000, то пробел после каждых 3 символов (10 000, 100 000, 1 000 000)
    - Учесть, что стоимость товара может быть дробная. Разделитель дробной части - запятая, кол-во знаков после запятой - 2

*Все оформительские стили остаются на усмотрение кандидата, структурно результат должен выглядеть как на прототипе*.


## Структура REST API

*UserId - берётся из cookie и докладывается в каждый запрос стандартным методом передачи через заголовки. Если он отсутствует, то генерируется hash длиной 16 символов на клиенте и записывается в cookie*

- `[GET] /api/v1/cart/get`, на получение товаров в корзине по userId.

- `[POST] /api/v1/cart/update`, на обновление количества товаров в корзине 
    - Принимает список id продуктов и текущее их количество в формате объекта:
    `{ [Id]: quantity }`
    - В ответ присылает флаг успешности выполнения и обновленный список товаров
    - Если quantity = 0, то товар необходимо удалить.

- `[POST] /api/v1/cart/add?productId=12334`, для добавления товара в корзину 
    - Принимает 1 параметр productId, в ответ присылает сообщение, что товар был добавлен в корзину.

- `[POST] /api/v1/cart/delete?productId=12334`, для удаления товара из корзины
    - Принимает 1 параметр productId, в ответ присылает сообщение, что товар был добавлен в корзину 


## Структура проекта

- **Список товаров** (mysite.ru/catalog) - содержит 10-20 товаров с ценой и возможностью добавить их в корзину и виджет, отображающий общее количество и цену товаров в корзине.

Требования:
- Кнопки добавления в корзину должны менять состояние в зависимости от их наличия в корзине.
- Предусмотреть сообщение о том что товар добавлен в корзину или удален 

![Мокап виджета корзины](https://ozon-st.cdn.ngenix.net/graphics/subscribe/pl/181001_tz_image2.png)
*Мокап виджета корзины*

![Мокап списка товаров](https://ozon-st.cdn.ngenix.net/graphics/subscribe/pl/181001_tz_image3.jpg)
*Мокап списка товаров*

- **Корзина** (mysite.ru/cart) - выводит список товаров, добавленных в корзину, с возможностью их удаления и изменения количества и их общую цену. Также должна быть предусмотрена система скидок в зависимости от общей стоимости товаров.

Требования:
- Кнопка “Удалить” удаляет 1 строку из таблицы, стоимость пересчитывается
- Кнопка “Удалить все” очищает всю таблицу 
- Предусмотреть функционал скидок, зашитых в код и не изменяемых пользователем. Для примера должны быть заполнены следующие скидки:
    - до 9999 рублей - 0% 
    - от 10 000 рублей - 5% 
    - от 15 000 рублей - 10% 
    - от 20 000 рублей и более - 15% 
- Если итоговая стоимость не попадает под скидку, то визуально в блоке “Итого”, только 1 строчка - Цена.
- Если итоговая стоимость попадает под скидку, то внешний вид как на прототипе, не забыть изменить значение скидки в строке 
- Стоимость для строки считается на скрипте когда товаров больше 0, товаров меньше 0 быть не может, но строку удалять не надо 

![Мокап корзины](https://ozon-st.cdn.ngenix.net/graphics/subscribe/pl/181001_tz_image1.png)
*Мокап корзины*
 
 
## Бонусная часть:

- Учесть, что стоимость товара может быть дробная. Разделитель дробной части - запятая, кол-во знаков после запятой - 2 
- Предусмотреть механизм работы кнопки “Оформить заказ” с отправкой данных на бекенд, и записью списка товаров, их количества и данных ФИО, email, дату заказа на сервере 
- Вывести список всех оформленных заказов на отдельной странице (mysite.ru/orders)
Каждый заказ должен содержать:
    - UserId, ФИО, Email, Дату заказа 
    - Список купленных товаров  
    - Размер скидки 
    - Общую стоимость
    - Если заказов более 10 предусмотреть пагинацию 
    - Предусмотреть поиск всех заказов по userId 
- Размер скидки должен хранится в отдельной структуре базы данных (json) и рассчитываться из общей схемы скидок + дополнительная скидка рассчитывается исходя из количества заказов 
    - от 2 заказов - 2% 
    - от 5 заказов - 5%
    - от 10 заказов и более - 8%