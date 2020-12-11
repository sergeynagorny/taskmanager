import {COLORS, DAYS, MONTH_NAMES} from "../const.js";
import {formatTime} from "../utils/common.js";
import Abstract from "./abstract.js";


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

const createTaskEditTemplate = (task) => {
  const {description, dueDate, color, repeatingDays} = task;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const isDateShowing = Boolean(dueDate);
  const isRepeating = Object.values(repeatingDays).some(Boolean);

  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;

  const repeatClass = isRepeating ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const colorsMarkup = createColorsMarkup(COLORS, color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, repeatingDays);

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
                  repeat: <span class="card__repeat-status">${isRepeating ? `yes` : `no`}</span>
                </button>
                ${isRepeating ? `
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
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>
  `);
};


export default class TaskEdit extends Abstract {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createTaskEditTemplate(this._task);
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
  }
}
