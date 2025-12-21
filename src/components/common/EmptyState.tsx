import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    description?: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-secondary-foreground mb-2">{title || "No items yet"}</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            {description || "Get started by adding a new item."}
        </p>
    </div>
);

export default EmptyState;