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

const renderBoard = (boardView, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);

  if (isAllTasksArchived) {
    render(boardView.getElement(), new NoTasksView());
    return;
  }

  render(boardView.getElement(), new SortView());
  render(boardView.getElement(), new TasksBoardView());

  const taskListElement = boardView.getElement().querySelector(`.board__tasks`);

  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
  tasks.slice(0, showingTasksCount)
    .forEach((task) => {
      renderTask(taskListElement, task);
    });

  const loadMoreButtonView = new LoadMoreButtonView();
  render(boardView.getElement(), loadMoreButtonView);

  loadMoreButtonView.setClickHandler(() => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => renderTask(taskListElement, task));

    if (showingTasksCount >= tasks.length) {
      remove(loadMoreButtonView.getElement());
      loadMoreButtonView.removeElement();
    }
  });

};


export default class Board {
  constructor(container) {
    this._container = container;
  }

  render(tasks) {
    renderBoard(this._container, tasks);
  }
}
