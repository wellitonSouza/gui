import util from '../util';

class MeasureManager {
  constructor() {
    this.baseUrl = "http://localhost:8080"
  }

  getMeasures(id) {
    return util.GET(this.baseUrl + "/historyws/contextEntities/v1/entity/" + id + "?limit=20");
  }
}

var measureManager = new MeasureManager();
export default measureManager;
