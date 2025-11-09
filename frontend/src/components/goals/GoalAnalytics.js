import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Chip,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  Flag,
  CheckCircle,
  Warning
} from '@mui/icons-material';

const GoalAnalytics = ({ analytics }) => {
  const theme = useTheme();

  const stats = [
    {
      title: 'Total Goals',
      value: analytics.totalGoals,
      color: theme.palette.primary.main,
      icon: <Flag />
    },
    {
      title: 'Completed',
      value: analytics.completedGoals,
      color: theme.palette.success.main,
      icon: <CheckCircle />
    },
    {
      title: 'On Track',
      value: analytics.onTrackGoals,
      color: theme.palette.info.main,
      icon: <TrendingUp />
    },
    {
      title: 'Needs Attention',
      value: analytics.needsAttentionGoals,
      color: theme.palette.warning.main,
      icon: <Warning />
    }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Goal Analytics
      </Typography>

      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 2,
                bgcolor: `${stat.color}10`
              }}
            >
              <Box sx={{ color: stat.color }}>{stat.icon}</Box>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2, mt: 2, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography>Overall Progress</Typography>
          <Chip
            label={`${analytics.averageProgress}% Complete`}
            color="primary"
            size="small"
          />
        </Box>
        <LinearProgress
          variant="determinate"
          value={analytics.averageProgress}
          sx={{ height: 10, borderRadius: 5 }}
        />
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="body2" color="text.secondary">
            Total Saved
          </Typography>
          <Typography variant="h6" color="success.main">
            ₹{analytics.totalSaved.toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default GoalAnalytics;