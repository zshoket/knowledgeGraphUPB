import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import {
  GetRiskTypesSelect,
  SelectRiskType,
  SetSelectedNode,
  SetShowActivityDialog,
} from "../actions";
import TreeGraph from "./TreeGraph";
import AddRisk from "./AddRisk";
import AddOptionsActivities from "./AddOptionsActivities";

export default function Home() {
  const dispatch = useDispatch();
  const riskTypes = useSelector((state) => state.graphReducer.riskTypes);
  const selectedRiskType = useSelector(
    (state) => state.graphReducer.selectedRiskType
  );

  const showActivityDialog = useSelector(
    (state) => state.addReducer.showActivityDialog
  );

  const handleAddRisk = () => {
    setshow(true);
  };

  const handleAddOptions = () => {
    dispatch(SetShowActivityDialog(true));
  };

  const [show, setshow] = useState(false);
  const onSelectRiskType = ({ target: { value } }) => {
    dispatch(SelectRiskType(parseInt(value)));
    dispatch(SetSelectedNode());
  };

  useEffect(() => {
    dispatch(GetRiskTypesSelect());
  }, [dispatch]);

  return (
    <Container fluid>
      <div className="row mx-5 my-3">
        <div className="col-sm-10 px-0">
          <select
            className="form-select w-50"
            value={selectedRiskType}
            onChange={onSelectRiskType}
          >
            <option key={-1} value="-1">
              Select a risk type
            </option>
            {riskTypes.map((item) => {
              return (
                <option value={item.id} key={item.name}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="row mx-5 my-3">
        <div className="col-md-9 col-sm-12">
          <span className="badge rounded-pill bg-RiskType">RiskType</span>
          <span className="badge rounded-pill bg-Dimension ms-1">
            Dimension
          </span>
          <span className="badge rounded-pill bg-ActiveSum ms-1">
            ActiveSum
          </span>
          <span className="badge rounded-pill bg-PassiveSum ms-1">
            PassiveSum
          </span>
          <span className="badge rounded-pill bg-Risikofeld ms-1">
            Risikofeld
          </span>
          <span className="badge rounded-pill bg-UseCase ms-1">UseCase</span>
          <span className="badge rounded-pill bg-RisikoUrsachen ms-1">
            RisikoUrsachen
          </span>
          <span className="badge rounded-pill bg-Handlungsoptionen ms-1">
            Handlungsoptionen
          </span>
          <span className="badge rounded-pill bg-Maßnahmen ms-1">
            Maßnahmen
          </span>
          <span className="badge rounded-pill bg-SpezifischeRisiken ms-1">
            SpezifischeRisiken
          </span>
        </div>
        <div className="col-md-3 col-sm-12 align-self-end text-end">
          <button
            className="btn btn-primary btn-sm btn-add"
            onClick={handleAddOptions}
          >
            {" "}
            <FontAwesomeIcon className="" icon={faPlusCircle} /> Options &
            Activities
          </button>
          <button
            className="btn btn-primary btn-sm btn-add ms-2"
            onClick={handleAddRisk}
          >
            {" "}
            <FontAwesomeIcon className="" icon={faPlusCircle} /> Risk Type
          </button>
        </div>
      </div>

      <TreeGraph />
      <AddRisk show={show} setshow={setshow} />
      <AddOptionsActivities show={showActivityDialog} />
    </Container>
  );
}
