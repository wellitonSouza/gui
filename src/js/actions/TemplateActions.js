import templateManager from '../comms/templates/TemplateManager';

var alt = require('../alt');

class TemplateActions {

  updateTemplates(list) {
    return list;
  }

  insertTemplate(template) {
    return template;
  }

  addTemplate(template) {
    const newTemplate = template;
    return (dispatch) => {
      templateManager.addDevice(newTemplate)
        .then((response) => {
          this.insertTemplate(newTemplate);
        })
        .catch((error) => {
          this.templatesFailed("Failed to add template to list");
        })
    }
  }

  fetchTemplates() {
    return (dispatch) => {
      dispatch();
      templateManager.getDevices().then((templateList) => {
        this.updateTemplates(templateList.devices);
      })
      .catch((error) => {
        this.templatesFailed(error);
      });
    }
  }

  templatesFailed(error) {
    return error;
  }
}

alt.createActions(TemplateActions, exports);
