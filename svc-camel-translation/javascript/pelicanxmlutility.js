PelicanXMLUtility = function() {

var XPathConstants = Java.type('javax.xml.xpath.XPathConstants');
var XPathFactory = Java.type('javax.xml.xpath.XPathFactory');

getNode = function(Document, xPath) {

    var xpathFactory = XPathFactory.newInstance();
        // Create XPath object
    var xpath = xpathFactory.newXPath();
    // Create XPathExpression object
    var node =  xpath.evaluate(xPath, Document, XPathConstants.NODE);
    return node;
}

getNodes = function(Document, xPath) {

    var xpathFactory = XPathFactory.newInstance();
        // Create XPath object
    var xpath = xpathFactory.newXPath();
    // Create XPathExpression object
    var nodes =  xpath.evaluate(xPath, Document, XPathConstants.NODESET);
    return nodes;
}

getValueFromPath = function (Document, xPath) {

    var nodes =  getNodes(Document, xPath);
    if(nodes == null)
    	return null;

    var zeroItem = nodes.item(0);
    if( zeroItem == null )
    	return null;

	var n = zeroItem.getFirstChild();
    if(n == null)
    	return null;

	return n.getNodeValue();
}

setValueInPath = function (Document, xPath, value) {

    var nodes =  getNodes(Document, xPath);
    if(nodes == null)
    	return 1;

    var zeroItem = nodes.item(0);
    if( zeroItem == null )
    	return 1;


	var n = zeroItem.getFirstChild();
	n.setNodeValue(""+value);
	return 0;
}


createElementWithText = function(Document, elementName, text) {

    var element = Document.createElement(elementName);
    var elementText = Document.createTextNode(text);
    element.appendChild(elementText);
    
    return element;
}



return {
    getNode:getNode,
    getNodes:getNodes,
    getValueFromPath:getValueFromPath,
    setValueInPath:setValueInPath        
}

}();