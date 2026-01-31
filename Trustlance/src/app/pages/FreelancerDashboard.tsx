import { Link } from 'react-router-dom';
import { TrendingUp, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { useApp } from '@/app/context/AppContext';
import { StatusBadge } from '@/app/components/StatusBadge';
import { format } from 'date-fns';
import { QuickTips } from '@/app/components/QuickTips';

export function FreelancerDashboard() {
  const { currentUser, projects } = useApp();

  const freelancerProjects = projects.filter(p => p.freelancerId === currentUser?.id);

  const getTotalEarnings = () => {
    return freelancerProjects.reduce((sum, project) => {
      const approved = project.milestones
        .filter(m => m.status === 'approved')
        .reduce((s, m) => s + m.amount, 0);
      return sum + approved;
    }, 0);
  };

  const getOnTimeDeliveryRate = () => {
    const completed = freelancerProjects.flatMap(p =>
      p.milestones.filter(m => m.status === 'approved')
    );
    
    if (completed.length === 0) return currentUser?.reliabilityScore || 100;
    
    const onTime = completed.filter(m => {
      if (!m.submittedDate) return false;
      return new Date(m.submittedDate) <= new Date(m.dueDate);
    });
    
    return Math.round((onTime.length / completed.length) * 100);
  };

  const getActiveMilestones = () => {
    return freelancerProjects.flatMap(p =>
      p.milestones
        .filter(m => m.status === 'in_progress' || m.status === 'pending')
        .map(m => ({ ...m, projectTitle: p.title, projectId: p.id }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Freelancer Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {currentUser?.name}
          </p>
        </div>

        {/* Quick Tips */}
        <QuickTips role="freelancer" />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Projects</CardDescription>
              <CardTitle className="text-3xl">{freelancerProjects.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Earnings</CardDescription>
              <CardTitle className="text-3xl">${getTotalEarnings().toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Reliability Score</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {getOnTimeDeliveryRate()}%
                <TrendingUp className="w-5 h-5 text-green-600" />
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Milestones</CardDescription>
              <CardTitle className="text-3xl">
                {getActiveMilestones().length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Active Milestones */}
        {getActiveMilestones().length > 0 && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-blue-900">Milestones to Complete</CardTitle>
              </div>
              <CardDescription className="text-blue-700">
                Focus on these deliverables to keep projects on track
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getActiveMilestones().map(milestone => (
                  <div key={milestone.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{milestone.projectTitle}</p>
                        <StatusBadge status={milestone.status} type="milestone" />
                      </div>
                      <p className="text-sm text-gray-600">{milestone.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          ${milestone.amount.toLocaleString()}
                        </p>
                      </div>
                      <Link to={`/project/${milestone.projectId}`}>
                        <Button size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Projects</h2>
          
          {freelancerProjects.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No active projects</h3>
                <p className="text-gray-600">
                  When you're assigned to projects, they'll appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {freelancerProjects.map(project => {
                const completedMilestones = project.milestones.filter(m => m.status === 'approved').length;
                const totalMilestones = project.milestones.length;
                const progress = (completedMilestones / totalMilestones) * 100;
                const pendingAmount = project.milestones
                  .filter(m => m.status !== 'approved')
                  .reduce((sum, m) => sum + m.amount, 0);

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
                            <span className="font-medium">{completedMilestones} / {totalMilestones} milestones</span>
                          </div>
                          <Progress value={progress} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Earned</p>
                            <p className="font-semibold text-green-600">
                              ${project.milestones
                                .filter(m => m.status === 'approved')
                                .reduce((sum, m) => sum + m.amount, 0)
                                .toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Pending</p>
                            <p className="font-semibold text-gray-900">
                              ${pendingAmount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Deadline</p>
                            <p className="font-semibold text-gray-900">
                              {format(new Date(project.deadline), 'MMM d')}
                            </p>
                          </div>
                        </div>

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

        {/* Reliability Info */}
        <Card className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-blue-900">Your Reliability Score</CardTitle>
            </div>
            <CardDescription className="text-blue-700">
              This score is based on your on-time delivery rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-blue-600">
                {getOnTimeDeliveryRate()}%
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-2">
                  {getOnTimeDeliveryRate() >= 95 && "Excellent! You're building strong trust with clients."}
                  {getOnTimeDeliveryRate() >= 80 && getOnTimeDeliveryRate() < 95 && "Good! Keep up the consistent delivery."}
                  {getOnTimeDeliveryRate() < 80 && "Focus on meeting deadlines to improve your score."}
                </p>
                <p className="text-xs text-gray-600">
                  High reliability scores help you win more projects
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}