function customSntdRules(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var tenantName;

  	body = inMsg.getBody(java.lang.String.class);
  	logger.info("customSntdRules: body = " + body);
  	setHeader(map, "PLCN_originalMsgBody", body);
	
	logger.info("In customSntdRules");

	setHeader(map, "PLCN_customCheckReq", "false");

    institutionId = getHeader(map, "PLCN_institutionId");
    logger.info("customSntdRules: institutionId = " + institutionId);

	tenantName = getHeader(map, "PLCN_tenantName");
	logger.info("customSntdRules: tenantName = " + tenantName);

	if(!tenantName){
		var tenantNamePath = institutionId + ".INSTITUTION_DETAILS.TENANT_NAME";
		logger.info("customSntdRules: tenantName = " + tenantNamePath);
		tenantName = customMemTblGetTblValue(map, "INST_PARAM",tenantNamePath);
		logger.info("customSntdRules: tenantName = " + tenantName);
	}

	if(tenantName == "SNTDBK" || tenantName == "PLNT01"){
		sntdMainRouteRule(exchange);
	}
}

function sntdMainRouteRule(exchange) {
	logger.info("In sntdMainRouteRule");
	routeEodDecsnSntd(exchange);
	wrapperRuleMessageSntd(exchange);
	routeRulePacsSntd(exchange);
}

function routeEodDecsnSntd(exchange) {

	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	var messageclasstype;
	logger.info("In routeEodDecsnSntd");
	messageclasstype = getHeader(map, "PLCN_msgType");
	logger.info("routeEodDecsnSntd: messageclasstype = " + messageclasstype);
	if(isPatternPresent(messageclasstype, "pacs.008")) {
		pacs008Enhancer(exchange);
	}	
	
	if(isPatternPresent(messageclasstype, "pacs.003")) {
		 pacs003Enhancer(exchange);
	}
	
	if(isPatternPresent(messageclasstype,"pacs.004")) {
		 pacs004Enhancer(exchange);
	}
	return "FALSE";
}

//PACS008 ENHANCER
function pacs008Enhancer(exchange){
     var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 
	 var internalBicPath = '/Document/FIToFICstmrCdtTrf/GrpHdr/InstgAgt/FinInstnId/BICFI';
     var internalBic = getValueFromPath(Document, internalBicPath);
	 setHeader(map, "PLCN_internalBic", internalBic);
     logger.info("pacs008Enhancer:internalBic = " + internalBic);

     var externalBicPath = '/Document/FIToFICstmrCdtTrf/GrpHdr/InstdAgt/FinInstnId/BICFI';
     var externalBic = getValueFromPath(Document, externalBicPath);
     logger.info("pacs008Enhancer:externalBic = " + externalBic);
     setHeader(map, "PLCN_externalBic", externalBic);
	 
	 valueDateSntd(exchange);
	 amountSntd(exchange);
	 endToEndIdSntd(exchange);
	 externalBicSntd(exchange);
	 externalBicMapSntd(exchange);
	 
	 var businessTrnCodeGroupPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtTpInf/CtgyPurp/Cd';
	 var businessTrnCodeGroup = getValueFromPath(Document, businessTrnCodeGroupPath);
	 setHeader(map, "PLCN_bussTrnCodeGroup", businessTrnCodeGroup);
     logger.info("pacs008Enhancer:businessTrnCodeGroup = " + businessTrnCodeGroup);
 
     externalIbanSntd(exchange);
     initialRegistrationRef(exchange);
	 
	 var internalBicPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI';
	 var internalBic = getValueFromPath(Document, internalBicPath);
	 setHeader(map, "PLCN_internalBic", internalBic);
     logger.info("pacs008Enhancer:internalBic = " + internalBic);
	 
	 internalIbanSntd(exchange);
     var purposePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Purp/Prtry';
	 var purpose = getValueFromPath(Document, purposePath);
	 setHeader(map, "PLCN_purpose", purpose);
     logger.info("pacs008Enhancer:purpose = " + purpose);
	 
	 var recipientCountryCodePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/Ctry';
     var recipientCountryCode =  getValueFromPath(Document, recipientCountryCodePath);
	 setHeader(map, "PLCN_recipientCountryCode", recipientCountryCode);
     logger.info("pacs008Enhancer:recipientCountryCode = " + recipientCountryCode);
	  
	 var recipientAddressPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/StrtNm';
     var recipientAddress =  getValueFromPath(Document, recipientAddressPath);
	 setHeader(map, "PLCN_recipientAddress", recipientAddress);
     logger.info("pacs008Enhancer:recipientAddress = " + recipientAddress); 
	 
	 var recipientNamePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Nm';
     var recipientName =  getValueFromPath(Document, recipientNamePath);
	 setHeader(map, "PLCN_recipientName", recipientName);
     logger.info("pacs008Enhancer:recipientName = " + recipientName); 
	  
	var recipientPlacePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/TwnNm';
     var recipientPlace =  getValueFromPath(Document, recipientPlacePath);
	 setHeader(map, "PLCN_recipientPlace", recipientPlace);
     logger.info("pacs008Enhancer:recipientPlace = " + recipientPlace); 
	  
	var recipientPostcodePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/PstCd';
     var recipientPostcode =  getValueFromPath(Document, recipientPostcodePath);
	 setHeader(map, "PLCN_recipientPostcode", recipientPostcode);
     logger.info("pacs008Enhancer:recipientPostcode = " + recipientPostcode);  
	  
	customerNameSntd(exchange);
	var valueDate3Path = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmDt';
	var valueDate3 = getValueFromPath(Document, valueDate3Path);
	setHeader(map, "PLCN_valueDate3", valueDate3);
     logger.info("pacs008Enhancer:valueDate3 = " + valueDate3);
	 
	internalBicMapSntd(exchange);

	var codePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/RmtInf/Strd/CdtrRefInf/Tp/CdOrPrtry/Cd';
	var code = getValueFromPath(Document, codePath);
	if(code) {
	 	use2Strd(exchange);
	}
	 use2Ustrd(exchange);
	 
}

function valueDateSntd(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);  
	 
	var valueDatePath = '/Document/FIToFICstmrCdtTrf/GrpHdr/IntrBkSttlmDt';
     var valueDate = getValueFromPath(Document, valueDatePath);
     logger.info("valueDateSntd: valueDate = " + valueDate);
	 if(valueDate){
		valueDate = replaceAllPattern(valueDate, "-", ""); 
	 }
	 setHeader(map, "PLCN_valueDate", valueDate);	 
}

function valueDateSntdPacs003(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);  
	 
	var valueDatePath = '/Document/FIToFICstmrDrctDbt/GrpHdr/IntrBkSttlmDt';
     var valueDate = getValueFromPath(Document, valueDatePath);
     logger.info("valueDateSntd: valueDate = " + valueDate);
	 if(valueDate){
		valueDate = replaceAllPattern(valueDate, "-", ""); 
	 }
	 logger.info("valueDateSntdPacs003:valueDate = " + valueDate);
	 setHeader(map, "PLCN_valueDate", valueDate);	 
}

function amountSntd(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);  
	 var amountPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt';
      var amount = getValueFromPath(Document, amountPath);
      logger.info("amountSntd: amount = " + amount);
	 amount = amountConversionRule(exchange,amount , 16);
	 logger.info("amountSntd: amount = " + amount);
     setHeader(map, "PLCN_amountTrnCurr", amount);	 
}

function endToEndIdSntd(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 var endToEndIdPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/EndToEndId';
     var endToEndId = getValueFromPath(Document, endToEndIdPath);
     logger.info("endToEndIdSntd: endToEndId = " + endToEndId);
	 
	 if(!endToEndId){
		 endToEndId = "NOTPROVIDED";
		 while(k<25){
			 endToEndId = endToEndId + singleBlankSpace;
			 k = k+1; 
		 }
		 setHeader(map, "PLCN_endToEndId", endToEndId);	
		 
	 }else{
	 	if(endToEndId){
	 		endToEndIdLen = endToEndId.length();
	 	}
		blankSpace = 35 - endToEndIdLen;
		blankSpace = blankSpace + 1;
		while(k<blankSpace){
			endToEndId = endToEndId + singleBlankSpace;
			 k = k+1; 	
		}
       setHeader(map, "PLCN_endToEndId", endToEndId);	 		
	 }
	
}

function externalBicSntd(exchange){
	var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var debtorBicLength;
	 var creditorBicLength;
	 var msgDirection;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("sapDoctype: msgDirection = " + msgDirection);
	 var debtorPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI';
	 var debtorBic = getValueFromPath(Document, debtorPath);
	 logger.info("externalBicSntd: debtorBic = " + debtorBic);
	 var creditorPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/BICFI';
     var creditorBic = getValueFromPath(Document, creditorPath);
     logger.info("externalBicSntd: creditorBic = " + creditorBic);
	 
	 if(debtorBic || creditorBic){
	 	if(creditorBic){
	 		creditorBicLength = creditorBic.length();
	 	}

	 	if(debtorBic){
	 		debtorBicLength = debtorBic.length();
	 	}
		 
		 if(creditorBicLength < 11){
			 creditorBic = creditorBic + "   ";
		 }
		 if(debtorBicLength < 11){
			 debtorBic = debtorBic + "   ";
		 }	 
	 }
	 if(msgDirection == 'I'){
		setHeader(map, "PLCN_externalBic", creditorBic); 
	 }else{
		 if(msgDirection == 'O'){
			setHeader(map, "PLCN_externalBic", debtorBic);  
		 }
	 }
}

function externalBicMapSntd(exchange){
	var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var debtorBicLength;
	 var creditorBicLength;
	 var msgDirection;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("sapDoctype: msgDirection = " + msgDirection);

	 var debtorPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI';
	 var debtorBic = getValueFromPath(Document, debtorPath);
	 logger.info("externalBicMapSntd: debtorBic = " + debtorBic);
	 var creditorPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/BICFI';
     var creditorBic = getValueFromPath(Document, creditorPath);
     logger.info("externalBicMapSntd: creditorBic = " + creditorBic);
	 
	 if(debtorBic || creditorBic){
		 creditorBicLength = creditorBic.length();
		 debtorBicLength = debtorBic.length();
		 if(creditorBicLength < 11){
			 creditorBic = creditorBic + "   ";
		 }
		 if(debtorBicLength < 11){
			 debtorBic = debtorBic + "   ";
		 }	 
	 }
	 if(msgDirection == 'I'){
		setHeader(map, "PLCN_externalBicMap", creditorBic); 
	 }else{
		 if(msgDirection == 'O'){
			setHeader(map, "PLCN_externalBicMap", debtorBic);  
		 }
	 }
}

function externalIbanSntd(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	 var debtorPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
	 var debtorIban = getValueFromPath(Document, debtorPath);
	 logger.info("externalIbanSntd: debtorIban = " + debtorIban);
	 var creditorPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN';
     var creditorIban = getValueFromPath(Document, creditorPath);
     logger.info("externalIbanSntd: creditorIban = " + creditorIban);
	 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("sapDoctype: msgDirection = " + msgDirection);
	 
	 if(msgDirection == 'I'){
		var externalIban =  creditorIban;
		var externalIbanLength;
		if(externalIban) {
			externalIbanLength = externalIban.length();
		}
		blankSpace = 34 - externalIbanLength;
		blankSpace = blankSpace + 1;
		while(k<blankSpace){
			externalIban = externalIban + singleBlankSpace;
			k = k+1;
		}
		setHeader(map, "PLCN_externalIban", externalIban);
	 }else{
		 if(msgDirection == 'O'){
		    var externalIban =  debtorIban;
		    var externalIbanLength;
		    if(externalIban) {
				externalIbanLength = externalIban.length();
				logger.info("externalIbanSntd: externalIbanLength = " + externalIbanLength);
			}
			blankSpace = 34 - externalIbanLength;
		    blankSpace = blankSpace + 1;
			while(k<blankSpace){
			externalIban = externalIban + singleBlankSpace;
			k = k+1;
		    }
			logger.info("externalIbanSntd: externalIban = " + externalIban);
			setHeader(map, "PLCN_externalIban", externalIban);
		 }
	 }	 
}
function initialRegistrationRef(exchange){
	var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	 var initialRegistrationRefPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/TxId';
	 var initialRegistrationRef = getValueFromPath(Document, initialRegistrationRefPath);
	 logger.info("initialRegistrationRef: initialRegistrationRef = " + initialRegistrationRef);

	  var initialRegistrationRefLength;
	  if(initialRegistrationRef){
	 	 initialRegistrationRefLength = initialRegistrationRef.length();
		}
	 blankSpace = 35 - initialRegistrationRefLength;
	 blankSpace = blankSpace + 1;
	 while(k<blankSpace){
		 initialRegistrationRef = initialRegistrationRef + " ";
		 k = k+1;
	 }
  	logger.info("initialRegistrationRef: initialRegistrationRef after spaces= " + initialRegistrationRef);
	 setHeader(map, "PLCN_initialRegistrationRef", initialRegistrationRef);
}

function internalIbanSntd(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	 var debtorPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN';
	 var debtorIban = getValueFromPath(Document, debtorPath);
	 logger.info("internalIbanSntd: debtorIban = " + debtorIban);

	 var creditorPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN';
     var creditorIban = getValueFromPath(Document, creditorPath);
     logger.info("internalIbanSntd: creditorIban = " + creditorIban);
	 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("sapDoctype: msgDirection = " + msgDirection);
	 
	  var internalIbanLength;

	 if(msgDirection == 'I'){
		var internalIban =  debtorIban;
		if(internalIban) {
			internalIbanLength = internalIban.length();
		}
		blankSpace = 34 - internalIbanLength;
		blankSpace = blankSpace + 1;
		while(k<blankSpace){
			internalIban = internalIban + singleBlankSpace;
			k = k+1;
		}
		setHeader(map, "PLCN_internalIban", internalIban);
	 }else{
		 if(msgDirection == 'O'){
		    var internalIban =  creditorIban;
		    if(internalIban) {
				internalIbanLength = internalIban.length();
			}
			blankSpace = 34 - internalIbanLength;
		    blankSpace = blankSpace + 1;
			while(k<blankSpace){
			internalIban = internalIban + " ";
			k = k+1;
		    }
			setHeader(map, "PLCN_internalIban", internalIban);
		 }
	 }	 
}

function customerNameSntd(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var k;
	 var customerNameLength;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 var customerNamePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Nm';
	 var customerName = getValueFromPath(Document, customerNamePath);
	 logger.info("customerName: customerName = " + customerName);
	 if(!customerName){
		 customerName = customMemTblGetTblValue(map, F007DefaultValues, customerName)
	 }else{
	 	 if(customerName) {
		 	customerNameLength = customerName.length();
			logger.info("customerName: customerNameLength = " + customerNameLength);
		}
		 if(customerNameLength != 70){
			 if(customerNameLength > 70){
				 customerName =  customerName.substr(0,70);
				 logger.info("customerName: if length is more than 70 = " + customerName);
			 }else{
				blankSpace = 70 - customerNameLength;
				blankSpace = blankSpace + 1;
				while(k<blankSpace){
					customerName = customerName + singleBlankSpace;
					k = k+1;
				}
				 logger.info("customerName: if length is less than 70 after adding spaces = " + customerName);
			 }
		 }
	 }
	 setHeader(map, "PLCN_customerName", customerName);
	 return customerName;	 
}

function internalBicMapSntd(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var debtorBicLength;
	 var creditorBicLength;
	 var msgDirection;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("sapDoctype: msgDirection = " + msgDirection);
	 var debtorPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI';
	 var debtorBic = getValueFromPath(Document, debtorPath);
	 var creditorPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/BICFI';
     var creditorBic = getValueFromPath(Document, creditorPath);
	 
	 if(debtorBic || creditorBic){
	 	if(creditorBic) {
		 creditorBicLength = creditorBic.length();
		}
		if(debtorBic) {
		 	debtorBicLength = debtorBic.length();
		}
		 if(creditorBicLength < 11){
			 creditorBic = creditorBic + "   ";
		 }
		 if(debtorBicLength < 11){
			 debtorBic = debtorBic + "   ";
		 }	 
	 }
	 if(msgDirection == 'I'){
		setHeader(map, "PLCN_internalBicMap", debtorBic); 
	 }else{
		 if(msgDirection == 'O'){
			setHeader(map, "PLCN_internalBicMap", creditorBic);  
		 }
	 }
}

function use2Strd(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	logger.info("use2Strd: msgDirection = " + msgDirection);

	 var codePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/RmtInf/Strd/CdtrRefInf/Tp/CdOrPrtry/Cd';
	 var code = getValueFromPath(Document, codePath);
	 logger.info("use2Strd: code = " + code);

	 var refPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/RmtInf/Strd/CdtrRefInf/Ref';
     var ref = getValueFromPath(Document, refPath);
     logger.info("use2Strd: ref = " + ref);

     var use2Value = "";
     if(code && ref) {
		 if(msgDirection == 'O'){
			  use2Value = use2Value + "Code: " + code + ";  " + "Reference: " + ref;
		 }
		 if(msgDirection == 'I'){
			  use2Value = use2Value + "Code: " + code + ";  " + "Reference: " + ref;
		 }
		}else {
			use2Value = use2Value + "Code: " + "" + ";  " + "Reference: " + "";
		}
	 var use2Id = use2Value;
	 logger.info("use2Strd: use2Id = " + use2Id);
	 if(use2Id) {
	 	 var use2IdLength = use2Id.length;
	 	  logger.info("use2Strd: use2IdLength = " + use2IdLength);
	 }
	 blankSpace = 140 - use2IdLength;
	 blankSpace = blankSpace + 1;
	 
	 while(k<blankSpace){
		use2Id = use2Id +  singleBlankSpace;
		k = k+1;
	 }
	 setHeader(map, "PLCN_use2", use2Id);
	 
}

function use2Ustrd(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var use2Id
	 var use2IdLength;
	 var k;
	 var blankSpace;
	 var singleBlankSpace;
	 k=1;
	 blankSpace = 0;
	 singleBlankSpace = " ";
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 use2Id = getHeader(map,"PLCN_use2");
     logger.info("use2Ustrd: use2Id = " + use2Id);

	 var use2ValuePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/RmtInf/Ustrd';
	 var use2Value = getValueFromPath(Document, use2ValuePath);
	 logger.info("use2Ustrd: use2Value = " + use2Value);
	 if(use2Id){
		 setHeader(map, "PLCN_use2", use2Id);
		 logger.info("use2Ustrd: use2Id inside if loop= ");
		 return;
	 }
	 use2Id = use2Value;
	 logger.info("use2Ustrd: use2Id = " + use2Id);
	 if(use2Id) {
	 	use2IdLength = use2Id.length();
		logger.info("use2Ustrd: use2IdLength = " + use2IdLength);
	}
	 blankSpace = 140 - use2IdLength;
	 blankSpace = blankSpace + 1;
	 
	 while(k<blankSpace){
		use2Id = use2Id + singleBlankSpace;
		k = k+1;
	 }
	 logger.info("use2Ustrd: use2Id = " + use2Id);
	 setHeader(map, "PLCN_use2", use2Id);	
}

//PACS003 ENHANCER
function pacs003Enhancer(exchange){
     var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
 
     var executionSequencePath = '/Document/FIToFICstmrDrctDbt/GrpHdr/PmtTpInf/SeqTp';
     var executionSequence = getValueFromPath(Document, executionSequencePath);
	 setHeader(map, "PLCN_executionSequence", executionSequence);
     logger.info("pacs003Enhancer:executionSequence = " + executionSequence);
 
     var sddSchemePath = '/Document/FIToFICstmrDrctDbt/GrpHdr/PmtTpInf/LclInstrm/Cd';
     var sddScheme = getValueFromPath(Document, sddSchemePath);
	 setHeader(map, "PLCN_sddScheme", sddScheme);
     logger.info("pacs003Enhancer:sddScheme = " + sddScheme);

     var valueDate3Path = '/Document/FIToFICstmrDrctDbt/GrpHdr/IntrBkSttlmDt';
     var valueDate3 = getValueFromPath(Document, valueDate3Path);
	 setHeader(map, "PLCN_valueDate3", valueDate3);
     logger.info("pacs003Enhancer:valueDate3 = " + valueDate3);
	 
	 amountPacs003(exchange);
	 endToEndIdPacs003(exchange);
	 initialRegistrationRefPacs003(exchange);
	 
	 executionSequence = getHeader(map, "PLCN_executionSequence");
	 if(!executionSequence){
		 var executionSequencePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/PmtTpInf/SeqTp';
		 var executionSequence = getValueFromPath(Document, executionSequencePath);
		 setHeader(map, "PLCN_executionSequence", executionSequence);
		 logger.info("pacs003Enhancer:executionSequence = " + executionSequence);
	 }
	 
	 externalBicPacs003(exchange);
	 externalBicMapPacs003(exchange);
	 
	 var businessTrnCodeGroupPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/PmtTpInf/CtgyPurp/Cd';
	 var businessTrnCodeGroup = getValueFromPath(Document, businessTrnCodeGroupPath);
	 setHeader(map, "PLCN_bussTrnCodeGroup", businessTrnCodeGroup);
     logger.info("pacs003Enhancer:businessTrnCodeGroup = " + businessTrnCodeGroup);
	 
	 externalIbanPacs003(exchange);
	 internalBicPacs003(exchange);
	 internalBicMapPacs003(exchange);
	 internalIbanPacs003(exchange);
	 
	 var purposePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Purp/Prtry';
	 var purpose = getValueFromPath(Document, purposePath);
	 setHeader(map, "PLCN_purpose", purpose);
     logger.info("pacs003Enhancer:purpose = " + purpose);
	 
	 var purposePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Purp/Prtry';
	 var purpose = getValueFromPath(Document, purposePath);
	 setHeader(map, "PLCN_purpose", purpose);
     logger.info("pacs003Enhancer:purpose = " + purpose);
	 
	 sddScheme = getHeader(map, "PLCN_sddScheme");
	 if(!sddScheme){
		 var sddSchemePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/PmtTpInf/LclInstrm/Cd';
		 var sddScheme = getValueFromPath(Document, sddSchemePath);
		 setHeader(map, "PLCN_sddScheme", sddScheme);
		 logger.info("pacs003Enhancer:sddScheme = " + sddScheme);
	 }
	 
	 var valueDatePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/IntrBkSttlmDt';
	 var valueDate = getValueFromPath(Document, valueDatePath);
	 setHeader(map, "PLCN_valueDate", valueDate);
     logger.info("pacs003Enhancer:valueDate = " + valueDate);
	 //valueDateSntdPacs003(exchange)
	 
	 var creditorIdPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DrctDbtTx/CdtrSchmeId/Id/OrgId/Othr/Id';
	 var creditorId = getValueFromPath(Document, creditorIdPath);
	 setHeader(map, "PLCN_creditorId", creditorId);
     logger.info("pacs003Enhancer:creditorId = " + creditorId);
	 
	 creditorIdPacs003(exchange);
	 mandateDateSntd(exchange);
	 mandateNumberSntd(exchange);
	 
	 var recipientAddressPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/StrtNm';
     var recipientAddress =  getValueFromPath(Document, recipientAddressPath);
	 setHeader(map, "PLCN_recipientAddress", recipientAddress);
     logger.info("pacs003Enhancer:recipientAddress = " + recipientAddress); 
	 
	 var recipientCountryCodePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/Ctry';
     var recipientCountryCode =  getValueFromPath(Document, recipientCountryCodePath);
	 setHeader(map, "PLCN_recipientCountryCode", recipientCountryCode);
     logger.info("pacs003Enhancer:recipientCountryCode = " + recipientCountryCode);
	 
	 var recipientNamePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/Nm';
     var recipientName =  getValueFromPath(Document, recipientNamePath);
	 setHeader(map, "PLCN_recipientName", recipientName);
     logger.info("pacs003Enhancer:recipientName = " + recipientName); 
	 
	 var recipientPlacePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/TwnNm';
     var recipientPlace =  getValueFromPath(Document, recipientPlacePath);
	 setHeader(map, "PLCN_recipientPlace", recipientPlace);
     logger.info("pacs003Enhancer:recipientPlace = " + recipientPlace); 
	  
	 var recipientPostcodePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/PstCd';
     var recipientPostcode =  getValueFromPath(Document, recipientPostcodePath);
	 setHeader(map, "PLCN_recipientPostcode", recipientPostcode);
     logger.info("pacs003Enhancer:recipientPostcode = " + recipientPostcode);
	 
	 use2Pacs003(exchange);
}

function amountPacs003(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);  
	 var amountPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/IntrBkSttlmAmt';
     var amount = getValueFromPath(Document, amountPath);
	 amount = amountConversionRule(exchange,amount , 16);
     setHeader(map, "PLCN_amountTrnCurr", amount);	 
}

function endToEndIdPacs003(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 var endToEndIdPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/PmtId/EndToEndId';
     var endToEndId = getValueFromPath(Document, endToEndIdPath);
	 
	 if(!endToEndId){
		 endToEndId = "NOTPROVIDED"
		 while(k<25){
			 endToEndId = endToEndId + singleBlankSpace;
			 k = k+1; 
		 }
		 setHeader(map, "PLCN_endToEndId", endToEndId);	
		 
	 }else{
	 	if(endToEndId) {
			endToEndIdLength = endToEndId.length();
		}
		blankSpace = 35 - endToEndIdLength;
		blankSpace = blankSpace + 1;
		while(k<blankSpace){
			endToEndId = endToEndId + singleBlankSpace;
			 k = k+1; 	
		}
       setHeader(map, "PLCN_endToEndId", endToEndId);	 		
	 }
	
}

function initialRegistrationRefPacs003(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	 var initialRegistrationRefPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/PmtId/TxId';
	 var initialRegistrationRef = getValueFromPath(Document, initialRegistrationRefPath);
	 var initialRegistrationRefLength
	 if(initialRegistrationRef) {
	  initialRegistrationRefLength = initialRegistrationRef.length();
	}
	 blankSpace = 35 - initialRegistrationRefLength;
	 blankSpace = blankSpace + 1;
	 while(k<blankSpace){
		 initialRegistrationRef = initialRegistrationRef + singleBlankSpace;
		 k = k+1;
	 }
	 setHeader(map, "PLCN_initialRegistrationRef", initialRegistrationRef);
}

function externalBicPacs003(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var debtorBicLength;
	 var creditorBicLength;
	 var msgDirection;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("sapDoctype: msgDirection = " + msgDirection);
	 var debtorPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DbtrAgt/FinInstnId/BICFI';
	 var debtorBic = getValueFromPath(Document, debtorPath);
	 var creditorPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CdtrAgt/FinInstnId/BICFI';
     var creditorBic = getValueFromPath(Document, creditorPath);
	 
	 if(debtorBic || creditorBic){
	 	if(creditorBic) {
		 	creditorBicLength = creditorBic.length();
		}
		if(debtorBic) {
		 debtorBicLength = debtorBic.length();
		}
		 if(creditorBicLength < 11){
			 creditorBic = creditorBic + "   ";
		 }
		 if(debtorBicLength < 11){
			 debtorBic = debtorBic + "   ";
		 }	 
	 }
	 if(msgDirection == 'I'){
		setHeader(map, "PLCN_externalBic", debtorBic); 
	 }else{
		 if(msgDirection == 'O'){
			setHeader(map, "PLCN_externalBic", creditorBic);  
		 }
	 }
}

function externalBicMapPacs003(exchange){
	var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var debtorBicLength;
	 var creditorBicLength;
	 var msgDirection;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("sapDoctype: msgDirection = " + msgDirection);
	 var debtorPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DbtrAgt/FinInstnId/BICFI';
	 var debtorBic = getValueFromPath(Document, debtorPath);
	 var creditorPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CdtrAgt/FinInstnId/BICFI';
     var creditorBic = getValueFromPath(Document, creditorPath);
	 
	 if(debtorBic || creditorBic){
	 	if(creditorBic) {
		 	creditorBicLength = creditorBic.length();
		}
		if(debtorBic) {
		 	debtorBicLength = debtorBic.length();
		}
		 if(creditorBicLength < 11){
			 creditorBic = creditorBic + "   ";
		 }
		 if(debtorBicLength < 11){
			 debtorBic = debtorBic + "   ";
		 }	 }
	 if(msgDirection == 'O'){
		setHeader(map, "PLCN_externalBicMap", creditorBic); 
	 }else{
		 if(msgDirection == 'I'){
			setHeader(map, "PLCN_externalBicMap", debtorBic);  
		 }
	 }
}

function externalIbanPacs003(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	 var debtorPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DbtrAcct/Id/IBAN';
	 var debtorIban = getValueFromPath(Document, debtorPath);
	 var creditorPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CdtrAcct/Id/IBAN';
     var creditorIban = getValueFromPath(Document, creditorPath);
	 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("sapDoctype: msgDirection = " + msgDirection);
	 
	 var externalIbanLength;

	 if(msgDirection == 'I'){
		var externalIban =  debtorIban;
		if(externalIban) {
		 externalIbanLength = externalIban.length();
		}
		blankSpace = 34 - externalIbanLength;
		blankSpace = blankSpace + 1;
		while(k<blankSpace){
			externalIban = externalIban + singleBlankSpace;
			k = k+1;
		}
		setHeader(map, "PLCN_externalIban", externalIban);
	 }else{
		 if(msgDirection == 'O'){
		    var externalIban =  creditorIban;
		    if(externalIban) {
				externalIbanLength = externalIban.length();
			}
			blankSpace = 34 - externalIbanLength;
		    blankSpace = blankSpace + 1;
			while(k<blankSpace){
			externalIban = externalIban + singleBlankSpace;
			k = k+1;
		    }
			setHeader(map, "PLCN_externalIban", externalIban);
		 }
	 }	 
}

function internalBicPacs003(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var debtorBicLength;
	 var creditorBicLength;
	 var msgDirection;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("sapDoctype: msgDirection = " + msgDirection);
	 var debtorPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DbtrAgt/FinInstnId/BICFI';
	 var debtorBic = getValueFromPath(Document, debtorPath);
	 var creditorPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CdtrAgt/FinInstnId/BICFI';
     var creditorBic = getValueFromPath(Document, creditorPath);
	 
	 if(debtorBic || creditorBic){
	 	if(creditorBic) {
		 	creditorBicLength = creditorBic.length();
		}
		if(debtorBic) {
		 	debtorBicLength = debtorBic.length();
		}
		 if(creditorBicLength < 11){
			 creditorBic = creditorBic + "   ";
		 }
		 if(debtorBicLength < 11){
			 debtorBic = debtorBic + "   ";
		 }	 
	 }
	 if(msgDirection == 'I'){
		setHeader(map, "PLCN_internalBic", creditorBic); 
	 }else{
		 if(msgDirection == 'O'){
			setHeader(map, "PLCN_internalBic", debtorBic);  
		 }
	 }	
}

function internalBicMapPacs003(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var debtorBicLength;
	 var creditorBicLength;
	 var msgDirection;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("sapDoctype: msgDirection = " + msgDirection);
	 var debtorPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DbtrAgt/FinInstnId/BICFI';
	 var debtorBic = getValueFromPath(Document, debtorPath);
	 var creditorPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CdtrAgt/FinInstnId/BICFI';
     var creditorBic = getValueFromPath(Document, creditorPath);
	 
	 if(debtorBic || creditorBic){
	 	if(creditorBic) {
		 	creditorBicLength = creditorBic.length();
		}
		if(debtorBic) {
		 	debtorBicLength = debtorBic.length();
		}
		 if(creditorBicLength < 11){
			 creditorBic = creditorBic + "   ";
		 }
		 if(debtorBicLength < 11){
			 debtorBic = debtorBic + "   ";
		 }	 
	 }
	 if(msgDirection == 'I'){
		setHeader(map, "PLCN_internalBicMap", creditorBic); 
	 }else{
		 if(msgDirection == 'O'){
			setHeader(map, "PLCN_internalBicMap", debtorBic);  
		 }
	 }
}


function internalIbanPacs003(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	 var debtorPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DbtrAcct/Id/IBAN';
	 var debtorIban = getValueFromPath(Document, debtorPath);
	 var creditorPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CdtrAcct/Id/IBAN';
     var creditorIban = getValueFromPath(Document, creditorPath);
	 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("sapDoctype: msgDirection = " + msgDirection);
	 
 	 var internalIbanLength;

	 if(msgDirection == 'I'){
		var internalIban =  creditorIban;
		if(internalIban) {
		 internalIbanLength = internalIban.length();
		}
		blankSpace = 34 - internalIbanLength;
		blankSpace = blankSpace + 1;
		while(k<blankSpace){
			internalIban = internalIban + singleBlankSpace;
			k = k+1;
		}
		setHeader(map, "PLCN_internalIban", internalIban);
	 }else{
		 if(msgDirection == 'O'){
		    var internalIban =  debtorIban;
		    if(internalIban) {
			 internalIbanLength = internalIban.length();
			}
			blankSpace = 34 - internalIbanLength;
		    blankSpace = blankSpace + 1;
			while(k<blankSpace){
			internalIban = internalIban + singleBlankSpace;
			k = k+1;
		    }
			setHeader(map, "PLCN_internalIban", internalIban);
		 }
	 }	 
}

function creditorIdPacs003(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	 var creditorIdPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DrctDbtTx/CdtrSchmeId/Id/PrvtId/Othr/Id';
	 var creditorId = getValueFromPath(Document, creditorIdPath);
	 var creditorIdLength
	 if(creditorId) {
	  creditorIdLength = creditorId.length();
	}
	 blankSpace = 35 - creditorIdLength;
	 blankSpace = blankSpace + 1;
	 while(k<blankSpace){
		 creditorId = creditorId + singleBlankSpace;
		 k = k+1;
	 }
	 setHeader(map, "PLCN_creditorId", creditorId);
	
}

function mandateDateSntd(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);  
	 
	 var mandateDatePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DrctDbtTx/MndtRltdInf/DtOfSgntr';
     var mandateDate = getValueFromPath(Document, mandateDatePath);
	 if(mandateDate){
		mandateDate = replaceAllPattern(mandateDate, "-", ""); 
	 }
	 setHeader(map, "PLCN_mandateDate", mandateDate);
	
}

function mandateNumberSntd(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	 var mandateNumberPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DrctDbtTx/MndtRltdInf/MndtId';
	 var mandateNumber = getValueFromPath(Document, mandateNumberPath);
	 var mandateNumberLength;
	 if(mandateNumber) {
	   mandateNumberLength = mandateNumber.length();
	 } 
	 blankSpace = 35 - mandateNumberLength;
	 blankSpace = blankSpace + 1;
	 while(k<blankSpace){
		 mandateNumber = mandateNumber + singleBlankSpace;
		 k = k+1;
	 }
	 setHeader(map, "PLCN_mandateNumber", mandateNumber);
}

function use2Pacs003(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var use2Id
	 var use2IdLength;
	 var k;
	 var blankSpace;
	 var singleBlankSpace;
	 k=1;
	 blankSpace = 0;
	 singleBlankSpace = " ";
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 use2Id = getHeader(map,"PLCN_use2");
     logger.info("use2Pacs003: use2Id = " + use2Id);
	 var use2ValuePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/RmtInf/Ustrd';
	 var use2Value = getValueFromPath(Document, use2ValuePath);
	 logger.info("use2Pacs003: use2Value = " + use2Value);
	 if(use2Id){
		 setHeader(map, "PLCN_use2", use2Id);
		 logger.info("use2Pacs003: use2Id inside if loop= ");
		 return;
	 }
	 use2Id = use2Value;
	 if(use2Id) {
	 	use2IdLength = use2Id.length();
		logger.info("use2Pacs003: use2IdLength = " + use2IdLength);
	}
	 blankSpace = 140 - use2IdLength;
	 blankSpace = blankSpace + 1;
	 
	 while(k<blankSpace){
		use2Id = use2Id + singleBlankSpace;
		k = k+1;
	 }
	 logger.info("use2Pacs003: use2Id = " + use2Id);
	 setHeader(map, "PLCN_use2", use2Id);
	
}

//PACS004 ENHANCER
function pacs004Enhancer(exchange){
    var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 logger.info("in pacs004Enhancer");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 
	 amountPacs004(exchange);
     valueDatePacs004(exchange);
	 
	 var numberOfRecordsPath = '/Document/PmtRtr/GrpHdr/NbOfTxs';
     var numberOfRecords = getValueFromPath(Document, numberOfRecordsPath);
	 setHeader(map, "PLCN_numberOfRecords", numberOfRecords);
     logger.info("pacs004Enhancer:numberOfRecords = " + numberOfRecords);
    
	 endToEndIdPacs004(exchange);
	 initialRegistrationRefPacs004(exchange);
	 referenceIdPPacs004(exchange);
	 valueDate3Pacs004(exchange);
	 externalBicPacs004(exchange);
	 externalBicMapPacs004(exchange);
	 externalIbanPacs004(exchange);
	 internalBicPacs004(exchange);
	 internalBicMapPacs004(exchange);
	 internalIbanPacs004(exchange);
	 valueDate5Pacs004(exchange);
	 
	 var executionSequencePath = '/Document/PmtRtr/TxInf/OrgnlTxRef/PmtTpInf/SeqTp';
     var executionSequence = getValueFromPath(Document, executionSequencePath);
	 setHeader(map, "PLCN_executionSequence", executionSequence);
     logger.info("pacs004Enhancer:executionSequence = " + executionSequence);
 
     var sddSchemePath = '/Document/PmtRtr/TxInf/OrgnlTxRef/PmtTpInf/LclInstrm/Cd';
     var sddScheme = getValueFromPath(Document, sddSchemePath);
	 setHeader(map, "PLCN_sddScheme", sddScheme);
     logger.info("pacs004Enhancer:sddScheme = " + sddScheme);
	 
	 var recipientAddressPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/PstlAdr/StrtNm';
     var recipientAddress =  getValueFromPath(Document, recipientAddressPath);
	 setHeader(map, "PLCN_recipientAddress", recipientAddress);
     logger.info("pacs004Enhancer:recipientAddress = " + recipientAddress); 
	 
	 var recipientCountryCodePath = '/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/PstlAdr/Ctry';
     var recipientCountryCode =  getValueFromPath(Document, recipientCountryCodePath);
	 setHeader(map, "PLCN_recipientCountryCode", recipientCountryCode);
     logger.info("pacs004Enhancer:recipientCountryCode = " + recipientCountryCode);
	 
	 var recipientNamePath = '/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/Nm';
     var recipientName =  getValueFromPath(Document, recipientNamePath);
	 setHeader(map, "PLCN_recipientName", recipientName);
     logger.info("pacs004Enhancer:recipientName = " + recipientName); 
	 
	 var recipientPlacePath = '/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/PstlAdr/TwnNm';
     var recipientPlace =  getValueFromPath(Document, recipientPlacePath);
	 setHeader(map, "PLCN_recipientPlace", recipientPlace);
     logger.info("pacs004Enhancer:recipientPlace = " + recipientPlace); 
	  
	 var recipientPostcodePath = '/Document/PmtRtr/TxInf/OrgnlTxRef/Cdtr/PstlAdr/PstCd';
     var recipientPostcode =  getValueFromPath(Document, recipientPostcodePath);
	 setHeader(map, "PLCN_recipientPostcode", recipientPostcode);
     logger.info("pacs004Enhancer:recipientPostcode = " + recipientPostcode);
	 
	 use2Pacs004(exchange);
	 mandateDatePacs004(exchange);
	 mandateNumberPacs004(exchange);
	 
	 var creditorIdPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrSchmeId/Id/OrgId/Othr/Id';
	 var creditorId = getValueFromPath(Document, creditorIdPath);
	 setHeader(map, "PLCN_creditorId", creditorId);
     logger.info("pacs004Enhancer:creditorId = " + creditorId);
	 
	 creditorIdPacs004(exchange);
}

function amountPacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 logger.info("in pacs004Enhancer.amountPacs004");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);  
	 var amountPath = '/Document/PmtRtr/GrpHdr/TtlRtrdIntrBkSttlmAmt';
     var amount = getValueFromPath(Document, amountPath);
	 amount = amountConversionRule (exchange,amount , 16);
	 logger.info("pacs004Enhancer:amountPacs004 = " + amount);
     setHeader(map, "PLCN_amountTrnCurr", amount);	 
}

function valueDatePacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);  
	 logger.info("in pacs004Enhancer.valueDatePacs004");
	 var valueDatePath = '/Document/PmtRtr/GrpHdr/IntrBkSttlmDt';
     var valueDate = getValueFromPath(Document, valueDatePath);
	 if(valueDate){
		valueDate = replaceAllPattern(valueDate, "-", ""); 
	 }
	 logger.info("pacs004Enhancer:valueDatePacs004 = " + valueDate);
	 setHeader(map, "PLCN_valueDate", valueDate);	 
}

function endToEndIdPacs004(exchange){
	var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 logger.info("in pacs004Enhancer.endToEndIdPacs004");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 var endToEndIdPath = '/Document/PmtRtr/TxInf/OrgnlEndToEndId';
     var endToEndId = getValueFromPath(Document, endToEndIdPath);
	 
	 endToEndId = " ";
	 if(endToEndId) {
	 	endToEndIdLength = endToEndId.length();
	}
	 blankSpace = 35 - endToEndIdLength;
	 blankSpace = blankSpace + 1;
	 while(k<blankSpace){
			endToEndId = endToEndId + singleBlankSpace;
			 k = k+1; 	
	  }
	   logger.info("pacs004Enhancer:endToEndIdPacs004 = " + endToEndId);
      setHeader(map, "PLCN_endToEndId", endToEndId);
}

function initialRegistrationRefPacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 logger.info("in pacs004Enhancer.initialRegistrationRefPacs004");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	 var initialRegistrationRefPath = '/Document/PmtRtr/TxInf/RtrId';
	 var initialRegistrationRef = getValueFromPath(Document, initialRegistrationRefPath);
	 var initialRegistrationRefLength;
	 if(initialRegistrationRef) {
	  initialRegistrationRefLength = initialRegistrationRef.length();
	}
	 blankSpace = 35 - initialRegistrationRefLength;
	 blankSpace = blankSpace + 1;
	 while(k<blankSpace){
		 initialRegistrationRef = initialRegistrationRef + " ";
		 k = k+1;
	 }
	  logger.info("pacs004Enhancer:initialRegistrationRefPacs004 = " + initialRegistrationRef);
	 setHeader(map, "PLCN_initialRegistrationRef", initialRegistrationRef);
}

function referenceIdPPacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 logger.info("in pacs004Enhancer.referenceIdPPacs004");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	 var referenceIdPath = '/Document/PmtRtr/TxInf/OrgnlTxId';
	 var referenceId = getValueFromPath(Document, referenceIdPath);
	 if(referenceId) {
	  referenceIdLength = referenceId.length();
	}
	 blankSpace = 35 - referenceIdLength;
	 blankSpace = blankSpace + 1;
	 while(k<blankSpace){
		 referenceId = referenceId + singleBlankSpace;
		 k = k+1;
	 }
	  logger.info("pacs004Enhancer:referenceIdPPacs004 = " + referenceId);
	 setHeader(map, "PLCN_referenceId", referenceId);
}

function valueDate3Pacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);  
	 logger.info("in pacs004Enhancer.valueDate3Pacs004");
	 
	 var valueDate3Path = '/Document/PmtRtr/GrpHdr/IntrBkSttlmDt';
     var valueDate3 = getValueFromPath(Document, valueDate3Path);
	 if(valueDate3){
		valueDate3 = replaceAllPattern(valueDate3, "-", ""); 
	 }
	  logger.info("pacs004Enhancer:valueDate3Pacs004 = " + valueDate3);
	 setHeader(map, "PLCN_valueDate3", valueDate3);
}

function externalBicPacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var debtorBicLength;
	 var creditorBicLength;
	 var msgDirection;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 logger.info("in pacs004Enhancer.externalBicPacs004");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("sapDoctype: msgDirection = " + msgDirection);
	 
	 var orgnlmsgnmidPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
     var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
     logger.info("externalBicPacs004:orgnlmsgnmid = " + orgnlmsgnmid);
	 
	 if(!orgnlmsgnmid){
		var orgnlmsgnmidPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
        var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
        logger.info("externalBicPacs004:orgnlmsgnmid = " + orgnlmsgnmid); 
	 }
	 
	 var debtorPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAgt/FinInstnId/BICFI';
	 var debtorBic = getValueFromPath(Document, debtorPath);
	 var creditorPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/BICFI';
     var creditorBic = getValueFromPath(Document, creditorPath);
	 
	 if(debtorBic || creditorBic){
	 	if(creditorBic) {
		 	creditorBicLength = creditorBic.length();
		}
		if(debtorBic){
		 	debtorBicLength = debtorBic.length();
		}
		 if(creditorBicLength < 11){
			 creditorBic = creditorBic + "   ";
		 }
		 if(debtorBicLength < 11){
			 debtorBic = debtorBic + "   ";
		 }	 
	 }
	  logger.info("pacs004Enhancer:externalBicPacs004:creditorBic = " + creditorBic);
	  logger.info("pacs004Enhancer:externalBicPacs004:debtorBic = " + debtorBic);
	 if (msgDirection == 'O'){
		 if(orgnlmsgnmid == 'pacs.008.001.08'){
			 setHeader(map, "PLCN_externalBic", creditorBic); 
		 }
		 if(orgnlmsgnmid == 'pacs.003.001.08'){
			 setHeader(map, "PLCN_externalBic", debtorBic); 
		 }
	 }
	 if (msgDirection == 'I'){
		 if(orgnlmsgnmid == 'pacs.008.001.08'){
			 setHeader(map, "PLCN_externalBic", debtorBic); 
		 }
		 if(orgnlmsgnmid == 'pacs.003.001.08'){
			 setHeader(map, "PLCN_externalBic", creditorBic); 
		 }
	 }
	 
}

function externalBicMapPacs004(exchange){
	var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var debtorBicLength;
	 var creditorBicLength;
	 var msgDirection;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 logger.info("in pacs004Enhancer.externalBicMapPacs004");
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("externalBicMapPacs004: msgDirection = " + msgDirection);
	 
	 var orgnlmsgnmidPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
     var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
     logger.info("externalBicMapPacs004:orgnlmsgnmid = " + orgnlmsgnmid);
	 
	 if(!orgnlmsgnmid){
		 var orgnlmsgnmidPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
		 var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
		 logger.info("externalBicMapPacs004:orgnlmsgnmid = " + orgnlmsgnmid);
	 }
	 
	 var debtorPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAgt/FinInstnId/BICFI';
	 var debtorBic = getValueFromPath(Document, debtorPath);
	 var creditorPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/BICFI';
     var creditorBic = getValueFromPath(Document, creditorPath);
	 
	 if(debtorBic || creditorBic){
	 	if(creditorBic) {
		 	creditorBicLength = creditorBic.length();
		}
		if(debtorBic) {
		 	debtorBicLength = debtorBic.length();
		}
		 if(creditorBicLength < 11){
			 creditorBic = creditorBic + "   ";
		 }
		 if(debtorBicLength < 11){
			 debtorBic = debtorBic + "   ";
		 }	 
	 }
	 logger.info("pacs004Enhancer:externalBicMapPacs004:creditorBic = " + creditorBic);
	 logger.info("pacs004Enhancer:externalBicMapPacs004:debtorBic = " + debtorBic);
	 if (msgDirection == 'O'){
		 if(orgnlmsgnmid == 'pacs.008.001.08'){
			 setHeader(map, "PLCN_externalBicMap", creditorBic); 
		 }
		 if(orgnlmsgnmid == 'pacs.003.001.08'){
			 setHeader(map, "PLCN_externalBicMap", debtorBic); 
		 }
	 }
	 if (msgDirection == 'I'){
		 if(orgnlmsgnmid == 'pacs.008.001.08'){
			 setHeader(map, "PLCN_externalBicMap", debtorBic); 
		 }
		 if(orgnlmsgnmid == 'pacs.003.001.08'){
			 setHeader(map, "PLCN_externalBicMap", creditorBic); 
		 }
	 }	 
  	 logger.info("externalBicMapPacs004:externalBicMap:debtorBic = " + debtorBic);
	 logger.info("externalBicMapPacs004:externalBicMap:creditorBic = " + creditorBic);
}

function externalIbanPacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 logger.info("in pacs004Enhancer.externalIbanPacs004");
	 
	 var orgnlmsgnmidPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
     var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
     logger.info("externalIbanPacs004:orgnlmsgnmid = " + orgnlmsgnmid);
	 
	 if(!orgnlmsgnmid){
		 var orgnlmsgnmidPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
		 var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
		 logger.info("externalIbanPacs004:orgnlmsgnmid = " + orgnlmsgnmid);
	 }
	
	 var debtorPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN';
	 var debtorIban = getValueFromPath(Document, debtorPath);
	 var creditorPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN';
     var creditorIban = getValueFromPath(Document, creditorPath);
	 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("externalIbanPacs004: msgDirection = " + msgDirection);
	 
 	 var externalIbanLength;

	 if(msgDirection == 'O'){
		if(orgnlmsgnmid == 'pacs.008.001.08'){
			var externalIban =  creditorIban;
			if(externalIban) {
			 externalIbanLength = externalIban.length();
			}
			blankSpace = 34 - externalIbanLength;
		    blankSpace = blankSpace + 1;
			while(k<blankSpace){
			externalIban = externalIban + singleBlankSpace;
			k = k+1;
		    }
			setHeader(map, "PLCN_externalIban", externalIban);
			logger.info("pacs004Enhancer:externalIbanPacs004 = " + externalIban);
		}
        if(orgnlmsgnmid == 'pacs.003.001.08'){
			var externalIban =  debtorIban;
			if(externalIban){
				externalIbanLength = externalIban.length();
			}
			blankSpace = 34 - externalIbanLength;
		    blankSpace = blankSpace + 1;
			while(k<blankSpace){
			externalIban = externalIban + singleBlankSpace;
			k = k+1;
		    }
			setHeader(map, "PLCN_externalIban", externalIban);
			logger.info("pacs004Enhancer:externalIbanPacs004 = " + externalIban);
		}		
	 }
     if(msgDirection == 'I'){
		if(orgnlmsgnmid == 'pacs.008.001.08'){
			var externalIban =  debtorIban;
			if(externalIban) {
				externalIbanLength = externalIban.length();
			}
			blankSpace = 34 - externalIbanLength;
		    blankSpace = blankSpace + 1;
			while(k<blankSpace){
			externalIban = externalIban + singleBlankSpace;
			k = k+1;
		    }
			setHeader(map, "PLCN_externalIban", externalIban);
		}
        if(orgnlmsgnmid == 'pacs.003.001.08'){
			var externalIban =  creditorIban;
			if(externalIban) {
		 	   externalIbanLength = externalIban.length();
			}
			blankSpace = 34 - externalIbanLength;
		    blankSpace = blankSpace + 1;
			while(k<blankSpace){
			externalIban = externalIban + singleBlankSpace;
			k = k+1;
		    }
			setHeader(map, "PLCN_externalIban", externalIban);
		}
		logger.info("pacs004Enhancer:externalIbanPacs004 = " + externalIban);
	 }	 
}

function internalBicPacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var debtorBicLength;
	 var creditorBicLength;
	 var msgDirection;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("internalBicPacs004: msgDirection = " + msgDirection);
	 
	 var orgnlmsgnmidPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
     var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
     logger.info("internalBicPacs004:orgnlmsgnmid = " + orgnlmsgnmid);
	 
	 if(!orgnlmsgnmid){
		 var orgnlmsgnmidPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
		 var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
		 logger.info("internalBicPacs004:orgnlmsgnmid = " + orgnlmsgnmid);
	 }
	 
	 var debtorPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAgt/FinInstnId/BICFI';
	 var debtorBic = getValueFromPath(Document, debtorPath);
	 var creditorPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/BICFI';
     var creditorBic = getValueFromPath(Document, creditorPath);
	 
	 if(debtorBic || creditorBic){
	 	if(creditorBic) {
		 	creditorBicLength = creditorBic.length();
		}
		if(debtorBic) {
		 	debtorBicLength = debtorBic.length();
		}
		 if(creditorBicLength < 11){
			 creditorBic = creditorBic + "   ";
		 }
		 if(debtorBicLength < 11){
			 debtorBic = debtorBic + "   ";
		 }	 
	 }
	 if (msgDirection == 'O'){
		 if(orgnlmsgnmid == 'pacs.008.001.08'){
			 setHeader(map, "PLCN_internalBic", debtorBic); 
		 }
		 if(orgnlmsgnmid == 'pacs.003.001.08'){
			 setHeader(map, "PLCN_internalBic", creditorBic); 
		 }
	 }
	 if (msgDirection == 'I'){
		 if(orgnlmsgnmid == 'pacs.008.001.08'){
			 setHeader(map, "PLCN_internalBic", creditorBic); 
		 }
		 if(orgnlmsgnmid == 'pacs.003.001.08'){
			 setHeader(map, "PLCN_internalBic", debtorBic); 
		 }
	 }
	  logger.info("internalBicPacs004:internalBicMap:debtorBic = " + debtorBic);
	  logger.info("internalBicPacs004:internalBicMap:creditorBic = " + creditorBic);	 
}

function internalBicMapPacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var debtorBicLength;
	 var creditorBicLength;
	 var msgDirection;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("internalBicMapPacs004: msgDirection = " + msgDirection);
	 
	 var orgnlmsgnmidPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
     var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
     logger.info("internalBicMapPacs004:orgnlmsgnmid = " + orgnlmsgnmid);
	 
	 if(!orgnlmsgnmid){
		 var orgnlmsgnmidPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
		 var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
		 logger.info("internalBicMapPacs004:orgnlmsgnmid = " + orgnlmsgnmid);
	 }
	 
	 var debtorPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAgt/FinInstnId/BICFI';
	 var debtorBic = getValueFromPath(Document, debtorPath);
	 var creditorPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/BICFI';
     var creditorBic = getValueFromPath(Document, creditorPath);
	 
	 if(debtorBic || creditorBic){
	 	if(creditorBic) {
		 	creditorBicLength = creditorBic.length();
		}
		if(debtorBic) {
		 	debtorBicLength = debtorBic.length();
		}
		 if(creditorBicLength < 11){
			 creditorBic = creditorBic + "   ";
		 }
		 if(debtorBicLength < 11){
			 debtorBic = debtorBic + "   ";
		 }	 
	 }
	 if (msgDirection == 'O'){
		 if(orgnlmsgnmid == 'pacs.008.001.08'){
			 setHeader(map, "PLCN_internalBicMap", debtorBic); 
		 }
		 if(orgnlmsgnmid == 'pacs.003.001.08'){
			 setHeader(map, "PLCN_internalBicMap", creditorBic); 
		 }
	 }
	 if (msgDirection == 'I'){
		 if(orgnlmsgnmid == 'pacs.008.001.08'){
			 setHeader(map, "PLCN_internalBicMap", creditorBic); 
		 }
		 if(orgnlmsgnmid == 'pacs.003.001.08'){
			 setHeader(map, "PLCN_internalBicMap", debtorBic); 
		 }
	 }
	  logger.info("internalBicMapPacs004:internalBicMap:debtorBic = " + debtorBic);
	  logger.info("internalBicMapPacs004:internalBicMap:creditorBic = " + creditorBic);
	 
}

function internalIbanPacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 var orgnlmsgnmidPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
     var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
     logger.info("internalIbanPacs004:orgnlmsgnmid = " + orgnlmsgnmid);
	 
	 if(!orgnlmsgnmid){
		 var orgnlmsgnmidPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
		 var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
		 logger.info("internalIbanPacs004:orgnlmsgnmid = " + orgnlmsgnmid);
	 }
	
	 var debtorPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN';
	 var debtorIban = getValueFromPath(Document, debtorPath);
	 var creditorPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN';
     var creditorIban = getValueFromPath(Document, creditorPath);
	 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("sapDoctype: msgDirection = " + msgDirection);
	 
 	 var internalIbanLength;

	 if(msgDirection == 'O'){
		if(orgnlmsgnmid == 'pacs.008.001.08'){
			var internalIban =  debtorIban;
			if(internalIban) {
				internalIbanLength = internalIban.length();
			}
			blankSpace = 34 - internalIbanLength;
			blankSpace = blankSpace + 1;
			while(k<blankSpace){
				internalIban = internalIban + singleBlankSpace;
				k = k+1;
			}
			setHeader(map, "PLCN_internalIban", internalIban);
		}
        if(orgnlmsgnmid == 'pacs.003.001.08'){
			var internalIban =  creditorIban;
			if(internalIban) {
			internalIbanLength = internalIban.length();
			}
			blankSpace = 34 - internalIbanLength;
			blankSpace = blankSpace + 1;
			while(k<blankSpace){
				internalIban = internalIban + singleBlankSpace;
				k = k+1;
			}
			setHeader(map, "PLCN_internalIban", internalIban);
		}		
	 }
     if(msgDirection == 'I'){
		if(orgnlmsgnmid == 'pacs.008.001.08'){
			var internalIban =  creditorIban;
			if(internalIban) {
			 internalIbanLength = internalIban.length();
			}
			blankSpace = 34 - internalIbanLength;
			blankSpace = blankSpace + 1;
			while(k<blankSpace){
				internalIban = internalIban + singleBlankSpace;
				k = k+1;
			}
			setHeader(map, "PLCN_internalIban", internalIban);
		}
        if(orgnlmsgnmid == 'pacs.003.001.08'){
			var internalIban =  debtorIban;
		    if(internalIban) {
		     internalIbanLength = internalIban.length();
			}
			blankSpace = 34 - internalIbanLength;
			blankSpace = blankSpace + 1;
			while(k<blankSpace){
				internalIban = internalIban + singleBlankSpace;
				k = k+1;
			}
			setHeader(map, "PLCN_internalIban", internalIban);
		}		
	 }	
	 logger.info("internalIbanPacs004:internalIban = " + internalIban);
}

function valueDate5Pacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);  
	 
	 var valueDate5Path = '/Document/PmtRtr/TxInf/OrgnlTxRef/IntrBkSttlmDt';
     var valueDate5 = getValueFromPath(Document, valueDate5Path);
	 if(valueDate5){
		valueDate5 = replaceAllPattern(valueDate5, "-", ""); 
	 }
	 logger.info("valueDate5Pacs004:valueDate5 = " + valueDate5);
	 setHeader(map, "PLCN_valueDate5", valueDate5);	
}

function use2Pacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var use2Id
	 var use2IdLength;
	 var k;
	 var blankSpace;
	 var singleBlankSpace;
	 var use2;
	 k=1;
	 singleBlankSpace = " ";
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 var orgnlmsgnmidPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
     var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
     logger.info("use2Pacs004:orgnlmsgnmid = " + orgnlmsgnmid);
	 
	 if(!orgnlmsgnmid){
		 var orgnlmsgnmidPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
		 var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
		 logger.info("use2Pacs004:orgnlmsgnmid = " + orgnlmsgnmid);
	 }
	 
	 use2Id = getHeader(map,"PLCN_use2");
     logger.info("use2Pacs004: use2Id = " + use2Id);
	 
	 var use2ValuePath = '/Document/PmtRtr/TxInf/OrgnlTxRef/RmtInf/Ustrd';
	 var use2Value = getValueFromPath(Document, use2ValuePath);
	 logger.info("use2Pacs004:use2Value = " + use2Value);
	 /* if(orgnlmsgnmid == 'pacs.003.001.08'){
		 use2 = "                                                                                                                                            ";
		 setHeader(map, "PLCN_use2", use2);
		 return;
	 } */
	 use2Id = use2Value;
	 if(use2Id) {
	 	use2IdLength = use2Id.length();
	}
	logger.info("use2Pacs004:use2IdLength = " + use2IdLength);
	 blankSpace = 140 - use2IdLength;
	 blankSpace = blankSpace + 1;
	 logger.info("use2Pacs004:blankSpace = " + blankSpace);
	 while(k<blankSpace){
		use2Id = use2Id + " ";
		k = k+1;
	 }
	  logger.info("use2Pacs004:use2Id = " + use2Id);
	 setHeader(map, "PLCN_use2", use2Id);
	
}

function mandateDatePacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
		 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);  
	 
	 var mandateDatePath = '/Document/PmtRtr/TxInf/OrgnlTxRef/MndtRltdInf/DtOfSgntr';
     var mandateDate = getValueFromPath(Document, mandateDatePath);
	 if(mandateDate){
		mandateDate = replaceAllPattern(mandateDate, "-", ""); 
	 }
	  logger.info("mandateDatePacs004:mandateDate = " + mandateDate);
	 setHeader(map, "PLCN_mandateDate", mandateDate);
	
}

function mandateNumberPacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	 var mandateNumberPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/MndtRltdInf/MndtId';
	 var mandateNumber = getValueFromPath(Document, mandateNumberPath);
	 var mandateNumberLength;
	 if(mandateNumber) {
	 	mandateNumberLength = mandateNumber.length();
	 }
	 blankSpace = 35 - mandateNumberLength;
	 blankSpace = blankSpace + 1;
	 while(k<blankSpace){
		 mandateNumber = mandateNumber + singleBlankSpace;
		 k = k+1;
	 }
	  logger.info("mandateNumberPacs004:mandateNumber = " + mandateNumber);
	 setHeader(map, "PLCN_mandateNumber", mandateNumber);
}

function creditorIdPacs004(exchange){
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 var msgDirection;
	 var k;
	 var blankSpace;
	 var endToEndIdLength;
	 var singleBlankSpace;
	 k=1;
	 singleBlankSpace = " ";
	 	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	 var creditorIdPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrSchmeId/Id/PrvtId/Othr/Id';
	 var creditorId = getValueFromPath(Document, creditorIdPath);
	 var creditorIdLength;
	 if(creditorId) {
	  creditorIdLength = creditorId.length();
	}
	 blankSpace = 35 - creditorIdLength;
	 blankSpace = blankSpace + 1;
	 while(k<blankSpace){
		 creditorId = creditorId + singleBlankSpace;
		 k = k+1;
	 }
	  logger.info("valueDate5Pacs004:creditorIdPacs004 = " + creditorId);
	 setHeader(map, "PLCN_creditorId", creditorId);	
}

function wrapperRuleMessageSntd(exchange){
	var messageclasstype;
	var msgtype;
	var msgDirection;
	var dbtrIban;
	var cdtrIban;
	var dbtrBic;
	var intBranchCd;
	var extBranchCd;
	var nostroAccountNumber;
	var internalBic;
	var transactiontype;
	var transactiontype2;
	var custom37;
	var custom37_2;
	var settlementMethod;
	var processPath;
	var processLevel;
	var institutionid;
	var receiver;
	var receiver2;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	institutionid = getHeader(map, "PLCN_institutionId");
	if(institutionid) {
		key  = institutionid.concat(".PROCESSING_LEVEL.PRODUCTS");
	}
	logger.info("wrapperRuleMessageSntd: Key = " + key);
	var processLevel = customMemTblGetTblValue(map, "INST_PARAM", key);
	logger.info("wrapperRuleMessageSntd: process Level = " + processLevel);
	
	msgtype = getHeader(map, "PLCN_msgtype");
	logger.info("wrapperRuleMessageSntd: msgtype = " + msgtype);
	messageclasstype = getHeader(map, "PLCN_messageclasstype");
	logger.info("wrapperRuleMessageSntd: messageclasstype = " + messageclasstype);
	msgDirection = getHeader(map, "PLCN_msgDirection");
	logger.info("wrapperRuleMessageSntd: msgDirection = " + msgDirection);
	dbtrIban = getHeader(map, "PLCN_msgTransDebitor"); //msg_trans_creditor, msg_trans_debitor
	logger.info("wrapperRuleMessageSntd: dbtrIban = " + dbtrIban);
	cdtrIban = getHeader(map, "PLCN_msgTransCreditor");
	logger.info("wrapperRuleMessageSntd: cdtrIban = " + cdtrIban);
	dbtrBic = getHeader(map, "PLCN_dbtrBic");
	logger.info("wrapperRuleMessageSntd: dbtrBic = " + dbtrBic);
	
	if(dbtrIban) {
		intBranchCd = dbtrIban.substr(4,5);
		logger.info("wrapperRuleMessageSntd: intBranchCd = " + intBranchCd);
	}
	if(cdtrIban) {
		extBranchCd = cdtrIban.substr(4,5);
		logger.info("wrapperRuleMessageSntd: extBranchCd = " + extBranchCd);
	}
	setHeader(map, "PLCN_settlementMethod", "CLRG");
	routingFunctionality(exchange);
	custom37_2 = getHeader(map, "PLCN_custom37_2");
	receiver2 = getHeader(map, "PLCN_receiver2");
	setHeader(map, "PLCN_processId", "NONE");
	routeCalculateHashcodeSntd(exchange);
	
	if(msgDirection == "I"){
		if(intBranchCd == "19810" && extBranchCd == "19810"){
			logger.info("wrapperRuleMessageSntd: inside internal booking loop ");
			obInternalBookingsPacs008Sntd(exchange);
			//rule-dscn-enhancers(exchange);   //Need to check the functionality;
			if(isPatternPresent (msgtype, "pacs.003")){
				setHeader(map, "PLCN_txnGrp", "DD");
			}
			return 0;
		}
	}	
	if(isPatternPresent (msgtype, "pacs.008")){
		setHeader(map, "PLCN_txnGrp", "CT");
		if(msgDirection == "O"){
			//(DERIVE_SERVICE_CONFIGURED_COMMON)
			sepaUpdateRuleSntd(exchange);
			//rule-dscn-enhancers(exchange);   //Need to check the functionality;
			setHeader(map, "PLCN_settlementMethod", "CLRG");
			return 0;
		}else{
			if(msgDirection == "I"){
				nostroAccountNumber = getHeader(map, "PLCN_nostroAccountNumber");
				if(nostroAccountNumber){
					//(DERIVE_SERVICE_CONFIGURED_COMMON)
					correctionCustom24(exchange);
					sepaUpdateRuleSntd(exchange);
					//rule-dscn-enhancers(exchange);   //Need to check the functionality;
					custom37 = getHeader(map, "PLCN_custom37");
					setHeader(map, "PLCN_settlementMethod", "CLRG");
					if(!custom37){
						setHeader(map, "PLCN_custom37", "custom37_2");
					}
					return 0;	
				}else{
					setHeader(map, "PLCN_flowStatus", "69");
					return 0;
					
				}
			}
		}
	}
	if(isPatternPresent(msgtype, "pacs.003")){
		setHeader(map, "PLCN_txnGrp", "DD");
		transactiontype = getHeader(map, "PLCN_txntype");
		if(!transactiontype){
			transactiontype = getHeader(map, "PLCN_transactiontype");
			setHeader(map, "PLCN_txntype", transactiontype);
		}
		transactiontype2 = getHeader(map, "PLCN_txntype");
		cdtrIban = getHeader(map, "PLCN_internalIban");
		if(msgDirection == "O"){
			//(DERIVE_SERVICE_CONFIGURED_COMMON)
			correctionCustom24(exchange);
			sepaUpdateRuleSntd(exchange);
			//rule-dscn-enhancers(exchange);   //Need to check the functionality;
			custom37 = getHeader(map, "PLCN_custom37");
			setHeader(map, "PLCN_settlementMethod", "CLRG");
			return 0;
		}else{
			if(msgDirection == "I"){
				nostroAccountNumber = getHeader(map, "PLCN_nostroAccountNumber");
				if(nostroAccountNumber){
					if(!transactiontype){
						setHeader(map, "PLCN_txntype", "C");
					}
					//(DERIVE_SERVICE_CONFIGURED_COMMON)
					correctionCustom24(exchange);
					sepaUpdateRuleSntd(exchange);
					//rule-dscn-enhancers(exchange);   //Need to check the functionality;
					custom37 = getHeader(map, "PLCN_custom37");
					setHeader(map, "PLCN_settlementMethod", "CLRG");
					if(!custom37){
						setHeader(map, "PLCN_custom37", "custom37_2");
					}
					transactiontype = getHeader(map, "PLCN_txntype");
					if(!transactiontype){
						setHeader(map, "PLCN_txntype", transactiontype_2);
					}
					if(!transactiontype2){
						setHeader(map, "PLCN_txntype", "C");
					}
					return 0;	
				}else{
					setHeader(map, "PLCN_flowStatus", "69");
					return 0;					
				}
			}
		}
	}
	if(isPatternPresent(msgtype,"pacs.004")){
		if(msgDirection == "O"){
			//(DERIVE_SERVICE_CONFIGURED_COMMON)
			sepaUpdateRuleSntd(exchange);
			//rule-dscn-enhancers(exchange);   //Need to check the functionality;
			setHeader(map, "PLCN_settlementMethod", "CLRG");
			receiver = getHeader(map, "PLCN_receiver");
			if(!receiver){
				setHeader(map, "PLCN_receiver", "receiver2");
			}
			return 0;
		}else{
			if(msgDirection == "I"){
				//(DERIVE_SERVICE_CONFIGURED_COMMON)
				correctionCustom24(exchange);
				sepaUpdateRuleSntd(exchange);
				//rule-dscn-enhancers(exchange);   //Need to check the functionality;
				setHeader(map, "PLCN_settlementMethod", "CLRG");
				receiver = getHeader(map, "PLCN_receiver");
				if(!receiver){
					setHeader(map, "PLCN_receiver", "receiver2");
				}
				return 0;
			}
		}
	}
	if(msgtype == "camt.029.001.03"){
		if(msgDirection == "I"){
			//(DERIVE_SERVICE_CONFIGURED_COMMON)
			sepaUpdateRuleSntd(exchange);
			//rule-dscn-enhancers(exchange);   //Need to check the functionality;
			return 0;
		}
	}
	
	if(msgtype == "camt.056.001.01"){
		if(msgDirection == "O"){
			//(DERIVE_SERVICE_CONFIGURED_COMMON)
			sepaUpdateRuleSntd(exchange);
			//rule-dscn-enhancers(exchange);   //Need to check the functionality;
			return 0;
		}
	}
	
	if(msgtype == "pacs.007.001.02"){
		if(msgDirection == "O"){
			//(DERIVE_SERVICE_CONFIGURED_COMMON)
			sepaUpdateRuleSntd(exchange);
			return 0;
		}
	}
	if(msgtype == "pacs.002.001.02"){
		if(msgDirection == "O"){
			//(DERIVE_SERVICE_CONFIGURED_COMMON)
			sepaUpdateRuleSntd(exchange);
			return 0;
		}
	}
}

function routingFunctionality(exchange){
	var institutionid;
	var tenantName;
	var custom37;
	var tenant_path;
	var msgDirection;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	msgDirection = getHeader(map, "PLCN_msgDirection");
	institutionid = getHeader(map, "PLCN_institutionId");
	if(institutionid) {
		key  = institutionid.concat(".INSTITUTION_DETAILS.TENANT_NAME");
	}
	logger.info("routingFunctionality: Key = " + key);
	var tenantName = customMemTblGetTblValue(map, "INST_PARAM", key);
	logger.info("routingFunctionality: Tenant Name = " + tenantName);

	setHeader(map, "PLCN_tenantName", tenantName);
	
	//swift-backoffice-iban-check(exchange);
	receiverBicEnhancement(exchange);
	//derive_nostroacctnum_inputchannel(exchange);
	deriveGroupinginfoFile(exchange);
	//derive_202_acc_number(exchange);
	
	tenantName = getHeader(map, "PLCN_tenantName");
	logger.info("routingFunctionality: tenantName = " + tenantName);
	
	if(!tenantName){
		setHeader(map, "PLCN_tenantName", "");
	}
}

function receiverBicEnhancement(exchange){
     var institutionId;
     var msgModeIn;
	 var externalBic;
	 var sepaBicProduct;
	 var sepaBicBackoffice;
	 var sepaBicManualEntry;
	 var sepaBicProductPath;
	 var sepaBicBackofficePath;
	 var sepaBicManualEntryPath;
	 var bicProduct;
	 var bicBackoffice;
	 var bicManualEntry;
	 var msgType;
	 var msgDirection;
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 
	 institutionId = getHeader(map,"PLCN_institutionId");
	 logger.info("receiverBicEnhancement: institutionId = " + institutionId);

     msgModeIn = getHeader(map, "PLCN_msgModeIn");
	 logger.info("receiverBicEnhancement: msgModeIn = " + msgModeIn);

     msgType = getHeader(map, "PLCN_msgType");
     if(msgType) {
	 	msgType = msgType.trim();
	}
	 logger.info("receiverBicEnhancement: msgType = " + msgType);
   
     msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("receiverBicEnhancement: msgDirection = " + msgDirection);

     sepaBicProductPath = institutionId + ".DEFAULT.SEPA.BIC.PRODUCTS";
	 sepaBicProduct = customMemTblGetTblValue(map, "INST_PARAM",sepaBicProductPath);
	 logger.info("receiverBicEnhancement: sepaBicProduct = " + sepaBicProduct);

     sepaBicBackofficePath = institutionId + ".DEFAULT.SEPA.BIC.BACKOFFICE";
	 sepaBicBackoffice = customMemTblGetTblValue(map, "INST_PARAM",sepaBicBackofficePath);
	 logger.info("receiverBicEnhancement: sepaBicBackoffice = " + sepaBicBackoffice);

     sepaBicManualEntryPath = institutionId + ".DEFAULT.SEPA.BIC.MANUAL_ENTRY";
	 sepaBicManualEntry = customMemTblGetTblValue(map, "INST_PARAM",sepaBicManualEntryPath);
	 logger.info("receiverBicEnhancement: sepaBicManualEntry = " + sepaBicManualEntry);

     if(msgType == 'pacs.008.001.08' || msgType == 'pacs.002.001.10' || msgType == 'camt.056.001.08' || msgType == 'pacs.003.001.08'|| msgType == 'pacs.007.001.09' || msgType == 'pacs.004.001.09' || msgType == 'camt.029.001.09'){
	     bicProduct = sepaBicProduct;
		 logger.info("receiverBicEnhancement: bicProduct = " + bicProduct);
		 bicBackoffice = sepaBicBackoffice;
		 logger.info("receiverBicEnhancement: bicBackoffice = " + bicBackoffice);
		 bicManualEntry = sepaBicManualEntry;
	     logger.info("receiverBicEnhancement: bicManualEntry = " + bicManualEntry);
	 } 
	 if(isPatternPresent(msgDirection, 'I')){
	    if(isPatternPresent(msgModeIn, 'MANUAL')){
		    if(bicManualEntry == 'DEFAULT'){
			     setHeader(map, "PLCN_externalBic", bicProduct);
				 setHeader(map, "PLCN_receiver", bicProduct);
			}else{
			    return T;
			}
		}else{
		    if(bicBackoffice == 'DEFAULT'){
			     setHeader(map, "PLCN_externalBic", bicProduct);
				 setHeader(map, "PLCN_receiver", bicProduct);
			}else{
			    return T;
			}
		}
	 
	 }else{
	     if(bicBackoffice == 'DEFAULT'){
			     setHeader(map, "PLCN_internalBic", bicProduct);
				 setHeader(map, "PLCN_sender", bicProduct);
			}else{
			    return T;
			}
	 }
}

function deriveGroupinginfoFile(exchange){	

	var currency;
    var transactiontype;
	var msgtype;
	var groupInfo;
	var msgDirection;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	currency = getHeader(map, "PLCN_currency");
	transactiontype = getHeader(map, "PLCN_txntype");
	msgtype = getHeader(map, "PLCN_msgtype");
	msgDirection = getHeader(map, "PLCN_msgDirection");
	if(!currency){
		currency = getHeader(map, "PLCN_currencyToDb");
	}
	
	if(currency == "EUR"){
		setHeader(map, "PLCN_groupinginfoFile", "EUR");
	}else{
		setHeader(map, "PLCN_groupinginfoFile", "NON-EUR");
	}
	
	if(isPatternPresent(msgtype,"pacs.004") && msgDirection == "I"){
		groupInfo = currency + "|" + transactiontype;
		setHeader(map, "PLCN_groupinginfoFile", "groupInfo");
	} 
}

function routeCalculateHashcodeSntd(exchange){

	var message;
	var retvalue;
	var processing_stage;
	var queueid;
	var authcode1;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	//retvalue = COMP_INTL_HASHCODE(exhange, Document, GV_MSG_INPATH, GV_MSG_OUTPATH);
	
	if(!retvalue == "0"){
		queueid = "INERRMSG";
		retVal = setCommentsForTransaction("20", "8905", map);
		setHeader(map, "PLCN_queueAudit", "INERRMSG");
		setHeader(map, "PLCN_processingStage", "ERR");
		//setHeader(map, "PLCN_outputChannel", "ERROR_STREAM");
		
	}
	return 0;	
}

function obInternalBookingsPacs008Sntd(exchange) {
	
	var internalBookingFinalQueue;
	var msgModeIn;
	var processingStage;
	var commentsForBlob6;
	var dbtrIban;
	var backOffice;
	var backOffice1;
	var manualRepairQueue;
	var cdtrIban;
	var documentF009;
	var sntdCrf004Flag;
	var retVal;
	
	var inMsg = exchange.getIn();
	var	map = inMsg.getHeaders();
	
	var msgBlocks = inMsg.getHeaders().get("ACEQ_READ_MSGBLOCKS");
	
	retVal = setCommentsForTransaction("00", "6937", map);
	sntdCrf004Flag = customMemTblGetTblValue(map,"FLAG-TABLE","SNTDCRF004");
	logger.info("obInternalBookingsPacs008Sntd: sntdCrf004Flag = " + sntdCrf004Flag);

	sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	dbtrIban = getHeader(map, "PLCN_msgTransDebitor");
	cdtrIban = getHeader(map, "PLCN_msgTransCreditor");
	logger.info("obInternalBookingsPacs008Sntd: dbtrIban = " + dbtrIban);
	logger.info("obInternalBookingsPacs008Sntd: cdtrIban = " + cdtrIban);
	
	setHeader(map, "PLCN_internalBookingFlag", "N");
	internalBookingFinalQueue = customMemTblGetTblValue(map,"SANTANDER_DB_QUEUES_PACS008","internalBookingFinalQueue"); //ERRORQ
	manualRepairQueue = customMemTblGetTblValue(map,"SANTANDER_DB_QUEUES_PACS008","manualRepairQueue"); //REPRQ
	logger.info("obInternalBookingsPacs008Sntd: manualRepairQueue = " + manualRepairQueue);
	logger.info("obInternalBookingsPacs008Sntd: internalBookingFinalQueue = " + internalBookingFinalQueue);
	msgModeIn = getHeader(map, "PLCN_msgModeIn");
	logger.info("obInternalBookingsPacs008Sntd: msgModeIn = " + msgModeIn);
	documentF009 = msgBlocks.get("MSGBLOCK1");
	setHeader(map, "PLCN_documentF009", documentF009);
	logger.info("obInternalBookingsPacs008Sntd: ACEDB_MSGBLOCK1 = " + documentF009);
	if(documentF009) {
		documentF009 = documentF009.substr(0,4);
		logger.info("obInternalBookingsPacs008Sntd: documentF009 = " + documentF009);
	}	
	if(!msgModeIn){
		msgModeIn = getHeader(map, "PLCN_QM");
	}
	
	if(msgModeIn == "MANUAL" || (documentF009 == "F009" && sntdCrf004Flag == "Y" )) {
		logger.info("obInternalBookingsPacs008Sntd: manual flow loop ");
		backOffice = backoffdrvaccFromIban(exchange,dbtrIban);
		logger.info("obInternalBookingsPacs008Sntd: backOffice = " + backOffice);
		setHeader(map, "PLCN_internalBookingFlag", "Y");
    	backOffice1 = backoffdrvaccFromIban(exchange,cdtrIban);
		logger.info("obInternalBookingsPacs008Sntd: backOffice1 = " + backOffice1);
		
		if(!backOffice || !backOffice1)
		{
			retVal = setCommentsForTransaction("00", "8990", map);
			setHeader(map, "PLCN_queueAudit", manualRepairQueue);
			//setHeader(map, "PLCN_queueAudit", manualRepairQueue);
			setHeader(map, "PLCN_customCheckReq", "true");
			setHeader(map, "PLCN_MXREPRQ", "true");
			setHeader(map, "PLCN_processingStage", "REPR");
			return true;
		}
		internalbookingAccountderivation(exchange);
		sapDoctype(exchange);
		eodGroupingInfo(exchange); 
		pmtOrderXtrEnhcr1EodStatement(exchange);
		sapCpdNameGeneration(exchange);
		ruleInternalBookingEodStatementDecision(exchange, backOffice);
		ruleInternalBookingEodStatementExceptions(exchange);
		setHeader(map, "PLCN_queueAudit", "PROCDQ");
		//setHeader(map, "PLCN_queueAudit", "PROCDQ");
		setHeader(map, "PLCN_customCheckReq", "true");
		setHeader(map, "PLCN_PROCDQ", "true");
		setHeader(map, "PLCN_processingStage", "FINL");
		return true;
	}else{
		logger.info("obInternalBookingsPacs008Sntd: file flow loop ");
		setHeader(map, "PLCN_queueAudit", internalBookingFinalQueue);
		//setHeader(map, "PLCN_queueAudit", internalBookingFinalQueue);
		setHeader(map, "PLCN_customCheckReq", "true");
		setHeader(map, "PLCN_ERRORQ", "true");
		setHeader(map, "PLCN_processingStage", "ERR");
		return true;
	}
	
}

function internalbookingAccountderivation(exchange) {
	var formatLabel0;
	var formatLabel1;
	var clearingAccountPcs;
	var clearingAccountLease;
	var trimmedDbtrIban;
	var trimmedCdtrIban;
	var aggregateflag;
	var dbtrIban;
	var cdtrIban;
	var companyCode0;
	var companyCode1;
	var companycode;
	var dbtrIbanLenght;
	var cdtrIbanLenght;
	var documentF009;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var msgBlocks = inMsg.getHeaders().get("ACEQ_READ_MSGBLOCKS");
	documentF009 = msgBlocks.get("MSGBLOCK1");
	logger.info("internalbookingAccountderivation: documentF009 = " + documentF009);
	if(documentF009) {
		documentF009 = documentF009.substr(0,4);
		logger.info("internalbookingAccountderivation: documentF009 = " + documentF009);
	}
	dbtrIban = getHeader(map, "PLCN_dbtrIban");
	logger.info("internalbookingAccountderivation: dbtrIban = " + dbtrIban);
	cdtrIban = getHeader(map, "PLCN_cdtrIban");
	logger.info("internalbookingAccountderivation: cdtrIban = " + cdtrIban);
	formatLabel0 = getHeader(map, "PLCN_formatLabel");
	logger.info("internalbookingAccountderivation: FORMAT_LABEL_0 = " + formatLabel0);
	formatLabel1 = getHeader(map, "PLCN_formatLabel1");
	logger.info("internalbookingAccountderivation: formatLabel1 = " + formatLabel1);
	
	dbtrIban = cleanString(dbtrIban);
	logger.info("internalbookingAccountderivation: dbtrIban after cleanstring = " + dbtrIban);
	cdtrIban = cleanString(cdtrIban);
	logger.info("internalbookingAccountderivation: cdtrIban after cleanstring = " + cdtrIban);
	
	if(!dbtrIban){
		trimmedDbtrIban = "          ";
	}
	if(!cdtrIban){
		trimmedCdtrIban = "          ";
	}
	
	if(dbtrIban) {
		dbtrIbanLenght = dbtrIban.length();
		logger.info("internalbookingAccountderivation: dbtrIbanLenght = " + dbtrIbanLenght);
	}
	dbtrIbanLenght = dbtrIbanLenght - 10;
	dbtrIbanLenght = dbtrIbanLenght + 1;
	if(dbtrIban) {
		dbtrIban = dbtrIban.substr(dbtrIbanLenght, 10);
		logger.info("internalbookingAccountderivation: dbtrIban after substr = " + dbtrIban);
	}
	if(cdtrIban) {
		cdtrIbanLenght = cdtrIban.length();
		logger.info("internalbookingAccountderivation: cdtrIbanLenght = " + cdtrIbanLenght);
	}
	cdtrIbanLenght = cdtrIbanLenght - 10;
	cdtrIbanLenght = cdtrIbanLenght + 1;
	if(cdtrIban) {
		cdtrIban = cdtrIban.substr(cdtrIbanLenght, 10);
		logger.info("internalbookingAccountderivation: cdtrIban after substr = " + cdtrIban);
	}
	if(formatLabel1 = "F013"){
		companycode = companyCode1;
	}else{
		companycode = companyCode0;
	}
		
	if(formatLabel0 == "F012" || formatLabel1 == "F012"){
		logger.info("internalbookingAccountderivation: inside F012 and F012");
		if(documentF009 == "F009"){
			logger.info("internalbookingAccountderivation: inside F012 and F012 and F009");
			clearingAccountPcs = "550248";
		}else{
			clearingAccountPcs = "550269";
		}
	}
	
	if(formatLabel0 == "F013" || formatLabel1 == "F013"){
		clearingAccountLease = "714204";
	}
	
	if(formatLabel0 == "F012"){
		logger.info("internalbookingAccountderivation: inside F012 loop");
		if(formatLabel1 == "F013"){
			setHeader(map, "PLCN_sapDr", clearingAccountPcs);
			setHeader(map, "PLCN_sapCr", clearingAccountLease);
			aggregateflag = "IND";
			setHeader(map, "PLCN_aggregateflag", aggregateflag);
		}
		if(formatLabel1 == "F012"){
			logger.info("internalbookingAccountderivation: inside F012 and F012 loop");
			setHeader(map, "PLCN_sapDr", clearingAccountPcs);
			setHeader(map, "PLCN_sapCr", clearingAccountPcs);
			aggregateflag = "IND";
			setHeader(map, "PLCN_aggregateflag", aggregateflag);
		}
		if(formatLabel1 == "F011"){
			setHeader(map, "PLCN_sapDr", clearingAccountPcs);
			setHeader(map, "PLCN_sapCr", cdtrIban);
			aggregateflag = "IND";
			setHeader(map, "PLCN_aggregateflag", aggregateflag);
		}
	}

	if(formatLabel0 == "F011"){
		if(companyCode == "001"){
			if(formatLabel1 == "F013"){
				setHeader(map, "PLCN_sapDr", dbtrIban);
				setHeader(map, "PLCN_sapCr", clearingAccountLease);
				aggregateflag = "IND";
				setHeader(map, "PLCN_aggregateflag", aggregateflag);
			}
			if(formatLabel1 == "F012"){
				setHeader(map, "PLCN_sapDr", dbtrIban);
				setHeader(map, "PLCN_sapCr", clearingAccountPcs);
				aggregateflag = "IND";
				setHeader(map, "PLCN_aggregateflag", aggregateflag);
			}
			if(formatLabel1 == "F011"){
				setHeader(map, "PLCN_sapDr", dbtrIban);
				setHeader(map, "PLCN_sapCr", cdtrIban);
				aggregateflag = "IND";
				setHeader(map, "PLCN_aggregateflag", aggregateflag);
			}
		}
		if(companyCode == "043" ||companyCode == "044"){
			if(formatLabel1 == "F013"){
				setHeader(map, "PLCN_subSapDr", dbtrIban);
				setHeader(map, "PLCN_subSapCr", clearingAccountLease);
				aggregateflag = "IND";
				setHeader(map, "PLCN_aggregateflag", aggregateflag);
			}
		}
	}
	
	if(formatLabel0 == "F013"){
		if(companyCode == "001"){
			if(formatLabel1 == "F013"){
				setHeader(map, "PLCN_sapDr", clearingAccountLease);
				setHeader(map, "PLCN_sapCr", clearingAccountLease);
				aggregateflag = "IND";
				setHeader(map, "PLCN_aggregateflag", aggregateflag);
			}
			if(formatLabel1 == "F012"){
				setHeader(map, "PLCN_sapDr", clearingAccountLease);
				setHeader(map, "PLCN_sapCr", clearingAccountPcs);
				aggregateflag = "IND";
				setHeader(map, "PLCN_aggregateflag", aggregateflag);
			}
			if(formatLabel1 == "F011"){
				setHeader(map, "PLCN_sapDr", clearingAccountLease);
				setHeader(map, "PLCN_sapCr", cdtrIban);
				aggregateflag = "IND";
				setHeader(map, "PLCN_aggregateflag", aggregateflag);
			}
		}
		if(companyCode == "043" ||companyCode == "044"){
			if(formatLabel1 == "F013"){
				setHeader(map, "PLCN_subSapDr", clearingAccountLease);
				setHeader(map, "PLCN_subSapCr", clearingAccountLease);
				aggregateflag = "IND";
				setHeader(map, "PLCN_aggregateflag", aggregateflag);
			}
			if(formatLabel1 == "F011"){
				setHeader(map, "PLCN_subSapDr", clearingAccountLease);
				setHeader(map, "PLCN_subSapCr", cdtrIban);
				aggregateflag = "IND";
				setHeader(map, "PLCN_aggregateflag", aggregateflag);
			}
		}
	}
}

function sapDoctype(exchange){
  var sapDocType;
  var msgType;
  var txnType;
  var msgDirection; 
  var derivedProductCode;
  var internalBookingFlag;
  var inMsg;
  var map;
  var readMsgdb;
  var Document;
  
  inMsg = exchange.getIn();
  map = inMsg.getHeaders();
  readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
 
  Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
  
  msgType = getHeader(map, "PLCN_msgType");
  msgType = msgType.trim();
  logger.info("sapDoctype: msgType = " + msgType);
   
  txnType = getHeader(map,"PLCN_txnType");
  logger.info("sapDoctype: txnType = " + txnType);
  
  internalBookingFlag = getHeader(map,"PLCN_internalBookingFlag");
  logger.info("sapDoctype: internalBookingFlag = " + internalBookingFlag);

  derivedProductCode = getHeader(map,"PLCN_productCode");
  logger.info("sapDoctype: derivedProductCode = " + derivedProductCode);
  
  msgDirection = getHeader(map, "PLCN_msgDirection");
  logger.info("sapDoctype: msgDirection = " + msgDirection);
  
  if(msgType == 'pacs.008.001.08' || msgType == 'pacs.003.001.08'){
	 if(derivedProductCode == 'MANUAL_B2B_SCT_OUT'){
		if(internalBookingFlag == 'Y'){
		   sapDocType = "4L";
		   setHeader(map, "PLCN_sapDocType", sapDocType);
		}else{
		   sapDocType = "2L";
		   setHeader(map, "PLCN_sapDocType", sapDocType);
		}
	 }else{
		if(derivedProductCode == 'MANUAL_SDD_OUT'){
		   sapDocType = "EZ";
		   setHeader(map, "PLCN_sapDocType", sapDocType);
		}else{
		   sapDocType = "D1";
		   setHeader(map, "PLCN_sapDocType", sapDocType);
		}
	 }
  }
  
  if(msgType == 'pacs.004.001.09'){
	 if(msgDirection == 'O'){
		sapDocType = "D1";
		setHeader(map, "PLCN_sapDocType", sapDocType);
	 }
	 if(msgDirection == 'I'){
		if(txnType == 'D'){
		   sapDocType = "2L";
		   setHeader(map, "PLCN_sapDocType", sapDocType);
		}else{
		   if(txnType == 'C'){
			  sapDocType = "EZ";
			  setHeader(map, "PLCN_sapDocType", sapDocType);
		   }   
		}
	 }	  
  }	  
}

function pmtOrderXtrEnhcr1EodStatement(exchange) {

	var trnCodeV3;
    var bussTrnCode;
    var circleNumber;
    var use1;
	var use2;
	var customerName;
	var currency;
	var returnCodePlnTxt;
	var amountTrnCurr;
	var amountLclCurr;
	var transactionType;
	var contractNumber;
	var valueDate;
	var companyCode;
	var recipientBankCode;
	var recipientAccount;
	var internalIban;
	var internalBic;
	var externalIban;
	var externalBic;
	var endToEndId;
	var initialRegistrationRef;
	var returnCode;
	var mandateNumber;
	var mandateDate;
	var executionSequence;
	var creditorId;
	var debtorId;
	var sddScheme;
	var bussTrnCodeGroup;
	var trnCode;
	var f007Msg;
	var formatLabel;
	var nullVar;
	var postingDate;
	var f005Msg;
	var f003Msg;
	var accountingArea;
	var f001Msg;
	var recordNumber;
	var rateNumber;
	var sapAccount;
	var accountType;
	var bookingKey;
	var vatNumberPlate;
	var amountSlTax;
	var amountVat;
	var plantSubnumberOrBusinessArea;
	var pltMovTyp;
	var portfolio;
	var costCenter;
	var assignment;
	var referenceDate;
	var cpdCountryCode;
	var cpdName;
	var cpdPostcode;
	var cpdPlace;
	var cpdAddr;
	var cpdBankAccount;
	var cpdBankCode;
	var cpdIsoCtryCode;
	var cpdBankNmAddr;
	var purposeTxt;
	var referenceId;
	var purpose01;
	var backOffice;
    var channelIdSource;
	var inputChannel;
	var f007;
	//var null //commented by SP
	var f005;
	var f003;
	var f001;
	var msgtype;
	var manualRepairQueue;
	var derivedProduct;
	var institutionid;
	var internalBicMap;
    var pacs004Charges;
	var messagedirection;
	var externalBicMap;
	var internalBookingFlag;
	var formatLabel1;
	var leaseUse1;
	var queueid;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	nullVar = "";
	trnCodeV3 = customMemTblGetTblValue(map, "F007_DEFAULT_VALUES", "TRN_CODE_V3");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F007_DEFAULT_VALUES trnCodeV3= " + trnCodeV3 );
	bussTrnCode = customMemTblGetTblValue(map, "F007_DEFAULT_VALUES", "BUSS_TRN_CODE");
	circleNumber = customMemTblGetTblValue(map, "F007_DEFAULT_VALUES", "CIRCLE_NUMBER");
	use1 = customMemTblGetTblValue(map, "F007_DEFAULT_VALUES", "USE1");
	returnCodePlnTxt = customMemTblGetTblValue(map, "F007_DEFAULT_VALUES", "RETURN_CODE_PLN_TXT");
	accountingArea = customMemTblGetTblValue(map, "F007_DEFAULT_VALUES", "Accounting_Area");
	trnCodeV3 = bankOpCode(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  trnCodeV3 after rule= " + trnCodeV3 );
	setHeader(map, "PLCN_biTransCode", trnCodeV3);
	bussTrnCode = buisnessTransactionCode(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  bussTrnCode = " + bussTrnCode );
	circleNumber = circleNumberSntd(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  circleNumber = " + circleNumber );
	f007 = "F007";
	f005 = "F005";
	f003 = "F003";
	f001 = "F001";
	//null = "NULL" //commented by SP
	recordNumber = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "RECORD_NUMBER");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES recordNumber= " + recordNumber );
	rateNumber = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "RATE_NUMBER");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES rateNumber= " + rateNumber );
	accountType = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "ACCOUNTTYPE");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES accountType= " + accountType );
	bookingKey = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "BOOKING_KEY");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES bookingKey= " + bookingKey );
	vatNumberPlate = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "VAT_Number_Plate");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES vatNumberPlate= " + vatNumberPlate );
	amountSlTax = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "AMOUNT_SL_TAX");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES amountSlTax= " + amountSlTax );
	amountVat = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES" ,"AMOUNT_VAT");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES amountVat= " + amountVat );
	plantSubnumberOrBusinessArea = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES" ,"PLANT_SUBNUMBER_OR_BUSINESS_AREA");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES plantSubnumberOrBusinessArea= " + plantSubnumberOrBusinessArea );
	pltMovTyp = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES","PLT_MOV_TYP");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES pltMovTyp= " + pltMovTyp );
	portfolio = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES","PORTFOLIO");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES portfolio= " + portfolio );
	costCenter = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "COST_CENTER");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES costCenter= " + costCenter );
	assignment = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "ASSIGNMENT");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES assignment= " + assignment );
	referenceDate = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES" , "REFERENCE_DATE");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES referenceDate= " + referenceDate );
	cpdCountryCode = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "CPD_COUNTRY_CODE");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES cpdCountryCode= " + cpdCountryCode );
	cpdName = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "CPD_NAME");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES cpdName= " + cpdName );
	cpdPostcode = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "CPD_POSTCODE");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES cpdPostcode= " + cpdPostcode );
	cpdPlace = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "CPD_PLACE");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES cpdPlace= " + cpdPlace );
	cpdAddr = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES" , "CPD_ADDR");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES cpdAddr= " + cpdAddr );
	cpdBankAccount = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES",  "CPD_BANK_ACCOUNT");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES cpdBankAccount= " + cpdBankAccount );
	cpdBankCode = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES" , "CPD_BANK_CODE");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES cpdBankCode= " + cpdBankCode );
	cpdIsoCtryCode = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "CPD_ISO_CTRY_CODE");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES cpdIsoCtryCode= " + cpdIsoCtryCode );
	cpdBankNmAddr = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "CPD_BANK_NM_ADDR");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES cpdBankNmAddr= " + cpdBankNmAddr );
	purposeTxt = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES", "PURPOSE_TXT");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES purposeTxt= " + purposeTxt );
	returnCodePlnTxt = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES",  "RETURN_CODE_PLN_TXT");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES returnCodePlnTxt= " + returnCodePlnTxt );
	returnCode = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES",  "RETURN_CODE");
	debtorId = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES" , "DEBTOR_ID");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES debtorId= " + debtorId );
	queueid = getHeader(map, "PLCN_queueid");
	manualRepairQueue = customMemTblGetTblValue(map, "SANTANDER_BACKOFFICE_REPAIR_QUEUE",  "MANUAL_REPAIR_QUEUE_IB");

	//fxTransactionForEod(exchange);
	currency = blankValFunction(exchange, "PLCN_currency");
	amountTrnCurr  = blankValFunction(exchange, "PLCN_amountTrnCurr");
	transactionType  = blankValFunction(exchange, "PLCN_txntype");
	valueDate  = blankValFunction(exchange, "PLCN_valueDate");
	logger.info("pmtOrderXtrEnhcr1EodStatement: F001_DEFAULT_VALUES valueDate= " + valueDate );
	companyCode  = blankValFunction(exchange, "PLCN_companycode");
	recipientBankCode  = blankValFunction(exchange, "PLCN_recipientBankCode");
	recipientAccount  = blankValFunction(exchange, "PLCN_recipientAccount");
	internalIban  = blankValFunction(exchange, "PLCN_internalIban");
	if(!internalIban){
		internalIban = getHeader(map, "PLCN_internalIban");
	}
	logger.info("pmtOrderXtrEnhcr1EodStatement:  internalIban = " + internalIban );
	externalIban = blankValFunction(exchange, "PLCN_externalIban");
	externalBic = blankValFunction(exchange, "PLCN_externalBic");
	internalBic = blankValFunction(exchange, "PLCN_internalBic");
	endToEndId = blankValFunction(exchange, "PLCN_endToEndId");
	initialRegistrationRef = blankValFunction(exchange, "PLCN_initialRegistrationRef");
	mandateNumber = blankValFunction(exchange, "PLCN_mandateNumber");
	mandateDate = blankValFunction(exchange, "PLCN_mandateDate");
	executionSequence = blankValFunction(exchange, "PLCN_executionSequence");
	creditorId = blankValFunction(exchange, "PLCN_creditorId");
	customerName = blankValFunction(exchange, "PLCN_customerName");
	sddScheme = blankValFunction(exchange, "PLCN_sddScheme");
	bussTrnCodeGroup = blankValFunction(exchange, "PLCN_bussTrnCodeGroup");
	trnCode = blankValFunction(exchange, "PLCN_trnCode");
	use2 = blankValFunction(exchange, "PLCN_use2");
	accountType = blankValFunction(exchange, "PLCN_accountType");
	derivedProduct = getHeader(map, "PLCN_derivedProduct");
	internalBookingFlag = getHeader(map, "PLCN_internalBookingFlag");
	formatLabel  = getHeader(map, "PLCN_formatLabel");
	formatLabel01  = getHeader(map, "PLCN_formatLabel01");
	inputChannel = getHeader(map, "PLCN_inputChannel");
	institutionid  = getHeader(map, "PLCN_institutionId");
	pacs004Charges  = getHeader(map, "PLCN_pacs004Charges");
	amountLclCurr = amountTrnCurr;
	contractNumber = panCreditContractNumer(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  contractNumber = " + contractNumber );
	logger.info("pmtOrderXtrEnhcr1EodStatement: contractNumber.type = "+typeof contractNumber);
	accountingArea = companyCode;
	recipientBankCode = bankCodeFunction(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  recipientBankCode = " + recipientBankCode );
	recipientAccount = counterpartyAccountNumberFunction(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  recipientAccount = " + recipientAccount );
	internalBicMap = getHeader(map, "PLCN_internalBicMap");
	if(!internalBicMap){
		internalBicMap = customMemTblGetTblValue(map, "F007_DEFAULT_VALUES", "DEFAULT_INTERNAL_BIC");
	}
	logger.info("pmtOrderXtrEnhcr1EodStatement:  internalBicMap = " + internalBicMap );
	internalBic = internalBicMap;
	externalBicMap = getHeader(map, "PLCN_externalBicMap");
	if(!externalBicMap){
		externalBicMap = customMemTblGetTblValue(map, "F007_DEFAULT_VALUES", "DEFAULT_EXTERNAL_BIC");
	}
	externalBic = externalBicMap;
	trnCode = bussTrnCodeGroup;
	msgtype = getHeader(map, "PLCN_msgtype");
	use1 = use1Function(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  use1 = " + use1 );
	purpose = purposeFunction(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  purpose = " + purpose);
	initialRegistrationRef = ruleInitialRegistrationRefBlank(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  initialRegistrationRef = " + initialRegistrationRef );
	mandateNumber = mandateNumberSantander(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  mandateNumber = " + mandateNumber );
	mandateDate = mandateDateSantander(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  mandateDate = " + mandateDate );
	creditorId = creditorIdSntd(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  creditorId = " + creditorId );
	executionSequence = executionSequenceFunction(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  executionSequence = " + executionSequence );
	sddScheme = sddSchemeSntd(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  sddScheme = " + sddScheme );
	bussTrnCodeGroup = bussTrnCodeGroupSntd(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  bussTrnCodeGroup = " + bussTrnCodeGroup );
	trnCode = trnCodeSntd(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  trnCode = " + trnCode );
	returnCode = returnCodeSntd(exchange);
	logger.info("pmtOrderXtrEnhcr1EodStatement:  returnCode = " + returnCode );
	
	messagedirection = getHeader (map, "PLCN_msgDirection");
	if(!externalBic && (msgtype == "103"|| msgtype == "202")){
		externalBic = getHeader(map, "PLCN_externalBic");
	}
	
	if(!internalBic && (msgtype == "103" || msgtype == "202")){
		internalBic = getHeader(map, "PLCN_internalBic");
	}
	
	if(isPatternPresent(inputChannel, "IBFQ-FMSG-IN") && isPatternPresent(messagedirection, "I")){
		backOffice = customMemTblGetTblValue(map, "F_MSG_BACK_OFFICE", formatLabel);
	}
	
	postingDate = getHeader(map, "PLCN_postingDate");
	referenceId = getHeader(map, "PLCN_referenceId");
	purpose01 = getHeader(map, "PLCN_purpose01");
	
	if(isPatternPresent(derivedProduct, "OB-LEASE-MSG-IN") || 
	    isPatternPresent(formatLabel, "F013") ||
		isPatternPresent(formatLabel01, "F013")){
		postingDate = valueDate;
		leaseUse1 = use2;
	}
	
	if(isPatternPresent(queueid,"REPRQ")&& (!accountType) && (msgtype == "103" || msgtype == "202")){
		accountType = "KR";
	}
 
	f007Msg = trnCodeV3 + bussTrnCode + circleNumber + currency + amountTrnCurr + amountLclCurr;
	f007Msg = f007Msg + transactionType + contractNumber + valueDate + companyCode;
	f007Msg = f007Msg + purpose + recipientBankCode + recipientAccount + internalIban;
	f007Msg = f007Msg + internalBic + externalIban + externalBic + endToEndId;
	f007Msg = f007Msg + initialRegistrationRef + returnCode + returnCodePlnTxt + mandateNumber;
	f007Msg = f007Msg + mandateDate + executionSequence + creditorId + debtorId;
	logger.info("pmtOrderXtrEnhcr1EodStatement: till debtorId f007Msg = " + f007Msg );
	f007Msg = f007Msg + sddScheme + use2 + bussTrnCodeGroup + trnCode + customerName;
	logger.info("pmtOrderXtrEnhcr1EodStatement: Full f007Msg = " + f007Msg );
	logger.info("pmtOrderXtrEnhcr1EodStatement: contractNumber.type after append = "+typeof contractNumber);
	
	f005Msg = trnCodeV3 + circleNumber + companyCode + contractNumber + postingDate + valueDate;
	f005Msg = f005Msg + currency + amountTrnCurr + transactionType + internalIban;
	f005Msg = f005Msg + internalBic + externalIban + externalBic + endToEndId;
	f005Msg = f005Msg + initialRegistrationRef + returnCode + returnCodePlnTxt + mandateNumber;
	f005Msg = f005Msg + mandateDate + executionSequence + creditorId + debtorId;
	f005Msg = f005Msg + sddScheme + leaseUse1 + bussTrnCodeGroup + trnCode;
	logger.info("pmtOrderXtrEnhcr1EodStatement: Full f005Msg = " + f005Msg );

	f003Msg = trnCodeV3 + bussTrnCode + circleNumber + currency + amountTrnCurr + amountLclCurr;
	f003Msg = f003Msg + transactionType + contractNumber + valueDate + accountingArea;
	f003Msg = f003Msg + use1 + recipientBankCode + recipientAccount + internalIban;
	f003Msg = f003Msg + internalBic + externalIban + externalBic + endToEndId;
	f003Msg = f003Msg + initialRegistrationRef + returnCode + returnCodePlnTxt + mandateNumber;
	f003Msg = f003Msg + mandateDate + executionSequence + creditorId + debtorId;
	f003Msg = f003Msg + sddScheme + use2 + bussTrnCodeGroup + trnCode;
	logger.info("pmtOrderXtrEnhcr1EodStatement: Full f003Msg = " + f003Msg );
	
	setHeader(map, "PLCN_f003Msg", f003Msg);
	setHeader(map, "PLCN_f005Msg", f005Msg);
	setHeader(map, "PLCN_f007Msg", f007Msg);
	
	transactionType = "PELICAN_TRANSACTION_TYPE";
	sapAccount = "PELICAN_SAP_ACCOUNT";
	accountType = "PELICAN_ACCOUNT_TYPE";
	cpdName = "PELICAN_CPD_NAME";
	
	f001Msg = recordNumber + rateNumber + sapAccount + accountType +  bookingKey +  amountTrnCurr;
	f001Msg = f001Msg + transactionType + amountLclCurr + vatNumberPlate + amountSlTax;
	f001Msg = f001Msg + amountVat + plantSubnumberOrBusinessArea + pltMovTyp + portfolio;
	f001Msg = f001Msg + costCenter + assignment + valueDate + referenceDate;
	f001Msg = f001Msg + cpdCountryCode + cpdName + cpdPostcode + cpdPlace;
	f001Msg = f001Msg + cpdAddr + cpdBankAccount + cpdBankCode + cpdIsoCtryCode;
	f001Msg = f001Msg + cpdBankNmAddr + purposeTxt + internalIban + internalBic;
	f001Msg = f001Msg + externalIban + externalBic + endToEndId + initialRegistrationRef;
	f001Msg = f001Msg + returnCode + returnCodePlnTxt + mandateNumber + mandateDate;
	f001Msg = f001Msg + executionSequence + creditorId + debtorId + sddScheme;
	f001Msg = f001Msg + use2 + bussTrnCodeGroup + trnCode;
	logger.info("pmtOrderXtrEnhcr1EodStatement: Full f001Msg = " + f001Msg );
	
	setHeader(map, "PLCN_f001EodMsg", f001Msg);
	
	if(isPatternPresent(msgtype, "pacs.004") && !pacs004Charges){
		amountTrnCurr = "PELICAN_CHARGES_AMOUNT";
		amountLclCurr = "PELICAN_CHARGES_AMOUNT";
		trnCodeV3 = "PELICAN_TRN_CODE_V3";
		
		transactionType = getHeader(map, "PLCN_txntype");
		
		f007Msg = trnCodeV3 + bussTrnCode + circleNumber + currency + amountTrnCurr + amountLclCurr;
		f007Msg = f007Msg + transactionType + contractNumber + valueDate + companyCode;
		f007Msg = f007Msg + use1 + recipientBankCode + recipientAccount + internalIban;
		f007Msg = f007Msg + internalBic + externalIban + externalBic + endToEndId;
		f007Msg = f007Msg + initialRegistrationRef + returnCode + returnCodePlnTxt + mandateNumber;
		f007Msg = f007Msg + mandateDate + executionSequence + creditorId + debtorId;
		f007Msg = f007Msg + sddScheme + use2 + bussTrnCodeGroup + trnCode + customerName;
		
		f005Msg = trnCodeV3 + circleNumber + companyCode + contractNumber + postingDate + valueDate;
		f005Msg = f005Msg + currency + amountTrnCurr + transactionType + internalIban;
		f005Msg = f005Msg + internalBic + externalIban + externalBic + endToEndId;
		f005Msg = f005Msg + initialRegistrationRef + returnCode + returnCodePlnTxt + mandateNumber;
		f005Msg = f005Msg + mandateDate + executionSequence + creditorId + debtorId;
		f005Msg = f005Msg + sddScheme + leaseUse1 + bussTrnCodeGroup + trnCode;

		f003Msg = trnCodeV3 + bussTrnCode + circleNumber + currency + amountTrnCurr + amountLclCurr;
		f003Msg = f003Msg + transactionType + contractNumber + valueDate + accountingArea;
		f003Msg = f003Msg + use1 + recipientBankCode + recipientAccount + internalIban;
		f003Msg = f003Msg + internalBic + externalIban + externalBic + endToEndId;
		f003Msg = f003Msg + initialRegistrationRef + returnCode + returnCodePlnTxt + mandateNumber;
		f003Msg = f003Msg + mandateDate + executionSequence + creditorId + debtorId;
		f003Msg = f003Msg + sddScheme + use2 + bussTrnCodeGroup + trnCode;
		
		setHeader(map, "PLCN_chargesF003Msg", f003Msg);
		setHeader(map, "PLCN_chargesF003Msg", f005Msg);
		setHeader(map, "PLCN_chargesF003Msg", f007Msg);
		
		//amountTrnCurr = "PELICAN_AMOUNT_TRN_CURR";
		//amountLclCurr = "PELICAN_AMOUNT_LCL_CURR";
		transactionType = "PELICAN_TRANSACTION_TYPE";
		sapAccount = "PELICAN_SAP_ACCOUNT";
		accountType = "PELICAN_ACCOUNT_TYPE";
		cpdName = "PELICAN_CPD_NAME";
		
		f001Msg = recordNumber + rateNumber + sapAccount + accountType +  bookingKey +  amountTrnCurr;
		f001Msg = f001Msg + transactionType + amountLclCurr + vatNumberPlate + amountSlTax;
		f001Msg = f001Msg + amountVat + plantSubnumberOrBusinessArea + pltMovTyp + portfolio;
		f001Msg = f001Msg + costCenter + assignment + valueDate + referenceDate;
		f001Msg = f001Msg + cpdCountryCode + cpdName + cpdPostcode + cpdPlace;
		f001Msg = f001Msg + cpdAddr + cpdBankAccount + cpdBankCode + cpdIsoCtryCode;
		f001Msg = f001Msg + cpdBankNmAddr + purposeTxt + internalIban + internalBic;
		f001Msg = f001Msg + externalIban + externalBic + endToEndId + initialRegistrationRef;
		f001Msg = f001Msg + returnCode + returnCodePlnTxt + mandateNumber + mandateDate;
		f001Msg = f001Msg + executionSequence + creditorId + debtorId + sddScheme;
		f001Msg = f001Msg + use2 + bussTrnCodeGroup + trnCode;
		
		setHeader(map, "PLCN_chargesF001EodMsg", f001Msg);
	}
	
	if(internalBookingFlag == "Y"){
		transactionType = "PELICAN_TRANSACTION_TYPE";
		contractNumber = "PELICAN_CONTRACT_NUMBER";
		
		f007Msg = trnCodeV3 + bussTrnCode + circleNumber + currency + amountTrnCurr + amountLclCurr;
		f007Msg = f007Msg + transactionType + contractNumber + valueDate + companyCode;
		f007Msg = f007Msg + use1 + recipientBankCode + recipientAccount + internalIban;
		f007Msg = f007Msg + internalBic + externalIban + externalBic + endToEndId;
		f007Msg = f007Msg + initialRegistrationRef + returnCode + returnCodePlnTxt + mandateNumber;
		f007Msg = f007Msg + mandateDate + executionSequence + creditorId + debtorId;
		f007Msg = f007Msg + sddScheme + use2 + bussTrnCodeGroup + trnCode + customerName;
		
		f005Msg = trnCodeV3 + circleNumber + companyCode + contractNumber + postingDate + valueDate;
		f005Msg = f005Msg + currency + amountTrnCurr + transactionType + internalIban;
		f005Msg = f005Msg + internalBic + externalIban + externalBic + endToEndId;
		f005Msg = f005Msg + initialRegistrationRef + returnCode + returnCodePlnTxt + mandateNumber;
		f005Msg = f005Msg + mandateDate + executionSequence + creditorId + debtorId;
		f005Msg = f005Msg + sddScheme + use1 + bussTrnCodeGroup + trnCode;

		f003Msg = trnCodeV3 + bussTrnCode + circleNumber + currency + amountTrnCurr + amountLclCurr;
		f003Msg = f003Msg + transactionType + contractNumber + valueDate + accountingArea;
		f003Msg = f003Msg + use1 + recipientBankCode + recipientAccount + internalIban;
		f003Msg = f003Msg + internalBic + externalIban + externalBic + endToEndId;
		f003Msg = f003Msg + initialRegistrationRef + returnCode + returnCodePlnTxt + mandateNumber;
		f003Msg = f003Msg + mandateDate + executionSequence + creditorId + debtorId;
		f003Msg = f003Msg + sddScheme + use2 + bussTrnCodeGroup + trnCode;
		
		setHeader(map, "PLCN_f003Msg", f003Msg);
		setHeader(map, "PLCN_f005Msg", f005Msg);
		setHeader(map, "PLCN_f007Msg", f007Msg);
	}
	
	inputChannel = getHeader(map, "PLCN_inputChannel");
	if(isPatternPresent(inputChannel, "IBFQ-FMSG-IN")){
		setHeader(map, "PLCN_serviceConfig", "");
	}
	
	if(isPatternPresent(messagedirection, "I") && 
	(isPatternPresent(derivedProduct, "OB-SEPA-EQNS-IN") || 
	isPatternPresent(derivedProduct, "IB-SEPA-FILE-IN") || 
	isPatternPresent(derivedProduct, "OB-SEPA-DD-RFD-IN") || 
	isPatternPresent(derivedProduct, "OB-SEPA-DD-IN"))){
		setHeader(map, "PLCN_EodMsg", "CORE");
	}
	
	if((isPatternPresent(messagedirection, "O") && isPatternPresent(derivedProduct, "IB-SEPA-FILE-IN")) ||
	(isPatternPresent(messagedirection, "O") && isPatternPresent(derivedProduct, "IB-SEPA-EQNS-IN") && isPatternPresent(msgtype, "pacs.008")) ||
	(isPatternPresent(messagedirection, "O") && isPatternPresent(derivedProduct, "IB-SEPA-DD-RFD-IN") && isPatternPresent(msgtype, "pacs.004")) ||
	(isPatternPresent(messagedirection, "O") && isPatternPresent(derivedProduct, "IB-SEPA-EQNS-IN") && isPatternPresent(msgtype, "pacs.004"))){
		setHeader(map, "PLCN_EodMsg", "CORE");
	}
}

function ruleInternalBookingEodStatementDecision(exchange, formatLabel) {

	var f0031;
	var f0051;
	var f0071;
	var f0032;
	var f0052;
	var f0072;
	
	var txntype;
	var txntype2;
	var f001Msg;
	var f003Msg;
	var f005Msg;
	var f007Msg;
	var formatLabel1;
	var f001EodMsg;
	var eodMsg;
	var fEodMsgDebt;
	var fEodMsgCred;
	var companycode;
	var companycode1;
	var sapCr;
	var sapDr;
	var subSapCr;
	var subSapDr;
	var sapCr1;
	var f001EodMsgCred;
	var f001EodMsgDebt;
	var subF001EodMsgDebt;
	var subF001EodMsgCred;
	var contractNumber;
	var externalContractNumber;
	var f003MsgCred;
	var f003MsgDebt;
	var f005MsgCred;
	var f005MsgDebt;
	var f007MsgCred;
	var f007MsgDebt;
	
	var sapCrAccounttype;
	var sapCrReceipient;
	var sapDrAccounttype;
	var sapDrReceipient;
	var subSapCrAccounttype;
	var subSapCrReceipient;
	var subSapDrAccounttype;
	var subSapDrReceipient;
	
	 f0071 ="F0071";
	 f0051 ="F0051";
	 f0031 ="F0031";
	 f0072 ="F0072";
	 f0052 ="F0052";
	 f0032 ="F0032";
	 
	 var inMsg = exchange.getIn();
	 var map = inMsg.getHeaders();
	 var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 	 
	 txntype = getHeader(map, "PLCN_txnType");
	 if(!txntype ){
		txntype = getHeader(map, "PLCN_transactiontype");
	 }
	 if(!txntype ){
		txntype = getHeader(map, "PLCN_txntype");
	 }
	 logger.info("ruleInternalBookingEodStatementDecision: txntype = "+ txntype);
	 companycode = getHeader(map, "PLCN_companycode");
	 logger.info("ruleInternalBookingEodStatementDecision: companycode = "+ companycode);
	 companycode1 = getHeader(map, "PLCN_companycode1");
	 logger.info("ruleInternalBookingEodStatementDecision: companycode1 = "+ companycode1);
	 contractNumber = getHeader(map, "PLCN_contractNumber");
	 logger.info("ruleInternalBookingEodStatementDecision: contractNumber = "+ contractNumber);
	 externalContractNumber = getHeader(map, "PLCN_externalContractNumber");
	 logger.info("ruleInternalBookingEodStatementDecision: externalContractNumber = " +externalContractNumber);
	 formatLabel = getHeader(map, "PLCN_formatLabel");
	 logger.info("ruleInternalBookingEodStatementDecision: formatLabel = "+ formatLabel);
	 formatLabel1 = getHeader(map, "PLCN_formatLabel1");
	 logger.info("ruleInternalBookingEodStatementDecision: formatLabel1 = "+ formatLabel1);
	  
	 f003Msg = getHeader(map, "PLCN_f003Msg");
	 logger.info("ruleInternalBookingEodStatementDecision: f003Msg = "+ f003Msg);
	 f005Msg = getHeader(map, "PLCN_f005Msg");
	 logger.info("ruleInternalBookingEodStatementDecision: f005Msg = "+ f005Msg);
	 f007Msg = getHeader(map, "PLCN_f007Msg");
	 logger.info("ruleInternalBookingEodStatementDecision: f007Msg = "+ f007Msg);
	 f001EodMsg = getHeader(map, "PLCN_f001EodMsg");
	 logger.info("ruleInternalBookingEodStatementDecision: f001EodMsg = "+ f001EodMsg);
	 
	 sapCrAccounttype = getHeader(map, "PLCN_sapCrAccounttype");
	 logger.info("ruleInternalBookingEodStatementDecision: sapCrAccounttype = "+ sapCrAccounttype);
	 sapCrReceipient = getHeader(map, "PLCN_sapCrReceipient");
	 logger.info("ruleInternalBookingEodStatementDecision: sapCrReceipient = "+ sapCrReceipient);
	 sapDrAccounttype = getHeader(map, "PLCN_sapDrAccounttype");
	 logger.info("ruleInternalBookingEodStatementDecision: sapDrAccounttype = "+ sapDrAccounttype);
	 sapDrReceipient = getHeader(map, "PLCN_sapDrReceipient");
	 logger.info("ruleInternalBookingEodStatementDecision: sapDrReceipient = "+ sapDrReceipient);
	 
	 subSapCrAccounttype = getHeader(map, "PLCN_subSapCrAccounttype");
	 logger.info("ruleInternalBookingEodStatementDecision: subSapCrAccounttype = "+ subSapCrAccounttype);
	 subSapCrReceipient = getHeader(map, "PLCN_subSapCrReceipient");
	 logger.info("ruleInternalBookingEodStatementDecision: subSapCrReceipient = "+ subSapCrReceipient);
	 subSapDrAccounttype = getHeader(map, "PLCN_subSapDrAccounttype");
	 logger.info("ruleInternalBookingEodStatementDecision: subSapDrAccounttype = "+ subSapDrAccounttype);
	 subSapDrReceipient = getHeader(map, "PLCN_subSapDrReceipient");
	 logger.info("ruleInternalBookingEodStatementDecision: subSapDrReceipient = "+ subSapDrReceipient);
	 
	 sapCr = getHeader(map, "PLCN_sapCr");
	 logger.info("ruleInternalBookingEodStatementDecision: sapCr = "+ sapCr);
	 sapDr = getHeader(map, "PLCN_sapDr");
	 logger.info("ruleInternalBookingEodStatementDecision: sapDr = "+ sapDr);
	 subSapCr = getHeader(map, "PLCN_subSapCr");
	 logger.info("ruleInternalBookingEodStatementDecision: subSapCr = "+ subSapCr);
	 subSapDr = getHeader(map, "PLCN_subSapDr");
	 logger.info("ruleInternalBookingEodStatementDecision: subSapDr = "+ subSapDr);
	 
	 sapCr = variableConversionRule(exchange,sapCr,10);
	 logger.info("ruleInternalBookingEodStatementDecision: after conversion sapCr = "+ sapCr);
	 sapDr = variableConversionRule(exchange,sapDr,10);
	 logger.info("ruleInternalBookingEodStatementDecision: after conversion sapDr = "+ sapDr);
	 subSapCr = variableConversionRule(exchange,subSapCr,10);
	 logger.info("ruleInternalBookingEodStatementDecision: after conversion subSapCr = "+ subSapCr);
	 subSapDr = variableConversionRule(exchange,subSapDr,10);
	 logger.info("ruleInternalBookingEodStatementDecision: after conversion subSapDr = "+ subSapDr);

	 f001EodMsgCred = f001EodMsg.replace("PELICAN_SAP_ACCOUNT", sapCr);
	 f001EodMsgCred = f001EodMsgCred.replace("PELICAN_TRANSACTION_TYPE", "H");
	 f001EodMsgCred = f001EodMsgCred.replace("PELICAN_CPD_NAME", sapCrReceipient);
	 f001EodMsgCred = f001EodMsgCred.replace("PELICAN_ACCOUNT_TYPE", sapCrAccounttype);

 	 f001EodMsgDebt = f001EodMsg.replace("PELICAN_SAP_ACCOUNT", sapDr);
	 f001EodMsgDebt = f001EodMsgDebt.replace("PELICAN_TRANSACTION_TYPE", "S");
	 f001EodMsgDebt = f001EodMsgDebt.replace("PELICAN_CPD_NAME", sapDrReceipient);
	 f001EodMsgDebt = f001EodMsgDebt.replace("PELICAN_ACCOUNT_TYPE", sapDrAccounttype);
	
	 setHeader(map, "PLCN_f001EodMsgCred", f001EodMsgCred);
	 setHeader(map, "PLCN_f001EodMsgDebt", f001EodMsgDebt);
	 setHeader(map, "PLCN_f001EodStatus", "A");
	 
	 if(companycode == "043" || companycode1 == "044" || companycode1 == "043" || companycode == "044"){
		subF001EodMsgCred = f001EodMsg.replace("PELICAN_SAP_ACCOUNT", subSapCr);
		subF001EodMsgCred = subF001EodMsgCred.replace("PELICAN_TRANSACTION_TYPE", "H");
		subF001EodMsgCred = subF001EodMsgCred.replace("PELICAN_CPD_NAME", subSapCrReceipient);
		subF001EodMsgCred = subF001EodMsgCred.replace("PELICAN_ACCOUNT_TYPE", subSapCrAccounttype);

		subF001EodMsgDebt = f001EodMsg.replace("PELICAN_SAP_ACCOUNT", subSapDr);
		subF001EodMsgDebt = subF001EodMsgDebt.replace("PELICAN_TRANSACTION_TYPE", "S");
		subF001EodMsgDebt = subF001EodMsgDebt.replace("PELICAN_CPD_NAME", subSapDrReceipient);
		subF001EodMsgDebt = subF001EodMsgDebt.replace("PELICAN_ACCOUNT_TYPE", subSapDrAccounttype);
		
		setHeader(map, "PLCN_subF001EodMsgCred", subF001EodMsgCred);
		setHeader(map, "PLCN_subF001EodMsgDebt", subF001EodMsgDebt); 
		setHeader(map, "PLCN_f0011EodStatus", "A");
	 }
	 
	 f003MsgCred = f003Msg.replace("PELICAN_TRANSACTION_TYPE", "C");
	 logger.info("ruleInternalBookingEodStatementDecision: f003MsgCred after txntype replace = "+ f003MsgCred);
	 f003MsgDebt = f003Msg.replace("PELICAN_TRANSACTION_TYPE", "D");
	 logger.info("ruleInternalBookingEodStatementDecision: f003MsgDebt after txntype replace = "+ f003MsgDebt);
	 f005MsgCred = f005Msg.replace("PELICAN_TRANSACTION_TYPE", "C");
	 logger.info("ruleInternalBookingEodStatementDecision: f005MsgCred after txntype replace = "+ f005MsgCred);
	 f005MsgDebt = f005Msg.replace("PELICAN_TRANSACTION_TYPE", "D");
	 logger.info("ruleInternalBookingEodStatementDecision: f005MsgDebt after txntype replace = "+ f005MsgDebt);
	 f007MsgCred = f007Msg.replace("PELICAN_TRANSACTION_TYPE", "C");
	 logger.info("ruleInternalBookingEodStatementDecision: f007MsgCred after txntype replace = "+ f007MsgCred);
	 f007MsgDebt = f007Msg.replace("PELICAN_TRANSACTION_TYPE", "D");
	 logger.info("ruleInternalBookingEodStatementDecision: f007MsgDebt after txntype replace = "+ f007MsgDebt);
	
	if(txntype == "C"){
		 logger.info("ruleInternalBookingEodStatementDecision: in txntype C loop for contract number");
		 f003MsgCred = f003MsgCred.replace("PELICAN_CONTRACT_NUMBER", contractNumber);
		 f005MsgCred = f005MsgCred.replace("PELICAN_CONTRACT_NUMBER", contractNumber);
		 f007MsgCred = f007MsgCred.replace("PELICAN_CONTRACT_NUMBER", contractNumber);
		 
		 f003MsgDebt = f003MsgDebt.replace("PELICAN_CONTRACT_NUMBER", externalContractNumber);
		 f005MsgDebt = f005MsgDebt.replace("PELICAN_CONTRACT_NUMBER", externalContractNumber);
		 f007MsgDebt = f007MsgDebt.replace("PELICAN_CONTRACT_NUMBER", externalContractNumber);
	}else{
		 logger.info("ruleInternalBookingEodStatementDecision: in txntype D loop for contract number");
		 f003MsgDebt = f003MsgDebt.replace("PELICAN_CONTRACT_NUMBER", contractNumber);
		 f005MsgDebt = f005MsgDebt.replace("PELICAN_CONTRACT_NUMBER", contractNumber);
		 f007MsgDebt = f007MsgDebt.replace("PELICAN_CONTRACT_NUMBER", contractNumber);

		 f003MsgCred = f003MsgCred.replace("PELICAN_CONTRACT_NUMBER", externalContractNumber);
		 f005MsgCred = f005MsgCred.replace("PELICAN_CONTRACT_NUMBER", externalContractNumber);
		 f007MsgCred = f007MsgCred.replace("PELICAN_CONTRACT_NUMBER", externalContractNumber);
	}
	if(txntype == "C"){
		if(formatLabel == "F014"){
			setHeader(map, "PLCN_fEodMsgCred", f007MsgCred); 
			setHeader(map, "PLCN_eodMsg", f0071); 
			setHeader(map, "PLCN_coreEodStatus", "A"); 
		}
		if(formatLabel == "F013"){
			setHeader(map, "PLCN_fEodMsgCred", f005MsgCred); 
			setHeader(map, "PLCN_eodMsg", f0051); 
			setHeader(map, "PLCN_coreEodStatus", "A"); 
		}
		if(formatLabel == "F012"){
			setHeader(map, "PLCN_fEodMsgCred", f003MsgCred); 
			setHeader(map, "PLCN_eodMsg", f0031); 
			setHeader(map, "PLCN_coreEodStatus", "A"); 
		}
		
		if(formatLabel1 == "F014"){
			setHeader(map, "PLCN_internalBookingEodDebt", f007MsgDebt); 
			setHeader(map, "PLCN_internalEodMsg", f0072); 
			setHeader(map, "PLCN_core2EodStatus", "A"); 
		}
		if(formatLabel1 == "F013"){
			setHeader(map, "PLCN_internalBookingEodDebt", f005MsgDebt); 
			setHeader(map, "PLCN_internalEodMsg", f0052); 
			setHeader(map, "PLCN_core2EodStatus", "A"); 
		}
		if(formatLabel1 == "F012"){
			setHeader(map, "PLCN_internalBookingEodDebt", f003MsgDebt); 
			setHeader(map, "PLCN_internalEodMsg", f0032); 
			setHeader(map, "PLCN_core2EodStatus", "A"); 
		}
	}else{
		if(formatLabel == "F014"){
			setHeader(map, "PLCN_fEodMsgDebt", f007MsgDebt); 
			setHeader(map, "PLCN_eodMsg", f0071); 
			setHeader(map, "PLCN_coreEodStatus", "A"); 
		}
		if(formatLabel == "F013"){
			setHeader(map, "PLCN_fEodMsgDebt", f005MsgDebt); 
			setHeader(map, "PLCN_eodMsg", f0051); 
			setHeader(map, "PLCN_coreEodStatus", "A"); 
		}
		if(formatLabel == "F012"){
			setHeader(map, "PLCN_fEodMsgDebt", f003MsgDebt); 
			setHeader(map, "PLCN_eodMsg", f0031); 
			setHeader(map, "PLCN_coreEodStatus", "A"); 
		}
		
		if(formatLabel1 == "F014"){
			setHeader(map, "PLCN_internalBookingEodCred", f007MsgCred); 
			setHeader(map, "PLCN_internalEodMsg", f0072); 
			setHeader(map, "PLCN_core2EodStatus", "A"); 
		}
		if(formatLabel1 == "F013"){
			setHeader(map, "PLCN_internalBookingEodCred", f005MsgCred); 
			setHeader(map, "PLCN_internalEodMsg", f0052); 
			setHeader(map, "PLCN_core2EodStatus", "A"); 
		}
		if(formatLabel1 == "F012"){
			setHeader(map, "PLCN_internalBookingEodCred", f003MsgCred); 
			setHeader(map, "PLCN_internalEodMsg", f0032); 
			setHeader(map, "PLCN_core2EodStatus", "A"); 
		}
	}
	return 0;
}

function ruleInternalBookingEodStatementExceptions(exchange) {

	var fEodMsgDebt;
	var fEodMsgCred;
	var subF001EodMsgDebt;
	var subF001EodMsgCred;
	var f001EodMsgDebt;
	var f001EodMsgCred;
	var txntype;
	var msgDirection;
	var messageClassType;
	var productCode;
	var txnGrp;
	var eodOrgMessageclasstype;
	var formatLabel;
	var formatLabel1;
	var companycode;
	var companycode1;
	var documentF009;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
    documentF009 = getHeader(map, "PLCN_documentF009");
	logger.info("ruleInternalBookingEodStatementExceptions: documentF009 = "+ documentF009);
	if(documentF009) {
		documentF009 = documentF009.substr(0,4);
		logger.info("ruleInternalBookingEodStatementExceptions: documentF009 AFTER SUBSTRING= " + documentF009);
	}
	eodOrgMessageclasstype = getHeader(map, "PLCN_eodOrgMessageclasstype");
	logger.info("ruleInternalBookingEodStatementExceptions: eodOrgMessageclasstype = "+ eodOrgMessageclasstype);
	fEodMsgDebt = getHeader(map, "PLCN_fEodMsgDebt");
	logger.info("ruleInternalBookingEodStatementExceptions: fEodMsgDebt = "+ fEodMsgDebt);
	fEodMsgCred = getHeader(map, "PLCN_fEodMsgCred");
	logger.info("ruleInternalBookingEodStatementExceptions: fEodMsgCred = "+ fEodMsgCred);
	subF001EodMsgDebt = getHeader(map, "PLCN_subF001EodMsgDebt");
	logger.info("ruleInternalBookingEodStatementExceptions: subF001EodMsgDebt = "+ subF001EodMsgDebt);
	subF001EodMsgCred = getHeader(map, "PLCN_subF001EodMsgCred");
	logger.info("ruleInternalBookingEodStatementExceptions: subF001EodMsgCred = "+ subF001EodMsgCred);
	f001EodMsgDebt = getHeader(map, "PLCN_f001EodMsgDebt");
	logger.info("ruleInternalBookingEodStatementExceptions: f001EodMsgDebt = "+ f001EodMsgDebt);
	f001EodMsgCred = getHeader(map, "PLCN_f001EodMsgCred");
	logger.info("ruleInternalBookingEodStatementExceptions: f001EodMsgCred = "+ f001EodMsgCred);
	 txntype = getHeader(map, "PLCN_txnType");
	 if(!txntype ){
		txntype = getHeader(map, "PLCN_transactionType");
	 }
	logger.info("ruleInternalBookingEodStatementExceptions: txntype = "+ txntype);
	msgDirection = getHeader(map, "PLCN_msgDirection");
	logger.info("ruleInternalBookingEodStatementExceptions: msgDirection = "+ msgDirection);
	messageClassType = getHeader(map, "PLCN_messageClassType");
	logger.info("ruleInternalBookingEodStatementExceptions: messageClassType = "+ messageClassType);
	txnGrp = getHeader(map, "PLCN_txnGrp");
	logger.info("ruleInternalBookingEodStatementExceptions: txnGrp = "+ txnGrp);
	formatLabel = getHeader(map, "PLCN_formatLabel");
	logger.info("ruleInternalBookingEodStatementExceptions: formatLabel = "+ formatLabel);
	formatLabel1 = getHeader(map, "PLCN_formatLabel1");
	logger.info("ruleInternalBookingEodStatementExceptions: formatLabel1 = "+ formatLabel1);
	companycode = getHeader(map, "PLCN_companycode");
	logger.info("ruleInternalBookingEodStatementExceptions: companycode = "+ companycode);
	companycode1 = getHeader(map, "PLCN_companycode1");
	logger.info("ruleInternalBookingEodStatementExceptions: companycode1 = "+ companycode1);
	productCode = getHeader(map, "PLCN_productCode");
	logger.info("ruleInternalBookingEodStatementExceptions: productCode = "+ productCode);
	
	
	if(documentF009 == "F009" && formatLabel == "F012" && formatLabel1 == "F012" && txntype == "D"){
		setHeader(map, "PLCN_f001EodMsgCred", "");
		setHeader(map, "PLCN_fEodMsgDebt", "");

	}
	
	if(formatLabel == "F011" && formatLabel1 == "F012" && (companycode == "043" || companycode == "044")){
		setHeader(map, "PLCN_f001EodMsgCred", "");
		setHeader(map, "PLCN_f001EodMsgDebt", "");
		setHeader(map, "PLCN_f001EodStatus", "Y");
	}
	
	if(formatLabel == "F012" && formatLabel1 == "F011" && (companycode == "043" || companycode == "044")){
		setHeader(map, "PLCN_f001EodMsgCred", "");
		setHeader(map, "PLCN_f001EodMsgDebt", "");
		setHeader(map, "PLCN_subF001EodMsgCred", "");
		setHeader(map, "PLCN_subF001EodMsgCred", "");
		setHeader(map, "PLCN_fEodMsgCred", "");
		setHeader(map, "PLCN_fEodMsgDebt", "");
		setHeader(map, "PLCN_f001EodStatus", "Y");
		setHeader(map, "PLCN_f0011EodStatus", "Y");
		setHeader(map, "PLCN_coreEodStatus", "Y");
		setHeader(map, "PLCN_core2EodStatus", "Y");
	}
	
	if(formatLabel == "F012" && formatLabel1 == "F012" && (companycode == "043" || companycode == "044")){
		setHeader(map, "PLCN_f001EodMsgCred", "");
		setHeader(map, "PLCN_f001EodMsgDebt", "");
		setHeader(map, "PLCN_subF001EodMsgCred", "");
		setHeader(map, "PLCN_subF001EodMsgCred", "");
		setHeader(map, "PLCN_fEodMsgCred", "");
		setHeader(map, "PLCN_fEodMsgDebt", "");
		setHeader(map, "PLCN_f001EodStatus", "Y");
		setHeader(map, "PLCN_f0011EodStatus", "Y");
		setHeader(map, "PLCN_coreEodStatus", "Y");
		setHeader(map, "PLCN_core2EodStatus", "Y");
	}
	
	if(formatLabel == "F012" && formatLabel1 == "F013" && (companycode == "043" || companycode == "044")){
		setHeader(map, "PLCN_f001EodMsgCred", "");
		setHeader(map, "PLCN_f001EodMsgDebt", "");
		setHeader(map, "PLCN_subF001EodMsgCred", "");
		setHeader(map, "PLCN_subF001EodMsgCred", "");
		setHeader(map, "PLCN_fEodMsgCred", "");
		setHeader(map, "PLCN_fEodMsgDebt", "");
		setHeader(map, "PLCN_f001EodStatus", "Y");
		setHeader(map, "PLCN_f0011EodStatus", "Y");
		setHeader(map, "PLCN_coreEodStatus", "Y");
		setHeader(map, "PLCN_core2EodStatus", "Y");
	}
	
	if(formatLabel == "F013" && formatLabel1 == "F011" && (companycode == "043" || companycode == "044")){
		setHeader(map, "PLCN_f001EodMsgCred", "");
		setHeader(map, "PLCN_f001EodMsgDebt", "");
		setHeader(map, "PLCN_f001EodStatus", "Y");
	}
	
	if(formatLabel == "F013" && formatLabel1 == "F012" && (companycode == "043" || companycode == "044")){
		setHeader(map, "PLCN_f001EodMsgCred", "");
		setHeader(map, "PLCN_f001EodMsgDebt", "");
		setHeader(map, "PLCN_subF001EodMsgCred", "");
		setHeader(map, "PLCN_subF001EodMsgCred", "");
		setHeader(map, "PLCN_fEodMsgCred", "");
		setHeader(map, "PLCN_fEodMsgDebt", "");
		setHeader(map, "PLCN_f001EodStatus", "Y");
		setHeader(map, "PLCN_f0011EodStatus", "Y");
		setHeader(map, "PLCN_coreEodStatus", "Y");
		setHeader(map, "PLCN_core2EodStatus", "Y");
	}
	
	if(formatLabel == "F013" && formatLabel1 == "F013" && (companycode == "043" || companycode == "044")){
		setHeader(map, "PLCN_f001EodMsgCred", "");
		setHeader(map, "PLCN_f001EodMsgDebt", "");
		setHeader(map, "PLCN_f001EodStatus", "Y");
	}
	
	if(formatLabel == "F014" || formatLabel1 == "F014"){
		setHeader(map, "PLCN_f001EodMsgCred", "");
		setHeader(map, "PLCN_f001EodMsgDebt", "");
		setHeader(map, "PLCN_subF001EodMsgCred", "");
		setHeader(map, "PLCN_subF001EodMsgCred", "");
		setHeader(map, "PLCN_fEodMsgCred", "");
		setHeader(map, "PLCN_fEodMsgDebt", "");
		setHeader(map, "PLCN_f001EodStatus", "Y");
		setHeader(map, "PLCN_f0011EodStatus", "Y");
		setHeader(map, "PLCN_coreEodStatus", "Y");
		setHeader(map, "PLCN_core2EodStatus", "Y");
	}
}

function sepaUpdateRuleSntd(exchange){

	var msgtype;
    var lookupTableName;
    
	var queueid;
    var prevqueueid;
    var status1;
    var custom13;
    var messagedate;
    var currentdate;
    var lastSanctiondate;
    var ofacResponse;
    var sanctionsRetval;

    var cashForecasting1;
    var authorizationQueue;
    var sanctionsHoldQueue;
    var holdQueue;
    var dispositionQueue;
    var falseSanctionsQueue;
    var bulkingQueue;
    var processingStage;
    var inputdate;
	var msgDirection;
	var formatLabel;
	var reviewQueue;
	
	var manualRepair;
	var manualRepairResponse;
	var manualRepairQueue;	
	var releasedate;	
	var releasedatetime;	
	var releasetime;	
	var custom24;	
	var matchingQueue;
	var comments;
	var commentsForBlob6;
	var txnComments;
	var todaysDate;
	var origValueDate;
	
	var sanctionsSapDr;
	var sanctionsSapCr;
	var sanctionsSubSapCr;
	var sanctionsSubSapDr;
	var sanctionsF001EodMsgCred;
	var sanctionsF001EodMsgDebt;
	var sanctionsSubF001EodMsgCred;
	var sanctionsSubF001EodMsgDebt;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	msgtype = getHeader(map, "PLCN_msgtype");
	logger.info("sepaUpdateRuleSntd: msgtype = " + msgtype);
	if(msgtype) {
		msgtype = msgtype.substr(0,8);
		msgtype = msgtype.replace(".", "");
		msgtype = msgtype.toUpperCase();
	}
	lookupTableName = "SANTANDER_DB_QUEUES_" + msgtype;
	logger.info("sepaUpdateRuleSntd: lookupTableName = " + lookupTableName);
	
	queueid = getHeader(map, "PLCN_aceQueueId");
	logger.info("sepaUpdateRuleSntd: queueid = " + queueid);
	prevqueueid = getHeader(map, "PLCN_prevQueueId");
	logger.info("sepaUpdateRuleSntd: prevqueueid = " + prevqueueid);
	status1 = getHeader(map, "PLCN_gvStatusFrmDb");
	custom13 = getHeader(map, "PLCN_custom13");
	logger.info("sepaUpdateRuleSntd: custom13 = " + custom13);
	messagedate = getHeader(map, "PLCN_valuedate");
	inputdate = getHeader(map, "PLCN_inputDate");
	msgDirection = getHeader(map, "PLCN_msgDirection");
	currentdate = getDate();
	
	matchingQueue = customMemTblGetTblValue(map, lookupTableName,"matchingQueue");
	cashForecasting1 = customMemTblGetTblValue(map, lookupTableName,"cashForecasting1");
	sanctionsHoldQueue = customMemTblGetTblValue(map, lookupTableName,"sanctionsHoldQueue");
	authorizationQueue = customMemTblGetTblValue(map, lookupTableName,"authorizationQueue");
	holdQueue = customMemTblGetTblValue(map, lookupTableName,"holdQueue");
	dispositionQueue = customMemTblGetTblValue(map, lookupTableName,"dispositionQueue");
	falseSanctionsQueue = customMemTblGetTblValue(map, lookupTableName,"falseSanctionsQueue");
	bulkingQueue = customMemTblGetTblValue(map, lookupTableName,"bulkingQueue");
	processingStage = "";
	
	manualRepairQueue = customMemTblGetTblValue(map, lookupTableName,"manualRepairQueue");
	logger.info("sepaUpdateRuleSntd: manualRepairQueue = " + manualRepairQueue);
	reviewQueue = customMemTblGetTblValue(map, lookupTableName,"reviewQueue");
	logger.info("sepaUpdateRuleSntd: reviewQueue = " + reviewQueue);
	lastSanctiondate = getHeader(map, "PLCN_lastSanctiondate");
	
	if(!manualRepair){
		manualRepair = "MANUAL_REPAIR=Y";
	}
	
	if(manualRepair == "MANUAL_REPAIR=Y"){
		manualRepairResponse = sepaCheckManualRepair(exchange);
		logger.info("sepaUpdateRuleSntd: Manual Repair Response VALUE IS= " + manualRepairResponse);
	
		
		if(isPatternPresent(custom13, "REVIEW=Y") && manualRepairResponse == "J"){
			setHeader(map, "PLCN_queueAudit", reviewQueue);
			setHeader(map, "PLCN_status", "69");
			setHeader(map, "PLCN_customCheckReq", "true");
			setHeader(map, "PLCN_MODSEPAQ", "true");
			setHeader(map, "PLCN_processingStage", "WITH");
            setHeader(map, "PLCN_currentAuthLevel", currentAuthLevelUpdate(exchange, "WITH", "WITHDRAWAL"))
			if(custom13) {
				custom13 = custom13.replace("REVIEW=Y", "REVIEW=D");
			}
			setHeader(map, "PLCN_custom13", custom13);
			return 0;
		}
		if(manualRepairResponse == "X"){
			repairEodGeneration(exchange);
			sapDoctype(exchange);
			eodGroupingInfo(exchange);
			circleNumberSntd(exchange);
			pmtOrderXtrEnhcr1EodStatement(exchange);
			sapCpdNameGeneration(exchange);
			ruleEodStatementDecision(exchange);
			ruleEodStatementExceptions(exchange);
			manualRepair = manualRepair.replace("MANUAL_REPAIR=Y", "MANUAL_REPAIR=D");
		}
		if(manualRepairResponse == "T"){
			repairEodGeneration(exchange);
			sapDoctype(exchange);
			eodGroupingInfo(exchange);
			circleNumberSntd(exchange);
			pmtOrderXtrEnhcr1EodStatement(exchange);
			sapCpdNameGeneration(exchange);
			ruleEodStatementDecision(exchange);
			ruleEodStatementExceptions(exchange);
			
			if(msgDirection == "I"){
				todaysDate = getDate();
				origValueDate = getHeader(map, "PLCN_valueDate2");
				if(!origValueDate){
					origValueDate = getHeader(map, "PLCN_valuedate");
				}
				if(origValueDate < todaysDate){
					setCommentsForTransaction("00", "8993", map);
				}
			}
			if(manualRepair) {
				manualRepair = manualRepair.replace("MANUAL_REPAIR=Y", "MANUAL_REPAIR=D");
			}
			setHeader(map, "PLCN_queueAudit", manualRepairQueue);
			setHeader(map, "PLCN_status", "69");
			setHeader(map, "PLCN_customCheckReq", "true");
			setHeader(map, "PLCN_MXREPRQ", "true");
			setHeader(map, "PLCN_processingStage", "REPR");
			if(custom13) {
				custom13 = custom13.replace("REVIEW=Y", "REVIEW=D");
			}
			setHeader(map, "PLCN_custom13String", custom13);
			
			if(msgDirection == "O"){
				setHeader(map, "PLCN_f001EodStatus", "A");
			}
			return 0;
		}else{
			if(manualRepair) {
				manualRepair = manualRepair.replace("MANUAL_REPAIR=Y","MANUAL_REPAIR=N");
			}
			if(isPatternPresent(manualRepairResponse, "F0") || manualRepairResponse == "J"){
				logger.info("sepaUpdateRuleSntd:If backoffice is derived loop... ");
				eodSapGeneration(exchange);
				sapDoctype(exchange);
				sanctionsEodSapGeneration(exchange);
				eodGroupingInfo(exchange);
				circleNumberSntd(exchange);
				pmtOrderXtrEnhcr1EodStatement(exchange);
				sapCpdNameGeneration(exchange);
				ruleEodStatementDecision(exchange);
				ruleEodStatementExceptions(exchange);
			}
		}
	}
	if(prevqueueid == "CCBLOCKQ"){
		ruleSntdCnfBlockActions(exchange);
	}
}

function repairEodGeneration(exchange){
  var inMsg;
  var map;
  var readMsgdb;
  var Document;
  var sapCr;
  var sapDr;
  var txnType;
  var nostroAccount;
  var aggregateflag;
  inMsg = exchange.getIn();
  map = inMsg.getHeaders();
  readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
  Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
  
  txnType = getHeader(map,"PLCN_txnType");
  logger.info("repairEodGeneration: txnType = " + txnType);
  
  nostroAccount = getHeader(map,"PLCN_glNostroAccount");
  logger.info("repairEodGeneration: nostroAccount = " + nostroAccount);
  
  if(txnType == 'D'){
     setHeader(map, "PLCN_sapDr", "581025");
	 setHeader(map, "PLCN_sapCr", nostroAccount);
	 aggregateflag = "BOTH-AGG";
	 setHeader(map, "PLCN_aggregateFlag", aggregateflag);
	 setHeader(map, "PLCN_companyCode", "001");
	 setHeader(map, "PLCN_accountType", "KR");
  }
  
  if(txnType == 'C'){
     setHeader(map, "PLCN_sapDr", nostroAccount);
	 setHeader(map, "PLCN_sapCr", "581025");
	 aggregateflag = "BOTH-AGG";
	 setHeader(map, "PLCN_aggregateFlag", aggregateflag);
	 setHeader(map, "PLCN_companyCode", "001");
	 setHeader(map, "PLCN_accountType", "KR");
  }
  
}

function eodGroupingInfo(exchange){
   var companyCode1;
   var currency;
   var msgDirection;
   var sapDoctype;
   var grouping;
   var msgType;
   var msgdbId;
   var inMsg;
   var map;
   var readMsgdb;
   var Document;
   
   inMsg = exchange.getIn();
   map = inMsg.getHeaders();
   readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
   Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	body = inMsg.getBody(java.lang.String.class);
	logger.info("eodGroupingInfo: body = " + body);
   
   var msgdbIdPathPacs008 = '/Document/FIToFICstmrCdtTrf/GrpHdr/MsgId';
   var msgdbIdPacs008 = getValueFromPath(Document, msgdbIdPathPacs008);
   logger.info("eodGroupingInfo:msgdbIdPacs008 = " + msgdbIdPacs008);
   
   var msgdbIdPathPacs003 = '/Document/FIToFICstmrDrctDbt/GrpHdr/MsgId';
   var msgdbIdPacs003 = getValueFromPath(Document, msgdbIdPathPacs003);
   logger.info("eodGroupingInfo:msgdbIdPacs003 = " + msgdbIdPacs003);
   
   var msgdbIdPathPacs004 = '/Document/PmtRtr/GrpHdr/MsgId';
   var msgdbIdPacs004 = getValueFromPath(Document, msgdbIdPathPacs004);
   logger.info("eodGroupingInfo:msgdbIdPacs004 = " + msgdbIdPacs004);

   if(!msgdbIdPacs008 || !msgdbIdPacs003 || !msgdbIdPacs004){
   	msgdbIdPacs008 = dataBetweenTokens("<MsgId>","</MsgId>", body);
   	msgdbIdPacs003 = dataBetweenTokens("<MsgId>","</MsgId>", body);
   	msgdbIdPacs004 = dataBetweenTokens("<MsgId>","</MsgId>", body);
   	logger.info("eodGroupingInfo:msgdbIdPacs008 = " + msgdbIdPacs008);
   	logger.info("eodGroupingInfo:msgdbIdPacs003 = " + msgdbIdPacs003);
   	logger.info("eodGroupingInfo:msgdbIdPacs004 = " + msgdbIdPacs004);
   }
   
   companyCode1 = getHeader(map,"PLCN_companyCode");
   logger.info("eodGroupingInfo: companyCode1 = " + companyCode1);
   
   currency = getHeader(map,"PLCN_currency");
   logger.info("sapDoctype: currency = " + currency);
   
   msgDirection = getHeader(map, "PLCN_msgDirection");
   logger.info("eodGroupingInfo: msgDirection = " + msgDirection);
   
   sapDoctype = getHeader(map, "PLCN_sapDocType");
   logger.info("eodGroupingInfo: sapDoctype = " + sapDoctype);
   
   msgType = getHeader(map, "PLCN_msgType");
   if(msgType) {
   	msgType = msgType.trim();
   }
   logger.info("eodGroupingInfo: msgType = " + msgType);

   if(msgType == 'pacs.008.001.08'){
      grouping = sapDoctype + "|" + currency + "|" + companyCode1 + "|" + msgdbIdPacs008 + "|";
	  logger.info("eodGroupingInfo: grouping = " + grouping);
	  setHeader(map, "PLCN_groupinginfoEod", grouping);
   }
   
   if(msgType == 'pacs.003.001.08'){
      grouping = sapDoctype + "|" + currency + "|" + companyCode1 + "|" + msgdbIdPacs003 + "|";
	  logger.info("eodGroupingInfo: grouping = " + grouping);
	  setHeader(map, "PLCN_groupinginfoEod", grouping);
   }
   
   if(msgType == 'pacs.004.001.09'){
      grouping = sapDoctype + "|" + currency + "|" + companyCode1 + "|" + msgdbIdPacs004 + "|";
	  logger.info("eodGroupingInfo: grouping = " + grouping);
	  setHeader(map, "PLCN_groupinginfoEod", grouping);
   }
}

function circleNumberSntd(exchange){
     var msgType;
	 var msgDirection;
	 var companyCode1;
	 var derivedProductCode;
	 var circleNumber;
	 var txnType;
	 var orgnlmsgnmid;
	 var internalBookingFlag;
	 var inMsg;
	 var map;
	 var readMsgdb;
	 var Document;
	 
	 inMsg = exchange.getIn();
     map = inMsg.getHeaders();
     readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
     Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 
	 internalBookingFlag = getHeader(map,"PLCN_internalBookingFlag");
     logger.info("circleNumberSntd: internalBookingFlag = " + internalBookingFlag);
	 
	 var orgnlmsgnmidPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
     var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
     logger.info("circleNumberSntd:orgnlmsgnmid = " + orgnlmsgnmid);
	 
	 if(!orgnlmsgnmid){
		 var orgnlmsgnmidPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
		 var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
		 logger.info("circleNumberSntd:orgnlmsgnmid = " + orgnlmsgnmid);
	 }
	 
	 if(!orgnlmsgnmid){
		 orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
		 logger.info("circleNumberSntd:orgnlmsgnmid if loop = " + orgnlmsgnmid);
	 }
	 
	 txnType = getHeader(map,"PLCN_txnType");
     logger.info("circleNumberSntd: txnType = " + txnType);
	 
	 derivedProductCode = getHeader(map,"PLCN_productCode");
     logger.info("circleNumberSntd: derivedProductCode = " + derivedProductCode);
	 
	 msgType = getHeader(map, "PLCN_msgType");
	 if(msgType) {
     msgType = msgType.trim();
 	}
	 logger.info("circleNumberSntd: msgType = " + msgType);
  
     msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("circleNumberSntd: msgDirection = " + msgDirection);
	 
	 companyCode1 = getHeader(map,"PLCN_companyCode");
     logger.info("circleNumberSntd: companyCode1 = " + companyCode1);
	 
	 if (!companyCode1){
	    companyCode1 = "    ";
	 }
	 
	 if (msgType == 'pacs.008.001.08' && internalBookingFlag == 'Y'){
	   circleNumber = '5' + companyCode1;
	   setHeader(map, "PLCN_circleNumber", circleNumber);
	   return circleNumber;
	 }
	 
	 if(msgType == 'pacs.008.001.08'){
	    if(derivedProductCode == 'MANUAL_B2B_SCT_OUT'){
		   circleNumber = '2' + companyCode1;
		   setHeader(map, "PLCN_circleNumber", circleNumber);
		   return circleNumber;
		}else{
		   circleNumber = '2' + '999';
		   setHeader(map, "PLCN_circleNumber", circleNumber);
		   return circleNumber;
		}
	 }
	 
	 if(msgType == 'pacs.003.001.08'){
	    if(derivedProductCode == 'MANUAL_SDD_OUT'){
		   circleNumber = '4' + companyCode1;
		   setHeader(map, "PLCN_circleNumber", circleNumber);
		   return circleNumber;
		}else{
		   circleNumber = '4' + '999';
		   setHeader(map, "PLCN_circleNumber", circleNumber);
		   return circleNumber;
		}
	 }
	 
	 if(msgType == 'pacs.004.001.09'){
	   if(msgDirection == 'O'){
	      if(orgnlmsgnmid == 'pacs.008.001.08'){
		      circleNumber = '2' + '999';
		      setHeader(map, "PLCN_circleNumber", circleNumber);
		      return circleNumber;
		  }
		  if(orgnlmsgnmid == 'pacs.003.001.08'){
		      circleNumber = '4' + '999';
		      setHeader(map, "PLCN_circleNumber", circleNumber);
		      return circleNumber;
		  }  
	   }
	   if(msgDirection == 'I'){
	      if(orgnlmsgnmid == 'pacs.008.001.08'){
		      circleNumber = '2' + companyCode1;
		      setHeader(map, "PLCN_circleNumber", circleNumber);
		      return circleNumber;
		  }
		  if(orgnlmsgnmid == 'pacs.003.001.08'){
		      circleNumber = '4' + companyCode1;
		      setHeader(map, "PLCN_circleNumber", circleNumber);
		      return circleNumber;
		  }  
	   }
	 }
}

function ruleEodStatementDecision(exchange,formatLabel) {
	
	var f0031;
	var f0051;
	var f0071;
	var f0032;
	var f0052;
	var f0072;
	
	var txnType;
	var f001Msg;
	var f003Msg;
	var f005Msg;
	var f007Msg;
	var f001EodMsg;
	var f001EodMsg162;
	var f001EodMsg163;
	var f001EodMsg165;
	var f001EodMsg166;
	var eodMsg;
	var fEodMsgDebt;
	var fEodMsgCred;
	var companyCode;
	var sapCr;
	var sapDr;
	var subSapCr;
	var subSapDr;
	var sapCr1;
	var sanctionsSapDr;
	var sanctionsSapCr;
	var sanctionsSubSapCr;
	var sanctionsSubSapDr;
	var f001EodMsgCred;
	var f001EodMsgDebt;
	var subF001EodMsgDebt;
	var subF001EodMsgCred;
	
	var sanctionsF001EodMsgCred;
	var sanctionsF001EodMsgdebt;
	var sanctionsSubF001EodMsgcred;
	var sanctionsSubF001EodMsgdebt;
	
	var sapCrAccounttype;
	var sapCrReceipient;
	var sapDrAccounttype;
	var sapDrReceipient;
	var subSapCrAccounttype;
	var subSapCrReceipient;
	var subSapDrAccounttype;
	var subSapDrReceipient;
	var sanctionsF001EodMsgDebt;
	
	var inMsg = exchange.getIn();
	var	map = inMsg.getHeaders();
	
	f0071 = "F0071";
	f0051 = "F0051";
	f0031 = "F0031";
	
	f0072 = "F0072";
	f0052 = "F0052";
	f0032 = "F0032";
	
	txnType = getHeader(map, "PLCN_txnType");
	if(!txnType ){
		txnType = getHeader(map, "PLCN_transactionType");
	}
	logger.info("ruleEodStatementDecision:  txnType= " +txnType );
	companyCode = getHeader(map, "PLCN_companyCode");
	logger.info("ruleEodStatementDecision:  companyCode= " +companyCode );
	f003Msg = getHeader(map, "PLCN_f003Msg");
	logger.info("ruleEodStatementDecision:f003Msg  = " +f003Msg );
	f005Msg = getHeader(map, "PLCN_f005Msg");
	logger.info("ruleEodStatementDecision: f005Msg = " + f005Msg);
	f007Msg = getHeader(map, "PLCN_f007Msg");
	logger.info("ruleEodStatementDecision: f007Msg" +f007Msg );
	f001EodMsg = getHeader(map, "PLCN_f001EodMsg");
	logger.info("ruleEodStatementDecision: f001EodMsg = " + f001EodMsg);
	sapCr = getHeader(map, "PLCN_sapCr");
	logger.info("ruleEodStatementDecision: sapCr = " +sapCr );
	sapDr = getHeader(map, "PLCN_sapDr");
	logger.info("ruleEodStatementDecision: sapDr = " +sapDr );
	subSapCr = getHeader(map, "PLCN_subSapCr");
	logger.info("ruleEodStatementDecision: subSapCr = " + subSapCr);
	subSapDr = getHeader(map, "PLCN_subSapDr");
	logger.info("ruleEodStatementDecision: subSapDr = " + subSapDr);
	formatLabel = getHeader(map, "PLCN_formatLabel");
	logger.info("ruleEodStatementDecision: formatLabel = " +formatLabel );
	sanctionsSapDr = getHeader(map, "PLCN_sanctionsSapDr");
	logger.info("ruleEodStatementDecision:sanctionsSapDr " + sanctionsSapDr);
	sanctionsSapCr = getHeader(map, "PLCN_sanctionsSapCr");
	logger.info("ruleEodStatementDecision:sanctionsSapCr  = " +sanctionsSapCr );
	sanctionsSubSapCr = getHeader(map, "PLCN_sanctionsSubSapCr");
	logger.info("ruleEodStatementDecision:sanctionsSubSapCr  = " +sanctionsSubSapCr );
	sanctionsSubSapDr = getHeader(map, "PLCN_sanctionsSubSapDr");
	logger.info("ruleEodStatementDecision:sanctionsSubSapDr  = " +sanctionsSubSapDr );
		
	sapCrAccounttype = getHeader(map, "PLCN_sapCrAccounttype");
	logger.info("ruleEodStatementDecision:sapCrAccounttype  = " +sapCrAccounttype );
	sapCrReceipient = getHeader(map, "PLCN_sapCrReceipient");
	logger.info("ruleEodStatementDecision:sapCrReceipient  = " +sapCrReceipient );
	sapDrAccounttype = getHeader(map, "PLCN_sapDrAccounttype");
	logger.info("ruleEodStatementDecision:sapDrAccounttype  = " +sapDrAccounttype );
	sapDrReceipient = getHeader(map, "PLCN_sapDrReceipient");
	logger.info("ruleEodStatementDecision:sapDrReceipient  = " +sapDrReceipient );
	
	subSapCrAccounttype = getHeader(map, "PLCN_subSapCrAccounttype");
	logger.info("ruleEodStatementDecision:subSapCrAccounttype  = " +subSapCrAccounttype );
	subSapCrReceipient = getHeader(map, "PLCN_subSapCrReceipient");
	logger.info("ruleEodStatementDecision:subSapCrReceipient  = " +subSapCrReceipient );
	subSapDrAccounttype = getHeader(map, "PLCN_subSapDrAccounttype");
	logger.info("ruleEodStatementDecision:subSapDrAccounttype  = " +subSapDrAccounttype );
	subSapDrReceipient = getHeader(map, "PLCN_subSapDrReceipient");
	logger.info("ruleEodStatementDecision:subSapDrReceipient  = " +subSapDrReceipient );
	
	sapCr = variableConversionRule(exchange,sapCr,10);
	logger.info("ruleEodStatementDecision:variableConversionRule:sapCr  = " +sapCr );
	sapDr = variableConversionRule(exchange,sapDr,10);
	logger.info("ruleEodStatementDecision:variableConversionRule:sapDr  = " +sapDr );
	subSapCr = variableConversionRule(exchange,subSapCr,10);
	logger.info("ruleEodStatementDecision:variableConversionRule:subSapCr  = " +subSapCr );
	subSapDr = variableConversionRule(exchange,subSapDr,10);
	logger.info("ruleEodStatementDecision:variableConversionRule:subSapDr  = " +subSapDr );
	sanctionsSapCr = variableConversionRule(exchange,sanctionsSapCr,10);
	logger.info("ruleEodStatementDecision:variableConversionRule:sanctionsSapCr  = " +sanctionsSapCr );
	sanctionsSapDr = variableConversionRule(exchange,sanctionsSapDr,10);
	logger.info("ruleEodStatementDecision:variableConversionRule:sanctionsSapDr  = " +sanctionsSapDr );
	sanctionsSubSapCr = variableConversionRule(exchange,sanctionsSubSapCr,10);
	logger.info("ruleEodStatementDecision:variableConversionRule:sanctionsSubSapCr  = " +sanctionsSubSapCr );
	sanctionsSubSapDr = variableConversionRule(exchange,sanctionsSubSapDr,10);
	logger.info("ruleEodStatementDecision:variableConversionRule:sanctionsSubSapDr  = " +sanctionsSubSapDr );

	if(f001EodMsg) {
		f001EodMsgCred = f001EodMsg.replace("PELICAN_SAP_ACCOUNT", sapCr);
	}
	if(f001EodMsgCred){
		f001EodMsgCred = f001EodMsgCred.replace("PELICAN_TRANSACTION_TYPE", "H");
		f001EodMsgCred = f001EodMsgCred.replace("PELICAN_CPD_NAME", sapCrReceipient);
		f001EodMsgCred = f001EodMsgCred.replace("PELICAN_ACCOUNT_TYPE", sapCrAccounttype);
	}
	if(f001EodMsg) {
		f001EodMsgDebt = f001EodMsg.replace("PELICAN_SAP_ACCOUNT", sapDr);
	}
	if(f001EodMsgDebt) {
		f001EodMsgDebt = f001EodMsgDebt.replace("PELICAN_TRANSACTION_TYPE", "S");
		f001EodMsgDebt = f001EodMsgDebt.replace("PELICAN_CPD_NAME", sapDrReceipient);
		f001EodMsgDebt = f001EodMsgDebt.replace("PELICAN_ACCOUNT_TYPE", sapDrAccounttype);
	}
	
	if(f001EodMsg) {
		sanctionsF001EodMsgCred = f001EodMsg.replace("PELICAN_SAP_ACCOUNT", sanctionsSapCr);
	}
	if(sanctionsF001EodMsgCred) {
		sanctionsF001EodMsgCred = sanctionsF001EodMsgCred.replace("PELICAN_TRANSACTION_TYPE", "H");
		sanctionsF001EodMsgCred = sanctionsF001EodMsgCred.replace("PELICAN_CPD_NAME", sapCrReceipient);
		sanctionsF001EodMsgCred = sanctionsF001EodMsgCred.replace("PELICAN_ACCOUNT_TYPE", sapCrAccounttype);
	}

	if(f001EodMsg) {
		sanctionsF001EodMsgdebt = f001EodMsg.replace("PELICAN_SAP_ACCOUNT", sanctionsSapDr);
	}
	if(sanctionsF001EodMsgdebt) {
		sanctionsF001EodMsgdebt = sanctionsF001EodMsgdebt.replace("PELICAN_TRANSACTION_TYPE", "S");
		sanctionsF001EodMsgdebt = sanctionsF001EodMsgdebt.replace("PELICAN_CPD_NAME", sapDrReceipient);
		sanctionsF001EodMsgdebt = sanctionsF001EodMsgdebt.replace("PELICAN_ACCOUNT_TYPE", sapDrAccounttype);
	}
	setHeader(map, "PLCN_f001EodMsgCred", f001EodMsgCred);
	logger.info("ruleEodStatementDecision:Final f001EodMsgCred  = " +f001EodMsgCred );
	setHeader(map, "PLCN_f001EodMsgDebt", f001EodMsgDebt);
	logger.info("ruleEodStatementDecision:Final f001EodMsgDebt  = " +f001EodMsgDebt );
	setHeader(map, "PLCN_sanctionsF001EodMsgCred", sanctionsF001EodMsgCred);
	setHeader(map, "PLCNAPI_sanctionsF001EodMsgCred", sanctionsF001EodMsgCred);
	logger.info("ruleEodStatementDecision:Final sanctionsF001EodMsgCred  = " +sanctionsF001EodMsgCred );
	setHeader(map, "PLCN_sanctionsF001EodMsgDebt", sanctionsF001EodMsgdebt);
	setHeader(map, "PLCNAPI_sanctionsF001EodMsgDebt", sanctionsF001EodMsgdebt);
	logger.info("ruleEodStatementDecision:Final sanctionsF001EodMsgdebt  = " +sanctionsF001EodMsgdebt );
	
	if(companyCode == "043" || companyCode == "044" ){
		if(f001EodMsg) {
			subF001EodMsgCred = f001EodMsg.replace("PELICAN_SAP_ACCOUNT", subSapCr);
		}
		if(subF001EodMsgCred) {
			subF001EodMsgCred = subF001EodMsgCred.replace("PELICAN_TRANSACTION_TYPE", "H");
			subF001EodMsgCred = subF001EodMsgCred.replace("PELICAN_CPD_NAME", subSapCrReceipient);
			subF001EodMsgCred = subF001EodMsgCred.replace("PELICAN_ACCOUNT_TYPE", subSapCrAccounttype);
		}
		if(f001EodMsg) {
			subF001EodMsgDebt = f001EodMsg.replace("PELICAN_SAP_ACCOUNT", subSapDr);
		}
		if(subF001EodMsgDebt) {
			subF001EodMsgDebt = subF001EodMsgDebt.replace("PELICAN_TRANSACTION_TYPE", "S");
			subF001EodMsgDebt = subF001EodMsgDebt.replace("PELICAN_CPD_NAME", subSapDrReceipient);
			subF001EodMsgDebt = subF001EodMsgDebt.replace("PELICAN_ACCOUNT_TYPE", subSapDrAccounttype);
		}
		setHeader(map, "PLCN_subF001EodMsgCred", subF001EodMsgCred);
		setHeader(map, "PLCN_subF001EodMsgDebt", subF001EodMsgDebt);

		if(f001EodMsg) {
			sanctionsSubF001EodMsgCred = f001EodMsg.replace("PELICAN_SAP_ACCOUNT", sanctionsSubSapCr);
		}
		if(sanctionsSubF001EodMsgCred) {
			sanctionsSubF001EodMsgCred = sanctionsSubF001EodMsgCred.replace("PELICAN_TRANSACTION_TYPE", "H");
			sanctionsSubF001EodMsgCred = sanctionsSubF001EodMsgCred.replace("PELICAN_CPD_NAME", subSapCrReceipient);
			sanctionsSubF001EodMsgCred = sanctionsSubF001EodMsgCred.replace("PELICAN_ACCOUNT_TYPE", subSapCrAccounttype);
		}
		if(f001EodMsg) {	
		sanctionsSubF001EodMsgdebt = f001EodMsg.replace("PELICAN_SAP_ACCOUNT", sanctionsSubSapDr);
		}
		if(sanctionsSubF001EodMsgdebt) {
			sanctionsSubF001EodMsgdebt = sanctionsSubF001EodMsgdebt.replace("PELICAN_TRANSACTION_TYPE", "S");
			sanctionsSubF001EodMsgdebt = sanctionsSubF001EodMsgdebt.replace("PELICAN_CPD_NAME", subSapDrReceipient);
			sanctionsSubF001EodMsgdebt = sanctionsSubF001EodMsgdebt.replace("PELICAN_ACCOUNT_TYPE", subSapDrAccounttype);
		}
		setHeader(map, "PLCN_sanctionsSubF001EodMsgCred", sanctionsSubF001EodMsgCred);
		setHeader(map, "PLCN_sanctionsSubF001EodMsgdebt", sanctionsSubF001EodMsgdebt);	
		setHeader(map, "PLCNAPI_sanctionsSubF001EodMsgCred", sanctionsSubF001EodMsgCred);
		setHeader(map, "PLCNAPI_sanctionsSubF001EodMsgdebt", sanctionsSubF001EodMsgdebt);
	}
	
	if(txnType == "C"){
		setHeader(map, "PLCN_fEodMsgDebt", "");
		if(formatLabel == "F014"){
			setHeader(map, "PLCN_fEodMsgCred", f007Msg);
			setHeader(map, "PLCN_eodMsg", f0071);
		}
		
		if(formatLabel == "F013"){
			setHeader(map, "PLCN_fEodMsgCred", f005Msg);
			setHeader(map, "PLCN_eodMsg", f0051);
		}
		
		if(formatLabel == "F012"){
			setHeader(map, "PLCN_fEodMsgCred", f003Msg);
			setHeader(map, "PLCN_eodMsg", f0031);
		}
	} else{
		setHeader(map, "PLCN_fEodMsgCred", "");
		if(formatLabel == "F014"){
			setHeader(map, "PLCN_fEodMsgDebt", f007Msg);
			setHeader(map, "PLCN_eodMsg", f0071);
		}
		
		if(formatLabel == "F013"){
			setHeader(map, "PLCN_fEodMsgDebt", f005Msg);
			setHeader(map, "PLCN_eodMsg", f0051);
		}
		
		if(formatLabel == "F012"){
			setHeader(map, "PLCN_fEodMsgDebt", f003Msg);
			setHeader(map, "PLCN_eodMsg", f0031);
		}
	}
	ruleChargesEodStatementDecision(exchange, formatLabel);
	return 0; 
}

function ruleChargesEodStatementDecision(exchange,formatLabel) {

	var msgtype;
	var trnCodeV3;
	var txntype;
	var fEodMsgCred;
	var fEodMsgDebt;
    var pacs004Charges;
	var chargesF003Msg;
	var chargesF005Msg;
	var chargesF007Msg;
	var chargesF001EodMsg;
	var sapCr;
	var sapDr;
	var subSapCr;
	var subSapDr;
	var chargesSubF001EodMsg;
	var companycode;
	var chargesF001EodMsgCred;
	var chargesSubF001EodMsgCred;
	var chargesF001EodMsgDebt;
	var chargesSubF001EodMsgDebt;
	var chargesEodCred;
	var chargesEodDebt;
	var interbankSettlemtAmt;
	var intrbnkF003Msg;
	var intrbnkF007Msg;
	var intrbnkF005Msg;
	var intrbnkF001EodMsg;
	var intrbnkSubF001EodMsg;
	var intrbnkSubF001EodMsgDebt;
	var intrbnkSubF001EodMsgCred;
	var intrbnkF001EodMsgDebt;
	var intrbnkF001EodMsgCred;
	var trnCodeV3Chg;

	var sapCrAccounttype;
	var sapCrReceipient;
	var sapDrAccounttype;
	var sapDrReceipient;
	var subSapCrAccounttype;
	var subSapCrReceipient;
	var subSapDrAccounttype;
	var subSapDrReceipient;	
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	pacs004Charges = getHeader(map, "PLCN_pacs004Charges");
	interbankSettlemtAmt = getHeader(map, "PLCN_interbankSettlemtAmt");
	msgtype = getHeader(map, "PLCN_msgtype");
	
	if(!(isPatternPresent(msgtype, "pacs.004"))){
		return 0;
	}
	
	if(isPatternPresent(msgtype, "pacs.004") || !pacs004Charges){
		return 0;
	}
	
	sapCr = getHeader(map, "PLCN_sapCr");
	sapDr = getHeader(map, "PLCN_sapDr");
	subSapCr = getHeader(map, "PLCN_subSapCr");
	subSapDr = getHeader(map, "PLCN_subSapDr");
	companycode = getHeader(map, "PLCN_companycode");
	
	sapCrAccounttype = getHeader(map, "PLCN_sapCrAccounttype");
	sapCrReceipient = getHeader(map, "PLCN_sapCrReceipient");
	sapDrAccounttype = getHeader(map, "PLCN_sapDrAccounttype");
	sapDrReceipient = getHeader(map, "PLCN_sapDrReceipient");
	
	subSapCrAccounttype = getHeader(map, "PLCN_subSapCrAccounttype");
	subSapCrReceipient = getHeader(map, "PLCN_subSapCrReceipient");
	subSapDrAccounttype = getHeader(map, "PLCN_subSapDrAccounttype");
	subSapDrReceipient = getHeader(map, "PLCN_subSapDrReceipient");
	
	sapCr = variableConversionRule(exchange,sapCr,10);
	sapDr = variableConversionRule(exchange,sapDr,10);
	subSapCr = variableConversionRule(exchange,subSapCr,10);
	subSapDr = variableConversionRule(exchange,subSapDr,10);
	
	txntype = getHeader(map, "PLCN_txntype");
	
	chargesF003Msg = getHeader(map, "PLCN_chargesF003Msg");
	chargesF005Msg = getHeader(map, "PLCN_chargesF005Msg");
	chargesF007Msg = getHeader(map, "PLCN_chargesF007Msg");
	fEodMsgCred = getHeader(map, "PLCN_fEodMsgCred");
	fEodMsgDebt = getHeader(map, "PLCN_fEodMsgDebt");
	chargesF001EodMsg = getHeader(map, "PLCN_chargesF001EodMsg");
	chargesSubF001EodMsg = getHeader(map, "PLCN_chargesSubF001EodMsg");
	trnCodeV3 = getHeader(map, "PLCN_trnCodeV3");
	trnCodeV3Chg = "CHG";
	
	pacs004Charges = amountConversionRule(exchange, pacs004Charges, 16);
	interbankSettlemtAmt = amountConversionRule(exchange, interbankSettlemtAmt, 16);
	
	intrbnkF003Msg = chargesF003Msg;
	intrbnkF005Msg = chargesF005Msg;
	intrbnkF007Msg = chargesF007Msg;
	
	if(chargesF003Msg) {
		chargesF003Msg = chargesF003Msg.replace("PELICAN_CHARGES_AMOUNT", pacs004Charges);
		chargesF003Msg = chargesF003Msg.replace("PELICAN_TRN_CODE_V3", trnCodeV3Chg);
	}
	if(chargesF005Msg) {
		chargesF005Msg = chargesF005Msg.replace("PELICAN_CHARGES_AMOUNT", pacs004Charges);
		chargesF005Msg = chargesF005Msg.replace("PELICAN_TRN_CODE_V3", trnCodeV3Chg);
	}
	if(chargesF007Msg) {
		chargesF007Msg = chargesF007Msg.replace("PELICAN_CHARGES_AMOUNT", pacs004Charges);
		chargesF007Msg = chargesF007Msg.replace("PELICAN_TRN_CODE_V3", trnCodeV3Chg);
	}
	if(intrbnkF003Msg) {
		intrbnkF003Msg = intrbnkF003Msg.replace("PELICAN_CHARGES_AMOUNT", interbankSettlemtAmt);
		intrbnkF003Msg = intrbnkF003Msg.replace("PELICAN_TRN_CODE_V3", trnCodeV3);
	}
	if(intrbnkF005Msg) {
		intrbnkF005Msg = intrbnkF005Msg.replace("PELICAN_CHARGES_AMOUNT", interbankSettlemtAmt);
		intrbnkF005Msg = intrbnkF005Msg.replace("PELICAN_TRN_CODE_V3", trnCodeV3);
	} 
	if(intrbnkF007Msg) {
		intrbnkF007Msg = intrbnkF007Msg.replace("PELICAN_CHARGES_AMOUNT", interbankSettlemtAmt);
		intrbnkF007Msg = intrbnkF007Msg.replace("PELICAN_TRN_CODE_V3", trnCodeV3);
	}
	chargesF001EodMsg = chargesF001EodMsg.replace("PELICAN_CHARGES_AMOUNT", pacs004Charges);
	chargesSubF001EodMsg = chargesSubF001EodMsg.replace("PELICAN_CHARGES_AMOUNT", pacs004Charges);
	intrbnkF001EodMsg = intrbnkF001EodMsg.replace("PELICAN_CHARGES_AMOUNT", interbankSettlemtAmt);
	intrbnkSubF001EodMsg = intrbnkSubF001EodMsg.replace("PELICAN_CHARGES_AMOUNT", interbankSettlemtAmt);

	chargesF001EodMsgCred = chargesF001EodMsg.replace("PELICAN_TRANSACTION_TYPE", "H");
	chargesF001EodMsgCred = chargesF001EodMsgCred.replace("PELICAN_SAP_ACCOUNT", sapCr);
	
	chargesF001EodMsgDebt = chargesF001EodMsg.replace("PELICAN_TRANSACTION_TYPE", "S");
	chargesF001EodMsgDebt = chargesF001EodMsgDebt.replace("PELICAN_SAP_ACCOUNT", sapDr);
	
	intrbnkF001EodMsgCred = chargesF001EodMsg.replace("PELICAN_TRANSACTION_TYPE", "H");
	intrbnkF001EodMsgDebt = chargesF001EodMsg.replace("PELICAN_TRANSACTION_TYPE", "S");

	chargesSubF001EodMsgCred = chargesSubF001EodMsg.replace("PELICAN_TRANSACTION_TYPE", "H");
	chargesSubF001EodMsgDebt = chargesSubF001EodMsg.replace("PELICAN_TRANSACTION_TYPE", "S");
	
	chargesSubF001EodMsgDebt = chargesSubF001EodMsg.replace("PELICAN_SAP_ACCOUNT", sapDr);
	chargesSubF001EodMsgCred = chargesSubF001EodMsg.replace("PELICAN_SAP_ACCOUNT", sapCr);
	
	intrbnkSubF001EodMsgCred = intrbnkSubF001EodMsg.replace("PELICAN_TRANSACTION_TYPE", "H");
	intrbnkSubF001EodMsgDebt = intrbnkSubF001EodMsg.replace("PELICAN_TRANSACTION_TYPE", "S");

	chargesF001EodMsgCred = chargesF001EodMsgCred.replace("PELICAN_CPD_NAME", sapCrReceipient);
	chargesF001EodMsgCred = chargesF001EodMsgCred.replace("PELICAN_ACCOUNT_TYPE", sapCrAccounttype);
	
	chargesSubF001EodMsgCred = chargesSubF001EodMsgCred.replace("PELICAN_CPD_NAME", sapSubCrReceipient);
	chargesSubF001EodMsgCred = chargesSubF001EodMsgCred.replace("PELICAN_ACCOUNT_TYPE", subSapCrAccounttype);
	
	chargesF001EodMsgDebt = chargesF001EodMsgDebt.replace("PELICAN_CPD_NAME", sapDrReceipient);
	chargesF001EodMsgDebt = chargesF001EodMsgDebt.replace("PELICAN_ACCOUNT_TYPE", sapDrAccounttype);
	
	chargesSubF001EodMsgDebt = chargesSubF001EodMsgDebt.replace("PELICAN_CPD_NAME", sapSubDrReceipient);
	chargesSubF001EodMsgDebt = chargesSubF001EodMsgDebt.replace("PELICAN_ACCOUNT_TYPE", subSapDrAccounttype);
	
	setHeader(map, "PLCN_chargesF001EodMsgCred", chargesF001EodMsgCred);
	setHeader(map, "PLCN_chargesF001EodMsgDebt", chargesF001EodMsgDebt);
	setHeader(map, "PLCN_chargesSubF001EodMsgCred", chargesF001EodMsgCred);
	setHeader(map, "PLCN_chargesSubF001EodMsgDebt", chargesF001EodMsgDebt);
	
	if(txntype == "C"){
		setHeader(map, "PLCN_chargesF001EodMsgCred", chargesF001EodMsgCred);
		
		if(companycode == "043" || companycode == "044"){
			setHeader(map, "PLCN_chargesSubF001EodMsgCred", chargesSubF001EodMsgCred);
		}
		
		if(formatLabel == "F014"){
			chargesEodCred = intrbnkF007Msg + "\n" + chargesF007Msg;
			setHeader(map, "PLCN_fEodMsgCred", chargesEodCred);
			
		}
		if(formatLabel == "F013"){
			chargesEodCred = intrbnkF005Msg + "\n" + chargesF005Msg;
			setHeader(map, "PLCN_fEodMsgCred", chargesEodCred);
			
		}
		if(formatLabel == "F012"){
			chargesEodCred = intrbnkF003Msg + "\n" + chargesF003Msg;
			setHeader(map, "PLCN_fEodMsgCred", chargesEodCred);
		}
	}else{
		setHeader(map, "PLCN_chargesF001EodMsgDebt", chargesF001EodMsgDebt);
		
		if(companycode == "043" || companycode == "044"){
			setHeader(map, "PLCN_chargesSubF001EodMsgDebt", chargesSubF001EodMsgDebt);
		}
		
		if(formatLabel == "F014"){
			chargesEodDebt = intrbnkF007Msg + "\n" + chargesF007Msg;
			setHeader(map, "PLCN_fEodMsgDebt", chargesEodDebt);
		}
		if(formatLabel == "F013"){
			chargesEodDebt = intrbnkF005Msg + "\n" + chargesF005Msg;
			setHeader(map, "PLCN_fEodMsgDebt", chargesEodDebt);
		}
		if(formatLabel == "F012"){
			chargesEodDebt = intrbnkF003Msg + "\n" + chargesF003Msg;
			setHeader(map, "PLCN_fEodMsgDebt", chargesEodDebt);
		}
	}
}

function ruleEodStatementExceptions(exchange) {

	var fEodMsgDebt;
	var fEodMsgCred;
	var subF001EodMsgDebt;
	var subF001EodMsgCred;
	var f001EodMsgDebt;
	var f001EodMsgCred;
	var txntype;
	var msgDirection;
	var messageClassType;
	var productCode;
	var txnGrp;
	var eodOrgMessageclasstype;
	var formatLabel;
	var orgnlmsgnmid;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	logger.info("in ruleEodStatementExceptions" );
	
	eodOrgMessageclasstype = getHeader(map, "PLCN_eodOrgMessageclasstype");
	logger.info("ruleEodStatementExceptions:Final eodOrgMessageclasstype  = " +eodOrgMessageclasstype );
	fEodMsgDebt = getHeader(map, "PLCN_fEodMsgDebt");
	logger.info("ruleEodStatementExceptions:Final fEodMsgDebt  = " +fEodMsgDebt );
	fEodMsgCred = getHeader(map, "PLCN_fEodMsgCred");
	logger.info("ruleEodStatementExceptions:Final fEodMsgCred  = " +fEodMsgCred );
	subF001EodMsgDebt = getHeader(map, "PLCN_subF001EodMsgDebt");
	logger.info("ruleEodStatementExceptions:Final subF001EodMsgDebt  = " +subF001EodMsgDebt );
	subF001EodMsgCred = getHeader(map, "PLCN_subF001EodMsgCred");
	logger.info("ruleEodStatementExceptions:Final subF001EodMsgCred  = " +subF001EodMsgCred );
	f001EodMsgDebt = getHeader(map, "PLCN_f001EodMsgDebt");
	logger.info("ruleEodStatementExceptions:Final f001EodMsgDebt  = " +f001EodMsgDebt );
	f001EodMsgCred = getHeader(map, "PLCN_f001EodMsgCred");
	logger.info("ruleEodStatementExceptions:Final f001EodMsgCred  = " +f001EodMsgCred );
	txntype = getHeader(map, "PLCN_txntype");
	logger.info("ruleEodStatementExceptions:Final txntype  = " +txntype );
	msgDirection = getHeader(map, "PLCN_msgDirection");
	logger.info("ruleEodStatementExceptions:Final msgDirection  = " +msgDirection );
	messageClassType = getHeader(map, "PLCN_messageClassType");
	logger.info("ruleEodStatementExceptions:Final messageClassType  = " +messageClassType );
	txnGrp = getHeader(map, "PLCN_txnGrp");
	logger.info("ruleEodStatementExceptions:Final txnGrp  = " +txnGrp );
	formatLabel = getHeader(map, "PLCN_formatLabel");
	logger.info("ruleEodStatementExceptions:Final formatLabel  = " +formatLabel );
	orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
	logger.info("ruleEodStatementExceptions:Final orgnlmsgnmid  = " +orgnlmsgnmid );
	
	if(!messageClassType){
		messageClassType = getHeader(map, "PLCN_MsgType");	
	}
	logger.info("ruleEodStatementExceptions:Final messageClassType  = " +messageClassType );
	productCode = getHeader(map, "PLCN_productCode");
	logger.info("ruleEodStatementExceptions:Final productCode  = " +productCode );
	
	if(txnGrp == "CT" && isPatternPresent(messageClassType, "pacs.008") && (productCode == "OB-PCS-MSG-IN" || productCode == "OB-DOLPHIN-MSG-IN" || productCode == "OB-LEASE-MSG-IN")){
		setHeader(map, "PLCN_fEodMsgDebt", "");
	}
	
	if(isPatternPresent(messageClassType, "pacs.008") && (productCode == "OB-PCS-MSG-IN" || productCode == "OB-DOLPHIN-MSG-IN" || productCode == "OB-LEASE-MSG-IN")){
		setHeader(map, "PLCN_fEodMsgDebt", "");
	}
	
	if(isPatternPresent(eodOrgMessageclasstype, "camt.056") && isPatternPresent(messageClassType, "pacs.004") && isPatternPresent(formatLabel, "F012")){
		setHeader(map, "PLCN_fEodMsgDebt", "");
	}
	
	if(messageClassType == "202" && msgDirection == "I"){
		setHeader(map, "PLCN_fEodMsgDebt", "");
		setHeader(map, "PLCN_fEodMsgCred", "");
	}
	
	if(productCode == "OB-DINERO-MSG-IN"){
		
		if(isPatternPresent(messageClassType, "pacs.003")){
			//setHeader(map, "PLCN_STATUSASD", "N");
			setHeader(map, "PLCN_statusasd", "N");
		}
		
		if(isPatternPresent(messageClassType, "pacs.008")){
			setHeader(map, "PLCN_fEodMsgDebt", "");
			setHeader(map, "PLCN_fEodMsgCred", "");
		}
	}
	
	if(formatLabel == "F012" && isPatternPresent(messageClassType, "pacs.003") && msgDirection == "O"){
		setHeader(map, "PLCN_fEodMsgDebt", "");
		setHeader(map, "PLCN_fEodMsgCred", "");
	}
	
	if(msgDirection == "I" && isPatternPresent(messageClassType, "pacs.004")&& (isPatternPresent(orgnlmsgnmid, "pacs.003") || isPatternPresent(orgnlmsgnmid, "pacs.008")) && !(isPatternPresent(eodOrgMessageclasstype, "camt.056"))){
		setHeader(map, "PLCN_fEodMsgDebt", "");
		setHeader(map, "PLCN_fEodMsgCred", "");
		setHeader(map, "PLCN_subF001EodMsgDebt", "");
		setHeader(map, "PLCN_subF001EodMsgCred", "");
	}
	return 0;
}

function correctionCustom24(exchange){
	var custom24;
	var releasetime;
	var releasedate;
	var releasedatetime;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In correctionCustom24");
	
	custom24 = getHeader(map, "PLCN_custom24");
	logger.info("correctionCustom24: custom24" + custom24);
	
	if(!custom24 && isPatternPresent(custom24, ".")){
		if(custom24) {
			releasetime = custom24.substr(11, 8);
		}
		if(releasetime) {
			releasetime = releasetime.removePattern(":");
			releasetime = releasetime.removePattern(":");
		}
		if(custom24) {
			releasedate = custom24.substr(0, 10);
		}
		if(releasedate) {
			releasedate = releasedate.removePattern("-");
			releasedate = releasedate.removePattern("-");
			releasedate = convertDateFormat(releasedate, "CCYYMMDD", "MMDDCCYY");
			releasedate = releasedate.substr(0,2) + "/" + releasedate.substr(2,2) + "/" + releasedate.substr(4,4);
			releasedatetime = releasedate + " " + releasetime;
		}

		logger.info("correctionCustom24: releasedatetime" + releasedatetime);
		setHeader(map, "PLCN_custom24", releasedatetime);
	}
}

function amountConversionRule(exchange,hdrVar,digits) { 
	var noOfZeros;
	var k;
	var condition;
	var hdrVarLen;
	var a;
	var b;
	var c;
	var x;
	var m;
	
	a = 1;
	k = 1;
	logger.info("Inside amountConversionRule");
	hdrVarLen = hdrVar.length();
	m = hdrVar.length();
	m = m + 1;
	
	if(hdrVar && isPatternPresent(hdrVar, ",")){
		hdrVar = hdrVar.replace("," ,".");
	}
	logger.info("amountConversionRule: Amount after replace = " + hdrVar);
	
/* 	if(!(isPatternPresent(hdrVar, "."))){
		logger.info("amountConversionRule:inside dot insertion loop");
		hdrVar = hdrVar + ".00";
	} */
	
	if(isAllDigits(hdrVar)){
		logger.info("amountConversionRule:inside dot insertion IF loop");
		hdrVar = hdrVar + ".00";
	}else{
		logger.info("amountConversionRule:inside dot insertion ELSE loop");
		//hdrVar = hdrVar + ".00";
	}
	logger.info("amountConversionRule: Amount after inserting dot = " + hdrVar);
	
	
	while(k < m){
		if(hdrVar) {
			b = hdrVar.substr(a,1);//strSub(hdrVar, a, 1);
		}
		if(b == "."){
			x = hdrVarLen - a;
			x = x+1;
			if(hdrVar) {
				c = hdrVar.substr(a,x);  //strSub(hdrVar, a, x);
			}
			if(c.length == 2){
				hdrVar = hdrVar + "0";
			}
		}
		a= a+1;
		k= k+1;
	}
	hdrVar = cleanString(hdrVar);
	noOfZeros = digits - (hdrVar.length);
	condition = noOfZeros + 1;
	
	k = 1;
	while(k<condition){
		hdrVar = "0" + hdrVar;
		k= k+1;
	}
	return hdrVar;
}

function routeRulePacsSntd(exchange){
	
	var messageclasstype;	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	messageclasstype = getHeader(map, "PLCN_msgtype");
	
	if(messageclasstype == "pacs.008.001.08"){
		return "PACS008";
	}
	
	if(messageclasstype == "pacs.003.001.08"){
		return "PACS003";
	}
	
	if(messageclasstype == "pacs.004.001.09"){
		return "PACS004";
	}
	
	if(messageclasstype == "camt.056.001.01"){
		return "CAMT056";
	}
	
	if(messageclasstype == "camt.029.001.03"){
		return "CAMT029";
	}
	
	if(messageclasstype == "pacs.007.001.02"){
		return "PACS007";
	}
}

function eodSapGeneration(exchange){
	
	var sapCr;
	var sapCr;
	var subSapCr;
	var subSapDr;
	var sapCredit;
	var sapDebit;
	var formatLabel1;
	var txntype;
	var flowQueueid;
	var companyCode1;
	var mainCc;
	var subCc;
	var clearingAccount;
	var aggregateflag;
	var nostroAccount;
	var eodIban;
	var eodIbanDummy;
	var eodIbanLength;
	var eodOrgMessageclasstype;
	var msgtype;
	var sapaccountLength;
	var sapaccountDummy;
	var msgDirection;
	var orgnlmsgnmid;
	var sapaccount;
	
	 inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 logger.info("In eodSapGeneration ");
	 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
	 logger.info("eodSapGeneration:msgDirection " + msgDirection);
	 msgtype = getHeader(map, "PLCN_msgtype");
	 logger.info("eodSapGeneration:msgtype " + msgtype);
	 
	 var orgnlmsgnmidPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
     var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
     logger.info("eodSapGeneration:orgnlmsgnmid = " + orgnlmsgnmid);
	 
	 if(!orgnlmsgnmid){
		 var orgnlmsgnmidPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
		 var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
		 logger.info("eodSapGeneration:orgnlmsgnmid = " + orgnlmsgnmid);
	 }
	 
	 if(!orgnlmsgnmid){
		 orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
		 logger.info("eodSapGeneration:orgnlmsgnmid if loop = " + orgnlmsgnmid);
	 }
	 
	eodOrgMessageclasstype = getHeader(map, "PLCN_eodOrgMessageclasstype");
	logger.info("eodSapGeneration:eodOrgMessageclasstype " + eodOrgMessageclasstype);
	eodIban = getHeader(map, "PLCN_eodIban");
	logger.info("eodSapGeneration:eodIban " + eodIban);
	sapaccount = getHeader(map, "PLCN_sapaccount");
	logger.info("eodSapGeneration:sapaccount " + sapaccount);
	txntype = getHeader(map, "PLCN_txnType");
	logger.info("eodSapGeneration:txntype " + txntype);
	
	if(!txntype){
		txntype = getHeader(map, "PLCN_transactiontype");
	}
	
	formatLabel1 = getHeader(map, "PLCN_formatLabel");
	logger.info("eodSapGeneration:formatLabel1 " + formatLabel1);
	companyCode1 = getHeader(map, "PLCN_companycode1");
	logger.info("eodSapGeneration:companyCode1 " + companyCode1);
	if(!companyCode1){
		companyCode1 = getHeader(map,"PLCN_companyCode");
		logger.info("eodSapGeneration:companyCode1 " + companyCode1);
	}
	nostroAccount = getHeader(map, "PLCN_glNostroAccount");
	logger.info("eodSapGeneration:nostroAccount " + nostroAccount);
	
	if(formatLabel1 == "F011"){
		sapaccountDummy = sapaccount;
		sapaccountDummy = cleanString(sapaccountDummy);
		sapaccountLength = sapaccountDummy.length();
		sapaccountLength = sapaccountLength - 10;
		sapaccountLength = sapaccountLength + 1;
		clearingAccount = sapaccountDummy.substr(sapaccountLength,10);
	}
	
	/* if(formatLabel1 == "F012"){
		if(isPatternPresent(msgtype, "pacs.003")){
			if(isPatternPresent(msgDirection, "O")){
				clearingAccount = "581925";				
			}else{
				clearingAccount = "550269";
			}
		}
	} */
	
	if(formatLabel1 == "F012"){
		if(isPatternPresent(msgtype, "pacs.003") && isPatternPresent(msgDirection, "O")){
				clearingAccount = "581925";
				logger.info("eodSapGeneration:clearingAccount if = " + clearingAccount);
			}else{
				clearingAccount = "550269";
				logger.info("eodSapGeneration:clearingAccount else = " + clearingAccount);
			}
	}
	if(formatLabel1 == "F013"){
		clearingAccount = "714204";
	}
	if(formatLabel1 == "F014"){
		clearingAccount = "321170";
	}

	if(companyCode1 == "043"){
		mainCc = "210005";
		subCc = "723700";
	}
	if(companyCode1 == "044"){
		mainCc = "331101";
		subCc = "723744";
	}

	if(txntype == "D"){
		if(companyCode1 == "001"){
			if(formatLabel1 == "F012" && isPatternPresent(eodOrgMessageclasstype, "camt.056")){
				setHeader(map, "PLCN_sapDr", "581925");
				setHeader(map, "PLCN_sapCr", nostroAccount);
			}else{
				if(msgDirection == "I" && isPatternPresent(msgtype, "pacs.004") && (isPatternPresent(orgnlmsgnmid, "pacs.008") || isPatternPresent(orgnlmsgnmid, "pacs.003")) && !(isPatternPresent(eodOrgMessageclasstype, "camt.056")) ){
					setHeader(map, "PLCN_sapDr", "581025");
					setHeader(map, "PLCN_sapCr", nostroAccount);
				}else{
					setHeader(map, "PLCN_sapDr", clearingAccount);
					setHeader(map, "PLCN_sapCr", nostroAccount);
				}
			}
		}
		if(companyCode1 == "043" || companyCode1 == "044"){
			if(formatLabel1 == "F012" && isPatternPresent(eodOrgMessageclasstype, "camt.056")){
				   	setHeader(map, "PLCN_sapDr", mainCc);
					setHeader(map, "PLCN_SubsapCr", subCc);
					setHeader(map, "PLCN_SubsapDr", "581925");
					setHeader(map, "PLCN_sapCr", nostroAccount);
			}else{ 
				if(msgDirection == "I" && isPatternPresent(msgtype, "pacs.004") && (isPatternPresent(orgnlmsgnmid, "pacs.008") || isPatternPresent(orgnlmsgnmid, "pacs.003")) && !(isPatternPresent(eodOrgMessageclasstype, "camt.056")) ){
				   	setHeader(map, "PLCN_sapDr", mainCc);
					setHeader(map, "PLCN_SubsapCr", subCc);
					setHeader(map, "PLCN_SubsapDr", "581025");
					setHeader(map, "PLCN_sapCr", nostroAccount);
				}else{
				   	setHeader(map, "PLCN_sapDr", mainCc);
					setHeader(map, "PLCN_SubsapCr", subCc);
					setHeader(map, "PLCN_SubsapDr", clearingAccount);
					setHeader(map, "PLCN_sapCr", nostroAccount);
				}
			}
		}
		if(companyCode1 == "001"){
			if(formatLabel1 == "F011" || (formatLabel1 == "F012" && isPatternPresent(eodOrgMessageclasstype, "camt.056") )){
				aggregateflag = "CR-AGG";
				setHeader(map, "PLCN_aggregateFlag", aggregateflag);
			}else{
				aggregateflag = "BOTH-AGG";
				setHeader(map, "PLCN_aggregateFlag", aggregateflag);
			}
		}
		if(companyCode1 == "043" || companyCode1 == "044"){
			if(formatLabel1 == "F011" || (formatLabel1 == "F012" && isPatternPresent(eodOrgMessageclasstype, "camt.056") )){
				aggregateflag = "CR-AGG";
				setHeader(map, "PLCN_aggregateFlag", aggregateflag);
			}else{
				aggregateflag = "BOTH-AGG";
				setHeader(map, "PLCN_aggregateFlag", aggregateflag);
			}
		}
	}
	if(txntype == "C"){
		if(companyCode1 == "001"){
			if(formatLabel1 == "F012" && isPatternPresent(eodOrgMessageclasstype, "camt.056")){
				setHeader(map, "PLCN_sapCr", "581925");
				setHeader(map, "PLCN_sapDr", nostroAccount);
			}else{
				if(msgDirection == "I" && isPatternPresent(msgtype, "pacs.004") && (isPatternPresent(orgnlmsgnmid, "pacs.008") || isPatternPresent(orgnlmsgnmid, "pacs.003")) && !(isPatternPresent(eodOrgMessageclasstype, "camt.056")) ){
					setHeader(map, "PLCN_sapCr", "581025");
					setHeader(map, "PLCN_sapDr", nostroAccount);
				}else{
					setHeader(map, "PLCN_sapCr", clearingAccount);
					setHeader(map, "PLCN_sapDr", nostroAccount);
				}
			}
		}
		if(companyCode1 == "043" || companyCode1 == "044"){
			if(formatLabel1 == "F012" && isPatternPresent(eodOrgMessageclasstype, "camt.056")){
				   	setHeader(map, "PLCN_sapCr", mainCc);
					setHeader(map, "PLCN_SubsapDr", subCc);
					setHeader(map, "PLCN_SubsapCr", "581925");
					setHeader(map, "PLCN_sapDr", nostroAccount);
			}else{ 
				if(msgDirection == "I" && isPatternPresent(msgtype, "pacs.004") && (isPatternPresent(orgnlmsgnmid, "pacs.008") || isPatternPresent(orgnlmsgnmid, "pacs.003")) && !(isPatternPresent(eodOrgMessageclasstype, "camt.056")) ){
				   	setHeader(map, "PLCN_sapCr", mainCc);
					setHeader(map, "PLCN_SubsapDr", subCc);
					setHeader(map, "PLCN_SubsapCr", "581025");
					setHeader(map, "PLCN_sapDr", nostroAccount);
				}else{
				   	setHeader(map, "PLCN_sapCr", mainCc);
					setHeader(map, "PLCN_SubsapDr", subCc);
					setHeader(map, "PLCN_SubsapCr", clearingAccount);
					setHeader(map, "PLCN_sapDr", nostroAccount);
				}
			}
		}
		if(companyCode1 == "001"){
			if(formatLabel1 == "F011" || (formatLabel1 == "F012" && isPatternPresent(eodOrgMessageclasstype, "camt.056") )){
				aggregateflag = "DR-AGG";
				setHeader(map, "PLCN_aggregateFlag", aggregateflag);
			}else{
				aggregateflag = "BOTH-AGG";
				setHeader(map, "PLCN_aggregateFlag", aggregateflag);
			}
		}
		if(companyCode1 == "043" || companyCode1 == "044"){
			if(formatLabel1 == "F011" || (formatLabel1 == "F012" && isPatternPresent(eodOrgMessageclasstype, "camt.056") )){
				aggregateflag = "DR-AGG";
				setHeader(map, "PLCN_aggregateFlag", aggregateflag);
			}else{
				aggregateflag = "BOTH-AGG";
				setHeader(map, "PLCN_aggregateFlag", aggregateflag);
			}
		}
	}
}

function sepaCheckManualRepair(exchange){
   var txnComments;
   var msgDirection;
   var iban;
   var eodIban;
   var formatLabel;
   var msgType;
   var orgnlmsgnmid;
   var commentsforBlob6;
   var inMsg;
   var map;
   var readMsgdb;
   var Document;
   
     inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	 
	 body = inMsg.getBody(java.lang.String.class);
	 logger.info("sepaCheckManualRepair: body = " + body);
	 
	 msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("sepaCheckManualRepair: msgDirection = " + msgDirection);
	 
	msgType = getHeader(map, "PLCN_msgType");
     msgType = msgType.trim();
     logger.info("sepaCheckManualRepair: msgType = " + msgType);
	
	if(msgType == 'pacs.004.001.09'){
	var orgnlmsgnmidPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
     var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
	}
	 if(!orgnlmsgnmid){
		 orgnlmsgnmid = dataBetweenTokens("<OrgnlMsgNmId>","</OrgnlMsgNmId>", body);
	 }
	 logger.info("sepaCheckManualRepair:orgnlmsgnmid = " + orgnlmsgnmid);
	 setHeader(map, "PLCN_orgnlmsgnmid", orgnlmsgnmid);
	 
	 if(msgType == 'camt.056.001.08' ||  msgType == 'pacs.007.001.09' || msgType == 'camt.029.001.09'){
		 return false;
	 }
	 
	 if(msgDirection == 'I'){
		if(msgType == 'pacs.003.001.08') {
			iban = getHeader(map, "PLCN_acctNumber");
			logger.info("sepaCheckManualRepair:iban for pacs003 from PLCN_acctNumber= " + iban);
			if(!iban){
					iban = getHeader(map, "PLCN_msgTransDebitor");
			}
			logger.info("sepaCheckManualRepair:iban for pacs003 = " + iban);
			setHeader(map, "PLCN_eodIban", iban);
		}
		if(msgType == 'pacs.008.001.08') {
			iban = getHeader(map, "PLCN_accountNumber");
			if(!iban){
					iban = getHeader(map, "PLCN_msgTransDebitor");
			}
			logger.info("sepaCheckManualRepair:iban for pacs008 = " + iban);
			setHeader(map, "PLCN_eodIban", iban);
		}
		if(msgType == 'pacs.004.001.09'){
			if(orgnlmsgnmid == 'pacs.008.001.08'){
			   iban = getHeader(map, "PLCN_accountCr");
			   logger.info("sepaCheckManualRepair:iban = " + iban);
			   setHeader(map, "PLCN_eodIban", iban)
			   if(!iban){
				 iban = getHeader(map, "PLCN_msgTransCreditor");
				 logger.info("sepaCheckManualRepair:iban = " + iban);
			   }
			}
			if(orgnlmsgnmid == 'pacs.003.001.08'){
			   iban = getHeader(map, "PLCN_accountDr");
			   logger.info("sepaCheckManualRepair:iban = " + iban);
			   setHeader(map, "PLCN_eodIban", iban)
			   if(!iban){
				 iban = getHeader(map, "PLCN_msgTransDebitor");  
				 logger.info("sepaCheckManualRepair:iban = " + iban);
			   }
			}
		}
	 }
	 
	 if(msgDirection == 'O'){
		if(msgType == 'pacs.008.001.08') {
			logger.info("sepaCheckManualRepair:IB PACS008 ");
			iban = getHeader(map, "PLCN_internalIban");
			logger.info("sepaCheckManualRepair:IB PACS008 IBAN " + iban);
			if(!iban){
					iban = getHeader(map, "PLCN_msgTransCreditor");
			}
			logger.info("sepaCheckManualRepair:iban for pacs008 = " + iban);
			setHeader(map, "PLCN_eodIban", iban);
		}
		if(msgType == 'pacs.003.001.08') {
			iban = getHeader(map, "PLCN_accountNumber");
			logger.info("sepaCheckManualRepair:iban for pacs003 from PLCN_accountNumber= " + iban);
			if(!iban){
					iban = getHeader(map, "PLCN_msgTransDebitor");
					logger.info("sepaCheckManualRepair:iban for pacs003 from PLCN_msgTransDebitor= " + iban);
			}
			setHeader(map, "PLCN_eodIban", iban);
			logger.info("sepaCheckManualRepair:iban for pacs003 = " + iban);
		}
		if(msgType == 'pacs.004.001.09'){
			if(orgnlmsgnmid == 'pacs.008.001.08'){
			   iban = getHeader(map, "PLCN_accountDr");
			   logger.info("sepaCheckManualRepair:iban from PLCN_accountDr = " + iban);
			   setHeader(map, "PLCN_eodIban", iban)
			   if(!iban){
				 iban = getHeader(map, "PLCN_msgTransDebitor");  
				 logger.info("sepaCheckManualRepair:iban from PLCN_msgTransDebitor = " + iban);
				 setHeader(map, "PLCN_eodIban", iban)
			   }
			   if(!iban){
				 var ibanPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN';
				 var iban = getValueFromPath(Document, ibanPath);
				 logger.info("sepaCheckManualRepair:iban from Path= " + iban);
				 setHeader(map, "PLCN_eodIban", iban)
			   }
			   
			}
			if(orgnlmsgnmid == 'pacs.003.001.08'){
			   iban = getHeader(map, "PLCN_accountCr");
			   logger.info("sepaCheckManualRepair:iban = " + iban);
			   setHeader(map, "PLCN_eodIban", iban)
			   if(!iban){
				 iban = getHeader(map, "PLCN_msgTransCreditor"); 
                 logger.info("sepaCheckManualRepair:iban = " + iban);
				 setHeader(map, "PLCN_eodIban", iban)				 
			   }
			   if(!iban){
				 var ibanPath = '/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN';
				 var iban = getValueFromPath(Document, ibanPath);
				 logger.info("sepaCheckManualRepair:iban from Path= " + iban);
				 setHeader(map, "PLCN_eodIban", iban)
			   }
			}
		}
	 }
	  logger.info("sepaCheckManualRepair:iban = " + iban);
	 formatLabel = backoffdrvaccFromIban(exchange,iban);
	 setHeader(map, "PLCN_sourceSys", iban);
	 var sddbank;
	 var sddcustomer;
	 sddbank = getHeader(map, "PLCN_sddbank");
	 sddcustomer = getHeader(map, "PLCN_sddcustomer");
	 if(msgType == 'pacs.003.001.08' && msgDirection == 'O'){
		if((sddbank == "" || sddbank == " " || sddbank == "N")&&(sddcustomer == "" || sddcustomer == " " || sddcustomer == "N")){
			if(formatLabel){
				return formatLabel;
			}
		}else{
			retVal = setCommentsForTransaction("00", "6938", map);
			return "J";
		}
	 }
	 if(isPatternPresent(msgType, "pacs.004") && msgDirection == 'I' && !formatLabel){
		 logger.info("sepaCheckManualRepair: inside if loop")
		 retVal = setCommentsForTransaction("00", "6939", map);
		 var txnComments = getHeader(map, "PLCN_txnComments");
		 logger.info("sepaCheckManualRepair: comments =" + txnComments);
         return "X"	;	 
		 
	 }
	 txnComments = getHeader(map, "PLCN_txnComments")
	 if(!formatLabel){
	 	logger.info("sepaCheckManualRepair: inside if loop")
		 retVal = setCommentsForTransaction("00", "8990", map);
		 var txnComments = getHeader(map, "PLCN_txnComments");
		 logger.info("sepaCheckManualRepair: comments =" + txnComments);
	 }
     if(!formatLabel || isPatternPresent(txnComments, "5713")||isPatternPresent (txnComments, "5714")|| isPatternPresent (txnComments, "5766")|| isPatternPresent (txnComments, "5771")||isPatternPresent (txnComments, "5772")||isPatternPresent (txnComments, "5774")|| isPatternPresent (txnComments, "5823")|| isPatternPresent (txnComments, "8023")|| isPatternPresent (txnComments, "8053")|| isPatternPresent (txnComments, "1552")){
		setHeader(map, "PLCN_txnComments", txnComments); 
		return "T";
	 }else{
		 return formatLabel;
	 }
}

function backoffdrvaccFromIban(exchange, iban) {
	var baseIban;
	var fld;
	var flag;
	var secLvl;
	var runEnv;
	var formatLabel;
	var account;
	var companycode;
	var sapaccount;
	var accounttype;
	var receipient;
	var status1;
	var sddcustomer;
	var sddbank;
	var derivedProduct;
	var prevqueueid;
	var internalBookingFlag;
	var parseRequest;
	var value;
	var temp;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var body = inMsg.getBody(java.lang.String.class);
	
	logger.info("Inside backoffdrvaccFromIbanRule");
	
	 flag = "f";
	 fld = "73";
	 secLvl = "SECURITY=HIGH";
	 runEnv = "BACKOFFSYS-RUN";
	 baseIban = "IBAN " + iban;
	 key = ":SYSTEM-ID|:ACCOUNT|:COMPANYCODE|:SAPACCOUNT|:ACCOUNTTYPE|:RECEIPIENT|:STATUS|:SDDCUSTOMER|:SDDBANK";
	 
	 
	 internalBookingFlag = getHeader(map, "PLCN_internalBookingFlag");
	 logger.info("backoffdrvaccFromIban: internalBookingFlag = " + internalBookingFlag);
	 derivedProduct = getHeader(map, "PLCN_productCode");
	 logger.info("backoffdrvaccFromIban: derivedProduct = " + derivedProduct);
	 
	 if(isPatternPresent(derivedProduct,"OB-SEPA-CT-IN") || isPatternPresent(derivedProduct,"OB-MX-PAY-PELMAN") || isPatternPresent(derivedProduct,"OB_SWIFT_IN") ||isPatternPresent(derivedProduct,"OB-SEPA-DDR-IN") || isPatternPresent(derivedProduct, "OB-SEPA-DD-IN") ||isPatternPresent(derivedProduct,"OB-SEPA-DD-RTR-IN")|| isPatternPresent(derivedProduct,"OB-PCS-MSG-IN")||isPatternPresent(derivedProduct,"MANUAL_B2B_SCT_OUT")||isPatternPresent(derivedProduct,"MANUAL_SDD_OUT")|| isPatternPresent(derivedProduct,"MANUAL_FIN_OUT")||isPatternPresent(derivedProduct,"MANUAL_FIN_FIT_OUT")||isPatternPresent(derivedProduct,"IB-SEPA-CT-IN")||isPatternPresent(derivedProduct,"IB_SWIFT_IN")||isPatternPresent(derivedProduct,"IB-SEPA-DDR-IN")||isPatternPresent(derivedProduct,"IB-SEPA-DD-IN")||isPatternPresent(derivedProduct,"IB-SEPA-DD-RTR-IN")||isPatternPresent(derivedProduct,"MANUAL_SEPA_R_OUT")||isPatternPresent(derivedProduct,"OB-DOLPHIN-MSG-IN")||isPatternPresent(derivedProduct,"SAP-MSG-IN")||isPatternPresent(derivedProduct,"OB-LEASE-MSG-IN")||isPatternPresent(derivedProduct,"OB-DINERO-MSG-IN")||isPatternPresent(derivedProduct,"MANUAL_HIGH_AMT_OUT") || isPatternPresent(derivedProduct,"OB-MX-RET-PELMAN") || isPatternPresent(derivedProduct,"OB-MX-DEB-PELMAN") ){

		 logger.info("Inside backoffdrvaccFromIbanRule:Before parseFieldJs");
		 parseFieldJs(exchange,fld,baseIban, secLvl, runEnv,key);
		 parseRequest = getHeader(map, "PLCN_ParseRequest");
		 logger.info("backoffdrvaccFromIban: parseRequest = " + parseRequest);
		 var hdrMap = inMsg.getHeaders();

		var executeRoute = new ExecuteCamelRoute();
		executeRoute.callRouteWithHeader('direct://ParseAccMaster', parseRequest, new HashMap());
		var outHdrMap = executeRoute.getOutputHeader();
		var outmsg = executeRoute.getOutputBody(java.util.List.class);

	  	 var body = executeRoute.getOutputBody(org.w3c.dom.Document.class);
	  	 var messageBody = convertDocumentToString(body);
	  	 logger.info("backoffdrvaccFromIban: messageBody type = "+typeof messageBody);
	  	logger.info("backoffdrvaccFromIban: Output messageBody = " + messageBody );
		logger.info("backoffdrvaccFromIban: response = "+ outmsg);

		var orgBody = getHeader(map, "PLCN_originalMsgBody");
		logger.info("backoffdrvaccFromIban: orgBody = "+ orgBody);
		inMsg.setBody(orgBody);

			if(messageBody){
				var responseBody = dataBetweenTokens("<Value>" , "</Value>" , messageBody); 
				logger.info("backoffdrvaccFromIban: response Value = "+ responseBody);
				responseBody = "|".concat(responseBody); 
				responseBody = responseBody.concat("|"); 
				logger.info("backoffdrvaccFromIban: response Value = "+ responseBody);
			}
			temp = responseBody;

			value = dataBetweenTokens("|", "|", temp);
			value = value.trim();
			formatLabel= value;
			setHeader(map, "PLCN_formatLabel1", value);
			logger.info("backoffdrvaccFromIban: PLCN_formatLabel1 = " + value);
			temp = removePattern(temp, "|" + value);

			value = dataBetweenTokens("|", "|", temp); //WIP
			value = value.trim();
			//setHeader(map, "PLCN_account", value);
			account = value;
			logger.info("backoffdrvaccFromIban: PLCN_account = " + value);
			temp = removePattern(temp, "|" + value);

			value = dataBetweenTokens("|", "|", temp); //Y, N, YES, No
			value = value.trim();
			setHeader(map, "PLCN_companycode1", value);
			companycode = value; 
			logger.info("backoffdrvaccFromIban: PLCN_companycode1 = " + value);
			temp = removePattern(temp, "|" + value);

			value = dataBetweenTokens("|", "|", temp);
			value = value.trim();
			setHeader(map, "PLCN_sapaccount", value);
			sapaccount = value;
			logger.info("backoffdrvaccFromIban: PLCN_sapaccount = " + value);
			temp = removePattern(temp, "|" + value);

			value = dataBetweenTokens("|", "|", temp);
			value = value.trim();
			setHeader(map, "PLCN_accounttype", value);
			accounttype = value;
			logger.info("backoffdrvaccFromIban: PLCN_accounttype = " + value);
			temp = removePattern(temp, "|" + value);

			value = dataBetweenTokens("|", "|", temp);
			value = value.trim();
			//setHeader(map, "PLCN_receipient", value);
			receipient = value;
			logger.info("backoffdrvaccFromIban: PLCN_receipient = " + value);
			temp = removePattern(temp, "|" + value);
			
			value = dataBetweenTokens("|", "|", temp);
			value = value.trim();
			//setHeader(map, "PLCN_status", value);
			//status = value;
			logger.info("backoffdrvaccFromIban: PLCN_status = " + value);
			temp = removePattern(temp, "|" + value);
			
			value = dataBetweenTokens("|", "|", temp);
			value = value.trim();
			setHeader(map, "PLCN_sddcustomer", value);
			sddcustomer = value;
			logger.info("backoffdrvaccFromIban: PLCN_sddcustomer = " + value);
			temp = removePattern(temp, "|" + value);
		
			value = dataBetweenTokens("|", "|", temp);
			value = value.trim();
			setHeader(map, "PLCN_sddbank", value);
			sddbank = value;
			logger.info("backoffdrvaccFromIban: PLCN_sddbank = " + value);
			temp = removePattern(temp, "|" + value);

		if(internalBookingFlag != 'Y'){
			logger.info("backoffdrvaccFromIban: internalBookingFlag if loop " );
			setHeader(map, "PLCN_formatLabel", formatLabel);
		    setHeader(map, "PLCN_companycode", companycode);
			setHeader(map, "PLCN_formatLabel1", "");
		    setHeader(map, "PLCN_companycode1", "");
		}
		return formatLabel;
	 }
}

function sapCpdNameGeneration(exchange){
   var iban;
   var sapCr;
   var sapDr;
   var subSapCr;
   var subSapDr;
   var cpdFlag;
   var companyCode;
   var formalLabe1;
   var sapCrAccounttype;
   var sapCrReceipient;
   var sapDrAccounttype;
   var sapDrReceipient;
   var subSapCrAccounttype;
   var subSapCrReceipient;
   var subSapDrAccounttype;
   var subSapDrReceipient;
   var k;
   k = 1;
   var blankSpace;
   var lenSapCrReceipient;
   var lenSapDrReceipient;
   var singleBlankSpace;
   singleBlankSpace = " ";
   var lenSubSapCrReceipient;
   var lenSubSapDrReceipient;
   
   sapCr = getHeader(map, "PLCN_sapCr");
   sapDr = getHeader(map, "PLCN_sapDr");
   sapCr = variableConversionRule(exchange,sapCr , 11);
   sapDr = variableConversionRule(exchange,sapDr , 11);
   subSapCr = getHeader(map, "PLCN_subSapCr");
   subSapDr = getHeader(map, "PLCN_subSapDr");
   subSapCr = variableConversionRule(exchange,subSapCr , 11);
   subSapDr = variableConversionRule(exchange,subSapDr , 11);
   companyCode = getHeader(map, "PLCN_companyCode");
   formalLabe1 = getHeader(map, "PLCN_formalLabe");
   
   sapBackoffdrvaccFromIban(exchange,sapCr)
   sapCrAccounttype = getHeader(map, "PLCN_sapAccountype");
   logger.info("sapCpdNameGeneration: sapCrAccounttype = " + sapCrAccounttype);
   sapCrReceipient = getHeader(map, "PLCN_sapReceipient");
   logger.info("sapCpdNameGeneration: sapCrReceipient = " + sapCrReceipient);
   if(!sapCrAccounttype){
      sapCrAccounttype = "  ";
	  logger.info("sapCpdNameGeneration: sapCrAccounttype = " + sapCrAccounttype);
   }
   if(!sapCrReceipient){
      sapCrReceipient = "  ";
	  logger.info("sapCpdNameGeneration: sapCrReceipient = " + sapCrReceipient);
   }
   lenSapCrReceipient  = sapCrReceipient.length;
   logger.info("sapCpdNameGeneration: lenSapCrReceipient = " + lenSapCrReceipient);
   logger.info("sapCpdNameGeneration: lenSapCrReceipient type = " + typeof lenSapCrReceipient);
   var number = "30";

   if(!(lenSapCrReceipient == 30)){
	   logger.info("sapCpdNameGeneration: lenSapCrReceipient = in side if loop not equal 30 " );
	   if(lenSapCrReceipient > 30){
		   logger.info("sapCpdNameGeneration: lenSapCrReceipient = in side if loop greater than 30 " );
		   sapCrReceipient = strSub(sapCrReceipient, 1, 30);
		   logger.info("sapCpdNameGeneration: sapCrReceipient = " + sapCrReceipient);
	   }else{
		  blankSpace =  30 -lenSapCrReceipient;
		   logger.info("sapCpdNameGeneration: blankSpace = " + blankSpace);
		   logger.info("sapCpdNameGeneration: blankSpace type = " + typeof blankSpace);
		  	blankSpace = blankSpace + 1;
		   logger.info("sapCpdNameGeneration: blankSpace = " + blankSpace);
		   logger.info("sapCpdNameGeneration: blankSpace type = " + typeof blankSpace);
		  while(k < blankSpace){
			  sapCrReceipient = sapCrReceipient + singleBlankSpace;
			  logger.info("sapCpdNameGeneration: sapCrReceipient = " + sapCrReceipient);
			  k = k + 1;
		  }
	   }
   }
   setHeader(map, "PLCN_sapCrAccounttype", sapCrAccounttype);
   setHeader(map, "PLCN_sapCrReceipient", sapCrReceipient);
   
   sapBackoffdrvaccFromIban(exchange,sapDr)
   sapDrAccounttype = getHeader(map, "PLCN_sapAccountype");
   logger.info("sapCpdNameGeneration: sapDrAccounttype = " + sapDrAccounttype);
   sapDrReceipient = getHeader(map, "PLCN_sapReceipient");
   logger.info("sapCpdNameGeneration: sapDrReceipient = " + sapDrReceipient);
   if(!sapDrAccounttype){
      sapDrAccounttype = "  ";
	  logger.info("sapCpdNameGeneration: sapDrAccounttype = " + sapDrAccounttype);
   }
   if(!sapDrReceipient){
      sapDrReceipient = "  ";
	  logger.info("sapCpdNameGeneration: sapDrReceipient = " + sapDrReceipient);
   }
   k = 1;
   lenSapDrReceipient  = sapDrReceipient.length
   logger.info("sapCpdNameGeneration: lenSapDrReceipient = " + lenSapDrReceipient);
   if(!(lenSapDrReceipient == 30)){
	   if(lenSapDrReceipient > 30){
		   sapDrReceipient = strSub(sapDrReceipient, 1, 30)
		   logger.info("sapCpdNameGeneration: sapDrReceipient = " + sapDrReceipient);
	   }else{
		  blankSpace = 30 - lenSapDrReceipient ;
		  blankSpace = blankSpace + 1;
		  while(k < blankSpace){
			  sapDrReceipient = sapDrReceipient + singleBlankSpace;
			  logger.info("sapCpdNameGeneration: sapDrReceipient = " + sapDrReceipient);
			  k = k + 1;
		  }
	   }
   }
   setHeader(map, "PLCN_sapDrAccounttype", sapDrAccounttype);
   setHeader(map, "PLCN_sapDrReceipient", sapDrReceipient);
   
   if (companyCode == '043' || companyCode == '044'){
		   sapBackoffdrvaccFromIban(exchange,subSapCr)
		   subSapCrAccounttype = getHeader(map, "PLCN_sapAccountype");
		   subSapCrReceipient = getHeader(map, "PLCN_sapReceipient");
		   if(!subSapCrAccounttype){
			  subSapCrAccounttype = "  ";
		   }
		   if(!subSapCrReceipient){
			  subSapCrReceipient = "  ";
		   }
		   k = 1;
		   lenSubSapCrReceipient  = subSapCrReceipient.length;
		   if(!(lenSubSapCrReceipient == 30)){
			   if(lenSubSapCrReceipient > 30){
				   subSapCrReceipient = strSub(subSapCrReceipient, 1, 30);
			   }else{
				  blankSpace = 30 - lenSubSapCrReceipient ;
				  blankSpace = blankSpace + 1;
				  while(k < blankSpace){
					  subSapCrReceipient = subSapCrReceipient + singleBlankSpace;
					  k = k + 1;
				  }
			   }
		   }
		   setHeader(map, "PLCN_subSapCrAccounttype", subSapCrAccounttype);
		   setHeader(map, "PLCN_subSapCrReceipient", subSapCrReceipient);
		   
		   sapBackoffdrvaccFromIban(exchange,subSapDr)
		   subSapDrAccounttype = getHeader(map, "PLCN_sapAccountype");
		   subSapDrReceipient = getHeader(map, "PLCN_sapReceipient");
		   if(!subSapDrAccounttype){
			  subSapDrAccounttype = "  ";
		   }
		   if(!subSapDrReceipient){
			  subSapDrReceipient = "  ";
		   }
		   k = 1;
		   lenSubSapDrReceipient  = subSapDrReceipient.length
		   if(!(lenSubSapDrReceipient == 30)){
			   if(lenSubSapDrReceipient > 30){
				   subSapDrReceipient = strSub(subSapDrReceipient, 1, 30)
			   }else{
				  blankSpace = 30 - lenSubSapDrReceipient ;
				  blankSpace = blankSpace + 1;
				  while(k < blankSpace){
					  subSapDrReceipient = subSapDrReceipient + singleBlankSpace;
					  k = k + 1;
				  }
			   }
		   }
		   setHeader(map, "PLCN_subSapDrAccounttype",  subSapDrAccounttype);
		   setHeader(map, "PLCN_subSapDrReceipient", subSapDrReceipient);  
   }
   return
}

function ibanFromContractno(exchange,contractno){
		var baseIban;
		var fld;
		var flag;
		var secLvl;
		var runEnv;
		var newaccount;
		var value;
		var temp;
	  
	    var inMsg = exchange.getIn();
		var map = inMsg.getHeaders();
		var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
		var body = inMsg.getBody(java.lang.String.class);

		 flag = "f";
		 fld = "73";
		 secLvl = "SECURITY=HIGH";
		 runEnv = "OLDNEWACCOUNT-RUN";
		 baseIban = "IBAN " + contractno;
		 key = ":ACCOUNTTYPE";
		 parseFieldJs(exchange,fld,baseIban, secLvl, runEnv,key);
		 var parseRequest = getHeader(map, "PLCN_ParseRequest");
		 logger.info("ibanFromContractno: parseRequest = " + parseRequest);
		 var hdrMap = inMsg.getHeaders();
		 var executeRoute = new ExecuteCamelRoute();
		 executeRoute.callRouteWithHeader('direct://ParseAccMaster', parseRequest, new HashMap());
		 var outHdrMap = executeRoute.getOutputHeader();
		 var outmsg = executeRoute.getOutputBody(java.util.List.class);
	  	 var body = executeRoute.getOutputBody(org.w3c.dom.Document.class);
	  	 var messageBody = convertDocumentToString(body);
	  	 logger.info("ibanFromContractno: messageBody type = "+typeof messageBody);
	  	logger.info("ibanFromContractno: Output messageBody = " + messageBody );

		var orgBody = getHeader(map, "PLCN_originalMsgBody");
		logger.info("ibanFromContractno: orgBody = "+ orgBody);
		inMsg.setBody(orgBody);


		if(messageBody){
			var responseBody = dataBetweenTokens("<Value>" , "</Value>" , messageBody); 
			logger.info("backoffdrvaccFromIban: response Value = "+ responseBody);
			responseBody = "|".concat(responseBody); 
			responseBody = responseBody.concat("|"); 
			logger.info("backoffdrvaccFromIban: response Value = "+ responseBody);
		}
			temp = responseBody;

			value = dataBetweenTokens("|", "|", temp);
			value = value.trim();
			setHeader(map, "PLCN_sapAccountype", value);
			newaccount = value;
			logger.info("backoffdrvaccFromIban: PLCN_sapAccountype = " + value);
			temp = removePattern(temp, "|" + value);
		 
		 return newaccount;
}

function mapingContractNumber(exchange,iban,contractno){
   var account;
   var customeraccno;
   var contractIban;
   if(iban == "AT371981000999999999"){
      contractnoIban = ibanFromContractno(exchange,contractno);
	  if(contractnoIban){
		  setHeader(map, "PLCN_externalIban", contractnoIban);
		  setHeader(map, "PLCN_foreignIban", "Y");
		  return contractnoIban;
	  }else{
		  setHeader(map, "PLCN_queueidContract", "REPRQ"); 
		  return iban;
	  }
   
   }else{
	   if(iban){
		  account =  iban;
		  setHeader(map, "PLCN_externalIban", account);	  
	   }else{
		  return  account; 
	   }
   }

}

function bankOpCode(exchange) {
	var trnCodeV3;
	var internalBookingFlag;
	var msgtype;
	var txntype;
	var opCode;
	var orgnlmsgnmid;
	var msgDirection;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	internalBookingFlag = getHeader(map, "PLCN_internalBookingFlag");
	 logger.info("bankOpCode: internalBookingFlag = " + internalBookingFlag);
	orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
	 logger.info("bankOpCode: orgnlmsgnmid = " + orgnlmsgnmid);
	msgtype = getHeader(map, "PLCN_msgType");
	 logger.info("bankOpCode: msgtype = " + msgtype);
	txntype = getHeader(map, "PLCN_txnType");
	 logger.info("bankOpCode: txntype = " + txntype);

	msgDirection = getHeader(map, "PLCN_msgDirection");
    logger.info("bankOpCode: msgDirection = " + msgDirection);
	if(isPatternPresent(msgtype, "pacs.003")){
		trnCodeV3 = "DDT";
		setHeader(map, "PLCN_trnCodeV3", trnCodeV3);
		return trnCodeV3;
	}
	if(isPatternPresent(msgtype, "pacs.008") || msgtype == "103" || msgtype == "202"){
		trnCodeV3 = "TRF";
		setHeader(map, "PLCN_trnCodeV3", trnCodeV3);
		return trnCodeV3;
	}
	if(isPatternPresent(msgtype, "pacs.004")){
		if(customMemTblGetTblValue(map, "FLAG-TABLE",  "sntdcrf004") == "Y"){
			if(msgDirection == "I"){
				trnCodeV3 = "TRF";
				setHeader(map, "PLCN_trnCodeV3", trnCodeV3);
				return trnCodeV3;
			}
			
			if(msgDirection == "O"){
				if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
					trnCodeV3 = "RTR";
					setHeader(map, "PLCN_trnCodeV3", trnCodeV3);
					return trnCodeV3;
				}
				if(isPatternPresent(orgnlmsgnmid, "pacs.003.001.08")){
					trnCodeV3 = "RDD";
					setHeader(map, "PLCN_trnCodeV3", trnCodeV3);
					return trnCodeV3;
				}
			}
		}else{
			if(msgDirection == "I"){
				if(isPatternPresent(orgnlmsgnmid, "pacs.008.001.08")){
					trnCodeV3 = "RTR";
					setHeader(map, "PLCN_trnCodeV3", trnCodeV3);
					return trnCodeV3;
				}
				if(isPatternPresent(orgnlmsgnmid, "pacs.003.001.08")){
					trnCodeV3 = "RDD";
					setHeader(map, "PLCN_trnCodeV3", trnCodeV3);
					return trnCodeV3;
				}
			}
			if(msgDirection == "O"){
				if(isPatternPresent(orgnlmsgnmid, "pacs.008.001.08")){
					trnCodeV3 = "RTR";
					setHeader(map, "PLCN_trnCodeV3", trnCodeV3);
					return trnCodeV3;
				}
				if(isPatternPresent(orgnlmsgnmid, "pacs.003.001.08")){
					trnCodeV3 = "RDD";
					setHeader(map, "PLCN_trnCodeV3", trnCodeV3);
					return trnCodeV3;
				}
			}
		}
	}
	
	if(isPatternPresent(msgtype, "pacs.008") && internalBookingFlag == "Y"){
		trnCodeV3 = "TRF";
		setHeader(map, "PLCN_trnCodeV3", trnCodeV3);
		return trnCodeV3;
	}
	
}

function buisnessTransactionCode(exchange) {
	var msgtype;
	var bussTrnCode;
	var orgnlmsgnmid;
	var msgDirection;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	
	orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
	msgDirection = getHeader(map, "PLCN_msgDirection");
	msgtype = getHeader(map, "PLCN_msgType");
	if(msgtype == "pacs.003.001.08"){
		bussTrnCode = "ZZZ";
		return bussTrnCode;
	}
	if(msgtype == "pacs.008.001.08"){
		bussTrnCode = "ZZZ";
		return bussTrnCode;
	}
	if(msgtype == "pacs.004.001.09"){
		if(msgDirection == "I"){
			if(isPatternPresent(orgnlmsgnmid,"pacs.008.001.08")){
				bussTrnCode = "ZZZ";
				return bussTrnCode;
			}
			if(isPatternPresent(orgnlmsgnmid,"pacs.003.001.08")){
				bussTrnCode = "ZZZ";
				return bussTrnCode;
			}
		}
		if(msgDirection == "O"){
			if(isPatternPresent(orgnlmsgnmid,"pacs.008.001.08")){
				bussTrnCode = "ZZZ";
				return bussTrnCode;
			}
			if(isPatternPresent(orgnlmsgnmid,"pacs.003.001.08")){
				bussTrnCode = "ZZZ";
				return bussTrnCode;
			}
		}
	}
	if(msgtype == "103"){
		if(msgDirection == "I"){
			bussTrnCode = "ZZZ";
			return bussTrnCode;	
		}else{
			bussTrnCode = "01 ";
			return bussTrnCode;
		}
	}
}
function blankValFunction(exchange, headerVar){
	var temp;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	temp = getHeader(map, headerVar);
	if(!temp){
		temp = customMemTblGetTblValue(map, "BLK_DEF_VAL", headerVar);
	}
	setHeader(map, headerVar, temp);
	return temp;
}

function bankCodeFunction(exchange){
	var recipientBankCode;
	var msgtype;
	var orgnlmsgnmid;
	var messagedirection;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
	logger.info("bankCodeFunction: orgnlmsgnmid = " + orgnlmsgnmid);
	msgtype = getHeader(map, "PLCN_msgtype");
	messagedirection = getHeader(map, "PLCN_msgDirection");
	logger.info("bankCodeFunction: messagedirection = " + messagedirection);
	
	if(messagedirection == "O"){
		recipientBankCode = "     ";
		return recipientBankCode;
	}else if(msgtype == "pacs.003.001.08" || msgtype == "pacs.008.001.08"){
		recipientBankCode = "19810";
		return recipientBankCode;
	}else{
		recipientBankCode = "     ";
		return recipientBankCode;
	}
	
	if(msgtype == "pacs.003.001.08" || msgtype == "103"){
		recipientBankCode = "     ";
		return recipientBankCode;
	}else if(messagedirection == "I"){
		recipientBankCode = "19810";
		return recipientBankCode;
	}
	
	if(msgtype == "103"){
		recipientBankCode = "     ";
		return recipientBankCode;
	}
	
	if(msgtype == "pacs.008.001.08"){
		if(messagedirection == "O"){
		recipientBankCode = "     ";
		return recipientBankCode;
		}else if(messagedirection == "I"){
			recipientBankCode = "19810";
			return recipientBankCode;
		}
	}
	
	if(msgtype == "pacs.004.001.09"){
		if(messagedirection == "O"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				recipientBankCode = "     ";
				return recipientBankCode;
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003")){
				recipientBankCode = "     ";
				return recipientBankCode;
			}
		}
		if(messagedirection == "I"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				recipientBankCode = "     ";
				return recipientBankCode;
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003")){
				recipientBankCode = "     ";
				return recipientBankCode;
			}
		}
	}
	
}

function panCreditContractNumer(exchange){
	var msgtype;
	var contractNumber;
	var msgDirection;
	var internalIban;
	var internalIbanLength;
	var internalIbanDummy;
	var orgnlmsgnmid;
	var k;
	var blankSpace;
	var singleBlankSpace;
	var externalIban;
	var internalBookingFlag;
	var externalContractNumber;
	var temp;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	
	orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
	logger.info("panCreditContractNumer: orgnlmsgnmid = " + orgnlmsgnmid);
	msgtype = getHeader(map, "PLCN_msgtype");
	logger.info("panCreditContractNumer: msgtype = " + msgtype);
	msgDirection = getHeader(map, "PLCN_msgDirection");
	logger.info("panCreditContractNumer: msgDirection = " + msgDirection);
	internalIban = getHeader(map, "PLCN_internalIbanDummy103");
	logger.info("panCreditContractNumer: internalIban = " + internalIban);
	externalIban = getHeader(map, "PLCN_externalIban");
	logger.info("panCreditContractNumer: externalIban = " + externalIban);
	internalBookingFlag = getHeader(map, "PLCN_internalBookingFlag");
	logger.info("panCreditContractNumer: internalBookingFlag = " + internalBookingFlag);
	if(!internalIban){
		internalIban = getHeader(map, "PLCN_internalIban");
		logger.info("panCreditContractNumer: internalIban = " + internalIban);
	}
	
	if(!internalIban){
		temp = "           "
		return temp;
	}
	
	if(!externalIban){
		temp = "           ";
		return temp;
	}
	
	if(isPatternPresent(msgtype, "pacs.003")){
		if(msgDirection == "I"){
			internalIbanDummy = internalIban;
			internalIbanDummy = cleanString(internalIbanDummy);
			internalIbanLength = internalIbanDummy.length(); //20
			internalIbanLength = internalIbanLength - 11; // 20 -11 
			//internalIbanLength = internalIbanLength + 1;
			contractNumber = internalIbanDummy.substr(internalIbanLength, 11);
			
			if(!isAllDigits(contractNumber)){
				contractNumber = "00000000000";
			}
			setHeader(map, "PLCN_contractNumber", contractNumber);
			logger.info("panCreditContractNumer: contractNumber for PACS003 outbound = " + contractNumber);
			return contractNumber;
		}else if(msgDirection == "O"){
			internalIbanDummy = internalIban;
			internalIbanDummy = cleanString(internalIbanDummy);
			internalIbanLength = internalIbanDummy.length();
			internalIbanLength = internalIbanLength - 11;
			//internalIbanLength = internalIbanLength + 1;
			contractNumber = internalIbanDummy.substr(internalIbanLength, 11);
			
			if(!isAllDigits(contractNumber)){
				contractNumber = "00000000000";
			}
			setHeader(map, "PLCN_contractNumber", contractNumber);
			logger.info("panCreditContractNumer: contractNumber for PACS003 inbound = " + contractNumber);
			return contractNumber;
		}
	}
	
	if(isPatternPresent(msgtype, "pacs.008")){
		if(msgDirection == "I"){
			if(internalBookingFlag == "Y"){
				internalIbanDummy = externalIban;
				internalIbanDummy = cleanString(internalIbanDummy);
				internalIbanLength = internalIbanDummy.length();
				internalIbanLength = internalIbanLength - 11;
				//internalIbanLength = internalIbanLength + 1;
				externalContractNumber = internalIbanDummy.substr(internalIbanLength, 11);
				//setHeader(map, "PLCN_externalContractNumber", externalContractNumber);
				logger.info("panCreditContractNumer: externalContractNumber = " +externalContractNumber);
				setHeader(map, "PLCN_externalContractNumber", externalContractNumber);
			}
			
			internalIbanDummy = internalIban;
			internalIbanDummy = cleanString(internalIbanDummy);
			internalIbanLength = internalIbanDummy.length();
			internalIbanLength = internalIbanLength - 11;
			//internalIbanLength = internalIbanLength + 1;
			contractNumber = internalIbanDummy.substr(internalIbanLength, 11);
			
			if(!isAllDigits(contractNumber)){
				contractNumber = "00000000000";
			}
			setHeader(map, "PLCN_contractNumber", contractNumber);
			logger.info("panCreditContractNumer: contractNumber for PACS008 outbound = " + contractNumber);
			logger.info("panCreditContractNumer: parseRequest.type = "+typeof contractNumber);
			contractNumber = parseInt(contractNumber);
			logger.info("panCreditContractNumer: parseRequest.type = "+typeof contractNumber);
			return contractNumber;
		}else if(msgDirection == "O"){
			internalIbanDummy = internalIban;
			internalIbanDummy = cleanString(internalIbanDummy);
			internalIbanLength = internalIbanDummy.length();
			internalIbanLength = internalIbanLength - 11;
			//internalIbanLength = internalIbanLength + 1;
			//contractNumber = internalIbanDummy.substr(11, internalIbanLength);
			contractNumber = internalIbanDummy.substr(internalIbanLength, 11);
			
			if(!isAllDigits(contractNumber)){
				contractNumber = "00000000000";
			}
			setHeader(map, "PLCN_contractNumber", contractNumber);
			logger.info("panCreditContractNumer: contractNumber for PACS008 inbound = " + contractNumber);
			return contractNumber;
		}
	}
	
	if(msgtype == "103"){
		internalIbanLength = internalIbanLength.length();
		if(internalIbanLength < 11){
			K = 1;
			singleBlankSpace = " ";
			blankSpace = 11 - internalIbanLength;
			blankSpace = blankSpace + 1;
			while(K < blankSpace){
				internalIban = internalIban + singleBlankSpace;
				K = K+1;
			}
			contractNumber = internalIban;
		}else{
			internalIbanLength = internalIbanLength.length();
			internalIbanLength = internalIbanLength - 11;
			internalIbanLength = internalIbanLength + 1;
			contractNumber = internalIbanDummy.substr(11, internalIbanLength);
		}
		
		if(!isAllDigits(contractNumber)){
			contractNumber = "00000000000";
		}
		
		setHeader(map, "PLCN_contractNumber", contractNumber);
		return contractNumber;
	}
	
	if(isPatternPresent(msgtype, "pacs.004")){
		if(msgDirection == "O"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
			internalIbanDummy = internalIban;
			internalIbanDummy = cleanString(internalIbanDummy);
			internalIbanLength = internalIbanDummy.length();
			internalIbanLength = internalIbanLength - 11;
			//internalIbanLength = internalIbanLength + 1;
			//contractNumber = internalIbanDummy.substr(11, internalIbanLength);
			contractNumber = internalIbanDummy.substr(internalIbanLength, 11);
			
			if(!isAllDigits(contractNumber)){
				contractNumber = "00000000000";
			}
			setHeader(map, "PLCN_contractNumber", contractNumber);
			return contractNumber;
			}
			
			if(isPatternPresent(orgnlmsgnmid, "pacs.003")){
			internalIbanDummy = internalIban;
			internalIbanDummy = cleanString(internalIbanDummy);
			internalIbanLength = internalIbanDummy.length();
			internalIbanLength = internalIbanLength - 11;
			//internalIbanLength = internalIbanLength + 1;
			//contractNumber = internalIbanDummy.substr(11, internalIbanLength);
			contractNumber = internalIbanDummy.substr(internalIbanLength, 11);
			
			
			if(!isAllDigits(contractNumber)){
				contractNumber = "00000000000";
			}
			setHeader(map, "PLCN_contractNumber", contractNumber);
			logger.info("panCreditContractNumer: contractNumber for PACS004 sdd inbound = " + contractNumber);
			return contractNumber;
			}
		}
		
		if(msgDirection == "I"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
			internalIbanDummy = internalIban;
			internalIbanDummy = cleanString(internalIbanDummy);
			internalIbanLength = internalIbanDummy.length();
			internalIbanLength = internalIbanLength - 11;
			internalIbanLength = internalIbanLength + 1;
			contractNumber = internalIbanDummy.substr(11, internalIbanLength);
			
			if(!isAllDigits(contractNumber)){
				contractNumber = "00000000000";
			}
			setHeader(map, "PLCN_contractNumber", contractNumber);
			return contractNumber;
			}
			
			if(isPatternPresent(orgnlmsgnmid, "pacs.003")){
			internalIbanDummy = internalIban;
			internalIbanDummy = cleanString(internalIbanDummy);
			internalIbanLength = internalIbanDummy.length();
			internalIbanLength = internalIbanLength - 11;
			internalIbanLength = internalIbanLength + 1;
			contractNumber = internalIbanDummy.substr(11, internalIbanLength);
			
			if(!isAllDigits(contractNumber)){
				contractNumber = "00000000000";
			}
			setHeader(map, "PLCN_contractNumber", contractNumber);
			return contractNumber;
			}
		}
	}
}

function counterpartyAccountNumberFunction(exchange){
	var messagedirection;
	var msgtype;
	var recipientAccount;
	var orgnlmsgnmid;
	var internalIban;
	var internalIbanLength;
	var internalIbanCleanstring;
	var temp;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	
	messagedirection = getHeader(map, "PLCN_msgDirection");
	msgtype = getHeader(map, "PLCN_msgtype");
	orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
	internalIban = getHeader(map, "PLCN_internalIban");
	
	if(msgtype == "103"){
		recipientAccount = "00000000000";
		return recipientAccount;
	}
	
	if(!internalIban){
		temp = "           ";
		return temp;
	}
	
	if(msgtype == "pacs.008.001.08"){
		recipientAccount = "00000000000";
		return recipientAccount;
	}
	
	if(msgtype == "pacs.003.001.08"){
		if(messagedirection == "O"){
			recipientAccount = "00000000000";
			return recipientAccount;
		}else if(messagedirection == "I"){
			recipientAccount = "00000000000";
			return recipientAccount;
		}
	}
	
	if(msgtype == "pacs.004.001.09"){
		if(messagedirection == "O"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008.001.08")){
				recipientAccount = "00000000000";
				return recipientAccount;
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003.001.08")){
				recipientAccount = "00000000000";
				return recipientAccount;
			}
		}
		if(messagedirection == "I"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008.001.08")){
				recipientAccount = "           ";
				return recipientAccount;
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003.001.08")){
				recipientAccount = "00000000000";
				return recipientAccount;
			}
		}
	}
}

function use1Function(exchange){
	var use1;
	var use2;
	var orgnlmsgnmid;
	var f70Value;
	var f70Length;
	var noOfSpaces;
    var condition;
	var contractNumber;
	var messagedirection;
	var use1Length;
	var blankSpace;
	var singleBlankSpace;
	var k;
	var msgtype;
	var txntype;
	var formatLabel;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	
	use1 = customMemTblGetTblValue(map, "F007_DEFAULT_VALUES", "USE1");
	use2 = getHeader(map, "PLCN_use2");
	logger.info("use1Function: use2 = " + use2);
	contractNumber = getHeader(map, "PLCN_contractNumber");
	logger.info("use1Function: contractNumber = " + contractNumber);
	f70Value = getHeader(map, "PLCN_f70Value");
	singleBlankSpace = " ";
	formatLabel = getHeader(map, "PLCN_formatLabel1");
	logger.info("use1Function: formatLabel = " + formatLabel);
	msgtype = getHeader(map, "PLCN_msgtype");
	logger.info("use1Function: msgtype = " + msgtype);
	txntype = getHeader(map, "PLCN_txntype");
	logger.info("use1Function: txntype = " + txntype);
	orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
	logger.info("use1Function: orgnlmsgnmid = " + orgnlmsgnmid);
	K = 1;
	messagedirection = getHeader(map, "PLCN_msgDirection");
	logger.info("use1Function: messagedirection = " + messagedirection);
	
	if(msgtype == "103"){
		if(!f70Value){
			use1 = customMemTblGetTblValue(map, "F007_DEFAULT_VALUES", "USE1");
		}else{
			noOfSpaces = 57 - f70Value.length();
			condition = noOfSpaces + 1;
			K = 1;
			while(K < condition){
				f70Value = f70Value + " ";
				K = K+1;
			}
			use1 = f70Value;
		}
	}
	
	if(msgtype == "103" && formatLabel == "F014"){
		use1 = customMemTblGetTblValue(map, "F007_DEFAULT_VALUES", "USE1");
	}
	
	if(isPatternPresent(msgtype,"pacs.004") && orgnlmsgnmid == "pacs.008.001.08"){
		if(!use2){
			logger.info("use1Function: inside if loop");
			return use1;
		}else{
			use1 = use2.substr(0, 57);
			logger.info("use1Function: inside else loop" + use1 )
			return use1;
		}
	}
	
	if(isPatternPresent(msgtype, "pacs.008")){
		use1 = use2.substr(0, 57);
		return use1;
	}
	
	if(isPatternPresent(msgtype, "pacs.003")){
		if(messagedirection == "O"){
			contractNumber = panCreditContractNumer(exchange);
			logger.info("use1Function:contractNumber " +contractNumber );
			use1 = contractNumber;
			logger.info("use1Function:use1 " +use1 );
			use1Length = use1.length();
			logger.info("use1Function:use1Length " +use1Length );
			blankSpace = 57 - use1Length;
			logger.info("use1Function:blankSpace " +blankSpace );
			blankSpace = blankSpace + 1;
			logger.info("use1Function:blankSpace " +blankSpace );
			while(K < blankSpace){
				use1 = use1 + singleBlankSpace;
				logger.info("use1Function:use1 " +use1 );
				K = K+1;
			}
			logger.info("use1Function:use1 " +use1 );
			return use1;
		}else if(messagedirection == "I" && use2){
			use1 = use2.substr(0, 57);
			return use1;
		}
	}
	if(isPatternPresent(msgtype,"pacs.004")){
	   if(messagedirection == "O"){
		  if(orgnlmsgnmid == "pacs.008.001.08"){
			 use1 = use2.substr(0, 57) ;
		  }
		  if(orgnlmsgnmid == "pacs.003.001.08"){
			    contractNumber = panCreditContractNumer(exchange);
				logger.info("use1Function: inside if loop" + contractNumber)
				use1 = contractNumber;
				logger.info("use1Function: inside if loop" + use1)
				use1Length = use1.length();
				logger.info("use1Function: inside if loop" + use1Length)
				blankSpace = 57 - use1Length;
				logger.info("use1Function: inside if loop" + blankSpace)
				blankSpace = blankSpace + 1;
				logger.info("use1Function: inside if loop" + blankSpace)
				while(K < blankSpace){
					use1 = use1 + singleBlankSpace;
					logger.info("use1Function: inside if loop" + use1)
					K = K+1;
				}
		  }
	   }
	   if(messagedirection == "I"){
		  if(orgnlmsgnmid == "pacs.008.001.08"){
			 use1 = use2.substr(0, 57) ;
		  }
          if(orgnlmsgnmid == "pacs.003.001.08"){
			 use1 = use2.substr(0, 57) ;
		  } 		  
	   }
	}
	return use1;
}

function ruleInitialRegistrationRefBlank(exchange){
	var initialRegistrationRef;
	var messagedirection;
	var msgtype;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	messagedirection = getHeader(map, "PLCN_msgDirection");
	msgtype = getHeader(map, "PLCN_msgtype");
	initialRegistrationRef = getHeader(map, "PLCN_initialRegistrationRef");

	return initialRegistrationRef;
}

function creditorIdSntd(exchange){
	var msgtype;
	var orgnlmsgnmid;
	var messagedirection;
	var creditorId;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	messagedirection = getHeader(map, "PLCN_msgDirection");
	logger.info("creditorIdSntd: messagedirection = " + messagedirection);
	orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
	logger.info("creditorIdSntd: orgnlmsgnmid = " + orgnlmsgnmid);
	msgtype = getHeader(map, "PLCN_msgtype");
	logger.info("creditorIdSntd: msgtype = " + msgtype);
	creditorId = getHeader(map, "PLCN_creditorId");
	logger.info("creditorIdSntd: creditorId = " + creditorId);
	
	if(isPatternPresent(msgtype, "pacs.008")){
		creditorId = "                                   ";
	}
	
	if(msgtype == "103"){
		creditorId = "                                   ";
	}
	
	if(msgtype == "202"){
		creditorId = "                                   ";
	}
	
	if(isPatternPresent(msgtype, "pacs.003")){
		if(!creditorId){
			creditorId = "                                   ";
		}	
	}
	
	if(isPatternPresent(msgtype, "pacs.004")){
		if(messagedirection == "O"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				creditorId = "                                   ";
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003") && !creditorId){
				creditorId = "                                   ";
			}
		}
		if(messagedirection == "I"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				creditorId = "                                   ";
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003") && !creditorId){
				creditorId = "                                   ";
			}
		}
	}
	logger.info("creditorIdSntd: creditorId for return = " + creditorId);
	return creditorId;
}


function executionSequenceFunction(exchange){
	var msgtype;
	var orgnlmsgnmid;
	var messagedirection;
	var executionSequence;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	messagedirection = getHeader(map, "PLCN_msgDirection");
	logger.info("executionSequenceFunction: messagedirection = " + messagedirection);
	orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
	logger.info("executionSequenceFunction: orgnlmsgnmid = " + orgnlmsgnmid);
	msgtype = getHeader(map, "PLCN_msgtype");
	logger.info("executionSequenceFunction: msgtype = " + msgtype);
	executionSequence = getHeader(map, "PLCN_executionSequence");
	logger.info("executionSequenceFunction: executionSequence = " + executionSequence);
	
	if(isPatternPresent(msgtype, "pacs.008")){
		executionSequence = "    ";
	}
	
	if(msgtype == "103"){
		executionSequence = "    ";
	}
	
	if(isPatternPresent(msgtype, "pacs.003")){
		if(!executionSequence){
			executionSequence = "    ";
		}
	}
	
	if(isPatternPresent(msgtype, "pacs.004")){
		if(messagedirection == "O"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				executionSequence = "    ";
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003") && !executionSequence){
				executionSequence = "    ";
			}
		}
		if(messagedirection == "I"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				executionSequence = "    ";
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003") && !executionSequence){
				executionSequence = "    ";
			}
		}
	}
	logger.info("executionSequenceFunction: executionSequence for return= " + executionSequence);
	return executionSequence;
}


function sddSchemeSntd(exchange){
	var msgtype;
	var orgnlmsgnmid;
	var messagedirection;
	var sddScheme;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	messagedirection = getHeader(map, "PLCN_msgDirection");
	logger.info("sddSchemeSntd: messagedirection = " + messagedirection);
	orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
	logger.info("sddSchemeSntd: orgnlmsgnmid = " + orgnlmsgnmid);
	msgtype = getHeader(map, "PLCN_msgtype");
	logger.info("sddSchemeSntd: msgtype = " + msgtype);
	sddScheme = getHeader(map, "PLCN_sddScheme");
	logger.info("sddSchemeSntd: sddScheme = " + sddScheme);
	
	if(sddScheme == "B2B"){
		sddScheme = sddScheme + " ";
	}
	
	if(isPatternPresent(msgtype, "pacs.008")){
		sddScheme = "    ";
	}
	
	if(msgtype == "103"){
		sddScheme = "    ";
	}
	
	if(isPatternPresent(msgtype, "pacs.003")){
		if(!sddScheme){
			sddScheme = "    ";
		}
	}
	
	if(isPatternPresent(msgtype, "pacs.004")){
		if(messagedirection == "O"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				sddScheme = "    ";
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003") && !sddScheme){
				sddScheme = "    ";
			}
		}
		if(messagedirection == "I"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				sddScheme = "    ";
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003") && !sddScheme){
				sddScheme = "    ";
			}
		}
	}
	
	return sddScheme;
}

function bussTrnCodeGroupSntd(exchange){
	var msgtype;
	var orgnlmsgnmid;
	var messagedirection;
	var bussTrnCodeGroup;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	messagedirection = getHeader(map, "PLCN_msgDirection");
	logger.info("bussTrnCodeGroupSntd: messagedirection = " + messagedirection);
	orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
	logger.info("bussTrnCodeGroupSntd: orgnlmsgnmid = " + orgnlmsgnmid);
	msgtype = getHeader(map, "PLCN_msgtype");
	logger.info("bussTrnCodeGroupSntd: msgtype = " + msgtype);
	bussTrnCodeGroup = getHeader(map, "PLCN_bussTrnCodeGroup");
	logger.info("bussTrnCodeGroupSntd: bussTrnCodeGroup = " + bussTrnCodeGroup);
	
	if(isPatternPresent(msgtype, "pacs.008")){
		if(!bussTrnCodeGroup){
			bussTrnCodeGroup = "    ";
			setHeader(map, "PLCN_bussTrnCodeGroup", bussTrnCodeGroup);
		}
	}
	
	if(msgtype == "103"){
			bussTrnCodeGroup = "    ";
			setHeader(map, "PLCN_bussTrnCodeGroup", bussTrnCodeGroup);
	}
	
	if(isPatternPresent(msgtype, "pacs.003")){
		if(!bussTrnCodeGroup){
			bussTrnCodeGroup = "    ";
			setHeader(map, "PLCN_bussTrnCodeGroup", bussTrnCodeGroup);
		}
	}
	
	if(isPatternPresent(msgtype, "pacs.004")){
		if(messagedirection == "O"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				bussTrnCodeGroup = "    ";
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003")){
				bussTrnCodeGroup = "    ";
			}
		}
		if(messagedirection == "I"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				bussTrnCodeGroup = "    ";
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003")){
				bussTrnCodeGroup = "    ";
			}
		}
	}
	
	setHeader(map, "PLCN_bussTrnCodeGroup", bussTrnCodeGroup);
	return bussTrnCodeGroup;
}

function returnCodeSntd(exchange){
	var msgtype;
	var returnCode;
	var returnCodePath;
	var messagedirection;
	
	var inMsg;
	var map;
	var readMsgdb;
	var Document;
   
     inMsg = exchange.getIn();
	 map = inMsg.getHeaders();
	 readMsgdb = inMsg.getHeaders().get("ACEQ_READ_MSGDB");
	 
	 Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
  	body = inMsg.getBody(java.lang.String.class);
  	logger.info("returnCodeSntd: body = " + body);
	
	messagedirection = getHeader(map, "PLCN_msgDirection");
	msgtype = getHeader(map, "PLCN_msgtype");
	logger.info("returnCodeSntd: msgtype = " + msgtype);
	returnCode = customMemTblGetTblValue(map, "F001_DEFAULT_VALUES",  "RETURN_CODE");
	
	if(isPatternPresent(msgtype, "pacs.004")){
		returnCodePath = "/Document/PmtRtr/TxInf/RtrRsnInf/Rsn/Cd";
		returnCode = getValueFromPath(Document, returnCodePath);
		logger.info("returnCodeSntd: returnCode = " + returnCode);
	if(!returnCode){
		returnCode = dataBetweenTokens("<RtrRsnInf>", "</RtrRsnInf>",body);
		returnCode = dataBetweenTokens("<Rsn>", "</Rsn>",returnCode);
		returnCode = dataBetweenTokens("<Cd>", "</Cd>",returnCode);
		logger.info("returnCodeSntd: returnCode = " + returnCode);
		}
	}
	return returnCode;
}


function trnCodeSntd(exchange){
	var msgtype;
	var trnCode;
	var orgnlmsgnmid;
	var messagedirection;
	var bussTrnCodeGroup;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	messagedirection = getHeader(map, "PLCN_msgDirection");
	logger.info("trnCodeSntd: messagedirection = " + messagedirection);
	orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
	logger.info("trnCodeSntd: orgnlmsgnmid = " + orgnlmsgnmid);
	msgtype = getHeader(map, "PLCN_msgtype");
	logger.info("trnCodeSntd: msgtype = " + msgtype);
	bussTrnCodeGroup = getHeader(map, "PLCN_bussTrnCodeGroup");
	logger.info("trnCodeSntd: bussTrnCodeGroup = " + bussTrnCodeGroup);
	trnCode = bussTrnCodeGroup;
	logger.info("trnCodeSntd: trnCode = " + trnCode);
	
	if(isPatternPresent(msgtype,"pacs.008")){
		if(!bussTrnCodeGroup){
			trnCode = "    ";
		}
	}
	
	if(isPatternPresent(msgtype,"pacs.003")){
		if(!bussTrnCodeGroup){
			trnCode = "    ";
		}
	}
	
	if(isPatternPresent(msgtype,"pacs.004")){
		if(messagedirection == "O"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				trnCode = "    ";
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003")){
				trnCode = "    ";
			}
		}
		if(messagedirection == "I"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				trnCode = "    ";
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003")){
				trnCode = "    ";
			}
		}
	}
	
	return trnCode;
}

function variableConversionRule(exchange,hdrVar,digits) { 
	var noOfZeros;
	var k;
	var condition;
	var hdrVarLen;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	hdrVar = cleanString(hdrVar);
	logger.info("variableConversionRule: hdrVar = " + hdrVar);
	hdrVarLen = hdrVar.length();
	logger.info("variableConversionRule: hdrVar = " + hdrVar);
	noOfZeros = digits - hdrVarLen;
	logger.info("variableConversionRule: noOfZeros = " + hdrVar);
	condition = noOfZeros + 1;
	
	k = 1;
	//need to check if to start K from 0 or 1 
	while(k < condition){
		hdrVar = "0" + hdrVar;
		k = k + 1;	
	}
	logger.info("variableConversionRule: hdrVar = " + hdrVar);
	return hdrVar;
}

function sapBackoffdrvaccFromIban(exchange, accountLabel){
		var baseIban;
		var fld;
		var flag;
		var secLvl;
		var runEnv;
		var accounttype;
		var receipient;
		var value;
		var temp;
		
		var inMsg = exchange.getIn();
		var map = inMsg.getHeaders();
		var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
		var body = inMsg.getBody(java.lang.String.class);
	
	 flag = "f";
	 fld = "73";
	 secLvl = "SECURITY=HIGH";
	 runEnv = "BACKOFFSYS-RUN";
	 baseIban = "ACCOUNT-LABEL " + accountLabel;
	 key = ":ACCOUNTTYPE|:RECEIPIENT";
      parseFieldJs(exchange,fld,baseIban, secLvl, runEnv,key);
	 var parseRequest = getHeader(map, "PLCN_ParseRequest");
	 logger.info("sapBackoffdrvaccFromIban: parseRequest = " + parseRequest);
	 logger.info("sapBackoffdrvaccFromIban: parseRequest.type = "+typeof parseRequest);
	 var hdrMap = inMsg.getHeaders();
	 var executeRoute = new ExecuteCamelRoute();
	 executeRoute.callRouteWithHeader('direct://ParseAccMaster', parseRequest, new HashMap());
  	 var outHdrMap = executeRoute.getOutputHeader();
  	 var outmsg = executeRoute.getOutputBody(java.util.List.class);
  	 var body = executeRoute.getOutputBody(org.w3c.dom.Document.class);
  	 var messageBody = convertDocumentToString(body);
  	 logger.info("sapBackoffdrvaccFromIban: messageBody type = "+typeof messageBody);
  	logger.info("sapBackoffdrvaccFromIban: Output messageBody = " + messageBody );
	logger.info("sapBackoffdrvaccFromIban: response = "+ outmsg);
	var orgBody = getHeader(map, "PLCN_originalMsgBody");
	logger.info("sapBackoffdrvaccFromIban: orgBody = "+ orgBody);
	inMsg.setBody(orgBody);

		if(messageBody){
			var responseBody = dataBetweenTokens("<Value>" , "</Value>" , messageBody); 
			logger.info("sapBackoffdrvaccFromIban: response Value = "+ responseBody);
			responseBody = "|".concat(responseBody); 
			responseBody = responseBody.concat("|"); 
			logger.info("backoffdrvaccFromIban: response Value = "+ responseBody);
		}
			temp = responseBody;

			value = dataBetweenTokens("|", "|", temp);
			value = value.trim();
			setHeader(map, "PLCN_sapAccountype", value);
			logger.info("sapBackoffdrvaccFromIban: PLCN_sapAccountype = " + value);
			accounttype = value;
			temp = removePattern(temp, "|" + value);

			value = dataBetweenTokens("|", "|", temp); //WIP
			value = value.trim();
			setHeader(map, "PLCN_sapReceipient", value);
			receipient = value;
			logger.info("sapBackoffdrvaccFromIban: PLCN_sapReceipient = " + value);
			temp = removePattern(temp, "|" + value);

    return;
}

function sanctionsEodSapGeneration(exchange){
	var sapCr;
	var sapDr;
	var txntype;
	var nostroAccount;
	var aggregateflag;
	var aggregateFlag;
	var companyCode1;
	var clearingAccount;
	var mainCc;
	var subCc;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	companyCode1 = getHeader(map, "PLCN_companyCode");
	logger.info("sanctionsEodSapGeneration:companyCode1 " + companyCode1);
	txntype = getHeader(map, "PLCN_txnType");
	if(!txntype ){
		txntype = getHeader(map, "PLCN_transactionType");
	}
	logger.info("sanctionsEodSapGeneration:txntype " + txntype);
	nostroAccount = getHeader(map, "PLCN_glNostroAccount");
	logger.info("sanctionsEodSapGeneration:nostroAccount " + nostroAccount);
	
	if(companyCode1 == "043"){
		mainCc = "210005";
		subCc = "723700";
	}

	if(companyCode1 == "044"){
		mainCc = "331101";
		subCc = "723744";
	}
	
	clearingAccount = "581024";
	if(txntype == "D"){
		if(companyCode1 == "001"){
			setHeader(map, "PLCN_sanctionsSapDr", clearingAccount);
			setHeader(map, "PLCN_sanctionsSapCr", nostroAccount);
			setHeader(map, "PLCNAPI_sanctionsSapDr", clearingAccount);
			setHeader(map, "PLCNAPI_sanctionsSapCr", nostroAccount);
		}
		
		if(companyCode1 == "043" || companyCode1 == "044"){
			setHeader(map, "PLCN_sanctionsSapDr", mainCc);
			setHeader(map, "PLCN_sanctionsSubSapDr", subCc);
			setHeader(map, "PLCN_sanctionsSapCr", clearingAccount);
			setHeader(map, "PLCN_sanctionsSubSapCr", nostroAccount);
			setHeader(map, "PLCNAPI_sanctionsSapDr", mainCc);
			setHeader(map, "PLCNAPI_sanctionsSubSapDr", subCc);
			setHeader(map, "PLCNAPI_sanctionsSapCr", clearingAccount);
			setHeader(map, "PLCNAPI_sanctionsSubSapCr", nostroAccount);
		}
	}

	if(txntype == "C"){
		if(companyCode1 == "001"){
			setHeader(map, "PLCN_sanctionsSapCr", clearingAccount);
			setHeader(map, "PLCN_sanctionsSapDr", nostroAccount);
			setHeader(map, "PLCNAPI_sanctionsSapCr", clearingAccount);
			setHeader(map, "PLCNAPI_sanctionsSapDr", nostroAccount);
		}
		
		if(companyCode1 == "043" || companyCode1 == "044"){
			setHeader(map, "PLCN_sanctionsSapCr", mainCc);
			setHeader(map, "PLCN_sanctionsSubSapDr", subCc);
			setHeader(map, "PLCN_sanctionsSubSapCr", clearingAccount);
			setHeader(map, "PLCN_sanctionsSapDr", nostroAccount);
			setHeader(map, "PLCNAPI_sanctionsSapCr", mainCc);
			setHeader(map, "PLCNAPI_sanctionsSubSapDr", subCc);
			setHeader(map, "PLCNAPI_sanctionsSubSapCr", clearingAccount);
			setHeader(map, "PLCNAPI_sanctionsSapDr", nostroAccount);
		}
	}
}

function setOriginalMsg(exchange){
	var inMsg;
	var map;
	var Document;
	var orgnlBody;

	logger.info("In setOriginalMsg");

    inMsg = exchange.getIn();
    map = inMsg.getHeaders();
  	body = inMsg.getBody(java.lang.String.class);
  	logger.info("setOriginalMsg: body = " + body);

  	if(!(isPatternPresent(body, "<Document>") && isPatternPresent(body, "</Document>"))){
  		logger.info("setOriginalMsg: setting original message");
		orgnlBody = getHeader(map,"PLCN_originalMsgBody");
		logger.info("setOriginalMsg: orgnlBody type = " + typeof orgnlBody);
		logger.info("setOriginalMsg: orgnlBody = " + orgnlBody);
		inMsg.setBody(orgnlBody);
  	}
 }
 
 function mandateNumberSantander(exchange){
	 var inMsg = exchange.getIn();
	 var map = inMsg.getHeaders();
	 var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 
	 var msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("mandateNumber: msgDirection = " + msgDirection);
	 
	 var msgType = getHeader(map, "PLCN_msgType");
     msgType = msgType.trim();
     logger.info("mandateNumber: msgType = " + msgType);
	 
	 var orgnlmsgnmidPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
     var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
     logger.info("mandateNumber:orgnlmsgnmid = " + orgnlmsgnmid);
	 
	 if(!orgnlmsgnmid){
		 var orgnlmsgnmidPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
		 var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
		 logger.info("mandateNumber:orgnlmsgnmid = " + orgnlmsgnmid);
	 }
	 
	 if(!orgnlmsgnmid){
		 orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
		 logger.info("mandateNumber:orgnlmsgnmid if loop = " + orgnlmsgnmid);
	 }
	 
	 var mandateNumber = getHeader(map, "PLCN_mandateNumber");
	 logger.info("mandateNumber:mandateNumber = " + mandateNumber);

	 if(isPatternPresent(msgType, "pacs.008")){
		mandateNumber = "                                   ";
	}
	
	if(msgType == "103"){
		mandateNumber = "                                   ";
	}
	
	
	if(isPatternPresent(msgType, "pacs.004")){
		if(msgDirection == "O"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				mandateNumber = "                                   ";
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003") && !mandateNumber){
				mandateNumber = "                                   ";
			}
		}
		if(msgDirection == "I"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				mandateNumber = "                                   ";
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003") && !mandateNumber){
				mandateNumber = "                                   ";
			}
		}
	}
	logger.info("mandateNumber: mandateNumber for return = " + mandateNumber);
	return mandateNumber;	 
 }
 
 function mandateDateSantander(exchange){
	var inMsg = exchange.getIn();
	 var map = inMsg.getHeaders();
	 var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	 
	 var msgDirection = getHeader(map, "PLCN_msgDirection");
 	 logger.info("mandateDate: msgDirection = " + msgDirection);
	 
	 var msgType = getHeader(map, "PLCN_msgType");
     msgType = msgType.trim();
     logger.info("mandateDate: msgType = " + msgType);
	 
	 var orgnlmsgnmidPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
     var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
     logger.info("mandateDate:orgnlmsgnmid = " + orgnlmsgnmid);
	 
	 if(!orgnlmsgnmid){
		 var orgnlmsgnmidPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
		 var orgnlmsgnmid = getValueFromPath(Document, orgnlmsgnmidPath);
		 logger.info("mandateDate:orgnlmsgnmid = " + orgnlmsgnmid);
	 }
	 
	 if(!orgnlmsgnmid){
		 orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
		 logger.info("mandateDate:orgnlmsgnmid if loop = " + orgnlmsgnmid);
	 }
	 
	 var mandateDate = getHeader(map, "PLCN_mandateDate");
	 logger.info("mandateDate:mandateDate = " + mandateDate);

	 if(isPatternPresent(msgType, "pacs.008")){
		mandateDate = "        ";
	}
	
	if(msgType == "103"){
		mandateDate = "        ";
	}
	
	
	if(isPatternPresent(msgType, "pacs.004")){
		if(msgDirection == "O"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				mandateDate = "        ";
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003") && !mandateDate){
				mandateDate = "        ";
			}
		}
		if(msgDirection == "I"){
			if(isPatternPresent(orgnlmsgnmid, "pacs.008")){
				mandateDate = "        ";
			}
			if(isPatternPresent(orgnlmsgnmid, "pacs.003") && !mandateDate){
				mandateDate = "        ";
			}
		}
	}
	logger.info("mandateDate: mandateDate for return = " + mandateDate);
	return mandateDate; 
 }
 
 function ruleSntdCnfBlockActions(exchange) {
	var processingStage;
	var lastSanctiondate;
	var aceQueueId;
	var currentdate;
	var custom13String;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	lastSanctiondate = getHeader(map, "PLCN_lastSanctiondate");
	logger.info("ruleSntdCnfBlockActions: lastSanctiondate = " + lastSanctiondate);
	custom13String = getHeader(map, "PLCN_custom13String");
	logger.info("ruleSntdCnfBlockActions: custom13String = " + custom13String);
	aceQueueId = getHeader(map, "PLCN_aceQueueId");
	logger.info("ruleSntdCnfBlockActions: aceQueueId = " + aceQueueId);
	
	currentdate = getDate();
	logger.info("ruleSntdCnfBlockActions: currentdate = " + currentdate);
	
/* 	setHeader(map, "PLCN_queue", "PROCDQ");
	setHeader(map, "PLCN_status", "102");
	setHeader(map, "PLCN_processingStage", "FINL");
	custom13String = custom13String.replace("03_WAREHOUSE=Y", "03_WAREHOUSE=N");
	setHeader(map, "PLCN_custom13String", custom13String); */
	
	if(lastSanctiondate == currentdate){
		setHeader(map, "PLCN_f001EodStatus", "Y");
		setHeader(map, "PLCN_f0011EodStatus", "Y");
		setHeader(map, "PLCNCoreEodStatus", "Y");
	}else{
		setHeader(map, "PLCN_f001EodStatus", "A");
		setHeader(map, "PLCN_f0011EodStatus", "A");
		setHeader(map, "PLCN_CoreEodStatus", "A");
	}
	return 0;
}

function purposeFunction(exchange){
	var purpose;
	var use2;
	var orgnlmsgnmid;
	var f70Value;
	var f70Length;
	var noOfSpaces;
    var condition;
	var contractNumber;
	var messagedirection;
	var use1Length;
	var blankSpace;
	var singleBlankSpace;
	var k;
	var msgtype;
	var txntype;
	var formatLabel;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	
	purpose = customMemTblGetTblValue(map, "F007_DEFAULT_VALUES", "USE1");
	use2 = getHeader(map, "PLCN_use2");
	logger.info("purposeFunction: use2 = " + use2);
	contractNumber = getHeader(map, "PLCN_contractNumber");
	logger.info("purposeFunction: contractNumber = " + contractNumber);
	f70Value = getHeader(map, "PLCN_f70Value");
	singleBlankSpace = " ";
	formatLabel = getHeader(map, "PLCN_formatLabel1");
	logger.info("purposeFunction: formatLabel = " + formatLabel);
	msgtype = getHeader(map, "PLCN_msgtype");
	logger.info("purposeFunction: msgtype = " + msgtype);
	txntype = getHeader(map, "PLCN_txntype");
	logger.info("purposeFunction: txntype = " + txntype);
	orgnlmsgnmid = getHeader(map, "PLCN_orgnlmsgnmid");
	logger.info("purposeFunction: orgnlmsgnmid = " + orgnlmsgnmid);
	K = 1;
	messagedirection = getHeader(map, "PLCN_msgDirection");
	logger.info("purposeFunction: messagedirection = " + messagedirection);
	
	
	if(isPatternPresent(msgtype, "pacs.008")){
		purpose = use2.substr(0, 57);
		logger.info("purposeFunction: purpose = " + purpose);
		return purpose;
	}
	
	if(isPatternPresent(msgtype, "pacs.003")){
	    purpose = "                                                         ";
		logger.info("purposeFunction: purpose = " + purpose);
		return purpose;
	}
	if(isPatternPresent(msgtype,"pacs.004")){
	   if(orgnlmsgnmid == "pacs.008.001.08"){
		  purpose = use2.substr(0, 57);
		  logger.info("purposeFunction: purpose = " + purpose);
		  return purpose; 
	   }
	   if(orgnlmsgnmid == "pacs.003.001.08"){
		  purpose = "                                                         ";
		  logger.info("purposeFunction: purpose = " + purpose);
		  return purpose; 
	   }
	}
	return purpose;
}

function currentAuthLevelUpdate(exchange, stage, stageToService){
    logger.info("In currentAuthLevelUpdate")

    var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var institutionid = getHeader(map, "PLCN_institutionId");

    var authLevelKey = institutionId + "." + "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL.STAGES." + stageToService + ".STAGE_ACCESS_CONTROL";
    var authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);

    if(!authLevelValue) {
        authLevelKey = institutionId + "." + "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL" + "." + "INSTITUTION_ACCESS_CONTROL";
        authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
    }
    
    logger.info("currentAuthLevelUpdate: authLevelKey = " + authLevelKey);
    logger.info("currentAuthLevelUpdate: authLevelValue = " + authLevelValue);
    
    authLevelValue = stage + "=" + textToNum(authLevelValue);
    return authLevelValue;
} 