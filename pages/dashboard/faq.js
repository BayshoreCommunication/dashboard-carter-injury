import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/custom/Button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/Loading/LoadingSpinner";
import { toast } from "sonner";
import axios from "axios";
import { UserIcon } from "lucide-react";

const API_URL = "https://botapi.bayshorecommunication.org";
const API_KEY = "org_sk_dea9fa135aebfc9df317b55e87589372";

export default function FAQPage() {
    const router = useRouter();
    const [isEnabled, setIsEnabled] = useState(true);
    const [faqs, setFaqs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedQuestionId, setExpandedQuestionId] = useState(null);
    const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isCreatingFaq, setIsCreatingFaq] = useState(false);

    // Helper function to get character count
    const getCharCount = (text) => {
        return text?.length || 0;
    };

    // Fetch FAQs on component mount
    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/faq/list`, {
                headers: {
                    'X-API-Key': API_KEY,
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

    const handleQuestionChange = (id, value) => {
        setFaqs(faqs.map(faq =>
            faq.id === id ? { ...faq, question: value } : faq
        ));
    };

    const handleResponseChange = (id, value) => {
        setFaqs(faqs.map(faq =>
            faq.id === id ? { ...faq, response: value } : faq
        ));
    };

    const togglePersistentMenu = async (id) => {
        const faq = faqs.find(f => f.id === id);
        if (!faq) return;

        try {
            const response = await axios.put(
                `${API_URL}/api/faq/${id}`,
                {
                    ...faq,
                    persistent_menu: !faq.persistent_menu
                },
                {
                    headers: {
                        'X-API-Key': API_KEY,
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

    const toggleQuestionExpand = (id) => {
        setExpandedQuestionId(expandedQuestionId === id ? null : id);
    };

    const deleteQuestion = async (id) => {
        try {
            const response = await axios.delete(
                `${API_URL}/api/faq/${id}`,
                {
                    headers: {
                        'X-API-Key': API_KEY,
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
                `${API_URL}/api/faq/create`,
                newFaq,
                {
                    headers: {
                        'X-API-Key': API_KEY,
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
                        `${API_URL}/api/faq/${faq.id}`,
                        {
                            question: faq.question,
                            response: faq.response,
                            is_active: faq.is_active,
                            persistent_menu: faq.persistent_menu
                        },
                        {
                            headers: {
                                'X-API-Key': API_KEY,
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
            setTimeout(() => {
                setShowSuccessModal(false);
                router.push("/dashboard/train-ai-home");
            }, 1500);
        }
    };

    const toggleFaqActive = async (id) => {
        const currentFaq = faqs.find(faq => faq.id === id);
        if (!currentFaq) return;

        const currentState = currentFaq.is_active;

        try {
            setFaqs(prevFaqs => prevFaqs.map(faq =>
                faq.id === id ? { ...faq, is_active: !currentState } : faq
            ));

            const response = await axios.put(
                `${API_URL}/api/faq/${id}/toggle`,
                {},
                {
                    headers: {
                        'X-API-Key': API_KEY,
                    }
                }
            );

            if (!response.data) {
                setFaqs(prevFaqs => prevFaqs.map(faq =>
                    faq.id === id ? { ...faq, is_active: currentState } : faq
                ));
                throw new Error('Failed to update FAQ status');
            }

            toast.success('FAQ status updated successfully');
        } catch (error) {
            setFaqs(prevFaqs => prevFaqs.map(faq =>
                faq.id === id ? { ...faq, is_active: currentState } : faq
            ));

            console.error('Error toggling FAQ status:', error);
            toast.error('Failed to update FAQ status');
            await fetchFAQs();
        }
    };

    if (isLoading) {
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

            <div className="space-y-6">
                <div className="flex justify-end mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                            {isEnabled ? "On" : "Off"}
                        </span>
                        <Switch
                            checked={isEnabled}
                            onCheckedChange={setIsEnabled}
                            className="data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:ring-black data-[state=checked]:ring-offset-black [&>span]:data-[state=checked]:bg-white"
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
                            <p className="text-sm text-muted-foreground">Show frequently asked questions as suggested messages that the person can send to your business.</p>
                        </div>

                        {faqs.map((faq) => (
                            <div key={faq.id} className={`border rounded-lg overflow-hidden ${expandedQuestionId === faq.id ? 'border-gray-300' : ''}`}>
                                <div
                                    className={`p-4 cursor-pointer ${expandedQuestionId === faq.id ? 'bg-gray-100 text-gray-900' : ''}`}
                                    onClick={() => toggleQuestionExpand(faq.id)}
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
                                                onCheckedChange={() => toggleFaqActive(faq.id)}
                                                className="mr-2 data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:ring-black data-[state=checked]:ring-offset-black [&>span]:data-[state=checked]:bg-white"
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleQuestionExpand(faq.id);
                                                }}
                                                className={`h-8 w-8 flex items-center justify-center rounded-full ${expandedQuestionId === faq.id ? 'text-gray-700' : 'text-gray-400'}`}
                                            >
                                                <UserIcon className="h-4 w-4" />
                                            </button>
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
                                                        onChange={(e) => handleQuestionChange(faq.id, e.target.value)}
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
                                                        onChange={(e) => handleResponseChange(faq.id, e.target.value)}
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
                                                    onCheckedChange={() => togglePersistentMenu(faq.id)}
                                                    className="mr-3 data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:ring-black data-[state=checked]:ring-offset-black [&>span]:data-[state=checked]:bg-white"
                                                />
                                                <div>
                                                    <Label htmlFor={`persistent-menu-${faq.id}`} className="font-medium">Add this question to persistent menu</Label>
                                                    <p className="text-xs text-gray-400">Enabling this will display the question in the persistent menu in the chat.</p>
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                onClick={() => deleteQuestion(faq.id)}
                                                className="text-red-400 hover:text-red-300 hover:bg-black mt-4 w-full justify-center border border-gray-700"
                                            >
                                                Delete question
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
                </div>

                <div className="flex items-center justify-between pt-16 pb-8">
                    <a href="#" className="text-sm text-blue-500">
                        Learn more about automation
                    </a>
                    <div className="flex gap-4">
                        <Button onClick={() => router.push("/dashboard/train-ai-home")} variant="outline" className="px-6">
                            Cancel
                        </Button>
                        <Button className="px-6" onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </div>

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

                {showSuccessModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium mb-2">Successfully Saved</h3>
                                <p className="text-sm text-gray-500">Your FAQ automation settings have been saved successfully. You will be redirected shortly.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 