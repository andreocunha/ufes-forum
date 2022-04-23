import { Header } from "../Header";
import { Menu } from "../Menu";


export function Layout({ children }) {
    return (
        <div>
            <Menu />
            <Header />
            {children}
        </div>
    )
}
