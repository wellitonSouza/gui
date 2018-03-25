import util from './util';

class ImageManager {
  constructor() {
    this.baseUrl = ""
  }

  getImages() {
    console.log("getImages");
    // var p2 = Promise.resolve({
    //   "template": {
    //     "template_id": 1,
    //     "label": "Template_01",
    //     "images": [{
    //       "id": "1",
    //       "fw_version": "1.0.0 alpha",
    //       "has_image": false,
    //       "created_at": "2018-03-11T23:43:28.121344+00:00",
    //       "sha1": "cf23df2207d99a74fbe169e3eba035e633b65d94"
    //     }]
    //   }
    // });
/*     var p2 = Promise.resolve([
      {
        "created": "2018-02-08T12:25:11.979313+00:00",
        "confirmed": true,
        "label": "ExampleFW",
        "fw_version": "1.0.0-rc1",
        "sha1": "cf23df2207d99a74fbe169e3eba035e633b65d94",
        "id": "b60aa5e9-cbe6-4b51-b76c-08cf8273db07"
      },
      {
        "confirmed": false,
        "created": "2018-02-22T21:30:39.740576+00:00",
        "fw_version": "3.0.0-rc1",
        "id": "c929e347-0cd3-4925-a9ed-44ec59f7a1b9",
        "label": "ExampleFW",
        "sha1": "87acec17cd9dcd20a716cc2cf67417b71c8a0000"
      }

    ])

    return p2;
*/
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
