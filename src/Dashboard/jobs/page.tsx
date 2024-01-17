'use client';
import { IoIosAdd } from "react-icons/io";
import { AddButton, ContentSection, FooterSection, HeaderWithSearch, MainDashboardView, Modal, StyledButton, Table } from "../../shared";
import { TextField } from "@mui/material";
import { JobsViewTableType } from "../../shared";
import { useEffect, useState } from "react";
import { theme } from "../../settings.json";
import { createJob, getAllJobs } from "./api";

function JobsView() {
    const [tableJobsList, setTableJobsList] = useState<JobsViewTableType[]>([]);
    const [tableInmutableJobsList, setTableInmutableJobsList] = useState<JobsViewTableType[]>([]);
    const [searchJob, setSearchJob] = useState<string>("");
    const [openCreateJob, setOpenCreateJob] = useState<boolean>(false);
    const [createJobFormInputs, setCreateJobFormInputs] = useState({
        idBot: "",
        nombre: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        estado: ""
    });

    const onInputChangeCreateJobs = (key: string, value: string) => {
        setCreateJobFormInputs(prevState => { return { ...prevState, [key]: value } })
    }

    const headers: { key: string, text: string }[] =
        [
            // { key: "idBob", text: "Job id" },
            { key: "idBot", text: "Bot id" },
            { key: "nombre", text: "Nombre" },
            { key: "descripcion", text: "Descripcion" },
            { key: "fechaInicio", text: "Fecha de inicio" },
            { key: "fechaFin", text: "Fecha de fin" },
            { key: "estado", text: "Estado" },
        ];


    const filterJobs = (string: string) => {
        const l = tableInmutableJobsList.filter(job =>
            job.idJob.toLowerCase().includes(string.toLowerCase()) ||
            job.idBot.toLowerCase().includes(string.toLowerCase()) ||
            job.nombre.toLowerCase().includes(string.toLowerCase()) ||
            job.descripcion.toLowerCase().includes(string.toLowerCase()) ||
            job.fechaInicio.toLowerCase().includes(string.toLowerCase()) ||
            job.fechaFin.toLowerCase().includes(string.toLowerCase()) ||
            job.estado.toLowerCase().includes(string.toLowerCase())
        );
        setTableJobsList(l);
    }

    const setActions = (data: (JobsViewTableType)[]) => {
        data = data.map(job => {
            return { ...job } // this is left for next develops (see in bots/page.jsx the implementation of actions)
        })

        return data;
    }

    const getAllJobsV = () => {
        getAllJobs()
            .then((data) => {
                setTableJobsList(setActions(data));
                setTableInmutableJobsList(setActions(data));
            })
            .catch(e => console.log("error en la promise", e));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { getAllJobsV(); }, []);

    return <MainDashboardView>
        <HeaderWithSearch>
            <h1>Jobs</h1>
            <form onSubmit={e => {
                e.preventDefault();
                filterJobs(searchJob);
            }}>
                <TextField autoComplete="new-password" id="search-input" color="warning" label="Buscar job" variant="standard"
                    onChange={e => setSearchJob(e.target.value)} />
                <StyledButton theme={theme}>Buscar</StyledButton>
            </form>
        </HeaderWithSearch>
        <ContentSection>
            <Table headers={headers} rows={tableJobsList} emptyText="No hay jobs" />
        </ContentSection>
        <FooterSection>
            <AddButton onClick={() => setOpenCreateJob(true)} theme={theme}>
                <IoIosAdd size="2rem" />
                <h3>AÑADIR JOB</h3>
            </AddButton>
        </FooterSection>
            <TextField 
                type="date"
                onChange={e => console.log(e.target.value)}
                variant="standard"
            />

        <Modal 
            open={openCreateJob}
            onClose={() => setOpenCreateJob(false)}
            applyButtonText="CREAR JOB"
            title="Completar los datos del nuevo Job"
            onSubmit={(e) => {
                e.preventDefault();
                
                createJob(createJobFormInputs)
                    .then(() => { alert("Job creado exitosamente");  getAllJobsV(); setOpenCreateJob(false); })
                    .catch(() => alert("Ha ocurrido un error inesperado. Revise los datos y vuelva a intentarlo"))
            }}
            formInputs={createJobFormInputs}
            formInputsType={{ fechaInicio: "date", fechaFin: "date" }}
            onInputChange={onInputChangeCreateJobs}
        />
    </MainDashboardView>
}

export default JobsView;