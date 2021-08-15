var express = require("express");
var router = express.Router();
const driver = require("../neo4j-driver");

// Get All Relationships
router.get("/relationships", async (req, res) => {
    const session = driver.session();
    try {
      const result = await session.run(
        `MATCH (n:RiskType)-[r]-(m) RETURN id(n) as source_id, head(labels(n)) as source_label ,n.name as name, type(r) as relationship, head(labels(m)) as target_label,id(m) as target_id,properties(m) as properties 
        UNION ALL MATCH (n:Risikofeld)-[r]-(m) RETURN id(n) as source_id, head(labels(n)) as source_label ,n.name as name, type(r) as relationship, head(labels(m)) as target_label,id(m) as target_id,properties(m) as properties 
        UNION ALL MATCH (n:Handlungsoptionen)-[r]-(m) RETURN id(n) as source_id, head(labels(n)) as source_label ,n.name as name, type(r) as relationship, head(labels(m)) as target_label,id(m) as target_id,properties(m) as properties `
      );
      //
      const data = result.records.map((item) => {
        return {
          source_id: item.get("source_id"),
          source_node: item.get("source_label"),
          name: item.get("name"),
          target_node: item.get("target_label"),
          relationship: item.get("relationship"),
          target_id: item.get("target_id"),
          properties: item.get("properties"),
        };
      });
      res.send(data);
    } catch (e) {
      res.status(500).send(e);
    } finally {
      session.close();
    }
  });
  
  // Get All Relationships by Risk Id and Risk Field Id
  router.get(
    "/relationship/:id/:riskFieldId/:optionForActionId",
    async (req, res) => {
      const session = driver.session();
      try {
        const id = req.params.id;
        const riskFieldId = req.params.riskFieldId;
        const optionForActionId = req.params.optionForActionId;
        const result = await session.run(
          `MATCH (n:RiskType)-[r]-(m) where id(n)=${id} RETURN id(n) as source_id, head(labels(n)) as source_label ,n.name as name, type(r) as relationship, head(labels(m)) as target_label,id(m) as target_id,properties(m) as properties 
        UNION ALL MATCH (n:Risikofeld)-[r]-(m) where id(n) in [${riskFieldId}] and NOT (n)-[r]-(m:RiskType) RETURN id(n) as source_id, head(labels(n)) as source_label ,n.name as name, type(r) as relationship, head(labels(m)) as target_label,id(m) as target_id,properties(m) as properties
        UNION ALL MATCH (n:Handlungsoptionen)-[r]-(m) where id(n) in [${optionForActionId}]  RETURN id(n) as source_id, head(labels(n)) as source_label ,n.name as name, type(r) as relationship, head(labels(m)) as target_label,id(m) as target_id,properties(m) as properties`
        );
  
        const data = result.records.map((item) => {
          return {
            source_id: item.get("source_id"),
            source_node: item.get("source_label"),
            name: item.get("name"),
            target_node: item.get("target_label"),
            relationship: item.get("relationship"),
            target_id: item.get("target_id"),
            properties: item.get("properties"),
          };
        });
        res.send(data);
      } catch (e) {
        console.log(e);
        res.status(500).send(e);
      } finally {
        session.close();
      }
    }
  );

  
  module.exports=router;