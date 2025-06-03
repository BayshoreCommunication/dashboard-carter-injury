import { useState, useEffect } from "react";
import { Button } from "@/components/custom/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ContentSection from "@/pages/settings/components/content-section";
import { useNavigate } from "react-router-dom";
import { CheckIcon } from "lucide-react";
import { useChatWidgetSettings } from "@/hooks/useChatWidgetSettings";
import { LoadingSpinner } from "@/components/custom/loading-spinner";
import axios from "axios";
import { useApiKey } from "@/hooks/useApiKey";

function InstantReply() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [message, setMessage] = useState("Hi, thanks for contacting us. We've received your message and appreciate your getting in touch.");
    const [charCount, setCharCount] = useState(95);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { data: settings, isLoading: isSettingsLoading } = useChatWidgetSettings();
    const { apiKey } = useApiKey();

    const handleMessageChange = (e) => {
        const newMessage = e.target.value;
        setMessage(newMessage);
        setCharCount(newMessage.length);
    };

    useEffect(() => {
        const loadInstantReply = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/instant-reply`, {
                    headers: {
                        'X-API-Key': apiKey
                    }
                });

                if (response.data.status === 'success' && response.data.data) {
                    setMessage(response.data.data.message || message);
                    setIsEnabled(response.data.data.isActive);
                    if (response.data.data.message) {
                        setCharCount(response.data.data.message.length);
                    }
                }
            } catch (error) {
                console.error('Error loading instant reply:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (apiKey) {
            loadInstantReply();
        }
    }, [apiKey]);

    const handleSave = async () => {
        try {
            setIsSaving(true);

            await axios.post(`${import.meta.env.VITE_API_URL}/api/instant-reply`,
                {
                    message,
                    isActive: isEnabled
                },
                {
                    headers: {
                        'X-API-Key': apiKey
                    }
                }
            );

            setShowSuccessModal(true);
            setTimeout(() => {
                navigate("/dashboard/train-ai");
            }, 1500);
        } catch (error) {
            console.error('Error saving instant reply:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isSettingsLoading || isLoading) {
        return (
            <div className="w-full h-[calc(100vh-120px)] flex items-center justify-center">
                <LoadingSpinner
                    size="lg"
                    text="Loading preview..."
                />
            </div>
        );
    }

    return (
        <div className="mx-6 mt-4">
            <ContentSection title="Instant Reply">
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
                        Respond to the first message someone sends you in your website. You can customise your message to say hello, give them more information or let them know when to expect a response.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="border rounded-lg p-6 space-y-6 flex-1">
                            <div className="space-y-2">
                                <h3 className="font-medium">When this happens</h3>
                                <p className="text-sm text-muted-foreground">You can receive message from your connected website.</p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-medium">Take this action</h3>
                                <p className="text-sm text-muted-foreground">Reply instantly to the customer</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="font-medium">Message</Label>
                                <div className="relative">
                                    <Textarea
                                        id="message"
                                        placeholder="Type your message here"
                                        value={message}
                                        onChange={handleMessageChange}
                                        className="min-h-32 resize-none pr-16"
                                        disabled={!isEnabled}
                                    />
                                    <div className="absolute bottom-3 right-3 text-sm text-muted-foreground">
                                        {charCount}/500
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Preview */}
                        <div className="w-[320px]">
                            <div className="sticky top-6">
                                <div className="relative">
                                    <div className="w-[300px] h-[500px] bg-white rounded-xl shadow-lg border overflow-hidden">
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
                                                    <p className="text-xs opacity-70">online conversation</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Chat content */}
                                        <div className="p-4 h-[350px] flex flex-col justify-end">
                                            <div className="bg-gray-100 rounded-lg p-3 max-w-[75%] mb-2">
                                                <p className="text-sm text-black">Hi yes, David have found it, ask our concierge <span className="font-bold text-lg">👋</span></p>
                                            </div>
                                            <div className="flex justify-end">
                                                <div className="bg-gray-800 text-white rounded-lg p-3 max-w-[75%]">
                                                    <p className="text-sm">{message}</p>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-16">
                        <a href="#" className="text-sm text-blue-500">
                            Learn more about automation
                        </a>
                        <div className="flex gap-4">
                            <Button onClick={() => navigate("/dashboard/train-ai")} variant="outline" className="px-6">
                                Cancel
                            </Button>
                            <Button
                                className="px-6"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <LoadingSpinner size="sm" />
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Success Modal */}
                    {showSuccessModal && (
                        <div className="fixed inset-[-28px] flex items-center justify-center bg-black bg-opacity-50 z-50 pt-0 mt-0">
                            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                        <CheckIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">Successfully Saved</h3>
                                    <p className="text-sm text-gray-500">Your instant reply settings have been saved successfully. You will be redirected shortly.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ContentSection>
        </div>
    );
}

export default InstantReply; 