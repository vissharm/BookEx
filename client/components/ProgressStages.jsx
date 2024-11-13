import React, { useEffect, useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Modal,
  Stack,
  TextField,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  Badge,
} from '@mui/material';

// const defaultStages = [
//   {
//     id: 1,
//     label: 'Order placed',
//     date: '2024-01-10',
//     userAssignable: true, // Indicates if this user can update the stage
//     completed: true,
//     controls: [
//       { type: 'date', label: 'Approval Code', name: 'approvalCode', value: '24/11/2016' },
//       { type: 'checkbox', label: 'Manager Approved', name: 'managerApproved', value: true },
//     ]
//   },
//   {
//     id: 2,
//     label: 'Approval',
//     date: '2024-01-12',
//     userAssignable: true, // Indicates this stage is for another user
//     completed: true,
//     controls: [
//       { type: 'text', label: 'Approval Code', name: 'approvalCode', value: '' },
//       { type: 'checkbox', label: 'Manager Approved', name: 'managerApproved', value: false },
//     ]
//   },
//     {
//       id: 3,
//     label: 'Order placed2',
//     date: '2024-01-10',
//     userAssignable: true, // Indicates if this user can update the stage
//     completed: false,
//     controls: [
//       { type: 'date', label: 'Approval Code', name: 'approvalCode', value: '' },
//       { type: 'checkbox', label: 'Manager Approved', name: 'managerApproved', value: false },
//     ]
//   },
//   {
//     id: 4,
//     label: 'Approval2',
//     date: '2024-01-12',
//     userAssignable: false, // Indicates this stage is for another user
//     completed: false,
//     controls: [
//       { type: 'text', label: 'Approval Code', name: 'approvalCode', value: '' },
//       { type: 'checkbox', label: 'Manager Approved', name: 'managerApproved', value: false },
//     ]
//   },
//     {
//       id: 5,
//     label: 'Order placed3',
//     date: '2024-01-10',
//     userAssignable: true, // Indicates if this user can update the stage
//     completed: false,
//     controls: [
//       { type: 'text', label: 'Approval Code', name: 'approvalCode', value: '' },
//       { type: 'checkbox', label: 'Manager Approved', name: 'managerApproved', value: false },
//     ]
//   },
//   {
//     id: 6,
//     label: 'Approval3',
//     date: '2024-01-12',
//     userAssignable: false, // Indicates this stage is for another user
//     completed: false,
//     controls: [
//       { type: 'text', label: 'Approval Code', name: 'approvalCode', value: '' },
//       { type: 'checkbox', label: 'Manager Approved', name: 'managerApproved', value: false },
//     ]
//   },
//   // More stages...
// ];


// Main ProgressStages component
const ProgressStages = ({ stages, onSave, showNavigationButtons = false }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [activeStage, setActiveStage] = useState(0);
  const [saveDisabled, setSaveDisabled] = useState(false);

  // Effect to update active stage based on stages prop
  useEffect(() => {
    const lastCompletedIndex = stages.findIndex(stage => !stage.completed);
    setActiveStage(lastCompletedIndex === -1 ? stages.length - 1 : lastCompletedIndex);
  }, [stages]);

  const isNotNullOrEmpty = (str) => {
    return str !== null && str !== undefined && str !== '';
  }

  useEffect(() => {
    if (modalData.controls) {
    // Run some code after `stateVariable` has updated
      const {controls} = modalData;
      let saveDisabled_ = false;
      for (const control of controls) {
        if ((control.requiredField && modalData[control.name] && !isNotNullOrEmpty(modalData[control.name])) || modalData?.completed) {
          saveDisabled_= true;
          break;
        }
      }
      setSaveDisabled(saveDisabled_);
  }
}, [modalData]);

  // Handle clicking a stage to open the modal
  const handleStageClick = (index) => {
    if (index <= activeStage) {
      const stage = stages[index];
      if (stage.controls.length === 0 || (!stage.userAssignable && index === activeStage)) {
        return
      }
      const stageControls = stage.controls.reduce((acc, control) => {
        acc[control.name] = control.value;
        return acc;
      }, {});
      const updatedState = {
        date: stage.date,
        ...stageControls,
        completed: stage.completed,
        controls: stage.controls,
        note: stage.note,
        status: stage.status
      };
      setModalData(updatedState);
      console.log(modalData, updatedState);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData({});
  };

  const handleInputChange = (event) => {
    const { name, type, checked, value } = event.target;
    setModalData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    const updatedStages = stages.map((stage, index) => {
      if (index === activeStage) {
        return {
          ...stage,
          completed: true,
          date: modalData.date,
          controls: stage.controls.map((control) => ({
            ...control,
            value: modalData[control.name] || control.value,
          })),
        };
      }
      return stage;
    });

    if (onSave) {
      onSave(updatedStages[activeStage], modalData);
    }

    handleCloseModal();
  };

  return (
    <Box sx={{ width: '80%', mx: 'auto', mt: 4 }}>
      <Stepper alternativeLabel activeStep={activeStage}>
        {stages.map((stage, index) => (
          <Step key={stage.id} completed={stage.completed}>
            <StepLabel>
              <Box
                onClick={() => handleStageClick(index)}
                sx={{
                  cursor: index <= activeStage && stage?.controls?.length > 0 && stage.userAssignable  ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: stage.completed ? 0.7 : 1,
                }}
              >
                <Badge
                  badgeContent={!stage.userAssignable && index === activeStage && !stage.completed? "Awaiting action!" : stage.userAssignable && index === activeStage && !stage.completed ? 'Update!' : null}
                  color="secondary"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: index === activeStage ? 'red' : stage.completed ? 'green' : 'gray', // Changed badge color to orange
                      color: 'white', // Text color for contrast
                      top: 5,
                      right: 0,
                      transform: index === activeStage ? 'translate(60%, -70%)' : null,
                      width: 'max-content'
                    },
                  }}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: index === activeStage ? 'blue' : stage.completed ? 'green' : 'gray',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mb: 1,
                    }}
                  >
                    {index + 1}
                  </Box>
                </Badge>
                <Typography variant="body2" color={index === activeStage ? 'blue' : 'inherit'}>
                  {stage.label}
                </Typography>
                {stage.date && (
                  <Typography variant="caption" color="text.secondary">
                    {stage.date}
                  </Typography>
                )}
                {/* {!stage.userAssignable && index === activeStage && (
                  <Typography variant="caption" color="text.tertiary">
                    Awaiting!
                  </Typography>
                )} */}
                {stage.status && (
                  <Typography variant="caption" color="error">
                    {stage.status}
                  </Typography>
                )}
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <LinearProgress variant="determinate" value={(activeStage / (stages.length - 1)) * 100} sx={{ mt: 3 }} />

      {showNavigationButtons && (
        <Stack direction="row" justifyContent="space-between" mt={3}>
          <Button variant="outlined" onClick={() => setActiveStage((prev) => Math.max(prev - 1, 0))} disabled={activeStage === 0}>
            Previous
          </Button>
          <Button variant="outlined" onClick={() => setActiveStage((prev) => Math.min(prev + 1, stages.length - 1))} disabled={activeStage === stages.length - 1 || !stages[activeStage].completed}>
            Next
          </Button>
        </Stack>
      )}

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4 }}>
          <Typography variant="h6" mb={2}>
            {stages[activeStage]?.label}
          </Typography>

          {modalData?.controls && (modalData?.controls.map((control) => {
            if (control.hideIfCompleted && modalData?.completed) {
              return;
            }

            const isReadOnly = modalData?.completed || !stages[activeStage].userAssignable;
            console.log(isReadOnly);
            return (
              <div key={control.name}>
                {control.type === 'text' && (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={control.label}
                    name={control.name}
                    value={modalData[control.name] || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    InputProps={{ readOnly: isReadOnly }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
                {control.type === 'textarea' && (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={control.label}
                    name={control.name}
                    value={modalData[control.name] || ''}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                    InputProps={{ readOnly: isReadOnly }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
                {control.type === 'checkbox' && (
                  <FormControlLabel
                    control={<Checkbox checked={modalData[control.name] || false} onChange={handleInputChange} name={control.name} />}
                    label={control.label}
                    sx={{ mb: 2 }}
                    disabled={isReadOnly}
                  />
                )}
                {control.type === 'date' && (
                  <TextField
                    className='active'
                    fullWidth
                    variant="outlined"
                    label={control.label}
                    name={control.name}
                    type="datetime-local"
                    value={modalData[control.name] || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    InputProps={{ readOnly: (isReadOnly || control.readonly) }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              </div>
            );
          }))}

          {modalData.note && (
            <Typography variant="body2" color="text.secondary" mb={2}>
              Note: {modalData.note}
            </Typography>
          )}
          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saveDisabled}>
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProgressStages;