import BoardView from "./view/board.js";
import BoardController from "./controller/board.js";
import FilterView from "./view/filter.js";
import SiteMenuView from "./view/site-menu.js";
import TasksModel from "./model/tasks.js";
import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";
import {render} from "./utils/render.js";


const TASK_COUNT = 33;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasksData = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasksData);
const filtersData = generateFilters();


render(siteHeaderElement, new SiteMenuView());
render(siteMainElement, new FilterView(filtersData));

const boardView = new BoardView();
const boardController = new BoardController(boardView, tasksModel);

render(siteMainElement, boardView);
boardController.render(tasksData);
