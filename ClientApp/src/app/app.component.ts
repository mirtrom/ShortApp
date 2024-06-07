import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';
  socket!: WebSocket;

  ngOnInit() {
    // Ініціалізація WebSocket при завантаженні компонента
    this.initWebSocket();
  }

  initWebSocket() {
    // Встановлення адреси WebSocket сервера
    const socketUrl = 'wss://localhost:5000/ws';

    // Створення об'єкту WebSocket
    this.socket = new WebSocket(socketUrl);

    // Обробник подій при відкритті з'єднання
    this.socket.onopen = (event) => {
      console.log('WebSocket connection opened:', event);
      // Додайте ваші дії, якщо з'єднання відкрите
    };

    // Обробник подій при закритті з'єднання
    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      // Додайте ваші дії, якщо з'єднання закрите
    };

    // Обробник подій при отриманні повідомлення
    this.socket.onmessage = (event) => {
      console.log('WebSocket message received:', event);
      // Додайте ваші дії при отриманні повідомлення
    };

    // Обробник подій при виникненні помилки
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Додайте ваші дії при виникненні помилки
    };
  }
}
