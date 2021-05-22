export default class Message {
  constructor(timestamp, message) {
    this.timestamp = timestamp;
    this.message = message;
  }

  markup() {
    const sourceDate = new Date(this.timestamp);
    const date = `${sourceDate
      .toLocaleTimeString()
      .slice(0, 5)} ${sourceDate.toLocaleDateString()}`;
    return {
      type: 'div',
      attr: {
        class: ['message'],
        'data-post-id': this.message.id,
      },
      content: {
        type: 'div',
        attr: {
          class: ['message__body'],
        },
        content: [
          {
            type: 'div',
            attr: {
              class: ['message__from'],
            },
            content: this.message.from,
          },
          {
            type: 'div',
            attr: {
              class: ['message__text'],
            },
            content:
              this.message.subject.length > 15
                ? `${this.message.subject.slice(0, 15)}...`
                : this.message.subject,
          },
          {
            type: 'div',
            attr: {
              class: ['message__received-data'],
            },
            content: date,
          },
        ],
      },
    };
  }
}
