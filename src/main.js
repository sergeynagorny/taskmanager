import BoardView from "./view/board.js";
import BoardController from "./controller/board.js";
import FilterView from "./view/filter.js";
import SiteMenuView from "./view/site-menu.js";
import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";
import {render} from "./utils/render.js";


const TASK_COUNT = 32;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasksData = generateTasks(TASK_COUNT);
const filtersData = generateFilters();

render(siteHeaderElement, new SiteMenuView());
render(siteMainElement, new FilterView(filtersData));

const boardView = new BoardView();
const boardController = new BoardController(boardView);

render(siteMainElement, boardView);
boardController.render(tasksData);
