import React, { Component } from "react";
import { PositionType } from "../domain/PositionType";

export interface IPositionTypeMarkerProps {
  value: PositionType;
}

export class PositionTypeMarker extends Component<IPositionTypeMarkerProps> {
  render() {
    return (
      <div className="position-type-marker">
        {this.props.value}
      </div>
    );
  }
}
