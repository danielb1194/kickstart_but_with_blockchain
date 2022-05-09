import react, { Component } from 'react';
import factory from '../ethereum/factory';

import { Button, Card } from 'semantic-ui-react';
import Layout from '../components/Layout';

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
        description: <a>View campaign</a>,
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
          <Button
            content="Create a new campaign"
            icon="add circle"
            primary
            floated="right"
          ></Button>
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
