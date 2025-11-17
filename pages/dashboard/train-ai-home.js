import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
// import { Button } from "@/components/custom/button";
import { LoadingSpinner } from "@/components/Loading/LoadingSpinner";
import axios from "axios";

const API_URL = "https://botapi.bayshorecommunication.org";
const API_KEY = "org_sk_dea9fa135aebfc9df317b55e87589372";

export default function TrainAiHome() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [automations, setAutomations] = useState([]);

    useEffect(() => {
        const fetchAutomations = async () => {
            try {
                setIsLoading(true);

                // Fetch FAQ data
                const faqResponse = await axios.get(`${API_URL}/api/faq/list`, {
                    headers: {
                        'X-API-Key': API_KEY,
                    }
                });
                const faqAutomations = faqResponse.data.map((faq) => ({
                    id: faq.id,
                    name: faq.question,
                    status: faq.is_active,
                    type: 'faq',
                    createdAt: faq.created_at
                }));

                // Fetch Instant Reply data
                const instantReplyResponse = await axios.get(`${API_URL}/api/instant-reply`, {
                    headers: {
                        'X-API-Key': API_KEY,
                    }
                });
                const instantReplyAutomations = instantReplyResponse.data.data.message ? [{
                    id: 'instant-reply',
                    name: 'Instant Reply Message',
                    status: instantReplyResponse.data.data.isActive,
                    type: 'instant-reply',
                    createdAt: new Date().toISOString()
                }] : [];

                // Fetch Training data
                const trainingResponse = await axios.get(`${API_URL}/api/chatbot/upload_history`, {
                    headers: {
                        'X-API-Key': API_KEY,
                    }
                });
                const trainingAutomations = trainingResponse.data.map((training) => ({
                    id: training.id,
                    name: training.file_name || training.url || `Training ${training.type}`,
                    status: training.status === 'completed',
                    type: 'training',
                    createdAt: training.created_at
                }));

                // Combine all automations
                const allAutomations = [...faqAutomations, ...instantReplyAutomations, ...trainingAutomations]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                setAutomations(allAutomations);
            } catch (error) {
                console.error('Error fetching automations:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAutomations();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full h-[calc(100vh-120px)] flex items-center justify-center">
                <LoadingSpinner
                    size="lg"
                    text="Loading AI features..."
                />
            </div>
        );
    }

    return (
        <div className="mx-6 mt-4">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">AI Training Center</h1>
                    <p className="text-gray-500 mt-2">
                        Enhance your AI assistants capabilities through various training methods.
                    </p>
                </div>

                {/* Training Cards */}
                <div className="grid grid-cols-1 lg:mr-60 mr-0 md:grid-cols-3 gap-6">
                    {/* Instant Reply Card */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="p-4 space-y-4">
                            <img
                                src="https://res.cloudinary.com/dq9yrj7c9/image/upload/v1747212346/instantReply.png"
                                alt="Instant Reply"
                                className="w-full h-full object-cover rounded-md"
                            />
                            <h3 className="font-medium">Instant Reply</h3>
                            <p className="text-sm text-muted-foreground">
                                Set up automated responses for first-time messages from your customers.
                            </p>
                            <div>
                                <button
                                    onClick={() => router.push('/dashboard/instant-reply')}
                                    className="w-full px-4 py-2 border rounded-md hover:bg-gray-50"
                                >
                                    Configure
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* FAQs Card */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="p-4 space-y-4">
                            <img
                                src="https://res.cloudinary.com/dq9yrj7c9/image/upload/v1747212404/FAQ.png"
                                alt="Frequently Asked Questions"
                                className="w-full h-full object-cover rounded-md"
                            />
                            <h3 className="font-medium">Frequently Asked Questions</h3>
                            <p className="text-sm text-muted-foreground">
                                Train your AI to handle common questions with predefined responses.
                            </p>
                            <div>
                                <button
                                    onClick={() => router.push('/dashboard/faq')}
                                    className="w-full px-4 py-2 border rounded-md hover:bg-gray-50"
                                >
                                    Manage FAQs
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Document Training Card */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="p-4 space-y-4">
                            <img
                                src="https://res.cloudinary.com/dq9yrj7c9/image/upload/v1747212425/TrainAi.png"
                                alt="Document Training"
                                className="w-full h-full object-cover rounded-md"
                            />
                            <h3 className="font-medium">Document Training</h3>
                            <p className="text-sm text-muted-foreground">
                                Train your AI with documents and websites to expand its knowledge base.
                            </p>
                            <div>
                                <button
                                    onClick={() => router.push('/dashboard/train-ai')}
                                    className="w-full px-4 py-2 border rounded-md hover:bg-gray-50"
                                >
                                    Train AI
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Automations */}
                <div className="border rounded-lg p-6 mt-8">
                    <h3 className="text-lg font-medium mb-4">Recent Automations</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Name</th>
                                    <th className="text-left py-2">Type</th>
                                    <th className="text-left py-2">Status</th>
                                    <th className="text-left py-2">Created</th>
                                    <th className="text-left py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {automations.map((automation) => (
                                    <tr key={automation.id} className="border-b">
                                        <td className="py-2">{automation.name}</td>
                                        <td className="py-2 capitalize">{automation.type.replace('-', ' ')}</td>
                                        <td className="py-2">
                                            <span className={`px-2 py-1 rounded-full text-xs ${automation.status
                                                ? 'bg-green-100 text-green-800'
                                                : ' bg-green-100 text-green-800'
                                                }`}>
                                                {automation.status ? 'Active' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="py-2 text-gray-500">
                                            {new Date(automation.createdAt).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true
                                            })}
                                        </td>
                                        <td className="py-2">
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={() => router.push(`/dashboard/${automation.type}${automation.type === 'training' ? '-ai' : ''}`)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
} 