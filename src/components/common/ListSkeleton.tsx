import { Skeleton } from "@/components/ui/skeleton"

type ListSkeletonProps = {
    count?: number
    height?: string
    width?: string
    className?: string
}

const ListSkeleton = ({
    count = 3,
    height = "16px",
    width = "100%",
    className = "",
}: ListSkeletonProps) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: count }).map((_, i) => {
                return (
                    <Skeleton
                        key={i}
                        className={`h-[${height}] w-[${width}]`}
                    />
                )
            })}
        </div>
    )
}

export default ListSkeleton
