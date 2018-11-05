import React, { Component } from 'react';
import AltContainer from 'alt-container';
import RoleStore from '../../stores/RoleStore';
import RoleActions from '../../actions/RoleActions';
import { NewPageHeader } from '../../containers/full/PageHeader';
import { DojotBtnLink } from '../../components/DojotButton';


function SummaryItem(obj) {
    return (
        <div className="col s9 push-s1 m4 l3 card-size card-hover lst-entry-wrapper z-depth-2">
            <div className="row lst-entry-title">
                <div className="card-title">
                    <img className="title-icon" src="images/generic-user-icon.png" alt="tt" width="100%" />
                </div>
                {/*  <i className="title-icon fas fa-user-lock  fa-fw horizontal-center" /> */}
                <div className=" title-text truncate" title={obj.group.name}>
                    <span className="text">
                        {obj.group.name}
                    </span>
                </div>
            </div>
            <div className="">
                <div className="attr-area light-background">
                    <div className="row">
                        <div className="col s2">
                            <img src="images/usr-icon.png" alt="tex" width="100%" />
                            {/*         <i className="title-icon fas fa-info" /> */}
                        </div>
                        <div className="col s10 truncate" title={obj.group.description}>
                            <div className="">
                                {obj.group.description}
                            </div>
                            <span>Description</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ListT(param) {
    if (param.groups) {
        return (
            <div className="fill">
                {param.groups.map(obj => <SummaryItem group={obj} />)}
            </div>);
    }
}


function OperationsHeader(param) {
    return (
        <div className="col s12 pull-right pt10">
            <DojotBtnLink
                responsive="true"
                onClick={param.newGroup}
                label="New Role"
                alt="Create a new role"
                icon="fa fa-plus"
                className="w130px"
            />
        </div>

    );
}

class Roles extends Component {
    constructor(props) {
        super(props);
        this.newGroup = this.newGroup.bind(this);
        this.state = {};
    }

    componentDidMount() {
        RoleActions.fetchGroups.defer();
    }

    componentWillUnmount() {

    }

    componentDidCatch(error, info) {
        console.log('componentDidCatch 1', error);
        console.log('componentDidCatch 2', info);
    }

    newGroup(e) {
        console.log('newGroup');
    }

    render() {
        return (
            <div id="roles-wrapper">
                <AltContainer store={RoleStore}>
                    <NewPageHeader title="Roles" subtitle="xxxx" icon="user">
                        <OperationsHeader newGroup={this.newGroup} />
                    </NewPageHeader>
                    <ListT />
                </AltContainer>
            </div>
        );
    }
}


export default Roles;
