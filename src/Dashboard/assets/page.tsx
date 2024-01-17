import { useEffect, useState } from "react";
import { AssetsViewTableType } from "../../shared";
import { ActionButton, AddButton, ContentSection, FooterSection, HeaderSection, MainDashboardView, Modal, Table } from "../../shared";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { theme } from "../../settings.json";
import { createAsset, deleteAsset, getAllAssets, updateAsset } from "./api";

function Assets() {
    const headers: { key: string, text: string }[] =
        [
            { key: "id", text: "Id" },
            { key: "nombre", text: "Name" },
            { key: "actionEdit", text: "Edit" },
            { key: "actionDelete", text: "Delete" },
        ];

    const [tableAssetList, setTableAssetList] = useState<AssetsViewTableType[]>([]);
    const [openCreateAsset, setOpenCreateAsset] = useState<boolean>(false);
    const [openEditAsset, setOpenEditAsset] = useState<boolean>(false);

    const [createAssetFormInputs, setCreateAssetFormInputs] = useState({
        nombre: "",
        valor: ""
    });
    const [editAssetFormInputs, setEditAssetFormInputs] = useState({
        id: "",
        nombre: "",
        valor: ""
    });

    const onInputChangeCreateAsset = (key: string, value: string) => {
        setCreateAssetFormInputs(prevState => { return { ...prevState, [key]: value } })
    }

    const onInputChangeEditAsset = (key: string, value: string) => {
        setEditAssetFormInputs(prevState => { return { ...prevState, [key]: value } })
    }

    console.log("editAssetFormInputs", editAssetFormInputs)

    const setActions = (data: (AssetsViewTableType)[]) => {
        console.log("data en setActions", data)
        data = data.map(asset => {
            return {
                ...asset,
                actionEdit: <ActionButton onClick={() => { setEditAssetFormInputs(asset); setOpenEditAsset(true) }}><MdEdit /></ActionButton>,
                actionDelete: <ActionButton onClick={() => {
                    deleteAsset({ id: asset.id })
                        .then(() => {
                            alert("Input eliminado correctamente");
                            getAllAssetsV()
                           
                        })
                        .catch(() => alert("Ocurrió un error al eliminar el input, intentelo de nuevo más tarde"))
                }}><MdDelete /></ActionButton>
            }
        })

        return data;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { getAllAssetsV(); }, []);

    const getAllAssetsV = () => {
        getAllAssets()
            .then((data) => {
                setTableAssetList(setActions(data));
            })
            .catch(e => console.log("error en la promise", e));
    }
  
    return <MainDashboardView>
        <HeaderSection>
            <h1>Inputs</h1>
        </HeaderSection>
        <ContentSection>
            {/* // @ts-ignore */
                <Table headers={headers} rows={tableAssetList} emptyText="No hay assets" />
            }
        </ContentSection>
        <FooterSection>
            <AddButton onClick={() => setOpenCreateAsset(true)} theme={theme}>
                <IoIosAdd size="2rem" />
                <h3>AÑADIR INPUT</h3>
            </AddButton>
        </FooterSection>

        <Modal
            open={openEditAsset}
            onClose={() => setOpenEditAsset(false)}
            onSubmit={(e) => {
                e.preventDefault();
                updateAsset(editAssetFormInputs)
                    .then(() => { alert("Input actualizado exitosamente"); getAllAssetsV(); setOpenEditAsset(false); })
                    .catch(() => alert("Ocurrió un error al actualizar el input. Revise los datos ingresados"))
            }}
            title="Editar los datos del input"
            onInputChange={onInputChangeEditAsset}
            formInputs={editAssetFormInputs}
            applyButtonText="Actualizar Input"
            disabledKeys={["id"]}
        />

        <Modal
            open={openCreateAsset}
            onClose={() => setOpenCreateAsset(false)}
            formInputs={createAssetFormInputs}
            applyButtonText="Crear input"
            onSubmit={(e) => {
                e.preventDefault();
                createAsset(createAssetFormInputs)
                    .then(() => { alert("Input creado exitosamente"); getAllAssetsV(); setOpenCreateAsset(false); })
                    .catch(() => alert("Ocurrió un error al crear el input. Revise los datos ingresados"))
            }}
            title="Completar los datos del input"
            onInputChange={onInputChangeCreateAsset}
        />
    </MainDashboardView>
}

export default Assets;