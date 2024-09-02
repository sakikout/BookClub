import React from "react";
import closebtn from "../icons/close.png"
import './style/style.css'

function Popup(props) {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn" onClick={() => props.setTrigger(false)}>
                    <img src={closebtn} class="closebtn" alt='Fechar'></img>
                </button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Popup