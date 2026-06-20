import styles from './Navbar.module.css'

import { Link } from "react-router-dom"

export const Navbar = () => {
    return (
        <div>
            <Link to="/">
                <button className={styles.button}>Assignment</button>
            </Link>
            <Link to="/table">
                <button className={styles.button}>Table</button>
            </Link>
        </div>
    )
}
