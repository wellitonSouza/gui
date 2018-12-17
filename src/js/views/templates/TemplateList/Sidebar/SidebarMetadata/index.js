import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import { DojotCustomButton } from 'Components/DojotButton';
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
                    <div className="sidebar-metadata">
                        <div className="header">
                            <span className="header-path">{'template>new attribute>meta'}</span>
                        </div>
                        <div className="body">
                            <MetadataCard
                                metadata={metadata}
                                handleChangeMetadata={handleChangeMetadata}
                            />
                        </div>
                        <div className="footer">
                            <DojotCustomButton label="discard" type="default" onClick={() => toogleSidebarMetadata()} />
                            {
                                isNewMetadata
                                    ? (<DojotCustomButton label="add" type="primary" onClick={addMetadata} />)
                                    : (
                                        <Fragment>
                                            <DojotCustomButton label="remove" type="secondary" onClick={() => toogleSidebarDelete('showDeleteMeta')} />
                                            <DojotCustomButton label="save" type="primary" onClick={updateMetadata} />
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
