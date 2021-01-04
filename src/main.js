import API from "./api.js";
import BoardView from "./view/board.js";
import BoardController from "./controller/board.js";
import FilterController from "./controller/filter.js";

import SiteMenuView, {MenuItem} from "./view/site-menu.js";
import StatisticsView from "./view/statistics.js";
import TasksModel from "./model/tasks.js";
import {render} from "./utils/render.js";

const AUTHORIZATION = `Basic Asdhjasdj22`;
const END_POINT = `https://11.ecmascript.pages.academy/task-manager`;

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const api = new API(END_POINT, AUTHORIZATION);
const tasksModel = new TasksModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuView = new SiteMenuView();
const statisticsView = new StatisticsView({tasks: tasksModel, dateFrom, dateTo});

const boardView = new BoardView();

const boardController = new BoardController(boardView, tasksModel, api);
const filterController = new FilterController(siteMainElement, tasksModel);

render(siteHeaderElement, siteMenuView);
filterController.render();
render(siteMainElement, boardView);

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

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    boardController.render();
  });
