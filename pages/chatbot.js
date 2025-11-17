import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import axios from "axios";
import Image from "next/image";

const API_URL = "https://botapi.bayshorecommunication.org";
const API_KEY = "org_sk_dea9fa135aebfc9df317b55e87589372";

export default function ChatbotCustomization() {
    const [selectedColor, setSelectedColor] = useState("black");
    const [botBehavior, setBotBehavior] = useState("2");
    const [leadCapture, setLeadCapture] = useState(true);
    const [name, setName] = useState("Byewind");
    const [isUploading, setIsUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef(null);

    // Add state to track initial values
    const [initialValues, setInitialValues] = useState({
        name: "",
        selectedColor: "",
        leadCapture: true,
        botBehavior: "",
        avatarUrl: "",
        is_bot_connected: false
    });

    // Add state to track if any changes were made
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/chatbot/settings`, {
                    headers: {
                        'X-API-Key': API_KEY
                    }
                });

                console.log('chatbot settings', response.data);

                if (response.data.status === 'success') {
                    const settings = response.data.settings;
                    setName(settings.name);
                    setSelectedColor(settings.selectedColor);
                    setLeadCapture(settings.leadCapture);
                    setBotBehavior(settings.botBehavior);
                    if (settings.avatarUrl) {
                        setAvatarUrl(settings.avatarUrl);
                    }

                    // Store initial values
                    setInitialValues({
                        name: settings.name,
                        selectedColor: settings.selectedColor,
                        leadCapture: settings.leadCapture,
                        botBehavior: settings.botBehavior,
                        avatarUrl: settings.avatarUrl || '',
                        is_bot_connected: settings.is_bot_connected
                    });
                }
            } catch (error) {
                console.error('Load settings error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSettings();
    }, []);

    // Add effect to check for changes
    useEffect(() => {
        const currentValues = {
            name,
            selectedColor,
            leadCapture,
            botBehavior,
            avatarUrl,
            is_bot_connected: false
        };

        // Compare each field individually to handle URL comparisons properly
        const hasAnyChanges =
            name !== initialValues.name ||
            selectedColor !== initialValues.selectedColor ||
            leadCapture !== initialValues.leadCapture ||
            botBehavior !== initialValues.botBehavior ||
            avatarUrl !== initialValues.avatarUrl;

        setHasChanges(hasAnyChanges);
    }, [name, selectedColor, leadCapture, botBehavior, avatarUrl, initialValues]);

    const colorOptions = [
        { value: "black", bgClass: "bg-black" },
        { value: "red", bgClass: "bg-red-500" },
        { value: "orange", bgClass: "bg-orange-500" },
        { value: "blue", bgClass: "bg-blue-500" },
        { value: "pink", bgClass: "bg-pink-500" },
    ];

    const botBehaviorOptions = [
        { value: "2", label: "2 Sec" },
        { value: "5", label: "5 Sec" },
        { value: "10", label: "10 Sec" },
        { value: "15", label: "15 Sec" },
    ];

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                `${API_URL}/api/upload/upload-avatar`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-API-Key": API_KEY,
                    },
                }
            );

            if (response.data.status === "success") {
                const newAvatarUrl = response.data.url;
                setAvatarUrl(newAvatarUrl);
                // Don't auto-save after upload, let user decide to save changes
                setHasChanges(true);
            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const saveSettings = async (settings) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/chatbot/save-settings`,
                settings,
                {
                    headers: {
                        "X-API-Key": API_KEY,
                    },
                }
            );

            if (response.data.status === "success") {
                // Update initial values after successful save
                setInitialValues({
                    ...settings,
                    is_bot_connected: false
                });
                setHasChanges(false);
            }
        } catch (error) {
            console.error("Save settings error:", error);
        }
    };

    const handleSave = () => {
        if (!hasChanges) return;

        saveSettings({
            name,
            selectedColor,
            leadCapture,
            botBehavior,
            avatarUrl,
        });
    };

    if (isLoading) {
        return (
            <div className="w-full flex flex-col min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-600">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col ">
            <div className="flex-1 overflow-y-auto space-y-6 p-6">
                <div>
                    <h3 className="text-xl font-medium">Set up the chat widget</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-6">
                        Set up a chat widget to streamline communication, improve customer
                        satisfaction, and drive conversions with real-time assistance.
                    </p>
                </div>

                <div className="flex gap-8">
                    {/* Left side - Configuration */}
                    <div className="flex-1">
                        <Card className="p-6">
                            <div className="space-y-6">
                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium">
                                        Your Name
                                    </label>
                                    <input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>

                                {/* Color Scheme & Avatar */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">
                                        Color Scheme & Avatar
                                    </label>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex gap-2">
                                            {colorOptions.map((color) => (
                                                <button
                                                    key={color.value}
                                                    onClick={() => setSelectedColor(color.value)}
                                                    className={`w-8 h-8 rounded-full ${color.bgClass} flex items-center justify-center ${selectedColor === color.value
                                                        ? "ring-2 ring-offset-2 ring-black"
                                                        : ""
                                                        }`}
                                                >
                                                    {selectedColor === color.value && (
                                                        <svg
                                                            width="12"
                                                            height="12"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M20 6L9 17L4 12"
                                                                stroke="white"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                            <button
                                                className="px-4 py-1 text-sm border rounded-md"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploading}
                                            >
                                                {isUploading ? "Uploading..." : "Upload"}
                                            </button>
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                        />
                                    </div>
                                </div>

                                {/* Lead Capture */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Lead Capture</label>
                                    <div className="flex items-center mt-2">
                                        <div
                                            onClick={() => setLeadCapture(!leadCapture)}
                                            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${leadCapture ? "bg-blue-500" : "bg-gray-300"
                                                }`}
                                        >
                                            <div
                                                className={`absolute top-[2px] w-5 h-5 rounded-full bg-white transition-transform ${leadCapture ? "translate-x-6" : "translate-x-1"
                                                    }`}
                                            ></div>
                                        </div>
                                        <span className="ml-2 text-sm">On</span>
                                    </div>
                                </div>

                                {/* Bot Behavior */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">
                                        Bot Response Delay
                                    </label>
                                    <div className="flex gap-2">
                                        {botBehaviorOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => setBotBehavior(option.value)}
                                                className={`px-3 py-1 rounded-md text-sm ${botBehavior === option.value
                                                    ? "bg-black text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right side - Preview */}
                    <div className="w-[320px]">
                        <div className="sticky top-6">
                            <div className="relative">
                                <div className="w-[300px] h-[500px] bg-white rounded-xl shadow-lg border overflow-hidden">
                                    {/* Chat header */}
                                    <div
                                        className={`p-4 ${selectedColor === "black"
                                            ? "bg-black"
                                            : `bg-${selectedColor}-500`
                                            } text-white`}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                                                {avatarUrl ? (
                                                    <Image
                                                        src={avatarUrl}
                                                        alt="Avatar"
                                                        width={32}
                                                        height={32}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-black text-xs font-bold">BA</span>
                                                )}
                                            </div>
                                            <div className="ml-2">
                                                <p className="text-sm">
                                                    <span className="font-bold">{name}</span>
                                                </p>
                                                <p className="text-xs opacity-70">online conversation</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chat content */}
                                    <div className="p-4 h-[350px] flex flex-col justify-end">
                                        <div className="bg-gray-100 rounded-lg p-3 max-w-[75%] mb-2">
                                            <p className="text-sm text-black">
                                                Hi yes, David have found it, ask our concierge{" "}
                                                <span className="font-bold text-lg">👋</span>
                                            </p>
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
                                            <svg
                                                className="h-5 w-5 text-gray-400 absolute left-2"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <path
                                                    d="M19 13C19 16.866 15.866 20 12 20C8.13401 20 5 16.866 5 13C5 9.13401 8.13401 6 12 6C15.866 6 19 9.13401 19 13Z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                />
                                            </svg>
                                            <input
                                                type="text"
                                                placeholder="Type your message here..."
                                                className="flex-1 pl-8 pr-2 py-2 rounded-full border border-gray-200 outline-none text-sm"
                                            />
                                        </div>
                                        <button
                                            className={`ml-2 w-8 h-8 rounded-full ${selectedColor === "black"
                                                ? "bg-black"
                                                : `bg-${selectedColor}-500`
                                                } text-white flex items-center justify-center`}
                                        >
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M22 2L11 13"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M22 2L15 22L11 13L2 9L22 2Z"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom navigation */}
            <div className="flex justify-between py-4 border-t mt-4 px-6">
                <a href="#" className="text-sm text-blue-500 hover:underline">
                    Learn more about chatbot settings
                </a>
                <button
                    className={`px-4 py-2 ${hasChanges ? 'bg-black' : 'bg-gray-400'} text-white rounded-md`}
                    onClick={handleSave}
                    disabled={!hasChanges}
                >
                    {hasChanges ? 'Save Changes' : 'No Changes'}
                </button>
            </div>
        </div>
    );
} 