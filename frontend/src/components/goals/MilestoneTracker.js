import React from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  TextField,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CheckCircle } from '@mui/icons-material';

const MilestoneTracker = ({ milestones = [], onUpdate, readOnly }) => {
  const handleAddMilestone = () => {
    onUpdate([
      ...milestones,
      {
        id: Date.now(),
        description: '',
        targetAmount: 0,
        completed: false,
        dueDate: null
      }
    ]);
  };

  const handleUpdateMilestone = (index, field, value) => {
    const updated = milestones.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    onUpdate(updated);
  };

  const handleDeleteMilestone = (index) => {
    const updated = milestones.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const handleToggleComplete = (index) => {
    const updated = milestones.map((m, i) =>
      i === index ? { ...m, completed: !m.completed } : m
    );
    onUpdate(updated);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Milestones
      </Typography>

      {milestones.length > 0 ? (
        <Stepper orientation="vertical">
          {milestones.map((milestone, index) => (
            <Step key={milestone.id} active={!milestone.completed}>
              <StepLabel
                StepIconProps={{
                  icon: milestone.completed ? <CheckCircle color="success" /> : index + 1
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {!readOnly ? (
                    <>
                      <TextField
                        size="small"
                        value={milestone.description}
                        onChange={(e) =>
                          handleUpdateMilestone(index, 'description', e.target.value)
                        }
                        placeholder="Milestone description"
                      />
                      <TextField
                        size="small"
                        type="number"
                        value={milestone.targetAmount}
                        onChange={(e) =>
                          handleUpdateMilestone(
                            index,
                            'targetAmount',
                            Number(e.target.value)
                          )
                        }
                        placeholder="Target amount"
                        sx={{ width: 150 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteMilestone(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <Typography>
                      {milestone.description} - ₹{milestone.targetAmount}
                    </Typography>
                  )}
                  <Button
                    size="small"
                    variant={milestone.completed ? 'outlined' : 'contained'}
                    onClick={() => handleToggleComplete(index)}
                  >
                    {milestone.completed ? 'Completed' : 'Mark Complete'}
                  </Button>
                </Box>
              </StepLabel>
              {milestone.completed && (
                <StepContent>
                  <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'white' }}>
                    <Typography>
                      🎉 Milestone achieved! Keep going towards your goal.
                    </Typography>
                  </Paper>
                </StepContent>
              )}
            </Step>
          ))}
        </Stepper>
      ) : (
        <Typography color="text.secondary">No milestones yet</Typography>
      )}

      {!readOnly && (
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddMilestone}
          sx={{ mt: 2 }}
        >
          Add Milestone
        </Button>
      )}
    </Box>
  );
};

export default MilestoneTracker;