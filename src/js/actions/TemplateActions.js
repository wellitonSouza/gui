import templateManager from '../comms/templates/TemplateManager';

var alt = require('../alt');

class TemplateActions {

  updateTemplates(list) {
    return list;
  }

  insertTemplate(template) {
    return template;
  }

  addTemplate(template, cb) {
    const newTemplate = template;
    return (dispatch) => {
      dispatch();
      templateManager.addTemplate(newTemplate)
        .then((response) => {
          this.insertTemplate(response.template);
          if (cb) {
            cb(response.template);
          }
        })
        .catch((error) => {
          this.templatesFailed("Failed to add template to list");
        })

    }
  }

  fetchTemplates() {
    return (dispatch) => {
      templateManager.getTemplates()
        .then((templateList) => {
          this.updateTemplates(templateList.templates);
        })
        .catch((error) => {
          this.templatesFailed(error);
        });

      dispatch();
    }
  }

  triggerUpdate(template, cb) {
    return (dispatch) => {
      templateManager.setTemplate(template)
        .then((response) => {
          this.updateSingle(template);
          if (cb) {
            cb(response.template);
          }
        })
        .catch((error) => {
          this.templatesFailed("Failed to update given template");
        })

      dispatch();
    }
  }

  triggerIconUpdate(id, icon) {
    return (dispatch) => {
      templateManager.setIcon(id, icon)
        .then((response) => {
          this.setIcon(id);
        })
        .catch(function(error) {
        })

      dispatch();
    }
  }

  setIcon(id) {
    return id;
  }

  triggerRemoval(template, cb) {
    return (dispatch) => {
      dispatch();
      templateManager.deleteTemplate(template)
        .then((response) => {
          this.removeSingle(template);
          if (cb) {
            cb();
          }
        })
        .catch((error) => {
          this.templatesFailed("Failed to remove given template");
        })
    }
  }

  updateSingle(template) {
    return template;
  }

  removeSingle(template) {
    return template;
  }

  templatesFailed(error) {
    return error;
  }
}

alt.createActions(TemplateActions, exports);
