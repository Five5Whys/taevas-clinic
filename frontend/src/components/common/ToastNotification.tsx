import { Snackbar, Alert } from '@mui/material';
import { ToastSeverity } from '../../hooks/useToast';

interface ToastNotificationProps {
  open: boolean;
  message: string;
  severity: ToastSeverity;
  onClose: () => void;
}

export const ToastNotification = ({ open, message, severity, onClose }: ToastNotificationProps) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  >
    <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);
