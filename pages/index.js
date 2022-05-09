import react, { Component } from 'react';
import factory from '../ethereum/factory';

import { Button, Card } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {
  static async getInitialProps() {
    const deployedCampaigns = await factory.methods
      .getDeployedCampaigns()
      .call();

    return { campaigns: deployedCampaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h4>Open Campaigns</h4>
          <Link route="/campaigns/new">
            <a>
              <Button
                content="Create new campaign"
                icon="add circle"
                primary
                floated="right"
              ></Button>
            </a>
          </Link>

          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
