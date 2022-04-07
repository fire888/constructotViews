import React from 'react'
import '../../stylesheets/button.css'

export function AppButton (props) {
    return <div
        className={`app-button ${props.classNameCustom}`}
        onClick={props.callBackClick}>
        {props.val}
    </div>
}