const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const BE = path.join(ROOT, 'backend/src/main/java/com/taevas/clinic');
const FE = path.join(ROOT, 'frontend/src');

function w(fp, content) {
  const dir = path.dirname(fp);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fp, content, 'utf8');
  console.log('  ' + path.relative(ROOT, fp));
}

// ============================
// ENTITIES
// ============================
function genEntity(name, table, fields, extraImports = '') {
  const imports = [
    'import jakarta.persistence.*;',
    'import lombok.*;',
    'import lombok.experimental.SuperBuilder;',
    'import java.util.UUID;',
  ];
  if (extraImports) imports.push(extraImports);

  const fieldLines = fields.map(([col, jtype, jname]) => {
    let nullable = col.endsWith('!');
    let c = col.replace(/[!~]/g, '');
    let unique = col.includes('~');
    let ann = `@Column(name = "${c}"`;
    if (nullable) ann += ', nullable = false';
    if (unique) ann += ', unique = true';
    ann += ')';
    return `    ${ann} private ${jtype} ${jname};`;
  }).join('\n');

  return `package com.taevas.clinic.model;

${imports.join('\n')}

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
@Entity @Table(name = "${table}")
public class ${name} extends BaseEntity {
${fieldLines}
}
`;
}

const entities = [
  ['ClinicStaff', 'clinic_staff', [
    ['clinic_id!', 'UUID', 'clinicId'], ['user_id', 'UUID', 'userId'],
    ['name!', 'String', 'name'], ['role!', 'String', 'role'],
    ['specialization', 'String', 'specialization'], ['phone', 'String', 'phone'],
    ['email', 'String', 'email'], ['registration_no', 'String', 'registrationNo'],
    ['status!', 'String', 'status']], ''],
  ['DoctorSchedule', 'doctor_schedules', [
    ['staff_id!', 'UUID', 'staffId'], ['clinic_id!', 'UUID', 'clinicId'],
    ['day_of_week!', 'Integer', 'dayOfWeek'],
    ['start_time!', 'LocalTime', 'startTime'], ['end_time!', 'LocalTime', 'endTime'],
    ['slot_duration', 'Integer', 'slotDuration'], ['max_patients', 'Integer', 'maxPatients'],
    ['buffer_minutes', 'Integer', 'bufferMinutes'], ['enabled', 'Boolean', 'enabled']],
    'import java.time.LocalTime;'],
  ['ClinicScheduleConfig', 'clinic_schedule_config', [
    ['clinic_id!~', 'UUID', 'clinicId'],
    ['default_slot_duration', 'Integer', 'defaultSlotDuration'],
    ['max_patients_per_slot', 'Integer', 'maxPatientsPerSlot'],
    ['buffer_between_slots', 'Integer', 'bufferBetweenSlots']], ''],
  ['ClinicPatient', 'clinic_patients', [
    ['clinic_id!', 'UUID', 'clinicId'], ['user_id', 'UUID', 'userId'],
    ['first_name!', 'String', 'firstName'], ['last_name', 'String', 'lastName'],
    ['phone', 'String', 'phone'], ['email', 'String', 'email'],
    ['gender', 'String', 'gender'], ['blood_group', 'String', 'bloodGroup'],
    ['date_of_birth', 'LocalDate', 'dateOfBirth'],
    ['status!', 'String', 'status'], ['last_visit', 'LocalDate', 'lastVisit']],
    'import java.time.LocalDate;'],
  ['Appointment', 'appointments', [
    ['clinic_id!', 'UUID', 'clinicId'], ['patient_id!', 'UUID', 'patientId'],
    ['doctor_id!', 'UUID', 'doctorId'],
    ['appointment_date!', 'LocalDate', 'appointmentDate'],
    ['start_time!', 'LocalTime', 'startTime'], ['end_time', 'LocalTime', 'endTime'],
    ['type!', 'String', 'type'], ['status!', 'String', 'status'],
    ['notes', 'String', 'notes'], ['token_number', 'Integer', 'tokenNumber']],
    'import java.time.LocalDate;\nimport java.time.LocalTime;'],
  ['Encounter', 'encounters', [
    ['clinic_id!', 'UUID', 'clinicId'], ['appointment_id', 'UUID', 'appointmentId'],
    ['patient_id!', 'UUID', 'patientId'], ['doctor_id!', 'UUID', 'doctorId'],
    ['chief_complaint', 'String', 'chiefComplaint'], ['hpi', 'String', 'hpi'],
    ['examination', 'String', 'examination'], ['diagnosis', 'String', 'diagnosis'],
    ['icd10_code', 'String', 'icd10Code'], ['treatment_plan', 'String', 'treatmentPlan'],
    ['follow_up_date', 'LocalDate', 'followUpDate'], ['status!', 'String', 'status']],
    'import java.time.LocalDate;'],
  ['Prescription', 'prescriptions', [
    ['clinic_id!', 'UUID', 'clinicId'], ['encounter_id', 'UUID', 'encounterId'],
    ['patient_id!', 'UUID', 'patientId'], ['doctor_id!', 'UUID', 'doctorId'],
    ['diagnosis', 'String', 'diagnosis'], ['notes', 'String', 'notes'],
    ['status!', 'String', 'status']], ''],
  ['PrescriptionItem', 'prescription_items', [
    ['prescription_id!', 'UUID', 'prescriptionId'],
    ['medicine_name!', 'String', 'medicineName'], ['dosage', 'String', 'dosage'],
    ['frequency', 'String', 'frequency'], ['duration', 'String', 'duration'],
    ['instructions', 'String', 'instructions'], ['sort_order', 'Integer', 'sortOrder']], ''],
  ['Invoice', 'invoices', [
    ['clinic_id!', 'UUID', 'clinicId'], ['patient_id!', 'UUID', 'patientId'],
    ['encounter_id', 'UUID', 'encounterId'], ['invoice_number~', 'String', 'invoiceNumber'],
    ['subtotal', 'BigDecimal', 'subtotal'], ['tax_amount', 'BigDecimal', 'taxAmount'],
    ['discount', 'BigDecimal', 'discount'], ['total', 'BigDecimal', 'total'],
    ['status!', 'String', 'status'], ['payment_method', 'String', 'paymentMethod'],
    ['paid_at', 'LocalDateTime', 'paidAt']],
    'import java.math.BigDecimal;\nimport java.time.LocalDateTime;'],
  ['InvoiceItem', 'invoice_items', [
    ['invoice_id!', 'UUID', 'invoiceId'], ['description!', 'String', 'description'],
    ['quantity', 'Integer', 'quantity'], ['unit_price!', 'BigDecimal', 'unitPrice'],
    ['amount!', 'BigDecimal', 'amount'], ['sort_order', 'Integer', 'sortOrder']],
    'import java.math.BigDecimal;'],
  ['DataImportSession', 'data_import_sessions', [
    ['clinic_id!', 'UUID', 'clinicId'], ['import_type!', 'String', 'importType'],
    ['file_name', 'String', 'fileName'], ['total_records', 'Integer', 'totalRecords'],
    ['success_count', 'Integer', 'successCount'], ['fail_count', 'Integer', 'failCount'],
    ['status!', 'String', 'status'], ['error_log', 'String', 'errorLog']], ''],
  ['ClinicTemplate', 'clinic_templates', [
    ['clinic_id!', 'UUID', 'clinicId'], ['template_type!', 'String', 'templateType'],
    ['config_json', 'String', 'configJson'], ['file_path', 'String', 'filePath']], ''],
  ['ClinicBillingConfig', 'clinic_billing_config', [
    ['clinic_id!~', 'UUID', 'clinicId'],
    ['consultation_fee', 'BigDecimal', 'consultationFee'],
    ['follow_up_fee', 'BigDecimal', 'followUpFee'],
    ['tax_enabled', 'Boolean', 'taxEnabled'], ['tax_rate', 'BigDecimal', 'taxRate'],
    ['invoice_prefix', 'String', 'invoicePrefix'], ['payment_modes', 'String', 'paymentModes']],
    'import java.math.BigDecimal;'],
  ['ClinicCustomField', 'clinic_custom_fields', [
    ['clinic_id!', 'UUID', 'clinicId'], ['section!', 'String', 'section'],
    ['field_key!', 'String', 'fieldKey'], ['label!', 'String', 'label'],
    ['field_type!', 'String', 'fieldType'], ['required', 'Boolean', 'required'],
    ['sort_order', 'Integer', 'sortOrder']], ''],
  ['DeviceReport', 'device_reports', [
    ['clinic_id!', 'UUID', 'clinicId'], ['patient_id', 'UUID', 'patientId'],
    ['doctor_id', 'UUID', 'doctorId'], ['device_name', 'String', 'deviceName'],
    ['report_type', 'String', 'reportType'], ['file_url', 'String', 'fileUrl'],
    ['findings', 'String', 'findings'], ['status!', 'String', 'status'],
    ['reported_at', 'LocalDateTime', 'reportedAt']],
    'import java.time.LocalDateTime;'],
  ['FamilyGroup', 'family_groups', [
    ['clinic_id!', 'UUID', 'clinicId'], ['name!', 'String', 'name'],
    ['primary_patient_id', 'UUID', 'primaryPatientId']], ''],
  ['FamilyMember', 'family_members', [
    ['family_group_id!', 'UUID', 'familyGroupId'],
    ['patient_id!', 'UUID', 'patientId'],
    ['relationship!', 'String', 'relationship']], ''],
  ['WhatsAppBotConfig', 'whatsapp_bot_config', [
    ['clinic_id!~', 'UUID', 'clinicId'], ['enabled', 'Boolean', 'enabled'],
    ['phone_number', 'String', 'phoneNumber'], ['api_key', 'String', 'apiKey'],
    ['welcome_message', 'String', 'welcomeMessage'], ['auto_reply', 'Boolean', 'autoReply']], ''],
  ['MarketingReview', 'marketing_reviews', [
    ['clinic_id!', 'UUID', 'clinicId'], ['patient_id', 'UUID', 'patientId'],
    ['patient_name', 'String', 'patientName'], ['rating', 'Integer', 'rating'],
    ['review_text', 'String', 'reviewText'], ['source', 'String', 'source'],
    ['status!', 'String', 'status']], ''],
];

console.log('=== ENTITIES ===');
for (const [name, table, fields, extra] of entities) {
  w(path.join(BE, 'model', `${name}.java`), genEntity(name, table, fields, extra));
}

// ============================
// REPOSITORIES
// ============================
const repos = {
  ClinicStaffRepository: ['ClinicStaff', `
    List<ClinicStaff> findByClinicId(UUID clinicId);
    List<ClinicStaff> findByClinicIdAndRole(UUID clinicId, String role);
    List<ClinicStaff> findByClinicIdAndStatus(UUID clinicId, String status);
    long countByClinicId(UUID clinicId);`],
  DoctorScheduleRepository: ['DoctorSchedule', `
    List<DoctorSchedule> findByStaffId(UUID staffId);
    List<DoctorSchedule> findByClinicId(UUID clinicId);
    List<DoctorSchedule> findByStaffIdAndDayOfWeek(UUID staffId, int dayOfWeek);`],
  ClinicScheduleConfigRepository: ['ClinicScheduleConfig', `
    Optional<ClinicScheduleConfig> findByClinicId(UUID clinicId);`],
  ClinicPatientRepository: ['ClinicPatient', `
    Page<ClinicPatient> findByClinicId(UUID clinicId, Pageable pageable);
    long countByClinicId(UUID clinicId);
    List<ClinicPatient> findByClinicIdAndStatus(UUID clinicId, String status);`],
  AppointmentRepository: ['Appointment', `
    Page<Appointment> findByClinicId(UUID clinicId, Pageable pageable);
    List<Appointment> findByClinicIdAndDoctorId(UUID clinicId, UUID doctorId);
    List<Appointment> findByClinicIdAndPatientId(UUID clinicId, UUID patientId);
    List<Appointment> findByClinicIdAndAppointmentDate(UUID clinicId, java.time.LocalDate date);
    List<Appointment> findByClinicIdAndStatus(UUID clinicId, String status);
    long countByClinicId(UUID clinicId);
    long countByClinicIdAndStatus(UUID clinicId, String status);
    long countByClinicIdAndAppointmentDate(UUID clinicId, java.time.LocalDate date);`],
  EncounterRepository: ['Encounter', `
    Page<Encounter> findByClinicId(UUID clinicId, Pageable pageable);
    Optional<Encounter> findByAppointmentId(UUID appointmentId);
    Page<Encounter> findByDoctorId(UUID doctorId, Pageable pageable);`],
  PrescriptionRepository: ['Prescription', `
    Page<Prescription> findByClinicId(UUID clinicId, Pageable pageable);
    List<Prescription> findByEncounterId(UUID encounterId);
    Page<Prescription> findByPatientId(UUID patientId, Pageable pageable);
    Page<Prescription> findByDoctorId(UUID doctorId, Pageable pageable);`],
  PrescriptionItemRepository: ['PrescriptionItem', `
    List<PrescriptionItem> findByPrescriptionId(UUID prescriptionId);`],
  InvoiceRepository: ['Invoice', `
    Page<Invoice> findByClinicId(UUID clinicId, Pageable pageable);
    List<Invoice> findByPatientId(UUID patientId);
    long countByClinicId(UUID clinicId);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(i.total),0) FROM Invoice i WHERE i.clinicId = :clinicId AND i.status = :status")
    java.math.BigDecimal sumTotalByClinicIdAndStatus(@org.springframework.data.repository.query.Param("clinicId") UUID clinicId, @org.springframework.data.repository.query.Param("status") String status);`],
  InvoiceItemRepository: ['InvoiceItem', `
    List<InvoiceItem> findByInvoiceId(UUID invoiceId);`],
  DataImportSessionRepository: ['DataImportSession', `
    Page<DataImportSession> findByClinicId(UUID clinicId, Pageable pageable);`],
  ClinicTemplateRepository: ['ClinicTemplate', `
    List<ClinicTemplate> findByClinicId(UUID clinicId);
    Optional<ClinicTemplate> findByClinicIdAndTemplateType(UUID clinicId, String templateType);`],
  ClinicBillingConfigRepository: ['ClinicBillingConfig', `
    Optional<ClinicBillingConfig> findByClinicId(UUID clinicId);`],
  ClinicCustomFieldRepository: ['ClinicCustomField', `
    List<ClinicCustomField> findByClinicId(UUID clinicId);
    List<ClinicCustomField> findByClinicIdAndSection(UUID clinicId, String section);`],
  DeviceReportRepository: ['DeviceReport', `
    Page<DeviceReport> findByClinicId(UUID clinicId, Pageable pageable);
    Page<DeviceReport> findByDoctorId(UUID doctorId, Pageable pageable);
    List<DeviceReport> findByPatientId(UUID patientId);`],
  FamilyGroupRepository: ['FamilyGroup', `
    List<FamilyGroup> findByClinicId(UUID clinicId);
    List<FamilyGroup> findByPrimaryPatientId(UUID primaryPatientId);`],
  FamilyMemberRepository: ['FamilyMember', `
    List<FamilyMember> findByFamilyGroupId(UUID familyGroupId);
    List<FamilyMember> findByPatientId(UUID patientId);`],
  WhatsAppBotConfigRepository: ['WhatsAppBotConfig', `
    Optional<WhatsAppBotConfig> findByClinicId(UUID clinicId);`],
  MarketingReviewRepository: ['MarketingReview', `
    Page<MarketingReview> findByClinicId(UUID clinicId, Pageable pageable);
    List<MarketingReview> findByClinicIdAndStatus(UUID clinicId, String status);`],
};

console.log('\n=== REPOSITORIES ===');
for (const [rname, [ename, methods]] of Object.entries(repos)) {
  w(path.join(BE, 'repository', `${rname}.java`), `package com.taevas.clinic.repository;

import com.taevas.clinic.model.${ename};
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ${rname} extends JpaRepository<${ename}, UUID>, JpaSpecificationExecutor<${ename}> {
${methods}
}
`);
}

console.log(`\nEntities: ${entities.length}, Repos: ${Object.keys(repos).length}`);
