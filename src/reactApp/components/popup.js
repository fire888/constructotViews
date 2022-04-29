import React, { useEffect } from 'react'
import '../../stylesheets/popup.css'
import { AppButton } from "./button";
import { AppInput } from "./input";
import { toJS, action } from 'mobx';
import { AppDropDown } from "./dropdown";

let savedState = []

export function Popup (props) {

    useEffect(() => {
        savedState = props.rows.map(item => item.val)
        return () => {
            savedState = []
        }
    })



    return <div className='full-window-dark'>
        <div className='popup-body'>
            <>
                {props.rows && props.rows.map((item, i) => (
                    <div key={Math.floor(Math.random() * 100000)}>
                        {item.type === 'title' && item.val}
                        {item.type === 'text' && item.val}
                        {item.type === 'input' &&
                            <AppInput val={item.val} onChange={val => {
                                savedState[i] = val
                            }}/>}
                        {item.type === 'dropdown' &&
                            <AppDropDown
                                val={item.val}
                                arrOptions={item.arrOptions}
                                onChange={val => {
                                    savedState[i] = val
                                }}
                            />}
                    </div>
                ))}

            </>

            <AppButton
                classNameCustom='pos-right-top'
                val="cancel"
                callBackClick={props.callBackCancel}
            />

            <div className='h-30' />

            <AppButton
                classNameCustom='pos-center-bottom'
                val="done"
                callBackClick={action(() => {
                    for (let i = 0; i < props.rows.length; ++ i) {
                        if (props.rows[i].type === 'input' && savedState[i] === '') {
                            return;
                        }
                    }
                    props.callBackDone([...savedState])
                })}
            />
        </div>
    </div>
}