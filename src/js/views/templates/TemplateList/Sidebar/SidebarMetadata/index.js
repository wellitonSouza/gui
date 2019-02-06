import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import { DojotBtnClassic } from 'Components/DojotButton';
import Can from 'Components/permissions/Can';
import MetadataCard from './MetadataCard';
import SidebarDelete from '../SidebarDelete';
import { metadataType } from '../../../TemplatePropTypes';

const SidebarMetadata = ({
    showMetadata,
    toogleSidebarMetadata,
    addMetadata,
    updateMetadata,
    metadata,
    handleChangeMetadata,
    showDeleteMeta,
    removeSelectMeta,
    toogleSidebarDelete,
    isNewMetadata,
}) => (
    <Fragment>
        <Slide right when={showMetadata} duration={300}>
            { !showMetadata
                ? <div />
                : (
                    <div className="-sidebar sidebar-metadata">
                        <div className="header">
                            <div className="title">meta attributes</div>
                            <div className="icon">
                                <img src="images/icons/template-cyan.png" alt="device-icon" />
                            </div>
                            <div className="header-path">
                                {'template > new attribute > meta'}
                            </div>
                        </div>
                        <div className="body">
                            <MetadataCard
                                metadata={metadata}
                                handleChangeMetadata={handleChangeMetadata}
                            />
                        </div>
                        <div className="footer">
                            <DojotBtnClassic label="discard" type="secondary" onClick={() => toogleSidebarMetadata()} />
                            {
                                isNewMetadata

                                    ? (
                                        <Can do="modifier" on="template">
                                            <DojotBtnClassic color="blue" label="add" type="primary" onClick={addMetadata} />
                                        </Can>
                                    )
                                    : (
                                        <Fragment>
                                            <Can do="modifier" on="template">
                                                <DojotBtnClassic label="remove" type="secondary" onClick={() => toogleSidebarDelete('showDeleteMeta')} />
                                                <DojotBtnClassic color="red" label="save" type="primary" onClick={updateMetadata} />
                                            </Can>
                                        </Fragment>
                                    )
                            }
                        </div>
                    </div>
                )
            }
        </Slide>
        <SidebarDelete
            cancel={() => toogleSidebarDelete('showDeleteMeta')}
            confirm={removeSelectMeta}
            showSidebar={showDeleteMeta}
            message="You are about to remove this metadata. Are you sure?"
        />
    </Fragment>
);

SidebarMetadata.defaultProps = {
    showMetadata: false,
    showDeleteMeta: false,
    isNewMetadata: false,
};

SidebarMetadata.propTypes = {
    showMetadata: PropTypes.bool,
    toogleSidebarMetadata: PropTypes.func.isRequired,
    addMetadata: PropTypes.func.isRequired,
    updateMetadata: PropTypes.func.isRequired,
    metadata: PropTypes.shape(metadataType).isRequired,
    handleChangeMetadata: PropTypes.func.isRequired,
    showDeleteMeta: PropTypes.bool,
    removeSelectMeta: PropTypes.func.isRequired,
    toogleSidebarDelete: PropTypes.func.isRequired,
    isNewMetadata: PropTypes.bool,
};

export default SidebarMetadata;
