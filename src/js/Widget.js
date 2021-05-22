import { interval, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map, mergeMap, timestamp } from 'rxjs/operators';
import Message from './Message';
import templateEngine from './TemplateEngine';

export default class Widget {
  constructor(container) {
    this.container = container;
    this.messagesIdContainer = [];
  }

  init() {
    this.bindToDOM();
    this.registerEvents();
    this.subscribeOnStreams();
  }

  registerEvents() {}

  bindToDOM() {
    this.container.appendChild(templateEngine.generate(this.markup()));
    this.messageContainer = this.container.querySelector('.widget__content');
  }

  subscribeOnStreams() {
    this.messageStream$ = interval(1000)
      .pipe(
        mergeMap(() =>
          ajax.getJSON('https://ahj-rxjs-polling.herokuapp.com/messages/unread').pipe(
            map((response) => {
              const filteredResponse = response.messages.filter(
                (message) => !this.messagesIdContainer.includes(message.id)
              );
              filteredResponse.forEach((message) => this.messagesIdContainer.push(message.id));
              return filteredResponse;
            }),
            timestamp(),
            catchError(() =>
              of({
                value: [],
              })
            )
          )
        )
      )
      .subscribe((response) => {
        response.value.forEach((message) => this.addMessage(response.timestamp, message));
      });
  }

  unSubscribeOnStreams() {
    this.messagesIdContainer = [];
    this.messageStream$.unsubscribe();
  }

  addMessage(currentDate, message) {
    const newMessage = new Message(currentDate, message);
    this.messageContainer.insertAdjacentElement(
      'afterbegin',
      templateEngine.generate(newMessage.markup())
    );
  }

  markup() {
    return {
      type: 'div',
      attr: {
        class: ['widget'],
      },
      content: [
        {
          type: 'div',
          attr: {
            class: ['widget__header'],
          },
          content: [
            {
              type: 'h1',
              attr: {
                class: ['widget__title'],
              },
              content: 'My Widget',
            },
            {
              type: 'h1',
              attr: {
                class: ['widget__controls'],
              },
              content: [
                {
                  type: 'button',
                  attr: {
                    class: ['button__unsubscribe'],
                  },
                  listener: {
                    type: 'click',
                    cb: () => this.unSubscribeOnStreams(),
                  },
                  content: 'Unsubscribe',
                },
                {
                  type: 'button',
                  attr: {
                    class: ['button__subscribe'],
                  },
                  listener: {
                    type: 'click',
                    cb: () => this.subscribeOnStreams(),
                  },
                  content: 'Subscribe',
                },
              ],
            },
          ],
        },
        {
          type: 'div',
          attr: {
            class: ['widget__content'],
          },
          content: '',
        },
      ],
    };
  }
}
