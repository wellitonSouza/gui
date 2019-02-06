import PropTypes, { func } from 'prop-types';
import React, { Component } from 'react';
import { DojotBtnClassic } from '../DojotButton';

export default class ImportExport extends Component {
    constructor(props) {
        super(props);

        this.dismiss = this.dismiss.bind(this);
    }

    dismiss() {
        const { openModal, toggleSidebar } = this.props;
        openModal(false);
        toggleSidebar();
    }

    render() {
        const {
            children,
            handleClick,
            save,
            label,
        } = this.props;
        return (
            <div>
                <div className="import-export row">
                    <div className="main-head">
                        {React.Children.map(children, (child, i) => {
                        // Aceita só o primeiro elemento filho
                            if (i >= 1) return null;
                            return child;
                        })}
                    </div>
                    <div className="main">
                        {React.Children.map(children, (child, i) => {
                        // Ignora o primeiro elemento filho
                            if (i < 1) return null;
                            return child;
                        })}
                    </div>
                    <div className="footer">
                        <DojotBtnClassic is_secondary onClick={this.dismiss} label="Cancel" title="Cancel" />
                        {save ? (
                            <DojotBtnClassic
                                is_secondary={false}
                                onClick={handleClick}
                                label={label}
                                title={label}
                            />
                        )
                            : null }
                    </div>
                </div>
                <div className="rightsidebar" onClick={() => this.dismiss()} onKeyPress={this.dismiss} role="button" tabIndex={0} />
            </div>
        );
    }
}

ImportExport.propTypes = {
    openModal: PropTypes.func.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    save: PropTypes.bool.isRequired,
    label: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleClick: PropTypes.func,

};

ImportExport.defaultProps = {
    label: '',
    handleClick: func,
};
