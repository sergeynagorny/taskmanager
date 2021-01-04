import TaskView from "../view/task.js";
import TaskEditView from "../view/task-edit.js";
import TaskModel from "../model/task.js";
import {render, remove, replace} from "../utils/render.js";
import {Color, DAYS} from "../const.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const parseFormData = (formData) => {
  const date = formData.get(`date`);
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});

  return new TaskModel({
    "description": formData.get(`text`),
    "due_date": date ? new Date(date) : null,
    "repeating_days": formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
    "color": formData.get(`color`),
    "is_favorite": false,
    "is_done": false,
  });
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: Color.BLACK,
  isFavorite: false,
  isArchive: false,
};

export default class Task {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._taskView = null;
    this._taskEditView = null;

    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._onDataChange = onDataChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task, mode) {
    const oldTaskView = this._taskView;
    const oldTaskEditView = this._taskEditView;

    this._mode = mode;
    this._taskView = new TaskView(task);
    this._taskEditView = new TaskEditView(task);

    this._taskView.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskView.setFavoritesButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isFavorite = !newTask.isFavorite;

      this._onDataChange(this, task, newTask);
    });

    this._taskView.setArchiveButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isArchive = !newTask.isArchive;

      this._onDataChange(this, task, newTask);
    });

    this._taskEditView.setSubmitHandler((evt) => {
      evt.preventDefault();

      const formData = this._taskEditView.getData();
      const data = parseFormData(formData);

      this._taskEditView.setData({
        saveButtonText: `Saving...`,
      });

      this._onDataChange(this, task, data);
    });

    this._taskEditView.setDeleteButtonClickHandler(() => {

      this._taskEditView.setData({
        deleteButtonText: `Deleting...`,
      });

      this._onDataChange(this, task, null);
    });


    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskEditView && oldTaskView) {
          replace(this._taskView, oldTaskView);
          replace(this._taskEditView, oldTaskEditView);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskView);
        }
        break;

      case Mode.ADDING:
        if (oldTaskEditView && oldTaskView) {
          remove(oldTaskEditView);
          remove(oldTaskView);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskEditView, `afterbegin`);
        break;
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

  shake() {
    this._taskEditView.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._taskView.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._taskEditView.getElement().style.animation = ``;
      this._taskView.getElement().style.animation = ``;

      this._taskEditView.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });

    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._taskEditView, this._taskView);
    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditView.reset();

    if (document.contains(this._taskEditView.getElement())) {
      replace(this._taskView, this._taskEditView);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }

      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }


}
