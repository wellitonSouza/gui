import templateManager from '../comms/templates/TemplateManager';

var alt = require('../alt');

class TemplateActions {

  updateTemplates(list) {
    console.log("action - update", list);
    return list;
  }

  fetchTemplates() {
    return (dispatch) => {
      dispatch();
      templateManager.getDevices().then((templateList) => {
        console.log("action - promise finished", templateList, this);
        this.updateTemplates(templateList.devices);
      })
      .catch((error) => {
        console.log("action - promise error", error);
        this.templatesFailed(error);
      });
    }
  }

  templatesFailed(error) {
    return error;
  }
}

alt.createActions(TemplateActions, exports);
