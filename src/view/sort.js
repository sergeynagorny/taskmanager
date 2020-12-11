import Abstract from "./abstract.js";

export const SortType = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DEFAULT: `default`,
};

const createSortTemplate = () => {
  return (`
    <div class="board__filter-list">
      <a href="#" class="board__filter" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
      <a href="#" class="board__filter" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
      <a href="#" class="board__filter" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
    </div>
  `);
};


export default class Sort extends Abstract {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChangeHandler(callback) {
    const sortButtons = this.getElement().querySelectorAll(`.board__filter`);

    sortButtons.forEach((it) => {
      it.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const sortType = evt.target.dataset.sortType;

        if (sortType !== this._currentSortType) {
          this._currentSortType = sortType;
          callback(this._currentSortType);
        }
      });
    });
  }
}
