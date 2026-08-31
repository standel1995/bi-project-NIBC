function epcEquensIsoXsdCheck(exchange) {

	var instPath;
	var institutionId;
	var msgFamily;
	var messageClassType;
	var messageDirection;
	var paramname;
	var xsdCheckKey;
	var flagValue;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("inside epcEquensIsoXsdCheck");
	
	institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("epcEquensIsoXsdCheck_institutionId = " + institutionId);
	
	messageDirection = getHeader(map, "PLCN_msgDirection");
	logger.info("epcEquensIsoXsdCheck_messageDirection = " + messageDirection);
	
	if(messageDirection == "I"){
		instPath = institutionId.concat(".MESSAGE_PROCESSING.FUNCTIONALITY.VALIDATION.OUTBOUND");
	}else if(messageDirection == "O"){
		instPath = institutionId.concat(".MESSAGE_PROCESSING.FUNCTIONALITY.VALIDATION.INBOUND");
	}
	logger.info("epcEquensIsoXsdCheck_instPath = " + instPath);
	
	msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	if(!msgFamily){
		msgFamily = getHeader(map, "PLCN_msgFamily");
	}
	if(!msgFamily){
		var paymentType = getHeader(map, "PaymentType");
		logger.info("epcEquensIsoXsdCheck_paymentType: PaymentType = " + paymentType);

		var tmpStr = paymentType.slice(-15);
		msgFamily = removePattern(paymentType, tmpStr);
		logger.info("epcEquensIsoXsdCheck_msgFamily: msgFamily = " + msgFamily);
		logger.info("epcEquensIsoXsdCheck_msgFamily = " + msgFamily);
	}
	msgFamily = msgFamily.toUpperCase();
	logger.info("epcEquensIsoXsdCheck_msgFamily = " + msgFamily);
	
	//SEPA_Pacs.008_XSDCHECK
	messageClassType = getHeader(map, "PLCN_msgType");
	logger.info("epcEquensIsoXsdCheck_messageClassType = " + messageClassType);
	
	if(!messageClassType) {
		messageClassType = getHeader(map, "PLCN_msgTypeTrans");
		logger.info("epcEquensIsoXsdCheck_PLCN_msgTypeTrans = " + messageClassType);
	}
	
	messageClassType = messageClassType.toLowerCase();
	logger.info("epcEquensIsoXsdCheck_messageClassType = " + messageClassType);
	
	if(isPatternPresent(messageClassType , "pacs.008")) {
		paramname = msgFamily.concat("_Pacs.008_XSDCHECK");
	}else if(isPatternPresent(messageClassType , "pacs.004")) {
		paramname = msgFamily.concat("_Pacs.004_XSDCHECK");
	}else if(isPatternPresent(messageClassType , "pacs.002")) {
		paramname = msgFamily.concat("_Pacs.002_XSDCHECK");
	}
	logger.info("epcEquensIsoXsdCheck_paramname = " + paramname);
	if(instPath && paramname){
		xsdCheckKey = instPath.concat(".").concat(paramname);
	}
	logger.info("epcEquensIsoXsdCheck_xsdCheckKey = " + xsdCheckKey);
	
	if(xsdCheckKey){
		flagValue = memTblGetTableValue(map, "INST_PARAM",xsdCheckKey);
	}
	logger.info("epcEquensIsoXsdCheck_flagValue = " + flagValue);
	setHeader(map, "PLCN_xsdCheckFlag",flagValue);

	var Date1 = memTblGetTableValue(map, "USER_CONFIG_MAP", "SEPA_LIB2025_DATE");
	logger.info("epcEquensIsoXsdCheck_Date1 = " + Date1);
	
	var sysDate = getDate();
	//sysDate = "20251005";//for testing
	logger.info("epcEquensIsoXsdCheck_sysDate = " + sysDate);

	if((flagValue == "EQUENS") && (sysDate >= Date1)){
		flagValue = "EQUENS2025";
	}
	
	if((flagValue == "EPC") && (sysDate >= Date1)){
		flagValue = "EPC2025";
	}
	
	if(!flagValue && (sysDate >= Date1)){
		flagValue = "DEFAULT2025";
	}
	
	logger.info("epcEquensIsoXsdCheck_flagValue = " + flagValue);
	
	if(flagValue == "EQUENS"){
		setHeader(map, "PLCN_EQUENS_XSDCHECK", true);
	}else if(flagValue == "EPC"){
		setHeader(map, "PLCN_EPC_XSDCHECK", true);
	}else if(flagValue == "ISO"){
		setHeader(map, "PLCN_ISO_XSDCHECK", true);
	}else if(flagValue == "EPC2025"){
		setHeader(map, "PLCN_EPC2025_XSDCHECK", true);
	}else if(flagValue == "DEFAULT2025"){
		setHeader(map, "PLCN_DEFAULT2025_XSDCHECK", true);
	}else if(flagValue == "EQUENS2025"){
		setHeader(map, "PLCN_EQUENS2025_XSDCHECK", true);
	}
	
}

function msgValidationSepaPacs008(exchange) {
	var result;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In msgValidationSepaPacs008");
	logger.info("msgValidationSepaPacs008: exchange = " + exchange);
	logger.info("msgValidationSepaPacs008: typeof exchange = " + typeof exchange);

	setHeader(map, "PLCN_txnForceStopCounter", 0);
	setHeader(map, "PLCN_errorCountAdd", "Y"); 
	setHeader(map, "PLCN_validMessage", true);
	//setHeader(map, "validFlag", true);

	var plcnInternalcall = getHeader(map,"PLCN_call");
	logger.info("msgValidationSepaPacs008: plcnInternalcall = " + plcnInternalcall);
	logger.info("msgValidationSepaPacs008: typeof plcnInternalcall = " + typeof plcnInternalcall);
	plcnInternalcall = plcnInternalcall.toString();

	var creationCall = getHeader(map,"PLCN_creationCall");
	logger.info("msgValidationSepaPacs008: creationCall = " + creationCall);
	logger.info("msgValidationSepaPacs008: typeof creationCall = " + typeof creationCall);
	creationCall = creationCall.toString();

	var msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	msgFamily = msgFamily.toUpperCase();
	//msgFamily = getHeader(map, "PLCN_msgFamily");
	logger.info("msgValidationSepaPacs008: msgFamily = " + msgFamily);

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("msgValidationSepaPacs008: custom13 = " + custom13);	

	if(isPatternPresent(msgFamily,"SEPA")  && plcnInternalcall == "true"){
		logger.info("msgValidationSepaPacs008: inside 1st loop");
		if(isPatternPresent(custom13, "VALIDATE=Y")){
			wrapperSepaPacs008Mx(exchange);
			custom13 = replacePattern(custom13, "VALIDATE=Y", "VALIDATE=D");
			logger.info("msgValidationSepaPacs008: custom13 = " + custom13);
			setHeader(map, "PLCN_custom13", custom13);
			setHeader(map, "PLCNAPI_custom13", custom13);
		}
	}else{
		logger.info("msgValidationSepaPacs008: External call");
		wrapperSepaPacs008Mx(exchange);
		//wrapperTimelineCheck(exchange);		
	}

	result = getHeader(map, "PLCN_validMessage");
	logger.info("msgValidationSepaPacs008: PLCN_validMessage = " + result);
	logger.info("msgValidationSepaPacs008: typeof PLCN_validMessage = " + typeof result);

	var flag = memTblGetTableValue(map, "FLAG-TABLE", "PROCESS_T2ONLY");
	logger.info("msgValidationSepaPacs008: flag = " + flag);

	flag = flag.trim();

	if(result == true) {
		setHeader(map, "status", "valid");
	}else {
		setHeader(map, "status", "error");

		if(flag == "Y"){
			//SEPA business rule failed
			setCommentsForTransaction("00", "8183", map);
		}
	}
}

function msgValidationSepaPacs004(exchange) {
	var result;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In msgValidationSepaPacs004");
	logger.info("msgValidationSepaPacs004: exchange = " + exchange);
	logger.info("msgValidationSepaPacs004: typeof exchange = " + typeof exchange);

	setHeader(map, "PLCN_txxnForceStopCounter", 0);
	setHeader(map, "PLCN_errorCountAdd", "Y"); 
	setHeader(map, "PLCN_validMessage", true);
	//setHeader(map, "validFlag", true);

	var plcnInternalcall = getHeader(map,"PLCN_call");
	logger.info("msgValidationSepaPacs004: plcnInternalcall = " + plcnInternalcall);
	logger.info("msgValidationSepaPacs004: typeof plcnInternalcall = " + typeof plcnInternalcall);
	plcnInternalcall = plcnInternalcall.toString();

	var creationCall = getHeader(map,"PLCN_creationCall");
	logger.info("msgValidationSepaPacs004: creationCall = " + creationCall);
	logger.info("msgValidationSepaPacs004: typeof creationCall = " + typeof creationCall);
	creationCall = creationCall.toString();

	var msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	msgFamily = msgFamily.toUpperCase();
	//msgFamily = getHeader(map, "PLCN_msgFamily");
	logger.info("msgValidationSepaPacs008: msgFamily = " + msgFamily);

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("msgValidationSepaPacs004: custom13 = " + custom13);	

	if(isPatternPresent(msgFamily,"SEPA")  && plcnInternalcall == "true"){
		logger.info("msgValidationSepaPacs004: inside 1st loop");
		if(isPatternPresent(custom13, "VALIDATE=Y")){
			wrapperSepaPacs004Mx(exchange);
			custom13 = replacePattern(custom13, "VALIDATE=Y", "VALIDATE=D");
			logger.info("msgValidationSepaPacs004: custom13 = " + custom13);
			setHeader(map, "PLCN_custom13", custom13);
			setHeader(map, "PLCNAPI_custom13", custom13);
		}
	}else{
		logger.info("msgValidationSepaPacs004: External call");
		wrapperSepaPacs004Mx(exchange);
		//wrapperTimelineCheck(exchange);
	}

	result = getHeader(map, "PLCN_validMessage");
	logger.info("msgValidationSepaPacs004: PLCN_validMessage = " + result);
	logger.info("msgValidationSepaPacs004: typeof PLCN_validMessage = " + typeof result);

	var flag = memTblGetTableValue(map, "FLAG-TABLE", "PROCESS_T2ONLY");
	logger.info("msgValidationSepaPacs004: flag = " + flag);

	flag = flag.trim();

	if(result == true) {
		setHeader(map, "status", "valid");
	}else {
		setHeader(map, "status", "error");

		if(flag == "Y"){
			//SEPA business rule failed
			setCommentsForTransaction("00", "8183", map);
		}
	}
}

function ibanValidationSepaPacs004(exchange) {
	var val;
	var retVal = 0;

	logger.info("In ibanValidationSepaPacs004");

	val = validateSttlmAcctIbanSepaPacs004(exchange);
	if(val) {
		retVal = val;
	}

	val = validateOrgnlCdtrAgtAcctIbanSepaPacs004(exchange);
	if(val) {
		retVal = retVal + val;
	}

	val = validateOrgnlDbtrAcctIbanSepaPacs004(exchange);
	if(val) {
		retVal = retVal + val;
	}

	val = validateOrgnlDbtrAgtAcctIbanSepaPacs004(exchange);
	if(val) {
		retVal = retVal + val;
	}

	val = validateDbtrAcctIbanSepaPacs004(exchange);	
	if(val) {
		retVal = retVal + val;
	}

	val = validateDbtrAgtAcctIbanSepaPacs004(exchange);
	if(val) {
		retVal = retVal + val;
	}

	val = validateCdtrAgtAcctIbanSepaPacs004(exchange);
	if(val) {
		retVal = retVal + val;
	}

	val = validateCdtrAcctIbanSepaPacs004(exchange);
	if(val) {
		retVal = retVal + val;
	}
	return retVal;
}

/**
* This function validates IBAN for Settlement Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateSttlmAcctIbanSepaPacs004(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateSttlmAcctIbanSepaPacs004");
	path = "/Document/PmtRtr/GrpHdr/SttlmInf/SttlmAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateSttlmAcctIbanSepaPacs004: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateSttlmAcctIbanSepaPacs004: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("135", "5714", map); 
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/SttlmInf/SttlmAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateSttlmAcctIbanSepaPacs004: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateSttlmAcctIbanSepaPacs004: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("926", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/SttlmInf/InstgRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateSttlmAcctIbanSepaPacs004: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateSttlmAcctIbanSepaPacs004: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("975", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/SttlmInf/InstdRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateSttlmAcctIbanSepaPacs004: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateSttlmAcctIbanSepaPacs004: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("1023", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);		
	}

	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/SttlmInf/ThrdRmbrsmntAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateSttlmAcctIbanSepaPacs004: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateSttlmAcctIbanSepaPacs004: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("1071", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	return retVal;
}

/**
* This function validates IBAN for Orginal Creditor Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateOrgnlCdtrAgtAcctIbanSepaPacs004(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateOrgnlCdtrAgtAcctIbanSepaPacs004");
	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlCdtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateOrgnlCdtrAgtAcctIbanSepaPacs004: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateOrgnlCdtrAgtAcctIbanSepaPacs004: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("1279", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}
	return retVal;
}

/**
* This function validates IBAN for Original Debtor Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateOrgnlDbtrAcctIbanSepaPacs004(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateOrgnlDbtrAcctIbanSepaPacs004");
	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlDbtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateOrgnlDbtrAcctIbanSepaPacs004: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateOrgnlDbtrAcctIbanSepaPacs004: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("1376", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);		
	}
	return retVal;
}

/**
* This function validates IBAN for Original Debtor Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateOrgnlDbtrAgtAcctIbanSepaPacs004(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateOrgnlDbtrAgtAcctIbanSepaPacs004");
	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/MndtRltdInf/AmdmntInfDtls/OrgnlDbtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateOrgnlDbtrAgtAcctIbanSepaPacs004: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateOrgnlDbtrAgtAcctIbanSepaPacs004: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("1471", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	return retVal;
}

/**
* This function validates IBAN for Debtor Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateDbtrAcctIbanSepaPacs004(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateDbtrAcctIbanSepaPacs004");
	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateDbtrAcctIbanSepaPacs004: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateDbtrAcctIbanSepaPacs004: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("2077", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);		
	}

	return retVal;
}

/**
* This function validates IBAN for Debtor Agent Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateDbtrAgtAcctIbanSepaPacs004(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateDbtrAgtAcctIbanSepaPacs004");
	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateDbtrAgtAcctIbanSepaPacs004: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateDbtrAgtAcctIbanSepaPacs004: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("2125", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	return retVal;
}

/**
* This function validates IBAN for Creditor Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateCdtrAcctIbanSepaPacs004(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateCdtrAcctIbanSepaPacs004");
	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateCdtrAcctIbanSepaPacs004: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateCdtrAcctIbanSepaPacs004: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("2274", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	return retVal;
}

/**
* This function validates IBAN for Creditor Agent Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateCdtrAgtAcctIbanSepaPacs004(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateCdtrAgtAcctIbanSepaPacs004");
	path = "/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateCdtrAgtAcctIbanSepaPacs004: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateCdtrAgtAcctIbanSepaPacs004: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("2177", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	return retVal;
}

function msgValidationSepaCamt056(exchange) {
	var result;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In msgValidationSepaCamt056");
	logger.info("msgValidationSepaCamt056: exchange = " + exchange);
	logger.info("msgValidationSepaCamt056: typeof exchange = " + typeof exchange);

	setHeader(map, "PLCN_txnForceStopCounter", 0);
	setHeader(map, "PLCN_errorCountAdd", "Y"); 
	setHeader(map, "PLCN_validMessage", true);
	//setHeader(map, "validFlag", true);

	var plcnInternalcall = getHeader(map,"PLCN_call");
	logger.info("msgValidationSepaCamt056: plcnInternalcall = " + plcnInternalcall);
	logger.info("msgValidationSepaCamt056: typeof plcnInternalcall = " + typeof plcnInternalcall);
	plcnInternalcall = plcnInternalcall.toString();

	var creationCall = getHeader(map,"PLCN_creationCall");
	logger.info("msgValidationSepaCamt056: creationCall = " + creationCall);
	logger.info("msgValidationSepaCamt056: typeof creationCall = " + typeof creationCall);
	creationCall = creationCall.toString();

	var msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	msgFamily = msgFamily.toUpperCase();
	//msgFamily = getHeader(map, "PLCN_msgFamily");
	logger.info("msgValidationSepaPacs008: msgFamily = " + msgFamily);

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("msgValidationSepaCamt056: custom13 = " + custom13);	

	if(isPatternPresent(msgFamily,"SEPA")  && plcnInternalcall == "true"){
		logger.info("msgValidationSepaCamt056: inside 1st loop");
		if(isPatternPresent(custom13, "VALIDATE=Y")){
			wrapperSepaCamt056Mx(exchange);
			custom13 = replacePattern(custom13, "VALIDATE=Y", "VALIDATE=D");
			logger.info("msgValidationSepaCamt056: custom13 = " + custom13);
			setHeader(map, "PLCN_custom13", custom13);
			setHeader(map, "PLCNAPI_custom13", custom13);
		}
	}else{
		logger.info("msgValidationSepaCamt056: External call");
		wrapperSepaCamt056Mx(exchange);
		//wrapperTimelineCheck(exchange);
	}

	result = getHeader(map, "PLCN_validMessage");
	result = true; //for testing
	logger.info("msgValidationSepaCamt056: PLCN_validMessage = " + result);
	logger.info("msgValidationSepaCamt056: typeof PLCN_validMessage = " + typeof result);

	var flag = memTblGetTableValue(map, "FLAG-TABLE", "PROCESS_T2ONLY");
	logger.info("msgValidationSepaCamt056: flag = " + flag);

	flag = flag.trim();

	if(result == true) {
		setHeader(map, "status", "valid");
	}else {
		setHeader(map, "status", "error");

		if(flag == "Y"){
			//SEPA business rule failed
			setCommentsForTransaction("00", "8183", map);
		}
	}
}

function msgValidationSepaCamt029(exchange) {
	var result;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In msgValidationSepaCamt029");
	logger.info("msgValidationSepaCamt029: exchange = " + exchange);
	logger.info("msgValidationSepaCamt029: typeof exchange = " + typeof exchange);

	setHeader(map, "PLCN_txnForceStopCounter", 0);
	setHeader(map, "PLCN_errorCountAdd", "Y"); 
	setHeader(map, "PLCN_validMessage", true);
	//setHeader(map, "validFlag", true);

	var plcnInternalcall = getHeader(map,"PLCN_call");
	logger.info("msgValidationSepaCamt029: plcnInternalcall = " + plcnInternalcall);
	logger.info("msgValidationSepaCamt029: typeof plcnInternalcall = " + typeof plcnInternalcall);
	plcnInternalcall = plcnInternalcall.toString();

	var creationCall = getHeader(map,"PLCN_creationCall");
	logger.info("msgValidationSepaCamt029: creationCall = " + creationCall);
	logger.info("msgValidationSepaCamt029: typeof creationCall = " + typeof creationCall);
	creationCall = creationCall.toString();

	var msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	msgFamily = msgFamily.toUpperCase();
	//msgFamily = getHeader(map, "PLCN_msgFamily");
	logger.info("msgValidationSepaPacs008: msgFamily = " + msgFamily);

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("msgValidationSepaCamt029: custom13 = " + custom13);	

	if(isPatternPresent(msgFamily,"SEPA")  && plcnInternalcall == "true"){
		logger.info("msgValidationSepaCamt029: inside 1st loop");
		if(isPatternPresent(custom13, "VALIDATE=Y")){
			wrapperSepaCamt029Mx(exchange);
			custom13 = replacePattern(custom13, "VALIDATE=Y", "VALIDATE=D");
			logger.info("msgValidationSepaCamt029: custom13 = " + custom13);
			setHeader(map, "PLCN_custom13", custom13);
			setHeader(map, "PLCNAPI_custom13", custom13);
		}
	}else{
		logger.info("msgValidationSepaCamt029: External call");
		wrapperSepaCamt029Mx(exchange);
		//wrapperTimelineCheck(exchange);
	}

	result = getHeader(map, "PLCN_validMessage");
	result = true; //for testing
	logger.info("msgValidationSepaCamt029: PLCN_validMessage = " + result);
	logger.info("msgValidationSepaCamt029: typeof PLCN_validMessage = " + typeof result);

	var flag = memTblGetTableValue(map, "FLAG-TABLE", "PROCESS_T2ONLY");
	logger.info("msgValidationSepaCamt029: flag = " + flag);

	flag = flag.trim();

	if(result == true) {
		setHeader(map, "status", "valid");
	}else {
		setHeader(map, "status", "error");

		if(flag == "Y"){
			//SEPA business rule failed
			setCommentsForTransaction("00", "8183", map);
		}
	}
}

/*.............................................................................. DPH 9.7 .................................................................*/
function msgValidationSepaPacs002(exchange) {
	var result;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In msgValidationSepaPacs002");
	logger.info("msgValidationSepaPacs002: exchange = " + exchange);
	logger.info("msgValidationSepaPacs002: typeof exchange = " + typeof exchange);

	setHeader(map, "PLCN_txxnForceStopCounter", 0);
	setHeader(map, "PLCN_errorCountAdd", "Y"); 
	setHeader(map, "PLCN_validMessage", true);
	//setHeader(map, "validFlag", true);

	var plcnInternalcall = getHeader(map,"PLCN_call");
	logger.info("msgValidationSepaPacs002: plcnInternalcall = " + plcnInternalcall);
	logger.info("msgValidationSepaPacs002: typeof plcnInternalcall = " + typeof plcnInternalcall);
	plcnInternalcall = plcnInternalcall.toString();

	var msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	logger.info("msgValidationSepaPacs002: msgFamily = " + msgFamily);

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("msgValidationSepaPacs002: custom13 = " + custom13);	

	if(isPatternPresent(msgFamily,"SEPA")  && plcnInternalcall == "true"){
		logger.info("msgValidationSepaPacs002: inside 1st loop");
		if(isPatternPresent(custom13, "VALIDATE=Y")){
			wrapperSepaPacs002Mx(exchange);
			custom13 = replacePattern(custom13, "VALIDATE=Y", "VALIDATE=D");
			logger.info("msgValidationSepaPacs002: custom13 = " + custom13);
			setHeader(map, "PLCN_custom13", custom13);
		}
	}else{
		wrapperSepaPacs002Mx(exchange);
	}

	result = getHeader(map, "PLCN_validMessage");
	logger.info("msgValidationSepaPacs002: PLCN_validMessage = " + result);
	logger.info("msgValidationSepaPacs002: typeof PLCN_validMessage = " + typeof result);

	var flag = memTblGetTableValue(map, "FLAG-TABLE", "PROCESS_T2ONLY");
	logger.info("msgValidationSepaPacs002: flag = " + flag);

	flag = flag.trim();

	if(result == true) {
		setHeader(map, "status", "valid");
	}else {
		setHeader(map, "status", "error");

		if(flag == "Y"){
			//SEPA business rule failed
			setCommentsForTransaction("00", "8183", map);
		}
	}
}

function msgValidationSepaPacs003(exchange) {
	var result;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In msgValidationSepaPacs003");
	logger.info("msgValidationSepaPacs003: exchange = " + exchange);
	logger.info("msgValidationSepaPacs003: typeof exchange = " + typeof exchange);

	setHeader(map, "PLCN_txxnForceStopCounter", 0);
	setHeader(map, "PLCN_errorCountAdd", "Y"); 
	setHeader(map, "PLCN_validMessage", true);
	setHeader(map, "validFlag", true);

	//wrapperSepaPacs003Mx(exchange);

	var plcnInternalcall = getHeader(map,"PLCN_call");
	logger.info("msgValidationSepaPacs003: plcnInternalcall = " + plcnInternalcall);
	logger.info("msgValidationSepaPacs003: typeof plcnInternalcall = " + typeof plcnInternalcall);
	plcnInternalcall = plcnInternalcall.toString();

	var creationCall = getHeader(map,"PLCN_creationCall");
	logger.info("msgValidationSepaPacs003: creationCall = " + creationCall);
	logger.info("msgValidationSepaPacs003: typeof creationCall = " + typeof creationCall);
	creationCall = creationCall.toString();

	var msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	msgFamily = msgFamily.toUpperCase();
	logger.info("msgValidationSepaPacs003: msgFamily = " + msgFamily);

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("msgValidationSepaPacs003: custom13 = " + custom13);	

	if(isPatternPresent(msgFamily,"SEPA")  && plcnInternalcall == "true"){
		logger.info("msgValidationSepaPacs003: inside 1st loop");
		if(isPatternPresent(custom13, "VALIDATE=Y")){
			wrapperSepaPacs003Mx(exchange);
			//wrapperTimelineCheck(exchange);
			custom13 = replacePattern(custom13, "VALIDATE=Y", "VALIDATE=D");
			logger.info("msgValidationSepaPacs003: custom13 = " + custom13);
			setHeader(map, "PLCN_custom13", custom13);
			setHeader(map, "PLCNAPI_custom13", custom13);
		}
	}else{
		wrapperSepaPacs003Mx(exchange);
		//wrapperTimelineCheck(exchange);	
	}

	result = getHeader(map, "PLCN_validMessage");
	logger.info("msgValidationSepaPacs003: PLCN_validMessage = " + result);
	logger.info("msgValidationSepaPacs003: typeof PLCN_validMessage = " + typeof result);

	resultTimelineCheck = getHeader(map, "PLCN_validTimeline");
	logger.info("msgValidationSepaPacs003: PLCN_validTimeline = " + resultTimelineCheck);
	logger.info("msgValidationSepaPacs003: typeof PLCN_validTimeline = " + typeof resultTimelineCheck);

	var flag = memTblGetTableValue(map, "FLAG-TABLE", "PROCESS_T2ONLY");
	logger.info("msgValidationSepaPacs003: flag = " + flag);

	flag = flag.trim();

	/*if(result == true && resultTimelineCheck == true) {
		result = true;
	}else{
		result = false;
	}*/

	logger.info("msgValidationSepaPacs003: result = " + result);

	if(result == true) {
		setHeader(map, "status", "valid");
	}else {
		setHeader(map, "status", "error");

		if(flag == "Y"){
			//SEPA business rule failed
			setCommentsForTransaction("00", "8183", map);
		}
	}
}

function msgValidationSepaPacs004SDD(exchange) {
	var result;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In msgValidationSepaPacs004SDD");
	logger.info("msgValidationSepaPacs004SDD: exchange = " + exchange);
	logger.info("msgValidationSepaPacs004SDD: typeof exchange = " + typeof exchange);

	setHeader(map, "PLCN_txxnForceStopCounter", 0);
	setHeader(map, "PLCN_errorCountAdd", "Y"); 
	setHeader(map, "PLCN_validMessage", true);
	//setHeader(map, "validFlag", true);

	var plcnInternalcall = getHeader(map,"PLCN_call");
	logger.info("msgValidationSepaPacs004SDD: plcnInternalcall = " + plcnInternalcall);
	logger.info("msgValidationSepaPacs004SDD: typeof plcnInternalcall = " + typeof plcnInternalcall);
	plcnInternalcall = plcnInternalcall.toString();

	var creationCall = getHeader(map,"PLCN_creationCall");
	logger.info("msgValidationSepaPacs003: creationCall = " + creationCall);
	logger.info("msgValidationSepaPacs003: typeof creationCall = " + typeof creationCall);
	creationCall = creationCall.toString();

	var msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	msgFamily = msgFamily.toUpperCase();
	//msgFamily = getHeader(map, "PLCN_msgFamily");
	logger.info("msgValidationSepaPacs004SDD: msgFamily = " + msgFamily);

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("msgValidationSepaPacs004SDD: custom13 = " + custom13);	

	/*if(isPatternPresent(msgFamily,"SEPA")  && plcnInternalcall == "true"){
		logger.info("msgValidationSepaPacs004SDD: inside 1st loop");
		if(isPatternPresent(custom13, "VALIDATE=Y")){
			wrapperSepaPacs004Mx(exchange);
			custom13 = replacePattern(custom13, "VALIDATE=Y", "VALIDATE=D");
			logger.info("msgValidationSepaPacs004SDD: custom13 = " + custom13);
			setHeader(map, "PLCN_custom13", custom13);
		}else if(creationCall == "true"){
			logger.info("msgValidationSepaPacs003: creationCall = true");
			wrapperSepaPacs003Mx(exchange);
			wrapperTimelineCheck(exchange);		
		}
	}*/

	result = true; //getHeader(map, "PLCN_validMessage");
	logger.info("msgValidationSepaPacs004SDD: PLCN_validMessage = " + result);
	logger.info("msgValidationSepaPacs004SDD: typeof PLCN_validMessage = " + typeof result);

	var flag = memTblGetTableValue(map, "FLAG-TABLE", "PROCESS_T2ONLY");
	logger.info("msgValidationSepaPacs004SDD: flag = " + flag);

	flag = flag.trim();

	if(result == true) {
		setHeader(map, "status", "valid");
	}else {
		setHeader(map, "status", "error");

		if(flag == "Y"){
			//SEPA business rule failed
			setCommentsForTransaction("00", "8183", map);
		}
	}
}

function msgValidationSepaPacs007(exchange) {
	var result;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In msgValidationSepaPacs007");
	logger.info("msgValidationSepaPacs007: exchange = " + exchange);
	logger.info("msgValidationSepaPacs007: typeof exchange = " + typeof exchange);

	setHeader(map, "PLCN_txxnForceStopCounter", 0);
	setHeader(map, "PLCN_errorCountAdd", "Y"); 
	setHeader(map, "PLCN_validMessage", true);
	//setHeader(map, "validFlag", true);

	var plcnInternalcall = getHeader(map,"PLCN_call");
	logger.info("msgValidationSepaPacs007: plcnInternalcall = " + plcnInternalcall);
	logger.info("msgValidationSepaPacs007: typeof plcnInternalcall = " + typeof plcnInternalcall);
	plcnInternalcall = plcnInternalcall.toString();

	var creationCall = getHeader(map,"PLCN_creationCall");
	logger.info("msgValidationSepaPacs003: creationCall = " + creationCall);
	logger.info("msgValidationSepaPacs003: typeof creationCall = " + typeof creationCall);
	creationCall = creationCall.toString();

	var msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	msgFamily = msgFamily.toUpperCase();
	//msgFamily = getHeader(map, "PLCN_msgFamily");
	logger.info("msgValidationSepaPacs008: msgFamily = " + msgFamily);

	var custom13 = getHeader(map, "PLCN_custom13");
	logger.info("msgValidationSepaPacs007: custom13 = " + custom13);	

	if(isPatternPresent(msgFamily,"SEPA")  && plcnInternalcall == "true"){
		logger.info("msgValidationSepaPacs007: inside 1st loop");
		if(isPatternPresent(custom13, "VALIDATE=Y")){
			wrapperSepaPacs007Mx(exchange);
			custom13 = replacePattern(custom13, "VALIDATE=Y", "VALIDATE=D");
			logger.info("msgValidationSepaPacs007: custom13 = " + custom13);
			setHeader(map, "PLCN_custom13", custom13);
			setHeader(map, "PLCNAPI_custom13", custom13);
		}
	}else{
		wrapperSepaPacs007Mx(exchange);
	}

	result = getHeader(map, "PLCN_validMessage");
	logger.info("msgValidationSepaPacs007: PLCN_validMessage = " + result);
	logger.info("msgValidationSepaPacs007: typeof PLCN_validMessage = " + typeof result);

	var flag = memTblGetTableValue(map, "FLAG-TABLE", "PROCESS_T2ONLY");
	logger.info("msgValidationSepaPacs007: flag = " + flag);

	flag = flag.trim();

	if(result == true) {
		setHeader(map, "status", "valid");
	}else {
		setHeader(map, "status", "error");

		if(flag == "Y"){
			//SEPA business rule failed
			setCommentsForTransaction("00", "8183", map);
		}
	}
}


/*.............................................................................. DPH 9.7 .................................................................*/

function wrapperTimelineCheck(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In wrapperTimelineCheck");

	setHeader(map, "PLCN_validTimeline", true); //for testing
	//setCommentsForTransaction("00", "8962", map);
	logger.info("wrapperTimelineCheck: PLCN_validTimeline = " + getHeader(map, "PLCN_validTimeline"));
}

function wrapperSepaPacs008Mx(exchange) {
	logger.info("wrapperSepaPacs008Mx");
	var retVal;
	var commentsB2b;
	var pacs08ValdFlagMx;
	var txnComments;
	var inMsg;
	var map;
	var Document;
	var tenantName;
	var tenantNamePath;
	var manualMode;

	logger.info('wrapperSepaPacs008Mx:In wrapperSepaPacs008Mx');
	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	pacs08ValdFlagMx = memTblGetTableValue(map, "FLAG-TABLE", "PACS08_VALD_FLAG_MX");
	pacs08ValdFlagMx = pacs08ValdFlagMx.trim();
	logger.info("pacs08ValdFlagMx = " + pacs08ValdFlagMx);
	var institutionId = getHeader(map, "PLCN_institutionId");
	tenantName = getHeader(map, "PLCN_tenantName");
	logger.info("wrapperSepaPacs008Mx: tenantName = " + tenantName);
	if(!tenantName){
		var tenantNamePath = institutionId + ".INSTITUTION_DETAILS.TENANT_NAME";
		logger.info("wrapperSepaPacs008Mx: tenantName = " + tenantNamePath);
		tenantName = memTblGetTableValue(map, "INST_PARAM",tenantNamePath);
		logger.info("wrapperSepaPacs008Mx: tenantName = " + tenantName);
	}
	manualMode = getHeader(map, "PLCN_manualMode");
	logger.info("wrapperSepaPacs008Mx: manualMode " +manualMode);
	
	if(pacs08ValdFlagMx == 'ERROR') {

		logger.info("wrapperSepaPacs008Mx: Calling sepaValidationRulesPacs008");
		retVal = sepaValidationRulesPacs008(pacs08ValdFlagMx, exchange);
		logger.info("wrapperSepaPacs008Mx: retVal from sepaValidationRulesPacs008 = " + retVal);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs008Mx: txnComments = " + txnComments);

		if(retVal == 0) {
			logger.info("wrapperSepaPacs008Mx: Calling externalCodelistValidationSepaPacs008");
			//retVal = externalCodelistValidationSepaPacs008(Document, map);		
			txnComments = getHeader(map, "PLCN_txnComments");
			logger.info("txnComments from externalCodelistValidationSepaPacs008 = " + txnComments);			
		}

		if(retVal == 0) {
			logger.info("wrapperSepaPacs008Mx: Calling ibanValidationSepaPacs008");
			retVal = ibanValidationSepaPacs008(exchange);
			txnComments = getHeader(map, "PLCN_txnComments");
			logger.info("wrapperSepaPacs008Mx: txnComments from ibanValidationSepaPacs008 = " + txnComments);
		}
		
		if(retVal == 0) {
		logger.info("wrapperSepaPacs008Mx: Calling constraintsISORulesSEPAPacs008");
		constraintsISORulesSEPAPacs008(pacs08ValdFlagMx,exchange);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs008Mx: txnComments from constraintsISORulesSEPAPacs008 = " + txnComments);
		}
		
		if(retVal == 0 && manualMode == "REPAIR" && (tenantName == "SNTDBK" || tenantName == "PLNT01")) {
		logger.info("wrapperSepaPacs008Mx: Calling sepaCustomValidationsPacs008");
		sepaCustomValidationsPacs008(pacs08ValdFlagMx,exchange);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs008Mx: txnComments from sepaCustomValidationsPacs008 = " + txnComments);
		}
	}

	if(pacs08ValdFlagMx == 'WARNING') {

		logger.info("wrapperSepaPacs008Mx: Calling sepaValidationRulesPacs008");
		retVal = sepaValidationRulesPacs008(pacs08ValdFlagMx, exchange);
		logger.info("wrapperSepaPacs008Mx: retVal from sepaValidationRulesPacs008 = " + retVal);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs008Mx: txnComments = " + txnComments);

		logger.info("wrapperSepaPacs008Mx: Calling externalCodelistValidationSepaPacs008");
		retVal = externalCodelistValidationSepaPacs008(Document, map);		
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("txnComments from externalCodelistValidationSepaPacs008 = " + txnComments);			
		
		logger.info("wrapperSepaPacs008Mx: Calling ibanValidationSepaPacs008");
		ibanValidationSepaPacs008(exchange);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs008Mx: txnComments from ibanValidationSepaPacs008 = " + txnComments);
		
		logger.info("wrapperSepaPacs008Mx: Calling constraintsISORulesSEPAPacs008");
		constraintsISORulesSEPAPacs008(pacs08ValdFlagMx,exchange);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs008Mx: txnComments from constraintsISORulesSEPAPacs008 = " + txnComments);

	}
}

function sepaValidationRulesPacs008(pacs08ValdFlagMx, exchange){
	logger.info("sepaValidationRulesPacs008");
	var retVal;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	retVal = 0;

	if(pacs08ValdFlagMx == "ERROR") {

		retVal = inclusionCdPrtryRuleSepaPacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = townNameAndCountryRuleSepaPacs8(exchange); //STRUCTURED ADDRESS
		if(retVal != 0) {
			return retVal;
		}
		retVal = adrLineOptinalElementRuleSepaPacs8(exchange); //UNSTRUCTURED ADDRESS
		if(retVal != 0) {
			return retVal;
		}
		retVal = hybridAddressRuleSepaPacs8(exchange); //HYBRID ADDRESS
		if(retVal != 0) {
			return retVal;
		}
		retVal = adrLineCtryAllowedRuleSepaPacs8(exchange);
		if(retVal != 0) {
			return retVal;
		}
		retVal = adrTpNotAllowedRuleSepaPacs8(exchange);
		if(retVal != 0) {
			return retVal;
		}
		retVal = orgIdRuleSepaPacs8(exchange);
		if(retVal != 0) {
			return retVal;
		}
		retVal = prvtIdRuleSepaPacs8(exchange);
		if(retVal != 0) {
			return retVal;
		}
		/*retVal = dbtrAcctPrxyCheckRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = cdtrAcctPrxyCheckRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}*/

		retVal = sepaPacs008BicValDebtor(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs008BicValDebtorAgent(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs008BicValInstrgRmbrsmntAgt(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs008BicValInstdRmbrsmntAgt(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs008BicValThrdRmbrsmntAgt(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs008BicValIntrmyAgt1(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs008BicValCdtrAgt(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs008BicValCdtr(exchange);
		if(retVal != 0) {
			return retVal;
		}

		/*retVal = sepaPacs008Vr00660Mx(Document, map);
		if(retVal != 0) {
			return retVal;
		}*/

		retVal = sepaPacs008BicValInstgAgt(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs008BicValInstdAgt(exchange);
		if(retVal != 0) {
			return retVal;
		}
		retVal = sepaPacs008BicValAgt(exchange);
		if(retVal != 0) {
			return retVal;
		}
	}
	if(pacs08ValdFlagMx == "WARNING") {

		//retVal = amtMinMaxLengthCheckPacs008(exchange);
		retVal = inclusionCdPrtryRuleSepaPacs008(Document, map);
		retVal = townNameAndCountryRuleSepaPacs8(exchange);
		retVal = adrLineOptinalElementRuleSepaPacs8(exchange);
		retVal = hybridAddressRuleSepaPacs8(exchange);
		retVal = adrLineCtryAllowedRuleSepaPacs8(exchange);
		retVal = adrTpNotAllowedRuleSepaPacs8(exchange);
		retVal = orgIdRuleSepaPacs8(exchange);
		retVal = prvtIdRuleSepaPacs8(exchange);
		//retVal = dbtrAcctPrxyCheckRulePacs008(Document, map);
		//retVal = cdtrAcctPrxyCheckRulePacs008(Document, map);
		retVal = sepaPacs008BicValDebtor(exchange);
		retVal = sepaPacs008BicValDebtorAgent(exchange);
		retVal = sepaPacs008BicValInstrgRmbrsmntAgt(exchange);
		retVal = sepaPacs008BicValInstdRmbrsmntAgt(exchange);
		retVal = sepaPacs008BicValThrdRmbrsmntAgt(exchange);
		retVal = sepaPacs008BicValIntrmyAgt1(exchange);
		retVal = sepaPacs008BicValCdtrAgt(exchange);
		retVal = sepaPacs008BicValCdtr(exchange);
		retVal = sepaPacs008BicValInstgAgt(exchange);
		retVal = sepaPacs008BicValInstdAgt(exchange);
		retVal = sepaPacs008BicValAgt(exchange);
	}
	return retVal;
}

function ibanValidationSepaPacs008(exchange) {
	var val;
	var retVal = 0;

	logger.info("In ibanValidationSepaPacs008");
	logger.info("ibanValidationSepaPacs008: exchange = " + exchange);
	logger.info("ibanValidationSepaPacs008: typeof exchange = " + typeof exchange);

	val = validatePrvsInstgAgt1AcctIbanSepaPacs008(exchange);
	if(val) {
		retVal = val;
	}

	val = validatePrvsInstgAgt2AcctIbanSepaPacs008(exchange);
	if(val) {
		retVal = retVal + val;
	}

	val = validatePrvsInstgAgt3AcctIbanSepaPacs008(exchange);
	if(val) {
		retVal = retVal + val;
	}

	val = validateIntrmyAgt1AcctIbanSepaPacs008(exchange);
	if(val) {
		retVal = retVal + val;
	}

	val = validateIntrmyAgt2AcctIbanSepaPacs008(exchange);	
	if(val) {
		retVal = retVal + val;
	}

	val = validateIntrmyAgt3AcctIbanSepaPacs008(exchange);
	if(val) {
		retVal = retVal + val;
	}

	val = validateDbtrAcctIbanSepaPacs008(exchange);
	if(val) {
		retVal = retVal + val;
	}

	val = validateDbtrAgtAcctIbanSepaPacs008(exchange);
	if(val) {
		retVal = retVal + val;
	}

	val = validateCdtrAgtAcctIbanSepaPacs008(exchange);
	if(val) {
		retVal = retVal + val;
	}

	val = validateCdtrAcctIbanSepaPacs008(exchange);
	if(val) {
		retVal = retVal + val;
	}
	return retVal;
}

/**
* This function validates "Debtor" BIC
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
* @returns {String} return 0 for valid message otherwise returns violation raised for invalid message.
*/
function sepaPacs008BicValDebtor(exchange) {
	var temp;
	var bic;
	var len;
	var bicCheck;
	var retVal;
	var bicfiPath;
	var bicfiVar;
	var upperBic;

	logger.info('In sepaPacs008BicValDebtor');
	bicfiPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Id/OrgId/AnyBIC";
	retVal = validateBicFromPath(exchange, bicfiPath, "Dbtr", "798");

	return retVal;
}

/**
* This function validates "Debtor Agent" BIC
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
* @returns {String} return 0 for valid message otherwise returns violation raised for invalid message.
*/
function sepaPacs008BicValDebtorAgent(exchange) {
	var temp;
	var bic;
	var len;
	var bicCheck;
	var retVal;
	var bicfiPath;
	var bicfiVar;
	var retVal;
	var upperBic;

	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info('In sepaPacs008BicValDebtorAgent');
	bicfiPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI";
	var bicfi = getValueFromPath(Document,bicfiPath);
	logger.info("sepaPacs008BicValDebtorAgent: bicfi= " +bicfi);
	retVal = validateBicFromPath(exchange, bicfiPath, "DbtrAgt", "841");

	return retVal;
}

/**
* This function validates "Instructing Reimbursement Agent" BIC
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
* @returns {String} return 0 for valid message otherwise returns violation raised for invalid message.
*/
function sepaPacs008BicValInstrgRmbrsmntAgt(exchange) {
	var temp;
	var bic;
	var len;
	var bicCheck;
	var retVal;
	var bicfiPath;
	var bicfiVar;
	var retVal;
	var upperBic;

	logger.info('In sepaPacs008BicValInstrgRmbrsmntAgt');
	bicfiPath = '/Document/FIToFICstmrCdtTrf/GrpHdr/SttlmInf/InstgRmbrsmntAgt/FinInstnId/BICFI';
	retVal = validateBicFromPath(exchange, bicfiPath, "InstgRmbrsmntAgt", "150");

	return retVal;
}

/**
* This function validates "Instructed Reimbursement Agent" BIC
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
* @returns {String} return 0 for valid message otherwise returns violation raised for invalid message.
*/
function sepaPacs008BicValInstdRmbrsmntAgt(exchange) {
	var temp;
	var bic;
	var len;
	var bicCheck;
	var retVal; 
	var bicfiPath;
	var bicfiVar;
	
	logger.info('In sepaPacs008BicValInstdRmbrsmntAgt');
	bicfiPath = '/Document/FIToFICstmrCdtTrf/GrpHdr/SttlmInf/InstdRmbrsmntAgt/FinInstnId/BICFI';
	retVal = validateBicFromPath(exchange, bicfiPath, "InstdRmbrsmntAgt", "198");

	return retVal;
}

/**
* This function validates "Third Reimbursement Agent" BIC
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
* @returns {String} return 0 for valid message otherwise returns violation raised for invalid message.
*/
function sepaPacs008BicValThrdRmbrsmntAgt(exchange) {
	var temp;
	var bic;
	var len;
	var bicCheck;
	var retVal;
	var bicfiPath;
	var bicfiVar;
	
	logger.info('In sepaPacs008BicValThrdRmbrsmntAgt');
	bicfiPath = '/Document/GrpHdr/SttlmInf/ThrdRmbrsmntAgt/FinInstnId/BICFI';
	retVal = validateBicFromPath(exchange, bicfiPath, "ThrdRmbrsmntAgt", "246");

	return retVal;	
}

/**
* This function validates "Intermediary Agent1" BIC
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
* @returns {String} return 0 for valid message otherwise returns violation raised for invalid message.
*/
function sepaPacs008BicValIntrmyAgt1(exchange) {
	var temp;
	var bic;
	var len;
	var bicCheck;
	var retVal;
	var bicfiPath;
	var bicfiVar;
	
	logger.info('In sepaPacs008BicValIntrmyAgt1');
	bicfiPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrmyAgt1/FinInstnId/BICFI';
	retVal = validateBicFromPath(exchange, bicfiPath, "IntrmyAgt1", "549");

	return retVal;
}

/**
* This function validates "Creditor Agent" BIC
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
* @returns {String} return 0 for valid message otherwise returns violation raised for invalid message.
*/
function sepaPacs008BicValCdtrAgt(exchange) {
	var temp;
	var bic;
	var len;
	var bicCheck;
	var retVal;
	var bicfiPath;
	var bicfiVar;
	var streamDetails;

	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	logger.info('In sepaPacs008BicValCdtrAgt');
	bicfiPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/BICFI';
	var bicfi = getValueFromPath(Document,bicfiPath);
	logger.info("sepaPacs008BicValDebtorAgent: bicfi= " +bicfi);
	retVal = validateBicFromPath(exchange, bicfiPath, "CdtrAgt", "889");

	return retVal;
}

/**
* This function validates "Creditor" BIC
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
* @returns {String} return 0 for valid message otherwise returns violation raised for invalid message.
*/
function sepaPacs008BicValCdtr(exchange) {
	var temp;
	var bic;
	var len;
	var bicCheck;
	var retVal;
	var bicfiPath;
	var bicfiVar;
	
	logger.info('In sepaPacs008BicValCdtr');
	bicfiPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Id/OrgId/AnyBIC';
	retVal = validateBicFromPath(exchange, bicfiPath, "Cdtr", "964");

	return retVal;
}

/**
* This function validates "InstgAgt" BIC
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
* @returns {String} return 0 for valid message otherwise returns violation raised for invalid message.
*/
function sepaPacs008BicValInstgAgt(exchange) {
	var temp;
	var bic;
	var len;
	var bicCheck;
	var retVal;
	var bicfiPath;
	var bicfiVar;
	
	logger.info('In sepaPacs008BicValInstgAgt');
	bicfiPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/InstgAgt/FinInstnId/BICFI';
	retVal = validateBicFromPath(exchange, bicfiPath, "InstgAgt", "523");

	return retVal;
}

/**
* This function validates "InstdAgt" BIC
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
* @returns {String} return 0 for valid message otherwise returns violation raised for invalid message.
*/
function sepaPacs008BicValInstdAgt(exchange) {
	var temp;
	var bic;
	var len;
	var bicCheck;
	var retVal;
	var bicfiPath;
	var bicfiVar;
	
	logger.info('In sepaPacs008BicValInstdAgt');
	bicfiPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/InstdAgt/FinInstnId/BICFI';
	retVal = validateBicFromPath(exchange, bicfiPath, "InstdAgt", "536");

	return retVal;
}

/**
* This function validates "InstdAgt" BIC
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
* @returns {String} return 0 for valid message otherwise returns violation raised for invalid message.
*/
function sepaPacs008BicValAgt(exchange) {
	var temp;
	var bic;
	var len;
	var bicCheck;
	var retVal;
	var bicfiPath;
	var bicfiVar;
	
	logger.info('In sepaPacs008BicValAgt');
	bicfiPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/ChrgsInf/Agt/FinInstnId/BICFI';
	retVal = validateBicFromPath(exchange, bicfiPath, "ChrgsInf", "350");

	return retVal;
}

/**
* This function validates IBAN for Previous Instructing Agent 1 Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validatePrvsInstgAgt1AcctIbanSepaPacs008(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	logger.info("In validatePrvsInstgAgt1AcctIbanSepaPacs008");
	logger.info("validatePrvsInstgAgt1AcctIbanSepaPacs008: exchange = " + exchange);
	logger.info("validatePrvsInstgAgt1AcctIbanSepaPacs008: typeof exchange = " + typeof exchange);

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PrvsInstgAgt1Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validatePrvsInstgAgt1AcctIbanSepaPacs008: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validatePrvsInstgAgt1AcctIbanSepaPacs008: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("408", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);	
	}

	return retVal;
}

/**
* This function validates IBAN for Previous Instructing Agent 2 Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validatePrvsInstgAgt2AcctIbanSepaPacs008(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validatePrvsInstgAgt2AcctIbanSepaPacs008");
	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PrvsInstgAgt2Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validatePrvsInstgAgt2AcctIbanSepaPacs008: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validatePrvsInstgAgt2AcctIbanSepaPacs008: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("456", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	return retVal;
}

/**
* This function validates IBAN for Previous Instructing Agent 3 Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validatePrvsInstgAgt3AcctIbanSepaPacs008(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);	

	logger.info("In validatePrvsInstgAgt3AcctIbanSepaPacs008");
	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PrvsInstgAgt3Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validatePrvsInstgAgt3AcctIbanSepaPacs008: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validatePrvsInstgAgt3AcctIbanSepaPacs008: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("504", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	return retVal;
}

/**
* This function validates IBAN for Intermediary Agent 1 Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateIntrmyAgt1AcctIbanSepaPacs008(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateIntrmyAgt1AcctIbanSepaPacs008");
	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrmyAgt1Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateIntrmyAgt1AcctIbanSepaPacs008: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateIntrmyAgt1AcctIbanSepaPacs008: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("578", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);		
	}

	return retVal;
}

/**
* This function validates IBAN for Intermediary Agent 2 Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateIntrmyAgt2AcctIbanSepaPacs008(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateIntrmyAgt2AcctIbanSepaPacs008");
	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrmyAgt2Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateIntrmyAgt2AcctIbanSepaPacs008: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateIntrmyAgt2AcctIbanSepaPacs008: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("626", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	return retVal;
}

/**
* This function validates IBAN for Intermediary Agent 3 Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateIntrmyAgt3AcctIbanSepaPacs008(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateIntrmyAgt3AcctIbanSepaPacs008");
	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrmyAgt3Acct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateIntrmyAgt3AcctIbanSepaPacs008: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("674", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);	
	}

	return retVal;
}

/**
* This function validates IBAN for Debtor Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateDbtrAcctIbanSepaPacs008(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateDbtrAcctIbanSepaPacs008");
	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateDbtrAcctIbanSepaPacs008: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateDbtrAcctIbanSepaPacs008: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("822", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	return retVal;
}

/**
* This function validates IBAN for Debtor Agent Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateDbtrAgtAcctIbanSepaPacs008(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateDbtrAgtAcctIbanSepaPacs008");
	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateDbtrAgtAcctIbanSepaPacs008: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateDbtrAgtAcctIbanSepaPacs008: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("870", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	return retVal;
}

/**
* This function validates IBAN for Creditor Agent Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateCdtrAgtAcctIbanSepaPacs008(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateCdtrAgtAcctIbanSepaPacs008");
	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgtAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateCdtrAgtAcctIbanSepaPacs008: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateCdtrAgtAcctIbanSepaPacs008: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("926", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	return retVal;
}

/**
* This function validates IBAN for Creditor Account
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function validateCdtrAcctIbanSepaPacs008(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateCdtrAcctIbanSepaPacs008");
	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateCdtrAcctIbanSepaPacs008: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateCdtrAcctIbanSepaPacs008: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("988", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);
	}

	return retVal;
}
//SEPA_Pacs008ValidationRules

function inclusionCdPrtryRuleSepaPacs008(Document, map) {
	var retVal ; 

	logger.info("In inclusionCdPrtryRuleSepaPacs008");
	retVal = 0;

	var clrSysCheck = isXmlNodePresent(Document, "GrpHdr", "SttlmInf", "ClrSys");
	logger.info("inclusionCdPrtryRuleSepaPacs008: clrSysCheck = " + clrSysCheck);

	var ctgyPurpGrpHdrCheck = isXmlNodePresent(Document, "GrpHdr", "PmtTpInf", "<CtgyPurp>");
	logger.info("inclusionCdPrtryRuleSepaPacs008: ctgyPurpGrpHdrCheck = " + ctgyPurpGrpHdrCheck);
	
	var ctgyPurpCdtTrfTxInfCheck = isXmlNodePresent(Document, "CdtTrfTxInf", "PmtTpInf", "<CtgyPurp>");
	logger.info("inclusionCdPrtryRuleSepaPacs008: ctgyPurpCdtTrfTxInfCheck = " + ctgyPurpCdtTrfTxInfCheck); 

	if(clrSysCheck)
	{
		var clrSysCd = isXmlNodePresent3(Document, "GrpHdr", "SttlmInf", "ClrSys", "<Cd>");
		logger.info("inclusionCdPrtryRuleSepaPacs008: clrSysCd = " + clrSysCd);
		
		var clrSysPrtry = isXmlNodePresent3(Document, "GrpHdr", "SttlmInf", "ClrSys", "<Prtry>");
		logger.info("inclusionCdPrtryRuleSepaPacs008: clrSysPrtry = " + clrSysPrtry);

		if(!clrSysCd && !clrSysPrtry){
			setHeader(map, "PLCN_validMessage",false);
			retVal = setCommentsForTransaction("149", "7130", map);
			logger.info("clrSysCheck: Inclusion of sub-elements ‘Code’ and ‘Proprietary’.");
			return retVal;
		}
	} 

	if(ctgyPurpGrpHdrCheck)
	{
		var ctgyPurpGrpHdrCd = isXmlNodePresent3(Document, "GrpHdr", "PmtTpInf", "CtgyPurp", "<Cd>");
		logger.info("inclusionCdPrtryRuleSepaPacs008: ctgyPurpGrpHdrCd = " + ctgyPurpGrpHdrCd);
		
		var ctgyPurpGrpHdrPrtry = isXmlNodePresent3(Document, "GrpHdr", "PmtTpInf", "CtgyPurp", "<Prtry>");
		logger.info("inclusionCdPrtryRuleSepaPacs008: ctgyPurpGrpHdrPrtry = " + ctgyPurpGrpHdrPrtry);

		if(!ctgyPurpGrpHdrCd && !ctgyPurpGrpHdrPrtry)
		{
			setHeader(map, "PLCN_validMessage",false);
			retVal = setCommentsForTransaction("294", "7130", map);
			logger.info("ctgyPurpGrpHdrCheck: Inclusion of sub-elements ‘Code’ and ‘Proprietary’.");
			return retVal;
		}
	}

	if(ctgyPurpCdtTrfTxInfCheck)
	{
		var ctgyPurpCdtTrfTxInfCd = isXmlNodePresent3(Document, "CdtTrfTxInf", "PmtTpInf", "CtgyPurp", "<Cd>");
		logger.info("inclusionCdPrtryRuleSepaPacs008: ctgyPurpCdtTrfTxInfCd = " + ctgyPurpCdtTrfTxInfCd);
		
		var ctgyPurpCdtTrfTxInfPrtry = isXmlNodePresent3(Document, "CdtTrfTxInf", "PmtTpInf", "CtgyPurp", "<Prtry>");
		logger.info("inclusionCdPrtryRuleSepaPacs008: ctgyPurpCdtTrfTxInfPrtry = " + ctgyPurpCdtTrfTxInfPrtry);

		if(!ctgyPurpCdtTrfTxInfCd && !ctgyPurpCdtTrfTxInfPrtry)
		{
			setHeader(map, "PLCN_validMessage",false);
			retVal = setCommentsForTransaction("319", "7130", map);
			logger.info("ctgyPurpCdtTrfTxInfCheck: Inclusion of sub-elements ‘Code’ and ‘Proprietary’.");
			return retVal;
		}
	}
	return retVal;
}

function adrTpNotAllowedRuleSepaPacs8(exchange) {  //DONE 
	logger.info("adrTpNotAllowedRuleSepaPacs8");
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var Document1 = inMsg.getBody(java.lang.String.class);
	
	//CREDITOR
	var cdtrPstlAdr = isXmlNodePresent(Document, "CdtTrfTxInf" , "<Cdtr>", "<PstlAdr>");
	logger.info("adrTpNotAllowedRuleSepaPacs8:cdtrPstlAdr = " + cdtrPstlAdr);

	var cdtrAdrTpPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/AdrTp';
	var cdtrAdrTp = getValueFromPath(Document, cdtrAdrTpPath);
	logger.info("adrTpNotAllowedRuleSepaPacs8:cdtrAddrLine = " + cdtrAdrTp);

	if(isPatternPresent(Document1, "<Cdtr>")){
		if(cdtrPstlAdr){
			if(cdtrAdrTp){
				setHeader(map, "PLCN_validMessage", false);
				logger.info("Cdtr-If PostalAddress is used & if AddressLine is absent then Country and Town name must be present");
				retVal = setCommentsForTransaction("945", "7926", map);
				return retVal;
			}
		}
	}

	//DEBTOR
	var dbtrPstlAdr = isXmlNodePresent(Document, "CdtTrfTxInf" , "<Dbtr>", "<PstlAdr>");
	logger.info("adrTpNotAllowedRuleSepaPacs8:dbtrPstlAdr = " + dbtrPstlAdr);

	var dbtrAdrTpPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/AdrTp';
	var dbtrAdrTp = getValueFromPath(Document, dbtrAdrTpPath);
	logger.info("adrTpNotAllowedRuleSepaPacs8:dbtrAddrLine = " + dbtrAdrTp);

	if(isPatternPresent(Document1, "<Dbtr>")){
		if(dbtrPstlAdr){
			if(dbtrAdrTp){
				setHeader(map, "PLCN_validMessage", false);
				logger.info("DBTR-If PostalAddress is used & if AddressLine is absent then Country and Town name must be present");
				retVal = setCommentsForTransaction("779", "7926", map);
				return retVal;
			}
		}
	}		
	return retVal;
}

function townNameAndCountryRuleSepaPacs8(exchange) {  //DONE 
	logger.info("townNameAndCountryRuleSepaPacs8"); //STRUCTURED ADDRESS
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var Document1 = inMsg.getBody(java.lang.String.class);
	
	//CREDITOR
	var cdtrPstlAdr = isXmlNodePresent(Document, "CdtTrfTxInf" , "Cdtr", "<PstlAdr>");
	logger.info("townNameAndCountryRuleSepaPacs8:cdtrPstlAdr = " + cdtrPstlAdr);

	var cdtrAddrLinePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/AdrLine';
	var cdtrAddrLine = getValueFromPath(Document, cdtrAddrLinePath);
	logger.info("townNameAndCountryRuleSepaPacs8:cdtrAddrLine = " + cdtrAddrLine);

	var cdtrTwnNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/TwnNm';
	var cdtrTwnNm = getValueFromPath(Document, cdtrTwnNmPath);
	logger.info("townNameAndCountryRuleSepaPacs8:cdtrTwnNm = " + cdtrTwnNm);

	var cdtrCtryPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/Ctry';
	var cdtrCtry = getValueFromPath(Document, cdtrCtryPath);
	logger.info("townNameAndCountryRuleSepaPacs8:cdtrCtry = " + cdtrCtry);

	if(isPatternPresent(Document1, "<Cdtr>")){
		if(cdtrPstlAdr){
			if(!cdtrAddrLine && (!cdtrTwnNm || !cdtrCtry)){
				setHeader(map, "PLCN_validMessage", false);
				logger.info("Cdtr-If PostalAddress is used & if AddressLine is absent then Country and Town name must be present");
				retVal = setCommentsForTransaction("945", "7926", map);
				return retVal;
			}
		}
	}

	//DEBTOR
	var dbtrPstlAdr = isXmlNodePresent(Document, "CdtTrfTxInf" , "Dbtr", "<PstlAdr>");
	logger.info("townNameAndCountryRuleSepaPacs8:dbtrPstlAdr = " + dbtrPstlAdr);

	var dbtrAddrLinePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/AdrLine';
	var dbtrAddrLine = getValueFromPath(Document, dbtrAddrLinePath);
	logger.info("townNameAndCountryRuleSepaPacs8:dbtrAddrLine = " + dbtrAddrLine);

	var dbtrTwnNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/TwnNm';
	var dbtrTwnNm = getValueFromPath(Document, dbtrTwnNmPath);
	logger.info("townNameAndCountryRuleSepaPacs8:dbtrTwnNm = " + dbtrTwnNm);

	var dbtrCtryPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/Ctry';
	var dbtrCtry = getValueFromPath(Document, dbtrCtryPath);
	logger.info("townNameAndCountryRuleSepaPacs8:dbtrCtry = " + dbtrCtry);

	if(isPatternPresent(Document1, "<Dbtr>")){
		if(dbtrPstlAdr){
			if(!dbtrAddrLine && (!dbtrTwnNm || !dbtrCtry)){
				setHeader(map, "PLCN_validMessage", false);
				logger.info("DBTR-If PostalAddress is used & if AddressLine is absent then Country and Town name must be present");
				retVal = setCommentsForTransaction("779", "7926", map);
				return retVal;
			}
		}
	}		
	return retVal;
}

function adrLineOptinalElementRuleSepaPacs8(exchange){ 
	logger.info("adrLineOptinalElementRuleSepaPacs8"); //UNSTRUCTURED ADDRESS

	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var Document1 = inMsg.getBody(java.lang.String.class);

	var Date1 = memTblGetTableValue(map, "USER_CONFIG_MAP", "SEPA_LIB2025_DATE");
	logger.info("adrLineOptinalElementRuleSepaPacs8: Date1 = " + Date1);

	var Date2 = memTblGetTableValue(map, "USER_CONFIG_MAP", "SEPA_LIB2026_DATE");
	logger.info("adrLineOptinalElementRuleSepaPacs8: Date2 = " + Date2);

	var sysDate = getDate();
	logger.info("adrLineOptinalElementRuleSepaPacs8: sysDate = " + sysDate);

	//CREDITOR
	var cdtrPstlAdr =  isXmlNodePresent(Document, "CdtTrfTxInf", "Cdtr", "<PstlAdr>");

	var cdtrAddrLinePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/AdrLine';
	var cdtrAddrLine = getValueFromPath(Document, cdtrAddrLinePath);

	var cdtrTwnNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/TwnNm';
	var cdtrTwnNm = getValueFromPath(Document, cdtrTwnNmPath);

	var cdtrCtryPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/Ctry';
	var cdtrCtry = getValueFromPath(Document, cdtrCtryPath);

	var cdtrDeptPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/Dept';
	var cdtrDept = getValueFromPath(Document, cdtrDeptPath);

	var cdtrSubDeptPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/SubDept';
	var cdtrSubDept = getValueFromPath(Document, cdtrSubDeptPath);

	var cdtrStrtNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/StrtNm';
	var cdtrStrtNm = getValueFromPath(Document, cdtrStrtNmPath);

	var cdtrBldgNbPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/BldgNb';
	var cdtrBldgNb = getValueFromPath(Document, cdtrBldgNbPath);

	var cdtrBldgNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/BldgNm';
	var cdtrBldgNm = getValueFromPath(Document, cdtrBldgNmPath);

	var cdtrFlrPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/Flr';
	var cdtrFlr = getValueFromPath(Document, cdtrFlrPath);

	var cdtrPstBxPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/PstBx';
	var cdtrPstBx = getValueFromPath(Document, cdtrPstBxPath);

	var cdtrRoomPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/Room';
	var cdtrRoom = getValueFromPath(Document, cdtrRoomPath);

	var cdtrPstCdPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/PstCd';
	var cdtrPstCd = getValueFromPath(Document, cdtrPstCdPath);

	var cdtrTwnLctnNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/TwnLctnNm';
	var cdtrTwnLctnNm = getValueFromPath(Document, cdtrTwnLctnNmPath);

	var cdtrDstrctNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/DstrctNm';
	var cdtrDstrctNm = getValueFromPath(Document, cdtrDstrctNmPath);

	var cdtrCtrySubDvsnPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/CtrySubDvsn';
	var cdtrCtrySubDvsn = getValueFromPath(Document, cdtrCtrySubDvsnPath);

	if(sysDate < Date1){
		if(isPatternPresent(Document1, "<Cdtr>")){
			if(cdtrPstlAdr){
				if(cdtrAddrLine && (cdtrDept||cdtrSubDept||cdtrStrtNm||cdtrBldgNb||cdtrBldgNm||cdtrFlr||cdtrPstBx||cdtrRoom||cdtrPstCd||cdtrTwnNm||cdtrTwnLctnNm ||cdtrDstrctNm||cdtrCtrySubDvsn)){
					setHeader(map, "PLCN_validMessage", false);
					logger.info("Cdtr-If ‘Address Line’ is used, then ‘Postal Address’ sub elements other than ‘Country’ are forbidden. ");
					retVal = setCommentsForTransaction("945", "7928", map);
					return retVal;
				}
			}
		}
	}else if(sysDate >= Date1){
		var cdtrAgtPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/BICFI';
		var cdtrAgt = getValueFromPath(Document, cdtrAgtPath);
		logger.info("adrLineOptinalElementRuleSepaPacs8: cdtrAgt = " + cdtrAgt);
		
		var cdtrCtryCd = cdtrAgt.slice(4, 6);
		logger.info("adrLineOptinalElementRuleSepaPacs8: cdtrCtryCd = " + cdtrCtryCd);
		
		var cdtrCtryDb = memTblGetTableValue(map, "EUEEA_CNTRY_LST_MAP", cdtrCtryCd);
		logger.info("adrLineOptinalElementRuleSepaPacs8: cdtrCtryDb = " + cdtrCtryDb);
        
        msgFamily = getHeader(map, "PLCN_msgFamilyDB");
        if(!msgFamily){
            msgFamily = getHeader(map, "PLCN_msgFamily");
        }

        if(isPatternPresent(Document1, "<Cdtr>")){
			if(cdtrPstlAdr){
                if(cdtrAddrLine && (!cdtrDept && !cdtrSubDept && !cdtrStrtNm && !cdtrBldgNb && !cdtrBldgNm && !cdtrFlr && !cdtrPstBx && !cdtrRoom && !cdtrPstCd && !cdtrTwnLctnNm  && !cdtrDstrctNm && !cdtrCtrySubDvsn) && !cdtrTwnNm){
                    if(sysDate < Date2){
						logger.info("adrLineOptinalElementRuleSepaPacs8:Cdtr-valid unstructure address");
						/* if(cdtrTwnNm && !cdtrCtry){
							setHeader(map, "PLCN_validMessage", false);
							logger.info("adrLineOptinalElementRuleSepaPacs8:Cdtr-If PstlAddr is used & if Adrline is present then all other optional elements except Country in PostalAddress must be absent");
							retVal = setCommentsForTransaction("945", "7928", map);
							return retVal;
						} */
					}else{
						setHeader(map, "PLCN_validMessage", false);
						logger.info("adrLineOptinalElementRuleSepaPacs8:Cdtr-Unstructured address is not allowed");
						retVal = setCommentsForTransaction("945", "7513", map);
						return retVal;
					}
                }
			}
		}
	}
	
	//DEBTOR
	var dbtrPstlAdr =  isXmlNodePresent(Document, "CdtTrfTxInf", "Dbtr", "<PstlAdr>");

	var dbtrAddrLinePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/AdrLine';
	var dbtrAddrLine = getValueFromPath(Document, dbtrAddrLinePath);
	logger.info("dbtrAddrLine = " + dbtrAddrLine);

	var dbtrTwnNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/TwnNm';
	var dbtrTwnNm = getValueFromPath(Document, dbtrTwnNmPath);
	logger.info("dbtrTwnNm = " + dbtrTwnNm);

	var dbtrCtryPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/Ctry';
	var dbtrCtry = getValueFromPath(Document, dbtrCtryPath);
	logger.info("dbtrCtry = " + dbtrCtry);

	var dbtrDeptPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/Dept';
	var dbtrDept = getValueFromPath(Document, dbtrDeptPath);
	logger.info("dbtrDept = " + dbtrDept);

	var dbtrSubDeptPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/SubDept';
	var dbtrSubDept = getValueFromPath(Document, dbtrSubDeptPath);
	logger.info("dbtrSubDept = " + dbtrSubDept);

	var dbtrStrtNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/StrtNm';
	var dbtrStrNm = getValueFromPath(Document, dbtrStrtNmPath);
	logger.info("dbtrStrNm = " + dbtrStrNm);

	var dbtrBldgNbPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/BldgNb';
	var dbtrBldgNb = getValueFromPath(Document, dbtrBldgNbPath);
	logger.info("dbtrBldgNb = " + dbtrBldgNb);

	var dbtrBldgNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/BldgNm';
	var dbtrBldgNm = getValueFromPath(Document, dbtrBldgNmPath);
	logger.info("dbtrBldgNm = " + dbtrBldgNm);

	var dbtrFlrPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/Flr';
	var dbtrFlr = getValueFromPath(Document, dbtrFlrPath);
	logger.info("dbtrFlr = " + dbtrFlr);

	var dbtrPstBxPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/PstBx';
	var dbtrPstBx = getValueFromPath(Document, dbtrPstBxPath);
	logger.info("dbtrPstBx = " + dbtrPstBx);

	var dbtrRoomPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/Room';
	var dbtrRoom = getValueFromPath(Document, dbtrRoomPath);
	logger.info("dbtrRoom = " + dbtrRoom);

	var dbtrPstCdPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/PstCd';
	var dbtrPstCd = getValueFromPath(Document, dbtrPstCdPath);
	logger.info("dbtrPstCd = " + dbtrPstCd);

	var dbtrTwnLctnNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/TwnLctnNm';
	var dbtrTwnLctnNm = getValueFromPath(Document, dbtrTwnLctnNmPath);
	logger.info("dbtrTwnLctnNm = " + dbtrTwnLctnNm);

	var dbtrDstrctNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/DstrctNm';
	var dbtrDstrctNm = getValueFromPath(Document, dbtrDstrctNmPath);
	logger.info("dbtrDstrctNm = " + dbtrDstrctNm);

	var dbtrCtrySubDvsnPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/CtrySubDvsn';
	var dbtrCtrySubDvsn = getValueFromPath(Document, dbtrCtrySubDvsnPath);
	logger.info("dbtrCtrySubDvsn = " + dbtrCtrySubDvsn);

	if(sysDate < Date1){
		if(isPatternPresent(Document1, "<Dbtr>")){
			if(dbtrPstlAdr){
				if(dbtrAddrLine && (dbtrDept||dbtrSubDept||dbtrStrNm||dbtrBldgNb||dbtrBldgNm||dbtrFlr||dbtrPstBx||dbtrRoom||dbtrPstCd||dbtrTwnLctnNm||dbtrDstrctNm||dbtrCtrySubDvsn||dbtrTwnNm)){
					setHeader(map, "PLCN_validMessage", false);
					logger.info("Dbtr-If ‘Address Line’ is used, then ‘Postal Address’ sub elements other than ‘Country’ are forbidden. ");
					retVal = setCommentsForTransaction("779", "7928", map);
					return retVal;
				}
			}
		}
	}else if(sysDate >= Date1){
		var dbtrAgtPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI';
		var dbtrAgt = getValueFromPath(Document, dbtrAgtPath);
		logger.info("adrLineOptinalElementRuleSepaPacs8: dbtrAgt = " + dbtrAgt);
		
		var dbtrCtryCd = dbtrAgt.slice(4, 6);
		logger.info("adrLineOptinalElementRuleSepaPacs8: dbtrCtryCd = " + dbtrCtryCd);
		
		var dbtrCtryDb = memTblGetTableValue(map, "EUEEA_CNTRY_LST_MAP", dbtrCtryCd);
		logger.info("adrLineOptinalElementRuleSepaPacs8: dbtrCtryDb = " + dbtrCtryDb);
		
        if(isPatternPresent(Document1, "<Dbtr>")){
			if(dbtrPstlAdr){
                if(dbtrAddrLine && (!dbtrDept && !dbtrSubDept && !dbtrStrNm && !dbtrBldgNb && !dbtrBldgNm && !dbtrFlr && !dbtrPstBx && !dbtrRoom && !dbtrPstCd && !dbtrTwnLctnNm  && !dbtrDstrctNm && !dbtrCtrySubDvsn) && !dbtrTwnNm){
                    if(sysDate < Date2){
						/* if(dbtrTwnNm && !dbtrCtry){
							setHeader(map, "PLCN_validMessage", false);
							logger.info("adrLineOptinalElementRuleSepaPacs8:Dbtr-If PstlAddr is used & if Adrline is present then all other optional elements except Country in PostalAddress must be absent");
							retVal = setCommentsForTransaction("779", "7928", map);
							return retVal;                        
						} */
						if((!dbtrCtryDb || !cdtrCtryDb) && !dbtrCtry){
								setHeader(map, "PLCN_validMessage", false);
								logger.info("adrLineOptinalElementRuleSepaPacs8:Dbtr - CdtrAgt/DbtrAgt is non EEA then country is mandatory and all other optional elements except Country in PostalAddress must be absent");
								retVal = setCommentsForTransaction("779", "7621", map);
								return retVal;
						}
					}else {
						setHeader(map, "PLCN_validMessage", false);
						logger.info("adrLineOptinalElementRuleSepaPacs8:Dbtr-Unstructured Address is not allowed");
						retVal = setCommentsForTransaction("779", "7513", map);
						return retVal;
					}
                }
			}
        }
	}
	return retVal;	
}

function adrLineCtryAllowedRuleSepaPacs8(exchange){ 
	logger.info("adrLineCtryAllowedRuleSepaPacs8");

	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var Document1 = inMsg.getBody(java.lang.String.class);

	//CreditorAgent	
	var cdtrAgtPstlAdr = isXmlNodePresent(Document, "CdtTrfTxInf", "CdtrAgt", "<PstlAdr>");

	var cdtrAgtAddrLinePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/AdrLine';
	var cdtrAgtAddrLine = getValueFromPath(Document, cdtrAgtAddrLinePath);
	logger.info("cdtrAgtAddrLine:" + cdtrAgtAddrLine);

	var cdtrAgtCtryPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/PstlAdr/Ctry';
	var cdtrAgtCtry = getValueFromPath(Document, cdtrAgtCtryPath);

	if(isPatternPresent(Document1, "<CdtrAgt>")){
		if(cdtrAgtPstlAdr){
			if(cdtrAgtAddrLine){
				if(cdtrAgtCtry == false)
				setHeader(map, "PLCN_validMessage", false);
				logger.info("CreditorAgent: A combination of ‘Address Line’ and 'Country’ is allowed");
				retVal = setCommentsForTransaction("889", "7928", map);
				return retVal;
			}
		}
	}

	//DebtorAgent
	var dbtrAgtPstlAdr = isXmlNodePresent(Document, "CdtTrfTxInf", "DbtrAgt", "<PstlAdr>");

	var dbtrAgtAddrLinePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/PstlAdr/AdrLine';
	var dbtrAgtAddrLine = getValueFromPath(Document, dbtrAgtAddrLinePath);

	var dbtrAgtCtryPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/PstlAdr/Ctry';
	var dbtrAgtCtry = getValueFromPath(Document, dbtrAgtCtryPath);

	if(isPatternPresent(Document1, "<DbtrAgt>")){
		if(dbtrAgtPstlAdr){
			if(dbtrAgtAddrLine){
				if(dbtrAgtCtry == false)
				setHeader(map, "PLCN_validMessage", false);
				logger.info("DebtorAgent: A combination of ‘Address Line’ and 'Country’ is allowed");
				retVal = setCommentsForTransaction("841", "7928", map);
				return retVal;
			}
		}
	}
	return retVal;	
}

function orgIdRuleSepaPacs8(exchange){ 
	logger.info("orgIdRuleSepaPacs8");

	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var Document1 = inMsg.getBody(java.lang.String.class);

	var Date1 = memTblGetTableValue(map, "USER_CONFIG_MAP", "SEPA_LIB2025_DATE");
	logger.info("orgIdRuleSepaPacs8: Date1 = " + Date1);

	var sysDate = getDate();
	logger.info("orgIdRuleSepaPacs8: sysDate = " + sysDate);
	
	//CREDITOR
	var cdtrOrgId =  isXmlNodePresent(Document, "CdtTrfTxInf", "Cdtr", "<OrgId>");

	var cdtrOrgIdAnyBICPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Id/OrgId/AnyBIC';
	var cdtrOrgIdAnyBIC = getValueFromPath(Document, cdtrOrgIdAnyBICPath);

	var cdtrOrgIdLEIPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Id/OrgId/LEI';
	var cdtrOrgIdLEI = getValueFromPath(Document, cdtrOrgIdLEIPath);

	var cdtrOrgIdOthrPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Id/OrgId/Othr';
	var cdtrOrgIdOthr = getValueFromPath(Document, cdtrOrgIdOthrPath);

	if(isPatternPresent(Document1, "<Cdtr>")){
		if(cdtrOrgId){
			if(sysDate < Date1){
				if(cdtrOrgIdAnyBIC && cdtrOrgIdLEI && cdtrOrgIdOthr){
					setHeader(map, "PLCN_validMessage", false);
					logger.info("Cdtr-If PstlAddr is used & if OrgId is present then Either ‘AnyBIC', 'LEI’ or one occurrence of ‘Other’ is allowed");
					retVal = setCommentsForTransaction("945", "7135", map);
					return retVal;
				}
			}else {
				if((cdtrOrgIdAnyBIC && cdtrOrgIdLEI && cdtrOrgIdOthr) || (cdtrOrgIdAnyBIC && cdtrOrgIdLEI) || (cdtrOrgIdLEI && cdtrOrgIdOthr) || (cdtrOrgIdAnyBIC && cdtrOrgIdOthr)){
					setHeader(map, "PLCN_validMessage", false);
					logger.info("Cdtr-If PstlAddr is used & if OrgId is present then Either ‘AnyBIC', 'LEI’ or one occurrence of ‘Other’ is allowed");
					retVal = setCommentsForTransaction("945", "7135", map);
					return retVal;
				}
			}
		}
	}	

	//DEBTOR
	var dbtrOrgId =  isXmlNodePresent(Document, "CdtTrfTxInf", "Dbtr", "<OrgId>");

	var dbtrOrgIdAnyBICPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Id/OrgId/AnyBIC';
	var dbtrOrgIdAnyBIC = getValueFromPath(Document, dbtrOrgIdAnyBICPath);

	var dbtrOrgIdLEIPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Id/OrgId/LEI';
	var dbtrOrgIdLEI = getValueFromPath(Document, dbtrOrgIdLEIPath);

	var dbtrOrgIdOthrPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Id/OrgId/Othr';
	var dbtrOrgIdOthr = getValueFromPath(Document, dbtrOrgIdOthrPath);

	//ADDED BY SNEHA FOR LIB2025
	if(sysDate < Date1){
		if(isPatternPresent(Document1, "<Dbtr>")){
			if(dbtrOrgId){
				if(dbtrOrgIdAnyBIC && dbtrOrgIdLEI && dbtrOrgIdOthr){
					setHeader(map, "PLCN_validMessage", false);
					logger.info("Dbtr-If PstlAddr is used & if OrgId is present then Either ‘AnyBIC', 'LEI’ or one occurrence of ‘Other’ is allowed");
					retVal = setCommentsForTransaction("779", "7135", map);
					return retVal;
				}
			}
		}
	}
	
	//ULTIMATEDEBTOR
	var ultmtDbtrOrgId =  isXmlNodePresent(Document, "CdtTrfTxInf", "UltmtDbtr", "<OrgId>");

	var ultmtDbtrOrgIdAnyBICPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/UltmtDbtr/Id/OrgId/AnyBIC';
	var ultmtDbtrOrgIdAnyBIC = getValueFromPath(Document, ultmtDbtrOrgIdAnyBICPath);

	var ultmtDbtrOrgIdLEIPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/UltmtDbtr/Id/OrgId/LEI';
	var ultmtDbtrOrgIdLEI = getValueFromPath(Document, ultmtDbtrOrgIdLEIPath);

	var ultmtDbtrOrgIdOthrPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/UltmtDbtr/Id/OrgId/Othr';
	var ultmtDbtrOrgIdOthr = getValueFromPath(Document, ultmtDbtrOrgIdOthrPath);

	//ADDED BY SNEHA FOR LIB2025
	if(sysDate < Date1){
		if(isPatternPresent(Document1, "<UltmtDbtr>")){
			if(ultmtDbtrOrgId){
				if(ultmtDbtrOrgIdAnyBIC && ultmtDbtrOrgIdLEI && ultmtDbtrOrgIdOthr){
					setHeader(map, "PLCN_validMessage", false);
					logger.info("UltmtDbtr-If PstlAddr is used & if OrgId is present then Either ‘AnyBIC', 'LEI’ or one occurrence of ‘Other’ is allowed");
					retVal = setCommentsForTransaction("693", "7135", map);
					return retVal;
				}
			}
		}
	}
	
	//ULTIMATECREDITOR
	var ultmtCdtrOrgId =  isXmlNodePresent(Document, "CdtTrfTxInf", "UltmtCdtr", "<OrgId>");

	var ultmtCdtrOrgIdAnyBICPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/UltmtCdtr/Id/OrgId/AnyBIC';
	var ultmtCdtrOrgIdAnyBIC = getValueFromPath(Document, ultmtCdtrOrgIdAnyBICPath);

	var ultmtCdtrOrgIdLEIPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/UltmtCdtr/Id/OrgId/LEI';
	var ultmtCdtrOrgIdLEI = getValueFromPath(Document, ultmtCdtrOrgIdLEIPath);

	var ultmtCdtrOrgIdOthrPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/UltmtCdtr/Id/OrgId/Othr';
	var ultmtCdtrOrgIdOthr = getValueFromPath(Document, ultmtCdtrOrgIdOthrPath);

	if(isPatternPresent(Document1, "<UltmtCdtr>")){
		if(ultmtCdtrOrgId){
			if(sysDate < Date1){
				if(ultmtCdtrOrgIdAnyBIC && ultmtCdtrOrgIdLEI && ultmtCdtrOrgIdOthr){
					setHeader(map, "PLCN_validMessage", false);
					logger.info("UltmtCdtr-If PstlAddr is used & if OrgId is present then Either ‘AnyBIC', 'LEI’ or one occurrence of ‘Other’ is allowed");
					retVal = setCommentsForTransaction("1007", "7135", map);
					return retVal;
				}
			}else {
				if((ultmtCdtrOrgIdAnyBIC && ultmtCdtrOrgIdLEI && ultmtCdtrOrgIdOthr) || (ultmtCdtrOrgIdAnyBIC && ultmtCdtrOrgIdLEI) || (ultmtCdtrOrgIdLEI && ultmtCdtrOrgIdOthr) || (ultmtCdtrOrgIdAnyBIC && ultmtCdtrOrgIdOthr)){
					setHeader(map, "PLCN_validMessage", false);
					logger.info("UltmtCdtr-If PstlAddr is used & if OrgId is present then Either ‘AnyBIC', 'LEI’ or one occurrence of ‘Other’ is allowed");
					retVal = setCommentsForTransaction("1007", "7135", map);
					return retVal;
				}
			}
		}
	}
	return retVal;	
}

function prvtIdRuleSepaPacs8(exchange){ 
	logger.info("prvtIdRuleSepaPacs8");

	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var Document1 = inMsg.getBody(java.lang.String.class);

	//CREDITOR
	var cdtrPrvtId =  isXmlNodePresent(Document, "CdtTrfTxInf", "Cdtr", "<PrvtId>");

	var cdtrPrvtIdAnyBICPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Id/PrvtId/DtAndPlcOfBirth';
	var cdtrPrvtIdDtAndPlcOfBirth = getValueFromPath(Document, cdtrPrvtIdAnyBICPath);

	var cdtrPrvtIdOthrPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Id/PrvtId/Othr';
	var cdtrPrvtIdOthr = getValueFromPath(Document, cdtrPrvtIdOthrPath);

	if(isPatternPresent(Document1, "<Cdtr>")){
		if(cdtrPrvtId){
			if(cdtrPrvtIdDtAndPlcOfBirth && cdtrPrvtIdOthr){
				setHeader(map, "PLCN_validMessage", false);
				logger.info("Cdtr-If PstlAddr is used & if PrvtId is present then Either ‘DtAndPlcOfBirth', 'LEI’ or one occurrence of ‘Other’ is allowed");
				retVal = setCommentsForTransaction("945", "7136", map);
				return retVal;
			}
		}
	}	

	//DEBTOR
	var dbtrPrvtId =  isXmlNodePresent(Document, "CdtTrfTxInf", "Dbtr", "<PrvtId>");

	var dbtrPrvtIdDtAndPlcOfBirthPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Id/PrvtId/DtAndPlcOfBirth';
	var dbtrPrvtIdDtAndPlcOfBirth = getValueFromPath(Document, dbtrPrvtIdDtAndPlcOfBirthPath);

	var dbtrPrvtIdOthrPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Id/PrvtId/Othr';
	var dbtrPrvtIdOthr = getValueFromPath(Document, dbtrPrvtIdOthrPath); 

	if(isPatternPresent(Document1, "<Dbtr>")){
		if(dbtrPrvtId){
			if(dbtrPrvtIdDtAndPlcOfBirth && dbtrPrvtIdOthr){
				setHeader(map, "PLCN_validMessage", false);
				logger.info("Dbtr-If PstlAddr is used & if PrvtId is present then Either ‘DtAndPlcOfBirth', 'LEI’ or one occurrence of ‘Other’ is allowed");
				retVal = setCommentsForTransaction("779", "7136", map);
				return retVal;
			}
		}
	}
	
	//ULTIMATEDEBTOR
	var ultmtDbtrPrvtId =  isXmlNodePresent(Document, "CdtTrfTxInf", "UltmtDbtr", "<PrvtId>");

	var ultmtDbtrPrvtIdDtAndPlcOfBirthPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/UltmtDbtr/Id/PrvtId/DtAndPlcOfBirth';
	var ultmtDbtrPrvtIdDtAndPlcOfBirth = getValueFromPath(Document, ultmtDbtrPrvtIdDtAndPlcOfBirthPath);

	var ultmtDbtrPrvtIdOthrPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/UltmtDbtr/Id/PrvtId/Othr';
	var ultmtDbtrPrvtIdOthr = getValueFromPath(Document, ultmtDbtrPrvtIdOthrPath);

	if(isPatternPresent(Document1, "<UltmtDbtr>")){
		if(ultmtDbtrPrvtId){
			if(ultmtDbtrPrvtIdDtAndPlcOfBirth && ultmtDbtrPrvtIdOthr){
				setHeader(map, "PLCN_validMessage", false);
				logger.info("UltmtDbtr-If PstlAddr is used & if PrvtId is present then Either ‘DtAndPlcOfBirth', 'LEI’ or one occurrence of ‘Other’ is allowed");
				retVal = setCommentsForTransaction("693", "7136", map);
				return retVal;
			}
		}
	}
	
	//ULTIMATECREDITOR
	var ultmtCdtrPrvtId =  isXmlNodePresent(Document, "CdtTrfTxInf", "UltmtCdtr", "<PrvtId>");

	var ultmtCdtrPrvtIdAnyBICPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/UltmtCdtr/Id/PrvtId/DtAndPlcOfBirth';
	var ultmtCdtrPrvtIdDtAndPlcOfBirth = getValueFromPath(Document, ultmtCdtrPrvtIdAnyBICPath);

	var ultmtCdtrPrvtIdOthrPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/UltmtCdtr/Id/PrvtId/Othr';
	var ultmtCdtrPrvtIdOthr = getValueFromPath(Document, ultmtCdtrPrvtIdOthrPath);

	if(isPatternPresent(Document1, "<UltmtCdtr>")){
		if(ultmtCdtrPrvtId){
			if(ultmtCdtrPrvtIdDtAndPlcOfBirth && ultmtCdtrPrvtIdOthr){
				setHeader(map, "PLCN_validMessage", false);
				logger.info("UltmtCdtr-If PstlAddr is used & if PrvtId is present then Either ‘DtAndPlcOfBirth', 'LEI’ or one occurrence of ‘Other’ is allowed");
				retVal = setCommentsForTransaction("1007", "7136", map);
				return retVal;
			}
		}
	}	

	return retVal;	
}

/*function dbtrAcctPrxyCheckRulePacs008(Document, map) {
	var retVal ; 

	logger.info("In dbtrAcctPrxyCheckRulePacs008");
	retVal = 0;

	var dbtrAcctCheck = isXmlNodePresent4(Document, "CdtTrfTxInf", "DbtrAcct");
	logger.info("dbtrAcctPrxyCheckRulePacs008: dbtrAcctCheck = " + dbtrAcctCheck); 

	if(dbtrAcctCheck)
	{
		var dbtrAcctPrxyCheck = isXmlNodePresent(Document, "CdtTrfTxInf", "DbtrAcct", "<Prxy>");
		logger.info("dbtrAcctPrxyCheckRulePacs008: dbtrAcctPrxyCheck = " + dbtrAcctPrxyCheck);

		if(!dbtrAcctPrxyCheck)
		{
			setHeader(map, "PLCN_validMessage",false);
			retVal = setCommentsForTransaction("04", "7004", map);
			logger.info("DbtrAcct: Inclusion of sub-elements ‘Prxy’.");
			return retVal;
		}
	}
	return retVal;
}

function cdtrAcctPrxyCheckRulePacs008(Document, map) {
	var retVal ; 

	logger.info("In cdtrAcctPrxyCheckRulePacs008");
	retVal = 0;

	var cdtrAcctCheck = isXmlNodePresent(Document, "CdtTrfTxInf", "CdtrAcct");
	logger.info("cdtrAcctPrxyCheckRulePacs008: cdtrAcctCheck = " + cdtrAcctCheck); 

	if(cdtrAcctCheck)
	{
		var cdtrAcctPrxyCheck = isXmlNodePresent(Document, "CdtTrfTxInf", "CdtrAcct", "<Prxy>");
		logger.info("cdtrAcctPrxyCheckRulePacs008: cdtrAcctPrxyCheck = " + cdtrAcctPrxyCheck);

		if(!cdtrAcctPrxyCheck)
		{
			setHeader(map, "PLCN_validMessage",false);
			retVal = setCommentsForTransaction("341", "7907", map);
			logger.info("CdtrAcct: Inclusion of sub-elements ‘Prxy’.");
			return retVal;
		}
	}
	return retVal;
}*/

function constraintsISORulesSEPAPacs008(pacs08ValdFlagMx, exchange) {
	var retVal;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In constraintsISORulesSEPAPacs008");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	retVal = 0;

	if(pacs08ValdFlagMx == "ERROR") {
		
		retVal = b2bIntrBnkSttltDate(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = b2bTtlIntrBkSttlmAmtCcy(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = grpHdr_CdtTrfTxInf_FldCompRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = instructedAmountAndExchangeRate2RulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = instructedAmountAndExchangeRate1RulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = b2bInstAmtExchRate(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = InstructionForCreditorAgentRule(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = instructingReimbursementAgentAccountRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = instructedReimbursementAgentAccountRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = intermediaryAgent1AccountRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = intermediaryAgent2AccountRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = intermediaryAgent3AccountRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = intermediaryAgent2RulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = intermediaryAgent3RulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = previousInstructingAgent1AccountRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = previousInstructingAgent2AccountRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = previousInstructingAgent3AccountRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = previousInstructionAgent2RulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = previousInstructionAgent3RulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = thirdReimbursementAgentAccountRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = thirdReimbursementAgentRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = settlementMethodAgentRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = settlementMethodCoverRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = settlementMethodCoverAgentRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = settlementMethodClearingRulePacs008(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = b2bChargesAmountCurrency(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = cbprCredRulePacs8(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
	}
	if(pacs08ValdFlagMx == "WARNING") {
		
		retVal = b2bIntrBnkSttltDate(Document, map);
		retVal = b2bTtlIntrBkSttlmAmtCcy(Document, map);
		retVal = grpHdr_CdtTrfTxInf_FldCompRulePacs008(Document, map);
		retVal = instructedAmountAndExchangeRate2RulePacs008(Document, map);
		retVal = instructedAmountAndExchangeRate1RulePacs008(Document, map);
		retVal = b2bInstAmtExchRate(Document, map);
		retVal = InstructionForCreditorAgentRule(Document, map);
		retVal = instructingReimbursementAgentAccountRulePacs008(Document, map);
		retVal = instructedReimbursementAgentAccountRulePacs008(Document, map);
		retVal = intermediaryAgent1AccountRulePacs008(Document, map);
		retVal = intermediaryAgent2AccountRulePacs008(Document, map);
		retVal = intermediaryAgent3AccountRulePacs008(Document, map);
		retVal = intermediaryAgent2RulePacs008(Document, map);
		retVal = intermediaryAgent3RulePacs008(Document, map);
		retVal = previousInstructingAgent1AccountRulePacs008(Document, map);
		retVal = previousInstructingAgent2AccountRulePacs008(Document, map);
		retVal = previousInstructingAgent3AccountRulePacs008(Document, map);
		retVal = previousInstructionAgent2RulePacs008(Document, map);
		retVal = previousInstructionAgent3RulePacs008(Document, map);
		retVal = thirdReimbursementAgentAccountRulePacs008(Document, map);
		retVal = thirdReimbursementAgentRulePacs008(Document, map);
		retVal = settlementMethodAgentRulePacs008(Document, map);
		retVal = settlementMethodCoverRulePacs008(Document, map);
		retVal = settlementMethodCoverAgentRulePacs008(Document, map);
		retVal = settlementMethodClearingRulePacs008(Document, map);
		retVal = b2bChargesAmountCurrency(Document, map);
		retVal = cbprCredRulePacs8(Document, map);
	}
	return retVal;
}

function sepaCustomValidationsPacs008(pacs08ValdFlagMx, exchange) {
	var retVal;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
  	body = inMsg.getBody(java.lang.String.class);
  	logger.info("sepaCustomValidationsPacs008: body = " + body);
  	setHeader(map, "PLCN_originalMsgBody", body);

	logger.info("In sepaCustomValidationsPacs008");

	retVal = 0;

	if(pacs08ValdFlagMx == "ERROR") {
		
		retVal = sntdManualBackofficeCheck(exchange);
		if(retVal != 0) {
			return retVal;
		}
		retVal = sntdCompanyCodeValidations(exchange);
		if(retVal != 0) {
			return retVal;
		}
		retVal = pcsPacs008Validation(exchange);
		if(retVal != 0) {
			return retVal;
		}

	}
	return retVal;
}

function sepaCustomValidationsPacs003(pacs03ValdFlagMx, exchange) {
	var retVal;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
  	body = inMsg.getBody(java.lang.String.class);
  	logger.info("sepaCustomValidationsPacs003: body = " + body);
  	setHeader(map, "PLCN_originalMsgBody", body);

	logger.info("In sepaCustomValidationsPacs003");

	retVal = 0;

	if(pacs03ValdFlagMx == "ERROR") {
		
		retVal = sntdManualBackofficeCheck(exchange);
		if(retVal != 0) {
			return retVal;
		}
	}
	return retVal;
}

function sepaCustomValidationsPacs004(pacs04ValdFlagMx, exchange) {
	var retVal;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
  	body = inMsg.getBody(java.lang.String.class);
  	logger.info("sepaCustomValidationsPacs004: body = " + body);
  	setHeader(map, "PLCN_originalMsgBody", body);

	logger.info("In sepaCustomValidationsPacs004");

	retVal = 0;

	if(pacs04ValdFlagMx == "ERROR") {
		
		retVal = sntdManualBackofficeCheck(exchange);
		if(retVal != 0) {
			return retVal;
		}
		retVal = pcsValidationRulePacs004(exchange);
		if(retVal != 0) {
			return retVal;
		}

	}
	return retVal;
}
//SEPA Pacs004

function wrapperSepaPacs004Mx(exchange) {
	logger.info("wrapperSepaPacs004Mx");
	var retVal;
	var commentsB2b;
	var pacs04ValdFlagMx;
	var txnComments;
	var inMsg;
	var map;
	var Document;
	var manualMode;
	var tenantName;

	logger.info('wrapperSepaPacs004Mx: In wrapperSepaPacs004Mx');
	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	pacs04ValdFlagMx = memTblGetTableValue(map, "FLAG-TABLE", "PACS04_VALD_FLAG_MX");
	pacs04ValdFlagMx = pacs04ValdFlagMx.trim();
	logger.info("pacs04ValdFlagMx = " + pacs04ValdFlagMx);

	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("wrapperSepaPacs003Mx: institutionId " +institutionId);
	
	manualMode = getHeader(map, "PLCN_manualMode");
	logger.info("wrapperSepaPacs004Mx: manualMode " +manualMode);

	tenantName = getHeader(map, "PLCN_tenantName");
	logger.info("wrapperSepaPacs004Mx: tenantName = " + tenantName);

	if(!tenantName){
		var tenantNamePath = institutionId + ".INSTITUTION_DETAILS.TENANT_NAME";
		logger.info("wrapperSepaPacs004Mx: tenantName = " + tenantNamePath);
		tenantName = memTblGetTableValue(map, "INST_PARAM",tenantNamePath);
		logger.info("wrapperSepaPacs004Mx: tenantName = " + tenantName);
	}

	if(pacs04ValdFlagMx == 'ERROR') {

		logger.info("wrapperSepaPacs004Mx: Calling sepaValidationRulesPacs004");
		retVal = sepaValidationRulesPacs004(pacs04ValdFlagMx, exchange);
		logger.info("wrapperSepaPacs004Mx: retVal from sepaValidationRulesPacs004 = " + retVal);
		txnComments = getHeader(map, 'PLCN_txnComments');
		logger.info("wrapperSepaPacs004Mx: txnComments = " + txnComments);

		if(retVal == 0) {
			logger.info("wrapperSepaPacs004Mx: Calling externalCodelistValidationSepaPacs004");
			//retVal = externalCodelistValidationSepaPacs004(Document, map);		
			txnComments = getHeader(map, 'PLCN_txnComments');
			logger.info("wrapperSepaPacs004Mx: txnComments from externalCodelistValidationSepaPacs004 = " + txnComments);			
		}

		if(retVal == 0) {
			logger.info("wrapperSepaPacs004Mx: Calling ibanValidationSepaPacs004");
			retVal = ibanValidationSepaPacs004(exchange);
			txnComments = getHeader(map, 'PLCN_txnComments');
			logger.info("wrapperSepaPacs004Mx: txnComments from ibanValidationSepaPacs004 = " + txnComments);
		}
		
		if(retVal == 0) {
			logger.info("wrapperSepaPacs004Mx: Calling constraintsISORulesSEPAPacs004");
			//constraintsISORulesSEPAPacs004(pacs04ValdFlagMx,exchange);
			retVal = constraintsISORulesSEPAPacs004(pacs04ValdFlagMx, exchange);
			txnComments = getHeader(map, 'PLCN_txnComments');
			logger.info("wrapperSepaPacs004Mx: txnComments from constraintsISORulesSEPAPacs004 = " + txnComments);
		}
		if(retVal == 0 && manualMode == "REPAIR" && (tenantName == "SNTDBK" || tenantName == "PLNT01")) {
		logger.info("wrapperSepaPacs004Mx: Calling sepaCustomValidationsPacs004");
		sepaCustomValidationsPacs004(pacs04ValdFlagMx,exchange);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs004Mx: txnComments from sepaCustomValidationsPacs004 = " + txnComments);
		}
	}

	if(pacs04ValdFlagMx == 'WARNING') {

		logger.info("wrapperSepaPacs004Mx: Calling sepaValidationRulesPacs004");
		retVal = sepaValidationRulesPacs004(pacs04ValdFlagMx, exchange);
		logger.info("wrapperSepaPacs004Mx: retVal from sepaValidationRulesPacs004 = " + retVal);
		txnComments = getHeader(map, 'PLCN_txnComments');
		logger.info("wrapperSepaPacs004Mx: txnComments = " + txnComments);

		logger.info("wrapperSepaPacs004Mx: Calling externalCodelistValidationSepaPacs004");
		retVal = externalCodelistValidationSepaPacs004(Document, map);		
		txnComments = getHeader(map, 'PLCN_txnComments');
		logger.info("wrapperSepaPacs004Mx: txnComments from externalCodelistValidationSepaPacs004 = " + txnComments);			
		
		logger.info("wrapperSepaPacs004Mx: Calling ibanValidationSepaPacs004");
		ibanValidationSepaPacs004(exchange);
		txnComments = getHeader(map, 'PLCN_txnComments');
		logger.info("wrapperSepaPacs004Mx: txnComments from ibanValidationSepaPacs004 = " + txnComments);
		
		logger.info("wrapperSepaPacs004Mx: Calling constraintsISORulesSEPAPacs004");
		constraintsISORulesSEPAPacs004(pacs04ValdFlagMx,exchange);
		txnComments = getHeader(map, 'PLCN_txnComments');
		logger.info("wrapperSepaPacs004Mx: txnComments from constraintsISORulesSEPAPacs004 = " + txnComments);
	}
}

function sepaValidationRulesPacs004(pacs04ValdFlagMx, exchange) {
	
	var retVal;

	logger.info("In sepaValidationRulesPacs004");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	retVal = 0;

	if(pacs04ValdFlagMx == "ERROR") {

		retVal = inclusionOfElementsclrSysPacs004Rule(Document, map);
		if(retVal != 0) {
			return retVal;
		}

		retVal = originalMsgNameIdRulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}

/*		retVal = sepaPacs004ValChrgsInfAgtBic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs004ValDbtrBic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs004ValInitgPtyAgtBic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs004ValDbtrAgtBic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs004ValPrvsInstgAgt1Bic(exchange);

		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs004ValPrvsInstgAgt2Bic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs004ValPrvsInstgAgt3Bic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs004ValIntrmyAgt1Bic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs004ValIntrmyAgt2Bic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs004ValIntrmyAgt3Bic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs004ValCdtrAgtBic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs004ValinstgAgtBic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaPacs004ValinstdAgtBic(exchange);
		if(retVal != 0) {
			return retVal;
		}*/
	}

	if(pacs04ValdFlagMx == "WARNING") {

		retVal = inclusionOfElementsclrSysPacs004Rule(Document, map);
		sepaPacs004ValChrgsInfAgtBic(exchange);
		sepaPacs004ValDbtrBic(exchange);
		sepaPacs004ValInitgPtyAgtBic(exchange);
		sepaPacs004ValDbtrAgtBic(exchange);
		sepaPacs004ValPrvsInstgAgt1Bic(exchange);
		sepaPacs004ValPrvsInstgAgt2Bic(exchange);
		sepaPacs004ValPrvsInstgAgt3Bic(exchange);
		sepaPacs004ValIntrmyAgt1Bic(exchange);
		sepaPacs004ValIntrmyAgt2Bic(exchange);
		sepaPacs004ValIntrmyAgt3Bic(exchange);
		sepaPacs004ValCdtrAgtBic(exchange);
		sepaPacs004ValinstgAgtBic(exchange);
		sepaPacs004ValinstdAgtBic(exchange);
	}
	return retVal;
}

//SEPA_Pacs004ValidationRules

function inclusionOfElementsclrSysPacs004Rule(Document, map) {
	
	var retVal ; 

	logger.info("In inclusionOfElementsclrSysPacs004Rule");
	retVal = 0;

	var clrSysCheck = isXmlNodePresent(Document, "GrpHdr", "SttlmInf", "ClrSys");
	logger.info("inclusionOfElementsclrSysPacs004Rule: clrSysCheck = " + clrSysCheck); 

	if(clrSysCheck)
	{
		var clrSysCd = isXmlNodePresent3(Document, "GrpHdr", "SttlmInf", "ClrSys", "<Cd>");
		logger.info("inclusionOfElementsclrSysPacs004Rule: clrSysCd = " + clrSysCd);
		
		var clrSysPrtry = isXmlNodePresent3(Document, "GrpHdr", "SttlmInf", "ClrSys", "<Prtry>");
		logger.info("inclusionOfElementsclrSysPacs004Rule: clrSysPrtry = " + clrSysPrtry);

		if(!clrSysCd && !clrSysPrtry)
		{
			setHeader(map, "PLCN_validMessage",false);
			retVal = setCommentsForTransaction("152", "7130", map);
			logger.info("inclusionOfElementsclrSysPacs004Rule: Inclusion of sub-elements ‘Code’ and ‘Proprietary’.");
			return retVal;
		}
	} 
	return retVal;
}

function sepaPacs004ValChrgsInfAgtBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaPacs004ValChrgsInfAgtBic');
	bicfiPath = "/Document/PmtRtr/TxInf/ChrgsInf/Agt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "ChrgsInf", "203");

	return retVal;
}

function sepaPacs004ValDbtrBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaPacs004ValDbtrBic');
	bicfiPath = "/Document/PmtRtr/TxInf/RtrChain/Dbtr/Agt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "Dbtr", "8");

	return retVal;
}

function sepaPacs004ValInitgPtyAgtBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaPacs004ValInitgPtyAgtBic');
	bicfiPath = "/Document/PmtRtr/TxInf/RtrChain/InitgPty/Agt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "InitgPty", "377");

	return retVal;
}

function sepaPacs004ValDbtrAgtBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaPacs004ValDbtrAgtBic');
	bicfiPath = "/Document/PmtRtr/TxInf/RtrChain/DbtrAgt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "DbtrAgt", "424");

	return retVal;
}

function sepaPacs004ValPrvsInstgAgt1Bic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaPacs004ValPrvsInstgAgt1Bic');
	bicfiPath = "/Document/PmtRtr/TxInf/RtrChain/PrvsInstgAgt1/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "PrvsInstgAgt1", "453");

	return retVal;
}

function sepaPacs004ValPrvsInstgAgt2Bic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaPacs004ValPrvsInstgAgt2Bic');
	bicfiPath = "/Document/PmtRtr/TxInf/RtrChain/PrvsInstgAgt2/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "PrvsInstgAgt2", "482");

	return retVal;
}

function sepaPacs004ValPrvsInstgAgt3Bic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaPacs004ValPrvsInstgAgt3Bic');
	bicfiPath = "/Document/PmtRtr/TxInf/RtrChain/PrvsInstgAgt3/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "PrvsInstgAgt3", "511");

	return retVal;
}

function sepaPacs004ValIntrmyAgt1Bic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaPacs004ValIntrmyAgt1Bic');
	bicfiPath = "/Document/PmtRtr/TxInf/RtrChain/IntrmyAgt1/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "IntrmyAgt1", "1");

	return retVal;
}

function sepaPacs004ValIntrmyAgt2Bic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaPacs004ValIntrmyAgt2Bic');
	bicfiPath = "/Document/PmtRtr/TxInf/RtrChain/IntrmyAgt2/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "IntrmyAgt2", "2");

	return retVal;
}

function sepaPacs004ValIntrmyAgt3Bic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaPacs004ValIntrmyAgt3Bic');
	bicfiPath = "/Document/PmtRtr/TxInf/RtrChain/IntrmyAgt3/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "IntrmyAgt3", "3");

	return retVal;
}

function sepaPacs004ValCdtrAgtBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaPacs004ValCdtrAgtBic');
	bicfiPath = "/Document/PmtRtr/TxInf/RtrChain/CdtrAgt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "CdtrAgt", "4");

	return retVal;
}

function sepaPacs004ValinstgAgtBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaPacs004ValinstgAgtBic');
	bicfiPath = "/Document/PmtRtr/TxInf/InstgAgt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "InstgAgt", "6");

	return retVal;
}

function sepaPacs004ValinstdAgtBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaPacs004ValinstdAgtBic');
	bicfiPath = "/Document/PmtRtr/TxInf/InstdAgt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "InstdAgt", "7");

	return retVal;
}

function constraintsISORulesSEPAPacs004(pacs04ValdFlagMx, exchange) {
	
	var retVal;

	logger.info("In constraintsISORulesSEPAPacs004");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	retVal = 0;

	if(pacs04ValdFlagMx == "ERROR") {

/*		retVal = b2bIntrBnkSttltDateRulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}*/
		
		retVal = genericMustPresentRulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = grpHdrsttlmtMtdRulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = returnedInstructedAmountAndExchangeRate1RulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = returnReasonRulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = settlementMethodAgentRulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = groupReturnAndNumberOfTransactionsTrueFalseRulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = genericNotAllowedRulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = groupReturnAndReturnReasonRulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = returnedInstructedAmountAndExchangeRate2RulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = settlementMethodClearingRulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = settlementMethodCoverAgentRulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = groupHeaderGroupReturnFalseRulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = settlementMethodCoverRulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}

		// retVal = orgnlGrpHdrInfoRulePacs004(Document, map);
		// if(retVal != 0) {
		// 	return retVal;
		// }
		
		retVal = grpHdr_CdtTrfTxInf_FldCompRulePacs004(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		// retVal = grpHdrTtlRtrIntrBkSttlmAmtRulePacs004(Document, map);
		// if(retVal != 0) {
		// 	return retVal;
		// }
	}

	if(pacs04ValdFlagMx == "WARNING") {

		retVal = b2bIntrBnkSttltDateRulePacs004(Document, map);
		retVal = genericMustPresentRulePacs004(Document, map);
		retVal = grpHdrsttlmtMtdRulePacs004(Document, map);
		retVal = returnedInstructedAmountAndExchangeRate1RulePacs004(Document, map);
		retVal = returnReasonRulePacs004(Document, map);
		retVal = settlementMethodAgentRulePacs004(Document, map);
		retVal = groupReturnAndNumberOfTransactionsTrueFalseRulePacs004(Document, map);
		retVal = genericNotAllowedRulePacs004(Document, map);
		retVal = groupReturnAndReturnReasonRulePacs004(Document, map);
		retVal = returnedInstructedAmountAndExchangeRate2RulePacs004(Document, map);
		retVal = settlementMethodClearingRulePacs004(Document, map);
		retVal = settlementMethodCoverAgentRulePacs004(Document, map);
		retVal = groupHeaderGroupReturnFalseRulePacs004(Document, map);
		retVal = settlementMethodCoverRulePacs004(Document, map);
		retVal = grpHdr_CdtTrfTxInf_FldCompRulePacs004(Document, map);
		//retVal = grpHdrTtlRtrIntrBkSttlmAmtRulePacs004(Document, map);
	}

	return retVal;
}


function wrapperSepaCamt056Mx(exchange) {	
	var retVal = 0;
	var commentsB2b;
	var camt056ValdFlagMx;
	var txnComments;
	var inMsg;
	var map;
	var Document;

	logger.info('wrapperSepaCamt056Mx: In wrapperSepaCamt056Mx');
	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	camt056ValdFlagMx = memTblGetTableValue(map, "FLAG-TABLE", "CAMT056_VALD_FLAG_MX");
	camt056ValdFlagMx = camt056ValdFlagMx.trim();
	logger.info("wrapperSepaCamt056Mx: camt056ValdFlagMx = " + camt056ValdFlagMx);

	if(camt056ValdFlagMx == 'ERROR') {

		logger.info("wrapperSepaCamt056Mx: Calling sepaValidationRulescamt056");
		retVal = sepaValidationRulescamt056(camt056ValdFlagMx, exchange);
		logger.info("wrapperSepaCamt056Mx: retVal from sepaValidationRulescamt056 = " + retVal);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaCamt056Mx: txnComments = " + txnComments);

		if(retVal == 0) {
		logger.info("wrapperSepaCamt056Mx: Calling constraintsISORulesSEPACamt056");
		retVal = constraintsISORulesSEPACamt056(camt056ValdFlagMx, exchange);
		logger.info("wrapperSepaCamt056Mx: retVal from constraintsISORulesSEPACamt056 = " + retVal);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaCamt056Mx: txnComments = " + txnComments);
		}

		if(retVal == 0) {
			logger.info("wrapperSepaCamt056Mx: Calling externalCodelistValidationSepaCamt056");
			//retVal = externalCodelistValidationSepaCamt056(Document, map);		
			txnComments = getHeader(map, "PLCN_txnComments");
			logger.info("txnComments from externalCodelistValidationSepaCamt056 = " + txnComments);			
		}

		if(retVal == 0) {
			logger.info("wrapperSepaCamt056Mx: Calling ibanValidationSepaCamt056");
			retVal = ibanValidationSepaCamt056(exchange);
			txnComments = getHeader(map, "PLCN_txnComments");
			logger.info("wrapperSepaCamt056Mx: txnComments from ibanValidationSepaCamt056 = " + txnComments);
		}
	}

	if(camt056ValdFlagMx == 'WARNING') {


		retVal = sepaValidationRulescamt056(camt056ValdFlagMx, exchange);

		logger.info("wrapperSepaCamt056Mx: Calling constraintsISORulesSEPACamt056");
		retVal = constraintsISORulesSEPACamt056(camt056ValdFlagMx, exchange);
		logger.info("wrapperSepaCamt056Mx: retVal from constraintsISORulesSEPACamt056 = " + retVal);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaCamt056Mx: txnComments = " + txnComments);

		logger.info("wrapperSepaCamt056Mx: Calling externalCodelistValidationSepaCamt056");
		//retVal = externalCodelistValidationSepaCamt056(Document, map);		
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("txnComments from externalCodelistValidationSepaCamt056 = " + txnComments);			
		

		logger.info("wrapperSepaCamt056Mx: Calling ibanValidationSepaCamt056");
		ibanValidationSepaCamt056(exchange);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaCamt056Mx: txnComments from ibanValidationSepaCamt056 = " + txnComments);
	}
}
function sepaValidationRulescamt056(camt056ValdFlagMx, exchange){
	logger.info("sepaValidationRulescamt056");
	var retVal;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	retVal = 0;

	if(camt056ValdFlagMx == "ERROR") {

		retVal = sepacamt056ValAssgnrBic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepacamt056ValAssgneBic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepacamt056ValDbtrAgtBic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepacamt056ValCdtrAgtBic(exchange);
		if(retVal != 0) {
			return retVal;
		}
	}
	if(camt056ValdFlagMx == "WARNING") {
		retVal = sepacamt056ValAssgnrBic(exchange);
		retVal = sepacamt056ValAssgneBic(exchange);
		retVal = sepacamt056ValDbtrAgtBic(exchange);
		retVal = sepacamt056ValCdtrAgtBic(exchange);
	}
	return retVal;
}

function ibanValidationSepaCamt056(exchange) {
	var val;
	var retVal = 0;

	logger.info("In ibanValidationSepaCamt056");

	val = validateDbtrAcctIbanSepaCamt056(exchange);
	if(val) {
		retVal = val;
	}

	val = validateCdtrAcctIbanSepaCamt056(exchange);
	if(val) {
		retVal = retVal + val;
	}
}

function validateDbtrAcctIbanSepaCamt056(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateDbtrAcctIbanSepaCamt056");
	path = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateDbtrAcctIbanSepaCamt056: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateDbtrAcctIbanSepaCamt056: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("00", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);		
	}
	return retVal;
}

function validateCdtrAcctIbanSepaCamt056(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateDbtrAcctIbanSepaCamt056");
	path = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateDbtrAcctIbanSepaCamt056: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateDbtrAcctIbanSepaCamt056: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("00", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);		
	}
	return retVal;
}

function sepacamt056ValAssgnrBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepacamt056ValChrgsInfAgtBic');
	bicfiPath = "/Document/FIToFIPmtCxlReq/Assgnmt/Assgnr/Agt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "Assgnr", "126");

	return retVal;
}

function sepacamt056ValAssgneBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepacamt056ValDbtrBic');
	bicfiPath = "/Document/FIToFIPmtCxlReq/Assgnmt/Assgne/Agt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "Assgne", "119");

	return retVal;
}

function sepacamt056ValDbtrAgtBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepacamt056ValDbtrAgtBic');
	bicfiPath = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/DbtrAgt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "DbtrAgt", "00");

	return retVal;
}

function sepacamt056ValCdtrAgtBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepacamt056ValCdtrAgtBic');
	bicfiPath = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "CdtrAgt", "00");

	return retVal;
}

function constraintsISORulesSEPACamt056(camt056ValdFlagMx, exchange) {
	var retVal;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In constraintsISORulesSEPACamt056");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	retVal = 0;

	if(camt056ValdFlagMx == "ERROR") {
		
		retVal = reimbursementAgentRuleCamt056(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = sttlmMtdRuleCamt056(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = grpCxlAndRsnRuleCamt056(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		// retVal = messageOrGroupCaseRuleCamt056(Document, map);
		// if(retVal != 0) {
		// 	return retVal;
		// }
		
	}
	if(camt056ValdFlagMx == "WARNING") {
		
		retVal = reimbursementAgentRuleCamt056(Document, map);
		retVal = sttlmMtdRuleCamt056(Document, map);
		retVal = grpCxlAndRsnRuleCamt056(Document, map);
		// retVal = messageOrGroupCaseRuleCamt056(Document, map);
	}	
	return retVal;
}

//Camt029

function wrapperSepaCamt029Mx(exchange) {	
	var retVal = 0;
	var commentsB2b;
	var camt029ValdFlagMx;
	var txnComments;
	var inMsg;
	var map;
	var Document;

	logger.info('wrapperSepaCamt029Mx: In wrapperSepaCamt029Mx');
	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	camt029ValdFlagMx = memTblGetTableValue(map, "FLAG-TABLE", "CAMT029_VALD_FLAG_MX");
	camt029ValdFlagMx = camt029ValdFlagMx.trim();
	logger.info("wrapperSepaCamt029Mx: camt029ValdFlagMx = " + camt029ValdFlagMx);

	if(camt029ValdFlagMx == 'ERROR') {

		logger.info("wrapperSepaCamt029Mx: Calling sepaValidationRulesCamt029");
		retVal = sepaValidationRulesCamt029(camt029ValdFlagMx, exchange);
		logger.info("wrapperSepaCamt029Mx: retVal from sepaValidationRulesCamt029 = " + retVal);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaCamt029Mx: txnComments = " + txnComments);
		
		if(retVal == 0) {
		logger.info("wrapperSepaCamt029Mx: Calling constraintsISORulesSEPACamt029");
		retVal = constraintsISORulesSEPACamt029(camt029ValdFlagMx, exchange);
		logger.info("wrapperSepaCamt029Mx: retVal from constraintsISORulesSEPACamt029 = " + retVal);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaCamt029Mx: txnComments = " + txnComments);
		}

		if(retVal == 0) {
			logger.info("wrapperSepaCamt029Mx: Calling externalCodelistValidationSepaCamt029");
			//retVal = externalCodelistValidationSepaCamt029(Document, map);		
			txnComments = getHeader(map, "PLCN_txnComments");
			logger.info("txnComments from externalCodelistValidationSepaCamt029 = " + txnComments);			
		}

		if(retVal == 0) {
			logger.info("wrapperSepaCamt029Mx: Calling ibanValidationSepaCamt029");
			retVal = ibanValidationSepaCamt029(exchange);
			txnComments = getHeader(map, "PLCN_txnComments");
			logger.info("wrapperSepaCamt029Mx: txnComments from ibanValidationSepaCamt029 = " + txnComments);
		}
	}

	if(camt029ValdFlagMx == 'WARNING') {
		
		retVal = sepaValidationRulesCamt029(camt029ValdFlagMx, exchange);

		logger.info("wrapperSepaCamt029Mx: Calling constraintsISORulesSEPACamt029");
		retVal = constraintsISORulesSEPACamt029(camt029ValdFlagMx, exchange);
		logger.info("wrapperSepaCamt029Mx: retVal from constraintsISORulesSEPACamt029 = " + retVal);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaCamt029Mx: txnComments = " + txnComments);

		logger.info("wrapperSepaCamt029Mx: Calling externalCodelistValidationSepaCamt029");
		//retVal = externalCodelistValidationSepaCamt029(Document, map);		
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("txnComments from externalCodelistValidationSepaCamt029 = " + txnComments);			
		

		logger.info("wrapperSepaCamt029Mx: Calling ibanValidationSepaCamt029");
		ibanValidationSepaCamt029(exchange);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaCamt029Mx: txnComments from ibanValidationSepaCamt029 = " + txnComments);
	}
}

function sepaValidationRulesCamt029(camt029ValdFlagMx, exchange){
	logger.info("sepaValidationRulesCamt029");
	var retVal;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	retVal = 0;

	if(camt029ValdFlagMx == "ERROR") {

		retVal = sepaCamt029ValAssgnrBic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaCamt029ValAssgneBic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaCamt029ValDbtrAgtBic(exchange);
		if(retVal != 0) {
			return retVal;
		}

		retVal = sepaCamt029ValCdtrAgtBic(exchange);
		if(retVal != 0) {
			return retVal;
		}
	}
	if(camt029ValdFlagMx == "WARNING") {
		retVal = sepaCamt029ValAssgnrBic(exchange);
		retVal = sepaCamt029ValAssgneBic(exchange);
		retVal = sepaCamt029ValDbtrAgtBic(exchange);
		retVal = sepaCamt029ValCdtrAgtBic(exchange);
	}
	return retVal;
}

function sepaCamt029ValAssgnrBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaCamt029ValChrgsInfAgtBic');
	bicfiPath = "/Document/RsltnOfInvstgtn/Assgnmt/Assgnr/Agt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "Assgnr", "126");

	return retVal;
}

function sepaCamt029ValAssgneBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaCamt029ValDbtrBic');
	bicfiPath = "/Document/RsltnOfInvstgtn/Assgnmt/Assgne/Agt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "Assgne", "119");

	return retVal;
}

function sepaCamt029ValDbtrAgtBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaCamt029ValDbtrAgtBic');
	bicfiPath = "/Document/RsltnOfInvstgtn/CxlDtls/TxInf/OrgnlTxRef/DbtrAgt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "DbtrAgt", "00");

	return retVal;
}

function sepaCamt029ValCdtrAgtBic(exchange) {
	var retVal;
	var bicfiPath;

	logger.info('In sepaCamt029ValCdtrAgtBic');
	bicfiPath = "/Document/RsltnOfInvstgtn/CxlDtls/TxInf/OrgnlTxRef/CdtrAgt/FinInstnId/BICFI";
	retVal = validateBicFromPath(exchange, bicfiPath, "CdtrAgt", "00");

	return retVal;
}

function ibanValidationSepaCamt029(exchange) {
	var val;
	var retVal = 0;

	logger.info("In ibanValidationSepaCamt029");

	val = validateDbtrAcctIbanSepaCamt029(exchange);
	if(val) {
		retVal = val;
	}

	val = validateCdtrAcctIbanSepaCamt029(exchange);
	if(val) {
		retVal = retVal + val;
	}
}

function validateDbtrAcctIbanSepaCamt029(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateDbtrAcctIbanSepaCamt029");
	path = "/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/DbtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateDbtrAcctIbanSepaCamt029: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateDbtrAcctIbanSepaCamt029: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("00", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);		
	}
	return retVal;
}

function validateCdtrAcctIbanSepaCamt029(exchange) {
	var path;
	var value;
	var validFlag;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In validateDbtrAcctIbanSepaCamt029");
	path = "/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/CdtrAcct/Id/IBAN";
	value = getValueFromPath(Document, path);
	logger.info("validateDbtrAcctIbanSepaCamt029: IBAN value = " + value);

	if(value) {
		validFlag = IBAN.isValid(value);
		logger.info("validateDbtrAcctIbanSepaCamt029: validFlag value = " + validFlag);

		if(validFlag == false) {
			setHeader(map, "PLCN_validMessage", false);
			retVal = setCommentsForTransaction("00", "5714", map);
			retVal = 1;
		}

		//ibanUpper(exchange, path, value);		
	}
	return retVal;
}

function constraintsISORulesSEPACamt029(camt029ValdFlagMx, exchange) {
	var retVal;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In constraintsISORulesSEPACamt029");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	retVal = 0;

	if(camt029ValdFlagMx == "ERROR") {
		
		retVal = amendmentIndicatorRuleCamt029(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = genericMustPresentRuleCamt029(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = genericNotAllowedRuleCamt029(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = settlementMethodRuleCamt029(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = genericEitherFieldPresentRuleCamt029(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
	}
	if(camt029ValdFlagMx == "WARNING") {
		
		retVal = amendmentIndicatorRuleCamt029(Document, map);
		retVal = genericMustPresentRuleCamt029(Document, map);
		retVal = genericNotAllowedRuleCamt029(Document, map);
		retVal = settlementMethodRuleCamt029(Document, map);
		retVal = genericEitherFieldPresentRuleCamt029(Document, map);
	}	
	return retVal;
}
//DPH 9.7

function wrapperSepaPacs003Mx(exchange) {
	logger.info("wrapperSepaPacs003Mx");
	var retVal;
	var commentsB2b;
	var pacs03ValdFlagMx;
	var txnComments;
	var inMsg;
	var map;
	var Document;
	var tenantName;
	var tenantNamePath;
	var manualMode;

	logger.info('wrapperSepaPacs003Mx:In wrapperSepaPacs003Mx');
	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	pacs03ValdFlagMx = memTblGetTableValue(map, "FLAG-TABLE", "PACS03_VALD_FLAG_MX");
	pacs03ValdFlagMx = pacs03ValdFlagMx.trim();
	logger.info("pacs03ValdFlagMx = " + pacs03ValdFlagMx);

	manualMode = getHeader(map, "PLCN_manualMode");
	logger.info("wrapperSepaPacs003Mx: manualMode " +manualMode);
	
	var institutionId = getHeader(map, "PLCN_institutionId");
	tenantName = getHeader(map, "PLCN_tenantName");
	logger.info("wrapperSepaPacs003Mx: tenantName = " + tenantName);
	if(!tenantName){
		var tenantNamePath = institutionId + ".INSTITUTION_DETAILS.TENANT_NAME";
		logger.info("wrapperSepaPacs003Mx: tenantName = " + tenantNamePath);
		tenantName = memTblGetTableValue(map, "INST_PARAM",tenantNamePath);
		logger.info("wrapperSepaPacs003Mx: tenantName = " + tenantName);
	}

	if(pacs03ValdFlagMx == 'ERROR') {

		logger.info("wrapperSepaPacs003Mx: Calling sepaValidationRulesPacs003");
		retVal = sepaValidationRulesPacs003(pacs03ValdFlagMx, exchange);
		logger.info("wrapperSepaPacs003Mx: retVal from sepaValidationRulesPacs003 = " + retVal);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs003Mx: txnComments = " + txnComments);

		if(retVal == 0) {
			logger.info("wrapperSepaPacs003Mx: Calling externalCodelistValidationSepaPacs003");
			//retVal = externalCodelistValidationSepaPacs003(Document, map);		
			txnComments = getHeader(map, "PLCN_txnComments");
			logger.info("txnComments from externalCodelistValidationSepaPacs003 = " + txnComments);			
		}

		if(retVal == 0) {
			logger.info("wrapperSepaPacs003Mx: Calling ibanValidationSepaPacs003");
			//retVal = ibanValidationSepaPacs003(exchange);
			txnComments = getHeader(map, "PLCN_txnComments");
			logger.info("wrapperSepaPacs003Mx: txnComments from ibanValidationSepaPacs003 = " + txnComments);
		}
		
		if(retVal == 0) {
		logger.info("wrapperSepaPacs003Mx: Calling constraintsISORulesSEPAPacs003");
		constraintsISORulesSEPAPacs003(pacs03ValdFlagMx,exchange);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs003Mx: txnComments from constraintsISORulesSEPAPacs003 = " + txnComments);
		}
		
		if(retVal == 0 && manualMode == "REPAIR" && (tenantName == "SNTDBK" || tenantName == "PLNT01")) {
		logger.info("wrapperSepaPacs003Mx: Calling sepaCustomValidationsPacs003");
		sepaCustomValidationsPacs003(pacs03ValdFlagMx,exchange);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs003Mx: txnComments from sepaCustomValidationsPacs003 = " + txnComments);
		}
	}

	if(pacs03ValdFlagMx == 'WARNING') {

		logger.info("wrapperSepaPacs003Mx: Calling sepaValidationRulesPacs003");
		retVal = sepaValidationRulesPacs003(pacs03ValdFlagMx, exchange);
		logger.info("wrapperSepaPacs003Mx: retVal from sepaValidationRulesPacs003 = " + retVal);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs003Mx: txnComments = " + txnComments);

		logger.info("wrapperSepaPacs003Mx: Calling externalCodelistValidationSepaPacs003");
		retVal = externalCodelistValidationSepaPacs003(Document, map);		
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("txnComments from externalCodelistValidationSepaPacs003 = " + txnComments);			
		
		logger.info("wrapperSepaPacs003Mx: Calling ibanValidationSepaPacs003");
		ibanValidationSepaPacs003(exchange);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs003Mx: txnComments from ibanValidationSepaPacs003 = " + txnComments);
		
		logger.info("wrapperSepaPacs003Mx: Calling constraintsISORulesSEPAPacs003");
		//constraintsISORulesSEPAPacs003(pacs03ValdFlagMx,exchange);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs003Mx: txnComments from constraintsISORulesSEPAPacs003 = " + txnComments);
	}
}

function sepaValidationRulesPacs003(pacs03ValdFlagMx, exchange){
	logger.info("sepaValidationRulesPacs003");
	var retVal;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	retVal = 0;

	if(pacs03ValdFlagMx == "ERROR") {
		
		retVal = inclusionOfElementsClrSysPacs003Rule(Document, map);
		if(retVal != 0) {
			return retVal;
		}
/* 		retVal = svcLvlOccurenceSepaPacs003(exchange);
		if(retVal != 0) {
			return retVal;
		} */
		retVal = townNameAndCountryRuleSepaPacs003(exchange);
		if(retVal != 0) {
			return retVal;
		}
		retVal = adrLineOptinalElementRuleSepaPacs003(exchange);
		if(retVal != 0) {
			return retVal;
		}
	}
	if(pacs03ValdFlagMx == "WARNING") {
		
		retVal = inclusionOfElementsClrSysPacs003Rule(Document, map);
		;retVal = svcLvlOccurenceSepaPacs003(exchange);
		retVal = townNameAndCountryRuleSepaPacs003(exchange);
		retVal = adrLineOptinalElementRuleSepaPacs003(exchange);
		
	}
	return retVal;
}

function inclusionOfElementsClrSysPacs003Rule(Document, map) {
	
	var retVal ; 

	logger.info("In inclusionOfElementsClrSysPacs003Rule");
	retVal = 0;

	var CtgyPurpCheck1 = isXmlNodePresent(Document, "GrpHdr", "PmtTpInf", "CtgyPurp");
	logger.info("inclusionOfElementsClrSysPacs003Rule: CtgyPurpCheck1 = " + CtgyPurpCheck1); 

	if(CtgyPurpCheck1)
	{
		var ctgyPurpCd = isXmlNodePresent3(Document, "GrpHdr", "PmtTpInf", "CtgyPurp", "<Cd>");
		logger.info("inclusionOfElementsClrSysPacs003Rule: ctgyPurpCd = " + ctgyPurpCd);
		
		var ctgyPurpPrtry = isXmlNodePresent3(Document, "GrpHdr", "PmtTpInf", "CtgyPurp", "<Prtry>");
		logger.info("inclusionOfElementsClrSysPacs003Rule: ctgyPurpPrtry = " + ctgyPurpPrtry);

		if(!ctgyPurpCd && !ctgyPurpPrtry)
		{
			setHeader(map, "PLCN_validMessage",false);
			retVal = setCommentsForTransaction("025", "7130", map);
			logger.info("inclusionOfElementsClrSysPacs003Rule: Inclusion of sub-elements ‘Code’ and ‘Proprietary’.");
			return retVal;
		}
	} 
	
	var CtgyPurpCheck2 = isXmlNodePresent(Document, "DrctDbtTxInf", "PmtTpInf", "CtgyPurp");
	logger.info("inclusionOfElementsClrSysPacs003Rule: CtgyPurpCheck2 = " + CtgyPurpCheck2); 

	if(CtgyPurpCheck2)
	{
		var ctgyPurpCd = isXmlNodePresent3(Document, "DrctDbtTxInf", "PmtTpInf", "CtgyPurp", "<Cd>");
		logger.info("inclusionOfElementsClrSysPacs003Rule: ctgyPurpCd = " + ctgyPurpCd);
		
		var ctgyPurpPrtry = isXmlNodePresent3(Document, "DrctDbtTxInf", "PmtTpInf", "CtgyPurp", "<Prtry>");
		logger.info("inclusionOfElementsClrSysPacs003Rule: ctgyPurpPrtry = " + ctgyPurpPrtry);

		if(!ctgyPurpCd && !ctgyPurpPrtry)
		{
			setHeader(map, "PLCN_validMessage",false);
			retVal = setCommentsForTransaction("047", "7130", map);
			logger.info("inclusionOfElementsClrSysPacs003Rule: Inclusion of sub-elements ‘Code’ and ‘Proprietary’.");
			return retVal;
		}
	} 
	return retVal;
}

function svcLvlOccurenceSepaPacs003(exchange) {
	logger.info("In svcLvlOccurenceSepaPacs003");
	var svcLvlGrpHdr;
	var svcLvlDrctDbtTxInf;
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var Document1 = inMsg.getBody(java.lang.String.class);

	svcLvlGrpHdr = isXmlNodePresent3(Document, "FIToFICstmrDrctDbt", "GrpHdr", "PmtTpInf", "<SvcLvl>");
	logger.info("svcLvlOccurenceSepaPacs003:svcLvlGrpHdr = " + svcLvlGrpHdr);
	svcLvlDrctDbtTxInf = isXmlNodePresent3(Document, "FIToFICstmrDrctDbt", "DrctDbtTxInf", "PmtTpInf", "<SvcLvl>");
	logger.info("svcLvlOccurenceSepaPacs003:svcLvlDrctDbtTxInf = " + svcLvlDrctDbtTxInf);

	if(svcLvlGrpHdr && svcLvlDrctDbtTxInf){
		setHeader(map, "PLCN_validMessage", false);
		logger.info("svcLvlOccurenceSepaPacs003: Only one occurence of SvcLvl is allowed");
		retVal = setCommentsForTransaction("037", "7058", map);
		return retVal;
	}
	return retVal;
}

function townNameAndCountryRuleSepaPacs003(exchange) {  //DONE 
	logger.info("townNameAndCountryRuleSepaPacs003");
	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var Document1 = inMsg.getBody(java.lang.String.class);
	
	//CREDITOR
	var cdtrPstlAdr = isXmlNodePresent(Document, "DrctDbtTxInf" , "Cdtr", "<PstlAdr>");
	logger.info("townNameAndCountryRuleSepaPacs003:cdtrPstlAdr = " + cdtrPstlAdr);

	var cdtrAddrLinePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/AdrLine';
	var cdtrAddrLine = getValueFromPath(Document, cdtrAddrLinePath);
	logger.info("townNameAndCountryRuleSepaPacs003:cdtrAddrLine = " + cdtrAddrLine);

	var cdtrTwnNmPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/TwnNm';
	var cdtrTwnNm = getValueFromPath(Document, cdtrTwnNmPath);
	logger.info("townNameAndCountryRuleSepaPacs003:cdtrTwnNm = " + cdtrTwnNm);

	var cdtrCtryPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/Ctry';
	var cdtrCtry = getValueFromPath(Document, cdtrCtryPath);
	logger.info("townNameAndCountryRuleSepaPacs003:cdtrCtry = " + cdtrCtry);

	if(isPatternPresent(Document1, "<Cdtr>")){
		if(cdtrPstlAdr){
			if(!cdtrAddrLine && (!cdtrTwnNm || !cdtrCtry)){
				setHeader(map, "PLCN_validMessage", false);
				logger.info("townNameAndCountryRuleSepaPacs003:Cdtr-If PostalAddress is used & if AddressLine is absent then Country and Town name must be present");
				retVal = setCommentsForTransaction("104", "7926", map);
				return retVal;
			}
		}
	}

	//DEBTOR
	var dbtrPstlAdr = isXmlNodePresent(Document, "DrctDbtTxInf" , "Dbtr", "<PstlAdr>");
	logger.info("townNameAndCountryRuleSepaPacs003:dbtrPstlAdr = " + dbtrPstlAdr);

	var dbtrAddrLinePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/AdrLine';
	var dbtrAddrLine = getValueFromPath(Document, dbtrAddrLinePath);
	logger.info("townNameAndCountryRuleSepaPacs003:dbtrAddrLine = " + dbtrAddrLine);

	var dbtrTwnNmPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/TwnNm';
	var dbtrTwnNm = getValueFromPath(Document, dbtrTwnNmPath);
	logger.info("townNameAndCountryRuleSepaPacs003:dbtrTwnNm = " + dbtrTwnNm);

	var dbtrCtryPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/Ctry';
	var dbtrCtry = getValueFromPath(Document, dbtrCtryPath);
	logger.info("townNameAndCountryRuleSepaPacs003:dbtrCtry = " + dbtrCtry);

	if(isPatternPresent(Document1, "<Dbtr>")){
		if(dbtrPstlAdr){
			if(!dbtrAddrLine && (!dbtrTwnNm || !dbtrCtry)){
				setHeader(map, "PLCN_validMessage", false);
				logger.info("townNameAndCountryRuleSepaPacs003:DBTR-If PostalAddress is used & if AddressLine is absent then Country and Town name must be present");
				retVal = setCommentsForTransaction("146", "7926", map);
				return retVal;
			}
		}
	}		
	return retVal;
}
function adrLineOptinalElementRuleSepaPacs003(exchange){ 
	logger.info("adrLineOptinalElementRuleSepaPacs003");

	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var Document1 = inMsg.getBody(java.lang.String.class);

	//CREDITOR
	var cdtrPstlAdr =  isXmlNodePresent(Document, "DrctDbtTxInf", "Cdtr", "<PstlAdr>");

	var cdtrAddrLinePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/AdrLine';
	var cdtrAddrLine = getValueFromPath(Document, cdtrAddrLinePath);

	var cdtrTwnNmPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/TwnNm';
	var cdtrTwnNm = getValueFromPath(Document, cdtrTwnNmPath);

	var cdtrCtryPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/Ctry';
	var cdtrCtry = getValueFromPath(Document, cdtrCtryPath);

	var cdtrDeptPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/Dept';
	var cdtrDept = getValueFromPath(Document, cdtrDeptPath);

	var cdtrSubDeptPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/SubDept';
	var cdtrSubDept = getValueFromPath(Document, cdtrSubDeptPath);

	var cdtrStrtNmPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/StrtNm';
	var cdtrStrtNm = getValueFromPath(Document, cdtrStrtNmPath);

	var cdtrBldgNbPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/BldgNb';
	var cdtrBldgNb = getValueFromPath(Document, cdtrBldgNbPath);

	var cdtrBldgNmPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/BldgNm';
	var cdtrBldgNm = getValueFromPath(Document, cdtrBldgNmPath);

	var cdtrFlrPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/Flr';
	var cdtrFlr = getValueFromPath(Document, cdtrFlrPath);

	var cdtrPstBxPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/PstBx';
	var cdtrPstBx = getValueFromPath(Document, cdtrPstBxPath);

	var cdtrRoomPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/Room';
	var cdtrRoom = getValueFromPath(Document, cdtrRoomPath);

	var cdtrPstCdPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/PstCd';
	var cdtrPstCd = getValueFromPath(Document, cdtrPstCdPath);

	var cdtrTwnLctnNmPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/TwnLctnNm';
	var cdtrTwnLctnNm = getValueFromPath(Document, cdtrTwnLctnNmPath);

	var cdtrDstrctNmPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/DstrctNm';
	var cdtrDstrctNm = getValueFromPath(Document, cdtrDstrctNmPath);

	var cdtrCtrySubDvsnPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/CtrySubDvsn';
	var cdtrCtrySubDvsn = getValueFromPath(Document, cdtrCtrySubDvsnPath);

	if(isPatternPresent(Document1, "<Cdtr>")){
		if(cdtrPstlAdr){
			if(cdtrAddrLine && (cdtrDept||cdtrSubDept||cdtrStrtNm||cdtrBldgNb||cdtrBldgNm||cdtrFlr||cdtrPstBx||cdtrRoom||cdtrPstCd||cdtrTwnNm||cdtrTwnLctnNm ||cdtrDstrctNm||cdtrCtrySubDvsn)){
				setHeader(map, "PLCN_validMessage", false);
				logger.info("adrLineOptinalElementRuleSepaPacs003:Cdtr-If PstlAddr is used & if Adrline is present then all other optional elements except Country in PostalAddress must be absent");
				retVal = setCommentsForTransaction("104", "7928", map);
				return retVal;
			}
		}
	}	

	//DEBTOR
	var dbtrPstlAdr =  isXmlNodePresent(Document, "DrctDbtTxInf", "Dbtr", "<PstlAdr>");

	var dbtrAddrLinePath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/AdrLine';
	var dbtrAddrLine = getValueFromPath(Document, dbtrAddrLinePath);

	var dbtrTwnNmPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/TwnNm';
	var dbtrTwnNm = getValueFromPath(Document, dbtrTwnNmPath);

	var dbtrCtryPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/Ctry';
	var dbtrCtry = getValueFromPath(Document, dbtrCtryPath);

	var dbtrDeptPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/Dept';
	var dbtrDept = getValueFromPath(Document, dbtrDeptPath);

	var dbtrSubDeptPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Cdtr/PstlAdr/SubDept';
	var dbtrSubDept = getValueFromPath(Document, dbtrSubDeptPath);

	var dbtrStrtNmPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/StrtNm';
	var dbtrStrNm = getValueFromPath(Document, dbtrStrtNmPath);

	var dbtrBldgNbPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/BldgNb';
	var dbtrBldgNb = getValueFromPath(Document, dbtrBldgNbPath);

	var dbtrBldgNmPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/BldgNm';
	var dbtrBldgNm = getValueFromPath(Document, dbtrBldgNmPath);

	var dbtrFlrPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/Flr';
	var dbtrFlr = getValueFromPath(Document, dbtrFlrPath);

	var dbtrPstBxPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/PstBx';
	var dbtrPstBx = getValueFromPath(Document, dbtrPstBxPath);

	var dbtrRoomPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/Room';
	var dbtrRoom = getValueFromPath(Document, dbtrRoomPath);

	var dbtrPstCdPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/PstCd';
	var dbtrPstCd = getValueFromPath(Document, dbtrPstCdPath);

	var dbtrTwnLctnNmPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/TwnLctnNm';
	var dbtrTwnLctnNm = getValueFromPath(Document, dbtrTwnLctnNmPath);

	var dbtrDstrctNmPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/DstrctNm';
	var dbtrDstrctNm = getValueFromPath(Document, dbtrDstrctNmPath);

	var dbtrCtrySubDvsnPath = '/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/Dbtr/PstlAdr/CtrySubDvsn';
	var dbtrCtrySubDvsn = getValueFromPath(Document, dbtrCtrySubDvsnPath);

	if(isPatternPresent(Document1, "<Dbtr>")){
		if(dbtrPstlAdr){
			if(dbtrAddrLine && (dbtrDept||dbtrSubDept||dbtrStrNm||dbtrBldgNb||dbtrBldgNm||dbtrFlr||dbtrPstBx||dbtrRoom||dbtrPstCd||dbtrTwnLctnNm||dbtrDstrctNm||dbtrCtrySubDvsn||dbtrTwnNm)){
				setHeader(map, "PLCN_validMessage", false);
				logger.info("adrLineOptinalElementRuleSepaPacs003:Dbtr-If PstlAddr is used & if Adrline is present then all other optional elements except country in PostalAddress must be absent");
				retVal = setCommentsForTransaction("146", "7928", map);
				return retVal;
			}
		}
	}
	return retVal;	
}

function constraintsISORulesSEPAPacs003(pacs03ValdFlagMx, exchange) {
	var retVal;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In constraintsISORulesSEPAPacs003");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	retVal = 0;

	if(pacs03ValdFlagMx == "ERROR") {
		
		retVal = grpHdrDrctDbtTxInfFldCompRulePacs003(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = b2bInstAmtExchRateSepaPacs003(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
        /*
		 retVal = grpHdrTtlintrBkSttlmAmtRulePacs003(Document, map);
		if(retVal != 0) {
			return retVal;
		} 
        */
		
		retVal = b2bIntrBnkSttltDateSepaPacs003(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = b2bTtlIntrBkSttlmAmtCcySepaPacs003(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = genericMustPresentRulePacs003(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = settlementMethodRulePacs003(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		/*retVal = dbtrUltmtDbtrContentCheckPacs003(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
		retVal = cdtrUltmtCdtrContentCheckPacs003(Document, map);
		if(retVal != 0) {
			return retVal;
		}*/
		
		retVal = eitherFieldPresentRulePacs003(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
	}
	if(pacs03ValdFlagMx == "WARNING") {
		
		retVal = grpHdrDrctDbtTxInfFldCompRulePacs003(Document, map);
		retVal = b2bInstAmtExchRateSepaPacs003(Document, map);
		//retVal = grpHdrTtlintrBkSttlmAmtRulePacs003(Document, map);
		retVal = b2bIntrBnkSttltDateSepaPacs003(Document, map);
		retVal = b2bTtlIntrBkSttlmAmtCcySepaPacs003(Document, map);
		retVal = genericMustPresentRulePacs003(Document, map);
		retVal = settlementMethodRulePacs003(Document, map);
		/* retVal = dbtrUltmtDbtrContentCheckPacs003(Document, map);
		retVal = cdtrUltmtCdtrContentCheckPacs003(Document, map); */
		retVal = eitherFieldPresentRulePacs003(Document, map);
	}	
	return retVal;
}

//SEPA PACS007

function wrapperSepaPacs007Mx(exchange) {
	logger.info("wrapperSepaPacs007Mx");
	var retVal;
	var commentsB2b;
	var pacs07ValdFlagMx;
	var txnComments;
	var inMsg;
	var map;
	var Document;

	logger.info('wrapperSepaPacs007Mx: In wrapperSepaPacs007Mx');
	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	pacs07ValdFlagMx = memTblGetTableValue(map, "FLAG-TABLE", "PACS07_VALD_FLAG_MX");
	pacs07ValdFlagMx = pacs07ValdFlagMx.trim();
	logger.info("pacs07ValdFlagMx = " + pacs07ValdFlagMx);
	retVal = 0;  //TESTING

	if(pacs07ValdFlagMx == 'ERROR') {

		logger.info("wrapperSepaPacs007Mx: Calling sepaValidationRulesPacs007");
		//retVal = sepaValidationRulesPacs007(pacs07ValdFlagMx, exchange);
		logger.info("wrapperSepaPacs007Mx: retVal from sepaValidationRulesPacs007 = " + retVal);
		txnComments = getHeader(map, 'PLCN_txnComments');
		logger.info("wrapperSepaPacs007Mx: txnComments = " + txnComments);

		if(retVal == 0) {
			logger.info("wrapperSepaPacs007Mx: Calling externalCodelistValidationSepaPacs007");
			//retVal = externalCodelistValidationSepaPacs007(Document, map);		
			txnComments = getHeader(map, 'PLCN_txnComments');
			logger.info("wrapperSepaPacs007Mx: txnComments from externalCodelistValidationSepaPacs007 = " + txnComments);			
		}

		if(retVal == 0) {
			logger.info("wrapperSepaPacs007Mx: Calling ibanValidationSepaPacs007");
			//retVal = ibanValidationSepaPacs007(exchange);
			txnComments = getHeader(map, 'PLCN_txnComments');
			logger.info("wrapperSepaPacs007Mx: txnComments from ibanValidationSepaPacs007 = " + txnComments);
		}
		
		if(retVal == 0) {
			logger.info("wrapperSepaPacs007Mx: Calling constraintsISORulesSEPAPacs007");
			constraintsISORulesSEPAPacs007(pacs07ValdFlagMx,exchange);
			txnComments = getHeader(map, 'PLCN_txnComments');
			logger.info("wrapperSepaPacs007Mx: txnComments from constraintsISORulesSEPAPacs007 = " + txnComments);
		}
	}

	if(pacs07ValdFlagMx == 'WARNING') {

		logger.info("wrapperSepaPacs007Mx: Calling sepaValidationRulesPacs007");
		//retVal = sepaValidationRulesPacs007(pacs07ValdFlagMx, exchange);
		logger.info("wrapperSepaPacs007Mx: retVal from sepaValidationRulesPacs007 = " + retVal);
		txnComments = getHeader(map, 'PLCN_txnComments');
		logger.info("wrapperSepaPacs007Mx: txnComments = " + txnComments);

		logger.info("wrapperSepaPacs007Mx: Calling externalCodelistValidationSepaPacs007");
		//retVal = externalCodelistValidationSepaPacs007(Document, map);		
		txnComments = getHeader(map, 'PLCN_txnComments');
		logger.info("wrapperSepaPacs007Mx: txnComments from externalCodelistValidationSepaPacs007 = " + txnComments);			
		
		logger.info("wrapperSepaPacs007Mx: Calling ibanValidationSepaPacs007");
		//ibanValidationSepaPacs007(exchange);
		txnComments = getHeader(map, 'PLCN_txnComments');
		logger.info("wrapperSepaPacs007Mx: txnComments from ibanValidationSepaPacs007 = " + txnComments);
		
		logger.info("wrapperSepaPacs007Mx: Calling constraintsISORulesSEPAPacs007");
		constraintsISORulesSEPAPacs007(pacs07ValdFlagMx,exchange);
		txnComments = getHeader(map, 'PLCN_txnComments');
		logger.info("wrapperSepaPacs007Mx: txnComments from constraintsISORulesSEPAPacs007 = " + txnComments);
	}
}

function constraintsISORulesSEPAPacs007(pacs07ValdFlagMx, exchange) {
	var retVal;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In constraintsISORulesSEPAPacs007");

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	retVal = 0;

	if(pacs07ValdFlagMx == "ERROR") {
		
		retVal = intrBnkSttltDateSepaPacs007(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = sttlmMtdRuleSepaPacs007(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = genericMustPresentRulePacs007(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = OrgnlGrpInfoSepaPacs007Rule(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = chargesInfoSepaPacs007Rule(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		retVal = AmdmntIndSepaPacs007Rule(Document, map);
		if(retVal != 0) {
			return retVal;
		}
		
	}
	if(pacs07ValdFlagMx == "WARNING") {
		
		retVal = AmdmntIndSepaPacs007Rule(Document, map);
		retVal = chargesInfoSepaPacs007Rule(Document, map);
		retVal = OrgnlGrpInfoSepaPacs007Rule(Document, map);
		retVal = sttlmMtdRuleSepaPacs007(Document, map);
		retVal = genericMustPresentRulePacs007(Document, map);
		retVal = intrBnkSttltDateSepaPacs007(Document, map);

	}
	return retVal;
}

function sntdManualBackofficeCheck(exchange) {
	var iban;
	var retVal;
	var ibanPath;
	var msgType;
	var formatLabel;
	var processPath;
	var processLevel;
	var institutionId;
	var orgmsgnmidPath;
	var orgmsgnmid;
	var channelIdSource;
	var manualMode;
	var key;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	logger.info("sntdManualBackofficeCheck: for pacs008");
	msgType = getHeader(map, "PaymentType");
	logger.info("sntdManualBackofficeCheck: msgType = " + msgType);
	sourceChannelId = getHeader(map, "PLCN_channelIdSource");
	logger.info("sntdManualBackofficeCheck: sourceChannelId = " + sourceChannelId);
	manualMode = getHeader(map, "PLCN_manualMode");
	logger.info("sntdManualBackofficeCheck: manualMode = " + manualMode);
	institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("sntdManualBackofficeCheck: institutionId = " + institutionId);
	
	//skipped the SWIFT messages validations
	
	if(isPatternPresent(msgType, "FMESSAGE") && !isPatternPresent(manualMode, "REPAIR")){
		return 0;
	}
	

	if(institutionId) {
		key  = institutionId.concat(".PROCESSING_LEVEL.PRODUCTS");
	}
	logger.info("sntdManualBackofficeCheck: Key = " + key);
	var processLevel = memTblGetTableValue(map, "INST_PARAM", key);
	logger.info("sntdManualBackofficeCheck: process Level = " + processLevel);	

	if(processLevel != "MESSAGE"){
		return 0;
	}
	
	if(isPatternPresent(msgType, "pacs.004") && sourceChannelId != "PELICAN" && sourceChannelId != "IB_SDD_RTR_IN"){
		return 0;
	}
	
	if(sourceChannelId == "PELICAN" || sourceChannelId == "LEASE-OB-IN" || sourceChannelId == "PCS-OB-IN" || sourceChannelId == "DOLPHIN-OB-IN" || sourceChannelId == "DINERO-OB-IN" || sourceChannelId == "SAP-OB-IN"){
		logger.info("sntdManualBackofficeCheck: inside sourceChannelId loop ");
		if(isPatternPresent(msgType, "pacs.008")){
			logger.info("sntdManualBackofficeCheck: inside pacs008 loop ");
			var ibanPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN";
			var iban = getValueFromPath(Document, ibanPath);
			  logger.info("sntdManualBackofficeCheck: iban = " + iban);
		}
		if(isPatternPresent(msgType, "pacs.003")){
			 ibanPath = "/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/CdtrAcct/Id/IBAN";
			 iban = getValueFromPath(Document, ibanPath);
			 logger.info("sntdManualBackofficeCheck: iban for PACS003 = " + iban);
		}
		
		if(isPatternPresent(msgType, "pacs.004")){
			 logger.info("sntdManualBackofficeCheck: inside pacs004 loop ");
			 orgmsgnmidPath = "/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId";
			 orgmsgnmid = getValueFromPath(Document, orgmsgnmidPath);
			 logger.info("sntdManualBackofficeCheck: orgmsgnmid for PACS004 = " + orgmsgnmid);
			 
			if(isPatternPresent(orgmsgnmid, "pacs.008")){
				 logger.info("sntdManualBackofficeCheck: inside pacs004 orginalmsgid pacs008 loop ");
				 ibanPath = "/Document/PmtRtr/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN";
				 iban = getValueFromPath(Document, ibanPath);
				 logger.info("sntdManualBackofficeCheck: iban for PACS004 = " + iban);
			}
			if(isPatternPresent(orgmsgnmid, "pacs.003")){
				 ibanPath = "/Document/PmtRtr/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN";
				 iban = getValueFromPath(Document, ibanPath);
				 logger.info("sntdManualBackofficeCheck: iban for PACS004 = " + iban);
			}
		}
		
		//skipped the SWIFT messages validations
	}
	
	if(sourceChannelId == "IB_SCT_IN" || sourceChannelId == "IB_SDD_IN" || sourceChannelId == "SWIFT_FIN_IB" || sourceChannelId == "IB_SDD_RTR_IN" || sourceChannelId == "OB-MX-PAY-PELMAN" ){
		logger.info("sntdManualBackofficeCheck: inside file flow repair ");
		if(isPatternPresent(msgType, "pacs.008")){
			 var ibanPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN";
			 iban = getValueFromPath(Document, ibanPath);
			 logger.info("sntdManualBackofficeCheck: iban for PACS008 = " + iban);
		}
		if(isPatternPresent(msgType, "pacs.003")){
			 ibanPath = "/Document/FIToFICstmrDrctDbt/DrctDbtTxInf/DbtrAcct/Id/IBAN";
			 iban = getValueFromPath(Document, ibanPath);
			  logger.info("sntdManualBackofficeCheck: iban for PACS003 = " + iban);
		}
		
		if(isPatternPresent(msgType, "pacs.004")){
			 orgmsgnmidPath = "/Document/TxInf/OrgnlGrpInf/OrgnlMsgNmId";
			 orgmsgnmid = getValueFromPath(Document, orgmsgnmidPath);
			 
			if(isPatternPresent(orgmsgnmid, "pacs.008")){
				 ibanPath = "/Document/TxInf/OrgnlTxRef/DbtrAcct/Id/IBAN";
				 iban = getValueFromPath(Document, ibanPath);
				 logger.info("sntdManualBackofficeCheck: iban for PACS004 SCT = " + iban);
			}
			if(isPatternPresent(orgmsgnmid, "pacs.003")){
				 ibanPath = "/Document/TxInf/OrgnlTxRef/CdtrAcct/Id/IBAN";
				 iban = getValueFromPath(Document, ibanPath);
				 logger.info("sntdManualBackofficeCheck: iban for PACS004 SDD = " + iban);
			}
		}
		
		//skipped the SWIFT messages validationss
	}

	formatLabel = validateIntBookingBackoffdrvaccFromIban(exchange ,iban);
	logger.info("sntdManualBackofficeCheck: formatLabel" + formatLabel);
	
	if(!formatLabel && isPatternPresent(msgType, "pacs.004") && sourceChannelId == "PELICAN"){
		logger.info("sntdManualBackofficeCheck: ob pacs004 soft error");
		retVal = setCommentsForTransaction("00", "6939", map);
		return retVal; 
	}
		
	
	if(!formatLabel){
		logger.info("sntdManualBackofficeCheck: if formatLabel not derived");
		retVal = setCommentsForTransaction("00", "8990", map);
		return retVal; 
	}else
	{
		return 0;
	}
}

function sntdCompanyCodeValidations(exchange) {
	
	var dbtrIban;
	var cdtrIban;
	var dbtrIbanPath;
	var cdtrIbanPath;
	var intBranchCd;
	var extBranchCd;
	var backOffice;
	var backOffice1;
	var companyCode;
	var companyCode1;
	var retVal;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	logger.info("sntdCompanyCodeValidations");
	var orgBody = getHeader(map, "PLCN_originalMsgBody");
	logger.info("sntdCompanyCodeValidations: orgBody = "+ orgBody);
	inMsg.setBody(orgBody);

	var parser = new XMLParser();
	parser.parseXML(orgBody);
	retVal = 0;
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
  	body = inMsg.getBody(java.lang.String.class);
  	logger.info("sntdCompanyCodeValidations: body = " + body);
	var document1 = parser.parseXML(body);
	
	logger.info("in sntdCompanyCodeValidations ");
	dbtrIbanPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN";
	dbtrIban = getValueFromPath(document1, dbtrIbanPath);
	logger.info("sntdCompanyCodeValidations: dbtrIban = " + dbtrIban);
	
	cdtrIbanPath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/IBAN";
	cdtrIban = getValueFromPath(document1, cdtrIbanPath);
	logger.info("sntdCompanyCodeValidations: cdtrIban = " + cdtrIban);
	
	intBranchCd = dbtrIban.substr(4,5);
	logger.info("sntdCompanyCodeValidations: intBranchCd " +intBranchCd);
	extBranchCd = cdtrIban.substr(4,5);
	logger.info("sntdCompanyCodeValidations: extBranchCd " +extBranchCd);
	
	
	if(intBranchCd == 19810 && extBranchCd == 19810) {
		setHeader(map, "PLCN_internalBookingFlag", "N");
		backOffice = validateIntBookingBackoffdrvaccFromIban(exchange,dbtrIban);
		logger.info("sntdCompanyCodeValidations: backOffice " +backOffice);
		setHeader(map, "PLCN_internalBookingFlag", "Y");
		backOffice1 = validateIntBookingBackoffdrvaccFromIban(exchange,cdtrIban);
		logger.info("sntdCompanyCodeValidations: backOffice1 " +backOffice1);
		
		if(!backOffice || !backOffice1) {
			retVal = setCommentsForTransaction("00", "8990", map);
			return retVal; 
		} else{
			companyCode = getHeader(map, "PLCN_companyCode");
			logger.info("sntdCompanyCodeValidations: companyCode " +companyCode);
			companyCode1 = getHeader(map, "PLCN_companyCode1");
			logger.info("sntdCompanyCodeValidations: companyCode1 " +companyCode1);
			
			if(companyCode != companyCode1){
				retVal = setCommentsForTransaction("00", "8779", map);
				return retVal; 
			}
		}
		return retVal; 
	}else{
		return retVal; 
	}
}

function pcsPacs008Validation(exchange){

	var map;
	var manualMode;
	var channelIdSource;
	var retVal;
	var sourceChannelId;
	
	retVal = 0;
	logger.info("in pcsPacs008Validation");
	var inMsg = exchange.getIn();
	var	map = inMsg.getHeaders();
	//var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	sourceChannelId = getHeader(map, "PLCN_channelIdSource");
	logger.info("pcsPacs008Validation: sourceChannelId " +sourceChannelId);
	manualMode = getHeader(map, "PLCN_manualMode");
	logger.info("pcsPacs008Validation: manualMode " +manualMode);

	if(manualMode == "REPAIR" && sourceChannelId == "PELICAN") {
		logger.info("pcsPacs008Validation: in rule caling loop");
		retVal = pcsValidationRulePacs008(exchange);
		return retVal; 		
	}
	return retVal; 		
}

function pcsValidationRulePacs008(exchange){

	var formatLabel;
	var companyCode;
	var companyCode1;
	var retVal;
	var internalBookingFlag;
	var sddBank;
	var sddCustomer;
	var sntdCrf004Flag;
	var path;
	var iban;
	var retVal;
	
	retVal = 0;
	
	logger.info("In pcsValidationRulePacs008");
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	logger.info("sntdCompanyCodeValidations");
	var orgBody = getHeader(map, "PLCN_originalMsgBody");
	logger.info("sntdCompanyCodeValidations: orgBody = "+ orgBody);
	inMsg.setBody(orgBody);

	var parser = new XMLParser();
	parser.parseXML(orgBody);
	retVal = 0;
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
  	body = inMsg.getBody(java.lang.String.class);
  	logger.info("pcsValidationRulePacs008: body = " + body);
	var document1 = parser.parseXML(body);
	
	internalBookingFlag = getHeader(map, "PLCN_internalBookingFlag");
	logger.info("pcsValidationRulePacs008: internalBookingFlag " +internalBookingFlag);
	if(internalBookingFlag == "Y") {
		 return retVal; 
	}	

	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/IBAN";
	iban = getValueFromPath(document1, path);
	logger.info("pcsValidationRulePacs008: dbtrIban " +iban);
	
	formatLabel = validateIntBookingBackoffdrvaccFromIban(exchange,iban);
	
	sddBank = getHeader(map, "PLCN_sddBank");
	logger.info("pcsValidationRulePacs008: sddBank " +sddBank);
	sddCustomer = getHeader(map, "PLCN_sddCustomer");
	logger.info("pcsValidationRulePacs008: sddCustomer " +sddCustomer);
	sntdCrf004Flag = memTblGetTableValue(map,"FLAG-TABLE","SNTDCRF004");
	logger.info("pcsValidationRulePacs008: sntdCrf004Flag " +sntdCrf004Flag);

	if(sntdCrf004Flag == "N") {
		if(formatLabel == "F012") {
			retVal = setCommentsForTransaction("00", "8778", map);
			 return retVal; 
		}	
		else {
			return retVal; 
		}
	}
	
	if(formatLabel == "F011" || formatLabel == "F013" || formatLabel == "F014") {
		 return retVal; 
	}

	if((formatLabel == "F012") && ((sddBank == ""|| sddBank == " " || sddBank == "N") && (sddCustomer == ""|| sddCustomer == " " || sddCustomer == "N"))) {
		 return retVal; 
	}
	else {
		 retVal = setCommentsForTransaction("00", "8778", map);
		 return retVal; 	
	}
}


function validateIntBookingBackoffdrvaccFromIban(exchange, iban) {
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
	var key;
	
 	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class); 
	key = ":SYSTEM-ID|:ACCOUNT|:COMPANYCODE|:SAPACCOUNT|:ACCOUNTTYPE|:RECEIPIENT|:STATUS|:SDDCUSTOMER|:SDDBANK";
	
	 flag = "f";
	 fld = "73";
	 secLvl = "security=high";
	 runEnv = "backoffsys-run";
	 baseIban = "iban " + iban;
	 
	 internalBookingFlag = getHeader(map, "PLCN_internalBookingFlag");
	 logger.info("validateIntBookingBackoffdrvaccFromIban: internalBookingFlag = " + internalBookingFlag);
	 

	logger.info("Inside validateIntBookingBackoffdrvaccFromIban:Before parseFieldJs");
	parseFieldJs(Document, map,fld,baseIban, secLvl, runEnv,key);
	parseRequest = getHeader(map, "PLCN_ParseRequest");
	logger.info("validateIntBookingBackoffdrvaccFromIban: parseRequest = " + parseRequest);
	var hdrMap = inMsg.getHeaders();

	var executeRoute = new ExecuteCamelRoute();
	executeRoute.callRouteWithHeader('direct://ParseAccMaster', parseRequest, new HashMap());
	var outHdrMap = executeRoute.getOutputHeader();
	var outmsg = executeRoute.getOutputBody(java.util.List.class);

	var body = executeRoute.getOutputBody(org.w3c.dom.Document.class);
	var messageBody = convertDocumentToString(body);
	logger.info("validateIntBookingBackoffdrvaccFromIban: messageBody type = "+typeof messageBody);
	logger.info("validateIntBookingBackoffdrvaccFromIban: Output messageBody = " + messageBody );
	logger.info("validateIntBookingBackoffdrvaccFromIban: response = "+ outmsg);

	var orgBody = getHeader(map, "PLCN_originalMsgBody");
	logger.info("validateIntBookingBackoffdrvaccFromIban: orgBody = "+ orgBody);
	inMsg.setBody(orgBody);

	var parser = new XMLParser();
	parser.parseXML(orgBody);

	if(messageBody){
		var responseBody = dataBetweenTokens("<Value>" , "</Value>" , messageBody); 
		logger.info("validateIntBookingBackoffdrvaccFromIban: response Value = "+ responseBody);
		responseBody = "|".concat(responseBody); 
		responseBody = responseBody.concat("|"); 
		logger.info("validateIntBookingBackoffdrvaccFromIban: response Value = "+ responseBody);
	}
	temp = responseBody;

	value = dataBetweenTokens("|", "|", temp);
	value = value.trim();
	formatLabel= value;
	setHeader(map, "PLCN_formatLabel1", value);
	logger.info("validateIntBookingBackoffdrvaccFromIban: PLCN_formatLabel1 = " + value);
	temp = removePattern(temp, "|" + value);

	value = dataBetweenTokens("|", "|", temp); //WIP
	value = value.trim();
	//setHeader(map, "PLCN_account", value);
	account = value;
	logger.info("validateIntBookingBackoffdrvaccFromIban: PLCN_account = " + value);
	temp = removePattern(temp, "|" + value);

	value = dataBetweenTokens("|", "|", temp); //Y, N, YES, No
	value = value.trim();
	setHeader(map, "PLCN_companycode1", value);
	companycode = value; 
	logger.info("validateIntBookingBackoffdrvaccFromIban: PLCN_companycode1 = " + value);
	temp = removePattern(temp, "|" + value);
	
	value = dataBetweenTokens("|", "|", temp);
	value = value.trim();
	setHeader(map, "PLCN_sapaccount", value);
	sapaccount = value;
	logger.info("validateIntBookingBackoffdrvaccFromIban: PLCN_sapaccount = " + value);
	temp = removePattern(temp, "|" + value);

	value = dataBetweenTokens("|", "|", temp);
	value = value.trim();
	setHeader(map, "PLCN_accounttype", value);
	accounttype = value;
	logger.info("validateIntBookingBackoffdrvaccFromIban: PLCN_accounttype = " + value);
	temp = removePattern(temp, "|" + value);

	value = dataBetweenTokens("|", "|", temp);
	value = value.trim();
	receipient = value;
	logger.info("validateIntBookingBackoffdrvaccFromIban: PLCN_receipient = " + value);
	temp = removePattern(temp, "|" + value);
	
	value = dataBetweenTokens("|", "|", temp);
	value = value.trim();
	logger.info("validateIntBookingBackoffdrvaccFromIban: PLCN_status = " + value);
	temp = removePattern(temp, "|" + value);
	
	value = dataBetweenTokens("|", "|", temp);
	value = value.trim();
	setHeader(map, "PLCN_sddcustomer", value);
	sddcustomer = value;
	logger.info("validateIntBookingBackoffdrvaccFromIban: PLCN_sddcustomer = " + value);
	temp = removePattern(temp, "|" + value);

	value = dataBetweenTokens("|", "|", temp);
	value = value.trim();
	setHeader(map, "PLCN_sddbank", value);
	sddbank = value;
	logger.info("validateIntBookingBackoffdrvaccFromIban: PLCN_sddbank = " + value);
	temp = removePattern(temp, "|" + value);
	logger.info("validateIntBookingBackoffdrvaccFromIban: before internalBookingFlag loop ");
	if(internalBookingFlag != "Y"){
		logger.info("validateIntBookingBackoffdrvaccFromIban: internalBookingFlag N loop ");
		setHeader(map, "PLCN_formatLabel", formatLabel);
		setHeader(map, "PLCN_companycode", companycode);
		setHeader(map, "PLCN_formatLabel1", "");
		setHeader(map, "PLCN_companycode1", "");	
	}
	return formatLabel;
	
}

function parseFieldJs(Document, map,fld,parseString, secLvl, runEnv,key) {
	var institutionId;
	var encodedMessage ;
	var messageReference;

/* 	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
 */
	logger.info("In parseFieldJs");

	var helper = new JSHelperClass();
	var msgstr = convertDocumentToString(Document);

	messageType = getHeader(map, "PLCN_msgType");
	logger.info("parseFieldJs: messageType: " + messageType);

	messageReference = getHeader(map, "PLCN_messageNo");
	logger.info("parseFieldJs: messageReference: " + messageReference);

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

function orgnlBodyRoute(exchange){

 	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	var orgBody = getHeader(map, "PLCN_originalMsgBody");
	logger.info("orgnlBodyRoute: orgBody = "+ orgBody);
	inMsg.setBody(orgBody);
	
	var parser = new XMLParser();
	parser.parseXML(orgBody);
}

function pcsValidationRulePacs004(exchange){

	var formatLabel;
	var retVal;
	var sddBank;
	var sddCustomer;
	var orgMsgNmIdPath;
	var orgMsgNmId;
	var sourceChannelId;
	var sntdCrf004Flag;
	
	retVal = 0;
	
	logger.info("In pcsValidationRulePacs004");

	var inMsg = exchange.getIn();
	var	map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	sntdCrf004Flag = memTblGetTableValue(map,"FLAG-TABLE","SNTDCRF004");
	//sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	sourceChannelId = getHeader(map, "PLCN_channelIdSource");
	logger.info("pcsValidationRulePacs004: sourceChannelId = " + sourceChannelId);
	

	logger.info("pcsValidationRulePacs004:sntdCrf004Flag = " + sntdCrf004Flag);
	if(sntdCrf004Flag == "N") {
		return retVal; 
	}

	if(sourceChannelId != "PELICAN") {
			return retVal; 		
	}
	
	orgMsgNmIdPath = "/Document/TxInf/OrgnlGrpInf/OrgnlMsgNmId";
	orgMsgNmId = getValueFromPath(Document, orgMsgNmIdPath);
	logger.info("In pcsValidationRulePacs004 = orgMsgNmId" + orgMsgNmId);
		
	if(isPatternPresent(orgMsgNmId, "pacs.003")) {
		logger.info("In pcsValidationRulePacs004 = if loop of pacs003");
		return retVal; 
	}

	formatLabel = getHeader(map, "PLCN_formatLabel");
	logger.info("pcsValidationRulePacs004: formatLabel " +formatLabel);
	sddBank = getHeader(map, "PLCN_sddBank");
	logger.info("pcsValidationRulePacs004: sddBank " +sddBank);
	sddCustomer = getHeader(map, "PLCN_sddCustomer");
	logger.info("pcsValidationRulePacs004: sddCustomer " +sddCustomer);

	if(formatLabel == "F011" || formatLabel == "F013" || formatLabel == "F014") {
		 return retVal; 
	}

	if((formatLabel == "F012") && ((sddBank == ""|| sddBank == " " || sddBank == "N") && (sddCustomer == ""|| sddCustomer == " " || sddCustomer == "N"))) {
		 return retVal; 
	}
	else {
		 retVal = setCommentsForTransaction("00", "8778", map);
		 return retVal; 	
	}

}

function originalMsgNameIdRulePacs004(Document, map) {
	
	var originalMsgNameIdPath;
	var originalMsgNameId;
	
	var retVal = 0;
	logger.info("In originalMsgNameIdRulePacs004");
	
	originalMsgNameIdPath = '/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgNmId';
	originalMsgNameId = getValueFromPath(Document, originalMsgNameIdPath);
	if(!originalMsgNameId) {
		originalMsgNameIdPath = '/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgNmId';
		originalMsgNameId = getValueFromPath(Document, originalMsgNameIdPath);
	}
	logger.info("originalMsgNameIdRulePacs004: originalMsgNameId = " + originalMsgNameId );
	logger.info("originalMsgNameIdRulePacs004: type of originalMsgNameId = " + typeof originalMsgNameId );

	var Date1 = memTblGetTableValue(map, "USER_CONFIG_MAP", "SEPA_LIB2025_DATE");
	logger.info("originalMsgNameIdRulePacs004: Date1 = " + Date1);

	var sysDate = getDate();
	logger.info("originalMsgNameIdRulePacs004: sysDate = " + sysDate);
	
	if(sysDate){
		if(sysDate < Date1){
			const values = ["pacs.008.001.08","pacs.003.001.08", "pacs.008.001.02"];

			if(originalMsgNameId) {
				if(values.includes(originalMsgNameId)){
					logger.info("originalMsgNameIdRulePacs004: originalMsgNameId value is 'pacs.008.001.08' or 'pacs.003.001.08'");
				}else {
					setHeader(map, "PLCN_validMessage",false);
					logger.info("originalMsgNameIdRulePacs004: originalMsgNameId value is other than 'pacs.008.001.08' or 'pacs.003.001.08'");
					retVal = setCommentsForTransaction("109", "7137", map);	//NEW violations to be defined..
					//return retVal;			
				}
			}
		}else{
			const values = ["pacs.008","pacs.003"];

			if(originalMsgNameId) {
				originalMsgNameId = originalMsgNameId.slice(0, 8);
				logger.info("originalMsgNameIdRulePacs004: originalMsgNameId after trim = " + originalMsgNameId );

				if(values.includes(originalMsgNameId)){
					logger.info("originalMsgNameIdRulePacs004: originalMsgNameId value is begin with 'pacs.008' or 'pacs.003'");
				}else {
					setHeader(map, "PLCN_validMessage",false);
					logger.info("originalMsgNameIdRulePacs004: originalMsgNameId value is must begin with 'pacs.008' or 'pacs.003'");
					retVal = setCommentsForTransaction("169", "7636", map);	//NEW violations to be defined..
					//return retVal;			
				}
			}
		}
	}
	return retVal;
}

function hybridAddressRuleSepaPacs8(exchange){ 
	logger.info("hybridAddressRuleSepaPacs8");

	var retVal = 0;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var Document1 = inMsg.getBody(java.lang.String.class);
	
	var Date1 = memTblGetTableValue(map, "USER_CONFIG_MAP", "SEPA_LIB2025_DATE");
	logger.info("hybridAddressRuleSepaPacs8: Date1 = " + Date1);

	var sysDate = getDate();
	logger.info("hybridAddressRuleSepaPacs8: sysDate = " + sysDate);

	if(sysDate >= Date1){
		logger.info("hybridAddressRuleSepaPacs8: hybridAddressRuleSepaPacs8 will be applied");
		//CREDITOR
		var cdtrPstlAdr =  isXmlNodePresent(Document, "CdtTrfTxInf", "Cdtr", "<PstlAdr>");

		var cdtrAddrLinePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/AdrLine';
		var cdtrAddrLine = getValueFromPath(Document, cdtrAddrLinePath);

		var cdtrTwnNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/TwnNm';
		var cdtrTwnNm = getValueFromPath(Document, cdtrTwnNmPath);

		var cdtrCtryPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/Ctry';
		var cdtrCtry = getValueFromPath(Document, cdtrCtryPath);
		
        var cdtrDeptPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/Dept';
        var cdtrDept = getValueFromPath(Document, cdtrDeptPath);

        var cdtrSubDeptPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/SubDept';
        var cdtrSubDept = getValueFromPath(Document, cdtrSubDeptPath);

        var cdtrStrtNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/StrtNm';
        var cdtrStrtNm = getValueFromPath(Document, cdtrStrtNmPath);

        var cdtrBldgNbPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/BldgNb';
        var cdtrBldgNb = getValueFromPath(Document, cdtrBldgNbPath);

        var cdtrBldgNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/BldgNm';
        var cdtrBldgNm = getValueFromPath(Document, cdtrBldgNmPath);

        var cdtrFlrPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/Flr';
        var cdtrFlr = getValueFromPath(Document, cdtrFlrPath);

        var cdtrPstBxPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/PstBx';
        var cdtrPstBx = getValueFromPath(Document, cdtrPstBxPath);

        var cdtrRoomPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/Room';
        var cdtrRoom = getValueFromPath(Document, cdtrRoomPath);

        var cdtrPstCdPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/PstCd';
        var cdtrPstCd = getValueFromPath(Document, cdtrPstCdPath);

        var cdtrTwnLctnNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/TwnLctnNm';
        var cdtrTwnLctnNm = getValueFromPath(Document, cdtrTwnLctnNmPath);

        var cdtrDstrctNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/DstrctNm';
        var cdtrDstrctNm = getValueFromPath(Document, cdtrDstrctNmPath);

        var cdtrCtrySubDvsnPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/CtrySubDvsn';
        var cdtrCtrySubDvsn = getValueFromPath(Document, cdtrCtrySubDvsnPath);
        
		if(isPatternPresent(Document1, "<Cdtr>")){
			if(cdtrPstlAdr){
                if(cdtrAddrLine && (cdtrTwnNm||cdtrCtry||cdtrDept||cdtrSubDept||cdtrStrtNm||cdtrBldgNb||cdtrBldgNm||cdtrFlr||cdtrPstBx||cdtrRoom||cdtrPstCd||cdtrTwnLctnNm ||cdtrDstrctNm||cdtrCtrySubDvsn)){
					var count = countXmlNodes(Document, "Cdtr", "AdrLine");
					logger.info("hybridAddressRuleSepaPacs8: Cdtr AdrLine count = " + count);
                    if(!cdtrTwnNm || !cdtrCtry || count > 2){
                        setHeader(map, "PLCN_validMessage", false);
                        logger.info("hybridAddressRuleSepaPacs8: Cdtr-If PstlAddr is used & if Adrline is present then then Country and Town name must be present");
                        retVal = setCommentsForTransaction("945", "7528", map);
                        return retVal;
                    }
                }
			}
		}
		
		//DEBTOR
		var dbtrPstlAdr =  isXmlNodePresent(Document, "CdtTrfTxInf", "Dbtr", "<PstlAdr>");

		var dbtrAddrLinePath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/AdrLine';
		var dbtrAddrLine = getValueFromPath(Document, dbtrAddrLinePath);

		var dbtrTwnNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/TwnNm';
		var dbtrTwnNm = getValueFromPath(Document, dbtrTwnNmPath);

		var dbtrCtryPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/Ctry';
		var dbtrCtry = getValueFromPath(Document, dbtrCtryPath);
        
        var dbtrDeptPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/Dept';
        var dbtrDept = getValueFromPath(Document, dbtrDeptPath);

        var dbtrSubDeptPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/SubDept';
        var dbtrSubDept = getValueFromPath(Document, dbtrSubDeptPath);

        var dbtrStrtNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/StrtNm';
        var dbtrStrNm = getValueFromPath(Document, dbtrStrtNmPath);

        var dbtrBldgNbPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/BldgNb';
        var dbtrBldgNb = getValueFromPath(Document, dbtrBldgNbPath);

        var dbtrBldgNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/BldgNm';
        var dbtrBldgNm = getValueFromPath(Document, dbtrBldgNmPath);

        var dbtrFlrPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/Flr';
        var dbtrFlr = getValueFromPath(Document, dbtrFlrPath);

        var dbtrPstBxPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/PstBx';
        var dbtrPstBx = getValueFromPath(Document, dbtrPstBxPath);

        var dbtrRoomPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/Room';
        var dbtrRoom = getValueFromPath(Document, dbtrRoomPath);

        var dbtrPstCdPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/PstCd';
        var dbtrPstCd = getValueFromPath(Document, dbtrPstCdPath);

        var dbtrTwnLctnNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/TwnLctnNm';
        var dbtrTwnLctnNm = getValueFromPath(Document, dbtrTwnLctnNmPath);

        var dbtrDstrctNmPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/DstrctNm';
        var dbtrDstrctNm = getValueFromPath(Document, dbtrDstrctNmPath);

        var dbtrCtrySubDvsnPath = '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/CtrySubDvsn';
        var dbtrCtrySubDvsn = getValueFromPath(Document, dbtrCtrySubDvsnPath);

		if(isPatternPresent(Document1, "<Dbtr>")){
			if(dbtrPstlAdr){
				if(dbtrAddrLine && (dbtrTwnNm||dbtrCtry||dbtrDept||dbtrSubDept||dbtrStrNm||dbtrBldgNb||dbtrBldgNm||dbtrFlr||dbtrPstBx||dbtrRoom||dbtrPstCd||dbtrTwnLctnNm ||dbtrDstrctNm||dbtrCtrySubDvsn)){
					var count = countXmlNodes(Document, "Dbtr", "AdrLine");
					logger.info("hybridAddressRuleSepaPacs8: Dbtr AdrLine count = " + count);
					if(!dbtrTwnNm || !dbtrCtry || count > 2){
						setHeader(map, "PLCN_validMessage", false);
						logger.info("hybridAddressRuleSepaPacs8: Dbtr-If PstlAddr is used & if Adrline is present then then Country and Town name must be present");
						retVal = setCommentsForTransaction("779", "7528", map);
						return retVal;
					}
				}
			}
		}
	}

	return retVal;
}

function wrapperSepaPacs002Mx(exchange) {
	var retVal;
	var commentsB2b;
	var pacs02ValdFlagMx;
	var txnComments;
	var inMsg;
	var map;
	var Document;
	var tenantName;
	var tenantNamePath;
	var manualMode;

	logger.info('In wrapperSepaPacs002Mx');
	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	
	pacs02ValdFlagMx = memTblGetTableValue(map, "FLAG-TABLE", "PACS02_VALD_FLAG_MX");
	pacs02ValdFlagMx = pacs02ValdFlagMx.trim();
	logger.info("pacs02ValdFlagMx = " + pacs02ValdFlagMx);
	var institutionId = getHeader(map, "PLCN_institutionId");
	tenantName = getHeader(map, "PLCN_tenantName");
	logger.info("wrapperSepaPacs002Mx: tenantName = " + tenantName);
	if(!tenantName){
		var tenantNamePath = institutionId + ".INSTITUTION_DETAILS.TENANT_NAME";
		logger.info("wrapperSepaPacs002Mx: tenantName = " + tenantNamePath);
		tenantName = memTblGetTableValue(map, "INST_PARAM",tenantNamePath);
		logger.info("wrapperSepaPacs002Mx: tenantName = " + tenantName);
	}
	manualMode = getHeader(map, "PLCN_manualMode");
	logger.info("wrapperSepaPacs002Mx: manualMode " +manualMode);

	if(pacs02ValdFlagMx == 'ERROR') {

		logger.info("wrapperSepaPacs002Mx: Calling sepaValidationRulesPacs002");
		retVal = sepaValidationRulesPacs002(pacs02ValdFlagMx, exchange);
		logger.info("wrapperSepaPacs002Mx: retVal from sepaValidationRulesPacs002 = " + retVal);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs002Mx: txnComments = " + txnComments);
		
	}

	if(pacs02ValdFlagMx == 'WARNING') {

		logger.info("wrapperSepaPacs003Mx: Calling sepaValidationRulesPacs002");
		retVal = sepaValidationRulesPacs002(pacs02ValdFlagMx, exchange);
		logger.info("wrapperSepaPacs003Mx: retVal from sepaValidationRulesPacs002 = " + retVal);
		txnComments = getHeader(map, "PLCN_txnComments");
		logger.info("wrapperSepaPacs003Mx: txnComments = " + txnComments);
		
	}
}

function sepaValidationRulesPacs002(pacs02ValdFlagMx, exchange) {
	logger.info("sepaValidationRulesPacs002");
	var retVal;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	retVal = 0;

	if(pacs02ValdFlagMx == "ERROR") {
		retVal = originalMsgNameIdRulePacs002(Document, map);
		if(retVal != 0) {
			return retVal;
		}
	}
	
	if(pacs02ValdFlagMx == "WARNING") {
		
		retVal = originalMsgNameIdRulePacs002(Document, map);
		
	}
	return retVal;
}

function originalMsgNameIdRulePacs002(Document, map) {
	var originalMsgNameIdPath;
	var originalMsgNameId;
	
	var retVal = 0;
	logger.info("In originalMsgNameIdRulePacs002");
	
	originalMsgNameIdPath = '/Document/FIToFIPmtStsRpt/OrgnlGrpInfAndSts/OrgnlMsgNmId';
	originalMsgNameId = getValueFromPath(Document, originalMsgNameIdPath);
	if(!originalMsgNameId) {
		originalMsgNameIdPath = '/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlGrpInfAndSts/OrgnlMsgNmId';
		originalMsgNameId = getValueFromPath(Document, originalMsgNameIdPath);
	}
	logger.info("originalMsgNameIdRulePacs002: originalMsgNameId = " + originalMsgNameId );
	logger.info("originalMsgNameIdRulePacs002: type of originalMsgNameId = " + typeof originalMsgNameId );
	
	const values = ["pacs.008","pacs.003"];

	if(originalMsgNameId) {
		originalMsgNameId = originalMsgNameId.slice(0, 8);
		logger.info("originalMsgNameIdRulePacs002: originalMsgNameId after trim = " + originalMsgNameId );

		if(values.includes(originalMsgNameId)){
			logger.info("originalMsgNameIdRulePacs002: originalMsgNameId value is begin with 'pacs.003' or 'pacs.008'");
		}else {
			setHeader(map, "PLCN_validMessage",false);
			logger.info("originalMsgNameIdRulePacs002: originalMsgNameId value is must begin with 'pacs.008' or 'pacs.003'");
			retVal = setCommentsForTransaction("127", "7636", map);	//NEW violations to be defined..
			//return retVal;			
		}
	}
	return retVal;
}

