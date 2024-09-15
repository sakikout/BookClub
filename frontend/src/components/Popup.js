import React from "react";
import closebtn from "../icons/close-svgrepo.png"
import './style/style.css'

function Popup(props) {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn" onClick={() => props.setTrigger(false)}>
                    <img src={closebtn} className="closebtn" alt='Fechar'></img>
                </button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Popup