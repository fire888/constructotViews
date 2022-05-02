import { makeAutoObservable } from 'mobx';

export const storeGamesScreens = makeAutoObservable({
    gamesList: [],
    currentGameID: null,
    currentScreenID: null,
    setGamesList (list) {
        this.gamesList.clear()
        for (let i = 0; i < list.length; ++i) {
            this.gamesList.push(list[i])
        }
    },
    getCurrentGameData () {
        return this.gamesList.filter(item => item.id === this.currentGameID)[0]
    },
    getCurrentScreenData () {
        const currentProject = this.gamesList.filter(item => item.id === this.currentGameID)[0]
        const currentScreen = currentProject.screens.filter(item => item.id === this.currentScreenID)[0]
        return currentScreen
    }
})