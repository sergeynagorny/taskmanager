import AbstractSmart from "./abstract-smart.js";
import {COLORS, DAYS, MONTH_NAMES} from "../const.js";
import {formatTime, isRepeating, isOverdueDate} from "../utils/common.js";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";


const createColorsMarkup = (colors, currentColor) => {
  return colors.map((color, index) => {
    const colorChecked = (color === currentColor) ? `checked` : ``;
    const colorId = `color-${color}-${index}`;

    return (`
      <input value="${color}" id="${colorId}" type="radio" class="card__color-input card__color-input--${color} visually-hidden" name="color" ${colorChecked}>
      <label for="${colorId}" class="card__color card__color--${color}">${color}</label>
    `);
  }).join(`\n`);
};

const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days.map((day, index) => {
    const dayChecked = repeatingDays[day] ? `checked` : ``;
    const dayId = `repeat-${day}-${index}`;

    return (`
      <input class="visually-hidden card__repeat-day-input" name="repeat" type="checkbox" id="${dayId}" value="${day}" ${dayChecked}>
      <label class="card__repeat-day" for="${dayId}">${day}</label>
    `);
  }).join(`\n`);
};

const createTaskEditTemplate = (task, options = {}) => {
  const {description, dueDate, color} = task;
  const {isDateShowing, isRepeatingTask, activeRepeatingDays} = options;


  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
  const isBlockSaveButton = (isDateShowing && isRepeatingTask) || (isRepeatingTask && !isRepeating(activeRepeatingDays));
  const date = (isDateShowing && dueDate) ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = (isDateShowing && dueDate) ? formatTime(dueDate) : ``;

  const repeatClass = isRepeating ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const colorsMarkup = createColorsMarkup(COLORS, color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, activeRepeatingDays);

  return (`
    <article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>
          <div class="card__textarea-wrap">
            <label>
              <textarea class="card__text" placeholder="Start typing your text here..." name="text">${description}
              </textarea>
            </label>
          </div>
          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>
                ${isDateShowing ? `
                  <fieldset class="card__date-deadline">
                    <label class="card__input-deadline-wrap">
                      <input class="card__date" type="text" name="date" value="${date} ${time}">
                    </label>
                  </fieldset>
                ` : ``}
                <button class="card__repeat-toggle" type="button">
                  repeat: <span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                </button>
                ${isRepeatingTask ? `
                  <fieldset class="card__repeat-days">
                    <div class="card__repeat-days-inner">
                      ${repeatingDaysMarkup}
                    </div>
                  </fieldset>
                ` : ``}
              </div>
            </div>
            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>
          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isBlockSaveButton ? `disabled` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>
  `);
};

const parseFormData = (formData) => {
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});
  const date = formData.get(`date`);

  return {
    description: formData.get(`text`),
    color: formData.get(`color`),
    dueDate: date ? new Date(date) : null,
    repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
  };
};

export default class TaskEdit extends AbstractSmart {
  constructor(task) {
    super();

    this._task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._flatpickr = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTaskEditTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays,
    });
  }

  reset() {
    const task = this._task;

    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);

    this.rerender();
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  getData() {
    const form = this.getElement().querySelector(`.card__form`);
    const formData = new FormData(form);
    console.log(`прекол`);

    return parseFormData(formData);
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate || `today`,
      });
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, () => {
      this._isDateShowing = !this._isDateShowing;
      this.rerender();
    });

    element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, () => {
      this._isRepeatingTask = !this._isRepeatingTask;
      this.rerender();
    });

    const repeatDays = element.querySelector(`.card__repeat-days`);

    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;
        this.rerender();
      });
    }
  }
}
