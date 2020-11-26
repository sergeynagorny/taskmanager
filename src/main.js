import {createBoardTemplate} from "./view/board.js";
import {createFilterTemplate} from "./view/filter.js";
import {createLoadMoreButtonTemplate} from "./view/load-more-button.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createSortTemplate} from "./view/sort.js";
import {createTaskBoardTemplate} from "./view/task-board.js";
import {createTaskEditTemplate} from "./view/task-edit.js";
import {createTaskTemplate} from "./view/task.js";
import {generateFilters} from "./model/filter.js";
import {generateTasks} from "./model/task.js";


const TASK_COUNT = 32;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const dataFilters = generateFilters();
const dataTasks = generateTasks(TASK_COUNT);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate());
render(siteMainElement, createFilterTemplate(dataFilters));
render(siteMainElement, createBoardTemplate());
const boardElement = document.querySelector(`.board`);
render(boardElement, createSortTemplate());
render(boardElement, createTaskBoardTemplate());
const taskListElement = document.querySelector(`.board__tasks`);
render(taskListElement, createTaskEditTemplate(dataTasks[0]));

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

dataTasks.slice(1, showingTasksCount)
  .forEach((task) => render(taskListElement, createTaskTemplate(task)));

render(boardElement, createLoadMoreButtonTemplate());

const loadMoreButton = boardElement.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

  dataTasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => render(taskListElement, createTaskTemplate(task)));

  if (showingTasksCount >= dataTasks.length) {
    loadMoreButton.remove();
  }
});
