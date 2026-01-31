import { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

interface QuickTipsProps {
  role: 'client' | 'freelancer' | 'admin';
}

export function QuickTips({ role }: QuickTipsProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const tips = {
    client: [
      'Post your first project by clicking "Post New Project"',
      'Break your project into clear milestones for better accountability',
      'Review submitted work and approve milestones to release payments',
      'Your funds are protected in escrow until you approve each milestone'
    ],
    freelancer: [
      'Submit work on time to maintain your reliability score',
      'Click on any milestone to submit your completed work',
      'Communicate regularly with clients through project chat',
      'Your payments are guaranteed once milestones are approved'
    ],
    admin: [
      'Review active disputes in the Disputes tab',
      'Provide fair resolutions based on evidence from both parties',
      'Monitor platform health through the dashboard statistics',
      'Help maintain trust between clients and freelancers'
    ]
  };

  return (
    <Card className="border-blue-200 bg-blue-50 mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-blue-900">Quick Tips</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-blue-100"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-4 h-4 text-blue-600" />
          </Button>
        </div>
        <CardDescription className="text-blue-700">
          Get started with these helpful tips
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tips[role].map((tip, index) => (
            <li key={index} className="text-sm text-blue-800 flex items-start">
              <span className="mr-2">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
