import Component from 'inferno-component'
import DiagramViewer from './Components/DiagramViewer/diagramViewer';
import TTS from './Components/TTSBar/ttsBar';
import './assets/camunda/css/styles.min.css'
import './app.less';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canvas: null,
      isNewDiagram: false,
      error: null
    };
  }

  canvasHandler = (canvas) => {
    this.setState({
      canvas: canvas
    })
  };

  getCanvas = () => {
    return this.state.canvas;
  };

  newDiagramHandler = (isNewDiagram) => {
    this.setState({
      isNewDiagram: isNewDiagram
    })
  };

  setError = (error) => {
    this.setState({
      error: error
    })
  };


  render = () => {
    return (
    <div className="app">
      <div className="cam-brand-header">
        <div className="container">
          <a href="/" className="navbar-brand">
            <span className="brand-logo" />
            <span className="brand-name">
              Model 2 Speech
            </span>
          </a>

          <div className="collapse navbar-collapse">
            <TTS
            errorHandler={this.setError}
            canvas={this.getCanvas}
            newDiagram={this.state.isNewDiagram}
            newDiagramHandler={this.newDiagramHandler} />
          </div>
        </div>
      </div>

      <DiagramViewer canvasHandler={this.canvasHandler}
                     newDiagramHandler={this.newDiagramHandler}
                     error={this.state.error}
                     errorHandler={this.setError} />
    </div>
    )
  }
}

export default App;
