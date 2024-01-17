import { TriggersViewTableType } from "../../shared";
import { post } from "../../shared/api/index.u";
import { TriggersListResData, UpdateTriggerResData } from "../../shared/api/types.u";

export async function createTrigger(reqParams: { nombre: string, descripcion: string, cron: string, activo: string, fechaModificacion: string, fechaAlta: string }) {
    try {
        let body = reqParams;

        await post("/triggers/add", body);

        return { message: "Bot creado exitosamente" };
    } catch (e) {
        return e;
    }
};

function parseDataForFront(triggersList: TriggersViewTableType[]) {
    const headers: string[] = ["id", "nombre", "cron", "activo", "fechaAlta", "fechaModificacion", "descripcion"]

    const tableTriggersList: TriggersViewTableType[] = triggersList.map(trigger => {
        const row: any = {};

        headers.forEach(key => {
            if (key === "activo") row[key] = trigger[(key as keyof TriggersViewTableType)] === "1" ? "Si" : "No";
            else row[key] = trigger[(key as keyof TriggersViewTableType)];
        });

        return (row as TriggersViewTableType);
    })

    return tableTriggersList;
}

export async function getAllTriggers(): Promise<TriggersViewTableType[]> {
    try {
        const { data: triggersList } = await post<TriggersListResData>("/triggers/list", {})

        return parseDataForFront(triggersList);
    } catch (e) {
        return [];
    }
};


export async function updateTrigger(reqParams: { id: string, nombre: string, descripcion: string, cron: string, activo: string }) {
    try {
        const body: { id: string, [key: string]: string } = reqParams;

        const { data: triggerData } = await post<UpdateTriggerResData>("/bots/list", { id: body.id });

        const newTriggerData = { ...triggerData, ...body };

        await post<any>("/triggers/update", newTriggerData)

        return "Trigger actualizado correctamente";
    } catch (e) {
        return e;
    }
}