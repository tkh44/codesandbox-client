import styled from 'react-emotion';
import theme from 'common/theme';

export default styled.button`
  display: inline-block;
  background-color: transparent;
  color: ${() => theme.secondary()};
  border: none;
  outline: none;
  cursor: pointer;
  text-decoration: underline;
`;
