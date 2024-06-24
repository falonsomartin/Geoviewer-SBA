/* Written by Ye Liu */

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Slide from '@material-ui/core/Slide';
import indigo from '@material-ui/core/colors/indigo';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import M from 'materialize-css';
import React from 'react';
import Carousel from 'react-elastic-carousel';

import { ACCESS_TOKEN, SERVICE } from '@/config';
import emitter from '@utils/events.utils';
import { checkEmptyObject } from '@utils/method.utils';
import request from '@utils/request.utils';
import Plot from 'react-plotly.js';

import '@styles/dataController.style.css';

const theme = createTheme({
    palette: {
        primary: {
            main: indigo.A200
        }
    }
});

const styles = {
    root: {
        position: 'fixed',
        top: 74,
        right: 10,
        borderRadius: 4,
        minWidth: 350,
        margin: 0,
        width:900,
        zIndex: 900
    },
    header: {
        backgroundColor: '#f1f1f1'
    },
    closeBtn: {
        position: 'absolute',
        top: 6,
        right: 8,
        fontSize: 22
    },
    searchField: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: 40,
        padding: '2px 4px'
    },
    searchBox: {
        marginLeft: 8,
        flex: 1,
        border: 'none !important'
    },
    searchBoxBtn: {
        padding: 8
    },
    searchOptionsContainer: {
        padding: '5px 2px'
    },
    searchOption: {
        color: 'rgba(0, 0, 0, 0.6)',
        cursor: 'pointer'
    },
    searchBoxProgress: {
        marginRight: 8
    },
    searchBoxDivider: {
        width: 1,
        height: 28,
        margin: 4
    },
    resultWrapperOpen: {
        maxWidth: 800
    },
    resultWrapperClosed: {
        maxWidth: 350
    },
    resultContainer: {
        paddingTop: 0,
        paddingBottom: 0
    },
    resultTable: {
        boxShadow: 'none'
    },
    uploadBoxInput: {
        display: 'none'
    },
    uploadBoxBtnEdit: {
        width: 40,
        height: 40,
        lineHeight: '40px',
        textAlign: 'center',
        borderRadius: '50%',
        fontSize: 22
    },
    wrapBtn: {
        position: 'absolute',
        bottom: 12,
        left: 18,
        padding: 10,
        fontSize: 24
    },
    addPointWrapperOpen: {
        maxWidth: 350
    },
    addPointWrapperClose: {
        width: 0
    },
    uploadBoxBtnAdd: {
        width: 90,
        height: 90,
        lineHeight: '90px',
        textAlign: 'center',
        borderRadius: '50%',
        fontSize: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
    },
    previewImageContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    nameTextField: {
        margin: '0 20px 0 13px'
    },
    pinyinTextField: {
        margin: '10px 20px 10px 13px'
    },
    introTextField: {
        width: '100%',
        marginTop: 5
    },
    locationImageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    locationImage: {
        display: 'block',
        marginTop: 5,
        width: 225,
        height: 140,
        borderRadius: 3,
        cursor: 'pointer'
    },
    locationLabel: {
        display: 'block',
        marginTop: 6
    },
    actions: {
        paddingTop: 10
    },
    saveBtn: {
        display: 'inline-block',
        position: 'relative',
        marginRight: 10
    },
    saveBtnProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
};

class DataController extends React.Component {
    state = {
        open: false,
        resultUnwrap: false,
        addPointUnwrap: false,
        optionsOpen: false,
        searching: false,
        submitting: false,
        anchorEl: null,
        geometry: null,
        previewImage: null,
        previewMapUrl: null,
        previewCoordinate: {},
        loading: true,
        traces: [],
        precipitationData:[],
        temperatureData: [],
        watsatData: [],
        animalData:[],
        
        items: [
            {id: 1, title: 'item #1'},
            {id: 2, title: 'item #2'},
            {id: 3, title: 'item #3'},
            {id: 4, title: 'item #4'},
            {id: 5, title: 'item #5'}
          ]
        ,
        data: [],
        layout : {
            title: 'Avistamientos de Animales por Localidad',
            xaxis: {
                title: 'Fecha',
                type: 'date'
            },
            yaxis: {
                title: 'Número de Avistamientos'
            },
            hovermode: 'closest', // Mejora la interacción al pasar el mouse sobre los datos
            plot_bgcolor: "white", // Fondo blanco para la gráfica
            paper_bgcolor: "white", // Fondo blanco para el área exterior de la gráfica
        },
        
        searchOptions: [
            {
                value: 'gid',
                label: 'Gid',
                checked: true
            },
            {
                value: 'name',
                label: 'Name',
                checked: true
            },
            {
                value: 'pinyin',
                label: 'Pinyin',
                checked: true
            },
            {
                value: 'introduction',
                label: 'Introduction',
                checked: false
            }
        ]
    }

    initMaterialbox = () => {
        var elems = document.querySelectorAll('.materialboxed');
        M.Materialbox.init(elems, {
            onOpenStart: (e) => {
                e.parentNode.style.overflow = 'visible';
            },
            onCloseEnd: (e) => {
                e.parentNode.style.overflow = 'hidden';
            }
        });
    }
    
    resetPreviewImage = () => {
        this.setState({
            previewImage: null
        });
    }

    resetNewPointData = () => {
        this.setState({
            previewMapUrl: null,
            geometry: null,
            previewCoordinate: {}
        });
    }

    handleCloseClick = () => {
        this.setState({
            open: false
        });
    }

    handleAddClick = () => {
        // Get GeoJSON from map
        emitter.emit('getPoint');

        // Exit search mode
        this.handleWrapClick();

        // Initialize new point data
        this.resetPreviewImage();
        this.resetNewPointData();

        // Wrap add point panel
        this.setState({
            addPointUnwrap: false
        });
    }
    fetchData = () => {
        
        fetch('http://localhost:5000/animales_por_localidad', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            this.processAnimalSightings(data.output);
        })
        .catch((error) => {
            console.error('Error:', error);
            emitter.emit('showSnackbar', 'error', 'Error: Something happened extracting the data.');
        });

    }
    handleWrapClick = () => {
        // Remove temp layer
        emitter.emit('removeTempLayer');

        // Reset preview image
        this.resetPreviewImage();

        // Clear search box
        document.getElementById('search-box').value = '';

        this.setState({
            resultUnwrap: false
        });
    }

    handleImageChange = (e) => {
        // Check if file selected
        if (!e.target.files[0]) {
            return;
        }

        // Check image size (smaller than 1MB)
        if (e.target.files[0].size > 1048576) {
            emitter.emit('showSnackbar', 'error', 'Error: Image must be smaller than 1MB.');
            return;
        }

        // Encode image with base64
        this.state.reader.readAsDataURL(e.target.files[0]);
    }

    handleDoneEdit = () => {
        // Reset preview image
        this.resetPreviewImage();

        // Initialize Materialbox
        setTimeout(this.initMaterialbox, 800);
    }

    handleSearchOptionsClick = () => {
        this.setState({
            optionsOpen: true
        });
    }

    handleSearchOptionsClose = () => {
        this.setState({
            optionsOpen: false
        });
    }

    
    handleSearchOptionChange = (e) => {
        // Update search options
        var option = null;
        var flag = false;
        this.state.searchOptions.map(item => {
            if (item.value === e.currentTarget.value) {
                item.checked = e.currentTarget.checked;
                option = item;
            }
            flag = flag || item.checked;
            return true;
        });

        // Check whether at least one option checked
        if (!flag) {
            emitter.emit('showSnackbar', 'error', 'Error: Please select at least one option.');
            option.checked = true;
            return;
        }

        this.setState({
            searchOptions: this.state.searchOptions
        });
    }

    handleSearchClick = () => {
        // Exit add point mode
        this.handleCancelClick();

        // Get keyword
        var keyword = document.getElementById('search-box').value;
        if (!keyword) {
            return;
        }

        // Show searching progress
        this.setState({
            searching: true
        });

        // Get search options
        var options = {};
        this.state.searchOptions.map(item => {
            options[item.value] = item.checked;
            return true;
        });

        // Initiate request
        request({
            url: SERVICE.search.url,
            method: SERVICE.search.method,
            params: {
                keyword: keyword,
                options: JSON.stringify(options)
            },
            successCallback: (res) => {
                // Display data
                this.setState({
                    addPointWrapperClose: false,
                    resultUnwrap: true,
                    data: res.data
                }, this.initMaterialbox);
            },
            finallyCallback: () => {
                // Show search button
                this.setState({
                    searching: false
                });
            }
        });
    }

    handlePreviewClick = (e, data) => {
        // Show marker and popup on map
        emitter.emit('displayTempLayer', data);
    }

    handlePreviewMapClick = () => {
        // Get GeoJSON from map
        emitter.emit('getPoint');

        this.setState({
            addPointUnwrap: false
        });
    }

    handleSubmitClick = () => {
        // Remove temp point
        emitter.emit('removeTempPoint');

        // Show button progress
        this.setState({
            submitting: true
        });

        // Generate request parameters
        var params = {
            name: document.getElementById('name').value,
            pinyin: document.getElementById('pinyin').value,
            introduction: document.getElementById('introduction').value,
            image: this.state.previewImage ? this.state.previewImage : {},
            geometry: this.state.geometry
        };

        // Initiate request
        request({
            url: SERVICE.insert.url,
            method: SERVICE.insert.method,
            params: params,
            successCallback: (res) => {
                // Show snackbar
                emitter.emit('showSnackbar', 'success', `Insert new object with Gid = '${res.gid}' successfully.`);

                this.handleCancelClick();
            },
            finallyCallback: () => {
                this.setState({
                    searching: false,
                    submitting: false
                });
            }
        });
    }

    handleCancelClick = () => {
        // Remove temp point
        emitter.emit('removeTempPoint');

        // Empty input box
        document.getElementById('name').value = '';
        document.getElementById('pinyin').value = '';
        document.getElementById('introduction').value = '';

        // Reset data
        this.resetPreviewImage();
        this.resetNewPointData();

        // Wrap add point panel
        this.setState({
            addPointUnwrap: false
        });
    }

    handleRowUpdate = (newData, oldData) => {
        return new Promise(resolve => {
            // Check if Gid changed
            if (oldData.gid !== newData.gid) {
                emitter.emit('showSnackbar', 'error', "Column 'Gid' is readonly.");
            }

            // Generate request parameters
            var params = {
                gid: oldData.gid
            };

            if (this.state.previewImage) {
                newData.image = this.state.previewImage;
            } else {
                newData.image = {};
            }

            Object.keys(newData).map(key => {
                if (key !== 'geometry' && newData[key] !== oldData[key]) {
                    params[key] = newData[key]
                }
                return true;
            });

            // return if nothing to update
            if (checkEmptyObject(params)) {
                emitter.emit('showSnackbar', 'default', 'Nothing to update.');
                return;
            }

            // Initiate request
            request({
                url: SERVICE.update.url,
                method: SERVICE.update.method,
                params: params,
                successCallback: (res) => {
                    // Show success snackbar
                    var message = `Update ${res.count} ${res.count > 1 ? 'objects' : 'object'} successfully.`;
                    emitter.emit('showSnackbar', 'success', message);

                    // Refresh table
                    var data = this.state.data;
                    data[data.indexOf(oldData)] = newData;
                    this.setState({
                        data: data
                    });
                },
                finallyCallback: () => {
                    // Resolve promise
                    resolve();

                    // Exit edit mode
                    this.handleDoneEdit();
                }
            });
        });
    }

    handleRowDelete = (oldData) => {
        return new Promise(resolve => {
            // Initiate request
            request({
                url: SERVICE.delete.url,
                method: SERVICE.delete.method,
                params: {
                    gid: oldData.gid
                },
                successCallback: (res) => {
                    // Show success snackbar
                    var message = `Delete ${res.count} ${res.count > 1 ? 'objects' : 'object'} successfully.`;
                    emitter.emit('showSnackbar', 'success', message);

                    // Refresh table
                    var data = [...this.state.data];
                    data.splice(data.indexOf(oldData), 1);
                    this.setState({ ...this.state, data });
                },
                finallyCallback: () => {
                    // Resolve promise
                    resolve();

                    // Remove temp layer
                    emitter.emit('removeTempLayer');

                    // Exit edit mode
                    this.handleDoneEdit();
                }
            });
        });
    }

    componentDidMount() {
        // Initialize popover
        var anchorEl = document.getElementById('anchorEl');
      //  this.fetchData();
        // Initialize file reader
        var reader = new FileReader();
        reader.onload = (e) => {
            // Get image info
            var image = new Image();
            image.src = e.target.result;

            // Construct preview image object
            var previewImage = {
                longitude: image.height > image.width,
                src: e.target.result
            }

            // Preview image
            this.setState({
                previewImage: previewImage
            });
        };

        this.setState({
            reader: reader,
            anchorEl: anchorEl
        });

        // Bind event listeners
        this.openDataControllerListener = emitter.addListener('openDataController', () => {
            this.setState({
                open: true
            });
         });

        this.closeAllControllerListener = emitter.addListener('closeAllController', () => {
            this.setState({
                open: false
            });
        });

        this.updatePointListener = emitter.addListener('setPoint', (feature, styleCode, zoom) => {
            var [lng, lat] = feature.geometry.coordinates;
            var previewMapUrl = `https://api.mapbox.com/styles/v1/${styleCode}/static/pin-s+f00(${lng},${lat})/${lng},${lat},${zoom},0,1/250x155@2x?access_token=${ACCESS_TOKEN}`;

            this.setState({
                addPointUnwrap: true,
                previewMapUrl: previewMapUrl,
                geometry: feature,
                previewCoordinate: {
                    lng: parseFloat(lng).toFixed(3),
                    lat: parseFloat(lat).toFixed(3)
                }
            });
        });
    }

 
    
   
    processAnimalSightings = (dataString) => {
        let data;
        // Intentar parsear el string JSON a un objeto JavaScript
        try {
            data = JSON.parse(dataString);
            if (!Array.isArray(data)) {
                throw new Error("Parsed data is not an array");
            }
        } catch (error) {
            console.error("Error parsing data:", error);
            this.setState({ loading: false, error: "Invalid data format received" });
            return;
        }
    
        const getRandomColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };
    
        // Crear un conjunto único de especies
        const speciesSet = data.reduce((acc, item) => {
            Object.keys(item).forEach(key => {
                if (key !== 'date' && key !== 'localidad') {
                    acc.add(key);
                }
            });
            return acc;
        }, new Set());
    
        // Crear trazas para cada especie
        const traces = Array.from(speciesSet).map(specie => ({
            type: 'bar',
            name: specie,
            x: data.map(item => new Date(item.date)),
            y: data.map(item => item[specie] || 0),
            marker: { color: getRandomColor() }
        }));
    
        this.setState({
            animalData: traces,
            loading: false
        });
    }
    
    
    

    componentWillUnmount() {
        // Remove event listeners
        emitter.removeListener(this.openDataControllerListener);
        emitter.removeListener(this.closeAllControllerListener);
        emitter.removeListener(this.addPointListener);
        emitter.removeListener(this.updatePointListener);

        // Destory Materialbox
        //                         {loading ? <p>Cargando datos...</p> : <Plot data={traces} layout={layout} />}

        var elems = document.querySelectorAll('.materialboxed');
        elems.map(elem => elem.destory());
    }

    render() {
        const { layout, animalData } = this.state;
        
        return (
            <MuiThemeProvider theme={theme}>
                <Slide direction="left" in={this.state.open}>
                    <Card style={styles.root}>
                        {/* Card header */}
                        <CardContent style={styles.header}>

                        <Carousel enableSwipe={false}>
                        <Plot data={animalData} layout={layout} />
                        </Carousel>

                        </CardContent>
                    </Card>
                </Slide>
            </MuiThemeProvider >
        );
    }
}

export default DataController;
