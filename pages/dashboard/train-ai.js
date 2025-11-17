import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/custom/Button";
import { LoadingSpinner } from "@/components/Loading/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X, Check, Plus, Upload } from "lucide-react";
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

    // New state for history management
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isLoadingWebsites, setIsLoadingWebsites] = useState(false);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
    const [websites, setWebsites] = useState([]);
    const [documents, setDocuments] = useState([]);

    // Check for previous uploads when component mounts
    useEffect(() => {
        const checkPreviousUploads = async () => {
            try {
                setIsLoadingWebsites(true);
                setIsLoadingDocuments(true);

                // First check if user has previous uploads
                const hasPreviousResponse = await axios.get(`${API_URL}/api/chatbot/has_previous_uploads`, {
                    headers: {
                        'X-API-Key': API_KEY,
                    }
                });

                if (hasPreviousResponse.data.has_previous_uploads) {
                    setCurrentStep('main');
                }

                // Get upload history
                const historyResponse = await axios.get(`${API_URL}/api/chatbot/upload_history`, {
                    headers: {
                        'X-API-Key': API_KEY,
                    }
                });

                // Convert history items to website/document format
                const websites = [];
                const documents = [];

                historyResponse.data.forEach((item) => {
                    const historyItem = {
                        id: item.id,
                        status: item.status,
                        createdAt: new Date(item.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        })
                    };

                    if (item.type === 'url' && item.url) {
                        websites.push({
                            ...historyItem,
                            url: item.url
                        });
                    } else if ((item.type === 'pdf' || item.type === 'doc' || item.type === 'docx' || item.type === 'txt') && item.file_name) {
                        documents.push({
                            ...historyItem,
                            name: item.file_name
                        });
                    }
                });

                setWebsites(websites);
                setDocuments(documents);
            } catch (error) {
                console.error('Error checking previous uploads:', error);
                toast.error('Failed to load upload history');
            } finally {
                setIsLoadingHistory(false);
                setIsLoadingWebsites(false);
                setIsLoadingDocuments(false);
            }
        };

        checkPreviousUploads();
    }, []);

    const handleUrlChange = (index, value) => {
        const newUrls = [...urlInputs];
        newUrls[index] = value;
        setUrlInputs(newUrls);
    };

    const handleAddUrlInput = () => {
        if (urlInputs.length < 10) {
            setUrlInputs([...urlInputs, '']);
        } else {
            toast.error('Maximum 10 URLs allowed');
        }
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
                // Add new documents to the list
                const newDocuments = Array.from(files).map(file => ({
                    id: Date.now().toString(),
                    name: file.name,
                    status: "Used",
                    createdAt: new Date().toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    })
                }));
                setDocuments(prev => [...prev, ...newDocuments]);
                setCurrentStep('main');
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
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
                // Add new URLs to the list
                const newWebsites = validUrls.map(url => ({
                    id: Date.now().toString(),
                    url: url,
                    status: "Used",
                    createdAt: new Date().toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    })
                }));
                setWebsites(prev => [...prev, ...newWebsites]);
                setUrlInputs(['']);
                setShowUrlModal(false);
                setCurrentStep('main');
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 2000);
            }
        } catch (error) {
            console.error('Error training URLs:', error);
            toast.error('Failed to train URLs');
        } finally {
            setIsUploading(false);
        }
    };

    // Show loading spinner while history is loading
    if (isLoadingHistory && currentStep === 'initial') {
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

                {currentStep === 'main' && (
                    <>
                        {/* Add Content Section */}
                        <div className="flex gap-4 mb-6">
                            <Button
                                onClick={() => setShowUrlModal(true)}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Website URL
                            </Button>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Upload PDF
                            </Button>
                        </div>

                        {/* Websites List */}
                        {(websites.length > 0 || isLoadingWebsites) && (
                            <div className="mt-4">
                                {isLoadingWebsites ? (
                                    <div className="border rounded-md overflow-hidden bg-white p-8">
                                        <div className="animate-pulse space-y-4">
                                            <div className="h-6 w-32 bg-gray-200 rounded"></div>
                                            <div className="space-y-3">
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-lg font-medium mb-4">Websites: {websites.length}</h3>
                                        <div className="border rounded-md overflow-hidden bg-white">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b">
                                                        <th className="px-4 py-3 text-left font-medium text-sm">URL</th>
                                                        <th className="px-4 py-3 text-left font-medium text-sm">Status</th>
                                                        <th className="px-4 py-3 text-left font-medium text-sm">Created at</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {websites.map((website, index) => (
                                                        <tr key={website.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                            <td className="px-4 py-3 text-sm">{website.url}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={`inline-block px-2 py-1 rounded-md text-xs ${website.status === "Used" ? "bg-green-100 text-green-800" :
                                                                    website.status === "Failed" ? "bg-red-100 text-red-800" :
                                                                        "bg-yellow-100 text-yellow-800"
                                                                    }`}>
                                                                    {website.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">{website.createdAt}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Documents List */}
                        {(documents.length > 0 || isLoadingDocuments) && (
                            <div className="mt-6">
                                {isLoadingDocuments ? (
                                    <div className="border rounded-md overflow-hidden bg-white p-8">
                                        <div className="animate-pulse space-y-4">
                                            <div className="h-6 w-32 bg-gray-200 rounded"></div>
                                            <div className="space-y-3">
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-lg font-medium mb-4">Documents: {documents.length}</h3>
                                        <div className="border rounded-md overflow-hidden bg-white">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b">
                                                        <th className="px-4 py-3 text-left font-medium text-sm">Name</th>
                                                        <th className="px-4 py-3 text-left font-medium text-sm">Status</th>
                                                        <th className="px-4 py-3 text-left font-medium text-sm">Created at</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {documents.map((doc, index) => (
                                                        <tr key={doc.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                            <td className="px-4 py-3 text-sm">{doc.name}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={`inline-block px-2 py-1 rounded-md text-xs ${doc.status === "Used" ? "bg-green-100 text-green-800" :
                                                                    doc.status === "Failed" ? "bg-red-100 text-red-800" :
                                                                        "bg-yellow-100 text-yellow-800"
                                                                    }`}>
                                                                    {doc.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">{doc.createdAt}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </>
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
                                    disabled={isUploading || urlInputs.length >= 10}
                                >
                                    + Add Another URL
                                </Button>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowUrlModal(false);
                                        setUrlInputs(['']);
                                    }}
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