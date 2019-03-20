import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { FilePond, File, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import toaster from '../../comms/util/materialize';
import ImportExport from './ImportExport';
import HeadImportExport from './HeadImportExport';
import ModalAlert from './ModalAlert';
import ImportExportAction from '../../actions/ImportExportAction';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

class Import extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            file: [],
        };
        this.pond = createRef();
        this.file = createRef();
        this.dismiss = this.dismiss.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    dismiss() {
        const { openModal } = this.props;
        openModal(false);
    }

    handleOpenModal() {
        const { t } = this.props;
        const { file } = this.state;
        if (file.length === 0) {
            return toaster.error(t('importExport:import.error.file'));
        }
        if (file[0].type !== 'application/json') {
            return toaster.error(t('importExport:import.error.type'));
        }
        return this.setState({ showModal: true });
    }

    openModal(status) {
        this.setState({ showModal: status });
    }

    success(status) {
        this.setState({ success: status });
    }

    handleSuccess() {
        global.location.reload();
    }

    uploadFile() {
        const { t } = this.props;
        const { file } = this.state;
        const text = file[0];
        if (file.length > 0) {
            const reader = new global.FileReader();
            reader.readAsText(text, 'UTF-8');
            reader.onload = (evt) => {
                let json = '';
                try {
                    json = JSON.parse(evt.target.result);
                    ImportExportAction.import(json);
                    this.success(true);
                } catch (err) {
                    toaster.error(t('importExport:import.error.read'));
                }
            };
            reader.onerror = () => {
                toaster.error(t('importExport:import.error.read'));
            };
        } else {
            toaster.error(t('importExport:import.error.file'));
        }
    }

    render() {
        const { showModal, file, success } = this.state;
        const { t, openModal } = this.props;
        const label = t('importExport:import.btnModal');
        const title = t('importExport:import.titleModal');
        const firstMessage = t('importExport:import.subtitleModal');
        return (
            <div>
                <ImportExport
                    openModal={openModal}
                    toggleSidebar={this.dismiss}
                    save
                    label={t('importExport:import.title')}
                    handleClick={this.handleOpenModal}
                >
                    <HeadImportExport
                        main
                        icon="import-icon"
                        title={t('importExport:import.titleMain')}
                        firstMessage={t('importExport:import.subtitle')}
                    />
                    <FilePond
                        ref={this.pond}
                        onupdatefiles={(fileItems) => {
                            this.setState({
                                file: fileItems.map(fileItem => fileItem.file),
                            });
                        }}
                        allowFileTypeValidation
                        acceptedFileTypes={['application/json']}
                        allowFileSizeValidation
                        maxTotalFileSize={314572800}
                    >
                        {file.map(files => (
                            <File
                                key={files}
                                src={files}
                                origin="local"
                            />
                        ))}
                    </FilePond>
                    {showModal ? (
                        <ModalAlert
                            title={title}
                            openModal={this.openModal}
                            firstMessage={firstMessage}
                            label={label}
                            click={this.uploadFile}
                            img="warning"
                            cancel
                            back={this.dismiss}
                        />
                    ) : null}
                    {success ? (
                        <ModalAlert
                            title={t('importExport:import.titleSuccess')}
                            openModal={this.openModal}
                            firstMessage={t('importExport:import.subtitleSuccess')}
                            label={label}
                            click={this.handleSuccess}
                            img="check-circle"
                            back={this.handleSuccess}
                        />
                    ) : null}
                </ImportExport>
            </div>
        );
    }
}

Import.propTypes = {
    openModal: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
};

export default translate()(Import);
