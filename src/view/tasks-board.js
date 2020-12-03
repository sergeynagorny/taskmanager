import Abstract from "./abstract.js";


const createTasksBoardTemplate = () => {
  return (`
    <div class="board__tasks"></div>
  `);
};


export default class TasksBoard extends Abstract {
  getTemplate() {
    return createTasksBoardTemplate();
  }
}
