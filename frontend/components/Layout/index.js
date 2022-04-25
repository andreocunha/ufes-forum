import { Header } from "../Header";
import { LeftMenu } from "../LeftMenu";


export function Layout({ children }) {
    return (
        <div>
            <LeftMenu />
            <Header />
            {children}
        </div>
    )
}
