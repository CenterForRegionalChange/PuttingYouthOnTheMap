
// Location of the geocode service
var GEOCODE_URL = "http://tasks.arcgis.com/ArcGIS/rest/services/WorldLocator/GeocodeServer";

// Location of the print service
var PRINT_URL = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
var PROXY_PAGE = "/agsproxy/proxy.ashx";

// Titles that will display in various parts of the application
var VIEWER_TITLE = "Rural Opportunity Index Map";

// Default extent that the viewer will open to
var CA_EXTENT_JSON = { "xmin": -13793000, "ymin": 3686700, "xmax": -12800000, "ymax": 5300000, "spatialReference": { "wkid": 102100 } };

// Basemaps to be available.  First in the list is the default on viewer load.
var BASEMAPS = [{
        name: "Streets",
        url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
    }, {
        name: "Terrain",
        url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
    }, {
        name: "Aerial",
        url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
    }, {
        name: "Grey Canvas",
        url: "http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer"
    }];

var GENDER = ["All", "Males", "Females"];
var ETH = ["All", "Nat.Amer/Alask", "Asian", "Black", "Filipino", "Hispanic", "Pac.Islander", "White", "Two or More"];
var POPUP_FIELDS = [
    { field: "COUNTY_1", title: "County"}, 
    { field: "CntyNm", title: "County"}];

// Operational maps for each of the 3 "tabs".
var OP_MAPS = [{
        name: "Map One",
        svcIndex: -1,
        lyrIndex: -1,
        lastSvcIndex: -1,
        lastLyrIndex: -1,
        gender: "0",
        eth: "0",
        idPoint: null,
        selectedGraphics: {}
    }, {
        name: "Map Two",
        svcIndex: -1,
        lyrIndex: -1,
        lastSvcIndex: -1,
        lastLyrIndex: -1,
        gender: "0",
        eth: "0",
        idPoint: null,
        selectedGraphics: {}
    }, {
        name: "Map Three",
        svcIndex: -1,
        lyrIndex: -1,
        lastSvcIndex: -1,
        lastLyrIndex: -1,
        gender: "0",
        eth: "0",
        idPoint: null,
        selectedGraphics: {}
    }];
    
var SERVICES = [{
        name: "Youth Wellbeing 1",
        url: "http://crcdemo.caes.ucdavis.edu/arcgis/rest/services/PYOM/Service3_well_district/",
        equityUrl: "http://crcdemo.caes.ucdavis.edu/arcgis/rest/services/PYOM/Service3_well_district/",
        layerObs: [],
        defaultForMap: [0],
        defaultLayerIndex: [1],
        disagg: [{
                // group layer, no data
            }, {
                overall: "dywi001", male: "dywi101", female: "dywi201", amind: "dywi011", asian: false, asian_nf: "dywi021", black: "dywi031", filipino: "dywi041", hispanic: "dywi051", islander: "dywi061", white: "dywi071", multi: "dywi081"
            },{
                // group layer, no data
            }, {
                overall: "dpha001", male: "dpha101", female: "dpha201", amind: "dpha011", asian: false, asian_nf: "dpha021", black: "dpha031", filipino: "dpha041", hispanic: "dpha051", islander: "dpha061", white: "dpha071", multi: "dpha081"
            }, {
                overall: "dphb001", male: "dphb101", female: "dphb201", amind: "dphb011", asian: false, asian_nf: "dphb021", black: "dphb031", filipino: "dphb041", hispanic: "dphb051", islander: "dphb061", white: "dphb071", multi: "dphb081"
            }, {
                overall: "dphc001", male: "dphc101", female: "dphc201", amind: "dphc011", asian: false, asian_nf: "dphc021", black: "dphc031", filipino: "dphc041", hispanic: "dphc051", islander: "dphc061", white: "dphc071", multi: "dphc081"
            }, {
                overall: "dphd001", male: "dphd101", female: "dphd201", amind: "dphd011", asian: false, asian_nf: "dphd021", black: "dphd031", filipino: "dphd041", hispanic: "dphd051", islander: "dphd061", white: "dphd071", multi: "dphd081"
            }, {
                overall: "dphe001", male: "dphe101", female: "dphe201", amind: "dphe011", asian: false, asian_nf: "dphe021", black: "dphe031", filipino: "dphe041", hispanic: "dphe051", islander: "dphe061", white: "dphe071", multi: "dphe081"
            }],
        chart: [{
                // group layer, no data
            },{
                local: "d", region: "s", equity: "d", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "ywi", subs: ["pha", "eda", "sca", "cma"], scale: "%", subScale: "%",
                title: "Index of Youth Wellbeing: All", subTitle: "Index Score Breakdowns by Domains",
                categories: ['District', 'State Average'], subCategories: ['Health', 'Education', 'Social', 'Community'],
                subLayerNames: {"pha": "Health DOMAIN", "eda": "Education Domain", "sca": "Social Relationships DOMAIN", "cma": "Community Context DOMAIN"},
                showMOE: false, showCHKS: true
            },{
                // group layer, no data
            },{
                local: "d", region: "s", equity: "d", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "pha", subs: [] /*['phb', 'phc', 'phd', 'phe']*/, scale: "%", subScale: "%", // re-enabling the subs array will cause a 2nd chart to show for the indicators in this domain (requires data to be visible in the layer)
                title: "Youth Wellbeing Health Domain", subTitle: "Domain Score Breakdown by Indicators",
                categories: ['District', 'State Average'], subCategories: ['Physical Fitness', 'Substance Use Avoidance', 'Feeling Safe', 'Feeling Safe at School'],
                subLayerNames: {"phb": "Physical Fitness INDICATOR", "phc": "Substance Use Avoidance Indicator", "phd": "Feeling Safe INDICATOR", "phe": "Feeling Safe at School Measure" },
                showMOE: false, showCHKS: true
            }, {
                local: "d", region: "s", equity: "d", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "phb", subs: [], scale: "%",
                title: "Physical Fitness Indicator",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true
            }, {
                local: "d", region: "s", equity: "d", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "phc", subs: [], scale: "%",
                title: "Substance Use Avoidance Indicator",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true
            }, {
                local: "d", region: "s", equity: "d", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "phd", subs: [], scale: "%",
                title: "Feeling Safe Indicator",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true
            }, {
                local: "d", region: "s", equity: "d", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "phe", subs: [], scale: "%",
                title: "Feeling Safe at School Measure",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true
            }]
    }, {
        name: "Youth Wellbeing 2",
        url: "http://crcdemo.caes.ucdavis.edu/arcgis/rest/services/PYOM/Service4_well_district/",
        equityUrl: "http://crcdemo.caes.ucdavis.edu/arcgis/rest/services/PYOM/Service4_well_district/",
        layerObs: [],
        defaultForMap: [],
        defaultLayerIndex: [],
        disagg: [{
                // group layer, no data
            }, {
                overall: "deda001", male: "deda101", female: "deda201", amind: "deda011", asian: false, asian_nf: "deda021", black: "deda031", filipino: "deda041", hispanic: "deda051", islander: "deda061", white: "deda071", multi: "deda081"
            }, {
                overall: "dedb001", male: "dedb101", female: "dedb201", amind: "dedb011", asian: false, asian_nf: "dedb021", black: "dedb031", filipino: "dedb041", hispanic: "dedb051", islander: "dedb061", white: "dedb071", multi: "dedb081"
            }, {
                overall: "dedc001", male: "dedc101", female: "dedc201", amind: "dedc011", asian: false, asian_nf: "dedc021", black: "dedc031", filipino: "dedc041", hispanic: "dedc051", islander: "dedc061", white: "dedc071", multi: "dedc081"
            }],
        chart: [{
                // group layer, no data
            },{
                local: "d", region: "s", equity: "d", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "eda", subs: [] /*['edb', 'edc']*/, scale: "%", subScale: "%",  // re-enabling the subs array will cause a 2nd chart to show for the indicators in this domain (requires data to be visible in the layer)
                title: "Youth Wellbeing Education Domain", subTitle: "Domain Score Breakdown by Indicators",
                categories: ['District', 'State Average'], subCategories: ['High School Graduation Rate Indicator', 'University Ready Indicator'],
                subLayerNames: {"edb": "High School Graduation Rate Indicator", "edc": "University Ready Indicator" },
                showMOE: false, showCHKS: true
            }, {
                local: "d", region: "s", equity: "d", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "edb", subs: [], scale: "%",
                title: "High School Graduation Rate Indicator",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true
            }, {
                local: "d", region: "s", equity: "d", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "edc", subs: [], scale: "%",
                title: "University Ready Indicator",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true
            }]
    }, {
        name: "Youth Wellbeing 3",
        url: "http://crcdemo.caes.ucdavis.edu/arcgis/rest/services/PYOM/Service5_well_district/",
        equityUrl: "http://crcdemo.caes.ucdavis.edu/arcgis/rest/services/PYOM/Service5_well_district/",
        layerObs: [],
        defaultForMap: [],
        defaultLayerIndex: [],
        disagg: [{
                // group layer, no data
            }, {
                overall: "dsca001", male: "dsca101", female: "dsca201", amind: "dsca011", asian: false, asian_nf: "dsca021", black: "dsca031", filipino: "dsca041", hispanic: "dsca051", islander: "dsca061", white: "dsca071", multi: "dsca081"
            }, {
                overall: "dscb001", male: "dscb101", female: "dscb201", amind: "dscb011", asian: false, asian_nf: "dscb021", black: "dscb031", filipino: "dscb041", hispanic: "dscb051", islander: "dscb061", white: "dscb071", multi: "dscb081"
            }, {
                // group layer, no data            
            }, {
                overall: "dcma001", male: "dcma101", female: "dcma201", amind: "dcma011", asian: false, asian_nf: "dcma021", black: "dcma031", filipino: "dcma041", hispanic: "dcma051", islander: "dcma061", white: "dcma071", multi: "dcma081"
            }, {
                overall: "dcmb001", male: "dcmb101", female: "dcmb201", amind: "dcmb011", asian: false, asian_nf: "dcmb021", black: "dcmb031", filipino: "dcmb041", hispanic: "dcmb051", islander: "dcmb061", white: "dcmb071", multi: "dcmb081"
            }/*, {
                overall: "dcmc001", male: "dcmc101", female: "dcmc201", amind: "dcmc011", asian: false, asian_nf: "dcmc021", black: "dcmc031", filipino: "dcmc041", hispanic: "dcmc051", islander: "dcmc061", white: "dcmc071", multi: "dcmc081"
            }*/],
        chart: [{
                // group layer, no data
            },{
                local: "d", region: "s", equity: "d", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "sca", subs: [], scale: "%",
                title: "Social Relationships Domain",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true
            }, {
                local: "d", region: "s", equity: "d", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "scb", subs: [], scale: "%",
                title: "Positive Relationships Indicator",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true
            },{
                // group layer, no data
            },{
                local: "d", region: "s", equity: "d", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "cma", subs: [] /*['cmb', 'cmc']*/, scale: "%", subScale: "%",  // re-enabling the subs array will cause a 2nd chart to show for the indicators in this domain (requires data to be visible in the layer)
                title: "Community Context Domain", subTitle: "Domain Score Breakdown by Indicators",
                categories: ['District', 'State Average'], subCategories: ['Material Resources Indicator', 'Community Involvement Indicator'],
                subLayerNames: {"cmb": "Community Involvement INDICATOR" },
                showMOE: false, showCHKS: true
            }, {
                local: "d", region: "s", equity: "d", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "cmb", subs: [], scale: "%",
                title: "Community Involvement Indicator",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true
            }/*, {
                local: "d", region: "s", equity: "d", tractField: "", countyField: "Cnty", districtField: "NAME10",
                unit: "cmc", subs: [], scale: "%",
                title: "Material Resources Indicator",
                categories: ['District', 'State Average'],
                showMOE: false, showCHKS: true
            }*/]
    }/*, {
        name: "Tract Youth Vuln.",
        url: "http://crcdemo.caes.ucdavis.edu/arcgis/rest/services/PYOM/Service1_vuln_tract/",
        equityUrl: "http://crcdemo.caes.ucdavis.edu/arcgis/rest/services/PYOM/Service2_vuln_county/",
        layerObs: [],
        defaultForMap: [1],
        defaultLayerIndex: [1],
        disagg: [{
                // group layer, no data
            }, {
                overall: "tyvi001", male: "tyvi101", female: "tyvi201", amind: false, asian: false, asian_nf: false, black: false, filipino: false, hispanic: false, islander: false, white: false, multi: false
            }, {
                overall: "tfc001", male: "tfc101", female: "tfc201", amind: false, asian: false, asian_nf: false, black: false, filipino: false, hispanic: false, islander: false, white: false, multi: false
            }, {
                overall: "tnhs001", male: "tnhs101", female: "tnhs201", amind: false, asian: false, asian_nf: false, black: false, filipino: false, hispanic: false, islander: false, white: false, multi: false
            }, {
                overall: "tpov001", male: "tpov101", female: "tpov201", amind: false, asian: false, asian_nf: false, black: false, filipino: false, hispanic: false, islander: false, white: false, multi: false
            }, {
                overall: "ttb001", male: false, female: false, amind: false, asian: false, asian_nf: false, black: false, filipino: false, hispanic: false, islander: false, white: false, multi: false
            }],
        chart: [{
                // group layer, no data
            }, {
                local: "t", region: "s", equity: "c", tractField: "Tract", countyField: "NAME", districtField: "District",
                unit: "yvi", subs: ["fc","nhs","pov","tb"], scale: 5, subScale: 5, 
                title: "Index of Youth Vulnerability", subTitle: "Index Score Breakdown by Domains",
                categories: ['Tract', 'State Average'], subCategories: ['Foster Care', 'High School Dropout', 'Poverty Rate', 'Teen Birth Rate'],
                showMOE: true, showCHKS: false, equitySpecial: {
                    displayField: "CntyNm", tractField: "", countyField: "CntyNm", districtField: ""
                }
            }, {
                local: "t", region: "s", equity: "c", tractField: "Tract", countyField: "NAME", districtField: "District",
                unit: "fc", subs: [], scale: 5,
                title: "Foster Care Domain Score",
                categories: ['Tract', 'State Average'],
                showMOE: true, showCHKS: false, equitySpecial: {
                    displayField: "CntyNm", tractField: "", countyField: "CntyNm", districtField: ""
                }
            }, {
                local: "t", region: "s", equity: "c", tractField: "Tract", countyField: "NAME", districtField: "District",
                unit: "nhs", subs: [], scale: 5,
                title: "High School Dropout Domain Score",
                categories: ['Tract', 'State Average'],
                showMOE: true, showCHKS: false, equitySpecial: {
                    displayField: "CntyNm", tractField: "", countyField: "CntyNm", districtField: ""
                }
            }, {
                local: "t", region: "s", equity: "c", tractField: "Tract", countyField: "NAME", districtField: "District",
                unit: "pov", subs: [], scale: 5, 
                title: "Poverty Rate Domain Score",
                categories: ['Tract', 'State Average'],
                showMOE: true, showCHKS: false, equitySpecial: {
                    displayField: "CntyNm", tractField: "", countyField: "CntyNm", districtField: ""
                }
            }, {
                local: "t", region: "s", equity: "c", tractField: "Tract", countyField: "NAME", districtField: "District",
                unit: "tb", subs: [], scale: 5, 
                title: "Teen Births Domain Score",
                categories: ['Tract', 'State Average'],
                showMOE: true, showCHKS: false, equitySpecial: {
                    displayField: "CntyNm", tractField: "", countyField: "CntyNm", districtField: ""
                }
            }]
    }*/, {
        name: "County Youth Vuln.",
        url: "http://crcdemo.caes.ucdavis.edu/arcgis/rest/services/PYOM/Service2_vuln_county/",
        equityUrl: "http://crcdemo.caes.ucdavis.edu/arcgis/rest/services/PYOM/Service2_vuln_county/",
        layerObs: [],
        defaultForMap: [1],
        defaultLayerIndex: [1],
        disagg: [{
                // group layer, no data
            },{
                overall: "cyvi001", male: "cyvi101", female: "cyvi201", amind: "cyvi011", asian: "cyvi021", asian_nf: false, black: "cyvi031", filipino: false, hispanic: "cyvi051", islander: false, white: "cyvi071", multi: "cyvi081"
            }, {
                overall: "cfc001", male: "cfc101", female: "cfc201", amind: "cfc011", asian: "cfc021", asian_nf: false, black: "cfc031", filipino: false, hispanic: "cfc051", islander: false, white: "cfc071", multi: "cfc081"
            }, {
                overall: "cnhs001", male: "cnhs101", female: "cnhs201", amind: "cnhs011", asian: "cnhs021", asian_nf: false, black: "cnhs031", filipino: false, hispanic: "cnhs051", islander: false, white: "cnhs071", multi: "cnhs081"
            }, {
                overall: "cpov001", male: "cpov101", female: "cpov201", amind: "cpov011", asian: "cpov021", asian_nf: false, black: "cpov031", filipino: false, hispanic: "cpov051", islander: false, white: "cpov071", multi: "cpov081"
            }, {
                overall: "ctb001", male: false, female: false, amind: "ctb011", asian: "ctb021", asian_nf: false, black: "ctb031", filipino: false, hispanic: "tb051", islander: false, white: "ctb071", multi: "ctb081"
            }],
        chart: [{
                // group layer, no data
            },{
                local: "c", region: "s", equity: "c", tractField: "", countyField: "CntyNm", districtField: "",
                unit: "yvi", subs: ["fc","nhs","pov","tb"], scale: 5, subScale: 5, 
                title: "Index of Youth Vulnerability", subTitle: "Index Score Breakdown by Domains",
                categories: ['County', 'State Average'], subCategories: ['Foster Care', 'High School Dropout', 'Poverty Rate', 'Teen Birth Rate'],
                subLayerNames: { "fc": "Foster Care Entry Rate", "nhs": "High School Dropout Rate", "pov": "Poverty Rate", "tb": "Teen Birth Rate" },
                showMOE: true, showCHKS: false
            }, {
                local: "c", region: "s", equity: "c", tractField: "", countyField: "CntyNm", districtField: "",
                unit: "fc", subs: [], scale: 5,
                title: "Foster Care Domain Score",
                categories: ['County', 'State Average'],
                showMOE: true, showCHKS: false
            }, {
                local: "c", region: "s", equity: "c", tractField: "", countyField: "CntyNm", districtField: "",
                unit: "nhs", subs: [], scale: 5,
                title: "High School Dropout Domain Score",
                categories: ['County', 'State Average'],
                showMOE: true, showCHKS: false
            }, {
                local: "c", region: "s", equity: "c", tractField: "", countyField: "CntyNm", districtField: "",
                unit: "pov", subs: [], scale: 5,
                title: "Poverty Rate Domain Score",
                categories: ['County', 'State Average'],
                showMOE: true, showCHKS: false
            }, {
                local: "c", region: "s", equity: "c", tractField: "", countyField: "CntyNm", districtField: "",
                unit: "tb", subs: [], scale: 5,
                title: "Teen Births Domain Score",
                categories: ['County', 'State Average'],
                showMOE: true, showCHKS: false
            }]
    }, {
        name: "Demographics",
        url: "http://crcdemo.caes.ucdavis.edu/arcgis/rest/services/PYOM/Service6_YouthDemog_1/",
        layerObs: [],
        defaultForMap: [2],
        defaultLayerIndex: [4],
        disagg: [],
        chart: []
    }, {
        name: "Other",
        url: "http://crcdemo.caes.ucdavis.edu/arcgis/rest/services/PYOM/Service7_Other_1/",
        layerObs: [],
        defaultForMap: [],
        defaultLayerIndex: [],
        disagg: [],
        chart: []
    }];

var SEARCH_SVC = "http://crcgis2.caes.ucdavis.edu/ArcGIS/rest/services/PYOM/pyom-05072013/";
var SEARCH = [{
        title: "School Districts",
        index: 1,
        idField: "SCSDLEA10",
        compareField: "NAME10",
        filter: false
    },{
        title: "California Counties",
        index: 52,
        idField: "FIPS",
        compareField: "COUNTY",
        filter: false
    },{
        title: "State Assembly",
        index: 53,
        idField: "ID",
        compareField: "DISTRICT",
        filter: false
    },{
        title: "US Congressional",
        index: 54,
        idField: "DISTRICT",
        compareField: "DISTRICT",
        filter: false
    },{
        title: "State Senate",
        index: 55,
        idField: "ID",
        compareField: "DISTRICT",
        filter: false
    }];

var vgis = {
    /**
    * Using a namespace() method on your one global allows the assumption
    * that the namespace exists. That way, each file can call namespace() first to declare
    * the namespace the developers are using, knowing that they won't destroy the name-
    * space if it already exists. This approach also frees developers from the task of
    * checking to see whether the namespace exists before using. 
    * @param {string} ns The new namespace to add, e.g. "vgis.widget.basemap"
    * @returns {object} The newly created namespace.
    * @static
    */
    namespace: function (ns) {
        var parts = ns.split("."),
            object = this,
            i, len;
        for (i = 0, len = parts.length; i < len; i += 1) {
            if (!object[parts[i]]) {
                object[parts[i]] = {};
            }
            object = object[parts[i]];
        }
        return object;
    }
};