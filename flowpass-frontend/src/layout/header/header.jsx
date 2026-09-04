import "./style.css"
import { Button } from "../../components/Button/button"


export const Header = () =>{
    return(
        <header>
            <h1 className="logo-text">FLOWPASS</h1>
            <Button texto={"+ Novo Pedido"} variant={"primary"} size={"short"}></Button>
        </header>
    
    )
}