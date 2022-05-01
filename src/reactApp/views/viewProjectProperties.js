import * as React from 'react'
import { observer } from "mobx-react-lite"
import { AppButton} from '../components/button'
import '../../stylesheets/view-project-list.css'
import { toJS, action } from 'mobx';
import { storeGamesList } from '../Store/GamesList'
import { storeGameProps } from '../Store/GameProperties'
import { sendResponse } from '../../toServerApi/toServerApi'


const TYPES_LAYERS = [
    'slotMachine',
    'element',
    'background',
]


export const updateListLayersFromServer = id => {
    sendResponse('get-project-props', { id }, r => {
        storeGameProps.setLayersList(r.props)
    })
}
export const editListLayersAndUpdateList = (idProject, layers, callback = () => {}) => {
    callback()

    // sendResponse('edit-project-props', { id: idProject, layers }, () => {
    //     console.log('!!!!---')
    //     updateListLayersFromServer(idProject)
    //     callback()
    // })
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

    editListLayersAndUpdateList(storeGamesList.currentGameID, copyArr)
}



const ProjectProperties = observer(() => {
    if (!storeGamesList.currentGameID) {
        return (<></>)
    }
    const itemData = storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0]
    return (
        <>
            {/*{storeGameProps.popupAddLayerIsOpened &&*/}
            {/*    <Popup*/}
            {/*        rows={[*/}
            {/*            { type: 'title', val: 'add new layer:', },*/}
            {/*            { type: 'text', val: 'name:', },*/}
            {/*            { type: 'input', val: 'layer-' + (storeGameProps.layers.length + 1), },*/}
            {/*            { type: 'text', val: 'type:', },*/}
            {/*            { type: 'dropdown', val: TYPES_LAYERS[0], arrOptions: TYPES_LAYERS }*/}
            {/*        ]}*/}
            {/*        callBackDone={data => {*/}
            {/*            storeGameProps.popupAddLayerIsOpened = false*/}

            {/*            const newLayer = {*/}
            {/*                id: 'id_layer_' + Math.floor(Math.random() * 100000),*/}
            {/*                name: data[2],*/}
            {/*                type: data[4],*/}
            {/*            }*/}
            {/*            const copyLayersData = JSON.parse(JSON.stringify(storeGameProps.layers))*/}
            {/*            editListLayersAndUpdateList(itemData.id, [newLayer, ...copyLayersData])*/}
            {/*        }}*/}
            {/*        callBackCancel={action(() => {*/}
            {/*            storeGameProps.popupAddLayerIsOpened = false*/}
            {/*        })}*/}
            {/*    />}*/}

            {/*{storeGameProps.popupDelLayerIsOpened &&*/}
            {/*    <Popup*/}
            {/*        rows={[*/}
            {/*            { type: 'title', val: 'delete layer?', },*/}
            {/*            { type: 'text', val: storeGameProps.layers.filter(item => item.id === storeGameProps.currentLayerID)[0].name, },*/}
            {/*        ]}*/}
            {/*        callBackDone={() => {*/}
            {/*            const copyLayersData = storeGameProps.layers.filter(item => item.id !== storeGameProps.currentLayerID)*/}
            {/*            editListLayersAndUpdateList(itemData.id, copyLayersData, () => {*/}
            {/*                storeGameProps.popupDelLayerIsOpened = false*/}
            {/*            })*/}
            {/*        }}*/}
            {/*        callBackCancel={action(() => {*/}
            {/*            storeGameProps.popupDelLayerIsOpened = false*/}
            {/*        })}*/}
            {/*    />}*/}


            <div className={'project-properties list'}>
                <div className='h-50' />
                <div>{itemData.id}</div>
                <div>{itemData.name}</div>
                <div className='h-50' />

                <AppButton
                    val='add new'
                    callBackClick={action(() => {
                        storeGameProps.currentLayerID = null
                        storeGameProps.popupAddLayerIsOpened = true
                    })}/>
                <div className='h-10' />
                <div>
                    {storeGameProps.layers.map(item =>
                        <LayerView
                            key={Math.floor(Math.random() * 1000000)}
                            layerItem={item} />
                    )}
                </div>
            </div>
        </>
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
            <div className='inline'>
                <span>{layerItem.name}</span>
                <AppButton
                    val='delete'
                    callBackClick={action(() => {
                        storeGameProps.currentLayerID = layerItem.id
                        storeGameProps.popupDelLayerIsOpened = true
                    })}/>
            </div>
            <div className='h-10' />
        </div>
    )
})




export const createViewProjectProperties = () => (<ProjectProperties/>)
