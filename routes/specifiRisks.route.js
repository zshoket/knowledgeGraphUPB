var express = require("express");
var router = express.Router();
const driver = require("../neo4j-driver");


// Get all Specific Risks
router.get("/specificRisks", async (req, res) => {
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH (n:SpezifischeRisiken) RETURN id(n) as id, n.name as name,  head(labels(n)) as node"
      );
      const data = result.records.map((item) => {
        return {
          id: item.get("id"),
          name: item.get("name"),
          node: item.get("node"),
        };
      });
      res.send(data);
    } catch (e) {
      res.status(500).send(e);
    } finally {
      session.close();
    }
  });
  
  // Get Specific Risks by Risk Id
  router.get("/specificRisk/:id", async (req, res) => {
    const session = driver.session();
    try {
      const riskId = req.params.id;
      const result = await session.run(
        `MATCH (n:SpezifischeRisiken)-[]-(m:RiskType) where id(m)=${riskId} RETURN distinct id(n) as id, n.name as name,  head(labels(n)) as node`
      );
      const data = result.records.map((item) => {
        return {
          id: item.get("id"),
          name: item.get("name"),
          node: item.get("node"),
        };
      });
      res.send(data);
    } catch (e) {
      res.status(500).send(e);
    } finally {
      session.close();
    }
  });

  module.exports=router;