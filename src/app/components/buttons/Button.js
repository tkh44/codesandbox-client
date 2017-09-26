import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css, keyframes } from 'react-emotion';

import theme from 'common/theme';

const getBackgroundColor = ({ disabled, red, secondary }) => {
  if (disabled) return css`background: ${theme.background2.darken(0.1)()};`;
  if (secondary) return css`background: #3a4b5d;`;
  if (red)
    return css`
      background-image: linear-gradient(270deg, #f27777, #400000);
    `;
  return css`
    background-image: linear-gradient(
      270deg,
      #fed29d,
      #a58b66,
      #7abae8,
      #56a0d6
    );
  `;
};

const getColor = ({ disabled, secondary }) => {
  if (disabled) return theme.background2.lighten(1.5)();
  if (secondary) return `#56a0d6`;
  return 'white';
};

const getBorder = ({ secondary }) => {
  if (secondary) return `1px solid #56a0d6`;
  return 'none';
};

const forward = keyframes`
  0%{background-position:0% 50%}
  100%{background-position:100% 50%}
`;

const backward = keyframes`
  0%{background-position:100% 0%}
  100%{background-position:0% 50%}
`;

const styles = props => css`
  transition: 0.3s ease all;
  animation-name: ${backward};
  animation-duration: 300ms;
  animation-timing-function: ease;

  border: none;
  outline: none;
  ${getBackgroundColor(props)};
  background-size: 720%;

  border: ${getBorder(props)};
  border-radius: 4px;

  box-sizing: border-box;
  font-size: 1.125rem;
  text-align: center;
  color: ${getColor(props)};
  font-weight: 400;
  ${!props.disabled && `box-shadow: 0 3px 3px rgba(0, 0, 0, 0.5);`};
  width: ${props.block ? '100%' : 'inherit'};

  ${props.small
    ? css`
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
      `
    : css`
        padding: 0.65rem 2.25rem;
      `};

  user-select: none;
  text-decoration: none;

  ${!props.disabled &&
    css`
      cursor: pointer;
      &:hover {
        animation-name: ${forward};
        animation-duration: 300ms;
        animation-timing-function: ease;
        animation-direction: normal;
        animation-fill-mode: forwards;

        box-shadow: 0 7px 10px rgba(0, 0, 0, 0.5);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(1px);
        box-shadow: 0 0 0 rgba(0, 0, 0, 0.5);
      }
    `};
`;

const LinkButton = styled(Link)`${styles};`;
const AButton = styled.a`${styles};`;
const Button = styled.button`${styles};`;

type Props = {
  [key: any]: any,
  to: ?string,
  href: ?string,
};

export default (props: Props) => {
  // Link
  if (props.to) {
    return <LinkButton {...props} />;
  }

  if (props.href) {
    return <AButton {...props} />;
  }

  return <Button {...props} />;
};
