import BoardView from "./view/board.js";
import BoardController from "./controller/board.js";
import FilterController from "./controller/filter.js";
import SiteMenuView from "./view/site-menu.js";
import TasksModel from "./model/tasks.js";
import {generateTasks} from "./mock/task.js";
import {render} from "./utils/render.js";

const TASK_COUNT = 33;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
render(siteHeaderElement, new SiteMenuView());

const tasksData = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasksData);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardView = new BoardView();
const boardController = new BoardController(boardView, tasksModel);

render(siteMainElement, boardView);
boardController.render(tasksData);
