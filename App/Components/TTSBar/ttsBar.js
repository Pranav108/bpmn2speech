import Component from 'inferno-component'
import Converter from '../../Service/Bpmn2Speech/Converter';
import {extractFlowElements} from '../../Service/Bpmn2Speech/SupportedElementHelper'
import './tts-bar.less';

class TTSBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      voices: [],
      voice: null,
      pitch: 2,
      rate: 1.5,
      messages: [],
    };

    if ('speechSynthesis' in window) {
      this.state.voices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = this.onInit;
    }
  }

  onInit = () => {
    let voices = window.speechSynthesis.getVoices();
    let filteredVoices = voices.filter(v => {
      return v.lang === 'en-US' || v.lang === 'en-GB';
    });

    // prefer local voices over internet ones
    let localVoice = filteredVoices.filter(v => {
      return v.localService;
    });

    this.setState({
      voices: filteredVoices,
      voice: localVoice[0] || filteredVoices[0]
    });
  };

  /**
   * Update the messages state
   *
   * This needs to be done because the browsers garbage collector
   * produces a bug in which the events for the html5 speech api
   * will not be fired.
   */
  onUpdate = () => {
    this.setState({
      messages : this.updateMessages()
    });
  };

  /**
   * fetch all elements and convert them into messages
   *
   * @return {Array}
   */
  updateMessages = () => {
    let messages = [];
    if (!!this.props.canvas()) {
      let elements = this.props.canvas()._elementRegistry.getAll();
      try {
        let flowElements = extractFlowElements(elements);
        let converter = new Converter(flowElements);
        let convertedElements = converter.convert();

        convertedElements.forEach(element => {
          messages.push(this.generateMessage(element));
        });
      } catch (exception) {
        this.props.errorHandler(exception.message);
      }


    }

    return messages;
  };

  /**
   * Handler for clicking the play button
   */
  clickHandler = () => {
    if (this.props.newDiagram) {
      this.onUpdate();

      this.props.newDiagramHandler(false);
    }

    this.state.messages.forEach(message => {
      window.speechSynthesis.speak(message);
    });

  };

  /**
   * Generates a message which should be spoken by the TTS engine.
   *
   * @param element
   * @return {SpeechSynthesisUtterance}
   */
  generateMessage = (element) => {
    let message = new SpeechSynthesisUtterance();
    message.voice = this.state.voice;
    message.pitch = this.state.pitch;
    message.rate = this.state.rate;
    message.volume = 1;
    message.lang = 'en-US';
    message.text = element.text;

    // add highlight to the element we listen to
    message.onstart = () => {
      this.props.canvas().addMarker(element.id, 'highlight');
    };

    // remove highlight of the element when messsage is finished
    message.onend = () => {
      this.props.canvas().removeMarker(element.id, 'highlight');
    };

    return message;
  };

  updatePitch = (event) => {
    let pitch = event.target.value;
    if (pitch < 0) {
      pitch = 0;
    }

    if (pitch > 2) {
      pitch = 2;
    }

    let newMessages = [];
    this.state.messages.forEach(m => {
      m.pitch = pitch;
      newMessages.push(m);
    });

    this.setState({
      pitch: pitch,
      messages: newMessages
    });
  };

  updateRate = (event) => {
    let rate = event.target.value;
    if (rate < 0) {
      rate = 0;
    }

    if (rate > 10) {
      rate = 10;
    }

    let newMessages = [];
    this.state.messages.forEach(m => {
      m.rate = rate;
      newMessages.push(m);
    });

    this.setState({
      rate: rate,
      messages: newMessages
    });
  };

  changeVoice = (event) => {
    let voiceName = event.target.value;
    let voice = this.state.voices.find(v => {
      return v.name === voiceName;
    });

    let newMessages = [];
    this.state.messages.forEach(m => {
      m.voice = voice;
      newMessages.push(m);
    });

    this.setState({
      voice: voice,
      messages: newMessages
    })
  };

  renderPlayMenu = () => {
    return (
    <div>
      <div className="input-group input-group-sm">
        <span className="input-group-addon">Voice</span>
        <select className="form-control" onChange={this.changeVoice}>
          {this.state.voices.map(voice => (
            <option onChange={() => this.changeVoice(voice)}
                    selected={(voice.name === this.state.voice.name) ? 'selected' : ''}
                    value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group input-group-sm">
        <span className="input-group-addon">Pitch</span>
        <input
          type="number"
          className="form-control"
          id="pitch"
          step="0.1"
          min="0"
          max="2"
          value={this.state.pitch}
          onChange={this.updatePitch}
        />
      </div>

      <div className="input-group input-group-sm">
        <span className="input-group-addon">Rate</span>
        <input
          type="number"
          className="form-control"
          id="rate"
          step="0.1"
          min="0.1"
          max="10"
          value={this.state.rate}
          onChange={this.updateRate}/>
      </div>

      <button className="btn btn-sm btn-primary" type="button" onClick={() => this.clickHandler()} >
        Play <span className="glyphicon glyphicon-play" />
      </button>
    </div>
    )
  };

  render = () => {
    return (
      <form className="navbar-form navbar-right">
        { !!this.props.canvas() ? this.renderPlayMenu() : null}
      </form>
    );
  };
}

export default TTSBar;

