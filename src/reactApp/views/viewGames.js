import * as React from 'react'
import { toJS, action } from 'mobx';
import { observer } from "mobx-react-lite"
import { AppButton} from '../components/button'

import { storeGamesScreens } from '../Store/storeGamesScreens'
import { storePopup } from "../Store/storePopup";

import { deleteScreens, setCurrentScreen, duplicateScreens } from './viewScreens'
import { sendResponse } from '../../toServerApi/toServerApi'

import '../../stylesheets/view-project-list.css'


/** TO SERVER AND RETURN RESPONSE ************************/

const updateListGamesFromServer = (callback = () => {}) => {
    sendResponse('get-games', null, action(r => {
        storeGamesScreens.setGamesList(r.list)
        callback()
    }))
}

const addGameAndUpdateList = (data, callback = () => {}) => {
    const validatedData = validateNewProject(data)
    sendResponse('add-game', validatedData, () => {
        updateListGamesFromServer(callback)
    })
}
const validateNewProject = data => {
    const SCHEME_NEW_PROJECT = {
        'id': 'game_id_' + Math.floor(Math.random() * 1000000000),
        'name': 'projectName',
        'screens': [],
    }
    return { ...SCHEME_NEW_PROJECT, ...data }
}



const duplicateProjectAndUpdateList = (data, callback) => {
    const gameDataCopy = JSON.parse(JSON.stringify(toJS(storeGamesScreens.getCurrentGameData())))

    duplicateScreens(gameDataCopy.id, screens => {
        const newGameId = 'game_id_' + Math.floor(Math.random() * 1000000000)
        const newGameData = {
            ...gameDataCopy,
            name: data.name,
            id: newGameId,
            screens,
        }
        addGameAndUpdateList(newGameData, action(() => {
            storeGamesScreens.currentScreenID = null
            storeGamesScreens.currentGameID = newGameId
            callback()
        }))
    })
}


export const editGameAndUpdateList = (data, callback) => {
    sendResponse('edit-game', data, () => {
        updateListGamesFromServer()
        callback()
    })
}


const removeGameAndUpdateList = (data, callback) => {
    deleteScreens(data.id, () => {
        sendResponse('remove-game', { id: data.id }, () => {
            updateListGamesFromServer(callback)
        })
    })
}
updateListGamesFromServer()




/** ACTIONS ON HTML ****************************************************************/

const openPopupAddGame = action(() => {
    storeGamesScreens.currentGameID = null
    storePopup.setData(
        [
            { type: 'title', val: 'add new game:', },
            { type: 'text', val: 'name: ', },
            { type: 'input', val: '', },
        ],
        data => {
            if (data[2] === '') {
                return;
            }
            addGameAndUpdateList({ name: data[2] }, () => {
                storePopup.clearAll()
            })
        },
        action(() => storePopup.clearAll()),
    )
})


const openPopupEditGame = action(() => {
    const currentGameData = storeGamesScreens.getCurrentGameData()
    storePopup.setData(
        [
            { type: 'title', val: 'edit game name:', },
            { type: 'text', val: currentGameData.name, },
            { type: 'input', val: currentGameData.name, },
        ],
        data => {
            const gameDataCopy = JSON.parse(JSON.stringify(currentGameData))
            gameDataCopy.name = data[2]
            editGameAndUpdateList(gameDataCopy, () => storePopup.clearAll())
        },
        action(() => storePopup.clearAll()),
    )
})

const openPopupDelGame = action(() => {
    const currentGameData = storeGamesScreens.getCurrentGameData()
    const copyGameData = JSON.parse(JSON.stringify(toJS(currentGameData)))
    storePopup.setData(
        [
            {type: 'title', val: 'delete game:',},
            {type: 'text', val: copyGameData.name ,},
        ],
        () => {
            removeGameAndUpdateList(copyGameData, action(() => {
                storeGamesScreens.currentGameID = null
                storePopup.clearAll()
            }))
        },
        action(() => storePopup.clearAll()),
    )
})

const openPopupDuplicateGame = action(() => {
    const currentGameData = storeGamesScreens.getCurrentGameData()
    storePopup.setData(
        [
            { type: 'title', val: 'duplicate game:' },
            { type: 'text', val: currentGameData.name, },
            { type: 'text', val: 'new name:', },
            { type: 'input', val: currentGameData.name, },
        ],
        action(data => {
            if (data[3] === currentGameData.name) {
                return;
            }
            duplicateProjectAndUpdateList({ name: data[3] }, () => storePopup.clearAll())
        }),
        action(() => storePopup.clearAll()),
    )
})



/** HTML *****************************************************************/

const GamesListView = observer(() => {
    return (
        <div>
            <div>
                games:
                <div className='h-10' />
                <div className='list'>
                    {storeGamesScreens.gamesList.map((project, i) => (
                        <ProjectView gameItem={project} key={Math.floor(Math.random() * 1000000000)} />
                    ))}
                </div>

                <div className='h-50' />

                <AppButton
                    val='add new game'
                    callBackClick={openPopupAddGame}/>
            </div>
        </div>
    )
})




const ProjectView = observer(({ gameItem }) => {
    const isCurrent = storeGamesScreens.currentGameID === gameItem.id
    return (
        <div>
            {isCurrent && <div className='h-10'/>}

            <AppButton
                val={gameItem.name}
                classNameCustom={isCurrent ? 'current' : ''}
                callBackClick={action(() => {
                    setCurrentScreen(null)
                    storeGamesScreens.currentGameID = gameItem.id
                })} />

            {isCurrent &&
                <div className='inline stretch'>
                    <AppButton val={'edit'} callBackClick={openPopupEditGame} />
                    <AppButton val={'del'} callBackClick={openPopupDelGame} />
                    <AppButton val={'duplicate'} callBackClick={openPopupDuplicateGame} />
               </div>}

            {isCurrent && <div className='h-10'/>}
        </div>
    )
})




export const createViewGamesList = () => (<GamesListView />)
