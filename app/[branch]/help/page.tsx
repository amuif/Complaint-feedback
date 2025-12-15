'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/components/language-provider';
import { FileText, MessageSquare, ThumbsUp, Search, HelpCircle, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function HelpPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary-solid">
          {t('help.viewingServices.title')}
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">{t('help.viewingServices.intro')}</p>
        <ol className="mb-8 list-decimal list-inside space-y-2">
          <li>{t('help.viewingServices.step1')}</li>
          <li>
            {t('help.viewingServices.step2')}
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>
                {t('help.viewingServices.frontline')}
                <ul className="list-disc ml-6">
                  {/* Add service names as translation keys */}
                  <li>{t('help.services.investmentReception')}</li>
                  <li>{t('help.services.investmentProjectsLicensing')}</li>
                  <li>{t('help.services.investmentPromotionLicensing')}</li>
                  <li>{t('help.services.procurementServices')}</li>
                  <li>{t('help.services.oneStopDesk')}</li>
                  <li>{t('help.services.manufacturingSupport')}</li>
                  <li>{t('help.services.investmentPromotion')}</li>
                  <li>{t('help.services.supportPackage')}</li>
                  <li>{t('help.services.agriculturalSupport')}</li>
                  <li>{t('help.services.legalComplaints')}</li>
                  <li>{t('help.services.hrManagement')}</li>
                  <li>{t('help.services.evidenceManagement')}</li>
                </ul>
              </li>
              <li>
                {t('help.viewingServices.offline')}
                <ul className="list-disc ml-6">
                  <li>{t('help.services.ethicsMonitoring')}</li>
                  <li>{t('help.services.communication')}</li>
                  <li>{t('help.services.audit')}</li>
                  <li>{t('help.services.researchPolicy')}</li>
                  <li>{t('help.services.ict')}</li>
                  <li>{t('help.services.planningBudgeting')}</li>
                  <li>{t('help.services.genderYouthHIV')}</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            {t('help.viewingServices.step3')}
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>
                <b>{t('help.viewingServices.criteria')}</b>
              </li>
              <li>
                <b>{t('help.viewingServices.standards')}</b>
              </li>
            </ul>
          </li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4 text-primary">{t('help.complaints.title')}</h2>
        <ol className="mb-8 list-decimal list-inside space-y-2">
          <li>{t('help.complaints.step1')}</li>
          <li>{t('help.complaints.step2')}</li>
          <li>{t('help.complaints.step3')}</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4 text-primary">{t('help.feedback.title')}</h2>
        <ol className="mb-8 list-decimal list-inside space-y-2">
          <li>{t('help.feedback.step1')}</li>
          <li>{t('help.feedback.step2')}</li>
          <li>{t('help.feedback.step3')}</li>
          <li>{t('help.feedback.step4')}</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4 text-primary">{t('help.rating.title')}</h2>
        <ol className="mb-8 list-decimal list-inside space-y-2">
          <li>{t('help.rating.step1')}</li>
          <li>{t('help.rating.step2')}</li>
          <li>{t('help.rating.step3')}</li>
          <li>{t('help.rating.step4')}</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4 text-primary">{t('help.whereToGo.title')}</h2>
        <ol className="mb-8 list-decimal list-inside space-y-2">
          <li>{t('help.whereToGo.step1')}</li>
          <li>{t('help.whereToGo.step2')}</li>
          <li>
            {t('help.whereToGo.step3')}
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>
                <b>{t('help.whereToGo.officerName')}</b>
              </li>
              <li>
                <b>{t('help.whereToGo.position')}</b>
              </li>
              <li>
                <b>{t('help.whereToGo.officeNumber')}</b>
              </li>
            </ul>
          </li>
        </ol>

        <div className="bg-background/60 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2 text-primary">
            {t('help.importantNotes.title')}
          </h2>
          <p className="text-muted-foreground text-base mb-4">{t('help.importantNotes.body')}</p>
        </div>
      </div>
    </div>
  );
}

// --- TRANSLATION KEYS TO ADD (ENGLISH) ---
// help.viewingServices.title = "1. Viewing Services Provided"
// help.viewingServices.intro = "Explore the services offered by the institution, understand the criteria, and locate relevant officers."
// help.viewingServices.step1 = "Navigate to the 'Services' section on the homepage."
// help.viewingServices.step2 = "Select the service you're interested in."
// help.viewingServices.frontline = "Frontline Services:"
// help.services.investmentReception = "Investment project reception"
// help.services.investmentProjectsLicensing = "Investment Projects Licensing and Contract Management Services"
// help.services.investmentPromotionLicensing = "Investment Promotion Licensing Services"
// help.services.procurementServices = "Procurement Services, Financial and Property Management"
// help.services.oneStopDesk = "Investment One-Stop Service Desk Coordination Services"
// help.services.manufacturingSupport = "Manufacturing Industry Support and Control Monitoring Services"
// help.services.investmentPromotion = "Investment Promotion Services"
// help.services.supportPackage = "Support package services and Market Connections"
// help.services.agriculturalSupport = "Support Services Monitoring and Control of Agricultural Sector projects and services/ Termination of Contract and Support projects"
// help.services.legalComplaints = "Services provided by the directorate of legal complaints and customer appeals"
// help.services.hrManagement = "Human Resource Management Services (Employee Control and Registration)"
// help.services.evidenceManagement = "Organizational Evidence and Management Analysis / Investment Statistics Services"
// help.viewingServices.offline = "Offline Services:"
// help.services.ethicsMonitoring = "Ethical and Anti-Corruption Promotion Monitoring Services"
// help.services.communication = "Communication services"
// help.services.audit = "Audit services"
// help.services.researchPolicy = "Services provided by the Directorate of Potential Research and Policy"
// help.services.ict = "ICT services"
// help.services.planningBudgeting = "Planning, Budgeting, Monitoring and Evaluation Services"
// help.services.genderYouthHIV = "Gender, Children, Youth and HIV AIDS Services"
// help.viewingServices.step3 = "Review the details provided, including:"
// help.viewingServices.criteria = "Service Criteria: Requirements or qualifications needed to access the service."
// help.viewingServices.standards = "Services Give Or Standards: Detail expression of Standards and Services given by each directorates"
// help.complaints.title = "2. Submitting Complaints"
// help.complaints.step1 = "Go to the 'Complain' section on the homepage."
// help.complaints.step2 = "Fill out the complaint form with the necessary details."
// help.complaints.step3 = "Submit the complaint and track its status using your reference number."
// help.feedback.title = "3. Feedback Form"
// help.feedback.step1 = "Click on 'Express your satisfaction with our service' from the homepage."
// help.feedback.step2 = "Select the employee or service you wish to rate."
// help.feedback.step3 = "Provide your feedback using the rating system."
// help.feedback.step4 = "Submit the rating for record."
// help.rating.title = "4. Rating an Employee"
// help.rating.step1 = "Click on 'Express your satisfaction with our service' from the homepage."
// help.rating.step2 = "Select the employee or service you wish to rate."
// help.rating.step3 = "Provide your feedback using the rating system."
// help.rating.step4 = "Submit the rating for record."
// help.whereToGo.title = "5. Where Do You Want to Go?"
// help.whereToGo.step1 = "Navigate to the 'Where do you want to go?' section on the homepage."
// help.whereToGo.step2 = "Select the service category or department."
// help.whereToGo.step3 = "View the list of officers assigned to the service, including:"
// help.whereToGo.officerName = "Officer Name: Full name of the officer or staff member."
// help.whereToGo.position = "Position: Their role within the organization."
// help.whereToGo.officeNumber = "Office Number: The location or contact point for the service."
// help.importantNotes.title = "Important Notes"
// help.importantNotes.body = "Ensure you provide accurate information for a seamless process."
