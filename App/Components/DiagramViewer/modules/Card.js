import Component from 'inferno-component'
import Viewer from 'bpmn-js/lib/Viewer'
import './Card.less';

class Card extends Component {

  componentDidMount = () => {
    let viewer = new Viewer({
      container: '#card-' + this.props.cardId,
      height: '100%',
      width: '100%'
    });

    viewer.importXML(this.props.diagram, (err) => {
      if (!err) {
        let canvas = viewer.get('canvas');
        canvas.zoom('fit-viewport');
      } else {
        console.error('Something went wrong.', err);
      }
    });
  };

  render = () => {
    return (
    <div className="col-xs-12 col-sm-6 col-md-4">
      <div className="panel panel-default card" onClick={() => this.props.handler(this.props.diagram)}>
        <div className="panel-heading text-center"><span className="lead">{this.props.diagramName}</span></div>
        <div className="panel-body" id={"card-" + this.props.cardId}>
        </div>
      </div>
    </div>
    )
  }
}

export default Card;