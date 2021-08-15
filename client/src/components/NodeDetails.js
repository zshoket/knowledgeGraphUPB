import React from "react";
import { useSelector } from "react-redux";

export default function NodeDetails() {
  const selectedNode = useSelector((state) => state.graphReducer.selectedNode);

  return (
    <div className="row mx-5 my-3 rounded-3 bg-white py-3 font-monospace">
      {selectedNode.id > -1 && (
        <>
          <div className="col-sm-2 py-0">
            <span className={`badge rounded-pill bg-${selectedNode.node}`}>
              {selectedNode.node}
            </span>
          </div>

          <div className="col-sm-4 py-0 text-truncate myCustom3">
            <span className="font-bold p-0">
              {selectedNode.prefix.includes("active_sum_") ||
              selectedNode.prefix.includes("passive_sum_")
                ? "value"
                : "name"}{" "}
              :
            </span>{" "}
            <span
              className="py-0"
              title={selectedNode.name}
              data-bs-toggle="tooltip"
              data-bs-placement="left"
            >
              {selectedNode.name}
            </span>
          </div>
        </>
      )}

      {selectedNode.id > -1 && selectedNode.dimension && (
        <div className="col-sm-3 py-0 text-truncate myCustom2">
          <span className="font-bold p-0">dimension :</span>{" "}
          <span className="py-0">{selectedNode.dimension}</span>
        </div>
      )}
      {selectedNode.id > -1 && selectedNode.details && (
        <div className="col-sm-2 py-0 text-truncate myCustom">
          <span className="font-bold p-0">details :</span>{" "}
          <span className="py-0">{selectedNode.details}</span>
        </div>
      )}
      {selectedNode.id === -1 && (
        <span className="py-0 fw-lighter fst-italic">
          Please click on a node to view details
        </span>
      )}
    </div>
  );
}
