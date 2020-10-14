import { baseURL } from 'Src/config';
import util from '../util';

class ImageManager {
    getImages(label) {
        return util.GET(`${baseURL}fw-image/image?label=${label}`);
    }

    getImage(id) {
        return util.GET(`${baseURL}image/${id}`);
    }

    getBinaries() {
        return util.GET(`${baseURL}image/binary/`);
    }

    addImage(image) {
        return util.POST(`${baseURL}fw-image/image/`, image);
    }

    setBinary(image) {
        return util.POST_MULTIPART(`${baseURL}fw-image/image/${image.id}/binary`, image);
    }

    deleteBinary(id) {
        return util.DELETE(`${baseURL}fw-image/image/${id}/binary`);
    }

    deleteImage(id) {
        return util.DELETE(`${baseURL}fw-image/image/${id}`);
    }
}

const imageManager = new ImageManager();
export default imageManager;
