import imageManager from '../comms/ImageManager';
import Materialize from 'materialize-css';

var alt = require('../alt');

console.log("ImageActions");

class ImageActions {

  fetchImages() {
    return (dispatch) => {
      dispatch();

      imageManager.getImages().then((templateList) => {
          console.log("imageManager.getImages()",templateList);
        this.updateImages(templateList.template.images);
      })
      .catch((error) => {
        this.imagesFailed(error);
      });
    }
  }

  fetchSingle(id, callback) {
    return (dispatch) => {
      dispatch();

      imageManager.getImage(id)
        .then((image) => {
          this.updateSingle(image);
          if (callback) {
            callback(image);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch single image", error);
          this.imagesFailed(error);
        })
    }
  }

  updateImages(list) {
    return list;
  }

  insertImage(image) {
    return image;
  }

  triggerInsert(image, cb) {
    const newimage = image;
    return (dispatch) => {
      dispatch();
        imageManager.addImage(newimage)
        .then((response) => {
          this.insertImage(response.template.images[0]);
          if (cb) {
            cb(response.template.images[0]);
          }
        })
        .catch((error) => {
          this.imagesFailed(error);
        })
    }
  }

  triggerUpdate(image, cb) {
    return (dispatch) => {
      dispatch();
        imageManager.setImage(image)
        .then((response) => {
            this.updateSingle(image);
          if (cb) {
              cb(image);
          }
        })
        .catch((error) => {
          this.imagesFailed(error);
        })
    }
  }

  updateSingle(image) {
    return image;
  }

  triggerRemoval(image, cb) {
    return (dispatch) => {
      dispatch();
      imageManager.deleteImage(image.id)
        .then((response) => {
          if (cb) {
            cb(response);
          }
        })
        .catch((error) => {
          this.imagesFailed("Failed to remove given image");
        })
    }
  }

  removeSingle(id) {
    return id;
  }

  imagesFailed(error) {
    Materialize.toast(error.message, 4000);
    return error;
  }
}

alt.createActions(ImageActions, exports);
