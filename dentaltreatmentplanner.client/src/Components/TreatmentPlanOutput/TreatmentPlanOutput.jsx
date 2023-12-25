import PropTypes from 'prop-types';
import './TreatmentPlanOutput.css';
import Table from "../Table/Table";
import { sortTreatmentPlan } from '../../Utils/helpers';

const TreatmentPlanOutput = ({ treatmentPlan }) => {
    const { sortedVisits } = sortTreatmentPlan(treatmentPlan);

    const renderVisitTable = (visit) => {

        const headers = ['Tooth #', 'CDT Code', 'Description'];

        const rows = visit.cdtCodes.map((cdtCode) => [
            treatmentPlan.toothNumber,
            cdtCode.code,
            cdtCode.longDescription
        ]);
        // unique table ID for each visit
        const tableId = `visit-${visit.visitId}`;

        return <Table headers={headers} rows={rows} tableId={tableId} enableDragDrop={false} />;
    };

    return (
        <div>
            {sortedVisits.map(visit => (
                <div key={visit.visitId} className="visit-section">
                    <div className="visit-number">Visit {visit.visitNumber}</div>
                    {renderVisitTable(visit)}
                </div>
            ))}
        </div>
    );
};


// Expected prop types
TreatmentPlanOutput.propTypes = {
    treatmentPlan: PropTypes.shape({
        description: PropTypes.string,
        toothNumber: PropTypes.number,
        visits: PropTypes.arrayOf(PropTypes.shape({
            visitId: PropTypes.number.isRequired,
            description: PropTypes.string,
            cdtCodes: PropTypes.arrayOf(PropTypes.shape({
                code: PropTypes.string.isRequired,
                longDescription: PropTypes.string
            })).isRequired
        })).isRequired
    })
};

export default TreatmentPlanOutput;