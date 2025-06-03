import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/custom/Button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/Loading/LoadingSpinner";
import { toast } from "sonner";
import axios from "axios";
import { CheckIcon } from "lucide-react";

const API_URL = "https://botapi.bayshorecommunication.org";
const API_KEY = "org_sk_dea9fa135aebfc9df317b55e87589372";

export default function InstantReplyPage() {
    const router = useRouter();
    const [isEnabled, setIsEnabled] = useState(false);
    const [message, setMessage] = useState("Hi, thanks for contacting us. We've received your message and appreciate your getting in touch.");
    const [charCount, setCharCount] = useState(95);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleMessageChange = (e) => {
        const newMessage = e.target.value;
        setMessage(newMessage);
        setCharCount(newMessage.length);
    };

    useEffect(() => {
        const loadInstantReply = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/instant-reply`, {
                    headers: {
                        'X-API-Key': API_KEY
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

        loadInstantReply();
    }, []);

    const handleSave = async () => {
        try {
            setIsSaving(true);

            await axios.post(`${API_URL}/api/instant-reply`,
                {
                    message,
                    isActive: isEnabled
                },
                {
                    headers: {
                        'X-API-Key': API_KEY
                    }
                }
            );

            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                router.push("/dashboard/train-ai-home");
            }, 1500);
        } catch (error) {
            console.error('Error saving instant reply:', error);
            toast.error('Failed to save instant reply');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-[calc(100vh-120px)] flex items-center justify-center">
                <LoadingSpinner
                    size="lg"
                    text="Loading instant reply settings..."
                />
            </div>
        );
    }

    return (
        <div className="mx-6 mt-4">
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
                    Respond to the first message someone sends you in your website. You can customize your message to say hello, give them more information or let them know when to expect a response.
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
                </div>

                <div className="flex items-center justify-between pt-16">
                    <a href="#" className="text-sm text-blue-500">
                        Learn more about automation
                    </a>
                    <div className="flex gap-4">
                        <Button onClick={() => router.push("/dashboard/train-ai-home")} variant="outline" className="px-6">
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

                {showSuccessModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
        </div>
    );
} 