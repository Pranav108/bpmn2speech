import Component from 'inferno-component'
import './DropArea.less'

class DropArea extends Component {

  render = () => {
    return (
    <div className="drop-area">
      <div className="row">
        <div className="col-xs-12">
          <hr />
        </div>
      </div>

      <div className="row">
        <div className="col-xs-12 text-center">
          <h2>You can drop your own bpm file here.</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12 drop-field"
             onDragOver={this.props.dragHandler}
             onDrop={this.props.dropHandler}>

          <div className="col-xs-5 col-md-offset-4">
            <div className="panel panel-info supported-element-panel">
              <div className="panel-heading text-center">
                <span className="lead">Supported BPMN Elements</span>
              </div>
              <div className="panel-body">

                <ul className="list-group">
                  <li className="list-group-item">Start Event (blank)</li>
                  <li className="list-group-item">End Event (blank)</li>
                  <li className="list-group-item">Tasks (Without Boundary Events)</li>
                  <li className="list-group-item">Parallel Gateway</li>
                  <li className="list-group-item">Exclusive Gateway</li>
                  <li className="list-group-item">Sequence Flow</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default DropArea;
