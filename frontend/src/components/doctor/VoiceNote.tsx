import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Paper,
  Stack,
  Chip,
  Drawer,
  Divider,
  TextField,
  FormLabel,
  Tooltip,
  Alert,
} from '@mui/material';
import * as Icons from '@mui/icons-material';

/* ------------------------------------------------------------------ */
/*  Window augmentation for Web Speech API                             */
/* ------------------------------------------------------------------ */
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

/* ------------------------------------------------------------------ */
/*  SOAP section classifier                                            */
/* ------------------------------------------------------------------ */
type SOAPSection = 'subjective' | 'objective' | 'assessment' | 'plan';

interface SOAPData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

const SOAP_KEYWORDS: Record<SOAPSection, RegExp> = {
  subjective: /\b(patient presents|complains? of|symptoms?|history of|suffering from|reports?|feels?|chief complaint|pain|discomfort)\b/i,
  objective: /\b(on examination|vitals?|blood pressure|temperature|pulse|heart rate|respiratory rate|spo2|oxygen|weight|height|bmi|on exam|examination|findings?|auscultation|palpation)\b/i,
  assessment: /\b(diagnosis|impression|assessment|diagnosed with|consistent with|suggestive of|likely|probable|differential)\b/i,
  plan: /\b(prescribe|advise[ds]?|plan|follow.?up|refer|recommend|medication|treatment|review|discharge|counsel|tablet|capsule|mg\b|dose)\b/i,
};

function classifySentence(text: string): SOAPSection {
  // Check in priority order: plan > assessment > objective > subjective
  const order: SOAPSection[] = ['plan', 'assessment', 'objective', 'subjective'];
  for (const section of order) {
    if (SOAP_KEYWORDS[section].test(text)) return section;
  }
  return 'subjective'; // default
}

function classifyTranscript(transcript: string): SOAPData {
  const result: SOAPData = { subjective: '', objective: '', assessment: '', plan: '' };
  // Split on sentence-ending punctuation or common conjunctions
  const sentences = transcript
    .split(/(?<=[.!?])\s+|(?:,\s*(?=(?:on examination|diagnosis|prescribe|advise|plan|assessment|impression)))/i)
    .filter((s) => s.trim().length > 0);

  for (const sentence of sentences) {
    const section = classifySentence(sentence);
    result[section] = result[section]
      ? `${result[section]} ${sentence.trim()}`
      : sentence.trim();
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  Pulsing dot animation (CSS keyframes via MUI sx)                   */
/* ------------------------------------------------------------------ */
const pulseKeyframes = {
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.4)', opacity: 0.6 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
};

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */
export interface VoiceNoteProps {
  open: boolean;
  onClose: () => void;
  onApplySOAP: (soap: SOAPData) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */
const VoiceNote: React.FC<VoiceNoteProps> = ({ open, onClose, onApplySOAP }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [soap, setSoap] = useState<SOAPData>({ subjective: '', objective: '', assessment: '', plan: '' });
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSupported =
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  /* ---- timer ---- */
  useEffect(() => {
    if (isRecording) {
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatDuration = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  /* ---- start / stop ---- */
  const startRecording = useCallback(() => {
    if (!isSupported) {
      setError('Web Speech API is not supported in this browser. Please use Google Chrome.');
      return;
    }
    setError(null);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    let finalTranscript = transcript; // carry forward existing text

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += (finalTranscript ? ' ' : '') + result[0].transcript;
          setTranscript(finalTranscript);
          setSoap(classifyTranscript(finalTranscript));
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimText(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech') return; // ignore silence
      setError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      // Browser may stop recognition on its own; restart if we're still in recording state
      if (recognitionRef.current === recognition) {
        // Only restart if the component still expects recording
        try {
          recognition.start();
        } catch {
          setIsRecording(false);
        }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [isSupported, transcript]);

  const stopRecording = useCallback(() => {
    const rec = recognitionRef.current;
    recognitionRef.current = null; // prevent auto-restart in onend
    if (rec) {
      try { rec.stop(); } catch { /* ignore */ }
    }
    setIsRecording(false);
    setInterimText('');
  }, []);

  const toggleRecording = () => (isRecording ? stopRecording() : startRecording());

  /* ---- reset ---- */
  const handleReset = () => {
    stopRecording();
    setTranscript('');
    setInterimText('');
    setSoap({ subjective: '', objective: '', assessment: '', plan: '' });
    setDuration(0);
    setError(null);
  };

  /* ---- apply ---- */
  const handleApply = () => {
    stopRecording();
    onApplySOAP(soap);
    onClose();
  };

  /* ---- cleanup on unmount ---- */
  useEffect(() => {
    return () => {
      const rec = recognitionRef.current;
      recognitionRef.current = null;
      if (rec) try { rec.abort(); } catch { /* */ }
    };
  }, []);

  /* ---- SOAP field edit helper ---- */
  const updateSoapField = (field: SOAPSection, value: string) =>
    setSoap((prev) => ({ ...prev, [field]: value }));

  const soapFields: { key: SOAPSection; label: string; icon: React.ReactElement }[] = [
    { key: 'subjective', label: 'Subjective (Chief Complaint / HPI)', icon: <Icons.Person sx={{ fontSize: '1rem' }} /> },
    { key: 'objective', label: 'Objective (Examination)', icon: <Icons.Visibility sx={{ fontSize: '1rem' }} /> },
    { key: 'assessment', label: 'Assessment (Diagnosis)', icon: <Icons.LocalHospital sx={{ fontSize: '1rem' }} /> },
    { key: 'plan', label: 'Plan (Treatment)', icon: <Icons.Assignment sx={{ fontSize: '1rem' }} /> },
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => { stopRecording(); onClose(); }}
      PaperProps={{ sx: { width: { xs: '100%', sm: 480 }, p: 0 } }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
          color: '#fff',
          px: 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icons.Mic sx={{ fontSize: '1.4rem' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
            Voice Note
          </Typography>
        </Box>
        <IconButton onClick={() => { stopRecording(); onClose(); }} sx={{ color: '#fff' }}>
          <Icons.Close />
        </IconButton>
      </Box>

      <Box sx={{ p: 2.5, overflowY: 'auto', flex: 1 }}>
        {/* Error */}
        {error && (
          <Alert severity="warning" sx={{ mb: 2, fontSize: '0.8rem' }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Mic Button Area */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'inline-flex',
              position: 'relative',
              mb: 1,
            }}
          >
            {/* Outer pulse ring */}
            {isRecording && (
              <Box
                sx={{
                  ...pulseKeyframes,
                  position: 'absolute',
                  inset: -8,
                  borderRadius: '50%',
                  border: '3px solid #D32F2F',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            )}
            <IconButton
              onClick={toggleRecording}
              sx={{
                width: 72,
                height: 72,
                backgroundColor: isRecording ? '#D32F2F' : '#5519E6',
                color: '#fff',
                '&:hover': { backgroundColor: isRecording ? '#B71C1C' : '#3D0FB0' },
                transition: 'background-color 0.3s',
              }}
            >
              {isRecording ? <Icons.Stop sx={{ fontSize: '2rem' }} /> : <Icons.Mic sx={{ fontSize: '2rem' }} />}
            </IconButton>
          </Box>

          {/* Status */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            {isRecording && (
              <Box
                sx={{
                  ...pulseKeyframes,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#D32F2F',
                  animation: 'pulse 1s ease-in-out infinite',
                }}
              />
            )}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                fontSize: '0.85rem',
                color: isRecording ? '#D32F2F' : '#666',
              }}
            >
              {isRecording ? `Recording... ${formatDuration(duration)}` : transcript ? 'Recording stopped' : 'Tap mic to start'}
            </Typography>
          </Box>

          <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>
            Language: English (India)
          </Typography>
        </Box>

        {/* Live Transcript */}
        {(transcript || interimText) && (
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              mb: 2,
              maxHeight: 140,
              overflowY: 'auto',
              backgroundColor: '#FAFAFA',
              borderColor: isRecording ? '#D32F2F' : '#E0E0E0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <Icons.Subtitles sx={{ fontSize: '0.9rem', color: '#666' }} />
              <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.7rem', color: '#666' }}>
                TRANSCRIPT
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
              {transcript}
              {interimText && (
                <span style={{ color: '#999', fontStyle: 'italic' }}>{' '}{interimText}</span>
              )}
            </Typography>
          </Paper>
        )}

        {/* Waveform-style bars when recording */}
        {isRecording && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 2 }}>
            {[...Array(12)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 3,
                  backgroundColor: '#5519E6',
                  borderRadius: 1,
                  animation: `waveBar 0.8s ease-in-out ${i * 0.07}s infinite alternate`,
                  '@keyframes waveBar': {
                    '0%': { height: 6 },
                    '100%': { height: 20 + Math.random() * 10 },
                  },
                }}
              />
            ))}
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* SOAP Fields */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
          <Icons.AutoAwesome sx={{ fontSize: '1rem', color: '#5519E6' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
            Auto-classified SOAP Note
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          {soapFields.map(({ key, label, icon }) => (
            <Box key={key}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                {icon}
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{label}</FormLabel>
                {soap[key] && (
                  <Chip
                    label="auto-filled"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.6rem',
                      backgroundColor: '#EDE7F6',
                      color: '#5519E6',
                    }}
                  />
                )}
              </Box>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                placeholder={`${label}...`}
                value={soap[key]}
                onChange={(e) => updateSoapField(key, e.target.value)}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
              />
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #E0E0E0',
          display: 'flex',
          gap: 1,
        }}
      >
        <Tooltip title="Clear everything">
          <Button
            variant="outlined"
            size="small"
            onClick={handleReset}
            startIcon={<Icons.Refresh sx={{ fontSize: '0.9rem' }} />}
            sx={{ fontSize: '0.8rem', flex: 1 }}
          >
            Reset
          </Button>
        </Tooltip>
        <Button
          variant="contained"
          size="small"
          onClick={handleApply}
          disabled={!soap.subjective && !soap.objective && !soap.assessment && !soap.plan}
          startIcon={<Icons.CheckCircle sx={{ fontSize: '0.9rem' }} />}
          sx={{
            backgroundColor: '#5519E6',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            flex: 2,
            '&:hover': { backgroundColor: '#3D0FB0' },
          }}
        >
          Apply to SOAP Note
        </Button>
      </Box>
    </Drawer>
  );
};

export default VoiceNote;
