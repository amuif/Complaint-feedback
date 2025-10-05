'use client';
import type { ReactNode } from 'react';

import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Map, Shield, Truck, FileText, Users, HelpCircle } from 'lucide-react';

const categoryData: Record<
  string,
  {
    name: string;
    services: { icon: ReactNode; title: string; description: string; link: string }[];
  }
> = {
  'traffic-management': {
    name: 'Traffic Management',
    services: [
      {
        icon: <Map className="h-8 w-8 text-primary" />,
        title: 'Transport Management',
        description: 'Comprehensive transport management and coordination services',
        link: '/services/3', // Updated to use hierarchical numbering
      },
      {
        icon: <Shield className="h-8 w-8 text-primary" />,
        title: 'Foreign Accident Clearance',
        description: 'Clearance certificate for accidents involving foreign vehicles',
        link: '/services/2', // Updated to use hierarchical numbering
      },
      {
        icon: <Map className="h-8 w-8 text-primary" />,
        title: 'Traffic Infrastructure Services',
        description: 'Services related to traffic signs, signals, and road infrastructure',
        link: '/services/7', // Updated to use hierarchical numbering
      },
    ],
  },
  'vehicle-services': {
    name: 'Vehicle Services',
    services: [
      {
        icon: <Truck className="h-8 w-8 text-primary" />,
        title: 'City Freight Vehicle Permit',
        description: 'Obtain permits for freight vehicles operating within city limits',
        link: '/services/1', // Updated to use hierarchical numbering
      },
      {
        icon: <Truck className="h-8 w-8 text-primary" />,
        title: 'New Motorbike Permit',
        description: 'Obtain permits for new motorcycle operations in the city',
        link: '/services/5', // Updated to use hierarchical numbering
      },
      {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: 'License Points Compensation',
        description: 'Services related to driver license points and compensation programs',
        link: '/services/4', // Updated to use hierarchical numbering
      },
    ],
  },
  'document-services': {
    name: 'Document Services',
    services: [
      {
        icon: <HelpCircle className="h-8 w-8 text-primary" />,
        title: 'Accident Claim Processing',
        description: 'Processing and management of traffic accident claims',
        link: '/services/8', // Updated to use hierarchical numbering
      },
      {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: 'Community Inquiry Services',
        description: 'Community-based inquiry and information services',
        link: '/services/6', // Updated to use hierarchical numbering
      },
      {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: 'Document Assembly Service',
        description: 'Professional assembly and organization of claim documents',
        link: '/services/8.1', // Updated to use hierarchical numbering
      },
    ],
  },
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;
  const category = categoryData[categoryId as keyof typeof categoryData];

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Category Not Found</h2>
        <Button onClick={() => router.push('/services')}>Back to Services</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">{category.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {category.services.map(
          (
            service: { icon: ReactNode; title: string; description: string; link: string },
            idx: number
          ) => (
            <Card
              key={idx}
              className="flex flex-col h-full border border-primary/20 bg-background/80 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="flex flex-col items-center justify-center py-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl text-center">{service.title}</CardTitle>
                <CardDescription className="text-center mt-2">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pb-6 flex justify-center">
                <Button asChild className="rounded-full px-6 py-2 text-base font-medium">
                  <Link href={service.link}>
                    Learn More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 ml-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3"
                      />
                    </svg>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
