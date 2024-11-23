import * as React from "react";
import Svg, { SvgProps, Circle, Path } from "react-native-svg";

const ArrowLeft = (props: SvgProps) => (
  <Svg
    // @ts-ignore
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#000000"
    fill="none"
    {...props}
  >
    <Circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
    />
    <Path
      d="M13.5 16C13.5 16 10.5 13.054 10.5 12C10.5 10.9459 13.5 8 13.5 8"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ArrowLeft;
