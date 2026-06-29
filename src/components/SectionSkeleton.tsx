interface SectionSkeletonProps {
  height?: string;
}

/** Generic skeleton used as Suspense fallback for lazy sections. */
export default function SectionSkeleton({
  height = 'h-96',
}: SectionSkeletonProps) {
  return (
    <div
      className={`${height} w-full flex items-center justify-center bg-black/40`}
      aria-hidden="true"
    >
      <div className="w-8 h-8 border-2 border-shark-blue/40 border-t-shark-blue rounded-full animate-spin" />
    </div>
  );
}
