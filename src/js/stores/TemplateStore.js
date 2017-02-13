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
      handleFailure: TemplateActions.TEMPLATES_FAILED,

      handleTriggerUpdate: TemplateActions.TRIGGER_UPDATE,
      handleUpdateSingle: TemplateActions.UPDATE_SINGLE,

      handleTriggerRemoval: TemplateActions.TRIGGER_REMOVAL,
      handleRemoveSingle: TemplateActions.REMOVE_SINGLE
    });
  }

  handleUpdateTemplateList(templates) {
    this.templates = templates;
    this.error = null;
  }

  handleUpdateSingle(template) {
    for (let i = 0; i < this.templates.length; i++) {
      if (this.templates[i].id == template.id) {
        let newTemplate = JSON.parse(JSON.stringify(template))
        this.templates[i] = newTemplate;
      }
    }
  }

  handleTriggerUpdate(template) {
    // trigger handler for updateSingle
    this.error = null;
  }

  handleTriggerRemoval(template) {
    // trigger handler for updateSingle
    this.error = null;
  }

  handleRemoveSingle(id) {
    this.templates = this.templates.filter(function(e) {
      return e.id != id;
    })
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
