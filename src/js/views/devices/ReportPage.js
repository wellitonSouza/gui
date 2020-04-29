import React from 'react';
import axios from 'axios';
import moment from 'moment';
import NewWindow from 'react-new-window';
import PropTypes from "prop-types";
import Table from '../../components/table/Table.jsx';

class ReportTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            reportWindow: <div />,
        };
    }

    componentDidMount() {
        const token = window.localStorage.getItem('jwt');
        const {
            deviceId, attrs, dateFrom, dateTo, t,
        } = this.props;
        this.setState({ isLoading: true });
        const URL = `history/device/${deviceId}/history?attr=${attrs.join('&attr=')}&dateFrom=${moment(dateFrom).utc().format('YYYY-MM-DDTHH:mm')}&dateTo=${moment(dateTo).utc().format('YYYY-MM-DDTHH:mm')}`;
        axios.get(URL, { headers: { Authorization: `Bearer ${token}` } }).then((result) => {
            const reportWindow = Array.isArray(result.data) ? (
                <NewWindow>
                    <Table itemList={result.data} t={t} />
                </NewWindow>
            ) : (
                <NewWindow>
                    {Object.keys(result.data).map((value) => <Table itemList={result.data[value]} t={t} />)}
                </NewWindow>
            );
            this.setState({ isLoading: false, reportWindow });
        }).catch((err) => {
            const reportWindow = (
                <NewWindow>
                    <div style={
                        {
                            fontSize: 32,
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 500,
                            color: 'rgba(0,0,0,0.75)',
                        }
                    }
                    >
                        {t('report:reports.not_found')}
                    </div>
                </NewWindow>
            );
            this.setState({ reportWindow });
        });
    }

    render() {
        const { reportWindow } = this.state;
        return (
            <div>
                {reportWindow}
            </div>
        );
    }
}

ReportTable.defaultProps = {
};

ReportTable.propTypes = {
    deviceId: PropTypes.string.isRequired,
    attrs: PropTypes.array.isRequired,
    dateFrom: PropTypes.any.isRequired,
    dateTo: PropTypes.any.isRequired,
    t: PropTypes.func.isRequired,
};

export default ReportTable;
