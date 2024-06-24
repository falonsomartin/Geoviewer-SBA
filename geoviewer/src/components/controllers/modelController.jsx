/* Written by Ye Liu */

import React from 'react';
import M from 'materialize-css';
import Slide from '@material-ui/core/Slide';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography, Icon, IconButton } from '@material-ui/core';
  
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';

import emitter from '@utils/events.utils';
import request from '@utils/request.utils';
import { checkEmptyObject } from '@utils/method.utils';
import { ACCESS_TOKEN, SERVICE } from '@/config';

import '@styles/dataController.style.css';
import ControlledAccordions from '@components/componentsJS/ControlledAccordions_';

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
        zIndex: 900
    },
    rooot: {
        width: '100%',
      },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
      },
      secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
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

class ModelController extends React.Component {
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
        layoutTemperature: {
            title: 'Temperatura del Aire HC',
            xaxis: {
                title: 'Fecha',
                type: 'date'
            },
            yaxis: { title: 'Temperatura (°C)' }
        },
        layoutPrecipitation: {
            title: 'Precipitación',
            xaxis: {
                title: 'Fecha',
                type: 'date'
            },
            yaxis: { title: 'Precipitación (mm)' }
        },
        layoutWatsat: {
            title: 'Modelo Watsat',
            xaxis: {
                title: 'Fecha',
                type: 'date'
            },
            yaxis: { title: 'Contenido Volumétrico de Agua' }
        },
        layout: {
            barmode: 'stack',
            title: 'Avistamientos de insectos por día',
            xaxis: {
                title: 'Fecha',
                type: 'date'
            },
            yaxis: { title: 'Cantidad' }
        },
        items: [
            {id: 1, title: 'item #1'},
            {id: 2, title: 'item #2'},
            {id: 3, title: 'item #3'},
            {id: 4, title: 'item #4'},
            {id: 5, title: 'item #5'}
          ]
        ,
        data: [],
        expanded:false,
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

    calculateSustainabilityIndex = () => {
        let IoValue = this.state.Io === 1 ? this.state.IoType : 0; // Ajustar el valor de Io basado en si se aplica o no fertilizante
        const index = 2.45 * this.state.Ic + 2.18 * this.state.Ih + 1.64 * this.state.Ig + 1.09 * IoValue + 1 * this.state.If;
        this.setState({
            sustainabilityIndex:index
        })
    };

    handleDecision = (choice) => {
        this.setState({ decision: choice });
      };    

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

    handleDataSubmit = (data) => {
        this.setState({url: data.output})
        console.log("Datos recibidos en ModelController:", data.output);
        emitter.emit('moveURL', this.state.url);
        // Puedes manejar los datos como desees aquí
      };

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

    handleSelectChange = (event) => {
        this.setState({ [event.target.name]: Number(event.target.value) });
    };

    calculateSustainabilityIndex = () => {
        const { Ic, Ih, Ig, Io, If, IoType } = this.state;
        let IoValue = Io === 1 ? IoType : 0;
        const index = 2.45 * Ic + 2.18 * Ih + 1.64 * Ig + 1.09 * IoValue + 1 * If;
        this.setState({ sustainabilityIndex: index });
    };

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
        this.openModelControllerListener = emitter.addListener('openModelController', () => {
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


    
        this.moveURListener = emitter.addListener('moveURL', () => {
            this.moveURL();
        });
    }

    
    setIc(e){
        this.setState({
            Ic:e
        })
    }
    setIh(e){
        this.setState({
            Ih:e
        })
    }
    setIg(e){
        this.setState({
            Ig:e
        })
    }
    setIo(e){
        this.setState({
            Io:e
        })
    }
    setIoType(e){
        this.setState({
            IoType:e
        })
    }
    setIf(e){
        this.setState({
            If:e
        })
    }

    moveURL = () => {
        var url = this.state.url
        this.setState({ movedURL: url });
        console.log(this.state.movedURL)

    }
    processTemperatureData = (data) => {
        const trace = {
            type: 'scatter', 
            mode: 'lines',
            x: data.map(item => new Date(item.sampling_date)),
            y: data.map(item => item.measurement_value),
            name: 'Temperatura del Aire HC',
        };

        this.setState(({
            temperatureData: [trace],
            loading: false // Mantiene el estado de carga si hay más datos por cargar
        }));
    }

    processPrecipitationData = (data) => {
        const trace = {
            type: 'scatter',
            mode: 'lines',
            x: data.map(item => new Date(item.sampling_date)),
            y: data.map(item => item.measurement_value),
            name: 'Precipitación'
        };

        this.setState({ precipitationData: [trace], loading: false });
    }


    componentWillUnmount() {
        // Remove event listeners
        emitter.removeListener(this.openModelControllerListener);
        emitter.removeListener(this.closeAllControllerListener);
        emitter.removeListener(this.addPointListener);
        emitter.removeListener(this.updatePointListener);
        emitter.removeListener(this.moveURListener);


        // Destory Materialbox
        //                         {loading ? <p>Cargando datos...</p> : <Plot data={traces} layout={layout} />}

        var elems = document.querySelectorAll('.materialboxed');
        elems.map(elem => elem.destory());
    }

    render() {        
        return (
            <MuiThemeProvider theme={theme}>
                <Slide direction="left" in={this.state.open}>
                    <Card style={styles.root}>
                        {/* Card header */}
                        <CardContent style={styles.header}>
                        <Typography variant="h5" className={styles.title}>Digital Soil Mapping</Typography>
                        &nbsp;&nbsp;
            <ControlledAccordions onSubmit={this.handleDataSubmit}/>
            <IconButton style={styles.closeBtn} aria-label="Close" onClick={this.handleCloseClick}>
                                <Icon fontSize="inherit">chevron_right</Icon>
                            </IconButton>
                        </CardContent>
                    </Card>
                </Slide>
            </MuiThemeProvider >
        );
    }
}

export default ModelController;