import csv2geojson from "csv2geojson";

const state = {
  addressesData: {
    type: "FeatureCollection",
    features: [], // <--- no features
  },
  zoomTo: [0, 0],
  platform: "",
};

const mutations = {
  SET_ADDRESSES(state, payload) {
    state.addressesData = payload;
  },
  SET_ZOOMTO(state, payload) {
    state.zoomTo = payload;
  },
  SET_PLATFORM(state, payload) {
    state.platform = payload;
  },
};

const actions = {
  GET_ADDRESSES: async (context, payload) => {
    const CLIENT_ID =
      "1061958099087-58i4ai224tnss0vv6q2b77h38a13ebn1.apps.googleusercontent.com";
    const ANDROID_CLIENT_ID =
      "1061958099087-7k285ba5l03b184pidg0i1qv6hcmt1kh.apps.googleusercontent.com";
    const API_KEY = "AIzaSyAV_XU3LYvjRCFymsFpj-LG3Mlln6_xLn8";

    // Array of API discovery doc URLs for APIs used by the quickstart
    const DISCOVERY_DOCS = [
      "https://sheets.googleapis.com/$discovery/rest?version=v4",
    ];
    const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

    function handleClientLoad() {
      gapi.load("client:auth2", initClient);
    }
  
    
    function initClient() {
      gapi.client
        .init({
          apiKey: API_KEY,
          // clientId: CLIENT_ID,
          clientId: context.state.platform ? CLIENT_ID : ANDROID_CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(
          function () {
            listMajors();
          },
          function (error) {
            console.warn(JSON.stringify(error, null, 2));
          }
        );
    }
    handleClientLoad();

    function listMajors() {
      gapi.client.sheets.spreadsheets.values
        .get({
          spreadsheetId: "1lJufiW39INeyrYn0GgfrAFJQ9rF9jvNF5SdEK4OoUys",
          range: "Sheet1!A1:K",
          valueRenderOption: "FORMATTED_VALUE",
        })
        .then(
          function (response) {
            const range = response.result;
            function quote(s) {
              s = s.toString();
              if (
                s.indexOf("\r") == -1 &&
                s.indexOf("\n") == -1 &&
                s.indexOf(",") == -1 &&
                s.indexOf('"') == -1
              )
                return s;
              return '"' + s.replace(/"/g, '""') + '"';
            }
            var data =
              range.values
                .map(function (row) {
                  return row.map(quote).join();
                })
                .join("\r\n") + "\r\n";

            csv2geojson.csv2geojson(
              data,
              {
                latfield: "Lat",
                lonfield: "Lon",
                delimiter: "auto",
              },
              (err, geojson) => {
                context.commit("SET_ADDRESSES", geojson);
              }
            );
          },
          function (response) {
            console.warn(response.result.error.message);
          }
        );
    }

    fetch(
      "http://localhost:8081"
    )
      .then((response) => response.text())
      .then((data) => {console.log(data)

      });
  },
};

const getters = {
  addresses: (state) => {
    return state.addressesData;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
