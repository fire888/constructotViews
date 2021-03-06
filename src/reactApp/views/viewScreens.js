import * as React from 'react'
import { observer } from "mobx-react-lite"
import { toJS, action } from 'mobx';
import { mapFunctionToData } from "../helpers/pipelines";
import { AppButton} from '../components/button'
import '../../stylesheets/view-project-list.css'

import { storeGamesScreens } from '../Store/storeGamesScreens'
import { storePopup } from "../Store/storePopup";

import {
    editGameAndUpdateList
} from './viewGames'
import {
    toggleShowLayersList,
    createNewLayersList,
    removeLayersList,
    duplicateLayersList
} from './viewLayers'




export const deleteScreens = (gameID, callback) => {
    const screens = storeGamesScreens.gamesList.filter(item => item.id === gameID)[0].screens
    const screensCopy = JSON.parse(JSON.stringify(toJS(screens)))

    const dataToMap = []
    for (let i = 0; i < screensCopy.length; ++i) {
        dataToMap.push([ screensCopy[i].layersID ])
    }
    mapFunctionToData(dataToMap, removeLayersList, () => {
        callback()
    })
}


export const setCurrentScreen = (id) => {
    if (id === null) {
        storeGamesScreens.currentScreenID = null
        toggleShowLayersList(null)
    }
}

export const duplicateScreens = (gameID, callback) => {
    const screensData = JSON.parse(JSON.stringify(toJS(storeGamesScreens.gamesList.filter(item => item.id === gameID)[0].screens)))

    const dataToMap = []
    for (let i = 0; i < screensData.length; ++i) {
         dataToMap.push([ screensData[i].layersID ])
    }
    mapFunctionToData(dataToMap, duplicateLayersList, arrResults => {
        const newScreens = []
        for (let i = 0; i < screensData.length; ++i) {
            newScreens.push({
                id: 'screen_id_' + Math.floor(Math.random() * 100000000),
                name: screensData[i].name,
                layersID: arrResults[i],
            })
        }
        callback(newScreens)
    })
}




/** ACTIONS ON HTML ****************************************************************/

const openPopupAddScreen = action(() => {
    storeGamesScreens.currentScreenID = null
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
            const currentProject = toJS(storeGamesScreens.gamesList.filter(item => item.id === storeGamesScreens.currentGameID)[0])
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
                editGameAndUpdateList(copy, action(() => {
                    toggleShowLayersList(null)
                    storePopup.clearAll()
                }))
            })
        },
        action(() => storePopup.clearAll()),
    )
})

const openPopupEditScreen = action(() => {
    const currentScreen = storeGamesScreens.getCurrentScreenData()

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
             const currentGameDataCopy = JSON.parse(JSON.stringify(toJS(storeGamesScreens.getCurrentGameData())))
             for (let i = 0; i < currentGameDataCopy.screens.length; ++i) {
                if (currentGameDataCopy.screens[i].id === storeGamesScreens.currentScreenID) {
                    currentGameDataCopy.screens[i].name = data[2]
                }
             }
             editGameAndUpdateList(currentGameDataCopy, action(() => storePopup.clearAll()))
         },
         action(() => storePopup.clearAll()),
    )
})

const openPopupDelScreen = action(() => {
    const currentScreen = storeGamesScreens.getCurrentScreenData()

    storePopup.setData(
        [
            { type: 'title', val: 'delete screen ?', },
            { type: 'text', val: currentScreen.name, },
        ],
        () => {
            const currentGameDataCopy = JSON.parse(JSON.stringify(toJS(storeGamesScreens.getCurrentGameData())))
            currentGameDataCopy.screens = currentGameDataCopy.screens.filter(item => item.id !== currentScreen.id)
            editGameAndUpdateList(currentGameDataCopy, action(() => {
                removeLayersList(currentScreen.layersID, () => {
                    storePopup.clearAll()
                })
            }))
        },
        action(() => storePopup.clearAll()),
    )
})

const openPopupDuplicateScreen = action(() => {
    const currentScreen = storeGamesScreens.getCurrentScreenData()

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
                const currentGameDataCopy = JSON.parse(JSON.stringify(toJS(storeGamesScreens.getCurrentGameData())))
                const newScreenID = 'screen_id_' + Math.floor(Math.random() * 100000000)
                currentGameDataCopy.screens.push({
                   id: newScreenID,
                   name: data[2],
                   layersID: newLayersID,
                })
                editGameAndUpdateList(currentGameDataCopy, action(() => {
                    storePopup.clearAll()
                    storeGamesScreens.currentScreenID = newScreenID
                }))
            })
        },
        action(() => storePopup.clearAll()),
    )
})

/** HTML *****************************************************************/

const ScreensListView = observer(() => {
    if (!storeGamesScreens.currentGameID) {
        return (<></>)
    }
    const currentGameData = storeGamesScreens.getCurrentGameData()

    return (
        <div>
            <div>
                screens:
                <div className='h-10' />
                <div className='list'>
                    {currentGameData.screens.map((screen, i) => (
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
    const isCurrent = storeGamesScreens.currentScreenID === screenItem.id
    return (
        <div>
            {isCurrent && <div className='h-10'/>}

            <AppButton
                val={screenItem.name}
                classNameCustom={isCurrent ? 'current' : ''}
                callBackClick={action(() => {
                    toggleShowLayersList(screenItem.layersID)
                    storeGamesScreens.currentScreenID = screenItem.id
                })} />

            {isCurrent &&
                <div className='inline stretch'>
                    <AppButton val={'edit'} callBackClick={openPopupEditScreen} />
                    <AppButton val={'del'} callBackClick={openPopupDelScreen} />
                    <AppButton val={'duplicate'} callBackClick={openPopupDuplicateScreen} />
                </div>}

            {isCurrent && <div className='h-10'/>}
        </div>
    )
})



export const createViewScreens = () => (<ScreensListView />)
