import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createSortTemplate} from "./view/sort.js";
import {createFilterTemplate} from "./view/filter.js";
import {createTaskTemplate} from "./view/task.js";
import {createTaskEditTemplate} from "./view/task-edit.js";
import {createLoadMoreButtonTemplate} from "./view/load-more-button.js";
import {createBoardTemplate} from "./view/board.js";
import {createTaskBoardTemplate} from "./view/task-board.js";
import {generateFilters} from "./model/filter.js";
import {generateTasks} from "./model/task.js";


const TASK_COUNT = 22;

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
for (let i = 1; i < dataTasks.length; i++) {
  render(taskListElement, createTaskTemplate(dataTasks[i]));
}
render(boardElement, createLoadMoreButtonTemplate());
