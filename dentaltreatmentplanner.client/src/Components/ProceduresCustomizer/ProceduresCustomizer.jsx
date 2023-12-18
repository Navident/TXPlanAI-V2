
import './ProceduresCustomizer.css';
import HeaderBar from "../HeaderBar/HeaderBar";
import circleIcon from '../../assets/circle-icon.svg';
import dragIcon from '../../assets/drag-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTreatmentPlansBySubcategory } from '../../ClientServices/apiService';
import TreatmentPlanOutput from "../TreatmentPlanOutput/TreatmentPlanOutput";

import { getCdtCodes } from '../../ClientServices/apiService';

const ProceduresCustomizer = () => {
    const [treatmentPlans, setTreatmentPlans] = useState([]);
    const [cdtCodes, setCdtCodes] = useState([]);
    const params = useParams();
    const subcategory = params.subcategory;


    useEffect(() => {
        getCdtCodes(setCdtCodes); // Fetch CDT codes when component mounts    
    }, []); 

    useEffect(() => {
        if (subcategory) {
            console.log("Attempting to retrieve treatment plan by subcategory now");
            getTreatmentPlansBySubcategory(subcategory, setTreatmentPlans);
        }
    }, [subcategory]); 

    return (
        <div className="procedure-customizer-wrapper">
            <div className="tx-container">
                <HeaderBar
                    leftCornerElement={<img src={circleIcon} alt="Circle Icon" />}
                    rightCornerElement={<img src={userIcon} alt="User Icon" />}
                    className="dashboard-header"
                />
                <div className="tx-main-content">
                    <div className="tx-content-area">
                        <div className="large-text">Edit Procedure Defaults</div>
                        <div className="edit-procedures-container">
                            <div className="edit-procedures-inner">
                                <div className="large-text">Procedure Category: Crowns</div>
                                <div className="large-text">Procedure Sub-Category: {subcategory}</div>
                                <div>
                                    {cdtCodes.length > 0 && treatmentPlans.map((plan, index) => (
                                        <TreatmentPlanOutput
                                            key={index}
                                            treatmentPlan={plan}
                                            includeExtraRow={true}
                                            cdtCodes={cdtCodes} 
                                            addProcedureElement={<span>+ Add Procedure</span>}
                                            useImageIconColumn={true} // When this is true we swap with the tooth column
                                            imageIconSrc={dragIcon} // when we swapping tooth column we pass the image icon
                                            hideToothNumber={true} //when this is true we hide the tooth number column contents
                                        />
                                    ))}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
    );
};

export default ProceduresCustomizer;
