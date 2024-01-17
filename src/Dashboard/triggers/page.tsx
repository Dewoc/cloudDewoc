import { useEffect, useState } from "react";
import { ActionButton, TriggersViewTableType, UserType } from "../../shared";
import { AddButton, ContentSection, FooterSection, HeaderWithSearch, MainDashboardView, Modal, StyledButton, Table, getLocalStorage } from "../../shared";
import { MdEdit } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { theme } from "../../settings.json";
import { createTrigger, getAllTriggers, updateTrigger } from "./api";

function Triggers() {
    const getUserData = () => getLocalStorage<UserType>("userData");
    const userData = getUserData();

    const headers: { key: string, text: string }[] =
        [
            { key: "id", text: "Id" },
            { key: "nombre", text: "Nombre" },
            { key: "descripcion", text: "Descripción" },
            { key: "cron", text: "Cron trigger" },
            { key: "activo", text: "Activo" },
            { key: "fechaAlta", text: "Fecha de alta" },
            { key: "fechaModificacion", text: "Fecha de modificación" },
            { key: "actionEdit", text: "Edit" }
        ];

    const [tableTriggersList, setTableTriggersList] = useState<TriggersViewTableType[]>([]);
    const [tableInmutableTriggersList, setTableInmutableTriggersList] = useState<TriggersViewTableType[]>([]);
    const [searchTrigger, setSearchTrigger] = useState<string>("");
    const [openCreateTrigger, setOpenCreateTrigger] = useState<boolean>(false);
    const [openEditTrigger, setOpenEditTrigger] = useState<boolean>(false);

    const [createTriggersFormInputs, setCreateTriggersFormInputs] = useState({
        nombre: "",
        descripcion: "",
        cron: "",
    });
    const [editTriggerFormInputs, setEditTriggerFormInputs] = useState({
        id: "",
        nombre: "",
        descripcion: "",
        cron: ""
    });

    const [activeCreateFormInput, setActiveCreateFormInput] = useState("");
    const [activeEditFormInput, setActiveEditFormInput] = useState("");
    console.log("activeEditFormInput", activeEditFormInput)

    const onInputChangeCreateTrigger = (key: string, value: string) => {
        setCreateTriggersFormInputs(prevState => { return { ...prevState, [key]: value } })
    }
    const onInputChangeEditTrigger = (key: string, value: string) => {
        setEditTriggerFormInputs(prevState => { return { ...prevState, [key]: value } })
    }

    const setActions = (data: (TriggersViewTableType)[]) => {
        data = data.map(trigger => {
            return {
                ...trigger,
                actionEdit: <ActionButton onClick={() => {
                    // @ts-ignore --
                    setEditTriggerFormInputs(trigger);
                    // --
                    setOpenEditTrigger(true);
                }}><MdEdit /></ActionButton>,
            }
        })
        return data;
    }
    const getAllTriggersV = () => {
        getAllTriggers()
            .then((data) => {
                console.log("TRIGGERS", data)
                setTableTriggersList(setActions(data));
                setTableInmutableTriggersList(setActions(data));
            })
            .catch(e => console.log("error en la promise", e));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { getAllTriggersV(); }, []);

    const filterTriggers = (string: string) => {
        console.log("strinb", string);

        const l = tableInmutableTriggersList.filter(trigger =>
            Object.values(trigger).some(v => (typeof v === "string" && v.toLowerCase().includes(string.toLowerCase())))
        );

        setTableTriggersList(l);
    }


    return <MainDashboardView>
        <HeaderWithSearch>
            <h1>Triggers</h1>
            <form onSubmit={e => {
                e.preventDefault();
                filterTriggers(searchTrigger);
            }}>
                <TextField autoComplete="new-password" id="search-input" color="warning" label="Buscar trigger" variant="standard"
                    onChange={e => setSearchTrigger(e.target.value)} />
                <StyledButton theme={theme}>Buscar</StyledButton>
            </form>
        </HeaderWithSearch>
        <ContentSection>
            <Table headers={headers} rows={tableTriggersList} emptyText="No hay triggers" />
        </ContentSection>
        <FooterSection>
            {userData.idRol === "1" && <AddButton onClick={() => setOpenCreateTrigger(true)} theme={theme}>
                <IoIosAdd size="2rem" />
                <h3>AÑADIR TRIGGER</h3>
            </AddButton>}
        </FooterSection>

        <Modal
            open={openCreateTrigger}
            onClose={() => setOpenCreateTrigger(false)}
            formInputs={createTriggersFormInputs}
            applyButtonText="Crear trigger"
            onSubmit={(e) => {
                e.preventDefault();

                createTrigger({ ...createTriggersFormInputs, activo: activeCreateFormInput, fechaModificacion: Date.now().toString(), fechaAlta: Date.now().toString() })
                    .then(() => { alert("Trigger creado exitosamente"); getAllTriggersV(); setOpenCreateTrigger(false); })
                    .catch(() => alert("Ocurrió un error al crear el trigger. Revise los datos ingresados"))
            }}
            title="Completar los datos del trigger"
            onInputChange={onInputChangeCreateTrigger}
        >
            <>
                <InputLabel required sx={{ marginTop: "10px" }} id="demo-simple-select-label">Activo</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={activeCreateFormInput}
                    required
                    label="Age"
                    onChange={e => setActiveCreateFormInput(e.target.value)}
                    variant="standard"
                >
                    <MenuItem value={1}>Si</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                </Select>
            </>
        </Modal>


        <Modal
            open={openEditTrigger}
            onClose={() => setOpenEditTrigger(false)}
            onSubmit={(e) => {
                e.preventDefault();
                updateTrigger({...editTriggerFormInputs, activo: activeEditFormInput })
                    .then(() => { alert("Trigger actualizado exitosamente"); getAllTriggersV(); setOpenEditTrigger(false); setActiveEditFormInput(""); })
                    .catch(() => alert("Ocurrió un error al actualizar el trigger. Revise los datos ingresados"))
            }}
            title="Editar los datos del trigger"
            onInputChange={onInputChangeEditTrigger}
            formInputs={editTriggerFormInputs}
            applyButtonText="Actualizar trigger"
            disabledKeys={["id", "fechaAlta"]}
            ignoreKeys={["fechaModificacion", "activo"]}
        >
            <>
                <InputLabel required sx={{ marginTop: "10px" }} id="demo-simple-select-label">Activo</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={activeEditFormInput}
                    required
                    label="Age"
                    onChange={e => setActiveEditFormInput(e.target.value)}
                    variant="standard"
                >
                    <MenuItem value={1}>Si</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                </Select>
            </>
        </Modal>
    </MainDashboardView>
}

export default Triggers;