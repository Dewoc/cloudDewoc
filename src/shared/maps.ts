// Match the "idRol" with its meaning in the application.
export const ROLES = {
    1: "administrador",
    2: "cliente",
    3: "cliente_operador"
}

export function getUserRolString(idRol: "1" | "2" | "3"): string{
    const map = {
        "1": "Administrador",
        "2": "Cliente",
        "3": "Cliente operador",
    }

    return map[idRol]
}