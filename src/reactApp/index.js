import '../stylesheets/reactApp.css'
import { createRoot } from 'react-dom/client';
import * as React from 'react'
import { createViewGamesList } from './views/viewGames'
import { createViewLayers} from './views/viewLayers'
import { createViewScreens } from "./views/viewScreens";
import { createPopup } from "./components/popup";
import { createEditSlotMachine } from './views/viewEditSlotMachine'

const root = createRoot(document.getElementById("app"));
root.render(<>
    {createPopup()}
    <div className='left-panel'>
        {createViewGamesList()}
        {createViewScreens()}
    </div>
    <div className='right-panel'>
        {createViewLayers()}
        {createEditSlotMachine()}
    </div>
</>)