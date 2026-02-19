import { Skeleton } from "@/components/ui/skeleton"

export function ProductSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg bg-stone-200/50" />
            <div className="space-y-2 mt-4 text-center items-center flex flex-col">
                <Skeleton className="h-4 w-3/4 bg-stone-200/50" />
                <Skeleton className="h-3 w-1/2 bg-stone-200/50" />
            </div>
        </div>
    )
}
