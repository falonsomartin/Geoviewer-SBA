/* Written by Ye Liu */

import React from 'react';
import { SnackbarProvider } from 'notistack';

import Snackbar from '@components/snackbar';
import About from '@components/about';
import Navigator from '@components/navigator';
import Menu from '@components/menu';
import Login from '@components/login';
import Feature from '@components/feature';
import StyleController from '@components/controllers/styleController';
import LayerController from '@components/controllers/layerController';
import DataController from '@components/controllers/dataController';
import Canvas from '@components/canvas';
import Popup from '@components/popup';
import '@styles/materialize.min.style.css';
import ModelController from '../components/controllers/modelController';
import SyncController from '../components/controllers/syncController';
import BandController from '../components/controllers/bandController';
import TreeController from '../components/controllers/treeController';

class Main extends React.Component {
    render() {
        return (
            <SnackbarProvider maxSnack={3}>
                <React.Fragment>
                    <Snackbar />
                    <About />
                    <Navigator />
                    <Menu />
                    <Login />
                    <Feature />
                    <StyleController />
                    <LayerController />
                    <ModelController />
                    <BandController/>
                    <TreeController/>
                    <DataController />
                    <SyncController />
                    <Popup />
                    <Canvas />
                </React.Fragment>
            </SnackbarProvider>
        );
    }
}

export default Main;
