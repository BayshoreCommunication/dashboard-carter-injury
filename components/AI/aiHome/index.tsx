import ContentSection from "@/pages/settings/components/content-section";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { AxiosInstance } from "axios";
import { useApiKey } from "@/hooks/useApiKey";
import { toast } from "sonner";

interface FAQResponse {
    id: string;
    question: string;
    response: string;
    is_active: boolean;
    created_at: string;
}

interface InstantReplyResponse {
    status: string;
    data: {
        message: string;
        isActive: boolean;
    };
}

interface TrainingResponse {
    id: string;
    org_id: string;
    url?: string;
    file_name?: string;
    status: string;
    type: string;
    created_at: string;
}

interface Automation {
    id: string;
    name: string;
    status: boolean;
    type: "instant-reply" | "faq" | "training";
    createdAt: string;
}

export default function AutomationSMS() {
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic() as AxiosInstance;
    const [automations, setAutomations] = useState<Automation[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const { apiKey } = useApiKey();

    const fetchAllAutomations = async () => {
        try {
            setLoading(true);

            // Fetch FAQ data
            const faqResponse = await axiosPublic.get<FAQResponse[]>('/api/faq/list', {
                headers: {
                    'X-API-Key': apiKey,
                }
            });
            const faqAutomations = faqResponse.data.map((faq) => ({
                id: faq.id,
                name: faq.question,
                status: faq.is_active,
                type: 'faq' as const,
                createdAt: faq.created_at
            }));

            // Fetch Instant Reply data
            const instantReplyResponse = await axiosPublic.get<InstantReplyResponse>('/api/instant-reply', {
                headers: {
                    'X-API-Key': apiKey,
                }
            });
            const instantReplyAutomations = instantReplyResponse.data.data.message ? [{
                id: 'instant-reply',
                name: 'Instant Reply Message',
                status: instantReplyResponse.data.data.isActive,
                type: 'instant-reply' as const,
                createdAt: new Date().toISOString() // Instant reply doesn't have a creation date
            }] : [];

            // Fetch Training data
            const trainingResponse = await axiosPublic.get<TrainingResponse[]>('/api/chatbot/upload_history', {
                headers: {
                    'X-API-Key': apiKey,
                }
            });
            const trainingAutomations = trainingResponse.data.map((training) => ({
                id: training.id,
                name: training.file_name || training.url || `Training ${training.type}`,
                status: training.status === 'completed',
                type: 'training' as const,
                createdAt: training.created_at
            }));

            // Combine all automations
            const allAutomations = [...faqAutomations, ...instantReplyAutomations, ...trainingAutomations]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setAutomations(allAutomations);
        } catch (error) {
            console.error('Error fetching automations:', error);
            toast.error('Failed to fetch automations');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id: string, type: string) => {
        try {
            if (type === 'faq') {
                await axiosPublic.put(`/api/faq/${id}/toggle`, null, {
                    headers: {
                        'X-API-Key': apiKey,
                    }
                });
            } else if (type === 'instant-reply') {
                const currentAutomation = automations.find(a => a.id === id);
                if (currentAutomation) {
                    await axiosPublic.post('/api/instant-reply', {
                        message: currentAutomation.name,
                        isActive: !currentAutomation.status
                    }, {
                        headers: {
                            'X-API-Key': apiKey,
                        }
                    });
                }
            }
            // Training items can't be toggled
            await fetchAllAutomations(); // Refresh data after toggle
            toast.success('Status updated successfully');
        } catch (error) {
            console.error('Error toggling automation status:', error);
            toast.error('Failed to update status');
        }
    };

    useEffect(() => {
        fetchAllAutomations();
    }, [apiKey]);

    const handleStartTraining = () => {
        navigate("/dashboard/train-ai-page");
    };

    const filteredAutomations = automations.filter(automation =>
        automation.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mx-6 mt-4">
            <ContentSection title="Automation SMS">
                <div className="space-y-6">
                    <p className="text-muted-foreground">
                        Set up automations that manage your conversations and streamline your workflows, giving you more time to focus on your business.
                    </p>

                    {/* Automation Cards */}
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
                                    Reply with a greeting when someone messages you for the first time.
                                </p>
                                <div>
                                    <Link to="/dashboard/instant-reply">
                                        <Button className="w-full" variant="outline">Create One</Button>
                                    </Link>
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
                                    Reply to a message that contains specific keyword with a pre-defined response.
                                </p>
                                <div>
                                    <Link to="/dashboard/faq">
                                        <Button className="w-full" variant="outline">Create One</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Trained AI Card */}
                        <div className="border rounded-lg overflow-hidden">
                            <div className="p-4 space-y-4">
                                <img
                                    src="https://res.cloudinary.com/dq9yrj7c9/image/upload/v1747212425/TrainAi.png"
                                    alt="Trained AI"
                                    className="w-full h-full object-cover rounded-md"
                                />
                                <h3 className="font-medium">Trained AI</h3>
                                <p className="text-sm text-muted-foreground">
                                    You could train your AI about your business and chat with your clients.
                                </p>
                                <div>
                                    <Button onClick={handleStartTraining} className="w-full" variant="outline">Start Training</Button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Your Automations Section */}
                    <div className="mt-8">
                        <h3 className="text-lg font-medium">Your Automations</h3>
                        <div className="mt-4 space-y-4">
                            <div className="relative">
                                <Input
                                    placeholder="Search"
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </svg>
                            </div>

                            {/* Automations Table */}
                            <div className="overflow-hidden rounded-md border">
                                <table className="w-full">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-3 text-center">
                                                    Loading automations...
                                                </td>
                                            </tr>
                                        ) : filteredAutomations.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-3 text-center">
                                                    No automations found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredAutomations.map((automation, index) => (
                                                <tr key={automation.id} className={index % 2 === 1 ? "bg-muted" : ""}>
                                                    <td className="px-4 py-3">
                                                        <Switch
                                                            checked={automation.status}
                                                            onCheckedChange={() => toggleStatus(automation.id, automation.type)}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">{automation.name}</td>
                                                    <td className="px-4 py-3 text-sm capitalize">{automation.type.replace('-', ' ')}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Link
                                                            to={`/dashboard/${automation.type === 'instant-reply'
                                                                ? 'instant-reply'
                                                                : automation.type === 'faq'
                                                                    ? 'faq'
                                                                    : 'train-ai-page'}/${automation.id}`}
                                                        >
                                                            <Button variant="link" className="text-blue-500 h-auto p-0">
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </ContentSection>
        </div>
    );
}
