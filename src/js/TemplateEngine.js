class TemplateEngine {
  generate(data) {
    if (data === false || data === undefined || data === null) {
      return document.createTextNode('');
    }
    if (typeof data.type !== 'string') {
      return document.createTextNode('');
    }
    const template = document.createElement(`${data.type}`);
    if (data.attr) {
      Object.entries(data.attr).forEach(([key, value]) => {
        if (key === 'class') {
          template.className = value.join(' ');
        } else {
          template.setAttribute(key, value);
        }
      });
    }
    if (data.listener) {
      if (Array.isArray(data.listener)) {
        data.listener.forEach((listener) => template.addEventListener(listener.type, listener.cb));
      } else {
        template.addEventListener(data.listener.type, data.listener.cb);
      }
    }
    if (typeof data.content === 'string') {
      if (data.content === '') {
        template.textContent = '';
      }
      template.textContent = data.content;
    } else if (Array.isArray(data.content)) {
      data.content.forEach((element) => template.appendChild(this.generate(element)));
    } else if (typeof data.content === 'object') {
      template.appendChild(this.generate(data.content));
    }
    return template;
  }
}

const templateEngine = new TemplateEngine();

export default templateEngine;
