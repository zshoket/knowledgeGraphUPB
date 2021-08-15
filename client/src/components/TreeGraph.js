import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import {
  GetActiveSums,
  GetActiveSumsByRiskId,
  GetActivities,
  GetActivitiesByOptionIds,
  GetDimensions,
  GetDimensionsByRiskId,
  GetOptionForActions,
  GetOptionForActionsByRiskImpactId,
  GetPassiveSumByRiskId,
  GetPassiveSums,
  GetRelationships,
  GetRelationshipsById,
  GetRiskFields,
  GetRiskFieldsByRiskId,
  GetRiskImpacts,
  GetRiskImpactsByRiskField,
  GetRiskTypeById,
  GetRiskTypes,
  GetSpecificRisks,
  GetSpecificRisksByRiskId,
  GetUseCases,
  GetUseCasesByRiskField,
  SetSelectedNode,
} from "../actions";
import NodeDetails from "./NodeDetails";

cytoscape.use(fcose);

export default function TreeGraph() {
  const dispatch = useDispatch();

  const prefix_riskType = "risk_type_";
  const prefix_dimension = "dimension_";
  const prefix_activeSum = "active_sum_";
  const prefix_passiveSum = "passive_sum_";
  const prefix_useCase = "use_case_";
  const prefix_riskField = "risk_field_";
  const prefix_riskImpact = "risk_impact_";
  const prefix_optionForAction = "option_for_action_";
  const prefix_activity = "activity_";
  const prefix_specificRisk = "specific_risk_";

  const GetPrefix = (node) => {
    switch (node) {
      case "RiskType":
        return prefix_riskType;
      case "Dimension":
        return prefix_dimension;
      case "ActiveSum":
        return prefix_activeSum;
      case "PassiveSum":
        return prefix_passiveSum;
      case "Risikofeld":
        return prefix_riskField;
      case "UseCase":
        return prefix_useCase;
      case "RisikoUrsachen":
        return prefix_riskImpact;
      case "Handlungsoptionen":
        return prefix_optionForAction;
      case "Maßnahmen":
        return prefix_activity;
      case "SpezifischeRisiken":
        return prefix_specificRisk;
      default:
        break;
    }
  };

  const selectedRiskType = useSelector(
    (state) => state.graphReducer.selectedRiskType
  );
  const [graphData, setgraphData] = useState([]);

  const handleNodeClick = (e) => {
    e.preventDefault();
    const data = {
      ...e.target.data().data,
      prefix: e.target.id(),
    };
    dispatch(SetSelectedNode(data));
  };

  useEffect(() => {
    const GetGraphData = async () => {
      try {
        var riskTypes = [];
        var dimensions = [];
        var activeSums = [];
        var passiveSums = [];
        var riskFields = [];
        var useCases = [];
        var riskImpacts = [];
        var relationships = [];
        var optionforActions = [];
        var activities = [];
        var specificRisks = [];

        if (selectedRiskType === -1) {
          riskTypes = await GetRiskTypes();
          dimensions = await GetDimensions();
          activeSums = await GetActiveSums();
          passiveSums = await GetPassiveSums();
          riskFields = await GetRiskFields();
          riskImpacts = await GetRiskImpacts();
          useCases = await GetUseCases();
          relationships = await GetRelationships();
          optionforActions = await GetOptionForActions();
          activities = await GetActivities();
          specificRisks = await GetSpecificRisks();
        } else {
          riskTypes = await GetRiskTypeById(selectedRiskType);
          dimensions = await GetDimensionsByRiskId(selectedRiskType);
          activeSums = await GetActiveSumsByRiskId(selectedRiskType);
          passiveSums = await GetPassiveSumByRiskId(selectedRiskType);
          riskFields = await GetRiskFieldsByRiskId(selectedRiskType);
          const riskFieldIds = riskFields
            .map((item) => {
              return item.id;
            })
            .join(",");
          riskImpacts = await GetRiskImpactsByRiskField(riskFieldIds);
          const riskImpactIds = riskImpacts
            .map((item) => {
              return item.id;
            })
            .join(",");

          useCases = await GetUseCasesByRiskField(riskFieldIds);
          optionforActions = await GetOptionForActionsByRiskImpactId(
            riskImpactIds
          );
          var optionActionIds = "0";
          if (optionforActions.length) {
            optionActionIds = optionforActions
              .map((item) => {
                return item.id;
              })
              .join(",");
            activities = await GetActivitiesByOptionIds(optionActionIds);
          } else {
            activities = [];
          }

          specificRisks = await GetSpecificRisksByRiskId(selectedRiskType);

          relationships = await GetRelationshipsById(
            selectedRiskType,
            riskFieldIds,
            optionActionIds
          );
        }

        const risk_nodes = riskTypes.map((item) => {
          return {
            data: {
              id: `${prefix_riskType}${item.id}`,
              label: item.name,
              data: item,
            },
          };
        });

        const dimension_nodes = dimensions.map((item) => {
          return {
            data: {
              id: `${prefix_dimension}${item.id}`,
              label: item.name,
              data: item,
            },
          };
        });

        const activeSum_nodes = activeSums.map((item) => {
          return {
            data: {
              id: `${prefix_activeSum}${item.id}`,
              label: item.name,
              data: item,
            },
          };
        });
        const passiveSum_nodes = passiveSums.map((item) => {
          return {
            data: {
              id: `${prefix_passiveSum}${item.id}`,
              label: item.name,
              data: item,
            },
          };
        });

        const riskFields_nodes = riskFields.map((item) => {
          return {
            data: {
              id: `${prefix_riskField}${item.id}`,
              label: item.name,
              data: item,
            },
          };
        });

        const useCases_nodes = useCases.map((item) => {
          return {
            data: {
              id: `${prefix_useCase}${item.id}`,
              label: item.name,
              data: item,
            },
          };
        });

        const riskImpacts_nodes = riskImpacts.map((item) => {
          return {
            data: {
              id: `${prefix_riskImpact}${item.id}`,
              label: item.name,
              data: item,
            },
          };
        });

        const optionForAction_nodes = optionforActions.map((item) => {
          return {
            data: {
              id: `${prefix_optionForAction}${item.id}`,
              label: item.name,
              data: item,
            },
          };
        });

        const specificRisk_nodes = specificRisks.map((item) => {
          return {
            data: {
              id: `${prefix_specificRisk}${item.id}`,
              label: item.name,
              data: item,
            },
          };
        });

        const activities_nodes = activities.map((item) => {
          return {
            data: {
              id: `${prefix_activity}${item.id}`,
              label: item.name,
              data: item,
            },
          };
        });

        const relationship_edges = relationships.map((item) => {
          return {
            data: {
              source: `${GetPrefix(item.source_node)}${item.source_id}`,
              target: `${GetPrefix(item.target_node)}${item.target_id}`,
              label: item.relationship,
            },
          };
        });

        setgraphData([
          ...risk_nodes,
          ...dimension_nodes,
          ...activeSum_nodes,
          ...passiveSum_nodes,
          ...riskFields_nodes,
          ...riskImpacts_nodes,
          ...useCases_nodes,
          ...optionForAction_nodes,
          ...specificRisk_nodes,
          ...activities_nodes,
          ...relationship_edges,
        ]);
      } catch (e) {
        console.log(e);
      }
    };

    GetGraphData();
  }, [selectedRiskType]);

  const layout = {
    animate: false,
    name: "fcose",
    nestingFactor: 1.2,
    nodeDimensionsIncludeLabels: true,
    nodeOverlap: 4,
    numIter: 100,

    padding: 10,
    position(node) {
      return { row: node.data("row"), col: node.data("col") };
    },
    randomize: true,
    refresh: 20,
  };

  const styles = [
    {
      selector: "node",
      style: {
        content: "data(label)",
        width: 20,
        height: 20,
        backgroundColor: function (node) {
          if (node.data("id").includes(prefix_riskType)) {
            return "#7ac58b";
          } else if (node.data("id").includes(prefix_dimension)) {
            return "#3583d1";
          } else if (node.data("id").includes(prefix_activeSum)) {
            return "#dd6689";
          } else if (node.data("id").includes(prefix_passiveSum)) {
            return "#f95b5f";
          } else if (node.data("id").includes(prefix_useCase)) {
            return "#ffbc55";
          } else if (node.data("id").includes(prefix_riskField)) {
            return "#d6c1a6";
          } else if (node.data("id").includes(prefix_riskImpact)) {
            return "#eeacc2";
          } else if (node.data("id").includes(prefix_optionForAction)) {
            return "#909497";
          } else if (node.data("id").includes(prefix_activity)) {
            return "#7D3C98";
          } else if (node.data("id").includes(prefix_specificRisk)) {
            return "#283747";
          }
        },
        "font-size": "2",
      },
    },
    {
      selector: "edge",
      style: {
        label: "data(label)",
        width: 0.2,
        "curve-style": "bezier",
        "font-size": "1",
      },
    },
  ];

  return (
    <>
      <div className="row mx-5 my-3 rounded-3 graph-wrapper">
        <CytoscapeComponent
          elements={graphData}
          style={{ width: "100%", height: "450px" }}
          layout={layout}
          stylesheet={styles}
          cy={(cy) => {
            cy.on("click", "node", (evt) => {
              evt.preventDefault();
              handleNodeClick(evt);
            });
          }}
        />
      </div>
      <NodeDetails />
    </>
  );
}
