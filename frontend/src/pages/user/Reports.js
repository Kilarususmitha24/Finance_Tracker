import { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import {
  DateRange as DateRangeIcon,
  Download as DownloadIcon,
  BarChart as BarChartIcon,
  TableChart as TableChartIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useTheme as useThemeContext } from "../../contexts/ThemeContext";

// Generate mock data
const generateMockData = () => {
  const categories = ["Food", "Transportation", "Shopping", "Bills", "Entertainment"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = months.map((month) => {
    const monthData = { name: month };
    categories.forEach((category) => {
      monthData[category] = Math.floor(Math.random() * 1000) + 100;
    });
    return monthData;
  });

  const categoryData = categories.map((category) => ({
    name: category,
    value: Math.floor(Math.random() * 4000) + 500,
  }));

  const transactions = Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    date: new Date(2025, Math.floor(Math.random() * 11), Math.floor(Math.random() * 28) + 1),
    description: `Transaction ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    amount: Math.floor(Math.random() * 500) + 10,
    type: Math.random() > 0.3 ? "expense" : "income",
  }));

  return { monthlyData, categoryData, transactions };
};

// Enhanced color palette with better contrast
const COLORS = [
  '#4F46E5', // indigo-600
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
  '#F97316'  // orange-500
];

// Enhanced chart theme configuration
const chartTheme = {
  fontSize: 12,
  fontFamily: 'Inter, -apple-system, sans-serif',
  colors: {
    text: '#1F2937', // gray-800
    background: '#FFFFFF',
    grid: '#F3F4F6', // gray-100
    border: '#E5E7EB', // gray-200
    accent: '#4F46E5', // indigo-600
    success: '#10B981', // emerald-500
    warning: '#F59E0B', // amber-500
    error: '#EF4444' // red-500
  },
  axis: {
    domain: {
      line: {
        stroke: '#E5E7EB',
        strokeWidth: 1
      }
    },
    ticks: {
      line: {
        stroke: '#E5E7EB',
        strokeWidth: 1
      },
      text: {
        fill: '#6B7280', // gray-500
        fontSize: 11,
        fontFamily: 'Inter, -apple-system, sans-serif'
      }
    },
    legend: {
      text: {
        fill: '#4B5563', // gray-600
        fontSize: 12,
        fontWeight: 500,
        fontFamily: 'Inter, -apple-system, sans-serif'
      }
    }
  },
  grid: {
    line: {
      stroke: '#E5E7EB',
      strokeWidth: 1,
      strokeDasharray: '3 3',
      strokeOpacity: 0.7
    }
  },
  tooltip: {
    container: {
      background: '#FFFFFF',
      color: '#1F2937',
      fontSize: 12,
      borderRadius: 8,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      border: '1px solid #E5E7EB',
      padding: '12px 16px',
      fontFamily: 'Inter, -apple-system, sans-serif'
    },
    label: {
      fontWeight: 600,
      marginBottom: 4,
      color: '#111827'
    },
    value: {
      fontWeight: 500,
      color: '#1F2937'
    }
  },
  chart: {
    margin: { top: 20, right: 20, left: 20, bottom: 20 },
    padding: { left: 10, right: 10, top: 10, bottom: 10 },
    bar: {
      categoryGap: '25%',
      barGap: 4,
      radius: [4, 4, 0, 0],
      hover: {
        brightness: 1.05,
        translateY: -2
      }
    },
    pie: {
      innerRadius: '60%',
      outerRadius: '90%',
      paddingAngle: 1,
      labelLine: false
    },
    line: {
      strokeWidth: 2.5,
      dot: {
        r: 4,
        stroke: '#FFFFFF',
        strokeWidth: 2,
        fillOpacity: 1
      },
      activeDot: {
        r: 6,
        stroke: '#FFFFFF',
        strokeWidth: 2
      }
    }
  }
};

// Enhanced Custom Tooltip with better styling
const CustomTooltip = ({ active, payload, label, chartType = 'line' }) => {
  if (active && payload && payload.length) {
    const total = chartType === 'pie' ? payload.reduce((sum, item) => sum + item.value, 0) : null;
    
    return (
      <Paper 
        elevation={3}
        sx={{ 
          p: 2, 
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          minWidth: 160
        }}
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: '#1F2937', 
            fontWeight: 600, 
            mb: 1,
            borderBottom: '1px solid #F3F4F6',
            pb: 0.5
          }}
        >
          {label}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {payload.map((entry, index) => {
            const percentage = chartType === 'pie' 
              ? `(${Math.round((entry.value / total) * 100)}%)` 
              : '';
              
            return (
              <Box 
                key={`tooltip-${index}`} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: 1.5
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                  <Box 
                    sx={{ 
                      width: 10, 
                      height: 10, 
                      bgcolor: entry.color, 
                      mr: 1, 
                      borderRadius: '2px',
                      flexShrink: 0
                    }} 
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#4B5563', 
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {entry.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#111827', 
                      fontWeight: 600, 
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ${entry.value.toLocaleString()}
                  </Typography>
                  {percentage && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#6B7280',
                        fontSize: '0.7rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {percentage}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>
    );
  }
  return null;
};

const Reports = () => {
  const theme = useTheme();
  const [view, setView] = useState("charts");
  const [timeRange, setTimeRange] = useState("last6months");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [exporting, setExporting] = useState(false);

  const rawData = useMemo(() => generateMockData(), []);
  const { monthlyData: allMonthlyData, categoryData: allCategoryData, transactions } = rawData;

  // Function to convert data to CSV format
  const convertToCSV = useCallback((data, headers) => {
    const csvRows = [];
    
    // Add header row
    csvRows.push(headers.join(','));
    
    // Add data rows
    data.forEach(item => {
      const values = headers.map(header => {
        const value = item[header.toLowerCase()];
        // Handle nested objects and arrays
        const formattedValue = typeof value === 'object' 
          ? JSON.stringify(value)
          : `"${String(value || '').replace(/"/g, '""')}"`;
        return formattedValue;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  }, []);

  // Function to download CSV file
  const downloadCSV = useCallback((csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Export transactions to CSV
  const handleExport = useCallback(async (exportType) => {
    try {
      setExporting(true);
      
      let dataToExport = [];
      let headers = [];
      let fileName = '';
      
      switch(exportType) {
        case 'transactions':
          dataToExport = transactions;
          headers = ['ID', 'Date', 'Description', 'Category', 'Amount', 'Type'];
          fileName = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'monthly':
          dataToExport = allMonthlyData;
          headers = ['Month', ...allCategoryData.map(cat => cat.name)];
          fileName = `monthly_report_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'categories':
          dataToExport = allCategoryData;
          headers = ['Category', 'Amount'];
          fileName = `category_totals_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        default:
          return;
      }
      
      // Transform data to match headers
      const formattedData = dataToExport.map(item => {
        const row = {};
        headers.forEach(header => {
          row[header.toLowerCase()] = item[header.toLowerCase()] || item[header] || '';
        });
        return row;
      });
      
      const csv = convertToCSV(formattedData, headers);
      downloadCSV(csv, fileName);
      
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setExporting(false);
    }
  }, [transactions, allMonthlyData, allCategoryData, convertToCSV, downloadCSV]);

  // ✅ Dynamic category-based filtering for charts
  const monthlyData = useMemo(() => {
    if (category === "all") return allMonthlyData;
    return allMonthlyData.map((month) => ({
      name: month.name,
      [category]: month[category],
    }));
  }, [allMonthlyData, category]);

  const categoryData = useMemo(() => {
    if (category === "all") return allCategoryData;
    const single = allCategoryData.find((c) => c.name === category);
    return single ? [single] : [];
  }, [allCategoryData, category]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(
        (tx) =>
          (category === "all" || tx.category === category) &&
          tx.description.toLowerCase().includes(search.toLowerCase())
      )
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [transactions, category, search, page, rowsPerPage]);

  return (
    <Box sx={{ px: 3, pb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Reports & Analytics
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('transactions')}
            disabled={exporting}
            sx={{ mr: 1 }}
          >
            {exporting ? 'Exporting...' : 'Export Transactions'}
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('monthly')}
            disabled={exporting}
          >
            Export Monthly
          </Button>
        </Box>
      </Box>

      {/* Filter Bar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, boxShadow: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
                startAdornment={<DateRangeIcon />}
              >
                <MenuItem value="last30days">Last 30 Days</MenuItem>
                <MenuItem value="last3months">Last 3 Months</MenuItem>
                <MenuItem value="last6months">Last 6 Months</MenuItem>
                <MenuItem value="thisYear">This Year</MenuItem>
                <MenuItem value="lastYear">Last Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {allCategoryData.map((cat) => (
                  <MenuItem key={cat.name} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <ToggleButtonGroup
              color="primary"
              value={view}
              exclusive
              onChange={(e, newView) => newView && setView(newView)}
              fullWidth
              size="small"
            >
              <ToggleButton value="charts">
                <BarChartIcon fontSize="small" sx={{ mr: 0.5 }} /> Charts
              </ToggleButton>
              <ToggleButton value="tables">
                <TableChartIcon fontSize="small" sx={{ mr: 0.5 }} /> Table
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Charts View */}
      {view === "charts" ? (
        <Grid container spacing={3}>
          {/* Line Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Expense Trend (Last 6 Months)
                </Typography>
                <Box height={320}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={monthlyData.slice(0, 6)}
                      margin={{ top: 40, right: 20, left: 0, bottom: 40 }}
                    >
                      <CartesianGrid 
                        vertical={false} 
                        stroke={chartTheme.grid.line.stroke}
                        strokeDasharray={chartTheme.grid.strokeDasharray}
                        strokeOpacity={chartTheme.grid.strokeOpacity}
                      />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: chartTheme.colors.text,
                          fontSize: 11,
                          fontFamily: chartTheme.fontFamily,
                          fontWeight: 500
                        }}
                        padding={{ left: 10, right: 10 }}
                        tickMargin={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: chartTheme.axis.ticks.text.fill,
                          fontSize: 11,
                          fontFamily: chartTheme.fontFamily,
                          fontWeight: 500
                        }}
                        tickFormatter={(value) => `$${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
                        width={60}
                        tickCount={6}
                        tickMargin={10}
                      />
                      <RechartsTooltip 
                        content={<CustomTooltip chartType="line" />} 
                        cursor={{
                          stroke: chartTheme.colors.border,
                          strokeWidth: 1,
                          strokeDasharray: '3 3',
                          strokeOpacity: 0.5
                        }}
                        wrapperStyle={{
                          ...chartTheme.tooltip.container,
                          zIndex: 1000
                        }}
                      />
                      <Legend 
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{
                          padding: '20px 0 0 0',
                          fontSize: 12,
                          color: chartTheme.axis.legend.text.fill,
                          fontFamily: chartTheme.fontFamily,
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '16px'
                        }}
                        formatter={(value, entry, index) => (
                          <Box component="span" sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '0.75rem',
                            color: chartTheme.colors.text,
                            '&:before': {
                              content: '""',
                              display: 'inline-block',
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: COLORS[index % COLORS.length],
                              marginRight: 6
                            }
                          }}>
                            {value}
                          </Box>
                        )}
                        layout="horizontal"
                        verticalAlign="top"
                        align="center"
                      />
                      {category === "all"
                        ? ["Food", "Transportation", "Shopping", "Bills", "Entertainment"].map(
                            (cat, i) => (
                              <Line
                                key={cat}
                                type="monotone"
                                dataKey={cat}
                                stroke={COLORS[i % COLORS.length]}
                                strokeWidth={chartTheme.chart.line.strokeWidth}
                                strokeLinecap="round"
                                dot={{
                                  fill: COLORS[i % COLORS.length],
                                  stroke: chartTheme.chart.line.dot.stroke,
                                  strokeWidth: chartTheme.chart.line.dot.strokeWidth,
                                  r: chartTheme.chart.line.dot.r,
                                  style: { 
                                    opacity: 1,
                                    fill: COLORS[i % COLORS.length],
                                    stroke: '#fff',
                                    strokeWidth: 2,
                                    transition: 'all 0.3s ease',
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                  }
                                }}
                                activeDot={{
                                  fill: COLORS[i % COLORS.length],
                                  stroke: chartTheme.chart.line.activeDot.stroke,
                                  strokeWidth: chartTheme.chart.line.activeDot.strokeWidth,
                                  r: chartTheme.chart.line.activeDot.r,
                                }}
                                style={{
                                  transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={() => {
                                  const lines = document.querySelectorAll(`.recharts-line`);
                                  const dots = document.querySelectorAll(`.recharts-dot`);
                                  if (lines[i] && dots[i]) {
                                    lines[i].style.strokeWidth = '3';
                                    dots[i].style.opacity = '1';
                                  }
                                }}
                                onMouseLeave={() => {
                                  const lines = document.querySelectorAll(`.recharts-line`);
                                  const dots = document.querySelectorAll(`.recharts-dot`);
                                  if (lines[i] && dots[i]) {
                                    lines[i].style.strokeWidth = String(chartTheme.chart.line.strokeWidth);
                                    dots[i].style.opacity = '0';
                                  }
                                }}
                              />
                            )
                          )
                        : (
                          <Line
                            type="monotone"
                            dataKey={category}
                            stroke={COLORS[0]}
                            strokeWidth={3}
                            dot={{
                              fill: COLORS[0],
                              stroke: '#fff',
                              strokeWidth: 2,
                              r: 4,
                              style: { display: 'none' }
                            }}
                            activeDot={{
                              r: 8,
                              stroke: '#fff',
                              strokeWidth: 2,
                              fill: COLORS[0]
                            }}
                          />
                        )}
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Expenses by Category
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="90%"
                        paddingAngle={1}
                        dataKey="value"
                        label={({ name, percent, value }) => {
                          // Only show label if the segment is large enough
                          const isLargeEnough = percent > 0.05; // 5% threshold
                          return isLargeEnough ? (
                            <text
                              x={0}
                              y={0}
                              textAnchor="middle"
                              fill="#1F2937"
                              fontSize={11}
                              fontWeight={600}
                              style={{
                                filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.8))'
                              }}
                            >
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          ) : null;
                        }}
                        labelLine={chartTheme.chart.pie.labelLine}
                        labelStyle={{
                          fontSize: '11px',
                          fill: '#FFFFFF',
                          fontWeight: 600,
                          fontFamily: chartTheme.fontFamily,
                          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                          pointerEvents: 'none',
                          opacity: 0.9
                        }}
                        onMouseEnter={(data, index, e) => {
                          if (e && e.target) {
                            const sector = e.target;
                            sector.style.opacity = '0.9';
                            sector.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))';
                            sector.style.transform = 'scale(1.02)';
                            sector.style.transition = 'all 0.2s ease';
                          }
                        }}
                        onMouseLeave={(data, index, e) => {
                          if (e && e.target) {
                            const sector = e.target;
                            sector.style.opacity = '1';
                            sector.style.filter = 'none';
                            sector.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            stroke="#fff"
                            strokeWidth={1}
                            style={{
                              filter: 'saturate(1.1)',
                              transition: 'opacity 0.2s, filter 0.2s',
                              cursor: 'pointer'
                            }}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        content={<CustomTooltip chartType="pie" />}
                        formatter={(value, name, props) => [
                          `$${value.toLocaleString()}`,
                          name
                        ]}
                      />
                      <Legend 
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{
                          paddingLeft: '24px',
                          fontSize: chartTheme.axis.legend.text.fontSize,
                          fontFamily: chartTheme.fontFamily,
                          color: chartTheme.axis.legend.text.fill,
                          maxHeight: '220px',
                          overflowY: 'auto',
                          paddingRight: '8px'
                        }}
                        formatter={(value, entry, index) => {
                          const total = categoryData.reduce((sum, item) => sum + item.value, 0);
                          const percentage = total > 0 
                            ? `(${Math.round((categoryData[index]?.value / total) * 100)}%)`
                            : '';
                          return (
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              padding: '2px 0',
                              '&:hover': {
                                '& .legend-color': {
                                  transform: 'scale(1.2)'
                                }
                              }
                            }}>
                              <Box 
                                className="legend-color"
                                sx={{
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '2px',
                                  backgroundColor: COLORS[index % COLORS.length],
                                  marginRight: '8px',
                                  transition: 'transform 0.2s',
                                  flexShrink: 0
                                }}
                              />
                              <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                minWidth: 0
                              }}>
                                <Box sx={{ 
                                  display: 'flex',
                                  alignItems: 'baseline',
                                  gap: '4px',
                                  lineHeight: '1.2'
                                }}>
                                  <Box 
                                    component="span" 
                                    sx={{ 
                                      fontSize: '0.75rem',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      color: chartTheme.axis.legend.text.fill
                                    }}
                                  >
                                    {value}
                                  </Box>
                                </Box>
                                <Box sx={{ 
                                  display: 'flex',
                                  gap: '4px',
                                  alignItems: 'baseline'
                                }}>
                                  <Box 
                                    component="span" 
                                    sx={{ 
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      color: chartTheme.colors.text
                                    }}
                                  >
                                    ${categoryData[index]?.value.toLocaleString()}
                                  </Box>
                                  <Box 
                                    component="span" 
                                    sx={{ 
                                      fontSize: '0.65rem',
                                      color: chartTheme.axis.ticks.text.fill,
                                      opacity: 0.8
                                    }}
                                  >
                                    {percentage}
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          );
                        }}
                        iconType="circle"
                        iconSize={10}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Summary
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={monthlyData.slice(0, 6)}
                      margin={{ top: 70, right: 20, left: 10, bottom: 70 }}
                      barCategoryGap="20%"
                      barGap={1}
                      barSize={32}
                    >
                      {/* Remove all grid lines and reference lines */}
                      <CartesianGrid 
                        vertical={false}
                        horizontal={false}
                        stroke="transparent"
                        strokeDasharray="0 0"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={false}
                        height={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: '#6B7280',
                          fontSize: '0.8rem',
                          fontFamily: chartTheme.fontFamily,
                          fontWeight: 500
                        }}
                        tickFormatter={(value) => `$${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
                        width={65}
                        tickCount={6}
                        tickMargin={10}
                      />
                      <RechartsTooltip 
                        content={<CustomTooltip chartType="bar" />}
                        cursor={false}
                        wrapperStyle={{
                          zIndex: 1000,
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                        }}
                      />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="top" 
                        align="center" 
                        iconType="square"
                        wrapperStyle={{
                          paddingBottom: '20px',
                          display: 'none' // Hide the legend completely
                        }}
                      />
                      {category === "all" ? (
                        ["Food", "Transportation", "Shopping"].map((cat, i) => {
                          // Calculate total for percentage calculation
                          const total = monthlyData.reduce((sum, data) => sum + (data[cat] || 0), 0);
                          
                          return (
                            <Bar 
                              key={cat}
                              dataKey={cat} 
                              fill={COLORS[i % COLORS.length]}
                              radius={[4, 4, 0, 0]}
                              name={cat}
                              isAnimationActive={false}
                              style={{
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                opacity: 0.9,
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))'
                              }}
                              onMouseOver={() => {
                                document.querySelectorAll(`.bar-label-${cat.replace(/\s+/g, '-').toLowerCase()}`).forEach(el => {
                                  el.style.opacity = '1';
                                  el.style.transform = 'translateY(-2px)';
                                });
                              }}
                              onMouseOut={() => {
                                document.querySelectorAll(`.bar-label-${cat.replace(/\s+/g, '-').toLowerCase()}`).forEach(el => {
                                  el.style.opacity = '0.9';
                                  el.style.transform = 'translateY(0)';
                                });
                              }}
                            >
                              {monthlyData.map((entry, index) => {
                                const value = entry[cat] || 0;
                                const isPositive = value >= 0;
                                const yPosition = isPositive ? -5 : 15;
                                const fillColor = isPositive ? '#1F2937' : '#EF4444';
                                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                const className = `bar-label-${cat.replace(/\s+/g, '-').toLowerCase()}`;
                                
                                return (
                                  <g key={`label-${index}`}>
                                    <text
                                      x={`${(index * (100 / monthlyData.length)) + (100 / (monthlyData.length * 2))}%`}
                                      y={`${yPosition}%`}
                                      textAnchor="middle"
                                      fill={fillColor}
                                      fontSize={11}
                                      fontWeight={600}
                                      className={className}
                                      style={{
                                        textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                                        pointerEvents: 'none',
                                        opacity: 0.9,
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      ${value.toLocaleString()}
                                    </text>
                                    <text
                                      x={`${(index * (100 / monthlyData.length)) + (100 / (monthlyData.length * 2))}%`}
                                      y={`${yPosition - 12}%`}
                                      textAnchor="middle"
                                      fill="#6B7280"
                                      fontSize={9}
                                      fontWeight={500}
                                      className={className}
                                      style={{
                                        pointerEvents: 'none',
                                        opacity: 0.9,
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      {percentage}%
                                    </text>
                                    <title>{`${cat}: $${value.toLocaleString()} (${percentage}% of total)`}</title>
                                  </g>
                                );
                              })}
                            </Bar>
                          );
                        })
                      ) : (
                        <Bar 
                          dataKey={category} 
                          fill={COLORS[0]} 
                          radius={[4, 4, 0, 0]}
                          name={category}
                        >
                          {monthlyData.map((entry, index) => {
                            const value = entry[category] || 0;
                            return (
                              <g key={`label-${index}`}>
                                <text
                                  x={`${(index * (100 / monthlyData.length)) + (100 / (monthlyData.length * 2))}%`}
                                  y="-5%"
                                  textAnchor="middle"
                                  fill="#1F2937"
                                  fontSize={11}
                                  fontWeight={600}
                                  style={{
                                    textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                                    pointerEvents: 'none'
                                  }}
                                >
                                  ${value.toLocaleString()}
                                </text>
                                <title>{`${category}: $${value.toLocaleString()}`}</title>
                              </g>
                            );
                          })}
                        </Bar>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        /* Table View */
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Transaction History</Typography>
              <TextField
                size="small"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                sx={{ width: 300 }}
              />
            </Box>

            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: theme.palette.action.hover }}>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow
                      key={tx.id}
                      hover
                      sx={{ bgcolor: tx.type === "income" ? "rgba(34,197,94,0.05)" : "inherit" }}
                    >
                      <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell>{tx.category}</TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: tx.type === "income" ? "success.main" : "error.main",
                          fontWeight: "bold",
                        }}
                      >
                        {tx.type === "income" ? "+" : "-"}${tx.amount}
                      </TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>{tx.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 8, 15]}
              component="div"
              count={transactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Reports;
