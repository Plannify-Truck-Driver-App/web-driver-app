import FlatInformation from "./flat-information.component";
import moment from "moment";
import { PdfWorkdayMonthly } from "models/pdf-workday-monthly.model";
import { FileText } from "lucide-react";

interface PdfFileProps {
    file: PdfWorkdayMonthly,
    onClick?: () => void
}

const PdfFile: React.FC<PdfFileProps> = ({ file, onClick }) => {
    const months: string[] = ['de janvier', 'de février', 'de mars', 'd\'avril', 'de mai', 'de juin', 'de juillet', 'd\'août', 'de septembre', 'd\'octobre', 'de novembre', 'de décembre']
    
        return (
            <FlatInformation onClick={onClick}>
                <div className="flex justify-between items-center gap-2">
                    <p>{ file.fileName }</p>
                    <FileText color="#232B35" size={26} />
                </div>
                <div className="h-2"></div>
                <div className="w-full flex flex-row items-center gap-2">
                    <p>Un fichier PDF a déjà été généré pour le mois { months[file.month - 1] } { file.year }.</p>
                </div>
                <div className="h-2"></div>
                <p>Généré le : <span className="text-slate-600 dark:text-slate-400 text-right">{ moment(file.creationDate).format("DD/MM/YYYY HH:mm:ss") }</span></p>
            </FlatInformation>
        )
}

export default PdfFile