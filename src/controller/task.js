import TaskView from "../view/task.js";
import TaskEditView from "../view/task-edit.js";
import {render, remove, replace} from "../utils/render.js";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {};

export default class Task {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._id = null;
    this._taskView = null;
    this._taskEditView = null;

    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._onDataChange = onDataChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task) {
    const oldTaskView = this._taskView;
    const oldTaskEditView = this._taskEditView;

    this._id = task.id;
    this._taskView = new TaskView(task);
    this._taskEditView = new TaskEditView(task);

    this._taskView.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskView.setFavoritesButtonClickHandler(() => {
      this._onDataChange(task, Object.assign({}, task, {
        isFavorite: !task.isFavorite,
      }));
    });

    this._taskView.setArchiveButtonClickHandler(() => {
      this._onDataChange(task, Object.assign({}, task, {
        isArchive: !task.isArchive,
      }));
    });

    this._taskEditView.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    if (oldTaskEditView && oldTaskView) {
      replace(this._taskView, oldTaskView);
      replace(this._taskEditView, oldTaskEditView);
    } else {
      render(this._container, this._taskView);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  destroy() {
    remove(this._taskEditView);
    remove(this._taskView);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._taskEditView, this._taskView);
    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditView.reset();
    replace(this._taskView, this._taskEditView);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }


}
