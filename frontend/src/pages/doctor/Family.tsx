import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Chip,
  Stack,
  Avatar,
  AvatarGroup,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  FamilyRestroom,
  Favorite,
  People,
  AutoAwesome as Sparkles,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Family: React.FC = () => {
  const familyMembers = [
    {
      id: 1,
      name: 'Anita',
      age: 35,
      gender: 'F',
      condition: 'Allergic Rhinitis',
      status: 'Active',
      color: '#5519E6',
    },
    {
      id: 2,
      name: 'Vijay',
      age: 42,
      gender: 'M',
      condition: 'Hypertension',
      status: 'Referred',
      color: '#A046F0',
    },
    {
      id: 3,
      name: 'Riya',
      age: 12,
      gender: 'F',
      condition: 'Healthy',
      status: 'Monitor',
      color: '#CDDC50',
    },
    {
      id: 4,
      name: 'Dadi',
      age: 72,
      gender: 'F',
      condition: 'Vertigo',
      status: 'Monitor',
      color: '#FF8232',
    },
  ];

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#5519E6';
      case 'Referred':
        return '#A046F0';
      case 'Monitor':
        return '#FF8232';
      case 'Healthy':
        return '#CDDC50';
      default:
        return '#999';
    }
  };

  return (
    <DashboardLayout pageTitle="Family">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column - Family Info */}
          <Grid item xs={12} md={6}>
            {/* Family Header */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <FamilyRestroom sx={{ fontSize: 40, color: '#5519E6' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Sharma Family
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Pune, Maharashtra • 4 Members
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ pt: 2, borderTop: '1px solid #eee' }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                    Family Head
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Vijay Sharma (42M)
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Family Members */}
            <Stack spacing={2}>
              {familyMembers.map((member) => (
                <Card
                  key={member.id}
                  variant="outlined"
                  sx={{
                    borderLeftWidth: 4,
                    borderLeftColor: member.color,
                    '&:hover': {
                      boxShadow: 2,
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            backgroundColor: member.color,
                            color: '#fff',
                            fontWeight: 'bold',
                          }}
                        >
                          {member.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {member.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {member.age}{member.gender}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={member.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusBgColor(member.status),
                          color: member.status === 'Healthy' ? '#000' : '#fff',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                    <Typography variant="body2">{member.condition}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            {/* AI Family Health Insight */}
            <Card
              sx={{
                background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                color: '#fff',
                mb: 3,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
                  <Sparkles sx={{ fontSize: 32, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      AI Family Health Insight
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ p: 1.5, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>ENT Condition Pattern:</strong> 3 of 4 members have ENT-related conditions
                        </Typography>
                        <Typography variant="body2">
                          <strong>Genetic Predisposition:</strong> Possible hereditary allergic rhinitis and hearing issues
                        </Typography>
                      </Box>
                      <Box sx={{ p: 1.5, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 1 }}>
                        <Typography variant="body2">
                          <strong>Recommendation:</strong> Consider preventive ENT screening for Riya (age 12)
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Family Health Summary */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Family Health Summary
                </Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ border: 'none', paddingY: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <People sx={{ color: '#5519E6', fontSize: 20 }} />
                          <Typography variant="body2" color="textSecondary">
                            Total Members
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ border: 'none', paddingY: 1.5, textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          4
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ border: 'none', paddingY: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Favorite sx={{ color: '#FF8232', fontSize: 20 }} />
                          <Typography variant="body2" color="textSecondary">
                            Total Visits
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ border: 'none', paddingY: 1.5, textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          14
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ border: 'none', paddingY: 1.5 }}>
                        <Typography variant="body2" color="textSecondary">
                          Total Spend
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ border: 'none', paddingY: 1.5, textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          ₹8,400
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ border: 'none', paddingY: 1.5 }}>
                        <Typography variant="body2" color="textSecondary">
                          ABHA Linked
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ border: 'none', paddingY: 1.5, textAlign: 'right' }}>
                        <Chip
                          label="3/4"
                          sx={{
                            backgroundColor: '#CDDC50',
                            color: '#000',
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ border: 'none', paddingY: 1.5 }}>
                        <Typography variant="body2" color="textSecondary">
                          WhatsApp Active
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ border: 'none', paddingY: 1.5, textAlign: 'right' }}>
                        <Chip
                          label="2/4"
                          sx={{
                            backgroundColor: '#25D366',
                            color: '#fff',
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: '#5519E6',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#4410cc' },
                  }}
                >
                  View Family Records
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default Family;
