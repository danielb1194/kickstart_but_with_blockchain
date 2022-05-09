import react, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link } from '../../../routes';

class NewRequest extends Component {
  state = {
    errorMessage: '',
    loading: false,
    description: '',
    value: '',
    recipient: '',
  };

  static async getInitialProps(props) {
    return { address: props.query.address };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    const campaign = Campaign(this.props.address);
    const { description, value, recipient } = this.state;

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };
  render() {
    return (
      <Layout>
        <h3>Create a new request</h3>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            ></Input>

            <label>Value</label>
            <Input
              label="ether"
              labelPosition="right"
              onChange={(event) => this.setState({ value: event.target.value })}
            ></Input>

            <label>Recipient's address</label>
            <Input
              onChange={(event) =>
                this.setState({ recipient: event.target.value })
              }
            ></Input>

            <Button
              primary
              onClick={this.onSubmit}
              loading={this.state.loading}
            >
              Create
            </Button>
          </Form.Field>
          <Message error header="" content={this.state.errorMessage}></Message>
        </Form>
      </Layout>
    );
  }
}

export default NewRequest;
