import * as React from "react";
import { Navbar } from "../nav/navbar";
import { SequencesList } from "./sequences_list";
import { StepButtonCluster } from "./step_button_cluster";
import { SequenceEditorMiddle } from "./sequence_editor_middle";
import { connect } from "react-redux";

@connect(state => state)
export class Sequences extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Navbar {...this.props} />
        <div className="all-content-wrapper">
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <StepButtonCluster { ...this.props } />
            </div>
            <div className="col-md-6 col-sm-12">
              <SequenceEditorMiddle { ...this.props } />
            </div>
            <div className="col-md-3 col-sm-12">
              <SequencesList { ...this.props } />
            </div>
          </div>
        </div>
      </div>
    );
  }
};
