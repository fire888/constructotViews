import * as React from 'react'
import { observer } from "mobx-react-lite"
import { AppButton} from '../components/button'
import '../../stylesheets/view-project-list.css'
import { toJS, action } from 'mobx';
import { storeGamesList } from '../Store/GamesList'
import { storePopup } from "../Store/StorePopup";
import { editProjectAndUpdateList } from './viewProjectsList'
import { toggleShowLayersList, createNewLayersList, removeLayersList, duplicateLayersList } from './viewLayers'



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
            createNewLayersList(layersID => {
                copy.screens.push({
                    id: 'screen_id_' + Math.floor(Math.random() * 100000000),
                    name: data[2],
                    layersID,
                })
                editProjectAndUpdateList(copy, () => {
                    toggleShowLayersList(null)
                    storePopup.clearAll()
                })
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
                removeLayersList(currentScreen.layersID, () => {
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
            duplicateLayersList(currentScreen.layersID, newLayersID => {
                const copyProjectData = JSON.parse(JSON.stringify(currentProject))
                const newScreenID = 'screen_id_' + Math.floor(Math.random() * 100000000)
                copyProjectData.screens.push({
                   id: newScreenID,
                   name: data[2],
                   layersID: newLayersID,
                })
                editProjectAndUpdateList(copyProjectData, action(() => {
                    storePopup.clearAll()
                    storeGamesList.currentScreenID = newScreenID
                }))
            })
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
                    val='add new screen'
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
                    toggleShowLayersList(screenItem.layersID)
                    storeGamesList.currentScreenID = screenItem.id
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
