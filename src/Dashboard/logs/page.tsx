import { useEffect, useState } from "react";
import { LogsViewTableType } from "../../shared";
import { ContentSection, FooterSection, HeaderWithSearch, MainDashboardView, StyledButton, Table } from "../../shared";
import { theme } from "../../settings.json";
import { TextField } from "@mui/material";
import { getAllLogs } from "./api";

function Logs() {

    const headers: { key: string, text: string }[] =
    [
        { key: "id_job", text: "Job ID" },
        { key: "time", text: "Time" },
        { key: "process_name", text: "Process" },
        { key: "machine", text: "Machine" },
        { key: "message", text: "Message" }
    ];

    const [tableLogsList, setTableLogsList] = useState<LogsViewTableType[]>([]);
    const [tableInmutableLogsList, setTableInmutableLogsList] = useState<LogsViewTableType[]>([]);
    const [searchLog, setSearchLOg] = useState<string>("");

    const getAllLogsV = () => {
        getAllLogs()
            .then((data) => {
                console.log("TRIGGERS", data)
                setTableLogsList(data);
                setTableInmutableLogsList(data);
            })
            .catch(e => console.log("error en la promise", e));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { getAllLogsV(); }, []);

    const filterTriggers = (string: string) => {
        const l = tableInmutableLogsList.filter(trigger =>
            Object.values(trigger).some(v => (typeof v === "string" && v.toLowerCase().includes(string.toLowerCase())))
        );

        setTableLogsList(l);
    }


    return <MainDashboardView>
        <HeaderWithSearch>
            <h1>Logs</h1>
            <form onSubmit={e => {
                e.preventDefault();
                filterTriggers(searchLog);
            }}>
                <TextField autoComplete="new-password" id="search-input" color="warning" label="Buscar log" variant="standard"
                    onChange={e => setSearchLOg(e.target.value)} />
                <StyledButton theme={theme}>Buscar</StyledButton>
            </form>
        </HeaderWithSearch>
        <ContentSection>
            <Table headers={headers} rows={tableLogsList} emptyText="No hay logs" />
        </ContentSection>
        <FooterSection></FooterSection>
    </MainDashboardView>
}

export default Logs;