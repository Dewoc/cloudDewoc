import { UserLoginResData } from "../shared/api/types.u";
import { loginRequest, post } from "../shared/api/index.u";
import { LoginResData, setLocalStorage } from "../shared";

async function getUserType(email: string) : Promise<UserLoginResData>{
    return await post<UserLoginResData>("/login/list", { email });
}

export default async function loginHandler(loginParams: { email: string, password: string }) : Promise<LoginResData>{
    try {
        const { email, password } = loginParams;
        const fullRes = await loginRequest("/login/in", email, password);

        const { data: user } = await getUserType(email);
        setLocalStorage("userData", user);

        return fullRes;
    } catch(e: any){
        return e;
    }
}