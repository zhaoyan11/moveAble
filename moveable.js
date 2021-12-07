export default class Moveable {
  constructor(ele) {
    this.moveTarget = ele;
    this.lastX = undefined;
    this.lastY = undefined;

    if (getComputedStyle(ele).display === 'inline' && ['IMG', 'VIDEO'].indexOf(ele.tagName) === -1) {
      throw 'Opps, is that target a transformable element?';
    }

    this._move = e => {
      e.preventDefault();
      this.lastX = this.lastX ?? e.clientX;
      this.lastY = this.lastY ?? e.clientY;
      let dx = e.clientX - this.lastX;
      let dy = e.clientY - this.lastY;
      let style = getComputedStyle(this.moveTarget);
      if (style.transform === 'none') {
        this.moveTarget.style.transform = `matrix(1,0,0,1,${dx},${dy})`;
      } else {
        let matrix = this.moveTarget.style.transform;
        let matrixArr = matrix.replace('matrix(', '').replace(')', '').split(',');

        matrixArr[4] = Number(matrixArr[4]) + dx;
        matrixArr[5] = Number(matrixArr[5]) + dy;
        this.moveTarget.style.transform = `matrix(${matrixArr.join()})`;
      }
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    }
    this._init();
  }

  _init() {
    this.moveTarget.addEventListener('mousedown', e => {
      window.addEventListener('mousemove', this._move, true);
    }, true)

    window.addEventListener('mouseup', e => {
      window.removeEventListener('mousemove', this._move, true);
      this.lastX = undefined;
      this.lastY = undefined;
    }, true)
  }
}
