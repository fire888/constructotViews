import '../stylesheets/reactApp.css'
import { createRoot } from 'react-dom/client';
import * as React from 'react'
import { createViewProjectsList } from './views/viewProjectsList'
import { createViewProjectProperties } from './views/viewProjectProperties'

const root = createRoot(document.getElementById("app"));
root.render(<>
    {createViewProjectsList()}
    {createViewProjectProperties()}
</>)