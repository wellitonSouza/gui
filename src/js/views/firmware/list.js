import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ImageStore from '../../stores/ImageStore';
import ImageActions from '../../actions/ImageActions';
import TemplateStore from '../../stores/TemplateStore';
import TemplateActions from '../../actions/TemplateActions';
import { NewPageHeader } from "../../containers/full/PageHeader";
import AltContainer from 'alt-container';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router'
import { DojotBtnLink } from "../../components/DojotButton";
import util from '../../comms/util';
import LoginStore from '../../stores/LoginStore';
import { Loading } from "../../components/Loading";

// UI elements
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import MaterialInput from "../../components/MaterialInput";
import Materialize from "materialize-css";

// class ImageInfo extends Component {
//   constructor(props) {
//     super(props);
//     // this.state = {
//     //   active: true
//     // }
//     // this.selectImage = this.selectImage.bind(this);
//   }

//   // selectImage() {
//   //   this.props.selectImage(this.props.image.id);
//   // }

//   componentDidMount() {
//   }

//   render() {

//     return (
//       <div className="col s12"> Devices </div>
//     )
//   }
// }

class NewImageCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fw_version: ""
    }
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  componentDidMount() {
    // FirmwareActions.set(null);
  }

  save(e) {
    e.preventDefault();

    console.log("save");
    // let image = ImageStore.getState().new_image;
    // console.log('image', image);
    let img = { 
      template_id: this.props.template.id,
      fw_version: this.state.fw_version
    };
    console.log("image",img);
    ImageActions.triggerInsert(img, (img) => {
      Materialize.toast('Image created', 4000);
    });
    this.props.setNewImage(false);
  }

  cancel() {
    console.log("cancel");
    this.props.setNewImage(false);
  }

  handleChange(event) {
    event.preventDefault();
    // const f = event.target.name;
    // const v = event.target.value;
    // this.fw_version = event.target.value;
    // FirmwareActions.update({ f: f, v: v });
    this.setState({ fw_version: event.target.value });

    console.log("chacdnign")
  }

  render() {
    return (
    <div className="image-card">
        <div className="lst-blockquote col s12 blockblock">
          <div className="attr-row ">
          
            {/* <div className="attr-name">Firmware Version</div> */}
            <div className="input-field col s12">
                    <MaterialInput
              className="mt0px"
              id="fw_version"
              name="fw_version"
              value={this.state.fw_version}
              onChange={this.handleChange}
              > Firmware Version </MaterialInput>
            </div>

          </div>

          {/* <div className="attr-content black-attr-row">
            <label>No image saved. </label>
            <span>Binary Hash</span>
            <div className="searchBtn" title="Add a Binary file" onClick={this.openBinaryBox}>
              <i className="fa fa-search" />
            </div>
          </div> */}
          <div className="attr-row">
            <div className="row right">
              <div className="col s6">
                <button type="submit" className="btn-light btn-light-2 waves waves-light" onClick={this.save}>Save</button>
              </div>           
              <div className="col s6">
                <button type="button" className="btn-light btn-light-2 waves waves-light" onClick={this.cancel}>Cancel</button>
              </div>           
            </div>
          </div>

        </div >
      </div >
    )
  }
}

class ImageCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starred: false
    }
    this.images = [];
    this.clickStar = this.clickStar.bind(this);
    this.removeBinary = this.removeBinary.bind(this);
    this.openBinaryBox = this.openBinaryBox.bind(this);
  }

  openBinaryBox() {
    console.log("openBinaryBox");
    // this.props.changeState(0);
    // this.setState({ starred: !this.state.starred });
  }


  clickStar() {
    console.log("clickStar");
    // this.props.changeState(0);
    this.setState({ starred: !this.state.starred });
  }


  removeBinary(){
    // this.props.changeState(0);
  }

  componentDidMount() {
  }

  render() {

  let binaryInfo = null;
  if (this.props.image.has_image)
    binaryInfo = <div className="attr-content black-attr-row">
      <label>{this.props.image.sha1}</label>
      <span>Binary Hash</span>
      <div onClick={this.removeBinary} className="searchBtn" title="Remove Binary file">
        <i className="fa fa-trash" />
      </div>
      
    </div>;
  else
    binaryInfo = <div className="attr-content black-attr-row">
        <label>No image saved. </label>
        <span>Binary Hash</span>
        <div className="searchBtn" title="Add a Binary file" onClick={this.openBinaryBox.bind(this)}>
          <i className="fa fa-upload" />
        </div>
        
      </div>;
    

    return (
      <div className="image-card">
        <div className="lst-blockquote col s12">
          <div className="star" onClick={this.clickStar}>
            <i className={"fa " + (this.state.starred ? "fa-star" : "fa-star-o")} />
          </div>

          <div className="attr-row">
            <div className="icon">
              <img src={"images/update.png"} />
            </div>
            <div className={"attr-content"}>
              <label>{this.props.image.fw_version}</label>
              <span>Firmware Version</span>
            </div>
          </div>
          <div className="attr-row">
            <div className="icon">
              <img src={"images/update.png"} />
            </div>
            <div className={"attr-content"}>
              <label>{util.iso_to_date(this.props.image.created_at)} </label>
              <span>Created At</span>
            </div>
          </div>
          {binaryInfo}
          
        </div>
      </div>
    )
  }
}


class FirmwareCardImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creating: false
    }
    this.images = [];
    this.createNewImage = this.createNewImage.bind(this);
    this.setNewImage = this.setNewImage.bind(this);
  }

  createNewImage() {
    this.setState({ creating: true });
  }

  setNewImage(value)
  {
    this.setState({ creating: value });
  }

  componentDidMount() {
    console.log("entrou aqui");
  }

  render() {
    console.log("this.props.template_2",this.props.template);
    // this.images = this.props.images;
    console.log("this.props.images", this.props.images);

    let images = [];
    for (let img in this.props.images)
      images.push(this.props.images[img]);
    console.log("images",images);
      // return (
    //   null
    // )
    return (
      <div className={"card-size lst-entry-wrapper z-depth-2 firmware-card "}>
        <div className="lst-entry-title col s12">
          <img className="title-icon" src={"images/white-chip.png"} />
          <div className="title-text">
            <span className="text"> {this.props.template.label} 
            <br /><label className="label-explation" >Template Label</label>
            </span>
          </div>
        </div>
        <div className="attr-area attr-list light-background">
          {images.map((img, idx) => (
              <ImageCard image={img} key={idx} />
                ))}
          {this.state.creating === false &&  <div className="image-card">
            <div onClick={this.createNewImage} className="lst-blockquote col s12">
              <span className="new-image-text"> Create a new Image</span>
            </div>
          </div >}
          {this.state.creating === true && <NewImageCard setNewImage={this.setNewImage} template={this.props.template}/>}
        </div>

      </div>
    )
  }
}


class FirmwareCard extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    ImageActions.fetchImages.defer();
  }
  render() {
    return (
      <AltContainer store={ImageStore}>
        <FirmwareCardImpl template={this.props.template} />
      </AltContainer>
    )
  }
}


class ImageArea extends Component {
  constructor(props){
    super(props);
    this.filteredList = [];
    this.state = {
      active_image_id: 1
    }
    this.activeImage = this.activeImage.bind(this);
    this.getTemplateWithImages = this.getTemplateWithImages.bind(this);
  }

  getTemplateWithImages(tmplts)
  {
    return tmplts;
  }

  componentDidMount(){
  }

  activeImage(image_id) {
    console.log("changing active_image_id",image_id);
    this.setState({ active_image_id: image_id });
  }

  render(){

    console.log("this.props.templates", this.props.templates);
    // it happens when TemplateStore is loading
    console.log("this.props.loading", this.props.loading);
    if (this.props.loading == undefined || this.props.loading) {
      return (<Loading />);
    }

    this.filteredList = this.getTemplateWithImages(this.props.templates);
    // let selectedImage = this.filteredList[0];
    console.log("filteredList", this.filteredList);
    return(
      <div className="row bg-light-gray">
        <div className="col s12 data-frame p0">
            {this.filteredList.length == 0 ? (
              <span className="no-device-configured">
                No image available. 
                  </span>
            ) : (
                <div className="col s12 lst-wrapper extra-padding">
                  {this.filteredList.map((temp) => (
                  <FirmwareCard template={temp} key={temp.id} selectImage={this.activeImage.bind(this)}/>
                  ))}
                </div>
              )}
        </div>
        {/* <div className="col s4 template-frame">
          <ImageInfo image={selectedImage} />
        </div> */}

      </div>

    )
  }
}

class FirmwareUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = { showFilter: false };
    this.toggleSearchBar = this.toggleSearchBar.bind(this);
  }

  componentDidMount() {
    console.log("componentDidMount");
    // ImageActions.fetchImages.defer();
    TemplateActions.fetchTemplates.defer();
  }
  
  toggleSearchBar() {
    const last = this.state.showFilter;
    this.setState({ showFilter: !last });
  }

//   toggleDisplay() {
//     const last = this.state.displayList;
//     this.setState({ displayList: !last });
//   }

  render() {
    const detail =
      "detail" in this.props.location.query
        ? this.props.location.query.detail
        : null;

    return <ReactCSSTransitionGroup transitionName="first" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <NewPageHeader title="Firmware management" subtitle="" icon="device">
          {/* <Filter onChange={this.filterChange} /> */}
          {/*<Link to="/device/new" title="Create a new device" className="btn-item btn-floating waves-effect waves-light cyan darken-2">
            <i className="fa fa-plus"/>
          </Link> */}
           <div className="pt10">
            {/* <div className="searchBtn" title="Show search bar" onClick={this.toggleSearchBar.bind(this)}>
              <i className="fa fa-search" />
            </div> */}
            {/* <DojotBtnLink linkto="/device/new" label="New Image" alt="Create a new image" icon="fa fa-plus" /> */}
          </div>
        </NewPageHeader>
        <AltContainer store={TemplateStore}>
          <ImageArea showSearchBox={this.state.showFilter}  />
        </AltContainer>
      </ReactCSSTransitionGroup>;
  }
}

export { FirmwareUpdate };
