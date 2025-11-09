import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from 'notistack';
import UserStats from '../../components/profile/UserStats';
import PreferencesDialog from '../../components/profile/PreferencesDialog';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  TextField,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  InputAdornment,
  Input,
  Card,
  CardContent,
  CardHeader,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const Profile = () => {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    photoURL: '',
    bio: '',
    metadata: { creationTime: new Date().toISOString() }
  });

  // fake user stats (replace with backend fetch)
  const [userStats] = useState({
    budgetAdherence: 85,
    savingsRate: 32,
    totalTransactions: 145,
    goalsAchieved: 3,
    activeGoals: 2,
    achievements: [
      'Budget Master',
      'Saving Streak: 30 Days',
      'First Investment',
      'Goal Achiever'
    ]
  });

  // Load user from context
  useEffect(() => {
    if (currentUser) {
      setUserData({
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
        photoURL: currentUser.photoURL || '',
        bio: currentUser.bio || '',
        metadata: {
          creationTime:
            currentUser.metadata?.creationTime || new Date().toISOString()
        }
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateUserProfile(userData); // update in AuthContext or backend
      enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      enqueueSnackbar(error.message || 'Failed to update profile', {
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      enqueueSnackbar('Logged out successfully', { variant: 'success' });
    } catch (error) {
      console.error('Failed to log out', error);
      enqueueSnackbar(error.message || 'Failed to log out', { variant: 'error' });
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    enqueueSnackbar('Password change feature coming soon!', {
      variant: 'info'
    });
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* User Stats */}
        <Grid item xs={12}>
          <UserStats stats={userStats} />
        </Grid>

        {/* Left column */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={userData.photoURL || '/default-avatar.png'}
                  alt={userData.displayName || 'User'}
                  sx={{
                    width: 150,
                    height: 150,
                    mx: 'auto',
                    mb: 2,
                    border: '4px solid',
                    borderColor: 'primary.main',
                    fontSize: '3rem'
                  }}
                >
                  {!userData.photoURL &&
                    (userData.displayName || 'U').charAt(0).toUpperCase()}
                </Avatar>

                {editMode && (
                  <label htmlFor="profile-photo-upload">
                    <Input
                      id="profile-photo-upload"
                      type="file"
                      accept="image/*"
                      sx={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setUserData((prev) => ({
                              ...prev,
                              photoURL: reader.result
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <IconButton
                      color="primary"
                      component="span"
                      sx={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </label>
                )}
              </Box>

              <Typography variant="h5" fontWeight={600} gutterBottom>
                {userData.displayName || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since{' '}
                {new Date(userData.metadata.creationTime).toLocaleDateString()}
              </Typography>

              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {editMode ? (
                  <>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      Save Changes
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </Button>
                )}

                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowPreferences(true)}
                >
                  Preferences
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Right column */}
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardHeader
              title="Profile Information"
              subheader={
                editMode
                  ? 'Update your personal information'
                  : 'View your profile details'
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="displayName"
                    value={userData.displayName}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color={editMode ? 'primary' : 'action'} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={userData.email}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color={editMode ? 'primary' : 'action'} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={userData.bio}
                    onChange={handleChange}
                    disabled={!editMode}
                    multiline
                    rows={3}
                    placeholder="Tell us about yourself..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ mt: -2 }}>
                          <PersonIcon color={editMode ? 'primary' : 'action'} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {editMode && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      <AlertTitle>Profile Update</AlertTitle>
                      Click <b>Save Changes</b> to confirm your updates.
                    </Alert>
                  </Grid>
                )}
              </Grid>

              {/* Password Section */}
              <Box
                sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Typography variant="h6">Security</Typography>
                  <Button
                    variant="text"
                    onClick={() => setShowPassword((prev) => !prev)}
                    startIcon={showPassword ? <VisibilityOff /> : <Visibility />}
                  >
                    {showPassword ? 'Hide' : 'Show'} Password Fields
                  </Button>
                </Box>

                {showPassword && (
                  <form onSubmit={handlePasswordChange}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          type={showPassword ? 'text' : 'password'}
                          disabled={!editMode}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color={editMode ? 'primary' : 'action'} />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="New Password"
                          type={showPassword ? 'text' : 'password'}
                          disabled={!editMode}
                          required
                          helperText="At least 8 characters"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color={editMode ? 'primary' : 'action'} />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={!editMode || isLoading}
                          startIcon={
                            isLoading ? <CircularProgress size={20} /> : <SaveIcon />
                          }
                        >
                          Update Password
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Preferences Dialog */}
      {showPreferences && (
        <PreferencesDialog
          open={showPreferences}
          onClose={() => setShowPreferences(false)}
        />
      )}
    </Container>
  );
};

export default Profile;
