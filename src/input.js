class History {
  data = [];
  index = 0;

  add(item) {
    if (this.index < this.data.length - 1) {
      this.data = this.data.slice(0, this.index+1);
    }
    this.data.push(item);
    this.index = this.data.length - 1;
  }

  next() {
    this.index++;
    if (this.index > this.data.length - 1) {
      this.index = this.data.length - 1
    }
    return this.data[this.index];
  }

  back() {
    this.index--;
    if (this.index < 0) {
      this.index = 0;
    }
    return this.data[this.index];
  }

  clear() {
    this.index = 0;
    this.data.length = 0;
  }
}

export default class Input {
  constructor(selector, validator) {
    if (typeof selector === 'string') {
      const els = document.querySelectorAll(selector);
      for (let i = 0, len = els.length; i < len; i++) {
        new Input(els[i], validator);
      }
      return
    }
    if (typeof validator !== 'function') {
      throw 'need a func as validator'
    }
    this.el = selector;
    this.validator = validator;
    this.history = new History();
    this.history.add(this.el.value);
    this.bind();
  }

  bind() {
    this.el.addEventListener('keydown', e => {
      const el = e.target;
      el.originSelectionStart = el.selectionStart;
      el.originSelectionEnd = el.selectionEnd;
      el.originValue = el.value;

      if (e.key === 'z' && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        // undo
        e.preventDefault();
        this.el.value = this.history.back();
      }

      if (e.key === 'z' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        // redo
        e.preventDefault();
        this.el.value = this.history.next();
      }
    }, true)

    this.el.addEventListener('input', e => {
      if (!this.validate(e.target.value)) {
        this.correct(e.data);
      }
    }, true)

    this.el.addEventListener('paste', e => {
      const data = (e.clipboardData || window.clipboardData).getData('text');
      const {prefix, suffix} = this.getSegment();
      if (!this.validate(prefix + data + suffix)) {
        e.preventDefault();
        this.correct(data);
      }
    }, true)

    this.el.addEventListener('change', e => {
      this.history.add(this.el.value);
    }, true)
  }

  correct(data) {
    if (!data) {
      return
    }
    const {prefix, suffix} = this.getSegment();
    const el = this.el;
    let filtered = '';
    for (let i = 0; i < data.length; i++) {
      if (this.validate(prefix + filtered + data[i] + suffix)) {
        filtered += data[i];
      }
    }

    el.value = prefix + filtered + suffix;
    el.selectionEnd = el.selectionStart = el.originSelectionStart + filtered.length;
  }

  validate(value) {
    return this.validator(value);
  }

  getSegment() {
    const originVal = this.el.originValue;
    const originSelectionStart = this.el.originSelectionStart;
    const originSelectionEnd = this.el.originSelectionEnd;
    const prefix = originVal.slice(0, originSelectionStart);
    const suffix = originVal.slice(originSelectionEnd);
    return {prefix, suffix};
  }
}
