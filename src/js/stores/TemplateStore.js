var alt = require('../alt');
var TemplateActions = require('../actions/TemplateActions');

class TemplateStore {
  constructor() {
    this.templates = [];
    this.error = null;

    this.bindListeners({
      handleUpdateTemplateList: TemplateActions.UPDATE_TEMPLATES,
      handleFetchTemplateList: TemplateActions.FETCH_TEMPLATES,
      handleFailure: TemplateActions.TEMPLATES_FAILED
    });
  }

  handleUpdateTemplateList(templates) {
    console.log("store - update tmpl list", this.templates, templates);
    this.templates = templates;
    this.error = null;
  }

  handleFetchTemplateList() {
    console.log('store - fetch tmpl list')
    this.templates = [];
  }

  handleFailure(error) {
    console.log('store - tmpl store failure');
    this.error = error;
  }
}

var _store =  alt.createStore(TemplateStore, 'TemplateStore');
export default _store;
