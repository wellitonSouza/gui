var alt = require('../alt');
var ImageActions = require('../actions/ImageActions');

class ImageStore {
    constructor() {
        this.new_image = {};
        this.images = {};
        this.error = null;
        this.loading = false;

        this.bindListeners({
            handleUpdateImageList: ImageActions.UPDATE_IMAGES,
            handleFetchImageList: ImageActions.FETCH_IMAGES,

            handleTriggerInsertion:ImageActions.TRIGGER_INSERT,
            handleInsertImage:ImageActions.INSERT_IMAGE,

            handleTriggerUpdate: ImageActions.TRIGGER_UPDATE,
            handleUpdateSingle: ImageActions.UPDATE_SINGLE,

            handleTriggerRemoval:ImageActions.TRIGGER_REMOVAL,
            handleRemoveSingle:ImageActions.REMOVE_SINGLE,

            handleFailure: ImageActions.IMAGES_FAILED,

            // fetchSingle: ImageActions.FETCH_SINGLE,
        });
    }

    handleUpdateSingle(image) {
        let newimage = JSON.parse(JSON.stringify(image));
        newimage.loading = false;

        // this.images saves the image on store;
        this.images[image.id] = newimage;

        this.loading = false;
    }

    handleTriggerUpdate(image) {
        // trigger handler for updateSingle
        this.error = null;
        this.loading = true;
    }

    handleTriggerRemoval(image) {
        // trigger handler for removeSingle
        this.error = null;
        this.loading = true;
    }

    handleRemoveSingle(id) {
        if (this.images.hasOwnProperty(id)) {
            delete this.images[id];
        }
        this.loading = false;
    }

    handleInsertImage(image) {
        this.images[image.id] = JSON.parse(JSON.stringify(image));
        this.error = null;
        this.loading = false;
    }

    handleTriggerInsertion(newImage) {
        // this is actually just a intermediary while addition happens asynchonously
        this.error = null;
        this.loading = true;
    }

    handleUpdateImageList(images) {
        this.images = {};
        for (let idx = 0; idx < images.length; idx++) {
            this.images[images[idx].id] = JSON.parse(JSON.stringify(images[idx]))
        }
        // this.images = images;
        this.error = null;
        this.loading = false;
    }

    handleFetchImageList() {
        this.images = [];
        this.loading = true;
    }

    fetchImagesByTemplate() {
        this.images = {};
        this.loading = false;
    }

    // fetchSingle(id) {
    //     this.images[id] = { loading: true };
    // }

    handleFailure(error) {
        this.error = error;
        this.loading = false;
    }
}

var _store = alt.createStore(ImageStore, 'ImageStore');
export default _store;
