import * as React from 'react'
import { toJS, action } from 'mobx'
import { observer } from "mobx-react-lite"

import { storeLayers } from '../Store/storeLayers'
import { storePopup } from '../Store/storePopup'
import { toggleShowEditSlotMachine } from './viewEditSlotMachine'

import { AppButton} from '../components/button'
import { sendResponse } from '../../toServerApi/toServerApi'




export const toggleShowLayersList = action((id = null, callback = () => {}) => {
    toggleShowEditSlotMachine(null)
    storeLayers.isOpened = true
    storeLayers.currentLayersID = id
    if (id) {
        getLayersListFromServer(id, callback)
    }
})


export const createNewLayersList = (callback) => {
    const newLayerID = 'layersID_' + Math.floor(Math.random() * 1000000000000)
    sendResponse('add-new-layers-list', { id: newLayerID }, () => {
        callback(newLayerID)
    })
}


export const removeLayersList = action((id, callback) => {
    storeLayers.currentLayersID = null
    sendResponse('remove-layers', { id }, callback)
})


export const duplicateLayersList = (id, callback) => {
    const newLayersListId = 'layersID_' + Math.floor(Math.random() * 1000000000000)

    toggleShowLayersList(id, layersData => {
        const newLayers = JSON.parse(JSON.stringify(layersData))
        for (let i = 0; i < newLayers.length; ++i) {
            newLayers[i].id = 'id_layer_' + Math.floor(Math.random() * 100000)
        }
        sendResponse('add-new-layers-list', { id: newLayersListId, layers: newLayers }, () => {
            toggleShowLayersList(newLayersListId, () => {
                callback(newLayersListId)
            })
        })
    })
}




const getLayersListFromServer = (id, callback = () => {}) => {
    sendResponse('get-layers', { id }, r => {
        storeLayers.setLayersList(r.props)
        callback(r.props)
    })
}


const editLayersListAndUpdateList = (layersID, layers, callback = () => {}) => {
    sendResponse('edit-layers', { id: layersID, layers }, () => {
        getLayersListFromServer(layersID)
        callback()
    })
}



const TYPES_LAYERS = [
    'slotMachine',
    'element',
    'background',
]


const addNewLayerPopup = () => {
    storePopup.setData(
        [
            { type: 'title', val: 'add new layer:', },
            { type: 'text', val: 'name:', },
            { type: 'input', val: '', },
            { type: 'text', val: 'type-layer', },
            { type: 'dropdown', val: TYPES_LAYERS[0], arrOptions: TYPES_LAYERS }
        ],
        data => {
            const newLayer = {
                id: 'id_layer_' + Math.floor(Math.random() * 100000),
                name: data[2],
                type: data[4],
            }
            const copyLayersData = JSON.parse(JSON.stringify(storeLayers.layers))
            editLayersListAndUpdateList(toJS(storeLayers.currentLayersID), [newLayer, ...copyLayersData], action(() => {
                storePopup.clearAll()
                storeLayers.currentLayerID = null
            }))
        },
        action(() => storePopup.clearAll()),
    )
}

const deleteLayerPopup = () => {
    storePopup.setData(
        [
            { type: 'title', val: 'delete layer ?', },
            { type: 'text', val: 'name:' + storeLayers.layers.filter(item => item.id === storeLayers.currentLayerID)[0].name, },
        ],
        () => {
            const copyLayersData = storeLayers.layers.filter(item => item.id !== storeLayers.currentLayerID)
            storeLayers.currentLayerID = null
            editLayersListAndUpdateList(storeLayers.currentLayersID, copyLayersData, () => {
                storePopup.clearAll()
            })
        },
        action(() => storePopup.clearAll()),
    )
}



const moveLayer = (keyMove, id) => {
    let currentIndex
    let newIndex

    for (let i = 0; i < storeLayers.layers.length; i++) {
        if (id === storeLayers.layers[i].id) {
            currentIndex = i
        }
    }

    if (keyMove === 'top') {
        if (currentIndex === 0) {
            return;
        }
        newIndex = currentIndex - 1
    }
    if (keyMove === 'bottom') {
        if (currentIndex === storeLayers.layers.length - 1) {
            return;
        }
        newIndex = currentIndex + 1
    }

    const targetData = storeLayers.layers[newIndex]
    const currentData = storeLayers.layers[currentIndex]

    const copyArr = JSON.parse(JSON.stringify(storeLayers.layers))
    copyArr[newIndex] = currentData
    copyArr[currentIndex] = targetData



    editLayersListAndUpdateList(storeLayers.currentLayersID, copyArr)
}


const saveNewLayerItemData = (id, newData) => {
    const oldDataCopy = JSON.parse(JSON.stringify(toJS(storeLayers.getCurrentLayerData())))
    const merged = {
        ...oldDataCopy,
        ...newData,
    }
    const copyLayersData = JSON.parse(JSON.stringify(toJS(storeLayers.layers)))
    for (let i = 0; i < copyLayersData.length; ++i) {
        if (copyLayersData[i].id === id) {
            copyLayersData[i] = merged
        }
    }
    editLayersListAndUpdateList(storeLayers.currentLayersID, copyLayersData)
}


const ScreenLayers = observer(() => {
    if (!storeLayers.isOpened) {
        return (<></>)
    }

    if (!storeLayers.currentLayersID) {
        return (<></>)
    }
    return (
        <div >
            layers:
            <div className={'h-10'} />

            <AppButton
                val='add new layer'
                callBackClick={addNewLayerPopup} />

            <div className={'h-10'} />

            {storeLayers.layers.map(item =>
                <LayerView
                    key={Math.floor(Math.random() * 1000000)}
                    layerItem={item} />
            )}
        </div>
    )
})



const LayerView = observer(({ layerItem }) => {
    return (
        <div className='list'>
            <div className='inline'>
                <AppButton
                    val='top'
                    callBackClick={action(() => {
                        storeLayers.currentLayerID = layerItem.id
                        moveLayer('top', layerItem.id)
                    })}/>
                <AppButton
                    val='bottom'
                    callBackClick={action(() => {
                        storeLayers.currentLayerID = layerItem.id
                        moveLayer('bottom', layerItem.id)
                    })}/>
            </div>
            <span>{layerItem.id}</span>
            <span>{layerItem.type}</span>
            <span>{layerItem.name}</span>
            <AppButton
                val='edit'
                callBackClick={action(() => {
                    if (layerItem.type === 'slotMachine') {
                        storeLayers.isOpened = false
                        storeLayers.currentLayerID = layerItem.id
                        toggleShowEditSlotMachine(layerItem.id, layerItem, action(newData => {
                            storeLayers.isOpened = true
                            saveNewLayerItemData(layerItem.id, newData)
                        }))
                    }
                })}/>
            <AppButton
                val='delete'
                callBackClick={action(() => {
                    storeLayers.currentLayerID = layerItem.id
                    deleteLayerPopup()
                })}/>
            <div className='h-10' />
        </div>
    )
})




export const createViewLayers = () => (<ScreenLayers />)
