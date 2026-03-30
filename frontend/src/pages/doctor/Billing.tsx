import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  Avatar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  Receipt,
  FileDownload,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Billing: React.FC = () => {
  const todaysBills = [
    { invoiceNo: 'INV-001', patient: 'Rajiv Kumar', amount: 800, status: 'Paid' },
    { invoiceNo: 'INV-002', patient: 'Priya Singh', amount: 1200, status: 'Paid' },
    { invoiceNo: 'INV-003', patient: 'Amit Patel', amount: 2500, status: 'Pending' },
    { invoiceNo: 'INV-004', patient: 'Neha Sharma', amount: 950, status: 'Paid' },
    { invoiceNo: 'INV-005', patient: 'Anita Sharma', amount: 1300, status: 'Paid' },
    { invoiceNo: 'INV-006', patient: 'Kamala Devi', amount: 11650, status: 'Pending' },
  ];

  return (
    <DashboardLayout pageTitle="Billing">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Stat Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Today's Revenue
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', my: 1 }}>
                      ₹18,400
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#CDDC50', fontWeight: 'bold' }}>
                      +5.2% from avg
                    </Typography>
                  </Box>
                  <Avatar sx={{ backgroundColor: '#5519E6', width: 48, height: 48 }}>
                    <AttachMoney />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Month Revenue
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', my: 1 }}>
                      ₹2.1L
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#CDDC50', fontWeight: 'bold' }}>
                      +8% from last month
                    </Typography>
                  </Box>
                  <Avatar sx={{ backgroundColor: '#A046F0', width: 48, height: 48 }}>
                    <TrendingUp />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Bills Today
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', my: 1 }}>
                      23
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#5519E6', fontWeight: 'bold' }}>
                      4 pending
                    </Typography>
                  </Box>
                  <Avatar sx={{ backgroundColor: '#FF8232', width: 48, height: 48 }}>
                    <Receipt />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Pending Amount
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', my: 1 }}>
                      ₹3,200
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#FF8232', fontWeight: 'bold' }}>
                      Follow-up needed
                    </Typography>
                  </Box>
                  <Avatar sx={{ backgroundColor: '#CDDC50', width: 48, height: 48 }}>
                    <AttachMoney />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Today's Bills Table */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Today's Bills
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell>Invoice #</TableCell>
                        <TableCell>Patient Name</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {todaysBills.map((bill) => (
                        <TableRow key={bill.invoiceNo}>
                          <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                            {bill.invoiceNo}
                          </TableCell>
                          <TableCell>{bill.patient}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            ₹{bill.amount}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={bill.status}
                              size="small"
                              sx={{
                                backgroundColor: bill.status === 'Paid' ? '#CDDC50' : '#FF8232',
                                color: bill.status === 'Paid' ? '#000' : '#fff',
                                fontWeight: 'bold',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="text">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* GST Export Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  GST & Export
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      GST Collected (March)
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#5519E6', my: 1 }}>
                      ₹31,248
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      ABDM DHIS Credits
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#A046F0', my: 1 }}>
                      ₹4,200
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<FileDownload />}
                    sx={{
                      backgroundColor: '#5519E6',
                      color: '#fff',
                      '&:hover': { backgroundColor: '#4410cc' },
                    }}
                  >
                    Export GST Report
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ color: '#5519E6', borderColor: '#5519E6' }}
                  >
                    View DHIS Details
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default Billing;
