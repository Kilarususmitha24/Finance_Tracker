import React, { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  IconButton,
  Grid
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const REMINDER_FREQUENCIES = [
  { value: 'never', label: 'Never' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

const GoalSettings = ({ goal, open, onClose, onSave }) => {
  const [settings, setSettings] = useState({
    monthlyContributionTarget: goal.monthlyContributionTarget || '',
    reminderFrequency: goal.reminderFrequency || 'monthly',
    autoAdjust: goal.autoAdjust || false,
    notifyOnMilestone: goal.notifyOnMilestone || true,
    allowOverContribution: goal.allowOverContribution || false,
    priorityAdjustment: goal.priorityAdjustment || 'manual',
    tags: goal.tags || [],
    customReminders: goal.customReminders || []
  });

  const handleChange = (field) => (event) => {
    setSettings({
      ...settings,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  };

  const handleAddCustomReminder = () => {
    setSettings({
      ...settings,
      customReminders: [
        ...settings.customReminders,
        { date: new Date(), message: '' }
      ]
    });
  };

  const handleRemoveCustomReminder = (index) => {
    setSettings({
      ...settings,
      customReminders: settings.customReminders.filter((_, i) => i !== index)
    });
  };

  const handleUpdateCustomReminder = (index, field, value) => {
    setSettings({
      ...settings,
      customReminders: settings.customReminders.map((reminder, i) =>
        i === index ? { ...reminder, [field]: value } : reminder
      )
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Goal Settings
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Monthly Contribution Target"
              type="number"
              fullWidth
              value={settings.monthlyContributionTarget}
              onChange={handleChange('monthlyContributionTarget')}
              InputProps={{
                startAdornment: '₹'
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Reminder Frequency"
              fullWidth
              value={settings.reminderFrequency}
              onChange={handleChange('reminderFrequency')}
            >
              {REMINDER_FREQUENCIES.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoAdjust}
                  onChange={handleChange('autoAdjust')}
                />
              }
              label="Auto-adjust contribution based on progress"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifyOnMilestone}
                  onChange={handleChange('notifyOnMilestone')}
                />
              }
              label="Notify when milestones are reached"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allowOverContribution}
                  onChange={handleChange('allowOverContribution')}
                />
              }
              label="Allow contributions beyond target"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Tags"
              fullWidth
              value={settings.tags.join(', ')}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  tags: e.target.value.split(',').map(tag => tag.trim())
                });
              }}
              helperText="Separate tags with commas"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Custom Reminders
            </Typography>
            {settings.customReminders.map((reminder, index) => (
              <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={reminder.date}
                    onChange={(newDate) => {
                      handleUpdateCustomReminder(index, 'date', newDate);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} size="small" sx={{ width: 150 }} />
                    )}
                  />
                </LocalizationProvider>
                <TextField
                  size="small"
                  value={reminder.message}
                  onChange={(e) => {
                    handleUpdateCustomReminder(index, 'message', e.target.value);
                  }}
                  placeholder="Reminder message"
                  fullWidth
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveCustomReminder(index)}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
            <Button onClick={handleAddCustomReminder}>
              Add Custom Reminder
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            onSave(settings);
            onClose();
          }}
        >
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GoalSettings;