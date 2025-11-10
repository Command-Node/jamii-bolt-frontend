import { useEffect, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Safe supabase fallback
let supabase: any = null;
try {
  const supabaseModule = require('../../lib/supabase');
  supabase = supabaseModule.supabase;
} catch (err) {
  supabase = null;
}

export function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.job_id || selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const api = (await import('../lib/api')).default;
      const conversationsList = await api.getConversations();
      setConversations(conversationsList);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesOld = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!supabase) {
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      const { data: jobsData } = await supabase
      .from('jobs')
      .select(`
        id,
        title,
        customer_id,
        helper_id,
        services (name),
        profiles!jobs_customer_id_fkey (
          id,
          full_name
        ),
        helper_profiles!jobs_helper_id_fkey (
          profiles!helper_profiles_id_fkey (
            id,
            full_name
          )
        )
      `)
      .or(`customer_id.eq.${user.id},helper_id.eq.${user.id}`)
      .not('helper_id', 'is', null);

    if (jobsData) {
      const conversationsWithLastMessage = await Promise.all(
        jobsData.map(async (job: any) => {
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('job_id', job.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('job_id', job.id)
            .eq('recipient_id', user.id)
            .eq('read', false);

          return {
            job_id: job.id,
            job_title: job.title,
            service_name: job.services.name,
            other_user_id: job.customer_id === user.id ? job.helper_profiles?.profiles.id : job.profiles.id,
            other_user_name: job.customer_id === user.id ? job.helper_profiles?.profiles.full_name : job.profiles.full_name,
            last_message: lastMessage,
            unread_count: unreadCount || 0,
          };
        })
      );

      conversationsWithLastMessage.sort((a, b) => {
        if (!a.last_message) return 1;
        if (!b.last_message) return -1;
        return new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime();
      });

      setConversations(conversationsWithLastMessage);
    }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    }

    setLoading(false);
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const api = (await import('../lib/api')).default;
      const messagesList = await api.getConversationMessages(conversationId);
      setMessages(messagesList);
      
      // Mark messages as read
      messagesList.forEach((msg: any) => {
        if (msg.recipient_id === user?.id && !msg.read) {
          api.markMessageRead(msg.id).catch(console.error);
        }
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setSending(true);

    try {
      const api = (await import('../lib/api')).default;
      await api.sendMessage({
        recipient_id: selectedConversation.other_user_id || selectedConversation.recipient_id,
        job_id: selectedConversation.job_id,
        content: newMessage.trim(),
      });
      
      setNewMessage('');
      await fetchConversations();
      if (selectedConversation) {
        await fetchMessages(selectedConversation.job_id || selectedConversation.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Messages</h1>
        <p className="text-[#6B7280]">Chat with customers and helpers about your jobs</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          <div className="border-r border-gray-200 overflow-y-auto">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-[#1F2937]">Conversations</h2>
            </div>

            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-[#6B7280] text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {conversations.map((conv) => (
                  <button
                    key={conv.job_id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedConversation?.job_id === conv.job_id ? 'bg-orange-50 border-l-4 border-[#2ECC71]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-medium text-[#1F2937] truncate">{conv.other_user_name}</div>
                      {conv.unread_count > 0 && (
                        <span className="bg-[#FF6B35] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#6B7280] truncate mb-1">{conv.job_title}</div>
                    {conv.last_message && (
                      <div className="text-xs text-gray-500 truncate">{conv.last_message.content}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-[#1F2937]">{selectedConversation.other_user_name}</h3>
                  <p className="text-sm text-[#6B7280]">{selectedConversation.job_title}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwnMessage = message.sender_id === user?.id;
                      return (
                        <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                isOwnMessage
                                  ? 'bg-[#FF6B35] text-white'
                                  : 'bg-gray-100 text-[#1F2937]'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <div className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E5612F] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


