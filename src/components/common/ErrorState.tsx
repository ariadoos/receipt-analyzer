import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

interface ErrorStateProps {
    error: string;
    onRetry?: () => void
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-secondary-foreground mb-2">Something went wrong</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">{error}</p>
        {onRetry && (
            <Button onClick={onRetry} variant="outline">
                Try Again
            </Button>
        )}
    </div>
);

export default ErrorState;