import { AssetsViewTableType } from "../../shared";
import { post } from "../../shared/api/index.u";
import { AssetsListResData } from "../../shared/api/types.u";

export async function createAsset(reqParams: { nombre: string, valor: string }) {
    try {
        let body = reqParams;
        console.log("BODY OF REQ", body);
        
        await post("/assets/add", body);

        return ({ message: "Input creado exitosamente" });
    } catch (e) {
        return e;
    }
}

export async function getAllAssets(): Promise<AssetsViewTableType[]> {
    try {
        const { data: assetsList } = await post<AssetsListResData>("/assets/list", {})

        return assetsList;
    } catch (e) {
        return [];
    }
}

export async function deleteAsset(reqParams: { id: string}) {
    try {
        const { id } = reqParams;
        

        await post("/assets/delete", { id })

        return "Bot eliminado correctamente";
    } catch (e) {
        return e;
    }
}

export async function updateAsset(reqParams: { id: string, [key: string]: string }) {
    try {
        const body: { id: string, [key: string]: string } = reqParams;
        
        const { data: assetData } = await post<any>("/assets/list", { id: body.id });
        
        const newAssetData = { ...assetData, ...body };

        await post<any>("/assets/update", newAssetData)

        return "Input actualizado correctamente";
    } catch (e) {
        return e;
    }
}