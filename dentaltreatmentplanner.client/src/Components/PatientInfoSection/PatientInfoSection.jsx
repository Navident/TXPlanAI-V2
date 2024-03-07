import { useState } from "react";
import RoundedButton from "../Common/RoundedButton/RoundedButton";
import { useBusiness } from "../../Contexts/BusinessContext/useBusiness";
import { useNavigate, useLocation } from "react-router-dom";
import {
	StyledPatientInfoInnerContainer,
	StyledGridItem,
	StyledGridItemLabel,
	StyledGridItemLabelAndValueText,
	StyledGridItemValueText,
} from "./index.style";
import {
	StyledRoundedBoxContainer,
	StyledUnderlinedText,
} from "../../GlobalStyledComponents";
import DropdownSearch from "../../Components/Common/DropdownSearch/DropdownSearch";
import { useSelector, useDispatch } from 'react-redux';
import {
	selectPayersForFacility,
	selectSelectedPayer,
	setSelectedPayer as setReduxSelectedPayer
} from '../../Redux/ReduxSlices/CdtCodesAndPayers/cdtCodeAndPayersSlice';

const PatientInfoSection = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { selectedPatient } = useBusiness();
	const payers = useSelector(selectPayersForFacility);
	console.log("Payers in PatientInfoSection: ", payers);
	const selectedPayer = useSelector(selectSelectedPayer);

	// Determine which button to show based on the current route
	const showCreateNewTxPlanButton = location.pathname.includes(
		"/saved-patient-tx-plans"
	);
	const showViewSavedTxPlansButton =
		location.pathname === "/PatientManagementDashboard";

	const handleViewSavedTxPlansClick = () => {
		if (selectedPatient && selectedPatient.patientId) {
			navigate(
				`/PatientManagementDashboard/saved-patient-tx-plans/${selectedPatient.patientId}`
			);
		} else {
			alert("Please select a patient first.");
		}
	};

	const redirectToFeeScheduling = () => {
		navigate("/dashboard/feescheduling");
	};

	const handleCreateNewTxPlanClick = () => {
		navigate(`/PatientManagementDashboard`);
	};

	const handlePayerSelect = (payer) => {
		const adjustedSelectedPayer = {
			...payer,
			value: payer.payerId,
		};
		dispatch(setReduxSelectedPayer(adjustedSelectedPayer));
	};

	const renderPayerDropdown = () => {
		console.log("Current Selected Payer State in render:", selectedPayer);
		const payerOptions = payers ? payers.map((payer) => ({
			id: payer.id,
			...payer,
		})) : [];
		return (
			<DropdownSearch
				items={payerOptions}
				selectedItem={selectedPayer}
				onSelect={handlePayerSelect}
				itemLabelFormatter={(payer) => `${payer.payerName}`}
				valueKey="payerId"
				labelKey="payerName"
			/>
		);
	};

	return (
		<StyledRoundedBoxContainer>
			<StyledPatientInfoInnerContainer>
				<StyledGridItem>
					<StyledGridItemLabel>Name:</StyledGridItemLabel>
					<StyledGridItemValueText>
						{selectedPatient
							? `${selectedPatient.firstName} ${selectedPatient.lastName}`
							: "Select a patient"}
					</StyledGridItemValueText>
				</StyledGridItem>
				<StyledGridItem $flexDirection="column" $alignItems="flex-start">
					<StyledGridItemLabelAndValueText>
						<StyledGridItemLabel>DOB:</StyledGridItemLabel>
						<StyledGridItemValueText>
							{selectedPatient
								? new Date(selectedPatient.dateOfBirth).toLocaleDateString(
									"en-CA"
								)
								: ""}
						</StyledGridItemValueText>
					</StyledGridItemLabelAndValueText>
					<StyledGridItemLabelAndValueText>
						<StyledGridItemLabel>PATIENT ID:</StyledGridItemLabel>
						<StyledGridItemValueText>
							{" "}
							{selectedPatient ? selectedPatient.patientId : ""}{" "}
						</StyledGridItemValueText>
					</StyledGridItemLabelAndValueText>
				</StyledGridItem>
				<StyledGridItem $flexDirection="column" $alignItems="flex-start">
					<StyledGridItemLabelAndValueText>
						<StyledGridItemLabel>
							Payer:
							{renderPayerDropdown()}
						</StyledGridItemLabel>
					</StyledGridItemLabelAndValueText>
					<StyledUnderlinedText onClick={redirectToFeeScheduling}>
						Create a new payer
					</StyledUnderlinedText>
				</StyledGridItem>
				<StyledGridItem>
					<div className="patient-info-inner-buttons">
						{showCreateNewTxPlanButton && (
							<RoundedButton
								text="Create New TX Plan"
								backgroundColor="#7777a1"
								textColor="white"
								border={false}
								width="fit-content"
								className="purple-button-hover"
								onClick={handleCreateNewTxPlanClick}
							/>
						)}
						{showViewSavedTxPlansButton && (
							<RoundedButton
								text="View Saved TX Plans"
								backgroundColor="white"
								textColor="#7777a1"
								border={true}
								width="fit-content"
								borderColor="#7777a1"
								className="outline-button-hover"
								onClick={handleViewSavedTxPlansClick}
							/>
						)}
					</div>
				</StyledGridItem>
			</StyledPatientInfoInnerContainer>
		</StyledRoundedBoxContainer>
	);
};

export default PatientInfoSection;
