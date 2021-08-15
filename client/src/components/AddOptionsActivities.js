import React from "react";
import { Container, Modal, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { SetActiveTab, SetShowActivityDialog } from "../actions";
import AddActivity from "./AddActivity";
import AddOptionsForAction from "./AddOptionsForAction";
import Link from "./Link";

export default function AddOptionsActivities({ show }) {
  const dispatch = useDispatch();
  const handleClose = () => dispatch(SetShowActivityDialog(false));
  const activeTab = useSelector(state => state.addReducer.activeTab);

  

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header>
        <Modal.Title>Options for Actions & Activities</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className="mb-3"
            activeKey={activeTab}
            onSelect={(k) => dispatch(SetActiveTab(k))}
          >
            <Tab
              tabClassName="color-primary"
              eventKey="option"
              title="Option for Action"
            >
              <AddOptionsForAction />
            </Tab>
            <Tab
              tabClassName="color-primary"
              eventKey="activities"
              title="Activities"
            >
              <AddActivity />
            </Tab>
            <Tab tabClassName="color-primary" eventKey="link" title="Link">
              <Link />
            </Tab>
          </Tabs>
        </Container>
      </Modal.Body>
    </Modal>
  );
}
