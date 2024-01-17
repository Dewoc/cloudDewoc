import { BotInputType, BotInputViewTableType } from "../../../shared";
import { post } from "../../../shared/api/index.u";
import { BotInputListResData, UpdateBotInputResData } from "../../../shared/api/types.u";

export async function createBotInput(reqParams: any) {
    try {
        let body = reqParams;
        console.log("BODY OF REQ", body);
        
        await post("/inputs/add", body);

        return { message: "Bot creado exitosamente" };
    } catch (e) {
        return e;
    }
}

export async function deleteBotInput(reqParams: any) {
    try {
        const { idBot, cuit } = reqParams;

        const backRes = await post("/inputs/delete", { idBot, cuit })
        console.log("REQ BODY:", idBot, cuit)
        console.log("BODY RES:", backRes)
        if(backRes.error) throw "Error " + backRes.errorMsg;

        return "Input eliminado correctamente";
    } catch (e) {
        return e;
    }
}

function parseDataForFront(botInputs: BotInputType[]) {
    const tableBotInputs: BotInputViewTableType[] = botInputs.map(input => { delete input["errors"]; return input; })

    return tableBotInputs;
}

export async function getAllBotInputs(reqParams: any): Promise<BotInputType[]> {
    try {
        const body: { idBot: string } = reqParams;

        const { data: botInputsList } = await post<BotInputListResData>("/inputs/list", { idBot: body.idBot });

        return parseDataForFront(Array.isArray(botInputsList) ? botInputsList : [botInputsList]);
    } catch (e) {
        return [];
    }
}

export async function updateBotInput(reqParams: any) {
    try {
        const body: { idBot: string, input: string, [key: string]: string } = reqParams;
        
        const { data: botInputData } = await post<UpdateBotInputResData>("/inputs/list", { idBot: body.idBot, input: body.input });
        
        const newBotInputData = { ...botInputData, ...body };
        await post<any>("/inputs/update", newBotInputData)

        return "Input actualizado correctamente";
    } catch (e) {
        return e;
    }
}