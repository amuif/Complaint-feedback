import { StepId } from 'framer-motion';

export interface SectorLeader {
  id: string;
  name_en: string;
  name_am: string;
  name_om: string;
  appointed_person_en: string;
  appointed_person_am: string;
  appointed_person_af: string;
  office_number: string;
  profile_picture: string;
  created_at: string;
}
export interface Sector {
  id: string;
  name_am: string;
  name_af: string;
  name_en: string;
  appointed_person_en: string;
  appointed_person_am: string;
  appointed_person_af: string;
  office_number: string;
  profile_picture: string;
  created_at: string;
}
export interface Division {
  id: string;
  name_am: string;
  name_af: string;
  name_en: string;
  appointed_person_en: string;
  appointed_person_am: string;
  appointed_person_af: string;
  office_number: string;
  profile_picture: string;
  sector_id: string;
  created_at: string;
  updated_at: string;
}
export interface Department {
  id: string;
  name: string;
  code: string;
  contact_email: string;
  contact_phone: string;
  name_af: string;
  name_en: string;
  name_am: string;
  appointed_person_en: string;
  appointed_person_am: string;
  appointed_person_af: string;
  office_number: string;
  profile_picture: string;

  description_af: string;
  description_am: string;
  description_en: string;
  is_active: boolean;
  head_name: string;
  sector_id: string;
  division_id: string;
  created_at: string;
  updated_at: string;
}
export interface Team {
  id: string;
  name_am: string;
  name_af: string;
  name_en: string;
  appointed_person_en: string;
  appointed_person_am: string;
  appointed_person_af: string;
  office_number: string;
  profile_picture: string;
  created_at: string;
}
export interface Director {
  id: string;
  name_am: string;
  name_af: string;
  name_en: string;
  appointed_person_en: string;
  appointed_person_am: string;
  appointed_person_af: string;
  office_number: string;
  profile_picture: string;
  created_at: string;
}

export interface Employee {
  id: number;
  employee_id: string;

  first_name_en: string;
  first_name_am: string;
  first_name_af: string;

  middle_name_en: string;
  middle_name_am: string;
  middle_name_af: string;

  last_name_en: string;
  last_name_am: string;
  last_name_af: string;

  office_id: number | null;
  office_number: string | null;
  floor_number: number | null;

  position_en: string;
  position_am: string;
  position_af: string;

  sector_id: number | null;
  division_id: number | null;
  team_id: number | null;
  department_id: number | null;

  department: Department;
  sector: Sector;
  team: Department;
  division?: Division;
  section: string;
  city: string | null;
  subcity: Subcities;
  works_in_head_office: boolean;

  email: string | null;
  phone: string | null;
  profile_picture: File | null;

  bio_en: string | null;
  bio_am: string | null;
  bio_af: string | null;

  specializations: string | null;
  years_of_service: number;

  education_level: string | null;
  is_active: boolean;

  hire_date: string | null; // ISO date string (e.g., "2025-08-07")

  created_at: string; // ISO timestamp string
  updated_at: string; // ISO timestamp string
}
export type EmployeeFiltersTypes = {
  city?: string;
  subcity?: string;
  department?: string;
};

export interface ComplaintData {
  id?: number;

  complaint_name?: string | null;
  phone_number: string;
  email?: string | null;

  title_en?: string | null;
  title_am?: string | null;
  title_af?: string | null;

  description_en?: string | null;
  description_am?: string | null;
  description_af?: string | null;
  complaint_description?: string | null;

  desired_action?: string | null;

  response?: string | null;

  department_id?: string | null;
  department?: Department;
  division_id?: string | null;
  division?: Division;
  sector_id?: string | null;
  sector?: Sector;
  employee_id?: string | null;
  employee?: Employee;
  team_id?: string | null;
  team?: Team;
  office_id?: number | null;
  // office:
  responded_by?: number | null;

  complaint_source: string;
  service_type?: string | null;
  subcity_id: string;
  woreda?: string | null;

  complaint_type?:
    | 'service_quality'
    | 'staff_behavior'
    | 'facility_issue'
    | 'process_delay'
    | 'other';

  voice_note?: string | null;

  status?: 'submitted' | 'under review' | 'investigating' | 'resolved' | 'closed';
  priority?: 'low' | 'normal' | 'high' | 'urgent';

  assigned_admin?: number | null;
  admin_notes?: string | null;
  resolution_summary?: string | null;
  citizen_satisfaction_rating?: number | null;

  follow_up_required?: boolean;
  follow_up_date?: string | null;

  attachment?: File | null;
  resolved_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface voiceComplaintData {
  complaint_name?: string;
  subcity_id: string;
  woreda?: string;
  office?: string;
  complaint_description?: string;
  sector_id?: string;
  division_id?: string;
  team_id?: string;
  employee_id?: string;
  desired_action?: string;
  complaint_date?: string;
  phone_number: string;
  department_id?: string;
  voice_file_path: string | Blob | null;
  complaint_source: string;
  attachment?: File | null;
}

export interface EmployeeApiResponse<T> {
  success: boolean;
  department: any;
  data?: T;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface TrackingResponse {
  id: string;
  status: string;
  tracking_code: string;
  created_at: string;
  updated_at: string;
}
export type Person = {
  id: number | string;
  leaderId?: number | string;
  memberIds?: number[];
  name: string;
  name_am: string;
  name_om: string;
  position?: string;
  position_am?: string;
  position_om?: string;
  officeNumber?: string;
  image: string;
};

export interface Expertise {
  id: number | string;
  name: string;
  name_am: string;
  name_om: string;
  position: string;
  position_am: string;
  position_om?: string;
  department: string | null;
  department_am: string | null;

  department_om: string | null;
  officeNumber: string;
  image: string;
  leaderId: number;
  memberIds?: number[];
}

export interface TeamLeader {
  id: string;
  name_am: string;
  name_af: string;
  name_en: string;
  appointed_person_en: string;
  appointed_person_am: string;
  appointed_person_af: string;
  office_number: string;
  profile_picture: string;
  created_at: string;
}
export interface Feedback {
  full_name: string;
  phone_number: string;
  feedback_type: 'complaint' | 'suggestion' | 'compliment';
  feedback_text: string;
}
export interface Rating {
  sector_leader_id: number;
  director_id: number | undefined;
  employee_id: number | undefined;
  expert_id: number | undefined;
  overall_rating: number | undefined;
  courtesy: number | undefined;
  punctuality: number | undefined;
  knowledge: number | undefined;
  comments: string | undefined;
}
export interface Subcities {
  id: string;
  name_am: string;
  name_af: string;
  name_en: string;
  appointed_person_en: string;
  appointed_person_am: string;
  appointed_person_af: string;
  created_at: string;
}
