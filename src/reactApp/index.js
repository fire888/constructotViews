import '../stylesheets/reactApp.css'
import { createRoot } from 'react-dom/client';
import * as React from 'react'
import { createProjectsListView } from './views/viewProjectsList'
import { createProjectProperties } from './views/viewProjectProperties'

const root = createRoot(document.getElementById("app"));
root.render(<>
    {createProjectsListView()}
    {createProjectProperties()}
</>)