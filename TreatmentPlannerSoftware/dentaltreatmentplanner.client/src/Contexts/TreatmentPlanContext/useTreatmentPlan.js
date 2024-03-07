import { useContext } from 'react';
import TreatmentPlanContext from './TreatmentPlanContext';

const useTreatmentPlan = () => {
    const context = useContext(TreatmentPlanContext);
    if (context === undefined) {
        throw new Error('useTreatmentPlan must be used within a TreatmentPlanProvider');
    }
    return context;
};

export default useTreatmentPlan;
