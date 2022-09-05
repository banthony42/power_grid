export { createElemWithAttribute }

function createElemWithAttribute(element, attribute, value ) {
    let new_element = document.createElement(element)
    new_element.setAttribute(attribute, value)
    return new_element
}