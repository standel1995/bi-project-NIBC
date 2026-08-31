function schedulingCheck(exchange) {
	var inMsg;
	var map;
	var Document;
	var retVal;
	var body;
	var schFlag;
	var msgDirection;
	var schCheck;
	var clearingId;
	var clrgIdOffsetDay;
	var currency;
	var priorityDate;
	var clrgIdOffsetDayNumber;

	logger.info("In schedulingCheck");
	inMsg = exchange.getIn();
	map = inMsg.getHeaders();
	Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	body = inMsg.getBody(java.lang.String.class);

	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("schedulingCheck: institutionId = " + institutionId);

	msgDirection = getHeader(map, "PLCN_msgDirection");
    logger.info("schedulingCheck: msgDirection = " + msgDirection);

    currency = getHeader(map, "PLCN_currency");
    logger.info("schedulingCheck: currency = " + currency);

    priorityDate = getHeader(map, "PLCN_valueDate");
    logger.info("schedulingCheck: priorityDate = " + priorityDate);

    if(msgDirection == "O") {
    	setSchedulingHeader(exchange);
		return; 
    }

    PLCN_prevQueueId = getHeader(map, "PLCN_prevQueueId");
    logger.info("schedulingCheck: PLCN_prevQueueId = " + PLCN_prevQueueId);

    if(PLCN_prevQueueId == "MXHOLDQ") {

    	setHeader(map, "PLCN_custom24", null);
    	setHeader(map, "PLCN_schedulingReq", false);
    	setSchedulingHeader(exchange);

    	return;	
    }

	//setHeader(map,"PLCN_schedulingReq", false);
	//retVal = applyScheduleRouteMx(exchange);
	//new development for scheduling check based on product code is required
	var preWrhsPath = institutionId.concat(".PROCESSING_STAGES.PRE_WAREHOUSE.PRODUCTS");
	logger.info("schedulingCheck: preWrhsPath = " + preWrhsPath);
	var preWrhsCode = memTblGetTableValue(map, "INST_PARAM", preWrhsPath);
	logger.info("schedulingCheck: preWrhsCode = " + preWrhsCode);

	var productCode = getHeader(map, "PLCN_productCode");
	logger.info("schedulingCheck: productCode = " + productCode);

	if(isPatternPresent(preWrhsCode, productCode)) {
		schCheck = true;
	}else {
		schCheck = false;
	}

	//schCheck = true; //scheduling turned off
	logger.info("schedulingCheck: schCheck from applyScheduleRouteMx = " + schCheck);

	if(schCheck == true) {
		mainSchduleRouteMx(exchange);
	}
		
	setSchedulingHeader(exchange);
	
	logger.info("schedulingCheck: PLCN_custom24 = " + getHeader(map, "PLCN_custom24"));
}

function setSchedulingHeader(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	var schFlag = getHeader(map, "PLCN_schedulingReq");
	logger.info("setSchedulingHeader: schFlag = " + schFlag);
	logger.info("setSchedulingHeader: typeof schFlag = " + typeof schFlag);
	schFlag = schFlag.toString();
	logger.info("setSchedulingHeader: typeof schFlag after toString = " + typeof schFlag);

	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("setSchedulingHeader: institutionId = " + institutionId);

	var repairReq = getHeader(map, "PLCN_repairReq");
	logger.info("setSchedulingHeader: repairReq = " + repairReq);
	logger.info("setSchedulingHeader: typeof repairReq = " + typeof repairReq);

	var comments = getHeader(map, "PLCN_txnComments");
	logger.info("setSchedulingHeader: comments = " + comments);

	if(isPatternPresent(comments, "00-9506") && isPatternPresent(comments, "00-6013")) {

		if(repairReq == "true") {
			logger.info("setSchedulingHeader: deleting :A00:00-6013 from comments");
			comments = removePattern(comments, ":A00:00-6013");
		}else {
			logger.info("setSchedulingHeader: deleting :A00:00-6013 from comments");
			comments = removePattern(comments, ":A00:00-9506");
		}

		logger.info("setSchedulingHeader: comments = " + comments);
		setHeader(map, "PLCN_txnComments", comments);
	}

	/*if(isPatternPresent(comments, "00-9500") && !isPatternPresent(comments, "00-6012")) {
		logger.info("setSchedulingHeader: deleting :A00:00-6012 from comments");
		comments = removePattern(comments, ":A00:00-9500");
		logger.info("setSchedulingHeader: comments = " + comments);
		setHeader(map, "PLCN_txnComments", comments);
	}*/

    var mode = 	getHeader(map, "PLCN_mode");
   	logger.info("setSchedulingHeader: mode = " + mode);

   	var autoRepairFlag = memTblGetTableValue(map, "USER_CONFIG_MAP", "AUTOREPAIR_VALUEDATE_"+mode);
   	logger.info("setSchedulingHeader: autoRepairFlag = " + autoRepairFlag);

	if(autoRepairFlag == "YES" && repairReq == "true") {
		repairReq = 'false';
		setHeader(map, "PLCN_repairReq", repairReq);
		setHeader(map, "PLCN_setNewPriorityDate", "true");

		var setNewDate = getHeader(map, "PLCN_setNewDate");
   		logger.info("setSchedulingHeader: setNewDate = " + setNewDate);

		if(schFlag != "true" || setNewDate == true) {
			logger.info("setSchedulingHeader: calling setNewIntrBkSttlmDt for auto repair");
			setNewIntrBkSttlmDt(exchange);
		}
	}


	if(repairReq == "true") {
		setHeader(map, "PLCN_queue", "MXREPRQ");
		authLevelKey = institutionId + "."+ "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL.STAGES.REPAIR" + "." + "STAGE_ACCESS_CONTROL";
    	logger.info("setSchedulingHeader: authLevelKey = " + authLevelKey);

    	var authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
	    logger.info("setSchedulingHeader: authLevelValue = " + authLevelValue);

	    if(!authLevelValue) {
	        authLevelKey = institutionId + "."+ institutionId + "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL" + "." + "INSTITUTION_ACCESS_CONTROL";
	        logger.info("setSchedulingHeader: authLevelKey = " + authLevelKey);

	        authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
	        logger.info("setSchedulingHeader: authLevelValue = " + authLevelValue);      
	    }

	    setHeader(map, "PLCN_displayFlag", "Y");
		setHeader(map, "PLCN_processingStage", "REPR");
		setHeader(map, "PLCN_currentAuthLevel", "REPR=" + textToNum(authLevelValue));
		setHeader(map, "PLCN_MXREPRQ", true);

		return;
	}

    var authLevelKey = institutionId + "." + "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL.STAGES.WAREHOUSE" + "." + "STAGE_ACCESS_CONTROL";
    logger.info("setSchedulingHeader: authLevelKey = " + authLevelKey);

    var authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
    logger.info("setSchedulingHeader: authLevelValue = " + authLevelValue);

    if(!authLevelValue) {
        authLevelKey = institutionId + "." + "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL" + "." + "INSTITUTION_ACCESS_CONTROL";
        logger.info("setSchedulingHeader: authLevelKey = " + authLevelKey);

        authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
        logger.info("setSchedulingHeader: authLevelValue = " + authLevelValue);      
    }

    authLevelValue = "WRHS=" + textToNum(authLevelValue);
    logger.info("setSchedulingHeader: authLevelValue = " + authLevelValue);

	var schFlag = getHeader(map, "PLCN_schedulingReq");
	logger.info("setSchedulingHeader: schFlag = " + schFlag);
	logger.info("setSchedulingHeader: typeof schFlag = " + typeof schFlag);

	schFlag = schFlag.toString();
	logger.info("setSchedulingHeader: typeof schFlag after toString = " + typeof schFlag);	

	if(schFlag == "true") {
		var releaseDateMsg = getHeader(map, "PLCN_releaseDateMsg");
		setNewIntrBkSttlmDt(exchange);
		setHeader(map, "status", "scheduling required");
		setHeader(map, "PLCN_displayFlag", "Y");
		setHeader(map, "PLCN_processingStage", "WRHS");
		setHeader(map, "PLCN_currentAuthLevel", authLevelValue);
		setHeader(map, "PLCN_queue", "MXHOLDQ");
		setHeader(map, "PLCN_validFlag", "false");
		setHeader(map,"PLCN_schedulingReq", true);
	}else {
		setHeader(map, "status", "no scheduling required");
		setHeader(map, "PLCN_queue", "TMPMSGQ");
		setHeader(map, "PLCN_validFlag", "true");
		setHeader(map,"PLCN_schedulingReq", false);
		setHeader(map, "PLCN_custom24", "");
	}

	logger.info("setSchedulingHeader: status = " + getHeader(map, "status"));		
}

function applyScheduleRouteMx(exchange) {
	var institutionId;
	var schduleComponent;
	var comments;
	var valueDate;
	var todaysDate;
	var queueId;
	var productCode;
	var authPath;
	var authCode;
	var direction;
	var preWrhsPath;
	var preWrhsCode;
	var serviceConfigured;
	var preWarehouseServiceValue;
	var authorizationServiceValue;
	var chkRelPath;
	var chkRelCode;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	logger.info("In applyScheduleRouteMx");

	//drveNibcProductCode(exchange);

	var fmtMsgDate = "N";

	queueId = getHeader(map, "PLCN_queueId");
	logger.info("applyScheduleRouteMx: queueId = " + queueId);

	institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("applyScheduleRouteMx: institutionId = " + institutionId);

	comments = getHeader(map, "PLCN_txnComments");
	logger.info("applyScheduleRouteMx: comments = " + comments);

	valueDate = getHeader(map, "PLCN_valueDate");
	logger.info("applyScheduleRouteMx: valueDate = " + valueDate);

	todaysDate = getDate();
	logger.info("applyScheduleRouteMx: todaysDate = " + todaysDate);

	//(GETVALUEFROMHEADER GV_MSG_INPATH "MESSAGE_DETAILS" "MANUAL_MODE")
	if((getHeader(map, "PLCN_manualMode") == "repair") && (valueDate < todaysDate)) {
		logger.info("applyScheduleRouteMx: past valueDate");	
		commentsForBlob6 = setCommentsForTransaction("00", "8958", map);
	}

	direction = getHeader(map, "PLCN_msgDirection");

	if(direction == "I" && !(isPatternPresent(getHeader(map, "PLCN_txnComments"), "6013"))) {
		sendToReprNibc(exchange);
	}

	schduleComponent = institutionId.concat(".MESSAGE_PROCESSING.FUNCTIONALITY.SCHDULE_COMPONENT.APPLY_COMPONENT");
	logger.info("applyScheduleRouteMx: schduleComponent before memTblGetTableValue = " + schduleComponent);
	schduleComponent = memTblGetTableValue(map, "INST_PARAM", schduleComponent);
	logger.info("applyScheduleRouteMx: schduleComponent = " + schduleComponent);

	authPath = institutionId.concat(".PROCESSING_STAGES.AUTHORIZE.PRODUCTS");
	logger.info("applyScheduleRouteMx: authPath = " + authPath);
	authCode = memTblGetTableValue(map, "INST_PARAM", authPath);
	logger.info("applyScheduleRouteMx: authCode = " + authCode);
	
	preWrhsPath = institutionId.concat(".PROCESSING_STAGES.PRE_WAREHOUSE.PRODUCTS");
	logger.info("applyScheduleRouteMx: preWrhsPath = " + preWrhsPath);
	preWrhsCode = memTblGetTableValue(map, "INST_PARAM", preWrhsPath);
	logger.info("applyScheduleRouteMx: preWrhsCode = " + preWrhsCode);

	productCode = getHeader(map, "PLCN_productCode");
	logger.info("applyScheduleRouteMx: productCode = " + productCode);

	if(isPatternPresent(preWrhsCode, productCode)) {
		preWarehouseServiceValue = "Y";
		logger.info("applyScheduleRouteMx: preWarehouseServiceValue = " + preWarehouseServiceValue);
	}else {
		preWarehouseServiceValue = "N";
		logger.info("applyScheduleRouteMx: preWarehouseServiceValue = " + preWarehouseServiceValue);
	}

	if(isPatternPresent(authCode, productCode)) {
		authorizationServiceValue = "Y";
		logger.info("applyScheduleRouteMx: authorizationServiceValue = " + authorizationServiceValue);
	}else {
		authorizationServiceValue = "N";
		logger.info("applyScheduleRouteMx: authorizationServiceValue = " + authorizationServiceValue);
	}

	setHeader(map, "PLCN_preWarehouseServiceValue", preWarehouseServiceValue);
	setHeader(map, "PLCN_authorizationServiceValue", authorizationServiceValue);

	direction = getHeader(map, "PLCN_msgDirection"); 
	logger.info("applyScheduleRouteMx: direction = " + direction);

	if(getHeader(map, "PLCN_callFinalOutput") == "Y") {
		return false;
	}

	logger.info("applyScheduleRouteMx: comments = " + comments);

	if(queueId == "MXDUPLQ") {
		return false;
	}

	if(isPatternPresent(comments, "8053") || isPatternPresent(comments, "8894")) {
		return false;
	}

	if(isPatternPresent(comments, "6800")) {
		return false;
	}

	if(isPatternPresent(comments, "6011") || isPatternPresent(comments, "6012") || isPatternPresent(comments, "6013")) {
		chkRelPath = institutionId.concat(".PROCESSING_STAGES.CHECK_AND_RELEASE.PRODUCTS");
		chkRelPath = memTblGetTableValue(map, "INST_PARAM", preWrhsPath);

		authCode = memTblGetTableValue(map, "INST_PARAM", authCode);

		if(((chkRelCode) && isPatternPresent(chkRelCode, productCode) && isPatternPresent(comments, "7782")) || ((CHK_AUTH_CODE) && isPatternPresent(authCode, productCode) && isPatternPresent(comments , "7781") && !isPatternPresent(chkRelCode, productCode)) || (!isPatternPresent(chkRelCode , productCode) && !isPatternPresent(authCode, productCode))) {
			return true;
		}else {
			return false;
		}
	}else {

		if(schduleComponent == "Y") {

			if((authorizationServiceValue == "Y") && isPatternPresent(comments, "7781") && (preWarehouseServiceValue == "Y")) {
				return true;
			} 

			if((authorizationServiceValue == "Y") && (preWarehouseServiceValue == "Y")) {
				return true;
			}else {

				if((authorizationServiceValue == "N") && (preWarehouseServiceValue == "Y")) {
					return true;
				}else {
					return false;
				}
			}

		}else {
			return false;
		}  
	}
}

function sendToReprNibc(exchange) {
	var valueDate;
	var todaysDate;
	var stage;
	var tError;
	var mode;
	var sourceChnlId;
	var reprProductCode;
	var pattern;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	logger.info("In sendToReprNibc");

	tError = getHeader(map, "PLCN_transErrorFlag"); //memTblGetTableValue(map, "TransTable", "TransErrorFlag");
	logger.info("sendToReprNibc: tError = " + tError);

	valueDate = getHeader(map, "PLCN_valueDate");
	logger.info("sendToReprNibc: valueDate = " + valueDate);

	stage = getHeader(map, "PLCN_stage");
	logger.info("sendToReprNibc: stage = " + stage);

	mode = getHeader(map, "PLCN_msgModeIn"); //(GETVALUEFROMHEADER (STRING "IN.ROUTE_MESSAGE") "MESSAGE_DETAILS" "MANUAL_MODE")
	logger.info("sendToReprNibc: mode = " + mode);

	sourceChnlId = getHeader(map, "PLCN_sourceChannelId");
	logger.info("sendToReprNibc: sourceChnlId = " + sourceChnlId);

	todaysDate = getDate();

	/*if(!valueDate) {
		return;
	}*/

	if((valueDate < todaysDate) && (stage != 'ERR') && (tError != 'T')) {
		logger.info("sendToReprNibc: past valueDate");

		var pastDateCheckNotApplicableChannel = memTblGetTableValue(map, "FLAG-TABLE", "PASTDATE_CHECK_NOTAPPLICABLE_CHANNEL");
		logger.info("sendToReprNibc: pastDateCheckNotApplicableChannel = " + pastDateCheckNotApplicableChannel);

		if(!(isPatternPresent(pastDateCheckNotApplicableChannel, sourceChnlId))) {

			if(mode != 'repair' && mode != 'MQ') {
				//setEnhcrViolation("00", "9506", Document, map);
				//commentsForBlob6 = fillViolation();
				setHeader(map, "PLCN_schedulingReq", true);
				commentsForBlob6 = setCommentsForTransaction("00", "9506", map);
				setHeader(map, "PLCN_queueId", "REPRQ");
				setHeader(map,"PLCN_schedulingReq", true);
			}

			/*if(memTblGetTableValue(map, "USER_CONFIG_MAP", "AUTOREPAIR_VALUEDATE_MQ") == "NO" && mode == "MQ") {
				//setEnhcrViolation("00", "9506", Document, map);
				//commentsForBlob6 = fillViolation();
				setHeader(map, "PLCN_schedulingReq", true);
				commentsForBlob6 = setCommentsForTransaction("00", "9506", map);
				setHeader(map, "PLCN_commentsForBlob6", commentsForBlob6);
				setHeader(map, "PLCN_queueId", "REPRQ");
				setHeader(map,"PLCN_schedulingReq", true);

				if(!reprProductCode){
					reprProductCode = getHeader(map, reprProductCode)
				}

				if(!reprProductCode) {
					reprProductCode = memTblGetTableValue(map, "STREAM_DETAILS", reprProductCode);
					pattern = searchNthPattern(reprProductCode, "-", -1);
					reprProductCode = reprProductCode.substr(1, pattern);
					reprProductCode = reprProductCode.concat("R");
					logger.info("sendToReprNibc: reprProductCode = " + reprProductCode);
					setHeader(map, "PLCN_derivedProduct", reprProductCode);
					setHeader(map, "PLCN_productCode", reprProductCode);
					setHeader(map, "PLCN_reprProductCode", reprProductCode);
				}
			}*/
		}
	}
}

function mainSchduleRouteMx(exchange) {
	var currency;
	var valueDate; 
	var valueDate1;
	var amount;
	var fld;
	var f57;
	var msgDirection;
	var vioCode1;
	var vioCode2;
	var vioCode3;
	var flag; 
	var productFlvr;
	var clrgIdCutoffFlag;
	var calculatedNewDate;
	var clrgId;
	var clrgIdStatus;
	var mode;
	var msgType;
	var msgPriority;
	var custom11Db;	
	var releaseDate;
	var origValueDate;
	var msgTypePrint;
	var currencyCutoffTime;
	var currClrgId;
	var todaysDate;
	var hh;
	var ss;
	var mm;
	var channelIdSource;
	var msgFamily;
	var custom37;
	var map;
	var directionCheck;
	var	currOffset;
	var StreamDetailsMap;
	var block3Path;
	var path;
	var t2releaseDate;
	var t2ValueDate;
	var t2Greater;
	var path;
	var greaterValueDate;
	var custom11;
	var commentsForBlob6;

	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

	logger.info("In mainSchduleRouteMx");

	setHeader(map, "PLCN_pastValueDateFlag", "N");
	setHeader(map, "PLCN_futureValDateFlag", "N");
	setHeader(map, "PLCN_holidayFlag", "N");
	setHeader(map, "PLCN_dayFlagQueryHdl", "");
	setHeader(map, "PLCN_holidayQueryHdl", "");
	setHeader(map, "PLCN_cutoffFlag", "N");
	setHeader(map, "PLCN_valueDate", ""); 
	setHeader(map, "PLCN_sendToHold", "");
	setHeader(map, "PLCN_overrideCutoffFlag", ""); 

	msgType = getHeader(map, "PLCN_msgType");
	logger.info("mainSchduleRouteMx: msgType = " + msgType);

	msgPriority = getHeader(map, "PLCN_msgPriority");
	logger.info("mainSchduleRouteMx: msgPriority = " + msgPriority);

	currency = getHeader(map, "PLCN_currency");
	logger.info("mainSchduleRouteMx: currency = " + currency);
	setHeader(map, "PLCN_msgCurrency", currency);

	amount = getHeader(map, "PLCN_priorityAmount");
	logger.info("mainSchduleRouteMx: amount = " + amount);
	setHeader(map, "PLCN_msgPriorityAmount", amount);

	valueDate = getHeader(map, "PLCN_priorityDate");
	logger.info("mainSchduleRouteMx: valueDate = " + valueDate);

	setHeader(map, "PLCN_orgnlPriorityDate", valueDate);

	if(!valueDate) {
		valueDate = getValueFromPath(Document, getValueDatePath(exchange));
		logger.info("mainSchduleRouteMx: valueDate from xPath = " + valueDate);
		setHeader(map, "PLCN_priorityDate", valueDate);
	}

	setHeader(map, "PLCN_msgPriorityDate", valueDate);

	msgDirection = getHeader(map, "PLCN_msgDirection");
	logger.info("mainSchduleRouteMx: msgDirection = " + msgDirection);

	//channelIdSource = memTblGetTableValue(map, "STREAM_DETAILS", "CHANNEL_ID_SOURCE");
	sourceChannelId = getHeader(map, "PLCN_sourceChannelId");
	logger.info("mainSchduleRouteMx: sourceChannelId = " + sourceChannelId);

	fld = "00"; //setEnhcrViolation
	path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/BICFI";
	f57 = getValueFromPath(Document, path);
	logger.info("mainSchduleRouteMx: f57 = " + f57);
	
	if(sourceChannelId == "SWIFT_UPL_IN") { //WIP
		setHeader(map, "PLCN_msgModeIn", "UPLOAD");
		setHeader(map, "PLCN_QM", "UPLOAD");
	}
	
	vioCode1 = 6011;
	vioCode2 = 6012;
	vioCode3 = 6013;

	clrgId = mxClearingId(map);
	logger.info("mainSchduleRouteMx: clrgId = " + clrgId);
	
	deriveClgsysTableValuesMx(clrgId, map);
	
	clrgIdCutoffFlag = memTblGetTableValue(map, "FLAG-TABLE", "CLRG_ID_CUTOFF_REQD");
	clrgIdCutoffFlag = clrgIdCutoffFlag.trim();
	logger.info("mainSchduleRouteMx: clrgIdCutoffFlag from FLAG-TABLE = " + clrgIdCutoffFlag);

	if(getHeader(map, "PLCN_overrideCutoffFlag") == "Y"){ //Y or N value was not set for PLCN_gvOverrideCutoffFlag

		productFlvr = memTblGetTableValue(map, "FLAG-TABLE", "PRODUCT_FLVR");
		
		if(productFlvr == "CORP"){
			//setHeader(map, "PLCN_queueId", "CRPHOLDQ");
			setHeader(map, "PLCN_queueId", "MXHOLDQ");
			setHeader(map, "PLCN_STATUS", "69");
		}

		if(productFlvr == "PGTWY"){
			//setHeader(map, "PLCN_queueId", "PAYHOLDQ");
			setHeader(map, "PLCN_queueId", "MXHOLDQ");
			setHeader(map, "PLCN_STATUS", "69");
		}

	}else{

		if(clrgIdCutoffFlag == "Y"){
			flag = "N";
		}else{
			flag = vdFutureValDateInstrn(valueDate, fld, vioCode3, map);
			logger.info("mainSchduleRouteMx: flag = " + flag);
		}
		
		if(flag == "N"){
			ddCurrCheckInstrctn(map); //This function decides whether currency is local or not. (PLCN_currLocal = Y/N)
			ddDirectionChkInstrctnMx(map); //This function sets PLCN_directionChk value (INBOUND/OUTBOUND)
			vdCutoffTimeInstrctn(currency, fld, f57, msgDirection, vioCode1, map); //checks if the current time has exceeded the cutoff time for the currency

			directionCheck = getHeader(map, "PLCN_directionChk");
			logger.info("mainSchduleRouteMx: directionCheck = " + directionCheck);

			pastValueDateFlag(valueDate, map);
			
			clrgId = getHeader(map, "PLCN_clearingId");
			clrgIdStatus = getHeader(map, "PLCN_cutoffTime");
			mode = getHeader(map, "PLCN_msgModeIn");
			msgPriority = getHeader(map, "PLCN_msgPriority");
			custom11Db = getHeader(map, "PLCN_custom11");

			logger.info("mainSchduleRouteMx: clrgId = " + clrgId);
			logger.info("mainSchduleRouteMx: clrgIdStatus = " + clrgIdStatus);
			logger.info("mainSchduleRouteMx: mode = " + mode);
			logger.info("mainSchduleRouteMx: msgPriority = " + msgPriority);
			logger.info("mainSchduleRouteMx: custom11Db = " + custom11Db);

			if(!clrgId || clrgIdStatus == "clearingId_NOT_FOUND"){
				clrgId = "DEFAULT_CLEARING"; //????
			}
			
			setHeader(map, "PLCN_clrgIdSet", clrgId);
			logger.info("mainSchduleRouteMx: PLCN_clrgIdSet = " + clrgId);

			if(directionCheck == "OUTBOUND"){
				setHeader(map, "PLCN_custom8", clrgId);
				logger.info("mainSchduleRouteMx: PLCN_custom8 = " + clrgId);
				
				var clrgIdReleaseFlag = getHeader(map, "PLCN_clrgIdReleaseFlag");
				logger.info("mainSchduleRouteMx: clrgIdReleaseFlag = " + clrgIdReleaseFlag);

				if(!clrgIdReleaseFlag){
					chkReleaseImmd(clrgId, map);
				}
				
				currOffset = getHeader(map, "PLCN_clrgIdOffsetDay");
				logger.info("mainSchduleRouteMx: currOffset = " + currOffset);

				if(!currOffset){
					currOffset = chkCurrOffsetDay(clrgId, map);
				}

				drvNextValueDate(valueDate, clrgId, currOffset, currency, fld, vioCode2, map);
				valueDateDcsnRule(valueDate, fld, vioCode3, vioCode2, map);
				releasePymtDateRule(clrgId, map);
				
				releaseDate = getHeader(map, "PLCN_valueDate");
				origValueDate = getHeader(map, "PLCN_valueDate2");
				currencyCutoffTime = getHeader(map, "PLCN_cutoffTime");
				currClrgId = getHeader(map, "PLCN_clearingId");
				todaysDate = getDate();

				logger.info("mainSchduleRouteMx: releaseDate = " + releaseDate);
				logger.info("mainSchduleRouteMx: origValueDate = " + origValueDate);
				logger.info("mainSchduleRouteMx: currencyCutoffTime = " + currencyCutoffTime);
				logger.info("mainSchduleRouteMx: currClrgId = " + currClrgId);
				logger.info("mainSchduleRouteMx: todaysDate = " + todaysDate);

				hh = currencyCutoffTime.substr(0, 2);
				mm = currencyCutoffTime.substr(2, 2);
				ss = currencyCutoffTime.substr(4, 2);
				
				currencyCutoffTime = (((hh.concat(":")).concat(mm)).concat(":")).concat(ss);
				logger.info("mainSchduleRouteMx: currencyCutoffTime = " + currencyCutoffTime);

				var commentsForBlob6 = getHeader(map, "PLCN_commentsForBlob6");
				logger.info("mainSchduleRouteMx: commentsForBlob6 = " + commentsForBlob6);
				
				if(mode == "REPAIR" && (origValueDate < releaseDate) &&  commentsForBlob6 != "6013"){
					//setEnhcrViolation("00","8958", map);
					//commentsForBlob6 = fillViolation();
					setHeader(map, "PLCN_schedulingReq", true);
					commentsForBlob6 = setCommentsForTransaction("00","8958", map);
					msgTypePrint.info = (((((((("Message is considered of past value dated, considering its cut-off time as ".concat(currencyCutoffTime)).concat(" and Offset days as ")).concat(currOffset)).concat(" for the given Clearning ID ")).concat(currClrgId)).concat(" when Pelican system date was ")).concat(todaysDate)).concat(" and value date of payment was ")).concat(origValueDate);
					setHeader(map, "PLCN_TRANSCOMM", msgTypePrint);
					logger.info("mainSchduleRouteMx: msgTypePrint = " + msgTypePrint);
				}

				//commentsForBlob6 = getHeader(map, "PLCN_commentsForBlob6");
				commentsForBlob6 = getHeader(map, "PLCN_txnComments");
				logger.info("mainSchduleRouteMx: commentsForBlob6 = " + commentsForBlob6);
				logger.info("mainSchduleRouteMx: msgDirection = " + msgDirection);

				if(msgDirection == "I" && commentsForBlob6 != "6013"){
					sendToReprNibc1(map);
				}

				var holdQFlag = getHeader(map, "PLCN_holdQFlag");
				logger.info("mainSchduleRouteMx: holdQFlag = " + holdQFlag);
				logger.info("mainSchduleRouteMx: block3Path = " + block3Path);

				if(holdQFlag == "Y" && block3Path == "TGT") {

					t2releaseDate = getHeader(map, "PLCN_calculatedReleaseDate");
					t2ValueDate = getHeader(map, "PLCN_valueDate");

					logger.info("mainSchduleRouteMx: t2releaseDate = " + t2releaseDate);
					logger.info("mainSchduleRouteMx: t2ValueDate = " + t2ValueDate);

					if(t2ValueDate > t2releaseDate){
						setHeader(map, "PLCN_greaterValueDate", t2ValueDate);
						logger.info("mainSchduleRouteMx: PLCN_greaterValueDate = " + t2ValueDate);
					}else{
						setHeader(map, "PLCN_greaterValueDate", t2releaseDate);
						logger.info("mainSchduleRouteMx: PLCN_greaterValueDate = " + t2releaseDate);
					}

					ruleTarget2DirectoryRoutingMx(map);
				}
			}

			logger.info("mainSchduleRouteMx: directionCheck = " + directionCheck);

			if(directionCheck == "INBOUND"){
				setHeader(map, "PLCN_custom8", clrgId);
				logger.info("mainSchduleRouteMx: PLCN_custom8 = " + clrgId);

				var clrgIdReleaseFlag = getHeader(map, "PLCN_clrgIdReleaseFlag");
				logger.info("mainSchduleRouteMx: clrgIdReleaseFlag = " + clrgIdReleaseFlag);

				if(!clrgIdReleaseFlag){
					chkReleaseImmd(clrgId, map);
				}

				currOffset = getHeader(map, "PLCN_clrgIdOffsetDay");
				logger.info("mainSchduleRouteMx: currOffset = " + currOffset);

				if(!currOffset){
					currOffset = chkCurrOffsetDay(clrgId, map);
					logger.info("mainSchduleRouteMx: currOffset = " + currOffset);
				}

				drvNextValueDate(valueDate, clrgId, currOffset, currency, fld, vioCode2, map);
				valueDateDcsnRule(valueDate, fld,vioCode3, vioCode2, map);
				releasePymtDateRule(clrgId, map);
			}
		}else{
			vdHolidayInstrcn(currency, valueDate, fld,vioCode2, map);
			ddNxtWrkingDayInstrcn(valueDate, currency, map);
			fmtNxtWrkingDayInstrn(valueDate, map);
			ddClrgInstParmInstrcn(map);
		}

		custom11 = getHeader(map, "PLCN_clrgIdSet");
		logger.info("mainSchduleRouteMx: custom11 = " + custom11);

		if(custom11){
			setHeader(map, "PLCN_clrgIdSet", custom11);
			logger.info("mainSchduleRouteMx: PLCN_clrgIdSet = " + custom11);
		}else{
			setHeader(map, "PLCN_clrgIdSet", "");
			logger.info("mainSchduleRouteMx: PLCN_clrgIdSet = ");
		}
	}

	//ruleCombineViolations(map); 

	return true;
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
	//tdValue = "Y"; //WIP
	logger.info("mxClearingId: tdValue = " + tdValue);

	if(tdValue == "Y") {
		tdValue = tdKey
	}else {
		tdValue = "";
	}

	//tdKey = "Outbound_SWIFT_DEF";
	setHeader(map, "PLCN_clearingId", tdKey);

	return tdValue;
}

//This function derives clgsys table values
function deriveClgsysTableValuesMx(clearingId, map){
	var tableValue;
	var temp;
	var value;
	var value1;
	var count;

	logger.info("In deriveClgsysTableValuesMx");

	count = 1;
	
	if(!clearingId){
		clearingId = drveNibcClySysDetails(map);
	}

	logger.info("deriveClgsysTableValuesMx: clearingId = " + clearingId);

	setHeader(map, "PLCN_clearingId", clearingId);
	setHeader(map, "PLCN_clrgIdSet", clearingId);

	tableValue = memTblGetTableValue(map, "CLGSYS", clearingId);//"|1000|235900|N|N|N|Y|0|N|"; //
	logger.info("deriveClgsysTableValuesMx: ClgSys Map value = " + tableValue);
	temp = tableValue;

	value = dataBetweenTokens("|", "|", temp);
	value = value.trim();
	var clStartTime = checkClgsysTime(value);
	setHeader(map, "PLCN_clStartTime", clStartTime);
	logger.info("deriveClgsysTableValuesMx: clStartTime = " + clStartTime);
	temp = removePattern(temp, "|" + value);

	value = dataBetweenTokens("|", "|", temp);
	value = value.trim();
	var cutoffTime = checkClgsysTime(value);
	setHeader(map, "PLCN_cutoffTime", cutoffTime);
	logger.info("deriveClgsysTableValuesMx: cutoffTime = " + cutoffTime);
	temp = removePattern(temp, "|" + value);

	value = dataBetweenTokens("|", "|", temp);
	value = value.trim();
	setHeader(map, "PLCN_clThursday", value);
	logger.info("deriveClgsysTableValuesMx: clThursday = " + value);
	temp = removePattern(temp, "|" + value);

	value = dataBetweenTokens("|", "|", temp);
	value = value.trim();
	setHeader(map, "PLCN_clFriday", value);
	logger.info("deriveClgsysTableValuesMx: clFriday = " + value);
	temp = removePattern(temp, "|" + value);

	value = dataBetweenTokens("|", "|", temp);
	value = value.trim();
	setHeader(map, "PLCN_clSaturday", value);
	logger.info("deriveClgsysTableValuesMx: clSaturday = " + value);
	temp = removePattern(temp, "|" + value);

	value = dataBetweenTokens("|", "|", temp);
	value = value.trim();
	setHeader(map, "PLCN_clSunday", value);
	logger.info("deriveClgsysTableValuesMx: clSunday = " + value);
	temp = removePattern(temp, "|" + value);

	value = dataBetweenTokens("|", "|", temp); //WIP
	value = value.trim();
	setHeader(map, "PLCN_clrgIdOffsetDay", value);
	logger.info("deriveClgsysTableValuesMx: clrgIdOffsetDay = " + value);
	temp = removePattern(temp, "|" + value);

	value = dataBetweenTokens("|", "|", temp); //Y, N, YES, No
	value = value.trim();
	setHeader(map, "PLCN_clrgIdReleaseFlag", value);
	logger.info("deriveClgsysTableValuesMx: clrgIdReleaseFlag = " + value);
	temp = removePattern(temp, "|" + value);
}

//This function checks if the value date is of future or past
//if msg date is of future then flag = "Y" is returned otherwise flag = "N"
function vdFutureValDateInstrn(valueDate, fld, vioCode3, map){
	var todaysDate;
	var msgDate;
	var flag;
	var comments;
	var commentsForBlob6;

	logger.info("In vdFutureValDateInstrn");

	msgDate = valueDate;
	logger.info("vdFutureValDateInstrn: msgDate = " + msgDate);

	todaysDate = getDate();
	logger.info("vdFutureValDateInstrn: todaysDate = " + todaysDate);

	if(msgDate > todaysDate){
		//PLCN_gvFutureValDateFlag = "Y";
		flag = "Y";
		setHeader(map, "PLCN_futureValDateFlag", flag);
		setHeader(map, "PLCN_futureDateFlag", flag);
		setHeader(map, "PLCN_overrideCutoffFlag", flag);
		//setEnhcrViolation(fld, vioCode3);
		//comments = fillViolation();
		//commentsForBlob6 = fillViolation();
		setHeader(map, "PLCN_schedulingReq", true);
		comments = setCommentsForTransaction(fld, vioCode3, map);
		commentsForBlob6 = comments;
		setHeader(map, "PLCN_commentsForBlob6", comments);
		setHeader(map, "PLCN_comments", comments);
	}else{
		flag = "N";
		setHeader(map, "PLCN_pastValueDateFlag", "Y");
	}
	
	logger.info("vdFutureValDateInstrn: PLCN_futureValDateFlag = " + getHeader(map, "PLCN_futureValDateFlag"));
	logger.info("vdFutureValDateInstrn: PLCN_pastValueDateFlag = " + getHeader(map, "PLCN_pastValueDateFlag"));

	return flag;
}

//This function decides whether currency is local or not. (PLCN_currLocal = Y/N)
function ddCurrCheckInstrctn(map){
	var curr;
	var institutionId;
	var lclCurr;
	var lclCurr1;

	logger.info("In ddCurrCheckInstrctn");

	curr = getHeader(map, "PLCN_msgCurrency");
	logger.info("ddCurrCheckInstrctn: currency = " + curr);

	institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("ddCurrCheckInstrctn: institutionId = " + institutionId);

	lclCurr = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.LOCAL_CURRENCY"); // PLCNUSNY.PAYMT_SWIFT.GEN_PARAMS.LOCAL_CURRENCY
	lclCurr = memTblGetTableValue(map, "INST_PARAM", lclCurr);
	logger.info("ddCurrCheckInstrctn: lclCurr = " + lclCurr);

	if(curr == lclCurr){
		setHeader(map, "PLCN_currLocal", "Y");
		logger.info("ddCurrCheckInstrctn: PLCN_currLocal = Y");
	}else{
		setHeader(map, "PLCN_currLocal", "N");
		logger.info("ddCurrCheckInstrctn: PLCN_currLocal = N");
	}
}

//This function sets PLCN_directionChk value (INBOUND/OUTBOUND)
function ddDirectionChkInstrctnMx(map){
	var direction;
	var msgModeIn;

	logger.info("In ddDirectionChkInstrctnMx");

	direction = getHeader(map, "PLCN_msgDirection");
	logger.info("ddDirectionChkInstrctnMx: direction = " + direction);

	if(direction == "O"){
		setHeader(map, "PLCN_directionChk", "INBOUND");
		logger.info("ddDirectionChkInstrctnMx: directionChk = INBOUND");
	}else{
		if(direction == "I"){
			setHeader(map, "PLCN_directionChk", "OUTBOUND");
			logger.info("ddDirectionChkInstrctnMx: directionChk = OUTBOUND");
		}
	}
}

//This function checks if the current time has exceeded the cutoff time for the currency
function vdCutoffTimeInstrctn(currency, fld, f57, msgDirection, vioCode1, map){
	var cutoffTime;
	var currTime;
	var comments;
	var cutoffFlag;
	var sendToHold;

	logger.info("In vdCutoffTimeInstrctn");

	//derive the cut-off time
	cutoffTime = getHeader(map, "PLCN_cutoffTime");
	logger.info("vdCutoffTimeInstrctn: cutoffTime = " + cutoffTime);
	logger.info("vdCutoffTimeInstrctn:  typeof cutoffTime = " + typeof cutoffTime);
	cutoffTime = parseInt(cutoffTime);
	logger.info("vdCutoffTimeInstrctn:  typeof cutoffTime = " + typeof cutoffTime);

	if(!cutoffTime){
		cutoffTime = chkCutoffTimeInstrctn(currency, f57, msgDirection, map);
		logger.info("vdCutoffTimeInstrctn: cutoffTime from chkCutoffTimeInstrctn = " + cutoffTime);
	}

	currTime = localTime();
	currTime = replacePattern(currTime, ":", "");
	currTime = replacePattern(currTime, ":", "");
	logger.info("vdCutoffTimeInstrctn: currTime = " + currTime);
	logger.info("vdCutoffTimeInstrctn:  typeof currTime = " + typeof currTime);
	currTime = parseInt(currTime);
	logger.info("vdCutoffTimeInstrctn:  typeof currTime = " + typeof currTime);

	if(cutoffTime){
		if(currTime > cutoffTime){
			setHeader(map, "PLCN_schedulingReq", true);
			cutoffFlag = "Y";
			logger.info("vdCutoffTimeInstrctn: cutoffFlag = " + cutoffFlag);
			setHeader(map, "PLCN_cutoffFlag", cutoffFlag);
			comments = setCommentsForTransaction(fld, vioCode1, map);
			setHeader(map, "PLCN_commentsForBlob6", comments);
			setHeader(map, "PLCN_comments", comments);
			sendToHold = "Y";
			setHeader(map, "PLCN_sendToHold", sendToHold);
			logger.info("vdCutoffTimeInstrctn: sendToHold = " + sendToHold);
		}
	}

	var startTime = getHeader(map, "PLCN_clStartTime");
	logger.info("vdCutoffTimeInstrctn: startTime = " + startTime);
	logger.info("vdCutoffTimeInstrctn:  typeof startTime = " + typeof startTime);
	startTime = parseInt(startTime);
	logger.info("vdCutoffTimeInstrctn:  typeof startTime = " + typeof startTime);

	if(startTime){
		if(currTime < startTime){
			setHeader(map, "PLCN_schedulingReq", true);
			setHeader(map, "PLCN_startTimeFlag", "Y");
			comments = setCommentsForTransaction(fld, vioCode1, map);
			setHeader(map, "PLCN_commentsForBlob6", comments);
			setHeader(map, "PLCN_comments", comments);
			logger.info("vdCutoffTimeInstrctn: PLCN_startTimeFlag = " + getHeader(map, "PLCN_startTimeFlag"));
		}
	}
}

//This function checks if value date is of past
function pastValueDateFlag(valueDate, map){
	var todaysDate;
	var msgDate;

	logger.info("In pastValueDateFlag");

	msgDate = valueDate;
	logger.info("pastValueDateFlag: msgDate = " + msgDate);

	todaysDate = getDate();
	logger.info("pastValueDateFlag: todaysDate = " + todaysDate);

	currOffset = getHeader(map, "PLCN_clrgIdOffsetDay");
	logger.info("pastValueDateFlag: currOffset = " + currOffset);

	if(msgDate < todaysDate){
		setHeader(map, "PLCN_pastValueDateFlag", "Y")
		logger.info("pastValueDateFlag: PLCN_pastValueDateFlag = Y");
		setCommentsForTransaction("00", "9506", map);
		setHeader(map, "PLCN_repairReq", "true");
	}else if(parseInt(currOffset) > 0 && msgDate <= todaysDate) {
		setHeader(map, "PLCN_pastValueDateFlag", "Y")
		logger.info("pastValueDateFlag: PLCN_pastValueDateFlag = Y");
		setCommentsForTransaction("00", "9506", map);
		setHeader(map, "PLCN_repairReq", "true");
		//4503setHeader(map, "PLCN_schedulingReq", true);	
	}
}

//This function derives value of clReleaseImmediate
//value is derived from header so no need of this function
function chkReleaseImmd(clrgId, map){
	var releaseFlag;
	var institutionId;

	logger.info("In chkReleaseImmd");
	
	//institutionId = getHeader(map, "PLCN_institutionId");
	
	releaseFlag = getHeader(map, "PLCN_clReleaseImmediate");
	logger.info("chkReleaseImmd: releaseFlag = " + releaseFlag);
	setHeader(map, "PLCN_clrgIdReleaseFlag", releaseFlag);
}

//This function derives value of clClgSysIdOffset
//value is derived from header so no need of this function
function chkCurrOffsetDay(clrgId, map){
	var cutoffDay;
	var institutionId;

	logger.info("In chkCurrOffsetDay");

	//institutionId = getHeader(map, "PLCN_institutionId");

	cutoffDay = getHeader(map, "PLCN_clClgSysIdOffset");
	setHeader(map, "PLCN_clrgIdOffsetDay", cutoffDay);

	return cutoffDay;
}

//This function derives next value date
function drvNextValueDate(valueDate, clrgId, currOffset, currency, fld, vioCode2, map){	
	var dateVal;
	var sign;
	var noOfDays;
	var val;
	var directionCheck;
	var d;
	var signNoOfDays;
	var calculatedNextDate;
	var calculatedReleaseDate;
	var calcNoOfDays;
	var todaysDate;
	var J;
	var holidayFlag;
	var cutoffFlag;
	var tempDate;
	var tempFlag;
	var releaseFlag;
	var chgFlag;
	var tempReleaseDate;
	var futureValueDateFlag;
	var comments;
	var tmpCalNoOfDays;
	var tmpCalcDate;
	var tmpPastFlag;
	var tmpHolidayFlag;
	var valueDate2;
	var noOfDays1;
	var valueDateSameFlag;
	var todaysDateHoliday;
	var createHoliday;
	var todaysDay;
	var todaysDateHolidayCnvrt;
	var tmpDate1;
	var tmpDate2;
	var tbRealeaseFlag;
	var tmpValueDate;
	var tmpReleaseDate;
	var holidayFlag;
	var pastValueDateFlag;

	logger.info("In drvNextValueDate");
	
	tempFlag = "N";
	chgFlag = "N";
	futureValueDateFlag = "N";
	valueDateSameFlag = "N";
	valueDate2 = valueDate;
	setHeader(map, "PLCN_valueDate2", valueDate2); 
	todaysDate = getDate();

	logger.info("drvNextValueDate: todaysDate = " + todaysDate);
	logger.info("drvNextValueDate: valueDate = " + valueDate);
	logger.info("drvNextValueDate: clrgId = " + clrgId);
	logger.info("drvNextValueDate: currOffset = " + currOffset);
	logger.info("drvNextValueDate: currency = " + currency);
	logger.info("drvNextValueDate: fld = " + fld);
	logger.info("drvNextValueDate: vioCode2 = " + vioCode2);
	logger.info("drvNextValueDate: PLCN_valueDate2 = " + valueDate2);

	if(todaysDate){
		vdHolidayInstrcn(currency, todaysDate, fld, vioCode2, map);
		ddNxtWrkingDayInstrcn(todaysDate, currency, map);
		holidayFlag = getHeader(map, "PLCN_holidayFlag");
		logger.info("drvNextValueDate: holidayFlag = " + holidayFlag);

		if(holidayFlag == "Y"){
			todaysDate = getHeader(map, "PLCN_valueDate");
			tmpHolidayFlag = "Y";
			holidayFlag = "N";
			setHeader(map, "PLCN_holidayFlag", holidayFlag);
			valueDate = todaysDate;
			logger.info("drvNextValueDate: tmpHolidayFlag = " + tmpHolidayFlag);
			logger.info("drvNextValueDate: PLCN_holidayFlag = " + holidayFlag);
			logger.info("drvNextValueDate: valueDate = " + valueDate);
		}
	}
	
	cutoffFlag = getHeader(map, "PLCN_cutoffFlag");
	releaseFlag = getHeader(map, "PLCN_clrgIdReleaseFlag");
	pastValueDateFlag = getHeader(map, "PLCN_pastValueDateFlag");

	logger.info("drvNextValueDate: cutoffFlag = " + cutoffFlag);
	logger.info("drvNextValueDate: releaseFlag = " + releaseFlag);
	logger.info("drvNextValueDate: pastValueDateFlag = " + pastValueDateFlag);

	if(pastValueDateFlag == "Y"){
		valueDate = todaysDate;
		tmpPastFlag = "Y";
		pastValueDateFlag = "N";
		setHeader(map, "PLCN_pastValueDateFlag", pastValueDateFlag);
		logger.info("drvNextValueDate: PLCN_pastValueDateFlag = " + pastValueDateFlag);
	}

	logger.info("drvNextValueDate: tmpHolidayFlag = " + tmpHolidayFlag);

	if(tmpHolidayFlag == "Y" && cutoffFlag == "Y"){ //Message is received in system post cut off time and input date is holiday
		cutoffFlag = "N";
		logger.info("drvNextValueDate: PLCN_cutoffFlag = " + cutoffFlag);
		setHeader(map, "PLCN_cutoffFlag", cutoffFlag);
	}

	logger.info("drvNextValueDate: currOffset = " + currOffset);
	
	if(currOffset == ""){
		currOffset = 0;
	}

	if(currOffset){

		if(!isAllDigits(currOffset)){
			sign = currOffset.substr(1, 1);
			noOfDays = removePattern(currOffset, sign);
			noOfDays = noOfDays.trim();
			logger.info("drvNextValueDate: sign = " + sign);
			logger.info("drvNextValueDate: noOfDays = " + noOfDays);
		}else{
			noOfDays = currOffset.trim(); //1 or 0
			logger.info("drvNextValueDate: noOfDays = " + noOfDays);
		}

		noOfDays1 = noOfDays; // 1 or 0
		setHeader(map, "PLCN_offsetNoOfDays", noOfDays);
		logger.info("drvNextValueDate: PLCN_offsetNoOfDays = " + noOfDays);

		d = valueDate; //msg vala date
		logger.info("drvNextValueDate: d = " + d);
		logger.info("drvNextValueDate: sign = " + sign);

		if(isPatternPresent(sign, "-")){
			calcNoOfDays = noOfDays;
		}else{
			calcNoOfDays = "-".concat(noOfDays); //-1 or -0
		}

		logger.info("drvNextValueDate: calcNoOfDays = " + calcNoOfDays); //-1 or -0
		logger.info("drvNextValueDate: noOfDays1 = " + noOfDays1); //1 or 0
		logger.info("drvNextValueDate: typeof noOfDays1 = " + typeof noOfDays1); //1 or 0
		
		if(parseInt(noOfDays1) == 0){
			tmpCalcDate = ddBusinessDate(todaysDate, "+", "BD", noOfDays1, map);
			logger.info("drvNextValueDate: tmpCalcDate from ddBusinessDate  = " + tmpCalcDate);
		}else{
			tmpCalcDate = ddBusinessDate1(todaysDate, "+", "BD", noOfDays1, map);
			logger.info("drvNextValueDate: tmpCalcDate from ddBusinessDate1 = " + tmpCalcDate);
		}

		logger.info("drvNextValueDate: valueDate2 = " + valueDate2);

		var comments1;
		comments1 = getHeader(map, "PLCN_comments");
		todaysDateHoliday = getDate();
		logger.info("drvNextValueDate: todaysDateHoliday = " + todaysDateHoliday);

		if(valueDate2 > tmpCalcDate){
			valueDate = valueDate2;
			futureValueDateFlag = "Y";
			setHeader(map, "PLCN_schedulingReq", true);
			comments = setCommentsForTransaction(fld, "6013", map);
			commentsForBlob6 = comments;
			setHeader(map, "PLCN_commentsForBlob6", comments);
			setHeader(map, "PLCN_comments", comments);
			setHeader(map, "PLCN_futureDateFlag", futureValueDateFlag);
			logger.info("drvNextValueDate: PLCN_futureDateFlag = " + futureValueDateFlag);

		}

		createHoliday = checkHolidayInstrcn(currency, todaysDateHoliday, map);
		todaysDateHolidayCnvrt = convertDateFormat(todaysDateHoliday, "CCYYMMDD", "DDMMCCYY");
		var tmpDateW = convertDateFormat(todaysDateHoliday, "CCYYMMDD", "MMDDCCYY");
		todaysDay = getWeekday(tmpDateW);

		logger.info("drvNextValueDate: createHoliday = " + createHoliday);
		logger.info("drvNextValueDate: todaysDay = " + todaysDay);

		if(createHoliday == 0){

			if((todaysDay == "Thursday" && getHeader(map, "PLCN_clThursday") == "Y") || (todaysDay == "Friday" && getHeader(map, "PLCN_clFriday") ==  "Y") || (todaysDay == "Saturday" && getHeader(map, "PLCN_clSaturday") == "Y") || (todaysDay == "Sunday" && getHeader(map, "PLCN_clSunday") == "Y")){
				createHoliday = 1;
				logger.info("drvNextValueDate: createHoliday = 1");
			}
		}

		setHeader(map, "PLCN_createHoliday", createHoliday);
		logger.info("drvNextValueDate: PLCN_createHoliday before setting 9500 = " + createHoliday);

		if(createHoliday > 0){
			logger.info("drvNextValueDate: valueDate2 = " + valueDate2);
			logger.info("drvNextValueDate: valueDate = " + valueDate);
			valueDate = valueDate2;
			logger.info("drvNextValueDate: valueDate = " + valueDate);
			//setEnhcrViolation(fld, "9500", map);
			//comments = fillViolation();
			//commentsForBlob6 = fillViolation();
			logger.info("drvNextValueDate: setting 9500");
			setHeader(map, "PLCN_schedulingReq", true);
			comments = setCommentsForTransaction(fld, "9500", map);
			commentsForBlob6 = comments;
			setHeader(map, "PLCN_commentsForBlob6", comments);
			setHeader(map, "PLCN_comments", comments);

		}

		if(isPatternPresent(comments, "6013")){
			setHeader(map, "PLCN_comments", comments);
			setHeader(map, "PLCN_commentsForBlob6", comments);
		}
		
		logger.info("drvNextValueDate: cutoffFlag = " + cutoffFlag);
		logger.info("drvNextValueDate: valueDate = " + valueDate);
		logger.info("drvNextValueDate: todaysDate = " + todaysDate);

		if(cutoffFlag == "Y"){

			if(todaysDate <= valueDate){
				logger.info("drvNextValueDate: todaysDate <= valueDate");
				calculatedReleaseDate = getDateFromNumOfDays(todaysDate, "1");
				tempFlag = "Y";
			}

			logger.info("drvNextValueDate: futureValueDateFlag = " + futureValueDateFlag);

			if(futureValueDateFlag == "Y"){
				logger.info("drvNextValueDate: futureValueDateFlag == Y");
				calculatedReleaseDate = getDateFromNumOfDays(valueDate2, calcNoOfDays);
				tempFlag = "Y";
			}

			logger.info("drvNextValueDate: calculatedReleaseDate = " + calculatedReleaseDate);
		}

		logger.info("drvNextValueDate: tempFlag = " + tempFlag);

		if(tempFlag == "N"){

			if(todaysDate < valueDate){
				logger.info("drvNextValueDate: d = " + d);
				logger.info("drvNextValueDate: calcNoOfDays = " + calcNoOfDays);
				calculatedReleaseDate = getDateFromNumOfDays(d, calcNoOfDays);
				logger.info("drvNextValueDate: calculatedReleaseDate when todaysDate < valueDate = " + calculatedReleaseDate);
			}

			logger.info("drvNextValueDate: futureValueDateFlag = " + futureValueDateFlag);

			if(futureValueDateFlag == "Y"){
				logger.info("drvNextValueDate: valueDate2 = " + valueDate2);
				logger.info("drvNextValueDate: calcNoOfDays = " + calcNoOfDays);
				calculatedReleaseDate = getDateFromNumOfDays(valueDate2, calcNoOfDays);
				logger.info("drvNextValueDate: calculatedReleaseDate when futureValueDateFlag is equal to Y = " + calculatedReleaseDate);	
			}

			logger.info("drvNextValueDate: calculatedReleaseDate = " + calculatedReleaseDate);
			setHeader(map, "PLCN_custom24rd", calculatedReleaseDate); //WIP OFFSET

			var tmpDate1;
			var tmpDate2;
			var tbRealeaseFlag;
			var tmpValueDate;
			var tmpReleaseDate;

			logger.info("drvNextValueDate: todaysDate = " + todaysDate);
			logger.info("drvNextValueDate: valueDate = " + valueDate);

			if(todaysDate < valueDate){
				logger.info("drvNextValueDate: todaysDate < valueDate");
				vdHolidayInstrcn(currency, valueDate, fld, vioCode2, map);
				holidayFlag = getHeader(map, "PLCN_holidayFlag");
				logger.info("drvNextValueDate: holidayFlag after vdHolidayInstrcn = " + holidayFlag);				
				
				ddNxtWrkingDayInstrcn(valueDate, currency, map); 
				holidayFlag = getHeader(map, "PLCN_holidayFlag");
				logger.info("drvNextValueDate: holidayFlag after ddNxtWrkingDayInstrcn = " + holidayFlag);

				if(holidayFlag == "Y"){
					tmpValueDate = getHeader(map, "PLCN_valueDate");
					logger.info("drvNextValueDate: tmpValueDate from PLCN_valueDate = " + tmpValueDate);
					holidayFlag = "N";
					setHeader(map, "PLCN_holidayFlag", holidayFlag);
					logger.info("drvNextValueDate: PLCN_holidayFlag = " + holidayFlag);
				}else{
					tmpValueDate = valueDate;
					logger.info("drvNextValueDate: tmpValueDate from valueDate = " + tmpValueDate);
				}

				logger.info("drvNextValueDate: todaysDate = " + todaysDate);
				logger.info("drvNextValueDate: noOfDays1 = " + noOfDays1);				

				if(parseInt(noOfDays1) == 0){
					//tmpValueDate = ddBusinessDate(todaysDate, "+", "BD", noOfDays1, map);
					tmpValueDate = ddBusinessDate(tmpValueDate, "+", "BD", noOfDays1, map);
					tmpReleaseDate = tmpValueDate;
				}else{
					//tmpReleaseDate = ddBusinessDate1(todaysDate, "-", "BD", noOfDays1, map); WIP
					tmpReleaseDate = ddBusinessDate(tmpValueDate, "-", "BD", noOfDays1, map);
				}

				logger.info("drvNextValueDate: tmpReleaseDate from ddBusinessDate = " + tmpReleaseDate);

				tmpDate1 = getDateFromNumOfDays(tmpReleaseDate, "1");
				logger.info("drvNextValueDate: tmpDate1 = " + tmpDate1);
				logger.info("drvNextValueDate: todaysDate = " + todaysDate);

				var futureDateFlag = getHeader(map, "PLCN_futureDateFlag");
				logger.info("drvNextValueDate: futureDateFlag = " + futureDateFlag);

				if(tmpReleaseDate == todaysDate && futureDateFlag != "Y"){
					tbRealeaseFlag = "Y";
					setHeader(map, "PLCN_toBeReleasedFlag", tbRealeaseFlag);
					valueDateSameFlag = "Y";
				}

				if(tmpDate1 == todaysDate){
					tbRealeaseFlag = "Y";
					setHeader(map, "PLCN_toBeReleasedFlag", tbRealeaseFlag);
					d = todaysDate;
				}
			}

			logger.info("drvNextValueDate: tmpPastFlag = " + tmpPastFlag);
			logger.info("drvNextValueDate: tmpHolidayFlag = " + tmpHolidayFlag);
			
			if(tmpPastFlag == "Y" && todaysDate == valueDate && tmpHolidayFlag != "Y"){
				tbRealeaseFlag = "Y";
				setHeader(map, "PLCN_toBeReleasedFlag", tbRealeaseFlag);
				tmpPastFlag = "N";
			}

			logger.info("drvNextValueDate: tbRealeaseFlag = " + tbRealeaseFlag);
		}

		logger.info("drvNextValueDate: calculatedReleaseDate = " + calculatedReleaseDate);

		if(calculatedReleaseDate){
			vdHolidayInstrcn(currency, calculatedReleaseDate, fld, vioCode2, map);
			ddNxtWrkingDayInstrcn(calculatedReleaseDate, currency, map);
			
			holidayFlag = getHeader(map, "PLCN_holidayFlag");
			logger.info("drvNextValueDate: holidayFlag = " + holidayFlag);

			if(holidayFlag == "Y"){
				calculatedReleaseDate = getHeader(map, "PLCN_valueDate");
				holidayFlag = "N";
				setHeader(map, "PLCN_holidayFlag", holidayFlag);
				logger.info("drvNextValueDate: PLCN_holidayFlag = " + holidayFlag);
			}else{
				calculatedReleaseDate = calculatedReleaseDate;
			}
		}

		setHeader(map, "PLCN_calculatedReleaseDate", calculatedReleaseDate);
		logger.info("drvNextValueDate: calculatedReleaseDate = " + calculatedReleaseDate);

		logger.info("drvNextValueDate: tempFlag = " + tempFlag);
		logger.info("drvNextValueDate: todaysDate = " + todaysDate);
		logger.info("drvNextValueDate: valueDate = " + valueDate);
		logger.info("drvNextValueDate: noOfDays = " + noOfDays);
		
		if(tempFlag == "N"){
			if(todaysDate < valueDate && noOfDays == 1){
				noOfDays = 0;
				chgFlag = "Y";
				logger.info("drvNextValueDate: chgFlag = " + chgFlag);
			}
		}
	}

	logger.info("drvNextValueDate: futureValueDateFlag = " + futureValueDateFlag);
	logger.info("drvNextValueDate: valueDateSameFlag = " + valueDateSameFlag);
	
	if(futureValueDateFlag == "Y" || valueDateSameFlag == "Y"){
		calculatedNextDate = valueDate;
		vdHolidayInstrcn(currency, calculatedNextDate, fld, vioCode2, map);
		ddNxtWrkingDayInstrcn(calculatedNextDate, currency, map);

		holidayFlag = getHeader(map, "PLCN_holidayFlag");
		logger.info("drvNextValueDate: holidayFlag = " + holidayFlag);

		if(holidayFlag == "Y"){
			calculatedNextDate = getHeader(map, "PLCN_valueDate");
			holidayFlag = "N";
			setHeader(map, "PLCN_holidayFlag", holidayFlag);
			logger.info("drvNextValueDate: PLCN_holidayFlag = " + holidayFlag);
		}else{
			calculatedNextDate = calculatedNextDate;
			setHeader(map, "PLCN_valueDate", calculatedNextDate);
			logger.info("drvNextValueDate: PLCN_valueDate = " + calculatedNextDate);			  
		}

		logger.info("drvNextValueDate: calculatedNextDate = " + calculatedNextDate);
	}else{
		J = 0;
		logger.info("drvNextValueDate: noOfDays = " + noOfDays);

		while(J <= noOfDays){
			signNoOfDays = 0;

			logger.info("drvNextValueDate: todaysDate = " + todaysDate);
			logger.info("drvNextValueDate: valueDate = " + valueDate);
			logger.info("drvNextValueDate: cutoffFlag = " + cutoffFlag);
			logger.info("drvNextValueDate: chgFlag = " + chgFlag);
			logger.info("drvNextValueDate: signNoOfDays = " + signNoOfDays);

			if((J == noOfDays) && (todaysDate <= valueDate) && (cutoffFlag == "N" || cutoffFlag == "") && (chgFlag == "Y")){
				signNoOfDays = 1;
			}

			if(J == 0 && cutoffFlag == "Y"){
				if(todaysDate <= valueDate){
					d = todaysDate;
					signNoOfDays = 1;
				}
			}

			if((J <= noOfDays) && (todaysDate <= valueDate) && cutoffFlag == "Y"){
				signNoOfDays = 1;
			}

			if(J != 0 && (J <= noOfDays) && (cutoffFlag == "N" || cutoffFlag == "")){
				signNoOfDays = 1;
			}

			if(J != 0 && (J <= noOfDays) && cutoffFlag == "Y"){
				signNoOfDays = 1;
			}

			calculatedNextDate = getDateFromNumOfDays(d, signNoOfDays);
			logger.info("drvNextValueDate: calculatedNextDate = " + calculatedNextDate);

			if(calculatedNextDate == ""){
				calculatedNextDate = d;
			}

			vdHolidayInstrcn(currency, calculatedNextDate, fld, vioCode2, map);
			ddNxtWrkingDayInstrcn(calculatedNextDate, currency, map);

			holidayFlag = getHeader(map, "PLCN_holidayFlag");
			logger.info("drvNextValueDate: holidayFlag = " + holidayFlag);

			if(holidayFlag == "Y"){
				calculatedNextDate = getHeader(map, "PLCN_valueDate");
				holidayFlag = "N";
				setHeader(map, "PLCN_holidayFlag", holidayFlag);
				logger.info("drvNextValueDate: PLCN_holidayFlag = " + holidayFlag);
			}else{
				calculatedNextDate = calculatedNextDate;
				setHeader(map, "PLCN_valueDate", calculatedNextDate);
				logger.info("drvNextValueDate: PLCN_valueDate = " + calculatedNextDate);
			}

			d = calculatedNextDate;
			J++; 

			logger.info("drvNextValueDate: d = " + d);
			logger.info("drvNextValueDate: J = " + J);
		}
	}

	calculatedNextDate = getHeader(map, "PLCN_valueDate");
	logger.info("drvNextValueDate: calculatedNextDate = " + calculatedNextDate);
	logger.info("drvNextValueDate: tempFlag = " + tempFlag);

	if(tempFlag == "N"){

		if(todaysDate == valueDate){
			calculatedReleaseDate = getDateFromNumOfDays(calculatedNextDate, calcNoOfDays);

			if(calculatedReleaseDate){
				vdHolidayInstrcn(currency, calculatedReleaseDate, fld, vioCode2, map);
				ddNxtWrkingDayInstrcn(calculatedReleaseDate, currency, map);

				holidayFlag = getHeader(map, "PLCN_holidayFlag");
				logger.info("drvNextValueDate: holidayFlag = " + holidayFlag);

				if(holidayFlag == "Y"){
					calculatedReleaseDate = getHeader(map, "PLCN_valueDate");
					holidayFlag = "N";
					setHeader(map, "PLCN_holidayFlag", holidayFlag);
					logger.info("drvNextValueDate: PLCN_holidayFlag = " + holidayFlag);
				}else{
					calculatedReleaseDate = calculatedReleaseDate;
				}					 
			}
		}
	}
	
	logger.info("drvNextValueDate: calculatedNextDate = " + calculatedNextDate);
	logger.info("drvNextValueDate: valueDate = " + valueDate);

	if(calculatedNextDate == valueDate){
		calculatedNextDate = calculatedNextDate;
	}

	logger.info("drvNextValueDate: cutoffFlag = " + cutoffFlag);

	if(cutoffFlag == "Y"){
		calculatedNextDate = calculatedNextDate;
	}else{
		if(todaysDate == valueDate){
			calculatedNextDate = calculatedNextDate;
		}
	}

	logger.info("drvNextValueDate: calculatedNextDate = " + calculatedNextDate);
	setHeader(map, "PLCN_calculatedNextDate", calculatedNextDate);
	
	logger.info("drvNextValueDate: noOfDays1 = " + noOfDays1);

	if(parseInt(noOfDays1) == 0){
		calculatedNextDate = ddBusinessDate(calculatedNextDate, "+", "BD", noOfDays1, map);
		calculatedReleaseDate = calculatedNextDate;
	}else{
		calculatedReleaseDate = ddBusinessDate(calculatedNextDate, "-", "BD", noOfDays1, map);
	}

	logger.info("drvNextValueDate: calculatedReleaseDate from ddBusinessDate = " + calculatedReleaseDate);
	setHeader(map, "PLCN_calculatedReleaseDate", calculatedReleaseDate);

	return calculatedReleaseDate;
}

/*function drvNextValueDate(valueDate, clrgId, currOffset, currency, fld, vioCode2, map){
	var dateVal;
	var sign;
	var noOfDays;
	var val;
	var directionCheck;
	var d;
	var signNoOfDays;
	var calculatedNextDate;
	var calculatedReleaseDate;
	var calcNoOfDays;
	var todaysDate;
	var J;
	var holidayFlag;
	var cutoffFlag;
	var tempDate;
	var tempFlag;
	var releaseFlag;
	var chgFlag;
	var tempReleaseDate;
	var futureValueDateFlag;
	var comments;
	var tmpCalNoOfDays;
	var tmpCalcDate;
	var tmpPastFlag;
	var tmpHolidayFlag;
	var valueDate2;
	var noOfDays1;
	var valueDateSameFlag;
	var todaysDateHoliday;
	var createHoliday;
	var todaysDay;
	var todaysDateHolidayCnvrt;
	var tmpDate1;
	var tmpDate2;
	var tbRealeaseFlag;
	var tmpValueDate;
	var tmpReleaseDate;
	var holidayFlag;
	var pastValueDateFlag;
	var nextValueDate;

	logger.info("In drvNextValueDate");
	
	tempFlag = "N";
	chgFlag = "N";
	futureValueDateFlag = "N";
	valueDateSameFlag = "N";
	valueDate2 = valueDate;
	setHeader(map, "PLCN_valueDate2", valueDate2); 
	todaysDate = getDate();
	nextValueDate = valueDate;

	logger.info("drvNextValueDate: todaysDate = " + todaysDate);
	logger.info("drvNextValueDate: valueDate = " + valueDate);
	logger.info("drvNextValueDate: clrgId = " + clrgId);
	logger.info("drvNextValueDate: currOffset = " + currOffset);
	logger.info("drvNextValueDate: currency = " + currency);
	logger.info("drvNextValueDate: fld = " + fld);
	logger.info("drvNextValueDate: vioCode2 = " + vioCode2);
	logger.info("drvNextValueDate: PLCN_valueDate2 = " + valueDate2);
	logger.info("drvNextValueDate: nextValueDate = " + nextValueDate);

	vdHolidayInstrcn(currency, valueDate, fld, vioCode2, map);
	ddNxtWrkingDayInstrcn(valueDate, currency, map);
	holidayFlag = getHeader(map, "PLCN_holidayFlag");
	logger.info("drvNextValueDate: holidayFlag = " + holidayFlag);

	clrgIdOffsetDay = getHeader(map, "PLCN_clrgIdOffsetDay");
	logger.info("drvNextValueDate: clrgIdOffsetDay = " + clrgIdOffsetDay);
	logger.info("drvNextValueDate: typeof clrgIdOffsetDay = " + typeof clrgIdOffsetDay);

	var clrgIdOffsetDayNumber = parseInt(clrgIdOffsetDay);

	if(clrgIdOffsetDayNumber > 0) {
		noOfDays = "-".concat(clrgIdOffsetDay);
		logger.info("drvNextValueDate: noOfDays = " + noOfDays);
	}else {
		noOfDays = "1";
		logger.info("drvNextValueDate: noOfDays = " + noOfDays);
	}

	while(holidayFlag == "Y" && valueDate >= todaysDate) {
		nextValueDate = getDateFromNumOfDays(nextValueDate, noOfDays);
		logger.info("drvNextValueDate: nextValueDate = " + nextValueDate);
		vdHolidayInstrcn(currency, nextValueDate, fld, vioCode2, map);
		ddNxtWrkingDayInstrcn(nextValueDate, currency, map);
		holidayFlag = getHeader(map, "PLCN_holidayFlag");
		logger.info("drvNextValueDate: holidayFlag = " + holidayFlag + " for nextValueDate = " + nextValueDate);
	}

	//past
	if(nextValueDate < todaysDate) {
		pastValueDateFlag = "Y";
		setHeader(map, "PLCN_schedulingReq", true);
		comments = setCommentsForTransaction(fld, "6013", map);
		commentsForBlob6 = comments;
		setHeader(map, "PLCN_commentsForBlob6", comments);
		setHeader(map, "PLCN_comments", comments);
		setHeader(map, "PLCN_pastValueDateFlag", pastValueDateFlag);
		logger.info("drvNextValueDate: PLCN_pastValueDateFlag = " + pastValueDateFlag);
	}else if(valueDate > todaysDate) {
		futureValueDateFlag = "Y";
		setHeader(map, "PLCN_schedulingReq", true);
		comments = setCommentsForTransaction(fld, "6013", map);
		commentsForBlob6 = comments;
		setHeader(map, "PLCN_commentsForBlob6", comments);
		setHeader(map, "PLCN_comments", comments);
		setHeader(map, "PLCN_futureDateFlag", futureValueDateFlag);
		logger.info("drvNextValueDate: PLCN_futureDateFlag = " + futureValueDateFlag);		
	}

	setHeader(map, "PLCN_calculatedReleaseDate", nextValueDate);
	logger.info("drvNextValueDate: nextValueDate = " + nextValueDate);
}*/

//This function extracts country code from BIC
function xtF57CntryCodeInstrcn(bic, map){
	var cntryCode;
	var len;

	logger.info("In xtF57CntryCodeInstrcn");

	len = bic.length;

	if(len == 8 || len == 11){
		cntryCode = bic.substr(5, 2);
		setHeader(map, "PLCN_cuCodeAccWithInst", cntryCode);
	}
}

function ddCstmrNoncstmrInstrcn(map){
	var institutionId;
	var msgType;
	var instCntryCode;
	var instCntryCode1;
	var msgCntryCode;
	var currencyLocal;
	var directionCheck;
	var cuCodeAccWithInst;
	var rcvrBicCntryCode;
	var isAcctInstDef;

	logger.info("In ddCstmrNoncstmrInstrcn");
	
	institutionId = getHeader(map, "PLCN_institutionId");
	msgType = getHeader(map, "PLCN_msgType");
	isAcctInstDef = getHeader(map, "PLCN_isAcctInstDef");

	if(isAcctInstDef == "Y"){
		setHeader(map, "PLCN_customerFlag", "Y");
	}else{
		setHeader(map, "PLCN_customerFlag", "N");
	}

	currencyLocal = getHeader(map, "PLCN_currLocal");
	cuCodeAccWithInst = getHeader(map, "PLCN_cuCodeAccWithInst");
	logger.info("ddCstmrNoncstmrInstrcn: cuCodeAccWithInst = " + cuCodeAccWithInst);
	directionCheck = getHeader(map, "PLCN_directionChk");
	instCntryCode =  institutionId + ".PAYMT_SWIFT.GEN_PARAMS.INSTITUTION_DETAILS.LOCAL_COUNTRY_CODE";     

	instCntryCode = memTblGetTableValue(map, "INST_PARAM", instCntryCode);
	logger.info("ddCstmrNoncstmrInstrcn: instCntryCode = " + instCntryCode);

	if(currencyLocal == "Y"){

		if(directionCheck == "OUTBOUND"){
			if(instCntryCode == cuCodeAccWithInst){
				setHeader(map, "PLCN_localPay", "Y");
			}else{
				setHeader(map, "PLCN_localPay", "N");
			}
		}
	}
}

//This function derives value of clStartTime
//value is derived from header so no need of this function
function retrieveReleasetimeInst(map) {
	var releaseTime;

	logger.info("In retrieveReleasetimeInst");

 	releaseTime = getHeader(map, "PLCN_clStartTime");
 	logger.info("retrieveReleasetimeInst: releaseTime = " + releaseTime);

 	return releaseTime;
}

function drveNibcClySysDetails(map){
 	var clrgId;
 	var holiday;
 	var clrgIdCutoffFlag;
 	var clrgIdStatus;
 	var mode;
 	var msgType;
 	var msgPriority;
 	var currency;
 	var msgDirection;
 	var currencyList;
 	var clrgIdReleaseFlag;
 	var msgFamily;
 	var clgSys;
 	var comments;
 	var comments1;
 	var comments2;
 	var msgScheme;

 	logger.info("In drveNibcClySysDetails");

 	clrgId = getHeader(map, "PLCN_clearingId");
 	comments = getHeader(map, "PLCN_txnComments");
 	//comments2 = getHeader(map, "PLCN_commentsSetDb");
 	//comments1 = commentsForBlob6;
 	currency = getHeader(map, "PLCN_msgCurrency");

 	/*if(comments == ""){
 		comments = comments1;
 	}*/

 	if(clrgId == ""){
 		clrgId = getHeader(map, "PLCN_clrgIdSet");
 	}

 	if(clrgId && comments != 9505 /*&& comments1 != 9505 && comments2 != 9505*/ && clrgId != "DEFAULT_CLEARING" && clrgId == currency){
 		setHeader(map, "PLCN_clrgIdSet", clrgId);
 		return clrgId;
 	}

 	clrgIdStatus = getHeader(map, "PLCN_cutoffTime");
 	
 	currencyList = memTblGetTableValue(map, "TABLEDETAILS_CURR", currency);
 	logger.info("drveNibcClySysDetails: currencyList = " + currencyList);

 	if(!currency){
 		currency = getHeader(map, "PLCN_currency");
 	}

 	mode = getHeader(map, "PLCN_manualMode");
 	if(!mode){
 		mode = getHeader(map, "PLCN_msgModeIn");
 	}

 	if(!mode){
 		mode = getHeader(map, "PLCN_QM");
 	}

 	msgType = getHeader(map, "PLCN_msgType");

 	msgDirection = getHeader(map, "PLCN_msgDirection");

 	msgPriority = getHeader(map, "PLCN_msgPriority");
 	if(msgDirection == "O"){
 		if(currencyList == currency){
 			clrgId = currency.concat("_IN");
 		}else{
 			clrgId = "";
 		}
 		if(isPatternPresent(msgType, "PACS.008") || isPatternPresent(msgType, "pacs.008")){
 			clrgId = "TARGET2_IN";
 		}
 		clrgIdReleaseFlag = "NO";
 	}

 	if((isPatternPresent(msgType, "PACS.008") || isPatternPresent(msgType, "pacs.008")) && (msgDirection == "I")){
 		clrgId = "TARGET2_STD";
 		clrgIdReleaseFlag = "NO";
 	}

 	/*if((isPatternPresent(msgType, "CAMT.029") || isPatternPresent(msgType, "camt.029")) && (msgDirection == "I")){
 		clrgId = "TARGET2";
 		clrgIdReleaseFlag = "NO";
 	}

 	if((isPatternPresent(msgType, "CAMT.056") || isPatternPresent(msgType, "camt.056")) && (msgDirection == "I")){
 		clrgId = "TARGET2";
 		clrgIdReleaseFlag = "NO";
 	}*/

 	if((isPatternPresent(msgType, "PACS.004") || isPatternPresent(msgType, "pacs.004")) && (msgDirection == "I")){
 		clrgId = "TARGET2";
 		clrgIdReleaseFlag = "NO";
 	}

 	if(mode == "REPAIR" || mode == "MANUAL" || mode == "UPLOAD" || mode == "MQ" || mode == "FILE"){
 		msgFamily = getHeader(map, "PLCN_msgFamily");
 		/*if(msgDirection == "I" && "101|103|103+|202|210" == msgType){
 			if(comments == "9505" || comments1 == "9505" || comments2 == "9505"){
 				clrgId = "Outbound_SWIFT_".concat("TARGET2");
 				clrgIdReleaseFlag = "NO";
 			}else{
 				clrgId = "Outbound_SWIFT_".concat(currency);
 				clrgIdReleaseFlag = "NO";
 			}
 		}else{
 			if(msgType == "103"){
 				clrgId = currency.concat("_URG");
 				clrgIdReleaseFlag = "YES";
 			}
 			if(msgType == "202"){
 				if(msgPriority == "U"){
 					clrgId = currency.concat("_URG");
 					clrgIdReleaseFlag = "YES";
 				}
 				if(msgPriority == "N"){
 					clrgId = currency.concat("_STD");
 					clrgIdReleaseFlag = "NO";
 				}
 			}*/

 			if((msgType == "PACS.008" || msgType == "pacs.008") && msgDirection == "I"){
 				clrgId = "TARGET2";
 				clrgIdReleaseFlag = "NO";
 			}

 			if(!clrgId){
 				clrgId = getHeader(map, "PLCN_clrgIdSet");
 			}
 		//}	
 	}

 	msgScheme = memTblGetTableValue(map, "StreamTable", "MSG_SCHEME");

 	/*if(msgScheme == "INST" && msgType != "101|103|103+|202|210"){
 		clrgId = "TARGET2_INSTA";
 		clrgIdReleaseFlag = "NO";
 	}*/

 	if((currency != "AUD|CAD|CHF|CZK|DKK|GBP|HUF|JPY|NOK|NZD|PLN|SAR|SEK|USD|ZAR|HKD|SGD|RON|TRY|EUR" && clrgId != "Outbound_SWIFT_TARGET2") || clrgIdStatus == "clearingId_NOT_FOUND"){
 		clrgId = "Outbound_SWIFT_DEF";
 	}

 	if(clrgId == "" || clrgIdStatus == "clearingId_NOT_FOUND"){
 		clrgId = "DEFAULT_CLEARING";
 	}

 	logger.info("drveNibcClySysDetails: clrgId = " + clrgId);
 	logger.info("drveNibcClySysDetails: clrgIdReleaseFlag = " + clrgIdReleaseFlag);

 	//setHeader(map, "PLCN_clrgIdSet", clrgId);
 	//setHeader(map, "PLCN_clearingId", clrgId);
 	setHeader(map, "PLCN_clrgIdReleaseFlag", clrgIdReleaseFlag);

 	return clrgId;	
}

//needs to be checked
function ruleTarget2DirectoryRoutingMx(map) {
	var msgType;
	var tError;
	var retVal;
	var mode;
	var comments;
	var routeTarget2PaytoSwift;

	logger.info("In ruleTarget2DirectoryRoutingMx");

	tError = memTblGetTableValue(map, "TransTable", "TransErrorFlag");
	
	if(tError = "T") {
		return true;
	} 

	mode = getHeader(map, "PLCN_manualMode");

	if(mode == "REPAIR") {
		comments = getHeader(map, "PLCN_comments");
	}else {
		comments = getHeader(map, "PLCN_CommentsFrmDb");
	}

	msgType = getHeader(map, "PLCN_msgType");
	msgType = msgType.toUppercase();
	retVal = target2DirectoryRoutingApplyMx(map);//TARGET2_DIRECTORY_ROUTING_APPLY_MX(map);
	routeTarget2PaytoSwift = memTblGetTableValue(map, "USER_CONFIG_MAP", "ROUTE_TARGET2_PAY_TO_SWIFT");

	if(((comments == "7778")||(comments == "7915")||(comments == "7858")||(comments == "7862")) && (routeTarget2PaytoSwift == "YES")) {
		target2InfoTgtMx();
	}

	return retVal;
}

function target2InfoTgtMx(Document, map) {
	var comments;
	var block3Path;
	var errorCode;
	var fieldCode;
	var block3;
	var mode;
	var errorCode1;

	logger.info("In target2InfoTgtMx");

	mode = getHeader(map, "PLCN_QM");

	if(mode == "REPAIR") {
		comments = getHeader(map, "PLCN_comments");
	}else {
		comments = getHeader(map, "PLCN_CommentsFrmDb");
	}

	fieldCode = getHeader(map, "PLCN_fld");

	if(!fieldCode) {
		fieldCode = "00";
	}

	if(isPatternPresent(comments, "7915") || isPatternPresent(comments, "7862") || isPatternPresent(comments, "7858") || isPatternPresent(comments, "7778")) {
		errorCode = "6876";
		//setEnhcrViolation(fieldCode, errorCode);
		//commentsForBlob6 = fillViolation();
		setHeader(map, "PLCN_schedulingReq", true);
		commentsForBlob6 = setCommentsForTransaction(fieldCode, errorCode, map);
		setHeader(map, "PLCN_TGT_FLAG1", "Y");
		block3Path = "/Document/FIToFICstmrCdtTrf/GrpHdr/SttlmInf/ClrSys/Cd";
		block3 = getValueFromPath(block3Path);
	}

	if(block3 == "TGT" && isPatternPresent(errorCode, "6876")) {
		errorCode1 = "6906";
		//setEnhcrViolation (fieldCode, errorCode1);
		//commentsForBlob6 = fillViolation();
		setHeader(map, "PLCN_schedulingReq", true);
		commentsForBlob6 = setCommentsForTransaction(fieldCode, errorCode1, map);
	}

	setHeader(map, "PLCN_comments", commentsForBlob6);
}

function chkCutoffTimeInstrctn(currency, f57, msgDirection, map) {
	var clgSys;
	var cutoffTime;
	var currTime;
	var institutionId;
	var clrgIdCutoffFlag;
	var clrgIdStatus;
	var mode;
	var msgType;
	var msgPriority;
	var bic1;

	logger.info("In chkCutoffTimeInstrctn");
	
	//bic1 = GetBICPresent(f57);
	xtF57CntryCodeInstrcn(f57, map);
	ddCstmrNoncstmrInstrcn(map);

	institutionId = getHeader(map, "PLCN_institutionId");
	clrgIdCutoffFlag = memTblGetTableValue(map, "FLAG-TABLE", "CLRG_ID_CUTOFF_REQD");
	clrgIdCutoffFlag = clrgIdCutoffFlag.trim();

	if(clrgIdCutoffFlag == "Y") {
		clgSys = getHeader(map, "PLCN_clearingId");
		mode = getHeader(map, "PLCN_msgModeIn");

		msgType = getHeader(map, "PLCN_msgType");

		msgPriority = getHeader(map, "PLCN_msgPriority");

		if(msgDirection == 'O') {
			clgSys = drveNibcClySysDetails(map);
		}

		if(!clgSys || clrgIdStatus == "CLEARINGID_NOT_FOUND") {
			clgSys = "DEFAULT_CLEARING";
		}else {
			clgSys = ddClrgInstParmInstrcn(map);
		}
	}

	//cutoffTime = getHeader(map, "PLCN_CL_cutoffTime");
	cutoffTime = getHeader(map, "PLCN_cutoffTime");
	logger.info("chkCutoffTimeInstrctn: cutoffTime = " + cutoffTime);

	return cutoffTime;
}

function ddClrgInstParmInstrcn(map) {
	var institutionId;
	var currencyLocal;
	var currency;
	var localPay;
	var localOutPay;
	var directionCheck;
	var customerFlag;
	var currBsdClrgIdLookupOb;
	var lclObNonCustmrLclPay;
	var lclObNonCustmrOthPay;
	var fcyObCurrBsdClrgId;
	var fcyObNonCurrBsdDefClrgId;
	var clrgIdDerived;
	var comments;
	var releaseTime;
	var releaseDate;
	var releaseDateTime;
	var valueDate;

	logger.info("In ddClrgInstParmInstrcn");

	institutionId = getHeader(map, "PLCN_institutionId");
	currency = getHeader(map, "PLCN_msgCurrency");
	currencyLocal = getHeader(map, "PLCN_currLocal");
	directionCheck = getHeader(map, "PLCN_directionChk");
	customerFlag = getHeader(map, "PLCN_customerFlag");
	localPay = getHeader(map, "PLCN_localPay");
	valueDate = getHeader(map, "PLCN_valueDate");

	logger.info("ddClrgInstParmInstrcn: currencyLocal = " + currencyLocal);
	logger.info("ddClrgInstParmInstrcn: directionCheck = " + directionCheck);
	logger.info("ddClrgInstParmInstrcn: localPay = " + localPay);
	logger.info("ddClrgInstParmInstrcn: valueDate = " + valueDate);

	if(currencyLocal == 'Y') {

		if(directionCheck == 'OUTBOUND') {

			if(localPay == 'Y') {
				lclObNonCustmrLclPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.VALUE-DATE-CHECK.FOR-LOCAL-CURRENCY.CLEARING-ID.OUTBOUND.LOCAL_PAY");
				lclObNonCustmrLclPay = memTblGetTableValue(map, "INST_PARAM", lclObNonCustmrLclPay);
				logger.info("ddClrgInstParmInstrcn: lclObNonCustmrLclPay = " + lclObNonCustmrLclPay);
				clrgIdDerived = "Y";
				setHeader(map, "PLCN_custom8", lclObNonCustmrLclPay);
				releaseTime = retrieveReleasetimeInst(map);
				releaseTime = lPadChar(releaseTime, 6, "0");
				releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
				releaseDate = ((((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)))).concat("/")).concat(releaseDate.substr(5, 4));
				releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
				//setHeader(map, "PLCN_custom24", releaseDateTime);
				setCustom24(map, releaseDate, releaseTime);
				return lclObNonCustmrLclPay;
			}else {
				lclObNonCustmrOthPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.VALUE-DATE-CHECK.FOR-LOCAL-CURRENCY.CLEARING-ID.OUTBOUND.OTHER_PAY");
				lclObNonCustmrOthPay = memTblGetTableValue(map, "INST_PARAM", lclObNonCustmrOthPay);
				clrgIdDerived = "Y";
				setHeader(map, "PLCN_custom8", lclObNonCustmrOthPay);
				releaseTime = retrieveReleasetimeInst(map);
				releaseTime = lPadChar(releaseTime, 6, "0");
				releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
				releaseDate = ((((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)))).concat("/")).concat(releaseDate.substr(5, 4));
				releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
				//setHeader(map, "PLCN_custom24", releaseDateTime);
				setCustom24(map, releaseDate, releaseTime);
				return lclObNonCustmrOthPay;				
			}
		}
	}

	if(currencyLocal != 'Y') {

		if(directionCheck == 'OUTBOUND') {
			currBsdClrgIdLookupOb = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.VALUE-DATE-CHECK.FOR-FOREIGN-CURRENCY.CLEARING-ID.OUTBOUND.CURRENCY_BASED_CLEARING_ID_LOOKUP");
			currBsdClrgIdLookupOb = memTblGetTableValue(map, "INST_PARAM", currBsdClrgIdLookupOb);

			if(currBsdClrgIdLookupOb == 'Y') {
				fcyObCurrBsdClrgId = ddCurrClrgIdInstrctn(currency, map);
				clrgIdDerived = "Y";
				setHeader(map, "PLCN_custom8", fcyObCurrBsdClrgId)
				releaseTime = retrieveReleasetimeInst(map);
				releaseTime = lPadChar(releaseTime, 6, "0");
				releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
				releaseDate = ((((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)))).concat("/")).concat(releaseDate.substr(5, 4));
				releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
				//setHeader(map, "PLCN_custom24", releaseDateTime);
				setCustom24(map, releaseDate, releaseTime);
				return fcyObCurrBsdClrgId;
			}else {
				fcyObNonCurrBsdDefClrgId = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.VALUE-DATE-CHECK.FOR-FOREIGN-CURRENCY.CLEARING-ID.OUTBOUND.NON_CURRENCY_BASED_DEFAULT-CLEARING-ID");
				fcyObNonCurrBsdDefClrgId = memTblGetTableValue(map, "INST_PARAM", fcyObNonCurrBsdDefClrgId);
				clrgIdDerived = "Y";
				setHeader(map, "PLCN_custom8", fcyObNonCurrBsdDefClrgId)
				releaseTime = retrieveReleasetimeInst(map);
				releaseTime = lPadChar(releaseTime, 6, "0");
				releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
				releaseDate = ((((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)))).concat("/")).concat(releaseDate.substr(5, 4));
				releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
				//setHeader(map, "PLCN_custom24", releaseDateTime);
				setCustom24(map, releaseDate, releaseTime);
				return fcyObNonCurrBsdDefClrgId;
			}

		}
	}

	if(clrgIdDerived =='N') {
		//setEnhcrViolation("00", "7369");
		//comments = fillViolation();
		comments = setCommentsForTransaction("00", "7369", map);
		setHeader(map, "PLCN_commentsForBlob6", comments);
	}
}

//This function checks if the message date is a holiday for the message currency
function vdHolidayInstrcn(currency, valueDate, fld, vioCode2, map) {
	var holiday;
	var tempDate;
	var temp1Date;
	var thuFlag;
	var friFlag;
	var satFlag;
	var sunFlag;
	var dayTag;
	var temp2;
	var comments;
	var actualValDate;
	var holidayActVaDate;
	var actValDay;
	var actualValDateCnvrt;
	var holidayFlag;

	logger.info("In vdHolidayInstrcn");

	currency = getHeader(map, "PLCN_clearingId");

	logger.info("vdHolidayInstrcn: currency = " + currency);
	logger.info("vdHolidayInstrcn: valueDate = " + valueDate);

	var pastValueDateFlag = getHeader(map, "PLCN_pastValueDateFlag");
	logger.info("vdHolidayInstrcn: pastValueDateFlag = " + pastValueDateFlag);

	if(pastValueDateFlag == 'Y') {
		tempDate = getDate(); //20210902
	}else if(pastValueDateFlag == 'N') {
		tempDate = valueDate;
	}
	
	logger.info("vdHolidayInstrcn: tempDate = " + tempDate);

	actualValDate = getHeader(map, "PLCN_valueDate2");
	logger.info("vdHolidayInstrcn: actualValDate = " + actualValDate);

	holiday = checkHoliday(currency, tempDate, map);
	logger.info("vdHolidayInstrcn: holiday from checkHoliday = " + holiday);

	if(holiday === null) {
		logger.info("vdHolidayInstrcn: holiday is empty");
		holiday = checkHolidayInstrcn(currency, tempDate, map);
	}

	if(holiday > 0) {
		logger.info("vdHolidayInstrcn: holiday > 0");
		holidayFlag = "Y";
		setHeader(map, "PLCN_holidayFlag", holidayFlag);
		logger.info("vdHolidayInstrcn: holidayFlag = Y");

		logger.info("vdHolidayInstrcn: actualValDate = " + actualValDate);
		logger.info("vdHolidayInstrcn: tempDate = " + tempDate);

		if(actualValDate == tempDate) {
			//setEnhcrViolation(fld, vioCode2)
			//commentsForBlob6 = fillViolation();
			setHeader(map, "PLCN_schedulingReq", true);
			commentsForBlob6 = setCommentsForTransaction(fld, vioCode2, map);
			//ruleCombineViolations(map);
		}

		if(actualValDate != tempDate) {
			holidayActVaDate = checkHolidayInstrcn(currency, actualValDate, map);
			logger.info("vdHolidayInstrcn: holidayActVaDate = " + holidayActVaDate);

			actualValDateCnvrt = convertDateFormat(actualValDate, "CCYYMMDD", "DDMMCCYY");
			var tmpDateW = convertDateFormat(actualValDate, "CCYYMMDD", "MMDDCCYY");
			
			actValDay = getWeekday(tmpDateW);
			logger.info("vdHolidayInstrcn: actValDay = " + actValDay);

			if(holidayActVaDate == 0) {
				if((actValDay == "Thursday" && getHeader(map, "PLCN_clThursday") == "Y") || (actValDay == "Friday" && getHeader(map, "PLCN_clFriday") == "Y") || (actValDay == "Saturday" && getHeader(map, "PLCN_clSaturday") == "Y") || (actValDay == "Sunday" && getHeader(map, "PLCN_clSunday") == "Y")) {
					holidayActVaDate = 1;
					logger.info("vdHolidayInstrcn: holidayActVaDate = " + holidayActVaDate);
				}
			}

			if(holidayActVaDate > 0) {
				//setEnhcrViolation(fld, vioCode2)
				//commentsForBlob6 = fillViolation();
				setHeader(map, "PLCN_schedulingReq", true);
				commentsForBlob6 = setCommentsForTransaction(fld, vioCode2, map);
				//ruleCombineViolations(map);
			}
		}
	}

	holidayFlag = getHeader(map, "PLCN_holidayFlag");
	logger.info("vdHolidayInstrcn: holidayFlag = " + holidayFlag);

	if(holidayFlag != 'Y') {
		thuFlag = checkDayFlagInstrcn(currency, "Thursday", map);
		friFlag = checkDayFlagInstrcn(currency, "Friday", map);
		satFlag = checkDayFlagInstrcn(currency, "Saturday", map);
		sunFlag = checkDayFlagInstrcn(currency, "Sunday", map);
		temp1Date = convertDateFormat(tempDate, "CCYYMMDD", "DDMMCCYY");
		var tmpDateW = convertDateFormat(tempDate, "CCYYMMDD", "MMDDCCYY");
		dayTag = getWeekday(tmpDateW);

		logger.info("vdHolidayInstrcn: thuFlag = " + thuFlag);
		logger.info("vdHolidayInstrcn: friFlag = " + friFlag);
		logger.info("vdHolidayInstrcn: satFlag = " + satFlag);
		logger.info("vdHolidayInstrcn: sunFlag = " + sunFlag);
		logger.info("vdHolidayInstrcn: dayTag = " + dayTag);

		if((dayTag == "Thursday" && thuFlag == 'Y') || (dayTag == "Friday" && friFlag == 'Y') || (dayTag == "Saturday" && satFlag == 'Y') || (dayTag == "Sunday" && sunFlag == 'Y')) {
			holidayFlag = "Y";
			setHeader(map, "PLCN_holidayFlag", holidayFlag);
			logger.info("vdHolidayInstrcn: holidayFlag = " + holidayFlag);

			logger.info("vdHolidayInstrcn: actualValDate = " + actualValDate);
			logger.info("vdHolidayInstrcn: tempDate = " + tempDate);

			if(actualValDate == tempDate) {
				//setEnhcrViolation(fld, vioCode2);
				//commentsForBlob6 = fillViolation();
				setHeader(map, "PLCN_schedulingReq", true);
				commentsForBlob6 = setCommentsForTransaction(fld, vioCode2, map);
				//ruleCombineViolations(map);
			}
		}
	}
}

function ddBusinessDate(reqdColltnDate, sign, qual, noOfDays, map) {
	var x;
	var d;
	var signNoOfDays;
	var calculatedNextDate;
	var holiday;
	var currency;
	var holidayFlag;
	var thuFlag;
	var friFlag;
	var satFlag;
	var sunFlag;
	var dayTag;
	var x1 = 0;
	var x2;
	var hldyNoOfDays;
	var signNoOfDaysNxt;
	var actualPath;
	var fromValidateNode;
	var msgType;

	logger.info("In ddBusinessDate");

	msgType = getHeader(map, "PLCN_msgType");

	logger.info("ddBusinessDate: reqdColltnDate = " + reqdColltnDate);
	logger.info("ddBusinessDate: sign = " + sign);
	logger.info("ddBusinessDate: qual = " + qual);
	logger.info("ddBusinessDate: noOfDays = " + noOfDays);

	currency = getHeader(map, "PLCN_clearingId");
	logger.info("ddBusinessDate: currency = " + currency);

	holiday = checkHoliday(currency, reqdColltnDate, map);
	logger.info("ddBusinessDate: holiday = " + holiday);
	logger.info("ddBusinessDate: typeof holiday = " + typeof holiday);

	/*if(holiday > 0) { //WIP
		x1 = 1;
	}else {*/
		x1 = 0;
	//}

	if(qual == "BD") {
		x = 1;
		d = reqdColltnDate;
		hldyNoOfDays = 0;

		logger.info("ddBusinessDate: d = " + d);
		logger.info("ddBusinessDate: x = " + x); //1
		logger.info("ddBusinessDate: noOfDays = " + noOfDays); //1
		logger.info("ddBusinessDate: typeof noOfDays = " + typeof noOfDays); //1
		logger.info("ddBusinessDate: x1 = " + x1);
		logger.info("ddBusinessDate: hldyNoOfDays = " + hldyNoOfDays);		

		while(x <= noOfDays || x1 == hldyNoOfDays) {

			logger.info("ddBusinessDate: x = " + x); //1
			logger.info("ddBusinessDate: noOfDays = " + noOfDays); //1
			logger.info("ddBusinessDate: x1 = " + x1);
			logger.info("ddBusinessDate: hldyNoOfDays = " + hldyNoOfDays);
				
			logger.info("ddBusinessDate: sign = " + sign);

			if(isPatternPresent(sign, "-")) {
				signNoOfDays = sign.concat(x.toString());
				logger.info("ddBusinessDate: signNoOfDays = " + signNoOfDays);
			}/*else{
				signNoOfDays = x;
				logger.info("ddBusinessDate: signNoOfDays in else = " + signNoOfDays);
			}*/

			if(x1 == 1 && hldyNoOfDays == 1) {
				logger.info("ddBusinessDate: x1 = 1");
				hldyNoOfDays = "-".concat(x1.toString());
				logger.info("ddBusinessDate: hldyNoOfDays = " + hldyNoOfDays);
				calculatedNextDate = getDateFromNumOfDays(d, hldyNoOfDays);
			}else {

				if(x2 == 1) {
					logger.info("ddBusinessDate: x2 = 1");
					signNoOfDaysNxt = "-".concat(x2.toString());
					logger.info("ddBusinessDate: signNoOfDaysNxt = " + signNoOfDaysNxt);
					calculatedNextDate = getDateFromNumOfDays(d, signNoOfDaysNxt);
				}else {
					logger.info("ddBusinessDate: x1 != 1 & x2 != 1");
					logger.info("ddBusinessDate: hldyNoOfDays = " + hldyNoOfDays);
					logger.info("ddBusinessDate: signNoOfDays = " + signNoOfDays);

					/*if(parseInt(hldyNoOfDays) > 0) {
						calculatedNextDate = getDateFromNumOfDays(d, hldyNoOfDays); //WIP OFFSET	
					}else if(parseInt(signNoOfDays) > 0) {*/
						calculatedNextDate = getDateFromNumOfDays(d, signNoOfDays);	
					//}
					
				}
			}

			logger.info("ddBusinessDate: calculatedNextDate = " + calculatedNextDate);

			holiday = checkHoliday(currency, calculatedNextDate, map);
			logger.info("ddBusinessDate: holiday = " + holiday);

			if(holiday > 0) {
				holidayFlag = 'Y';
			}else {
				holidayFlag = 'N';
			}

			logger.info("ddBusinessDate: holidayFlag = " + holidayFlag);

			if(holidayFlag == 'N') {
				thuFlag = checkDayFlag(currency, "Thursday", map);
				friFlag = checkDayFlag(currency, "Friday", map);
				satFlag = checkDayFlag(currency, "Saturday", map);
				sunFlag = checkDayFlag(currency, "Sunday", map);

				//calculatedNextDate = convertDateFormat(calculatedNextDate, "CCYYMMDD", "DDMMCCYY");
				var tmpDateW = convertDateFormat(calculatedNextDate, "CCYYMMDD", "MMDDCCYY");
				logger.info("ddBusinessDate: tmpDateW = " + tmpDateW);
				dayTag = getWeekday(tmpDateW);

				logger.info("ddBusinessDate: dayTag = " + dayTag);
				logger.info("ddBusinessDate: thuFlag = " + thuFlag);
				logger.info("ddBusinessDate: friFlag = " + friFlag);
				logger.info("ddBusinessDate: satFlag = " + satFlag);
				logger.info("ddBusinessDate: sunFlag = " + sunFlag);

				if((dayTag == "Thursday" && thuFlag == 'Y') || (dayTag == "Friday" && friFlag == 'Y') || (dayTag == "Saturday" && satFlag == 'Y') || (dayTag == "Sunday" && sunFlag == 'Y')) {
					holidayFlag = "Y";
				}

				//calculatedNextDate = convertDateFormat(calculatedNextDate, "DDMMCCYY", "CCYYMMDD");
				logger.info("ddBusinessDate: calculatedNextDate = " + calculatedNextDate);
			}

			if(holidayFlag == 'N') {
				x++;
				x1 = 0;
				x2 = 1;
				hldyNoOfDays = -1;
				d = calculatedNextDate;
			}

			if(holidayFlag == 'Y') {
				d = calculatedNextDate;
				x1 = 1;
				hldyNoOfDays = 1;
			}
		}
	}

	return calculatedNextDate;
}

function ddBusinessDate1(reqdColltnDate, sign, qual, noOfDays, map) {
	var x;
	var d;
	var signNoOfDays;
	var calculatedNextDate;
	var holiday;
	var currency;
	var holidayFlag;
	var thuFlag;
	var friFlag;
	var satFlag;
	var sunFlag;
	var dayTag;
	var x1 = 0;
	var x2;
	var hldyNoOfDays;
	var signNoOfDaysNxt;
	var actualPath;
	var fromValidateNode;
	var msgType;

	logger.info("In ddBusinessDate1");

	msgType = getHeader(map, "PLCN_msgType");

	currency = getHeader(map, "PLCN_clearingId");
	logger.info("ddBusinessDate1: currency = " + currency);

	holiday = checkHoliday(currency, reqdColltnDate, map);
	logger.info("ddBusinessDate1: holiday = " + holiday);
	logger.info("ddBusinessDate1: typeof holiday = " + typeof holiday);

	if(holiday > 0) { //WIP
		x1 = 1;
	}else {
		x1 = 0;
	}

	if(qual == "BD") {
		x = 1;
		d = reqdColltnDate;
		hldyNoOfDays = 0;

		logger.info("ddBusinessDate1: d = " + d);
		logger.info("ddBusinessDate1: x = " + x); //1
		logger.info("ddBusinessDate1: noOfDays = " + noOfDays); //1
		logger.info("ddBusinessDate1: typeof noOfDays = " + typeof noOfDays);
		logger.info("ddBusinessDate1: x1 = " + x1);
		logger.info("ddBusinessDate1: hldyNoOfDays = " + hldyNoOfDays);

		while(x <= noOfDays || x1 == hldyNoOfDays) {

			logger.info("ddBusinessDate1: x = " + x); //1
			logger.info("ddBusinessDate1: noOfDays = " + noOfDays); //1
			logger.info("ddBusinessDate1: x1 = " + x1);
			logger.info("ddBusinessDate1: hldyNoOfDays = " + hldyNoOfDays);

			logger.info("ddBusinessDate1: sign = " + sign);

			if(isPatternPresent(sign, "[+]")) {
				signNoOfDays = sign.concat(x.toString());
				logger.info("ddBusinessDate1: signNoOfDays = " + signNoOfDays);
			}

			if(x1 == 1 && hldyNoOfDays == 1) {
				logger.info("ddBusinessDate1: x1 = 1");
				hldyNoOfDays = "+".concat(x1.toString());
				logger.info("ddBusinessDate1: hldyNoOfDays = " + hldyNoOfDays);
				calculatedNextDate = getDateFromNumOfDays(d, hldyNoOfDays);
			}else {
				if(x2 == 1) {
					logger.info("ddBusinessDate1: x2 = 1");
					signNoOfDaysNxt = "+".concat(x2.toString());
					logger.info("ddBusinessDate1: signNoOfDaysNxt = " + signNoOfDaysNxt);
					calculatedNextDate = getDateFromNumOfDays(d, signNoOfDaysNxt);
				}else {
					logger.info("ddBusinessDate1: x1 != 1 & x2 != 1");
					logger.info("ddBusinessDate1: signNoOfDays = " + signNoOfDays);
					calculatedNextDate = getDateFromNumOfDays(d, signNoOfDays);
				}
			}

			logger.info("ddBusinessDate1: calculatedNextDate = " + calculatedNextDate);

			holiday = checkHoliday(currency, calculatedNextDate, map);
			logger.info("ddBusinessDate1: holiday = " + holiday);

			if(holiday > 0) {
				holidayFlag = 'Y';
			}else {
				holidayFlag = 'N';
			}

			logger.info("ddBusinessDate1: holidayFlag = " + holidayFlag);

			if(holidayFlag == 'N') {
				thuFlag = checkDayFlag(currency, "Thursday", map);
				friFlag = checkDayFlag(currency, "Friday", map);
				satFlag = checkDayFlag(currency, "Saturday", map);
				sunFlag = checkDayFlag(currency, "Sunday", map);

				//calculatedNextDate = convertDateFormat(calculatedNextDate, "CCYYMMDD", "DDMMCCYY" );
				var tmpDateW = convertDateFormat(calculatedNextDate, "CCYYMMDD", "MMDDCCYY");
				logger.info("ddBusinessDate1: tmpDateW = " + tmpDateW);
				dayTag = getWeekday(tmpDateW);

				logger.info("ddBusinessDate1: dayTag = " + dayTag);
				logger.info("ddBusinessDate1: thuFlag = " + thuFlag);
				logger.info("ddBusinessDate1: friFlag = " + friFlag);
				logger.info("ddBusinessDate1: satFlag = " + satFlag);
				logger.info("ddBusinessDate1: sunFlag = " + sunFlag);

				if((dayTag == "Thursday" && thuFlag == 'Y') || (dayTag == "Friday" && friFlag == 'Y') || (dayTag == "Saturday" && satFlag == 'Y') || (dayTag == "Sunday" && sunFlag == 'Y')) {
					holidayFlag = "Y";
					logger.info("ddBusinessDate1: holidayFlag = " + holidayFlag);
				}

				//calculatedNextDate = convertDateFormat(calculatedNextDate, "DDMMCCYY", "CCYYMMDD");
				logger.info("ddBusinessDate1: calculatedNextDate = " + calculatedNextDate);
			}

			logger.info("ddBusinessDate1: holidayFlag = " + holidayFlag);

			if(holidayFlag == 'N') {
				x++;
				x1 = 0;
				x2 = 1;
				hldyNoOfDays = -1;
				d = calculatedNextDate;
			}

			if(holidayFlag == 'Y') {
				d = calculatedNextDate;
				x1 = 1;
				hldyNoOfDays = 1;
			}	
		}
	}

	return calculatedNextDate;
}

function checkHoliday(currency, date, map) {
	var clgSys;
	var holiday;
	var clearingID;
	var holidayCheck;
	var tempDate;
	var temp2;
	var temp3;

	logger.info("In checkHoliday");

	tempDate = date;
	logger.info("checkHoliday: tempDate = " + tempDate);
	logger.info("checkHoliday: currency = " + currency);

	currency = getHeader(map, "PLCN_clearingId");
	logger.info("checkHoliday: currency from PLCN_clearingId = " + currency);	

	//if(tempDate) { WIP
		var ccyy = tempDate.substring(0, 4);
		var mm = tempDate.substring(4, 6);
		var dd = tempDate.substring(6, 8);
	//}

	tempDate = [ccyy, mm, dd].join('-');

	logger.info("checkHoliday: tempDate = " + tempDate);

	var institutionId = getHeader(map, "PLCN_institutionId")
	logger.info("checkHoliday: institutionId = " + institutionId);

	temp2 = institutionId.concat("_");
	temp2 = ((((temp2.concat(currency)).concat("_"))).concat(tempDate)).concat(" 00:00:00.0");
	logger.info("checkHoliday: temp2 = " + temp2); //NIBCNLNV_EUR_20211127
	holiday = memTblGetTableValue(map, "CHL_HOLIDAY", temp2);
	logger.info("checkHoliday: holiday = " + holiday);

	//clearingID = getHeader(map, "PLCN_clearingId");
	//holidayCheck = clearingID + " " + date;

	//holiday = memTblGetTableValue(map, "CHL_HOLIDAY", holidayCheck);

	if(!holiday) {
		var parentInstitutionId = memTblGetTableValue(map, "INST_HIERARCHY", institutionId);
		logger.info("checkHoliday: parent parentInstitutionId = " + parentInstitutionId);

		temp3 = parentInstitutionId.concat("_");
		temp3 = ((((temp3.concat(currency)).concat("_"))).concat(tempDate)).concat(" 00:00:00.0");
		logger.info("checkHoliday: temp3 = " + temp3); //NIBCNLNV_EUR_20211127
		holiday = memTblGetTableValue(map, "CHL_HOLIDAY", temp3);
		logger.info("checkHoliday: holiday = " + holiday);

		if(!holiday) {
			return 0;
		}else {
			return 1;
		}		
	}else {
		return 1;
	}
}

function ddClrgIdInstParamPath(map) {
	var institutionId;
	var currencyLocal;
	var localPay;
	var localOutPay;
	var directionCheck;
	var customerFlag;
	var currBsdClrgIdLookupOb;
	var currBsdClrgIDLookupOnw;
	var lclIbCustmrPay;
	var lclIbNonCustmrLclPay;
	var lclIbNonCustmrOthPay;
	var lclObNonCustmrLclPay;
	var lclObNonCustmrOthPay;
	var lclOnwNonCustmrLclPay;
	var lclOnwNonCustmrOthPay;
	var fcyIbCustmrPay;
	var fcyIbNonCustmrLclPay;
	var fcyIbNonCustmrOthPay;
	var fcyObCurrBsdClrgId;
	var fcyObNonCurrBsdDefClrgId;
	var fcyOnwCurrBsdClrgId;
	var fcyOnwNonCurrBsdDefClrgId;
	var clrgIdDerived;
	var comments;
	var releaseTime;
	var releaseDate;
	var releaseDateTime;
	var valueDate;
	var jerseyTransaction;
	var clrgId;

	logger.info("In ddClrgIdInstParamPath");
	
	institutionId = getHeader(map, "PLCN_institutionId");
	currencyLocal = getHeader(map, "PLCN_currLocal");
	directionCheck = getHeader(map, "PLCN_directionChk");
	customerFlag = getHeader(map, "PLCN_customerFlag");
	localPay = getHeader(map, "PLCN_localPay");
	localOutPay = getHeader(map, "PLCN_LOCAL_ONWD_PAY");
	valueDate = getHeader(map, "PLCN_valueDate");
	jerseyTransaction = getHeader(map, "PLCN_jerseyTransaction");

	logger.info("ddClrgIdInstParamPath: institutionId = " + institutionId);
	logger.info("ddClrgIdInstParamPath: currencyLocal = " + currencyLocal);
	logger.info("ddClrgIdInstParamPath: directionCheck = " + directionCheck);
	logger.info("ddClrgIdInstParamPath: customerFlag = " + customerFlag);
	logger.info("ddClrgIdInstParamPath: localPay = " + localPay);
	logger.info("ddClrgIdInstParamPath: localOutPay = " + localOutPay);
	logger.info("ddClrgIdInstParamPath: valueDate = " + valueDate);
	logger.info("ddClrgIdInstParamPath: jerseyTransaction = " + jerseyTransaction);

	if(jerseyTransaction =='Y') {
		clrgId = deriveClrgIdForJerseyAccount(currencyLocal, directionCheck);
		return clrgId;
	}

	if(currencyLocal == 'Y') {

		if(directionCheck == 'INBOUND') {

			if(customerFlag == 'Y') {
				lclIbCustmrPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.value-date-CHECK.FOR-LOCAL-currency.CLEARING-ID.INBOUND.CUSTOMER_PAY");
				lclIbCustmrPay = memTblGetTableValue(map, "INST_PARAM", lclIbCustmrPay);
				clrgIdDerived = "Y";
				setHeader(map, "PLCN_custom8", lclIbCustmrPay);
				releaseTime = retrieveReleasetimeInst(map)
				releaseTime = lPadChar(releaseTime, 6, "0");

				releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
				releaseDate = (((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)).concat("/"))).concat(releaseDate.substr(5, 4));
				releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
				//setHeader(map, "PLCN_custom24", releaseDateTime);
				setCustom24(map, releaseDate, releaseTime);
				return lclIbCustmrPay;
			}else {
				if(localPay == 'Y') {
					lclIbNonCustmrLclPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.value-date-CHECK.FOR-LOCAL-currency.CLEARING-ID.INBOUND.NON_CUSTOMER_LOCAL_PAY");
					lclIbNonCustmrLclPay = memTblGetTableValue(map, "INST_PARAM",  lclIbNonCustmrLclPay);
					clrgIdDerived = "Y";
					setHeader(map, "PLCN_custom8", lclIbNonCustmrLclPay);
					releaseTime = retrieveReleasetimeInst(map)
					releaseTime = lPadChar(releaseTime, 6, "0");

					releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
					releaseDate = (((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)).concat("/"))).concat(releaseDate.substr(5, 4));				
					releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
					//setHeader(map, "PLCN_custom24", releaseDateTime);
					setCustom24(map, releaseDate, releaseTime);
					return lclIbNonCustmrLclPay;
				}
			}
		}

		if(directionCheck == 'OUTBOUND') {

			if(customerFlag == 'Y') {
				lclObNonCustmrLclPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.value-date-CHECK.FOR-LOCAL-currency.CLEARING-ID.OUTBOUND.localPay");
				lclObNonCustmrLclPay = memTblGetTableValue(map, "INST_PARAM",  lclObNonCustmrLclPay);
				clrgIdDerived = "Y";
				setHeader(map, "PLCN_custom8", lclObNonCustmrLclPay);
				releaseTime = retrieveReleasetimeInst(map)
				releaseTime = lPadChar(releaseTime, 6, "0");

				releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
				releaseDate = (((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)).concat("/"))).concat(releaseDate.substr(5, 4));
				releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
				//setHeader(map, "PLCN_custom24", releaseDateTime);
				setCustom24(map, releaseDate, releaseTime);
				return lclObNonCustmrLclPay;
			}else {
				if(localPay == 'Y') {
					lclObNonCustmrOthPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.value-date-CHECK.FOR-LOCAL-currency.CLEARING-ID.INBOUND.NON_CUSTOMER_LOCAL_PAY");
					lclObNonCustmrOthPay = memTblGetTableValue(map, "INST_PARAM",  lclObNonCustmrOthPay);
					clrgIdDerived = "Y";
					setHeader(map, "PLCN_custom8", lclObNonCustmrOthPay);
					releaseTime = retrieveReleasetimeInst(map)
					releaseTime = lPadChar(releaseTime, 6, "0");

					releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
					releaseDate = (((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)).concat("/"))).concat(releaseDate.substr(5, 4));				
					releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
					//setHeader(map, "PLCN_custom24", releaseDateTime);
					setCustom24(map, releaseDate, releaseTime);
					return lclObNonCustmrOthPay;
				}
			}
		}

		if(directionCheck == 'ONWARD') {

			if(localOutPay == 'Y') {
				lclOnwNonCustmrLclPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.value-date-CHECK.FOR-LOCAL-currency.CLEARING-ID.OUTBOUND.localPay");
				lclOnwNonCustmrLclPay = memTblGetTableValue(map, "INST_PARAM",  lclOnwNonCustmrLclPay);
				clrgIdDerived = "Y";
				setHeader(map, "PLCN_custom8", lclOnwNonCustmrLclPay);
				releaseTime = retrieveReleasetimeInst(map)
				releaseTime = lPadChar(releaseTime, 6, "0");

				releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
				releaseDate = (((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)).concat("/"))).concat(releaseDate.substr(5, 4));
				releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
				//setHeader(map, "PLCN_custom24", releaseDateTime);
				setCustom24(map, releaseDate, releaseTime);
				return lclOnwNonCustmrLclPay;
			}else {
				if(localPay == 'Y') {
					lclOnwNonCustmrOthPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.value-date-CHECK.FOR-LOCAL-currency.CLEARING-ID.INBOUND.NON_CUSTOMER_LOCAL_PAY");
					lclOnwNonCustmrOthPay = memTblGetTableValue(map, "INST_PARAM",  lclOnwNonCustmrOthPay);
					clrgIdDerived = "Y";
					setHeader(map, "PLCN_custom8", lclOnwNonCustmrOthPay);
					releaseTime = retrieveReleasetimeInst(map)
					releaseTime = lPadChar(releaseTime, 6, "0");

					releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
					releaseDate = (((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)).concat("/"))).concat(releaseDate.substr(5, 4));				
					releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
					//setHeader(map, "PLCN_custom24", releaseDateTime);
					setCustom24(map, releaseDate, releaseTime);
					return lclOnwNonCustmrOthPay;
				}
			}
		}
	}

	if(currencyLocal != 'Y') {

		if(directionCheck == 'INBOUND') {

			if(customerFlag == 'Y') {
				fcyIbCustmrPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.value-date-CHECK.FOR-FOREIGN-currency.CLEARING-ID.INBOUND.CUSTOMER_PAY");
				fcyIbCustmrPay = memTblGetTableValue(map, "INST_PARAM",  fcyIbCustmrPay);
				clrgIdDerived = "Y";
				setHeader(map, "PLCN_custom8", fcyIbCustmrPay);
				releaseTime = retrieveReleasetimeInst(map)
				releaseTime = lPadChar(releaseTime, 6, "0");

				releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
				releaseDate = (((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)).concat("/"))).concat(releaseDate.substr(5, 4));
				releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
				//setHeader(map, "PLCN_custom24", releaseDateTime);
				setCustom24(map, releaseDate, releaseTime);
				return fcyIbCustmrPay;
			}else {
				if(localPay == 'Y') {
					fcyIbNonCustmrLclPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.value-date-CHECK.FOR-FOREIGN-currency.CLEARING-ID.INBOUND.NON_CUSTOMER_LOCAL_PAY");
					fcyIbNonCustmrLclPay = memTblGetTableValue(map, "INST_PARAM",  fcyIbNonCustmrLclPay);
					clrgIdDerived = "Y";
					setHeader(map, "PLCN_custom8", fcyIbNonCustmrLclPay);
					releaseTime = retrieveReleasetimeInst(map)
					releaseTime = lPadChar(releaseTime, 6, "0");

					releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
					releaseDate = (((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)).concat("/"))).concat(releaseDate.substr(5, 4));				
					releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
					//setHeader(map, "PLCN_custom24", releaseDateTime);
					setCustom24(map, releaseDate, releaseTime);
					return fcyIbNonCustmrLclPay;
				}
			}
		}

		if(directionCheck == 'OUTBOUND') {
			currBsdClrgIdLookupOb = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.value-date-CHECK.FOR-FOREIGN-currency.CLEARING-ID.OUTBOUND.CURRENCY_BASED_clearingId_LOOKUP");
			currBsdClrgIdLookupOb = memTblGetTableValue(map, "INST_PARAM",  currBsdClrgIdLookupOb);

			if(currBsdClrgIdLookupOb == 'Y') {
				fcyObCurrBsdClrgId = ddCurrClrgId();
				clrgIdDerived = "Y";
				setHeader(map, "PLCN_custom8", fcyObCurrBsdClrgId);
				releaseTime = retrieveReleasetimeInst(map)
				releaseTime = lPadChar(releaseTime, 6, "0");

				releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
				releaseDate = (((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)).concat("/"))).concat(releaseDate.substr(5, 4));
				releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
				//setHeader(map, "PLCN_custom24", releaseDateTime);
				setCustom24(map, releaseDate, releaseTime);
				return fcyObCurrBsdClrgId;
			}else {
				if(localPay == 'Y') {
					fcyObNonCurrBsdDefClrgId = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.value-date-CHECK.FOR-FOREIGN-currency.CLEARING-ID.OUTBOUND.NON_CURRENCY_BASED_DEFAULT-CLEARING-ID");
					fcyObNonCurrBsdDefClrgId = memTblGetTableValue(map, "INST_PARAM",  fcyObNonCurrBsdDefClrgId);
					clrgIdDerived = "Y";
					setHeader(map, "PLCN_custom8", fcyObNonCurrBsdDefClrgId);
					releaseTime = retrieveReleasetimeInst(map)
					releaseTime = lPadChar(releaseTime, 6, "0");

					releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
					releaseDate = (((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)).concat("/"))).concat(releaseDate.substr(5, 4));				
					releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
					//setHeader(map, "PLCN_custom24", releaseDateTime);
					setCustom24(map, releaseDate, releaseTime);
					return fcyObNonCurrBsdDefClrgId;
				}
			}
		}

		if(directionCheck == 'ONWARD') {
			currBsdClrgIDLookupOnw = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.value-date-CHECK.FOR-FOREIGN-currency.CLEARING-ID.ONWARD.CURRENCY_BASED_clearingId_LOOKUP");
			currBsdClrgIDLookupOnw = memTblGetTableValue(map, "INST_PARAM",  currBsdClrgIDLookupOnw);

			if(currBsdClrgIDLookupOnw == 'Y') {
				fcyOnwCurrBsdClrgId = ddCurrClrgId();
				clrgIdDerived = "Y";
				setHeader(map, "PLCN_custom8", fcyOnwCurrBsdClrgId);
				releaseTime = retrieveReleasetimeInst(map)
				releaseTime = lPadChar(releaseTime, 6, "0");

				releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
				releaseDate = (((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)).concat("/"))).concat(releaseDate.substr(5, 4));
				releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
				//setHeader(map, "PLCN_custom24", releaseDateTime);
				setCustom24(map, releaseDate, releaseTime);
				return fcyOnwCurrBsdClrgId;
			}else {

				if(localPay == 'Y') {
					fcyOnwNonCurrBsdDefClrgId = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.value-date-CHECK.FOR-FOREIGN-currency.CLEARING-ID.OUTBOUND.NON_CURRENCY_BASED_DEFAULT-CLEARING-ID");
					fcyOnwNonCurrBsdDefClrgId = memTblGetTableValue(map, "INST_PARAM",  fcyOnwNonCurrBsdDefClrgId);
					clrgIdDerived = "Y";
					setHeader(map, "PLCN_custom8", fcyOnwNonCurrBsdDefClrgId);
					releaseTime = retrieveReleasetimeInst(map)
					releaseTime = lPadChar(releaseTime, 6, "0");

					releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
					releaseDate = (((releaseDate.substr(1, 2)).concat("/")).concat((releaseDate.substr(3, 2)).concat("/"))).concat(releaseDate.substr(5, 4));				
					releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
					//setHeader(map, "PLCN_custom24", releaseDateTime);
					setCustom24(map, releaseDate, releaseTime);
					return fcyOnwNonCurrBsdDefClrgId;
				}
			}
		}
	}

	if(clrgIdDerived == 'N') {
		//setEnhcrViolation("20", "7369");
		//comments = fillViolation();
		comments = setCommentsForTransaction("20", "7369", map);
		setHeader(map, "PLCN_commentsForBlob6", comments);
	}
}

function ddCurrClrgIdInstrctn(currency, map) {
	var clrgId;

	logger.info("In ddCurrClrgIdInstrctn");

	clrgId = getHeader(map, "PLCN_chlClgsysId");
	logger.info("ddCurrClrgIdInstrctn: clrgId = " + clrgId);

	return clrgId;
}

function fmtNxtWrkingDayInstrn(valueDate, map) {
	var retVal;
	var cutoffFlag;
	var holidayFlag

	logger.info("In fmtNxtWrkingDayInstrn");

	logger.info("fmtNxtWrkingDayInstrn: valueDate = " + valueDate);
	setHeader(map, "PLCN_valueDate", valueDate);

	//retVal = GETVALFROMDFD(GetCurrBusinessElement(), "NEXT-WORKING-DATE");
	retVal = getHeader(map, "PLCN_nextWorkingDate");
	logger.info("fmtNxtWrkingDayInstrn: retVal from PLCN_nextWorkingDate = " + retVal);

	cutoffFlag = getHeader(map, "PLCN_cutoffFlag");
	holidayFlag = getHeader(map, "PLCN_holidayFlag");

	logger.info("fmtNxtWrkingDayInstrn: cutoffFlag = " + cutoffFlag);
	logger.info("fmtNxtWrkingDayInstrn: holidayFlag = " + holidayFlag);

	if(cutoffFlag == 'Y' || holidayFlag == 'Y') {
		return valueDate;
	}else {
		if(retVal) {
			valueDate = convertDateFormat(retVal, "YYMMDD", "CCYYMMDD");
			logger.info("fmtNxtWrkingDayInstrn: valueDate = " + valueDate);
			setHeader(map, "PLCN_valueDate", valueDate);
			return retVal;
		}else {
			return valueDate;
		}
	}

	return valueDate;
}

function ddCurrClrgId(map) { //???
	var clrgId;
	var currency;

	logger.info("In ddCurrClrgId");

	//currency = "IN.PAYMSG.F32A.DT-AMT-A.currency";
	currency = getHeader(map, "PLCN_currency");

	clrgId = getHeader(map, "PLCN_chlClgsysId");
	return clrgId;
}

//This function looks up the database to derive the clearing system from the currency of the
//message and then derives the value of the non-working day i.e. Y if the day passed as parameter
//is a working day and N if it is a non-working day
function checkDayFlag(clearingId, day, map) {
	var clgSys;
	var dayFlag;
	var clrgIdCutoffReqd;	

	logger.info("In checkDayFlag");

	logger.info("checkDayFlag: day = " + day);

	//var hazelCastInstance = getHeader(map, "PLCN_hazelCastInstance");
	//var FLAG_TABLE = hazelCastInstance.getMap("FLAG-TABLE");

	clrgIdCutoffReqd = memTblGetTableValue(map, "FLAG-TABLE", "CLRG_ID_CUTOFF_REQD");
	logger.info("checkDayFlag: day = " + day);
	
	clgSys = ddClrgIdInstParamPath(map);
	logger.info("checkDayFlag: clgSys from ddClrgIdInstParamPath = " + clgSys);
	logger.info("checkDayFlag: typeof clgSys from ddClrgIdInstParamPath = " + typeof clgSys);

	if(!clgSys && clrgIdCutoffReqd == "Y") {
		clgSys = drveNibcClySysDetails(map);
		logger.info("checkDayFlag: clgSys from drveNibcClySysDetails = " + clgSys);
	}

	dayFlag = getHeader(map, "PLCN_cl".concat(day));
	return dayFlag;
}

function sendToReprNibc1(map) {
	var releaseDate;
	var origValueDate;
	var todaysDate;
	var stage;
	var tError;
	var mode;
	var sourceChnlId;
	var reprProductCode;
	var pattern;

	logger.info("In sendToReprNibc1");

	tError = "F"//memTblGetTableValue(map, "TransTable", "TransErrorFlag");
	releaseDate = getHeader(map, "PLCN_valueDate");
	origValueDate = getHeader(map, "PLCN_valueDate2");
	stage = getHeader(map, "PLCN_stage");
	mode = getHeader(map, "PLCN_manualMode");
	sourceChnlId = getHeader(map, "PLCN_channelIdSource");

	logger.info("sendToReprNibc1: tError = " + tError);
	logger.info("sendToReprNibc1: releaseDate = " + releaseDate);
	logger.info("sendToReprNibc1: origValueDate = " + origValueDate);
	logger.info("sendToReprNibc1: stage = " + stage);
	logger.info("sendToReprNibc1: mode = " + mode);
	logger.info("sendToReprNibc1: sourceChnlId = " + sourceChnlId);

	todaysDate = getDate();
	logger.info("sendToReprNibc1: todaysDate = " + todaysDate);

	if(!origValueDate) {
		return;
	}

	if(releaseDate != origValueDate) {
		setHeader(map, "PLCN_setNewDate", true);
	}

	if((origValueDate < todaysDate || origValueDate < releaseDate)  && (stage != 'ERR' && tError != 'T')) {

		var pcncValue = memTblGetTableValue(map, "FLAG-TABLE", "PASTDATE_CHECK_NOTAPPLICABLE_CHANNEL");
		logger.info("sendToReprNibc1: pcncValue = " + pcncValue);

		if(!(isPatternPresent(pcncValue, sourceChnlId))) {

			if(mode != 'REPAIR' && mode != 'MQ') {
				//setEnhcrViolation("00", "9506")
				//commentsForBlob6 = fillViolation();
				setHeader(map, "PLCN_schedulingReq", true);
				commentsForBlob6 = setCommentsForTransaction("00", "9506", map);
				setHeader(map, "PLCN_commentsForBlob6", commentsForBlob6)
				setHeader(map, "PLCN_queueId", "REPRQ");
				setHeader(map, "PLCN_schedulingReq", "true");
			}

			var avmValue = memTblGetTableValue(map, "USER_CONFIG_MAP", "AUTOREPAIR_VALUEDATE_MQ");
			logger.info("sendToReprNibc1: avmValue = " + avmValue);

			/*if(avmValue == "NO" && mode == "MQ") {
				//setEnhcrViolation("00", "9506");
				//commentsForBlob6 = fillViolation();
				setHeader(map, "PLCN_schedulingReq", true);
				comments = setCommentsForTransaction("00", "9506", map);
				//setHeader(map, "PLCN_commentsForBlob6", commentsForBlob6);
				setHeader(map, "PLCN_queueId", "REPRQ");
				setHeader(map, "PLCN_schedulingReq", "true");

				var reprProductCodeHdr = getHeader(map, "PLCN_reprProductCode");
				logger.info("sendToReprNibc1: reprProductCodeHdr = " + reprProductCodeHdr);

				if(!reprProductCodeHdr) {
					reprProductCode = getHeader(map, "PLCN_derivedProduct");
					logger.info("sendToReprNibc1: reprProductCode = " + reprProductCode);

					pattern = searchNthPattern(reprProductCode, "-", -1);
					logger.info("sendToReprNibc1: pattern = " + pattern);

					reprProductCode = reprProductCode.substr(0, pattern);
					logger.info("sendToReprNibc1: reprProductCode = " + reprProductCode);

					reprProductCode = reprProductCode.concat("R");
					logger.info("sendToReprNibc1: reprProductCode = " + reprProductCode);

					setHeader(map, "PLCN_derivedProduct", reprProductCode);
					setHeader(map, "PLCN_productCode", reprProductCode);
					setHeader(map, "PLCN_reprProductCode", reprProductCode);
				}
			}*/
		}
	}
}

function deriveClrgIdForJerseyAccount(currencyLocal, directionCheck, map) {
	var lclIbJerseyCustmrPay;
	var lclOnwJerseyAcctPay;
	var lclOnwNonJerseyAcctPay;
	var fcyIbJerseyCustmrPay;
	var fcyOnwJerseyAcctPay;
	var institutionId;
	var clrgIdDerived;
	var releaseTime;
	var releaseDate;
	var releaseDateTime;
	var valueDate;
	var messageCurr;
	var priority;

	logger.info("In deriveClrgIdForJerseyAccount");

	institutionId = getHeader(map, "PLCN_institutionId");
	valueDate = getHeader(map, "PLCN_valueDate");
	priority = getHeader(map, "PLCN_Priority");
	messageCurr = getHeader(map, "PLCN_currency");

	if(currencyLocal == "Y") {

		if(directionCheck == "INBOUND" && priority == "2") {
			lclIbJerseyCustmrPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.VALUE-DATE-CHECK.FOR-LOCAL-CURRENCY.CLEARING-ID.INBOUND.JERSEY_CUSTOMER_PAY");
			lclIbJerseyCustmrPay = memTblGetTableValue(map, "INST_PARAM",  lclIbJerseyCustmrPay);
			clrgIdDerived = "Y";
			setHeader(map, "PLCN_custom8", lclIbJerseyCustmrPay)
			releaseTime = retrievReleasetime(map);
			releaseTime = lPadChar(releaseTime, 6, "0");
			releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
			releaseDate = ((((releaseDate.substr(1, 2).concat("/"))).concat((releaseDate.substr(3, 2)))).concat("/")).concat(releaseDate.substr(5, 4));
			releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
			//setHeader(map, "PLCN_custom24", releaseDateTime)
			setCustom24(map, releaseDate, releaseTime);
			return lclIbJerseyCustmrPay;
		}

		if(directionCheck == "INBOUND" && priority == "1") {
			lclOnwNonJerseyAcctPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.VALUE-DATE-CHECK.FOR-LOCAL-CURRENCY.CLEARING-ID.ONWARD.NON_JERSEY_PAY");
			lclOnwNonJerseyAcctPay = memTblGetTableValue(map, "INST_PARAM",  lclOnwNonJerseyAcctPay);
			clrgIdDerived = "Y";
			setHeader(map, "PLCN_custom8", lclOnwNonJerseyAcctPay)
			releaseTime = retrievReleasetime(map);
			releaseTime = lPadChar(releaseTime, 6, "0");
			releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
			releaseDate = ((((releaseDate.substr(1, 2).concat("/"))).concat((releaseDate.substr(3, 2)))).concat("/")).concat(releaseDate.substr(5, 4));
			releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
			//setHeader(map, "PLCN_custom24", releaseDateTime)
			setCustom24(map, releaseDate, releaseTime);
			return lclOnwNonJerseyAcctPay;
		}

		if(directionCheck == "INBOUND" && priority == "8") {
			lclOnwJerseyAcctPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.VALUE-DATE-CHECK.FOR-LOCAL-CURRENCY.CLEARING-ID.ONWARD.JERSEY_PAY");
			lclOnwJerseyAcctPay = memTblGetTableValue(map, "INST_PARAM",  lclOnwJerseyAcctPay);
			clrgIdDerived = "Y";
			setHeader(map, "PLCN_custom8", lclOnwJerseyAcctPay)
			releaseTime = retrievReleasetime(map);
			releaseTime = lPadChar(releaseTime, 6, "0");
			releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
			releaseDate = ((((releaseDate.substr(1, 2).concat("/"))).concat((releaseDate.substr(3, 2)))).concat("/")).concat(releaseDate.substr(5, 4));
			releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
			//setHeader(map, "PLCN_custom24", releaseDateTime)
			setCustom24(map, releaseDate, releaseTime);
			return lclOnwJerseyAcctPay;
		}
	}

	if(currencyLocal != "Y") {

		if(directionCheck = "INBOUND") {

			if(priority == "5") {
				fcyIbJerseyCustmrPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.VALUE-DATE-CHECK.FOR-FOREIGN-CURRENCY.CLEARING-ID.INBOUND.JERSEY_CUSTOMER_PAY_GBP");
				fcyIbJerseyCustmrPay = memTblGetTableValue(map, "INST_PARAM",  fcyIbJerseyCustmrPay);
				clrgIdDerived = "Y";
				setHeader(map, "PLCN_custom8", fcyIbJerseyCustmrPay)
				releaseTime = retrievReleasetime(map);
				releaseTime = lPadChar(releaseTime, 6, "0");
				releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
				releaseDate = ((((releaseDate.substr(1, 2).concat("/"))).concat((releaseDate.substr(3, 2)))).concat("/")).concat(releaseDate.substr(5, 4));
				releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
				//setHeader(map, "PLCN_custom24", releaseDateTime)
				setCustom24(map, releaseDate, releaseTime);
				return fcyIbJerseyCustmrPay;	
			}

			if(priority == "6") {
				fcyIbJerseyCustmrPay = institutionId.concat(".PAYMT_SWIFT.GEN_PARAMS.FUNCTIONALITY.VALUE-DATE-CHECK.FOR-FOREIGN-CURRENCY.CLEARING-ID.INBOUND.JERSEY_CUSTOMER_PAY");
				fcyIbJerseyCustmrPay = memTblGetTableValue(map, "INST_PARAM",  fcyIbJerseyCustmrPay);
				clrgIdDerived = "Y";
				setHeader(map, "PLCN_custom8", fcyIbJerseyCustmrPay)
				releaseTime = retrievReleasetime(map);
				releaseTime = lPadChar(releaseTime, 6, "0");
				releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
				releaseDate = ((((releaseDate.substr(1, 2).concat("/"))).concat((releaseDate.substr(3, 2)))).concat("/")).concat(releaseDate.substr(5, 4));
				releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
				//setHeader(map, "PLCN_custom24", releaseDateTime)
				setCustom24(map, releaseDate, releaseTime);
				return fcyIbJerseyCustmrPay;	
			}
		}
	}
}

function checkDayFlagInstrcn(currency, day, map) {
	var clgSys;
	var dayFlag;
	var clrgIdCutoffFlag;
	var clrgIdStatus;
	var mode;
	var msgType;
	var msgPriority;
	var custom11Db; 
	var msgDirection;

	logger.info("In checkDayFlagInstrcn");
	//logger.info("checkDayFlagInstrcn: map = " + map);
	logger.info("checkDayFlagInstrcn: day = " + day);

	dayFlag = getHeader(map, "PLCN_cl" + day.toLowerCase());
	logger.info("checkDayFlagInstrcn: dayFlag = " + dayFlag);

	if(dayFlag){
		return dayFlag;
	}

	msgDirection = getHeader(map, "PLCN_msgDirection");

	clrgIdCutoffFlag = memTblGetTableValue(map, "FLAG-TABLE", "CLRG_ID_CUTOFF_REQD");
	logger.info("checkDayFlagInstrcn: clrgIdCutoffFlag = " + clrgIdCutoffFlag);

	if(clrgIdCutoffFlag == "Y"){
		clgSys = getHeader(map, "PLCN_clearingId");
		clrgIdStatus = getHeader(map, "PLCN_cutoffTime");
		mode = getHeader(map, "PLCN_manualMode");

		if(!(mode)){
			mode = getHeader(map, "PLCN_msgModeIn");
		}

		msgType = getHeader(map, "PLCN_msgType");

		msgPriority = getHeader(map, "PLCN_msgPriority");
		custom11Db = getHeader(map, "PLCN_custom11");

		if(msgDirection == "O"){
			clgSys = drveNibcClySysDetails();
		}

		if((!(clgSys)) ||(clrgIdStatus == "CLEARINGID_NOT_FOUND")){
			clgSys = "DEFAULT_CLEARING";
		}

	}else {
		clgSys = ddClrgInstParmInstrcn(map);
	}

	logger.info("checkDayFlagInstrcn: day = " + day);
	dayFlag = getHeader(map, "PLCN_cl".concat(day));
	logger.info("checkDayFlagInstrcn: dayFlag = " + dayFlag);

	return dayFlag;
}

//derives next wworking date
function ddNxtWrkingDayInstrcn(valueDate, currency, map){
	var nxtWorkingDate;
	var workingDaysToAdd;
	var thuFlag;
	var friFlag;
	var satFlag;
	var sunFlag;
	var tmpSysDate;
	var tmpValDate;
	var tempDate;
	var clrgIdCutoffFlag;
	var holidayFlag;
	var holidayConfirmFlag;
	var cutoffFlag;
	var pastValueDateFlag;

	logger.info("In ddNxtWrkingDayInstrcn");

	tempDate = getDate();
	cutoffFlag = getHeader(map, "PLCN_cutoffFlag");
	holidayFlag = getHeader(map, "PLCN_holidayFlag");

	logger.info("ddNxtWrkingDayInstrcn: cutoffFlag = " + cutoffFlag);
	logger.info("ddNxtWrkingDayInstrcn: holidayFlag = " + holidayFlag);
	logger.info("ddNxtWrkingDayInstrcn: valueDate = " + valueDate);

	if(cutoffFlag == 'Y' || holidayFlag == 'Y') {
		workingDaysToAdd = 1;
		thuFlag = checkDayFlagInstrcn(currency, "Thursday", map);
		friFlag = checkDayFlagInstrcn(currency, "Friday", map);
		satFlag = checkDayFlagInstrcn(currency, "Saturday", map);
		sunFlag = checkDayFlagInstrcn(currency, "Sunday", map);

		logger.info("ddNxtWrkingDayInstrcn: thuFlag = " + thuFlag);
		logger.info("ddNxtWrkingDayInstrcn: friFlag = " + friFlag);
		logger.info("ddNxtWrkingDayInstrcn: satFlag = " + satFlag);
		logger.info("ddNxtWrkingDayInstrcn: sunFlag = " + sunFlag);

		pastValueDateFlag = getHeader(map, "PLCN_pastValueDateFlag");
		logger.info("ddNxtWrkingDayInstrcn: pastValueDateFlag = " + pastValueDateFlag);

		if(pastValueDateFlag == 'Y') {
			tempDate = getDate();	
			nxtWorkingDate = getNxtWrkingDayInstrn(workingDaysToAdd, tempDate, currency, thuFlag, friFlag, satFlag, sunFlag, map);
			logger.info("ddNxtWrkingDayInstrcn: nxtWorkingDate = " + nxtWorkingDate);
		}else {
			clrgIdCutoffFlag = memTblGetTableValue(map, "FLAG-TABLE", "CLRG_ID_CUTOFF_REQD");
			clrgIdCutoffFlag = clrgIdCutoffFlag.trim();
			logger.info("ddNxtWrkingDayInstrcn: clrgIdCutoffFlag = " + clrgIdCutoffFlag);

			if(clrgIdCutoffFlag == 'Y') {
				holidayFlag = getHeader(map, "PLCN_holidayFlag");
				logger.info("ddNxtWrkingDayInstrcn: holidayFlag = " + holidayFlag);

				if(holidayFlag == 'Y') {
					logger.info("ddNxtWrkingDayInstrcn: valueDate = " + valueDate);
					holidayConfirmFlag = "Y";
					setHeader(map, "PLCN_holidayConfirmFlag", "Y");
					logger.info("ddNxtWrkingDayInstrcn: PLCN_holidayConfirmFlag = Y");
					nxtWorkingDate = getNxtWrkingDayInstrn(workingDaysToAdd, valueDate, currency, thuFlag, friFlag, satFlag, sunFlag, map);
					logger.info("ddNxtWrkingDayInstrcn: nxtWorkingDate = " + nxtWorkingDate);

					if(holidayFlag == 'Y') {
						setHeader(map, "PLCN_holidayFlag", "N");
						logger.info("ddNxtWrkingDayInstrcn: PLCN_holidayFlag = N");	
					}
				}else {
					nxtWorkingDate = valueDate;
					logger.info("ddNxtWrkingDayInstrcn: nxtWorkingDate = " + nxtWorkingDate);
				}
			}else {
				if(valueDate != tempDate) {
					nxtWorkingDate = getNxtWrkingDayInstrn(workingDaysToAdd, valueDate, currency, thuFlag, friFlag, satFlag, sunFlag, map);	
				}else {
					nxtWorkingDate = valueDate;
					logger.info("ddNxtWrkingDayInstrcn: valueDate = " + valueDate);
					logger.info("ddNxtWrkingDayInstrcn: nxtWorkingDate = " + nxtWorkingDate);
				}

			}
		}

		valueDate = nxtWorkingDate;
		//nxtWorkingDate = convertDateFormat(nxtWorkingDate, "CCYYMMDD", "YYMMDD");
		//PLCN_valueDate = convertDateFormat(PLCN_valueDate, "YYMMDD", "CCYYMMDD");

		logger.info("ddNxtWrkingDayInstrcn: nxtWorkingDate = " + nxtWorkingDate);
		
		setHeader(map, "PLCN_valueDate", valueDate);
		setHeader(map, "PLCN_nextWorkingDate", nxtWorkingDate);

		logger.info("ddNxtWrkingDayInstrcn: PLCN_valueDate = " + getHeader(map, "PLCN_valueDate"));
		logger.info("ddNxtWrkingDayInstrcn: PLCN_nextWorkingDate = " + getHeader(map, "PLCN_nextWorkingDate"));

		return;	
	}

	logger.info("ddNxtWrkingDayInstrcn: nxtWorkingDate = " + nxtWorkingDate);
}

function getNxtWrkingDayInstrn(workDaysToAdd, originalDate, currency, thuFlag, friFlag, satFlag, sunFlag, map){
	var x;
	var holiday;
	var holidayFlag;
	var tempDate;
	var temp1Date;
	var dayTag;
	var temp2;
	var currWorkDay;

	logger.info("In getNxtWrkingDayInstrn");

	x = 1;
	currWorkDay = 0;
	tempDate = originalDate;

	logger.info("getNxtWrkingDayInstrn: workDaysToAdd = " + workDaysToAdd);
	logger.info("getNxtWrkingDayInstrn: originalDate = " + originalDate);
	logger.info("getNxtWrkingDayInstrn: currency = " + currency);
	logger.info("getNxtWrkingDayInstrn: thuFlag = " + thuFlag);
	logger.info("getNxtWrkingDayInstrn: friFlag = " + friFlag);
	logger.info("getNxtWrkingDayInstrn: satFlag = " + satFlag);
	logger.info("getNxtWrkingDayInstrn: sunFlag = " + sunFlag);

	while(currWorkDay < workDaysToAdd){
		holidayFlag = "N";
		temp1Date = getDateFromNumOfDays(tempDate, x);
		logger.info("getNxtWrkingDayInstrn: temp1Date = " + temp1Date);
		//temp2 = getHeader(map, "PLCN_institutionId") + "_";
		//temp2 = temp2 + currency + "_" + temp1Date;
		//holiday = memTblGetTableValue(map, "CHL_HOLIDAY", temp2);

		holiday = checkHoliday(currency, temp1Date, map);
		logger.info("getNxtWrkingDayInstrn: holiday = " + holiday);

		if(!(holiday)){
			holiday = checkHolidayInstrcn(currency, temp1Date, map);
			logger.info("getNxtWrkingDayInstrn: holiday = " + holiday);
		}

		if(holiday > 0){
			holidayFlag = "Y";
		}

		logger.info("getNxtWrkingDayInstrn: holidayFlag = " + holidayFlag);

		if(holidayFlag == "N"){
			temp1Date = convertDateFormat(temp1Date, "CCYYMMDD", "DDMMCCYY");
			logger.info("getNxtWrkingDayInstrn: temp1Date = " + temp1Date);
			var tmpDateW = convertDateFormat(temp1Date, "DDMMCCYY", "MMDDCCYY");
			logger.info("getNxtWrkingDayInstrn: tmpDateW = " + tmpDateW);
			dayTag = getWeekday(tmpDateW);
			logger.info("getNxtWrkingDayInstrn: dayTag = " + dayTag);

			if((dayTag == "Thursday" && thuFlag == "Y") || (dayTag == "Friday" && friFlag == "Y") || (dayTag == "Saturday" && satFlag == "Y") || (dayTag  == "Sunday" && sunFlag == "Y")) {
				holidayFlag = "Y";
			}

			temp1Date = convertDateFormat(temp1Date, "DDMMCCYY", "CCYYMMDD");
			logger.info("getNxtWrkingDayInstrn: temp1Date = " + temp1Date);
		}

		x++;

		logger.info("getNxtWrkingDayInstrn: holidayFlag = " + holidayFlag);

		if(holidayFlag == "N") {
			currWorkDay++;
			logger.info("getNxtWrkingDayInstrn: currWorkDay = " + currWorkDay);
		}
	}

	logger.info("getNxtWrkingDayInstrn: temp1Date = " + temp1Date);

	return temp1Date;
}

function checkHolidayInstrcn(currency, date, map){
	var clgSys;
	var holiday;
	var clrgIdCutoffFlag;
	var clrgIdStatus;
	var mode;
	var msgType;
	var msgPriority;
	var custom11Db;
	var msgDirection;

	logger.info("In checkHolidayInstrcn");

	logger.info("checkHolidayInstrcn: currency = " + currency);
	logger.info("checkHolidayInstrcn: date = " + date);

	msgDirection = getHeader(map, "PLCN_msgDirection");
	logger.info("checkHolidayInstrcn: msgDirection = " + msgDirection);

	clrgIdCutoffFlag = memTblGetTableValue(map, "FLAG-TABLE", "CLRG_ID_CUTOFF_REQD");
	clrgIdCutoffFlag = clrgIdCutoffFlag.trim();
	logger.info("checkHolidayInstrcn: clrgIdCutoffFlag = " + clrgIdCutoffFlag);

	if(clrgIdCutoffFlag == "Y"){
		clgSys = getHeader(map, "PLCN_clearingId");
		logger.info("checkHolidayInstrcn: clgSys from PLCN_clearingId = " + clgSys);

		if(!(clgSys)){
			clgSys = getHeader(map, "PLCN_clrgIdSet");
			logger.info("checkHolidayInstrcn: clgSys from PLCN_clrgIdSet = " + clgSys);
		}

		//clgSys = getHeader(map, "PLCN_clearingId");
		clrgIdStatus = getHeader(map, "PLCN_cutoffTime");
		mode = getHeader(map, "PLCN_msgModeIn");
		msgType = getHeader(map, "PLCN_msgType");
		msgPriority = getHeader(map, "PLCN_msgPriority");
		custom11Db = getHeader(map, "PLCN_custom11");

		logger.info("checkHolidayInstrcn: clrgIdStatus = " + clrgIdStatus);
		logger.info("checkHolidayInstrcn: mode = " + mode);
		logger.info("checkHolidayInstrcn: msgType = " + msgType);
		logger.info("checkHolidayInstrcn: msgPriority = " + msgPriority);
		logger.info("checkHolidayInstrcn: custom11Db = " + custom11Db);

		if(msgDirection == "O"){
			clgSys = drveNibcClySysDetails();
			logger.info("checkHolidayInstrcn: clgSys = " + clgSys);
		}

		if(!clgSys || clrgIdStatus == "clearingId_NOT_FOUND"){
			clgSys = "DEFAULT_CLEARING";
			logger.info("checkHolidayInstrcn: clgSys = " + clgSys);
		}
	}else{
		clgSys = ddClrgInstParmInstrcn(map);
		logger.info("checkHolidayInstrcn: clgSys = " + clgSys);
	}

	logger.info("checkHolidayInstrcn: clgSys = " + clgSys);

	if(clgSys) {
		holiday = checkHoliday(clgSys, date, map);
		logger.info("checkHolidayInstrcn: holiday = " + holiday);
	}

	return holiday;
}

function releasePymtDateRule(clrgId, map) {
	var valueDate;
	var releaseTime;
	var releaseDate;
	var releaseDateTime;
	var holdQFlag;
	var indctrFlag;
	var createHolidayFlag;
	var startTimeFlag;
	var todaysDate;
	var cutoffFlag;

	logger.info("In releasePymtDateRule");

	logger.info("releasePymtDateRule: clrgId = " + clrgId);
	logger.trace("releasePymtDateRule: map = " + map);		

	startTimeFlag = getHeader(map, "PLCN_startTimeFlag");
	logger.info("releasePymtDateRule: startTimeFlag = " + startTimeFlag);

	cutoffFlag = getHeader(map, "PLCN_cutoffFlag");
	logger.info("releasePymtDateRule: cutoffFlag = " + cutoffFlag);	

	var tmp1 = getHeader(map, "PLCN_calculatedReleaseDate");
	var tmp2 = getHeader(map, "PLCN_createHolidayReleaseDate");
	var tmp3 = getHeader(map, "PLCN_nextWorkingDate");
	var tmp4 = getHeader(map, "PLCN_custom24rd");
	var tmp5 = getHeader(map, "PLCN_calculatedNextDate");
	var tmp6 = getHeader(map, "PLCN_valueDate");

	logger.info("releasePymtDateRule: PLCN_calculatedReleaseDate = " + tmp1);
	logger.info("releasePymtDateRule: PLCN_createHolidayReleaseDate = " + tmp2);
	logger.info("releasePymtDateRule: PLCN_nextWorkingDate = " + tmp3);
	logger.info("releasePymtDateRule: PLCN_custom24rd = " + tmp4);
	logger.info("releasePymtDateRule: PLCN_calculatedNextDate = " + tmp5);
	logger.info("releasePymtDateRule: PLCN_valueDate = " + tmp6);		

	var clrgIdOffsetDay = getHeader(map, "PLCN_clrgIdOffsetDay");
	logger.info("releasePymtDateRule: clrgIdOffsetDay = " + clrgIdOffsetDay); //CCYYMMDD

	todaysDate = getDate();
	logger.info("releasePymtDateRule: todaysDate = " + todaysDate); //CCYYMMDD	

	if(startTimeFlag == "Y" || parseInt(clrgIdOffsetDay) > 0) {
		valueDate = getHeader(map, "PLCN_calculatedReleaseDate");
		logger.info("releasePymtDateRule: valueDate from PLCN_calculatedReleaseDate = " + valueDate); //CCYYMMDD

		if(valueDate < todaysDate) {
			valueDate = tmp3;
			logger.info("releasePymtDateRule: valueDate from PLCN_nextWorkingDate = " + valueDate);
		}
		//valueDate = tmp5;
		//logger.info("releasePymtDateRule: valueDate from PLCN_calculatedNextDate = " + valueDate); //CCYYMMDD
	}else {

    	var todaysDate = getDate();
    	logger.info("setCustom24: todaysDate = " + todaysDate);		

		var holidayCheck = checkHoliday(clrgId, todaysDate, map);
		logger.info("releasePymtDateRule: holidayCheck = " + holidayCheck);

		if(holidayCheck == 1) {
			//valueDate = tmp4;
			valueDate = tmp3;
			logger.info("releasePymtDateRule: valueDate from PLCN_custom24rd = " + valueDate);			
		}else{
			valueDate = getHeader(map, "PLCN_nextWorkingDate");
			logger.info("releasePymtDateRule: valueDate from PLCN_nextWorkingDate = " + valueDate); //CCYYMMDD
		}

		if(!valueDate) {
			valueDate = getHeader(map, "PLCN_calculatedReleaseDate");
			logger.info("releasePymtDateRule: valueDate from PLCN_calculatedReleaseDate = " + valueDate); //CCYYMMDD			
		}
	}

	logger.info("releasePymtDateRule: valueDate = " + valueDate); //CCYYMMDD

	if(valueDate == todaysDate && parseInt(clrgIdOffsetDay) > 0) {
		logger.info("releasePymtDateRule: valueDate == todaysDate");
		
		if(cutoffFlag == "Y"){
			valueDate = ddBusinessDate1(valueDate, "+", "BD", clrgIdOffsetDay, map); //drvNextValueDate(nextWorkingDate, clrgId, "0", currency, "00", "6012", map);
			logger.info("releasePymtDateRule: valueDate from ddBusinessDate1 = " + valueDate);
		}
	}
	
	setHeader(map, "PLCN_releaseDateMsg", valueDate);

	releaseTime = retrieveReleaseTimeClrgId(clrgId, map);
	logger.info("releasePymtDateRule: releaseTime = " + releaseTime);
	releaseTime = lPadChar(releaseTime, 6, "0");
	logger.info("releasePymtDateRule: releaseTime = " + releaseTime);
	releaseDate = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
	logger.info("releasePymtDateRule: releaseDate = " + releaseDate); //09062021
	releaseDate = releaseDate.substr(0, 2) + "/" + releaseDate.substr(2, 2) + "/" + releaseDate.substr(4, 8);
	logger.info("releasePymtDateRule: releaseDate = " + releaseDate);
	releaseDateTime = (releaseDate.concat(", ")).concat(releaseTime);
	logger.info("releasePymtDateRule: releaseDateTime = " + releaseDateTime);
	//setHeader(map, "PLCN_custom24", releaseDateTime);
	setCustom24(map, releaseDate, releaseTime);
}

function retrieveReleaseTimeClrgId(clrgId, map) {
	var releaseTime;

	logger.info("In retrieveReleaseTimeClrgId");
	logger.info("retrieveReleaseTimeClrgId: clrgId = " + clrgId);
	releaseTime = getHeader(map, "PLCN_clStartTime"); //memTblGetTableValue(map, "CL_START_TIME_MAP", clrgId);
	logger.info("retrieveReleaseTimeClrgId: releaseTime = " + releaseTime);

	return releaseTime;
}

function valueDateDcsnRule(valueDate, fld, vioCode3, vioCode2, map) {
	var todaysDate;
	var msgDate;
	var comments;
	var releaseFlag;
	var newValueDate;
	var cutoffFlag;
	var holdQFlag;
	var releaseDate;
	var currency;
	var indctrFlag;
	var noOfDays;
	var calculatedReleaseDate;
	var holidayConfirmFlag;
	var tbReleasedFlag;
	var custom24;
	var startTime;

	logger.info("In valueDateDcsnRule");

	cutoffFlag = getHeader(map, "PLCN_cutoffFlag");
	releaseDate = getHeader(map, "PLCN_calculatedReleaseDate");
	setHeader(map, "PLCN_createHolidayReleaseDate", releaseDate);
	currency = getHeader(map, "PLCN_msgCurrency");
	tbReleasedFlag = getHeader(map, "PLCN_toBeReleasedFlag");

	logger.info("valueDateDcsnRule: cutoffFlag = " + cutoffFlag);
	logger.info("valueDateDcsnRule: releaseDate = " + releaseDate);
	logger.info("valueDateDcsnRule: currency = " + currency);
	logger.info("valueDateDcsnRule: tbReleasedFlag = " + tbReleasedFlag);

	todaysDate = getDate();
	logger.info("valueDateDcsnRule: todaysDate = " + todaysDate);

	if(todaysDate < releaseDate) {
		releaseFlag = getHeader(map, "PLCN_clrgIdReleaseFlag");
		logger.info("valueDateDcsnRule: releaseFlag = " + releaseFlag);

		if(releaseFlag.toUpperCase() == 'YES') {

			if(!cutoffFlag || cutoffFlag == 'N') {
				newValueDate = getHeader(map, "PLCN_calculatedNextDate");
				setHeader(map, "PLCN_valueDate", newValueDate);
				holdQFlag = "N";
				setHeader(map, "PLCN_holdQFlag", holdQFlag);
			}else {
				newValueDate = getHeader(map, "PLCN_calculatedNextDate");
				setHeader(map, "PLCN_valueDate", newValueDate);
				holdQFlag = "N";
				setHeader(map, "PLCN_holdQFlag", holdQFlag);
			}
		}else {

			if(!cutoffFlag || cutoffFlag == 'N') {

				if(tbReleasedFlag == 'Y') {
					newValueDate = getHeader(map, "PLCN_calculatedNextDate");
					setHeader(map, "PLCN_valueDate", newValueDate);
					holdQFlag = "N";
					setHeader(map, "PLCN_holdQFlag", holdQFlag);

					if(releaseDate) {
						setHeader(map, "PLCN_calculatedReleaseDate", releaseDate);
					}

					newValueDate = getHeader(map, "PLCN_calculatedNextDate");
					setHeader(map, "PLCN_valueDate", newValueDate);
					setHeader(map, "PLCN_earlyDateFlag", "Y");
				}
			}else {
				setHeader(map, "PLCN_overrideCutoffFlag", "Y");
				holdQFlag = "Y";
				setHeader(map, "PLCN_holdQFlag", holdQFlag);

				if(releaseDate) {
					setHeader(map, "PLCN_calculatedReleaseDate", releaseDate);
				}

				newValueDate = getHeader(map, "PLCN_calculatedNextDate");
				setHeader(map, "PLCN_valueDate", newValueDate);
				setHeader(map, "PLCN_earlyDateFlag", "Y");
			}
		}
	}

	if(todaysDate > releaseDate) {
		//setEnhcrViolation(fld, vioCode3, map);
		//comments = fillViolation();
		setHeader(map, "PLCN_schedulingReq", true);
		comments = setCommentsForTransaction(fld, vioCode3, map);
		setHeader(map, "PLCN_commentsForBlob6", comments);
		setHeader(map, "PLCN_comments", comments);
		releaseFlag = getHeader(map, "PLCN_clrgIdReleaseFlag");

		if(releaseFlag.toUpperCase() == "YES") {

			if(!cutoffFlag || cutoffFlag == 'N') {
				newValueDate = getHeader(map, "PLCN_calculatedNextDate");
				setHeader(map, "PLCN_valueDate", newValueDate);
				holdQFlag = "N";
				setHeader(map, "PLCN_holdQFlag", holdQFlag);
			}else {
				newValueDate = getHeader(map, "PLCN_calculatedNextDate");
				setHeader(map, "PLCN_valueDate", newValueDate);
				holdQFlag = "N";
				setHeader(map, "PLCN_holdQFlag", holdQFlag);	
			}		
		}else {
			if(!cutoffFlag || cutoffFlag == 'N') {
				newValueDate = getHeader(map, "PLCN_calculatedNextDate");
				setHeader(map, "PLCN_valueDate", newValueDate);
				holdQFlag = "N";
				setHeader(map, "PLCN_holdQFlag", holdQFlag);
			}else {

				if(releaseDate) {
					setHeader(map, "PLCN_calculatedReleaseDate", releaseDate);	
				}
				newValueDate = getHeader(map, "PLCN_calculatedNextDate");
				setHeader(map, "PLCN_valueDate", newValueDate);
				setHeader(map, "PLCN_overrideCutoffFlag", "Y");
				holdQFlag = "N";
				setHeader(map, "PLCN_holdQFlag", holdQFlag);
			}
		}
	}

	if(todaysDate == releaseDate) {
		releaseFlag = getHeader(map, "PLCN_clrgIdReleaseFlag");

		if(releaseFlag.toUpperCase() == "YES") {

			if(!cutoffFlag || cutoffFlag == 'N') {
				newValueDate = getHeader(map, "PLCN_calculatedNextDate");
				setHeader(map, "PLCN_valueDate", newValueDate);
				holdQFlag = "N";
				setHeader(map, "PLCN_holdQFlag", holdQFlag);
			}else {
				newValueDate = getHeader(map, "PLCN_calculatedNextDate");
				setHeader(map, "PLCN_valueDate", newValueDate);
				holdQFlag = "N";
				setHeader(map, "PLCN_holdQFlag", holdQFlag);	
			}		
		}else {

			if(!cutoffFlag || cutoffFlag == 'N') {
				newValueDate = getHeader(map, "PLCN_calculatedNextDate");
				setHeader(map, "PLCN_valueDate", newValueDate);
				holdQFlag = "N";
				setHeader(map, "PLCN_holdQFlag", holdQFlag);
			}else {
				newValueDate = getHeader(map, "PLCN_calculatedNextDate");
				setHeader(map, "PLCN_valueDate", newValueDate);
				holdQFlag = "N";
				setHeader(map, "PLCN_holdQFlag", holdQFlag);	
			}
		}	
	}

	if((isPatternPresent(getHeader(map, "PLCN_commentsForBlob6"), "9500") || isPatternPresent(getHeader(map, "PLCN_commentsForBlob6"),  "6013") && getHeader(map, "PLCN_createHoliday") == 1)) {
		setHeader(map, "PLCN_createHolidayFlag", "Y");	
	}

	logger.info("valueDateDcsnRule: newValueDate = " + newValueDate);
}

function ruleCombineViolations(map){
	var commentsStrCurrProcess;
	var vioStrAftPreenceInfo;
	var vioStrBefPresenceInfo;
	var tmpStr;
	var tmpVioStrAftPresenceInfo;
	var tmpVioStrBefPresenceInfo;
	var finalCmntStrCurrProcess;
	var serverMode;

	logger.info("In ruleCombineViolations");
	
	serverMode = memTblGetTableValue(map, "FLAG_TABLE", "SERVER-MODE");
	
	if(serverMode == "INTERFACE" ){
		commentsStrCurrProcess = getHeader(map, "PLCN_commentsForBlob6");	
	}else {
		commentsStrCurrProcess = commentsStrCurrProcess;
	}
	tmpVioStrAftPresenceInfo = strStr(commentsStrCurrProcess,":A00:");
	tmpVioStrBefPresenceInfo = removePattern(commentsStrCurrProcess , tmpVioStrAftPresenceInfo );
	
	//tmpStr = fillViolation();

	tmpVioStrAftPresenceInfo = strStr(tmpStr,":A00:");
	tmpVioStrBefPresenceInfo = removePattern(tmpStr , tmpVioStrAftPresenceInfo );

	finalCmntStrCurrProcess = vioStrBefPresenceInfo + tmpVioStrBefPresenceInfo + vioStrAftPreenceInfo + tmpVioStrAftPresenceInfo;
	finalCmntStrCurrProcess = cleanupComments(finalCmntStrCurrProcess);

	if(serverMode == "INTERFACE") {
		setHeader(map, "PLCN_commentsForBlob6", finalCmntStrCurrProcess);
		
	}else {
		commentsForBlob6 = finalCmntStrCurrProcess;
	}
}

function lPadChar(str, num, ch) {
	var i;

	i = str.length;

	while(i < num) {
		str = ch.concat(str);
		i++;
	}

	return str;
}

function setNewIntrBkSttlmDt(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var releaseDateMsg;
	var newPriorityDate;
	var nextWorkingDate;
	var weekendCheck;

	logger.info("In setNewIntrBkSttlmDt");

    var mode = 	getHeader(map, "PLCN_mode");
   	logger.info("setNewIntrBkSttlmDt: mode = " + mode);

   	var autoRepairFlag = memTblGetTableValue(map, "USER_CONFIG_MAP", "AUTOREPAIR_VALUEDATE_"+mode);
   	logger.info("setNewIntrBkSttlmDt: autoRepairFlag = " + autoRepairFlag);

	releaseDateMsg = getHeader(map, "PLCN_releaseDateMsg");
	newPriorityDate = releaseDateMsg;
	logger.info("setNewIntrBkSttlmDt: releaseDateMsg = " + releaseDateMsg);

	var valueDate = getHeader(map, "PLCN_valueDate");
	logger.info("setNewIntrBkSttlmDt: valueDate = " + valueDate);

	var offSet = getHeader(map, "PLCN_clrgIdOffsetDay");
	logger.info("setNewIntrBkSttlmDt: offSet = " + offSet);

	var nextWorkingDateHdr = getHeader(map, "PLCN_nextWorkingDate");
	logger.info("setNewIntrBkSttlmDt: nextWorkingDateHdr = " + nextWorkingDateHdr);

	var clrgId = getHeader(map, "PLCN_clearingId");
	logger.info("setNewIntrBkSttlmDt: clrgId = " + clrgId);	

	if(autoRepairFlag == "YES") {
		if(offSet != "0") {

			if(valueDate == releaseDateMsg && offSet != "0") {
				logger.info("setNewIntrBkSttlmDt: valueDate == releaseDateMsg && offSet != 0");
				valueDate = ddBusinessDate1(valueDate, "+", "BD", offSet, map); //drvNextValueDate(nextWorkingDate, clrgId, "0", currency, "00", "6012", map);
				logger.info("setNewIntrBkSttlmDt: valueDate from ddBusinessDate1 = " + valueDate);
			}

			var holidayCheck = checkHoliday(clrgId, valueDate, map);
			logger.info("setNewIntrBkSttlmDt: holidayCheck = " + holidayCheck);

			var thuFlag = checkDayFlagInstrcn(clrgId, "Thursday", map);
			var friFlag = checkDayFlagInstrcn(clrgId, "Friday", map);
			var satFlag = checkDayFlagInstrcn(clrgId, "Saturday", map);
			var sunFlag = checkDayFlagInstrcn(clrgId, "Sunday", map);
			var tmpDateW = convertDateFormat(valueDate, "CCYYMMDD", "MMDDCCYY");
			var dayTag = getWeekday(tmpDateW);
			
			if((dayTag == "Thursday" && thuFlag == 'Y') || (dayTag == "Friday" && friFlag == 'Y') || (dayTag == "Saturday" && satFlag == 'Y') || (dayTag == "Sunday" && sunFlag == 'Y')) {
				weekendCheck = 1;
			}	

			logger.info("setNewIntrBkSttlmDt: weekendCheck = " + weekendCheck);		

			if(holidayCheck == 1 || weekendCheck == 1) {
				nextWorkingDate = nextWorkingDateHdr;
				logger.info("setNewIntrBkSttlmDt: nextWorkingDate from nextWorkingDateHdr = " + nextWorkingDate);
				logger.info("setNewIntrBkSttlmDt: nextWorkingDateHdr = " + nextWorkingDateHdr);
				logger.info("setNewIntrBkSttlmDt: offSet = " + offSet);
				logger.info("setNewIntrBkSttlmDt: typeof offSet = " + typeof offSet);
				var currency = getHeader(map, "PLCN_currency");

				//4503
				if(nextWorkingDate == releaseDateMsg && offSet != "0") {
					logger.info("setNewIntrBkSttlmDt: nextWorkingDate == releaseDateMsg && offSet != 0");
					nextWorkingDate = ddBusinessDate1(nextWorkingDate, "+", "BD", offSet, map); //drvNextValueDate(nextWorkingDate, clrgId, "0", currency, "00", "6012", map);
					logger.info("setNewIntrBkSttlmDt: nextWorkingDate from drvNextValueDate = " + nextWorkingDate);
				}				
			}else {
				nextWorkingDate = valueDate;
				logger.info("setNewIntrBkSttlmDt: nextWorkingDate from valueDate = " + nextWorkingDate);
			}							
		}else {
			nextWorkingDate = releaseDateMsg;
			logger.info("setNewIntrBkSttlmDt: nextWorkingDate from releaseDateMsg = " + nextWorkingDate);		
		}
	}else {
		nextWorkingDate = nextWorkingDateHdr;
		logger.info("setNewIntrBkSttlmDt: nextWorkingDate from nextWorkingDateHdr = " + nextWorkingDate);		
	}

	newPriorityDate = nextWorkingDate;
	logger.info("setNewIntrBkSttlmDt: PLCN_nextWorkingDate = " + nextWorkingDate);

	//releaseDateMsg = releaseDateMsg.substring(0, 4) + "-" + releaseDateMsg.substring(4, 6) + "-"  + releaseDateMsg.substring(6, 8);
	nextWorkingDate = nextWorkingDate.substring(0, 4) + "-" + nextWorkingDate.substring(4, 6) + "-"  + nextWorkingDate.substring(6, 8);
	logger.info("setNewIntrBkSttlmDt: nextWorkingDate = " + nextWorkingDate);

	var clrgIdOffsetDay = getHeader(map, "PLCN_clrgIdOffsetDay");
	logger.info("setNewIntrBkSttlmDt: clrgIdOffsetDay = " + clrgIdOffsetDay); //CCYYMMDD

	var txnComments = getHeader(map, 'PLCN_txnComments');
	logger.info("setNewIntrBkSttlmDt: txnComments = " + txnComments);

    var startTimeFlag = getHeader(map, "PLCN_startTimeFlag");
    logger.info("setNewIntrBkSttlmDt: startTimeFlag = " + startTimeFlag);

	//when the value date is holiday or if the payment is processed before start or after cut off update the new value date in message
	if((startTimeFlag =! "Y" && isPatternPresent(txnComments, "6011")) || isPatternPresent(txnComments, "6012") || (autoRepairFlag == "YES" && isPatternPresent(txnComments, "9506"))) {
		path = getValueDatePath(exchange);
		logger.info("setNewIntrBkSttlmDt: setting new date in message = " + nextWorkingDate);
		setValueInPath(Document, path, nextWorkingDate);
		setCommentsForTransaction("00", "9011", map);
		setHeader(map, "PLCN_newPriorityDate", newPriorityDate);
	}

	var setNewPriorityDate = getHeader(map, "PLCN_setNewPriorityDate");
	logger.info("setNewIntrBkSttlmDt: setNewPriorityDate = " + setNewPriorityDate);

	if(autoRepairFlag == "YES" && setNewPriorityDate == "true") {
		path = getValueDatePath(exchange);
		logger.info("setNewIntrBkSttlmDt: Auto repaired setting new date in message = " + nextWorkingDate);
		setValueInPath(Document, path, nextWorkingDate);
		setCommentsForTransaction("00", "9011", map);
		setHeader(map, "PLCN_newPriorityDate", newPriorityDate);

		var todaysDate = getDate();
		logger.info("setNewIntrBkSttlmDt: todaysDate = " + todaysDate);

		if(releaseDateMsg == todaysDate) {
			setHeader(map, "PLCN_schedulingReq", "false");
		}
	}

	/*if(parseInt(clrgIdOffsetDay) > 0) {
		return;
	}

	path = getValueDatePath(exchange);
	setValueInPath(Document, path, releaseDateMsg);
	setCommentsForTransaction("00", "9011", map);*/
}

function getValueDatePath(exchange) {
	var path;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var body = inMsg.getBody(java.lang.String.class);

	if(isPatternPresent(body, "<PmtRtr>")) {
		path = "/Document/PmtRtr/TxInf/IntrBkSttlmDt";
	}else if(isPatternPresent(body, "<FIToFICstmrCdtTrf>")) {
		path = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmDt"
	}else if(isPatternPresent(body, "<FICdtTrf>")) {
		path = "/Document/FICdtTrf/CdtTrfTxInf/IntrBkSttlmDt";
	}else if(isPatternPresent(body, "<NtfctnToRcv>")) {
		path = "/Document/NtfctnToRcv/Ntfctn/XpctdValDt";
	}

	return path;	
}

function setCustom24(map, releaseDate, releaseTime) {
	var releaseDateTime;
	var todaysDate;

	logger.info("In setCustom24");

	logger.info("setCustom24: releaseDate = " + releaseDate);
	logger.info("setCustom24: releaseTime = " + releaseTime);

	todaysDate = getDate();
	logger.info("setCustom24: todaysDate = " + todaysDate);

	var releaseDateMsg = getHeader(map, "PLCN_releaseDateMsg");
	logger.info("setCustom24: releaseDateMsg = " + releaseDateMsg);

    var clrgIdOffsetDay = getHeader(map, "PLCN_clrgIdOffsetDay");
    logger.info("setCustom24: clrgIdOffsetDay = " + clrgIdOffsetDay);

    var orgnlPriorityDate = getHeader(map, "PLCN_orgnlPriorityDate");
    logger.info("setCustom24: orgnlPriorityDate = " + orgnlPriorityDate);

    var startTimeFlag = getHeader(map, "PLCN_startTimeFlag");
    logger.info("setCustom24: startTimeFlag = " + startTimeFlag);

    var txnComments = getHeader(map, 'PLCN_txnComments');
    logger.info("setCustom24: txnComments = " + txnComments);

    PLCN_queueId = getHeader(map, "PLCN_queueId");
    logger.info("setCustom24: PLCN_prevQueueId = " + PLCN_prevQueueId);

	var schFlag = getHeader(map, "PLCN_schedulingReq");
	logger.info("setCustom24: schFlag = " + schFlag);
	logger.info("setCustom24: typeof schFlag = " + typeof schFlag);

	schFlag = schFlag.toString();
	logger.info("setCustom24: typeof schFlag = " + typeof schFlag);	
    
    var mode = 	getHeader(map, "PLCN_mode");
   	logger.info("setCustom24: mode = " + mode);

   	var autoRepairFlag = memTblGetTableValue(map, "USER_CONFIG_MAP", "AUTOREPAIR_VALUEDATE_"+mode);
   	logger.info("setCustom24: autoRepairFlag = " + autoRepairFlag);

	releaseTime = releaseTime.toString();
	logger.info("setCustom24: releaseTime.length = " + releaseTime.length);

	if(releaseTime.length == 5) {
		releaseTime = "0" + releaseTime;
	}

	logger.info("setCustom24: releaseTime.length = " + releaseTime.length);

	if(releaseTime.length == 6) {
		releaseTime = releaseTime.substring(0, 2) + ":" + releaseTime.substring(2, 4) + ":" + releaseTime.substring(4, 6);
	}

	logger.info("setCustom24: releaseTime = " + releaseTime);

	releaseDateTime = (releaseDate.concat(" ")).concat(releaseTime);
	logger.info("setCustom24: releaseDateTime = " + releaseDateTime);

	if(schFlag != "true") {
		return;
	}else if(autoRepairFlag == "YES") {
		setHeader(map, "PLCN_custom24", releaseDateTime);
	}
    
	if(releaseDateMsg <= todaysDate || orgnlPriorityDate <= todaysDate) {
		logger.info("setCustom24: In 1st if");
		if(parseInt(clrgIdOffsetDay) > 0 || releaseDateMsg < todaysDate) {

			if((releaseDateMsg == todaysDate || orgnlPriorityDate == todaysDate) && parseInt(clrgIdOffsetDay) > 0) {
				setCommentsForTransaction("00", "9506", map);
				setHeader(map, "PLCN_repairReq", "true");
				return;
			}else {
				setCommentsForTransaction("00", "9506", map);
				setHeader(map, "PLCN_repairReq", "true");
				return;
			}
		}else if(parseInt(clrgIdOffsetDay) == 0) {

			if(startTimeFlag != "Y" && (isPatternPresent(txnComments, "6011") || isPatternPresent(txnComments, "6012") || isPatternPresent(txnComments, "6013"))) {
				
				if(schFlag == "false" && releaseDateMsg == todaysDate) {
					return;
				}else {
					if(isPatternPresent(txnComments, "6012") && isPatternPresent(txnComments, "9500")) {
						if(isPatternPresent(txnComments, "6013")) {
							txnComments = removePattern(txnComments, ":A00:00-6013");
							setHeader(map, "PLCN_txnComments", txnComments);
						}
						setHeader(map, "PLCN_repairReq", "true");
						return;						
					}
					setCommentsForTransaction("00", "9506", map);
					setHeader(map, "PLCN_repairReq", "true");
					return;
				}
			}
		}
	}else if(orgnlPriorityDate - releaseDateMsg/* - todaysDate*/ == parseInt(clrgIdOffsetDay)) {
		logger.info("setCustom24: In 2nd if");		
		var clrgId = getHeader(map, "PLCN_clearingId");
		logger.info("setCustom24: clrgId = " + clrgId);
		
		var holidayFlag = checkHoliday(clrgId, releaseDateMsg, map);
		logger.info("setCustom24: holidayFlag = " + holidayFlag);

		if(holidayFlag != 1) {
			var holidayActVaDate = checkHolidayInstrcn(clrgId, releaseDateMsg, map);
			logger.info("setCustom24: holidayActVaDate = " + holidayActVaDate);

			//var actualValDateCnvrt = convertDateFormat(todaysDate, "CCYYMMDD", "DDMMCCYY");
			var tmpDateW = convertDateFormat(releaseDateMsg, "CCYYMMDD", "MMDDCCYY");

			var actValDay = getWeekday(tmpDateW);
			logger.info("setCustom24: actValDay = " + actValDay);

			if(holidayActVaDate == 0) {
				if((actValDay == "Thursday" && getHeader(map, "PLCN_clThursday") == "Y") || (actValDay == "Friday" && getHeader(map, "PLCN_clFriday") == "Y") || (actValDay == "Saturday" && getHeader(map, "PLCN_clSaturday") == "Y") || (actValDay == "Sunday" && getHeader(map, "PLCN_clSunday") == "Y")) {
					setCommentsForTransaction("00", "9506", map);
					setHeader(map, "PLCN_repairReq", "true");
					logger.info("setCustom24: holiday");
					return;
				}else if(startTimeFlag != "Y" && isPatternPresent(txnComments, "6011") && releaseDateMsg == todaysDate) {
					setCommentsForTransaction("00", "9506", map);
					setHeader(map, "PLCN_repairReq", "true");
					logger.info("setCustom24: after cutoff time");
					return;
				}
			}
		}else if(holidayFlag == 1) {
			setCommentsForTransaction("00", "9506", map);
			setHeader(map, "PLCN_repairReq", "true");
			return;			
		}
	}else if(orgnlPriorityDate == releaseDateMsg && parseInt(clrgIdOffsetDay) > 0) {
		logger.info("setCustom24: In 3rd if");
		if(isPatternPresent(txnComments, "6011")) {
			setCommentsForTransaction("00", "9506", map);
			setHeader(map, "PLCN_repairReq", "true");
			//var newComments = removePattern(txnComments, ":A00:00-6011");
			//logger.info("setSchedulingHeader: newComments = " + newComments);
			//setHeader(map, "PLCN_txnComments", newComments);	
		}
	}

	logger.info("setCustom24: PLCN_custom24 = " + releaseDateTime);
	setHeader(map, "PLCN_custom24", releaseDateTime);	
}

function checkClgsysTime(time) {
	var firstChar;
	var validTime;
	var tempTime;
	var hh;
	var mm;
	var ss;

	logger.info("checkClgsysTime: time = " + time);

	if(time.length == 5) {
		firstChar = time.substring(0, 1);
		logger.info("checkClgsysTime: hour = " + firstChar);

		if(firstChar == "0") {
			logger.info("checkClgsysTime: Invalid time, new time is 000000");
			return "000000";
		}

	}else if(time.length == 6) {
		hh = time.substring(0, 2);
		logger.info("checkClgsysTime: hh = " + hh);

		mm = time.substring(2, 4);
		logger.info("checkClgsysTime: mm = " + mm);

		ss = time.substring(4, 6);
		logger.info("checkClgsysTime: ss = " + ss);

		if(parseInt(hh) > 23 || parseInt(mm) > 59 || parseInt(ss) > 59)	{
			logger.info("checkClgsysTime: Invalid, time new time is 000000");
			return "000000";
		}
	}else {
		logger.info("checkClgsysTime: Invalid time, new time is 000000");
		return "000000";
	}

	return time;
}