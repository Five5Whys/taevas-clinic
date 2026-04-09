import React from 'react';
import { useParams } from 'react-router-dom';
import DoctorProfile from '@/pages/doctor/Profile';

/**
 * CA read-only view of a doctor's professional profile.
 * Reuses the same Profile component with readOnly=true.
 */
const DoctorProfileView: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  return <DoctorProfile readOnly doctorId={doctorId} />;
};

export default DoctorProfileView;
