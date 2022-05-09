import react, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestsList extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const requests = await campaign.methods.getRequests().call();
    const backers = await campaign.methods.getBackers().call();
    return {
      address: props.query.address,
      requests: requests,
      backersCount: backers.length,
    };
  }

  renderRows = () => {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          request={request}
          key={index}
          address={this.props.address}
          backersCount={this.props.backersCount}
          id={index}
        ></RequestRow>
      );
    });
  };

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary>Create a new request</Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Ammount (wei)</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approvers/Backers</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <p>Found {this.props.requests.length} requests</p>
      </Layout>
    );
  }
}

export default RequestsList;
