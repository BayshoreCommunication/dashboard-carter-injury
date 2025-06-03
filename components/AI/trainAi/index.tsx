import { useState, useEffect } from "react";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/ui/input";
import { X, Plus, AlertTriangle, Check, Upload } from "lucide-react";
import ContentSection from "@/pages/settings/components/content-section";
import { useNavigate } from "react-router-dom";
import { useChatWidgetSettings } from "@/hooks/useChatWidgetSettings";
import { LoadingSpinner } from "@/components/custom/loading-spinner";
import { useApiKey } from "@/hooks/useApiKey";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { toast } from "sonner";
import { AxiosInstance } from "axios";

interface Website {
    id: string;
    url: string;
    status: "Used" | "Pending" | "Failed";
    createdAt: string;
}

interface Document {
    id: string;
    name: string;
    status: "Used" | "Pending" | "Failed";
    createdAt: string;
}

interface UploadHistoryItem {
    id: string;
    type: "url" | "pdf" | "text";
    status: "Used" | "Pending" | "Failed";
    created_at: string;
    url?: string;
    file_name?: string;
}

export default function TrainAiPage() {
    const navigate = useNavigate();
    const { data: settings, isLoading: isSettingsLoading } = useChatWidgetSettings();
    const { apiKey } = useApiKey() as { apiKey: string };
    const axiosPublic = useAxiosPublic() as AxiosInstance;

    // Page state management
    const [currentStep, setCurrentStep] = useState<'initial' | 'main'>('initial');
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isLoadingWebsites, setIsLoadingWebsites] = useState(false);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

    // Modal state management
    const [showRestrictionsModal, setShowRestrictionsModal] = useState(false);
    const [showUrlModal, setShowUrlModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [showActivationModal, setShowActivationModal] = useState(false);

    // Form state
    const [urlInputs, setUrlInputs] = useState<string[]>([""]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [websites, setWebsites] = useState<Website[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Check for previous uploads when component mounts
    useEffect(() => {
        const checkPreviousUploads = async () => {
            try {
                setIsLoadingWebsites(true);
                setIsLoadingDocuments(true);

                // First check if user has previous uploads
                const hasPreviousResponse = await axiosPublic.get('/api/chatbot/has_previous_uploads', {
                    headers: {
                        'X-API-Key': apiKey,
                    }
                });

                if (hasPreviousResponse.data.has_previous_uploads) {
                    setCurrentStep('main');
                }

                // Get upload history
                const historyResponse = await axiosPublic.get('/api/chatbot/upload_history', {
                    headers: {
                        'X-API-Key': apiKey,
                    }
                });

                // Convert history items to website/document format
                const websites: Website[] = [];
                const documents: Document[] = [];

                historyResponse.data.forEach((item: UploadHistoryItem) => {
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
                    } else if (item.type === 'pdf' && item.file_name) {
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
    }, [apiKey, axiosPublic]);

    const handleStartTraining = () => {
        setShowRestrictionsModal(true);
    };

    const handleAcceptRestrictions = () => {
        setShowRestrictionsModal(false);
        setShowUrlModal(true);
    };

    const handleUrlChange = (index: number, value: string) => {
        const newUrls = [...urlInputs];
        newUrls[index] = value;
        setUrlInputs(newUrls);
    };

    const handleAddWebsite = () => {
        setShowUrlModal(true);
    };

    const handleAddDocument = () => {
        setShowPdfModal(true);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
            setSelectedFiles(prevFiles => [...prevFiles, ...pdfFiles]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(files => files.filter((_, i) => i !== index));
    };

    const handleUrlSubmit = async () => {
        const validUrls = urlInputs.filter(url => url.trim() !== "");
        if (validUrls.length === 0) return;

        setIsUploading(true);
        try {
            for (const url of validUrls) {
                const formData = new FormData();
                formData.append('url', url);

                const response = await axiosPublic.post('/api/chatbot/upload_document', formData, {
                    headers: {
                        'X-API-Key': apiKey,
                    }
                });

                if (response.data.status === 'success') {
                    setWebsites(prev => [...prev, {
                        id: response.data.id || Date.now().toString(),
                        url: url,
                        status: "Used",
                        createdAt: new Date().toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        })
                    }]);
                }
            }

            setUrlInputs(["", "", "", ""]);
            setShowUrlModal(false);
            setCurrentStep('main');
            setShowSuccessMessage(true);
            toast.success('URLs uploaded successfully');

            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (error) {
            console.error('Error uploading URLs:', error);
            toast.error('Failed to upload URLs');
        } finally {
            setIsUploading(false);
        }
    };

    const handlePdfSubmit = async () => {
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        try {
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append('file', file);

                const response = await axiosPublic.post('/api/chatbot/upload_document', formData, {
                    headers: {
                        'X-API-Key': apiKey,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.status === 'success') {
                    setDocuments(prev => [...prev, {
                        id: response.data.id || Date.now().toString(),
                        name: file.name,
                        status: "Used",
                        createdAt: new Date().toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        })
                    }]);
                }
            }

            setSelectedFiles([]);
            setShowPdfModal(false);
            setCurrentStep('main');
            setShowSuccessMessage(true);
            toast.success('PDFs uploaded successfully');

            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (error) {
            console.error('Error uploading PDFs:', error);
            toast.error('Failed to upload PDFs');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddUrlInput = () => {
        if (urlInputs.length < 10) {
            setUrlInputs([...urlInputs, ""]);
        } else {
            toast.error('Maximum 10 URLs allowed');
        }
    };

    const handleRemoveUrlInput = (index: number) => {
        const newUrls = [...urlInputs];
        newUrls.splice(index, 1);
        setUrlInputs(newUrls);
    };

    const handleActivate = () => {
        setShowActivationModal(true);
    };

    const handleActivationDone = () => {
        navigate("/dashboard/train-ai");
    };

    // Show loading spinner while settings or history are loading
    if ((isSettingsLoading || isLoadingHistory) && currentStep === 'initial') {
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
            <ContentSection title="Training your AI">
                <div className="space-y-6 ">
                    <p className="text-muted-foreground">
                        Build a smarter AI by continuously updating its knowledge and refining its responses to meet customer expectations.
                    </p>

                    {/* Initial Page */}
                    {currentStep === 'initial' && (
                        <div className="flex flex-col lg:flex-row gap-8 mt-8 relative border-2 rounded-lg">
                            {/* Left side content */}
                            <div className="flex-1 z-20">
                                <div className="flex justify-center items-center w-3/4 mt-16 ">
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-semibold">Enhance customer support with an AI assistant, <span className="text-gray-900">Bay AI!</span></h2>
                                        <p>Bay AI is a next-generation AI built for customer support, capable of answering up to <span className="font-semibold">85%</span> of customer inquiries.</p>

                                        <div className="space-y-3 mt-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <p>Replies immediately in natural, human-like conversations.</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <p>Multilingual conversations.</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <p>Powered by various sources: websites, Q&A sets.</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <p>Tackle more complicated, specific use-cases with <span className="font-semibold">Bay AI</span> tasks.</p>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <Button onClick={handleStartTraining} className="bg-black text-white hover:bg-gray-800">
                                                Start Training
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Chat Preview */}
                            <div className="w-[320px] md:sticky md:self-start md:top-6 z-20 my-5">
                                <div className="relative">
                                    <div className="w-[270px] bg-white rounded-xl shadow-lg border overflow-hidden">
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
                                        <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto flex flex-col justify-end">
                                            <div className="bg-gray-100 rounded-lg p-3 max-w-[75%] mb-2 mt-24">
                                                <p className="text-sm">Hi, yes, David have found it, ask our concierge 👋</p>
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
                                    </div>
                                </div>
                            </div>

                            {/* Brain background image */}
                            <div
                                className="absolute right-0 bottom-0 w-full h-full pointer-events-none z-10"
                                style={{
                                    backgroundImage: "url('https://res.cloudinary.com/dq9yrj7c9/image/upload/v1747287480/d0tfhqfgnhtxfeu7buyr.png')",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "right bottom",
                                    backgroundSize: "contain",
                                }}
                            ></div>
                        </div>
                    )}

                    {/* Main Page (after submission) */}
                    {currentStep === 'main' && (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <Button
                                    onClick={handleActivate}
                                    className="bg-blue-600 text-white hover:bg-blue-700 px-8 tracking-widest"
                                >
                                    Active
                                </Button>
                            </div>

                            {/* Add Content Section */}
                            <div className="flex gap-4 mb-6">
                                <Button
                                    onClick={handleAddWebsite}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Website URL
                                </Button>
                                <Button
                                    onClick={handleAddDocument}
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
                                                            <th className="w-8 px-4 py-3 text-left">
                                                                <input type="checkbox" className="rounded" />
                                                            </th>
                                                            <th className="px-4 py-3 text-left font-medium text-sm">URL</th>
                                                            <th className="px-4 py-3 text-left font-medium text-sm">Status</th>
                                                            <th className="px-4 py-3 text-left font-medium text-sm">Created at</th>
                                                            <th className="w-8 px-4 py-3"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {websites.map((website, index) => (
                                                            <tr key={website.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                                <td className="px-4 py-3">
                                                                    <input type="checkbox" className="rounded" />
                                                                </td>
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
                                                                <td className="px-4 py-3 text-right">
                                                                    <button className="text-gray-400 hover:text-gray-500">
                                                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                                                            <path d="M12 12V12.01M12 6V6.01M12 18V18.01M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    </button>
                                                                </td>
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
                                                            <th className="w-8 px-4 py-3 text-left">
                                                                <input type="checkbox" className="rounded" />
                                                            </th>
                                                            <th className="px-4 py-3 text-left font-medium text-sm">Name</th>
                                                            <th className="px-4 py-3 text-left font-medium text-sm">Status</th>
                                                            <th className="px-4 py-3 text-left font-medium text-sm">Created at</th>
                                                            <th className="w-8 px-4 py-3"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {documents.map((doc, index) => (
                                                            <tr key={doc.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                                <td className="px-4 py-3">
                                                                    <input type="checkbox" className="rounded" />
                                                                </td>
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
                                                                <td className="px-4 py-3 text-right">
                                                                    <button className="text-gray-400 hover:text-gray-500">
                                                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                                                            <path d="M12 12V12.01M12 6V6.01M12 18V18.01M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    </button>
                                                                </td>
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

                    {/* URL Input Modal */}
                    {showUrlModal && (
                        <div className="fixed inset-[-31px] flex items-center justify-center bg-black bg-opacity-30 z-50">
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

                                    <button
                                        onClick={handleAddUrlInput}
                                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                                        disabled={isUploading || urlInputs.length >= 10}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Another URL
                                    </button>
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowUrlModal(false);
                                            setUrlInputs([""]);
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
                                        ) : null}
                                        {isUploading ? 'Uploading...' : 'Upload'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PDF Upload Modal */}
                    {showPdfModal && (
                        <div className="fixed inset-[-31px] flex items-center justify-center bg-black bg-opacity-30 z-50">
                            <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-auto shadow-lg">
                                <h3 className="text-lg font-medium mb-4">Upload PDF Documents</h3>
                                <p className="text-sm text-gray-500 mb-6">Train your Bay AI with knowledge from PDF documents</p>

                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            multiple
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            id="pdf-upload"
                                            disabled={isUploading}
                                        />
                                        <label
                                            htmlFor="pdf-upload"
                                            className="flex flex-col items-center justify-center cursor-pointer"
                                        >
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                                            <p className="text-xs text-gray-500">PDF files only</p>
                                        </label>
                                    </div>

                                    {selectedFiles.length > 0 && (
                                        <div className="space-y-2">
                                            {selectedFiles.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                    <span className="text-sm truncate">{file.name}</span>
                                                    <button
                                                        onClick={() => handleRemoveFile(index)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                        disabled={isUploading}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowPdfModal(false)}
                                        disabled={isUploading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handlePdfSubmit}
                                        className="bg-black text-white hover:bg-gray-800"
                                        disabled={isUploading || selectedFiles.length === 0}
                                    >
                                        {isUploading ? (
                                            <LoadingSpinner size="sm" />
                                        ) : null}
                                        {isUploading ? 'Uploading...' : 'Upload'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Restriction Modal */}
                    {showRestrictionsModal && (
                        <div className="fixed inset-[-31px] flex items-center justify-center bg-black bg-opacity-30 z-50">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto shadow-lg">
                                <div className="flex justify-center mb-4">
                                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                    </div>
                                </div>

                                <h3 className="text-lg font-medium text-center mb-4">Restrictions of Bay AI</h3>

                                <p className="text-sm text-gray-600 mb-4">
                                    Bay AI is explicitly forbidden from being used in the following areas:
                                </p>

                                <p className="text-sm text-gray-600 mb-4">
                                    Weapons and Military, Adult Content, Political Campaigns, Gambling and betting.
                                </p>

                                <p className="text-sm text-gray-600 mb-4">
                                    By clicking the "Accept" button I confirm that I understand and agree to abide by these limitations.
                                </p>

                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleAcceptRestrictions}
                                        className="bg-black text-white hover:bg-gray-800"
                                    >
                                        Accept
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Activation Confirmation Modal */}
                    {showActivationModal && (
                        <div className="fixed inset-[-31px] flex items-center justify-center bg-black bg-opacity-30 z-50">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto shadow-lg">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold mb-6">Bay AI</h2>

                                    <div className="flex justify-center">
                                        <div className="flex gap-1 mb-6">
                                            {Array(20).fill(0).map((_, i) => (
                                                <div key={i} className="w-2 h-2 bg-gray-200 rounded-full"></div>
                                            ))}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-medium mb-4">Bay AI is active now</h3>

                                    <p className="text-sm text-gray-600 mb-6">
                                        The AI support agent can now answer visitor questions using knowledge you provided.
                                    </p>

                                    <h4 className="font-medium text-left mb-2">What's next:</h4>

                                    <div className="space-y-4 text-left mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-gray-500" />
                                            </div>
                                            <p className="text-sm">Control Bay AI conversations in the Inbox/operator view</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-gray-500" />
                                            </div>
                                            <p className="text-sm">Monitor and analyze Bay AI performance</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-gray-500" />
                                            </div>
                                            <p className="text-sm">Continue to enhance Lynn's knowledge to improve its responses</p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleActivationDone}
                                        className="bg-black text-white hover:bg-gray-800 w-full"
                                    >
                                        Done
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
            </ContentSection>
        </div>
    );
} 