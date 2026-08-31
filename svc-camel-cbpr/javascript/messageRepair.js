function messageRepair(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var priorityDate;
	var currentDate;
	var pastDateFlag = "false";
	var ibanBicConsistent;
	var mode;
	var autoRepairFlag;
	
	logger.info("In messageRepair");

	var body =  getHeader(map, "ACEDB_messageBody");
	logger.info("messageRepair: Body from header= " + body);

	if(body) {
		inMsg.setBody(body);
	}

    institutionId = getHeader(map, "PLCN_institutionId");
    logger.info("messageRepair: institutionId = " + institutionId);

    productCode = getHeader(map, "PLCN_productCode");
    logger.info("messageRepair: productCode = " + productCode);
    
    key = institutionId + "."+ "PROCESSING_STAGES.REPAIR" + "." + "PRODUCTS";
    logger.info("messageRepair: key = " + key);

    value = memTblGetTableValue(map, "INST_PARAM", key);
    logger.info("messageRepair: value = " + value);

    mode = 	getHeader(map, "PLCN_mode");
   	logger.info("messageRepair: mode = " + mode);

   	autoRepairFlag = memTblGetTableValue(map, "USER_CONFIG_MAP", "AUTOREPAIR_VALUEDATE_"+mode);
   	logger.info("messageRepair: autoRepairFlag = " + autoRepairFlag);

    if(productCode) {
        if(isPatternPresent(value, productCode)) {
			priorityDate = getHeader(map,"PLCN_priorityDate");
			logger.info("messageRepair: priorityDate = " + priorityDate);

			currentDate = getDate();
			logger.info("messageRepair: currentDate = " + currentDate);

			if(priorityDate < currentDate) {
				if(autoRepairFlag != "YES") {
					pastDateFlag = "true";
				}
				
				var path = getValueDatePath(exchange);
				logger.info("messageRepair: path = " + path);
				var newPriorityDate = currentDate.substring(0, 4) + "-" + currentDate.substring(4, 6) + "-"  + currentDate.substring(6, 8);
				logger.info("messageRepair: newPriorityDate = " + newPriorityDate);				
				Document = setValueInPath(Document, path, newPriorityDate);
				logger.info("messageRepair: typeof Document = " + typeof Document);
				setCommentsForTransaction("32", "9011", map);
				setCommentsForTransaction("00", "9506", map);
				setHeader(map, "PLCN_newPriorityDate", currentDate);
			}else {
				pastDateFlag = "false";
			}
        }else {
        	pastDateFlag = "false";
            setHeader(map, "PLCN_repairReq", "false");
        }
    }

	setHeader(map, "PLCN_pastDateFlag", pastDateFlag);
	logger.info("messageRepair: pastDateFlag = " + pastDateFlag);
}

function getValueDatePath(exchange) {
	var path;
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var body = inMsg.getBody(java.lang.String.class);
	logger.info("getValueDatePath: Body = " + body);

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