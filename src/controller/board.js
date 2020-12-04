import LoadMoreButtonView from "../view/load-more-button.js";
import TasksBoardView from "../view/tasks-board.js";
import TaskEditView from "../view/task-edit.js";
import TaskView from "../view/task.js";
import NoTasksView from "../view/no-tasks.js";
import SortView from "../view/sort.js";
import {render, remove, replace} from "../utils/render.js";


const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;


const renderTask = (taskListElement, task) => {

  const replaceTaskToEdit = () => {
    replace(taskEditView, taskView);
  };

  const replaceEditToTask = () => {
    replace(taskView, taskEditView);
  };


  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const taskView = new TaskView(task);
  const taskEditView = new TaskEditView(task);


  taskView.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditView.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskView);
};


export default class Board {
  constructor(container) {
    this._container = container;

    this._noTasksView = new NoTasksView();
    this._sortView = new SortView();
    this._tasksBoardView = new TasksBoardView();
    this._loadMoreButtonView = new LoadMoreButtonView();
  }

  render(tasks) {
    const container = this._container.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksView);
      return;
    }


    render(container, this._sortView);
    render(container, this._tasksBoardView);


    const taskListElement = this._tasksBoardView.getElement();
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    tasks.slice(0, showingTasksCount).forEach((task) => {
      renderTask(taskListElement, task);
    });


    render(container, this._loadMoreButtonView);

    this._loadMoreButtonView.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      tasks.slice(prevTasksCount, showingTasksCount).forEach((task) => {
        renderTask(taskListElement, task);
      });

      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });

    this._sortView.setSortTypeChangeHandler(() => {

    });
  }
}
