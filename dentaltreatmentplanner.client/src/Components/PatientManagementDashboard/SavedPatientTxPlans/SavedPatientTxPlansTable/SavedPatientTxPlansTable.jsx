import PropTypes from 'prop-types';

const SavedTxPlansTable = ({ headers, rows }) => {
    return (
        <div className="table-container">
            <table className="tx-table">
                <thead>
                    <tr className="table-inner-header">
                        {headers.map((header, index) => (
                            <th key={`header-${index}`}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((rowData, rowIndex) => (
                        <tr key={`row-${rowIndex}`}>
                            {rowData.data.map((cell, cellIndex) => (
                                <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

SavedTxPlansTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    rows: PropTypes.arrayOf(PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.node)
    })).isRequired
};

export default SavedTxPlansTable;
