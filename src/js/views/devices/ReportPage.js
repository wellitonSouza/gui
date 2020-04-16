import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import NewWindow from 'react-new-window';
import Table from '../../components/table/Table.jsx';

export default class ReportTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            reportWindow: {},
        };
    }

    componentDidMount() {
        const token = window.localStorage.getItem('jwt');
        const {
            deviceId, attrs, dateFrom, dateTo,
        } = this.props;
        this.setState({ isLoading: true });
        const URL = `history/device/${deviceId}/history?attr=${attrs.join('&attr=')}&dateFrom=${moment(dateFrom).utc().format('YYYY-MM-DDTHH:mm')}&dateTo=${moment(dateTo).utc().format('YYYY-MM-DDTHH:mm')}`;
        axios.get(URL, { headers: { Authorization: `Bearer ${token}` } }).then((result) => {
            const reportWindow = Array.isArray(result.data) ? (
                <NewWindow>
                    <Table itemList={result.data} />
                </NewWindow>
            ) : (
                <NewWindow>
                    {Object.keys(result.data).map(value => <Table itemList={result.data[value]} />)}
                </NewWindow>
            );
            this.setState({ isLoading: false, reportWindow });
        }).catch((err) => {
            console.error(err);
        });
    }

    render() {
        const { isLoading, reportWindow } = this.state;
        if (isLoading) {
            return (<div />);
        }
        return (
            <div>
                { reportWindow }
            </div>
        );
    }
}
