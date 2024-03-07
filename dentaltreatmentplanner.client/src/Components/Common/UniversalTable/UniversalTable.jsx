import PropTypes from 'prop-types';

const UniversalTable = ({ headers, rows, columnWidths = [] }) => {
    return (
        <div className="table-container">
            <table className="tx-table">
                <thead>
                    <tr className="table-inner-header">
                        {headers.map((header, index) => (
                            // Apply width only if columnWidths[index] is defined
                            <th key={`header-${index}`} style={columnWidths[index] ? { width: columnWidths[index] } : {}}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((rowData, rowIndex) => (
                        <tr key={`row-${rowIndex}`}>
                            {rowData.data.map((cell, cellIndex) => (
                                // Apply width only if columnWidths[cellIndex] is defined
                                <td key={`cell-${rowIndex}-${cellIndex}`} style={columnWidths[cellIndex] ? { width: columnWidths[cellIndex] } : {}}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

UniversalTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    rows: PropTypes.arrayOf(PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.node)
    })).isRequired,
    columnWidths: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
};

// Making columnWidths optional
UniversalTable.defaultProps = {
    columnWidths: []
};

export default UniversalTable;
