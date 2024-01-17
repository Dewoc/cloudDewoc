import { JobsViewTableType } from "../../shared";
import { post } from "../../shared/api/index.u";
import { JobListResData } from "../../shared/api/types.u";

export async function createJob(reqParams: { idBot: string, nombre: string, descripcion: string, fechaInicio: string, fechaFin: string, estado: string }) {
    try {
        let body = reqParams;

        await post("/jobs/add", body);

        return { message: "Job creado exitosamente" };
    } catch (e) {
        return e;
    }
}

export async function getAllJobs(): Promise<JobsViewTableType[]> {
    try {
        const { data: jobsList } = await post<JobListResData>("/jobs/list", {})

        return jobsList;
    } catch (e) {
        return [];
    }
}