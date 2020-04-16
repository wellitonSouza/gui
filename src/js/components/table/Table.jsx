import React from 'react';
import moment from 'moment';
import styles from './style.scss';


const Table = (props) => {
    const {
        itemList = [], isFetching = false,
    } = props;

    const row = itemList.map((item) => {
        const {
            attr,
            value,
            device_id,
            ts,
        } = item;
        return (
            <tr>
                <td>{attr}</td>
                <td>
                    {
                        typeof (value) === 'object' ? JSON.stringify(value)
                            : value.toString()
                    }
                </td>
                <td>{moment(ts).format('DD/MM/YYYY HH:mm:ss')}</td>

            </tr>
        );
    });

    const tableHTML = (
        <div className={styles.tableScrollable}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th key="1234">Atributo</th>
                        <th key="1224">Valor</th>
                        <th key="1214">Data</th>
                    </tr>
                </thead>
                <tbody>
                    {row}
                </tbody>
            </table>
        </div>
    );
    return (
        <div className={styles.tableContainer}>
            {isFetching ? <div className={styles.tableScrollable} /> : tableHTML}
        </div>
    );
};

export default Table;
