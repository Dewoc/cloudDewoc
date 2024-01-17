import { BotType, BotsViewTableType } from "../../shared";
import { post } from "../../shared/api/index.u";
import { BotListResData, UpdateBotResData } from "../../shared/api/types.u";

export async function createBot(reqParams: any) {
    try {
        let body = reqParams;
        console.log("BODY OF REQ", body);
        
        await post("/bots/add", body);

        return { message: "Bot creado exitosamente" };
    } catch (e) {
        return e;
    }
}

export async function deleteBot(reqParams: { id: string }) {
    try {
        const { id } = reqParams;

        await post("/bots/delete", { id })

        return "Bot eliminado correctamente";
    } catch (e) {
        return e;
    }
}

function parseDataForFront(botsList: BotType[]) {
    const headers: string[] = ["id", "nombre", "descripcion"];

    const tableBotsList: BotsViewTableType[] = botsList.map(bot => {
        const row: any = {};

        headers.forEach(key => {
            row[key] = bot[(key as keyof BotType)];
        });

        return (row as BotsViewTableType);
    })

    return tableBotsList;
}

export async function getAllBots(): Promise<BotsViewTableType[]> {
    try {
        const { data: botsList } = await post<BotListResData>("/bots/list", {})

        return parseDataForFront(botsList);
    } catch (e) {
        return [];
    }
}

export async function updateBot(reqParams: any) {
    try {
        const body: { id: string, [key: string]: string } = reqParams;
        
        const { data: botData } = await post<UpdateBotResData>("/bots/list", { id: body.id });
        
        const newBotData = { ...botData, ...body };

        await post<any>("/bots/update", newBotData)

        return "Bot actualizado correctamente";
    } catch (e) {
        return e;
    }
}