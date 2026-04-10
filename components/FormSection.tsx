interface Props {
    title: string,
    children: any
}

export default function FormSection({title, children}: Props) {
    return (
        <div className="mb-6">
            <h3 className="text-blue-800 font-bold text-sm uppercase mb-3 border-b border-blue-200 pb-1">
                {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {children}
            </div>
        </div>
    )
}
