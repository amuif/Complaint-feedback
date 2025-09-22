'use client';

import type React from 'react';

import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'am' | 'af';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  en: {
    help: 'help',
    'site.title': 'Citizen Charter Portal',
    'site.subtitle': 'Addis Ababa Traffic Management Authority',
    home: 'Home',
    services: 'Services',
    employees: 'Employees',
    complaints: 'Complaints',
    'complaints.title': 'Complaints & Feedback',
    'complaints.form.attachment': 'Complaint form',
    'complaints.form.chooseFile': 'Choose file',
    'complaints.form.attachmentDescription': 'Attacment description',
    'submit.voice.complaint': 'Submit Voice Complaint',
    'submit.text.complaint': 'Submit Text Complaint',
    'track.complaint': 'Track Complaint',
    'complaints.onlyTitle': 'Submit Your Complaint',
    'complaints.subtitle':
      'Submit your complaints or track existing ones using your tracking code or phone number',
    'complaints.track.description':
      'Enter your tracking code or phone number to check the status of your complaint',
    ratings: 'Ratings',
    about: 'About',
    contact: 'Contact',
    'hero.title': 'Welcome to the Citizen Charter Portal',
    'hero.subtitle': 'Your voice matters in improving our services',
    'hero.cta': 'Submit Feedback',
    'services.title': 'Our Services',
    'services.subtitle': 'Explore the services provided by the Traffic Management Authority',
    'feedback.title': 'Customer Feedback',
    'feedback.subtitle': 'Share your experience with us',
    'feedback.cta': 'Submit Feedback',
    'feedback.form.title': 'Feedback Form',
    'feedback.form.name': 'Full Name',
    'feedback.form.email': 'Email Address',
    'feedback.form.phone': 'Phone Number',
    'feedback.form.type': 'Feedback Type',
    'feedback.form.type.complaint': 'Complaint',
    'feedback.form.type.suggestion': 'Suggestion',
    'feedback.form.type.compliment': 'Compliment',
    'feedback.form.service': 'Service Type',
    'feedback.form.message': 'Your Message',
    'feedback.form.submit': 'Submit Feedback',
    'feedback.form.success': 'Thank you for your feedback!',
    'feedback.form.error': 'Something went wrong. Please try again.',
    'feedback.voice.title': 'Voice Feedback',
    'feedback.voice.start': 'Start Recording',
    'feedback.voice.stop': 'Stop Recording',
    'feedback.voice.play': 'Play Recording',
    'feedback.voice.pause': 'Pause Recording',
    'feedback.voice.transcription': 'Voice Transcription',
    'about.title': 'About the Citizen Charter',
    'about.content':
      'The Citizen Charter is a document that outlines the services provided by the Addis Ababa Traffic Management Authority, the standards of these services, and the rights and responsibilities of citizens.',
    'footer.rights': 'All rights reserved',
    'footer.address': 'Addis Ababa, Ethiopia',
    'footer.mission.title': 'Our Mission',
    'footer.mission.content':
      'To efficiently manage traffic and transportation systems in Addis Ababa, ensuring safety, accessibility, and sustainable mobility for all citizens.',
    'footer.vision.title': 'Our Vision',
    'footer.vision.content':
      "To create a world-class traffic management system that supports Addis Ababa's development as a modern, efficient, and livable city.",
    //  compaints section en
    'complaints.submit.title': 'Submit a Complaint',
    'complaints.submit.description':
      'Please provide details about your complaint. We will process it and provide you with a tracking code',
    'complaints.track.title': 'Track Your Complaint',
    'complaints.track.description1':
      'Enter your tracking code to check the status of your complaint',
    'complaints.track.input': 'Enter your code here',
    'complaints.track.submit': 'Submit',
    'complaints.form.selectSectorLeader': 'Sector Leader',
    'complaints.form.sectorLeader': 'Sector Leader',

    'complaints.form.service': 'Service Type',
    'complaints.form.phone': 'Phone Number',
    'complaints.form.details': 'Complaint Details',
    'complaints.form.tracking': 'Tracking Code',
    'complaints.form.submit': 'Submit Complaint',
    'complaints.form.track': 'Track Complaint',
    'complaints.form.office': 'Office',
    'complaints.form.selectOffice': 'Select Office',
    'complaints.form.employee': 'Employee',
    'complaints.form.sector': 'Sector',
    'complaints.form.selectSector': 'Select Sector',
    'complaints.form.selectSectorLeaderLoading': 'Sector Leader Loading...',
    'complaints.form.director': 'Directors',
    'complaints.form.DirectorLoading': 'Director Loading...',
    'complaints.form.selectDirector': 'Select Director',
    'complaints.form.selectDirectorfirst': 'Select Director First',
    'complaints.form.selectsectorleaderfirst': 'Select Sector Leader First',
    'complaints.form.selectTeamleaderfirst': 'Select Team Leader First',
    'complaints.form.TeamLeaderLoading': 'Team Leader Loading...',
    'complaints.form.teamLeader': 'Team Leader',
    'complaints.form.selectTeamLeader': 'Team Leader',
    'complaints.form.ExpertiseLoading': 'Expertise Loading...',
    'complaints.form.expertise': 'Expertise',
    'complaints.form.selectExpertise': 'Expertise',
    'select.form.subcity': 'Select Sub-City',
    'select.form.subcityLoading': 'Sub-City Loading...',
    'complaints.form.woreda': 'Woreda *',
    'complaints.form.explanation': 'Desired Resolution (What action should be taken?)',
    'complaints.form.Briefexplanation': 'Briefly Explain what resolution or action you expect',
    'complaints.form.selectDepartment': 'Select Department',
    'complaints.form.team': 'Team',
    'complaints.form.selectTeam': 'Select Team',
    'complaints.form.division': 'Division',
    'complaints.form.selectDivision': 'Select Division',
    'complaints.form.selectEmployee': 'Employee',

    //rating
    'ratings.form.sectorLeader_en': 'Sector Leader',
    'ratings.form.selectSectorLeader_en': 'Select Sector Leader',
    'ratings.form.director_en': 'Director',
    'ratings.form.selectSectorLeaderFirst_en': 'Select Sector Leader First',
    'ratings.form.teamLeader_en': 'Team Leader',
    'ratings.form.selectDirectorFirst_en': 'Select Director First',
    'ratings.form.expert_en': 'Expertise',
    'ratings.form.selectTeamLeaderFirst_en': 'Select Team Leader',
    'ratings.form.sectorLeader': 'Sector Leader',
    'ratings.form.selectSectorLeader': 'Select Sector Leader',
    'ratings.form.director': 'Director',
    'ratings.form.selectDirector': 'Select Director',
    'ratings.form.selectSectorLeaderFirst': 'Select Sector Leader first',
    'ratings.form.teamLeader': 'Team Leader',
    'ratings.form.selectTeamLeader': 'Select Team Leader',
    'ratings.form.expertise': 'Expertise',
    'ratings.title_en': 'Rate Our Services',
    'ratings.form.expert': 'Select Expertise',
    'ratings.subtitle_en': 'Help us improve by sharing your experience with our services',
    'ratings.form.title_en': 'Service Rating',
    'ratings.form.description_en':
      'Please rate your experience with our services and provide feedback',
    'ratings.form.service_en': 'Service Type',
    'ratings.form.overall_en': 'Overall Rating',
    'ratings.form.courtesy_en': 'Courtesy',
    'ratings.form.punctuality_en': 'Punctuality',
    'ratings.form.knowledge_en': 'Knowledge',
    'ratings.form.comments_en': 'Additional Comments',
    'ratings.form.selectDirector_en': 'Select Director',
    'ratings.form.selectTeamLeader_en': 'Select Team Leader',
    'ratings.form.selectExpert_en': 'Select Expert',
    'ratings.form.submit_en': 'Submit Rating',
    'ratings.form.submitting_en': 'Submitting Rating',
    'ratings.form.success_en': 'Successfully Submitted Rating',

    'ratings.title_am': 'አገልግሎቶቻችንን ደምሩ',
    'ratings.subtitle_am': 'እባክዎን በአገልግሎታችን ላይ ያሉትን ተሞክሮ በመካፈል እንዲበልጥ እንረዳን',
    'ratings.form.title_am': 'የአገልግሎት ግምገማ',
    'ratings.form.description_am': 'እባክዎን አገልግሎታችን በምን ያህል ተሞክረዋል እና አስተያየትዎን ያቅርቡ',
    'ratings.form.service_am': 'የአገልግሎት አይነት',
    'ratings.form.overall_am': 'አጠቃላይ ግምገማ',
    'ratings.form.courtesy_am': 'ተገቢ አካልነት',
    'ratings.form.punctuality_am': 'በተገቢው ወቅት',
    'ratings.form.knowledge_am': 'እውቀት',
    'ratings.form.comments_am': 'ተጨማሪ አስተያየቶች',
    'ratings.form.submit_am': 'ግምገማውን ያቅርቡ',
    'ratings.form.department_am': 'የመድረክ ክፍል',
    'ratings.form.selectDept_am': 'ክፍል ይምረጡ',
    'ratings.form.employee_am': 'ሰራተኛ',
    'ratings.form.selectEmp_am': 'ሰራተኛን ይምረጡ',
    'ratings.form.selectDeptFirst_am': 'አስቀድሞ ክፍልን ይምረጡ',
    'ratings.form.showAmhKbd_am': 'የአማርኛ ፊደል ቁልፍ አሳይ',
    'ratings.form.hideAmhKbd_am': 'የአማርኛ ፊደል ቁልፍ ደብቅ',
    'ratings.form.shareExp_am': 'ልምድዎን እዚህ ያካፍሉ',
    'ratings.form.sectorLeader_am': 'የዘርፍ አመራር ',
    'ratings.form.selectSectorLeader_am': 'የዘርፍ አመራር ይምረጡ ',
    'ratings.form.selectSectorLeaderFirst_am': 'የዘርፍ አመራር ይምረጡ ',
    'ratings.form.director_am': 'ዳይሬክተር',
    'ratings.form.teamLeader_am': 'ቡድን መሪ',
    'ratings.form.selectDirectorFirst_am': 'የዘርፍ አመራር ይምረጡ',
    'ratings.form.expert_am': 'ባለሞያ',
    'ratings.form.selectTeamLeaderFirst_am': 'የቡድን መሪ ይምረጡ',
    'ratings.form.selectDirector_am': 'ዳይሬክተር ይምረጡ',
    'ratings.form.selectTeamLeader_am': 'የቡድን መሪ ይምረጡ',
    'ratings.form.selectExpert_am': 'ባለሞያ',
    'ratings.form.submitting_am': 'ግምገማውን ያስገቡ',
    'ratings.form.success_am': 'ግምገማውን ስላስገቡ እናመሰግናለን!',

    'ratings.title_om': 'Tajaajiloota keenya Madaali',
    'ratings.subtitle_om':
      'Tajaajila keenya ilaalchisee muuxannoo kee nuuf qoodii fooyya’uuf nu gargaara',
    'ratings.form.title_om': 'Madaallii Tajaajilaa',
    'ratings.form.description_om':
      'Muuxannoo tajaajiloota keenya waliin qabdu madaalii fi yaada kee barreessi',
    'ratings.form.service_om': 'Gosa Tajaajilaa',
    'ratings.form.overall_om': 'Madaallii Waliigalaa',
    'ratings.form.courtesy_om': 'Kabajaa',
    'ratings.form.punctuality_om': 'Yeroo Sirrii',
    'ratings.form.knowledge_om': 'Beekumsa',
    'ratings.form.comments_om': 'Yaada Dabalataa',
    'ratings.form.submit_om': 'Madaallii Galchi',
    'ratings.form.department_om': 'Kutaa Tajaajilaa',
    'ratings.form.selectDept_om': 'Kutaa filadhu',
    'ratings.form.employee_om': 'Hojjetaa',
    'ratings.form.selectEmp_om': 'Hojjetaa filadhu',
    'ratings.form.selectDeptFirst_om': 'Dursee kutaa filadhu',
    'ratings.form.showAmhKbd_om': 'Fakkii qubee Afaan Amaaraa agarsiisi',
    'ratings.form.hideAmhKbd_om': 'Fakkii qubee Afaan Amaaraa dhoksi',
    'ratings.form.shareExp_om': 'Muuxannoo kee asitti qoodi',
    'ratings.form.department_en': 'Department',
    'ratings.form.selectDept_en': 'Select Department',
    'ratings.form.employee_en': 'Employee',
    'ratings.form.selectEmp_en': 'Select Employee',
    'ratings.form.selectDeptFirst_en': 'Please select a department first',
    'ratings.form.showAmhKbd_en': 'Show Amharic Keyboard',
    'ratings.form.hideAmhKbd_en': 'Hide Amharic Keyboard',
    'ratings.form.shareExp_en': 'Share your experience here',

    'feedback.types.complaint': 'Complaint',
    'feedback.types.suggestion': 'Suggestion',
    'feedback.types.compliment': 'Compliment',
    'feedback.form.showKeyboard': 'Show Amharic Keyboard',
    'feedback.form.hideKeyboard': 'Hide Amharic Keyboard',
    'feedback.form.enterAmharic': 'Enter Amharic Text',
    'feedback.form.enterEnglish': 'Enter English Text',
    'feedback.form.enterOromo': 'Enter Oromo Text',
    'feedback.form.voiceFeedback': 'Voice Feedback',
    'feedback.form.recordVoice': 'Record Voice Feedback',
    'feedback.form.playVoice': 'Play Voice Feedback',
    'feedback.form.stopVoice': 'Stop Voice Feedback',
    'feedback.form.voiceTranscription': 'Voice Transcription',
    'navigation.services': 'Our Services',
    'navigation.servicesDesc': 'Explore the services we provide',
    'navigation.employees': 'Our Team',
    'navigation.employeesDesc': 'Meet our staff and their contact information',
    'navigation.complaints': 'Submit Complaint',
    'navigation.complaintsDesc': 'File a complaint or track existing ones',
    'navigation.ratings': 'Rate Services',
    'navigation.ratingsDesc': 'Share your experience with our services',
    'navigation.back': 'Back',
    'employees.title': 'Our Team',
    'employees.searchPlaceholder': 'Search by name, position, or office...',
    'employees.office': 'Office',
    'employees.email': 'Email',
    'employees.phone': 'Phone',
    // services
    'services.document.title': 'Document Verification',
    'services.license.title': 'License Services',
    'services.vehicle.title': 'Vehicle Registration',
    'services.violation.title': 'Traffic Violation Appeals',
    'services.permit.title': 'Road Event Permits',
    'services.inquiry.title': 'General Inquiries',
    'services.cityFreightVehiclePermit.title': 'City Freight Vehicle Movement Permit',
    'services.cityFreightVehiclePermit.renewal': 'City Freight Vehicle Movement Permit Renewal',
    'services.cityFreightVehicleRenewal.title': 'Urban Freight Vehicle Movement Permit Renewal',
    'services.cityFreightVehicleRenewal.description':
      'Renewal of permits for freight vehicles operating within the city',
    'services.foreignAccidentClearance.title': 'Foreign Accident Clearance Certificate',
    'services.licensePointsCompensation.title':
      'Driver’s License Points Record & Compensation Service',
    'services.licensePointsCompensation.lostLicenseCard': 'Lost License Card Replacement',
    'services.licensePointsCompensation.trafficDataCorrection': 'Traffic Data Correction',
    'services.licensePointsCompensation.accidentDriverCompensation':
      'Accident Driver License Compensation',
    'services.licensePointsCompensation.sendRehabInstructors':
      'Dispatch Rehabilitation Instructors to Licensing Authority',
    'services.licensePointsCompensation.returnDriverQualification':
      'Restore Driver Qualification After Suspension',
    'services.transportManagement.title': 'Manage Dedicated Routes for Bulk Transport & Ambulance',
    'services.newMotorbikePermit.title': 'New Motorbike Movement Permit (E-Bike)',
    'services.communityInquiry.title': 'Community & Stakeholder Development Inquiries',
    'services.communityInquiry.signSignalInquiry': 'Handle Signaling Infrastructure Inquiry',
    'services.communityInquiry.colorSchemeInquiry': 'Handle Color Scheme Inquiry',
    'services.communityInquiry.speedBumpInspection': 'Handle Speed Bump Inspection Inquiry',
    'services.accidentClaim.title': 'Vehicle Accident Claim Preparation & Submission',
    'services.accidentClaim.documentAssembly': 'Assemble Documents for Accident Claimants',
    'services.accidentClaim.documentSubmission': 'Submit Accident Claim Documents for Compensation',
    'services.document.description': 'Verify traffic-related documents and certificates',
    'services.license.description': "Apply for or renew driver's licenses and permits",
    'services.vehicle.description': 'Register vehicles and obtain necessary permits',
    'services.violation.description': 'Appeal traffic violations and penalties',
    'services.permit.description': 'Apply for permits for road events and closures',
    'services.inquiry.description': 'Get information about traffic management services',
    'services.cityFreightVehiclePermit.description': 'Permit cargo trucks to move within the city',
    'services.cityFreightVehiclePermit.renewalDescription':
      'Renew city freight vehicle movement permit',
    'services.foreignAccidentClearance.description':
      'Issue accident clearance certificates for foreign embassies and insurers',
    'services.licensePointsCompensation.description':
      'View and compensate driver’s license points record',
    'services.licensePointsCompensation.lostLicenseCardDescription':
      "Replace a lost driver's license card",
    'services.licensePointsCompensation.trafficDataCorrectionDescription':
      'Correct errors in traffic data records',
    'services.licensePointsCompensation.accidentDriverCompensationDescription':
      'Compensate drivers after traffic accidents',
    'services.licensePointsCompensation.sendRehabInstructorsDescription':
      'Dispatch rehabilitation instructors to licensing authority',
    'services.licensePointsCompensation.returnDriverQualificationDescription':
      'Restore driver qualification after suspension',
    'services.transportManagement.description':
      'Manage dedicated routes for heavy transport vehicles and ambulances',
    'services.newMotorbikePermit.description':
      'Issue movement permits for electric and conventional motorcycles',
    'services.communityInquiry.description':
      'Handle community and stakeholder development inquiries',
    'services.communityInquiry.signSignalInquiryDescription':
      'Respond to inquiries about signaling infrastructure',
    'services.communityInquiry.colorSchemeInquiryDescription':
      'Address inquiries regarding road color schemes',
    'services.communityInquiry.speedBumpInspectionDescription':
      'Inspect and approve speed bump installations',
    'services.accidentClaim.description':
      'Assist with preparation and submission of vehicle accident claims',
    'services.accidentClaim.documentAssemblyDescription':
      'Assemble required documents for accident claimants',
    'services.accidentClaim.documentSubmissionDescription':
      'Submit accident claim documents for compensation',
    // home_search
    'homepage.search.label': 'Where do you want to go?',
    'homepage.search.placeholder': 'Type or select a destination...',
    // Help page translations
    'help.viewingServices.title': '1. Viewing Services Provided',
    'help.viewingServices.intro':
      'Explore the services offered by the institution, understand the criteria, and locate relevant officers.',
    'help.viewingServices.step1': "Navigate to the 'Services' section on the homepage.",
    'help.viewingServices.step2': "Select the service you're interested in.",
    'help.viewingServices.frontline': 'Frontline Services:',
    'help.services.investmentReception': 'Investment project reception',
    'help.services.investmentProjectsLicensing':
      'Investment Projects Licensing and Contract Management Services',
    'help.services.investmentPromotionLicensing': 'Investment Promotion Licensing Services',
    'help.services.procurementServices': 'Procurement Services, Financial and Property Management',
    'help.services.oneStopDesk': 'Investment One-Stop Service Desk Coordination Services',
    'help.services.manufacturingSupport':
      'Manufacturing Industry Support and Control Monitoring Services',
    'help.services.investmentPromotion': 'Investment Promotion Services',
    'help.services.supportPackage': 'Support package services and Market Connections',
    'help.services.agriculturalSupport':
      'Support Services Monitoring and Control of Agricultural Sector projects and services/ Termination of Contract and Support projects',
    'help.services.legalComplaints':
      'Services provided by the directorate of legal complaints and customer appeals',
    'help.services.hrManagement':
      'Human Resource Management Services (Employee Control and Registration)',
    'help.services.evidenceManagement':
      'Organizational Evidence and Management Analysis / Investment Statistics Services',
    'help.viewingServices.offline': 'Offline Services:',
    'help.services.ethicsMonitoring': 'Ethical and Anti-Corruption Promotion Monitoring Services',
    'help.services.communication': 'Communication services',
    'help.services.audit': 'Audit services',
    'help.services.researchPolicy':
      'Services provided by the Directorate of Potential Research and Policy',
    'help.services.ict': 'ICT services',
    'help.services.planningBudgeting': 'Planning, Budgeting, Monitoring and Evaluation Services',
    'help.services.genderYouthHIV': 'Gender, Children, Youth and HIV AIDS Services',
    'help.viewingServices.step3': 'Review the details provided, including:',
    'help.viewingServices.criteria':
      'Service Criteria: Requirements or qualifications needed to access the service.',
    'help.viewingServices.standards':
      'Services Give Or Standards: Detail expression of Standards and Services given by each directorates',
    'help.complaints.title': '2. Submitting Complaints',
    'help.complaints.step1': "Go to the 'Complain' section on the homepage.",
    'help.complaints.step2': 'Fill out the complaint form with the necessary details.',
    'help.complaints.step3':
      'Submit the complaint and track its status using your reference number.',
    'help.feedback.title': '3. Feedback Form',
    'help.feedback.step1':
      "Click on 'Express your satisfaction with our service' from the homepage.",
    'help.feedback.step2': 'Select the employee or service you wish to rate.',
    'help.feedback.step3': 'Provide your feedback using the rating system.',
    'help.feedback.step4': 'Submit the rating for record.',
    'help.rating.title': '4. Rating an Employee',
    'help.rating.step1': "Click on 'Express your satisfaction with our service' from the homepage.",
    'help.rating.step2': 'Select the employee or service you wish to rate.',
    'help.rating.step3': 'Provide your feedback using the rating system.',
    'help.rating.step4': 'Submit the rating for record.',
    'help.whereToGo.title': '5. Where Do You Want to Go?',
    'help.whereToGo.step1': "Navigate to the 'Where do you want to go?' section on the homepage.",
    'help.whereToGo.step2': 'Select the service category or department.',
    'help.whereToGo.step3': 'View the list of officers assigned to the service, including:',
    'help.whereToGo.officerName': 'Officer Name: Full name of the officer or staff member.',
    'help.whereToGo.position': 'Position: Their role within the organization.',
    'help.whereToGo.officeNumber': 'Office Number: The location or contact point for the service.',
    'help.importantNotes.title': 'Important Notes',
    'help.importantNotes.body': 'Ensure you provide accurate information for a seamless process.',
    'help.button': 'Help',
    // Complaint form new translations
    'complaints.form.complainantName': "Complainant's full name",
    'complaints.form.subcity': 'Sub-city',
    'complaints.form.kebele': 'Kebele',
    'complaints.form.characters.used': 'characters used',
    'complaints.form.issueDescription': 'Briefly describe the main issue of the complaint',
    'complaints.form.date': 'Date',
    'complaints.form.department': 'Department',

    'complaints.form.selectOfficeServed': 'Select the office where you served',
    'complaints.form.actionRequired':
      'What the person in question wants to be done or to be done (briefly explain)',
    'complaints.form.agreement': 'I agree that I have completed this form.',
    'complaints.form.voice.description':
      'Record your complaint directly using your voice. This is the fastest way to submit your feedback. Please ensure you grant microphone permissions when prompted by your browser.',
    // Department names
    'department.license': 'License Department',
    'department.registration': 'Registration Department',
    'department.traffic': 'Traffic Control Department',
    'department.customer': 'Customer Service Department',
    // Office names
    'office.director': "Director General's Office",
    'office.deputy': "Deputy Director's Office",
    'office.operations': 'Operations Office',
    'office.customer': 'Customer Service Office',
    // Feedback_translations
    'feedback.description': 'Share your experience with our services to help us improve.',
    'feedback.status.title': 'Check Feedback Status',
    'feedback.status.description':
      'Enter your feedback reference number to check the status of your submission.',
    'feedback.reference': 'Reference Number',
    'feedback.trackingCode': 'Feedback Tracking Code',
    'feedback.trackingCode.placeholder': 'Insert Your Feedback Tracking Code',
    'feedback.reference.placeholder': 'e.g., FB-2023-12345',
    'feedback.check': 'Check Status',
    'feedback.submitted.title': 'Feedback Submitted',
    'feedback.submitted.description': 'Thank you for your feedback. We will review it shortly.',
  },
  am: {
    help: 'መርዳት',
    'site.title': 'የዜጎች ስምምነት ሰነድ',
    'site.subtitle': 'የአዲስአበባ አስተዳደር ትራፊክ ባለስልጣን',
    home: 'መነሻ',
    services: 'አገልግሎቶች',
    employees: 'ሰራተኞች',
    complaints: 'ቅሬታዎች',
    'complaints.title': 'ቅሬታዎች እና አስተያየቶች',
    'complaints.onlyTitle': 'ቅሬታዎን ያስገቡ',
    'complaints.form.chooseFile': 'ፋይል ይምረጡ',
    'complaints.form.attachmentDescription': 'አባሪ መግለጫ',
    'complaints.subtitle': 'ቅሬታዎችዎን ያስገቡ ወይም የሚከተሉትን ቅሬታዎች በሚከተል ኮድ ወይም ስልክ ቁጥር ያስተካክሉ',
    'complaints.track.description': 'የቅሬታዎን ሁኔታ ለመፈተሽ የሚከተል ኮድዎን ወይም ስልክ ቁጥርዎን ያስገቡ',
    ratings: 'ደረጃዎች',
    about: 'ስለ እኛ',
    contact: 'ያግኙን',
    'hero.title': 'እንኳን ወደ የዜጎች ስምምነት ሰነድ በደህና መጡ',
    'hero.subtitle': 'የእርስዎ ድምጽ አገልግሎታችንን ለማሻሻል ጠቃሚ ነው',
    'hero.cta': 'አስተያየት ያስገቡ',
    'services.title': 'አገልግሎቶቻችን',
    'services.subtitle': 'የትራፊክ ማኔጅመንት ባለስልጣን የሚሰጣቸውን አገልግሎቶች ይመልከቱ',
    'feedback.title': 'የደንበኛ አስተያየት',
    'feedback.subtitle': 'ልምድዎን ከእኛ ጋር ያጋሩ',
    'feedback.cta': 'አስተያየት ያስገቡ',
    'feedback.form.title': 'የአስተያየት ቅጽ',
    'feedback.form.name': 'ሙሉ ስም',
    'feedback.form.email': 'ኢሜይል አድራሻ',
    'feedback.form.phone': 'ስልክ ቁጥር',
    'feedback.form.type': 'የአስተያየት አይነት',
    'feedback.form.type.complaint': 'ቅሬታ',
    'feedback.form.type.suggestion': 'አስተያየት',
    'feedback.form.type.compliment': 'ምስጋና',
    'feedback.form.service': 'የአገልግሎት አይነት',
    'feedback.form.message': 'መልእክትዎ',
    'feedback.form.submit': 'አስተያየት ያስገቡ',
    'feedback.form.success': 'አስተያየትዎን ስላስገቡ እናመሰግናለን!',
    'feedback.form.error': 'የሆነ ችግር ተከስቷል። እባክዎ እንደገና ይሞከሩ።',
    'feedback.voice.title': 'የቃል አስተያየት',
    'feedback.voice.start': 'ቃል መቅረጽ ይጀምሩ',
    'feedback.voice.stop': 'ቃል መቅረጽ ያቁሙ',
    'feedback.voice.play': 'ቃል ያጫውቱ',
    'feedback.voice.pause': 'ቃል ያቁሙ',
    'feedback.voice.transcription': 'የቃል ትርጉም',
    'about.title': 'ስለ የዜጎች ስምምነት',
    'about.content':
      'የዜጎች ስምምነት የአዲስአበባ አስተዳደር ትራፊክ ባለስልጣን የሚሰጣቸውን አገልግሎቶች፣ የእነዚህን አገልግሎቶች ደረጃዎች እና የዜጎችን መብቶችና ኃላፊነቶች የሚገልጽ ሰነድ ነው።',
    'footer.rights': 'መብቱ በህግ የተጠበቀ ነው',
    'footer.address': 'አዲስ አበባ፣ ኢትዮጵያ',
    'footer.mission.title': 'ተልዕኮአችን',
    'footer.mission.content':
      'የመንገድ ደህንነት ግንዛቤን በማሻሻልና በማሳወቅ ደህንነቱ የተጠበቀ የመንገድ ተጠቃሚን መፍጠር፤ የመንገድአጠቃቀምን በመወሰንና በመተግበር፣ የትራንስፖርት ሥርዓትና የትራፊክ ቁጥጥርን በዘመናዊ ቴክኖሎጂ በመምራት፤የትራፊክ ደንብና ስርዓት በማስከበርና የኩነት አስተዳደር ስርዓትን በማጎልበት የትራፊክ ፍሰት እና ደህንነት እንዲሻልማድረግ ነው፡፡',
    'footer.vision.title': 'ራዕያችን',
    'footer.vision.content':
      'በአዲስ አበባ ከተማ በ2022 ዓ.ም በመንገድ ተጠቃሚው ዘንድ ተቀባይነት ያለውና ሰላማዊ የትራፊክ እንቅስቃሴ ተረጋግጦ ማየት!',
    'complaints.submit.title': 'ቅሬታ ያስገቡ',
    'submit.voice.complaint': 'የድምፅ ቅሬታ ያስገቡ',
    'submit.text.complaint': 'የፅሁፍ ቅሬታ ያስገቡ',
    'track.complaint': 'ቅሬታዎን ይከታተሉ',
    'complaints.submit.description': 'እባክዎ ስለ ቅሬታዎ ዝርዝር መረጃ ያቅርቡ። እናስተካክላለን እና የሚከተል ኮድ እንሰጥዎታለን',
    'complaints.track.title': 'ቅሬታዎን ይከታተሉ',
    'complaints.Track.description': 'የቅሬታዎን ሁኔታ ለመፈተሽ የሚከተል ኮድዎን ወይም ስልክ ቁጥርዎን ያስገቡ',
    'complaints.form.selectSectorLeader': 'የዘርፍ አመራር ይምረጡ ',
    'complaints.form.sectorLeader': 'የዘርፍ አመራር ',
    'complaints.form.service': 'የአገልግሎት አይነት',
    'complaints.form.phone': 'ስልክ ቁጥር',
    'complaints.form.ExpertiseLoading': 'ባለሞያ',
    'complaints.form.expertise': 'ባለሞያ',
    'complaints.form.selectExpertise': 'ባለሞያ',
    'complaints.form.details': 'የቅሬታ ዝርዝሮች',
    'complaints.form.tracking': 'የሚከተል ኮድ',
    'complaints.form.submit': 'ቅሬታ ያስገቡ',
    'complaints.form.track': 'ቅሬታ ይከታተሉ',
    'complaints.form.office': 'ቢሮ',
    'complaints.form.DirectorLoading': 'ዳይሬክተር...',
    'complaints.form.director': 'ዳይሬክተር',
    'complaints.form.selectDirector': 'ዳይሬክተር ይምረጡ',
    'complaints.form.TeamLeaderLoading': 'ቡድን መሪ...',
    'complaints.form.teamLeader': 'ቡድን መሪ',
    'complaints.form.selectOffice': 'ቢሮ ይምረጡ',
    'complaints.form.employee': 'ሰራተኛ',
    'complaints.form.selectEmployee': 'ሰራተኛ',
    'complaints.form.sector': 'ዘርፍ',
    'complaints.form.selectSector': 'ዘርፍ ይምረጡ',
    'complaints.form.team': 'ቡድን',
    'complaints.form.selectTeam': 'ቡድን ይምረጡ',
    'complaints.form.selectSectorLeaderLoading': 'የዘርፍ አመራር...',
    'complaints.form.selectTeamLeader': 'ቡድን መሪ',
    'complaints.form.division': 'ክፍል',
    'complaints.form.selectDivision': 'ክፍል ይምረጡ',
    'complaints.form.selectsectorleaderfirst': 'ቅድሚያ የዘርፍ አመራር ይምረጡ',
    'complaints.form.explanation': 'የሚፈልጉት መፍትሄ (ምን አይነት ተግባሮች መሰራት አለባቸው?)',
    'complaints.form.Briefexplanation': 'በደንብ ያብራሩልን ምን አይነት ተግባሮች ወይም መፍትሄዎች ከኛ አንደምጠብቁ',
    'complaints.form.selectDirectorfirst': 'ቅድሚያ ዳይሬክተር ይምረጡ',
    'complaints.form.selectTeamleaderfirst': 'ቅድሚያ ቡድን መሪ ይምረጡ',
    'ratings.title': 'አገልግሎቶቻችንን ይፈርጁ',
    'ratings.subtitle': 'አገልግሎቶቻችንን በማሻሻል ላይ ልምድዎን በማጋራት ይርዱን',
    'ratings.form.title': 'የአገልግሎት ደረጃ',
    'ratings.form.description': 'እባክዎ አገልግሎቶቻችንን በሚመለከት ልምድዎን ይፈርጁ እና አስተያየትዎን ያቅርቡ',
    'ratings.form.service': 'የአገልግሎት አይነት',
    'ratings.form.overall': 'አጠቃላይ ደረጃ',
    'ratings.form.courtesy': 'ተከታታይነት',
    'ratings.form.timeliness': 'በጊዜ ላይ',
    'ratings.form.knowledge': 'እውቀት',
    'ratings.form.comments': 'ተጨማሪ አስተያየቶች',
    'ratings.form.submit': 'ደረጃ ያስገቡ',
    'feedback.types.complaint': 'ቅሬታ',
    'feedback.types.suggestion': 'አስተያየት',
    'feedback.types.compliment': 'ምስጋና',
    'feedback.form.showKeyboard': 'አማርኛ መተየቢያ አሳይ',
    'feedback.form.hideKeyboard': 'አማርኛ መተየቢያ ደብቅ',
    'feedback.form.enterAmharic': 'አማርኛ ጽሑፍ ያስገቡ',
    'feedback.form.enterEnglish': 'እንግሊዝኛ ጽሑፍ ያስገቡ',
    'feedback.form.enterOromo': 'ኦሮምኛ ጽሑፍ ያስገቡ',
    'feedback.form.voiceFeedback': 'የቃል አስተያየት',
    'feedback.form.recordVoice': 'የቃል አስተያየት ይቅረጹ',
    'feedback.form.playVoice': 'የቃል አስተያየት ያጫውቱ',
    'feedback.form.stopVoice': 'የቃል አስተያየት ያቁሙ',
    'feedback.form.voiceTranscription': 'የቃል ትርጉም',
    'navigation.services': 'አገልግሎቶቻችን',
    'navigation.servicesDesc': 'የምንሰጣቸውን አገልግሎቶች ይመልከቱ',
    'navigation.employees': 'ቡድናችን',
    'navigation.employeesDesc': 'ሰራተኞቻችንን እና የመገናኛ መረጃቸውን ይገናኙ',
    'navigation.complaints': 'ቅሬታ ያስገቡ',
    'navigation.complaintsDesc': 'ቅሬታ ያስገቡ ወይም ያሉትን ይከታተሉ',
    'navigation.ratings': 'አገልግሎቶችን ይደረጁ',
    'navigation.ratingsDesc': 'አገልግሎቶቻችንን በሚመለከት ልምድዎን ያጋሩ',
    'navigation.back': 'ተመለስ',
    'employees.title': 'ቡድናችን',
    'employees.searchPlaceholder': 'በስም፣ በሚሰሩበት ቦታ ወይም በቢሮ ቁጥር ይፈልጉ...',
    'employees.office': 'ቢሮ',
    'employees.email': 'ኢሜይል',
    'employees.phone': 'ስልክ',
    // services section
    'services.document.title': 'የሰነድ ማረጋገጫ',
    'services.license.title': 'የፈቃድ አገልግሎቶች',
    'services.vehicle.title': 'የተሽከርካሪ ምዝገባ',
    'services.violation.title': 'የትራፊክ ጥፋት ማቅረቢያ',
    'services.permit.title': 'የመንገድ ኩነት ፈቃድ',
    'services.inquiry.title': 'አጠቃላይ ጥያቄዎች',
    'services.cityFreightVehiclePermit.title': 'በከተማ ውስጥ ለሚንቀሳቀሱ የጭነት ተሽከርካሪዎች መንቀሳቀሻ ፈቃድ መስጠት',
    'services.cityFreightVehiclePermit.renewal':
      'በከተማ ውስጥ ለሚንቀሳቀሱ የጭነት ተሽከርካሪዎች መንቀሳቀሻ ፈቃድ እድሳት መስጠት',
    'services.cityFreightVehicleRenewal.title':
      'በከተማ ውስጥ ለሚንቀሳቀሱ የጭነት ተሽከርካሪዎች መንቀሳቀሻ ፈቃድ እድሳት መስጠት',
    'services.cityFreightVehicleRenewal.description':
      'በከተማ ውስጥ ለሚንቀሳቀሱ የጭነት ተሽከርካሪዎች መንቀሳቀሻ ፈቃድ እድሳት',
    'services.foreignAccidentClearance.title': 'ለውጭ ሀገር/ለኤምባሲ አደጋ አለማድረሱን ማረጋገጫ መስጠት',
    'services.licensePointsCompensation.title': 'የመንጃ ፈቃድ የነጥብ ሪከርድና እግድ አገልግሎት',
    'services.licensePointsCompensation.lostLicenseCard': 'የጠፋ ሰሌዳ ማጣራት',
    'services.licensePointsCompensation.trafficDataCorrection': 'የትራፊክ መረጃዎችን ማሰራጨት',
    'services.licensePointsCompensation.accidentDriverCompensation':
      'አደጋ ያደረሱ አሽከርካሪዎች መንጃ ፍቃድ እግድ አገልግሎት መስጠት',
    'services.licensePointsCompensation.sendRehabInstructors':
      'የተሃድሶ ስልጠና ሰልጣኞችን ወደ አሽከርካሪ ተሸከርካሪ ባለስልጣን መላክ/ማስተላለፍ',
    'services.licensePointsCompensation.returnDriverQualification':
      'የእግዳ ጊዜያቸዉን ላጠናቀቁ አሽከርካሪዎች የአሽከርካሪ ብቃት ማረጋገጫ መመለስ',
    'services.transportManagement.title': 'ለብዘሁን ትራንስፖርት እና አምቡላንስ የተለዩ መንገዶችን ቁጥጥር ማድረግ',
    'services.newMotorbikePermit.title': 'አዲስ የሞተር ብስክሌት መንቀሳቀሻ ፈቃድ አገልግሎት (ኢ. ባይክ)',
    'services.communityInquiry.title': 'ከህብረተሰቡ እና ከሌሎች አካላት የሚቀርቡ የመሠረተ ልማት ጥያቄዎችን ማስተናገድ',
    'services.communityInquiry.signSignalInquiry': 'የምልክት ተከላ ጥያቄን ማስተናገድ',
    'services.communityInquiry.colorSchemeInquiry': 'የቀለም ቅብ ይቀባልን ጥያቄን ማስተናገድ',
    'services.communityInquiry.speedBumpInspection': 'የፍጥነት መገደቢያ ጉብታ ጥያቄን ማስናገድ',
    'services.accidentClaim.title': 'የተሸከርካሪ አደጋ ተጎጅዎች የካሳ ክፍያ መጠየቂያ ማዘጋጀት እና ማስተላለፍ',
    'services.accidentClaim.documentAssembly':
      'ገጭቶ ባመለጠ ተሽከርካሪ አደጋ ተጎጂዎች/የተጎጂ ቤተሰቦች የጉዳት ካሳ ክፍያ መጠየቂያ ሰነዶች እንዲያሟሉ',
    'services.accidentClaim.documentSubmission':
      'ገጭቶ ባመለጠ ተሽከርካሪ አደጋ ተጎጂዎች/የተጎጂ ቤተሰቦች የጉዳት ካሳ ሰነዶችን ለክፍያ ማስተላለፍ',
    'services.document.description': 'የትራፊክ ተዛማጅ ሰነዶችና ማረጋገጫዎችን ያረጋግጡ',
    'services.license.description': 'የአሽከርካሪ ፈቃድና ፈቃዶችን ይመዝግቡ ወይም ያደጉ',
    'services.vehicle.description': 'ተሽከርካሪዎችን ይመዝግቡ እና ያስፈልጉትን ፈቃዶች ያግኙ',
    'services.violation.description': 'የትራፊክ ስህተቶችና ቅጣቶችን በማስተካከያ ይቀርቡ',
    'services.permit.description': 'ለመንገድ ክስተቶችና መዝጊያዎች ፈቃዶች ይጠይቁ',
    'services.inquiry.description': 'ስለ የትራፊክ መረጃ አገልግሎቶች መረጃ ይጠይቁ',
    'services.cityFreightVehiclePermit.description': 'በከተማ ውስጥ ጭነት መኪናዎች መንቀሳቀስ ይፈቀድ',
    'services.cityFreightVehiclePermit.renewalDescription': 'የከተማ ጭነት መኪና ፈቃድ ይደግሙ',
    'services.foreignAccidentClearance.description': 'ለውጭ ኤምባሲዎችና መድን ተወካዮች የአደጋ ማረጋገጫ ሰነዶች ይሰጡ',
    'services.licensePointsCompensation.description': 'የአሽከርካሪ ፈቃድ ነጥብ መዝገብ ይመልከቱ እና እግድ ይጠይቁ',
    'services.licensePointsCompensation.lostLicenseCardDescription': 'የጠፋ የአሽከርካሪ ፈቃድ ካርድ ይቀይሩ',
    'services.licensePointsCompensation.trafficDataCorrectionDescription':
      'በትራፊክ መረጃ መዝገቦች ውስጥ ያሉ ስህተቶችን ያስተካክሉ',
    'services.licensePointsCompensation.accidentDriverCompensationDescription':
      'በትራፊክ አደጋዎች በኋላ አሽከርካሪዎችን ይገንዘብሩ',
    'services.licensePointsCompensation.sendRehabInstructorsDescription':
      'ለፈቃድ ባለስልጣን የእኩል ስልጠና መምህራን ይላኩ',
    'services.licensePointsCompensation.returnDriverQualificationDescription':
      'ከአጥብት በኋላ የአሽከርካሪነት ብቃት ያድጉ',
    'services.transportManagement.description': 'ለትልቅ ጭነት መኪናዎችና አምቡላንሶች የተሰጡ መንገዶችን ያስተዳድሩ',
    'services.newMotorbikePermit.description': 'ለኤሌክትሪክና ባይክ ሞተርሳይክሎች ፈቃድ ይሰጡ',
    'services.communityInquiry.description': 'የህብረተሰብና የተሳተፉ ተቋማት የልማት ጥያቄዎችን ያቀርቡ',
    'services.communityInquiry.signSignalInquiryDescription': 'ስለ ማስተላለፊያ አዋቂነት ያሉ ጥያቄዎችን ይመልሱ',
    'services.communityInquiry.colorSchemeInquiryDescription': 'ስለ የመንገድ ቀለም ስርዓቶች ያሉ ጥያቄዎችን ያቀርቡ',
    'services.communityInquiry.speedBumpInspectionDescription': 'የፍጥነት መቆም መተግበሪያዎችን ይፈተኑ እና ያፈቀዱ',
    'services.accidentClaim.description': 'በተሽከርካሪ አደጋ መቅረብ ጥያቄዎች መዘጋጀትና መላክ ይረዱ',
    'services.accidentClaim.documentAssemblyDescription': 'ለየተጎጂዎች የሚያስፈልጉትን ሰነዶች ያደርጉ',
    'services.accidentClaim.documentSubmissionDescription': 'የአደጋ ጥያቄ ሰነዶች ለመክፈል ያቅርቡ',
    //  home search section
    'homepage.search.label': 'ወደ የት መሄድ ይፈልጋሉ?',
    'homepage.search.placeholder': 'መድረሻዎን ይተይቡ ወይም ይምረጡ...',
    // Help page translations
    'help.viewingServices.title': '1. የሚሰጡ አገልግሎቶችን ማየት',
    'help.viewingServices.intro': 'በተቋሙ የሚሰጡ አገልግሎቶችን ያሳዩ፣ መስፈርቶቹን ያስተውሉ፣ ተገቢ ኃላፊዎችን ያግኙ።',
    'help.viewingServices.step1': "በመነሻ ገፅ 'አገልግሎቶች' ክፍል ይግቡ።",
    'help.viewingServices.step2': 'የሚፈልጉትን አገልግሎት ይምረጡ።',
    'help.viewingServices.frontline': 'የፊት መስመር አገልግሎቶች:',
    'help.services.investmentReception': 'የኢንቨስትመንት ፕሮጀክት መቀበያ',
    'help.services.investmentProjectsLicensing': 'የኢንቨስትመንት ፕሮጀክቶች ፈቃድና የውል አስተዳደር አገልግሎቶች',
    'help.services.investmentPromotionLicensing': 'የኢንቨስትመንት ማስተዳደር ፈቃድ አገልግሎቶች',
    'help.services.procurementServices': 'የግዥ፣ የፋይናንስና የንብረት አስተዳደር አገልግሎቶች',
    'help.services.oneStopDesk': 'የኢንቨስትመንት አንድ ማቆሚያ ዴስክ መቀነባበሪያ አገልግሎቶች',
    'help.services.manufacturingSupport': 'የኢንዱስትሪ ድጋፍና እና ቁጥጥር አገልግሎቶች',
    'help.services.investmentPromotion': 'የኢንቨስትመንት ማስተዳደር አገልግሎቶች',
    'help.services.supportPackage': 'የድጋፍ ጥቅሎችና የገበያ ግንኙነቶች',
    'help.services.agriculturalSupport': 'የግብርና ፕሮጀክቶችን እና አገልግሎቶችን መቆጣጠሪያ/የውል ማቋረጫና የድጋፍ ፕሮጀክቶች',
    'help.services.legalComplaints': 'የህግ ቅሬታና የደንበኞች አቤቱታ ዳይሬክቶሬት የሚሰጡ አገልግሎቶች',
    'help.services.hrManagement': 'የሰው ኃይል አስተዳደር አገልግሎቶች (የሰራተኛ ቁጥጥርና ምዝገባ)',
    'help.services.evidenceManagement': 'የድርጅቱ ማስረጃና የመረጃ ትንተና/የኢንቨስትመንት ስታቲስቲክስ አገልግሎቶች',
    'help.viewingServices.offline': 'የመስመር ውጭ አገልግሎቶች:',
    'help.services.ethicsMonitoring': 'የሥነ ምግባርና የፀረ-ሙሉነት ማስተዳደር አገልግሎቶች',
    'help.services.communication': 'የኮሙኒኬሽን አገልግሎቶች',
    'help.services.audit': 'የኦዲት አገልግሎቶች',
    'help.services.researchPolicy': 'የጥናትና ፖሊሲ ዳይሬክቶሬት የሚሰጡ አገልግሎቶች',
    'help.services.ict': 'የአይሲቲ አገልግሎቶች',
    'help.services.planningBudgeting': 'የእቅድ፣ በጀት፣ እና አስተዳደር አገልግሎቶች',
    'help.services.genderYouthHIV': 'የፆታ፣ ህጻናት፣ ወጣቶችና ኤችአይቪ ኤድስ አገልግሎቶች',
    'help.viewingServices.step3': 'Faayidaalee armaan gadii ilaali:',
    'help.viewingServices.criteria':
      'Qajeelfama Tajaajilaa: Shuruukaa ykn gahuumsa tajaajila argachuuf barbaachisu.',
    'help.viewingServices.standards':
      "Qajeelfama fi Sadarkaa Tajaajilaa: Ibsa bal'aa sadarkaa fi tajaajiloota kutaa hundaatiin kennaman.",
    'help.complaints.title': '2. Komii Dhiyeessuu',
    'help.complaints.step1': "Kutaa 'Komii' fuula jalqabaa irra deemaa.",
    'help.complaints.step2': 'Furmaata komii guutuu.',
    'help.complaints.step3': 'Komii galchii fi lakkoofsa komii kee hordofi.',
    'help.feedback.title': '3. Furmaata Yaada',
    'help.feedback.step1':
      "Fuula jalqabaa irraa 'Tajaajila keenya irratti gammachuu kee ibsi' tuqi.",
    'help.feedback.step2': 'Hojjetaa ykn tajaajila filadhu.',
    'help.feedback.step3': 'Yaada kee sirna sadarkaa fayyadamuun kenni.',
    'help.feedback.step4': 'Sadarkaa galmeessi.',
    'help.rating.title': '4. Hojjetaa Sadarkaa',
    'help.rating.step1': "Fuula jalqabaa irraa 'Tajaajila keenya irratti gammachuu kee ibsi' tuqi.",
    'help.rating.step2': 'Hojjetaa ykn tajaajila filadhu.',
    'help.rating.step3': 'Yaada kee sirna sadarkaa fayyadamuun kenni.',
    'help.rating.step4': 'Sadarkaa galmeessi.',
    'help.whereToGo.title': '5. Gara Eessa Deemuu Barbaadduu?',
    'help.whereToGo.step1': "Kutaa 'Gara eessa deemuu barbaadduu?' fuula jalqabaa irra deemaa.",
    'help.whereToGo.step2': 'Kutaa ykn damee tajaajilaa filadhu.',
    'help.whereToGo.step3':
      'Hojjettoota tajaajilaaf ramadaman ilaali, kanneen armaan gadii dabalatee:',
    'help.whereToGo.officerName': 'Maqaa Hojjetaa: Maqaa guutuu hojjetaa ykn miseensa hojii.',
    'help.whereToGo.position': 'Iddoo Hojii: Gahee isaanii dhaabbata keessatti.',
    'help.whereToGo.officeNumber': 'Lakkoofsa Biiroo: Iddoo ykn qunnamtii tajaajilaa.',
    'help.importantNotes.title': 'Hubachiisa Ijoon',
    'help.importantNotes.body': "Odeeffannoo sirrii kennuun akka hojii salphaa ta'u mirkaneessi.",
    'help.button': 'እገዛ',
    // Complaint form new translations in Amharic
    'complaints.form.complainantName': 'የአቤቱታ አቅራቢው ሙሉ ስም',
    'complaints.form.subcity': 'ክፍለ ከተማ',
    'select.form.subcity': 'ክፍለ ከተማ ይምረጡ',
    'select.form.subcityLoading': 'ክፍለ ከተማ',
    'complaints.form.woreda': 'ወረዳ *',
    'complaints.form.characters.used': 'ቁምፊዎች ጥቅም ላይ ውለዋል',
    'complaints.form.issueDescription': 'በአጭሩ የቅሬታውን ዋና ጉዳይ ይግለጹ',
    'complaints.form.date': 'ቀን',
    'complaints.form.department': 'ዲፓርትመንት',
    'complaints.form.selectDepartment': 'ዲፓርትመንት ይምረጡ',
    'complaints.form.selectOfficeServed': 'አገልግሎት የወሰዱበትን ቢሮ ይምረጡ',
    'complaints.form.actionRequired': 'አቤቱታ አቅራቢው እንዲደረግለት የሚፈልገው ነገር (በአጭሩ ይግለጹ)',
    'complaints.form.agreement': 'ቅጹን በሙሉ ሞልቻለሁ ብዬ አረጋግጣለሁ።',
    'complaints.form.voice.description':
      'ቅሬታዎን በቀጥታ በድምፅዎ ይቅረጹ። ይህ አስተያየትዎን ለማስገባት ፈጣኑ መንገድ ነው። እባክዎ ከተጠየቁ የማይክሮፎን ፈቃዶችን መስጠትዎን ያረጋግጡ።',
    // Department names in Amharic
    'department.license': 'የፈቃድ ዲፓርትመንት',
    'department.registration': 'የምዝገባ ዲፓርትመንት',
    'department.traffic': 'የትራፊክ ቁጥጥር ዲፓርትመንት',
    'department.customer': 'የደንበኞች አገልግሎት ዲፓርትመንት',
    // Office names in Amharic
    'office.director': 'የዋና ዳይሬክተር ቢሮ',
    'office.deputy': 'የምክትል ዳይሬክተር ቢሮ',
    'office.operations': 'የኦፕሬሽን ቢሮ',
    'office.customer': 'የደንበኞች አገልግሎት ቢሮ',
    // Feedback translations in Amharic
    'feedback.description': 'አገልግሎቶቻችንን እንድናሻሽል ልምምድዎን ያጋሩን።',
    'feedback.status.title': 'የአስተያየት ሁኔታ ያረጋግጡ',
    'feedback.status.description': 'የአስተያየት ማጣቀሻ ቁጥርዎን በማስገባት አስተያየትዎ የደረሰበትን ሁኔታ ይመልከቱ።',
    'feedback.reference': 'ማጣቀሻ ቁጥር',
    'feedback.reference.placeholder': 'ለምሳሌ፣ FB-2023-12345',
    'feedback.check': 'ሁኔታን ያረጋግጡ',
    'feedback.submitted.title': 'አስተያየት ተላኳል',
    'feedback.submitted.description': 'ስላስገቡት አስተያየት እናመሰግናለን። በቅርብ ጊዜ እናዩታለን።',
  },
  af: {
    'site.title': 'Chaarterii Lammiilee',
    'site.subtitle': 'Abbaa Taayitaa Bulchiinsa Daandii Finfinnee',
    home: 'Seensa',
    services: 'Tajaajila',
    employees: 'Hojjettoota',
    complaints: 'Komiiwwan',
    'complaints.title': 'Komiiwwan fi Yaada',
    'complaints.onlyTitle': 'Komii Keessan Galchaa',
    'complaints.subtitle':
      'Komii keessan galchaa ykn komii jiru lakkoofsa bilbilaa ykn koodii isaa fayyadamuun ilaalaa',
    'complaints.track.description':
      'Haala komii keessan ilaaluuf koodii isaa ykn lakkoofsa bilbilaa keessan galchaa',
    ratings: 'Sadarkaa',
    about: "Waa'ee Keenya",
    contact: 'Nu Quunnamaa',
    'hero.title': 'Chaarterii Lammiilee Irratti Baga Nagaan Dhuftan',
    'hero.subtitle': 'Sagaleen keessan tajaajila keenna fooyyessuuf barbaachisaadha',
    'hero.cta': 'Yaada Galchaa',
    'services.title': 'Tajaajila Keenya',
    'services.subtitle': 'Tajaajila Abbaa Taayitaa Bulchiinsa Daandii kennamu ilaalaa',
    'feedback.title': 'Yaada Miseensa',
    'feedback.subtitle': 'Odeeffannoo keessan nuu dhiyaadhaa',
    'feedback.cta': 'Yaada Galchaa',
    'feedback.form.title': 'Unka Yaadaa',
    'feedback.form.name': 'Maqaa Guutuu',
    'feedback.form.email': 'Lakki Email',
    'feedback.form.phone': 'Lakki Telefoonaa',
    'feedback.form.type': 'Gosa Yaadaa',
    'feedback.form.type.complaint': 'Gaddaa',
    'feedback.form.type.suggestion': 'Yaada',
    'feedback.form.type.compliment': 'Galateeffannaa',
    'feedback.form.service': 'Gosa Tajaajilaa',
    'feedback.form.message': 'Ergaa Keessan',
    'feedback.form.submit': 'Yaada Galchaa',
    'about.title': "Waa'ee Chaarterii Lammiilee",
    'about.content':
      'Chaarterii Lammiilee barreeffama tajaajila Abbaa Taayitaa Bulchiinsa Daandii Finfinnee kennu, sadarkaa tajaajilaa fi mirgoota fi dirqamoota lammiilee ibsu dha.',
    'footer.rights': 'Mirgi isaa seeraan kan eegame dha',
    'footer.address': 'Finfinnee, Itoophiyaa',
    'footer.mission.title': 'Kaayyoo Keenya',
    'footer.mission.content':
      'Sirnoota geejjibaa fi konkolaataa Adaamaa keessatti haalaan bulchuun, nageenya, argachuummaa fi sosochii dhaabbataa lammiilee hundaaf mirkaneessuu.',
    'footer.vision.title': "Mul'ata Keenya",
    'footer.vision.content':
      "Sirnaa bulchiinsa konkolaataa sadarkaa addunyaa kan magaalaa Adamaa akka magaalaa ammayyaa, hojii gaarii fi jireenyaaf mijaawaa ta'etti guddinashee deeggaruuf uumuu.",
    'complaints.submit.title': 'Komii Galchaa',
    'complaints.submit.description':
      "Mee waa'ee komii keessan sirriitti nuuf himaa. Isaa sirreessuuf jirra fi koodii isaa isiniif kennu",
    'complaints.track.title': 'Komii Keessan Ilaalaa',
    'complaints.track.Description':
      'Haala komii keessan ilaaluuf koodii isaa ykn lakkoofsa bilbilaa keessan galchaa',
    'complaints.form.service': 'Gosa Tajaajilaa',
    'complaints.form.phone': 'Lakkoofsa Bilbilaa',
    'complaints.form.details': 'Odeeffannoo Komii',
    'complaints.form.tracking': 'Koodii Ilaaluu',
    'complaints.form.submit': 'Komii Galchaa',
    'complaints.form.track': 'Komii Ilaalaa',
    'complaints.form.office': 'Biroo',
    'complaints.form.selectOffice': 'Biroo Filadhaa',
    'complaints.form.employee': 'Hojjetaa',
    'complaints.form.selectEmployee': 'Hojjetaa',
    'complaints.form.sector': 'Kutaa',
    'complaints.form.selectSector': 'Kutaa Filadhu',
    'complaints.form.selectSectorLeader': 'Hoogganaa Damee',
    'complaints.form.sectorLeader': 'Hoogganaa Damee',
    'complaints.form.selectTeamLeader': 'Dursaa Garee',

    'complaints.form.division': 'Qoodinsa',
    'complaints.form.selectDivision': 'Qoodinsa Filadhu',
    'complaints.form.team': 'Garee',
    'complaints.form.selectTeam': 'Garee Filadhu',
    'ratings.title': 'Tajaajila Keenya Sadarkaa',
    'ratings.subtitle': 'Muuxannoo keessan qooduun tajaajila keenna akka fooyessinuuf nu gargaaraa',
    'ratings.form.title': 'Sadarkaa Tajaajilaa',
    'ratings.form.description':
      'Mee tajaajila keenna waliin muuxannoo keessan sadarkaa fi yaada keessan nuuf kennaa',
    'ratings.form.service': 'Gosa Tajaajilaa',
    'ratings.form.overall': 'Sadarkaa Guutuu',
    'ratings.form.courtesy': 'Qulqulleessa',
    'ratings.form.timeliness': 'Yeroo Isaa',
    'ratings.form.knowledge': 'Beekumsa',
    'ratings.form.comments': 'Yaada Dabalata',
    'ratings.form.submit': 'Sadarkaa Galchaa',
    'feedback.types.complaint': 'Gaddaa',
    'feedback.types.suggestion': 'Yaada',
    'feedback.types.compliment': 'Galateeffannaa',
    'feedback.form.showKeyboard': 'Qubeewwan Afaan Amaaraa Agarsiisi',
    'feedback.form.hideKeyboard': 'Qubeewwan Afaan Amaaraa Dhoksi',
    'feedback.form.enterAmharic': 'Barruu Afaan Amaaraa Galchaa',
    'feedback.form.enterEnglish': 'Barruu Afaan Ingilizii Galchaa',
    'feedback.form.enterOromo': 'Barruu Afaan Oromoo Galchaa',
    'feedback.form.voiceFeedback': 'Yaada Sagalee',
    'feedback.form.recordVoice': 'Yaada Sagalee Galchaa',
    'feedback.form.playVoice': 'Yaada Sagalee Dhaggeeffadhaa',
    'feedback.form.stopVoice': 'Yaada Sagalee Dhaabaa',
    'feedback.form.voiceTranscription': 'Hiika Sagalee',
    'navigation.services': 'Tajaajila Keenya',
    'navigation.servicesDesc': 'Tajaajila kennamu ilaalaa',
    'navigation.employees': 'Garee Keenya',
    'navigation.employeesDesc': 'Hojjettoota keennaa fi odeeffannoo isaanii ilaalaa',
    'navigation.complaints': 'Komii Galchaa',
    'navigation.complaintsDesc': 'Komii galchaa ykn jiru ilaalaa',
    'navigation.ratings': 'Tajaajila Sadarkaa',
    'navigation.ratingsDesc': 'Muuxannoo keessan qoodaa',
    'navigation.back': 'Duubatti',
    'employees.title': 'Garee Keenya',
    'employees.searchPlaceholder': "Maqaan, Ga'een ykn Biiroon barbaadaa...",
    'employees.office': 'Biroo',
    'employees.email': 'Email',
    'employees.phone': 'Bilbila',
    //services
    'services.cityFreightVehiclePermit.title': 'Hayyama Sochii Konkolaataa Baacaa Magaalaa',
    'services.cityFreightVehiclePermit.renewal':
      'Haaromsa Hayyama Sochii Konkolaataa Baacaa Magaalaa',
    'services.cityFreightVehicleRenewal.title':
      'Haaromsa Hayyama Sochii Konkolaata Feiinsaa Magaalaa Keessaa ',
    'services.cityFreightVehicleRenewal.description':
      'Haaromsa hayyama konkolaata feiinsaa magaalaa keessa sochoaniif',
    'services.foreignAccidentClearance.title': 'Shahaada Mirkaneessa Balaa Biyya Alaa',
    'services.licensePointsCompensation.title':
      'Tajaajila Galmee Dhibbata Hayyama Konkolaataa fi Gatii Kaffaltii',
    'services.licensePointsCompensation.lostLicenseCard': 'Bu’isa Kaardii Hayyamaa Dhabe',
    'services.licensePointsCompensation.trafficDataCorrection': 'Sirreessa Odeeffannoo Daandii',
    'services.licensePointsCompensation.accidentDriverCompensation':
      'Kaffaltii Hayyama Konkolaataa Sababa Balaa',
    'services.licensePointsCompensation.sendRehabInstructors':
      'Leenjistoota Deebii Gara Angawaa Hayyamaatti Ergisiisuu',
    'services.licensePointsCompensation.returnDriverQualification':
      'Dandeettii Konkolaachistuu Hiriirsi irraa Deebisuu',
    'services.transportManagement.title':
      'Daandii Addaa Geejjiba Baacaa Guddaa fi Anbuulaansii To’achuu',
    'services.newMotorbikePermit.title': 'Hayyama Haaraa Sochii Mootoor-Saayikilii (E-Bike)',
    'services.communityInquiry.title': 'Gaaffilee Misooma Hawaasa fi Hirmaattota',
    'services.communityInquiry.signSignalInquiry': 'Gaaffii Infrastraktii Mallattoo Too’achuu',
    'services.communityInquiry.colorSchemeInquiry': 'Gaaffii Sirna Halluu Too’achuu',
    'services.communityInquiry.speedBumpInspection':
      'Gaaffii Qorannoo Buufata Saffisa Hir’isu Too’achuu',
    'services.accidentClaim.title': 'Iyyata Gaaga’ama Konkolaataa Qopheessuu fi Erguu',
    'services.accidentClaim.documentAssembly': 'Dokumantoota Iyyata Balaa Walitti Qabuu',
    'services.accidentClaim.documentSubmission':
      'Dokumantoota Iyyata Balaa Gatii Kaffaltiiif Erguu',
    'services.document.description': 'Waraqaa fi shahaadoota daandii walqabatan mirkaneessi',
    'services.license.description': 'Hayyama konkolaataa haaromsuu yookiin galmeessi',
    'services.vehicle.description': 'Konkolaataa galmeessi fi hayyamoota barbaachisan argadhu',
    'services.violation.description': 'Iyyata mormii cabsaa daandii dhiyeessi',
    'services.permit.description': 'Hayyama taateewwan daandii fi cufamaa argachuuf gaafadhu',
    'services.inquiry.description': 'Odeeffannoo tajaajilawwan to’annoo daandii argadhu',
    'services.cityFreightVehiclePermit.description':
      'Hayyama konkolaataa baacaa magaalaa keessatti socho’uuf argadhu',
    'services.cityFreightVehiclePermit.renewalDescription':
      'Hayyama sochii konkolaataa baacaa magaalaa haaromsi',
    'services.foreignAccidentClearance.description':
      'Shahaada balaa biyya alaa fi embasiitiif kennisiisi',
    'services.licensePointsCompensation.description':
      'Galmee dhibbata hayyama konkolaachistuu ilaali fi kaffaltii gaafadhu',
    'services.licensePointsCompensation.lostLicenseCardDescription':
      'Kaardii hayyamaa dhabe deebisi',
    'services.licensePointsCompensation.trafficDataCorrectionDescription':
      'Dogoggora galmee daandii sirreessi',
    'services.licensePointsCompensation.accidentDriverCompensationDescription':
      'Konkolaachistoota balaa booda kaffaltii kennisiisi',
    'services.licensePointsCompensation.sendRehabInstructorsDescription':
      'Leenjistoota deebii gara angawoota hayyamatti ergi',
    'services.licensePointsCompensation.returnDriverQualificationDescription':
      'Dandeettii konkolaachistuu erga darbii booda deebisi',
    'services.transportManagement.description':
      'Daandii addaafi anbuulaansii fi geejjiba baacaa to’achi',
    'services.newMotorbikePermit.description':
      'Mootoor-sayikiloota elektirikaa fi kanneen biroo hayyamadhu',
    'services.communityInquiry.description': 'Gaaffilee misooma hawaasa fi hirmaattota eegi',
    'services.communityInquiry.signSignalInquiryDescription':
      'Gaaffii infrastrakturaa mallattoo dhiyeessi',
    'services.communityInquiry.colorSchemeInquiryDescription':
      'Gaaffii sirna halluu daandii dhiyeessi',
    'services.communityInquiry.speedBumpInspectionDescription':
      'Qorannoo buufata saffisa hir’isu geggeessi',
    'services.accidentClaim.description': 'Iyyata gaaga’ama konkolaataa qopheessi fi dhiheessi',
    'services.accidentClaim.documentAssemblyDescription': 'Dokumantoota iyyata balaa walitti qabi',
    'services.accidentClaim.documentSubmissionDescription':
      'Dokumantoota iyyata balaa erguuf dhiheessi',
    // home search
    'homepage.search.label': 'Eessa deemuu barbaadduu?',
    'homepage.search.placeholder': 'Iddoo barbaaddu barreessi yookiin filadhu...',
    // Help page translations
    'help.viewingServices.title': '1. Tajaajiloota Kennaman Ilaaluu',
    'help.viewingServices.intro':
      'Tajaajiloota dhaabbanni kennu, shuruukaa fi qajeelfama hubadhaa, fi hojjettoota barbaadaa.',
    'help.viewingServices.step1': "Kutaa 'Tajaajiloota' fuula jalqabaa irra deemaa.",
    'help.viewingServices.step2': 'Tajaajila barbaaddu filadhu.',
    'help.viewingServices.frontline': 'Tajaajiloota Fuula Duraa:',
    'help.services.investmentReception': 'Simannaa Projeektii Invastimantii',
    'help.services.investmentProjectsLicensing':
      'Tajaajila Hayyamaa fi Bulchiinsa Waliigaltee Projeektii Invastimantii',
    'help.services.investmentPromotionLicensing': 'Tajaajila Hayyamaa Guddisuu Invastimantii',
    'help.services.procurementServices': 'Tajaajila Bittaa, Maallaqaa fi Qabeenya Bulchiinsaa',
    'help.services.oneStopDesk': 'Tajaajila Walitti Fufiinsa One-Stop Desk Invastimantii',
    'help.services.manufacturingSupport': "Tajaajila Deeggarsa fi To'annoo Indaastirii",
    'help.services.investmentPromotion': 'Tajaajila Guddisuu Invastimantii',
    'help.services.supportPackage': 'Tajaajila Deeggarsa fi Walitti Hidha Gabaa',
    'help.services.agriculturalSupport':
      "Tajaajila To'annoo fi Deeggarsa Projeektii Qonnaa/Haquu Waliigaltee fi Deeggarsa Projeektii",
    'help.services.legalComplaints': 'Tajaajila Komii Seeraa fi Iyyata Hojjettootaa',
    'help.services.hrManagement':
      "Tajaajila Bulchiinsa Hojjettootaa (To'annoo fi Galmee Hojjettootaa)",
    'help.services.evidenceManagement':
      'Tajaajila Ragaa fi Xiinxala Bulchiinsa/Statistiksii Invastimantii',
    'help.viewingServices.offline': 'Tajaajiloota Alaa:',
    'help.services.ethicsMonitoring': "Tajaajila To'annoo Seeraa fi Malaammaltummaa Dhabamsiisuu",
    'help.services.communication': 'Tajaajila Kominikeeshinii',
    'help.services.audit': 'Tajaajila Odiitii',
    'help.services.researchPolicy': 'Tajaajila Qorannoo fi Karoora',
    'help.services.ict': 'Tajaajila ICT',
    'help.services.planningBudgeting': "Tajaajila Qopheessuu, Baajata, To'annoo fi Madaallii",
    'help.services.genderYouthHIV': "Tajaajila Saalaa, Dargaggootaa, Daa'immanii fi HIV/AIDS",
    'help.viewingServices.step3': 'Faayidaalee armaan gadii ilaali:',
    'help.viewingServices.criteria':
      'Qajeelfama Tajaajilaa: Shuruukaa ykn gahuumsa tajaajila argachuuf barbaachisu.',
    'help.viewingServices.standards':
      "Qajeelfama fi Sadarkaa Tajaajilaa: Ibsa bal'aa sadarkaa fi tajaajiloota kutaa hundaatiin kennaman.",
    'help.complaints.title': '2. Komii Dhiyeessuu',
    'help.complaints.step1': "Kutaa 'Komii' fuula jalqabaa irra deemaa.",
    'help.complaints.step2': 'Furmaata komii guutuu.',
    'help.complaints.step3': 'Komii galchii fi lakkoofsa komii kee hordofi.',
    'help.feedback.title': '3. Furmaata Yaada',
    'help.feedback.step1':
      "Fuula jalqabaa irraa 'Tajaajila keenya irratti gammachuu kee ibsi' tuqi.",
    'help.feedback.step2': 'Hojjetaa ykn tajaajila filadhu.',
    'help.feedback.step3': 'Yaada kee sirna sadarkaa fayyadamuun kenni.',
    'help.feedback.step4': 'Sadarkaa galmeessi.',
    'help.rating.title': '4. Hojjetaa Sadarkaa',
    'help.rating.step1': "Fuula jalqabaa irraa 'Tajaajila keenya irratti gammachuu kee ibsi' tuqi.",
    'help.rating.step2': 'Hojjetaa ykn tajaajila filadhu.',
    'help.rating.step3': 'Yaada kee sirna sadarkaa fayyadamuun kenni.',
    'help.rating.step4': 'Sadarkaa galmeessi.',
    'help.whereToGo.title': '5. Gara Eessa Deemuu Barbaadduu?',
    'help.whereToGo.step1': "Kutaa 'Gara eessa deemuu barbaadduu?' fuula jalqabaa irra deemaa.",
    'help.whereToGo.step2': 'Kutaa ykn damee tajaajilaa filadhu.',
    'help.whereToGo.step3':
      'Hojjettoota tajaajilaaf ramadaman ilaali, kanneen armaan gadii dabalatee:',
    'help.whereToGo.officerName': 'Maqaa Hojjetaa: Maqaa guutuu hojjetaa ykn miseensa hojii.',
    'help.whereToGo.position': 'Iddoo Hojii: Gahee isaanii dhaabbata keessatti.',
    'help.whereToGo.officeNumber': 'Lakkoofsa Biiroo: Iddoo ykn qunnamtii tajaajilaa.',
    'help.importantNotes.title': 'Hubachiisa Ijoon',
    'help.importantNotes.body': "Odeeffannoo sirrii kennuun akka hojii salphaa ta'u mirkaneessi.",
    'help.button': 'Gargaarsa',
    // Complaint form new translations in Oromo
    'complaints.form.complainantName': 'Maqaa guutuu komiituu',
    'complaints.form.subcity': 'Magaalaa-keessaa',
    'complaints.form.woreda': 'Woreda',
    'complaints.form.characters.used': 'qubee fayyadaman',
    'complaints.form.issueDescription': 'Dhimma ijoo komii gabaabatti ibsi',
    'complaints.form.date': 'Guyyaa',
    'complaints.form.department': 'Kutaa',
    'complaints.form.director': 'Daarektera',
    'complaints.form.teamLeader': 'Dursaa Garee',
    'complaints.form.expertise': 'Ogeessa',
    'complaints.form.selectDepartment': 'Kutaa filadhu',
    'complaints.form.selectOfficeServed': 'Waajjira itti tajaajiltamte filadhu',
    'complaints.form.actionRequired':
      "Namni dhimma kana akka hojjetamu ykn ta'u barbaade (gabaabatti ibsi)",
    'complaints.form.agreement': 'Unka kana xumureera jechaan mirkaneessa.',
    'complaints.form.voice.description':
      'Komii kee sagaleen kallattiin galchi. Kuni yaada galchuuf karaa ariifachiisaa dha. Maaloo hayyama maaykiroofooni yennaa marfamtu kennuu kee mirkaneeffadhu.',
    // Department names in Oromo
    'department.license': 'Kutaa Hayyamaa',
    'department.registration': 'Kutaa Galmee',
    'department.traffic': "Kutaa To'annoo Daandii",
    'department.customer': 'Kutaa Tajaajila Maamilaa',
    // Office names in Oromo
    'office.director': 'Waajjira Daarektoraa Waliigalaa',
    'office.deputy': 'Waajjira Itti Aanaa Daarektoraa',
    'office.operations': 'Waajjira Hojiirra Oolmaa',
    'office.customer': 'Waajjira Tajaajila Maamilaa',
    // Feedback translations in Oromo
    'feedback.description': 'Tajaajila keenya akka fooyessinuuf muuxannoo keessan nuuf qoodaa.',
    'feedback.status.title': 'Haala Yaada Ilaalaa',
    'feedback.status.description':
      'Lakkoofsa wabii yaada keessanii galchuun haala dhiyeessii keessanii ilaalaa.',
    'feedback.reference': 'Lakkoofsa Wabii',
    'feedback.reference.placeholder': 'Fakkeenyaaf, FB-2023-12345',
    'feedback.check': 'Haala Mirkaneessaa',
    'feedback.submitted.title': 'Yaada Dhiyaateera',
    'feedback.submitted.description': 'Yaada keessaniif galatoomi. Yeroo dhiyootti ilaalleerra.',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'am', 'af'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);

    // Force a re-render to update all translated content
    const event = new Event('languageChanged');
    window.dispatchEvent(event);
  };

  const t = (key: string): string => {
    try {
      // First look in our local translations
      if (
        translations[language] &&
        translations[language][key as keyof (typeof translations)[Language]]
      ) {
        return translations[language][key as keyof (typeof translations)[Language]];
      }

      // Fallback to English if translation is missing
      if (translations.en && translations.en[key as keyof typeof translations.en]) {
        return translations.en[key as keyof typeof translations.en];
      }

      return key; // Return the key itself if no translation found
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to original translations
      return (
        translations[language]?.[key as keyof (typeof translations)[Language]] ||
        translations.en?.[key as keyof (typeof translations)['en']] ||
        key
      );
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
