import BoardView from "./view/board.js";
import BoardController from "./controller/board.js";
import FilterController from "./controller/filter.js";

import SiteMenuView, {MenuItem} from "./view/site-menu.js";
import StatisticsView from "./view/statistics.js";
import TasksModel from "./model/tasks.js";
import {generateTasks} from "./mock/task.js";
import {render} from "./utils/render.js";

const TASK_COUNT = 22;

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const tasksData = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();

tasksModel.setTasks(tasksData);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuView = new SiteMenuView();
const statisticsView = new StatisticsView({tasks: tasksModel, dateFrom, dateTo});

const boardView = new BoardView();

const boardController = new BoardController(boardView, tasksModel);
const filterController = new FilterController(siteMainElement, tasksModel);

render(siteHeaderElement, siteMenuView);
filterController.render();
render(siteMainElement, boardView);
boardController.render();

render(siteMainElement, statisticsView);
statisticsView.hide();

siteMenuView.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuView.setActiveItem(MenuItem.TASKS);
      statisticsView.hide();
      boardController.show();
      boardController.createTask();
      break;

    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsView.show();
      break;

    case MenuItem.TASKS:
      statisticsView.hide();
      boardController.show();
      break;
  }
});

