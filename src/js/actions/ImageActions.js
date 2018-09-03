import imageManager from '../comms/ImageManager';
import toaster from '../comms/util/materialize';

const alt = require('../alt');

console.log('ImageActions');

class ImageActions {
    updateImages(images) {
        return images;
    }

    // fetchImages() {
    //   return (dispatch) => {
    //     dispatch();

    //     imageManager.getImages().then((imageList) => {
    //       console.log("imageManager.getImages()",imageList);
    //       this.updateImages(imageList);
    //     })
    //     .catch((error) => {
    //       this.imagesFailed(error);
    //     });
    //   }
    // }


    triggerUpdate(image, cb) {
        return (dispatch) => {
            dispatch();
            imageManager.setBinary(image)
                .then((response) => {
                    console.log('imageManager.setBinary', response);
                    this.updateSingle(response.image);
                    if (cb) {
                        cb(response.image);
                    }
                })
                .catch((error) => {
                    this.imagesFailed(error);
                });
        };
    }

    updateSingle(image_id) {
        return image_id;
    }

    fetchSingle(label, callback) {
        return (dispatch) => {
            dispatch();

            imageManager.getImages(label)
                .then((images) => {
                    this.updateImages(images);
                    if (callback) {
                        callback(images);
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch images', error);
                    this.imagesFailed(error);
                });
        };
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
                    this.insertImage(response);
                    if (cb) {
                        cb(response);
                    }
                })
                .catch((error) => {
                    this.imagesFailed(error);
                });
        };
    }

    triggerRemovalBinary(image_id, cb) {
        return (dispatch) => {
            dispatch();
            imageManager.deleteBinary(image_id)
                .then((response) => {
                    console.log('response', response);
                    if (response.result == 'ok') {
                        this.removeSingleBinary(image_id);
                        if (cb) {
                            cb(response);
                        }
                    } else {
                        this.imagesFailed('Failed to remove given image');
                    }
                })
                .catch((error) => {
                    this.imagesFailed('Failed to remove given image');
                });
        };
    }

    removeSingleBinary(id) {
        return id;
    }

    triggerRemoval(image, cb) {
        return (dispatch) => {
            dispatch();
            imageManager.deleteImage(image.id)
                .then((response) => {
                    const resp_json = JSON.parse(response);
                    if (resp_json.result == 'ok') {
                        this.removeSingle(resp_json.removed_image.id);
                        if (cb) {
                            cb(response);
                        }
                    } else {
                        this.imagesFailed('Failed to remove given image');
                    }
                })
                .catch((error) => {
                    this.imagesFailed('Failed to remove given image');
                });
        };
    }

    removeSingle(id) {
        return id;
    }

    imagesFailed(error) {
        toaster.error(error.message);
        return error;
    }
}

alt.createActions(ImageActions, exports);
