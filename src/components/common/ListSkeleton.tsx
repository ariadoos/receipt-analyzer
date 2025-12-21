import { Skeleton } from "@/components/ui/skeleton"

type ListSkeletonProps = {
    count?: number
    height?: string
    width?: string
    className?: string
}

const ListSkeleton = ({
    count = 3,
    height = "80px",
    width = "100%",
    className = "",
}: ListSkeletonProps) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: count }).map((_, i) => {
                return (
                    <Skeleton
                        key={i}
                        style={{ height, width }}
                    />
                )
            })}
        </div>
    )
}

export default ListSkeleton
