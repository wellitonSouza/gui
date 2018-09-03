import React from 'react';

import { NewPagination, FilterLabel } from "../../utils/Manipulation";
import { CustomHeader } from "../../../containers/full/PageHeader";
import TemplateFilter from './TemplateFilter';

const NewTempĺate = (props) => {
    return (
        <div className="new-template-wrapper">
            <div className="searchBtn" title="Show search bar" onClick={props.toggleSearchBar}>
                <i className="fa fa-search" />
            </div>
            <div onClick={props.addTemplate} className="new-btn-flat red" title="Create a new template">
                New Template<i className="fa fa-plus" />
            </div>
        </div>
    )
}

const TemplateHeader = (props) => {
    console.log('TemplateHeader', props);
    return (
        <div>
            <CustomHeader title="Templates" subtitle="Templates" icon="template">
                <NewPagination show_pagination={true} ops={props.tempOpex} {...props}/>
                <NewTempĺate {...props} />
            </CustomHeader>  
            
        </div>
    )
}

export default TemplateHeader