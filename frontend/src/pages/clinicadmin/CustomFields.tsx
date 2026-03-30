import React, { useState } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Lock, Delete as Trash2, Add as Plus } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const CustomFields: React.FC = () => {
  const [unlockedFields, setUnlockedFields] = useState([
    { id: '1', name: 'Referred By', type: 'text' },
    { id: '2', name: 'Tinnitus Score', type: 'number' },
  ]);

  const lockedFields = [
    { name: 'Full Name', type: 'text', scope: 'Global' },
    { name: 'DOB', type: 'date', scope: 'Global' },
    { name: 'ABHA ID', type: 'API', scope: 'India' },
  ];

  const handleRemoveField = (id: string) => {
    setUnlockedFields(unlockedFields.filter((f) => f.id !== id));
  };

  const handleAddField = () => {
    alert('Add Field dialog would open here');
  };

  return (
    <DashboardLayout pageTitle="Custom Fields">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={3}>
          {/* Locked Fields */}
          <Card>
            <CardHeader
              title="Locked Fields"
              avatar={<Lock sx={{ fontSize: 24, marginRight: 1 }} />}
              subheader="Global system fields, cannot be removed"
            />
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Field Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Scope</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lockedFields.map((field, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Lock sx={{ fontSize: 16, color: '#999' }} />
                            {field.name}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={field.type} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{field.scope}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Unlocked Fields */}
          <Card>
            <CardHeader
              title="Unlocked Fields"
              subheader="Clinic-specific fields, removable"
            />
            <CardContent>
              <TableContainer sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Field Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {unlockedFields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell>{field.name}</TableCell>
                        <TableCell>
                          <Chip label={field.type} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            startIcon={<Trash2 sx={{ fontSize: 16 }} />}
                            color="error"
                            onClick={() => handleRemoveField(field.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="outlined"
                startIcon={<Plus sx={{ fontSize: 18 }} />}
                onClick={handleAddField}
              >
                Add Field
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </DashboardLayout>
  );
};

export default CustomFields;
