import React, { useEffect } from 'react'
import '../../stylesheets/popup.css'
import { AppButton } from "./button";
import { AppInput } from "./input";
import { toJS, action } from 'mobx';
import { AppDropDown } from "./dropdown";
import { storePopup } from '../Store/StorePopup'
import {observer} from "mobx-react-lite";

let savedState = []

const Popup = observer(() => {


    useEffect(() => {
        savedState = storePopup.rows.map(item => item.val)
        return () => {
            savedState = []
        }
    })


    if (storePopup.rows.length === 0) {
        return (<></>)
    }



    return <div className='full-window-dark'>
        <div className='popup-body'>
            <>
                {storePopup.rows && storePopup.rows.map((item, i) => (
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
                callBackClick={storePopup.callBackCancel}
            />

            <div className='h-30' />

            <AppButton
                classNameCustom='pos-center-bottom'
                val="done"
                callBackClick={action(() => {
                    for (let i = 0; i < storePopup.rows.length; ++ i) {
                        if (storePopup.rows[i].type === 'input' && savedState[i] === '') {
                            return;
                        }
                    }
                    storePopup.callBackDone([...savedState])
                })}
            />
        </div>
    </div>
})


export const createPopup = () => (<Popup />)