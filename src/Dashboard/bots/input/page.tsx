'use client'

import { useEffect, useState } from "react";
import { BotInputViewTableType, BotsViewTableType } from "../../../shared";
import { ActionButton, AddButton, ContentSection, FooterSection, HeaderSection, MainDashboardView, Modal, Table, getLocalStorage } from "../../../shared";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { theme } from "../../../settings.json";
import { createBotInput, deleteBotInput, getAllBotInputs, updateBotInput } from "./api";
import styled from "styled-components";

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
        cuit: ""
    });
    const [editInputBotFormInputs, setEditInputBotFormInputs] = useState({
        idBot: "",
        cuit: ""
    });

    const onInputChangeCreateInputBot = (key: string, value: string) => {
        setCreateInputBotFormInputs(prevState => { return { ...prevState, [key]: value } })
    }

    const onInputChangeEditInputBot = (key: string, value: string) => {
        setEditInputBotFormInputs(prevState => { return { ...prevState, [key]: value } })
    }

    const setActions = (data: (BotInputViewTableType)[]) => {
        data = data.map((l) => {
            return {
                ...l,
                actionEdit: <ActionButton onClick={() => {
                    setEditInputBotFormInputs({ idBot: l.idBot, cuit: l.cuit });
                    let currentInputData = JSON.parse(l.input)

                    currentInputData = currentInputData.map((i: any, index: number) => {
                        return {
                            ...i,
                            actionEdit: <ActionButton onClick={() => {
                                setOpenEditInsideTable(true);
                                setNewInputData({ key: i.key, value: i.value, index });
                                setOpenNewInputData(true);
                            }} ><MdEdit /></ActionButton>
                        }
                    });

                    setEditInputData(currentInputData);
                    setOpenEditInputBot(true);
                }}><MdEdit /></ActionButton>,
                actionDelete: <ActionButton onClick={() => {
                    deleteBotInput({ idBot: l.idBot, cuit: l.cuit })
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
            .catch(() => alert("Ocurrió un error inesperado"));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { getAllBotInputsV(); }, []);

    const [createInputData, setCreateInputData] = useState<{ key: string, value: string }[] | {}[]>([{}]);

    const [editInputData, setEditInputData] = useState<{ key: string, value: string, [key: string]: string | JSX.Element }[] | {}[]>([{}]);

    const [openNewInputData, setOpenNewInputData] = useState(false)
    const [newInputData, setNewInputData] = useState<{ key: string, value: string, index?: number }>({ key: "", value: "" });

    const onInputChangeNewInputData = (key: string, value: string) => {
        setNewInputData(prevState => { return { ...prevState, [key]: value } })
    }

    const [openEditInsideTable, setOpenEditInsideTable] = useState(false);

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

                updateBotInput({
                    ...editInputBotFormInputs, input: JSON.stringify(Object.keys(editInputData[0]).length === 0 ? editInputData.slice(1) : editInputData.map((e) =>
                        // @ts-ignore
                        ({ key: e.key, value: e.value })))
                })
                    .then(() => { alert("Input actualizado exitosamente"); getAllBotInputsV(); setOpenEditInputBot(false); })
                    .catch(() => alert("Ocurrió un error al actualizar el input. Revise los datos ingresados"))
            }}
            title="Editar los datos del input"
            onInputChange={onInputChangeEditInputBot}
            formInputs={editInputBotFormInputs}
            applyButtonText="Actualizar Input"
            disabledKeys={["idBot"]}
        >
            <InputTableModalContainer>
                <div>
                    <h4>INPUTS</h4>
                    <button onClick={(e) => { e.preventDefault(); setOpenNewInputData(true); }}>Añadir</button>
                </div>
                <Table
                    headers={[{ key: "key", text: "Clave" }, { key: "value", text: "Valor" }, { key: "actionEdit", text: "Editar" }]}
                    rows={editInputData}
                    emptyText="No hay información para mostrar"
                    breakPagination={3}
                />
            </InputTableModalContainer>
        </Modal>

        <Modal
            open={openCreateInputBot}
            onClose={() => { setOpenCreateInputBot(false); setCreateInputData([{}]); setCreateInputBotFormInputs({ idBot: `${selectedBot.id}`, cuit: "" }) }}
            formInputs={createInputBotFormInputs}
            applyButtonText="Crear input"
            onSubmit={(e) => {
                e.preventDefault();
                createBotInput({ ...createInputBotFormInputs, input: JSON.stringify(createInputData.slice(1)) })
                    .then(() => { alert("Input creado exitosamente"); getAllBotInputsV(); setOpenCreateInputBot(false); setCreateInputData([{}]) })
                    .catch(() => alert("Ocurrió un error al crear el input. Revise los datos ingresados"))
            }}
            title="Completar los datos del input"
            onInputChange={onInputChangeCreateInputBot}
        >
            <InputTableModalContainer>
                <div>
                    <h4>INPUTS</h4>
                    <button onClick={(e) => { e.preventDefault(); setOpenNewInputData(true); }}>Añadir</button>
                </div>
                <Table
                    headers={[{ key: "key", text: "Clave" }, { key: "value", text: "Valor" }]}
                    rows={createInputData}
                    emptyText="No hay información para mostrar"
                    breakPagination={2}
                />
            </InputTableModalContainer>
        </Modal>

        {/* MODAL FOR EDIT PURPOSES */}
        <Modal open={openNewInputData} onClose={() => { setOpenNewInputData(false); setNewInputData({ key: "", value: "", index: undefined }); setOpenEditInsideTable(false); }}
            applyButtonText={openEditInsideTable ? "Actualizar" : "Añadir"}
            // @ts-ignore
            formInputs={newInputData}
            onInputChange={onInputChangeNewInputData}
            ignoreKeys={["index"]}
            onSubmit={(e) => {
                e.preventDefault();

                if (!openCreateInputBot && openEditInsideTable) {
                    setEditInputData(prevState => {
                        const prevStateDeepCopy = prevState.map(p => ({ ...p }));
                        // @ts-ignore
                        (prevStateDeepCopy[newInputData.index] = {
                            key: newInputData.key,
                            value: newInputData.value,
                            actionEdit: <ActionButton onClick={() => {
                                
                                setOpenEditInsideTable(true);
                                setNewInputData({ key: newInputData.key, value: newInputData.value, index: newInputData.index });
                                setOpenNewInputData(true);
                            }} ><MdEdit /></ActionButton>
                        });
                        return prevStateDeepCopy;
                    });
                }
                else if (openCreateInputBot) {
                    setCreateInputData(prevState => [...prevState, newInputData]);
                }
                else {
                    setEditInputData(prevState => [...prevState, {
                        key: newInputData.key,
                        value: newInputData.value,
                        actionEdit: <ActionButton onClick={() => {
                            setOpenEditInsideTable(true);
                            setNewInputData({ key: newInputData.key, value: newInputData.value, index: (prevState.length - 1) });
                            setOpenNewInputData(true);
                        }} ><MdEdit /></ActionButton>
                    }]);
                }
                setOpenEditInsideTable(false);
                setOpenNewInputData(false);
                setNewInputData({ key: "", value: "", index: undefined })
            }}
            title="Añadir información"
        />

    </MainDashboardView>
}

const InputTableModalContainer = styled.div`
    margin-top: 10px;

    & > table {
        width: 100%;
        margin-top: 10px;
    }
    
    & > div:first-child{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30px;

        & > button {
            outline: none;
            padding: 5px;
            cursor: pointer;
            border-radius: 4px;
        }
    }
`

export default Assets;