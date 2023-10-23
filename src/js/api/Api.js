import createRequest from './createRequest';

export default class Api {
  constructor() {
    this.url = 'http://localhost:3000';
  }

  // Отправляем запрос на получение инстансов
  list(callback) {
    createRequest({
      url: `${this.url}/`,
      method: 'GET',
    })
      .then((result) => {
        callback(result);
      })
      .catch((e) => {
        console.error('Произошла ошибка: ', e);
      });
  }

  // Отправляем запрос на создание инстанса
  create() {
    createRequest({
      url: `${this.url}/`,
      method: 'POST',
    })
      .catch((e) => {
        console.error('Произошла ошибка: ', e);
      });
  }

  // Отправляем запрос на удаение инстанса
  delete(id) {
    createRequest({
      url: `${this.url}/?id=${id}`,
      method: 'DELETE',
    })
      .catch((e) => {
        console.error('Произошла ошибка: ', e);
      });
  }
}
