/* eslint-disable */
const alt = require('../alt');
const ImageActions = require('../actions/ImageActions');

class ImageStore {
    constructor() {
        this.new_image = {};
        this.images = {};
        this.error = null;
        this.loading = false;

        this.bindListeners({
            handleUpdateImageList: ImageActions.UPDATE_IMAGES,
            fetchSingle: ImageActions.FETCH_SINGLE,
            // handleFetchImageList: ImageActions.FETCH_IMAGES,

            handleTriggerInsertion: ImageActions.TRIGGER_INSERT,
            handleInsertImage: ImageActions.INSERT_IMAGE,

            handleTriggerUpdate: ImageActions.TRIGGER_UPDATE,
            handleUpdateSingle: ImageActions.UPDATE_SINGLE,

            handleTriggerRemoval: ImageActions.TRIGGER_REMOVAL,
            handleRemoveSingle: ImageActions.REMOVE_SINGLE,


            handleTriggerRemovalBinary: ImageActions.TRIGGER_REMOVAL_BINARY,
            handleRemoveSingleBinary: ImageActions.REMOVE_SINGLE_BINARY,


            handleFailure: ImageActions.IMAGES_FAILED,

        });
    }

    handleUpdateSingle(image_id) {
        this.images[image_id].has_image = true;
        this.loading = false;
    }

    handleTriggerUpdate(image) {
        // trigger handler for updateSingle
        this.error = null;
        this.loading = true;
    }

    // *********

    handleTriggerRemovalBinary(image) {
        this.error = null;
        this.loading = true;
    }

    handleRemoveSingleBinary(id) {
        if (this.images.hasOwnProperty(id)) {
            this.images[id].has_image = false;
        }
        this.loading = false;
    }

    // *********

    handleTriggerRemoval(image) {
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
        // this.images[image.id] = JSON.parse(JSON.stringify(image));
        this.error = null;
        this.loading = false;
    }

    handleTriggerInsertion(newImage) {
        // this is actually just a intermediary while addition happens asynchonously
        this.error = null;
        this.loading = true;
    }

    handleUpdateImageList(images) {
        // console.log('images', images);
        // let images = images;
        this.images = {};
        for (let idx = 0; idx < images.length; idx++) {
            this.images[images[idx].id] = JSON.parse(JSON.stringify(images[idx]));
            this.images[images[idx].id].has_image = this.images[images[idx].id].confirmed;
        }
        // console.log('handleUpdateImageList', this.images);
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

    fetchSingle(id) {
        this.images = { loading: true };
    }

    handleFailure(error) {
        this.error = error;
        this.loading = false;
    }
}

const _store = alt.createStore(ImageStore, 'ImageStore');
export default _store;
