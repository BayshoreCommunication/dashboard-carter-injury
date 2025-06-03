import { useState, useEffect } from "react";
import { Button } from "@/components/custom/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ContentSection from "@/pages/settings/components/content-section";
import { useNavigate } from "react-router-dom";
import { CheckIcon, ChevronDownIcon, EditIcon, UserIcon } from "lucide-react";
import { useChatWidgetSettings } from "@/hooks/useChatWidgetSettings";
import { LoadingSpinner } from "@/components/custom/loading-spinner";
import { toast } from "sonner";
import { useApiKey } from "@/hooks/useApiKey";
import axios from "axios";

interface FAQ {
    id?: string;
    question: string;
    response: string;
    is_active: boolean;
    persistent_menu: boolean;
    created_at?: string;
    updated_at?: string;
}

export default function FAQAutomation() {
    const navigate = useNavigate();
    const { data: settings, isLoading: isSettingsLoading } = useChatWidgetSettings();
    const { apiKey } = useApiKey();
    const [isEnabled, setIsEnabled] = useState(true);
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
    const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isCreatingFaq, setIsCreatingFaq] = useState(false);

    // Helper function to get character count
    const getCharCount = (text: string): number => {
        return text?.length || 0;
    };

    // Fetch FAQs on component mount
    useEffect(() => {
        fetchFAQs();
    }, [apiKey]);

    const fetchFAQs = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/faq/list`, {
                headers: {
                    'X-API-Key': apiKey || '',
                }
            });
            if (response.data) {
                setFaqs(response.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            toast.error('Failed to load FAQs');
            setIsLoading(false);
        }
    };

    const handleQuestionChange = (id: string, value: string) => {
        setFaqs(faqs.map(faq =>
            faq.id === id ? { ...faq, question: value } : faq
        ));
    };

    const handleResponseChange = (id: string, value: string) => {
        setFaqs(faqs.map(faq =>
            faq.id === id ? { ...faq, response: value } : faq
        ));
    };

    const togglePersistentMenu = async (id: string) => {
        const faq = faqs.find(f => f.id === id);
        if (!faq) return;

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/faq/${id}`,
                {
                    ...faq,
                    persistent_menu: !faq.persistent_menu
                },
                {
                    headers: {
                        'X-API-Key': apiKey || '',
                    }
                }
            );

            if (response.data) {
                setFaqs(faqs.map(f =>
                    f.id === id ? { ...f, persistent_menu: response.data.persistent_menu } : f
                ));
                toast.success('FAQ updated successfully');
            }
        } catch (error) {
            console.error('Error updating FAQ:', error);
            toast.error('Failed to update FAQ');
        }
    };

    const toggleQuestionExpand = (id: string) => {
        setExpandedQuestionId(expandedQuestionId === id ? null : id);
    };

    const deleteQuestion = async (id: string) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/faq/${id}`,
                {
                    headers: {
                        'X-API-Key': apiKey || '',
                    }
                }
            );

            if (response.data?.status === 'success') {
                setFaqs(faqs.filter(faq => faq.id !== id));
                if (expandedQuestionId === id) {
                    setExpandedQuestionId(null);
                }
                toast.success('FAQ deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            toast.error('Failed to delete FAQ');
        }
    };

    const addQuestion = async () => {
        setIsCreatingFaq(true);
        const newFaq = {
            question: "New Question",
            response: "Enter your response here...",
            is_active: true,
            persistent_menu: false
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/faq/create`,
                newFaq,
                {
                    headers: {
                        'X-API-Key': apiKey || '',
                    }
                }
            );

            if (response.data) {
                setFaqs([...faqs, response.data]);
                toast.success('New FAQ created successfully');
            }
        } catch (error) {
            console.error('Error creating FAQ:', error);
            toast.error('Failed to create new FAQ');
        } finally {
            setIsCreatingFaq(false);
        }
    };

    const handleSave = async () => {
        let hasError = false;

        // Update all expanded FAQs
        for (const faq of faqs) {
            if (faq.id && expandedQuestionId === faq.id) {
                try {
                    const response = await axios.put(
                        `${import.meta.env.VITE_API_URL}/api/faq/${faq.id}`,
                        {
                            question: faq.question,
                            response: faq.response,
                            is_active: faq.is_active,
                            persistent_menu: faq.persistent_menu
                        },
                        {
                            headers: {
                                'X-API-Key': apiKey || '',
                            }
                        }
                    );

                    if (!response.data) throw new Error('Failed to update FAQ');
                } catch (error) {
                    console.error('Error updating FAQ:', error);
                    hasError = true;
                }
            }
        }

        if (hasError) {
            toast.error('Some FAQs failed to update');
        } else {
            setShowSuccessModal(true);
            toast.success('All FAQs saved successfully');
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate("/dashboard/train-ai");
            }, 1500);
        }
    };

    const toggleFaqActive = async (id: string) => {
        // Find the current FAQ
        const currentFaq = faqs.find(faq => faq.id === id);
        if (!currentFaq) return;

        // Store the current state
        const currentState = currentFaq.is_active;

        try {
            // Optimistically update the UI
            setFaqs(prevFaqs => prevFaqs.map(faq =>
                faq.id === id ? { ...faq, is_active: !currentState } : faq
            ));

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/faq/${id}/toggle`,
                {},
                {
                    headers: {
                        'X-API-Key': apiKey || '',
                    }
                }
            );

            if (!response.data) {
                // Revert on failure
                setFaqs(prevFaqs => prevFaqs.map(faq =>
                    faq.id === id ? { ...faq, is_active: currentState } : faq
                ));
                throw new Error('Failed to update FAQ status');
            }

            toast.success('FAQ status updated successfully');
        } catch (error) {
            // Revert on error
            setFaqs(prevFaqs => prevFaqs.map(faq =>
                faq.id === id ? { ...faq, is_active: currentState } : faq
            ));

            console.error('Error toggling FAQ status:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    toast.error('FAQ not found. Please refresh the page.');
                } else if (error.response?.status === 400) {
                    toast.error('Invalid FAQ ID format.');
                } else {
                    toast.error(error.response?.data?.detail || 'Failed to update FAQ status');
                }
            } else {
                toast.error('An unexpected error occurred');
            }

            // Refresh the FAQs list to ensure UI is in sync with server
            await fetchFAQs();
        }
    };

    // Show loading spinner while settings are loading
    if (isSettingsLoading || isLoading) {
        return (
            <div className="w-full h-[calc(100vh-120px)] flex items-center justify-center">
                <LoadingSpinner
                    size="lg"
                    text="Loading FAQs..."
                />
            </div>
        );
    }

    return (
        <div className="mx-6 mt-4">
            {/* Loading Overlay */}
            {isCreatingFaq && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                        <LoadingSpinner
                            size="lg"
                            text="Creating new FAQ..."
                        />
                    </div>
                </div>
            )}

            <ContentSection title="Frequently Asked Questions">
                <div className="space-y-6">
                    <div className="flex justify-end mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                                {isEnabled ? "On" : "Off"}
                            </span>
                            <Switch
                                checked={isEnabled}
                                onCheckedChange={setIsEnabled}
                            />
                        </div>
                    </div>

                    <p className="text-muted-foreground">
                        Suggest questions that people can ask your Page. Then set up automated responses to those questions.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="border rounded-lg p-6 space-y-6 flex-1">
                            <div className="space-y-2">
                                <h3 className="font-medium">When this happens</h3>
                                <p className="text-sm text-muted-foreground">A person starts a chat with Bay AI on the selected platforms.</p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-medium">Take this action</h3>
                                <p className="text-sm text-muted-foreground">Show frequently asked questions as suggested messages that the person can send to your business. If the person sends a suggested question, send the answer (if applicable) as an automated response.</p>
                            </div>

                            {faqs.map((faq) => (
                                <div key={faq.id} className={`border rounded-lg overflow-hidden ${expandedQuestionId === faq.id ? 'border-gray-300' : ''}`}>
                                    <div
                                        className={`p-4 cursor-pointer ${expandedQuestionId === faq.id ? 'bg-gray-100 text-gray-900' : ''}`}
                                        onClick={() => toggleQuestionExpand(faq.id!)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${expandedQuestionId === faq.id ? 'bg-gray-200 text-gray-900' : 'bg-gray-100'} mr-2`}>
                                                    <span className="text-sm">Aa</span>
                                                </div>
                                                <h4 className="font-medium">{faq.question}</h4>
                                            </div>
                                            <div className="flex items-center">
                                                <Switch
                                                    checked={faq.is_active}
                                                    onCheckedChange={() => toggleFaqActive(faq.id!)}
                                                    className="mr-2"
                                                />
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleQuestionExpand(faq.id!);
                                                    }}
                                                    className={`h-8 w-8 flex items-center justify-center rounded-full ${expandedQuestionId === faq.id ? 'text-gray-700' : 'text-gray-400'}`}
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </button>
                                                <ChevronDownIcon className={`h-5 w-5 ml-2 ${expandedQuestionId === faq.id ? 'text-gray-700' : 'text-gray-400'} transition-transform ${expandedQuestionId === faq.id ? 'rotate-180' : ''}`} />
                                            </div>
                                        </div>
                                    </div>

                                    {expandedQuestionId === faq.id && (
                                        <div className="p-4 pt-0 border-t bg-gray-100 text-gray-900">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`question-${faq.id}`} className="font-medium">Question</Label>
                                                    <div className="relative bg-white rounded-md">
                                                        <Input
                                                            id={`question-${faq.id}`}
                                                            placeholder="Enter your question here"
                                                            value={faq.question}
                                                            onChange={(e) => handleQuestionChange(faq.id!, e.target.value)}
                                                            className="pr-16 border-gray-300 text-gray-900"
                                                        />
                                                        <div className="absolute right-3 top-2.5 text-sm text-gray-500">
                                                            {getCharCount(faq.question)}/80
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor={`response-${faq.id}`} className="font-medium">Automated response</Label>
                                                    <div className="relative bg-white rounded-md">
                                                        <Textarea
                                                            id={`response-${faq.id}`}
                                                            placeholder="Type your response here"
                                                            value={faq.response}
                                                            onChange={(e) => handleResponseChange(faq.id!, e.target.value)}
                                                            className="min-h-32 resize-none pr-16 border-gray-300 text-gray-900"
                                                        />
                                                        <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                                                            {getCharCount(faq.response)}/500
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    onClick={() => setShowPersonalizeModal(true)}
                                                    className="flex items-center gap-2 text-blue-400 cursor-pointer"
                                                >
                                                    <UserIcon className="h-4 w-4" />
                                                    <span>Personalise your message</span>
                                                </div>

                                                <div className="flex items-center mt-4">
                                                    <Switch
                                                        id={`persistent-menu-${faq.id}`}
                                                        checked={faq.persistent_menu}
                                                        onCheckedChange={() => togglePersistentMenu(faq.id!)}
                                                        className="mr-3"
                                                    />
                                                    <div>
                                                        <Label htmlFor={`persistent-menu-${faq.id}`} className="font-medium">Add this question to persistent menu</Label>
                                                        <p className="text-xs text-gray-400">Enabling this will display the question in the persistent menu in the chat. Limit to 30 characters for a full view.</p>
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    onClick={() => deleteQuestion(faq.id!)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-black mt-4 w-full justify-center border border-gray-700"
                                                >
                                                    <span className="flex items-center">
                                                        <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        Delete question
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div
                                onClick={addQuestion}
                                className="flex items-center gap-2 text-blue-500 cursor-pointer mt-4"
                            >
                                <span>+ Add Another Question</span>
                            </div>
                        </div>

                        {/* Right side - Preview */}
                        <div className="w-[320px] md:sticky md:self-start md:top-6">
                            <div className="relative">
                                <div className="w-[300px] bg-white rounded-xl shadow-lg border overflow-hidden">
                                    {/* Chat header */}
                                    <div className={`p-4 ${settings?.selectedColor === 'black' ? 'bg-black' : `bg-${settings?.selectedColor}-500`} text-white`}>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                                {settings?.avatarUrl ? (
                                                    <img src={settings.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <span className="text-black text-xs font-bold">BA</span>
                                                )}
                                            </div>
                                            <div className="ml-2">
                                                <p className="text-sm"><span className="font-bold">{settings?.name || 'Bay AI'}</span></p>
                                                <p className="text-xs opacity-70">we reply immediately</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chat content */}
                                    <div className="p-4 min-h-[350px] max-h-[350px] overflow-y-auto flex flex-col justify-end">
                                        {/* Show active FAQs as suggestions */}
                                        <div className="space-y-2 mb-4">
                                            {faqs.filter(faq => faq.is_active).map((faq) => (
                                                <div key={faq.id} className="bg-gray-100 text-sm text-black p-2 rounded-lg cursor-pointer hover:bg-gray-200">
                                                    {faq.question}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-gray-100 rounded-lg p-3 max-w-[75%] mb-2">
                                            <p className="text-sm text-black">Hi, yes, David have found it, ask our concierge 👋</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <div className="bg-gray-800 text-white rounded-lg p-3 max-w-[75%]">
                                                <p className="text-sm">Thank you for work, see you!</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chat input */}
                                    <div className="border-t p-4 flex items-center">
                                        <div className="flex-1 flex items-center relative">
                                            <svg className="h-5 w-5 text-gray-400 absolute left-2" viewBox="0 0 24 24" fill="none">
                                                <path d="M19 13C19 16.866 15.866 20 12 20C8.13401 20 5 16.866 5 13C5 9.13401 8.13401 6 12 6C15.866 6 19 9.13401 19 13Z" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                            <input
                                                type="text"
                                                placeholder="Type your message here..."
                                                className="flex-1 pl-8 pr-2 py-2 rounded-full border border-gray-200 outline-none text-sm"
                                            />
                                        </div>
                                        <button className={`ml-2 w-8 h-8 rounded-full ${settings?.selectedColor === 'black' ? 'bg-black' : `bg-${settings?.selectedColor}-500`} text-white flex items-center justify-center`}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="text-center text-xs text-gray-500 p-2 border-t">
                                        Website chat Preview
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-16 pb-8">
                        <a href="#" className="text-sm text-blue-500">
                            Learn more about automation
                        </a>
                        <div className="flex gap-4">
                            <Button onClick={() => navigate("/dashboard/train-ai")} variant="outline" className="px-6">
                                Cancel
                            </Button>
                            <Button className="px-6" onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    </div>

                    {/* Personalize Modal */}
                    {showPersonalizeModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto shadow-lg">
                                <h3 className="text-lg font-medium mb-4">Personalise your message</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Make your message more personal by adding names or Page information to your automated response.
                                </p>

                                <div className="space-y-3">
                                    <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                                        <div className="font-medium">First name of recipient</div>
                                    </div>
                                    <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                                        <div className="font-medium">Surname of recipient</div>
                                    </div>
                                    <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                                        <div className="font-medium">Full name of recipient</div>
                                    </div>
                                    <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                                        <div className="font-medium">Email address</div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowPersonalizeModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => setShowPersonalizeModal(false)}
                                        className="bg-black text-white hover:bg-gray-800"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Modal */}
                    {showSuccessModal && (
                        <div className="fixed inset-[-28px] flex items-center justify-center bg-black bg-opacity-30 z-50">
                            <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-lg">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                        <CheckIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">Successfully Saved</h3>
                                    <p className="text-sm text-gray-500">Your FAQ automation settings have been saved successfully. You will be redirected shortly.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ContentSection>
        </div>
    );
}  