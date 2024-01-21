import { BotInputType, BotInputViewTableType } from "../../../shared";
import { post } from "../../../shared/api/index.u";
import { BotInputListResData, UpdateBotInputResData } from "../../../shared/api/types.u";

export async function createBotInput(reqParams: any) {
    let body = reqParams;
    console.log("BODY OF REQ", body);

    const r = await post("/inputs/add", body);
    if (r.error) throw r.errorMsg;

    return { message: "Bot creado exitosamente" };
}

export async function deleteBotInput(reqParams: any) {
    const { idBot, cuit } = reqParams;

    const backRes = await post("/inputs/delete", { idBot, cuit })
    console.log("REQ BODY:", idBot, cuit)
    console.log("BODY RES:", backRes)
    if (backRes.error) throw "Error " + backRes.errorMsg;

    return "Input eliminado correctamente";
}

function parseDataForFront(botInputs: BotInputType[]) {
    const tableBotInputs: BotInputViewTableType[] = botInputs.map(input => { delete input["errors"]; return input; })

    return tableBotInputs;
}

export async function getAllBotInputs(reqParams: any): Promise<BotInputType[]> {
    const body: { idBot: string } = reqParams;

    const { data: botInputsList } = await post<BotInputListResData>("/inputs/list", { idBot: body.idBot });

    return parseDataForFront(Array.isArray(botInputsList) ? botInputsList : [botInputsList]);
}

export async function updateBotInput(reqParams: any) {
    const body: { idBot: string, input: string, [key: string]: string } = reqParams;

    const { data: botInputData } = await post<UpdateBotInputResData>("/inputs/list", { idBot: body.idBot, input: body.input });

    const newBotInputData = { ...botInputData, ...body };
    const r = await post<any>("/inputs/update", newBotInputData)

    if (r.error) throw r.errorMsg;

    return "Input actualizado correctamente";
}