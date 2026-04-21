interface Props {
    label: string;
    value: any;
    onCopy?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isRed?: boolean;
}

export default function InfoItem({ label, value, onCopy, isRed = false }: Props) {
    return (
        <div>
            <label className="text-[12px] font-bold text-gray-500 block">{label}:</label>
            <div className="flex items-center justify-between group">
                <span className={`text-sm font-bold uppercase ${isRed ? 'text-red-600' : 'text-gray-800'}`}>
                    {value}
                </span>
            </div>
        </div>
    )
};