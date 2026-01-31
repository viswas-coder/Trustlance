import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Lock, MessageSquare, AlertCircle, CheckCircle, Upload, FileText, Calendar } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Progress } from '@/app/components/ui/progress';
import { Textarea } from '@/app/components/ui/textarea';
import { useApp } from '@/app/context/AppContext';
import { StatusBadge } from '@/app/components/StatusBadge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';

export function ProjectDetails() {
  const { id } = useParams();
  const { currentUser, projects, updateMilestone, addDispute } = useApp();
  const [disputeReason, setDisputeReason] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">Project not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isClient = currentUser?.id === project.clientId;
  const isFreelancer = currentUser?.id === project.freelancerId;

  const completedMilestones = project.milestones.filter(m => m.status === 'approved').length;
  const progress = (completedMilestones / project.milestones.length) * 100;

  const handleApproveMilestone = (milestoneId: string) => {
    updateMilestone(project.id, milestoneId, {
      status: 'approved',
      approvedDate: new Date().toISOString()
    });
    toast.success('Milestone approved! Payment will be released to freelancer.');
  };

  const handleRejectMilestone = (milestoneId: string) => {
    updateMilestone(project.id, milestoneId, {
      status: 'rejected'
    });
    toast.error('Milestone rejected. Freelancer will be notified.');
  };

  const handleSubmitMilestone = (milestoneId: string) => {
    updateMilestone(project.id, milestoneId, {
      status: 'submitted',
      submittedDate: new Date().toISOString(),
      notes: submissionNotes
    });
    setSubmissionNotes('');
    setSelectedMilestone(null);
    toast.success('Milestone submitted for review!');
  };

  const handleRaiseDispute = () => {
    if (!disputeReason.trim()) {
      toast.error('Please provide a reason for the dispute');
      return;
    }

    addDispute({
      projectId: project.id,
      raisedBy: currentUser?.id || '',
      reason: disputeReason,
      status: 'open'
    });

    setDisputeReason('');
    toast.success('Dispute raised. Our team will review it shortly.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="mb-6">
          <Link
            to={isClient ? '/client/dashboard' : '/freelancer/dashboard'}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <p className="text-gray-600">{project.description}</p>
            </div>
            <StatusBadge status={project.escrowStatus} type="escrow" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Budget</CardDescription>
              <CardTitle className="text-2xl">${project.totalAmount.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Progress</CardDescription>
              <CardTitle className="text-2xl">{completedMilestones} / {project.milestones.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Deadline</CardDescription>
              <CardTitle className="text-2xl">{format(new Date(project.deadline), 'MMM d, yyyy')}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}% complete</p>
        </div>

        <Tabs defaultValue="milestones" className="space-y-6">
          <TabsList>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="escrow">Escrow Details</TabsTrigger>
          </TabsList>

          <TabsContent value="milestones" className="space-y-4">
            {project.milestones.map(milestone => (
              <Card key={milestone.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                        <StatusBadge status={milestone.status} type="milestone" />
                      </div>
                      <CardDescription>{milestone.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${milestone.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Due Date</p>
                        <p className="font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      {milestone.submittedDate && (
                        <div>
                          <p className="text-gray-600">Submitted</p>
                          <p className="font-medium">
                            {format(new Date(milestone.submittedDate), 'MMM d, yyyy')}
                          </p>
                        </div>
                      )}
                    </div>

                    {milestone.notes && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Submission Notes:</p>
                        <p className="text-sm text-gray-900">{milestone.notes}</p>
                      </div>
                    )}

                    {milestone.files && milestone.files.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Attachments:</p>
                        <div className="space-y-2">
                          {milestone.files.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-blue-600">{file}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {isFreelancer && milestone.status === 'pending' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button onClick={() => setSelectedMilestone(milestone.id)}>
                              <Upload className="w-4 h-4 mr-2" />
                              Submit Work
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Submit Milestone</DialogTitle>
                              <DialogDescription>
                                Upload your completed work and add any notes for the client
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label>Notes (optional)</Label>
                                <Textarea
                                  placeholder="Describe what you've completed..."
                                  value={submissionNotes}
                                  onChange={(e) => setSubmissionNotes(e.target.value)}
                                  className="mt-2"
                                />
                              </div>
                              <div className="p-4 border-2 border-dashed rounded-lg text-center">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
                                  Simulated file upload - Click to add files
                                </p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={() => handleSubmitMilestone(milestone.id)}>
                                Submit for Review
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}

                      {isFreelancer && milestone.status === 'in_progress' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button onClick={() => setSelectedMilestone(milestone.id)}>
                              <Upload className="w-4 h-4 mr-2" />
                              Submit Work
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Submit Milestone</DialogTitle>
                              <DialogDescription>
                                Upload your completed work and add any notes for the client
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label>Notes (optional)</Label>
                                <Textarea
                                  placeholder="Describe what you've completed..."
                                  value={submissionNotes}
                                  onChange={(e) => setSubmissionNotes(e.target.value)}
                                  className="mt-2"
                                />
                              </div>
                              <div className="p-4 border-2 border-dashed rounded-lg text-center">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
                                  Simulated file upload - Click to add files
                                </p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={() => handleSubmitMilestone(milestone.id)}>
                                Submit for Review
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}

                      {isClient && milestone.status === 'submitted' && (
                        <>
                          <Button onClick={() => handleApproveMilestone(milestone.id)}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve & Release Payment
                          </Button>
                          <Button variant="outline" onClick={() => handleRejectMilestone(milestone.id)}>
                            Request Changes
                          </Button>
                        </>
                      )}

                      {milestone.status === 'approved' && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Approved & Paid</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Project Chat</CardTitle>
                <CardDescription>
                  Communicate with your {isClient ? 'freelancer' : 'client'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 text-center">
                  <div>
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">Chat functionality coming soon</p>
                    <Link to={`/chat/${project.id}`} className="mt-2 inline-block">
                      <Button variant="outline">Open Chat</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="escrow">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <CardTitle>Escrow Protection</CardTitle>
                </div>
                <CardDescription>
                  Payment is held securely and released milestone by milestone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Locked</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${project.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Released to Date</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${project.milestones
                        .filter(m => m.status === 'approved')
                        .reduce((sum, m) => sum + m.amount, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    How Escrow Works
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Payment is locked at project start</li>
                    <li>• Freelancer can see funds are available</li>
                    <li>• Money is released only after milestone approval</li>
                    <li>• Disputes can be raised if work is abandoned</li>
                  </ul>
                </div>

                {isClient && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Raise a Dispute
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Raise a Dispute</DialogTitle>
                        <DialogDescription>
                          Describe the issue you're experiencing with this project
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label>Reason for Dispute</Label>
                        <Textarea
                          placeholder="Explain the situation..."
                          value={disputeReason}
                          onChange={(e) => setDisputeReason(e.target.value)}
                          className="mt-2"
                          rows={5}
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={handleRaiseDispute}>Submit Dispute</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
