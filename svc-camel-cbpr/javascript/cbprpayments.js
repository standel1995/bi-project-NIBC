load('E:/Pelican_Install_Dir/Pelican/ace.solution.ppay/svc-camel-cbpr/javascript/pelicanxmlutility.js');
load('E:/Pelican_Install_Dir/Pelican/ace.solution.ppay/svc-camel-cbpr/javascript/utility.js');
load('E:/Pelican_Install_Dir/Pelican/ace.solution.ppay/svc-camel-cbpr/javascript/messageRepair.js');
load('E:/Pelican_Install_Dir/Pelican/ace.solution.ppay/svc-camel-cbpr/javascript/authorizationCheck.js');

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

/*
**
* This function is calls ruleGenerateKbJs function.
* @param {CamelExchange} exchange - The exchange.
*/
function populateMetaData(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	logger.info("Message From DB");

	ruleGenerateKbJs(exchange);
	mxClearingId(map);
}

/*
**
* This function is called to fetch values from database and set in header variables.
* @param {CamelExchange} exchange - The exchange.
*/
function ruleGenerateKbJs(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;

	logger.info("In ruleGenerateKbJs");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var messageBody = inMsg.getBody(java.lang.String.class);
	logger.trace("ruleGenerateKbJs: messageBody = " + messageBody);
	setHeader(map, "ACEDB_originalBody", messageBody);

	var msgId =  readMsgdb.get("MSGDB_ID");
	logger.info("ruleGenerateKbJs: msgId = " + msgId);
	setHeader(map, "PLCN_msgDbId", msgId);

	var institutionId =  readMsgdb.get("INSTITUTIONID");
	logger.info("ruleGenerateKbJs: institutionId = " + institutionId);
	setHeader(map, "PLCN_institutionId", institutionId);
	setHeader(map, "PLCNAPI_institutionId", institutionId);

	var msgType = readMsgdb.get("MESSAGECLASSTYPE");
	logger.info("ruleGenerateKbJs: msgType = " + msgType);
	setHeader(map, "PLCN_msgType", msgType);
	setHeader(map, "PLCNAPI_msgType", msgType);	

	var msgDirection = readMsgdb.get("MESSAGEDIRECTION");
	logger.info("ruleGenerateKbJs: msgDirection = " + msgDirection);
	setHeader(map, "PLCN_msgDirection", msgDirection);
	setHeader(map, "PLCNAPI_msgDirection", msgDirection);

	var messageNo = readMsgdb.get("MESSAGENO");
	logger.info("ruleGenerateKbJs: messageNo = " + messageNo);
	setHeader(map, "PLCN_messageNo", messageNo);

	var custom5DuplPrev = readMsgdb.get("CUSTOM5_DUPL");
	logger.info("ruleGenerateKbJs: custom5DuplPrev = " + custom5DuplPrev);
	setHeader(map, "PLCN_custom5Dupl", custom5DuplPrev);

	var sender = readMsgdb.get("SENDER");
	logger.trace("ruleGenerateKbJs: sender = " + sender);
	setHeader(map, "PLCN_sender", sender);
	setHeader(map, "PLCNAPI_sender", sender);

	var receiver = readMsgdb.get("RECEIVER");
	logger.trace("ruleGenerateKbJs: receiver = " + receiver);
	setHeader(map, "PLCN_receiver", receiver);
	setHeader(map, "PLCNAPI_receiver", receiver);

	var currency = readMsgdb.get("CURRENCY");
	logger.info("ruleGenerateKbJs: currency = " + currency);
	setHeader(map, "PLCN_currency", currency);
	setHeader(map, "PLCNAPI_currency", currency);

	var priorityAmount = readMsgdb.get("AMOUNT");
	logger.info("ruleGenerateKbJs: priorityAmount = " + priorityAmount);
	setHeader(map, "PLCN_amount", priorityAmount);

	var priorityDate = readMsgdb.get("PRIORITYDATE");
	logger.info("ruleGenerateKbJs: priorityDate = " + priorityDate);
	setHeader(map, "PLCN_priorityDate", priorityDate);
	setHeader(map, "PLCN_valueDate", priorityDate);
	setHeader(map, "PLCNAPI_priorityDate", priorityDate);

	var transRefNo = readMsgdb.get("TRANSREFNO");
	logger.info("ruleGenerateKbJs: transRefNo = " + transRefNo);
	setHeader(map, "PLCN_transRefNo", transRefNo);
	setHeader(map, "PLCNAPI_transRefNo", transRefNo);

	if(transRefNo){
		setHeader(map, "PLCN_transRefNoMsgdb", "true");
	}
	else{
		setHeader(map, "PLCN_transRefNoMsgdb", "false");
	}

	var mode = readMsgdb.get("MSG_MODE_IN");
	logger.info("ruleGenerateKbJs: mode = " + mode);
	setHeader(map, "PLCN_mode", mode);
	setHeader(map, "PLCNAPI_mode", mode);
	setHeader(map, "PLCN_msgModeIn", mode);
	setHeader(map, "PLCNAPI_msgModeIn", mode);

	var priorityAmount1 = readMsgdb.get("PRIORITYAMOUNT");
	logger.info("ruleGenerateKbJs: priorityAmount1 = " + priorityAmount1);
	setHeader(map, "PLCN_priorityAmount", priorityAmount1);
	setHeader(map, "PLCNAPI_priorityAmount", priorityAmount1);

	/*var msgPriority = readMsgdb.get("PRIORITY");
	logger.info("ruleGenerateKbJs: msgPriority = " + msgPriority);
	setHeader(map, "PLCN_msgPriority", msgPriority);

	var custom11 = readMsgdb.get("PRIORITY");
	logger.info("ruleGenerateKbJs: custom11 = " + custom11);
	setHeader(map, "PLCN_custom11", custom11);*/

	//var manualMode = readMsgdb.get("MANUAL_MODE");
	logger.info("ruleGenerateKbJs: manualMode = " + mode);
	setHeader(map, "PLCN_manualMode", mode);
	
	var stage = readMsgdb.get("PROCESSING_STAGE");
	logger.info("ruleGenerateKbJs: stage = " + stage);
	setHeader(map, "PLCN_stage", stage);

	var queueId = readMsgdb.get("QUEUEID");
	logger.info("ruleGenerateKbJs: queueId = " + queueId);
	setHeader(map, "PLCN_queueId", queueId);

	var channelIdSource = readMsgdb.get("CHANNEL_ID_SOURCE");
	logger.info("ruleGenerateKbJs: channelIdSource = " + channelIdSource);
	setHeader(map, "PLCN_channelIdSource", channelIdSource);
	
	var sourceChannelId = readMsgdb.get("SOURCECHANNELID");
	logger.info("ruleGenerateKbJs: sourceChannelId = " + sourceChannelId);
	setHeader(map, "PLCN_sourceChannelId", sourceChannelId);

	var comments = readMsgdb.get("COMMENTS");
	logger.info("ruleGenerateKbJs: comments = " + comments);
	setHeader(map, "PLCN_txnComments", comments);
	setHeader(map, "PLCNAPI_txnComments", comments);
	setHeader(map, "PLCN_orgnlComments", comments);
	setHeader(map, "PLCNAPI_orgnlComments", comments);

	var custom13 = readMsgdb.get("CUSTOM13");
	logger.info("ruleGenerateKbJs: custom13 = " + custom13);
	setHeader(map, "PLCN_custom13", custom13);

	var prevQueueId = readMsgdb.get("PREVQUEUEID");
	logger.info("ruleGenerateKbJs: prevQueueId = " + prevQueueId);
	setHeader(map, "PLCN_prevQueueId", prevQueueId);
	setHeader(map, "PLCNAPI_prevQueueId", prevQueueId);

	var custom24 = readMsgdb.get("CUSTOM24");
	logger.info("ruleGenerateKbJs: custom24 = " + custom24);

	var derivedProductCode = readMsgdb.get("DERIVED_PRODUCT");
	logger.info("ruleGenerateKbJs: derivedProductCode from db = " + derivedProductCode);

	if(!derivedProductCode) {
		derivedProductCode = drveNibcProductCode(exchange);
		logger.info("ruleGenerateKbJs: derivedProductCode from hazelcast = " + derivedProductCode);
		logger.info("ruleGenerateKbJs: typeof derivedProductCode from hazelcast = " + typeof derivedProductCode);
	}else {
		setHeader(map, "PLCN_productCode", derivedProductCode);
		setHeader(map, "PLCNAPI_productCode", derivedProductCode);
	}

	if(msgType == 'pacs.008.001.08' || msgType == 'pacs.009.001.08' || msgType == 'pacs.004.001.09') {
		b2bExtractVarMx(Document, map);
	}

	var msgFamily =  readMsgdb.get("MSG_FAMILY");
	logger.info("ruleGenerateKbJs: msgFamily = " + msgFamily);
	setHeader(map, "PLCN_msgFamilyDB", msgFamily);
	setHeader(map, "PLCNAPI_msgFamily", msgFamily);	

	var orgMessageClassType =  readMsgdb.get("ORG_MESSAGECLASSTYPE");
	logger.info("ruleGenerateKbJs: orgMessageClassType = " + orgMessageClassType);
	setHeader(map, "PLCN_orgMessageClassType", orgMessageClassType);
	
	if(msgType == "camt.057.001.06") {
		cbprMxCamt057Values(Document, map);
	}

	if(msgDirection == "O") {
		setHeader(map, "PLCN_inboundMessage", true);
		var tmpLog = getHeader(map, "PLCN_inboundMessage");
		logger.info("ruleGenerateKbJs: PLCN_inboundMessage = " + tmpLog);
		logger.info("ruleGenerateKbJs: typeof PLCN_inboundMessage = " + typeof tmpLog);		
	}

	setHeader(map, "PLCN_call", true);
	setHeader(map, "PLCNAPI_call", true);
	setHeader(map, "PLCN_ISINPUT", "Y");
}

/*
**
* This function is called to populate values in database.
* @param {CamelExchange} exchange - The exchange.
*/
function dbOperation(exchange) {
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

	logger.info("In dbOperation");

	inMsg = exchange.getIn();

	//var messageString = inMsg.getBody(java.lang.String.class);
	//logger.info("dbOperation: messageString = " + messageString);

	inMsg = exchange.getIn();
	
	map = inMsg.getHeaders();
	msgdbMap = new HashMap();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	audit = new HashMap();

	logger.info("dbOperation: MSGDB_ID = " + getHeader(map, "PLCN_msgDbId"));

	var msgDirection = getHeader(map, "PLCN_msgDirection");
 	logger.info("dbOperation: msgDirection = " + msgDirection);

	var mode = getHeader(map,"PLCN_mode");
	logger.info("dbOperation: Mode = " + mode);
	
	var custom13 = getHeader(map, "PLCN_custom13");
 	logger.info("dbOperation: custom13 = " + custom13);
	
  	if(custom13) {
 		msgdbMap.put("CUSTOM13", custom13);
 	}
 	if(msgDirection == "I") {
 		msgdbMap.put("TRANSACTIONTYPE", "D");
 	}else {
 		msgdbMap.put("TRANSACTIONTYPE", "C");
 	} 

	var msgBlocks = inMsg.getHeaders().get("ACEQ_READ_MSGBLOCKS");

	institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("dbOperation: institutionId = " + institutionId); 

	sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId);
	logger.info("dbOperation: sourceChannelId = " + sourceChannelId);
	logger.info("dbOperation: channelIdTarget = " + channelIdTarget);

	processId = getHeader(map,"PLCN_processId");
	logger.info("dbOperation: processId = " + processId);

	comments = getHeader(map, "PLCN_txnComments");
	logger.info("dbOperation: comments = " + comments);

	//validMessage = getHeader(map, "PLCN_validMessage");
	var validflag = getHeader(map, "PLCN_validFlag");
	validflag = validflag.toString();
	logger.info("dbOperation: validflag = " + validflag);
	logger.info("dbOperation: typeof validflag = " + typeof validflag);
	
	var queueId = getHeader(map, "PLCN_queue");
	var messageNo = readMsgdb.get("MESSAGENO") 
	logger.info("dbOperation: queueId = " + queueId);
	logger.info("dbOperation: messageNo = " + messageNo);

	var msgDirection = getHeader(map, "PLCN_msgDirection");	
	logger.info("dbOperation: msgDirection = " + msgDirection);

	var mode = getHeader(map,"PLCN_mode");
	logger.info("dbOperation: Message Mode = " + mode);
	
	msgType = getHeader(map, "PLCN_msgType");
	msgType = msgType.trim();
	logger.info("dbOperation: msgType = " + msgType);
	logger.info("dbOperation: data type of msgType = " + typeof msgType);
	
	if(validflag == "true" && msgDirection == "O"){
		//queueId = "PROCDQ";
		logger.info('validflag == "true" && msgDirection == "O"');		
		setHeader(map, "PLCN_queue", "");
	}else if(!queueId && msgType !== "pacs.002.001.10") {
		logger.info("dbOperation: !queueId");
		queueId = "TMPMSGQ";
		setHeader(map, "PLCN_queue", queueId);
	}

	audit.put("MESSAGENO", messageNo);
	audit.put("QUEUEID", queueId);
	//audit.put("USERNAME","ADMIN1");
	audit.put("APPLICATION","ACEQ_CMP");
	audit.put("MODULENAME","ACEQWRITE");
	audit.put("ACTION","WRITE");
	audit.put("AUDITTEXT","Message number " +  "<" + messageNo + ">" + " read from DB and written into Queue " +  "'" + queueId + "'");
	audit.put("INSTITUTIONID", institutionId);

	var list = new ArrayList();

	var Msgblock1 = new HashMap();
	var Msgblock2 = new HashMap();
	var Msgblock153 = new HashMap();
	var Msgblock154 = new HashMap();



	Msgblock1.put("MSGBLOCKTYPE", "1");
	Msgblock2.put("MSGBLOCKTYPE", "2");
	Msgblock153.put("MSGBLOCKTYPE", "153");
	Msgblock154.put("MSGBLOCKTYPE", "154");

	msgBlock2 = 'CAMEL_EXCHANGE_BODY';

	msgBlock154 = getHeader(map, "ACEDB_MSGBLOCK154");
	logger.trace("dbOperation: ACEDB_MSGBLOCK154 = " + msgBlock154);

	if(msgType === "pacs.002.001.10") {
		msgFamily154 = "XML";
		//var headerPayload = getHeader(map, "PLCN_headerPayload");
		//logger.info("dbOperation: headerPayload = " + headerPayload);

		var validLAU = getHeader(map, "PLCN_validLAU");

		if(validLAU == "false" || validflag == "false") {
			path = institutionId + "." + "MESSAGE_PROCESSING.FUNCTIONALITY.MESSAGE_SEND_TO_MQ" + "." + "PACS.002_MQ"; //PLCNUSNY.MESSAGE_PROCESSING.FUNCTIONALITY.MESSAGE_SEND_TO_MQ.PACS.002_MQ
			config1 = memTblGetTableValue(map, "INST_PARAM", path);
			logger.info("dbOperation: config1 = " + config1);

			if(config1 == 'Y') {
				setHeader(map, "PLCN_config1", true);
			}else {
				setHeader(map, "PLCN_config1", false);
			}
			
			path = institutionId + "." + "MESSAGE_PROCESSING.FUNCTIONALITY.MESSAGE_SEND_TO_MQ" + "." + "PACS.002_STATUS"; //PLCNUSNY.MESSAGE_PROCESSING.FUNCTIONALITY.MESSAGE_SEND_TO_MQ.PACS.002_STATUS
			config2 = memTblGetTableValue(map, "INST_PARAM", path);
			logger.info("dbOperation: config2 = " + config2);

			var queueId;
			var res;
	  		var status;
	  		logger.info("dbOperation: status = " + status);
			if(msgDirection == "O"){
				queueId = "ERRORQ";
				status = "69";
				setHeader(map, "MSG_FAMILY", "CBPR");
				setHeader(map, "PLCN_processingStage", "ERR");
				msgdbMap.put("MSG_FAMILY", "CBPR");
				msgdbMap.put("PROCESSING_STAGE", "ERR");
			}else {
				queueId = dataBetweenTokens("|", "|", config2);
			    logger.info("dbOperation: queueId = " + queueId);
			    
			    res = removePattern(config2, queueId);
                status = dataBetweenTokens("||", "|", res);
			}		
	  		setHeader(map, "PLCN_queueId", queueId);
	  		setHeader(map, "PLCN_status", status);

	  		if(queueId == "ERRORQ") {
	  			setHeader(map, "PLCN_errqFlag", true);
	  			logger.info("dbOperation: errqFlag = true");
	  		}else {
	  			setHeader(map, "PLCN_errqFlag", false);
	  			logger.info("dbOperation: errqFlag = false");
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
		/*if(validflag == "true") {
			msgBlock1 = getHeader(map, "ACEDB_MSGBLOCK1");
			logger.info("dbOperation: msgBlock1 = " + msgBlock1);

			msgBlock153 = getHeader(map, "ACEDB_MSGBLOCK153");
			logger.info("dbOperation: msgBlock153 = " + msgBlock153);

			Msgblock1.put("MESSAGE", msgBlock1);
			Msgblock1.put("MSGFAMILY", "XML");
			list.add(Msgblock1);

			Msgblock153.put("MESSAGE", msgBlock153);
			Msgblock153.put("MSGFAMILY", "XML");
			list.add(Msgblock153);
		}*/
	}

	if(msgType === 'pacs.004.001.09') {
		logger.info("dbOperation: msg type is pacs.004.001.09");

		var transrefno = getHeader(map, "PLCN_transRefNo");
		/*if(transrefno) {
			msgdbMap.put("TRANSREFNO", transrefno);
		}*/
    	var instrId = getHeader(map, "PLCN_instrId");
    	logger.info('dbOperation: instrId = ' + instrId);

    	var endtoendId = getHeader(map, "PLCN_endToEnd");
    	logger.info('dbOperation: endtoendId = ' + endtoendId);
       	txnCustom2 = endtoendId + "¿" + instrId;
    	logger.info('dbOperation: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperation: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperation: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
			logger.info('dbOperation: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');
			msgdbMap.put("NEXT_WORKFLOW_STATUS", "84");
			logger.info('dbOperation: NEXT_WORKFLOW_STATUS = 84');
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
			logger.info('dbOperation: sendMsgMq = ' + sendMsgMq);

			channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId + "-ERR");

			if(sendMsgMq == "Y") {
				sendMsgMq = true;
				setHeader(map, "PLCN_sendMsgMq", sendMsgMq);
				var outputMsgMx = memTblGetTableValue(map, "FLAG-TABLE", "OUTPUT_MSG_MX");
				logger.info('dbOperation: outputMsgMx = ' + outputMsgMx);

				if(outputMsgMx == "Y") {
					logger.info('dbOperation: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = 'CAMEL_EXCHANGE_BODY';
					msgFamily154 = "XML";
				}else {
					logger.trace('dbOperation: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = msgBlocks.get("MSGBLOCK1");
					msgFamily154 = "SWIFT";
				}

				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
				logger.info('dbOperation: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');

				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperation: NEXT_WORKFLOW_STATUS = 102');
			}
    	}
    	logger.info('dbOperation: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
    }

	if(msgType === 'pacs.008.001.08'){
 		
    	var msgId = getHeader(map, "PLCN_msgId");
    	logger.info('dbOperation: msgId = ' + msgId);

    	var endToend = getHeader(map, "PLCN_endToEnd");
    	logger.info('dbOperation: endToend = ' + endToend);
       	txnCustom2 = endToend + "¿" + msgId;
    	logger.info('dbOperation: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperation: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5);

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperation: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var custom44 = getHeader(map, "PLCN_CUSTOM44");
    	msgdbMap.put("CUSTOM44", custom44);

		if(validflag === "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
			logger.info('dbOperation: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');
			msgdbMap.put("NEXT_WORKFLOW_STATUS", "84");
			logger.info('dbOperation: NEXT_WORKFLOW_STATUS = 84');
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
			logger.info('dbOperation: sendMsgMq = ' + sendMsgMq);

			channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId + "-ERR");

			if(sendMsgMq == "Y") {
				sendMsgMq = true;
				setHeader(map, "PLCN_sendMsgMq", sendMsgMq);
				var outputMsgMx = memTblGetTableValue(map, "FLAG-TABLE", "OUTPUT_MSG_MX");
				logger.info('dbOperation: outputMsgMx = ' + outputMsgMx);

				if(outputMsgMx == "Y") {
					logger.info('dbOperation: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = 'CAMEL_EXCHANGE_BODY';
					msgFamily154 = "XML";
				}else {
					logger.trace('dbOperation: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = msgBlocks.get("MSGBLOCK1");
					msgFamily154 = "SWIFT";
				}

				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
				logger.info('dbOperation: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');

				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperation: NEXT_WORKFLOW_STATUS = 102');	
			}
		}
		logger.info('dbOperation: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	}

	if(msgType === "pacs.009.001.08") {
 		
    	var instrId = getHeader(map, "PLCN_instrId");
    	logger.info('dbOperation: instrId = ' + instrId);

    	var custom5 = getHeader(map, "PLCN_custom5Dupl");
    	logger.info('dbOperation: custom5 = ' + custom5);
    	msgdbMap.put("CUSTOM5", custom5); 

    	if(!custom5){
	    	var custom5 = getHeader(map, "PLCN_DUPLCUSTOM5");
	    	logger.info('dbOperation: DUPLCUSTOM5 = ' + custom5);
	    	msgdbMap.put("CUSTOM5", custom5);
    	}

    	var endtoendId = getHeader(map, "PLCN_endToEnd");
    	logger.info('dbOperation: endtoendId = ' + endtoendId);
       	txnCustom2 = endtoendId + "¿" + instrId;
    	logger.info('dbOperation: txnCustom2 = ' + txnCustom2);
    	msgdbMap.put("CUSTOM2", txnCustom2);

		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
			logger.info('dbOperation: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');
			msgdbMap.put("NEXT_WORKFLOW_STATUS", "84");
			logger.info('dbOperation: NEXT_WORKFLOW_STATUS = 84');
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
			logger.info('dbOperation: sendMsgMq = ' + sendMsgMq);

			channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId + "-ERR");
			logger.info('dbOperation: channelIdTarget = ' + channelIdTarget);

			if(sendMsgMq == "Y") {
				sendMsgMq = true;
				setHeader(map, "PLCN_sendMsgMq", sendMsgMq);
				var outputMsgMx = memTblGetTableValue(map, "FLAG-TABLE", "OUTPUT_MSG_MX");
				logger.info('dbOperation: outputMsgMx = ' + outputMsgMx);

				if(outputMsgMx == "Y") {
					msgBlock154 = 'CAMEL_EXCHANGE_BODY';
					msgFamily154 = "XML";
				}else {
					msgBlock154 = msgBlocks.get("MSGBLOCK1");
					msgFamily154 = "SWIFT";
				}

				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
				logger.info('dbOperation: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');

				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperation: NEXT_WORKFLOW_STATUS = 102');	
			}
		}

		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
 	}

	if(msgType === 'camt.057.001.06') {
		logger.info("dbOperation: msg type is camt.057.001.06");
		//var msgIdPath = "/Document/PmtRtr/GrpHdr/MsgId";
		//var msgId = getValueFromPath(Document, msgIdPath);
		//logger.info("dbOperation: msgId = " + msgId);
	    //msgdbMap.put("TRANSREFNO", msgId);
	    //msgBlock154 = 'CAMEL_EXCHANGE_BODY';

		if(validflag == "true") {
			msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
			logger.info('dbOperation: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');
			msgdbMap.put("NEXT_WORKFLOW_STATUS", "84");
			logger.info('dbOperation: NEXT_WORKFLOW_STATUS = 84');
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
			logger.info('dbOperation: sendMsgMq = ' + sendMsgMq);

			channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId + "-ERR");

			if(sendMsgMq == "Y") {
				sendMsgMq = true;
				setHeader(map, "PLCN_sendMsgMq", sendMsgMq);
				var outputMsgMx = memTblGetTableValue(map, "FLAG-TABLE", "OUTPUT_MSG_MX");
				logger.info('dbOperation: outputMsgMx = ' + outputMsgMx);

				if(outputMsgMx == "Y") {
					logger.info('dbOperation: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = 'CAMEL_EXCHANGE_BODY';
					msgFamily154 = "XML";
				}else {
					logger.info('dbOperation: outputMsgMx = ' + outputMsgMx);
					msgBlock154 = msgBlocks.get("MSGBLOCK1");
					msgFamily154 = "SWIFT";
				}

				msgdbMap.put("NEXT_WORKFLOW_QUEUE_ID", "PROCDQ");
				logger.info('dbOperation: NEXT_WORKFLOW_QUEUE_ID = PROCDQ');

				msgdbMap.put("NEXT_WORKFLOW_STATUS", "102");
				logger.info('dbOperation: NEXT_WORKFLOW_STATUS = 102');
			}
    	}
    	logger.info('dbOperation: CHANNEL_ID_TARGET = ' + channelIdTarget);
		msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
    }

	logger.trace("dbOperation: msgBlock2 = " + msgBlock2);
	Msgblock2.put("MESSAGE", msgBlock2);
	Msgblock2.put("MSGFAMILY", "XML");
	list.add(Msgblock2);

	var msgDirection = getHeader(map, "PLCN_msgDirection");
	logger.info("dbOperation: msgDirection = " + msgDirection);

	logger.trace("dbOperation: msgBlock154 = " + msgBlock154);
	Msgblock154.put("MESSAGE", msgBlock154);
	if(isPatternPresent(msgBlock154, "xml")) {
		Msgblock154.put("MSGFAMILY", "XML");
	}else {
		Msgblock154.put("MSGFAMILY", "SWIFT");
	}
	list.add(Msgblock154);

	msgBlock153 = getHeader(map, "ACEDB_MSGBLOCK153");
	logger.trace("dbOperation: msgBlock153 = " + msgBlock153);

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
		logger.info("dbOperation: mtchTransrefno = " + mtchTransrefno);
		transrefno = getHeader(map, "PLCN_Pacs002transrefNo");
		logger.info("dbOperation: transrefno = " + transrefno);
		txnMtchParam = getHeader(map, "PLCN_txnMtchParam");
		logger.info("dbOperation: txnMtchParam = " + txnMtchParam);

		
		mtchTransrefno1 = "|" + mtchTransrefno + "¿" + transrefno  + txnMtchParam;
		logger.info("dbOperation: mtchTransrefno = " + mtchTransrefno1);
		msgdbMap.put("CUSTOM7", mtchTransrefno1);
		
		var PLCN_custom12 = getHeader(map, "PLCN_custom12");
		logger.info("PLCN_custom12: " + PLCN_custom12);
		msgdbMap.put("CUSTOM12", PLCN_custom12);
    	
    	var msgFamily = getHeader(map,"MSG_FAMILY");
        msgdbMap.put("MSG_FAMILY", msgFamily);
		logger.info("MSG_FAMILY: " + msgFamily);
	}

	//matching
	/*if(msgType === 'pacs.004.001.09'){
		var transrefno = getHeader(map, "PLCN_Pacs004transrefNo");
		
		mtchTransrefno = getHeader(map, "PLCN_mtchTransrefno");
		fileOrgMsgId = getHeader(map, "PLCN_fileOrgMsgId");
		txnMtchParam = getHeader(map, "PLCN_txnMtchParam");

		mtchTransrefno = "|" + mtchTransrefno + "¿" + transrefno  + txnMtchParam;
		logger.info("dbOperation: mtchTransrefno = " + mtchTransrefno);
		msgdbMap.put("CUSTOM7", mtchTransrefno);
		
		var PLCN_custom12 = getHeader(map, "PLCN_custom12");
		logger.info("PLCN_custom12: " + PLCN_custom12);
		msgdbMap.put("CUSTOM12", PLCN_custom12);
    	
    	var msgFamily = getHeader(map,"MSG_FAMILY");
        msgdbMap.put("MSG_FAMILY", msgFamily);
	}*/
	
	var displayFlag =  getHeader(map,"PLCN_displayFlag");
	var processingStage = getHeader(map,"PLCN_processingStage");
	var authLevel = getHeader(map,"PLCN_currentAuthLevel");

	logger.info("dbOperation: PLCN_processingStage = " + processingStage);
	logger.info("dbOperation: PLCN_currentAuthLevel = " + authLevel);
	
	if(processingStage){
		msgdbMap.put("PROCESSING_STAGE", processingStage);
		msgdbMap.put("CURRENT_AUTH_LEVEL", authLevel);

		logger.info("dbOperation: PROCESSING_STAGE & CURRENT_AUTH_LEVEL values have been set to DB");
	}else if(validflag == "true") {
		msgdbMap.put("PROCESSING_STAGE", "FINL");
		logger.info("dbOperation: PROCESSING_STAGE = FINL");
	}

	//var custom11 = getHeader(map, "PLCN_clearingId");
	var custom11 = getHeader(map, "PLCN_clrgIdSet");
	logger.info("dbOperation: custom11 = " + custom11);

	if(custom11) {
		msgdbMap.put("CUSTOM11", custom11);
	}

	//"TO_DATE('09/03/2021 12:00:00', 'MM/DD/YYYY HH24:MI:SS')"
	var custom24 = getHeader(map, "PLCN_custom24");
	logger.info("dbOperation: custom24 = " + custom24);

	if(custom24) {
		custom24 = "TO_DATE('" + custom24 + "', 'MM/DD/YYYY HH24:MI:SS')";
		logger.info("dbOperation: CONSTANT_CUSTOM24 = " + custom24);
		msgdbMap.put("CONSTANT_CUSTOM24", custom24);
	}else {
		msgdbMap.put("CONSTANT_CUSTOM24", "NULL");
		logger.info("dbOperation: CUSTOM24 = NULL");
	}

	var queue = getHeader(map, "PLCN_queue");
	logger.info("dbOperation: queue = " + queue);

	if(queue) {
		msgdbMap.put("QUEUEID", queue);
		if(queue == "TMPMSGQ"){
			setHeader(map, "PLCN_ISOUTPUT", "Y");
		}
		else if(queue == "MXREPRQ" || queue == "MXDUPLQ" || queue == "MXMSGAH" || queue == "MXHOLDQ" || queue == "ERRORQ"){
			setHeader(map, "PLCN_ISOUTPUT", "N");
		}
	}

	var newPriorityDate = getHeader(map, "PLCN_newPriorityDate");
	logger.info("dbOperation: newPriorityDate = " + newPriorityDate);

	if(newPriorityDate) {
		msgdbMap.put("PRIORITYDATE", newPriorityDate);
	}

	msgdbMap.put("TRANSACTIONGROUP", "EFT");

	var validMessage = getHeader(map, "PLCN_validMessage");
	logger.trace("dbOperation: validMessage = " + validMessage);

	var responseCdsDoc = getHeader(map, "ACEDB_responseCdsDoc");
	logger.trace("dbOperation: typeof responseCdsDoc = " + typeof responseCdsDoc);
	logger.trace("dbOperation: responseCdsDoc = " + responseCdsDoc);

	if(responseCdsDoc && isPatternPresent(responseCdsDoc, "<ResponseCds>")) {
		var Msgblock6 = new HashMap();
		Msgblock6.put("MSGBLOCKTYPE", "6");
		Msgblock6.put("MESSAGE", responseCdsDoc);
		Msgblock6.put("MSGFAMILY", "XML");
		list.add(Msgblock6);
	}

	var derivedProductCode = getHeader(map, "PLCN_productCode");
	logger.info("dbOperation: derivedProductCode = " + derivedProductCode);

	if(derivedProductCode) {
		msgdbMap.put("DERIVED_PRODUCT", derivedProductCode);
	}

	var isInput = getHeader(map, "PLCN_ISINPUT");
	logger.info("dbOperation: isInput = " + isInput);

	if(isInput) {
		msgdbMap.put("ISINPUT",isInput);
	}

	var isOutput = getHeader(map, "PLCN_ISOUTPUT");
	logger.info("dbOperation: isOutput = " + isOutput);

	if(isOutput) {
		msgdbMap.put("ISOUTPUT", isOutput);
	}
	
	msgdbMap.put("CHANNEL_ID_TARGET", channelIdTarget);
	msgdbMap.put("DISPLAY_FLAG", "Y");
	msgdbMap.put("COMMENTS", comments);
	msgdbMap.put("INSTANCEID","PELICAN1");
    msgdbMap.put("PROCESS_ID", processId);

	var receiver = getHeader(map, "RECEIVER");
	logger.trace("dbOperation: receiver = " + receiver);

	if(receiver) {
   		msgdbMap.put("RECEIVER", receiver);
		logger.trace("dbOperation: RECEIVER = " + receiver);
	}

	//Metadata population
    if(msgType === 'pacs.002.001.10'){
		var instgAgtPath = "/Document/FIToFIPmtStsRpt/TxInfAndSts/InstgAgt/FinInstnId/BICFI";
		var instgAgt = getValueFromPath(Document, instgAgtPath);
		logger.info("dbOperation: instgAgt = " + instgAgt);
		msgdbMap.put("INSTRUCTINGAGENT", instgAgt);

		var instdAgtPath = "/Document/FIToFIPmtStsRpt/TxInfAndSts/InstdAgt/FinInstnId/BICFI";
		var instdAgt = getValueFromPath(Document, instdAgtPath);
		logger.info("dbOperation: instdAgt = " + instdAgt);
		msgdbMap.put("INSTRUCTEDAGENT", instdAgt);    	
    }

	if(msgType === 'pacs.008.001.08'){
		var dbtrNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Nm';
		var dbtrNm = getValueFromPath(Document, dbtrNmPath);
		logger.info("dbOperation: dbtrNm =" + dbtrNm);
		msgdbMap.put("ORIGNAME", dbtrNm);	

		var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		msgdbMap.put("ACCOUNT_DR", debtorAcc);

		if(!debtorAcc){
			var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			msgdbMap.put("ACCOUNT_DR", debtorAcc);			
		}

		var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		msgdbMap.put("ACCOUNT_NUMBER", debtorAcc);

		if(!debtorAcc){
			var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			msgdbMap.put("ACCOUNT_NUMBER", debtorAcc);			
		}

		var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		msgdbMap.put("CUSTOMERACCNO", debtorAcc);

		if(!debtorAcc){
			var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			msgdbMap.put("CUSTOMERACCNO", debtorAcc);			
		}	

		var debtorAgentPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI';
		var debtorAgent = getValueFromPath(Document, debtorAgentPth);
		msgdbMap.put("CUSTOMER", debtorAgent);

		var debtorAgentNmPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/Nm';
		var debtorAgentNm = getValueFromPath(Document, debtorAgentNmPth);
		msgdbMap.put("ORIGBANKNAME", debtorAgentNm);

		var cdtrAgentNmPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/Nm';
		var cdtrAgentNm = getValueFromPath(Document, cdtrAgentNmPth);
		msgdbMap.put("BENBANKNAME", cdtrAgentNm);

		var cdtrNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Nm';
		var cdtrNm = getValueFromPath(Document, cdtrNmPath);
		msgdbMap.put("BENEFNAME", cdtrNm);
		msgdbMap.put("OTHER_PARTY_DETAILS", cdtrNm);

		var creditorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		msgdbMap.put("OTHER_ACCNO", creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			msgdbMap.put("OTHER_ACCNO", creditorAcc);
		}

		var creditorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		msgdbMap.put("ACCOUNT_CR", creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			msgdbMap.put("ACCOUNT_CR", creditorAcc);
		}
		var cdtrAddr1Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/AdrLine[1]';
		var cdtrAddr1 = getValueFromPath(Document, cdtrAddr1Path);
		msgdbMap.put("BENBANKADDR1", cdtrAddr1);
		logger.info("cdtrAddr1 : " + cdtrAddr1);

		var cdtrAddr2Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/AdrLine[2]';
		var cdtrAddr2 = getValueFromPath(Document, cdtrAddr2Path);
		msgdbMap.put("BENBANKADDR2", cdtrAddr2);
		logger.info("cdtrAddr2 : " + cdtrAddr2);

		var cdtrAddr3Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/AdrLine[3]';
		var cdtrAddr3 = getValueFromPath(Document, cdtrAddr3Path);
		msgdbMap.put("BENBANKADDR3", cdtrAddr3);
		logger.info("cdtrAddr3 : " + cdtrAddr3);

		var cdtrCityPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/TwnNm';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		msgdbMap.put("BENBANKCITY", cdtrCity);
		logger.info("CityName : " + cdtrCity);

		var cdtrCtryPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/Ctry';
		var cdtrCtry = getValueFromPath(Document, cdtrCtryPath);
		msgdbMap.put("BENBANKCTRY", cdtrCtry);

		var cdtrCityPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/CtrySubDvsn';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		msgdbMap.put("BENBANKSTATECODE", cdtrCity);

		var cdtrCityPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/PstCd';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		msgdbMap.put("BENBANKZIPCODE", cdtrCity);

		var instgAgtPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/InstgAgt/FinInstnId/BICFI";
		var instgAgt = getValueFromPath(Document, instgAgtPath);
		logger.trace("dbOperation: instgAgt = " + instgAgt);
		msgdbMap.put("INSTRUCTINGAGENT", instgAgt);

		var instdAgtPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/InstdAgt/FinInstnId/BICFI";
		var instdAgt = getValueFromPath(Document, instdAgtPath);
		logger.trace("dbOperation: instdAgt = " + instdAgt);
		msgdbMap.put("INSTRUCTEDAGENT", instdAgt);		
	}

	if(msgType === 'pacs.009.001.08'){
		var dbtrNmPath = '/Document/FICdtTrf/CdtTrfTxInf/Dbtr/FinInstnId/Nm';
		var dbtrNm = getValueFromPath(Document, dbtrNmPath);
		logger.info("dbOperation: dbtrNm =" + dbtrNm);
		msgdbMap.put("ORIGNAME", dbtrNm);	

		var debtorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		msgdbMap.put("ACCOUNT_DR", debtorAcc);

		if(!debtorAcc){
			var debtorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			msgdbMap.put("ACCOUNT_DR", debtorAcc);			
		}

		var debtorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		msgdbMap.put("ACCOUNT_NUMBER", debtorAcc);

		if(!debtorAcc){
			var debtorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			msgdbMap.put("ACCOUNT_NUMBER", debtorAcc);			
		}

		var debtorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		msgdbMap.put("CUSTOMERACCNO", debtorAcc);

		if(!debtorAcc){
			var debtorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			msgdbMap.put("CUSTOMERACCNO", debtorAcc);			
		}	

		var debtorAgentPth = '/Document//CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI';
		var debtorAgent = getValueFromPath(Document, debtorAgentPth);
		msgdbMap.put("CUSTOMER", debtorAgent);

		var debtorAgentNmPth = '/Document/FICdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/Nm';
		var debtorAgentNm = getValueFromPath(Document, debtorAgentNmPth);
		msgdbMap.put("ORIGBANKNAME", debtorAgentNm);

		var cdtrAgentNmPth = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/Nm';
		var cdtrAgentNm = getValueFromPath(Document, cdtrAgentNmPth);
		msgdbMap.put("BENBANKNAME", cdtrAgentNm);

		var cdtrNmPath = '/Document/FICdtTrf/CdtTrfTxInf/Cdtr/FinInstnId/Nm';
		var cdtrNm = getValueFromPath(Document, cdtrNmPath);
		msgdbMap.put("BENEFNAME", cdtrNm);
		msgdbMap.put("OTHER_PARTY_DETAILS", cdtrNm);

		var creditorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAcct/Id/Othr/Id';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		msgdbMap.put("ACCOUNT_CR", creditorAcc);

		var creditorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		msgdbMap.put("OTHER_ACCNO", creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			msgdbMap.put("OTHER_ACCNO", creditorAcc);
		}

		var creditorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		msgdbMap.put("ACCOUNT_CR", creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			msgdbMap.put("ACCOUNT_CR", creditorAcc);
		}
		var cdtrAddr1Path = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/AdrLine[1]';
		var cdtrAddr1 = getValueFromPath(Document, cdtrAddr1Path);
		msgdbMap.put("BENBANKADDR1", cdtrAddr1);
		logger.info("cdtrAddr1 : " + cdtrAddr1);

		var cdtrAddr2Path = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/AdrLine[2]';
		var cdtrAddr2 = getValueFromPath(Document, cdtrAddr2Path);
		msgdbMap.put("BENBANKADDR2", cdtrAddr2);
		logger.info("cdtrAddr2 : " + cdtrAddr2);

		var cdtrAddr3Path = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/AdrLine[3]';
		var cdtrAddr3 = getValueFromPath(Document, cdtrAddr3Path);
		msgdbMap.put("BENBANKADDR3", cdtrAddr3);
		logger.info("cdtrAddr3 : " + cdtrAddr3);

		var cdtrCityPath = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/TwnNm';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		msgdbMap.put("BENBANKCITY", cdtrCity);
		logger.info("CityName : " + cdtrCity);

		var cdtrCtryPath = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/Ctry';
		var cdtrCtry = getValueFromPath(Document, cdtrCtryPath);
		msgdbMap.put("BENBANKCTRY", cdtrCtry);

		var cdtrCityPath = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/CtrySubDvsn';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		msgdbMap.put("BENBANKSTATECODE", cdtrCity);

		var cdtrCityPath = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/PstCd';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		msgdbMap.put("BENBANKZIPCODE", cdtrCity);

		var instgAgtPath = "/Document/FICdtTrf/CdtTrfTxInf/InstgAgt/FinInstnId/BICFI";
		var instgAgt = getValueFromPath(Document, instgAgtPath);
		logger.trace("dbOperation: instgAgt = " + instgAgt);
		msgdbMap.put("INSTRUCTINGAGENT", instgAgt);

		var instdAgtPath = "/Document/FICdtTrf/CdtTrfTxInf/InstdAgt/FinInstnId/BICFI";
		var instdAgt = getValueFromPath(Document, instdAgtPath);
		logger.trace("dbOperation: instdAgt = " + instdAgt);
		msgdbMap.put("INSTRUCTEDAGENT", instdAgt);

		logger.trace("populateMetaDataInfoPacs009: msgdbMap = " + msgdbMap);
	}

	if(msgType === 'pacs.004.001.09'){
		var dbtrNmPath = '/Document/PmtRtr/TxInf/RtrChain/Dbtr/Pty/Nm';
		var dbtrNm = getValueFromPath(Document, dbtrNmPath);
		logger.info("dbOperation: dbtrNm =" + dbtrNm);
		msgdbMap.put("ORIGNAME", dbtrNm);	

		var debtorAgentPth = '/Document/PmtRtr/TxInf/RtrChain/DbtrAgt/FinInstnId/BICFI';
		var debtorAgent = getValueFromPath(Document, debtorAgentPth);
		msgdbMap.put("CUSTOMER", debtorAgent);

		var debtorAgentNmPth = '/Document/PmtRtr/TxInf/RtrChain/DbtrAgt/FinInstnId/Nm';
		var debtorAgentNm = getValueFromPath(Document, debtorAgentNmPth);
		msgdbMap.put("ORIGBANKNAME", debtorAgentNm);

		var cdtrNmPath = '/Document/PmtRtr/TxInf/RtrChain/Cdtr/Pty/Nm';
		var cdtrNm = getValueFromPath(Document, cdtrNmPath);
		logger.info("cdtrAgtNm : " + cdtrAgtNm);
		msgdbMap.put("BENEFNAME", cdtrNm);
		msgdbMap.put("OTHER_PARTY_DETAILS", cdtrNm);

		var cdtrAgtNmPath = '/Document/PmtRtr/TxInf/RtrChain/CdtrAgt/FinInstnId/Nm';
		var cdtrAgtNm = getValueFromPath(Document, cdtrAgtNmPath);
		msgdbMap.put("BENBANKNAME", cdtrAgtNm);
		logger.info("CdtrAgtNm : " + cdtrAgtNm);

		var cdtrAgtAddr1Path = '/Document/PmtRtr/TxInf/RtrChain/CdtrAgt/FinInstnId/PstlAdr/AdrLine[1]';
		var cdtrAgtAddr1 = getValueFromPath(Document, cdtrAgtAddr1Path);
		msgdbMap.put("BENBANKADDR1", cdtrAgtAddr1);
		logger.info("CdtrAgtAddr1 : " + cdtrAgtAddr1);

		var cdtrAgtAddr2Path = '/Document/PmtRtr/TxInf/RtrChain/CdtrAgt/FinInstnId/PstlAdr/AdrLine[2]';
		var cdtrAgtAddr2 = getValueFromPath(Document, cdtrAgtAddr2Path);
		msgdbMap.put("BENBANKADDR2", cdtrAgtAddr2);
		logger.info("CdtrAgtAddr2 : " + cdtrAgtAddr2);

		var cdtrAgtAddr3Path = '/Document/PmtRtr/TxInf/RtrChain/CdtrAgt/FinInstnId/PstlAdr/AdrLine[3]';
		var cdtrAgtAddr3 = getValueFromPath(Document, cdtrAgtAddr3Path);
		msgdbMap.put("BENBANKADDR3", cdtrAgtAddr3);
		logger.info("CdtrAgtAddr3 : " + cdtrAgtAddr3);

		var cdtrAgtCityPath = '/Document/PmtRtr/TxInf/RtrChain/CdtrAgt/FinInstnId/PstlAdr/TwnNm';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		msgdbMap.put("BENBANKCITY", cdtrAgtCity);
		logger.info("CityName : " + cdtrAgtCity);

		var cdtrAgtCtryPath = '/Document/PmtRtr/TxInf/RtrChain/CdtrAgt/FinInstnId/PstlAdr/Ctry';
		var cdtrAgtCtry = getValueFromPath(Document, cdtrAgtCtryPath);
		msgdbMap.put("BENBANKCTRY", cdtrAgtCtry);

		var cdtrAgtCityPath = '/Document/PmtRtr/TxInf/RtrChain/CdtrAgt/FinInstnId/PstlAdr/CtrySubDvsn';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		msgdbMap.put("BENBANKSTATECODE", cdtrAgtCity);

		var cdtrAgtCityPath = '/Document/PmtRtr/TxInf/RtrChain/CdtrAgt/FinInstnId/PstlAdr/PstCd';
		var cdtrAgtCity = getValueFromPath(Document, cdtrAgtCityPath);
		msgdbMap.put("BENBANKZIPCODE", cdtrAgtCity);

		var instgAgtPath = "/Document/PmtRtr/TxInf/InstgAgt/FinInstnId/BICFI";
		var instgAgt = getValueFromPath(Document, instgAgtPath);
		logger.trace("dbOperation: instgAgt = " + instgAgt);
		msgdbMap.put("INSTRUCTINGAGENT", instgAgt);

		var instdAgtPath = "/Document/PmtRtr/TxInf/InstdAgt/FinInstnId/BICFI";
		var instdAgt = getValueFromPath(Document, instdAgtPath);
		logger.trace("dbOperation: instdAgt = " + instdAgt);
		msgdbMap.put("INSTRUCTEDAGENT", instdAgt);

		logger.trace("populateMetaDataInfoPacs004: msgdbMap = " + msgdbMap);
	}

	if(msgType == "camt.057.001.06") {
		var sender = getHeader(map, "PLCN_sender");
		logger.info("dbOperation: sender = " + sender);
		msgdbMap.put("SENDER", sender);		
		msgdbMap.put("INSTRUCTINGAGENT", sender);

		var receiver = getHeader(map, "PLCN_receiver");
		logger.info("dbOperation: receiver = " + receiver);
		msgdbMap.put("RECEIVER", receiver);
		msgdbMap.put("INSTRUCTEDAGENT", receiver);

		var transRefNoFlag = getHeader(map, "PLCN_transRefNoMsgdb");
		logger.info("dbOperation: transRefNoFlag = " + transRefNoFlag);

		if(transRefNoFlag == 'false'){
			var transRefNo = getHeader(map, "PLCN_transRefNo");
			logger.info("dbOperation: transRefNo = " + transRefNo);

			if(transRefNo) {
				msgdbMap.put("TRANSREFNO", transRefNo);
			}
		}
	}

	var deleteList = new ArrayList();

	var Msgblock146 = new HashMap();
	Msgblock146.put("MSGBLOCKTYPE", "146");
	deleteList.add(Msgblock146);
	
	var Msgblock148 = new HashMap();
	Msgblock148.put("MSGBLOCKTYPE", "148");
	deleteList.add(Msgblock148);
	
	setHeader(map, "ACEQ_WRITE_MSGDB", msgdbMap);
	setHeader(map, "ACEQ_WRITE_MSGBLOCKS", list);
	setHeader(map, "ACEQ_DELETE_MSGBLOCKS", deleteList);
	setHeader(map, "ACEQ_DB_OPERATION", "UPDATE");
	setHeader(map, "GENAUDIT", audit);

	logger.info("dbOperation completed");
}

function drveNibcProductCode(exchange) {
	var mode;
	var msgType;
	var productCode;
	var key;
	var institutionId;
	var drveProductCodeFlag;
	var drveProductCodeFlagPath;
	var sourceChannelId;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	logger.info("In drveNibcProductCode");

	institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("drveNibcProductCode: institutionId = " + institutionId);

	mode = getHeader(map, "PLCN_msgModeIn");
	logger.info("drveNibcProductCode: mode = " + mode);

	msgType = getHeader(map, "PLCN_msgType");
	logger.info("drveNibcProductCode: msgType = " + msgType);

	sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	logger.info("drveNibcProductCode: sourceChannelId = " + sourceChannelId);

	drveProductCodeFlagPath = institutionId + "." + "MESSAGE_PROCESSING.FUNCTIONALITY.CHANNEL_MSGTYPE_CONFIG" + "." + sourceChannelId;
	drveProductCodeFlag = memTblGetTableValue(map, "INST_PARAM", drveProductCodeFlagPath);
	logger.info("drveNibcProductCode: drveProductCodeFlag = " + drveProductCodeFlag);
	
	if(isPatternPresent(drveProductCodeFlag, msgType)) {
		if(mode == "MANUAL" || mode == "UPLOAD") {
			key = mode + "-" + msgType;
			logger.info("drveNibcProductCode: key = " + key);

			productCode = memTblGetTableValue(map, "PPAY_PRODUCT_CODE", key);
			logger.info("drveNibcProductCode: productCode = " + productCode);
		}

		if(productCode) {
			setHeader(map, "PLCN_productCode", productCode);
			setHeader(map, "PLCNAPI_productCode", productCode);
			return productCode;
		}		
	}
}

function setValidationHeaderCbpr(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var documentString = inMsg.getBody(java.lang.String.class);

	var msgType = getHeader(map, "PLCN_msgType");

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

	//Make the inbound BAH available to the validation service. The validation call is
	//HTTP based (CamelHttpMethod = POST) and the raw multi line AppHdr XML cannot travel
	//as an HTTP header, so it is transported Base64 encoded in PLCN_bahFrMsgB64 and
	//decoded again by resolveInboundBah() in validation.js.
	var bahFrMsg = getHeader(map, "PLCN_bahFrMsg");
	logger.info("checkHeader: bahFrMsg1 = " + bahFrMsg);
	if(!bahFrMsg) {
		bahFrMsg = extractBahFromString(getHeader(map, "ACEDB_msgBlock1"));
	}
	logger.info("checkHeader: bahFrMsg2 = " + bahFrMsg);
	if(!bahFrMsg) {
		bahFrMsg = extractBahFromString(documentString);
	}
	logger.info("checkHeader: bahFrMsg3 = " + bahFrMsg);

	setHeader(map, "PaymentType", "CBPR" + msgType);
	setHeader(map, "CamelHttpMethod", "POST");
	//setHeader(map, "PLCN_CbprFlag", true);
	logger.info("setValidationHeaderCbpr: PaymentType = " + getHeader(map, "PaymentType"));
	logger.info("setValidationHeaderCbpr: CamelHttpMethod = " + getHeader(map, "CamelHttpMethod"));
}

function setComplianceHeader(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	setHeader(map, "PLCN_ServiceType", "AML-SCREENING-FRAUD");
	setHeader(map, "PLCN_validMessage", "true");
}

/*
**
* This function checks whether headers are present in the message or not.
* @param {CamelExchange} exchange - The exchange.
*/
/*
** Extracts the <AppHdr>...</AppHdr> block from a raw message string.
** Primary lookup matches the unprefixed form (same convention as extractBAH);
** the fallback also handles a namespace prefixed AppHdr (e.g. <h:AppHdr> inside
** an SAA DataPDU) and normalises it to the unprefixed form.
** Returns "" when no AppHdr block is found.
*/
function extractBahFromString(rawMsg) {
	if(!rawMsg) {
		return "";
	}
	
	logger.info("checkHeader: rawMsg = " + rawMsg);

	var msg = String(rawMsg);

	var startIdx = msg.indexOf("<AppHdr");
	if(startIdx >= 0) {
		var endIdx = msg.indexOf("</AppHdr");
		if(endIdx > startIdx) {
			return msg.substring(startIdx, endIdx + 9);
		}
	}

	var match = /<([A-Za-z0-9_.\-]+):AppHdr[\s\S]*?<\/\1:AppHdr>/.exec(msg);
	if(match) {
		var prefix = match[1];
		var bah = match[0];
		bah = bah.split("<" + prefix + ":").join("<");
		bah = bah.split("</" + prefix + ":").join("</");
		return bah;
	}

	return "";
}

function checkHeader(exchange) {
	var payload;
	var bah;
	var interact;
	var msgType;
	var institutionId;
	var config;
	var key;

	logger.info("In checkHeader");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var message = inMsg.getBody(java.lang.String.class);

	var readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	var readMsgBlocks = inMsg.getHeaders().get("ACEQ_READ_MSGBLOCKS");
	var msgBlock1 =  readMsgBlocks.get("MSGBLOCK1");
	setHeader(map, "ACEDB_msgBlock1", msgBlock1);
	logger.trace("checkHeader: msgBlock1 = " + msgBlock1);
	var msgId =  readMsgdb.get("MSGDB_ID");
	logger.info("checkHeader: msgId = " + msgId);

	var msgType = readMsgdb.get("MESSAGECLASSTYPE");
	logger.info("checkHeader: msgType = " + msgType);

	if(isPatternPresent(msgBlock1, "DataPDU>")) {
		setHeader(map, "PLCN_headerPresent", true);
		setHeader(map, "PLCN_createHeader", false);

		//Inbound SAA (DataPDU wrapped) messages: the AppHdr was never extracted on this
		//branch, leaving PLCN_bahFrMsg empty for the downstream BAH based validation rules.
		var bahFrMsg = extractBahFromString(msgBlock1);
		if(bahFrMsg) {
			setHeader(map, "PLCN_bahFrMsg", bahFrMsg);
			logger.info("checkHeader: bahFrMsg = " + bahFrMsg);
			logger.info("checkHeader: map = " + map);
			logger.info("checkHeader: BAH extracted from DataPDU wrapped message and stored in PLCN_bahFrMsg");
		}else {
			logger.info("checkHeader: no AppHdr found inside DataPDU wrapped message");
		}
	}else if(isPatternPresent(msgBlock1, "AppHdr>")) {
		truncateHeader(exchange);
		setHeader(map, "PLCN_headerPresent", false);
		setHeader(map, "PLCN_createHeader", true);
		setHeader(map, "PLCN_validLAU", true);	
	}else {
		setHeader(map, "PLCN_headerPresent", false);
		setHeader(map, "PLCN_createHeader", false);
		setHeader(map, "PLCN_validLAU", true);
		logger.info("checkHeader: validLAU = true");
	}

	logger.info("checkHeader: headerPresent = " + getHeader(map, "PLCN_headerPresent"));
	logger.info("checkHeader: createHeader = " + getHeader(map, "PLCN_createHeader"));

	var msgtag = memTblGetTableValue(map, "MSGNAMESPACE_MAP", msgType);	//"FIToFIPmtCxlReq>";//
	logger.info("checkHeader: msgtag = " + msgtag);
	var availableTag = dataBetweenTokens ("Document", msgtag, message);
	logger.info("checkHeader: availableTag = " + availableTag);
		
	var tag1 = availableTag;
	
	if(isPatternPresent(message, ":Document") || isPatternPresent(message, ":Document>")){
		logger.info("checkHeader: Namespace present");	
		var tempTag1 = availableTag;
		var count = 0;
		while(count == 0) {
			logger.info("checkHeader: count = " + count);
			var genericTag = dataBetweenTokens ("xmlns:", "=\"urn:iso", tempTag1);
			var tempTag2 = genericTag + ":";
			if(isPatternPresent(availableTag, tempTag2)) {
				count = 1;
				logger.info("checkHeader: count = " + count);
			} else {
				if (!genericTag){
					count = 1;	
					logger.info("checkHeader: count = " + count);
				} else {
					tempTag1 = genericTag + "=\"urn:iso";
					logger.info("checkHeader: tempTag1 = " + tempTag1);
				}
			}
			
			logger.info("checkHeader: genericTag = " + genericTag);	
		}
		
		if(genericTag){
			message = message.replaceAll("<"+genericTag+":", "<");
			logger.info("checkHeader: Message after replace half = " + message);
			message = message.replaceAll("</"+genericTag+":", "</");
			logger.info("checkHeader: Message after replace full = " + message);
			
			if(isPatternPresent(tag1, "xmlns=")){
				var flag = "Y";
				logger.info("checkHeader: flag" + flag);
			}else{
				var flag = "N";
				logger.info("checkHeader: flag" + flag);
			}
			
			if(isPatternPresent(tag1, "xmlns:"+genericTag)){
				var flag1 = "Y";
				logger.info("checkHeader: flag1" + flag1);
			}else{
				var flag1 = "N";
				logger.info("checkHeader: flag1" + flag1);
			}
			
			if(flag == "N" && flag1 == "Y"){
				logger.info("checkHeader: in xmlns loop");
			message = message.replaceAll("xmlns:"+genericTag, "xmlns");
			logger.info("checkHeader: Message after document replace full = " + message);
				setHeader(map, "PLCN_Xmlns", "Y");
			}
			
			inMsg.setBody(message);
			message = inMsg.getBody(java.lang.String.class);
			logger.info("checkHeader: Message = " + message);
			setHeader(map, "PLCN_NameSpace", "Y");
			setHeader(map, "PLCN_NameSpaceTag", genericTag);
			setHeader(map, "ACEDB_messageBody", message);
		}
	}
}

/*
**
* This function truncates header.
* @param {CamelExchange} exchange - The exchange.
*/
function truncateHeader(exchange) {
    var inMsg = exchange.getIn();
    var map = inMsg.getHeaders();

    var orgnlMessage = getHeader(map, "ACEDB_msgBlock1"); //inMsg.getBody(java.lang.String.class);
    logger.trace("truncateHeader: orgnlMessage = " + orgnlMessage);

	var readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	
	var institutionId =  readMsgdb.get("INSTITUTIONID");
	logger.info("truncateHeader: institutionId = " + institutionId);
	setHeader(map, "PLCN_institutionId", institutionId);

	var msgType = readMsgdb.get("MESSAGECLASSTYPE");
	logger.info("truncateHeader: msgType = " + msgType);
	setHeader(map, "PLCN_msgType", msgType);

	var payload = extractPayload(exchange);
	logger.trace("truncateHeader: payload " + payload);

	var BAH = extractBAH(exchange);
	logger.info("checkHeader: bahFrMsg10 = " + BAH);
	
	
	if (BAH != null && BAH != "") {
		setHeader(map, "PLCN_bahFrMsg", BAH);
		logger.info("PLCN_bahFrMsg header set successfully.");
	} 
	logger.info("checkHeader: bahFrMsg11 = " + map);
	
	var bahFrMsg = getHeader(map, "PLCN_bahFrMsg");
	logger.info("checkHeader: bahFrMsg11 = " + bahFrMsg);
	
	if(bahFrMsg) {
		var bahBytes = (new java.lang.String(bahFrMsg)).getBytes("UTF-8");
		var bahB64 = java.util.Base64.getEncoder().encodeToString(bahBytes);
		setHeader(map, "PLCN_bahFrMsgB64", bahB64);
		setHeader(map, "PLCNAPI_bahFrMsgB64", bahB64);
		setHeader(map, "PLCNAPI_headerPresent", true);
		logger.info("checkHeader: bahFrMsg4 = " + bahFrMsg);
		logger.info("setValidationHeaderCbpr: BAH transported to validation in PLCN_bahFrMsgB64");
	}else {
		logger.info("setValidationHeaderCbpr: no BAH available to transport to validation");
	}

	setHeader(map, "ACEDB_MSGBLOCK1", payload);
	setHeader(map, "ACEDB_MSGBLOCK153", orgnlMessage);

	if(msgType == "pacs.002.001.10") {
		institutionId = getHeader(map, "PLCN_institutionId");
		key = institutionId + "." + "OUTPUT_CONFIGURATION" + "." + "PACS002_FORMAT"; //to decide block154 value
		config = memTblGetTableValue(map, "INST_PARAM", key);
		logger.info("truncateHeader: config = " + config);

		if(config == "header") {
			setHeader(map, "ACEDB_MSGBLOCK154", orgnlMessage);
		}else if(config == "payload") {
			setHeader(map, "ACEDB_MSGBLOCK154", payload);
		}
	}else {
		setHeader(map, "ACEDB_MSGBLOCK154", orgnlMessage);
	}

	inMsg.setBody(payload);
}

function setMsgBlocksData(exchange) {
    var inMsg = exchange.getIn();
    var map = inMsg.getHeaders();

    logger.info("In setMsgBlocksData");

    var payload = inMsg.getBody(java.lang.String.class);
    logger.trace("setMsgBlocksData: payload = " + payload);

    setHeader(map, "PLCN_createHeader", true);
    setHeader(map, "PLCN_validLAU", true);

	setHeader(map, "ACEDB_MSGBLOCK1", payload);
	setHeader(map, "ACEDB_MSGBLOCK153", payload);
	setHeader(map, "ACEDB_MSGBLOCK154", payload);
	logger.trace("setMsgBlocksData: ACEDB_MSGBLOCK1 = " + getHeader(map, "ACEDB_MSGBLOCK1"));
	logger.trace("setMsgBlocksData: ACEDB_MSGBLOCK153 = " + getHeader(map, "ACEDB_MSGBLOCK153"));
	logger.trace("setMsgBlocksData: ACEDB_MSGBLOCK154 = " + getHeader(map, "ACEDB_MSGBLOCK154"));
}

/*
**
* This function extracts payload.
* @param {CamelExchange} exchange - The exchange.
*/
function extractPayload(exchange) {
    var inMsg = exchange.getIn();
    var map = inMsg.getHeaders();
    var receivedMsg = exchange.getIn().getBody(java.lang.String.class);

    logger.trace("extractPayload: receivedMsg = " + receivedMsg);

    if(receivedMsg.contains("<Document")){
        //var payload = receivedMsg.substring(receivedMsg.indexOf("<Document"), receivedMsg.indexOf("</Body"));
        var payload = receivedMsg.substring(receivedMsg.indexOf("<Document"), receivedMsg.indexOf("</Document") + 11);
        logger.trace("extractPayload: payload = " + payload);
    }

    return payload;
}

function extractBAH(exchange) {
    var inMsg = exchange.getIn();
	logger.info("extractBAH: exchange = " + exchange);
    var map = inMsg.getHeaders();
    var receivedMsg = exchange.getIn().getBody(java.lang.String.class);
	
	logger.info("extractBAH: inMsg101 = " + inMsg);
	logger.info("extractBAH: map = " + map);
	logger.info("extractBAH: receivedMsg = " + receivedMsg);

    logger.trace("extractBAH: receivedMsg = " + receivedMsg);
	
	if(receivedMsg.startsWith("<Document")) {
		receivedMsg =  getHeader(map, "ACEDB_msgBlock1");
		logger.info("extractBAH: Body from ACEDB_msgBlock1 = " + receivedMsg);
	}	

    if(receivedMsg.contains("<AppHdr")){
        var BAH = receivedMsg.substring(receivedMsg.indexOf("<AppHdr"), receivedMsg.indexOf("</AppHdr") + 9);
        logger.trace("extractBAH: BAH = " + BAH);
		logger.info("truncateHeader: BAH = " + BAH);
    }

    return BAH;	
}

/*
**
* This function is used to create headers(BAH, InterAct, LAU).
* @param {CamelExchange} exchange - The exchange.
*/
function createHeader(exchange) {
	var bah;
	var interact;
	var headerPayload;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var message = inMsg.getBody(java.lang.String.class);
	var payload = inMsg.getBody(java.lang.String.class);

	logger.trace("createHeader: message = " + message);

	var bahFlag = memTblGetTableValue(map, "FLAG-TABLE", "CBPR_BAH");
	logger.trace("createHeader: bahFlag = " + bahFlag);
	bahFlag = bahFlag.trim();
	if(bahFlag == "Y") {
		logger.info("createHeader: calling generateBAH");
		generateBAH(exchange);
		bah = getHeader(map, "PLCN_bah");
		logger.trace("createHeader: bah = " + bah);

		message = bah + message;
		logger.trace("createHeader: message with BAH = " + message);

		setHeader(map, "ACEDB_inBahMesage", message);
		setHeader(map, "ACEDB_MSGBLOCK154", message);
	}
	
	var interActFlag = memTblGetTableValue(map, "FLAG-TABLE", "CBPR_INTERACT");
	logger.info("createHeader: interActFlag = " + interActFlag);
	interActFlag = interActFlag.trim();
	if(interActFlag == "Y") {
		logger.info("createHeader: calling generateInterAct");
		generateInterAct(exchange);
		interact = getHeader(map, "ACEDB_interact");
		logger.trace("createHeader: interact = " + interact);

		var interactDoc = createDocument(interact);
		logger.trace("createHeader: interactDoc = " + interactDoc);

		var bahDoc = createDocument(bah);
		var bahString = node2String(bahDoc);

		logger.trace("createHeader: interact before createDocument = " + interact);
		var doc = createDocument(interact);//actual payload doc
		logger.trace("createHeader: doc = " + doc);

        logger.trace("createHeader: bah before createDocument  = " + bah);
        var doc1 = createDocument(bah);//bah that is to be appended
        logger.trace("createHeader: doc1 = " + doc1);

        logger.trace("createHeader: payload before createDocument  = " + payload);
        var doc2 = createDocument(payload);//payload that is to be appended
        logger.trace("createHeader: doc2 = " + doc2);

        var newNode = doc.importNode(doc1.getFirstChild(), true);
        var ele1 = doc.getElementsByTagName("Saa:Body").item(0).appendChild(newNode);//appending of both

        var newNode2 = doc.importNode(doc2.getFirstChild(), true);
        var ele2 = doc.getElementsByTagName("Saa:Body").item(0).appendChild(newNode2);//appending of both

        inBahMesage = convertDocumentToString(doc);
        logger.trace("createHeader: inBahMesage = " + inBahMesage);

        setHeader(map, "ACEDB_inBahMesage", inBahMesage);
        setHeader(map, "ACEDB_MSGBLOCK154", inBahMesage);
 	}

 	var msgDirection = getHeader(map, "PLCN_msgDirection");
 	logger.info("createHeader: msgDirection = " + msgDirection);
 	
 	/*if(msgDirection == "I") {
		var lauFlag = memTblGetTableValue(map, "FLAG-TABLE", "OB_CBPR_LAU");
		logger.info("createHeader: lauFlag = " + lauFlag);
		lauFlag = lauFlag.trim();
 	}else {
		var lauFlag = memTblGetTableValue(map, "FLAG-TABLE", "IB_CBPR_LAU");
		logger.info("createHeader: lauFlag = " + lauFlag);
		lauFlag = lauFlag.trim();
 	}*/

 	var sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	var channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId);
	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("createHeader: institutionId = " + institutionId);
	
	if(institutionId != "NIBCNLNV") {
		institutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("createHeader: parent institutionId = " + institutionId);
	}

	var key = channelIdTarget + "|" + institutionId;
	logger.info("createHeader: key = " + key);
 	var lauFlag = memTblGetTableValue(map, "LAU_CONFIG", key);
 	setHeader(map, "PLCN_lauFlag", lauFlag);
 	logger.info("createHeader: sourceChannelId = " + sourceChannelId);
	logger.info("createHeader: channelIdTarget = " + channelIdTarget);
	logger.info("createHeader: lauFlag = " + lauFlag);

	generateLAU(exchange);
	headerPayload = getHeader(map, "PLCN_headerPayload");
	logger.trace("createHeader: message with LAU = " + headerPayload);
	setHeader(map, "ACEDB_MSGBLOCK154", headerPayload);
}

/*
**
* This function generates LAU.
* @param {CamelExchange} exchange - The exchange.
*/
function generateLAU(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	var lau = new AuthCodeGenerator();
	var jsHelper = new JSHelperClass();

	var sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	var channelIdTarget = memTblGetTableValue(map, "MQ_CHANNEL_CONF_MAP", sourceChannelId);
	logger.info("generateLAU: sourceChannelId = " + sourceChannelId);
	logger.info("generateLAU: channelIdTarget = " + channelIdTarget);

	var key = jsHelper.getHzlMapValue(exchange.getIn().getHeaders(), "CH_CHANNEL_KEY", channelIdTarget);
	logger.info("generateLAU: key = " + key);

	var message = getHeader(map, "ACEDB_inBahMesage");
	logger.trace("generateLAU: message = " + message);

	var lauFlag = getHeader(map, "PLCN_lauFlag");
	logger.info("generateLAU: lauFlag = " + lauFlag);

	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("generateInterAct: institutionId = " + institutionId);

	if(institutionId != "NIBCNLNV") {
		institutionId = "NIBCNLNV";
	}

	var key1 = institutionId + "." + "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL.STAGES.PRELUDE" + "." + "PRELUDE_REQUIRED";
	var preludeFlag = memTblGetTableValue(map, "INST_PARAM", key1);
	logger.info("generateInterAct: preludeFlag = " + preludeFlag);
	
	var headerPayload;
	//var headerPayload = lau.generatePayloadSingnature(message, key, lauFlag, "Y"); // lauFlag - for signature, Y - for appending payload(AppendRequired)
	if(preludeFlag == "YES") {
		headerPayload = lau.generatePayloadSingnature(message, key, lauFlag, "Y");
	}else {
		headerPayload = message;
	}
	//if yes
	//var headerPayload = lau.generatePayloadSingnature(message, key, lauFlag); //Y will apend lau to payload
	logger.trace("generateLAU: LAU + Payload = " + headerPayload);

	setHeader(map, "PLCN_headerPayload", headerPayload);
}

/*
**
* This function generates InterAct.
* @param {CamelExchange} exchange - The exchange.
*/
function generateInterAct(exchange) {
	var swiftFileActProfileName;
	var messageFormat;
	var messageIdentifier;
	var requestorDn;
	var senderNameBic;
	var responderDn;
	var receiverNameBic;
	var serviceName;
	var network;
	var swCompression;
	var positiveDeliveryNotification;
	var ackResponderDN;
	var nrFlag;
	var msgType;
	var mType;
	var SenderReference;
	var SenderReferencePath;
	var parentInstitutionId;
	var body;
	var receiver8;
	var iPath;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var hmap = new HashMap();
	var interact = new InterActFile();

	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("generateInterAct: institutionId = " + institutionId); //PLCNUSNY

	var tableName = institutionId + "_PRM"; //PLCNUSNY_PRM_MAP
	logger.info("generateInterAct: tableName = " + tableName); //PLCNUSNY_PRM

	var interActMap = memTblGetTableValue(map, "CONF_INTERACT_MAP", tableName); //"CUST1_BIC_TO_SW";//
	logger.info("generateInterAct: interActMap = " + interActMap); //CUST1_BIC_TO_SW

	if(!interActMap) {
		institutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("generateInterAct: parent institutionId = " + institutionId);
		tableName = institutionId + "_PRM"; //PLCNGBWB
		logger.info("generateInterAct: tableName = " + tableName);

		var interActMap = memTblGetTableValue(map, "CONF_INTERACT_MAP", tableName); //"CUST1_BIC_TO_SW";//
		logger.info("generateInterAct: interActMap = " + interActMap); //CUST1_BIC_TO_SW
	}

	if(interActMap) {
		var receiver = getHeader(map, "PLCN_receiver"); 
		logger.info("generateInterAct: receiver = " + receiver); //APKEFIHHXXX

		receiver8 = receiver.substring(0, 8);
		logger.info("generateInterAct: receiver8 = " + receiver8); //APKEFIHHXXX

		interActMap = interActMap + "_MAP";
		
		var paramvalue = memTblGetTableValue(map, interActMap, receiver); //"SWIFT_INTERACT_PROFILE_01"
		logger.trace("generateInterAct: paramvalue = " + paramvalue); //SWIFT_INTERACT_PROFILE_01

		if(!paramvalue)	{
			logger.info("generateInterAct: receiver = DEFAULT_CBPR");
			paramvalue = memTblGetTableValue(map, interActMap, "DEFAULT_CBPR");
			logger.info("generateInterAct: paramvalue = " + paramvalue);
		}
	}

	if(paramvalue) {
		var key = institutionId + "."+ "SWIFT_InterAct_PROFILE_NAME" + "."+ paramvalue;
		logger.info("generateInterAct: key = " + key); //PLCNUSNY.SWIFT_INTERACT_PROFILE_NAME.SWIFT_INTERACT_PROFILE_01

		var firstPath = memTblGetTableValue(map, "INST_PARAM", key); //"OPERATIONAL_CONF.BANK_PROFILE_01";//NIBCNLNV.SWIFT_InterAct_PROFILE_NAME.SWIFT_INTERACT_PROFILE_01
		logger.info("generateInterAct: firstPath = " + firstPath); //OPERATIONAL_CONF.BANK_PROFILE_01		
	}

	if(firstPath) {
		var path = firstPath + ".INTERACT";
		logger.info("generateInterAct: path = " + path); //OPERATIONAL_CONF.BANK_PROFILE_01.INTERACT

		var profile = firstPath;		

		msgType = getHeader(map, "PLCN_msgType");

		if(msgType == "pacs.008.001.08") {
			mType = "CBPRpacs.008"; //PLCNGBWB.OPERATIONAL_CONF.BANK_PROFILE_01.INTERACT.T2pacs.008.MESSAGE_IDENTIFIER
			SenderReferencePath = "/Document/FIToFICstmrCdtTrf/GrpHdr/MsgId";
			iPath = "PACS008.MESSAGEDEFINITIONIDENTIFIER";
		}else if(msgType == "pacs.009.001.08") {
		 	mType = "CBPRpacs.009";
		 	SenderReferencePath = "/Document/FICdtTrf/GrpHdr/MsgId";
			var undrlygCstmrCdtTrfPath = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf"
			var undrlygCstmrCdtTrf = getValueFromPath(Document, undrlygCstmrCdtTrfPath);
			if(undrlygCstmrCdtTrf) {
				iPath = "PACS009COVER.MESSAGEDEFINITIONIDENTIFIER";
			}else{
				iPath = "PACS009CORE.MESSAGEDEFINITIONIDENTIFIER";
			}
		}else if(msgType == "pacs.002.001.10") {
			mType = "CBPRpacs.002";
			SenderReferencePath = "/Document/FIToFIPmtStsRpt/GrpHdr/MsgId";
		}else if(msgType == "pacs.004.001.09") {
			mType = "CBPRpacs.004";
			SenderReferencePath = "/Document/PmtRtr/GrpHdr/MsgId";
			iPath = "PACS004.MESSAGEDEFINITIONIDENTIFIER";
		}else if(msgType == "camt.057.001.06") {
			mType = "CBPRcamt.057";
			SenderReferencePath = "/Document/NtfctnToRcv/GrpHdr/MsgId";
			iPath = "CAMT057.MESSAGEDEFINITIONIDENTIFIER";
		}

		logger.info("generateInterAct: msgType = " + msgType);
		logger.info("generateInterAct: iPath = " + iPath);

		SenderReference = getValueFromPath(Document, SenderReferencePath);
		messageFormat = memTblGetTableValue(map, "INST_PARAM", institutionId + "." + path + "." + "MESSAGE_FORMAT");
		messageIdentifier = memTblGetTableValue(map, "INST_PARAM", institutionId + "." + path + "." + mType + "." + "MESSAGE_IDENTIFIER"); //PLCNUSNY.OPERATIONAL_CONF.BANK_PROFILE_01.INTERACT.T2pacs.008.MESSAGE_IDENTIFIER
		requestorDn = memTblGetTableValue(map, "INST_PARAM", institutionId + "." + path + "." + "REQUESTOR_DN");//01//02//03//90
		senderNameBic = memTblGetTableValue(map, "INST_PARAM", institutionId + "." + path + "." + "SENDER_NAME_BIC");
		responderDn = memTblGetTableValue(map, "INST_PARAM", institutionId + "." + path + "." + "RESPONDER_DN");//01//02//03//90
		logger.info("generateInterAct: responderDn = " + responderDn);
		//handle

		if(isPatternPresent(responderDn, "[receiver_bic8]")) {
			responderDn = replacePattern(responderDn, "[receiver_bic8]", receiver8.toLowerCase());
			logger.info("generateInterAct: responderDn = " + responderDn);
		}

		receiverNameBic = memTblGetTableValue(map, "INST_PARAM", institutionId + "." + path + "." + "RECEIVER_NAME_BIC");
		logger.info("generateInterAct: receiverNameBic = " + receiverNameBic);
		//handle

		if(isPatternPresent(receiverNameBic, "[receiver_bic8]")) {
			receiverNameBic = replacePattern(receiverNameBic, "[receiver_bic8]", receiver8.toUpperCase());
			logger.info("generateInterAct: receiverNameBic = " + receiverNameBic);
		}

		serviceName = memTblGetTableValue(map, "INST_PARAM", institutionId + "." + path + "." + "SERVICE_NAME");//01//02//03//90
		network = memTblGetTableValue(map, "INST_PARAM", institutionId + "." + path + "." + "NETWORK");
		swCompression = memTblGetTableValue(map, "INST_PARAM", institutionId + "." + path + "." + "SWCOMPRESSION");
		positiveDeliveryNotification = memTblGetTableValue(map, "INST_PARAM", institutionId + "." + path + "." + "POSITIVE_DELIVERY_NOTIFICATION");
		ackResponderDN = memTblGetTableValue(map, "INST_PARAM", institutionId + "." + path + "." + "ACK_RESPONDER_DN");
		logger.info("generateInterAct: ackResponderDN = " + ackResponderDN);
		//handle

		if(isPatternPresent(ackResponderDN, "[receiver_bic8]")) {
			ackResponderDN = replacePattern(ackResponderDN, "[receiver_bic8]", receiver8.toLowerCase());
			logger.info("generateInterAct: ackResponderDN = " + ackResponderDN);
		}

		nrFlag = memTblGetTableValue(map, "INST_PARAM", institutionId + "." + path + "." + "NR_FLAG");
		body = getHeader(map, "PLCN_bahMessage");
		//body = body.toString();

		var revision = memTblGetTableValue(map, "SAA_XMLV2_MAP", "INTERACT_REVISION");		
		logger.info("generateInterAct: revision = " + revision);

		if(iPath) {
			var RequestTypePath = institutionId + "." + profile + ".GENERIC." + iPath;
			var RequestTypeValue = memTblGetTableValue(map, "INST_PARAM", RequestTypePath);
			logger.info("generateInterAct: RequestTypeValue = " + RequestTypeValue);

			if(!RequestTypeValue) {
				var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
				logger.info("generateInterAct: parent institutionId = " + parentInstitutionId);
				var RequestTypePath = parentInstitutionId + "." + profile + ".GENERIC." + iPath;
				var RequestTypeValue = memTblGetTableValue(map, "INST_PARAM", RequestTypePath);
				logger.info("generateInterAct: RequestTypeValue = " + RequestTypeValue);
			}

			if(RequestTypeValue){
				hmap.put("REQUESTTYPE", RequestTypeValue);
			}
		}

		var RequestSubtypePath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE";
		var RequestSubtypeValue = memTblGetTableValue(map, "INST_PARAM", RequestSubtypePath);
		logger.info("generateInterAct: RequestSubtypeValue = " + RequestSubtypeValue);

		if(!RequestSubtypeValue) {
			var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
			logger.info("generateInterAct: parent institutionId = " + parentInstitutionId);
			var RequestSubtypePath = parentInstitutionId + "." + profile + ".GENERIC.BUSINESSSERVICE";
			var RequestSubtypeValue = memTblGetTableValue(map, "INST_PARAM", RequestSubtypePath);
			logger.info("generateInterAct: RequestSubtypeValue = " + RequestSubtypeValue);
		}

		var RequestSubtypeFlagPath = institutionId + "." + profile + ".GENERIC.REQUESTSUBTYPE";
		var RequestSubtypeFlagValue = memTblGetTableValue(map, "INST_PARAM", RequestSubtypeFlagPath);
		logger.info("generateInterAct: RequestSubtypeFlagValue = " + RequestSubtypeFlagValue);

		if(RequestSubtypeFlagValue == 'Y') {
			if(RequestSubtypeValue){
				hmap.put("REQUESTSUBTYPE", RequestSubtypeValue);
			}
		}

		hmap.put("SENDER_REFERENCE", SenderReference);
		hmap.put("MESSAGE_FORMAT", messageFormat);
		hmap.put("MESSAGE_IDENTIFIER", messageIdentifier);
		hmap.put("REQUESTOR_DN", requestorDn);
		hmap.put("SENDER_NAME_BIC", senderNameBic);
		hmap.put("RESPONDER_DN", responderDn);
		hmap.put("RECEIVER_NAME_BIC", receiverNameBic);
		hmap.put("SERVICE_NAME", serviceName);
		hmap.put("NETWORK", network);
		hmap.put("SWCOMPRESSION", swCompression);
		hmap.put("POSITIVE_DELIVERY_NOTIFICATION", positiveDeliveryNotification);
		hmap.put("ACK_RESPONDER_DN", ackResponderDN);
		hmap.put("NR_FLAG", nrFlag);
		hmap.put("REVISION", revision);
		hmap.put("FILENAME", "saa.2.0");

		logger.info("generateInterAct: InertAct Map = " + hmap);

		var interAct = interact.generateInteractHeader(hmap, "");
		logger.trace("generateInterAct: interAct = " + interAct);
		setHeader(map, "ACEDB_interact", interAct);
	}
}

/*
**
* This function generates BAH.
* @param {CamelExchange} exchange - The exchange.
*/
function generateBAH(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var msgType = getHeader(map, "PLCN_msgType");

	var BAH = getHeader(map, "PLCN_bahFrMsg");
	logger.info("generateBAH: BAH = " + BAH);

	if(!BAH) {
		setHeader(map, "PLCN_bahFrMsg", "");
	}

	if(msgType == 'pacs.004.001.09') {
		cbprBahValuesMxPacs004(Document, map);
	}

	if(msgType == 'pacs.008.001.08') {
		cbprBahValuesMxPacs008(Document, map);
	}

	if(msgType == 'pacs.009.001.08') {
		cbprBahValuesMxPacs009(Document, map);
	}

	if(msgType == 'camt.057.001.06') {
		cbprBahValuesMxCamt057(Document, map);
	}
}

/*
**
* This function validates LAU.
* @param {CamelExchange} exchange - The exchange.
*/
function validateLAU(exchange) {
	var validLAU;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	var lau = new AuthCodeGenerator();
	var jsHelper = new JSHelperClass();

	var readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	var sourceChannelId =  readMsgdb.get("SOURCECHANNELID");
	logger.info("validateLAU: sourceChannelId = " + sourceChannelId);

	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("validateLAU: institutionId = " + institutionId);
	
	if(institutionId != "NIBCNLNV") {
		institutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("validateLAU: parent institutionId = " + institutionId);
	}

	var key = sourceChannelId + "|" + institutionId;
	logger.info("validateLAU: key = " + key);

	//var lauFlag = memTblGetTableValue(map, "FLAG-TABLE", "IB_CBPR_LAU");
	var lauFlag = memTblGetTableValue(map, "LAU_CONFIG", key);
	lauFlag = lauFlag.trim();
	logger.info("validateLAU: lauFlag = " + lauFlag);

	var readMsgBlocks = inMsg.getHeaders().get("ACEQ_READ_MSGBLOCKS");
	var msgBlock1 =  readMsgBlocks.get("MSGBLOCK1");
	logger.trace("validateLAU: msgBlock1 = " + msgBlock1);
	logger.info("validateLAU: typeof msgBlock1 = " + typeof msgBlock1);

	if(lauFlag == "Y") {
		logger.info("validateLAU: calling LAU validator ");
		var key = jsHelper.getHzlMapValue(exchange.getIn().getHeaders(), "CH_CHANNEL_KEY", sourceChannelId);
		logger.info("validateLAU: key = " + key);		
		validLAU = lau.validatePayloadSingnature(msgBlock1, key);
		logger.info("validateLAU: valid LAU = " + validLAU);
	}else {
		validLAU = true;
		logger.info("validateLAU: valid LAU = " + validLAU);
	}
	
	if(validLAU == false) {
		setHeader(map, "PLCN_queue", "ERRORQ");
		setHeader(map, "PLCN_displayFlag", "Y");
		setHeader(map, "PLCN_processingStage", "ERR");
		//setHeader(map,"PLCN_currentAuthLevel", "ERR=4");
		setHeader(map, "PLCN_ERRORQ", true);
		setHeader(map, "PLCN_validFlag", "false");
		setHeader(map, "PLCN_validMessage", false);
		setCommentsForTransaction("00", "5847", map);
	}

	setHeader(map, "PLCN_validLAU", validLAU);
}

/*
**
* This function is used for generating BAH for Pacs004
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function cbprBahValuesMxPacs004(Document, map) {
	var instdAgt;
	var instgAgt;
	var msgId;
	var msgClassType;
	var msg;
	var messageNo;

	var appHeaderHandler = new AppHeaderHandler();

	var from = getHeader(map, "PLCN_sender");
	logger.trace("cbprBahValuesMxPacs004: sender = " + from);	
	var to = getHeader(map, "PLCN_receiver");
	logger.trace("cbprBahValuesMxPacs004: receiver = " + to);	

	if(!from) {
		instgAgtPath = "/Document/PmtRtr/TxInf/InstgAgt/FinInstnId/BICFI";
		from = getValueFromPath(Document, instgAgtPath);
		logger.trace("cbprBahValuesMxPacs004: instgAgt = " + from);
	}

	if(!to) {
		instdAgtPath = "/Document/PmtRtr/TxInf/InstdAgt/FinInstnId/BICFI";
		to = getValueFromPath(Document, instdAgtPath);
		logger.trace("cbprBahValuesMxPacs004: instdAgt = " + to);
	}

	msgIdPath = "/Document/PmtRtr/GrpHdr/MsgId";
	msgId = getValueFromPath(Document, msgIdPath);
	logger.info("cbprBahValuesMxPacs004: msgId = " + msgId);

	var hmap = new HashMap();

	messageNo = getHeader(map, "PLCN_messageNo");

	if(msgId == "NONREF") {
		hmap.put("BizMsgIdr", messageNo);
		logger.info("cbprBahValuesMxPacs004: businessMessageIdentifier = " + messageNo);
	}

	if(!(msgId == "NONREF")){
		hmap.put("BizMsgIdr", msgId);
		logger.info("cbprBahValuesMxPacs004: businessMessageIdentifier = " + msgId);
	}

	var date = getDateBAH();
	var time = localTime();

	var cbprDate1 = memTblGetTableValue(map, "USER_CONFIG_MAP", "CBPR_LIB2025_DATE");
	logger.info("cbprBahValues: cbprDate1 = " + cbprDate1);

	var cbprDate26 = memTblGetTableValue(map, "USER_CONFIG_MAP", "CBPR_LIB2026_DATE");
	logger.info("cbprBahValues: cbprDate26 = " + cbprDate26);

	var sysDate = getDate();
	logger.info("cbprBahValues: sysDate = " + sysDate);

	if(parseInt(sysDate) >= parseInt(cbprDate26)){
		logger.info("cbprBahValues: CBPR 2026 XSD check configured");
		setHeader(map, "PLCN_CBPR2026_XSDCHECK", true);
	}

	// Condition 2: CBPR 2026 -> date only; otherwise date + time + offset
	var CreDt = date + "T" + time + "+01:00";
	logger.info("cbprBahValuesMxPacs004: CreDt = " + CreDt);

	hmap.put("CreDt", CreDt);
	hmap.put("from", from);
	hmap.put("to", to);
	hmap.put("MsgDefIdr", "pacs.004.001.09");
	
	
	if(parseInt(sysDate) >= parseInt(cbprDate26)){
		hmap.put("BizSvc", "swift.cbprplus.04");
	}else if(parseInt(sysDate) >= parseInt(cbprDate1)){
		hmap.put("BizSvc", "swift.cbprplus.03");
	}else {
		hmap.put("BizSvc", "swift.cbprplus.02");
	}

	var bahFrMsg = getHeader(map, "PLCN_bahFrMsg");

	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("cbprBahValuesMxPacs004: institutionId = " + institutionId);

	var profile = getProfile(Document, map);
	logger.info("cbprBahValuesMxPacs004: profile = " + profile);
	
	//var clrSysMmbIdPath = institutionId + ".OPERATIONAL_CONF.BANK_PROFILE_01.BAH.CBPR_HEADER.CLRSYSMMBID";
	var clrSysMmbIdPath = institutionId + "." + profile + ".BAH.CBPR_HEADER.CLRSYSMMBID";
	var clrSysMmbIdValue = memTblGetTableValue(map, "INST_PARAM", clrSysMmbIdPath);
	logger.info("cbprBahValuesMxPacs004: clrSysMmbIdValue = " + clrSysMmbIdValue);

	if(!clrSysMmbIdValue) {
		var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("cbprBahValuesMxPacs004: parent institutionId = " + parentInstitutionId);
		var clrSysMmbIdPath = parentInstitutionId + "." + profile + ".BAH.CBPR_HEADER.CLRSYSMMBID";
		var clrSysMmbIdValue = memTblGetTableValue(map, "INST_PARAM", clrSysMmbIdPath);
		logger.info("cbprBahValuesMxPacs004: clrSysMmbIdValue = " + clrSysMmbIdValue);
	}

	if(clrSysMmbIdValue) {
		hmap.put("MmbId", clrSysMmbIdValue);
	}

	var MsgDefIdrPath = institutionId + "." + profile + ".GENERIC.PACS004.MESSAGEDEFINITIONIDENTIFIER";
	var MsgDefIdrValue = memTblGetTableValue(map, "INST_PARAM", MsgDefIdrPath);
	logger.info("cbprBahValuesMxPacs004: MsgDefIdrValue = " + MsgDefIdrValue);

	if(!MsgDefIdrValue) {
		var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("cbprBahValuesMxPacs004: parent institutionId = " + parentInstitutionId);
		var MsgDefIdrPath = parentInstitutionId + "." + profile + ".GENERIC.PACS004.MESSAGEDEFINITIONIDENTIFIER";
		var MsgDefIdrValue = memTblGetTableValue(map, "INST_PARAM", MsgDefIdrPath);
		logger.info("cbprBahValuesMxPacs004: MsgDefIdrValue = " + MsgDefIdrValue);		
	}

	if(MsgDefIdrValue){
		hmap.put("MsgDefIdr", MsgDefIdrValue);
	}

	if(parseInt(sysDate) >= parseInt(cbprDate1)){
		var BizSvcPath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2025";
	}else {
		var BizSvcPath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE";
	}
	
	if(parseInt(sysDate) >= parseInt(cbprDate26)){
		var BizSvcPath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2026";
	}
	var BizSvcValue = memTblGetTableValue(map, "INST_PARAM", BizSvcPath);
	logger.info("cbprBahValuesMxPacs004: BizSvcValue = " + BizSvcValue);

	if(!BizSvcValue) {
		var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("cbprBahValuesMxPacs004: parent institutionId = " + parentInstitutionId);
		if(parseInt(sysDate) >= parseInt(cbprDate1)){
			var BizSvcPath = parentInstitutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2025";
		}else {
			var BizSvcPath = parentInstitutionId + "." + profile + ".GENERIC.BUSINESSSERVICE";
		}
		if(parseInt(sysDate) >= parseInt(cbprDate26)){
		var BizSvcPath = parentInstitutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2026";
		}
		var BizSvcValue = memTblGetTableValue(map, "INST_PARAM", BizSvcPath);
		logger.info("cbprBahValuesMxPacs004: BizSvcValue = " + BizSvcValue);
	}

	if(BizSvcValue){
		hmap.put("BizSvc", BizSvcValue);
	}

	var bah = appHeaderHandler.createBahHeader(hmap, bahFrMsg, "head.001.001.02");
	logger.trace("cbprBahValuesMxPacs004: bah = " + bah);
	setHeader(map, "PLCN_bah", bah);
}

/*
**
* This function is used for generating BAH for Pacs008
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function cbprBahValuesMxPacs008(Document, map) {
	var instdAgt;
	var instgAgt;
	var msgId;
	var msgClassType;
	var msg;
	var messageNo;

	var appHeaderHandler = new AppHeaderHandler();

	var from = getHeader(map, "PLCN_sender");
	logger.trace("cbprBahValuesMxPacs008: sender = " + from);	
	var to = getHeader(map, "PLCN_receiver");
	logger.trace("cbprBahValuesMxPacs008: receiver = " + to);	

	if(!from) {
		instgAgtPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/InstgAgt/FinInstnId/BICFI";
		from = getValueFromPath(Document, instgAgtPath);
		logger.trace("cbprBahValuesMxPacs008: instgAgt = " + from);
	}

	if(!to) {
		instdAgtPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/InstdAgt/FinInstnId/BICFI";
		to = getValueFromPath(Document, instdAgtPath);
		logger.trace("cbprBahValuesMxPacs008: instdAgt = " + to);
	}
	
	msgIdPath = "/Document/FIToFICstmrCdtTrf/GrpHdr/MsgId";
	msgId = getValueFromPath(Document, msgIdPath);
	logger.info("cbprBahValuesMxPacs008: msgId = " + msgId);

	var hmap = new HashMap();

	messageNo = getHeader(map, "PLCN_messageNo");

	if(msgId == "NONREF") {
		hmap.put("BizMsgIdr", messageNo);
		logger.info("cbprBahValuesMxPacs008: businessMessageIdentifier = " + messageNo);
	}

	if(!(msgId == "NONREF")){
		hmap.put("BizMsgIdr", msgId);
		logger.info("cbprBahValuesMxPacs008: businessMessageIdentifier = " + msgId);
	}

	var date = getDateBAH();
	var time = localTime();

	var cbprDate1 = memTblGetTableValue(map, "USER_CONFIG_MAP", "CBPR_LIB2025_DATE");
	logger.info("cbprBahValues: cbprDate1 = " + cbprDate1);

	var cbprDate26 = memTblGetTableValue(map, "USER_CONFIG_MAP", "CBPR_LIB2026_DATE");
	logger.info("cbprBahValues: cbprDate26 = " + cbprDate26);

	var sysDate = getDate();
	logger.info("cbprBahValues: sysDate = " + sysDate);

	if(parseInt(sysDate) >= parseInt(cbprDate26)){
		logger.info("cbprBahValues: CBPR 2026 XSD check configured");
		setHeader(map, "PLCN_CBPR2026_XSDCHECK", true);
	}

	// Condition 2: CBPR 2026 -> date only; otherwise date + time + offset
	var CreDt = date + "T" + time + "+01:00";
	logger.info("cbprBahValuesMxPacs008: CreDt = " + CreDt);

	hmap.put("CreDt", CreDt);
	hmap.put("from", from);
	hmap.put("to", to);
	hmap.put("MsgDefIdr", "pacs.008.001.08");
	
	
	if(parseInt(sysDate) >= parseInt(cbprDate26)){
		hmap.put("BizSvc", "swift.cbprplus.04");
	}else if(parseInt(sysDate) >= parseInt(cbprDate1)){
		hmap.put("BizSvc", "swift.cbprplus.03");
	}else {
		hmap.put("BizSvc", "swift.cbprplus.02");
	}

	var bahFrMsg = getHeader(map, "PLCN_bahFrMsg");

	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("cbprBahValuesMxPacs008: institutionId = " + institutionId);

	var profile = getProfile(Document, map);
	logger.info("cbprBahValuesMxPacs008: profile = " + profile);
	
	//var clrSysMmbIdPath = institutionId + ".OPERATIONAL_CONF.BANK_PROFILE_01.BAH.CBPR_HEADER.CLRSYSMMBID";
	var clrSysMmbIdPath = institutionId + "." + profile + ".BAH.CBPR_HEADER.CLRSYSMMBID";
	var clrSysMmbIdValue = memTblGetTableValue(map, "INST_PARAM", clrSysMmbIdPath);
	logger.info("cbprBahValuesMxPacs008: clrSysMmbIdValue = " + clrSysMmbIdValue);

	if(!clrSysMmbIdValue) {
		var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("cbprBahValuesMxPacs008: parent institutionId = " + parentInstitutionId);
		var clrSysMmbIdPath = parentInstitutionId + "." + profile + ".BAH.CBPR_HEADER.CLRSYSMMBID";
		var clrSysMmbIdValue = memTblGetTableValue(map, "INST_PARAM", clrSysMmbIdPath);
		logger.info("cbprBahValuesMxPacs008: clrSysMmbIdValue = " + clrSysMmbIdValue);
	}

	if(clrSysMmbIdValue) {
		hmap.put("MmbId", clrSysMmbIdValue);
	}

	var MsgDefIdrPath = institutionId + "." + profile + ".GENERIC.PACS008.MESSAGEDEFINITIONIDENTIFIER";
	var MsgDefIdrValue = memTblGetTableValue(map, "INST_PARAM", MsgDefIdrPath);
	logger.info("cbprBahValuesMxPacs008: MsgDefIdrValue = " + MsgDefIdrValue);

	if(!MsgDefIdrValue) {
		var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("cbprBahValuesMxPacs008: parent institutionId = " + parentInstitutionId);
		var MsgDefIdrPath = parentInstitutionId + "." + profile + ".GENERIC.PACS008.MESSAGEDEFINITIONIDENTIFIER";
		var MsgDefIdrValue = memTblGetTableValue(map, "INST_PARAM", MsgDefIdrPath);
		logger.info("cbprBahValuesMxPacs008: MsgDefIdrValue = " + MsgDefIdrValue);
	}

	if(MsgDefIdrValue){
		hmap.put("MsgDefIdr", MsgDefIdrValue);
	}

	if(parseInt(sysDate) >= parseInt(cbprDate1)){
		var BizSvcPath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2025";
	}else {
		var BizSvcPath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE";
	}
	
	if(parseInt(sysDate) >= parseInt(cbprDate26)){
		var BizSvcPath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2026";
	}
	
	var BizSvcValue = memTblGetTableValue(map, "INST_PARAM", BizSvcPath);
	logger.info("cbprBahValuesMxPacs008: BizSvcValue = " + BizSvcValue);

	if(!BizSvcValue) {
		var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("cbprBahValuesMxPacs008: parent institutionId = " + parentInstitutionId);
		if(parseInt(sysDate) >= parseInt(cbprDate1)){
			var BizSvcPath = parentInstitutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2025";
		}else {
			var BizSvcPath = parentInstitutionId + "." + profile + ".GENERIC.BUSINESSSERVICE";
		}
		
		if(parseInt(sysDate) >= parseInt(cbprDate26)){
		var BizSvcPath = parentInstitutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2026";
		}
		var BizSvcValue = memTblGetTableValue(map, "INST_PARAM", BizSvcPath);
		logger.info("cbprBahValuesMxPacs008: BizSvcValue = " + BizSvcValue);
	}

	if(BizSvcValue){
		hmap.put("BizSvc", BizSvcValue);
	}	

	var bah = appHeaderHandler.createBahHeader(hmap, bahFrMsg, "head.001.001.02");
	logger.trace("cbprBahValuesMxPacs008: bah = " + bah);
	setHeader(map, "PLCN_bah", bah);
}

/*
**
* This function is used for generating BAH for Pacs009
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function cbprBahValuesMxPacs009(Document, map) {
	var instdAgt;
	var instgAgt;
	var msgId;
	var msgClassType;
	var msg;
	var instgAgtPath;
	var instdAgtPath;
	var msgIdPath;
	var appHeaderHandler = new AppHeaderHandler();
	var hmap = new HashMap();
	var pacs9Path;

	var from = getHeader(map, "PLCN_sender");
	logger.trace("cbprBahValuesMxPacs009: sender = " + from);	
	var to = getHeader(map, "PLCN_receiver");
	logger.trace("cbprBahValuesMxPacs009: receiver = " + to);	

	if(!from) {
		instgAgtPath = "/Document/FICdtTrf/CdtTrfTxInf/InstgAgt/FinInstnId/BICFI";
		from = getValueFromPath(Document, instgAgtPath);
		logger.trace("cbprBahValuesMxPacs009: instgAgt = " + from);
	}

	if(!to) {
		instdAgtPath = "/Document/FICdtTrf/CdtTrfTxInf/InstdAgt/FinInstnId/BICFI";
		to = getValueFromPath(Document, instdAgtPath);
		logger.trace("cbprBahValuesMxPacs009: instdAgt = " + to);
	}

	msgIdPath = "/Document/FICdtTrf/GrpHdr/MsgId";
	msgId = getValueFromPath(Document, msgIdPath);
	logger.info("cbprBahValuesMxPacs009: msgId = " + msgId);

	messageno = getHeader(map, "PLCN_messageNo");

	if(msgId == "NONREF"){
		hmap.put("BizMsgIdr", messageno);
		logger.info("cbprBahValuesMxPacs009: businessMessageIdentifier = " + messageno);
	}

	if(!(msgId == "NONREF")){
		hmap.put("BizMsgIdr", msgId);
		logger.info("cbprBahValuesMxPacs009: businessMessageIdentifier = " + msgId);
	}

	undrlygCstmrCdtTrfPath = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf"
	undrlygCstmrCdtTrf = getValueFromPath(Document, undrlygCstmrCdtTrfPath);

	if(undrlygCstmrCdtTrf) {
		//hmap.put("MsgDefIdr", "pacs.009.001.08COVER");
		pacs9Path = "PACS009COVER.MESSAGEDEFINITIONIDENTIFIER";
	}else{
		//hmap.put("MsgDefIdr", "pacs.009.001.08CORE");
		pacs9Path = "PACS009CORE.MESSAGEDEFINITIONIDENTIFIER";
	}

	var date = getDateBAH();
	var time = localTime();

	var cbprDate1 = memTblGetTableValue(map, "USER_CONFIG_MAP", "CBPR_LIB2025_DATE");
	logger.info("cbprBahValues: cbprDate1 = " + cbprDate1);

	var cbprDate26 = memTblGetTableValue(map, "USER_CONFIG_MAP", "CBPR_LIB2026_DATE");
	logger.info("cbprBahValues: cbprDate26 = " + cbprDate26);

	var sysDate = getDate();
	logger.info("cbprBahValues: sysDate = " + sysDate);

	if(parseInt(sysDate) >= parseInt(cbprDate26)){
		logger.info("cbprBahValues: CBPR 2026 XSD check configured");
		setHeader(map, "PLCN_CBPR2026_XSDCHECK", true);
	}

	// Condition 2: CBPR 2026 -> date only; otherwise date + time + offset
	var CreDt = date + "T" + time + "+01:00";

	hmap.put("CreDt", CreDt);
	hmap.put("from", from);
	hmap.put("to", to);
	
	
	if(parseInt(sysDate) >= parseInt(cbprDate26)){
		hmap.put("BizSvc", "swift.cbprplus.04");
	}else if(parseInt(sysDate) >= parseInt(cbprDate1)){
		hmap.put("BizSvc", "swift.cbprplus.03");
	}else {
		hmap.put("BizSvc", "swift.cbprplus.02");
	}

	var bahFrMsg = getHeader(map, "PLCN_bahFrMsg");

	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("cbprBahValuesMxPacs009: institutionId = " + institutionId);

	var profile = getProfile(Document, map);
	logger.info("cbprBahValuesMxPacs009: profile = " + profile);
	
	//var clrSysMmbIdPath = institutionId + ".OPERATIONAL_CONF.BANK_PROFILE_01.BAH.CBPR_HEADER.CLRSYSMMBID";
	var clrSysMmbIdPath = institutionId + "." + profile + ".BAH.CBPR_HEADER.CLRSYSMMBID";
	var clrSysMmbIdValue = memTblGetTableValue(map, "INST_PARAM", clrSysMmbIdPath);
	logger.info("cbprBahValuesMxPacs009: clrSysMmbIdValue = " + clrSysMmbIdValue);

	if(!clrSysMmbIdValue) {
		var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("cbprBahValuesMxPacs009: parent institutionId = " + parentInstitutionId);
		var clrSysMmbIdPath = parentInstitutionId + "." + profile + ".BAH.CBPR_HEADER.CLRSYSMMBID";
		var clrSysMmbIdValue = memTblGetTableValue(map, "INST_PARAM", clrSysMmbIdPath);
		logger.info("cbprBahValuesMxPacs009: clrSysMmbIdValue = " + clrSysMmbIdValue);
	}

	if(clrSysMmbIdValue) {
		hmap.put("MmbId", clrSysMmbIdValue);
	}

	var MsgDefIdrPath = institutionId + "." + profile + ".GENERIC." + pacs9Path;
	var MsgDefIdrValue = memTblGetTableValue(map, "INST_PARAM", MsgDefIdrPath);
	logger.info("cbprBahValuesMxPacs009: MsgDefIdrValue = " + MsgDefIdrValue);

	if(!MsgDefIdrValue) {
		var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("cbprBahValuesMxPacs009: parent institutionId = " + parentInstitutionId);
		var MsgDefIdrPath = parentInstitutionId + "." + profile + ".GENERIC." + pacs9Path;
		var MsgDefIdrValue = memTblGetTableValue(map, "INST_PARAM", MsgDefIdrPath);
		logger.info("cbprBahValuesMxPacs009: MsgDefIdrValue = " + MsgDefIdrValue);
	}

	if(MsgDefIdrValue){
		hmap.put("MsgDefIdr", MsgDefIdrValue);
	}

	if(parseInt(sysDate) >= parseInt(cbprDate1)){
		var BizSvcPath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2025";
	}else {
		var BizSvcPath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE";
	}
	
	if(parseInt(sysDate) >= parseInt(cbprDate26)){
		var BizSvcPath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2026";
	}
	
	//var BizSvcPath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE";
	var BizSvcValue = memTblGetTableValue(map, "INST_PARAM", BizSvcPath);
	logger.info("cbprBahValuesMxPacs009: BizSvcValue = " + BizSvcValue);

	if(!BizSvcValue) {
		var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("cbprBahValuesMxPacs009: parent institutionId = " + parentInstitutionId);
		if(parseInt(sysDate) >= parseInt(cbprDate1)){
			var BizSvcPath = parentInstitutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2025";
		}else {
			var BizSvcPath = parentInstitutionId + "." + profile + ".GENERIC.BUSINESSSERVICE";
		}
		
		if(parseInt(sysDate) >= parseInt(cbprDate26)){
		var BizSvcPath = parentInstitutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2026";
		}
		
		//var BizSvcPath = parentInstitutionId + "." + profile + ".GENERIC.BUSINESSSERVICE";
		var BizSvcValue = memTblGetTableValue(map, "INST_PARAM", BizSvcPath);
		logger.info("cbprBahValuesMxPacs009: BizSvcValue = " + BizSvcValue);
	}

	if(BizSvcValue){
		hmap.put("BizSvc", BizSvcValue);
	}

	var bah = appHeaderHandler.createBahHeader(hmap, bahFrMsg, "head.001.001.02");
	logger.trace("cbprBahValuesMxPacs009: bah = " + bah);
	setHeader(map, "PLCN_bah", bah);
}

/*
**
* This function is used for generating BAH for Pacs008
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function cbprBahValuesMxCamt057(Document, map) {
	var receiver;
	var sender;
	var msgId;
	var msgClassType;
	var msg;
	var messageNo;
	var senderPath;
	var receiverPath;
	var institutionId;

	var appHeaderHandler = new AppHeaderHandler();

	institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("cbprBahValuesMxCamt57: institutionId = " + institutionId);

	var profile = getProfile(Document, map);
	logger.info("cbprBahValuesMxCamt057: profile = " + profile);
	
	sender = getHeader(map, "PLCN_sender");
	receiver = getHeader(map, "PLCN_receiver");

	logger.trace("cbprBahValuesMxCamt057: sender = " + sender);
	logger.trace("cbprBahValuesMxCamt057: receiver = " + receiver);

	msgIdPath = "/Document/NtfctnToRcv/GrpHdr/MsgId";
	msgId = getValueFromPath(Document, msgIdPath);
	logger.info("cbprBahValuesMxCamt57: msgId = " + msgId);

	var hmap = new HashMap();

	messageNo = getHeader(map, "PLCN_messageNo");

	if(msgId == "NONREF") {
		hmap.put("BizMsgIdr", messageNo);
		logger.info("cbprBahValuesMxCamt57: businessMessageIdentifier = " + messageNo);
	}

	if(!(msgId == "NONREF")){
		hmap.put("BizMsgIdr", msgId);
		logger.info("cbprBahValuesMxCamt57: businessMessageIdentifier = " + msgId);
	}

	var date = getDateBAH();
	var time = localTime();

	var cbprDate1 = memTblGetTableValue(map, "USER_CONFIG_MAP", "CBPR_LIB2025_DATE");
	logger.info("cbprBahValues: cbprDate1 = " + cbprDate1);

	var cbprDate26 = memTblGetTableValue(map, "USER_CONFIG_MAP", "CBPR_LIB2026_DATE");
	logger.info("cbprBahValues: cbprDate26 = " + cbprDate26);

	var sysDate = getDate();
	logger.info("cbprBahValues: sysDate = " + sysDate);

	if(parseInt(sysDate) >= parseInt(cbprDate26)){
		logger.info("cbprBahValues: CBPR 2026 XSD check configured");
		setHeader(map, "PLCN_CBPR2026_XSDCHECK", true);
	}

	// Condition 2: CBPR 2026 -> date only; otherwise date + time + offset
	var CreDt = date + "T" + time + "+01:00";
	logger.info("cbprBahValuesMxCamt57: CreDt = " + CreDt);

	hmap.put("CreDt", CreDt);
	hmap.put("from", sender);
	hmap.put("to", receiver);
	//hmap.put("MsgDefIdr", "camt.057.001.06");
	//hmap.put("BizSvc", "swift.cbprplus.02");

	
	if(parseInt(sysDate) >= parseInt(cbprDate26)){
		hmap.put("BizSvc", "swift.cbprplus.04");
	}else if(parseInt(sysDate) >= parseInt(cbprDate1)){
		hmap.put("BizSvc", "swift.cbprplus.03");
	}else {
		hmap.put("BizSvc", "swift.cbprplus.02");
	}

	var bahFrMsg = getHeader(map, "PLCN_bahFrMsg");

	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("cbprBahValuesMxCamt57: institutionId = " + institutionId);
	
	//var clrSysMmbIdPath = institutionId + ".OPERATIONAL_CONF.BANK_PROFILE_01.BAH.CBPR_HEADER.CLRSYSMMBID";
	var clrSysMmbIdPath = institutionId + "." + profile + ".BAH.CBPR_HEADER.CLRSYSMMBID";
	var clrSysMmbIdValue = memTblGetTableValue(map, "INST_PARAM", clrSysMmbIdPath);
	logger.info("cbprBahValuesMxCamt57: clrSysMmbIdValue = " + clrSysMmbIdValue);

	if(!clrSysMmbIdValue) {
		var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("cbprBahValuesMxCamt57: parent institutionId = " + parentInstitutionId);
		var clrSysMmbIdPath = parentInstitutionId + "." + profile + ".BAH.CBPR_HEADER.CLRSYSMMBID";
		var clrSysMmbIdValue = memTblGetTableValue(map, "INST_PARAM", clrSysMmbIdPath);
		logger.info("cbprBahValuesMxCamt57: clrSysMmbIdValue = " + clrSysMmbIdValue);
	}

	if(clrSysMmbIdValue) {
		hmap.put("MmbId", clrSysMmbIdValue);
	}

	var MsgDefIdrPath = institutionId + "." + profile + ".GENERIC.CAMT057.MESSAGEDEFINITIONIDENTIFIER";
	var MsgDefIdrValue = memTblGetTableValue(map, "INST_PARAM", MsgDefIdrPath);
	logger.info("cbprBahValuesMxCamt057: MsgDefIdrValue = " + MsgDefIdrValue);

	if(!MsgDefIdrValue) {
		var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("cbprBahValuesMxCamt057: parent institutionId = " + parentInstitutionId);
		var MsgDefIdrPath = parentInstitutionId + "." + profile + ".GENERIC.CAMT057.MESSAGEDEFINITIONIDENTIFIER";
		var MsgDefIdrValue = memTblGetTableValue(map, "INST_PARAM", MsgDefIdrPath);
		logger.info("cbprBahValuesMxCamt057: MsgDefIdrValue = " + MsgDefIdrValue);
	}

	if(MsgDefIdrValue){
		hmap.put("MsgDefIdr", MsgDefIdrValue);
	}

	if(parseInt(sysDate) >= parseInt(cbprDate1)){
		var BizSvcPath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2025";
	}else {
		var BizSvcPath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE";
	}
	
	if(parseInt(sysDate) >= parseInt(cbprDate26)){
		var BizSvcPath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2026";
	}
	

	//var BizSvcPath = institutionId + "." + profile + ".GENERIC.BUSINESSSERVICE";
	var BizSvcValue = memTblGetTableValue(map, "INST_PARAM", BizSvcPath);
	logger.info("cbprBahValuesMxCamt057: BizSvcValue = " + BizSvcValue);

	if(!BizSvcValue) {
		var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("cbprBahValuesMxCamt057: parent institutionId = " + parentInstitutionId);

		if(parseInt(sysDate) >= parseInt(cbprDate1)){
			var BizSvcPath = parentInstitutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2025";
		}else {
			var BizSvcPath = parentInstitutionId + "." + profile + ".GENERIC.BUSINESSSERVICE";
		}
		if(parseInt(sysDate) >= parseInt(cbprDate26)){
		var BizSvcPath = parentInstitutionId + "." + profile + ".GENERIC.BUSINESSSERVICE_2026";
		}
		var BizSvcValue = memTblGetTableValue(map, "INST_PARAM", BizSvcPath);
		logger.info("cbprBahValuesMxCamt057: BizSvcValue = " + BizSvcValue);
	}

	if(BizSvcValue){
		hmap.put("BizSvc", BizSvcValue);
	}	

	var bah = appHeaderHandler.createBahHeader(hmap, bahFrMsg, "head.001.001.02");
	logger.trace("cbprBahValuesMxCamt57: bah = " + bah);
	setHeader(map, "PLCN_bah", bah);
}

function getProfile(Document, map) {
	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("getProfile: institutionId = " + institutionId); //PLCNUSNY

	var tableName = institutionId + "_PRM"; //PLCNUSNY_PRM_MAP
	logger.info("getProfile: tableName = " + tableName); //PLCNUSNY_PRM

	var interActMap = memTblGetTableValue(map, "CONF_INTERACT_MAP", tableName); //"CUST1_BIC_TO_SW";//
	logger.info("getProfile: interActMap = " + interActMap); //CUST1_BIC_TO_SW

	if(!interActMap) {
		institutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("getProfile: parent institutionId = " + institutionId);
		tableName = institutionId + "_PRM"; //PLCNGBWB
		logger.info("getProfile: tableName = " + tableName);

		var interActMap = memTblGetTableValue(map, "CONF_INTERACT_MAP", tableName); //"CUST1_BIC_TO_SW";//
		logger.info("getProfile: interActMap = " + interActMap); //CUST1_BIC_TO_SW
	}

	if(interActMap) {
		var receiver = getHeader(map, "PLCN_receiver"); 
		logger.trace("getProfile: receiver = " + receiver); //APKEFIHHXXX

		interActMap = interActMap + "_MAP";
		
		var paramvalue = memTblGetTableValue(map, interActMap, receiver); //"SWIFT_INTERACT_PROFILE_01"
		logger.trace("getProfile: paramvalue = " + paramvalue); //SWIFT_INTERACT_PROFILE_01

		if(!paramvalue)	{
			logger.info("getProfile: receiver = DEFAULT_CBPR");
			paramvalue = memTblGetTableValue(map, interActMap, "DEFAULT_CBPR");
			logger.info("getProfile: paramvalue = " + paramvalue);
		}
	}

	if(paramvalue) {
		var key = institutionId + "."+ "SWIFT_InterAct_PROFILE_NAME" + "."+ paramvalue;
		logger.info("getProfile: key = " + key); //PLCNUSNY.SWIFT_INTERACT_PROFILE_NAME.SWIFT_INTERACT_PROFILE_01

		var firstPath = memTblGetTableValue(map, "INST_PARAM", key); //"OPERATIONAL_CONF.BANK_PROFILE_01";//NIBCNLNV.SWIFT_InterAct_PROFILE_NAME.SWIFT_INTERACT_PROFILE_01
		logger.info("getProfile: firstPath = " + firstPath); //OPERATIONAL_CONF.BANK_PROFILE_01	

		return firstPath;
	}
}

/*
**
* This function is used for 
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function b2bExtractVarMx(Document, map){
    var msgId;
    var endToend;
    var txnCustom2;
    var msgIdPath;
    var endtoendPath;
    var msgType;
    var instrIdPath;
    var instrId;
   	
    logger.info("In b2bExtractVarMx");
   	msgType = getHeader(map, "PLCN_msgType");
 	
 	if(msgType == 'pacs.008.001.08') {
 	    msgIdPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/InstrId";
	    msgId = getValueFromPath(Document, msgIdPath);
	    logger.info('b2bExtractVarMx:InstrId = '+msgId);
	    setHeader(map, "PLCN_msgId", msgId);
		endtoendPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/EndToEndId";
		endToend = getValueFromPath(Document, endtoendPath);
		logger.info('b2bExtractVarMx: endToend = '+endToend);
		setHeader(map, "PLCN_endToEnd", endToend);
		txnCustom2 = endToend + "¿" + msgId;		
 	}

  	if(msgType == 'pacs.009.001.08') {
		/*msgIdPath = "/Document/FICdtTrf/GrpHdr/InstrId";
	    msgId = getValueFromPath(Document, msgIdPath);
	    logger.info('msgId = '+ msgId);
	    setHeader(map, "PLCN_msgId", msgId);*/
		instrIdPath = "/Document/FICdtTrf/CdtTrfTxInf/PmtId/InstrId";
		instrId = getValueFromPath(Document, instrIdPath);
		logger.info('b2bExtractVarMx: InstrId = '+ instrId);
		setHeader(map, "PLCN_instrId", instrId);
		endtoendPath = "/Document/FICdtTrf/CdtTrfTxInf/PmtId/EndToEndId";
		endToend = getValueFromPath(Document, endtoendPath);	
		logger.info('b2bExtractVarMx: endToend = '+endToend);
		setHeader(map, "PLCN_endToEnd", endToend);
		//txnCustom2 = msgId + "¿" + instrId;	
 	}

   	if(msgType == 'pacs.004.001.09') {

		instrIdPath = "/Document/PmtRtr/TxInf/OrgnlInstrId";
		instrId = getValueFromPath(Document, instrIdPath);
		logger.info('b2bExtractVarMx: InstrId = '+ instrId);
		setHeader(map, "PLCN_instrId", instrId);
		endtoendPath = "/Document/PmtRtr/TxInf/OrgnlEndToEndId";
		endToend = getValueFromPath(Document, endtoendPath);	
		logger.info('b2bExtractVarMx: endToend = '+endToend);
		setHeader(map, "PLCN_endToEnd", endToend);
		//txnCustom2 = msgId + "¿" + instrId;	
 	}

    logger.info("b2bPacs008ExtractVarMx: txnCustom2 = " + txnCustom2);
    setHeader(map, "PLCN_CUSTOM2", txnCustom2);
    logger.info("b2bPacs008ExtractVarMx: CUSTOM2 = " + getHeader(map, "PLCN_CUSTOM2"));
}

function dynamicRoute(exchange) {
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

	if(!pastDateFlag) {
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
	}

	PLCN_validMessage = getHeader(map, "PLCN_validMessage");
	PLCN_duplicateMessage = getHeader(map, "PLCN_duplicateMessage");
	PLCN_repairReq = getHeader(map, "PLCN_repairReq");

	logger.info("dynamicRoute: PLCN_validMessage = " + PLCN_validMessage);
	logger.info("dynamicRoute: PLCN_duplicateMessage = " + PLCN_duplicateMessage);
	logger.info("dynamicRoute: PLCN_repairReq = " + PLCN_repairReq);

	logger.info("dynamicRoute: typeof PLCN_validMessage = " + typeof PLCN_validMessage);
	logger.info("dynamicRoute: typeof PLCN_duplicateMessage = " + typeof PLCN_duplicateMessage);
	logger.info("dynamicRoute: typeof PLCN_repairReq = " + typeof PLCN_repairReq);

	responseCdsDoc = getHeader(map, "ACEDB_responseCdsDoc");
	//logger.info("dynamicRoute: responseCdsDoc = " + responseCdsDoc);

	/*var xsdStatus = getHeader(map, "xsdStatus");
	logger.info("dynamicRoute: xsdStatus = " + xsdStatus);

	if(xsdStatus == "error") {
		PLCN_validMessage = "false";
	}*/

	if(PLCN_validMessage == "true" &&  PLCN_duplicateMessage == "true" && PLCN_repairReq == "true") {
		logger.info("dynamicRoute: repair required");
		setHeader(map, "PLCN_repairReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "false");
		setHeader(map, "PLCN_queue", "MXREPRQ");
	}else if(PLCN_validMessage == "true" &&  PLCN_duplicateMessage == "true" && PLCN_repairReq == "false") {
		logger.info("dynamicRoute: repair not required");
		setHeader(map, "PLCN_repairReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "false");
		setHeader(map, "PLCN_queue", "MXDUPLQ");
	}else if(PLCN_validMessage == "true" &&  PLCN_duplicateMessage == "false" && PLCN_repairReq == "true") {
		logger.info("dynamicRoute: repair required");
		setHeader(map, "PLCN_repairReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "false");
		setHeader(map, "PLCN_queue", "MXREPRQ");
	}else if(PLCN_validMessage == "true" &&  PLCN_duplicateMessage == "false" && PLCN_repairReq == "false") {
		logger.info("dynamicRoute: no repair required");
		setHeader(map, "PLCN_repairReqFinal", "false");
		setHeader(map, "PLCN_validFlag", "true");
	}else if(PLCN_validMessage == "false" &&  PLCN_duplicateMessage == "true" && PLCN_repairReq == "true") {
		logger.info("dynamicRoute: repair required");
		setHeader(map, "PLCN_repairReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "false");
		//setHeader(map, "PLCN_queue", "ERRORQ");
		//inMsg.setBody(responseCdsDoc);
	}else if(PLCN_validMessage == "false" &&  PLCN_duplicateMessage == "true" && PLCN_repairReq == "false") {
		logger.info("dynamicRoute: repair required");
		setHeader(map, "PLCN_repairReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "false");
		//setHeader(map, "PLCN_queue", "ERRORQ");
		//inMsg.setBody(responseCdsDoc);
	}else if(PLCN_validMessage == "false" &&  PLCN_duplicateMessage == "false" && PLCN_repairReq == "true") {
		logger.info("dynamicRoute: repair required");
		setHeader(map, "PLCN_repairReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "false");
		//setHeader(map, "PLCN_queue", "ERRORQ");
		//inMsg.setBody(responseCdsDoc);
	}else if(PLCN_validMessage == "false" &&  PLCN_duplicateMessage == "false" && PLCN_repairReq == "false") {
		logger.info("dynamicRoute: repair required");
		setHeader(map, "PLCN_repairReqFinal", "true");
		setHeader(map, "PLCN_validFlag", "false");
		//setHeader(map, "PLCN_queue", "ERRORQ");
		//inMsg.setBody(responseCdsDoc);
	}
	//var validflag = getHeader(map, 'PLCN_validFlag');
	var sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	logger.info("dynamicRoute: sourceChannelId = " + sourceChannelId);
	
	//For Manual Upload
	if(sourceChannelId == 'SWIFT_MX_UPL_IN' || sourceChannelId == 'SWIFT_UPL_IN') {
		if(PLCN_validMessage == 'true' || PLCN_duplicateMessage == 'true') {
			setHeader(map, "PLCN_queue", "MXREPRQ");
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
				setHeader(map, "PLCN_queue", "MXREPRQ");
				setHeader(map, "PLCN_repairReqFinal", "true");
			}
		}
	}

	if(!queue) {
		if(PLCN_validMessage == "false"){
			if(orgMessageClassType != "") {
				queue = "MXREPRQ";
				setHeader(map, "PLCN_queue", "MXREPRQ");
				setHeader(map, "PLCN_repairReqFinal", "true");
			}else {
				setHeader(map, "PLCN_queue", "ERRORQ");
				setHeader(map, "PLCN_displayFlag", "Y");
				setHeader(map, "PLCN_processingStage", "ERR");
				setHeader(map, "PLCN_ERRORQ", true);
				setHeader(map, "PLCN_repairReqFinal", "true");
			}
		}			
	}

	var queue = getHeader(map, "PLCN_queue");
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

	var xsdValid = getHeader(map, "XSD_VALID");
	logger.info("dynamicRoute: xsdValid = " + xsdValid);

	/*if(xsdValid == false) {
		setHeader(map, "PLCN_validFlag", false);
	}*/

	if(getHeader(map, "PLCN_validFlag") == "true") {
		logger.info("dynamicRoute: PLCN_queue = " + getHeader(map, "PLCN_queue"));
	}

	logger.info("dynamicRoute: PLCN_ERRORQ = " + getHeader(map, "PLCN_ERRORQ"));
	logger.info("dynamicRoute: PLCN_MXREPRQ = " + getHeader(map, "PLCN_MXREPRQ"));
	logger.info("dynamicRoute: PLCN_MXDUPLQ = " + getHeader(map, "PLCN_MXDUPLQ"));
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
    logger.trace("setOriginalBody: body = " + responseCdsDoc);

    if(isPatternPresent(responseCdsDoc, "<ResponseCds>")) {
    	setHeader(map, "ACEDB_responseCdsDoc", responseCdsDoc);
    }

	orgnlBody = getHeader(map, "ACEDB_originalBody");
	logger.trace("setOriginalBody: orgnlBody = " + orgnlBody);
	logger.trace("setOriginalBody: responseCdsDoc = " + responseCdsDoc);
	inMsg.setBody(orgnlBody);
  	setHeader(map, "ACEDB_originalBody", "");
}

function setResponseCds(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	logger.info("In setResponseCds");
	
	var responseCdsDoc = getHeader(map, "ACEDB_responseCdsDoc");
	logger.info("setResponseCds: responseCdsDoc = " + responseCdsDoc);

	validMessage = getHeader(map, "PLCN_validMessage");

	if(validMessage == "false") {
		inMsg.setBody(responseCdsDoc);
	}
}

function checkWarehouseMsgs(exchange) {
	var inMsg;
	var map;
	var readMsgdb;
	var Document;

	logger.info("In checkWarehouseMsgs");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var custom24 =  readMsgdb.get("CUSTOM24");
	logger.info("checkWarehouseMsgs: custom24 = " + custom24);
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

	logger.trace("createResponse: responseCdsString = " + responseCdsString);
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
		logger.trace("createResponse: responseDoc = " + responseDoc);

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

	logger.trace("createResponse: responseDoc = " + responseDoc);
	logger.info("createResponse: status = " + getHeader(map, "status"));

	if(responseDoc){
		logger.trace("createResponse: responseDoc = " + responseDoc);
		logger.info("createResponse: typeof responseDoc = " + typeof responseDoc);
		var responseCdsString = getPrettyPrint(responseDoc);
		logger.trace("createResponse: responseCdsString = " + responseCdsString);
		var internalFlag = getHeader(map, "PLCN_call");
		logger.info("createResponse: internalFlag = " + internalFlag);

		if(!internalFlag){
			inMsg.setBody(responseCdsString);
		}else {
			setHeader(map, "ACEDB_responseCdsDoc", responseCdsString);
		}
	}
}

function populateMetaDataInfo(exchange) {
	var inMsg;
	var msgdbMap;
	var map;
	var Document;
	var Document1;

	logger.info("In populateMetaDataInfo");

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	Document1 = inMsg.getBody(java.lang.String.class);

	populateMetaDataInfoPacs008(exchange);
	populateMetaDataInfoPacs009(exchange);
}

function populateMetaDataInfoPacs008(exchange){
	var inMsg;
	var msgdbMap;
	var map;
	var Document;
	var Document1;
	var msgType;
	var readMsgdb;

	logger.info("In populateMetaDataInfoPacs008");

	inMsg = exchange.getIn();
	msgdbMap = new HashMap();
	map = inMsg.getHeaders();
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	Document1 = inMsg.getBody(java.lang.String.class);
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	msgType = readMsgdb.get("MESSAGECLASSTYPE");

	if(msgType === 'pacs.008.001.08'){

		var dbtrNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Nm';
		var dbtrNm = getValueFromPath(Document, dbtrNmPath);
		logger.info("populateMetaDataInfoPacs008: dbtrNm =" + dbtrNm);
		msgdbMap.put("ORIGNAME", dbtrNm);	

		var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		msgdbMap.put("ACCOUNT_DR", debtorAcc);

		if(!debtorAcc){
			var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			msgdbMap.put("ACCOUNT_DR", debtorAcc);			
		}

		var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		msgdbMap.put("ACCOUNT_NUMBER", debtorAcc);

		if(!debtorAcc){
			var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			msgdbMap.put("ACCOUNT_NUMBER", debtorAcc);			
		}

		var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		msgdbMap.put("CUSTOMERACCNO", debtorAcc);

		if(!debtorAcc){
			var debtorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			msgdbMap.put("CUSTOMERACCNO", debtorAcc);			
		}	

		var debtorAgentPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI';
		var debtorAgent = getValueFromPath(Document, debtorAgentPth);
		msgdbMap.put("CUSTOMER", debtorAgent);

		var cdtrNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Nm';
		var cdtrNm = getValueFromPath(Document, cdtrNmPath);
		msgdbMap.put("BENEFNAME", cdtrNm);
		msgdbMap.put("OTHER_PARTY_DETAILS", cdtrNm);

		var creditorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		msgdbMap.put("OTHER_ACCNO", creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			msgdbMap.put("OTHER_ACCNO", creditorAcc);
		}

		var creditorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		msgdbMap.put("ACCOUNT_CR", creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			msgdbMap.put("ACCOUNT_CR", creditorAcc);
		}
		var cdtrAddr1Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/AdrLine[1]';
		var cdtrAddr1 = getValueFromPath(Document, cdtrAddr1Path);
		msgdbMap.put("BENBANKADDR1", cdtrAddr1);
		logger.info("cdtrAddr1 : " + cdtrAddr1);

		var cdtrAddr2Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/AdrLine[2]';
		var cdtrAddr2 = getValueFromPath(Document, cdtrAddr2Path);
		msgdbMap.put("BENBANKADDR2", cdtrAddr2);
		logger.info("cdtrAddr2 : " + cdtrAddr2);

		var cdtrAddr3Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/AdrLine[3]';
		var cdtrAddr3 = getValueFromPath(Document, cdtrAddr3Path);
		msgdbMap.put("BENBANKADDR3", cdtrAddr3);
		logger.info("cdtrAddr3 : " + cdtrAddr3);

		var cdtrCityPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/TwnNm';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		msgdbMap.put("BENBANKCITY", cdtrCity);
		logger.info("CityName : " + cdtrCity);

		var cdtrCtryPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/Ctry';
		var cdtrCtry = getValueFromPath(Document, cdtrCtryPath);
		msgdbMap.put("BENBANKCTRY", cdtrCtry);

		var cdtrCityPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/CtrySubDvsn';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		msgdbMap.put("BENBANKSTATECODE", cdtrCity);

		var cdtrCityPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/PstCd';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		msgdbMap.put("BENBANKZIPCODE", cdtrCity);
		
		logger.info("populateMetaDataInfoPacs008: msgdbMap = " + msgdbMap);

		setHeader(map, "ACEQ_WRITE_MSGDB", msgdbMap);
	}
}

function populateMetaDataInfoPacs009(exchange){
	var inMsg;
	var msgdbMap;
	var map;
	var Document;
	var Document1;
	var msgType;
	var readMsgdb;

	logger.info("In populateMetaDataInfoPacs009");

	inMsg = exchange.getIn();
	msgdbMap = new HashMap();
	map = inMsg.getHeaders();
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	Document1 = inMsg.getBody(java.lang.String.class);
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");

	msgType = readMsgdb.get("MESSAGECLASSTYPE");

	if(msgType === 'pacs.009.001.08'){

		var dbtrNmPath = '/Document/FICdtTrf/CdtTrfTxInf/Dbtr/FinInstnId/Nm';
		var dbtrNm = getValueFromPath(Document, dbtrNmPath);
		logger.info("populateMetaDataInfoPacs009: dbtrNm =" + dbtrNm);
		msgdbMap.put("ORIGNAME", dbtrNm);	

		var debtorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		msgdbMap.put("ACCOUNT_DR", debtorAcc);

		if(!debtorAcc){
			var debtorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			msgdbMap.put("ACCOUNT_DR", debtorAcc);			
		}

		var debtorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		msgdbMap.put("ACCOUNT_NUMBER", debtorAcc);

		if(!debtorAcc){
			var debtorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			msgdbMap.put("ACCOUNT_NUMBER", debtorAcc);			
		}

		var debtorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
		var debtorAcc = getValueFromPath(Document, debtorAccPth);
		msgdbMap.put("CUSTOMERACCNO", debtorAcc);

		if(!debtorAcc){
			var debtorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr/Id';
			var debtorAcc = getValueFromPath(Document, debtorAccPth);
			msgdbMap.put("CUSTOMERACCNO", debtorAcc);			
		}	

		var debtorAgentPth = '/Document/FICdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI';
		var debtorAgent = getValueFromPath(Document, debtorAgentPth);
		msgdbMap.put("CUSTOMER", debtorAgent);

		var cdtrNmPath = '/Document/FICdtTrf/CdtTrfTxInf/Cdtr/FinInstnId/Nm';
		var cdtrNm = getValueFromPath(Document, cdtrNmPath);
		msgdbMap.put("BENEFNAME", cdtrNm);
		msgdbMap.put("OTHER_PARTY_DETAILS", cdtrNm);

		var creditorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAcct/Id/Othr/Id';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		msgdbMap.put("ACCOUNT_CR", creditorAcc);

		var creditorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		msgdbMap.put("OTHER_ACCNO", creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			msgdbMap.put("OTHER_ACCNO", creditorAcc);
		}

		var creditorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN';
		var creditorAcc = getValueFromPath(Document, creditorAccPth);
		msgdbMap.put("ACCOUNT_CR", creditorAcc);

		if(!creditorAcc){
			var creditorAccPth = '/Document/FICdtTrf/CdtTrfTxInf/CdtrAcct/Id/Othr/Id';
			var creditorAcc = getValueFromPath(Document, creditorAccPth);
			msgdbMap.put("ACCOUNT_CR", creditorAcc);
		}
		var cdtrAddr1Path = '/Document/FICdtTrf/CdtTrfTxInf/Cdtr/FinInstnId/PstlAdr/AdrLine[1]';
		var cdtrAddr1 = getValueFromPath(Document, cdtrAddr1Path);
		msgdbMap.put("BENBANKADDR1", cdtrAddr1);
		logger.info("cdtrAddr1 : " + cdtrAddr1);

		var cdtrAddr2Path = '/Document/FICdtTrf/CdtTrfTxInf/Cdtr/FinInstnId/PstlAdr/AdrLine[2]';
		var cdtrAddr2 = getValueFromPath(Document, cdtrAddr2Path);
		msgdbMap.put("BENBANKADDR2", cdtrAddr2);
		logger.info("cdtrAddr2 : " + cdtrAddr2);

		var cdtrAddr3Path = '/Document/FICdtTrf/CdtTrfTxInf/Cdtr/FinInstnId/PstlAdr/AdrLine[3]';
		var cdtrAddr3 = getValueFromPath(Document, cdtrAddr3Path);
		msgdbMap.put("BENBANKADDR3", cdtrAddr3);
		logger.info("cdtrAddr3 : " + cdtrAddr3);

		var cdtrCityPath = '/Document/FICdtTrf/CdtTrfTxInf/Cdtr/FinInstnId/PstlAdr/TwnNm';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		msgdbMap.put("BENBANKCITY", cdtrCity);
		logger.info("CityName : " + cdtrCity);

		var cdtrCtryPath = '/Document/FICdtTrf/CdtTrfTxInf/Cdtr/FinInstnId/PstlAdr/Ctry';
		var cdtrCtry = getValueFromPath(Document, cdtrCtryPath);
		msgdbMap.put("BENBANKCTRY", cdtrCtry);

		var cdtrCityPath = '/Document/FICdtTrf/CdtTrfTxInf/Cdtr/FinInstnId/PstlAdr/CtrySubDvsn';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		msgdbMap.put("BENBANKSTATECODE", cdtrCity);

		var cdtrCityPath = '/Document/FICdtTrf/CdtTrfTxInf/Cdtr/FinInstnId/PstlAdr/PstCd';
		var cdtrCity = getValueFromPath(Document, cdtrCityPath);
		msgdbMap.put("BENBANKZIPCODE", cdtrCity);

		logger.info("populateMetaDataInfoPacs009: msgdbMap = " + msgdbMap);

		setHeader(map, "ACEQ_WRITE_MSGDB", msgdbMap);
	}
}

function valueToUpper(exchange, Document1, path, value){
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	//logger.info("In valueToUpper");
	//logger.info("valueToUpper: path = " + path);
	//logger.info("valueToUpper: value = " + value);
	var tmpValue = getValueFromPath(Document, path);
	//logger.info("valueToUpper: tmpValue = " + tmpValue);
	
	if(value){
		if(value != value.toUpperCase()){
			value = value.toUpperCase();
			//logger.info("valueToUpper: upper case value = " + value);
			var doc = setValueInPath(Document1, path, value);

			if(doc != 1) {
				var messageBody = convertDocumentToString(doc);
				//logger.trace("valueToUpper: messageBody = " + messageBody);
				inMsg.setBody(doc);
				setHeader(map, "ACEDB_originalBody", messageBody);
				logger.trace("valueToUpper: Message Body Updated.");
			}
		}			
	}
}

function enrichIbanBic(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var msgType = getHeader(map, "PLCN_msgType");

	logger.info("In enrichIbanBic");
	logger.info("enrichIbanBic: msgType = " + msgType);

	if(msgType == "pacs.002.001.10") {
		enrichPacs002Bic(exchange);
		enrichPacs002Iban(exchange);
	}

	if(msgType == "pacs.004.001.09") {
		enrichPacs004Bic(exchange);
		enrichPacs004Iban(exchange);
	}

	if(msgType == "pacs.008.001.08") {
		enrichPacs008Bic(exchange);
		enrichPacs008Iban(exchange);
	}

	if(msgType == "pacs.009.001.08") {
		enrichPacs009Bic(exchange);
		enrichPacs009Iban(exchange);
	}

	if(msgType == "camt.057.001.06") {
		enrichCamt057Bic(exchange);
		enrichCamt057Iban(exchange);
	}
}

function enrichPacs002Bic(exchange) {
	var path;
	var value = null;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In enrichPacs002Bic");

	path = "/Document/FIToFIPmtStsRpt/GrpHdr/InstgAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/GrpHdr/InstdAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/ChrgsInf/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/InstgAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/InstdAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/SttlmInf/InstgRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/SttlmInf/InstdRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/SttlmInf/ThrdRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlCdtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlDbtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/UltmtDbtr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/Dbtr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/DbtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/Cdtr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/UltmtCdtr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);
}

function enrichPacs004Bic(exchange) {
	var path;
	var value = null;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In enrichPacs004Bic");

	path = "/Document/AppHdr/Fr/OrgId/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Fr/FIId/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/To/OrgId/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/To/FIId/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Rltd/Fr/OrgId/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Rltd/Fr/FIId/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Rltd/To/OrgId/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Rltd/To/FIId/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/GrpHdr/SttlmInf/InstgRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/GrpHdr/SttlmInf/InstdRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/GrpHdr/SttlmInf/ThrdRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/GrpHdr/InstgAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/GrpHdr/InstdAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/OrgnlGrpInf/RtrRsnInf/Orgtr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/ChrgsInf/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/InstgAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/InstdAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/UltmtDbtr/Pty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/UltmtDbtr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/Dbtr/Pty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/Dbtr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/InitgPty/Pty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/InitgPty/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/DbtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/PrvsInstgAgt1/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/PrvsInstgAgt2/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/PrvsInstgAgt3/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/IntrmyAgt1/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/IntrmyAgt2/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/IntrmyAgt3/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/CdtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/Cdtr/Pty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/Cdtr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/UltmtCdtr/Pty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrChain/UltmtCdtr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/RtrRsnInf/Orgtr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrSchmeId/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/SttlmInf/InstgRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/SttlmInf/InstdRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/SttlmInf/ThrdRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlCdtrSchmeId/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlCdtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlDbtr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlDbtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/RmtInf/Strd/Invcr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/RmtInf/Strd/Invcee/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/RmtInf/Strd/GrnshmtRmt/Grnshee/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/RmtInf/Strd/GrnshmtRmt/GrnshmtAdmstr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/UltmtDbtr/Pty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/UltmtDbtr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/Dbtr/Pty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/Dbtr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/Pty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/UltmtCdtr/Pty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/UltmtCdtr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);
}

function enrichPacs008Bic(exchange) {
	var path;
	var value;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In enrichPacs008Bic");

	path = "/Document/AppHdr/Fr/OrgId/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Fr/FIId/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/To/OrgId/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/To/FIId/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Rltd/Fr/OrgId/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Rltd/Fr/FIId/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Rltd/To/OrgId/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Rltd/To/FIId/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/GrpHdr/SttlmInf/InstgRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/GrpHdr/SttlmInf/InstdRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/GrpHdr/SttlmInf/ThrdRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/GrpHdr/InstgAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/GrpHdr/InstdAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/ChrgsInf/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PrvsInstgAgt1/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PrvsInstgAgt2/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PrvsInstgAgt3/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/InstgAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/InstdAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrmyAgt1/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrmyAgt2/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrmyAgt3/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/UltmtDbtr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/InitgPty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/UltmtCdtr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/RmtInf/Strd/Invcr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/RmtInf/Strd/Invcee/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/RmtInf/Strd/GrnshmtRmt/Grnshee/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/RmtInf/Strd/GrnshmtRmt/GrnshmtAdmstr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);
}

function enrichPacs009Bic(exchange) {
	var path;
	var value = null;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In enrichPacs008Bic");

	path = "/Document/AppHdr/Fr/OrgId/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Fr/FIId/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/To/OrgId/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/To/FIId/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Rltd/Fr/OrgId/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Rltd/Fr/FIId/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Rltd/To/OrgId/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/AppHdr/Rltd/To/FIId/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/GrpHdr/SttlmInf/InstgRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/GrpHdr/SttlmInf/InstdRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/GrpHdr/SttlmInf/ThrdRmbrsmntAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/GrpHdr/InstgAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/GrpHdr/InstdAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/PrvsInstgAgt1/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/PrvsInstgAgt2/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/PrvsInstgAgt3/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/InstgAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/InstdAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/IntrmyAgt1/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/IntrmyAgt2/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/IntrmyAgt3/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UltmtDbtr/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/Dbtr/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/Cdtr/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UltmtCdtr/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/UltmtDbtr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/InitgPty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/Dbtr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/DbtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/PrvsInstgAgt1/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/PrvsInstgAgt2/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/PrvsInstgAgt3/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/IntrmyAgt1/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/IntrmyAgt2/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/IntrmyAgt3/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/CdtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/Cdtr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/UltmtCdtr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/RmtInf/Strd/Invcr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/RmtInf/Strd/Invcee/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/RmtInf/Strd/GrnshmtRmt/Grnshee/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/RmtInf/Strd/GrnshmtRmt/GrnshmtAdmstr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);
}

function enrichCamt057Bic(exchange) {
	var path;
	var value = null;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In enrichCamt057Bic");

	path = "/Document/NtfctnToRcv/GrpHdr/MsgSndr/Pty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/AcctOwnr/Pty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Dbtr/Pty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Itm/AcctOwnr/Pty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Itm/Dbtr/Pty/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Itm/RmtInf/Strd/Invcr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Itm/RmtInf/Strd/Invcee/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Itm/RmtInf/Strd/GrnshmtRmt/Grnshee/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Itm/RmtInf/Strd/GrnshmtRmt/GrnshmtAdmstr/Id/OrgId/AnyBIC";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/GrpHdr/MsgSndr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/AcctOwnr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/AcctSvcr/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Dbtr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/DbtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/IntrmyAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Itm/AcctOwnr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Itm/AcctSvcr/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Itm/Dbtr/Agt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Itm/DbtrAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Itm/IntrmyAgt/FinInstnId/BICFI";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);
}

function enrichPacs002Iban(exchange) {
	var path;
	var value = null;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In enrichPacs002Iban");

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/SttlmInf/SttlmAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/SttlmInf/InstgRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/SttlmInf/InstdRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/SttlmInf/ThrdRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlCdtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlDbtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlDbtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/DbtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/CdtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);
}

function enrichPacs004Iban(exchange) {
	var ibanPath;
	var value = null;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In enrichPacs004Iban");

	path = "/Document/PmtRtr/GrpHdr/SttlmInf/SttlmAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/GrpHdr/SttlmInf/InstgRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/GrpHdr/SttlmInf/InstdRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/GrpHdr/SttlmInf/ThrdRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/SttlmInf/SttlmAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/SttlmInf/InstgRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/SttlmInf/InstdRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/SttlmInf/ThrdRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlCdtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlDbtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlDbtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);
}

function enrichPacs008Iban(exchange) {
	var path;
	var value = null;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In enrichPacs008Iban");

	path = "/Document/FIToFICstmrCdtTrf/GrpHdr/SttlmInf/SttlmAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/GrpHdr/SttlmInf/InstgRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/GrpHdr/SttlmInf/InstdRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/GrpHdr/SttlmInf/ThrdRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PrvsInstgAgt1Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PrvsInstgAgt2Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PrvsInstgAgt3Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrmyAgt1Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrmyAgt2Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrmyAgt3Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);
}

function enrichPacs009Iban(exchange) {
	var path;
	var value = null;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In enrichPacs009Iban");

	path = "/Document/FICdtTrf/GrpHdr/SttlmInf/SttlmAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/GrpHdr/SttlmInf/InstgRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/GrpHdr/SttlmInf/InstdRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/GrpHdr/SttlmInf/ThrdRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/PrvsInstgAgt1Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/PrvsInstgAgt2Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/PrvsInstgAgt3Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/IntrmyAgt1Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/IntrmyAgt2Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/IntrmyAgt3Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/DbtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/CdtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/DbtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/DbtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/PrvsInstgAgt1Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/PrvsInstgAgt2Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/PrvsInstgAgt3Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/IntrmyAgt1Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/IntrmyAgt2Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/IntrmyAgt3Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/CdtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/FICdtTrf/CdtTrfTxInf/UndrlygCstmrCdtTrf/CdtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);
}

function enrichCamt057Iban(exchange) {
	var path;
	var value = null;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In enrichCamt057Iban");

	path = "/Document/NtfctnToRcv/Ntfctn/Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/RltdAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Itm/Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);

	path = "/Document/NtfctnToRcv/Ntfctn/Itm/RltdAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	valueToUpper(exchange, Document, path, value);
}

//This function derives mx clearing id
function mxClearingId(map){
	var tdKey;
	var tdValue;
	var currency;
	var clrgId;
	var comments;
	var comments1;
	var comments2;

	logger.info("In mxClearingId");

	currency = getHeader(map, "PLCN_currency");
	logger.info("mxClearingId: currency = " + currency);

	tdKey = "Outbound_SWIFT_" + currency;
	logger.info("mxClearingId: tdKey = " + tdKey);
	logger.info("mxClearingId: tdKey length = " + tdKey.length);

	tdValue = memTblGetTableValue(map, "MX_CLG_ID_MAP", tdKey);
	logger.info("mxClearingId: tdValue = " + tdValue);

	if(tdValue == "Y") {
		tdValue = tdKey
	}else {
		tdValue = "Outbound_SWIFT_DEF";
	}

	setHeader(map, "PLCN_clearingId", tdValue);
	setHeader(map, "PLCN_clrgIdSet", tdValue);

	return tdValue;
}

function cbprMxCamt057Values(Document, map) {
	var receiver;
	var sender;
	var msgId;
	var msgClassType;
	var msg;
	var messageNo;
	var senderPath;
	var receiverPath;
	var institutionId;

	var appHeaderHandler = new AppHeaderHandler();

	institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("cbprMxCamt057Values: institutionId = " + institutionId);

	var profile = getProfile(Document, map);
	logger.info("cbprBahValuesMxPacs009: profile = " + profile);
	
	senderPath = "/Document/NtfctnToRcv/GrpHdr/MsgSndr/Agt/FinInstnId/BICFI";
	sender = getValueFromPath(Document, senderPath);
	logger.info("cbprMxCamt057Values: sender from MsgSndr = " + sender);

	if(!sender) {
		senderPath = "/Document/NtfctnToRcv/Ntfctn/AcctOwnr/Agt/FinInstnId/BICFI";
		sender = getValueFromPath(Document, senderPath);
		logger.info("cbprMxCamt057Values: sender from AcctOwnr = " + sender);
	}

	if(!sender) {
		sender = getHeader(map, "PLCN_sender");
		logger.info("cbprMxCamt057Values: sender = " + sender);
	}

	if(!sender) {
		senderPath = institutionId + "." + profile + ".BAH.CBPR_HEADER" + "." + "SENDER";
		sender = memTblGetTableValue(map, "INST_PARAM", senderPath);
		logger.info("cbprMxCamt057Values: sender from Institution Parameter = " + sender);

		if(!sender) {
			institutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
			logger.info("cbprMxCamt057Values: parent institutionId = " + institutionId);
			senderPath = institutionId + "." + profile + ".BAH.CBPR_HEADER" + "." + "SENDER";
			sender = memTblGetTableValue(map, "INST_PARAM", senderPath);
			logger.info("cbprMxCamt057Values: sender from Institution Parameter = " + sender);
		}
	}

	receiverPath = "/Document/NtfctnToRcv/Ntfctn/AcctSvcr/FinInstnId/BICFI";
	receiver = getValueFromPath(Document, receiverPath);
	logger.info("cbprMxCamt057Values: receiver from AcctSvcr = " + receiver);

	if(!receiver) {
		receiver = getHeader(map, "PLCN_receiver");
		logger.info("cbprMxCamt057Values: receiver = " + receiver);
	}

	if(!receiver) {
		receiverPath = institutionId + "." + profile + ".BAH.CBPR_HEADER" + "." + "RECEIVER";
		receiver = memTblGetTableValue(map, "INST_PARAM", receiverPath);
		logger.info("cbprMxCamt057Values: receiver from Institution Parameter = " + receiver);

		if(!receiver) {
			institutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
			logger.info("cbprMxCamt057Values: parent institutionId = " + institutionId);
			receiverPath = institutionId + "." + profile + ".BAH.CBPR_HEADER" + "." + "RECEIVER";
			receiver = memTblGetTableValue(map, "INST_PARAM", receiverPath);
			logger.info("cbprMxCamt057Values: receiver from Institution Parameter = " + receiver);
		}
	}

	logger.info("cbprMxCamt057Values: sender = " + sender);
	logger.info("cbprMxCamt057Values: receiver = " + receiver);

	setHeader(map, "PLCN_sender", sender);
	setHeader(map, "PLCNAPI_sender", sender);
	setHeader(map, "PLCN_receiver", receiver);
	setHeader(map, "PLCNAPI_receiver", receiver);

	var transRefNoPath = "/Document/NtfctnToRcv/Ntfctn/Id";
	var transRefNo = getValueFromPath(Document, transRefNoPath);

	if(!transRefNo){
		var transRefNoPath = "/Document/NtfctnToRcv/Ntfctn/Itm/Id";
		var transRefNo = getValueFromPath(Document, transRefNoPath);	
	}
	logger.info("cbprMxCamt057Values: transRefNo = " + transRefNo);

	setHeader(map, "PLCN_transRefNo", transRefNo);
	setHeader(map, "PLCNAPI_transRefNo", transRefNo);
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
}

function schedulingCheckCustom24(exchange) {
	var inMsg;
	var map;
	var Document;
	var retVal;
	var body;

	var releaseDate;
	var releaseTime;
	var valueDate;

	logger.info("In schedulingCheckCustom24");
	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	body = inMsg.getBody(java.lang.String.class);

	var custom24 = getHeader(map, "PLCN_custom24");
	logger.info("schedulingCheckCustom24: custom24 = " + custom24);
	
	if(!custom24) {
		valueDate = getHeader(map, "PLCN_valueDate");
		logger.info("schedulingCheckCustom24: releaseDateTime = " + releaseDate);
		releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
		logger.info("schedulingCheckCustom24: releaseDate = " + releaseDate); //09062021
		releaseDate = releaseDate.substr(0, 2) + "/" + releaseDate.substr(2, 2) + "/" + releaseDate.substr(4, 8);
		logger.info("schedulingCheckCustom24: releaseDate = " + releaseDate);
		
		setHeader(map, "PLCN_custom24", releaseDate);
	}
}

function setProcessingStage(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	logger.info("In setProcessingStage");

    var institutionId = getHeader(map, "PLCN_institutionId");
    logger.info("setProcessingStage: institutionId = " + institutionId);	

    var authLevelKey = institutionId + "." + "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL.STAGES.AUTHORIZATION" + "." + "STAGE_ACCESS_CONTROL";
    logger.info("setProcessingStage: authLevelKey = " + authLevelKey);

    var authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
    logger.info("setProcessingStage: authLevelValue = " + authLevelValue);

    if(!authLevelValue) {
        authLevelKey = institutionId + "." + "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL" + "." + "INSTITUTION_ACCESS_CONTROL";
        logger.info("setProcessingStage: authLevelKey = " + authLevelKey);

        authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
        logger.info("setProcessingStage: authLevelValue = " + authLevelValue);      
    }

    authLevelValue = "AUTH=" + textToNum(authLevelValue);
    logger.info("setProcessingStage: authLevelValue = " + authLevelValue);

    setHeader(map, "PLCN_processingStage", "AUTH");
    setHeader(map, "PLCN_currentAuthLevel", authLevelValue);
    setHeader(map, "PLCN_queue", "MXMSGAH");
    setHeader(map, "PLCN_QUEUE", "MXMSGAH");
}