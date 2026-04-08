import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Chip,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  ErrorOutline as AlertCircle,
  Schedule as Clock,
  Shield,
  Link as Link2,
  VerifiedUser as FileCheck,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useComplianceStatus } from '@/hooks/clinicadmin/useCompliance';

interface ComplianceItem {
  icon: React.ReactNode;
  title: string;
  status: 'active' | 'partial' | 'compliant';
  description: string;
  detailText: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'ABHA ID Collection': <Link2 sx={{ fontSize: 24 }} />,
  'FHIR R4 Record Push': <FileCheck sx={{ fontSize: 24 }} />,
  'NMC Doctor Verification': <AlertCircle sx={{ fontSize: 24 }} />,
  'Data Encryption': <Shield sx={{ fontSize: 24 }} />,
};

const ComplianceStatus: React.FC = () => {
  const { data: complianceData, isLoading } = useComplianceStatus();

  const overallScore: number = complianceData?.overallScore ?? 0;
  const complianceItems: ComplianceItem[] = (complianceData?.items ?? []).map((item: any) => ({
    icon: ICON_MAP[item.title] ?? <Shield sx={{ fontSize: 24 }} />,
    title: item.title,
    status: item.status,
    description: item.description,
    detailText: item.detailText,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'partial':
        return 'warning';
      case 'compliant':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle sx={{ fontSize: 20 }} />;
      case 'partial':
        return <Clock sx={{ fontSize: 20 }} />;
      case 'compliant':
        return <Shield sx={{ fontSize: 20 }} />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'partial':
        return 'Partial';
      case 'compliant':
        return 'Compliant';
      default:
        return 'Unknown';
    }
  };

  return (
    <DashboardLayout pageTitle="Compliance Status">
      <Alert severity="warning" variant="outlined" sx={{ mb: 2, borderRadius: '12px', fontWeight: 700, bgcolor: '#FFF8E1', color: '#B45309' }}>
        🚧 This feature is under development — coming soon!
      </Alert>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : complianceItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: '#6B7280' }}>
          <Typography>No compliance data available.</Typography>
        </Box>
      ) : (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={3}>
          {/* Compliance Score Header */}
          <Card sx={{ background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {overallScore}%
                </Typography>
                <Typography variant="body1">Overall Compliance Score</Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Compliance Items Grid */}
          <Grid container spacing={3}>
            {complianceItems.map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    border: `2px solid ${
                      item.status === 'active' ? '#CDDC50' : item.status === 'partial' ? '#FF8232' : '#4caf50'
                    }20`,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          backgroundColor:
                            item.status === 'active'
                              ? '#CDDC5020'
                              : item.status === 'partial'
                              ? '#FF823220'
                              : '#4caf5020',
                          color:
                            item.status === 'active'
                              ? '#CDDC50'
                              : item.status === 'partial'
                              ? '#FF8232'
                              : '#4caf50',
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {item.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Chip
                        icon={getStatusIcon(item.status) as any}
                        label={getStatusLabel(item.status)}
                        color={getStatusColor(item.status) as any}
                        size="small"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', fontWeight: 500 }}
                    >
                      {item.detailText}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
      )}
    </DashboardLayout>
  );
};

export default ComplianceStatus;
