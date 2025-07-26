import { Mail } from "models";
import { MailType } from "models/mail-type.model";
import FlatInformation from "./flat-information.component";
import moment from "moment";

interface MailInformationProps {
    mail: Mail,
    mailType: MailType | null | undefined
}

const MailInformation: React.FC<MailInformationProps> = ({ mail, mailType }) => {
    
        return (
            <FlatInformation
                borderColor={
                    mail.state === 'FAIL' ? '#FF0000' : (
                        mail.state === 'PENDING' ? '#D4691A' : (
                            mail.state === 'SUCCESS' && mail.sendDate === null ? '#26D41A' : undefined
                        )
                    )
                }
            >
                <div className="flex flex-row gap-2 justify-between items-center">
                    <p>{ mail.description }</p>
                    {
                        mail.state === 'PENDING' ? (
                            <span className="text-[#D4691A]">En cours</span>
                        ) : (
                            mail.state === 'FAIL' ? (
                                <span className="text-[#FF0000]">Echoué</span>
                            ) : (
                                mail.sendDate ? (
                                    <p className="text-slate-600 dark:text-slate-400 text-right text-sm">{ moment(mail.sendDate).format("DD/MM/YYYY HH:mm:ss") }</p>
                                ) : (
                                    <span className="text-[#26D41A]">Envoyé</span>
                                )
                            )
                        )
                    }
                </div>
                <div className="h-4"></div>
                <div className="w-full flex flex-row items-center gap-2">
                    <p>{ mail.content }</p>
                </div>
                <div className="h-4"></div>
                {
                    mailType ? <p>Type : <span className="text-slate-600 dark:text-slate-400">{ mailType.label }</span></p> : <></>
                }
                <p>E-mail : <span className="text-slate-600 dark:text-slate-400">{ mail.emailUsed }</span></p>
                {
                    mail.attachments.length > 0 && (
                        <>
                            <hr className="my-2" />
                            <p className="text-slate-600 dark:text-slate-400">Pièces jointes : { mail.attachments.length } fichier{ mail.attachments.length > 1 ? 's' : '' }</p>
                        </>
                    )
                }
                {
                    mail.state !== 'SUCCESS' && (
                        <div style={{
                            color: mail.state === 'FAIL' ? '#FF0000' : '#D4691A',
                        }}>
                            <hr style={{
                                borderColor: mail.state === 'FAIL' ? '#FF0000' : '#D4691A',
                                margin: '10px 0'
                            }} />
                            <p>Identifiant : <span className="text-slate-600 dark:text-slate-400">{ mail.mailId }</span></p>
                            <p>Créé le : <span className="text-slate-600 dark:text-slate-400">{ moment(mail.addDate).format("DD/MM/YYYY HH:mm:ss") }</span></p>
                        </div>
                    )
                }
            </FlatInformation>
        )
}

export default MailInformation