import axios from "axios";
import { v4 as uuidv4 } from "uuid";


const setRiskTypes = (data) => {
  return {
    type: "SET_RISK_TYPES",
    payload: data,
  };
};

export const GetRiskTypes = async () => {
  try {
    const response = await axios.get("/risktypes");
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetRiskTypeById = async (id) => {
  try {
    const response = await axios.get(`/risktype/${id}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

const setRiskTypesSelect = (data) => {
  return {
    type: "SET_RISK_TYPES_SELECT",
    payload: data,
  };
};

export const GetRiskTypesSelect = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get("/risktypes");
      dispatch(setRiskTypesSelect(response.data));
      dispatch(setRiskTypes(response.data));
    } catch (error) {
      console.error("error", error);
    }
  };
};

const setSelectedRiskType = (data) => {
  return {
    type: "SET_SELECTED_RISK_TYPE",
    payload: data,
  };
};

export const SelectRiskType = (id) => {
  return async function (dispatch) {
    try {
      dispatch(setSelectedRiskType(id));
    } catch (error) {
      console.error("error", error);
    }
  };
};

export const GetDimensions = async () => {
  try {
    const response = await axios.get("/dimensions");
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetDimensionsByRiskId = async (id) => {
  try {
    const response = await axios.get(`/dimension/${id}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetActiveSums = async () => {
  try {
    const response = await axios.get("/activesums");
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetActiveSumsByRiskId = async (id) => {
  try {
    const response = await axios.get(`/activesum/${id}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetPassiveSums = async () => {
  try {
    const response = await axios.get("/passivesums");
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};
export const GetPassiveSumByRiskId = async (id) => {
  try {
    const response = await axios.get(`/passivesum/${id}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetUseCases = async () => {
  try {
    const response = await axios.get("/usecases");
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetUseCasesByRiskField = async (id) => {
  try {
    const response = await axios.get(`/usecase/${id}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetRiskImpacts = async () => {
  try {
    const response = await axios.get("/riskimpacts");
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};
export const GetRiskImpactsByRiskField = async (id) => {
  try {
    const response = await axios.get(`/riskimpact/${id}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetRiskFields = async () => {
  try {
    const response = await axios.get("/riskfields");
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetRiskFieldsByRiskId = async (id) => {
  try {
    const response = await axios.get(`/riskfield/${id}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetRelationships = async () => {
  try {
    const response = await axios.get("/relationships");
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetRelationshipsById = async (id, riskFieldId,optionForActionId='0') => {
  try {
    const response = await axios.get(`/relationship/${id}/${riskFieldId}/${optionForActionId}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

const setSelectedNode = (data) => {
  return {
    type: "SET_SELECTED_NODE",
    payload: data,
  };
};

export const SetSelectedNode = (
  data = {
    id: -1,
    prefix: "",
    name: "",
    dimension: "",
  }
) => {
  return async function (dispatch) {
    try {
      dispatch(setSelectedNode(data));
    } catch (error) {
      console.error("error", error);
    }
  };
};

const setOptionForAction = (data) => {
  return {
    type: "SET_OPTION_ACTION",
    payload: data,
  };
};

export const SetOptionForAction = (value) => {
  return async function (dispatch) {
    try {
      dispatch(setOptionForAction(value));
    } catch (error) {
      console.error("error", error);
    }
  };
};

export const InsertOptionForAction = async (data) => {

  try{
    const response = await axios.post(`/optionForAction`, data);
    return response;

  } catch(e){
    return e.response;
  }

  
};

const setOptionForActionSaveSesult = (data) => {
  return {
    type: "SET_OPTION_ACTION_SAVE_RESULT",
    payload: data,
  };
};

export const SetOptionForActionSaveResult = (data) => {
  return async function (dispatch) {
    try {
      dispatch(setOptionForActionSaveSesult(data));
    } catch (error) {
      console.error("error", error);
    }
  };
};


export const InsertActivity = async (name) => {

  try{
    const response = await axios.post(`/activity`, {
      name,
    });
    return response;

  } catch(e){
    return e.response;
  }

  
};

const setActivity = (data) => {
  return {
    type: "SET_ACTIVITY",
    payload: data,
  };
};

export const SetActivity = (value) => {
  return async function (dispatch) {
    try {
      dispatch(setActivity(value));
    } catch (error) {
      console.error("error", error);
    }
  };
};

const setActivitySaveSesult = (data) => {
  return {
    type: "SET_ACTIVITY_SAVE_RESULT",
    payload: data,
  };
};

export const SetActivitySaveResult = (data) => {
  return async function (dispatch) {
    try {
      dispatch(setActivitySaveSesult(data));
    } catch (error) {
      console.error("error", error);
    }
  };
};

const setOptionForActionList = (data) => {
  return {
    type: "SET_OPTION_LIST",
    payload: data,
  };
};

export const GetOptionForActionList = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get("/optionForAction");
      dispatch(setOptionForActionList(response.data));
    } catch (error) {
      console.error("error", error);
    }
  };
};

const setSelectedOptionForAction = (data) => {
  return {
    type: "SET_SELECTED_OPTION",
    payload: data,
  };
};

export const SetSelectedOptionForAction = (data) => {
  return async function (dispatch) {
    try {
      dispatch(setSelectedOptionForAction(data));
    } catch (error) {
      console.error("error", error);
    }
  };
};

const setSelectedActivity = (data) => {
  return {
    type: "SET_SELECTED_ACTIVITY",
    payload: data,
  };
};

export const SetSelectedActivity = (data) => {
  return async function (dispatch) {
    try {
      dispatch(setSelectedActivity(data));
    } catch (error) {
      console.error("error", error);
    }
  };
};

const setActivityList = (data) => {
  return {
    type: "SET_ACTIVITY_LIST",
    payload: data,
  };
};

export const GetActivityList = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get("/activities");
      dispatch(setActivityList(response.data));
    } catch (error) {
      console.error("error", error);
    }
  };
};

const setLinkSaveSesult = (data) => {
  return {
    type: "SET_LINK_SAVE_RESULT",
    payload: data,
  };
};

export const SetLinkSaveResult = (data) => {
  return async function (dispatch) {
    try {
      dispatch(setLinkSaveSesult(data));
    } catch (error) {
      console.error("error", error);
    }
  };
};


export const InsertActivityLink = async (optionForActionId,activityIds) => {
  try{
    const response = await axios.post(`/linkActivity`, {
      optionForActionId,activityIds
    });
    return response;
  } catch(e){
    return e.response;
  }  
};


const setShowActivityDialog = (data) => {
  return {
    type: "SET_SHOW_ACTIVITY_DIALOF",
    payload: data,
  };
};

export const SetShowActivityDialog = (data) => {
  return async function (dispatch) {
    try {
      dispatch(setShowActivityDialog(data));
      
      //Clear all tabs on during close
      if(!data){
        dispatch(setOptionForAction(''));        
        dispatch(setActivity(''));
        dispatch(setActivityList([]));
        dispatch(setSelectedActivity([]))
        dispatch(setSelectedOptionForAction(null))
        dispatch(setOptionForActionSaveSesult({error : '', message : ''}));
        dispatch(setActivitySaveSesult({error : '', message : ''}));
        dispatch(setLinkSaveSesult({error : '', message : ''}));
        dispatch(setOptionForActionDetails(''));
        dispatch(setSelectedRiskImpacts([{ row_id: uuidv4(), riskImpact: null, relation: [] }]))
        dispatch(SetSelectedOptionForActionDimension([]));
        dispatch(SetActiveTab('option'));

      }
    } catch (error) {
      console.error("error", error);
    }
  };
};

export const GetMappedActivities = (optionForActionId) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`/mappedActivities/${optionForActionId}`);          
      if(response.data.length){
        dispatch(setSelectedActivity(response.data));
      } else {        
        dispatch(setSelectedActivity([]));
      }
      
    } catch (error) {
      console.error("error", error);
    }
  };
};

export const InsertRiskType = async (data) => {
  try{
    const response = await axios.post(`/risktype`, data);
    return response;
  } catch(e){
    return e.response;
  }  
};

export const GetActivities = async () => {
  try {
    const response = await axios.get("/activitiesWithLink");
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetOptionForActions = async () => {
  try {
    const response = await axios.get("/optionForActionWithLink");
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetOptionForActionsByRiskImpactId = async (id) => {
  try {
    const response = await axios.get(`/optionForAction/${id}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export const GetActivitiesByOptionIds = async (id) => {
  try {
    const response = await axios.get(`/activitiesByOptionId/${id}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};


const setSelectedRiskImpacts = (data) => {
  return {
    type: "SET_SELECTED_RISK_IMPACTS",
    payload: data,
  };
};

export const SetSelectedRiskImpacts = (data) => {
  return async function (dispatch) {
    try {
      dispatch(setSelectedRiskImpacts(data));
    } catch (error) {
      console.error("error", error);
    }
  };
};


const setRiskImpactList = (data) => {
  return {
    type: "SET_RISK_IMPACT_LIST",
    payload: data,
  };
};

export const GetRiskImpactList = (data) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`/riskimpacts`);      
      dispatch(setRiskImpactList(response.data));
    } catch (error) {
      console.error("error", error);
    }
  };
};


const setOptionForActionDetails = (data) => {
  return {
    type: "SET_OPTION_DETAIL",
    payload: data,
  };
};

export const SetOptionForActionDetails = (data) => {
  return async function (dispatch) {
    try {
      dispatch(setOptionForActionDetails(data));
    } catch (error) {
      console.error("error", error);
    }
  };
};
const setOptionForActionDimension = (data) => {
  return {
    type: "SET_OPTION_DIMENSIONS",
    payload: data,
  };
};

export const SetSelectedOptionForActionDimension = (data) => {
  return async function (dispatch) {
    try {
      dispatch(setOptionForActionDimension(data));
    } catch (error) {
      console.error("error", error);
    }
  };
};


const setDimensionList = (data) => {
  return {
    type: "SET_DIMENSION_LIST",
    payload: data,
  };
};

export const GetDimensionList = (data) => {
  return async function (dispatch) {
    try {
      const response = await axios.get(`/dimensions`);      
      dispatch(setDimensionList(response.data));
    } catch (error) {
      console.error("error", error);
    }
  };
};


export const GetSpecificRisks = async () => {
  try {
    const response = await axios.get(`/specificRisks`);
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};


export const GetSpecificRisksByRiskId = async (riskId) => {
  try {
    const response = await axios.get(`/specificRisk/${riskId}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};


const setActiveTab = (data) => {
  return {
    type: "SET_ACTIVE_TAB",
    payload: data,
  };
};

export const SetActiveTab = (tabKey) => {
  return async function (dispatch) {
    try {
      dispatch(setActiveTab(tabKey));
    } catch (error) {
      console.error("error", error);
    }
  };
};