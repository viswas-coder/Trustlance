import { useState } from 'react';
import { Shield, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
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

export function AdminPanel() {
  const { projects, disputes, resolveDispute } = useApp();
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [resolution, setResolution] = useState('');

  const activeDisputes = disputes.filter(d => d.status !== 'resolved');
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved');

  const handleResolveDispute = (disputeId: string) => {
    if (!resolution.trim()) {
      toast.error('Please provide a resolution');
      return;
    }

    resolveDispute(disputeId, resolution);
    setResolution('');
    setSelectedDispute(null);
    toast.success('Dispute resolved successfully');
  };

  const getProjectTitle = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.title || 'Unknown Project';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Manage disputes and platform operations</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Projects</CardDescription>
              <CardTitle className="text-3xl">{projects.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Disputes</CardDescription>
              <CardTitle className="text-3xl text-red-600">{activeDisputes.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Resolved Disputes</CardDescription>
              <CardTitle className="text-3xl text-green-600">{resolvedDisputes.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Escrow</CardDescription>
              <CardTitle className="text-3xl">
                ${projects
                  .filter(p => p.escrowStatus === 'locked')
                  .reduce((sum, p) => sum + p.totalAmount, 0)
                  .toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="disputes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="disputes">
              <AlertCircle className="w-4 h-4 mr-2" />
              Disputes ({activeDisputes.length})
            </TabsTrigger>
            <TabsTrigger value="projects">All Projects</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="disputes" className="space-y-4">
            {activeDisputes.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No Active Disputes</h3>
                  <p className="text-gray-600">All disputes have been resolved</p>
                </CardContent>
              </Card>
            ) : (
              activeDisputes.map(dispute => {
                const project = projects.find(p => p.id === dispute.projectId);

                return (
                  <Card key={dispute.id} className="border-red-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle>{getProjectTitle(dispute.projectId)}</CardTitle>
                            <StatusBadge status={dispute.status} type="dispute" />
                          </div>
                          <CardDescription className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Raised {format(new Date(dispute.createdAt), 'MMM d, yyyy')}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm font-medium text-red-900 mb-1">Dispute Reason:</p>
                        <p className="text-sm text-red-800">{dispute.reason}</p>
                      </div>

                      {project && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Project Budget</p>
                            <p className="font-semibold">${project.totalAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Escrow Status</p>
                            <StatusBadge status={project.escrowStatus} type="escrow" />
                          </div>
                        </div>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedDispute(dispute.id)} className="w-full">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Resolve Dispute
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Resolve Dispute</DialogTitle>
                            <DialogDescription>
                              Provide your decision and resolution for this dispute
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">Dispute:</p>
                              <p className="text-sm text-gray-900">{dispute.reason}</p>
                            </div>
                            <div>
                              <Label>Resolution & Decision</Label>
                              <Textarea
                                placeholder="Explain your decision and how the escrow should be handled..."
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                                className="mt-2"
                                rows={5}
                              />
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm text-blue-900">
                                <strong>Note:</strong> Your decision will be final and binding for both parties.
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={() => handleResolveDispute(dispute.id)}>
                              Submit Resolution
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            {projects.map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {project.description}
                      </CardDescription>
                    </div>
                    <StatusBadge status={project.escrowStatus} type="escrow" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Budget</p>
                      <p className="font-semibold">${project.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Milestones</p>
                      <p className="font-semibold">
                        {project.milestones.filter(m => m.status === 'approved').length} / {project.milestones.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created</p>
                      <p className="font-semibold">
                        {format(new Date(project.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedDisputes.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No resolved disputes yet</p>
                </CardContent>
              </Card>
            ) : (
              resolvedDisputes.map(dispute => (
                <Card key={dispute.id} className="border-green-200 bg-green-50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{getProjectTitle(dispute.projectId)}</CardTitle>
                        <CardDescription>
                          Resolved on {dispute.resolvedAt && format(new Date(dispute.resolvedAt), 'MMM d, yyyy')}
                        </CardDescription>
                      </div>
                      <StatusBadge status={dispute.status} type="dispute" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Original Issue:</p>
                      <p className="text-sm text-gray-600">{dispute.reason}</p>
                    </div>
                    {dispute.resolution && (
                      <div className="p-3 bg-white rounded-lg border">
                        <p className="text-sm font-medium text-gray-700 mb-1">Resolution:</p>
                        <p className="text-sm text-gray-900">{dispute.resolution}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
