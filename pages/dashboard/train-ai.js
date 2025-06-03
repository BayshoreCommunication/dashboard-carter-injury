import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/custom/button";    
import { LoadingSpinner } from "@/components/Loading/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X, Check } from "lucide-react";
import axios from "axios";

const API_URL = "https://botapi.bayshorecommunication.org";
const API_KEY = "org_sk_dea9fa135aebfc9df317b55e87589372";

export default function TrainAiPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState('initial');
    const [urlInputs, setUrlInputs] = useState(['']);
    const [isUploading, setIsUploading] = useState(false);
    const [showUrlModal, setShowUrlModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const fileInputRef = useRef(null);

    const handleUrlChange = (index, value) => {
        const newUrls = [...urlInputs];
        newUrls[index] = value;
        setUrlInputs(newUrls);
    };

    const handleAddUrlInput = () => {
        setUrlInputs([...urlInputs, '']);
    };

    const handleRemoveUrlInput = (index) => {
        const newUrls = urlInputs.filter((_, i) => i !== index);
        setUrlInputs(newUrls);
    };

    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await axios.post(`${API_URL}/api/chatbot/upload`, formData, {
                headers: {
                    'X-API-Key': API_KEY,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data) {
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    router.push("/dashboard/train-ai-home");
                }, 2000);
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            toast.error('Failed to upload files');
        } finally {
            setIsUploading(false);
        }
    };

    const handleUrlSubmit = async () => {
        const validUrls = urlInputs.filter(url => url.trim() !== '');
        if (validUrls.length === 0) {
            toast.error('Please enter at least one valid URL');
            return;
        }

        setIsUploading(true);

        try {
            const response = await axios.post(`${API_URL}/api/chatbot/train_url`, {
                urls: validUrls
            }, {
                headers: {
                    'X-API-Key': API_KEY
                }
            });

            if (response.data) {
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    router.push("/dashboard/train-ai-home");
                }, 2000);
            }
        } catch (error) {
            console.error('Error training URLs:', error);
            toast.error('Failed to train URLs');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="mx-6 mt-4">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Train Your AI</h1>
                    <p className="text-gray-500 mt-2">
                        Build a smarter AI by continuously updating its knowledge and refining its responses.
                    </p>
                </div>

                {currentStep === 'initial' && (
                    <div className="flex flex-col md:flex-row gap-8 mt-8">
                        {/* URL Training Card */}
                        <div className="flex-1 border rounded-lg p-6">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Train from URLs</h2>
                                <p className="text-gray-600">Add website content to train your AI assistant.</p>
                                <Button
                                    onClick={() => setShowUrlModal(true)}
                                    className="w-full"
                                    variant="outline"
                                >
                                    Add URLs
                                </Button>
                            </div>
                        </div>

                        {/* File Upload Card */}
                        <div className="flex-1 border rounded-lg p-6">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Upload Documents</h2>
                                <p className="text-gray-600">Train your AI with PDF, DOCX, or TXT files.</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".pdf,.doc,.docx,.txt"
                                    multiple
                                    className="hidden"
                                />
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full"
                                    variant="outline"
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        'Upload Files'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* URL Modal */}
                {showUrlModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                        <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-auto shadow-lg">
                            <h3 className="text-lg font-medium mb-4">Add website content from URL</h3>
                            <p className="text-sm text-gray-500 mb-6">Training your Bay AI from your website and others</p>

                            <div className="space-y-4">
                                {urlInputs.map((url, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            placeholder="Enter URL of your website e.g http://mypage.com/faq"
                                            value={url}
                                            onChange={(e) => handleUrlChange(index, e.target.value)}
                                            className="flex-1"
                                            disabled={isUploading}
                                        />
                                        {urlInputs.length > 1 && (
                                            <button
                                                onClick={() => handleRemoveUrlInput(index)}
                                                className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
                                                disabled={isUploading}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <Button
                                    variant="outline"
                                    onClick={handleAddUrlInput}
                                    className="w-full"
                                    disabled={isUploading}
                                >
                                    + Add Another URL
                                </Button>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowUrlModal(false)}
                                    disabled={isUploading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUrlSubmit}
                                    className="bg-black text-white hover:bg-gray-800"
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        'Start Training'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {showSuccessMessage && (
                    <div className="fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-md shadow-md flex items-center gap-2 z-50">
                        <Check className="w-5 h-4" />
                        <span>Content added successfully!</span>
                    </div>
                )}
            </div>
        </div>
    );
} 