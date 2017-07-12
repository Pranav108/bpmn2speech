import {is} from 'bpmn-js/lib/util/ModelUtil';
import TextComponents from './text-components.json';
import Abbreviations from './abbreviations.json';

/**
 * Fetches a text for the element.
 *
 * @param element
 * @return string
 */
export function getTextForElement(element) {
  if (is(element, 'bpmn:StartEvent')) {
    return getTextForStartEvent(element);
  }

  if (is(element, 'bpmn:Task')) {
    return getTextForTask(element);
  }

  if (is(element, 'bpmn:EndEvent')) {
    return getTextForEndEvent(element);
  }

  if (is(element, 'bpmn:ExclusiveGateway')) {
    return getTextForGatewayOfType('xor', element);
  }

  if (is(element, 'bpmn:ParallelGateway')) {
    return getTextForGatewayOfType('parallel', element);
  }
}

export function getTextForSequenceFlow(sequenceFlow, idx, isDefault, hasTask) {
  let name = sequenceFlow.name;

  if (!name) {
    if (!!isDefault) {
      name = 'default';
    } else {
      name = Abbreviations.numbers[idx];
    }
  }

  let label = replaceLabel(TextComponents.gateways.way, name);
  if (!hasTask) {
    label += ' ' + TextComponents.gateways.noAction;
  }

  return label;
}

/**
 * Fetch the text for a start event
 *
 * @param startEvent
 */
function getTextForStartEvent(startEvent) {
  let name = prependWith(startEvent.name || '');
  return replaceLabel(TextComponents.start, name);
}

/**
 * adds a with to the name, to allow a better sentence quality
 *
 * @param name
 * @return string
 */
function prependWith(name) {
  if (!!name) {
    name = 'with ' + name;
  }

  return name;
}

/**
 * Replaces the label with a given name
 *
 * @param text
 * @param name
 * @return string
 */
function replaceLabel(text, name) {
  return text.replace('%LABEL%', name);
}


/**
 * Fetch the text for a task
 * @param task
 */
function getTextForTask(task) {
  let name = task.name || '';
  if (!is(task.incoming[0].sourceRef, 'bpmn:Gateway')) {
    let index = Math.floor(Math.random() * TextComponents.task.length);
    return replaceLabel(TextComponents.task[index], name);
  } else {
    return replaceLabel(TextComponents.gateways.defaultOperation, name);
  }


}

/**
 * Fetch text for the end event
 *
 * @param endEvent
 * @return {string}
 */
function getTextForEndEvent(endEvent) {
  let name = prependWith(endEvent.name || '');
  return replaceLabel(TextComponents.end, name);
}

/**
 * Fetch the text for a gateway
 *
 * @param type
 * @param element
 * @return {string}
 */
function getTextForGatewayOfType(type, element) {
  let name = element.name || '';
  let wayCount = element.outgoing.length;

  if (wayCount === 1) {
    return TextComponents.gateways[type].end;
  } else {
    let text = replaceLabel(TextComponents.gateways[type].start, name);
    return text.replace('%WAY_COUNT%', wayCount);
  }
}