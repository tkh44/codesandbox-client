import styled from 'react-emotion';

export default styled.div`
  display: flex;
  flex-direction: row;

  justify-content: ${props => props.justifyContent};
  align-items: ${props => props.alignItems || 'center'};
`;
