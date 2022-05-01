import '../stylesheets/reactApp.css'
import { createRoot } from 'react-dom/client';
import * as React from 'react'
import { createViewProjectsList } from './views/viewProjectsList'
import { createViewScreenLayers} from './views/viewScreenLayers'
import { createViewProjectScreens } from "./views/viewProjectScreens";
import { createPopup } from "./components/popup";

const root = createRoot(document.getElementById("app"));
root.render(<>
    {createPopup()}
    <div className='left-panel'>
        {createViewProjectsList()}
        {createViewProjectScreens()}
    </div>
    {createViewScreenLayers()}
</>)