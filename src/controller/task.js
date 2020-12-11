import TaskView from "../view/task.js";
import TaskEditView from "../view/task-edit.js";
import {render, replace} from "../utils/render.js";


export default class Task {
  constructor(container) {
    this._container = container;

    this._taskView = null;
    this._taskEditView = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task) {
    this._taskView = new TaskView(task);
    this._taskEditView = new TaskEditView(task);

    this._taskView.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskEditView.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    render(this._container, this._taskView);
  }

  _replaceTaskToEdit() {
    replace(this._taskEditView, this._taskView);
  }

  _replaceEditToTask() {
    replace(this._taskView, this._taskEditView);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }


}
