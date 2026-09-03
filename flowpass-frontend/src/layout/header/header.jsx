import { Button } from "../../components/Button/button"

export const Header = () =>{
    return(
        <header>
            <h1>FLOWPASS</h1>
            <Button texto={"+ Novo Pedido"} variant={"primary"} size={"short"}></Button>
        </header>
        

    )
}