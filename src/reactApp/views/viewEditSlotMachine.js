import * as React from 'react'
import { toJS, action } from 'mobx'
import { observer } from "mobx-react-lite"

import { storeSlotMachine } from '../Store/storeSlotMachine'
import { AppButton} from '../components/button'
import { AppInput } from "../components/input";
import { storePopup } from '../Store/storePopup'

let onCompleteEdit = null
let dataMachine = null

export const toggleShowEditSlotMachine = action((id, data, onEdit) => {
    if (!id) {
        storeSlotMachine.currentId = null
        return;
    }
    onCompleteEdit = onEdit
    dataMachine = JSON.parse(JSON.stringify(toJS(data)))
    storeSlotMachine.currentId = id
    storeSlotMachine.currentName = data.name

    if (data.properties) {
        for (let key in data.properties) {
            if (storeSlotMachine.hasOwnProperty(key)) {
                storeSlotMachine[key] = data.properties[key]
            }
        }
    }
})


const completeEdit = action(() => {
    storeSlotMachine.currentId = null
    dataMachine.name = storeSlotMachine.currentName,
    dataMachine.properties = {
        columnsNum: storeSlotMachine.columnsNum,
        rowsNum: storeSlotMachine.rowsNum,
        horDivider: storeSlotMachine.horDivider,
        vertDivider: storeSlotMachine.vertDivider,
        offsetTop: storeSlotMachine.offsetTop,
        offsetBottom: storeSlotMachine.offsetBottom,
        offsetLeft: storeSlotMachine.offsetLeft,
        offsetRight: storeSlotMachine.offsetRight,
    }
    onCompleteEdit(dataMachine)
})



const openPopupEditName = () => {
    storePopup.setData(
        [
            { type: 'text', val: 'edit name' },
            { type: 'input', val: toJS(storeSlotMachine.currentName) },
        ],
        action(data => {
            if (data[2] === '') {
                return;
            }
            storeSlotMachine.currentName = data[1]
            storePopup.clearAll()
        }),
        action(() => {
            storePopup.clearAll()
        })
    )
}




const EditSlotMachine = observer(() => {
    if (!storeSlotMachine.currentId) {
        return (<></>)
    }
    return (
        <div className='project-properties'>
            <div className='h-10' />
            SlotMachine:
            <div className='h-10' />
            <div>{storeSlotMachine.currentId}</div>

            <div>{storeSlotMachine.currentName}</div>
            <AppButton
                val='edit name'
                callBackClick={openPopupEditName} />

            <div>num columns:</div>
            <AppInput
                val={storeSlotMachine.columnsNum}
                onChange={action(val => {
                    storeSlotMachine.columnsNum = val
                })} />

            <div>num rows:</div>
            <AppInput
                val={storeSlotMachine.rowsNum}
                onChange={action(val => {
                    storeSlotMachine.rowsNum = val
                })} />

            <div>horizontal divider:</div>
            <AppInput
                val={storeSlotMachine.horDivider}
                onChange={action(val => {
                    storeSlotMachine.horDivider = val
                })} />

            <div>vertical divider:</div>
            <AppInput
                val={storeSlotMachine.vertDivider}
                onChange={action(val => {
                    storeSlotMachine.vertDivider = val
                })} />

            <div className='h-10' />

            <AppButton
                val='save'
                callBackClick={completeEdit} />
        </div>
    )
})



export const createEditSlotMachine = () => (<EditSlotMachine />)
