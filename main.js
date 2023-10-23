/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/api/createRequest.js
const createRequest = async function () {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const response = await fetch(options.url, {
    method: options.method,
    body: JSON.stringify(options.data)
  });
  const json = await response.json();
  return json;
};
/* harmony default export */ const api_createRequest = (createRequest);
;// CONCATENATED MODULE: ./src/js/api/Api.js

class Api {
  constructor() {
    this.url = 'http://localhost:3000';
  }

  // Отправляем запрос на получение инстансов
  list(callback) {
    api_createRequest({
      url: `${this.url}/`,
      method: 'GET'
    }).then(result => {
      callback(result);
    }).catch(e => {
      console.error('Произошла ошибка: ', e);
    });
  }

  // Отправляем запрос на создание инстанса
  create() {
    api_createRequest({
      url: `${this.url}/`,
      method: 'POST'
    }).catch(e => {
      console.error('Произошла ошибка: ', e);
    });
  }

  // Отправляем запрос на удаение инстанса
  delete(id) {
    api_createRequest({
      url: `${this.url}/?id=${id}`,
      method: 'DELETE'
    }).catch(e => {
      console.error('Произошла ошибка: ', e);
    });
  }
}
;// CONCATENATED MODULE: ./src/js/InstanceView.js
class InstanceView {
  static drawInstance(_ref) {
    let {
      id,
      state
    } = _ref;
    const instance = document.createElement('div');
    instance.classList.add('instances__item', 'instance');
    instance.setAttribute('data-id', id);
    instance.innerHTML = `
      <p class="instance__id">${id}</p>
      <div class="instance__data status">
        <span class="status__text">Status:</span>
        <p class="status__state"> 
          <span class="status__circle status__circle_${state === 'stopped' ? 'red' : 'green'}"></span>
          ${state}
        </p>
      </div>
      <div class="instance__data actions">
        <span class="actions__text">Actions:</span>
        <div class="actions__buttons">
          <button type="button" class="actions__btn actions__btn-toggle">
            <img src="./images/${state === 'stopped' ? 'play' : 'pause'}.svg" alt="">
          </button>
          <button type="button" class="actions__btn actions__btn-delete">
            <img src="./images/delete.svg" alt="">
          </button>
        </div>
      </div>
    `;
    return instance;
  }
}
;// CONCATENATED MODULE: ./src/js/Dashboard.js


class Dashbord {
  constructor(container) {
    this.container = container;
    this.api = new Api();
    this.websocket = null;
    this.createInstance = this.createInstance.bind(this);
  }
  init() {
    this.bindToDOM();
    this.registerEvents();
    this.getInstances();
    this.websocket = new WebSocket('ws://localhost:3000/ws');
    this.subscribeOnEvents();
  }

  // Отправляем запрос на инстансы и отрисовываем их
  getInstances() {
    this.api.list(response => {
      if (response) {
        this.instances.innerHTML = '';
        response.data.forEach(item => {
          const instance = InstanceView.drawInstance(item);
          this.instances.append(instance);
        });
      }
    });
  }
  bindToDOM() {
    this.container.innerHTML = `
      <div class="dashboard__block instances">
        <h2 class="instances__title title">Your micro instances:</h2>
        <div class="instances__wrapper"></div>
        <button class="instances__btn-create">Create new instance</button>
      </div>
      <div class="dashboard__block worklog">
        <h2 class="worklog__title title">Worklog:</h2>
        <div class="worklog__logs logs">
        </div>
      </div>
    `;
    this.instances = this.container.querySelector('.instances__wrapper');
    this.btnCreateInstance = this.container.querySelector('.instances__btn-create');
    this.logs = this.container.querySelector('.logs');
  }

  // Добавяем обработчики событий
  registerEvents() {
    this.btnCreateInstance.addEventListener('click', this.createInstance);
    this.instances.addEventListener('click', e => this.modifyInstance(e));
    const eventSource = new EventSource(`${this.api.url}/sse`);
    eventSource.addEventListener('open', () => console.log('sse open'));
    eventSource.addEventListener('error', () => console.log('sse error'));
    eventSource.addEventListener('message', e => {
      const data = JSON.parse(e.data);
      this.renderLog(data);
      this.getInstances();
    });
  }

  // Создаем инстанс
  createInstance(e) {
    e.preventDefault();
    this.api.create();
  }
  modifyInstance(e) {
    e.preventDefault();
    const {
      target
    } = e;
    const instance = target.closest('.instance');
    if (!instance) return;
    const {
      id
    } = instance.dataset;

    // Отправляем websocket id инстанса
    if (target.closest('.actions__btn-toggle')) {
      this.websocket.send(JSON.stringify({
        id
      }));
    }

    // Удаляем инстанс
    if (target.closest('.actions__btn-delete')) {
      this.api.delete(id);
    }
  }

  // Создаем лог
  renderLog(_ref) {
    let {
      id,
      info,
      timestamp
    } = _ref;
    const log = document.createElement('div');
    log.classList.add('worklog__item', 'log');
    log.setAttribute('data-id', id);
    log.innerHTML = `
      <p class="log__date">${timestamp}</p>
      <p>Server: ${id}</p>
      <p>INFO: ${info}</p>
    `;
    this.logs.append(log);
    this.scroll(this.logs);
  }

  // Подписываемя на события websocket
  subscribeOnEvents() {
    this.websocket.addEventListener('open', () => console.log('open'));
    this.websocket.addEventListener('message', () => console.log('message'));
  }

  // // Автоматическое пролистывание
  scroll(element) {
    element.scrollBy({
      top: element.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
}
;// CONCATENATED MODULE: ./src/js/app.js

const root = document.querySelector('.dashboard__container');
const app = new Dashbord(root);
app.init();
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;
//# sourceMappingURL=main.js.map