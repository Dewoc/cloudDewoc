'use client'
import { IoIosAdd } from "react-icons/io";

import { FormEvent, useEffect, useState } from "react";
import { ActionButton, getLocalStorage, UserType, UserViewTableType } from "../../shared";
import { theme } from "../../settings.json";
import { MdEdit, MdDelete } from "react-icons/md";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Table } from "../../shared";
import { AddButton, ContentSection, FooterSection, HeaderSection, MainDashboardView, StyledButton, StyledModal, StyledSubTitle } from "../../shared";
import { createUser, deleteUser, getAllUsers, updateUser } from "./api";

function Users() {
    const getUserData = () => getLocalStorage<UserType>("userData");

    const [tableUserList, setTableUserList] = useState<UserViewTableType[]>([]);
    const userData = getUserData();

    console.log("userData", userData)

    const headers: { key: string, text: string }[] =
        [
            { key: "apellido", text: "last name" },
            { key: "nombre", text: "name" },
            { key: "email", text: "email" },
            { key: "role", text: "Role" },
            { key: "actionEdit", text: "Edit" },
            { key: "actionDelete", text: "Delete" }
        ];

    const setActions = (data: (UserViewTableType)[]) => {

        data = data.map(user => {
            return {
                ...user,
                actionEdit: <ActionButton onClick={() => { setOpenEditUser(true); setEditUserFormInputs({ ...editUserFormInputs, ...user }); }}><MdEdit /></ActionButton>,
                actionDelete: <ActionButton onClick={() => {
                    deleteUser({ email: user.email })
                        .then(() => {
                            alert("Usuario eliminado correctamente");
                            getAllUsersV();
                        })
                        .catch(() => alert("Ocurrió un error al eliminar al usuario, intentelo de nuevo más tarde"))
                }}><MdDelete /></ActionButton>
            }
        })

        return data;
    }

    function getAllUsersV() {
        getAllUsers()
            .then((data) => { setTableUserList(setActions(data)); })
            .catch(e => console.log("error en la promise", e));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { getAllUsersV(); }, [])


    const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);
    const [openEditUser, setOpenEditUser] = useState<boolean>(false);
    const [createUserFormInputs, setCreateUserFormInputs] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        cuit: "",
        cargo: "",
        departamento: "",
        idRol: ""
    });
    const [editUserFormInputs, setEditUserFormInputs] = useState({
        id: "",
        nombre: "",
        apellido: "",
        cuit: "",
        cargo: "",
        departamento: ""
    });

    const onInputChangeCreateUser = (key: string, value: string) => {
        setCreateUserFormInputs(prevState => { return { ...prevState, [key]: value } })
    }

    const onInputChangeEditUser = (key: string, value: string) => {
        setEditUserFormInputs(prevState => { return { ...prevState, [key]: value } })
    }

    const onSubmitCreateUser = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("se envia loko: ", createUserFormInputs);

        createUser(createUserFormInputs)
            .then(() => { alert("Usuario creado correctamente"); setOpenCreateUser(false); getAllUsersV(); })
            .catch(() => alert("Datos no válidos. Revise los datos ingresados"))
    }

    const onSubmitEditUser = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateUser((editUserFormInputs as { id: string, [key: string]: string }))
            .then(() => { alert("Usuario actualizado exitosamente"); getAllUsersV(); setOpenEditUser(false); })
            .catch(() => alert("Ocurrió un error al actualizar el usuario. Revise los datos ingresados"))
    }

    return <MainDashboardView>
        <HeaderSection>
            <h1>Usuarios</h1>
        </HeaderSection>
        <ContentSection>
            <Table headers={headers} rows={tableUserList} emptyText="No hay usuarios" />
        </ContentSection>
        <FooterSection>
            {userData.idRol === "1" && <AddButton onClick={() => setOpenCreateUser(true)} theme={theme}>
                <IoIosAdd size="2rem" />
                <h3>AÑADIR USUARIO</h3>
            </AddButton>}
        </FooterSection>

        <Modal
            okButtonText="Actualizar usuario"
            onClose={() => setOpenEditUser(false)}
            open={openEditUser}
            onInputChange={onInputChangeEditUser}
            onSubmit={(e) => onSubmitEditUser(e)}
            title="Editar los datos del usuario"
        />

        <Modal
            okButtonText="CREAR USUARIO"
            onClose={() => setOpenCreateUser(false)}
            open={openCreateUser}
            onInputChange={onInputChangeCreateUser}
            onSubmit={onSubmitCreateUser}
            title="Completar los datos del nuevo usuario"
        >
            <FormControl fullWidth sx={{ marginTop: "20px"  }}>
                <InputLabel sx={{ transform:"translateX(0%)" }} id="select-label">Tipo de usuario</InputLabel>
                <Select
                    labelId="select-label"
                    id="simple-select"
                    value={createUserFormInputs.idRol}
                    required
                    label="Age"
                    onChange={e => onInputChangeCreateUser("idRol", (e.target.value as string))}
                    variant="standard"
                >
                    <MenuItem value={1}>Administrador</MenuItem>
                    <MenuItem value={2}>Cliente</MenuItem>
                    <MenuItem value={3}>Cliente operador</MenuItem>
                </Select>
            </FormControl>
        </Modal>
    </MainDashboardView>;
}


function Modal({ open, onClose, onSubmit, onInputChange, children, title, okButtonText }:
    {
        onClose: () => void, onSubmit: (e: FormEvent<HTMLFormElement>) => void, onInputChange: (fieldKey: string, newValue: string) => void,
        children?: React.JSX.Element, open: boolean, title: string,
        okButtonText: string
    }) {
    return <StyledModal
        open={open}
        onClose={onClose}
    >
        <Box component="section">
            <StyledSubTitle style={{ textAlign: "center" }}>
                {title}
                {/* Completar los datos del nuevo usuario */}
            </StyledSubTitle>
            <form autoComplete="off" onSubmit={onSubmit}>
                <TextField autoComplete="new-password-password" sx={{ marginTop: "10px" }} id="Nombre-input" required color="warning" label="Nombre" variant="standard"
                    onChange={e => onInputChange("nombre", e.target.value)} />

                <TextField autoComplete="new-password" sx={{ marginTop: "10px" }} id="Apellido-input" required color="warning" label="Apellido" variant="standard"
                    onChange={e => onInputChange("apellido", e.target.value)} />

                {/* <TextField autoComplete="new-password" sx={{ marginTop: "10px" }} id="Email-input" type="email" required color="warning" label="Email" variant="standard"
                    onChange={e => onInputChange("email", e.target.value)} /> */}
                {okButtonText === "CREAR USUARIO" &&
                    <>
                        <TextField autoComplete="new-password" sx={{ marginTop: "10px" }} id="Password-input" required type="password" color="warning" label="Password" variant="standard"
                            onChange={e => onInputChange("password", e.target.value)} />

                        <TextField autoComplete="new-password" sx={{ marginTop: "10px" }} id="Email-input" type="email" required color="warning" label="Email" variant="standard"
                            onChange={e => onInputChange("email", e.target.value)} />
                    </>
                }


                <TextField autoComplete="new-password" sx={{ marginTop: "10px" }}
                    id="Cuit-input" required color="warning" label="Cuit" variant="standard" type="number"
                    onChange={e => onInputChange("cuit", e.target.value)} />

                <TextField autoComplete="new-password" sx={{ marginTop: "10px" }} id="Cargo-input" required color="warning" label="Cargo" variant="standard"
                    onChange={e => onInputChange("cargo", e.target.value)} />

                <TextField autoComplete="new-password" sx={{ marginTop: "10px" }} id="Departamento-input" required color="warning" label="Departamento" variant="standard"
                    onChange={e => onInputChange("departamento", e.target.value)} />

                {children}
                <Box component="div" className="formButtonContainer">
                    <StyledButton theme={theme} onClick={onClose}>Cancelar</StyledButton>
                    <StyledButton theme={theme}>{okButtonText}</StyledButton>
                </Box>
            </form>
        </Box>
    </StyledModal>
}

export default Users;