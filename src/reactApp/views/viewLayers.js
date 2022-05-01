import * as React from 'react'
import { toJS, action } from 'mobx'
import { observer } from "mobx-react-lite"

import { storeLayers } from '../Store/storeLayers'
import { storePopup } from '../Store/StorePopup'

import { AppButton} from '../components/button'
import { sendResponse } from '../../toServerApi/toServerApi'




export const toggleShowLayersList = (id = null, callback = () => {}) => {
    storeLayers.currentLayersID = id
    if (id) {
        getLayersListFromServer(id, callback)
    }
}


export const createNewLayersList = (callback) => {
    const newLayerID = 'layersID_' + Math.floor(Math.random() * 1000000000000)
    sendResponse('add-new-layers-list', { id: newLayerID }, () => {
        callback(newLayerID)
    })
}


export const removeLayersList = (id, callback) => {
    storeLayers.currentLayersID = null
    sendResponse('remove-layers', { id }, callback)
}


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


const addNewLayer = () => {
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

const openDeleteLayerPopup = () => {
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



const ScreenLayers = observer(() => {
    if (!storeLayers.currentLayersID) {
        return (<></>)
    }
    return (
        <div className='project-properties'>
            layers:
            <div className={'h-10'} />

            <AppButton
                val='add new'
                callBackClick={addNewLayer} />

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
                val='delete'
                callBackClick={action(() => {
                    storeLayers.currentLayerID = layerItem.id
                    openDeleteLayerPopup()
                })}/>
            <div className='h-10' />
        </div>
    )
})




export const createViewScreenLayers = () => (<ScreenLayers />)
