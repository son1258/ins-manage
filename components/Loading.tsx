interface Props {
    stateShow: boolean
}
export default function Loading({stateShow}: Props) {
    if (!stateShow) return;
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-white border-t-[var(--global-main-color)] rounded-full animate-spin"></div>
        </div>
    )
}   