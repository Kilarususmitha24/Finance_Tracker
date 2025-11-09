import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Japanese'];
const THEMES = ['Light', 'Dark', 'System'];

const PreferencesDialog = ({ open, onClose, preferences, onSave }) => {
  const [settings, setSettings] = React.useState(preferences);

  const handleChange = (field) => (event) => {
    setSettings({
      ...settings,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          User Preferences
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Notifications */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon /> Notifications
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleChange('emailNotifications')}
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.pushNotifications}
                  onChange={handleChange('pushNotifications')}
                />
              }
              label="Push Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.budgetAlerts}
                  onChange={handleChange('budgetAlerts')}
                />
              }
              label="Budget Alerts"
            />
          </Grid>

          {/* Currency & Language */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Preferred Currency</InputLabel>
              <Select
                value={settings.currency}
                onChange={handleChange('currency')}
                label="Preferred Currency"
              >
                {CURRENCIES.map(curr => (
                  <MenuItem key={curr} value={curr}>{curr}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language}
                onChange={handleChange('language')}
                label="Language"
              >
                {LANGUAGES.map(lang => (
                  <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Theme */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Theme</InputLabel>
              <Select
                value={settings.theme}
                onChange={handleChange('theme')}
                label="Theme"
              >
                {THEMES.map(theme => (
                  <MenuItem key={theme} value={theme}>{theme}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Security */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon /> Security
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.twoFactorAuth}
                  onChange={handleChange('twoFactorAuth')}
                />
              }
              label="Two-Factor Authentication"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.biometricLogin}
                  onChange={handleChange('biometricLogin')}
                />
              }
              label="Biometric Login"
            />
          </Grid>

          {/* Privacy */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Privacy</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.shareData}
                  onChange={handleChange('shareData')}
                />
              }
              label="Share usage data to improve service"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.publicProfile}
                  onChange={handleChange('publicProfile')}
                />
              }
              label="Make profile public"
            />
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
          Save Preferences
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreferencesDialog;