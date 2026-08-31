function messageRepair(exchange) {
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();
	var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);
	var priorityDate;
	var currentDate;
	var pastDateFlag;
	var ibanBicConsistent;
	var msgFamily;
	var priorityDatePath;
	
	logger.info("In messageRepair");

    institutionId = getHeader(map, "PLCN_institutionId");
    logger.info("messageRepair: institutionId = " + institutionId);

    productCode = getHeader(map, "PLCN_productCode");
    logger.info("messageRepair: productCode = " + productCode);

   	var autoRepairFlag = memTblGetTableValue(map, "USER_CONFIG_MAP", "AUTOREPAIR_VALUEDATE_MANUAL");
   	logger.info("messageRepair: autoRepairFlag = " + autoRepairFlag);

    if(!productCode) {
    	var msgType = getHeader(map, "PaymentType");
    	msgType = msgType.toLowerCase();
    	logger.info("messageRepair: PaymentType = " + msgType);

    	if(isPatternPresent(msgType, "target2")) {
    		msgFamily = "target2";
    	}else if(isPatternPresent(msgType, "cbpr")) {
    		msgFamily = "cbpr";
    	}

    	msgType = removePattern(msgType, msgFamily);
    	logger.info("messageRepair: msgType = " + msgType);

    	setHeader(map, "PLCN_msgType", msgType);

    	productCode = drveNibcProductCode(exchange);
    	logger.info("messageRepair: productCode from drveNibcProductCode = " + productCode);
    }
    
    key = institutionId + "."+ "PROCESSING_STAGES.REPAIR" + "." + "PRODUCTS";
    logger.info("messageRepair: key = " + key);

    value = memTblGetTableValue(map, "INST_PARAM", key);
    logger.info("messageRepair: value = " + value);

    if(productCode) {
        if(isPatternPresent(value, productCode)) {
			priorityDate = getHeader(map,"PLCN_priorityDate");
			logger.info("messageRepair: priorityDate = " + priorityDate);

			/*if(!priorityDate) {

				if(msgType == "pacs.004.001.09") {
					priorityDatePath = "/Document/PmtRtr/TxInf/IntrBkSttlmDt";
				}else if(msgType == "pacs.008.001.08") {
					priorityDatePath = "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmDt";
				}else if(msgType == "pacs.009.001.08") {
					priorityDatePath = "/Document/FICdtTrf/CdtTrfTxInf/IntrBkSttlmDt";
				}else if(msgType == "camt.057.001.06") {
					priorityDatePath = "/Document/NtfctnToRcv/Ntfctn/Itm/XpctdValDt";
				}
			}

			priorityDate = getValueFromPath(Document, priorityDatePath);
			priorityDate = replaceAllPattern(priorityDate, "-", "");
			logger.info("messageRepair: priorityDatePath = " + priorityDatePath);
			logger.info("messageRepair: priorityDate from priorityDatePath = " + priorityDate);*/

			currentDate = getDate();
			logger.info("messageRepair: currentDate = " + currentDate);

			if(priorityDate < currentDate) {
				if(autoRepairFlag != "YES") {
					pastDateFlag = "true";
				}
				setCommentsForTransaction("00", "9506", map);
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

function drveNibcProductCode(exchange) {
	var mode;
	var msgType;
	var productCode;
	var key;
	
	var inMsg = exchange.getIn();
	var map = inMsg.getHeaders();

	logger.info("In drveNibcProductCode");

	mode = getHeader(map, "PLCN_msgModeIn");
	logger.info("drveNibcProductCode: mode = " + mode);
	msgType = getHeader(map, "PLCN_msgType");
	logger.info("drveNibcProductCode: msgType = " + msgType);

	if(mode == "MANUAL" || mode == "UPLOAD") {
		key = mode + "-" + msgType;
		logger.info("drveNibcProductCode: key = " + key);

		productCode = memTblGetTableValue(map, "PPAY_PRODUCT_CODE", key);
		productCode = productCode.trim();
		logger.info("drveNibcProductCode: productCode = " + productCode);
	}

	if(productCode) {
		setHeader(map, "PLCN_productCode", productCode);
		return productCode;
	}
}