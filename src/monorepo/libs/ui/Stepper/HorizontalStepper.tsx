import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type StepFlow = {
  name: string,
  body: React.ReactNode
};

type Props = {
  steps: StepFlow[];
  onSubmitButton?: React.ReactNode;
  onClose: () => void;
};

export default function HorizontalStepper({
  steps, onClose, onSubmitButton = null,
}:Props) {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
    if (activeStep + 1 === steps.length) {
      onClose();
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((s, index) => (
          <Step key={`step_flow_${String(index)}`}>
            <StepLabel>{s.name}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Close</Button>
          </Box>
        </>
      ) : (
        <>
          {steps[activeStep].body}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button
              color="inherit"
              onClick={onClose}
              sx={{ mr: 1 }}
            >
              Cancelar
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ? onSubmitButton
              : (
                <Button onClick={handleNext}>
                  Siguiente
                </Button>
              )}
          </Box>
        </>
      )}
    </Box>
  );
}
