import util from '../util';

class TemplateManager {
  constructor() {
    this.baseUrl = ""
  }

  getLastTemplates(field)
  {
    return util.GET(this.baseUrl + "/template?limit=10&sortDsc="+field);
  }

  // @TO_CHECK are these names below correct?
  getTemplates() {
    return util.GET(this.baseUrl + '/template');
  }

  getTemplate(id) {
    return util.GET(this.baseUrl + "/template/" + id);
  }

  setTemplate(detail) {
    return util.PUT(this.baseUrl + "/template/" + detail.id, detail);
  }

  addTemplate(d) {
    return util.POST(this.baseUrl + "/template", d);
  }

  deleteTemplate(id) {
    return util.DELETE(this.baseUrl + "/template/" + id);
  }

  setIcon(id, icon) {
    let data = new FormData();
    data.append('icon', icon);
    let config = {method: 'put', body: data};
    return util._runFetch(this.baseUrl + "/template/" + id + "/icon", config);
  }
}

var templateManager = new TemplateManager();
export default templateManager;
