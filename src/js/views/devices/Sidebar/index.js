import React from 'react';
// import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import MaterialInput from '../../../components/MaterialInput';
import TemplateBagde from './TemplateBadge';


const Sidebar = () => (
    <Slide right>
        <div className="device-sidebar">
            <div className="header">
                <div className="title">
                     new device
                </div>
                <div className="icon">
                    <img src="images/icons/chip-cyan.png" alt="device-icon" />
                </div>
            </div>
            <div className="body">
                <div className="title">
                    new device
                </div>

                <div className="device-name">
                    <div className="label">1. Set a name</div>
                    <div className="device-name-input">
                        <MaterialInput
                            name="name"
                            maxLength={40}
                        >
                            Name
                        </MaterialInput>
                    </div>
                </div>

                <div className="device-templates">
                    <div className="label">2. Add or Remove Templates</div>
                    <div className="template-list">
                        <div className="add-template-button">+</div>
                        <div className="list">
                            <TemplateBagde />
                            <TemplateBagde />
                            <TemplateBagde />
                        </div>
                    </div>

                </div>

                <div className="device-attrs">
                    <div className="label">3. Manage Attributes</div>
                </div>

            </div>

            <div className="footer">
                {/* <DojotCustomButton label="discard" /> */}
                {/* <DojotCustomButton label="save" type="primary" /> */}
            </div>
        </div>
    </Slide>
);

export default Sidebar;
