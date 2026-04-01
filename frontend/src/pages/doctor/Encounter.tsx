import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Avatar,
  Stack,
  Tabs,
  Tab,
  TextField,
  FormLabel,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Mic,
  Edit,
  CheckCircle,
  Warning,
  Description,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useEncounterByAppointment } from '@/hooks/doctor';
import VoiceNote from '@/components/doctor/VoiceNote';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`encounter-tabpanel-${index}`}
      aria-labelledby={`encounter-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const Encounter: React.FC = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId') ?? '';
  const { data: encounterData, isLoading } = useEncounterByAppointment(appointmentId);

  const [tabValue, setTabValue] = useState(0);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [hpi, setHpi] = useState('');
  const [examination, setExamination] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [icdCode, setIcdCode] = useState('');
  const [rightTm, setRightTm] = useState('Normal');
  const [leftTm, setLeftTm] = useState('Normal');
  const [cerumen, setCerumen] = useState('No');
  const [earNotes, setEarNotes] = useState('');
  const [septum, setSeptum] = useState('Normal');
  const [turbinates, setTurbinates] = useState('Mild hypertrophy');
  const [discharge, setDischarge] = useState('Mucoid');
  const [polyps, setPolyps] = useState('No');
  const [tonsils, setTonsils] = useState('Grade 2');
  const [pharynx, setPharynx] = useState('Mild erythema');
  const [vocalCords, setVocalCords] = useState('Normal');
  const [throatNotes, setThroatNotes] = useState('');
  const [voiceNoteOpen, setVoiceNoteOpen] = useState(false);

  const handleApplySOAP = useCallback((soap: { subjective: string; objective: string; assessment: string; plan: string }) => {
    if (soap.subjective) setChiefComplaint((prev) => prev ? `${prev}\n${soap.subjective}` : soap.subjective);
    if (soap.objective) setExamination((prev) => prev ? `${prev}\n${soap.objective}` : soap.objective);
    if (soap.assessment) setAssessment((prev) => prev ? `${prev}\n${soap.assessment}` : soap.assessment);
    if (soap.plan) setPlan((prev) => prev ? `${prev}\n${soap.plan}` : soap.plan);
  }, []);

  useEffect(() => {
    if (encounterData) {
      setChiefComplaint(encounterData.chiefComplaint ?? encounterData.chief_complaint ?? '');
      setHpi(encounterData.hpi ?? encounterData.historyOfPresentingIllness ?? '');
      setExamination(encounterData.examination ?? encounterData.examinationFindings ?? '');
      setAssessment(encounterData.assessment ?? '');
      setPlan(encounterData.plan ?? '');
      setIcdCode(encounterData.icdCode ?? encounterData.icd_code ?? '');
      if (encounterData.entExam) {
        const ent = encounterData.entExam;
        setRightTm(ent.rightTm ?? 'Normal');
        setLeftTm(ent.leftTm ?? 'Normal');
        setCerumen(ent.cerumen ?? 'No');
        setEarNotes(ent.earNotes ?? '');
        setSeptum(ent.septum ?? 'Normal');
        setTurbinates(ent.turbinates ?? 'Mild hypertrophy');
        setDischarge(ent.discharge ?? 'Mucoid');
        setPolyps(ent.polyps ?? 'No');
        setTonsils(ent.tonsils ?? 'Grade 2');
        setPharynx(ent.pharynx ?? 'Mild erythema');
        setVocalCords(ent.vocalCords ?? 'Normal');
        setThroatNotes(ent.throatNotes ?? '');
      }
    }
  }, [encounterData]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const patient = encounterData?.patient ?? {};

  if (isLoading && appointmentId) {
    return (
      <DashboardLayout pageTitle="Encounter">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress sx={{ color: '#5519E6' }} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Encounter">
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Patient Hero Section */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
            color: '#fff',
            mb: 2,
            p: 2,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#fff',
                  color: '#5519E6',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                }}
              >
                {(patient.name ?? 'AS').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                  {patient.name ?? 'Patient'}
                </Typography>
                <Chip
                  label={`Token ${encounterData?.token ?? patient.token ?? '-'}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    color: '#fff',
                    fontWeight: 'bold',
                    height: 24,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.8rem', display: 'block', mb: 0.5 }}>
                {`ID: ${patient.id ?? '-'} · Age: ${patient.age ?? '-'}${patient.gender ?? ''} · ${patient.condition ?? encounterData?.diagnosis ?? '-'} · Token ${encounterData?.token ?? '-'}`}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                <Chip
                  label="ABHA ID"
                  size="small"
                  sx={{
                    backgroundColor: '#1976D2',
                    color: '#fff',
                    height: 22,
                    fontSize: '0.7rem',
                  }}
                />
                <Chip
                  label="Blood: O+ve"
                  size="small"
                  sx={{
                    backgroundColor: '#D32F2F',
                    color: '#fff',
                    height: 22,
                    fontSize: '0.7rem',
                  }}
                />
                <Chip
                  label="Allergy Alert"
                  size="small"
                  sx={{
                    backgroundColor: '#F57C00',
                    color: '#fff',
                    height: 22,
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
            </Grid>
            <Grid item>
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: '#CDDC50',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    py: 0.75,
                  }}
                  startIcon={<Mic sx={{ fontSize: '1rem' }} />}
                  onClick={() => setVoiceNoteOpen(true)}
                >
                  Voice Note
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: '#fff',
                    color: '#5519E6',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    py: 0.75,
                  }}
                  startIcon={<Edit sx={{ fontSize: '1rem' }} />}
                >
                  Prescribe
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Card>

        {/* Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ '& .MuiTab-root': { fontSize: '0.85rem' } }}>
              <Tab label="SOAP Note" id="encounter-tab-0" />
              <Tab label="ENT Exam" id="encounter-tab-1" />
              <Tab label="Timeline" id="encounter-tab-2" />
              <Tab label="Reports" id="encounter-tab-3" />
              <Tab label="Prescriptions" id="encounter-tab-4" />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 2 }}>
            {/* SOAP Note Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={2}>
                {/* Left Column */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1.5}>
                    <Box>
                      <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.8rem' }}>
                        Chief Complaint
                      </FormLabel>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        placeholder="Enter chief complaint..."
                        value={chiefComplaint}
                        onChange={(e) => setChiefComplaint(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton size="small" sx={{ p: 0.5 }}>
                                <Mic sx={{ fontSize: '1rem' }} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
                      />
                    </Box>

                    <Box>
                      <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.8rem' }}>
                        History of Presenting Illness
                      </FormLabel>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={3}
                        placeholder="Enter HPI..."
                        value={hpi}
                        onChange={(e) => setHpi(e.target.value)}
                        sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
                      />
                    </Box>

                    <Box>
                      <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.8rem' }}>
                        Examination Findings
                      </FormLabel>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={3}
                        placeholder="Enter examination findings..."
                        value={examination}
                        onChange={(e) => setExamination(e.target.value)}
                        sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
                      />
                    </Box>
                  </Stack>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1.5}>
                    {/* AI Diagnosis Card */}
                    <Card sx={{ backgroundColor: '#f5f5f5', border: '2px solid #5519E6', p: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <CheckCircle sx={{ color: '#CDDC50', fontSize: '1.4rem', flexShrink: 0, mt: 0.25 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem', display: 'block' }}>
                            AI Suggested Diagnosis
                          </Typography>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                            J30.1 - Allergic Rhinitis
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Box
                              sx={{
                                flex: 1,
                                height: 6,
                                backgroundColor: '#ddd',
                                borderRadius: 1,
                                overflow: 'hidden',
                              }}
                            >
                              <Box
                                sx={{
                                  height: '100%',
                                  backgroundColor: '#5519E6',
                                  width: '91%',
                                }}
                              />
                            </Box>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                              91%
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666', display: 'block', mt: 0.5 }}>
                            Based on patient symptoms and clinical findings
                          </Typography>
                        </Box>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            backgroundColor: '#CDDC50',
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            py: 0.5,
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.75rem',
                            py: 0.5,
                          }}
                        >
                          Change
                        </Button>
                      </Stack>
                    </Card>

                    <Box>
                      <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.8rem' }}>
                        Assessment
                      </FormLabel>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        placeholder="Clinical assessment..."
                        value={assessment}
                        onChange={(e) => setAssessment(e.target.value)}
                        sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
                      />
                    </Box>

                    <Box>
                      <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.8rem' }}>
                        Plan
                      </FormLabel>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        placeholder="Treatment plan..."
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                        sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <FormLabel sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                          ICD-10 Code
                        </FormLabel>
                        <Chip
                          label="AI-suggested"
                          size="small"
                          sx={{
                            backgroundColor: '#5519E6',
                            color: '#fff',
                            height: 20,
                            fontSize: '0.65rem',
                          }}
                        />
                      </Box>
                      <TextField
                        fullWidth
                        size="small"
                        value={icdCode}
                        onChange={(e) => setIcdCode(e.target.value)}
                        sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
                      />
                    </Box>
                  </Stack>
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: '#5519E6',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                      }}
                    >
                      Save Note
                    </Button>
                    <Button variant="outlined" size="small" sx={{ fontSize: '0.8rem' }}>
                      Prescribe
                    </Button>
                    <Button variant="outlined" size="small" sx={{ fontSize: '0.8rem' }}>
                      Send to Patient
                    </Button>
                    <Button variant="outlined" size="small" sx={{ fontSize: '0.8rem' }}>
                      Push to ABDM
                    </Button>
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem', my: 'auto' }}>
                      (10 credits earned)
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </TabPanel>

            {/* ENT Exam Tab */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={1.5}>
                {/* Ear Exam */}
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, fontSize: '0.9rem' }}>
                      Ear Exam
                    </Typography>
                    <Stack spacing={1}>
                      <Box>
                        <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
                          Right TM
                        </FormLabel>
                        <FormControl fullWidth size="small">
                          <Select
                            value={rightTm}
                            onChange={(e) => setRightTm(e.target.value)}
                            sx={{ fontSize: '0.8rem' }}
                          >
                            <MenuItem value="Normal">Normal</MenuItem>
                            <MenuItem value="Dull">Dull</MenuItem>
                            <MenuItem value="Retracted">Retracted</MenuItem>
                            <MenuItem value="Perforated">Perforated</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
                          Left TM
                        </FormLabel>
                        <FormControl fullWidth size="small">
                          <Select
                            value={leftTm}
                            onChange={(e) => setLeftTm(e.target.value)}
                            sx={{ fontSize: '0.8rem' }}
                          >
                            <MenuItem value="Normal">Normal</MenuItem>
                            <MenuItem value="Dull">Dull</MenuItem>
                            <MenuItem value="Retracted">Retracted</MenuItem>
                            <MenuItem value="Perforated">Perforated</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
                          Cerumen
                        </FormLabel>
                        <FormControl fullWidth size="small">
                          <Select
                            value={cerumen}
                            onChange={(e) => setCerumen(e.target.value)}
                            sx={{ fontSize: '0.8rem' }}
                          >
                            <MenuItem value="No">No</MenuItem>
                            <MenuItem value="Impacted">Impacted</MenuItem>
                            <MenuItem value="Mild">Mild</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <TextField
                        fullWidth
                        size="small"
                        label="Notes"
                        multiline
                        rows={2}
                        value={earNotes}
                        onChange={(e) => setEarNotes(e.target.value)}
                        sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
                      />
                    </Stack>
                  </Card>
                </Grid>

                {/* Nose Exam */}
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, fontSize: '0.9rem' }}>
                      Nose Exam
                    </Typography>
                    <Stack spacing={1}>
                      <Box>
                        <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
                          Septum
                        </FormLabel>
                        <FormControl fullWidth size="small">
                          <Select
                            value={septum}
                            onChange={(e) => setSeptum(e.target.value)}
                            sx={{ fontSize: '0.8rem' }}
                          >
                            <MenuItem value="Normal">Normal</MenuItem>
                            <MenuItem value="Deviated">Deviated</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
                          Turbinates
                        </FormLabel>
                        <FormControl fullWidth size="small">
                          <Select
                            value={turbinates}
                            onChange={(e) => setTurbinates(e.target.value)}
                            sx={{ fontSize: '0.8rem' }}
                          >
                            <MenuItem value="Normal">Normal</MenuItem>
                            <MenuItem value="Mild hypertrophy">Mild hypertrophy</MenuItem>
                            <MenuItem value="Moderate hypertrophy">Moderate hypertrophy</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
                          Discharge
                        </FormLabel>
                        <FormControl fullWidth size="small">
                          <Select
                            value={discharge}
                            onChange={(e) => setDischarge(e.target.value)}
                            sx={{ fontSize: '0.8rem' }}
                          >
                            <MenuItem value="None">None</MenuItem>
                            <MenuItem value="Mucoid">Mucoid</MenuItem>
                            <MenuItem value="Purulent">Purulent</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
                          Polyps
                        </FormLabel>
                        <FormControl fullWidth size="small">
                          <Select
                            value={polyps}
                            onChange={(e) => setPolyps(e.target.value)}
                            sx={{ fontSize: '0.8rem' }}
                          >
                            <MenuItem value="No">No</MenuItem>
                            <MenuItem value="Yes">Yes</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>

                {/* Throat Exam */}
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, fontSize: '0.9rem' }}>
                      Throat Exam
                    </Typography>
                    <Stack spacing={1}>
                      <Box>
                        <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
                          Tonsils
                        </FormLabel>
                        <FormControl fullWidth size="small">
                          <Select
                            value={tonsils}
                            onChange={(e) => setTonsils(e.target.value)}
                            sx={{ fontSize: '0.8rem' }}
                          >
                            <MenuItem value="Grade 1">Grade 1</MenuItem>
                            <MenuItem value="Grade 2">Grade 2</MenuItem>
                            <MenuItem value="Grade 3">Grade 3</MenuItem>
                            <MenuItem value="Grade 4">Grade 4</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
                          Pharynx
                        </FormLabel>
                        <FormControl fullWidth size="small">
                          <Select
                            value={pharynx}
                            onChange={(e) => setPharynx(e.target.value)}
                            sx={{ fontSize: '0.8rem' }}
                          >
                            <MenuItem value="Normal">Normal</MenuItem>
                            <MenuItem value="Mild erythema">Mild erythema</MenuItem>
                            <MenuItem value="Severe erythema">Severe erythema</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <FormLabel sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
                          Vocal Cords
                        </FormLabel>
                        <FormControl fullWidth size="small">
                          <Select
                            value={vocalCords}
                            onChange={(e) => setVocalCords(e.target.value)}
                            sx={{ fontSize: '0.8rem' }}
                          >
                            <MenuItem value="Normal">Normal</MenuItem>
                            <MenuItem value="Inflamed">Inflamed</MenuItem>
                            <MenuItem value="Nodules">Nodules</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <TextField
                        fullWidth
                        size="small"
                        label="Notes"
                        multiline
                        rows={2}
                        value={throatNotes}
                        onChange={(e) => setThroatNotes(e.target.value)}
                        sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
                      />
                    </Stack>
                  </Card>
                </Grid>

                {/* Footer Buttons */}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: '#5519E6',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                      }}
                    >
                      Save ENT Exam
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Mic sx={{ fontSize: '0.9rem' }} />}
                      sx={{ fontSize: '0.8rem' }}
                    >
                      Voice Exam
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Timeline Tab */}
            <TabPanel value={tabValue} index={2}>
              <Stack spacing={1.5}>
                {[
                  { date: '27 Mar 2026', title: 'Encounter - Today', desc: 'Allergic Rhinitis assessed', color: '#5519E6' },
                  { date: '14 Mar 2026', title: 'Prescription', desc: 'Cetirizine & Fluticasone', color: '#A046F0' },
                  { date: '28 Feb 2026', title: 'Device Report', desc: 'Audiogram - Normal hearing', color: '#FF8232' },
                  { date: '1 Feb 2026', title: 'Registration', desc: 'Patient registered', color: '#CDDC50' },
                ].map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1.5 }}>
                    <Box sx={{ width: 32, textAlign: 'center', flexShrink: 0 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: item.color,
                          mx: 'auto',
                          mb: idx < 3 ? 1 : 0,
                        }}
                      />
                      {idx < 3 && <Box sx={{ width: 2, height: 32, backgroundColor: '#eee', mx: 'auto' }} />}
                    </Box>
                    <Card sx={{ flex: 1, p: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                        {item.date} - {item.desc}
                      </Typography>
                    </Card>
                  </Box>
                ))}
              </Stack>
            </TabPanel>

            {/* Reports Tab */}
            <TabPanel value={tabValue} index={3}>
              <Stack spacing={1}>
                {[
                  { title: 'Audiogram Report', date: '27 Mar 2026', device: 'Audecom Device' },
                  { title: 'VNG Report', date: '22 Mar 2026', device: 'Equipoise VNG' },
                ].map((report, idx) => (
                  <Card key={idx} variant="outlined" sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Description sx={{ fontSize: '1.4rem', color: '#5519E6' }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                            {report.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                            {report.date} · {report.device}
                          </Typography>
                        </Box>
                      </Box>
                      <Button variant="outlined" size="small" sx={{ fontSize: '0.75rem' }}>
                        View
                      </Button>
                    </Box>
                  </Card>
                ))}
              </Stack>
            </TabPanel>

            {/* Prescriptions Tab */}
            <TabPanel value={tabValue} index={4}>
              <Card sx={{ backgroundColor: '#f5f5f5', border: '2px solid #5519E6', p: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                  <Warning sx={{ color: '#5519E6', fontSize: '1.2rem', mt: 0.25 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                      AI Suggested Medications for J30.1
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                      Based on diagnosis and patient history
                    </Typography>
                  </Box>
                </Box>
                <Stack spacing={0.75} sx={{ mb: 1.5 }}>
                  {['Cetirizine 10mg OD', 'Fluticasone nasal spray BD', 'Montelukast 10mg OD'].map((med, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 1,
                        backgroundColor: '#fff',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid #eee',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                        {med}
                      </Typography>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: '2px solid #5519E6',
                          backgroundColor: idx === 0 ? '#5519E6' : 'transparent',
                          cursor: 'pointer',
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  sx={{
                    backgroundColor: '#CDDC50',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                  }}
                >
                  Accept & Prescribe
                </Button>
              </Card>
            </TabPanel>
          </CardContent>
        </Card>
      </Container>

      {/* Voice Note Drawer */}
      <VoiceNote
        open={voiceNoteOpen}
        onClose={() => setVoiceNoteOpen(false)}
        onApplySOAP={handleApplySOAP}
      />
    </DashboardLayout>
  );
};

export default Encounter;
