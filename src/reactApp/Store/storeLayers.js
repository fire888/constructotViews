import { makeAutoObservable, toJS } from 'mobx';

export const storeLayers = makeAutoObservable({
    isOpened: true,
    layers: [],
    currentLayersID: null,
    currentLayerID: null,
    popupAddLayerIsOpened: false,
    popupDelLayerIsOpened: false,
    setLayersList (list) {
        this.layers.clear()
        for (let i = 0; i < list.length; ++i) {
            this.layers.push(list[i])
        }
    },
    getCurrentLayerData () {
        return this.layers.filter(item => item.id === this.currentLayerID)[0]
    }
})