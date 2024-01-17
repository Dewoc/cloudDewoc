'use client'

import { useEffect, useState } from "react";
import { BotInputViewTableType, BotsViewTableType } from "../../../shared";
import { ActionButton, AddButton, ContentSection, FooterSection, HeaderSection, MainDashboardView, Modal, Table, getLocalStorage} from "../../../shared";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { theme } from "../../../settings.json";
import { createBotInput, deleteBotInput, getAllBotInputs, updateBotInput } from "./api";

function Assets() {
    const selectedBot = getLocalStorage<BotsViewTableType>("botForInput");

    const headers: { key: string, text: string }[] =
        [
            { key: "idBot", text: "Id bot" }, 
            { key: "cuit", text: "Cuit" },
            { key: "input", text: "Input" },
            { key: "actionEdit", text: "Editar" },
            { key: "actionDelete", text: "Borrar" },
        ];

    const [tableInputBotList, setInputBotList] = useState<BotInputViewTableType[]>([]);
    const [openCreateInputBot, setOpenCreateInputBot] = useState<boolean>(false);
    const [openEditInputBot, setOpenEditInputBot] = useState<boolean>(false);
    
    const [createInputBotFormInputs, setCreateInputBotFormInputs] = useState({
        idBot: `${selectedBot.id}`,
        cuit: "",
        input: ""
    });
    const [editInputBotFormInputs, setEditInputBotFormInputs] = useState({
        idBot: "",
        cuit: "",
        input: ""
    });

    const onInputChangeCreateInputBot = (key: string, value: string) => {
        setCreateInputBotFormInputs(prevState => { return { ...prevState, [key]: value } })
    }

    const onInputChangeEditInputBot = (key: string, value: string) => {
        setEditInputBotFormInputs(prevState => { return { ...prevState, [key]: value } })
    }

    const setActions = (data: (BotInputViewTableType)[]) => {
        console.log("data en setActions", data)
        data = data.map(input => {
            return {
                ...input,
                actionEdit: <ActionButton onClick={() => { setEditInputBotFormInputs(input); setOpenEditInputBot(true) }}><MdEdit /></ActionButton>,
                actionDelete: <ActionButton onClick={() => {
                    deleteBotInput({ idBot: input.idBot, cuit: input.cuit })
                        .then(() => {
                            alert("Input eliminado correctamente");
                            getAllBotInputsV();
                        })
                        .catch(() => alert("Ocurrió un error al eliminar el input, intentelo de nuevo más tarde"))
                }}><MdDelete /></ActionButton>
            }
        })

        return data;
    }
    const getAllBotInputsV = () => {
        getAllBotInputs({ idBot: selectedBot.id })
            .then((data) => {
                setInputBotList(setActions(data));
            })
            .catch(e => console.log("error en la promise", e));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { getAllBotInputsV(); }, []);


    return <MainDashboardView>
        <HeaderSection>
            <h1>Bot inputs</h1>
        </HeaderSection>
        <ContentSection>
            <Table headers={headers} rows={tableInputBotList} emptyText="No hay inputs" />
        </ContentSection>
        <FooterSection>
            <AddButton onClick={() => setOpenCreateInputBot(true)} theme={theme}>
                <IoIosAdd size="2rem" />
                <h3>AÑADIR INPUT</h3>
            </AddButton>
        </FooterSection>

        <Modal
            open={openEditInputBot}
            onClose={() => setOpenEditInputBot(false)}
            onSubmit={(e) => {
                e.preventDefault();

                updateBotInput(editInputBotFormInputs)
                    .then(() => { alert("Input actualizado exitosamente"); getAllBotInputsV(); setOpenEditInputBot(false); })
                    .catch(() => alert("Ocurrió un error al actualizar el input. Revise los datos ingresados"))
            }}
            title="Editar los datos del input"
            onInputChange={onInputChangeEditInputBot}
            formInputs={editInputBotFormInputs}
            applyButtonText="Actualizar Input"
            disabledKeys={["idBot"]}
        />

        <Modal
            open={openCreateInputBot}
            onClose={() => setOpenCreateInputBot(false)}
            formInputs={createInputBotFormInputs}
            applyButtonText="Crear input"
            onSubmit={(e) => {
                e.preventDefault();
                createBotInput(createInputBotFormInputs)
                    .then(() => { alert("Input creado exitosamente"); getAllBotInputsV(); setOpenCreateInputBot(false); })
                    .catch(() => alert("Ocurrió un error al crear el input. Revise los datos ingresados"))
            }}
            title="Completar los datos del input"
            onInputChange={onInputChangeCreateInputBot}
        />
    </MainDashboardView>
}

export default Assets;