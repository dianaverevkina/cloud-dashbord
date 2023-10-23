import Api from './api/Api';
import InstanceView from './InstanceView';

export default class Dashbord {
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
    this.api.list((response) => {
      if (response) {
        this.instances.innerHTML = '';
        response.data.forEach((item) => {
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
    this.instances.addEventListener('click', (e) => this.modifyInstance(e));

    const eventSource = new EventSource(`${this.api.url}/sse`);

    eventSource.addEventListener('open', () => console.log('sse open'));

    eventSource.addEventListener('error', () => console.log('sse error'));

    eventSource.addEventListener('message', (e) => {
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
    const { target } = e;
    const instance = target.closest('.instance');
    if (!instance) return;

    const { id } = instance.dataset;

    // Отправляем websocket id инстанса
    if (target.closest('.actions__btn-toggle')) {
      this.websocket.send(JSON.stringify({ id }));
    }

    // Удаляем инстанс
    if (target.closest('.actions__btn-delete')) {
      this.api.delete(id);
    }
  }

  // Создаем лог
  renderLog({ id, info, timestamp }) {
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
      behavior: 'smooth',
    });
  }
}
