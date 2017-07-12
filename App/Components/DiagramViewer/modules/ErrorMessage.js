import Component from 'inferno-component'

class ErrorMessage extends Component {

  render = () => {
    return (
      <div className="alert alert-danger" role="alert">
        <p><strong><span className="glyphicon glyphicon-exclamation-sign" /></strong> {this.props.error}</p>
      </div>
    )
  }
}

export default ErrorMessage;