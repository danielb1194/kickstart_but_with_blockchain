import react, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class RequestRow extends Component {
  onApprove = async () => {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods
      .approveRequest(this.props.id)
      .send({ from: accounts[0] });
  };

  onFinalize = async () => {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods
      .finalizeRequest(this.props.id)
      .send({ from: accounts[0] });
  };
  render() {
    const readyToFinalize =
      this.props.request.approvers > this.props.backersCount / 2;
    return (
      <Table.Row
        disabled={this.props.request.isCompleted}
        positive={readyToFinalize && !this.props.request.isCompleted}
      >
        <Table.Cell>{this.props.id}</Table.Cell>
        <Table.Cell>{this.props.request.description}</Table.Cell>
        <Table.Cell>{this.props.request.value}</Table.Cell>
        <Table.Cell>{this.props.request.recipient}</Table.Cell>
        <Table.Cell>{`${this.props.request.approvers}/${this.props.backersCount}`}</Table.Cell>
        <Table.Cell>
          <Button
            color="green"
            basic
            onClick={this.onApprove}
            disabled={this.props.request.isCompleted}
          >
            Approve
          </Button>
        </Table.Cell>
        <Table.Cell>
          <Button
            secondary
            onClick={this.onFinalize}
            disabled={this.props.request.isCompleted}
          >
            Finalize
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default RequestRow;
