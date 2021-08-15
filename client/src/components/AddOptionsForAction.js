import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetDimensionList,
  GetOptionForActionList,
  GetRiskImpactList,
  InsertOptionForAction,
  SetOptionForAction,
  SetOptionForActionDetails,
  SetOptionForActionSaveResult,
  SetSelectedOptionForActionDimension,
  SetSelectedRiskImpacts,
  SetShowActivityDialog,
} from "../actions";
import validator from "validator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";

export default function AddOptionsForAction() {
  const optionForAction = useSelector(
    (state) => state.addReducer.optionForAction
  );
  const saveResult = useSelector(
    (state) => state.addReducer.optionForActionSaveRetult
  );

  const selectedRiskImpacts = useSelector(
    (state) => state.addReducer.selectedRiskImpacts
  );

  const riskImpactList = useSelector(
    (state) => state.addReducer.riskImpactList
  );

  const dimensionList = useSelector(
    (state) => state.addReducer.dimensionList
  );
  const selectedOptionForActionDimensions = useSelector(
    (state) => state.addReducer.selectedOptionForActionDimensions
  );
  const optionForActionDetails = useSelector(
    (state) => state.addReducer.optionForActionDetails
  );



  const relations = [
    { value: "has", label: ":has" },
    { value: "Belongs_To", label: ":Belongs_To" },
  ];

  const dispatch = useDispatch();

  const handleRiskImpactChange = (selectedOption, row_id) => {
    

    const updatedData = selectedRiskImpacts.map((item) => {
      if (row_id === item.row_id) {
        item.riskImpact = selectedOption;
      }
      return item;
    });
    
    dispatch(SetSelectedRiskImpacts(updatedData));
  };

  const handleRiskImpactRelationChange = (selectedOption, row_id) => {
    

    const updatedData = selectedRiskImpacts.map((item) => {
      if (row_id === item.row_id) {
        item.relation = selectedOption;
      }
      return item;
    });
    
    dispatch(SetSelectedRiskImpacts(updatedData));
  };

  const handleAddRiskImpact = () => {
    dispatch(
      SetSelectedRiskImpacts([
        ...selectedRiskImpacts,
        { row_id: uuidv4(), riskImpact: null, relation: [] },
      ])
    );
  };

  const handleDeleteRiskImpact = (row_id) => {
    if (selectedRiskImpacts.length > 1) {
      const values = [...selectedRiskImpacts];
      values.splice(
        values.findIndex((value) => value.row_id === row_id),
        1
      );
      dispatch(SetSelectedRiskImpacts(values));
    }
  };

  const handleDimensionChange = (selectedOption) => {
    dispatch(SetSelectedOptionForActionDimension(selectedOption));
  };

  const handleOnSave = async () => {
    if (validator.isEmpty(optionForAction)) {
      dispatch(
        SetOptionForActionSaveResult({
          error: "Please enter a value for Option for action",
          message: "",
        })
      );
      return;
    }

    //Validate Risk Impact
    var errors = 0;
    selectedRiskImpacts.forEach((item) => {
      if (item.riskImpact && !item.relation.length) {        
        dispatch(
          SetOptionForActionSaveResult({
            error: "Please select a relationship for Risk Impact",
            message: "",
          })
        );
        errors++;
        return;
      }
    });

    if (errors) {
      return;
    }
    //Check if there are options without value, then remove before cheching duplicate. This is because the field is non mandatory

    const checkForDuplicateArray = selectedRiskImpacts.map((item) => {
      return item.riskImpact ? item.riskImpact.value : uuidv4();
    });

    
    if (selectedRiskImpacts) {
      if (hasDuplicates(checkForDuplicateArray)) {        
        dispatch(SetOptionForActionSaveResult({
          error: "Duplicate Risk Impact selected",
          message: "",
        }));
        return;
      }
    }

    const dimensionProperty = selectedOptionForActionDimensions.map(item => item.label).join(',');
    
    const data ={
      name : optionForAction,
      dimesion : dimensionProperty,
      details : optionForActionDetails,
      riskImpacts: selectedRiskImpacts.filter(
        (item) => item.riskImpact != null
      ),

    }

    

    const res = await InsertOptionForAction(data);
      
    if (res.data.error) {
      dispatch(
        SetOptionForActionSaveResult({ error: res.data.error, message: "" })
      );
    } else {
      dispatch(
        SetOptionForActionSaveResult({
          error: "",
          message: "Option for action created succesfully!",
        })
      );
      dispatch(SetOptionForAction(""));
      dispatch(GetOptionForActionList());
    }


  };

  const hasDuplicates = (array) => {
    return new Set(array).size !== array.length;
  };

  useEffect(() => {
    dispatch(GetRiskImpactList());
    dispatch(GetDimensionList());
  }, [dispatch]);

  return (
    <div>
      <div className="mb-3 row p-2">
        <label className="col-sm-3 col-form-label">Option for Action</label>
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control"
            id="option-action"
            placeholder="Enter new option for action"
            value={optionForAction}
            onChange={(e) => {
              dispatch(SetOptionForAction(e.target.value));
            }}
          ></input>
        </div>
      </div>

      <div className="mb-3 row p-2">
        <label className="col-sm-3 col-form-label">Details</label>
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control"
            id="option-details"
            placeholder="Enter details"
            value={optionForActionDetails}
            onChange={(e) => {
              dispatch(SetOptionForActionDetails(e.target.value));
            }}
          ></input>
        </div>
      </div>

      <div className="mb-3 row p-2">
              <label className="col-sm-3 col-form-label">Dimension</label>
              <div className="col-sm-8">
                <Select
                  onChange={handleDimensionChange}
                  value={selectedOptionForActionDimensions}
                  options={dimensionList.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  placeholder="Select Dimension"
                  isClearable={true}
                  isMulti={true}
                />
              </div>              
            </div>

      {selectedRiskImpacts.map((item) => (
        <React.Fragment key={item.row_id}>
          <div className="mb-3 row p-2">
            <label className="col-sm-3 col-form-label">Risk Impact</label>
            <div className="col-sm-4">
              <Select
                onChange={(selectedItem) => {
                  handleRiskImpactChange(selectedItem, item.row_id);
                }}
                value={item.riskImpact}
                options={riskImpactList.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                placeholder="Select Risk Impact"
                isClearable={true}
              />
            </div>
            <div className="col-sm-4">
              <Select
                onChange={(selectedItem) => {
                  handleRiskImpactRelationChange(selectedItem, item.row_id);
                }}
                value={item.relation}
                options={relations}
                placeholder="Select Relation"
                isClearable={true}
                isMulti={true}
              />
            </div>
            <div className="col-sm-1 p-2">
              <FontAwesomeIcon
                className="text-success"
                icon={faPlusCircle}
                onClick={handleAddRiskImpact}
              />
              <FontAwesomeIcon
                className="mx-1 text-danger"
                icon={faMinusCircle}
                onClick={() => handleDeleteRiskImpact(item.row_id)}
              />
            </div>
          </div>
        </React.Fragment>
      ))}

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
