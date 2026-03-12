import {TopBar as MobileTopBar} from "../components/navbar/mobile/TopBar";
import {TopBar as DesktopTopBar} from "../components/navbar/desktop/TopBar";
import {useContext} from "react";
import { Context } from "../Context";
import './Dashboard.css';

export default function Dashboard() {
    const contextValues = useContext(Context);

    return (
        <>
            {contextValues?.mobile ? (<MobileTopBar />) : (<DesktopTopBar />)}
        </>
    )
}
