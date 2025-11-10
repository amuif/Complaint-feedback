import {
  ApiResponse,
  ComplaintData,
  Department,
  Director,
  Employee,
  Feedback,
  Rating,
  Sector,
  Subcities,
  TrackingResponse,
  voiceComplaintData,
} from '@/types/types';

export async function handleDataResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  return json.data as T;
}
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://196.189.94.178:4000/api';
  }

  // Sector Leaders
  async getSectorLeaders(): Promise<Sector[]> {
    const response = await fetch(`${this.baseUrl}/sectors`);
    return handleDataResponse<Sector[]>(response);
  }
  async getSectorsBySubcity(id: string): Promise<Sector> {
    try {
      const response = await fetch(`${this.baseUrl}/subcities/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch sectors for subcity ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching sectors for subcity ${id}:`, error);
      throw error;
    }
  }

  // Directors
  async getDirectorsBySectorLeader(sectorLeaderId: string): Promise<Director[]> {
    const response = await fetch(`${this.baseUrl}/sectors/${sectorLeaderId}/divisions`);
    return handleDataResponse<Director[]>(response);
  }
  async getSubcityDirectors(sectorLeaderId: string): Promise<Director[]> {
    const response = await fetch(`${this.baseUrl}/subcities/${sectorLeaderId.trim()}/directors`);
    return await response.json();
  }
  // Team Leaders
  async getTeamLeadersByDirector(directorId: string): Promise<Department[]> {
    const response = await fetch(`${this.baseUrl}/divisions/${directorId}/departments`);
    return handleDataResponse<Department[]>(response);
  }
  async getTeamLeaderSubcityByDirector(
    directorId: string,
    subcityId?: string
  ): Promise<Department[]> {
    const response = await fetch(`${this.baseUrl}/subcities/${subcityId}/division/${directorId}`);
    return await response.json();
  }

  // Employees
  async getEmployeesByTeamLeader(teamLeaderId: string): Promise<Employee[]> {
    console.log('team', teamLeaderId);
    const response = await fetch(`${this.baseUrl}/departments/${teamLeaderId}/teams`);
    return handleDataResponse<Employee[]>(response);
  }
  // Employee by subcity
  async getEmployeesBySubcity(subcityId: string): Promise<Employee[]> {
    const response = await fetch(`${this.baseUrl}/subcities/${subcityId}/employees`);
    return await response.json();
  }

  // Subcities
  async getSubcities(): Promise<Subcities[]> {
    try {
      const response = await fetch(`${this.baseUrl}/subcities`);
      return await response.json();
    } catch (error) {
      console.log('error at fetching subcities', error);
      return [];
    }
  }

  // Submit Complaint
  async submitComplaint(formData: FormData): Promise<ApiResponse<{ tracking_code: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/complaints/submit`, {
        method: 'POST',

        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }
  async submitVoiceComplaint(
    complaintData: voiceComplaintData
  ): Promise<ApiResponse<{ tracking_code: string }>> {
    try {
      const form = new FormData();

      console.log('complaint', complaintData);
      form.append('complainant_name', complaintData.complaint_name || '');
      form.append('phone_number', complaintData.phone_number);
      form.append('subcity_id', complaintData.subcity_id || '');
      form.append('woreda', complaintData.woreda || '');
      form.append('office', complaintData.office || '');
      form.append('complaint_source', complaintData.complaint_source || '');
      form.append('complaint_description', complaintData.complaint_description || '');
      form.append('desired_action', complaintData.desired_action || '');
      form.append('complaint_date', complaintData.complaint_date || '');
      form.append('sector_id', String(complaintData.sector_id || ''));
      form.append('employee_id', String(complaintData.employee_id || ''));
      form.append('division_id', String(complaintData.division_id || ''));
      form.append('department_id', String(complaintData.department_id || ''));
      // form.append('team_id', String(complaintData.team_id || ''));

      if (complaintData.attachment) {
        form.append('attachment', complaintData.attachment);
      }
      if (complaintData.voice_file_path && typeof complaintData.voice_file_path === 'string') {
        console.log('Fetching blob URL:', complaintData.voice_file_path);
        if (!complaintData.voice_file_path.startsWith('blob:')) {
          throw new Error("Invalid blob URL: must start with 'blob:'");
        }

        const response = await fetch(complaintData.voice_file_path);
        if (!response.ok) {
          console.error('Fetch response:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
          });
          throw new Error(`Failed to fetch blob URL: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        console.log('Fetch response content-type:', contentType);
        const validMimeTypes = [
          'audio/webm',
          'audio/webm;codecs=opus',
          'audio/ogg',
          'audio/ogg;codecs=opus',
          'audio/mpeg',
          'audio/mp4',
        ];
        if (!contentType || !validMimeTypes.includes(contentType)) {
          console.error('Invalid content-type:', contentType);
          throw new Error(`Invalid audio file: received ${contentType || 'unknown'}`);
        }

        const audioBlob = await response.blob();
        console.log('Fetched blob:', {
          type: audioBlob.type,
          size: audioBlob.size,
        });

        if (audioBlob.size === 0) {
          throw new Error('Fetched audio blob is empty');
        }

        const file = new File([audioBlob], 'voice_recording.webm', {
          type: audioBlob.type || 'audio/webm',
        });
        console.log('File created:', {
          name: file.name,
          type: file.type,
          size: file.size,
        });
        form.append('voice_file', file);
      } else {
        throw new Error('Valid voice file path is required');
      }

      for (const [key, value] of form.entries()) {
        console.log(`FormData ${key}: ${value}`);
      }

      const apiResponse = await fetch(`${this.baseUrl}/complaints/submit-voice`, {
        method: 'POST',
        body: form,
      });

      const data = await apiResponse.json();
      if (!apiResponse.ok) {
        throw new Error(data.message || `API error: ${apiResponse.statusText}`);
      }
      return data;
    } catch (error) {
      console.error('Error in submitVoiceComplaint:', error);
      return this.handleError(error);
    }
  }
  async trackComplaint(trackingInput: string): Promise<ApiResponse<ComplaintData[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/complaints/track/${trackingInput}`);
      return await response.json();
    } catch (error) {
      console.error('error at getting status', error);
      return this.handleError(error);
    }
  }
  async trackFeedback(trackingInput: string): Promise<ApiResponse<TrackingResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/feedback/status/${trackingInput}`);
      return await response.json();
    } catch (error) {
      console.error('error at getting status', error);
      return this.handleError(error);
    }
  }
  async submitFeedback(feedbackData: Feedback) {
    try {
      const response = await fetch(`${this.baseUrl}/feedback/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error at submitting rating', error);
      return this.handleError(error);
    }
  }

  async submitRating(ratingData: Rating) {
    console.log(ratingData);
    try {
      const response = await fetch(`${this.baseUrl}/ratings/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error at submitting rating', error);
      return this.handleError(error);
    }
  }
  private handleError(error: unknown): ApiResponse<any> {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
}

export default new ApiClient();
