import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { FilePond, File, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import toaster from '../../comms/util/materialize';
import ImportExport from './ImportExport';
import HeadImportExport from './HeadImportExport';
import ModalAlert from './ModalAlert';
import ImportExportAction from '../../actions/ImportExportAction';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

export default class Import extends Component {
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
        const { file } = this.state;
        if (file.length === 0) {
            return toaster.error('Select a file!');
        }
        if (file[0].type !== 'application/json') {
            return toaster.error('Wrong type, only accept application!');
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
                    toaster.error('Error reading file');
                }
            };
            reader.onerror = () => {
                toaster.error('Error reading file');
            };
        } else {
            toaster.error('Select one file!');
        }
    }

    render() {
        const label = 'Save';
        const title = 'Import new datas';
        const firstMessage = 'You will remove all data. Are you sure?';
        const { showModal, file, success } = this.state;
        const { openModal } = this.props;
        return (
            <div>
                <ImportExport
                    openModal={openModal}
                    toggleSidebar={this.dismiss}
                    save
                    label="Import"
                    handleClick={this.handleOpenModal}
                >
                    <HeadImportExport main icon="import-icon" title="Import" firstMessage="Drag the a file JSON to restore your data." />
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
                    { showModal ? (<ModalAlert
                        title={title}
                        openModal={this.openModal}
                        firstMessage={firstMessage}
                        label={label}
                        click={this.uploadFile}
                        img="warning"
                        cancel
                        back={this.dismiss}
                    />
                    ) : null }
                    {success ? (<ModalAlert
                        title="Success"
                        openModal={this.openModal}
                        firstMessage="All datas imported"
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
};
