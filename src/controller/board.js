import TaskController, {Mode as TaskControllerMode, EmptyTask} from "./task.js";
import LoadMoreButtonView from "../view/load-more-button.js";
import TasksBoardView from "../view/tasks-board.js";
import NoTasksView from "../view/no-tasks.js";
import SortView, {SortType} from "../view/sort.js";
import {render, remove} from "../utils/render.js";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTasks = (container, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(container, onDataChange, onViewChange);
    taskController.render(task);

    return taskController;
  });
};

const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};

export default class Board {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._noTasksView = new NoTasksView();
    this._sortView = new SortView();
    this._tasksBoardView = new TasksBoardView();
    this._loadMoreButtonView = new LoadMoreButtonView();


    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);

    this._sortView.setSortTypeChangeHandler(this._onSortTypeChange);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    const tasks = this._tasksModel.getTasks();

    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksView);
      return;
    }

    render(container, this._sortView);
    render(container, this._tasksBoardView);

    this._renderTasks(tasks.slice(0, this._showingTasksCount));

    this._renderLoadMoreButton();
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksBoardView.getElement();

    const newTasks = renderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreButtonView);

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._loadMoreButtonView);
    this._loadMoreButtonView.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onLoadMoreButtonClick() {
    const tasks = this._tasksModel.getTasks();
    const prevTasksCount = this._showingTasksCount;
    const taskListElement = this._tasksBoardView.getElement();
    this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    const sortedTasks = getSortedTasks(tasks, this._sortView.getSortType(), prevTasksCount, this._showingTasksCount);
    const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      remove(this._loadMoreButtonView);
    }
  }

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }

  _onDataChange(oldData, newData) {
    if (oldData === EmptyTask) {
      this._creatingTask = null;

      if (newData === null) {
        this._showedTaskControllers.find((it) => it._id === null).destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        this._tasksModel.addTask(newData);
        const currentTaskController = this._showedTaskControllers.find((it) => it._id === oldData.id);
        currentTaskController.render(newData, TaskControllerMode.DEFAULT);

        if (this._showingTasksCount % SHOWING_TASKS_COUNT_BY_BUTTON === 0) {
          const destroyedTask = this._showedTaskControllers.pop();
          destroyedTask.destroy();
        }

        this._showedTaskControllers = [].concat(currentTaskController, this._showedTaskControllers);
        this._showingTasksCount = this._showedTaskControllers.length;

        this._renderLoadMoreButton();
      }
    } else if (newData === null) {
      this._tasksModel.removeTask(oldData.id);
      this._updateTasks(this._showingTasksCount);

    } else {
      const isSuccess = this._tasksModel.updateTask(oldData.id, newData);
      if (isSuccess) {
        this._showedTaskControllers.find((it) => it._id === oldData.id).render(newData);
      }
    }
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingTasksCount = SHOWING_TASKS_COUNT_BY_BUTTON;

    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), sortType, 0, this._showingTasksCount);

    this._removeTasks();
    this._renderTasks(sortedTasks);

    this._renderLoadMoreButton();
  }

  _onFilterChange() {
    this._updateTasks(SHOWING_TASKS_COUNT_ON_START);
  }
}

