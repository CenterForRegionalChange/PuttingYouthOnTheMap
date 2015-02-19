/* Configuration file for the ROI webmap
    Copyright (C) 2015  Center for Regional Change, University of California, Davis

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/* Author:
 Anthony Preston; VESTRA Resources, Inc.; 2012
 under contract to the Center for Regional Change, University of California, Davis
 */

dojo.require("esri.map");
dojo.require("esri.dijit.Legend");
dojo.require("esri.dijit.Scalebar");
dojo.require("esri.arcgis.utils");
dojo.require("esri.IdentityManager");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.dijit.BasemapGallery");
dojo.require("dijit.dijit");
// optimize: load dijit layer
dojo.require("esri.tasks.query");
dojo.require("dijit.form.CheckBox");
dojo.require("esri.toolbars.navigation");
dojo.require("esri.dijit.Print");
dojo.require("esri.tasks.PrintTask");

var maps = [], fLayers = [], locateGfx = [], layersDialog, idSymbol, idHighSymbol, lastIdEvt = null, locator = null, 
priorMapWidths = [0, 0, 0], mapCount = 0, mapChange = false, mapExtent, firstMap = false, mapsLoaded = 0, schoolResults = [], 
geocodeMapIndex = 0, printMapIndex = 0, syncLoc = true, syncLevel = true, sync = false, numMapsSyncCheck = 0, 
mapsResized = 0, mapsResizedTest = 0, mapExtent, mapCenter, mapScale, widgetPrint, 
basemapGallery = null, caExtent = null, jqueryReadyChecks = 0, mouseDown = 0, 
visibleSvcByMap = {
    "0" : null,
    "1" : null,
    "2" : null
}, activeBottomTab = "", currentBaseMapName = "", layerList = [], domainLayerNames = [], tocList = {
    count : 0
}, tocActiveMap = -1, numPanels = 3;

//show map on load
dojo.addOnLoad(init);

function init() {'use strict';
    initMaps();
}

function initMaps() {'use strict';
    caExtent = new esri.geometry.Extent(CA_EXTENT_JSON);
    // mapCount = 0;

    $("#mapDiv0").mouseover(function(e) {
        if (mouseDown === 0) {
            mapCount = 0;
        }
    });
    $("#mapDiv1").mouseover(function(e) {
        if (mouseDown === 0) {
            mapCount = 1;
        }
    });
    $("#mapDiv2").mouseover(function(e) {
        if (mouseDown === 0) {
            mapCount = 2;
        }
    });

    //Find Address
    locator = new esri.tasks.Locator(GEOCODE_URL);
    dojo.connect(locator, "onAddressToLocationsComplete", showGeocodeResults);

    jqueryReadyChecks += 1;
    finalizeJQueryIfReady();
}

function resizeMaps(n) {'use strict';
    var i, $maps = $('.map');

    sync = false;
    mapsResized = n;
    numMapsSyncCheck = 0;
    mapsResizedTest = 0;

    for ( i = 0; i < numPanels; i += 1) {
        if (maps[i] !== null) {
            maps[i].resize();
            if (n === 0 && parseInt($maps.eq(i).css('width').replace('px', ''), 10) !== priorMapWidths[i]) {
                mapsResized += 1;
            }
        }
    }
}

function afterMapResized() {'use strict';
    mapsResizedTest += 1;
    if (sync === false) {
        numMapsSyncCheck += 1;
        if (numMapsSyncCheck === mapsResized) {
            mapsResized = 0;
            enableSyncing();
        }
    }
}

function enableSyncing() {'use strict';
    sync = true;
    syncMaps();
}

function syncMaps() {'use strict';
    if (sync === true) {
        var i, numVisibleMaps = $('#numPanelsSelected').get(0).selectedIndex + 1;

        if (syncLoc === true && syncLevel === false) {
            if (mapExtent !== maps[mapCount].extent) {
                mapExtent = maps[mapCount].extent;
                mapCenter = maps[mapCount].extent.getCenter();
                for ( i = 0; i < numVisibleMaps; i += 1) {
                    if (maps[i] !== null) {
                        if (i !== mapCount) {
                            maps[i].centerAt(mapCenter);
                        }
                    }
                }
            }
        } else if (syncLoc === false && syncLevel === true) {
            if (mapScale !== maps[mapCount].getLevel()) {
                mapScale = maps[mapCount].getLevel();
                for ( i = 0; i < numVisibleMaps; i += 1) {
                    if (maps[i] !== null) {
                        if (i !== mapCount) {
                            maps[i].setLevel(mapScale);
                        }
                    }
                }
            }
        } else if (syncLoc === true && syncLevel === true) {
            if (mapExtent !== maps[mapCount].extent) {
                mapExtent = maps[mapCount].extent;
                for ( i = 0; i < numVisibleMaps; i += 1) {
                    if (maps[i] !== null) {
                        if (i !== mapCount) {
                            maps[i].setExtent(mapExtent);
                        }
                    }
                }
            }
        }
    }
}

function createMap(j) {'use strict';
    // Setup the popup window for identify results
    var tempMap, b, bl, tempBasemapOption, $basemaps = $('#baseMapSelected');
    //popup = new esri.dijit.Popup({ marginTop: 80,
    //    fillSymbol: new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
    //                                                 new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
    //                                                 new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]))
    //}, dojo.create("div"));

    //remember to add your server to the proxy.config as a fallback from CORS

    idSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 2), new dojo.Color([0, 0, 0, 0]));
    idHighSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 225, 255]), 2), new dojo.Color([0, 0, 0, 0]));

    tempMap = new esri.Map("mapDiv" + j, {
        extent : caExtent,
        slider : false,
        showInfoWindowOnClick : false,
        showAttribution : false,
        logo : false
    });
    maps.push(tempMap);
    fLayers = {};
    locateGfx.push(new esri.layers.GraphicsLayer());

    dojo.connect(tempMap, "onLoad", function() {
        // Set up event handler for map click
        dojo.connect(maps[j], "onClick", function(evt) {
            var mapIndex, idQueryTask, idQuery;
            //, geographicPoint = esri.geometry.webMercatorToGeographic(evt.mapPoint);

            mapIndex = parseInt(this.id.replace('mapDiv', ''), 10);
            if ($('#rdoClickIdentify').get(0).checked) {

                idQueryTask = new esri.tasks.QueryTask(SERVICES[OP_MAPS[mapIndex].svcIndex].url + "FeatureServer/" + OP_MAPS[mapIndex].lyrIndex);
                idQuery = new esri.tasks.Query();

                OP_MAPS[mapIndex].idPoint = evt.mapPoint;
                idQuery.geometry = evt.mapPoint;
                idQuery.returnGeometry = true;
                idQuery.outSpatialReference = maps[mapIndex].spatialReference;
                idQuery.outFields = ["*"];

                //$('#identify' + mapIndex).html("<tr><td>Loading...</tr></td>");
                idQueryTask.execute(idQuery, function(results) {
                    var i, il, key, val, feature, content, idResults = results.features, field, subData, displayAlias,
                        fl = fLayers[OP_MAPS[mapIndex].svcIndex]["f" + OP_MAPS[mapIndex].lyrIndex], moeText,
                        chartParams = SERVICES[OP_MAPS[mapIndex].svcIndex].chart[OP_MAPS[mapIndex].lyrIndex];

                    
                    if (idResults.length > 0 && (typeof (chartParams) === 'undefined' || chartParams === null)) {
                        feature = idResults[0];
                        
                        content = '<div class="id-details"><strong>' + $('#titleCon' + mapIndex + ' span').eq(0).html() + '<br/>' + feature.attributes[fl.displayField] + '</strong><hr/>';
                        
                        for (i = 0; i < POPUP_FIELDS.length; i += 1) {
                            if (feature.attributes.hasOwnProperty(POPUP_FIELDS[i].field)) {
                                content += '<strong>' + POPUP_FIELDS[i].title + ':</strong> ' + feature.attributes[POPUP_FIELDS[i].field] + '<br />';         
                            }   
                        }
                        /*
                        if (feature.attributes.hasOwnProperty(fl.rendererField)) {
                            content += '<strong>Value:</strong> ' + roundToDecimal(feature.attributes[fl.rendererField], 2);
                        }
						*/
                        content += '</div>';
                        
                        maps[mapIndex].graphics.clear();
                        maps[mapIndex].graphics.add(new esri.Graphic(feature.geometry, idSymbol, feature.attributes, null));
                        
                        $('#id-header' + mapIndex).html(content);
                        $('#id-chart' + mapIndex).empty();
                        $('#id-subchart' + mapIndex).empty();
                        $('#link-moe' + mapIndex).hide();
                        $('#value-moe' + mapIndex).empty().hide();
                        $('#link-chks' + mapIndex).hide();
                        $('#footnote-chks' + mapIndex).hide();
                        $('#bth-equity' + mapIndex).hide();
                        //$('#footnote-hover' + mapIndex).hide();
                        $('#chartValues' + mapIndex).html('<br/>');
                        $("#dialog-identify" + mapIndex).dialog("option", "title", "Map " + (mapIndex+1) + " - details: ");
                        
                        $('#bth-equity' + mapIndex).hide();
                        if (!($("#dialog-identify" + mapIndex).dialog("isOpen"))) {
                            $("#dialog-identify" + mapIndex).dialog("option", "position", {
                                my : "left top",
                                at : "left+5 bottom",
                                of : $("#titleCon" + mapIndex)
                            }).dialog('open');
                        }
                    } else if (idResults.length > 0) {
                        feature = idResults[0];
                                                
                        $('#id-header' + mapIndex).empty()
                            .append(((typeof(chartParams.tractField) === 'undefined' || chartParams.tractField === "") ? "" : '<p><b>Tract:</b> ' + feature.attributes[chartParams.tractField] + '</p>'))
                            .append(((typeof(chartParams.countyField) === 'undefined' || chartParams.countyField === "") ? "" : '<p><b>County:</b> ' + feature.attributes[chartParams.countyField] + '</p>'))
                            .append(((typeof(chartParams.ccdField) === 'undefined' || chartParams.ccdField === "") ? "" : '<p><b>CCD:</b> ' + feature.attributes[chartParams.ccdField] + '</p>'))
                            .append(((typeof(chartParams.districtField) === 'undefined' || chartParams.districtField === "") ? "" : '<p><b>District:</b> ' + feature.attributes[chartParams.districtField] + '</p>'));
                        $('#id-chart' + mapIndex).empty();
                        $('#id-subchart' + mapIndex).empty();
                        $('#link-moe' + mapIndex).hide();
                        $('#value-moe' + mapIndex).empty().hide();
                        $('#link-chks' + mapIndex).hide();
                        $('#footnote-chks' + mapIndex).hide();
                        //if (typeof(chartParams.hoverFormat) === 'undefined') {
                        //    $('#footnote-hover' + mapIndex).hide();
                        //} else {
                        //    $('#footnote-hover' + mapIndex).show();
                        //}
                        if (chartParams.showEquity) {
                            $('#bth-equity' + mapIndex).show();
                        } else {
                            $('#bth-equity' + mapIndex).hide();
                        }
                        
                        if (typeof(chartParams.valueLabel) !== 'undefined') {
                            displayAlias = chartParams.valueLabel;
                        } else {
                            displayAlias = "Value";
                        }
                        
                        /*
						if (typeof(chartParams.specificValueField) !== 'undefined') {
                            $('#id-header' + mapIndex).append('<p><b>' + displayAlias + ':</b> ' + roundToDecimal(feature.attributes[chartParams.specificValueField], 2) + '</p>');
                        } else if (chartParams.subs.length === 0) {
                            $('#id-header' + mapIndex).append('<p><b>' + displayAlias + ':</b> ' + roundToDecimal(feature.attributes[fl.rendererField], 2) + '</p>');
                        }
                        */                        
                        if (chartParams.showCHKS) {
                            $('#link-chks' + mapIndex).show().find('span').html(feature.attributes.AvgRR < 0 ? "n/a" : Math.round(feature.attributes.AvgRR * 100) + "%");
                            $('#footnote-chks' + mapIndex).show();
                        }
                        
                        if (feature.attributes.hasOwnProperty(fl.displayField)) {
                            $("#dialog-identify" + mapIndex).dialog("option", "title", "Map " + (mapIndex+1) + " - details for: " + feature.attributes[fl.displayField]);
                        } else {
                            $("#dialog-identify" + mapIndex).dialog("option", "title", "Unknown feature");
                        }

                        if (!($("#dialog-identify" + mapIndex).dialog("isOpen"))) {
                            $("#dialog-identify" + mapIndex).dialog("option", "position", {
                                my : "left top",
                                at : "left+5 bottom",
                                of : $("#titleCon" + mapIndex)
                            }).dialog('open');
                        }

                        maps[mapIndex].graphics.clear();
                        maps[mapIndex].graphics.add(new esri.Graphic(feature.geometry, idSymbol, feature.attributes, null));

                        field = chartParams.unit + (SERVICES[OP_MAPS[mapIndex].svcIndex].disagg.length > 0 ? "" + OP_MAPS[mapIndex].gender + OP_MAPS[mapIndex].eth + "1" : "");
                        // local field = chartParams.local + field
                        // regional field = chartParams.region + field
                        
                        if (chartParams.showMOE) {
                            moeText = (feature.attributes.hasOwnProperty(chartParams.local+field+'r') ? feature.attributes[chartParams.local+field+'r'] : 0);
                            if (moeText < 0) { moeText = 0; }
                            moeText = roundToDecimal(moeText, 2) + "%";
                            
                            $('#link-moe' + mapIndex).show();
                            $('#value-moe' + mapIndex).show().html(moeText);
                        }
                        
                        if (chartParams.showRates) {
                            $('#chartValues' + mapIndex).html('<strong>' + chartParams.categories[0] + " Rate:</strong> " + formatRate((chartParams.hasOwnProperty('hoverFormat') ? chartParams.hoverFormat : null), feature.attributes[chartParams.local + field + "v"]) + ", " 
                                                            + '<strong>' + chartParams.categories[1] + " Rate:</strong> " + formatRate((chartParams.hasOwnProperty('hoverFormat') ? chartParams.hoverFormat : null), feature.attributes[chartParams.region + field + "v"]) + '<br/>'); 
                        } else {
                            $('#chartValues' + mapIndex).html('');
                        }
                        
                        // make top chart for this layer's unit
                        $('#id-chart' + mapIndex).highcharts({
                            chart : {
                                type : 'column',
                                height: 200,
                                width: 280,
                                margin : [50, 30, 40, 40],
                                backgroundColor : '#ffffff',
                                borderColor: '#4572A7',
                                borderWidth: 1
                            },
                            title : {
                                text : chartParams.title 
                                            + (OP_MAPS[mapIndex].gender > 0 ? " (" + GENDER[OP_MAPS[mapIndex].gender] + ")" : "")
                                            + (OP_MAPS[mapIndex].eth > 0 ? " (" + ETH[OP_MAPS[mapIndex].eth] + ")" : "")
                                            + (chartParams.showCHKS ? "*" : ""),
                                style: {
                                    fontSize: "1.2em"
                                }
                            },
                            credits : {
                                enabled : false
                            },
                            legend : {
                                enabled : false
                            },
                            xAxis : {
                                categories : chartParams.categories
                            },
                            yAxis : {
                                title: null,
                                maxPadding: 0.5,
                                endOnTick : true,
                                tickInterval: (chartParams.scale === "%" ? 20 : chartParams.scale/5),
                                showLastLabel: (chartParams.scale === "%"),
                                gridLineWidth: 0,
                                min : 0,
                                max : (chartParams.scale === "%" ? 100 : chartParams.scale + 1),
                                labels: {
                                    format: '{value}' + (chartParams.scale === "%" ? "%" : "")
                                }
                                
                            },
                            tooltip : {
                                enabled : true,
                                followPointer : true,
                                formatter : function() {
                                    return this.point.hover + "This chart indicates how the<br/>selected area compares to the<br/>statewide average for this<br/>measurement.";
                                }
                            },
                            plotOptions : {
                                column : {
                                    cursor : "pointer",
                                    colorByPoint : true,
                                    borderWidth : 1,
                                    borderColor : '#000000',
                                    shadow : true,
                                    pointPadding : 0,
                                    //pointWidth : 80,
                                    dataLabels : {
                                        enabled : true,
                                        format: '{y}' + (chartParams.scale === "%" ? "%" : "")
                                    }
                                }
                            },
                            series : [{
                                data : [{
                                    name : 'Local',
                                    color : '#4F81BD',
                                    hover: chartHoverValue((chartParams.hasOwnProperty('hoverFormat') ? chartParams.hoverFormat : null), feature.attributes[chartParams.local + field + 'v']),
                                    y : (chartParams.scale === "%" ? Math.round(feature.attributes[chartParams.local + field] * 100) : feature.attributes[chartParams.local + field])
                                }, {
                                    name : 'Region',
                                    color : '#F79646',
                                    hover: chartHoverValue((chartParams.hasOwnProperty('hoverFormat') ? chartParams.hoverFormat : null), feature.attributes[chartParams.region + field + 'v']),
                                    y : (chartParams.scale === "%" ? Math.round(feature.attributes[chartParams.region + field] * 100) : feature.attributes[chartParams.region + field])
                                }]
                            }]
                        });


                        if (chartParams.subs.length > 0) {
                            subData = [];
                            
                            // make bottom chart for this layer's sub units
                            for (i = 0, il = chartParams.subs.length; i < il; i += 1) {
                                field = chartParams.local + chartParams.subs[i] + (SERVICES[OP_MAPS[mapIndex].svcIndex].disagg.length > 0 ? "" + OP_MAPS[mapIndex].gender + OP_MAPS[mapIndex].eth + "1" : "");
                                subData.push({
                                    field : field,
                                    name : chartParams.subs[i],
                                    color : (chartParams.subColors !== null ? chartParams.subColors[i] : '#9BBB59'),
                                    layerName: (chartParams.subLayerNames === null ? null : chartParams.subLayerNames[chartParams.subs[i]]),
                                    y : (chartParams.scale === "%" ? Math.round(feature.attributes[field] * 100) : feature.attributes[field])
                                });
                            }
                            
                            $('#id-subchart' + mapIndex).highcharts({
                                chart : {
                                    type : 'column',
                                    height: 200,
                                    width: 280,
                                    margin : [50, 30, 50, 40],
                                    backgroundColor : '#ffffff',
                                    borderColor: '#4572A7',
                                    borderWidth: 1
                                },
                                title : {
                                    text : chartParams.subTitle
                                                + (OP_MAPS[mapIndex].gender > 0 ? " (" + GENDER[OP_MAPS[mapIndex].gender] + ")" : "")
                                                + (OP_MAPS[mapIndex].eth > 0 ? " (" + ETH[OP_MAPS[mapIndex].eth] + ")" : "")
                                                + (chartParams.showCHKS ? "*" : ""),
                                    style: {
                                        fontSize: "1.2em"
                                    }
                                },
                                credits : {
                                    enabled : false
                                },
                                legend : {
                                    enabled : false
                                },
                                xAxis : {
                                    categories : chartParams.subCategories,
                                    labels: { 
                                        //step: 1
                                    }
                                },
                                yAxis : {
                                    title: null,
                                    maxPadding: 0.5,
                                    endOnTick : true,
                                    tickInterval: (chartParams.scale === "%" ? 20 : chartParams.scale/5),
                                    showLastLabel: (chartParams.scale === "%"),
                                    gridLineWidth: 0,
                                    min : 0,
                                    max : (chartParams.scale === "%" ? 100 : chartParams.scale + 1),
                                    labels: {
                                        format: '{value}' + (chartParams.scale === "%" ? "%" : "")
                                    }
                                    
                                },
                                tooltip : {
                                    enabled : (chartParams.subLayerNames !== null),
                                    followPointer : true,
                                    formatter : function() {
                                        return "Click to map this";
                                    }
                                },
                                plotOptions : {
                                    column : {
                                        cursor : "pointer",
                                        colorByPoint : true,
                                        borderWidth : 1,
                                        borderColor : '#000000',
                                        shadow : true,
                                        pointPadding : 0,
                                        //pointWidth : 80,
                                        dataLabels : {
                                            enabled : true,
                                            format: '{y}' + (chartParams.scale === "%" ? "%" : "")
                                        },
                                        point: {
                                            events: {
                                                click: function () {
                                                    var idx = mapIndex, svc = OP_MAPS[idx].svcIndex;
                                                    //applyRenderer(idx, this.field);
                                                    if (this.layerName !== null) {
                                                        OP_MAPS[idx].rendererField = this.field;
                                                        loadLayerByName(idx, svc, this.layerName);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                series : [{
                                    data : subData
                                }]
                            });
                        }
                    }
                });

            } else {
                lastIdEvt = evt;
                $('#dialog-report').dialog('open');

                idForMap(0, evt);
                idForMap(1, evt);
                idForMap(2, evt);
            }
        });

        // Other events
        dojo.connect(maps[j], "onExtentChange", syncMaps);
        dojo.connect(maps[j], "onZoomEnd", enableSyncing);
        dojo.connect(maps[j], "onResize", afterMapResized);
        dojo.connect(maps[j], "onLayerAdd", processNewFeatLayer);
        dojo.connect(maps[j], "onUpdateEnd", function() {
            $('#mapLoading' + j).hide();
        });
        dojo.connect(maps[j].graphics, "onMouseOver", mapGfxOver);
        dojo.connect(maps[j].graphics, "onMouseOut", mapGfxOut);

        maps[j].addLayer(locateGfx[j]);

        mapsLoaded += 1;
        checkLoadToc();
    });

    // Load basemap layer(s)
    $basemaps.children().remove();
    for ( b = 0, bl = BASEMAPS.length; b < bl; b += 1) {
        tempBasemapOption = BASEMAPS[b];
        $basemaps.append('<option value="' + b + '"' + (b === 0 ? ' selected' : '') + '>' + tempBasemapOption.name + '</option>');
        tempMap.addLayer(new esri.layers.ArcGISTiledMapServiceLayer(tempBasemapOption.url, {
            id : tempBasemapOption.name,
            visible : (b === 0 ? true : false)
        }));
        if (b === 0) {
            currentBaseMapName = tempBasemapOption.name;
        }
    }

    //tempMap.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer", { id: "tempTransportation" }));
}

function formatRate(formatter, value) { 'use strict';
    //Math.round(feature.attributes[chartParams.local + field + "v"] * 100)
    var ret;
    if (typeof(value) === 'undefined') {
        ret = "";        
    } else if (value === -99) {        
        ret = "n/a";
    } else {
        if (formatter === null || formatter === "%") {
            // calc a percentage if no formatter was defined.
            if (value < 1) {
                value = value * 100;
            }
            ret = Math.round(value * 100)/100 + "%";
        } else {
            ret = formatter.replace('##', roundToDecimal(value, 2));
        }
    }
    
    return ret;
}

function equityChart(mapIndex, svcIndex, lyrIndex) { 'use strict';
    var idQueryTask, idQuery;
    
    idQueryTask = new esri.tasks.QueryTask(SERVICES[OP_MAPS[mapIndex].svcIndex].url + "FeatureServer/" + OP_MAPS[mapIndex].lyrIndex);
    idQuery = new esri.tasks.Query();

    idQuery.geometry = OP_MAPS[mapIndex].idPoint;
    idQuery.returnGeometry = true;
    idQuery.outSpatialReference = maps[mapIndex].spatialReference;
    idQuery.outFields = ["*"];

    idQueryTask.execute(idQuery, function(results) {
        var i, il, key, val, feature, content, idResults = results.features, field, chartData, chartCats,
            fl = fLayers[OP_MAPS[mapIndex].svcIndex]["f" + OP_MAPS[mapIndex].lyrIndex], showEthChart = false,
            chartParams = SERVICES[OP_MAPS[mapIndex].svcIndex].chart[OP_MAPS[mapIndex].lyrIndex],
            disaggParams = SERVICES[OP_MAPS[mapIndex].svcIndex].disagg[OP_MAPS[mapIndex].lyrIndex];

        if (idResults.length > 0) {
            feature = idResults[0];
            
            $('#equity-chart' + mapIndex).empty();
            $('#equity-subchart' + mapIndex).empty();
            $('#equity-link-moe' + mapIndex).hide();
            $('#equity-link-chks' + mapIndex).hide();
            $('#equity-footnote-chks' + mapIndex).hide();
            
            $('#equity-header' + mapIndex).empty()
                .append(((typeof(chartParams.tractField) === 'undefined' || chartParams.tractField === "") ? "" : '<p><b>Tract:</b> ' + feature.attributes[chartParams.tractField] + '</p>'))
                .append(((typeof(chartParams.countyField) === 'undefined' || chartParams.countyField === "") ? "" : '<p><b>County:</b> ' + feature.attributes[chartParams.countyField] + '</p>'))
                .append(((typeof(chartParams.ccdField) === 'undefined' || chartParams.ccdField === "") ? "" : '<p><b>CCD:</b> ' + feature.attributes[chartParams.ccdField] + '</p>'))
                .append(((typeof(chartParams.districtField) === 'undefined' || chartParams.districtField === "") ? "" : '<p><b>District:</b> ' + feature.attributes[chartParams.districtField] + '</p>'));
            
            $('#equity-link-chks' + mapIndex).hide();
            
            if (feature.attributes.hasOwnProperty(fl.displayField)) {
                $("#dialog-equity" + mapIndex).dialog("option", "title", "Map " + (mapIndex+1) + " - Equity Details for: " + feature.attributes[fl.displayField]);
            } else {
                $("#dialog-equity" + mapIndex).dialog("option", "title", "Unknown feature");
            }
                 
            if (chartParams.showCHKS) {
                $('#equity-link-chks' + mapIndex).show().find('span').html((feature.attributes.AvgRR < 0 ? "n/a" : Math.round(feature.attributes.AvgRR * 100) + "%"));
                $('#equity-footnote-chks' + mapIndex).show();
            }
            
            if (chartParams.showMOE) {
                $('#equity-link-moe' + mapIndex).show();
            }
            
            if (typeof(chartParams.hoverFormat) === 'undefined') {
                $('#equity-footnote-hover' + mapIndex).hide();
            } else {
                $('#equity-footnote-hover' + mapIndex).show();
            }

            if (!($("#dialog-equity" + mapIndex).dialog("isOpen"))) {
                $("#dialog-equity" + mapIndex).dialog("option", "position", {
                    my : "left top",
                    at : "left+5 bottom",
                    of : $("#titleCon" + mapIndex)
                }).dialog('open');
            }

            //maps[mapIndex].graphics.clear();
            //maps[mapIndex].graphics.add(new esri.Graphic(feature.geometry, idSymbol, feature.attributes, null));

            //field = chartParams.unit + OP_MAPS[mapIndex].gender + OP_MAPS[mapIndex].eth + "1";
            
            // make top chart for this layer's unit
            chartData = [{
                    name: "Males",
                    field: chartParams.local + chartParams.unit + '101',
                    color: '#4BACC6',
                    hover: chartHoverValue((chartParams.hasOwnProperty('hoverFormat') ? chartParams.hoverFormat : null), feature.attributes[chartParams.local + chartParams.unit + '101v']),
                    y: (chartParams.scale === "%" ? Math.round(feature.attributes[chartParams.local + chartParams.unit + '101'] * 100) : feature.attributes[chartParams.local + chartParams.unit + '101'])
                },{
                    name: "Females",
                    field: chartParams.local + chartParams.unit + '201',
                    color: '#8064A2',
                    hover: chartHoverValue((chartParams.hasOwnProperty('hoverFormat') ? chartParams.hoverFormat : null), feature.attributes[chartParams.local + chartParams.unit + '201v']),
                    y: (chartParams.scale === "%" ? Math.round(feature.attributes[chartParams.local + chartParams.unit + '201'] * 100) : feature.attributes[chartParams.local + chartParams.unit + '201'])
                }];
            chartCats = ["Males", "Females"];
            
            $('#equity-chart' + mapIndex).highcharts({
                chart : {
                    type : 'column',
                    height: 180,
                    width: 280,
                    margin : [50, 30, 40, 40],
                    backgroundColor : '#ffffff',
                    borderColor: '#4572A7',
                    borderWidth: 1
                },
                title : {
                    text : chartParams.title + " by Sex" + (chartParams.showCHKS ? "*" : ""),
                    style: {
                        fontSize: "1.2em"
                    }
                },
                credits : {
                    enabled : false
                },
                legend : {
                    enabled : false
                },
                xAxis : {
                    categories : chartCats
                },
                yAxis : {
                    title: null,
                    maxPadding: 0.5,
                    endOnTick : true,
                    tickInterval: (chartParams.scale === "%" ? 20 : chartParams.scale/5),
                    showLastLabel: (chartParams.scale === "%"),
                    gridLineWidth: 0,
                    min : 0,
                    max : (chartParams.scale === "%" ? 100 : chartParams.scale + 1),
                    labels: {
                        format: '{value}' + (chartParams.scale === "%" ? "%" : "")
                    }
                    
                },
                tooltip : {
                    enabled : true,
                    followPointer : true,
                    formatter : function() {
                        return this.point.hover + "Click to map";
                    }
                },
                plotOptions : {
                    column : {
                        cursor : "pointer",
                        colorByPoint : true,
                        borderWidth : 1,
                        borderColor : '#000000',
                        shadow : true,
                        pointPadding : 0,
                        //pointWidth : 80,
                        dataLabels : {
                            enabled : true,
                            format: '{y}' + (chartParams.scale === "%" ? "%" : "")
                        },
                        point: {
                            events: {
                                click: function () {
                                    var idx = mapIndex;
                                    applyRenderer(idx, this.field);
                                    OP_MAPS[idx].rendererField = this.field;
                                }
                            }
                        }
                    }
                },
                series : [{
                    data : chartData
                }]
            });

            for (key in disaggParams) {
                if (disaggParams.hasOwnProperty(key) 
                  && key !== "male" && key !== "female" && key !== "overall"
                  && disaggParams[key] !== false) {
                    showEthChart = true;
                    break;
                }
            }
            
            if (showEthChart) {             
                // make bottom chart for this layer's sub units
                chartData = [];
                chartCats = [];
                for (i = 1, il = ETH.length; i < il; i += 1) {
                    if (!(ETH[i] === "" || (ETH[i] === "Filipino" && disaggParams.filipino === false) || (ETH[i] === "Pac.Islander" && disaggParams.islander === false))) {
                        field = chartParams.local + chartParams.unit + '0' + i + '1';
                        chartCats.push(ETH[i]);
                        chartData.push({
                            name: ETH[i],
                            field: chartParams.local + chartParams.unit + '0' + i + '1',
                            color: '#4F81BD',
                            hover: chartHoverValue((chartParams.hasOwnProperty('hoverFormat') ? chartParams.hoverFormat : null), feature.attributes[field + 'v']),
                            y: (chartParams.scale === "%" ? Math.round(feature.attributes[field] * 100) : feature.attributes[field])
                        });
                    }
                }
                
                $('#equity-subchart' + mapIndex).highcharts({
                    chart : {
                        type : 'column',
                        height: 260,
                        width: 280,
                        margin : [50, 30, 90, 40],
                        backgroundColor : '#ffffff',
                        borderColor: '#4572A7',
                        borderWidth: 1
                    },
                    title : {
                        text : chartParams.title + " by Race/Ethnicity" + (chartParams.showCHKS ? "*" : ""),
                        style: {
                            fontSize: "1.2em"
                        }
                    },
                    credits : {
                        enabled : false
                    },
                    legend : {
                        enabled : false
                    },
                    xAxis : {
                        categories : chartCats,
                        labels: { 
                            rotation: -90
                        }
                    },
                    yAxis : {
                        title: null,
                        maxPadding: 0.5,
                        endOnTick : true,
                        tickInterval: (chartParams.scale === "%" ? 20 : chartParams.scale/5),
                        showLastLabel: (chartParams.scale === "%"),
                        gridLineWidth: 0,
                        min : 0,
                        max : (chartParams.scale === "%" ? 100 : chartParams.scale + 1),
                        labels: {
                            format: '{value}' + (chartParams.scale === "%" ? "%" : "")
                        }
                        
                    },
                    tooltip : {
                        enabled : true,
                        followPointer : true,
                        formatter : function() {
                            return this.point.hover + "Click to map";
                        }
                    },
                    plotOptions : {
                        column : {
                            cursor : "pointer",
                            colorByPoint : true,
                            borderWidth : 1,
                            borderColor : '#000000',
                            shadow : true,
                            pointPadding : 0,
                            //pointWidth : 80,
                            dataLabels : {
                                enabled : true,
                                format: '{y}' + (chartParams.scale === "%" ? "%" : "")
                            },
                            point: {
                                events: {
                                    click: function () {
                                        var idx = mapIndex;
                                        applyRenderer(idx, this.field);
                                        OP_MAPS[idx].rendererField = this.field;
                                    }
                                }
                            }
                        }
                    },
                    series : [{
                        data : chartData
                    }]
                }); 
            } else {
                $('#equity-subchart' + mapIndex).hide();
                
            }          
        }
    });
}

function chartHoverValue(formatter, value) { 'use strict';
    var ret;
    //(chartParams.scale === "%" ? Math.round(feature.attributes[chartParams.local + chartParams.unit + '101'] * 100) : feature.attributes[chartParams.local + chartParams.unit + '101v']) + "%"
    if (typeof(value) === 'undefined' || formatter === null) {
        ret = "";
    } else {
        if (formatter === "%") {
            // calc a percentage if no formatter was defined.
            if (value < 1) {
                value = value * 100;
            }
            ret = "Rate: " + Math.round(value * 100)/100 + "%<br/>";
        } else {
            ret = "Rate: " + formatter.replace('##', roundToDecimal(value, 2)) + "<br/>";
        }
    }
    
    return ret;
}

var currentTocIndex = 0;

function loadLayerByName(mapIndex, svcIndex, lyrName) {'use strict';
    var key, i, il, svc, found = false;

    //for (key in tocList) {
    //    if (tocList.hasOwnProperty(key) && !found) {
            svc = tocList[svcIndex];
            for ( i = 0, il = svc.length; i < il; i += 1) {
                if (svc[i].label === lyrName) {
                    if ($("#back" + mapIndex).button("option", "disabled")) {
                        $("#back" + mapIndex).button("option", "disabled", false);
                    }
                    setMapLayer(mapIndex, svc[i].svcIdx, svc[i].lyrIdx);
                    found = true;
                    break;
                }
            }
    //    }
    //}
}

function mapGfxOver(evt) {'use strict';
    var gfxId, mapIdx, fl;

    mapIdx = evt.currentTarget.id.replace('mapDiv', '').replace('_graphics_layer', '');
    //mapDiv0_graphics_layer
    fl = maps[parseInt(mapIdx, 10)].getLayer("tempFeatLyr" + mapIdx);

    if ($('#rdoClickReport').get(0).checked && typeof (evt.graphic.attributes) !== 'undefined') {
        gfxId = evt.graphic.attributes[fl.displayField].replace('.', '-');
        $('#' + gfxId + '_0 td, #' + gfxId + '_1 td, #' + gfxId + '_2 td').addClass('id-row-highlight');

        //if (!(typeof(OP_MAPS[0].selectedGraphics[gfxId + '_0']) === 'undefined'
        //   || typeof(OP_MAPS[0].selectedGraphics[gfxId + '_1']) === 'undefined'
        //   || typeof(OP_MAPS[0].selectedGraphics[gfxId + '_2']) === 'undefined')) {
        OP_MAPS[0].selectedGraphics[gfxId + '_0'].setSymbol(idHighSymbol);
        OP_MAPS[1].selectedGraphics[gfxId + '_1'].setSymbol(idHighSymbol);
        OP_MAPS[2].selectedGraphics[gfxId + '_2'].setSymbol(idHighSymbol);
        //}
    }
}

function mapGfxOut(evt) {'use strict';
    var gfxId, mapIdx, fl;

    mapIdx = evt.currentTarget.id.replace('mapDiv', '').replace('_graphics_layer', '');
    //mapDiv0_graphics_layer
    fl = maps[parseInt(mapIdx, 10)].getLayer("tempFeatLyr" + mapIdx);

    if ($('#rdoClickReport').get(0).checked && typeof (evt.graphic.attributes) !== 'undefined') {
        gfxId = evt.graphic.attributes[fl.displayField].replace('.', '-');
        $('#' + gfxId + '_0 td, #' + gfxId + '_1 td, #' + gfxId + '_2 td').removeClass('id-row-highlight');

        OP_MAPS[0].selectedGraphics[gfxId + '_0'].setSymbol(idSymbol);
        OP_MAPS[1].selectedGraphics[gfxId + '_1'].setSymbol(idSymbol);
        OP_MAPS[2].selectedGraphics[gfxId + '_2'].setSymbol(idSymbol);
    }
}

function idForMap(mapIndex, evt) {'use strict';
    var idQueryTask = new esri.tasks.QueryTask(SERVICES[OP_MAPS[mapIndex].svcIndex].url + "FeatureServer/" + OP_MAPS[mapIndex].lyrIndex), idQuery = new esri.tasks.Query(), geographicPoint;

    idQuery.geometry = evt.mapPoint;
    idQuery.returnGeometry = true;
    idQuery.outSpatialReference = maps[mapIndex].spatialReference;
    idQuery.outFields = ["*"];

    //$('#identify' + mapIndex).html("<tr><td>Loading...</tr></td>");
    idQueryTask.execute(idQuery, function(results) {
        var feature, content, renderField, idResults = results.features, fl = maps[mapIndex].getLayer("tempFeatLyr" + mapIndex), gfx, gfxId, $el;

        //maps[mapIndex].graphics.clear();
        if (idResults.length > 0) {
            feature = idResults[0];
            renderField = fl.renderer.attributeField;

            gfxId = feature.attributes[fl.displayField].replace('.', '-') + '_' + mapIndex;

            if (OP_MAPS[mapIndex].selectedGraphics.hasOwnProperty(gfxId) && OP_MAPS[mapIndex].selectedGraphics[gfxId] !== null) {
                $('#' + gfxId).remove();
                maps[mapIndex].graphics.remove(OP_MAPS[mapIndex].selectedGraphics[gfxId]);
                OP_MAPS[mapIndex].selectedGraphics[gfxId] = null;
            } else {
                //content = '<tr class="id-results-head"><td>' + fl.displayField + ": </td><td>" + feature.attributes[fl.displayField] + '</td>'
                //        + '<tr><td class="id-results-left">' + renderField + ': </td><td class="id-results-right">' + feature.attributes[renderField] + '</td></tr>';
                content = '<tr id="' + gfxId + '"><td class="id-results-left">' + (feature.attributes.hasOwnProperty(fl.displayField) ? feature.attributes[fl.displayField] : "??") + ': </td><td class="id-results-right">' + (feature.attributes.hasOwnProperty(renderField) ? roundToDecimal(feature.attributes[renderField], 2) : "no data") + '</td></tr>';

                $('#identify' + mapIndex).append(content);

                gfx = new esri.Graphic(feature.geometry, idSymbol, feature.attributes, null);
                OP_MAPS[mapIndex].selectedGraphics[gfxId] = gfx;
                maps[mapIndex].graphics.add(gfx);
            }
        }
    });
}

function checkLoadToc() {'use strict';
    if (mapsLoaded === 3) {
        var i, il, m, ml, tempConfig, tempOb, $toc = $('#toc');

        for (i = 0, il = SERVICES.length; i < il; i += 1) {
            tempConfig = SERVICES[i];
            $toc.append('<div id="toc-svc-' + i + '"></div>');
            for ( m = 0; m < 3; m += 1) {
                tempOb = new esri.layers.ArcGISDynamicMapServiceLayer(tempConfig.url + 'MapServer', {
                    opacity : 0.8,
                    id : tempConfig.name
                });
                tempConfig.layerObs.push(tempOb);

                addLayerHandlers(tempOb, tempConfig, m, i);
            }
        }
    };
	enableSyncing()
}

function addLayerHandlers(layerOb, cfg, mapIdx, svcIdx) {'use strict';
    dojo.connect(layerOb, "onLoad", function(lyr) {
        if (!tocList.hasOwnProperty(svcIdx)) {
            var data = [], $lyrList = $('<ul class="layer-group-header"></ul>'), i, il, tocData = [];

            createToc($lyrList, lyr.layerInfos, mapIdx, svcIdx, data);
            tocList[svcIdx] = data;
            tocList.count += 1;

            $('#toc-svc-' + svcIdx).html($lyrList);

            if (tocList.count === SERVICES.length) {
                for ( i = 0, il = tocList.count; i < il; i += 1) {
                    tocData = tocData.concat(tocList[i]);
                }
                $("#toc-search").catcomplete({
                    delay : 0,
                    source : tocData,
                    select : function(event, ui) {
                        setMapLayer(-1, ui.item.svcIdx, ui.item.lyrIdx);
                    }
                });
            }
        }

        if (cfg.defaultForMap !== null) {
            for ( i = 0, il = cfg.defaultForMap.length; i < il; i += 1) {
                if (cfg.defaultForMap[i] === mapIdx) {
                    OP_MAPS[mapIdx].svcIndex = svcIdx;
                    OP_MAPS[mapIdx].lyrIndex = cfg.defaultLayerIndex[i];

                    lyr.setVisibleLayers([cfg.defaultLayerIndex[i]]);
                    visibleSvcByMap[mapIdx] = lyr.id;
                    setMapLayer(mapIdx, svcIdx, cfg.defaultLayerIndex[i]);

                    $('#titleCon' + mapIdx + ' span').eq(0).html((lyr.layerInfos[cfg.defaultLayerIndex[i]].name || "Untitled Layer"));

                    maps[mapIdx].addLayer(lyr);
                }
            }
        }

        /*if (cfg.defaultForMap === mapIdx) {
         OP_MAPS[mapIdx].svcIndex = svcIdx;
         OP_MAPS[mapIdx].lyrIndex = cfg.defaultLayerIndex;

         lyr.setVisibleLayers([cfg.defaultLayerIndex]);
         visibleSvcByMap[mapIdx] = lyr.id;
         setMapLayer(mapIdx, svcIdx, cfg.defaultLayerIndex);

         $('#titleCon' + mapIdx).html(lyr.layerInfos[cfg.defaultLayerIndex].name || "Untitled Layer");

         maps[mapIdx].addLayer(lyr);
         }*/
    });

    dojo.connect(layerOb, "onError", function(error) {
        alert("Error loading operational layer for map " + (mapIdx + 1) + ".\n\n" + error.message);
    });
}

function createDisaggOptions(svcIndex, lyrIndex) { 'use strict';
    var disagg = SERVICES[svcIndex].disagg[lyrIndex], disaggOptions = [];

    if (typeof(disagg) !== 'undefined') {
        disaggOptions.push($('<option value="' + disagg.overall + '">All</option>'));
        if (disagg.male) {
            disaggOptions.push($('<option value="' + disagg.male + '">Male</option>'));
        }
        if (disagg.female) {
            disaggOptions.push($('<option value="' + disagg.female + '">Female</option>'));
        }
        if (disagg.amind) {
            disaggOptions.push($('<option value="' + disagg.amind + '">American Indian/Alaskan Native</option>'));
        }
        if (disagg.asian) {
            disaggOptions.push($('<option value="' + disagg.asian + '">Asian/Asian American/Native Hawaiian/Filipino</option>'));
        }
        if (disagg.asian_nf) {
            disaggOptions.push($('<option value="' + disagg.asian_nf + '">Asian/Asian American</option>'));
        }
        if (disagg.black) {
            disaggOptions.push($('<option value="' + disagg.black + '">Black</option>'));
        }
        if (disagg.filipino) {
            disaggOptions.push($('<option value="' + disagg.filipino + '">Filipino</option>'));
        }
        if (disagg.hispanic) {
            disaggOptions.push($('<option value="' + disagg.hispanic + '">Hispanic/Latino</option>'));
        }
        if (disagg.islander) {
            disaggOptions.push($('<option value="' + disagg.islander + '">Native Hawaiian/Pacific Islander</option>'));
        }
        if (disagg.white) {
            disaggOptions.push($('<option value="' + disagg.white + '">White</option>'));
        }
        if (disagg.multi) {
            disaggOptions.push($('<option value="' + disagg.multi + '">Two or More Groups</option>'));
        }
    } else {
        disaggOptions.push($('<option value="">(not applicable)</option>'));
    }
    return disaggOptions;
}

function createToc($myLyrList, infos, mapIndex, svcIndex, outData) {'use strict';
    var i, il, $myNode, $mySubNode, info, category, disaggOptions;
    for (i = 0, il = infos.length; i < il; i += 1) {
        $myNode = $('<li></li>');
        info = infos[i];

        // create the <a> for the name of this layer, with no +/- tree box
        if (info.subLayerIds === null) {
            disaggOptions = createDisaggOptions(svcIndex, i);
            outData.push({
                label : info.name,
                disagg : disaggOptions,
                category : (typeof (category) === 'undefined' ? "Uncategorized" : category),
                svcIdx : svcIndex,
                lyrIdx : info.id
            });
            $myNode.append('<div><a id="lyrSel_' + mapIndex + '_' + info.id + '" class="selectable-layer" href="javascript:setMapLayer(-1,' + svcIndex + ',' + info.id + ')">' + info.name + '</a></div>');
            currentTocIndex = i;
        } else {
            // create the <div> for the +/- box and the name of this layer
            category = info.name;

            //if (info.name.toLowerCase().indexOf("domain") > -1 || info.name.toLowerCase().indexOf("index") > -1) {
            //    $myNode.addClass('no-bullet').append('<div class="has-sub-layers"><img class="layer-toggle" src="img/toc-plus.png"/> <a id="lyrSel_' + mapIndex + '_' + (info.id + 1) + '" href="javascript:setMapLayer(-1,' + svcIndex + ',' + (info.id + 1) + ')">' + info.name + '</a></div>');
            //} else {
                $myNode.addClass('no-bullet').append('<div class="has-sub-layers"><img class="layer-toggle" src="img/toc-plus.png"/> <span>' + info.name + '</span></div>');
            //}
            // call the recursive function to add nested nodes for each of the sub layers
            $mySubNode = $('<ul class="layer-group-header"></ul>');
            addTocNodeWithSubs($mySubNode, infos, info.subLayerIds, mapIndex, svcIndex, info.id, outData, category);
            $mySubNode.css('display', 'none');
            $myNode.append($mySubNode);
        }

        $myLyrList.append($myNode);

        // Before looping, set the master loop counter = to the last layer that was added inside all the recursion
        if (currentTocIndex > i) {
            i = currentTocIndex;
        }
    }
}

function addTocNodeWithSubs($node, infos, subIds, mapIndex, svcIndex, parentLyrIndex, outData, inCategory) {'use strict';
    var t = 0, k, kl, $myNode, $mySubNode, lyrIndex, info, disaggOptions = [];

    info = infos[parentLyrIndex];
    
    // add a toc entry for the first sub-layer if it's an indicator domain
    if (info.name.toLowerCase().indexOf("domain") > -1 || info.name.toLowerCase().indexOf("index") > -1) {
        //lyrIndex = subIds[0];
        //info = infos[lyrIndex];
        domainLayerNames.push(info.name);
        //disaggOptions = createDisaggOptions(svcIndex, lyrIndex);
        //if (subIds.length > 1) { t = 1; }
    }

    outData.push({
        label : info.name,
        disagg : disaggOptions,
        category : inCategory,
        svcIdx : svcIndex,
        lyrIdx : info.id
    });

    for (k = t, kl = subIds.length; k < kl; k += 1) {
        $myNode = $('<li></li>');
        lyrIndex = subIds[k];
        info = infos[lyrIndex];

        if (info.subLayerIds === null) {
            // create the <a> for the name of this layer, with no +/- tree box

            disaggOptions = createDisaggOptions(svcIndex, lyrIndex);
            outData.push({
                label : info.name,
                disagg : disaggOptions,
                category : inCategory,
                svcIdx : svcIndex,
                lyrIdx : info.id
            });
            $myNode.append('<div><a id="lyrSel_' + mapIndex + '_' + info.id + '" class="selectable-layer" href="javascript:setMapLayer(-1,' + svcIndex + ',' + info.id + ')">' + info.name + '</a></div>');
            currentTocIndex = lyrIndex;
        } else {
            // create the <div> for the +/- box and the name of this layer
            inCategory = info.name;
            $myNode.addClass('no-bullet').append('<div class="has-sub-layers"><img class="layer-toggle" src="img/toc-plus.png"/> <span>' + info.name + '</span></div>');

            // call the recursive function to add nested nodes for each of the sub layers
            $mySubNode = $('<ul class="layer-group-header"></ul>');
            addTocNodeWithSubs($mySubNode, infos, info.subLayerIds, mapIndex, svcIndex, lyrIndex, outData, inCategory);
            $mySubNode.css('display', 'none');
            $myNode.append($mySubNode);
        }

        $node.append($myNode);
    }
}

function backMapLayer(mapIndex) {'use strict';
    if (OP_MAPS[mapIndex].lastSvcIndex !== -1) {
        setMapLayer(mapIndex, OP_MAPS[mapIndex].lastSvcIndex, OP_MAPS[mapIndex].lastLyrIndex);
    }
}

function setMapLayer(mapIndex, svcIndex, lyrIndex) {'use strict';
    var myLayer, oldVisSvc, featLyrId = "f" + lyrIndex, featLyr;

    $("#dialog-print").dialog('close');
    
    if (mapIndex === -1) {
        mapIndex = tocActiveMap;
        if ($("#back" + mapIndex).button("option", "disabled")) {
            $("#back" + mapIndex).button("option", "disabled", false);
        }
    }
    myLayer = SERVICES[svcIndex].layerObs[mapIndex];

    $('#mapLoading' + mapIndex).show();

    OP_MAPS[mapIndex].lastSvcIndex = OP_MAPS[mapIndex].svcIndex;
    OP_MAPS[mapIndex].lastLyrIndex = OP_MAPS[mapIndex].lyrIndex;
    OP_MAPS[mapIndex].svcIndex = svcIndex;
    OP_MAPS[mapIndex].lyrIndex = lyrIndex;

    oldVisSvc = maps[mapIndex].getLayer(visibleSvcByMap[mapIndex]);
    if ( typeof (oldVisSvc) !== "undefined") {
        oldVisSvc.setVisibleLayers([-1]);
    }

    // add layer to map now if it's not already
    if ( typeof (maps[mapIndex].getLayer(SERVICES[svcIndex].name)) === "undefined") {
        maps[mapIndex].addLayer(myLayer);
    }

    myLayer.setVisibleLayers([lyrIndex]);
    visibleSvcByMap[mapIndex] = myLayer.id;
    $('#titleCon' + mapIndex + ' span').eq(0).html(myLayer.layerInfos[lyrIndex].name || "Untitled Layer");
    $('#titleCon' + mapIndex + ' span').eq(1).html('');

    // remove the prior feature layer if there is one (it's only needed to pull description/legend info from, which is then cached elsewhere)
    if ( typeof (maps[mapIndex].getLayer("tempFeatLyr" + mapIndex)) !== "undefined") {
        maps[mapIndex].removeLayer(maps[mapIndex].getLayer("tempFeatLyr" + mapIndex));
    }

    if (!fLayers.hasOwnProperty(svcIndex)) {
        fLayers[svcIndex] = {};
    }

    // if the user already loaded this layer, use its cached info, else load it now.
    // its info will be cached in the callback event below (from the map's onLayerAdd event)
    if (fLayers[svcIndex].hasOwnProperty(featLyrId)) {
        setCachedLayerInfo(mapIndex, svcIndex, featLyrId);
    } else {
        featLyr = new esri.layers.FeatureLayer(SERVICES[svcIndex].url + 'FeatureServer/' + lyrIndex, {
            mode : esri.layers.FeatureLayer.MODE_SELECTION,
            id : "tempFeatLyr" + mapIndex
        });
        fLayers[svcIndex][featLyrId] = {
            legendInfo : [],
            description : "(no additional information)",
            name : "Unknown",
            displayField : "none",
            rendererField : "none"
        };
        maps[mapIndex].addLayer(featLyr);
    }

    // update the disaggregate UI options on the layer selection panel
    updateDisagg(mapIndex, true);

    // close the layers pane if the user got here from there
    //if ($('#layersPane' + mapIndex).css('display') === 'block') {
    //    $('#btnLayers' + mapIndex).click();
    //}
}

function processNewFeatLayer(lyr) {'use strict';
    // process this layer after its added to the map, and cache its info if it's a feature layer
    if (lyr.declaredClass === "esri.layers.FeatureLayer") {
        var valArray, myLabel, i, il, info, outlineColor, mapIndex = lyr.id.replace("tempFeatLyr", "");

        // get renderer info and store in legend info cache
        if ( typeof (lyr.renderer.infos) !== "undefined") {
            for ( i = lyr.renderer.infos.length - 1; i > -1; i -= 1) {
                //for (i = 0, il = lyr.renderer.infos.length; i < il; i += 1) {
                info = lyr.renderer.infos[i];
                outlineColor = "#002855";
                if ( typeof (info.symbol.outline.color) !== "undefined" && info.symbol.outline.color !== null) {
                    outlineColor = info.symbol.outline.color.toHex();
                }
                myLabel = info.label;
                /*valArray = info.label.split(' - ');
                 if (valArray.length === 2) {
                 myLabel = roundToDecimal(valArray[0], 2) + ' - ' + roundToDecimal(valArray[1], 2);
                 } else {
                 myLabel = info.label;
                 }*/

                fLayers[OP_MAPS[mapIndex].svcIndex]["f" + lyr.layerId].legendInfo.push({
                    label : myLabel,
                    color : info.symbol.color.toHex(),
                    outline : "#333333" //outlineColor
                });
            }
        }
        
        fLayers[OP_MAPS[mapIndex].svcIndex]["f" + lyr.layerId].renderer = lyr.renderer;
        fLayers[OP_MAPS[mapIndex].svcIndex]["f" + lyr.layerId].description = lyr.description;
        fLayers[OP_MAPS[mapIndex].svcIndex]["f" + lyr.layerId].name = lyr.name;
        fLayers[OP_MAPS[mapIndex].svcIndex]["f" + lyr.layerId].rendererField = lyr.renderer.attributeField;
        fLayers[OP_MAPS[mapIndex].svcIndex]["f" + lyr.layerId].displayField = lyr.displayField;
        
        setCachedLayerInfo(mapIndex, OP_MAPS[mapIndex].svcIndex, "f" + lyr.layerId);
    }
}

function updateDisagg(mapIndex, reset) {'use strict';
    // #active-map-title
    // #active-map-number
    // #active-map-disagg (select box)

    if (mapIndex === -1) {
        $('#active-map-disagg').empty().append('<option value="">(not applicable)</option>');
        OP_MAPS[mapIndex].gender = 0;
        OP_MAPS[mapIndex].eth = 0;   
    } else {
        var i, svcIndex = OP_MAPS[mapIndex].svcIndex, 
            lyrIndex = OP_MAPS[mapIndex].lyrIndex, node, list = tocList[svcIndex];
            
        for (i = 0; i < list.length; i += 1) {
            if (list[i].lyrIdx === lyrIndex) {
                node = list[i];
                break;
            }
        }
    
        $('#active-map-title').html(node.label);
        $('#active-map-number').html(mapIndex + 1);
        
        $('#active-map-disagg').empty().append(node.disagg);
        
        if (reset) {
            $('#active-map-disagg').prop('selectedIndex', 0);
        
            // reset the disaggregate factors in the map's state object (used for charting)
            OP_MAPS[mapIndex].gender = 0;
            OP_MAPS[mapIndex].eth = 0;        
        } else {
            $('#active-map-disagg').val(OP_MAPS[mapIndex].rendererField);
        }
    }
}

function applyRenderer(mapIndex, attribute) {'use strict';
    // dynamic layer stuff
    var svcIndex = OP_MAPS[mapIndex].svcIndex, optionsArray = [], disaggPart = attribute.substr(attribute.length - 3), drawingOptions = new esri.layers.LayerDrawingOptions();

    drawingOptions.renderer = new esri.renderer.ClassBreaksRenderer(fLayers[svcIndex]["f" + OP_MAPS[mapIndex].lyrIndex].renderer.toJson());
    //drawingOptions.renderer = fLayers[svcIndex]["f" + OP_MAPS[mapIndex].lyrIndex].renderer;
    drawingOptions.renderer.attributeField = attribute;

    // set the drawing options for the relevant layer
    // optionsArray index corresponds to layer index in the map service
    optionsArray[OP_MAPS[mapIndex].lyrIndex] = drawingOptions;
    //OP_MAPS[mapIndex].lyrIndex
    SERVICES[svcIndex].layerObs[mapIndex].setLayerDrawingOptions(optionsArray);

    // Store the current disaggregate factors in the state object for this map (will be used by charting to piece together which fields to chart)
    OP_MAPS[mapIndex].rendererField = attribute;
    OP_MAPS[mapIndex].gender = parseInt(disaggPart.charAt(0), 10);
    OP_MAPS[mapIndex].eth = parseInt(disaggPart.charAt(1), 10);
    
    if (OP_MAPS[mapIndex].gender > 0) {
        $('#titleCon' + mapIndex + ' span').eq(1).html(' (' + GENDER[OP_MAPS[mapIndex].gender] + ')');
    } else if (OP_MAPS[mapIndex].eth > 0) {
        $('#titleCon' + mapIndex + ' span').eq(1).html(' (' + ETH[OP_MAPS[mapIndex].eth] + ')');
    } else {
        $('#titleCon' + mapIndex + ' span').eq(1).html('');
    }
}

function setCachedLayerInfo(mapIndex, svcIndex, lyrId) {'use strict';
    var i, il, info, descParts, legendInfos = fLayers[svcIndex][lyrId].legendInfo, $legend = $('#legend' + mapIndex + ' ul');

    descParts = fLayers[svcIndex][lyrId].description.split('___');
    $legend.children().remove();
    
    $('#desc' + mapIndex).html('<b>' + fLayers[svcIndex][lyrId].name + ':</b><br/>' + descParts[0]);
    $('#titleCon' + mapIndex + ' img').attr('title', fLayers[svcIndex][lyrId].description.replace(/___/g,'\n\n').replace(/<br \/>/g,'\n'));
    $('#identify-layer' + mapIndex).html((SERVICES[svcIndex].layerObs[mapIndex].layerInfos[lyrId.replace("f", "")].name || "Untitled Layer"));

    OP_MAPS[mapIndex].rendererField = fLayers[svcIndex][lyrId].renderer.attributeField;
    
    if (lastIdEvt !== null) {
        //idForMap(0, lastIdEvt);
        idStartOver();
    }

    if ( typeof (legendInfos) !== "undefined" && legendInfos !== null) {
        for ( i = 0, il = legendInfos.length; i < il; i += 1) {
            info = legendInfos[i];
            $legend.append('<li><div style="border-color: ' + info.outline + '; background-color: ' + info.color + '"></div><div><span style="background-color: white;">&nbsp;' + info.label + '&nbsp;</span></div><br style="clear: both;"/></li>');
        }
    }
}

function updateTimeExtent(idx, yr) { 'use strict';
    var timeExtent = new esri.TimeExtent();
    timeExtent.startTime = new Date("1/1/" + yr + " UTC");
    maps[idx].setTimeExtent(timeExtent);
}

function changeBaseMap(baseMapIdx) {'use strict';
    var j, jl, i, il, thisBaseMapName, baseMapName = BASEMAPS[baseMapIdx].name;
    if (baseMapName !== currentBaseMapName) {
        currentBaseMapName = baseMapName;

        for ( j = 0, jl = maps.length; j < jl; j += 1) {
            for ( i = 0, il = BASEMAPS.length; i < il; i += 1) {
                thisBaseMapName = BASEMAPS[i].name;
                if (thisBaseMapName === currentBaseMapName) {
                    maps[j].getLayer(thisBaseMapName).setOpacity(1.0);
                    maps[j].getLayer(thisBaseMapName).show();
                } else {
                    maps[j].getLayer(thisBaseMapName).hide();
                }
            }
        }
    }
}

function idStartOver() {'use strict';
    maps[0].graphics.clear();
    maps[1].graphics.clear();
    maps[2].graphics.clear();
    $('#identify0').children().remove();
    $('#identify1').children().remove();
    $('#identify2').children().remove();
    OP_MAPS[0].selectedGraphics = {};
    OP_MAPS[1].selectedGraphics = {};
    OP_MAPS[2].selectedGraphics = {};
}


$(document).ready(function(e) {'use strict';
    $(document).mousedown(function(e) {
        mouseDown = 1;
    });
    $(document).mouseup(function(e) {
        mouseDown = 0;
    });

    //$(window).resize(function () {
    //    resizeMaps(3);
    //});

    layersDialog = $("#dialog-layers").dialog({
        position : {
            my : 'top',
            at : 'center',
            of : $('#titleCon1'),
            collision : 'none'
        },
        modal : false,
        height : 450,
        width : 350,
        show : "fade",
        hide : "fade",
        draggable : true,
        resizable : true,
        autoOpen : false,
        create : function(event, ui) {
            $(this).prev().addClass('layer-button-active');
        },
        close : function(event, ui) {
            $('button.layers-button').button('option', 'icons', {
                primary : 'ui-icon-triangle-1-e'
            }).removeClass('layer-button-active');
        }
    });

    $("#dialog-report").dialog({
        position : {
            my : 'top',
            at : 'top',
            of : $('body'),
            collision : 'none'
        },
        modal : false,
        maxHeight : 450,
        //maxWidth: 350,
        height : 'auto',
        width : 800,
        show : "fade",
        hide : "fade",
        draggable : true,
        resizable : false,
        autoOpen : false
    });

    $("#dialog-geocode").dialog({
        position : {
            my : 'top',
            at : 'left',
            of : $('#titleCon1'),
            collision : 'none'
        },
        modal : false,
        height : "auto",
        width : 480,
        show : "fade",
        hide : "fade",
        draggable : true,
        resizable : false,
        autoOpen : false
    });
    
    $('#dialog-moe').dialog({
        modal: false,
        height: 'auto',
        autoOpen: false,
        draggable: true,
        resizable: false 
    });

    $('#dialog-chks').dialog({
        modal: false,
        height: 'auto',
        autoOpen: false,
        draggable: true,
        resizable: false 
    });
    
    $('a.link-moe').on('click', function() {
        //$('#dialog-moe-value').html($(this).data('value'));
        $('#dialog-moe').dialog('open'); 
    });

    $('a.link-chks').on('click', function() {
        $('#dialog-chks').dialog('open'); 
    });
    
    $('div.time-column').on('click', 'a', function() {
        var $me = $(this), idx = $me.data('mapindex');
        $('#btnTimeToggle' + idx + ' span').html($me.html());
        updateTimeExtent(idx, $me.html());
    });
    
    $('div.time-column').each(function() {
        var i, il, $me = $(this), idx = $me.data('mapindex');
        $me.empty();
        $('#btnTimeToggle' + idx + ' span').html(DEFAULT_YEAR);
        for (i = 0, il = DATA_YEARS.length; i < il; i += 1) {
            $me.append('<a href="#" data-mapindex="' + idx + '">' + DATA_YEARS[i] + '</a><br/>');
        }
    });
    
    /*$("#dialog-legend").dialog({
     position: {
     my: 'top',
     at: 'left',
     of: $('#titleCon1'),
     collision: 'none'
     },
     modal: false,
     height: 'auto',
     width: 800,
     show: "fade",
     hide: "fade",
     draggable: true,
     resizable: false,
     autoOpen: false
     });*/

    $("#dialog-print").dialog({
        autoOpen : false,
        width : 260,
        height : 190,
        position : "right",
        open: function (event, ui) {
            var legendLayer = new esri.tasks.LegendLayer();
            legendLayer.layerId = visibleSvcByMap[printMapIndex];
            legendLayer.subLayerIds = [OP_MAPS[printMapIndex].lyrIndex];
            widgetPrint = vgis.widget.print({divToAttachTo: "divDefaultPrint", 
                                             //customTitle: $('#titleCon' + printMapIndex).html(), 
                                             legendLayers: [legendLayer],
                                             customText: {
                                                 panelTitle: $('#titleCon' + printMapIndex + ' span').eq(0).html() + $('#titleCon' + printMapIndex + ' span').eq(1).html(),
                                                 layerTitle: "", // $('#titleCon' + printMapIndex).html(),
                                                 sourceUrl: "http://mappingregionalchange.ucdavis.edu/youth/",
                                                 description: $('#titleCon' + printMapIndex + ' img').attr('title')
                                             }});
            widgetPrint.start();
        },
        close: function (event, ui) {
            widgetPrint.end();
        }
    });

    $('.dialog-identify').dialog({
        modal : false,
        height : 'auto',
        width : 380,
        //show: "fade",
        hide : "fade",
        draggable : true,
        resizable : true,
        autoOpen : false
    });
    
    $('.dialog-equity').dialog({
        modal : false,
        height : 'auto',
        width : 380,
        //show: "fade",
        hide : "fade",
        draggable : true,
        resizable : true,
        autoOpen : false
    });
    
    $('#loading-message').dialog({
       modal: true,
       height: 'auto',
       width: 350,
       autoOpen: true,
       resizable: false,
       draggable: false 
    });
    
    $('div.equity-btn').on('click', function() {
        var mapIndex = $(this).data('mapindex');
        
        equityChart(mapIndex, OP_MAPS[mapIndex].svcIndex, OP_MAPS[mapIndex].lyrIndex);
    });

    $('#resourceLoad').on('change', function() {
        if ($(this).val() !== "") {
            window.open($(this).val());
            $(this).prop('selectedIndex', 0);
        } 
    });

    // Handle click on the +/- row to expand or collapse a toc group.
    $("#toc, #dialog-legend").on('click', '.layer-toggle', function() {
        var $sub = $(this).parent().next('ul'), $img = $(this);
        //.children('img');

        if ($sub.css('display') === 'none') {
            $sub.css('display', 'block');
            $img.attr('src', 'img/toc-minus.png');
        } else {
            $sub.css('display', 'none');
            $img.attr('src', 'img/toc-plus.png');
        }
    });

    // Handle click on a layer name in the ToC.
    $('#toc').on('click', 'a.selectable-layer', function() {
        //var myTocId = $(this).closest("div.layers-pane").get(0).id;
        //$('#' + myTocId + ' a.highlight-layer').removeClass('highlight-layer');
        //$(this).addClass('highlight-layer');
        //$('#' + myTocId + ' img.layer-checked').attr('src', 'img/toc-blank.png').removeClass('layer-checked');
        //$(this).prev('img').attr('src', 'img/toc-checked.png').addClass('layer-checked');
    });

    // Handle change # of panels to display.
    var $sel = $('#numPanelsSelected'), i, il, $searchSel = $('#search-type');

    $sel.get(0).selectedIndex = 2;
    $sel.change(function() {
        var $pane;
        numPanels = this.selectedIndex + 1;
        priorMapWidths[0] = maps[0].width;
        priorMapWidths[1] = maps[1].width;
        priorMapWidths[2] = maps[2].width;

        $pane = $('#dialog-layers');
        if ($pane.dialog('isOpen')) {
            $pane.dialog('close');
        }
        $pane = $('#dialog-print');
        if ($pane.dialog('isOpen')) {
            $pane.dialog('close');
        }

        // User changed the number of Panels.  Redraw the maps.
        if (numPanels === 1) {
            $("#titleCon2").hide();
            $("#mapCon2").hide();
            $(".details-for-map2").hide();
            $("#titleCon1").hide();
            $("#mapCon1").hide();
            $(".details-for-map1").hide();
            $("#titleCon0").css('width', '100%');
            $("#mapCon0").css('width', '100%');
        }

        if (numPanels === 2) {
            $("#titleCon2").hide();
            $("#mapCon2").hide();
            $(".details-for-map2").hide();
            $("#titleCon1").show();
            $("#mapCon1").show();
            $(".details-for-map1").show();
            $("#titleCon1").css('width', '50%');
            $("#mapCon1").css('width', '50%');
            $("#titleCon0").css('width', '50%');
            $("#mapCon0").css('width', '50%');
        }

        if (numPanels === 3) {
            $("#titleCon2").show();
            $("#mapCon2").show();
            $(".details-for-map2").show();
            $("#titleCon1").show();
            $("#mapCon1").show();
            $(".details-for-map1").show();
            $("#titleCon2").css('width', '33.3%');
            $("#mapCon2").css('width', '33.3%');
            $("#titleCon1").css('width', '33.3%');
            $("#mapCon1").css('width', '33.3%');
            $("#titleCon0").css('width', '33.4%');
            $("#mapCon0").css('width', '33.4%');
        }

        resizeMaps(0);
    });

    // Layer list buttons and panes
    $('button.back-button').button({
        icons : {
            primary : 'ui-icon-triangle-1-w'
        },
        disabled : true
    }).click(function() {
        var mapIndex = parseInt(this.id.replace('back', ''), 10);
        backMapLayer(mapIndex);
    });
    $('button.layers-button').button({
        icons : {
            primary : 'ui-icon-triangle-1-e'
        }
    }).click(function() {
        var $me = $(this);
        $me.blur().button('refresh');

        if ($me.children().eq(0).hasClass('ui-icon-triangle-1-s')) {
            $('#dialog-layers').dialog('close');
            $me.button('option', 'icons', {
                primary : 'ui-icon-triangle-1-e'
            }).removeClass('layer-button-active');
        } else {
            $("#dialog-layers").dialog("option", "position", {
                my : "left top",
                at : "left bottom",
                of : $me
            }).dialog('open');
            $('button.layers-button').button('option', 'icons', {
                primary : 'ui-icon-triangle-1-e'
            }).removeClass('layer-button-active');
            $me.button('option', 'icons', {
                primary : 'ui-icon-triangle-1-s'
            }).addClass('layer-button-active');
            tocActiveMap = parseInt($me.data('formap'), 10);
            $('#active-map-display').val(tocActiveMap);
            updateDisagg(tocActiveMap, false);
        }
    });
    $('div.layers-pane').hide();
    $("div.layers-opacity").slider({
        value : 80,
        stop : function(event, ui) {
            var mapIndex = parseInt(this.id.replace('opacity', ''), 10), opacity = parseFloat($(this).slider('option', 'value')) / 100.0;
            SERVICES[OP_MAPS[mapIndex].svcIndex].layerObs[mapIndex].setOpacity(opacity);
        }
    });
    $('#active-map-display').on('change', function() {
        tocActiveMap = parseInt($(this).val(), 10);
        $('button.layers-button').button('option', 'icons', {
            primary : 'ui-icon-triangle-1-e'
        }).removeClass('layer-button-active');
        $('#btnLayers' + tocActiveMap).button('option', 'icons', {
            primary : 'ui-icon-triangle-1-s'
        }).addClass('layer-button-active');
        $("#dialog-layers").dialog("option", "position", {
            my : "left top",
            at : "left bottom",
            of : $('#btnLayers' + tocActiveMap)
        });
        updateDisagg(tocActiveMap, false);
    });
    $('#active-map-disagg').on('change', function() {
        if ($(this).val() !== "") {
            applyRenderer(tocActiveMap, $(this).val());
        }
    });

    $('#changeMapsBtn').on('click', function() {
        $("#dialog-layers").dialog("option", "position", {
            my : "left top",
            at : "left bottom",
            of : $(this)
        }).dialog('open');
        $('button.layers-button').button('option', 'icons', {
            primary : 'ui-icon-triangle-1-e'
        }).removeClass('layer-button-active');
       
        tocActiveMap = -1;
        $('#active-map-display').val(tocActiveMap);
        updateDisagg(tocActiveMap, false);
    });

    $('.btnLegendToggle').button().click(function() {
        var $pane = $(this).parent().prev();

        if ($pane.css('display') === 'none') {
            $pane.show();
        } else {
            $pane.hide();
        }
    });

    $('.btnDescToggle').button().click(function() {
        var $pane = $(this).parent().next();

        if ($pane.css('display') === 'none') {
            $pane.show();
        } else {
            $pane.hide();
        }
    });
    
    $('.btnTimeToggle').button().click(function() {
        var idx = $(this).data('mapindex'), $pane = $('#time' + idx);

        if ($pane.css('display') === 'none') {
            $pane.show();
        } else {
            $pane.hide();
        }
    });

    $('#rdoClickReport').on('click', function() {
        $('#dialog-report').dialog('open');
    });
    $('#rdoClickIdentify').on('click', function() {
        idStartOver();
    });

    // Map Zoom Buttons
    $('button.zoom-in-button').button({
        icons : {
            primary : 'none'
        },
        text : false
    }).click(function() {
        var mapIndex = parseInt(this.id.replace('zoomIn', ''), 10);
        maps[mapIndex].setLevel(maps[mapIndex].getLevel() + 1);
    }).children(1).removeClass('ui-icon').addClass('zoom-in-button');
    $('button.zoom-out-button').button({
        icons : {
            primary : 'none'
        },
        text : false
    }).click(function() {
        var mapIndex = parseInt(this.id.replace('zoomOut', ''), 10);
        maps[mapIndex].setLevel(maps[mapIndex].getLevel() - 1);
    }).children(1).removeClass('ui-icon').addClass('zoom-out-button');
    $('button.full-ext-button').button({
        icons : {
            primary : 'none'
        },
        text : false
    }).click(function() {
        var mapIndex = parseInt(this.id.replace('fullExt', ''), 10);
        maps[mapIndex].setExtent(caExtent);
    }).children(1).removeClass('ui-icon').addClass('full-ext-button');

    $('button.map-tool-square-button').css('width', '27px');

    $('#id-clear-button').button().click(function() {
        idStartOver();
    });

    $('#id-excel-button').button().click(function() {
        alert("excel");
    });

    $('#id-csv-button').button().click(function() {
        alert("csv");
    });

    $('#checkScaleSync').click(function() {
        if ($("#checkScaleSync").get(0).checked) {
            syncLevel = true;
            mapExtent = null;
            syncMaps();
        } else {
            syncLevel = false;
        }
    });
    $('#checkLocSync').click(function() {
        if ($("#checkLocSync").get(0).checked) {
            syncLoc = true;
            syncMaps();
        } else {
            syncLoc = false;
        }
    });

    $('#baseMapSelected').change(function() {
        changeBaseMap(this.selectedIndex);
    });

    $('.print-button').button({ icons : { primary : 'ui-icon-print' }, text : false }).click(function() {
        $(this).blur().button('refresh');
        var $pane = $('#dialog-print');

        if ($pane.dialog('isOpen')) {
            //if (printMapIndex === parseInt(this.id.replace('print', ''), 10)) {
                $pane.dialog('close');
            //} else {
            //    printMapIndex = parseInt(this.id.replace('print', ''), 10);
            //    $pane.dialog("option", "position", {
            //        my : "right top",
            //        at : "right bottom",
            //        of : $(this)
            //    });
            //}
        } //else {
            printMapIndex = parseInt(this.id.replace('print', ''), 10);
            $pane.dialog("option", "position", { my : "right top", at : "right bottom", of : $(this) }).dialog('open');
        //}
    });

    // Find District/Address button and pane
    $('.geocode-btn').button({
        icons : {
            primary : 'ui-icon-flag'
        },
        text : false
    }).click(function() {
        $(this).blur().button('refresh');
        var $pane = $('#dialog-geocode');

        if ($pane.dialog('isOpen') && geocodeMapIndex === parseInt(this.id.replace('geocode', ''), 10)) {
            $pane.dialog('close');
        } else {
            geocodeMapIndex = parseInt(this.id.replace('geocode', ''), 10);
            $pane.dialog('open');
        }
    });
    //$('#close-geocode-pane').click(function () {
    //    $('#geocode-pane').hide();
    //});
    //$('#geocode-pane').draggable({ containment: 'parent', handle: '.ui-dialog-titlebar' }).hide().css('left', '80px');

    $('#geocode-go').button({
        icons : {
            primary : 'ui-icon-search'
        },
        text : false
    }).click(function() {
        startFindAddress();
    });
    $('#geocode-clear').button({
        icons : {
            primary : 'ui-icon-trash'
        },
        text : false
    }).click(function() {
        $('#address-text').val('');
        $('#find-address-msg').html('');
        locateGfx[geocodeMapIndex].clear();
    });
    $('#address-text').keypress(function(e) {
        if (e.which === 13) {
            $(this).blur();
            startFindAddress();
        }
    });

    $('#school-go').button({
        icons : {
            primary : 'ui-icon-search'
        },
        text : false
    }).click(function() {
        startFindDistrict();
    });
    $('#school-clear').button({
        icons : {
            primary : 'ui-icon-trash'
        },
        text : false
    }).click(function() {
        $('#search-text').val('');
        $('#find-school-msg').html('');
        locateGfx[geocodeMapIndex].clear();
    });
    $('#search-text').keypress(function(e) {
        if (e.which === 13) {
            $(this).blur();
            startFindDistrict();
        }
    });
    for ( i = 0, il = SEARCH.length; i < il; i += 1) {
        $searchSel.append('<option value="' + i + '">' + SEARCH[i].title + '</option>');
    }

    $('a.content-pane-close-btn').hover(function() {
        $(this).addClass("ui-state-hover");
    }, function() {
        $(this).removeClass("ui-state-hover");
    });

    $('#toc-clear-go').on('click', function() {
        $('#toc-search').val('');
    });

    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _renderMenu : function(ul, items) {
            var that = this, currentCategory = "";
            $.each(items, function(index, item) {
                if (item.category !== currentCategory) {
                    ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                    currentCategory = item.category;
                }
                that._renderItemData(ul, item);
            });
        }
    });

    jqueryReadyChecks += 1;
    finalizeJQueryIfReady();
});

function finalizeJQueryIfReady() {'use strict';
    esri.config.defaults.io.proxyUrl = PROXY_PAGE;
    if (jqueryReadyChecks === 2) {
        var m;
        for ( m = 0; m < 3; m += 1) {
            createMap(m);
        }
    }
}

function startFindAddress() {'use strict';
    locateGfx[geocodeMapIndex].clear();
    $('#find-address-msg').html('');
    var address = {
        "SingleLine" : $("#address-text").val()
    }, options = {
        address : address,
        outFields : ["*"]
    };
    locator.outSpatialReference = maps[0].spatialReference;
    locator.addressToLocations(options);
}

function showGeocodeResults(candidates) {'use strict';
    if ($.isEmptyObject(candidates)) {
        $('#find-address-msg').html('No results were found');
        return;
    }

    var geom = null, candidate, zoomLevel = 12, symbol = new esri.symbol.SimpleMarkerSymbol();
    //var infoTemplate = new esri.InfoTemplate("Location", "Address: ${address}<br />Score: ${score}<br />Source locator: ${locatorName}");

    symbol.setStyle(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE);
    symbol.setColor(new dojo.Color([153, 0, 51, 1]));
    symbol.setSize(10);

    dojo.every(candidates, function(candidate) {
        if (candidate.score > 80 && geom === null) {
            //var attributes = { address: candidate.address, score: candidate.score, locatorName: candidate.attributes.Loc_name };
            geom = candidate.location;
            //var graphic = new esri.Graphic(geom, symbol, attributes, infoTemplate);
            var displayText, font, textSymbol, graphic = new esri.Graphic(geom, symbol);
            //add a graphic to the map at the geocoded location
            locateGfx[geocodeMapIndex].add(graphic);
            //add a text symbol to the map listing the location of the matched address.
            displayText = candidate.address;
            font = new esri.symbol.Font("14pt", esri.symbol.Font.STYLE_NORMAL, esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.WEIGHT_BOLD, "Helvetica");

            textSymbol = new esri.symbol.TextSymbol(displayText, font, new dojo.Color("#666633"));
            textSymbol.setOffset(0, 8);
            locateGfx[geocodeMapIndex].add(new esri.Graphic(geom, textSymbol));

            if (candidate.attributes.MatchLevel === "Postal") {
                zoomLevel = 10;
            } else if (candidate.attributes.MatchLevel === "POI") {
                if (candidate.address.indexOf("County") > -1) {
                    zoomLevel = 7;
                } else {
                    zoomLevel = 9;
                }
            }
        }
    });

    if (geom === null) {
        $('#find-address-msg').html('No results were found');
    } else {
        mapCount = geocodeMapIndex;
        maps[geocodeMapIndex].centerAndZoom(geom, zoomLevel);
    }
}

function startFindDistrict() {'use strict';
    locateGfx[geocodeMapIndex].clear();
    schoolResults = [];
    var query, queryTask, $searchSel = $('#search-type'), MY = SEARCH[$searchSel.get(0).selectedIndex], searchText = $("#search-text").val();

    $('#find-school-msg').html('');

    if (searchText === "") {
        $('#find-school-msg').html('Enter part of a ' + MY.title + ' name in the box above');
    } else {
        $('#find-school-msg').html('Searching for: ' + searchText);
        queryTask = new esri.tasks.QueryTask(SEARCH_SVC + "MapServer/" + MY.index);
        query = new esri.tasks.Query();

        query.returnGeometry = true;
        query.outSpatialReference = maps[0].spatialReference;
        query.where = "LOWER(" + MY.compareField + ") LIKE LOWER('%" + searchText + "%')";
        query.outFields = [MY.idField, MY.compareField];

        queryTask.execute(query, function(results) {
            schoolResults = results.features;
            if (schoolResults.length > 0) {
                if (schoolResults.length === 1) {
                    zoomToResult(0);
                    $('#find-school-msg').html('Found: ' + schoolResults[0].attributes[MY.compareField]);
                } else {
                    var i, il, $msgDiv = $('#find-school-msg'), $candList = $('<ul type="disc"></ul>'), myCounty = "";
                    $msgDiv.html('<p>The following ' + MY.title + ' match your search:</p>');
                    $msgDiv.append($candList);
                    for ( i = 0, il = schoolResults.length; i < il; i += 1) {
                        $candList.append('<li><a href="javascript:zoomToResult(' + i + ');">' + schoolResults[i].attributes[MY.compareField] + '</a></li>');
                    }
                }
            } else {
                $('#find-school-msg').html('Could not find any matches for "' + searchText + '".');
            }
        });
    }
}

function zoomToResult(index) {'use strict';
    locateGfx[geocodeMapIndex].clear();
    mapCount = geocodeMapIndex;
    maps[geocodeMapIndex].setExtent(schoolResults[index].geometry.getExtent().expand(1.2), true);
    locateGfx[geocodeMapIndex].add(new esri.Graphic(schoolResults[index].geometry, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 255]), 2), new dojo.Color([255, 255, 25, 0])), null, null));
}

function roundToDecimal(val, places) {'use strict';
    var ret;

    if ((val + "").indexOf('.') !== -1) {
        ret = parseFloat(Math.round(val * 100) / 100).toFixed(places);
    } else {
        ret = val;
    }

    return ret;
}
