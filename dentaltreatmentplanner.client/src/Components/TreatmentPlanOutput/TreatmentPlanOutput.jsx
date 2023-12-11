import React from 'react';
import PropTypes from 'prop-types';
import './TreatmentPlanOutput.css';

const TreatmentPlanOutput = ({ treatmentPlan }) => {
    // Function to sort visits based on the order
    //const sortedVisits = (visits) => {
        //return visits.sort((a, b) => a.Order - b.Order); // Use the Order property directly from visit
    //};
    return (
        <div className="treatment-plan-output-section-inner">
            <div className="large-text">Treatment Plan</div>
            {treatmentPlan && (
                <div className="output-section-table-container">
                    {treatmentPlan.visits.map((visit, visitIndex) => (
                        <div key={visit.visitId} className={`visit-section ${visitIndex > 0 ? 'visit-separator' : ''}`}>
                            <div className="visit-number">Visit {visit.visitNumber}</div>
                            <table className="visit-table">
                                <thead>
                                    <tr className="visit-header">
                                        <th>Tooth #</th>
                                        <th>CDT Code</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visit.cdtCodes.map((cdtCode, cdtIndex) => (
                                        <tr key={`${visit.visitId}-${cdtIndex}`}>
                                            <td>{treatmentPlan.toothNumber}</td>
                                            <td>{cdtCode.code}</td>
                                            <td>{cdtCode.longDescription}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}
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
