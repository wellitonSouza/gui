import util from './util';

class ImageManager {
  constructor() {
    this.baseUrl = ""
  }

  getImages(id) {
    console.log("Template ID :",id);
    return util.GET(this.baseUrl + '/fw-image/image/');
  }


  getImage(id) {
    return util.GET(this.baseUrl + "/image/" + id);
  }


  addImage(image) {
    console.log("image to be saved: ", image);
    // d.id = util.sid();
    // var p2 = Promise.resolve({
    //   "template": {
    //     "template_id": d.template_id,
    //     "label": d.template_id,
    //     "images": [{
    //       "id": d.id,
    //       "fw_version": d.fw_version,
    //       "has_image": false,
    //       "created_at": Date.now(),
    //       "sha1": ""
    //     }]
    //   }
    // });
    // return p2;
    return util.POST(this.baseUrl + "/fw-image/image/", image);
  }

  setBinary(image) {
    console.log("setBinary", image);
    return util.POST_MULTIPART(this.baseUrl + "/fw-image/image/" + image.image_id + "/binary", image.binary);
    // return util.PUT(this.baseUrl + "/device/" + detail.id, detail);
  }


  deleteImage(id) {
    return util.DELETE(this.baseUrl + "/fw-image/image/" + id);
  }
}

var imageManager = new ImageManager();
export default imageManager;
