import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { useApp } from '@/app/context/AppContext';
import { format } from 'date-fns';

export function Chat() {
  const { id } = useParams();
  const { currentUser, projects, messages, addMessage } = useApp();
  const [newMessage, setNewMessage] = useState('');

  const project = projects.find(p => p.id === id);
  const projectMessages = messages.filter(m => m.projectId === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Project not found</p>
      </div>
    );
  }

  const isClient = currentUser?.id === project.clientId;
  const otherPartyName = isClient ? 'Alex Chen' : 'Sarah Johnson';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    addMessage({
      projectId: project.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage
    });

    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={`/project/${id}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-sm text-gray-600">Chat with {otherPartyName}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
        <Card className="h-[600px] flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {projectMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">No messages yet</p>
                    <p className="text-sm text-gray-400">
                      Start the conversation by sending a message
                    </p>
                  </div>
                </div>
              ) : (
                projectMessages.map(message => {
                  const isCurrentUser = message.senderId === currentUser?.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                          {message.senderName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 max-w-md ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {message.senderName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <div
                          className={`rounded-lg p-3 ${
                            isCurrentUser
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.attachments.map((file, idx) => (
                              <div
                                key={idx}
                                className="text-xs px-2 py-1 bg-gray-100 rounded flex items-center gap-1"
                              >
                                <Paperclip className="w-3 h-3" />
                                {file}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
