import {createElement} from "../utils.js";


const createTasksBoardTemplate = () => {
  return (`
    <div class="board__tasks"></div>
  `);
};


export default class TasksBoard {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTasksBoardTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
