import { UserType, UserViewTableType, getUserRolString } from "../../shared";
import { UserListResData, post } from "../../shared/api/index.u";
import { UpdateUserResData } from "../../shared/api/types.u";

export async function createUser(reqParams: { nombre: string, apellido: string, email: string, password: string, cuit: string, cargo: string, departamento: string, idRol: string }) {
    try {
        let body = reqParams;
        
        await post("/login/add", { ...body, fechaVencimiento: "3000-01-01 00:00:00" });

        return { message: "Usuario creado exitosamente" };
    } catch (e) {
        return e;
    }
};


export async function deleteUser(reqParams: { email: string }) {
    try {
        const { email } = reqParams;

        await post("/login/delete", { email })

        return "Usuario eliminado correctamente";
    } catch (e) {
        return e;
    }
}

function parseDataForFront(userList: UserType[]) {
    const headers: string[] = ["apellido", "nombre", "email", "idRol", "id"];

    const tableUserList: UserViewTableType[] = userList.map(user => {
        const row: any = {};

        headers.forEach(key => {
            if(key === "idRol") row["role"] = getUserRolString(user["idRol"]);
            else row[key] = user[(key as keyof UserType)];
        });

        return (row as UserViewTableType);
    })

    return tableUserList;
}

export async function getAllUsers(): Promise<UserViewTableType[]> {
    try {
        const { data: userList } = await post<UserListResData>("/login/list", {})

        return parseDataForFront(userList);
    } catch (e) {
        return [];
    }
}


export async function updateUser(reqParams: { id: string, [key: string]: string }) {
    try {
        const body: { id: string, [key: string]: string } = reqParams;
        
        const { data: userData } = await post<UpdateUserResData>("/login/list", { id: body.id });
        
        const newUserData = { ...userData, ...body };

        console.log("BODY DE LOKURA", newUserData)

        await post<any>("/login/update", newUserData)

        return "Usuario actualizado correctamente";
    } catch (e) {
        return e;
    }
}