import { MainButton, SecondaryButton } from "components/buttons";
import { Selector } from "components/inputs";
import DateInput from "components/inputs/date.component";
import UpModal from "components/modals/up-modal.component";
import { MailType } from "models";
import moment from "moment";
import { useEffect, useState } from "react";

interface IMailFilterProps {
    params: {
        page: number,
        from: string | undefined,
        to: string | undefined,
        type: number | undefined,
        status: 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' | undefined
    },
    mailTypes: MailType[],
    toggleModal: () => void,
    updateParams: (params: { page: number, from: string | undefined, to: string | undefined, type: number | undefined, status: 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' | undefined }) => void
}

const MailFilter: React.FC<IMailFilterProps> = ({ params, mailTypes, toggleModal, updateParams }) => {

    const [p, setParams] = useState<{ page: number, from: string | undefined, to: string | undefined, type: number | undefined, status: 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' | undefined }>(params)
    const [useDates, setUseDates] = useState<boolean>(p.from !== undefined || p.to !== undefined)

    useEffect(() => {
        if (!useDates) {
            setParams(prev => ({...prev, from: undefined, to: undefined}))
        }
    }, [useDates])

    return (
        <UpModal onCancel={toggleModal}>
            <div className="flex flex-row items-center justify-between">
                <p>Filtres</p>
                <p className="cursor-pointer underline" onClick={toggleModal}>Annuler</p>
            </div>
            <div className="h-6"></div>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4" id="check-date" checked={useDates} onClick={(e) => setUseDates(e.currentTarget.checked)} />
                            <label htmlFor="check-date">Dates</label>
                        </div>
                        {
                            useDates && (
                                <div className="flex flex-row items-center justify-between gap-4 px-6">
                                    <DateInput value={p.from ?? moment().format('YYYY-MM-DD')} isError={false} inputType={'interactive'} onChange={(e) => setParams(prev => ({...prev, from: e.target.value }))} />
                                    <p>à</p>
                                    <DateInput value={p.to ?? moment().format('YYYY-MM-DD')} isError={false} inputType={'interactive'} onChange={(e) => setParams(prev => ({...prev, to: e.target.value }))} />
                                </div>
                            )
                        }
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>Type</p>
                        <Selector label={undefined} options={mailTypes ? [
                            { value: "all", label: "Tous" },
                            ...mailTypes.map((type: MailType) => ({ value: type.mailTypeId + '', label: type.label }))
                        ] : []} onChange={(value: string) => setParams(prev => ({...prev, type: value === "all" ? undefined : parseInt(value) }))} isError={false} defaultValue={p.type + ''} fullWidth={true} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>Statut</p>
                        <Selector label={undefined} options={[
                            { value: "all", label: "Tous" },
                            { value: "IN_PROGRESS", label: "En cours d'envoi" },
                            { value: "SUCCESS", label: "Réussi" },
                            { value: "FAILED", label: "Échoué" }
                        ]} onChange={(value: string) => setParams(prev => ({...prev, status: value === "all" ? undefined : value as 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' }))} isError={false} defaultValue={p.status as 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' } fullWidth={true} />
                    </div>
                </div>
                <div className="flex justify-around gap-4">
                    <SecondaryButton label="Effacer" isDisabled={false} isLoading={false} onClick={() => {updateParams({page: params.page, from: undefined, to: undefined, type: undefined, status: undefined}); toggleModal()}} />
                    <MainButton label="Filtrer" isDisabled={p.from === params.from && p.to === params.to && p.type === params.type && p.status === params.status} isLoading={false} onClick={() => {updateParams(p); toggleModal()}} />
                </div>
            </div>
        </UpModal>
    );
}

export default MailFilter;