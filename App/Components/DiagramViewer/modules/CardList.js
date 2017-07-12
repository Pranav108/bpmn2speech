import Component from 'inferno-component'
import Card from './Card'
import './CardList.less'

import DiagramAdvanced from '../../../diagrams/advanced.bpmn'
import DiagramComplex from '../../../diagrams/complex.bpmn'
import DiagramDefaultFlow from '../../../diagrams/defaultflow.bpmn'
import DiagramEmpty from '../../../diagrams/empty.bpmn'
import DiagramParallel from '../../../diagrams/parallel.bpmn'
import DiagramSimple from '../../../diagrams/simple.bpmn';

class CardList extends Component {
  render = () => {
    return (
    <div className="card-list">
      <div className="row">
        <div className="col-xs-12 text-center">
          <h2>
            Try our examples<br />
            <small>by clicking one of the cards</small>
          </h2>
        </div>
      </div>

      <div className="row">
        <Card cardId="1"
              diagramName="Empty Diagram"
              diagram={DiagramEmpty}
              handler={this.props.viewerHandler} />

        <Card cardId="2"
              diagramName="Simple Diagram"
              diagram={DiagramSimple}
              handler={this.props.viewerHandler} />

        <Card cardId="3"
              diagramName="Diagram with Defaultflow"
              diagram={DiagramDefaultFlow}
              handler={this.props.viewerHandler} />

        <Card cardId="4"
              diagramName="Advanced Diagram"
              diagram={DiagramAdvanced}
              handler={this.props.viewerHandler} />

        <Card cardId="5"
              diagramName="Complex Diagram"
              diagram={DiagramComplex}
              handler={this.props.viewerHandler} />

        <Card cardId="6"
              diagramName="Parallel Gateway"
              diagram={DiagramParallel}
              handler={this.props.viewerHandler} />
      </div>
    </div>
    );
  }
}

export default CardList;