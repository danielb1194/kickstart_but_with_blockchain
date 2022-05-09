import react from 'react';
import { Container } from 'semantic-ui-react';
import Header from './Header';
import 'semantic-ui-css/semantic.min.css';

const Layout = (props) => {
  return (
    <Container style={{ marginTop: '10px' }}>
      <Header></Header>
      {props.children}
      <h1>Footer</h1>
    </Container>
  );
};

export default Layout;
