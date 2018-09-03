import TemplateActions from '../../actions/TemplateActions';
import { GenericOperations } from "../utils/Manipulation";

class TemplateOperations extends GenericOperations {

    constructor(props) {
        super(props);
        this.filterParams = { "sortBy": "label" };
        this.paginationParams = {};
        this.setDefaultPaginationParams();
    }


    whenUpdatePagination(config) {
        for (let key in config)
            this.paginationParams[key] = config[key];
        this._fetch();
    }

    whenUpdateFilter(config) {
        // set default parameters
        this.setDefaultPageNumber();
        this.filterParams = config;
        this._fetch();
    }
    
    _fetch() {
        let res = Object.assign({},this.paginationParams, this.filterParams);
        TemplateActions.fetchTemplates(res);
    }
}

export default TemplateOperations