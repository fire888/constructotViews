import * as React from 'react'
import { observer } from "mobx-react-lite"
import { AppButton} from '../components/button'
import '../../stylesheets/view-project-list.css'
import { toJS, action } from 'mobx';
import { storeGamesList } from '../Store/GamesList'
import { storeGameProps } from '../Store/GameProperties'
import { sendResponse } from '../../toServerApi/toServerApi'
import {storePopup} from "../Store/StorePopup";


export const getListLayersFromServer = id => {
    sendResponse('get-screen-layers', { id }, r => {
        storeGameProps.setLayersList(r.props)
    })
}


const editListLayersAndUpdateList = (layersID, layers, callback = () => {}) => {
    sendResponse('edit-screen-layers', { id: layersID, layers }, () => {
        getListLayersFromServer(layersID)
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
            const copyLayersData = JSON.parse(JSON.stringify(storeGameProps.layers))
            const gameData = storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0]
            const screenData = gameData.screens.filter(item => item.id === storeGamesList.currentScreenID)[0]
            editListLayersAndUpdateList(toJS(screenData.layersID), [newLayer, ...copyLayersData], action(() => {
                storePopup.clearAll()
                storeGameProps.currentLayerID = null
            }))
        },
        action(() => storePopup.clearAll()),
    )
}

const openDeleteLayerPopup = () => {
    storePopup.setData(
        [
            { type: 'title', val: 'delete layer ?', },
            { type: 'text', val: 'name:' + storeGameProps.layers.filter(item => item.id === storeGameProps.currentLayerID)[0].name, },
        ],
        () => {
            const copyLayersData = storeGameProps.layers.filter(item => item.id !== storeGameProps.currentLayerID)
            const gameData = storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0]
            const screenData = gameData.screens.filter(item => item.id === storeGamesList.currentScreenID)[0]
            storeGameProps.currentLayerID = null
            editListLayersAndUpdateList(screenData.layersID, copyLayersData, () => {
                storePopup.clearAll()
            })
        },
        action(() => storePopup.clearAll()),
    )
}







const moveLayer = (keyMove, id) => {
    let currentIndex
    let newIndex

    for (let i = 0; i < storeGameProps.layers.length; i++) {
        if (id === storeGameProps.layers[i].id) {
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
        if (currentIndex === storeGameProps.layers.length - 1) {
            return;
        }
        newIndex = currentIndex + 1
    }

    const targetData = storeGameProps.layers[newIndex]
    const currentData = storeGameProps.layers[currentIndex]

    const copyArr = JSON.parse(JSON.stringify(storeGameProps.layers))
    copyArr[newIndex] = currentData
    copyArr[currentIndex] = targetData


    const gameData = storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0]
    const screenData = gameData.screens.filter(item => item.id === storeGamesList.currentScreenID)[0]

    editListLayersAndUpdateList(screenData.layersID, copyArr)
}



const ScreenLayers = observer(() => {
    if (!storeGamesList.currentScreenID) {
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

            {storeGameProps.layers.map(item =>
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
                        storeGameProps.currentLayerID = layerItem.id
                        moveLayer('top', layerItem.id)
                    })}/>
                <AppButton
                    val='bottom'
                    callBackClick={action(() => {
                        storeGameProps.currentLayerID = layerItem.id
                        moveLayer('bottom', layerItem.id)
                    })}/>
            </div>
            <span>{layerItem.id}</span>
            <span>{layerItem.type}</span>
            <span>{layerItem.name}</span>
            <AppButton
                val='delete'
                callBackClick={action(() => {
                    storeGameProps.currentLayerID = layerItem.id
                    openDeleteLayerPopup()
                })}/>
            <div className='h-10' />
        </div>
    )
})




export const createViewScreenLayers = () => (<ScreenLayers />)
