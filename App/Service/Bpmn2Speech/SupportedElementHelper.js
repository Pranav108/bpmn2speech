import {is, getBusinessObject} from 'bpmn-js/lib/util/ModelUtil';
import SupportedElements from './supported-elements.json'

export function extractFlowElements(diagramElements) {
  let flowElements = getFlowElements(findRootElement(diagramElements));
  checkSupportedElements(flowElements);
  return flowElements;
}

function findRootElement(elements) {
  return elements.find(element => {
    return is(element, 'bpmn:Process');
  });
}

function getFlowElements(rootElement)  {
  return getBusinessObject(rootElement).flowElements;
}

function checkSupportedElements(flowElements) {
  flowElements.forEach(element => {
    if (!isSupportedElement(element)) {
      let type = element.$type.substring(5);
      throw new Error('Element of type ' + type + ' is not supported.');
    }
  });
}

/**
 * Check if an element is in the list of supported elements
 *
 * @param element
 * @return {boolean}
 */
function isSupportedElement(element) {
  return SupportedElements.includes(element.$type);
}