import {is} from 'bpmn-js/lib/util/ModelUtil';
import {getTextForElement, getTextForSequenceFlow} from './TextHelper';
import {extractFlowElements} from './SupportedElementHelper'

class BpmnToSpeech {
  constructor(elements) {
    this.state = {
      elements: elements,
      gateways: [],
      converted: []
    }
  }

  /**
   * convert a diagram into a list of text messages
   */
  convert = () => {
    let startEvents = this.findStartEvents(this.state.elements);
    startEvents.forEach((startEvent, idx) => {
      this.processElement(startEvent, this.isLastElementOfArray(idx, startEvents));
    });

    return this.state.converted;
  };

  isLastElementOfArray = (idx, searchArray) => {
    return idx === searchArray.length - 1
  };

  /**
   * Get all start events
   *
   * @param flowElements
   */
  findStartEvents = (flowElements) => {
    return flowElements.filter(element => {
      return is(element, 'bpmn:StartEvent');
    });
  };

  /**
   * recursively transform bpmn elements
   *
   * @param element
   * @param lastWay
   */
  processElement = (element, lastWay) => {
    this.parseElement(element, lastWay);
    this.getNextElement(element, lastWay);
  };

  /**
   * transform a bpmn element into a text component
   *
   * @param element
   * @param lastWay
   */
  parseElement = (element, lastWay) => {
    // exception if element is a merging gateway and the flow is not the last of the gateway scope
    if (this.isMergingGateway(element) && !lastWay) {
      return;
    }

    let parsedElement = {
      id: element.id,
      text: getTextForElement(element)
    };

    this.state.converted.push(parsedElement);
  };

  /**
   * Process the next Element in line
   *
   * @param currentElement
   * @param lastWay
   */
  getNextElement = (currentElement, lastWay) => {
    // if the current element is an end event then there is no other element afterwards
    if (is(currentElement, 'bpmn:EndEvent')) {
      return;
    }

    let defaultTarget = currentElement.outgoing[0].targetRef;

    if (is(currentElement, 'bpmn:Gateway')) {
      // Merging Gateway
      if (currentElement.incoming.length > 1) {
        // update scope when current flow in the gateway is the last flow
        if (lastWay) {
          lastWay = this.getPreviousLastWay();
        } else {
          // no next element
          return;
        }
      }

      if (currentElement.outgoing.length > 1) {
        this.processSplittingGateway(currentElement, lastWay);
      } else {
        this.processElement(defaultTarget, lastWay);
      }

    } else {
      this.processElement(defaultTarget, lastWay);
    }
  };

  /**
   * Get the information of the last way of the previous scope.
   *
   * @return {boolean}
   */
  getPreviousLastWay = () => {
    this.state.gateways.pop();
    let idx = this.state.gateways.length - 1;
    return (idx === -1) ? true : this.state.gateways[idx];
  };

  /**
   * Process all outgoing flows of a splitting gateway
   *
   * @param gateway
   * @param lastWay
   */
  processSplittingGateway = (gateway, lastWay) => {
    // save current way
    this.state.gateways.push(lastWay);

    let sequenceFlows = gateway.outgoing;
    sequenceFlows.forEach((flow, idx) => {
      let lastWay = this.isLastElementOfArray(idx, sequenceFlows);
      this.processFlow(flow, idx);
      this.processElement(flow.targetRef, lastWay);
    });
  };

  /**
   * Converts a SequenceFlow into a text component
   *
   * @param flow
   * @param idx
   */
  processFlow = (flow, idx) => {
    let target = flow.targetRef,
        isMergingGateway = this.isMergingGateway(target);

    let defaultFlow = flow.sourceRef.default && flow.id === flow.sourceRef.default.id;

    let parsedFlow = {
      id: flow.id,
      text: getTextForSequenceFlow(flow, idx, defaultFlow, !isMergingGateway)
    };

    this.state.converted.push(parsedFlow);
  };

  /**
   * Check if a Gateway is a merging one (more than 1 incoming sequence flow)
   *
   * @param gateway
   * @return boolean
   */
  isMergingGateway = (gateway) => {
    return is(gateway, 'bpmn:Gateway') && gateway.incoming.length > 1;
  };
}

export default BpmnToSpeech;