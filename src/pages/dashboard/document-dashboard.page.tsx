import TemplateWorkday from "components/templates/template-workday.component";
import useWorkday from "hooks/useWorkday.hook";
import React, { useState } from "react";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import { CenterPageLoader } from "components/loaders";
import { ChevronDown, ChevronRight, Download } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";
import { getPdfMonthApi } from "api/workday/get-pdf-month.api";
import { NavigateFunction, useNavigate } from "react-router-dom";
import useAuthentification from "hooks/useAuthentification.hook";

const DocumentDashboardPage: React.FC = () => {
    const { workdayContext } = useWorkday();

    const navigate: NavigateFunction = useNavigate()
    const { authentification, setAuthentification } = useAuthentification()

    const downloadWorkdayFile = async (month: number, year: number, setLoading: Function) => {
        setLoading(true)
        const response = await getPdfMonthApi({ month: month, year: year }, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })
        setLoading(false)

        if (response.success && response.data) {
            // Créer une URL pour le Blob
            const url = URL.createObjectURL(response.data);

            // Créer un élément de lien (a) et l'ajouter au document
            const link = document.createElement('a');
            link.href = url;
            link.download = "plannify-journee-" + year + "-" + month + ".pdf";

            // Append link to the body, trigger click, and then remove it
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Libérer l'URL après un court délai
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }
    }

    return (
        <TemplateWorkday title="Documents" selectedSection={NavBarSection.PDF}>
            {
                workdayContext.pdfPeriods.loading ?
                <CenterPageLoader content="Récupération de vos documents" /> :
                <div className="py-2 px-4 mt-[20px] w-full">
                    {
                        workdayContext.pdfPeriods.data.length === 0 ?
                        <div className="absolute right-1/2 top-1/2 w-full -translate-y-1/2 translate-x-1/2">
                            <p className="text-center dark:text-white">Aucun document disponible.</p>
                        </div> : (
                            <div className="flex flex-col gap-4">
                                {
                                    workdayContext.pdfPeriods.data
                                    .map(period => period.year)
                                    .sort((a, b) => b - a)
                                    .filter((value: number, index: number, self) => self.indexOf(value) === index)
                                    .map((period: number, index: number) => (
                                        <YearPeriod key={index} year={period} months={workdayContext.pdfPeriods.data.filter(p => p.year === period).map(p => p.month)} downloadWorkdayFile={downloadWorkdayFile} />
                                    ))
                                }
                                <div className="h-40"></div>
                            </div>
                        )
                    }
                </div>
            }
        </TemplateWorkday>
    )
}

const YearPeriod: React.FC<{ year: number, months: number[], downloadWorkdayFile: (month: number, year: number, setLoading: Function) => {} }> = ({ year, months, downloadWorkdayFile }) => {
    const [showFiles, setShowFiles] = useState<boolean>(new Date().getFullYear() === year);

    return (
        <div>
            <p className="text-left dark:text-white flex flex-row items-center gap-2 cursor-pointer" onClick={() => setShowFiles(prev => !prev)}>Année {year} { showFiles ? <ChevronDown /> : <ChevronRight /> }</p>
            <div className={"flex flex-col gap-3 items-center mt-3 " + (showFiles ? 'block' : 'hidden')}>
                {
                    months.sort((a, b) => a - b).map((month, index) => (
                        <MonthFile key={index} year={year} month={month} downloadWorkdayFile={downloadWorkdayFile} />
                    ))
                }
            </div>
        </div>
    )
}

const MonthFile: React.FC<{ year: number, month: number, downloadWorkdayFile: (month: number, year: number, setLoading: Function) => {} }> = ({ year, month, downloadWorkdayFile }) => {
    const [loading, setLoading] = useState<boolean>(false)

    const monthsString: string[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

    return (
        <div className="text-left w-[90%] text-base flex flex-row justify-between p-3 items-center bg-white border border-[#DADADA] dark:bg-[#141f30] dark:text-white dark:border-black rounded-lg cursor-pointer" onClick={() => downloadWorkdayFile(month, year, setLoading)}>
            <p>{monthsString[month - 1]} {year}</p>
            {
                loading ?
                <ThreeDots
                    visible={true}
                    height="20"
                    width="20"
                    color="#101820"
                    radius="3"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{ display: 'inline-block' }}
                    wrapperClass=""
                /> :
                <div className="flex flex-row items-center gap-2">
                    <p>Télécharger</p>
                    <Download />
                </div>
            }
        </div>
    )
}

export default DocumentDashboardPage