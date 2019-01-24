/* eslint-disable */
const alt = require('../alt');
const ImageActions = require('../actions/ImageActions');

class ImageStore {
    constructor() {
        this.images = {};
        this.error = null;
        this.loading = false;

        this.bindListeners({
            handleUpdateImageList: ImageActions.UPDATE_IMAGES,
            handleFetchImageList: ImageActions.FETCH_IMAGES,
        
            handleTriggerInsertion: ImageActions.TRIGGER_INSERT,
            handleInsertImage: ImageActions.INSERT_IMAGE,
            handleInsertEmptyImage: ImageActions.INSERT_EMPTY_IMAGE,
            
            handleTriggerUpdate: ImageActions.TRIGGER_UPDATE,
            handleUpdateSingle: ImageActions.UPDATE_SINGLE,

            handleTriggerRemovalBinary: ImageActions.TRIGGER_REMOVAL_BINARY,
            handleRemoveSingleBinary: ImageActions.REMOVE_SINGLE_BINARY,

            handleTriggerRemoval: ImageActions.TRIGGER_REMOVAL,
            handleRemoveSingle: ImageActions.REMOVE_SINGLE,

            handleUpdateImageData: ImageActions.UPDATE_IMAGE_DATA,

            fetchSingle: ImageActions.FETCH_SINGLE,

            handleFailure: ImageActions.IMAGES_FAILED,

        });
    }


    handleUpdateImageData(fields)
    {
        this.images[fields.id].saved = false;
        this.images[fields.id][fields.label] = fields.value;
    }


    handleInsertEmptyImage(image)
    {
        this.images[image.id] = JSON.parse(JSON.stringify(image));
    }

    handleUpdateImageList(images) {
        this.images = {};
        for (let idx = 0; idx < images.length; idx++) {
            let aux_id = images[idx].id;
            this.images[aux_id] = JSON.parse(JSON.stringify(images[idx]));
            this.images[aux_id].has_image = this.images[aux_id].confirmed;
            if (!this.images[aux_id].has_image)
            this.images[aux_id].image_hash = null;
            this.images[aux_id].image_version = this.images[aux_id].fw_version;
            this.images[aux_id].saved = true;
        }
        console.log('handleUpdateImageList', this.images);
        // this.images = images;
        this.error = null;
        this.loading = false;
    }

    handleFetchImageList() {
        this.images = {};
        this.loading = true;
    }



    handleTriggerInsertion(newImage) {
        // this is actually just a intermediary while addition happens asynchonously
        this.error = null;
        this.loading = true;
    }

    handleInsertImage(imgs) {
        console.log("handleInsertImage: image", imgs.image, imgs.oldimage);
        delete this.images[imgs.oldimage.id];
        this.images[imgs.image.id] = imgs.image; 
        this.error = null;
        this.loading = false;
    }




    handleUpdateSingle(image_id) {
        this.images[image_id].has_image = true;
        this.loading = false;
    }

    handleTriggerUpdate(image) {
        this.error = null;
        this.loading = true;
    }




    handleTriggerRemovalBinary(id) { 
        this.error = null;
        this.loading = true;
    }

    handleRemoveSingleBinary(id) {
        if (this.images.hasOwnProperty(id)) {
            this.images[id].has_image = false;
            this.images[id].image_hash = null;
        }
        this.loading = false;
    }




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
