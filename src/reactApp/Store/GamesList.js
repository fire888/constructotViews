import { makeAutoObservable, toJS } from 'mobx';

export const storeGamesList = makeAutoObservable({
    gamesList: [],
    currentGameID: null,
    currentScreenID: null,
    setGamesList (list) {
        this.gamesList.clear()
        for (let i = 0; i < list.length; ++i) {
            this.gamesList.push(list[i])
        }
    },
})