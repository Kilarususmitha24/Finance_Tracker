import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Chip,
  useTheme,
  Button
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  ShowChart,
  StarBorder
} from '@mui/icons-material';

const UserStats = ({ stats }) => {
  const theme = useTheme();

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>Activity Overview</Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Budget Adherence
              </Typography>
              <Typography variant="body2">
                {stats.budgetAdherence}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={stats.budgetAdherence}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: stats.budgetAdherence > 70 ? theme.palette.success.main : theme.palette.warning.main
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Savings Rate
              </Typography>
              <Typography variant="body2">
                {stats.savingsRate}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={stats.savingsRate}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.info.main
                }
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  <AccountBalanceWallet color="primary" />
                  <Typography variant="body2">Total Transactions</Typography>
                </Box>
                <Typography variant="h6">{stats.totalTransactions}</Typography>
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUp color="success" />
                  <Typography variant="body2">Goals Achieved</Typography>
                </Box>
                <Typography variant="h6">{stats.goalsAchieved}</Typography>
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  <ShowChart color="info" />
                  <Typography variant="body2">Active Goals</Typography>
                </Box>
                <Typography variant="h6">{stats.activeGoals}</Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Achievements
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {stats.achievements.map((achievement, index) => (
            <Chip
              key={index}
              icon={<StarBorder />}
              label={achievement}
              variant="outlined"
              color="primary"
              size="small"
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button variant="outlined" color="primary">
          View Detailed Analytics
        </Button>
      </Box>
    </Paper>
  );
};

export default UserStats;