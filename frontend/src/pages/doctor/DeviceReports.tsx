import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Stack,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  AccessTime as Clock,
  DevicesOther as Devices,
  Assignment,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDoctorDeviceReports } from '@/hooks/doctor';
import { toTitle } from '@/utils/helpers';

const DeviceReports: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const { data: reportsData, isLoading } = useDoctorDeviceReports();

  const allReports = (Array.isArray(reportsData) ? reportsData : reportsData?.reports ?? reportsData?.content ?? []) as any[];
  const pendingReports = allReports.filter((r: any) => r.status === 'PENDING' || r.status === 'Review' || !r.reviewed) ?? [];
  const recentlyIngested = reportsData?.recentlyIngested ?? allReports.filter((r: any) => r.status === 'Completed' || r.status === 'Processing') ?? [];
  const agentStatus = reportsData?.agentStatus ?? {};

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Device Reports">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress sx={{ color: '#5519E6' }} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Device Reports">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {/* Taevas Agent Status */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Taevas Agent Status
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Version
                    </Typography>
                    <Chip label="v2.4.1" variant="outlined" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Watch Folder Status
                    </Typography>
                    <Chip
                      icon={<CheckCircle />}
                      label="Active"
                      size="small"
                      sx={{
                        backgroundColor: '#CDDC50',
                        color: '#000',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      Connected Devices
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        icon={<Devices />}
                        label="Audecom"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        icon={<Devices />}
                        label="Equipoise VNG"
                        variant="outlined"
                        size="small"
                      />
                    </Stack>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Reports Generated Today
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5519E6' }}>
                      {agentStatus.reportsToday ?? allReports.length}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Universal Ingestion */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Universal Ingestion
                </Typography>

                {/* Drop Zone */}
                <Paper
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={() => setDragActive(false)}
                  sx={{
                    border: '2px dashed #5519E6',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: dragActive ? '#f0e6ff' : '#fafafa',
                    transition: 'all 0.2s',
                    mb: 2,
                  }}
                >
                  <CloudUpload
                    sx={{
                      fontSize: 48,
                      color: '#5519E6',
                      mb: 1,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Drop files here or click to upload
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Supports PDF, JPG, PNG, Excel, CSV
                  </Typography>
                </Paper>

                {/* Recently Ingested */}
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Recently Ingested
                </Typography>
                <Stack spacing={1}>
                  {recentlyIngested.map((item: { id: string; name: string; time: string; device: string; status: string }) => (
                    <Box
                      key={item.id}
                      sx={{
                        p: 1.5,
                        backgroundColor: '#f9f9f9',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {item.time}
                        </Typography>
                      </Box>
                      <Chip
                        icon={item.status === 'Completed' ? <CheckCircle /> : <Clock />}
                        label={toTitle(item.status)}
                        size="small"
                        variant="outlined"
                        sx={{
                          backgroundColor:
                            item.status === 'Completed' ? '#CDDC50' : '#FF8232',
                          color: '#000',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Pending Review */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Pending Review ({pendingReports.length})
                </Typography>
                <Stack spacing={2}>
                  {pendingReports.map((report) => (
                    <Card
                      key={report.id}
                      variant="outlined"
                      sx={{
                        '&:hover': {
                          boxShadow: 2,
                          borderColor: '#5519E6',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                backgroundColor: '#f0e6ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#5519E6',
                              }}
                            >
                              <Assignment />
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {report.type}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {report.patient}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label="Review"
                            size="small"
                            sx={{
                              backgroundColor: '#5519E6',
                              color: '#fff',
                              fontWeight: 'bold',
                            }}
                          />
                        </Box>

                        <Box sx={{ backgroundColor: '#f9f9f9', p: 1.5, borderRadius: 1, mb: 2 }}>
                          <Typography variant="caption" color="textSecondary">
                            Device: {report.device}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                            {report.values}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="textSecondary">
                            {report.time}
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ color: '#FF8232', borderColor: '#FF8232' }}
                            >
                              Flag
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                backgroundColor: '#5519E6',
                                color: '#fff',
                                '&:hover': { backgroundColor: '#4410cc' },
                              }}
                            >
                              Review
                            </Button>
                          </Stack>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default DeviceReports;
