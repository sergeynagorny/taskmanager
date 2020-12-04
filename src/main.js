import BoardView from "./view/board.js";
import FilterView from "./view/filter.js";
import LoadMoreButtonView from "./view/load-more-button.js";
import TasksBoardView from "./view/tasks-board.js";
import TaskEditView from "./view/task-edit.js";
import TaskView from "./view/task.js";
import NoTasksView from "./view/no-tasks.js";
import SiteMenuView from "./view/site-menu.js";
import SortView from "./view/sort.js";
import {generateTasks} from "./model/task.js";
import {generateFilters} from "./model/filter.js";
import {render, replace, remove} from "./utils/render.js";


const TASK_COUNT = 32;
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
  const editButton = taskView.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const taskEditView = new TaskEditView(task);
  const editForm = taskEditView.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, (evt) => {
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

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasksData = generateTasks(TASK_COUNT);
const filtersData = generateFilters();

render(siteHeaderElement, new SiteMenuView());
render(siteMainElement, new FilterView(filtersData));

const boardView = new BoardView();
render(siteMainElement, boardView);
renderBoard(boardView, tasksData);
