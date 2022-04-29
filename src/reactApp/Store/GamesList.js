import { makeAutoObservable, toJS } from 'mobx';

export const storeGamesList = makeAutoObservable({
    gamesList: [],
    currentGameID: null,
    popupAddGameIsOpened: false,
    popupDelGameIsOpened: false,
    popupEditGameIsOpened: false,
    setGamesList (list) {
        this.gamesList.clear()
        for (let i = 0; i < list.length; ++i) {
            this.gamesList.push(list[i])
        }
    },
})