import react, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

class CampaignNew extends Component {
  state = { minimumContribution: 0, error: null, loading: false };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true });
    const accounts = await web3.eth.getAccounts();

    try {
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({ from: accounts[0] });
    } catch (err) {
      this.setState({ error: err.message }, () =>
        console.log(err.message, '\n\n', this.state)
      );
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a new campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.error}>
          <Form.Field>
            <label>Minimum contribution required to backers</label>
            <Input
              label="wei"
              labelPosition="right"
              type="number"
              placeholder="100"
              onChange={(event) =>
                this.setState({ minimumContribution: event.target.value })
              }
            ></Input>
          </Form.Field>
          <Button primary loading={this.state.loading}>
            Create
          </Button>

          <Message
            error
            header="Oops - Something went wrong"
            content={this.state.error}
          ></Message>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
