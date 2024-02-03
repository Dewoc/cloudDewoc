import { BASE_URL } from "../../../settings.json";
import { GeneralResData, LoginResData } from "../../types";
import { getLocalStorage, setLocalStorage } from "../..";



export async function post<ResData extends GeneralResData>(endpoint: string, bodyParams: { [key: string]: string }): Promise<ResData> {
    const body = new URLSearchParams();
    const url = BASE_URL + endpoint;
    const token = getLocalStorage<{ token: string }>("access_token").token;

    Object.keys(bodyParams).map(key => body.set(key, bodyParams[key]))

    const dataResponse = await fetch(url, { 
            method: "POST", 
            headers: { "Authorization": `Bearer ${token}` }, 
            body
        }).then(res => res.json())
            .then((data: ResData) => { 
                if(data.error) throw { error: data.error, message: data.errorMsg };
                else return data;
            })

    return dataResponse;
};

export async function loginRequest(endpoint: string, email: string, password: string): Promise<LoginResData> {
    const body = new URLSearchParams({ email, password });
    const url = BASE_URL + endpoint;

    const dataReponse = await fetch(url, { method: "POST", body })
        .then(res => res.json())
            .then((fullRes: LoginResData) => {
                if(fullRes.error) throw { error: fullRes.error, errorMsg: fullRes.errorMsg };
                else {
                    setLocalStorage("access_token", { token: fullRes.data[0].token });
                    return fullRes;
                }
            })

    return dataReponse;
};