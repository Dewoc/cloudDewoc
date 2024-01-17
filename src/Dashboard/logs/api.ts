import { LogsType, LogsViewTableType } from "../../shared";
import { post } from "../../shared/api/index.u";
import { LogListResData } from "../../shared/api/types.u";

function parseDataForFront(userList: LogsType[]) {
    const headers: string[] = ["id_job", "time", "process_name", "machine", "message"]

    const logsUserList: LogsViewTableType[] = userList.map(logObj => {
        const row: any = {};

        headers.forEach(key => { row[key] = logObj[(key as keyof LogsType)] ? logObj[(key as keyof LogsType)] : "-"; });

        return (row as LogsViewTableType);
    })

    return logsUserList;
}

export async function getAllLogs(): Promise<LogsViewTableType[]> {
    try {
        const { data: logsList } = await post<LogListResData>("/logs/list", {})

        return parseDataForFront(logsList);
    } catch (e) {
        return []
    }
}