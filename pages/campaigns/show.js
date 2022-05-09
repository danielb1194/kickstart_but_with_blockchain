import react, { Component } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Link } from '../../routes';

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);

    const details = await campaign.methods.getSummary().call();

    return {
      address: props.query.address,
      minimumContribution: details['0'],
      balance: details['1'],
      requestCount: details['2'],
      backersCount: details['3'],
      manager: details['4'],
    };
  }

  renderCards() {
    const {
      minimumContribution,
      balance,
      requestCount,
      backersCount,
      manager,
    } = this.props;
    const items = [
      {
        header: manager,
        meta: 'Manager address',
        description: 'The manager created this campaign',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'The minimum contribution to back this campaign',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: requestCount,
        meta: 'number of requests',
        description:
          'The manager-created requests to withdraw money from the campaign',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: backersCount,
        meta: 'Number of backers',
        description: 'The number of people backing this campaign',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: balance,
        meta: 'Balance',
        description: 'Current balance of this campaign',
        style: { overflowWrap: 'break-word' },
      },
    ];

    return <Card.Group items={items}></Card.Group>;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address}></ContributeForm>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
