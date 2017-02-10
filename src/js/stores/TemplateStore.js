var alt = require('../alt');
var TemplateActions = require('../actions/TemplateActions');

class TemplateStore {
  constructor() {
    this.templates = [];
    this.error = null;

    this.bindListeners({
      handleUpdateTemplateList: TemplateActions.UPDATE_TEMPLATES,
      handleAddTemplate: TemplateActions.ADD_TEMPLATE,
      handleInsertTemplate: TemplateActions.INSERT_TEMPLATE,
      handleFetchTemplateList: TemplateActions.FETCH_TEMPLATES,
      handleFailure: TemplateActions.TEMPLATES_FAILED
    });
  }

  handleUpdateTemplateList(templates) {
    this.templates = templates;
    this.error = null;
  }

  handleInsertTemplate(template) {
    this.templates.push(template);
    this.error = null;
  }

  handleAddTemplate(newTemplate) {
    // this is actually just a intermediary while addition happens asynchonously
    this.error = null;
  }

  handleFetchTemplateList() {
    this.templates = [];
  }

  handleFailure(error) {
    this.error = error;
  }
}

var _store =  alt.createStore(TemplateStore, 'TemplateStore');
export default _store;
