import { makeAutoObservable, toJS } from 'mobx';

export const storeLayers = makeAutoObservable({
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
})