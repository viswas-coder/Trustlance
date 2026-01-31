import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useApp, Milestone } from '@/app/context/AppContext';
import { toast } from 'sonner';

interface MilestoneForm {
  title: string;
  description: string;
  amount: string;
  dueDate: string;
}

export function NewProject() {
  const navigate = useNavigate();
  const { currentUser, addProject } = useApp();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [milestones, setMilestones] = useState<MilestoneForm[]>([
    { title: '', description: '', amount: '', dueDate: '' }
  ]);

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', description: '', amount: '', dueDate: '' }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: keyof MilestoneForm, value: string) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const getTotalAmount = () => {
    return milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error('Please enter a project title');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a project description');
      return;
    }

    if (!deadline) {
      toast.error('Please select a deadline');
      return;
    }

    if (milestones.length === 0) {
      toast.error('Please add at least one milestone');
      return;
    }

    for (let i = 0; i < milestones.length; i++) {
      const m = milestones[i];
      if (!m.title.trim()) {
        toast.error(`Milestone ${i + 1}: Please enter a title`);
        return;
      }
      if (!m.amount || parseFloat(m.amount) <= 0) {
        toast.error(`Milestone ${i + 1}: Please enter a valid amount`);
        return;
      }
      if (!m.dueDate) {
        toast.error(`Milestone ${i + 1}: Please select a due date`);
        return;
      }
    }

    // Create project
    const projectMilestones: Omit<Milestone, 'projectId'>[] = milestones.map((m, i) => ({
      id: `mile-${Date.now()}-${i}`,
      title: m.title,
      description: m.description,
      amount: parseFloat(m.amount),
      status: 'pending',
      dueDate: new Date(m.dueDate).toISOString()
    }));

    const newProject = {
      title,
      description,
      clientId: currentUser?.id || '',
      totalAmount: getTotalAmount(),
      escrowStatus: 'locked' as const,
      deadline: new Date(deadline).toISOString(),
      milestones: projectMilestones as Milestone[]
    };

    addProject(newProject);
    toast.success('Project created successfully! Funds locked in escrow.');
    navigate('/client/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <Link
          to="/client/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Project</h1>
          <p className="text-gray-600">
            Define your project and break it into clear milestones
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Provide a clear description of what you need
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., E-commerce Website Development"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project requirements, goals, and expectations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="deadline">Project Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-1"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
              <CardDescription>
                Break your project into clear deliverables with specific payment amounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 relative">
                  {milestones.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeMilestone(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {index + 1}
                    </div>
                    <h4 className="font-semibold text-gray-900">Milestone {index + 1}</h4>
                  </div>

                  <div>
                    <Label>Title</Label>
                    <Input
                      placeholder="e.g., Design Mockups"
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="What should be delivered in this milestone?"
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Amount ($)</Label>
                      <Input
                        type="number"
                        placeholder="1000"
                        value={milestone.amount}
                        onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                        className="mt-1"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                        className="mt-1"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addMilestone}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Milestone
              </Button>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Milestones:</span>
                <span className="font-semibold text-gray-900">{milestones.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Budget:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${getTotalAmount().toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg border border-blue-300">
                <p className="text-sm text-blue-900">
                  💡 This amount will be locked in escrow and released milestone by milestone as work is completed and approved.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/client/dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Project & Lock Escrow
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
