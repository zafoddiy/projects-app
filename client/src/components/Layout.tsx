import styles from './Layout.module.css'

import {Navbar} from "./Navbar.tsx";
import {Outlet} from "react-router-dom";

export const Layout = () => {
    return (
        <div className={styles.navbar}>
            <Navbar/>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}
