import React from 'react';
import Slide from 'react-reveal/Slide';
import { DojotCustomButton } from 'Components/DojotButton';
import AttrCard from './AttrCard';

const SidebarDeviceAttrs = () => (
    <Slide right when={true}>
        <div className="sidebar-device-attrs">
            <div className="header">
                <div className="title">
                    {'Manage Attributes'}
                </div>
                <div className="icon">
                    <img src="images/icons/chip-cyan.png" alt="device-icon" />
                </div>
            </div>
            <div className="body">
                <div className="title">
                    {'device > attribute'}
                </div>
                <div className="attr-type">
                    {'Static Value'}
                </div>
                <div className="attrs-list">
                    <AttrCard />
                </div>
            </div>
            <div className="footer">
                <DojotCustomButton
                    onClick={console.log('teste')}
                    label="discard"
                    type="default"
                />
                <DojotCustomButton
                    onClick={console.log('teste')}
                    label="save"
                    type="primary"
                />
            </div>
        </div>
    </Slide>
);

export default SidebarDeviceAttrs;
