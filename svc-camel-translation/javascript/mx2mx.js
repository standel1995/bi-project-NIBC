var Attr=Java.type('org.w3c.dom.Attr');
var ByteArrayInputStream=Java.type('java.io.ByteArrayInputStream');
var Document = Java.type("org.w3c.dom.Document");
var DocumentBuilder = Java.type("javax.xml.parsers.DocumentBuilder");
var DocumentBuilderFactory = Java.type("javax.xml.parsers.DocumentBuilderFactory");
var DOMSource=Java.type('javax.xml.transform.dom.DOMSource');
var Element=Java.type('org.w3c.dom.Element');
var Entry = Java.type('java.util.Map.Entry');
var File=Java.type('java.io.File');
var FileInputStream=Java.type('java.io.FileInputStream');
var Files=Java.type('java.nio.file.Files');
var HashMap = Java.type('java.util.HashMap');
var InputSource = Java.type("org.xml.sax.InputSource");
var IOException=Java.type('java.io.IOException');
var LinkedHashMap = Java.type('java.util.LinkedHashMap');
var Map = Java.type('java.util.Map');
var NamedNodeMap=Java.type('org.w3c.dom.NamedNodeMap');
var Node=Java.type('org.w3c.dom.Node');
var NodeList=Java.type('org.w3c.dom.NodeList');
var OutputKeys=Java.type('javax.xml.transform.OutputKeys');
var Paths=Java.type('java.nio.file.Paths');
var StreamResult=Java.type('javax.xml.transform.stream.StreamResult');
var StringReader = Java.type("java.io.StringReader");
var StringTokenizer = Java.type('java.util.StringTokenizer');
var StringWriter=Java.type('java.io.StringWriter');
var Transformer=Java.type('javax.xml.transform.Transformer');
var TransformerFactory=Java.type('javax.xml.transform.TransformerFactory');
var Writer=Java.type('java.io.Writer');
var XPath=Java.type('javax.xml.xpath.XPath');
var XPathConstants = Java.type('javax.xml.xpath.XPathConstants');
var XPathExpression=Java.type('javax.xml.xpath.XPathExpression');
var XPathFactory = Java.type('javax.xml.xpath.XPathFactory');
var DateFormat=Java.type('java.text.DateFormat');
var SimpleDateFormat=Java.type('java.text.SimpleDateFormat');
var JSHelperClass = Java.type('ai.pelican.camel.utils.JSHelperClass');
//var Logger = Java.type("org.apache.log4j.Logger");
var Logger = Java.type("org.slf4j.Logger");
var Logger = Java.type("org.slf4j.LoggerFactory");
var logger = Logger.getLogger("JavaScript");
var Base64 = Java.type('java.util.Base64');

function mx2mx(exchange){
	logger.info("In Mx2Mx function");
	logger.info("body inside:{}",exchange.getIn().getBody(org.w3c.dom.Document.class) );
	var jsHelper = new JSHelperClass();
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var srcType = exchange.getIn().getHeader("SRC_PaymentType");
	var tgtType = exchange.getIn().getHeader("TGT_PaymentType");
	//logger.info("MX2MX = " + PaymentType);
	var dbf = DocumentBuilderFactory.newInstance();
	var db = dbf.newDocumentBuilder();
	var mxOutput = db.newDocument();
	var mxInput = exchange.getIn().getBody(org.w3c.dom.Document.class);//inMsg.getBody(java.lang.String.class);
	logger.info("mx2mx: Input Message = " + mxInput);
	//setHeader(map,"Input_Body",mxInput);
	var reqMap = jsHelper.getHzlLMap(exchange.getIn().getHeaders(), srcType+"_"+tgtType+"_MAP");
	//setHeader(map, "Translation_flag",false);
	logger.info("Translaton Map called");
	var encodedBody;

	var rootElement = createRoot(mxInput,mxOutput);
	
	var entries = reqMap.entrySet().iterator();
	while(entries.hasNext()){
		var entry = entries.next();
			var key = entry.getKey();
			var value = entry.getValue();
			var pipeFlag = false;
			
			if(key.equals("Document")) {
				var arr = value.split("|");
				var attribute1 = arr[arr.length-1];
				var nNode = mxOutput.getElementsByTagName("Document").item(0);
				var attr = mxOutput.createAttribute("xmlns");
				attr.setValue(attribute1.trim());
				nNode.setAttributeNode(attr);
				continue;				
			}
			
			var xPathfactory = XPathFactory.newInstance();
			var xpath = xPathfactory.newXPath();
			var expr = xpath.compile(value);
			var n1 =  expr.evaluate(mxInput, XPathConstants.NODESET);
			//logger.info("n1 Log: "+n1);
			var element = n1.item(0);
			

			if(element == null) {
				continue;
			}
			
			if(!key.contains("|")) {
				var arr2 = key.split("/");
				var dest = arr2[arr2.length-1];	
				logger.info("dest "+dest)
				var newDest = null;
					
				newDest = createNode(mxOutput,mxInput,rootElement,dest,arr2,pipeFlag);
				if(newDest != null){
					logger.info("mx2mx:newDest created");
					//setHeader(map,"Translation_flag",true);
				}
				if(element.hasAttributes()) {
					var s1 = element.getAttributes();
					var nodeName = s1.item(0).getNodeName();
					var s2 = s1.item(0).getTextContent();
					var attr = mxOutput.createAttribute(nodeName);
					attr.setValue(s2);
					newDest.setAttributeNode(attr);	
				}
					
				if(element.getNodeType() == Node.ELEMENT_NODE){
					var j=0;
					var child = null;
					var childList = element.getChildNodes();
					while(j<childList.getLength()) {
						child = childList.item(j);			
						var i1 = mxOutput.importNode(child, true);
						var s1 = i1.getNodeValue();
						logger.info("s1 "+s1);
						if(dest.equalsIgnoreCase("OrgnlMsgNmId")){
							if(s1.equalsIgnoreCase("pacs.008.001.02")){
								s1= "pacs.008.001.08";
								i1.setNodeValue(s1);
							}else if(s1.equalsIgnoreCase("pacs.003.001.02")){
								s1= "pacs.003.001.08";
								i1.setNodeValue(s1);
							}
						}
						newDest.appendChild(i1);	
						j++;
					}	
				}
			}else {
				var arr2 = key.split(/[\s/|]+/); 
				logger.info("key split "+arr2);
				var dest1 = arr2[arr2.length-2];
				logger.info("dest1 "+dest1);
				var list = mxOutput.getElementsByTagName(dest1);
				pipeFlag = true;
				
				var newDest = createNode(mxOutput,mxInput,rootElement,dest1,arr2,pipeFlag);
				if(newDest != null){
					logger.info("mx2mx:newDest1 created");
					//setHeader(map,"Translation_flag",true);
				}
				if(value.contains("|")) {
					var arr = value.split("|");		
					var node1 = arr[arr.length-2];
					var n2 = mxOutput.getElementsByTagName(node1).item(0);
					var attr = mxOutput.createAttribute("xmlns");
					attr.setValue(arr[arr.length-1].trim());
					n2.setAttributeNode(attr);
				}
			}
	    }	
		
		var responseStr= getPrettyPrint(mxOutput,exchange);
		logger.info("mx2mx: Message Body " + responseStr);
		setHeader(map,"PaymentType",tgtType);
		//setHeader(map,"ACEDB_originalBody",responseStr);
		encodedBody = Base64.getEncoder().encodeToString(jsHelper.getBytes(responseStr));
		setHeader(map,"ACEDB_originalBody",encodedBody);
		inMsg.setBody(responseStr);

		var requestAudit = getHeader(map,"Audit");
		logger.info("mx2mx:RequestAudit = " + requestAudit);

		setHeader(map,"Audit", "");
}
	
function createRoot(doc1,doc2) {
		
		var root = doc1.getDocumentElement();
		var newRoot = root.getNodeName();
		var rootElement = doc2.createElement(newRoot);
		doc2.appendChild(rootElement); 
		
		return rootElement;
	}

function nodeValue(doc) {
	
		var root = doc.getElementsByTagName("Document").item(0);
		var m1 = root.getAttributes();
		var attString1 = m1.item(0).getTextContent();
		var attString = attString1.substring(attString1.length() - 15);
		return attString;
	}

function createNode(doc,doc2,root,node1,arr,pipeFlag) {
		logger.info("in createNode function..");
		var parentNode = null;
		var oldParent = null;
		var childNode = null;
		var parent;
		for(var i=0; i<arr.length;i++) {
			if(i == 0) {
				parent = arr[i];
				var pNode = doc.getElementsByTagName(parent).item(0);
				oldParent = pNode;
				continue;
			}
			if(arr[i].equals("MsgId") && arr[arr.length-1].equalsIgnoreCase("CBPR")) {
				var date = new SimpleDateFormat("yyMMddHHmmssSSS").format(new Date());
				childNode = doc.createElement(node1);
				childNode.appendChild(doc.createTextNode(date));
				oldParent.appendChild(childNode);
				break;
			}
			if(arr[i].equals("RtrId")) {
				var date = new SimpleDateFormat("yyMMddHHmmssSSS").format(new Date());
				childNode = doc.createElement(node1);
				childNode.appendChild(doc.createTextNode(date));
				oldParent.appendChild(childNode);
				break;
			}
			if(arr[i].equals("CreDtTm")) {
				var crdt = getDateTime();
				childNode = doc.createElement(node1);
				childNode.appendChild(doc.createTextNode(crdt));
				oldParent.appendChild(childNode);
				break;
			}
			if(arr[i].equals("IntrBkSttlmDt") && pipeFlag == true) {
				var date = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
				childNode = doc.createElement(node1);
				childNode.appendChild(doc.createTextNode(date));
				oldParent.appendChild(childNode);
				break;
			}
			if(arr[i].equals("OrgnlMsgNmId")) {
				if(pipeFlag == true){
					var temp = arr[arr.length-1];
					if(!temp.contains("pacs")||temp.contains("Pacs")||temp.contains("PACS"))
						temp = nodeValue(doc2);
					childNode = doc.createElement(node1);
					childNode.appendChild(doc.createTextNode(temp));
					oldParent.appendChild(childNode);
					break;
				}
			}
			if(node1 == arr[i] && i == arr.length-1) {
				childNode = doc.createElement(node1);
				oldParent.appendChild(childNode);
				continue;
			}
			if(node1 == arr[i] && i == arr.length-2) {
				var text = arr[arr.length-1];
				childNode = doc.createElement(node1);
				childNode.appendChild(doc.createTextNode(text));
				oldParent.appendChild(childNode);
				break;
			}
			parent = arr[i];
			var pList = oldParent.getElementsByTagName(parent.trim());
			if(pList.getLength() == 0) {
				parentNode = doc.createElement(parent);
				if(i == 1) {
					root.appendChild(parentNode);
					oldParent = parentNode;
				} else {
					oldParent.appendChild(parentNode);
					oldParent = parentNode;					
				}			
			} else {
				oldParent = pList.item(0);
			}			
		}
		return childNode;
	}
	
function getDateTime() {
		
		var dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
        var date = new Date();
        var dateStamp = dateFormat.format(date);
        dateStamp = dateStamp.substring(0,22) + ":"+dateStamp.substring(22);
        return dateStamp;
	}

function getPrettyPrint(doc2){
	logger.info("In getPrettyPrint function..");
	var tf = TransformerFactory.newInstance().newTransformer();
	tf.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
	tf.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
	tf.setOutputProperty(OutputKeys.INDENT, "yes");
	var out = new StringWriter();
	tf.transform(new DOMSource(doc2), new StreamResult(out));
	var out1= out.toString();
	//setHeader(map,"Translation_flag", true);
	logger.info("getPrettyPrint:Message Body = " + out1);
	return out1;
}

function getMap() {
		 
		var inputMap = new LinkedHashMap();
		inputMap.put("Document/PmtRtr/GrpHdr/MsgId|P4B2A-006", "Document|urn:iso:std:iso:20022:tech:xsd:pacs.004.001.09");
		inputMap.put("Document/PmtRtr/GrpHdr/CreDtTm|Date", "Document");
		inputMap.put("Document/PmtRtr/GrpHdr/NbOfTxs", "Document/FIToFICstmrCdtTrf/GrpHdr/NbOfTxs");
		inputMap.put("Document/PmtRtr/GrpHdr/SttlmInf/SttlmMtd|INGA", "Document");
		inputMap.put("Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgId", "Document/FIToFICstmrCdtTrf/GrpHdr/MsgId");
		inputMap.put("Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId|MsgNm", "Document/FIToFICstmrCdtTrf");
		inputMap.put("Document/PmtRtr/TxInf/OrgnlInstrId", "Document/FIToFICstmrCdtTrf/GrpHdr/MsgId");
		inputMap.put("Document/PmtRtr/TxInf/OrgnlEndToEndId", "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/EndToEndId");
		inputMap.put("Document/PmtRtr/TxInf/OrgnlUETR", "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/UETR");
		inputMap.put("Document/PmtRtr/TxInf/OrgnlIntrBkSttlmAmt", "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt");
		inputMap.put("Document/PmtRtr/TxInf/OrgnlIntrBkSttlmDt", "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmDt");
		inputMap.put("Document/PmtRtr/TxInf/RtrdIntrBkSttlmAmt", "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt");
		inputMap.put("Document/PmtRtr/TxInf/IntrBkSttlmDt", "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmDt");
		inputMap.put("Document/PmtRtr/TxInf/RtrdInstdAmt", "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt");
		inputMap.put("Document/PmtRtr/TxInf/ChrgBr|SHAR", "Document");
		inputMap.put("Document/PmtRtr/TxInf/InstgAgt", "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/InstdAgt");
		inputMap.put("Document/PmtRtr/TxInf/InstdAgt", "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/InstgAgt");
		inputMap.put("Document/PmtRtr/TxInf/RtrChain/Dbtr/Pty", "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr");
		inputMap.put("Document/PmtRtr/TxInf/RtrChain/DbtrAgt", "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt");
		inputMap.put("Document/PmtRtr/TxInf/RtrChain/CdtrAgt", "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt");
		inputMap.put("Document/PmtRtr/TxInf/RtrChain/Cdtr/Pty", "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr"); 
		inputMap.put("Document/PmtRtr/TxInf/RtrRsnInf/Rsn/Cd|MD06", "Document"); 
		
		return inputMap;
	}

	
	