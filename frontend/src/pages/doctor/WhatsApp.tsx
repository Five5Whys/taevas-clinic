import React, { useState } from 'react';
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
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Send,
  Settings,
  MoreVert,
  Chat as MessageCircle,
  DoneAll as CheckDouble,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useWhatsAppConfig } from '@/hooks/doctor';

const WhatsApp: React.FC = () => {
  const [messageText, setMessageText] = useState('');
  const { data: waConfig, isLoading } = useWhatsAppConfig();

  const chatMessages = (waConfig?.recentMessages ?? waConfig?.chatMessages ?? []) as any[];
  const botPerformance = waConfig?.botPerformance ?? waConfig?.performance ?? {};
  const botSettings = waConfig?.settings ?? waConfig?.botSettings ?? {};

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="WhatsApp">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress sx={{ color: '#25D366' }} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="WhatsApp">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Left: Chat Interface */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 600,
              }}
            >
              {/* Chat Header */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      backgroundColor: '#25D366',
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                  >
                    TB
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Taevas Bot
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {waConfig?.phoneNumber ?? ''} {waConfig?.activeChats ? `• ${waConfig.activeChats} active chats` : ''}
                    </Typography>
                  </Box>
                </Box>
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small">
                    <Settings fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>

              {/* Chat Body */}
              <Box
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  p: 2,
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                {chatMessages.map((msg, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '70%',
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor:
                          msg.type === 'user' ? '#5519E6' : '#fff',
                        color: msg.type === 'user' ? '#fff' : '#000',
                        border: msg.type === 'user' ? 'none' : '1px solid #eee',
                      }}
                    >
                      <Typography variant="body2">
                        {msg.text}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.7,
                            fontSize: '0.7rem',
                          }}
                        >
                          {msg.time}
                        </Typography>
                        {msg.type === 'user' && <CheckDouble sx={{ fontSize: 14 }} />}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Chat Footer */}
              <Box
                sx={{
                  p: 2,
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  gap: 1,
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  size="small"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small">
                          <MessageCircle fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#25D366',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#1fad55' },
                    minWidth: 44,
                  }}
                  size="small"
                >
                  <Send fontSize="small" />
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* Right: Bot Performance & Settings */}
          <Grid item xs={12} md={4}>
            {/* Bot Performance */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Bot Performance
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Messages Sent
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5519E6' }}>
                      {botPerformance.messagesSent ?? '-'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Appointments Booked
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#A046F0' }}>
                      {botPerformance.appointmentsBooked ?? '-'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Reports Received
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF8232' }}>
                      {botPerformance.reportsReceived ?? '-'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Automation Rate
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#CDDC50' }}>
                      {botPerformance.automationRate ?? '-'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Bot Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Bot Settings
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      Appointment Booking
                    </Typography>
                    <Chip
                      label="Enabled"
                      size="small"
                      sx={{
                        backgroundColor: '#CDDC50',
                        color: '#000',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      Report Collection
                    </Typography>
                    <Chip
                      label="Enabled"
                      size="small"
                      sx={{
                        backgroundColor: '#CDDC50',
                        color: '#000',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      Appointment Reminders
                    </Typography>
                    <Chip
                      label="Enabled"
                      size="small"
                      sx={{
                        backgroundColor: '#CDDC50',
                        color: '#000',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      Follow-up Messages
                    </Typography>
                    <Chip
                      label="Enabled"
                      size="small"
                      sx={{
                        backgroundColor: '#CDDC50',
                        color: '#000',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      mt: 1,
                      color: '#5519E6',
                      borderColor: '#5519E6',
                    }}
                  >
                    Configure Bot
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

export default WhatsApp;
