import { Link } from 'react-router-dom';
import { Plus, Clock, AlertTriangle, HelpCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { useApp } from '@/app/context/AppContext';
import { StatusBadge } from '@/app/components/StatusBadge';
import { format } from 'date-fns';
import { InfoTooltip } from '@/app/components/InfoTooltip';
import { QuickTips } from '@/app/components/QuickTips';

export function ClientDashboard() {
  const { currentUser, projects, disputes } = useApp();

  const clientProjects = projects.filter(p => p.clientId === currentUser?.id);

  const getProjectProgress = (project: typeof projects[0]) => {
    const total = project.milestones.length;
    const completed = project.milestones.filter(m => m.status === 'approved').length;
    return (completed / total) * 100;
  };

  const getTotalEscrowAmount = () => {
    return clientProjects
      .filter(p => p.escrowStatus === 'locked')
      .reduce((sum, p) => sum + p.totalAmount, 0);
  };

  const getUpcomingMilestones = () => {
    const allMilestones = clientProjects.flatMap(p =>
      p.milestones
        .filter(m => m.status === 'submitted')
        .map(m => ({ ...m, projectTitle: p.title }))
    );
    return allMilestones.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {currentUser?.name}
              </p>
            </div>
            <Link to="/client/new-project">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Post New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Tips */}
        <QuickTips role="client" />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Projects</CardDescription>
              <CardTitle className="text-3xl">{clientProjects.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                Escrow Balance
                <InfoTooltip content="Total amount currently locked in escrow across all your projects. Funds are released only when you approve milestones." />
              </CardDescription>
              <CardTitle className="text-3xl">${getTotalEscrowAmount().toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Disputes</CardDescription>
              <CardTitle className="text-3xl">
                {disputes.filter(d => d.status !== 'resolved').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Pending Reviews */}
        {getUpcomingMilestones().length > 0 && (
          <Card className="mb-8 border-amber-200 bg-amber-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <CardTitle className="text-amber-900">Milestones Awaiting Review</CardTitle>
              </div>
              <CardDescription className="text-amber-700">
                These milestones have been submitted and need your approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getUpcomingMilestones().map(milestone => (
                  <div key={milestone.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{milestone.projectTitle}</p>
                      <p className="text-sm text-gray-600">{milestone.title}</p>
                    </div>
                    <Link to={`/project/${milestone.projectId}`}>
                      <Button size="sm">Review</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Projects */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Projects</h2>
          
          {clientProjects.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-4">
                  Get started by posting your first project
                </p>
                <Link to="/client/new-project">
                  <Button>Post a Project</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {clientProjects.map(project => {
                const progress = getProjectProgress(project);
                const projectDisputes = disputes.filter(
                  d => d.projectId === project.id && d.status !== 'resolved'
                );

                return (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="mb-2">{project.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </div>
                        <StatusBadge status={project.escrowStatus} type="escrow" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Total Budget</p>
                            <p className="font-semibold text-gray-900">
                              ${project.totalAmount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Milestones</p>
                            <p className="font-semibold text-gray-900">
                              {project.milestones.filter(m => m.status === 'approved').length} / {project.milestones.length}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Deadline</p>
                            <p className="font-semibold text-gray-900">
                              {format(new Date(project.deadline), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Freelancer</p>
                            <p className="font-semibold text-gray-900">
                              {project.freelancerId ? 'Assigned' : 'Open'}
                            </p>
                          </div>
                        </div>

                        {projectDisputes.length > 0 && (
                          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-red-700">
                              Active dispute on this project
                            </span>
                          </div>
                        )}

                        <Link to={`/project/${project.id}`}>
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}