var express = require("express");
var router = express.Router();
const driver = require("../neo4j-driver");

// Get all Activities
router.get("/activities", async (req, res) => {
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH (n:Maßnahmen) RETURN id(n) as id, n.name as name,  head(labels(n)) as node"
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
  
  //Link Activity with Option for Action
  router.post("/linkActivity", async (req, res) => {
    const session = driver.session();
  
    try {
      const optionForActionId = req.body.optionForActionId;
      const activityIds = req.body.activityIds;
      const delete_relation_query = `match (n:Handlungsoptionen)-[r]-(m:Maßnahmen) where id(n)=${optionForActionId} delete r`;
      const link_query = `match (n:Handlungsoptionen) , (m:Maßnahmen) where id(n)=${optionForActionId} and id(m) in [${activityIds}] merge (n)-[r:contains]->(m)`;
  
      const txc = session.beginTransaction();
      var result_delete = await txc.run(delete_relation_query);
      const result = await txc.run(link_query);
      await txc.commit();
      res.json({ data: result });
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    } finally {
      session.close();
    }
  });
  
  //Get already mapped activities un format to bind with activity dropdown
  router.get("/mappedActivities/:id", async (req, res) => {
    const session = driver.session();
    try {
      const optionForActionId = req.params.id;
      const result = await session.run(
        `MATCH (n:Handlungsoptionen)-[r]-(d:Maßnahmen) where id(n) in [${optionForActionId}] RETURN id(d) as id, d.name as name`
      );
      const data = result.records.map((item) => {
        return {
          value: item.get("id"),
          label: item.get("name"),
        };
      });
      res.send(data);
    } catch (e) {
      res.status(500).send(e);
    } finally {
      session.close();
    }
  });
  
  //Get already mapped activities under Option for action
  router.get("/activitiesByOptionId/:id", async (req, res) => {
    const session = driver.session();
    try {
      const optionForActionId = req.params.id;
      const result = await session.run(
        `MATCH (n:Handlungsoptionen)-[r]-(d:Maßnahmen) where id(n) in [${optionForActionId}] RETURN id(d) as id, d.name as name, head(labels(d)) as node `
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
      console.log(e);
      res.status(500).send(e);
    } finally {
      session.close();
    }
  });

// Create Activity
router.post("/activity", async (req, res) => {
  const session = driver.session();
  try {
    const name = req.body.name;
    const query_checkIfExists = `MATCH (n:Maßnahmen) where toLower(n.name)='${name.toLowerCase()}' return n`;
    const result_exists = await session.run(query_checkIfExists);
    if (result_exists.records.length) {
      return res.status(400).json({ error: "Activity already exists" });
    } else {
      const query = `CREATE (n:Maßnahmen {name: '${name}'}) return id(n) as id`;
      const result = await session.run(query);
      res.json({ data: result.records });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  } finally {
    session.close();
  }
});


// Get all Activities with Link to RisikoUrsachen. 
// Only these activities that have some link will be displayed in graph
router.get("/activitiesWithLink", async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      "MATCH (n:Maßnahmen)-[]-(s:Handlungsoptionen)-[]-(p:RisikoUrsachen) RETURN id(n) as id, n.name as name,  head(labels(n)) as node"
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


  module.exports = router;