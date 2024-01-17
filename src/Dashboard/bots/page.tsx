'use client'

import { useEffect, useState } from "react";
import { BotsViewTableType, UserType } from "../../shared";
import { ActionButton, AddButton, ContentSection, FooterSection, HeaderWithSearch, MainDashboardView, Modal, StyledButton, Table, getLocalStorage, setLocalStorage } from "../../shared";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { theme } from "../../settings.json";
import { FaPlay } from "react-icons/fa";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createBot, deleteBot, getAllBots, updateBot } from "./api";

function Bots() {
    const getUserData = () => getLocalStorage<UserType>("userData");
    const userData = getUserData();

    const headers: { key: string, text: string }[] =
        [
            { key: "id", text: "Id" }, { key: "nombre", text: "Name" },
            { key: "descripcion", text: "Descripción" },
            { key: "actionInput", text: "Inputs" },
            { key: "actionPlay", text: "Play" },
            { key: "actionEdit", text: "Edit" },
            { key: "actionDelete", text: "Delete" },
        ];

    const [tableBotsList, setTableBotsList] = useState<BotsViewTableType[]>([]);
    const [tableInmutableBotList, setTableInmutableBotList] = useState<BotsViewTableType[]>([]);
    const [searchBot, setSearchBot] = useState<string>("");
    const [openCreateBot, setOpenCreateBot] = useState<boolean>(false);
    const [openEditBot, setOpenEditBot] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const [createBotFormInputs, setCreateBotFormInputs] = useState({
        nombre: "",
        precio: "",
        descripcion: ""
    });
    const [editBotFormInputs, setEditBotFormInputs] = useState({
        id: "",
        nombre: "",
        descripcion: ""
    });

    const onInputChangeCreateBots = (key: string, value: string) => {
        setCreateBotFormInputs(prevState => { return { ...prevState, [key]: value } })
    }

    const onInputChangeEditBot = (key: string, value: string) => {
        setEditBotFormInputs(prevState => { return { ...prevState, [key]: value } })
    }

    const setActions = (data: (BotsViewTableType)[]) => {
        console.log("data en setActions", data)
        data = data.map(bot => {
            return {
                ...bot,
                actionInput: <ActionButton onClick={() => {
                    setLocalStorage("botForInput", bot);
                    navigate("/dashboard/bots/input");
                }}>Input</ActionButton>,
                actionPlay: <ActionButton><FaPlay /></ActionButton>,
                actionEdit: <ActionButton onClick={() => { setEditBotFormInputs(bot); setOpenEditBot(true) }}><MdEdit /></ActionButton>,
                actionDelete: <ActionButton onClick={() => {

                    deleteBot({ id: bot.id })
                        .then(() => {
                            alert("Bot eliminado correctamente");
                            getAllBotsV();
                        })
                        .catch(() => alert("Ocurrió un error al eliminar al usuario, intentelo de nuevo más tarde"))
                }}><MdDelete /></ActionButton>
            }
        })

        return data;
    }
    const getAllBotsV = () => {
        getAllBots()
            .then((data) => {
                console.log("BOTS", data)
                setTableBotsList(setActions(data));
                setTableInmutableBotList(setActions(data));
            })
            .catch(e => console.log("error en la promise", e));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { getAllBotsV(); }, []);

    const filterBots = (string: string) => {
        const l = tableInmutableBotList.filter(bot => bot.descripcion.toLowerCase().includes(string.toLowerCase()) || bot.id.toLowerCase().includes(string.toLowerCase()) || bot.nombre.toLowerCase().includes(string.toLowerCase()));
        setTableBotsList(l);
    }


    return <MainDashboardView>
        <HeaderWithSearch>
            <h1>Bots</h1>
            <form onSubmit={e => {
                e.preventDefault();
                filterBots(searchBot);
            }}>
                <TextField autoComplete="new-password" id="search-input" color="warning" label="Buscar bot" variant="standard"
                    onChange={e => setSearchBot(e.target.value)} />
                <StyledButton theme={theme}>Buscar</StyledButton>
            </form>
        </HeaderWithSearch>
        <ContentSection>
            <Table headers={headers} rows={tableBotsList} emptyText="No hay bots" />
        </ContentSection>
        <FooterSection>
            {userData.idRol === "1" && <AddButton onClick={() => setOpenCreateBot(true)} theme={theme}>
                <IoIosAdd size="2rem" />
                <h3>AÑADIR BOT</h3>
            </AddButton>}
        </FooterSection>

        <Modal
            open={openEditBot}
            onClose={() => setOpenEditBot(false)}
            onSubmit={(e) => {
                e.preventDefault();

                updateBot(editBotFormInputs)
                    .then(() => { alert("Bot actualizado exitosamente"); getAllBotsV(); setOpenEditBot(false); })
                    .catch(() => alert("Ocurrió un error al actualizar el bot. Revise los datos ingresados"))
            }}
            title="Editar los datos del bot"
            onInputChange={onInputChangeEditBot}
            formInputs={editBotFormInputs}
            applyButtonText="Actualizar bot"
            disabledKeys={["id"]}
        />

        <Modal
            open={openCreateBot}
            onClose={() => setOpenCreateBot(false)}
            formInputs={createBotFormInputs}
            applyButtonText="Crear bot"
            onSubmit={(e) => {
                e.preventDefault();

                createBot(createBotFormInputs)
                    .then(() => { alert("Bot creado exitosamente"); getAllBotsV(); setOpenCreateBot(false); })
                    .catch(() => alert("Ocurrió un error al crear el bot. Revise los datos ingresados"))
            }}
            title="Completar los datos del bot"
            onInputChange={onInputChangeCreateBots}
        />
    </MainDashboardView>
}

export default Bots;