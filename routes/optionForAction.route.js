var express = require("express");
var router = express.Router();
const driver = require("../neo4j-driver");


// Get all Option for Action
router.get("/optionForAction", async (req, res) => {
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH (n:Handlungsoptionen) RETURN id(n) as id, n.name as name,  head(labels(n)) as node"
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
  
  // Get all Option for Action by Risk Id
  router.get("/optionForAction/:id", async (req, res) => {
    const session = driver.session();
    try {
      const riskImpactId = req.params.id;
      const result = await session.run(
        `MATCH (n:Handlungsoptionen)-[]-(p:RisikoUrsachen) where id(p) in [${riskImpactId}] RETURN id(n) as id, n.name as name,  head(labels(n)) as node, n.details as details, n.dimension as dimension`
      );
      const data = result.records.map((item) => {
        return {
          id: item.get("id"),
          name: item.get("name"),
          node: item.get("node"),
          dimension: item.get("dimension"),
          details: item.get("details"),
        };
      });
      res.send(data);
    } catch (e) {
      res.status(500).send(e);
    } finally {
      session.close();
    }
  });
  
  // Get all Option for Action with link to risk type
  router.get("/optionForActionWithLink", async (req, res) => {
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH (n:Handlungsoptionen)-[]-(p:RisikoUrsachen) RETURN id(n) as id, n.name as name,  head(labels(n)) as node, n.details as details, n.dimension as dimension"
      );
      const data = result.records.map((item) => {
        return {
          id: item.get("id"),
          name: item.get("name"),
          node: item.get("node"),
          dimension: item.get("dimension"),
          details: item.get("details"),
        };
      });
      res.send(data);
    } catch (e) {
      res.status(500).send(e);
    } finally {
      session.close();
    }
  });
  
//Create new option for action
router.post("/optionForAction", async (req, res) => {
    const session = driver.session();
    try {
      const name = req.body.name;
      const dimension = req.body.dimesion;
      const details = req.body.details;
      const riskImpacts = req.body.riskImpacts;
      const query_checkIfExists = `MATCH (n:Handlungsoptionen) where toLower(n.name)='${name.toLowerCase()}' return n`;
      const result_exists = await session.run(query_checkIfExists);
      if (result_exists.records.length) {
        return res
          .status(400)
          .json({ error: "Option for action already exists" });
      } else {
        const txc = session.beginTransaction();
        const query = `CREATE (n:Handlungsoptionen {name: '${name}', details : '${details}', dimension : '${dimension}'}) return id(n) as id`;
        const result = await txc.run(query);
  
        riskImpacts.forEach(async (item) => {
          const riskImpactId = item.riskImpact.value;
          const relations = item.relation;
          relations.forEach(async (relation) => {
            if (relation.value.toLowerCase() === "has") {
              const query_merge_option_has = `MATCH (n:Handlungsoptionen) , (m:RisikoUrsachen) where n.name='${name}' and id(m)=${riskImpactId} merge (n)-[r:has]->(m)`;
              await txc.run(query_merge_option_has);
            }
            if (relation.value.toLowerCase() === "belongs_to") {
              const query_merge_option_belongsTo = `MATCH (n:Handlungsoptionen) , (m:RisikoUrsachen) where n.name='${name}' and id(m)=${riskImpactId} merge (n)<-[r:Belongs_To]-(m)`;
              await txc.run(query_merge_option_belongsTo);
            }
          });
        });
        await txc.commit();
        res.json({ data: result.records });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    } finally {
      session.close();
    }
  });

  module.exports=router;