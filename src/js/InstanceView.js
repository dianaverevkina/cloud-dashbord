export default class InstanceView {
  static drawInstance({ id, state }) {
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
