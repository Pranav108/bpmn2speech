import Component from 'inferno-component'

import Viewer from 'bpmn-js/lib/NavigatedViewer'
import CardList from './modules/CardList'
import DropArea from './modules/DropArea'
import ErrorMessage from './modules/ErrorMessage'
import {extractFlowElements} from '../../Service/Bpmn2Speech/SupportedElementHelper'

import './diagram-viewer.less';

class DiagramViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewer: null
    }
  }

  dragHandler = (e) => {
    e.preventDefault();
  };

  dropHandler = (e) => {
    e.preventDefault();
    let files = e.dataTransfer.files;

    if (files.length > 1) {
      this.props.errorHandler('Please provide only one file at a time.');
      return;
    }

    this.parseFile(files[0]);
  };

  parseFile = (file) => {
    let name = file.name;

    if (name.indexOf('.bpmn') === -1) {
      this.props.errorHandler('File must have .bpmn extension');
      return;
    }

    let reader = new FileReader();
    reader.onload = (e) => {
      this.initializeViewer(e.target.result);
    };

    reader.readAsText(file);
  };

  initializeViewer = (xml) => {
    let viewer = this.state.viewer;
    if (!viewer) {
      viewer = new Viewer({
        container: '#diagram-viewer',
        height: '100%',
        width: '100%'
      });
      this.setState({viewer: viewer});
    }

    this.state.viewer.importXML(xml, (err) => {
      if (!err) {
        try {
          let canvas = viewer.get('canvas');
          extractFlowElements(canvas._elementRegistry.getAll());

          canvas.zoom('fit-viewport');

          if (!!this.props.error) {
            this.props.errorHandler(null);
          }

          this.props.canvasHandler(canvas);
          this.props.newDiagramHandler(true);

        } catch(error) {
          this.state.viewer.destroy();
          this.setState({
            viewer: null
          });
          this.props.errorHandler(error.message);
        }

      } else {
        this.props.errorHandler('Whoops, something went wrong.');
      }
    });

    window.scrollTo(0, 0);
  };

  render = () => {
    return (
    <div className="diagram-container">
      <div className={(!this.state.viewer) ? 'empty-viewer' : 'bi-head'}>
        <div id="diagram-viewer" className={(!this.state.viewer) ? '' : 'loaded'}>

          {!!this.props.error &&
             <ErrorMessage error={this.props.error} />
          }

        </div>
      </div>

      <div className="container">

        <CardList viewerHandler={this.initializeViewer} />

        <DropArea dragHandler={this.dragHandler} dropHandler={this.dropHandler} />
      </div>
    </div>
    )
  };
}

export default DiagramViewer;