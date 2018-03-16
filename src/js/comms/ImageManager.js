import util from './util';

class ImageManager {
  constructor() {
    this.baseUrl = ""
  }

  getImages() {
    console.log("getImages");
    var p2 = Promise.resolve({
      "template": {
        "template_id": 1,
        "label": "Template_01",
        "images": [{
          "id": "1",
          "fw_version": "1.0.0 alpha",
          "has_image": false,
          "created_at": "2018-03-11T23:43:28.121344+00:00",
          "sha1": "cf23df2207d99a74fbe169e3eba035e633b65d94"
        }]
      }
    });
    return p2;
    // return util.GET(this.baseUrl + '/image');
  }


  getImage(id) {
    return util.GET(this.baseUrl + "/image/" + id);
  }

  setImage(detail) {
    return util.PUT(this.baseUrl + "/image/" + detail.id, detail);
  }

  addImage(d) {
    d.id = util.sid();
    var p2 = Promise.resolve({
      "template": {
        "template_id": d.template_id,
        "label": d.template_id,
        "images": [{
          "id": d.id,
          "fw_version": d.fw_version,
          "has_image": false,
          "created_at": Date.now(),
          "sha1": ""
        }]
      }
    });
    return p2;


    // return util.POST(this.baseUrl + "/image", d);
  }

  deleteImage(id) {
    return util.DELETE(this.baseUrl + "/image/" + id);
  }
}

var imageManager = new ImageManager();
export default imageManager;
