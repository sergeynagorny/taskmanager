import BoardView from "./view/board.js";
import BoardController from "./controller/board.js";
import FilterController from "./controller/filter.js";
import SiteMenuView, {MenuItem} from "./view/site-menu.js";
import TasksModel from "./model/tasks.js";
import {generateTasks} from "./mock/task.js";
import {render} from "./utils/render.js";

const TASK_COUNT = 40;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuView = new SiteMenuView();
render(siteHeaderElement, siteMenuView);

const tasksData = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasksData);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardView = new BoardView();
render(siteMainElement, boardView);
const boardController = new BoardController(boardView, tasksModel);
boardController.render();

siteMenuView.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuView.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;
  }
});

