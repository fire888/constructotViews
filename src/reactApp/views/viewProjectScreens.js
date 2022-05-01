import * as React from 'react'
import { observer } from "mobx-react-lite"
import { AppButton} from '../components/button'
//import { Popup } from "../components/popup";
import '../../stylesheets/view-project-list.css'
import { toJS, action } from 'mobx';
import { storeGamesList } from '../Store/GamesList'
import { storeGameProps } from '../Store/GameProperties'
import { sendResponse } from '../../toServerApi/toServerApi'
import {storePopup} from "../Store/StorePopup";
import { editProjectAndUpdateList } from './viewProjectsList'


const sendAddScreenLayers = (data, callback) => {
    sendResponse('add-screen-layers', data, callback)
}
const sendDeleteScreenLayers = (data, callback) => {
    sendResponse('remove-screen-layers', data, callback)
}

/** ACTIONS ON HTML ****************************************************************/

const openPopupAddScreen = action(() => {
    storeGamesList.currentScreenID = null
    storePopup.setData(
        [
            { type: 'title', val: 'add new screen to game:', },
            { type: 'text', val: 'screen name: ', },
            { type: 'input', val: '', },
        ],
        data => {
            if (data[2] === '') {
                return;
            }
            const currentProject = toJS(storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0])
            const copy = JSON.parse(JSON.stringify(currentProject))
            if (!copy.screens) {
                copy.screens = []
            }
            const layersID = 'layers_ID_' + Math.floor(Math.random() * 100000000)
            copy.screens.push({
                id: 'screen_id_' + Math.floor(Math.random() * 100000000),
                name: data[2],
                layersID,
            })
            editProjectAndUpdateList(copy, () => {
                sendAddScreenLayers({ id: layersID })
                storePopup.clearAll()
            })
        },
        action(() => storePopup.clearAll()),
    )
})

const openPopupEditProject = action(() => {
    const currentProject = toJS(storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0])
    const currentScreen = currentProject.screens.filter(item => item.id === storeGamesList.currentScreenID)[0]

    storePopup.setData(
         [
             { type: 'title', val: 'edit screen name:', },
             { type: 'text', val: currentScreen.name, },
             { type: 'input', val: currentScreen.name, },
         ],
         data => {
             if (data[2] === '') {
                 return;
             }
            const copyProjectData = JSON.parse(JSON.stringify(currentProject))
            for (let i = 0; i < copyProjectData.screens.length; ++i) {
                if (copyProjectData.screens[i].id === storeGamesList.currentScreenID) {
                    copyProjectData.screens[i].name = data[2]
                }
            }
            editProjectAndUpdateList(copyProjectData, action(() => storePopup.clearAll()))
         },
         action(() => storePopup.clearAll()),
    )
})

const openPopupDelProject = action(() => {
    const currentProject = toJS(storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0])
    const currentScreen = currentProject.screens.filter(item => item.id === storeGamesList.currentScreenID)[0]

    storePopup.setData(
        [
            { type: 'title', val: 'delete screen ?', },
            { type: 'text', val: currentScreen.name, },
        ],
        () => {
            const copyProjectData = JSON.parse(JSON.stringify(currentProject))
            copyProjectData.screens = copyProjectData.screens.filter(item => item.id !== currentScreen.id)
            editProjectAndUpdateList(copyProjectData, action(() => {
                sendDeleteScreenLayers({ id: currentScreen.layersID }, () => {
                    storePopup.clearAll()
                })
            }))
        },
        action(() => storePopup.clearAll()),
    )
})

const openPopupDuplicateProject = action(() => {
    const currentProject = toJS(storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0])
    const currentScreen = currentProject.screens.filter(item => item.id === storeGamesList.currentScreenID)[0]

    storePopup.setData(
        [
            { type: 'title', val: 'duplicate screen:', },
            { type: 'text', val: 'set new screen name', },
            { type: 'input', val: currentScreen.name, },
        ],
        data => {
            if (data[2] === currentScreen.name || data[2] === '') {
                return;
            }
            const copyProjectData = JSON.parse(JSON.stringify(currentProject))
            const newLayersId = 'layers_ID_' + Math.floor(Math.random() * 100000000)
            copyProjectData.screens.push({
                id: 'screen_id_' + Math.floor(Math.random() * 100000000),
                name: data[2],
                layersID: newLayersId,
            })
            editProjectAndUpdateList(copyProjectData, action(() => {
                sendAddScreenLayers({ id: newLayersId }, action(() => {
                    storeGamesList.currentScreenID = null
                    storePopup.clearAll()
                }))
            }))
        },
        action(() => storePopup.clearAll()),
    )
})

/** HTML *****************************************************************/

const ScreensListView = observer(() => {
    if (!storeGamesList.currentGameID) {
        return (<></>)
    }
    const projectData = storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0]
    const screens = projectData.screens || []

    return (
        <div>
            <div>
                screens:
                <div className='h-10' />
                <div className='list'>
                    {screens.map((screen, i) => (
                        <ScreenView screenItem={screen} key={Math.floor(Math.random() * 1000000000)} />
                    ))}
                </div>

                <div className='h-50' />

                <AppButton
                    val='add new'
                    callBackClick={openPopupAddScreen} />
            </div>
        </div>
    )
})




const ScreenView = observer(({ screenItem }) => {
    const isCurrent = storeGamesList.currentScreenID === screenItem.id
    return (
        <div>
            {isCurrent && <div className='h-10'/>}

            <AppButton
                val={screenItem.name}
                classNameCustom={isCurrent ? 'current' : ''}
                callBackClick={action(() => {
                    storeGamesList.currentScreenID = screenItem.id
                    // updateListLayersFromServer(projectItem.id)
                })} />

            {isCurrent &&
                <div className='inline stretch'>
                    <AppButton val={'edit'} callBackClick={openPopupEditProject} />
                    <AppButton val={'del'} callBackClick={openPopupDelProject} />
                    <AppButton val={'duplicate'} callBackClick={openPopupDuplicateProject} />
                </div>}

            {isCurrent && <div className='h-10'/>}
        </div>
    )
})



export const createViewProjectScreens = () => (<ScreensListView />)
