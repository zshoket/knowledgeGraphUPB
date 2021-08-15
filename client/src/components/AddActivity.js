import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  InsertActivity,
  SetActivity,
  SetActivitySaveResult,
  SetShowActivityDialog,
} from "../actions";
import validator from "validator";

export default function AddActivity() {
  const activity = useSelector((state) => state.addReducer.activity);
  const saveResult = useSelector(
    (state) => state.addReducer.activitySaveResult
  );
  const dispatch = useDispatch();

  const handleOnSave = async () => {
    if (validator.isEmpty(activity)) {
      dispatch(
        SetActivitySaveResult({
          error: "Please enter a value",
          message: "",
        })
      );
      return;
    }

    const res = await InsertActivity(activity);
    
    if (res.data.error) {
      dispatch(SetActivitySaveResult({ error: res.data.error, message: "" }));
    } else {
      dispatch(
        SetActivitySaveResult({
          error: "",
          message: "Activity created succesfully!",
        })
      );
      dispatch(SetActivity(""));
    }
  };

  return (
    <div>
      <div className="mb-3 row p-2">
        <label className="col-sm-3 col-form-label">Activity</label>
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control"
            id="activity"
            placeholder="Enter new activity"
            value={activity}
            onChange={(e) => {
              dispatch(SetActivity(e.target.value));
            }}
          ></input>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-11">
          {saveResult.error.length > 0 && (
            <div className="alert alert-danger" role="alert">
              {saveResult.error}
            </div>
          )}
          {saveResult.message.length > 0 && (
            <div className="alert alert-success" role="alert">
              {saveResult.message}
            </div>
          )}
        </div>
      </div>
      <div className="mb-3 row p-2">
        <div className="col-sm-11 text-end">
          <button className="btn btn-primary btn-add" onClick={handleOnSave}>
            Save
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => {
              dispatch(SetShowActivityDialog(false));
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
