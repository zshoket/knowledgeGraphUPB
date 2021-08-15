import React, { useEffect, useState } from "react";
import { Container, Modal } from "react-bootstrap";
import Select from "react-select";
import {
  GetDimensions,
  GetOptionForActionList,
  GetRiskFields,
  GetRiskTypesSelect,
  InsertRiskType,
  SelectRiskType,
  SetSelectedNode,
} from "../actions";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import validator from "validator";

export default function AddRisk({ show, setshow }) {
  const [riskType, setriskType] = useState("");
  const [activeSum, setactiveSum] = useState("");
  const [passiveSum, setpassiveSum] = useState("");
  const [selectedDimensionRelation, setselectedDimensionRelation] =
    useState(null);
  const [dimensionList, setdimensionList] = useState([]);
  const [riskFieldList, setriskFieldList] = useState([]);
  const [selectedDimension, setselectedDimension] = useState(null);
  const [saveResult, setsaveResult] = useState({ error: "", message: "" });

  const [specificRisk, setspecificRisk] = useState('');
  const [selectedSpecificRiskRelation, setselectedSpecificRiskRelation] =
    useState([]);

  

  const [riskFields, setRiskFields] = useState([
    { row_id: uuidv4(), riskField: null, relation: [] },
  ]);

 

  const dispatch = useDispatch();

  const relations = [
    { value: "has", label: ":has" },
    { value: "Belongs_To", label: ":Belongs_To" },
  ];

  const handleDimensionRelationChange = (selectedOption) => {
    setselectedDimensionRelation(selectedOption);
    
  };

  
  const handleSpecificRiskRelationChange = (selectedOption) => {
    setselectedSpecificRiskRelation(selectedOption);    
  };


  const handleDimensionChange = (selectedOption) => {
    setselectedDimension(selectedOption);
  };

  const handleRiskFieldChange = (selectedOption, row_id) => {
    

    const updatedData = riskFields.map((item) => {
      if (row_id === item.row_id) {
        item.riskField = selectedOption;
      }
      return item;
    });
    
    setRiskFields(updatedData);
  };

  const handleRiskFieldRelationChange = (selectedOption, row_id) => {
    

    const updatedData = riskFields.map((item) => {
      if (row_id === item.row_id) {
        item.relation = selectedOption;
      }
      return item;
    });
    
    setRiskFields(updatedData);
  }; 

  

  const handleAddRiskField = () => {
    setRiskFields([
      ...riskFields,
      { row_id: uuidv4(), riskField: null, relation: [] },
    ]);
  };

  const handleDeleteRiskField = (row_id) => {
    if (riskFields.length > 1) {
      const values = [...riskFields];
      values.splice(
        values.findIndex((value) => value.row_id === row_id),
        1
      );
      setRiskFields(values);
    }
  };
  

  const styles = {
    multiValue: (base, state) => {
      return state.data.isFixed
        ? { ...base, backgroundColor: "lavender" }
        : base;
    },
    multiValueLabel: (base, state) => {
      return state.data.isFixed
        ? { ...base, fontWeight: "", color: "#4F4D4D", paddingRight: 6 }
        : base;
    },
    multiValueRemove: (base, state) => {
      return state.data.isFixed ? { ...base, display: "none" } : base;
    },
  };

  const handleSave = async () => {
    if (validator.isEmpty(riskType)) {
      setsaveResult({ error: "Please enter risk type", message: "" });
      return;
    }

    if (!selectedDimension) {
      setsaveResult({ error: "Please select a dimention", message: "" });
      return;
    }
    if (!selectedDimensionRelation) {
      setsaveResult({
        error: "Please select a relationship for dimension",
        message: "",
      });
      return;
    }

    var errors = 0;
    riskFields.forEach((item) => {
      if (!item.riskField) {
        setsaveResult({ error: "Please select a risk field", message: "" });
        errors++;
        return;
      }
      if (!item.relation.length) {
        setsaveResult({
          error: "Please select a relationship for Risk Field",
          message: "",
        });
        errors++;
        return;
      }
    });

    if (errors) {
      return;
    }

    if (hasDuplicates(riskFields.map((item) => item.riskField.value))) {
      setsaveResult({ error: "Duplicate risk field selected", message: "" });
      return;
    }

    if(validator.isEmpty(specificRisk) && selectedSpecificRiskRelation.length){
      setsaveResult({ error: "Please enter specific risk or clear the relationship", message: "" });
      return;
    }
    if(!validator.isEmpty(specificRisk) && !selectedSpecificRiskRelation.length){
      setsaveResult({ error: "Please select a relationship for specific risk", message: "" });
      return;
    }

    

    

    //All validations passed - Begin save to db

    const data = {
      riskType,
      dimensionId: selectedDimension.value,
      dimenstionRelations: selectedDimensionRelation,
      activeSum,
      passiveSum,
      riskFields,
      specificRisk,
      specificRiskRelations : selectedSpecificRiskRelation
    };

    const res = await InsertRiskType(data);    
    
    if (res.data.error) {
      setsaveResult({
        error: res.data.error,
        message: "",
      });
    } else {
      //SuccessFull

      const newRiskTypeId = parseInt(res.data.data);
      dispatch(GetRiskTypesSelect());
      dispatch(SelectRiskType(newRiskTypeId));
      dispatch(SetSelectedNode());
      handleClose();
    }
  };

  const handleClose = () => {
    setshow(false);
    setsaveResult({ error: "", message: "" });
    setriskType("");
    setactiveSum("");
    setpassiveSum("");
    setselectedDimension(null);
    setselectedSpecificRiskRelation([]);
    setspecificRisk("");
    setselectedDimensionRelation(null);    
    setRiskFields([{ row_id: uuidv4(), riskField: null, relation: [] }]);
  };

  const hasDuplicates = (array) => {
    return new Set(array).size !== array.length;
  };

  useEffect(() => {
    const GetData = async () => {
      const dimensions = await GetDimensions();
      if (dimensions) {
        setdimensionList(
          dimensions.map((item) => ({ value: item.id, label: item.name }))
        );
      }

      const allriskFields = await GetRiskFields();
      if (allriskFields) {
        setriskFieldList(
          allriskFields.map((item) => ({ value: item.id, label: item.name }))
        );
      }

      dispatch(GetOptionForActionList());
    };
    GetData();
  }, [dispatch]);

  return (
    <div>
      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Header>
          <Modal.Title>Add Risk Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <div className="mb-3 row">
              <label className="col-sm-3 col-form-label">Risk Type</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="risk-type"
                  value={riskType}
                  onChange={(e) => {
                    setriskType(e.target.value);
                  }}
                  placeholder="Enter Risk Type"
                ></input>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-3 col-form-label">Active Sum</label>
              <div className="col-sm-4">
                <input
                  type="number"
                  className="form-control"
                  id="active-sum"
                  value={activeSum}
                  onChange={(e) => {
                    setactiveSum(e.target.value);
                  }}
                  placeholder="Enter Active Sum"
                ></input>
              </div>
              <div className="col-sm-4">
                <Select
                  options={[
                    { value: "contains", label: ":contains", isFixed: true },
                  ]}
                  value={[
                    { value: "contains", label: ":contains", isFixed: true },
                  ]}
                  isClearable={false}
                  styles={styles}
                  isMulti={true}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-3 col-form-label">Passive Sum</label>
              <div className="col-sm-4">
                <input
                  type="number"
                  className="form-control"
                  id="passive-sum"
                  value={passiveSum}
                  onChange={(e) => {
                    setpassiveSum(e.target.value);
                  }}
                  placeholder="Enter Passive Sum"
                ></input>
              </div>
              <div className="col-sm-4">
                <Select
                  options={[
                    { value: "contains", label: ":contains", isFixed: true },
                  ]}
                  value={[
                    { value: "contains", label: ":contains", isFixed: true },
                  ]}
                  isClearable={false}
                  styles={styles}
                  isMulti={true}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-3 col-form-label">Dimension</label>
              <div className="col-sm-4">
                <Select
                  onChange={handleDimensionChange}
                  value={selectedDimension}
                  options={dimensionList}
                  placeholder="Select Dimension"
                  isClearable={true}
                />
              </div>
              <div className="col-sm-4">
                <Select
                  onChange={handleDimensionRelationChange}
                  value={selectedDimensionRelation}
                  options={relations}
                  isMulti={true}
                  placeholder="Select Relation"
                />
              </div>
            </div>

            {riskFields.map((riskField) => (
              <React.Fragment key={riskField.row_id}>
                <div className="mb-3 row">
                  <label className="col-sm-3 col-form-label">Risk Field</label>
                  <div className="col-sm-4">
                    <Select
                      onChange={(selectedItem) => {
                        handleRiskFieldChange(selectedItem, riskField.row_id);
                      }}
                      value={riskField.riskField}
                      options={riskFieldList}
                      placeholder="Select Risk Field"
                      isClearable={true}
                    />
                  </div>
                  <div className="col-sm-4">
                    <Select
                      onChange={(selectedItem) => {
                        handleRiskFieldRelationChange(
                          selectedItem,
                          riskField.row_id
                        );
                      }}
                      value={riskField.relation}
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
                      onClick={handleAddRiskField}
                    />
                    <FontAwesomeIcon
                      className="mx-1 text-danger"
                      icon={faMinusCircle}
                      onClick={() => handleDeleteRiskField(riskField.row_id)}
                    />
                  </div>
                </div>
              </React.Fragment>
            ))}


<div className="mb-3 row">
              <label className="col-sm-3 col-form-label">Specific Risk</label>
              <div className="col-sm-4">
                <input
                  type="text"
                  className="form-control"
                  id="specific-risk"
                  value={specificRisk}
                  onChange={(e) => {
                    setspecificRisk(e.target.value);
                  }}
                  placeholder="Enter Specific Risk"
                ></input>
              </div>
              <div className="col-sm-4">
              
                <Select
                  onChange={handleSpecificRiskRelationChange}
                  value={selectedSpecificRiskRelation}
                  options={relations}
                  isMulti={true}
                  placeholder="Select Relation"
                />
              
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
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary btn-sm" onClick={handleClose}>
            Close
          </button>
          <button
            className="btn btn-primary btn-sm btn-add"
            onClick={handleSave}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
