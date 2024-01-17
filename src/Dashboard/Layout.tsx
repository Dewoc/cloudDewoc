'use client';
import { FaRobot, FaUser, FaImage } from "react-icons/fa6";
import { TbSubtask } from "react-icons/tb";
import { GiSilverBullet } from "react-icons/gi";
import { FaInfoCircle } from "react-icons/fa";
import { theme } from "../settings.json";
import { IoLogOut } from "react-icons/io5";
import { DashboardLayout, SBItem, SideBar } from "./styled";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const TopBar = styled.section`
    background-color: ${props => props.theme.accentColor};
    grid-area: topbar;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;


    & > h2 {
        width: 10%;
        margin-left: 4.7%;
        height: fit-content;
        text-align: center;
        color: white;
        border-radius: 10px;
        font-size: 2rem;
    }

    & > h3 {
        display: flex;
        margin-right: 4.7%;
        align-items: center;
        gap: 10px;
        color: white;
        cursor: pointer;
        padding: 5px;


        &:hover { text-decoration: underline }
        & > h4 { font-size: 1rem; }
    }
`;

function Layout({ children: viewController }: { children: (currentView: number) => JSX.Element }){
    const [loading, setLoading] = useState(true);
    const [selectedView, setSelectedView] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => { setLoading(false) }, [])

    const addressablesViews = [
        { displayName: "Usuarios", Icon: ({size}: { size: string }) => <FaUser size={size} /> },
        { displayName: "Bots", Icon: ({size}: { size: string }) => <FaRobot size={size} /> },
        { displayName: "Triggers", Icon: ({size}: { size: string }) => <GiSilverBullet size={size} /> },
        { displayName: "Jobs", Icon: ({size}: { size: string }) => <TbSubtask size={size} /> },
        { displayName: "Assets", Icon: ({size}: { size: string }) => <FaImage size={size} /> },
        { displayName: "Logs", Icon: ({size}: { size: string }) => <FaInfoCircle size={size} /> },
    ];

    function SBItemList({ items }: { items: typeof addressablesViews }): JSX.Element{
        
        return <>
            {items.map(({ displayName, Icon }, k) => 
                <SBItem 
                    theme={theme} 
                    selected={k === selectedView} 
                    key={k} onClick={() => {
                        setSelectedView(k);
                        navigate("/dashboard")
                    }}>
                    {<Icon size="1.3rem" />}
                    <h3>{displayName}</h3>
                </SBItem> 
            )}
        </>
    };

    function logout(){
        localStorage.removeItem("access_token");
        localStorage.removeItem("userData");

        navigate("/login");
    }

    return !loading && <DashboardLayout>
            <TopBar theme={theme}>
                <h2> DEWOC </h2>
                <h3 onClick={() => logout()}>
                    <h4>CERRAR SESIÓN</h4>
                    <IoLogOut size="1.5rem" />
                </h3>
            </TopBar>
            <SideBar theme={theme}>
                <ul>
                    <SBItemList items={addressablesViews} />
                </ul>
            </SideBar>
            {viewController(selectedView)}
        </DashboardLayout>
}

export default Layout;