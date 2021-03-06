import actionTypes from 'actions';
import forEach from 'lodash.foreach';
import Relate from 'relate-js';

const defaultState = {
  previewText: '',
  display: 'grid', // grid || list
  manage: false,
  tab: 0,
  googleInput: '',
  googleValid: false,
  typekitInput: '',
  typekitValid: false,
  fontdeckInput: '',
  fontdeckValid: false,
  monotypeInput: '',
  monotypeValid: false,
  customFonts: [],
  fonts: {}
};

function parseSettings (_settings) {
  const settings = {};

  forEach(_settings, (setting) => {
    settings[setting._id] = setting.value;
  });

  return settings;
}

export default function fontsReducer (state = defaultState, action = {}) {
  switch (action.type) {
    case Relate.actionTypes.query:
      if (action.data.settings) {
        const parsed = parseSettings(action.data.settings);
        if (parsed.fonts) {
          return Object.assign({}, state, JSON.parse(parsed.fonts));
        }
      }
      return state;
    case actionTypes.changeFontsPreviewText:
      return Object.assign({}, state, {
        previewText: action.value
      });
    case actionTypes.changeFontsDisplay:
      return Object.assign({}, state, {
        display: action.value
      });
    case actionTypes.openFontsManage:
      return Object.assign({}, state, {
        manage: true
      });
    case actionTypes.closeFontsManage:
      return Object.assign({}, state, {
        manage: false
      });
    case actionTypes.changeFontsTab:
      return Object.assign({}, state, {
        tab: action.value
      });
    case actionTypes.changeFontInput: {
      const {lib, value} = action;
      let valid = false;

      switch (lib) {
        case 'google': {
          const paramsSplit = value.split('?');

          if (paramsSplit.length === 2) {
            const params = {};
            const re = /[?&]?([^=]+)=([^&]*)/g;
            let tokens = re.exec(paramsSplit[1]);

            while (tokens) {
              params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
              tokens = re.exec(paramsSplit[1]);
            }

            if (params.family) {
              valid = true;
            }
          }
          break;
        }
        case 'typekit':
          valid = value.length === 7;
          break;
        case 'fontdeck':
          valid = value.length === 5;
          break;
        case 'monotype': {
          const regex = new RegExp(/[0-9|a-z]{8}-[0-9|a-z]{4}-[0-9|a-z]{4}-[0-9|a-z]{4}-[0-9|a-z]{12}/g);
          valid = value.length === 36 && regex.test(value);
          break;
        }
        default:
          valid = false;
      }

      return Object.assign({}, state, {
        [`${lib}Input`]: value,
        [`${lib}Valid`]: valid
      });
      // const fontsClone = cloneDeep(state.data);
      // const tab = action.tab;
      // const value = action.value;
      // let nowValid = false;
      // let previousValid;
      //
      // if (tab === 0) {
      //   // Google fonts validation
      //   previousValid = state.data.input.google.valid;
      //   fontsClone.input.google.input = value;
      //   fontsClone.input.google.valid = false;
      //
      //   const paramsStr = value.split('?');
      //
      //   // Valid if has params
      //   if (paramsStr.length === 2) {
      //     const params = {};
      //     const re = /[?&]?([^=]+)=([^&]*)/g;
      //     let tokens = re.exec(paramsStr[1]);
      //
      //     while (tokens) {
      //       params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
      //       tokens = re.exec(paramsStr[1]);
      //     }
      //
      //     if (params.family) {
      //       fontsClone.input.google.valid = true;
      //       nowValid = true;
      //
      //       if (!fontsClone.webfontloader.google) {
      //         fontsClone.webfontloader.google = {
      //           families: []
      //         };
      //       } else {
      //         fontsClone.webfontloader.google.families = [];
      //       }
      //
      //       // Object {family: "Lobster|Open+Sans:400,700", subset: "latin,cyrillic-ext,cyrillic"}
      //       const families = params.family.split('|');
      //       for (let i = 0; i < families.length; i++) {
      //         let googleFont = families[i];
      //
      //         // Might not have multiple weights
      //         if (families[i].indexOf(':') === -1) {
      //           googleFont += ':';
      //         }
      //
      //         if (params.subset) {
      //           googleFont += `:${params.subset}`;
      //         } else {
      //           googleFont += ':latin';
      //         }
      //
      //         fontsClone.webfontloader.google.families.push(googleFont);
      //       }
      //     }
      //   }
      //
      //   if (!nowValid && fontsClone.webfontloader.google) {
      //     delete fontsClone.webfontloader.google;
      //   }
      // } else if (tab === 1) {
      //   // Typekit validation
      //   previousValid = state.data.input.typekit.valid;
      //   fontsClone.input.typekit.input = value;
      //   fontsClone.input.typekit.valid = false;
      //
      //   if (value.length === 7) {
      //     nowValid = true;
      //     fontsClone.input.typekit.valid = true;
      //     fontsClone.webfontloader.typekit = fontsClone.webfontloader.typekit || {};
      //     fontsClone.webfontloader.typekit.id = value;
      //   }
      //
      //   if (!nowValid && fontsClone.webfontloader.typekit) {
      //     delete fontsClone.webfontloader.typekit;
      //   }
      // } else if (tab === 2) {
      //   // Fonts.com (monotype) validation
      //   previousValid = state.data.input.monotype.valid;
      //   fontsClone.input.monotype.input = value;
      //   fontsClone.input.monotype.valid = false;
      //
      //   if (value.length === 36) {
      //     const regex = new RegExp(/[0-9|a-z]{8}-[0-9|a-z]{4}-[0-9|a-z]{4}-[0-9|a-z]{4}-[0-9|a-z]{12}/g);
      //     fontsClone.input.monotype.valid = regex.test(value);
      //   }
      //
      //   // valid
      //   if (fontsClone.input.monotype.valid) {
      //     nowValid = true;
      //     fontsClone.webfontloader.monotype = fontsClone.webfontloader.monotype || {};
      //
      //     fontsClone.webfontloader.monotype.projectId = value;
      //   } else if (fontsClone.webfontloader.monotype) {
      //     delete fontsClone.webfontloader.monotype;
      //   }
      // } else if (tab === 3) {
      //   // Font Deck validation
      //   previousValid = state.data.input.fontdeck.valid;
      //   fontsClone.input.fontdeck.input = value;
      //   fontsClone.input.fontdeck.valid = false;
      //
      //   if (value.length === 5) {
      //     nowValid = true;
      //     fontsClone.input.fontdeck.valid = true;
      //     fontsClone.webfontloader.fontdeck = fontsClone.webfontloader.fontdeck || {};
      //
      //     fontsClone.webfontloader.fontdeck.id = value;
      //   }
      //
      //   if (!nowValid && fontsClone.webfontloader.fontdeck) {
      //     delete fontsClone.webfontloader.fontdeck;
      //   }
      // }
      //
      // if (previousValid && !nowValid || nowValid) {
      //   // TODO re load fonts
      // }

      // return Object.assign({}, state, {
      //   data: fontsClone
      // });
    }

    case actionTypes.loadFonts:
      return Object.assign({}, state, {
        fonts: action.fonts
      });
    // case actionTypes.submitCustomFont:
    //   return Object.assign({}, state, {
    //     data: Object.assign({}, state.data, {
    //       customFonts: [...state.data.customFonts, action.data.submitCustomFont]
    //     }),
    //     newCustom: action.data.submitCustomFont,
    //     errors: action.errors
    //   });
    // case actionTypes.customFontIncluded: {
    //   const fontsDataClone = cloneDeep(state.data);
    //   fontsDataClone.webfontloader.custom = fontsDataClone.webfontloader.custom || {families: []};
    //   fontsDataClone.webfontloader.custom.families.push(state.newCustom.family);
    //   return Object.assign({}, state, {
    //     data: fontsDataClone,
    //     newCustom: null
    //   });
    // }
    // case actionTypes.removeCustomFont: {
    //   const fontsDataRemoveClone = cloneDeep(state.data);
    //   const id = action.data.removeCustomFont.id;
    //   forEach(fontsDataRemoveClone.customFonts, (obj, index) => {
    //     if (obj.id === id) {
    //       fontsDataRemoveClone.customFonts.splice(index, 1);
    //
    //       const ind = fontsDataRemoveClone.webfontloader.custom.families.indexOf(obj.family);
    //       if (ind !== -1) {
    //         fontsDataRemoveClone.webfontloader.custom.families.splice(ind, 1);
    //         if (fontsDataRemoveClone.webfontloader.custom.families.length === 0) {
    //           delete fontsDataRemoveClone.webfontloader.custom;
    //         }
    //       }
    //
    //       return false;
    //     }
    //   });
    //   return Object.assign({}, state, {
    //     data: fontsDataRemoveClone
    //   });
    // }
    default:
      return state;
  }
}
