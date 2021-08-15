const initialState = {
  riskTypesSelect: [],
  riskTypes: [],
  selectedRiskType: -1,
  selectedNode: {
    id : -1,
    prefix : '',
    name : '',
    dimension : ''
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_RISK_TYPES_SELECT":
      return {
        ...state,
        riskTypesSelect: [...action.payload],
      };
    case "SET_RISK_TYPES":
      return {
        ...state,
        riskTypes: [...action.payload],
      };
    case "SET_SELECTED_RISK_TYPE":
      return {
        ...state,
        selectedRiskType: action.payload,
      };

    case "SET_SELECTED_NODE":
      return {
        ...state,
        selectedNode: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
