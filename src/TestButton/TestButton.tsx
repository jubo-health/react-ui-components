import React from "react";
import clsx from "clsx";
import { TestButtonProps } from "./TestButton.types";

const TestButton: React.FC<TestButtonProps> = ({ foo }) => <div data-testid="TestButton">{foo}</div>;

export default TestButton;
