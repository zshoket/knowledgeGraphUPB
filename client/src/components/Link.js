import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  GetActivityList,
  GetMappedActivities,
  GetOptionForActionList,
  InsertActivityLink,
  SetLinkSaveResult,
  SetSelectedActivity,
  SetSelectedOptionForAction,
  SetShowActivityDialog,
} from "../actions";

export default function Link() {
  const selectedOptionForAction = useSelector(
    (state) => state.addReducer.selectedOptionForAction
  );
  const optionForActionList = useSelector(
    (state) => state.addReducer.optionForActionList
  );
  const selectedActivity = useSelector(
    (state) => state.addReducer.selectedActivity
  );
  const activityList = useSelector((state) => state.addReducer.activityList);
  const linkSaveResult = useSelector(
    (state) => state.addReducer.linkSaveResult
  );
  const dispatch = useDispatch();

  const handleOptionForActionChange = (selectedOption) => {
    dispatch(SetSelectedOptionForAction(selectedOption));
  };
  const handleActivityChange = (selectedOption) => {
    dispatch(SetSelectedActivity(selectedOption));
  };

  const handleOnSave = async () => {
    if(!selectedOptionForAction) {
      dispatch(
        SetLinkSaveResult({
          error: "Please select Option for Action",
          message: "",
        })
      );
      return;
    }
    if(!selectedActivity.length) {
      dispatch(
        SetLinkSaveResult({
          error: "Please select Activity",
          message: "",
        })
      );
      return;
    }
    const activityIds = selectedActivity.map(item => parseInt(item.value)).join(',')
    const res = await InsertActivityLink(selectedOptionForAction.value, activityIds);
    
    if (res.data.error) {
      dispatch(SetLinkSaveResult({ error: res.data.error, message: "" }));
    } else {
      dispatch(
        SetLinkSaveResult({
          error: "",
          message: "Activity linked with Option for Action succesfully!",
        })
      );      
    }



  };

  useEffect(() => {
    dispatch(GetOptionForActionList());
  }, [dispatch]);

  useEffect(() => {
    if (selectedOptionForAction) {
      dispatch(GetActivityList());
      dispatch(GetMappedActivities(selectedOptionForAction.value));
      dispatch(SetLinkSaveResult({
        error: "",
        message: "",
      }))
    }
  }, [selectedOptionForAction, dispatch]);

  return (
    <div>
      <div className="mb-3 row">
        <label className="col-sm-3 col-form-label">Option for Action</label>
        <div className="col-sm-8">
          <Select
            onChange={handleOptionForActionChange}
            value={selectedOptionForAction}
            options={optionForActionList.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            placeholder="Select Option for Action"
            isClearable={true}
          />
        </div>
      </div>
      <div className="mb-3 row">
        <label className="col-sm-3 col-form-label">Activities</label>
        <div className="col-sm-8">
          <Select
            onChange={handleActivityChange}
            value={selectedActivity}
            options={activityList.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            placeholder="Select Activities"
            isClearable={true}
            isMulti={true}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-11">
          {linkSaveResult.error.length > 0 && (
            <div className="alert alert-danger" role="alert">
              {linkSaveResult.error}
            </div>
          )}
          {linkSaveResult.message.length > 0 && (
            <div className="alert alert-success" role="alert">
              {linkSaveResult.message}
            </div>
          )}
        </div>
      </div>

      <div className="mb-3 row p-2">
        <div className="col-sm-11 text-end">
          <button className="btn btn-primary btn-add" onClick={handleOnSave}>
            Save
          </button>
          <button className="btn btn-secondary ms-2" onClick={() => {
              dispatch(SetShowActivityDialog(false));
            }}>Close</button>
        </div>
      </div>
    </div>
  );
}
