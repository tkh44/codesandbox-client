import React from "react";
import styled from "react-emotion";
import { withTheme } from "theming";

const getColor = ({ right, offMode, secondary, theme }) => {
  if (right) {
    return secondary ? theme.templateColor || theme.secondary : theme.primary;
  }
  if (offMode) return `rgba(0, 0, 0, 0.3)`;
  return secondary ? theme.primary : theme.templateColor || theme.secondary;
};

const Container = withTheme(styled.div`
  transition: 0.3s ease all;
  position: relative;
  background-color: ${getColor};
  width: ${({ small }) => (small ? 3 : 3.5)}rem;
  color: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  height: ${props => (props.small ? 20 : 26)}px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 4px;

  &:before,
  &:after {
    position: absolute;
    top: 50%;
    margin-top: -.5em;
    line-height: 1;
  }
`);

const getSize = ({ small }) =>
  small ? "calc(1.5rem + 2px)" : "calc(2rem + 2px)";

const Dot = styled.div`
  transition: inherit;
  position: absolute;
  height: ${props => (props.small ? 14 : 20)}px;
  width: 1rem;
  left: 0.1rem;
  border-radius: 4px;
  transform: translateX(${props => (props.right ? getSize(props) : "0")});
  top: 0.1rem;
  background-color: white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
`;

type Props = {
  right: boolean,
  onClick: () => void,
  offMode: ?boolean,
  small: ?boolean,
  secondary: ?boolean,
};

export default ({
  right,
  onClick,
  secondary = false,
  offMode = false,
  small = false,
}: Props) => (
  <Container
    small={small}
    secondary={secondary}
    offMode={offMode}
    onClick={onClick}
    right={right}
  >
    <Dot small={small} right={right} />
  </Container>
);
