export function LoadingSpinner({ size = 'md', text = 'Loading...', fullScreen = false }) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    }

    const spinnerContent = (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="relative">
                {/* Outer spinning ring */}
                <div className={`${sizeClasses[size]} border-4 border-t-blue-500 border-r-blue-500 border-b-gray-200 border-l-gray-200 rounded-full animate-spin`} />

                {/* Inner pulsing dot */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-blue-500 rounded-full animate-pulse`} />
            </div>
            {text && (
                <p className={`mt-4 text-sm text-gray-600 ${size === 'lg' ? 'text-base' : ''}`}>
                    {text}
                </p>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
                {spinnerContent}
            </div>
        )
    }

    return spinnerContent
} 