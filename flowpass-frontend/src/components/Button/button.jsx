  import "./style.css";
  
  export const Button = ({texto, variant ="primary", size ="regular"}) => {
    const classes = `btn btn-${variant} btn-${size}`

    return(
        <button className={classes}>{texto}</button>
    )

  }