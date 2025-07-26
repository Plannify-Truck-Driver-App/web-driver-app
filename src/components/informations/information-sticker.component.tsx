interface InformationStickerProps {
    label: string;
    borderColor: string;
    backgroundColor: string
}

const InformationSticker: React.FC<InformationStickerProps> = ({ label, borderColor, backgroundColor }) => {

    return (
        <span
            className={`border rounded px-1 py`}
            style={{
                color: borderColor,
                backgroundColor: backgroundColor,
                borderColor: borderColor
            }}
        >
            { label }
        </span>
    );
}

export default InformationSticker;