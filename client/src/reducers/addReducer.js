import { v4 as uuidv4 } from "uuid";

const initialState = {
  activity: "",
  optionForAction: "",
  optionForActionSaveRetult: { error: "", message: "" },
  activitySaveResult: { error: "", message: "" },
  linkSaveResult: { error: "", message: "" },
  activityList : [],
  selectedActivity : [],
  optionForActionList : [],
  selectedOptionForAction : null,
  showActivityDialog : false,
  riskImpactList : [],
  selectedRiskImpacts : [{ row_id: uuidv4(), riskImpact: null, relation: [] }],
  optionForActionDetails : '',
  selectedOptionForActionDimensions : [],
  dimensionList : [],
  activeTab : 'option'
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_OPTION_ACTION":
      return {
        ...state,
        optionForAction: action.payload,
      };

    case "SET_OPTION_ACTION_SAVE_RESULT":
      return {
        ...state,
        optionForActionSaveRetult: action.payload,
      };

    case "SET_ACTIVITY":
      return {
        ...state,
        activity: action.payload,
      };
    case "SET_ACTIVITY_SAVE_RESULT":
      return {
        ...state,
        activitySaveResult: action.payload,
      };
      case "SET_ACTIVITY_LIST":
      return {
        ...state,
        activityList: [...action.payload],
      };
      case "SET_SELECTED_ACTIVITY":
      return {
        ...state,
        selectedActivity: action.payload,
      };
      case "SET_OPTION_LIST":
      return {
        ...state,
        optionForActionList: [...action.payload],
      };
      case "SET_SELECTED_OPTION":
      return {
        ...state,
        selectedOptionForAction: action.payload,
      };
      case "SET_LINK_SAVE_RESULT":
      return {
        ...state,
        linkSaveResult: action.payload,
      };
      case "SET_SHOW_ACTIVITY_DIALOF":
      return {
        ...state,
        showActivityDialog: action.payload,
      };

      case "SET_RISK_IMPACT_LIST":
      return {
        ...state,
        riskImpactList: [...action.payload],
      };
      case "SET_SELECTED_RISK_IMPACTS":
      return {
        ...state,
        selectedRiskImpacts: [...action.payload]
      };


      case "SET_OPTION_DETAIL":
      return {
        ...state,
        optionForActionDetails: action.payload,
      };
      case "SET_OPTION_DIMENSIONS":
      return {
        ...state,
        selectedOptionForActionDimensions: [...action.payload]
      };
      case "SET_DIMENSION_LIST":
      return {
        ...state,
        dimensionList : [...action.payload]
      };
      case "SET_ACTIVE_TAB":
      return {
        ...state,
        activeTab : action.payload
      };
    default:
      return state;
  }
};

export default reducer;
