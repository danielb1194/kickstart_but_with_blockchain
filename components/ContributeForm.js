import react, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends Component {
  state = {
    contribution: '',
    loading: false,
    errorMessage: '',
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    const campaign = Campaign(this.props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.back().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.contribution, 'ether'),
      });

      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      console.error(err);
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: '' });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Ammount to contribute</label>
          <Input
            label="ether"
            labelPosition="right"
            onChange={(event) =>
              this.setState({ contribution: event.target.value })
            }
          ></Input>
          <Button primary onClick={this.onSubmit} loading={this.state.loading}>
            Contribute!
          </Button>
        </Form.Field>
        <Message error header="" content={this.state.errorMessage}></Message>
      </Form>
    );
  }
}

export default ContributeForm;
