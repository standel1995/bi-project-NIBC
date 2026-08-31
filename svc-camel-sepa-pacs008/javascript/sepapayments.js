load('E:/Pelican_Install_Dir/Pelican/ace.solution.ppay/svc-camel-sepa-pacs008/javascript/pelicanxmlutility.js');
load('E:/Pelican_Install_Dir/Pelican/ace.solution.ppay/svc-camel-sepa-pacs008/javascript/utility.js');
load('E:/Pelican_Install_Dir/Pelican/ace.solution.ppay/svc-camel-sepa-pacs008/javascript/authorizationCheck.js'); 
load('E:/Pelican_Install_Dir/Pelican/ace.solution.ppay/svc-camel-sepa-pacs008/javascript/messageRepair.js');
load('E:/Pelican_Install_Dir/Pelican/ace.solution.ppay/svc-camel-sepa-pacs008/javascript/cashForecasting.js');
load('E:/Pelican_Install_Dir/Pelican/ace.solution.ppay/svc-camel-sepa-pacs008/javascript/customRules.js');

var XPathConstants = Java.type('javax.xml.xpath.XPathConstants');
var XPathFactory = Java.type('javax.xml.xpath.XPathFactory');
var HashMap = Java.type('java.util.HashMap');
var Entry = Java.type('java.util.Map.Entry');
var BigDecimal = Java.type('java.math.BigDecimal');
var JavaDate = Java.type('java.util.Date');
var System = Java.type('java.lang.System');
var ArrayList = Java.type("java.util.ArrayList");
var DocumentBuilderFactory = Java.type("javax.xml.parsers.DocumentBuilderFactory");
//var Logger = Java.type("org.apache.log4j.Logger");
var Logger = Java.type("org.slf4j.Logger");
var Logger = Java.type("org.slf4j.LoggerFactory");
var logger = Logger.getLogger("JavaScript");
var JSHelperClass = Java.type("ai.pelican.camel.utils.JSHelperClass");
var EncryptDecrypt = Java.type("ai.pelican.camel.authentication.EncryptDecrypt");
var TransformerFactory = Java.type('javax.xml.transform.TransformerFactory');
var StringWriter = Java.type('java.io.StringWriter');
var DOMSource = Java.type('javax.xml.transform.dom.DOMSource');
var Transformer = Java.type("javax.xml.transform.Transformer");
var OutputKeys = Java.type("javax.xml.transform.OutputKeys");
var StreamResult = Java.type('javax.xml.transform.stream.StreamResult');
var InterActFile = Java.type("ai.pelican.camel.interact.InterActFile");
var AuthCodeGenerator = Java.type("ai.pelican.camel.authentication.AuthCodeGenerator");
var AppHeaderHandler = Java.type("ai.pelican.camel.bah.AppHeaderHandler");
var DocumentBuilder = Java.type("javax.xml.parsers.DocumentBuilder");
var Document = Java.type("org.w3c.dom.Document");
var StringReader = Java.type("java.io.StringReader");
var InputSource = Java.type("org.xml.sax.InputSource");
var FileDebulkData = Java.type("ai.pelican.camel.interfaces.FileDebulkData");
var FileDebulkAggregateMessage = Java.type("ai.pelican.camel.interfaces.FileDebulkAggregateMessage");
var FileBatchDetails = Java.type("ai.pelican.camel.interfaces.FileBatchDetails");
var ExecuteCamelRoute = Java.type('ai.pelican.camel.js.processor.ExecuteCamelRoute');
var XMLParser = Java.type("ai.pelican.camel.convertor.XMLParser");

var genAuditList = new ArrayList();
//const list1 = new ArrayList();

const getMethods = (obj) => {
	let properties = new Set()
	let currentObj = obj
	do {
	  Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
	} while ((currentObj = Object.getPrototypeOf(currentObj)))
	var items = [...properties.keys()].filter(item => typeof obj[item] === 'function');

	
	logger.info("-------------- START --------------;")
	logger.info("-Funnctions--");
	items.forEach(element => {
		logger.info(element);
	});

	logger.info("--KEYS--");
	var keys = obj.keySet();

	keys.forEach(element => {
		logger.info(element+ ": " + obj.get(element));
	});
	
	logger.info("-------------- END --------------;")

  }

function getMessageType(exchange){
	logger.info("In getMessageType");
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var xmlnsMsgType=null;

	var isXml = isXmlNodePresent2(Document, "Document");

	if(isXml != true) {
		xmlnsMsgType = "MT";
	}else {
		var xmlnsValue = Document.getDocumentElement().getAttribute("xmlns");
		if (xmlnsValue != null) {
			logger.info("xmlns value: " + xmlnsValue);

			var xmlnsSplitValues = xmlnsValue.split(":");
			xmlnsSplitValues.forEach(element => {
			 logger.info(element);
			});
			xmlnsMsgType = xmlnsSplitValues[xmlnsSplitValues.length - 1].toUpperCase();
			logger.info(xmlnsMsgType);
		}
	}
 
	 return xmlnsMsgType; 
}

function drveProductCode(exchange) {
	var mode;
	var msgType;
	var productCode;
	var key;
	var institutionId;
	var drveProductCodeFlag;
	var drveProductCodeFlagPath;
	var sourceChannelId;
	var msgDirection;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	logger.info("In drveProductCode");

	institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("drveProductCode: institutionId = " + institutionId);

	mode = getHeader(map, "PLCN_msgModeIn");
	if(!mode) {
		mode = getHeader(map, "PLCN_mode")
	}
	logger.info("drveProductCode: mode = " + mode);

	msgType = getHeader(map, "PLCN_msgType");
	logger.info("drveProductCode: msgType = " + msgType);

	sourceChannelId = getHeader(map, "PLCN_channelIdSource");
	logger.info("drveProductCode: sourceChannelId = " + sourceChannelId);
	setHeader(map, "PLCN_sourceChannelId", sourceChannelId);
	setHeader(map, "PLCNAPI_sourceChannelId", sourceChannelId);

	msgDirection = getHeader(map, "PLCN_msgDirection");
	logger.info("drveProductCode: msgDirection = " + msgDirection);

	if(!sourceChannelId){
		sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
		//sourceChannelId = getHeader(map, "PLCN_sepaChannelSourceId");
		logger.info("drveProductCode: sourceChannelId = " + sourceChannelId);		
	}
	// if(sourceChannelId){
	// 	sourceChannelId = sourceChannelId.toUpperCase();
	// }
	logger.info("drveProductCode: sourceChannelId = " + sourceChannelId);
	setHeader(map, "PLCNAPI_sourceChannelId", sourceChannelId);

	drveProductCodeFlagPath = institutionId + "." + "MESSAGE_PROCESSING.FUNCTIONALITY.CHANNEL_MSGTYPE_CONFIG" + "." + sourceChannelId.toUpperCase();
	logger.info("drveProductCode: drveProductCodeFlagPath = " + drveProductCodeFlagPath);

	//logger.trace("drveProductCode: map  = " + map);
	if(drveProductCodeFlagPath){
		drveProductCodeFlag = memTblGetTableValue(map, "INST_PARAM", drveProductCodeFlagPath);
		logger.info("drveProductCode: drveProductCodeFlag = " + drveProductCodeFlag);
	}
	
	if(mode == "FILE"){
		sourceChannelId =  memTblGetTableValue(map, "NIBC_CHANNEL_TO_MODE", sourceChannelId);
	}
	logger.info("drveProductCode: sourceChannelId = " + sourceChannelId);

	if(mode == "MANUAL" || mode == "UPLOAD") {
		key = mode + "-" + msgType;
	}else {
		key = sourceChannelId + "-" + msgType;
	}

	logger.info("drveProductCode: key = " + key);

	// if(mode == "FILE"){
	// 	if(msgDirection == "I"){
	// 		msgDirection = "OB";
	// 	}
	// 	if(msgDirection == "O"){
	// 		msgDirection = "IB";
	// 	}
	// 	key = mode + "-" + "SEPA" + "-" + msgDirection + "-IN-" + msgType;
	// }

	logger.info("drveProductCode: key = " + key);
	productCode = memTblGetTableValue(map, "PPAY_PRODUCT_CODE", key);
	logger.info("drveProductCode: productCode = " + productCode);

	if(!isPatternPresent(drveProductCodeFlag, msgType)) {
		productCode = "";
	}

	if(productCode) {
		setHeader(map, "PLCN_productCode", productCode);
		return productCode;
	}
	return productCode;		
}

function checkMsgFamily(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;

	logger.info("In checkMsgFamily");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();

	var messageBody = inMsg.getBody(java.lang.String.class);
	//logger.trace("checkMsgFamily: messageBody = " + messageBody);

	if(isPatternPresent(messageBody, '<Document xmlns="')) {
		setHeader(map, "PLCN_isXML", true);
		logger.info("checkMsgFamily: MX Message");
	}else{
		setHeader(map, "PLCN_isXML", false);
		logger.info("checkMsgFamily: MT Message");
	}	
}

function updateSepaQueueId(exchange){
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	var msgdbMap = new HashMap();
	var audit = new HashMap();
	var priorityDate;
	var sender;
	var receiver;
	var transRefNo;
	var currency;
	var hashCode;
	var encryptDecrypt;
	var custom13;

	var mode = readMsgdb.get("MSG_MODE_IN");
	logger.info("updateSepaQueueId: mode = " + mode);
	setHeader(map, "PLCN_mode", mode);
	setHeader(map, "PLCN_msgModeIn", mode);

	var institutionId =  readMsgdb.get("INSTITUTIONID");
	logger.info("updateSepaQueueId: institutionId = " + institutionId);
	setHeader(map, "PLCN_institutionId", institutionId);
	
	logger.info("updateSepaQueueId: MSGDB_ID = " + readMsgdb.get("MSGDB_ID"));

	priorityDate = getHeader(map, "PLCN_priorityDate");
	priorityDate = replaceAllPattern(priorityDate, "-", "");
	msgdbMap.put("PRIORITYDATE", priorityDate);

	priorityAmt = getHeader(map, "PLCN_amount");

	if(!priorityAmt){
		priorityAmt = getHeader(map, "PLCN_priorityAmount");
	}
	msgdbMap.put("PRIORITYAMOUNT", priorityAmt);
	msgdbMap.put("PRIORITYAMOUNTNUM", priorityAmt);

	transRefNo = getHeader(map, "PLCN_transRefNo");
	msgdbMap.put("TRANSREFNO", transRefNo);

	currency = getHeader(map, "PLCN_currency");
	msgdbMap.put("CURRENCY", currency);

	sender = getHeader(map, "PLCN_sender");
	logger.info("updateSepaQueueId: sender = " + sender);
	msgdbMap.put("SENDER", sender);

	receiver = getHeader(map, "PLCN_receiver");
	logger.info("updateSepaQueueId: receiver = " + receiver);
	msgdbMap.put("RECEIVER", receiver);

	msgType = getHeader(map, "PLCN_msgType");
	logger.info("updateSepaQueueId: msgType = " + msgType);

	if(!msgType){
		msgType = getMessageType(exchange);
		msgType = msgType.toLowerCase();		
	}

	setHeader(map, "PLCN_msgType", msgType.toLowerCase());
	
	var messageNo = readMsgdb.get("MESSAGENO");
	logger.info("updateSepaQueueId: messageNo = " + messageNo);
	setHeader(map, "PLCN_messageNo", messageNo);

	var sourceChannelId = readMsgdb.get("CHANNEL_ID_SOURCE");
	logger.info("updateSepaQueueId: sourceChannelId = " + sourceChannelId);
	msgdbMap.put("SOURCECHANNELID", sourceChannelId);
	setHeader(map, "PLCN_sourceChannelId", sourceChannelId);

	sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId);
	logger.info("updateSepaQueueId: sourceChannelId = " + sourceChannelId);
	logger.info("updateSepaQueueId: channelIdTarget = " + channelIdTarget);

	processId = getHeader(map,"PLCN_processId");
	logger.info("updateSepaQueueId: processId = " + processId);

	comments = getHeader(map, "PLCN_txnComments");
	logger.info("updateSepaQueueId: comments = " + comments);

	msgDirection = getHeader(map, "PLCN_msgDirection");
	logger.info("updateSepaQueueId: msgDirection = " + msgDirection);

	if(!msgDirection){
		msgDirection = memTblGetTableValue(map, "DIRECTION_CHK_MAP", sourceChannelId);
		logger.info("updateSepaQueueId: msgDirection = " + msgDirection);
	}
	setHeader(map, "PLCN_msgDirection", msgDirection);

	// RAVITEJA
	var institutionId =  readMsgdb.get("INSTITUTIONID");
	var processId = getHeader(map,"PLCN_processId");
	logger.info("updateSepaQueueId: processId = " + processId);

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("updateSepaQueueId: custom13 = " + custom13);

	messageQueueid = memTblGetTableValue(map, "SCT_QUEUEID", msgType + "_"  + "SEPA" + "-" + msgDirection);
	logger.info("updateSepaQueueId: messageQueueid = " + messageQueueid);

	if(messageQueueid){
		messageQueueid = messageQueueid.trim();
	}

	custom13 = getHeader(map, "PLCN_custom13");
	logger.info("updateSepaQueueId: custom13 = " + custom13);

	if(msgType == null ){
		logger.info("updateSepaQueueId: No XMLNS found");
	}
	else{
		//var oQueueId = msgTypeQueueMap.get(msgType.toUpperCase());
		//logger.info('updateSepaQueueId: oQueueId = '+ oQueueId);
		logger.info('updateSepaQueueId: msgType = '+msgType);
		// tejadata
		//msgTypeQueueMap.put("MESSAGECLASSTYPE", msgType);

		msgType = msgType.toLowerCase();

		if(msgType != "MT") {
			msgdbMap.put("MESSAGECLASSTYPE", msgType);
			msgdbMap.put("MSG_FAMILY", "SEPA");
		}
	}

	/*if(messageQueueid){
		messageQueueid = messageQueueid.trim();
		msgdbMap.put("QUEUEID", messageQueueid);
	}*/

	setHeader(map, "PLCN_SEPA_QUEUEID", messageQueueid);

	logger.info("updateSepaQueueId: queueId = " + messageQueueid);
	logger.info("updateSepaQueueId: messageNo = " + messageNo);
	
	var derivedProductCode = drveProductCode(exchange);
	logger.info("updateSepaQueueId: derivedProductCode = " + derivedProductCode);

	if(derivedProductCode) {
		logger.info("updateSepaQueueId: derivedProductCode = " + derivedProductCode);
		msgdbMap.put("DERIVED_PRODUCT", derivedProductCode);
	}

	encryptDecrypt = new EncryptDecrypt();
	hashCode = encryptDecrypt.getMessageDigest("SHA-1", exchange.getIn().getBody(java.lang.String.class));
	logger.info("updateSepaQueueId: hashCode = " + hashCode);

	var validflag = getHeader(map, "PLCN_validFlag");
	var displayFlag =  getHeader(map,"PLCN_displayFlag");
	var processingStage = getHeader(map,"PLCN_processingStage");
	var authLevel = getHeader(map,"PLCN_currentAuthLevel");
	if(!authLevel) {
		authLevel = getHeader(map, "PLCN_currentAuthLevelmessage");
	}

	logger.info("updateSepaQueueId: PLCN_validFlag = " + validflag);
	logger.info("updateSepaQueueId: PLCN_processingStage = " + processingStage);
	logger.info("updateSepaQueueId: PLCN_currentAuthLevel = " + authLevel);
	
	if(processingStage){
		msgdbMap.put("PROCESSING_STAGE", processingStage);
		msgdbMap.put("CURRENT_AUTH_LEVEL", authLevel);

		logger.info("updateSepaQueueId: PROCESSING_STAGE & CURRENT_AUTH_LEVEL values have been set to DB");
	}else if(validflag == "true") {
		msgdbMap.put("PROCESSING_STAGE", "FINL");
		logger.info("updateSepaQueueId: PROCESSING_STAGE = FINL");
	}

	msgdbMap.put("CUSTOM44", hashCode);
	msgdbMap.put("CUSTOM13", custom13);
	msgdbMap.put("MESSAGEDIRECTION", msgDirection);
	msgdbMap.put("PRIORITY", 9);
	msgdbMap.put("LOCKSTATUS", 0);
	msgdbMap.put("NUMOFMESSAGES", 1);
	msgdbMap.put("CATEGORY", 1);
	msgdbMap.put("DUPLICATE_RECORD_KEY", "");
	//msgdbMap.put("PROCESSING_STAGE", "PEND");
	msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "");
	msgdbMap.put("NEXT_WORKFLOW_STATUS", "");
	msgdbMap.put("MSGSEGR", "DEFAULT");


	msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	msgdbMap.put("DISPLAY_FLAG", "Y");
	msgdbMap.put("COMMENTS", comments);
	msgdbMap.put("INSTANCEID","PELICAN1");
    msgdbMap.put("PROCESS_ID", processId);

	audit.put("MESSAGENO", messageNo);

	if(getHeader(map, "PLCN_isXML") == true) {
		audit.put("QUEUEID", messageQueueid);
	}

	//audit.put("USERNAME","ADMIN1");
	audit.put("APPLICATION","ACEQ_CMP");
	audit.put("MODULENAME","ACEQWRITE");
	audit.put("ACTION","WRITE");
	audit.put("AUDITTEXT","Message number " +  "<" + messageNo + ">" + " read from DB and written into Queue " +  "'" + messageQueueid + "'");
	audit.put("INSTITUTIONID", institutionId);

	setHeader(map, "ACEQ_WRITE_MSGDB", msgdbMap);
	setHeader(map, "ACEQ_DB_OPERATION", "UPDATE");
	setHeader(map, "GENAUDIT", audit);
}

function populateMetaData(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	logger.info("Message From DB");

	ruleGenerateKbSepa(exchange);
	//mxClearingId(map);
	extractMetaData(exchange);
	deriveServiceConfigured(exchange);
	deriveNostroAccountNumber(exchange);
}

function populateMetaData2(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	logger.info("Message From DB");

	ruleGenerateKbFile(exchange);
	//logger.info("properties = " + exchange.getProperties())

}

/*
**
* This function is called to fetch values from database and set in header variables.
* @param {CamelExchange} exchange - The exchange.
*/
function ruleGenerateKbSepa(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;

	logger.info("In ruleGenerateKbSepa");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var messageBody = inMsg.getBody(java.lang.String.class);
	logger.trace("ruleGenerateKbSepa: messageBody = " + messageBody);
	setHeader(map, "ACEDB_originalBody", messageBody);

	var msgId =  readMsgdb.get("MSGDB_ID");
	logger.info("ruleGenerateKbSepa: msgId = " + msgId);
	setHeader(map, "PLCN_msgDbId", msgId);
	setHeader(map, "PLCNAPI_msgDbId", msgId);

	var institutionId =  readMsgdb.get("INSTITUTIONID");
	logger.info("ruleGenerateKbSepa: institutionId = " + institutionId);
	setHeader(map, "PLCN_institutionId", institutionId);
	setHeader(map, "PLCNAPI_institutionId", institutionId);

	var msgType = readMsgdb.get("MESSAGECLASSTYPE");
	logger.info("ruleGenerateKbSepa: msgType = " + msgType);

	if(!msgType){
		msgType = getHeader(map, "msgClsType");
		logger.info("ruleGenerateKbSepa: msgClsType = " + msgType);
	}

	if(!msgType){
		msgType = getMessageType(exchange);
		msgType = msgType.toLowerCase();
		logger.info("ruleGenerateKbSepa: msgType from getMessageType = " + msgType);		
	}

	setHeader(map, "PLCN_msgType", msgType);
	setHeader(map, "PLCNAPI_msgType", msgType);	

	var msgDirection = readMsgdb.get("MESSAGEDIRECTION");
	logger.info("ruleGenerateKbSepa: msgDirection = " + msgDirection);
	setHeader(map, "PLCN_msgDirection", msgDirection);
	setHeader(map, "PLCNAPI_msgDirection", msgDirection);

	var messageNo = readMsgdb.get("MESSAGENO");
	logger.info("ruleGenerateKbSepa: messageNo = " + messageNo);
	setHeader(map, "PLCN_messageNo", messageNo);
	setHeader(map, "PLCNAPI_messageNo", messageNo);

	var custom5DuplPrev = readMsgdb.get("CUSTOM5_DUPL");
	logger.info("ruleGenerateKbSepa: custom5DuplPrev = " + custom5DuplPrev);
	setHeader(map, "PLCN_custom5Dupl", custom5DuplPrev);

	var sender = readMsgdb.get("SENDER");
	logger.trace("ruleGenerateKbSepa: sender = " + sender);
	setHeader(map, "PLCN_sender", sender);
	setHeader(map, "PLCNAPI_sender", sender);

	var receiver = readMsgdb.get("RECEIVER");
	logger.trace("ruleGenerateKbSepa: receiver = " + receiver);
	setHeader(map, "PLCN_receiver", receiver);
	setHeader(map, "PLCNAPI_receiver", receiver);

	var currency = readMsgdb.get("CURRENCY");
	logger.info("ruleGenerateKbSepa: currency = " + currency);

	setHeader(map, "PLCN_currency", currency);
	setHeader(map, "PLCNAPI_currency", currency);

	var priorityAmount = readMsgdb.get("PRIORITYAMOUNT");
	logger.info("ruleGenerateKbSepa: priorityAmount = " + priorityAmount);

	setHeader(map, "PLCN_amount", priorityAmount);
	setHeader(map, "PLCN_priorityAmount", priorityAmount);
	setHeader(map, "PLCNAPI_priorityAmount", priorityAmount);

	var priorityDate = readMsgdb.get("PRIORITYDATE");
	logger.info("ruleGenerateKbSepa: priorityDate = " + priorityDate);
	setHeader(map, "PLCN_priorityDate", priorityDate);
	setHeader(map, "PLCN_valueDate", priorityDate);
	setHeader(map, "PLCNAPI_valueDate", priorityDate);
	setHeader(map, "PLCNAPI_priorityDate", priorityDate);

	var transRefNo = readMsgdb.get("TRANSREFNO");
	logger.info("ruleGenerateKbSepa: transRefNo = " + transRefNo);

	setHeader(map, "PLCN_transRefNo", transRefNo);
	setHeader(map, "PLCNAPI_transRefNo", transRefNo);

	/* develpment by sshifa */
	
	var companycode =  readMsgdb.get("COMPANY_CODE");
	logger.info("ruleGenerateKbSepa: companycode = " + companycode);
	setHeader(map, "PLCN_companycode", companycode);
	setHeader(map, "PLCNAPI_companyCode", companycode);
	
	var groupinginfoEod =  readMsgdb.get("GROUPINGINFO_EOD");
	logger.info("ruleGenerateKbSepa: groupinginfoEod = " + groupinginfoEod);
	setHeader(map, "PLCN_groupinginfoEod", groupinginfoEod);
	
	var aggregateFlag =  readMsgdb.get("AGGREGATE_FLAG");
	logger.info("ruleGenerateKbSepa: aggregateFlag = " + aggregateFlag);
	setHeader(map, "PLCN_aggregateFlag", aggregateFlag);
	
	var subSapDr =  readMsgdb.get("SUB_SAP_DR");
	logger.info("ruleGenerateKbSepa: subSapDr = " + subSapDr);
	setHeader(map, "PLCN_subSapDr", subSapDr);
	
	var subSapCr =  readMsgdb.get("SUB_SAP_CR");
	logger.info("ruleGenerateKbSepa: subSapCr = " + subSapCr);
	setHeader(map, "PLCN_subSapCr", subSapCr);
	
	var sapDr =  readMsgdb.get("SAP_DR");
	logger.info("ruleGenerateKbSepa: sapDr = " + sapDr);
	setHeader(map, "PLCN_sapDr", sapDr);
	
	var sapCr =  readMsgdb.get("SAP_CR");
	logger.info("ruleGenerateKbSepa: sapCr = " + sapCr);
	setHeader(map, "PLCN_sapCr", sapCr);
	
	var transactiontype =  readMsgdb.get("TRANSACTIONTYPE");
	logger.info("ruleGenerateKbSepa: transactiontype = " + transactiontype);
	setHeader(map, "PLCN_txntype", transactiontype);
	setHeader(map, "PLCN_txnType", transactiontype);
	setHeader(map, "PLCN_transactiontype", transactiontype);
	
	var custom37 =  readMsgdb.get("CUSTOM37");
	logger.info("ruleGenerateKbSepa: custom37 = " + custom37);
	setHeader(map, "PLCN_custom37", custom37);
	
	var custom24 =  readMsgdb.get("CUSTOM24");
	logger.info("ruleGenerateKbSepa: custom24 = " + custom24);
	setHeader(map, "PLCN_custom24", custom24);
	
	var groupinginfoFile =  readMsgdb.get("GROUPINGINFO_FILE");
	logger.info("ruleGenerateKbSepa: groupinginfoFile = " + groupinginfoFile);
	setHeader(map, "PLCN_groupinginfoFile", groupinginfoFile);
	
	var groupinginfoBatch =  readMsgdb.get("GROUPINGINFO_BATCH");
	logger.info("ruleGenerateKbSepa: groupinginfoBatch = " + groupinginfoBatch);
	setHeader(map, "PLCN_groupinginfoBatch", groupinginfoBatch);
	
	var nostroAccountNumber =  readMsgdb.get("NOSTRO_ACCOUNT_NUMBER");
	logger.info("ruleGenerateKbSepa: nostroAccountNumber = " + nostroAccountNumber);
	setHeader(map, "PLCN_nostroAccountNumber", nostroAccountNumber);
	
	var contractNumber =  readMsgdb.get("CONTRACT_NUMBER");
	logger.info("ruleGenerateKbSepa: contractNumber = " + contractNumber);
	setHeader(map, "PLCN_contractNumber", contractNumber);
	
	var inputDate =  readMsgdb.get("INPUTDATE");
	logger.info("ruleGenerateKbSepa: inputDate = " + inputDate);
	setHeader(map, "PLCN_inputDate", inputDate);
	
	var lastSanctiondate =  readMsgdb.get("LAST_SANCTION_DT");
	logger.info("ruleGenerateKbSepa: lastSanctiondate = " + lastSanctiondate);
	setHeader(map, "PLCN_lastSanctiondate", lastSanctiondate);
	
	var clearingId =  readMsgdb.get("CUSTOM11");
	logger.info("ruleGenerateKbSepa: clearingId = " + clearingId);
	setHeader(map, "PLCN_clearingId", clearingId);
	
	var custom48 =  readMsgdb.get("CUSTOM48");
	logger.info("ruleGenerateKbSepa: custom48 = " + custom48);
	setHeader(map, "PLCN_custom48", custom48);
	
	var murId =  readMsgdb.get("CUSTOM9");
	logger.info("ruleGenerateKbSepa: murId = " + murId);
	setHeader(map, "PLCN_murId", murId);
	
	var txnGrp =  readMsgdb.get("TRANSACTIONGROUP");
	logger.info("ruleGenerateKbSepa: txnGrp = " + txnGrp);
	setHeader(map, "PLCN_txnGrp", txnGrp);
	
	var channelIdTarget =  readMsgdb.get("CHANNEL_ID_TARGET");
	logger.info("ruleGenerateKbSepa: channelIdTarget = " + channelIdTarget);
	setHeader(map, "PLCN_channelIdTarget", channelIdTarget);
	
	var gvStatusFromDb =  readMsgdb.get("STATUS");
	logger.info("ruleGenerateKbSepa: gvStatusFromDb = " + gvStatusFromDb);
	setHeader(map, "PLCN_gvStatusFromDb", gvStatusFromDb);
	
	var custom1 =  readMsgdb.get("CUSTOM1");
	logger.info("ruleGenerateKbSepa: custom1 = " + custom1);
	setHeader(map, "PLCN_custom1", custom1);
	
	var retCnt =  readMsgdb.get("CUSTOM4");
	logger.info("ruleGenerateKbSepa: retCnt = " + retCnt);
	setHeader(map, "PLCN_retCnt", retCnt);
	
	var custom5 =  readMsgdb.get("CUSTOM5");
	logger.info("ruleGenerateKbSepa: custom5 = " + custom5);
	setHeader(map, "PLCN_custom5", custom5);
	setHeader(map, "PLCN_custom5Pr", custom5);
	
	var custom44 =  readMsgdb.get("CUSTOM44");
	logger.info("ruleGenerateKbSepa: custom44 = " + custom44);
	setHeader(map, "PLCN_custom44", custom44);
	
	var msgTransDebitor =  readMsgdb.get("ACCOUNT_DR");
	logger.info("ruleGenerateKbSepa: msgTransDebitor = " + msgTransDebitor);
	setHeader(map, "PLCN_msgTransDebitor", msgTransDebitor);
	
	var msgTransCreditor =  readMsgdb.get("ACCOUNT_CR");
	logger.info("ruleGenerateKbSepa: msgTransCreditor = " + msgTransCreditor);
	setHeader(map, "PLCN_msgTransCreditor", msgTransCreditor);
	
	var gvDuplDbFlag =  readMsgdb.get("DUPLICATE_RECORD_KEY");
	logger.info("ruleGenerateKbSepa: gvDuplDbFlag = " + gvDuplDbFlag);
	setHeader(map, "PLCN_gvDuplDbFlag", gvDuplDbFlag);
	
	var msgSegr =  readMsgdb.get("MSGSEGR");
	logger.info("ruleGenerateKbSepa: msgSegr = " + msgSegr);
	setHeader(map, "PLCN_msgSegr", msgSegr);
	
	var calculatedamount =  readMsgdb.get("CALCULATEDAMOUNT");
	logger.info("ruleGenerateKbSepa: calculatedamount = " + calculatedamount);
	setHeader(map, "PLCN_calculatedamount", calculatedamount);
	
	var externalBic =  readMsgdb.get("BENBANKCODE");
	logger.info("ruleGenerateKbSepa: externalBic = " + externalBic);
	setHeader(map, "PLCN_externalBic", externalBic);
	
	var otherAccno =  readMsgdb.get("OTHER_ACCNO");
	logger.info("ruleGenerateKbSepa: otherAccno = " + otherAccno);
	setHeader(map, "PLCN_otherAccno", otherAccno);
	
	var eniStatus =  readMsgdb.get("ENI_STATUS");
	logger.info("ruleGenerateKbSepa: eniStatus = " + eniStatus);
	setHeader(map, "PLCN_eniStatus", eniStatus);
	
	var amountNumToDb =  readMsgdb.get("PRIORITYAMOUNTNUM");
	logger.info("ruleGenerateKbSepa: amountNumToDb = " + amountNumToDb);
	setHeader(map, "PLCN_amountNumToDb", amountNumToDb);
	
	var aceFileNo =  readMsgdb.get("MESSAGENO_SOURCE");
	logger.info("ruleGenerateKbSepa: aceFileNo = " + aceFileNo);
	setHeader(map, "PLCN_aceFileNo", aceFileNo);
	
	var grouping =  readMsgdb.get("GROUPINGINFO");
	logger.info("ruleGenerateKbSepa: grouping = " + grouping);
	setHeader(map, "PLCN_grouping", grouping);
	
	var resendQueueid =  readMsgdb.get("RESEND_QUEUEID");
	logger.info("ruleGenerateKbSepa: resendQueueid = " + resendQueueid);
	setHeader(map, "PLCN_resendQueueid", resendQueueid);
	
	var possDuplicate =  readMsgdb.get("POSSIBLE_DUPLICATE");
	logger.info("ruleGenerateKbSepa: possDuplicate = " + possDuplicate);
	setHeader(map, "PLCN_possDuplicate", possDuplicate);
	
	var resendcount =  readMsgdb.get("RESEND_COUNT");
	logger.info("ruleGenerateKbSepa: resendcount = " + resendcount);
	setHeader(map, "PLCN_resendcount", resendcount);
	
	var resendflag =  readMsgdb.get("RESEND_FLAG");
	logger.info("ruleGenerateKbSepa: resendflag = " + resendflag);
	setHeader(map, "PLCN_resendflag", resendflag);
	
	var serviceTypeId =  readMsgdb.get("SERVICE_TYPE_ID");
	logger.info("ruleGenerateKbSepa: serviceTypeId = " + serviceTypeId);
	setHeader(map, "PLCN_serviceTypeId", serviceTypeId);
	
	var uetr =  readMsgdb.get("UNIQUE_END_TRAN_REFERENCE");
	logger.info("ruleGenerateKbSepa: uetr = " + uetr);
	setHeader(map, "PLCN_uetr", uetr);

	var custom12 =  readMsgdb.get("CUSTOM12");
	logger.info("ruleGenerateKbSepa: custom12 = " + custom12);
	setHeader(map, "PLCN_custom12", custom12);

	
	
	/* End by shifa */

	/*if(transRefNo){
		setHeader(map, "PLCN_transRefNoMsgdb", "true");
	}
	else{
		setHeader(map, "PLCN_transRefNoMsgdb", "false");
	}*/

	var mode = readMsgdb.get("MSG_MODE_IN");
	logger.info("ruleGenerateKbSepa: mode = " + mode);
	setHeader(map, "PLCN_mode", mode);
	setHeader(map, "PLCNAPI_mode", mode);
	setHeader(map, "PLCN_msgModeIn", mode);
	setHeader(map, "PLCNAPI_msgModeIn", mode);
	
	if(mode == "MANUAL"){
		logger.info("ruleGenerateKbSepa: inside 1st if loop");
		if(msgType == "pacs.008.001.08") {
			logger.info("ruleGenerateKbSepa: inside 2nd if loop");
			setHeader(map, "PLCN_txntype", "D");
			setHeader(map, "PLCN_txnType", "D");
			setHeader(map, "PLCN_transactiontype", "D");
		}
	}

	/*var priorityAmount1 = readMsgdb.get("PRIORITYAMOUNT");
	logger.info("ruleGenerateKbSepa: priorityAmount1 = " + priorityAmount1);
	setHeader(map, "PLCN_priorityAmount", priorityAmount1);
	setHeader(map, "PLCNAPI_priorityAmount", priorityAmount1);*/

	var msgPriority = readMsgdb.get("PRIORITY");
	logger.info("ruleGenerateKbSepa: msgPriority = " + msgPriority);
	setHeader(map, "PLCN_msgPriority", msgPriority);

	var custom11 = readMsgdb.get("PRIORITY");
	logger.info("ruleGenerateKbSepa: custom11 = " + custom11);
	setHeader(map, "PLCN_custom11", custom11);

	//var manualMode = readMsgdb.get("MANUAL_MODE");
	logger.info("ruleGenerateKbSepa: manualMode = " + mode);
	setHeader(map, "PLCN_manualMode", mode);
	
	var stage = readMsgdb.get("PROCESSING_STAGE");
	logger.info("ruleGenerateKbSepa: stage = " + stage);
	setHeader(map, "PLCN_stage", stage);

	var queueId = readMsgdb.get("QUEUEID");
	logger.info("ruleGenerateKbSepa: queueId = " + queueId);
	setHeader(map, "PLCN_queueId", queueId);

	var channelIdSource = readMsgdb.get("CHANNEL_ID_SOURCE");
	logger.info("ruleGenerateKbSepa: channelIdSource = " + channelIdSource);
	setHeader(map, "PLCN_channelIdSource", channelIdSource);
	setHeader(map, "PLCNAPI_channelIdSource", channelIdSource);
	
	var sourceChannelId = readMsgdb.get("SOURCECHANNELID");
	logger.info("ruleGenerateKbSepa: sourceChannelId = " + sourceChannelId);
	setHeader(map, "PLCN_sourceChannelId", sourceChannelId);
	setHeader(map, "PLCNAPI_sourceChannelId", sourceChannelId);

	var comments = readMsgdb.get("COMMENTS");
	logger.info("ruleGenerateKbSepa: comments = " + comments);
	setHeader(map, "PLCN_txnComments", comments);
	setHeader(map, "PLCNAPI_txnComments", comments);
	setHeader(map, "PLCN_orgnlComments", comments);
	setHeader(map, "PLCNAPI_orgnlComments", comments);

	var custom13 = readMsgdb.get("CUSTOM13");
	logger.info("ruleGenerateKbSepa: custom13 = " + custom13);
	setHeader(map, "PLCN_custom13", custom13);
	setHeader(map, "PLCNAPI_custom13", custom13);

	var prevQueueId = readMsgdb.get("PREVQUEUEID");
	logger.info("ruleGenerateKbSepa: prevQueueId = " + prevQueueId);
	setHeader(map, "PLCN_prevQueueId", prevQueueId);
	setHeader(map, "PLCNAPI_prevQueueId", prevQueueId);

	var custom24 = readMsgdb.get("CUSTOM24");
	logger.info("ruleGenerateKbSepa: custom24 = " + custom24);

	var derivedProductCode = readMsgdb.get("DERIVED_PRODUCT");
	logger.info("ruleGenerateKbSepa: derivedProductCode from db = " + derivedProductCode);

	/*if(!derivedProductCode) {
		derivedProductCode = drveNibcProductCode(exchange);
		logger.info("ruleGenerateKbSepa: derivedProductCode from hazelcast = " + derivedProductCode);
		logger.info("ruleGenerateKbSepa: typeof derivedProductCode from hazelcast = " + typeof derivedProductCode);
	}else {
		setHeader(map, "PLCN_productCode", derivedProductCode);
		setHeader(map, "PLCNAPI_productCode", derivedProductCode);
	}*/

	var productCode = readMsgdb.get("DERIVED_PRODUCT");
	logger.info("ruleGenerateKbSepa: productCode = " + productCode);

	if(productCode){
		setHeader(map, "PLCN_productCode", productCode);
		setHeader(map, "PLCNAPI_productCode", productCode);
		logger.info("ruleGenerateKbSepa: productCode from header = " + getHeader(map, "PLCN_productCode"));
	}
	
	if(!productCode) {
		productCode = drveProductCode(exchange);
		logger.info("ruleGenerateKbSepa: productCode from hazelcast = " + productCode);
		logger.info("ruleGenerateKbSepa: typeof productCode from hazelcast = " + typeof productCode);
	}else {
		setHeader(map, "PLCN_productCode", productCode);
		setHeader(map, "PLCNAPI_productCode", productCode);
	}

	var tenantName =readMsgdb.get("TENANT_NAME");
	if(!tenantName){
		var tenantNamePath = institutionId + ".INSTITUTION_DETAILS.TENANT_NAME";
		logger.info("ruleGenerateKbSepa: tenantName = " + tenantNamePath);
		tenantName = memTblGetTableValue(map, "INST_PARAM",tenantNamePath);
		logger.info("ruleGenerateKbSepa: tenantName = " + tenantName);
		setHeader(map, "PLCN_tenantName", tenantName);	
	}

	if(msgType == 'pacs.008.001.08' || msgType == 'camt.056.001.08' || msgType == 'pacs.003.001.08'/*|| msgType == 'pacs.009.001.08' || msgType == 'pacs.004.001.09'*/) {
		b2bExtractVarMx(Document, map);
	}

	var msgFamily =  readMsgdb.get("MSG_FAMILY");
	logger.info("ruleGenerateKbSepa: msgFamily = " + msgFamily);
	setHeader(map, "PLCN_msgFamilyDB", msgFamily);
	setHeader(map, "PLCNAPI_msgFamilyDB", msgFamily);
	setHeader(map, "PLCN_msgFamily", msgFamily);
	setHeader(map, "PLCNAPI_msgFamily", msgFamily);

	if(msgType != "MT" && msgFamily == "XML") {
		setHeader(map, "PLCN_msgFamilyDB", "SEPA");
		setHeader(map, "PLCN_msgFamily", "SEPA");
		setHeader(map, "PLCNAPI_msgFamily", "SEPA");
	}

	var eodOrgMessageclasstype =  readMsgdb.get("ORG_MESSAGECLASSTYPE");
	logger.info("ruleGenerateKbSepa: eodOrgMessageclasstype = " + eodOrgMessageclasstype);
	setHeader(map, "PLCN_eodOrgMessageclasstype", eodOrgMessageclasstype);
	
	/*	if(msgType == "camt.057.001.06") {
		cbprMxCamt057Values(Document, map);
	}*/

	if(msgDirection == "O") {
		setHeader(map, "PLCN_inboundMessage", true);
		var tmpLog = getHeader(map, "PLCN_inboundMessage");
		logger.info("ruleGenerateKbSepa: PLCN_inboundMessage = " + tmpLog);
		logger.info("ruleGenerateKbSepa: typeof PLCN_inboundMessage = " + typeof tmpLog);		
	}

	setHeader(map, "PLCN_call", true);
	setHeader(map, "PLCNAPI_call", true);
	setHeader(map, "PLCN_ISINPUT", "Y");
}

function ruleGenerateKbFile(exchange) {
	logger.info("In ruleGenerateKbFile rule.");
	//logger.info("Headers inside ruleGenerateKbFile = " + exchange.getIn().getHeaders());
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	//logger.trace("ruleGenerateKbFile: readMsgdb = " + readMsgdb);
	var readMsgdbFile = inMsg.getHeaders().get("ACEQ_READ_MSGDB_FILE");

	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var messageBody = inMsg.getBody(java.lang.String.class);
	//logger.trace("ruleGenerateKbFile: messageBody = " + messageBody);
	setHeader(map, "ACEDB_originalBody", messageBody);

	var msgId =  readMsgdb.get("MSGDB_ID");
	logger.info("ruleGenerateKbFile: msgId = " + msgId);
	setHeader(map, "PLCN_msgDbId", msgId);
	//setHeader(map, "MSGDB_ID", msgId);
	//setHeader(map, "PLCN_msgdbIdOrg", msgId);
	setHeader(map, "PLCN_msgdbIdSource", msgId);
	//logger.info("Headers after setHeader = " + exchange.getIn().getHeaders());

	var institutionId =  readMsgdb.get("INSTITUTIONID");
	logger.info("ruleGenerateKbFile: institutionId = " + institutionId);
	setHeader(map, "PLCN_institutionId", institutionId);
	setHeader(map, "PLCNAPI_institutionId", institutionId);
	//setHeader(map, "INSTITUTION_ID", institutionId);

	var msgType = readMsgdb.get("MESSAGECLASSTYPE");
	logger.info("ruleGenerateKbFile: msgType = " + msgType);

	if(!msgType){
		msgType = getHeader(map, "msgClsType");
		logger.info("ruleGenerateKbFile: msgClsType = " + msgType);
	}

	if(!msgType){
		msgType = getMessageType(exchange);
		msgType = msgType.toLowerCase();
		logger.info("ruleGenerateKbFile: msgType from getMessageType = " + msgType);		
	}

	setHeader(map, "PLCN_msgType", msgType);
	setHeader(map, "PLCNAPI_msgType", msgType);	
	//setHeader(map, "MESSAGE_CLASS_TYPE", msgType);

	var amountPath;
	var txnAmount;
	if(msgType == 'pacs.008.001.08') {
		numOfTxnPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/GrpHdr/NbOfTxs';
	    numOfTxn = getValueFromPath(Document, numOfTxnPath);
		logger.info("ruleGenerateKbFile: numOfTxn = " + numOfTxn);
 		amountPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt';
 		txnAmount = getValueFromPath(Document, amountPath);
	}
	setHeader(map, "PLCN_transactionAmount", txnAmount);

	var msgDirection = readMsgdb.get("MESSAGEDIRECTION");
	logger.info("ruleGenerateKbFile: msgDirection = " + msgDirection);
	setHeader(map, "ABC", "123");
	//logger.info("ruleGenerateKbFile: ABC " + exchange.getIn().getHeaders());
	setHeader(map, "PLCN_msgDirection", msgDirection);
	setHeader(map, "PLCNAPI_msgDirection", msgDirection);
	//setHeader(map, "MESSAGE_DIRECTION", msgDirection);

	var messageNo = readMsgdb.get("MESSAGENO");
	logger.info("ruleGenerateKbFile: messageNo = " + messageNo);
	setHeader(map, "PLCN_messageNo", messageNo);
	//setHeader(map, "ACE_MESSAGE_NO", messageNo);
	//setHeader(map, "SOURCE_ID", messageNo);

	// var custom5DuplPrev = readMsgdb.get("CUSTOM5_DUPL");
	// logger.info("ruleGenerateKbFile: custom5DuplPrev = " + custom5DuplPrev);
	// setHeader(map, "PLCN_custom5Dupl", custom5DuplPrev);

	var sender = readMsgdb.get("SENDER");
	logger.info("ruleGenerateKbFile: sender = " + sender);
	setHeader(map, "PLCN_sender", sender);
	setHeader(map, "PLCNAPI_sender", sender);
	//setHeader(map, "SENDER", sender);

	var receiver = readMsgdb.get("RECEIVER");
	logger.info("ruleGenerateKbFile: receiver = " + receiver);
	setHeader(map, "PLCN_receiver", receiver);
	setHeader(map, "PLCNAPI_receiver", receiver);
	//setHeader(map, "RECEIVER", receiver);

	var numOfMessages = readMsgdb.get("NUMOFMESSAGES");
	logger.info("ruleGenerateKbFile: numOfMessages = " + numOfMessages);
	setHeader(map, "PLCN_numOfMessages", numOfMessages);

	var currency = readMsgdb.get("CURRENCY");
	logger.info("ruleGenerateKbFile: currency = " + currency);

	setHeader(map, "PLCN_currency", currency);
	setHeader(map, "PLCNAPI_currency", currency);

	var priorityAmount = readMsgdb.get("PRIORITYAMOUNT");
	logger.info("ruleGenerateKbFile: priorityAmount = " + priorityAmount);

	setHeader(map, "PLCN_amount", priorityAmount);
	setHeader(map, "PLCN_priorityAmount", priorityAmount);
	setHeader(map, "PLCNAPI_priorityAmount", priorityAmount);
	setHeader(map, "PRIORITY_AMOUNT", priorityAmount);

	var priorityAmountNum = readMsgdb.get("PRIORITYAMOUNTNUM");
	logger.info("ruleGenerateKbFile: priorityAmountNum = " + priorityAmountNum);

	setHeader(map, "PLCN_amountNum", priorityAmountNum);
	setHeader(map, "PLCN_priorityAmountNum", priorityAmountNum);
	setHeader(map, "PLCNAPI_priorityAmountNum", priorityAmountNum);

	/* //var priorityDate = readMsgdb.get("PRIORITYDATE");
	var priorityDate = readMsgdb.get("PRIORITYDATE");
	logger.info("ruleGenerateKbFile: readMsgdbmap = " + readMsgdb);
	logger.info("ruleGenerateKbFile: priorityDate = " + priorityDate);
	if(!priorityDate){
		priorityDate = readMsgdb.get("VALUEDATE");
	}
	logger.info("ruleGenerateKbFile: priorityDate = " + priorityDate);
	setHeader(map, "PLCN_priorityDate", priorityDate);
	//setHeader(map, "PRIORITY_DATE", priorityDate); */

    //enrichValueDate(exchange);
	
	var priority = readMsgdb.get("PRIORITY");
	logger.info("ruleGenerateKbFile: priority = " + priority);
	setHeader(map, "PLCN_priority", priority);
	//setHeader(map, "PRIORITY", priority);

	var localCurrencyAmount = readMsgdb.get("LOCALCURRENCYAMOUNT");
	logger.info("ruleGenerateKbFile: localCurrencyAmount = " + localCurrencyAmount);
	setHeader(map, "PLCN_localCurrencyAmount", localCurrencyAmount);
	//setHeader(map, "LOCALCURRENCYAMOUNT", localCurrencyAmount);

	var localCurrencyAmountNum = readMsgdb.get("LOCALCURRENCYAMOUNTNUM");
	logger.info("ruleGenerateKbFile: localCurrencyAmountNum = " + localCurrencyAmountNum);
	setHeader(map, "PLCN_localCurrencyAmountNum", localCurrencyAmountNum);
	//setHeader(map, "LOCALCURRENCYAMOUNTNUM", localCurrencyAmountNum);

	var lockStatus = readMsgdb.get("LOCKSTATUS");
	logger.info("ruleGenerateKbFile: lockStatus = " + lockStatus);
	setHeader(map, "PLCN_lockStatus", lockStatus);
	//setHeader(map, "LOCKSTATUS", lockStatus);

	// var lockStatus = readMsgdb.get("LOCKSTATUS");
	// logger.info("ruleGenerateKbFile: lockStatus = " + lockStatus);
	// setHeader(map, "PLCN_lockStatus", lockStatus);
	// setHeader(map, "LOCKSTATUS", lockStatus);

	var transRefNo = readMsgdb.get("TRANSREFNO");
	logger.info("ruleGenerateKbFile: transRefNo = " + transRefNo);

	setHeader(map, "PLCN_transRefNo", transRefNo);
	setHeader(map, "PLCNAPI_transRefNo", transRefNo);
	//setHeader(map, "TRANS_REF_NO", transRefNo);

	var mode = readMsgdb.get("MSG_MODE_IN");
	logger.info("ruleGenerateKbFile: mode = " + mode);
	setHeader(map, "PLCN_mode", mode);
	setHeader(map, "PLCNAPI_mode", mode);
	//setHeader(map, "PLCN_msgModeIn", mode);
	//setHeader(map, "PLCNAPI_msgModeIn", mode);

	logger.info("ruleGenerateKbFile: manualMode = " + mode);
	setHeader(map, "PLCN_manualMode", mode);
	
	var stage = readMsgdb.get("PROCESSING_STAGE");
	logger.info("ruleGenerateKbFile: stage = " + stage);
	setHeader(map, "PLCN_processingStage", stage);
	//setHeader(map, "PROCESSING_STAGE", stage);

	var queueId = readMsgdb.get("QUEUEID");
	logger.info("ruleGenerateKbFile: queueId = " + queueId);
	setHeader(map, "PLCN_queueId", queueId);
	//setHeader(map, "QUEUE_ID", queueId);
	//setHeader(map, "ACE_QUEUE_ID", queueId);

	var channelIdSource = readMsgdb.get("CHANNEL_ID_SOURCE");
	logger.info("ruleGenerateKbFile: channelIdSource = " + channelIdSource);
	setHeader(map, "PLCN_channelIdSource", channelIdSource);
	//setHeader(map, "CHANNEL_ID_SOURCE", channelIdSource);
	
	var sourceChannelId = readMsgdb.get("SOURCECHANNELID");
	logger.info("ruleGenerateKbFile: sourceChannelId = " + sourceChannelId);
	setHeader(map, "PLCN_sourceChannelId", sourceChannelId);
	//setHeader(map, "SOURCE_CHANNEL_ID", sourceChannelId);

	var comments = readMsgdb.get("COMMENTS");
	logger.info("ruleGenerateKbFile: comments = " + comments);
	if(isPatternPresent(comments, "8465")) {
		setHeader(map, "PLCN_txnComments", "");
		setHeader(map, "PLCN_orgnlComments", "");
	}else {
		setHeader(map, "PLCN_txnComments", comments);
		setHeader(map, "PLCN_orgnlComments", comments);
	}

	var custom13 = readMsgdb.get("CUSTOM13");
	logger.info("ruleGenerateKbFile: custom13 = " + custom13);
	if(!custom13){
		custom13 = "VALIDATE=Y";
	}
	setHeader(map, "PLCNAPI_custom13", custom13);
	setHeader(map, "PLCN_custom13", custom13);

	var prevQueueId = readMsgdb.get("PREVQUEUEID");
	logger.info("ruleGenerateKbFile: prevQueueId = " + prevQueueId);
	setHeader(map, "PLCN_prevQueueId", prevQueueId);
	setHeader(map, "PLCNAPI_prevQueueId", prevQueueId);

	var custom21 = readMsgdb.get("CUSTOM21");
	logger.info("ruleGenerateKbFile: Custom21 = " + custom21);
	setHeader(map, "PLCN_custom21", custom21);
	setHeader(map, "PLCNAPI_custom21", custom21);

	var custom24 = readMsgdb.get("CUSTOM24");
	logger.info("ruleGenerateKbFile: custom24 = " + custom24);

	var derivedProductCode = readMsgdb.get("DERIVED_PRODUCT");
	logger.info("ruleGenerateKbFile: derivedProductCode from db = " + derivedProductCode);
	//setHeader(map, "DERIVED_PRODUCT", derivedProductCode);
	setHeader(map, "PLCN_derivedProduct", derivedProductCode);

	var productCode= readMsgdb.get("DERIVED_PRODUCT");
	logger.info("ruleGenerateKbFile: productCode = " + productCode);

	var priorityAmountNum = readMsgdb.get("PRIORITYAMOUNTNUM");
	logger.info("ruleGenerateKbFile: priorityAmountNum = " + priorityAmountNum);
	setHeader(map, "PLCN_priorityAmountNum", priorityAmountNum);
	//setHeader(map, "PRIORITY_AMOUNT_NUM", priorityAmountNum);

	var otherAccNo = readMsgdb.get("OTHER_ACCNO");
	logger.info("ruleGenerateKbFile: otherAccNo = " + otherAccNo);
	setHeader(map, "PLCN_otherAccNo", otherAccNo);
	//setHeader(map, "OTHER_ACCNO", otherAccNo);

	var channelIdTarget = readMsgdb.get("CHANNEL_ID_TARGET");
	logger.info("ruleGenerateKbFile: channelIdTarget = " + channelIdTarget);
	setHeader(map, "PLCN_channelIdTarget", channelIdTarget);
	//setHeader(map, "CHANNEL_ID_TARGET", channelIdTarget);

	var reasonCode = readMsgdb.get("REASON_CODE");
	logger.info("ruleGenerateKbFile: reasonCode = " + reasonCode);
	setHeader(map, "PLCN_reasonCode", reasonCode);
	//setHeader(map, "REASON_CODE", reasonCode);

	var transactionType = readMsgdb.get("TRANSACTIONTYPE");
	logger.info("ruleGenerateKbFile: transactionType = " + transactionType);
	setHeader(map, "PLCN_txnType", transactionType);
	//setHeader(map, "TRANSACTION_TYPE", transactionType);

	var custom37 = readMsgdb.get("CUSTOM37");
	logger.info("ruleGenerateKbFile: custom37 = " + custom37);
	setHeader(map, "PLCN_custom37", custom37);
	//setHeader(map, "CUSTOM37", custom37);

	// var msgdbIdOrg = readMsgdb.get("MSGDB_ID_ORG");
	// logger.info("ruleGenerateKbFile: msgdbIdOrg = " + msgdbIdOrg);
	// setHeader(map, "PLCN_msgdbIdOrg", msgdbIdOrg);
	// setHeader(map, "MSGDB_ID_ORG", msgdbIdOrg);

	var fileName = readMsgdb.get("FILENAME");
	logger.info("ruleGenerateKbFile: fileName = " + fileName);
	setHeader(map, "PLCN_fileName", fileName);
	//setHeader(map, "FILE_NAME", fileName);

	var correspondent = readMsgdb.get("CORRESPONDENT");
	logger.info("ruleGenerateKbFile: correspondent = " + correspondent);
	setHeader(map, "PLCN_correspondent", correspondent);
	setHeader(map, "PLCNAPI_correspondent", correspondent);
	//setHeader(map, "CORRESPONDENT", correspondent);

	// var custom25 = readMsgdb.get("CUSTOM25");
	// logger.info("ruleGenerateKbFile: custom25 = " + custom25);
	// setHeader(map, "PLCN_custom25", custom25);
	// setHeader(map, "CUSTOM25", custom25);

	var resubmitQueueId = readMsgdb.get("RESUBMIT_QUEUEID");
	logger.info("ruleGenerateKbFile: resubmitQueueId = " + resubmitQueueId);
	setHeader(map, "PLCN_resubmitQueueId", resubmitQueueId);
	//setHeader(map, "RESUBMIT_QUEUE_ID", resubmitQueueId);

	var numOfMsgs = readMsgdb.get("NUMOFMESSAGES");
	logger.info("ruleGenerateKbFile: numOfMsgs = " + numOfMsgs);
	setHeader(map, "PLCN_numOfMsgs", numOfMsgs);
	//setHeader(map, "NUM_OF_MSGS", numOfMsgs);

	var derivedPaymentSystem = readMsgdb.get("DERIVED_PAYMENT_SYSTEM");
	logger.info("ruleGenerateKbFile: derivedPaymentSystem = " + derivedPaymentSystem);
	setHeader(map, "PLCN_derivedPaymentSystem", derivedPaymentSystem);
	//setHeader(map, "DERIVED_PAYMENT_SYSTEM", derivedPaymentSystem);

	var otherPartyDetails = readMsgdb.get("OTHER_PARTY_DETAILS");
	logger.info("ruleGenerateKbFile: otherPartyDetails = " + otherPartyDetails);
	setHeader(map, "PLCN_otherPartyDetails", otherPartyDetails);
	//setHeader(map, "OTHER_PARTY_DETAILS", otherPartyDetails);

	var msgSegr = readMsgdb.get("MSGSEGR");
	logger.info("ruleGenerateKbFile: msgSegr = " + msgSegr);
	setHeader(map, "PLCN_msgSegr", msgSegr);
	//setHeader(map, "MESSAGE_SEGREGATION", msgSegr);

	// var msgSegr = readMsgdb.get("MSGSEGR");
	// logger.info("ruleGenerateKbFile: msgSegr = " + msgSegr);
	// setHeader(map, "PLCN_msgSegr", msgSegr);
	// setHeader(map, "MESSAGE_SEGREGATION", msgSegr);

	extractMsgDBData(exchange);
	//enrichValueDate(exchange);

	var countryCode = readMsgdb.get("COUNTRYCODE");
	logger.info("ruleGenerateKbFile: countryCode = " + countryCode);
	setHeader(map, "PLCN_countryCode", countryCode);

	if(!productCode || productCode == "NOTAPPLICABLE" || msgType == "pacs.002.001.10") {
		productCode = drveProductCode(exchange);
		logger.info("ruleGenerateKbFile: productCode from hazelcast = " + productCode);
		logger.info("ruleGenerateKbFile: typeof productCode from hazelcast = " + typeof productCode);
	}else {
		setHeader(map, "PLCN_productCode", productCode);
	}

	if(msgType == 'pacs.008.001.08' /*|| msgType == 'pacs.009.001.08' || msgType == 'pacs.004.001.09'*/) {
		b2bExtractVarMx(Document, map);
	}

	var msgFamily =  readMsgdb.get("MSG_FAMILY");
	logger.info("ruleGenerateKbFile: msgFamily = " + msgFamily);
	setHeader(map, "PLCN_msgFamily", msgFamily);
	setHeader(map, "PLCN_msgFamilyDB", msgFamily);
	//setHeader(map, "PLCNAPI_msgFamily", msgFamily);
	//setHeader(map, "MESSAGE_FAMILY", msgFamily);

	if(msgType != "MT" && msgFamily == "XML") {
		setHeader(map, "PLCN_msgFamily", "SEPA");
		setHeader(map, "PLCNAPI_msgFamily", "SEPA");	
		var orgMessageClassType =  readMsgdb.get("ORG_MESSAGECLASSTYPE");
		//setHeader(map, "MESSAGE_FAMILY", msgFamily);
	}

	logger.info("ruleGenerateKbFile: orgMessageClassType = " + orgMessageClassType);
	setHeader(map, "PLCN_orgMessageClassType", orgMessageClassType);
	
	/*	if(msgType == "camt.057.001.06") {
		cbprMxCamt057Values(Document, map);
	}*/

	if(msgDirection == "O") {
		setHeader(map, "PLCN_inboundMessage", true);
		var tmpLog = getHeader(map, "PLCN_inboundMessage");
		logger.info("ruleGenerateKbFile: PLCN_inboundMessage = " + tmpLog);
		logger.info("ruleGenerateKbFile: typeof PLCN_inboundMessage = " + typeof tmpLog);		
	}
	
	var totalTrxnsInBatch = readMsgdbFile.get("MDBFL_NUM_OF_MSGS");
	logger.info("ruleGenerateKbFile: totalTrxnsInBatch = " + totalTrxnsInBatch);
	if(!totalTrxnsInBatch){
		totalTrxnsInBatch = readMsgdb.get("CUSTOM21"); 
		logger.info("ruleGenerateKbFile: totalTrxnsInBatch = " + totalTrxnsInBatch);
	}
	setHeader(map, "PLCN_totalTrxnsInBatch", totalTrxnsInBatch);
	setHeader(map, "PLCNAPI_totalTrxnsInBatch", totalTrxnsInBatch);
	
	var PaymentType = msgFamily + msgType ;
	setHeader(map, "PaymentType", PaymentType);
	logger.info("ruleGenerateKbFile: PaymentType = " + PaymentType);

	var translationFlag;
    if(isPatternPresent(msgType, "pacs.008") || isPatternPresent(msgType, "pacs.004")) {
    	translationFlag = 'true';
    	setHeader(map, "PLCN_translationFlag", translationFlag);
    }else {
    	translationFlag = 'false';
    	setHeader(map, "PLCN_translationFlag", translationFlag);
    }

    setHeader(map, "PLCN_call", true);
	setHeader(map, "PLCNAPI_call", true);
	setHeader(map, "PLCN_ISINPUT", "Y");
}

function setValidationHeaderSepa(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var documentString = inMsg.getBody(java.lang.String.class);

	var msgType = getHeader(map, "PLCN_msgType");
	logger.info("setValidationHeaderSepa: msgType from PLCN_msgType = " + msgType);

	if(!msgType){
		msgType = getMessageType(exchange);
		msgType = msgType.toLowerCase();
		logger.info("setValidationHeaderSepa: msgType from getMessageType = " + msgType);		
	}

	/*if(isPatternPresent(documentString, "<FIToFIPmtStsRpt>")) {
		msgType = "pacs.002.001.10";
	}else if(isPatternPresent(documentString, "<PmtRtr>")) {
		msgType = "pacs.004.001.09";
	}else if(isPatternPresent(documentString, "<FIToFICstmrCdtTrf>")){
		msgType = "pacs.008.001.08";
	}else if (isPatternPresent(documentString, "<FICdtTrf>")) {
		msgType = "pacs.009.001.08";
	}else if (isPatternPresent(documentString, "<NtfctnToRcv>")) {
        msgType = "camt.057.001.06";
    }*/

	setHeader(map, "PaymentType", "SEPA" + msgType);
	setHeader(map, "CamelHttpMethod", "POST");
	//setHeader(map, "PLCN_CbprFlag", true);
	logger.info("setValidationHeaderSepa: PaymentType = " + getHeader(map, "PaymentType"));
	logger.info("setValidationHeaderSepa: CamelHttpMethod = " + getHeader(map, "CamelHttpMethod"));
}

function setOriginalBody(exchange){
	var inMsg;
	var map;
	var orgnlBody;
	var responseCdsDoc;

    inMsg = exchange.getIn();
    map = inMsg.getHeaders();

    logger.info("In setOriginalBody");

    responseCdsDoc = inMsg.getBody(java.lang.String.class);
    //logger.trace("setOriginalBody: body = " + responseCdsDoc);

    if(isPatternPresent(responseCdsDoc, "<ResponseCds>")) {
    	setHeader(map, "ACEDB_responseCdsDoc", responseCdsDoc);
    }

	orgnlBody = getHeader(map, "ACEDB_originalBody");
	//logger.trace("setOriginalBody: orgnlBody = " + orgnlBody);
	//logger.trace("setOriginalBody: responseCdsDoc = " + responseCdsDoc);
	inMsg.setBody(orgnlBody);
  	//setHeader(map, "ACEDB_originalBody", "");
}

function dynamicRoute(exchange) {
	var validMessageFlag;
	var duplicateMessageFlag;
	var repairReqFlag;
	var responseCdsDoc;
	var pastDateFlag;
	var ibanBicConsistent;
	var authLevelKey;
	var orgMessageClassType;
	var arr = [];
	var resFlag = [];
	var result;
	var resultFlag;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("dynamicRoute: institutionId = " + institutionId);

	ibanBicConsistent = getHeader(map, "PLCN_ibanBicConsistent");
	logger.info("dynamicRoute: ibanBicConsistent = " + ibanBicConsistent);
	
	pastDateFlag = getHeader(map, "PLCN_pastDateFlag");
	logger.info("dynamicRoute: pastDateFlag = " + pastDateFlag);
	logger.info("dynamicRoute: typeof pastDateFlag = " + typeof pastDateFlag);

	orgMessageClassType = getHeader(map , "PLCN_orgMessageClassType");
	logger.info("dynamicRoute: orgMessageClassType = " + orgMessageClassType);
	logger.info("dynamicRoute: typeof orgMessageClassType = " + typeof orgMessageClassType);

	var msgDirection = 	getHeader(map, "PLCN_msgDirection");
	logger.info("dynamicRoute: msgDirection = " + msgDirection);

	if(!pastDateFlag) {
		pastDateFlag = "false";
	}

	logger.info("dynamicRoute: pastDateFlag = " + pastDateFlag);

	if(pastDateFlag == "false") {
		if(ibanBicConsistent == "false") {
			repairReqFlag = "true";
			setHeader(map, "PLCN_repairReq", "true");
		}else {
			repairReqFlag = "false";
			setHeader(map, "PLCN_repairReq", "false");
	    }
	}else {
		repairReqFlag = "true";
		setHeader(map, "PLCN_repairReq", "true");
	}

	validMessageFlag = getHeader(map, "PLCN_validMessage");
	validMessageFlag = validMessageFlag.toString();
	duplicateMessageFlag = getHeader(map, "PLCN_duplicateMessage");
	duplicateMessageFlag = duplicateMessageFlag.toString();
	repairReqFlag = getHeader(map, "PLCN_repairReq");
	repairReqFlag = repairReqFlag.toString();

	validTimelineFlag = getHeader(map, "PLCN_validTimeline");
	validTimelineFlag = validTimelineFlag.toString();

	logger.info("dynamicRoute: validMessageFlag = " + validMessageFlag);
	logger.info("dynamicRoute: duplicateMessageFlag = " + duplicateMessageFlag);
	logger.info("dynamicRoute: repairReqFlag = " + repairReqFlag);
	logger.info("dynamicRoute: validTimelineFlag = " + validTimelineFlag);

	logger.info("dynamicRoute: typeof validMessageFlag = " + typeof validMessageFlag);
	logger.info("dynamicRoute: typeof duplicateMessageFlag = " + typeof duplicateMessageFlag);
	logger.info("dynamicRoute: typeof repairReqFlag = " + typeof repairReqFlag);
	logger.info("dynamicRoute: typeof validTimelineFlag = " + typeof validTimelineFlag);

	responseCdsDoc = getHeader(map, "ACEDB_responseCdsDoc");
	//logger.info("dynamicRoute: responseCdsDoc = " + responseCdsDoc);

	/*var xsdStatus = getHeader(map, "xsdStatus");
	logger.info("dynamicRoute: xsdStatus = " + xsdStatus);

	if(xsdStatus == "error") {
		validMessageFlag = "false";
	}*/

	if(validTimelineFlag == "false") {
		validMessageFlag = "false"
	}

	if(validMessageFlag == "true" &&  duplicateMessageFlag == "true" && repairReqFlag == "true") {
		logger.info("dynamicRoute: repair required");
		setHeader(map, "PLCN_repairReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "false");
		setHeader(map, "PLCN_queueAudit", "TXNREPRQ");
	}else if(validMessageFlag == "true" &&  duplicateMessageFlag == "true" && repairReqFlag == "false") {
		logger.info("dynamicRoute: repair not required");
		setHeader(map, "PLCN_repairReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "false");
		setHeader(map, "PLCN_queueAudit", "TXNDUPLQ");
	}else if(validMessageFlag == "true" &&  duplicateMessageFlag == "false" && repairReqFlag == "true") {
		logger.info("dynamicRoute: repair required");
		setHeader(map, "PLCN_repairReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "false");
		setHeader(map, "PLCN_queueAudit", "TXNREPRQ");
	}else if(validMessageFlag == "true" &&  duplicateMessageFlag == "false" && repairReqFlag == "false") {
		logger.info("dynamicRoute: no repair required");
		setHeader(map, "PLCN_repairReqFinal", "false");
		setHeader(map, "PLCN_validFlag", "true");
	}else if(validMessageFlag == "false" &&  duplicateMessageFlag == "true" && repairReqFlag == "true") {
		logger.info("dynamicRoute: repair required");
		setHeader(map, "PLCN_repairReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "false");
		//setHeader(map, "PLCN_queueAudit", "ERRORQ");
		//inMsg.setBody(responseCdsDoc);
	}else if(validMessageFlag == "false" &&  duplicateMessageFlag == "true" && repairReqFlag == "false") {
		logger.info("dynamicRoute: repair required");
		setHeader(map, "PLCN_repairReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "false");
		//setHeader(map, "PLCN_queueAudit", "ERRORQ");
		//inMsg.setBody(responseCdsDoc);
	}else if(validMessageFlag == "false" &&  duplicateMessageFlag == "false" && repairReqFlag == "true") {
		logger.info("dynamicRoute: repair required");
		setHeader(map, "PLCN_repairReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "false");
		//setHeader(map, "PLCN_queueAudit", "ERRORQ");
		//inMsg.setBody(responseCdsDoc);
	}else if(validMessageFlag == "false" &&  duplicateMessageFlag == "false" && repairReqFlag == "false") {
		logger.info("dynamicRoute: repair required");
		setHeader(map, "PLCN_repairReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "false");
		//setHeader(map, "PLCN_queueAudit", "ERRORQ");
		//inMsg.setBody(responseCdsDoc);
	}

	//var validflag = getHeader(map, 'PLCN_validFlag');
	var sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	logger.info("dynamicRoute: sourceChannelId = " + sourceChannelId);
	
	//For Manual Upload
	if(sourceChannelId == 'SWIFT_MX_UPL_IN' || sourceChannelId == 'SWIFT_UPL_IN') {
		if(validMessageFlag == 'true' || duplicateMessageFlag == 'true') {
			setHeader(map, "PLCN_queueAudit", "TXNREPRQ");
			setHeader(map, "PLCN_repairReqFinal", "true");
			setHeader(map, "PLCN_validFlag", "false");
			setHeader(map, "PLCN_ISOUTPUT", "N");
		}
	}

    var txnComments = getHeader(map, "PLCN_txnComments"); //"P00-1P32-1:A00:00-9505:A00:32-6012:A00:32-6013";
	var haseValue = memTblGetTableValue(map, "FLAG-TABLE", "CBPR_T2_CHECK_VIOLATIONS");
	logger.info("dynamicRoute: haseValue = " + haseValue);
	logger.info("dynamicRoute: haseValue.length = " + haseValue.length);

	if(haseValue) {
		for(var j = 0; haseValue.length > 1 ; j++) {
			var value = dataBetweenTokens("|", "|", haseValue);
			logger.info("dynamicRoute: value = " + haseValue);

			arr[j] = value;
			logger.info("dynamicRoute: arr[j] = " + arr[j]);

			haseValue = removePattern(haseValue, "|" + value);
			logger.info("dynamicRoute: haseValue = " + haseValue);
		}

		logger.info("dynamicRoute: arr = " + arr);
		logger.info("dynamicRoute: arr.length = " + arr.length);

		for(var i = 0; i < arr.length; i++) {
			logger.info("dynamicRoute: arr.length = " + arr.length);
			logger.info("dynamicRoute: txnComments = " + txnComments);
			result = isPatternPresent(txnComments, arr[i]);
			logger.info("dynamicRoute: result = " + result);

			if(result == true) {
				logger.info("T2 Qualified but BIC nor derived");
				queue = "TXNREPRQ";
				setHeader(map, "PLCN_queueAudit", "TXNREPRQ");
				setHeader(map, "PLCN_repairReqFinal", "true");
			}
		}
	}

	if(!queue) {
		if(validMessageFlag == "false"){
			if(orgMessageClassType != "") {
				queue = "TXNREPRQ";
				setHeader(map, "PLCN_queueAudit", "TXNREPRQ");
				setHeader(map, "PLCN_repairReqFinal", "true");
			}else {
				logger.info("dynamicRoute: inside ERRORQ loop = " + validMessageFlag);
				setHeader(map, "PLCN_queueAudit", "ERRORQ");
				setHeader(map, "PLCN_displayFlag", "Y");
				setHeader(map, "PLCN_processingStage", "ERR");
				setHeader(map, "PLCN_ERRORQ", true);
				setHeader(map, "PLCN_repairReqFinal", "true");

				if(validTimelineFlag == "false") {
					if(msgDirection == "I") {
						setHeader(map, "PLCN_queueAudit", "TXNHOLDQ");
						setHeader(map, "PLCN_displayFlag", "Y");
						setHeader(map, "PLCN_processingStage", "WRHS");
						setHeader(map, "PLCN_TXNHOLDQ", true);
						setHeader(map, "PLCN_repairReqFinal", "true");
					}else{
						setHeader(map, "PLCN_queueAudit", "ERRORQ");
						setHeader(map, "PLCN_displayFlag", "Y");
						setHeader(map, "PLCN_processingStage", "ERR");
						setHeader(map, "PLCN_ERRORQ", true);
						setHeader(map, "PLCN_repairReqFinal", "true");						
					}
				}
			}
		}			
	}

	var queue = getHeader(map, "PLCN_queueAudit");
	logger.info("dynamicRoute: queue = " + queue);

	if(queue == "TXNREPRQ") {
		authLevelKey = institutionId + "."+ "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL.STAGES.REPAIR" + "." + "STAGE_ACCESS_CONTROL";
    	logger.info("dynamicRoute: authLevelKey = " + authLevelKey);
    }else {
		authLevelKey = institutionId + "."+ "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL.STAGES.DUPLICATE" + "." + "STAGE_ACCESS_CONTROL";
    	logger.info("dynamicRoute: authLevelKey = " + authLevelKey);
    }

    var authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
    logger.info("dynamicRoute: authLevelValue = " + authLevelValue);

    if(!authLevelValue) {
        authLevelKey = institutionId + "."+ "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL" + "." + "INSTITUTION_ACCESS_CONTROL";
        logger.info("dynamicRoute: authLevelKey = " + authLevelKey);

        authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
        logger.info("dynamicRoute: authLevelValue = " + authLevelValue);      
    }

    authLevelValue = textToNum(authLevelValue);
    logger.info("dynamicRoute: authLevelValue = " + authLevelValue);

	if(queue == "TXNREPRQ") {
		setHeader(map, "PLCN_displayFlag", "Y");
		setHeader(map, "PLCN_processingStage", "REPR");
		setHeader(map, "PLCN_currentAuthLevel", "REPR=" + authLevelValue);
		setHeader(map, "PLCN_MXREPRQ", true);
	}else if(queue == "TXNDUPLQ") {
		setHeader(map, "PLCN_displayFlag", "Y");
		setHeader(map, "PLCN_processingStage", "DUPL");
		setHeader(map, "PLCN_currentAuthLevel", "DUPL=" + authLevelValue);
		setHeader(map, "PLCN_MXDUPLQ", true);
	}

	logger.info("dynamicRoute: PLCN_repairReqFinal = " + getHeader(map, "PLCN_repairReqFinal"));
	logger.info("dynamicRoute: PLCN_validFlag = " + getHeader(map, "PLCN_validFlag"));

	var xsdValid = getHeader(map, "XSD_VALID");
	logger.info("dynamicRoute: xsdValid = " + xsdValid);

	/*if(xsdValid == false) {
		setHeader(map, "PLCN_validFlag", false);
	}*/

	if(getHeader(map, "PLCN_validFlag") == "true") {
		logger.info("dynamicRoute: PLCN_queueAudit = " + getHeader(map, "PLCN_queueAudit"));
	}

	logger.info("dynamicRoute: PLCN_ERRORQ = " + getHeader(map, "PLCN_ERRORQ"));
	logger.info("dynamicRoute: PLCN_MXREPRQ = " + getHeader(map, "PLCN_MXREPRQ"));
	logger.info("dynamicRoute: PLCN_MXDUPLQ = " + getHeader(map, "PLCN_MXDUPLQ"));
}

function createResponse(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var i;
	var j = 0;
	var k;
	var fldNo = [];
	var fldViolation = [];
	var ofldViolation = [];
	var fldTag;
	var fldName;
	var plcnCodesValues;
	var ovCount = 0;
	var vCount = 0;
	var responseCdsString;
	var CdTpValue = [];
	var t2Status;

	logger.info("In createResponse");

	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	logger.trace("createResponse: typeof Document = " + typeof Document);

	var validMessage = getHeader(map, "PLCN_validMessage");
	var msgType = getHeader(map, "PLCN_msgType");
	var status = getHeader(map, "status");

	var plcnFlag = getHeader(map, "PLCN_call");
	logger.info("createResponse: plcnFlag = " + plcnFlag);
	logger.info("createResponse: typeof plcnFlag = " + typeof plcnFlag);
	plcnFlag = plcnFlag.toString();
	logger.info("createResponse: typeof plcnFlag = " + typeof plcnFlag);

	var xsdValid = getHeader(map, "XSD_VALID");
	logger.info("createResponse: xsdValid = " + xsdValid);
	logger.info("createResponse: typeof xsdValid = " + typeof xsdValid);

	/*var t2Valid = getHeader(map, "PLCN_t2Valid");
	logger.info("createResponse: t2Valid = " + t2Valid);
	logger.info("createResponse: typeof t2Valid = " + typeof t2Valid);*/


	//if its an internal call response code is stored in ACEDB_responseCdsDoc (in T2 & CBPR server) otherwise PLCN_responseCdsDoc 
	if(plcnFlag.toString() == "true") {
		if(xsdValid.toString() == "false") {
			responseCdsString = getHeader(map, "ACEDB_responseCdsDoc");
		}else {
			responseCdsString = null;
		}
	}else {
		if(xsdValid.toString() == "false" /*|| t2Valid.toString() == "false"*/) {
			responseCdsString = getHeader(map, "PLCN_responseCdsDoc");
		}else {
			responseCdsString = null;
		}
	}

	//logger.trace("createResponse: responseCdsString = " + responseCdsString);
	logger.info("createResponse: typeof responseCdsString = " + typeof responseCdsString);

	logger.trace("createResponse: validMessage = " + validMessage);
	logger.info("createResponse: typeof validMessage = " + typeof validMessage);
	logger.info("createResponse: status = " + status);
	logger.info("createResponse: msgType = " + msgType);

	if(!msgType) {
		var documentString = inMsg.getBody(java.lang.String.class);

		if(isPatternPresent(documentString, "<FIToFIPmtStsRpt>")) {
			msgType = "pacs.002.001.10";
		}else if(isPatternPresent(documentString, "<PmtRtr>")) {
			msgType = "pacs.004.001.09";
		}else if(isPatternPresent(documentString, "<FIToFICstmrCdtTrf>")){
			msgType = "pacs.008.001.08";
		}else if (isPatternPresent(documentString, "<FICdtTrf>")) {
			msgType = "pacs.009.001.08";
		}else if (isPatternPresent(documentString, "<NtfctnToRcv>")) {
	        msgType = "camt.057.001.06";
	    }

	    logger.info("createResponse: msgType = " + msgType);
	}

	var txnComments = getHeader(map, "PLCN_txnComments"); //"P00-1P32-1:A00:00-9505:A00:32-6012:A00:32-6013";
	var orgnlComments = getHeader(map, "PLCN_orgnlComments"); //"P00-1:A00:00-9505";
	var txnCommentsDB = txnComments;

	logger.info("createResponse: txnComments = " + txnComments);
	logger.info("createResponse: orgnlComments = " + orgnlComments);

	if(orgnlComments) {
		ovCount = (orgnlComments.match(/:A00:/g)).length;
	}
	var comments = txnComments + ":A00:";

	logger.info("createResponse: ovCount = " + ovCount);
	logger.info("createResponse: comments = " + comments);

	orgnlComments = orgnlComments + ":A00:";

	for(k = 0; k < ovCount; k++) {
		var otmp = dataBetweenTokens(":A00:", ":A00:", orgnlComments);
		logger.info("createResponse: otmp = " + otmp);
		ofldViolation[k] = otmp.substring(3, 7);
		comments = removePattern(comments, ":A00:" + otmp);
		orgnlComments = removePattern(orgnlComments, ":A00:" + tmp);
	}

	logger.info("createResponse: comments = " + comments);
	logger.info("createResponse: orgnlComments = " + orgnlComments);
	logger.info("createResponse: txnComments = " + txnComments);

	plcnCodesValues = comments.substring(0, comments.length - 5);
	logger.info("createResponse: plcnCodesValues = " + plcnCodesValues);

	logger.info("createResponse: txnComments = " + txnComments);
	logger.info("createResponse: txnComments length = " + txnComments.length);
	logger.info("createResponse: typeof txnComments = " + typeof txnComments);

	if(txnComments.length > 0) {
		vCount = (txnComments.match(/:A00:/g)).length;//(txnComments.match(/:A00:/g) || []).length;
		logger.info("createResponse: vCount = " + vCount);
	}

	for(i = 0; i < vCount; i++) {
		logger.info("createResponse: txnComments = " + txnComments);
		var tmp = dataBetweenTokens(":A00:", ":A00:", txnComments); //296-5770
		logger.info("createResponse: tmp = " + tmp);
		var tmp2 = ":A00:" + tmp + ":A00:" //:A00:296-5770:A00:
		logger.info("createResponse: tmp2 = " + tmp2);
		fldNo[i] = dataBetweenTokens(":A00:", "-", tmp2); //tmp.substring(0, 2);
		fldViolation[i] = dataBetweenTokens("-", ":A00:", tmp2); //tmp.substring(3, 7);
		txnComments = removePattern(txnComments, ":A00:" + tmp);
	}

	logger.info("createResponse: fldViolation = " + fldViolation);
	logger.info("createResponse: fldNo = " + fldNo);

	logger.info("createResponse: responseCdsString = " + responseCdsString);
	logger.info("createResponse: typeof responseCdsString = " + typeof responseCdsString);

	logger.info("createResponse: txnCommentsDB = " + txnCommentsDB);
	logger.info("createResponse: typeof txnCommentsDB = " + typeof txnCommentsDB);

	if(responseCdsString != null) {
		//append
		logger.info("createResponse: response code already generated");
		setHeader(map, "xsdStatus", "error");
		setHeader(map, "status", "error");

		if(plcnFlag == "true") {
			var responseDoc = createDocument(responseCdsString);
		}else {
			var responseDoc = responseCdsString;
		}

		logger.info("createResponse: typeof responseDoc = " + typeof responseDoc);

		var responseCdsPlcnFmt = responseDoc.getElementsByTagName("ResponseCdsPlcnFmt");
		var nextNode = responseCdsPlcnFmt.item(0);

		logger.info("createResponse: j = " + j);
		logger.info("createResponse: vCount = " + vCount);

		while(j < vCount) {
			fldTag = memTblGetTableValue(map, msgType + "FldTag", fldNo[j]);
			fldTag = fldTag.trim();
			fldName = memTblGetTableValue(map, msgType + "FldName", fldTag);
			fldName = fldName.trim();

			logger.info("createResponse: fldTag = " + fldTag);
			logger.info("createResponse: fldName = " + fldName);

			var responseCds = responseDoc.getElementsByTagName("ResponseCds"); //root element
			//logger.info("createResponse: responseCds = " + convertDocumentToString(responseCds));
			logger.trace("createResponse: typeof responseCds = " + typeof responseCds);

			var AddtlResponseCds = createElementwithTextNode2(responseDoc, "AddtlResponseCds", "");
			//logger.info("createResponse: AddtlResponseCds = " + convertDocumentToString(AddtlResponseCds));
			//appendElementtoNode(responseCds, AddtlResponseCds);
			var newNode = responseCds.item(0);
			newNode.insertBefore(AddtlResponseCds, nextNode);

			var PlcnFldNum = createElementwithTextNode2(responseDoc, "PlcnFldNum", fldNo[j]);
			appendElementtoNode(AddtlResponseCds, PlcnFldNum);

			var FldTag = createElementwithTextNode2(responseDoc, "FldTag", fldTag);
			appendElementtoNode(AddtlResponseCds, FldTag);

			var FldName = createElementwithTextNode2(responseDoc, "FldName", fldName);
			appendElementtoNode(AddtlResponseCds, FldName);

			var violationSeries = fldViolation[j].substring(0, 1);
			logger.info("createResponse: violationSeries = " + violationSeries);

			if(violationSeries == "8" || violationSeries == "1") {
				CdTpValue = "Error";
			}else if(violationSeries == "7") {
				CdTpValue = "Warning";
			}else if(violationSeries == "9") {
				CdTpValue = "Repair";
			}else if(violationSeries == "6") {
				CdTpValue = "Info";
			}else {
				CdTpValue = "Info";
			}

			logger.info("createResponse: CdTpValue = " + CdTpValue);

			var CdTp = createElementwithTextNode2(responseDoc, "CdTp", CdTpValue);
			appendElementtoNode(AddtlResponseCds, CdTp);

			var Code = createElementwithTextNode2(responseDoc, "Cd", fldViolation[j]);
			appendElementtoNode(AddtlResponseCds, Code);

			var DescriptionValue = memTblGetTableValue(map, "LANGDESC", "PAYALY|" + fldViolation[j]);
			logger.info("createResponse: langDescKey = " + langDescKey);
			logger.info("createResponse: DescriptionValue from PAYALY = " + DescriptionValue);

			if(!DescriptionValue) {
				DescriptionValue = memTblGetTableValue(map, "LANGDESC", "ACEERR|" + fldViolation[j]);
				logger.info("createResponse: langDescKey = " + langDescKey);
				logger.info("createResponse: DescriptionValue from ACEERR = " + DescriptionValue);
			}

			if(!DescriptionValue) {
				DescriptionValue = memTblGetTableValue(map, "LANGDESC", "PLATERR|" + fldViolation[j]);
				logger.info("createResponse: langDescKey = " + langDescKey);
				logger.info("createResponse: DescriptionValue from PLATERR = " + DescriptionValue);
			}

			if(!DescriptionValue) {
				DescriptionValue = "Unable to fetch description for given error/warning code. Please contact administrator.";
			}				

			var Description = createElementwithTextNode2(responseDoc, "Description", DescriptionValue);
			appendElementtoNode(AddtlResponseCds, Description);

			j++;
		}

		var responseCdsPath = "/ResponseCds/ResponseCdsPlcnFmt/PlcnCodes"
		var retVal = setValueInTxtNode(responseDoc, responseCdsPath, plcnCodesValues);
		logger.info("createResponse: retVal = " + retVal);
		setHeader(map, "PLCN_validMessage", "false");
	}else if(txnCommentsDB) {
		//create
		logger.info("createResponse: creating response code");
		var responseDoc = getDocument();
		//logger.trace("createResponse: responseDoc = " + responseDoc);

		var responseCds = createElement(responseDoc, "ResponseCds");
		appendElementtoNode(responseDoc, responseCds);

		logger.info("createResponse: j = " + j);
		logger.info("createResponse: vCount = " + vCount);
		
		while(j < vCount) {
			fldTag = memTblGetTableValue(map, msgType + "FldTag", fldNo[j]);
			fldTag = fldTag.trim();
			fldName = memTblGetTableValue(map, msgType + "FldName", fldTag);
			fldName = fldName.trim();

			logger.info("createResponse: fldTag = " + fldTag);
			logger.info("createResponse: fldName = " + fldName);

			var AddtlResponseCds = createElementwithTextNode(responseDoc, responseCds, "AddtlResponseCds", "");
			appendElementtoNode(responseCds, AddtlResponseCds);

			var PlcnFldNum = createElementwithTextNode(responseDoc, responseCds, "PlcnFldNum", fldNo[j]);
			appendElementtoNode(AddtlResponseCds, PlcnFldNum);

			var FldTag = createElementwithTextNode(responseDoc, responseCds, "FldTag", fldTag);
			appendElementtoNode(AddtlResponseCds, FldTag);

			var FldName = createElementwithTextNode(responseDoc, responseCds, "FldName", fldName);
			appendElementtoNode(AddtlResponseCds, FldName);

			var violationSeries = fldViolation[j].substring(0, 1);
			logger.info("createResponse: violationSeries = " + violationSeries);

			if(violationSeries == "8" || violationSeries == "1") {
				CdTpValue[j] = "Error";
			}else if(violationSeries == "7") {
				CdTpValue[j] = "Warning";
			}else if(violationSeries == "9") {
				CdTpValue[j] = "Repair";
			}else if(violationSeries == "6") {
				CdTpValue[j] = "Info";
			}else {
				CdTpValue[j] = "Info";
			}

			logger.info("createResponse: CdTpValue = " + CdTpValue);

			var CdTp = createElementwithTextNode2(responseDoc, "CdTp", CdTpValue[j]);
			appendElementtoNode(AddtlResponseCds, CdTp);
			
			var Code = createElementwithTextNode(responseDoc, responseCds, "Cd", fldViolation[j]);
			appendElementtoNode(AddtlResponseCds, Code);

			var langDescKey = "PAYALY|" + fldViolation[j];
			var DescriptionValue = memTblGetTableValue(map, "LANGDESC", langDescKey);
			logger.info("createResponse: langDescKey = " + langDescKey);
			logger.info("createResponse: DescriptionValue = " + DescriptionValue);

			if(!DescriptionValue) {
				langDescKey = "ACEERR|" + fldViolation[j];
				DescriptionValue = memTblGetTableValue(map, "LANGDESC", langDescKey);
				logger.info("createResponse: langDescKey = " + langDescKey);
				logger.info("createResponse: DescriptionValue = " + DescriptionValue);
			}

			if(!DescriptionValue) {
				DescriptionValue = memTblGetTableValue(map, "LANGDESC", "PLATERR|" + fldViolation[j]);
				logger.info("createResponse: langDescKey = " + langDescKey);
				logger.info("createResponse: DescriptionValue from PLATERR = " + DescriptionValue);
			}

			if(!DescriptionValue) {
				DescriptionValue = "Unable to fetch description for given error/warning code. Please contact administrator.";
				logger.info("createResponse: DescriptionValue = " + DescriptionValue);
			}				

			var Description = createElementwithTextNode2(responseDoc, "Description", DescriptionValue);
			appendElementtoNode(AddtlResponseCds, Description);
			
			j++;
		}						

		var ResponseCdsPlcnFmt = createElementwithTextNode(responseDoc, responseCds, "ResponseCdsPlcnFmt", "");
		appendElementtoNode(responseCds, ResponseCdsPlcnFmt);

		var PlcnCodes = createElementwithTextNode(responseDoc, responseCds, "PlcnCodes", getHeader(map, "PLCN_txnComments"));
		appendElementtoNode(ResponseCdsPlcnFmt, PlcnCodes);
		for(j = 0; j < CdTpValue.length; j++) {
			logger.info("createResponse: CdTpValue = " + CdTpValue[j]);

			if(CdTpValue[j] == "Error") {
				setHeader(map, "status", "error");
			}else {
				setHeader(map, "status", "valid");
			}
		}
	}

	//logger.trace("createResponse: responseDoc = " + responseDoc);
	logger.info("createResponse: status = " + getHeader(map, "status"));

	if(responseDoc){
		//logger.trace("createResponse: responseDoc = " + responseDoc);
		logger.info("createResponse: typeof responseDoc = " + typeof responseDoc);
		var responseCdsString = getPrettyPrint(responseDoc);
		//logger.trace("createResponse: responseCdsString = " + responseCdsString);
		var internalFlag = getHeader(map, "PLCN_call");
		logger.info("createResponse: internalFlag = " + internalFlag);

		if(!internalFlag){
			inMsg.setBody(responseCdsString);
		}else {
			setHeader(map, "ACEDB_responseCdsDoc", responseCdsString);
		}
	}
}

function dbOperationSepa(exchange) {
	var inMsg;
	var Document;
	var msgdbMap;
	var map;
	var readMsgdb;
	var audit;
	var comments;
	var sourceChannelId;
	var channelIdTarget;
	var validMessage;
	var msgType;
	var processId;
	var custom27;
	var custom17;
	var msgStateMeaning;
	var targetChannelId;
	var institutionId;
	var config1;
	var config2;
	var config3;
	var msgBlock1;
	var msgBlock2;
	var msgBlock153;
	var msgBlock154;
	var msgFamily154;
	var path; 
	var custom12;
    var msgdbPayMap;

	logger.info("In dbOperationSepa");

	inMsg = exchange.getIn();

	//var messageString = inMsg.getBody(java.lang.String.class);
	//logger.info("dbOperationSepa: messageString = " + messageString);

	inMsg = exchange.getIn();
	
	map = inMsg.getHeaders();
	msgdbMap = new HashMap();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	audit = new HashMap();
    msgdbPayMap = new HashMap();

	logger.info("dbOperationSepa: MSGDB_ID = " + getHeader(map, "PLCN_msgDbId"));

    custom12 = readMsgdb.get("CUSTOM12");
	logger.info("dbOperationSepa: custom12 start= " + custom12);
	
	var msgDirection = getHeader(map, "PLCN_msgDirection");
 	logger.info("dbOperationSepa: msgDirection = " + msgDirection);

	var mode = getHeader(map,"PLCN_mode");
	logger.info("dbOperationSepa: Mode = " + mode);
	
	var custom13 = getHeader(map, "PLCN_custom13");
 	logger.info("dbOperationSepa: custom13 = " + custom13);

	var nostroAccountNumber = getHeader(map,"PLCN_nostroAccNo");
	logger.info("dbOperationSepa: nostroAccountNumber = " + nostroAccountNumber);
	
	var custom37 = getHeader(map, "PLCN_custom37");
 	logger.info("dbOperationSepa: custom37 = " + custom37);

 	if(!nostroAccountNumber || !custom37){
  		deriveNostroAccountNumber(exchange);		
 	}
	
  	if(custom13) {
 		msgdbMap.put("CUSTOM13", custom13);
 	}

  	if(nostroAccountNumber) {
 		msgdbMap.put("NOSTRO_ACCOUNT_NUMBER", nostroAccountNumber);
 	}

  	if(custom37) {
 		msgdbMap.put("CUSTOM37", custom37);
 	}

	logger.info("dbOperationSepa: msgType = " + msgType);
	logger.info("dbOperationSepa: msgDirection = " + msgDirection);	 	

	msgType = getHeader(map, "PLCN_msgType");
	msgType = msgType.trim();
	logger.info("dbOperationSepa: msgType = " + msgType);
	logger.info("dbOperationSepa: data type of msgType = " + typeof msgType);

	 var orgnlmsgnmidPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
     var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
     logger.info("dbOperationSepa:orgnlmsgnmid = " + orgnlmsgnmid);
	 
	 if(!orgnlmsgnmid){
		 var orgnlmsgnmidPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
		 var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
		 logger.info("dbOperationSepa:orgnlmsgnmid = " + orgnlmsgnmid);
	 }

 	if(msgType == "pacs.003.001.08" || (msgType == "pacs.004.001.09" && orgnlmsgnmid == "pacs.003.001.08")) {
 		logger.info("dbOperationSepa: In if of pacs.003");
	 	if(msgDirection == "O") {
	 		logger.info("dbOperationSepa: In if of msgDirection == O");
	 		msgdbMap.put("TRANSACTIONTYPE", "D");
	 	}else {
	 		logger.info("dbOperationSepa: In else of msgDirection == O");
	 		msgdbMap.put("TRANSACTIONTYPE", "C");
	 	}
 	}else {
 		logger.info("dbOperationSepa: In else");
	 	if(msgDirection == "I") {
	 		logger.info("dbOperationSepa: In if of msgDirection == I");
	 		msgdbMap.put("TRANSACTIONTYPE", "D");
	 	}else {
	 		logger.info("dbOperationSepa: In else of msgDirection == I");
	 		msgdbMap.put("TRANSACTIONTYPE", "C");
	 	}
 	} 

	institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("dbOperationSepa: institutionId = " + institutionId); 

	tenantName = getHeader(map, "PLCN_tenantName");
	logger.info("dbOperationSepa: tenantName = " + tenantName);

	if(!tenantName){
		var tenantNamePath = institutionId + ".INSTITUTION_DETAILS.TENANT_NAME";
		logger.info("dbOperationSepa: tenantName = " + tenantNamePath);
		tenantName = memTblGetTableValue(map, "INST_PARAM",tenantNamePath);
	logger.info("dbOperationSepa: tenantName = " + tenantName);
	}
	msgdbMap.put("TENANT_NAME", tenantName);

	var msgBlocks = inMsg.getHeaders().get("ACEQ_READ_MSGBLOCKS");
	
	var currency = getHeader(map,"PLCNAPI_currency");
	logger.info("dbOperationSepa: currency = " + currency);
	currency = getHeader(map,"PLCN_currency");
	logger.info("dbOperationSepa: currency = " + currency);
	msgdbMap.put("CURRENCY", currency);
	if(!currency){
		msgdbMap.put("CURRENCY", "EUR");
	}

	sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId);
	logger.info("dbOperationSepa: sourceChannelId = " + sourceChannelId);
	logger.info("dbOperationSepa: channelIdTarget = " + channelIdTarget);

	processId = getHeader(map,"PLCN_processId");
	logger.info("dbOperationSepa: processId = " + processId);

	comments = getHeader(map, "PLCN_txnComments");
	logger.info("dbOperationSepa: comments = " + comments);

	//validMessage = getHeader(map, "PLCN_validMessage");
	var validflag = getHeader(map, "PLCN_validFlag");
	validflag = validflag.toString();
	logger.info("dbOperationSepa: validflag = " + validflag);
	logger.info("dbOperationSepa: typeof validflag = " + typeof validflag);
	
	var queueId = getHeader(map, "PLCN_queueAudit");
	var messageNo = readMsgdb.get("MESSAGENO") 
	logger.info("dbOperationSepa: queueId = " + queueId);
	logger.info("dbOperationSepa: messageNo = " + messageNo);

	var msgDirection = getHeader(map, "PLCN_msgDirection");	
	logger.info("dbOperationSepa: msgDirection = " + msgDirection);

	var mode = getHeader(map,"PLCN_mode");
	logger.info("dbOperationSepa: Message Mode = " + mode);
	
	if(validflag == "true" && msgDirection == "O"){
		//queueId = "PROCDQ";
		logger.info('validflag == "true" && msgDirection == "O"');		
		setHeader(map, "PLCN_queueAudit", "");
	}else if(!queueId) {
		logger.info("dbOperationSepa: !queueId");
		queueId = "SEPABLKQ";
		setHeader(map, "PLCN_queueAudit", queueId);
	}
    var list = new ArrayList();
    var list1 = new ArrayList();
	if(tenantName == "SNTDBK" || tenantName == "PLNT01"){
		logger.info("dbOperationSepa: inside custom SNTD loop ");
		
		var settlementMethod = getHeader(map, "PLCN_settlementMethod");
		logger.info("dbOperationSepa: settlementMethod = " + settlementMethod);
		msgdbMap.put("SETTLEMENTMETHOD", settlementMethod);

		var ttlContractNo = getHeader(map, "PLCN_totalContractNumber");
		logger.info("dbOperationSepa: ttlContractNo = " + ttlContractNo);
		msgdbMap.put("CONTRACT_NUMBER", ttlContractNo);
		
		var lastSanctiondate = getHeader(map, "PLCN_lastSanctiondate");
		logger.info("dbOperationSepa: lastSanctiondate = " + lastSanctiondate);
		msgdbMap.put("LAST_SANCTION_DT", lastSanctiondate);

		msgdbMap.put("MSGSEGR", "AT");

		var sapCr = getHeader(map, "PLCN_sapCr");
		logger.info("dbOperationSepa: sapCr = " + sapCr);
		msgdbMap.put("SAP_CR", sapCr);
		
		var sapDr = getHeader(map, "PLCN_sapDr");
		logger.info("dbOperationSepa: settlementMethod = " + settlementMethod);
		msgdbMap.put("SAP_DR", sapDr);
		
		var subSapCr = getHeader(map, "PLCN_subSapCr");
		logger.info("dbOperationSepa: sapDr = " + sapDr);
		msgdbMap.put("SUB_SAP_CR", subSapCr);
		
		var subSapDr = getHeader(map, "PLCN_subSapDr");
		logger.info("dbOperationSepa: subSapDr = " + subSapDr);
		msgdbMap.put("SUB_SAP_DR", subSapDr);
		
		var aggregateFlag = getHeader(map, "PLCN_aggregateFlag");
		logger.info("dbOperationSepa: aggregateFlag = " + aggregateFlag);
		msgdbMap.put("AGGREGATE_FLAG", aggregateFlag);
		
		var groupinginfoEod = getHeader(map, "PLCN_groupinginfoEod");
		logger.info("dbOperationSepa: groupinginfoEod = " + groupinginfoEod);
		msgdbMap.put("GROUPINGINFO_EOD", groupinginfoEod);
		
		var companyCode = getHeader(map, "PLCN_companyCode");
		logger.info("dbOperationSepa: companyCode = " + companyCode);
		msgdbMap.put("COMPANY_CODE", companyCode);
		
		var txnGrp = getHeader(map, "PLCN_txnGrp");
		logger.info("dbOperationSepa: txnGrp = " + txnGrp);
		msgdbMap.put("TRANSACTIONGROUP", txnGrp);
		
		var processingStage = getHeader(map, "PLCN_processingStage");
		logger.info("dbOperationSepa: processingStage = " + processingStage);
		msgdbMap.put("PROCESSING_STAGE", processingStage);
		
		var comments = getHeader(map, "PLCN_txnComments");
		logger.info("dbOperationSepa: comments = " + comments);
		msgdbMap.put("COMMENTS", comments);
		
		var sender = getHeader(map, "PLCN_sender");
		logger.info("dbOperationSepa: sender = " + sender);
		msgdbMap.put("SENDER", sender);
		
		var receiver = getHeader(map, "PLCN_receiver");
		logger.info("dbOperationSepa: receiver = " + receiver);
		msgdbMap.put("RECEIVER", receiver);
		
    	var Msgblock162 = new HashMap();
		var Msgblock163 = new HashMap();
		var Msgblock164 = new HashMap();
		var Msgblock165 = new HashMap();
		var Msgblock166 = new HashMap();
    	var Msgblock167 = new HashMap();
		var Msgblock169 = new HashMap();
		var Msgblock170 = new HashMap();
		var Msgblock171 = new HashMap();
		var Msgblock172 = new HashMap();
		var Msgblock173 = new HashMap();
		var Msgblock174 = new HashMap(); 
		
		var f001EodMsgDebt = getHeader(map, "PLCN_f001EodMsgDebt");
		logger.info("dbOperationSepa: f001EodMsgDebt = " + f001EodMsgDebt);
		var subF001EodMsgDebt = getHeader(map, "PLCN_subF001EodMsgDebt");
		logger.info("dbOperationSepa: subF001EodMsgDebt = " + subF001EodMsgDebt);
		var fEodMsgDebt = getHeader(map, "PLCN_fEodMsgDebt");
		logger.info("dbOperationSepa: fEodMsgDebt = " + fEodMsgDebt);
		var f001EodMsgCred = getHeader(map, "PLCN_f001EodMsgCred");
		logger.info("dbOperationSepa: f001EodMsgCred = " + f001EodMsgCred);
		var subF001EodMsgCred = getHeader(map, "PLCN_subF001EodMsgCred");
		logger.info("dbOperationSepa: subF001EodMsgCred = " + subF001EodMsgCred);
 		var fEodMsgCred = getHeader(map, "PLCN_fEodMsgCred");
		logger.info("dbOperationSepa: fEodMsgCred = " + fEodMsgCred);
     	var internalBookingEodDebt = getHeader(map, "PLCN_internalBookingEodDebt");
		logger.info("dbOperationSepa: internalBookingEodDebt = " + internalBookingEodDebt);
		var internalBookingEodCred = getHeader(map, "PLCN_internalBookingEodCred");
		logger.info("dbOperationSepa: internalBookingEodCred = " + internalBookingEodCred);
		var chargesF001EodMsgDebt = getHeader(map, "PLCN_chargesF001EodMsgDebt");
		logger.info("dbOperationSepa: chargesF001EodMsgDebt = " + chargesF001EodMsgDebt);
		var chargesF001EodMsgCred = getHeader(map, "PLCN_chargesF001EodMsgCred"); 
		logger.info("dbOperationSepa: chargesF001EodMsgCred = " + chargesF001EodMsgCred);
		var chargesSubF001EodMsgDebt = getHeader(map, "PLCN_chargesSubF001EodMsgDebt"); 
		logger.info("dbOperationSepa: chargesSubF001EodMsgDebt = " + chargesSubF001EodMsgDebt);
		var chargesSubF001EodMsgCred = getHeader(map, "PLCN_chargesSubF001EodMsgCred"); 
		logger.info("dbOperationSepa: chargesSubF001EodMsgCred = " + chargesSubF001EodMsgCred);
		
		if(!f001EodMsgDebt){
			f001EodMsgDebt = "";
		}
		
		if(!subF001EodMsgDebt){
			subF001EodMsgDebt = "";
		}

		if(!fEodMsgDebt){
			fEodMsgDebt = "";
		}

		if(!f001EodMsgCred){
			f001EodMsgCred = "";
		}

		if(!subF001EodMsgCred){
			subF001EodMsgCred = "";
		}
		
		if(!fEodMsgCred){
			fEodMsgCred = "";
		}
		
		if(!internalBookingEodDebt){
			internalBookingEodDebt = "";
		}
		
		if(!internalBookingEodCred){
			internalBookingEodCred = "";
		}
		
		if(!chargesF001EodMsgDebt){
			chargesF001EodMsgDebt = "";
		}
		
		if(!chargesF001EodMsgCred){
			chargesF001EodMsgCred = "";
		}
		
		if(!chargesSubF001EodMsgDebt){
			chargesSubF001EodMsgDebt = "";
		}
		
		if(!chargesSubF001EodMsgCred){
			chargesSubF001EodMsgCred = "";
		}

		logger.info("dbOperationSepa: Adding blocks ");
		Msgblock162.put("MSGBLOCKTYPE", "162");
		Msgblock163.put("MSGBLOCKTYPE", "163");
		Msgblock164.put("MSGBLOCKTYPE", "164");
		Msgblock165.put("MSGBLOCKTYPE", "165");
		Msgblock166.put("MSGBLOCKTYPE", "166");
		Msgblock167.put("MSGBLOCKTYPE", "167");
     	Msgblock169.put("MSGBLOCKTYPE", "169");
		Msgblock170.put("MSGBLOCKTYPE", "170");
		Msgblock171.put("MSGBLOCKTYPE", "171");
		Msgblock172.put("MSGBLOCKTYPE", "172");
		Msgblock173.put("MSGBLOCKTYPE", "173");
		Msgblock174.put("MSGBLOCKTYPE", "174"); 
		
		Msgblock162.put("MSGFAMILY", "FMSG");
		Msgblock163.put("MSGFAMILY", "FMSG");
		Msgblock164.put("MSGFAMILY", "FMSG");
		Msgblock165.put("MSGFAMILY", "FMSG");
		Msgblock166.put("MSGFAMILY", "FMSG");
 		Msgblock167.put("MSGFAMILY", "FMSG");
		Msgblock169.put("MSGFAMILY", "FMSG");
		Msgblock170.put("MSGFAMILY", "FMSG");
		Msgblock171.put("MSGFAMILY", "FMSG");
		Msgblock172.put("MSGFAMILY", "FMSG");
		Msgblock173.put("MSGFAMILY", "FMSG");
		Msgblock174.put("MSGFAMILY", "FMSG"); 
		
		Msgblock162.put("MESSAGE", f001EodMsgDebt);
		Msgblock163.put("MESSAGE", subF001EodMsgDebt);
		Msgblock164.put("MESSAGE", fEodMsgDebt);
		Msgblock165.put("MESSAGE", f001EodMsgCred);
		Msgblock166.put("MESSAGE", subF001EodMsgCred);
		Msgblock167.put("MESSAGE", fEodMsgCred);
 		Msgblock169.put("MESSAGE", internalBookingEodDebt);
		Msgblock170.put("MESSAGE", internalBookingEodCred);
		Msgblock171.put("MESSAGE", chargesF001EodMsgDebt);
		Msgblock172.put("MESSAGE", chargesF001EodMsgCred);
		Msgblock173.put("MESSAGE", chargesSubF001EodMsgDebt);
		Msgblock174.put("MESSAGE", chargesSubF001EodMsgCred); 
		

		
		Msgblock162.put("DISPLAY_FLAG", "N");
		Msgblock163.put("DISPLAY_FLAG", "N");
		Msgblock164.put("DISPLAY_FLAG", "N");
		Msgblock165.put("DISPLAY_FLAG", "N");
		Msgblock166.put("DISPLAY_FLAG", "N");
		Msgblock167.put("DISPLAY_FLAG", "N");
		Msgblock169.put("DISPLAY_FLAG", "N");
		Msgblock170.put("DISPLAY_FLAG", "N");
		Msgblock171.put("DISPLAY_FLAG", "N");
		Msgblock172.put("DISPLAY_FLAG", "N");
		Msgblock173.put("DISPLAY_FLAG", "N");
		Msgblock174.put("DISPLAY_FLAG", "N");

		list.add(Msgblock162);
		list.add(Msgblock163);
		list.add(Msgblock164);
		list.add(Msgblock165);
		list.add(Msgblock166); 		
		list.add(Msgblock167);
		list.add(Msgblock169);
		list.add(Msgblock170);
		list.add(Msgblock171);
		list.add(Msgblock172);
		list.add(Msgblock173);
		list.add(Msgblock174);
		logger.info("dbOperationSepa: list after Msgblock174 = " +list);
		
		logger.info("dbOperationSepa: for msgdb_output ");
		
		var f001Map = new HashMap();
		var f0011Map = new HashMap();
		var coreMap = new HashMap();
		var core2Map = new HashMap();
		var instanceId = "PELICAN1";
		var f001EodStatus = getHeader(map, "PLCN_f001EodStatus");
		logger.info("dbOperationSepa: f001EodStatus = " + f001EodStatus);
		var f0011EodStatus = getHeader(map, "PLCN_f0011EodStatus");
		logger.info("dbOperationSepa: f0011EodStatus = " + f0011EodStatus);
		var coreEodStatus = getHeader(map, "PLCN_coreEodStatus");
		logger.info("dbOperationSepa: coreEodStatus = " + coreEodStatus);
		var core2EodStatus = getHeader(map, "PLCN_core2EodStatus");
		logger.info("dbOperationSepa: core2EodStatus = " + core2EodStatus);
		var eodMsg = getHeader(map, "PLCN_eodMsg");
		logger.info("dbOperationSepa: eodMsg = " + eodMsg);
		var statusasd = getHeader(map, "PLCN_statusasd");
		logger.info("dbOperationSepa: statusasd = " + statusasd);
		var internalEodMsg = getHeader(map, "PLCN_internalEodMsg");
		logger.info("dbOperationSepa: internalEodMsg = " + internalEodMsg);
		
		if(!f001EodStatus){
			f001EodStatus = "Y";
		}
		if(!f0011EodStatus){
			f0011EodStatus = "Y";
		}
		if(!coreEodStatus){
			coreEodStatus = "Y";
		}
		if(!core2EodStatus){
			core2EodStatus = "Y";
		}
		if(!statusasd){
			statusasd = "Y";
		}
		if(!eodMsg){
			eodMsg = "CORE";
		}
		if(!internalEodMsg){
			internalEodMsg = "CORE2";
		}

		var msgId = getHeader(map, "PLCN_msgDbId");
		logger.info("dbOperationSepa: msgId = " + msgId);

		f001Map.put("MSGDB_ID", msgId);
		f0011Map.put("MSGDB_ID", msgId);
		coreMap.put("MSGDB_ID", msgId);
		core2Map.put("MSGDB_ID", msgId);

		f001Map.put("MDBOUT_STATUS", f001EodStatus);
		f0011Map.put("MDBOUT_STATUS", f0011EodStatus);
		if(eodMsg == "F0071"){
		  coreEodStatus = statusasd;
		}
		coreMap.put("MDBOUT_STATUS", coreEodStatus);
		core2Map.put("MDBOUT_STATUS", core2EodStatus);
		
		f001Map.put("MDBOUT_MODE", "F001");
		f0011Map.put("MDBOUT_MODE", "F0011");
		coreMap.put("MDBOUT_MODE", eodMsg);
		core2Map.put("MDBOUT_MODE", internalEodMsg);
		
		list1.add(f0011Map);
		logger.info("dbOperationSepa: list1 after f0011Map= " +list1);
		list1.add(coreMap);
		logger.info("dbOperationSepa: list1 after coreMap= " +list1);
 		list1.add(core2Map);
		logger.info("dbOperationSepa: list1 after core2Map= " +list1); 
		list1.add(f001Map);
		logger.info("dbOperationSepa: list1 after f001Map= " +list1); 

	}

	audit.put("MESSAGENO", messageNo);
	audit.put("QUEUEID", queueId);
	audit.put("APPLICATION","ACEQ_CMP");
	audit.put("MODULENAME","ACEQWRITE");
	audit.put("ACTION","WRITE");
	audit.put("AUDITTEXT","Message number " +  "<" + messageNo + ">" + " read from DB and written into Queue " +  "'" + queueId + "'");
	audit.put("INSTITUTIONID", institutionId);

	var Msgblock1 = new HashMap();
	var Msgblock2 = new HashMap();
	var Msgblock153 = new HashMap();
	var Msgblock154 = new HashMap();
	
	Msgblock1.put("MSGBLOCKTYPE", "1");
	Msgblock2.put("MSGBLOCKTYPE", "2");
	Msgblock153.put("MSGBLOCKTYPE", "153");
	Msgblock154.put("MSGBLOCKTYPE", "154");
	
	var messageString = inMsg.getBody(java.lang.String.class);
	logger.trace("dbOperationSepa: original messageString = " + messageString);
	messageString = messageString.replace(/\n/g, '').replace(/>\s+</g, '><');
	logger.trace("dbOperationSepa: messageString after replace function = " + messageString);
	inMsg.setBody(messageString);

	msgBlock2 = 'CAMEL_EXCHANGE_BODY';

	msgBlock154 = getHeader(map, "ACEDB_MSGBLOCK154");
	logger.trace("dbOperationSepa: ACEDB_MSGBLOCK154 = " + msgBlock154);

	if(msgType === "pacs.002.001.10") {
		msgFamily154 = "XML";

		var validLAU = getHeader(map, "PLCN_validLAU");

		if(validLAU == "false" || validflag == "false") {
			path = institutionId + "." + "MESSAGE_PROCESSING.FUNCTIONALITY.MESSAGE_SEND_TO_MQ" + "." + "PACS.002_MQ"; //PLCNUSNY.MESSAGE_PROCESSING.FUNCTIONALITY.MESSAGE_SEND_TO_MQ.PACS.002_MQ
			config1 = memTblGetTableValue(map, "INST_PARAM", path);
			logger.info("dbOperationSepa: config1 = " + config1);

			if(config1 == 'Y') {
				setHeader(map, "PLCN_config1", true);
			}else {
				setHeader(map, "PLCN_config1", false);
			}
			
			path = institutionId + "." + "MESSAGE_PROCESSING.FUNCTIONALITY.MESSAGE_SEND_TO_MQ" + "." + "PACS.002_STATUS"; //PLCNUSNY.MESSAGE_PROCESSING.FUNCTIONALITY.MESSAGE_SEND_TO_MQ.PACS.002_STATUS
			config2 = memTblGetTableValue(map, "INST_PARAM", path);
			logger.info("dbOperationSepa: config2 = " + config2);

			var queueId = dataBetweenTokens("|", "|", config2);
			logger.info("dbOperationSepa: queueId = " + queueId);

	  		var res = removePattern(config2, queueId);
	  		var status = dataBetweenTokens("||", "|", res);
	  		logger.info("dbOperationSepa: status = " + status);

	  		setHeader(map, "PLCN_queueId", queueId);
	  		setHeader(map, "PLCN_status", status);

	  		if(queueId == "ERRORQ") {
	  			setHeader(map, "PLCN_errqFlag", true);
	  			logger.info("dbOperationSepa: errqFlag = true");
	  		}else {
	  			setHeader(map, "PLCN_errqFlag", false);
	  			logger.info("dbOperationSepa: errqFlag = false");
	  		}

			if(config1 == "Y") {	
			  	setHeader(map, "PLCN_queueId", "TMPMSGQ");
	  			setHeader(map, "PLCN_status", "69");

	  			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				msgdbMap.put("NEXT_WORKFLOW_STATUS", status);

				channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId + "-ERR");

				msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
			}
			setHeader(map, "PLCN_ISOUTPUT", "N");
		}
		setHeader(map, "PLCN_ISOUTPUT", "Y");
	}

	if(msgType === 'pacs.004.001.09') {
		logger.info("dbOperationSepa: msg type is pacs.004.001.09");

		/*var transrefno = getHeader(map, "PLCN_transRefNo");

    	var instrId = getHeader(map, "PLCN_instrId");
    	logger.info('dbOperationSepa: instrId = ' + instrId);

    	var endtoendId = getHeader(map, "PLCN_endToEnd");
    	logger.info('dbOperationSepa: endtoendId = ' + endtoendId);
       	txnCustom2 = endtoendId + "¿" + instrId;
    	logger.info('dbOperationSepa: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepa: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepa: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}*/

		if(validflag == "true") {
			//msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
			//logger.info('dbOperationSepa: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');
			//msgdbMap.put("NEXT_WORKFLOW_STATUS", "84");
			//logger.info('dbOperationSepa: NEXT_WORKFLOW_STATUS = 84');
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
			/*if(msgDirection == 'O'){
				logger.info("Inside if");
				setHeader(map, "PLCN_ISINPUT", "Y");
				setHeader(map, "PLCN_ISOUTPUT", "N");
				setHeader(map,'DISPLAY_FLAG','Y');
			} else {
				logger.info("Inside Else");
				if(mode == 'MQ'){
					logger.info("Inside if");
					setHeader(map, "PLCN_ISINPUT", "Y");
					setHeader(map, "PLCN_ISOUTPUT", "Y");
					setHeader(map,'DISPLAY_FLAG','Y');
				} else {
					logger.info("Inside Second Else");
					setHeader(map, "PLCN_ISINPUT", "N");
					setHeader(map, "PLCN_ISOUTPUT", "Y");
					setHeader(map,'DISPLAY_FLAG','Y');
				}
			}*/
			msgFamily154 = "XML";
		}else {
			var sendMsgMq = memTblGetTableValue(map, "FLAG-TABLE", "SEND_MSG_MQ");
			sendMsgMq = sendMsgMq.trim();
			logger.info('dbOperationSepa: sendMsgMq = ' + sendMsgMq);

			channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId + "-ERR");

			if(sendMsgMq == "Y") {
				sendMsgMq = true;
				setHeader(map, "PLCN_sendMsgMq", sendMsgMq);
				var outputMsgMx = memTblGetTableValue(map, "FLAG-TABLE", "OUTPUT_MSG_MX");
				logger.info('dbOperationSepa: outputMsgMx = ' + outputMsgMx);

				if(outputMsgMx == "Y") {
					logger.info('dbOperationSepa: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = 'CAMEL_EXCHANGE_BODY';
					msgFamily154 = "XML";
				}else {
					logger.trace('dbOperationSepa: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = msgBlocks.get("MSGBLOCK1");
					msgFamily154 = "SWIFT";
				}

				//msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
				//logger.info('dbOperationSepa: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');

				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepa: NEXT_WORKFLOW_STATUS = 102');
			}
    	}
    	logger.info('dbOperationSepa: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
    }

	if(msgType === 'pacs.008.001.08'){
 		
    	var msgId = getHeader(map, "PLCN_msgId");
    	logger.info('dbOperationSepa: msgId = ' + msgId);

    	var txnId = getHeader(map, "PLCN_txnId");
    	logger.info('dbOperationSepa: txnId = ' + txnId);
       	txnCustom2 = msgId + "¿" + txnId;
    	logger.info('dbOperationSepa: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepa: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepa: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		if(validflag === "true") {
			//msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
			//logger.info('dbOperationSepa: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');
			//msgdbMap.put("NEXT_WORKFLOW_STATUS", "84");
			//logger.info('dbOperationSepa: NEXT_WORKFLOW_STATUS = 84');
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
			/*if(msgDirection == 'O'){
				logger.info("Inside if");
				setHeader(map, "PLCN_ISINPUT", "Y");
				setHeader(map, "PLCN_ISOUTPUT", "N");
				setHeader(map,'DISPLAY_FLAG','Y');
			} else {
				logger.info("Inside Else");
				if(mode == 'MQ'){
					logger.info("Inside if");
					setHeader(map, "PLCN_ISINPUT", "Y");
					setHeader(map, "PLCN_ISOUTPUT", "Y");
					setHeader(map,'DISPLAY_FLAG','Y');
				} else {
					logger.info("Inside Second Else");
					setHeader(map, "PLCN_ISINPUT", "N");
					setHeader(map, "PLCN_ISOUTPUT", "Y");
					setHeader(map,'DISPLAY_FLAG','Y');
				}
			}*/ 
			msgFamily154 = "XML";
		}else {
			var sendMsgMq = memTblGetTableValue(map, "FLAG-TABLE", "SEND_MSG_MQ");
			sendMsgMq = sendMsgMq.trim();
			logger.info('dbOperationSepa: sendMsgMq = ' + sendMsgMq);

			channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId + "-ERR");

			if(sendMsgMq == "Y") {
				sendMsgMq = true;
				setHeader(map, "PLCN_sendMsgMq", sendMsgMq);
				var outputMsgMx = memTblGetTableValue(map, "FLAG-TABLE", "OUTPUT_MSG_MX");
				logger.info('dbOperationSepa: outputMsgMx = ' + outputMsgMx);

				if(outputMsgMx == "Y") {
					logger.info('dbOperationSepa: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = 'CAMEL_EXCHANGE_BODY';
					msgFamily154 = "XML";
				}else {
					logger.trace('dbOperationSepa: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = msgBlocks.get("MSGBLOCK1");
					msgFamily154 = "SWIFT";
				}

				//msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
				//logger.info('dbOperationSepa: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');

				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepa: NEXT_WORKFLOW_STATUS = 102');	
			}
		}
		logger.info('dbOperationSepa: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);

		if(!processId){
			processId = "NONE"; //Added by priyanka for bulking testing			
		}
		
		msgdbMap.put("PROCESS_ID", processId); 
	}

	if(msgType === "pacs.009.001.08") {
 		
    	var instrId = getHeader(map, "PLCN_instrId");
    	logger.info('dbOperationSepa: instrId = ' + instrId);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepa: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5); 

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepa: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var endtoendId = getHeader(map, "PLCN_endToEnd");
    	logger.info('dbOperationSepa: endtoendId = ' + endtoendId);
       	txnCustom2 = endtoendId + "¿" + instrId;
    	logger.info('dbOperationSepa: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2);

		if(validflag == "true") {
			//msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
			//logger.info('dbOperationSepa: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');
			//msgdbMap.put("NEXT_WORKFLOW_STATUS", "84");
			//logger.info('dbOperationSepa: NEXT_WORKFLOW_STATUS = 84');
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
			/*if(msgDirection == 'O'){
				logger.info("Inside if");
				setHeader(map, "PLCN_ISINPUT", "Y");
				setHeader(map, "PLCN_ISOUTPUT", "N");
				setHeader(map,'DISPLAY_FLAG','Y');
			} else {
				logger.info("Inside Else");
				if(mode == 'MQ'){
					logger.info("Inside if");
					setHeader(map, "PLCN_ISINPUT", "Y");
					setHeader(map, "PLCN_ISOUTPUT", "Y");
					setHeader(map,'DISPLAY_FLAG','Y');
				} else {
					logger.info("Inside Second Else");
					setHeader(map, "PLCN_ISINPUT", "N");
					setHeader(map, "PLCN_ISOUTPUT", "Y");
					setHeader(map,'DISPLAY_FLAG','Y');
				}
			}*/
			msgFamily154 = "XML";
		}else {
			var sendMsgMq = memTblGetTableValue(map, "FLAG-TABLE", "SEND_MSG_MQ");
			sendMsgMq = sendMsgMq.trim();
			logger.info('dbOperationSepa: sendMsgMq = ' + sendMsgMq);

			channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId + "-ERR");
			logger.info('dbOperationSepa: channelIdTarget = ' + channelIdTarget);

			if(sendMsgMq == "Y") {
				sendMsgMq = true;
				setHeader(map, "PLCN_sendMsgMq", sendMsgMq);
				var outputMsgMx = memTblGetTableValue(map, "FLAG-TABLE", "OUTPUT_MSG_MX");
				logger.info('dbOperationSepa: outputMsgMx = ' + outputMsgMx);

				if(outputMsgMx == "Y") {
					msgBlock154 = 'CAMEL_EXCHANGE_BODY';
					msgFamily154 = "XML";
				}else {
					msgBlock154 = msgBlocks.get("MSGBLOCK1");
					msgFamily154 = "SWIFT";
				}

				//msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
				//logger.info('dbOperationSepa: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');

				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepa: NEXT_WORKFLOW_STATUS = 102');	
			}
		}

		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
 	}

	if(msgType === 'camt.057.001.06') {
		logger.info("dbOperationSepa: msg type is camt.057.001.06");
		//var msgIdPath = "/Document/PmtRtr/GrpHdr/MsgId";
		//var msgId = getValueFromPath(Document, msgIdPath);
		//logger.info("dbOperationSepa: msgId = " + msgId);
	    //msgdbMap.put("TRANSREFNO", msgId);
	    //msgBlock154 = 'CAMEL_EXCHANGE_BODY';

		if(validflag == "true") {
			//msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
			//logger.info('dbOperationSepa: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');
			//msgdbMap.put("NEXT_WORKFLOW_STATUS", "84");
			//logger.info('dbOperationSepa: NEXT_WORKFLOW_STATUS = 84');
			//setHeader(map, "ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
			if(msgDirection == 'O'){
				logger.info("Inside if");
				setHeader(map, "PLCN_ISINPUT", "Y");
				setHeader(map, "PLCN_ISOUTPUT", "N");
				setHeader(map,'DISPLAY_FLAG','Y');
			} else {
				logger.info("Inside Else");
				if(mode == 'MQ'){
					logger.info("Inside if");
					setHeader(map, "PLCN_ISINPUT", "Y");
					setHeader(map, "PLCN_ISOUTPUT", "Y");
					setHeader(map,'DISPLAY_FLAG','Y');
				} else {
					logger.info("Inside Second Else");
					setHeader(map, "PLCN_ISINPUT", "N");
					setHeader(map, "PLCN_ISOUTPUT", "Y");
					setHeader(map,'DISPLAY_FLAG','Y');
				}
			}
			msgFamily154 = "XML";
		}else {
			var sendMsgMq = memTblGetTableValue(map, "FLAG-TABLE", "SEND_MSG_MQ");
			sendMsgMq = sendMsgMq.trim();
			logger.info('dbOperationSepa: sendMsgMq = ' + sendMsgMq);

			channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId + "-ERR");

			if(sendMsgMq == "Y") {
				sendMsgMq = true;
				setHeader(map, "PLCN_sendMsgMq", sendMsgMq);
				var outputMsgMx = memTblGetTableValue(map, "FLAG-TABLE", "OUTPUT_MSG_MX");
				logger.info('dbOperationSepa: outputMsgMx = ' + outputMsgMx);

				if(outputMsgMx == "Y") {
					logger.info('dbOperationSepa: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = 'CAMEL_EXCHANGE_BODY';
					msgFamily154 = "XML";
				}else {
					logger.info('dbOperationSepa: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = msgBlocks.get("MSGBLOCK1");
					msgFamily154 = "SWIFT";
				}

				//msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
				//logger.info('dbOperationSepa: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');

				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepa: NEXT_WORKFLOW_STATUS = 102');
			}
    	}
    	logger.info('dbOperationSepa: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
    }

	if(msgType === 'pacs.003.001.08'){
 		
    	var msgId = getHeader(map, "PLCN_msgId");
    	logger.info('dbOperationSepa: msgId = ' + msgId);

    	var txnId = getHeader(map, "PLCN_txnId");
    	logger.info('dbOperationSepa: txnId = ' + txnId);
       	txnCustom2 = msgId + "¿" + txnId;
    	logger.info('dbOperationSepa: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepa: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepa: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		if(validflag === "true") {
			//msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
			//logger.info('dbOperationSepa: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');
			//msgdbMap.put("NEXT_WORKFLOW_STATUS", "84");
			//logger.info('dbOperationSepa: NEXT_WORKFLOW_STATUS = 84');
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
			/*if(msgDirection == 'O'){
				logger.info("Inside if");
				setHeader(map, "PLCN_ISINPUT", "Y");
				setHeader(map, "PLCN_ISOUTPUT", "N");
				setHeader(map,'DISPLAY_FLAG','Y');
			} else {
				logger.info("Inside Else");
				if(mode == 'MQ'){
					logger.info("Inside if");
					setHeader(map, "PLCN_ISINPUT", "Y");
					setHeader(map, "PLCN_ISOUTPUT", "Y");
					setHeader(map,'DISPLAY_FLAG','Y');
				} else {
					logger.info("Inside Second Else");
					setHeader(map, "PLCN_ISINPUT", "N");
					setHeader(map, "PLCN_ISOUTPUT", "Y");
					setHeader(map,'DISPLAY_FLAG','Y');
				}
			}*/ 
			msgFamily154 = "XML";
		}else {
			var sendMsgMq = memTblGetTableValue(map, "FLAG-TABLE", "SEND_MSG_MQ");
			sendMsgMq = sendMsgMq.trim();
			logger.info('dbOperationSepa: sendMsgMq = ' + sendMsgMq);

			channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId + "-ERR");

			if(sendMsgMq == "Y") {
				sendMsgMq = true;
				setHeader(map, "PLCN_sendMsgMq", sendMsgMq);
				var outputMsgMx = memTblGetTableValue(map, "FLAG-TABLE", "OUTPUT_MSG_MX");
				logger.info('dbOperationSepa: outputMsgMx = ' + outputMsgMx);

				if(outputMsgMx == "Y") {
					logger.info('dbOperationSepa: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = 'CAMEL_EXCHANGE_BODY';
					msgFamily154 = "XML";
				}else {
					logger.trace('dbOperationSepa: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = msgBlocks.get("MSGBLOCK1");
					msgFamily154 = "SWIFT";
				}

				//msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
				//logger.info('dbOperationSepa: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');

				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepa: NEXT_WORKFLOW_STATUS = 102');	
			}
		}
		logger.info('dbOperationSepa: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);

		processId = "NONE"; //Added by priyanka for bulking testing
		msgdbMap.put("PROCESS_ID", processId); 
	}

	if(msgType === 'pacs.007.001.09'){
 		
    	var msgId = getHeader(map, "PLCN_msgId");
    	logger.info('dbOperationSepa: msgId = ' + msgId);

    	var txnId = getHeader(map, "PLCN_txnId");
    	logger.info('dbOperationSepa: txnId = ' + txnId);

    	/*
        var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepa: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepa: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}
        */
        
		b2bPacs007ExtractVar(exchange);
    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);
		var PLCN_custom12 = getHeader(map, "PLCN_custom12");
		var PLCNAPI_custom12 = getHeader(map, "PLCNAPI_custom12");
		//logger.info('dbOperationSepa: pacs007 loop = ' + custom5);
		msgdbMap.put("CUSTOM12", PLCN_custom12);

		if(validflag === "true") {
			//msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
			//logger.info('dbOperationSepa: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');
			//msgdbMap.put("NEXT_WORKFLOW_STATUS", "84");
			//logger.info('dbOperationSepa: NEXT_WORKFLOW_STATUS = 84');
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
			/*if(msgDirection == 'O'){
				logger.info("Inside if");
				setHeader(map, "PLCN_ISINPUT", "Y");
				setHeader(map, "PLCN_ISOUTPUT", "N");
				setHeader(map,'DISPLAY_FLAG','Y');
			} else {
				logger.info("Inside Else");
				if(mode == 'MQ'){
					logger.info("Inside if");
					setHeader(map, "PLCN_ISINPUT", "Y");
					setHeader(map, "PLCN_ISOUTPUT", "Y");
					setHeader(map,'DISPLAY_FLAG','Y');
				} else {
					logger.info("Inside Second Else");
					setHeader(map, "PLCN_ISINPUT", "N");
					setHeader(map, "PLCN_ISOUTPUT", "Y");
					setHeader(map,'DISPLAY_FLAG','Y');
				}
			}*/ 
			msgFamily154 = "XML";
		}else {
			var sendMsgMq = memTblGetTableValue(map, "FLAG-TABLE", "SEND_MSG_MQ");
			sendMsgMq = sendMsgMq.trim();
			logger.info('dbOperationSepa: sendMsgMq = ' + sendMsgMq);

			channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId + "-ERR");

			if(sendMsgMq == "Y") {
				sendMsgMq = true;
				setHeader(map, "PLCN_sendMsgMq", sendMsgMq);
				var outputMsgMx = memTblGetTableValue(map, "FLAG-TABLE", "OUTPUT_MSG_MX");
				logger.info('dbOperationSepa: outputMsgMx = ' + outputMsgMx);

				if(outputMsgMx == "Y") {
					logger.info('dbOperationSepa: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = 'CAMEL_EXCHANGE_BODY';
					msgFamily154 = "XML";
				}else {
					logger.trace('dbOperationSepa: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = msgBlocks.get("MSGBLOCK1");
					msgFamily154 = "SWIFT";
				}

				//msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
				//logger.info('dbOperationSepa: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');

				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepa: NEXT_WORKFLOW_STATUS = 102');	
			}
		}
		logger.info('dbOperationSepa: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);

		if(!processId){
			processId = "NONE"; //Added by priyanka for bulking testing			
		}
		msgdbMap.put("PROCESS_ID", processId); 
	}

	logger.trace("dbOperationSepa: msgBlock2 = " + msgBlock2);
	Msgblock2.put("MESSAGE", msgBlock2.replace(/\n/g, '').replace(/>\s+</g, '><'));
	Msgblock2.put("MSGFAMILY", "XML");
	list.add(Msgblock2);

	var msgDirection = getHeader(map, "PLCN_msgDirection");
	logger.info("dbOperationSepa: msgDirection = " + msgDirection);

	logger.trace("dbOperationSepa: msgBlock154 = " + msgBlock154);
	Msgblock154.put("MESSAGE", msgBlock154);
	if(isPatternPresent(msgBlock154, "xml")) {
		Msgblock154.put("MSGFAMILY", "XML");
	}else {
		Msgblock154.put("MSGFAMILY", "SWIFT");
		Msgblock154.put("DISPLAY_FLAG", "N");
	}
	list.add(Msgblock154);

	msgBlock153 = getHeader(map, "ACEDB_MSGBLOCK153");
	logger.trace("dbOperationSepa: msgBlock153 = " + msgBlock153);

	Msgblock153.put("MESSAGE", msgBlock153);
	if(isPatternPresent(msgBlock153, "xml")) {
		Msgblock153.put("MSGFAMILY", "XML");
	}else {
		Msgblock153.put("MSGFAMILY", "SWIFT");
	}
	list.add(Msgblock153);

	//matching
	if(msgType === 'pacs.002.001.10'){
		var transrefno = getHeader(map, "PLCN_Pacs002transrefNo");
    	msgdbMap.put("TRANSREFNO", transrefno);

		mtchTransrefno = getHeader(map, "PLCN_mtchTransrefno");
		logger.info("dbOperationSepa: mtchTransrefno = " + mtchTransrefno);
		transrefno = getHeader(map, "PLCN_Pacs002transrefNo");
		logger.info("dbOperationSepa: transrefno = " + transrefno);
		txnMtchParam = getHeader(map, "PLCN_txnMtchParam");
		logger.info("dbOperationSepa: txnMtchParam = " + txnMtchParam);

		
		mtchTransrefno1 = "|" + mtchTransrefno + "¿" + transrefno  + txnMtchParam;
		logger.info("dbOperationSepa: mtchTransrefno = " + mtchTransrefno1);
		msgdbMap.put("CUSTOM7", mtchTransrefno1);
		
		/*if(queueId == 'TMPTXVWQ'){
			var txStsPath = "/Document/FIToFIPmtStsRpt/TxInfAndSts/TxSts";
			var txStsVal = getValueFromPath(Document, txStsPath);
			if(txStsVal){
			txStsVal = txStsVal.trim();
		}	
		logger.info("txStsVal: " + txStsVal);
		msgdbMap.put("CUSTOM12", txStsVal);
		}*/
    	
    	var msgFamily = getHeader(map,"MSG_FAMILY");
        msgdbMap.put("MSG_FAMILY", msgFamily);
	}

	//matching
	if(msgType === 'pacs.004.001.09'){
		var transrefno = getHeader(map, "PLCN_Pacs004transrefNo");
		if(!transrefno){
			transRefNo = getHeader(map, "PLCN_txnId");
		}
		var orgMsgIdPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgId';
		var orgMsgId = getValueFromPath(Document, orgMsgIdPath);
		logger.info("dbOperationSepa: orgMsgId Pacs004=" + orgMsgId);
		if(!orgMsgId){
			orgMsgId = getHeader(map, "PLCN_orgMsgType");
			logger.info("dbOperationSepa: orgMsgId Pacs004=" + orgMsgId);
		}
		if(!orgMsgId){
			orgMsgId = getHeader(map, "PLCN_pmtInfId");
			logger.info("dbOperationSepa: orgMsgId Pacs004=" + orgMsgId);
		}
		

		msgDirection = getHeader(map, "PLCN_msgDirection");
	 	logger.info("dbOperationSepa: msgDirection = " + msgDirection);
	 	logger.info("dbOperationSepa: msgDirection type = " + typeof msgDirection);

	 	var msgDirection1;

		if(msgDirection == "O"){
			logger.info("dbOperationSepa: Inside O loop = ");
			msgDirection1 = "I";
		}
		else if(msgDirection == "I"){
			logger.info("dbOperationSepa: inside I loop");
			msgDirection1 = "O";
		}		
		logger.info("dbOperationSepa: msgDirection1 = " + msgDirection1);
		
		orgnlIntrBkSttlmAmt = getHeader(map, "PLCNAPI_priorityAmountNum");
		if(!orgnlIntrBkSttlmAmt){
			orgnlIntrBkSttlmAmt = getHeader(map, "PLCN_priorityAmountNum");
		}
		if(!orgnlIntrBkSttlmAmt){
			orgnlIntrBkSttlmAmt = getHeader(map, "PLCN_priorityAmount");
		}
		if(orgnlIntrBkSttlmAmt && (isPatternPresent(orgnlIntrBkSttlmAmt, '.00'))){
			orgnlIntrBkSttlmAmt = removePattern(orgnlIntrBkSttlmAmt, ".00");
		}
		
		var orgnlTxIdPath = '/Document/PmtRtr/TxInf/OrgnlTxId';
		var orgnlTxId = getValueFromPath(Document, orgnlTxIdPath);
		logger.info("dbOperationSepa: orgnlTxId =" + orgnlTxId); 
		
		var recordGroupType1 = getHeader(map, "PLCN_recordGroupType");
		logger.info("dbOperationSepa: recordGroupType1 = " + recordGroupType1);
		if(!recordGroupType1) {
			recordGroupType1 = "M";
		}
		
		mtchTransrefno = getHeader(map, "PLCN_mtchTransrefno");
		fileOrgMsgId = getHeader(map, "PLCN_fileOrgMsgId");
		logger.info("dbOperationSepa: fileOrgMsgId = " + fileOrgMsgId);
		txnMtchParam = getHeader(map, "PLCN_txnMtchParam");
		
		if(!orgMsgId){
			orgMsgId = getHeader(map, "PLCN_fileOrgMsgId");
			logger.info("dbOperationSepa: orgMsgId Pacs004=" + orgMsgId);
		}
		
		if(!orgMsgId){
			orgMsgIdPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgId';
			orgMsgId = getValueFromPath(Document, orgMsgIdPath);
			logger.info("dbOperationSepa: orgMsgId Pacs004=" + orgMsgId);
		}
		
		mtchTransrefno = "|" + orgMsgId + "¿" + orgnlTxId  + "|" + orgnlIntrBkSttlmAmt + "|" + currency + "|" + msgDirection1 + "|" + recordGroupType1;
		logger.info("dbOperationSepa: mtchTransrefno = " + mtchTransrefno);
		msgdbMap.put("CUSTOM7", mtchTransrefno);
		
		/*var txnRsnCdPath = "/Document/PmtRtr/TxInf/RtrRsnInf/Rsn/Cd";
		var txnRsnCd = getValueFromPath(Document, txnRsnCdPath);
		logger.info("mxPacs004CustomMatchingParams: txnRsn Code = " + txnRsnCd);
		if(txnRsnCd){
			txnRsnCd = txnRsnCd.trim();
		}
		msgdbMap.put("CUSTOM12", txnRsnCd);*/

		if(!custom12){
			custom12 = getHeader(map, "PLCN_custom12");
			logger.info("dbOperationSepa: custom12 matching loop = " + custom12);
			msgdbMap.put("CUSTOM12", custom12);
		}
	}
	
	if(msgType === 'camt.029.001.09'){
		var transrefno = getHeader(map, "PLCN_Camt029transrefNo");
		
		mtchTransrefno = getHeader(map, "PLCN_mtchTransrefno");
		fileOrgMsgId = getHeader(map, "PLCN_fileOrgMsgId");
		txnMtchParam = getHeader(map, "PLCN_txnMtchParam");

		mtchTransrefno = "|" + fileOrgMsgId + "¿" + mtchTransrefno  + txnMtchParam;
		logger.info("dbOperationSepa: mtchTransrefno = " + mtchTransrefno);
		msgdbMap.put("CUSTOM7", mtchTransrefno);
		
		/*if(queueId == 'TMPTXVWQ'){
			var txnRsnCdPath = "/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/CxlStsRsnInf/Rsn/Cd";
			var txnRsnCd = getValueFromPath(Document, txnRsnCdPath);
			logger.info("sepaCamt029CustomMatchingParams: txnRsn Code = " + txnRsnCd);
			if(txnRsnCd){
				txnRsnCd = txnRsnCd.trim();
			}
		}
		msgdbMap.put("CUSTOM12", txnRsnCd);*/
	}

	if(msgType === 'camt.056.001.08'){

    	var msgId = getHeader(map, "PLCN_msgId");
    	logger.info('dbOperationSepa: msgId = ' + msgId);

    	var txnId = getHeader(map, "PLCN_txnId");
    	logger.info('dbOperationSepa: txnId = ' + txnId);
       	txnCustom2 = msgId + "¿" + txnId;
    	logger.info('dbOperationSepa: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2);
    	
		var transrefno = getHeader(map, "PLCN_Camt029transrefNo");
		
		mtchTransrefno = getHeader(map, "PLCN_mtchTransrefno");
		fileOrgMsgId = getHeader(map, "PLCN_fileOrgMsgId");
		txnMtchParam = getHeader(map, "PLCN_txnMtchParam");

		mtchTransrefno = "|" + fileOrgMsgId + "¿" + mtchTransrefno  + txnMtchParam;
		logger.info("dbOperationSepa: mtchTransrefno = " + mtchTransrefno);
		msgdbMap.put("CUSTOM7", mtchTransrefno);
		
		/*if(queueId == 'TMPTXVWQ'){
			var txnRsnCdPath = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/CxlRsnInf/Rsn/Cd";
			var txnRsnCd = getValueFromPath(Document, txnRsnCdPath);
			logger.info("sepaCamt056CustomMatchingParams: txnRsn Code = " + txnRsnCd);
			if(txnRsnCd){
				txnRsnCd = txnRsnCd.trim();
			}
		}
		msgdbMap.put("CUSTOM12", txnRsnCd);*/
	}


	if(msgType === 'pacs.007.001.09'){		
		mtchTransrefno = getHeader(map, "PLCN_mtchTransrefno");
		fileOrgMsgId = getHeader(map, "PLCN_fileOrgMsgId");
		txnMtchParam = getHeader(map, "PLCN_txnMtchParam");

		mtchTransrefno = "|" + fileOrgMsgId + "¿" + mtchTransrefno  + txnMtchParam;
		logger.info("dbOperationSepa: mtchTransrefno = " + mtchTransrefno);
		msgdbMap.put("CUSTOM7", mtchTransrefno);
		
		/*if(queueId == 'TMPTXVWQ'){
			var rsnCdPath = "/Document/FIToFIPmtRvsl/TxInf/RvslRsnInf/Rsn/Cd";
			var rsnCd = getValueFromPath(Document, rsnCdPath);
			if(rsnCd){
				rsnCd = rsnCd.trim();
			}
		}	
		msgdbMap.put("CUSTOM12", rsnCd);*/
		if(!custom12){
			custom12 = getHeader(map, "PLCN_custom12");
			logger.info("dbOperationSepa: custom12 = " + custom12);
			msgdbMap.put("CUSTOM12", custom12);
		}
	}

	var displayFlag =  getHeader(map,"PLCN_displayFlag");
	var processingStage = getHeader(map,"PLCN_processingStage");
	var authLevel = getHeader(map,"PLCN_currentAuthLevel");
	if(!authLevel) {
		authLevel = getHeader(map,"PLCNAPI_currentAuthLevel");
	}
	
	logger.info("dbOperationSepa: PLCN_processingStage = " + processingStage);
	logger.info("dbOperationSepa: PLCN_currentAuthLevel = " + authLevel);
	
	if(processingStage){
		msgdbMap.put("PROCESSING_STAGE", processingStage);
		msgdbMap.put("CURRENT_AUTH_LEVEL", authLevel);

		logger.info("dbOperationSepa: PROCESSING_STAGE & CURRENT_AUTH_LEVEL values have been set to DB");
	}else if(validflag == "true") {
		msgdbMap.put("PROCESSING_STAGE", "FINL");
		logger.info("dbOperationSepa: PROCESSING_STAGE = FINL");
	}

	//var custom11 = getHeader(map, "PLCN_clearingId");
	var custom11 = getHeader(map, "PLCN_clrgIdSet");
	logger.info("dbOperationSepa: custom11 = " + custom11);

	if(custom11) {
		msgdbMap.put("CUSTOM11", custom11);
	}

	//"TO_DATE('09/03/2021 12:00:00', 'MM/DD/YYYY HH24:MI:SS')"
	var custom24 = getHeader(map, "PLCN_custom24");
	logger.info("dbOperationSepa: custom24 = " + custom24);

	if(custom24) {
		custom24 = "TO_DATE('" + custom24 + "', 'MM/DD/YYYY HH24:MI:SS')";
		logger.info("dbOperationSepa: CONSTANT_CUSTOM24 = " + custom24);
		msgdbMap.put("CONSTANT_CUSTOM24", custom24);
	}else {
		msgdbMap.put("CONSTANT_CUSTOM24", "NULL");
		logger.info("dbOperationSepa: CUSTOM24 = NULL");
	}

	var queue = getHeader(map, "PLCN_queueAudit");
	logger.info("dbOperationSepa: queue = " + queue);

	if(queue){
		var stagePath = institutionId + "_" + queue;
		logger.info("dbOperationSepa: stagePath.length = " + stagePath.length);
		if(stagePath){
			stagePath = stagePath.trim();
		}
		logger.info("dbOperationSepa: processingStage Path = " + stagePath);
		var processingStage = memTblGetTableValue(map, "QUEUE",stagePath);
		logger.info("dbOperationSepa: processingStage.length = " + processingStage.length);
		logger.info("dbOperationSepa: processingStage = " + processingStage);
	}

	if(processingStage){
		msgdbMap.put("PROCESSING_STAGE", processingStage);
	}
	var msgdbQueue = getHeader(map, "PLCN_queue");
	logger.info("dbOperationSepa: msgdbQueue = " + msgdbQueue);


	if(queue) {
		if(queue == "TMPMSGQ"){
			setHeader(map, "PLCN_ISOUTPUT", "Y");
		}
		else if(queue == "TXNREPRQ" || queue == "TXNDUPLQ" || queue == "TXNMSGAH" || queue == "TXNHOLDQ" || queue == "ERRORQ"){
			setHeader(map, "PLCN_ISOUTPUT", "N");
		}
	}

	var newPriorityDate = getHeader(map, "PLCN_newPriorityDate");
	logger.info("dbOperationSepa: newPriorityDate = " + newPriorityDate);

	if(newPriorityDate) {
		msgdbMap.put("PRIORITYDATE", newPriorityDate);
	}

	if(msgType === "pacs.008.001.08" ){
		msgdbMap.put("TRANSACTIONGROUP", "CT");	
	}

	if(msgType === 'camt.056.001.08' || msgType === 'camt.029.001.09' || msgType === "pacs.004.001.09"|| msgType === "pacs.007.001.09" ||msgType === "pacs.002.001.10"){
		msgdbMap.put("TRANSACTIONGROUP", "ENI");	
	}

	if(msgType === "pacs.003.001.08" ){
		msgdbMap.put("TRANSACTIONGROUP", "DD");	
	}


	/*var tgKey = msgFamily+"-"+msgType;
	logger.info("dbOperationSepa: tgKey = " + tgKey);

	var transactionGroup = memTblGetTableValue(map, "TRANSACTIONGROUP", tgKey);
	logger.info("dbOperationSepa: transactionGroup = " + transactionGroup);

	if(transactionGroup) {
		transactionGroup = transactionGroup.trim();
		msgdbMap.put("TRANSACTIONGROUP", "EFT");
	}*/
	
	var validMessage = getHeader(map, "PLCN_validMessage");
	logger.trace("dbOperationSepa: validMessage = " + validMessage);

	var responseCdsDoc = getHeader(map, "ACEDB_responseCdsDoc");
	logger.trace("dbOperationSepa: typeof responseCdsDoc = " + typeof responseCdsDoc);
	//logger.trace("dbOperationSepa: responseCdsDoc = " + responseCdsDoc);

	if(responseCdsDoc && isPatternPresent(responseCdsDoc, "<ResponseCds>")) {
		var Msgblock6 = new HashMap();
		Msgblock6.put("MSGBLOCKTYPE", "6");
		Msgblock6.put("MESSAGE", responseCdsDoc);
		Msgblock6.put("MSGFAMILY", "XML");
		//Added by Akshay for DISPLAY_FLAG
		Msgblock6.put("DISPLAY_FLAG", "N");
		list.add(Msgblock6);
	}

	var derivedProductCode = getHeader(map, "PLCN_productCode");
	logger.info("dbOperationSepa: derivedProductCode = " + derivedProductCode);

	if(!derivedProductCode) {
		derivedProductCode = drveProductCode(exchange);
		logger.info("dbOperationSepa: productCode from hazelcast = " + derivedProductCode);
		logger.info("dbOperationSepa: typeof productCode from hazelcast = " + typeof derivedProductCode);
	}else {
		setHeader(map, "PLCN_productCode", derivedProductCode);
	}

	if(derivedProductCode) {
		msgdbMap.put("DERIVED_PRODUCT", derivedProductCode);
	}

	var isInput = getHeader(map, "PLCN_ISINPUT");
	logger.info("dbOperationSepa: isInput = " + isInput);

	if(isInput) {
		msgdbMap.put("ISINPUT",isInput);
	}

	var isOutput = getHeader(map, "PLCN_ISOUTPUT");
	logger.info("dbOperationSepa: isOutput = " + isOutput);

	if(isOutput) {
		msgdbMap.put("ISOUTPUT", isOutput);
	}
	
	msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	msgdbMap.put("DISPLAY_FLAG", "Y");
	msgdbMap.put("COMMENTS", comments);
	msgdbMap.put("INSTANCEID","PELICAN1");
    msgdbMap.put("PROCESS_ID", processId);

	extractMsgDBData(exchange);

    extractSepaMsgDataDbToDbFlow(exchange);

	var origName = getHeader(map, "PLCN_origName");
	logger.info("dbOperationSepa: origName = " + origName);

	if(origName) {
		msgdbMap.put("ORIGNAME", origName);
	}

	var accountDr = getHeader(map, "PLCN_accountDr");
	logger.info("dbOperationSepa: accountDr = " + accountDr);

	/*if(accountDr) {
		msgdbMap.put("ACCOUNT_DR", accountDr);
	}*/

	var accountNumber = getHeader(map, "PLCN_accountNumber");
	logger.info("dbOperationSepa: accountNumber = " + accountNumber);

	if(accountNumber) {
		msgdbMap.put("ACCOUNT_NUMBER", accountNumber);
	}

	var customerAccNo = getHeader(map, "PLCN_customerAccNo");
	logger.info("dbOperationSepa: customerAccNo = " + customerAccNo);

	if(customerAccNo) {
		msgdbMap.put("CUSTOMERACCNO", customerAccNo);
	}

	var customer = getHeader(map, "PLCN_customer");
	logger.info("dbOperationSepa: customer = " + customer);

	if(customer) {
		msgdbMap.put("CUSTOMER", customer);
	}

	var origBankName = getHeader(map, "PLCN_origBankName");
	logger.info("dbOperationSepa: origBankName = " + origBankName);

	if(origBankName) {
		msgdbMap.put("ORIGBANKNAME", origBankName);
	}

	var benBankName = getHeader(map, "PLCN_benBankName");
	logger.info("dbOperationSepa: benBankName = " + benBankName);

	if(benBankName) {
		msgdbMap.put("BENBANKNAME", benBankName);
	}

	var benefName = getHeader(map, "PLCN_benefName");
	logger.info("dbOperationSepa: benefName = " + benefName);

	if(benefName) {
		msgdbMap.put("BENEFNAME", benefName);
	}

	var otherPartyDetails = getHeader(map, "PLCN_otherPartyDetails");
	logger.info("dbOperationSepa: otherPartyDetails = " + otherPartyDetails);

	if(otherPartyDetails) {
		msgdbMap.put("OTHER_PARTY_DETAILS", otherPartyDetails);
	}

	var otherAccno = getHeader(map, "PLCN_otherAccno");
	logger.info("dbOperationSepa: otherAccno = " + otherAccno);

	if(otherAccno) {
		msgdbMap.put("OTHER_ACCNO", otherAccno);
	}

	var accountCr = getHeader(map, "PLCN_accountCr");
	logger.info("dbOperationSepa: accountCr = " + accountCr);

	/*if(accountCr) {
		msgdbMap.put("ACCOUNT_CR", accountCr);
	}*/

	var benBankAddr1 = getHeader(map, "PLCN_benBankAddr1");
	logger.info("dbOperationSepa: benBankAddr1 = " + benBankAddr1);

	if(benBankAddr1) {
		msgdbMap.put("BENBANKADDR1", benBankAddr1);
	}

	var benBankAddr2 = getHeader(map, "PLCN_benBankAddr2");
	logger.info("dbOperationSepa: benBankAddr2 = " + benBankAddr2);

	if(benBankAddr2) {
		msgdbMap.put("BENBANKADDR2", benBankAddr2);
	}

	var benBankAddr3 = getHeader(map, "PLCN_benBankAddr3");
	logger.info("dbOperationSepa: benBankAddr3 = " + benBankAddr3);

	if(benBankAddr3) {
		msgdbMap.put("BENBANKADDR3", benBankAddr3);
	}

	var benBankCity = getHeader(map, "PLCN_benBankCity");
	logger.info("dbOperationSepa: benBankCity = " + benBankCity);

	if(benBankCity) {
		msgdbMap.put("BENBANKCITY", benBankCity);
	}

	var benBankCtry = getHeader(map, "PLCN_benBankCtry");
	logger.info("dbOperationSepa: benBankCtry = " + benBankCtry);

	if(benBankCtry) {
		msgdbMap.put("BENBANKCTRY", benBankCtry);
	}

	var benBankStateCode = getHeader(map, "PLCN_benBankStateCode");
	logger.info("dbOperationSepa: benBankStateCode = " + benBankStateCode);

	if(benBankStateCode) {
		msgdbMap.put("BENBANKSTATECODE", benBankStateCode);
	}

	var benbankzipcode = getHeader(map, "PLCN_benbankzipcode");
	logger.info("dbOperationSepa: benbankzipcode = " + benbankzipcode);

	if(benbankzipcode) {
		msgdbMap.put("BENBANKZIPCODE", benbankzipcode);
	}

	var prevQueue = getHeader(map, "PLCN_prevQueueId");
	logger.info("dbOperationSepa: prevQueue = " + prevQueue);	

    var payerAddr1 = getHeader(map, "PLCN_payerAddr1");
    logger.info("dbOperationSepa: payerAddr1 = " + payerAddr1);

    var payerAddr2 = getHeader(map, "PLCN_payerAddr2");
    logger.info("dbOperationSepa: payerAddr2 = " + payerAddr2);
    
    //Populating data for MSGDB_PAY name/address
    if(msgId){ 	
		msgdbPayMap.put("MSGDB_ID", msgId);
	}
    if(origName){ 	
		msgdbPayMap.put("MDBPAY_ORD_INST_NAME_ADDR1", origName);
	}
    if(payerAddr1){ 	
		msgdbPayMap.put("MDBPAY_ORD_INST_ADDR2", payerAddr1);
	}
    if(payerAddr2){ 	
		msgdbPayMap.put("MDBPAY_ORD_INST_ADDR3", payerAddr2);
	}
	
	logger.info("dbOperationSepa: audit = " + audit);
	logger.info("dbOperationSepa: list1 value = " +list1);

	setHeader(map, "ACEQ_WRITE_MSGDB", msgdbMap);
	setHeader(map, "ACEQ_WRITE_MSGBLOCKS", list);
	setHeader(map, "ACEQ_WRITE_MSGDB_OUTPUT", list1);
    setHeader(map, "ACEQ_WRITE_MSGDB_PAY", msgdbPayMap);
	setHeader(map, "ACEQ_DB_OPERATION", "UPDATE");
	setHeader(map, "GENAUDIT", audit);
	logger.info("dbOperationSepa: ACEQ_WRITE_MSGDB_OUTPUT = " + getHeader(map, "ACEQ_WRITE_MSGDB_OUTPUT"));
	logger.info("dbOperationSepa: ACEQ_WRITE_MSGBLOCKS = " + getHeader(map, "ACEQ_WRITE_MSGBLOCKS"));
	logger.info("dbOperationSepa completed");
}

function dbOperationSepaTxn(exchange) {
	var inMsg;
	var Document;
	var msgdbMap;
	var map;
	var readMsgdb;
	var audit;
	var comments;
	var sourceChannelId;
	var channelIdTarget;
	var validMessage;
	var msgType;
	var processId;
	var custom27;
	var custom17;
	var msgStateMeaning;
	var targetChannelId;
	var institutionId;
	var config1;
	var config2;
	var config3;
	var msgBlock1;
	var msgBlock2;
	var msgBlock6;
	var msgBlock81;
	var msgBlock91;
	var msgBlock99;
	var msgFamily1;
	var msgFamily2;
	var msgFamily81;
	var path;
	var priorityAmount;
	var priorityAmountNum;

	logger.info("In dbOperationSepaTxn");

	inMsg = exchange.getIn();

	//var messageString = inMsg.getBody(java.lang.String.class);
	//logger.info("dbOperationSepaTxn: messageString = " + messageString);

	inMsg = exchange.getIn();
	
	map = inMsg.getHeaders();
	msgdbMap = new HashMap();
	var msgdbPayMap = new HashMap();
	var msgdbPayMap = new HashMap();
	var msgdbCommentsMap = new HashMap();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var stringMessage = inMsg.getBody(java.lang.String.class);
	// logger.info("dbOperationSepaTxn: message = " + message);
	// setHeader(map, "ACEDB_originalBody", message);
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	var msgdbId = getHeader(map, "PLCN_msgDbId");
	logger.info("dbOperationSepaTxn: MSGDB_ID = " + msgdbId);
	if(msgdbId) {
		msgdbMap.put("MSGDB_ID_ORG", msgdbId);
        msgdbMap.put("MSGDB_ID_SOURCE", msgdbId);
	}

	var msgDirection = getHeader(map, "PLCN_msgDirection");
 	logger.info("dbOperationSepaTxn: msgDirection = " + msgDirection);
 	if(msgDirection) {
 		msgdbMap.put("MESSAGEDIRECTION", msgDirection);
 	}

	var mode = getHeader(map,"PLCN_mode");
	logger.info("dbOperationSepaTxn: Mode = " + mode);
	
	var custom13 = getHeader(map, "CUSTOM13");
 	logger.info("dbOperationSepaTxn: custom13 = " + custom13);
  	if(custom13) {
 		msgdbMap.put("CUSTOM13", custom13);
 	}else {
		msgdbMap.put("CUSTOM13", "");
	}

	msgdbMap.put("MSG_MODE_IN", "FILE");

	var sender = getHeader(map, "PLCN_sender");
	var senderPath;
	//sender = getHeader(map, "SENDER");
	logger.info("dbOperationSepaTxn: sender = " + sender);
	if(!sender) {
		senderPath = dataBetweenTokens("<InstgAgt>", "</InstgAgt>", stringMessage);
		sender = dataBetweenTokens("<BICFI>", "</BICFI>", senderPath);
	}

	logger.info("dbOperationSepaTxn: sender from tag = " + sender);
	if(sender) {
		msgdbMap.put("SENDER", sender);
	}else {
		msgdbMap.put("SENDER", "");
	}

	var receiver = getHeader(map, "PLCN_receiver");
	var receiverPath;
	//receiver = getHeader(map, "RECEIVER");
	logger.info("dbOperationSepaTxn: receiver = " + receiver);
	if(!receiver) {
		receiverPath = dataBetweenTokens("<InstdAgt>", "</InstdAgt>", stringMessage);
		receiver = dataBetweenTokens("<BICFI>", "</BICFI>", receiverPath);
	}
	logger.info("dbOperationSepaTxn: receiver from tag = " + receiver);
	if(receiver) {
		msgdbMap.put("RECEIVER", receiver);
	}else {
		msgdbMap.put("RECEIVER", "");
	}

 	// if(msgDirection == "I") {
 	// 	msgdbMap.put("TRANSACTIONTYPE", "D");
 	// }else {
 	// 	msgdbMap.put("TRANSACTIONTYPE", "C");
 	// } 
	var currency = getHeader(map,"PLCNAPI_currency");
	msgdbMap.put("CURRENCY", "EUR");

	var numOfMessages = getHeader(map, "PLCN_numOfMessages");
 	//numOfMessages = getHeader(map,"NUM_OF_MSGS");
 	logger.info("dbOperationSepaTxn: numOfMessages = " + numOfMessages);
 	if(numOfMessages) {
 		msgdbMap.put("NUMOFMESSAGES", numOfMessages);
 	}

	var msgBlocks = inMsg.getHeaders().get("ACEQ_READ_MSGBLOCKS");

	institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("dbOperationSepaTxn: institutionId = " + institutionId);
	if(institutionId){
		msgdbMap.put("INSTITUTIONID", institutionId);
	} 

	sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId);
	logger.info("dbOperationSepaTxn: sourceChannelId = " + sourceChannelId);
	logger.info("dbOperationSepaTxn: channelIdTarget = " + channelIdTarget);

	processId = getHeader(map,"PLCN_processId");
	logger.info("dbOperationSepaTxn: processId = " + processId);

	comments = getHeader(map, "PLCN_txnComments");
	logger.info("dbOperationSepaTxn: comments = " + comments);

	var countryCode = getHeader(map, "PLCN_countryCode");
	logger.info("dbOperationSepaTxn: countryCode = " + countryCode);
	if(countryCode) {
		msgdbMap.put("COUNTRYCODE", countryCode);
	}

	var validflag;
	validflag = getHeader(map, "PLCN_validFlag");
	//validflag = validflag.toString();

	var validMessage = getHeader(map, "PLCN_validMessage");
	logger.info("dbOperationSepaTxn: PLCN_validMessage = " + validMessage);
	if(validMessage == "true") {
		validflag = "true";
	}else {
		validflag = "false";
	}

	logger.info("dbOperationSepaTxn: validflag = " + validflag);
	logger.info("dbOperationSepaTxn: typeof validflag = " + typeof validflag);

	var translatedflag = getHeader(map, "PLCN_translatedMessage");
	logger.info("dbOperationSepaTxn: translatedflag = " + translatedflag);
	
	var mode = getHeader(map,"PLCN_mode");
	logger.info("dbOperationSepaTxn: Message Mode = " + mode);

	msgType = getHeader(map, "PLCN_msgType");
	//msgType = msgType.trim();
	logger.info("dbOperationSepaTxn: msgType = " + msgType);
	logger.info("dbOperationSepaTxn: data type of msgType = " + typeof msgType);
	
	var priorityAmount = getHeader(map, "PLCNAPI_priorityAmount");
	if(!priorityAmount || priorityAmount == ",00"){
		logger.info("dbOperationSepaTxn: inside 1st if loop ");
		priorityAmount = getHeader(map, "PLCN_priorityAmount");
	}
	else if(!priorityAmount){
		logger.info("dbOperationSepaTxn: inside 2nd if loop ");
		priorityAmount = getHeader(map, "PLCN_amount");
	}
	//priorityAmount = getHeader(map, "PRIORITY_AMOUNT");
	/* priorityAmount = getHeader(map, "PLCN_priorityAmount");
	priorityAmount = getHeader(map, "PLCN_amount") */
	logger.info("dbOperationSepaTxn: priorityAmount = " + priorityAmount);
	if(priorityAmount) {
		msgdbMap.put("PRIORITYAMOUNT", priorityAmount);
	}
	
	/* var priorityAmountNum = getHeader(map, "PLCN_amountNum");
	priorityAmountNum = getHeader(map, "PLCN_priorityAmountNum");
	priorityAmountNum = getHeader(map, "PLCNAPI_priorityAmountNum");
	logger.info("dbOperationSepaTxn: priorityAmountNum = " + priorityAmountNum);
	if(priorityAmount) {
		msgdbMap.put("PRIORITYAMOUNTNUM", priorityAmount);
	} */
	
	var priorityAmountNum = getHeader(map, "PLCN_priorityAmountNum");
	logger.info("dbOperationSepaTxn: priorityAmountNum = " + priorityAmountNum);
	if(!priorityAmountNum){
		logger.info("dbOperationSepaTxn: inside 1st if loop ");
		priorityAmountNum = getHeader(map, "PLCNAPI_priorityAmountNum");
	}
	//priorityAmountNum = getHeader(map, "PLCN_amount");
	//priorityAmountNum = getHeader(map, "PLCNAPI_priorityAmountNum");
	else if(!priorityAmountNum){
		logger.info("dbOperationSepaTxn: inside 2nd if loop ");
		priorityAmountNum = getHeader(map, "PLCN_priorityAmount");
	}
	else if(!priorityAmountNum){
		logger.info("dbOperationSepaTxn: inside 3rd if loop ");
		priorityAmountNum = getHeader(map, "PLCN_amount");
	}
	logger.info("dbOperationSepaTxn: priorityAmountNum = " + priorityAmountNum);
	if(priorityAmountNum) {
		msgdbMap.put("PRIORITYAMOUNTNUM", priorityAmountNum);
	}
	
	/* if(msgType === 'pacs.002.001.10'){	
		priorityAmount = getHeader(map, "PLCN_priorityAmount");
		logger.info("dbOperationSepaTxn: priorityAmount = " + priorityAmount);
		setHeader(map, "PLCNAPI_priorityAmountNum", productCode);
		if(priorityAmount) {
			msgdbMap.put("PRIORITYAMOUNT", priorityAmount);
			msgdbMap.put("PRIORITYAMOUNTNUM", priorityAmount);
		}
	} */

	var srcMsgType = getHeader(map, "SRC_PaymentType");
	logger.info("dbOperationSepaTxn: SRC_PaymentType = " + srcMsgType);

	if(validflag === 'false' && translatedflag === 'true'){
		if(srcMsgType === 'SepaPacs.008.001.08'){
			msgType = 'pacs.008.001.08';
		}else if(srcMsgType === 'SepaPacs.004.001.09'){
			msgType = 'pacs.004.001.09';
		}else{
			msgType = getHeader(map, "PLCN_msgType");
		}
	}
	msgType = msgType.trim();
	msgdbMap.put("MESSAGECLASSTYPE", msgType);
	
	var priorityDate = getHeader(map, "PLCN_priorityDate");
	if(!priorityDate){
		priorityDate = getHeader(map, "PLCN_valueDate");
	}else {
		priorityDate = getHeader(map, "PLCNAPI_priorityDate");
	}
	priorityDate = valueDateForFile(exchange);
	logger.info("dbOperationSepaTxn: priorityDate = " + priorityDate);

	if(priorityDate && msgDirection == "I") {
		priorityDate = driveCurrentValueDateRule(exchange, priorityDate);
	}
	logger.info("dbOperationSepaTxn: priorityDate = " + priorityDate);
	
	if(priorityDate) {
		msgdbMap.put("PRIORITYDATE", priorityDate);
	}else {
		msgdbMap.put("PRIORITYDATE", 20230101);
	}

	var msgSegr = getHeader(map, "PLCN_msgSegr");
	logger.info("dbOperationSepaTxn: MsgSegr = " + msgSegr);
	if(msgSegr) {
		msgdbMap.put("MSGSEGR", msgSegr);
	}else {
		msgdbMap.put("MSGSEGR", "DEFAULT");
	}

	//extractSenderRcvrDetails(exchange);

	var correspondent = getHeader(map, "PLCN_customer");
	logger.info("dbOperationSepaTxn: correspondent = " + correspondent);
	if(correspondent) {
		msgdbMap.put("CORRESPONDENT", correspondent);
	}

	//msgdbMap.put("MSGSEGR", "DEFAULT");

	var transrefno = getHeader(map, "PLCN_txnId");
	if(!transrefno) {
		transrefno = getHeader(map, "PLCNAPI_transRefNo");
	}
	logger.info("dbOperationSepaTxn: transrefno = " + transrefno);
	if(transrefno){
		msgdbMap.put("TRANSREFNO", transrefno);
	}

	var key;
	if(institutionId) {
		key  = institutionId.concat(".PROCESSING_LEVEL.PRODUCTS");
	}
	logger.info("dbOperationSepaTxn: Key = " + key);
	var processingLevel = memTblGetTableValue(map, "INST_PARAM", key);
	logger.info("dbOperationSepaTxn: Processing Level = " + processingLevel);

	if(msgType == 'pacs.002.001.10' && translatedflag == 'true'){
		validflag = 'true';
	}

	var queueId = getHeader(map, "PLCN_transactionQueue");
	
	if(validflag === "true"){
		logger.info('validflag == "true" && msgDirection == "O"');		
		setHeader(map, "PLCN_queueAudit", "");
		if(!queueId && (msgType == 'pacs.008.001.08' || msgType == 'pacs.004.001.09'|| msgType =='pacs.003.001.08' || msgType =='pacs.007.001.09' || msgType == 'camt.056.001.08' || msgType == 'camt.029.001.09')) {
			logger.info("dbOperationSepaTxn: !queueId if part");
			if(processingLevel !== 'MESSAGE') {
				queueId = "TMPTXVWQ";
				setHeader(map, "PLCN_queue", queueId);
				//setHeader(map, "PLCN_txnQueueId", queueId);
				setHeader(map, "PLCN_queueAudit", queueId);
			}else {
				queueId = "SEPATXNQ";
				setHeader(map, "PLCN_queue", queueId);
				//setHeader(map, "PLCN_txnQueueId", queueId);
				setHeader(map, "PLCN_queueAudit", queueId);
				//setHeader(map,"PLCN_processId", "TO-MATCH");
			}
		}else {
			logger.info("dbOperationSepaTxn: !queueId");
			queueId = "TEMPSTSQ";
			setHeader(map, "PLCN_queue", queueId);
			//setHeader(map, "PLCN_txnQueueId", queueId);
			setHeader(map, "PLCN_queueAudit", queueId);
		}	
	}else {
		if(msgType == 'pacs.008.001.08' || msgType == 'pacs.004.001.09' || msgType == 'pacs.002.001.10' || msgType =='pacs.003.001.08' || msgType =='pacs.007.001.09' || msgType == 'camt.056.001.08' || msgType == 'camt.029.001.09') {
			logger.info("dbOperationSepaTxn: !queueId else part");
			queueId = "TMPCXLWQ";
			setHeader(map, "PLCN_queue", queueId);
			//setHeader(map, "PLCN_txnQueueId", queueId);
			setHeader(map, "PLCN_queueAudit", queueId);
	   }
		//else {
		// 	logger.info("dbOperationSepaTxn: !queueId");
		// 	queueId = "TEMPSTSQ";
		// 	setHeader(map, "PLCN_queue", queueId);
		// 	//setHeader(map, "PLCN_txnQueueId", queueId);
		// 	setHeader(map, "PLCN_queueAudit", queueId);
		// }
	}

	// var thresholdBreach = getHeader(map, "PLCN_txnThresholdBreach");
	// logger.info("dbOperationSepaTxn: thresholdBreach = " + thresholdBreach);

	// if(thresholdBreach == "YES") {
	// 	queueId = getHeader(map, "PLCN_authTxnqueueId");
	// }else {
	// 	queueId = getHeader(map, "PLCN_queueAudit");
	// }	

	 queueId = getHeader(map, "PLCN_txnQId");
	// queueId = getHeader(map, "PLCN_queue");
	if(!queueId) {
    	queueId = getHeader(map, "PLCN_queueAudit");
	//queueId = getHeader(map, "PLCN_txnQId");

	}
	var futureDateFlag = getHeader(map, "PLCN_futureDate");
	logger.info("dbOperationSepaTxn: futureDateFlag = " + futureDateFlag);

	if(futureDateFlag == true && processingLevel !== "MESSAGE" && msgDirection == "I"){
		queueId = "MSGHOLDQ";
		comments = "P114-1:A00:114-6013";
	}

	logger.info("dbOperationSepaTxn: queueId = " + queueId);	

	if(queueId){
		msgdbMap.put("QUEUEID", queueId);
	}else {
		msgdbMap.put("QUEUEID", "ERRFILEQ");
	}
	setHeader(map, "PLCN_ePQueueId", queueId);

	var status = getHeader(map, "PLCN_status");
	//status =  getHeader(map, "PLCN_txnStatus");
	//status = "66";
	logger.info("dbOperationSepaTxn: status = " + status);

	if(validflag === "true"){
		status = "66";
	}else if(processingLevel !== "MESSAGE"){
		status = "66";
	}else {
		status = "102";
	}
	msgdbMap.put("STATUS", status);
	setHeader(map, "PLCN_ePStatus", status);

	// if(msgType == "pacs.003.001.08" || msgType == 'pacs.007.001.09') {
 // 		msgdbMap.put("TRANSACTIONTYPE", "C");
 // 	}else {
 // 		msgdbMap.put("TRANSACTIONTYPE", "D");
 // 	}

     var orgnlmsgnmidPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
     var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
     logger.info("dbOperationSepaTxn:orgnlmsgnmid = " + orgnlmsgnmid);
	 
	 if(!orgnlmsgnmid){
		 var orgnlmsgnmidPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
		 var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
		 logger.info("dbOperationSepaTxn:orgnlmsgnmid = " + orgnlmsgnmid);
	 }
 	if(msgType == "pacs.003.001.08" || (msgType == "pacs.004.001.09" && orgnlmsgnmid == "pacs.003.001.08")) {
 		logger.info("dbOperationSepaTxn: In if of pacs.003");
	 	if(msgDirection == "O") {
	 		logger.info("dbOperationSepaTxn: In if of msgDirection == O");
	 		msgdbMap.put("TRANSACTIONTYPE", "D");
	 	}else {
	 		logger.info("dbOperationSepaTxn: In else of msgDirection == O");
	 		msgdbMap.put("TRANSACTIONTYPE", "C");
	 	}
 	}else {
 		logger.info("dbOperationSepaTxn: In else");
	 	if(msgDirection == "I") {
	 		logger.info("dbOperationSepaTxn: In if of msgDirection == I");
	 		msgdbMap.put("TRANSACTIONTYPE", "D");
	 	}else {
	 		logger.info("dbOperationSepaTxn: In else of msgDirection == I");
	 		msgdbMap.put("TRANSACTIONTYPE", "C");
	 	}
 	} 

	// if(processingLevel == 'MESSAGE') {
	// 	msgdbMap.put("QUEUEID", "SEPAINQ");
	// 	setHeader(map, "PLCN_txnQueueId", "SEPAINQ");
	// 	msgdbMap.put("STATUS", "69");
	// 	setHeader(map, "PLCN_txnStatus", "69");
	// }

	var message = inMsg.getBody(java.lang.String.class);

	var list = new ArrayList();

	var Msgblock1 = new HashMap();
	var Msgblock2 = new HashMap();
	var Msgblock6 = new HashMap();
	var Msgblock81 = new HashMap();
	var Msgblock95 = new HashMap();
	var Msgblock99 = new HashMap();

	Msgblock1.put("MSGBLOCKTYPE", "1");
	Msgblock2.put("MSGBLOCKTYPE", "2");
	Msgblock6.put("MSGBLOCKTYPE", "6");
	Msgblock81.put("MSGBLOCKTYPE", "81");
	Msgblock95.put("MSGBLOCKTYPE", "95");
	Msgblock99.put("MSGBLOCKTYPE", "99");

	//Added by Akshay for display flag
	Msgblock1.put("DISPLAY_FLAG", "Y");
	Msgblock2.put("DISPLAY_FLAG", "Y");
	Msgblock6.put("DISPLAY_FLAG", "N");
	Msgblock81.put("DISPLAY_FLAG", "N");
	Msgblock95.put("DISPLAY_FLAG", "Y");
	Msgblock99.put("DISPLAY_FLAG", "Y");

	msgBlock81 = message;
	//logger.trace("dbOperationSepaTxn: msgBlock81 = " + msgBlock81);

	var block91;
	var translatedBody = getHeader(map, "ACEDB_translatedPacs002");
	//logger.trace("dbOperationSepaTxn: translatedBody = " + translatedBody);

	var translationFlag = getHeader(map, "PLCN_translationFlag");
	logger.info("dbOperationSepaTxn: translationFlag = " + translationFlag);


	if(validflag === 'false' && processingLevel !== 'MESSAGE') {
		msgBlock95 = translatedBody;
	}else {
		msgBlock95 = "";
	}
	msgBlock99 = "";

	setHeader(map, "ACEDB_translatedPacs002", "");

	//logger.trace("dbOperationSepaTxn: msgBlock95 = " + msgBlock95);

	var responseCdsDoc = getHeader(map, "ACEDB_responseCdsDoc");
	logger.info("dbOperationSepaTxn: typeof responseCdsDoc = " + typeof responseCdsDoc);
	//logger.trace("dbOperationSepaTxn: responseCdsDoc = " + responseCdsDoc);

	if(responseCdsDoc && isPatternPresent(responseCdsDoc, "<ResponseCds>")) {
		var Msgblock6 = new HashMap();
		Msgblock6.put("MSGBLOCKTYPE", "6");
		Msgblock6.put("MESSAGE", responseCdsDoc);
		Msgblock6.put("MSGFAMILY", "XML");
		Msgblock6.put("DISPLAY_FLAG", "N");
		list.add(Msgblock6);
	}

	if(validflag == 'false') {
		if(!comments) {
			msgdbMap.put("COMMENTS", "P00-1:A00:00-8000");
		}else {
			msgdbMap.put("COMMENTS", comments);
		}
	}else {
		msgdbMap.put("COMMENTS", "");
	}

	var numOfTxn = getHeader(map, "PLCN_custom21");
	if(!numOfTxn) {
		numOfTxn = readMsgdb.get("CUSTOM21");
	}
	logger.info("dbOperationSepaTxn: numOfTxn = " + numOfTxn);

	var amountPath;
	var txnAmount;
	var txnBatchAmonut = 0;

	if(msgType === 'pacs.002.001.10'){
 		
    	var msgId = getHeader(map, "Plcn_FileTxnMsgDBID");
    	logger.info('dbOperationSepaTxn: msgId = ' + msgId);

    	var txnId = getHeader(map, "PLCN_txnId");
    	logger.info('dbOperationSepaTxn: txnId = ' + txnId);
       	txnCustom2 = msgId + "¿" + txnId;
    	logger.info('dbOperationSepaTxn: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepaTxn: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepaTxn: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		amountPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt';
		txnAmount = getValueFromPath(Document, amountPath);
		logger.info('dbOperationSepaTxn: txnAmount = ' + txnAmount);
		txnBatchAmonut += txnAmount;
		setHeader(map, "PLCN_txnBatchAmount", txnBatchAmonut);
		msgdbMap.put("PRIORITYAMOUNT", txnAmount);
		msgdbMap.put("PRIORITYAMOUNTNUM", txnAmount);

		if(validflag === "true") {
			if(processingLevel !== 'MESSAGE') {
				if(queueId) {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				}else {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TEMPSTSQ");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = TEMPSTSQ');
				}
				var txnStatus = getHeader(map, "PLCN_txnStatus");
				if(txnStatus) {
					msgdbMap.put("NEXT_WORKFLOW_STATUS", txnStatus);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = ' + txnStatus);
				} else {   
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');
				}
			}else {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "SEPATXNQ");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = SEPATXNQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');
			}	
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
			//msgFamily154 = "XML";
			msgBlock1 = dataBetweenTokens("<TxInfAndSts>", "</TxInfAndSts>", message);
			msgBlock1 = "<TxInfAndSts>" + msgBlock1 + "</TxInfAndSts>";
			msgBlock1 = msgBlock1.toString();
			msgBlock2 = msgBlock1;
			//logger.info("dbOperationSepaTxn: msgBlock1 = " + msgBlock1);
			msgFamily1 = "XML";
			msgFamily2 = "XML";
		}else {
			if(queueId) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				}else {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TEMPSTSQ");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = TEMPSTSQ');
				}
				var txnStatus = getHeader(map, "PLCN_txnStatus");
				if(txnStatus) {
					msgdbMap.put("NEXT_WORKFLOW_STATUS", txnStatus);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = ' + txnStatus);
				} else {   
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 102');
				}

			msgBlock1 = dataBetweenTokens("<TxInfAndSts>", "</TxInfAndSts>", message);
			msgBlock1 = "<TxInfAndSts>" + msgBlock1 + "</TxInfAndSts>";
			msgBlock1 = msgBlock1.toString();
			msgBlock2 = msgBlock1;
			//logger.info("dbOperationSepaTxn: msgBlock1 = " + msgBlock1);
			msgFamily1 = "XML";
			msgFamily2 = "XML";
		}
		logger.info('dbOperationSepaTxn: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	}

	if(msgType === 'pacs.004.001.09') {
		logger.info("dbOperationSepaTxn: msg type is pacs.004.001.09");		
		/* if(!priorityDate && msgType == 'pacs.004.001.09'){
			var priorityDatePath = '/Document/PmtRtr/GrpHdr/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, priorityDatePath);
			logger.info("dbOperationSepaFile: priorityDate =" + priorityDate);
			priorityDate = replaceAllPattern(priorityDate, "-", "");
			msgdbMap.put("PRIORITYDATE", priorityDate);
		} */

		amountPath = '/Document/PmtRtr/TxInf/OrgnlIntrBkSttlmAmt';
		txnAmount = getValueFromPath(Document, amountPath);
		logger.info('dbOperationSepaTxn: txnAmount = ' + txnAmount);
		setHeader(map, "PLCNAPI_priorityAmountNum", txnAmount);
		txnBatchAmonut += txnAmount;
		setHeader(map, "PLCN_txnBatchAmount", txnBatchAmonut);
		msgdbMap.put("PRIORITYAMOUNT", txnAmount);
		msgdbMap.put("PRIORITYAMOUNTNUM", txnAmount);

		var txnIdPath = '/Document/PmtRtr/TxInf/RtrId';
		var txnId = getValueFromPath(Document, txnIdPath);
    	logger.info('dbOperationSepaTxn: txnId = ' + txnId);
		if(txnId) {
			msgdbMap.put("TRANSREFNO", txnId); //temporary fixed
		}

		if(validflag === "true") {
			if(processingLevel != 'MESSAGE') {
				if(queueId) {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				}else {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPTXVWQ");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = TMPTXVWQ');
				}
				var txnStatus = getHeader(map, "PLCN_txnStatus");
				if(txnStatus) {
					msgdbMap.put("NEXT_WORKFLOW_STATUS", txnStatus);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = ' + txnStatus);
				} else {   
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');
				}
			}else {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "SEPATXNQ");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = SEPATXNQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');
			}	
		}else {
			if(queueId) {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				}else {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPCXLWQ");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = TMPCXLWQ');
				}
				var txnStatus = getHeader(map, "PLCN_txnStatus");
				if(txnStatus) {
					msgdbMap.put("NEXT_WORKFLOW_STATUS", txnStatus);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = ' + txnStatus);
				} else {   
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 102');
				}
    	}
		msgFamily81 = "XML";
		msgBlock1 = dataBetweenTokens("<TxInf>", "</TxInf>", message);
		msgBlock1 = "<TxInf>" + msgBlock1 + "</TxInf>";
		msgBlock1 = msgBlock1.toString();
		msgBlock2 = msgBlock1;
		//logger.info("dbOperationSepaTxn: msgBlock1 = " + msgBlock1);
		msgFamily1 = "XML";
		msgFamily2 = "XML";

		var OrgnlFlag = getHeader(map, "PLCN_orgnlGrpInfo");
		logger.info('dbOperationSepaTxn: OrgnlFlag = ' + OrgnlFlag);

		block91 = dataBetweenTokens("<OrgnlGrpInf>", "</OrgnlGrpInf>", message);
		block91 = "<OrgnlGrpInf>" + block91 + "</OrgnlGrpInf>";
		block91 = block91.toString();
		
		//logger.info("dbOperationSepaTxn: block91 = " + block91);

		var OrgnlGrpInf1 = isXmlNodePresent4(Document, "TxInf", "OrgnlGrpInf");
		logger.info('dbOperationSepaTxn: GgrpHdr OrgnlGrpInf1 = ' + OrgnlGrpInf1);

		var OrgnlGrpInfFlag;
		if(block91 && !OrgnlFlag && OrgnlGrpInf1 == false) {
			OrgnlGrpInfFlag = true;
		}else {
			OrgnlGrpInfFlag = false;
		}
		setHeader(map, "PLCN_orgnlGrpInfo", OrgnlGrpInfFlag);


		// var OrgnlGrpInf1 = isXmlNodePresent4(Document, "PmtRtr", "OrgnlGrpInf");
		// logger.info('dbOperationSepaTxn: GgrpHdr OrgnlGrpInf1 = ' + OrgnlGrpInf1);

		if(OrgnlGrpInfFlag == true){
			setHeader(map, "PLCN_block91", block91);
			setHeader(map, "PLCN_orgnlGrpInfo", false)
		}else {
			setHeader(map, "PLCN_block91", "");
		}

    	logger.info('dbOperationSepaTxn: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
    }

	if(msgType === 'pacs.008.001.08'){
		
		/* if(!priorityDate ){
			var priorityDatePath = '/Document/FIToFICstmrCdtTrf/GrpHdr/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, priorityDatePath);
			logger.info("dbOperationSepaFile: priorityDate =" + priorityDate); 
			priorityDate = replaceAllPattern(priorityDate, "-", "");
			msgdbMap.put("PRIORITYDATE", priorityDate);
		} */
 		
    	//var msgId = getHeader(map, "Plcn_FileTxnMsgDBID");
    	var msgId = getHeader(map, "PLCN_msgId");
    	logger.info('dbOperationSepaTxn: msgId = ' + msgId);

    	var txnId = getHeader(map, "PLCN_txnId");
    	logger.info('dbOperationSepaTxn: txnId = ' + txnId);
       	txnCustom2 = msgId + "¿" + txnId;
		//txnCustom2 = msgId;
    	logger.info('dbOperationSepaTxn: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepaTxn: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepaTxn: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		amountPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt';
		txnAmount = getValueFromPath(Document, amountPath);
		logger.info('dbOperationSepaTxn: txnAmount = ' + txnAmount);
		txnBatchAmonut += txnAmount;
		setHeader(map, "PLCN_txnBatchAmount", txnBatchAmonut);
		msgdbMap.put("PRIORITYAMOUNT", txnAmount);
		msgdbMap.put("PRIORITYAMOUNTNUM", txnAmount);

		if(validflag === "true") {
			if(processingLevel != 'MESSAGE') {
				if(queueId) {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				}else {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPTXVWQ");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = TMPTXVWQ');
				}
				var txnStatus = getHeader(map, "PLCN_txnStatus");
				if(txnStatus) {
					msgdbMap.put("NEXT_WORKFLOW_STATUS", txnStatus);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = ' + txnStatus);
				} else {   
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');
				}
			}else {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "SEPATXNQ");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = SEPATXNQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');	
			}	
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
			//msgFamily154 = "XML";
		}else {
			if(queueId) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				}else {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPCXLWQ");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = TMPCXLWQ');
				}
				var txnStatus = getHeader(map, "PLCN_txnStatus");
				if(txnStatus) {
					msgdbMap.put("NEXT_WORKFLOW_STATUS", txnStatus);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = ' + txnStatus);
				} else {   
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');
				}
		}
		msgBlock1 = dataBetweenTokens("<CdtTrfTxInf>", "</CdtTrfTxInf>", message);
		msgBlock1 = "<CdtTrfTxInf>" + msgBlock1 + "</CdtTrfTxInf>";
		msgBlock1 = msgBlock1.toString();
		msgBlock2 = msgBlock1;
		//logger.info("dbOperationSepaTxn: msgBlock1 = " + msgBlock1);
		msgFamily1 = "XML";
		msgFamily2 = "XML";
		logger.info('dbOperationSepaTxn: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	}

	if(msgType === 'pacs.003.001.08'){
		
		var msgIdPath = '/Document/FIToFICstmrDrctDbt/GrpHdr/MsgId';
		var msgIdValue = getValueFromPath(Document, msgIdPath);
		logger.info('dbOperationSepaTxn: msgIdValue = ' + msgIdValue);
		setHeader(map, "PLCN_msgId", msgIdValue);
 		
    	//var msgId = getHeader(map, "Plcn_FileTxnMsgDBID");
		var txIdPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/PmtId/TxId';
		var txIdValue = getValueFromPath(Document, txIdPath);
		logger.info('dbOperationSepaTxn: txIdValue = ' + txIdValue);
		setHeader(map, "PLCN_txnId", txIdValue);
		if(txIdValue) {
			msgdbMap.put("TRANSREFNO", txIdValue); //temporary fixed
		}
		
    	var msgId = getHeader(map, "PLCN_msgId");
    	logger.info('dbOperationSepaTxn: msgId = ' + msgId);

    	var txnId = getHeader(map, "PLCN_txnId");
    	logger.info('dbOperationSepaTxn: txnId = ' + txnId);
		msgdbMap.put("TRANSREFNO", txnId);
		
       	txnCustom2 = msgId + "¿" + txnId;
		//txnCustom2 = msgId;
    	logger.info('dbOperationSepaTxn: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepaTxn: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepaTxn: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		amountPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/IntrBkSttlmAmt';
		txnAmount = getValueFromPath(Document, amountPath);
		logger.info('dbOperationSepaTxn: txnAmount = ' + txnAmount);
		txnBatchAmonut += txnAmount;
		setHeader(map, "PLCN_txnBatchAmount", txnBatchAmonut);
		msgdbMap.put("PRIORITYAMOUNT", txnAmount);
		msgdbMap.put("PRIORITYAMOUNTNUM", txnAmount);

		if(validflag === "true") {
			if(processingLevel != 'MESSAGE') {
				if(queueId) {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				}else {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPTXVWQ");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = TMPTXVWQ');
				}
				var txnStatus = getHeader(map, "PLCN_txnStatus");
				if(txnStatus) {
					msgdbMap.put("NEXT_WORKFLOW_STATUS", txnStatus);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = ' + txnStatus);
				} else {   
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');
				}
			}else {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "SEPAINQ");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = SEPAINQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');	
			}	
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
			//msgFamily154 = "XML";
		}else {
			if(queueId) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				}else {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPCXLWQ");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = TMPCXLWQ');
				}
				var txnStatus = getHeader(map, "PLCN_txnStatus");
				if(txnStatus) {
					msgdbMap.put("NEXT_WORKFLOW_STATUS", txnStatus);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = ' + txnStatus);
				} else {   
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');
				}
		}
		msgBlock1 = dataBetweenTokens("<DrctDbtTxInf>", "</DrctDbtTxInf>", message);
		msgBlock1 = "<DrctDbtTxInf>" + msgBlock1 + "</DrctDbtTxInf>";
		msgBlock1 = msgBlock1.toString();
		msgBlock2 = msgBlock1;
		//logger.info("dbOperationSepaTxn: msgBlock1 = " + msgBlock1);
		msgFamily1 = "XML";
		msgFamily2 = "XML";
		logger.info('dbOperationSepaTxn: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	}
	
	if(msgType === 'pacs.007.001.09'){
		
		/* if(!priorityDate ){
			var priorityDatePath = '/Document/FIToFICstmrCdtTrf/GrpHdr/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, priorityDatePath);
			logger.info("dbOperationSepaFile: priorityDate =" + priorityDate); 
			priorityDate = replaceAllPattern(priorityDate, "-", "");
			msgdbMap.put("PRIORITYDATE", priorityDate);
		} */
 		
    	//var msgId = getHeader(map, "Plcn_FileTxnMsgDBID");
    	var msgId = getHeader(map, "PLCN_msgId");
    	logger.info('dbOperationSepaTxn: msgId = ' + msgId);

    	var txnId = getHeader(map, "PLCN_txnId");
    	logger.info('dbOperationSepaTxn: txnId = ' + txnId);
       	txnCustom2 = msgId + "¿" + txnId;
		//txnCustom2 = msgId;
    	logger.info('dbOperationSepaTxn: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepaTxn: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepaTxn: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var txIdPath = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxId';
		var txIdValue = getValueFromPath(Document, txIdPath);
		logger.info('dbOperationSepaTxn: txIdValue = ' + txIdValue);
		setHeader(map, "PLCN_txnId", txIdValue);
		if(txIdValue) {
			msgdbMap.put("TRANSREFNO", txIdValue); 
		}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		amountPath = '/Document/FIToFIPmtRvsl/TxInf/OrgnlIntrBkSttlmAmt';
		txnAmount = getValueFromPath(Document, amountPath);
		logger.info('dbOperationSepaTxn: txnAmount = ' + txnAmount);
		txnBatchAmonut += txnAmount;
		setHeader(map, "PLCN_txnBatchAmount", txnBatchAmonut);
		msgdbMap.put("PRIORITYAMOUNT", txnAmount);
		msgdbMap.put("PRIORITYAMOUNTNUM", txnAmount);

		if(validflag === "true") {
			if(processingLevel != 'MESSAGE') {
				if(queueId) {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				}else {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPTXVWQ");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = TMPTXVWQ');
				}
				var txnStatus = getHeader(map, "PLCN_txnStatus");
				if(txnStatus) {
					msgdbMap.put("NEXT_WORKFLOW_STATUS", txnStatus);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = ' + txnStatus);
				} else {   
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');
				}
			}else {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "SEPAINQ");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = SEPAINQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');	
			}	
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
			//msgFamily154 = "XML";
		}else {
			if(queueId) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				}else {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPCXLWQ");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = TMPCXLWQ');
				}
				var txnStatus = getHeader(map, "PLCN_txnStatus");
				if(txnStatus) {
					msgdbMap.put("NEXT_WORKFLOW_STATUS", txnStatus);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = ' + txnStatus);
				} else {   
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');
				}
		}
		msgBlock1 = dataBetweenTokens("<TxInf>", "</TxInf>", message);
		msgBlock1 = "<TxInf>" + msgBlock1 + "</TxInf>";
		msgBlock1 = msgBlock1.toString();
		msgBlock2 = msgBlock1;
	//	logger.info("dbOperationSepaTxn: msgBlock1 = " + msgBlock1);
		msgFamily1 = "XML";
		msgFamily2 = "XML";
		block91 = dataBetweenTokens("<OrgnlGrpInf>", "</OrgnlGrpInf>", message);
		block91 = "<OrgnlGrpInf>" + block91 + "</OrgnlGrpInf>";
		block91 = block91.toString();
		//logger.info("dbOperationSepaTxn: block91 = " + block91);
		setHeader(map, "PLCN_block91", block91);
		logger.info('dbOperationSepaTxn: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	}

	if(msgType === 'camt.056.001.08'){
 		
    	var msgId = getHeader(map, "Plcn_FileTxnMsgDBID");
    	logger.info('dbOperationSepaTxn: msgId = ' + msgId);

    	var txnIdPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxId';
		var txnId = getValueFromPath(Document, txnIdPath);
    	logger.info('dbOperationSepaTxn: txnId = ' + txnId);
		if(txnId) {
			msgdbMap.put("TRANSREFNO", txnId); //temporary fixed
		}
       	txnCustom2 = msgId + "¿" + txnId;
    	logger.info('dbOperationSepaTxn: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepaTxn: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepaTxn: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		amountPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlIntrBkSttlmAmt';
		txnAmount = getValueFromPath(Document, amountPath);
		logger.info('dbOperationSepaTxn: txnAmount = ' + txnAmount);
		txnBatchAmonut += txnAmount;
		setHeader(map, "PLCN_txnBatchAmount", txnBatchAmonut);
		msgdbMap.put("PRIORITYAMOUNT", txnAmount);
		msgdbMap.put("PRIORITYAMOUNTNUM", txnAmount);

		if(validflag === "true") {
            if(processingLevel != 'MESSAGE') {
                if(queueId) {
                    msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
                    logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
                }else {
                    msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPTXVWQ");
                    logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = TMPTXVWQ');
                }
                var txnStatus = getHeader(map, "PLCN_txnStatus");
                if(txnStatus) {
                    msgdbMap.put("NEXT_WORKFLOW_STATUS", txnStatus);
                    logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = ' + txnStatus);
                } else {   
                    msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
                    logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');
                }
            }else {
                msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "SEPATXNQ");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = SEPATXNQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');
            }    
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
			//msgFamily154 = "XML";
		}else {
			if(queueId) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			}else {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPCXLWQ");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = TMPCXLWQ');
			}
			var txnStatus = getHeader(map, "PLCN_txnStatus");
			if(txnStatus) {
				msgdbMap.put("NEXT_WORKFLOW_STATUS", txnStatus);
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = ' + txnStatus);
			} else {   
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 102');
			}
		}
		msgBlock1 = dataBetweenTokens("<Undrlyg>", "</Undrlyg>", message);
		msgBlock1 = "<Undrlyg>" + msgBlock1 + "</Undrlyg>";
		msgBlock1 = msgBlock1.toString();
		msgBlock2 = msgBlock1;
		//logger.info("dbOperationSepaTxn: msgBlock1 = " + msgBlock1);
		msgFamily1 = "XML";
		msgFamily2 = "XML";
		logger.info('dbOperationSepaTxn: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	}

	if(msgType === 'camt.029.001.09'){
 		
    	var msgId = getHeader(map, "Plcn_FileTxnMsgDBID");
    	logger.info('dbOperationSepaTxn: msgId = ' + msgId);

    	var txnIdPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxId';
		var txnId = getValueFromPath(Document, txnIdPath);
    	logger.info('dbOperationSepaTxn: txnId = ' + txnId);
		if(txnId) {
			msgdbMap.put("TRANSREFNO", txnId); //temporary fixed
		}
       	txnCustom2 = msgId + "¿" + txnId;
    	logger.info('dbOperationSepaTxn: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepaTxn: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepaTxn: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		amountPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt';
		txnAmount = getValueFromPath(Document, amountPath);
		logger.info('dbOperationSepaTxn: txnAmount = ' + txnAmount);
		txnBatchAmonut += txnAmount;
		setHeader(map, "PLCN_txnBatchAmount", txnBatchAmonut);
		msgdbMap.put("PRIORITYAMOUNT", txnAmount);
		msgdbMap.put("PRIORITYAMOUNTNUM", txnAmount);

		if(validflag === "true") {
			if(processingLevel !== 'MESSAGE') {
				if(queueId) {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				}else {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPTXVWQ");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = TMPTXVWQ');
				}
				var txnStatus = getHeader(map, "PLCN_txnStatus");
				if(txnStatus) {
					msgdbMap.put("NEXT_WORKFLOW_STATUS", txnStatus);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = ' + txnStatus);
				} else {   
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');
				}
			}else {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "SEPATXNQ");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = SEPATXNQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 69');
			}		
				setHeader(map, "PLCN_ISOUTPUT", "Y");
				logger.info("Message direction = " + msgDirection);
				//msgFamily154 = "XML";
			}else {
				if(queueId) {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
					logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
					}else {
						msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPTXVWQ");
						logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_QUEUE_ID = TMPTXVWQ');
					}
					var txnStatus = getHeader(map, "PLCN_txnStatus");
					if(txnStatus) {
						msgdbMap.put("NEXT_WORKFLOW_STATUS", txnStatus);
						logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = ' + txnStatus);
					} else {   
						msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
						logger.info('dbOperationSepaTxn: NEXT_WORKFLOW_STATUS = 102');
					}
			}
		msgBlock1 = dataBetweenTokens("<TxInfAndSts>", "</TxInfAndSts>", message);
		msgBlock1 = "<TxInfAndSts>" + msgBlock1 + "</TxInfAndSts>";
		msgBlock1Sts = dataBetweenTokens("<Sts>", "</Sts>", message);
		msgBlock1Sts = "<Sts>" + msgBlock1Sts + "</Sts>";
		msgBlock1 = msgBlock1Sts + msgBlock1 ;
		msgBlock1 = msgBlock1.toString();
		msgBlock2 =  msgBlock1; 
		/* var msgStsFeld = dataBetweenTokens("<Sts>", "</Sts>", message);
		msgStsFeld = "<Sts>" + msgBlock1 + "</Sts>";
		logger.info('dbOperationSepaTxn: msgStsFeld' + msgStsFeld);
		msgBlock2 = msgStsFeld + msgBlock1; */
		//logger.info("dbOperationSepaTxn: msgBlock1 = " + msgBlock1);
		msgFamily1 = "XML";
		msgFamily2 = "XML";
		logger.info('dbOperationSepaTxn: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	}

	logger.info("dbOperationSepaTxn: typeof of msgBlock1 =  " + typeof msgBlock1);
	//msgBlock1 = msgBlock1.getBytes();
	//logger.info("dbOperationSepaTxn: typeof of msgBlock1 =  " + typeof msgBlock1);
	if(msgBlock1) {
		if(processingLevel !== 'MESSAGE') {
			Msgblock1.put("MESSAGE", msgBlock1);
		}else {
			Msgblock1.put("MESSAGE", msgBlock81);
		}
	}
	
	//logger.trace("dbOperationSepaTxn: msgBlock1 after get bytes = " + msgBlock1);
	Msgblock1.put("MSGFAMILY", msgFamily1);
	//Msgblock1.put("MESSAGE", "CAMEL_EXCHANGE_BODY");
	//Msgblock1.put("MSGFAMILY", "XML");
	list.add(Msgblock1);

	logger.info("dbOperationSepaTxn: typeof of msgBlock2 =  " + typeof msgBlock2);
	//msgBlock2 = msgBlock2.getBytes();
	if(msgBlock2){
		if(processingLevel !== 'MESSAGE') {	
			Msgblock2.put("MESSAGE", msgBlock2.replace(/\n/g, '').replace(/>\s+</g, '><'));
		}else {
			Msgblock2.put("MESSAGE", msgBlock81);
		}
	}
	
	logger.info("dbOperationSepaTxn: typeof of msgBlock2 =  " + typeof msgBlock2);
	//logger.trace("dbOperationSepaTxn: msgBlock2 after get bytes = " + msgBlock2);
	Msgblock2.put("MSGFAMILY", msgFamily2);
	list.add(Msgblock2);

	//Msgblock6.put("MESSAGE", msgBlock6);
	// Msgblock6.put("MSGFAMILY", "XML");
	// list.add(msgBlock6);
	 Msgblock95.put("MSGFAMILY", "XML");
	 if(validflag === 'false'){
	 	Msgblock95.put("MESSAGE", msgBlock95);
	 }else {
		Msgblock95.put("MESSAGE", "");
	 }
	 list.add(Msgblock95);
	// Msgblock99.put("MSGFAMILY", "XML");
	// list.add(msgBlock99);

	var msgDirection = getHeader(map, "PLCN_msgDirection");
	logger.info("dbOperationSepaTxn: msgDirection = " + msgDirection);

	logger.info("dbOperationSepaTxn: typeof of msgBlock81 =  " + typeof msgBlock81);
	//var msgBlock81Byte = msgBlock81.getBytes();
	//logger.info("dbOperationSepaTxn: typeof of msgBlock81 =  " + typeof msgBlock81);
	Msgblock81.put("MESSAGE", msgBlock81);
	//logger.info("dbOperationSepaTxn: msgBlock1 after get bytes = " + msgBlock81);
	if(isPatternPresent(msgBlock81, "xml")) {
		Msgblock81.put("MSGFAMILY", "XML");
	}else {
		Msgblock81.put("MSGFAMILY", "SWIFT");
	}
	//Msgblock81.put("DISPLAY_FLAG", "N");
	list.add(Msgblock81);

	//matching
	if(msgType === 'pacs.002.001.10'){
		var transrefno = getHeader(map, "PLCN_Pacs002transrefNo");
		logger.info("dbOperationSepaTxn: transrefno =" + transrefno);
		//var transrefno = getHeader(map, "PLCN_txnId");
    	msgdbMap.put("TRANSREFNO", transrefno);
		var transrefnoPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxId';
		var transrefno = getValueFromPath(Document, transrefnoPath);
		logger.info("dbOperationSepaTxn: transrefno =" + transrefno);
		msgdbMap.put("TRANSREFNO", transrefno);
		
		var orgMsgId = getHeader(map, "PLCN_orgMsgType");
		if(!orgMsgId){
			orgMsgId = getHeader(map, "PLCN_pmtInfId");
		}
		logger.info("dbOperationSepaTxn: orgMsgId =" + orgMsgId);
		
		/* var orgnlIntrBkSttlmAmtPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt';
		var orgnlIntrBkSttlmAmt = getValueFromPath(Document, orgnlIntrBkSttlmAmtPath);
		logger.info("dbOperationSepaTxn: orgnlIntrBkSttlmAmt =" + orgnlIntrBkSttlmAmt); */
		//var orgnlIntrBkSttlmAmt = dataBetweenTokens("<OrgnlIntrBkSttlmAmt>", "</OrgnlIntrBkSttlmAmt>", message);
		orgnlIntrBkSttlmAmt = getHeader(map, "PLCN_priorityAmountNum");
		
		var orgnlTxIdPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxId';
		var orgnlTxId = getValueFromPath(Document, orgnlTxIdPath);
		logger.info("dbOperationSepaTxn: orgnlTxId =" + orgnlTxId); 
		
		var msgDirection1;

		if(msgDirection == "O"){
			logger.info("dbOperationSepaTxn: Inside O loop = ");
			msgDirection1 = "I";
		}
		else if(msgDirection == "I"){
			logger.info("dbOperationSepaTxn: inside I loop");
			msgDirection1 = "O";
		}		
		logger.info("dbOperationSepaTxn: msgDirection1 = " + msgDirection1);
		
		var recordGroupType1 = getHeader(map, "PLCN_recordGroupType");
		logger.info("dbOperationSepaTxn: recordGroupType1 = " + recordGroupType1);
		if(!recordGroupType1) {
			recordGroupType1 = "M";
		}
				
		mtchTransrefno = getHeader(map, "PLCN_mtchTransrefno");
		logger.info("dbOperationSepaTxn: mtchTransrefno = " + mtchTransrefno);
		transrefno = getHeader(map, "PLCN_Pacs002transrefNo");
		logger.info("dbOperationSepaTxn: transrefno = " + transrefno);
		txnMtchParam = getHeader(map, "PLCN_txnMtchParam");
		logger.info("dbOperationSepaTxn: txnMtchParam = " + txnMtchParam);
		
		//mtchTransrefno1 = "|" + mtchTransrefno + "¿" + transrefno  + txnMtchParam;
		mtchTransrefno = "|" + orgMsgId + "¿" + orgnlTxId  + "|" + orgnlIntrBkSttlmAmt + "|" + currency + "|" + msgDirection1 + "|" + recordGroupType1;
		logger.info("dbOperationSepaTxn: mtchTransrefno = " + mtchTransrefno);
		msgdbMap.put("CUSTOM7", mtchTransrefno);
		
		var txStsPath = "/Document/FIToFIPmtStsRpt/TxInfAndSts/TxSts";
		var txStsVal = getValueFromPath(Document, txStsPath);
		if(txStsVal){
			txStsVal = txStsVal.trim();
		}
		logger.info("txStsVal: " + txStsVal);
		msgdbMap.put("CUSTOM12", txStsVal);
    	
    	var msgFamily = getHeader(map,"MSG_FAMILY");
        msgdbMap.put("MSG_FAMILY", msgFamily);
	}

	//matching
	if(msgType === 'pacs.004.001.09'){
		var transrefno = getHeader(map, "PLCN_Pacs004transrefNo");
		if(!transrefno){
			transRefNo = getHeader(map, "PLCN_txnId");
		}
		var orgMsgIdPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgId';
		var orgMsgId = getValueFromPath(Document, orgMsgIdPath);
		/* var orgMsgId = getHeader(map, "PLCN_orgMsgType");
		if(!orgMsgId){
			orgMsgId = getHeader(map, "PLCN_pmtInfId");
		} */
		logger.info("dbOperationSepaTxn: orgMsgId Pacs004=" + orgMsgId);

		msgDirection = getHeader(map, "PLCN_msgDirection");
	 	logger.info("dbOperationSepaTxn: msgDirection = " + msgDirection);
	 	logger.info("dbOperationSepaTxn: msgDirection type = " + typeof msgDirection);

	 	var msgDirection1;

		if(msgDirection == "O"){
			logger.info("dbOperationSepaTxn: Inside O loop = ");
			msgDirection1 = "I";
		}
		else if(msgDirection == "I"){
			logger.info("dbOperationSepaTxn: inside I loop");
			msgDirection1 = "O";
		}		
		logger.info("dbOperationSepaTxn: msgDirection1 = " + msgDirection1);
		
		/* var orgnlIntrBkSttlmAmtPath = '/Document/PmtRtr/TxInf/OrgnlIntrBkSttlmAmt';
		var orgnlIntrBkSttlmAmt = getValueFromPath(Document, orgnlIntrBkSttlmAmtPath);
		logger.info("dbOperationSepaTxn: orgnlIntrBkSttlmAmt =" + orgnlIntrBkSttlmAmt); */
		//var orgnlIntrBkSttlmAmt = dataBetweenTokens("<OrgnlIntrBkSttlmAmt>", "</OrgnlIntrBkSttlmAmt>", message);
		orgnlIntrBkSttlmAmt = getHeader(map, "PLCNAPI_priorityAmountNum");
		
		var orgnlTxIdPath = '/Document/PmtRtr/TxInf/OrgnlTxId';
		var orgnlTxId = getValueFromPath(Document, orgnlTxIdPath);
		logger.info("dbOperationSepaTxn: orgnlTxId =" + orgnlTxId); 
		
		var recordGroupType1 = getHeader(map, "PLCN_recordGroupType");
		logger.info("dbOperationSepaTxn: recordGroupType1 = " + recordGroupType1);
		if(!recordGroupType1) {
			recordGroupType1 = "M";
		}
		
		mtchTransrefno = getHeader(map, "PLCN_mtchTransrefno");
		fileOrgMsgId = getHeader(map, "PLCN_fileOrgMsgId");
		logger.info("dbOperationSepaTxn: fileOrgMsgId = " + fileOrgMsgId);
		txnMtchParam = getHeader(map, "PLCN_txnMtchParam");

		/* mtchTransrefno = "|" + orgMsgId + "¿" + orgnlTxId  + "|" + orgnlIntrBkSttlmAmt + "|" + currency + "|" + msgDirection1 + "|" + recordGroupType1;
		logger.info("dbOperationSepaTxn: mtchTransrefno = " + mtchTransrefno);
		msgdbMap.put("CUSTOM7", mtchTransrefno); */
		
		mtchTransrefno = "|" + orgMsgId + "¿" + orgnlTxId  + "|" + orgnlIntrBkSttlmAmt + "|" + currency + "|" + msgDirection1 + "|" + recordGroupType1;
		logger.info("dbOperationSepaTxn: mtchTransrefno = " + mtchTransrefno);
		msgdbMap.put("CUSTOM7", mtchTransrefno);
		
		/*var txnRsnCdPath = "/Document/PmtRtr/TxInf/RtrRsnInf/Rsn/Cd";
		var txnRsnCd = getValueFromPath(Document, txnRsnCdPath);
		logger.info("mxPacs004CustomMatchingParams: txnRsn Code = " + txnRsnCd);
		if(txnRsnCd){
			txnRsnCd = txnRsnCd.trim();
		}*/
		var custom12 = getHeader(map, "PLCN_custom12");
		logger.info("dbOperationSepaTxn: custom12 = " + custom12);
		msgdbMap.put("CUSTOM12", custom12);
	}
	
	
	if(msgType === 'camt.029.001.09'){
		var transrefno = getHeader(map, "PLCN_Camt029transrefNo");
		
		mtchTransrefno = getHeader(map, "PLCN_mtchTransrefno");
		fileOrgMsgId = getHeader(map, "PLCN_fileOrgMsgId");
		txnMtchParam = getHeader(map, "PLCN_txnMtchParam");
		
		var orgMsgId = getHeader(map, "PLCN_transRefNo");
		if(!orgMsgId){
			orgMsgId = getHeader(map, "PLCNAPI_transRefNo");
		}
		
		logger.info("dbOperationSepaTxn: orgMsgId =" + orgMsgId);
		
		orgnlIntrBkSttlmAmt = getHeader(map, "PLCNAPI_priorityAmountNum");
		
		msgDirection = getHeader(map, "PLCN_msgDirection");
	 	logger.info("dbOperationSepaTxn: msgDirection = " + msgDirection);
	 	logger.info("dbOperationSepaTxn: msgDirection type = " + typeof msgDirection);

	 	var msgDirection1;

		if(msgDirection == "O"){
			logger.info("dbOperationSepaTxn: Inside O loop = ");
			msgDirection1 = "I";
		}
		else if(msgDirection == "I"){
			logger.info("dbOperationSepaTxn: inside I loop");
			msgDirection1 = "O";
		}		
		logger.info("dbOperationSepaTxn: msgDirection1 = " + msgDirection1);
		logger.info("dbOperationSepaTxn: msgDirection1 = " + msgDirection1);
		
		var orgnlTxIdPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxId';
		var orgnlTxId = getValueFromPath(Document, orgnlTxIdPath);
		logger.info("dbOperationSepaTxn: orgnlTxId =" + orgnlTxId); 
		
		mtchTransrefno = getHeader(map, "PLCN_mtchTransrefno");
		fileOrgMsgId = getHeader(map, "PLCN_fileOrgMsgId");
		txnMtchParam = getHeader(map, "PLCN_txnMtchParam");
		
		var recordGroupType1 = getHeader(map, "PLCN_recordGroupType");
		logger.info("dbOperationSepaTxn: recordGroupType1 = " + recordGroupType1);
		if(!recordGroupType1) {
			recordGroupType1 = "M";
		}

		mtchTransrefno = "|" + orgMsgId + "¿" + orgnlTxId  + "|" + orgnlIntrBkSttlmAmt + "|" + currency + "|" + msgDirection1 + "|" + recordGroupType1;
		logger.info("dbOperationSepaTxn: mtchTransrefno = " + mtchTransrefno);
		msgdbMap.put("CUSTOM7", mtchTransrefno);
		

		/*var txnRsnCdPath = "/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/CxlStsRsnInf/Rsn/Cd";
		var txnRsnCd = getValueFromPath(Document, txnRsnCdPath);
		logger.info("sepaCamt029CustomMatchingParams: txnRsn Code = " + txnRsnCd);
		if(txnRsnCd){
			txnRsnCd = txnRsnCd.trim();
		}
		msgdbMap.put("CUSTOM12", txnRsnCd);*/
	}

	if(msgType === 'camt.056.001.08'){
		var transrefno = getHeader(map, "PLCN_Camt029transrefNo");
		
		var orgMsgId = getHeader(map, "PLCN_transRefNo");
		if(!orgMsgId){
			orgMsgId = getHeader(map, "PLCNAPI_transRefNo");
		}
		logger.info("dbOperationSepaTxn: orgMsgId =" + orgMsgId);
		
		orgnlIntrBkSttlmAmt = getHeader(map, "PLCNAPI_priorityAmountNum");
		
		msgDirection = getHeader(map, "PLCN_msgDirection");
	 	logger.info("dbOperationSepaTxn: msgDirection = " + msgDirection);
	 	logger.info("dbOperationSepaTxn: msgDirection type = " + typeof msgDirection);

	 	/* var msgDirection1; */

		/* if(msgDirection == "O"){
			logger.info("dbOperationSepaTxn: Inside O loop = ");
			msgDirection1 = "I";
		}
		else if(msgDirection == "I"){
			logger.info("dbOperationSepaTxn: inside I loop");
			msgDirection1 = "O";
		}	 */	
		logger.info("dbOperationSepaTxn: msgDirection1 = " + msgDirection1);
		logger.info("dbOperationSepaTxn: msgDirection1 = " + msgDirection1);
		
		var orgnlTxIdPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxId';
		var orgnlTxId = getValueFromPath(Document, orgnlTxIdPath);
		logger.info("dbOperationSepaTxn: orgnlTxId =" + orgnlTxId); 
		
		mtchTransrefno = getHeader(map, "PLCN_mtchTransrefno");
		fileOrgMsgId = getHeader(map, "PLCN_fileOrgMsgId");
		txnMtchParam = getHeader(map, "PLCN_txnMtchParam");
		
		var recordGroupType1 = getHeader(map, "PLCN_recordGroupType");
		logger.info("dbOperationSepaTxn: recordGroupType1 = " + recordGroupType1);
		if(!recordGroupType1) {
			recordGroupType1 = "M";
		}

		mtchTransrefno = "|" + orgMsgId + "¿" + orgnlTxId  + "|" + orgnlIntrBkSttlmAmt + "|" + currency + "|" + msgDirection + "|" + recordGroupType1;
		logger.info("dbOperationSepaTxn: mtchTransrefno = " + mtchTransrefno);
		msgdbMap.put("CUSTOM7", mtchTransrefno);
		
		/*var txnRsnCdPath = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/CxlRsnInf/Rsn/Cd";
		var txnRsnCd = getValueFromPath(Document, txnRsnCdPath);
		logger.info("sepaCamt056CustomMatchingParams: txnRsn Code = " + txnRsnCd);
		if(txnRsnCd){
			txnRsnCd = txnRsnCd.trim();
		}
		msgdbMap.put("CUSTOM12", txnRsnCd);*/
	}
	
	//matching
	if(msgType === 'pacs.007.001.09'){
		var transrefno = getHeader(map, "PLCN_Pacs007transrefNo");
		if(!transrefno){
			transRefNo = getHeader(map, "PLCN_txnId");
		}
		var orgMsgIdPath = '/Document/FIToFIPmtRvsl/OrgnlGrpInf/OrgnlMsgId';
		var orgMsgId = getValueFromPath(Document, orgMsgIdPath);
		/* var orgMsgId = getHeader(map, "PLCN_orgMsgType");
		if(!orgMsgId){
			orgMsgId = getHeader(map, "PLCN_pmtInfId");
		} */
		logger.info("dbOperationSepaTxn: orgMsgId Pacs007=" + orgMsgId);

		msgDirection = getHeader(map, "PLCN_msgDirection");
	 	logger.info("dbOperationSepaTxn: msgDirection = " + msgDirection);
	 	logger.info("dbOperationSepaTxn: msgDirection type = " + typeof msgDirection);

	 	/* var msgDirection1; */

		/* if(msgDirection == "O"){
			logger.info("dbOperationSepaTxn: Inside O loop = ");
			msgDirection1 = "I";
		}
		else if(msgDirection == "I"){
			logger.info("dbOperationSepaTxn: inside I loop");
			msgDirection1 = "O";
		}		
		logger.info("dbOperationSepaTxn: msgDirection1 = " + msgDirection1); */
		
		var amount1Path = '/Document/FIToFIPmtRvsl/TxInf/OrgnlIntrBkSttlmAmt';
		var txn1Amount = getValueFromPath(Document, amount1Path);
		logger.info('dbOperationSepaTxn: txn1Amount = ' + txn1Amount);
		var orgnlIntrBkSttlmAmt = getHeader(map, "PLCNAPI_priorityAmountNum"); 
		if(!orgnlIntrBkSttlmAmt){
			orgnlIntrBkSttlmAmt = txn1Amount;
			/* orgnlIntrBkSttlmAmt = getHeader(map, "PLCN_priorityAmountNum"); */
		}
		var orgnlTxIdPath = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxId';
		var orgnlTxId = getValueFromPath(Document, orgnlTxIdPath);
		logger.info("dbOperationSepaTxn: orgnlTxId =" + orgnlTxId); 
		
		var recordGroupType1 = getHeader(map, "PLCN_recordGroupType");
		logger.info("dbOperationSepaTxn: recordGroupType1 = " + recordGroupType1);
		if(!recordGroupType1) {
			recordGroupType1 = "M";
		}
		
		mtchTransrefno = getHeader(map, "PLCN_mtchTransrefno");
		fileOrgMsgId = getHeader(map, "PLCN_fileOrgMsgId");
		logger.info("dbOperationSepaTxn: fileOrgMsgId = " + fileOrgMsgId);
		txnMtchParam = getHeader(map, "PLCN_txnMtchParam");

		mtchTransrefno = "|" + orgMsgId + "¿" + orgnlTxId  + "|" + txn1Amount + "|" + currency + "|" + msgDirection + "|" + recordGroupType1;
		logger.info("dbOperationSepaTxn: mtchTransrefno = " + mtchTransrefno);
		msgdbMap.put("CUSTOM7", mtchTransrefno);
		
		/*var rsnCdPath = "/Document/FIToFIPmtRvsl/TxInf/RvslRsnInf/Rsn/Cd";
		var rsnCd = getValueFromPath(Document, rsnCdPath);
		if(rsnCd){
			rsnCd = rsnCd.trim();
		}
		msgdbMap.put("CUSTOM12", rsnCd);*/
	}

	if(recordGroupType1){
		msgdbMap.put("RECORD_GROUP_TYPE", recordGroupType1);
	}else {
		msgdbMap.put("RECORD_GROUP_TYPE", "M");
	}	
	
	var displayFlag =  getHeader(map,"PLCN_displayFlag");
	var processingStage = getHeader(map,"PLCN_processingStage");
	var authLevel = getHeader(map,"PLCN_currentAuthLevelMessage");
	if(!authLevel) {
		authLevel = 'AUTH=2|DUPL=4|PENT=4|APRV=4|REPR=4|PAUS=4|WITH=2|WRHS=4|ERR=2|HASH=4|PEND=4|FINL=4|CHNR=4|MTCH=2';
	}

	logger.info("dbOperationSepaTxn: displayFlag = " + displayFlag);
	logger.info("dbOperationSepaTxn: PLCN_processingStage = " + processingStage);
	logger.info("dbOperationSepaTxn: PLCN_currentAuthLevel = " + authLevel);
	
	if(processingStage){
		msgdbMap.put("PROCESSING_STAGE", processingStage);
		//msgdbMap.put("CURRENT_AUTH_LEVEL", authLevel);

		logger.info("dbOperationSepaTxn: PROCESSING_STAGE & CURRENT_AUTH_LEVEL values have been set to DB");
	}else if(validflag == "true") {
		msgdbMap.put("PROCESSING_STAGE", "FINL");
		logger.info("dbOperationSepaTxn: PROCESSING_STAGE = FINL");
	}

	if(authLevel) {
		msgdbMap.put("CURRENT_AUTH_LEVEL", authLevel);
	}else {
		msgdbMap.put("CURRENT_AUTH_LEVEL", "4");
	}

	var custom11 = getHeader(map, "PLCN_clrgIdSet");
	logger.info("dbOperationSepaTxn: custom11 = " + custom11);

	if(custom11) {
		msgdbMap.put("CUSTOM11", custom11);
	}

	var custom24 = getHeader(map, "PLCN_custom24");
	logger.info("dbOperationSepaTxn: custom24 = " + custom24);

	if(custom24) {
		custom24 = "TO_DATE('" + custom24 + "', 'MM/DD/YYYY HH24:MI:SS')";
		logger.info("dbOperationSepaTxn: CONSTANT_CUSTOM24 = " + custom24);
		msgdbMap.put("CONSTANT_CUSTOM24", custom24);
	}else {
		msgdbMap.put("CONSTANT_CUSTOM24", "NULL");
		logger.info("dbOperationSepaTxn: CUSTOM24 = NULL");
	}

	var custom37 = getHeader(map, "PLCN_bamkingChannelUpdt");
 	logger.info("dbOperationSepaTxn: custom37 = " + custom37);
 	if(!custom37 && msgDirection === 'I') {
 		custom37 = getHeader(map, "PLCN_bankingChanl");
		logger.info("dbOperationSepaTxn: custom37 = " + custom37);
		if(!custom37){
			custom37 = getHeader(map, "PLCN_bankingChanlUpdt");
			logger.info("dbOperationSepaTxn: custom37 = " + custom37);
		}
		if(!custom37){
			custom37 = getHeader(map, "PLCN_bankingChannel");
			logger.info("dbOperationSepaTxn: custom37 = " + custom37);
		}
		if(!custom37) {
			custom37 = 'DEFAULT';
		}
 	}else{
		custom37 = getHeader(map, "PLCN_bamkingChannelUpdt");
		logger.info("dbOperationSepaTxn: custom37 = " + custom37);
		if(!custom37){
			custom37 = getHeader(map, "PLCN_bankingChanl");
			logger.info("dbOperationSepaTxn: custom37 = " + custom37);
		}
		if(!custom37){
			custom37 = getHeader(map, "PLCN_bankingChanlUpdt");
			logger.info("dbOperationSepaTxn: custom37 = " + custom37);
		}
		if(!custom37){
			custom37 = getHeader(map, "PLCN_bankingChannel");
			logger.info("dbOperationSepaTxn: custom37 = " + custom37);
		}
		if(!custom37) {
			custom37 = 'DEFAULT';
		}
	}
	logger.info("dbOperationSepaTxn: custom37 = " + custom37);
	if(custom37) {
 		msgdbMap.put("CUSTOM37", custom37);
 	}

 	var msgFamily = getHeader(map, "PLCN_msgFamilyDB");
 	if(msgFamily) {
 		msgdbMap.put("MSG_FAMILY", msgFamily);
 	}else {
 		msgdbMap.put("MSG_FAMILY", "SEPA");
 	}
 	logger.info("dbOperationSepaTxn: msgFamily = " + msgFamily);

	 var channelIdSource = getHeader(map, "PLCN_channelIdSource");
	 //channelIdSource = getHeader(map, "CHANNEL_ID_SOURCE");
	 //channelIdSource = getHeader(map, "PLCN_channelSourceId");
	 logger.info("dbOperationSepaTxn: channelIdSource = " + channelIdSource); 
	 if(!channelIdSource){
	 		channelIdSource = getHeader(map, "PLCN_sepaChannelSourceId");
	 		logger.info("dbOperationSepaTxn: channelIdSource = " + channelIdSource); 
	 }
	 if(channelIdSource){
		 msgdbMap.put("CHANNEL_ID_SOURCE", channelIdSource);
	 }
 
	 var channelIdTarget = getHeader(map, "PLCN_channelIdTarget");
	 //channelIdSource = getHeader(map, "CHANNEL_ID_SOURCE");
	 //channelIdSource = getHeader(map, "PLCN_channelSourceId");
	 logger.info("dbOperationSepaTxn: channelIdTarget = " + channelIdTarget); 
	 if(channelIdSource){
		 msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	 }
 
 	var recordEndMaker = '3';
 	msgdbMap.put("RECORD_END_MARKER", recordEndMaker);

	var messageNo = getHeader(map, "Plcn_FileMsgNo");
	logger.info("dbOperationSepaTxn: Txn MessageNo = " + messageNo);
	msgdbMap.put("MESSAGENO", messageNo);

	var msgdbId = getHeader(map, "Plcn_FileTxnMsgDBID");
	logger.info("dbOperationSepaTxn: Txn msgdbId = " + msgdbId);
	msgdbMap.put("MSGDB_ID", msgdbId);

	var newPriorityDate = getHeader(map, "PLCN_newPriorityDate");
	logger.info("dbOperationSepaTxn: newPriorityDate = " + newPriorityDate);

	if(newPriorityDate) {
		msgdbMap.put("PRIORITYDATE", newPriorityDate);
	}

	if(msgType === "pacs.008.001.08") {
		msgdbMap.put("TRANSACTIONGROUP", "CT");	
	}

	if(msgType === 'camt.056.001.08' || msgType === 'camt.029.001.09' || msgType === "pacs.004.001.09" || msgType === "pacs.007.001.09" || msgType === "pacs.002.001.10"){
		msgdbMap.put("TRANSACTIONGROUP", "ENI");	
	}

	if(msgType === "pacs.003.001.08") {
		msgdbMap.put("TRANSACTIONGROUP", "DD");
	}

	/* var priorityAmount = getHeader(map, "PLCN_priorityAmount");
	//priorityAmount = getHeader(map, "PRIORITY_AMOUNT");
	priorityAmount = getHeader(map, "PLCNAPI_priorityAmount");
	priorityAmount = getHeader(map, "PLCN_amount")
	logger.info("dbOperationSepaTxn: priorityAmount = " + priorityAmount);
	if(priorityAmount) {
		msgdbMap.put("PRIORITYAMOUNT", priorityAmount);
	} */

	var validMessage = getHeader(map, "PLCN_validMessage");
	logger.trace("dbOperationSepaTxn: validMessage = " + validMessage);

	var responseCdsDoc = getHeader(map, "ACEDB_responseCdsDoc");
	logger.trace("dbOperationSepaTxn: typeof responseCdsDoc = " + typeof responseCdsDoc);
	//logger.trace("dbOperationSepaTxn: responseCdsDoc = " + responseCdsDoc);

	var derivedProductCode = getHeader(map, "PLCN_productCode");
	logger.info("dbOperationSepaTxn: derivedProductCode = " + derivedProductCode);

	// if(!derivedProductCode) {
	// 	derivedProductCode = drveProductCode(exchange);
	// 	logger.info("dbOperationSepaTxn: productCode from hazelcast = " + derivedProductCode);
	// 	logger.info("dbOperationSepaTxn: typeof productCode from hazelcast = " + typeof derivedProductCode);
	// }else {
	// 	setHeader(map, "PLCN_productCode", derivedProductCode);
	// }

	if(derivedProductCode) {
		msgdbMap.put("DERIVED_PRODUCT", derivedProductCode);
	}

	var sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	logger.info("dbOperationSepaTxn: sourceChannelId = " + sourceChannelId);
	if(sourceChannelId){
		msgdbMap.put("SOURCECHANNELID", sourceChannelId);
	}

	var processId = getHeader(map, "PLCN_processId");
	logger.info("dbOperationSepaTxn: processId = " + processId);
	if(!processId) {	
		processId =  "NONE";	
	}else {
		processId =  "TO-MATCH";	
	}
	logger.info("dbOperationSepaTxn: processId = " + processId);	
	msgdbMap.put("PROCESS_ID", processId);

	// var isInput = getHeader(map, "PLCN_ISINPUT");
	// logger.info("dbOperationSepaTxn: isInput = " + isInput);

	// if(isInput) {
	// 	msgdbMap.put("ISINPUT",isInput);
	// }else {
	// 	msgdbMap.put("ISINPUT",'');
	// }

	msgdbMap.put("ISINPUT","N");

	// var isOutput = getHeader(map, "PLCN_ISOUTPUT");
	// logger.info("dbOperationSepaTxn: isOutput = " + isOutput);

	// if(isOutput) {
	// 	msgdbMap.put("ISOUTPUT", isOutput);
	// }else {
	// 	msgdbMap.put("ISOUTPUT", '');
	// }

	msgdbMap.put("ISOUTPUT", "N");
	
	msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	msgdbMap.put("DISPLAY_FLAG", "N");
	if(processingLevel == 'MESSAGE') {
		if(msgType === 'pacs.002.001.10'){
			msgdbMap.put("DISPLAY_FLAG", "Y");
		}
		if(msgType === "pacs.008.001.08") {
			msgdbMap.put("DISPLAY_FLAG", "Y");
		}
		if(msgType === "pacs.003.001.08") {
			msgdbMap.put("DISPLAY_FLAG", "Y");
		}
	}
	// msgdbMap.put("COMMENTS", comments);
	msgdbMap.put("INSTANCEID","PELICAN1");
    msgdbMap.put("PROCESS_ID", processId);

    var validMessage = getHeader(map, "PLCN_validMessage");
    logger.info("dbOperationSepaTxn: valid message = " + validMessage);

    //logger.info("dbOperationSepaTxn: properties  = " + exchange.getProperties());
	var fDebulkData = exchange.getProperty("Plcn_FileDebulkData");
	var fdUniqueId;

	if(fDebulkData) {
		 fdUniqueId = fDebulkData.getUnique_ID();
	}
	logger.info("dbOperationSepaTxn: fdUniqueId  = " + fdUniqueId);

	var fdErrorCount; 
	if(fDebulkData) {
		 fdErrorCount = fDebulkData.getErrorCount();
	}
	logger.info("dbOperationSepaTxn: fdErrorCount = " + fdErrorCount);
	
	fileMsgdbId = readMsgdb.get("MSGDB_ID");
	logger.info("dbOperationSepaTxn: fileMsgdbId = " + fileMsgdbId);
	if(fileMsgdbId){
		msgdbMap.put("TWOPHASECOMMIT_ID", fileMsgdbId);
	}
	//setHeader(map, "PLCN_twoPhaseCommitId", msgdbId);
	if(validMessage == "true") {
		setHeader(map, "PLCN_rejectFileFlag", "false");
	} else {
		fdErrorCount++;
		logger.info("dbOperationSepaTxn: fdErrorCount = " + fdErrorCount);
		fDebulkData.setErrorCount(fdErrorCount);
	}

	var messageNoFile = getHeader(map, "PLCN_messageNo");
	logger.info("dbOperationSepaTxn: messageNoFile = " + messageNoFile);
	 
	var messageNoTxn = getHeader(map, "Plcn_FileMsgNo");
	logger.info("dbOperationSepaTxn: messageNoTxn = " + messageNoTxn);

	var batchMsgNo = getHeader(map, "Plcn_FileBatchMsgNo");
	logger.info("dbOperationSepaTxn: batchMsgNo = " + batchMsgNo);

	var msgdbIdBatch = getHeader(map, "Plcn_FileBatchMsgDBID");
	logger.info("dbOperationSepaTxn: msgdbIdBatch = " + msgdbIdBatch);
	if(msgdbIdBatch){
		msgdbMap.put("MSGDB_ID_BATCH", msgdbIdBatch);
	}
		
		var audit1 = new HashMap();
		audit1.put("MESSAGENO", messageNoTxn);
		//audit.put("AUDITDATETIME", new Date().d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear());
		audit1.put("SEQUENCENO", 123);
		audit1.put("QUEUEID", queueId);
		//audit.put("USERNAME","ADMIN1");
		audit1.put("APPLICATION","ACEQ_CMP");
		audit1.put("MODULENAME","DEBULK");
		audit1.put("ACTION","DEBULK");
		audit1.put("AUDITTEXT","Message inserted from Batch No " +  "<" + batchMsgNo + ">" + "of File No" + "<" + messageNoFile + ">" + "and wrote to Queue" + "'" + queueId + "'");
		audit1.put("INSTITUTIONID", institutionId);
		//audit.put("AUDITTIMESTAMP", dateTime);
		//logger.info("printing this..dbOperationSepaTxn: after genAuditList = " + myArrayForGenAudit);
		//logger.info("before block ....dbOperationSepaTxn: after genAuditList = " + myArrayForGenAudit);
		//myArrayForGenAudit.add(audit1);
		//logger.info("after block ....dbOperationSepaTxn: after genAuditList = " + myArrayForGenAudit);
		//setHeader(map, "GENAUDIT", myArrayForGenAudit);

	//MsgdbPay
	var msgDbId = getHeader(map, "Plcn_FileTxnMsgDBID");
	if(msgDbId){ 	
		msgdbPayMap.put("MSGDB_ID", msgDbId);
	}

	var remittanceInfo = getHeader(map, "PLCN_remittanceInfo");
	remittanceInfo = getHeader(map, "PLCN_uId");
	logger.info("dbOperationSepaTxn: remittanceInfo = " + remittanceInfo);
	if(remittanceInfo) {
		msgdbPayMap.put("REMITTANCE_INFO", remittanceInfo);
	}	

	var benfType = "NONCUSTOMER";
	logger.info("dbOperationSepaTxn: benfType = " + benfType);
	if(benfType) {
		msgdbPayMap.put("MDBPAY_BENF_TYPE", benfType);
	}	

	var orderingCustName = getHeader(map, "PLCN_debtorName");
	logger.info("dbOperationSepaTxn: orderingCustName = " + orderingCustName);
	if(orderingCustName) {
		msgdbPayMap.put("MDBPAY_ORDERING_CUST_NAME", orderingCustName);
	}	

	var custAccNo = getHeader(map, "PLCN_senderIban");
	logger.info("dbOperationSepaTxn: custAccNo = " + custAccNo);
	if(custAccNo) {
		msgdbPayMap.put("MDBPAY_CUSTACCNO", custAccNo);
	}

    if(msgType === "pacs.002.001.10") {
        extractSepaMsgDataDbToDbFlow(exchange);
	}

	var ordInstNameAddr1 = getHeader(map, "PLCN_payerName");
	logger.info("dbOperationSepaTxn: ordInstNameAddr1 = " + ordInstNameAddr1);
	if(ordInstNameAddr1) {
		msgdbPayMap.put("MDBPAY_ORD_INST_NAME_ADDR1", ordInstNameAddr1);
	}

	var ordInstNameAddr2 = getHeader(map, "PLCN_payerAddr1");
	logger.info("dbOperationSepaTxn: ordInstNameAddr2 = " + ordInstNameAddr2);
	if(ordInstNameAddr2) {
		msgdbPayMap.put("MDBPAY_ORD_INST_ADDR2", ordInstNameAddr2);
	}

    
	var ordInstNameAddr3 = getHeader(map, "PLCN_payerAddr2");
	logger.info("dbOperationSepaTxn: ordInstNameAddr3 = " + ordInstNameAddr3);
	if(ordInstNameAddr3) {
		msgdbPayMap.put("MDBPAY_ORD_INST_ADDR3", ordInstNameAddr3);
	}
    /*
	var ordInstNameAddr4 = getHeader(map, "PLCN_payerAddr3");
	logger.info("dbOperationSepaTxn: ordInstNameAddr4 = " + ordInstNameAddr4);
	if(ordInstNameAddr4) {
		msgdbPayMap.put("MDBPAY_ORD_INST_ADDR4", ordInstNameAddr4);
	}
    */

	var custAccNoEnc = getHeader(map, "PLCN_accountNumber");
	logger.info("dbOperationSepaTxn: custAccNoEnc = " + custAccNoEnc);
	if(custAccNoEnc) {
		msgdbPayMap.put("MDBPAY_CUSTACCNO_ENC", custAccNoEnc);
	}

	var benNameEnc = getHeader(map, "PLCN_benbankName");
	logger.info("dbOperationSepaTxn: benNameEnc = " + benNameEnc);
	if(benNameEnc) {
		msgdbPayMap.put("MDBPAY_BENEFNAME_ENC", benNameEnc);
	}

	var orderingCustNameEnc = getHeader(map, "PLCN_orderingCustEnc");
	logger.info("dbOperationSepaTxn: orderingCustNameEnc = " + orderingCustNameEnc);
	if(orderingCustNameEnc) {
		msgdbPayMap.put("MDBPAY_ORDERING_CUST_NAME_ENC", orderingCustNameEnc);
	}
    var pacs002Charges = getHeader(map, "PLCNAPI_pacs002Charges");
	logger.info("dbOperationSepaTxn: pacs002Charges = " + pacs002Charges);
	if(pacs002Charges) {
		msgdbPayMap.put("MDBPAY_CHARGE_1", pacs002Charges);
	}
	//MsgdbComments

	var msgdbIdFile = getHeader(map, "PLCN_msgDbId");
	logger.info("dbOperationSepaTxn: msgdbIdFile = " + msgdbIdFile);
	if(msgdbIdFile) {
		msgdbCommentsMap.put("MSGDB_ID", msgdbIdFile);
	}

	var msgdbIdChild = getHeader(map, "Plcn_FileTxnMsgDBID");
	logger.info("dbOperationSepaTxn: msgdbId = " + msgdbIdChild);
	if(msgdbIdChild) {
		msgdbCommentsMap.put("MSGDB_ID_CHILD", msgdbIdChild);
	}

	var status = getHeader(map, "PLCN_Status");
	logger.info("dbOperationSepaTxn: Status = " + status);
	if(status) {
		msgdbCommentsMap.put("STATUS", status);
	}else {
		msgdbCommentsMap.put("STATUS", "69");
	}

	if(fdUniqueId) {
		msgdbCommentsMap.put("TWOPHASECOMMIT_ID", msgdbId);
	}

	var comments = getHeader(map, "PLCN_comments");
	comments = getHeader(map, "PLCN_txnComments");
	logger.info("dbOperationSepaTxn: comments = " + comments);
	if(comments) {
		msgdbCommentsMap.put("COMMENTS", comments);
	}

	var recordGroupType = getHeader(map, "PLCN_recordGroupType");
	logger.info("dbOperationSepaTxn: recordGroupType = " + recordGroupType);
	if(recordGroupType) {
		msgdbCommentsMap.put("RECORD_GROUP_TYPE", recordGroupType);
	}else {
		msgdbCommentsMap.put("RECORD_GROUP_TYPE", "M");
	}

	var reference = getHeader(map, "PLCN_reference");
	logger.info("dbOperationSepaTxn: reference = " + reference);
	if(reference) {
		msgdbCommentsMap.put("REFERENCE", reference);
	}

	var sequenceNum = getHeader(map, "PLCN_sequenceNum");
	//sequenceNum = getHeader(map, "PLCN_transRefNo") + "B-" + getHeader(map, "PLCN_batchSequence"); 
	sequenceNum = "12345";
	logger.info("dbOperationSepaTxn: sequenceNum = " + sequenceNum );
	if(sequenceNum) {
		msgdbCommentsMap.put("SEQUENCENUM", sequenceNum);
	}

	var InstanceId = getHeader(map, "PLCN_instanceId");
	logger.info("dbOperationSepaTxn: InstanceId = " + InstanceId);
	if(InstanceId) {
		msgdbCommentsMap.put("INSTANCEID", "PELICAN1");
	}

	var validflag = getHeader(map, "PLCN_validMessage");
	logger.info("dbOperationSepaTxn: validflag = " + validflag);
	if(msgDirection === 'I') {
		if(validflag == 'true') {
			msgdbCommentsMap.put("OUTPUT_FILE_FLAG", "Y");
		}else {
			if(processingLevel === 'MESSAGE') {
				msgdbCommentsMap.put("OUTPUT_FILE_FLAG", "Y");
			}else {
				msgdbCommentsMap.put("OUTPUT_FILE_FLAG", "N");
			}
		}
	}else {
		msgdbCommentsMap.put("OUTPUT_FILE_FLAG", "Y");
	}

	//extractMsgDBData(exchange);

	var origName = getHeader(map, "PLCN_origName");
	logger.info("dbOperationSepaTxn: origName = " + origName);

	if(origName) {
		msgdbMap.put("ORIGNAME", origName);
	}

	var accountDr = getHeader(map, "PLCN_accountDr");
	logger.info("dbOperationSepaTxn: accountDr = " + accountDr);

	if(accountDr) {
		msgdbMap.put("ACCOUNT_DR", accountDr);
	}

	var accountNumber = getHeader(map, "PLCN_accountNumber");
	logger.info("dbOperationSepaTxn: accountNumber = " + accountNumber);

	if(accountNumber) {
		msgdbMap.put("ACCOUNT_NUMBER", accountNumber);
	}

	var customerAccNo = getHeader(map, "PLCN_customerAccNo");
	if(!customerAccNo){
		customerAccNo = getHeader(map, "PLCN_accountDr");
	}
	logger.info("dbOperationSepaTxn: customerAccNo = " + customerAccNo);

	if(customerAccNo) {
		msgdbMap.put("CUSTOMERACCNO", customerAccNo);
	}

	var keyId ;

	/* if(customerAccNo) {
		if(isEncyptionrequired(institutionId)) {
			logger.info("dbOperationSepaTxn: isEncyptionrequired = " + isEncyptionrequired);
			keyId = getActiveDataKeyId(institutionId);
			logger.info("dbOperationSepaTxn: keyId = " + keyId);
			encrypt(customerAccNo, keyId, institutionId);
			customerAccNo = getTextMaskedData(customerAccNo);
			logger.info("dbOperationSepaTxn: customerAccNo = " + customerAccNo);
			msgdbMap.put("CUSTOMERACCNO", customerAccNo);
		}else {
			msgdbMap.put("CUSTOMERACCNO", customerAccNo);
		}
	} */

	var customer = getHeader(map, "PLCN_customer");
	logger.info("dbOperationSepaTxn: customer = " + customer);

	if(customer) {
		customer = customer.substr(0,11);
	}
	if(customer) {
		msgdbMap.put("CUSTOMER", customer);
	}

	var origBankName = getHeader(map, "PLCN_origBankName");
	logger.info("dbOperationSepaTxn: origBankName = " + origBankName);

	if(origBankName) {
		msgdbMap.put("ORIGBANKNAME", origBankName);
	}

	var benBankName = getHeader(map, "PLCN_benBankName");
	logger.info("dbOperationSepaTxn: benBankName = " + benBankName);

	if(benBankName) {
		msgdbMap.put("BENBANKNAME", benBankName);
	} else {
        msgdbMap.put("BENBANKNAME", "");
	}

	var benefName = getHeader(map, "PLCN_benefName");
	logger.info("dbOperationSepaTxn: benefName = " + benefName);

	if(benefName) {
		msgdbMap.put("BENEFNAME", benefName);
	}

	var otherPartyDetails = getHeader(map, "PLCN_otherPartyDetails");
	logger.info("dbOperationSepaTxn: otherPartyDetails = " + otherPartyDetails);

	if(otherPartyDetails) {
		msgdbMap.put("OTHER_PARTY_DETAILS", otherPartyDetails);
	}

	var otherAccno = getHeader(map, "PLCN_otherAccno");
	logger.info("dbOperationSepaTxn: otherAccno = " + otherAccno);

	if(otherAccno) {
		msgdbMap.put("OTHER_ACCNO", otherAccno);
	}

	var accountCr = getHeader(map, "PLCN_accountCr");
	logger.info("dbOperationSepaTxn: accountCr = " + accountCr);

	if(accountCr) {
		msgdbMap.put("ACCOUNT_CR", accountCr);
	}

	var benBankAddr1 = getHeader(map, "PLCN_benBankAddr1");
	logger.info("dbOperationSepaTxn: benBankAddr1 = " + benBankAddr1);

	if(benBankAddr1) {
		msgdbMap.put("BENBANKADDR1", benBankAddr1);
	} else {
        msgdbMap.put("BENBANKADDR1", "");
	}

	var benBankAddr2 = getHeader(map, "PLCN_benBankAddr2");
	logger.info("dbOperationSepaTxn: benBankAddr2 = " + benBankAddr2);

	if(benBankAddr2) {
		msgdbMap.put("BENBANKADDR2", benBankAddr2);
	} else {
        msgdbMap.put("BENBANKADDR2", "");
	}

	var benBankAddr3 = getHeader(map, "PLCN_benBankAddr3");
	logger.info("dbOperationSepaTxn: benBankAddr3 = " + benBankAddr3);

	if(benBankAddr3) {
		msgdbMap.put("BENBANKADDR3", benBankAddr3);
	}

	var benBankCity = getHeader(map, "PLCN_benBankCity");
	logger.info("dbOperationSepaTxn: benBankCity = " + benBankCity);

	if(benBankCity) {
		msgdbMap.put("BENBANKCITY", benBankCity);
	}

	var benBankCtry = getHeader(map, "PLCN_benBankCtry");
	logger.info("dbOperationSepaTxn: benBankCtry = " + benBankCtry);

	if(benBankCtry) {
		msgdbMap.put("BENBANKCTRY", benBankCtry);
	}

	var benBankStateCode = getHeader(map, "PLCN_benBankStateCode");
	logger.info("dbOperationSepaTxn: benBankStateCode = " + benBankStateCode);

	if(benBankStateCode) {
		msgdbMap.put("BENBANKSTATECODE", benBankStateCode);
	}

	var benbankzipcode = getHeader(map, "PLCN_benbankzipcode");
	logger.info("dbOperationSepaTxn: benbankzipcode = " + benbankzipcode);

	if(benbankzipcode) {
		msgdbMap.put("BENBANKZIPCODE", benbankzipcode);
	}


	var fileLastMessageInBatch = getHeader(map, "Plcn_FileLastMessageInBatch");
	logger.info("dbOperationSepaTxn: fileLastMessageInBatch = " + fileLastMessageInBatch);

	if(fileLastMessageInBatch === '1') {
		logger.info("dbOperationSepaTxn: Batch completed and dbOperation called ");
		dbOperationSepaBatch(exchange);
	}else {
		logger.info("dbOperationSepaTxn: Batch not completed ");
	}

	setHeader(map, "ACEQ_WRITE_MSGDB", msgdbMap);
	setHeader(map, "ACEQ_WRITE_MSGBLOCKS", list);
	setHeader(map, "GENAUDIT", audit1);
	setHeader(map, "ACEQ_WRITE_MSGDB_PAY", msgdbPayMap);
	setHeader(map, "ACEQ_WRITE_MSGDB_COMMENTS", msgdbCommentsMap);
	setHeader(map, "ACEQ_DB_OPERATION", "INSERT");

	logger.info("dbOperationSepaTxn completed");
}
function dbOperationSepaBatch(exchange) {
	var inMsg;
	var Document;
	var msgdbMap;
	var map;
	var readMsgdb;
	var audit;
	var comments;
	var sourceChannelId;
	var channelIdTarget;
	var validMessage;
	var msgType;
	var processId;
	var custom14;
	var custom17;
	var custom50;
	var custom24;
	var recordGroupType;
	var messageNoSource;
	var inputDate;
	var inputTime;
	var currentQueueInDate;
	var currentQueueInTime;
	var custom9;
	var msgdbIdOrg;
	var msgdbIdSource;
	var custom44;
	var processingStatus;
	var reasonCode;
	var custom37;
	var custom40;
	var origRecord;
	var custom14;
	var custom42;
 	var accountBookingInfo;
	var twoPhaseCommitId;
	var msgStateMeaning;
	var targetChannelId;
	var institutionId;
	var destCountryCode;
	var localCurrencyAmount;
	var localCurrencyAmountNum;
	var balanceUpdate;
	var transactionType;
	var custom2;
	var transactionGroup;
	var config1;
	var config2;
	var config3;
	var msgBlock91;
	var path;
	var msgType;
	
	logger.info("In dbOperationSepaBatch rule.");

	inMsg = exchange.getIn();

	//var messageString = inMsg.getBody(java.lang.String.class);
	//logger.info("dbOperationSepaBatch: messageString = " + messageString);

	inMsg = exchange.getIn();
	
	map = inMsg.getHeaders();
	msgdbMap = new HashMap();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	var stringMessage = inMsg.getBody(java.lang.String.class);

	var msgdbId = getHeader(map, "PLCN_msgDbId");
	logger.info("dbOperationSepaBatch: MSGDB_ID = " + msgdbId);

	var msgDirection = getHeader(map, "PLCN_msgDirection");
 	logger.info("dbOperationSepaBatch: msgDirection = " + msgDirection);

	// var mode = getHeader(map,"PLCN_mode");
	// logger.info("dbOperationSepaBatch: Mode = " + mode);
	// if(mode) {
	// 	msgdbMap.put("MSG_MODE_IN", mode);
	// }

	msgdbMap.put("MSG_MODE_IN", "FILE");

	var custom14 = getHeader(map, "PLCN_custom14");
 	logger.info("dbOperationSepaBatch: custom14 = " + custom14);
	
 	custom50 = getHeader(map, "PLCN_custom50");
 	logger.info("dbOperationSepaBatch: custom50 = " + custom50);

 	var msgType = getHeader(map, "PLCN_msgType");
 	logger.info("dbOperationSepaBatch: msgType = " + msgType);
	setHeader(map, "PLCN_messageClassType", msgType);
 	if(msgType) {
		msgdbMap.put("MESSAGECLASSTYPE", msgType);
	}
	
	var correspondent = getHeader(map, "PLCN_customer");
	logger.info("dbOperationSepaBatch: correspondent = " + correspondent);
	if(correspondent) {
		msgdbMap.put("CORRESPONDENT", correspondent);
	}else {
		msgdbMap.put("CORRESPONDENT", "");
	}

	/* var priorityAmount = getHeader(map, "PLCN_priorityAmount");
 	logger.info("dbOperationSepaBatch: priorityAmount = " + priorityAmount);
 	if(priorityAmount) {
 		msgdbMap.put("PRIORITYAMOUNT", priorityAmount);
		msgdbMap.put("PRIORITYAMOUNTNUM", priorityAmount);
 	} */
	
	var priorityAmount = getHeader(map, "PLCNAPI_priorityAmount");
	if(!priorityAmount || priorityAmount == ",00"){
		logger.info("dbOperationSepaBatch: inside 1st if loop ");
		priorityAmount = getHeader(map, "PLCN_priorityAmount");
	}
	else if(!priorityAmount){
		logger.info("dbOperationSepaBatch: inside 2nd if loop ");
		priorityAmount = getHeader(map, "PLCN_amount");
	}
	//priorityAmount = getHeader(map, "PRIORITY_AMOUNT");
	/* priorityAmount = getHeader(map, "PLCN_priorityAmount");
	priorityAmount = getHeader(map, "PLCN_amount") */
	logger.info("dbOperationSepaBatch: priorityAmount = " + priorityAmount);
	if(priorityAmount) {
		msgdbMap.put("PRIORITYAMOUNT", priorityAmount);
	}
	
	/* setHeader(map, "PLCN_priorityAmountNum", priorityAmount); */
	
	var priorityAmountNum = getHeader(map, "PLCN_priorityAmountNum");
	logger.info("dbOperationSepaBatch: priorityAmountNum = " + priorityAmountNum);
	if(!priorityAmountNum){
		logger.info("dbOperationSepaBatch: inside 1st if loop ");
		priorityAmountNum = getHeader(map, "PLCNAPI_priorityAmountNum");
	}
	//priorityAmountNum = getHeader(map, "PLCN_amount");
	//priorityAmountNum = getHeader(map, "PLCNAPI_priorityAmountNum");
	else if(!priorityAmountNum){
		logger.info("dbOperationSepaBatch: inside 2nd if loop ");
		priorityAmountNum = getHeader(map, "PLCN_priorityAmount");
	}
	else if(!priorityAmountNum){
		logger.info("dbOperationSepaBatch: inside 3rd if loop ");
		priorityAmountNum = getHeader(map, "PLCN_amount");
	}
	/* priorityAmountNum = getHeader(map, "PLCN_priorityAmount"); */
	logger.info("dbOperationSepaBatch: priorityAmountNum = " + priorityAmountNum);
	if(priorityAmountNum) {
		msgdbMap.put("PRIORITYAMOUNTNUM", priorityAmountNum);
	}

	var countryCode = getHeader(map, "PLCN_countryCode");
	logger.info("dbOperationSepaBatch: countryCode = " + countryCode);
	if(countryCode) {
		msgdbMap.put("COUNTRYCODE", countryCode);
	}

  	if(custom14) {
 		msgdbMap.put("CUSTOM14", custom14);
 	}

 	if(custom50) {
 		msgdbMap.put("CUSTOM50", custom50);
 	}

 	messageNoSource = getHeader(map, "PLCN_messageNoSource");
 	messageNoSource = getHeader(map, "MESSAGENO_SOURCE");
 	logger.info("dbOperationSepaBatch: messageNoSource = " + messageNoSource);

 	if(messageNoSource) {
 		msgdbMap.put("MESSAGENO_SOURCE", messageNoSource);
 	}

 	currentQueueInDate = getHeader(map, "PLCN_currentQueueInDate");
 	logger.info("dbOperationSepaBatch: currentQueueInDate = " + currentQueueInDate);
 	if(currentQueueInDate) {
 		msgdbMap.put("CURRQUEUEINDATE", currentQueueInDate);
 	}

 	currentQueueInTime = getHeader(map, "PLCN_currentQueueInTime");
 	currentQueueInTime = getHeader(map, "CURRQUEUEINTIME");
 	logger.info("dbOperationSepaBatch: currentQueueInTime = " + currentQueueInTime);
 	if(currentQueueInTime) {
 		msgdbMap.put("CURRQUEUEINTIME", currentQueueInTime)
 	}

 	var lockStatus =  getHeader(map, "PLCN_lockStatus");
 	logger.info("dbOperationSepaBatch: lockStatus = " + lockStatus);
 	if(lockStatus) {
 		msgdbMap.put("LOCKSTATUS", lockStatus);
 	}

 	var numOfMessages = getHeader(map, "PLCN_numOfMessages");
 	//numOfMessages = getHeader(map,"NUM_OF_MSGS");
 	logger.info("dbOperationSepaBatch: numOfMessages = " + numOfMessages);
 	if(numOfMessages) {
 		msgdbMap.put("NUMOFMESSAGES", numOfMessages);
 	}

 	var returnCode = getHeader(map, "PLCN_returnCode");
 	logger.info("dbOperationSepaBatch: returnCode = " + returnCode);
 	if(returnCode) {
 		msgdbMap.put("RETURNCODE", returnCode);
 	}
 	
 	custom42 = getHeader(map, "PLCN_custom42");
 	logger.info("dbOperationSepaBatch: custom42 = " + custom42);
 	if(custom42) {
 		msgdbMap.put("CUSTOM42", custom42);
 	}

 	var msgBlocks = inMsg.getHeaders().get("ACEQ_READ_MSGBLOCKS");

	institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("dbOperationSepaBatch: institutionId = " + institutionId); 

	sourceChannelId = getHeader(map, "PLCN_sourceChannelId");

	// var channelIdSource = getHeader(map, "PLCN_channelIdSource");
	// //channelIdSource = getHeader(map, "CHANNEL_ID_SOURCE");
	// //channelIdSource = getHeader(map, "PLCN_channelSourceId");
	// logger.info("dbOperationSepaBatch: channelIdSource = " + channelIdSource); 
	// if(channelIdSource){
	// 	msgdbMap.put("CHANNEL_ID_SOURCE", channelIdSource);
	// }

	var channelIdSource = getHeader(map, "PLCN_sourceChannelId");
	logger.info("dbOperationSepaBatch: channelIdSource = " + channelIdSource);
	if(channelIdSource){
		msgdbMap.put("CHANNEL_ID_SOURCE", channelIdSource);
	}
	
	var currentQueueInDateTime = getHeader(map, "PLCN_currentQueueInDateTime");
	currentQueueInDateTime = getHeader(map, "CURRQUEUEINDATETIME");
	//channelIdSource = getHeader(map, "PLCN_channelSourceId");
	logger.info("dbOperationSepaBatch: currentQueueInDateTime = " + currentQueueInDateTime); 
	if(currentQueueInDateTime){
		msgdbMap.put("CURRQUEUEINDATETIME", currentQueueInDateTime);
	}

	var sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	logger.info("dbOperationSepaBatch: sourceChannelId = " + sourceChannelId);
	if(sourceChannelId){
		msgdbMap.put("SOURCECHANNELID", sourceChannelId);
	}

	msgdbMap.put("COMMENTS", "");
	
	//validMessage = getHeader(map, "PLCN_validMessage");
	var validflag = getHeader(map, "PLCN_validFlag");
	validflag = validflag.toString();
	logger.info("dbOperationSepaBatch: validflag = " + validflag);
	logger.info("dbOperationSepaBatch: typeof validflag = " + typeof validflag);
	
	var msgDirection = getHeader(map, "PLCN_msgDirection");	
	logger.info("dbOperationSepaBatch: msgDirection = " + msgDirection);
	if(msgDirection) {
		msgdbMap.put("MESSAGEDIRECTION", msgDirection);
	}

	var priority = getHeader(map, "PLCN_priority");
	logger.info("dbOperationSepaBatch: priority = " + priority);
	if(!priority) {
		priority = "5";
	}
	if(priority) {
		msgdbMap.put("PRIORITY", priority);
	}

	var sender = getHeader(map, "PLCN_sender");
	var senderPath;
	//sender = getHeader(map, "SENDER");
	logger.info("dbOperationSepaBatch: sender = " + sender);
	if(!sender) {
		senderPath = dataBetweenTokens("<InstgAgt>", "</InstgAgt>", stringMessage);
		sender = dataBetweenTokens("<BICFI>", "</BICFI>", senderPath);
	}

	logger.info("dbOperationSepaBatch: sender from tag = " + sender);
	if(sender) {
		msgdbMap.put("SENDER", sender);
	}else {
		msgdbMap.put("SENDER", "");
	}

	var receiver = getHeader(map, "PLCN_receiver");
	var receiverPath;
	//receiver = getHeader(map, "RECEIVER");
	logger.info("dbOperationSepaBatch: receiver = " + receiver);
	if(!receiver) {
		receiverPath = dataBetweenTokens("<InstdAgt>", "</InstdAgt>", stringMessage);
		receiver = dataBetweenTokens("<BICFI>", "</BICFI>", receiverPath);
	}
	logger.info("dbOperationSepaBatch: receiver from tag = " + receiver);
	if(receiver) {
		msgdbMap.put("RECEIVER", receiver);
	}else {
		msgdbMap.put("RECEIVER", "");
	}

	var currency = getHeader(map, "PLCN_currency");
	currency = getHeader(map, "PLCNAPI_currency");
	logger.info("dbOperationSepaBatch: currency = " + currency);
	if(currency) {
		msgdbMap.put("CURRENCY", currency);
	}

	var institutionId = getHeader(map, "PLCN_institutionId");
	//institutionId = getHeader(map, "PLCN_institutionId1");
	//institutionId = getHeader(map, "INSTITUTION_ID");
	logger.info("dbOperationSepaBatch: institutionId = " + institutionId);
	if(institutionId){
		msgdbMap.put("INSTITUTIONID", institutionId);
	}

	var msgSegr = getHeader(map, "PLCN_msgSegr");
	logger.info("dbOperationSepaBatch: MsgSegr = " + msgSegr);
	if(msgSegr) {
		msgdbMap.put("MSGSEGR", msgSegr);
	}else {
		msgdbMap.put("MSGSEGR", "DEFAULT");
	}

	//msgdbMap.put("MSGSEGR", "DEFAULT");

	var transrefno = getHeader(map, "PLCN_transRefNo");
	if(!transrefno) {
		transrefno = getHeader(map, "PLCNAPI_transRefNo");
	}
	logger.info("dbOperationSepaBatch: transrefno = " + transrefno);
	if(transrefno){
		msgdbMap.put("TRANSREFNO", transrefno);
	}

	var custom8 = getHeader(map, "PLCN_custom8");
	custom8 = getHeader(map, "CUSTOM8");
	logger.info("dbOperationSepaBatch: custom8 = " + custom8);
	if(custom8){
		msgdbMap.put("CUSTOM8", custom8);
	}

	var custom11 = getHeader(map, "PLCN_custom11");
	custom11 = getHeader(map, "CUSTOM11");
	logger.info("dbOperationSepaBatch: custom11 = " + custom11);
	if(custom11){
		msgdbMap.put("CUSTOM11", custom11);
	}

	var derivedProductCode = getHeader(map, "PLCN_productCode");
	//derivedProductCode = getHeader(map, "DERIVED_PRODUCT");
	//derivedProductCode = getHeader(map, "PLCN_derivedProduct");
	logger.info("dbOperationSepaBatch: derivedProductCode = " + derivedProductCode);

	if(derivedProductCode) {
		msgdbMap.put("DERIVED_PRODUCT", derivedProductCode);
	}

	var authorizePath = institutionId.concat(".PROCESSING_STAGES.AUTHORIZE.PRODUCTS");
	logger.info("dbOperationSepaBatch: authorizePath = " + authorizePath);
	var authorizeCode = memTblGetTableValue(map, "INST_PARAM", authorizePath);
	logger.info("dbOperationSepaBatch: authorize code = " + authorizeCode);

	var custom13 = getHeader(map, "PLCN_custom13File");
	logger.info("dbOperationSepaBatch: custom13 = " + custom13);
	if(!custom13 && isPatternPresent(authorizeCode, derivedProductCode)){
		custom13 = '01_FILEHASHCODECHECK=D|02_REPAIRSERVICE=Y|03_WITHDRAWSERVICE=N|04_APPROVEDSERVICE=N|05_AUTHORIZATIONSERVICE=Y|06_SCANSERVICE=N|07_ACCOUNTINGSERVICE=N|08_WAREHOUSE=N|';
	}else {
		custom13 = '01_FILEHASHCODECHECK=D|02_REPAIRSERVICE=Y|03_WITHDRAWSERVICE=N|04_APPROVEDSERVICE=N|05_AUTHORIZATIONSERVICE=N|06_SCANSERVICE=N|07_ACCOUNTINGSERVICE=N|08_WAREHOUSE=N|';
	}
	if(custom13){
		msgdbMap.put("CUSTOM13", custom13);
	}

	var custom40 = getHeader(map, "PLCN_custom40");
	custom40 = getHeader(map, "CUSTOM40");
	logger.info("dbOperationSepaBatch: custom40 = " + custom40);
	if(custom40){
		msgdbMap.put("CUSTOM40", custom40);
	}

	var custom50 = getHeader(map, "PLCN_custom50");
	custom50 = getHeader(map, "CUSTOM50");
	logger.info("dbOperationSepaBatch: custom50 = " + custom50);
	if(custom50){
		msgdbMap.put("CUSTOM50", custom50);
	}

	var msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	msgFamily = getHeader(map, "PLCN_msgFamily");
	logger.info("dbOperationSepaBatch: msgFamily = " + msgFamily);
	if(msgFamily){
		msgdbMap.put("MSG_FAMILY", msgFamily);
	}

	var recordGroupType = getHeader(map, "PLCN_batchRecordGroupType");
	logger.info("dbOperationSepaBatch: recordGroupType for batch = " + recordGroupType);
	if(recordGroupType) {
		msgdbMap.put("RECORD_GROUP_TYPE", recordGroupType);
	}else {
		msgdbMap.put("RECORD_GROUP_TYPE", "B");
	}

	var msgdbIdOrg = getHeader(map, "PLCN_msgdbIdOrg");
	msgdbIdOrg = getHeader(map, "PLCN_msgDbId");
	//msgdbIdOrg = getHeader(map, "MSGDB_ID_ORG");
	logger.info("dbOperationSepaBatch: msgdbIdOrg = " + msgdbIdOrg);
	if(msgdbIdOrg){
		msgdbMap.put("MSGDB_ID_ORG", msgdbIdOrg);
		msgdbMap.put("MSGDB_ID_SOURCE", msgdbIdOrg);
	}

	var key;
	if(institutionId) {
		key  = institutionId.concat(".PROCESSING_LEVEL.PRODUCTS");
	}
	logger.info("dbOperationSepaBatch: Key = " + key);
	var processingLevel = memTblGetTableValue(map, "INST_PARAM", key);
	logger.info("dbOperationSepaBatch: Processing Level = " + processingLevel);

	var queueId = getHeader(map, "PLCN_BtchQId");

	if(validflag == "true"){
		logger.info('validflag == "true"');		
		setHeader(map, "PLCN_queueAudit", "");
		if(!queueId && (msgType == 'pacs.008.001.08' || msgType == 'pacs.004.001.09' || msgType == 'pacs.003.001.08' || msgType == 'pacs.007.001.09' || msgType == 'camt.056.001.08' || msgType == 'camt.029.001.09')) {
		logger.info("dbOperationSepaBatch: !queueId");
			if(processingLevel !== 'MESSAGE'){
				queueId = "TMPBTVWQ";
				setHeader(map, "PLCN_BatchQueueAudit", queueId);
				setHeader(map, "PLCN_BatchQueue", queueId);
			}else {
				queueId = "BTPROCDQ";
				setHeader(map, "PLCN_BatchQueueAudit", queueId);
				setHeader(map, "PLCN_BatchQueue", queueId);
			}
		}else {
			logger.info("dbOperationSepaBatch: in Else part of !queueId");
			queueId = "BTPROCDQ";
			setHeader(map, "PLCN_BatchQueueAudit", queueId);
			setHeader(map, "PLCN_BatchQueue", queueId);
		}
	}else {
		if(processingLevel !== 'MESSAGE' && (msgType == 'pacs.008.001.08' || msgType == 'pacs.004.001.09' || msgType == 'pacs.003.001.08' || msgType == 'pacs.007.001.09' || msgType == 'camt.056.001.08' || msgType == 'camt.029.001.09')){
			queueId = "TMPBTVWQ";
			setHeader(map, "PLCN_BatchQueueAudit", queueId);
			setHeader(map, "PLCN_BatchQueue", queueId);
		}else {
			queueId = "BTPROCDQ";
			setHeader(map, "PLCN_BatchQueueAudit", queueId);
			setHeader(map, "PLCN_BatchQueue", queueId);
		}
	}
	logger.info("dbOperationSepaBatch: queueId .. = " + queueId);

	var queueId = getHeader(map, "PLCN_btchQId");
	logger.info("dbOperationSepaBatch: queueId from Auth header = " + queueId);
	if(!queueId) {
		queueId = getHeader(map, "PLCN_BatchQueueAudit");
		//queueId= getHeader(map, "PLCN_BatchQueue");
		logger.info("dbOperationSepaBatch: queueId from normal header = " + queueId);
	}

	if(queueId) {
		msgdbMap.put("QUEUEID", queueId);
	}else{
		//queueId = "TMPBTVWQ";
		msgdbMap.put("QUEUEID", "TMPBTVWQ");
		setHeader(map, "PLCN_ePQueueId", "TMPBTVWQ");
	}
	setHeader(map, "PLCN_ePQueueId", queueId);

	var status = getHeader(map, "PLCN_batchStatus1");
	logger.info("dbOperationSepaBatch: status = " + status);

	if(!status){
		if(processingLevel == 'MESSAGE' && msgType !== 'pacs.002.001.10') {
			status = "290";
		}else {
			status = '66';
		}
	}

	msgdbMap.put("STATUS", status);
	setHeader(map, "PLCN_ePStatus", status);

	var custom37 = getHeader(map, "PLCN_bamkingChannelUpdt");
 	logger.info("dbOperationSepaBatch: custom37 = " + custom37);
 	if(!custom37 && msgDirection === 'I') {
 		custom37 = getHeader(map, "PLCN_bankingChanl");
  		logger.info("dbOperationSepaBatch: custom37 = " + custom37);
		if(!custom37){
			custom37 = getHeader(map, "PLCN_bankingChanlUpdt");
			logger.info("dbOperationSepaBatch: custom37 = " + custom37);
		}
		if(!custom37){
			custom37 = getHeader(map, "PLCN_bankingChannel");
			logger.info("dbOperationSepaBatch: custom37 = " + custom37);
		}
		if(!custom37) {
			custom37 = 'DEFAULT';
		}
 	}else{
		custom37 = getHeader(map, "PLCN_bamkingChannelUpdt");
		logger.info("dbOperationSepaBatch: custom37 = " + custom37);
		if(!custom37){
			custom37 = getHeader(map, "PLCN_bankingChanl");
			logger.info("dbOperationSepaBatch: custom37 = " + custom37);
		}
		if(!custom37){
			custom37 = getHeader(map, "PLCN_bankingChanlUpdt");
			logger.info("dbOperationSepaBatch: custom37 = " + custom37);
		}
		if(!custom37){
			custom37 = getHeader(map, "PLCN_bankingChannel");
			logger.info("dbOperationSepaBatch: custom37 = " + custom37);
		}
		if(!custom37) {
			custom37 = 'DEFAULT';
		}
	}
	if(custom37) {
 		msgdbMap.put("CUSTOM37", custom37);
 	}

 	// if(msgType == "pacs.003.001.08" || msgType == 'pacs.007.001.09') {
 	// 	msgdbMap.put("TRANSACTIONTYPE", "C");
 	// }else {
 	// 	msgdbMap.put("TRANSACTIONTYPE", "D");
 	// } 

 	if(msgType == "pacs.003.001.08") {
 		logger.info("dbOperationSepaBatch: In if of pacs.003");
	 	if(msgDirection == "O") {
	 		logger.info("dbOperationSepaBatch: In if of msgDirection == O");
	 		msgdbMap.put("TRANSACTIONTYPE", "D");
	 	}else {
	 		logger.info("dbOperationSepaBatch: In else of msgDirection == O");
	 		msgdbMap.put("TRANSACTIONTYPE", "C");
	 	}
 	}else {
 		logger.info("dbOperationSepaBatch: In else");
	 	if(msgDirection == "I") {
	 		logger.info("dbOperationSepaBatch: In if of msgDirection == I");
	 		msgdbMap.put("TRANSACTIONTYPE", "D");
	 	}else {
	 		logger.info("dbOperationSepaBatch: In else of msgDirection == I");
	 		msgdbMap.put("TRANSACTIONTYPE", "C");
	 	}
 	}

	var processId = getHeader(map, "PLCN_processId");
	logger.info("dbOperationSepaBatch: processId = " + processId);
	if(!processId && processingLevel !== 'MESSAGE') {	
		processId =  "NONE";	
	}else if(msgType !== 'pacs.008.001.08'){
		processId =  "TO-MATCH";	
	}
	logger.info("dbOperationSepaBatch: processId = " + processId);	
	msgdbMap.put("PROCESS_ID", processId);

	var list = new ArrayList();

	var Msgblock91 = new HashMap();
	
	msgType = getHeader(map, "PLCN_msgType");
	msgType = msgType.trim();
	logger.info("dbOperationSepaBatch: msgType = " + msgType);
	logger.info("dbOperationSepaBatch: data type of msgType = " + typeof msgType);
	
	// var messageNo = readMsgdb.get("MESSAGENO");
	var messageNo = getHeader(map, "PLCN_batchMsgNo");
	logger.info("dbOperationSepaBatch: queueId = " + queueId);
	logger.info("dbOperationSepaBatch: status = " + status);
	logger.info("dbOperationSepaBatch: messageNo = " + messageNo);

	var batchCustom2;

	var message = inMsg.getBody(java.lang.String.class);

	if(msgType === 'pacs.002.001.10') {
		logger.info("dbOperationSepaBatch: msg type is pacs.002.001.10");
		var transrefnoPath = '/Document/FIToFIPmtStsRpt/OrgnlGrpInfAndSts/OrgnlMsgId';
		var transrefno = getValueFromPath(Document, transrefnoPath);
		logger.info("dbOperationSepaTxn: transrefno =" + transrefno);
		msgdbMap.put("TRANSREFNO", transrefno);
		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "BTPROCDQ");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = BTPROCDQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = 69');
			}
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
		}else {
				//logger.trace('dbOperationSepaBatch: outputMsgMx = ' + outputMsgMx);
				//msgBlock91 = msgBlocks.get("MSGBLOCK91");
				msgFamily91 = "SEPA";
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "BTPROCDQ");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = BTPROCDQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = 102');
			}
		}
		msgBlock91 = getHeader(map, "PLCN_block91");
		logger.info("dbOperationSepaBatch: Block 91 = " + msgBlock91); 
	}	

	if(msgType === 'pacs.004.001.09') {
		logger.info("dbOperationSepaBatch: msg type is pacs.004.001.09");
		
		var txnIdPath = '/Document/PmtRtr/TxInf/MsgId';
		var txnId = getValueFromPath(Document, txnIdPath);
    	logger.info('dbOperationSepaBatch: txnId = ' + txnId);
		if(txnId) {
			msgdbMap.put("TRANSREFNO", txnId); //temporary fixed
		}
		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPBTVWQ");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = TMPBTVWQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = 69');
			}
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
		}else {
				//logger.trace('dbOperationSepaBatch: outputMsgMx = ' + outputMsgMx);
				//msgBlock91 = msgBlocks.get("MSGBLOCK91");
				msgFamily91 = "SEPA";
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPBTVWQ");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = TMPBTVWQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = 102');
			}
		}
		   msgBlock91 = getHeader(map, "PLCN_block91");
		   logger.info("dbOperationSepaBatch: Block 91 = " + msgBlock91); 
		// msgBlock91 = dataBetweenTokens("<OrgnlGrpInf>", "</OrgnlGrpInf>", message);
		// msgBlock91 = "<OrgnlGrpInf>" + msgBlock91 + "</OrgnlGrpInf>";
			//msgBlock91 = msgBlock91.toString();
	}	
    	logger.info('dbOperationSepaBatch: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);

	if(msgType === 'pacs.008.001.08'){
 		
    	var msgId = getHeader(map, "PLCN_msgdbIdSource");
    	logger.info('dbOperationSepaBatch: msgId = ' + msgId);

    	var endToend = getHeader(map, "PLCN_transRefNo");
    	logger.info('dbOperationSepaBatch: endToend = ' + endToend);
       	batchCustom2 = endToend + "¿" + msgId;
       	//batchCustom2 = endToend + msgId;
    	logger.info('dbOperationSepaBatch: batchCustom2 = ' + batchCustom2);
    	msgdbMap.put("CUSTOM2", batchCustom2);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepaBatch: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepaBatch: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = ' + status);
			logger.info('dbOperationSepaBatch: Type of NEXT_WORKFLOW_STATUS = ' + typeof status);
			if(!queueId || !status) {
				if(processingLevel != 'MESSAGE') {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPBTVWQ");
					logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = TMPBTVWQ');
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
					logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = 69');
					logger.info('dbOperationSepaBatch: Type of NEXT_WORKFLOW_STATUS = ' + typeof status);
				}else {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "BTPROCDQ");
					logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = BTPROCDQ');
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "269");
					logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = 269');
					logger.info('dbOperationSepaBatch: Type of NEXT_WORKFLOW_STATUS = ' + typeof status);
				}
			}
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
		}else {
				//logger.trace('dbOperationSepaBatch: outputMsgMx = ' + outputMsgMx);
				//msgBlock91 = msgBlocks.get("MSGBLOCK91");
				msgFamily91 = "SEPA";
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPBTVWQ");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = TMPBTVWQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = 102');
			}
		}
		msgBlock91 = getHeader(map, "PLCN_block91");
		//logger.trace("dbOperationSepaBatch: Block 91 = " + msgBlock91); 
	}	

	if(msgType === 'pacs.003.001.08') {
		logger.info("dbOperationSepaBatch: msg type is pacs.003.001.08");
		var transrefno = getHeader(map, "PLCN_msgId");
		logger.info("dbOperationSepaBatch: transrefno = " + transrefno);
		if(transrefno) {
			msgdbMap.put("TRANSREFNO", transrefno);
		}

		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPBTVWQ");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = TMPBTVWQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = 69');
			}
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
		}else {
				//logger.trace('dbOperationSepaBatch: outputMsgMx = ' + outputMsgMx);
				//msgBlock91 = msgBlocks.get("MSGBLOCK91");
				msgFamily91 = "SEPA";
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPBTVWQ");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = TMPBTVWQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = 102');
			}
		}
		   msgBlock91 = getHeader(map, "PLCN_block91");
		   //logger.trace("dbOperationSepaBatch: Block 91 = " + msgBlock91); 
		// msgBlock91 = dataBetweenTokens("<OrgnlGrpInf>", "</OrgnlGrpInf>", message);
		// msgBlock91 = "<OrgnlGrpInf>" + msgBlock91 + "</OrgnlGrpInf>";
			//msgBlock91 = msgBlock91.toString();
	}

	if(msgType === 'pacs.007.001.09') {
		logger.info("dbOperationSepaBatch: msg type is pacs.007.001.09");
		
		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPBTVWQ");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = TMPBTVWQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = 69');
			}
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
		}else {
				//logger.trace('dbOperationSepaBatch: outputMsgMx = ' + outputMsgMx);
				//msgBlock91 = msgBlocks.get("MSGBLOCK91");
				msgFamily91 = "SEPA";
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPBTVWQ");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = TMPBTVWQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = 102');
			}
		}
		   msgBlock91 = getHeader(map, "PLCN_block91");
		  // logger.trace("dbOperationSepaBatch: Block 91 = " + msgBlock91); 
		// msgBlock91 = dataBetweenTokens("<OrgnlGrpInf>", "</OrgnlGrpInf>", message);
		// msgBlock91 = "<OrgnlGrpInf>" + msgBlock91 + "</OrgnlGrpInf>";
			//msgBlock91 = msgBlock91.toString();
	}

	if(msgType === 'camt.056.001.08' || msgType == 'camt.029.001.09'){
 		
		if(msgType === 'camt.056.001.08'){
			var msgIdPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/CxlId';
			var msgIdValue = getValueFromPath(Document, msgIdPath);
			logger.info('dbOperationSepaBatch: msgIdValue = ' + msgIdValue);
			if(msgIdValue) {
				msgdbMap.put("TRANSREFNO", msgIdValue);
			}
		}
		else if(msgType == 'camt.029.001.09'){
			var msgIdPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/CxlStsId';
			var msgIdValue = getValueFromPath(Document, msgIdPath);
			logger.info('dbOperationSepaBatch: msgIdValue = ' + msgIdValue);
			if(msgIdValue) {
				msgdbMap.put("TRANSREFNO", msgIdValue);
			}
		}
		
    	var msgId = getHeader(map, "PLCN_msgdbIdSource");
    	logger.info('dbOperationSepaBatch: msgId = ' + msgId);

    	var endToend = getHeader(map, "PLCN_txnId");
    	logger.info('dbOperationSepaBatch: endToend = ' + endToend);
       	batchCustom2 = endToend + "¿" + msgId;
    	logger.info('dbOperationSepaBatch: batchCustom2 = ' + batchCustom2);
    	msgdbMap.put("CUSTOM2", batchCustom2);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepaBatch: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepaBatch: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPBTVWQ");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = TMPBTVWQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = 69');
			}
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
		}else {
				//logger.trace('dbOperationSepaBatch: outputMsgMx = ' + outputMsgMx);
				//msgBlock91 = msgBlocks.get("MSGBLOCK91");
				msgFamily91 = "SEPA";
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "TMPBTVWQ");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_QUEUE_ID = TMPBTVWQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepaBatch: NEXT_WORKFLOW_STATUS = 102');
			}
		}
		msgBlock91 = getHeader(map, "PLCN_block91");
		//logger.trace("dbOperationSepaBatch: Block 91 = " + msgBlock91); 
	}

	Msgblock91.put("MSGBLOCKTYPE", "91");
	//logger.trace("dbOperationSepaBatch: msgBlock91 = " + msgBlock91);

	if(msgBlock91){
		Msgblock91.put("MESSAGE", msgBlock91);
	}else {
		Msgblock91.put("MESSAGE", "");
	}

	Msgblock91.put("MSGFAMILY", "XML");
	Msgblock91.put("DISPLAY_FLAG", "Y");
	list.add(Msgblock91);

	var msgDirection = getHeader(map, "PLCN_msgDirection");
	logger.info("dbOperationSepaBatch: msgDirection = " + msgDirection);

	var displayFlag =  getHeader(map,"PLCN_displayFlagBatch");
	displayFlag = getHeader(map, "PLCN_displayFlagbatch");
	var processingStage = getHeader(map,"PLCN_processingStage");
	var authLevel = getHeader(map,"PLCN_currentAuthLevelBatch");
	//authLevel = getHeader(map, "PLCN_currentAuthLevelBtch");

	if(!authLevel && processingLevel !== 'MESSAGE') {
		authLevel = 'AUTH=2|DUPL=4|PENT=4|APRV=4|REPR=4|PAUS=4|WITH=2|WRHS=4|ERR=2|HASH=4|PEND=4|FINL=4|CHNR=4|MTCH=2';
	}

	logger.info("dbOperationSepaBatch: PLCN_processingStage = " + processingStage);
	logger.info("dbOperationSepaBatch: PLCN_currentAuthLevel = " + authLevel);
	logger.info("dbOperationSepaBatch: displayFlag = " + displayFlag);
	
	if(processingLevel === 'MESSAGE') {
		msgdbMap.put("PROCESSING_STAGE", "FINL");
		logger.info("dbOperationSepaBatch: processingStage = FINL");
	}else {
		msgdbMap.put("PROCESSING_STAGE", "PEND");
		logger.info("dbOperationSepaBatch: processingStage = PEND");
	}

	if(authLevel){
		msgdbMap.put("CURRENT_AUTH_LEVEL", authLevel);
	}else {
		msgdbMap.put("CURRENT_AUTH_LEVEL", "4");
	}

	//var custom11 = getHeader(map, "PLCN_clearingId");
	var custom11 = getHeader(map, "PLCN_clrgIdSet");
	logger.info("dbOperationSepaBatch: custom11 = " + custom11);

	if(custom11) {
		msgdbMap.put("CUSTOM11", custom11);
	}

	//"TO_DATE('09/03/2021 12:00:00', 'MM/DD/YYYY HH24:MI:SS')"
	var custom24 = getHeader(map, "PLCN_custom24");
	logger.info("dbOperationSepaBatch: custom24 = " + custom24);

	if(custom24) {
		custom24 = "TO_DATE('" + custom24 + "', 'MM/DD/YYYY HH24:MI:SS')";
		logger.info("dbOperationSepaBatch: CONSTANT_CUSTOM24 = " + custom24);
		msgdbMap.put("CONSTANT_CUSTOM24", custom24);
	}else {
		msgdbMap.put("CONSTANT_CUSTOM24", "NULL");
		logger.info("dbOperationSepaBatch: CUSTOM24 = NULL");
	}

	var priorityDate = getHeader(map, "PLCN_priorityDate");
	if(!priorityDate){
		priorityDate = getHeader(map, "PLCN_valueDate");
	}else {
		priorityDate = getHeader(map, "PLCNAPI_priorityDate");
	}
	priorityDate = valueDateForFile(exchange);
	logger.info("dbOperationSepaBatch: priorityDate = " + priorityDate);

	if(priorityDate && msgDirection == "I") {
		priorityDate = driveCurrentValueDateRule(exchange, priorityDate);
	}
	logger.info("dbOperationSepaBatch: priorityDate = " + priorityDate);

	if(priorityDate) {
		msgdbMap.put("PRIORITYDATE", priorityDate);
	}else {
		msgdbMap.put("PRIORITYDATE", 20230101);
	}

	transactionGroup = getHeader(map, "PLCN_TransactionGroup");
	transactionGroup = getHeader(map, "PLCN_txnGrp");
	logger.info("dbOperationSepaBatch: transactionGroup = " + transactionGroup);
	if(transactionGroup) {
		msgdbMap.put("TRANSACTIONGROUP", transactionGroup);
	}
	
	var channelIdSource = getHeader(map, "PLCN_channelIdSource");
	//channelIdSource = getHeader(map, "CHANNEL_ID_SOURCE");
	//channelIdSource = getHeader(map, "PLCN_channelSourceId");
	logger.info("dbOperationSepaBatch: channelIdSource = " + channelIdSource); 
	if(channelIdSource){
		msgdbMap.put("CHANNEL_ID_SOURCE", channelIdSource);
	}

	var channelIdTarget = getHeader(map, "PLCN_channelIdTarget");
	//channelIdSource = getHeader(map, "CHANNEL_ID_SOURCE");
	//channelIdSource = getHeader(map, "PLCN_channelSourceId");
	logger.info("dbOperationSepaBatch: channelIdTarget = " + channelIdTarget); 
	if(channelIdSource){
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	}

	var validMessage = getHeader(map, "PLCN_validMessage");
	logger.info("dbOperationSepaBatch: validMessage = " + validMessage);

	var derivedProductCode = getHeader(map, "PLCN_productCode");
	//derivedProductCode = getHeader(map, "DERIVED_PRODUCT");
	//derivedProductCode = getHeader(map, "PLCN_derivedProduct");
	logger.info("dbOperationSepaBatch: derivedProductCode = " + derivedProductCode);

	if(derivedProductCode) {
		msgdbMap.put("DERIVED_PRODUCT", derivedProductCode);
	}

	if(msgType === "pacs.008.001.08"){
		msgdbMap.put("TRANSACTIONGROUP", "CT");	
	}

	if(msgType === 'camt.056.001.08' || msgType === 'camt.029.001.09' || msgType === "pacs.004.001.09"|| msgType === "pacs.007.001.09" || msgType === "pacs.002.001.10"){
		msgdbMap.put("TRANSACTIONGROUP", "ENI");	
	}

	if(msgType === "pacs.003.001.08") {
		msgdbMap.put("TRANSACTIONGROUP", "DD");
	}

	var recordEndMaker = '0';
 	msgdbMap.put("RECORD_END_MARKER", recordEndMaker);

	 var msgdbIdBatch = getHeader(map, "Plcn_BatchMsgDBID");
	 logger.info("dbOperationSepaBatch: msgdbIdBatch = " + msgdbIdBatch);
	 if(msgdbIdBatch){
		 msgdbMap.put("MSGDB_ID_BATCH", msgdbIdBatch);
	 }else {
		msgdbMap.put("MSGDB_ID_BATCH", 0);
	 }

	// var processId = getHeader(map, "PLCN_processId");
	// logger.info("dbOperationSepaBatch: processId = " + processId);
	// if(processId) {
	// 	msgdbMap.put("PROCESS_ID", processId);
	// }else {
	// 	msgdbMap.put("PROCESS_ID", "NONE");
	// }

	var isInput = getHeader(map, "PLCN_ISINPUT");
	logger.info("dbOperationSepaBatch: isInput = " + isInput);

	if(isInput) {
		msgdbMap.put("ISINPUT",isInput);
	}else {
		msgdbMap.put("ISINPUT",'');
	}

	// var isOutput = getHeader(map, "PLCN_ISOUTPUT");
	// logger.info("dbOperationSepaBatch: isOutput = " + isOutput);

	// if(isOutput) {
	// 	msgdbMap.put("ISOUTPUT", isOutput);
	// }else {
	// 	msgdbMap.put("ISOUTPUT", '');
	// }

	msgdbMap.put("ISOUTPUT", "N");

	//logger.info("dbOperationSepaBatch: properties  = " + exchange.getProperties());
	var fDebulkData = exchange.getProperty("Plcn_FileDebulkData");
	var fdUniqueId;

	if(fDebulkData) {
		 fdUniqueId = fDebulkData.getUnique_ID();
	}
	//setHeader(map, "PLCN_twoPhaseCommitId", fdUniqueId);
	logger.info("dbOperationSepaBatch: fdUniqueId  = " + fdUniqueId);

	var fdErrorCount; 
	if(fDebulkData) {
		 fdErrorCount = fDebulkData.getErrorCount();
	}
	logger.info("dbOperationSepaBatch: fdErrorCount = " + fdErrorCount);

	// var twoPhaseCommitId = getHeader(map, "PLCN_twoPhaseCommitId");
	// logger.info("dbOperationSepaBatch: twoPhaseCommitId = " + twoPhaseCommitId);
	if(msgdbId) {
		msgdbMap.put("TWOPHASECOMMIT_ID", msgdbId);
	}	
	var batchMsgdbId = getHeader(map, "Plcn_FileBatchMsgDBID");
	logger.info("dbOperationSepaBatch: batchMsgdbId = " + batchMsgdbId);

	var batchMsgNo = getHeader(map, "Plcn_FileBatchMsgNo");
	logger.info("dbOperationSepaBatch: batchMsgNo = " + batchMsgNo);

	var custom12 = getHeader(map, "PLCN_custom12");
	logger.info("dbOperationSepaBatch: custom12: " + custom12);
	if(custom12){
		msgdbMap.put("CUSTOM12", custom12);
	}else {
		msgdbMap.put("CUSTOM12", "NULL");
	}
	// var custom13 = getHeader(map, "CUSTOM13");
	// logger.info("dbOperationSepaBatch: custom12: " + custom12);
	// if(custom13){
	// 	msgdbMap.put("CUSTOM13", custom13);
	// }else {
	// 	msgdbMap.put("CUSTOM13", "");
	// }

	var custom7 = getHeader(map, "CUSTOM7");
	logger.info("dbOperationSepaBatch: custom7: " + custom7);
	if(custom7){
		msgdbMap.put("CUSTOM7", custom7);
	}else {
		msgdbMap.put("CUSTOM7", "");
	} 

	msgdbMap.put("CUSTOM5", "");

	var custom2 = getHeader(map, "PLCN_custom2");
	logger.info("dbOperationSepaBatch: custom2: " + custom2);
	if(custom2){
		msgdbMap.put("CUSTOM2", custom2);
	}else {
		msgdbMap.put("CUSTOM2", "");
	}

	msgdbMap.put("CUSTOM44", "");

	extractMsgDBData(exchange);

	var origName = getHeader(map, "PLCN_origName");
	logger.info("dbOperationSepaBatch: origName = " + origName);

	if(origName) {
		msgdbMap.put("ORIGNAME", origName);
	}

	var accountDr = getHeader(map, "PLCN_accountDr");
	logger.info("dbOperationSepaBatch: accountDr = " + accountDr);

	if(accountDr) {
		msgdbMap.put("ACCOUNT_DR", accountDr);
	}

	var accountNumber = getHeader(map, "PLCN_accountNumber");
	logger.info("dbOperationSepaBatch: accountNumber = " + accountNumber);

	if(accountNumber) {
		msgdbMap.put("ACCOUNT_NUMBER", accountNumber);
	}

	var customerAccNo = getHeader(map, "PLCN_customerAccNo");
	if(!customerAccNo){
		customerAccNo = getHeader(map, "PLCN_accountDr");
	}
	logger.info("dbOperationSepaBatch: customerAccNo = " + customerAccNo);

	if(customerAccNo) {
		msgdbMap.put("CUSTOMERACCNO", customerAccNo);
	}

	var customer = getHeader(map, "PLCN_customer");
	logger.info("dbOperationSepaBatch: customer = " + customer);

	if(customer) {
		msgdbMap.put("CUSTOMER", customer);
	}

	var origBankName = getHeader(map, "PLCN_origBankName");
	logger.info("dbOperationSepaBatch: origBankName = " + origBankName);

	if(origBankName) {
		msgdbMap.put("ORIGBANKNAME", origBankName);
	}

	var benBankName = getHeader(map, "PLCN_benBankName");
	logger.info("dbOperationSepaBatch: benBankName = " + benBankName);

	if(benBankName) {
		msgdbMap.put("BENBANKNAME", benBankName);
	} else {
		msgdbMap.put("BENBANKNAME", "");
	}

	var benefName = getHeader(map, "PLCN_benefName");
	logger.info("dbOperationSepaBatch: benefName = " + benefName);

	if(benefName) {
		msgdbMap.put("BENEFNAME", benefName);
	}

	var otherPartyDetails = getHeader(map, "PLCN_otherPartyDetails");
	logger.info("dbOperationSepaBatch: otherPartyDetails = " + otherPartyDetails);

	if(otherPartyDetails) {
		msgdbMap.put("OTHER_PARTY_DETAILS", otherPartyDetails);
	}

	var otherAccno = getHeader(map, "PLCN_otherAccno");
	logger.info("dbOperationSepaBatch: otherAccno = " + otherAccno);

	if(otherAccno) {
		msgdbMap.put("OTHER_ACCNO", otherAccno);
	}

	var accountCr = getHeader(map, "PLCN_accountCr");
	logger.info("dbOperationSepaBatch: accountCr = " + accountCr);

	if(accountCr) {
		msgdbMap.put("ACCOUNT_CR", accountCr);
	}

	var benBankAddr1 = getHeader(map, "PLCN_benBankAddr1");
	logger.info("dbOperationSepaBatch: benBankAddr1 = " + benBankAddr1);

	if(benBankAddr1) {
		msgdbMap.put("BENBANKADDR1", benBankAddr1);
	} else {
        msgdbMap.put("BENBANKADDR1", "");
	}

	var benBankAddr2 = getHeader(map, "PLCN_benBankAddr2");
	logger.info("dbOperationSepaBatch: benBankAddr2 = " + benBankAddr2);

	if(benBankAddr2) {
		msgdbMap.put("BENBANKADDR2", benBankAddr2);
	} else {
        msgdbMap.put("BENBANKADDR2", "");
	}

	var benBankAddr3 = getHeader(map, "PLCN_benBankAddr3");
	logger.info("dbOperationSepaBatch: benBankAddr3 = " + benBankAddr3);

	if(benBankAddr3) {
		msgdbMap.put("BENBANKADDR3", benBankAddr3);
	}

	var benBankCity = getHeader(map, "PLCN_benBankCity");
	logger.info("dbOperationSepaBatch: benBankCity = " + benBankCity);

	if(benBankCity) {
		msgdbMap.put("BENBANKCITY", benBankCity);
	}

	var benBankCtry = getHeader(map, "PLCN_benBankCtry");
	logger.info("dbOperationSepaBatch: benBankCtry = " + benBankCtry);

	if(benBankCtry) {
		msgdbMap.put("BENBANKCTRY", benBankCtry);
	}

	var benBankStateCode = getHeader(map, "PLCN_benBankStateCode");
	logger.info("dbOperationSepaBatch: benBankStateCode = " + benBankStateCode);

	if(benBankStateCode) {
		msgdbMap.put("BENBANKSTATECODE", benBankStateCode);
	}

	var benbankzipcode = getHeader(map, "PLCN_benbankzipcode");
	logger.info("dbOperationSepaBatch: benbankzipcode = " + benbankzipcode);

	if(benbankzipcode) {
		msgdbMap.put("BENBANKZIPCODE", benbankzipcode);
	}
	
	//MsgdbBatch
	var msgdbBatchMap = new HashMap();

	msgdbBatchMap.put("MSGDB_ID", batchMsgdbId);

	var totalAmountOfBatch = getHeader(map, "PLCN_totalAmountOfBatch");
	logger.info("dbOperationSepaBatch: total Amount of Batch = " + totalAmountOfBatch);
	if(totalAmountOfBatch){
		msgdbBatchMap.put("MDBBT_CUSTNUM2", totalAmountOfBatch);
	}

	var totalTxnsInBatch = getHeader(map, "PLCN_totalTrxnsInBatch");
	logger.info("dbOperationSepaBatch: total txns in batch = " + totalTxnsInBatch);
	if(!totalTxnsInBatch){
		totalTxnsInBatch = getHeader(map, "PLCNAPI_totalTrxnsInBatch");
		logger.info("dbOperationSepaBatch: total txns in batch = " + totalTxnsInBatch);
	}
	if(totalTxnsInBatch){
		msgdbBatchMap.put("MDBBT_NUM_OF_MSGS", totalTxnsInBatch);
	}

	var lclInstCd = getHeader(map, "PLCN_lclInstCd");
	logger.info("dbOperationSepaBatch: local inst code = " + lclInstCd);
	if(lclInstCd){
		msgdbBatchMap.put("MDBBT_CUSTCHR1", lclInstCd);
	}

	//MsgdbComments

	var msgdbCommentsMap = new HashMap();

	var fileMsgdbId = readMsgdb.get("MSGDB_ID");

	//var msgdbIdFile = getHeader(map, "PLCN_msgDbId");
	logger.info("dbOperationSepaBatch: msgdbIdFile = " + fileMsgdbId);
	if(fileMsgdbId) {
		msgdbCommentsMap.put("MSGDB_ID", fileMsgdbId);
	}

	var msgdbIdChild = getHeader(map, "Plcn_FileBatchMsgDBID");
	logger.info("dbOperationSepaBatch: msgdbId = " + msgdbIdChild);
	if(msgdbIdChild) {
		msgdbCommentsMap.put("MSGDB_ID_CHILD", msgdbIdChild);
	}

	var status = getHeader(map, "PLCN_Status");
	logger.info("dbOperationSepaBatch: Status = " + status);
	if(status) {
		msgdbCommentsMap.put("STATUS", status);
	}else {
		msgdbCommentsMap.put("STATUS", "69");
	}

	var fileMsgdbId = readMsgdb.get("MSGDB_ID");

	if(fileMsgdbId) {
		msgdbCommentsMap.put("TWOPHASECOMMIT_ID", fileMsgdbId);
	}

	var comments = getHeader(map, "PLCN_comments");
	comments = getHeader(map, "PLCN_txnComments");
	logger.info("dbOperationSepaBatch: comments = " + comments);
	if(comments) {
		msgdbCommentsMap.put("COMMENTS", comments);
	}

	var recordGroupType = getHeader(map, "PLCN_recordGroupType");
	logger.info("dbOperationSepaBatch: recordGroupType = " + recordGroupType);
	if(recordGroupType) {
		msgdbCommentsMap.put("RECORD_GROUP_TYPE", recordGroupType);
	}else {
		msgdbCommentsMap.put("RECORD_GROUP_TYPE", "B");
	}

	var reference = getHeader(map, "PLCN_reference");
	logger.info("dbOperationSepaBatch: reference = " + reference);
	if(reference) {
		msgdbCommentsMap.put("REFERENCE", reference);
	}

	var sequenceNum = getHeader(map, "PLCN_sequenceNum");
	//sequenceNum = getHeader(map, "PLCN_transRefNo") + "B-" + getHeader(map, "PLCN_batchSequence"); 
	sequenceNum = "12345";
	logger.info("dbOperationSepaBatch: sequenceNum = " + sequenceNum );
	if(sequenceNum) {
		msgdbCommentsMap.put("SEQUENCENUM", sequenceNum);
	}

	var InstanceId = getHeader(map, "PLCN_instanceId");
	logger.info("dbOperationSepaBatch: InstanceId = " + InstanceId);
	if(InstanceId) {
		msgdbCommentsMap.put("INSTANCEID", "PELICAN1");
	}

	// var validflag = getHeader(map, "PLCN_validMessage");
	// logger.info("dbOperationSepaBatch: outputFileFlag = " + outputFileFlag);
	// if(outputFileFlag &&validflag == 'true') {
	// 	msgdbCommentsMap.put("OUTPUT_FILE_FLAG", "Y");
	// }else {
		msgdbCommentsMap.put("OUTPUT_FILE_FLAG", "Y");
	
	msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	msgdbMap.put("DISPLAY_FLAG", "Y");
	
	if(processingLevel != 'MESSAGE') {
		msgdbMap.put("DISPLAY_FLAG", "N");
	}
	//msgdbMap.put("COMMENTS", comments);
	msgdbMap.put("INSTANCEID","PELICAN1");
    msgdbMap.put("PROCESS_ID", processId);

	insertBatchGenAudit(exchange);

	//setHeader(map, "ACEQ_MSGDBID", batchMsgdbId);
	//setHeader(map, "ACEQ_MESSAGENO", batchMsgNo);

	setHeader(map, "ACEQ_BATCH_WRITE_MSGDB", msgdbMap);
	setHeader(map, "ACEQ_BATCH_WRITE_MSGBLOCKS", list);
	setHeader(map, "ACEQ_BATCH_WRITE_MSGDB_BATCH", msgdbBatchMap);
	setHeader(map, "ACEQ_BATCH_WRITE_MSGDB_COMMENTS", msgdbCommentsMap)
	setHeader(map, "ACEQ_DB_OPERATION", "INSERT");

	logger.info("dbOperationSepaBatch completed");
}

function insertBatchGenAudit(exchange) {
	logger.info("In insertBatchGenAudit rule.");

	var inMsg = exchange.getIn();

	var map = inMsg.getHeaders();
	//logger.trace("insertBatchGenAudit: Map = " + map);
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var writeMsgdbMap = inMsg.getHeaders().get("ACEQ_BATCH_WRITE_MSGDB");
	var readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	var messageNo = getHeader(map, "PLCN_msgNo");
	if(!messageNo) {
		messageNo = readMsgdb.get("MESSAGENO");
	}
	logger.info("insertBatchGenAudit: messageNo = " + messageNo);

	var batchMsgNo = getHeader(map, "PLCN_batchMsgNo");
	if(!batchMsgNo) {
		batchMsgNo = getHeader(map, "Plcn_FileBatchMsgNo");
	}
	logger.info("insertBatchGenAudit: batchMsgNo = " + batchMsgNo);

	var queueId = getHeader(map, "PLCN_batchQueueId");
	
	if(!queueId) {
		queueId = getHeader(map, "PLCN_BatchQueueAudit");
		queueId= getHeader(map, "PLCN_BatchQueue");
	}
	logger.info("insertBatchGenAudit:queueId = " + queueId);

	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("insertBatchGenAudit: institutionId = " + institutionId);

	var audit1 = new HashMap();

	//audit1 = exchange.getIn().getHeader(map, "GENAUDIT");
	//logger.info("insertBatchGenAudit: audit1 = " + audit1);

	audit1.put("MESSAGENO", batchMsgNo);
	//audit.put("AUDITDATETIME", new Date().d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear());
	audit1.put("SEQUENCENO", 123);
	audit1.put("QUEUEID", queueId);
	//audit.put("USERNAME","ADMIN1");
	audit1.put("APPLICATION","ACEQ_CMP");
	audit1.put("MODULENAME","DEBULK");
	audit1.put("ACTION","DEBULK");
	audit1.put("AUDITTEXT","Batch inserted for file No <" + messageNo + ">" + "and wrote to Queue" + "'" + queueId + "'");
	audit1.put("INSTITUTIONID", institutionId);
	//audit.put("AUDITTIMESTAMP", dateTime);

	//genAuditList.add(audit1);

	setHeader(map, "GENAUDIT_BATCH", audit1);

	logger.info("insertBatchGenAudit rule done.");
}

function dbOperationSepaFile(exchange) {
	var inMsg;
	var Document;
	var msgdbMap;
	var map;
	var readMsgdb;
	var audit;
	var comments;
	var sourceChannelId;
	var channelIdTarget;
	var validMessage;
	var msgType;
	var processId;
	var custom14;
	var custom17;
	var twoPhaseCommitId;
	var msgStateMeaning;
	var targetChannelId;
	var institutionId;
	var destCountryCode;
	var localCurrencyAmount;
	var localCurrencyAmountNum;
	var balanceUpdate;
	var transactionType;
	var custom2;
	var transactionGroup;
	var config1;
	var config2;
	var config3;
	var msgBlock91;
	var path;

	logger.info("In dbOperationSepaFile rule.");

	inMsg = exchange.getIn();
	var message = inMsg.getBody(java.lang.String.class);

	var stringMessage = inMsg.getBody(java.lang.String.class);
	//logger.info("dbOperationSepaFile: messageString = " + messageString);


	inMsg = exchange.getIn();
	
	map = inMsg.getHeaders();
	//logger.info("dbOperationSepaFile: exchange headers = " + exchange.getHeaders());
	logger.info("dbOperationSepaFile: Map = " + map);
	msgdbMap = new HashMap();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	
	logger.info("dbOperationSepaFile: ABC " + exchange.getIn().getHeaders());
	var readMsgdbFile = inMsg.getHeaders().get("ACEQ_READ_MSGDB_FILE");

	var msgdbId =  getHeader(map, "PLCN_msgDbId");
	logger.info("dbOperationSepaFile: MSGDB_ID = " + msgdbId);

	var msgDirection = getHeader(map, "PLCN_msgDirection");
 	logger.info("dbOperationSepaFile: msgDirection = " + msgDirection);
	
	var msgClassType = getHeader(map, "PLCN_messageClassType");
	if(!msgClassType){
		msgClassType = readMsgdb.get("MESSAGECLASSTYPE");
	}
	setHeader(map, "PLCN_msgType", msgClassType);
	logger.info("dbOperationSepaFile: msgClassType = " + msgClassType);
	var mode = getHeader(map,"PLCN_mode");
	logger.info("dbOperationSepaFile: Mode = " + mode);
	
	var custom14 = getHeader(map, "PLCN_custom14");
 	logger.info("dbOperationSepaFile: custom14 = " + custom14);
	
  	if(custom14) {
 		msgdbMap.put("CUSTOM14", custom14);
 	}
 	// if(msgDirection == "I") {
 	// 	msgdbMap.put("TRANSACTIONTYPE", "D");
 	// }else {
 	// 	msgdbMap.put("TRANSACTIONTYPE", "C");
 	// } 

 	extractMsgDBData(exchange);

	var msgSegr = getHeader(map, "PLCN_msgSegr");
	if(!msgSegr) {
		msgSegr = readMsgdb.get("MSGSEGR");
	}
	logger.info("dbOperationSepaFile: msgSegr = " + msgSegr);
	if(msgSegr) {
		msgdbMap.put("MSGSEGR", msgSegr);
	}

	//msgdbMap.put("MSGSEGR", "DEFAULT");

	var msgBlocks = inMsg.getHeaders().get("ACEQ_READ_MSGBLOCKS");

	sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	if(!sourceChannelId){
		sourceChannelId = readMsgdb.get("SOURCECHANNELID");
	}
	logger.info("dbOperationSepaFile: sourceChannelId = " + sourceChannelId);
	
	comments = getHeader(map, "PLCN_txnComments");
	logger.info("dbOperationSepaFile: comments = " + comments);

	//validMessage = getHeader(map, "PLCN_validMessage");
	var validflag = getHeader(map, "PLCN_validMessage");
	validflag = validflag.toString();
	logger.info("dbOperationSepaFile: valid Message = " + validflag);
	logger.info("dbOperationSepaFile: typeof validflag = " + typeof validflag);
	
	var queueId = getHeader(map, "PLCN_queueAudit");
	var messageNo = readMsgdb.get("MESSAGENO") 
	logger.info("dbOperationSepaFile: PLCN_queueAudit queueId = " + queueId);
	logger.info("dbOperationSepaFile: messageNo = " + messageNo);

	var msgDirection = readMsgdb.get("MESSAGEDIRECTION");
	logger.info("dbOperationSepaFile: msgDirection = " + msgDirection);
	//logger.info("dbOperationSepaFile: msgDirection = " + msgDirection);

	var mode = getHeader(map,"PLCN_mode");
	logger.info("dbOperationSepaFile: Message Mode = " + mode);
	if(!mode){
		mode = readMsgdb.get("MSG_MODE_IN");
	}
	logger.info("dbOperationSepaFile: Message Mode = " + mode);
	msgdbMap.put("MSG_MODE_IN", mode);

	messageNoSource = getHeader(map, "PLCN_messageNoSource");
 	messageNoSource = getHeader(map, "MESSAGENO_SOURCE");
 	logger.info("dbOperationSepaFile: messageNoSource = " + messageNoSource);

 	if(messageNoSource) {
 		msgdbMap.put("MESSAGENO_SOURCE", messageNoSource);
 	}

 	currentQueueInDate = getHeader(map, "PLCN_currentQueueInDate");
 	logger.info("dbOperationSepaFile: currentQueueInDate = " + currentQueueInDate);
 	if(currentQueueInDate) {
 		msgdbMap.put("CURRQUEUEINDATE", currentQueueInDate);
 	}

 	currentQueueInTime = getHeader(map, "PLCN_currentQueueInTime");
 	currentQueueInTime = getHeader(map, "CURRQUEUEINTIME");
 	logger.info("dbOperationSepaFile: currentQueueInTime = " + currentQueueInTime);
 	if(currentQueueInTime) {
 		msgdbMap.put("CURRQUEUEINTIME", currentQueueInTime)
 	}

 	var priority = getHeader(map, "PLCN_priority");
 	priority = getHeader(map, "PRIORITY")
 	logger.info("dbOperationSepaFile: priority = " + priority);
 	if(priority) {
 		msgdbMap.put("PRIORITY", priority);
 	}

 // 	var priorityAmountNum = getHeader(map, "PLCN_amountNum");
	// priorityAmountNum = getHeader(map, "PLCN_priorityAmountNum");
	// logger.info("dbOperationSepaFile = priorityAmountNum" + priorityAmountNum);
	// if(priorityAmountNum) {
	// 	msgdbMap.put("PRIORITYAMOUNTNUM", priorityAmountNum);
	// }

 	var lockStatus =  getHeader(map, "PLCN_lockStatus");
 	logger.info("dbOperationSepaFile: lockStatus " + lockStatus);
 	if(lockStatus) {
 		msgdbMap.put("LOCKSTATUS", lockStatus);
 	}

  	var numOfMessages = getHeader(map, "PLCN_numOfMessages");
 	//numOfMessages = getHeader(map,"NUM_OF_MSGS");
 	logger.info("dbOperationSepaFile: numOfMessages = " + numOfMessages);
 	if(numOfMessages) {
 		msgdbMap.put("NUMOFMESSAGES", numOfMessages);
 	}

 	var returnCode = getHeader(map, "PLCN_returnCode");
 	logger.info("dbOperationSepaFile: returnCode = " + returnCode);
 	if(returnCode) {
 		msgdbMap.put("RETURNCODE", returnCode);
 	}
 	
 	custom42 = getHeader(map, "PLCN_custom42");
 	logger.info("dbOperationSepaFile: custom42 = " + custom42);
 	if(custom42) {
 		msgdbMap.put("CUSTOM42", custom42);
 	}

 	var msgBlocks = inMsg.getHeaders().get("ACEQ_READ_MSGBLOCKS");

	sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	if(!sourceChannelId){
		sourceChannelId = readMsgdb.get("CHANNEL_ID_SOURCE");
	}
	logger.info("dbOperationSepaFile: sourceChannelId = " + sourceChannelId);

	var channelIdSource = getHeader(map, "PLCN_channelIdSource");
	channelIdSource = getHeader(map, "CHANNEL_ID_SOURCE");
	channelIdSource = getHeader(map, "PLCN_channelSourceId");
	logger.info("dbOperationSepaFile: channelIdSource = " + channelIdSource); 
	if(channelIdSource){
		msgdbMap.put("CHANNEL_ID_SOURCE", channelIdSource);
	}
	
	var currentQueueInDateTime = getHeader(map, "PLCN_currentQueueInDateTime");
	currentQueueInDateTime = getHeader(map, "CURRQUEUEINDATETIME");
	//channelIdSource = getHeader(map, "PLCN_channelSourceId");
	logger.info("dbOperationSepaFile: currentQueueInDateTime = " + currentQueueInDateTime); 
	if(currentQueueInDateTime){
		msgdbMap.put("CURRQUEUEINDATETIME", currentQueueInDateTime);
	}

	institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("dbOperationSepaFile: institutionId = " + institutionId); 
	if(!institutionId) {
		institutionId = readMsgdb.get("INSTITUTIONID");
	}
	msgdbMap.put("INSTITUTIONID", institutionId);

	/* var processId = getHeader(map, "PLCN_processId");

	if(!processId) {
		processId = 'NONE';		
	}
	logger.info("dbOperationSepaFile: processId = " + processId);	
	msgdbMap.put("PROCESS_ID", "NONE"); */
	var key;
	if(institutionId) {
		key  = institutionId.concat(".PROCESSING_LEVEL.PRODUCTS");
	}
	logger.info("dbOperationSepaFile: Key = " + key);
	var processingLevel = memTblGetTableValue(map, "INST_PARAM", key);
	logger.info("dbOperationSepaFile: Processing Level = " + processingLevel);

	var key;
	if(institutionId) {
		key  = institutionId.concat(".PROCESSING_LEVEL.PRODUCTS");
	}
	logger.info("dbOperationSepaFile: Key = " + key);
	var processingLevel = memTblGetTableValue(map, "INST_PARAM", key);

	logger.info("dbOperationSepaFile: Processing Level = " + processingLevel);

	if(processingLevel !== 'MESSAGE') {
		if(msgClassType == 'pacs.008.001.08' || msgClassType === "pacs.003.001.08"){
			processId = getHeader(map, "PLCN_processId");
			if(!processId){
				processId = 'NONE';	
				logger.info("dbOperationSepaFile: processId = " + processId);
				msgdbMap.put("PROCESS_ID", processId);
			}
		}else if(msgClassType == 'pacs.004.001.09' || msgClassType == 'camt.056.001.08' || msgClassType === 'pacs.007.001.09' || msgClassType == 'camt.029.001.09'|| msgClassType == 'pacs.002.001.10' &&(processingLevel != 'MESSAGE')){
			processId = 'TO-MATCH';
			logger.info("dbOperationSepaFile: processId = " + processId);
			msgdbMap.put("PROCESS_ID", processId);
		}else {
			processId = 'TO-MATCH';
			logger.info("dbOperationSepaFile: processId = " + processId);
			msgdbMap.put("PROCESS_ID", processId);
		}
	}else {
		if(msgClassType == 'pacs.008.001.08' || msgClassType === "pacs.003.001.08"){
			processId = getHeader(map, "PLCN_processId");
			if(!processId){
				processId = 'NONE';	
				logger.info("dbOperationSepaFile: processId = " + processId);
				msgdbMap.put("PROCESS_ID", processId);
			}
		}else if(msgClassType == 'pacs.004.001.09' || msgClassType == 'camt.056.001.08' || msgClassType === 'pacs.007.001.09' || msgClassType == 'camt.029.001.09'|| msgClassType == 'pacs.002.001.10' &&(processingLevel == 'MESSAGE')){
			processId = 'TO-MATCH';
			logger.info("dbOperationSepaFile: processId = " + processId);
			msgdbMap.put("PROCESS_ID", processId);
		}else {
			processId = 'TO-MATCH';
			logger.info("dbOperationSepaFile: processId = " + processId);
			msgdbMap.put("PROCESS_ID", processId);
		}
	}	

	var custom37;
	custom37 = '';
	msgdbMap.put("CUSTOM37", custom37);

	comments = getHeader(map, "PLCN_txnComments");
	comments = getHeader(map, "COMMENTS");
	comments = getHeader(map, "PLCN_comments");
	logger.info("dbOperationSepaFile: comments = " + comments);
	if(comments) {
		msgdbMap.put("COMMENTS", comments);
	}
	//validMessage = getHeader(map, "PLCN_validMessage");
	var validflag = getHeader(map, "PLCN_validMessage");
	validflag = validflag.toString();
	logger.info("dbOperationSepaFile: validflag = " + validflag);
	logger.info("dbOperationSepaFile: typeof validflag = " + typeof validflag);
	
	// if(msgClassType == 'pacs.003.001.08' || msgClassType == 'pacs.007.001.09') {
	//   msgdbMap.put("TRANSACTIONTYPE", "C");
	// }else {
	// 	 msgdbMap.put("TRANSACTIONTYPE", "D");
	// }

	if(msgType == "pacs.003.001.08") {
 		logger.info("dbOperationSepaFile: In if of pacs.003");
	 	if(msgDirection == "O") {
	 		logger.info("dbOperationSepaFile: In if of msgDirection == O");
	 		msgdbMap.put("TRANSACTIONTYPE", "D");
	 	}else {
	 		logger.info("dbOperationSepaFile: In else of msgDirection == O");
	 		msgdbMap.put("TRANSACTIONTYPE", "C");
	 	}
 	}else {
 		logger.info("dbOperationSepaFile: In else");
	 	if(msgDirection == "I") {
	 		logger.info("dbOperationSepaFile: In if of msgDirection == I");
	 		msgdbMap.put("TRANSACTIONTYPE", "D");
	 	}else {
	 		logger.info("dbOperationSepaFile: In else of msgDirection == I");
	 		msgdbMap.put("TRANSACTIONTYPE", "C");
	 	}
 	}
	
	// var messageNo = readMsgdb.get("MESSAGENO");
	var messageNo = getHeader(map, "PLCN_batchMsgNo");
	//logger.info("dbOperationSepaFile: queueId = " + queueId);
	logger.info("dbOperationSepaFile: messageNo = " + messageNo);

	//var msgDirection = getHeader(map, "PLCN_msgDirection");	
	logger.info("dbOperationSepaFile: msgDirection = " + msgDirection);

	if(msgDirection) {
		msgdbMap.put("MESSAGEDIRECTION", msgDirection);
	}

	var priority = getHeader(map, "PLCN_priority");
	logger.info("dbOperationSepaFile: priority = " + priority);
	if(!priority) {
		priority = "5";
	}
	if(priority) {
		msgdbMap.put("PRIORITY", priority);
	}
	var sender = getHeader(map, "PLCN_sender");
	var senderPath;
	//sender = getHeader(map, "SENDER");
	logger.info("dbOperationSepaFile: sender = " + sender);
	if(!sender) {
		senderPath = dataBetweenTokens("<InstgAgt>", "</InstgAgt>", stringMessage);
		sender = dataBetweenTokens("<BICFI>", "</BICFI>", senderPath);
	}

	logger.info("dbOperationSepaFile: sender from tag = " + sender);
	if(sender) {
		msgdbMap.put("SENDER", sender);
	}

	var receiver = getHeader(map, "PLCN_receiver");
	var receiverPath;
	//receiver = getHeader(map, "RECEIVER");
	logger.info("dbOperationSepaFile: receiver = " + receiver);
	if(!receiver) {
		receiverPath = dataBetweenTokens("<InstdAgt>", "</InstdAgt>", stringMessage);
		receiver = dataBetweenTokens("<BICFI>", "</BICFI>", receiverPath);
	}
	logger.info("dbOperationSepaFile: receiver from tag = " + receiver);
	if(receiver) {
		msgdbMap.put("RECEIVER", receiver);
	}
	
	priorityDate = valueDateForFile(exchange);
	logger.info("dbOperationSepaFile: priorityDate = " + priorityDate);
	
	if(priorityDate && msgDirection == "I") {
		priorityDate = driveCurrentValueDateRule(exchange, priorityDate);
	}
	logger.info("dbOperationSepaFile: priorityDate = " + priorityDate);

	if(priorityDate) {
		msgdbMap.put("PRIORITYDATE", priorityDate);
	}else {
		msgdbMap.put("PRIORITYDATE", 20230101);
	}

	var priorityAmount = getHeader(map, "PLCN_priorityAmount");
	logger.info("dbOperationSepaFile: priorityAmount = " + priorityAmount);
	if(priorityAmount) {
		msgdbMap.put("PRIORITYAMOUNT", priorityAmount);
	}

	var priorityAmountNum = getHeader(map, "PLCN_priorityAmountNum");
	logger.info("dbOperationSepaFile: priorityAmountNum = " + priorityAmountNum);
	if(priorityAmountNum) {
		msgdbMap.put("PRIORITYAMOUNTNUM", priorityAmountNum);
	}

	var currency = getHeader(map, "PLCN_currency");
	currency = getHeader(map, "PLCNAPI_currency");
	logger.info("dbOperationSepaFile: currency = " + currency);
	if(currency) {
		msgdbMap.put("CURRENCY", currency);
	}

	var msgModeIn = getHeader(map, "PLCN_msgModeIn");
	msgModeIn = getHeader(map, "PLCNAPI_msgModeIn");
	logger.info("dbOperationSepaFile: msgModeIn = " + msgModeIn);
	if(msgModeIn){
		msgdbMap.put("MSG_MODE_IN", msgModeIn);
	}

	var transrefno = getHeader(map, "PLCN_transRefNo");
	transrefno = getHeader(map, "TRANS_REF_NO");
	logger.info("dbOperationSepaFile: transrefno = " + transrefno);
	if(transrefno){
		msgdbMap.put("TRANSREFNO", transrefno);
	}

	var custom8 = getHeader(map, "PLCN_custom8");
	custom8 = getHeader(map, "CUSTOM8");
	logger.info("dbOperationSepaFile: custom8 = " + custom8);
	if(custom8){
		msgdbMap.put("CUSTOM8", custom8);
	}

	var custom11 = getHeader(map, "PLCN_custom11");
	custom11 = getHeader(map, "CUSTOM11");
	logger.info("dbOperationSepaFile: custom11 = " + custom11);
	if(custom11){
		msgdbMap.put("CUSTOM11", custom11);
	}

	var custom40 = getHeader(map, "PLCN_custom40");
	custom40 = getHeader(map, "CUSTOM40");
	logger.info("dbOperationSepaFile: custom40 = " + custom40);
	if(custom40){
		msgdbMap.put("CUSTOM40", custom40);
	}

	var custom50 = getHeader(map, "PLCN_custom50");
	custom50 = getHeader(map, "CUSTOM50");
	logger.info("dbOperationSepaFile: custom50 = " + custom50);
	if(custom50){
		msgdbMap.put("CUSTOM50", custom50);
	}

	var msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	msgFamily = getHeader(map, "PLCN_msgFamily");
	logger.info("dbOperationSepaFile: msgFamily = " + msgFamily);
	if(msgFamily){
		msgdbMap.put("MSG_FAMILY", msgFamily);
	}

	var msgdbIdOrg = getHeader(map, "PLCN_msgdbIdOrg");
	msgdbIdOrg = getHeader(map, "MSGDB_ID_ORG");
	logger.info("dbOperationSepaFile: msgdbIdOrg = " + msgdbIdOrg);
	if(msgdbIdOrg){
		msgdbMap.put("MSGDB_ID_ORG", msgdbIdOrg);
		msgdbMap.put("MSGDB_ID_SOURCE", msgdbIdOrg);
	}
	
	if(validflag == "true"){
		//queueId = "PROCDQ";
		logger.info('validflag == "true"');		
		setHeader(map, "PLCN_queueAudit", "");
	}else if(!queueId) {
		logger.info("dbOperationSepaFile: !queueId");
		if(msgClassType == 'pacs.008.001.08' || msgClassType === "pacs.003.001.08"){
			if(processingLevel != 'MESSAGE') {
				queueId = "SCTTMPFQ";
				setHeader(map, "PLCN_fileQueueAudit", queueId);
				setHeader(map, "PLCN_fileQueue", queueId);
			}else{
				queueId = "FLPROCDQ";
				setHeader(map, "PLCN_fileQueueAudit", queueId);
				setHeader(map, "PLCN_fileQueue", queueId);
			}	
		}else if(msgClassType == 'pacs.004.001.09'|| msgClassType === "pacs.007.001.09" || msgClassType == 'camt.056.001.08' || msgClassType == 'camt.029.001.09' || msgClassType == 'pacs.002.001.10'){
			queueId = "FLPROCDQ";
			setHeader(map, "PLCN_fileQueueAudit", queueId);
			setHeader(map, "PLCN_fileQueue", queueId);
		}
	}

	var queueId = getHeader(map, "PLCN_fileQueueAudit");
	//queueId = getHeader(map, "PLCN_FileQueueId");
	logger.info("dbOperationSepaFile: queueId = " + queueId);
	if(!queueId) {
		queueId = getHeader(map, "PLCN_fileQueue");
		//queueId = getHeader(map, "PLCN_fileQueueAudit");
	}

	var exceptionFlag = getHeader(map, "PLCN_polyglotException");
	logger.info("dbOperationSepaFile: exceptionFlag = " + exceptionFlag);
	
	setHeader(map, "PLCN_fileQueueId", queueId);
	var msg;

	if(queueId){
		msgdbMap.put("QUEUEID", queueId);
	}else if(exceptionFlag == "true"){
		msgdbMap.put("QUEUEID", "ERRFILEQ");
	}
	logger.info("dbOperationSepaFile: queue Id = " + queueId);

	var status = getHeader(map, "PLCN_fileStatus");
	if(!status) {
		status =  getHeader(map, "PLCN_status");
	}
	if(exceptionFlag == "true") {
		status = "69";
	}else if(processingLevel == 'MESSAGE' && msgClassType !== 'pacs.002.001.10'){
		status = "98";
	}else {
		status = "66"
	}
	logger.info("dbOperationSepaFile: status = " + status);
	setHeader(map, "PLCN_fileStatus", status);
	msgdbMap.put("STATUS", status);

	var customerAccNo = getHeader(map, "PLCN_customerAccNo");
	if(!customerAccNo){
		customerAccNo = getHeader(map, "PLCN_accountDr");
	}
	logger.info("dbOperationSepaFile: customerAccNo = " + customerAccNo);

	if(customerAccNo) {
		msgdbMap.put("CUSTOMERACCNO", customerAccNo);
	}

	var origBankName = getHeader(map, "PLCN_origName");
	logger.info("dbOperationSepaFile: origBankName = " + origBankName);

	if(origBankName) {
		msgdbMap.put("ORIGNAME", origBankName);
	}

	var otherPartyDetails = getHeader(map, "PLCN_otherPartyDetails");
	logger.info("dbOperationSepaFile: otherPartyDetails = " + otherPartyDetails);

	if(otherPartyDetails) {
		msgdbMap.put("OTHER_PARTY_DETAILS", otherPartyDetails);
	}

	var otherAccno = getHeader(map, "PLCN_otherAccno");
	logger.info("dbOperationSepaFile: otherAccno = " + otherAccno);

	if(otherAccno) {
		msgdbMap.put("OTHER_ACCNO", otherAccno);
	}
	
	var messageNo = readMsgdb.get("MESSAGENO");
	//messageNo = getHeader(map, "Plcn_FileMsgNo");
	logger.info("dbOperationSepaFile: messageNo =" + messageNo);

	var fileName = readMsgdbFile.get("MDBFL_FILENAME");
	logger.info("dbOperationSepaFile: fileName = " + fileName);

	var sourceQueueId = getHeader(map, "PLCN_queueId");
	if(!sourceQueueId) {
		sourceQueueId = readMsgdb.get("QUEUEID");
	}
	logger.info("dbOperationSepaFile: SourceQueueId = " + sourceQueueId);
	var genAuditList = new ArrayList ();

	audit = new HashMap();

	audit.put("MESSAGENO", messageNo);
	audit.put("SEQUENCENO", 123)
	audit.put("QUEUEID", queueId);
	audit.put("APPLICATION","ACEQ_CMP");
	audit.put("MODULENAME","DEBULK");
	audit.put("ACTION","DEBULK");
	audit.put("AUDITTEXT","Moved file with <File Name: '" + fileName + "'" + "and <File ID: '" + messageNo + "from <Source Queue: '" + sourceQueueId + "'>" + "to <Target Queue: '" + queueId + "'>");
	audit.put("INSTITUTIONID", institutionId);
	
	var list = new ArrayList();

	var Msgblock91 = new HashMap();

	var message = inMsg.getBody(java.lang.String.class);

	Msgblock91.put("MSGBLOCKTYPE", "91");
	
	if(msgClassType === 'pacs.002.001.10'){
		
		var IntrBkSttlmAmtPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt';
		var IntrBkSttlmAmt = getValueFromPath(Document, IntrBkSttlmAmtPath);
		logger.info("b2bPacs002ExtractVar: IntrBkSttlmAmt = " + IntrBkSttlmAmt);
		priorityAmount = priorityAmountForFile(exchange);
		logger.info('dbOperationSepaFile: priorityAmount = ' + priorityAmount);
		priorityAmountNum = priorityAmountForFile(exchange);
		logger.info('dbOperationSepaFile: priorityAmountNum = ' + priorityAmountNum);
		msgdbMap.put("PRIORITYAMOUNT", IntrBkSttlmAmt);
		msgdbMap.put("PRIORITYAMOUNTNUM", IntrBkSttlmAmt);
		setHeader(map,"PLCN_priorityAmount",IntrBkSttlmAmt);
		setHeader(map,"PLCNAPI_priorityAmount",IntrBkSttlmAmt);
		setHeader(map,"PLCN_amount",IntrBkSttlmAmt);
		setHeader(map,"PLCN_priorityAmountNum",IntrBkSttlmAmt);

		logger.info("dbOperationSepaFile: msg type is pacs.002.001.10");
		var msgId = getHeader(map, "PLCN_msgId");
    	logger.info('dbOperationSepaFile: msgId = ' + msgId);

    	var endToend = getHeader(map, "PLCN_endToEnd");
    	logger.info('dbOperationSepaFile: endToend = ' + endToend);
       	/* txnCustom2 = endToend + "¿" + msgId;
    	logger.info('dbOperationSepaFile: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2); */

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepaFile: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepaFile: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}
		
		//added for TBSEETHTY-6392 by VY
		var grpStsPath = '/Document/FIToFIPmtStsRpt/OrgnlGrpInfAndSts/GrpSts';
		var grpStsValue = getValueFromPath(Document, grpStsPath);
		logger.info("b2bPacs002ExtractVar: grpStsValue = " + grpStsValue);
		
		msgdbMap.put("CUSTOM12", grpStsValue);
		
		var orgMsgIdPath = '/Document/FIToFIPmtStsRpt/OrgnlGrpInfAndSts/OrgnlMsgId';
		var orgMsgId = getValueFromPath(Document, orgMsgIdPath);
		if(!orgMsgId){
			orgMsgId = getHeader(map, "PLCN_pmtInfId");
		}
		logger.info("dbOperationSepaFile: orgMsgId =" + orgMsgId);
		
		var orgnlTxIdPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxId';
		var orgnlTxId = getValueFromPath(Document, orgnlTxIdPath);
		logger.info("dbOperationSepaFile: orgnlTxId =" + orgnlTxId); 
		
		var msgDirection1;

		if(msgDirection == "O"){
			logger.info("dbOperationSepaFile: Inside O loop = ");
			msgDirection1 = "I";
		}
		else if(msgDirection == "I"){
			logger.info("dbOperationSepaFile: inside I loop");
			msgDirection1 = "O";
		}
		else{
			msgDirection1 = "I";
		}
		logger.info("dbOperationSepaFile: msgDirection1 = " + msgDirection1);
		
		var recordGroupType1 = getHeader(map, "PLCN_recordGroupType");
		logger.info("dbOperationSepaFile: recordGroupType1 = " + recordGroupType1);
		if(!recordGroupType1) {
			recordGroupType1 = "F";
		}
		var orgnlIntrBkSttlmAmt = getHeader(map, "PLCN_priorityAmountNum");
		
		var mtchTransrefno = "|" + orgMsgId  + "|" + orgnlIntrBkSttlmAmt + "|" + currency + "|" + msgDirection1 + "|" + recordGroupType1;
		logger.info("dbOperationSepaFile: mtchTransrefno = " + mtchTransrefno);
		 
		 var node = dataBetweenTokens("<TxInfAndSts>", "</TxInfAndSts>", message);
		 if(!node){
			 msgdbMap.put("CUSTOM7", mtchTransrefno);
		 }
		if(!(isPatternPresent(message, '<TxInfAndSts>') && isPatternPresent(message, '</TxInfAndSts>'))) {
			msgdbMap.put("CUSTOM7", mtchTransrefno);
		}
		logger.info("checkMsgFamily: MX Message");
		/* /* var node = isXmlNodePresent2(Document, "TxInfAndSts");
		logger.info('dbOperationSepaFile: node = ' + node);
		if(node == false) {
			msgdbMap.put("CUSTOM7", mtchTransrefno);
		} */
		/* msgdbMap.put("CUSTOM7", mtchTransrefno); */ 

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);
    	
		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "FLPROCDQ");
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = FLPROCDQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "66");
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 66');
				setHeader(map, "PLCN_fileQueueId", "FLPROCDQ");
				setHeader(map, "PLCN_fileStatus", "66");
			}
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
		}else {
				//logger.trace('dbOperationSepaFile: outputMsgMx = ' + outputMsgMx);
				//msgBlock91 = msgBlocks.get("MSGBLOCK91");
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = ' + status);
				msgFamily91 = "SEPA";
				if(!queueId || !status) {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "FLPROCDQ");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = FLPROCDQ');
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 102');
					setHeader(map, "PLCN_fileQueueId", "FLPROCDQ");
					setHeader(map, "PLCN_fileStatus", "102");
				}	
			}
			msgBlock91 = dataBetweenTokens("<GrpHdr>", "</GrpHdr>", message);
			msgBlock91 = "<GrpHdr>" + msgBlock91 + "</GrpHdr>";
			var msgBlockGrp91 = dataBetweenTokens("<OrgnlGrpInfAndSts>", "</OrgnlGrpInfAndSts>", message);
			msgBlockGrp91 = "<OrgnlGrpInfAndSts>" + msgBlockGrp91 + "</OrgnlGrpInfAndSts>" ;
			msgBlock91 = msgBlock91 + msgBlockGrp91;
			msgBlock91 = msgBlock91.toString();
	}

	if(msgClassType === 'pacs.004.001.09') {
		/* if(!priorityDate){
			var priorityDatePath = '/Document/PmtRtr/GrpHdr/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, priorityDatePath);
			logger.info("dbOperationSepaFile: priorityDate =" + priorityDate);
			priorityDate = replaceAllPattern(priorityDate, "-", "");
			msgdbMap.put("PRIORITYDATE", priorityDate);
		} */
		logger.info("dbOperationSepaFile: msg type is pacs.004.001.09");
		var msgId = getHeader(map, "PLCN_msgId");
    	logger.info('dbOperationSepaFile: msgId = ' + msgId);

    	var endToend = getHeader(map, "PLCN_endToEnd");
    	logger.info('dbOperationSepaFile: endToend = ' + endToend);
       	/* txnCustom2 = endToend + "¿" + msgId;
    	logger.info('dbOperationSepaFile: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2); */

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepaFile: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepaFile: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);
    	
		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "FLPROCDQ");
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = FLPROCDQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 66');
				setHeader(map, "PLCN_fileQueueId", "FLPROCDQ");
				setHeader(map, "PLCN_fileStatus", "66");
			}
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
		}else {
				//logger.trace('dbOperationSepaFile: outputMsgMx = ' + outputMsgMx);
				//msgBlock91 = msgBlocks.get("MSGBLOCK91");
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = ' + status);
				msgFamily91 = "SEPA";
				if(!queueId || !status) {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "FLPROCDQ");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = FLPROCDQ');
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 102');
					setHeader(map, "PLCN_fileQueueId", "FLPROCDQ");
					setHeader(map, "PLCN_fileStatus", "102");
				}	
			}
			msgBlock91 = dataBetweenTokens("<GrpHdr>", "</GrpHdr>", message);
			msgBlock91 = "<GrpHdr>" + msgBlock91 + "</GrpHdr>";
			msgBlock91 = msgBlock91.toString();
			logger.info('dbOperationSepaFile: CHANNEL_ID_TARGET = ' + channelIdTarget);
			msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
    	}
    
	if(msgClassType === 'pacs.007.001.09') {
		/* if(!priorityDate){
			var priorityDatePath = '/Document/PmtRtr/GrpHdr/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, priorityDatePath);
			logger.info("dbOperationSepaFile: priorityDate =" + priorityDate);
			priorityDate = replaceAllPattern(priorityDate, "-", "");
			msgdbMap.put("PRIORITYDATE", priorityDate);
		} */
		priorityAmount = priorityAmountForFile(exchange);
		logger.info('dbOperationSepaFile: priorityAmount = ' + priorityAmount);
		priorityAmountNum = priorityAmountForFile(exchange);
		logger.info('dbOperationSepaFile: priorityAmountNum = ' + priorityAmountNum);
		msgdbMap.put("PRIORITYAMOUNT", priorityAmount);
		msgdbMap.put("PRIORITYAMOUNTNUM", priorityAmountNum);
		setHeader(map,"PLCN_priorityAmount",priorityAmount);
		setHeader(map,"PLCNAPI_priorityAmount",priorityAmount);
		setHeader(map,"PLCN_amount",priorityAmountNum);
		setHeader(map,"PLCN_priorityAmountNum",priorityAmountNum);
		var msgId = getHeader(map, "PLCN_msgId");
		logger.info('dbOperationSepaFile: msgId = ' + msgId);
	
		var endToend = getHeader(map, "PLCN_endToEnd");
		logger.info('dbOperationSepaFile: endToend = ' + endToend);
	   /* txnCustom2 = endToend + "¿" + msgId;
		logger.info('dbOperationSepaFile: txnCustom2 = ' + txnCustom2);
		msgdbMap.put("CUSTOM2", txnCustom2); */
	
		var custom5 = getHeader(map, "PLCN_custom5Dupl");
		logger.info('dbOperationSepaFile: custom5 = ' + custom5);
		msgdbMap.put("CUSTOM5", custom5);
	
		if(!custom5){
			var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
			logger.info('dbOperationSepaFile: DUPLCUSTOM5 = ' + custom5);
			msgdbMap.put("CUSTOM5", custom5);
		}
	
		var custom44 = getHeader(map, "PLCN_CUSTOM44");
		msgdbMap.put("CUSTOM44", custom44);
			
		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "FLPROCDQ");
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = FLPROCDQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 66');
				setHeader(map, "PLCN_fileQueueId", "FLPROCDQ");
				setHeader(map, "PLCN_fileStatus", "66");
			}
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
			}else {
				//logger.trace('dbOperationSepaFile: outputMsgMx = ' + outputMsgMx);
				//msgBlock91 = msgBlocks.get("MSGBLOCK91");
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = ' + status);
				msgFamily91 = "SEPA";
				if(!queueId || !status) {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "FLPROCDQ");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = FLPROCDQ');
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 102');
					setHeader(map, "PLCN_fileQueueId", "FLPROCDQ");
					setHeader(map, "PLCN_fileStatus", "102");
				}	
			}
			msgBlock91 = dataBetweenTokens("<GrpHdr>", "</GrpHdr>", message);
			msgBlock91 = "<GrpHdr>" + msgBlock91 + "</GrpHdr>";
			msgBlock91 = msgBlock91.toString();
			logger.info('dbOperationSepaFile: CHANNEL_ID_TARGET = ' + channelIdTarget);
			msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
		}		

	if(msgClassType === 'pacs.008.001.08'){
		
		/* if(!priorityDate){
			var priorityDatePath = '/Document/FIToFICstmrCdtTrf/GrpHdr/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, priorityDatePath);
			logger.info("dbOperationSepaFile: priorityDate =" + priorityDate); 
			priorityDate = replaceAllPattern(priorityDate, "-", "");
			msgdbMap.put("PRIORITYDATE", priorityDate);
		} */
 		
    	var msgId = getHeader(map, "PLCN_msgId");
    	logger.info('dbOperationSepaFile: msgId = ' + msgId);

    	var endToend = getHeader(map, "PLCN_endToEnd");
    	logger.info('dbOperationSepaFile: endToend = ' + endToend);
       	/* txnCustom2 = endToend + "¿" + msgId;
    	logger.info('dbOperationSepaFile: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2) */;

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepaFile: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepaFile: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				if(processingLevel != 'MESSAGE') {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "SCTTMPFQ");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = SCTTMPFQ');
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 69');
					setHeader(map, "PLCN_fileQueueId", "SCTTMPFQ");
					setHeader(map, "PLCN_fileStatus", "66");
				}else{
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "FLPROCDQ");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = FLPROCDQ');
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "98");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 98');
					setHeader(map, "PLCN_fileQueueId", "FLPROCDQ");
					setHeader(map, "PLCN_fileStatus", "98");
				}
			}
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
		}else {
				//logger.trace('dbOperationSepaFile: outputMsgMx = ' + outputMsgMx);
				//msgBlock91 = msgBlocks.get("MSGBLOCK91");
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = ' + status);
				msgFamily91 = "SEPA";
				if(!queueId || !status) {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "FLPROCDQ");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = FLPROCDQ');
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 102');
					setHeader(map, "PLCN_fileQueueId", "FLPROCDQ");
					setHeader(map, "PLCN_fileStatus", "102");
				}	
			}
			msgBlock91 = dataBetweenTokens("<GrpHdr>", "</GrpHdr>", message);
			msgBlock91 = "<GrpHdr>" + msgBlock91 + "</GrpHdr>";
			msgBlock91 = msgBlock91.toString();	
	}

	if(msgClassType === 'pacs.003.001.08'){
		/* if(!priorityDate){
			var priorityDatePath = '/Document/FIToFICstmrCdtTrf/GrpHdr/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, priorityDatePath);
			logger.info("dbOperationSepaFile: priorityDate =" + priorityDate); 
			priorityDate = replaceAllPattern(priorityDate, "-", "");
			msgdbMap.put("PRIORITYDATE", priorityDate);
		} */
 		priorityAmount = priorityAmountForFile(exchange);
		logger.info('dbOperationSepaFile: priorityAmount = ' + priorityAmount);
		priorityAmountNum = priorityAmountForFile(exchange);
		logger.info('dbOperationSepaFile: priorityAmountNum = ' + priorityAmountNum);
		msgdbMap.put("PRIORITYAMOUNT", priorityAmount);
		msgdbMap.put("PRIORITYAMOUNTNUM", priorityAmountNum);
		setHeader(map,"PLCN_priorityAmount",priorityAmount);
		setHeader(map,"PLCNAPI_priorityAmount",priorityAmount);
		setHeader(map,"PLCN_amount",priorityAmountNum);
		setHeader(map,"PLCN_priorityAmountNum",priorityAmountNum);
    	var msgId = getHeader(map, "PLCN_msgId");
    	logger.info('dbOperationSepaFile: msgId = ' + msgId);

    	var endToend = getHeader(map, "PLCN_endToEnd");
    	logger.info('dbOperationSepaFile: endToend = ' + endToend);
       	/* txnCustom2 = endToend + "¿" + msgId;
    	logger.info('dbOperationSepaFile: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2) */;

    	var msgIdPath = '/Document/FIToFICstmrDrctDbt/GrpHdr/MsgId';
		var msgIdValue = getValueFromPath(Document, msgIdPath);
		logger.info('dbOperationSepaFile: msgIdValue = ' + msgIdValue);
		if(msgIdValue) {
			msgdbMap.put("TRANSREFNO", msgIdValue);
		}

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepaFile: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepaFile: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				if(processingLevel != 'MESSAGE') {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "SCTTMPFQ");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = SCTTMPFQ');
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 69');
					setHeader(map, "PLCN_fileQueueId", "SCTTMPFQ");
					setHeader(map, "PLCN_fileStatus", "66");
				}else{
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "FLPROCDQ");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = FLPROCDQ');
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "98");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 98');
					setHeader(map, "PLCN_fileQueueId", "FLPROCDQ");
					setHeader(map, "PLCN_fileStatus", "98");
				}
			}
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
		}else {
				//logger.trace('dbOperationSepaFile: outputMsgMx = ' + outputMsgMx);
				//msgBlock91 = msgBlocks.get("MSGBLOCK91");
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
				msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = ' + status);
				msgFamily91 = "SEPA";
				if(!queueId || !status) {
					msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "FLPROCDQ");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = FLPROCDQ');
					msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
					logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 102');
					setHeader(map, "PLCN_fileQueueId", "FLPROCDQ");
					setHeader(map, "PLCN_fileStatus", "102");
				}	
			}
			msgBlock91 = dataBetweenTokens("<GrpHdr>", "</GrpHdr>", message);
			msgBlock91 = "<GrpHdr>" + msgBlock91 + "</GrpHdr>";
			msgBlock91 = msgBlock91.toString();	
	}

	if(msgClassType === 'camt.056.001.08'){
 		
    	var msgId = getHeader(map, "PLCN_msgId");
    	logger.info('dbOperationSepaFile: msgId = ' + msgId);

    	var endToend = getHeader(map, "PLCN_endToEnd");
    	logger.info('dbOperationSepaFile: endToend = ' + endToend);
       	/* txnCustom2 = endToend + "¿" + msgId;
    	logger.info('dbOperationSepaFile: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2); */

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepaFile: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepaFile: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}
		
		var msgIdPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/CxlId';
			var msgIdValue = getValueFromPath(Document, msgIdPath);
			logger.info('dbOperationSepaFile: msgIdValue = ' + msgIdValue);
			if(msgIdValue) {
				msgdbMap.put("TRANSREFNO", msgIdValue);
			}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "FLPROCDQ");
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = FLPROCDQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 69');
				setHeader(map, "PLCN_fileQueueId", "FLPROCDQ");
				setHeader(map, "PLCN_fileStatus", "66");
			}
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
		}else {
			//logger.trace('dbOperationSepaFile: outputMsgMx = ' + outputMsgMx);
			//msgBlock91 = msgBlocks.get("MSGBLOCK91");
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = ' + status);
			msgFamily91 = "SEPA";
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "FLPROCDQ");
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = FLPROCDQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 102');
				setHeader(map, "PLCN_fileQueueId", "FLPROCDQ");
				setHeader(map, "PLCN_fileStatus", "102");
			}	
		}
		msgBlock91 = dataBetweenTokens("<Assgnmt>", "</Assgnmt>", message);
		msgBlock91 = "<Assgnmt>" + msgBlock91 + "</Assgnmt>";
		msgBlock91 = msgBlock91.toString();
	}

	if(msgClassType === 'camt.029.001.09'){
 		
    	var msgId = getHeader(map, "PLCN_msgId");
    	logger.info('dbOperationSepaFile: msgId = ' + msgId);

    	var endToend = getHeader(map, "PLCN_endToEnd");
    	logger.info('dbOperationSepaFile: endToend = ' + endToend);
       	/* txnCustom2 = endToend + "¿" + msgId;
    	logger.info('dbOperationSepaFile: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2); */

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperationSepaFile: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperationSepaFile: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}
		
		var msgIdPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/CxlStsId';
			var msgIdValue = getValueFromPath(Document, msgIdPath);
			logger.info('dbOperationSepaFile: msgIdValue = ' + msgIdValue);
			if(msgIdValue) {
				msgdbMap.put("TRANSREFNO", msgIdValue);
			}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = ' + status);
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "FLPROCDQ");
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = FLPROCDQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "69");
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 69');
				setHeader(map, "PLCN_fileQueueId", "FLPROCDQ");
				setHeader(map, "PLCN_fileStatus", "66");
			}
			setHeader(map, "PLCN_ISOUTPUT", "Y");
			logger.info("Message direction = " + msgDirection);
		}else {
			//logger.trace('dbOperationSepaFile: outputMsgMx = ' + outputMsgMx);
			//msgBlock91 = msgBlocks.get("MSGBLOCK91");
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", queueId);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = ' + queueId);
			msgdbMap.put("NEXT_WORKFLOW_STATUS", status);
			logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = ' + status);
			msgFamily91 = "SEPA";
			if(!queueId || !status) {
				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "FLPROCDQ");
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_QUEUE_ID = FLPROCDQ');
				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperationSepaFile: NEXT_WORKFLOW_STATUS = 102');
				setHeader(map, "PLCN_fileQueueId", "FLPROCDQ");
				setHeader(map, "PLCN_fileStatus", "102");
			}	
		}
		msgBlock91 = dataBetweenTokens("<Assgnmt>", "</Assgnmt>", message);
		msgBlock91 = "<Assgnmt>" + msgBlock91 + "</Assgnmt>";
		msgBlock91 = msgBlock91.toString();
	}

	//logger.trace("dbOperationSepaFile: msgBlock91 = " + msgBlock91);
	Msgblock91.put("MESSAGE", msgBlock91);
	Msgblock91.put("MSGFAMILY", "XML");
	list.add(Msgblock91);

	var msgDirection = getHeader(map, "PLCN_msgDirection");
	logger.info("dbOperationSepaFile: msgDirection = " + msgDirection);

	var displayFlag =  getHeader(map,"PLCN_displayFlagFile");
	var processingStage = getHeader(map,"PLCN_processingStage");
	var authLevel = getHeader(map,"PLCN_currentAuthLevelFile");
	authLevel = getHeader(map, "PLCN_currentAuthLevelFle");

	logger.info("dbOperationSepaFile: PLCN_processingStage = " + processingStage);
	logger.info("dbOperationSepaFile: PLCN_currentAuthLevel = " + authLevel);
	
	if(processingStage){
		msgdbMap.put("PROCESSING_STAGE", processingStage);
		msgdbMap.put("CURRENT_AUTH_LEVEL", authLevel);

		logger.info("dbOperationSepaFile: PROCESSING_STAGE & CURRENT_AUTH_LEVEL values have been set to DB");
	}else {
		if(processingLevel === 'MESSAGE') {
			msgdbMap.put("PROCESSING_STAGE", "FINL");
			logger.info("dbOperationSepaFile: PROCESSING_STAGE = FINL");
		}else {
			msgdbMap.put("PROCESSING_STAGE", "PEND");
			logger.info("dbOperationSepaFile: PROCESSING_STAGE = PEND");
		}
	}

	//var custom11 = getHeader(map, "PLCN_clearingId");
	var custom11 = getHeader(map, "PLCN_clrgIdSet");
	logger.info("dbOperationSepaFile: custom11 = " + custom11);

	if(custom11) {
		msgdbMap.put("CUSTOM11", custom11);
	}

	//"TO_DATE('09/03/2021 12:00:00', 'MM/DD/YYYY HH24:MI:SS')"
	var custom24 = getHeader(map, "PLCN_custom24");
	logger.info("dbOperationSepaFile: custom24 = " + custom24);

	if(custom24) {
		custom24 = "TO_DATE('" + custom24 + "', 'MM/DD/YYYY HH24:MI:SS')";
		logger.info("dbOperationSepaFile: CONSTANT_CUSTOM24 = " + custom24);
		msgdbMap.put("CONSTANT_CUSTOM24", custom24);
	}else {
		msgdbMap.put("CONSTANT_CUSTOM24", "NULL");
		logger.info("dbOperationSepaFile: CUSTOM24 = NULL");
	}
	
	var newPriorityDate = getHeader(map, "PLCN_newPriorityDate");
	logger.info("dbOperationSepaFile: newPriorityDate = " + newPriorityDate);

	if(newPriorityDate) {
		msgdbMap.put("PRIORITYDATE", newPriorityDate);
	}

	transactionGroup = getHeader(map, "PLCN_TransactionGroup");
	logger.info("dbOperationSepaFile: transactionGroup = " + transactionGroup);
	msgdbMap.put("TRANSACTIONGROUP", transactionGroup);

	var validMessage = getHeader(map, "PLCN_validMessage");
	logger.trace("dbOperationSepaFile: validMessage = " + validMessage);

	var derivedProductCode = getHeader(map, "PLCN_productCode");
	logger.info("dbOperationSepaFile: derivedProductCode = " + derivedProductCode);
	
	if(!derivedProductCode){
		drveProductCodeFlagPath = institutionId + "." + "MESSAGE_PROCESSING.FUNCTIONALITY.CHANNEL_MSGTYPE_CONFIG" + "." + sourceChannelId.toUpperCase();
		logger.info("drveProductCode: drveProductCodeFlagPath = " + drveProductCodeFlagPath);

		//logger.trace("drveProductCode: map  = " + map);
		if(drveProductCodeFlagPath){
			drveProductCodeFlag = memTblGetTableValue(map, "INST_PARAM", drveProductCodeFlagPath);
			logger.info("drveProductCode: drveProductCodeFlag = " + drveProductCodeFlag);
		}
		if(mode == "FILE"){
			sourceChannelId =  memTblGetTableValue(map, "NIBC_CHANNEL_TO_MODE", sourceChannelId);
		}
		logger.info("drveProductCode: sourceChannelId = " + sourceChannelId);
		if(mode == "MANUAL" || mode == "UPLOAD") {
			key = mode + "-" + msgClassType;
		}else {
			key = sourceChannelId + "-" + msgClassType;
		}
		logger.info("drveProductCode: key = " + key);
		if(key){
			key = key.trim();
		}
		productCode = memTblGetTableValue(map, "PPAY_PRODUCT_CODE", key);
		logger.info("drveProductCode: productCode = " + productCode);
		if(!isPatternPresent(drveProductCodeFlag, msgClassType)) {
			productCode = "";
		}
		if(productCode) {
			setHeader(map, "PLCN_productCode", productCode);
		}
        derivedProductCode = productCode;
	}
	logger.info("dbOperationSepaFile: derivedProductCode = " + derivedProductCode);

	if(derivedProductCode) {
		msgdbMap.put("DERIVED_PRODUCT", derivedProductCode);
	}

	// var isInput = getHeader(map, "PLCN_ISINPUT");
	// logger.info("dbOperationSepaFile: isInput = " + isInput);

	// if(isInput) {
	// 	msgdbMap.put("ISINPUT",isInput);
	// }else {
	// 	msgdbMap.put("ISINPUT",'');
	// }

	msgdbMap.put("ISINPUT","Y");

	// var isOutput = getHeader(map, "PLCN_ISOUTPUT");
	// logger.info("dbOperationSepaFile: isOutput = " + isOutput);

	// if(isOutput) {
	// 	msgdbMap.put("ISOUTPUT", isOutput);
	// }else {
	// 	msgdbMap.put("ISOUTPUT", '');
	// }

	msgdbMap.put("ISOUTPUT", "N");
	
	if(newPriorityDate) {
		msgdbMap.put("PRIORITYDATE", newPriorityDate);
	}

	if(msgClassType === "pacs.008.001.08"){
		msgdbMap.put("TRANSACTIONGROUP", "CT");	
	}

	if(msgClassType === 'camt.056.001.08' || msgClassType === 'camt.029.001.09' || msgClassType === "pacs.004.001.09"|| msgClassType === "pacs.007.001.09" || msgClassType === "pacs.002.001.10"){
		msgdbMap.put("TRANSACTIONGROUP", "ENI");	
	}

	if(msgClassType === "pacs.003.001.08") {
		msgdbMap.put("TRANSACTIONGROUP", "DD");
	}

	//logger.info("dbOperationSepaFile: properties  = " + exchange.getProperties());
	var fDebulkData = exchange.getProperty("Plcn_FileDebulkData");
	var fdUniqueId;

	if(fDebulkData) {
		 fdUniqueId = fDebulkData.getUnique_ID();
	}
	//setHeader(map, "PLCN_twoPhaseCommitId", fdUniqueId);
	logger.info("dbOperationSepaFile: fdUniqueId  = " + fdUniqueId);

	var fdErrorCount; 
	if(fDebulkData) {
		 fdErrorCount = fDebulkData.getErrorCount();
	}
	logger.info("dbOperationSepaFile: fdErrorCount = " + fdErrorCount);

	var twoPhaseCommitId = readMsgdb.get("MSGDB_ID");
	logger.info("dbOperationSepaFile: twoPhaseCommitId = " + twoPhaseCommitId);
	if(twoPhaseCommitId) {
		msgdbMap.put("TWOPHASECOMMIT_ID", twoPhaseCommitId);
	}	
	setHeader(map, "PLCN_twoPhaseCommitId", twoPhaseCommitId);

	msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	msgdbMap.put("DISPLAY_FLAG", "Y");
	msgdbMap.put("COMMENTS", comments);
	msgdbMap.put("INSTANCEID","PELICAN1");
    msgdbMap.put("PROCESS_ID", processId);  
	
	insertMsgdbCommentsAndMsgdbOutput(exchange);

	setHeader(map, "ACEQ_WRITE_MSGDB", msgdbMap);
	setHeader(map, "ACEQ_WRITE_MSGBLOCKS", list);
	setHeader(map, "ACEQ_DB_OPERATION", "UPDATE");
	setHeader(map, "GENAUDIT", audit);

	logger.info("dbOperationSepaFile completed");
}

function insertMsgdbCommentsAndMsgdbOutput(exchange) {
	logger.info("In insertMsgdbCommentsAndMsgdbOutput rule..");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	var queueId = getHeader(map, "PLCN_fileQueueId");
	logger.info("insertMsgdbCommentsAndMsgdbOutput: queueId = " + queueId);
	
	var status = getHeader(map, "PLCN_fileStatus");
	logger.info("insertMsgdbCommentsAndMsgdbOutput: status = " + status);

	var validflag = exchange.getProperty("Status");
	logger.info("insertMsgdbCommentsAndMsgdbOutput: validFlag = " + validflag);

	//MsgdbComments

	var msgdbCommentsMap = new HashMap();

	var msgdbIdFile = readMsgdb.get("MSGDB_ID");
	logger.info("insertMsgdbCommentsAndMsgdbOutput: msgdbIdFile = " + msgdbIdFile);
	if(msgdbIdFile) {
		msgdbCommentsMap.put("MSGDB_ID", msgdbIdFile);
	}
	setHeader(map, "PLCN_fileMsgdbId", msgdbIdFile);

	var msgdbIdChild = getHeader(map, "Plcn_FileBatchMsgDBID");
	logger.info("insertMsgdbCommentsAndMsgdbOutput: msgdbId = " + msgdbIdChild);
	
	if(!msgdbIdChild) {
		msgdbIdChild = "21";
	}
	if(msgdbIdChild) {
		msgdbCommentsMap.put("MSGDB_ID_CHILD", msgdbIdChild);
	}
	setHeader(map, "PLCN_childId", msgdbIdChild);

	var status = getHeader(map, "PLCN_Status");
	logger.info("insertMsgdbCommentsAndMsgdbOutput: Status = " + status);
	if(status) {
		msgdbCommentsMap.put("STATUS", status);
	}else {
		msgdbCommentsMap.put("STATUS", "66");
	}
	setHeader(map, "PLCN_status", status);

	var fileMsgdbId = readMsgdb.get("MSGDB_ID");

	if(fileMsgdbId) {
		msgdbCommentsMap.put("TWOPHASECOMMIT_ID", fileMsgdbId);
	}
	setHeader(map, "PLCN_tCommitId", fileMsgdbId);

	var comments = getHeader(map, "PLCN_comments");
	comments = getHeader(map, "PLCN_txnComments");
	logger.info("insertMsgdbCommentsAndMsgdbOutput: comments = " + comments);
	if(!comments) {
		comments = readMsgdb.get("COMMENTS");
	}
	if(comments) {
		msgdbCommentsMap.put("COMMENTS", comments);
	}
	setHeader(map, "PLCN_fileComments", comments);

	var recordGroupType = getHeader(map, "PLCN_recordGroupType");
	logger.info("insertMsgdbCommentsAndMsgdbOutput: recordGroupType = " + recordGroupType);
	if(recordGroupType) {
		msgdbCommentsMap.put("RECORD_GROUP_TYPE", recordGroupType);
	}else {
		msgdbCommentsMap.put("RECORD_GROUP_TYPE", "F");
	}
	setHeader(map, "PLCN_recordGroupType", recordGroupType);

	var reference = getHeader(map, "PLCN_reference");
	logger.info("insertMsgdbCommentsAndMsgdbOutput: reference = " + reference);
	if(reference) {
		msgdbCommentsMap.put("REFERENCE", reference);
	}
	setHeader(map, "PLCN_reference", reference);

	var sequenceNum = getHeader(map, "PLCN_sequenceNum");
	//sequenceNum = getHeader(map, "PLCN_transRefNo") + "B-" + getHeader(map, "PLCN_batchSequence"); 
	sequenceNum = "12345";
	logger.info("insertMsgdbCommentsAndMsgdbOutput: sequenceNum = " + sequenceNum );
	if(sequenceNum) {
		msgdbCommentsMap.put("SEQUENCENUM", sequenceNum);
	}
	setHeader(map, "PLCN_seqNum", sequenceNum);

	var InstanceId = getHeader(map, "PLCN_instanceId");
	logger.info("insertMsgdbCommentsAndMsgdbOutput: InstanceId = " + InstanceId);
	if(InstanceId) {
		msgdbCommentsMap.put("INSTANCEID", "PELICAN1");
	}
	setHeader(map, "PLCN_instanceId", "PELICAN1");

	var validflag = getHeader(map, "PLCN_validMessage");
	logger.info("insertMsgdbCommentsAndMsgdbOutput: validflag = " + validflag);
	if(validflag == 'true') {
		msgdbCommentsMap.put("OUTPUT_FILE_FLAG", "Y");
	}else {
		msgdbCommentsMap.put("OUTPUT_FILE_FLAG", "N");
	}
	setHeader(map, "PLCN_outputFileFlag", "Y");

	//msgdbOutput
	var mdbOutputMode;
	var msgDirection = readMsgdb.get("MESSAGEDIRECTION");
	logger.info("insertMsgdbCommentsAndMsgdbOutput: msgDirection = " + msgDirection);
	if(msgDirection == "I") {
		mdbOutputMode = "SENT";
	}else {
		mdbOutputMode = "RECEIVE";
	}
	setHeader(map, "PLCN_OutPutmode", mdbOutputMode);

	//setHeader(map, "ACEQ_WRITE_MSGDB_COMMENTS", msgdbCommentsMap);
	//setHeader(map, "ACEQ_DB_OPERATION", "INSERT");

	logger.info("insertMsgdbCommentsAndMsgdbOutput completed.");

}

function dbOperationSepaTwoPhaseCommit(exchange) {
	logger.info("In dbOperationSepaTwoPhaseCommit rule..");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var msgdbOutputMap = new HashMap();
	var msgdbCommentsMap = new HashMap();
	var msgdbMap = new HashMap();
	var mdbOutStatus;
	var mdbOutMode;
	var instanceId;
	var fileStatus;
	var txnStatus;
	var batchStatus;
	var twoPhaseCommitId;
	var msgdbId;
	var msgdbIdChild;

	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	mdbOutStatus = "F";
	msgdbOutputMap.put("MDBOUT_STATUS", mdbOutStatus);

	mdbOutStatus = "T";
	setHeader(map, "PLCN_mdbOutStatus", mdbOutStatus);

	mdbOutMode = getHeader(map, "PLCN_mode");
	logger.info("dbOperationSepaTwoPhaseCommit: mdboutMode = " + mdbOutMode)
	
	if(mdbOutMode) {
		msgdbOutputMap.put("MDBOUT_MODE", mdbOutMode);
		setHeader(map, "PLCN_mdbOutMode", mdbOutMode);
	}

	msgdbId = getHeader(map, "PLCN_msgDbId");
	logger.info("dbOperationSepaTwoPhaseCommit: msgdbId = " + msgdbId);
	if(msgdbId){
		msgdbCommentsMap.put("MSGDB_ID", msgdbId);
	}

	instanceId = "PELICAN1";
	msgdbOutputMap.put("INSTANCEID", instanceId);
	msgdbCommentsMap.put("INSTANCEID", instanceId);
	setHeader(map, "PLCN_instanceId", instanceId);

	var prevStatus = "66";
	msgdbMap.put("STATUS", prevStatus);

	fileStatus = getHeader(map, "PLCN_fileStatus");
	logger.info("dbOperationSepaTwoPhaseCommit: File Status = " + fileStatus);

	fileStatus = "69";
	msgdbCommentsMap.put("STATUS", fileStatus);

	msgdbIdChild = getHeader(map, "PLCN_msgDbId");
	msgdbIdChild = getHeader(map, "Plcn_FileTxnMsgDBID");
	if(!msgdbIdChild) {
		msgdbIdChild = "18";
	}
	setHeader(map, "PLCN_msgdbIdChild", msgdbIdChild);
	msgdbCommentsMap.put("MSGDB_ID_CHILD", msgdbIdChild);
	logger.info("dbOperationSepaTwoPhaseCommit: msgdbIdChild = " + msgdbIdChild);

	txnStatus = getHeader(map, "PLCN_txnStatus");
	logger.info("dbOperationSepaTwoPhaseCommit: Txn Status");
	if(txnStatus) {
		msgdbCommentsMap.put("STATUS", txnStatus);
		msgdbMap.put("STATUS", txnStatus);
	}else {
		msgdbCommentsMap.put("STATUS", "69");
		msgdbMap.put("STATUS", "69");
	}
	logger.info("dbOperationSepaTwoPhaseCommit: Txn Status");
	// msgdbMap.put("STATUS", status);
	// msgdbMap.put("INSTANCEID", instanceId);

	//logger.info("dbOperationSepaTwoPhaseCommit: properties  = " + exchange.getProperties());
	var fDebulkData = exchange.getProperty("Plcn_FileDebulkData");
	var fdUniqueId = fDebulkData.getUnique_ID();
	//setHeader(map, "PLCN_twoPhaseCommitId", fdUniqueId);

	twoPhaseCommitId = readMsgdb.get("MSGDB_ID");
	logger.info("dbOperationSepaTwoPhaseCommit: twoPhaseCommitId = " + twoPhaseCommitId);
	//setHeader(map, "PLCN_twoPhaseCommitId", fdUniqueId);
	if(twoPhaseCommitId) {
		msgdbMap.put("TWOPHASECOMMIT_ID", msgdbId);
		msgdbCommentsMap.put("TWOPHASECOMMIT_ID", msgdbId);
	}
	setHeader(map, "PLCN_twoPhaseCommitId", twoPhaseCommitId.toString());

	batchStatus = getHeader(map, "batchStatus");
	logger.info("dbOperationSepaTwoPhaseCommit: Batch Status = " + batchStatus);

	var msgdbIdBatch = getHeader(map, "PLCN_msgDbIdBatch");
	logger.info("dbOperationSepaTwoPhaseCommit: msgdbIdBatch = " + msgdbIdBatch);
	setHeader(map, "PLCN_msgdbIdBatch", msgdbIdBatch);

	// msgdbIdChild = "18";
	// setHeader(map, "PLCN_msgdbIdChild", msgdbIdChild);
	// msgdbMap.put("MSGDB_ID_CHILD", msgdbIdChild);

	if(batchStatus) {
		msgdbCommentsMap.put("STATUS", batchStatus);
		msgdbMap.put("STATUS", batchStatus);
	}else {
		msgdbCommentsMap.put("STATUS", "69");
		msgdbMap.put("STATUS", "69");	
	}

	setHeader(map, "ACEQ_WRITE_MSGDB", msgdbMap);
	setHeader(map, "ACEQ_WRITE_MSGDB_OUTPUT", msgdbOutputMap);
	setHeader(map, "ACEQ_WRITE_MSGDB_COMMENTS", msgdbCommentsMap);
	logger.info("dbOperationSepaTwoPhaseCommit: msgdbCommentsMap = " + msgdbCommentsMap);
	setHeader(map, "ACEQ_DB_OPERATION", "UPDATE");

	logger.info("dbOperationSepaTwoPhaseCommit rule completed..")
}

function dbOperationSepaError(exchange) {
	logger.info("In dbOperationSepaError rule..");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var msgdbOutputMap = new HashMap();
	var msgdbCommentsMap = new HashMap();
	var msgdbMap = new HashMap();
	var genaudit = new HashMap();
	var msgdbPayMap = new HashMap();
	var msgBlocksMap = new HashMap();
	
	var readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	var readMsgdbFile = inMsg.getHeaders().get("ACEQ_READ_MSGDB_FILE");
	var status = "69";
	msgdbCommentsMap.put("STATUS", status);

	var comments = readMsgdb.get("COMMENTS");
	logger.info("dbOperationSepaError: comments = " + comments);

	var processingStage = getHeader(map, "PLCN_processingStage");
	logger.info("dbOperationSepaError: processingStage = " + processingStage);
	if(processingStage) {
		setHeader(map, "PLCN_processingStage", processingStage);
	}else {
		setHeader(map, "PLCN_processingStage", "ERR");
	}

	if(isPatternPresent(comments, "8465")) {
		comments = "";
	}
	comments = getHeader(map, "PLCN_fileComments");
	logger.info("dbOperationSepaError: comments = " + comments);
	if(comments) {
		msgdbMap.put("COMMENTS", comments);
	}

	var twoPhaseCommitId = getHeader(map, "PLCN_twoPhaseCommitId");
	logger.info("dbOperationSepaError: twoPhaseCommitId = " + twoPhaseCommitId);
	if(!twoPhaseCommitId) {
		twoPhaseCommitId = readMsgdb.get("MSGDB_ID");
	}
	if(twoPhaseCommitId) {
		msgdbCommentsMap.put("TWOPHASECOMMIT_ID", twoPhaseCommitId);
	}
	logger.info("dbOperationSepaError: twoPhaseCommitId = " + twoPhaseCommitId);
	setHeader(map, "PLCN_twoPhaseCommitId", twoPhaseCommitId);

	var msgdbId = getHeader(map, "PLCN_msgDbId");
	logger.info("dbOperationSepaError: msgdbId = " + msgdbId);
	if(msgdbId) {
		msgdbCommentsMap.put("MSGDB_ID", msgdbId);
	}
	setHeader(map, "PLCN_msgdbFile", msgdbId);

	var instanceId = "PELICAN1";
	msgdbCommentsMap.put("INSTANCEID", instanceId);

	var messageNo = getHeader(map, "PLCN_messageNo");
	logger.info("dbOperationSepaError: messageNo = " + messageNo);	
	if(messageNo) {
		genaudit.put("MESSAGENO", messageNo);
	}

	var institutionId = getHeader(map, "PLCN_institutionId");
	//institutionId = getHeader(map, "PLCN_institutionId1");
	if(!institutionId) {
		institutionId = readMsgdb.get("INSTITUTIONID");
	}
	logger.info("dbOperationSepaError: institutionId = " + institutionId);
	if(institutionId) {
		genaudit.put("INSTITUTIONID", institutionId);
	}

	 var msgFamily = "SEPA";
	// genaudit.put("MSG_FAMILY", msgFamily);

	// genaudit.put("TWOPHASECOMMIT_ID", twoPhaseCommitId);

	//genaudit.put("INSTANCEID", instanceId);
	var sourceQueueId = getHeader(map, "PLCN_fileQueueAudit");
	if(!sourceQueueId) {
		sourceQueueId = readMsgdb.get("QUEUEID");
	}

	var msgNoSource = getHeader(map, "PLCN_messageNoSource");
	logger.info("dbOperationSepaError: msgNoSource " + msgNoSource);
	if(msgNoSource) {
		genaudit.put("MESSAGENO_SOURCE", msgNoSource);
	}

	var txnMsgdbId = getHeader(map, "Plcn_FileTxnMsgDBID");
	if(txnMsgdbId) {
		msgBlocksMap.put("MSGDB_ID", txnMsgdbId);
	}

	var msgDirection = readMsgdb.get("MESSAGEDIRECTION");
	logger.info("dbOperationSepaError: msgDirection = " + msgDirection);

	var resubmitQueueId ;
	if(msgDirection == "I") {
		resubmitQueueId = "CFCTOBFQ";
	}else {
		resubmitQueueId = "CFCTINFQ";
	}

	setHeader(map, "PLCN_queueIdError", "ERRFILEQ");
	setHeader(map, "PLCN_resubmitQueueId",resubmitQueueId);
	setHeader(map, "PLCN_currentAuthLevel","AUTH=2|DUPL=4|PENT=4|APRV=4|REPR=4|PAUS=4|WITH=2|WRHS=4|ERR=2|HASH=4|PEND=4|FINL=4|CHNR=4|MTCH=2");
	setHeader(map, "PLCN_fileComments", 'P00-1:A00:00-11708');
	// msgdbMap.put("QUEUEID", "ERRFILEQ");
	// msgdbMap.put("STATUS", "69");
	// msgdbMap.put("DISPLAY_FLAG", "Y");
	// msgdbMap.put("RESUBMIT_QUEUEID", resubmitQueueId);
	// msgdbMap.put("RESUBMIT_STATUS", "69");
	// msgdbMap.put("CURRENT_AUTH_LEVEL", "AUTH=2|DUPL=4|PENT=4|APRV=4|REPR=4|PAUS=4|WITH=2|WRHS=4|ERR=2|HASH=4|PEND=4|FINL=4|CHNR=4|MTCH=2");

	var fileName = readMsgdbFile.get("MDBFL_FILENAME");

	var audit = new HashMap();

	audit.put("MESSAGENO", messageNo);
	audit.put("SEQUENCENO", 123)
	audit.put("QUEUEID", "ERRFILEQ");
	audit.put("APPLICATION","ACEQ_CMP");
	audit.put("MODULENAME","DEBULK");
	audit.put("ACTION","DEBULK");
	audit.put("AUDITTEXT","Moved file with <File Name: '" + fileName + "'" + "and <File ID: '" + msgNoSource + "from <Source Queue: '" + sourceQueueId + "'>" + "to <Target Queue: 'ERRFILEQ'>");
	audit.put("INSTITUTIONID", institutionId);

	var txnStatus = "66";
	msgBlocksMap.put("STATUS", txnStatus);
	msgBlocksMap.put("TWOPHASECOMMIT_ID", twoPhaseCommitId);
	msgBlocksMap.put("INSTANCEID", instanceId);
	msgBlocksMap.put("MESSAGENO_SOURCE", msgNoSource);
	
	msgdbPayMap.put("MSGDB_ID", txnMsgdbId);
	msgdbPayMap.put("STATUS", txnStatus);
	msgdbPayMap.put("MSG_FAMILY", msgFamily);
	msgdbPayMap.put("MESSAGENO_SOURCE", msgNoSource);
	msgdbPayMap.put("TWOPHASECOMMIT_ID", twoPhaseCommitId);
	msgdbPayMap.put("INSTANCEID", instanceId);

	msgdbMap.put("STATUS", txnStatus);
	msgdbMap.put("MSG_FAMILY", msgFamily);

	var recordGroupType = "B";
	msgdbMap.put("RECORD_GROUP_TYPE", recordGroupType);
	msgdbMap.put("MESSAGENO_SOURCE", msgNoSource);
	msgdbMap.put("TWOPHASECOMMIT_ID", twoPhaseCommitId);
	msgdbMap.put("INSTANCEID", instanceId);
	var queueId = getHeader(map, "PLCN_batchQueueId");
	if(queueId){
		msgdbMap.put("QUEUEID", queueId);
	}
	msgdbMap.put("MSGDB_ID_SOURCE", msgdbId);


	setHeader(map, "ACEQ_WRITE_MSGDB", msgdbMap);
	setHeader(map, "ACEQ_WRITE_MSGDB_OUTPUT", msgdbPayMap);
	setHeader(map, "ACEQ_WRITE_MSGDB_PAY", msgdbPayMap);
	setHeader(map, "ACEQ_WRITE_MSGBLOCKS", msgBlocksMap);
	setHeader(map, "ACEQ_WRITE_MSGDB_COMMENTS", msgdbCommentsMap);
	setHeader(map, "ACEQ_DB_OPERATION", "UPDATE");
	setHeader(map, "GENAUDIT", audit);

	logger.info("dbOperationSepaError rule completed..")
}

function setcustom13Header(exchange) {
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	var custom13 = readMsgdb.get("CUSTOM13");
	logger.info("setcustom13Header: custom13 = " + custom13);

	if(!custom13){
		custom13 = getHeader(map, "PLCN_custom13");
		logger.info("setcustom13Header: custom13 from header = " + custom13);
	}

	if(isPatternPresent(custom13, "VALIDATE=D")){
		setHeader(map, "PLCN_custom13ValFlag", true);
		setHeader(map, "PLCN_txnForceStopCounter", 0);
		setHeader(map, "PLCN_errorCountAdd", "Y"); 
		setHeader(map, "PLCN_validMessage", true);
		setHeader(map, "status", "valid");
	}else{
		setHeader(map, "PLCN_custom13ValFlag", false);
	}

	if(isPatternPresent(custom13, "DUPLICATE=D")){
		setHeader(map, "PLCN_custom13DuplFlag", true);
		setHeader(map, "PLCN_duplicateMessage", false);
	}else{
		setHeader(map, "PLCN_custom13DuplFlag", false);
	}

	if(isPatternPresent(custom13, "REPAIR=D")){
		setHeader(map, "PLCN_custom13ReprFlag", true);
	}else{
		setHeader(map, "PLCN_custom13ReprFlag", false);
	}
	logger.info("setcustom13Header: PLCN_custom13ValFlag = " + getHeader(map, "PLCN_custom13ValFlag"));
	logger.info("setcustom13Header: PLCN_custom13DuplFlag = " + getHeader(map, "PLCN_custom13DuplFlag"));
	logger.info("setcustom13Header: PLCN_custom13ReprFlag = " + getHeader(map, "PLCN_custom13ReprFlag"));
	logger.info("setcustom13Header: custom13 = " + custom13);

}

function deriveServiceConfigured(exchange) {
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	var msgdbMap = new HashMap();
	var audit = new HashMap();

	var productCode;
    var institutionId;
    var custom13;
	var channelIdSource;
    var cashForcasting;
    var scanning;
    var authorize
    var preWareHouse;
    var disposition;
	var matching;
	var review;

	var custom13 = readMsgdb.get("CUSTOM13");
	logger.info("deriveServiceConfigured: custom13 = " + custom13);

	productCode = readMsgdb.get("DERIVED_PRODUCT");
	logger.info("deriveServiceConfigured: productCode = " + productCode);

	institutionId =  readMsgdb.get("INSTITUTIONID");

	//For testing
	var msgType = getHeader(map, "PLCN_msgType");
	logger.info("deriveServiceConfigured: msgType = " + msgType);

	if(!productCode){
		var productCode = drveProductCode(exchange);
		logger.info("deriveServiceConfigured: derivedProductCode = " + productCode);
	}

	if(productCode){
		productCode = productCode.trim();
		logger.info("deriveServiceConfigured: productCode after trim = " + productCode);
	}
	productCode = getHeader(map, "PLCN_productCode");
	logger.info("deriveServiceConfigured: Product Code = " + productCode);

	var preWrhsPath = institutionId.concat(".PROCESSING_STAGES.PRE_WAREHOUSE.PRODUCTS");
	logger.info("deriveServiceConfigured: preWrhsPath = " + preWrhsPath);
	var preWrhsCode = memTblGetTableValue(map, "INST_PARAM", preWrhsPath);
	logger.info("deriveServiceConfigured: preWrhsCode = " + preWrhsCode);

	var matchingPath = institutionId.concat(".PROCESSING_STAGES.MATCHING.PRODUCTS");
	logger.info("deriveServiceConfigured: matchingPath = " + matchingPath);
	var matchingCode = memTblGetTableValue(map, "INST_PARAM", matchingPath);
	logger.info("deriveServiceConfigured: matchingCode = " + matchingCode);

	var scanningPath = institutionId.concat(".PROCESSING_STAGES.SANCTION_SCANNING.PRODUCTS");
	logger.info("deriveServiceConfigured: scanningPath = " + scanningPath);
	var scanningCd = memTblGetTableValue(map, "INST_PARAM", scanningPath);
	logger.info("deriveServiceConfigured: scanningCode = " + scanningCd);

	var cashForcastingPath = institutionId.concat(".PROCESSING_STAGES.CASH_FORECASTING.PRODUCTS");
	logger.info("deriveServiceConfigured: cashForcastingPath = " + cashForcastingPath);
	cashForcasting = memTblGetTableValue(map, "INST_PARAM", cashForcastingPath);
	logger.info("deriveServiceConfigured: cashForcasting Code = " + cashForcasting);

	var dispositionPath = institutionId.concat(".PROCESSING_STAGES.DISPOSITION.PRODUCTS");
	logger.info("deriveServiceConfigured: dispositionPath = " + dispositionPath);
	disposition = memTblGetTableValue(map, "INST_PARAM", dispositionPath);
	logger.info("deriveServiceConfigured: disposition code = " + disposition);

	var authorizePath = institutionId.concat(".PROCESSING_STAGES.AUTHORIZE.PRODUCTS");institutionId + "."+ "PROCESSING_STAGES.AUTHORIZE" + "." + "AMOUNT_CAP" + "." + "BASED_ON_SWIFT_PRODUCT_CODE";
	logger.info("deriveServiceConfigured: authorizePath = " + authorizePath);
	var authorizeCode = memTblGetTableValue(map, "INST_PARAM", authorizePath);
	logger.info("deriveServiceConfigured: authorize code = " + authorizeCode);

	var authorizePath1 = institutionId + "."+ "PROCESSING_STAGES.AUTHORIZE" + "." + "AMOUNT_CAP" + "." + "BASED_ON_SWIFT_PRODUCT_CODE";
	logger.info("deriveServiceConfigured: authorizePath = " + authorizePath1);
	var authorizeCode1 = memTblGetTableValue(map, "INST_PARAM", authorizePath1);
	logger.info("deriveServiceConfigured: authorize code = " + authorizeCode1);

	var duplicatePath = institutionId.concat(".PROCESSING_STAGES.DUPLICATE_CHECK.PRODUCTS");
	logger.info("deriveServiceConfigured: duplicatePath = " + duplicatePath);
	var duplicateCode = memTblGetTableValue(map, "INST_PARAM", duplicatePath);
	logger.info("deriveServiceConfigured: duplicate code = " + duplicateCode);

	/*var duplicatePath1 = institutionId.concat(".MESSAGE_PROCESSING.FUNCTIONALITY.DUPLICATE_CHECK.BASED_ON_HASHCODE.DUP_CHK_TYP_HASH");
	logger.info("deriveServiceConfigured: duplicatePath = " + duplicatePath1);
	var duplicateCode1 = memTblGetTableValue(map, "INST_PARAM", duplicatePath1);
	logger.info("deriveServiceConfigured: duplicate code hashcode check = " + duplicateCode1);*/

	var accountingPath = institutionId.concat(".PROCESSING_STAGES.ACCOUNTING_ENTRY.PRODUCTS");
	logger.info("deriveServiceConfigured: accountingPath = " + accountingPath);
	var accountingCode = memTblGetTableValue(map, "INST_PARAM", accountingPath);
	logger.info("deriveServiceConfigured: accounting code = " + accountingCode);

	var repairPath = institutionId.concat(".PROCESSING_STAGES.REPAIR.PRODUCTS");
	logger.info("deriveServiceConfigured: accountingPath = " + repairPath);
	var repairCode = memTblGetTableValue(map, "INST_PARAM", repairPath);
	logger.info("deriveServiceConfigured: repairCode code = " + repairCode);

	logger.info("deriveServiceConfigured: Type of repairCode code = " + typeof repairCode);
	logger.info("deriveServiceConfigured: Type of product code = " + typeof productCode);

	var reviewPath = institutionId.concat(".PROCESSING_STAGES.REVIEW.PRODUCTS");
	logger.info("deriveServiceConfigured: reviewPath = " + reviewPath);
	var reviewCode = memTblGetTableValue(map, "INST_PARAM", reviewPath);
	logger.info("deriveServiceConfigured: reviewCode code = " + reviewCode);

	if(!custom13){
		custom13 = "";
		if(isPatternPresent(matchingCode, productCode)){
			custom13 = custom13 + "MATCHING=Y|"; //for testing
		}
		else{
			custom13 = custom13 + "MATCHING=N|"; //for testing - CHANGE IT TO N after testing
		}

		if(isPatternPresent(cashForcasting, productCode)){
			//custom13 = custom13 + "CASH_FORECASTING=Y|";
			custom13 = custom13 + "CASH_FORECASTING=Y|"; //for testing
		}
		else{
			custom13 = custom13 + "CASH_FORECASTING=N|";
		}

		if(isPatternPresent(scanningCd, productCode)){
			custom13 = custom13 + "SCANNING=Y|"; //for testing
		}
		else{
			custom13 = custom13 + "SCANNING=N|";
		}

		if(isPatternPresent(preWrhsCode, productCode)){
			custom13 = custom13 + "WAREHOUSE=Y|";
		}
		else{
			custom13 = custom13 + "WAREHOUSE=N|";
		}

		if(isPatternPresent(authorizeCode,productCode)|| isPatternPresent(authorizeCode1,productCode)){
			custom13 = custom13 + "AUTHORIZATION=Y|";
		}
		else{
			custom13 = custom13 + "AUTHORIZATION=N|";
		}

		if(isPatternPresent(accountingCode, productCode)){
			custom13 = custom13 + "ACCOUNTING_ENTRY=Y|";
		}
		else{
			custom13 = custom13 + "ACCOUNTING_ENTRY=N|";
		}

		if(isPatternPresent(disposition, productCode)){
			//custom13 = custom13 + "DISPOSITION=Y|";
			custom13 = custom13 + "DISPOSITION=Y|"; //for testing
		}
		else{
			custom13 = custom13 + "DISPOSITION=N|";
		}

		if(isPatternPresent(reviewCode, productCode)){
			//custom13 = custom13 + "DISPOSITION=Y|";
			custom13 = custom13 + "REVIEW=Y|"; //for testing
		}
		else{
			custom13 = custom13 + "REVIEW=N|";
		}

		if(isPatternPresent(duplicateCode,productCode)){
			custom13 = custom13 + "DUPLICATE=Y|";
		}
		else{
			custom13 = custom13 + "DUPLICATE=N|";
		}

		if(isPatternPresent(repairCode, productCode)){
			logger.info("deriveServiceConfigured: in repairCode.");
			custom13 = custom13 + "REPAIR=Y|";
		}
		else{
			logger.info("deriveServiceConfigured: in non-repairCode.");
			custom13 = custom13 + "REPAIR=N|";
		}

		custom13 = custom13 + "VALIDATE=Y|";

	}
	setHeader(map, "PLCNAPI_custom13", custom13);
	setHeader(map, "PLCN_custom13", custom13);
	logger.info("deriveServiceConfigured: custom13 string = " + custom13);
}

function extractMetaData(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;
	var priorityAmount;
	var priorityDate;
	var transRefNo;
	var currency;
	var sender;
	var receiver

	logger.info("In extractMetaData");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var msgType = getHeader(map, "PLCN_msgType");
	logger.info("extractMetaData: msgType = " + msgType);

	if(msgType === 'pacs.004.001.09') {
		currency = getHeader(map, "PLCN_currency");
		logger.info("extractMetaData: intrBkSttlmtCcy = " + currency);		

		if(!currency){
			var intrBkSttmtCcyPath = '/Document/PmtRtr/GrpHdr/TtlRtrdIntrBkSttlmAmt/@Ccy';
			currency = getValueFromPath(Document, intrBkSttmtCcyPath);
			logger.info("intrBkSttlmtCcy = " + currency);		
		}

		setHeader(map, "PLCN_currency", currency);
		setHeader(map, "PLCNAPI_currency", currency);

		priorityAmount = getHeader(map, "PLCN_priorityAmount");

		if(!priorityAmount){
			priorityAmount = getHeader(map, "PLCN_amount");
		}

		if(!priorityAmount){
			var intrBkSttmtAmtPath = '/Document/PmtRtr/GrpHdr/TtlRtrdIntrBkSttlmAmt';
			priorityAmount = getValueFromPath(Document, intrBkSttmtAmtPath);
			logger.info("extractMetaData: intrBkSttlmtAmt = " + priorityAmount);
		}

		setHeader(map, "PLCN_amount", priorityAmount);
		setHeader(map, "PLCN_priorityAmount", priorityAmount);
		setHeader(map, "PLCNAPI_priorityAmount", priorityAmount);

		priorityDate = getHeader(map, "PLCN_priorityDate");

		if(!priorityDate){
			priorityDate = getHeader(map, "PLCN_valueDate");
		}
		
		if(!priorityDate){
			var intrBkSttmtDtPath = '/Document/PmtRtr/GrpHdr/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, intrBkSttmtDtPath);
			logger.info("extractMetaData: intrBkSttlmtDt = " + priorityDate);		
		}

		if(!priorityDate){
			var intrBkSttmtDtPath = '/Document/PmtRtr/GrpHdr/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, intrBkSttmtDtPath);
			logger.info("extractMetaData: intrBkSttlmtDt = " + priorityDate);		
		}
		if(priorityDate){
			priorityDate = replaceAllPattern(priorityDate, "-", "");
		}
		logger.info("extractMetaData: priorityDate = " + priorityDate);		

		setHeader(map, "PLCN_priorityDate", priorityDate);
		setHeader(map, "PLCN_valueDate", priorityDate);
		setHeader(map, "PLCNAPI_priorityDate", priorityDate);

		transRefNo = getHeader(map, "PLCN_transRefNo");
		logger.info("extractMetaData: transRefNo = " + transRefNo);		

		if(!transRefNo){
			var transRefNoPath = "/Document/PmtRtr/TxInf/RtrId";
			transRefNo = getValueFromPath(Document, transRefNoPath);
			logger.info("extractMetaData: transRefNo = " + transRefNo);			
		}

		setHeader(map, "PLCN_transRefNo", transRefNo);
		setHeader(map, "PLCNAPI_transRefNo", transRefNo);

		sender = getHeader(map, "PLCN_sender");
		logger.info("extractMetaData: sender = " + sender);		

		if(!sender){
			var senderPath = "/Document/PmtRtr/GrpHdr/InstgAgt/FinInstnId/BICFI";
			sender = getValueFromPath(Document, senderPath);
		}

		if(!sender){
			var senderPath = "/Document/PmtRtr/TxInf/InstgAgt/FinInstnId/BICFI";
			sender = getValueFromPath(Document, senderPath);
		}

		logger.info("extractMetaData: sender = " + sender);
		setHeader(map, "PLCN_sender", sender);
		setHeader(map, "PLCNAPI_sender", sender);

		var receiver = getHeader(map, "PLCN_receiver");
		logger.trace("extractMetaData: receiver = " + receiver);

		if(!receiver){
			var receiverPath = "/Document/PmtRtr/GrpHdr/InstdAgt/FinInstnId/BICFI";
			receiver = getValueFromPath(Document, receiverPath);		
		}

		if(!receiver){
			var receiverPath = "/Document/PmtRtr/TxInf/InstdAgt/FinInstnId/BICFI";
			receiver = getValueFromPath(Document, receiverPath);		
		}

		logger.info("extractMetaData: receiver = " + receiver);
		setHeader(map, "PLCN_receiver", receiver);
		setHeader(map, "PLCNAPI_receiver", receiver);
	}

	if(msgType === 'pacs.008.001.08') {

		currency = getHeader(map, "PLCN_currency");

		if(!currency){
			var intrBkSttmtCcyPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt/@Ccy';
			currency = getValueFromPath(Document, intrBkSttmtCcyPath);
			logger.info("intrBkSttlmtCcy = " + currency);		
		}

		setHeader(map, "PLCN_currency", currency);
		setHeader(map, "PLCNAPI_currency", currency);

		priorityAmount = getHeader(map, "PLCN_priorityAmount");

		if(!priorityAmount){
			priorityAmount = getHeader(map, "PLCN_amount");
		}

		if(!priorityAmount){
			var intrBkSttmtAmtPath = '/Document/FIToFICstmrCdtTrf/GrpHdr/TtlIntrBkSttlmAmt';
			priorityAmount = getValueFromPath(Document, intrBkSttmtAmtPath);
			logger.info("intrBkSttlmtAmt = " + priorityAmount);
		}
		setHeader(map, "PLCN_amount", priorityAmount);
		setHeader(map, "PLCN_priorityAmount", priorityAmount);
		setHeader(map, "PLCNAPI_priorityAmount", priorityAmount);

		priorityDate = getHeader(map, "PLCN_priorityDate");

		if(!priorityDate){
			priorityDate = getHeader(map, "PLCN_valueDate");
		}

		if(!priorityDate){
			var intrBkSttmtDtPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, intrBkSttmtDtPath);
			logger.info("intrBkSttlmtDt = " + priorityDate);		
		}
		if(!priorityDate){
			var intrBkSttmtDtPath = '/Document/FIToFICstmrCdtTrf/GrpHdr/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, intrBkSttmtDtPath);
			logger.info("intrBkSttlmtDt = " + priorityDate);		
		}
		if(priorityDate){
			priorityDate = replaceAllPattern(priorityDate, "-", "");
		}
		logger.info("extractMetaData: priorityDate = " + priorityDate);		

		setHeader(map, "PLCN_priorityDate", priorityDate);
		setHeader(map, "PLCN_valueDate", priorityDate);
		setHeader(map, "PLCNAPI_priorityDate", priorityDate);

		transRefNo = getHeader(map, "PLCN_transRefNo");
		logger.info("extractMetaData: transRefNo = " + transRefNo);		

		if(!transRefNo){
			var transRefNoPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/TxId";
			transRefNo = getValueFromPath(Document, transRefNoPath);
			logger.info("extractMetaData: transRefNo = " + transRefNo);			
		}

		setHeader(map, "PLCN_transRefNo", transRefNo);
		setHeader(map, "PLCNAPI_transRefNo", transRefNo);

		sender = getHeader(map, "PLCN_sender");
		logger.info("extractMetaData: sender = " + sender);

		if(!sender){
			var senderPath = "/Document/FIToFICstmrCdtTrf/GrpHdr/InstgAgt/FinInstnId/BICFI";
			sender = getValueFromPath(Document, senderPath);
			logger.info("extractMetaData: sender from GrpHdr = " + sender);
		}

		if(!sender){
			var senderPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/InstgAgt/FinInstnId/BICFI";
			sender = getValueFromPath(Document, senderPath);
			logger.info("extractMetaData: sender from CdtTrfTxInf = " + sender);
		}		

		logger.info("extractMetaData: sender = " + sender);
		setHeader(map, "PLCN_sender", sender);
		setHeader(map, "PLCNAPI_sender", sender);

		var receiver = getHeader(map, "PLCN_receiver");
		logger.info("extractMetaData: receiver = " + receiver);

		if(!receiver){
			var receiverPath = "/Document/FIToFICstmrCdtTrf/GrpHdr/InstdAgt/FinInstnId/BICFI";
			receiver = getValueFromPath(Document, receiverPath);
			logger.info("extractMetaData: receiver from GrpHdr = " + receiver);		
		}

		if(!receiver){
			var receiverPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/InstdAgt/FinInstnId/BICFI";
			receiver = getValueFromPath(Document, receiverPath);
			logger.info("extractMetaData: receiver from CdtTrfTxInf = " + receiver);		
		}		

		logger.info("extractMetaData: receiver = " + receiver);
		setHeader(map, "PLCN_receiver", receiver);
		setHeader(map, "PLCNAPI_receiver", receiver);
	}

	if(msgType === 'camt.056.001.08') {
		currency = getHeader(map, "PLCN_currency");
		logger.info("extractMetaData: currency = " + currency);

		if(!currency){
			var intrBkSttmtCcyPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlIntrBkSttlmAmt/@Ccy';
			currency = getValueFromPath(Document, intrBkSttmtCcyPath);
			logger.info("extractMetaData: intrBkSttlmtCcy = " + currency);		
		}

		setHeader(map, "PLCN_currency", currency);
		setHeader(map, "PLCNAPI_currency", currency);

		priorityAmount = getHeader(map, "PLCN_priorityAmount");
		logger.info("extractMetaData: priorityAmount = " + priorityAmount);

		if(!priorityAmount){
			priorityAmount = getHeader(map, "PLCN_amount");
			logger.info("extractMetaData: priorityAmount = " + priorityAmount);
		}

		if(!priorityAmount){
			var intrBkSttmtAmtPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlIntrBkSttlmAmt';
			priorityAmount = getValueFromPath(Document, intrBkSttmtAmtPath);
			logger.info("extractMetaData: intrBkSttlmtAmt = " + priorityAmount);
		}
		
		setHeader(map, "PLCN_amount", priorityAmount);
		setHeader(map, "PLCN_priorityAmount", priorityAmount);
		setHeader(map, "PLCNAPI_priorityAmount", priorityAmount);

		priorityDate = getHeader(map, "PLCN_priorityDate");
		logger.info("extractMetaData: priorityDate = " + priorityDate);

		if(!priorityDate){
			priorityDate = getHeader(map, "PLCN_valueDate");
			logger.info("extractMetaData: priorityDate = " + priorityDate);
		}

		if(!priorityDate){
			var intrBkSttmtDtPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlIntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, intrBkSttmtDtPath);
			logger.info("extractMetaData: intrBkSttlmtDt = " + priorityDate);	
		}

		if(priorityDate){
			priorityDate = replaceAllPattern(priorityDate, "-", "");
		}
		
		
		logger.info("extractMetaData: priorityDate = " + priorityDate);		

		setHeader(map, "PLCN_priorityDate", priorityDate);
		setHeader(map, "PLCN_valueDate", priorityDate);
		setHeader(map, "PLCNAPI_priorityDate", priorityDate);

		transRefNo = getHeader(map, "PLCN_transRefNo");
		logger.info("extractMetaData: transRefNo = " + transRefNo);		

		if(!transRefNo){
			var transRefNoPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/CxlId';
			transRefNo = getValueFromPath(Document, transRefNoPath);
			logger.info("extractMetaData: transRefNo = " + transRefNo);			
		}

		setHeader(map, "PLCN_transRefNo", transRefNo);
		setHeader(map, "PLCNAPI_transRefNo", transRefNo);

		sender = getHeader(map, "PLCN_sender");
		logger.info("extractMetaData: sender = " + sender);	
		
		if(!sender){
			var senderPath = "/Document/FIToFIPmtCxlReq/Assgnmt/Assgnr/Agt/FinInstnId/BICFI";
			sender = getValueFromPath(Document, senderPath);
		}

		logger.info("extractMetaData: sender = " + sender);
		setHeader(map, "PLCN_sender", sender);
		setHeader(map, "PLCNAPI_sender", sender);

		var receiver = getHeader(map, "PLCN_receiver");
		logger.info("extractMetaData: receiver = " + receiver);

		if(!receiver){
			var receiverPath = "/Document/FIToFIPmtCxlReq/Assgnmt/Assgne/Agt/FinInstnId/BICFI";
			receiver = getValueFromPath(Document, receiverPath);		
		}
		
		logger.info("extractMetaData: receiver = " + receiver);
		setHeader(map, "PLCN_receiver", receiver);
		setHeader(map, "PLCNAPI_receiver", receiver);
	}

	if(msgType === 'camt.029.001.09') {
		currency = getHeader(map, "PLCN_currency");
		logger.info("extractMetaData: currency = " + currency);

		if(!currency){
			var intrBkSttmtCcyPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt/@Ccy';
			currency = getValueFromPath(Document, intrBkSttmtCcyPath);
			logger.info("extractMetaData: intrBkSttlmtCcy = " + currency);		
		}

		setHeader(map, "PLCN_currency", currency);
		setHeader(map, "PLCNAPI_currency", currency);

		priorityAmount = getHeader(map, "PLCN_priorityAmount");
		logger.info("extractMetaData: priorityAmount = " + priorityAmount);

		if(!priorityAmount){
			priorityAmount = getHeader(map, "PLCN_amount");
			logger.info("extractMetaData: priorityAmount = " + priorityAmount);
		}

		if(!priorityAmount){
			var intrBkSttmtAmtPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt';
			priorityAmount = getValueFromPath(Document, intrBkSttmtAmtPath);
			logger.info("extractMetaData: intrBkSttlmtAmt = " + priorityAmount);
		}
		setHeader(map, "PLCN_amount", priorityAmount);
		setHeader(map, "PLCN_priorityAmount", priorityAmount);
		setHeader(map, "PLCNAPI_priorityAmount", priorityAmount);

		priorityDate = getHeader(map, "PLCN_priorityDate");
		logger.info("extractMetaData: priorityDate = " + priorityDate);

		if(!priorityDate){
			priorityDate = getHeader(map, "PLCN_valueDate");
			logger.info("extractMetaData: priorityDate = " + priorityDate);
		}

		if(!priorityDate){
			var intrBkSttmtDtPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, intrBkSttmtDtPath);
			logger.info("extractMetaData: intrBkSttlmtDt = " + priorityDate);		
		}
		
		if(priorityDate){
			priorityDate = replaceAllPattern(priorityDate, "-", "");
		}
		logger.info("extractMetaData: priorityDate = " + priorityDate);		

		setHeader(map, "PLCN_priorityDate", priorityDate);
		setHeader(map, "PLCN_valueDate", priorityDate);
		setHeader(map, "PLCNAPI_priorityDate", priorityDate);

		transRefNo = getHeader(map, "PLCN_transRefNo");
		logger.info("extractMetaData: transRefNo = " + transRefNo);		

		if(!transRefNo){
			var transRefNoPath = "/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxId";
			transRefNo = getValueFromPath(Document, transRefNoPath);
			logger.info("extractMetaData: transRefNo = " + transRefNo);			
		}

		setHeader(map, "PLCN_transRefNo", transRefNo);
		setHeader(map, "PLCNAPI_transRefNo", transRefNo);

		sender = getHeader(map, "PLCN_sender");
		logger.info("extractMetaData: sender = " + sender);	
		
		if(!sender){
			var senderPath = "/Document/RsltnOfInvstgtn/Assgnmt/Assgnr/Agt/FinInstnId/BICFI";
			sender = getValueFromPath(Document, senderPath);
		}

		logger.info("extractMetaData: sender = " + sender);
		setHeader(map, "PLCN_sender", sender);
		setHeader(map, "PLCNAPI_sender", sender);

		var receiver = getHeader(map, "PLCN_receiver");
		logger.info("extractMetaData: receiver = " + receiver);

		if(!receiver){
			var receiverPath = "/Document/RsltnOfInvstgtn/Assgnmt/Assgne/Agt/FinInstnId/BICFI";
			receiver = getValueFromPath(Document, receiverPath);		
		}
		
		logger.info("extractMetaData: receiver = " + receiver);
		setHeader(map, "PLCN_receiver", receiver);
		setHeader(map, "PLCNAPI_receiver", receiver);
	}

	if(msgType === 'pacs.003.001.08') {

		currency = getHeader(map, "PLCN_currency");

		if(!currency){
			var intrBkSttmtCcyPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/IntrBkSttlmAmt/@Ccy';
			currency = getValueFromPath(Document, intrBkSttmtCcyPath);
			logger.info("extractMetaData: intrBkSttlmtCcy = " + currency);		
		}

		setHeader(map, "PLCN_currency", currency);
		setHeader(map, "PLCNAPI_currency", currency);

		priorityAmount = getHeader(map, "PLCN_priorityAmount");

		if(!priorityAmount){
			priorityAmount = getHeader(map, "PLCN_amount");
		}

		if(!priorityAmount){
			var intrBkSttmtAmtPath = '/Document/FIToFICstmrDrctDbt/GrpHdr/TtlIntrBkSttlmAmt';
			priorityAmount = getValueFromPath(Document, intrBkSttmtAmtPath);
			logger.info("extractMetaData: intrBkSttlmtAmt = " + priorityAmount);
		}
		setHeader(map, "PLCN_amount", priorityAmount);
		setHeader(map, "PLCN_priorityAmount", priorityAmount);
		setHeader(map, "PLCNAPI_priorityAmount", priorityAmount);

		priorityDate = getHeader(map, "PLCN_priorityDate");

		if(!priorityDate){
			priorityDate = getHeader(map, "PLCN_valueDate");
		}

		if(!priorityDate){
			var intrBkSttmtDtPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, intrBkSttmtDtPath);
			logger.info("extractMetaData: intrBkSttlmtDt = " + priorityDate);		
		}

		if(!priorityDate){
			var intrBkSttmtDtPath = '/Document/FIToFICstmrDrctDbt/GrpHdr/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, intrBkSttmtDtPath);
			logger.info("extractMetaData: intrBkSttlmtDt = " + priorityDate);		
		}
		if(priorityDate){
			priorityDate = replaceAllPattern(priorityDate, "-", "");
		}
		logger.info("extractMetaData: priorityDate = " + priorityDate);		

		setHeader(map, "PLCN_priorityDate", priorityDate);
		setHeader(map, "PLCN_valueDate", priorityDate);
		setHeader(map, "PLCNAPI_priorityDate", priorityDate);

		transRefNo = getHeader(map, "PLCN_transRefNo");
		logger.info("extractMetaData: transRefNo = " + transRefNo);		

		if(!transRefNo){
			var transRefNoPath = "/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/PmtId/TxId";
			transRefNo = getValueFromPath(Document, transRefNoPath);
			logger.info("extractMetaData: transRefNo = " + transRefNo);			
		}

		setHeader(map, "PLCN_transRefNo", transRefNo);
		setHeader(map, "PLCNAPI_transRefNo", transRefNo);

		sender = getHeader(map, "PLCN_sender");
		logger.info("extractMetaData: sender = " + sender);

		if(!sender){
			var senderPath = "/Document/FIToFICstmrDrctDbt/GrpHdr/InstgAgt/FinInstnId/BICFI";
			sender = getValueFromPath(Document, senderPath);
			logger.info("extractMetaData: sender from GrpHdr = " + sender);
		}

		if(!sender){
			var senderPath = "/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/InstgAgt/FinInstnId/BICFI";
			sender = getValueFromPath(Document, senderPath);
			logger.info("extractMetaData: sender from DrctDbtTxInf = " + sender);
		}		

		logger.info("extractMetaData: sender = " + sender);
		setHeader(map, "PLCN_sender", sender);
		setHeader(map, "PLCNAPI_sender", sender);

		var receiver = getHeader(map, "PLCN_receiver");
		logger.info("extractMetaData: receiver = " + receiver);

		if(!receiver){
			var receiverPath = "/Document/FIToFICstmrDrctDbt/GrpHdr/InstdAgt/FinInstnId/BICFI";
			receiver = getValueFromPath(Document, receiverPath);
			logger.info("extractMetaData: receiver from GrpHdr = " + receiver);		
		}

		if(!receiver){
			var receiverPath = "/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/InstdAgt/FinInstnId/BICFI";
			receiver = getValueFromPath(Document, receiverPath);
			logger.info("extractMetaData: receiver from DrctDbtTxInf = " + receiver);		
		}		

		logger.info("extractMetaData: receiver = " + receiver);
		setHeader(map, "PLCN_receiver", receiver);
		setHeader(map, "PLCNAPI_receiver", receiver);
	}

	if(msgType === 'pacs.007.001.09') {
		currency = getHeader(map, "PLCN_currency");
		logger.info("extractMetaData: intrBkSttlmtCcy = " + currency);		

		if(!currency){
			var intrBkSttmtCcyPath = '/Document/FIToFIPmtRvsl/TxInf/OrgnlIntrBkSttlmAmt/@Ccy';
			currency = getValueFromPath(Document, intrBkSttmtCcyPath);
			logger.info("intrBkSttlmtCcy = " + currency);		
		}

		setHeader(map, "PLCN_currency", currency);
		setHeader(map, "PLCNAPI_currency", currency);

		priorityAmount = getHeader(map, "PLCN_priorityAmount");

		if(!priorityAmount){
			priorityAmount = getHeader(map, "PLCN_amount");
		}

		if(!priorityAmount){
			var intrBkSttmtAmtPath = '/Document/FIToFIPmtRvsl/GrpHdr/TtlRvsdIntrBkSttlmAmt';
			priorityAmount = getValueFromPath(Document, intrBkSttmtAmtPath);
			logger.info("extractMetaData: intrBkSttlmtAmt = " + priorityAmount);
		}

		setHeader(map, "PLCN_amount", priorityAmount);
		setHeader(map, "PLCN_priorityAmount", priorityAmount);
		setHeader(map, "PLCNAPI_priorityAmount", priorityAmount);

		priorityDate = getHeader(map, "PLCN_priorityDate");

		if(!priorityDate){
			priorityDate = getHeader(map, "PLCN_valueDate");
		}
		
		if(!priorityDate){
			var intrBkSttmtDtPath = '/Document/FIToFIPmtRvsl/GrpHdr/IntrBkSttlmDt';
			priorityDate = getValueFromPath(Document, intrBkSttmtDtPath);
			logger.info("extractMetaData: intrBkSttlmtDt = " + priorityDate);		
		}
		if(priorityDate){
			priorityDate = replaceAllPattern(priorityDate, "-", "");
		}
		logger.info("extractMetaData: priorityDate = " + priorityDate);		

		setHeader(map, "PLCN_priorityDate", priorityDate);
		setHeader(map, "PLCN_valueDate", priorityDate);
		setHeader(map, "PLCNAPI_priorityDate", priorityDate);

		transRefNo = getHeader(map, "PLCN_transRefNo");
		logger.info("extractMetaData: transRefNo = " + transRefNo);		

		if(!transRefNo){
			var transRefNoPath = "/Document/FIToFIPmtRvsl/TxInf/OrgnlTxId";
			transRefNo = getValueFromPath(Document, transRefNoPath);
			logger.info("extractMetaData: transRefNo = " + transRefNo);			
		}

		setHeader(map, "PLCN_transRefNo", transRefNo);
		setHeader(map, "PLCNAPI_transRefNo", transRefNo);

		sender = getHeader(map, "PLCN_sender");
		logger.info("extractMetaData: sender = " + sender);		

		if(!sender){
			var senderPath = "/Document/FIToFIPmtRvsl/GrpHdr/InstgAgt/FinInstnId/BICFI";
			sender = getValueFromPath(Document, senderPath);
		}

		if(!sender){
			var senderPath = "/Document/FIToFIPmtRvsl/TxInf/InstgAgt/FinInstnId/BICFI";
			sender = getValueFromPath(Document, senderPath);
		}

		logger.info("extractMetaData: sender = " + sender);
		setHeader(map, "PLCN_sender", sender);
		setHeader(map, "PLCNAPI_sender", sender);

		var receiver = getHeader(map, "PLCN_receiver");
		logger.trace("extractMetaData: receiver = " + receiver);

		if(!receiver){
			var receiverPath = "/Document/FIToFIPmtRvsl/GrpHdr/InstdAgt/FinInstnId/BICFI";
			receiver = getValueFromPath(Document, receiverPath);		
		}

		if(!receiver){
			var receiverPath = "/Document/FIToFIPmtRvsl/TxInf/InstdAgt/FinInstnId/BICFI";
			receiver = getValueFromPath(Document, receiverPath);		
		}

		logger.info("extractMetaData: receiver = " + receiver);
		setHeader(map, "PLCN_receiver", receiver);
		setHeader(map, "PLCNAPI_receiver", receiver);
	}		
}

function extractMsgDBData(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	//var readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("extractMsgDBData: In extractMsgDBData");
	var msgType = getHeader(map, "PLCN_msgType");
	logger.info("extractMsgDBData:  msgType = " + msgType);
	
	//MSGDB
	if(msgType === 'pacs.008.001.08'){
		var dbtrNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Nm';
		var dbtrNm = getValueFromPath(Document, dbtrNmPath);
		logger.info("extractMsgDBData:  dbtrNm = " + dbtrNm);
		//msgdbMap.put("ORIGNAME", dbtrNm);
		setHeader(map, "PLCN_origName", dbtrNm);

		var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		if(debtorAcc){
			//msgdbMap.put("ACCOUNT_DR", debtorAcc);
			setHeader(map, "PLCN_accountDr", debtorAcc);
		}
		if(!debtorAcc){
			var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			if(debtorAcc){
				//msgdbMap.put("ACCOUNT_DR", debtorAcc);
				setHeader(map, "PLCN_accountDr", debtorAcc);
			}
		}

		logger.info("extractMsgDBData:  ACCOUNT_DR = " + debtorAcc);
		var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		//msgdbMap.put("ACCOUNT_NUMBER", debtorAcc);
		setHeader(map, "PLCN_accountNumber", debtorAcc);

		if(!debtorAcc){
			var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			//msgdbMap.put("ACCOUNT_NUMBER", debtorAcc);
			setHeader(map, "PLCN_accountNumber", debtorAcc);
		}

		var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		//msgdbMap.put("CUSTOMERACCNO", debtorAcc);
		setHeader(map, "PLCN_customerAccNo", debtorAcc);

		if(!debtorAcc){
			var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			//msgdbMap.put("CUSTOMERACCNO", debtorAcc);
			setHeader(map, "PLCN_customerAccNo", debtorAcc);
		}	

		var debtorAgentPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI';
		var debtorAgent = getValueFromPath(Document, debtorAgentPth);
		//msgdbMap.put("CUSTOMER", debtorAgent);
		setHeader(map, "PLCN_customer", debtorAgent);

		var debtorAgentNmPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/Nm';
		var debtorAgentNm = getValueFromPath(Document, debtorAgentNmPth);
		//msgdbMap.put("origbankname", debtorAgentNm);
		setHeader(map, "PLCN_origBankName", debtorAgentNm);

		var cdtrAgentNmPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/Nm';
		var cdtrAgentNm = getValueFromPath(Document, cdtrAgentNmPth);
		//msgdbMap.put("benbankname", cdtrAgentNm);
		setHeader(map, "PLCN_benBankName", cdtrAgentNm);

		var cdtrNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Nm';
		var cdtrNm = getValueFromPath(Document, cdtrNmPath);
		//msgdbMap.put("benefname", cdtrNm);
		//msgdbMap.put("other_party_details", cdtrNm);
		setHeader(map, "PLCN_benefName", cdtrNm);
		setHeader(map, "PLCN_otherPartyDetails", cdtrNm);
		
		var creditorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		//msgdbMap.put("other_accno", creditorAcc);
		setHeader(map, "PLCN_otherAccno", creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			//msgdbMap.put("OTHER_ACCNO", creditorAcc);
			setHeader(map, "PLCN_otherAccno", creditorAcc);
		}

		var creditorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		//msgdbMap.put("account_cr", creditorAcc);
		setHeader(map, "PLCN_accountCr", creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			//msgdbMap.put("ACCOUNT_CR", creditorAcc);
			setHeader(map, "PLCN_accountCr", creditorAcc);
		}

		var cdtrAddr1Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/AdrLine[1]';
		var cdtrAddr1 = getValueFromPath(Document, cdtrAddr1Path);
		//msgdbMap.put("BENBANKADDR1", cdtrAddr1);
		setHeader(map, "PLCN_benBankAddr1", cdtrAddr1);
		logger.info("extractMsgDBData: cdtrAddr1 = " + cdtrAddr1);

		var cdtrAddr2Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/AdrLine[2]';
		var cdtrAddr2 = getValueFromPath(Document, cdtrAddr2Path);
		//msgdbMap.put("BENBANKADDR2", cdtrAddr2);
		setHeader(map, "PLCN_benBankAddr2", cdtrAddr2);
		logger.info("extractMsgDBData: cdtrAddr2 = " + cdtrAddr2);

		var cdtrAddr3Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/AdrLine[3]';
		var cdtrAddr3 = getValueFromPath(Document, cdtrAddr3Path);
		//msgdbMap.put("BENBANKADDR3", cdtrAddr3);
		setHeader(map, "PLCN_benBankAddr3", cdtrAddr3);
		logger.info("extractMsgDBData: cdtrAddr3 = " + cdtrAddr3);

		var cdtrCityPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/TwnNm';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		//msgdbMap.put("BENBANKCITY", cdtrCity);
		setHeader(map, "PLCN_benBankCity", cdtrCity);
		logger.info("extractMsgDBData: CityName = " + cdtrCity);

		var cdtrCtryPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/Ctry';
		var cdtrCtry = getValueFromPath(Document, cdtrCtryPath);
		//msgdbMap.put("BENBANKCTRY", cdtrCtry);
		setHeader(map, "PLCN_benBankCtry", cdtrCtry);

		var cdtrCityPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/CtrySubDvsn';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		//msgdbMap.put("BENBANKSTATECODE", cdtrCity);
		setHeader(map, "PLCN_benBankStateCode", cdtrCity);

		var cdtrCityPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/PstCd';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		//msgdbMap.put("BENBANKZIPCODE", cdtrCity);
		setHeader(map, "PLCN_benbankzipcode", cdtrCity);
	}

	if(msgType === 'pacs.004.001.09'){
		var dbtrNmPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/Dbtr/Pty/Nm';
		var dbtrNm = getValueFromPath(Document, dbtrNmPath);
		logger.info("extractMsgDBData:  dbtrNm = " + dbtrNm);
		//msgdbMap.put("ORIGNAME", dbtrNm);	
		setHeader(map, "PLCN_origName", dbtrNm);
		
		var debtorAgentPth = '/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAgt/FinInstnId/BICFI';
		var debtorAgent = getValueFromPath(Document, debtorAgentPth);
		//msgdbMap.put("CUSTOMER", debtorAgent);
		setHeader(map, "PLCN_customer", debtorAgent);
		
		var debtorAgentNmPth = '/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAgt/FinInstnId/Nm';
		var debtorAgentNm = getValueFromPath(Document, debtorAgentNmPth);
		//msgdbMap.put("ORIGBANKNAME", debtorAgentNm);
		setHeader(map, "PLCN_origBankName", debtorAgentNm);

		var cdtrNmPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/Pty/Nm';
		var cdtrNm = getValueFromPath(Document, cdtrNmPath);
		logger.info("extractMsgDBData: cdtrAgtNm = " + cdtrNm);
		//msgdbMap.put("BENEFNAME", cdtrNm);
		//msgdbMap.put("OTHER_PARTY_DETAILS", cdtrNm);
		setHeader(map, "PLCN_benefName", cdtrNm);
		setHeader(map, "PLCN_otherPartyDetails", cdtrNm);

		var cdtrAgtNmPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/Nm';
		var cdtrAgtNm = getValueFromPath(Document, cdtrAgtNmPath);
		//msgdbMap.put("BENBANKNAME", cdtrAgtNm);
		setHeader(map, "PLCN_benBankName", cdtrAgtNm);
		logger.info("extractMsgDBData: CdtrAgtNm = " + cdtrAgtNm);

		var cdtrAgtAddr1Path = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/AdrLine[1]';
		var cdtrAgtAddr1 = getValueFromPath(Document, cdtrAgtAddr1Path);
		//msgdbMap.put("BENBANKADDR1", cdtrAgtAddr1);
		setHeader(map, "PLCN_benBankAddr1", cdtrAgtAddr1);
		logger.info("extractMsgDBData: CdtrAgtAddr1 = " + cdtrAgtAddr1);

		var cdtrAgtAddr2Path = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/AdrLine[2]';
		var cdtrAgtAddr2 = getValueFromPath(Document, cdtrAgtAddr2Path);
		//msgdbMap.put("BENBANKADDR2", cdtrAgtAddr2);
		setHeader(map, "PLCN_benBankAddr2", cdtrAgtAddr2);
		logger.info("extractMsgDBData: CdtrAgtAddr2 = " + cdtrAgtAddr2);

		var cdtrAgtAddr3Path = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/AdrLine[3]';
		var cdtrAgtAddr3 = getValueFromPath(Document, cdtrAgtAddr3Path);
		//msgdbMap.put("BENBANKADDR3", cdtrAgtAddr3);
		setHeader(map, "PLCN_benBankAddr3", cdtrAgtAddr3);
		logger.info("extractMsgDBData: CdtrAgtAddr3 = " + cdtrAgtAddr3);

		var cdtrAgtCityPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/TwnNm';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		//msgdbMap.put("BENBANKCITY", cdtrAgtCity);
		setHeader(map, "PLCN_benBankCity", cdtrAgtCity);
		logger.info("extractMsgDBData: CityName = " + cdtrAgtCity);

		var cdtrAgtCtryPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/Ctry';
		var cdtrAgtCtry = getValueFromPath(Document, cdtrAgtCtryPath);
		//msgdbMap.put("BENBANKCTRY", cdtrAgtCtry);
		setHeader(map, "PLCN_benBankCtry", cdtrAgtCtry);

		var cdtrAgtCityPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/CtrySubDvsn';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		//msgdbMap.put("BENBANKSTATECODE", cdtrAgtCity);
		setHeader(map, "PLCN_benBankStateCode", cdtrAgtCity);

		var cdtrAgtCityPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/PstCd';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		//msgdbMap.put("BENBANKZIPCODE", cdtrAgtCity);
		setHeader(map, "PLCN_benbankzipcode", cdtrAgtCity);

		var debtorAccPth = '/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		if(debtorAcc){
			//msgdbMap.put("ACCOUNT_DR", debtorAcc);
			setHeader(map, "PLCN_accountDr", debtorAcc);
			setHeader(map, "PLCN_accountNumber", debtorAcc);
			setHeader(map, "PLCN_customerAccNo", debtorAcc);
		}

		if(!debtorAcc){
			var debtorAccPth = '/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			if(debtorAcc){
				//msgdbMap.put("ACCOUNT_DR", debtorAcc);
				setHeader(map, "PLCN_accountDr", debtorAcc);
				setHeader(map, "PLCN_accountNumber", debtorAcc);
				setHeader(map, "PLCN_customerAccNo", debtorAcc);
			}

		}	
		var creditorAccPth = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		//msgdbMap.put("other_accno", creditorAcc);
		setHeader(map, "PLCN_otherAccno", creditorAcc);
		setHeader(map, "PLCN_accountCr", creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			//msgdbMap.put("OTHER_ACCNO", creditorAcc);
			setHeader(map, "PLCN_otherAccno", creditorAcc);
			setHeader(map, "PLCN_accountCr", creditorAcc);
		}


	}
	if(msgType === 'camt.056.001.08'){
		var dbtrNmPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/Dbtr/Pty/Nm';
		var dbtrNm = getValueFromPath(Document, dbtrNmPath);
		logger.info("extractMsgDBData:  dbtrNm = " + dbtrNm);
		//msgdbMap.put("ORIGNAME", dbtrNm);	
		setHeader(map, "PLCN_origName", dbtrNm);
		
		var debtorAgentPth = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/DbtrAgt/FinInstnId/BICFI';
		var debtorAgent = getValueFromPath(Document, debtorAgentPth);
		//msgdbMap.put("CUSTOMER", debtorAgent);
		setHeader(map, "PLCN_customer", debtorAgent);
		
		var debtorAgentNmPth = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/DbtrAgt/FinInstnId/Nm';
		var debtorAgentNm = getValueFromPath(Document, debtorAgentNmPth);
		//msgdbMap.put("ORIGBANKNAME", debtorAgentNm);
		setHeader(map, "PLCN_origBankName", debtorAgentNm);
		
		var debtorAccPth = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		if(debtorAcc){
			//msgdbMap.put("ACCOUNT_DR", debtorAcc);
			setHeader(map, "PLCN_accountDr", debtorAcc);
			setHeader(map, "PLCN_accountNumber", debtorAcc);
			setHeader(map, "PLCN_customerAccNo", debtorAcc);
		}
		if(!debtorAcc){
			var debtorAccPth = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			if(debtorAcc){
				//msgdbMap.put("ACCOUNT_DR", debtorAcc);
				setHeader(map, "PLCN_accountDr", debtorAcc);
				setHeader(map, "PLCN_accountNumber", debtorAcc);
				setHeader(map, "PLCN_customerAccNo", debtorAcc);
			}
		}
		
		logger.info("extractMsgDBData:  ACCOUNT_DR = " + debtorAcc);

		var cdtrNmPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/Cdtr/Pty/Nm';
		var cdtrNm = getValueFromPath(Document, cdtrNmPath);
		logger.info("extractMsgDBData: cdtrAgtNm = " + cdtrNm);
		//msgdbMap.put("BENEFNAME", cdtrNm);
		//msgdbMap.put("OTHER_PARTY_DETAILS", cdtrNm);
		setHeader(map, "PLCN_benefName", cdtrNm);
		setHeader(map, "PLCN_otherPartyDetails", cdtrNm);
		
		var creditorAccPth = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		//msgdbMap.put("other_accno", creditorAcc);
		setHeader(map, "PLCN_otherAccno", creditorAcc);
		setHeader(map, "PLCN_accountCr", creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			//msgdbMap.put("OTHER_ACCNO", creditorAcc);
			setHeader(map, "PLCN_otherAccno", creditorAcc);
			setHeader(map, "PLCN_accountCr", creditorAcc);
		}

		var cdtrAgtNmPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/Nm';
		var cdtrAgtNm = getValueFromPath(Document, cdtrAgtNmPath);
		//msgdbMap.put("BENBANKNAME", cdtrAgtNm);
		setHeader(map, "PLCN_benBankName", cdtrAgtNm);
		logger.info("extractMsgDBData: CdtrAgtNm = " + cdtrAgtNm);

		var cdtrAgtAddr1Path = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/AdrLine[1]';
		var cdtrAgtAddr1 = getValueFromPath(Document, cdtrAgtAddr1Path);
		//msgdbMap.put("BENBANKADDR1", cdtrAgtAddr1);
		setHeader(map, "PLCN_benBankAddr1", cdtrAgtAddr1);
		logger.info("extractMsgDBData: CdtrAgtAddr1 = " + cdtrAgtAddr1);

		var cdtrAgtAddr2Path = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/AdrLine[2]';
		var cdtrAgtAddr2 = getValueFromPath(Document, cdtrAgtAddr2Path);
		//msgdbMap.put("BENBANKADDR2", cdtrAgtAddr2);
		setHeader(map, "PLCN_benBankAddr2", cdtrAgtAddr2);
		logger.info("extractMsgDBData: CdtrAgtAddr2 = " + cdtrAgtAddr2);

		/*var cdtrAgtAddr3Path = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/AdrLine[3]';
		var cdtrAgtAddr3 = getValueFromPath(Document, cdtrAgtAddr3Path);
		//msgdbMap.put("BENBANKADDR3", cdtrAgtAddr3);
		setHeader(map, "PLCN_benBankAddr3", cdtrAgtAddr3);
		logger.info("extractMsgDBData: CdtrAgtAddr3 = " + cdtrAgtAddr3); */

		var cdtrAgtCityPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/TwnNm';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		//msgdbMap.put("BENBANKCITY", cdtrAgtCity);
		setHeader(map, "PLCN_benBankCity", cdtrAgtCity);
		logger.info("extractMsgDBData: CityName = " + cdtrAgtCity);

		var cdtrAgtCtryPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/Ctry';
		var cdtrAgtCtry = getValueFromPath(Document, cdtrAgtCtryPath);
		//msgdbMap.put("BENBANKCTRY", cdtrAgtCtry);
		setHeader(map, "PLCN_benBankCtry", cdtrAgtCtry);

		var cdtrAgtCityPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/CtrySubDvsn';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		//msgdbMap.put("BENBANKSTATECODE", cdtrAgtCity);
		setHeader(map, "PLCN_benBankStateCode", cdtrAgtCity);

		var cdtrAgtCityPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/PstCd';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		//msgdbMap.put("BENBANKZIPCODE", cdtrAgtCity);
		setHeader(map, "PLCN_benbankzipcode", cdtrAgtCity);
	}
	
	if(msgType === 'camt.029.001.09'){
		var dbtrNmPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/Dbtr/Pty/Nm';
		var dbtrNm = getValueFromPath(Document, dbtrNmPath);
		logger.info("extractMsgDBData:  dbtrNm = " + dbtrNm);
		//msgdbMap.put("ORIGNAME", dbtrNm);	
		setHeader(map, "PLCN_origName", dbtrNm);
		
		var debtorAgentPth = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/DbtrAgt/FinInstnId/BICFI';
		var debtorAgent = getValueFromPath(Document, debtorAgentPth);
		//msgdbMap.put("CUSTOMER", debtorAgent);
		setHeader(map, "PLCN_customer", debtorAgent);
		
		var debtorAgentNmPth = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/DbtrAgt/FinInstnId/Nm';
		var debtorAgentNm = getValueFromPath(Document, debtorAgentNmPth);
		//msgdbMap.put("ORIGBANKNAME", debtorAgentNm);
		setHeader(map, "PLCN_origBankName", debtorAgentNm);
		
		var debtorAccPth = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		if(debtorAcc){
			//msgdbMap.put("ACCOUNT_DR", debtorAcc);
			setHeader(map, "PLCN_accountDr", debtorAcc);
			setHeader(map, "PLCN_accountNumber", debtorAcc);
			setHeader(map, "PLCN_customerAccNo", debtorAcc);
		}
		if(!debtorAcc){
			var debtorAccPth = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			if(debtorAcc){
				//msgdbMap.put("ACCOUNT_DR", debtorAcc);
				setHeader(map, "PLCN_accountDr", debtorAcc);
				setHeader(map, "PLCN_accountNumber", debtorAcc);
				setHeader(map, "PLCN_customerAccNo", debtorAcc);
			}
		}
		
		logger.info("extractMsgDBData:  ACCOUNT_DR = " + debtorAcc);

		var cdtrNmPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/Cdtr/Pty/Nm';
		var cdtrNm = getValueFromPath(Document, cdtrNmPath);
		logger.info("extractMsgDBData: cdtrAgtNm = " + cdtrNm);
		//msgdbMap.put("BENEFNAME", cdtrNm);
		//msgdbMap.put("OTHER_PARTY_DETAILS", cdtrNm);
		setHeader(map, "PLCN_benefName", cdtrNm);
		setHeader(map, "PLCN_otherPartyDetails", cdtrNm);
		
		var creditorAccPth = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		//msgdbMap.put("other_accno", creditorAcc);
		setHeader(map, "PLCN_otherAccno", creditorAcc);
		setHeader(map, "PLCN_accountCr", creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			//msgdbMap.put("OTHER_ACCNO", creditorAcc);
			setHeader(map, "PLCN_otherAccno", creditorAcc);
			setHeader(map, "PLCN_accountCr", creditorAcc);
		}

		var cdtrAgtNmPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/Nm';
		var cdtrAgtNm = getValueFromPath(Document, cdtrAgtNmPath);
		//msgdbMap.put("BENBANKNAME", cdtrAgtNm);
		setHeader(map, "PLCN_benBankName", cdtrAgtNm);
		logger.info("extractMsgDBData: CdtrAgtNm = " + cdtrAgtNm);

		var cdtrAgtAddr1Path = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/AdrLine[1]';
		var cdtrAgtAddr1 = getValueFromPath(Document, cdtrAgtAddr1Path);
		//msgdbMap.put("BENBANKADDR1", cdtrAgtAddr1);
		setHeader(map, "PLCN_benBankAddr1", cdtrAgtAddr1);
		logger.info("extractMsgDBData: CdtrAgtAddr1 = " + cdtrAgtAddr1);

		var cdtrAgtAddr2Path = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/AdrLine[2]';
		var cdtrAgtAddr2 = getValueFromPath(Document, cdtrAgtAddr2Path);
		//msgdbMap.put("BENBANKADDR2", cdtrAgtAddr2);
		setHeader(map, "PLCN_benBankAddr2", cdtrAgtAddr2);
		logger.info("extractMsgDBData: CdtrAgtAddr2 = " + cdtrAgtAddr2);

		/*var cdtrAgtAddr3Path = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/AdrLine[3]';
		var cdtrAgtAddr3 = getValueFromPath(Document, cdtrAgtAddr3Path);
		//msgdbMap.put("BENBANKADDR3", cdtrAgtAddr3);
		setHeader(map, "PLCN_benBankAddr3", cdtrAgtAddr3);
		logger.info("extractMsgDBData: CdtrAgtAddr3 = " + cdtrAgtAddr3); */

		var cdtrAgtCityPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/TwnNm';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		//msgdbMap.put("BENBANKCITY", cdtrAgtCity);
		setHeader(map, "PLCN_benBankCity", cdtrAgtCity);
		logger.info("extractMsgDBData: CityName = " + cdtrAgtCity);

		var cdtrAgtCtryPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/Ctry';
		var cdtrAgtCtry = getValueFromPath(Document, cdtrAgtCtryPath);
		//msgdbMap.put("BENBANKCTRY", cdtrAgtCtry);
		setHeader(map, "PLCN_benBankCtry", cdtrAgtCtry);

		var cdtrAgtCityPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/CtrySubDvsn';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		//msgdbMap.put("BENBANKSTATECODE", cdtrAgtCity);
		setHeader(map, "PLCN_benBankStateCode", cdtrAgtCity);

		var cdtrAgtCityPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/PstCd';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		//msgdbMap.put("BENBANKZIPCODE", cdtrAgtCity);
		setHeader(map, "PLCN_benbankzipcode", cdtrAgtCity);
	}
	
	if(msgType === 'pacs.002.001.10'){
		var dbtrNmPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/Dbtr/Pty/Nm';
		var dbtrNm = getValueFromPath(Document, dbtrNmPath);
		logger.info("extractMsgDBData:  dbtrNm = " + dbtrNm);
		//msgdbMap.put("ORIGNAME", dbtrNm);	
		setHeader(map, "PLCN_origName", dbtrNm);
		
		var debtorAgentPth = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/DbtrAgt/FinInstnId/BICFI';
		var debtorAgent = getValueFromPath(Document, debtorAgentPth);
		//msgdbMap.put("CUSTOMER", debtorAgent);
		setHeader(map, "PLCN_customer", debtorAgent);
		
		var debtorAgentNmPth = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/DbtrAgt/FinInstnId/Nm';
		var debtorAgentNm = getValueFromPath(Document, debtorAgentNmPth);
		//msgdbMap.put("ORIGBANKNAME", debtorAgentNm);
		setHeader(map, "PLCN_origBankName", debtorAgentNm);
		
		var debtorAccPth = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		if(debtorAcc){
			//msgdbMap.put("ACCOUNT_DR", debtorAcc);
			setHeader(map, "PLCN_accountDr", debtorAcc);
			setHeader(map, "PLCN_accountNumber", debtorAcc);
			setHeader(map, "PLCN_customerAccNo", debtorAcc);
		}
		if(!debtorAcc){
			var debtorAccPth = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			if(debtorAcc){
				//msgdbMap.put("ACCOUNT_DR", debtorAcc);
				setHeader(map, "PLCN_accountDr", debtorAcc);
				setHeader(map, "PLCN_accountNumber", debtorAcc);
				setHeader(map, "PLCN_customerAccNo", debtorAcc);
			}
		}
		
		logger.info("extractMsgDBData:  ACCOUNT_DR = " + debtorAcc);

		var cdtrNmPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/Cdtr/Pty/Nm';
		var cdtrNm = getValueFromPath(Document, cdtrNmPath);
		logger.info("extractMsgDBData: cdtrAgtNm = " + cdtrNm);
		//msgdbMap.put("BENEFNAME", cdtrNm);
		//msgdbMap.put("OTHER_PARTY_DETAILS", cdtrNm);
		setHeader(map, "PLCN_benefName", cdtrNm);
		setHeader(map, "PLCN_otherPartyDetails", cdtrNm);
		
		var creditorAccPth = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		//msgdbMap.put("other_accno", creditorAcc);
		setHeader(map, "PLCN_otherAccno", creditorAcc);
		setHeader(map, "PLCN_accountCr", creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			//msgdbMap.put("OTHER_ACCNO", creditorAcc);
			setHeader(map, "PLCN_otherAccno", creditorAcc);
			setHeader(map, "PLCN_accountCr", creditorAcc);
		}

		var cdtrAgtNmPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/Nm';
		var cdtrAgtNm = getValueFromPath(Document, cdtrAgtNmPath);
		//msgdbMap.put("BENBANKNAME", cdtrAgtNm);
		setHeader(map, "PLCN_benBankName", cdtrAgtNm);
		logger.info("extractMsgDBData: CdtrAgtNm = " + cdtrAgtNm);

		var cdtrAgtAddr1Path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/AdrLine[1]';
		var cdtrAgtAddr1 = getValueFromPath(Document, cdtrAgtAddr1Path);
		//msgdbMap.put("BENBANKADDR1", cdtrAgtAddr1);
		setHeader(map, "PLCN_benBankAddr1", cdtrAgtAddr1);
		logger.info("extractMsgDBData: CdtrAgtAddr1 = " + cdtrAgtAddr1);

		var cdtrAgtAddr2Path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/AdrLine[2]';
		var cdtrAgtAddr2 = getValueFromPath(Document, cdtrAgtAddr2Path);
		//msgdbMap.put("BENBANKADDR2", cdtrAgtAddr2);
		setHeader(map, "PLCN_benBankAddr2", cdtrAgtAddr2);
		logger.info("extractMsgDBData: CdtrAgtAddr2 = " + cdtrAgtAddr2);

		/*var cdtrAgtAddr3Path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/AdrLine[3]';
		var cdtrAgtAddr3 = getValueFromPath(Document, cdtrAgtAddr3Path);
		//msgdbMap.put("BENBANKADDR3", cdtrAgtAddr3);
		setHeader(map, "PLCN_benBankAddr3", cdtrAgtAddr3);
		logger.info("extractMsgDBData: CdtrAgtAddr3 = " + cdtrAgtAddr3); */

		var cdtrAgtCityPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/TwnNm';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		//msgdbMap.put("BENBANKCITY", cdtrAgtCity);
		setHeader(map, "PLCN_benBankCity", cdtrAgtCity);
		logger.info("extractMsgDBData: CityName = " + cdtrAgtCity);

		var cdtrAgtCtryPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/Ctry';
		var cdtrAgtCtry = getValueFromPath(Document, cdtrAgtCtryPath);
		//msgdbMap.put("BENBANKCTRY", cdtrAgtCtry);
		setHeader(map, "PLCN_benBankCtry", cdtrAgtCtry);

		var cdtrAgtCityPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/CtrySubDvsn';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		//msgdbMap.put("BENBANKSTATECODE", cdtrAgtCity);
		setHeader(map, "PLCN_benBankStateCode", cdtrAgtCity);

		var cdtrAgtCityPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/PstlAdr/PstCd';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		//msgdbMap.put("BENBANKZIPCODE", cdtrAgtCity);
		setHeader(map, "PLCN_benbankzipcode", cdtrAgtCity);
	}
	
	if(msgType === 'pacs.003.001.08'){
		var DbtrNmPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/Nm';
		var DbtrNm = getValueFromPath(Document, DbtrNmPath);
		setHeader(map, "PLCN_origName", DbtrNm);
		logger.info("extractMsgDBData:  DbtrNm = " + DbtrNm);

		var debtorAccPth = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		if(debtorAcc){
			setHeader(map, "PLCN_accountDr", debtorAcc);
			setHeader(map, "PLCN_accountNumber", debtorAcc);
			setHeader(map, "PLCN_customerAccNo", debtorAcc);
			logger.info("extractMsgDBData:  debtorAcc = " + debtorAcc);
		}
		if(!debtorAcc){
			var debtorAccPth = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			if(debtorAcc){
				setHeader(map, "PLCN_accountDr", debtorAcc);
				setHeader(map, "PLCN_accountNumber", debtorAcc);
				setHeader(map, "PLCN_customerAccNo", debtorAcc);
				logger.info("extractMsgDBData:  debtorAcc = " + debtorAcc);
			}
		}

		var debtorAgentPth = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CdtrAgt/FinInstnId/BICFI';
		var debtorAgent = getValueFromPath(Document, debtorAgentPth);
		setHeader(map, "PLCN_customer", debtorAgent);
		logger.info("extractMsgDBData:  debtorAgent = " + debtorAgent);

		var debtorAgentNmPth = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CdtrAgt/FinInstnId/Nm';
		var debtorAgentNm = getValueFromPath(Document, debtorAgentNmPth);
		setHeader(map, "PLCN_origBankName", debtorAgentNm);
		logger.info("extractMsgDBData:  debtorAgentNm = " + debtorAgentNm);

		var cdtrAgentNmPth = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CdtrAgt/FinInstnId/Nm';
		var cdtrAgentNm = getValueFromPath(Document, cdtrAgentNmPth);
		setHeader(map, "PLCN_benBankName", cdtrAgentNm);
		logger.info("extractMsgDBData:  cdtrAgentNm = " + cdtrAgentNm);

		var cdtrNmPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/Nm';
		var cdtrNm = getValueFromPath(Document, cdtrNmPath);
		setHeader(map, "PLCN_benefName", cdtrNm);
		setHeader(map, "PLCN_otherPartyDetails", cdtrNm);
		logger.info("extractMsgDBData:  cdtrNm = " + cdtrNm);
		
		var creditorAccPth = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		setHeader(map, "PLCN_otherAccno", creditorAcc);
		setHeader(map, "PLCN_accountCr", creditorAcc);
		logger.info("extractMsgDBData:  creditorAcc = " + creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			setHeader(map, "PLCN_otherAccno", creditorAcc);
			setHeader(map, "PLCN_accountCr", creditorAcc);
			logger.info("extractMsgDBData:  creditorAcc = " + creditorAcc);
		}

		var cdtrAddr1Path = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/AdrLine[1]';
		var cdtrAddr1 = getValueFromPath(Document, cdtrAddr1Path);
		setHeader(map, "PLCN_benBankAddr1", cdtrAddr1);
		logger.info("extractMsgDBData: cdtrAddr1 = " + cdtrAddr1);

		var cdtrAddr2Path = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/AdrLine[2]';
		var cdtrAddr2 = getValueFromPath(Document, cdtrAddr2Path);
		setHeader(map, "PLCN_benBankAddr2", cdtrAddr2);
		logger.info("extractMsgDBData: cdtrAddr2 = " + cdtrAddr2);

		var cdtrAddr3Path = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/AdrLine[3]';
		var cdtrAddr3 = getValueFromPath(Document, cdtrAddr3Path);
		setHeader(map, "PLCN_benBankAddr3", cdtrAddr3);
		logger.info("extractMsgDBData: cdtrAddr3 = " + cdtrAddr3);
		
		var cdtrCityPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/CtryOfRes';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		setHeader(map, "PLCN_benBankCity", cdtrCity);
		logger.info("extractMsgDBData: cdtrCity = " + cdtrCity);

		var cdtrCtryPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/CtctDtls';
		var cdtrCtry = getValueFromPath(Document, cdtrCtryPath);
		setHeader(map, "PLCN_benBankCtry", cdtrCtry);
		logger.info("extractMsgDBData: cdtrCtry = " + cdtrCtry);

	}
	
	if(msgType === 'pacs.007.001.09'){
		var dbtrNmPath = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Dbtr/Pty/Nm';
		var dbtrNm = getValueFromPath(Document, dbtrNmPath);
		setHeader(map, "PLCN_origName", dbtrNm);
		logger.info("extractMsgDBData:  dbtrNm = " + dbtrNm);

		var debtorAccPth = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		if(debtorAcc){
			setHeader(map, "PLCN_accountDr", debtorAcc);
			setHeader(map, "PLCN_accountNumber", debtorAcc);
			setHeader(map, "PLCN_customerAccNo", debtorAcc);
			logger.info("extractMsgDBData:  debtorAcc = " + debtorAcc);
		}
		if(!debtorAcc){
			var debtorAccPth = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			if(debtorAcc){
				setHeader(map, "PLCN_accountDr", debtorAcc);
				setHeader(map, "PLCN_accountNumber", debtorAcc);
				setHeader(map, "PLCN_customerAccNo", debtorAcc);
				logger.info("extractMsgDBData:  debtorAcc = " + debtorAcc);
			}
		}

		var debtorAgentPth = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/DbtrAgt/FinInstnId/BICFI';
		var debtorAgent = getValueFromPath(Document, debtorAgentPth);
		setHeader(map, "PLCN_customer", debtorAgent);
		logger.info("extractMsgDBData:  debtorAgent = " + debtorAgent);

		var debtorAgentNmPth = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/DbtrAgt/FinInstnId/Nm';
		var debtorAgentNm = getValueFromPath(Document, debtorAgentNmPth);
		setHeader(map, "PLCN_origBankName", debtorAgentNm);
		logger.info("extractMsgDBData:  debtorAgentNm = " + debtorAgentNm);

		var cdtrAgentNmPth = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/Nm';
		var cdtrAgentNm = getValueFromPath(Document, cdtrAgentNmPth);
		setHeader(map, "PLCN_benBankName", cdtrAgentNm);
		logger.info("extractMsgDBData:  cdtrAgentNm = " + cdtrAgentNm);

		var cdtrNmPath = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Cdtr/Nm';
		var cdtrNm = getValueFromPath(Document, cdtrNmPath);
		setHeader(map, "PLCN_benefName", cdtrNm);
		setHeader(map, "PLCN_otherPartyDetails", cdtrNm);
		logger.info("extractMsgDBData:  cdtrNm = " + cdtrNm);
		
		var creditorAccPth = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		setHeader(map, "PLCN_otherAccno", creditorAcc);
		setHeader(map, "PLCN_accountCr", creditorAcc);
		logger.info("extractMsgDBData:  creditorAcc = " + creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			setHeader(map, "PLCN_otherAccno", creditorAcc);
			setHeader(map, "PLCN_accountCr", creditorAcc);
		}

		var cdtrAddr1Path = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Cdtr/Pty/PstlAdr/AdrLine[1]';
		var cdtrAddr1 = getValueFromPath(Document, cdtrAddr1Path);
		setHeader(map, "PLCN_benBankAddr1", cdtrAddr1);
		logger.info("extractMsgDBData: cdtrAddr1 = " + cdtrAddr1);

		var cdtrAddr2Path = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Cdtr/Pty/PstlAdr/AdrLine[2]';
		var cdtrAddr2 = getValueFromPath(Document, cdtrAddr2Path);
		setHeader(map, "PLCN_benBankAddr2", cdtrAddr2);
		logger.info("extractMsgDBData: cdtrAddr2 = " + cdtrAddr2);

		var cdtrAddr3Path = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Cdtr/Pty/PstlAdr/AdrLine[3]';
		var cdtrAddr3 = getValueFromPath(Document, cdtrAddr3Path);
		setHeader(map, "PLCN_benBankAddr3", cdtrAddr3);
		logger.info("extractMsgDBData: cdtrAddr3 = " + cdtrAddr3);
		
		var cdtrCityPath = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Cdtr/Pty/PstlAdr/CtryOfRes';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		setHeader(map, "PLCN_benBankCity", cdtrCity);
		logger.info("extractMsgDBData: cdtrCity = " + cdtrCity);

		var cdtrCtryPath = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Cdtr/Pty/PstlAdr/CtctDtls';
		var cdtrCtry = getValueFromPath(Document, cdtrCtryPath);
		setHeader(map, "PLCN_benBankCtry", cdtrCtry);
		logger.info("extractMsgDBData: cdtrCtry = " + cdtrCtry);

		
	}


}

function extractSepaMsgDataDbToDbFlow(exchange) {    
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	var msgType = getHeader(map, "PLCN_msgType");
	logger.info("extractSepaMsgDataDbToDbFlow:  msgType = " + msgType);
	
    var parser = new XMLParser();
	body = inMsg.getBody(java.lang.String.class);
	parser.parseXML(body);
	Document = parser.parseXML(body);

	if(msgType === 'pacs.008.001.08'){
        //Debtor Name -> PLCN_origname header -> MSGDB.ORIGNAME
        //Debtor Name -> PLCN_origname header -> MSGDB_PAY.MDBPAY_ORD_INST_NAME_ADDR1
		var path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Nm';
		var value = getValueFromPath(Document, path);
		logger.info("extractSepaMsgDataDbToDbFlow:  DbtrNm / PLCN_origname = " + value);
		setHeader(map, "PLCN_origName", value);

        // Debtor ID/IBAN -> PLCN_customerAccNo -> MSGDB.CUSTOMERACCNO
		path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		value = getValueFromPath(Document, path);
		if(!value){
			path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			value = getValueFromPath(Document, path);
		}
        if(value){
			setHeader(map, "PLCN_customerAccNo", value);
		}
		logger.info("extractSepaMsgDataDbToDbFlow:  DbtrId / PLCN_customerAccNo = " + value);
        
        // Creditor Name -> PLCN_otherPartyDetails -> MSGDB.OTHER_PARTY_DETAILS
        // Creditor Name -> PLCN_benefName -> MSGDB.BENEFNAME
        // Creditor Name -> PLCN_benBankName -> MSGDB.BENBANKNAME
		path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Nm';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benefName", value);
        setHeader(map, "PLCN_benBankName", value);
		setHeader(map, "PLCN_otherPartyDetails", value);
		logger.info("extractSepaMsgDataDbToDbFlow:  CdtrNm / PLCN_otherPartyDetails = " + value);
		
        // Creditor ID/IBAN -> PLCN_otherAccno -> MSGDB.OTHER_ACCNO
		path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN';
		value = getValueFromPath(Document, path);
		if(!value){
			path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/Othr/Id';
			value = getValueFromPath(Document, value);
		}
        if(value){
			setHeader(map, "PLCN_otherAccno", value);
		}
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrId / PLCN_otherAccno = " + value);

        // Creditor AdrLine1 -> PLCN_benBankAddr1 -> MSGDB.BENBANKADDR1
        // Creditor AdrLine2 -> PLCN_benBankAddr2 -> MSGDB.BENBANKADDR2
		path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/AdrLine[1]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benBankAddr1", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrAdrLine1 / PLCN_benBankAddr1 = " + value);
		
        path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/AdrLine[2]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benBankAddr2", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrAdrLine2 / PLCN_benBankAddr2 = " + value);
        
        // Debtor AdrLine1 -> PLCN_payerAddr1 -> MSGDB_PAY.MDBPAY_ORD_INST_ADDR2
        // Debtor AdrLine2 -> PLCN_payerAddr2 -> MSGDB_PAY.MDBPAY_ORD_INST_ADDR3
        path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/AdrLine[1]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_payerAddr1", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  DbtrAdrLine1 / PLCN_payerAddr1 = " + value);
        
        path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/AdrLine[2]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_payerAddr2", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  DbtrAdrLine2 / PLCN_payerAddr2 = " + value);
	}

    if(msgType === 'pacs.003.001.08'){
        //Debtor Name -> PLCN_origname header -> MSGDB.ORIGNAME
        //Debtor Name -> PLCN_origname header -> MSGDB_PAY.MDBPAY_ORD_INST_NAME_ADDR1
		var path = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/Nm';
		var value = getValueFromPath(Document, path);
		logger.info("extractSepaMsgDataDbToDbFlow:  DbtrNm / PLCN_origname = " + value);
		setHeader(map, "PLCN_origName", value);

        // Debtor ID/IBAN -> PLCN_customerAccNo -> MSGDB.CUSTOMERACCNO
		path = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DbtrAcct/Id/IBAN';
		value = getValueFromPath(Document, path);
		if(!value){
			path = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DbtrAcct/Id/Othr/Id';
			value = getValueFromPath(Document, path);
		}
        if(value){
			setHeader(map, "PLCN_customerAccNo", value);
		}
		logger.info("extractSepaMsgDataDbToDbFlow:  DbtrId / PLCN_customerAccNo = " + value);
        
        // Creditor Name -> PLCN_otherPartyDetails -> MSGDB.OTHER_PARTY_DETAILS
        // Creditor Name -> PLCN_benefName -> MSGDB.BENEFNAME
        // Creditor Name -> PLCN_benBankName -> MSGDB.BENBANKNAME
		path = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/Nm';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benefName", value);
        setHeader(map, "PLCN_benBankName", value);
		setHeader(map, "PLCN_otherPartyDetails", value);
		logger.info("extractSepaMsgDataDbToDbFlow:  CdtrNm / PLCN_otherPartyDetails = " + value);
		
        // Creditor ID/IBAN -> PLCN_otherAccno -> MSGDB.OTHER_ACCNO
		path = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CdtrAcct/Id/IBAN';
		value = getValueFromPath(Document, path);
		if(!value){
			path = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CdtrAcct/Id/Othr/Id';
			value = getValueFromPath(Document, value);
		}
        if(value){
			setHeader(map, "PLCN_otherAccno", value);
		}
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrId / PLCN_otherAccno = " + value);

        // Creditor AdrLine1 -> PLCN_benBankAddr1 -> MSGDB.BENBANKADDR1
        // Creditor AdrLine2 -> PLCN_benBankAddr2 -> MSGDB.BENBANKADDR2
		path = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/AdrLine[1]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benBankAddr1", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrAdrLine1 / PLCN_benBankAddr1 = " + value);
		
        path = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/AdrLine[2]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benBankAddr2", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrAdrLine2 / PLCN_benBankAddr2 = " + value);
        
        // Debtor AdrLine1 -> PLCN_payerAddr1 -> MSGDB_PAY.MDBPAY_ORD_INST_ADDR2
        // Debtor AdrLine2 -> PLCN_payerAddr2 -> MSGDB_PAY.MDBPAY_ORD_INST_ADDR3
        path = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/AdrLine[1]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_payerAddr1", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  DbtrAdrLine1 / PLCN_payerAddr1 = " + value);
        
        path = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/AdrLine[2]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_payerAddr2", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  DbtrAdrLine2 / PLCN_payerAddr2 = " + value);
	}
    
	if(msgType === 'pacs.004.001.09'){
        //Debtor Name -> PLCN_origname header -> MSGDB.ORIGNAME
        //Debtor Name -> PLCN_origname header -> MSGDB_PAY.MDBPAY_ORD_INST_NAME_ADDR1
		var path = '/Document/PmtRtr/TxInf/OrgnlTxRef/Dbtr/Pty/Nm';
		var value = getValueFromPath(Document, path);
		logger.info("extractSepaMsgDataDbToDbFlow:  DbtrNm / PLCN_origname = " + value);
		setHeader(map, "PLCN_origName", value);

        // Debtor ID/IBAN -> PLCN_customerAccNo -> MSGDB.CUSTOMERACCNO
		path = '/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN';
		value = getValueFromPath(Document, path);
		if(!value){
			path = '/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAcct/Id/Othr/Id';
			value = getValueFromPath(Document, path);
		}
        if(value){
			setHeader(map, "PLCN_customerAccNo", value);
		}
		logger.info("extractSepaMsgDataDbToDbFlow:  DbtrId / PLCN_customerAccNo = " + value);
        
        // Creditor Name -> PLCN_otherPartyDetails -> MSGDB.OTHER_PARTY_DETAILS
        // Creditor Name -> PLCN_benefName -> MSGDB.BENEFNAME
        // Creditor Name -> PLCN_benBankName -> MSGDB.BENBANKNAME
		path = '/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/Pty/Nm';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benefName", value);
        setHeader(map, "PLCN_benBankName", value);
		setHeader(map, "PLCN_otherPartyDetails", value);
		logger.info("extractSepaMsgDataDbToDbFlow:  CdtrNm / PLCN_otherPartyDetails = " + value);
		
        // Creditor ID/IBAN -> PLCN_otherAccno -> MSGDB.OTHER_ACCNO
		path = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN';
		value = getValueFromPath(Document, path);
		if(!value){
			path = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAcct/Id/Othr/Id';
			value = getValueFromPath(Document, value);
		}
        if(value){
			setHeader(map, "PLCN_otherAccno", value);
		}
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrId / PLCN_otherAccno = " + value);

        // Creditor AdrLine1 -> PLCN_benBankAddr1 -> MSGDB.BENBANKADDR1
        // Creditor AdrLine2 -> PLCN_benBankAddr2 -> MSGDB.BENBANKADDR2
		path = '/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/Pty/PstlAdr/AdrLine[1]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benBankAddr1", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrAdrLine1 / PLCN_benBankAddr1 = " + value);
		
        path = '/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/Pty/PstlAdr/AdrLine[2]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benBankAddr2", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrAdrLine2 / PLCN_benBankAddr2 = " + value);
        
        // Debtor AdrLine1 -> PLCN_payerAddr1 -> MSGDB_PAY.MDBPAY_ORD_INST_ADDR2
        // Debtor AdrLine2 -> PLCN_payerAddr2 -> MSGDB_PAY.MDBPAY_ORD_INST_ADDR3
        path = '/Document/PmtRtr/TxInf/OrgnlTxRef/Dbtr/Pty/PstlAdr/AdrLine[1]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_payerAddr1", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  DbtrAdrLine1 / PLCN_payerAddr1 = " + value);
        
        path = '/Document/PmtRtr/TxInf/OrgnlTxRef/Dbtr/Pty/PstlAdr/AdrLine[2]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_payerAddr2", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  DbtrAdrLine2 / PLCN_payerAddr2 = " + value);
	}
    
	if(msgType === 'camt.056.001.08'){
        //Debtor Name -> PLCN_origname header -> MSGDB.ORIGNAME
        //Debtor Name -> PLCN_origname header -> MSGDB_PAY.MDBPAY_ORD_INST_NAME_ADDR1
		var path = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/Dbtr/Pty/Nm';
		var value = getValueFromPath(Document, path);
		logger.info("extractSepaMsgDataDbToDbFlow:  DbtrNm / PLCN_origname = " + value);
		setHeader(map, "PLCN_origName", value);

        // Debtor ID/IBAN -> PLCN_customerAccNo -> MSGDB.CUSTOMERACCNO
		path = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN';
		value = getValueFromPath(Document, path);
		if(!value){
			path = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/DbtrAcct/Id/Othr/Id';
			value = getValueFromPath(Document, path);
		}
        if(value){
			setHeader(map, "PLCN_customerAccNo", value);
		}
		logger.info("extractSepaMsgDataDbToDbFlow:  DbtrId / PLCN_customerAccNo = " + value);
        
        // Creditor Name -> PLCN_otherPartyDetails -> MSGDB.OTHER_PARTY_DETAILS
        // Creditor Name -> PLCN_benefName -> MSGDB.BENEFNAME
        // Creditor Name -> PLCN_benBankName -> MSGDB.BENBANKNAME
		path = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/Cdtr/Pty/Nm';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benefName", value);
        setHeader(map, "PLCN_benBankName", value);
		setHeader(map, "PLCN_otherPartyDetails", value);
		logger.info("extractSepaMsgDataDbToDbFlow:  CdtrNm / PLCN_otherPartyDetails = " + value);
		
        // Creditor ID/IBAN -> PLCN_otherAccno -> MSGDB.OTHER_ACCNO
		path = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN';
		value = getValueFromPath(Document, path);
		if(!value){
			path = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/CdtrAcct/Id/Othr/Id';
			value = getValueFromPath(Document, value);
		}
        if(value){
			setHeader(map, "PLCN_otherAccno", value);
		}
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrId / PLCN_otherAccno = " + value);

        // Creditor AdrLine1 -> PLCN_benBankAddr1 -> MSGDB.BENBANKADDR1
        // Creditor AdrLine2 -> PLCN_benBankAddr2 -> MSGDB.BENBANKADDR2
		path = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/Cdtr/Pty/PstlAdr/AdrLine[1]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benBankAddr1", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrAdrLine1 / PLCN_benBankAddr1 = " + value);
		
        path = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/Cdtr/Pty/PstlAdr/AdrLine[2]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benBankAddr2", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrAdrLine2 / PLCN_benBankAddr2 = " + value);
        
        // Debtor AdrLine1 -> PLCN_payerAddr1 -> MSGDB_PAY.MDBPAY_ORD_INST_ADDR2
        // Debtor AdrLine2 -> PLCN_payerAddr2 -> MSGDB_PAY.MDBPAY_ORD_INST_ADDR3
        path = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/Dbtr/Pty/PstlAdr/AdrLine[1]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_payerAddr1", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  DbtrAdrLine1 / PLCN_payerAddr1 = " + value);
        
        path = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/Dbtr/Pty/PstlAdr/AdrLine[2]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_payerAddr2", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  DbtrAdrLine2 / PLCN_payerAddr2 = " + value);
	}

	if(msgType === 'camt.029.001.09'){
        //Debtor Name -> PLCN_origname header -> MSGDB.ORIGNAME
        //Debtor Name -> PLCN_origname header -> MSGDB_PAY.MDBPAY_ORD_INST_NAME_ADDR1
		var path = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/Dbtr/Nm';
		var value = getValueFromPath(Document, path);
		logger.info("extractSepaMsgDataDbToDbFlow:  DbtrNm / PLCN_origname = " + value);
		setHeader(map, "PLCN_origName", value);

        // Debtor ID/IBAN -> PLCN_customerAccNo -> MSGDB.CUSTOMERACCNO
		path = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/DbtrAcct/Id/IBAN';
		value = getValueFromPath(Document, path);
		if(!value){
			path = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/DbtrAcct/Id/Othr/Id';
			value = getValueFromPath(Document, path);
		}
        if(value){
			setHeader(map, "PLCN_customerAccNo", value);
		}
		logger.info("extractSepaMsgDataDbToDbFlow:  DbtrId / PLCN_customerAccNo = " + value);
        
        // Creditor Name -> PLCN_otherPartyDetails -> MSGDB.OTHER_PARTY_DETAILS
        // Creditor Name -> PLCN_benefName -> MSGDB.BENEFNAME
        // Creditor Name -> PLCN_benBankName -> MSGDB.BENBANKNAME
		path = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/Cdtr/Nm';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benefName", value);
        setHeader(map, "PLCN_benBankName", value);
		setHeader(map, "PLCN_otherPartyDetails", value);
		logger.info("extractSepaMsgDataDbToDbFlow:  CdtrNm / PLCN_otherPartyDetails = " + value);
		
        // Creditor ID/IBAN -> PLCN_otherAccno -> MSGDB.OTHER_ACCNO
		path = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/CdtrAcct/Id/IBAN';
		value = getValueFromPath(Document, path);
		if(!value){
			path = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/CdtrAcct/Id/Othr/Id';
			value = getValueFromPath(Document, value);
		}
        if(value){
			setHeader(map, "PLCN_otherAccno", value);
		}
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrId / PLCN_otherAccno = " + value);

        // Creditor AdrLine1 -> PLCN_benBankAddr1 -> MSGDB.BENBANKADDR1
        // Creditor AdrLine2 -> PLCN_benBankAddr2 -> MSGDB.BENBANKADDR2
		path = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/Cdtr/PstlAdr/AdrLine[1]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benBankAddr1", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrAdrLine1 / PLCN_benBankAddr1 = " + value);
		
        path = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/Cdtr/PstlAdr/AdrLine[2]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benBankAddr2", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrAdrLine2 / PLCN_benBankAddr2 = " + value);
        
        // Debtor AdrLine1 -> PLCN_payerAddr1 -> MSGDB_PAY.MDBPAY_ORD_INST_ADDR2
        // Debtor AdrLine2 -> PLCN_payerAddr2 -> MSGDB_PAY.MDBPAY_ORD_INST_ADDR3
        path = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/Dbtr/PstlAdr/AdrLine[1]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_payerAddr1", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  DbtrAdrLine1 / PLCN_payerAddr1 = " + value);
        
        path = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/Dbtr/PstlAdr/AdrLine[2]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_payerAddr2", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  DbtrAdrLine2 / PLCN_payerAddr2 = " + value);
	}
    
	if(msgType === 'pacs.002.001.10'){
        //Debtor Name -> PLCN_origname header -> MSGDB.ORIGNAME
        //Debtor Name -> PLCN_payerName header -> MSGDB_PAY.MDBPAY_ORD_INST_NAME_ADDR1
		var path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/Dbtr/Pty/Nm';
		var value = getValueFromPath(Document, path);
		logger.info("extractSepaMsgDataDbToDbFlow:  DbtrNm / PLCN_origname = " + value);
		setHeader(map, "PLCN_origName", value);
        setHeader(map, "PLCN_payerName", value);

        // Debtor ID/IBAN -> PLCN_customerAccNo -> MSGDB.CUSTOMERACCNO
		path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/DbtrAcct/Id/IBAN';
		value = getValueFromPath(Document, path);
		if(!value){
			path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/DbtrAcct/Id/Othr/Id';
			value = getValueFromPath(Document, path);
		}
        if(value){
			setHeader(map, "PLCN_customerAccNo", value);
		}
		logger.info("extractSepaMsgDataDbToDbFlow:  DbtrId / PLCN_customerAccNo = " + value);
        
        // Creditor Name -> PLCN_otherPartyDetails -> MSGDB.OTHER_PARTY_DETAILS
        // Creditor Name -> PLCN_benefName -> MSGDB.BENEFNAME
        // Creditor Name -> PLCN_benBankName -> MSGDB.BENBANKNAME
		path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/Cdtr/Pty/Nm';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benefName", value);
        setHeader(map, "PLCN_benBankName", value);
		setHeader(map, "PLCN_otherPartyDetails", value);
		logger.info("extractSepaMsgDataDbToDbFlow:  CdtrNm / PLCN_otherPartyDetails = " + value);
		
        // Creditor ID/IBAN -> PLCN_otherAccno -> MSGDB.OTHER_ACCNO
		path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAcct/Id/IBAN';
		value = getValueFromPath(Document, path);
		if(!value){
			path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAcct/Id/Othr/Id';
			value = getValueFromPath(Document, value);
		}
        if(value){
			setHeader(map, "PLCN_otherAccno", value);
		}
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrId / PLCN_otherAccno = " + value);

        // Creditor AdrLine1 -> PLCN_benBankAddr1 -> MSGDB.BENBANKADDR1
        // Creditor AdrLine2 -> PLCN_benBankAddr2 -> MSGDB.BENBANKADDR2
		path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/Cdtr/Pty/PstlAdr/AdrLine[1]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benBankAddr1", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrAdrLine1 / PLCN_benBankAddr1 = " + value);
		
        path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/Cdtr/Pty/PstlAdr/AdrLine[2]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benBankAddr2", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrAdrLine2 / PLCN_benBankAddr2 = " + value);
        
        // Debtor AdrLine1 -> PLCN_payerAddr1 -> MSGDB_PAY.MDBPAY_ORD_INST_ADDR2
        // Debtor AdrLine2 -> PLCN_payerAddr2 -> MSGDB_PAY.MDBPAY_ORD_INST_ADDR3
        path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/Dbtr/Pty/PstlAdr/AdrLine[1]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_payerAddr1", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  DbtrAdrLine1 / PLCN_payerAddr1 = " + value);
        
        path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/Dbtr/Pty/PstlAdr/AdrLine[2]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_payerAddr2", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  DbtrAdrLine2 / PLCN_payerAddr2 = " + value);
	}
    
	if(msgType === 'pacs.007.001.09'){
        //Debtor Name -> PLCN_origname header -> MSGDB.ORIGNAME
        //Debtor Name -> PLCN_origname header -> MSGDB_PAY.MDBPAY_ORD_INST_NAME_ADDR1
		var path = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Dbtr/Pty/Nm';
		var value = getValueFromPath(Document, path);
		logger.info("extractSepaMsgDataDbToDbFlow:  DbtrNm / PLCN_origname = " + value);
		setHeader(map, "PLCN_origName", value);

        // Debtor ID/IBAN -> PLCN_customerAccNo -> MSGDB.CUSTOMERACCNO
		path = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN';
		value = getValueFromPath(Document, path);
		if(!value){
			path = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/DbtrAcct/Id/Othr/Id';
			value = getValueFromPath(Document, path);
		}
        if(value){
			setHeader(map, "PLCN_customerAccNo", value);
		}
		logger.info("extractSepaMsgDataDbToDbFlow:  DbtrId / PLCN_customerAccNo = " + value);
        
        // Creditor Name -> PLCN_otherPartyDetails -> MSGDB.OTHER_PARTY_DETAILS
        // Creditor Name -> PLCN_benefName -> MSGDB.BENEFNAME
        // Creditor Name -> PLCN_benBankName -> MSGDB.BENBANKNAME
		path = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Cdtr/Pty/Nm';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benefName", value);
        setHeader(map, "PLCN_benBankName", value);
		setHeader(map, "PLCN_otherPartyDetails", value);
		logger.info("extractSepaMsgDataDbToDbFlow:  CdtrNm / PLCN_otherPartyDetails = " + value);
		
        // Creditor ID/IBAN -> PLCN_otherAccno -> MSGDB.OTHER_ACCNO
		path = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN';
		value = getValueFromPath(Document, path);
		if(!value){
			path = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/CdtrAcct/Id/Othr/Id';
			value = getValueFromPath(Document, value);
		}
        if(value){
			setHeader(map, "PLCN_otherAccno", value);
		}
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrId / PLCN_otherAccno = " + value);

        // Creditor AdrLine1 -> PLCN_benBankAddr1 -> MSGDB.BENBANKADDR1
        // Creditor AdrLine2 -> PLCN_benBankAddr2 -> MSGDB.BENBANKADDR2
		path = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Cdtr/Pty/PstlAdr/AdrLine[1]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benBankAddr1", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrAdrLine1 / PLCN_benBankAddr1 = " + value);
		
        path = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Cdtr/Pty/PstlAdr/AdrLine[2]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_benBankAddr2", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  CdtrAdrLine2 / PLCN_benBankAddr2 = " + value);
        
        // Debtor AdrLine1 -> PLCN_payerAddr1 -> MSGDB_PAY.MDBPAY_ORD_INST_ADDR2
        // Debtor AdrLine2 -> PLCN_payerAddr2 -> MSGDB_PAY.MDBPAY_ORD_INST_ADDR3
        path = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Dbtr/Pty/PstlAdr/AdrLine[1]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_payerAddr1", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  DbtrAdrLine1 / PLCN_payerAddr1 = " + value);
        
        path = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Dbtr/Pty/PstlAdr/AdrLine[2]';
		value = getValueFromPath(Document, path);
		setHeader(map, "PLCN_payerAddr2", value);
        logger.info("extractSepaMsgDataDbToDbFlow:  DbtrAdrLine2 / PLCN_payerAddr2 = " + value);
	}
}

function proxyResolution(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	
	logger.info("In proxyResolution");

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("proxyResolution: custom13 = " + custom13);

	//custom13 check to be added
	var proxyResolutionConfigured = false;
	setHeader(map, "PLCN_proxyResolutionConfigured", proxyResolutionConfigured);

	if(proxyResolutionConfigured == false) {
		setHeader(map, "PLCN_ProxyResExit", false);
	}
}

function beneficiaryValidation(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	
	logger.info("In beneficiaryValidation");

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("beneficiaryValidation: custom13 = " + custom13);

	//custom13 check to be added
	var beneficiaryValidationConfigured = false;
	setHeader(map, "PLCN_beneficiaryValidationConfigured", beneficiaryValidationConfigured);

	if(beneficiaryValidationConfigured == false) {
		setHeader(map, "PLCN_beneficiaryValidationExit", false);
	}
}

function accountValidation(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	
	logger.info("In accountValidation");

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("accountValidation: custom13 = " + custom13);

	//custom13 check to be added
	var accountValidationConfigured = false;
	setHeader(map, "PLCN_accountValidationConfigured", accountValidationConfigured);

	if(accountValidationConfigured == false) {
		setHeader(map, "PLCN_accountValidationExit", false);
	}
}

function debtorValidation(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	
	logger.info("In debtorValidation");

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("debtorValidation: custom13 = " + custom13);

	//custom13 check to be added
	var debtorValidationConfigured = false;
	setHeader(map, "PLCN_debtorValidationConfigured", debtorValidationConfigured);

	if(debtorValidationConfigured == false) {
		setHeader(map, "PLCN_debtorValidationExit", false);
	}
}

function complianceCheck(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var complianceCheckConfigured;
	
	logger.info("In complianceCheck");

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("complianceCheck: custom13 = " + custom13);

	var prevQueueId = getHeader(map, "PLCN_prevQueueId");
	logger.info("complianceCheck: prevQueueId = " + prevQueueId);

	todaysDate = getDate();
	logger.info("complianceCheck: todaysDate = " + todaysDate);

	var lastSanctiondate = getHeader(map, "PLCN_lastSanctiondate");
	logger.info("complianceCheck: lastSanctiondate = " + lastSanctiondate);

	if(isPatternPresent(custom13, "SCANNING=Y") /*|| isPatternPresent(custom13, "SCANNING=F")*/){		
		complianceCheckConfigured = true; //true; //for testing			
	}else {
		complianceCheckConfigured = false;
	}

	setHeader(map, "PLCN_complianceCheckConfigured", complianceCheckConfigured);	

	if(complianceCheckConfigured == false) {
		setHeader(map, "PLCN_complianceCheckExit", false);
	}

	if(prevQueueId == 'CCBLOCKQ'){
		setHeader(map, "PLCN_queueAudit", "PROCDQ");
		setHeader(map, "PLCN_status", "102");
		setHeader(map, "PLCN_complianceCheckExit", true);
		setHeader(map, "PLCN_sanctionBlockFlag", false);
	}
}

function schedulingCheck(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var schedulingCheckConfigured;
	
	logger.info("In schedulingCheck");

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("schedulingCheck: custom13 = " + custom13);

	//custom13 check to be added
	if(isPatternPresent(custom13, "WAREHOUSE=Y")){
		schedulingCheckConfigured = true;
	}else{
		schedulingCheckConfigured = false;
	}

	setHeader(map, "PLCN_schedulingCheckConfigured", schedulingCheckConfigured);

	if(schedulingCheckConfigured == false) {
		setHeader(map, "PLCN_schedulingCheckExit", false);
	}
}

function accountingEntryCheck(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	
	logger.info("In accountingEntryCheck");

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("accountingEntryCheck: custom13 = " + custom13);

	//custom13 check to be added
	var PLCN_accountingEntryConfigured = false;
	setHeader(map, "PLCN_accountingEntryConfigured", PLCN_accountingEntryConfigured);

	if(PLCN_accountingEntryConfigured == false) {
		setHeader(map, "PLCN_accountingEntryExit", false);
	}
}

function dispositionCheck(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var dispositionCheckConfigured;
	
	logger.info("In dispositionCheck");

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("dispositionCheck: custom13 = " + custom13);
	logger.info("dispositionCheck: dispositionCheckConfigured = " + dispositionCheckConfigured);

	var disFlag = isPatternPresent(custom13, "DISPOSITION=Y");
	logger.info("dispositionCheck: disFlag = " + disFlag);
	logger.info("dispositionCheck: typeof disFlag = " + typeof disFlag);

	if(disFlag){		
		dispositionCheckConfigured = true;
		setHeader(map, "PLCN_queueAudit", "DSPMSGQ1");			
	}else {
		dispositionCheckConfigured = false;
		setHeader(map, "PLCN_queueAudit", "SEPABLKQ");
	}

	setHeader(map, "PLCN_dispositionCheckConfigured", dispositionCheckConfigured);
	logger.info("dispositionCheck: dispositionCheckConfigured = " + dispositionCheckConfigured);	

	if(dispositionCheckConfigured == false) {
		setHeader(map, "PLCN_dispositionCheckExit", false);
	}else{
		setHeader(map, "PLCN_dispositionCheckExit", true);
	}

	logger.info("dispositionCheck: PLCN_dispositionCheckExit = " + getHeader(map, "PLCN_dispositionCheckExit"));
}

function matchingCheck(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var dispositionCheckConfigured;
	
	logger.info("In matchingCheck");

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("matchingCheck: custom13 = " + custom13);

	if(isPatternPresent(custom13, "MATCHING=Y")){
		custom13 = replacePattern(custom13, "MATCHING=Y|", "MATCHING=D|")	
		matchingConfigured = true;
		setHeader(map, "PLCN_queueAudit", "TMPTXVWQ");
		setHeader(map, "PLCN_matchingCheckExit", true);
		setHeader(map, "PLCN_custom13", custom13);
		setHeader(map, "PLCNAPI_custom13", custom13);			
	}else {
		matchingConfigured = false;
		//setHeader(map, "PLCN_queueAudit", "ERRORQ");
	}

	logger.info("matchingCheck: matchingConfigured = " + matchingConfigured);
	setHeader(map, "PLCN_matchingConfigured", matchingConfigured);	

	if(matchingConfigured == false) {
		setHeader(map, "PLCN_matchingCheckExit", false);
		logger.info("matchingCheck: PLCN_matchingCheckExit = " + false);
	}else {
		setHeader(map, "PLCN_matchingCheckExit", true);
		logger.info("matchingCheck: PLCN_matchingCheckExit = " + true);
	}
}

function updateCamelQueueId(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;
	var priorityAmount;
	var priorityDate;
	var transRefNo;
	var currency;
	var sender;
	var receiver;
	var msgFamily;

	logger.info("In updateCamelQueueId");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = exchange.getIn().getBody();
	logger.info("updateCamelQueueId: readMsgdb = " + readMsgdb);
	audit = new HashMap();
	logger.info("updateCamelQueueId: msgType 1 = " + readMsgdb.get("MESSAGECLASSTYPE"));

	var msgType = readMsgdb.get("MESSAGECLASSTYPE");
	logger.info("updateCamelQueueId: msgType = " + msgType);


	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var institutionId = readMsgdb.get("INSTITUTIONID");

	messageNo = readMsgdb.get("MESSAGENO");
	var msgDbId = readMsgdb.get("MSGDB_ID");
	logger.info("updateCamelQueueId: msgDbId from database = " + msgDbId);

	msgFamily = readMsgdb.get("MSG_FAMILY");
	logger.info("updateCamelQueueId: msgFamily = " + msgFamily);

	if(!msgFamily){
		msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	}

	if(!msgType){
		var msgType = getMessageType(exchange);
		msgType = msgType.toLowerCase();		
	}

	var sourceChannelId = readMsgdb.get("CHANNEL_ID_SOURCE");
	logger.info("updateCamelQueueId: sourceChannelId = " + sourceChannelId);
	setHeader(map, "PLCN_sourceChannelId", sourceChannelId);

	msgDirection = memTblGetTableValue(map, "DIRECTION_CHK_MAP", sourceChannelId);
	logger.info("updateCamelQueueId: msgDirection = " + msgDirection);

	if(!msgDirection){
		msgDirection = readMsgdb.get("MESSAGEDIRECTION");
		logger.info("updateCamelQueueId: msgDirection from database = " + msgDirection);
	}

	/*if(mode == "MANUAL" || mode == "UPLOAD") {
		key = mode + "-" + msgType;
	}else {
		key = sourceChannelId + "-" + msgType;
	}*/

	messageQueueid = memTblGetTableValue(map, "SCT_QUEUEID", msgType + "_"  + "SEPA" + "-" + msgDirection);
	logger.info("updateCamelQueueId: messageQueueid = " + messageQueueid);

	setHeader(map, "PLCN_CAMEL_QUEUEID", messageQueueid);
	setHeader(map, "PLCN_msgdbId", msgDbId);

	audit.put("MESSAGENO", messageNo);
	audit.put("QUEUEID", messageQueueid);
	//audit.put("USERNAME","ADMIN1");
	audit.put("APPLICATION","ACEQ_CMP");
	audit.put("MODULENAME","ACEQWRITE");
	audit.put("ACTION","WRITE");
	audit.put("AUDITTEXT","Message number " +  "<" + messageNo + ">" + " read from DB and written into Queue " +  "'" + messageQueueid + "'");
	audit.put("INSTITUTIONID", institutionId);
	setHeader(map, "GENAUDIT", audit);
}

function setRoutingHeader(exchange){
	logger.info("In setRoutingHeader rule.");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	logger.info("setRoutingHeader: Document = " + Document);

	var validationCheckFlag;
	var routingFlag;
	var configurationCheck;
	//var fileFlow;

	var messageBody = convertDocumentToString(Document);
	//logger.trace("setRoutingHeader: messageBody = " + messageBody);
	setHeader(map, "ACEDB_translatedPacs002", messageBody);
	
	var msgbody = getHeader(map ,"ACEDB_originalBody");
	if(!msgbody){
		msgbody = inMsg.getBody(java.lang.String.class);
	}
	//logger.info("setRoutingHeader: msgbody = " + msgbody);
	inMsg.setBody(msgbody);
	setHeader(map, "ACEDB_originalBody", "");


	var paymentType = getHeader(map, "SRC_PaymentType");
	logger.info("setRoutingHeader: paymentType = " + paymentType);

	translationFlag = getHeader(map, "PLCN_translationFlag");
	logger.info("setRoutingHeader: translationFlag = " + translationFlag);
	logger.info("setRoutingHeader: Type of translationFlag = " + typeof translationFlag);

	var msgType = getHeader(map, "PLCN_msgType");
	logger.info("setRoutingHeader: msgType from header = " + msgType);

	if(translationFlag === 'true' && msgType === 'pacs.002.001.10'){	
		if(paymentType === 'SepaPacs.008.001.08'){
			msgType = 'pacs.008.001.08';
		}else if(paymentType === 'SepaPacs.004.001.09'){
			msgType = 'pacs.004.001.09';
		}
	}
	logger.info("setRoutingHeader: msgType = " + msgType);
	setHeader(map, "PLCN_msgType", msgType);

	validationCheckFlag = getHeader(map, "PLCN_validMessage");
	logger.info("setRoutingHeader: validationCheckFlag = " + validationCheckFlag);
	//configurationCheck = memTblGetTableValue(map, "MODE-VALUE", "");
	configurationCheck = "FILE";
	if(isPatternPresent(configurationCheck, "FILE")) { 
		if(validationCheckFlag == "true") {
			routingFlag = "true";
			setHeader(map, "PLCN_validFlag", "true");
			setHeader(map, "PLCN_FileFlow", routingFlag);
				
	    }else {
			routingFlag = "true";
			setHeader(map, "PLCN_validFlag", "false");
			setHeader(map, "PLCN_FileFlow", routingFlag);			
		}
 	}else {
  		if(validationCheckFlag == "true") {
			routingFlag = "false";
			setHeader(map, "PLCN_validFlag", "true");
			setHeader(map, "PLCN_FileFlow", routingFlag);
				
	    }else {
			routingFlag = "false";
			setHeader(map, "PLCN_validFlag", "false");
			setHeader(map, "PLCN_FileFlow", routingFlag);
		}
    }
    var validflag = getHeader(map, "PLCN_validFlag");
    logger.info("setRoutingHeader: validflag = " + validflag);
    logger.info("setRoutingHeader: routingFlag = " + routingFlag);
	
	var translationFlag =  getHeader(map, "PLCN_translationFlag");
	logger.info("setRoutingFlag = " + translationFlag);
	if(translationFlag == 'true'){
		setHeader(map, "PLCN_translatedMessage", "true");
	}
}

function amountCapFunctionalityBtch(exchange) {

 var inMsg = exchange.getIn();
 var map = inMsg.getHeaders();
 var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
 
 var systemLevelFlag;
 var sepaAmtCapLimit;
 var sepaAmtCapPerChannel;
 var channelIdSource;
 var messageClassType;
 var totalAmtOfBatch;
 var queueId;
 var messageDirection;
 var key;
 var  readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
 logger.info("In amountCapFunctionalityBtch");
 
 channelIdSource = getHeader(map, "PLCN_channelIdSource");
 logger.info("amountCapFunctionalityBtch: channelIdSource = " + channelIdSource);

 var key1 = "Amount_CAP_".concat(channelIdSource);
 key = key1.concat("_BTCH");
 key = key.toUpperCase();
 logger.info("amountCapFunctionalityBtch: key = " + key);

 messageClassType = getHeader(map, "PLCN_messageClassType");
  if(!messageClassType){
	messageClassType = readMsgdb.get("MESSAGECLASSTYPE");
  }
 logger.info("amountCapFunctionalityBtch: messageClassType = " + messageClassType);

 totalAmtOfBatch = getHeader(map, "PLCN_priorityAmountNum");
 if(!totalAmtOfBatch) {
 	totalAmtOfBatch = readMsgdb.get("PRIORITYAMOUNTNUM");
 }
 if(totalAmtOfBatch){
 	totalAmtOfBatch = parseInt(totalAmtOfBatch);
 }
 logger.info("amountCapFunctionalityBtch: totalAmtOfBatch = " + totalAmtOfBatch);

 messageDirection = getHeader(map, "PLCN_messageDirection");
 logger.info("amountCapFunctionalityBtch: messageDirection = " + messageDirection);
 
 systemLevelFlag = memTblGetTableValue(map, "USER_CONFIG_MAP", "HIVAL_CAP_LIMIT_CHK");
 logger.info("amountCapFunctionalityBtch: systemLevelFlag = " + systemLevelFlag);

 sepaAmtCapLimit = memTblGetTableValue(map, "AMOUNT_CAP_TBL_MAP", key);
 logger.info("amountCapFunctionalityBtch: sepaAmtCapLimit = " + sepaAmtCapLimit);
 if(sepaAmtCapLimit){
 	sepaAmtCapLimit = parseInt(sepaAmtCapLimit);
 }

 sepaAmtCapPerChannel = memTblGetTableValue(map, "APPLY_AUTH_CAP_MAP", key);
 logger.info("amountCapFunctionalityBtch: sepaAmtCapPerChannel = " + sepaAmtCapPerChannel);
  
  if(systemLevelFlag == "YES"){
	  
	  if(messageClassType == "pacs.008.001.08" && messageDirection == "I"){
		  
		  if(sepaAmtCapPerChannel == "YES"){
			   
				if(totalAmtOfBatch > sepaAmtCapLimit){
					queueId = "TEMPBTHQ";
					setHeader(map, "PLCN_btchQId", queueId);
					//setHeader(map, "PLCN_btchThresholdBreach", "YES");
				}
			}
		}
	}
}

function amountCapFunctionalityTxn(exchange) {

 var inMsg = exchange.getIn();
 var map = inMsg.getHeaders();
 var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
 
 var systemLevelFlag;
 var sepaAmtCapLimit;
 var sepaAmtCapPerChannel;
 var channelIdSource;
 var messageClassType;
 var priorityAmountNum;
 var queueId;
 var messageDirection;
 var key;
 var  readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
 logger.info("In amountCapFunctionalityTxn");
 
 channelIdSource = getHeader(map, "PLCN_channelIdSource");
 logger.info("amountCapFunctionalityTxn: channelIdSource = " + channelIdSource);

 var key1 = "Amount_CAP_".concat(channelIdSource);
 key = key1.concat("_TXN");
 key = key.toUpperCase();
 logger.info("amountCapFunctionalityTxn: key = " + key);

  messageClassType = getHeader(map, "PLCN_messageClassType");
  if(!messageClassType){
	messageClassType = readMsgdb.get("MESSAGECLASSTYPE");
  }
 logger.info("amountCapFunctionalityTxn: messageClassType = " + messageClassType);

 txnAmount = getHeader(map, "PLCN_transactionAmount");
 if(txnAmount){
 	txnAmount = parseInt(txnAmount);
 }
 logger.info("amountCapFunctionalityTxn: txnAmount = " + txnAmount);
 logger.info("amountCapFunctionalityTxn: txnAmount = " +  typeof txnAmount);

 messageDirection = getHeader(map, "PLCN_messageDirection");
 logger.info("amountCapFunctionalityTxn: messageDirection = " + messageDirection);
 
 systemLevelFlag = memTblGetTableValue(map, "USER_CONFIG_MAP", "HIVAL_CAP_LIMIT_CHK");
 logger.info("amountCapFunctionalityTxn: systemLevelFlag = " + systemLevelFlag);

 sepaAmtCapLimit = memTblGetTableValue(map, "AMOUNT_CAP_TBL_MAP", key);
 logger.info("amountCapFunctionalityTxn: sepaAmtCapLimit = " + sepaAmtCapLimit);
 logger.info("amountCapFunctionalityTxn: sepaAmtCapLimit = " + typeof sepaAmtCapLimit);
 if(sepaAmtCapLimit){
 	sepaAmtCapLimit = parseInt(sepaAmtCapLimit);
 }

 sepaAmtCapPerChannel = memTblGetTableValue(map, "APPLY_AUTH_CAP_MAP", key);
 logger.info("amountCapFunctionalityTxn: sepaAmtCapPerChannel = " + sepaAmtCapPerChannel);
  
  if(systemLevelFlag == "YES"){
	  logger.info("amountCapFunctionalityTxn: First condition satisfied...");
	  if(messageClassType == "pacs.008.001.08" && messageDirection == "I"){
		   logger.info("amountCapFunctionalityTxn: second condition satisfied...");
		  if(sepaAmtCapPerChannel == "YES"){
			    logger.info("amountCapFunctionalityTxn: third condition satisfied...");
				if(txnAmount > sepaAmtCapLimit){
					logger.info("amountCapFunctionalityTxn: fourth condition satisfied...");
					//setHeader(map, "PLCN_txnThresholdBreach", "YES");
					logger.info("amountCapFunctionalityTxn: Threshold Breach...");
					queueId = "TEMPTXNQ";
					setHeader(map, "PLCN_txnQId", queueId);			
				}
			}
		}
	}
}

function ddIntlHashCode(message, exchange){
	
	var inMsg = exchange.getIn();
    var map = inMsg.getHeaders();
    var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	var flag;
	var keyId;
	var comments;
	var authCode;
	var intHashCode;
	var servermode;
	var comments1;
	var authFromDb;
	var flag1;
	var acelog;
	logger.info("In ddIntlHashCode");
	
	flag1 = memTblGetTableValue(map, "FLAG-TABLE", "DEBUG_MODE");
	authFromDb = getHeader(map, "PLCN_authcode");
	if(flag1 == "Y"){
		
		acelog = "AUTHCODE_FROM_DB:".concat(authFromDb);
	}
	
	flag = memTblGetTableValue(map, "ACE_SECURITY_MAP", "END2END_REQUIRED");
	servermode = memTblGetTableValue(map, "FLAG-TABLE", "SERVER-MODE");
	
	if(flag == "YES"){

		// //keyId = getInternalKeyId();
		// //intHashCode = generateInternalHashCode(message);
		
		// if(servermode == "INTERFACE"){
		// 	if(intHashCode == -1){
		// 		retVal = setCommentsForTransaction("100", "7355", map);
		// 		comments = fillViolation();
		// 		setHeader(map, "PLCN_commentsForBlob6", comments);
		// 		setHeader(map, "PLCN_comments", comments);
		// 		setHeader(map, "PLCN_queueId", "INERRMSG");
		// 		setHeader(map, "PLCN_status", "66");
		// 		setHeader(map, "PLCN_keyId", "");
		// 		setHeader(map, "PLCN_authcode", "");
		// 		return "7355";
		// 	}else {
		// 		authCode = getHashCode();
		// 		if(flag1 == "Y"){
		// 			acelog = "RECALCULATED_AUTHCODE_DRVE_RULE:".concat(authCode);
		// 		}
		// 		//keyId = getInternalKeyId();
		// 		acelog = "AUTHCODE:".concat(authCode);
		// 		//setHeader(map, "PLCN_keyId", keyId);
		// 		setHeader(map, "PLCN_authcode", authCode);
		// 		memTblGetTableValue(map, "STREAM-TABLE_MAP", "KEY_ID", keyId);
		// 		memTblGetTableValue(map, "STREAM-TABLE_MAP", "AUTHCODE", authCode);
		// 		comments1 = getHeader(map, "PLCN_comments");
				
		// 		if(!comments1){
		// 			setHeader(map, "PLCN_comments", "");
		// 		}
		// 		return "0";
		// 	}
		// }else {
		// 	if(intHashCode == -1){
		// 		errComments = memTblGetTableValue(map, "TransTable" ,"TransErrorFlag", "T");
		// 		errComments = memTblGetTableValue(map, "TransTable" ,"TransErrorCode", "7355");
		// 		retVal = setCommentsForTransaction("100", "7355", map);
		// 		gvComments = fillViolation();
		// 		gvQueueId = "INERRMSG";
		// 		gvStatus = "69";
		// 		return "7355";
		// 	}else {
		// 		gvAuthCode = getHashCode();
		// 		gvKeyId = getInternalKeyId();
		// 		return "0";
		// 	}
		}
	// }else {
	// 	if(servermode == "INTERFACE"){
	// 		setHeader(map, "PLCN_keyId", "");
	// 		setHeader(map, "PLCN_authCode", "");
	// 		comments1 = getHeader(map, "PLCN_comments");
	// 		if(!comments1){
	// 			setHeader(map, "PLCN_comments", "");
	// 		}
	// 		return "0";
	// 	}
	// }
	return "0";
}

function deriveConfiguredAuthPrinciple(msgPath, exchange){
	logger.info("In deriveConfiguredAuthPrinciple.");
	var inMsg = exchange.getIn();
    var map = inMsg.getHeaders();
    var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	var key1;
	var tempPath;
	var threshHoldPath2;
	var threshHold2;
	var threshHold3;
	var threshHoldPath3;
	var authPrinciple;
	var tempAuthPrinciple;
	var authPrincipleLen;
	var amount;
	var msgType;
	var currStage;
	var stagePath;
	var stagePrinciplePath;
	var stagePrinciple;
	var productType;
	var displayFlagF;
	var displayFlagB;
	var displayFlagT;
	var displayFlagLevel;
	var institutionId;
	var instLvlPrinciplePath;
	var instLvlPrinciple;
	var finalPrinciple;
	var i;
	var fileName;
	var fileType;
	var channelIdSource;
	logger.info("In deriveConfiguredAuthPrinciple");
	
	institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("deriveConfiguredAuthPrinciple: institutionId = " + institutionId);
	
	if(!institutionId){
		institutionId = memTblGetTableValue(map, "STREAM_DETAILS", "INSTITUTION_ID");
	}
	
	if(!institutionId){
		institutionId = memTblGetTableValue(map, "STREAM_DETAILS", "INSTITUTIONID");
	}
	
	if(!institutionId){
		institutionId = getHeader(map, "PLCN_institutionId");
	}
	
	var key2 = institutionId.concat(".INSTITUTION_DETAILS.AUTHENTICATION_LEVEL");
	instLvlPrinciplePath = key2.concat(".INSTITUTION_ACCESS_CONTROL");
	logger.info("deriveConfiguredAuthPrinciple: instLvlPrinciplePath = " + instLvlPrinciplePath);

	msgType = getHeader(map, "PLCN_msgType");
	logger.info("deriveConfiguredAuthPrinciple: msgType = " + msgType);

	displayFlagF = getHeader(map, "PLCN_displayFlagFile");	
	logger.info("deriveConfiguredAuthPrinciple: displayFlagF = " + displayFlagF); 

	displayFlagB = getHeader(map, "PLCN_displayFlagbatch");	 
	logger.info("deriveConfiguredAuthPrinciple: displayFlagB = " + displayFlagB); 

	displayFlagT = getHeader(map, "PLCN_displayFlagMessage");
	logger.info("deriveConfiguredAuthPrinciple: displayFlagT = " + displayFlagT); 

	setHeader(map, "PLCN_currentAuthLevelFile", "");
	setHeader(map, "PLCN_currentAuthLevelBatch", "");
	setHeader(map, "PLCN_currentAuthLevelMessage", "");
	
	if(displayFlagF == "Y"){
		displayFlagLevel = "FILE";
	}
	if(displayFlagB == "Y"){
		displayFlagLevel = "BATCH";
	}
	if(displayFlagT == "Y"){
		displayFlagLevel = "TXN";
	}
	
	if(displayFlagLevel == "FILE" && !msgType){
		fileName = "IN.FILEQ-MSG.MDBFL-FILENAME";
		fileType = "IN.FILEQ-MSG.MDBFL-FILETYPE";
	}
	
	if(displayFlagLevel == "BATCH"){
		amount = getHeader(map, "PLCN_btchAmtNum");
	}
	if(displayFlagLevel == "FILE"){
		
		amount = "IN.FILEQ-MSG.PRIORITY-AMOUNT";
		channelIdSource = getHeader(map, "PLCN_channelIdSource");
		if(channelIdSource == "ClieOpCT-IN"){
			productType = "SCT";
		}else {
			if(channelIdSource == "ClieOpDD-IN"){
				productType = "SDD";
			}
		}
	}
	
	if(!productType && displayFlagLevel == "BATCH"){
		
		channelIdSource = getHeader(map, "PLCN_channelIdSource");
		if(channelIdSource == "ClieOpCT-IN"){
			productType = "SCT";
		}else {
			if(channelIdSource == "ClieOpDD-IN"){
				productType = "SDD";
			}
		}
	}
	
	//key1 = memTblGetFirstKeyForTable("UNIQ_STAGES");
	if(key1){
		i = 1;
		while(i==1){
			currStage = memTblGetTableValue(map, "STAGES_TO_SERVICES", key1);
			var key3 = institutionId.concat(".INSTITUTION_DETAILS.AUTHENTICATION_LEVEL.STAGES.");
			stagePath = key3.concat(currStage);
			var key4 = stagePath.concat(".");
			var key5 = key4.concat(productType);
			tempPath = key5.concat(".THRESHOLDS");
			threshHoldPath3 = tempPath.concat(".THRESHOLD_THIRD_SIGNATURE");
			threshHoldPath2 = tempPath.concat(".THRESHOLD_SECOND_SIGNATURE");
			threshHold3 = memTblGetTableValue(map, "INST_PARAM", threshHold3);
			threshHold2 = memTblGetTableValue(map, "INST_PARAM", threshHold2);
			if(threshHold3){
				if(amount > threshHold3){
					finalPrinciple = "6";
				}else {
					if(threshHold2){
						if(amount > threshHold2){
							finalPrinciple = "4";
						}else {
							stagePrinciplePath = stagePath.concat(".STAGE_ACCESS_CONTROL");
							stagePrinciple = memTblGetTableValue(map, "INST_PARAM", stagePrinciplePath);
							if(stagePrinciple){
								finalPrinciple = stagePrinciple;
							}else {
								instLvlPrinciple = memTblGetTableValue(map, "INST_PARAM", instLvlPrinciplePath);
								finalPrinciple = instLvlPrinciple;
							}
							if(finalPrinciple == "TWO"){
								finalPrinciple = "2";
							}
							if(finalPrinciple == "FOUR"){
								finalPrinciple = "4";
							}
							if(finalPrinciple == "SIX"){
								finalPrinciple = "6";
							}
						}
					}else {
						stagePrinciplePath = stagePath.concat(".STAGE_ACCESS_CONTROL");
						stagePrinciple = memTblGetTableValue(map, "INST_PARAM", stagePrinciplePath);
						if(stagePrinciple){
							finalPrinciple = stagePrinciple;
						}else {
							instLvlPrinciple = memTblGetTableValue(map, "INST_PARAM", instLvlPrinciplePath);
							finalPrinciple = instLvlPrinciple;
						}
						if(finalPrinciple == "TWO"){
							finalPrinciple = "2";
						}
						if(finalPrinciple == "FOUR"){
							finalPrinciple = "4";
						}
						if(finalPrinciple == "SIX"){
							finalPrinciple = "6";
						}
					}
				}
			}
			else {
				if(threshHold2){
					if(amount > threshHold2){
						finalPrinciple = "4";
				}else {
					stagePrinciplePath = stagePath.concat(".STAGE_ACCESS_CONTROL");
					stagePrinciple = memTblGetTableValue(map, "INST_PARAM", stagePrinciplePath);
					if(stagePrinciple){
						finalPrinciple = stagePrinciple;
					}else {
						instLvlPrinciple = memTblGetTableValue(map, "INST_PARAM", instLvlPrinciplePath);
						finalPrinciple = instLvlPrinciple;
					}
					if(finalPrinciple == "TWO"){
						finalPrinciple = "2";
					}
					if(finalPrinciple == "FOUR"){
						finalPrinciple = "4";
					}
					if(finalPrinciple == "SIX"){
						finalPrinciple = "6";
					}
				}
				}else {
					stagePrinciplePath = stagePath.concat(".STAGE_ACCESS_CONTROL");
					stagePrinciple = memTblGetTableValue(map, "INST_PARAM", stagePrinciplePath);
					if(stagePrinciple){
						finalPrinciple = stagePrinciple;
					}else {
						instLvlPrinciple = memTblGetTableValue(map, "INST_PARAM", instLvlPrinciplePath);
						finalPrinciple = instLvlPrinciple;
					}
					if(finalPrinciple == "TWO"){
						finalPrinciple = "2";
					}
					if(finalPrinciple == "FOUR"){
						finalPrinciple = "4";
					}
					if(finalPrinciple == "SIX"){
						finalPrinciple = "6";
					}
				}
			}
			var key4 = key1.concat("=");
			tempAuthPrinciple = key4.concat(finalPrinciple);
			var key5 = authPrinciple.concat("|");
			AuthPrinciple = key5.concat(tempAuthPrinciple);
			finalPrinciple = "";
			key1 = memTblGetNextKeyForTable();
			if(kay1){
				i = 1;
			}else {
				i = 2;
			}
		}
	}
	else {
		return;
	}
	
	authPrincipleLen = authPrinciple.length();
	authPrinciple = authPrinciple.substr(2, (authPrincipleLen - 1));
	if(displayFlagLevel == "TXN"){
		setHeader(map, "PLCN_currentAuthLevelMessage", authPrinciple);
		//setHeader(map, "PLCN_currentAuthLevelMessage", "AUTH=2|DUPL=4|PENT=4|APRV=4|REPR=4|PAUS=4|WITH=2|WRHS=4|ERR=2|HASH=4|PEND=4|FINL=4|CHNR=4|MTCH=2");
		//setHeader(map, "PLCN_currentAuthLevelMsg", "AUTH=2|DUPL=4|PENT=4|APRV=4|REPR=4|PAUS=4|WITH=2|WRHS=4|ERR=2|HASH=4|PEND=4|FINL=4|CHNR=4|MTCH=2");

	}
	
	if(displayFlagLevel == "BATCH"){
		setHeader(map, "PLCN_currentAuthLevelBatch", authPrinciple);
		//setHeader(map, "PLCN_currentAuthLevelBatch", "AUTH=2|DUPL=4|PENT=4|APRV=4|REPR=4|PAUS=4|WITH=2|WRHS=4|ERR=2|HASH=4|PEND=4|FINL=4|CHNR=4|MTCH=2");
		//setHeader(map, "PLCN_currentAuthLevelBtch", "AUTH=2|DUPL=4|PENT=4|APRV=4|REPR=4|PAUS=4|WITH=2|WRHS=4|ERR=2|HASH=4|PEND=4|FINL=4|CHNR=4|MTCH=2");

	}
	
	if(displayFlagLevel == "FILE"){
		setHeader(map, "PLCN_currentAuthLevelFile", authPrinciple);
		//setHeader(map, "PLCN_currentAuthLevelFile", "AUTH=2|DUPL=4|PENT=4|APRV=4|REPR=4|PAUS=4|WITH=2|WRHS=4|ERR=2|HASH=4|PEND=4|FINL=4|CHNR=4|MTCH=2");		setHeader(map, "PLCN_currentAuthLevelMessage", "AUTH=2|DUPL=4|PENT=4|PAUS=4|APRV=4|REPR=4|WITH=4|WRHS=4|ERR=4|HASH=4|PEND=4|FINL=4|CHNR=4");
		s//etHeader(map, "PLCN_currentAuthLevelFle", "AUTH=2|DUPL=4|PENT=4|APRV=4|REPR=4|PAUS=4|WITH=2|WRHS=4|ERR=2|HASH=4|PEND=4|FINL=4|CHNR=4|MTCH=2");

	}
	logger.info("deriveConfiguredAuthPrinciple rule done.");
}  

function displayStagesProd(level, exchange){
	
	var inMsg = exchange.getIn();
    var map = inMsg.getHeaders();
    var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var pattern;
	var institutionId;
	var channelSourceId;
	var flag;
	var msgScheme;
	logger.info("In displayStagesProd");
	
	pattern = getHeader(map, "PLCN_serviceConfigured");
	channelSourceId = getHeader(map, "PLCN_channelSourceId");
	institutionId = getHeader(map, "PLCN_institutionId");
	flag = memTblGetTableValue(map, "FLAG-TABLE", "PROCESSING_LEVEL");
	msgScheme = getHeader(map, "PLCN_msgScheme");
	
	if(msgScheme == "INST"){
		
		flag = "TRANSACTION";
	}
	
	setHeader(map, "PLCN_displayFlagBatch", "N");
	setHeader(map, "PLCN_displayFlagMessage", "N");
	setHeader(map, "PLCN_displayFlagFile", "N");
	
	if(level == "BATCH"){
		if(flag == "BATCH"){
			
			setHeader(map, "PLCN_displayFlagBatch", "Y");
		}
	}
	
	if(level == "TRANSACTION" || flag == "TRANSACTION"){
		
		setHeader(map, "PLCN_displayFlagMessage", "Y");
	}
	
	if(level == "FILE" || flag == "FILE"){
		
		setHeader(map, "PLCN_displayFlagFile", "Y");
	}
}

function driveServiceConfigured(exchange) {
	logger.info("In driveServiceConfigured rule.");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var pattern;
	var flag;
	var currentDate;
	var releaseDate;
	var onBoardingTurnedOn;
	var queueId;
	var processingStage;
	var repairQueueSet;
	var clpMessageType;
	var convRepairReqd;
	var errComments;
	var btchIbanRprFlag;
	var btchBicRprFlag;
	var batchComments;
	var comments;
	var msgType;
	var scanServiceFlag;
	var btchIbanConsistencyReprFlag;
	var btchBicConsistencyReprFlag;

	msgType = getHeader(map, "PLCN_msgType");
	msgType = msgType.toUpperCase();

	setHeader(map, "COMMENTS_1", "");	
	flag = "N";
	pattern = getHeader(map, "PLCN_serviceConfigured");

	onBoardingTurnedOn = memTblGetTableValue(map, "FLAG-TABLE", "ONBOARDING-TURNED-ON");
	releaseDate = getHeader(map, "PLCN_earlyDate");
	currentDate = getDate();
	convRepairReqd = memTblGetTableValue(map, "FLAG-TABLE", "CONV-REPAIR-REQD");
	batchComments = memTblGetTableValue(map, "BATCH_COMMENTS", "BATCH_COMMENTS");
	setHeader(map, "PLCN_comments", batchComments);

	if(!pattern) {
		if(onBoardingTurnedOn == "N") {
			pattern = memTblGetTableValue(map, "TA-SERVICES-CONF", "SERVICE_CONFIGURED");
			setHeader(map, "PLCN_serviceConfigured", pattern);
		}
	}

	if(isPatternPresent(msgType.toUpperCase(), "PACS.004")) {
		pattern = "";
		setHeader(map, "PLCN_serviceConfigured", "");
	}

	queueId = "TMPBTCHQ";
	clpMessageType = getHeader(map, "PLCN_BhTransactionGroup");
	scanServiceFlag = getHeader(map, "PLCN_scanServiceFlag");

	if(scanServiceFlag == "Y") {
		pattern = replacePattern(pattern, "07_SCANSERVICE=Y", "07_SCANSERVICE=D");
	}
	setHeader(map, "PLCN_serviceConfigured", pattern);
	if(isPatternPresent(pattern, "02_REPAIRSERVICE=Y")) {
		repairQueueSet = "N";
		if((clpMessageType == "10" || clpMessageType == "00") && convRepairReqd == "N") {
			repairQueueSet = "N";
		}
		if((clpMessageType == "10" || clpMessageType == "00") && convRepairReqd == "Y") {
			if(memTblGetTableValue(map, "FLAG-TABLE", "SEPA-REPAIR-REQD") == "Y") {
				if(releaseDate < currentDate) {
					if(batchComments){
						comments = batchComments.concat(":A00:00-7883");
					}else {
						comments = "P00-1:A00:00-7883";
					}
					setHeader(map, "PLCN_comments", comments);
					queueId = "TMPBTRPQ";
					setHeader(map, "PLCN_queueId", queueId);
					repairQueueSet = "Y";
				}
				if(repairQueueSet != "Y") {
					errComments = memTblGetTableValue(map, "BATCH_COMMENTS", "BATCH_COMMENTS");
					btchIbanRprFlag = memTblGetTableValue(map, "FLAG-TABLE", "PIB_LVL_IBAN_RPR_FLAG");
					btchBicRprFlag = memTblGetTableValue(map, "FLAG-TABLE", "PIB_LVL_BIC_RPR_FLAG");
					btchIbanConsistencyReprFlag = memTblGetTableValue(map, "FLAG-TABLE", "BTCH_IBAN_CONSISTENCY_REPR_FLAG");
					btchBicConsistencyReprFlag = memTblGetTableValue(map, "FLAG-TABLE", "BTCH_BIC_CONSISTENCY_REPR_FLAG");

					if(btchIbanRprFlag == "YES" && btchBicRprFlag == "NO" && isPatternPresent(errComments, "5714")) {
						queueId = "TMPBTRPQ";
						setHeader(map, "PLCN_queueId", queueId);
						repairQueueSet = "Y";
					}
					if((btchIbanRprFlag == "NO" && btchBicRprFlag == "YES") || (isPatternPresent(errComments, "5774") || isPatternPresent(errComments, "5771")))
					queueId = "TMPBTRPQ";
					setHeader(map, "PLCN_queueId", queueId);
					repairQueueSet = "Y";	
				}
				if((btchBicConsistencyReprFlag == "YES" && btchIbanConsistencyReprFlag == "YES") || (isPatternPresent(errComments, "8023") || isPatternPresent(errComments, "8053"))) {
					queueId = "TMPBTRPQ";
					setHeader(map, "PLCN_queueId", queueId);
					repairQueueSet = "Y";
				}
			}
		}
		flag = "Y";
	}
	if(repairQueueSet == "N") {
		queueId = "TMPBTVWQ";
		setHeader(map, "PLCN_batchQueueId", queueId);
	}

	if((clpMessageType == "10" || clpMessageType == "00") || (clpMessageType != "10") && (clpMessageType != "00")) {
		if(isPatternPresent(pattern, "02_REPAIRSERVICE=N") || repairQueueSet == "N") {
			setHeader(map, "PLCN_batchQueueId", "TMPBTVWQ");
			flag = "Y";
		}
	}

	if(isPatternPresent(pattern, "03_WITHDRAWSERVICE=Y") && flag == "N") {
		queueId = "MODBTCHQ";
		setHeader(map, "PLCN_queueId", queueId);
		flag = "Y";	
	}

	if(isPatternPresent(pattern, "04_AUTHORIZATIONSERVICE=Y") && flag == "N") {
		queueId = "AUTHBTHQ";
		setHeader(map, "PLCN_queueId", queueId);
		flag = "Y";
	}

	if(flag == "Y") {
		if(releaseDate > currentDate){
			queueId = "ELRLBTHQ";
			setHeader(map, "PLCN_queueId", queueId);
			flag = "Y";
		}
	}

	if(isPatternPresent(pattern, "05_WAREHOUSE=Y") && (flag == "N")) {
		queueId = "TMPBTCHQ";
		setHeader(map, "PLCN_queueId", queueId);
		flag = "Y";

	}
	processingStage = memTblGetTableValue(map, "QUEUE_MAP", queueId);
	setHeader(map, "PLCN_processingStage", processingStage);
	logger.info("driveServiceConfigured rule done.");
}

function deriveStatementConfig(level, exchange) {
	logger.info("In driveStatmentConfig rule.");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var localCurrencyCode;
	var matchStatements;
	var serviceSubscription;
	var calculateBalanceFromStatement;
	var institutionId;
	var balance;
	var msgType;
	var fileType;
	var cd;
	var reportingService;
	var channelSourceId;
	var msgStmtDebitCreditMark;
	var txnProcessid;

	institutionId = getHeader(map, "PLCN_institutionId");
	matchStatements = institutionId.concat(".REPORTING.MATCH_STATEMENTS");
	matchStatements = memTblGetTableValue(map, "INST_PARAM", matchStatements);
	serviceSubscription = institutionId.concat(".BALANCE_MANAGEMENT.SERVICE_SUBSCRIPTION");
	serviceSubscription = memTblGetTableValue(map, "INST_PARAM", serviceSubscription);
	calculateBalanceFromStatement = institutionId.concat(".BALANCE_MANAGEMENT.CALCULATE_BALANCE_FROM_STATEMENT");
	calculateBalanceFromStatement = memTblGetTableValue(map, "INST_PARAM", calculateBalanceFromStatement);
	localCurrencyCode = institutionId.concat("NSTITUTION_DETAILS.LOCAL_CURRENCY_CODE");
	localCurrencyCode = memTblGetTableValue(map, "INST_PARAM", localCurrencyCode);
	msgType = getHeader(map, "PLCN_msgType");
	fileType = getHeader(map, "PLCN_fileType");
	reportingService = getHeader(map, "PLCN_reportingService");
	channelSourceId = getHeader(map, "PLCN_channelIdSource");
	setHeader(map, "PLCN_calculateBalanceFromStatement", "");
	setHeader(map, "PLCN_btchProcessId", "NONE");
	setHeader(map, "PLCN_stmtOpenBalance", "");
	txnProcessid = getHeader(map, "PLCN_txnProcessId");

	if(!txnProcessid) {
		setHeader(map, "PLCN_txnProcessId", "NONE");
	}		
	if(level == "BATCH") {
		if(serviceSubscription == "YES") {
			if(calculateBalanceFromStatement == "YES") {
				setHeader(map, "PLCN_calculateBalanceFromStatement", "Y");
			} else {
				setHeader(map, "PLCN_calculateBalanceFromStatement", "N");
			}
		} else {
			setHeader(map, "PLCN_calculateBalanceFromStatement", "X");
		}
	}

	if(isPatternPresent(fileType, "940") && (calculateBalanceFromStatement == "YES")) {
		balance = getHeader(map, "2_34_AMOUNT_60FLD");
		setHeader(map, "PLCN_stmtOpenBalance",balance);
	}
	if(calculateBalanceFromStatement == "YES" && level == "BATCH") {
		setHeader(map, "PLCN_btchProcessId", "TO-MATCH");
	}
	if(level == "FILE") {
		setHeader(map, "PLCN_fileProcessId", "TO-MATCH");
	}
	if(level == "TRANSACTION" && matchStatements == "YES") {
		setHeader(map, "PLCN_txnProcessId", "TO-MATCH");
	}
	msgStmtDebitCreditMark =  getHeader(map, "PLCN_msgStmtDebitCreditMark");
	if(msgStmtDebitCreditMark == "RC") {
		setHeader(map, "PLCN_msgStmtDebitCreditMark", "D");
	} else {
		if(msgStmtDebitCreditMark == "RD") {
			setHeader(map, "PLCN_msgStmtDebitCreditMark", "C");
		}
	}
	logger.info("driveStatmentConfig rule done.");
}

function routeBatchOrTxnProcessing(cancelQueueId, authQueueId, chrQueueId, exchange) {
	logger.info("In routeBatchOrTxnProcessing rule.");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var msgDirection;
	var productCode;
	var path;
	var withdrawalPath;
	var withdrawalCode;
	var chkRelPath;
	var chkRelCode;
	var authPath;
	var authCode;
	var comments;
	var institutionId;
	var queueId;
	var productNotComments;
	var inputQueueId;
	var msgType;
	var outputMode;
	var amount;
	var thresholdAmount;
	var outputModeMx;
	var mxFileUnload;
	var mtFileUnload;
	var prevQueueId;
	var outputType;
	var obMsgFamily;
	var outputModeMt;
	var mtMechanism;
	var mxMechanism;
	var pattern;
	var txnComments;
	var tmp1;
	var gvCommentsForBlob6;

	pattern = getHeader(map, "PLCN_param5");
	msgType = getHeader(map, "PLCN_msgType");
	msgType = msgType.toUpperCase();
	txnComments = memTblGetTableValue(map, "TXN_COMMENTS", "TXN_COMMENTS");
	comments = getHeader(map, "PLCN_comments");
	queueId = getHeader(map, "PLCN_txnQueueId");
	tmp1 = gvCommentsForBlob6;

	if(!txnComments){
		txnComments = gvCommentsForBlob6;
		setHeader(map, "PLCN_txnComments", txnComments);
	}

	if(isPatternPresent(pattern, "01CANCPY")) {
		setHeader(map, "PLCN_queueId", cancelQueueId);
		setHeader(map, "PLCN_status", "66");
	} else {
		if(isPatternPresent(txnComments, "-8") ||
		   isPatternPresent(txnComments, "-5") ||
		   isPatternPresent(txnComments, "-3") ||
		   isPatternPresent(txnComments, "-4") ||
		   isPatternPresent(txnComments, "-15") ||
		   isPatternPresent(txnComments, "-1614") ||
		   isPatternPresent(txnComments, "2082")) {
			setHeader(map, "PLCN_queueId", "TMPCXLWQ");
			setHeader(map, "PLCN_status", "102");
			setHeader(map, "PLCN_sepaErrorFlag", "T");
		} else {
			if(isPatternPresent(comments, "6011") ||
			   isPatternPresent(comments, "6012") ||
			   isPatternPresent(comments, "6013") ||
			   isPatternPresent(txnComments, "6011") ||
			   isPatternPresent(txnComments, "6012") ||
			   isPatternPresent(txnComments, "6013")) {
				setHeader(map, "PLCN_queueId", "MSGHOLDQ");
				setHeader(map, "PLCN_status","66");
				if(comments) {
					setHeader(map, "PLCN_txnComments", comments);
				}
			} else {
				setHeader(map, "PLCN_queueId", authQueueId);
				if(isPatternPresent(txnComments, "6700") &&
					isPatternPresent(msgType, "PACS.008")){
					setHeader(map, "PLCN_queueId", "SEPABLKQ");
				}
				setHeader(map, "PLCN_status", "66");
			}
		}
	}
}

function routeSetChannelBtch(exchange) {
	logger.info("In routeSetChannelBtch");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var queueId;
	var auditText1;
	var auditString1;
	var retVal1;
	var aceMessageNo;
	var timeStamp;
	var applicationId;
	var seqNoId;
	var flag;
	var keyId;
	var institutionId;
	var batchMsgNo;
	var parallelChannelMode;
	var seqNo;
	var inputChannel;
	var outputChannel;
	var msgType;
	var batchCounter;
	var checker1;
	var batchComments;
	var totalAmtOfBatch;
	var mode;
	var msgDirection;
	var newComments;
	var processingStage;
	var scanServiceFlag;
	var flagValue;
	
	msgType = getHeader(map, "PLCN_msgType");
	institutionId = getHeader(map, "PLCN_institutionId");
	msgType = msgType.toUpperCase();
	mode = getHeader(map, "PLCN_QM");
	msgDirection = getHeader(map, "PLCN_msgDirection");
	scanServiceFlag = getHeader(map, "PLCN_scanServiceFlag");
	newComments = getHeader(map, "PLCN_comments");
	
	if(newComments = "7863"){
		
		var newComments1 = newComments.replace("7863", "9499");
		setHeader(map, "PLCN_comments", newComments1);
	}
	
	totalAmtOfBatch = getHeader(map, "PLCN_totalAmountOfbatch");
	//exchangeRateCalc(totalAmtOfBatch, exchange);
	if(isPatternPresent(msgType, "PACS.002") || isPatternPresent(msgType, "PACS.028") || isPatternPresent(msgType, "PACS.004") || isPatternPresent(msgType, "CAMT.029") || isPatternPresent(msgType, "CAMT.056")){
		totalAmtOfBatch = getHeader(map, "PLCN_priorityAmountNum");
	}
	setBankingChannelTA(exchange);
	applicationId = "INTFCORP";
	batchCounter = memTblGetTableValue(map, "STREAM_DETAILS", "BATCH_FORCE_STOP_COUNTER");
	batchComments = memTblGetTableValue(map, "STREAM_DETAILS", "BATCH_COMMENTS");
	
	if(!batchCounter){
		batchCounter = 0;
	}
	checker1 = memTblGetTableValue(map, "USER_CONFIG_MAP", "MAX_ERR_IN_ERR_RPT");
	
	if(batchComments == "8937" || batchComments == "8957" || batchComments == "8941" || batchComments == "8961" || batchComments == "7631"){
		
		if(msgType != "CAMT.053" || flagValue == "ALL_OR_NONE"){
			setHeader(map, "PLCN_forceStopCounter", checker1);
		}
		else{
			setHeader(map, "PLCN_forceStopCounter", batchCounter);	
		}
	}
	else{
		setHeader(map, "PLCN_forceStopCounter", batchCounter);
	}
	
	routeBatchOrTxnProcessing("MODBTCHQ", "BTPROCDQ", "BTPROCDQ", exchange);
	
	if(isPatternPresent(msgType, "PACS.004") || isPatternPresent(msgType, "PACS.008")){
		var txnComments = memTblGetTableValue(map, "STREAM_DETAILS", "TXN_COMMENTS");
		queueId = "TMPBTVWQ";
		setHeader(map, "PLCN_batchQueueId", queueId);
		var gvCommentsForBlob6;
		if(!txnComments){
			txnComments = gvCommentsForBlob6;
		}

		if(txnComments == "-8" || txnComments == "-3" || txnComments == "-4" || txnComments == "-15" || txnComments == "1614"){
			setHeader(map, "PLCN_batchQueueId", "BTPROCDQ");	
			setHeader(map, "PLCN_batchStatus", "102");	
			setHeader(map, "PLCN_sepaErrorFlag", "T");	
		}
	}
	
	deriveServiceConfigured(exchange);
	amountCapFunctionalityBtch(exchange);
	queueId = getHeader(map, "PLCN_batchQueueId");
	mode = getHeader(map, "PLCN_msgModeIn");
	var wsError = getHeader(map, "PLCN_wsError");
	setHeader(map, "PLCN_batchStatus", "66");	
	
	if(msgType == "PACS.002"){
		
		queueId = "BTPROCDQ";
		setHeader(map, "PLCN_batchQueueId", queueId);	
		setHeader(map, "PLCN_batchStatus", "66");	
	}
	if(msgType == "CAMT.029"){
		
		queueId = "TMPBTVWQ";
		setHeader(map, "PLCN_batchQueueId", queueId);	
	}
	
	if(msgType == "PACS.004" || msgType == "PACS.008" || msgType == "PACS.003" && queueId == "TEMPBTHQ"){
		queueId = "TMPBTVWQ";
		setHeader(map, "PLCN_batchQueueId", queueId);	
	}
	
	inputChannel = memTblGetTableValue(map, "GENERAL", "INPUT_CHANNEL");
	var key1 = getHeader(map, "PLCN_fileComments");
	if(inputChannel == "SEPAOBFQ-FCT-IN" || inputChannel == "SEPAIBFQ-SCT-IN" || inputChannel == "SEPAIBFQ-STS-RPT-B2B-IN" && key1 == "-8" || key1 == "-5" ||key1 == "-3" ||key1 == "-15" ||key1 == "-1614"){
		
		setHeader(map, "PLCN_batchQueueId", "BTPROCDQ");	
		setHeader(map, "PLCN_batchStatus", "102");	
	}else {
		setHeader(map, "PLCN_batchStatus", "66");	
	}
	
	if(!queueId){
		if(msgType == "CAMT.053"){
			queueId = "CMTMPBQ";
		}
	}
	if(!queueId){
		queueId = "BTPROCDQ";
	}
	flag = memTblGetTableValue(map, "ACE_SECURITY_MAP", "END2END_REQUIRED");
	// if(flag == "YES"){
	// 	keyID = getInternalKeyId();
	// }else {
	// 	keyID = "";
	// }
	
	setHeader(map, "PLCN_aceMessNo", "");
	seqNoId = getHeader(map, "PLCN_seqNoId");
	aceMessageNo = getHeader(map, "PLCN_aceMessageNo");
	timeStamp = getHeader(map, "PLCN_timeStamp");
	batchMsgNo = getHeader(map, "PLCN_batchMsgNo");
	
	var key2 = "Batch inserted for Message No <".concat(aceMessageNo);
	var key3 = key2.concat("> and wrote to Queue '");
	var key4 = key3.concat(queueId);
	auditText1 = key4.concat("'");
	
	var key5 = "Batch inserted for File No <".concat(aceMessageNo);
	var key6 = key5.concat("> and wrote to Queue '");
	var key7 = key6.concat(queueId);
	var auditText2 = key7.concat("'");
	
	if(mode == "WS"){
		auditText1;
	}else {
		auditText2;
	}
	if(!seqNoId){
		setHeader(map, "PLCN_seqNoId", "");	
	}
	
	var key8 = batchMsgNo.concat(timeStamp);
	var key9 = key8.concat(seqNoId);
	var key10 = key9.concat(queueId);
	var key11 = key10.concat(applicationId);
	var key12 = key11.concat("DEBULKDEBULK");
	var key13 = key12.concat(auditText1);
	var key14 = key13.concat(institutionId);
	auditString1 = key10.concat(keyId);
	retVal1 = (ddIntlHashCode, auditString1);
	
	setHeader(map, "PLCN_aceMessageNo", aceMessageNo);	
	setHeader(map, "PLCN_applicationId", applicationId);	
	setHeader(map, "PLCN_auditString1", auditString1);	
	//setHeader(map, "PLCN_auditAuthCode1", gvAudioAuthCode);	
	setHeader(map, "PLCN_auditText1", auditText1);	
	setHeader(map, "PLCN_keyId", keyId);	
	setHeader(map, "PLCN_timeStamp", timeStamp);	
	setHeader(map, "PLCN_btchQueueId", queueId);
	
	parallelChannelMode = memTblGetTableValue(map, "FLAG-TABLE", "IN-MEMORY-PARALLEL-CHANNEL");
	inputChannel = memTblGetTableValue(map, "GENERAL", "INPUT_CHANNEL");
	
	var invoicepayService = institutionId.concat(".INVOICEPAY.SERVICE_SUBSCRIBED");
	invoicepayService = memTblGetTableValue(map, "INST_PARAM", invoicepayService);
	//invoicepayStreamVar(exchange);
	
	if(isPatternPresent (msgType, "PACS.002")){
		var status = getHeader(map, "PLCN_batchStatus");
		setHeader(map, "PLCN_statusQual", status);
		var reasonCd = getHeader(map, "PLCN_batchReasonCd");
		setHeader(map, "PLCN_reasonCd", reasonCd);
		
		if(inputChannel == "INMEMIN_SEPAIBFQ-STS-RPT-B2B-IN" || inputChannel == "SEPAIBFQ-STS-RPT-B2B-IN"){
			if(parallelChannelMode == "YES"){
				setHeader(map, "PLCN_outputChannel", "DB-BATCH-STS-RPT-B2B-OUT");
			}else {
				setHeader(map, "PLCN_outputChannel", "DB-BATCH-STS-RPT-B2B-OUT");
			}
		}else {
			if(inputChannel == "INMEMIN_SEPAIBFQ-STS-RPT-IN" || inputChannel == "SEPAIBFQ-STS-RPT-IN"){
				setHeader(map, "PLCN_btchStatus", "69");
			}
		}
	}
	
	if(msgType == "CAMT.055" || msgType == "CAMT.056" || msgType == "PACS.028"){
		
		setHeader(map, "PLCN_batchStatus", "69");
		setHeader(map, "PLCN_batchQueueId", "TMPBTVWQ");
		setHeader(map, "PLCN_outputChannel", "DB-BATCH-CXLN-OUT");
		
	}
	mode = getHeader(map, "PLCN_qm");
	
	var msgDir = getHeader(map, "PLCN_messageDirection");
	if(mode != "WS"){
		if(msgType == "PACS.008" && inputChannel == "SEPAIBFQ-FCT-IN"){
			if(parallelChannelMode == "YES"){
				if(inputChannel == "INMEMIN_SEPAIBFQ-FCT-IN-"){
					seqNo = removePattern(inputChannel, "INMEMIN_SEPAIBFQ-FCT-IN-");
				}else {
					seqNo = removePattern(inputChannel, "SEPAIBFQ-FCT-IN-");
				}
				var key15 = "DB-BATCH-FCT-OUT-".concat(seqNo);
				setHeader(map, "PLCN_outputChannel", key15);
			}
			else{
				setHeader(map, "PLCN_outputChannel", "DB-BATCH-FCT-OUT");
			}
		}
		if(msgType == "PACS.008" && inputChannel == "SEPAOBFQ-FCT-IN" && msgDir == "I"){
			setHeader(map, "PLCN_outputChannel", "DB-OBBATCH-FCT-OUT");
		}
		if(msgType == "PACS.008" && inputChannel == "SEPAIBFQ-SCT-IN"){
			if(parallelChannelMode == "YES"){
				if(inputChannel == "INMEMIN_SEPAIBFQ-SCT-IN-"){
					seqNo = removePattern(inputChannel, "INMEMIN_SEPAIBFQ-FCT-IN-");
				}else {
					seqNo = removePattern(inputChannel, "SEPAIBFQ-SCT-IN-");
				}
				var key16 = "DB-BATCH-SCT-B2B-OUT-".concat(seqNo);
				setHeader(map, "PLCN_outputChannel", key16);
			}
			else {
				setHeader(map, "PLCN_outputChannel", "DB-BATCH-SCT-B2B-OUT");
			}	
		}
	}
	else {
		setHeader(map, "PLCN_outputChannel", "DB-WS-BATCH-OUT");
	}
	if(isPatternPresent(msgType, "PACS.003") || isPatternPresent(msgType, "PACS.007")){
		if(parallelChannelMode == "YES"){
			if(isPatternPresent(inputChannel, "INMEMIN_SEPAIBFQ-B2B-SDD-IN-")){
				seqNo = removePattern(inputChannel, "INMEMIN_SEPAIBFQ-B2B-SDD-IN-");
			}else {
				seqNo = removePattern(inputChannel, "SEPAIBFQ-B2B-SDD-IN-")
			}
			 outChanne = "DB-FILE-FDD-OUT-".concat(seqNo);
			 setHeader(map, "PLCN_outputChannel", outChannel);
		}
		setHeader(map, "PLCN_outputChannel", "DB-BATCH-B2B-SDD-OUT");
	}
	//invoicepayStreamVar(exchange);
	
	if(msgType == "CAMT.029"){
		
		setHeader(map, "PLCN_batchStatus", "69");
		setHeader(map, "PLCN_batchQueueId", "TMPBTVWQ");
		setHeader(map, "PLCN_outputChannel", "DB-BATCH-CAN-OUT");
	}
	
	if(msgType == "PACS.004"){
		
		var status = getHeader(map, "PLCN_batchStatus");
		setHeader(map, "PLCN_statusQual", status);
		var reasonCd = getHeader(map, "PLCN_btchReasonCd");
		setHeader(map, "PLCN_reasonCode", reasonCd);
		if(parallelChannelMode == "YES"){
			seqNo = removePattern(inputChannel, "INMEMIN_SEPAIBFQ-RTR-IN-");
			var key17 = "DB-BATCH-RTR-OUT-".concat(seqNo);
				setHeader(map, "PLCN_outputChannel", key17);
		}
		else {
			setHeader(map, "PLCN_outputChannel", "DB-BATCH-RTR-OUT");
		}
	}
	var msgPath;
	setHeader(map, "PLCN_displayFlagBatch", "N");
	setHeader(map, "PLCN_displayFlagMessage", "N");
	
	displayStagesProd("BATCH", exchange);
	setHeader(map, "PLCN_currentAuthLevelfile", "");
	setHeader(map, "PLCN_currentAuthLevelBatch", "");
	setHeader(map, "PLCN_currentAuthLevelmessage", "");
	deriveConfiguredAuthPrinciple(msgPath,exchange);
	
	setHeader(map, "PLCN_calculateBalanceFromStatement", "");
	setHeader(map, "PLCN_btchProcessId", "");
	setHeader(map, "PLCN_stmtOpenBalance", "");
	deriveStatementConfig("BATCH",exchange);
	
	processingStage = memTblGetTableValue(map, "QUEUE_MAP", queueId);
	setHeader(map, "PLCN_processingStage", processingStage);
	
	if(isPatternPresent(msgType, "CAMT.029")) {
		queueId = "TMPBTVWQ";
		setHeader(map, "PLCN_batchQueueId", queueId);
	}
	if(isPatternPresent(msgType, "CAMT.029") || isPatternPresent(msgType, "CAMT.056")) {
		setHeader(map, "PLCN_batchStatus", "66");
		setHeader(map, "PLCN_batchQueueId", "TMPBTVWQ");
	}
	if(isPatternPresent(msgType, "CAMT.056")) {
		setHeader(map, "PLCN_batchStatus", "66");
		setHeader(map, "PLCN_batchQueueId", "TMPBTVWQ");
		setHeader(map, "PLCN_outputChannel", "DB-BATCH-CXLN-OUT");
	}
	if(isPatternPresent(msgType, "CAMT.029")) {
		setHeader(map, "PLCN_batchStatus", "66");
		setHeader(map, "PLCN_batchQueueId", "TMPBTVWQ");
		setHeader(map, "PLCN_outputChannel", "DB-BATCH-CAN-OUT");
	}


	if(wsError == "Y"){
		
		return "F";
	}
	return "T";
	logger.info("routeSetChannelBtch rule done.");
}

function routeSetChannelFile(exchange) {
	logger.info("In routeSetChannelFile rule.");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var msgType;
	var matchFlag;
	var mtchMatchKey;
	var parentMsgType;
	var transactionSequence;
	var batchSequence;
	var routeFileToExcpq;
	var institutionId;
	var parallelChannelMode;
	var seqNo;
	var inputChannel;
	var outChannel;
	var fileCounter;
	var checkEr1;
	var fileComments;
	var txnCounter;
	var pattern;
	var totalAmtOfFile;
	var fileId;
	var msgScheme;
	var mode;
	var msgDir;
	var wsError;
	var queue;
	var commentsNew;
	var msgdbComments;
	var sddpriorityDate;
	var mdbflNumOfBatches;
	var assignId;
	var routePath;
	var bulkingFlag;
	var sepaAsIs;
	var bulkingConfig;
	var processingStage;
	var valueDate;

	txnCounter = memTblGetTableValue(map, "STREAM_DETAILS", "TXN_FORCE_STOP_COUNTER");
	msgScheme = getHeader(map, "PLCN_MsgScheme");

	institutionId = getHeader(map, "PLCN_institutionId");
	institutionId = getHeader(map, "INSTITUTION_ID");	
	routePath = institutionId.concat("MESSAGE_PROCESSING.FUNCTIONALITY.ROUTE_TO_BACKOFFICE.ROUTE_SEPA");
	bulkingFlag = memTblGetTableValue(map, "INST_PARAM", routePath);
	sepaAsIs = institutionId.concat("MESSAGE_PROCESSING.FUNCTIONALITY.ROUTE_TO_BACKOFFICE.SEPA_AS_IS");
	bulkingConfig = memTblGetTableValue(map, "INST_PARAM", sepaAsIs);

	// if(!msgScheme) {
	// 	msgScheme = memTblGetTableValue(map, "STREAM-TABLE_MAP_1", "MSG_SCHEME");
	// }
	if(!(getHeader(map, "ASSIGN_ID"))) {
		setHeader(map, "ASSIGN_ID", "");
	}
	assignId = memTblGetTableValue(map, "STREAM_DETAILS", "TRANS_REF_NO");
	if(!assignId) {
		assignId = getHeader(map, "PLCN_transRefNo");
	}
	msgType = getHeader(map, "PLCN_msgType");
	msgType = msgType.toUpperCase();
	commentsNew = getHeader(map, "PLCN_comments");
	// if(!commentsNew && !(isPatternPresent(msgType, "PACS.007") || isPatternPresent(msgType, "PACS.003"))){
	// 	commentsNew = getHeader(map, "COMMENTS");
	// }

	if(msgScheme == "INST" && msgType == "PACS.008.001.02"){
		setHeader(map, "FILE_COMMENTS_MSDB_COMMENTS", commentsNew);
	}

	totalAmtOfFile = getHeader(map, "PLCN_totalAmountOfFile");
	if(isPatternPresent(msgType, "CAMT.056") || isPatternPresent(msgType, "PACS.004")) {
		totalAmtOfFile = getHeader(map, "PRIORITY_AMOUNT_NUM");
	}
	setHeader(map, "PLCN_processingStage","");
	parallelChannelMode = memTblGetTableValue(map, "GENERAL", "IN-MEMORY-PARALLEL-CHANNEL");
	inputChannel = memTblGetTableValue(map, "GENERAL", "INPUT_CHANNEL");
	inputChannel = getHeader(map, "PLCN_channelIdSource");
	msgType = getHeader(map, "PLCN_msgType");
	msgType = msgType.toUpperCase();
	fileComments = memTblGetTableValue(map, "STREAM_DETAILS", "FILE_COMMENTS");

	// if(fileComments) {
	// 	if(isPatternPresent(fileComments, "8133") || isPatternPresent(memTblGetTableValue(map, "STREAM-TABLE_MAP_1","TechErrComments"), "8133")) {
	// 		fileComments = memTblGetTableValue(map, "STREAM-TABLE_MAP_1", "TechErrComments");
	// 	}
	// 	setHeader(map, "PLCN_comments", fileComments);
	// }
	if(isPatternPresent(msgType, "PACS.008") && !fileComments && isPatternPresent(getHeader(map, "PLCN_comments"), "8133")) {
		setHeader(map, "PLCN_comments", commentsNew);
		fileComments = getHeader(map, "PLCN_comments");
	}
	institutionId = getHeader(map, "PLCN_institutionId");
	pattern = getHeader(map, "PLCN_serviceConfigured");
	if(!institutionId) {
		institutionId = getHeader(map, "PLCN_institutionId");
	}
	if(isPatternPresent(msgType, "PACS.004")) {
		var status;
		var reasonCode;
		status = getHeader(map, "PLCN_fileStatus");
		setHeader(map, "PLCN_statusQual", status);
		reasonCode = getHeader(map, "PLCN_reasonCode");
		setHeader(map, "PLCN_reasonCode", reasonCode);
	}
	if(isPatternPresent(msgType, "PACS.004")) {
		if(parallelChannelMode == "YES") {
			seqNo = removePattern(inputChannel, "INMEMIN_SEPAIBFQ-RTR-IN-");
			outChannel = "DB-FILE-RTR-OUT".concat(seqNo);
			setHeader(map, "PLCN_outputChannel", outChannel);	
		}else {
			setHeader(map, "PLCN_outputChannel", "DB-FILE-RTR-OUT");
		}
		if(fileComments) {
			//if(isPatternPresent(fileComments, "8133") || isPatternPresent(memTblGetTableValue(map, "STREAM-TABLE_MAP_1", "TechErrComments"), "8133")){
				setHeader(map, "PLCN_comments", fileComments)
			//}
		}
	}
	fileCounter = memTblGetTableValue(map, "STREAM_DETAILS", "FILE_FORCE_STOP_COUNTER");
	if(!fileCounter) {
		fileCounter = 0;
	}
	checkEr1 = memTblGetTableValue(map, "USER_CONFIG_MAP", "MAX_ERR_IN_ERR_RPT");
	if(isPatternPresent(fileComments, "8476") || isPatternPresent(fileComments, "8957")){
		setHeader(map, "PLCN_forceStopCounter", checkEr1);
	} else {
		setHeader(map, "PLCN_forceStopCounter", fileCounter);
	}
	matchFlag = getHeader(map, "PLCN_matchFlag");
	if(isPatternPresent(msgType, "PACS.004") && matchFlag == "Y") {
		var auditString;
		var applicationId;
		var aceMessageNo;
		var prntFileNo;
		var institutionId;
		var statementSource;
		var originalTarget;
		var timeStamp;
		var retVal;
		var authCode4;
		var authCode5;
		var flag;
		var keyId;
		var stat;
		var count;
		var gvSeqNo;

		setHeader(map, "OUTPUT_CHANNEL", "DB-FILE-MTCH-OUT");
		institutionId = getHeader(map, "PLCN_institutionId");
		flag = memTblGetTableValue(map, "ACE_SECURITY_MAP", "END2END_REQUIRED");
		if(flag == "YES") {
			keyId = getInternalKeyID();
		}else {
			keyId = "";
		}
		applicationId = "INTFCORP";
		count = 100;
		// stat = GetSequenceArraysAndTimeStampFromDB(count, "ORACLE");
		// if(stat == "F") {
		// 	stat = GetSequenceArraysAndTimeStampFromDB(count, "ORACLE");
		// }
		// timeStamp = getOracleTimeStamp();
		// if(!gvSeqNo || gvSeqNo == 999){
		// 	gvSeqNo = 0;
		// }
		// gvSeqNo = gvSeqNo + 1;
		// gvSeqNo = gvSeqNo.padStart(3, 0);
		setHeader(map, "PLCN_seqNoId", gvSeqNo);
		setHeader(map, "PLCN_timeStamp", timeStamp);

		statementSource = getHeader(map, "PLCN_statementSource");
		prntFileNo = getHeader(map, "PLCN_messageNo");
		aceMessageNo = getHeader(map, "PLCN_aceMessageNo"); 
		auditString = aceMessageNo.concat(timeStamp).concat("FLPROCDQ").concat(applicationId).concat("MATCHUPDATE").concat(statementSource).concat(institutionId).concat(keyId);
		retVal = ddIntlHashCode(auditString, Document);
		authCode4 = getHeader(map, "PLCN_authcode");
		setHeader(map, "PLCN_authcode4", AUTHCODE4);
		originalTarget = getHeader(map, "PLCN_originalTarget");
		auditString = prntFileNo .concat(timeStamp).concat("FLPROCDQ").concat(applicationId).concat("MATCHUPDATE").concat(statementSource).concat(institutionId).concat(keyId);
		retVal = ddIntlHashCode(auditString, Document);
		authCode5 = getHeader(map, "PLCN_authcode");
		setHeader(map, "PLCN_authcode5", authCode5);

		setHeader(map, "PLCN_applicationId", applicationId);
		setHeader(map, "PLCN_auditString", auditString);
		setHeader(map, "PLCN_keyId", keyId);
		setHeader(map, "PLCN_timeStamp" , timeStamp);

	} 
	msgDir = getHeader(map, "PLCN_messageDirection");
	mode = getHeader(map, "PLCN_mode");
	if((mode == "QM") && (msgScheme == "INST")) { 
		setHeader(map, "PLCN_msgModeIn", mode);
		if(!msgDir) {
			msgDir = "I";
			setHeader(map, "PLCN_messageDirection", msgDir);
		}
	}else {
		setHeader(map, "PLCN_msgModeIn", "WS");
		if(!msgDir) {
			msgDir = "I";
			setHeader(map, "PLCN_messageDirection", msgDir);
		}
	}
	if(mode == "MQ" && isPatternPresent(msgType, "PACS.004")) {
		setHeader(map, "PLCN_outputChannel", "DB-CAN-FILE-OUT");
		setHeader(map, "PLCN_fileStatus", "69");
		setHeader(map, "PLCN_msgModeIn", mode);
	}
	if(msgScheme == "INST" && (mode == "MQ" || mode == "WS")){
		mdbflNumOfBatches = 1;
		setHeader(map, "PLCN_mdbflNumOfBatches", mdbflNumOfBatches);
	}

	if(mode != "WS") {
		if(isPatternPresent(msgType, "PACS.008") && isPatternPresent(inputChannel, "SEPAIBFQ-FCT-IN")) {
			if(parallelChannelMode == "YES"){
				if(isPatternPresent(inputChannel, "INMEMIN_SEPAIBFQ-FCT-IN")) {
					seqNo = removePattern(inputChannel, "INMEMIN_SEPAIBFQ-FCT-IN-");
				} else {
					seqNo = removePattern(inputChannel, "SEPAIBFQ-FCT-IN-");
				} 
			} else {
				if(!(isPatternPresent(fileComments, "9499") && isPatternPresent(fileComments, "7863"))){
					setHeader(map, "PLCN_queueId", "ERRFILEQ");
					setHeader(map, "PLCN_outputChannel", "DB-IBFILE-FCT-OUT");
				} else {
					setHeader(map, "PLCN_outputChannel", "DB-FILE-FCT-OUT");
					setHeader(map, "PLCN_comments", fileComments);
				}
			}
		}
		if(isPatternPresent(msgType, "PACS.008") && isPatternPresent(inputChannel, "SEPAOBFQ-FCT-IN") && msgDir == "I") {
			setHeader(map, "PLCN_comments", fileComments);
			setHeader(map, "PLCN_outputChannel", "DB-OBFILE-FCT-OUT");
			// setHeader(map, "ACE_STREAM_NAME", "DB-OBFILE-FCT-OUT");
			// setHeader(map, "ACE_APPLICATION_ID", "INTFPPAY");
		}

		if(isPatternPresent(msgType, "PACS.008") && isPatternPresent(inputChannel, "SEPAIBFQ-SCT-IN")) {
			if(parallelChannelMode == "YES") {
				if(isPatternPresent(inputChannel, "INMEMIN_SEPAIBFQ-SCT-IN")){
					seqNo = removePattern(inputChannel, "INMEMIN_SEPAIBFQ-SCT-IN-");
				} else {
					seqNo = removePattern(inputChannel, "SEPAIBFQ-SCT-IN-")
				}
				outChannel = "DB-FILE-SCT-B2B-OUT".concat(seqNo);
				setHeader(map, "PLCN_outputChannel", outChannel);
			} else {
				setHeader(map, "PLCN_outputChannel", "DB-FILE-SCT-B2B-OUT");
			}
		}
	} else {
		setHeader(map, "PLCN_outputChannel", "DB-WS-FILE-OUT");
	}
	if(isPatternPresent(msgType, "PACS.003") && isPatternPresent(msgType, "PACS.007")){
		if(parallelChannelMode == "YES"){
			if(isPatternPresent(inputChannel, "INMEMIN_SEPAIBFQ-B2B-SDD-IN-")){
				seqNo = removePattern(inputChannel, "INMEMIN_SEPAIBFQ-B2B-SDD-IN-");
			}else {
				seqNo = removePattern(inputChannel, "SEPAIBFQ-B2B-SDD-IN-")
			}
			 outChannel = "DB-FILE-FDD-OUT-".concat(seqNo);
			 setHeader(map, "PLCN_outputChannel", "DB-FILE-B2B-SDD-OUT");
		}
		setHeader(map, "PLCN_outputChannel", "DB-FILE-B2B-SDD-OUT");
	}
	wsError = getHeader(map, "WS_ERROR");
	memTblSetTableValue(map, "STREAM_DETAILS", "WS_ERROR", wsError);
	if(!wsError) {
		wsError = memTblGetTableValue(map, "TransTable", "TransErrorFlag");
		if(wsError == "T") {
			wsError = "Y";
		}else {
			wsError = "";
		}
	}

	var processPath;
	var processLevel;
	processPath = institutionId.concat(".PROCESSING_LEVEL_PRODUCTS");
	processLevel = memTblGetTableValue(map, "INST_PARAM", processPath);
	if(!(isPatternPresent(bulkingConfig, "Y"))){
		setHeader(map, "PLCN_bulkingCofig", "N");
	}

	if(processLevel == "MESSAGE") {
		if(isPatternPresent(msgType, "PACS.008.001.08")) {
			if(isPatternPresent(msgDir, "I")) {
				setHeader(map, "PLCN_bulkingCofig", "N");
				setHeader(map, "PLCN_fileQueueId", "SCTTMPFQ");
				setHeader(map, "PLCN_processingStage", (memTblGetTableValue(map, "QUEUE_MAP", "SCTTMPFQ")));
				setHeader(map, "PLCN_FileStatus", "66");
			} else {
				setHeader(map, "PLCN_bulkingCofig", "N");
				setHeader(map, "PLCN_fileQueueId", "SCTTMPFQ");
				setHeader(map, "PLCN_processingStage", (memTblGetTableValue(map, "QUEUE_MAP", "SCTTMPFQ")));
				setHeader(map, "PLCN_processingStage", "66");
			}
		}
	}

	if(isPatternPresent(msgType, "CAMT.029") || isPatternPresent(msgType, "CAMT.056")) {
		totalAmtOfFile = getHeader(map, "PRIORITY_AMOUNT_NUM");
	}
	if(isPatternPresent(msgType, "CAMT.056")) {
		setHeader(map, "PLCN_outputChannel", "DB-FILE-CXLN-OUT");
		setHeader(map, "PLCN_fileQueueId", "SCTTMPFQ");
		setHeader(map, "PLCN_fileStatus", "66");
	}
	if(isPatternPresent(msgType, "CAMT.029")) {
		setHeader(map, "PLCN_outputChannel", "DB-FILE-CAN-OUT");
		setHeader(map, "PLCN_fileQueueId", "SCTTMPFQ");
		setHeader(map, "PLCN_fileStatus", "66");
	}

	processingStage = getHeader(map, "PLCN_processingStage");
	if(wsError == "Y" && processingStage != "FINL") {
		if(isPatternPresent(memTblGetTableValue(map, "TransTable", "TransErrorCode"), "8465") || isPatternPresent(memTblGetTableValue(map, "TransTable", "TransErrorCode"), "8477")) {
			queue = "PROCEXFQ";
		} else {
			queue = "ERRFILEQ";
		}
		setHeader(map, "FILE_QUEUEID", queue);
		setHeader(map, "PLCN_fileQueueId", queue);
	}
	logger.info("routeSetChannelFile rule done.");	
}

function routeSetChannelPacs002(exchange) {
	logger.info("In routeSetChannelPacs002");
	
	var inputChannel;
	var seqNo;
	var outChannel;
	var pacs002Txn;
	var mode;
	var msgScheme;
	var retval;
	
	
	mode = getHeader(map, "QM"); 
	
	inputChannel = memTblGetTableValue(map, "GENERAL", "INPUT_CHANNEL");
	var pacs002Txn1 = getHeader(map, "PLCN_pacs002Txn");
	pacs002Txn = pacs002Txn1.concat("</FIToFIPmtStsRpt></Document>");
	setHeader(map, "PLCN_pacs002Txn", pacs002Txn);
	
	msgScheme = getHeader(map, "PLCN_msgScheme");
	if  (msgScheme = ""){
			
			msgScheme = memTblGetTableValue(map, "STREAM-TABLE_MAP", "MSG_SCHEME");
	}
	
	if (inputChannel == "SEPAOBFQ-FCT-IN" || inputChannel == "SEPAIBFQ-FCT-IN" || mode == "WS" || mode == "MQ" && msgScheme == "INST"){
		
		setHeader(map, "PLCN_outputChannel", "DB-BLOB-STS-OUT");
	}
	
	if (inputChannel == "SEPAOBFQ-FCT-IN" || inputChannel == "SEPAIBFQ-FCT-IN" || mode == "WS" || mode == "MQ" && msgScheme != "INST"){
		
		setHeader(map, "PLCN_outputChannel", "DB-BLOB-FCT-STS-OUT");
	}
	
	if (inputChannel == "SEPAIBFQ-B2B-SDD-IN" && msgScheme != "INST"){
		 
		setHeader(map, "PLCN_outputChannel", "DB-BLOB-DD-STS-OUT");
	}
	
	if (inputChannel == "SEPAIBFQ-CAN-IN"){
		
		setHeader(map, "PLCN_outputChannel", "DB-BLOB-CXLN-STS-OUT");
	}
	
	if (inputChannel == "SEPAIBFQ-RTR-IN"){
		setHeader(map, "PLCN_outputChannel", "DB-BLOB-RTR-STS-OUT");
	}
	
	return "T";
}

function routeSetChannelTxn(exchange) {
logger.info("In routeSetChannelTxn rule.");

var inMsg = exchange.getIn();
var map = inMsg.getHeaders();
var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
var comments;
var queueId;
var msg;
var retValue;
var queueId1;
var txsMsgNo;
var seqNoId;
var aceMessageNo;
var timeStamp;
var auditText;
var auditString;
var retVal;
var flag;
var keyId;
var institutionId;
var batchMsgNo;
var applicationId;
var instaTxnMsg;
var authCode1;
var matchFlag;
var msgType;
var parentMessageNo;
var parentMsgType;
var mtchMatchKey;
var msgNum;
var audit1;
var audit2;
var parallelChannelMode;
var seqNo;
var inputChannel;
var outChannel;
var TxnCounter;
var bankChnl;
var dbtrAgntPattern;
var checker1;
var batchComments;
var txnComments;
var errFlag;
var extrnalSysUmr;
var status;
var reasonCd;
var exchRateFlag;
var cashInsytAuditFlag;
var txnAmount;
var forceRejectParam;
var totalTrxnsInFile;
var processingStage;
var ibanCamt;
var bankingChanl;
var accountCr;
var orgPmtInFId;
var orgMsgId;
var orgMsgNmId;
var messageClassType;
var msgDirection
var pacs2Flag;
var msgScheme;
var fileComments;
var channelSource;
var testMode;
var txnMsg;
var txnHdr;
var txnVal;
var data1;
var data2;
var data3;
var msg2;
var msg1;
var authCode;
var aceMess;
var services;
var resubmitQueueId;
var authCode3;
var banifRelatedEnrichment;
var outputChannel;
var newComments;
var origMsg;
var drveServiceTxn;
var pattern;
var scanServiceFlag;
var preWareHouseFlag;
var accountingFlag;
var txnGroup;
var messageDirection;
var msgPacs2Insta;
var txnCustom2;
var txnBlob2;
var data4;
var origTxn;
var mode;
var txIdPath;
var sourceChnlId;
var msgModeIn;
var txnVal2;
var schedulingFlag;
var message;
var txCxlsts;
var cxlId;
var rootNode;
var txnCommentsMsdb;
var gvTxnMsg;

var message = inMsg.getBody(java.lang.String.class);
sourceChnlId = getHeader(map, "PLCN_channelIdSource");
logger.info("routeSetChannelTxn: channelSource = " + sourceChnlId);

mode = getHeader(map, "QM");
forceRejectParam = getHeader(map, "PLCN_forceRejectParam");
logger.info("routeSetChannelTxn: forceRejectParam = " + forceRejectParam);

totalTrxnsInFile = getHeader(map, "PLCN_totalTxnInFile");
logger.info("routeSetChannelTxn: totalTrxnsInFile = " + totalTrxnsInFile);

authCode1 = getHeader(map, "PLCN_authcode");
logger.info("routeSetChannelTxn: authCode1 = " + authCode1);
setHeader(map, "PLCN_authcode", authCode1);

newComments = getHeader(map, "PLCN_comments");
logger.info("routeSetChannelTxn: newComments = " + newComments);

if(isPatternPresent(newComments, "7863")) {
	newComments = replacePattern(newComments, "7863", "9499");
	setHeader(map, "PLCN_comments", newComments);
}
services = getHeader(map, "PLCN_serviceName");
logger.info("routeSetChannelTxn: services = " + services);

if(!services) {
	setHeader(map, "PLCN_serviceName", "");
}
bankChnl = getHeader(map, "PLCN_bankingChannel");
logger.info("routeSetChannelTxn: bankChnl = " + bankChnl);

institutionId = getHeader(map, "PLCN_institutionId");
logger.info("routeSetChannelTxn: institutionId = " + institutionId);

txnComments = memTblGetTableValue(map, "STREAM_DETAILS", "TXN_COMMENTS");
if(!txnComments) {
	txnComments = getHeader(map, "PLCN_txnComments");
	logger.info("routeSetChannelTxn: txnComments = " + txnComments);

}
setHeader(map, "PLCN_txnComments", txnComments);
errFlag = "N";
txnAmount = getHeader(map, "PLCN_priorityAmount");
logger.info("routeSetChannelTxn: txnAmount = " + txnAmount);

txnAmount = replacePattern(txnAmount, ".", ",");

messageClassType = getHeader(map, "PLCN_orgMessageClassType");
logger.info("routeSetChannelTxn: messageClassType = " + messageClassType);

msgDirection = getHeader(map, "PLCN_messageDirection");
logger.info("routeSetChannelTxn: msgDirection = " + msgDirection);

msgType = getHeader(map, "PLCN_msgType");
logger.info("routeSetChannelTxn: msgType = " + msgType);

msgType = msgType.toUpperCase();

setBankingChannelTA(exchange);
TxnCounter = memTblGetTableValue(map, "STREAM_DETAILS", "TXN_FORCE_STOP_COUNTER");
if(!TxnCounter) {
	TxnCounter = 0;
}
checker1 = memTblGetTableValue(map, "USER_CONFIG_MAP", "MAX_ERR_IN_ERR_RPT");
if((isPatternPresent(txnComments, "5774") || isPatternPresent(batchComments, "5774")) && bankChnl == "ABNA_ACESSDIRECT") {
	errFlag = "Y";
}
if(isPatternPresent(txnComments, "8961")) {
	if(isPatternPresent(msgType, "PACS.004") || (msgType, "PACS.002") && isPatternPresent(txnComments, "5714")) {
		setHeader(map, "PLCN_txnForceStopCounter", 0);
	} else {
		setHeader(map, "PLCN_txnForceStopCounter", checker1);
		errFlag = "N";
	}
 } else {
 	if(memTblGetTableValue(map, "FORCE_REJECT_MAP", "forceRejectParam") == "YES" && getHeader(map, "PLCN_transactionSequence") == totalTrxnsInFile) {
 		setHeader(map, "PLCN_forceStopCounter", checker1);
 	} else {
 		setHeader(map, "PLCN_forceStopCounter", TxnCounter);
 	}
 }
 if(isPatternPresent(message, "FIToFICstmrCdtTrf")) {
 	message = dataBetweenTokens("<CdtTrfTxInf>", "</CdtTrfTxInf>", message);
 	message =  "<CdtTrfTxInf>".concat(message).concat("</CdtTrfTxInf>") 
 }
 
 var instaTxnMsg;
 var instaTxnMsgTxn;

 if(isPatternPresent(message, "FIToFIPmtCxlReq")) {
 	gvTxnMsg = message;
 	instaTxnMsg = message;
 	instaTxnMsg = instaTxnMsg.concat("</Document>");
 	instaTxnMsg = dataBetweenTokens("<Document>", "</Document>", instaTxnMsg);
	instaTxnMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:camt.056.001.01\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">".concat(instaTxnMsgTxn);
 	message = dataBetweenTokens("<TxInf>", "</TxInf>", message);
 	message = "<TxInf>".concat(message).concat("</TxInf>");
 	retVal = ddIntlHashCode(message, exchange);
 	authCode3 = getHeader(map, "PLCN_authcode");
 	setHeader(map, "PLCN_authcode2", authCode3);
 	instaTxnMsg = instaTxnMsg.concat("</FIToFIPmtCxlReq>").concat("</Document>");
 	setHeader(map, "PLCN_instaTxnMsg", instaTxnMsg);
 	retVal = ddIntlHashCode(message, exchange);
 	authCode3 = getHeader(map, "PLCN_authcode");
 	setHeader(map, "PLCN_authcode3", authCode3);
 	instaTxnMsg = dataBetweenTokens("<Document>", "</Document>", instaTxnMsg);	
 }
 
  if(isPatternPresent(message, "RsltnOfInvstgtn")) {
 	gvTxnMsg = message;
 	instaTxnMsg = message;
 	instaTxnMsg = instaTxnMsg.concat("</Document>");
 	instaTxnMsg = dataBetweenTokens("<Document>", "</Document>", instaTxnMsg);
 	institutionId = getHeader(map, "PLCN_institutionId");
 	rootNode = institutionId.concat(".MESSAGE_PROCESSING.FUNCTIONALITY.ENRICHMENT.XML-XSD_VERSION_PACS.004.XML-XSD_VERSION_PACS.004");
 	rootNode = memTblGetTableValue(map, "INST_PARAM", rootNode);
 	instaTxnMsg = rootNode.concat(instaTxnMsg);
 	message = dataBetweenTokens("<TxInfAndSts>", "</TxInfAndSts>", message);
 	message = "<TxInfAndSts>".concat(message).concat("</TxInfAndSts>");
 	retVal = ddIntlHashCode(message, exchange);
 	authCode3 = getHeader(map, "PLCN_authcode");
 	setHeader(map, "PLCN_authcode2", authCode3);
 	instaTxnMsg = instaTxnMsg.concat("</RsltnOfInvstgtn>").concat("</Document>");
 	setHeader(map, "PLCN_instaTxnMsg", instaTxnMsg);
 	retVal = ddIntlHashCode(message, exchange);
 	authCode3 = getHeader(map, "PLCN_authcode");
 	setHeader(map, "PLCN_authcode3", authCode3);
 	instaTxnMsg = dataBetweenTokens("<Document>", "</Document>", instaTxnMsg);	
 }
 
 if(isPatternPresent(message, "PmtRtr")) {
 	gvTxnMsg = message;
 	instaTxnMsg = message;
 	instaTxnMsg = instaTxnMsg.concat("</Document>");
 	instaTxnMsg = dataBetweenTokens("<Document>", "</Document>", instaTxnMsg);
 	institutionId = getHeader(map, "PLCN_institutionId");
 	rootNode = institutionId.concat(".MESSAGE_PROCESSING.FUNCTIONALITY.ENRICHMENT.XML-XSD_VERSION_PACS.004.XML-XSD_VERSION_PACS.004");
 	rootNode = memTblGetTableValue(map, "INST_PARAM", rootNode);
 	instaTxnMsg = rootNode.concat(instaTxnMsg);
 	message = dataBetweenTokens("<TxInf>", "</TxInf>", message);
 	message = "<TxInf>".concat(message).concat("</TxInf>");
 	retVal = ddIntlHashCode(message, exchange);
 	authCode3 = getHeader(map, "PLCN_authcode");
 	setHeader(map, "PLCN_authcode2", authCode3);
 	instaTxnMsg = instaTxnMsg.concat("</PmtRtr>").concat("</Document>");
 	setHeader(map, "PLCN_instaTxnMsg", instaTxnMsg);
 	retVal = ddIntlHashCode(message, exchange);
 	authCode3 = getHeader(map, "PLCN_authcode");
 	setHeader(map, "PLCN_authcode3", authCode3);
 	instaTxnMsg = dataBetweenTokens("<Document>", "</Document>", instaTxnMsg);	
 }
 
 if(isPatternPresent(message, "</FIToFIPmtCxlReq>")){
	 message = dataBetweenTokens("<TxInf>", "</TxInf>", message);
	 message = "<TxInf>".concat(message).concat("</TxInf>");
	 gvTxnMsg = message;
 }
 
 if(isPatternPresent(message, "</FIToFIPmtStsRpt>")){
	 var pacs2Flag = "PACS.002";
	 message = dataBetweenTokens("<TxInf>", "</TxInf>", message);
	 message = "<TxInf>".concat(message).concat("</TxInf>");
	 gvTxnMsg = message;
 }
 
 if(isPatternPresent(message, "</PmtRtr>")) {
 	gvTxnMsg = message;
 	instaTxnMsg = message;
 	message = dataBetweenTokens("<TxInf>", "</TxInf>", message);
 	message = "<TxInf>".concat(message).concat("</TxInf>");
 	instaTxnMsg = instaTxnMsg.concat("</PmtRtr>").concat("</Document>");
 	setHeader(map, "INSTA_TXN_MSG", instaTxnMsg);
 	retVal = ddIntlHashCode(message, exchange);
 	authCode3 = getHeader(map, "PLCN_authcode");
 	setHeader(map, "PLCN_authcode2", authCode3);
 	instaTxnMsg = dataBetweenTokens("<Document>","</Document", instaTxnMsg);
 }
 if(isPatternPresent(message, "</PmtRtr>")) {
 	message = dataBetweenTokens("<TxInf>", "</TxInf>", message);
 	message = "<TxInf>".concat(message).concat("</TxInf>");
 	gvTxnMsg = message;
 }
 if(isPatternPresent(message, "</FIToFICstmrCdtTrf>")) {
 	gvTxnMsg = message;
 	instaTxnMsg = message;
 	message = dataBetweenTokens("<CdtTrfTxInf>", "</CdtTrfTxInf>", message);
 	message = "<CdtTrfTxInf>".concat(message).concat("</CdtTrfTxInf>");
 	instaTxnMsg = instaTxnMsg.concat("</FIToFICstmrCdtTrf>").concat("</Document>");
 	setHeader(map, "INSTA_TXN_MSG", instaTxnMsg);
 	retVal = ddIntlHashCode(message, exchange);
 	authCode3 = getHeader(map, "PLCN_authcode");
 	setHeader(map, "PLCN_authcode3", authCode3);
 	instaTxnMsg = dataBetweenTokens("<Document>","</Document", instaTxnMsg);

 }
 if(gvTxnMsg) {
 	retVal = ddIntlHashCode(gvTxnMsg, exchange); 
 } else {
 	retVal = ddIntlHashCode(gvTxnMsg, exchange);
 }

 authCode1 = getHeader(map, "PLCN_authcode");
 setHeader(map, "PLCN_authcode1", authCode1);
 if(retVal != 0) {
 	comments = setCommentsForTransaction(map, "", "");
 	setHeader(map, "PLCN_queueId", "PAYERR");
 	setHeader(map, "PLCN_status", "69");
 }
 setHeader(map, "PLCN_comments", "");
 queueId1 = getHeader(map, "PLCN_txnQueueId");
 if(queueId1) {
 	setHeader(map, "PLCN_txnQueueId", queueId1);
 }
 if(pacs2Flag == "PACS.002"){
	 setHeader(map, "PLCN_txnQueueId", "TEMPSTSQ");
	 setHeader(map, "PLCN_status", "79");
 }
 if(isPatternPresent(msgType, "PACS.004") && !(queueId1 == "CRPDUPLQ")) {
 	routeBatchOrTxnProcessing("MODSEPAQ", "TMPTXVWQ", "TMPTXVWQ", exchange);
 }
if(isPatternPresent(msgType, "PACS.002") && (isPatternPresent(txnComments, "-5") || isPatternPresent(txnComments, "-3") || isPatternPresent(txnComments, "-4") || isPatternPresent(txnComments, "-15") || isPatternPresent(txnComments, "-1614"))) {
 	setHeader(map, "PLCN_status", "102");
 } else{
 	setHeader(map, "PLCN_status", "66");
 }
 if(isPatternPresent(msgType, "PACS.004") && (isPatternPresent(txnComments, "-5") || isPatternPresent(txnComments, "-3") || isPatternPresent(txnComments, "-4") || isPatternPresent(txnComments, "-15") || isPatternPresent(txnComments, "-1614"))) {
 	setHeader(map, "PLCN_status", "102");
 } else{
 	setHeader(map, "PLCN_status", "66");
 }
 if(isPatternPresent(msgType, "PACS.008") && (isPatternPresent(txnComments, "-8") || isPatternPresent(txnComments, "-5") || isPatternPresent(txnComments, "-3") || isPatternPresent(txnComments, "-4") || isPatternPresent(txnComments, "-15") || isPatternPresent(txnComments, "-1614"))) {
 	setHeader(map, "PLCN_status", "102");
 }
 fileComments = getHeader(map, "PLCN_comments");
 inputChannel = memTblGetTableValue(map, "GENERAL", "INPUT_CHANNEL");
 if(isPatternPresent(getHeader(map, "PLCN_msgType"), "PACS.004")) {
 	if(isPatternPresent(inputChannel, "SEPAIBFQ-RTR-IN") && (isPatternPresent(txnComments, "-5") || isPatternPresent(txnComments, "-3") || isPatternPresent(txnComments, "-4") || isPatternPresent(txnComments, "-15") || isPatternPresent(txnComments, "-1614"))) {
 		setHeader(map, "PLCN_txnQueueId", "TMPCXLWQ");
 		setHeader(map, "PLCN_status", "102");
 	}
 }
 msgType = getHeader(map, "PLCN_msgType");
 msgType = msgType.toUpperCase();
 if(msgScheme == "INST" && msgType == "PACS.008.001.08") {
 	txnGroup = "EFT";
 	messageDirection = "I";
 	setHeader(map, "PLCN_TransactionGroup", txnGroup);
 	setHeader(map, "PLCN_messageDirection", messageDirection);
 }
 if(msgScheme == "INST" && isPatternPresent(message, "</FIToFICstmrCdtTrf>")) {
 	gvTxnMsg = message;
 	instaTxnMsg = message;
 	message = dataBetweenTokens("<CdtTrfTxInf>", "</CdtTrfTxInf>", message);
 	message = "<CdtTrfTxInf>".concat(message).concat("</CdtTrfTxInf>");
 	instaTxnMsg = instaTxnMsg.concat("</FIToFICstmrCdtTrf>").concat("</Document>");
 	setHeader(map, "INSTA_TXN_MSG", instaTxnMsg);
 	retVal = ddIntlHashCode(message, exchange);
 	authCode3 = getHeader(map, "PLCN_authCode");
 	setHeader(map, "PLCN_authcode3", authCode3);
 	instaTxnMsg = dataBetweenTokens("<Document>","</Document", instaTxnMsg);
 }
 
 if(isPatternPresent(message, "</RsltnOfInvstgtn>")){
	 message = dataBetweenTokens("<CxlDtls>", "</CxlDtls>", message);
	 message = "<CxlDtls>".concat(message).concat("</CxlDtls>");
	 setHeader(map, "PLCN_txnInfo", gvTxnMsg);
	 setHeader(map, "PLCN_origTxn", gvTxnMsg);
 }
 if(isPatternPresent(msgType, "CAMT.055") || isPatternPresent(msgType, "CAMT.056") || isPatternPresent(msgType, "CAMT.029") || isPatternPresent(msgType, "PACS.028")){
	 queueId = "TMPTXVWQ";
	 setHeader(map, "PLCN_txnProcessId", "TO-MATCH");
	 setHeader(map, "PLCN_channelIdSource", sourceChnlId);
	 setHeader(map, "PLCN_txnQueueId", queueId);
	 camt055CustomMatchingParameters(msgType, exchange);
	 accountCr = getHeader(map, "PLCN_otherAccNo");
	 ibanCamt = accountCr;
	 bankingChanl = ibanCamt.substring(5, 4);
	 systemLevelFlag = memTblGetTableValue(map, "BANKING_CHANL_MAP", bankingChanl);
	 if(!bankChnl){
		 setHeader(map, "INSTA_bankingChanl", "NVB");
	 }
	 setHeader(map, "PLCN_orgPmtInfId", orgPmtInFId);
	 setHeader(map, "PLCN_orgMsgId", orgMsgId);
	 setHeader(map, "PLCN_orgMsgNmId", orgMsgNmId);
	 //deriveGroupingInfoCamt055(exchange);
}
 var gvTxnQueueId = getHeader(map, "PLCN_queueId");
 if(isPatternPresent(message, "</FIToFICstmrCdtTrf>") && gvTxnQueueId != "DUPLWEBQ") {
 	message = dataBetweenTokens("<CdtTrfTxInf>", "</CdtTrfTxInf>", message);
 	message = "<CdtTrfTxInf>".concat(message).concat("</CdtTrfTxInf>");
 	banifRelatedEnrichment = memTblGetTableValue(map, "FLAG-TABLE", "BANIF_RELATED_ENRICHMENT");
 	if(banifRelatedEnrichment == "Y") {

 	}
 }
 
 if(isPatternPresent(message, "</FIToFIPmtStsRpt>")){
	 var pacs2Flag = "PACS.002";
	 msgPacs2Insta = message;
	 message = dataBetweenTokens("<TxInfAndSts>", "</TxInfAndSts>", message);
	 message = "<TxInfAndSts>".concat(message).concat("</TxInfAndSts>");
	 gvTxnMsg = message;
 }
 if(isPatternPresent(message, "</PmtRtr>")) {
 		message = dataBetweenTokens("<TxInf>", "</TxInf>", message);
 		message = "<TxInf>".concat(message).concat("</TxInf>");
 		gvTxnMsg = message;
  }
  if(isPatternPresent(inputChannel, "SEPAIBFQ-SCT-IN") || isPatternPresent(msgType, "PACS.008")){
	retVal = ddIntlHashCode(message, exchange);
	authCode3 = getHeader(map, "PLCN_authcode");
	setHeader(map, "PLCN_authcode3", authCode3);  	
  }
  origMsg = getHeader(map, "PLCN_origTxn");
  if(gvTxnQueueId != "DUPLWEBQ") {
  	if(origMsg) {
  		retVal = ddIntlHashCode(origMsg, exchange);
  	}
  }	
 authCode1 = getHeader(map, "PLCN_authcode");
 setHeader(map, "PLCN_authcode1", authCode1);

 if(retVal != 0){
 	comments = setCommentsForTransaction(map, "", "")
 	setHeader(map, "PLCN_txnQueueId", "PAYERR");
 	setHeader(map, "PLCN_txnStatus", "69");
 }
 var queueId2 = getHeader(map, "PLCN_queueId");
 if(!(isPatternPresent(queueId2, "MSGHOLDQ"))) {
 	if(msgScheme == "INST" && isPatternPresent(gvTxnMsg, "FIToFICstmrCdtTrf")) {
 		routeBatchOrTxnProcessing("MODSEPAQ", "OBOPTMQ", "OBOPTMQ", exchange);
 	} else {
 		if(pacs2Flag == "PACS.002") {
 			setHeader(map, "PLCN_txnQueueId", "TEMPSTSQ");
 			setHeader(map, "PLCN_txntatus", "79");
 		} else {
 			if(isPatternPresent(gvTxnMsg, "</TxInf>")){
 				routeBatchOrTxnProcessing("MODSEPAQ", "CMTBLKQ", "TMPTXVWQ", exchange);
 			}else {
 				routeBatchOrTxnProcessing("MODSEPAQ", "TMPTXVWQ", "TMPTXVWQ", exchange);
 			}
 			routeBatchOrTxnProcessing("MODSEPAQ", "TMPTXVWQ", "TMPTXVWQ", exchange);
 		}
 	}
 }
 amountCapFunctionalityTxn(exchange);
 if(isPatternPresent(queueId2, "MSGHOLDQ")) {
 	drveServiceTxn = getHeader(map, "PLCN_custom13");
 	if(isPatternPresent(drveServiceTxn, "06_PREWAREHOUSESERVICE=Y")) {
 		drveServiceTxn = replacePattern(drveServiceTxn, "06_PREWAREHOUSESERVICE=Y", "06_PREWAREHOUSESERVICE=D");		
 	}
 	setHeader(map, "SERVICE_CONFIGURED_TXN", drveServiceTxn);
 	txnComments = memTblGetTableValue(map, "STREAM_DETAILS", "txnComments");
 	if(isPatternPresent(txnComments, "-8") || isPatternPresent(txnComments, "-5") || isPatternPresent(txnComments, "-3") || isPatternPresent(txnComments, "-4") || isPatternPresent(txnComments, "-15") || isPatternPresent(txnComments, "-1614") || isPatternPresent(txnComments, "2082")) {
 		setHeader(map, "PLCN_txnQueueId", "TMPCXLWQ");
 		setHeader(map, "PLCN_txnStatus", "69");
 		setHeader(map, "PLCN_sepaErrorFlag", "T");
 	}
 }
 pattern = getHeader(map, "PLCN_custom13");
 if(getHeader(map, "SCANSERVICE_FLAG") == "Y"){
 	pattern = replacePattern(pattern, "07_SCANSERVICE=Y", "07_SCANSERVICE=D");
 }
 if(getHeader(map, "PREWAREHOUSE_FLAG") == "Y"){
 	pattern = replacePattern(pattern, "PREWAREHOUSE_FLAG=Y", "PREWAREHOUSE_FLAG=D");
 }
 if(getHeader(map, "ACCOUNTING_FLAG") == "Y"){
 	pattern = replacePattern(pattern, "ACCOUNTING_FLAG=Y", "ACCOUNTING_FLAG=D");
 }
 setHeader(map, "PLCN_serviceConfiguredTxn", pattern);
	var wsError;
	wsError = getHeader(map, "PLCN_wsError");
	memTblSetTableValue(map, "STREAM_DETAILS", "WS_ERROR", wsError);
	if(!wsError) {
		wsError = memTblGetTableValue(map, "TransTable", "TransErrorFlag");
		if(wsError == "T") {
			wsError = "Y";
		} else {
			wsError = "";
		}
	}
	
	if((pacs2Flag == "PACS.002") && (isPatternPresent(txnComments, "-8") || isPatternPresent(txnComments, "-5") || isPatternPresent(txnComments, "-3") || isPatternPresent(txnComments, "-4") || isPatternPresent(txnComments, "-15") || isPatternPresent(txnComments, "-1614"))){
		setHeader(map, "PLCN_txnStatus", "102");
		setHeader(map, "PLCN_txnStatus", "69");
	}
	fileComments = getHeader(map, "PLCN_fileComments");
	inputChannel = memTblGetTableValue(map, "GENERAL", "INPUT_CHANNEL");
	if(isPatternPresent(getHeader(map, "PLCN_msgType"), "pacs.008") && msgScheme != "INST") {
		if(isPatternPresent(inputChannel, "SEPAOBFQ-FCT-IN") && getHeader(map, "PLCN_sepaErrorFlag") == "T") {
			setHeader(map, "PLCN_txnQueueId", "TMPCXLWQ");
		} else {
			setHeader(map, "PLCN_txnStatus", "66");
		}
	}
	if (isPatternPresent(getHeader(map, "PLCN_msgType"), "pacs.008")) {
	if(isPatternPresent(inputChannel, "SEPAIBFQ-RTR-IN") && (isPatternPresent(txnComments, "-8") || isPatternPresent(txnComments, "-5") || isPatternPresent(txnComments, "-3") || isPatternPresent(txnComments, "-4") || isPatternPresent(txnComments, "-15") || isPatternPresent(txnComments, "-1614"))) {
		setHeader(map, "PLCN_txnQueueId", "TMPCXLWQ");
		setHeader(map, "PLCN_txnStatus", "102");
	}else {
		setHeader(map, "PLCN_txnStatus", "66");
	}
  	
  }
  if(isPatternPresent(getHeader(map, "PLCN_msgType"), "pacs.008") && msgScheme != "INST") {
  	if((isPatternPresent(inputChannel, "SEPAOBFQ-FCT-IN") || isPatternPresent(inputChannel, "SEPAIBFQ-FCT-IN")) && (isPatternPresent(txnComments, "-8") || isPatternPresent(txnComments, "-5") || isPatternPresent(txnComments, "-3") || isPatternPresent(txnComments, "-4") || isPatternPresent(txnComments, "-15") || isPatternPresent(txnComments, "-1614"))) {
  		setHeader(map, "PLCN_txnQueueId", "TMPCXLWQ");
  		setHeader(map, "PLCN_txnStatus", "102");
  	}else {
  		setHeader(map, "PLCN_txnStatus", "66");
  	}	
  }
  
  if(getHeader(map, "PLCN_msgType") == "pacs.002"){
	  if(isPatternPresent(inputChannel, "SEPAIBFQ-STS-RPT-B2B-IN") && isPatternPresent(msgDirection, "O") || isPatternPresent(txnComments, "-8") || isPatternPresent(txnComments, "-5") || isPatternPresent(txnComments, "-3") || isPatternPresent(txnComments, "-4") || isPatternPresent(txnComments, "-15") ||isPatternPresent(txnComments, "-1614") || isPatternPresent(fileComments, "-8") || isPatternPresent(fileComments, "-5") || isPatternPresent(fileComments, "-3") || isPatternPresent(fileComments, "-15") || isPatternPresent(fileComments, "-1614")){
		 setHeader(map, "PLCN_txnQueueId", "PROCDQ"); 
		 setHeader(map, "PLCN_txnStatus", "102"); 
	  }else {
		  setHeader(map, "PLCN_txnStatus", "66");
	  }
  }
  
  if(getHeader(map, "PLCN_txnQueueId") == "TMPCXLWQ" && msgScheme == "INST") {
  	setHeader(map, "PLCN_txnStatus", "102");
  }
  queueId1 = getHeader(map, "PLCN_txnQueueId");
  logger.info("routeSetChannelTxn: queueId = " + queueId);

  if(queueId1) {
  	setHeader(map, "PLCN_queueId", queueId1);
  	processingStage = memTblGetTableValue(map, "QUEUE_MAP", queueId1);
  	if(processingStage) {
  		memTblSetTableValue(map, "QUEUE", "PROCESSING_STAGE", processingStage);
  	}else {
  		memTblSetTableValue(map, "QUEUE", "PROCESSING_STAGE", "");
  	}
  	setHeader(map, "PLCN_processingStage", processingStage);
  }
  queueId = getHeader(map, "PLCN_txnQueueId");
  logger.info("routeSetChannelTxn: queueId = " + queueId);
  
  if(isPatternPresent (msgType, "CAMT.055") || isPatternPresent(msgType, "CAMT.056")){
	  queueId = "TMPTXVWQ";
	  setHeader(map, "PLCN_txnProcessId", "TO-MATCH");
	  var routeChannelId;
	  var routeValue;
	  var sepaExchPth;
	  var sepaExchValue;
	  sepaExchPth = institutionId.concat(".PROCESSING_PARAMS.FUNCTIONALITY.OUTPUT_SEPA_INTERFACES.MECHANISM.SEPA_MSG_EXCHANGE");
	  sepaExchValue = memTblGetTableValue(map, "INST_PARAM", "SEPA_EXCH_PTH");
	  routeChannelId = getHeader(map, "PLCN_routeChannelId");
	  testMode = memTblGetTableValue(map, "FLAG-TABLE", "API_TESTMODE");
	  if(testMode == "NO"){
		  routeValue = routeChannelId.concat("-").concat(sepaExchValue);
		  routeValue = memTblGetTableValue(map, "ROUTE_BANKCHNL", routeValue);
	  }
	   if(testMode == "YES"){
		  routeValue = routeChannelId.concat("-").concat(sepaExchValue);
		  routeValue = memTblGetTableValue(map, "API_TESTMODE_ROUTE_BANKCHNL", routeValue);
	  }
	  setHeader(map, "PLCN_channelIdSource", routeChannelId);
	  setHeader(map, "PLCN_bankingChanl", routeValue);
	  camt055CustomMatchingParameters(msgType, exchange);
	  bankingChanl = ibanCamt.substring(5, 4);
	  bankingChanl = memTblGetTableValue(map, "BANKING_CHANL_MAP", bankingChanl);
	  if(isPatternPresent(msgType, "CAMT.056")){
		  orgMsgId = "Undrlyg.TxInf.OrgnlGrpInf.OrgnlMsgId";
		  orgMsgNmId = "Undrlyg.TxInf.OrgnlGrpInf.OrgnlMsgNmId";
		  //orgPmtInfId = getIndirect(orgPmtInfId);
		  //orgMsgId = getIndirect(orgMsgId);
		  //orgMsgNmId = getIndirect(orgMsgNmId);
	  }
	  //setHeader(map, "PLCN_orgPmtInfId", orgPmtInfId);
	  setHeader(map, "PLCN_orgMsgId", orgMsgId);
	  setHeader(map, "PLCN_orgMsgNmId", orgMsgNmId);
	  //deriveGroupingInfoCamt055(exchange);
 }

  if(isPatternPresent(msgType, "PACS.004")) {
  	if(queueId == "MSGHOLDQ" || queueId == "CRPDUPLQ") {
  		if(queueId == "MSGHOLDQ") {
  			queueId = "MSGHOLDQ";
  		}
		if(queueId == "CRPDUPLQ") {
			queueId = "CRPDUPLQ";	
		}  		
  	} else {
  		queueId = "TMPTXVWQ";
  	}
  } 

  flag = memTblGetTableValue(map, "ACE_SECURITY_MAP", "END2END_REQUIRED");
	// if(flag == "YES"){
	// 	keyId = getInternalKeyId()
	// }else {
	// 	keyId = "";
	// }
	
	applicationId = "INTFCORP";
	setHeader(map, "PLCN_aceMessNo", "");
	seqNOId = getHeader(map, "PLCN_seqNOId");
	var aceMessageNo = getHeader(map, "PLCN_aceMessageNo");
	timeStamp = getHeader(map, "PLCN_timeStamp");
	txsMsgNo = getHeader(map, "PLCN_txsMsgNo");
	batchMsgNo = getHeader(map, "PLCN_batchMsgNo");
	matchFlag = getHeader(map, "PLCN_matchFlag");
	exchRateFlag = getHeader(map, "PLCN_exchRateFlag");
	exchRateFlag = getHeader(map, "PLCN_exchRateSetFlag");
	cashInsytAuditFlag = memTblGetTableValue(map, "FLAG-TABLE", "CASH_INSIGHTS_AUDIT_REQ");
	setHeader(map, "PLCN_aceMessageNo", aceMessageNo);
	
	var key1 = "Message inserted from File No <".concat(aceMessageNo);
	var key2 = key1.concat("> and wrote to Queue '");
	var key3 = key2.concat(queueId);
	auditText = key3.concat("'");
	
	var key4 = "Message inserted from Batch No <".concat(batchMsgNo);
	var key5 = key4.concat("> of File No <");
	var key6 = key5.concat(aceMessageNo);
	var key7 = key6.concat("> and wrote to Queue '");
	var key8 = key7.concat(queueId);
	var auditText1 = key8.concat("'");
	
	if(msgType == "PACS.008" || msgType == "PACS.004" || msgType == "CAMT.029" || msgType == "CAMT.056" || msgType == "PACS.002" || msgType == "PACS.003" || msgType == "PACS.007"){
		if(msgScheme == "INST"){
			auditText;
		}else {
			auditText1;
		}
		var val1 = 13;
		var val2 = 10;
		var hexString1;
		var hexString2;

		hexString1 = val1.toString(16);
		val1 = parseInt(hexString1, 16);

		hexString2 = val2.toString(16);
		val2 = parseInt(hexString2, 16);
		var crlf = val1.concat(val2);

		if(cashInsytAuditFlag == "YES"){
			if(exchRateFlag == "N"){
				var key9 = crlf.concat("Exchange Rate not found for the Local Currency");
				auditText = auditText.concat(key9);
			}
		}
	}
	
	var invoicePayService;
	var sourceChannel;
	var msgStmtDebitCreditMark;
	msgStmtDebitCreditMark = getHeader(map, "PLCN_msgStmtDebitCreditMark");
	if(msgStmtDebitCreditMark == "C" || msgStmtDebitCreditMark == "RD" || msgStmtDebitCreditMark == "EC"){
		setHeader(map, "PLCN_reasonCode", "OLA03");
	}
	
	if(msgStmtDebitCreditMark == "C" || msgStmtDebitCreditMark == "RD" || msgStmtDebitCreditMark == "EC"){
		setHeader(map, "PLCN_reasonCode", "OLA08");
	}
	
	SourceChannel = getHeader(map, "PLCN_sourceChannelId");
	invoicePayService = getHeader(map, "PLCN_invoicePayService");
	
	if(isPatternPresent(msgType, "CAMT.055") || isPatternPresent(msgType, "CAMT.029") || isPatternPresent(msgType, "CAMT.056") || isPatternPresent(msgType, "PACS.028")){
		setHeader(map, "PLCN_transStatus", "69");
		setHeader(map, "PLCN_transqueueId", "CMTBLKQ");
		setHeader(map, "PLCN_transqueueId", "CMTCXNTQ");
	}
	if(isPatternPresent(msgType, "CAMT.056")){
		setHeader(map, "PLCN_txnStatus", "66");
		setHeader(map, "PLCN_txnQueueId", "TMPTXVWQ");
		setHeader(map, "PLCN_txnQueueId", "TMPTXVWQ");
		setHeader(map, "PLCN_transqueueId", "CMTCXNTQ");
	}
	
	retVal = ddIntlHashCode(message, exchange);
	
	parallelChannelMode = memTblGetTableValue(map, "FLAG-TABLE", "IN-MEMORY-PARALLEL-CHANNEL");
	inputChannel = memTblGetTableValue(map, "GENERAL", "INPUT_CHANNEL");
	
	//invoicepayStreamVar(exchange);
	var invoicepayServiceNal;
	invoicepayServiceNal = institutionId.concat(".INVOICEPAY.SERVICE_SUBSCRIBED");
	invoicepayServiceNal = memTblGetTableValue(map, "INST_PARAM", invoicepayServiceNal);
	extrnlSysUmr = getHeader(map, "PLCN_extrnlSysUmr");
	
	if(inputChannel == "DB-SDD-RELEASE-IP"){
		
		var systemDate = date();
		var releaseDate = getHeader(map, "PLCN_releaseDate");
    	  logger.info("routeSetChannelTxn: releaseDate = " + releaseDate);

		var custom13 = getHeader(map, "PLCN_newCustom13");
    	  logger.info("routeSetChannelTxn: custom13 = " + custom13);
 
		if(custom13 != "04.1_TRANSACTIONAUTHORIZATIONSERVICE=N"){
			
			if(releaseDate == systemDate || releaseDate < systemDate){
				queueId = "SEPABLKQ";
			}
			if(releaseDate > systemDate){
				queueId = "ERLRTXNQ";
			}
			custom13 = custom13.replace("04.1_TRANSACTIONAUTHORIZATIONSERVICE=Y", "04.1_TRANSACTIONAUTHORIZATIONSERVICE=D");
			setHeader(map, "PLCN_newCustom13", custom13);
		}else {
			queueId = "SEPABLKQ";
		}
		status = "69";
		processingStage = memTblGetTableValue(map, "QUEUE_MAP", queueId);
		setHeader(map, "PLCN_txnStatus", status);
		setHeader(map, "PLCN_txnQueueId", queueId);
		setHeader(map, "PLCN_processingStage", processingStage);
		setHeader(map, "PLCN_outputChannel", "DB-SDD-RELEASE-OUT");
	}
	
	//invoicepayStreamVar(exchange);
	message =  message.trim();
	var message = convertDocumentToString(Document);
	var msgScheme = dataBetweenTokens("<LclInstrm>", "</LclInstrm>", message);
	msgScheme = dataBetweenTokens("<Cd>", "</Cd>", msgScheme);
	setHeader(map, "PLCN_msgScheme", msgScheme);
	
	if(isPatternPresent(msgType, "CAMT.055") || isPatternPresent(msgType, "CAMT.056") || isPatternPresent(msgType, "PACS.028")){
		setHeader(map, "PLCN_txnStatus", "66");
		setHeader(map, "PLCN_txnQueueId", queueId);
		setHeader(map, "PLCN_outputChannel", "DB-TXN-CXLN-OUT");
		if(msgScheme == "INST" && msgDirection == "I"){
			setHeader(map, "PLCN_serviceName", "INSTA");
		}
	}
	if(msgType == "CAMT.029" && mode == "MQ"){
		queueId = "TMPTXVWQ";
		setHeader(map, "PLCN_txnStatus", "66");
		setHeader(map, "PLCN_txnQueueId", queueId);
		setHeader(map, "PLCN_outputChannel", "DB-TXN-CXLN-OUT");
		if(msgScheme == "INST" && msgDirection == "I"){
			setHeader(map, "PLCN_serviceName", "INSTA");
		}
	}	
	if(msgType == "CAMT.029" || msgType == "CAMT.056" || msgType == "PACS.028" || msgType == "PACS.004" || msgType == "CAMT.055" && msgType == "MQ"){
		
		queueId = "TMPTXVWQ";
		setHeader(map, "PLCN_txnProcessId", "TO-MATCH");
		setHeader(map, "PLCN_txnStatus", "66");
		setHeader(map, "PLCN_txnQueueId", queueId);
		setHeader(map, "PLCN_outputChannel", "DB-CAN-TXN-OUT");
		if(msgScheme == "INST" && msgDirection == "I"){
			setHeader(map, "PLCN_serviceName", "INSTA");
		}
	}
	if(msgType == "CAMT.056"){
		var cxlId = dataBetweenTokens("<CxlId>", "</CxlId>", message);
		setHeader(map, "PLCN_transRef", cxlId);
	}
	
	if(msgType == "PACS.004"){
		
		var cxlId = dataBetweenTokens("<RtrId>", "</RtrId>", message);
		setHeader(map, "PLCN_transRef", cxlId);
	}
	if(msgType == "CAMT.029"){
		var txCxlSts = dataBetweenTokens("<txCxlSts>", "</txCxlSts>", message);
		setHeader(map, "PLCN_txCxlSts", txCxlSts);
		var cxlStsId = dataBetweenTokens("<cxlStsId>", "</cxlStsId>", message);
		setHeader(map, "PLCN_cxlStsId", cxlStsId);
	}
	
	if(msgType == "PACS.004" && mode == "MQ"){
		
		pacs004CustomMatchingParameters(exchange);
	}
	
	if(isPatternPresent (msgType, "PACS.003") || (msgType, "PACS.007")){
		pacs03Pacs07CustomMatchingParameters (exchange, msgType)
		txnCommentsMsdb = getHeader(map, "PLCN_comments");
		if(!txnCommentsMsdb){
			txnCommentsMsdb = getHeader(map, "PLCN_txnComments");
		}
		if(txnCommentsMsdb){
			setHeader(map, "PLCN_txnCommentsMsdbComments", txnCommentsMsdb);
		}
	}
	
if(isPatternPresent (msgType, "PACS.002")){
		var status = getHeader(map, "PLCN_txnStatus");
		setHeader(map, "PLCN_statusQual", status);
		var reasonCd = getHeader(map, "PLCN_txnReasonCd");
		setHeader(map, "PLCN_reasonCd", reasonCd);
		
		if(inputChannel == "INMEMIN_SEPAIBFQ-STS-RPT-B2B-IN" || inputChannel == "SEPAIBFQ-STS-RPT-B2B-IN"){
			if(parallelChannelMode == "YES"){
				outChannel = "DB-TXN-STS-RPT-B2B-OUT";
				setHeader(map, "PLCN_outputChannel", outChannel);
				setHeader(map, "PLCN_aceStreamName", outChannel);
				setHeader(map, "PLCN_aceApplicationId", "INTFPPAY");
			}else {
				setHeader(map, "PLCN_outputChannel", "DB-TXN-STS-RPT-B2B-OUT");
				setHeader(map, "PLCN_aceStreamName", "DB-TXN-STS-RPT-B2B-OUT");
				setHeader(map, "PLCN_aceApplicationId", "INTFPPAY");
			}
		}else {
			if(inputChannel == "INMEMIN_SEPAIBFQ-STS-RPT-IN" || inputChannel == "SEPAIBFQ-STS-RPT-IN"){
				setHeader(map, "PLCN_outputChannel", "DB-TXN-STS-RPT-OUT");
				setHeader(map, "PLCN_aceStreamName", "DB-TXN-STS-RPT-OUT");
				setHeader(map, "PLCN_aceApplicationId", "INTFPPAY");
			}
		}
	}	
	
	if(msgType == "PACS.004" && mode != "MQ"){
		
		status = getHeader(map, "PLCN_txnStatus");
		setHeader(map, "PLCN_statusQual", status);
		reasonCd = getHeader(map, "PLCN_txnreasonCd");
		setHeader(map, "PLCN_reasonCd", reasonCd);
		
		if(parallelChannelMode == "YES"){
			
			seqNo = removePattern(inputChannel, "INMEN_SEPAIBFQ-RTR-IN");
			outChannel = "DB-TXN-RTR-OUT-".concat(seqNo);
			setHeader(map, "PLCN_outputChannel", outChannel);
			setHeader(map, "PLCN_aceStreamName", outChannel);
			setHeader(map, "PLCN_aceapplicationId", "INTFPPAY");
		}else {
			setHeader(map, "PLCN_outputChannel", "DB-TXN-RTR-OUT");
			setHeader(map, "PLCN_aceStreamName", "DB-TXN-RTR-OUT");
			setHeader(map, "PLCN_aceapplicationId", "INTFPPAY");
		}
		
		if(msgScheme == "INST" && msgDirection == "I"){
			
			setHeader(map, "PLCN_serviceName", "INSTA");
		}
	}
	var gvAuditAuthCode;
	setHeader(map, "PLCN_applicationId", applicationId);
	setHeader(map, "PLCN_auditString", auditString);
	setHeader(map, "PLCN_auditAuthCode", gvAuditAuthCode);
	setHeader(map, "PLCN_auditText", auditText);
	setHeader(map, "PLCN_keyId", keyId);
	setHeader(map, "PLCN_timeStamp", timeStamp);
	//setHeader(map, "PLCN_txnQId", queueId);
	setHeader(map, "PLCN_txnQueueId", queueId);
	
	setHeader(map, "PLCN_displayFlagBatch", "N");
	setHeader(map, "PLCN_displayFlagMessage", "N");
	displayStagesProd("TRANSACTION", exchange);
	
	processingStage = memTblGetTableValue(map, "QUEUE_MAP", queueId);
	setHeader(map, "PLCN_processingStage", processingStage);
	
	if(msgType == "PACS.008" && inputChannel == "DB-MAIN-SCT-IP-1"){
		
		setHeader(map, "PLCN_outputChannel", "DB-WS-TXN-OUT");
	}
	msgType = msgType.toUpperCase();
	if(msgType == "PACS.004"){
		
		channelSource = memTblGetTableValue(map, "STREAM_DETAILS", "STREAM_DETAILS");
		setHeader(map, "PLCN_channelIdSource", channelSource);
	}
	
	//setHeader(map, "PLCN_txnQId", queueId);
	setHeader(map, "PLCN_txnQueueId", queueId);
	
	if(inputChannel == "SEPAOBFQ-FCT-IN" || inputChannel == "SEPAIBFQ-FCT-IN" && msgType == "PACS.008.001.08" && txnComments == "-8479"){
		
		setHeader(map, "PLCN_txnQueueId", "OFACTMPQ");
		setHeader(map, "PLCN_txnStatus", "69");
	}
	if(msgType == "CAMT.056"){
		txnComments = getHeader(map, "PLCN_comments");
		schedulingFlag = memTblGetTableValue(map, "FLAG-TABLE", "SCHEDULING-FLAG");
		if(!txnComments){
			txnComments = memTblGetTableValue(map, "STREAM_DETAILS", "TXN_COMMENTS");
		}
		if(isPatternPresent(txnComments, "6011") || isPatternPresent(txnComments, "6012") ||isPatternPresent(txnComments, "6013") || isPatternPresent(txnComments, "9500") && isPatternPresent(msgDirection, "I") && isPatternPresent(schedulingFlag, "Y")){
			queueId = "MSGHOLDQ";
			setHeader(map, "PLCN_txnQueueId", queueId);
			setHeader(map, "PLCN_txnStatus", "66");
			setHeader(map, "PLCN_txnComments", txnComments);
			processingStage = memTblGetTableValue(map, "QUEUE_MAP", queueId);
			setHeader(map, "PLCN_processingStage", processingStage);
		}else {
			setHeader(map, "PLCN_txnStatus", "66");
			//setHeader(map, "PLCN_txnQId", "TMPTXVWQ");
			setHeader(map, "PLCN_txnQueueId", "TMPTXVWQ");
			setHeader(map, "PLCN_transQueueId", "CMTCXNTQ");
		}
	}
	
	if(msgType == "CAMT.029"){
		txnComments = getHeader(map, "PLCN_comments");
		schedulingFlag = memTblGetTableValue(map, "FLAG-TABLE", "SCHEDULING-FLAG");
		if(!txnComments){
			txnComments = memTblGetTableValue(map, "STREAM_DETAILS", "TXN_COMMENTS");
		}
		if(isPatternPresent(txnComments, "6011") || isPatternPresent(txnComments, "6012") ||isPatternPresent(txnComments, "6013") || isPatternPresent(txnComments, "9500") && isPatternPresent(msgDirection, "I") && isPatternPresent(schedulingFlag, "Y")){
			queueId = "MSGHOLDQ";
			setHeader(map, "PLCN_txnQueueId", queueId);
			setHeader(map, "PLCN_txnStatus", "69");
			setHeader(map, "PLCN_txnComments", txnComments);
			processingStage = memTblGetTableValue(map, "QUEUE_MAP", queueId);
			setHeader(map, "PLCN_processingStage", processingStage);
		}else {
			setHeader(map, "PLCN_txnStatus", "69");
			//setHeader(map, "PLCN_txnQId", "TMPTXVWQ");
			setHeader(map, "PLCN_txnQueueId", "TMPTXVWQ");
			setHeader(map, "PLCN_transQueueId", "CMTCXNTQ");
		}
	}
	
	if(isPatternPresent(msgType, "CAMT.029") || isPatternPresent(msgType, "CAMT.056") && isPatternPresent(inputChannel, "DB-SEPA-TXN-IN")){
		setHeader(map, "PLCN_outputChannel", "DB-WS-TXN2-OUT");
		setHeader(map, "PLCN_resubmitQueueId", "TMPTXVWQ");
		if(isPatternPresent(getHeader(map, "PLCN_prevQueueId"))== "MSGHOLDQ"){
			setHeader(map, "PLCN_txnQueueId", "TMPTXVWQ");
			setHeader(map, "PLCN_valueDate", (getHeader(map, "PLCN_releaseDate")));
			setHeader(map, "PLCN_earlyDateTxn", (getHeader(map, "PLCN_releaseDate")));
		}
	}
	
	txnComments = memTblGetTableValue(map, "STREAM_DETAILS", "TXN_COMMENTS");
	if(getHeader(map, "PLCN_queueId") != "DUPLWEBQ") {
		if(isPatternPresent(msgType, "CAMT.056") || isPatternPresent(msgType, "CAMT.029") || isPatternPresent(msgType, "PACS.028") || isPatternPresent(msgType, "PACS.004")) {
			if(isPatternPresent(txnComments, "-8") ||isPatternPresent(txnComments, "-5") || isPatternPresent(txnComments, "-3") || isPatternPresent(txnComments, "-4") || isPatternPresent(txnComments, "-15") || isPatternPresent(txnComments, "-7")) {
				setHeader(map, "PLCN_txnQueueId", "TMPCXLWQ");
				setHeader(map, "PLCN_txnStatus", "102");
			}
		}
	}else {
		if(getHeader(map, "PLCN_txnQueueId") == "DUPLWEBQ"){
			setHeader(map, "PLCN_txnQueueId", "DUPLWEBQ");
		}
	}
	if(mode != "WS") {
		if(isPatternPresent(msgType, "PACS.008") && isPatternPresent(inputChannel, "SEPAIBFQ-FCT-IN")) {
			setHeader(map, "PLCN_resubmitQueueId", "SEPATXNQ");
			if(parallelChannelMode == "YES") {
				if(isPatternPresent(inputChannel, "INMEN_SEPAIBFQ-FCT-IN")) {
					seqNo = removePattern(inputChannel, "INMEN_SEPAIBFQ-FCT-IN-");
				}else {
					seqNo = removePattern(inputChannel, "SEPAIBFQ-FCT-IN-");
				}
				outChannel = "DB-TRANSACTION-FCT-OUT".concat(seqNo);
				setHeader(map, "PLCN_outputChannel", outChannel);
			} else {
				setHeader(map, "PLCN_outputChannel", "DB-TRANSACTION-FCT-OUT");
			}
		}
		if(isPatternPresent(msgType, "PACS.008") && isPatternPresent(inputChannel, "SEPAOBFQ-FCT-IN") && msgDirection == "I") {
			setHeader(map, "PLCN_outputChannel", "DB-OBTRANSACTION-FCT-OUT");
		}
	}

	if (isPatternPresent(message, "</FIToFIPmtCxlReq>")) {
		message = dataBetweenTokens("<TxInf>", "</TxInf>", message);
		message = "<TxInf>".concat(message).concat("</TxInf>");
		gvTxnMsg = message
	}

	if(isPatternPresent(message, "</RsltnOfInvstgtn>")) {
		message = dataBetweenTokens("<CxlDtls>", "</CxlDtls>", message);
		message = "<CxlDtls>".concat(message).concat("</CxlDtls>");
		gvTxnMsg = message;
		setHeader(map, "TXN_INFO", gvTxnMsg);
		setHeader(map, "ORG_TXN", gvTxnMsg);
	}

	if(isPatternPresent(message, "</FIToFIPmtCxlReq>")) {
		gvTxnMsg = message;
		instaTxnMsg = message;
		instaTxnMsg = instaTxnMsg.concat("</Document>");
		instaTxnMsg = dataBetweenTokens("<Document>", "</Document>", instaTxnMsg);
		instaTxnMsg = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:camt.056.001.01\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">").concat(instaTxnMsg);
		message = dataBetweenTokens("<TxInf>", "</TxInf>", message);
		message = "<TxInf>".concat(message).concat("</TxInf>");
		ddIntlHashCode(message, exchange);
		authCode3 = getHeader(map, "PLCN_authcode");
		setHeader(map, "AUTHCODE3", authCode3);
		instaTxnMsg = instaTxnMsg.concat("</FIToFIPmtCxlReq>").concat("</Document>");
		setHeader(map, "INSTA_TXN_MSG", instaTxnMsg);
		ddIntlHashCode(instaTxnMsg, exchange);
		authCode3 = getHeader(map, AUTHCODE);
		setHeader(map, "PLCN_authcode3", authCode3);
		instaTxnMsg = dataBetweenTokens("<Document>", "</Document>", instaTxnMsg);
	}

	if(isPatternPresent(message, "</RsltnOfInvstgtn>")) {
		gvTxnMsg = message;
		instaTxnMsg = message;
		instaTxnMsg = instaTxnMsg.concat("</Document>");
		instaTxnMsg = dataBetweenTokens("<Document>", "</Document>", instaTxnMsg);
		institutionId = getHeader(map, "PLCN_institutionId");
		//instaTxnMsg = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:camt.056.001.01\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">").concat(instaTxnMsg);
		rootNode = institutionId.concat(".MESSAGE_PROCESSING.FUNCTIONALITY.ENRICHMENT.XML-XSD_VERSION_CAMT.029.XML-XSD_VERSION_CAMT.029");
		rootNode = memTblGetTableValue(map, "INST_PARAM", rootNode);
		instaTxnMsg = rootNode.concat(instaTxnMsg);
		message = dataBetweenTokens("<TxInfAndSts>", "</TxInfAndSts>", message);
		message = "<TxInfAndSts>".concat(message).concat("</TxInfAndSts>");
		ddIntlHashCode(message, exchange);
		authCode3 = getHeader(map, "PLCN_authcode");
		setHeader(map, "PLCN_authcode3", authCode3);
		instaTxnMsg = instaTxnMsg.concat("</RsltnOfInvstgtn>").concat("</Document>");
		setHeader(map, "INSTA_TXN_MSG", instaTxnMsg);
		ddIntlHashCode(instaTxnMsg, exchange);
		authCode3 = getHeader(map, "PLCN_authcode");
		setHeader(map, "PLCN_authc", authCode3);
		instaTxnMsg = dataBetweenTokens("<Document>", "</Document>", instaTxnMsg);
	}

	if(isPatternPresent(msgType, "CAMT.056") || isPatternPresent(msgType, "CAMT.029")) {
		queueId = "TMPTXVWQ";
		setHeader(map, "PLCN_txnProcessId", "TO-MATCH");
		setHeader(map, "PLCN_channelIdSource", sourceChnlId);
		setHeader(map, "QUEUEID", queueId);
		setHeader(map, "PLCN_txnQueueId", queueId);
		camt055CustomMatchingParameters(msgType, exchange);
		accountCr = getHeader(map, "PLCN_otherAccNo");

		ibanCamt = accountCr;
		if(ibanCamt) {
			bankingChanl = ibanCamt.substr(5,4);
		}
		bankingChanl = memTblGetTableValue(map, "TA_SERVICE", bankingChanl);
		setHeader(map, "PLCN_bankingChanl", bankingChanl);
		if(!bankingChanl) {
			setHeader(map, "PLCN_bankingChanl", "NVB");
		}
	}

	if(isPatternPresent(msgType, "CAMT.056")) {
		queueId = "TMPTXVWQ";
		setHeader(map, "PLCN_txnProcessId", "TO-MATCH");
		var routeChannelId;
		var routeValue;
		var SepaExchPath;
		var sepaExchValue;

		SepaExchPath = institutionId.concat(".PROCESSING_PARAMS.FUNCTIONALITY.OUTPUT_SEPA_INTERFACES.MECHANISM.SEPA_MSG_EXCHANGE");
		sepaExchValue = memTblGetTableValue(map, "INST_PARAM", SepaExchPath);
		routeChannelId = getHeader(map, "PLCN_routeChannelId");
		testMode = memTblGetTableValue(map, "FLAG-TABLE", "API-TESTMODE");
		if(testMode == "NO") {
			routeValue = routeChannelId.concat("-").concat(sepaExchValue);
			routeValue = memTblGetTableValue(map, "ROUTE_BANKCHNL", routeValue);
		}
	}

	var custom13String;
	custom13String = getHeader(map, "PLCN_custom13");

	if(isPatternPresent(msgType, "PACS.003") || isPatternPresent(msgType, "PACS.007")){
		if(parallelChannelMode == "YES"){
			if(isPatternPresent(inputChannel, "INMEMIN_SEPAIBFQ-B2B-SDD-IN-")){
				seqNo = removePattern(inputChannel, "INMEMIN_SEPAIBFQ-B2B-SDD-IN-");
			}else {
				seqNo = removePattern(inputChannel, "SEPAIBFQ-B2B-SDD-IN-")
			}
			 outChannel = "DB-TRANSACTION-FDD-OUT-".concat(seqNo);
			 setHeader(map, "PLCN_outputChannel", outChannel);
		}
		setHeader(map, "PLCN_outputChannel", "DB-TXN-B2B-SDD-OUT");
	}
	
	if(isPatternPresent(msgType.toUpperCase(), "PACS.008") || isPatternPresent(msgType.toUpperCase(), "PACS.004")) {
		channelSource = memTblGetTableValue(map, "STREAM_DETAILS", "CHANNEL_ID_SOURCE");
		setHeader(map, "PLCN_channelIdSource", channelSource);
	}
	var outmessage1;
	var outmessage2;
	var tempAuthCode;
	outmessage1 = getHeader(map, "PLCN_origTxn");
	setHeader(map, "PLCN_origTxn1", outmessage1);
	outmessage2 = getHeader(map, "PLCN_outMessage");
	tempAuthCode = getHeader(map, "PLCN_authCode1");
	logger.info("routeSetChannelTxn rule done.");
}


function ruleXtPacs002Values(exchange) {
	logger.info("In ruleXtPacs002Values");
	
	var inMsg = exchange.getIn();
    var map = inMsg.getHeaders();
    var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	var messageType;
	var txnGroup;
	var value;
	var msgSegr;
	var msgdbId;
	var msgdbId1;
	var endOfFile;
	var totalTrxnsInFile;
	var checker;
	var pacs002Txn
	
	
	pacs002Txn = "IN.ROUTE_MESSAGE";
	setHeader(map, "PACS002_TXN", pacs002Txn);
	messageType = "pacs.002.001.10";
	txnGroup = memTblGetTableValue(map, "MESSAGETYPE", messageType);
	setHeader(map, "PLCN_msgType", messageType);
	// setHeader(map, "MSG_TYPE", messageType);
	// setHeader(map, "MSGTYPE", messageType);
	// setHeader(map, "MSG_TYPE", messageType);
	
	setHeader(map, "PLCN_txnGrp", txnGroup);
	setHeader(map, "PLCN_fileQueueId", "SSRINFQ1");
	
	value = getHeader(map, "PLCN_fileMtchParam");
	setHeader(map, "PLCN_txnMtchParam", value);
	setHeader(map, "PLCN_services", "");
	
	msgdbId = getHeader(map, "PLCN_fileId");
	msgdbId1 = getHeader(map, "PLCN_msgId");
	msgSegr = getHeader(map, "PLCN_msgSegr");
	
	var key1 = "PREV".concat(msgdbId1);
	var key2 = key1.concat("|")
	var key3 = key2.concat("CINF")
	setHeader(map, "PLCN_custom5PrFile", key3);
	
	totalTrxnsInFile = getHeader(map, "PLCN_totalTxnInFile");
	
	if(msgSegr = ""){
		msgSegr = getHeader(map, "PLCN_msgSegr");
		setHeader(map, "PLCN_msgSegr", msgSegr);
	}
	
	var key4 = memTblGetTableValue(map, "FLAG-TABLE", "PACS002_TRANS_REQD");
	if (key4 = "Y"){
		var key5 = getHeader(map, "PLCN_pacs002TransDone"); 
		if (key5 = ""){
			setHeader(map, "PLCN_pacs002TransDone", "Y");
		}
		return "T";
	}
	return "T";
}

function setBankingChannelTA(exchange) {
	logger.info("In setBankingChannelTA");
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
    var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	var bankingChannel;
	var ibanAcc;
	var bankCode;
	var bankChnl;
	var bic;
	
	
	bankingChannel = getHeader(map, "PLCN_bankingChannel");
	setHeader(map, "PLCN_bamkingChannelUpdt", bankingChannel);
	
	if(bankingChannel == "NVB"){
		
		ibanAcc = getHeader(map, "PLCN_customerAccNo");
		bankCode = ibanAcc.substring(5, 4);
		bankChnl = memTblGetTableValue(map, "FLAG-TABLE", bankCode);
		
		if(bankChnl){
			var key1 = "_".concat(bankingChannel);
			bankCode = key1.concat(bankChnl);
			setHeader(map, "PLCN_bamkingChannelUpdt", bankCode);
		}
		
		bic = getHeader(map, "PLCN_rcvrBic");
		bankCode = bic.substring(1, 4);
		bankChnl = memTblGetTableValue(map, "FLAG-TABLE", bankCode);
		
		if(bankChnl){
			var key2 = "_".concat(bankingChannel);
			bankCode = key2.concat(bankChnl);
			setHeader(map, "PLCN_bankingChannelUpdt", bankCode);
		}
	}
	logger.info("setBankingChannelTA rule done.");
}

function camt055CustomMatchingParameters(msgType, exchange){
		logger.info("In camt055CustomMatchingParameters");
		
	var inMsg = exchange.getIn();
    var map = inMsg.getHeaders();
    var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var institutionId;
	var mtchTransRefNo;
	var mtchCurrency;
	var mtchMessageDirection;
	var priorityAmountNum;
	var txnMtchParam;
	var fileTransRefNo;
	var totalAmount;
	var intrBkSttimDt;
	var msgDirection;
	var msgDirection1;
	var mtchAmt;
	var mtchAmt1;
	var fileOrgMsgId;
	var msgModeIn;
	var txnCustom2;
	var msgRefCust2;
	var txnRefCust2;
	
	setHeader(map, "PLCN_txnMtchParam", "");
	mtchCurrency = getHeader(map, "PLCN_mtchCurrency");
	if(!mtchCurrency){
		
		mtchCurrency = getHeader(map, "PLCN_currencyToDb");
	}
	
	priorityAmountNum = getHeader(map, "PLCN_msgPriorityAmountNum");
	
	if(msgType == "CAMT.029"){
		
		priorityAmountNum = getHeader(map, "PLCN_priorityAmountNum1");
	}
	
	if(!priorityAmountNum){
		
		priorityAmountNum = getHeader(map, "PLCN_priorityAmountNum");
	}
	
	institutionId = getHeader(map, "PLCN_institutionId");
	mtchTransRefNo = getHeader(map, "PLCN_mtchTransRefNo");
	msgDirection = getHeader(map, "PLCN_msgDirection");
	txnMtchParam = institutionId + "|" + mtchTransRefNo + "|" + priorityAmountNum + "|" + mtchCurrency + "|" + "I" + "|" + "M" + "|" + "|" + "|" + mtchTransRefNo;
	
	if(msgType == "CAMT.029"){
		
		var msgRefCust2Path = '/Document/RsltnOfInvstgtn/Assgnmt/Id';
		msgRefCust2 = getValueFromPath(Document, msgRefCust2Path);
		logger.info("camt055CustomMatchingParameters: msgRefCust2 =" + msgRefCust2);
		
		var txnRefCust2Path = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/TxInfAndSts';
		txnRefCust2 = getValueFromPath(Document, txnRefCust2Path);
		logger.info("camt055CustomMatchingParameters: txnRefCust2 =" + txnRefCust2);
		
		var fileTransRefNoPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlEndToEndId';
		fileTransRefNo = getValueFromPath(Document, fileTransRefNoPath);
		logger.info("camt055CustomMatchingParameters: fileTransRefNo =" + fileTransRefNo);
		
		var fileOrgMsgIdPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlGrpInf/OrgnlMsgId';
		fileOrgMsgId = getValueFromPath(Document, fileOrgMsgIdPath);
		logger.info("camt055CustomMatchingParameters: fileOrgMsgId =" + fileOrgMsgId);
		
		var mtchTransRefNoPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxId';
		mtchTransRefNo = getValueFromPath(Document, mtchTransRefNoPath);
		logger.info("camt055CustomMatchingParameters: mtchTransRefNo =" + mtchTransRefNo);
		
		var mtchAmtPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt';
		mtchAmt = getValueFromPath(Document, mtchAmtPath);
		logger.info("camt055CustomMatchingParameters: mtchAmt =" + mtchAmt);
		
		mtchAmt = mtchAmt.trim();
		mtchAmt1 = mtchAmt.length();
		priorityAmountNum = mtchAmt.substring(5, mtchAmt1);
		
		if(mtchTransRefNo && fileOrgMsgId){
			
			txnCustom2 = msgRefCust2 + "" + txnRefCust2;
		}
		
		if(priorityAmountNum){
			
			setHeader(map, "PLCN_priorityAmount", priorityAmountNum);
			setHeader(map, "PLCN_priorityAmountNum", priorityAmountNum);
		}
		
		if(!mtchCurrency){
			
			mtchCurrency = getHeader(map, "PLCN_mtchCurrency");
		}
		
		if(mtchTransRefNo && fileOrgMsgId){
			
			mtchTransRefNo = fileOrgMsgId + "" + mtchTransRefNo;
		}
		
		if(!priorityAmountNum){
			
			priorityAmountNum = getHeader(map, "PLCN_priorityAmountNum");
		}
		
		if(!mtchCurrency){
			
			mtchCurrency = getHeader(map, "PLCN_mtchCurrency");
		}
		
		if(msgDirection == "o"){
			
			msgDirection1 == "I";
		}
		
		if(msgDirection == "I"){
			
			msgDirection1 == "o";
		}
		var key1 = "|".concat(mtchTransRefNo);
		var key2 = key1.concat("|");
		var key3 = key2.concat(priorityAmountNum);
		var key4 = key3.concat("|");
		var key5 = key4.concat(mtchCurrency);
		var key6 = key5.concat("|");
		var key7 = key6.concat(msgDirection1);
		txnMtchParam = key7.concat("|M")
	}
	
	if(msgType == "CAMT.056.001.01"){
		
		var msgRefCust2Path = '/Document/FIToFIPmtCxlReq/Assgnmt/Id';
		msgRefCust2 = getValueFromPath(Document, msgRefCust2Path);
		logger.info("camt055CustomMatchingParameters: msgRefCust2 =" + msgRefCust2);
		
		var txnRefCust2Path = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/CxlId';
		txnRefCust2 = getValueFromPath(Document, txnRefCust2Path);
		logger.info("camt055CustomMatchingParameters: txnRefCust2 =" + txnRefCust2);
		
		var fileTransRefNoPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlEndToEndId';
		fileTransRefNo = getValueFromPath(Document, fileTransRefNoPath);
		logger.info("camt055CustomMatchingParameters: fileTransRefNo =" + fileTransRefNo);
		
		var fileOrgMsgIdPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlGrpInf/OrgnlMsgId';
		fileOrgMsgId = getValueFromPath(Document, fileOrgMsgIdPath);
		logger.info("camt055CustomMatchingParameters: fileOrgMsgId =" + fileOrgMsgId);
		
		var mtchTransRefNoPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxId';
		mtchTransRefNo = getValueFromPath(Document, mtchTransRefNoPath);
		logger.info("camt055CustomMatchingParameters: mtchTransRefNo =" + mtchTransRefNo);
		
		var mtchAmtPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/OrgnlIntrBkSttlmAmt';
		mtchAmt = getValueFromPath(Document, mtchAmtPath);
		logger.info("camt055CustomMatchingParameters: mtchAmt =" + mtchAmt);
		
		mtchAmt = mtchAmt.trim();
		mtchAmt1 = mtchAmt.length();
		priorityAmountNum = mtchAmt.substring(5, mtchAmt1);
		
		if(mtchTransRefNo && fileOrgMsgId){
			
			txnCustom2 = msgRefCust2 + "" + txnRefCust2;
		}
		
		if(!mtchCurrency){
			
			mtchCurrency = getHeader(map, "PLCN_mtchCurrency");
		}
		
		if(priorityAmountNum){
			
			setHeader(map, "PLCN_priorityAmount", priorityAmountNum);
			setHeader(map, "PLCN_priorityAmountNum", priorityAmountNum);
		}
		
		if(!mtchTransRefNo){
			
			mtchTransRefNo = getHeader(map, "PLCN_orgnlTxId");
		}
		
		if(mtchTransRefNo && fileOrgMsgId){
			
			mtchTransRefNo = fileOrgMsgId + "" + mtchTransRefNo;
		}
		
		if(!priorityAmountNum){
			
			priorityAmountNum = getHeader(map, "PLCN_orgnlIntrbkSttimAmt");
		}
		
		if(!mtchCurrency){
			
			mtchCurrency = getHeader(map, "PLCN_mtchCurrency");
		}
		
		if(!mtchCurrency || mtchCurrency == "XXX"){
			
			var mtchCurrencyPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlIntrBkSttlmAmt/Ccy';
		    mtchCurrency = getValueFromPath(Document, mtchCurrencyPath);
			logger.info("camt055CustomMatchingParameters: mtchCurrency =" + mtchCurrency);
		}
		
		var key8 = "|".concat(mtchTransRefNo);
		var key9 = key8.concat("|");
		var key10 = key9.concat(priorityAmountNum);
		var key11 = key10.concat("|");
		var key12 = key11.concat(mtchCurrency);
		var key13 = key12.concat("|");
		var key14 = key13.concat(msgDirection);
		txnMtchParam = key14.concat("|M")
	}
	
	setHeader(map, "PLCN_txnMtchParam", txnMtchParam);
	setHeader(map, "PLCN_txnCustom2", txnCustom2);
	
	return;
}

function ruleGenerateKbJs2(exchange){
	logger.info("In ruleGenerateKbJs2 rule.");
	
	var inMsg;
	var map;
	var readMsgdb;
   	var Document;

    var institutionId;
    var systemDateCurrent;
    var productCode;
    var gvInsttblFlag;
    var gvSystemDate;
    var gvRefPpayFlag;
    var gvMsgInpath;
    var gvMsgOutpath;
    var gvSysDate;
    var msgModeIn;
    var mode;
    var msgType;
    var beneficiaryAccountFlag;
    var msgDirection;
    var msgClassType;
    var flag;
    var currencyPath;
    var mtchCurrency;
    var amtPath;
    var priorityAmountNum1;
    var mtchMessageDirection;
    var mtchOrgnlMsgId;
    var mtchOrgnlMsgIdPath;
    var chnlIdSrce;
    var sender;
    var receiver;
    var senderBankBic;
	var productCode;

    var gvCommentsForBlob6;
    var gvTxnErrorFlag;
	gvSysDate = getDate();
	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	institutionId = getHeader (map,"PLCN_institutionId");
	logger.info("ruleGenerateKbJs_2: institutionId = " + institutionId);
	/* institutionId = readMsgdb.get("PLCN_institutionId");
	(if institutionId == "null"){
		institutionId = readMsgdb.get("INSTITUTION_ID");
	} */
	/* logger.info("ruleGenerateKbJs_2: institutionId = " + institutionId);
	setHeader(map, "PLCN_institutionId", institutionId); */
  
	senderBankBic = institutionId + "." + "MANUAL_DATA_ENTRY.GEN_PARAMS.FIN_MESSAGES" + "." + "senderBankBic";
	senderBankBic = memTblGetTableValue(map, "INST_PARAM", senderBankBic);
	logger.info("ruleGenerateKbJs_2: senderBankBic = " + senderBankBic);
  
	msgDirection = getHeader (map,"PLCN_msgDirection");
	logger.info("ruleGenerateKbJs_2: msgDirection = " + msgDirection);
	
	msgClassType = getHeader (map,"PLCN_msgType");
	logger.info("ruleGenerateKbJs_2: msgClassType = " + msgClassType);
	/* if(!msgClassType){
		msgClassType = readMsgdb.get("MSGTYPE");
	} */
	/* logger.info("ruleGenerateKbJs_2: msgClassType = " + msgClassType);
	setHeader(map, "PLCN_msgType", msgClassType); */
	
	if (msgDirection == "O" && (msgClassType.substr(0, 4) == "pacs" || msgClassType.substr(0, 4) == "PACS") && flag == "Y"){
		bicDerivationPacsInbound(Document, map);
	}
	
	if (msgDirection == "I" && (msgClassType.substr(0, 4) == "pacs" || msgClassType.substr(0, 4) == "PACS") && flag == "Y"){
		bicDerivationPacsOutbound(Document, map);
	}
	
	mode = getHeader (map,"PLCN_manualMode");
	if(mode == "REPAIR"){
		if(!gvRefPpayFlag){
			systemDateCurrent = getDate(); 
			if(systemDateCurrent > gvSysDate){
				//gvInsttblFlag = (SET-OF-REF-MEMTBL-RULES-CORP INSTITUTIONID);
				gvSysDate = getDate();
				logger.info("ruleGenerateKbJs_2: gvSysDate = " + gvSysDate);
			}
		}
		else{
			if(!gvRefPpayFlag){
				if(!gvInsttblFlag){
					//gvInsttblFlag = (SET-OF-REF-MEMTBL-RULES-CORP INSTITUTIONID);
					gvSysDate = getDate();
					logger.info("ruleGenerateKbJs_2: gvSysDate = " + gvSysDate);
				}
				else{
					systemDateCurrent = getDate(); 
					if(systemDateCurrent > gvSysDate){
						//gvInsttblFlag = (SET-OF-REF-MEMTBL-RULES-CORP INSTITUTIONID);
						gvSysDate = getDate();
						logger.info("ruleGenerateKbJs_2: gvSysDate = " + gvSysDate);
					}
				}
			}
		}
	}
	//c2bInitialValStreamvar(Document, map);
	getOlapDefualtValues1(exchange);
	//b2cInitialValStreamvar(Document, map);
	c2bExtractVarInRouteNode(exchange);
	b2bExtractVarInRouteNode(exchange); //it is for p4 and p2
	
	setHeader(map, "PLCN_processingStage", "");
	chnlIdSrce = getHeader (map,"PLCN_channelIdSource");
	logger.info("ruleGenerateKbJs_2: chnlIdSrce = " + chnlIdSrce);
	setHeader(map, "PLCN_sepaChannelSourceId", chnlIdSrce);
	productCode = getHeader (map,"PLCN_productCode");
	logger.info("ruleGenerateKbJs_2: productCode = " + productCode);
	
	if(!productCode || productCode == "NOTAPPLICABLE" || mode == "WS"){
		var serviceType = getHeader (map,"PLCN_serviceType");
		logger.info("ruleGenerateKbJs_2: serviceType = " + serviceType);
		var messageMode = getHeader (map,"PLCN_QM");
		logger.info("ruleGenerateKbJs_2: messageMode = " + messageMode);
		
		if((chnlIdSrce == "SEPA_MQ_INSTA_OB-3" || chnlIdSrce == "SEPA_MQ_INSTA_OB-2" || chnlIdSrce == "SEPA_MQ_INSTA_OB-1" || chnlIdSrce == "SEPA_MQ_INSTA_OB-4" || chnlIdSrce == "RRO_MQ_INSTA_OB-1" || chnlIdSrce == "RRO_MQ_INSTA_OB-2" || chnlIdSrce == "RRO_MQ_INSTA_OB-3" || chnlIdSrce == "RRO_MQ_INSTA_OB-4") && !messageMode){
			setHeader(map, "PLCN_QM", "MQ");
			memTblSetTableValue(map,"FLAG-TABLE", "QM", "MQ");
		}
		if((chnlIdSrce == "SEPA_ENI_OB" || chnlIdSrce == "SEPA_ENI_IN" || chnlIdSrce == "SEPA-REQ-IB" || chnlIdSrce == "SEPA-REQ-OB") && !messageMode){
			setHeader(map, "PLCN_QM", "FILE");
			memTblSetTableValue(map,"FLAG-TABLE", "QM", "FILE");
		}
		if(serviceType != "REPAIR" && messageMode != "WS"){
			productCode = drveProductCode(exchange);
			setHeader(map,"PLCN_derivedProduct",productCode);
		}
		else{
			setHeader(map, "PLCN_derivedProduct", "DEFAULT");
		}
	}
	if(mode == "REPAIR" && (productCode == "NOTAPPLICABLE" || !productCode)){
		msgType = getHeader (map,"PLCN_msgType");
		logger.info("ruleGenerateKbJs_2: msgType = " + msgType);
		productCode = drveProductCode(exchange);
		drveNibcCustomChannels(map,Document, productCode) ; 
	}
	deriveServiceConfigured(exchange);
	//deriveProductCodeValues(Document, map); //priyanka
	var param5 = getHeader (map,"PLCN_param5");
	logger.info("ruleGenerateKbJs_2: param5 = " + param5);
	productCode = getHeader (map,"PLCN_productCode");
	logger.info("ruleGenerateKbJs_2: productCode = " + productCode);
	var param6 = memTblGetTableValue(map, "PRODUCT_FLAVOR", "PROCESSING_LEVEL");
	if(!(!param5 && productCode == "MANUAL_B2B_SCT") && param6 == "FILE"){
		//deriveProductCodeValuesFilelvl(map,Document,param5);
	}
	logger.info("ruleGenerateKbJs_2: msgClassType = " + msgClassType);
	
	if(msgClassType == "camt.056.001.08"){
		logger.info("ruleGenerateKbJs_2: msgClassType = camt.056.001.08");
		var date2Path = 'Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlIntrBkSttlmDt';
		var date2 = getValueFromPath(Document, date2Path);
		logger.info('ruleGenerateKbJs2: date2 = ' + date2);
		extractValueDateC2b(exchange,date2);
		currencyPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlIntrBkSttlmAmt/@Ccy';
		mtchCurrency = getValueFromPath(Document, currencyPath);
		setHeader(map, "ACEDB_mtchCurrency", mtchCurrency);
		mtchOrgnlMsgIdPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlGrpInf/OrgnlMsgId';
		mtchOrgnlMsgId = getValueFromPath(Document, mtchOrgnlMsgIdPath);
		setHeader(map, "PLCN_mtchOrgnlMsgId", mtchOrgnlMsgId);
		amtPath = '/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlIntrBkSttlmAmt/@Ccy';
		priorityAmountNum1 = getValueFromPath(Document, amtPath);
		setHeader(map, "PLCN_priorityAmount", priorityAmountNum1);
		setHeader(map, "PLCN_priorityAmount1", priorityAmountNum1);
		var senderPath = '/Document/FIToFIPmtCxlReq/Assgnmt/Assgnr/Agt/FinInstnId/BIC';
		sender = getValueFromPath(Document, senderPath);
		var receiverPath = '/Document/FIToFIPmtCxlReq/Assgnmt/Assgne/Agt/FinInstnId/BIC';
		receiver = getValueFromPath(Document, receiverPath);
		setHeader(map, "PLCN_correspondent", sender);
		setHeader(map, "PLCN_rcvrBic", receiver);
	}
	if(msgClassType == "camt.029.001.09"){
		logger.info("ruleGenerateKbJs_2: msgClassType = camt.029.001.09");
		var datePath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/IntrBkSttlmDt';
		var date1 = getValueFromPath(Document, datePath);
		logger.info('ruleGenerateKbJs2: date1 = ' + date1);
		extractValueDateC2b(exchange,date1);
		currencyPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt/@Ccy';
		mtchCurrency = getValueFromPath(Document, currencyPath);
		logger.info('ruleGenerateKbJs2: mtchCurrency = ' + mtchCurrency);
		setHeader(map, "ACEDB_mtchCurrency", mtchCurrency);
		mtchOrgnlMsgIdPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlGrpInf/OrgnlMsgId';
		mtchOrgnlMsgId = getValueFromPath(Document, mtchOrgnlMsgIdPath);
		setHeader(map, "PLCN_mtchOrgnlMsgId", mtchOrgnlMsgId);
		mtchOrgnlTxIdPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlGrpInf/OrgnlTxId';
		mtchOrgnlTxId = getValueFromPath(Document, mtchOrgnlTxIdPath);
		setHeader(map, "PLCN_mtchOrgnlTxId", mtchOrgnlTxId);
		amtPath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt/@Ccy';
		priorityAmountNum1 = getValueFromPath(Document, amtPath);
		setHeader(map, "PLCN_priorityAmount", priorityAmountNum1);
		setHeader(map, "PLCN_priorityAmount1", priorityAmountNum1);
		var senderPath = '/Document/RsltnOfInvstgtn/Assgnmt/Assgnr/Agt/FinInstnId/BIC';
		sender = getValueFromPath(Document, senderPath);
		var receiverPath = '/Document/RsltnOfInvstgtn/Assgnmt/Assgne/Agt/FinInstnId/BIC';
		receiver = getValueFromPath(Document, receiverPath);
		setHeader(map, "PLCN_correspondent", sender);
		setHeader(map, "PLCN_rcvrBic", receiver);
		if(msgDirection == "O"){
			mtchMessageDirection == "I";
			setHeader(map, "PLCN_mtchMessageDirection", mtchMessageDirection);
		}
	}
	
	if(msgClassType == "pacs.003.001.08"){
		logger.info("ruleGenerateKbJs_2: msgClassType = pacs.003.001.08");
		var date2Path = 'Document/FIToFICstmrDrctDbt/GrpHdr/IntrBkSttlmDt';
		var date2 = getValueFromPath(Document, date2Path);
		logger.info('ruleGenerateKbJs2: date2 = ' + date2);
		extractValueDateC2b(exchange,date2);
		currencyPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/IntrBkSttlmAmt/@Ccy';
		mtchCurrency = getValueFromPath(Document, currencyPath);
		setHeader(map, "ACEDB_mtchCurrency", mtchCurrency);
		amtPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/IntrBkSttlmAmt';
		priorityAmountNum1 = getValueFromPath(Document, amtPath);
		setHeader(map, "PLCN_priorityAmount", priorityAmountNum1);
		setHeader(map, "PLCN_priorityAmountNum", priorityAmountNum1);
		var senderPath = 'Document/FIToFICstmrDrctDbt/GrpHdr/InstgAgt/FinInstnId/BIC';
		sender = getValueFromPath(Document, senderPath);
		var receiverPath = 'Document/FIToFICstmrDrctDbt/GrpHdr/InstdAgt/FinInstnId/BIC';
		receiver = getValueFromPath(Document, receiverPath);
		setHeader(map, "PLCN_correspondent", sender);
		setHeader(map, "PLCN_rcvrBic", receiver);
	}
	
	if(msgClassType == "pacs.007.001.09"){
		logger.info("ruleGenerateKbJs_2: msgClassType = pacs007.001.09");
		var date2Path = 'Document/FIToFIPmtRvsl/GrpHdr/IntrBkSttlmDt';
		var date2 = getValueFromPath(Document, date2Path);
		logger.info('ruleGenerateKbJs2: date2 = ' + date2);
		extractValueDateC2b(exchange,date2);
		currencyPath = '/Document/FIToFIPmtRvsl/TxInf/RvsdIntrBkSttlmAmt/@Ccy';
		mtchCurrency = getValueFromPath(Document, currencyPath);
		setHeader(map, "ACEDB_mtchCurrency", mtchCurrency);
		amtPath = '/Document/FIToFIPmtRvsl/TxInf/RvsdIntrBkSttlmAmt';
		priorityAmountNum1 = getValueFromPath(Document, amtPath);
		setHeader(map, "PLCN_priorityAmount", priorityAmountNum1);
		setHeader(map, "PLCN_priorityAmountNum", priorityAmountNum1);
	}
	
	var msgType = getHeader(map, "PLCN_msgType")
	logger.info("ruleGenerateKbJs2: msgType = " + msgType);
	drveNibcConfigurations(Document, map, msgType);

	setHeader(map, "PLCN_noOfTxn", "1");
	//hsMappingRule(Document, map);
	beneficiaryAccountFlag = memTblGetTableValue(map, "FLAG-TABLE", "BENEFICIARY_ACCOUNT_FLAG");
	logger.info("ruleGenerateKbJs_2: beneficiaryAccountFlag = " + beneficiaryAccountFlag);
	if(beneficiaryAccountFlag == "Y" && msgDirection == "O"){
		beneficiaryAccountNumbersApply(Document, map);
	}
	msgModeIn = getHeader (map,"PLCN_msgModeIn");
	logger.info("ruleGenerateKbJs_2: msgModeIn = " + msgModeIn);
	if(msgModeIn == "MANUAL"){
		displayStagesProd("TRANSACTION", exchange);
		deriveConfiguredAuthPrinciple(msgPath, exchange);
		deriveQueueidMultitenant(exchange);
	}
	logger.info("ruleGenerateKbJs2 rule done.");
	return "T";
}

function c2bExtractVarInRouteNode(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;

	logger.info("In c2bExtractVarInRouteNode");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	//readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var msgType;
	var ret;
	var msgDirection;
	var msgOut = convertDocumentToString(Document);
	
	msgType = getHeader (map,"PLCN_msgType");
	logger.info("ruleGenerateKbJs_2: msgType = " + msgType);

	if(!msgType){
		msgType = getMessageType(exchange);
		msgType = msgType.toLowerCase();
		logger.info("ruleGenerateKbSepa: msgType from getMessageType = " + msgType);		
	}
	if(msgType == "WCUST"){
		if(isPatternPresent(message, "<FIToFICstmrCdtTrf>")){
			msgType = "pacs.008.001.08";
		}
		if(isPatternPresent(message, "<CstmrCdtTrfInitn>")){
			msgType = "pain.001.001.03";
		}
	}
	//setHeader(map, "PLCN_msgType", msgType);
	setHeader(map, "PLCN_msgFamily", "SEPA");
	msgDirection = getHeader (map,"PLCN_msgDirection");
	logger.info("ruleGenerateKbJs_2: msgDirection = " + msgDirection);

	if(isPatternPresent(msgType, "pacs.008")){
		b2bPacs008ExtractVar(exchange);
	}
	if(isPatternPresent(msgType, "pacs.008") || isPatternPresent(msgType, "pacs.003")){
		ret = extBankProfileFromAccmaster(exchange);
	}
}

function b2bPacs008ExtractVar(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;

	logger.info("In b2bPacs008ExtractVar");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	//readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var message = convertDocumentToString(Document);
	
	var msgType;
	var msgDirection;
	var msgId;
	var instrId;
	var date;
	var amount1;
	var amount2;
	var currency1;
	var currency2;
	var endToEnd;
	var flType;
	var destCc;
	var destCntryCode;
	var finBic;
	var finBicCmb;
	var grpBtchbk;
	var curAmt;
	var dbtAmt;
	var dbtOrgIdBic;
	var crdtTrfEoeId;
	var cdtrAgtBic;
	var cdtrName;
	var cdtrOrgIdBic;
	var grpMsgId;
	var pmtInfExecDate;
	var crrAmtEqvtAmt;
	var crdtInstrId;
	var currEqvtAmt;
	var dbtPmtIdEoeId;
	var accNum;
	var accNum1;
	var detailsName;
	var uId;
	var btchCtrlSum;
	var pmtInfId;
	var noOfTxn;
	var mesg;
	var origTxn;
	var lclInstrm;
	var fileAmount;
	var btchBooking;
	var btchAmt;
	var btchAmtNum;
	var fileAmt;
	var fileAmtNum;
	var benBankName;
	var benAddr1;
	var benAddr2;
	var benAddr3;
	var benAddr4;
	var payerName;
	var payerName1;
	var payerName2;
	var payerName3;
	var mode;
	var tempValue;
	var authCode1;
	var mesgNo;
	var msgModeIn;
	var dbtrAgnt;
	
	origTxn = getHeader (map,"PLCN_origTxn");
	//logger.trace("b2bPacs008ExtractVar: origTxn = " + origTxn);
	var sepaTranslationReqdFlag = memTblGetTableValue(map,"FLAG-TABLE", "SEPA_B2B_TRANSLATION_REQD");
	logger.info("b2bPacs008ExtractVar: sepaTranslationReqdFlag = " + sepaTranslationReqdFlag);
	if(sepaTranslationReqdFlag == "Y"){
		/* origTxn = getHeader (map,"PLCN_origTxn"); */
		fileAmtNum = getHeader (map,"PLCN_ttlIntrBnkStlmtAmt");
		logger.info("b2bPacs008ExtractVar: fileAmtNum = " + fileAmtNum);
		fileAmt = getHeader (map,"PLCN_priorityAmount");
		logger.info("b2bPacs008ExtractVar: fileAmt = " + fileAmt);
		btchAmt = getHeader (map,"PLCN_batchAmt");
		logger.info("b2bPacs008ExtractVar: btchAmt = " + btchAmt);
		btchAmtNum = getHeader (map,"PLCN_btchAmtNum");
		logger.info("b2bPacs008ExtractVar: btchAmtNum = " + btchAmtNum);
		setHeader(map,"PLCN_btchBooking","TRUE");
		if(!btchAmtNum){
			btchAmtNum = getHeader(map,"PLCN_totalAmountOfBatch");
			logger.info("b2bPacs008ExtractVar: btchAmtNum = " + btchAmtNum);
			if(isPatternPresent(btchAmtNum, ".")){
				btchAmt = btchAmtNum.replace(".",",");
			}
			pmtInfId = getHeader(map,"PLCN_pmyInfId");
			logger.info("b2bPacs008ExtractVar: pmtInfId = " + pmtInfId);
		}
	}
	setHeader(map,"PLCN_msgType","pacs.008.001.08");
	msgDirection =  getHeader (map,"PLCN_msgDirection");
	logger.info("b2bPacs008ExtractVar: msgDirection = " + msgDirection);
	var txnType;
	if(msgDirection == "I"){
		txnType = "D";
	}
	else{
		txnType = "C";
	}
	setHeader(map,"PLCN_txnType",txnType);
	msgType = "pacs.008.001.08";
	/* if(!(isPatternPresent(message,"</FIToFICstmrCdtTrf>")) && !(isPatternPresent(message,"</Document>"))){
		message = 
	} */
	if(isPatternPresent(message, "FIToFICstmrCdtTrf") && !origTxn){
		message = dataBetweenTokens("<CdtTrfTxInf>", "</CdtTrfTxInf>", message);
		message = "<CdtTrfTxInf>" + message + "</CdtTrfTxInf>";
		origTxn = message;
		//logger.trace("b2bPacs008ExtractVar: origTxn = " + origTxn);
	}
	setHeader(map,"PLCN_origTxn",origTxn);
	msgId = cleanString(msgId);
	var eba_Pacs008Flag = memTblGetTableValue(map,"FLAG-TABLE", "EBA_PACS008_FLAG");
	if(eba_Pacs008Flag == "Y" && msgId){
		msgId = msgId.replace(" ","");
	}
	setHeader(map,"PLCN_grpMsgId",msgId);
	setHeader(map,"PLCN_fileRefNum",msgId);
	if(!pmtInfId){
		pmtInfId = msgId;
		logger.info("b2bPacs008ExtractVar: pmtInfId = " + pmtInfId);
	}
	setHeader(map, "PLCN_pmtInfId", msgId);
	if(!fileAmtNum){
		var fileAmtNumPath = '/Document/FIToFICstmrCdtTrf/GrpHdr/CtrlSum';
		fileAmtNum = getValueFromPath(Document, fileAmtNumPath);
	}
	if(!fileAmtNum){
		var fileAmtNum2Path = '/Document/FIToFICstmrCdtTrf/GrpHdr/TtlIntrBkSttlmAmt/@ccy';
		fileAmtNum = getValueFromPath(Document, fileAmtNum2Path);
	}
	if(fileAmtNum){
		fileAmtNum = fileAmtNum.replace(".",",");
	}
	var msgScheme = memTblGetTableValue(map,"STREAM-TABLE_MAP", "MSG_SCHEME");
	if(msgScheme == "INST"){
		setHeader(map,"PLCN_fileAmt","");
		setHeader(map,"PLCN_fileAmtNum","");
	}else{
		setHeader(map,"PLCN_fileAmt",fileAmt);
		setHeader(map,"PLCN_fileAmtNum",fileAmtNum);
	}
	if(!btchAmt){
		btchAmt = fileAmt;
		btchAmtNum = fileAmtNum;
	}
	setHeader(map,"PLCN_btchAmt",btchAmt);
	setHeader(map,"PLCN_btchAmtNum",btchAmtNum);
	var lclInstrmPath = '/Document/FIToFICstmrCdtTrf/GrpHdr/PmtTpInf/LclInstrm/Cd';
	lclInstrm = getValueFromPath(Document, lclInstrmPath);
	if(!lclInstrm){
		var lclInstrmPath2 = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtTpInf/LclInstrm/Cd';
		lclInstrm = getValueFromPath(Document, lclInstrmPath2);
	}
	setHeader(map,"PLCN_lclInstCd",lclInstrm);
	var datepath = '/Document/FIToFICstmrCdtTrf/GrpHdr/IntrBkSttlmDt';
	date = getValueFromPath(Document, datepath);
	if(!date){
		var datePath2 = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmDt';
		date = getValueFromPath(Document, datePath2);
	}
	extractValueDateC2b(exchange,date); // new rule
	
	var amount1Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt/@ccy';
	amount1 = getValueFromPath(Document, amount1Path);
	var amont2 = "";
	extractAmount(exchange,amount1,amont2); // new rule
	
	var currency1Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt/@ccy';
	currency1 = getValueFromPath(Document, currency1Path);
	setHeader(map,"PLCN_currency",currency1);
	setHeader(map,"PLCN_mtchCurrency",currency1);
	 
	var endToEndPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/TxId';
	endToEnd = getValueFromPath(Document, endToEndPath);
	endToEnd = cleanString(endToEnd);
	setHeader(map,"PLCN_custom3",endToEnd);
	setHeader(map,"PLCN_tranRefNo",endToEnd);
	if(msgId) {
		var key1 = msgId.concat("");
		var txnCustom2 = key1.concat(endToEnd);
	}
	
	setHeader(map,"PLCN_txnCustom2",txnCustom2);
	setHeader(map,"PLCN_custom2Trans",txnCustom2);
	setHeader(map,"PLCN_custom2",txnCustom2);
	
	//(EXTRACT_PACS_SNDR_RCVR_DETAILS MESG MSG_DIRECTION MSGTYPE) //new rule
	//EXTRACT_PACS_SNDR_RCVR_DETAILS(exchange);
	var accountCr = getHeader(map,"PLCN_accountNum");
	var accountDr = getHeader(map,"PLCN_accountNumber");
	
	/* (IF(IsGreaterthan (COMPGETACTUALSEQNOIFEXISTS (STRING "IN.ROUTE_MESSAGE.CdtTrfTxInf[0].RmtInf[0].Ustrd[0]")) -1)
    THEN
     (ASSIGN UID "IN.ROUTE_MESSAGE.CdtTrfTxInf[0].RmtInf[0].Ustrd[0].Ustrd")
    )
	(ASSIGN UID (REPLACESPECIALCHARTOXML UID))
	(SETVALUETOHEADER GV_MSG_OUTPATH "STREAM_DETAILS" "UID" UID) */
	var instrIdPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/InstrId';
	instrId = getValueFromPath(Document, instrIdPath);
	
	var grpBtchbkPath = '/Document/FIToFICstmrCdtTrf/GrpHdr/BtchBookg';
	grpBtchbk = getValueFromPath(Document, grpBtchbkPath);
	
	btchBooking = getHeader(map,"PLCN_btchBooking");
	if(btchBooking){
		setHeader(map,"PLCN_btchBooking",btchBooking);
	}
	else{
		setHeader(map,"PLCN_btchBooking",grpBtchbk);
	}
	
	setHeader(map,"PLCN_priorityDate",date);
	
	mode = getHeader(map,"PLCN_qm");
	btchAmtNum = getHeader(map,"PLCN_btchAmtNum");
	if(mode){
		if(mode == "WS"){
			setHeader(map,"PLCN_totalAmountOfBatch",btchAmtNum);
			setHeader(map,"PLCN_toatalTrxnsInBatch","1");
			setHeader(map,"PLCN_batchSequence","");
			setHeader(map,"PLCN_batchCommentsMsdbComments","");
		}
	}
	
	var benBankNamePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Nm';
	benBankNameName = getValueFromPath(Document, benBankNamePath);
	
	var benAddr1Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/AdrLine';
	benAddr1 = getValueFromPath(Document, benAddr1Path);
	
	var benAddr2Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/AdrLine[0]';
	benAddr2 = getValueFromPath(Document, benAddr2Path);
	
	var benAddr3Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/AdrLine[1]';
	benAddr3 = getValueFromPath(Document, benAddr3Path);
	
	var benAddr4Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/AdrLine[2]';
	benAddr4 = getValueFromPath(Document, benAddr4Path);
	
	var payerNamePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Nm';
	payerName = getValueFromPath(Document, payerNamePath);
	
	var payerAddr1Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/AdrLine[0]';
	payerAddr1 = getValueFromPath(Document, payerAddr1Path);
	
	var payerAddr2Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/AdrLine[1]';
	payerAddr2 = getValueFromPath(Document, payerAddr2Path);
	
	var payerAddr3Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/AdrLine[2]';
	payerAddr3 = getValueFromPath(Document, payerAddr3Path);
	
	/* (ASSIGN PAYERNAME (REPLACESPECIALCHARTOXML PAYERNAME))
    (ASSIGN PAYERADDR1 (REPLACESPECIALCHARTOXML PAYERADDR1))
	(ASSIGN PAYERADDR2 (REPLACESPECIALCHARTOXML PAYERADDR2))
	(ASSIGN PAYERADDR3 (REPLACESPECIALCHARTOXML PAYERADDR3)) */
	
	setHeader(map,"PLCN_benbankName",benBankName);
	setHeader(map,"PLCN_benAddr1",benAddr1);
	setHeader(map,"PLCN_benAddr2",benAddr2);
	setHeader(map,"PLCN_benAddr3",benAddr3);
	setHeader(map,"PLCN_benAddr4",benAddr4);
	
	setHeader(map,"PLCN_payerName",payerName);
	setHeader(map,"PLCN_payerAddr1",payerAddr1);
	setHeader(map,"PLCN_payerAddr2",payerAddr2);
	setHeader(map,"PLCN_payerAddr3",payerAddr3);
	
	// if(msgDirection == "O"){
	// 	setHeader(map,"PLCN_acctNumber",accountDr);
	// 	setHeader(map,"PLCN_accountcr",accountCr);
	// 	setHeader(map,"PLCN_accountcr",accountCr);
	// 	setHeader(map,"PLCN_accountNumber",accountDr);
	// 	setHeader(map,"PLCN_accountdr",accountDr);
	// }else{
	// 	setHeader(map,"PLCN_acctNumber",accountDr);
	// 	setHeader(map,"PLCN_accountcr",accountCr);
	// 	setHeader(map,"PLCN_accountNum",accountCr);
	// 	setHeader(map,"PLCN_accountNumber",accountDr);
	// 	setHeader(map,"PLCN_accountdr",accountDr);
	// }
	
	flType = getHeader(map,"PLCN_fileType");
	if(flType){
		if(flType == "EU-SCT-IN"){
			setHeader(map,"FILE_REF_NUM",flType);
		}
	}
	
	if(!msgScheme == "INST"){
		drveNibcConfigurations(Document, map,msgType)
	}
	return "T";
}

function bicDerivationPacsInbound(Document, map) {
	var retVal = 0;
	var message;
	var bic;
	var temp;
	var institutionIdCheck;
	
	message = convertDocumentToString(Document);
	logger.info("bic_Derivation_Pacs_Inbound");

	if(isPatternPresent(message, "<InstdAgt>")){
		temp = dataBetweenTokens("<InstdAgt>", "</InstdAgt>", message);
		bic = dataBetweenTokens("<BIC>", "</BIC>", temp);
		institutionIdCheck = memTblGetTableValue(map, "INSTITUTIONMASTER", bic);
		if(institutionIdCheck){
			setHeader(map, "PLCN_institutionId1", bic);
		}
	}
}

function bicDerivationPacsOutbound(Document, map) {
	var retVal = 0;
	var message;
	var bic;
	var temp;
	var institutionIdCheck;
	
	message = convertDocumentToString(Document);
	logger.info("bic_Derivation_Pacs_Outbound");

	if(isPatternPresent(message, "<InstgAgt>")){
		temp = dataBetweenTokens("<InstgAgt>", "</InstgAgt>", message);
		bic = dataBetweenTokens("<BIC>", "</BIC>", temp);
		institutionIdCheck = memTblGetTableValue(map, "INSTITUTIONMASTER", bic);
		if(institutionIdCheck){
			setHeader(map, "PLCN_institutionId1", bic);
		}
	}
}

/* function c2bInitialValStreamvar(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;
	var file_ref_num;

	logger.info("In c2bInitialValStreamvar");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	setHeader(map, "PLCN_ctryCode", "");
	setHeader(map, "PLCN_currency", "");
	setHeader(map, "PLCN_amountNum", "");
	var priorityAmount = getHeader (map,"PLCN_priorityAmount");
	if(!priorityAmount){
		setHeader(map, "PLCN_priorityAmount", "");
	}
	var priorityAmountNum = getHeader (map,"PLCN_priorityAmountNum");
	if(!priorityAmountNum){
		setHeader(map, "PLCN_priorityAmountNum", "");
	}
	setHeader(map, "PLCN_valueDate", "");
	setHeader(map, "PLCN_rcvrBic", "");
	setHeader(map, "PLCN_sndrBic", "");
	setHeader(map, "PLCN_txnType", "");
	setHeader(map, "PLCN_txnRefNo", "");
	setHeader(map, "PLCN_prtyName", "");
	setHeader(map, "PLCN_uId", "");
	setHeader(map, "PLCN_btchTxnType", "");
	setHeader(map, "PLCN_localCurrencyAmount", "");
	setHeader(map, "PLCN_localCurrencyAmountNum", "");
	setHeader(map, "PLCN_exchRateSetFlag", "");
	
	setHeader(map, "PLCN_creditorName", "");
	setHeader(map, "PLCN_pay_benf_type", "");
	setHeader(map, "PLCN_sndrBic", "");
	setHeader(map, "PLCN_txnType", "");
	setHeader(map, "PLCN_txnRefNo", "");
	setHeader(map, "PLCN_prtyName", "");
	setHeader(map, "PLCN_uId", "");
	setHeader(map, "PLCN_btchTxnType", "");
	setHeader(map, "PLCN_localCurrencyAmount", "");
	setHeader(map, "PLCN_localCurrencyAmountNum", "");
	setHeader(map, "PLCN_exchRateSetFlag", "");
	setHeader(map, "PLCN_valueDate", "");
	setHeader(map, "PLCN_rcvrBic", "");
	setHeader(map, "PLCN_sndrBic", "");
	setHeader(map, "PLCN_txnType", "");
	setHeader(map, "PLCN_txnRefNo", "");
	setHeader(map, "PLCN_prtyName", "");
	setHeader(map, "PLCN_uId", "");
	setHeader(map, "PLCN_btchTxnType", "");
	setHeader(map, "PLCN_localCurrencyAmount", "");
	setHeader(map, "PLCN_localCurrencyAmountNum", "");
	setHeader(map, "PLCN_exchRateSetFlag", "");
	setHeader(map, "PLCN_uId", "");
	setHeader(map, "PLCN_btchTxnType", "");
	setHeader(map, "PLCN_localCurrencyAmount", "");
	setHeader(map, "PLCN_localCurrencyAmountNum", "");
	setHeader(map, "PLCN_exchRateSetFlag", "");
} */

function deriveQueueidMultitenant(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;

	logger.info("In deriveQueueidMultitenant");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	//readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var msgType;
	var institutionId;
	var tenantPath;
	var tenantValue;
	var tenant;
	var queue;
	var tenantMsgType;
	var batchRequired;
	var fileRequired;
	
	batchRequired = memTblGetTableValue(map,"FLAG-TABLE", "BATCH_REQUIRED");
	fileRequired = memTblGetTableValue(map,"FLAG-TABLE", "FILE_REQUIRED");
	setHeader(map, "PLCN_batchRequired", batchRequired);
	setHeader(map, "PLCN_fileRequired", fileRequired);
	
	msgType = getHeader (map,"PLCN_msgType");
	institutionId = getHeader (map,"PLCN_institutionId");
	if(institutionId){
		tenantPath = institutionId + "." + "INSTITUTION_DETAILS" + "." + "TENANT_NAME";
	}
	if(tenantPath){
		tenantValue = memTblGetTableValue(map,"INST_PARAM", "tenantPath");
		tenantValue = tenantPath.toUpperCase();
	}
	
	setHeader(map, "PLCN_tenantName", tenantValue);
	tenant = memTblGetTableValue(map,"TENANT_NAME", "TENANT_VALUE");
	if(msgType){
		tenantValue = tenant.concat(msgType);
	}
	
	if(tenantValue){
		tenantMsgType = memTblGetTableValue(map,"PMNT_INI_QUEUE", tenantValue);
		if(tenantMsgType){
			queue = memTblGetTableValue(map,"PMNT_INI_QUEUE", tenantMsgType);
		}
		setHeader(map, "PLCN_queueId", tenantMsgType);
	}
}

function extBankProfileFromAccmaster(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;

	logger.info("In extBankProfileFromAccmaster");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	//readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var msgType;
	var bankProfile;
	var flag;
	var bankProfilePath;
	
	bankProfile = memTblGetTableValue(map, "BANKPROFILE");
	setHeader(map, "PLCN_custom37", bankProfile);
	setHeader(map, "PLCN_bankingChannel", bankProfile);
	memTblSetTableValue(map,"FLAG-TABLE", "CUSTOM37", bankProfile);
	
	bankProfilePath = memTblGetTableValue(map, "BANKPROFILE_PATH");
	/* flag = extBankProfileValues(Document, map,bankProfilePath,"N"); */
}

function extractAmount(exchange,amount1,amont2) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;

	logger.info("In extractAmount");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	//readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	var strLen;
	var tempAmount;
	var amount;
	var amountNum;
	var calculatedAmtNum;
	var exchRate = 1;
	var tempAmt1;
	var customAmtAddtlInfTxt = "";
	var customCurrAddtlInf;
	var customAmtAddtlInf;
	var noOfDecimal;
	var part1;
	var part2;
	var stsrsnSeq;
	var addtlInfSeq;
	var i = 0;
	var j = 0;
	var amountInf;
	var strLenInf;
	var tempAmtInf;
	var tempAmt1Inf;
	var amountNumInf;
	var calculatedAmtNumInf;
	
	if(amount1){
		amount = amount1;
	}
	else if(!amount1 && amont2){
		amount = amont2;
	}
	setHeader(map,"PLCN_priorityAmount","");
	setHeader(map,"PLCN_priorityAmountNum","");
	setHeader(map,"PLCN_priorityAmountInf","");
	setHeader(map,"PLCN_priorityAmountNumInf","");
	setHeader(map,"PLCN_calculatedAmtNum","");
	
	if(amount) {
		strLen = amount.length();
		tempAmount = amount.substr(1, strLen);
		amount = tempAmount.replace(".",",");
		tempAmt1 = tempAmount.replace(",",".");
		tempAmount = tempAmount.replace(".",",");
	}	
	amountNum = tempAmount;
	calculatedAmtNum = amountNum * exchRate;
}

function extractValueDateC2b(exchange,date) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;
	var valueDate;
	var msgdbMap = new HashMap();

	logger.info("In extractValueDateC2b");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	//readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	/* var datepath = '/Document/FIToFICstmrCdtTrf/GrpHdr/IntrBkSttlmDt';
	date = getValueFromPath(Document, datepath);
	if(!date){
		var datePath2 = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmDt';
		date = getValueFromPath(Document, datePath2);
	} */
	var date1;
	if(date){
		valueDate = date.replace("-","");
		logger.info("extractValueDateC2b:date after replace function= " + valueDate); //20230317 CCYYMMDD
		//date1 = date1.substr(3, 6);
		valueDate = valueDate.replace("-","");
		//var valueDate = convertDateFormat(date1, "CCYYMMDD", "MMDDCCYY");
		logger.info("extractValueDateC2b: valueDate= " + valueDate); //03172023
	}
	var error = validateDate(Document,map,valueDate);
	if(error){
		if(error > 0){
			valueDate = "";
		}else{
			valueDate = valueDate;
		}
	}
	
	setHeader(map,"PLCN_valueDate",valueDate);
	setHeader(map,"PLCN_priorityDate",valueDate);
	setHeader(map,"PLCNAPI_priorityDate",valueDate);
	logger.info("extractValueDateC2b: valueDate= " + valueDate);
	msgdbMap.put("PRIORITYDATE", valueDate);
	
	/* var metaData1 = exchange.getIn().getBody();
	logger.info("In extractValueDateC2bFile metaData1" + metaData1);
	var metaData2 = exchange.getIn().getHeaders();
	logger.info("In extractValueDateC2bFile metaData2" + metaData2);
	logger.info("In extractValueDateC2bFile metaData2" + metaData2.PLCN_valueDate);
	var metaData = exchange;
	logger.info("In extractValueDateC2bFile metaData3" + metaData); */
	//extractValueDateC2bFile(exchange,valueDate);
}

function valueDateForFile(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;
	var date;
	var datePath;
	var valueDate;

	logger.info("In b2bPacs002ExtractVar");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var message = convertDocumentToString(Document);
	
	var msgdbMap = new HashMap();
	
	var msgDirection = readMsgdb.get("MESSAGEDIRECTION");
	logger.info("valueDateForFile: msgDirection = " + msgDirection);
	
	var msgClassType = getHeader(map, "PLCN_messageClassType");
	if(!msgClassType){
		msgClassType = readMsgdb.get("MESSAGECLASSTYPE");
	}
	logger.info("valueDateForFile: msgClassType = " + msgClassType);
	
	if(msgClassType == 'pacs.008.001.08'){
		datepath = '/Document/FIToFICstmrCdtTrf/GrpHdr/IntrBkSttlmDt';
		date = getValueFromPath(Document, datepath);
		logger.info('valueDateForFile: date = ' + date);
		if(!date){
			var datePath2 = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmDt';
			date = getValueFromPath(Document, datePath2);
			logger.info('valueDateForFile: date = ' + date);
		}
	}else if(msgClassType == 'pacs.004.001.09'){
		datePath = '/Document/PmtRtr/GrpHdr/IntrBkSttlmDt';
		date = getValueFromPath(Document, datePath);
		logger.info("valueDateForFile: date = " + date);
		if(!date){
			datePath2 = '/Document/PmtRtr/TxInf/OrgnlTxRef/IntrBkSttlmDt';
			date = getValueFromPath(Document, datePath2);
		}
	}else if( msgClassType == 'camt.056.001.08'){
		datePath = 'Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlIntrBkSttlmDt';
		date = getValueFromPath(Document, datePath);
		logger.info('valueDateForFile: date = ' + date);
	}else if(msgClassType == 'camt.029.001.09'){
		datePath = '/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/IntrBkSttlmDt';
		date = getValueFromPath(Document, datePath);
		logger.info('valueDateForFile: date = ' + date);
	}else if(msgClassType == 'pacs.002.001.10'){
		datePath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/IntrBkSttlmDt';
		date = getValueFromPath(Document, datePath);
		logger.info("valueDateForFile: date = " + date);
		if(!date){
			datePath2 = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/ReqdColltnDt';
			date = getValueFromPath(Document, datePath2);
			logger.info("valueDateForFile: date = " + date);
		}
	}else if(msgClassType == "pacs.003.001.08"){
		logger.info("valueDateForFile: msgClassType = pacs.003.001.08");
		var date2Path = 'Document/FIToFICstmrDrctDbt/GrpHdr/IntrBkSttlmDt';
		var date = getValueFromPath(Document, date2Path);
		logger.info('valueDateForFile: date = ' + date);
	}else if(msgClassType == "pacs.007.001.09"){
		logger.info("ruleGenerateKbJs_2: msgClassType = pacs007.001.09");
		var date2Path = 'Document/FIToFIPmtRvsl/GrpHdr/IntrBkSttlmDt';
		var date = getValueFromPath(Document, date2Path);
		logger.info('ruleGenerateKbJs2: date = ' + date);
	}
	if(date){
		valueDate = date.replace("-","");
		logger.info("valueDateForFile:date after replace function= " + valueDate); //20230317 CCYYMMDD
		//date1 = date1.substr(3, 6);
		valueDate = valueDate.replace("-","");
		//var valueDate = convertDateFormat(date1, "CCYYMMDD", "MMDDCCYY");
		logger.info("valueDateForFile: valueDate= " + valueDate); //03172023
	}
	return valueDate;
	//msgdbMap.put("PRIORITYDATE", valueDate);
}


function extractValueDateC2bFile(exchange,valueDate) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;
	var valueDate;

	logger.info("In extractValueDateC2bFile");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	//readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	/* var datepath = '/Document/FIToFICstmrCdtTrf/GrpHdr/IntrBkSttlmDt';
	date = getValueFromPath(Document, datepath);
	if(!date){
		var datePath2 = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmDt';
		date = getValueFromPath(Document, datePath2);
	} */
	logger.info("In extractValueDateC2bFile valueDate" + valueDate);
	setHeader(map,"PLCN_valueDate",valueDate);
	setHeader(map,"PLCN_priorityDate",valueDate);
	setHeader(map,"PLCNAPI_priorityDate",valueDate);
	var metaData1 = exchange.getIn().getBody();
	logger.info("In extractValueDateC2bFile metaData1" + metaData1);
	var metaData2 = exchange.getIn().getHeaders();
	logger.info("In extractValueDateC2bFile metaData2" + metaData2);
	logger.info("In extractValueDateC2bFile metaData2" + metaData2.ABC);
	var metaData = exchange;
	logger.info("In extractValueDateC2bFile metaData3" + metaData);
	//return valuedate;
}

function validateDate(Document,map,valueDate) {
	var retVal = 0;
	var yy;
	var mm;
	var dd;
	var yyyy;
	var date;

	logger.info("In validateDate");
	logger.info("validateDate: valueDate = " + valueDate);
	var var1 = isAllDigits(valueDate);
	logger.info("validateDate: var1 = " + var1);
	logger.info("validateDate: valueDate type = " + typeof valueDate);

	if(!valueDate){
		return 0;
	}
	if(valueDate) {
		date = valueDate.replace("-","");
		logger.info("validateDate: date = " + date);
	}
	/* var var2 = isAllDigits(date);
	logger.info("validateDate: var2 = " + var2);
	var var3 = isPatternPresent(date,".");
	logger.info("validateDate: var3 = " + var3);
	var var4 = date.replace(".","");
	var3 = isPatternPresent(var4,".");
	logger.info("validateDate: var3 = " + var3);
	//valueDate = parseInt(valueDate);
	//if(!isAllDigits(date) || isPatternPresent(date,".")) */
	if(!isAllDigits(date)){
		logger.info("validateDate: inside first loop = " );
		setHeader(map, "PLCN_validMessage",false);
		retVal = setCommentsForTransaction("125", "5713", map);
		var validflag = getHeader(map, "PLCN_validMessage");
		logger.info("validateDate: valid message flag = " + validflag);
		return retVal;
	}
	
	if(date.length < 6 && date.length > 8){
		logger.info("validateDate: inside 2nd loop = " );
		setHeader(map, "PLCN_validMessage",false);
		retVal = setCommentsForTransaction("125", "5713", map);
		var validflag = getHeader(map, "PLCN_validMessage");
		logger.info("validateDate: valid message flag = " + validflag);
		return retVal;
	}
	
	if(date.length == 8){
		yyyy = date.substring(1, 4);
		mm = date.substring(5, 2);
		dd = date.substring(7, 2);
		if(yyyy == "0000"){
			logger.info("validateDate: inside 3rd loop = " );
			setHeader(map, "PLCN_validMessage",false);
			retVal = setCommentsForTransaction("125", "5713", map);
			var validflag = getHeader(map, "PLCN_validMessage");
			logger.info("validateDate: valid message flag = " + validflag);
			return retVal;
		}
		else{
			yy = date.substring(1, 2);
			mm = date.substring(3, 2);
			dd = date.substring(5, 2);
			if(yy > 60 && yy < 80){
				logger.info("validateDate: inside 4th loop = " );
				setHeader(map, "PLCN_validMessage",false);
				retVal = setCommentsForTransaction("125", "5713", map);
				var validflag = getHeader(map, "PLCN_validMessage");
				logger.info("validateDate: valid message flag = " + validflag);
				return retVal;
			}
			if(yy < 61){
				yyyy = yy.concat(20);
			}
			else{
				yyyy = yy.concat(19);
			}
		}
	}
	if(mm < 1 || mm > 12){
		logger.info("validateDate: inside 5th loop = " );
		setHeader(map, "PLCN_validMessage",false);
		retVal = setCommentsForTransaction("125", "5713", map);
		var validflag = getHeader(map, "PLCN_validMessage");
		logger.info("validateDate: valid message flag = " + validflag);
		return retVal;
	}
	var div1 = yyyy/4;
	var div2 = Math.ceil(div1);
	var div3 = div2 - div1 ;
	//if((div2 - div1) != 0) 
	if(dd < 1 || (dd > 30 && (mm == 4 || mm == 6 || mm == 9 || mm == 11) && dd > 31 && (mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12) && (dd > 29 && mm == 2 && div3 == 0) && (dd > 28 && mm == 2 && div3 != 0))){
		logger.info("validateDate: inside 6th loop = " );
		setHeader(map, "PLCN_validMessage",false);
		retVal = setCommentsForTransaction("125", "5713", map);
		return retVal;
	}
	logger.info("validateDate: inside final = " );
	var validflag = getHeader(map, "PLCN_validMessage");
	logger.info("validateDate: valid message flag = " + validflag);
	return retVal ;
}

function getOlapDefualtValues1(exchange) {
	var gvFunction;   
    var gvFinalScanStatus;    
    var gvProcessingStatus;   
    var gvRecordGroupType;    
    var gvCorrespondent;    
    var gvCountryCode;    
    var gvCtryCode;   

    var gvCurrency;    

    var gvChannelIdSource;    
    var gvChannelIdTarget;    
    var gvReasonCode;    
    var gvDerivedPaymentSystem;    
    var gvDerivedProduct;    
    var gvDerivedApplication;    
    var gvMessageDirection;   

    var gvMsgFamily;    
    var gvStpStatus;   
    var gvRegionCode;    
    var gvReturnCode;    
    var gvTxnGrp;    
	
    var gvStatusId;    
    var gvPaymentSystem;   
    var serverMode;    
    var msgType;    
    var chnlIdSrc; 
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In getOlapDefualtValues1");

	serverMode = memTblGetTableValue(map, "FLAG-TABLE", "SERVER-MODE");
	if(serverMode == "INTERFACE"){
		gvFunction = getHeader (map,"PLCN_function");
		gvFinalScanStatus = getHeader (map,"PLCN_finalScanStatus");
		gvProcessingStatus = getHeader (map,"PLCN_processingStatus");
		gvCorrespondent = getHeader (map,"PLCN_correspondent");
		gvCountryCode = getHeader (map,"PLCN_countryCode");
		gvCtryCode = getHeader (map,"PLCN_countryCode1");
		gvCurrency = getHeader (map,"PLCN_currency");
		if(!gvCurrency){
			gvCurrency = getHeader (map,"PLCN_currency");
		}
		/* (Assign GV_CURRENCY (GETVALUEFROMHEADER GV_MSG_INPATH "STREAM_DETAILS" "CURRENCY"))
			   (IF (ISEMPTY GV_CURRENCY) ;;Merged by nihal from NIBC 06092019
				THEN
					(
					   (Assign GV_CURRENCY (GETVALUEFROMHEADER GV_MSG_OUTPATH "STREAM_DETAILS" "CURRENCY"))
					)
				) */
		gvChannelIdSource = getHeader (map,"PLCN_channelIdSource");
		gvChannelIdTarget = getHeader (map,"PLCN_channelIdTarget");
		gvReasonCode = getHeader (map,"PLCN_reasonCode");
		gvDerivedPaymentSystem = getHeader (map,"PLCN_derivedPaymentSystem");
		gvDerivedProduct = getHeader (map,"PLCN_productCode");
		gvDerivedApplication = getHeader (map,"PLCN_derivedApplication");
		gvMessageDirection = getHeader (map,"PLCN_msgDirection");
		gvMsgFamily = getHeader (map,"PLCN_msgFamilyDB");
		gvStpStatus = getHeader (map,"PLCN_stpStatus");
		gvRegionCode = getHeader (map,"PLCN_regionCode");
		gvReturnCode = getHeader (map,"PLCN_returnCode");
		gvTxnGrp = getHeader (map,"PLCN_txnGrp");
	}
	if(!gvFunction){
		gvFunction = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "FUNCTION");
	}
	if(!gvFinalScanStatus){
		gvFinalScanStatus = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "FINAL_SCAN_STATUS");
	}
	if(!gvProcessingStatus){
		gvProcessingStatus = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "PROCESSING_STATUS");
	}
	if(!gvCorrespondent){
		gvCorrespondent = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "CORRESPONDENT");
	}
	if(!gvCountryCode){
		gvCountryCode = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "COUNTRYCODE");
	}
	if(!gvCtryCode){
		gvCtryCode = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "COUNTRY_CODE");
	}
	if(!gvCurrency){
		gvCurrency = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "CURRENCY");
	}
	if(!gvChannelIdSource){
		gvChannelIdSource = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "CHANNEL_ID_SOURCE");
	}
	if(!gvChannelIdTarget){
		gvChannelIdTarget = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "CHANNEL_ID_TARGET");
	}
	if(!gvReasonCode){
		gvReasonCode = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "REASON_CODE");
	}
	if(!gvDerivedPaymentSystem){
		gvDerivedPaymentSystem = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "DERIVED_PAY_SYSTEMS");
	}
	if(!gvDerivedProduct){
		gvDerivedProduct = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "DERIVED_PRODUCT");
	}
	if(!gvDerivedApplication){
		gvDerivedApplication = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "DERIVED_APPLICATION");
	}
	if(!gvMessageDirection){
		gvMessageDirection = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "MESSAGEDIRECTION");
	}
	if(!gvMsgFamily){
		gvMsgFamily = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "MSG_FAMILY");
	}
	if(!gvStpStatus){
		gvStpStatus = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "STP_STATUS");
	}
	if(!gvRegionCode){
		gvRegionCode = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "REGION_CODE");
	}
	if(!gvReasonCode){
		gvReasonCode = memTblGetTableValue(map, "OLAP_COL_DEFS_MAP", "RETURNCODE");
	}
	if(!gvTxnGrp){
		gvTxnGrp = "";
	}
	// if(){
		
	// }
	msgType = getHeader (map,"PLCN_msgType");
	if(!msgType){
		msgType = memTblGetTableValue(map, "MSG_TYPE", "MSG_TYPE");
	}
	if(msgType.substr(0, 4) == "pacs" && !gvMsgFamily == "SEPA"){
		setHeader(map, "PLCN_msgType", "SEPA");
	}
	chnlIdSrc = memTblGetTableValue(map, "NIBC_REVERSE_CHANNEL_DERIVATION", "gvChannelIdSource");
	if(chnlIdSrc){
		setHeader(map, "PLCN_msgType", "SWIFT");
	}
	gvStatusId = gvFinalScanStatus;
	gvPaymentSystem = gvDerivedPaymentSystem;
}

function drveNibcProductCode(exchange) {
	var retVal = 0;
	var txnGroup;
	var key;
	var msgModeIn;
	var sourceChnlId;
	var msgDirection;
	var origProductCode;
	var institutionId;
	var msgScheme;
	var sourceChannelId;
	var productCode;
	var msgType;
	var dervProduct;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	logger.info("In drveNibcProductCode rule.");

	institutionId = getHeader(map,"PLCN_institutionId");
	msgModeIn = getHeader(map, "PLCN_mode");
	if(!msgModeIn){
		msgModeIn = getHeader(map, "PLCN_msgModeIn");
	}
	
	msgDirection = getHeader(map,"PLCN_msgDirection");
	sourceChannelId = getHeader(map,"PLCS_channelIdSources");
	drveLocationFrmSrc(exchange);
	if(!msgModeIn){
		if(sourceChannelId == "FILE-ROUTE-IN" || sourceChannelId == "SWFTFQ-IN" || sourceChannelId == "RJE-FQ-IP-1"){
			msgModeIn = "FILE";
		}
		if(sourceChannelId == "BO1-SWFT-OB-IN" || sourceChannelId == "STP-ACBS-IN" || sourceChannelId == "STP-FRAR-IN" || sourceChannelId == "STP-GLBS-IN" || sourceChannelId == "STP-TBLX-IN" || sourceChannelId == "SWF-FIN-IN" || sourceChannelId == "BO1-SWFT-OB-IN"){
			msgModeIn = sourceChannelId;
			sourceChannelId = memTblGetTableValue(map, "NIBC_SWIFT_CHANNEL_DERIVATION", sourceChannelId);
			setHeader(map,"PLCN_channelIdSource",sourceChannelId);
			drveLocationFrmSrc(exchange);
		}
	}
	sourceChannelId = getHeader(map,"PLCS_channelIdSource");
	if(msgModeIn == "MQ" && (sourceChannelId == "STP-ACBS-IN" || sourceChannelId == "STP-FRAR-IN" || sourceChannelId == "STP-GLBS-IN" || sourceChannelId == "STP-TBLX-IN" || sourceChannelId == "SWF-FIN-IN")){
		msgModeIn = sourceChannelId;
		sourceChannelId = memTblGetTableValue(map, "NIBC_SWIFT_CHANNEL_DERIVATION", sourceChannelId);
		setHeader(map,"PLCN_channelIdSource",sourceChannelId);
		drveLocationFrmSrc(exchange);
	}
	if(msgModeIn == "MQ" && (msgType == "pacs.008.001.08" || msgType == "pacs.009.001.08" || msgType == "pacs.002.001.10" || msgType == "pacs.004.001.09" || msgType == "camt.057.001.06")){
		sourceChannelId = getHeader(map,"PLCS_sourceChannelId");
		if(sourceChannelId == "STP-ACBS-IN" || sourceChannelId == "STP-FRAR-IN" || sourceChannelId == "STP-GLBS-IN" || sourceChannelId == "STP-TBLX-IN" || sourceChannelId == "SWF-FIN-IN"){
			msgModeIn = sourceChannelId;
			sourceChannelId = memTblGetTableValue(map, "NIBC_SWIFT_CHANNEL_DERIVATION", sourceChannelId);
			setHeader(map,"PLCN_channelIdSource",sourceChannelId);
			drveLocationFrmSrc(exchange);
		}
	}
	if(!msgModeIn){
		if(sourceChannelId == "CLIEOP-ROUTE-IN-ERR"){
			productCode = "SEPA_OUT_STS";
			msgType = "pain.002.001.03";
			msgModeIn = "FILE";
		}
		sourceChannelId = getHeader(map,"PLCS_channelIdSource");
		if(sourceChannelId == "SEPA Service Bureau" || sourceChannelId == "SCT_IN" || sourceChannelId == "SCT_INSTA_IN" || sourceChannelId == "SEPA_INSTA_SVC_BUREAU_OB"){
			msgModeIn = "FILE";
		}
	}
	if(!msgModeIn){
		msgModeIn = getHeader(map,"PLCS_manualMode");
	}
	if(!msgModeIn){
		msgModeIn = memTblGetTableValue(map, "STREAM_DETAILS", "MANUAL_MODE");
	}
	if(!msgModeIn){
		msgModeIn = memTblGetTableValue(map, "MESSAGE_DETAILS", "MANUAL_MODE");
	}
	origProductCode = getHeader(map,"PLCN_derivedProduct");
	if(msgModeIn == "REPAIR" && origProductCode && (origProductCode == "NOTAPPLICABLE" && origProductCode == "null" && origProductCode == "NULL" && origProductCode == "Null")){
		return origProductCode;
	}
	if(msgModeIn == "REPAIR"){
		msgModeIn = "MANUAL";
	}
	sourceChannelId = getHeader(map,"PLCS_channelIdSource");
	if(sourceChannelId == "SWIFT_UPL_IN"){
		msgModeIn = "UPLOAD";
		setHeader(map,"PLCN_msgModeIn",msgModeIn);
		key = msgModeIn;
		productCode = memTblGetTableValue(map, "PPAY_PRODUCT_CD", key);
	}
	if(sourceChannelId == "SEPA-Ib" || sourceChannelId == "EQUENS_SEPA_IN" || sourceChannelId == "Equens SEPA In NFA" || sourceChannelId == "EQUENS_SEPA_OB" || sourceChannelId == "SEPA-Ob" || sourceChannelId == "Thaler NL SEPA In" || sourceChannelId == "Thaler BE SEPA In" || sourceChannelId == "TBLOX SEPA In" || sourceChannelId == "CashFac SEPA In" || sourceChannelId == "BE SEPA In" || sourceChannelId == "BE SEPA In NFA"){
		msgModeIn =  memTblGetTableValue(map, "NIBC_CHANNEL_TO_MODE", sourceChannelId);
		logger.info("drveNibcProductCode: msgModeIn = " + msgModeIn);
	}
	
	var hdrPrevQueue = getHeader(map,"PLCN_prevQueueId");
	var confPrevQueue = memTblGetTableValue(map,"FLAG-TABLE_MAP","MANUAL-CREATE-QUEUES");
	var dervProduct = getHeader(map,"PLCN_derivedProduct");
	if(dervProduct.substr(0,3) == "C2B"){
		productCode = dervProduct;
	}
	if(msgModeIn == "MANUAL"){
		if(hdrPrevQueue){
			if(!(confPrevQueue && hdrPrevQueue) && dervProduct){
				productCode = dervProduct;
			}
		}
	}
	if(!productCode && msgModeIn == "UPLOAD"){
		key = msgModeIn + "." + msgType;
		productCode = memTblGetTableValue(map,"PPAY_PRODUCT_CD",key);
		if(sourceChannelId == "SEPA-Ib" || sourceChannelId == "EQUENS_SEPA_IN" || sourceChannelId == "Equens SEPA In NFA" || sourceChannelId == "EQUENS_SEPA_OB" || sourceChannelId == "SEPA-Ob" || sourceChannelId == "Thaler NL SEPA In" || sourceChannelId == "Thaler BE SEPA In" || sourceChannelId == "TBLOX SEPA In" || sourceChannelId == "CashFac SEPA In" || sourceChannelId == "BE SEPA In" || sourceChannelId == "BE SEPA In NFA"){
			msgModeIn = "FILE";
		}
	}
	txnGroup = memTblGetTableValue(map, "MESSAGETYPE", msgType);
	setHeader(map,"TXN_GRP",txnGroup);
	msgScheme = getHeader(map,"PLCN_msgScheme");
	if(!msgScheme){
		msgScheme = memTblGetTableValue(map,"STREAM-TABLE_MAP","MSG_SCHEME");
	}
	if(msgScheme == "INST"){
		setHeader(map,"PLCN_txnGrp","EFT");
	}
	else{
		setHeader(map,"PLCN_txnGrp",txnGroup);
	}
	setHeader(map,"PLCN_msgModeIn",msgModeIn);
	setHeader(map,"PLCN_productCode",productCode);
	setHeader(map,"PLCN_derivedProduct",productCode);
	if(!productCode){
		if(dervProduct){
			setHeader(map,"PLCN_productCode",dervProduct);
			setHeader(map,"PLCN_derivedProduct",dervProduct);
		}
	}
	logger.info("drveNibcProductCode: productCode = " + productCode);
	return productCode;
}

function drveLocationFrmSrc(exchange) {
	var retVal = 0;
	var msgSegr ;
	var sourceChannelId;
	var nibcMsgSegr ;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	sourceChannelId = getHeader(map,"PLCS_channelIdSource");
	nibcMsgSegr = getHeader (map,"PLCN_nibcMsgSeg");
	if(!sourceChannelId){
		sourceChannelId = getHeader (map,"PLCS_sourceChannelId");
	}
	if(!nibcMsgSegr){
		msgSegr = memTblGetTableValue(map, "NIBC_CHANNEL_TO_LOCATION", sourceChannelId);
	}
	else{
		msgSegr = getHeader (map,"PLCN_nibcMsgSeg");
	}
	if(!msgSegr){
		msgSegr = getHeader (map,"PLCN_messageSegregation");
	}
	else{
		setHeader(map, "PLCN_messageSegregation", msgSegr);
		setHeader(map, "PLCN_msgSegr", msgSegr);
	}
	if(sourceChannelId == "SEPA-Ib" || sourceChannelId == "EQUENS_SEPA_IN"){
		setHeader(map, "PLCN_msgSegr", "DEFAULT");
	}
}


function beneficiaryAccountNumbersApply(Document, map) {
	var retVal = 0;
	var accountCr;
	var accountDr;
	var backOffice;
	var secLvl = "SECURITY=HIGH";
	var runEnv = "SEPA-RUN";
	var fld = "59";
	var endPos;
	var startPos = 0;
	var location1;
	var nibcMessage;
	var msgType;
	var ibSepaCustRouteFlag;
	
	//logger.trace("beneficiaryAccountNumbersApply: map = " + map);

	logger.info("In beneficiaryAccountNumbersApply rule");

	var orgnlMsgNmIdPath = "/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId";
	if(!orgnlMsgNmIdPath) {
		orgnlMsgNmIdPath = "/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId";
	}
	var orgnlMsgNmId = getValueFromPath(Document, orgnlMsgNmIdPath);

	logger.info("beneficiaryAccountNumbersApply: orgnlMsgNmId = " + orgnlMsgNmId);

	msgType = memTblGetTableValue(map, "MSG_TYPE", "MSG_TYPE");
	if(!msgType) {
		msgType = getHeader(map, "PLCN_msgType");
	}
	logger.info("beneficiaryAccountNumbersApply: msgType = " + msgType);

	accountCr = getHeader(map, "PLCN_accountCr");
	if(!accountCr) {
		accountCr = getHeader(map, "PLCN_otherAccno");
	}
	logger.info("beneficiaryAccountNumbersApply: accountCr = " + accountCr);

	accountDr = getHeader(map, "PLCN_accountDr");
	if(!accountDr) {
		accountDr = getHeader(map, "PLCN_accountNumber");
	}
	logger.info("beneficiaryAccountNumbersApply: accountDr = " + accountDr);

	ibSepaCustRouteFlag = memTblGetTableValue(map, "USER_CONFIG_MAP", "IB_SEPA_CUST_ROUTE");
	logger.info("beneficiaryAccountNumbersApply: ibSepaCustRouteFlag = " + ibSepaCustRouteFlag);
	
	if(isPatternPresent(msgType,"pacs.008") && accountCr){
		backOffice = memTblGetTableValue(map, "AccNoBoLoc", accountCr);
		logger.info("beneficiaryAccountNumbersApply: Inside pacs008 loop backOffice= " + backOffice);
	}
	
	if(isPatternPresent(msgType,"pacs.004") && accountDr){
		backOffice =  memTblGetTableValue(map, "AccNoBoLoc", accountDr);
	}

	if(isPatternPresent(msgType,"pacs.004") && accountCr && isPatternPresent(orgnlMsgNmId, "pacs.003")){
		backOffice = memTblGetTableValue(map, "AccNoBoLoc", accountCr);
	}

	if(isPatternPresent(msgType,"camt.056") && accountDr){
		backOffice = memTblGetTableValue(map, "AccNoBoLoc", accountDr);
	}

	if(isPatternPresent(msgType,"camt.029") && accountDr){
		backOffice = memTblGetTableValue(map, "AccNoBoLoc", accountDr);
	}
	
	if(isPatternPresent(msgType,"pac.002") && accountDr){
		backOffice = memTblGetTableValue(map, "AccNoBoLoc", accountDr);
	}
	logger.info("beneficiaryAccountNumbersApply: backOffice = " + backOffice);
	// var bankingChanl = getHeader(map, "PLCN_bankingChanlUpdt");
	// logger.info("beneficiaryAccountNumbersApply: bankingChanl = " + bankingChanl);
	// if(!bankingChanl) {
	// 	bankingChanl = getHeader(map, "PLCN_bankingChanl");
	// 	logger.info("beneficiaryAccountNumbersApply: bankingChanl = " + bankingChanl);
	// }

	if(ibSepaCustRouteFlag == "YES"){
		if(!backOffice){
			backOffice = memTblGetTableValue(map,"INT_DATA_MAP","IB_SEPA_CUST_ROUTE_DATA");
			logger.info("beneficiaryAccountNumbersApply: backOffice = " + backOffice);
		}
	}
	
	location1 = backOffice;
	logger.info("beneficiaryAccountNumbersApply: location1 = " + location1);
	if(backOffice){
			endPos = searchNthPattern(backOffice,",",1); //(ASSIGN END_POS (SEARCHNTHPATTERN BACK_OFFICE ","  1))
			endPos = endPos - 1;
			backOffice = backOffice.substr(startPos,endPos);
			var var1 = backOffice.concat(",");
	        location1 = location1.replace(var1,"");
			
	}

		backOffice = memTblGetTableValue(map,"BACKOFFICE_BANKING_CHANNEL",backOffice);
		logger.info("beneficiaryAccountNumbersApply: backOffice = " + backOffice);
		logger.info("beneficiaryAccountNumbersApply: location1 = " + location1);
		setHeader(map,"PLCN_bankingChanlUpdt",backOffice);
		setHeader(map,"PLCN_bankingChanl",backOffice);
		setHeader(map,"PLCN_bankingChannel",backOffice);
	//var metaData = exchange;
	
	if(location1){
		setHeader(map,"PLCN_messageSegregation",location1);
		setHeader(map,"PLCN_msgSegr",location1);
		setHeader(map,"PLCN_nibcMsgSeg",location1);
	}
	
	return "T";
}


function drveNibcCustomChannels(Document, map,productCode) {
	var retVal = 0;
	var channelIdSource;
	
	channelIdSource = memTblGetTableValue(map, "BANIF-PRODCODE-SOURCECHNL", productCode);
	if(channelIdSource){
		setHeader(map, "PLCN_channelIdSource", channelIdSource);
	}
}

function b2bExtractVarMx(Document, map){
    var msgId;
    var txnId;
    var txnCustom2;
    var msgIdPath;
    var txnIdPath;
    var msgType;
    var instrIdPath;
    var instrId;
   	
    logger.info("In b2bExtractVarMx");
   	msgType = getHeader(map, "PLCN_msgType");
 	
 	if(msgType == 'pacs.008.001.08') {
 	    msgIdPath = "/Document/FIToFICstmrCdtTrf/GrpHdr/MsgId";
	    msgId = getValueFromPath(Document, msgIdPath);
	    logger.info('b2bExtractVarMx:InstrId = '+msgId);
	    setHeader(map, "PLCN_msgId", msgId);
		txnIdPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/TxId";
		txnId = getValueFromPath(Document, txnIdPath);
		logger.info('b2bExtractVarMx: txnId = '+txnId);
		setHeader(map, "PLCN_txnId", txnId);
		txnCustom2 = msgId + "¿" + txnId;		
 	}

 	if(msgType == 'pacs.003.001.08') {
 	    msgIdPath = "/Document/FIToFICstmrDrctDbt/GrpHdr/MsgId";
	    msgId = getValueFromPath(Document, msgIdPath);
	    logger.info('b2bExtractVarMx:InstrId = '+msgId);
	    setHeader(map, "PLCN_msgId", msgId);
		txnIdPath = "/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/PmtId/TxId";
		txnId = getValueFromPath(Document, txnIdPath);
		logger.info('b2bExtractVarMx: txnId = '+txnId);
		setHeader(map, "PLCN_txnId", txnId);
		txnCustom2 = msgId + "Â¿" + txnId;		
 	}	
 	if(msgType == 'camt.056.001.08') {
 	    msgIdPath = "/Document/FIToFIPmtCxlReq/Assgnmt/Id";          //Undrlyg/TxInf/OrgnlGrpInf/OrgnlMsgId";
	    msgId = getValueFromPath(Document, msgIdPath);
	    logger.info('b2bExtractVarMx:msgId = '+msgId);
	    setHeader(map, "PLCN_msgId", msgId);
		txnIdPath = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/CxlId";
		txnId = getValueFromPath(Document, txnIdPath);
		logger.info('b2bExtractVarMx: txnId = '+txnId);
		setHeader(map, "PLCN_txnId", txnId);
		txnCustom2 = msgId + "Â¿" + txnId;		
 	}
    logger.info("b2bExtractVarMx: txnCustom2 = " + txnCustom2);
    setHeader(map, "PLCN_CUSTOM2", txnCustom2);
    logger.info("b2bExtractVarMx: CUSTOM2 = " + getHeader(map, "PLCN_CUSTOM2"));
}

function drveNibcConfigurations(Document, map,msgType) {
	var retVal = 0;
	var msgDirection;
	var fileType;
	var channelIdSource;
	var fType;
	var bankingChanl;
	var sourceChnlId;

	logger.info("In drveNibcConfigurations rule");

	msgDirection = getHeader (map,"PLCN_msgDirection");
	logger.info("drveNibcConfigurations: msgDirection = " + msgDirection);
	bankingChanl = getHeader (map,"PLCN_bankingChanlUpdt");
	logger.info("drveNibcConfigurations: bankingChanl = " + bankingChanl);
	if(msgDirection){
		if(!bankingChanl && msgDirection == "O"){
			bankingChanl = memTblGetTableValue(map, "FLAG-TABLE","BACK_OFFICE");
			logger.info("drveNibcConfigurations: bankingChanl = " + bankingChanl);
			setHeader(map,"PLCN_bankingChanlUpdt",bankingChanl);
			setHeader(map,"PLCN_bankingChanl",bankingChanl);
			setHeader(map,"PLCN_bankingChannel",bankingChanl);
		}
		logger.info("drveNibcConfigurations: bankingChanl = " + bankingChanl);
		if(msgDirection == "I"){
			sourceChnlId = getHeader (map,"PLCN_sourceChannelId");
			if(!sourceChnlId){
				sourceChnlId = getHeader (map,"PLCN_channelIdSource");
			}
			if(sourceChnlId){
				bankingChanl = memTblGetTableValue(map, "USER_CONFIG_MAP",sourceChnlId);
				if(!bankingChanl) {
					bankingChanl = 'DEFAULT';
				}
				setHeader(map,"PLCN_bankingChanlUpdt",bankingChanl);
				setHeader(map,"PLCN_bankingChanl",bankingChanl);
				setHeader(map,"PLCN_bankingChannel",bankingChanl);
			}
		}
	}
}

function hsMappingRule(Document,map) {
	var retVal = 0;
	var msgDbId;
	var tempDate;
	var timeSys;
	var hsTxnId;
	
	msgDbId = getHeader (map,"PLCN_msgDbId");
	
	tempDate = getDate();
	timeSys = localTime();
	timeSys = replaceAllPattern(timeSys, ":", "");
	var key1;
	if(msgDbId) {
	 	key1 = msgDbId.concat(tempDate);
	}
	if(key1) {
		hsTxnId = key1.concat(timeSys);
	}
	setHeader(map,"PLCN_hsTxnIdAuto",hsTxnId);
	return retVal;
}

function setTranslationHeader(exchange) {
	logger.info("In setTranslationHeader rule.");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var messageType;
	var messageFamily;
	var srcMsgType;
	var tgtMsgType;
	var msgType;

	// var messageBody = inMsg.getBody(java.lang.String.class);
	// logger.trace("setTranslationHeader: messageBody = " + messageBody);
	// setHeader(map, "ACEDB_originalBody", messageBody);
	// inMsg.setBody(orgnlBody);

	messageType = getHeader(map, "PLCN_msgType");
	//messageType = messageType.toUpperCase();
	logger.info("setTranslationHeader: messageType = " + messageType);

	messageFamily = getHeader(map, "PLCN_msgFamily");
	logger.info("setTranslationHeader: messageFamily = " + messageFamily);

	msgType = messageType.charAt().toUpperCase() + messageType.slice(1);
	
	if(isPatternPresent(messageType, "Pacs.008")) {
		srcMsgType = "Sepa".concat(msgType);
		setHeader(map, "SRC_PaymentType",srcMsgType);
		logger.info("setTranslationHeader: srcMsgType = " + srcMsgType);

		tgtMsgType = "Sepa".concat("Pacs.002.001.10");
		setHeader(map, "TGT_PaymentType", tgtMsgType);
		logger.info("setTranslationHeader: tgtMsgType = " + tgtMsgType);
	}else {
		srcMsgType = "Sepa".concat(msgType);
		setHeader(map, "SRC_PaymentType",srcMsgType);
		logger.info("setTranslationHeader: srcMsgType = " + srcMsgType);

		tgtMsgType = "Sepa".concat("Pacs.002.001.10");
		setHeader(map, "TGT_PaymentType", tgtMsgType);
		logger.info("setTranslationHeader: tgtMsgType = " + tgtMsgType);
	}
}

function b2bExtractVarInRouteNode(exchange) {
	var retVal = 0;
	var inMsg;
	var map;
	var readMsgdb;
	var Document;
	
	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB"); 
	
	var msgType;
	var countryCode;
	var institutionId;
	var senderBic;
	
	msgType = getHeader (map,"PLCN_msgType");
	logger.info("b2bExtractVarInRouteNode: msgType = " + msgType);
	setHeader(map, "PLCN_msgFamily", "SEPA");
	if(!msgType){
		msgType = getMessageType(exchange);
		msgType = msgType.toLowerCase();
		logger.info("b2bExtractVarInRouteNode: msgType from getMessageType = " + msgType);		
	}
	if(isPatternPresent(msgType, "pacs.004")){
		b2bPacs004ExtractVar(exchange);
	}
	else if(isPatternPresent(msgType, "pacs.002")){
		b2bPacs002ExtractVar(exchange);
	}
	else if(isPatternPresent(msgType, "pacs.007")){
		logger.info("b2bExtractVarInRouteNode: inside pacs007 loop ");		
		b2bPacs007ExtractVar(exchange);
	}
	return retVal;
}

function b2bPacs004ExtractVar(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;

	logger.info("In b2bPacs004ExtractVar");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	logger.info("In b2bPacs004ExtractVar" + Document);
	
	var message = inMsg.getBody(java.lang.String.class);
	//logger.trace("In b2bPacs004ExtractVar" + message);
	//var message = convertDocumentToString(Document);
	
	var grpSts;
	var txnSts;
	var msgId;
	var orgnlMsgId;
	var orgnlMsgNmId;
	var date;
	var amount1;
	var amount2;
	var currency1;
	var currency2;
	var orgnlEndToEndId;
	var pmtInfId;
	var flType;
	var orgGrpIntPtyBic;
	var debitAccount;
	var creditAccount;
	var finBic = "";
	var dbtOrgIdBic = "";
	var pmtInfExecDate = "";
	var crdtInstrId = "";
	var accNum = "";
	var accNum1 = "";
	var detailsName = "";
	var uId = "";
	var finOrgGrpBic;
	var finOrgPmtBic;
	var institutionId;
	var totalBtchAmt;
	var mtchMsgDirection;
	var msgDirection;
	var mode;
	var txnMtchParam;
	var orgnlDate;
	var transRegNo;
	var returnId;
	var custom12;
	var benBankName;
	var benAddr1;
	var benAddr2;
	var benAddr3;
	var benAddr4;
	var payerName;
	var payerAddr1;
	var payerAddr2;
	var payerAddr3;
	var fileAmt;
	var fileAmtNum;
	var custom2one;
	var tempTrans;
	
	
	mode = getHeader (map,"PLCN_manualMode");
	if(!mode){
		mode = getHeader (map,"PLCN_mode");
	}
	msgDirection = getHeader (map,"PLCN_massageDirection");
	if(!msgDirection){
		msgDirection = getHeader (map,"PLCN_msgDirection");
	}
	if(msgDirection){
		setHeader(map,"PLCN_msgDirection",msgDirection);
		logger.info("b2bPacs004ExtractVar: PLCN_msgDirection = " + msgDirection);
	}

	var msgIdPath = "/Document/PmtRtr/GrpHdr/MsgId";
	msgId = getValueFromPath(Document, msgIdPath);
	logger.info("b2bPacs004ExtractVar: msgId = " + msgId);
	
	var fileAmtNumPath = '/Document/PmtRtr/GrpHdr/TtlRtrdIntrBkSttlmAmt/@Ccy';
	fileAmtNum = getValueFromPath(Document, fileAmtNumPath);
	logger.info("b2bPacs004ExtractVar: fileAmtNum = " + fileAmtNum);
	if(fileAmtNum){
		fileAmt = fileAmtNum.replace(".",",");
		logger.info("fileAmt" + fileAmt);
	}
	var returnIdPath = '/Document/PmtRtr/TxInf/RtrId';
	returnId = getValueFromPath(Document, returnIdPath);
	logger.info("b2bPacs004ExtractVar: returnId = " + returnId);
	
	var orgnlMsgIdPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgId';
	orgnlMsgId = getValueFromPath(Document, orgnlMsgIdPath);
	logger.info("b2bPacs004ExtractVar: orgnlMsgId = " + orgnlMsgId);
	
	var ebaPacs004Flag = memTblGetTableValue(map,"FLAG-TABLE", "EBA_PACS004_FLAG");
	logger.info("b2bPacs004ExtractVar: ebaPacs004Flag = " + ebaPacs004Flag);
	
	if(ebaPacs004Flag && ebaPacs004Flag == "Y"){
		msgId = msgId.replace(" ","");
	}
	var orgnlMsgNmIdPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
	orgnlMsgNmId = getValueFromPath(Document, orgnlMsgNmIdPath);
	logger.info("b2bPacs004ExtractVar: orgnlMsgNmId = " + orgnlMsgNmId);
	
	var pmtInfIdPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgId';
	pmtInfId = getValueFromPath(Document, pmtInfIdPath);
	logger.info("b2bPacs004ExtractVar: pmtInfId = " + pmtInfId);
	if(!pmtInfId){
		if(msgId){
			pmtInfId = msgId ;
			logger.info("b2bPacs004ExtractVar: pmtInfId = " + pmtInfId);
		}
	}
	
	var orgnlDatePath = '/Document/PmtRtr/TxInf/OrgnlTxRef/ReqdColltnDt';
	orgnlDate = getValueFromPath(Document, orgnlDatePath);
	logger.info("b2bPacs004ExtractVar: orgnlDate = " + orgnlDate);
	
	var amount1Path = '/Document/PmtRtr/TxInf/RtrdIntrBkSttlmAmt/@Ccy';
	amount1 = getValueFromPath(Document, amount1Path);
	logger.info("b2bPacs004ExtractVar: amount1 = " + amount1);
	
	var datePath = '/Document/PmtRtr/GrpHdr/IntrBkSttlmDt';
	date = getValueFromPath(Document, datePath);
	logger.info("b2bPacs004ExtractVar: date = " + date);
	if(!date){
		var datePath2 = '/Document/PmtRtr/TxInf/IntrBkSttlmDt';
		date = getValueFromPath(Document, datePath2);
	}
	
	extractValueDateC2b(exchange,date);
	
	/* var priorityAmtPath = '/Document/PmtRtr/CdtTrfTxInf/OrgnlIntrBkSttlmAmt';
	var priorityAmt = getValueFromPath(Document, priorityAmtPath);
	logger.info("b2bPacs004ExtractVar: priorityAmt = " + priorityAmt);
	setHeader(map,"PLCN_priorityAmount",priorityAmt);
	setHeader(map,"PLCN_amount",priorityAmt);
	setHeader(map,"PLCN_amountNum",priorityAmt);
	setHeader(map,"PLCN_priorityAmountNum",priorityAmt); */
	
	var currency1Path = '/Document/PmtRtr/CdtTrfTxInf/IntrBkSttlmAmt/@ccy';
	currency1 = getValueFromPath(Document, currency1Path);
	logger.info("b2bPacs004ExtractVar: currency1 = " + currency1);
	
	var debitAccountPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN';
	debitAccount = getValueFromPath(Document, debitAccountPath);
	logger.info("b2bPacs004ExtractVar: debitAccount = " + debitAccount);
	
	var creditAccountPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN';
	creditAccount = getValueFromPath(Document, creditAccountPath);
	logger.info("b2bPacs004ExtractVar: creditAccount = " + creditAccount);
	
	custom12 = "RETN";
	if(fileAmtNum){
		setHeader(map,"PLCN_fileAmountNum",fileAmtNum);
	}
	if(fileAmt){
		setHeader(map,"PLCN_fileAmount",fileAmt);
	}
	totalBtchAmt = getHeader (map,"PLCN_totalAmountOfBatch");
	if(totalBtchAmt){
		if(totalBtchAmt == "0.0"){
			setHeader(map,"PLCN_totalAmountOfBatch",amount1);
			logger.info("b2bPacs004ExtractVar: PLCN_totalAmountOfBatch = " + amount1);
		}
	}
	
	var msgFefUsedFlag = memTblGetTableValue(map,"FLAG-TABLE", "Msg_Def_to_be_used");
	logger.info("b2bPacs004ExtractVar: msgFefUsedFlag = " + msgFefUsedFlag);
	
	if(msgFefUsedFlag == "FULL"){
		var amount2Path = '/Document/PmtRtr/TxInf/RtrdIntrBkSttlmAmt';
		amount2 = getValueFromPath(Document, amount2Path);
		logger.info("b2bPacs004ExtractVar: amount2 = " + amount2);
		
		var currency2Path = '/Document/PmtRtr/TxInf/RtrdIntrBkSttlmAmt/@Ccy';
		currency2 = getValueFromPath(Document, currency2Path);
		logger.info("b2bPacs004ExtractVar: currency2 = " + currency2);
	}
	var orgnlEndToEndIdPath = '/Document/PmtRtr/TxInf/RtrId';
	orgnlEndToEndId = getValueFromPath(Document, orgnlEndToEndIdPath);
	logger.info("b2bPacs004ExtractVar: orgnlEndToEndId = " + orgnlEndToEndId);
	var orgnlMsgNmId1;
	if(orgnlMsgNmId) {
		orgnlMsgNmId1 = orgnlMsgNmId.substr(0,3)
	}
	if(orgnlMsgNmId1 == "003"){
		var finOrgGrpBicPath = '/Document/PmtRtr/GrpHdr/InstgAgt/FinInstnId/BIC';
		finOrgGrpBic = getValueFromPath(Document, finOrgGrpBicPath);
		logger.info("b2bPacs004ExtractVar: finOrgGrpBic = " + finOrgGrpBic);
	}
	if(!finOrgGrpBic){
		var finOrgGrpBic2Path = '/Document/PmtRtr/GrpHdr/InstdAgt/FinInstnId/BIC';
		finOrgGrpBic = getValueFromPath(Document, finOrgGrpBic2Path);
		logger.info("b2bPacs004ExtractVar: finOrgGrpBic = " + finOrgGrpBic);
	}
	var finOrgPmtBicPath = '/Document/PmtRtr/OrgnlGrpInf/RtrRsnInf/Orgtr/Id/OrgId/AnyBIC';
	finOrgPmtBic = getValueFromPath(Document, finOrgPmtBicPath);
	logger.info("b2bPacs004ExtractVar: finOrgPmtBic = " + finOrgPmtBic);
	
	/* var orgGrpIntPtyBicPath = '/Document/PmtRtr/GrpHdr/InstgAgt/FinInstnId/BIC';
	orgGrpIntPtyBic = getValueFromPath(Document, orgGrpIntPtyBicPath); */
	
	institutionId = getHeader (map,"PLCN_institutionId");
	logger.info("b2bPacs004ExtractVar: institutionId = " + institutionId); 
	
	var dbtOrgIdBicPath = '/Document/PmtRtr/OrgnlGrpInf/RtrRsnInf/Orgtr/Id/OrgId/AnyBIC';
	dbtOrgIdBic = getValueFromPath(Document, dbtOrgIdBicPath);
	logger.info("b2bPacs004ExtractVar: dbtOrgIdBic = " + dbtOrgIdBic);
	
	if(!dbtOrgIdBic){
		institutionId = getHeader (map,"PLCN_institutionId");
		if(institutionId){
			dbtOrgIdBic = institutionId;
			logger.info("b2bPacs004ExtractVar: dbtOrgIdBic = " + dbtOrgIdBic);
		}
	}
	/* (ASSIGN PMTINF_EXECDATE "IN.ROUTE_MESSAGE.TxInf[0].OrgnlTxRef[0].ReqdExctnDt")
	 (ASSIGN CRDT_INSTRID "IN.ROUTE_MESSAGE.TxInf[0].RtrId")
	 (ASSIGN CRDT_INSTRID (REPLACESPECIALCHARTOXML CRDT_INSTRID)) */
	extractC2BVariables(Document, map,accNum,accNum1,detailsName,uId);
	c2bExtPainDbtrAgnt(Document, map,finOrgGrpBic,finOrgPmtBic,orgGrpIntPtyBic,"");
	c2bExtractPmtInfId(Document, map,pmtInfId);
	extractAmount(exchange,amount1,amount2);
	extractCurrency(Document, map,currency1,currency2);
	var accountCr = creditAccount;
	var accountDr = debitAccount;
	
	if(orgnlEndToEndId){
		setHeader(map,"PLCN_trabsRefNo",orgnlEndToEndId);
		logger.info("b2bPacs004ExtractVar: PLCN_trabsRefNo = " + orgnlEndToEndId);
		setHeader(map,"PLCN_custom2",orgnlEndToEndId);
		logger.info("b2bPacs004ExtractVar: PLCN_custom2 = " + orgnlEndToEndId);
		tempTrans = orgnlEndToEndId;
		setHeader(map,"PLCN_mtchTransRefNo",orgnlEndToEndId);
		logger.info("b2bPacs004ExtractVar: PLCN_mtchTransRefNo = " + orgnlEndToEndId);
	}
	else{
		setHeader(map,"PLCN_trabsRefNo",orgnlMsgId);
		logger.info("b2bPacs004ExtractVar: PLCN_trabsRefNo = " + orgnlMsgId);
		setHeader(map,"PLCN_custom2",orgnlMsgId);
		logger.info("b2bPacs004ExtractVar: PLCN_custom2 = " + orgnlMsgId);
		tempTrans = orgnlMsgId;
		setHeader(map,"PLCN_mtchTransRefNo",orgnlMsgId);
		logger.info("b2bPacs004ExtractVar: PLCN_mtchTransRefNo = " + orgnlMsgId);
	}
	msgDirection = getHeader (map,"PLCN_massageDirection");
	logger.info("b2bPacs004ExtractVar: msgDirection = " + msgDirection);
	if(msgDirection == "O"){
		mtchMsgDirection = "I";
	}
	if(msgDirection == "I"){
		mtchMsgDirection = "O";
		setHeader(map,"PLCN_txnType","D");
		if(mode == "REPAIR"){
			txnMtchParam = institutionId + "|" + orgnlMsgId + orgnlEndToEndId + "|" + amount1 + currency1 + "|" + mtchMsgDirection + "|M" ;
			setHeader(map,"PLCN_txnMtchParam",txnMtchParam);
		}
	}
	else{
		setHeader(map,"PLCN_txnType","C");
	}
	setHeader(map,"PLCN_messageDirection",msgDirection);
	logger.info("b2bPacs004ExtractVar: PLCN_messageDirection = " + msgDirection);
	setHeader(map,"PLCN_mtchMessageDirection",mtchMsgDirection);
	logger.info("b2bPacs004ExtractVar: PLCN_mtchMessageDirection = " + mtchMsgDirection);
	setHeader(map,"PLCN_orgMsgType",orgnlMsgId);
	logger.info("b2bPacs004ExtractVar: PLCN_orgMsgType = " + orgnlMsgId);
	setHeader(map,"PLCN_btchStatus",custom12);
	logger.info("b2bPacs004ExtractVar: PLCN_btchStatus = " + custom12);
	setHeader(map,"PLCN_txnStatusQual",custom12);
	logger.info("b2bPacs004ExtractVar: PLCN_txnStatusQual = " + custom12);
	setHeader(map,"PLCN_statusQual",custom12);
	setHeader(map,"PLCN_custom12",custom12);
	logger.info("b2bPacs004ExtractVar: PLCN_statusQual = " + custom12);
	setHeader(map,"PLCNAPI_custom12",custom12);
	
	setHeader(map,"PLCN_matchReqFlag","Y");
	grpSts = memTblGetTableValue(map, "GRP_STS");
	if(grpSts){
		setHeader(map,"PLCN_grpSts",grpSts);
	}
	txnSts = memTblGetTableValue(map, "TXN_STS");
	if(txnSts){
		setHeader(map,"PLCN_txnSts",txnSts);
	}
	setHeader(map,"PLCN_accountNumber",creditAccount);
	setHeader(map,"PLCN_accountNum",debitAccount);
	setHeader(map,"PLCN_fileRefNum",msgId);
	
	var benBankNamePath = '/Document/PmtRtr/TxInf/OrgnlTxRef/Dbtr/Nm';
	benBankNameName = getValueFromPath(Document, benBankNamePath);
	
	var benAddr1Path = '/Document/PmtRtr/TxInf/OrgnlTxRef/Dbtr/PstlAdr/AdrLine';
	benAddr1 = getValueFromPath(Document, benAddr1Path);
	
	var benAddr2Path = '/Document/PmtRtr/TxInf/OrgnlTxRef/Dbtr/PstlAdr/AdrLine[0]';
	benAddr2 = getValueFromPath(Document, benAddr2Path);
	
	var benAddr3Path = '/Document/PmtRtr/TxInf/OrgnlTxRef/Dbtr/PstlAdr/AdrLine[1]';
	benAddr3 = getValueFromPath(Document, benAddr3Path);
	
	var benAddr4Path = '/Document/PmtRtr/TxInf/OrgnlTxRef/Dbtr/PstlAdr/AdrLine[2]';
	benAddr4 = getValueFromPath(Document, benAddr4Path);
	
	var payerNamePath = '/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/Nm';
	payerName = getValueFromPath(Document, payerNamePath);
	
	var payerAddr1Path = '/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/PstlAdr/AdrLine[0]';
	payerAddr1 = getValueFromPath(Document, payerAddr1Path);
	
	var payerAddr2Path = '/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/PstlAdr/AdrLine[1]';
	payerAddr2 = getValueFromPath(Document, payerAddr2Path);
	
	var payerAddr3Path = '/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/PstlAdr/AdrLine[2]';
	payerAddr3 = getValueFromPath(Document, payerAddr3Path);
	
	var bankName = 
	
	setHeader(map,"PLCN_benbankName",benBankName);
	setHeader(map,"PLCN_benAddr1",benAddr1);
	setHeader(map,"PLCN_benAddr2",benAddr2);
	setHeader(map,"PLCN_benAddr3",benAddr3);
	setHeader(map,"PLCN_benAddr4",benAddr4);
	
	setHeader(map,"PLCN_payerName",payerName);
	setHeader(map,"PLCN_payerAddr1",payerAddr1);
	setHeader(map,"PLCN_payerAddr2",payerAddr2);
	setHeader(map,"PLCN_payerAddr3",payerAddr3);
	
	if(tempTrans) {
		var key1 = tempTrans.concat("");
	}
	if(key1 && msgId){
		custom2one = key1.concat(msgId);
	}
	if(msgDirection == "O"){
		setHeader(map,"PLCN_custom2Trans",custom2one);
	}
	// if(msgDirection == "I"){
	// 	setHeader(map,"PLCN_acctNumber",accountCr);
	// 	setHeader(map,"PLCN_accountcr",accountCr);
	// 	setHeader(map,"PLCN_accountcr",accountCr);
	// 	setHeader(map,"PLCN_accountNumber",accountDr);
	// 	setHeader(map,"PLCN_accountdr",accountDr);
	// }else{
	// 	setHeader(map,"PLCN_acctNumber",accountDr);
	// 	setHeader(map,"PLCN_accountCr",accountCr);
	// 	setHeader(map,"PLCN_accountNum",accountCr);
	// 	setHeader(map,"PLCN_accountNumber",accountDr);
	// 	setHeader(map,"PLCN_accountDr",accountDr);
	// }
	
	flType = getHeader (map,"PLCN_fileType");
	if(flType){
		if(flType == "DB-NL-REP-IN" || flType == "STS-UPLD-IN"){
			setHeader(map,"PLCN_fileRefNum",msgId);
		}
		if(flType == "SEPA-STS-RPT"){
			msgId = getHeader (map,"PLCN_transRefNo");
			setHeader(map,"PLCN_fileRefNum",msgId);
		}
	}
	return "T";
}

function b2bPacs007ExtractVar(exchange) {
	var msg;
	var custom12;
	custom12 = "RVRS";

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	msgdbMap = new HashMap();
	
/* 	var dbtrName;
	dbtrName = "";
	dbtrName = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Dbtr/Nm';
	logger.info("b2bPacs007ExtractVar: dbtrName = " + dbtrName);
	setHeader(map, "PLCN_debtorName", dbtrName);
	
	var dbtrIban;
	dbtrName = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN';
	logger.info("b2bPacs007ExtractVar: dbtrName = " + dbtrName);
	setHeader(map, "PLCN_accountDr", dbtrIban);
	
	var cdtrName;
	cdtrName = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/Cdtr/Nm';
	logger.info("b2bPacs007ExtractVar: cdtrName = " + cdtrName);
	setHeader(map, "PLCN_creditorName", cdtrName);
	
	var CdtrIban;
	CdtrIban = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN';
	logger.info("b2bPacs007ExtractVar: CdtrIban = " + CdtrIban);
	setHeader(map, "PLCN_accountCr", CdtrIban); */
	
	setHeader(map, "PLCN_btchStatus", custom12);
	setHeader(map, "PLCN_txnStatusQual", custom12);
	setHeader(map, "PLCN_custom12", custom12);
	setHeader(map, "PLCNAPI_custom12", custom12);
}

function extractCurrency(Document, map,currency1,currency2) {
	var retVal = 0;
	var currency;
	
	if(currency1){
		currency = currency1;
	}
	if(!currency1 && currency2){
		currency = currency2;
	}
	if(currency){
		setHeader(map,"PLCN_currency",currency);
		setHeader(map,"PLCN_mtchCurrency",currency);
	}
	return retVal;
}

/* function extractCurrency(Document, map,currency1,currency2) {
	var retVal = 0;
	var currency;
	
	if(currency1){
		currency = currency1;
	}
	if(!currency1 && currency2){
		currency = currency2;
	}
	if(currency){
		setHeader(map,"PLCN_currency",currency);
		setHeader(map,"PLCN_mtchCurrency",currency);
	}
	return retval;
} */

function c2bExtractPmtInfId(Document, map,pmtInfId) {
	var retVal = 0;
	var pmtInfId;

	if(pmtInfId){
		setHeader(map,"PLCN_pmtInfId",pmtInfId);
	}
	return retVal;
}

function extractC2BVariables(Document, map,accNum,accNum1,detailsName,uId) {
	var retVal = 0;
	
	setHeader(map,"PLCN_accoutNum","");
	setHeader(map,"PLCN_prtyName","");
	setHeader(map,"PLCN_uId","");
	
	if(accNum){
		setHeader(map,"PLCN_accoutNum",accNum);
	}
	else{
		setHeader(map,"PLCN_accoutNum",accNum1);
	}
	
	if(detailsName){
		setHeader(map,"PLCN_prtyName",detailsName);
	}
	if(uId){
		setHeader(map,"PLCN_uId",uId);
	}
	return retVal;
}

function c2bExtPainDbtrAgnt(Document, map,bic1,bic2,bic3,bic4) {
	var retVal = 0;
	var tempBic;
	var bic;
	var dbtrAgntPresent = "";
	var dbtrAgtBic;
	var rcvrBic;
	var sndrBic;
	var msgType;
	var countryCode;
	var institutionId;
	var senderBic;
	
	msgType = getHeader (map,"PLCN_msgType");
	if(bic1){
		bic = bic1;
		dbtrAgntPresent = "Y";
	}
	if(dbtrAgntPresent != "Y" && bic2){
		bic = bic2;
		dbtrAgntPresent = "Y";
	}
	if(dbtrAgntPresent != "Y" && bic3){
		bic = bic3;
		dbtrAgntPresent = "Y";
	}
	if(dbtrAgntPresent != "Y" && bic4){
		bic = bic4;
		dbtrAgntPresent = "Y";
	}
	if(bic){
		dbtrAgtBic = bic;
		if(msgType == "Pacs008" || msgType.substr(0, 8) == "pacs.008"){
			if(dbtrAgtBic){
				rcvrBic = dbtrAgtBic;
				if(rcvrBic){
					setHeader(map,"PLCN_rcvrBic",rcvrBic);
					setHeader(map,"PLCN_correspondent",rcvrBic);
					countryCode = rcvrBic.substr(5,2);
					if(countryCode){
						setHeader(map,"PLCN_countryCode",countryCode);
					}
				}
			}
		}
		if(msgType == "Pacs004" || msgType.substr(0, 8) == "pacs.004"){
			if(dbtrAgtBic){
				sndrBic = dbtrAgtBic;
				if(sndrBic){
					setHeader(map,"PLCN_sndrBic",sndrBic);
					setHeader(map,"PLCN_correspondent",sndrBic);
				}
				if(!sndrBic){
					var sndrBicPath = '/Document/PmtRtr/GrpHdr/InstgAgt/FinInstnId/BIC';
					sndrBic = getValueFromPath(Document, sndrBicPath);
					if(!sndrBic){
						sndrBic = getHeader (map,"PLCN_sender");
					}
					if(!sndrBic){
						memTblGetTableValue(map, "DBLK_PARAM_TBL", "PAIN002-SENDER");
						if(sndrBic){
							setHeader(map,"PLCN_sender",sndrBic);
						}
					}
					setHeader(map,"PLCN_sndrBic",sndrBic);
					setHeader(map,"PLCN_correspondent",sndrBic);
				}
			}
		}
		
	}
	return retVal;
}

function dynamicRouteSepa(exchange) {
	var PLCN_validMessage;
	var PLCN_duplicateMessage;
	var PLCN_repairReq;
	var responseCdsDoc;
	var pastDateFlag;
	var ibanBicConsistent;
	var PLCN_repairReq;
	var authLevelKey;
	var orgMessageClassType;
	var arr = [];
	var resFlag = [];
	var result;
	var resultFlag;
	var PLCN_actionReq;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("dynamicRoute: institutionId = " + institutionId);

	ibanBicConsistent = getHeader(map, "PLCN_ibanBicConsistent");
	logger.info("dynamicRoute: ibanBicConsistent = " + ibanBicConsistent);
	
	pastDateFlag = getHeader(map, "PLCN_pastDateFlag");
	logger.info("dynamicRoute: pastDateFlag = " + pastDateFlag);
	logger.info("dynamicRoute: typeof pastDateFlag = " + typeof pastDateFlag);

	orgMessageClassType = getHeader(map , "PLCN_orgMessageClassType");
	logger.trace("dynamicRoute: orgMessageClassType = " + orgMessageClassType);
	logger.info("dynamicRoute: typeof orgMessageClassType = " + typeof orgMessageClassType);

	setHeader(map, "PLCN_duplicateMessage", "false");

	/*if(!pastDateFlag) {
		pastDateFlag = "false";
	}

	logger.info("dynamicRoute: pastDateFlag = " + pastDateFlag);

	if(pastDateFlag == "false") {
		if(ibanBicConsistent == "false") {
			PLCN_repairReq = "true";
			setHeader(map, "PLCN_repairReq", "true");
		}else {
			PLCN_repairReq = "false";
			setHeader(map, "PLCN_repairReq", "false");
	    }
	}else {
		PLCN_repairReq = "true";
		setHeader(map, "PLCN_repairReq", "true");
	}*/

	PLCN_validMessage = getHeader(map, "PLCN_validMessage");
	PLCN_duplicateMessage = getHeader(map, "PLCN_duplicateMessage");
	//PLCN_repairReq = getHeader(map, "PLCN_repairReq");
	PLCN_actionReq = "Y";

	logger.info("dynamicRoute: PLCN_validMessage = " + PLCN_validMessage);
	logger.info("dynamicRoute: PLCN_duplicateMessage = " + PLCN_duplicateMessage);
	logger.info("dynamicRoute: PLCN_repairReq = " + PLCN_repairReq);

	logger.info("dynamicRoute: typeof PLCN_validMessage = " + typeof PLCN_validMessage);
	logger.info("dynamicRoute: typeof PLCN_duplicateMessage = " + typeof PLCN_duplicateMessage);
	logger.info("dynamicRoute: typeof PLCN_repairReq = " + typeof PLCN_repairReq);

	responseCdsDoc = getHeader(map, "ACEDB_responseCdsDoc");
	//logger.info("dynamicRoute: responseCdsDoc = " + responseCdsDoc);

	if(PLCN_validMessage == "true" &&  PLCN_duplicateMessage == "true" && PLCN_actionReq == "Y") {
		logger.info("dynamicRoute: Duplicate required");
		setHeader(map, "PLCN_actionReqFinal", "false");
		setHeader(map, "PLCN_validFlag", "false");
		setHeader(map, "PLCN_queueAudit", "MXDUPLQ");
	}else if(PLCN_validMessage == "true" &&  PLCN_duplicateMessage == "true" && PLCN_actionReq == "N") {
		logger.info("dynamicRoute: Duplicate required 1");
		setHeader(map, "PLCN_actionReqFinal", "false");
		setHeader(map, "PLCN_validFlag", "false");
		setHeader(map, "PLCN_queueAudit", "MXDUPLQ");
	}else if(PLCN_validMessage == "true" &&  PLCN_duplicateMessage == "false" && PLCN_actionReq == "N") {
		logger.info("dynamicRoute: No action required");
		setHeader(map, "PLCN_actionReqFinal", "false");
		setHeader(map, "PLCN_validFlag", "true");
		//setHeader(map, "PLCN_queueAudit", "ABC");
	}else if(PLCN_validMessage == "true" &&  PLCN_duplicateMessage == "false" && PLCN_actionReq == "Y") {
		logger.info("dynamicRoute: Action required");
		setHeader(map, "PLCN_actionReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "true");
		setHeader(map, "PLCN_queueAudit", "TMPBALQ1");
	}else if(PLCN_validMessage == "false" &&  PLCN_duplicateMessage == "true" && PLCN_actionReq == "Y") {
		logger.info("dynamicRoute: no Action required");
		setHeader(map, "PLCN_actionReqFinal", "false");
		setHeader(map, "PLCN_validFlag", "false");
		//setHeader(map, "PLCN_queueAudit", "ERRORQ");
		//inMsg.setBody(responseCdsDoc);
	}else if(PLCN_validMessage == "false" &&  PLCN_duplicateMessage == "true" && PLCN_actionReq == "N") {
		logger.info("dynamicRoute: no Action required");
		setHeader(map, "PLCN_actionReqFinal", "false");
		setHeader(map, "PLCN_validFlag", "false");
		//setHeader(map, "PLCN_queueAudit", "ERRORQ");
		//inMsg.setBody(responseCdsDoc);
	}else if(PLCN_validMessage == "false" &&  PLCN_duplicateMessage == "false" && PLCN_actionReq == "Y") {
		logger.info("dynamicRoute: NO Action required");
		setHeader(map, "PLCN_actionReqFinal", "false");
		setHeader(map, "PLCN_validFlag", "false");
		//setHeader(map, "PLCN_queueAudit", "ERRORQ");
		//inMsg.setBody(responseCdsDoc);
	}else if(PLCN_validMessage == "false" &&  PLCN_duplicateMessage == "false" && PLCN_actionReq == "N") {
		logger.info("dynamicRoute: No Action required");
		setHeader(map, "PLCN_actionReqFinal", "false");
		setHeader(map, "PLCN_validFlag", "false");
		//setHeader(map, "PLCN_queueAudit", "ERRORQ");
		//inMsg.setBody(responseCdsDoc);
	}

	
	//var validflag = getHeader(map, 'PLCN_validFlag');
	var sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	logger.info("dynamicRoute: sourceChannelId = " + sourceChannelId);
	
	//For Manual Upload
	if(sourceChannelId == 'SWIFT_MX_UPL_IN' || sourceChannelId == 'SWIFT_UPL_IN') {
		if(PLCN_validMessage == 'true' || PLCN_duplicateMessage == 'true') {
			setHeader(map, "PLCN_queueAudit", "MXREPRQ");
			setHeader(map, "PLCN_repairReqFinal", "true");
			setHeader(map, "PLCN_validFlag", "false");
			setHeader(map, "PLCN_ISOUTPUT", "N");
		}
	}

    var txnComments = getHeader(map, "PLCN_txnComments"); //"P00-1P32-1:A00:00-9505:A00:32-6012:A00:32-6013";
	var haseValue = memTblGetTableValue(map, "FLAG-TABLE", "CBPR_T2_CHECK_VIOLATIONS");
	logger.info("dynamicRoute: haseValue = " + haseValue);
	logger.info("dynamicRoute: haseValue.length = " + haseValue.length);

	if(haseValue) {
		for(var j = 0; haseValue.length > 1 ; j++) {
			var value = dataBetweenTokens("|", "|", haseValue);
			logger.info("dynamicRoute: value = " + haseValue);

			arr[j] = value;
			logger.info("dynamicRoute: arr[j] = " + arr[j]);

			haseValue = removePattern(haseValue, "|" + value);
			logger.info("dynamicRoute: haseValue = " + haseValue);
		}

		logger.info("dynamicRoute: arr = " + arr);
		logger.info("dynamicRoute: arr.length = " + arr.length);

		for(var i = 0; i < arr.length; i++) {
			logger.info("dynamicRoute: arr.length = " + arr.length);
			logger.info("dynamicRoute: txnComments = " + txnComments);
			result = isPatternPresent(txnComments, arr[i]);
			logger.info("dynamicRoute: result = " + result);

			if(result == true) {
				logger.info("T2 Qualified but BIC nor derived");
				queue = "MXREPRQ";
				setHeader(map, "PLCN_queueAudit", "MXREPRQ");
				setHeader(map, "PLCN_repairReqFinal", "true");
			}
		}
	}

	if(!queue) {
		if(PLCN_validMessage == "false"){
			if(orgMessageClassType != "") {
				queue = "MXREPRQ";
				setHeader(map, "PLCN_queueAudit", "MXREPRQ");
				setHeader(map, "PLCN_repairReqFinal", "true");
			}else {
				setHeader(map, "PLCN_queueAudit", "ERRORQ");
				setHeader(map, "PLCN_displayFlag", "Y");
				setHeader(map, "PLCN_processingStage", "ERR");
				setHeader(map, "PLCN_ERRORQ", true);
				setHeader(map, "PLCN_repairReqFinal", "true");
			}
		}			
	}

	var queue = getHeader(map, "PLCN_queueAudit");
	logger.info("dynamicRoute: queue = " + queue);

	if(queue == "MXREPRQ") {
		authLevelKey = institutionId + "."+ "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL.STAGES.REPAIR" + "." + "STAGE_ACCESS_CONTROL";
    	logger.info("dynamicRoute: authLevelKey = " + authLevelKey);
    }else {
		authLevelKey = institutionId + "."+ "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL.STAGES.DUPLICATE" + "." + "STAGE_ACCESS_CONTROL";
    	logger.info("dynamicRoute: authLevelKey = " + authLevelKey);
    }

    var authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
    logger.info("dynamicRoute: authLevelValue = " + authLevelValue);

    if(!authLevelValue) {
        authLevelKey = institutionId + "."+ institutionId + "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL" + "." + "INSTITUTION_ACCESS_CONTROL";
        logger.info("dynamicRoute: authLevelKey = " + authLevelKey);

        authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
        logger.info("dynamicRoute: authLevelValue = " + authLevelValue);      
    }

    authLevelValue = textToNum(authLevelValue);
    logger.info("dynamicRoute: authLevelValue = " + authLevelValue);

	if(queue == "MXREPRQ") {
		setHeader(map, "PLCN_displayFlag", "Y");
		setHeader(map, "PLCN_processingStage", "REPR");
		setHeader(map, "PLCN_currentAuthLevel", "REPR=" + authLevelValue);
		setHeader(map, "PLCN_MXREPRQ", true);
	}else if(queue == "MXDUPLQ") {
		setHeader(map, "PLCN_displayFlag", "Y");
		setHeader(map, "PLCN_processingStage", "DUPL");
		setHeader(map, "PLCN_currentAuthLevel", "DUPL=" + authLevelValue);
		setHeader(map, "PLCN_MXDUPLQ", true);
	}

	logger.info("dynamicRoute: PLCN_repairReqFinal = " + getHeader(map, "PLCN_repairReqFinal"));
	logger.info("dynamicRoute: PLCN_validFlag = " + getHeader(map, "PLCN_validFlag"));
	logger.info("dynamicRoute: PLCN_validFlag = " + getHeader(map, "PLCN_actionReqFinal"));

	var xsdValid = getHeader(map, "XSD_VALID");
	logger.info("dynamicRoute: xsdValid = " + xsdValid);

	/*if(xsdValid == false) {
		setHeader(map, "PLCN_validFlag", false);
	}*/

	if(getHeader(map, "PLCN_validFlag") == "true") {
		logger.info("dynamicRoute: PLCN_queueAudit = " + getHeader(map, "PLCN_queueAudit"));
	}

	logger.info("dynamicRoute: PLCN_ERRORQ = " + getHeader(map, "PLCN_ERRORQ"));
	logger.info("dynamicRoute: PLCN_MXREPRQ = " + getHeader(map, "PLCN_MXREPRQ"));
	logger.info("dynamicRoute: PLCN_MXDUPLQ = " + getHeader(map, "PLCN_MXDUPLQ"));
}

function setRejectFileFlag(exchange) {
	logger.info("In setRejectFileFlag rule..");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var validMessage;
	var fileDebulkFlag;
	var rejectFileFlag;

	validMessage = getHeader(map, "PLCN_validMessage");
	logger.info("setRejectFileFlag: validMessage flag = " + validMessage);
	
	//logger.info("setRejectFileFlag: properties  = " + exchange.getProperties());
	var fDebulkData = exchange.getProperty("Plcn_FileDebulkData");
	var fdUniqueId = fDebulkData.getUnique_ID();
	logger.info("setRejectFileFlag: fdUniqueId  = " + fdUniqueId);
	var fdErrorCount = fDebulkData.getErrorCount();
	logger.info("setRejectFileFlag: fdErrorCount = " + fdErrorCount);

	// for(var i = 0; i<= 100; i++) {
	// 	if(validMessage == "true") {
	// 		setHeader(map, "PLCN_rejectFileFlag", "false");
	// 	} else {
	// 		fdErrorCount++;
	// 		logger.info("setRejectFileFlag: fdErrorCount = " + fdErrorCount);
	// 		fDebulkData.setErrorCount(fdErrorCount);
	// 	}
	// }

    var institutionId = getHeader(map, "PLCN_institutionId");
    logger.info("setRejectFileFlag: institutionId = " + institutionId);
    var totalErrorCountLimitKey = institutionId + ".MESSAGE_PROCESSING.FUNCTIONALITY.VALIDATIONS.FILE_ERROR_COUNT_THRESHOLD";
    var totalErrorCountLimit = memTblGetTableValue(map, "INST_PARAM", totalErrorCountLimitKey);
    logger.info("setRejectFileFlag: totalErrorCountLimit = " + totalErrorCountLimit);
    
    if(!totalErrorCountLimit) {
		totalErrorCountLimit = 100;
	}
    
	if(fdErrorCount > totalErrorCountLimit) {
		setHeader(map, "PLCN_rejectFileFlag", "true");
		fDebulkData.setRejectFileFlag(true);
	}else {
		setHeader(map, "PLCN_rejectFileFlag", "false");
		fDebulkData.setRejectFileFlag(false);	
	}

	logger.info("setRejectFileFlag: rejectFileFlag = " + rejectFileFlag);

	logger.info("setRejectFileFlag done.");
}

function b2bPacs002ExtractVar(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;

	logger.info("In b2bPacs002ExtractVar");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var message = convertDocumentToString(Document);
	
	var msgDirection;
	var grpSts;
	var txnSts;
	var msgId;
	var orgnlMsgId;
	var orgnlMsgNmId;
	var date;
	var amount1;
	var amount2;
	var currency1;
	var currency2;
	var orgnlEndToEndId;
	var pmtInfId;
	var flType;
	var orgGrpIntPtyBic;
	var finBic = "";
	var dbtOrgIdBic = "";
	var pmtInfExecDate = "";
	var crdtInstrId = "";
	var accNum = "";
	var accNum1 = "";
	var detailsName = "";
	var uId = "";
	var finOrgGrpBic;
	var finOrgPmtBic;
	var institutionId;
	var totalBtchAmt;
	var msgType;
	var channelIdSource;
	var msgIdPath;
	
	
	msgType = memTblGetTableValue(map,"MSG_TYPE", "MSG_TYPE");
	channelIdSource = getHeader (map,"PLCN_channelIdSource");
	
	if(isPatternPresent(msgType, "pacs.002") && (channelIdSource == "SEPA-Ib" || channelIdSource == "BE SEPA In" || channelIdSource == "BE SEPA In NFA" || channelIdSource == "Equens SEPA In" || channelIdSource == "Equens SEPA In NFA" || channelIdSource == "EQUENS_SEPA_IN" || channelIdSource == "IB_SDD_STSRPT_IN" || channelIdSource == "SNTD_SEPA_STS_IN")){
		msgIdPath = "/Document/FIToFIPmtStsRpt/GrpHdr/MsgId";
		msgId = getValueFromPath(Document, msgIdPath);
		logger.info("b2bPacs002ExtractVar: msgId = " + msgId);
	}
	
	var IntrBkSttlmAmtPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt';
	var IntrBkSttlmAmt = getValueFromPath(Document, IntrBkSttlmAmtPath);
	logger.info("b2bPacs002ExtractVar: IntrBkSttlmAmt = " + IntrBkSttlmAmt);
	
	setHeader(map,"PLCN_priorityAmount",IntrBkSttlmAmt);
	setHeader(map,"PLCNAPI_priorityAmount",IntrBkSttlmAmt);
	setHeader(map,"PLCN_amount",IntrBkSttlmAmt);
	setHeader(map,"PLCN_priorityAmountNum",IntrBkSttlmAmt);
	

	var orgnlMsgIdPath = '/Document/FIToFIPmtStsRpt/OrgnlGrpInfAndSts/OrgnlMsgId';
	orgnlMsgId = getValueFromPath(Document, orgnlMsgIdPath);
	logger.info("b2bPacs002ExtractVar: orgnlMsgId = " + orgnlMsgId);
	
	var orgnlMsgNmIdPath = '/Document/FIToFIPmtStsRpt/OrgnlGrpInfAndSts/OrgnlMsgNmId';
	orgnlMsgNmId = getValueFromPath(Document, orgnlMsgNmIdPath);
	logger.info("b2bPacs002ExtractVar: orgnlMsgNmId = " + orgnlMsgNmId);
	
	pmtInfId = orgnlMsgId;
	
	var datePath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/IntrBkSttlmDt';
	date = getValueFromPath(Document, datePath);
	logger.info("b2bPacs002ExtractVar: date = " + date);
	if(!date){
		var datePath2 = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/ReqdColltnDt';
		date = getValueFromPath(Document, datePath2);
		logger.info("b2bPacs002ExtractVar: date = " + date);
	}
	
	if(date) {
		date = date.replace("-","");
	}
	setHeader(map,"PLCN_valueDate",date);
	setHeader(map,"PLCN_priotityDate",date);
	setHeader(map,"PLCNAPI_priotityDate",date);
	
	extractValueDateC2b(exchange,date);
	
	var amount1Path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/Amt/InstdAmt/@Ccy';
	amount1 = getValueFromPath(Document, amount1Path);
	logger.info("b2bPacs002ExtractVar: amount1 = " + amount1);
	
	if(!amount1){
		var amount1Path2 = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt/@Ccy';
		amount1 = getValueFromPath(Document, amount1Path2);
		logger.info("b2bPacs002ExtractVar: amount1 = " + amount1);
	}
	
	var chargePath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/ChrgsInf/Amt';
	var chargeAmount = getValueFromPath(Document, chargePath);
	logger.info('b2bPacs002ExtractVar: chargeAmount = ' + chargeAmount);
	setHeader(map,"PLCN_pacs002Charges",chargeAmount);
	setHeader(map,"PLCNAPI_pacs002Charges",chargeAmount);
		
	var pacs002IntrBkSttlmDtPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/IntrBkSttlmDt';
	var pacs002IntrBkSttlmDt = getValueFromPath(Document, pacs002IntrBkSttlmDtPath);
	logger.info("b2bPacs002ExtractVar: pacs002IntrBkSttlmDt = " + pacs002IntrBkSttlmDt);
	
	pacs002IntrBkSttlmDt = pacs002IntrBkSttlmDt.replace("-","");
	setHeader(map,"PLCN_valueDate",pacs002IntrBkSttlmDt);
	
	totalBtchAmt = getHeader (map,"PLCN_totalAmountOfBatch");
	if(totalBtchAmt == "0.0"){
		setHeader(map,"PLCN_totalAmountOfBatch",amount1);
	}
	
	var msgDefUsedFlag = memTblGetTableValue(map,"FLAG-TABLE", "Msg_Def_to_be_used");
	logger.info("b2bPacs002ExtractVar: msgDefUsedFlag = " + msgDefUsedFlag);
	if(msgDefUsedFlag == "FULL"){
		var amount2Path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/Amt/EqvtAmt/Amt';
		amount2 = getValueFromPath(Document, amount2Path);
		logger.info("b2bPacs002ExtractVar: amount2 = " + amount2);
		
		var currency2Path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/Amt/EqvtAmt/Amt/@Ccy';
		currency2 = getValueFromPath(Document, currency2Path);
		logger.info("b2bPacs002ExtractVar: currency2 = " + currency2);
	}
	
	var currency1Path = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/Amt/InstdAmt/@Ccy';
	currency1 = getValueFromPath(Document, currency1Path);
	logger.info("b2bPacs002ExtractVar: currency1 = " + currency1);
	
	if(!currency1){
		var currency1Path2 = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt/@Ccy';
		currency1 = getValueFromPath(Document, currency1Path2);
		logger.info("b2bPacs002ExtractVar: currency1 = " + currency1);
	}
	
	var orgnlEndToEndIdPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlEndToEndId';
	orgnlEndToEndId = getValueFromPath(Document, orgnlEndToEndIdPath);
	logger.info("b2bPacs002ExtractVar: orgnlEndToEndId = " + orgnlEndToEndId);
	
	var orgnlInstrIdPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlInstrId';
	orgnlInstrId = getValueFromPath(Document, orgnlInstrIdPath);
	logger.info("b2bPacs002ExtractVar: orgnlInstrId = " + orgnlInstrId);
	
	var orgnlTxIdPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxId';
	orgnlTxId = getValueFromPath(Document, orgnlTxIdPath);
	logger.info("b2bPacs002ExtractVar: orgnlTxId = " + orgnlTxId);
		
		finOrgPmtBic = "";
		/* var orgGrpIntPtyBicPath = '/Document/PmtRtr/GrpHdr/InstgAgt/FinInstnId/BIC';
		orgGrpIntPtyBic = getValueFromPath(Document, orgGrpIntPtyBicPath); */
		
		var dbtOrgIdBicPath = '/Document/FIToFIPmtStsRpt/OrgnlGrpInfAndSts/StsRsnInf/Orgtr/Id/OrgId/AnyBIC';
		dbtOrgIdBic = getValueFromPath(Document, dbtOrgIdBicPath);
		logger.info("b2bPacs002ExtractVar: dbtOrgIdBic = " + dbtOrgIdBic);
		
		var pmtInfExecDatePath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/ReqdExctnDt';
		var pmtInfExecDate = getValueFromPath(Document, pmtInfExecDatePath);
		logger.info("b2bPacs002ExtractVar: pmtInfExecDate = " + pmtInfExecDate);
		
		var crdtInstrIdPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/StsId';
		crdtInstrId = getValueFromPath(Document, crdtInstrIdPath);
		logger.info("b2bPacs002ExtractVar: crdtInstrId = " + crdtInstrId);
	

	
	if(!dbtOrgIdBic){
		institutionId = getHeader (map,"PLCN_institutionId");
		logger.info("b2bPacs002ExtractVar: institutionId = " + institutionId);
		dbtOrgIdBic = institutionId ;
		logger.info("b2bPacs002ExtractVar: dbtOrgIdBic = " + dbtOrgIdBic);
	}
	
	//sub-rules
	//extractC2BVariables(Document, map,accNum,accNum1,detailsName,uId);
	//c2bExtPainDbtrAgnt(Document, map,bic1,bic2,bic3,bic4);
	//(C2B_EXT_PAIN_DBTR_BIC DBT_ORGID_BIC);             ;;;SENDER/RECIEVER BIC
	//(C2B_CTRL_PAIN_TO_PAIN PMTINF_EXECDATE CRDT_INSTRID);    ;;;COUNTRY CODE,TRANSACTIONTYPE,VALUEDATE, PRIORITY AMOUNT VAR POPULATED BY ALBIN,
	//c2bExtractPmtInfId(Document, map,pmtInfId);
	//extractAmount(exchange,amount1,amont2);
	///extractCurrency(Document, map,currency1,currency2);
	
	//extractValueDateC2b(exchange,date);
	
	if(orgnlTxId){
		setHeader(map,"PLCN_transRefNo",orgnlTxId);
		logger.info("b2bPacs002ExtractVar: PLCN_transRefNo = " + orgnlTxId);
		/* setHeader(map,"PLCN_custom2",orgnlTxId);
		logger.info("b2bPacs002ExtractVar: PLCN_custom2 = " + orgnlTxId);
		tempTrans = orgnlTxId; */
		setHeader(map,"PLCN_mtchTransRefNo",orgnlTxId);
		logger.info("b2bPacs002ExtractVar: PLCN_mtchTransRefNo = " + orgnlTxId);
	}
	else{
		setHeader(map,"PLCN_transRefNo",orgnlMsgId);
		logger.info("b2bPacs002ExtractVar: PLCN_transRefNo = " + orgnlMsgId);
		/* setHeader(map,"PLCN_custom2",orgnlMsgId);
		logger.info("b2bPacs002ExtractVar: PLCN_custom2 = " + orgnlMsgId);
		tempTrans = orgnlMsgId; */
		setHeader(map,"PLCN_mtchTransRefNo",orgnlMsgId);
		logger.info("b2bPacs002ExtractVar: PLCN_mtchTransRefNo = " + orgnlMsgId);
	}
	
	setHeader(map,"PLCN_mtchMessageDirection","I");
	setHeader(map,"PLCN_orgMsgType",orgnlMsgId);
	logger.info("b2bPacs002ExtractVar: PLCN_orgMsgType = " + orgnlMsgId);
	setHeader(map,"PLCN_matchReqFlag","Y");
	grpSts = memTblGetTableValue(map,"StreamTable", "GRP_STS");
	grpSts = memTblGetTableValue(map,"StreamTable", "GRP_STS");
	setHeader(map,"PLCN_grpSts",grpSts);
	logger.info("b2bPacs002ExtractVar: PLCN_grpSts = " + grpSts);
	txnSts = memTblGetTableValue(map,"StreamTable", "TXN_STS");
	txnSts = memTblGetTableValue(map,"StreamTable", "TXN_STS");
	setHeader(map,"PLCN_txnSts",txnSts);
	logger.info("b2bPacs002ExtractVar: PLCN_txnSts = " + txnSts);
	
	flType = getHeader (map,"PLCN_fileType");
	if(flType){
		if(flType == "DB-NL-REP-IN" || flType == "STS-UPLD-IN"){
			setHeader(map,"PLCN_fileRefNum",msgId);
		}
		if(flType == "SEPA-STS-RPT"){
			msgId = getHeader (map,"PLCN_transRefNo");
			setHeader(map,"PLCN_fileRefNum",msgId);
		}
	}
}

function calculateFileBatchTotal(exchange) {
    logger.info("In calculateFileBatchTotal rule..");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var fbatchDetails;

	//fbatchDetails = new FileBatchDetails();

    let batch = [];    
    batch = exchange.getIn().getBody();
    logger.info("calculateFileBatchTotal: batch = " +  batch);
    var fDebulkData = exchange.getProperty("Plcn_FileDebulkData");
    logger.info("calculateFileBatchTotal: fDebulkData = " +  fDebulkData);

    var i;
	logger.info("calculateFileBatchTotal: batch length = " +  batch.length);

    for(i=0; i < batch.length; i++) {
        var aggrMsg = batch[i];
        if(aggrMsg == null)
            continue;
        
        var msgbody = aggrMsg.getMessage();
        //logger.info("calculateFileBatchTotal: msgbody = " +  msgbody);

        var myhdr = aggrMsg.getHeader();
        //logger.info("calculateFileBatchTotal: myhdr = " +  myhdr);
        
        var batchMsgdbId = getHeader(myhdr, "Plcn_FileBatchMsgDBID");
		batchMsgdbId = parseInt(batchMsgdbId);
        logger.info("calculateFileBatchTotal: batchMsgdbId = " +  batchMsgdbId);

		// fbatchDetails = new FileBatchDetails(batchMsgdbId);
		// logger.info("calculateFileBatchTotal: fbatchDetails = " +  fbatchDetails);

        FileBatchDetails = fDebulkData.getFileBatch(batchMsgdbId);
		logger.info("calculateFileBatchTotal: FileBatchDetails = " +  FileBatchDetails);

        var amount = getHeader(myhdr, "PLCN_txnBatchAmount");
        amount = parseInt(amount);
        logger.info("calculateFileBatchTotal: amount = " +  amount);

        var totalAmount;
        if(FileBatchDetails) {
		 	totalAmount = FileBatchDetails.getTotalAmount();
		}
		logger.info("calculateFileBatchTotal: totalAmountNew = " +  totalAmount);

		totalAmount += amount;
		if(FileBatchDetails) {
			FileBatchDetails.setTotalAmount(totalAmount);
		}
        logger.info("calculateFileBatchTotal: get total Amount = " +  FileBatchDetails.getTotalAmount());
		logger.info("calculateFileBatchTotal: Type of TotalAmount = " +  typeof totalAmount);
		//FileBatchDetails.totalAmount = totalAmountNew;
		//logger.info("calculateFileBatchTotal: totalAmount = " +  FileBatchDetails.totalAmount);

        var txnCount = FileBatchDetails.getTxnCount();
		txnCount = txnCount + 1;
		logger.info("calculateFileBatchTotal: txnCount before increment = " +  FileBatchDetails.txnCount);
		FileBatchDetails.setTxnCount(txnCount);
		//FileBatchDetails.txnCount += 1;
        logger.info("calculateFileBatchTotal: txnCount = " +  FileBatchDetails.getTxnCount());
    }
	logger.info("calculateFileBatchTotal: get total Amount after batch completion = " +  FileBatchDetails.getTotalAmount());
	logger.info("calculateFileBatchTotal: txnCount after batch completion = " +  FileBatchDetails.getTxnCount());
    logger.info("calculateFileBatchTotal completed");
}

function pacs03Pacs07CustomMatchingParameters (exchange, msgType)
{
	
	logger.info("In pacs03Pacs07CustomMatchingParameters rule..");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	var institutionId;
	var mtchTransRefNo;
	var mtchCurrency;
	var mtchMessageDirection;
	var priorityAmountNum;
	var txnMtchParam;
	var fileTransRefNo;
	var totalAmount;
	var intrBkSttimDt;
	var msgDirection1;
	var msgDirection;
	var mtchAmt;
	var mtchAmt1;
	var fileOrgMsgId;
	var msgModeIn;
	var txnCustom2;
	var msgRefCust2;
	var txnRefCust2;
	var transRefNo;
	
	setHeader(map, "PLCN_txnMtchParam", "");
	mtchCurrency = getHeader(map, "PLCN_msgCurrency");
	if(!mtchCurrency){
		mtchCurrency = getHeader(map, "PLCN_currencyToDb");
	}
	priorityAmountNum = getHeader(map, "PLCN_msgPriorityAmountNum");
	if(!priorityAmountNum){
		priorityAmountNum = getHeader(map, "PLCN_priorityAmountNum");
	}
	
	institutionId = getHeader(map, "PLCN_institutionId");
	mtchTransRefNo = getHeader(map, "PLCN_msgTransRefNo");
	msgDirection = getHeader(map, "PLCN_msgDirection");
	mtchTransRefNo = getHeader(map, "PLCN_msgTransRefNo");
	txnMtchParam = institutionId + "|" + "mtchTransRefNo" + "|" + "priorityAmountNum" + "|" + "mtchCurrency" + "|" + "I" + "|" + "M" + "|" + "|" + "|" + "mtchTransRefNo";
	
	var msgIdRef;
	if(isPatternPresent(msgType == "PACS.003.001.02")){
		msgRefCust2 = "Document/FIToFICstmrDrctDbt/GrpHdr/MsgId";
		var fileTransRefNoPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CxlId';
		var fileTransRefNo = getValueFromPath(Document, fileTransRefNoPath);
		var mtchTransRefNoPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/PmtId/TxId';
		var mtchTransRefNo = getValueFromPath(Document, mtchTransRefNoPath);
		var mtchAmtPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/IntrBkSttlmAmt';
		var mtchAmt = getValueFromPath(Document, mtchAmtPath);
		mtchAmt = mtchAmt.trim();
		mtchAmt1 = mtchAmt.length();
		priorityAmountNum = mtchAmt.substring(11, mtchAmt1);
		
		if(mtchTransRefNo && fileTransRefNo){
			txnCustom2 = msgRefCust2 + " " + "mtchTransRefNo";
		}
		if(!mtchCurrency){
			mtchCurrency = getHeader(map, "PLCN_mtchCurrency");
		}
		if(priorityAmountNum){
			setHeader(map, "PLCN_priorityAmount", priorityAmountNum);
			setHeader(map, "PLCN_priorityAmountNum", priorityAmountNum);
		}
		if(!mtchTransRefNo){
			mtchTransRefNo = getHeader(map, "PLCN_orgnlTxId");
		}
		if(mtchTransRefNo && msgRefCust2){
			mtchTransRefNo = msgRefCust2 + " " + "mtchTransRefNo";
		}
		if(!priorityAmountNum){
			priorityAmountNum = getHeader(map, "PLCN_orgnlIntrbkSttimAmt");
		}
		if(!mtchCurrency){
			mtchCurrency = getHeader(map, "PLCN_mtchCurrency");
		}
		if((!mtchCurrency) || (mtchCurrency == "XXX")){
			var mtchCurrencyPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/IntrBkSttlmAmt/Ccy';
			var mtchCurrency = getValueFromPath(Document, mtchCurrencyPath);
		}
		txnMtchParam = mtchTransRefNo + "|" + priorityAmountNum + "|" + mtchCurrency + "|" + msgDirection + "M";
		
		if(isPatternPresent(msgType == "PACS.007.001.02")){
		msgRefCust2 = "Document/FIToFIPmtRvsl/GrpHdr/MsgId";
		var txnRefCust2Path = '/Document/FIToFIPmtRvsl/TxInf/RvslId';
		var txnRefCust2 = getValueFromPath(Document, txnRefCust2Path);
		var fileTransRefNoPath = '/Document/FIToFIPmtRvsl/TxInf/OrgnlEndToEndId';
		var fileTransRefNo = getValueFromPath(Document, fileTransRefNoPath);
		var fileOrgMsgIdPath = '/Document/FIToFIPmtRvsl/OrgnlGrpInf/OrgnlMsgId';
		var fileOrgMsgId = getValueFromPath(Document, fileOrgMsgIdPath);
		var mtchTransRefNoPath = '/Document/FIToFIPmtRvsl/TxInf/OrgnlTxId';
		var mtchTransRefNo = getValueFromPath(Document, mtchTransRefNoPath);
		var mtchAmtPath = '/Document/FIToFIPmtRvsl/TxInf/RvsdIntrBkSttlmAmt';
		var mtchAmt = getValueFromPath(Document, mtchAmtPath);
		mtchAmt = mtchAmt.trim();
		mtchAmt1 = mtchAmt.length();
		priorityAmountNum = getHeader(map, "PLCN_priorityAmountNum");
		
		if(mtchTransRefNo && msgRefCust2){
			txnCustom2 = msgRefCust2 + " " + "mtchTransRefNo";
		}
		if(!mtchCurrency){
			mtchCurrency = getHeader(map, "PLCN_mtchCurrency");
		}
		transRefNo = getHeader(map, "PLCN_tranRefNo");
		if(!transRefNo){
			setHeader(map, "PLCN_tranRefNo", mtchTransRefNo);
		}
		if(priorityAmountNum){
			setHeader(map, "PLCN_priorityAmount", priorityAmountNum);
			setHeader(map, "PLCN_priorityAmountNum", priorityAmountNum);
		}
		if(!mtchTransRefNo){
			mtchTransRefNo = getHeader(map, "PLCN_orgnlTxId");
		}
		if(mtchTransRefNo && msgRefCust2){
			mtchTransRefNo = msgRefCust2 + " " + "mtchTransRefNo";
		}
		if(!priorityAmountNum){
			priorityAmountNum = getHeader(map, "PLCN_orgnlIntrbkSttimAmt");
		}
		if(!mtchCurrency){
			mtchCurrency = getHeader(map, "PLCN_mtchCurrency");
		}
		if((!mtchCurrency) || (mtchCurrency == "XXX")){
			var mtchCurrencyPath = '/Document/FIToFIPmtRvsl/TxInf/RvsdIntrBkSttlmAmt/Ccy';
			var mtchCurrency = getValueFromPath(Document, mtchCurrencyPath);
			setHeader(map, "PLCN_mtchCurrency", mtchCurrency);
		}
		txnMtchParam = mtchTransRefNo + "|" + priorityAmountNum + "|" + mtchCurrency + "|" + msgDirection + "|M";
		
		}
	}
	setHeader(map, "PLCN_txnMtchParam", txnMtchParam);
	setHeader(map, "PLCN_txnCustom2", txnCustom2);
	
	return "0";
}

function priorityAmountForFile(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;
	var amt;
	var amtPath;

	logger.info("In priorityAmountForFile");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var message = convertDocumentToString(Document);
	
	var msgdbMap = new HashMap();
	
	var msgDirection = readMsgdb.get("MESSAGEDIRECTION");
	logger.info("priorityAmountForFile: msgDirection = " + msgDirection);
	
	var msgClassType = getHeader(map, "PLCN_messageClassType");
	if(!msgClassType){
		msgClassType = readMsgdb.get("MESSAGECLASSTYPE");
	}
	logger.info("priorityAmountForFile: msgClassType = " + msgClassType);
	
	if(msgClassType == 'pacs.002.001.10'){
		amtPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt';
		amt = getValueFromPath(Document, amtPath);
		logger.info("priorityAmountForFile: amt = " + amt);
	}else if(msgClassType == "pacs.003.001.08"){
		logger.info("priorityAmountForFile: msgClassType = pacs.003.001.08");
		amtPath = '/Document/FIToFICstmrDrctDbt/GrpHdr/TtlIntrBkSttlmAmt';
		var amt = getValueFromPath(Document, amtPath);
		logger.info('priorityAmountForFile: amt = ' + amt);
	}else if(msgClassType == "pacs.007.001.09"){
		logger.info("priorityAmountForFile: msgClassType = pacs007.001.09");
		amtPath = '/Document/FIToFIPmtRvsl/GrpHdr/TtlRvsdIntrBkSttlmAmt';
		var amt = getValueFromPath(Document, amtPath);
		logger.info('priorityAmountForFile: amt = ' + amt);
	}
	
	return amt;
	//msgdbMap.put("PRIORITYDATE", valueDate);
}

function deriveNostroAccountNumber(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;
	var bic;
	var nostroAccountNumber;
	var msgType;
	var msgDirection;
	var institutionId;
	var sepaDefaultBic;
	var parentSepaDefaultBic;
	var accInputChannel;

	logger.info("In deriveNostroAccountNumber");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	msgType = getHeader(map, "PLCN_msgType");
	msgType = msgType.trim();
	logger.info("deriveNostroAccountNumber: msgType = " + msgType);

	institutionId = getHeader(map,"PLCN_institutionId");
	logger.info("deriveNostroAccountNumber: institutionId = " + institutionId);

	var msgDirection = getHeader(map, "PLCN_msgDirection");
 	logger.info("deriveNostroAccountNumber: msgDirection = " + msgDirection);

	sepaDefaultBic = institutionId + ".DEFAULT.SEPA.BIC.PRODUCTS";
	sepaDefaultBic = memTblGetTableValue(map, "INST_PARAM",sepaDefaultBic);
	logger.info("deriveNostroAccountNumber: sepaDefaultBic = " + sepaDefaultBic);

	if(msgDirection == "O"){
		bic = getHeader(map, "PLCN_sender");
	}
	if(msgDirection == "I"){
		bic = getHeader(map, "PLCN_receiver");
	}
	logger.info("deriveNostroAccountNumber: bic = " + bic);
	
	if(isPatternPresent(sepaDefaultBic, "RZBAATWW")){
		setHeader(map, "PLCN_glNostroAccount", "641010");
	}
	
	if(isPatternPresent(sepaDefaultBic, "BKAUATWW")){
		setHeader(map, "PLCN_glNostroAccount", "641002");
	}
	
	if(isPatternPresent(sepaDefaultBic, "NABAATWW")){
		setHeader(map, "PLCN_glNostroAccount", "641013");
	}
	
	if(isPatternPresent(bic, "RZBAATWW")){
		setHeader(map, "PLCN_glNostroAccount", "641010");
	}
	
	if(isPatternPresent(bic, "BKAUATWW")){
		setHeader(map, "PLCN_glNostroAccount", "641002");
	}
	
	if(isPatternPresent(bic, "NABAATWW")){
		setHeader(map, "PLCN_glNostroAccount", "641013");
	}

	//FOR TESTING 
	if(bic == "NOTPROVIDED"){
		bic = "NOT-PROVIDED";
	}

	if(msgType == 'pacs.008.001.08' || msgType == 'camt.056.001.08' || msgType == 'camt.029.001.09' || msgType == 'pacs.003.001.08'|| msgType == 'pacs.007.001.09' || msgType == 'pacs.004.001.09') {
		bic = institutionId + "_" + bic;
		nostroAccountNumber = memTblGetTableValue(map, "ACCOUNT_MASTER",bic);
		accInputChannel = memTblGetTableValue(map, "ACC_MASTER_CHANNEL",bic);
		logger.info("deriveNostroAccountNumber: nostroAccountNumber = " + nostroAccountNumber);
		logger.info("deriveNostroAccountNumber: accInputChannel = " + accInputChannel);

		if(!nostroAccountNumber){
			bic = institutionId + "_" + sepaDefaultBic;
			nostroAccountNumber = memTblGetTableValue(map, "ACCOUNT_MASTER",bic);
			accInputChannel = memTblGetTableValue(map, "ACC_MASTER_CHANNEL",bic);
			logger.info("deriveNostroAccountNumber: nostroAccountNumber 2 = " + nostroAccountNumber);
			logger.info("deriveNostroAccountNumber: accInputChannel 2 = " + accInputChannel);		
		}
	}

	if(accInputChannel){
		setHeader(map, "PLCN_custom37", accInputChannel);
	}
	if(nostroAccountNumber){
		setHeader(map, "PLCN_nostroAccNo", nostroAccountNumber);
		setHeader(map, "PLCN_nostroAccountNumber", nostroAccountNumber);
		logger.info("deriveNostroAccountNumber: nostroAccountNumber = " + nostroAccountNumber);
	}
}

function encryptDBOperation(exchange, msgdbMap) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	var customer = getHeader(map, "PLCN_customer");
}

function parseFieldJs(exchange,fld,parseString, secLvl, runEnv,key) {
	var institutionId;
	var encodedMessage ;
	var messageReference;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In parseFieldJs");

	//ENCODING
	var helper = new JSHelperClass();
	var msgstr = convertDocumentToString(Document);
	//var encodedMessage = Base64.getEncoder().encodeToString(helper.getBytes(msgstr));

	messageType = getHeader(map, "PLCN_msgType");
	logger.info("parseFieldJs: messageType: " + messageType);

	messageReference = getHeader(map, "PLCN_messageNo");
	logger.info("parseFieldJs: messageReference: " + messageReference);

	//var parseString1 = "IBAN AT841981010000051130";
	
	var parseString1 = parseString;

	var document = getDocument();
	var acew = createElement(document, "KbMsg");
	appendElementtoNode(document, acew);
	
	var messageRef = createElementwithTextNode(document, acew, "MsgRef", messageReference);
	appendElementtoNode(acew, messageRef);

	var ptyInfo = createElementwithTextNode(document, acew, "PtyInfo", "");
	appendElementtoNode(acew, ptyInfo);

	var prtyFldNm = createElementwithTextNode(document, ptyInfo, "PrtyFldNm", fld);
	appendElementtoNode(ptyInfo, prtyFldNm);

	var requestCode = createElementwithTextNode(document, ptyInfo, "RequestCode", "CUSTOM");
	appendElementtoNode(ptyInfo, requestCode);

	var refDb = createElementwithTextNode(document, ptyInfo, "RefDB", runEnv);
	appendElementtoNode(ptyInfo, refDb);

	var secLvl = createElementwithTextNode(document, ptyInfo, "SecLevel", secLvl);
	appendElementtoNode(ptyInfo, secLvl);

	var str1 = createElementwithTextNode(document, ptyInfo, "Str", parseString1);
	appendElementtoNode(ptyInfo, str1);

	var key1 = createElementwithTextNode(document, ptyInfo, "Key", key);
	appendElementtoNode(ptyInfo, key1);

	//2nd

	/*var ptyInfo1 = createElementwithTextNode(document, acew, "PtyInfo", "");
	appendElementtoNode(acew, ptyInfo1);

	var prtyFldNm1 = createElementwithTextNode(document, ptyInfo1, "PrtyFldNm", fld);
	appendElementtoNode(ptyInfo, prtyFldNm1);

	var requestCode1 = createElementwithTextNode(document, ptyInfo1, "RequestCode", "CUSTOM");
	appendElementtoNode(ptyInfo, requestCode1);

	var refDb1 = createElementwithTextNode(document, ptyInfo1, "RefDB", runEnv);
	appendElementtoNode(ptyInfo, refDb1);

	var secLvl1 = createElementwithTextNode(document, ptyInfo1, "SecLevel", secLvl);
	appendElementtoNode(ptyInfo, secLvl1);

	var str2 = createElementwithTextNode(document, ptyInfo1, "Str", baseIban);
	appendElementtoNode(ptyInfo, str2);

	var key2 = createElementwithTextNode(document, ptyInfo1, "Key", ":SAP");
	appendElementtoNode(ptyInfo, key2);*/

	/*	var value2 = createElementwithTextNode(document, ptyInfo1, "VALUE", "RESULT1");
	appendElementtoNode(ptyInfo, value2);*/

	var request = convertDocumentToString(document);
	logger.info("parseFieldJs: request = " + request);

	if(isPatternPresent(request, "xml version")){
		request1 = dataBetweenTokens("<KbMsg>","</KbMsg>",request);
		request2 = "<KbMsg>" + request1 + "</KbMsg>";
		logger.info("parseFieldJs: request2 = " + request2);

	}

	setHeader(map, "PLCN_ParseRequest", request2);

	return request;
}

//This function sets violation in case of expetion
function setExceptionViolation(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	logger.info("In setExceptionViolation");

	var authenticationException = getHeader(map,"PLCN_authenticationException");
	logger.info("setExceptionViolation: authenticationException = " + authenticationException);

	if(authenticationException != "") {
		authenticationException = authenticationException.toString();

		if(authenticationException == "true") {
			setCommentsForTransaction("00", "10650", map);
		}
	}

	var polyglotException = getHeader(map,"PLCN_polyglotException");
	logger.info("setExceptionViolation: polyglotException = " + polyglotException);

	if(polyglotException != "") {
		polyglotException = polyglotException.toString();

		if(polyglotException == "true") {
			setCommentsForTransaction("00", "2408", map);
		}
	}

	var genericException = getHeader(map,"PLCN_GENERIC_EXCEPTION");
	logger.info("setExceptionViolation: genericException = " + genericException);

	if(genericException != "") {
		genericException = genericException.toString();

		if(genericException == "true") {
			setCommentsForTransaction("00", "2408", map);
		}
	}

	var httpException = getHeader(map,"PLCN_httpException");
	logger.info("setExceptionViolation: httpException = " + httpException);

	if(httpException != "") {
		httpException = httpException.toString();

		if(httpException == "true") {
			setCommentsForTransaction("00", "11708", map);
		}
	}		

	setHeader(map,"PLCN_processingStage", "ERR");
	setHeader(map, "PLCN_queueAudit", "ERRORQ");
}

function customValidations(exchange) {
	logger.info("In customValidations rule.");

	var inMsg = exchange.getIn();
	
	var map = inMsg.getHeaders();
	//logger.trace("customValidations: map = " + map);
	var msgdbMap = new HashMap();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	//logger.trace("customValidations: readMsgdb = " + readMsgdb);

	var messageString = inMsg.getBody(java.lang.String.class);
	//logger.info("customValidations: messageString = " + messageString);

	var flag = memTblGetTableValue(map, "FLAG-TABLE", "SEPA_BIC_DERIVATION_NIBC");
	logger.info("customValidations: flag = " + flag);

	var messageDirection = readMsgdb.get("MESSAGEDIRECTION");
	logger.info("customValidations: messageDirection = " + messageDirection);

	if(flag == "Y") {
		if(messageDirection == "I") {
			bicDerivationPacsOutboundNew(exchange);
		}else {
			bicDerivationPacsInboundNew(exchange);
		}
	}else {
		setHeader(map, "PLCN_validFlag", true);
	}	
}

function bicDerivationPacsOutboundNew(exchange){
	logger.info("In bicDerivationPacsOutboundNew rule.");

	var inMsg = exchange.getIn();
	
	var map = inMsg.getHeaders();
//	logger.trace("bicDerivationPacsOutboundNew: map = " + map);
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var messageString = inMsg.getBody(java.lang.String.class);
	//logger.info("bicDerivationPacsOutboundNew: messageString = " + messageString);


	var startOfFile;
	var queueId;
	var status;
	var institutionCheck;
	var processingStage;
	var comments;
	var temp;
	var bic;

	startOfFile = memTblGetTableValue(map, "GENERAL", "START_OF_FILE");
	logger.info("bicDerivationPacsOutboundNew: startOfFile = " + startOfFile);
	if(!startOfFile) {
		startOfFile = "YES";
	}
	if(startOfFile != "YES") {
		setHeader(map, "PLCN_validFlag", true);
	}

	if(isPatternPresent(messageString, "<InstgAgt>")) {
		temp = dataBetweenTokens("<InstgAgt>", "</InstgAgt>", messageString);
		logger.info("bicDerivationPacsOutboundNew: temp = " + temp);
		bic = dataBetweenTokens("<BICFI>", "</BICFI>", temp);
		logger.info("bicDerivationPacsOutboundNew: bic = " + bic);
		institutionCheck = memTblGetTableValue(map, "BIC_INST_LOCMAP_MAP", bic);
		logger.info("bicDerivationPacsOutboundNew: institutionCheck = " + institutionCheck);
		if(!institutionCheck && isPatternPresent(bic, "XXX")) {
			bic = removePattern(bic, "XXX");
			institutionCheck = institutionCheck = memTblGetTableValue(map, "BIC_INST_LOCMAP_MAP", bic);
			logger.info("bicDerivationPacsOutboundNew: institutionCheck = " + institutionCheck);
		}
		if(!institutionCheck) {
			logger.info("bicDerivationPacsOutboundNew: institution id not found file move to ERRFILEQ ..");
			setHeader(map, "PLCN_fileQueueId", "ERRFILEQ");
			setHeader(map, "PLCN_fileStatus", "69");
			setHeader(map, "PLCN_processingStage", "ERR");
			setHeader(map, "PLCN_validFlag", false);
			setHeader(map, "PLCN_rejectFileFlag", true);
			comments = setCommentsForTransaction("001", "7863",map);
			setHeader(map, "PLCN_fileComments", comments);
		}else {
			logger.info("bicDerivationPacsOutboundNew: institution id found, file going for splitting ..");
			setHeader(map, "PLCN_rejectFileFlag", false);
			setHeader(map, "PLCN_validFlag", true);
		}
	}else {
		setHeader(map, "PLCN_fileQueueId", "ERRFILEQ");
		setHeader(map, "PLCN_fileStatus", "69");
		setHeader(map, "PLCN_processingStage", "ERR");
		setHeader(map, "PLCN_validFlag", false);
		setHeader(map, "PLCN_rejectFileFlag", true);
		comments = setCommentsForTransaction("001", "7863",map);
		setHeader(map, "PLCN_fileComments", comments);
	}
	logger.info("bicDerivationPacsOutboundNew completed..");
}

function bicDerivationPacsInboundNew(exchange){
	logger.info("In bicDerivationPacsInboundNew rule.");

	var inMsg = exchange.getIn();
	
	var map = inMsg.getHeaders();
	//logger.trace("bicDerivationPacsInboundNew: map = " + map);
	var msgdbMap = new HashMap();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var messageString = inMsg.getBody(java.lang.String.class);
	//logger.info("bicDerivationPacsInboundNew: messageString = " + messageString);

	var startOfFile;
	var queueId;
	var status;
	var institutionCheck;
	var processingStage;
	var comments;
	var temp;
	var bic;

	startOfFile = memTblGetTableValue(map, "GENERAL", "START_OF_FILE");
	logger.info("bicDerivationPacsInboundNew: startOfFile = " + startOfFile);
	if(!startOfFile) {
		startOfFile = "YES";
	}
	if(startOfFile != "YES") {
		setHeader(map, "PLCN_validFlag", false);
	}

	if(isPatternPresent(messageString, "<InstdAgt>")) {
		temp = dataBetweenTokens("<InstdAgt>", "</InstdAgt>", messageString);
		logger.info("bicDerivationPacsInboundNew: temp = " + temp);
		bic = dataBetweenTokens("<BICFI>", "</BICFI>", temp);
		logger.info("bicDerivationPacsInboundNew: bic = " + bic);
		institutionCheck = memTblGetTableValue(map, "BIC_INST_LOCMAP_MAP", bic);
		logger.info("bicDerivationPacsInboundNew: institutionCheck = " + institutionCheck);
		if(!institutionCheck && isPatternPresent(bic, "XXX")) {
			bic = removePattern(bic, "XXX");
			institutionCheck = institutionCheck = memTblGetTableValue(map, "BIC_INST_LOCMAP_MAP", bic);
			logger.info("bicDerivationPacsInboundNew: institutionCheck = " + institutionCheck);
		}
		if(!institutionCheck) {
			setHeader(map, "PLCN_fileQueueId", "ERRFILEQ");
			setHeader(map, "PLCN_fileStatus", "69");
			setHeader(map, "PLCN_processingStage", "ERR");
			setHeader(map, "PLCN_validFlag", false);
			setHeader(map, "PLCN_rejectFileFlag", true);
			comments = setCommentsForTransaction("001", "7863",map);
			setHeader(map, "PLCN_fileComments", comments);
		}else {
			setHeader(map, "PLCN_rejectFileFlag", "false");
			setHeader(map, "PLCN_validFlag", "true");
		}
	}else {
		setHeader(map, "PLCN_fileQueueId", "ERRFILEQ");
		setHeader(map, "PLCN_fileStatus", "69");
		setHeader(map, "PLCN_processingStage", "ERR");
		setHeader(map, "PLCN_validFlag", false);
		setHeader(map, "PLCN_rejectFileFlag", true);
		comments = setCommentsForTransaction("001", "7863",map);
		setHeader(map, "PLCN_fileComments", comments);
	}
	logger.info("bicDerivationPacsInboundNew completed..");
}

function driveCurrentValueDateRule(exchange,priorityDate) {
	logger.info("In driveCurrentValueDateRule rule.");

	var inMsg = exchange.getIn();
	
	var map = inMsg.getHeaders();
	//msgdbMap = new HashMap();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var pastYear;
	var pastMonth;
	var pastDay;
	// var messageString = inMsg.getBody(java.lang.String.class);
	// logger.trace("driveCurrentValueDateRule: messageString = " + messageString);
	logger.info("driveCurrentValueDateRule: Type of priorityDate = " + typeof priorityDate);

	var currentDate = new Date();
	logger.info("driveCurrentValueDateRule: currentDate = " + currentDate);

	if(priorityDate) {
		pastYear = priorityDate.substr(0,4);
		logger.info("driveCurrentValueDateRule: pastYear = " + pastYear);

		pastMonth = priorityDate.substr(4,6);
		logger.info("driveCurrentValueDateRule: pastMonth = " + pastMonth);

		pastDay = priorityDate.substr(6,7);
		logger.info("driveCurrentValueDateRule: pastDay = " + pastDay);
	}
    var convertedDate = new Date();

	var currentYear = currentDate.getFullYear();
	logger.info("driveCurrentValueDateRule: currentYear = " + currentYear);
	
	var currentMonth = currentDate.getMonth() + 1;
	logger.info("driveCurrentValueDateRule: currentMonth = " + currentMonth);
	
	var currentDay = currentDate.getDate();
	logger.info("driveCurrentValueDateRule: currentDay = " + currentDay);

	convertedDate = currentYear + "" + (currentMonth < 10 ? "0" : "") + currentMonth + "" + (currentDay < 10 ? "0" : "") + currentDay;; 
	logger.info("driveCurrentValueDateRule: Converted Date = " + convertedDate);
	logger.info("driveCurrentValueDateRule: Type of Converted Date = " + typeof convertedDate);
	
	// if(currentYear < pastYear || currentMonth < pastMonth.substr(0,2) || ((currentDay < 10 ? "0" : "") + currentDay) < pastDay) {
	// 	logger.info("driveCurrentValueDateRule: Priority Date is future date..");
	// 	setHeader(map, "PLCN_futureDate", true);
	// 	return priorityDate;
	// }else {
	// 	logger.info("driveCurrentValueDateRule: Priority Date is Current Date..");
	// 	setHeader(map, "PLCN_futureDate", false);
	// }

	var todayDate = getDate();
	logger.info("driveCurrentValueDateRule: todayDate = " + todayDate);

	if(priorityDate > todayDate) {
		logger.info("driveCurrentValueDateRule: Priority Date is future date..");
		setHeader(map, "PLCN_futureDate", true);
		return priorityDate;
	}else {
		logger.info("driveCurrentValueDateRule: Priority Date is Current Date..");
		setHeader(map, "PLCN_futureDate", false);
	}

	if(currentYear != pastYear || currentMonth != pastMonth || currentDay != pastDay) {
		 return convertedDate;
	}else {
		return priorityDate;
	}
	logger.info("driveCurrentValueDateRule Completed ");
}

function checkRejectFlag(exchange) {
	logger.info("In checkRejectFlag rule.");

	var inMsg = exchange.getIn();
	
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var fDebulkData = exchange.getProperty("Plcn_FileDebulkData");
	logger.info("checkRejectFlag:fDebulkData = " + fDebulkData);

	var rejectFlag = fDebulkData.isRejectFileFlag();
	logger.info("checkRejectFlag:rejectFlag = " + rejectFlag);	

	if(fDebulkData && rejectFlag == true) {
		setHeader(map, "PLCN_rejectFileFlag", "true");
	}else {
		setHeader(map, "PLCN_rejectFileFlag", "false");
	}

	logger.info("checkRejectFlag done.");
}

function enrichValueDate(exchange) {
	var currDate;
	var msgDate;
	var msgType;
	var msgDatePath;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var stringMessage = inMsg.getBody(java.lang.String.class);
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	logger.info("enrichValueDate: stringMessage = "+ stringMessage);
	
	currDate = getDate();
	logger.info("enrichValueDate: currDate = "+ currDate);
	
	msgType = getHeader(map, "PLCN_msgType");
	if(!msgType){
		msgType = getHeader(map, "msgClsType");
	}
	logger.info("enrichValueDate: msgType = " + msgType);
	
	if(isPatternPresent(msgType, "pacs.008")) {
		msgDate = dataBetweenTokens("<IntrBkSttlmDt>", "</IntrBkSttlmDt>", stringMessage);
		logger.info("enrichValueDate: msgDate = "+ msgDate);
	}
	
	if(isPatternPresent(msgType, "pacs.004")) {
		msgDate = dataBetweenTokens("<IntrBkSttlmDt>", "</IntrBkSttlmDt>", stringMessage);
		logger.info("enrichValueDate: msgDate = "+ msgDate);
	}

	if(isPatternPresent(msgType, "pacs.003")) {
		msgDate = dataBetweenTokens("<IntrBkSttlmDt>", "</IntrBkSttlmDt>", stringMessage);
		logger.info("enrichValueDate: msgDate = "+ msgDate);
	}
	if(isPatternPresent(msgType, "camt.056")) {
		msgDate = dataBetweenTokens("<OrgnlIntrBkSttlmDt>", "</OrgnlIntrBkSttlmDt>", stringMessage);
		logger.info("enrichValueDate: msgDate = "+ msgDate);
	}
	
	if(msgDate) {
		msgDate = replaceAllPattern(msgDate, "-", ""); //2023-10-20
	}
	logger.info("enrichValueDate: msgDate after removing hyphen = "+ msgDate);
	var DD;
	var MM;
	var YY;
	if(msgDate){
		DD = msgDate.substring(6, 8);
		MM = msgDate.substring(4, 6);
		YY = msgDate.substring(0, 4);
	}
	
	var validateDate = isValidDate(YY, MM, DD);
	logger.info("enrichValueDate: validation response = "+ validateDate);
	
	if(validateDate == false)
	{
		msgDate = currDate;
		logger.info("enrichValueDate: msgDate in false loop= "+ msgDate);
		//20231020
		var DD = msgDate.substring(6, 8);
		var MM = msgDate.substring(4, 6);
		var YY = msgDate.substring(0, 4);
		msgDate = YY + "-" + MM + "-" + DD;
		logger.info("enrichValueDate: msgDate after append = "+ msgDate);
		
		if(isPatternPresent(msgType, "pacs.008")) {
			logger.info("enrichValueDate: inside pacs008 loop ");
			msgDatePath = "/Document/FIToFICstmrCdtTrf/GrpHdr/IntrBkSttlmDt";
			setValueInPath(Document, msgDatePath, msgDate);
		}
		
		if(isPatternPresent(msgType, "pacs.004")) {
			msgDatePath = "/Document/PmtRtr/GrpHdr/IntrBkSttlmDt";
			setValueInPath(Document, msgDatePath, msgDate);
		}

		if(isPatternPresent(msgType, "pacs.003")) {
			msgDatePath = '/Document/FIToFICstmrDrctDbt/GrpHdr/IntrBkSttlmDt';
			setValueInPath(Document, msgDatePath, msgDate);
		}
		if(isPatternPresent(msgType, "camt.056")) {
			logger.info("enrichValueDate: inside camt.056 loop ");
			msgDatePath = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlIntrBkSttlmDt";
			setValueInPath(Document, msgDatePath, msgDate);
		}
		setCommentsForTransaction("00", "6909", map);
	}
	var messageBody = convertDocumentToString(Document);
	inMsg.setBody(messageBody);
	setHeader(map, "ACEDB_originalBody", messageBody);
	logger.info("enrichValueDate: function completed ");
}

function isValidDate(year, month, day) {
    if (year < 1000 || year > 9999) {
        return false; // Invalid year
    }
 
    if (month < 1 || month > 12) {
        return false; // Invalid month
    }
 
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
        return false; // Invalid day for the given month and year
    }
 
    return true; // Valid date
}
 